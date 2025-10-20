<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\ActivityLogTrait;

class sticker_control_number extends Model
{
    use HasFactory, SoftDeletes, ActivityLogTrait;

    protected $table = 'sticker_control_number';
    protected $primaryKey = 'id';
    protected $fillable = ['vehicle_list_details_homeowners_id', 'control_number','valid_until','status'];

    public function vehicle_list_details_homeowners()
    {
        return $this->belongsTo(vehicle_list_details_homeowners::class, 'vehicle_list_details_homeowners_id');
    }
}
