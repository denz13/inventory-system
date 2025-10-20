import "@fullcalendar/core/vdom";
import { Calendar } from "@fullcalendar/core";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

(function () {
    if ($("#calendar").length) {
        // Get appointments data from window object (passed from Blade)
        let appointments = window.appointmentsData || [];
        
        console.log('Raw appointments data:', appointments);
        console.log('Appointments type:', typeof appointments);
        console.log('Is array:', Array.isArray(appointments));
        console.log('Appointments length:', appointments.length);
        
        // Ensure appointments is a proper array of objects
        if (Array.isArray(appointments) && appointments.length > 0) {
            console.log('First appointment sample:', appointments[0]);
            console.log('First appointment type:', typeof appointments[0]);
            console.log('First appointment keys:', Object.keys(appointments[0]));
        }
        
        // Format appointments for FullCalendar
        const events = appointments.map(appointment => {
            console.log('Processing appointment:', appointment);
            
            // Check if appointment is a valid object
            if (!appointment || typeof appointment !== 'object') {
                console.error('Invalid appointment object:', appointment);
                return null;
            }
            
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
        }).filter(event => event !== null); // Remove null entries

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
                
                // Load appointment details
                loadAppointmentDetails(event);
                
                // Show the modal
                showAppointmentModal();
            },
            eventDidMount: function(info) {
                // Add tooltip
                info.el.title = `${info.event.title}\nStatus: ${info.event.extendedProps.status || 'N/A'}${info.event.extendedProps.tracking_number ? '\nTracking #: ' + info.event.extendedProps.tracking_number : ''}`;
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
                console.log('Found appointment:', appointment);
                
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
                    
                    console.log('Created mock event:', mockEvent);
                    
                    // Load appointment details
                    loadAppointmentDetails(mockEvent);
                    
                    // Show the modal
                    showAppointmentModal();
                } else {
                    console.error('Appointment not found with ID:', appointmentId);
                }
            });
        });
        
        console.log('Calendar initialized with', events.length, 'appointments');
        
        // Add modal close handlers with a small delay to ensure DOM is ready
        setTimeout(() => {
            initializeModalHandlers();
        }, 100);
    }
})();

// Initialize modal handlers
function initializeModalHandlers() {
    console.log('Initializing modal handlers...');
    
    // Use event delegation for close buttons (works even if modal is dynamically shown)
    document.addEventListener('click', function(e) {
        // Check if clicked element has data-tw-dismiss="modal" attribute
        if (e.target.hasAttribute('data-tw-dismiss') && e.target.getAttribute('data-tw-dismiss') === 'modal') {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked via delegation');
            closeAppointmentModal();
            return;
        }
        
        // Check if clicked element is inside a close button
        const closeButton = e.target.closest('[data-tw-dismiss="modal"]');
        if (closeButton) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked via closest');
            closeAppointmentModal();
            return;
        }
        
        // Close modal when clicking backdrop
        const modal = document.getElementById('appointmentModal');
        const backdrop = document.getElementById('modal-backdrop');
        
        if (modal && modal.classList.contains('show')) {
            // Check if click is on modal backdrop or backdrop element
            if (e.target === modal || e.target === backdrop) {
                console.log('Backdrop clicked');
                closeAppointmentModal();
            }
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('appointmentModal');
            if (modal && modal.classList.contains('show')) {
                console.log('Escape key pressed');
                closeAppointmentModal();
            }
        }
    });
    
    console.log('Modal handlers initialized');
}

// Function to show modal
function showAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    
    if (modal) {
        console.log('Showing appointment modal...');
        
        // Force remove any conflicting styles
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.classList.add('show');
        modal.classList.remove('fade');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        
        // Add backdrop if it doesn't exist
        let backdrop = document.getElementById('modal-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.id = 'modal-backdrop';
            backdrop.style.zIndex = '1040';
            document.body.appendChild(backdrop);
        }
        
        // Force modal to be visible
        modal.style.zIndex = '1055';
        
        console.log('Modal displayed successfully');
    } else {
        console.error('Modal element not found!');
    }
}

