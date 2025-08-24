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
    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <button class="btn btn-primary shadow-md mr-2" data-tw-toggle="modal" data-tw-target="#create-vehicle-modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Add Vehicle
        </button>
        
        <!-- <a href="{{ route('vehicle.trash') }}" class="btn btn-outline-warning shadow-md mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            View Trash
        </a> -->
        
        <div class="dropdown ml-2"> 
            <button class="dropdown-toggle btn btn-outline-secondary" aria-expanded="false" data-tw-toggle="dropdown">Filter by Status</button> 
            <div class="dropdown-menu w-40"> 
                <ul class="dropdown-content"> 
                    <li> <a href="javascript:;" class="dropdown-item" data-filter="all">All Vehicles</a> </li> 
                    @foreach($statuses as $status)
                        <li> <a href="javascript:;" class="dropdown-item" data-filter="{{ $status }}">{{ $status }}</a> </li> 
                    @endforeach
                </ul> 
            </div> 
        </div>
        
        <div class="hidden md:block mx-auto text-slate-500">
            Showing <span id="filtered-count">{{ $vehicles->count() }}</span> of <span id="total-count">{{ $vehicles->total() }}</span> entries
        </div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div class="w-56 relative text-slate-500">
                <input type="text" class="form-control w-56 box pr-10" placeholder="Search vehicles..." id="searchInput">
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
                            <div class="text-xs">
                                <div>OR: {{ $vehicle->supportingDocuments->vehicleDetails->or_no }}</div>
                                <div>CR: {{ $vehicle->supportingDocuments->vehicleDetails->cr_no }}</div>
                            </div>
                        @else
                            <span class="text-slate-400">No documents</span>
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
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
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
                        <label class="form-label text-base font-semibold text-slate-700">Vehicle Type</label>
                        <input type="text" name="type_of_vehicle" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., Sedan, SUV, Motorcycle" required>
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
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Supporting Documents</label>
                        <input type="file" name="supporting_documents_attachments" id="createSupportingDocuments" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">
                        <div class="text-xs text-slate-500 mt-1">Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max: 10MB)</div>
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
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
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
                        <label class="form-label text-base font-semibold text-slate-700">Vehicle Type</label>
                        <input type="text" name="type_of_vehicle" id="editTypeOfVehicle" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                    </div>
                    
                    <div class="grid grid-cols-12 gap-4 mb-6">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">Plate Number</label>
                            <input type="text" name="plate_number" id="editPlateNumber" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">Vehicle Model</label>
                            <input type="text" name="vehicle_model" id="editVehicleModel" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-12 gap-4 mb-6">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">OR Number</label>
                            <input type="text" name="or_no" id="editOrNo" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">CR Number</label>
                            <input type="text" name="cr_no" id="editCrNo" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Color</label>
                        <input type="text" name="color_of_vehicle" id="editColorOfVehicle" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" required>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Supporting Documents</label>
                        <input type="file" name="supporting_documents_attachments" id="editSupportingDocumentsAttachments" class="form-control mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">
                        <div class="text-xs text-slate-500 mt-1">Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max: 10MB)</div>
                        <div id="currentFileInfo" class="text-xs text-blue-600 mt-1" style="display: none;"></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2 mr-2">Cancel</button>
                    <button type="submit" form="editVehicleForm" class="btn btn-primary px-6 py-2 flex items-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
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

@endsection

@push('scripts')
    <script src="{{ asset('js/vehicle/vehicle.js') }}"></script>
@endpush