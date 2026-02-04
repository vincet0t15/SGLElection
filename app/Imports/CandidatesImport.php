<?php

namespace App\Imports;

use App\Models\Candidate;
use App\Models\Event;
use App\Models\YearLevel;
use App\Models\YearSection;
use App\Models\Position;
use App\Models\Partylist;
use App\Models\Voter;
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
        if (!$eventId) {
            throw new \Exception("Event '{$row['event']}' not found.");
        }


        $positionId = $this->findId(Position::class, $row['position'], ['event_id' => $eventId]);
        if (!$positionId) {
            throw new \Exception("Position '{$row['position']}' not found for the specified event.");
        }


        $yearLevelId = $this->findId(YearLevel::class, $row['year_level']);
        if (!$yearLevelId) {
            throw new \Exception("Year Level '{$row['year_level']}' not found.");
        }


        $sectionId = $this->findId(YearSection::class, $row['section'], ['year_level_id' => $yearLevelId]);
        if (!$sectionId) {
            throw new \Exception("Section '{$row['section']}' not found in Year Level '{$row['year_level']}'.");
        }


        $partylistId = null;
        if (!empty($row['partylist'])) {

            $partylistId = $this->findId(Partylist::class, $row['partylist'], ['event_id' => $eventId]);
            if (!$partylistId) {
                throw new \Exception("Partylist '{$row['partylist']}' not found.");
            }
        }


        // Find or Create Voter
        $voter = Voter::where('name', trim($row['name']))
            ->where('event_id', $eventId)
            ->first();

        if (!$voter) {
            $username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', trim($row['name']))) . rand(100, 999);
            while (Voter::where('username', $username)->exists()) {
                $username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', trim($row['name']))) . rand(100, 999);
            }

            $voter = Voter::create([
                'name' => trim($row['name']),
                'year_level_id' => $yearLevelId,
                'year_section_id' => $sectionId,
                'event_id' => $eventId,
                'username' => $username,
                'password' => 'password',
                'is_active' => true,
            ]);
        } else {
            // Update existing voter details to match import
            $voter->update([
                'year_level_id' => $yearLevelId,
                'year_section_id' => $sectionId,
            ]);
        }


        $exists = Candidate::where('voter_id', $voter->id)
            ->where('event_id', $eventId)
            ->where('position_id', $positionId)
            ->exists();

        if ($exists) {
            return null;
        }


        return new Candidate([
            'event_id'        => $eventId,
            'position_id'     => $positionId,
            'partylist_id'    => $partylistId,
            'platform'        => $row['platform'] ?? null,
            'voter_id'        => $voter->id,
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
