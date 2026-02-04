<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    //
    public function index(Request $request)
    {

        $search = $request->query('search');

        $events = Event::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->where('is_archived', false)
            ->orderBy('dateTime_start', 'asc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Event/index', [
            'filters' => $request->only('search'),
            'events' => $events,
        ]);
    }

    public function archives(Request $request)
    {
        $search = $request->query('search');

        $events = Event::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->where('is_archived', true)
            ->orderBy('dateTime_start', 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Archive/index', [
            'filters' => $request->only('search'),
            'events' => $events,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'dateTime_start' => 'required|date',
            'dateTime_end' => 'required|date',
            'location' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        Event::create($request->all());

        return redirect()->back()->with('success', 'Event created successfully');
    }

    public function update(Request $request, Event $event)
    {
        $request->validate([
            'name' => 'required|string',
            'dateTime_start' => 'required|date',
            'dateTime_end' => 'required|date',
            'location' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        $event->update($request->all());

        return redirect()->back()->with('success', 'Event updated successfully');
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return redirect()->back()->with('success', 'Event deleted successfully');
    }

    public function toggleShowWinner(Event $event)
    {
        $event->update(['show_winner' => !$event->show_winner]);

        return redirect()->back()->with('success', 'Show winner status updated successfully');
    }

    public function toggleArchive(Event $event)
    {
        $event->update(['is_archived' => !$event->is_archived]);

        $status = $event->is_archived ? 'archived' : 'unarchived';
        return redirect()->back()->with('success', "Event {$status} successfully");
    }
}
