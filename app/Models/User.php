<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'street',
        'lot',
        'block',
        'contact_number',
        'membership_fee',
        'is_with_title',
        'gender',
        'email',
        'email_verified_at',
        'password',
        'photo',
        'role',
        'active',
        'remember_token',
        'is_online',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * The attributes that appends to returned entities.
     *
     * @var array
     */
    protected $appends = ['photo_url', 'avatar'];

    /**
     * The getter that return accessible URL for user photo.
     *
     * @var array
     */
    public function getPhotoUrlAttribute()
    {
        if (!empty($this->photo)) {
            return asset('uploads/profiles/' . $this->photo);
        }
        return asset('dist/images/preview-5.jpg');
    }

    /**
     * Get avatar attribute for Chatify compatibility
     * Maps the photo field to avatar for Chatify
     */
    public function getAvatarAttribute()
    {
        return $this->photo_url;
    }
}
