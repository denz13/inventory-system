<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class vehicle_homeowners extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_vehicle_homeowners';
    protected $primaryKey = 'id';
    protected $fillable = ['user_id', 'type_of_vehicle', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function supportingDocuments()
    {
        return $this->hasOne(vehicle_homeowners_supporting_documents::class, 'vehicle_homeowners_id');
    }

    public function vehicleDetails()
    {
        return $this->hasOneThrough(
            vehicle_list_details_homeowners::class,
            vehicle_homeowners_supporting_documents::class,
            'vehicle_homeowners_id', // Foreign key on vehicle_homeowners_supporting_documents table
            'vehicle_homeowners_supporting_documents_id', // Foreign key on vehicle_list_details_homeowners table
            'id', // Local key on vehicle_homeowners table
            'id' // Local key on vehicle_homeowners_supporting_documents table
        );
    }
}
