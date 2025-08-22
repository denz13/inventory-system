@extends('layout._partials.master')

@section('content')
<div class="intro-y flex items-center mt-8">
    <h2 class="text-lg font-medium mr-auto">
        Profile Management
    </h2>
</div>

<!-- Notifications -->
<div class="intro-y col-span-12 mt-5">
    <x-notification-toast id="profile_toast_success" type="success" title="Success" message="Profile updated successfully"
        :showButton="false" />
    <x-notification-toast id="profile_toast_error" type="error" title="Error" :showButton="false">
        <div id="profile_error_message_slot" class="text-slate-500 mt-1"></div>
    </x-notification-toast>
    <style>
        .toastify {
            background: transparent !important;
            box-shadow: none !important;
        }
        
        /* Ensure notification toast content is visible */
        .toastify-content {
            color: #000 !important;
            background: #fff !important;
            padding: 1rem !important;
            border-radius: 0.5rem !important;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }
        
        .toastify-content .font-medium {
            font-weight: 600 !important;
            font-size: 1rem !important;
            margin-bottom: 0.5rem !important;
            color: #1f2937 !important;
        }
        
        .toastify-content .text-slate-500 {
            color: #6b7280 !important;
            font-size: 0.875rem !important;
        }
    </style>
</div>

<div class="intro-y box px-5 pt-5 mt-5">
    <div class="flex flex-col lg:flex-row border-b border-slate-200/60 dark:border-darkmode-400 pb-5 -mx-5">
        <div class="flex flex-1 px-5 items-center justify-center lg:justify-start">
            <div class="w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative cursor-pointer" onclick="document.getElementById('profile-photo-input').click()">
                <img alt="Profile Image" class="rounded-full w-full h-full object-cover" src="{{ $user->photo_url }}" id="profile-image-preview">
                <!-- Camera Icon Overlay -->
                <div class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <div class="bg-white rounded-full p-2 border-2 border-black shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                        </svg>
                    </div>
                </div>
                <!-- Hidden File Input -->
                <input type="file" id="profile-photo-input" accept="image/*" class="hidden" onchange="handleProfilePhotoUpload(this)">
                
                <!-- Hidden Modal Trigger -->
                <a href="javascript:;" id="photo-modal-trigger" data-tw-toggle="modal" data-tw-target="#photo-upload-modal" class="hidden"></a>
            </div>
            <div class="ml-5">
                <div class="w-24 sm:w-40 truncate sm:whitespace-normal font-medium text-lg">{{ $user->name }}</div>
                <div class="text-slate-500">{{ $user->role ?? 'User' }}</div>
            </div>
        </div>
        <div class="mt-6 lg:mt-0 flex-1 px-5 border-l border-r border-slate-200/60 dark:border-darkmode-400 border-t lg:border-t-0 pt-5 lg:pt-0">
            <div class="font-medium text-center lg:text-left lg:mt-3">Contact Details</div>
            <div class="flex flex-col justify-center items-center lg:items-start mt-4">
                <div class="truncate sm:whitespace-normal flex items-center"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="mail" data-lucide="mail" class="lucide lucide-mail w-4 h-4 mr-2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> {{ $user->email }} </div>
                <div class="truncate sm:whitespace-normal flex items-center mt-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="phone" data-lucide="phone" class="lucide lucide-phone w-4 h-4 mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> {{ $user->contact_number ?? 'Not provided' }} </div>
                <div class="truncate sm:whitespace-normal flex items-center mt-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="map-pin" data-lucide="map-pin" class="lucide lucide-map-pin w-4 h-4 mr-2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> 
                @if($user->street || $user->lot || $user->block)
                    {{ trim(($user->lot ? 'Lot ' . $user->lot : '') . ($user->block ? ' Block ' . $user->block : '') . ($user->street ? ' ' . $user->street : '')) }}
                @else
                    Address not provided
                @endif
                </div>
            </div>
        </div>
        <div class="mt-6 lg:mt-0 flex-1 flex items-center justify-center px-5 border-t lg:border-0 border-slate-200/60 dark:border-darkmode-400 pt-5 lg:pt-0">
            <div class="text-center rounded-md w-20 py-3">
                <div class="font-medium text-primary text-xl">{{ $stats['orders'] }}</div>
                <div class="text-slate-500">With Title</div>
            </div>
            <div class="text-center rounded-md w-20 py-3">
                <div class="font-medium text-primary text-xl">₱{{ $stats['purchases'] }}</div>
                <div class="text-slate-500">Membership</div>
            </div>
            <div class="text-center rounded-md w-20 py-3">
                <div class="font-medium text-primary text-xl">{{ $stats['reviews'] }}</div>
                <div class="text-slate-500">Gender</div>
            </div>
        </div>
    </div>
    <ul class="nav nav-link-tabs flex-col sm:flex-row justify-center lg:justify-start text-center" role="tablist">
        <li id="profile-tab" class="nav-item" role="presentation">
            <a href="javascript:;" class="nav-link py-4 flex items-center active" data-tw-target="#profile" aria-controls="profile" aria-selected="true" role="tab"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="user" class="lucide lucide-user w-4 h-4 mr-2" data-lucide="user"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Profile </a>
        </li>
        <li id="add-business-tab" class="nav-item" role="presentation">
            <a href="javascript:;" class="nav-link py-4 flex items-center" data-tw-target="#add-business" aria-selected="false" role="tab"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="shield" class="lucide lucide-shield w-4 h-4 mr-2" data-lucide="shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Add Business </a>
        </li>
        <li id="add-tenant-tab" class="nav-item" role="presentation">
            <a href="javascript:;" class="nav-link py-4 flex items-center" data-tw-target="#add-tenant" aria-selected="false" role="tab"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="users" class="lucide lucide-users w-4 h-4 mr-2" data-lucide="users"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg> Add Tenant </a>
        </li>
        <li id="change-password-tab" class="nav-item" role="presentation">
            <a href="javascript:;" class="nav-link py-4 flex items-center" data-tw-target="#change-password" aria-selected="false" role="tab"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="lock" class="lucide lucide-lock w-4 h-4 mr-2" data-lucide="lock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg> Change Password </a>
        </li>

        <li id="settings-tab" class="nav-item" role="presentation">
            <a href="javascript:;" class="nav-link py-4 flex items-center" data-tw-target="#settings" aria-selected="false" role="tab"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="settings" class="lucide lucide-settings w-4 h-4 mr-2" data-lucide="settings"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg> Settings </a>
        </li>
    </ul>
