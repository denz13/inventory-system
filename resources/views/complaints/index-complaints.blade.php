@extends('layout._partials.master')

@section('content')

<div class="col-span-12 mt-6 -mb-6 intro-y">
                                <div class="alert alert-dismissible show box bg-primary text-white flex items-center mb-6" role="alert">
                                    <span>Take note: Service requests are only available for logged in users and you can only update and delete your own requests if the status is still pending.</span>
                                    <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> </button>
                                </div>
                            </div>
<div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12">
        <div class="intro-y text-lg font-medium mt-10">
            Service Request
        </div>
    </div>

    <!-- Notifications -->
    <div class="intro-y col-span-12">
        <x-notification-toast id="complaints_toast_success" type="success" title="Success" message="Service request submitted successfully"
            :showButton="false" />
        <x-notification-toast id="complaints_toast_error" type="error" title="Error" :showButton="false">
            <div id="complaints-error-message-slot" class="text-slate-500 mt-1"></div>
        </x-notification-toast>
        <style>
            .toastify {
                background: transparent !important;
                box-shadow: none !important;
            }
            .service-type-option:hover, .category-option:hover {
                border-color: #3b82f6 !important;
                background-color: #f8fafc;
            }
            .service-type-option.selected, .category-option.selected {
                border-color: #3b82f6 !important;
                background-color: #eff6ff;
            }
            .step-content {
                transition: all 0.3s ease;
            }
            .step-content.hidden {
                display: none;
            }
            .step-indicator {
                display: flex;
                justify-content: center;
                margin-bottom: 2rem;
            }
            .step-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: #e2e8f0;
                margin: 0 8px;
                transition: all 0.3s ease;
            }
            .step-dot.active {
                background-color: #3b82f6;
                transform: scale(1.2);
            }
            .step-dot.completed {
                background-color: #10b981;
            }
        </style>
    </div>

    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <button class="btn btn-primary shadow-md mr-2" data-tw-toggle="modal" data-tw-target="#request-service-modal">
            
            Request Service
        </button>
        
        <div class="hidden md:block mx-auto text-slate-500">Showing {{ $userComplaints->firstItem() ?? 0 }} to {{ $userComplaints->lastItem() ?? 0 }} of {{ $userComplaints->total() ?? 0 }} entries</div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div class="w-56 relative text-slate-500">
                <div class="relative">
                    <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." id="searchInput">
                    <!-- <button type="button" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" id="clearSearch" style="display: none;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button> -->
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg> 
                            </div>
                <div id="searchResultsCount" class="text-sm text-slate-500 mt-2 text-center" style="display: none;"></div>
            </div>
        </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
        <table class="table table-report -mt-2">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">SERVICE TYPE</th>
                    <th class="whitespace-nowrap">CATEGORY</th>
                    <th class="whitespace-nowrap">DESCRIPTION</th>
                    <th class="text-center whitespace-nowrap">STATUS</th>
                    <th class="text-center whitespace-nowrap">DATE</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                @forelse($userComplaints as $complaint)
                <tr class="intro-x">
                    <td>
                        <a href="javascript:;" class="font-medium whitespace-nowrap">{{ $complaint->serviceType->type ?? 'N/A' }}</a> 
                        <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">{{ $complaint->serviceType->status ?? 'N/A' }}</div>
                    </td>
                    <td class="whitespace-nowrap">{{ $complaint->serviceCategory->category ?? 'N/A' }}</td>
                    <td class="whitespace-nowrap">{{ Str::limit($complaint->complaint_description, 50) }}</td>
                    <td class="w-40">
                        <div class="flex items-center justify-center 
                            @if($complaint->status === 'Pending') text-warning
                            @elseif($complaint->status === 'In Progress') text-info
                            @elseif($complaint->status === 'Completed') text-success
                            @elseif($complaint->status === 'Cancelled') text-danger
                            @else text-slate-500
                            @endif">
                            @if($complaint->status === 'Pending')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            @elseif($complaint->status === 'In Progress')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12,6 12,12 16,14"></polyline>
                                </svg>
                            @elseif($complaint->status === 'Completed')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                </svg>
                            @elseif($complaint->status === 'Cancelled')
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                            @else
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                            @endif
                            {{ $complaint->status ?? 'Unknown' }}
                        </div>
                    </td>
                    <td class="text-center">{{ $complaint->created_at ? $complaint->created_at->format('M d, Y g:i A') : 'N/A' }}</td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view-complaint-modal" data-complaint-id="{{ $complaint->id }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View
                            </a>
                                                         @if($complaint->status === 'Pending')
                             <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#edit-complaint-modal" data-complaint-id="{{ $complaint->id }}">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                     <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                 </svg>
                                 Edit
                             </a>
                             @endif
                             @if(strtolower($complaint->status) !== 'approved')
                             <a class="flex items-center text-danger" href="javascript:;" data-tw-toggle="modal" data-tw-target="#delete-confirmation-modal" data-complaint-id="{{ $complaint->id }}">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                     <polyline points="3 6 5 6 21 6"></polyline>
                                     <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                     <line x1="10" y1="11" x2="10" y2="17"></line>
                                     <line x1="14" y1="11" x2="14" y2="17"></line>
                                 </svg>
                                 Delete
                             </a>
                             @endif
                        </div>
                    </td>
                </tr>
                @empty
                <tr class="intro-x">
                    <td colspan="6" class="text-center py-8">
                        <div class="text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                            </svg>
                            <div class="font-medium">No service requests found</div>
                            <div class="text-sm">Start by creating your first service request</div>
                        </div>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <!-- END: Data List -->

    <!-- BEGIN: Pagination -->
    <x-pagination :current-page="$userComplaints->currentPage()" :total-pages="$userComplaints->lastPage()" :per-page="$userComplaints->perPage()" :show-per-page-selector="true" :show-first-last="true" />
    <!-- END: Pagination -->
</div>

<!-- BEGIN: Request Service Modal -->
<div id="request-service-modal" class="modal" data-tw-backdrop="static" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
           
            <div class="modal-body px-5 py-10">
                <!-- Step Indicator -->
                <div class="step-indicator">
                    <div class="step-dot active" data-step="1"></div>
                    <div class="step-dot" data-step="2"></div>
                    <div class="step-dot" data-step="3"></div>
                </div>

                <form id="requestServiceForm" method="POST" action="{{ route('complaints.store') }}">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    
                    <!-- Step 1: Service Type Selection -->
                    <div id="step1" class="step-content">
                        <h3 class="text-lg font-medium mb-4 text-center">Select Service Type</h3>
                        <p class="text-slate-500 text-center mb-6">Choose the type of service you need</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            @foreach($serviceTypes as $type)
                            <div class="service-type-option cursor-pointer p-6 border-2 border-slate-200 rounded-lg hover:border-primary transition-all duration-300 hover:shadow-md" 
                                 data-type-id="{{ $type->id }}" data-type-name="{{ $type->type }}">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="font-medium text-lg">{{ $type->type }}</div>
                                        <div class="text-slate-500 text-sm mt-1">{{ $type->status }}</div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-slate-400">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>
                            </div>
                            @endforeach
                        </div>
                    </div>

                    <!-- Step 2: Category Selection -->
                    <div id="step2" class="step-content hidden">
                        <h3 class="text-lg font-medium mb-4 text-center">Select Category</h3>
                        <p class="text-slate-500 text-center mb-6">Choose the specific category for your request</p>
                        <div class="mb-6">
                            <button type="button" class="btn btn-outline-secondary btn-sm" id="backToStep1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                                Back to Service Types
                            </button>
                        </div>
                        <div id="categoriesList" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Categories will be loaded here -->
                        </div>
                    </div>

                    <!-- Step 3: Complaint Form -->
                    <div id="step3" class="step-content hidden">
                        <h3 class="text-lg font-medium mb-4 text-center">Submit Service Request</h3>
                        <p class="text-slate-500 text-center mb-6">Provide details about your service request</p>
                        <div class="mb-6">
                            <button type="button" class="btn btn-outline-secondary btn-sm" id="backToStep2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                                Back to Categories
                            </button>
                        </div>
                        
                        <div class="grid grid-cols-12 gap-4 mb-6">
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">Selected Service Type</label>
                                <input type="text" class="intro-x login__input form-control py-3 px-4 block" id="selectedTypeDisplay" readonly>
                            </div>
                            
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">Selected Category</label>
                                <input type="text" class="intro-x login__input form-control py-3 px-4 block" id="selectedCategoryDisplay" readonly>
                            </div>
                        </div>
                        
                        <div class="mb-6">
                            <label class="form-label">Description</label>
                            <textarea name="complaint_description" class="form-control" rows="4" placeholder="Please describe your service request in detail..." required></textarea>
                            <div class="text-slate-500 text-xs mt-1">Be as specific as possible to help us serve you better.</div>
                        </div>
                        
                        <div class="flex justify-end gap-2">
                            <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                            <button type="submit" class="btn btn-primary w-24">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                    <path d="M22 2L11 13"></path>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- END: Request Service Modal -->

 <!-- BEGIN: View Complaint Modal -->
 <div id="view-complaint-modal" class="modal" tabindex="-1" aria-hidden="true">
     <div class="modal-dialog">
         <div class="modal-content">
             <div class="modal-header">
                 <h2 class="font-medium text-base mr-auto">Service Request Details</h2>
                 <button type="button" data-tw-dismiss="modal" class="btn-close">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                         <line x1="18" y1="6" x2="6" y2="18"></line>
                         <line x1="6" y1="6" x2="18" y2="18"></line>
                     </svg>
                 </button>
             </div>
             <div class="modal-body px-5 py-10">
                 <div id="complaint-details">
                     <!-- Complaint details will be loaded here -->
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
 <!-- END: View Complaint Modal -->

<!-- BEGIN: Edit Complaint Modal -->
<div id="edit-complaint-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
           
            <div class="modal-body px-5 py-10">
                <form id="editComplaintForm" method="POST">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" id="editComplaintId">
                    
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label">Service Type</label>
                            <input type="text" class="form-control" id="editServiceType" readonly>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label">Category</label>
                            <input type="text" class="form-control" id="editServiceCategory" readonly>
                        </div>
                        <div class="col-span-12">
                            <label class="form-label">Description</label>
                            <textarea name="complaint_description" id="editComplaintDescription" class="form-control" rows="4" placeholder="Please describe your service request in detail..." required></textarea>
                            <div class="text-slate-500 text-xs mt-1">Be as specific as possible to help us serve you better.</div>
                        </div>
                    </div>
                    
                    <div class="flex justify-end gap-2 mt-6">
                        <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                        <button type="submit" class="btn btn-primary w-24">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- END: Edit Complaint Modal -->

<!-- BEGIN: Delete Confirmation Modal -->
<div id="delete-confirmation-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body px-5 py-10">
                <div class="text-center">
                    <div class="mb-5">Are you sure you want to delete this service request?</div>
                    <input type="hidden" id="deleteComplaintId" />
                    <button type="button" id="confirmDeleteComplaint" class="btn btn-danger w-24 mr-2">Delete</button>
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Delete Confirmation Modal -->
@endsection

@push('scripts')
    <script src="{{ asset('js/complaints/complaints.js') }}"></script>
@endpush
