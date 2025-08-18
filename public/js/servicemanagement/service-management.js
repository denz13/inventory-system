document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterServiceRequests(searchTerm);
        });
    }

    // Filter service requests based on search term
    function filterServiceRequests(searchTerm) {
        const requestRows = document.querySelectorAll('tbody tr.intro-x');
        let visibleCount = 0;

        requestRows.forEach(row => {
            const requestText = row.textContent.toLowerCase();
            const isVisible = requestText.includes(searchTerm);
            
            if (searchTerm === '') {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = isVisible ? '' : 'none';
                if (isVisible) visibleCount++;
            }
        });

        // Update "No requests found" message
        updateNoRequestsMessage(searchTerm, visibleCount);
        
        // Show search results count
        updateSearchResultsCount(searchTerm, visibleCount);
    }

    // Update "No requests found" message based on search
    function updateNoRequestsMessage(searchTerm, visibleCount) {
        const visibleRows = document.querySelectorAll('tbody tr.intro-x:not([style*="display: none"])');
        const noRequestsRow = document.querySelector('tbody tr:not(.intro-x)');
        
        if (visibleRows.length === 0 && searchTerm !== '') {
            if (noRequestsRow) {
                noRequestsRow.style.display = '';
                noRequestsRow.querySelector('td').textContent = `No service requests found matching "${searchTerm}"`;
            } else {
                // Create no data row if it doesn't exist
                const tbody = document.querySelector('tbody');
                const noDataRow = document.createElement('tr');
                noDataRow.className = 'no-data-found';
                noDataRow.innerHTML = `
                    <td colspan="7" class="text-center py-8">
                        <div class="text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <div class="font-medium">No service requests found matching "${searchTerm}"</div>
                            <div class="text-sm">Try adjusting your search terms</div>
                        </div>
                    </td>
                `;
                tbody.appendChild(noDataRow);
            }
        } else if (noRequestsRow) {
            noRequestsRow.style.display = 'none';
        }
    }

    // Show search results count
    function updateSearchResultsCount(searchTerm, visibleCount) {
        const resultsCount = document.getElementById('searchResultsCount');
        if (resultsCount) {
            if (searchTerm !== '') {
                resultsCount.textContent = `Found ${visibleCount} service request(s) matching "${searchTerm}"`;
                resultsCount.style.display = 'block';
            } else {
                resultsCount.style.display = 'none';
            }
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
                // Show success message
                alert('Status updated successfully!');
                // Close modal and reload page
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error updating status:', error);
            alert('Error updating status. Please try again.');
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
});
