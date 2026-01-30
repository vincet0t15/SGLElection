<?php

namespace App\Imports;

use App\Models\Voter;
use Maatwebsite\Excel\Concerns\ToModel;
use Illuminate\Support\Facades\Hash;

class VotersImport implements ToModel
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new Voter([
            'name'     => $row[0],
            'username'    => $row[1],
            'password' => Hash::make($row[2]),
            'lrn_number' => $row[3],
            'year_level_id' => $row[4],
            'year_section_id' => $row[5],
        ]);
    }
}
