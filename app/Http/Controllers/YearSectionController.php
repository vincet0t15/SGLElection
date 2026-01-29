<?php

namespace App\Http\Controllers;

use App\Models\YearLevel;
use App\Models\YearSection;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class YearSectionController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $yearLevels = YearLevel::get();
        $yearSections = YearSection::query()
            ->with('yearLevel')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate(20)->withQueryString();

        return Inertia::render('YearSection/index', [
            'filters' => $request->only('search'),
            'yearSections' => $yearSections,
            'yearLevels' => $yearLevels
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'year_level_id' => 'required|exists:year_levels,id',
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('year_sections')
                    ->where('year_level_id', $request->year_level_id),
            ],
        ]);

        YearSection::create($request->only('year_level_id', 'name'));

        return redirect()->back()->with('success', 'Year section created successfully.');
    }

    public function update(Request $request, YearSection $yearSection)
    {
        $request->validate([
            'year_level_id' => 'required|exists:year_levels,id',
            'name' => 'required|string|max:255',
        ]);

        $yearSection->update($request->only('year_level_id', 'name'));

        return redirect()->back()->with('success', 'Year section updated successfully.');
    }

    public function destroy(YearSection $yearSection)
    {
        $yearSection->delete();

        return redirect()->back()->with('success', 'Year section deleted successfully.');
    }
}
