<?php

namespace App\Imports;

use App\Models\Voter;
use App\Models\YearLevel;
use App\Models\YearSection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\RemembersRowNumber;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Imports\HeadingRowFormatter;

class VotersImport implements ToModel, WithHeadingRow, SkipsEmptyRows, WithChunkReading, WithBatchInserts
{
    use RemembersRowNumber;

    protected $eventId;
    protected $headingRow;
    protected $yearLevels;
    protected $yearSections;
    protected $generatedUsernames = [];

    public function __construct($eventId, $headingRow = 1)
    {

        HeadingRowFormatter::default('none');

        ini_set('memory_limit', '512M');
        set_time_limit(300); // 5 minutes

        $this->eventId = $eventId;
        $this->headingRow = $headingRow;
        $this->yearLevels = YearLevel::all();
        $this->yearSections = YearSection::all();
    }

    public function chunkSize(): int
    {
        return 500;
    }

    public function batchSize(): int
    {
        return 500;
    }

    public function headingRow(): int
    {
        return $this->headingRow;
    }

    /**
     * Aggressively clean and ensure valid UTF-8 string
     */
    private function forceUtf8($string)
    {
        if (is_null($string)) {
            return null;
        }

        $string = (string) $string;


        $string = str_replace("\xEF\xBB\xBF", '', $string);


        $string = mb_convert_encoding(
            $string,
            'UTF-8',
            'UTF-8, Windows-1252, ISO-8859-1'
        );


        $string = preg_replace('/[^\P{C}]+/u', '', $string);

        return trim($string);
    }

    /**
     * Normalize row keys AND values to handle encoding issues
     */
    private function normalizeRow(array $row): array
    {
        $clean = [];

        foreach ($row as $key => $value) {

            $key = $this->forceUtf8($key);
            $key = Str::snake(trim($key));


            $value = $this->forceUtf8($value);

            $clean[$key] = $value;
        }

        return $clean;
    }

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    private function cleanString($string)
    {
        return isset($string) ? trim($this->forceUtf8($string)) : null;
    }

    public function model(array $row)
    {
        $currentRowNumber = $this->getRowNumber();
        $row = $this->normalizeRow($row);

        $name = $this->cleanString($row['name'] ?? $row['student_name'] ?? null);
        $lrn = $this->cleanString($row['learners_reference_number'] ?? $row['lrn'] ?? $row['lrn_number'] ?? null);
        $gradeLevel = $this->cleanString($row['grade_level'] ?? $row['level'] ?? $row['year_level'] ?? null);
        $sectionName = $this->cleanString($row['section'] ?? $row['class_section'] ?? null);


        if (empty($name) && empty($lrn) && empty($gradeLevel) && empty($sectionName)) {
            return null;
        }


        $validator = Validator::make([
            'name' => $name,
            'grade_level' => $gradeLevel,
            'section' => $sectionName,
        ], [
            'name' => 'required|string',
            'grade_level' => 'required',
            'section' => 'required',
        ]);

        if ($validator->fails()) {
            throw new \RuntimeException(
                $this->forceUtf8("Row {$currentRowNumber}: " . implode(', ', $validator->errors()->all()))
            );
        }

        if (!$name) {
            return null;
        }

        $name = trim($name);
        $lrn = $lrn ? trim($lrn) : null;
        $gradeLevel = trim($gradeLevel);
        $sectionName = trim($sectionName);


        if (str_contains($name, ',')) {
            $lastName = Str::lower(trim(explode(',', $name)[0]));
        } else {

            $parts = explode(' ', $name);
            $lastName = Str::lower($parts[0]);
        }


        $lastName = str_replace(' ', '', $lastName);

        $cleanLastName = Str::ascii($lastName);

        $cleanLastName = preg_replace('/[^a-zA-Z0-9]/', '', $cleanLastName);

        $lrnSuffix = $lrn ? substr($lrn, -4) : rand(1000, 9999);

        $baseUsername = substr($cleanLastName, 0, 2) . $lrnSuffix;
        $username = $baseUsername;
        $counter = 1;


        while (Voter::where('username', $username)->exists() || isset($this->generatedUsernames[$username])) {
            $username = $baseUsername . $counter;
            $counter++;
        }


        $this->generatedUsernames[$username] = true;

        $password = $username;


        $yearLevel = null;


        if (is_numeric($gradeLevel)) {
            $yearLevel = $this->yearLevels->firstWhere('id', $gradeLevel);
        }


        if (!$yearLevel) {
            $yearLevel = $this->yearLevels->first(function ($level) use ($gradeLevel) {
                return strcasecmp($level->name, $gradeLevel) === 0;
            });
        }

        if (!$yearLevel) {
            throw new \RuntimeException($this->forceUtf8("Row {$currentRowNumber}: Year Level '{$gradeLevel}' not found. Please create it first."));
        }

        $section = null;


        if (is_numeric($sectionName)) {
            $section = $this->yearSections->first(function ($sec) use ($sectionName, $yearLevel) {
                return $sec->id == $sectionName && $sec->year_level_id == $yearLevel->id;
            });
        }


        if (!$section) {
            $section = $this->yearSections->first(function ($sec) use ($sectionName, $yearLevel) {
                return strcasecmp($sec->name, $sectionName) === 0 && $sec->year_level_id == $yearLevel->id;
            });
        }

        if (!$section) {
            throw new \RuntimeException($this->forceUtf8("Row {$currentRowNumber}: Section '{$sectionName}' not found in Year Level '{$yearLevel->name}'. Please create it first."));
        }

        $yearSectionId = $section->id;
        $yearLevelId = $yearLevel->id;

        return new Voter([
            'name'            => $name,
            'lrn_number'      => $lrn,
            'username'        => $username,
            'password'        => Hash::make($password),
            'year_level_id'   => $yearLevelId,
            'year_section_id' => $yearSectionId,
            'event_id'        => $this->eventId,
            'is_active'       => false,
        ]);
    }
}
