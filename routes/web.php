<?php

use App\Http\Controllers\YearLevelController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
Route::middleware(['auth', 'verified'])->group(function () {
    // YearLevel
    Route::get('yearl-level', [YearLevelController::class, 'index'])->name('yearl-level.index');
});


require __DIR__ . '/settings.php';
