<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbl_announcement extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_announcement';
    protected $primaryKey = 'id';
    protected $fillable = ['type', 'description', 'visible_to', 'status'];
}
