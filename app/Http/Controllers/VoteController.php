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

class VoteController extends Controller
{
    public function index()
    {
        $events = Event::query()
            ->where('is_active', true)
            ->with([
                'positions' => function ($q) {
                    $q->orderBy('id', 'asc');
                },
                'positions.candidates.candidatePhotos',
                'positions.candidates.yearLevel',
                'positions.candidates.yearSection',
            ])
            ->get();

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

        $voter = Auth::guard('voter')->user();

        if (!$voter) {
            abort(401, 'You must be logged in as a voter to vote.');
        }

        DB::transaction(function () use ($validated, $voter) {
            foreach ($validated['votes'] as $positionId => $candidateIds) {
                // Skip if no candidates selected for this position
                if (empty($candidateIds)) {
                    continue;
                }

                $position = Position::findOrFail($positionId);

                // Check max votes
                if (count($candidateIds) > $position->max_votes) {
                    abort(422, "You selected too many candidates for position: {$position->name}");
                }

                // Check if already voted for this position
                $existingVotes = Vote::where('voter_id', $voter->id)
                    ->where('position_id', $positionId)
                    ->exists();

                if ($existingVotes) {
                    abort(403, "You have already voted for position: {$position->name}");
                }

                foreach ($candidateIds as $candidateId) {
                    // Verify candidate belongs to position
                    $candidate = Candidate::findOrFail($candidateId);
                    if ($candidate->position_id != $positionId) {
                        abort(422, "Candidate {$candidate->name} does not belong to position {$position->name}");
                    }

                    Vote::create([
                        'voter_id' => $voter->id,
                        'candidate_id' => $candidateId,
                        'position_id' => $positionId,
                        'event_id' => $position->event_id,
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', 'Votes submitted successfully!');
    }
}
