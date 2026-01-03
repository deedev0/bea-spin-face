<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpinController;
use App\Http\Controllers\GuestController;

Route::get('/thanks', function () {
    return Inertia::render('Thanks');
});

Route::get('/register', function () {
    return Inertia::render('Register');
});

Route::post('/spin/winner', [SpinController::class, 'winner']);

Route::resource('/guest', GuestController::class);
