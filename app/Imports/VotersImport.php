<?php

namespace App\Imports;

use App\Models\Voter;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class VotersImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new Voter([
            'name'            => $row['NAME'],
            'lrn_number'      => $row['LRN NUMBER'],
            'username'        => $row['USERNAME'],
            'password'        => Hash::make($row['PASSWORD']),
            'year_level_id'   => $row['GRADE LEVEL'],
            'year_section_id' => $row['SECTION'],
            'event_id'        => $row['EVENT'],
            'is_active'       => true,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'lrn_number' => 'required|unique:voters,lrn_number',
            'username' => 'required|unique:voters,username',
            'password' => 'required',
            'year_level_id' => 'required|exists:year_levels,id',
            'year_section_id' => 'required|exists:year_sections,id',
            'event_id' => 'required|exists:events,id',
        ];
    }
}
