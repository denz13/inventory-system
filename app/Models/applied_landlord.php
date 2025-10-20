<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class applied_landlord extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'applied_landlord';
    protected $primaryKey = 'id';
    
    protected $fillable = [
        // Personal Information
        'submitted_by',
        'first_name',
        'last_name',
        'middle_initial',
        'date_of_birth',
        'address',
        'civil_status',
        'nationality',
        'email',
        'phone_number',
        'years_of_residency',
        'business_clearance_attachments',
        
        // Property Information
        'property_name',
        'unit_number',
        'property_address',
        'unit_type',
        'floor_area',
        'unit_condition',
        'unit_condition_optional',
        
        // Other fields
        'supporting_documents',
        'status',
        'reason',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'floor_area' => 'decimal:2',
        'years_of_residency' => 'integer',
    ];
    
    // Accessor for full name
    public function getFullNameAttribute()
    {
        return trim("{$this->first_name} {$this->middle_initial} {$this->last_name}");
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }
}

