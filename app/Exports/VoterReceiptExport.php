<?php

namespace App\Exports;

use App\Models\Event;
use App\Models\Vote;
use App\Models\Voter;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class VoterReceiptExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $event;
    protected $voter;

    public function __construct(Event $event, Voter $voter)
    {
        $this->event = $event;
        $this->voter = $voter;
    }

    public function collection()
    {
        return Vote::where('event_id', $this->event->id)
            ->where('voter_id', $this->voter->id)
            ->with(['candidate.position', 'candidate.partylist'])
            ->get();
    }

    public function headings(): array
    {
        return [
            'Position',
            'Candidate Name',
            'Partylist',
            'Date Voted',
        ];
    }

    public function map($vote): array
    {
        return [
            $vote->candidate->position->name,
            $vote->candidate->name,
            $vote->candidate->partylist ? $vote->candidate->partylist->name : 'Independent',
            $vote->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
