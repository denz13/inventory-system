// Appointment Allowing (Daily Schedule Limit) JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize schedule management
    initializeScheduleManagement();
});

function initializeScheduleManagement() {
    // Initialize date range picker watcher for create modal
    initializeDateRangeWatcher();
    
    // Initialize date range picker watcher for edit modal
    initializeEditDateRangeWatcher();
    
    // Create Schedule
    const createBtn = document.getElementById('createScheduleBtn');
    if (createBtn) {
        createBtn.addEventListener('click', function() {
            createSchedule();
        });
    }

    // Edit Schedule
    document.querySelectorAll('[data-action="edit"]').forEach(button => {
        button.addEventListener('click', function() {
            const scheduleId = this.getAttribute('data-id');
            loadScheduleForEdit(scheduleId);
        });
    });

    // Update Schedule
    const updateBtn = document.getElementById('updateScheduleBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', function() {
            updateSchedule();
        });
    }

    // Delete Schedule
    document.querySelectorAll('[data-action="delete"]').forEach(button => {
        button.addEventListener('click', function() {
            const scheduleId = this.getAttribute('data-id');
            document.getElementById('deleteScheduleId').value = scheduleId;
        });
    });

    // Confirm Delete
    const confirmDeleteBtn = document.getElementById('confirmDeleteSchedule');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const scheduleId = document.getElementById('deleteScheduleId').value;
            deleteSchedule(scheduleId);
        });
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterSchedules();
        });
    }

    // Status filter
    document.querySelectorAll('[data-filter-type="status"]').forEach(button => {
        button.addEventListener('click', function() {
            const status = this.getAttribute('data-filter-value');
            filterByStatus(status);
            updateStatusFilterButton(status);
        });
    });

    // Reset filters
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetFilters();
        });
    }
}

