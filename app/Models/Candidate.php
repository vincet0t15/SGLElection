<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    //
    protected $fillable = [
        'event_id',
        'position_id',
        'partylist_id',
        'platform',
        'is_tie_breaker_winner',
        'voter_id',
    ];

    protected $with = ['voter']; // Eager load voter by default since we always need the name

    protected $appends = ['name', 'year_level_id', 'year_section_id', 'year_level', 'year_section'];

    public function getNameAttribute()
    {
        return $this->voter->name ?? null;
    }

    public function getYearLevelIdAttribute()
    {
        return $this->voter->year_level_id ?? null;
    }

    public function getYearSectionIdAttribute()
    {
        return $this->voter->year_section_id ?? null;
    }

    public function getYearLevelAttribute()
    {
        return $this->voter->yearLevel ?? null;
    }

    public function getYearSectionAttribute()
    {
        return $this->voter->yearSection ?? null;
    }

    public function voter()
    {
        return $this->belongsTo(Voter::class);
    }

    // Removed direct yearLevel/yearSection relationships as they are now on Voter

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
