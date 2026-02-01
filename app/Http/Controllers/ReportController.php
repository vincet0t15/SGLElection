<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Signatory;
use App\Models\SystemSetting;
use App\Models\Voter;
use App\Models\Vote;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\VoterReceiptExport;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index()
    {
        $events = Event::orderBy('created_at', 'desc')->get();

        return Inertia::render('Reports/Index', [
            'events' => $events
        ]);
    }

    public function show(Request $request, Event $event)
    {
        $positions = $event->positions()
            ->orderBy('id')
            ->with(['candidates' => function ($query) use ($event) {
                $query->with(['candidatePhotos', 'yearLevel', 'yearSection', 'partylist'])
                    ->withCount(['votes' => function ($q) use ($event) {
                        $q->where('event_id', $event->id);
                    }])
                    ->orderBy('votes_count', 'desc')
                    ->orderBy('is_tie_breaker_winner', 'desc');
            }])
            ->get();


        $totalVoters = \App\Models\Vote::where('event_id', $event->id)
            ->distinct('voter_id')
            ->count();


        $votersQuery = \App\Models\Voter::where('event_id', $event->id);

        if ($request->search) {
            $votersQuery->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('username', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->status === 'voted') {
            $votersQuery->whereHas('votes', function ($q) use ($event) {
                $q->where('event_id', $event->id);
            });
        } elseif ($request->status === 'not_voted') {
            $votersQuery->whereDoesntHave('votes', function ($q) use ($event) {
                $q->where('event_id', $event->id);
            });
        }

        $voters = $votersQuery->withExists(['votes as has_voted' => function ($q) use ($event) {
            $q->where('event_id', $event->id);
        }])
            ->paginate(10)
            ->withQueryString();


        $totalAssignedVoters = \App\Models\Voter::where('event_id', $event->id)->count();

        return Inertia::render('Reports/Show', [
            'event' => $event,
            'positions' => $positions,
            'stats' => [
                'total_voters' => $totalVoters,
                'total_assigned_voters' => $totalAssignedVoters,
                'voted_count' => $totalVoters
            ],
            'voters' => $voters,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function print(Request $request, Event $event)
    {
        $positions = $event->positions()
            ->orderBy('id')
            ->with(['candidates' => function ($query) use ($event) {
                $query->with(['candidatePhotos', 'yearLevel', 'yearSection', 'partylist'])
                    ->withCount(['votes' => function ($q) use ($event) {
                        $q->where('event_id', $event->id);
                    }])
                    ->orderBy('votes_count', 'desc')
                    ->orderBy('is_tie_breaker_winner', 'desc');
            }])
            ->get();

        if ($request->input('type') === 'winners') {
            $positions->transform(function ($position) {
                $position->setRelation('candidates', $position->candidates->take($position->max_votes));
                return $position;
            });
        }

        // Calculate actual voters (turnout)
        $actualVoters = \App\Models\Vote::where('event_id', $event->id)
            ->distinct('voter_id')
            ->count();

        // Calculate total registered voters for this event
        $registeredVoters = \App\Models\Voter::where('event_id', $event->id)->count();

        // Calculate total sections (precincts equivalent)
        $totalSections = \App\Models\Voter::where('event_id', $event->id)
            ->distinct('year_section_id')
            ->count('year_section_id');

        $signatories = Signatory::where('is_active', true)
            ->where(function ($query) use ($event) {
                $query->where('event_id', $event->id)
                    ->orWhereNull('event_id');
            })
            ->orderBy('order')
            ->get();

        return Inertia::render('Reports/Print', [
            'event' => $event,
            'positions' => $positions,
            'signatories' => $signatories,
            'type' => $request->input('type'),
            'stats' => [
                'actual_voters' => $actualVoters,
                'registered_voters' => $registeredVoters,
                'total_sections' => $totalSections,
                'turnout' => $registeredVoters > 0 ? round(($actualVoters / $registeredVoters) * 100, 2) : 0,
            ]
        ]);
    }

    public function exportPrintPdf(Request $request, Event $event)
    {
        $positions = $event->positions()
            ->orderBy('id')
            ->with(['candidates' => function ($query) use ($event) {
                $query->with(['candidatePhotos', 'yearLevel', 'yearSection', 'partylist'])
                    ->withCount(['votes' => function ($q) use ($event) {
                        $q->where('event_id', $event->id);
                    }])
                    ->orderBy('votes_count', 'desc')
                    ->orderBy('is_tie_breaker_winner', 'desc');
            }])
            ->get();

        if ($request->input('type') === 'winners') {
            $positions->transform(function ($position) {
                $position->setRelation('candidates', $position->candidates->take($position->max_votes));
                return $position;
            });
        }

        // Calculate actual voters (turnout)
        $actualVoters = \App\Models\Vote::where('event_id', $event->id)
            ->distinct('voter_id')
            ->count();

        // Calculate total registered voters for this event
        $registeredVoters = \App\Models\Voter::where('event_id', $event->id)->count();

        // Calculate total sections (precincts equivalent)
        $totalSections = \App\Models\Voter::where('event_id', $event->id)
            ->distinct('year_section_id')
            ->count('year_section_id');

        $signatories = Signatory::where('is_active', true)
            ->where(function ($query) use ($event) {
                $query->where('event_id', $event->id)
                    ->orWhereNull('event_id');
            })
            ->orderBy('order')
            ->get();

        $system_settings = SystemSetting::first();

        $pdf = Pdf::loadView('reports.print', [
            'event' => $event,
            'positions' => $positions,
            'signatories' => $signatories,
            'type' => $request->input('type'),
            'stats' => [
                'actual_voters' => $actualVoters,
                'registered_voters' => $registeredVoters,
                'total_sections' => $totalSections,
                'turnout' => $registeredVoters > 0 ? round(($actualVoters / $registeredVoters) * 100, 2) : 0,
            ],
            'system_settings' => $system_settings
        ]);

        $filename = $request->input('type') === 'winners' ? "official_winners_{$event->id}.pdf" : "election_results_{$event->id}.pdf";
        return $pdf->download($filename);
    }

    public function getVoterVotes(Event $event, Voter $voter)
    {
        $votes = \App\Models\Vote::where('event_id', $event->id)
            ->where('voter_id', $voter->id)
            ->with(['candidate.partylist', 'position'])
            ->get()
            ->map(function ($vote) {
                return [
                    'id' => $vote->id,
                    'position' => $vote->position->name,
                    'candidate' => $vote->candidate->name,
                    'partylist' => $vote->candidate->partylist ? $vote->candidate->partylist->name : 'Independent',
                    'candidate_photo' => $vote->candidate->candidatePhotos->first() ? $vote->candidate->candidatePhotos->first()->path : null,
                ];
            });

        return response()->json($votes);
    }

    public function analytics(Event $event)
    {
        // 1. Turnout by Section
        $sections = \App\Models\YearSection::withCount(['voters' => function ($query) use ($event) {
            $query->where('event_id', $event->id);
        }])
            ->get()
            ->map(function ($section) use ($event) {
                $votedCount = \App\Models\Vote::where('event_id', $event->id)
                    ->whereHas('voter', function ($q) use ($section) {
                        $q->where('year_section_id', $section->id);
                    })
                    ->distinct('voter_id')
                    ->count();

                return [
                    'name' => $section->name,
                    'total_voters' => $section->voters_count,
                    'voted_count' => $votedCount,
                    'turnout_percentage' => $section->voters_count > 0 ? round(($votedCount / $section->voters_count) * 100, 2) : 0,
                ];
            })
            ->filter(function ($s) {
                return $s['total_voters'] > 0;
            })
            ->values();

        // 1.5 Turnout by Year Level
        $yearLevels = \App\Models\YearLevel::withCount(['voters' => function ($query) use ($event) {
            $query->where('event_id', $event->id);
        }])
            ->get()
            ->map(function ($level) use ($event) {
                $votedCount = \App\Models\Vote::where('event_id', $event->id)
                    ->whereHas('voter', function ($q) use ($level) {
                        $q->where('year_level_id', $level->id);
                    })
                    ->distinct('voter_id')
                    ->count();

                return [
                    'name' => $level->name,
                    'total_voters' => $level->voters_count,
                    'voted_count' => $votedCount,
                    'turnout_percentage' => $level->voters_count > 0 ? round(($votedCount / $level->voters_count) * 100, 2) : 0,
                ];
            })
            ->filter(function ($l) {
                return $l['total_voters'] > 0;
            })
            ->values();

        // 2. Candidate Performance by Section
        $candidates = \App\Models\Candidate::where('event_id', $event->id)
            ->with(['position', 'partylist'])
            ->get()
            ->map(function ($candidate) use ($event) {
                $sectionVotes = \App\Models\Vote::where('candidate_id', $candidate->id)
                    ->join('voters', 'votes.voter_id', '=', 'voters.id')
                    ->join('year_sections', 'voters.year_section_id', '=', 'year_sections.id')
                    ->selectRaw('year_sections.name as section_name, count(*) as votes')
                    ->groupBy('year_sections.name')
                    ->pluck('votes', 'section_name');

                return [
                    'id' => $candidate->id,
                    'name' => $candidate->name,
                    'position' => $candidate->position->name,
                    'partylist' => $candidate->partylist->name ?? 'Independent',
                    'section_votes' => $sectionVotes,
                    'total_votes' => $sectionVotes->sum(),
                ];
            });

        // 3. Hourly Trends
        $hourlyVotes = \App\Models\Vote::where('event_id', $event->id)
            ->selectRaw('HOUR(created_at) as hour, count(distinct voter_id) as count')
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        // 4. Abstentions
        $totalVotersThatVoted = \App\Models\Vote::where('event_id', $event->id)
            ->distinct('voter_id')
            ->count();

        $abstentions = $event->positions->map(function ($position) use ($totalVotersThatVoted, $event) {
            $totalVotesForPosition = \App\Models\Vote::where('event_id', $event->id)
                ->where('position_id', $position->id)
                ->count();

            $maxPotentialVotes = $totalVotersThatVoted * $position->max_votes;
            $undervotes = $maxPotentialVotes - $totalVotesForPosition;

            // Voters who cast ZERO votes for this position
            $votersWhoVotedForPosition = \App\Models\Vote::where('event_id', $event->id)
                ->where('position_id', $position->id)
                ->distinct('voter_id')
                ->count();

            $fullyAbstained = $totalVotersThatVoted - $votersWhoVotedForPosition;

            return [
                'position' => $position->name,
                'total_possible_votes' => $maxPotentialVotes,
                'total_cast_votes' => $totalVotesForPosition,
                'undervotes' => $undervotes,
                'fully_abstained' => $fullyAbstained,
                'voters_count' => $totalVotersThatVoted
            ];
        });

        return Inertia::render('Reports/Analytics', [
            'event' => $event,
            'sections' => $sections,
            'yearLevels' => $yearLevels,
            'candidates' => $candidates,
            'hourly_trends' => $hourlyVotes,
            'abstentions' => $abstentions
        ]);
    }

    public function live(Event $event)
    {
        $positions = $event->positions()
            ->orderBy('id')
            ->with(['candidates' => function ($query) use ($event) {
                $query->with(['candidatePhotos', 'partylist'])
                    ->withCount(['votes' => function ($q) use ($event) {
                        $q->where('event_id', $event->id);
                    }])
                    ->orderBy('votes_count', 'desc')
                    ->orderBy('is_tie_breaker_winner', 'desc');
            }])
            ->get();

        // Calculate total registered voters for this event
        $registeredVoters = \App\Models\Voter::where('event_id', $event->id)->count();

        // Calculate actual voters (turnout)
        $actualVoters = \App\Models\Vote::where('event_id', $event->id)
            ->distinct('voter_id')
            ->count();

        return Inertia::render('Reports/LiveMonitor', [
            'event' => $event,
            'positions' => $positions,
            'stats' => [
                'registered' => $registeredVoters,
                'turnout' => $actualVoters,
                'percentage' => $registeredVoters > 0 ? round(($actualVoters / $registeredVoters) * 100, 1) : 0
            ]
        ]);
    }

    public function audit(Event $event)
    {
        $logs = \App\Models\VoteActivityLog::where('event_id', $event->id)
            ->with(['voter.yearLevel', 'voter.yearSection'])
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Reports/Audit', [
            'event' => $event,
            'logs' => $logs
        ]);
    }

    public function printAudit(Event $event)
    {
        $logs = \App\Models\VoteActivityLog::where('event_id', $event->id)
            ->with(['voter.yearLevel', 'voter.yearSection'])
            ->orderBy('created_at', 'desc')
            ->get();

        $signatories = \App\Models\Signatory::where('is_active', true)
            ->where(function ($query) use ($event) {
                $query->where('event_id', $event->id)
                    ->orWhereNull('event_id');
            })
            ->orderBy('order')
            ->get();

        return Inertia::render('Reports/PrintAudit', [
            'event' => $event,
            'logs' => $logs,
            'signatories' => $signatories
        ]);
    }

    public function exportVoterReceipt(Event $event, Voter $voter, Request $request)
    {
        $type = $request->query('type', 'pdf');

        if ($type === 'excel') {
            return Excel::download(new VoterReceiptExport($event, $voter), "receipt_{$voter->username}.xlsx");
        }

        $votes = Vote::where('event_id', $event->id)
            ->where('voter_id', $voter->id)
            ->with(['candidate.position', 'candidate.partylist'])
            ->get();

        $pdf = Pdf::loadView('reports.receipt', [
            'event' => $event,
            'voter' => $voter,
            'votes' => $votes
        ]);

        return $pdf->download("receipt_{$voter->username}.pdf");
    }

    public function resolveTie(Request $request, Event $event)
    {
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'position_id' => 'required|exists:positions,id',
        ]);

        // Reset previous tie breaker winner for this position in this event (if any)
        \App\Models\Candidate::where('event_id', $event->id)
            ->where('position_id', $request->position_id)
            ->update(['is_tie_breaker_winner' => false]);

        // Set the new tie breaker winner
        $candidate = \App\Models\Candidate::findOrFail($request->candidate_id);
        $candidate->update(['is_tie_breaker_winner' => true]);

        return back()->with('success', 'Tie resolved successfully. Winner updated.');
    }
}
