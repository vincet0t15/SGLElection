<?php

namespace App\Exports;

use App\Models\Voter;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class VotersExport implements FromQuery, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Voter::query()->with(['yearLevel', 'yearSection', 'event']);

        if (!empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('username', 'like', '%' . $search . '%')
                  ->orWhere('lrn_number', 'like', '%' . $search . '%');
            });
        }

        if (!empty($this->filters['event_id']) && $this->filters['event_id'] !== 'all') {
            $query->where('event_id', $this->filters['event_id']);
        }

        if (!empty($this->filters['year_level_id']) && $this->filters['year_level_id'] !== 'all') {
            $query->where('year_level_id', $this->filters['year_level_id']);
        }

        if (!empty($this->filters['year_section_id']) && $this->filters['year_section_id'] !== 'all') {
            $query->where('year_section_id', $this->filters['year_section_id']);
        }

        return $query;
    }

    public function headings(): array
    {
        return [
            'Name',
            'LRN Number',
            'Username',
            'Year Level',
            'Section',
            'Event',
            'Status',
        ];
    }

    public function map($voter): array
    {
        return [
            $voter->name,
            $voter->lrn_number,
            $voter->username,
            $voter->yearLevel->name,
            $voter->yearSection->name,
            $voter->event->name,
            $voter->is_active ? 'Active' : 'Inactive',
        ];
    }
}
