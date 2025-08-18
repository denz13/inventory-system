document.addEventListener('DOMContentLoaded', function() {
    let currentFilter = 'all';
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterServiceRequests(searchTerm, currentFilter);
        });
    }

    // Status filter functionality
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-filter]')) {
            const filterValue = e.target.getAttribute('data-filter');
            currentFilter = filterValue;
            
            console.log('Filter selected:', filterValue);
            
            // Update filter button text - use more robust selector
            let filterBtn = null;
            
            // Try to find the button in the same dropdown
            const dropdown = e.target.closest('.dropdown');
            if (dropdown) {
                filterBtn = dropdown.querySelector('.dropdown-toggle');
                console.log('Found dropdown, looking for button inside');
            }
            
            // If not found in dropdown, try to find by looking for the filter button
            if (!filterBtn) {
                filterBtn = document.querySelector('.dropdown-toggle.btn.btn-primary');
                console.log('Looking for filter button by class');
            }
            
            console.log('Filter button found:', !!filterBtn);
            console.log('Filter button element:', filterBtn);
            
            if (filterBtn) {
                console.log('Button before update:', filterBtn.textContent);
                console.log('Button HTML before update:', filterBtn.innerHTML);
                
                if (filterValue === 'all') {
                    filterBtn.textContent = 'Filter';
                } else {
                    filterBtn.textContent = `Filter: ${filterValue}`;
                }
                console.log('Filter button text updated to:', filterBtn.textContent);
                console.log('Button HTML after update:', filterBtn.innerHTML);
                
                // Verify the update by checking the DOM again
                setTimeout(() => {
                    const verifyBtn = document.querySelector('.dropdown-toggle.btn.btn-primary');
                    if (verifyBtn) {
                        console.log('Verification - Button text after update:', verifyBtn.textContent);
                        console.log('Verification - Button HTML after update:', verifyBtn.innerHTML);
                    }
                }, 100);
            } else {
                console.error('Filter button not found!');
            }
            
            // Apply filter
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            filterServiceRequests(searchTerm, currentFilter);
            
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

    // Filter service requests based on search term and status
    function filterServiceRequests(searchTerm, statusFilter) {
        const requestRows = document.querySelectorAll('tbody tr.intro-x');
        let visibleCount = 0;

        requestRows.forEach(row => {
            const requestText = row.textContent.toLowerCase();
            const statusCell = row.querySelector('td:nth-child(5)'); // Status column
            const status = statusCell ? statusCell.textContent.trim() : '';
            
            // Check if row matches both search term and status filter
            const matchesSearch = requestText.includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || status === statusFilter;
            
            const isVisible = matchesSearch && matchesStatus;
            
            if (searchTerm === '' && statusFilter === 'all') {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = isVisible ? '' : 'none';
                if (isVisible) visibleCount++;
            }
        });

        // Update "No requests found" message
        updateNoRequestsMessage(searchTerm, statusFilter, visibleCount);
        
        // Update filtered count display
        updateFilteredCount(visibleCount);
    }

    // Update "No requests found" message based on search
    function updateNoRequestsMessage(searchTerm, statusFilter, visibleCount) {
        const visibleRows = document.querySelectorAll('tbody tr.intro-x:not([style*="display: none"])');
        let noDataRow = document.querySelector('tbody tr.no-data-found');
        
        // Remove existing no data row if it exists
        if (noDataRow) {
            noDataRow.remove();
        }
        
        if (visibleCount === 0 && (searchTerm !== '' || statusFilter !== 'all')) {
            // Create new no data row
            const tbody = document.querySelector('tbody');
            noDataRow = document.createElement('tr');
            noDataRow.className = 'no-data-found';
            noDataRow.innerHTML = `
                <td colspan="7" class="text-center py-8">
                    <div class="text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <div class="font-medium">No service requests found</div>
                        <div class="text-sm">No service requests match your current filter</div>
                    </div>
                </td>
            `;
            tbody.appendChild(noDataRow);
        }
    }

    // Update filtered count display
    function updateFilteredCount(visibleCount) {
        const filteredCount = document.getElementById('filteredCount');
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
                const dateSubmitted = request.created_at ? new Date(request.created_at).toLocaleString() : 'N/A';
                
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
                                <input type="text" class="form-control" value="${dateSubmitted}" readonly>
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
});
