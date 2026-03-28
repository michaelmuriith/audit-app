<?php

namespace App\Models;

use Database\Factories\AuditableEntityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditableEntity extends Model
{
    protected $fillable = [
        'name',
        'priority',
        'status',
        'year1_planned',
        'year2_planned',
        'year3_planned',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'year1_planned' => 'boolean',
            'year2_planned' => 'boolean',
            'year3_planned' => 'boolean',
        ];
    }

    public function engagements()
    {
        return $this->hasMany(AuditEngagement::class);
    }

    /** @use HasFactory<AuditableEntityFactory> */
    use HasFactory;
}
