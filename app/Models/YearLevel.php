<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class YearLevel extends Model
{
    //
    protected $fillable = [
        'name',
    ];

    public function section(): HasMany
    {
        return $this->hasMany(YearSection::class);
    }

    public function positions()
    {
        return $this->belongsToMany(Position::class, 'position_year_level');
    }

    public function voters(): HasMany
    {
        return $this->hasMany(Voter::class);
    }
}
