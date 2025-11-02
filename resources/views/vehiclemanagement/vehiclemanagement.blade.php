@extends('layout._partials.master')

@section('content')
<div class="grid grid-cols-12 gap-6 mt-5">
        <div class="intro-y col-span-12">
            <div class="intro-y text-lg font-medium mt-20">
                Vehicle Management
            </div>
        </div>

        <!-- Notifications -->
        <div class="intro-y col-span-12">
            <x-notification-toast id="users_toast_success" type="success" title="Success" message="User saved successfully"
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
        <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
            <!-- <button class="btn btn-primary shadow-md mr-2" data-tw-toggle="modal" data-tw-target="#add-vehicle-modal">Add New Vehicle</button> -->

            <!-- BEGIN: Add Vehicle Modal -->
            <div id="add-vehicle-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body px-5 py-10">
                            <div class="text-left">
                                <form id="addVehicleForm" method="POST" action="{{ route('vehiclemanagement.store') }}"
                                    enctype="multipart/form-data">
                                    <input type="hidden" name="_token" value="{{ csrf_token() }}">

                                    <div class="grid grid-cols-12 gap-4">
                                        <div class="col-span-12">
                                            <label class="form-label">Type of Vehicle</label>
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
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Status *</label>
                                            <select name="status" class="form-select" required>
                                                <option value="Pending">Pending</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>

                                    <div class="col-span-12">
                                        <label class="form-label mb-3">Vehicle Details</label>
                                        <div class="grid grid-cols-12 gap-4">
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">Owner of Vehicle *</label>
                                                <input type="text" name="owner" class="form-control" placeholder="Enter owner's name" required>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">Driver Name *</label>
                                                <input type="text" name="driver" class="form-control" placeholder="Enter driver's name" required>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">Plate Number *</label>
                                                <input type="text" name="plate_number" class="form-control" required>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">OR Number *</label>
                                                <input type="text" name="or_no" class="form-control" required>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">CR Number *</label>
                                                <input type="text" name="cr_no" class="form-control" required>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">Vehicle Model *</label>
                                                <input type="text" name="vehicle_model" class="form-control" required>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">Color *</label>
                                                <input type="text" name="color_of_vehicle" class="form-control" required>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">Sticker Control Number</label>
                                                <input type="text" name="vehicle_sticker_control_no" class="form-control" placeholder="Optional">
                                            </div>
                                        </div>
                                    </div>

                                        <div class="col-span-12">
                                            <label class="form-label">Supporting Documents</label>
                                            <input type="file" name="supporting_documents_attachments[]" id="addSupportingDocuments" class="form-control" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple>
                                            <div class="text-xs text-slate-500 mt-1">You can select multiple files. Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max: 10MB per file)</div>
                                            <div id="addFileInfo" class="text-xs text-blue-600 mt-1" style="display: none;"></div>
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
            <!-- END: Add Vehicle Modal -->
            <!-- END: Add Vehicle Modal -->
            <div class="hidden md:block mx-auto text-slate-500">Showing {{ $vehicles->firstItem() }} to {{ $vehicles->lastItem() }} of {{ $vehicles->total() }} entries</div>
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
        <div class="intro-y col-span-12">
            <div class="overflow-x-auto">
                <div class="min-w-full inline-block align-middle">
                    <div class="overflow-hidden">
                        <table class="table table-report -mt-2 min-w-full" id="vehicleTable">
                            <thead>
                                <tr>
                                    <th class="whitespace-nowrap">TYPE</th>
                                    <th class="whitespace-nowrap">OWNER</th>
                                    <th class="whitespace-nowrap">PLATE NO.</th>
                                    <th class="whitespace-nowrap">OR NO.</th>
                                    <th class="whitespace-nowrap">CR NO.</th>
                                    <th class="whitespace-nowrap">MODEL</th>
                                    <th class="whitespace-nowrap">COLOR</th>
                                    <th class="whitespace-nowrap">STICKER CTRL #</th>
                                    <th class="text-center whitespace-nowrap">DOCUMENTS</th>
                                    <th class="text-center whitespace-nowrap">STATUS</th>
                                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                                </tr>
                            </thead>
                <tbody>
                    @forelse ($vehicles as $veh)
                        <tr class="intro-x" data-status="{{ $veh->status }}">
                            <td class="whitespace-nowrap">{{ $veh->type_of_vehicle }}</td>
                            @php 
                                $details = $veh->supportingDocuments?->vehicleDetails;
                            @endphp
                            <td class="whitespace-nowrap">{{ $details->owner ?? '-' }}</td>
                            <td class="whitespace-nowrap">{{ $details->plate_number ?? '-' }}</td>
                            <td class="whitespace-nowrap">{{ $details->or_no ?? '-' }}</td>
                            <td class="whitespace-nowrap">{{ $details->cr_no ?? '-' }}</td>
                            <td class="whitespace-nowrap">{{ $details->vehicle_model ?? '-' }}</td>
                            <td class="whitespace-nowrap">{{ $details->color_of_vehicle ?? '-' }}</td>
                            <td class="whitespace-nowrap">{{ $details->stickerControl->control_number ?? '-' }}</td>
                            <td class="whitespace-nowrap text-center">
                                @if($veh->supportingDocuments && $veh->supportingDocuments->supporting_documents_attachments)
                                    @php
                                        $files = json_decode($veh->supportingDocuments->supporting_documents_attachments, true);
                                        $fileCount = is_array($files) ? count($files) : 1;
                                    @endphp
                                    <span class="text-xs text-blue-600 font-medium">{{ $fileCount }} file(s)</span>
                                @else
                                    <span class="text-slate-400 text-xs">No files</span>
                                @endif
                            </td>
                            <td class="w-40">
                                <div class="flex items-center justify-center 
                                    @if($veh->status === 'Active') text-success
                                    @elseif($veh->status === 'Inactive') text-slate-500
                                    @elseif($veh->status === 'Pending') text-warning
                                    @else text-slate-500
                                    @endif">
                                    @if($veh->status === 'Active')
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                            <polyline points="9 11 12 14 22 4"></polyline>
                                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                        </svg>
                                    @elseif($veh->status === 'Pending')
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
                                    {{ $veh->status }}
                                </div>
                            </td>
                            <td class="table-report__action w-56">
                                <div class="flex justify-center items-center">
                                    <a class="flex items-center mr-3" href="javascript:;" data-action="view" data-id="{{ $veh->id }}" data-tw-toggle="modal" data-tw-target="#view-vehicle-modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" icon-name="eye"
                                            data-lucide="eye" class="lucide lucide-eye w-4 h-4 mr-1">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                        View
                                    </a>
                                    <a class="flex items-center mr-3" href="javascript:;" data-action="edit" data-id="{{ $veh->id }}" data-tw-toggle="modal" data-tw-target="#edit-vehicle-modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" icon-name="check-square"
                                            data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1">
                                            <polyline points="9 11 12 14 22 4"></polyline>
                                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                        </svg>
                                        Edit
                                    </a>
                                    @if($veh->status === 'Pending')
                                    <div class="dropdown">
                                        <button class="dropdown-toggle btn btn-outline-primary btn-sm" aria-expanded="false" data-tw-toggle="dropdown">
                                            Update Status
                                        </button>
                                        <div class="dropdown-menu w-40">
                                            <ul class="dropdown-content">
                                                <li>
                                                    <a href="javascript:;" class="dropdown-item" data-action="approve" data-vehicle-id="{{ $veh->id }}">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-success">
                                                            <polyline points="9 11 12 14 22 4"></polyline>
                                                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                                        </svg>
                                                        Approve
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:;" class="dropdown-item" data-action="decline" data-vehicle-id="{{ $veh->id }}">
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
                                    <a class="flex items-center text-danger ml-3" href="javascript:;" data-action="delete" data-id="{{ $veh->id }}" data-tw-toggle="modal" data-tw-target="#delete-vehicle-modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2"
                                            data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1">
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
                            <td colspan="11" class="text-center py-8">
                                <div class="text-slate-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"></path>
                                    </svg>
                                    <div class="font-medium">
                                        @if(request()->has('search'))
                                            No results found
                                        @else
                                            No vehicles found
                                        @endif
                                    </div>
                                    <div class="text-sm">
                                        @if(request()->has('search'))
                                            Try adjusting your search criteria
                                        @else
                                            Start by adding your first vehicle
                                        @endif
                                    </div>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
                    </div>
                </div>
            </div>
            <style>
                /* Custom scrollbar styling */
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
                
                /* Fix for long filenames in modals */
                .modal-body a {
                    word-break: break-all;
                    overflow-wrap: break-word;
                    white-space: normal;
                    display: inline-block;
                    max-width: 100%;
                }
                
                .modal-body .text-xs {
                    word-break: break-word;
                    overflow-wrap: break-word;
                }
            </style>
        </div>

        <!-- BEGIN: Delete Modal -->
        <div id="delete-vehicle-modal" class="modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body px-5 py-10">
                        <div class="text-center">
                            <div class="mb-5">Are you sure you want to delete this vehicle?</div>
                            <input type="hidden" id="deleteVehicleId" />
                            <button type="button" id="confirmDeleteVehicle" class="btn btn-danger w-24 mr-2">Delete</button>
                            <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                </div>
            </div>
            </div>
        </div>
    </div>
        <!-- END: Delete Modal -->

        <!-- BEGIN: Edit Modal -->
        <div id="edit-vehicle-modal" class="modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body px-5 py-10">
                        <div class="text-left">
                            <form id="editVehicleForm">
                                <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                <input type="hidden" id="editVehicleId" name="id">

                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-12">
                                        <label class="form-label">Type of Vehicle</label>
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
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Status *</label>
                                        <select id="edit_status" name="status" class="form-select" required>
                                            <option value="Pending">Pending</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div class="col-span-12">
                                        <label class="form-label mb-3">Vehicle Details</label>
                                        <div class="grid grid-cols-12 gap-4">
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">Owner of Vehicle *</label>
                                                <input type="text" name="owner" id="edit_owner" class="form-control" placeholder="Enter owner's name" required>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">Driver Name *</label>
                                                <input type="text" name="driver" id="edit_driver" class="form-control" placeholder="Enter driver's name" required>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">Plate Number *</label>
                                                <input type="text" name="plate_number" id="edit_plate_number" class="form-control" required>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">OR Number *</label>
                                                <input type="text" name="or_no" id="edit_or_no" class="form-control" required>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">CR Number *</label>
                                                <input type="text" name="cr_no" id="edit_cr_no" class="form-control" required>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">Vehicle Model *</label>
                                                <input type="text" name="vehicle_model" id="edit_vehicle_model" class="form-control" required>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">Color *</label>
                                                <input type="text" name="color_of_vehicle" id="edit_color_of_vehicle" class="form-control" required>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="form-label">Sticker Control Number</label>
                                                <input type="text" name="vehicle_sticker_control_no" id="edit_vehicle_sticker_control_no" class="form-control" placeholder="Optional">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-span-12">
                                        <label class="form-label">Supporting Documents</label>
                                        <input type="file" name="supporting_documents_attachments[]" id="editSupportingDocuments" class="form-control" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple>
                                        <div class="text-xs text-slate-500 mt-1">You can select multiple files. Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max: 10MB per file)</div>
                                        <div id="editFileInfo" class="text-xs text-blue-600 mt-1" style="display: none;"></div>
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

        <!-- BEGIN: View Modal -->
        <div id="view-vehicle-modal" class="modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-body px-5 py-10">
                        <div class="text-left">
                            <div class="text-center text-lg font-semibold mb-6">Vehicle Information Sheet</div>

                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">Vehicle Type</label>
                                    <input type="text" id="view_type_of_vehicle_text" class="form-control capitalize" readonly>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">Owner of Vehicle</label>
                                    <input type="text" id="view_owner" class="form-control" readonly>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">Driver Name</label>
                                    <input type="text" id="view_driver" class="form-control" readonly>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">Plate Number</label>
                                    <input type="text" id="view_plate_number" class="form-control" readonly>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">Vehicle Model</label>
                                    <input type="text" id="view_vehicle_model" class="form-control" readonly>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">OR Number</label>
                                    <input type="text" id="view_or_no" class="form-control" readonly>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">CR Number</label>
                                    <input type="text" id="view_cr_no" class="form-control" readonly>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">Color</label>
                                    <input type="text" id="view_color_of_vehicle" class="form-control" readonly>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">Sticker Control Number</label>
                                    <input type="text" id="view_vehicle_sticker_control_no" class="form-control" readonly>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <label class="form-label">Status</label>
                                    <input type="text" id="view_status_text" class="form-control capitalize" readonly>
                                </div>
                                <div class="col-span-12">
                                    <label class="form-label">Supporting Documents</label>
                                    <div id="view_supporting_documents" class="form-control bg-slate-50"></div>
                                </div>
                            </div>

                            <div class="mt-6 flex justify-end">
                                <button type="button" data-tw-dismiss="modal" class="btn btn-primary w-24">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: View Modal -->

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
                                <h3 class="text-lg font-medium mb-2">Approve Vehicle?</h3>
                                <p class="text-slate-500">Are you sure you want to approve this vehicle registration?</p>
                            </div>
                            <input type="hidden" id="approveVehicleId">
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
                            <input type="hidden" id="declineVehicleId" name="vehicle_id">
                            
                            <div class="mb-6">
                                <label class="form-label">Reason for Decline</label>
                                <textarea name="reason" id="declineReason" class="form-control" rows="4" placeholder="Please provide a reason for declining this vehicle registration..." required></textarea>
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

        <!-- BEGIN: Set Validity Date Modal -->
        <div id="valid-until-modal" class="modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body px-5 py-10">
                        <form id="validUntilForm">
                            <input type="hidden" name="_token" value="{{ csrf_token() }}">
                            <input type="hidden" id="validUntilStickerId" name="sticker_id">
                            
                            <div class="text-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 text-success">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                </svg>
                                <h3 class="text-lg font-medium mb-2">Vehicle Approved!</h3>
                                <p class="text-slate-500">Control Number: <span id="displayControlNumber" class="font-semibold text-slate-700"></span></p>
                            </div>
                            
                            <div class="mb-6">
                                <label class="form-label">Set Validity Date</label>
                                <input type="date" name="valid_until" id="validUntilDate" class="form-control" required>
                                <div class="text-slate-500 text-xs mt-1">Select the date until which this vehicle registration is valid.</div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer px-5 py-3">
                        <div class="flex justify-end gap-2">
                            <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                            <button type="button" onclick="confirmValidUntil()" class="btn btn-success w-24">Set Date</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: Set Validity Date Modal -->
    <!-- END: Users Layout -->
    <!-- BEGIN: Pagination -->
        <x-pagination :current-page="$vehicles->currentPage()" :total-pages="$vehicles->lastPage()" :per-page="$vehicles->perPage()" :show-per-page-selector="true" :show-first-last="true" />
    <!-- END: Pagination -->
</div>
<!-- BEGIN: Notification Toasts -->
<x-notification-toast 
    id="vehicle_management_toast_success" 
    type="success" 
    title="Success!" 
    :showButton="false" 
>
    <div id="vehicle-management-success-message-slot" class="text-slate-500 mt-1">Action completed successfully</div>
</x-notification-toast>

<x-notification-toast 
    id="vehicle_management_toast_error" 
    type="error" 
    title="Error!" 
    :showButton="false"
>
    <div id="vehicle-management-error-message-slot" class="text-slate-500 mt-1">An error occurred</div>
</x-notification-toast>
<!-- END: Notification Toasts -->

@endsection

@push('scripts')
    <!-- Toastify for notifications -->
    <script src="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.css">
    
    <script src="{{ asset('js/vehiclemanagement/vehiclemanagement.js') }}?v={{ time() }}"></script>
@endpush
