<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Partylist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartylistController extends Controller
{
    public function index(Request $request)
    {
        $search = request()->input('search');
        $eventId = request()->input('event_id');

        $events = Event::query()
            ->where('is_active', true)
            ->orderBy('name', 'asc')
            ->get();

        $partylists = Partylist::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($eventId, function ($query, $eventId) {
                $query->where('event_id', $eventId);
            })
            ->with('event')
            ->orderBy('name', 'asc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Partylist/index', [
            'filters' => $request->only(['search', 'event_id']),
            'partylists' => $partylists,
            'events' => $events,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'event_id' => 'required|integer|exists:events,id',
        ]);

        Partylist::create($request->only(['name', 'description', 'event_id']));

        return redirect()->back()->with('success', 'Partylist created successfully');
    }

    public function update(Request $request, Partylist $partylist)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'event_id' => 'required|integer|exists:events,id',
        ]);

        $partylist->update($request->only(['name', 'description', 'event_id']));

        return redirect()->back()->with('success', 'Partylist updated successfully');
    }

    public function destroy(Partylist $partylist)
    {
        $partylist->delete();

        return redirect()->back()->with('success', 'Partylist deleted successfully');
    }
}
