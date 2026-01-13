<?php

namespace App\Http\Controllers;

use App\Models\Grandprize;
use Illuminate\Http\Request;

class GrandprizeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Grandprize $grandprize)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Grandprize $grandprize)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Grandprize $grandprize)
    {
        $validated = $request->validate([
            'is_grandprize' => 'sometimes|boolean',
        ]);

        $grandprize->update($validated);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Grandprize $grandprize)
    {
        //
    }
}
