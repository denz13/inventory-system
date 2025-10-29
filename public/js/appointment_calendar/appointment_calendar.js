// Using global FullCalendar from CDN
// Wait for jQuery and FullCalendar to be available
(function checkAndInit() {
    if (typeof jQuery === 'undefined' || typeof $ === 'undefined') {
        console.log('Waiting for jQuery...');
        setTimeout(checkAndInit, 100);
        return;
    }
    
    if (typeof FullCalendar === 'undefined') {
        console.log('Waiting for FullCalendar...');
        setTimeout(checkAndInit, 100);
        return;
    }
    
    // Wait for common.js to be loaded
    if (typeof modal_show === 'undefined' || typeof modal_hide === 'undefined') {
        console.log('Waiting for common.js (modal_show, modal_hide functions)...');
        setTimeout(checkAndInit, 100);
        return;
    }
    
    console.log('jQuery, FullCalendar, and common.js loaded successfully');
    console.log('modal_show function available:', typeof modal_show === 'function');
    console.log('modal_hide function available:', typeof modal_hide === 'function');
    
    $(document).ready(function() {
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
                    user_name: appointment.user_name,
                    category_name: appointment.category_name,
                    time: appointment.time
                }
            };
        }).filter(event => event !== null); // Remove null entries
        
       
        // Initialize draggable for sidebar events (if FullCalendar.Draggable exists)
        if ($("#calendar-events").length && typeof FullCalendar !== 'undefined' && FullCalendar.Draggable) {
            new FullCalendar.Draggable($("#calendar-events")[0], {
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

        let calendar = new FullCalendar.Calendar($("#calendar")[0], {
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
                // Prevent default behavior
                info.jsEvent.preventDefault();
                
                // Show appointment details in modal
                const event = info.event;
                console.log('Appointment clicked:', event);
                console.log('Event title:', event.title);
                console.log('Event extendedProps:', event.extendedProps);
                console.log('Event ID:', event.id);
                
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
        console.log('Total events loaded:', calendar.getEvents().length);
        
        // Add click handler to all rendered events
        setTimeout(() => {
            const eventElements = document.querySelectorAll('.fc-event');
            console.log('Found event elements:', eventElements.length);
            eventElements.forEach((el, index) => {
                console.log(`Event ${index}:`, el);
            });
        }, 1000);
        
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
                            user_name: appointment.user_name,
                            category_name: appointment.category_name,
                            time: appointment.time
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
        
        // Add modal close handlers
        initializeModalHandlers();
    }
    });
})();


// Initialize modal handlers
function initializeModalHandlers() {
    // Close modal when clicking close button
    const closeButtons = document.querySelectorAll('#appointmentModal [data-tw-dismiss="modal"]');
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            closeAppointmentModal();
        });
    });
    
    // Close modal when clicking backdrop
    const modal = document.getElementById('appointmentModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            // Close only if clicking the modal backdrop, not the modal content
            if (e.target === modal) {
                closeAppointmentModal();
            }
        });
        
        // Listen for modal hidden event
        modal.addEventListener('hidden.tw.modal', function() {
            console.log('Modal hidden');
        });
    }
    
    // Also handle backdrop clicks
    document.addEventListener('click', function(e) {
        if (e.target.id === 'modal-backdrop') {
            closeAppointmentModal();
        }
    });
}

// Function to show modal using the project's common modal_show function
function showAppointmentModal() {
    console.log('Showing appointment modal...');
    
    // Use the project's common modal_show function from common.js
    if (typeof modal_show === 'function') {
        modal_show('appointmentModal');
        console.log('Modal displayed successfully via modal_show()');
    } else {
        console.error('modal_show function not found! Make sure common.js is loaded.');
    }
}

// Function to close modal using the project's common modal_hide function
function closeAppointmentModal() {
    console.log('Closing appointment modal...');
    
    // Use the project's common modal_hide function from common.js
    if (typeof modal_hide === 'function') {
        modal_hide('appointmentModal');
        console.log('Modal closed successfully via modal_hide()');
    } else {
        console.error('modal_hide function not found! Make sure common.js is loaded.');
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

// Function to display appointment details (similar to displayFeedbackDetails)
function displayAppointmentDetails(event) {
    const detailsContainer = document.getElementById('appointment-details');
    
    console.log('Displaying appointment details for event:', event);
    console.log('Event extendedProps:', event.extendedProps);
    
    // Get status color
    const statusColor = getAppointmentStatusColor(event.extendedProps.status);
    
    detailsContainer.innerHTML = `
        <div class="px-6 py-8">
            <!-- User Name -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">User</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                    ${event.extendedProps.user_name || 'N/A'}
                </div>
            </div>
            
            <!-- Category Name -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Category</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                    ${event.extendedProps.category_name || 'N/A'}
                </div>
            </div>
            
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
            
            <!-- Time -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Appointment Time</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                    ${event.extendedProps.time || 'N/A'}
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
            
            <!-- Remarks -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Remarks</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 min-h-20">
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
