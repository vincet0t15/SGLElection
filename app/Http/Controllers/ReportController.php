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

    public function show(Request $request, Event $event)
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

        $voters = $votersQuery->paginate(10)
            ->withQueryString()
            ->through(function ($voter) use ($event) {
                $voter->has_voted = \App\Models\Vote::where('voter_id', $voter->id)
                    ->where('event_id', $event->id)
                    ->exists();
                return $voter;
            });


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
