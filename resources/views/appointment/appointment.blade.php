@extends('layout.app')

@section('title', 'Appointment Management')

@section('content')
<div class="content">
    <!-- BEGIN: Content -->
    <div class="intro-y flex items-center mt-8">
        <h2 class="text-lg font-medium mr-auto">
            Appointment Management
        </h2>
    </div>

    <!-- BEGIN: Appointment Form -->
    <div class="grid grid-cols-12 gap-6 mt-5">
        <div class="intro-y col-span-12 lg:col-span-6">
            <div class="intro-y box">
                <div class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">Schedule New Appointment</h2>
                </div>
                <div class="p-5">
                    <form id="appointmentForm">
                        @csrf
                        <div class="mb-4">
                            <label for="description" class="form-label">Description *</label>
                            <textarea id="description" name="description" class="form-control" rows="3" placeholder="Enter appointment description" required></textarea>
                        </div>
                        
                        <div class="mb-4">
                            <label for="appointment_date" class="form-label">Appointment Date *</label>
                            <input type="date" id="appointment_date" name="appointment_date" class="form-control" required>
                        </div>
                        
                        <div class="mb-4">
                            <label for="tracking_number" class="form-label">Tracking Number</label>
                            <input type="text" id="tracking_number" name="tracking_number" class="form-control" placeholder="Enter tracking number (optional)">
                        </div>
                        
                        <div class="mb-4">
                            <label for="remarks" class="form-label">Remarks</label>
                            <textarea id="remarks" name="remarks" class="form-control" rows="2" placeholder="Enter additional remarks (optional)"></textarea>
                        </div>
                        
                        <div class="mb-4">
                            <label for="status" class="form-label">Status</label>
                            <select id="status" name="status" class="form-select">
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        
                        <div class="mb-4">
                            <div class="flex items-center">
                                <input type="checkbox" id="is_expired" name="is_expired" class="form-check-input mr-2">
                                <label for="is_expired" class="form-label">Mark as Expired</label>
                            </div>
                        </div>
                        
                        <div class="flex justify-end">
                            <button type="submit" class="btn btn-primary">Schedule Appointment</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- BEGIN: Appointment List -->
        <div class="intro-y col-span-12 lg:col-span-6">
            <div class="intro-y box">
                <div class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">Appointments</h2>
                </div>
                <div class="p-5">
                    <div id="appointmentsList">
                        @if($appointments->count() > 0)
                            @foreach($appointments as $appointment)
                                <div class="appointment-item border rounded-lg p-4 mb-3" data-id="{{ $appointment->id }}">
                                    <div class="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 class="font-medium text-lg">{{ Str::limit($appointment->description, 50) }}</h3>
                                            @if($appointment->tracking_number)
                                                <p class="text-sm text-slate-500">#{{ $appointment->tracking_number }}</p>
                                            @endif
                                        </div>
                                        <div class="flex space-x-2">
                                            <button onclick="editAppointment({{ $appointment->id }})" class="btn btn-outline-secondary btn-sm">Edit</button>
                                            <button onclick="deleteAppointment({{ $appointment->id }})" class="btn btn-outline-danger btn-sm">Delete</button>
                                        </div>
                                    </div>
                                    <p class="text-slate-600 mb-2">{{ $appointment->description }}</p>
                                    <div class="grid grid-cols-2 gap-4 text-sm mb-2">
                                        <div>
                                            <span class="font-medium">Date:</span> {{ \Carbon\Carbon::parse($appointment->appointment_date)->format('M d, Y') }}
                                        </div>
                                        <div>
                                            <span class="font-medium">Status:</span> 
                                            <span class="px-2 py-1 rounded-full text-xs {{ $appointment->status === 'approved' ? 'text-green-600 bg-green-100' : ($appointment->status === 'pending' ? 'text-yellow-600 bg-yellow-100' : ($appointment->status === 'cancelled' ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100')) }}">
                                                {{ ucfirst($appointment->status) }}
                                            </span>
                                        </div>
                                    </div>
                                    @if($appointment->remarks)
                                        <div class="text-sm text-slate-500">
                                            <span class="font-medium">Remarks:</span> {{ $appointment->remarks }}
                                        </div>
                                    @endif
                                    @if($appointment->is_expired)
                                        <div class="mt-2">
                                            <span class="px-2 py-1 rounded-full text-xs text-red-600 bg-red-100">Expired</span>
                                        </div>
                                    @endif
                                </div>
                            @endforeach
                        @else
                            <div class="text-center text-slate-500 py-8">
                                <i data-lucide="calendar" class="w-16 h-16 mx-auto mb-4 text-slate-300"></i>
                                <p>No appointments scheduled yet.</p>
                                <p class="text-sm">Schedule your first appointment using the form on the left.</p>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Appointment Form -->

    <!-- BEGIN: Edit Appointment Modal -->
    <div id="editAppointmentModal" class="modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="font-medium text-base mr-auto">Edit Appointment</h2>
                    <button type="button" class="btn-close" data-tw-dismiss="modal" aria-label="Close">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
                <form id="editAppointmentForm">
                    @csrf
                    <div class="modal-body">
                        <input type="hidden" id="edit_appointment_id" name="appointment_id">
                        
                        <div class="mb-4">
                            <label for="edit_description" class="form-label">Description *</label>
                            <textarea id="edit_description" name="description" class="form-control" rows="3" required></textarea>
                        </div>
                        
                        <div class="mb-4">
                            <label for="edit_appointment_date" class="form-label">Appointment Date *</label>
                            <input type="date" id="edit_appointment_date" name="appointment_date" class="form-control" required>
                        </div>
                        
                        <div class="mb-4">
                            <label for="edit_tracking_number" class="form-label">Tracking Number</label>
                            <input type="text" id="edit_tracking_number" name="tracking_number" class="form-control">
                        </div>
                        
                        <div class="mb-4">
                            <label for="edit_remarks" class="form-label">Remarks</label>
                            <textarea id="edit_remarks" name="remarks" class="form-control" rows="2"></textarea>
                        </div>
                        
                        <div class="mb-4">
                            <label for="edit_status" class="form-label">Status</label>
                            <select id="edit_status" name="status" class="form-select">
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        
                        <div class="mb-4">
                            <div class="flex items-center">
                                <input type="checkbox" id="edit_is_expired" name="is_expired" class="form-check-input mr-2">
                                <label for="edit_is_expired" class="form-label">Mark as Expired</label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-tw-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Appointment</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- END: Edit Appointment Modal -->

    <!-- BEGIN: Delete Confirmation Modal -->
    <div id="deleteAppointmentModal" class="modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="font-medium text-base mr-auto">Delete Appointment</h2>
                    <button type="button" class="btn-close" data-tw-dismiss="modal" aria-label="Close">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete this appointment?</p>
                    <p class="text-sm text-slate-500 mt-2">This action cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-tw-dismiss="modal">Cancel</button>
                    <button type="button" id="confirmDeleteBtn" class="btn btn-danger">Delete</button>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Delete Confirmation Modal -->
</div>
@endsection

@push('scripts')
<script src="{{ asset('js/appointment/appointment.js') }}"></script>
@endpush