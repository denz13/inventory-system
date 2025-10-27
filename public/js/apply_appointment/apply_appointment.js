// Apply Appointment JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize appointment management
    initializeAppointmentManagement();
});

function initializeAppointmentManagement() {
    // Check availability on page load (total slots, not per date)
    checkTotalAvailability();
    
    // Submit Appointment
    const submitBtn = document.getElementById('submitAppointmentBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            submitAppointment();
        });
    }

    // View Appointment
    document.querySelectorAll('[data-action="view"]').forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = this.getAttribute('data-id');
            loadAppointmentDetails(appointmentId);
        });
    });

    // Cancel Appointment
    document.querySelectorAll('[data-action="cancel"]').forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = this.getAttribute('data-id');
            document.getElementById('cancelAppointmentId').value = appointmentId;
        });
    });

    // Confirm Cancel
    const confirmCancelBtn = document.getElementById('confirmCancelAppointment');
    if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', function() {
            const appointmentId = document.getElementById('cancelAppointmentId').value;
            cancelAppointment(appointmentId);
        });
    }

    // Search functionality - Server-side (Enter key only)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        // Get search term from URL if it exists
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search') || '';
        searchInput.value = searchTerm;
        
        // Search only when Enter key is pressed
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                performServerSideSearch();
            }
        });
        
        // Also allow clicking the search icon to trigger search
        const searchIcon = searchInput.parentElement.querySelector('svg');
        if (searchIcon) {
            searchIcon.style.cursor = 'pointer';
            searchIcon.addEventListener('click', function() {
                performServerSideSearch();
            });
        }
    }
    
    function performServerSideSearch() {
        const url = new URL(window.location.href);
        const searchValue = searchInput ? searchInput.value.trim() : '';
        
        // Update URL parameters
        if (searchValue) {
            url.searchParams.set('search', searchValue);
        } else {
            url.searchParams.delete('search');
        }
        
        // Reset to page 1 when searching
        url.searchParams.delete('page');
        
        // Reload page with new parameters
        window.location.href = url.toString();
    }

    // Clear errors when user types
    const descriptionInput = document.getElementById('appointmentDescription');
    if (descriptionInput) {
        descriptionInput.addEventListener('input', function() {
            document.getElementById('descriptionError').classList.add('hidden');
            this.classList.remove('border-red-500');
        });
    }

    const categorySelect = document.getElementById('appointmentCategory');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            document.getElementById('categoryError').classList.add('hidden');
            this.classList.remove('border-red-500');
        });
    }

    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            document.getElementById('dateError').classList.add('hidden');
            this.classList.remove('border-red-500');
            
            const selectedDate = this.value;
            const timeWrapper = document.getElementById('timeSelectionWrapper');
            const timeSelect = document.getElementById('appointmentTime');
            
            if (selectedDate && timeWrapper && timeSelect) {
                // Show time selection and fetch available times
                timeWrapper.classList.remove('hidden');
                timeSelect.setAttribute('required', 'required');
                
                // Fetch available time slots for the selected date
                fetchAvailableTimeSlots(selectedDate);
            } else if (timeWrapper && timeSelect) {
                timeWrapper.classList.add('hidden');
                timeSelect.removeAttribute('required');
                timeSelect.value = '';
            }
        });
    }
    
    const timeInput = document.getElementById('appointmentTime');
    if (timeInput) {
        timeInput.addEventListener('change', function() {
            document.getElementById('timeError').classList.add('hidden');
            this.classList.remove('border-red-500');
        });
    }
}

