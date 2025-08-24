<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class vehicle_list_details_homeowners extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_vehicle_list_details_homeowners';
    protected $primaryKey = 'id';
    protected $fillable = ['vehicle_homeowners_supporting_documents_id', 'plate_number', 'or_no', 'vehicle_model', 'cr_no', 'color_of_vehicle', 'vehicle_sticker_control_no','status'];

    public function vehicle_homeowners_supporting_documents()
    {
        return $this->belongsTo(vehicle_homeowners_supporting_documents::class, 'vehicle_homeowners_supporting_documents_id');
    }
}
