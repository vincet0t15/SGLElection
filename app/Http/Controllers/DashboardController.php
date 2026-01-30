<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Event;
use App\Models\Partylist;
use App\Models\Position;
use App\Models\Vote;
use App\Models\Voter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $activeEvent = Event::where('is_active', true)->first();

        $stats = [
            'total_voters' => Voter::count(),
            'total_candidates' => Candidate::count(),
            'total_partylists' => Partylist::count(),
            'total_positions' => Position::count(),
            'active_event' => $activeEvent,
            'votes_cast' => 0,
            'turnout_percentage' => 0,
        ];

        if ($activeEvent) {
            $votesCast = Vote::where('event_id', $activeEvent->id)
                ->distinct('voter_id')
                ->count('voter_id');

            $stats['votes_cast'] = $votesCast;

            // Calculate turnout based on total voters (or voters assigned to event if applicable)
            // Assuming global voter pool for now based on simplicity
            if ($stats['total_voters'] > 0) {
                $stats['turnout_percentage'] = round(($votesCast / $stats['total_voters']) * 100, 1);
            }
        }

        // Logic for Winners
        $winners = [];
        $eventForWinners = $activeEvent ?? Event::latest()->first();

        if ($eventForWinners) {
            // Check if event is ended (either inactive or time passed)
            $isEnded = !$eventForWinners->is_active || now()->greaterThan($eventForWinners->dateTime_end);

            if ($isEnded) {
                $winners = $eventForWinners->positions()
                    ->orderBy('id')
                    ->with(['candidates' => function ($query) use ($eventForWinners) {
                        $query->with(['candidatePhotos', 'yearLevel', 'yearSection'])
                            ->withCount(['votes' => function ($q) use ($eventForWinners) {
                                $q->where('event_id', $eventForWinners->id);
                            }])
                            ->orderBy('votes_count', 'desc');
                    }])
                    ->get()
                    ->map(function ($position) {
                        // Calculate total votes for the position BEFORE filtering
                        $totalVotes = $position->candidates->sum('votes_count');

                        // We only need the winners (with at least 1 vote)
                        $winnersList = $position->candidates
                            ->filter(function ($candidate) {
                                return $candidate->votes_count > 0;
                            })
                            ->take($position->max_votes)
                            ->values(); // Ensure array keys are reset for JSON serialization

                        $position->setRelation('candidates', $winnersList);

                        // Explicitly set total_votes attribute and append it to serialization
                        $position->setAttribute('total_votes', $totalVotes);

                        return $position;
                    });
            }
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'winners' => $winners
        ]);
    }
}
