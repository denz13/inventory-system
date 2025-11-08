@extends('layout._partials.master')

@section('content')

<!-- Alert Message -->
<div class="intro-y col-span-12 mt-6 -mb-6">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>Tenant & Landlord Management: Register tenants and landlords with their personal and property information. Upload supporting documents and track registration status.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    </div>
</div>


<div class="grid grid-cols-12 gap-6 mt-5">
        <div class="intro-y col-span-12">
            <div class="intro-y text-lg font-medium mt-10">
            Tenant & Landlord Management
        </div>
        </div>

        <!-- Notifications -->
        <div class="intro-y col-span-12">
            <x-notification-toast id="landlord_toast_success" type="success" title="Success" message="Landlord registered successfully!" :showButton="false" />
            <x-notification-toast id="landlord_toast_error" type="error" title="Error" :showButton="false">
                <div id="landlord-error-message-slot" class="text-slate-500 mt-1"></div>
            </x-notification-toast>
            <style>
                .toastify {
                    background: transparent !important;
                    box-shadow: none !important;
                }
            </style>
        </div>

        <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 gap-2">
        <button class="btn btn-primary shadow-md" data-tw-toggle="modal" data-tw-target="#add-landlord-modal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
            Add New Landlord
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
                        <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="pending">Pending</a> </li> 
                        <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="approved">Approved</a> </li> 
                        <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="declined">Declined</a> </li> 
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

        <!-- BEGIN: Add Landlord Modal -->
        <div id="add-landlord-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h2 class="font-medium text-base mr-auto">Landlord Registration</h2>
                            <button type="button" class="btn btn-outline-secondary w-8 h-8 mr-1" data-tw-dismiss="modal">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div class="modal-body px-5 py-5">
                        <form id="addLandlordForm" method="POST" enctype="multipart/form-data">
                                    <input type="hidden" name="_token" value="{{ csrf_token() }}">

                            <!-- I. Personal Information -->
                            <div class="mb-6">
                                <h3 class="text-lg font-semibold mb-4 text-primary border-b pb-2">I. Personal Information</h3>
                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-12 md:col-span-4">
                                        <label class="form-label">First Name *</label>
                                        <input type="text" name="first_name" class="form-control" placeholder="Juan" required>
                                    </div>
                                    <div class="col-span-12 md:col-span-4">
                                        <label class="form-label">Last Name *</label>
                                        <input type="text" name="last_name" class="form-control" placeholder="Dela Cruz" required>
                                    </div>
                                    <div class="col-span-12 md:col-span-4">
                                        <label class="form-label">Middle Initial</label>
                                        <input type="text" name="middle_initial" class="form-control" placeholder="M." maxlength="10">
                                    </div>

                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Date of Birth *</label>
                                        <input type="date" name="date_of_birth" class="form-control" required>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Years of Residency *</label>
                                        <input type="number" name="years_of_residency" class="form-control" placeholder="5" min="0" required>
                                    </div>

                                    <div class="col-span-12">
                                        <label class="form-label">Address *</label>
                                        <input type="text" name="address" class="form-control" placeholder="123 Main St, City, Province" required>
                                    </div>

                                    <div class="col-span-12 md:col-span-4">
                                        <label class="form-label">Civil Status *</label>
                                        <select name="civil_status" class="form-control" required>
                                            <option value="">Select Status</option>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Widowed">Widowed</option>
                                            <option value="Separated">Separated</option>
                                            <option value="Divorced">Divorced</option>
                                        </select>
                                    </div>
                                    <div class="col-span-12 md:col-span-4">
                                        <label class="form-label">Nationality *</label>
                                        <input type="text" name="nationality" class="form-control" placeholder="Filipino" required>
                                    </div>
                                    <div class="col-span-12 md:col-span-4">
                                        <label class="form-label">Phone Number *</label>
                                        <input type="text" name="phone_number" class="form-control" placeholder="09XX-XXX-XXXX" required>
                                    </div>

                                    <div class="col-span-12">
                                        <label class="form-label">Email *</label>
                                        <input type="email" name="email" class="form-control" placeholder="email@example.com" required>
                                    </div>
                                </div>
                            </div>

                            <!-- II. Property Information -->
                            <div class="mb-6">
                                <h3 class="text-lg font-semibold mb-4 text-primary border-b pb-2">II. Property Information</h3>
                                    <div class="grid grid-cols-12 gap-4">
                                        <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Property Name/Building *</label>
                                        <input type="text" name="property_name" class="form-control" placeholder="e.g., Golden Homes Subdivision" required>
                                        </div>
                                        <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Unit/Lot/House Number *</label>
                                        <input type="text" name="unit_number" class="form-control" placeholder="e.g., Unit 101 or Lot 5" required>
                                        </div>

                                        <div class="col-span-12">
                                        <label class="form-label">Complete Property Address *</label>
                                        <textarea name="property_address" class="form-control" rows="2" placeholder="Full address of the property" required></textarea>
                                    </div>

                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Unit Type *</label>
                                        <select name="unit_type" class="form-control" required>
                                            <option value="">Select Type</option>
                                            <option value="Condo">Condo</option>
                                            <option value="House & Lot">House & Lot</option>
                                            <option value="Apartment">Apartment</option>
                                            <option value="Townhouse">Townhouse</option>
                                            <option value="Commercial">Commercial</option>
                                        </select>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Floor Area (SqM) *</label>
                                        <input type="number" name="floor_area" class="form-control" placeholder="50.00" step="0.01" min="0" required>
                                        </div>

                                        <div class="col-span-12">
                                        <label class="form-label">Unit Condition *</label>
                                        <div class="flex flex-col sm:flex-row gap-3">
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="unit_condition" value="Fully Furnished" id="fully_furnished" required>
                                                <label class="form-check-label" for="fully_furnished">
                                                    Fully Furnished
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="unit_condition" value="Semi-Furnished" id="semi_furnished">
                                                <label class="form-check-label" for="semi_furnished">
                                                    Semi-Furnished
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="unit_condition" value="Unfurnished" id="unfurnished">
                                                <label class="form-check-label" for="unfurnished">
                                                    Unfurnished
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-span-12">
                                        <label class="form-label">Optional Details (if applicable)</label>
                                        <input type="text" name="unit_condition_optional" class="form-control" placeholder="Additional unit condition details">
                                    </div>

                                    <div class="col-span-12">
                                        <label class="form-label">Supporting Documents</label>
                                        <input type="file" name="supporting_documents" id="createSupportingDocs" class="form-control" accept=".pdf,.jpg,.jpeg,.png">
                                        <div class="text-xs text-slate-500 mt-1">Upload supporting documents (PDF, JPG, PNG - max 10MB)</div>
                                        <div id="createFileInfo" class="text-xs text-blue-600 mt-1" style="display: none;"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-6 flex justify-end gap-2">
                                <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                                <button type="submit" class="btn btn-primary w-24">Submit</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: Add Landlord Modal -->
            
            <div class="hidden md:block mx-auto text-slate-500">
            Showing <span id="filtered-count">{{ $landlords ? $landlords->count() : 0 }}</span> of <span id="total-count">{{ $landlords ? $landlords->total() : 0 }}</span> entries
            </div>
            <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                <div class="w-56 relative text-slate-500">
                    <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." id="searchInput" autocomplete="off">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
            </div>
        </div>

        <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
            <div class="overflow-x-auto">
                <table class="table table-report -mt-2" id="landlordTable">
                <thead>
                    <tr>
                    <th class="whitespace-nowrap">LANDLORD NAME</th>
                    <th class="whitespace-nowrap">EMAIL</th>
                    <th class="whitespace-nowrap">PHONE</th>
                    <th class="text-center whitespace-nowrap">PROPERTY</th>
                    <th class="text-center whitespace-nowrap">UNIT NUMBER</th>
                    <th class="text-center whitespace-nowrap">UNIT TYPE</th>
                    <th class="text-center whitespace-nowrap">SUBMITTED BY</th>
                        <th class="text-center whitespace-nowrap">STATUS</th>
                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                @forelse ($landlords as $landlord)
                    <tr class="intro-x" data-status="{{ $landlord->status }}" data-id="{{ $landlord->id }}">
                        <td>
                            <div class="font-medium whitespace-nowrap">{{ $landlord->full_name }}</div>
                            <div class="text-xs text-slate-500">{{ $landlord->nationality }}</div>
                        </td>
                        <td class="whitespace-nowrap">{{ $landlord->email }}</td>
                        <td class="whitespace-nowrap">{{ $landlord->phone_number }}</td>
                        <td class="text-center whitespace-nowrap">{{ $landlord->property_name }}</td>
                        <td class="text-center">{{ $landlord->unit_number }}</td>
                        <td class="text-center">{{ $landlord->unit_type }}</td>
                            <td class="text-center">
                            {{ $landlord->user ? $landlord->user->name : 'N/A' }}
                            </td>
                            <td class="w-40">
                                @php 
                                $statusClass = match($landlord->status) {
                                        'approved' => 'text-success',
                                        'declined' => 'text-danger',
                                        'pending' => 'text-warning',
                                        default => 'text-slate-500'
                                    };
                                $statusText = ucfirst($landlord->status);
                                @endphp
                                <div class="flex items-center justify-center {{ $statusClass }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-4 h-4 mr-2">
                                        <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 0 012-2h11"></path>
                                    </svg>
                                    {{ $statusText }}
                                </div>
                            </td>
                            <td class="table-report__action w-56">
                            <div class="flex justify-center items-center gap-2">
                                <a class="flex items-center text-primary" href="javascript:;" data-action="view" data-id="{{ $landlord->id }}" data-tw-toggle="modal" data-tw-target="#view-landlord-modal">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye w-4 h-4 mr-1">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                        View
                                    </a>
                                    <a class="flex items-center text-info" href="javascript:;" data-action="edit" data-id="{{ $landlord->id }}" data-tw-toggle="modal" data-tw-target="#edit-landlord-modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-edit w-4 h-4 mr-1">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                            Edit
                                        </a>
                                    <a class="flex items-center text-danger" href="javascript:;" data-action="delete" data-id="{{ $landlord->id }}" data-tw-toggle="modal" data-tw-target="#delete-landlord-modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                            Delete
                                        </a>
                                @if($landlord->status === 'pending')
                                <div class="dropdown">
                                    <button class="dropdown-toggle btn btn-outline-primary btn-sm" aria-expanded="false" data-tw-toggle="dropdown">
                                        Manage
                                    </button>
                                    <div class="dropdown-menu w-48">
                                        <ul class="dropdown-content">
                                            <li>
                                                <a href="javascript:;" class="dropdown-item" data-action="approve-landlord" data-landlord-id="{{ $landlord->id }}" data-landlord-name="{{ $landlord->full_name }}">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-success">
                                                        <polyline points="9 11 12 14 22 4"></polyline>
                                                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                                    </svg>
                                                    Approve Application
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:;" class="dropdown-item" data-action="decline-landlord" data-landlord-id="{{ $landlord->id }}" data-landlord-name="{{ $landlord->full_name }}">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-danger">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <line x1="15" y1="9" x2="9" y2="15"></line>
                                                        <line x1="9" y1="9" x2="15" y2="15"></line>
                                                    </svg>
                                                    Decline Application
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
                            <td colspan="9" class="text-center py-8">
                                <div class="text-slate-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <line x1="20" y1="8" x2="20" y2="14"></line>
                                    <line x1="23" y1="11" x2="17" y2="11"></line>
                                    </svg>
                                <div class="font-medium">No landlords found</div>
                                <div class="text-sm">Start by adding your first landlord</div>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
            </div>
        </div>

    <!-- BEGIN: View Landlord Modal -->
    <div id="view-landlord-modal" class="modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="font-medium text-base mr-auto">Landlord Details</h2>
                    <button type="button" class="btn btn-outline-secondary w-8 h-8 mr-1" data-tw-dismiss="modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body p-0">
                    <div id="landlord-details-content">
                        <div class="text-center text-slate-500 py-12">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p class="text-lg">Loading landlord details...</p>
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
    <!-- END: View Landlord Modal -->

    <!-- BEGIN: Edit Landlord Modal -->
    <div id="edit-landlord-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                    <h2 class="font-medium text-base mr-auto">Edit Landlord</h2>
                        <button type="button" class="btn btn-outline-secondary w-8 h-8 mr-1" data-tw-dismiss="modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    <div class="modal-body px-5 py-5">
                    <form id="editLandlordForm" method="POST" enctype="multipart/form-data">
                                <input type="hidden" name="_token" value="{{ csrf_token() }}">
                        <input type="hidden" name="_method" value="PUT">
                        <input type="hidden" id="editLandlordId" name="id">

                        <!-- I. Personal Information -->
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold mb-4 text-primary border-b pb-2">I. Personal Information</h3>
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 md:col-span-4">
                                    <label class="form-label">First Name *</label>
                                    <input type="text" name="first_name" id="edit_first_name" class="form-control" required>
                                </div>
                                <div class="col-span-12 md:col-span-4">
                                    <label class="form-label">Last Name *</label>
                                    <input type="text" name="last_name" id="edit_last_name" class="form-control" required>
                                </div>
                                <div class="col-span-12 md:col-span-4">
                                    <label class="form-label">Middle Initial</label>
                                    <input type="text" name="middle_initial" id="edit_middle_initial" class="form-control" maxlength="10">
                                </div>

                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">Date of Birth *</label>
                                    <input type="date" name="date_of_birth" id="edit_date_of_birth" class="form-control" required>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">Years of Residency *</label>
                                    <input type="number" name="years_of_residency" id="edit_years_of_residency" class="form-control" min="0" required>
                                </div>

                                <div class="col-span-12">
                                    <label class="form-label">Address *</label>
                                    <input type="text" name="address" id="edit_address" class="form-control" required>
                                </div>

                                <div class="col-span-12 md:col-span-4">
                                    <label class="form-label">Civil Status *</label>
                                    <select name="civil_status" id="edit_civil_status" class="form-control" required>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Separated">Separated</option>
                                        <option value="Divorced">Divorced</option>
                                    </select>
                                </div>
                                <div class="col-span-12 md:col-span-4">
                                    <label class="form-label">Nationality *</label>
                                    <input type="text" name="nationality" id="edit_nationality" class="form-control" required>
                                </div>
                                <div class="col-span-12 md:col-span-4">
                                    <label class="form-label">Phone Number *</label>
                                    <input type="text" name="phone_number" id="edit_phone_number" class="form-control" required>
                                </div>

                                <div class="col-span-12">
                                    <label class="form-label">Email *</label>
                                    <input type="email" name="email" id="edit_email" class="form-control" required>
                                </div>
                            </div>
                        </div>

                        <!-- II. Property Information -->
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold mb-4 text-primary border-b pb-2">II. Property Information</h3>
                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">Property Name/Building *</label>
                                    <input type="text" name="property_name" id="edit_property_name" class="form-control" required>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">Unit/Lot/House Number *</label>
                                    <input type="text" name="unit_number" id="edit_unit_number" class="form-control" required>
                                    </div>

                                    <div class="col-span-12">
                                    <label class="form-label">Complete Property Address *</label>
                                    <textarea name="property_address" id="edit_property_address" class="form-control" rows="2" required></textarea>
                                </div>

                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">Unit Type *</label>
                                    <select name="unit_type" id="edit_unit_type" class="form-control" required>
                                        <option value="Condo">Condo</option>
                                        <option value="House & Lot">House & Lot</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Townhouse">Townhouse</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">Floor Area (SqM) *</label>
                                    <input type="number" name="floor_area" id="edit_floor_area" class="form-control" step="0.01" min="0" required>
                                    </div>

                                    <div class="col-span-12">
                                    <label class="form-label">Unit Condition *</label>
                                    <div class="flex flex-col sm:flex-row gap-3">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="unit_condition" value="Fully Furnished" id="edit_fully_furnished" required>
                                            <label class="form-check-label" for="edit_fully_furnished">Fully Furnished</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="unit_condition" value="Semi-Furnished" id="edit_semi_furnished">
                                            <label class="form-check-label" for="edit_semi_furnished">Semi-Furnished</label>
                                            </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="unit_condition" value="Unfurnished" id="edit_unfurnished">
                                            <label class="form-check-label" for="edit_unfurnished">Unfurnished</label>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-span-12">
                                    <label class="form-label">Optional Details</label>
                                    <input type="text" name="unit_condition_optional" id="edit_unit_condition_optional" class="form-control">
                                </div>

                                <div class="col-span-12">
                                    <label class="form-label">Supporting Documents</label>
                                    <input type="file" name="supporting_documents" id="editSupportingDocs" class="form-control" accept=".pdf,.jpg,.jpeg,.png">
                                    <div id="editCurrentDocument" class="mt-2" style="display: none;">
                                        <a id="editCurrentDocumentLink" href="" target="_blank" class="text-blue-600 hover:underline text-sm">View current document</a>
                        </div>
                                    <div id="editFileInfo" class="text-xs text-blue-600 mt-1" style="display: none;"></div>
                </div>
            </div>
        </div>

                        <div class="mt-6 flex justify-end gap-2">
                            <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                            <button type="submit" class="btn btn-primary w-24">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Edit Landlord Modal -->

    <!-- BEGIN: Delete Modal -->
    <div id="delete-landlord-modal" class="modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body px-5 py-10">
                    <div class="text-center">
                        <div class="mb-5">Are you sure you want to delete this landlord?</div>
                        <input type="hidden" id="deleteLandlordId" />
                        <button type="button" id="confirmDeleteLandlord" class="btn btn-danger w-24 mr-2">Delete</button>
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Delete Modal -->

    <!-- BEGIN: Approve Landlord Modal -->
    <div id="approve-landlord-modal" class="modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="text-xl font-semibold text-slate-800">Approve Landlord Application</h2>
                    <button type="button" class="btn-close" data-tw-dismiss="modal" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body px-6 py-6">
                    <div class="text-center mb-6">
                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-green-600">
                                <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                        </div>
                        <h3 class="text-lg font-medium text-slate-900 mb-2">Approve Landlord Application</h3>
                        <p class="text-sm text-slate-500 mb-4">Approve this landlord application and upload business clearance document.</p>
                        <div class="bg-slate-50 rounded-lg p-4 mb-4">
                            <p class="text-sm text-slate-600">
                                <span class="font-medium">Landlord Name:</span> 
                                <span id="approve-landlord-name">-</span>
                            </p>
                        </div>
                    </div>

                    <!-- Business Clearance Upload -->
                    <form id="approveWithClearanceForm" enctype="multipart/form-data">
                        <div class="text-left mb-4">
                            <label for="business-clearance-file" class="form-label text-sm font-medium text-slate-700">
                                Business Clearance Attachment *
                            </label>
                            <input type="file" id="business-clearance-file" name="business_clearance_attachments" class="form-control mt-1" accept=".pdf,.jpg,.jpeg,.png" required>
                            <div class="text-xs text-slate-500 mt-2">
                                Upload business clearance document (PDF, JPG, PNG - max 10MB)
                            </div>
                            <div id="approveFileInfo" class="text-xs text-blue-600 mt-2" style="display: none;"></div>
                        </div>

                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 mr-3 flex-shrink-0">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                <div>
                                    <p class="text-sm font-medium text-blue-800">Important</p>
                                    <p class="text-xs text-blue-700 mt-1">Please upload the business clearance document before approving this application. This document is required for record keeping.</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer px-6 py-4">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2 mr-2">Cancel</button>
                    <button type="button" id="confirm-approve-landlord-btn" class="btn btn-primary px-6 py-2">
                        <span class="approve-btn-text">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 inline mr-1">
                                <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                            Approve & Upload
                        </span>
                        <span class="approve-btn-loading hidden">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Approve Landlord Modal -->

    <!-- BEGIN: Decline Landlord Modal -->
    <div id="decline-landlord-modal" class="modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="text-center py-8">
                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-red-600">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                        <h3 class="text-lg font-medium text-slate-900 mb-2">Decline Landlord Application</h3>
                        <p class="text-sm text-slate-500 mb-6">Are you sure you want to decline this landlord application? This action cannot be undone.</p>
                        <div class="bg-slate-50 rounded-lg p-4 mb-4">
                            <p class="text-sm text-slate-600">
                                <span class="font-medium">Landlord Name:</span> 
                                <span id="decline-landlord-name">-</span>
                            </p>
                        </div>
                        <div class="text-left">
                            <label for="decline-reason" class="form-label text-sm font-medium text-slate-700">Reason for Decline *</label>
                            <textarea id="decline-reason" class="form-control mt-1" rows="3" placeholder="Enter reason for declining this application..." required></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-20 ml-2 mb-2">Cancel</button>
                    <button type="button" id="confirm-decline-landlord-btn" class="btn btn-danger w-24 ml-2 mb-2">
                        <span class="decline-btn-text">Decline</span>
                        <span class="decline-btn-loading hidden">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Decline Landlord Modal -->

    <!-- BEGIN: Pagination -->
    @if($landlords && $landlords->count() > 0)
    <x-pagination 
        :current-page="$landlords->currentPage()" 
        :total-pages="$landlords->lastPage()" 
        :per-page="$landlords->perPage()" 
        :show-per-page-selector="true" 
        :show-first-last="true" 
    />
    @endif
    <!-- END: Pagination -->
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/landlord-management/landlord-management.js') }}?v={{ time() }}"></script>
@endpush
