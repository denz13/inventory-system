<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbl_service_management_category extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_service_management_category';
    protected $primaryKey = 'id';
    protected $fillable = ['service_management_type_id', 'category', 'status'];

    public function type()
    {
        return $this->belongsTo(tbl_service_management_type::class, 'service_management_type_id', 'id');
    }

    public function serviceType()
    {
        return $this->belongsTo(tbl_service_management_type::class, 'service_management_type_id', 'id');
    }
}
