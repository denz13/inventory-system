@extends('layout._partials.master')

@section('content')
<div class="col-span-12 mt-6 -mb-6 intro-y">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>Vehicle Management: Register, manage and track vehicles for homeowners. Monitor vehicle details, documents, and status.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> 
        </button>
    </div>
</div>

<h2 class="intro-y text-lg font-medium mt-10">
    Vehicle Management
</h2>

<!-- Notifications -->
<div class="intro-y col-span-12">
    <x-notification-toast id="vehicle_toast_success" type="success" title="Success" message="Vehicle saved successfully"
        :showButton="false" />
    <x-notification-toast id="vehicle_toast_error" type="error" title="Error" :showButton="false">
        <div id="vehicle-error-message-slot" class="text-slate-500 mt-1"></div>
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
        <button class="btn btn-primary shadow-md" data-tw-toggle="modal" data-tw-target="#create-vehicle-modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Add Vehicle
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
                    <li> <a href="javascript:;" class="dropdown-item" data-filter-type="status" data-filter-value="all">All Vehicles</a> </li> 
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
            Showing <span id="filtered-count">{{ $vehicles->count() }}</span> of <span id="total-count">{{ $vehicles->total() }}</span> entries
        </div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div class="w-56 relative text-slate-500">
                <input type="text" class="form-control w-56 box pr-10" placeholder="Search vehicles..." id="searchInput" autocomplete="off">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg> 
            </div>
        </div>
    </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
        <table class="table table-report -mt-2" id="vehicleTable">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">VEHICLE INFO</th>
                    <th class="whitespace-nowrap">PLATE NUMBER</th>
                    <th class="whitespace-nowrap">OWNER</th>
                    <th class="whitespace-nowrap">DRIVER</th>
                    <th class="whitespace-nowrap">DOCUMENTS</th>
                    <th class="text-center whitespace-nowrap">STATUS</th>
                    <th class="text-center whitespace-nowrap">REGISTERED DATE</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                @forelse($vehicles as $vehicle)
                <tr class="intro-x" data-status="{{ $vehicle->status }}">
                    <td class="w-40">
                        <div class="font-medium">{{ $vehicle->type_of_vehicle }}</div>
                        <div class="text-slate-500 text-xs mt-0.5">
                            @if($vehicle->supportingDocuments && $vehicle->supportingDocuments->vehicleDetails)
                                {{ $vehicle->supportingDocuments->vehicleDetails->vehicle_model }} - {{ $vehicle->supportingDocuments->vehicleDetails->color_of_vehicle }}
                            @else
                                No details available
                            @endif
                        </div>
                    </td>
                    <td class="whitespace-nowrap">
                        @if($vehicle->supportingDocuments && $vehicle->supportingDocuments->vehicleDetails)
                            <span class="font-medium">{{ $vehicle->supportingDocuments->vehicleDetails->plate_number }}</span>
                        @else
                            <span class="text-slate-400">N/A</span>
                        @endif
                    </td>
                    <td class="whitespace-nowrap">
                        @if($vehicle->supportingDocuments && $vehicle->supportingDocuments->vehicleDetails)
                            <span class="font-medium">{{ $vehicle->supportingDocuments->vehicleDetails->owner }}</span>
                        @else
                            <span class="text-slate-400">N/A</span>
                        @endif
                    </td>
                    <td class="whitespace-nowrap">
                        @if($vehicle->supportingDocuments && $vehicle->supportingDocuments->vehicleDetails)
                            <span class="font-medium">{{ $vehicle->supportingDocuments->vehicleDetails->driver }}</span>
                        @else
                            <span class="text-slate-400">N/A</span>
                        @endif
                    </td>
                    <td class="whitespace-nowrap">
                        @if($vehicle->supportingDocuments && $vehicle->supportingDocuments->supporting_documents_attachments)
                            @php
                                $files = json_decode($vehicle->supportingDocuments->supporting_documents_attachments, true);
                                $fileCount = is_array($files) ? count($files) : 1;
                            @endphp
                            <span class="text-xs text-blue-600 font-medium">{{ $fileCount }} file(s)</span>
                        @else
                            <span class="text-slate-400 text-xs">No files</span>
                        @endif
                    </td>
                    <td class="w-40">
                        <div class="flex items-center justify-center 
                            @if($vehicle->status === 'Active') text-success
                            @elseif($vehicle->status === 'Inactive') text-slate-500
                            @elseif($vehicle->status === 'Pending') text-warning
                            @else text-slate-500
                            @endif">
                            @if($vehicle->status === 'Active')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                </svg>
                            @elseif($vehicle->status === 'Pending')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 6v6l4 2"></path>
                                </svg>
                            @else
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                            @endif
                            {{ $vehicle->status }}
                        </div>
                    </td>
                    <td class="text-center">{{ $vehicle->created_at ? $vehicle->created_at->format('M d, Y g:i A') : 'N/A' }}</td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view-vehicle-modal" data-vehicle-id="{{ $vehicle->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View
                            </a>
                            <a class="flex items-center mr-3" href="javascript:;" data-action="edit" data-id="{{ $vehicle->id }}" data-tw-toggle="modal" data-tw-target="#edit-vehicle-modal">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Edit
                            </a>
                            <a class="flex items-center text-danger" href="javascript:;" data-action="delete" data-id="{{ $vehicle->id }}" data-tw-toggle="modal" data-tw-target="#delete-confirmation-modal">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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
                    <td colspan="8" class="text-center py-8">
                        <div class="text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"></path>
                            </svg>
                            <div class="font-medium">No vehicles found</div>
                            <div class="text-sm">Start by adding your first vehicle</div>
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
        :current-page="$vehicles->currentPage()" 
        :total-pages="$vehicles->lastPage()" 
        :per-page="$vehicles->perPage()" 
        :show-per-page-selector="true" 
        :show-first-last="true" 
    />
    <!-- END: Pagination -->
</div>

<!-- BEGIN: Create Vehicle Modal -->
<div id="create-vehicle-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Add New Vehicle</h2>
            </div>
            <div class="modal-body px-6 py-8">
                <form id="createVehicleForm" method="POST" action="{{ route('vehicle.store') }}" enctype="multipart/form-data">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Type of Vehicle</label>
                        <div class="flex flex-wrap gap-6 mt-2">
                            <label class="flex items-center gap-2"><input type="radio" name="add_type_of_vehicle_opt" value="car" class="form-check-input" checked> <span>Car</span></label>
                            <label class="flex items-center gap-2"><input type="radio" name="add_type_of_vehicle_opt" value="motorcycle" class="form-check-input"> <span>Motorcycle</span></label>
                            <label class="flex items-center gap-2"><input type="radio" name="add_type_of_vehicle_opt" value="tricycle" class="form-check-input"> <span>Tricycle</span></label>
                            <label class="flex items-center gap-2"><input type="radio" name="add_type_of_vehicle_opt" value="truck" class="form-check-input"> <span>Truck</span></label>
                            <label class="flex items-center gap-2"><input type="radio" name="add_type_of_vehicle_opt" value="others" class="form-check-input"> <span>Others</span></label>
                        </div>
                        <input type="hidden" id="add_type_of_vehicle" name="type_of_vehicle" value="car">
                        <div id="add_other_type_wrap" class="mt-2 hidden">
                            <input type="text" id="add_other_type" class="form-control" placeholder="Specify other type">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-12 gap-4 mb-6">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">Plate Number</label>
                            <input type="text" name="plate_number" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., ABC-123" required>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">Vehicle Model</label>
                            <input type="text" name="vehicle_model" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., Toyota Camry" required>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-12 gap-4 mb-6">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">OR Number</label>
                            <input type="text" name="or_no" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="Official Receipt Number" required>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">CR Number</label>
                            <input type="text" name="cr_no" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="Certificate of Registration" required>
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Color</label>
                        <input type="text" name="color_of_vehicle" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., Red, Blue, White" required>
                    </div>
                    
                    <div class="grid grid-cols-12 gap-4 mb-6">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">Owner of Vehicle</label>
                            <input type="text" name="owner" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="Enter owner's name" required>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">Driver Name</label>
                            <input type="text" name="driver" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="Enter driver's name" required>
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Supporting Documents</label>
                        <input type="file" name="supporting_documents_attachments[]" id="createSupportingDocuments" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple>
                        <div class="text-xs text-slate-500 mt-1">You can select multiple files. Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max: 10MB per file)</div>
                        <div id="fileInfo" class="text-xs text-blue-600 mt-1" style="display: none;"></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2 mr-2">Cancel</button>
                    <button type="submit" form="createVehicleForm" class="btn btn-primary px-6 py-2 flex items-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                        Add Vehicle
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Create Vehicle Modal -->

<!-- BEGIN: View Vehicle Modal -->
<div id="view-vehicle-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Vehicle Details</h2>
            </div>
            <div class="modal-body px-5 py-10">
                <div id="vehicle-details">
                    <div class="text-center text-slate-500">
                        <p>Click on a "View" button to see vehicle details</p>
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
<!-- END: View Vehicle Modal -->

<!-- BEGIN: Edit Vehicle Modal -->
<div id="edit-vehicle-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Edit Vehicle</h2>
            </div>
            <div class="modal-body px-6 py-8">
                <form id="editVehicleForm" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" id="editVehicleId">
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Type of Vehicle <span class="text-slate-400 text-sm">(Optional - leave as is to keep current)</span></label>
                        <div class="flex flex-wrap gap-6 mt-2">
                            <label class="flex items-center gap-2"><input type="radio" name="edit_type_of_vehicle_opt" value="car" class="form-check-input"> <span>Car</span></label>
                            <label class="flex items-center gap-2"><input type="radio" name="edit_type_of_vehicle_opt" value="motorcycle" class="form-check-input"> <span>Motorcycle</span></label>
                            <label class="flex items-center gap-2"><input type="radio" name="edit_type_of_vehicle_opt" value="tricycle" class="form-check-input"> <span>Tricycle</span></label>
                            <label class="flex items-center gap-2"><input type="radio" name="edit_type_of_vehicle_opt" value="truck" class="form-check-input"> <span>Truck</span></label>
                            <label class="flex items-center gap-2"><input type="radio" name="edit_type_of_vehicle_opt" value="others" class="form-check-input"> <span>Others</span></label>
                        </div>
                        <input type="hidden" id="edit_type_of_vehicle" name="type_of_vehicle">
                        <div id="edit_other_type_wrap" class="mt-2 hidden">
                            <input type="text" id="edit_other_type" class="form-control" placeholder="Specify other type">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-12 gap-4 mb-6">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">Plate Number <span class="text-slate-400 text-sm">(Optional)</span></label>
                            <input type="text" name="plate_number" id="editPlateNumber" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="Leave blank to keep current">
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">Vehicle Model <span class="text-slate-400 text-sm">(Optional)</span></label>
                            <input type="text" name="vehicle_model" id="editVehicleModel" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="Leave blank to keep current">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-12 gap-4 mb-6">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">OR Number <span class="text-slate-400 text-sm">(Optional)</span></label>
                            <input type="text" name="or_no" id="editOrNo" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="Leave blank to keep current">
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">CR Number <span class="text-slate-400 text-sm">(Optional)</span></label>
                            <input type="text" name="cr_no" id="editCrNo" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="Leave blank to keep current">
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Color <span class="text-slate-400 text-sm">(Optional)</span></label>
                        <input type="text" name="color_of_vehicle" id="editColorOfVehicle" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="Leave blank to keep current">
                    </div>
                    
                    <div class="grid grid-cols-12 gap-4 mb-6">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">Owner of Vehicle <span class="text-slate-400 text-sm">(Optional)</span></label>
                            <input type="text" name="owner" id="editOwner" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="Leave blank to keep current">
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">Driver Name <span class="text-slate-400 text-sm">(Optional)</span></label>
                            <input type="text" name="driver" id="editDriver" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="Leave blank to keep current">
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Supporting Documents <span class="text-slate-400 text-sm">(Optional - upload only if you want to replace)</span></label>
                        <input type="file" name="supporting_documents_attachments[]" id="editSupportingDocumentsAttachments" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple>
                        <div class="text-xs text-slate-500 mt-1">Upload new files only if you want to replace the existing documents. Leave empty to keep current files.</div>
                        <div id="currentFileInfo" class="text-xs text-blue-600 mt-1" style="display: none;"></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2 mr-2">Cancel</button>
                    <button type="button" id="updateVehicleBtn" class="btn btn-primary px-6 py-2 flex items-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                        Update Vehicle
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Edit Vehicle Modal -->

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
                    <div class="text-slate-500 mt-2">Do you really want to delete this vehicle? This process cannot be undone.</div>
                </div>
                <div class="px-5 pb-8 text-center">
                    <input type="hidden" id="deleteVehicleId">
                    <div class="flex justify-center gap-2">
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24 mb-2">Cancel</button>
                        <button type="button" class="btn btn-danger w-24 mb-2" id="confirmDeleteVehicle">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Delete Confirmation Modal -->

<!-- BEGIN: Update Confirmation Modal -->
<div id="update-confirmation-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body p-0">
                <div class="p-5 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="alert-triangle" data-lucide="alert-triangle" class="lucide lucide-alert-triangle w-16 h-16 text-warning mx-auto mt-3">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                        <path d="M12 9v4"></path>
                        <path d="M12 17h.01"></path>
                    </svg>
                    <div class="text-3xl mt-5">Update Vehicle?</div>
                    <div class="text-slate-500 mt-2">Updating any data on this vehicle will revert the status into "Pending".</div>
                    <div class="text-slate-500 mt-1">Do you want to continue?</div>
                </div>
                <div class="px-5 pb-8 text-center">
                    <div class="flex justify-center gap-2">
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24 mb-2">Cancel</button>
                        <button type="button" class="btn btn-primary w-24 mb-2" id="confirmUpdateVehicle">Update</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Update Confirmation Modal -->

@endsection

@push('scripts')
    <script src="{{ asset('js/vehicle/vehicle.js') }}"></script>
@endpush