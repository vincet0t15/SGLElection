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
}
