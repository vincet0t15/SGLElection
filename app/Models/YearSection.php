<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class YearSection extends Model
{
    protected $fillable = ['year_level_id', 'name'];

    public function yearLevel()
    {
        return $this->belongsTo(YearLevel::class);
    }
}
