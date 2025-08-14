<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbl_entry_data extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_entry_data';
    protected $primaryKey = 'id';
    protected $fillable = ['client_name', 'address', 'date', 'package', 'status'];
}
