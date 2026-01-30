<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partylist extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'event_id',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function candidates()
    {
        return $this->hasMany(Candidate::class);
    }
}
