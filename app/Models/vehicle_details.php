<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class vehicle_details extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'vehicle_details';
    protected $fillable = ['vehicle_management_id', 'plate_number', 'or_number', 'cr_number', 'vehicle_model', 'color', 'sticker_control_number','status'];

    public function vehicle_management_list()
    {
        return $this->belongsTo(vehicle_management_list::class, 'vehicle_management_id');
    }
}
