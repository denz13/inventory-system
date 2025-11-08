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
    
    // Wait for Tailwind Modal to be available
    if (typeof tailwind === 'undefined' || !tailwind.Modal) {
        console.log('Waiting for Tailwind Modal...');
        setTimeout(checkAndInit, 100);
        return;
    }
    
    console.log('jQuery, FullCalendar, and Tailwind Modal loaded successfully');
    console.log('Tailwind Modal available:', typeof tailwind !== 'undefined' && typeof tailwind.Modal !== 'undefined');
    
    $(document).ready(function() {
        if ($("#calendar").length) {
        // Initialize modal early, before calendar is rendered
        const appointmentModal = document.getElementById('appointmentModal');
        if (appointmentModal && typeof tailwind !== 'undefined' && tailwind.Modal) {
            try {
                tailwind.Modal.getOrCreateInstance(appointmentModal);
                console.log('Appointment modal initialized before calendar render');
            } catch (error) {
                console.error('Error initializing modal early:', error);
            }
        }
        
        // Add modal close handlers early
        initializeModalHandlers();
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
                info.jsEvent.stopPropagation();
                
                // Show appointment details in modal
                const event = info.event;
                console.log('Appointment clicked:', event);
                console.log('Event title:', event.title);
                console.log('Event extendedProps:', event.extendedProps);
                console.log('Event ID:', event.id);
                
                // Load appointment details first
                loadAppointmentDetails(event);
                
                // Show the modal immediately
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
        
        // Modal is already initialized earlier, no need to re-initialize
        
        // Add click handler to all rendered events
        setTimeout(() => {
            const eventElements = document.querySelectorAll('.fc-event');
            console.log('Found event elements:', eventElements.length);
            eventElements.forEach((el, index) => {
                console.log(`Event ${index}:`, el);
            });
        }, 1000);
        
        // Handle view button clicks in sidebar (eye icon)
        // Store appointment ID when clicked, then load when modal shows
        if (appointmentModal) {
            
            // Store appointment ID when view button is clicked
            document.addEventListener('click', function(e) {
                const eyeIcon = e.target.closest('.view-appointment-btn');
                if (eyeIcon) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const appointmentId = eyeIcon.getAttribute('data-appointment-id');
                    console.log('Eye icon clicked, appointment ID:', appointmentId);
                    
                    // Store appointment ID in the modal for later use
                    appointmentModal.setAttribute('data-current-appointment-id', appointmentId);
                    console.log('Stored appointment ID:', appointmentId);
                    
                    // Manually trigger modal if data-tw-toggle didn't work
                    setTimeout(function() {
                        try {
                            if (typeof tailwind !== 'undefined' && tailwind.Modal) {
                                const modalInstance = tailwind.Modal.getOrCreateInstance(appointmentModal);
                                modalInstance.show();
                                console.log('Modal manually triggered');
                            } else {
                                console.error('Tailwind Modal not available');
                            }
                        } catch (error) {
                            console.error('Error showing modal:', error);
                        }
                    }, 50);
                }
            });
            
            // Load appointment details when modal shows
            appointmentModal.addEventListener('show.tw.modal', function() {
                const storedAppointmentId = appointmentModal.getAttribute('data-current-appointment-id');
                console.log('Modal show event triggered - appointment ID:', storedAppointmentId);
                
                if (storedAppointmentId) {
                    const appointment = appointments.find(a => a.id == storedAppointmentId);
                    console.log('Found appointment:', appointment);
                    
                    if (appointment) {
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
                    } else {
                        console.error('Appointment not found with ID:', storedAppointmentId);
                    }
                }
            });
        }
        
        console.log('Calendar initialized with', events.length, 'appointments');
    }
    });
})();


// Initialize modal handlers (simplified)
function initializeModalHandlers() {
    const modal = document.getElementById('appointmentModal');
    if (!modal) return;
    
    // Listen for modal hidden event and clean up backdrop
    modal.addEventListener('hidden.tw.modal', function() {
        console.log('Modal hidden event triggered');
        setTimeout(removeBackdrop, 100);
    });
    
    // Listen for when modal is shown to ensure proper state
    modal.addEventListener('show.tw.modal', function() {
        console.log('Modal show event triggered');
        document.body.classList.add('modal-open');
    });
}

