<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbl_service_management_type extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_service_management_type';
    protected $primaryKey = 'id';
    protected $fillable = ['type', 'status'];
}
