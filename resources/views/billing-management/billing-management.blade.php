@extends('layout._partials.master')

@section('content')
<div class="col-span-12 mt-6 -mb-6 intro-y">
    <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
        <span>Billing Management: Create, manage and track billing records for users. Monitor payment status and manage billing items efficiently.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> 
        </button>
    </div>
</div>

<h2 class="intro-y text-lg font-medium mt-10">
    Billing Management
</h2>

<!-- Notifications -->
<div class="intro-y col-span-12">
    <x-notification-toast id="billing_toast_success" type="success" title="Success" message="Billing created successfully"
        :showButton="false" />
    <x-notification-toast id="billing_toast_error" type="error" title="Error" :showButton="false">
        <div id="billing_error_message_slot" class="text-slate-500 mt-1"></div>
    </x-notification-toast>
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
    </style>
</div>

<div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <button class="btn btn-primary shadow-md mr-2" data-tw-toggle="modal" data-tw-target="#create-billing-modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Create Billing
        </button>
        
        <div class="ml-2 flex gap-2">
            <input type="text" data-daterange="true" class="datepicker form-control w-56" placeholder="Filter by date range" id="dateRangeFilter">
            <button type="button" class="btn btn-outline-secondary" id="clearFilterBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1 -1 2 -2 2H7c-1 0 -2 -1 -2 -2V6"></path>
                    <path d="M8 6V4c0 -1 1 -2 2 -2h4c1 0 2 1 2 2v2"></path>
                </svg>
                Show All
            </button>
        </div>
        
        <div class="hidden md:block mx-auto text-slate-500">
            Showing <span id="filtered-count">{{ $billings->count() }}</span> of <span id="total-count">{{ $billings->total() }}</span> entries
        </div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div class="w-56 relative text-slate-500">
                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." id="searchInput">
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
                    <th class="whitespace-nowrap">USER</th>
                    <th class="whitespace-nowrap">BILLING DATE</th>
                    <th class="text-center whitespace-nowrap">AMOUNT DUE</th>
                    <th class="text-center whitespace-nowrap">STATUS</th>
                    <th class="text-center whitespace-nowrap">ITEMS</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                @forelse($billings as $billing)
                <tr class="intro-x" data-status="{{ $billing->status }}" data-billing-date="{{ $billing->billing_date }}">
                    <td class="w-40">
                        <div class="font-medium">{{ $billing->user->name ?? 'Unknown User' }}</div>
                        <div class="text-slate-500 text-xs mt-0.5">{{ $billing->user->email ?? 'N/A' }}</div>
                    </td>
                    <td class="whitespace-nowrap">
                        <div class="font-medium">{{ $billing->billing_date }}</div>
                    </td>
                    <td class="text-center">
                        <div class="font-medium text-primary">₱{{ number_format($billing->amount_due, 2) }}</div>
                    </td>
                    <td class="w-40">
                        <div class="flex items-center justify-center text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            Sent to Owners
                        </div>
                    </td>
                    <td class="text-center">
                        <span class="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {{ $billing->billingItems->count() }} {{ $billing->billingItems->count() === 1 ? 'item' : 'items' }}
                        </span>
                    </td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view-billing-modal" data-billing-id="{{ $billing->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View
                            </a>
                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#edit-billing-modal" data-billing-id="{{ $billing->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Edit
                            </a>
                            <a class="flex items-center text-danger" href="javascript:;" data-tw-toggle="modal" data-tw-target="#delete-confirmation-modal" data-billing-id="{{ $billing->id }}">
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
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10,9 9,9 8,9"></polyline>
                            </svg>
                            <div class="font-medium">No billing records found</div>
                            <div class="text-sm">Start by creating your first billing record</div>
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
        :current-page="$billings->currentPage()" 
        :total-pages="$billings->lastPage()" 
        :per-page="$billings->perPage()" 
        :show-per-page-selector="true" 
        :show-first-last="true" 
    />
    <!-- END: Pagination -->
</div>

<!-- BEGIN: Create Billing Modal -->
<div id="create-billing-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-body px-6 py-8">
                <form id="createBillingForm" method="POST" action="/billing">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    
                    <!-- User and Basic Info -->
                    <div class="grid grid-cols-12 gap-4 mb-6">
                        <div class="col-span-12">
                            <label class="form-label text-base font-semibold text-slate-700">Select User</label>
                            <select name="user_id" class="form-control mt-2 p-3 border border-slate-300 rounded-lg" required>
                                <option value="">Choose User</option>
                                @foreach($users as $user)
                                    <option value="{{ $user->id }}">{{ $user->name }} ({{ $user->email }})</option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4 mb-6">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">Billing Date Range</label>
                            <input type="text" data-daterange="true" class="datepicker form-control mt-2 p-3 border border-slate-300 rounded-lg" name="billing_date_range" placeholder="Select date range" required>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">Total Amount Due</label>
                            <input type="number" name="amount_due" class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-100" step="0.01" min="0" placeholder="Auto-calculated" readonly>
                            <small class="text-slate-500">This will be automatically calculated from billing items</small>
                        </div>
                    </div>

                    <!-- Billing Items Section -->
                    <div class="mb-6">
                        <div class="flex justify-between items-center mb-4">
                            <label class="form-label text-base font-semibold text-slate-700">Billing Items</label>
                            <button type="button" id="addBillingItem" class="btn btn-success btn-sm">Add Item</button>
                        </div>
                        <div id="billingItemsContainer"></div>
                    </div>
                </form>
            </div>
            
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2">Cancel</button>
                    <button type="submit" form="createBillingForm" class="btn btn-primary px-6 py-2">Create Billing</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Create Billing Modal -->

<!-- BEGIN: View Billing Modal -->
<div id="view-billing-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-body p-0">
                <div id="billing-details">
                    <div class="text-center text-slate-500 py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-lg">Loading billing details...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: View Billing Modal -->

<!-- BEGIN: Edit Billing Modal -->
<div id="edit-billing-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-body px-6 py-8">
                <form id="editBillingForm" method="POST">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" id="editBillingId">
                    
                    <!-- User and Basic Info -->
                    <div class="grid grid-cols-12 gap-4 mb-6">
                        <div class="col-span-12">
                            <label class="form-label text-base font-semibold text-slate-700">User</label>
                            <input type="hidden" name="user_id" id="editUserId">
                            <input type="text" id="editUserDisplay" class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-100" readonly>
                            <small class="text-slate-500">User cannot be changed when editing billing records</small>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4 mb-6">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">Billing Date Range</label>
                            <input type="text" data-daterange="true" class="datepicker form-control w-56 block mx-auto mt-2 p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" name="billing_date_range" id="editBillingDateRange" placeholder="Select date range" required>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label text-base font-semibold text-slate-700">Total Amount Due</label>
                            <input type="number" name="amount_due" id="editAmountDue" class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-100 focus:border-blue-500 focus:ring-blue-500" step="0.01" min="0" placeholder="Auto-calculated" readonly>
                            <small class="text-slate-500">This will be automatically calculated from billing items</small>
                        </div>
                    </div>

                    <!-- Billing Items Section -->
                    <div class="mb-6">
                        <div class="flex justify-between items-center mb-4">
                            <label class="form-label text-base font-semibold text-slate-700">Billing Items</label>
                            <button type="button" id="addEditBillingItem" class="btn btn-success btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                                Add Item
                            </button>
                        </div>
                        <div id="editBillingItemsContainer"></div>
                    </div>
                </form>
            </div>
            
            <div class="modal-footer px-6 py-4 bg-slate-50">
                <div class="flex justify-end gap-3">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary px-6 py-2">Cancel</button>
                    <button type="submit" form="editBillingForm" class="btn btn-primary px-6 py-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        Update Billing
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Edit Billing Modal -->

<!-- BEGIN: Delete Confirmation Modal -->
<div id="delete-confirmation-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body p-0">
                <div class="p-5 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle w-16 h-16 text-danger mx-auto mt-3">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <div class="text-3xl mt-5">Are you sure?</div>
                    <div class="text-slate-500 mt-2">Do you really want to delete this billing record? This process cannot be undone.</div>
                </div>
                <div class="px-5 pb-8 text-center">
                    <input type="hidden" id="deleteBillingId">
                    <div class="flex justify-center gap-2">
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24 mb-2">Cancel</button>
                        <button type="button" class="btn btn-danger w-24 mb-2" id="confirmDeleteBilling">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Delete Confirmation Modal -->

@endsection

@push('scripts')
    <script src="{{ asset('js/billing-management/billing-management.js') }}"></script>
@endpush