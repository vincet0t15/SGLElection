<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $events = Event::orderBy('created_at', 'desc')->get();

        return Inertia::render('Reports/Index', [
            'events' => $events
        ]);
    }

    public function show(Event $event)
    {
        $positions = $event->positions()
            ->orderBy('id')
            ->with(['candidates' => function ($query) use ($event) {
                $query->with(['candidatePhotos', 'yearLevel', 'yearSection'])
                    ->withCount(['votes' => function ($q) use ($event) {
                        $q->where('event_id', $event->id);
                    }])
                    ->orderBy('votes_count', 'desc');
            }])
            ->get();

        // Calculate total voters who voted in this event
        $totalVoters = \App\Models\Vote::where('event_id', $event->id)
            ->distinct('voter_id')
            ->count();

        // Get all voters assigned to this event
        $voters = \App\Models\Voter::where('event_id', $event->id)
            ->get()
            ->map(function ($voter) use ($event) {
                $voter->has_voted = \App\Models\Vote::where('voter_id', $voter->id)
                    ->where('event_id', $event->id)
                    ->exists();
                return $voter;
            });

        return Inertia::render('Reports/Show', [
            'event' => $event,
            'positions' => $positions,
            'stats' => [
                'total_voters' => $totalVoters
            ],
            'voters' => $voters
        ]);
    }

    public function print(Event $event)
    {
        $positions = $event->positions()
            ->orderBy('id')
            ->with(['candidates' => function ($query) use ($event) {
                $query->with(['candidatePhotos', 'yearLevel', 'yearSection'])
                    ->withCount(['votes' => function ($q) use ($event) {
                        $q->where('event_id', $event->id);
                    }])
                    ->orderBy('votes_count', 'desc');
            }])
            ->get();

        // Calculate total voters who voted in this event
        $totalVoters = \App\Models\Vote::where('event_id', $event->id)
            ->distinct('voter_id')
            ->count();

        return Inertia::render('Reports/Print', [
            'event' => $event,
            'positions' => $positions,
            'stats' => [
                'total_voters' => $totalVoters
            ]
        ]);
    }
}
