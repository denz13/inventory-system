<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class tbl_entry_data_product extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_entry_data_product';
    protected $primaryKey = 'id';
    protected $fillable = ['entry_data_id', 'description', 'quantity', 'rec_meter', 'qty', 'status'];

    public function entryData()
    {
        return $this->belongsTo(tbl_entry_data::class, 'entry_data_id', 'id');
    }
}
