@extends('layout._partials.master')

@section('content')
<meta name="csrf-token" content="{{ csrf_token() }}">
<div class="col-span-12 mt-6 -mb-6 intro-y">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>Apply for Appointment: Submit your appointment request and track your applications. Choose from available categories and select your preferred date.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> 
        </button>
    </div>
</div>

<h2 class="intro-y text-lg font-medium mt-10">
    My Appointments
</h2>

<!-- Notifications -->
<div class="intro-y col-span-12">
    <x-notification-toast id="appointment_toast_success" type="success" title="Success" message="Appointment submitted successfully"
        :showButton="false" />
    <x-notification-toast id="appointment_toast_error" type="error" title="Error" :showButton="false">
        <div id="appointment-error-message-slot" class="text-slate-500 mt-1"></div>
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

<div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 gap-2">
        <button class="btn btn-primary shadow-md" data-tw-toggle="modal" data-tw-target="#create-appointment-modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Apply for Appointment
        </button>
        
        <div class="hidden md:block mx-auto text-slate-500">
            Showing <span id="filtered-count">{{ $appointments->count() }}</span> of <span id="total-count">{{ $appointments->total() }}</span> entries
        </div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div class="w-56 relative text-slate-500">
                <input type="text" class="form-control w-56 box pr-10" placeholder="Search appointments..." id="searchInput" autocomplete="off">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg> 
            </div>
        </div>
    </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
        <table class="table table-report -mt-2 overflow-x-auto" id="appointmentTable">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">TRACKING NUMBER</th>
                    <th class="whitespace-nowrap">CATEGORY</th>
                    <th class="whitespace-nowrap">APPOINTMENT DATE</th>
                    <th class="whitespace-nowrap">TIME</th>
                    <th class="text-center whitespace-nowrap">STATUS</th>
                    <th class="text-center whitespace-nowrap">SUBMITTED DATE</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                @forelse($appointments as $appointment)
                <tr class="intro-x" data-status="{{ $appointment->status }}">
                    <td class="w-40">
                        <div class="font-medium text-primary">{{ $appointment->tracking_number }}</div>
                    </td>
                    <td class="w-40">
                        <div class="font-medium">{{ $appointment->appointmentCategory->category_name ?? 'N/A' }}</div>
                    </td>
                    <td class="whitespace-nowrap">
                        <span class="font-medium">{{ $appointment->appointment_date ? \Carbon\Carbon::parse($appointment->appointment_date)->format('M d, Y') : 'N/A' }}</span>
                    </td>
                    <td class="whitespace-nowrap">
                        <span class="font-medium text-primary">{{ $appointment->time ?? 'N/A' }}</span>
                    </td>
                    <td class="w-40">
                        <div class="flex items-center justify-center 
                            @if($appointment->status === 'Approved') text-success
                            @elseif($appointment->status === 'Pending') text-warning
                            @elseif($appointment->status === 'Rejected') text-danger
                            @elseif($appointment->status === 'Completed') text-info
                            @else text-slate-500
                            @endif">
                            @if($appointment->status === 'Approved')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                </svg>
                            @elseif($appointment->status === 'Pending')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 6v6l4 2"></path>
                                </svg>
                            @elseif($appointment->status === 'Rejected')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                            @else
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                </svg>
                            @endif
                            {{ $appointment->status }}
                        </div>
                    </td>
                    <td class="text-center">{{ $appointment->created_at ? $appointment->created_at->format('M d, Y g:i A') : 'N/A' }}</td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" data-action="view" data-id="{{ $appointment->id }}" data-tw-toggle="modal" data-tw-target="#view-appointment-modal">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View
                            </a>
                            @if($appointment->status === 'Pending')
                            <a class="flex items-center text-danger" href="javascript:;" data-action="cancel" data-id="{{ $appointment->id }}" data-tw-toggle="modal" data-tw-target="#cancel-confirmation-modal">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                                Cancel
                            </a>
                            @endif
                        </div>
                    </td>
                </tr>
                @empty
                <tr class="intro-x" id="no-appointments-row">
                    <td colspan="7" class="text-center py-8">
                        <div class="text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <div class="font-medium">No appointments found</div>
                            <div class="text-sm">Start by applying for your first appointment</div>
                        </div>
                    </td>
                </tr>
                @endforelse
                <!-- No results message (for filtering/search) -->
                <tr class="intro-x hidden" id="no-results-row">
                    <td colspan="7" class="text-center py-8">
                        <div class="text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <div class="font-medium">No results found</div>
                            <div class="text-sm">Try adjusting your search criteria</div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- END: Data List -->
    
    <!-- BEGIN: Pagination -->
    <x-pagination 
        :current-page="$appointments->currentPage()" 
        :total-pages="$appointments->lastPage()" 
        :per-page="$appointments->perPage()" 
        :show-per-page-selector="true" 
        :show-first-last="true" 
    />
    <!-- END: Pagination -->
