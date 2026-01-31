<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    //
    protected $fillable = [
        'name',
        'year_level_id',
        'year_section_id',
        'event_id',
        'position_id',
        'partylist_id',
        'platform',
        'is_tie_breaker_winner',
    ];

    public function yearLevel()
    {
        return $this->belongsTo(YearLevel::class);
    }

    public function yearSection()
    {
        return $this->belongsTo(YearSection::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function partylist()
    {
        return $this->belongsTo(Partylist::class);
    }

    public function candidatePhotos()
    {
        return $this->hasMany(CandidatePhoto::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}
