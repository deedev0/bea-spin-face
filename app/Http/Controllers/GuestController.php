<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Grandprize;
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
            'guests' => Guest::where('is_winner', false)->latest()->get(),
            'winners' => Guest::where('is_winner', true)->latest('updated_at')->get(),
            'isGrandprizeActive' => (bool) Grandprize::where('key', 'is_grandprize_active')->value('is_grandprize'),
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
            'is_guest' => 'required|boolean',
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

    public function show(Guest $guest)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function showall(Guest $guest)
    {
        return inertia('ShowAll', [
            'guests' => Guest::latest()->get(),
            'grandprize' => Grandprize::where('key', 'is_grandprize_active')->first(),
        ]);
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
        $validated = $request->validate([
            'is_guest' => 'sometimes|boolean',
            'is_winner' => 'sometimes|boolean',
        ]);

        $guest->update($validated);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Guest $guest)
    {
        if ($request->input('tokenAdmin') !== 'adadeh123') {
            return back();
        }
        
        // 1. Cek apakah ada file gambar di storage, jika ada hapus filenya
        if ($guest->image) {
            // Pastikan Anda menggunakan Storage Facade di bagian atas file: 
            // use Illuminate\Support\Facades\Storage;
            Storage::disk('public')->delete($guest->image);
        }

        // 2. Hapus data dari database
        $guest->delete();

        // 3. Kembali ke halaman sebelumnya (Inertia akan otomatis memperbarui state)
        return back();
    }
}
