document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    initializeSearch();
    
    // Initialize filter functionality
    initializeFilters();
    
    // Initialize modal handlers
    initializeModals();
    
    // Initialize form handlers
    initializeForms();
});

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('tbody tr.intro-x');
            let visibleCount = 0;
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Update filtered count
            const filteredCountElement = document.getElementById('filtered-count');
            if (filteredCountElement) {
                filteredCountElement.textContent = visibleCount;
            }
        });
    }
}

function initializeFilters() {
    const filterItems = document.querySelectorAll('[data-filter]');
    
    filterItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            filterReportsByStatus(filter);
        });
    });
}

function filterReportsByStatus(status) {
    const tableRows = document.querySelectorAll('tbody tr.intro-x');
    let visibleCount = 0;
    
    tableRows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        
        if (status === 'all' || rowStatus === status) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update filtered count
    const filteredCountElement = document.getElementById('filtered-count');
    if (filteredCountElement) {
        filteredCountElement.textContent = visibleCount;
    }
    
    // Clear search input when filtering
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
}

function initializeModals() {
    // View report modal
    document.querySelectorAll('[data-tw-target="#view-report-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const reportId = this.getAttribute('data-report-id');
            loadReportDetails(reportId);
        });
    });
    
    // Update status modal
    document.querySelectorAll('[data-action="update-status"]').forEach(button => {
        button.addEventListener('click', function() {
            const reportId = this.getAttribute('data-report-id');
            openUpdateStatusModal(reportId);
        });
    });
    
    // Assign guard modal
    document.querySelectorAll('[data-action="assign-guard"]').forEach(button => {
        button.addEventListener('click', function() {
            const reportId = this.getAttribute('data-report-id');
            openAssignGuardModal(reportId);
        });
    });
}

function initializeForms() {
    // Update status form
    const updateStatusForm = document.getElementById('updateStatusForm');
    if (updateStatusForm) {
        updateStatusForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleStatusUpdate();
        });
    }
    
    // Assign guard form
    const assignGuardForm = document.getElementById('assignGuardForm');
    if (assignGuardForm) {
        assignGuardForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleGuardAssignment();
        });
    }
}

