<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
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
}
