<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PositionController extends Controller
{
    //
    public function index(Request $request)
    {
        $search = request()->input('search');
        $events = Event::query()
            ->where('is_active', true)
            ->orderBy('name', 'asc')
            ->get();
        $positions = Position::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->with('event')
            ->orderBy('name', 'asc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Position/index', [
            'filters' => $request->only('search'),
            'positions' => $positions,
            'events' => $events,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'max_votes' => 'required|integer',
            'event_id' => 'required|integer',
        ]);

        Position::create($request->all());

        return redirect()->back()->with('success', 'Position created successfully');
    }


    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'max_votes' => 'required|integer',
        ]);

        $position = Position::findOrFail($request->position_id);
        $position->update($request->all());

        return redirect()->back()->with('success', 'Position updated successfully');
    }

    public function destroy(Request $request)
    {
        $position = Position::findOrFail($request->position_id);
        $position->delete();

        return redirect()->back()->with('success', 'Position deleted successfully');
    }
}
