<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbl_appointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_appointment';
    protected $primaryKey = 'id';
    protected $fillable = ['description', 'appointment_date', 'tracking_number', 'remarks', 'status', 'is_expired'];

}
