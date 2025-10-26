<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\ActivityLogTrait;

class appointment extends Model
{
    use HasFactory, SoftDeletes, ActivityLogTrait;

    protected $table = 'appointment';
    protected $primaryKey = 'id';
    protected $fillable = ['appointment_category_id', 'time','users_id', 'description', 'appointment_date', 'tracking_number', 'status', 'remarks'];

    public function users()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function appointmentCategory()
    {
        return $this->belongsTo(appointment_category::class, 'appointment_category_id');
    }
}
