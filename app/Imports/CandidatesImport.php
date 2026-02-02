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


        if (is_numeric($input)) {
            $record = (clone $query)->where('id', $input)->first();
            if ($record) return $record->id;
        }


        $record = $query->where($nameColumn, trim($input))->first();

        return $record ? $record->id : null;
    }

    public function model(array $row)
    {

        $eventId = $this->findId(Event::class, $row['event']);
        if (!$eventId) return null;


        $positionId = $this->findId(Position::class, $row['position'], ['event_id' => $eventId]);
        if (!$positionId) return null;


        $yearLevelId = $this->findId(YearLevel::class, $row['year_level']);
        if (!$yearLevelId) return null;


        $sectionId = $this->findId(YearSection::class, $row['section'], ['year_level_id' => $yearLevelId]);
        if (!$sectionId) return null;


        $partylistId = null;
        if (!empty($row['partylist'])) {

            $partylistId = $this->findId(Partylist::class, $row['partylist'], ['event_id' => $eventId]);
        }


        $exists = Candidate::where('name', trim($row['name']))
            ->where('event_id', $eventId)
            ->where('position_id', $positionId)
            ->exists();

        if ($exists) {
            return null;
        }


        return new Candidate([
            'name'            => trim($row['name']),
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
