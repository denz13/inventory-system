@extends('layout._partials.master')

@section('content')
<h2 class="intro-y text-lg font-medium mt-10">
                    List of Homeowners Service Requests
                </h2>
                <div class="grid grid-cols-12 gap-6 mt-5">
                    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                        <div class="dropdown"> 
                            <button class="dropdown-toggle btn btn-primary" aria-expanded="false" data-tw-toggle="dropdown">Filter</button> 
                            <div class="dropdown-menu w-40"> 
                                <ul class="dropdown-content"> 
                                    <li> <a href="" class="dropdown-item">All Requests</a> </li> 
                                    <li> <a href="" class="dropdown-item">Pending</a> </li> 
                                    <li> <a href="" class="dropdown-item">In Progress</a> </li> 
                                    <li> <a href="" class="dropdown-item">Completed</a> </li> 
                                    <li> <a href="" class="dropdown-item">Cancelled</a> </li> 
                                </ul> 
                            </div> 
                        </div>                         
                        <div class="hidden md:block mx-auto text-slate-500">
                            Showing {{ $serviceRequests->firstItem() ?? 0 }} to {{ $serviceRequests->lastItem() ?? 0 }} of {{ $serviceRequests->total() ?? 0 }} entries
                        </div>
                        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                            <div class="w-56 relative text-slate-500">
                                <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." id="searchInput">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> 
                            </div>
                        </div>
                    </div>
                    <!-- BEGIN: Data List -->
                    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
                        <table class="table table-report -mt-2">
                            <thead>
                                <tr>
                                    <th class="whitespace-nowrap">HOMEOWNER</th>
                                    <th class="whitespace-nowrap">SERVICE TYPE</th>
                                    <th class="whitespace-nowrap">CATEGORY</th>
                                    <th class="whitespace-nowrap">DESCRIPTION</th>
                                    <th class="text-center whitespace-nowrap">STATUS</th>
                                    <th class="text-center whitespace-nowrap">DATE SUBMITTED</th>
                                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($serviceRequests as $request)
                                <tr class="intro-x">
                                    <td class="w-40">
                                        <div class="flex items-center">
                                            <div class="w-10 h-10 image-fit zoom-in">
                                                <img alt="Profile" class="tooltip rounded-full" src="{{ $request->user->photo_url ?? 'dist/images/preview-8.jpg' }}">
                                            </div>
                                            <div class="ml-3">
                                                <div class="font-medium">{{ $request->user->name ?? 'N/A' }}</div>
                                                <div class="text-slate-500 text-xs">{{ $request->user->email ?? 'N/A' }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="font-medium">{{ $request->serviceCategory->serviceType->type ?? 'N/A' }}</div>
                                        <div class="text-slate-500 text-xs">{{ $request->serviceCategory->serviceType->status ?? 'N/A' }}</div>
                                    </td>
                                    <td class="whitespace-nowrap">{{ $request->serviceCategory->category ?? 'N/A' }}</td>
                                    <td class="whitespace-nowrap">{{ Str::limit($request->complaint_description, 50) }}</td>
                                    <td class="w-40">
                                        <div class="flex items-center justify-center 
                                            @if($request->status === 'Pending') text-warning
                                            @elseif($request->status === 'In Progress') text-info
                                            @elseif($request->status === 'Completed') text-success
                                            @elseif($request->status === 'Cancelled') text-danger
                                            @else text-slate-500
                                            @endif">
                                            @if($request->status === 'Pending')
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                                </svg>
                                            @elseif($request->status === 'In Progress')
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12,6 12,12 16,14"></polyline>
                                                </svg>
                                            @elseif($request->status === 'Completed')
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                                                    <polyline points="9 11 12 14 22 4"></polyline>
                                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                                </svg>
                                            @elseif($request->status === 'Cancelled')
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
                                            {{ $request->status ?? 'Unknown' }}
                                        </div>
                                    </td>
                                    <td class="text-center">{{ $request->created_at ? $request->created_at->format('M d, Y g:i A') : 'N/A' }}</td>
                                    <td class="table-report__action w-56">
                                        <div class="flex justify-center items-center">
                                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view-request-modal" data-request-id="{{ $request->id }}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                                View
                                            </a>
                                            @if($request->status === 'Pending')
                                            <a class="flex items-center mr-3" href="javascript:;" data-tw-toggle="modal" data-tw-target="#update-status-modal" data-request-id="{{ $request->id }}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                                Update Status
                                            </a>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                                @empty
                                <tr class="intro-x">
                                    <td colspan="7" class="text-center py-8">
                                        <div class="text-slate-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                                <polyline points="14,2 14,8 20,8"></polyline>
                                            </svg>
                                            <div class="font-medium">No service requests found</div>
                                            <div class="text-sm">There are currently no service requests to display</div>
                                        </div>
                                    </td>
                                </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                    <!-- END: Data List -->
                    
                    <!-- BEGIN: Pagination -->
                    @if($serviceRequests->hasPages())
                        <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                            <nav class="w-full sm:w-auto sm:mr-auto">
                                {{ $serviceRequests->links() }}
                            </nav>
                        </div>
                    @endif
                    <!-- END: Pagination -->
                </div>

<!-- BEGIN: View Request Modal -->
<div id="view-request-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
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
                <div id="request-details">
                    <div class="text-center text-slate-500">
                        <p>Click on a "View" button to see request details</p>
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
<!-- END: View Request Modal -->

<!-- BEGIN: Update Status Modal -->
<div id="update-status-modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-medium text-base mr-auto">Update Service Request Status</h2>
                <button type="button" data-tw-dismiss="modal" class="btn-close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body px-5 py-10">
                <form id="updateStatusForm" method="POST">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" id="updateRequestId">
                    
                    <div class="mb-6">
                        <label class="form-label">Current Status</label>
                        <div class="text-slate-500" id="currentStatus">-</div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label">New Status</label>
                        <select name="status" class="form-control" required>
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    
                    <div class="mb-6">
                        <label class="form-label">Notes (Optional)</label>
                        <textarea name="notes" class="form-control" rows="3" placeholder="Add any notes about this status update..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer px-5 py-3">
                <div class="flex justify-end gap-2">
                    <button type="button" data-tw-dismiss="modal" class="btn btn-outline-secondary w-24">Cancel</button>
                    <button type="submit" form="updateStatusForm" class="btn btn-primary w-24">Update</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END: Update Status Modal -->

@endsection

@push('scripts')
    <script src="{{ asset('js/servicemanagement/service-management.js') }}"></script>
@endpush
