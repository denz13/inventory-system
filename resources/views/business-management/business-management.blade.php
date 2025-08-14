@extends('layout._partials.master')

@section('content')
<div class="grid grid-cols-12 gap-6 mt-5">
        <div class="intro-y col-span-12">
            <div class="intro-y text-lg font-medium mt-20">
                Business Management
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
            <button class="btn btn-primary shadow-md mr-2" data-tw-toggle="modal" data-tw-target="#add-user-modal">Add New Business</button>

            <!-- BEGIN: Add Business Modal -->
            <div id="add-user-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body px-5 py-10">
                            <div class="text-left">
                                <form id="addBusinessForm" method="POST" action="{{ route('businessmanagement.store') }}"
                                    enctype="multipart/form-data">
                                    <input type="hidden" name="_token" value="{{ csrf_token() }}">

                                    <div class="grid grid-cols-12 gap-4">
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Business Name</label>
                                            <input type="text" name="business_name" class="form-control" required>
                                        </div>
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Type of Business</label>
                                            <input type="text" name="type_of_business" class="form-control" required>
                                        </div>
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Owner</label>
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
                                            <label class="form-label">Status</label>
                                            <select name="status" class="form-select" required>
                                                <option value="active">active</option>
                                                <option value="inactive">inactive</option>
                                            </select>
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
            <!-- END: Add Business Modal -->
            <div class="hidden md:block mx-auto text-slate-500">Showing {{ $businesses->firstItem() }} to {{ $businesses->lastItem() }} of {{ $businesses->total() }} entries</div>
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
            <table class="table table-report -mt-2" id="businessTable">
                <thead>
                    <tr>
                        <th class="whitespace-nowrap">BUSINESS NAME</th>
                        <th class="whitespace-nowrap">TYPE</th>
                        <th class="whitespace-nowrap">OWNER</th>
                        <th class="text-center whitespace-nowrap">ADDRESS</th>
                        <th class="text-center whitespace-nowrap">STATUS</th>
                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($businesses as $biz)
                        <tr class="intro-x">
                            <td><a href="javascript:;" class="font-medium whitespace-nowrap">{{ $biz->business_name }}</a></td>
                            <td class="whitespace-nowrap">{{ $biz->type_of_business }}</td>
                            <td class="whitespace-nowrap">{{ optional($biz->user)->name }}</td>
                            <td class="text-center">{{ $biz->address ?: '-' }}</td>
                            <td class="w-40">
                                @php $isActive = ($biz->status === 'active'); @endphp
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
                                    <a class="flex items-center mr-3" href="javascript:;" data-action="edit" data-id="{{ $biz->id }}" data-tw-toggle="modal" data-tw-target="#edit-business-modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" icon-name="check-square"
                                            data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1">
                                            <polyline points="9 11 12 14 22 4"></polyline>
                                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                        </svg>
                                        Edit
                                    </a>
                                    <a class="flex items-center text-danger" href="javascript:;" data-action="delete" data-id="{{ $biz->id }}" data-tw-toggle="modal" data-tw-target="#delete-business-modal">
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
        <div id="edit-business-modal" class="modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body px-5 py-10">
                        <div class="text-left">
                            <form id="editBusinessForm">
                                <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                <input type="hidden" id="editBusinessId" name="id">

                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Business Name</label>
                                        <input type="text" id="edit_business_name" name="business_name" class="form-control" required>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Type of Business</label>
                                        <input type="text" id="edit_type_of_business" name="type_of_business" class="form-control" required>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Owner</label>
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
                                        <label class="form-label">Status</label>
                                        <select id="edit_status" name="status" class="form-select" required>
                                            <option value="active">active</option>
                                            <option value="inactive">inactive</option>
                                        </select>
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
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/business-management/business-management.js') }}"></script>
@endpush
