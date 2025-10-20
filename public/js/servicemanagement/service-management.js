document.addEventListener('DOMContentLoaded', function() {
    let currentStatusFilter = 'all';
    let currentNameSort = 'default';
    let currentDateFilter = 'all';
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            applyFiltersAndSort();
        });
    }

    // Universal filter handler for all filter types
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-filter-type]')) {
            const filterType = e.target.getAttribute('data-filter-type');
            const filterValue = e.target.getAttribute('data-filter-value');
            
            console.log('Filter clicked:', filterType, filterValue);
            
            const dropdown = e.target.closest('.dropdown');
            
            // Update the appropriate filter/sort state and button
            if (filterType === 'status') {
                currentStatusFilter = filterValue;
                updateFilterButton('statusFilterBtn', filterValue === 'all' ? 'Status: All' : `Status: ${filterValue}`);
            } else if (filterType === 'name-sort') {
                currentNameSort = filterValue;
                const btnText = filterValue === 'default' ? 'Name' : `Name: ${filterValue.toUpperCase()}`;
                updateFilterButton('nameSortBtn', btnText);
            } else if (filterType === 'date-filter') {
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
                updateFilterButton('dateSortBtn', dateTexts[filterValue] || 'Filter by Date');
            }
            
            // Apply all filters and sorting
            applyFiltersAndSort();
            
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
    document.getElementById('resetFiltersBtn')?.addEventListener('click', function() {
        currentStatusFilter = 'all';
        currentNameSort = 'default';
        currentDateFilter = 'all';
        
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset button texts
        updateFilterButton('statusFilterBtn', 'Status: All');
        updateFilterButton('nameSortBtn', 'Name');
        updateFilterButton('dateSortBtn', 'Filter by Date');
        
        // Apply filters (which will show all)
        applyFiltersAndSort();
        
        showToast('All filters have been reset', 'success');
    });

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

    // Main function to apply all filters and sorting
    function applyFiltersAndSort() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const tbody = document.querySelector('tbody');
        const requestRows = Array.from(document.querySelectorAll('tbody tr.intro-x'));
        
        if (requestRows.length === 0) return;
        
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
        
        // Step 1: Filter rows
        let visibleRows = requestRows.filter(row => {
            const requestText = row.textContent.toLowerCase();
            const statusCell = row.querySelector('td:nth-child(5)'); // Status column
            const status = statusCell ? statusCell.textContent.trim() : '';
            
            // Check if row matches search term and status filter
            const matchesSearch = searchTerm === '' || requestText.includes(searchTerm);
            const matchesStatus = currentStatusFilter === 'all' || status === currentStatusFilter;
            
            // Date filter check
            let matchesDate = true;
            if (currentDateFilter !== 'all') {
                const dateAttr = row.getAttribute('data-date');
                const rowDate = dateAttr ? new Date(dateAttr) : null;
                
                if (rowDate && !isNaN(rowDate.getTime())) {
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
                        default:
                            matchesDate = true;
                    }
                } else {
                    matchesDate = false;
                }
            }
            
            return matchesSearch && matchesStatus && matchesDate;
        });
        
        // Step 2: Sort visible rows by name if applicable
        if (currentNameSort !== 'default') {
            visibleRows.sort((a, b) => {
                const nameA = a.querySelector('td:nth-child(1) .font-medium')?.textContent.trim().toLowerCase() || '';
                const nameB = b.querySelector('td:nth-child(1) .font-medium')?.textContent.trim().toLowerCase() || '';
                
                if (currentNameSort === 'a-z') {
                    return nameA.localeCompare(nameB);
                } else { // z-a
                    return nameB.localeCompare(nameA);
                }
            });
        }
        
        // Step 3: Hide all rows first
        requestRows.forEach(row => {
            row.style.display = 'none';
        });
        
        // Step 4: Show and reorder visible rows
        visibleRows.forEach((row, index) => {
            row.style.display = '';
            tbody.appendChild(row); // Move to end (reorder)
        });
        
        // Update "No requests found" message
        updateNoRequestsMessage(searchTerm, currentStatusFilter, visibleRows.length);
        
        // Update filtered count display
        updateFilteredCount(visibleRows.length);
    }

    // Update "No requests found" message based on search
    function updateNoRequestsMessage(searchTerm, statusFilter, visibleCount) {
        const tbody = document.querySelector('tbody');
        const allDataRows = document.querySelectorAll('tbody tr.intro-x');
        let noDataRow = document.querySelector('tbody tr.no-data-found');
        
        // Remove existing no data row if it exists
        if (noDataRow) {
            noDataRow.remove();
        }
        
        // Check if we should show "no results" message
        const hasActiveFilters = searchTerm !== '' || currentStatusFilter !== 'all' || currentNameSort !== 'default' || currentDateFilter !== 'all';
        
        if (visibleCount === 0 && hasActiveFilters && allDataRows.length > 0) {
            // Create new no data row
            noDataRow = document.createElement('tr');
            noDataRow.className = 'no-data-found';
            noDataRow.innerHTML = `
                <td colspan="7" class="text-center py-8">
                    <div class="text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <div class="font-medium">No service requests found</div>
                        <div class="text-sm">No service requests match your current filters. Try adjusting your filters.</div>
                    </div>
                </td>
            `;
            tbody.appendChild(noDataRow);
        }
    }

    // Update filtered count display
    function updateFilteredCount(visibleCount) {
        const filteredCount = document.getElementById('filtered-count');
        if (filteredCount) {
            filteredCount.textContent = visibleCount;
        }
    }

    // Event listeners for view and update status buttons
    document.addEventListener('click', function(e) {
        console.log('Click event detected:', e.target);
        
        if (e.target.closest('[data-tw-toggle="modal"]')) {
            const modalTarget = e.target.closest('[data-tw-toggle="modal"]').getAttribute('data-tw-target');
            const requestId = e.target.closest('[data-tw-toggle="modal"]').getAttribute('data-request-id');
            
            console.log('Modal target:', modalTarget);
            console.log('Request ID:', requestId);
            
            if (modalTarget === '#view-request-modal' && requestId) {
                console.log('Loading view modal for request:', requestId);
                loadRequestDetails(requestId);
            } else if (modalTarget === '#update-status-modal' && requestId) {
                console.log('Loading update status modal for request:', requestId);
                loadRequestForStatusUpdate(requestId);
            }
        }
    });

    // Event listeners for approve/decline actions
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-action="approve"]')) {
            const requestId = e.target.getAttribute('data-request-id');
            console.log('Approve clicked for request ID:', requestId);
            approveRequest(requestId);
        }
        
        if (e.target.matches('[data-action="decline"]')) {
            const requestId = e.target.getAttribute('data-request-id');
            console.log('Decline clicked for request ID:', requestId);
            declineRequest(requestId);
        }
    });

    // Approve request function
    function approveRequest(requestId) {
        console.log('approveRequest called with ID:', requestId);
        
        // Set the request ID first
        const approveIdInput = document.getElementById('approveRequestId');
        if (approveIdInput) {
            approveIdInput.value = requestId;
            console.log('Approve Request ID set to:', approveIdInput.value);
        } else {
            console.error('approveRequestId input not found!');
            return;
        }
        
        // Check if modal exists
        const modal = document.getElementById('approve-confirmation-modal');
        if (!modal) {
            console.error('approve-confirmation-modal not found!');
            return;
        }
        console.log('Approve modal found:', modal);
        
        // Use Tailwind's modal system properly
        // Create a temporary button with data-tw-toggle and data-tw-target
        const tempButton = document.createElement('button');
        tempButton.setAttribute('data-tw-toggle', 'modal');
        tempButton.setAttribute('data-tw-target', '#approve-confirmation-modal');
        tempButton.style.display = 'none';
        
        // Add to DOM, click it, then remove it
        document.body.appendChild(tempButton);
        tempButton.click();
        document.body.removeChild(tempButton);
        
        console.log('Modal should now be visible using Tailwind system');
    }

    // Decline request function
    function declineRequest(requestId) {
        console.log('declineRequest called with ID:', requestId);
        
        // Set the request ID first
        const declineIdInput = document.getElementById('declineRequestId');
        if (declineIdInput) {
            declineIdInput.value = requestId;
            console.log('Decline Request ID set to:', declineIdInput.value);
        } else {
            console.error('declineRequestId input not found!');
            return;
        }
        
        // Check if modal exists
        const modal = document.getElementById('decline-reason-modal');
        if (!modal) {
            console.error('decline-reason-modal not found!');
            return;
        }
        console.log('Decline modal found:', modal);
        
        // Use Tailwind's modal system properly
        // Create a temporary button with data-tw-toggle and data-tw-target
        const tempButton = document.createElement('button');
        tempButton.setAttribute('data-tw-toggle', 'modal');
        tempButton.setAttribute('data-tw-target', '#decline-reason-modal');
        tempButton.style.display = 'none';
        
        // Add to DOM, click it, then remove it
        document.body.appendChild(tempButton);
        tempButton.click();
        document.body.removeChild(tempButton);
        
        console.log('Modal should now be visible using Tailwind system');
    }

    // Load request details for view modal
    function loadRequestDetails(requestId) {
        console.log('Loading request details for ID:', requestId);
        
        fetch(`/service-management/${requestId}`)
            .then(response => {
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                return response.json();
            })
            .then(request => {
                console.log('=== SERVICE MANAGEMENT DEBUG ===');
                console.log('Full request object:', request);
                console.log('User data:', request.user);
                console.log('Service Category data:', request.serviceCategory);
                console.log('Service Category Type:', request.serviceCategory?.serviceType);
                console.log('Service Category Category:', request.serviceCategory?.category);
                console.log('Direct serviceType access:', request.serviceType);
                console.log('=== END DEBUG ===');
                
                // Safely extract values with fallbacks based on actual data structure
                const serviceType = request.service_category?.service_type?.type || 'N/A';
                const category = request.service_category?.category || 'N/A';
                const userName = request.user?.name || 'N/A';
                const userEmail = request.user?.email || 'N/A';
                const description = request.complaint_description || 'N/A';
                const status = request.status || 'N/A';
                const dateSubmitted = request.created_at ? formatDateHuman(request.created_at) : 'N/A';
                
                const detailsContainer = document.getElementById('request-details');
                if (detailsContainer) {
                    detailsContainer.innerHTML = `
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">Homeowner</label>
                                <input type="text" class="form-control" value="${userName}" readonly>
                            </div>
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">Email</label>
                                <input type="text" class="form-control" value="${userEmail}" readonly>
                            </div>
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">Service Type</label>
                                <input type="text" class="form-control" value="${serviceType}" readonly>
                            </div>
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">Category</label>
                                <input type="text" class="form-control" value="${category}" readonly>
                            </div>
                            <div class="col-span-12">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" rows="4" readonly>${description}</textarea>
                            </div>
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">Status</label>
                                <input type="text" class="form-control" value="${status}" readonly>
                            </div>
                            <div class="col-span-12 md:col-span-6">
                                <label class="form-label">Date Submitted</label>
                                <div class="form-control bg-slate-50">${dateSubmitted}</div>
                            </div>
                        </div>
                    `;
                } else {
                    console.error('Details container not found');
                }
            })
            .catch(error => {
                console.error('Error loading request details:', error);
                // Show error message in modal
                const detailsContainer = document.getElementById('request-details');
                if (detailsContainer) {
                    detailsContainer.innerHTML = `
                        <div class="text-center text-danger">
                            <p>Error loading request details. Please try again.</p>
                            <p class="text-sm">${error.message}</p>
                        </div>
                    `;
                }
            });
    }

    // Load request for status update
    function loadRequestForStatusUpdate(requestId) {
        fetch(`/service-management/${requestId}`)
            .then(response => response.json())
            .then(request => {
                document.getElementById('updateRequestId').value = requestId;
                document.getElementById('currentStatus').textContent = request.status || 'N/A';
            })
            .catch(error => {
                console.error('Error loading request for status update:', error);
            });
    }

    // Handle status update form submission
    document.getElementById('updateStatusForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const requestId = document.getElementById('updateRequestId').value;
        
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
        
        fetch(`/service-management/${requestId}`, {
            method: 'PUT',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                // Show success notification
                showToast(data.message, 'success');
                // Close modal and reload page after delay
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else if (data.error) {
                // Show error notification
                showToast(data.error, 'error');
            }
        })
        .catch(error => {
            console.error('Error updating status:', error);
            // Show error notification
            showToast('Error updating status. Please try again.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });

    // Test function for modal
    window.testModal = function() {
        console.log('Test modal function called');
        const detailsContainer = document.getElementById('request-details');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <div class="text-center text-success">
                    <p>Modal is working! JavaScript is loaded correctly.</p>
                    <p class="text-sm">Now try clicking a "View" button on a service request row.</p>
                </div>
            `;
        }
    };

    // Test function for notifications
    window.testNotification = function() {
        console.log('Testing notification system...');
        
        // Test success notification
        showToast('This is a test success message for service management!', 'success');
        
        // Test error notification after 2 seconds
        setTimeout(() => {
            showToast('This is a test error message for service management!', 'error');
        }, 2000);
        
        // Debug: Check if notification functions exist
        console.log('Success notification function exists:', !!window.showNotification_service_management_toast_success);
        console.log('Error notification function exists:', !!window.showNotification_service_management_toast_error);
        
        // Debug: Check notification toast elements
        const successToast = document.getElementById('service_management_toast_success');
        const errorToast = document.getElementById('service_management_toast_error');
        console.log('Success toast element:', successToast);
        console.log('Error toast element:', errorToast);
    };

    // Toast notification function (copied exactly from complaints system)
    function showToast(message, type = 'success') {
        const toastId = type === 'success' ? 'service_management_toast_success' : 'service_management_toast_error';
        
        if (type === 'success') {
            // Update success message slot with the actual success message
            const successMessageSlot = document.getElementById('service-management-success-message-slot');
            if (successMessageSlot) {
                successMessageSlot.textContent = message;
            }
        } else if (type === 'error') {
            // Update error message slot with the actual error message
            const errorMessageSlot = document.getElementById('service-management-error-message-slot');
            if (errorMessageSlot) {
                errorMessageSlot.textContent = message;
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
                        duration: 2000,
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

    // Confirm approve function
    window.confirmApprove = function() {
        const requestId = document.getElementById('approveRequestId').value;
        
        // Show loading state
        const approveBtn = document.querySelector('#approve-confirmation-modal .btn-success');
        const originalText = approveBtn.innerHTML;
        approveBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Approving...
        `;
        approveBtn.disabled = true;
        
        fetch(`/service-management/${requestId}/approve`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                // Show success notification
                showToast(data.message, 'success');
                // Close modal and reload page after delay
                const modal = document.getElementById('approve-confirmation-modal');
                if (modal) {
                    const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
                    if (dismissBtn) dismissBtn.click();
                }
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else if (data.error) {
                // Show error notification
                showToast(data.error, 'error');
            }
        })
        .catch(error => {
            console.error('Error approving request:', error);
            // Show error notification
            showToast('Error approving request. Please try again.', 'error');
        })
        .finally(() => {
            // Reset button state
            approveBtn.innerHTML = originalText;
            approveBtn.disabled = false;
        });
    };

    // Confirm decline function
    window.confirmDecline = function() {
        const requestId = document.getElementById('declineRequestId').value;
        const reason = document.getElementById('declineReason').value;
        
        if (!reason.trim()) {
            // Show error notification for missing reason
            showToast('Please provide a reason for declining.', 'error');
            return;
        }
        
        // Show loading state
        const declineBtn = document.querySelector('#decline-reason-modal .btn-danger');
        const originalText = declineBtn.innerHTML;
        declineBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Declining...
        `;
        declineBtn.disabled = true;
        
        const formData = new FormData();
        formData.append('reason', reason);
        formData.append('_token', document.querySelector('input[name="_token"]').value);
        
        fetch(`/service-management/${requestId}/decline`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                // Show success notification
                showToast(data.message, 'success');
                // Close modal and reload page after delay
                const modal = document.getElementById('decline-reason-modal');
                if (modal) {
                    const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
                    if (dismissBtn) dismissBtn.click();
                }
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else if (data.error) {
                // Show error notification
                showToast(data.error, 'error');
            }
        })
        .catch(error => {
            console.error('Error declining request:', error);
            // Show error notification
            showToast('Error declining request. Please try again.', 'error');
        })
        .finally(() => {
            // Reset button state
            declineBtn.innerHTML = originalText;
            declineBtn.disabled = false;
        });
    };

    // Format date to human readable format (like "Yesterday", "2 days ago", etc.)
    function formatDateHuman(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        // Format full date for display
        const fullDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        let humanReadable = '';
        
        if (diffSecs < 60) {
            humanReadable = 'Just now';
        } else if (diffMins < 60) {
            humanReadable = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            humanReadable = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays === 1) {
            humanReadable = 'Yesterday';
        } else if (diffDays < 7) {
            humanReadable = `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            humanReadable = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            humanReadable = `${months} month${months > 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(diffDays / 365);
            humanReadable = `${years} year${years > 1 ? 's' : ''} ago`;
        }
        
        return `<div class="text-slate-700">${humanReadable}</div><div class="text-slate-500 text-xs">${fullDate}</div>`;
    }
});
