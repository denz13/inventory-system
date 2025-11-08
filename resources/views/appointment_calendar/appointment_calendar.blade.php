@extends('layout._partials.master')

@section('content')
<div class="grid grid-cols-12 gap-5 mt-5">
    <!-- BEGIN: Calendar Side Menu -->
    <div class="col-span-12 xl:col-span-4 2xl:col-span-3">
        <div class="box p-5 intro-y">
            <button type="button" class="btn btn-primary w-full mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="calendar" class="lucide lucide-calendar w-4 h-4 mr-2" data-lucide="calendar">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Schedule Calendar
            </button>

            <div class="border-t border-b border-slate-200/60 dark:border-darkmode-400 mt-6 mb-5 py-3 overflow-y-auto" id="calendar-events" style="max-height: 500px;">
                @forelse($appointments as $appointment)
                <div class="relative">
                    <div class="event p-3 -mx-3 cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md flex items-center" data-appointment-id="{{ $appointment['id'] }}">
                        <div class="w-2 h-2 
                            @if($appointment['status'] === 'pending') bg-pending
                            @elseif($appointment['status'] === 'approved') bg-success
                            @elseif($appointment['status'] === 'cancelled') bg-danger
                            @elseif($appointment['status'] === 'completed') bg-primary
                            @else bg-warning
                            @endif 
                            rounded-full mr-3"></div>
                        <div class="pr-10">
                            <div class="event__title truncate">{{ $appointment['description'] }}</div>
                            <div class="text-slate-500 text-xs mt-0.5">
                                @php
                                $appointmentDate = \Carbon\Carbon::parse($appointment['appointment_date']);
                                $daysUntil = \Carbon\Carbon::now()->diffInDays($appointmentDate, false);
                                @endphp
                                <span class="event__days">{{ abs($daysUntil) }}</span> Day{{ abs($daysUntil) != 1 ? 's' : '' }}
                                <span class="mx-1">•</span>
                                {{ $appointmentDate->format('g:i A') }}
                            </div>
                        </div>
                    </div>
                    <a class="flex items-center absolute top-0 bottom-0 my-auto right-0 view-appointment-btn" href="javascript:;" data-tw-toggle="modal" data-tw-target="#appointmentModal" data-appointment-id="{{ $appointment['id'] }}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="eye" data-lucide="eye" class="lucide lucide-eye w-4 h-4 text-slate-500">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </a>
                </div>
                @empty
                <div class="text-slate-500 p-3 text-center" id="calendar-no-events">No events yet</div>
                @endforelse
            </div>

            <div class="form-check form-switch flex">
                <!-- <label class="form-check-label" for="checkbox-events">Remove after drop</label>
                                <input class="show-code form-check-input ml-auto" type="checkbox" id="checkbox-events"> -->
            </div>
        </div>
    </div>
    <!-- END: Calendar Side Menu -->

    <!-- BEGIN: Calendar Content -->
    <div class="col-span-12 xl:col-span-8 2xl:col-span-9">
        <div class="box p-5">
            <div class="full-calendar" id="calendar"></div>
        </div>
    </div>
    <!-- END: Calendar Content -->
</div>

<!-- BEGIN: Appointment Details Modal -->
<div id="appointmentModal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-body px-5 py-10">
                <div id="appointment-details">
                    <div class="text-center text-slate-500 py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-lg">Loading appointment details...</p>
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
<!-- END: Appointment Details Modal -->

@endsection

@push('styles')
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.css">
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js"></script>
<style>
    /* Custom FullCalendar Event Styles */
    .fc-event {
        border: none !important;
        border-radius: 4px !important;
        padding: 2px 4px !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        pointer-events: auto !important;
    }

    .fc-event:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        cursor: pointer !important;
    }

    .fc-event-past {
        opacity: 0.6;
        cursor: pointer !important;
    }

    .fc-event-future {
        cursor: pointer !important;
    }

    .fc-event-main {
        padding: 0 !important;
    }

    .fc-event-title {
        color: #ffffff !important;
        font-weight: 600 !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
    }

    .appointment-event {
        background-color: #3b82f6 !important;
        border-color: #3b82f6 !important;
    }

    .appointment-event.fc-event {
        background-color: #3b82f6 !important;
        border-color: #3b82f6 !important;
    }

    /* Modal Styles - Standard Tailwind UI Modal */
    #appointmentModal .modal-body {
        max-height: 70vh;
        overflow-y: auto;
        overflow-x: hidden !important;
    }

    /* Prevent overflow in modal content */
    #appointmentModal .modal-content {
        overflow-x: hidden !important;
        word-wrap: break-word;
        max-width: 100%;
    }

    /* Prevent overflow in modal dialog */
    #appointmentModal .modal-dialog {
        max-width: 100%;
        overflow-x: hidden !important;
    }

    /* Prevent text overflow in modal fields */
    #appointmentModal .modal-body * {
        max-width: 100% !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        box-sizing: border-box !important;
    }

    /* Ensure grid items don't overflow */
    #appointmentModal .grid {
        max-width: 100% !important;
        overflow-x: hidden !important;
    }

    #appointmentModal .grid > * {
        min-width: 0 !important;
        max-width: 100% !important;
        overflow-wrap: break-word !important;
        word-wrap: break-word !important;
    }

    /* Specific fix for text content */
    #appointmentModal .text-slate-800,
    #appointmentModal .text-slate-700 {
        word-break: break-word !important;
        overflow-wrap: break-word !important;
        max-width: 100% !important;
    }

    /* Modal Styles - Let Tailwind handle everything, only fix overflow */
    #appointmentModal .modal-body {
        max-height: 70vh;
        overflow-y: auto;
        overflow-x: hidden;
    }

    /* Ensure body scrolling is restored when modal is closed */
    body:not(.modal-open) {
        overflow: auto !important;
        overflow-y: auto !important;
        overflow-x: auto !important;
    }

    html:not(.modal-open) {
        overflow: auto !important;
        overflow-y: auto !important;
        overflow-x: auto !important;
    }

    /* Force restore scrolling after modal is closed */
    body.modal-closed {
        overflow: auto !important;
        overflow-y: auto !important;
        overflow-x: auto !important;
    }
</style>
@endpush

@push('scripts')
<script>
    // Pass appointments data to JavaScript
    window.appointmentsData = @json($appointments);
</script>
@endpush