<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    protected $fillable = [
        'user_id',
        'candidate_id',
        'position_id',
        'event_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