</div>

<!-- BEGIN: Create Appointment Modal -->
<div id="create-appointment-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-body px-6 py-8">
                <form id="createAppointmentForm" method="POST">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    
                    <!-- Availability Info -->
                    <div id="availabilityInfo" class="mb-4 text-sm hidden">
                        <div class="p-3 rounded-lg bg-blue-50 border border-blue-200">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-blue-600">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                <span id="availabilityMessage" class="text-blue-700 font-medium"></span>
                            </div>
                        </div>
                    </div>
                    
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
                        <label class="form-label text-base font-semibold text-slate-700">Appointment Category <span class="text-red-600">*</span></label>
                        <select name="appointment_category_id" id="appointmentCategory" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                            <option value="">Select Category</option>
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}">{{ $category->category_name }}</option>
                            @endforeach
                        </select>
                        <small id="categoryError" class="text-red-600 hidden mt-1">Please select a category</small>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Appointment Date <span class="text-red-600">*</span></label>
                        <select name="appointment_date" id="appointmentDate" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                            <option value="">Select Available Date</option>
                            @if(count($availableDates) > 0)
                                @foreach($availableDates as $date)
                                    <option value="{{ $date }}">{{ \Carbon\Carbon::parse($date)->format('l, F d, Y') }}</option>
                                @endforeach
                            @else
                                <option value="" disabled>No dates available - Please contact administrator</option>
                            @endif
                        </select>
                        <div class="text-xs text-slate-500 mt-1">
                            @if(count($availableDates) > 0)
                                {{ count($availableDates) }} dates available for appointment
                            @else
                                No appointment dates are currently set. Please contact the administrator.
                            @endif
                        </div>
                        <small id="dateError" class="text-red-600 hidden mt-1">Please select a date</small>
                    </div>
                    
                    <div class="mb-6 hidden" id="timeSelectionWrapper">
                        <label class="form-label text-base font-semibold text-slate-700">Appointment Time <span class="text-red-600">*</span></label>
                        <select name="time" id="appointmentTime" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                            <option value="">Loading available times...</option>
                        </select>
                        <div class="text-xs text-slate-500 mt-1" id="timeSlotInfo">Please select your preferred appointment time</div>
                        <small id="timeError" class="text-red-600 hidden mt-1">Please select a time</small>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Description <span class="text-red-600">*</span></label>
                        <textarea name="description" id="appointmentDescription" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" rows="4" placeholder="Please describe the purpose of your appointment..." required></textarea>
                        <div class="text-xs text-slate-500 mt-1">Maximum 1000 characters</div>
                        <small id="descriptionError" class="text-red-600 hidden mt-1">Description is required</small>
                    </div>
                </form>
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2 mr-2">Cancel</button>
                    <button type="button" id="submitAppointmentBtn" class="btn btn-primary px-6 py-2 flex items-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        Submit Appointment
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Create Appointment Modal -->

<!-- BEGIN: View Appointment Modal -->
<div id="view-appointment-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-body px-6 py-8">
                <div id="appointment-details">
                    <div class="text-center text-slate-500 py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-lg">Loading appointment details...</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2 mr-2">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: View Appointment Modal -->

<!-- BEGIN: Cancel Confirmation Modal -->
<div id="cancel-confirmation-modal" class="modal" tabindex="-1" aria-hidden="true">
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
                    <div class="text-slate-500 mt-2">Do you really want to cancel this appointment? This action cannot be undone.</div>
                </div>
                <div class="px-5 pb-8 text-center">
                    <input type="hidden" id="cancelAppointmentId">
                    <div class="flex justify-center gap-2">
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24 mb-2">No</button>
                        <button type="button" class="btn btn-danger w-24 mb-2" id="confirmCancelAppointment">Yes, Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Cancel Confirmation Modal -->

@endsection

@push('scripts')
    <!-- Toastify for notifications -->
    <script src="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.css">
    
    <script src="{{ asset('js/apply_appointment/apply_appointment.js') }}"></script>
@endpush