function checkTotalAvailability() {
    const availabilityInfo = document.getElementById('availabilityInfo');
    const availabilityMessage = document.getElementById('availabilityMessage');
    const submitBtn = document.getElementById('submitAppointmentBtn');
    
    // Only run this check on the appointment form modal
    if (!availabilityInfo || !availabilityMessage) {
        return;
    }
    
    fetch('/apply-appointment/check-availability', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && availabilityInfo && availabilityMessage) {
            if (data.available) {
                // Slots available - show green info
                availabilityInfo.querySelector('div').className = 'p-3 rounded-lg bg-green-50 border border-green-200';
                availabilityInfo.querySelector('svg').classList.remove('text-blue-600', 'text-red-600', 'text-yellow-600');
                availabilityInfo.querySelector('svg').classList.add('text-green-600');
                availabilityMessage.className = 'text-green-700 font-medium';
                availabilityMessage.textContent = data.message;
                
                // Enable submit button
                if (submitBtn) {
                    submitBtn.disabled = false;
                }
            } else {
                // No slots available - show red warning
                availabilityInfo.querySelector('div').className = 'p-3 rounded-lg bg-red-50 border border-red-200';
                availabilityInfo.querySelector('svg').classList.remove('text-blue-600', 'text-green-600', 'text-yellow-600');
                availabilityInfo.querySelector('svg').classList.add('text-red-600');
                availabilityMessage.className = 'text-red-700 font-medium';
                availabilityMessage.textContent = data.message;
                
                // Disable submit button
                if (submitBtn) {
                    submitBtn.disabled = true;
                }
            }
            availabilityInfo.classList.remove('hidden');
        } else if (!data.success && availabilityInfo && availabilityMessage) {
            // Error checking - show yellow warning
            availabilityInfo.querySelector('div').className = 'p-3 rounded-lg bg-yellow-50 border border-yellow-200';
            availabilityInfo.querySelector('svg').classList.remove('text-blue-600', 'text-green-600', 'text-red-600');
            availabilityInfo.querySelector('svg').classList.add('text-yellow-600');
            availabilityMessage.className = 'text-yellow-700 font-medium';
            availabilityMessage.textContent = data.message || 'Unable to check availability';
            availabilityInfo.classList.remove('hidden');
            
            // Disable submit button if no schedule is set
            if (submitBtn) {
                submitBtn.disabled = true;
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        if (availabilityInfo && availabilityMessage) {
            availabilityInfo.querySelector('div').className = 'p-3 rounded-lg bg-yellow-50 border border-yellow-200';
            availabilityInfo.querySelector('svg').classList.remove('text-blue-600', 'text-green-600', 'text-red-600');
            availabilityInfo.querySelector('svg').classList.add('text-yellow-600');
            availabilityMessage.className = 'text-yellow-700 font-medium';
            availabilityMessage.textContent = 'Unable to check availability';
            availabilityInfo.classList.remove('hidden');
        }
    });
}

function submitAppointment() {
    const form = document.getElementById('createAppointmentForm');
    const formData = new FormData(form);
    
    // Clear previous errors
    clearCreateFormErrors();
    
    // Show loading state
    const button = document.getElementById('submitAppointmentBtn');
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Submitting...';
    button.disabled = true;

    fetch('/apply-appointment', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
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
            showSuccessToast(data.message || 'Appointment submitted successfully!');
            form.reset();
            // Close modal
            const closeBtn = document.querySelector('#create-appointment-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            // Reload page to show new appointment
            setTimeout(() => {
                window.location.reload();
            }, 1500);
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
                showErrorToast('Failed to submit appointment');
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showFormErrors('createFormErrors', 'createErrorList', ['Error submitting appointment. Please try again.']);
    })
    .finally(() => {
        // Reset button state
        button.innerHTML = originalText;
        button.disabled = false;
    });
}

