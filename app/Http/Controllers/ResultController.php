<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResultController extends Controller
{
    public function index()
    {
        // Get the active event, or the latest one if no active event.
        $event = Event::where('is_active', true)->latest()->first() ?? Event::latest()->first();

        if (!$event) {
             return Inertia::render('Results/Index', [
                'event' => null,
                'positions' => [],
            ]);
        }

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

        return Inertia::render('Results/Index', [
            'event' => $event,
            'positions' => $positions,
        ]);
    }
}
