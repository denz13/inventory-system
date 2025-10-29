document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let currentStatusFilter = urlParams.get('status') || 'all';
    let currentLocationFilter = urlParams.get('location') || 'all';
    let currentDateFilter = urlParams.get('date_filter') || 'all';
    let searchTerm = urlParams.get('search') || '';
    
    // Initialize search functionality - Server-side (Enter key only)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = searchTerm; // Set initial value from URL
        
        // Search only when Enter key is pressed
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                applyServerSideFilters();
            }
        });
        
        // Also allow clicking the search icon to trigger search
        const searchIcon = searchInput.parentElement.querySelector('svg');
        if (searchIcon) {
            searchIcon.style.cursor = 'pointer';
            searchIcon.addEventListener('click', function() {
                applyServerSideFilters();
            });
        }
    }
    
    // Initialize filter functionality - Server-side
    initializeFilters();
    
    // Initialize modal handlers
    initializeModals();
    
    // Initialize form handlers
    initializeForms();
    
    // Universal filter handler - Server-side
    function initializeFilters() {
        document.addEventListener('click', function(e) {
            if (e.target.matches('[data-filter-type]')) {
                const filterType = e.target.getAttribute('data-filter-type');
                const filterValue = e.target.getAttribute('data-filter-value');
                
                const dropdown = e.target.closest('.dropdown');
                
                // Update the appropriate filter state and button
                if (filterType === 'status') {
                    currentStatusFilter = filterValue;
                    updateFilterButton('statusFilterBtn', filterValue === 'all' ? 'Status: All' : `Status: ${filterValue}`);
                } else if (filterType === 'location') {
                    currentLocationFilter = filterValue;
                    // Extract just the street name (before the first comma)
                    const streetName = filterValue === 'all' ? 'all' : filterValue.split(',')[0].trim();
                    const btnText = filterValue === 'all' ? 'Filter by Street' : `Street: ${streetName}`;
                    updateFilterButton('locationFilterBtn', btnText);
                } else if (filterType === 'date') {
                    currentDateFilter = filterValue;
                    const dateTexts = {
                        'all': 'Filter by Date',
                        'today': 'Date: Today',
                        'yesterday': 'Date: Yesterday',
                        'this-week': 'Date: This Week',
                        'last-week': 'Date: Last Week',
                        'this-month': 'Date: This Month',
                        'last-month': 'Date: Last Month',
                        'this-year': 'Date: This Year'
                    };
                    updateFilterButton('dateFilterBtn', dateTexts[filterValue] || 'Filter by Date');
                }
                
                // Apply all filters server-side
                applyServerSideFilters();
                
                // Close dropdown
                if (dropdown) {
                    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                    if (dropdownToggle) {
                        dropdownToggle.setAttribute('aria-expanded', 'false');
                        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                        if (dropdownMenu) {
                            dropdownMenu.classList.remove('show');
                        }
                    }
                }
            }
        });
        
        // Reset filters button
        const resetBtn = document.getElementById('resetFiltersBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                window.location.href = window.location.pathname;
            });
        }
    }
    
    // Update filter button text
    function updateFilterButton(buttonId, text) {
        const button = document.getElementById(buttonId);
        if (button) {
            // Preserve the icon
            const icon = button.querySelector('svg');
            button.textContent = text;
            if (icon) {
                button.insertBefore(icon, button.firstChild);
            }
        }
    }
    
    // Apply server-side filters by updating URL and reloading
    function applyServerSideFilters() {
        const url = new URL(window.location.href);
        const searchValue = searchInput ? searchInput.value.trim() : '';
        
        // Update URL parameters
        if (searchValue) {
            url.searchParams.set('search', searchValue);
        } else {
            url.searchParams.delete('search');
        }
        
        if (currentStatusFilter && currentStatusFilter !== 'all') {
            url.searchParams.set('status', currentStatusFilter);
        } else {
            url.searchParams.delete('status');
        }
        
        if (currentLocationFilter && currentLocationFilter !== 'all') {
            url.searchParams.set('location', currentLocationFilter);
        } else {
            url.searchParams.delete('location');
        }
        
        if (currentDateFilter && currentDateFilter !== 'all') {
            url.searchParams.set('date_filter', currentDateFilter);
        } else {
            url.searchParams.delete('date_filter');
        }
        
        // Reset to page 1 when filtering
        url.searchParams.delete('page');
        
        // Reload page with new parameters
        window.location.href = url.toString();
    }
    
    // Set initial filter button states from URL
    if (currentStatusFilter && currentStatusFilter !== 'all') {
        updateFilterButton('statusFilterBtn', `Status: ${currentStatusFilter}`);
    }
    if (currentLocationFilter && currentLocationFilter !== 'all') {
        // Extract just the street name (before the first comma)
        const streetName = currentLocationFilter.split(',')[0].trim();
        const btnText = `Street: ${streetName}`;
        updateFilterButton('locationFilterBtn', btnText);
    }
    if (currentDateFilter && currentDateFilter !== 'all') {
        const dateTexts = {
            'today': 'Date: Today',
            'yesterday': 'Date: Yesterday',
            'this-week': 'Date: This Week',
            'last-week': 'Date: Last Week',
            'this-month': 'Date: This Month',
            'last-month': 'Date: Last Month',
            'this-year': 'Date: This Year'
        };
        updateFilterButton('dateFilterBtn', dateTexts[currentDateFilter] || 'Filter by Date');
    }
});

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
                            <label class="form-label text-sm font-semibold text-slate-700">Street</label>
                            <input type="text" class="form-control mt-1" value="${report.street || 'N/A'}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">House/Block/Lot No.</label>
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
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        Description of Incident
                    </h3>
                    <div>
                        <label class="form-label text-sm font-semibold text-slate-700">Incident Description</label>
                        <textarea class="form-control mt-1" rows="4" readonly>${report.location_of_incident || 'N/A'}</textarea>
                        <div class="form-help mt-1">Detailed description of what happened</div>
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
