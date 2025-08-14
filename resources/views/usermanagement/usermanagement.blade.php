@extends('layout._partials.master')

@section('content')
<div class="grid grid-cols-12 gap-6 mt-5">
        <div class="intro-y col-span-12">
            <div class="intro-y text-lg font-medium mt-20">
                User Management
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
            <button class="btn btn-primary shadow-md mr-2" data-tw-toggle="modal" data-tw-target="#add-user-modal">Add New
                User</button>

            <!-- BEGIN: Add User Modal -->
            <div id="add-user-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body px-5 py-10">
                            <div class="text-left">
                                <form id="addUserForm" method="POST" action="{{ route('usermanagement.store') }}"
                                    enctype="multipart/form-data">
                                    <input type="hidden" name="_token" value="{{ csrf_token() }}">

                                    <div class="grid grid-cols-12 gap-4">
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Name</label>
                                            <input type="text" name="name" class="form-control" required>
        </div>
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Email</label>
                                            <input type="email" name="email" class="form-control" required>
    </div>
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Password</label>
                                            <input type="password" name="password" class="form-control" required>
                </div>
                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Contact Number</label>
                                            <input type="text" name="contact_number" class="form-control">
                </div>

                                        <div class="col-span-12 md:col-span-4">
                                            <label class="form-label">Street</label>
                                            <input type="text" name="street" class="form-control">
            </div>
                                        <div class="col-span-12 md:col-span-4">
                                            <label class="form-label">Lot</label>
                                            <input type="text" name="lot" class="form-control">
            </div>
                                        <div class="col-span-12 md:col-span-4">
                                            <label class="form-label">Block</label>
                                            <input type="text" name="block" class="form-control">
        </div>

                                        <div class="col-span-12 md:col-span-3">
                                            <label class="form-label">Membership Fee</label>
                                            <input type="text" name="membership_fee" class="form-control">
    </div>
                                        <div class="col-span-12 md:col-span-3">
                                            <label class="form-label">With Title</label>
                                            <select name="is_with_title" class="form-select">
                                                <option value="0">No</option>
                                                <option value="1">Yes</option>
                                            </select>
                </div>
                                        <div class="col-span-12 md:col-span-3">
                                            <label class="form-label">Gender</label>
                                            <select name="gender" class="form-select">
                                                <option value="">Select</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                </div>
                                        <div class="col-span-12 md:col-span-3">
                                            <label class="form-label">Role</label>
                                            <select name="role" class="form-select">
                                                <option value="">Select</option>
                                                <option value="admin">admin</option>
                                                <option value="home owners">home owners</option>
                                                <option value="non home owners">non home owners</option>
                                                <option value="security personnel">security personnel</option>
                                                <option value="operational manager">operational manager</option>
                                                <option value="service manager">service manager</option>
                                                <option value="financial manager">financial manager</option>
                                                <option value="appointment coordinator">appointment coordinator</option>
                                                <option value="occupancy manager">occupancy manager</option>
                                            </select>
            </div>

                                        <div class="col-span-12 md:col-span-6">
                                            <label class="form-label">Photo</label>
                                            <input type="file" name="photo" class="form-control" accept="image/*">
            </div>
                                        <input type="hidden" name="active" value="1">
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
            <!-- END: Add User Modal -->
            <!-- END: Add User Modal -->
            <div class="hidden md:block mx-auto text-slate-500">Showing {{ $users->firstItem() }} to {{ $users->lastItem() }} of {{ $users->total() }} entries</div>
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
            <table class="table table-report -mt-2" id="usersTable">
                <thead>
                    <tr>
                        <th class="whitespace-nowrap">IMAGES</th>
                        <th class="whitespace-nowrap">NAME</th>
                        <th class="whitespace-nowrap">EMAIL</th>
                        <th class="text-center whitespace-nowrap">CONTACT</th>
                        <th class="text-center whitespace-nowrap">STATUS</th>
                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($users as $user)
                        <tr class="intro-x">
                            <td class="w-40">
                                <div class="flex">
                                    <div class="w-10 h-10 image-fit zoom-in">
                                        <img alt="Photo" class="tooltip rounded-full" src="{{ $user->photo_url }}">
                </div>
            </div>
                            </td>
                            <td>
                                <a href="javascript:;" class="font-medium whitespace-nowrap">{{ $user->name }}</a>
                                <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">{{ $user->role ?: 'User' }}
            </div>
                            </td>
                            <td class="whitespace-nowrap">{{ $user->email }}</td>
                            <td class="text-center">{{ $user->contact_number ?: '-' }}</td>
                            <td class="w-40">
                                @php $isActive = (int) $user->active === 1; @endphp
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
                                    <a class="flex items-center mr-3" href="javascript:;" data-action="edit" data-id="{{ $user->id }}" data-tw-toggle="modal" data-tw-target="#edit-user-modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" icon-name="check-square"
                                            data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1">
                                            <polyline points="9 11 12 14 22 4"></polyline>
                                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                        </svg>
                                        Edit
                                    </a>
                                    <a class="flex items-center text-danger" href="javascript:;" data-action="delete" data-id="{{ $user->id }}" data-tw-toggle="modal" data-tw-target="#delete-user-modal">
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
        <div id="delete-user-modal" class="modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body px-5 py-10">
                        <div class="text-center">
                            <div class="mb-5">Are you sure you want to delete this user?</div>
                            <input type="hidden" id="deleteUserId" />
                            <button type="button" id="confirmDeleteUser" class="btn btn-danger w-24 mr-2">Delete</button>
                            <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                </div>
            </div>
            </div>
        </div>
    </div>
        <!-- END: Delete Modal -->

        <!-- BEGIN: Edit Modal -->
        <div id="edit-user-modal" class="modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body px-5 py-10">
                        <div class="text-left">
                            <form id="editUserForm">
                                <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                <input type="hidden" id="editUserId" name="id">

                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Name</label>
                                        <input type="text" id="edit_name" name="name" class="form-control" required>
                </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Email</label>
                                        <input type="email" id="edit_email" name="email" class="form-control" required>
                </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Password (leave blank to keep)</label>
                                        <input type="password" id="edit_password" name="password" class="form-control">
            </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <label class="form-label">Contact Number</label>
                                        <input type="text" id="edit_contact_number" name="contact_number" class="form-control">
            </div>

                                    <div class="col-span-12 md:col-span-4">
                                        <label class="form-label">Street</label>
                                        <input type="text" id="edit_street" name="street" class="form-control">
        </div>
                                    <div class="col-span-12 md:col-span-4">
                                        <label class="form-label">Lot</label>
                                        <input type="text" id="edit_lot" name="lot" class="form-control">
    </div>
                                    <div class="col-span-12 md:col-span-4">
                                        <label class="form-label">Block</label>
                                        <input type="text" id="edit_block" name="block" class="form-control">
                </div>

                                    <div class="col-span-12 md:col-span-3">
                                        <label class="form-label">Membership Fee</label>
                                        <input type="text" id="edit_membership_fee" name="membership_fee" class="form-control">
                </div>
                                    <div class="col-span-12 md:col-span-3">
                                        <label class="form-label">With Title</label>
                                        <select id="edit_is_with_title" name="is_with_title" class="form-select">
                                            <option value="0">No</option>
                                            <option value="1">Yes</option>
                                        </select>
            </div>
                                    <div class="col-span-12 md:col-span-3">
                                        <label class="form-label">Gender</label>
                                        <select id="edit_gender" name="gender" class="form-select">
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
            </div>
                                    <div class="col-span-12 md:col-span-3">
                                        <label class="form-label">Role</label>
                                        <select id="edit_role" name="role" class="form-select">
                                            <option value="">Select</option>
                                            <option value="admin">admin</option>
                                            <option value="home owners">home owners</option>
                                            <option value="non home owners">non home owners</option>
                                            <option value="security personnel">security personnel</option>
                                            <option value="operational manager">operational manager</option>
                                            <option value="service manager">service manager</option>
                                            <option value="financial manager">financial manager</option>
                                            <option value="appointment coordinator">appointment coordinator</option>
                                            <option value="occupancy manager">occupancy manager</option>
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
        <x-pagination :current-page="$users->currentPage()" :total-pages="$users->lastPage()" :per-page="$users->perPage()" :show-per-page-selector="true" :show-first-last="true" />
    <!-- END: Pagination -->
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/usermanagement/usermanagement.js') }}"></script>
@endpush
