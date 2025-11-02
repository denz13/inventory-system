@extends('layout._partials.master')

@section('content')
<div class="col-span-12 mt-6 -mb-6 intro-y">

    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>Take note: Incident reports are only available for logged in users and you can only update and delete your own reports if the status is still pending.</span>
                <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> </button>
            </div>
        </div>
            <h2 class="intro-y text-lg font-medium mt-10">
        List of Incident Reports
    </h2>   

    <!-- Notifications -->
    <div class="intro-y col-span-12">
        <x-notification-toast id="incident_toast_success" type="success" title="Success" message="Incident report submitted successfully"
            :showButton="false" />
        <x-notification-toast id="incident_toast_error" type="error" title="Error" :showButton="false">
            <div id="incident-error-message-slot" class="text-slate-500 mt-1"></div>
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
        </style>
    </div>

    <div class="grid grid-cols-12 gap-6 mt-5">

    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <button class="btn btn-primary shadow-md mr-2" data-tw-toggle="modal" data-tw-target="#report-incident-modal">
            Report Incident
        </button>
        
        <div class="hidden md:block mx-auto text-slate-500">Showing {{ $userIncidents->firstItem() ?? 0 }} to {{ $userIncidents->lastItem() ?? 0 }} of {{ $userIncidents->total() ?? 0 }} entries</div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div class="w-56 relative text-slate-500">
                <div class="relative">
                    <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." id="searchInput">
                    <!-- <button type="button" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" id="clearSearch" style="display: none;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button> -->
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg> 
                            </div>
            </div>
        </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
        <table class="table table-report -mt-2">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">PERSON INVOLVED</th>
                    <th class="whitespace-nowrap">DESIGNATION</th>
                    <th class="whitespace-nowrap">DESCRIPTION OF INCIDENT</th>
                    <th class="text-center whitespace-nowrap">STATUS</th>
                    <th class="text-center whitespace-nowrap">INCIDENT DATE</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                @forelse($userIncidents as $incident)
                <tr class="intro-x">
                    <td>
                        <a href="javascript:;" class="font-medium whitespace-nowrap">{{ $incident->person_involved_name }}</a> 
                        <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">{{ $incident->address }}</div>
                    </td>
                    <td class="whitespace-nowrap">{{ $incident->designation }}</td>
                    <td class="whitespace-nowrap">{{ Str::limit($incident->location_of_incident, 50) }}</td>
                    <td class="w-40">
                        <div class="flex items-center justify-center 
                            @if($incident->status === 'Pending') text-warning
                            @elseif($incident->status === 'In Progress') text-info
                            @elseif($incident->status === 'Completed') text-success
                            @elseif($incident->status === 'Cancelled') text-danger
                            @else text-slate-500
                            @endif">
                            @if($incident->status === 'Pending')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            @elseif($incident->status === 'In Progress')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12,6 12,12 16,14"></polyline>
                                </svg>
                            @elseif($incident->status === 'Completed')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                </svg>
                            @elseif($incident->status === 'Cancelled')
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
                            {{ $incident->status ?? 'Unknown' }}
                        </div>
                    </td>
                    <td class="text-center">{{ $incident->datetime_of_incident ? \Carbon\Carbon::parse($incident->datetime_of_incident)->format('M d, Y g:i A') : 'N/A' }}</td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view-incident-modal" data-incident-id="{{ $incident->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View
                            </a>
                            @if($incident->status === 'Pending')
                             <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#edit-incident-modal" data-incident-id="{{ $incident->id }}">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                     <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                 </svg>
                                 Edit
                             </a>
                             @endif
                             @if($incident->status === 'Pending')
                             <a class="flex items-center text-danger" href="javascript:;" data-tw-toggle="modal" data-tw-target="#delete-confirmation-modal" data-incident-id="{{ $incident->id }}">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                     <polyline points="3 6 5 6 21 6"></polyline>
                                     <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                     <line x1="10" y1="11" x2="10" y2="17"></line>
                                     <line x1="14" y1="11" x2="14" y2="17"></line>
                                 </svg>
                                 Delete
                             </a>
                             @endif
                        </div>
                    </td>
                </tr>
                @empty
                <tr class="intro-x">
                    <td colspan="6" class="text-center py-8">
                        <div class="text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                            </svg>
                            <div class="font-medium">No incident reports found</div>
                            <div class="text-sm">Start by creating your first incident report</div>
                        </div>
                    </td>
                </tr>
                @endforelse
                <!-- No Results Found Message (shown when search returns no results) -->
                <!-- @if(request()->has('search') && $userIncidents->count() === 0 && $userIncidents->total() === 0)
                <tr id="noResultsRow">
                    <td colspan="6" class="text-center py-8">
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
                @endif -->
            </tbody>
        </table>
    </div>
    <!-- END: Data List -->

    <!-- BEGIN: Pagination -->
    <x-pagination :current-page="$userIncidents->currentPage()" :total-pages="$userIncidents->lastPage()" :per-page="$userIncidents->perPage()" :show-per-page-selector="true" :show-first-last="true" />
    <!-- END: Pagination -->
</div>
<!-- BEGIN: Report Incident Modal -->
<div id="report-incident-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            
            <div class="modal-body px-5 py-10">
                <form id="report-incident-form" method="POST" action="{{ route('incident.store') }}">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    
                    <div class="grid grid-cols-12 gap-4 gap-y-3">
                        <div class="col-span-12 sm:col-span-6">
                            <label for="person_involved_name" class="form-label">Person Involved Name *</label>
                            <input id="person_involved_name" name="person_involved_name" type="text" class="form-control" placeholder="Enter person's name" required>
                        </div>
                        <div class="col-span-12 sm:col-span-6">
                            <label for="designation" class="form-label">Designation *</label>
                            <select id="designation" name="designation" class="form-select" required>
                                <option value="">Select Designation</option>
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
                        <div class="col-span-12 sm:col-span-6">
                            <label for="street" class="form-label">Street *</label>
                            <select id="street" name="street" class="form-select" required>
                                <option value="">Select Street</option>
                                <option value="Neptune Street, Golden Country Homes, Alangilan, Batangas City">Neptune Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Mercury Street, Golden Country Homes, Alangilan, Batangas City">Mercury Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Saturn Street, Golden Country Homes, Alangilan, Batangas City">Saturn Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Venus Street, Golden Country Homes, Alangilan, Batangas City">Venus Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Earth Street, Golden Country Homes, Alangilan, Batangas City">Earth Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Mars Street, Golden Country Homes, Alangilan, Batangas City">Mars Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Jupiter Street, Golden Country Homes, Alangilan, Batangas City">Jupiter Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Galaxy Street, Golden Country Homes, Alangilan, Batangas City">Galaxy Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Comet Street, Golden Country Homes, Alangilan, Batangas City">Comet Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Pluto Street, Golden Country Homes, Alangilan, Batangas City">Pluto Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Uranus Street, Golden Country Homes, Alangilan, Batangas City">Uranus Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Star Street, Golden Country Homes, Alangilan, Batangas City">Star Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Universe 1 Street, Golden Country Homes, Alangilan, Batangas City">Universe 1 Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Universe 2 Street, Golden Country Homes, Alangilan, Batangas City">Universe 2 Street, Golden Country Homes, Alangilan, Batangas City</option>
                            </select>
                        </div>
                        <div class="col-span-12 sm:col-span-6">
                            <label for="address" class="form-label">House/Block/Lot No. *</label>
                            <input id="address" name="address" type="text" class="form-control" placeholder="Enter house/block/lot number" required>
                        </div>
                        <div class="col-span-12 sm:col-span-6">
                            <label for="datetime_of_incident" class="form-label">Date & Time of Incident *</label>
                            <input id="datetime_of_incident" name="datetime_of_incident" type="datetime-local" class="form-control" required>
                        </div>
                        <div class="col-span-12 sm:col-span-6">
                            <label for="guard_id" class="form-label">Assigned Guard</label>
                            <select id="guard_id" name="guard_id" class="form-select">
                                <option value="">Select Guard (Optional)</option>
                                @foreach($guards as $guard)
                                    <option value="{{ $guard->id }}">{{ $guard->name }} - {{ $guard->contact_number }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-span-12">
                            <label for="location_of_incident" class="form-label">Description of Incident *</label>
                            <textarea id="location_of_incident" name="location_of_incident" class="form-control" rows="3" placeholder="Describe the exact location where the incident occurred" required></textarea>
                        </div>
                    </div>
                    
                    <div class="flex justify-end gap-2 mt-6">
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                        <button type="submit" class="btn btn-primary w-24">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                <path d="M22 2L11 13"></path>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- END: Report Incident Modal -->

<!-- BEGIN: View Incident Modal -->
<div id="view-incident-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-body px-5 py-10">
                <div id="incident-details">
                    <!-- Incident details will be loaded here -->
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
<!-- END: View Incident Modal -->

<!-- BEGIN: Edit Incident Modal -->
<div id="edit-incident-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Edit Incident Report</h2>
                <button type="button" data-tw-dismiss="modal" class="btn-close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body px-5 py-10">
                <form id="edit-incident-form" method="POST">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" id="edit-incident-id">
                    
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label">Person Involved Name *</label>
                            <input type="text" name="person_involved_name" id="edit_person_involved_name" class="form-control" required>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label">Designation *</label>
                            <select name="designation" id="edit_designation" class="form-select" required>
                                <option value="">Select Designation</option>
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
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label">Street *</label>
                            <select name="street" id="edit_street" class="form-select" required>
                                <option value="">Select Street</option>
                                <option value="Neptune Street, Golden Country Homes, Alangilan, Batangas City">Neptune Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Mercury Street, Golden Country Homes, Alangilan, Batangas City">Mercury Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Saturn Street, Golden Country Homes, Alangilan, Batangas City">Saturn Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Venus Street, Golden Country Homes, Alangilan, Batangas City">Venus Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Earth Street, Golden Country Homes, Alangilan, Batangas City">Earth Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Mars Street, Golden Country Homes, Alangilan, Batangas City">Mars Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Jupiter Street, Golden Country Homes, Alangilan, Batangas City">Jupiter Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Galaxy Street, Golden Country Homes, Alangilan, Batangas City">Galaxy Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Comet Street, Golden Country Homes, Alangilan, Batangas City">Comet Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Pluto Street, Golden Country Homes, Alangilan, Batangas City">Pluto Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Uranus Street, Golden Country Homes, Alangilan, Batangas City">Uranus Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Star Street, Golden Country Homes, Alangilan, Batangas City">Star Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Universe 1 Street, Golden Country Homes, Alangilan, Batangas City">Universe 1 Street, Golden Country Homes, Alangilan, Batangas City</option>
                                <option value="Universe 2 Street, Golden Country Homes, Alangilan, Batangas City">Universe 2 Street, Golden Country Homes, Alangilan, Batangas City</option>
                            </select>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label">House/Block/Lot No. *</label>
                            <input type="text" name="address" id="edit_address" class="form-control" required>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label">Date & Time of Incident *</label>
                            <input type="datetime-local" name="datetime_of_incident" id="edit_datetime_of_incident" class="form-control" required>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label">Assigned Guard</label>
                            <select name="guard_id" id="edit_guard_id" class="form-select">
                                <option value="">Select Guard (Optional)</option>
                                @foreach($guards as $guard)
                                    <option value="{{ $guard->id }}">{{ $guard->name }} - {{ $guard->contact_number }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-span-12">
                            <label class="form-label">Description of Incident *</label>
                            <textarea name="location_of_incident" id="edit_location_of_incident" class="form-control" rows="3" required></textarea>
                        </div>
                    </div>
                    
                    <div class="flex justify-end gap-2 mt-6">
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                        <button type="submit" class="btn btn-primary w-24">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- END: Edit Incident Modal -->

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
                    <div class="text-slate-500 mt-2">Do you really want to delete this incident report? This process cannot be undone.</div>
                </div>
                <div class="px-5 pb-8 text-center">
                    <input type="hidden" id="delete-incident-id">
                    <div class="flex justify-center gap-2">
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                <path d="m6 9 6 6 6-6"/>
                            </svg>
                            Cancel
                        </button>
                        <button type="button" class="btn btn-danger w-24 mb-2" id="confirm-delete-incident">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Delete Confirmation Modal -->

@endsection

@push('scripts')
    <script src="{{ asset('js/incident/incident.js') }}"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            @if(session('success'))
                if (typeof window.showNotification_incident_toast_success === 'function') {
                    // Update success text dynamically then show
                    const content = document.getElementById('incident_toast_success-content');
                    if (content) {
                        const messageEl = content.querySelector('.text-slate-500');
                        if (messageEl) { messageEl.textContent = @json(session('success')); }
                    }
                    window.showNotification_incident_toast_success();
                }
            @endif
            @if(session('error'))
                if (typeof window.showNotification_incident_toast_error === 'function') {
                    const slot = document.getElementById('incident-error-message-slot');
                    if (slot) { slot.textContent = @json(session('error')); }
                    window.showNotification_incident_toast_error();
                }
            @endif
        });
    </script>
@endpush
