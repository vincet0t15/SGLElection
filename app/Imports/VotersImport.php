<?php

namespace App\Imports;

use App\Models\Voter;
use App\Models\YearLevel;
use App\Models\YearSection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class VotersImport implements ToModel, WithHeadingRow, WithValidation
{
    protected $eventId;
    protected $headingRow;
    protected $yearLevels;
    protected $yearSections;

    public function __construct($eventId, $headingRow = 1)
    {
        $this->eventId = $eventId;
        $this->headingRow = $headingRow;
        $this->yearLevels = YearLevel::all();
        $this->yearSections = YearSection::all();
    }

    public function headingRow(): int
    {
        return $this->headingRow;
    }

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {

        $name = $row['name'] ?? $row['student_name'] ?? null;
        $lrn = $row['learners_reference_number'] ?? $row['lrn'] ?? $row['lrn_number'] ?? null;
        $gradeLevel = $row['grade_level'] ?? $row['level'] ?? $row['year_level'] ?? null;
        $sectionName = $row['section'] ?? $row['class_section'] ?? null;

        if (!$name || !$lrn) {
            return null; // 
        }

        $name = trim($name);
        $lrn = trim($lrn);
        $gradeLevel = trim($gradeLevel);
        $sectionName = trim($sectionName);


        if (str_contains($name, ',')) {
            $lastName = Str::lower(trim(explode(',', $name)[0]));
        } else {

            $parts = explode(' ', $name);
            $lastName = Str::lower($parts[0]);
        }


        $lastName = str_replace(' ', '', $lastName);

        $username = $lastName . $lrn;
        $password = $username;


        $yearLevel = $this->yearLevels->first(function ($level) use ($gradeLevel) {
            return $level->name == $gradeLevel || $level->id == $gradeLevel;
        });



        // Find Section
        $section = $this->yearSections->first(function ($sec) use ($sectionName, $yearLevel) {
            return ($sec->name == $sectionName || $sec->id == $sectionName) && $sec->year_level_id == $yearLevel->id;
        });



        return new Voter([
            'name'            => $name,
            'lrn_number'      => $lrn,
            'username'        => $username,
            'password'        => Hash::make($password),
            'year_level_id'   => $yearLevel->id,
            'year_section_id' => $section->id,
            'event_id'        => $this->eventId,
            'is_active'       => true,
        ]);
    }

    public function rules(): array
    {
        return [
            // The user's file has headers: LRN NUMBER, NAME, SECTION, GRADE LEVEL
            // Slugs: lrn_number, name, section, grade_level

            'lrn_number' => 'required|unique:voters,lrn_number',
            'name' => 'required|string',
            'grade_level' => 'required',
            'section' => 'required',
        ];
    }
}
