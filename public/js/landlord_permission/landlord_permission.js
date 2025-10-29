document.addEventListener('DOMContentLoaded', function() {
    console.log('Landlord Permission script loaded');
    
    initializeSearchFromURL();
    
    // Initialize search functionality - server-side
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

    // Handle View Landlord
    document.querySelectorAll('[data-action="view"]').forEach(button => {
        button.addEventListener('click', function() {
            const landlordId = this.getAttribute('data-id');
            loadLandlordDetails(landlordId);
        });
    });

    // Handle Tenant Access Toggle
    document.querySelectorAll('.tenant-access-toggle').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const landlordId = this.getAttribute('data-landlord-id');
            const permissionId = this.getAttribute('data-permission-id');
            const enabled = this.checked;
            
            // Disable toggle during processing
            this.disabled = true;
            
            toggleTenantAccess(landlordId, enabled, this);
        });
    });

    // Load landlord details for view modal
    function loadLandlordDetails(landlordId) {
        const detailsContainer = document.getElementById('landlord-details-content');
        
        // Show loading state
        detailsContainer.innerHTML = `
            <div class="text-center text-slate-500 py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p class="text-lg">Loading landlord details...</p>
            </div>
        `;
        
        fetch(`/landlord-permission/${landlordId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayLandlordDetails(data.data);
                } else {
                    showError(data.message || 'Failed to load landlord details');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Error loading landlord details');
            });
    }

    // Display landlord details in modal - BEAUTIFUL DESIGN
    function displayLandlordDetails(landlord) {
        const detailsContainer = document.getElementById('landlord-details-content');
        
        if (!detailsContainer) {
            console.error('landlord-details-content element not found');
            return;
        }
        
        const documentLink = landlord.supporting_documents ? 
            `<a href="${window.location.origin}/storage/${landlord.supporting_documents}" target="_blank" class="text-blue-600 hover:text-blue-800 underline inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                </svg>
                View Document
            </a>` : 
            '<span class="text-slate-400">No file uploaded</span>';

        const businessClearanceLink = landlord.business_clearance_attachments ? 
            `<a href="${window.location.origin}/storage/${landlord.business_clearance_attachments}" target="_blank" class="text-blue-600 hover:text-blue-800 underline inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                </svg>
                View Business Clearance
            </a>` : 
            '<span class="text-slate-400">No clearance uploaded</span>';
        
        detailsContainer.innerHTML = `
            <div class="px-6 py-8">
                <!-- Approval Status Badge -->
                <div class="mb-6 text-center">
                    <span class="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        Approved Landlord
                    </span>
                </div>

                <!-- Submitted By Section -->
                <div class="mb-6">
                    <label class="form-label text-base font-semibold text-slate-700">Submitted By</label>
                    <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                                ${landlord.user ? landlord.user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <div class="font-medium">${landlord.user ? landlord.user.name : 'N/A'}</div>
                                <div class="text-sm text-slate-500">Submitted: ${formatDate(landlord.created_at)}</div>
                                <div class="text-sm text-slate-500">Approved: ${formatDate(landlord.updated_at)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Personal Information -->
                <div class="mb-6">
                    <label class="form-label text-base font-semibold text-slate-700">Personal Information</label>
                    <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 min-h-24">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><strong>Full Name:</strong> ${landlord.first_name} ${landlord.middle_initial || ''} ${landlord.last_name}</div>
                            <div><strong>Date of Birth:</strong> ${formatDate(landlord.date_of_birth)}</div>
                            <div><strong>Civil Status:</strong> ${landlord.civil_status}</div>
                            <div><strong>Nationality:</strong> ${landlord.nationality}</div>
                            <div><strong>Email:</strong> <a href="mailto:${landlord.email}" class="text-blue-600 hover:underline">${landlord.email}</a></div>
                            <div><strong>Phone Number:</strong> ${landlord.phone_number}</div>
                            <div><strong>Years of Residency:</strong> ${landlord.years_of_residency} years</div>
                        </div>
                        <div class="mt-3 pt-3 border-t border-slate-200">
                            <strong>Address:</strong> ${landlord.address}
                        </div>
                    </div>
                </div>
                
                <!-- Property Information -->
                <div class="mb-6">
                    <label class="form-label text-base font-semibold text-slate-700">Property Information</label>
                    <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 min-h-24">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><strong>Property Name:</strong> ${landlord.property_name}</div>
                            <div><strong>Unit Number:</strong> ${landlord.unit_number}</div>
                            <div><strong>Unit Type:</strong> ${landlord.unit_type}</div>
                            <div><strong>Floor Area:</strong> ${landlord.floor_area} SqM</div>
                            <div><strong>Unit Condition:</strong> ${landlord.unit_condition}</div>
                            <div><strong>Supporting Document:</strong><br>${documentLink}</div>
                        </div>
                        <div class="mt-3 pt-3 border-t border-slate-200">
                            <strong>Property Address:</strong> ${landlord.property_address}
                        </div>
                        ${landlord.unit_condition_optional ? `
                            <div class="mt-3 pt-3 border-t border-slate-200">
                                <strong>Optional Details:</strong> ${landlord.unit_condition_optional}
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Business Clearance Attachment -->
                <div class="mb-6">
                    <label class="form-label text-base font-semibold text-slate-700">Business Clearance Attachment</label>
                    <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-green-50 text-slate-700">
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 mr-3">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                            </svg>
                            <div class="flex-1">
                                ${businessClearanceLink}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Show error message
    function showError(message) {
        const detailsContainer = document.getElementById('landlord-details-content');
        
        if (!detailsContainer) {
            console.error('landlord-details-content element not found');
            return;
        }
        
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
        const toastId = type === 'success' ? 'landlord_permission_toast_success' : 'landlord_permission_toast_error';
        
        if (type === 'error') {
            const errorMessageSlot = document.getElementById('landlord_permission_error_message_slot');
            if (errorMessageSlot) {
                errorMessageSlot.textContent = message;
            }
        }
        
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

    // Toggle tenant access function
    function toggleTenantAccess(landlordId, enabled, toggleElement) {
        // Get CSRF token
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                      document.querySelector('input[name="_token"]')?.value;
        
        // Make API call to toggle tenant access
        fetch(`/landlord-permission/${landlordId}/toggle-access`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                enabled: enabled
            })
        })
        .then(response => response.json())
        .then(data => {
            // Re-enable toggle
            toggleElement.disabled = false;
            
            if (data.success) {
                // Update the label text and color
                const label = toggleElement.closest('label');
                const statusText = label.querySelector('.text-sm');
                
                if (enabled) {
                    statusText.textContent = 'Enabled';
                    statusText.classList.remove('text-slate-400');
                    statusText.classList.add('text-success');
                } else {
                    statusText.textContent = 'Disabled';
                    statusText.classList.remove('text-success');
                    statusText.classList.add('text-slate-400');
                }
                
                // Show success message
                showToast(data.message || 'Tenant access updated successfully', 'success');
            } else {
                // Revert toggle state on error
                toggleElement.checked = !enabled;
                showToast(data.message || 'Failed to update tenant access', 'error');
            }
        })
        .catch(error => {
            console.error('Error toggling tenant access:', error);
            
            // Re-enable toggle and revert state
            toggleElement.disabled = false;
            toggleElement.checked = !enabled;
            
            showToast('Error updating tenant access. Please try again.', 'error');
        });
    }

    // Format date helper function
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
});

