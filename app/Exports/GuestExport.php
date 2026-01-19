<?php

namespace App\Exports;

use App\Models\Guest;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class GuestExport implements FromCollection, WithHeadings, WithMapping
{
    /**
    * Mengambil data dari database
    */
    public function collection()
    {
        // Kita ambil semua data, pemfilteran kolom dilakukan di fungsi map()
        return Guest::all();
    }

    /**
    * Menentukan kolom apa saja yang muncul di Excel (Transformasi Data)
    */
    public function map($guest): array
    {
        return [
            $guest->fullName,
            $guest->company,
            $guest->email,
            $guest->phone,
            $guest->image,
            $guest->is_winner ? 'Ya' : 'Tidak',
            $guest->is_guest ? 'Ya' : 'Tidak',
            $guest->is_member ? 'Ya' : 'Tidak',
        ];
    }

    /**
    * Membuat Header di baris pertama Excel
    */
    public function headings(): array
    {
        return [
            'Nama Lengkap',
            'Perusahaan',
            'Email',
            'No. HP',
            'Nama File Foto',
            'Pemenang',
            'Tamu',
            'Member',
        ];
    }
}
