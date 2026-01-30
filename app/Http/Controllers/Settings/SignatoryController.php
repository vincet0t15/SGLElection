<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Signatory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SignatoryController extends Controller
{
    public function index()
    {
        $signatories = Signatory::with('event')->orderBy('order')->orderBy('created_at')->get();
        $events = Event::select('id', 'name')->orderBy('created_at', 'desc')->get();

        return Inertia::render('settings/Signatories/Index', [
            'signatories' => $signatories,
            'events' => $events
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'nullable|exists:events,id',
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
            'event_id' => 'nullable|exists:events,id',
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
