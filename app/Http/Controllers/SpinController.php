<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class SpinController extends Controller
{
    public function winner(Request $request) {
        $request->validate([
            'id' => 'required|exists:guests,id',
        ]);

        $guest = Guest::findOrFail($request->id);

        $guest->update([
            'is_winner' => true
        ]);

        return redirect()->back();
    }
}
