@extends('layout._partials.master')

@section('content')
<div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12">
        <div class="intro-y text-lg font-medium mt-5">
            User Management
        </div>
    </div>

    <!-- Notifications -->
    <div class="intro-y col-span-12">
        <x-notification-toast id="users_toast_success" type="success" title="Success" message="User saved successfully"
            :showButton="false" />
        <x-notification-toast id="users_toast_error" type="error" title="Error" :showButton="false">
            <div id="users-error-message-slot" class="text-slate-500 mt-1"></div>
        </x-notification-toast>
            <style>
                .toastify {
                    background: transparent !important;
                    box-shadow: none !important;
                }
                
                /* Toggle Switch Styles */
                .user-status-toggle:checked ~ .block {
                    background-color: #10b981;
                }
                
                .user-status-toggle:checked ~ .dot {
                    transform: translateX(100%);
                }
                
                .dot {
                    transition: transform 0.3s ease;
                }
            </style>
            </div>
    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <button class="btn btn-primary shadow-md mr-2" data-tw-toggle="modal" data-tw-target="#add-user-modal">Add New
            User</button>
        
        <!-- Role Filter Dropdown -->
        <div class="dropdown mr-2">
            <button class="dropdown-toggle btn btn-outline-secondary w-full sm:w-auto" aria-expanded="false" data-tw-toggle="dropdown">
                <span id="filterButtonText">Filter by Role</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 ml-2 inline-block">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            <div class="dropdown-menu w-56">
                <ul class="dropdown-content">
                    <li>
                        <a href="javascript:;" class="dropdown-item role-filter-item" data-role="">
                            All Roles
                        </a>
                    </li>
                    @if($roles->isNotEmpty())
                        <li><hr class="dropdown-divider"></li>
                        @foreach($roles as $role)
                            <li>
                                <a href="javascript:;" class="dropdown-item role-filter-item" data-role="{{ $role }}">
                                    {{ ucwords($role) }}
                                </a>
                            </li>
                        @endforeach
                    @endif
                </ul>
            </div>
        </div>

        <!-- BEGIN: Add User Modal -->
        <div id="add-user-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <!-- Modal Header -->
                    <div class="modal-header">
                        <h2 class="font-medium text-base mr-auto">Add New User</h2>
                        <button type="button" class="btn btn-outline-secondary w-8 h-8" data-tw-dismiss="modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="modal-body px-6 py-6">
                        <form id="addUserForm" method="POST" action="{{ route('usermanagement.store') }}" enctype="multipart/form-data">
                            <input type="hidden" name="_token" value="{{ csrf_token() }}">

                            <!-- Personal Information Section -->
                            <div class="mb-6">
                                <!-- <h3 class="font-medium text-lg mb-4 text-slate-700 border-b pb-2">Personal Information</h3> -->
                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label font-medium">Full Name *</label>
                                        <input type="text" name="name" class="form-control" placeholder="Enter full name" required>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label font-medium">Email Address *</label>
                                        <input type="email" name="email" class="form-control" placeholder="Enter email address" required>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label font-medium">Password *</label>
                                        <input type="password" name="password" class="form-control" placeholder="Minimum 6 characters" required>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label font-medium">Contact Number</label>
                                        <input type="text" name="contact_number" class="form-control" placeholder="Enter contact number">
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label font-medium">Gender *</label>
                                        <select name="gender" class="form-select" required>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label font-medium">Role</label>
                                        <select name="role" class="form-select">
                                            <option value="">Select Role</option>
                                            <option value="admin">Admin</option>
                                            <option value="home owners">Home Owners</option>
                                            <option value="non home owners">Non Home Owners</option>
                                            <option value="guard">Guard</option>
                                            <option value="operational manager">Operational Manager</option>
                                            <option value="service manager">Service Manager</option>
                                            <option value="financial manager">Financial Manager</option>
                                            <option value="appointment coordinator">Appointment Coordinator</option>
                                            <option value="occupancy manager">Occupancy Manager</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Address Information Section -->
                            <div class="mb-6">
                                <!-- <h3 class="font-medium text-lg mb-4 text-slate-700 border-b pb-2">Address Information</h3> -->
                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-12 md:col-span-4">
                                        <label class="form-label font-medium">Street</label>
                                        <input type="text" name="street" class="form-control" placeholder="Enter street">
                                    </div>
                                    <div class="col-span-12 md:col-span-4">
                                        <label class="form-label font-medium">Lot</label>
                                        <input type="text" name="lot" class="form-control" placeholder="Enter lot">
                                    </div>
                                    <div class="col-span-12 md:col-span-4">
                                        <label class="form-label font-medium">Block</label>
                                        <input type="text" name="block" class="form-control" placeholder="Enter block">
                                    </div>
                                </div>
                            </div>

                            <!-- Additional Information Section -->
                            <div class="mb-6">
                                <!-- <h3 class="font-medium text-lg mb-4 text-slate-700 border-b pb-2">Additional Information</h3> -->
                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label font-medium">Membership Fee</label>
                                        <input type="text" name="membership_fee" class="form-control" placeholder="Enter membership fee">
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label font-medium">Profile Photo</label>
                                        <input type="file" name="photo" class="form-control" accept="image/*">
                                        <div class="text-xs text-slate-500 mt-1">Max 5MB - JPG, PNG, GIF</div>
                                    </div>
                                </div>
                            </div>

                            <input type="hidden" name="active" value="1">
                        </form>
                    </div>

                    <!-- Modal Footer -->
                    <div class="modal-footer px-6 py-4 bg-slate-50">
                        <div class="flex justify-end gap-3">
                            <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 inline-block">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                Cancel
                            </button>
                            <button type="submit" form="addUserForm" class="btn btn-primary px-6 py-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 inline-block">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                    <polyline points="7 3 7 8 15 8"></polyline>
                                </svg>
                                Save User
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: Add User Modal -->
        <div class="hidden md:block mx-auto text-slate-500">
            Showing <span id="filtered-count">{{ $users->count() }}</span> of <span id="total-count">{{ $users->total() }}</span> entries
        </div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div class="w-56 relative text-slate-500">
                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." id="searchInput">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" icon-name="search"
                    class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>
        </div>
    </div>
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
        <div class="overflow-x-auto">
            <table class="table table-report -mt-2" id="usersTable">
                <thead>
                    <tr>
                        <th class="whitespace-nowrap">USER ID</th>
                        <th class="whitespace-nowrap">NAME</th>
                        <th class="whitespace-nowrap">EMAIL</th>
                        <th class="text-center whitespace-nowrap">CONTACT</th>
                        <th class="text-center whitespace-nowrap">ROLE</th>
                        <th class="text-center whitespace-nowrap">STATUS</th>
                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                    </tr>
                </thead>
            <tbody>
                    @foreach ($users as $user)
                        <tr class="intro-x">
                            <td class="w-40">
                                <div class="flex items-center justify-center">
                                    <span class="font-medium">{{ $user->id }}</span>
                                </div>
                            </td>
                            <td>
                                <a href="javascript:;" class="font-medium whitespace-nowrap">{{ $user->name }}</a>
                                <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">{{ $user->email }}</div>
                            </td>
                            <td class="whitespace-nowrap">{{ $user->email }}</td>
                            <td class="text-center">{{ $user->contact_number ?: '-' }}</td>
                            <td class="text-center">
                                <span class="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                    {{ $user->role ? ucwords($user->role) : 'User' }}
                                </span>
                            </td>
                            <td class="text-center">
                                @php $isActive = (int) $user->active === 1; @endphp
                                <div class="flex justify-center items-center">
                                    <label class="flex items-center cursor-pointer">
                                        <div class="relative">
                                            <input type="checkbox" 
                                                   class="sr-only user-status-toggle" 
                                                   data-user-id="{{ $user->id }}"
                                                   {{ $isActive ? 'checked' : '' }}>
                                            <div class="block bg-slate-300 w-14 h-8 rounded-full"></div>
                                            <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                                        </div>
                                        <div class="ml-3 text-sm font-medium {{ $isActive ? 'text-success' : 'text-slate-400' }}">
                                            {{ $isActive ? 'Active' : 'Inactive' }}
                                        </div>
                                    </label>
                                </div>
                            </td>
                            <td class="table-report__action w-56">
                                <div class="flex justify-center items-center">
                                    <a class="flex items-center mr-3" href="javascript:;" data-action="view" data-id="{{ $user->id }}" data-tw-toggle="modal" data-tw-target="#view-user-modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                        View
                                    </a>
                                    <a class="flex items-center mr-3" href="javascript:;" data-action="edit" data-id="{{ $user->id }}" data-tw-toggle="modal" data-tw-target="#edit-user-modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                        Edit
                                    </a>
                                    <a class="flex items-center text-danger" href="javascript:;" data-action="delete" data-id="{{ $user->id }}" data-tw-toggle="modal" data-tw-target="#delete-user-modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path
                                                d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2">
                                            </path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                        Delete
                                    </a>
                                </div>
                            </td>
                        </tr>
                    @endforeach
            </tbody>
        </table>
        </div>
    </div>

    <!-- BEGIN: Delete Modal -->
    <div id="delete-user-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body p-0">
                    <div class="p-5 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle w-16 h-16 text-danger mx-auto mt-3">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        <div class="text-3xl mt-5">Are you sure?</div>
                        <div class="text-slate-500 mt-2">
                            Do you really want to delete this user?<br>
                            This process cannot be undone.
                        </div>
                    </div>
                    <div class="px-5 pb-8 text-center">
                        <input type="hidden" id="deleteUserId" />
                        <div class="flex justify-center gap-2">
                            <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24 mb-2">Cancel</button>
                            <button type="button" id="confirmDeleteUser" class="btn btn-danger w-24 mb-2">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Delete Modal -->

    <!-- BEGIN: View User Modal -->
    <div id="view-user-modal" class="modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                    <h2 class="font-medium text-base mr-auto">User Details</h2>
                    <button type="button" class="btn btn-outline-secondary w-8 h-8" data-tw-dismiss="modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="modal-body px-6 py-6">
                    <div id="view-user-content">
                        <div class="text-center text-slate-500 py-8">
                            <svg class="animate-spin h-8 w-8 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p>Loading user information...</p>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="modal-footer px-6 py-4 bg-slate-50">
                    <div class="flex justify-end gap-3">
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- END: View User Modal -->

    <!-- BEGIN: Edit Modal -->
    <div id="edit-user-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                    <h2 class="font-medium text-base mr-auto">Edit User</h2>
                    <button type="button" class="btn btn-outline-secondary w-8 h-8" data-tw-dismiss="modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="modal-body px-6 py-6">
                    <form id="editUserForm">
                        <input type="hidden" name="_token" value="{{ csrf_token() }}">
                        <input type="hidden" id="editUserId" name="id">

                        <!-- Personal Information Section -->
                        <div class="mb-6">
                            <!-- <h3 class="font-medium text-lg mb-4 text-slate-700 border-b pb-2">Personal Information</h3> -->
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label font-medium">Full Name *</label>
                                    <input type="text" id="edit_name" name="name" class="form-control" placeholder="Enter full name" required>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label font-medium">Email Address *</label>
                                    <input type="email" id="edit_email" name="email" class="form-control" placeholder="Enter email address" required>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label font-medium">Password</label>
                                    <input type="password" id="edit_password" name="password" class="form-control" placeholder="Leave blank to keep current password">
                                    <div class="text-xs text-slate-500 mt-1">Only fill if you want to change the password</div>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label font-medium">Contact Number</label>
                                    <input type="text" id="edit_contact_number" name="contact_number" class="form-control" placeholder="Enter contact number">
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label font-medium">Gender *</label>
                                    <select id="edit_gender" name="gender" class="form-select" required>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label font-medium">Role</label>
                                    <select id="edit_role" name="role" class="form-select">
                                        <option value="">Select Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="home owners">Home Owners</option>
                                        <option value="non home owners">Non Home Owners</option>
                                        <option value="guard">Guard</option>
                                        <option value="operational manager">Operational Manager</option>
                                        <option value="service manager">Service Manager</option>
                                        <option value="financial manager">Financial Manager</option>
                                        <option value="appointment coordinator">Appointment Coordinator</option>
                                        <option value="occupancy manager">Occupancy Manager</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Address Information Section -->
                        <div class="mb-6">
                            <!-- <h3 class="font-medium text-lg mb-4 text-slate-700 border-b pb-2">Address Information</h3> -->
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 md:col-span-4">
                                    <label class="form-label font-medium">Street</label>
                                    <input type="text" id="edit_street" name="street" class="form-control" placeholder="Enter street">
                                </div>
                                <div class="col-span-12 md:col-span-4">
                                    <label class="form-label font-medium">Lot</label>
                                    <input type="text" id="edit_lot" name="lot" class="form-control" placeholder="Enter lot">
                                </div>
                                <div class="col-span-12 md:col-span-4">
                                    <label class="form-label font-medium">Block</label>
                                    <input type="text" id="edit_block" name="block" class="form-control" placeholder="Enter block">
                                </div>
                            </div>
                        </div>

                        <!-- Additional Information Section -->
                        <div class="mb-6">
                            <!-- <h3 class="font-medium text-lg mb-4 text-slate-700 border-b pb-2">Additional Information</h3> -->
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12">
                                    <label class="form-label font-medium">Membership Fee</label>
                                    <input type="text" id="edit_membership_fee" name="membership_fee" class="form-control" placeholder="Enter membership fee">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Modal Footer -->
                <div class="modal-footer px-6 py-4 bg-slate-50">
                    <div class="flex justify-end gap-3">
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 inline-block">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            Cancel
                        </button>
                        <button type="submit" form="editUserForm" class="btn btn-primary px-6 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 inline-block">
                                <polyline points="9 11 12 14 22 4"></polyline>
                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                            </svg>
                            Update User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Edit Modal -->
    <!-- END: Users Layout -->
    <!-- BEGIN: Pagination -->
    <x-pagination :current-page="$users->currentPage()" :total-pages="$users->lastPage()" :per-page="$users->perPage()" :show-per-page-selector="true" :show-first-last="true" />
    <!-- END: Pagination -->
</div>
@endsection

@push('scripts')
<script src="{{ asset('js/usermanagement/usermanagement.js') }}?v={{ time() }}"></script>
@endpush