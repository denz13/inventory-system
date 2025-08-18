<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbl_service_management_complaints extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_service_management_complaints';
    protected $primaryKey = 'id';
    protected $fillable = ['service_management_category_id', 'user_id', 'complaint_description', 'status', 'reason'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function serviceCategory()
    {
        return $this->belongsTo(tbl_service_management_category::class, 'service_management_category_id', 'id');
    }

    public function getServiceTypeAttribute()
    {
        return $this->serviceCategory->serviceType ?? null;
    }
}
