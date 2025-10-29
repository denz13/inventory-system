<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbl_incident_report extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_incident_report';
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'person_involved_name',
        'address',
        'street',
        'designation',
        'datetime_of_incident',
        'location_of_incident',
        'guard_id',
        'reason',
        'status',
    ];

    public function assignedGuard()
    {
        return $this->belongsTo(User::class, 'guard_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
