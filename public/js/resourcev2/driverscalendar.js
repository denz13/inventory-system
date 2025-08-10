document.addEventListener('DOMContentLoaded', function() {
    let calendar;
    let currentDriverId = null;

    // Initialize calendar
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: function(info, successCallback, failureCallback) {
            if (!currentDriverId) {
                successCallback([]);
                return;
            }

            fetch(`/resource/driver/${currentDriverId}/schedules`)
                .then(response => response.json())
                .then(result => {
                    if (result.status === 'success') {
                        successCallback(result.data);
                    } else {
                        failureCallback(result.message);
                    }
                })
                .catch(error => {
                    console.error('Error fetching schedules:', error);
                    failureCallback(error);
                });
        },
        eventClick: function(info) {
            const event = info.event;
            const props = event.extendedProps;

            // Update modal content
            document.getElementById('modalDestination').textContent = props.destination || 'N/A';
            document.getElementById('modalPurpose').textContent = props.purpose || 'N/A';
            document.getElementById('modalPassId').textContent = props.passId || 'N/A';
            document.getElementById('modalOffice').textContent = props.office || 'N/A';
            document.getElementById('modalStartDate').textContent = props.startDate || 'N/A';
            document.getElementById('modalEndDate').textContent = props.endDate || 'N/A';
            document.getElementById('modalPassengers').textContent = props.passengers || 'No passengers';

            // Show modal using Tailwind
            const modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#scheduleModal"));
            modal.show();
        }
    });
    calendar.render();

    // Function to load driver's schedule
    window.loadDriverSchedule = function(driverId) {
        // Remove active class from all items
        document.querySelectorAll('.event').forEach(item => {
            item.classList.remove('bg-slate-100');
        });

        // Add active class to clicked item
        const clickedItem = document.querySelector(`[data-driver-id="${driverId}"]`);
        if (clickedItem) {
            clickedItem.classList.add('bg-slate-100');
        }

        // Update current driver ID and refresh calendar
        currentDriverId = driverId;
        calendar.refetchEvents();

        // Show loading spinner
        const spinner = document.getElementById('loading-spinner');
        if (spinner) spinner.style.display = 'block';

        // Update schedules list
        fetch(`/resource/driver/${driverId}/schedules`)
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    // Update the calendar events
                    calendar.refetchEvents();
                }
            })
            .catch(error => {
                console.error('Error loading driver schedule:', error);
            })
            .finally(() => {
                // Hide loading spinner
                if (spinner) spinner.style.display = 'none';
            });
    };

    // Set initial driver if available
    const firstDriver = document.querySelector('.event');
    if (firstDriver) {
        const driverId = firstDriver.getAttribute('data-driver-id');
        if (driverId) {
            loadDriverSchedule(driverId);
        }
    }
});

function updateScheduleList(schedules) {
    const schedulesList = document.getElementById('schedulesList');
    if (!schedulesList) return;

    let html = '';
    if (schedules.length > 0) {
        schedules.forEach(schedule => {
            const statusClass = {
                'pending': 'bg-warning',
                'approved': 'bg-success',
                'rejected': 'bg-danger'
            }[schedule.extendedProps.status.toLowerCase()] || 'bg-slate-500';

            html += `
                <div class="intro-x cursor-pointer box relative flex items-center p-5 mt-5">
                    <div class="ml-2 overflow-hidden flex-1">
                        <div class="flex items-center">
                            <div class="font-medium text-base">${schedule.title}</div>
                            <div class="w-2 h-2 ${statusClass} rounded-full ml-3"></div>
                        </div>
                        <div class="text-xs text-slate-500">
                            ${schedule.extendedProps.driver_name || 'No Driver Assigned'}
                        </div>
                        <div class="text-xs text-primary mt-1">
                            ${moment(schedule.start).format('MMM DD, YYYY h:mm A')}
                        </div>
                        <div class="text-slate-500 mt-1">
                            ${schedule.extendedProps.purpose}
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        html = '<div class="text-slate-500 p-3 text-center">No schedules available</div>';
    }
    schedulesList.innerHTML = html;
}
