<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Event;
use App\Models\Position;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use App\Models\Voter; // Add this import

class VoteController extends Controller
{
    public function index()
    {
        $voter = Auth::guard('voter')->user();

        // If the user is somehow logged in but inactive, log them out
        if ($voter && !$voter->is_active) {
            Auth::guard('voter')->logout();
            return redirect()->route('voter.login')->withErrors(['username' => 'Your account is inactive.']);
        }

        $events = Event::query()
            ->where('is_active', true)
            ->with([
                'positions' => function ($q) use ($voter) {
                    $q->where(function ($query) use ($voter) {
                        $query->whereDoesntHave('yearLevels');
                        if ($voter) {
                            $query->orWhereHas('yearLevels', function ($subQuery) use ($voter) {
                                $subQuery->where('year_levels.id', $voter->year_level_id);
                            });
                        }
                    })->orderBy('id', 'asc');
                },
                'positions.candidates.candidatePhotos',
                'positions.candidates.yearLevel',
                'positions.candidates.yearSection',
                'positions.candidates.partylist',
            ])
            ->get();

        // Check if voter has already voted for any active event
        if ($voter) {
            foreach ($events as $event) {
                $hasVoted = Vote::where('voter_id', $voter->id)
                    ->where('event_id', $event->id)
                    ->exists();

                if ($hasVoted) {
                    Auth::guard('voter')->logout();
                    return redirect()->route('voter.login')->withErrors(['username' => 'You have already voted for this event.']);
                }
            }
        }

        return Inertia::render('Vote/index', [
            'events' => $events,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'votes' => 'required|array',
            'votes.*' => 'array', // position_id => [candidate_ids]
            'votes.*.*' => 'exists:candidates,id',
        ]);

        $currentVoterId = Auth::guard('voter')->id();

        if (!$currentVoterId) {
            abort(401, 'You must be logged in as a voter to vote.');
        }

        // PRE-FETCHING: Get all IDs to minimize database queries inside the loop
        $positionIds = array_keys($validated['votes']);
        $candidateIds = \Illuminate\Support\Arr::flatten($validated['votes']);

        // Eager load yearLevels to avoid N+1 queries during grade level check
        $positions = Position::whereIn('id', $positionIds)
            ->with('yearLevels')
            ->get()
            ->keyBy('id');

        $candidates = Candidate::whereIn('id', $candidateIds)
            ->get()
            ->keyBy('id');

        DB::transaction(function () use ($validated, $currentVoterId, $request, $positions, $candidates) {
            // LOCKING: Lock the voter row for update to prevent race conditions
            $voter = Voter::where('id', $currentVoterId)->lockForUpdate()->first();

            // RE-CHECK: Ensure voter is still active after acquiring lock
            if (!$voter || !$voter->is_active) {
                // If we get here, it means another request just finished voting for this user
                // or the user was deactivated in the meantime.
                abort(403, 'You have already voted or your account is inactive.');
            }

            // Pre-fetch existing votes for this voter to avoid queries inside loop
            // We only need to check if they voted for any of the submitted position IDs
            $existingVotesPositionIds = Vote::where('voter_id', $voter->id)
                ->whereIn('position_id', array_keys($validated['votes']))
                ->pluck('position_id')
                ->toArray();

            $voteData = [];

            foreach ($validated['votes'] as $positionId => $candidateIds) {
                // Skip if no candidates selected for this position
                if (empty($candidateIds)) {
                    continue;
                }

                // Use pre-fetched position
                $position = $positions->get($positionId);
                if (!$position) {
                    abort(404, "Position ID {$positionId} not found.");
                }

                // SECURITY CHECK: Ensure the position belongs to the voter's assigned event
                if ($voter->event_id != $position->event_id) {
                    abort(403, "You are not authorized to vote for positions in this event.");
                }

                // SECURITY CHECK: Grade Level Restriction
                // Use the loaded collection instead of query builder to avoid DB hit
                $allowedYearLevels = $position->yearLevels->pluck('id')->toArray();
                if (!empty($allowedYearLevels) && !in_array($voter->year_level_id, $allowedYearLevels)) {
                    abort(403, "You are not authorized to vote for position: {$position->name} due to grade level restrictions.");
                }

                // Check max votes
                if (count($candidateIds) > $position->max_votes) {
                    abort(422, "You selected too many candidates for position: {$position->name}");
                }

                // Check if already voted for this position using pre-fetched data
                if (in_array($positionId, $existingVotesPositionIds)) {
                    abort(403, "You have already voted for position: {$position->name}");
                }

                foreach ($candidateIds as $candidateId) {
                    // Use pre-fetched candidate
                    $candidate = $candidates->get($candidateId);

                    if (!$candidate) {
                        abort(404, "Candidate ID {$candidateId} not found.");
                    }

                    // Verify candidate belongs to position
                    if ($candidate->position_id != $positionId) {
                        abort(422, "Candidate {$candidate->name} does not belong to position {$position->name}");
                    }

                    $voteData[] = [
                        'voter_id' => $voter->id,
                        'candidate_id' => $candidateId,
                        'position_id' => $positionId,
                        'event_id' => $position->event_id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            // Bulk insert for performance
            if (!empty($voteData)) {
                Vote::insert($voteData);
            }

            // Create Audit Log Entry
            \App\Models\VoteActivityLog::create([
                'voter_id' => $voter->id,
                'event_id' => $voter->event_id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->header('User-Agent'),
            ]);

            // Deactivate the voter account
            // We use the model instance since we already have it locked
            $voter->is_active = false;
            $voter->save();
        });

        // Logout the voter
        Auth::guard('voter')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('voter.login')->with('success', 'Votes submitted successfully! You have been logged out.');
    }
}
