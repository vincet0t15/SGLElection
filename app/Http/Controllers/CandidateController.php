<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Candidate;
use App\Models\CandidatePhoto;
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

        $candidates = Candidate::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhereHas('event', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('position', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->with(['event', 'position', 'candidatePhotos', 'yearLevel', 'yearSection'])
            ->orderBy('event_id')
            ->orderBy('position_id')
            ->paginate(10)
            ->withQueryString();

        $events = Event::query()->where('is_active', true)->get();

        $yearLevels = YearLevel::query()
            ->with('section')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Candidate/index', [
            'candidates' => $candidates,
            'events' => $events,
            'filters' => $request->only('search'),
            'yearLevels' => $yearLevels,
        ]);
    }

    public function create(Request $request)
    {
        $events = Event::query()->where('is_active', true)->get();
        $yearLevels = YearLevel::query()->with('section')->orderBy('name', 'asc')->get();

        $positions = [];
        if ($request->has('event_id')) {
            $positions = Position::where('event_id', $request->event_id)->get();
        }

        return Inertia::render('Candidate/create', [
            'events' => $events,
            'yearLevels' => $yearLevels,
            'positions' => $positions,
            'event_id' => $request->event_id,
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
            'photo' => 'nullable|image|max:5120',
        ]);

        $candidate = Candidate::create([
            'name' => $validated['name'],
            'year_level_id' => $validated['year_level_id'],
            'year_section_id' => $validated['year_section_id'],
            'event_id' => $validated['event_id'],
            'position_id' => $validated['position_id'],
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

        return to_route('candidate.index')->with('success', 'Candidate created successfully.');
    }
}
