    $(document).ready(function() {
        // Set up CSRF token for all AJAX requests
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        // Load schedules when page loads
        loadSchedules();

        // Search functionality
        let searchTimeout;
        $('#search').on('keyup', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(loadSchedules, 500);
        });

        // Update schedule functionality
        $(document).on('click', '.update-schedule', function(e) {
            e.preventDefault();
            const controlNo = $(this).data('control-no');
            
            console.log('Control No:', controlNo); // Debug log
            
            // Get current schedule data
            $.ajax({
                url: `/resource-v2/get-schedule/${controlNo}`,
                method: 'GET',
                success: function(response) {
                    if (response.status === 'success') {
                        const schedule = response.data;
                        console.log('Schedule data:', schedule); // Debug log
                        
                        // Initialize select2 dropdowns first
                        initializeSelect2Dropdowns();
                        
                        // Populate charge_to with current value and text
                        $('#update-modal #charge_to').append(new Option(schedule.charge_to_name, schedule.charge_to, true, true)).trigger('change');
                        
                        // Populate office with current value and text
                        $('#update-modal #office').append(new Option(schedule.office_name, schedule.office, true, true)).trigger('change');
                        
                        // Populate driver with current value and text
                        $('#update-modal #driver').append(new Option(schedule.driver_name, schedule.driver, true, true)).trigger('change');
                        
                        console.log('Full schedule data:', schedule); // Debug log to see all data
                        
                        // Set other field values
                        $('#update-modal #schedule_id').val(controlNo);
                        $('#update-modal #destination').val(schedule.destination);
                        $('#update-modal #start_datetime').val(moment(schedule.start_datetime).format('YYYY-MM-DDTHH:mm'));
                        $('#update-modal #end_datetime').val(moment(schedule.end_datetime).format('YYYY-MM-DDTHH:mm'));
                        $('#update-modal #reason').val(schedule.reason);
                        
                        // Set resource
                        $('#update-modal #add_resource_id').append(new Option(schedule.resource_name, schedule.add_resource_id, true, true)).trigger('change');
                        
                        // Handle passengers
                        if (schedule.passengers && schedule.passengers.length > 0) {
                            // Clear existing options
                            $('#update-modal #passengers').empty();
                            
                            // Add each passenger as an option
                            schedule.passengers.forEach(function(passenger) {
                                const option = new Option(passenger.name, passenger.id, true, true);
                                $('#update-modal #passengers').append(option);
                            });
                            $('#update-modal #passengers').trigger('change');
                        }
                        
                        // Show modal
                        const modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#update-modal'));
                        modal.show();
                    } else {
                        // Show error modal
                        $('#error-message').text(response.message || 'Failed to load schedule details');
                        const errorModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#error-modal'));
                        errorModal.show();
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    // Show error modal
                    $('#error-message').text('Failed to load schedule details: ' + error);
                    const errorModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#error-modal'));
                    errorModal.show();
                }
            });
        });

        // Handle update form submission
        $('#update-schedule-form').on('submit', function(e) {
            e.preventDefault();
            
            // Get the selected data from select2 dropdowns
            const driverSelect = $('#update-modal #driver');
            const driverData = driverSelect.select2('data')[0];
            const driverId = driverData ? driverData.id : null;

            const officeSelect = $('#update-modal #office');
            const officeData = officeSelect.select2('data')[0];
            const officeId = officeData ? officeData.id : null;

            const formData = {
                control_no: $('#update-modal #schedule_id').val(),
                charge_to: $('#update-modal #charge_to').val(),
                office: officeId,
                driver: driverId,
                destination: $('#update-modal #destination').val(),
                start_datetime: $('#update-modal #start_datetime').val(),
                end_datetime: $('#update-modal #end_datetime').val(),
                reason: $('#update-modal #reason').val(),
                add_resource_id: $('#update-modal #add_resource_id').val(),
                passengers: $('#update-modal #passengers').val(),
                _token: $('meta[name="csrf-token"]').attr('content')
            };
            
            console.log('Submitting update with data:', formData);

            // Disable submit button and show loading state
            const submitBtn = $(this).find('button[type="submit"]');
            submitBtn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Updating...');

            $.ajax({
                url: '/resource-v2/update-schedule',
                method: 'POST',
                data: formData,
                success: function(response) {
                    if (response.status === 'success') {
                        // Hide update modal
                        const updateModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#update-modal'));
                        updateModal.hide();
                        
                        // Show success modal
                        $('#success-message').text(response.message || 'Schedule updated successfully');
                        const successModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#success-modal'));
                        successModal.show();
                        
                        // Refresh schedule list after delay
                        setTimeout(() => {
                            loadSchedules();
                        }, 1500);
                    } else {
                        // Show error modal
                        $('#error-message').text(response.message || 'Failed to update schedule');
                        const errorModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#error-modal'));
                        errorModal.show();
                    }
                },
                error: function(xhr) {
                    const errors = xhr.responseJSON?.errors;
                    let errorMessage = 'Failed to update schedule:\n';
                    if (errors) {
                        errorMessage += Object.values(errors).flat().join('\n');
                    } else {
                        errorMessage += xhr.responseJSON?.message || 'Unknown error occurred';
                    }
                    
                    // Show error modal
                    $('#error-message').text(errorMessage);
                    const errorModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#error-modal'));
                    errorModal.show();
                },
                complete: function() {
                    // Re-enable submit button
                    submitBtn.prop('disabled', false).text('Update');
                }
            });
        });

        // Function to initialize select2 dropdowns
        function initializeSelect2Dropdowns() {
            // First destroy any existing select2 instances
            $('#update-modal select').each(function() {
                if ($(this).data('select2')) {
                    $(this).select2('destroy');
                }
            });

            // Initialize regular dropdowns
            $('#update-modal #charge_to, #update-modal #office, #update-modal #driver, #update-modal #add_resource_id').each(function() {
                $(this).select2({
                    dropdownParent: $('#update-modal'),
                    placeholder: 'Select option',
                    allowClear: true,
                    width: '100%'
                });
            });

            // Initialize passengers dropdown with special configuration
            $('#update-modal #passengers').select2({
                dropdownParent: $('#update-modal'),
                placeholder: 'Select Passengers',
                allowClear: true,
                multiple: true,
                width: '100%',
                templateResult: function(data) {
                    if (!data.id) return data.text;
                    return $('<span>' + data.text + '</span>');
                }
            });
        }

        // Initialize select2 when document is ready
        initializeSelect2Dropdowns();

        // Add this at the top of the file, after document.ready
        $(document).on('click', '.delete-schedule', function(e) {
            e.preventDefault();
            scheduleIdToCancel = $(this).data('control-no');
            const modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#delete-confirmation-modal"));
            modal.show();
        });

        // Handle delete confirmation
        $(document).on('click', '#confirm-cancel', function() {
            if (!scheduleIdToCancel) return;

            // Show loading state
            const $btn = $(this);
            $btn.prop('disabled', true);
            $btn.html('<i data-loading-icon="oval" class="w-4 h-4 mr-2"></i>Cancelling...');

            $.ajax({
                url: `/resource-v2/cancel-schedule/${scheduleIdToCancel}`,
                type: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    if (response.status === 'success') {
                        // Hide delete modal
                        const deleteModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete-confirmation-modal'));
                        deleteModal.hide();
                        
                        // Show success modal
                        $('#success-message').text(response.message);
                        const successModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#success-modal'));
                        successModal.show();
                        
                        // Reload schedules after a short delay
                        setTimeout(() => {
                            loadSchedules();
                        }, 1500);
                    } else {
                        // Show error modal
                        $('#error-message').text(response.message || 'Failed to cancel schedule');
                        const errorModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#error-modal'));
                        errorModal.show();
                    }
                },
                error: function(xhr) {
                    // Show error modal
                    const errorMessage = xhr.responseJSON?.message || 'Failed to cancel schedule';
                    $('#error-message').text(errorMessage);
                    const errorModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#error-modal'));
                    errorModal.show();
                    console.error('Cancel error:', xhr);
                },
                complete: function() {
                    // Reset button state
                    $btn.prop('disabled', false);
                    $btn.html('Yes');
                    
                    // Reset the schedule ID
                    scheduleIdToCancel = null;
                }
            });
        });

        // Reset scheduleIdToCancel when modal is hidden
        $('#delete-confirmation-modal').on('hidden.bs.modal', function() {
            scheduleIdToCancel = null;
            // Reset button state
            const $btn = $('#confirm-cancel');
            $btn.prop('disabled', false);
            $btn.html('Yes');
        });
    });

    function loadSchedules() {
        $.ajax({
            url: '/resource-v2/my-schedules',
            method: 'GET',
            beforeSend: function() {
                // Show loading state
                $('#schedules-container').html(`
                    <div class="col-span-12 text-center">
                        <div class="flex justify-center">
                            <i data-loading-icon="oval" class="w-8 h-8"></i>
                        </div>
                    </div>
                `);
                // Clear entries info while loading
                $('#entries-info').text('Loading...');
            },
            success: function(response) {
                if (response.status === 'success') {
                    displaySchedules(response.schedules);
                    updateEntriesInfo(response.schedules.length);
                } else {
                    showError('Failed to load schedules');
                }
            },
            error: function(xhr, status, error) {
                showError('Error loading schedules: ' + error);
            }
        });
    }

    function displaySchedules(schedules) {
        const container = $('#schedules-container');
        container.empty();

        if (!schedules || schedules.length === 0) {
            container.html(`
                <div class="col-span-12 text-center">
                    <div class="p-5">No schedules found</div>
                </div>
            `);
            return;
        }

        schedules.forEach(function(schedule) {
            const template = document.querySelector('#schedule-card-template');
            const clone = document.importNode(template.content, true);

            // Set schedule data
            // Get profile image
            $.get(`/resource-v2/get-profile-image/${schedule.requested_by}`, function(response) {
                $(clone).find('.schedule-image').attr('src', response.image_url);
            });
            
            $(clone).find('.schedule-serial').text(schedule.serial_no);
            $(clone).find('.schedule-category').text(schedule.category);
            $(clone).find('.schedule-requested-by').text(schedule.requested_by);
            $(clone).find('.schedule-requested-date').text(schedule.requested_date);
            $(clone).find('.schedule-status').text(schedule.status.toUpperCase());
            $(clone).find('.schedule-title').text(schedule.control_no);
            $(clone).find('.schedule-resource').text(schedule.resource || 'N/A');
            $(clone).find('.schedule-start').text(schedule.start_datetime);
            $(clone).find('.schedule-end').text(schedule.end_datetime);
            $(clone).find('.schedule-status-text').text(schedule.status);
            
            // Add the missing data
            $(clone).find('.schedule-destination').text(schedule.destination || 'N/A');
            $(clone).find('.schedule-driver').text(schedule.driver || 'N/A');
            $(clone).find('.schedule-passengers').text(schedule.passengers || 'N/A');
            $(clone).find('.schedule-office').text(schedule.office || 'N/A');

            // Add status-specific styling
            const statusSpan = $(clone).find('.schedule-status');
            const viewDetailsBtn = $(clone).find('.preview-schedule');
            const updateBtn = $(clone).find('.update-schedule');
            const deleteBtn = $(clone).find('.delete-schedule');
            
            switch(schedule.status.toLowerCase()) {
                case 'approved':
                    statusSpan.addClass('bg-primary/80');
                    updateBtn.hide();
                    deleteBtn.hide();
                    $(clone).find('.text-slate-600').addClass('text-xs'); // Make text smaller for released status
                    break;
                case 'rejected':
                    statusSpan.addClass('bg-primary/80');
                    updateBtn.hide();
                    deleteBtn.hide();
                    $(clone).find('.text-slate-600').addClass('text-xs'); // Make text smaller for released status
                    break;
                case 'cancelled':
                    statusSpan.addClass('bg-danger/80');
                    updateBtn.hide();
                    deleteBtn.hide();
                    $(clone).find('.text-slate-600').addClass('text-xs'); // Make text smaller for released status
                    break;
                case 'released':
                    statusSpan.addClass('bg-primary/80');
                    updateBtn.hide();
                    deleteBtn.hide();
                    $(clone).find('.text-slate-600').addClass('text-xs'); // Make text smaller for released status
                    break;
                default: // pending
                    statusSpan.addClass('bg-primary/80');
                    updateBtn.show();
                    deleteBtn.show();
            }

            // Store schedule data in data attributes
            $(clone).find('.preview-schedule').attr('data-schedule-id', schedule.control_no);
            $(clone).find('.update-schedule').attr('data-control-no', schedule.control_no);
            $(clone).find('.delete-schedule').attr('data-control-no', schedule.control_no);
            $(clone).find('.print-trip-ticket').attr('data-control-no', schedule.control_no);

            // Add event listeners
            $(clone).find('.preview-schedule').on('click', function() {
                const scheduleId = $(this).data('schedule-id');
                previewSchedule(scheduleId);
            });
            $(clone).find('.print-trip-ticket').on('click', function() {
                const controlNo = $(this).data('control-no');
                console.log('Trip ticket button clicked, control no:', controlNo);
                printTripTicket(controlNo);
            });
            $(clone).find('.edit-schedule').on('click', () => editSchedule(schedule.control_no));
            $(clone).find('.delete-schedule').on('click', () => deleteSchedule(schedule.control_no));

            container.append(clone);
        });
    }

    function updateEntriesInfo(count) {
        $('#entries-info').text(`Showing ${count} schedule${count !== 1 ? 's' : ''}`);
    }

    function getResourceImage(resourceId) {
        // TODO: Replace with actual resource images
        return '/dist/images/preview-' + ((resourceId % 15) + 1) + '.jpg';
    }

    function formatDateTime(datetime) {
        return moment(datetime).format('MMM D, YYYY h:mm A');
    }

    function previewSchedule(id) {
        console.log('Preview schedule called with ID:', id);
        $.ajax({
            url: `/resource-v2/get-schedule/${id}`,
            method: 'GET',
            success: function(response) {
                console.log('Response received:', response);
                
                if (!response.data) {
                    console.error('No data in response');
                    return;
                }

                // Populate modal fields
                $('.modal-requested-by').text(response.data.requested_by || 'N/A');
                $('.modal-requested-date').text(response.data.created_at ? moment(response.data.created_at).format('MMMM D, YYYY h:mm A') : 'N/A');
                $('.modal-start').text(response.data.start_datetime ? moment(response.data.start_datetime).format('MMMM D, YYYY h:mm A') : 'N/A');
                $('.modal-end').text(response.data.end_datetime ? moment(response.data.end_datetime).format('MMMM D, YYYY h:mm A') : 'N/A');
                $('.modal-destination').text(response.data.destination || 'N/A');
                $('.modal-driver').text(response.data.driver_name || 'N/A');
                $('.modal-charged-to').text(response.data.charge_to_name || 'N/A');
                $('.modal-office').text(response.data.office_name || 'N/A');

                // Get and set profile image
                if (response.data.requested_by_id) {
                    $.get(`/resource-v2/get-profile-image/${response.data.requested_by_id}`, function(imageResponse) {
                        if (imageResponse && imageResponse.image_url) {
                            $('.modal-profile-image').attr('src', imageResponse.image_url);
                        }
                    }).fail(function() {
                        // Set default image if request fails
                        $('.modal-profile-image').attr('src', '/img/default-avatar.png');
                    });
                } else {
                    $('.modal-profile-image').attr('src', '/img/default-avatar.png');
                }

                // Populate passengers list
                const passengersContainer = $('.modal-passengers');
                passengersContainer.empty();
                
                if (response.data.passengers && response.data.passengers.length > 0) {
                    const passengersList = $('<div class="space-y-2"></div>');
                    response.data.passengers.forEach(function(passenger) {
                        $.get(`/resource-v2/get-profile-image/${passenger.id}`, function(imageResponse) {
                            const passengerItem = $(`
                                <div class="flex items-center">
                                    <img src="${imageResponse.image_url}" class="w-8 h-8 rounded-full mr-2" alt="Passenger Image">
                                    <span class="text-slate-600">${passenger.name}</span>
                                </div>
                            `);
                            passengersList.append(passengerItem);
                        }).fail(function() {
                            // Add passenger without image if image request fails
                            const passengerItem = $(`
                                <div class="flex items-center">
                                    <img src="/img/default-avatar.png" class="w-8 h-8 rounded-full mr-2" alt="Passenger Image">
                                    <span class="text-slate-600">${passenger.name}</span>
                                </div>
                            `);
                            passengersList.append(passengerItem);
                        });
                    });
                    passengersContainer.append(passengersList);
                } else {
                    passengersContainer.html('<div class="text-slate-500">No passengers</div>');
                }

                // Show the modal
                const modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#schedule-details-modal"));
                modal.show();
            },
            error: function(error) {
                console.error('Error fetching schedule details:', error);
                console.error('Error response:', error.responseJSON);
            }
        });
    }

    function editSchedule(id) {
        // TODO: Implement edit functionality
        console.log('Edit schedule:', id);
    }

    function deleteSchedule(id) {
        // Show confirmation modal
        const modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#delete-confirmation-modal"));
        modal.show();

        // Remove any existing click handlers
        $(document).off('click', '#confirm-cancel');

        // Add new click handler using event delegation
        $(document).on('click', '#confirm-cancel', function() {
            // Disable the button and show loading state
            const $btn = $(this);
            $btn.prop('disabled', true);
            $btn.html('<i data-loading-icon="oval" class="w-4 h-4 mr-2"></i>Cancelling...');
            
            $.ajax({
                url: `/resource-v2/cancel-schedule/${id}`,
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    if (response.status === 'success') {
                        // Hide delete modal
                        modal.hide();
                        
                        // Show success modal
                        $('#success-message').text(response.message || 'Schedule cancelled successfully');
                        const successModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#success-modal'));
                        successModal.show();
                        
                        // Refresh schedule list after delay
                        setTimeout(() => {
                            loadSchedules();
                        }, 1500);
                    } else {
                        // Show error modal
                        $('#error-message').text(response.message || 'Failed to cancel schedule');
                        const errorModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#error-modal'));
                        errorModal.show();
                    }
                },
                error: function(xhr) {
                    // Show error modal
                    const errorMessage = xhr.responseJSON?.message || 'Failed to cancel schedule';
                    $('#error-message').text(errorMessage);
                    const errorModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#error-modal'));
                    errorModal.show();
                    console.error('Cancel error:', xhr);
                },
                complete: function() {
                    // Reset button state
                    $btn.prop('disabled', false);
                    $btn.html('Yes');
                    
                    // Remove the click handler
                    $(document).off('click', '#confirm-cancel');
                }
            });
        });
    }

    function showError(message) {
        // Show error modal instead of console.error
        $('#error-message').text(message);
        const errorModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#error-modal'));
        errorModal.show();
    }

    function printTripTicket(controlNo) {
        console.log('Print trip ticket for control number:', controlNo);
        console.log('Trip ticket function called successfully');
        
        if (!controlNo) {
            console.error('No control number provided');
            showError('No control number available for this schedule.');
            return;
        }
        
        // Open the trip ticket in a new tab
        const tripTicketUrl = `/resource-v2/print-trip-ticket/${controlNo}`;
        console.log('Opening trip ticket URL:', tripTicketUrl);
        
        // Open in new tab instead of new window
        window.open(tripTicketUrl, '_blank');
        console.log('Trip ticket opened in new tab successfully');
    }
