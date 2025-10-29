@extends('layout._partials.master')

@section('content')
<meta name="csrf-token" content="{{ csrf_token() }}">
<div class="col-span-12 mt-6 -mb-6 intro-y">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>Appointment Schedule Settings: Set the maximum number of appointments allowed per day to manage scheduling capacity.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> 
        </button>
    </div>
</div>

<h2 class="intro-y text-lg font-medium mt-10">
    Daily Appointment Limit Settings
</h2>

<!-- Notifications -->
<div class="intro-y col-span-12">
    <x-notification-toast id="category_toast_success" type="success" title="Success" message="Category saved successfully"
        :showButton="false" />
    <x-notification-toast id="category_toast_error" type="error" title="Error" :showButton="false">
        <div id="category-error-message-slot" class="text-slate-500 mt-1"></div>
    </x-notification-toast>
    <style>
        .toastify {
            background: transparent !important;
            box-shadow: none !important;
        }
    </style>
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
        
        /* Ensure file input is properly styled and visible */
        input[type="file"] {
            display: block !important;
            width: 100% !important;
            padding: 0.75rem !important;
            border: 1px solid #d1d5db !important;
            border-radius: 0.5rem !important;
            background-color: #ffffff !important;
            cursor: pointer !important;
        }
        
        input[type="file"]:focus {
            outline: none !important;
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
    </style>
</div>

<div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 gap-2">
        <button class="btn btn-primary shadow-md" data-tw-toggle="modal" data-tw-target="#create-schedule-modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Set Daily Limit
        </button>
        
        <!-- Status Filter -->
        <div class="dropdown"> 
            <button class="dropdown-toggle btn btn-outline-secondary" aria-expanded="false" data-tw-toggle="dropdown" id="statusFilterBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                Status: All
            </button> 
            <div class="dropdown-menu w-40"> 
                <ul class="dropdown-content"> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="all">All Schedules</a> </li> 
                    @foreach($statuses as $status)
                        <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="{{ $status }}">{{ $status }}</a> </li> 
                    @endforeach
                </ul> 
            </div> 
        </div>

        <!-- Reset Filters Button -->
        <button type="button" class="btn btn-outline-danger" id="resetFiltersBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            Reset
        </button>
        
        <div class="hidden md:block mx-auto text-slate-500">
            Showing {{ $schedules->count() }} of {{ $schedules->total() }} entries
        </div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div class="w-56 relative text-slate-500">
                <input type="text" class="form-control w-56 box pr-10" placeholder="Search schedules..." id="searchInput" autocomplete="off">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg> 
            </div>
        </div>
    </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
        <table class="table table-report -mt-2" id="scheduleTable">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">SCHEDULE DETAILS</th>
                    <th class="text-center whitespace-nowrap">DATE RANGE</th>
                    <th class="text-center whitespace-nowrap">STATUS</th>
                    <th class="text-center whitespace-nowrap">CREATED DATE</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                @forelse($schedules as $schedule)
                <tr class="intro-x" data-status="{{ $schedule->status }}">
                    <td class="w-40">
                        <div class="font-medium text-primary text-xl">{{ $schedule->allow_number_of_appointment }} persons/day</div>
                        <div class="text-slate-500 text-xs mt-0.5">
                            {{ $schedule->scheduleDates->count() }} days scheduled
                        </div>
                    </td>
                    <td class="text-center">
                        @if($schedule->scheduleDates->count() > 0)
                            <div class="font-medium">{{ \Carbon\Carbon::parse($schedule->scheduleDates->first()->dates)->format('M d, Y') }}</div>
                            <div class="text-slate-500 text-xs">to</div>
                            <div class="font-medium">{{ \Carbon\Carbon::parse($schedule->scheduleDates->last()->dates)->format('M d, Y') }}</div>
                        @else
                            <span class="text-slate-400">No dates</span>
                        @endif
                    </td>
                    <td class="w-40">
                        <div class="flex items-center justify-center 
                            @if($schedule->status === 'Active') text-success
                            @elseif($schedule->status === 'Inactive') text-slate-500
                            @else text-slate-500
                            @endif">
                            @if($schedule->status === 'Active')
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
                            {{ $schedule->status }}
                        </div>
                    </td>
                    <td class="text-center">{{ $schedule->created_at ? $schedule->created_at->format('M d, Y g:i A') : 'N/A' }}</td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" data-action="edit" data-id="{{ $schedule->id }}" data-tw-toggle="modal" data-tw-target="#edit-schedule-modal">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Edit
                            </a>
                            <a class="flex items-center text-danger" href="javascript:;" data-action="delete" data-id="{{ $schedule->id }}" data-tw-toggle="modal" data-tw-target="#delete-confirmation-modal">
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
                <tr class="intro-x" id="no-schedules-row">
                    <td colspan="5" class="text-center py-8">
                        <div class="text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <div class="font-medium">No schedule settings found</div>
                            <div class="text-sm">Set the daily appointment limit to start managing capacity</div>
                        </div>
                    </td>
                </tr>
                @endforelse
                <!-- No results message (for filtering/search) -->
                <tr class="intro-x hidden" id="no-results-row">
                    <td colspan="5" class="text-center py-8">
                        <div class="text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <div class="font-medium">No results found</div>
                            <div class="text-sm">Try adjusting your search or filter criteria</div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- END: Data List -->
    
    <!-- BEGIN: Pagination -->
    <x-pagination 
        :current-page="$schedules->currentPage()" 
        :total-pages="$schedules->lastPage()" 
        :per-page="$schedules->perPage()" 
        :show-per-page-selector="true" 
        :show-first-last="true" 
    />
    <!-- END: Pagination -->
</div>

<!-- BEGIN: Create Schedule Modal -->
<div id="create-schedule-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Set Daily Appointment Limit</h2>
            </div>
            <div class="modal-body px-6 py-8">
                <form id="createScheduleForm">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    
                    <!-- Error Alert -->
                    <div id="createFormErrors" class="hidden alert alert-danger bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <div class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-0.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <div>
                                <strong class="font-bold">Validation Error!</strong>
                                <ul id="createErrorList" class="mt-2 list-disc list-inside text-sm"></ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Date Range <span class="text-red-600">*</span></label>
                        <input type="text" data-daterange="true" name="date_range" id="dateRangeInput" class="datepicker form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="Select date range" required>
                        <div class="text-xs text-slate-500 mt-1">Select the date range for this schedule. Day names will be automatically extracted.</div>
                        <div id="selectedDaysDisplay" class="mt-2 text-sm text-blue-700 font-medium hidden"></div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Number of Allowed Appointments Per Day <span class="text-red-600">*</span></label>
                        <input type="number" name="allow_number_of_appointment" id="allowNumber" min="1" max="1000" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., 50" required>
                        <div class="text-xs text-slate-500 mt-1">Set the maximum number of appointments that can be scheduled per day (1-1000)</div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Status <span class="text-red-600">*</span></label>
                        <div class="flex flex-wrap gap-6 mt-2">
                            <label class="flex items-center gap-2">
                                <input type="radio" name="status" value="Active" class="form-check-input" checked> 
                                <span>Active</span>
                            </label>
                            <label class="flex items-center gap-2">
                                <input type="radio" name="status" value="Inactive" class="form-check-input"> 
                                <span>Inactive</span>
                            </label>
                        </div>
                        <div class="text-xs text-slate-500 mt-1">Note: Only one schedule can be active at a time. Setting this as active will deactivate all others.</div>
                    </div>
                </form>
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2 mr-2">Cancel</button>
                    <button type="button" id="createScheduleBtn" class="btn btn-primary px-6 py-2 flex items-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Create Schedule Modal -->

<!-- BEGIN: Edit Schedule Modal -->
<div id="edit-schedule-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Edit Daily Appointment Limit</h2>
            </div>
            <div class="modal-body px-6 py-8">
                <form id="editScheduleForm">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" id="editScheduleId">
                    
                    <!-- Error Alert -->
                    <div id="editFormErrors" class="hidden alert alert-danger bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <div class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-0.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <div>
                                <strong class="font-bold">Validation Error!</strong>
                                <ul id="editErrorList" class="mt-2 list-disc list-inside text-sm"></ul>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Date Range (Editable) -->
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Date Range <span class="text-red-600">*</span></label>
                        <input type="text" data-daterange="true" name="date_range" id="editDateRangeInput" class="datepicker form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="Select date range" required>
                        <div class="text-xs text-slate-500 mt-1">Select the date range for this schedule. Day names will be automatically extracted.</div>
                        <div id="editSelectedDaysDisplay" class="mt-2 text-sm text-blue-700 font-medium hidden"></div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Number of Allowed Appointments Per Day <span class="text-red-600">*</span></label>
                        <input type="number" name="allow_number_of_appointment" id="editAllowNumber" min="1" max="1000" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                        <div class="text-xs text-slate-500 mt-1">Set the maximum number of appointments that can be scheduled per day (1-1000)</div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Status <span class="text-red-600">*</span></label>
                        <div class="flex flex-wrap gap-6 mt-2">
                            <label class="flex items-center gap-2">
                                <input type="radio" name="status" value="Active" class="form-check-input" id="editStatusActive"> 
                                <span>Active</span>
                            </label>
                            <label class="flex items-center gap-2">
                                <input type="radio" name="status" value="Inactive" class="form-check-input" id="editStatusInactive"> 
                                <span>Inactive</span>
                            </label>
                        </div>
                        <div class="text-xs text-slate-500 mt-1">Note: Only one schedule can be active at a time. Setting this as active will deactivate all others.</div>
                    </div>
                </form>
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2 mr-2">Cancel</button>
                    <button type="button" id="updateScheduleBtn" class="btn btn-primary px-6 py-2 flex items-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        Update Settings
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Edit Schedule Modal -->

<!-- BEGIN: Delete Confirmation Modal -->
<div id="delete-confirmation-modal" class="modal" tabindex="-1" aria-hidden="true">
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
                    <div class="text-slate-500 mt-2">Do you really want to delete this schedule? This process cannot be undone.</div>
                </div>
                <div class="px-5 pb-8 text-center">
                    <input type="hidden" id="deleteScheduleId">
                    <div class="flex justify-center gap-2">
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24 mb-2">Cancel</button>
                        <button type="button" class="btn btn-danger w-24 mb-2" id="confirmDeleteSchedule">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Delete Confirmation Modal -->

@endsection

@push('scripts')
    <!-- Toastify for notifications -->
    <script src="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.css">
    
    <script src="{{ asset('js/appointment_allowing/appointment_allowing.js?v=' . time()) }}"></script>
@endpush