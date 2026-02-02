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
            'votes.*' => 'array',
            'votes.*.*' => 'exists:candidates,id',
        ]);

        $currentVoterId = Auth::guard('voter')->id();

        if (!$currentVoterId) {
            abort(401, 'You must be logged in as a voter to vote.');
        }


        $positionIds = array_keys($validated['votes']);
        $candidateIds = \Illuminate\Support\Arr::flatten($validated['votes']);


        $positions = Position::whereIn('id', $positionIds)
            ->with('yearLevels')
            ->get()
            ->keyBy('id');

        $candidates = Candidate::whereIn('id', $candidateIds)
            ->get()
            ->keyBy('id');

        DB::transaction(function () use ($validated, $currentVoterId, $request, $positions, $candidates) {

            $voter = Voter::where('id', $currentVoterId)->lockForUpdate()->first();


            if (!$voter || !$voter->is_active) {

                abort(403, 'You have already voted or your account is inactive.');
            }


            $existingVotesPositionIds = Vote::where('voter_id', $voter->id)
                ->whereIn('position_id', array_keys($validated['votes']))
                ->pluck('position_id')
                ->toArray();

            $voteData = [];

            foreach ($validated['votes'] as $positionId => $candidateIds) {

                if (empty($candidateIds)) {
                    continue;
                }


                $position = $positions->get($positionId);
                if (!$position) {
                    abort(404, "Position ID {$positionId} not found.");
                }


                if ($voter->event_id != $position->event_id) {
                    abort(403, "You are not authorized to vote for positions in this event.");
                }


                $allowedYearLevels = $position->yearLevels->pluck('id')->toArray();
                if (!empty($allowedYearLevels) && !in_array($voter->year_level_id, $allowedYearLevels)) {
                    abort(403, "You are not authorized to vote for position: {$position->name} due to grade level restrictions.");
                }


                if (count($candidateIds) > $position->max_votes) {
                    abort(422, "You selected too many candidates for position: {$position->name}");
                }


                if (in_array($positionId, $existingVotesPositionIds)) {
                    abort(403, "You have already voted for position: {$position->name}");
                }

                foreach ($candidateIds as $candidateId) {

                    $candidate = $candidates->get($candidateId);

                    if (!$candidate) {
                        abort(404, "Candidate ID {$candidateId} not found.");
                    }


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


            if (!empty($voteData)) {
                Vote::insert($voteData);
            }


            \App\Models\VoteActivityLog::create([
                'voter_id' => $voter->id,
                'event_id' => $voter->event_id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->header('User-Agent'),
            ]);


            $voter->is_active = false;
            $voter->save();
        });


        return redirect()->route('vote.receipt');
    }

    public function receipt()
    {
        $voter = Auth::guard('voter')->user();


        if (!$voter) {
            return redirect()->route('voter.login');
        }


        $votes = Vote::where('voter_id', $voter->id)
            ->where('event_id', $voter->event_id)
            ->with(['candidate.position', 'candidate.partylist', 'candidate.candidatePhotos'])
            ->get();

        if ($votes->isEmpty()) {

            if (!$voter->is_active) {
                Auth::guard('voter')->logout();
                return redirect()->route('voter.login')->withErrors(['username' => 'Your account is inactive.']);
            }

            return redirect()->route('vote.index');
        }


        $event = Event::find($voter->event_id);

        return Inertia::render('Vote/Receipt', [
            'votes' => $votes,
            'event' => $event,
            'voter' => $voter
        ]);
    }
}