function loadAppointmentDetails(appointmentId) {
    const detailsContainer = document.getElementById('appointment-details');
    
    // Show loading state
    detailsContainer.innerHTML = `
        <div class="text-center text-slate-500 py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-lg">Loading appointment details...</p>
        </div>
    `;
    
    fetch(`/apply-appointment/${appointmentId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayAppointmentDetails(data.appointment);
        } else {
            showError('Failed to load appointment details');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Error loading appointment details');
    });
}

function displayAppointmentDetails(appointment) {
    const detailsContainer = document.getElementById('appointment-details');
    
    // Determine status color
    let statusColor = getStatusColor(appointment.status);
    
    detailsContainer.innerHTML = `
        <div class="px-6 py-8">
            <!-- Tracking Number -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Tracking Number</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 font-medium text-primary">
                    ${appointment.tracking_number || 'N/A'}
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <!-- Category -->
                <div>
                    <label class="form-label text-base font-semibold text-slate-700">Category</label>
                    <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                        ${appointment.appointment_category ? appointment.appointment_category.category_name : 'N/A'}
                    </div>
                </div>
                
                <!-- Appointment Date -->
                <div>
                    <label class="form-label text-base font-semibold text-slate-700">Appointment Date</label>
                    <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                        ${appointment.appointment_date ? formatAppointmentDate(appointment.appointment_date) : 'N/A'}
                    </div>
                </div>
            </div>
            
            <!-- Appointment Time -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Appointment Time</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 font-medium">
                    ${appointment.time || 'N/A'}
                </div>
            </div>
            
            <!-- Description -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Description</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 min-h-24">
                    ${appointment.description || 'No description provided'}
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <!-- Status -->
                <div>
                    <label class="form-label text-base font-semibold text-slate-700">Status</label>
                    <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50">
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
                            ${appointment.status ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) : 'N/A'}
                        </span>
                    </div>
                </div>
                
                <!-- Submitted Date -->
                <div>
                    <label class="form-label text-base font-semibold text-slate-700">Submitted Date</label>
                    <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                        ${appointment.created_at ? formatAppointmentDate(appointment.created_at) : 'N/A'}
                    </div>
                </div>
            </div>
            
            <!-- Remarks -->
            ${appointment.remarks ? `
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Admin Remarks</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-yellow-50 text-slate-700 min-h-12">
                    ${appointment.remarks}
                </div>
            </div>
            ` : ''}
        </div>
    `;
}

function cancelAppointment(appointmentId) {
    // Show loading state
    const button = document.getElementById('confirmCancelAppointment');
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Cancelling...';
    button.disabled = true;

    fetch(`/apply-appointment/${appointmentId}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessToast(data.message || 'Appointment cancelled successfully');
            // Close modal
            const closeBtn = document.querySelector('#cancel-confirmation-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            // Reload page to show updated list
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showErrorToast(data.message || 'Failed to cancel appointment');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorToast('Error cancelling appointment. Please try again.');
    })
    .finally(() => {
        // Reset button state
        button.innerHTML = originalText;
        button.disabled = false;
    });
}

