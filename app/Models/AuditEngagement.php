<?php

namespace App\Models;

use Database\Factories\AuditEngagementFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditEngagement extends Model
{
    protected $fillable = [
        'engagement_id',
        'name',
        'department',
        'auditable_entity_id',
        'lead_auditor_id',
        'start_date',
        'end_date',
        'status',
        'fiscal_year',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function auditableEntity()
    {
        return $this->belongsTo(AuditableEntity::class);
    }

    public function leadAuditor()
    {
        return $this->belongsTo(User::class, 'lead_auditor_id');
    }

    /** @use HasFactory<AuditEngagementFactory> */
    use HasFactory;
}
