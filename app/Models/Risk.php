<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Risk extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'likelihood',
        'impact',
        'control_effectiveness',
        'residual_score',
        'auditable_entity_id',
        'description',
        'mitigations',
    ];

    protected static function booted()
    {
        static::saving(function ($risk) {
            $inherent = $risk->likelihood * $risk->impact;
            // 1=Poor (100% risk), 2=Fair (80%), 3=Good (60%), 4=Very Good (40%), 5=Excellent (20%)
            // Let's use a standard reduction: Risk * (1 - ( (C-1) * 0.2 ))
            $reduction = ($risk->control_effectiveness - 1) * 0.2;
            $risk->residual_score = $inherent * (1 - $reduction);
        });
    }

    public function auditableEntity()
    {
        return $this->belongsTo(AuditableEntity::class);
    }

    public function getScoreAttribute(): int
    {
        return $this->likelihood * $this->impact;
    }
}
