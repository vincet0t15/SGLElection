<?php

namespace App\Http\Controllers;

use App\Imports\VotersImport;
use App\Models\Event;
use App\Models\Voter;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoterController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $eventId = request()->input('event_id');

        $events = Event::all();
        $voters = Voter::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($eventId, function ($query, $eventId) {
                $query->where('event_id', $eventId);
            })
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Voter/index', [
            'events' => $events,
            'voters' => $voters,
            'filters' => $request->only(['search', 'event_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Voter/create');
    }

    public function import(Request $request)
    {
        Excel::import(new VotersImport, $request->file('file'));

        return redirect('/')->with('success', 'All good!');
    }
}
