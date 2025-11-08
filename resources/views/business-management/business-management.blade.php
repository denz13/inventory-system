@extends('layout._partials.master')

@section('content')
<!-- Alert Message -->
<div class="intro-y col-span-12 mt-6 -mb-6">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>Establishment Management: You can now view establishment details, approve pending establishments, and decline establishments with reasons. Use the View button to see complete information, and the Update Status dropdown for pending establishments.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    </div>
</div>
<div class="grid grid-cols-12 gap-6 mt-5">
        <div class="intro-y col-span-12">
            <div class="intro-y text-lg font-medium mt-10">
                Establishment Management
            </div>
        </div>

        <!-- Notifications -->
        <div class="intro-y col-span-12">
            <x-notification-toast id="users_toast_success" type="success" title="Success" message="Business saved successfully"
                :showButton="false" />
            <x-notification-toast id="users_toast_error" type="error" title="Error" :showButton="false">
                <div id="users-error-message-slot" class="text-slate-500 mt-1"></div>
            </x-notification-toast>
            <style>
                .toastify {
                    background: transparent !important;
                    box-shadow: none !important;
                }
            </style>
        </div>

        <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 gap-2">
            <button class="btn btn-primary shadow-md" data-tw-toggle="modal" data-tw-target="#add-user-modal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Add New Business
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
                        <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="all">All Status</a> </li> 
                        @foreach($statuses as $status)
                            <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="{{ $status }}">{{ ucfirst($status) }}</a> </li> 
                        @endforeach
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

            <!-- BEGIN: Add Business Modal -->
            <div id="add-user-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2 class="font-medium text-base mr-auto">Add New Business</h2>
                            <button type="button" class="btn btn-outline-secondary w-8 h-8 mr-1" data-tw-dismiss="modal">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div class="modal-body px-5 py-5">
                            <div class="text-left">
                                <form id="addBusinessForm" method="POST" action="{{ route('businessmanagement.store') }}"
                                    enctype="multipart/form-data">
                                    <input type="hidden" name="_token" value="{{ csrf_token() }}">

                                    <div class="grid grid-cols-12 gap-4">
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Business Name *</label>
                                            <input type="text" name="business_name" class="form-control" required>
                                        </div>
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Type of Business *</label>
                                            <input type="text" name="type_of_business" class="form-control" required>
                                        </div>
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Owner *</label>
                                            <select name="user_id" class="form-select" required>
                                                <option value="">Select owner</option>
                                                @foreach($owners as $owner)
                                                    <option value="{{ $owner->id }}">{{ $owner->name }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Address</label>
                                            <input type="text" name="address" class="form-control">
                                        </div>
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Business Clearance</label>
                                            <input type="file" name="business_clearance" class="form-control" accept=".pdf,.jpg,.jpeg,.png">
                                            <div class="text-xs text-slate-500 mt-1">Upload business clearance document (PDF, JPG, PNG - max 2MB)</div>
                                        </div>
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Status *</label>
                                            <select name="status" class="form-select" required>
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="declined">Declined</option>
                                            </select>
                                        </div>
                                        <div class="col-span-12">
                                            <label class="form-label">Reason (if declined)</label>
                                            <textarea name="reason" class="form-control" rows="3" placeholder="Enter reason for decline (optional)"></textarea>
                                        </div>
                                    </div>

                                    <div class="mt-6 flex justify-end gap-2">
                                        <button type="button" data-tw-dismiss="modal"
                                            class="btn btn-outline-secondary w-24">Cancel</button>
                                        <button type="submit" class="btn btn-primary w-24">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END: Add Business Modal -->
            
            <div class="hidden md:block mx-auto text-slate-500">
                Showing <span id="filtered-count">{{ $businesses->count() }}</span> of <span id="total-count">{{ $businesses->total() }}</span> entries
            </div>
            <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                <div class="w-56 relative text-slate-500">
                    <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." id="searchInput" autocomplete="off">
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
            <table class="table table-report -mt-2" id="businessTable">
                <thead>
                    <tr>
                        <th class="whitespace-nowrap">BUSINESS NAME</th>
                        <th class="whitespace-nowrap">TYPE</th>
                        <th class="whitespace-nowrap">OWNER</th>
                        <th class="text-center whitespace-nowrap">USER ID</th>
                        <th class="text-center whitespace-nowrap">ADDRESS</th>
                        <th class="text-center whitespace-nowrap">CLEARANCE</th>
                        <th class="text-center whitespace-nowrap">STATUS</th>
                        <th class="text-center whitespace-nowrap">REASON</th>
                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($businesses as $biz)
                        <tr class="intro-x" data-status="{{ $biz->status }}" data-date="{{ $biz->created_at ? $biz->created_at->format('Y-m-d H:i:s') : '' }}">
                            <td><a href="javascript:;" class="font-medium whitespace-nowrap">{{ $biz->business_name }}</a></td>
                            <td class="whitespace-nowrap">{{ $biz->type_of_business }}</td>
                            <td class="whitespace-nowrap">{{ optional($biz->user)->name }}</td>
                            <td class="text-center">{{ $biz->user_id }}</td>
                            <td class="text-center">{{ $biz->address ?: '-' }}</td>
                            <td class="text-center">
                                @if($biz->business_clearance)
                                    <a href="{{ asset('storage/' . $biz->business_clearance) }}" 
                                       target="_blank" 
                                       class="text-blue-600 hover:text-blue-800 underline">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 inline mr-1">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14,2 14,8 20,8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <polyline points="10,9 9,9 8,9"></polyline>
                                        </svg>
                                        View
                                    </a>
                                @else
                                    <span class="text-slate-400">No file</span>
                                @endif
                            </td>
                            <td class="w-40">
                                @php 
                                    $statusClass = match($biz->status) {
                                        'approved' => 'text-success',
                                        'declined' => 'text-danger',
                                        'pending' => 'text-warning',
                                        default => 'text-slate-500'
                                    };
                                    $statusText = ucfirst($biz->status);
                                @endphp
                                <div class="flex items-center justify-center {{ $statusClass }}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" icon-name="check-square"
                                        data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-2">
                                        <polyline points="9 11 12 14 22 4"></polyline>
                                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                    </svg>
                                    {{ $statusText }}
                                </div>
                            </td>
                            <td class="text-center">
                                @if($biz->reason)
                                    <span class="text-sm text-slate-600" title="{{ $biz->reason }}">
                                        {{ Str::limit($biz->reason, 30) }}
                                    </span>
                                @else
                                    <span class="text-slate-400">-</span>
                                @endif
                            </td>
                            <td class="table-report__action w-56">
                                <div class="flex justify-center items-center">
                                    <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view-business-modal" data-request-id="{{ $biz->id }}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" icon-name="eye"
                                            data-lucide="eye" class="lucide lucide-eye w-4 h-4 mr-1">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                        View
                                    </a>
                                    <a class="flex items-center mr-3" href="javascript:;" data-action="edit" data-id="{{ $biz->id }}" data-tw-toggle="modal" data-tw-target="#edit-business-modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" icon-name="edit"
                                            data-lucide="edit" class="lucide lucide-edit w-4 h-4 mr-1">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                        Edit
                                    </a>
                                    <div class="dropdown">
                                        <button class="dropdown-toggle btn btn-outline-primary btn-sm" aria-expanded="false" data-tw-toggle="dropdown">
                                            Update Status
                                        </button>
                                        <div class="dropdown-menu w-40">
                                            <ul class="dropdown-content">
                                                <li>
                                                    <a href="javascript:;" class="dropdown-item" data-action="approve" data-request-id="{{ $biz->id }}">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-success">
                                                            <polyline points="9 11 12 14 22 4"></polyline>
                                                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 0 012-2h11"></path>
                                                        </svg>
                                                        Approve
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:;" class="dropdown-item" data-action="decline" data-request-id="{{ $biz->id }}">
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
                                    <a class="flex items-center text-danger ml-2" href="javascript:;" data-action="delete" data-id="{{ $biz->id }}" data-tw-toggle="modal" data-tw-target="#delete-business-modal">
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
                    @empty
                        <tr class="intro-x">
                            <td colspan="9" class="text-center py-8">
                                <div class="text-slate-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                    <div class="font-medium">No businesses found</div>
                                    <div class="text-sm">There are currently no businesses to display</div>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- BEGIN: Delete Modal -->
        <div id="delete-business-modal" class="modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body px-5 py-10">
                        <div class="text-center">
                            <div class="mb-5">Are you sure you want to delete this business?</div>
                            <input type="hidden" id="deleteBusinessId" />
                            <button type="button" id="confirmDeleteBusiness" class="btn btn-danger w-24 mr-2">Delete</button>
                            <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: Delete Modal -->

        <!-- BEGIN: Edit Modal -->
        <div id="edit-business-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="font-medium text-base mr-auto">Edit Business</h2>
                        <button type="button" class="btn btn-outline-secondary w-8 h-8 mr-1" data-tw-dismiss="modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    <div class="modal-body px-5 py-5">
                        <div class="text-left">
                            <form id="editBusinessForm">
                                <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                <input type="hidden" id="editBusinessId" name="id">

                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Business Name *</label>
                                        <input type="text" id="edit_business_name" name="business_name" class="form-control" required>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Type of Business *</label>
                                        <input type="text" id="edit_type_of_business" name="type_of_business" class="form-control" required>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Owner *</label>
                                        <select id="edit_user_id" name="user_id" class="form-select" required>
                                            <option value="">Select owner</option>
                                            @foreach($owners as $owner)
                                                <option value="{{ $owner->id }}">{{ $owner->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Address</label>
                                        <input type="text" id="edit_address" name="address" class="form-control">
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Business Clearance</label>
                                        <input type="file" id="edit_business_clearance" name="business_clearance" class="form-control" accept=".pdf,.jpg,.jpeg,.png">
                                        <div class="text-xs text-slate-500 mt-1">Upload new clearance document (PDF, JPG, PNG - max 2MB)</div>
                                        <div id="editCurrentClearance" class="mt-3" style="display: none;">
                                            <label class="form-label">Current Clearance:</label>
                                            <div class="mt-2">
                                                <a id="editCurrentClearanceLink" href="" target="_blank" class="text-blue-600 hover:text-blue-800 underline">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 inline mr-1">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                        <polyline points="14,2 14,8 20,8"></polyline>
                                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                                        <polyline points="10,9 9,9 8,9"></polyline>
                                                    </svg>
                                                    View Current Clearance
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Status *</label>
                                        <select id="edit_status" name="status" class="form-select" required>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="declined">Declined</option>
                                        </select>
                                    </div>
                                    <div class="col-span-12">
                                        <label class="form-label">Reason (if declined)</label>
                                        <textarea id="edit_reason" name="reason" class="form-control" rows="3" placeholder="Enter reason for decline (optional)"></textarea>
                                    </div>
                                </div>

                                <div class="mt-6 flex justify-end gap-2">
                                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                                    <button type="submit" class="btn btn-primary w-24">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: Edit Modal -->
    <!-- END: Users Layout -->
    <!-- BEGIN: Pagination -->
        <x-pagination :current-page="$businesses->currentPage()" :total-pages="$businesses->lastPage()" :per-page="$businesses->perPage()" :show-per-page-selector="true" :show-first-last="true" />
    <!-- END: Pagination -->

    <!-- BEGIN: View Business Modal -->
    <div id="view-business-modal" class="modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="font-medium text-base mr-auto">Business Details</h2>
                    <button type="button" class="btn btn-outline-secondary w-8 h-8 mr-1" data-tw-dismiss="modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="modal-body px-5 py-10">
                    <div id="business-details">
                        <div class="text-center text-slate-500">
                            <p>Click on a "View" button to see business details</p>
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
    <!-- END: View Business Modal -->

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
                            <h3 class="text-lg font-medium mb-2">Approve Business?</h3>
                            <p class="text-slate-500">Are you sure you want to approve this business?</p>
                        </div>
                        <input type="hidden" id="approveBusinessId">
                        <button type="button" onclick="confirmApproveBusiness()" class="btn btn-success w-24 mr-2">Approve</button>
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Approve Confirmation Modal -->

    <!-- BEGIN: Decline Reason Modal -->
    <div id="decline-reason-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
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
                            <h3 class="text-lg font-medium mb-2">Decline Business</h3>
                            <p class="text-slate-500">Please provide a reason for declining this business</p>
                        </div>
                        <form id="declineReasonForm" class="text-left">
                            <input type="hidden" name="_token" value="{{ csrf_token() }}">
                            <input type="hidden" name="_method" value="PUT">
                            <input type="hidden" id="declineBusinessId" name="business_id">
                            
                            <div class="mb-6">
                                <label class="form-label">Reason for Decline *</label>
                                <textarea name="reason" id="declineReason" class="form-control" rows="4" placeholder="Please provide a reason for declining this business..." required></textarea>
                                <div class="text-slate-500 text-xs mt-1">This reason will be recorded and visible to the user.</div>
                            </div>
                            
                            <div class="text-center">
                                <button type="button" onclick="confirmDeclineBusiness()" class="btn btn-danger w-24 mr-2">Decline</button>
                                <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Decline Reason Modal -->
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/business-management/business-management.js') }}"></script>
@endpush
