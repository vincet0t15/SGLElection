<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Candidate;
use App\Models\CandidatePhoto;
use App\Models\Partylist;
use App\Models\Position;
use App\Models\YearLevel;
use App\Models\YearSection;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Imports\CandidatesImport;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Exports\CandidateTemplateExport;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $eventId = $request->input('event_id');
        $yearLevelId = $request->input('year_level_id');
        $yearSectionId = $request->input('year_section_id');
        $partylistId = $request->input('partylist_id');

        $candidates = Candidate::query()
            ->with(['event', 'position', 'partylist', 'candidatePhotos', 'voter.yearLevel', 'voter.yearSection'])
            ->when($search, function ($query) use ($search) {
                $query->whereHas('voter', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->when($eventId, function ($query) use ($eventId) {
                $query->where('event_id', $eventId);
            })
            ->when($yearLevelId, function ($query) use ($yearLevelId) {
                $query->whereHas('voter', function ($q) use ($yearLevelId) {
                    $q->where('year_level_id', $yearLevelId);
                });
            })
            ->when($yearSectionId, function ($query) use ($yearSectionId) {
                $query->whereHas('voter', function ($q) use ($yearSectionId) {
                    $q->where('year_section_id', $yearSectionId);
                });
            })
            ->when($partylistId, function ($query) use ($partylistId) {
                $query->where('partylist_id', $partylistId);
            })
            ->orderBy('event_id')
            ->orderBy('position_id')
            ->paginate(100)
            ->withQueryString();

        $events = Event::query()->where('is_active', true)->get();

        $partylists = Partylist::all();

        $yearLevels = YearLevel::query()
            ->with('section')
            ->orderBy('name', 'asc')
            ->get();

        $yearSections = YearSection::all();

        return Inertia::render('Candidate/index', [
            'candidates' => $candidates,
            'events' => $events,
            'partylists' => $partylists,
            'yearLevels' => $yearLevels,
            'yearSections' => $yearSections,
            'filters' => $request->only(['search', 'event_id', 'year_level_id', 'year_section_id', 'partylist_id']),
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
            'platform' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
            'voter_id' => 'nullable|exists:voters,id',
        ]);

        $voterId = $validated['voter_id'] ?? null;

        if (!$voterId) {
            // Create new voter
            $username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $validated['name'])) . rand(100, 999);
            // Ensure uniqueness (simple check)
            while (Voter::where('username', $username)->exists()) {
                $username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $validated['name'])) . rand(100, 999);
            }

            $voter = Voter::create([
                'name' => $validated['name'],
                'year_level_id' => $validated['year_level_id'],
                'year_section_id' => $validated['year_section_id'],
                'event_id' => $validated['event_id'],
                'username' => $username,
                'password' => 'password', // Default password
                'is_active' => true,
            ]);
            $voterId = $voter->id;
        }

        $candidate = Candidate::create([
            'event_id' => $validated['event_id'],
            'position_id' => $validated['position_id'],
            'partylist_id' => $validated['partylist_id'] ?? null,
            'platform' => $validated['platform'] ?? null,
            'voter_id' => $voterId,
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
        $voters = [];

        if ($request->has('event_id')) {
            $positions = Position::where('event_id', $request->event_id)->get();
            $partylists = Partylist::where('event_id', $request->event_id)->get();
            // $voters = Voter::where('event_id', $request->event_id)->orderBy('name')->get(); // Removed to optimize
        }

        return Inertia::render('Candidate/create', [
            'events' => $events,
            'yearLevels' => $yearLevels,
            'positions' => $positions,
            'partylists' => $partylists,
            'voters' => [], // Empty array as we use async select
            'event_id' => $request->event_id,
        ]);
    }

    public function edit(Candidate $candidate)
    {
        $candidate->load(['candidatePhotos', 'event', 'position', 'partylist', 'voter']);

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
            'platform' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
            'voter_id' => 'nullable|exists:voters,id',
        ]);

        $voterId = $validated['voter_id'] ?? null;

        if (!$voterId) {
            // Create new voter if one isn't selected
            $username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $validated['name'])) . rand(100, 999);
            while (Voter::where('username', $username)->exists()) {
                $username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $validated['name'])) . rand(100, 999);
            }

            $voter = Voter::create([
                'name' => $validated['name'],
                'username' => $username,
                'password' => bcrypt('password'),
                'year_level_id' => $validated['year_level_id'],
                'year_section_id' => $validated['year_section_id'],
                'event_id' => $validated['event_id'],
            ]);
            $voterId = $voter->id;
        }

        // Update Candidate
        $candidate->update([
            'event_id' => $validated['event_id'],
            'position_id' => $validated['position_id'],
            'partylist_id' => $validated['partylist_id'] ?? null,
            'platform' => $validated['platform'] ?? null,
            'voter_id' => $voterId,
        ]);

        if ($request->hasFile('photo')) {

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

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        try {
            Excel::import(new CandidatesImport, $request->file('file'));
            return redirect()->back()->with('success', 'Candidates imported successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error importing candidates: ' . $e->getMessage()]);
        }
    }

    public function template(): BinaryFileResponse
    {
        return Excel::download(new CandidateTemplateExport, 'candidates_template.xlsx');
    }
}
