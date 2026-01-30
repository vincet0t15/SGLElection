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
    ];

    protected $casts = [
        'dateTime_start' => 'datetime',
        'dateTime_end' => 'datetime',
        'is_active' => 'boolean',
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