// Function to show modal using Tailwind Modal (exact pattern from common.js)
function showAppointmentModal() {
    console.log('Showing appointment modal...');
    
    const el = document.querySelector('#appointmentModal');
    if (!el) {
        console.error('Modal element not found!');
        return;
    }
    
    // Check if modal is in DOM
    if (!document.body.contains(el)) {
        console.error('Modal is not in DOM!');
        // Try to append to body if not already there
        document.body.appendChild(el);
        console.log('Modal appended to body');
    }
    
    // Use exact pattern from common.js and show-modal.js
    if (typeof tailwind !== 'undefined' && tailwind.Modal) {
        try {
            const modal = tailwind.Modal.getOrCreateInstance(el);
            modal.show();
            console.log('Modal shown successfully');
            
            // Verify modal is visible after a short delay
            setTimeout(function() {
                const isVisible = el.classList.contains('show') || 
                                 window.getComputedStyle(el).display !== 'none';
                console.log('Modal visible check:', isVisible);
                console.log('Modal has show class:', el.classList.contains('show'));
                console.log('Modal display:', window.getComputedStyle(el).display);
                
                if (!isVisible) {
                    console.warn('Modal not visible, attempting manual show');
                    el.classList.add('show');
                    el.setAttribute('aria-hidden', 'false');
                    el.setAttribute('aria-modal', 'true');
                }
            }, 100);
        } catch (error) {
            console.error('Error showing modal:', error);
            // Fallback: try modal_show function
            if (typeof modal_show === 'function') {
                modal_show('appointmentModal');
                console.log('Modal shown via modal_show() fallback');
            }
        }
    } else if (typeof modal_show === 'function') {
        modal_show('appointmentModal');
        console.log('Modal shown via modal_show()');
    } else {
        console.error('Tailwind Modal not available!');
    }
}

// Function to close modal using Tailwind Modal (simplified)
function closeAppointmentModal() {
    console.log('Closing appointment modal...');
    
    const modal = document.getElementById('appointmentModal');
    if (!modal) {
        console.error('Modal element not found!');
        removeBackdrop();
        return;
    }
    
    // Use Tailwind Modal directly
    if (typeof tailwind !== 'undefined' && tailwind.Modal) {
        try {
            const modalInstance = tailwind.Modal.getOrCreateInstance(modal);
            modalInstance.hide();
            console.log('Modal closed via Tailwind Modal');
        } catch (error) {
            console.error('Error closing modal:', error);
        }
    } else if (typeof modal_hide === 'function') {
        modal_hide('appointmentModal');
        console.log('Modal closed via modal_hide()');
    } else {
        console.error('Tailwind Modal not available!');
    }
    
    // Clean up backdrop after a short delay
    setTimeout(removeBackdrop, 100);
}

// Function to remove backdrop and restore page functionality (simplified)
function removeBackdrop() {
    // Remove backdrop elements
    const backdrops = document.querySelectorAll('.modal-backdrop, [data-tw-backdrop], .backdrop');
    backdrops.forEach(backdrop => {
        if (backdrop && backdrop.parentNode) {
            backdrop.remove();
        }
    });
    
    // Remove modal-open class and restore scrolling
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('modal-open');
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.paddingRight = '';
    
    // Restore pointer events
    document.body.style.pointerEvents = '';
    document.documentElement.style.pointerEvents = '';
    
    console.log('Backdrop removed, page functionality restored');
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

// Function to display appointment details (exact copy of incident modal design)
function displayAppointmentDetails(event) {
    const detailsContainer = document.getElementById('appointment-details');
    
    console.log('Displaying appointment details for event:', event);
    console.log('Event extendedProps:', event.extendedProps);
    
    detailsContainer.innerHTML = `
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-6">
                <label class="form-label">User</label>
                <input type="text" class="form-control" value="${event.extendedProps.user_name || 'N/A'}" readonly>
            </div>
            <div class="col-span-12 md:col-span-6">
                <label class="form-label">Category</label>
                <input type="text" class="form-control" value="${event.extendedProps.category_name || 'N/A'}" readonly>
            </div>
            <div class="col-span-12 md:col-span-6">
                <label class="form-label">Appointment Date</label>
                <input type="text" class="form-control" value="${event.start ? formatAppointmentDate(event.start) : 'N/A'}" readonly>
            </div>
            <div class="col-span-12 md:col-span-6">
                <label class="form-label">Appointment Time</label>
                <input type="text" class="form-control" value="${event.extendedProps.time || 'N/A'}" readonly>
            </div>
            <div class="col-span-12 md:col-span-6">
                <label class="form-label">Status</label>
                <input type="text" class="form-control" value="${event.extendedProps.status ? event.extendedProps.status.charAt(0).toUpperCase() + event.extendedProps.status.slice(1) : 'N/A'}" readonly>
            </div>
            <div class="col-span-12 md:col-span-6">
                <label class="form-label">Tracking Number</label>
                <input type="text" class="form-control" value="${event.extendedProps.tracking_number || 'N/A'}" readonly>
            </div>
            <div class="col-span-12">
                <label class="form-label">Description</label>
                <textarea class="form-control" rows="3" readonly>${event.title || 'No description provided'}</textarea>
            </div>
            ${event.extendedProps.remarks ? `
            <div class="col-span-12">
                <label class="form-label">Remarks</label>
                <textarea class="form-control" rows="3" readonly>${event.extendedProps.remarks}</textarea>
            </div>
            ` : ''}
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
