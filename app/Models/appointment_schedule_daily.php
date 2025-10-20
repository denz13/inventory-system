<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ActivityLogTrait;

class appointment_schedule_daily extends Model
{
    use HasFactory, ActivityLogTrait;

    protected $table = 'appointment_schedule_daily';
    protected $primaryKey = 'id';
    protected $fillable = ['allow_number_of_appointment', 'status'];

    public function scheduleDates()
    {
        return $this->hasMany(appointment_schedule_dates::class, 'appointment_schedule_daily_id');
    }
}
