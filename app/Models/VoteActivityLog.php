<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VoteActivityLog extends Model
{
    protected $fillable = [
        'voter_id',
        'event_id',
        'ip_address',
        'user_agent',
    ];

    public function voter()
    {
        return $this->belongsTo(Voter::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
