<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RideGuidelineAcceptance extends Model
{
    protected $table = 'ride_guideline_acceptances';

    protected $fillable = ['ride_id', 'guideline_id', 'accepted_at'];

    protected $casts = [
        'accepted_at' => 'datetime',
    ];

    public function ride(): BelongsTo
    {
        return $this->belongsTo(Ride::class);
    }

    public function guideline(): BelongsTo
    {
        return $this->belongsTo(Guideline::class);
    }
}
