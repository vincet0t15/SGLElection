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
    public function model(array $row)
    {
        // 1. Find Event
        $event = Event::where('name', $row['event'])->first();
        if (!$event) {
            return null; // Should be caught by validation, but just in case
        }

        // 2. Find Position (within Event)
        $position = Position::where('event_id', $event->id)
            ->where('name', $row['position'])
            ->first();
        
        if (!$position) {
            // If position doesn't exist in this event, skip or error.
            // For now, we'll skip.
            return null; 
        }

        // 3. Find Year Level
        $yearLevel = YearLevel::where('name', $row['year_level'])->first();
        if (!$yearLevel) {
            return null;
        }

        // 4. Find Section (within Year Level)
        $section = YearSection::where('year_level_id', $yearLevel->id)
            ->where('name', $row['section'])
            ->first();
        
        if (!$section) {
            return null;
        }

        // 5. Find Partylist (Optional, within Event)
        $partylistId = null;
        if (!empty($row['partylist'])) {
            $partylist = Partylist::where('event_id', $event->id)
                ->where('name', $row['partylist'])
                ->first();
            if ($partylist) {
                $partylistId = $partylist->id;
            }
        }

        // 6. Create Candidate
        return new Candidate([
            'name'            => $row['name'],
            'event_id'        => $event->id,
            'position_id'     => $position->id,
            'year_level_id'   => $yearLevel->id,
            'year_section_id' => $section->id,
            'partylist_id'    => $partylistId,
            'platform'        => $row['platform'] ?? null,
        ]);
    }

    public function rules(): array
    {
        return [
            'name'       => 'required|string',
            'event'      => 'required|string|exists:events,name',
            'position'   => 'required|string',
            'year_level' => 'required|string|exists:year_levels,name',
            'section'    => 'required|string',
            'partylist'  => 'nullable|string',
            'platform'   => 'nullable|string',
        ];
    }
}
