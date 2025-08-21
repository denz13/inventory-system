<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\tbl_bank_account_type;

class tbl_bank_account_category extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_bank_account_category';
    protected $primaryKey = 'id';
    protected $fillable = [
        'bank_account_type_id',
        'account_name',
        'account_number',
        'qrcode_image',
        'status',
    ];

    public function bankAccountType()
    {
        return $this->belongsTo(tbl_bank_account_type::class, 'bank_account_type_id');
    }
}
