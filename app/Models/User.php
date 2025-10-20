<?php

namespace App\Models;

use App\Traits\ActivityLogTrait;
use App\Traits\NotificationTrait;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, ActivityLogTrait, NotificationTrait;

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
        'date_of_birth',
        'civil_status',
        'number_of_months_stay',
        'telephone_number',
        'fb_account',
        'messenger_account',
        'prepared_contact',
        'caretaker_name',
        'caretaker_address',
        'caretaker_contact_number',
        'caretaker_email',
        'signature_image',
        'incase_of_emergency',
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
            return asset('storage/profiles/' . $this->photo);
        }
        return asset('img/user.jpg');
    }

    /**
     * Get avatar attribute for Chatify compatibility
     * Maps the photo field to avatar for Chatify
     */
    public function getAvatarAttribute()
    {
        return $this->photo_url;
    }

    /**
     * Check if user has permission for a specific module
     */
    public function hasPermission($moduleName)
    {
        // Check if user has an active permission setting
        $permissionSetting = \App\Models\permission_settings::where('users_id', $this->id)
            ->where('status', 'active')
            ->first();

        if (!$permissionSetting) {
            return false;
        }

        // Check if the permission setting has the specific module
        $hasModule = \App\Models\permission_settings_list::where('permission_settings_id', $permissionSetting->id)
            ->where('status', 'active')
            ->whereHas('module', function($query) use ($moduleName) {
                $query->where('module_name', $moduleName);
            })
            ->exists();

        return $hasModule;
    }

    /**
     * Get all modules the user has permission for
     */
    public function getPermissions()
    {
        $permissionSetting = \App\Models\permission_settings::where('users_id', $this->id)
            ->where('status', 'active')
            ->first();

        if (!$permissionSetting) {
            return collect();
        }

        return \App\Models\permission_settings_list::where('permission_settings_id', $permissionSetting->id)
            ->where('status', 'active')
            ->with('module')
            ->get()
            ->pluck('module.module_name');
    }

    /**
     * Check if user has landlord tenant access permission
     * This checks if they are linked to an approved landlord with active tenant access
     */
    public function hasLandlordTenantAccess()
    {
        // Find approved landlord submitted by this user
        $approvedLandlord = \App\Models\applied_landlord::where('submitted_by', $this->id)
            ->where('status', 'approved')
            ->first();

        if (!$approvedLandlord) {
            return false;
        }

        // Check if landlord has active tenant access permission
        $permission = \App\Models\landlord_permission::where('applied_landlord_id', $approvedLandlord->id)
            ->where('has_have_permission', 1)
            ->where('status', 'active')
            ->exists();

        return $permission;
    }
}
