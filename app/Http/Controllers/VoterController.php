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
        $yearLevelId = request()->input('year_level_id');
        $yearSectionId = request()->input('year_section_id');

        $events = Event::all();
        $yearLevels = \App\Models\YearLevel::all();
        $yearSections = \App\Models\YearSection::all();

        $voters = Voter::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('lrn_number', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                });
            })
            ->when($eventId, function ($query, $eventId) {
                $query->where('event_id', $eventId);
            })
            ->when($yearLevelId, function ($query, $yearLevelId) {
                $query->where('year_level_id', $yearLevelId);
            })
            ->when($yearSectionId, function ($query, $yearSectionId) {
                $query->where('year_section_id', $yearSectionId);
            })
            ->with(['yearLevel', 'yearSection', 'event'])
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Voter/index', [
            'events' => $events,
            'yearLevels' => $yearLevels,
            'yearSections' => $yearSections,
            'voters' => $voters,
            'filters' => $request->only(['search', 'event_id', 'year_level_id', 'year_section_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Voter/create', [
            'yearLevels' => \App\Models\YearLevel::all(),
            'yearSections' => \App\Models\YearSection::all(),
            'events' => Event::where('is_active', true)->get(),
        ]);
    }

    public function import(Request $request)
    {
        Excel::import(new VotersImport, $request->file('file'));

        return redirect('/')->with('success', 'All good!');
    }



    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'lrn_number' => 'required|string|unique:voters,lrn_number',
            'username' => 'required|string|unique:voters,username',
            'password' => 'required|string|min:8',
            'year_level_id' => 'required|exists:year_levels,id',
            'year_section_id' => 'required|exists:year_sections,id',
            'event_id' => 'required|exists:events,id',
        ]);

        Voter::create([
            'name' => $request->name,
            'lrn_number' => $request->lrn_number,
            'username' => $request->username,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'year_level_id' => $request->year_level_id,
            'year_section_id' => $request->year_section_id,
            'event_id' => $request->event_id,
            'is_active' => true,
        ]);

        return redirect()->route('voter.index')->with('success', 'Voter created successfully.');
    }

    public function edit(Voter $voter)
    {
        return Inertia::render('Voter/edit', [
            'voter' => $voter,
            'yearLevels' => \App\Models\YearLevel::all(),
            'yearSections' => \App\Models\YearSection::all(),
            'events' => Event::where('is_active', true)->get(),
        ]);
    }

    public function update(Request $request, Voter $voter)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'lrn_number' => 'required|string|unique:voters,lrn_number,' . $voter->id,
            'username' => 'required|string|unique:voters,username,' . $voter->id,
            'password' => 'nullable|string|min:8',
            'year_level_id' => 'required|exists:year_levels,id',
            'year_section_id' => 'required|exists:year_sections,id',
            'event_id' => 'required|exists:events,id',
            'is_active' => 'boolean',
        ]);

        $voter->update([
            'name' => $validated['name'],
            'lrn_number' => $validated['lrn_number'],
            'username' => $validated['username'],
            'year_level_id' => $validated['year_level_id'],
            'year_section_id' => $validated['year_section_id'],
            'event_id' => $validated['event_id'],
            'is_active' => $validated['is_active'] ?? $voter->is_active,
        ]);

        if ($request->filled('password')) {
            $voter->update([
                'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            ]);
        }

        return redirect()->route('voter.index')->with('success', 'Voter updated successfully.');
    }
}
