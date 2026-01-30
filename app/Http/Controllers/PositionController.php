<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Position;
use App\Models\YearLevel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PositionController extends Controller
{
    //
    public function index(Request $request)
    {
        $search = request()->input('search');
        $eventId = request()->input('event_id');

        $events = Event::query()
            ->where('is_active', true)
            ->orderBy('name', 'asc')
            ->get();

        $positions = Position::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($eventId, function ($query, $eventId) {
                $query->where('event_id', $eventId);
            })
            ->with('event')
            ->with('yearLevels')
            ->orderBy('id', 'asc')
            ->paginate(20)
            ->withQueryString();

        $yearLevels = YearLevel::all();

        return Inertia::render('Position/index', [
            'filters' => $request->only(['search', 'event_id']),
            'positions' => $positions,
            'events' => $events,
            'yearLevels' => $yearLevels,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'max_votes' => 'required|integer',
            'event_id' => 'required|integer',
            'year_level_ids' => 'nullable|array',
            'year_level_ids.*' => 'exists:year_levels,id',
        ]);

        $position = Position::create($request->only(['name', 'max_votes', 'event_id']));

        if ($request->has('year_level_ids')) {
            $position->yearLevels()->sync($request->year_level_ids);
        }

        return redirect()->back()->with('success', 'Position created successfully');
    }


    public function update(Request $request, Position $position)
    {
        $request->validate([
            'name' => 'required|string',
            'max_votes' => 'required|integer',
            'event_id' => 'required|integer',
            'year_level_ids' => 'nullable|array',
            'year_level_ids.*' => 'exists:year_levels,id',
        ]);


        $position->update($request->only(['name', 'max_votes', 'event_id']));

        if ($request->has('year_level_ids')) {
            $position->yearLevels()->sync($request->year_level_ids);
        }

        return redirect()->back()->with('success', 'Position updated successfully');
    }

    public function destroy(Position $position)
    {
        $position->delete();

        return redirect()->back()->with('success', 'Position deleted successfully');
    }
}