// Function to close modal
function closeAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    const backdrop = document.getElementById('modal-backdrop');
    
    console.log('Closing modal...');
    
    if (modal) {
        // Remove show class and add fade class
        modal.classList.remove('show');
        modal.classList.add('fade');
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        modal.setAttribute('aria-hidden', 'true');
        
        // Remove modal-open class from body
        document.body.classList.remove('modal-open');
        
        // Remove any inline styles that might prevent closing
        modal.style.zIndex = '';
        
        console.log('Modal closed successfully');
    }
    
    if (backdrop) {
        backdrop.remove();
        console.log('Backdrop removed');
    }
    
    // Also remove any other potential backdrops
    const allBackdrops = document.querySelectorAll('.modal-backdrop');
    allBackdrops.forEach(backdrop => {
        backdrop.remove();
    });
}

// Function to load appointment details
function loadAppointmentDetails(event) {
    const detailsContainer = document.getElementById('appointment-details');
    
    // Show loading state
    detailsContainer.innerHTML = `
        <div class="text-center text-slate-500 py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p class="text-base">Loading appointment details...</p>
        </div>
    `;
    
    // Display details immediately (remove artificial delay)
    try {
        displayAppointmentDetails(event);
    } catch (error) {
        console.error('Error displaying appointment details:', error);
        detailsContainer.innerHTML = `
            <div class="text-center text-red-500 py-12">
                <p class="text-lg">Error loading appointment details</p>
                <p class="text-sm">${error.message}</p>
            </div>
        `;
    }
}

// Function to display appointment details
function displayAppointmentDetails(event) {
    const detailsContainer = document.getElementById('appointment-details');
    
    console.log('Displaying appointment details for event:', event);
    console.log('Event extendedProps:', event.extendedProps);
    
    // Get status color
    const statusColor = getAppointmentStatusColor(event.extendedProps.status);
    
    detailsContainer.innerHTML = `
        <div class="text-left">
            <!-- Appointment Description -->
            <div class="mb-4">
                <label class="form-label text-sm font-semibold text-slate-700">Description</label>
                <div class="form-control mt-1 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 min-h-16">
                    ${event.title || 'No description provided'}
                </div>
            </div>
            
            <!-- Two Column Layout -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <!-- Date -->
                <div>
                    <label class="form-label text-sm font-semibold text-slate-700">Appointment Date</label>
                    <div class="form-control mt-1 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                        ${event.start ? formatAppointmentDate(event.start) : 'N/A'}
                    </div>
                </div>
                
                <!-- Status -->
                <div>
                    <label class="form-label text-sm font-semibold text-slate-700">Status</label>
                    <div class="form-control mt-1 p-3 border border-slate-300 rounded-lg bg-slate-50">
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
                            ${event.extendedProps.status ? event.extendedProps.status.charAt(0).toUpperCase() + event.extendedProps.status.slice(1) : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
            
            <!-- Two Column Layout -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <!-- Tracking Number -->
                <div>
                    <label class="form-label text-sm font-semibold text-slate-700">Tracking Number</label>
                    <div class="form-control mt-1 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                        ${event.extendedProps.tracking_number || 'N/A'}
                    </div>
                </div>
                
                <!-- Is Expired -->
                <div>
                    <label class="form-label text-sm font-semibold text-slate-700">Is Expired</label>
                    <div class="form-control mt-1 p-3 border border-slate-300 rounded-lg bg-slate-50">
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${event.extendedProps.is_expired === '1' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                            ${event.extendedProps.is_expired === '1' ? 'Yes' : 'No'}
                        </span>
                    </div>
                </div>
            </div>
            
            <!-- Remarks -->
            <div class="mb-4">
                <label class="form-label text-sm font-semibold text-slate-700">Remarks</label>
                <div class="form-control mt-1 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 min-h-16">
                    ${event.extendedProps.remarks || 'No remarks provided'}
                </div>
            </div>
        </div>
    `;
    
    console.log('Appointment details displayed successfully');
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
