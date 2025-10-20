<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ActivityLogTrait;
use Illuminate\Database\Eloquent\SoftDeletes;

class appointment_schedule_dates extends Model
{
    use HasFactory, ActivityLogTrait, SoftDeletes;

    protected $table = 'appointment_schedule_dates';
    protected $primaryKey = 'id';
    protected $fillable = ['appointment_schedule_daily_id', 'day', 'dates', 'status'];

    public function appointment_schedule_daily()
    {
        return $this->belongsTo(appointment_schedule_daily::class, 'appointment_schedule_daily_id');
    }
}
