import "@fullcalendar/core/vdom";
import { Calendar } from "@fullcalendar/core";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

(function () {
    if ($("#calendar").length) {
        // Get appointments data from window object (passed from Blade)
        const appointments = window.appointmentsData || [];
        
        console.log('Loading appointments:', appointments);
        console.log('Appointments length:', appointments.length);
        
        // Format appointments for FullCalendar
        const events = appointments.map(appointment => {
            // Determine color based on status
            let color;
            switch(appointment.status?.toLowerCase()) {
                case 'pending':
                    color = '#f59e0b'; // warning
                    break;
                case 'approved':
                    color = '#10b981'; // success
                    break;
                case 'cancelled':
                    color = '#ef4444'; // danger
                    break;
                case 'completed':
                    color = '#3b82f6'; // primary
                    break;
                default:
                    color = '#6b7280'; // info/gray
            }
            
            return {
                id: appointment.id,
                title: appointment.description,
                start: appointment.appointment_date,
                backgroundColor: color,
                borderColor: color,
                textColor: '#ffffff',
                className: 'appointment-event',
                extendedProps: {
                    tracking_number: appointment.tracking_number,
                    remarks: appointment.remarks,
                    status: appointment.status,
                    is_expired: appointment.is_expired
                }
            };
        });
        
       
        // Initialize draggable for sidebar events
        if ($("#calendar-events").length) {
            new Draggable($("#calendar-events")[0], {
                itemSelector: ".event",
                eventData: function (eventEl) {
                    return {
                        title: $(eventEl).find(".event__title").html(),
                        duration: {
                            days: parseInt(
                                $(eventEl).find(".event__days").text()
                            ),
                        },
                    };
                },
            });
        }

        let calendar = new Calendar($("#calendar")[0], {
            plugins: [
                interactionPlugin,
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
            ],
            droppable: false,
            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            },
            navLinks: true,
            editable: false,
            dayMaxEvents: true,
            events: events,
            eventClick: function(info) {
                // Show appointment details in modal
                const event = info.event;
                console.log('Appointment clicked:', event);
                console.log('Event title:', event.title);
                console.log('Event extendedProps:', event.extendedProps);
                
                // First, let's test with a simple alert to make sure click is working
                alert(`Appointment clicked: ${event.title}\nStatus: ${event.extendedProps.status}\nTracking: ${event.extendedProps.tracking_number}`);
                
                // Load appointment details first
                loadAppointmentDetails(event);
                
                // Debug modal element
                const modalElement = document.getElementById('appointmentModal');
                console.log('Modal element found:', modalElement);
                console.log('jQuery available:', typeof $ !== 'undefined');
                
                // Try multiple methods to show modal
                setTimeout(() => {
                    if (modalElement) {
                        console.log('Attempting to show modal...');
                        console.log('Modal current display:', modalElement.style.display);
                        console.log('Modal current classes:', modalElement.className);
                        
                        // Skip jQuery modal since it's not working
                        console.log('Skipping jQuery modal (not available)...');
                        
                        // Method 1: Try Bootstrap modal
                        if (typeof bootstrap !== 'undefined') {
                            console.log('Using Bootstrap modal...');
                            const modal = new bootstrap.Modal(modalElement);
                            modal.show();
                        } else {
                            console.log('Bootstrap not available, using manual method...');
                        }
                        
                        // Method 2: Manual modal show (always try this)
                        console.log('Using manual modal show...');
                        
                        // Force remove any conflicting styles
                        modalElement.style.display = 'block !important';
                        modalElement.style.visibility = 'visible';
                        modalElement.style.opacity = '1';
                        modalElement.classList.add('show');
                        modalElement.classList.remove('fade');
                        modalElement.setAttribute('aria-hidden', 'false');
                        document.body.classList.add('modal-open');
                        
                        // Add backdrop
                        const backdrop = document.createElement('div');
                        backdrop.className = 'modal-backdrop fade show';
                        backdrop.id = 'modal-backdrop';
                        backdrop.style.zIndex = '1040';
                        document.body.appendChild(backdrop);
                        
                        // Force modal to be visible
                        modalElement.style.zIndex = '1055';
                        
                        console.log('Modal should be visible now');
                        console.log('Modal final display:', modalElement.style.display);
                        console.log('Modal final classes:', modalElement.className);
                    } else {
                        console.error('Modal element not found!');
                    }
                }, 100);
            },
            eventDidMount: function(info) {
                // Add tooltip
                info.el.title = `${info.event.title}\nStatus: ${info.event.extendedProps.status || 'N/A'}${info.event.extendedProps.tracking_number ? '\nTracking #: ' + info.event.extendedProps.tracking_number : ''}`;
                
                // Add modal trigger attributes to the event element
                info.el.setAttribute('data-tw-toggle', 'modal');
                info.el.setAttribute('data-tw-target', '#appointmentModal');
                info.el.setAttribute('data-appointment-id', info.event.id);
            },
            dateClick: function(info) {
                console.log('Date clicked:', info.dateStr);
                // You can add functionality to create new appointment on date click
            },
            drop: function (info) {
                if (
                    $("#checkbox-events").length &&
                    $("#checkbox-events")[0].checked
                ) {
                    $(info.draggedEl).parent().remove();

                    if ($("#calendar-events").children().length == 1) {
                        $("#calendar-no-events").removeClass("hidden");
                    }
                }
            },
        });

        calendar.render();
        
        console.log('Calendar rendered successfully');
        console.log('Calendar events after render:', calendar.getEvents());
        
        // Handle view button clicks in sidebar
        document.querySelectorAll('[data-appointment-id]').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const appointmentId = this.getAttribute('data-appointment-id');
                console.log('View appointment:', appointmentId);
                
                // Find the appointment data
                const appointment = appointments.find(a => a.id == appointmentId);
                if (appointment) {
                    // Create a mock event object for the modal
                    const mockEvent = {
                        title: appointment.description,
                        start: new Date(appointment.appointment_date),
                        extendedProps: {
                            tracking_number: appointment.tracking_number,
                            remarks: appointment.remarks,
                            status: appointment.status,
                            is_expired: appointment.is_expired
                        }
                    };
                    loadAppointmentDetails(mockEvent);
                }
            });
        });
        
        console.log('Calendar initialized with', events.length, 'appointments');
        
        // Add modal close handlers
        initializeModalHandlers();
    }
})();


