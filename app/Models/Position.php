<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    //
    protected $table = 'positions';
    protected $fillable = ['name', 'max_votes', 'event_id'];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function candidates()
    {
        return $this->hasMany(Candidate::class);
    }
}
