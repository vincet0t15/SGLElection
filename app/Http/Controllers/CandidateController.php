<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $events = Event::query()
            ->where('is_active', true)
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhereHas('positions', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhereHas('candidates', function ($qq) use ($search) {
                                $qq->where('name', 'like', "%{$search}%");
                            });
                    });
            })
            ->with([
                'positions' => function ($q) {
                    $q->orderBy('id', 'asc');
                },
                'positions.candidates',
            ])
            ->get();

        return Inertia::render('Candidate/Index', [
            'events' => $events,
            'search' => $request->only('search'),
        ]);
    }
}
