@extends('layout._partials.master')

@section('content')
@php
// Status configuration mapping
$statusConfig = [
    'pending' => [
        'color' => 'text-warning',
        'icon' => '<circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>',
        'action' => 'pending'
    ],
    'approved' => [
        'color' => 'text-success',
        'icon' => '<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>',
        'action' => 'approve'
    ],
    'cancelled' => [
        'color' => 'text-danger',
        'icon' => '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
        'action' => 'cancel'
    ],
    'completed' => [
        'color' => 'text-info',
        'icon' => '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
        'action' => 'complete'
    ],
];

// Function to get status config with fallback to default
function getStatusConfig($status, $statusConfig) {
    $statusLower = strtolower($status);
    return $statusConfig[$statusLower] ?? [
        'color' => 'text-slate-500',
        'icon' => '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
        'action' => strtolower($status)
    ];
}
@endphp

<!-- Alert Message -->
<div class="intro-y col-span-12 mt-6 -mb-6">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>Appointment Management: You can now view appointment details, update appointment statuses, and manage all appointments. Use the View button to see complete information, and the Update Status dropdown for pending appointments.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    </div>
</div>
<div class="grid grid-cols-12 gap-6 mt-5">
        <div class="intro-y col-span-12">
            <div class="intro-y text-lg font-medium mt-10">
                Appointment Management
            </div>
        </div>

        <!-- Notifications -->
        <div class="intro-y col-span-12">
            <x-notification-toast id="appointments_toast_success" type="success" title="Success" message="Appointment updated successfully"
                :showButton="false" />
            <x-notification-toast id="appointments_toast_error" type="error" title="Error" :showButton="false">
                <div id="appointments-error-message-slot" class="text-slate-500 mt-1"></div>
            </x-notification-toast>
            <style>
                .toastify {
                    background: transparent !important;
                    box-shadow: none !important;
                }
                
                /* Custom styling for status update form */
                .remarks-readonly {
                    background-color: #f8fafc !important;
                    color: #475569 !important;
                    cursor: not-allowed !important;
                    border-color: #cbd5e1 !important;
                }
                
                .remarks-required {
                    border-color: #f59e0b !important;
                    border-width: 2px !important;
                    background-color: #fef3c7 !important;
                }
            </style>
        </div>

        <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 gap-2">
            <!-- Date Range Filter -->
            <input type="text" data-daterange="true" class="datepicker form-control w-56" placeholder="Filter by date range" id="dateRangeFilter">
            
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
                        <li><a href="javascript:;" class="dropdown-item" data-status-filter="all">All Status</a></li>
                        @foreach($allStatuses as $status)
                            <li><a href="javascript:;" class="dropdown-item" data-status-filter="{{ strtolower($status) }}">{{ ucfirst($status) }}</a></li>
                        @endforeach
                    </ul>
                </div>
            </div>

            <!-- Category Filter -->
            <div class="dropdown">
                <button class="dropdown-toggle btn btn-outline-secondary" aria-expanded="false" data-tw-toggle="dropdown" id="categoryFilterBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    Category: All
                </button>
                <div class="dropdown-menu w-48 max-h-60 overflow-y-auto">
                    <ul class="dropdown-content">
                        <li><a href="javascript:;" class="dropdown-item" data-category-filter="all">All Categories</a></li>
                        @php
                            $categories = $appointments->pluck('appointmentCategory')->filter()->unique('id');
                        @endphp
                        @foreach($categories as $category)
                            <li><a href="javascript:;" class="dropdown-item" data-category-filter="{{ $category->category_name }}">{{ $category->category_name }}</a></li>
                        @endforeach
                    </ul>
                </div>
            </div>

            <!-- Time Filter -->
            <div class="dropdown">
                <button class="dropdown-toggle btn btn-outline-secondary" aria-expanded="false" data-tw-toggle="dropdown" id="timeFilterBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Time: All
                </button>
                <div class="dropdown-menu w-48 max-h-60 overflow-y-auto">
                    <ul class="dropdown-content">
                        <li><a href="javascript:;" class="dropdown-item" data-time-filter="all" data-time-display="All Times">All Times</a></li>
                        @foreach($allTimes as $timeObj)
                            <li><a href="javascript:;" class="dropdown-item" data-time-filter="{{ $timeObj['raw'] }}" data-time-display="{{ $timeObj['display'] }}">{{ $timeObj['display'] }}</a></li>
                        @endforeach
                    </ul>
                </div>
            </div>
            
            <!-- Clear Filters Button -->
            <button type="button" class="btn btn-outline-secondary" id="clearFilterBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Show All
            </button>
            
            <!-- Entry Count -->
            <div class="hidden md:block mx-auto text-slate-500">
                Showing <span id="filtered-count">{{ $appointments->count() }}</span> of <span id="total-count">{{ $appointments->total() }}</span> entries
            </div>
            
            <!-- Search Input -->
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
        <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
            <table class="table table-report -mt-2" id="appointmentTable">
                <thead>
                <tr>
                    <th class="whitespace-nowrap">TRACKING NUMBER</th>
                    <!-- <th class="whitespace-nowrap">DESCRIPTION</th> -->
                    <th class="whitespace-nowrap">CATEGORY</th>
                    <th class="whitespace-nowrap">APPOINTMENT DATE</th>
                    <th class="whitespace-nowrap">TIME</th>
                    <th class="text-center whitespace-nowrap">STATUS</th>
                    <th class="text-center whitespace-nowrap">REMARKS</th>
                    <th class="text-center whitespace-nowrap">CREATED</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
                </thead>
                <tbody>
                    @foreach ($appointments as $appointment)
                        @php
                            // Format appointment date for JavaScript filtering
                            $appointmentDateForFilter = $appointment->appointment_date;
                            try {
                                $formattedAppointmentDate = $appointment->appointment_date ? \Carbon\Carbon::parse($appointment->appointment_date)->format('Y-m-d') : '';
                            } catch (\Exception $e) {
                                $formattedAppointmentDate = '';
                            }
                            
                            // Get category name
                            $categoryName = $appointment->appointmentCategory->category_name ?? '';
                        @endphp
                        <tr class="intro-x" 
                            data-tracking="{{ $appointment->tracking_number }}" 
                            data-description="{{ $appointment->description }}" 
                            data-status="{{ $appointment->status }}" 
                            data-appointment-date="{{ $formattedAppointmentDate }}"
                            data-category="{{ $categoryName }}"
                            data-time="{{ $appointment->time ?? '' }}">
                            <td><a href="javascript:;" class="font-medium whitespace-nowrap">{{ $appointment->tracking_number }}</a></td>
                            <!-- <td class="whitespace-nowrap">{{ Str::limit($appointment->description, 50) }}</td> -->
                            <td class="whitespace-nowrap">{{ $categoryName }}</td>
                            <td class="whitespace-nowrap">{{ $appointment->appointment_date ? \Carbon\Carbon::parse($appointment->appointment_date)->format('M d, Y') : 'N/A' }}</td>
                            <td class="whitespace-nowrap">
                                <span class="font-medium text-primary">
                                    {{ $appointment->time ?? 'N/A' }}
                                </span>
                            </td>
                            <td class="w-40">
                                @php 
                                    $currentStatusConfig = getStatusConfig($appointment->status, $statusConfig);
                                    $statusText = ucfirst($appointment->status);
                                @endphp
                                <div class="flex items-center justify-center {{ $currentStatusConfig['color'] }}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                        {!! $currentStatusConfig['icon'] !!}
                                    </svg>
                                    {{ $statusText }}
                                </div>
                            </td>
                            <td class="text-center">
                                @if($appointment->remarks)
                                    <span class="text-sm text-slate-600" title="{{ $appointment->remarks }}">
                                        {{ Str::limit($appointment->remarks, 30) }}
                                    </span>
                                @else
                                    <span class="text-slate-400">-</span>
                                @endif
                            </td>
                            <td class="text-center">{{ $appointment->created_at ? \Carbon\Carbon::parse($appointment->created_at)->format('M d, Y') : 'N/A' }}</td>
                            <td class="table-report__action w-56">
                                <div class="flex justify-center items-center">
                                    <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view-appointment-modal" data-appointment-id="{{ $appointment->id }}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" icon-name="eye"
                                            data-lucide="eye" class="lucide lucide-eye w-4 h-4 mr-1">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                        View
                                    </a>
                                    <div class="dropdown">
                                        <button class="dropdown-toggle btn btn-outline-primary btn-sm" aria-expanded="false" data-tw-toggle="dropdown">
                                            Change Status
                                        </button>
                                        <div class="dropdown-menu w-40">
                                            <ul class="dropdown-content">
                                                @php
                                                    // Define all available status actions
                                                    $availableActions = ['approved', 'cancelled', 'completed', 'pending'];
                                                @endphp
                                                @foreach($availableActions as $status)
                                                    @php
                                                        $config = getStatusConfig($status, $statusConfig);
                                                        $statusLower = strtolower($status);
                                                        $displayName = $statusLower === 'pending' ? 'Set to Pending' : ucfirst($status);
                                                        $extraAttrs = '';
                                                        if ($statusLower === 'cancelled') {
                                                            $extraAttrs = ' data-tw-toggle="modal" data-tw-target="#cancel-reason-modal"';
                                                        }
                                                    @endphp
                                                    <li>
                                                        <a href="javascript:;" class="dropdown-item" data-action="{{ $config['action'] }}" data-appointment-id="{{ $appointment->id }}"{!! $extraAttrs !!}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 {{ $config['color'] }}">
                                                                {!! $config['icon'] !!}
                                                            </svg>
                                                            {{ $displayName }}
                                                        </a>
                                                    </li>
                                                @endforeach
                                            </ul>
                                        </div>
                                    </div>
                                    <a class="flex items-center text-danger ml-2" href="javascript:;" data-action="delete" data-id="{{ $appointment->id }}" data-tw-toggle="modal" data-tw-target="#delete-appointment-modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2"
                                            data-lucide="trash-2" class="w-4 h-4 mr-1">
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
                    <!-- No results message (for search/filter) -->
                    <tr class="intro-x hidden" id="no-results-row">
                        <td colspan="7" class="text-center py-8">
                            <div class="text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <div class="font-medium">No appointments found</div>
                                <div class="text-sm">Try adjusting your search or filter criteria</div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- BEGIN: Delete Modal -->
        <div id="delete-appointment-modal" class="modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body px-5 py-10">
                        <div class="text-center">
                            <div class="mb-5">Are you sure you want to delete this appointment?</div>
                            <input type="hidden" id="deleteAppointmentId" />
                            <button type="button" id="confirmDeleteAppointment" class="btn btn-danger w-24 mr-2">Delete</button>
                            <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: Delete Modal -->

    <!-- END: Appointments Layout -->
    <!-- BEGIN: Pagination -->
        <x-pagination :current-page="$appointments->currentPage()" :total-pages="$appointments->lastPage()" :per-page="$appointments->perPage()" :show-per-page-selector="true" :show-first-last="true" />
    <!-- END: Pagination -->

    <!-- BEGIN: View Appointment Modal -->
    <div id="view-appointment-modal" class="modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="font-medium text-base mr-auto">Appointment Details</h2>
                    <button type="button" class="btn btn-outline-secondary w-8 h-8 mr-1" data-tw-dismiss="modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="modal-body px-5 py-10">
                    <div id="appointment-details">
                        <div class="text-center text-slate-500">
                            <p>Click on a "View" button to see appointment details</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer px-5 py-3">
                    <div class="flex justify-end gap-2">
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- END: View Appointment Modal -->

         <!-- BEGIN: Cancel Reason Modal -->
     <div id="cancel-reason-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
         <div class="modal-dialog">
             <div class="modal-content">
                 <div class="modal-body px-5 py-10">
                     <div class="text-center">
                         <div class="mb-5">
                             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 text-danger">
                                 <circle cx="12" cy="12" r="10"></circle>
                                 <line x1="15" y1="9" x2="9" y2="15"></line>
                                 <line x1="9" y1="9" x2="15" y2="15"></line>
                             </svg>
                             <h3 class="text-lg font-medium mb-2">Cancel Appointment</h3>
                             <p class="text-slate-500">Please provide a reason for cancelling this appointment</p>
                         </div>
                         <form id="cancelReasonForm" class="text-left">
                             <input type="hidden" name="_token" value="{{ csrf_token() }}">
                             <input type="hidden" name="_method" value="PUT">
                             <input type="hidden" id="cancelAppointmentId" name="appointment_id">
                             
                             <div class="mb-6">
                                 <label class="form-label">Reason for Cancellation *</label>
                                 <textarea name="reason" id="cancelReason" class="form-control" rows="4" placeholder="Please provide a reason for cancelling this appointment..." required></textarea>
                                 <div class="text-slate-500 text-xs mt-1">This reason will be recorded and visible to the user.</div>
                             </div>
                             
                             <div class="text-center">
                                 <button type="button" onclick="confirmCancelAppointment()" class="btn btn-danger w-24 mr-2">Cancel</button>
                                 <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Back</button>
                             </div>
                         </form>
                     </div>
                 </div>
             </div>
         </div>
     </div>
     <!-- END: Cancel Reason Modal -->

    <!-- BEGIN: Approve Confirmation Modal -->
    <div id="approve-confirmation-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body px-5 py-10">
                    <div class="text-center">
                        <div class="mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 text-success">
                                <polyline points="9 11 12 14 22 4"></polyline>
                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                            </svg>
                            <h3 class="text-lg font-medium mb-2">Approve Appointment</h3>
                            <p class="text-slate-500">Please provide remarks for approving this appointment</p>
                        </div>
                        <form id="approveReasonForm" class="text-left">
                            <input type="hidden" name="_token" value="{{ csrf_token() }}">
                            <input type="hidden" name="_method" value="PUT">
                            <input type="hidden" id="approveAppointmentId" name="appointment_id">
                            
                            <div class="mb-6">
                                <label class="form-label">Remarks *</label>
                                <textarea name="remarks" id="approveRemarks" class="form-control" rows="4" placeholder="Enter remarks for approval..." required>Your appointment is approved and you may now go to office at that time and date that in your appointment</textarea>
                                <div class="text-slate-500 text-xs mt-1">This remark will be recorded and visible to the user.</div>
                            </div>
                            
                            <div class="text-center">
                                <button type="button" onclick="confirmApproveAppointment()" class="btn btn-success w-24 mr-2">Approve</button>
                                <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Approve Confirmation Modal -->

    <!-- BEGIN: Complete Confirmation Modal -->
    <div id="complete-confirmation-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body px-5 py-10">
                    <div class="text-center">
                        <div class="mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 text-info">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <h3 class="text-lg font-medium mb-2">Complete Appointment</h3>
                            <p class="text-slate-500">Please provide remarks for completing this appointment</p>
                        </div>
                        <form id="completeReasonForm" class="text-left">
                            <input type="hidden" name="_token" value="{{ csrf_token() }}">
                            <input type="hidden" name="_method" value="PUT">
                            <input type="hidden" id="completeAppointmentId" name="appointment_id">
                            
                            <div class="mb-6">
                                <label class="form-label">Remarks *</label>
                                <textarea name="remarks" id="completeRemarks" class="form-control" rows="4" placeholder="Enter remarks for completion..." required>Your appointment has been completed successfully</textarea>
                                <div class="text-slate-500 text-xs mt-1">This remark will be recorded and visible to the user.</div>
                            </div>
                            
                            <div class="text-center">
                                <button type="button" onclick="confirmCompleteAppointment()" class="btn btn-info w-24 mr-2">Complete</button>
                                <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Complete Confirmation Modal -->

    <!-- BEGIN: Pending Confirmation Modal -->
    <div id="pending-confirmation-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body px-5 py-10">
                    <div class="text-center">
                        <div class="mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 text-warning">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                            </svg>
                            <h3 class="text-lg font-medium mb-2">Set to Pending?</h3>
                            <p class="text-slate-500">Are you sure you want to set this appointment back to pending status?</p>
                        </div>
                        <input type="hidden" id="pendingAppointmentId">
                        <button type="button" onclick="confirmPendingAppointment()" class="btn btn-warning w-24 mr-2">Set Pending</button>
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Pending Confirmation Modal -->
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/appointment-management/appointment-management.js?v=' . time()) }}"></script>
@endpush
