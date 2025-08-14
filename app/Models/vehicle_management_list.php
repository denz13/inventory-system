<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class vehicle_management_list extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'vehicle_management_list';
    protected $fillable = ['user_id','non_homeowners', 'type_of_vehicle', 'incase_of_emergency_name', 'incase_of_emergency_number', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
