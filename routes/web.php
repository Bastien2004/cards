<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WordController;

Route::middleware('auth')->group(function () {
    Route::get('/words', [WordController::class, 'index']);
    Route::post('/words', [WordController::class, 'store']);
    Route::delete('/words/{word}', [WordController::class, 'destroy']);

    Route::get('/study', [WordController::class, 'study']);
    Route::post('/words/{word}/review', [WordController::class, 'review']);
});

// La page d'accueil renvoie directement vers la connexion.
// Un utilisateur déjà connecté est ensuite redirigé vers /study.
Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
