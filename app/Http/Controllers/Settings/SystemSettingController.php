<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SystemSettingController extends Controller
{
    public function edit()
    {
        $settings = SystemSetting::firstOrCreate(
            ['id' => 1],
            ['system_name' => 'SGLL Voting System']
        );

        return Inertia::render('settings/appearance', [
            'system_name' => $settings->system_name,
            'system_logo' => $settings->system_logo ? Storage::url($settings->system_logo) : null,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'system_name' => 'required|string|max:255',
            'system_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $settings = SystemSetting::firstOrCreate(['id' => 1]);
        $settings->system_name = $request->system_name;

        if ($request->hasFile('system_logo')) {
            if ($settings->system_logo) {
                Storage::disk('public')->delete($settings->system_logo);
            }

            $path = $request->file('system_logo')->store('system', 'public');
            $settings->system_logo = $path;
        }

        $settings->save();

        return redirect()->back()->with('success', 'System settings updated successfully.');
    }
}
