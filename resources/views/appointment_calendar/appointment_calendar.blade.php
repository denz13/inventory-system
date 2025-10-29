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
                    <a class="flex items-center absolute top-0 bottom-0 my-auto right-0" href="javascript:;" data-tw-toggle="modal" data-tw-target="#appointmentModal" data-appointment-id="{{ $appointment['id'] }}">
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

        <!-- Appointment Details Modal -->
        <div id="appointmentModal" class="modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content" style="background: white; border-radius: 0.5rem;">
                    <!-- Close button -->
                    <button type="button" data-tw-dismiss="modal" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600" style="z-index: 10;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    
                    <div class="modal-body px-8 py-10">
                        <div class="text-center mb-6">
                            <h2 class="font-medium text-xl mb-4">Appointment Details</h2>
                        </div>
                        <div id="appointment-details">
                            <div class="text-center text-slate-500 py-8">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                                <p class="text-base">Loading appointment details...</p>
                            </div>
                        </div>
                        <div class="text-center mt-6">
                            <button type="button" data-tw-dismiss="modal" class="btn btn-primary w-24">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

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
        box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
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
        text-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
    }
    
    .appointment-event {
        background-color: #3b82f6 !important;
        border-color: #3b82f6 !important;
    }
    
    .appointment-event.fc-event {
        background-color: #3b82f6 !important;
        border-color: #3b82f6 !important;
    }
    
    /* Modal Styles */
    #appointmentModal.show {
        display: block !important;
    }
    
    #appointmentModal .modal-dialog {
        max-width: 900px;
        margin: 1.75rem auto;
    }
    
    #appointmentModal .modal-content {
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        background-color: white;
    }
    
    #appointmentModal .modal-body {
        max-height: 70vh;
        overflow-y: auto;
    }
    
    /* Ensure modal appears above everything */
    #appointmentModal {
        display: none;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overflow-x: hidden;
        overflow-y: auto;
        outline: 0;
        z-index: 99999 !important;
        background-color: rgba(0, 0, 0, 0.5) !important;
    }
    
    #appointmentModal.show {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        visibility: visible !important;
        opacity: 1 !important;
    }
    
    .modal-backdrop {
        z-index: 99998 !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background-color: rgba(0, 0, 0, 0.5) !important;
    }
    
    .modal-open {
        overflow: hidden !important;
    }
    
    /* Center modal dialog */
    #appointmentModal .modal-dialog {
        position: relative !important;
        width: 100% !important;
        max-width: 900px !important;
        margin: 1.75rem auto !important;
        pointer-events: auto !important;
        z-index: 100000 !important;
    }
    
    #appointmentModal .modal-content {
        position: relative !important;
        display: flex !important;
        flex-direction: column !important;
        pointer-events: auto !important;
        background-color: white !important;
        background-clip: padding-box;
        outline: 0;
        border-radius: 0.5rem !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4) !important;
    }
</style>
@endpush

@push('scripts')
    <script>
        // Pass appointments data to JavaScript
        window.appointmentsData = @json($appointments);
    </script>
@endpush