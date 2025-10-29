<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\ActivityLogTrait;

class appointment_category extends Model
{
    use HasFactory, SoftDeletes, ActivityLogTrait;
    protected $table = 'appointment_category';
    protected $primaryKey = 'id';
    protected $fillable = ['category_name','for_role', 'status'];
}