function loadReportDetails(reportId) {
    const reportDetailsDiv = document.getElementById('report-details');
    
    // Show loading state
    reportDetailsDiv.innerHTML = `
        <div class="text-center text-slate-500">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p>Loading report details...</p>
        </div>
    `;
    
    fetch(`/incident-report-management/${reportId}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayReportDetails(data.data);
        } else {
            throw new Error('Failed to load report details');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        reportDetailsDiv.innerHTML = `
            <div class="text-center text-red-500">
                <p>Error loading report details. Please try again.</p>
            </div>
        `;
    });
}

function displayReportDetails(report) {
    const reportDetailsDiv = document.getElementById('report-details');
    
    const incidentDate = report.datetime_of_incident ? 
        new Date(report.datetime_of_incident).toLocaleString() : 'N/A';
    const reportDate = report.created_at ? 
        new Date(report.created_at).toLocaleString() : 'N/A';
    
    const statusColor = getStatusColor(report.status);
    
    reportDetailsDiv.innerHTML = `
        <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Reporter Information -->
                <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 class="font-semibold text-lg mb-6 text-blue-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Reporter Information
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Reporter Name</label>
                            <input type="text" class="form-control mt-1" value="${report.user?.name || 'N/A'}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Email Address</label>
                            <input type="text" class="form-control mt-1" value="${report.user?.email || 'N/A'}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Current Status</label>
                            <input type="text" class="form-control mt-1 ${statusColor}" value="${report.status || 'N/A'}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Date Reported</label>
                            <input type="text" class="form-control mt-1" value="${reportDate}" readonly>
                        </div>
                    </div>
                </div>
                
                <!-- Incident Details -->
                <div class="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h3 class="font-semibold text-lg mb-6 text-orange-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        Incident Details
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Person Involved</label>
                            <input type="text" class="form-control mt-1" value="${report.person_involved_name || 'N/A'}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Designation/Position</label>
                            <input type="text" class="form-control mt-1" value="${report.designation || 'N/A'}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Address</label>
                            <input type="text" class="form-control mt-1" value="${report.address || 'N/A'}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Incident Date & Time</label>
                            <input type="text" class="form-control mt-1" value="${incidentDate}" readonly>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Location and Assignment Info -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div class="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 class="font-semibold text-lg mb-6 text-green-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        Location Information
                    </h3>
                    <div>
                        <label class="form-label text-sm font-semibold text-slate-700">Incident Location</label>
                        <input type="text" class="form-control mt-1" value="${report.location_of_incident || 'N/A'}" readonly>
                        <div class="form-help mt-1">Exact location where the incident occurred</div>
                    </div>
                </div>
                
                ${report.assigned_guard ? `
                    <div class="bg-purple-50 p-6 rounded-lg border border-purple-200">
                        <h3 class="font-semibold text-lg mb-6 text-purple-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Assigned Security Guard
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="form-label text-sm font-semibold text-slate-700">Guard Name</label>
                                <input type="text" class="form-control mt-1" value="${report.assigned_guard.name}" readonly>
                            </div>
                            <div>
                                <label class="form-label text-sm font-semibold text-slate-700">Guard Email</label>
                                <input type="text" class="form-control mt-1" value="${report.assigned_guard.email}" readonly>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 class="font-semibold text-lg mb-6 text-gray-600 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Security Assignment
                        </h3>
                        <div class="text-center py-8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-gray-400">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <p class="text-gray-600 font-medium">No Security Guard Assigned</p>
                            <p class="text-sm text-gray-500">This incident is pending guard assignment</p>
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
}

function getStatusColor(status) {
    switch(status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Under Investigation': return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'Resolved': return 'bg-green-100 text-green-800 border-green-300';
        case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
}

function openUpdateStatusModal(reportId) {
    document.getElementById('updateReportId').value = reportId;
    
    // Get current status from the table row
    const row = document.querySelector(`[data-report-id="${reportId}"]`).closest('tr');
    const currentStatus = row.getAttribute('data-status');
    document.getElementById('currentStatus').textContent = currentStatus || 'N/A';
}

function openAssignGuardModal(reportId) {
    document.getElementById('assignReportId').value = reportId;
}

function handleStatusUpdate() {
    const reportId = document.getElementById('updateReportId').value;
    const formData = new FormData(document.getElementById('updateStatusForm'));
    
    fetch(`/incident-report-management/${reportId}/status`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]').value
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessToast('Status updated successfully');
            // Close modal by clicking the close button
            const closeBtn = document.querySelector('#update-status-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            // Reload page to show updated data
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showErrorToast(data.message || 'Failed to update status');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorToast('An error occurred while updating status');
    });
}

function handleGuardAssignment() {
    const reportId = document.getElementById('assignReportId').value;
    const formData = new FormData(document.getElementById('assignGuardForm'));
    
    fetch(`/incident-report-management/${reportId}/assign`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]').value
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessToast('Guard assigned successfully');
            // Close modal by clicking the close button
            const closeBtn = document.querySelector('#assign-guard-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            // Reload page to show updated data
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showErrorToast(data.message || 'Failed to assign guard');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorToast('An error occurred while assigning guard');
    });
}

// Toast notification function
function showToast(message, type = 'success') {
    const toastId = type === 'success' ? 'incident_report_management_toast_success' : 'incident_report_management_toast_error';
    
    if (type === 'error') {
        // Update error message slot
        const messageSlot = document.getElementById('incident_report_management_error_message_slot');
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

function showSuccessToast(message) {
    showToast(message, 'success');
}

function showErrorToast(message) {
    showToast(message, 'error');
}
