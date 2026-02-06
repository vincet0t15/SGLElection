<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class VoterAuthController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/VoterLogin');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $voter = \App\Models\Voter::where('username', $request->username)->first();

        // 1. Check if the account exists
        if (!$voter) {
            throw ValidationException::withMessages([
                'username' => 'These credentials do not match our records.',
            ]);
        }

        // 2. Verify password
        if (!\Illuminate\Support\Facades\Hash::check($request->password, $voter->password)) {
            throw ValidationException::withMessages([
                'username' => 'These credentials do not match our records.',
            ]);
        }

        // 3. Check if already voted (Priority over Inactive check)
        if ($voter->event_id) {
            $hasVoted = Vote::where('voter_id', $voter->id)
                ->where('event_id', $voter->event_id)
                ->exists();

            if ($hasVoted) {
                throw ValidationException::withMessages([
                    'username' => 'You have already voted for this election.',
                ]);
            }
        }

        // 4. Check if inactive
        if (!$voter->is_active) {
            throw ValidationException::withMessages([
                'username' => 'Your account is inactive.',
            ]);
        }

        // Proceed with login since all checks passed
        Auth::guard('voter')->login($voter, $request->boolean('remember'));
        $request->session()->regenerate();

        // Check if voter has an assigned event
        if (!$voter->event_id) {
            Auth::guard('voter')->logout();
            $request->session()->invalidate();
            throw ValidationException::withMessages([
                'username' => 'You are not assigned to any election event.',
            ]);
        }

        // Load the event relationship
        $event = $voter->event;

        // Check if event exists
        if (!$event) {
            Auth::guard('voter')->logout();
            $request->session()->invalidate();
            throw ValidationException::withMessages([
                'username' => 'The assigned election event does not exist.',
            ]);
        }

        // Check if event is active
        if (!$event->is_active) {
            Auth::guard('voter')->logout();
            $request->session()->invalidate();
            throw ValidationException::withMessages([
                'username' => 'The election event is not currently active.',
            ]);
        }

        // Check if event is archived
        if ($event->is_archived) {
            Auth::guard('voter')->logout();
            $request->session()->invalidate();
            throw ValidationException::withMessages([
                'username' => 'The election event has been archived.',
            ]);
        }

        // Check if event has started
        if ($event->dateTime_start && now()->lt($event->dateTime_start)) {
            Auth::guard('voter')->logout();
            $request->session()->invalidate();
            throw ValidationException::withMessages([
                'username' => 'The election event has not started yet.',
            ]);
        }

        // Check if event has ended
        if ($event->dateTime_end && now()->gt($event->dateTime_end)) {
            Auth::guard('voter')->logout();
            $request->session()->invalidate();
            throw ValidationException::withMessages([
                'username' => 'The election event has ended.',
            ]);
        }

        return redirect()->intended(route('vote.index'));
    }

    public function destroy(Request $request)
    {
        Auth::guard('voter')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('voter.login');
    }
}
