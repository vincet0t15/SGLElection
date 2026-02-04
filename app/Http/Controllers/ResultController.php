<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Vote;
use App\Models\Signatory;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResultController extends Controller
{
    public function index()
    {
        $event = Event::where('is_active', true)->where('is_archived', false)->latest()->first() ?? Event::where('is_archived', false)->latest()->first();

        if (!$event) {
            return Inertia::render('Results/Index', [
                'event' => null,
                'positions' => [],
            ]);
        }

        $positions = $event->positions()
            ->orderBy('id')
            ->with(['candidates' => function ($query) use ($event) {
                $query->with(['candidatePhotos', 'voter.yearLevel', 'voter.yearSection', 'partylist'])
                    ->withCount(['votes' => function ($q) use ($event) {
                        $q->where('event_id', $event->id);
                    }])
                    ->orderBy('votes_count', 'desc')
                    ->orderBy('is_tie_breaker_winner', 'desc');
            }])
            ->get();

        return Inertia::render('Results/Index', [
            'event' => $event,
            'positions' => $positions,
        ]);
    }

    public function exportPdf(Event $event)
    {
        $positions = $event->positions()
            ->orderBy('id')
            ->with(['candidates' => function ($query) use ($event) {
                $query->with(['candidatePhotos', 'voter.yearLevel', 'voter.yearSection', 'partylist'])
                    ->withCount(['votes' => function ($q) use ($event) {
                        $q->where('event_id', $event->id);
                    }])
                    ->orderBy('votes_count', 'desc')
                    ->orderBy('is_tie_breaker_winner', 'desc');
            }])
            ->get();

        $votesPerPosition = Vote::where('event_id', $event->id)
            ->select('position_id', DB::raw('count(distinct voter_id) as count'))
            ->groupBy('position_id')
            ->pluck('count', 'position_id');

        $positions->transform(function ($position) use ($votesPerPosition) {
            $position->votes_cast_count = $votesPerPosition[$position->id] ?? 0;
            return $position;
        });

        $actualVoters = Vote::where('event_id', $event->id)
            ->distinct('voter_id')
            ->count();

        $registeredVoters = \App\Models\Voter::where('event_id', $event->id)->count();

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
            'stats' => [
                'actual_voters' => $actualVoters,
                'registered_voters' => $registeredVoters,
                'total_sections' => $totalSections,
                'turnout' => $registeredVoters > 0 ? round(($actualVoters / $registeredVoters) * 100, 2) : 0,
            ],
        ]);
    }
}
