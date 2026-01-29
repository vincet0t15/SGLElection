<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
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

        if (Auth::guard('voter')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended(route('vote.index'));
        }

        throw ValidationException::withMessages([
            'username' => trans('auth.failed'),
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
