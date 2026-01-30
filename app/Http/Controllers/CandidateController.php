<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Candidate;
use App\Models\CandidatePhoto;
use App\Models\Partylist;
use App\Models\Position;
use App\Models\YearLevel;
use App\Models\YearSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $eventId = $request->input('event_id');
        $yearLevelId = $request->input('year_level_id');
        $yearSectionId = $request->input('year_section_id');

        $candidates = Candidate::query()
            ->with(['event', 'position', 'partylist', 'yearLevel', 'yearSection', 'candidatePhotos'])
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($eventId, function ($query) use ($eventId) {
                $query->where('event_id', $eventId);
            })
            ->when($yearLevelId, function ($query) use ($yearLevelId) {
                $query->where('year_level_id', $yearLevelId);
            })
            ->when($yearSectionId, function ($query) use ($yearSectionId) {
                $query->where('year_section_id', $yearSectionId);
            })
            ->orderBy('event_id')
            ->orderBy('position_id')
            ->paginate(10)
            ->withQueryString();

        $events = Event::query()->where('is_active', true)->get();

        $yearLevels = YearLevel::query()
            ->with('section')
            ->orderBy('name', 'asc')
            ->get();
        
        $yearSections = YearSection::all();

        return Inertia::render('Candidate/index', [
            'candidates' => $candidates,
            'events' => $events,
            'yearLevels' => $yearLevels,
            'yearSections' => $yearSections,
            'filters' => $request->only(['search', 'event_id', 'year_level_id', 'year_section_id']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'year_level_id' => 'required|exists:year_levels,id',
            'year_section_id' => 'required|exists:year_sections,id',
            'event_id' => 'required|exists:events,id',
            'position_id' => 'required|exists:positions,id',
            'partylist_id' => 'nullable|exists:partylists,id',
            'photo' => 'nullable|image|max:5120',
        ]);

        $candidate = Candidate::create([
            'name' => $validated['name'],
            'year_level_id' => $validated['year_level_id'],
            'year_section_id' => $validated['year_section_id'],
            'event_id' => $validated['event_id'],
            'position_id' => $validated['position_id'],
            'partylist_id' => $validated['partylist_id'] ?? null,
        ]);

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $path = $file->store('candidates', 'public');

            CandidatePhoto::create([
                'candidate_id' => $candidate->id,
                'extension_name' => $file->getClientOriginalExtension(),
                'path' => $path,
                'file_size' => $file->getSize(),
                'original_name' => $file->getClientOriginalName(),
                'date_created' => now(),
            ]);
        }

        return redirect()->back()->with('success', 'Candidate created successfully.');
    }

    public function create(Request $request)
    {
        $events = Event::query()->where('is_active', true)->get();
        $yearLevels = YearLevel::query()->with('section')->orderBy('name', 'asc')->get();

        $positions = [];
        $partylists = [];
        if ($request->has('event_id')) {
            $positions = Position::where('event_id', $request->event_id)->get();
            $partylists = Partylist::where('event_id', $request->event_id)->get();
        }

        return Inertia::render('Candidate/create', [
            'events' => $events,
            'yearLevels' => $yearLevels,
            'positions' => $positions,
            'partylists' => $partylists,
            'event_id' => $request->event_id,
        ]);
    }

    public function edit(Candidate $candidate)
    {
        $candidate->load(['candidatePhotos', 'event', 'position', 'yearLevel', 'yearSection', 'partylist']);

        $events = Event::query()->where('is_active', true)->get();
        $yearLevels = YearLevel::query()->with('section')->orderBy('name', 'asc')->get();
        $positions = Position::where('event_id', $candidate->event_id)->get();
        $partylists = Partylist::where('event_id', $candidate->event_id)->get();

        return Inertia::render('Candidate/edit', [
            'candidate' => $candidate,
            'events' => $events,
            'yearLevels' => $yearLevels,
            'positions' => $positions,
            'partylists' => $partylists,
        ]);
    }

    public function update(Request $request, Candidate $candidate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'year_level_id' => 'required|exists:year_levels,id',
            'year_section_id' => 'required|exists:year_sections,id',
            'event_id' => 'required|exists:events,id',
            'position_id' => 'required|exists:positions,id',
            'partylist_id' => 'nullable|exists:partylists,id',
            'photo' => 'nullable|image|max:5120',
        ]);

        $candidate->update([
            'name' => $validated['name'],
            'year_level_id' => $validated['year_level_id'],
            'year_section_id' => $validated['year_section_id'],
            'event_id' => $validated['event_id'],
            'position_id' => $validated['position_id'],
            'partylist_id' => $validated['partylist_id'] ?? null,
        ]);

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($candidate->candidatePhotos->isNotEmpty()) {
                foreach ($candidate->candidatePhotos as $photo) {
                    Storage::disk('public')->delete($photo->path);
                    $photo->delete();
                }
            }

            $file = $request->file('photo');
            $path = $file->store('candidates', 'public');

            CandidatePhoto::create([
                'candidate_id' => $candidate->id,
                'extension_name' => $file->getClientOriginalExtension(),
                'path' => $path,
                'file_size' => $file->getSize(),
                'original_name' => $file->getClientOriginalName(),
                'date_created' => now(),
            ]);
        }

        return redirect()->route('candidate.index')->with('success', 'Candidate updated successfully.');
    }

    public function destroy(Candidate $candidate)
    {
        if ($candidate->candidatePhotos->isNotEmpty()) {
            foreach ($candidate->candidatePhotos as $photo) {
                Storage::disk('public')->delete($photo->path);
                $photo->delete();
            }
        }

        $candidate->delete();

        return redirect()->back()->with('success', 'Candidate deleted successfully.');
    }
}