// Initialize modal handlers
function initializeModalHandlers() {
    // Close modal when clicking close button
    const closeButtons = document.querySelectorAll('#appointmentModal [data-tw-dismiss="modal"]');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAppointmentModal();
        });
    });
    
    // Close modal when clicking backdrop
    document.addEventListener('click', function(e) {
        if (e.target.id === 'appointmentModal' || e.target.id === 'modal-backdrop') {
            closeAppointmentModal();
        }
    });
}

// Function to close modal
function closeAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    const backdrop = document.getElementById('modal-backdrop');
    
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }
    
    if (backdrop) {
        backdrop.remove();
    }
}

// Function to load appointment details (similar to loadFeedbackDetails)
function loadAppointmentDetails(event) {
    const detailsContainer = document.getElementById('appointment-details');
    
    // Show loading state
    detailsContainer.innerHTML = `
        <div class="text-center text-slate-500 py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-lg">Loading appointment details...</p>
        </div>
    `;
    
    // Simulate loading delay (like your feedback system)
    setTimeout(() => {
        displayAppointmentDetails(event);
    }, 500);
}

// Function to display appointment details (similar to displayFeedbackDetails)
function displayAppointmentDetails(event) {
    const detailsContainer = document.getElementById('appointment-details');
    
    // Get status color
    const statusColor = getAppointmentStatusColor(event.extendedProps.status);
    
    detailsContainer.innerHTML = `
        <div class="px-6 py-8">
            <!-- Appointment Description -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Description</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 min-h-24">
                    ${event.title || 'No description provided'}
                </div>
            </div>
            
            <!-- Date -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Appointment Date</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                    ${event.start ? formatAppointmentDate(event.start) : 'N/A'}
                </div>
            </div>
            
            <!-- Status -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Status</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50">
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
                        ${event.extendedProps.status ? event.extendedProps.status.charAt(0).toUpperCase() + event.extendedProps.status.slice(1) : 'N/A'}
                    </span>
                </div>
            </div>
            
            <!-- Tracking Number -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Tracking Number</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                    ${event.extendedProps.tracking_number || 'N/A'}
                </div>
            </div>
            
            <!-- Is Expired -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Is Expired</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50">
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${event.extendedProps.is_expired === '1' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                        ${event.extendedProps.is_expired === '1' ? 'Yes' : 'No'}
                    </span>
                </div>
            </div>
            
            <!-- Remarks -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Remarks</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 min-h-20">
                    ${event.extendedProps.remarks || 'No remarks provided'}
                </div>
            </div>
        </div>
    `;
}

// Helper functions
function getAppointmentStatusColor(status) {
    switch(status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'approved': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-slate-100 text-slate-800';
    }
}

function formatAppointmentDate(date) {
    if (!date) return 'N/A';
    
    try {
        const appointmentDate = new Date(date);
        return appointmentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return date.toString();
    }
}
