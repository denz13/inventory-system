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
            <button class="btn btn-primary shadow-md mr-2" data-tw-toggle="modal" data-tw-target="#add-vehicle-modal">Add New Vehicle</button>

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
                                        <div class="col-span-12">
                                            <label class="form-label">Owner Type</label>
                                            <div class="flex flex-wrap gap-6 mt-2">
                                                <label class="flex items-center gap-2"><input type="radio" name="add_owner_type" value="homeowner" class="form-check-input" checked> <span>Homeowner</span></label>
                                                <label class="flex items-center gap-2"><input type="radio" name="add_owner_type" value="non_homeowner" class="form-check-input"> <span>Non Homeowner</span></label>
                                            </div>
                                        </div>
                                        <div id="add_homeowner_wrap" class="col-span-12 md:col-span-6">
                                            <label class="form-label">Owner</label>
                                            <select name="user_id" id="add_user_id" class="form-select">
                                                <option value="">Select owner</option>
                                                @foreach($owners as $owner)
                                                    <option value="{{ $owner->id }}">{{ $owner->name }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div id="add_non_homeowner_wrap" class="col-span-12 grid grid-cols-12 gap-4 hidden">
                                            <input type="hidden" id="add_non_homeowners" name="non_homeowners">
                                            <div class="col-span-12 md:col-span-4">
                                                <label class="form-label">Surname</label>
                                                <input type="text" id="add_nh_surname" class="form-control" placeholder="Surname">
                                            </div>
                                            <div class="col-span-12 md:col-span-4">
                                                <label class="form-label">First Name</label>
                                                <input type="text" id="add_nh_firstname" class="form-control" placeholder="First Name">
                                            </div>
                                            <div class="col-span-12 md:col-span-4">
                                                <label class="form-label">Middle Name</label>
                                                <input type="text" id="add_nh_middlename" class="form-control" placeholder="Middle Name (optional)">
                                            </div>
                                        </div>
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">In case of emergency name</label>
                                            <input type="text" name="incase_of_emergency_name" class="form-control">
                                        </div>
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">In case of emergency number</label>
                                            <input type="text" name="incase_of_emergency_number" class="form-control">
                                        </div>
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Status</label>
                                            <select name="status" class="form-select" required>
                                                <option value="active">active</option>
                                                <option value="inactive">inactive</option>
                                            </select>
                                        </div>

                                        <div class="col-span-12">
                                            <label class="form-label mb-3">Vehicle Details</label>
                                            <div id="vehicleDetailsRepeater" class="space-y-5">
                                                <div class="vehicle-detail-group grid grid-cols-12 gap-4">
                                                    <div class="col-span-12 md:col-span-6">
                                                        <label class="form-label">Plate Number</label>
                                                        <input type="text" name="plate_number[]" class="form-control">
                                                    </div>
                                                    <div class="col-span-12 md:col-span-6">
                                                        <label class="form-label">OR Number</label>
                                                        <input type="text" name="or_number[]" class="form-control">
                                                    </div>
                                                    <div class="col-span-12 md:col-span-6">
                                                        <label class="form-label">CR Number</label>
                                                        <input type="text" name="cr_number[]" class="form-control">
                                                    </div>
                                                    <div class="col-span-12 md:col-span-6">
                                                        <label class="form-label">Vehicle Model</label>
                                                        <input type="text" name="vehicle_model[]" class="form-control">
                                                    </div>
                                                    <div class="col-span-12 md:col-span-6">
                                                        <label class="form-label">Color</label>
                                                        <input type="text" name="color[]" class="form-control">
                                                    </div>
                                                    <div class="col-span-12 md:col-span-6">
                                                        <label class="form-label">Sticker Control Number</label>
                                                        <input type="text" name="sticker_control_number[]" class="form-control">
                                                    </div>
                                                    <div class="col-span-12 flex justify-end">
                                                        <button type="button" class="btn btn-outline-danger w-24 remove-detail hidden">Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="mt-3">
                                                <button type="button" id="addDetailRow" class="btn btn-outline-primary w-36">Add More Vehicle</button>
                                            </div>
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
                    <input type="text" class="form-control w-56 box pr-10" placeholder="Search...">
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
            <table class="table table-report -mt-2" id="vehicleTable">
                <thead>
                    <tr>
                        <th class="whitespace-nowrap">TYPE</th>
                        <th class="whitespace-nowrap">OWNER</th>
                        <th class="whitespace-nowrap">EMERGENCY NAME</th>
                        <th class="whitespace-nowrap">EMERGENCY NUMBER</th>
                        <th class="whitespace-nowrap">PLATE NO.</th>
                        <th class="whitespace-nowrap">OR NO.</th>
                        <th class="whitespace-nowrap">CR NO.</th>
                        <th class="whitespace-nowrap">MODEL</th>
                        <th class="whitespace-nowrap">COLOR</th>
                        <th class="whitespace-nowrap">STICKER CTRL #</th>
                        <th class="text-center whitespace-nowrap">STATUS</th>
                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($vehicles as $veh)
                        <tr class="intro-x">
                            <td class="whitespace-nowrap">{{ $veh->type_of_vehicle }}</td>
                            <td class="whitespace-nowrap">{{ optional($veh->user)->name ?: $veh->non_homeowners }}</td>
                            <td class="whitespace-nowrap">{{ $veh->incase_of_emergency_name ?: '-' }}</td>
                            <td class="whitespace-nowrap">{{ $veh->incase_of_emergency_number ?: '-' }}</td>
                            @php $d = optional(\App\Models\vehicle_details::where('vehicle_management_id',$veh->id)->first()); @endphp
                            <td class="whitespace-nowrap">{{ $d->plate_number ?: '-' }}</td>
                            <td class="whitespace-nowrap">{{ $d->or_number ?: '-' }}</td>
                            <td class="whitespace-nowrap">{{ $d->cr_number ?: '-' }}</td>
                            <td class="whitespace-nowrap">{{ $d->vehicle_model ?: '-' }}</td>
                            <td class="whitespace-nowrap">{{ $d->color ?: '-' }}</td>
                            <td class="whitespace-nowrap">{{ $d->sticker_control_number ?: '-' }}</td>
                            <td class="w-40">
                                @php $isActive = ($veh->status === 'active'); @endphp
                                <div
                                    class="flex items-center justify-center {{ $isActive ? 'text-success' : 'text-danger' }}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" icon-name="check-square"
                                        data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-2">
                                        <polyline points="9 11 12 14 22 4"></polyline>
                                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                    </svg>
                                    {{ $isActive ? 'Active' : 'Inactive' }}
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
                                    <a class="flex items-center text-danger" href="javascript:;" data-action="delete" data-id="{{ $veh->id }}" data-tw-toggle="modal" data-tw-target="#delete-vehicle-modal">
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
                    @endforeach
                </tbody>
            </table>
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
                                        <label class="form-label">Owner</label>
                                        <div class="mb-2">
                                            <div class="flex flex-wrap gap-6 mt-2">
                                                <label class="flex items-center gap-2"><input type="radio" name="edit_owner_type" value="homeowner" class="form-check-input" checked> <span>Homeowner</span></label>
                                                <label class="flex items-center gap-2"><input type="radio" name="edit_owner_type" value="non_homeowner" class="form-check-input"> <span>Non Homeowner</span></label>
                                            </div>
                                        </div>
                                        <div id="edit_homeowner_wrap">
                                        <select id="edit_user_id" name="user_id" class="form-select">
                                            <option value="">Select owner</option>
                                            @foreach($owners as $owner)
                                                <option value="{{ $owner->id }}">{{ $owner->name }}</option>
                                            @endforeach
                                        </select>
                                        </div>
                                        <div id="edit_non_homeowner_wrap" class="grid grid-cols-12 gap-4 mt-3 hidden">
                                            <input type="hidden" id="edit_non_homeowners" name="non_homeowners">
                                            <div class="col-span-12 md:col-span-4">
                                                <label class="form-label">Surname</label>
                                                <input type="text" id="edit_nh_surname" class="form-control" placeholder="Surname">
                                            </div>
                                            <div class="col-span-12 md:col-span-4">
                                                <label class="form-label">First Name</label>
                                                <input type="text" id="edit_nh_firstname" class="form-control" placeholder="First Name">
                                            </div>
                                            <div class="col-span-12 md:col-span-4">
                                                <label class="form-label">Middle Name</label>
                                                <input type="text" id="edit_nh_middlename" class="form-control" placeholder="Middle Name (optional)">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Emergency Name</label>
                                        <input type="text" id="edit_incase_of_emergency_name" name="incase_of_emergency_name" class="form-control">
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Emergency Number</label>
                                        <input type="text" id="edit_incase_of_emergency_number" name="incase_of_emergency_number" class="form-control">
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Status</label>
                                        <select id="edit_status" name="status" class="form-select" required>
                                            <option value="active">active</option>
                                            <option value="inactive">inactive</option>
                                        </select>
                                    </div>

                                    <div class="col-span-12">
                                        <label class="form-label mb-3">Vehicle Details</label>
                                        <div id="editVehicleDetailsRepeater" class="space-y-5">
                                            <div class="vehicle-detail-group grid grid-cols-12 gap-4">
                                                <div class="col-span-12 md:col-span-6">
                                                    <label class="form-label">Plate Number</label>
                                                    <input type="text" name="plate_number[]" class="form-control">
                                                </div>
                                                <div class="col-span-12 md:col-span-6">
                                                    <label class="form-label">OR Number</label>
                                                    <input type="text" name="or_number[]" class="form-control">
                                                </div>
                                                <div class="col-span-12 md:col-span-6">
                                                    <label class="form-label">CR Number</label>
                                                    <input type="text" name="cr_number[]" class="form-control">
                                                </div>
                                                <div class="col-span-12 md:col-span-6">
                                                    <label class="form-label">Vehicle Model</label>
                                                    <input type="text" name="vehicle_model[]" class="form-control">
                                                </div>
                                                <div class="col-span-12 md:col-span-6">
                                                    <label class="form-label">Color</label>
                                                    <input type="text" name="color[]" class="form-control">
                                                </div>
                                                <div class="col-span-12 md:col-span-6">
                                                    <label class="form-label">Sticker Control Number</label>
                                                    <input type="text" name="sticker_control_number[]" class="form-control">
                                                </div>
                                                <div class="col-span-12 flex justify-end">
                                                    <button type="button" class="btn btn-outline-danger w-24 remove-detail hidden">Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mt-3">
                                            <button type="button" id="editAddDetailRow" class="btn btn-outline-primary w-36">Add More Vehicle</button>
                                        </div>
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
                                    <div class="text-slate-500 text-xs">Vehicle Owner</div>
                                    <div id="view_owner_name_text" class="font-medium"></div>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <div class="text-slate-500 text-xs">Contact Number</div>
                                    <div id="view_contact_text" class="font-medium"></div>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <div class="text-slate-500 text-xs">Type of Vehicle</div>
                                    <div id="view_type_of_vehicle_text" class="font-medium capitalize"></div>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <div class="text-slate-500 text-xs">Status</div>
                                    <div id="view_status_text" class="font-medium capitalize"></div>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <div class="text-slate-500 text-xs">Emergency Name</div>
                                    <div id="view_emergency_name_text" class="font-medium"></div>
                                </div>
                                <div class="col-span-12 md:col-span-6">
                                    <div class="text-slate-500 text-xs">Emergency Number</div>
                                    <div id="view_emergency_number_text" class="font-medium"></div>
                                </div>

                                <div class="col-span-12 mt-4 w-full max-w-full overflow-auto lg:overflow-visible">
                                    <div class="text-slate-700 font-medium mb-2">Description</div>
                                    <div class="w-full max-w-full">
                                        <table class="table w-full whitespace-nowrap min-w-[720px]">
                                            <thead>
                                                <tr>
                                                    <th>Plate No.</th>
                                                    <th>OR No.</th>
                                                    <th>CR No.</th>
                                                    <th>Vehicle Model</th>
                                                    <th>Color of Car</th>
                                                    <th>Car Sticker Control No.</th>
                                                </tr>
                                            </thead>
                                            <tbody id="viewDetailsTableBody"></tbody>
                                        </table>
                                    </div>
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
    <!-- END: Users Layout -->
    <!-- BEGIN: Pagination -->
        <x-pagination :current-page="$vehicles->currentPage()" :total-pages="$vehicles->lastPage()" :per-page="$vehicles->perPage()" :show-per-page-selector="true" :show-first-last="true" />
    <!-- END: Pagination -->
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/vehiclemanagement/vehiclemanagement.js') }}"></script>
@endpush
