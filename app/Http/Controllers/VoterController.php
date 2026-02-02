<?php

namespace App\Http\Controllers;

use App\Imports\VotersImport;
use App\Exports\VotersExport;
use App\Exports\VoterTemplateExport;
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
        return Inertia::render('Voter/Create', [
            'yearLevels' => \App\Models\YearLevel::all(),
            'yearSections' => \App\Models\YearSection::all(),
            'events' => Event::where('is_active', true)->get(),
        ]);
    }

    public function importView()
    {
        return Inertia::render('Voter/import', [
            'events' => Event::where('is_active', true)->get(),
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
            'event_id' => 'required|exists:events,id',
            'header_row' => 'nullable|integer|min:1',
        ]);

        try {
            $headingRow = $request->input('header_row', 1);
            Excel::import(new VotersImport($request->event_id, $headingRow), $request->file('file'));
            return redirect()->route('voter.index')->with('success', 'Voters imported successfully.');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $messages = [];
            foreach ($failures as $failure) {
                $messages[] = 'Row ' . $failure->row() . ': ' . implode(', ', $failure->errors());
            }
            return back()->withErrors(['file' => implode(' | ', $messages)]);
        } catch (\Exception $e) {
            return back()->withErrors(['file' => 'Error importing file: ' . $e->getMessage()]);
        }
    }

    public function export(Request $request)
    {
        return Excel::download(new VotersExport($request->all()), 'voters.xlsx');
    }

    public function downloadTemplate()
    {
        return Excel::download(new VoterTemplateExport, 'voters_template.xlsx');
    }

    public function activateAll(Request $request)
    {
        $eventId = $request->input('event_id');

        $query = Voter::query();

        if ($eventId && $eventId !== 'all') {
            $query->where('event_id', $eventId);
        }

        $query->update(['is_active' => true]);

        return back()->with('success', 'All voters have been activated successfully.');
    }

    public function print(Request $request)
    {
        $search = $request->query('search');
        $eventId = request()->input('event_id');
        $yearLevelId = request()->input('year_level_id');
        $yearSectionId = request()->input('year_section_id');
        $selectedIds = request()->input('selected_ids');

        $query = Voter::query()->with(['yearLevel', 'yearSection', 'event']);

        if ($selectedIds) {
            $ids = explode(',', $selectedIds);
            $query->whereIn('id', $ids);
        } else {
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('lrn_number', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                });
            }

            if ($eventId && $eventId !== 'all') {
                $query->where('event_id', $eventId);
            }

            if ($yearLevelId && $yearLevelId !== 'all') {
                $query->where('year_level_id', $yearLevelId);
            }

            if ($yearSectionId && $yearSectionId !== 'all') {
                $query->where('year_section_id', $yearSectionId);
            }
        }

        // Sort by hierarchy: Event > Year Level > Section > Name
        $query->orderBy('event_id')
            ->orderBy('year_level_id')
            ->orderBy('year_section_id')
            ->orderBy('name');

        $voters = $query->get();

        // Fetch signatories
        $signatoriesQuery = \App\Models\Signatory::where('is_active', true)
            ->orderBy('order');

        if ($eventId && $eventId !== 'all') {
            $signatoriesQuery->where(function ($q) use ($eventId) {
                $q->where('event_id', $eventId)
                    ->orWhereNull('event_id');
            });
        } else {
            $signatoriesQuery->whereNull('event_id');
        }

        $signatories = $signatoriesQuery->get();

        // Prepare filter labels for the view
        $filters = $request->all();
        if ($eventId && $eventId !== 'all') {
            $filters['event_name'] = Event::find($eventId)->name ?? null;
        }
        if ($yearLevelId && $yearLevelId !== 'all') {
            $filters['year_level_name'] = \App\Models\YearLevel::find($yearLevelId)->name ?? null;
        }
        if ($yearSectionId && $yearSectionId !== 'all') {
            $filters['section_name'] = \App\Models\YearSection::find($yearSectionId)->name ?? null;
        }

        return Inertia::render('Voter/Print', [
            'voters' => $voters,
            'filters' => $filters,
            'signatories' => $signatories,
        ]);
    }

    public function printCards(Request $request)
    {
        $search = $request->query('search');
        $eventId = request()->input('event_id');
        $yearLevelId = request()->input('year_level_id');
        $yearSectionId = request()->input('year_section_id');
        $selectedIds = request()->input('selected_ids');

        $query = Voter::query()->with(['yearLevel', 'yearSection', 'event']);

        if ($selectedIds) {
            $ids = explode(',', $selectedIds);
            $query->whereIn('id', $ids);
        } else {
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('lrn_number', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                });
            }

            if ($eventId && $eventId !== 'all') {
                $query->where('event_id', $eventId);
            }

            if ($yearLevelId && $yearLevelId !== 'all') {
                $query->where('year_level_id', $yearLevelId);
            }

            if ($yearSectionId && $yearSectionId !== 'all') {
                $query->where('year_section_id', $yearSectionId);
            }
        }

        // Sort by hierarchy: Event > Year Level > Section > Name
        $query->orderBy('event_id')
            ->orderBy('year_level_id')
            ->orderBy('year_section_id')
            ->orderBy('name');

        $voters = $query->get();

        // Prepare filter labels for the view
        $filters = $request->all();
        if ($eventId && $eventId !== 'all') {
            $filters['event_name'] = Event::find($eventId)->name ?? null;
        }
        if ($yearLevelId && $yearLevelId !== 'all') {
            $filters['year_level_name'] = \App\Models\YearLevel::find($yearLevelId)->name ?? null;
        }
        if ($yearSectionId && $yearSectionId !== 'all') {
            $filters['section_name'] = \App\Models\YearSection::find($yearSectionId)->name ?? null;
        }

        return Inertia::render('Voter/PrintCards', [
            'voters' => $voters,
            'filters' => $filters,
        ]);
    }

    public function bulkStatus(Request $request)
    {
        $request->validate([
            'status' => 'required|boolean',
            'ids' => 'nullable|array',
            'ids.*' => 'exists:voters,id',
        ]);

        if ($request->has('ids') && count($request->ids) > 0) {
            Voter::whereIn('id', $request->ids)->update(['is_active' => $request->status]);
            $count = count($request->ids);
        } else {
            $search = $request->input('search');
            $eventId = $request->input('event_id');
            $yearLevelId = $request->input('year_level_id');
            $yearSectionId = $request->input('year_section_id');

            $query = Voter::query();

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('lrn_number', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                });
            }

            if ($eventId && $eventId !== 'all') {
                $query->where('event_id', $eventId);
            }

            if ($yearLevelId && $yearLevelId !== 'all') {
                $query->where('year_level_id', $yearLevelId);
            }

            if ($yearSectionId && $yearSectionId !== 'all') {
                $query->where('year_section_id', $yearSectionId);
            }

            $count = $query->update(['is_active' => $request->status]);
        }

        $statusText = $request->status ? 'activated' : 'deactivated';

        return back()->with('success', "Successfully {$statusText} {$count} voters.");
    }

    public function toggleStatus(Voter $voter)
    {

        $voter->update(['is_active' => !$voter->is_active]);
        $status = $voter->is_active ? 'activated' : 'deactivated';
        return back()->with('success', "Voter {$voter->name} has been {$status}.");
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