</div>

<div class="tab-content mt-5">
    <!-- BEGIN: Profile Tab -->
    <div id="profile" class="tab-pane active" role="tabpanel" aria-labelledby="profile-tab">
        <div class="grid grid-cols-12 gap-6">
            <!-- BEGIN: Personal Information -->
            <div class="intro-y box col-span-12 lg:col-span-6">
                <div class="flex items-center px-5 py-5 sm:py-3 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">
                        Personal Information
                    </h2>
                    <button class="btn btn-outline-secondary hidden sm:flex" id="editProfileBtn">Edit Profile</button>
                </div>
                <div class="p-5">
                    <form id="editProfileForm" style="display: none;">
                        @csrf
                        <div class="space-y-5">
                            <div class="mb-5">
                                <label class="form-label font-medium">Name *</label>
                                <input type="text" class="form-control" name="name" value="{{ $user->name ?? '' }}" placeholder="Enter name" required>
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Email *</label>
                                <input type="email" class="form-control" name="email" value="{{ $user->email ?? '' }}" placeholder="Enter email" required>
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Contact Number</label>
                                <input type="text" class="form-control" name="contact_number" value="{{ $user->contact_number ?? '' }}" placeholder="Enter contact number">
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Gender</label>
                                <select class="form-select" name="gender">
                                    <option value="">Select gender</option>
                                    <option value="male" {{ ($user->gender ?? '') == 'male' ? 'selected' : '' }}>Male</option>
                                    <option value="female" {{ ($user->gender ?? '') == 'female' ? 'selected' : '' }}>Female</option>
                                    <option value="other" {{ ($user->gender ?? '') == 'other' ? 'selected' : '' }}>Other</option>
                                </select>
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Street</label>
                                <input type="text" class="form-control" name="street" value="{{ $user->street ?? '' }}" placeholder="Enter street">
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Lot</label>
                                <input type="text" class="form-control" name="lot" value="{{ $user->lot ?? '' }}" placeholder="Enter lot number">
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Block</label>
                                <input type="text" class="form-control" name="block" value="{{ $user->block ?? '' }}" placeholder="Enter block number">
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Date of Birth</label>
                                <input type="date" name="date_of_birth" class="form-control" value="{{ $user->date_of_birth ?? '' }}">
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Civil Status</label>
                                <select name="civil_status" class="form-select">
                                    <option value="">Select status</option>
                                    <option value="single" {{ ($user->civil_status ?? '') == 'single' ? 'selected' : '' }}>Single</option>
                                    <option value="married" {{ ($user->civil_status ?? '') == 'married' ? 'selected' : '' }}>Married</option>
                                    <option value="widowed" {{ ($user->civil_status ?? '') == 'widowed' ? 'selected' : '' }}>Widowed</option>
                                    <option value="divorced" {{ ($user->civil_status ?? '') == 'divorced' ? 'selected' : '' }}>Divorced</option>
                                </select>
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Number of Months Stay</label>
                                <input type="text" name="number_of_months_stay" class="form-control" value="{{ $user->number_of_months_stay ?? '' }}" placeholder="Enter months">
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Telephone Number</label>
                                <input type="text" name="telephone_number" class="form-control" value="{{ $user->telephone_number ?? '' }}" placeholder="Enter telephone number">
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Facebook Account</label>
                                <input type="text" name="fb_account" class="form-control" value="{{ $user->fb_account ?? '' }}" placeholder="Enter Facebook account">
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Messenger Account</label>
                                <input type="text" name="messenger_account" class="form-control" value="{{ $user->messenger_account ?? '' }}" placeholder="Enter Messenger account">
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Prepared Contact</label>
                                <input type="text" name="prepared_contact" class="form-control" value="{{ $user->prepared_contact ?? '' }}" placeholder="Enter prepared contact">
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Caretaker Name</label>
                                <input type="text" name="caretaker_name" class="form-control" value="{{ $user->caretaker_name ?? '' }}" placeholder="Enter caretaker name">
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Caretaker Address</label>
                                <textarea name="caretaker_address" class="form-control" rows="2" placeholder="Enter caretaker address">{{ $user->caretaker_address ?? '' }}</textarea>
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Caretaker Contact Number</label>
                                <input type="text" name="caretaker_contact_number" class="form-control" value="{{ $user->caretaker_contact_number ?? '' }}" placeholder="Enter caretaker contact">
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Caretaker Email</label>
                                <input type="email" name="caretaker_email" class="form-control" value="{{ $user->caretaker_email ?? '' }}" placeholder="Enter caretaker email">
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">In Case of Emergency</label>
                                <input type="text" name="incase_of_emergency" class="form-control" value="{{ $user->incase_of_emergency ?? '' }}" placeholder="Enter emergency contact">
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">Membership Fee</label>
                                <div class="mt-1 text-slate-600">{{ $user->membership_fee ?? 'Not provided' }}</div>
                            </div>
                            <div class="mb-5">
                                <label class="form-label font-medium">With Title</label>
                                <div class="mt-1 text-slate-600">
                                    <span class="px-2 py-1 rounded-full text-xs {{ ($user->is_with_title ?? '') == 'yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' }}">
                                        {{ ($user->is_with_title ?? '') == 'yes' ? 'Yes' : 'No' }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex justify-end space-x-2">
                                <button type="button" class="btn btn-outline-secondary" id="cancelEditProfile">Cancel</button>
                                <button type="submit" class="btn btn-primary">Update Profile</button>
                            </div>
                        </div>
                    </form>
                    
                    <div id="profileDisplay">
                        <div class="space-y-5">
                            <!-- Name -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Name</label>
                                <div class="mt-1 text-slate-600" data-field="name">{{ $user->name ?? 'Not provided' }}</div>
                            </div>
                            <!-- Email -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Email</label>
                                <div class="mt-1 text-slate-600" data-field="email">{{ $user->email ?? 'Not provided' }}</div>
                            </div>
                            <!-- Contact Number -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Contact Number</label>
                                <div class="mt-1 text-slate-600" data-field="contact_number">{{ $user->contact_number ?? 'Not provided' }}</div>
                            </div>
                            <!-- Role -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Role</label>
                                <div class="mt-1 text-slate-600" data-field="role">{{ $user->role ?? 'Not provided' }}</div>
                            </div>
                            <!-- Gender -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Gender</label>
                                <div class="mt-1 text-slate-600" data-field="gender">{{ ucfirst($user->gender ?? 'Not provided') }}</div>
                            </div>
                            <!-- Active Status -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Active Status</label>
                                <div class="mt-1" data-field="active">
                                    <span class="px-2 py-1 rounded-full text-xs {{ $user->active == 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                                        {{ $user->active == 'yes' ? 'Active' : 'Inactive' }}
                                    </span>
                                </div>
                            </div>
                            <!-- Street -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Street</label>
                                <div class="mt-1 text-slate-600" data-field="street">{{ $user->street ?? 'Not provided' }}</div>
                            </div>
                            <!-- Lot -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Lot</label>
                                <div class="mt-1 text-slate-600" data-field="lot">{{ $user->lot ?? 'Not provided' }}</div>
                            </div>
                            <!-- Block -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Block</label>
                                <div class="mt-1 text-slate-600" data-field="block">{{ $user->block ?? 'Not provided' }}</div>
                            </div>
                            <!-- Date of Birth -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Date of Birth</label>
                                <div class="mt-1 text-slate-600" data-field="date_of_birth">{{ $user->date_of_birth ? \Carbon\Carbon::parse($user->date_of_birth)->format('M d, Y') : 'Not provided' }}</div>
                            </div>
                            <!-- Civil Status -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Civil Status</label>
                                <div class="mt-1 text-slate-600" data-field="civil_status">{{ ucfirst($user->civil_status ?? 'Not provided') }}</div>
                            </div>
                            <!-- Number of Months Stay -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Number of Months Stay</label>
                                <div class="mt-1 text-slate-600" data-field="number_of_months_stay">{{ $user->number_of_months_stay ?? 'Not provided' }}</div>
                            </div>
                            <!-- Telephone Number -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Telephone Number</label>
                                <div class="mt-1 text-slate-600" data-field="telephone_number">{{ $user->telephone_number ?? 'Not provided' }}</div>
                            </div>
                            <!-- Facebook Account -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Facebook Account</label>
                                <div class="mt-1 text-slate-600" data-field="fb_account">{{ $user->fb_account ?? 'Not provided' }}</div>
                            </div>
                            <!-- Messenger Account -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Messenger Account</label>
                                <div class="mt-1 text-slate-600" data-field="messenger_account">{{ $user->messenger_account ?? 'Not provided' }}</div>
                            </div>
                            <!-- Prepared Contact -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Prepared Contact</label>
                                <div class="mt-1 text-slate-600" data-field="prepared_contact">{{ $user->prepared_contact ?? 'Not provided' }}</div>
                            </div>
                            <!-- Caretaker Name -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Caretaker Name</label>
                                <div class="mt-1 text-slate-600" data-field="caretaker_name">{{ $user->caretaker_name ?? 'Not provided' }}</div>
                            </div>
                            <!-- Caretaker Address -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Caretaker Address</label>
                                <div class="mt-1 text-slate-600" data-field="caretaker_address">{{ $user->caretaker_address ?? 'Not provided' }}</div>
                            </div>
                            <!-- Caretaker Contact Number -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Caretaker Contact Number</label>
                                <div class="mt-1 text-slate-600" data-field="caretaker_contact_number">{{ $user->caretaker_contact_number ?? 'Not provided' }}</div>
                            </div>
                            <!-- Caretaker Email -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Caretaker Email</label>
                                <div class="mt-1 text-slate-600" data-field="caretaker_email">{{ $user->caretaker_email ?? 'Not provided' }}</div>
                            </div>
                            <!-- In Case of Emergency -->
                            <div class="mb-5">
                                <label class="form-label font-medium">In Case of Emergency</label>
                                <div class="mt-1 text-slate-600" data-field="incase_of_emergency">{{ $user->incase_of_emergency ?? 'Not provided' }}</div>
                            </div>
                            <!-- Membership Fee -->
                            <div class="mb-5">
                                <label class="form-label font-medium">Membership Fee</label>
                                <div class="mt-1 text-slate-600" data-field="membership_fee">₱{{ number_format($user->membership_fee ?? 0, 2) }}</div>
                            </div>
                            <!-- With Title -->
                            <div class="mb-5">
                                <label class="form-label font-medium">With Title</label>
                                <div class="mt-1" data-field="is_with_title">
                                    <span class="px-2 py-1 rounded-full text-xs {{ $user->is_with_title == 'yes' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800' }}">
                                        {{ $user->is_with_title == 'yes' ? 'Yes' : 'No' }}
                                    </span>
                                </div>
                            </div>
                                </div>
                            </div>
                </div>
            </div>
            <!-- END: Personal Information -->
            
            <!-- BEGIN: Recent Activity -->
            <div class="intro-y box col-span-12 lg:col-span-6">
                <div class="flex items-center px-5 py-5 sm:py-0 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">
                        Recent Activity
                    </h2>
                </div>
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="border-l-2 border-primary dark:border-primary pl-4">
                            <a href="" class="font-medium">Profile Updated</a> 
                            <div class="text-slate-500">10:00 AM</div>
                        </div>
                        <div class="form-check form-switch ml-auto">
                            <div class="w-3 h-3 bg-success rounded-full"></div>
                        </div>
                    </div>
                    <div class="flex items-center mt-5">
                        <div class="border-l-2 border-primary dark:border-primary pl-4">
                            <a href="" class="font-medium">Password Changed</a> 
                            <div class="text-slate-500">02:00 PM</div>
                        </div>
                        <div class="form-check form-switch ml-auto">
                            <div class="w-3 h-3 bg-success rounded-full"></div>
                        </div>
                    </div>
                    <div class="flex items-center mt-5">
                        <div class="border-l-2 border-primary dark:border-primary pl-4">
                            <a href="" class="font-medium">Settings Updated</a> 
                            <div class="text-slate-500">04:00 PM</div>
                        </div>
                        <div class="form-check form-switch ml-auto">
                            <div class="w-3 h-3 bg-success rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END: Recent Activity -->
        </div>
    </div>
    <!-- END: Profile Tab -->
    
    <!-- BEGIN: Account Tab -->
    <div id="account" class="tab-pane" role="tabpanel" aria-labelledby="account-tab">
        <div class="intro-y box">
            <div class="flex items-center px-5 py-5 sm:py-3 border-b border-slate-200/60 dark:border-darkmode-400">
                <h2 class="font-medium text-base mr-auto">
                    Account Settings
                </h2>
            </div>
            <div class="p-5">
                <form id="accountForm">
                    @csrf
                    <div class="grid grid-cols-12 gap-6">
                        <div class="col-span-12 sm:col-span-6">
                            <label for="accountName" class="form-label">Full Name</label>
                            <input id="accountName" name="name" type="text" class="form-control" value="{{ $user->name }}" required>
                        </div>
                        <div class="col-span-12 sm:col-span-6">
                            <label for="accountEmail" class="form-label">Email</label>
                            <input id="accountEmail" name="email" type="email" class="form-control" value="{{ $user->email }}" required>
                        </div>
                        <div class="col-span-12 sm:col-span-6">
                            <label for="accountPhone" class="form-label">Phone Number</label>
                            <input id="accountPhone" name="phone" type="text" class="form-control" value="{{ $user->phone ?? '' }}">
                        </div>
                        <div class="col-span-12 sm:col-span-6">
                            <label for="accountAddress" class="form-label">Address</label>
                            <input id="accountAddress" name="address" type="text" class="form-control" value="{{ $user->address ?? '' }}">
                        </div>
                        <div class="col-span-12">
                            <label for="accountBio" class="form-label">Bio</label>
                            <textarea id="accountBio" name="bio" class="form-control" rows="4" placeholder="Tell us about yourself...">{{ $user->bio ?? '' }}</textarea>
                        </div>
                    </div>
                    <div class="flex justify-end mt-6">
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- END: Account Tab -->
    
    <!-- BEGIN: Change Password Tab -->
    <div id="change-password" class="tab-pane" role="tabpanel" aria-labelledby="change-password-tab">
        <div class="intro-y box">
            <div class="flex items-center px-5 py-5 sm:py-3 border-b border-slate-200/60 dark:border-darkmode-400">
                <h2 class="font-medium text-base mr-auto">
                    Change Password
                </h2>
            </div>
            <div class="p-5">
                <form id="changePasswordForm">
                    @csrf
                    <div class="mt-3">
                        <label for="currentPassword" class="form-label">Current Password</label>
                        <input id="currentPassword" name="current_password" type="password" class="form-control" required>
                    </div>
                    <div class="mt-3">
                        <label for="newPassword" class="form-label">New Password</label>
                        <input id="newPassword" name="new_password" type="password" class="form-control" required>
                    </div>
                    <div class="mt-3">
                        <label for="confirmPassword" class="form-label">Confirm New Password</label>
                        <input id="confirmPassword" name="new_password_confirmation" type="password" class="form-control" required>
                    </div>
                    <div class="flex justify-end mt-6">
                        <button type="submit" class="btn btn-primary">Change Password</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- END: Change Password Tab -->
    
    <!-- BEGIN: Settings Tab -->
    <div id="settings" class="tab-pane" role="tabpanel" aria-labelledby="settings-tab">
        <div class="intro-y box">
            <div class="flex items-center px-5 py-5 sm:py-3 border-b border-slate-200/60 dark:border-darkmode-400">
                <h2 class="font-medium text-base mr-auto">
                    Privacy & Security Settings
                </h2>
            </div>
            <div class="p-5">
                <div class="border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                    <div class="font-medium text-base">Privacy Settings</div>
                    <div class="mt-4">
                        <div class="flex items-center mt-3">
                            <div class="mr-auto">
                                <div class="font-medium">Profile Visibility</div>
                                <div class="text-slate-500 text-xs mt-0.5">Make your profile visible to other users</div>
                            </div>
                            <div class="form-check form-switch ml-6">
                                <input class="form-check-input" type="checkbox" checked>
                            </div>
                        </div>
                        <div class="flex items-center mt-3">
                            <div class="mr-auto">
                                <div class="font-medium">Email Notifications</div>
                                <div class="text-slate-500 text-xs mt-0.5">Receive email notifications for important updates</div>
                            </div>
                            <div class="form-check form-switch ml-6">
                                <input class="form-check-input" type="checkbox" checked>
                            </div>
                        </div>
                        <div class="flex items-center mt-3">
                            <div class="mr-auto">
                                <div class="font-medium">SMS Notifications</div>
                                <div class="text-slate-500 text-xs mt-0.5">Receive SMS notifications for critical alerts</div>
                            </div>
                            <div class="form-check form-switch ml-6">
                                <input class="form-check-input" type="checkbox">
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="font-medium text-base">Security Settings</div>
                    <div class="mt-4">
                        <div class="flex items-center mt-3">
                            <div class="mr-auto">
                                <div class="font-medium">Two-Factor Authentication</div>
                                <div class="text-slate-500 text-xs mt-0.5">Add an extra layer of security to your account</div>
                            </div>
                            <button class="btn btn-outline-primary ml-6">Enable</button>
                        </div>
                        <div class="flex items-center mt-3">
                            <div class="mr-auto">
                                <div class="font-medium">Login Alerts</div>
                                <div class="text-slate-500 text-xs mt-0.5">Get notified when someone logs into your account</div>
                            </div>
                            <div class="form-check form-switch ml-6">
                                <input class="form-check-input" type="checkbox" checked>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Settings Tab -->

    <!-- BEGIN: Add Tenant Tab -->
    <div id="add-tenant" class="tab-pane" role="tabpanel" aria-labelledby="add-tenant-tab">
        <div class="grid grid-cols-12 gap-6">
            <!-- BEGIN: Add Tenant Form -->
            <div class="intro-y box col-span-12 lg:col-span-6">
                <div class="flex items-center px-5 py-5 sm:py-3 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">
                        Add New Tenant
                    </h2>
                </div>
                <div class="p-5">
                    <form id="addTenantForm">
                        @csrf
                        <div class="grid grid-cols-1 gap-5">
                            <div>
                                <label for="tenantFullName" class="form-label">Full Name *</label>
                                <input id="tenantFullName" name="full_name" type="text" class="form-control" required>
                            </div>
                            <div>
                                <label for="tenantRelationship" class="form-label">Relationship</label>
                                <select id="tenantRelationship" name="relationship" class="form-select">
                                    <option value="">Select Relationship</option>
                                    <option value="spouse">Spouse</option>
                                    <option value="child">Child</option>
                                    <option value="parent">Parent</option>
                                    <option value="sibling">Sibling</option>
                                    <option value="relative">Relative</option>
                                    <option value="friend">Friend</option>
                                    <option value="boarder">Boarder</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label for="tenantContact" class="form-label">Contact Number</label>
                                <input id="tenantContact" name="contact_number" type="text" class="form-control" placeholder="09XXXXXXXXX">
                            </div>
                            <div>
                                <label for="tenantEmail" class="form-label">Email</label>
                                <input id="tenantEmail" name="email" type="email" class="form-control" placeholder="example@email.com">
                            </div>
                            <div>
                                <label for="tenantPhoto" class="form-label">Photo</label>
                                <input id="tenantPhoto" name="photo" type="file" class="form-control" accept="image/*">
                                <div class="form-help mt-1">Optional: Upload a photo of the tenant (max 5MB)</div>
                            </div>
                        </div>
                        <div class="flex justify-end mt-6">
                            <button type="button" class="btn btn-outline-secondary mr-2" id="resetTenantForm">Reset</button>
                            <button type="submit" class="btn btn-primary">Add Tenant</button>
                        </div>
                    </form>
                </div>
            </div>
            <!-- END: Add Tenant Form -->
            
            <!-- BEGIN: Tenant List -->
            <div class="intro-y box col-span-12 lg:col-span-6">
                <div class="flex items-center px-5 py-5 sm:py-3 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">
                        My Tenants
                    </h2>
                    <div class="w-56 relative text-slate-500">
                        <input type="text" id="tenantSearch" class="form-control w-56 box pr-10" placeholder="Search tenants...">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> 
                    </div>
                </div>
                <div class="p-5" style="max-height: 600px; overflow-y: auto;">
                    <div id="tenantsList">
                        @if(isset($tenants) && $tenants->count() > 0)
                            @foreach($tenants as $tenant)
                                <div class="tenant-item border-b border-slate-200/60 py-4 last:border-b-0" data-tenant-id="{{ $tenant->id }}">
                                    <div class="flex items-center">
                                        <div class="w-12 h-12 flex-none image-fit">
                                            @if($tenant->photo)
                                                <img alt="{{ $tenant->full_name }}" class="rounded-full w-full h-full object-cover" src="{{ Storage::url('public/tenants/' . $tenant->photo) }}">
                                            @else
                                                <div class="rounded-full w-full h-full bg-slate-200 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-slate-400"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                </div>
                                            @endif
                                        </div>
                                        <div class="ml-4 flex-1">
                                            <div class="font-medium">{{ $tenant->full_name }}</div>
                                            <div class="text-slate-500 text-xs mt-0.5">
                                                {{ $tenant->relationship ? ucfirst($tenant->relationship) : 'No relationship set' }}
                                            </div>
                                            @if($tenant->contact_number || $tenant->email)
                                                <div class="text-slate-500 text-xs mt-1">
                                                    @if($tenant->contact_number)
                                                        <span>{{ $tenant->contact_number }}</span>
                                                    @endif
                                                    @if($tenant->email)
                                                        <span class="ml-2">{{ $tenant->email }}</span>
                                                    @endif
                                                </div>
                                            @endif
                                        </div>
                                        <div class="flex items-center">
                                            <span class="px-2 py-1 rounded-full text-xs {{ $tenant->status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                                                {{ ucfirst($tenant->status) }}
                                            </span>
                                            <div class="dropdown ml-3">
                                                <button class="dropdown-toggle btn px-2 py-1 box" aria-expanded="false" data-tw-toggle="dropdown">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                            </button>
                            <div class="dropdown-menu w-40">
                                <ul class="dropdown-content">
                                    <li>
                                                            <a href="javascript:;" class="dropdown-item edit-tenant" data-tenant-id="{{ $tenant->id }}">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                                                Edit
                                                            </a>
                                    </li>
                                                                                            <li>
                                                            <a href="javascript:;" class="dropdown-item delete-tenant text-danger" data-tw-toggle="modal" data-tw-target="#delete-tenant-modal" data-tenant-id="{{ $tenant->id }}">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                                Delete
                                                            </a>
                                                        </li>
                                </ul>
                            </div>
                        </div>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        @else
                            <div class="text-center py-8">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 mx-auto text-slate-300 mb-4"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
                                <p class="text-slate-500">No tenants added yet</p>
                                <p class="text-slate-400 text-sm">Use the form on the left to add your first tenant</p>
                            </div>
                        @endif
                    </div>
                </div>
                                            </div>
            <!-- END: Tenant List -->
                                            </div>
                                            </div>
                                        </div>



<!-- Delete Tenant Confirmation Modal -->
<div id="delete-tenant-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body px-5 py-10">
                <div class="text-center">
                    <div class="mb-5">Are you sure you want to delete this tenant?</div>
                    <p class="text-red-600 font-medium mb-4" id="deleteTenantName">Tenant Name</p>
                    <input type="hidden" id="deleteTenantId" />
                    <button type="button" id="confirmDeleteTenant" class="btn btn-danger w-24 mr-2">Delete</button>
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Edit Tenant Modal -->
<div id="edit-tenant-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Edit Tenant</h2>
                <button type="button" class="btn btn-outline-secondary w-8 h-8 mr-1" data-tw-dismiss="modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                                        </div>
            <div class="modal-body px-5 py-5">
                <form id="editTenantForm">
                    @csrf
                    <input type="hidden" id="editTenantId" name="tenant_id">
                    <div class="grid grid-cols-1 gap-5">
                        <div>
                            <label for="editTenantFullName" class="form-label">Full Name *</label>
                            <input id="editTenantFullName" name="full_name" type="text" class="form-control" required>
                    </div>
                        <div>
                            <label for="editTenantRelationship" class="form-label">Relationship</label>
                            <select id="editTenantRelationship" name="relationship" class="form-select">
                                <option value="">Select Relationship</option>
                                <option value="spouse">Spouse</option>
                                <option value="child">Child</option>
                                <option value="parent">Parent</option>
                                <option value="sibling">Sibling</option>
                                <option value="relative">Relative</option>
                                <option value="friend">Friend</option>
                                <option value="boarder">Boarder</option>
                                <option value="other">Other</option>
                        </select>
                        </div>
                        <div>
                            <label for="editTenantContact" class="form-label">Contact Number</label>
                            <input id="editTenantContact" name="contact_number" type="text" class="form-control" placeholder="09XXXXXXXXX">
                        </div>
                        <div>
                            <label for="editTenantEmail" class="form-label">Email</label>
                            <input id="editTenantEmail" name="email" type="email" class="form-control" placeholder="example@email.com">
                        </div>
                        <div>
                            <label for="editTenantPhoto" class="form-label">Photo</label>
                            <input id="editTenantPhoto" name="photo" type="file" class="form-control" accept="image/*">
                            <div class="form-help mt-1">Optional: Upload a new photo (max 5MB) - leave empty to keep current photo</div>
                            <div id="editCurrentPhoto" class="mt-3" style="display: none;">
                                <label class="form-label">Current Photo:</label>
                                <div class="w-16 h-16 image-fit">
                                    <img id="editCurrentPhotoImg" class="rounded-full w-full h-full object-cover border-2 border-slate-200" src="" alt="Current Photo">
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary w-20 mr-1" data-tw-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary w-20" id="updateTenantBtn">Update</button>
            </div>
        </div>
                </div>
</div>

<!-- Photo Upload Confirmation Modal -->
<div id="photo-upload-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Change Profile Photo</h2>
                <button type="button" class="btn btn-outline-secondary w-8 h-8 mr-1" data-tw-dismiss="modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="modal-body px-5 py-10">
                <div class="text-center">
                    <div class="w-32 h-32 mx-auto mb-4 relative">
                        <img id="modal-photo-preview" class="rounded-full w-full h-full object-cover border-2 border-slate-200" src="" alt="Photo Preview">
                    </div>
                    <p class="text-slate-600 mb-4">Do you want to upload this photo as your new profile picture?</p>
                    <div class="flex justify-center space-x-3">
                        <button type="button" class="btn btn-outline-secondary w-24" data-tw-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary w-24" id="confirm-upload-btn">Upload</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

@push('scripts')
    <!-- Toastify for notifications -->
    <script src="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.css">
    
    <script src="{{ asset('js/profile-management/profile-management.js') }}"></script>
@endpush