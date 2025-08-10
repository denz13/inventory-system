// Add this at the beginning of the file, after existing imports
let qrCodeInstance = null;

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('resource-search');
    const clearSearchBtn = document.getElementById('clear-search');

    if (!searchInput) return;

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Search function
    function performSearch(searchTerm) {
        const currentUrl = new URL(window.location.href);
        
        if (searchTerm && searchTerm.trim()) {
            currentUrl.searchParams.set('search', searchTerm.trim());
        } else {
            currentUrl.searchParams.delete('search');
        }
        
        // Reset to first page when searching
        currentUrl.searchParams.set('page', '1');
        
        // Show loading state
        searchInput.classList.add('loading');
        if (searchInput.nextElementSibling) {
            searchInput.nextElementSibling.style.opacity = '0.5';
        }
        
        // Navigate to search results
        window.location.href = currentUrl.toString();
    }

    // Debounced search for typing
    const debouncedSearch = debounce(function(e) {
        performSearch(e.target.value);
    }, 500);

    // Add event listeners
    searchInput.addEventListener('input', debouncedSearch);
    
    // Immediate search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(this.value);
        }
    });

    // Clear search functionality
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            performSearch('');
        });
    }

    // Add loading class styles
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            opacity: 0.5;
            pointer-events: none;
        }
        #resource-search:focus {
            box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
        }
    `;
    document.head.appendChild(style);
}

// Handle per page selection
function initializePerPageSelect() {
    const perPageSelect = document.getElementById('per-page-select');
    
    if (perPageSelect) {
        perPageSelect.addEventListener('change', function() {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('per_page', this.value);
            currentUrl.searchParams.set('page', '1'); // Reset to first page when changing items per page
            window.location.href = currentUrl.toString();
        });
    }
}

// Initialize schedule modal functionality
function initializeScheduleModal() {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Set min date to today for schedule date inputs
    const scheduleDateInput = document.getElementById('schedule_date');
    const endDateInput = document.getElementById('end_date');
    if (scheduleDateInput && endDateInput) {
        scheduleDateInput.setAttribute('min', today);
        endDateInput.setAttribute('min', today);
    }

    // Handle start date change
    $('#schedule_date').on('change', function() {
        $('#end_date').attr('min', $(this).val());
        if ($('#end_date').val() < $(this).val()) {
            $('#end_date').val($(this).val());
        }
    });

    // Add conflict checking functionality
    let conflictCheckTimeout;
    let hasConflict = false; // Track if there are conflicts
    
    // Function to check for schedule conflicts
    function checkScheduleConflict() {
        const resourceId = $('#resource_id').val();
        const startDateTime = $('#start_datetime').val();
        const endDateTime = $('#end_datetime').val();
        
        // Clear previous timeout
        if (conflictCheckTimeout) {
            clearTimeout(conflictCheckTimeout);
        }
        
        // Check if all required fields are filled
        if (!resourceId || !startDateTime || !endDateTime) {
            // Hide conflict modal if it's open
            const conflictModal = tailwind.Modal.getInstance(document.querySelector("#conflict-modal"));
            if (conflictModal) {
                conflictModal.hide();
            }
            hasConflict = false;
            window.conflictData = null;
            return;
        }
        
        // Check if end time is after start time
        if (new Date(endDateTime) <= new Date(startDateTime)) {
            // Hide conflict modal if it's open
            const conflictModal = tailwind.Modal.getInstance(document.querySelector("#conflict-modal"));
            if (conflictModal) {
                conflictModal.hide();
            }
            hasConflict = false;
            window.conflictData = null;
            return;
        }
        
        // Debounce the API call
        conflictCheckTimeout = setTimeout(function() {
            $.ajax({
                url: '/resource-v2/check-schedule-conflict',
                method: 'POST',
                data: {
                    resource_id: resourceId,
                    start_datetime: startDateTime,
                    end_datetime: endDateTime,
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    if (response.status === 'conflict') {
                        hasConflict = true;
                        
                        // Store conflict data for later use but don't show modal yet
                        window.conflictData = {
                            message: response.message,
                            conflicts: response.conflicts
                        };
                    } else if (response.status === 'available') {
                        hasConflict = false;
                        
                        // Clear conflict data
                        window.conflictData = null;
                    }
                },
                error: function(xhr) {
                    console.error('Error checking schedule conflict:', xhr);
                    hasConflict = false;
                    
                    // Clear conflict data
                    window.conflictData = null;
                }
            });
        }, 1000); // 1 second delay
    }
    
    // Add event listeners for conflict checking
    $('#start_datetime, #end_datetime').on('change', checkScheduleConflict);

    // Handle add passenger button
    $(document).on('click', '.add-passenger', function() {
        const newRow = `
            <div class="passenger-row flex gap-2">
                <div class="input-group flex-1">
                    <div class="input-group-text"><i data-lucide="users" class="w-4 h-4"></i></div>
                    <input type="text" name="passengers[]" class="form-control" placeholder="Enter passenger name" required>
                </div>
                <button type="button" class="btn btn-danger remove-passenger">
                    <i data-lucide="minus" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        $('#passengers-container').append(newRow);
        // Reinitialize Lucide icons for the new row
        lucide.createIcons({
            attrs: {
                class: ["w-4", "h-4"]
            }
        });
    });

    // Handle remove passenger button
    $(document).on('click', '.remove-passenger', function() {
        $(this).closest('.passenger-row').remove();
    });

    // Handle modal show
    let selectedResourceId = null;
    $(document).on('click', '[data-tw-target="#schedule-modal"]', async function(e) {
        e.preventDefault();
        const resourceId = $(this).data('resource-id');
        selectedResourceId = resourceId;
        
        try {
            // Show loading state
            $(this).addClass('loading');
            
            // Fetch resource data
            const response = await fetch(`/resource-v2/${resourceId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                const resource = data.resource;
                
                // Set resource ID in hidden input
                $('#resource_id').val(resource.id);
                
                // Populate modal with resource details
                $('#modal_resource_name').text(resource.resource_name || 'N/A');
                $('#modal_resource_category').text(resource.category?.category_name || 'Uncategorized');
                $('#modal_resource_model').text(resource.resource_serial_or_plate_number || 'N/A');
                $('#modal_resource_location').text(resource.location?.location_name || 'N/A');
                $('#modal_resource_person_incharge').text(resource.person_incharge_name || 'N/A');
                
                // Reset form
                $('#schedule-form')[0].reset();
                
                // Reset passengers (keep only one input)
                $('#passengers-container').html(`
                    <div class="passenger-row flex gap-2">
                        <div class="input-group flex-1">
                            <div class="input-group-text"><i data-lucide="users" class="w-4 h-4"></i></div>
                            <input type="text" name="passengers[]" class="form-control" placeholder="Enter passenger name" required>
                        </div>
                        <button type="button" class="btn btn-danger remove-passenger">
                            <i data-lucide="minus" class="w-4 h-4"></i>
                        </button>
                    </div>
                `);
                
                // Initialize select2 for charge_to
                $('#charge_to').select2({
                    dropdownParent: $('#schedule-modal'),
                    placeholder: 'Select Responsibility Center',
                    allowClear: true,
                    ajax: {
                        url: '/resource-v2/get-responsibility-centers',
                        dataType: 'json',
                        delay: 250,
                        data: function(params) {
                            return {
                                search: params.term,
                                page: params.page || 1
                            };
                        },
                        processResults: function(data) {
                            return {
                                results: data.centers.map(center => ({
                                    id: center.responid,
                                    text: center.centername
                                }))
                            };
                        }
                    }
                });

                // Initialize select2 for office
                $('#office').select2({
                    dropdownParent: $('#schedule-modal'),
                    placeholder: 'Select Office',
                    allowClear: true,
                    ajax: {
                        url: '/resource-v2/get-offices',
                        dataType: 'json',
                        delay: 250,
                        data: function(params) {
                            return {
                                search: params.term,
                                page: params.page || 1
                            };
                        },
                        processResults: function(data) {
                            return {
                                results: data.centers.map(function(center) {
                                    return {
                                        id: center.responid,
                                        text: center.centername
                                    };
                                })
                            };
                        }
                    }
                });

                // Initialize select2 for driver
                $('#driver').select2({
                    dropdownParent: $('#schedule-modal'),
                    placeholder: 'Select Driver',
                    allowClear: true,
                    ajax: {
                        url: '/resource-v2/get-drivers',
                        dataType: 'json',
                        delay: 250,
                        data: function(params) {
                            return {
                                search: params.term,
                                page: params.page || 1
                            };
                        },
                        processResults: function(data) {
                            return {
                                results: data.results
                            };
                        }
                    }
                });

                // Initialize select2 for passengers
                $('#passengers').select2({
                    dropdownParent: $('#schedule-modal'),
                    placeholder: 'Select Passengers',
                    allowClear: true,
                    multiple: true,
                    width: '100%',
                    ajax: {
                        url: '/resource-v2/get-employees',
                        dataType: 'json',
                        delay: 250,
                        data: function(params) {
                            return {
                                search: params.term || '',
                                page: params.page || 1
                            };
                        },
                        processResults: function(data) {
                            return {
                                results: data.results.map(function(employee) {
                                    return {
                                        id: employee.id,
                                        text: employee.text
                                    };
                                }),
                                pagination: {
                                    more: data.pagination && data.pagination.more
                                }
                            };
                        },
                        cache: true
                    },
                    minimumInputLength: 2,
                    language: {
                        inputTooShort: function() {
                            return 'Please enter at least 2 characters';
                        },
                        searching: function() {
                            return 'Searching employees...';
                        },
                        noResults: function() {
                            return 'No employees found';
                        }
                    }
                }).on('select2:open', function() {
                    setTimeout(function() {
                        $('.select2-search__field').focus();
                    }, 0);
                });
                
                // Show modal
                const modal = tailwind.Modal.getInstance(document.querySelector("#schedule-modal"));
                modal.show();
                
                // Check for conflicts after modal is shown and resource is set
                setTimeout(function() {
                    checkScheduleConflict();
                }, 100);
            } else {
                throw new Error('Failed to fetch resource data');
            }
        } catch (error) {
            console.error('Error:', error);
            // Show error message to user
            alert('Failed to load resource details. Please try again.');
        } finally {
            // Remove loading state
            $(this).removeClass('loading');
        }
    });

    // Handle form submission
    $('#schedule-form').on('submit', function(e) {
        e.preventDefault();
        
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        
        // Get all form values
        const formData = {
            add_resource_id: selectedResourceId,
            charge_to: $('#charge_to').val(),
            office: $('#office').val(),
            driver: $('#driver').val(),
            destination: $('#destination').val(),
            start_datetime: $('#start_datetime').val(),
            end_datetime: $('#end_datetime').val(),
            reason: $('#purpose').val(),
            passengers: $('#passengers').val() || [],
            _token: $('meta[name="csrf-token"]').attr('content')
        };

        // Validate required fields
        if (!formData.add_resource_id) {
            $('#error-message').text('Please select a resource');
            const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
            errorModal.show();
            return;
        }
        if (!formData.charge_to) {
            $('#error-message').text('Please select charge to');
            const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
            errorModal.show();
            return;
        }
        if (!formData.office) {
            $('#error-message').text('Please select office');
            const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
            errorModal.show();
            return;
        }
        if (!formData.destination) {
            $('#error-message').text('Please enter destination');
            const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
            errorModal.show();
            return;
        }
        if (!formData.start_datetime) {
            $('#error-message').text('Please select start date and time');
            const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
            errorModal.show();
            return;
        }
        if (!formData.end_datetime) {
            $('#error-message').text('Please select end date and time');
            const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
            errorModal.show();
            return;
        }
        if (!formData.reason) {
            $('#error-message').text('Please enter purpose/reason');
            const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
            errorModal.show();
            return;
        }
        if (!formData.passengers || !formData.passengers.length) {
            $('#error-message').text('Please select at least one passenger');
            const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
            errorModal.show();
            return;
        }

        // Check for schedule conflicts before submitting
        if (hasConflict) {
            // Show conflict modal with stored data
            if (window.conflictData) {
                // Set conflict message
                $('#conflict-message').text(window.conflictData.message);
                
                // Display conflict details with table format
                let conflictHtml = `
                    <div class="overflow-x-auto bg-white rounded-lg shadow-lg border border-slate-200">
                        <table class="w-full">
                            <thead>
                                <tr class="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        <div class="flex items-center">
                                            <i data-lucide="hash" class="w-4 h-4 mr-2"></i>
                                            Control Number
                                        </div>
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        <div class="flex items-center">
                                            <i data-lucide="building" class="w-4 h-4 mr-2"></i>
                                            Office
                                        </div>
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        <div class="flex items-center">
                                            <i data-lucide="map-pin" class="w-4 h-4 mr-2"></i>
                                            Destination
                                        </div>
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        <div class="flex items-center">
                                            <i data-lucide="clock" class="w-4 h-4 mr-2"></i>
                                            Schedule
                                        </div>
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        <div class="flex items-center">
                                            <i data-lucide="info" class="w-4 h-4 mr-2"></i>
                                            Status
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200">
                `;
                
                window.conflictData.conflicts.forEach(function(conflict, index) {
                    const statusColor = conflict.status.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                                       conflict.status.toLowerCase() === 'approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                                       'bg-slate-100 text-slate-800 border-slate-200';
                    
                    const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-slate-50';
                    
                    conflictHtml += `
                        <tr class="${rowBg} hover:bg-blue-50 transition-colors duration-200">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center mr-3">
                                        <i data-lucide="calendar-check" class="w-4 h-4 text-white"></i>
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold text-slate-900">${conflict.control_no}</div>
                                        <div class="text-xs text-slate-500">Schedule ID</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-slate-900">${conflict.office}</div>
                                <div class="text-xs text-slate-500">Requesting Office</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-slate-900">${conflict.destination}</div>
                                <div class="text-xs text-slate-500">Travel Destination</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-slate-900">${conflict.start_datetime}</div>
                                <div class="text-xs text-slate-500">to ${conflict.end_datetime}</div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}">
                                    <div class="w-2 h-2 rounded-full mr-2 ${conflict.status.toLowerCase() === 'pending' ? 'bg-amber-400' : conflict.status.toLowerCase() === 'approved' ? 'bg-emerald-400' : 'bg-slate-400'}"></div>
                                    ${conflict.status}
                                </span>
                            </td>
                        </tr>
                    `;
                });
                
                conflictHtml += `
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div class="flex items-center text-sm text-red-700">
                            <i data-lucide="alert-triangle" class="w-4 h-4 mr-2"></i>
                            <span class="font-medium">Conflict Warning:</span>
                            <span class="ml-1">These schedules overlap with your selected time period.</span>
                        </div>
                    </div>
                `;
                
                $('#conflict-details').html(conflictHtml);
                
                // Show conflict modal
                const conflictModal = tailwind.Modal.getInstance(document.querySelector("#conflict-modal")) || new tailwind.Modal(document.querySelector("#conflict-modal"));
                conflictModal.show();
                
                // Reinitialize Lucide icons
                lucide.createIcons();
            } else {
                // Fallback error message if no conflict data stored
                $('#error-message').text('Hindi pwedeng mag-save! May schedule conflict. Piliin ang ibang oras o araw.');
                const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
                errorModal.show();
            }
            return;
        }

        // Disable submit button and show loading state
        submitBtn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Saving...');

        // Send AJAX request
        $.ajax({
            url: '/resource-v2/store-schedule',
            method: 'POST',
            data: formData,
            success: function(response) {
                if (response.status === 'success') {
                    // Hide schedule modal
                    const scheduleModal = tailwind.Modal.getInstance(document.querySelector("#schedule-modal"));
                    scheduleModal.hide();

                    // Show success message
                    $('#success-message').text(response.message);
                    
                    // Generate QR code
                    if (response.data.qr_code) {
                        generateQRCode(response.data.qr_code);
                    }
                    
                    const successModal = tailwind.Modal.getInstance(document.querySelector("#success-modal"));
                    successModal.show();

                    // Reset form
                    form[0].reset();
                    $('#charge_to').val(null).trigger('change');
                    $('#office').val(null).trigger('change');
                    $('#driver').val(null).trigger('change');
                    $('#passengers').val(null).trigger('change');
                    // Hide conflict modal if it's open
                    const conflictModal = tailwind.Modal.getInstance(document.querySelector("#conflict-modal"));
                    if (conflictModal) {
                        conflictModal.hide();
                    }
                    // Reset conflict state
                    hasConflict = false;
                    // Clear conflict data
                    window.conflictData = null;
                } else {
                    // Show error message
                    $('#error-message').text(response.message);
                    const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
                    errorModal.show();
                }
            },
            error: function(xhr) {
                // Show validation errors if any
                if (xhr.status === 422) {
                    const errors = xhr.responseJSON.errors;
                    let errorMessage = '';
                    for (const field in errors) {
                        errorMessage = errors[field][0]; // Just take the first error
                        break; // Only show one error at a time
                    }
                    $('#error-message').text(errorMessage || 'Please check all required fields');
                } else {
                    // Show general error message
                    $('#error-message').text(xhr.responseJSON?.message || 'An error occurred while saving the schedule.');
                }
                const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
                errorModal.show();
            },
            complete: function() {
                // Re-enable submit button
                submitBtn.prop('disabled', false).text('Save');
            }
        });
    });

    // Reset form when modal is hidden
    $('#schedule-modal').on('hidden.bs.modal', function (e) {
        $('#schedule-form')[0].reset();
        $('#modal_resource_name').text('');
        $('#modal_resource_category').text('');
        $('#modal_resource_model').text('');
        $('#modal_resource_location').text('');
        $('#modal_resource_person_incharge').text('');
        $('#resource_id').val('');
        // Reset passengers (keep only one input)
        $('#passengers-container').html(`
            <div class="passenger-row flex gap-2">
                <div class="input-group flex-1">
                    <div class="input-group-text"><i data-lucide="users" class="w-4 h-4"></i></div>
                    <input type="text" name="passengers[]" class="form-control" placeholder="Enter passenger name" required>
                </div>
                <button type="button" class="btn btn-danger remove-passenger">
                    <i data-lucide="minus" class="w-4 h-4"></i>
                </button>
            </div>
        `);
        // Reset charge_to
        $('#charge_to').val(null).trigger('change');
        // Hide conflict modal if it's open
        const conflictModal = tailwind.Modal.getInstance(document.querySelector("#conflict-modal"));
        if (conflictModal) {
            conflictModal.hide();
        }
        // Reset conflict state
        hasConflict = false;
        // Clear conflict data
        window.conflictData = null;
    });

    // When Schedule Now button is clicked
    $('[data-tw-toggle="modal"][data-tw-target="#schedule-modal"]').on('click', function() {
        const resourceId = $(this).data('resource-id');
        // Set the resource ID in the hidden input
        $('#resource_id').val(resourceId);
        // Store for form submission
        selectedResourceId = resourceId;
        // Hide conflict modal when opening schedule modal
        const conflictModal = tailwind.Modal.getInstance(document.querySelector("#conflict-modal"));
        if (conflictModal) {
            conflictModal.hide();
        }
        // Reset conflict state
        hasConflict = false;
        // Clear conflict data
        window.conflictData = null;
    });

    // When View Schedules button is clicked
    $('[data-tw-toggle="modal"][data-tw-target="#view-schedules-modal"]').on('click', function() {
        const resourceId = $(this).data('resource-id');
        loadResourceSchedules(resourceId);
    });

    // Function to load resource schedules
    function loadResourceSchedules(resourceId) {
        const tbody = $('#schedules-list');
        tbody.html('<tr><td colspan="8" class="text-center">Loading schedules...</td></tr>');

        $.ajax({
            url: `/resource-v2/get-resource-schedules/${resourceId}`,
            method: 'GET',
            success: function(response) {
                if (response.status === 'success') {
                    if (response.schedules.length === 0) {
                        tbody.html('<tr><td colspan="8" class="text-center">No schedules found</td></tr>');
                        return;
                    }

                    let html = '';
                    response.schedules.forEach(function(schedule) {
                        html += `
                            <tr class="${schedule.status.toLowerCase() === 'pending' ? 'bg-warning' : schedule.status.toLowerCase() === 'approved' ? 'bg-primary text-white' : 'bg-danger text-white'}">
                                <td class="whitespace-nowrap">${schedule.control_no}</td>
                                <td class="whitespace-nowrap">${schedule.office}</td>
                                <td class="whitespace-nowrap">${schedule.driver}</td>
                                <td class="whitespace-nowrap">${schedule.destination}</td>
                                <td class="whitespace-nowrap">${schedule.reason}</td>
                                <td class="whitespace-nowrap">${schedule.start_datetime}</td>
                                <td class="whitespace-nowrap">${schedule.end_datetime}</td>
                                <td class="whitespace-nowrap">${schedule.status}</td>
                                <td class="whitespace-nowrap">${schedule.passengers}</td>
                            </tr>
                        `;
                    });
                    tbody.html(html);
                } else {
                    tbody.html('<tr><td colspan="8" class="text-center text-danger">Failed to load schedules</td></tr>');
                }
            },
            error: function() {
                tbody.html('<tr><td colspan="8" class="text-center text-danger">Failed to load schedules</td></tr>');
            }
        });
    }
}

// Add this function to handle QR code generation
function generateQRCode(data) {
    const qrContainer = document.getElementById('qrcode-container');
    qrContainer.innerHTML = ''; // Clear previous QR code

    // Create a new QR code instance
    const html5QrcodeScanner = new Html5Qrcode("qrcode-container");
    
    // Generate QR code
    const qrCodeWidth = 256;
    const config = {
        width: qrCodeWidth,
        height: qrCodeWidth,
        data: data,
        margin: 1,
        dotsOptions: {
            color: "#000000",
            type: "square"
        },
        backgroundOptions: {
            color: "#ffffff",
        }
    };
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = qrCodeWidth;
    canvas.height = qrCodeWidth;
    qrContainer.appendChild(canvas);
    
    // Generate QR code on canvas
    QRCode.toCanvas(canvas, data, config, function (error) {
        if (error) {
            console.error('Error generating QR code:', error);
            return;
        }
        
        // Show download and print buttons
        document.getElementById('download-qr').style.display = 'inline-flex';
        document.getElementById('print-qr').style.display = 'inline-flex';
    });

    // Store canvas reference
    qrCodeInstance = canvas;
}

// Add these event listeners for download and print buttons
document.getElementById('download-qr').addEventListener('click', function() {
    if (!qrCodeInstance) return;
    
    // Create temporary link for download
    const link = document.createElement('a');
    link.download = 'schedule-qr.png';
    link.href = qrCodeInstance.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

document.getElementById('print-qr').addEventListener('click', function() {
    if (!qrCodeInstance) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print QR Code</title></head><body>');
    printWindow.document.write('<div style="text-align: center;">');
    printWindow.document.write('<img src="' + qrCodeInstance.toDataURL() + '" style="max-width: 100%;">');
    printWindow.document.write('</div></body></html>');
    printWindow.document.close();
    printWindow.print();
});

// Document ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    initializeSearch();

    // Initialize per page selection
    initializePerPageSelect();

    // Initialize schedule modal
    initializeScheduleModal();
});
