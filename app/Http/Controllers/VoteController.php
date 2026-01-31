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

        DB::transaction(function () use ($validated, $currentVoterId, $request) {
            // LOCKING: Lock the voter row for update to prevent race conditions
            $voter = Voter::where('id', $currentVoterId)->lockForUpdate()->first();

            // RE-CHECK: Ensure voter is still active after acquiring lock
            if (!$voter || !$voter->is_active) {
                // If we get here, it means another request just finished voting for this user
                // or the user was deactivated in the meantime.
                abort(403, 'You have already voted or your account is inactive.');
            }

            foreach ($validated['votes'] as $positionId => $candidateIds) {
                // Skip if no candidates selected for this position
                if (empty($candidateIds)) {
                    continue;
                }

                $position = Position::findOrFail($positionId);

                // SECURITY CHECK: Ensure the position belongs to the voter's assigned event
                if ($voter->event_id != $position->event_id) {
                    abort(403, "You are not authorized to vote for positions in this event.");
                }

                // SECURITY CHECK: Grade Level Restriction
                $allowedYearLevels = $position->yearLevels()->pluck('year_levels.id')->toArray();
                if (!empty($allowedYearLevels) && !in_array($voter->year_level_id, $allowedYearLevels)) {
                    abort(403, "You are not authorized to vote for position: {$position->name} due to grade level restrictions.");
                }

                // Check max votes
                if (count($candidateIds) > $position->max_votes) {
                    abort(422, "You selected too many candidates for position: {$position->name}");
                }

                // Check if already voted for this position
                // Note: Since we locked the voter and verified is_active is true, 
                // and we set is_active=false at the end, this check is technically redundant 
                // for preventing double voting, but good for data integrity sanity check.
                $existingVotes = Vote::where('voter_id', $voter->id)
                    ->where('position_id', $positionId)
                    ->exists();

                if ($existingVotes) {
                    abort(403, "You have already voted for position: {$position->name}");
                }

                $voteData = [];
                foreach ($candidateIds as $candidateId) {
                    // Verify candidate belongs to position
                    $candidate = Candidate::findOrFail($candidateId);
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

                // Bulk insert for performance
                if (!empty($voteData)) {
                    Vote::insert($voteData);
                }
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
