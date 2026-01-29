<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidatePhoto extends Model
{
    //
    protected $fillable = [
        'candidate_id',
        'extension_name',
        'path',
        'file_size',
        'original_name',
        'date_created',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
