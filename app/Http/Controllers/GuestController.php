<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class GuestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Spin', [
            'guests' => Guest::where('is_winner', false)->get()->values(),
            'winners' => Guest::where('is_winner', true)->get()->values(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Register');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'fullName' => 'required|max:255|',
            'company' => 'required|max:255',
            'email' => 'required|max:255',
            'phone' => 'required|max:255',
            'image' => 'required|image|file|mimes:jpg,jpeg,png|max:20000',
        ]);

        if ($request->hasFile('image')) {
            $image    = $request->file('image');
            $fileName = time() . '-' . Str::random(10) . '.jpg';
            $path     = 'guest-images/' . $fileName;

            // INIT IMAGE MANAGER (v3)
            $manager = new ImageManager(new Driver());

            $img = $manager
                ->read($image->getRealPath())
                ->scaleDown(width: 400)
                ->toJpeg(70);


            Storage::disk('public')->put($path, $img);

            $validatedData['image'] = $path;
        }

        Guest::create($validatedData);

        return redirect('/thanks');
    }

    /**
     * Display the specified resource.
     */
    public function show(Guest $guest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Guest $guest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Guest $guest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guest $guest)
    {
        //
    }
}
