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
    protected $yearLevels;
    protected $yearSections;

    public function __construct($eventId)
    {
        $this->eventId = $eventId;
        $this->yearLevels = YearLevel::all();
        $this->yearSections = YearSection::all();
    }

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $name = trim($row['NAME']);
        $lrn = trim($row['LRN NUMBER']);
        $gradeLevel = trim($row['GRADE LEVEL']);
        $sectionName = trim($row['SECTION']);

        // Generate Username and Password
        // Format: lastname + lrn (e.g., abao111201170026)
        $lastName = Str::lower(explode(',', $name)[0]);
        $username = $lastName . $lrn;
        $password = $username; // Password is same as username initially

        // Find Year Level
        $yearLevel = $this->yearLevels->first(function ($level) use ($gradeLevel) {
            return $level->name == $gradeLevel || $level->id == $gradeLevel;
        });

        if (!$yearLevel) {
            throw new \Exception("Grade Level '{$gradeLevel}' not found.");
        }

        // Find Section
        $section = $this->yearSections->first(function ($sec) use ($sectionName, $yearLevel) {
            return ($sec->name == $sectionName || $sec->id == $sectionName) && $sec->year_level_id == $yearLevel->id;
        });

        if (!$section) {
            throw new \Exception("Section '{$sectionName}' not found for Grade Level '{$yearLevel->name}'.");
        }

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
            'name' => 'required|string',
            'lrn_number' => 'required|unique:voters,lrn_number',
            'grade_level' => 'required',
            'section' => 'required',
        ];
    }
}
