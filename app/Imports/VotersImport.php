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
            return null;
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

        $username = substr($lastName, 0, 2) . substr($lrn, -4);
        $password = $username;


        $yearLevel = null;

        // Try to find by ID if numeric
        if (is_numeric($gradeLevel)) {
            $yearLevel = $this->yearLevels->firstWhere('id', $gradeLevel);
        }

        // If not found by ID, try by name
        if (!$yearLevel) {
            $yearLevel = $this->yearLevels->first(function ($level) use ($gradeLevel) {
                return strcasecmp($level->name, $gradeLevel) === 0;
            });
        }

        if (!$yearLevel) {
            $yearLevel = YearLevel::create(['name' => $gradeLevel]);
            $this->yearLevels->push($yearLevel);
        }

        $section = null;

        // Try to find by ID if numeric (must match year level)
        if (is_numeric($sectionName)) {
            $section = $this->yearSections->first(function ($sec) use ($sectionName, $yearLevel) {
                return $sec->id == $sectionName && $sec->year_level_id == $yearLevel->id;
            });
        }

        // If not found by ID, try by name (must match year level)
        if (!$section) {
            $section = $this->yearSections->first(function ($sec) use ($sectionName, $yearLevel) {
                return strcasecmp($sec->name, $sectionName) === 0 && $sec->year_level_id == $yearLevel->id;
            });
        }

        if (!$section) {
            $section = YearSection::create([
                'name' => $sectionName,
                'year_level_id' => $yearLevel->id
            ]);
            $this->yearSections->push($section);
        }

        return new Voter([
            'name'            => $name,
            'lrn_number'      => $lrn,
            'username'        => $username,
            'password'        => Hash::make($password),
            'year_level_id'   => $yearLevel->id,
            'year_section_id' => $section->id,
            'event_id'        => $this->eventId,
            'is_active'       => false,
        ]);
    }

    public function rules(): array
    {
        return [
            'lrn_number' => 'required|unique:voters,lrn_number',
            'name' => 'required|string',
            'grade_level' => 'required',
            'section' => 'required',
        ];
    }
}
