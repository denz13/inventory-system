document.addEventListener('DOMContentLoaded', function() {
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

    // Event listeners for view, edit, and delete buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-tw-target="#view-incident-modal"]')) {
            const incidentId = e.target.dataset.incidentId;
            loadIncidentDetails(incidentId);
        }
        
        if (e.target.matches('[data-tw-target="#edit-incident-modal"]')) {
            const incidentId = e.target.dataset.incidentId;
            loadIncidentForEdit(incidentId);
        }
        
        if (e.target.matches('[data-tw-target="#delete-confirmation-modal"]')) {
            const incidentId = e.target.dataset.incidentId;
            document.getElementById('delete-incident-id').value = incidentId;
        }
    });

    // Load incident details for view modal
    function loadIncidentDetails(incidentId) {
        fetch(`/incident-reports/${incidentId}`)
            .then(response => response.json())
            .then(incident => {
                console.log('Incident data received:', incident);
                
                const detailsContainer = document.getElementById('incident-details');
                if (detailsContainer) {
                    detailsContainer.innerHTML = `
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">Person Involved</label>
                                <input type="text" class="form-control" value="${incident.person_involved_name || 'N/A'}" readonly>
                            </div>
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">Designation</label>
                                <input type="text" class="form-control" value="${incident.designation || 'N/A'}" readonly>
                            </div>
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">Street</label>
                                <input type="text" class="form-control" value="${incident.street || 'N/A'}" readonly>
                            </div>
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">House/Block/Lot No.</label>
                                <input type="text" class="form-control" value="${incident.address || 'N/A'}" readonly>
                            </div>
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">Date & Time of Incident</label>
                                <input type="text" class="form-control" value="${incident.datetime_of_incident ? new Date(incident.datetime_of_incident).toLocaleString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true 
                                }) : 'N/A'}" readonly>
                            </div>
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">Status</label>
                                <input type="text" class="form-control" value="${incident.status || 'N/A'}" readonly>
                            </div>
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">Assigned Guard</label>
                                <input type="text" class="form-control" value="${incident.assigned_guard?.name || 'Not assigned'}" readonly>
                            </div>
                            <div class="col-span-12">
                                <label class="form-label">Description of Incident</label>
                                <textarea class="form-control" rows="3" readonly>${incident.location_of_incident || 'N/A'}</textarea>
                            </div>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error loading incident details:', error);
                document.getElementById('incident-details').innerHTML = '<div class="text-center text-red-500">Error loading incident details</div>';
            });
    }

    // Load incident for editing
    function loadIncidentForEdit(incidentId) {
        fetch(`/incident-reports/${incidentId}`)
            .then(response => response.json())
            .then(incident => {
                document.getElementById('edit-incident-id').value = incident.id;
                document.getElementById('edit_person_involved_name').value = incident.person_involved_name || '';
                document.getElementById('edit_designation').value = incident.designation || '';
                document.getElementById('edit_street').value = incident.street || '';
                document.getElementById('edit_address').value = incident.address || '';
                document.getElementById('edit_datetime_of_incident').value = formatDateTimeForInput(incident.datetime_of_incident);
                document.getElementById('edit_guard_id').value = incident.guard_id || '';
                document.getElementById('edit_location_of_incident').value = incident.location_of_incident || '';
            })
            .catch(error => {
                console.error('Error loading incident for edit:', error);
                showToast('Error loading incident for editing. Please try again.', 'error');
            });
    }

    // Form submission for create incident
    document.getElementById('report-incident-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
        `;
        submitBtn.disabled = true;
        
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                showToast(data.message, 'success');
                
                // Close modal
                const modal = document.getElementById('report-incident-modal');
                if (modal) {
                    const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
                    if (dismissBtn) dismissBtn.click();
                }
                
                this.reset();
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else if (data.error) {
                showToast(data.error, 'error');
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            showToast('Error submitting incident report: ' + error.message, 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });

    // Edit incident form submission
    document.getElementById('edit-incident-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const incidentId = document.getElementById('edit-incident-id').value;
        const formData = new FormData(this);
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
        `;
        submitBtn.disabled = true;
        
        fetch(`/incident-reports/${incidentId}`, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                showToast(data.message, 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else if (data.error) {
                showToast(data.error, 'error');
            }
        })
        .catch(error => {
            console.error('Error updating incident:', error);
            showToast('Error updating incident: ' + error.message, 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });

    // Delete incident functionality
    document.getElementById('confirm-delete-incident').addEventListener('click', function() {
        const incidentId = document.getElementById('delete-incident-id').value;
        
        if (incidentId) {
            fetch(`/incident-reports/${incidentId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    showToast(data.message, 'success');
                    const modal = document.getElementById('delete-confirmation-modal');
                    if (modal) {
                        const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
                        if (dismissBtn) dismissBtn.click();
                    }
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })
            .catch(error => {
                console.error('Error deleting incident:', error);
                showToast('Error deleting incident: ' + error.message, 'error');
            });
        }
    });

    // Toast notification function (copied exactly from complaints system)
    function showToast(message, type = 'success') {
        const toastId = type === 'success' ? 'incident_toast_success' : 'incident_toast_error';
        
        if (type === 'error') {
            // Update error message slot
            const messageSlot = document.getElementById('incident-error-message-slot');
            if (messageSlot) {
                messageSlot.textContent = message;
            }
        }
        
        // Use your notification-toast component's show function
        try {
            if (window[`showNotification_${toastId}`]) {
                window[`showNotification_${toastId}`]();
            } else {
                // Fallback: use Toastify if available
                if (typeof Toastify !== 'undefined') {
                    Toastify({
                        text: message,
                        duration: 5000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: type === 'success' ? "#10b981" : "#ef4444",
                        stopOnFocus: true,
                    }).showToast();
                } else {
                    // Ultimate fallback
                    console.log(`${type.toUpperCase()}:`, message);
                }
            }
        } catch (error) {
            console.error('Error showing toast:', error);
            console.log(`${type.toUpperCase()}:`, message);
        }
    }

    // Helper function to format datetime for input
    function formatDateTimeForInput(dateTimeString) {
        if (!dateTimeString) return '';
        
        // Handle MySQL datetime "YYYY-MM-DD HH:MM:SS"
        if (typeof dateTimeString === 'string' && dateTimeString.includes(' ')) {
            return dateTimeString.replace(' ', 'T').slice(0, 16);
        }
        
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().slice(0, 16);
    }
});
