<?php

namespace App\Models;

use Database\Factories\AuditableEntityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditableEntity extends Model
{
    protected $fillable = [
        'name',
        'category',
        'sector',
        'priority',
        'status',
        'year1_planned',
        'year2_planned',
        'year3_planned',
        'last_audit_date',
        'last_audit_rating',
        'risk_frequency',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'year1_planned' => 'boolean',
            'year2_planned' => 'boolean',
            'year3_planned' => 'boolean',
            'last_audit_date' => 'date',
        ];
    }

    public function engagements()
    {
        return $this->hasMany(AuditEngagement::class);
    }

    public function risks()
    {
        return $this->hasMany(Risk::class);
    }

    /** @use HasFactory<AuditableEntityFactory> */
    use HasFactory;
}
