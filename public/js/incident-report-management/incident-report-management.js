document.addEventListener('DOMContentLoaded', function() {
    // Filter state
    let currentStatusFilter = 'all';
    let currentLocationFilter = 'all';
    let currentDateFilter = 'all';
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize filter functionality
    initializeFilters();
    
    // Initialize modal handlers
    initializeModals();
    
    // Initialize form handlers
    initializeForms();
    
    // Search functionality
    function initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                applyAllFilters();
            });
        }
    }
    
    // Universal filter handler
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
                    const btnText = filterValue === 'all' ? 'Filter by Location' : `Location: ${filterValue.substring(0, 20)}${filterValue.length > 20 ? '...' : ''}`;
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
                
                // Apply all filters
                applyAllFilters();
                
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
                currentStatusFilter = 'all';
                currentLocationFilter = 'all';
                currentDateFilter = 'all';
                
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = '';
                }
                
                // Reset button texts
                updateFilterButton('statusFilterBtn', 'Status: All');
                updateFilterButton('locationFilterBtn', 'Filter by Location');
                updateFilterButton('dateFilterBtn', 'Filter by Date');
                
                // Apply filters (which will show all)
                applyAllFilters();
                
                showSuccessToast('All filters have been reset');
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
    
    // Apply all filters
    function applyAllFilters() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
        const tableRows = Array.from(document.querySelectorAll('tbody tr.intro-x'));
        
        if (tableRows.length === 0) return;
        
        // Setup date ranges for filtering
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfWeek.getDate() - 7);
        
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        
        let visibleCount = 0;
        
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const rowStatus = row.getAttribute('data-status');
            const rowLocation = row.getAttribute('data-location');
            const rowDateStr = row.getAttribute('data-date');
            
            // Check search term
            const matchesSearch = searchTerm === '' || text.includes(searchTerm);
            
            // Check status filter
            const matchesStatus = currentStatusFilter === 'all' || rowStatus === currentStatusFilter;
            
            // Check location filter
            const matchesLocation = currentLocationFilter === 'all' || rowLocation === currentLocationFilter;
            
            // Check date filter
            let matchesDate = true;
            if (currentDateFilter !== 'all' && rowDateStr) {
                const rowDate = new Date(rowDateStr);
                
                if (!isNaN(rowDate.getTime())) {
                    switch (currentDateFilter) {
                        case 'today':
                            matchesDate = rowDate >= today;
                            break;
                        case 'yesterday':
                            matchesDate = rowDate >= yesterday && rowDate < today;
                            break;
                        case 'this-week':
                            matchesDate = rowDate >= startOfWeek;
                            break;
                        case 'last-week':
                            matchesDate = rowDate >= startOfLastWeek && rowDate < startOfWeek;
                            break;
                        case 'this-month':
                            matchesDate = rowDate >= startOfMonth;
                            break;
                        case 'last-month':
                            matchesDate = rowDate >= startOfLastMonth && rowDate < startOfMonth;
                            break;
                        case 'this-year':
                            matchesDate = rowDate >= startOfYear;
                            break;
                    }
                } else {
                    matchesDate = false;
                }
            }
            
            // Show/hide row based on all filters
            if (matchesSearch && matchesStatus && matchesLocation && matchesDate) {
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
        
        // Show/hide no results message
        updateNoResultsMessage(visibleCount, tableRows.length);
    }
    
    // Update no results message
    function updateNoResultsMessage(visibleCount, totalRows) {
        const tbody = document.querySelector('tbody');
        let noDataRow = document.querySelector('tbody tr.no-data-found');
        
        // Remove existing no data row if it exists
        if (noDataRow) {
            noDataRow.remove();
        }
        
        // Check if we should show "no results" message
        const hasActiveFilters = currentStatusFilter !== 'all' || currentLocationFilter !== 'all' || 
                                 currentDateFilter !== 'all' || 
                                 (document.getElementById('searchInput')?.value.trim() !== '');
        
        if (visibleCount === 0 && hasActiveFilters && totalRows > 0) {
            // Create new no data row
            noDataRow = document.createElement('tr');
            noDataRow.className = 'no-data-found';
            noDataRow.innerHTML = `
                <td colspan="8" class="text-center py-8">
                    <div class="text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <div class="font-medium">No incident reports found</div>
                        <div class="text-sm">No reports match your current filters. Try adjusting your filters.</div>
                    </div>
                </td>
            `;
            tbody.appendChild(noDataRow);
        }
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
