<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpinController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\GrandprizeController;

Route::get('/thanks', function () {
    return Inertia::render('Thanks');
});

Route::get('/register', function () {
    return Inertia::render('Register');
});

Route::post('/spin/winner', [SpinController::class, 'winner']);

Route::get('/guest/showall', [GuestController::class, 'showall']);
Route::resource('/grandprize', GrandprizeController::class)->except(['index', 'create', 'store', 'show', 'destroy',  'edit']);
Route::resource('/guest', GuestController::class)->except(['edit']);
