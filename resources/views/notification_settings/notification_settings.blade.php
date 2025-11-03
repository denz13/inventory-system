@extends('layout._partials.master')

@section('content')
<div class="col-span-12 mt-6 -mb-6 intro-y">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>Notification Settings: Manage your notification preferences and settings. Control how and when you receive notifications.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> 
        </button>
    </div>
</div>

<h2 class="intro-y text-lg font-medium mt-10">
    Notification Settings
</h2>

<!-- Notifications -->
<div class="intro-y col-span-12">
    <x-notification-toast id="notification_settings_toast_success" type="success" title="Success" message="Notification setting updated successfully"
        :showButton="false" />
    <x-notification-toast id="notification_settings_toast_error" type="error" title="Error" :showButton="false">
        <div id="notification_settings_error_message_slot" class="text-slate-500 mt-1"></div>
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
        
        /* Remove TomSelect red highlighting */
        .ts-dropdown .highlight {
            background: transparent !important;
            color: inherit !important;
        }
    </style>
</div>

<div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <button class="btn btn-primary shadow-md mr-2" data-tw-toggle="modal" data-tw-target="#create-notification-setting-modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Add Notification Setting
        </button>
        
        <div class="dropdown ml-2"> 
            <button class="dropdown-toggle btn btn-outline-secondary" aria-expanded="false" data-tw-toggle="dropdown">Filter by Status</button> 
            <div class="dropdown-menu w-40"> 
                <ul class="dropdown-content"> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter="all">All Settings</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter="active">Active</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter="inactive">Inactive</a> </li> 
                </ul> 
            </div> 
        </div>
        
        <div class="dropdown ml-2"> 
            <button class="dropdown-toggle btn btn-outline-secondary" aria-expanded="false" data-tw-toggle="dropdown">Filter by Module</button> 
            <div class="dropdown-menu w-56"> 
                <ul class="dropdown-content overflow-y-auto" style="max-height: 300px;"> 
                    <li> <a href="javascript:;" class="dropdown-item" data-module-filter="all">All Modules</a> </li> 
                    @foreach($modules as $module)
                        <li> <a href="javascript:;" class="dropdown-item" data-module-filter="{{ $module->id }}">{{ ucwords(str_replace('_', ' ', $module->module_name)) }}</a> </li> 
                    @endforeach
                </ul> 
            </div> 
        </div>
        
        <div class="hidden md:block mx-auto text-slate-500">
            Showing {{ $notificationSettings->count() }} of {{ $notificationSettings->total() }} entries
        </div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div class="w-56 relative text-slate-500">
                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." id="searchInput">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg> 
            </div>
        </div>
    </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto">
        <table class="table table-report -mt-2">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">USER</th>
                    <th class="whitespace-nowrap">EMAIL</th>
                    <th class="text-center whitespace-nowrap">MODULES</th>
                    <th class="text-center whitespace-nowrap">STATUS</th>
                    <th class="text-center whitespace-nowrap">DATE CREATED</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                @forelse($notificationSettings as $setting)
                <tr class="intro-x" data-status="{{ $setting->status }}" data-module="{{ $setting->module_id }}">
                    <td class="w-40">
                        <div class="font-medium whitespace-nowrap">{{ $setting->user->name ?? 'N/A' }}</div>
                    </td>
                    <td class="w-40">
                        <div class="font-medium">{{ $setting->user->email ?? 'N/A' }}</div>
                    </td>
                    <td class="w-40">
                        <div class="text-center">
                            @if($setting->module)
                                <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                                    {{ ucwords(str_replace('_', ' ', $setting->module->module_name)) }}
                                </span>
                            @else
                                <span class="text-slate-500 text-sm">No module</span>
                            @endif
                        </div>
                    </td>
                    <td class="w-40">
                        <div class="flex items-center justify-center 
                            @if($setting->status === 'active') text-success
                            @elseif($setting->status === 'inactive') text-slate-500
                            @else text-slate-500
                            @endif">
                            @if($setting->status === 'active')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                </svg>
                            @else
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                            @endif
                            {{ ucfirst($setting->status) }}
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="text-slate-500 whitespace-nowrap">{{ $setting->created_at ? $setting->created_at->format('M d, Y g:i A') : 'N/A' }}</div>
                    </td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view-notification-setting-modal" data-setting-id="{{ $setting->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View
                            </a>
                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#edit-notification-setting-modal" data-setting-id="{{ $setting->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Edit
                            </a>
                            <a class="flex items-center text-danger" href="javascript:;" data-tw-toggle="modal" data-tw-target="#delete-notification-setting-modal" data-setting-id="{{ $setting->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                Delete
                            </a>
                        </div>
                    </td>
                </tr>
                @empty
                <tr class="intro-x">
                    <td colspan="6" class="text-center py-8">
                        <div class="text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                <path d="M9 12l2 2 4-4"></path>
                                <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                                <path d="M3 13v6c0 .552.448 1 1 1h16c.552 0 1-.448 1-1v-6"></path>
                            </svg>
                            <div class="font-medium">No notification settings found</div>
                            <div class="text-sm">Start by adding your first notification setting</div>
                        </div>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <!-- END: Data List -->
    
    <!-- BEGIN: Pagination -->
    <x-pagination 
        :current-page="$notificationSettings->currentPage()" 
        :total-pages="$notificationSettings->lastPage()" 
        :per-page="$notificationSettings->perPage()" 
        :show-per-page-selector="true" 
        :show-first-last="true" 
    />
    <!-- END: Pagination -->
</div>

<!-- BEGIN: Create Notification Setting Modal -->
<div id="create-notification-setting-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Add Notification Setting</h2>
                <button type="button" class="btn btn-outline-secondary w-8 h-8 mr-1" data-tw-dismiss="modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="modal-body px-6 py-8">
                <form id="createNotificationSettingForm" method="POST" action="{{ route('notification-settings.store') }}">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Filter by Role</label>
                        <select id="createRoleFilter" class="form-control mt-2 p-3 border border-slate-300 rounded-lg">
                            <option value="">All Roles</option>
                            @foreach($roles as $role)
                                <option value="{{ $role }}">{{ ucfirst($role) }}</option>
                            @endforeach
                        </select>
                        <small class="text-slate-500">Select a role to auto-check modules and filter users</small>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Select User</label>
                        <select name="users_id" id="createUserSelect" data-placeholder="Search and select a user..." class="tom-select w-full" required>
                            <option value="">Choose User</option>
                            @foreach($users as $user)
                                <option value="{{ $user->id }}" data-role="{{ $user->role }}">{{ $user->name }} ({{ $user->email }})</option>
                            @endforeach
                        </select>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Modules</label>
                        <div class="mt-2 p-4 border border-slate-300 rounded-lg max-h-48 overflow-y-auto">
                            @foreach($modules as $module)
                                <label class="flex items-center mb-2">
                                    <input type="checkbox" name="modules[]" value="{{ $module->id }}" class="form-check-input mr-3">
                                    <span class="text-slate-700">{{ ucwords(str_replace('_', ' ', $module->module_name)) }}</span>
                                </label>
                            @endforeach
                        </div>
                        <small class="text-slate-500">Select one or more modules for notification</small>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Status</label>
                        <select name="status" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2 mr-2">Cancel</button>
                    <button type="submit" form="createNotificationSettingForm" class="btn btn-primary px-6 py-2 flex items-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        Add Setting
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Create Notification Setting Modal -->

<!-- BEGIN: View Notification Setting Modal -->
<div id="view-notification-setting-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Notification Setting Details</h2>
                <button type="button" class="btn btn-outline-secondary w-8 h-8 mr-1" data-tw-dismiss="modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="modal-body p-0">
                <div id="notification-setting-details">
                    <div class="text-center text-slate-500 py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-lg">Loading notification setting details...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: View Notification Setting Modal -->

<!-- BEGIN: Edit Notification Setting Modal -->
<div id="edit-notification-setting-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Edit Notification Setting</h2>
                <button type="button" class="btn btn-outline-secondary w-8 h-8 mr-1" data-tw-dismiss="modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="modal-body px-6 py-8">
                <form id="editNotificationSettingForm" method="POST">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" id="editNotificationSettingId">
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Filter by Role</label>
                        <select id="editRoleFilter" class="form-control mt-2 p-3 border border-slate-300 rounded-lg">
                            <option value="">All Roles</option>
                            @foreach($roles as $role)
                                <option value="{{ $role }}">{{ ucfirst($role) }}</option>
                            @endforeach
                        </select>
                        <small class="text-slate-500">Select a role to auto-check modules and filter users</small>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Select User</label>
                        <select name="users_id" id="editUserSelect" data-placeholder="Search and select a user..." class="tom-select w-full" required>
                            <option value="">Choose User</option>
                            @foreach($users as $user)
                                <option value="{{ $user->id }}" data-role="{{ $user->role }}">{{ $user->name }} ({{ $user->email }})</option>
                            @endforeach
                        </select>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Modules</label>
                        <div class="mt-2 p-4 border border-slate-300 rounded-lg max-h-48 overflow-y-auto" id="editModulesContainer">
                            @foreach($modules as $module)
                                <label class="flex items-center mb-2">
                                    <input type="checkbox" name="modules[]" value="{{ $module->id }}" class="form-check-input mr-3">
                                    <span class="text-slate-700">{{ ucwords(str_replace('_', ' ', $module->module_name)) }}</span>
                                </label>
                            @endforeach
                        </div>
                        <small class="text-slate-500">Select one or more modules for notification</small>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Status</label>
                        <select name="status" id="editStatus" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2 mr-2">Cancel</button>
                    <button type="submit" form="editNotificationSettingForm" class="btn btn-primary px-6 py-2 flex items-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        Update Setting
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Edit Notification Setting Modal -->

<!-- BEGIN: Delete Notification Setting Modal -->
<div id="delete-notification-setting-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body p-0">
                <div class="p-5 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x-circle" data-lucide="x-circle" class="lucide lucide-x-circle w-16 h-16 text-danger mx-auto mt-3">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <div class="text-3xl mt-5">Are you sure?</div>
                    <div class="text-slate-500 mt-2">Do you really want to delete this notification setting? This process cannot be undone.</div>
                </div>
                <div class="px-5 pb-8 text-center">
                    <input type="hidden" id="deleteNotificationSettingId">
                    <div class="flex justify-center gap-2">
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24 mb-2">Cancel</button>
                        <button type="button" class="btn btn-danger w-24 mb-2" id="confirmDeleteNotificationSetting">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Delete Notification Setting Modal -->

@endsection

@push('scripts')
    <!-- Toastify for notifications -->
    <script src="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.css">
    
    <script src="{{ asset('js/notification_settings/notification_settings.js?v=' . time()) }}"></script>
    <script src="{{ asset('js/tom-select.js') }}"></script>
    
    <script>
        // Initialize role filters (TomSelect auto-initializes via tom-select class)
        document.addEventListener('DOMContentLoaded', function() {
            initializeCreateRoleFilter();
            initializeEditRoleFilter();
        });
        
        function initializeCreateRoleFilter() {
            const roleFilter = document.getElementById('createRoleFilter');
            const userSelect = document.getElementById('createUserSelect');
            
            if (!roleFilter || !userSelect) {
                console.log('Create role filter or user select not found');
                return;
            }
            
            // Store all user options
            let allUserOptions = [];
            
            // Wait for Tom Select to initialize
            setTimeout(function() {
                const tomSelectInstance = userSelect.tomselect;
                
                if (tomSelectInstance) {
                    // Store all original options
                    Object.keys(tomSelectInstance.options).forEach(key => {
                        const option = tomSelectInstance.options[key];
                        allUserOptions.push({
                            value: option.value,
                            text: option.text,
                            role: option.$option ? option.$option.getAttribute('data-role') : ''
                        });
                    });
                    
                    console.log('Tom Select found, stored', allUserOptions.length, 'user options');
                } else {
                    // Fallback: Get from original select element
                    const options = userSelect.querySelectorAll('option');
                    options.forEach(option => {
                        if (option.value) { // Skip empty option
                            allUserOptions.push({
                                value: option.value,
                                text: option.textContent,
                                role: option.getAttribute('data-role')
                            });
                        }
                    });
                    
                    console.log('Tom Select not found, stored', allUserOptions.length, 'user options from original select');
                }
            }, 500);
            
            // Handle role filter change
            roleFilter.addEventListener('change', function() {
                const selectedRole = this.value;
                console.log('Role filter changed to:', selectedRole || 'All Roles');
                
                setTimeout(function() {
                    const tomSelectInstance = userSelect.tomselect;
                    
                    if (tomSelectInstance) {
                        // Clear existing options
                        tomSelectInstance.clearOptions();
                        
                        // Filter and add options based on selected role (exact match)
                        const filteredOptions = selectedRole 
                            ? allUserOptions.filter(opt => opt.role === selectedRole)
                            : allUserOptions;
                        
                        console.log('Filtered to', filteredOptions.length, 'users');
                        
                        // Add filtered options
                        filteredOptions.forEach(option => {
                            tomSelectInstance.addOption({
                                value: option.value,
                                text: option.text,
                                role: option.role
                            });
                        });
                        
                        // Clear current selection
                        tomSelectInstance.clear();
                        
                        // Refresh the dropdown
                        tomSelectInstance.refreshOptions(false);
                    }
                }, 100);
            });
            
            console.log('Create role filter initialized');
        }
        
        function initializeEditRoleFilter() {
            const roleFilter = document.getElementById('editRoleFilter');
            const userSelect = document.getElementById('editUserSelect');
            
            if (!roleFilter || !userSelect) {
                console.log('Edit role filter or user select not found');
                return;
            }
            
            // Store all user options
            let allUserOptions = [];
            
            // Wait for Tom Select to initialize
            setTimeout(function() {
                const tomSelectInstance = userSelect.tomselect;
                
                if (tomSelectInstance) {
                    // Store all original options
                    Object.keys(tomSelectInstance.options).forEach(key => {
                        const option = tomSelectInstance.options[key];
                        allUserOptions.push({
                            value: option.value,
                            text: option.text,
                            role: option.$option ? option.$option.getAttribute('data-role') : ''
                        });
                    });
                    
                    console.log('Tom Select found, stored', allUserOptions.length, 'user options for edit modal');
                } else {
                    // Fallback: Get from original select element
                    const options = userSelect.querySelectorAll('option');
                    options.forEach(option => {
                        if (option.value) { // Skip empty option
                            allUserOptions.push({
                                value: option.value,
                                text: option.textContent,
                                role: option.getAttribute('data-role')
                            });
                        }
                    });
                    
                    console.log('Tom Select not found, stored', allUserOptions.length, 'user options from original select for edit modal');
                }
            }, 500);
            
            // Handle role filter change
            roleFilter.addEventListener('change', function() {
                const selectedRole = this.value;
                console.log('Edit role filter changed to:', selectedRole || 'All Roles');
                
                setTimeout(function() {
                    const tomSelectInstance = userSelect.tomselect;
                    
                    if (tomSelectInstance) {
                        const currentValue = tomSelectInstance.getValue();
                        
                        // Clear existing options
                        tomSelectInstance.clearOptions();
                        
                        // Filter and add options based on selected role (exact match)
                        const filteredOptions = selectedRole 
                            ? allUserOptions.filter(opt => opt.role === selectedRole)
                            : allUserOptions;
                        
                        console.log('Filtered to', filteredOptions.length, 'users');
                        
                        // Add filtered options
                        filteredOptions.forEach(option => {
                            tomSelectInstance.addOption({
                                value: option.value,
                                text: option.text,
                                role: option.role
                            });
                        });
                        
                        // Refresh the dropdown
                        tomSelectInstance.refreshOptions(false);
                        
                        // Restore selected value if it's still in filtered list
                        if (currentValue && filteredOptions.find(opt => opt.value == currentValue)) {
                            tomSelectInstance.setValue(currentValue);
                        } else {
                            tomSelectInstance.clear();
                        }
                    }
                }, 100);
            });
            
            console.log('Edit role filter initialized');
        }
    </script>
@endpush
