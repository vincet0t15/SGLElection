<?php

namespace App\Imports;

use App\Models\Candidate;
use App\Models\Event;
use App\Models\YearLevel;
use App\Models\YearSection;
use App\Models\Position;
use App\Models\Partylist;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class CandidatesImport implements ToModel, WithHeadingRow, WithValidation
{
    private function findId($modelClass, $input, $scope = [], $nameColumn = 'name')
    {
        if (empty($input)) return null;

        $query = $modelClass::query();

        foreach ($scope as $column => $value) {
            $query->where($column, $value);
        }

        // If numeric, try to find by ID first
        if (is_numeric($input)) {
            $record = (clone $query)->where('id', $input)->first();
            if ($record) return $record->id;
        }

        // Find by Name (case-insensitive usually, but strict here)
        $record = $query->where($nameColumn, trim($input))->first();

        return $record ? $record->id : null;
    }

    public function model(array $row)
    {
        // 1. Find Event
        $eventId = $this->findId(Event::class, $row['event']);
        if (!$eventId) return null;

        // 2. Find Position (within Event)
        $positionId = $this->findId(Position::class, $row['position'], ['event_id' => $eventId]);
        if (!$positionId) return null;

        // 3. Find Year Level
        $yearLevelId = $this->findId(YearLevel::class, $row['year_level']);
        if (!$yearLevelId) return null;

        // 4. Find Section (within Year Level)
        $sectionId = $this->findId(YearSection::class, $row['section'], ['year_level_id' => $yearLevelId]);
        if (!$sectionId) return null;

        // 5. Find Partylist (Optional, within Event)
        $partylistId = null;
        if (!empty($row['partylist'])) {
            $partylistId = $this->findId(Partylist::class, $row['partylist'], ['event_id' => $eventId]);
        }

        // 6. Create Candidate
        return new Candidate([
            'name'            => $row['name'],
            'event_id'        => $eventId,
            'position_id'     => $positionId,
            'year_level_id'   => $yearLevelId,
            'year_section_id' => $sectionId,
            'partylist_id'    => $partylistId,
            'platform'        => $row['platform'] ?? null,
        ]);
    }

    public function rules(): array
    {
        return [
            'name'       => 'required',
            'event'      => 'required',
            'position'   => 'required',
            'year_level' => 'required',
            'section'    => 'required',
            'partylist'  => 'nullable',
            'platform'   => 'nullable',
        ];
    }
}
