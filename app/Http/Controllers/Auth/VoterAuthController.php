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

        // Add is_active check to credentials
        $credentials['is_active'] = true;

        if (Auth::guard('voter')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            $voter = Auth::guard('voter')->user();

            // Check if voter has an assigned event
            if (!$voter->event_id) {
                Auth::guard('voter')->logout();
                $request->session()->invalidate();
                throw ValidationException::withMessages([
                    'username' => 'You are not assigned to any election event.',
                ]);
            }

            // Load the event relationship
            $event = Event::find($voter->event_id);
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

            // Check if event has ended
            if ($event->dateTime_end && now()->gt($event->dateTime_end)) {
                Auth::guard('voter')->logout();
                $request->session()->invalidate();
                throw ValidationException::withMessages([
                    'username' => 'The election event has ended.',
                ]);
            }

            // Check if voter has already voted in this specific event
            $hasVoted = Vote::where('voter_id', $voter->id)
                ->where('event_id', $event->id)
                ->exists();

            if ($hasVoted) {
                Auth::guard('voter')->logout();
                $request->session()->invalidate();

                throw ValidationException::withMessages([
                    'username' => 'You have already voted for this election.',
                ]);
            }

            return redirect()->intended(route('vote.index'));
        }

        throw ValidationException::withMessages([
            'username' => 'These credentials do not match our records or your account is inactive.',
        ]);
    }

    public function destroy(Request $request)
    {
        Auth::guard('voter')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('voter.login');
    }
}
