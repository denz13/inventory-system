document.addEventListener('DOMContentLoaded', function() {
    let currentStatusFilter = 'all';
    
    // Initialize search functionality - EXACT SAME AS BUSINESS.JS
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyAllFilters();
        });
    }

    // Universal filter handler - EXACT SAME AS BUSINESS.JS
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-filter-type]')) {
            const filterType = e.target.getAttribute('data-filter-type');
            const filterValue = e.target.getAttribute('data-filter-value');
            
            const dropdown = e.target.closest('.dropdown');
            
            // Update the appropriate filter state and button
            if (filterType === 'status') {
                currentStatusFilter = filterValue;
                updateFilterButton('statusFilterBtn', filterValue === 'all' ? 'Status: All' : `Status: ${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}`);
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

    // Reset filters button - EXACT SAME AS BUSINESS.JS
    document.getElementById('resetFiltersBtn')?.addEventListener('click', function() {
        currentStatusFilter = 'all';
        
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset button texts
        updateFilterButton('statusFilterBtn', 'Status: All');
        
        // Apply filters (which will show all)
        applyAllFilters();
        
        showToast('All filters have been reset', 'success');
    });

    // Update filter button text - EXACT SAME AS BUSINESS.JS
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

    // Apply all filters - EXACT SAME AS BUSINESS.JS
    function applyAllFilters() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const landlordRows = Array.from(document.querySelectorAll('#landlordTable tbody tr.intro-x'));
        
        if (landlordRows.length === 0) return;
        
        let visibleCount = 0;
        
        landlordRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const rowStatus = row.getAttribute('data-status');
            
            // Check search match
            const matchesSearch = searchTerm === '' || text.includes(searchTerm);
            
            // Check status match
            const matchesStatus = currentStatusFilter === 'all' || rowStatus === currentStatusFilter;
            
            // Show/hide row based on both filters
            if (matchesSearch && matchesStatus) {
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
        updateNoResultsMessage(searchTerm, currentStatusFilter, visibleCount, landlordRows.length);
    }

    // Update no results message - EXACT SAME AS BUSINESS.JS
    function updateNoResultsMessage(searchTerm, statusFilter, visibleCount, totalRows) {
        const tbody = document.querySelector('#landlordTable tbody');
        let noDataRow = tbody?.querySelector('tr.no-data-found');
        
        // Remove existing no data row if it exists
        if (noDataRow) {
            noDataRow.remove();
        }
        
        // Check if we should show "no results" message
        const hasActiveFilters = searchTerm !== '' || currentStatusFilter !== 'all';
        
        if (visibleCount === 0 && hasActiveFilters && totalRows > 0 && tbody) {
            // Create new no data row
            noDataRow = document.createElement('tr');
            noDataRow.className = 'no-data-found';
            noDataRow.innerHTML = `
                <td colspan="9" class="text-center py-8">
                    <div class="text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <div class="font-medium">No landlords found</div>
                        <div class="text-sm">No landlords match your current filters. Try adjusting your filters.</div>
                    </div>
                </td>
            `;
            tbody.appendChild(noDataRow);
        }
    }

    // Handle Add Landlord Form - EXACT SAME STRUCTURE AS BUSINESS.JS
    const addForm = document.getElementById('addLandlordForm');
    if (addForm) {
        addForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submit prevented, starting AJAX request');
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch('/landlord-management', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                                       document.querySelector('input[name="_token"]')?.value,
                        'Accept': 'application/json'
                    },
                    body: formData
                });
                
                const data = await response.json();
                console.log('AJAX Success:', data);
                
                if (data.success) {
                    showToast(data.message || 'Landlord registered successfully!', 'success');
                    
                    // Close modal
                    const closeBtn = document.querySelector('#add-landlord-modal [data-tw-dismiss="modal"]');
                    if (closeBtn) closeBtn.click();
                    
                    // Reset form
                    addForm.reset();
                    document.getElementById('createFileInfo').style.display = 'none';
                    
                    // Reload page
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    showToast(data.message || 'Failed to register landlord', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Error registering landlord. Please try again.', 'error');
            }
        });
    }

    // Handle View Landlord - EXACT SAME STRUCTURE AS BUSINESS.JS
    document.querySelectorAll('[data-action="view"]').forEach(button => {
        button.addEventListener('click', function() {
            const landlordId = this.getAttribute('data-id');
            loadLandlordDetails(landlordId);
        });
    });

    // Handle Edit Landlord - EXACT SAME STRUCTURE AS FEEDBACK.JS
    document.querySelectorAll('[data-action="edit"]').forEach(button => {
        button.addEventListener('click', function() {
            const landlordId = this.getAttribute('data-id');
            loadLandlordForEdit(landlordId);
        });
    });

    // Handle Delete Landlord - EXACT SAME STRUCTURE AS BUSINESS.JS
    document.querySelectorAll('[data-action="delete"]').forEach(button => {
        button.addEventListener('click', function() {
            const landlordId = this.getAttribute('data-id');
            document.getElementById('deleteLandlordId').value = landlordId;
        });
    });

    // Handle Approve/Decline Actions - EXACT SAME STRUCTURE AS LIST-PAYMENTS.JS
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-action="approve-landlord"]')) {
            const landlordId = e.target.closest('[data-action="approve-landlord"]').getAttribute('data-landlord-id');
            const landlordName = e.target.closest('[data-action="approve-landlord"]').getAttribute('data-landlord-name');
            openApproveModal(landlordId, landlordName);
        }
        
        if (e.target.closest('[data-action="decline-landlord"]')) {
            const landlordId = e.target.closest('[data-action="decline-landlord"]').getAttribute('data-landlord-id');
            const landlordName = e.target.closest('[data-action="decline-landlord"]').getAttribute('data-landlord-name');
            openDeclineModal(landlordId, landlordName);
        }
    });

    // Confirm approve button - EXACT SAME STRUCTURE AS LIST-PAYMENTS.JS
    document.getElementById('confirm-approve-landlord-btn')?.addEventListener('click', function() {
        const landlordId = this.getAttribute('data-landlord-id');
        confirmApproveLandlord(landlordId);
    });

    // Confirm decline button - EXACT SAME STRUCTURE AS LIST-PAYMENTS.JS
    document.getElementById('confirm-decline-landlord-btn')?.addEventListener('click', function() {
        const landlordId = this.getAttribute('data-landlord-id');
        const reason = document.getElementById('decline-reason').value;
        
        if (!reason || reason.trim() === '') {
            showToast('Please provide a reason for declining', 'error');
            return;
        }
        
        confirmDeclineLandlord(landlordId, reason);
    });

    // Confirm delete - EXACT SAME STRUCTURE AS BUSINESS.JS
    document.getElementById('confirmDeleteLandlord')?.addEventListener('click', async function() {
        const landlordId = document.getElementById('deleteLandlordId').value;
        
        try {
            const response = await fetch(`/landlord-management/${landlordId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                showToast(data.message || 'Landlord deleted successfully', 'success');
                
                // Close modal
                const closeBtn = document.querySelector('#delete-landlord-modal [data-tw-dismiss="modal"]');
                if (closeBtn) closeBtn.click();
                
                // Reload page
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                showToast(data.message || 'Failed to delete landlord', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error deleting landlord', 'error');
        }
    });

    // Handle Edit Form Submission - EXACT SAME STRUCTURE AS BUSINESS.JS
    const editForm = document.getElementById('editLandlordForm');
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const landlordId = document.getElementById('editLandlordId').value;
            const formData = new FormData(this);
            formData.append('_method', 'PUT');
            
            try {
                const response = await fetch(`/landlord-management/${landlordId}`, {
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
                    showToast(data.message || 'Landlord updated successfully!', 'success');
                    
                    // Close modal
                    const closeBtn = document.querySelector('#edit-landlord-modal [data-tw-dismiss="modal"]');
                    if (closeBtn) closeBtn.click();
                    
                    // Reload page
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    showToast(data.message || 'Failed to update landlord', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Error updating landlord. Please try again.', 'error');
            }
        });
    }

    // File input change handlers - EXACT SAME STRUCTURE AS BUSINESS.JS
    const createFileInput = document.getElementById('createSupportingDocs');
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

    const editFileInput = document.getElementById('editSupportingDocs');
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

    // Load landlord details for view modal - EXACT SAME STRUCTURE AS FEEDBACK.JS
    function loadLandlordDetails(landlordId) {
        const detailsContainer = document.getElementById('landlord-details-content');
        
        // Show loading state - EXACT SAME AS FEEDBACK.JS
        detailsContainer.innerHTML = `
            <div class="text-center text-slate-500 py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p class="text-lg">Loading landlord details...</p>
            </div>
        `;
        
        fetch(`/landlord-management/${landlordId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayLandlordDetails(data.data);
                } else {
                    showError('Failed to load landlord details');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Error loading landlord details');
            });
    }

    // Display landlord details in modal - BEAUTIFUL DESIGN LIKE FEEDBACK.JS
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
            
        const statusColor = landlord.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          landlord.status === 'declined' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800';
        
        detailsContainer.innerHTML = `
            <div class="px-6 py-8">
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
                                <div class="text-sm text-slate-500">${formatDate(landlord.created_at)}</div>
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
                
                <!-- Status -->
                <div class="mb-6">
                    <label class="form-label text-base font-semibold text-slate-700">Status</label>
                    <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50">
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
                            ${landlord.status ? landlord.status.charAt(0).toUpperCase() + landlord.status.slice(1) : 'N/A'}
                        </span>
                        ${landlord.reason ? `
                            <div class="mt-3 pt-3 border-t border-slate-200">
                                <strong>Reason:</strong> ${landlord.reason}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Load landlord for edit - EXACT SAME STRUCTURE AS FEEDBACK.JS
    function loadLandlordForEdit(landlordId) {
        fetch(`/landlord-management/${landlordId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    populateEditForm(data.data);
                } else {
                    showToast('Failed to load landlord for editing', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Error loading landlord for editing', 'error');
            });
    }

    // Populate edit form - EXACT SAME STRUCTURE AS FEEDBACK.JS
    function populateEditForm(landlord) {
        console.log('Populating edit form with landlord data:', landlord);
        
        // Set hidden ID
        document.getElementById('editLandlordId').value = landlord.id;
        
        // Personal Information
        document.getElementById('edit_first_name').value = landlord.first_name || '';
        document.getElementById('edit_last_name').value = landlord.last_name || '';
        document.getElementById('edit_middle_initial').value = landlord.middle_initial || '';
        document.getElementById('edit_date_of_birth').value = landlord.date_of_birth || '';
        document.getElementById('edit_years_of_residency').value = landlord.years_of_residency || '';
        document.getElementById('edit_address').value = landlord.address || '';
        document.getElementById('edit_civil_status').value = landlord.civil_status || '';
        document.getElementById('edit_nationality').value = landlord.nationality || '';
        document.getElementById('edit_email').value = landlord.email || '';
        document.getElementById('edit_phone_number').value = landlord.phone_number || '';
        
        // Property Information
        document.getElementById('edit_property_name').value = landlord.property_name || '';
        document.getElementById('edit_unit_number').value = landlord.unit_number || '';
        document.getElementById('edit_property_address').value = landlord.property_address || '';
        document.getElementById('edit_unit_type').value = landlord.unit_type || '';
        document.getElementById('edit_floor_area').value = landlord.floor_area || '';
        document.getElementById('edit_unit_condition_optional').value = landlord.unit_condition_optional || '';
        
        // Set radio button for unit condition
        const unitConditionRadios = document.querySelectorAll('input[name="unit_condition"]');
        unitConditionRadios.forEach(radio => {
            radio.checked = false; // Clear all first
            if (radio.value === landlord.unit_condition) {
                radio.checked = true;
            }
        });
        
        // Update form action
        const form = document.getElementById('editLandlordForm');
        form.action = `/landlord-management/${landlord.id}`;
        
        // Show current file info if exists
        const fileInfo = document.getElementById('editFileInfo');
        const currentDocDiv = document.getElementById('editCurrentDocument');
        const currentDocLink = document.getElementById('editCurrentDocumentLink');
        
        if (landlord.supporting_documents) {
            if (currentDocDiv && currentDocLink) {
                currentDocLink.href = `${window.location.origin}/storage/${landlord.supporting_documents}`;
                currentDocDiv.style.display = 'block';
            }
            if (fileInfo) {
                fileInfo.innerHTML = `Current: <a href="${window.location.origin}/storage/${landlord.supporting_documents}" target="_blank" class="text-blue-600 hover:underline">View Current Document</a>`;
                fileInfo.style.display = 'block';
            }
        } else {
            if (currentDocDiv) currentDocDiv.style.display = 'none';
            if (fileInfo) fileInfo.style.display = 'none';
        }
        
        console.log('Edit form populated successfully');
    }

    // Show error message - EXACT SAME STRUCTURE AS FEEDBACK.JS
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

    // Toast notification function - EXACT SAME STRUCTURE AS BUSINESS.JS
    function showToast(message, type = 'success') {
        const toastId = type === 'success' ? 'landlord_toast_success' : 'landlord_toast_error';
        
        if (type === 'error') {
            const errorMessageSlot = document.getElementById('landlord-error-message-slot');
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

    // File input change handler for business clearance
    const businessClearanceInput = document.getElementById('business-clearance-file');
    if (businessClearanceInput) {
        businessClearanceInput.addEventListener('change', function() {
            const file = this.files[0];
            const fileInfo = document.getElementById('approveFileInfo');
            if (file && fileInfo) {
                fileInfo.innerHTML = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                fileInfo.style.display = 'block';
            } else if (fileInfo) {
                fileInfo.style.display = 'none';
            }
        });
    }

    // Open approve landlord confirmation modal - WITH FILE UPLOAD
    function openApproveModal(landlordId, landlordName) {
        // Update modal content
        document.getElementById('approve-landlord-name').textContent = landlordName;
        
        // Store landlord ID in confirm button
        document.getElementById('confirm-approve-landlord-btn').setAttribute('data-landlord-id', landlordId);
        
        // Reset button state and form
        resetApproveButton();
        const form = document.getElementById('approveWithClearanceForm');
        if (form) {
            form.reset();
            document.getElementById('approveFileInfo').style.display = 'none';
        }
        
        // Trigger modal using data attributes (simulate click on modal trigger)
        const modalTrigger = document.createElement('button');
        modalTrigger.setAttribute('data-tw-toggle', 'modal');
        modalTrigger.setAttribute('data-tw-target', '#approve-landlord-modal');
        modalTrigger.style.display = 'none';
        document.body.appendChild(modalTrigger);
        modalTrigger.click();
        document.body.removeChild(modalTrigger);
    }

    // Open decline landlord confirmation modal - EXACT SAME STRUCTURE AS LIST-PAYMENTS.JS
    function openDeclineModal(landlordId, landlordName) {
        // Update modal content
        document.getElementById('decline-landlord-name').textContent = landlordName;
        
        // Store landlord ID in confirm button
        document.getElementById('confirm-decline-landlord-btn').setAttribute('data-landlord-id', landlordId);
        
        // Reset button state and form
        resetDeclineButton();
        document.getElementById('decline-reason').value = '';
        
        // Trigger modal using data attributes (simulate click on modal trigger)
        const modalTrigger = document.createElement('button');
        modalTrigger.setAttribute('data-tw-toggle', 'modal');
        modalTrigger.setAttribute('data-tw-target', '#decline-landlord-modal');
        modalTrigger.style.display = 'none';
        document.body.appendChild(modalTrigger);
        modalTrigger.click();
        document.body.removeChild(modalTrigger);
    }

    // Confirm approve landlord - WITH FILE UPLOAD
    function confirmApproveLandlord(landlordId) {
        // Get file input
        const fileInput = document.getElementById('business-clearance-file');
        const file = fileInput?.files[0];
        
        // Validate file is selected
        if (!file) {
            showToast('Please select a business clearance document', 'error');
            return;
        }
        
        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            showToast('File size must be less than 10MB', 'error');
            return;
        }
        
        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            showToast('Only PDF, JPG, and PNG files are allowed', 'error');
            return;
        }
        
        // Show loading state
        const confirmBtn = document.getElementById('confirm-approve-landlord-btn');
        confirmBtn.disabled = true;
        confirmBtn.querySelector('.approve-btn-text').classList.add('hidden');
        confirmBtn.querySelector('.approve-btn-loading').classList.remove('hidden');
        
        // Get CSRF token
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                      document.querySelector('input[name="_token"]')?.value;
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('business_clearance_attachments', file);
        
        // Make API call to approve landlord with file
        fetch(`/landlord-management/${landlordId}/approve`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': token,
                'Accept': 'application/json'
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Reset button state
            resetApproveButton();
            
            // Close modal
            const closeBtn = document.querySelector('#approve-landlord-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            if (data.success) {
                // Show success message
                showToast(data.message || 'Landlord application approved successfully!', 'success');
                
                // Reload page to reflect changes
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                // Show error message
                showToast(data.message || 'Failed to approve landlord application', 'error');
            }
        })
        .catch(error => {
            console.error('Error approving landlord:', error);
            
            // Reset button state
            resetApproveButton();
            
            // Close modal
            const closeBtn = document.querySelector('#approve-landlord-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Show error message
            showToast('Error approving landlord application. Please try again.', 'error');
        });
    }

    // Confirm decline landlord - EXACT SAME STRUCTURE AS LIST-PAYMENTS.JS
    function confirmDeclineLandlord(landlordId, reason) {
        // Show loading state
        const confirmBtn = document.getElementById('confirm-decline-landlord-btn');
        confirmBtn.disabled = true;
        confirmBtn.querySelector('.decline-btn-text').classList.add('hidden');
        confirmBtn.querySelector('.decline-btn-loading').classList.remove('hidden');
        
        // Get CSRF token
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                      document.querySelector('input[name="_token"]')?.value;
        
        // Make API call to decline landlord with reason
        fetch(`/landlord-management/${landlordId}/decline`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                reason: reason || ''
            })
        })
        .then(response => response.json())
        .then(data => {
            // Reset button state
            resetDeclineButton();
            
            // Close modal
            const closeBtn = document.querySelector('#decline-landlord-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            if (data.success) {
                // Show success message
                showToast(data.message || 'Landlord application declined successfully!', 'success');
                
                // Reload page to reflect changes
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                // Show error message
                showToast(data.message || 'Failed to decline landlord application', 'error');
            }
        })
        .catch(error => {
            console.error('Error declining landlord:', error);
            
            // Reset button state
            resetDeclineButton();
            
            // Close modal
            const closeBtn = document.querySelector('#decline-landlord-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Show error message
            showToast('Error declining landlord application. Please try again.', 'error');
        });
    }

    // Reset approve button state - EXACT SAME STRUCTURE AS LIST-PAYMENTS.JS
    function resetApproveButton() {
        const confirmBtn = document.getElementById('confirm-approve-landlord-btn');
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.querySelector('.approve-btn-text')?.classList.remove('hidden');
            confirmBtn.querySelector('.approve-btn-loading')?.classList.add('hidden');
        }
    }

    // Reset decline button state - EXACT SAME STRUCTURE AS LIST-PAYMENTS.JS
    function resetDeclineButton() {
        const confirmBtn = document.getElementById('confirm-decline-landlord-btn');
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.querySelector('.decline-btn-text')?.classList.remove('hidden');
            confirmBtn.querySelector('.decline-btn-loading')?.classList.add('hidden');
        }
    }
});