function filterAppointments() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#appointmentTable tbody tr');
    
    let visibleCount = 0;
    
    rows.forEach(row => {
        // Check if row has data-status attribute (actual data row, not empty state)
        if (!row.hasAttribute('data-status')) {
            return; // Skip empty/no-results rows
        }
        
        const trackingElement = row.querySelector('td:first-child .font-medium');
        const categoryElement = row.querySelector('td:nth-child(2) .font-medium');
        
        // Safety check - if elements don't exist, skip this row
        if (!trackingElement || !categoryElement) {
            return;
        }
        
        const trackingNumber = trackingElement.textContent.toLowerCase();
        const category = categoryElement.textContent.toLowerCase();
        
        if (trackingNumber.includes(searchTerm) || category.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount(visibleCount);
    toggleNoResultsMessage(visibleCount);
}

function updateFilteredCount(count) {
    const filteredCountElement = document.getElementById('filtered-count');
    if (filteredCountElement) {
        filteredCountElement.textContent = count;
    }
}

function toggleNoResultsMessage(visibleCount) {
    const noResultsRow = document.getElementById('no-results-row');
    const noAppointmentsRow = document.getElementById('no-appointments-row');
    const dataRows = document.querySelectorAll('#appointmentTable tbody tr[data-status]');
    
    // If there are data rows (appointments exist)
    if (dataRows.length > 0) {
        // Hide the "No appointments found" message
        if (noAppointmentsRow) {
            noAppointmentsRow.style.display = 'none';
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
        // No data rows exist, show "No appointments found"
        if (noAppointmentsRow) {
            noAppointmentsRow.style.display = '';
        }
        if (noResultsRow) {
            noResultsRow.classList.add('hidden');
            noResultsRow.style.display = 'none';
        }
    }
}

function getStatusColor(status) {
    switch(status) {
        case 'Approved': return 'bg-green-100 text-green-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Rejected': return 'bg-red-100 text-red-800';
        case 'Completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-slate-100 text-slate-800';
    }
}

function formatAppointmentDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
}

function showError(message) {
    const detailsContainer = document.getElementById('appointment-details');
    detailsContainer.innerHTML = `
        <div class="text-center text-slate-500 py-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-red-300">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <p class="text-lg text-red-600">${message}</p>
            <button type="button" data-tw-dismiss="modal" class="mt-4 btn btn-outline-secondary">Close</button>
        </div>
    `;
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

function fetchAvailableTimeSlots(selectedDate) {
    const timeSelect = document.getElementById('appointmentTime');
    const timeSlotInfo = document.getElementById('timeSlotInfo');
    
    if (!timeSelect) return;
    
    // Show loading state
    timeSelect.innerHTML = '<option value="">Loading available times...</option>';
    timeSelect.disabled = true;
    
    fetch('/apply-appointment/available-time-slots', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            appointment_date: selectedDate
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.time_slots && data.time_slots.length > 0) {
            // Populate time slots
            let options = '<option value="">Select Time</option>';
            data.time_slots.forEach(timeSlot => {
                options += `<option value="${timeSlot}">${timeSlot}</option>`;
            });
            timeSelect.innerHTML = options;
            timeSelect.disabled = false;
            
            if (timeSlotInfo) {
                timeSlotInfo.textContent = `${data.time_slots.length} time slots available`;
                timeSlotInfo.classList.remove('text-red-600');
                timeSlotInfo.classList.add('text-slate-500');
            }
        } else {
            // No time slots available
            timeSelect.innerHTML = '<option value="">No time slots available</option>';
            timeSelect.disabled = true;
            
            if (timeSlotInfo) {
                timeSlotInfo.textContent = data.message || 'No time slots available for this date';
                timeSlotInfo.classList.remove('text-slate-500');
                timeSlotInfo.classList.add('text-red-600');
            }
        }
    })
    .catch(error => {
        console.error('Error fetching time slots:', error);
        timeSelect.innerHTML = '<option value="">Error loading times</option>';
        timeSelect.disabled = true;
        
        if (timeSlotInfo) {
            timeSlotInfo.textContent = 'Error loading time slots. Please try again.';
            timeSlotInfo.classList.remove('text-slate-500');
            timeSlotInfo.classList.add('text-red-600');
        }
    });
}

function clearCreateFormErrors() {
    const errorDiv = document.getElementById('createFormErrors');
    const descriptionError = document.getElementById('descriptionError');
    const categoryError = document.getElementById('categoryError');
    const dateError = document.getElementById('dateError');
    const timeError = document.getElementById('timeError');
    const descriptionInput = document.getElementById('appointmentDescription');
    const categoryInput = document.getElementById('appointmentCategory');
    const dateInput = document.getElementById('appointmentDate');
    const timeInput = document.getElementById('appointmentTime');
    
    if (errorDiv) errorDiv.classList.add('hidden');
    if (descriptionError) descriptionError.classList.add('hidden');
    if (categoryError) categoryError.classList.add('hidden');
    if (dateError) dateError.classList.add('hidden');
    if (timeError) timeError.classList.add('hidden');
    if (descriptionInput) descriptionInput.classList.remove('border-red-500');
    if (categoryInput) categoryInput.classList.remove('border-red-500');
    if (dateInput) dateInput.classList.remove('border-red-500');
    if (timeInput) timeInput.classList.remove('border-red-500');
}

