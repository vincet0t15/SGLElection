<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Event;
use App\Models\Partylist;
use App\Models\Position;
use App\Models\Vote;
use App\Models\VoteActivityLog;
use App\Models\Voter;
use App\Models\YearLevel;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $activeEvent = Event::where('is_active', true)->where('is_archived', false)->first();

        $stats = [
            'total_voters' => Voter::whereHas('event', fn($q) => $q->where('is_archived', false))->count(),
            'total_candidates' => Candidate::whereHas('event', fn($q) => $q->where('is_archived', false))->count(),
            'total_partylists' => Partylist::whereHas('event', fn($q) => $q->where('is_archived', false))->count(),
            'total_positions' => Position::whereHas('event', fn($q) => $q->where('is_archived', false))->count(),
            'active_event' => $activeEvent,
            'votes_cast' => 0,
            'turnout_percentage' => 0,
        ];

        if ($activeEvent) {
            $votesCast = Vote::where('event_id', $activeEvent->id)
                ->distinct('voter_id')
                ->count('voter_id');

            $stats['votes_cast'] = $votesCast;

            if ($stats['total_voters'] > 0) {
                $stats['turnout_percentage'] = round(($votesCast / $stats['total_voters']) * 100, 1);
            }
        }


        $winners = [];
        $eventForWinners = $activeEvent ?? Event::latest()->first();

        if ($eventForWinners) {

            $isEnded = !$eventForWinners->is_active || now()->greaterThan($eventForWinners->dateTime_end);

            if ($isEnded) {
                $winners = $eventForWinners->positions()
                    ->orderBy('id')
                    ->with(['candidates' => function ($query) use ($eventForWinners) {
                        $query->with(['candidatePhotos', 'voter.yearLevel', 'voter.yearSection'])
                            ->withCount(['votes' => function ($q) use ($eventForWinners) {
                                $q->where('event_id', $eventForWinners->id);
                            }])
                            ->orderBy('votes_count', 'desc');
                    }])
                    ->get()
                    ->map(function ($position) {

                        $totalVotes = $position->candidates->sum('votes_count');


                        $winnersList = $position->candidates
                            ->filter(function ($candidate) {
                                return $candidate->votes_count > 0;
                            })
                            ->take($position->max_votes)
                            ->values();

                        $position->setRelation('candidates', $winnersList);


                        $position->setAttribute('total_votes', $totalVotes);

                        return $position;
                    });
            }
        }


        $turnoutByYearLevel = YearLevel::withCount([
            'voters as total_voters',
            'voters as voted_voters' => function ($query) use ($activeEvent) {
                if ($activeEvent) {
                    $query->whereHas('votes', function ($q) use ($activeEvent) {
                        $q->where('event_id', $activeEvent->id);
                    });
                } else {
                    $query->whereRaw('0 = 1');
                }
            }
        ])->get()->map(function ($yl) {
            return [
                'name' => $yl->name,
                'voted' => $yl->voted_voters,
                'not_voted' => $yl->total_voters - $yl->voted_voters,
                'total' => $yl->total_voters,
            ];
        });

        $recentActivity = [];
        if ($activeEvent) {
            $recentActivity = VoteActivityLog::where('event_id', $activeEvent->id)
                ->with('voter')
                ->latest()
                ->take(5)
                ->get();
        }


        $systemHealth = [
            'database' => false,
            'database_latency' => 0,
            'php_version' => phpversion(),
            'server_os' => php_uname('s') . ' ' . php_uname('r'),
            'disk_free' => disk_free_space(base_path()),
            'disk_total' => disk_total_space(base_path()),
            'memory_usage' => memory_get_usage(true),
        ];

        try {
            $start = microtime(true);
            DB::connection()->getPdo();
            $end = microtime(true);
            $systemHealth['database'] = true;
            $systemHealth['database_latency'] = round(($end - $start) * 1000, 2); // ms
        } catch (\Exception $e) {
            $systemHealth['database'] = false;
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'winners' => $winners,
            'turnoutByYearLevel' => $turnoutByYearLevel,
            'recentActivity' => $recentActivity,
            'systemHealth' => $systemHealth,
        ]);
    }
}
