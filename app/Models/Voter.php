<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Voter extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $guard = 'voter';

    protected $fillable = [
        'name',
        'username',
        'password',
        'lrn_number',
        'year_level_id',
        'year_section_id',
        'is_active',
        'event_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function yearLevel()
    {
        return $this->belongsTo(YearLevel::class, 'year_level_id');
    }

    public function yearSection()
    {
        return $this->belongsTo(YearSection::class, 'year_section_id');
    }
}
