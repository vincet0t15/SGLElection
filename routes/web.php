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
    Route::get('year-level', [YearLevelController::class, 'index'])->name('year-level.index');
    Route::post('year-level', [YearLevelController::class, 'store'])->name('year-level.store');
    Route::put('year-level/{yearLevel}', [YearLevelController::class, 'update'])->name('year-level.update');
    Route::delete('year-level/{yearLevel}', [YearLevelController::class, 'destroy'])->name('year-level.destroy');
});


require __DIR__ . '/settings.php';
