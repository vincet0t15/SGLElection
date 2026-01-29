<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\YearLevelController;
use App\Http\Controllers\YearSectionController;
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
    Route::get('year-level', [YearLevelController::class, 'index'])->name('year-level.index');
    Route::post('year-level', [YearLevelController::class, 'store'])->name('year-level.store');
    Route::put('year-level/{yearLevel}', [YearLevelController::class, 'update'])->name('year-level.update');
    Route::delete('year-level/{yearLevel}', [YearLevelController::class, 'destroy'])->name('year-level.destroy');

    // SECTION
    Route::get('year-section', [YearSectionController::class, 'index'])->name('year-section.index');
    Route::post('year-section', [YearSectionController::class, 'store'])->name('year-section.store');
    Route::put('year-section/{yearSection}', [YearSectionController::class, 'update'])->name('year-section.update');
    Route::delete('year-section/{yearSection}', [YearSectionController::class, 'destroy'])->name('year-section.destroy');

    // EVENT
    Route::get('event', [EventController::class, 'index'])->name('event.index');
    Route::post('event', [EventController::class, 'store'])->name('event.store');
    Route::put('event/{event}', [EventController::class, 'update'])->name('event.update');
    Route::delete('event/{event}', [EventController::class, 'destroy'])->name('event.destroy');
});


require __DIR__ . '/settings.php';
