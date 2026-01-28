<?php

namespace App\Http\Controllers;

use App\Models\YearLevel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class YearLevelController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $yearLevels = YearLevel::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate(20)->withQueryString();

        return Inertia::render('YearLevel/index', [
            'filters' => $request->only('search'),
            'yearLevels' => $yearLevels,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        YearLevel::create($request->all());

        return redirect()->back()->with('success', 'Year Level created successfully.');
    }

    public function update(Request $request, YearLevel $yearLevel)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $yearLevel->update($request->all());

        return redirect()->back()->with('success', 'Year Level updated successfully.');
    }
}
