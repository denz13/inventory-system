<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class vehicle_homeowners_supporting_documents extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_vehicle_homeowners_supporting_documents';
    protected $primaryKey = 'id';
    protected $fillable = ['vehicle_homeowners_id', 'supporting_documents_attachments', 'status'];

    public function vehicle_homeowners()
    {
        return $this->belongsTo(vehicle_homeowners::class, 'vehicle_homeowners_id');
    }

    public function vehicleDetails()
    {
        return $this->hasOne(vehicle_list_details_homeowners::class, 'vehicle_homeowners_supporting_documents_id');
    }
}
