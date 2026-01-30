<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Signatory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SignatoryController extends Controller
{
    public function index()
    {
        $signatories = Signatory::orderBy('order')->orderBy('created_at')->get();

        return Inertia::render('settings/Signatories/Index', [
            'signatories' => $signatories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        Signatory::create($request->all());

        return redirect()->back()->with('success', 'Signatory created successfully.');
    }

    public function update(Request $request, Signatory $signatory)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        $signatory->update($request->all());

        return redirect()->back()->with('success', 'Signatory updated successfully.');
    }

    public function destroy(Signatory $signatory)
    {
        $signatory->delete();

        return redirect()->back()->with('success', 'Signatory deleted successfully.');
    }
}
