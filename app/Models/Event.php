<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'name',
        'dateTime_start',
        'dateTime_end',
        'location',
        'description',
        'is_active',
        'show_winner',
    ];

    protected $casts = [
        'dateTime_start' => 'datetime',
        'dateTime_end' => 'datetime',
        'is_active' => 'boolean',
        'show_winner' => 'boolean',
    ];

    public function positions()
    {
        return $this->hasMany(Position::class);
    }

    public function partylists()
    {
        return $this->hasMany(Partylist::class);
    }
}
