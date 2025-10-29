document.addEventListener('DOMContentLoaded', function() {
    // Initialize filter states from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const currentSearch = urlParams.get('search') || '';
    const currentStatusFilter = urlParams.get('status') || 'all';
    
    // Initialize search input value from URL
    const searchInput = document.getElementById('searchInput');
    if (searchInput && currentSearch) {
        searchInput.value = currentSearch;
    }
    
    // Update filter button texts from URL parameters
    updateFilterButtonTexts();
    
    // Search functionality - trigger on Enter key or after typing stops
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performServerSideSearch();
            }
        });
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performServerSideSearch();
            }, 500);
        });
    }

    // Universal filter handler - Server-side filtering
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-filter-type]')) {
            const filterType = e.target.getAttribute('data-filter-type');
            const filterValue = e.target.getAttribute('data-filter-value');
            
            // Apply server-side filter
            applyServerSideFilter(filterType, filterValue);
        }
    });

    // Reset filters button - Server-side reset
    document.getElementById('resetFiltersBtn')?.addEventListener('click', function() {
        // Redirect to page without any filters
        window.location.href = window.location.pathname;
    });
    
    // Perform server-side search
    function performServerSideSearch() {
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        const urlParams = new URLSearchParams(window.location.search);
        
        if (searchTerm) {
            urlParams.set('search', searchTerm);
        } else {
            urlParams.delete('search');
        }
        
        // Reset to page 1 when searching
        urlParams.delete('page');
        
        // Redirect with new search parameter
        window.location.search = urlParams.toString();
    }
    
    // Apply server-side filter
    function applyServerSideFilter(filterType, filterValue) {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (filterValue === 'all') {
            urlParams.delete(filterType);
        } else {
            urlParams.set(filterType, filterValue);
        }
        
        // Reset to page 1 when filtering
        urlParams.delete('page');
        
        // Redirect with new filter parameters
        window.location.search = urlParams.toString();
    }
    
    // Update filter button texts from URL parameters
    function updateFilterButtonTexts() {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status') || 'all';
        
        // Update status button
        const statusText = status === 'all' ? 'Status: All' : `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        updateFilterButton('statusFilterBtn', statusText);
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

    // Handle Add Business Form
    const addForm = document.getElementById('addBusinessForm');
    if (addForm) {
        addForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch('/business', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                                       document.querySelector('input[name="_token"]')?.value,
                        'Accept': 'application/json'
                    },
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showToast(data.message || 'Business added successfully!', 'success');
                    
                    // Close modal
                    const closeBtn = document.querySelector('#add-user-modal [data-tw-dismiss="modal"]');
                    if (closeBtn) closeBtn.click();
                    
                    // Reset form
                    addForm.reset();
                    document.getElementById('createFileInfo').style.display = 'none';
                    
                    // Reload page
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    showToast(data.message || 'Failed to add business', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Error adding business. Please try again.', 'error');
            }
        });
    }

    // Handle View Business
    document.querySelectorAll('[data-tw-target="#view-business-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const businessId = this.getAttribute('data-request-id');
            loadBusinessDetails(businessId);
        });
    });

    // Handle Edit Business
    document.querySelectorAll('[data-action="edit"]').forEach(button => {
        button.addEventListener('click', function() {
            const businessId = this.getAttribute('data-id');
            loadBusinessForEdit(businessId);
        });
    });

    // Handle Delete Business
    document.querySelectorAll('[data-action="delete"]').forEach(button => {
        button.addEventListener('click', function() {
            const businessId = this.getAttribute('data-id');
            document.getElementById('deleteBusinessId').value = businessId;
        });
    });

    // Confirm delete
    document.getElementById('confirmDeleteBusiness')?.addEventListener('click', async function() {
        const businessId = document.getElementById('deleteBusinessId').value;
        
        try {
            const response = await fetch(`/business/${businessId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                showToast(data.message || 'Business deleted successfully', 'success');
                
                // Close modal
                const closeBtn = document.querySelector('#delete-business-modal [data-tw-dismiss="modal"]');
                if (closeBtn) closeBtn.click();
                
                // Reload page
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                showToast(data.message || 'Failed to delete business', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error deleting business', 'error');
        }
    });

    // Handle Edit Form Submission
    const editForm = document.getElementById('editBusinessForm');
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const businessId = document.getElementById('editBusinessId').value;
            const formData = new FormData(this);
            formData.append('_method', 'PUT');
            
            try {
                const response = await fetch(`/business/${businessId}`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                                       document.querySelector('input[name="_token"]')?.value,
                        'Accept': 'application/json'
                    },
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showToast(data.message || 'Business updated successfully!', 'success');
                    
                    // Close modal
                    const closeBtn = document.querySelector('#edit-business-modal [data-tw-dismiss="modal"]');
                    if (closeBtn) closeBtn.click();
                    
                    // Reload page
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    showToast(data.message || 'Failed to update business', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Error updating business. Please try again.', 'error');
            }
        });
    }

    // File input change handlers
    const createFileInput = document.getElementById('createBusinessClearance');
    if (createFileInput) {
        createFileInput.addEventListener('change', function() {
            const file = this.files[0];
            const fileInfo = document.getElementById('createFileInfo');
            if (file && fileInfo) {
                fileInfo.innerHTML = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                fileInfo.style.display = 'block';
            } else if (fileInfo) {
                fileInfo.style.display = 'none';
            }
        });
    }

    const editFileInput = document.getElementById('edit_business_clearance');
    if (editFileInput) {
        editFileInput.addEventListener('change', function() {
            const file = this.files[0];
            const fileInfo = document.getElementById('editFileInfo');
            if (file && fileInfo) {
                fileInfo.innerHTML = `New file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                fileInfo.style.display = 'block';
            }
        });
    }

    // Load business details for view modal
    function loadBusinessDetails(businessId) {
        fetch(`/business/${businessId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayBusinessDetails(data.business);
                } else {
                    showError('Failed to load business details');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Error loading business details');
            });
    }

    // Display business details in modal
    function displayBusinessDetails(business) {
        const detailsContainer = document.getElementById('business-details');
        
        const clearanceLink = business.business_clearance ? 
            `<a href="${window.location.origin}/storage/${business.business_clearance}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">View Document</a>` : 
            '<span class="text-slate-400">No file uploaded</span>';
            
        const statusColor = business.status === 'approved' ? 'text-success' : 
                          business.status === 'declined' ? 'text-danger' : 
                          'text-warning';
        
        detailsContainer.innerHTML = `
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 md:col-span-6">
                    <label class="form-label">Business Name</label>
                    <input type="text" class="form-control" value="${business.business_name || 'N/A'}" readonly>
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="form-label">Type of Business</label>
                    <input type="text" class="form-control" value="${business.type_of_business || 'N/A'}" readonly>
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="form-label">Owner</label>
                    <input type="text" class="form-control" value="${business.user?.name || 'N/A'}" readonly>
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="form-label">Address</label>
                    <input type="text" class="form-control" value="${business.address || 'N/A'}" readonly>
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="form-label">Business Clearance</label>
                    <div class="form-control bg-slate-50">${clearanceLink}</div>
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="form-label">Status</label>
                    <div class="form-control ${statusColor} font-medium">${business.status ? business.status.charAt(0).toUpperCase() + business.status.slice(1) : 'N/A'}</div>
                </div>
                ${business.reason ? `
                <div class="col-span-12">
                    <label class="form-label">Decline Reason</label>
                    <textarea class="form-control" rows="3" readonly>${business.reason}</textarea>
                </div>
                ` : ''}
            </div>
        `;
    }

    // Load business for edit
    function loadBusinessForEdit(businessId) {
        fetch(`/business/${businessId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const business = data.business;
                    
                    document.getElementById('editBusinessId').value = business.id;
                    document.getElementById('edit_business_name').value = business.business_name || '';
                    document.getElementById('edit_type_of_business').value = business.type_of_business || '';
                    document.getElementById('edit_address').value = business.address || '';
                    
                    // Show current clearance if exists
                    if (business.business_clearance) {
                        const clearanceDiv = document.getElementById('editCurrentClearance');
                        const clearanceLink = document.getElementById('editCurrentClearanceLink');
                        if (clearanceDiv && clearanceLink) {
                            clearanceLink.href = `${window.location.origin}/storage/${business.business_clearance}`;
                            clearanceDiv.style.display = 'block';
                        }
                    }
                } else {
                    showToast('Error loading business details', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Error loading business details', 'error');
            });
    }

    // Show error message
    function showError(message) {
        const detailsContainer = document.getElementById('business-details');
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

    // Toast notification function
    function showToast(message, type = 'success') {
        const toastId = type === 'success' ? 'users_toast_success' : 'users_toast_error';
        
        if (type === 'error') {
            const errorMessageSlot = document.getElementById('users-error-message-slot');
            if (errorMessageSlot) {
                errorMessageSlot.textContent = message;
            }
        }
        
        // Use your notification-toast component's show function
        try {
            if (window[`showNotification_${toastId}`]) {
                window[`showNotification_${toastId}`]();
            } else {
                console.log(`${type.toUpperCase()}:`, message);
            }
        } catch (error) {
            console.error('Error showing toast:', error);
            console.log(`${type.toUpperCase()}:`, message);
        }
    }
});

