@extends('layout._partials.master')

@section('content')
<div class="col-span-12 mt-6 -mb-6 intro-y">
                                <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
                                    <span>Take note: The Approved and Declined Button will be hide after the status is changed into Approved or Declined.</span>
                                    <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> </button>
                                </div>
                            </div>
<h2 class="intro-y text-lg font-medium mt-10">
                    List of Homeowners Service Requests
                </h2>
                <div class="grid grid-cols-12 gap-6 mt-5">
                    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 gap-2">
                        <!-- Status Filter -->
                        <div class="dropdown"> 
                            <button class="dropdown-toggle btn btn-primary" aria-expanded="false" data-tw-toggle="dropdown" id="statusFilterBtn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                </svg>
                                Status: All
                            </button> 
                            <div class="dropdown-menu w-48"> 
                                <ul class="dropdown-content"> 
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="all">All Requests</a> </li> 
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="Pending">Pending</a> </li> 
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="Approved">Approved</a> </li> 
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="Declined">Declined</a> </li> 
                                </ul> 
                            </div> 
                        </div>

                        <!-- Sort by Name -->
                        <div class="dropdown"> 
                            <button class="dropdown-toggle btn btn-outline-secondary" aria-expanded="false" data-tw-toggle="dropdown" id="nameSortBtn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <line x1="4" y1="9" x2="20" y2="9"></line>
                                    <line x1="4" y1="15" x2="20" y2="15"></line>
                                    <line x1="10" y1="3" x2="8" y2="21"></line>
                                    <line x1="16" y1="3" x2="14" y2="21"></line>
                                </svg>
                                Name
                            </button> 
                            <div class="dropdown-menu w-40"> 
                                <ul class="dropdown-content"> 
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="name-sort" data-filter-value="default">Default</a> </li>
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="name-sort" data-filter-value="a-z">A-Z</a> </li> 
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="name-sort" data-filter-value="z-a">Z-A</a> </li> 
                                </ul> 
                            </div> 
                        </div>

                        <!-- Filter by Date -->
                        <div class="dropdown"> 
                            <button class="dropdown-toggle btn btn-outline-secondary" aria-expanded="false" data-tw-toggle="dropdown" id="dateSortBtn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                Filter by Date
                            </button> 
                            <div class="dropdown-menu w-40"> 
                                <ul class="dropdown-content"> 
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date-filter" data-filter-value="all">All Dates</a> </li>
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date-filter" data-filter-value="today">Today</a> </li> 
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date-filter" data-filter-value="yesterday">Yesterday</a> </li> 
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date-filter" data-filter-value="this-week">This Week</a> </li> 
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date-filter" data-filter-value="last-week">Last Week</a> </li> 
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date-filter" data-filter-value="this-month">This Month</a> </li> 
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date-filter" data-filter-value="last-month">Last Month</a> </li> 
                                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date-filter" data-filter-value="this-year">This Year</a> </li> 
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
                            Showing <span id="filtered-count">{{ $serviceRequests->count() }}</span> of <span id="total-count">{{ $serviceRequests->total() }}</span> entries
                        </div>
                        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                            <div class="w-56 relative text-slate-500">
                                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." id="searchInput">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> 
                            </div>
                        </div>
                    </div>
                    <!-- BEGIN: Data List -->
                    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
                        <table class="table table-report -mt-2">
                            <thead>
                                <tr>
                                    <th class="whitespace-nowrap">HOMEOWNER</th>
                                    <th class="whitespace-nowrap">SERVICE TYPE</th>
                                    <th class="whitespace-nowrap">CATEGORY</th>
                                    <th class="whitespace-nowrap">DESCRIPTION</th>
                                    <th class="text-center whitespace-nowrap">STATUS</th>
                                    <th class="text-center whitespace-nowrap">DATE SUBMITTED</th>
                                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($serviceRequests as $request)
                                <tr class="intro-x" data-date="{{ $request->created_at ? $request->created_at->format('Y-m-d H:i:s') : '' }}">
                                    <td class="w-40">
                                        <div class="flex items-center">
                                            <div class="w-10 h-10 image-fit zoom-in">
                                                <img alt="Profile" class="tooltip rounded-full" src="{{ $request->user->photo_url ?? 'dist/images/preview-8.jpg' }}">
                                            </div>
                                            <div class="ml-3">
                                                <div class="font-medium">{{ $request->user->name ?? 'N/A' }}</div>
                                                <div class="text-slate-500 text-xs">{{ $request->user->email ?? 'N/A' }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="font-medium">{{ $request->serviceCategory->serviceType->type ?? 'N/A' }}</div>
                                        <div class="text-slate-500 text-xs">{{ $request->serviceCategory->serviceType->status ?? 'N/A' }}</div>
                                    </td>
                                    <td class="whitespace-nowrap">{{ $request->serviceCategory->category ?? 'N/A' }}</td>
                                    <td class="whitespace-nowrap">{{ Str::limit($request->complaint_description, 50) }}</td>
                                    <td class="w-40">
                                        <div class="flex items-center justify-center 
                                            @if($request->status === 'Pending') text-warning
                                            @elseif($request->status === 'In Progress') text-info
                                            @elseif($request->status === 'Completed') text-success
                                            @elseif($request->status === 'Cancelled') text-danger
                                            @else text-slate-500
                                            @endif">
                                            @if($request->status === 'Pending')
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                                </svg>
                                            @elseif($request->status === 'In Progress')
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12,6 12,12 16,14"></polyline>
                                                </svg>
                                            @elseif($request->status === 'Completed')
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                                    <polyline points="9 11 12 14 22 4"></polyline>
                                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                                </svg>
                                            @elseif($request->status === 'Cancelled')
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                                </svg>
                                            @else
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                                </svg>
                                            @endif
                                            {{ $request->status ?? 'Unknown' }}
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <div class="text-slate-700">{{ $request->created_at ? $request->created_at->diffForHumans() : 'N/A' }}</div>
                                        <div class="text-slate-500 text-xs">{{ $request->created_at ? $request->created_at->format('M d, Y g:i A') : '' }}</div>
                                    </td>
                                    <td class="table-report__action w-56">
                                        <div class="flex justify-center items-center">
                                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view-request-modal" data-request-id="{{ $request->id }}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                                View
                                            </a>
                                            @if($request->status === 'Pending')
                                            <div class="dropdown">
                                                <button class="dropdown-toggle btn btn-outline-primary btn-sm" aria-expanded="false" data-tw-toggle="dropdown">
                                                    Update Status
                                                </button>
                                                <div class="dropdown-menu w-40">
                                                    <ul class="dropdown-content">
                                                        <li>
                                                            <a href="javascript:;" class="dropdown-item" data-action="approve" data-request-id="{{ $request->id }}">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-success">
                                                                    <polyline points="9 11 12 14 22 4"></polyline>
                                                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                                                </svg>
                                                                Approve
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:;" class="dropdown-item" data-action="decline" data-request-id="{{ $request->id }}">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-danger">
                                                                    <circle cx="12" cy="12" r="10"></circle>
                                                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                                                </svg>
                                                                Decline
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                                @empty
                                <tr class="intro-x">
                                    <td colspan="7" class="text-center py-8">
                                        <div class="text-slate-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                                <polyline points="14,2 14,8 20,8"></polyline>
                                            </svg>
                                            <div class="font-medium">No service requests found</div>
                                            <div class="text-sm">There are currently no service requests to display</div>
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
                        :current-page="$serviceRequests->currentPage()" 
                        :total-pages="$serviceRequests->lastPage()" 
                        :per-page="$serviceRequests->perPage()" 
                        :show-per-page-selector="true" 
                        :show-first-last="true" 
                    />
                    <!-- END: Pagination -->
                </div>

<!-- BEGIN: Notification Toasts -->
<x-notification-toast 
    id="service_management_toast_success" 
    type="success" 
    title="Success!" 
    :showButton="false" 
>
    <div id="service-management-success-message-slot" class="text-slate-500 mt-1">Action completed successfully</div>
</x-notification-toast>

<x-notification-toast 
    id="service_management_toast_error" 
    type="error" 
    title="Error!" 
    :showButton="false"
>
    <div id="service-management-error-message-slot" class="text-slate-500 mt-1">An error occurred</div>
</x-notification-toast>

<style>
    .toastify {
        background: transparent !important;
        box-shadow: none !important;
    }
    .service-type-option:hover, .category-option:hover {
        border-color: #3b82f6 !important;
        background-color: #f8fafc;
    }
    .service-type-option.selected, .category-option.selected {
        border-color: #3b82f6 !important;
        background-color: #eff6ff;
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
<!-- END: Notification Toasts -->

<!-- BEGIN: View Request Modal -->
<div id="view-request-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            
            <div class="modal-body px-5 py-10">
                <div id="request-details">
                    <div class="text-center text-slate-500">
                        <p>Click on a "View" button to see request details</p>
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
<!-- END: View Request Modal -->

<!-- BEGIN: Update Status Modal -->
<div id="update-status-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Update Service Request Status</h2>
                <button type="button" data-tw-dismiss="modal" class="btn-close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body px-5 py-10">
                <form id="updateStatusForm" method="POST">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" id="updateRequestId">
                    
                    <div class="mb-6">
                        <label class="form-label">Current Status</label>
                        <div class="text-slate-500" id="currentStatus">-</div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label">New Status</label>
                        <select name="status" class="form-control" required>
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label">Notes (Optional)</label>
                        <textarea name="notes" class="form-control" rows="3" placeholder="Add any notes about this status update..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer px-5 py-3">
                <div class="flex justify-end gap-2">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                    <button type="submit" form="updateStatusForm" class="btn btn-primary w-24">Update</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Update Status Modal -->

<!-- BEGIN: Approve Confirmation Modal -->
<div id="approve-confirmation-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            
            <div class="modal-body px-5 py-10">
                <div class="text-center">
                    <div class="mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 text-success">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        <h3 class="text-lg font-medium mb-2">Approve Service Request?</h3>
                        <p class="text-slate-500">Are you sure you want to approve this service request?</p>
                    </div>
                    <input type="hidden" id="approveRequestId">
                </div>
            </div>
            <div class="modal-footer px-5 py-3">
                <div class="flex justify-end gap-2">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                    <button type="button" onclick="confirmApprove()" class="btn btn-success w-24">Approve</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Approve Confirmation Modal -->

<!-- BEGIN: Decline Reason Modal -->
<div id="decline-reason-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
           
            <div class="modal-body px-5 py-10">
                <form id="declineReasonForm">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" id="declineRequestId" name="request_id">
                    
                    <div class="mb-6">
                        <label class="form-label">Reason for Decline</label>
                        <textarea name="reason" id="declineReason" class="form-control" rows="4" placeholder="Please provide a reason for declining this service request..." required></textarea>
                        <div class="text-slate-500 text-xs mt-1">This reason will be recorded and visible to the user.</div>
                    </div>
                </form>
            </div>
            <div class="modal-footer px-5 py-3">
                <div class="flex justify-end gap-2">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                    <button type="button" onclick="confirmDecline()" class="btn btn-danger w-24">Decline</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Decline Reason Modal -->

@endsection

@push('scripts')
    <!-- Toastify for notifications -->
    <script src="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.css">
    
    <script src="{{ asset('js/servicemanagement/service-management.js') }}"></script>
@endpush
