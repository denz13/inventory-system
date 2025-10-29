@extends('layout._partials.master')

@section('content')
<div class="col-span-12 mt-6 -mb-6 intro-y">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>Incident Report Management: Monitor and manage all incident reports. Status updates and guard assignments are tracked for each report.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> 
        </button>
    </div>
</div>

<h2 class="intro-y text-lg font-medium mt-10">
    Incident Reports Management
</h2>

<!-- Notifications -->
<div class="intro-y col-span-12">
        <x-notification-toast id="incident_report_management_toast_success" type="success" title="Success" message="Action completed successfully"
            :showButton="false" />
        <x-notification-toast id="incident_report_management_toast_error" type="error" title="Error" :showButton="false">
            <div id="incident_report_management_error_message_slot" class="text-slate-500 mt-1"></div>
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
            
            .service-type-option:hover, .category-option:hover {
                border-color: #3b82f6 !important;
                background-color: #f8fafc;
            }
            .service-type-option.selected, .category-option.selected {
                border-color: #3b82f6 !important;
                background-color: #eff6ff;
            }
            .step-content {
                transition: all 0.3s ease;
            }
            .step-content.hidden {
                display: none;
            }
            .step-indicator {
                display: flex;
                justify-content: center;
                margin-bottom: 2rem;
            }
            .step-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: #e2e8f0;
                margin: 0 8px;
                transition: all 0.3s ease;
            }
            .step-dot.active {
                background-color: #3b82f6;
                transform: scale(1.2);
            }
            .step-dot.completed {
                background-color: #10b981;
            }
            
            /* Table responsive styles */
            .overflow-x-auto {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }
            
            .table-report {
                border-collapse: separate;
                border-spacing: 0;
            }
            
            /* Custom scrollbar for better UX */
            .overflow-x-auto::-webkit-scrollbar {
                height: 8px;
            }
            
            .overflow-x-auto::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }
            
            .overflow-x-auto::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 10px;
            }
            
            .overflow-x-auto::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        </style>
    </div>
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
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="all">All Reports</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="Pending">Pending</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="Under Investigation">Under Investigation</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="Resolved">Resolved</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="Closed">Closed</a> </li> 
                </ul> 
            </div> 
        </div>

        <!-- Street Filter -->
        <div class="dropdown"> 
            <button class="dropdown-toggle btn btn-outline-secondary" aria-expanded="false" data-tw-toggle="dropdown" id="locationFilterBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Filter by Location
            </button> 
            <div class="dropdown-menu w-64" style="max-height: 300px; overflow-y: auto;"> 
                <ul class="dropdown-content"> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="location" data-filter-value="all">All Location</a> </li>
                    @forelse($streets as $street)
                        <li> <a href="javascript:;" class="dropdown-item text-sm" data-filter-type="location" data-filter-value="{{ $street }}">{{ $street }}</a> </li>
                    @empty
                        <li class="dropdown-item text-slate-500 text-sm">No streets available</li>
                    @endforelse
                </ul> 
            </div> 
        </div>

        <!-- Date Filter -->
        <div class="dropdown"> 
            <button class="dropdown-toggle btn btn-outline-secondary" aria-expanded="false" data-tw-toggle="dropdown" id="dateFilterBtn">
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
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date" data-filter-value="all">All Dates</a> </li>
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date" data-filter-value="today">Today</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date" data-filter-value="yesterday">Yesterday</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date" data-filter-value="this-week">This Week</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date" data-filter-value="last-week">Last Week</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date" data-filter-value="this-month">This Month</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date" data-filter-value="last-month">Last Month</a> </li> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="date" data-filter-value="this-year">This Year</a> </li> 
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
            Showing <span id="filtered-count">{{ $incidentReports->count() }}</span> of <span id="total-count">{{ $incidentReports->total() }}</span> entries
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
    <div class="intro-y col-span-12 overflow-x-auto">
        <div class="min-w-full inline-block align-middle">
            <div class="overflow-hidden">
                <table class="table table-report -mt-2 min-w-full">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">REPORTER</th>
                    <th class="whitespace-nowrap">PERSON INVOLVED</th>
                    <th class="whitespace-nowrap">INCIDENT DATE/TIME</th>
                    <th class="whitespace-nowrap">DESCRIPTION OF INCIDENT</th>
                    <th class="whitespace-nowrap">STREET</th>
                    <th class="whitespace-nowrap">ASSIGNED GUARD</th>
                    <th class="text-center whitespace-nowrap">STATUS</th>
                    <th class="text-center whitespace-nowrap">DATE REPORTED</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                @forelse($incidentReports as $report)
                <tr class="intro-x" data-status="{{ $report->status }}" data-date="{{ $report->created_at ? $report->created_at->format('Y-m-d H:i:s') : '' }}" data-location="{{ $report->location_of_incident ?? '' }}">
                    <td class="w-40">
                        <div class="flex items-center">
                            <div class="w-10 h-10 image-fit zoom-in">
                                <img alt="Profile" class="tooltip rounded-full" src="{{ $report->user->photo_url ?? 'dist/images/preview-8.jpg' }}">
                            </div>
                            <div class="ml-3">
                                <div class="font-medium">{{ $report->user->name ?? 'N/A' }}</div>
                                <div class="text-slate-500 text-xs">{{ $report->user->email ?? 'N/A' }}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="font-medium">{{ $report->person_involved_name ?? 'N/A' }}</div>
                        <div class="text-slate-500 text-xs">{{ $report->designation ?? 'N/A' }}</div>
                    </td>
                    <td class="whitespace-nowrap">
                        {{ $report->datetime_of_incident ? \Carbon\Carbon::parse($report->datetime_of_incident)->format('M d, Y g:i A') : 'N/A' }}
                    </td>
                    <td class="whitespace-nowrap">{{ $report->location_of_incident ?? 'N/A' }}</td>
                    <td class="whitespace-nowrap">{{ $report->street ?? 'N/A' }}</td>
                    <td class="w-40">
                        @if($report->assignedGuard)
                            <div class="flex items-center">
                                <div class="w-8 h-8 image-fit zoom-in">
                                    <img alt="Guard Profile" class="tooltip rounded-full" src="{{ $report->assignedGuard->photo_url ?? 'dist/images/preview-8.jpg' }}">
                                </div>
                                <div class="ml-3">
                                    <div class="font-medium">{{ $report->assignedGuard->name }}</div>
                                    <div class="text-slate-500 text-xs">{{ $report->assignedGuard->email }}</div>
                                </div>
                            </div>
                        @else
                            <div class="flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-slate-400">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span class="text-slate-400 text-sm">Not Assigned</span>
                            </div>
                        @endif
                    </td>
                    <td class="w-40">
                        <div class="flex items-center justify-center 
                            @if($report->status === 'Pending') text-warning
                            @elseif($report->status === 'Under Investigation') text-info
                            @elseif($report->status === 'Resolved') text-success
                            @elseif($report->status === 'Closed') text-slate-500
                            @else text-slate-500
                            @endif">
                            @if($report->status === 'Pending')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            @elseif($report->status === 'Under Investigation')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12,6 12,12 16,14"></polyline>
                                </svg>
                            @elseif($report->status === 'Resolved')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                </svg>
                            @elseif($report->status === 'Closed')
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
                            {{ $report->status ?? 'Unknown' }}
                        </div>
                    </td>
                    <td class="text-center">{{ $report->created_at ? $report->created_at->format('M d, Y g:i A') : 'N/A' }}</td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view-report-modal" data-report-id="{{ $report->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View
                            </a>
                            @if(!in_array($report->status, ['Closed']))
                            <div class="dropdown">
                                <button class="dropdown-toggle btn btn-outline-primary btn-sm" aria-expanded="false" data-tw-toggle="dropdown">
                                    Manage
                                </button>
                                <div class="dropdown-menu w-48">
                                    <ul class="dropdown-content">
                                        <li>
                                            <a href="javascript:;" class="dropdown-item" data-action="update-status" data-report-id="{{ $report->id }}" data-tw-toggle="modal" data-tw-target="#update-status-modal">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-info">
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                    <path d="M12 1v6m0 6v6"></path>
                                                    <path d="M9 12h6"></path>
                                                </svg>
                                                Update Status
                                            </a>
                                        </li>
                                        @if(!$report->assignedGuard)
                                        <li>
                                            <a href="javascript:;" class="dropdown-item" data-action="assign-guard" data-report-id="{{ $report->id }}" data-tw-toggle="modal" data-tw-target="#assign-guard-modal">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-success">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="12" cy="7" r="4"></circle>
                                                </svg>
                                                Assign Guard
                                            </a>
                                        </li>
                                        @endif
                                    </ul>
                                </div>
                            </div>
                            @endif
                        </div>
                    </td>
                </tr>
                @empty
                <tr class="intro-x">
                    <td colspan="8" class="text-center py-8">
                        <div class="text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                            </svg>
                            <div class="font-medium">No incident reports found</div>
                            <div class="text-sm">There are currently no incident reports to display</div>
                        </div>
                    </td>
                </tr>
                @endforelse
            </tbody>
                </table>
            </div>
        </div>
    </div>
    <!-- END: Data List -->
    
    <!-- BEGIN: Pagination -->
    <x-pagination 
        :current-page="$incidentReports->currentPage()" 
        :total-pages="$incidentReports->lastPage()" 
        :per-page="$incidentReports->perPage()" 
        :show-per-page-selector="true" 
        :show-first-last="true" 
    />
    <!-- END: Pagination -->
</div>

<!-- BEGIN: View Report Modal -->
<div id="view-report-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-body p-0">
                <div id="report-details">
                    <div class="text-center text-slate-500 py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-lg">Loading incident report details...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: View Report Modal -->

<!-- BEGIN: Update Status Modal -->
<div id="update-status-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-info text-white">
                <h2 class="font-semibold text-lg mr-auto flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6"></path>
                        <path d="M9 12h6"></path>
                    </svg>
                    Update Report Status
                </h2>
                <button type="button" data-tw-dismiss="modal" class="text-white hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body px-6 py-8">
                <form id="updateStatusForm" method="POST">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" id="updateReportId">
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Current Status</label>
                        <div class="mt-2 p-3 bg-slate-100 rounded-lg border">
                            <div class="text-slate-800 font-medium" id="currentStatus">-</div>
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">New Status</label>
                        <select name="status" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                            <option value="">Select Status</option>
                            <option value="Pending">🟡 Pending</option>
                            <option value="Under Investigation">🔵 Under Investigation</option>
                            <option value="Resolved">🟢 Resolved</option>
                            <option value="Closed">⚫ Closed</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2 mr-2">Cancel</button>
                    <button type="submit" form="updateStatusForm" class="btn btn-primary px-6 py-2 flex items-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        Update Status
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Update Status Modal -->

<!-- BEGIN: Assign Guard Modal -->
<div id="assign-guard-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h2 class="font-semibold text-lg mr-auto flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Assign Security Guard
                </h2>
                <button type="button" data-tw-dismiss="modal" class="text-white hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body px-6 py-8">
                <form id="assignGuardForm" method="POST">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" id="assignReportId">
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Select Security Guard</label>
                        <select name="guard_id" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                            <option value="">👮 Choose a guard</option>
                            @foreach($guards as $guard)
                                <option value="{{ $guard->id }}">🛡️ {{ $guard->name }} - {{ $guard->email }}</option>
                            @endforeach
                        </select>
                        <div class="mt-2 text-sm text-slate-600">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 6v6l4 2"></path>
                                </svg>
                                Assigning a guard will automatically update the status to "Under Investigation"
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2">Cancel</button>
                    <button type="submit" form="assignGuardForm" class="btn btn-success px-6 py-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Assign Guard
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Assign Guard Modal -->

@endsection

@push('scripts')
    <!-- Toastify for notifications -->
    <script src="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.css">
    
    <script src="{{ asset('js/incident-report-management/incident-report-management.js') }}?v={{ time() }}"></script>
@endpush