function createSchedule() {
    const form = document.getElementById('createScheduleForm');
    const formData = new FormData(form);
    
    // Clear previous errors
    clearCreateFormErrors();
    
    // Show loading state
    const button = document.getElementById('createScheduleBtn');
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Saving...';
    button.disabled = true;

    fetch('/appointment-allowing', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json',
        },
        body: formData
    })
    .then(response => {
        // Parse JSON even if status is not OK (like 422)
        return response.json().then(data => ({
            status: response.status,
            data: data
        }));
    })
    .then(({status, data}) => {
        if (data.success) {
            showSuccessToast(data.message || 'Appointment limit set successfully');
            form.reset();
            // Close modal
            const closeBtn = document.querySelector('#create-schedule-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            // Reload page to show new schedule
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            // Show validation errors in modal
            let errors = [];
            
            // Check if there are Laravel validation errors
            if (data.errors) {
                // Laravel validation errors object
                Object.keys(data.errors).forEach(key => {
                    if (Array.isArray(data.errors[key])) {
                        data.errors[key].forEach(error => errors.push(error));
                    } else {
                        errors.push(data.errors[key]);
                    }
                });
            } else if (data.message) {
                // Single error message
                errors.push(data.message);
            }
            
            if (errors.length > 0) {
                showFormErrors('createFormErrors', 'createErrorList', errors);
            } else {
                showErrorToast('Failed to set appointment limit');
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showFormErrors('createFormErrors', 'createErrorList', ['Error setting appointment limit. Please try again.']);
    })
    .finally(() => {
        // Reset button state
        button.innerHTML = originalText;
        button.disabled = false;
    });
}

function loadScheduleForEdit(scheduleId) {
    fetch(`/appointment-allowing/${scheduleId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const schedule = data.data;
            document.getElementById('editScheduleId').value = schedule.id;
            document.getElementById('editAllowNumber').value = schedule.allow_number_of_appointment;
            
            // Set status radio button
            if (schedule.status === 'Active') {
                document.getElementById('editStatusActive').checked = true;
            } else {
                document.getElementById('editStatusInactive').checked = true;
            }
            
            // Populate date range information
            if (schedule.schedule_dates && schedule.schedule_dates.length > 0) {
                const firstDate = schedule.schedule_dates[0].dates;
                const lastDate = schedule.schedule_dates[schedule.schedule_dates.length - 1].dates;
                const totalDays = schedule.schedule_dates.length;
                
                // Format dates for date range picker (format: "Jan 1, 2025 - Jan 31, 2025")
                const startDateFormatted = new Date(firstDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                const endDateFormatted = new Date(lastDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                
                // Set the date range input value
                const dateRangeInput = document.getElementById('editDateRangeInput');
                if (dateRangeInput) {
                    dateRangeInput.value = `${startDateFormatted} - ${endDateFormatted}`;
                }
                
                // Extract unique day names
                const dayNames = [...new Set(schedule.schedule_dates.map(d => d.day))];
                
                // Show days included in edit modal
                const editDaysDisplay = document.getElementById('editSelectedDaysDisplay');
                if (editDaysDisplay) {
                    editDaysDisplay.innerHTML = `
                        <div class="p-3 rounded-lg bg-blue-50 border border-blue-200">
                            <div class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-0.5 text-blue-600">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                <div>
                                    <div class="font-medium text-blue-800">${totalDays} days scheduled</div>
                                    <div class="text-xs text-blue-600 mt-1">Days included: ${dayNames.join(', ')}</div>
                                </div>
                            </div>
                        </div>
                    `;
                    editDaysDisplay.classList.remove('hidden');
                }
            }
        } else {
            showErrorToast('Failed to load schedule data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorToast('An error occurred while loading the schedule');
    });
}

function updateSchedule() {
    const scheduleId = document.getElementById('editScheduleId').value;
    const form = document.getElementById('editScheduleForm');
    const formData = new FormData(form);
    
    // Add method spoofing for PUT request (Laravel requires this)
    formData.append('_method', 'PUT');
    
    // Clear previous errors
    clearEditFormErrors();
    
    // Show loading state
    const button = document.getElementById('updateScheduleBtn');
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Updating...';
    button.disabled = true;

    fetch(`/appointment-allowing/${scheduleId}`, {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json',
        },
        body: formData
    })
    .then(response => {
        // Parse JSON even if status is not OK (like 422)
        return response.json().then(data => ({
            status: response.status,
            data: data
        }));
    })
    .then(({status, data}) => {
        if (data.success) {
            showSuccessToast(data.message || 'Appointment limit updated successfully');
            // Close modal
            const closeBtn = document.querySelector('#edit-schedule-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            // Reload page to show updated schedule
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            // Show validation errors in modal
            let errors = [];
            
            // Check if there are Laravel validation errors
            if (data.errors) {
                // Laravel validation errors object
                Object.keys(data.errors).forEach(key => {
                    if (Array.isArray(data.errors[key])) {
                        data.errors[key].forEach(error => errors.push(error));
                    } else {
                        errors.push(data.errors[key]);
                    }
                });
            } else if (data.message) {
                // Single error message
                errors.push(data.message);
            }
            
            if (errors.length > 0) {
                showFormErrors('editFormErrors', 'editErrorList', errors);
            } else {
                showErrorToast('Failed to update appointment limit');
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showFormErrors('editFormErrors', 'editErrorList', ['Error updating appointment limit. Please try again.']);
    })
    .finally(() => {
        // Reset button state
        button.innerHTML = originalText;
        button.disabled = false;
    });
}

function deleteSchedule(scheduleId) {
    // Show loading state
    const button = document.getElementById('confirmDeleteSchedule');
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Deleting...';
    button.disabled = true;

    fetch(`/appointment-allowing/${scheduleId}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessToast(data.message || 'Schedule deleted successfully');
            // Close modal
            const closeBtn = document.querySelector('#delete-confirmation-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            // Reload page to show updated list
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showErrorToast(data.message || 'Failed to delete schedule');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorToast('Error deleting schedule. Please try again.');
    })
    .finally(() => {
        // Reset button state
        button.innerHTML = originalText;
        button.disabled = false;
    });
}

function filterSchedules() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#scheduleTable tbody tr');
    
    let visibleCount = 0;
    
    rows.forEach(row => {
        // Check if row has data-status attribute (actual data row, not empty state)
        if (!row.hasAttribute('data-status')) {
            return; // Skip empty/no-results rows
        }
        
        const allowNumberElement = row.querySelector('td:first-child .font-medium');
        
        // Safety check - if element doesn't exist, skip this row
        if (!allowNumberElement) {
            return;
        }
        
        const allowNumber = allowNumberElement.textContent.toLowerCase();
        
        if (allowNumber.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount(visibleCount);
    toggleNoResultsMessage(visibleCount);
}

function filterByStatus(status) {
    const rows = document.querySelectorAll('#scheduleTable tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        // Check if row has data-status attribute (actual data row, not empty state)
        if (!row.hasAttribute('data-status')) {
            return; // Skip empty/no-results rows
        }
        
        const rowStatus = row.getAttribute('data-status');
        
        if (status === 'all' || rowStatus === status) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount(visibleCount);
    toggleNoResultsMessage(visibleCount);
}

function updateStatusFilterButton(status) {
    const button = document.getElementById('statusFilterBtn');
    const statusText = status === 'all' ? 'All' : status;
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        Status: ${statusText}
    `;
}

function updateFilteredCount(count) {
    const filteredCountElement = document.getElementById('filtered-count');
    if (filteredCountElement) {
        filteredCountElement.textContent = count;
    }
}

function toggleNoResultsMessage(visibleCount) {
    const noResultsRow = document.getElementById('no-results-row');
    const noSchedulesRow = document.getElementById('no-schedules-row');
    const dataRows = document.querySelectorAll('#scheduleTable tbody tr[data-status]');
    
    // If there are data rows (schedules exist)
    if (dataRows.length > 0) {
        // Hide the "No schedules found" message
        if (noSchedulesRow) {
            noSchedulesRow.style.display = 'none';
        }
        
        // Show/hide "No results found" based on visible count
        if (noResultsRow) {
            if (visibleCount === 0) {
                noResultsRow.classList.remove('hidden');
                noResultsRow.style.display = '';
            } else {
                noResultsRow.classList.add('hidden');
                noResultsRow.style.display = 'none';
            }
        }
    } else {
        // No data rows exist, show "No schedules found"
        if (noSchedulesRow) {
            noSchedulesRow.style.display = '';
        }
        if (noResultsRow) {
            noResultsRow.classList.add('hidden');
            noResultsRow.style.display = 'none';
        }
    }
}

function resetFilters() {
    // Reset search input
    document.getElementById('searchInput').value = '';
    
    // Reset status filter
    updateStatusFilterButton('all');
    
    // Show all data rows
    const rows = document.querySelectorAll('#scheduleTable tbody tr[data-status]');
    rows.forEach(row => {
        row.style.display = '';
    });
    
    // Hide no results message
    const noResultsRow = document.getElementById('no-results-row');
    if (noResultsRow) {
        noResultsRow.classList.add('hidden');
        noResultsRow.style.display = 'none';
    }
    
    // Update count
    updateFilteredCount(rows.length);
}

function showSuccessToast(message) {
    // Use the same pattern as feedback system
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            className: "toastify-content",
            backgroundColor: "#10b981",
            stopOnFocus: true,
            onClick: function() {
                this.hideToast();
            }
        }).showToast();
    } else {
        // Fallback to alert if Toastify is not available
        alert('Success: ' + message);
    }
}

function showErrorToast(message) {
    // Use the same pattern as feedback system
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: message,
            duration: 5000,
            gravity: "top",
            position: "right",
            className: "toastify-content",
            backgroundColor: "#ef4444",
            stopOnFocus: true,
            onClick: function() {
                this.hideToast();
            }
        }).showToast();
    } else {
        // Fallback to alert if Toastify is not available
        alert('Error: ' + message);
    }
}

// Form validation error functions (same as feedback system)
function showFormErrors(errorDivId, errorListId, errors) {
    const errorDiv = document.getElementById(errorDivId);
    const errorList = document.getElementById(errorListId);
    
    if (errorDiv && errorList) {
        errorList.innerHTML = '';
        errors.forEach(error => {
            const li = document.createElement('li');
            li.textContent = error;
            errorList.appendChild(li);
        });
        errorDiv.classList.remove('hidden');
        
        // Scroll to top of modal to show errors
        const modal = errorDiv.closest('.modal-body');
        if (modal) {
            modal.scrollTop = 0;
        }
    }
}

function clearCreateFormErrors() {
    const errorDiv = document.getElementById('createFormErrors');
    if (errorDiv) errorDiv.classList.add('hidden');
}

function clearEditFormErrors() {
    const errorDiv = document.getElementById('editFormErrors');
    if (errorDiv) errorDiv.classList.add('hidden');
}

// Date Range Functions (similar to billing-payment.js)
function initializeDateRangeWatcher() {
    const dateRangeInput = document.getElementById('dateRangeInput');
    if (!dateRangeInput) return;

    let lastValue = dateRangeInput.value;

    // Watch for value changes using interval
    setInterval(() => {
        const currentValue = dateRangeInput.value;
        if (currentValue !== lastValue) {
            lastValue = currentValue;
            handleDateRangeChange(currentValue);
        }
    }, 100);

    // Also listen for change events
    dateRangeInput.addEventListener('change', function() {
        handleDateRangeChange(this.value);
    });

    // Listen for input events
    dateRangeInput.addEventListener('input', function() {
        handleDateRangeChange(this.value);
    });

    // Listen for clicks on the document to catch date picker Apply clicks
    document.addEventListener('click', function(e) {
        setTimeout(() => {
            const currentValue = dateRangeInput.value;
            if (currentValue !== lastValue) {
                lastValue = currentValue;
                handleDateRangeChange(currentValue);
            }
        }, 100);
    });
}

function handleDateRangeChange(dateRange) {
    console.log('Date range changed:', dateRange);
    
    if (!dateRange || dateRange.trim() === '') {
        // Hide the days display if no range selected
        const daysDisplay = document.getElementById('selectedDaysDisplay');
        if (daysDisplay) {
            daysDisplay.classList.add('hidden');
        }
        return;
    }

    // Parse the date range
    const dateParts = dateRange.split(' - ');
    if (dateParts.length !== 2) {
        console.error('Invalid date range format:', dateRange);
        return;
    }

    try {
        const startDateStr = dateParts[0].trim();
        const endDateStr = dateParts[1].trim();
        
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error('Invalid date values:', startDateStr, endDateStr);
            return;
        }

        // Extract all day names in the range
        const dayNames = extractDayNamesFromRange(startDate, endDate);
        displaySelectedDays(dayNames, startDate, endDate);

    } catch (error) {
        console.error('Error parsing date range:', error);
    }
}

function extractDayNamesFromRange(startDate, endDate) {
    const dayNames = [];
    const daySet = new Set();
    const currentDate = new Date(startDate);
    
    const dayNameMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    while (currentDate <= endDate) {
        const dayName = dayNameMap[currentDate.getDay()];
        if (!daySet.has(dayName)) {
            daySet.add(dayName);
            dayNames.push(dayName);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dayNames;
}

function displaySelectedDays(dayNames, startDate, endDate) {
    const daysDisplay = document.getElementById('selectedDaysDisplay');
    if (!daysDisplay) return;
    
    const dayCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    daysDisplay.innerHTML = `
        <div class="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-0.5 text-blue-600">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <div>
                    <div class="font-medium text-blue-800">${dayCount} days selected</div>
                    <div class="text-xs text-blue-600 mt-1">Days included: ${dayNames.join(', ')}</div>
                </div>
            </div>
        </div>
    `;
    daysDisplay.classList.remove('hidden');
    
    console.log('Days in range:', dayNames);
    console.log('Total days:', dayCount);
}

// Edit modal date range watcher
function initializeEditDateRangeWatcher() {
    const editDateRangeInput = document.getElementById('editDateRangeInput');
    if (!editDateRangeInput) return;

    let lastValue = editDateRangeInput.value;

    // Watch for value changes using interval
    setInterval(() => {
        const currentValue = editDateRangeInput.value;
        if (currentValue !== lastValue) {
            lastValue = currentValue;
            handleEditDateRangeChange(currentValue);
        }
    }, 100);

    // Also listen for change events
    editDateRangeInput.addEventListener('change', function() {
        handleEditDateRangeChange(this.value);
    });

    // Listen for input events
    editDateRangeInput.addEventListener('input', function() {
        handleEditDateRangeChange(this.value);
    });

    // Listen for clicks on the document to catch date picker Apply clicks
    document.addEventListener('click', function(e) {
        setTimeout(() => {
            const currentValue = editDateRangeInput.value;
            if (currentValue !== lastValue) {
                lastValue = currentValue;
                handleEditDateRangeChange(currentValue);
            }
        }, 100);
    });
}

function handleEditDateRangeChange(dateRange) {
    console.log('Edit date range changed:', dateRange);
    
    if (!dateRange || dateRange.trim() === '') {
        // Hide the days display if no range selected
        const daysDisplay = document.getElementById('editSelectedDaysDisplay');
        if (daysDisplay) {
            daysDisplay.classList.add('hidden');
        }
        return;
    }

    // Parse the date range
    const dateParts = dateRange.split(' - ');
    if (dateParts.length !== 2) {
        console.error('Invalid date range format:', dateRange);
        return;
    }

    try {
        const startDateStr = dateParts[0].trim();
        const endDateStr = dateParts[1].trim();
        
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error('Invalid date values:', startDateStr, endDateStr);
            return;
        }

        // Extract all day names in the range
        const dayNames = extractDayNamesFromRange(startDate, endDate);
        displayEditSelectedDays(dayNames, startDate, endDate);

    } catch (error) {
        console.error('Error parsing date range:', error);
    }
}

function displayEditSelectedDays(dayNames, startDate, endDate) {
    const daysDisplay = document.getElementById('editSelectedDaysDisplay');
    if (!daysDisplay) return;
    
    const dayCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    daysDisplay.innerHTML = `
        <div class="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-0.5 text-blue-600">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <div>
                    <div class="font-medium text-blue-800">${dayCount} days selected</div>
                    <div class="text-xs text-blue-600 mt-1">Days included: ${dayNames.join(', ')}</div>
                </div>
            </div>
        </div>
    `;
    daysDisplay.classList.remove('hidden');
    
    console.log('Edit - Days in range:', dayNames);
    console.log('Edit - Total days:', dayCount);
}

