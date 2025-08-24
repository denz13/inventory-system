@extends('layout._partials.master')

@section('content')
<div class="col-span-12 mt-6 -mb-6 intro-y">
    <div class="alert alert-dismissible show box bg-warning text-white flex items-center mb-6" role="alert">
        <span>Vehicle Trash: View and manage deleted vehicles. You can restore or permanently delete vehicles from here.</span>
        <button type="button" class="btn-close text-white" data-tw-dismiss="alert" aria-label="Close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="x" data-lucide="x" class="lucide lucide-x w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> 
        </button>
    </div>
</div>

<h2 class="intro-y text-lg font-medium mt-10">
    Vehicle Trash
</h2>

<div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <a href="{{ route('vehicle.index') }}" class="btn btn-outline-secondary shadow-md mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Vehicles
        </a>
        
        <div class="hidden md:block mx-auto text-slate-500">
            Showing <span id="filtered-count">{{ $deletedVehicles->count() }}</span> of <span id="total-count">{{ $deletedVehicles->total() }}</span> deleted entries
        </div>
    </div>

    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
        <table class="table table-report -mt-2">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">VEHICLE INFO</th>
                    <th class="whitespace-nowrap">PLATE NUMBER</th>
                    <th class="whitespace-nowrap">DELETED DATE</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                @forelse($deletedVehicles as $vehicle)
                <tr class="intro-x">
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
                    <td class="text-center">{{ $vehicle->deleted_at ? $vehicle->deleted_at->format('M d, Y g:i A') : 'N/A' }}</td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <button class="flex items-center mr-3 text-success" onclick="restoreVehicle({{ $vehicle->id }})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                                    <path d="M21 3v5h-5"/>
                                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                                    <path d="M3 21v-5h5"/>
                                </svg>
                                Restore
                            </button>
                            <button class="flex items-center text-danger" onclick="forceDeleteVehicle({{ $vehicle->id }})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                Delete Permanently
                            </button>
                        </div>
                    </td>
                </tr>
                @empty
                <tr class="intro-x">
                    <td colspan="4" class="text-center py-8">
                        <div class="text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"></path>
                            </svg>
                            <div class="font-medium">No deleted vehicles found</div>
                            <div class="text-sm">The trash is empty</div>
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
        :current-page="$deletedVehicles->currentPage()" 
        :total-pages="$deletedVehicles->lastPage()" 
        :per-page="$deletedVehicles->perPage()" 
        :show-per-page-selector="true" 
        :show-first-last="true" 
    />
    <!-- END: Pagination -->
</div>

@endsection

@push('scripts')
<script>
function restoreVehicle(vehicleId) {
    if (confirm('Are you sure you want to restore this vehicle?')) {
        $.ajax({
            url: `/vehicle/${vehicleId}/restore`,
            method: 'PATCH',
            data: {
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                if (response.success) {
                    alert('Vehicle restored successfully!');
                    location.reload();
                } else {
                    alert('Error restoring vehicle: ' + response.message);
                }
            },
            error: function() {
                alert('An error occurred while restoring the vehicle.');
            }
        });
    }
}

function forceDeleteVehicle(vehicleId) {
    if (confirm('Are you sure you want to permanently delete this vehicle? This action cannot be undone!')) {
        $.ajax({
            url: `/vehicle/${vehicleId}/force`,
            method: 'DELETE',
            data: {
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                if (response.success) {
                    alert('Vehicle permanently deleted!');
                    location.reload();
                } else {
                    alert('Error deleting vehicle: ' + response.message);
                }
            },
            error: function() {
                alert('An error occurred while deleting the vehicle.');
            }
        });
    }
}
</script>
@endpush
