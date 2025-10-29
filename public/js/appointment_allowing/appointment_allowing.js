// Appointment Allowing (Daily Schedule Limit) JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize schedule management
    initializeScheduleManagement();
    initializeSearchFromURL();
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

    // Search functionality - server-side
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performServerSideSearch();
            }
        });
        
        // Also trigger on input with debounce
        searchInput.addEventListener('input', debounce(performServerSideSearch, 500));
    }

    // Status filter - server-side
    document.querySelectorAll('[data-filter-type="status"]').forEach(button => {
        button.addEventListener('click', function() {
            const status = this.getAttribute('data-filter-value');
            applyServerSideStatusFilter(status);
        });
    });

    // Reset filters - server-side
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            window.location.href = window.location.pathname;
        });
    }
}

// Initialize search input from URL parameter
function initializeSearchFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchValue = urlParams.get('search');
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput && searchValue) {
        searchInput.value = searchValue;
    }
}

// Server-side search function
function performServerSideSearch() {
    const searchValue = document.getElementById('searchInput').value;
    const urlParams = new URLSearchParams(window.location.search);
    
    if (searchValue) {
        urlParams.set('search', searchValue);
    } else {
        urlParams.delete('search');
    }
    
    // Reset to page 1 when searching
    urlParams.delete('page');
    
    // Redirect with new search parameter
    window.location.search = urlParams.toString();
}

// Server-side status filter
function applyServerSideStatusFilter(status) {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (status === 'all') {
        urlParams.delete('status');
    } else {
        urlParams.set('status', status);
    }
    
    // Reset to page 1 when filtering
    urlParams.delete('page');
    
    // Redirect with new filter
    window.location.search = urlParams.toString();
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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

