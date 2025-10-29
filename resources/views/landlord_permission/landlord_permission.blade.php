@extends('layout._partials.master')

@section('content')
<div class="col-span-12 mt-6 -mb-6 intro-y">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>Landlord Permissions: View all approved landlords with their personal information, property details, and business clearance documents.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> 
        </button>
    </div>
</div>

<h2 class="intro-y text-lg font-medium mt-10">
Landlord Permission
</h2>

<!-- Notifications -->
<div class="intro-y col-span-12">
    <x-notification-toast id="landlord_permission_toast_success" type="success" title="Success" message="Action completed successfully"
        :showButton="false" />
    <x-notification-toast id="landlord_permission_toast_error" type="error" title="Error" :showButton="false">
        <div id="landlord_permission_error_message_slot" class="text-slate-500 mt-1"></div>
    </x-notification-toast>
    <style>
        .toastify {
            background: transparent !important;
            box-shadow: none !important;
        }
        
        /* Toggle Switch Styles */
        .tenant-access-toggle:checked ~ .block {
            background-color: #10b981;
        }
        
        .tenant-access-toggle:checked ~ .dot {
            transform: translateX(100%);
        }
        
        .dot {
            transition: transform 0.3s ease;
        }
    </style>
</div>

<div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <div class="hidden md:block mx-auto text-slate-500">
            Showing {{ $approvedLandlords->count() }} of {{ $approvedLandlords->total() }} entries
        </div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div class="w-56 relative text-slate-500">
                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." id="searchInput" autocomplete="off">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg> 
            </div>
        </div>
    </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
        <div class="overflow-x-auto">
            <table class="table table-report -mt-2" id="landlordPermissionTable">
                <thead>
                    <tr>
                        <th class="whitespace-nowrap">LANDLORD NAME</th>
                        <th class="whitespace-nowrap">EMAIL</th>
                        <th class="whitespace-nowrap">PHONE</th>
                        <th class="text-center whitespace-nowrap">PROPERTY NAME</th>
                        <th class="text-center whitespace-nowrap">UNIT NUMBER</th>
                        <th class="text-center whitespace-nowrap">UNIT TYPE</th>
                        <th class="text-center whitespace-nowrap">BUSINESS CLEARANCE</th>
                        <th class="text-center whitespace-nowrap">SUBMITTED BY</th>
                        <th class="text-center whitespace-nowrap">APPROVED DATE</th>
                        <th class="text-center whitespace-nowrap">TENANT ACCESS</th>
                        <th class="text-center whitespace-nowrap">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($approvedLandlords as $landlord)
                    <tr class="intro-x" data-id="{{ $landlord->id }}">
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
                            @if($landlord->business_clearance_attachments)
                                <a href="{{ asset('storage/' . $landlord->business_clearance_attachments) }}" 
                                   target="_blank" 
                                   class="text-blue-600 hover:text-blue-800 underline inline-flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14,2 14,8 20,8"></polyline>
                                    </svg>
                                    View Clearance
                                </a>
                            @else
                                <span class="text-slate-400 text-sm">No clearance</span>
                            @endif
                        </td>
                        <td class="text-center">
                            {{ $landlord->user ? $landlord->user->name : 'N/A' }}
                        </td>
                        <td class="text-center">
                            <div class="text-slate-500 whitespace-nowrap">{{ $landlord->updated_at ? $landlord->updated_at->format('M d, Y') : 'N/A' }}</div>
                        </td>
                        <td class="text-center">
                            @php
                                // Check if landlord permission record exists
                                $permission = \App\Models\landlord_permission::where('applied_landlord_id', $landlord->id)->first();
                                $hasAccess = $permission && $permission->has_have_permission == 1;
                                $isActive = $permission && $permission->status === 'active';
                            @endphp
                            <div class="flex justify-center items-center">
                                <label class="flex items-center cursor-pointer">
                                    <div class="relative">
                                        <input type="checkbox" 
                                               class="sr-only tenant-access-toggle" 
                                               data-landlord-id="{{ $landlord->id }}"
                                               data-permission-id="{{ $permission ? $permission->id : '' }}"
                                               {{ $hasAccess && $isActive ? 'checked' : '' }}>
                                        <div class="block bg-slate-300 w-14 h-8 rounded-full"></div>
                                        <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                                    </div>
                                    <div class="ml-3 text-sm font-medium {{ $hasAccess && $isActive ? 'text-success' : 'text-slate-400' }}">
                                        {{ $hasAccess && $isActive ? 'Enabled' : 'Disabled' }}
                                    </div>
                                </label>
                            </div>
                        </td>
                        <td class="table-report__action w-56">
                            <div class="flex justify-center items-center">
                                <a class="flex items-center text-primary" href="javascript:;" data-action="view" data-id="{{ $landlord->id }}" data-tw-toggle="modal" data-tw-target="#view-landlord-modal">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    View Details
                                </a>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr class="intro-x">
                        <td colspan="11" class="text-center py-8">
                            <div class="text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <line x1="20" y1="8" x2="20" y2="14"></line>
                                    <line x1="23" y1="11" x2="17" y2="11"></line>
                                </svg>
                                <div class="font-medium">No approved landlords found</div>
                                <div class="text-sm">Approved landlords will appear here</div>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    <!-- END: Data List -->
    
    <!-- BEGIN: Pagination -->
    @if($approvedLandlords && $approvedLandlords->count() > 0)
    <x-pagination 
        :current-page="$approvedLandlords->currentPage()" 
        :total-pages="$approvedLandlords->lastPage()" 
        :per-page="$approvedLandlords->perPage()" 
        :show-per-page-selector="true" 
        :show-first-last="true" 
    />
    @endif
    <!-- END: Pagination -->
</div>

<!-- BEGIN: View Landlord Modal -->
<div id="view-landlord-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Approved Landlord Details</h2>
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

@endsection

@push('scripts')
    <script src="{{ asset('js/landlord_permission/landlord_permission.js') }}?v={{ time() }}"></script>
@endpush
