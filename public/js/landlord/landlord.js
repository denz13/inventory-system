document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let currentStatusFilter = urlParams.get('status') || 'all';
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

    // Universal filter handler - Server-side
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
            
            // Apply filters on server-side
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
    document.getElementById('resetFiltersBtn')?.addEventListener('click', function() {
        window.location.href = window.location.pathname;
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
        
        // Reset to page 1 when filtering
        url.searchParams.delete('page');
        
        // Reload page with new parameters
        window.location.href = url.toString();
    }

    // Set initial filter button state from URL
    if (currentStatusFilter && currentStatusFilter !== 'all') {
        updateFilterButton('statusFilterBtn', `Status: ${currentStatusFilter.charAt(0).toUpperCase() + currentStatusFilter.slice(1)}`);
    }

    // Handle Add Landlord Form - EXACT SAME STRUCTURE AS BUSINESS.JS
    const addForm = document.getElementById('addLandlordForm');
    if (addForm) {
        addForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submit prevented, starting AJAX request');
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch('/landlord', {
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
        
        fetch(`/landlord/${landlordId}`)
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
        
        // Handle supporting documents (can be string or array)
        let documentLinks = '<span class="text-slate-400">No files uploaded</span>';
        if (landlord.supporting_documents) {
            let documents = [];
            try {
                // Try to parse as JSON array
                documents = typeof landlord.supporting_documents === 'string' 
                    ? JSON.parse(landlord.supporting_documents) 
                    : landlord.supporting_documents;
            } catch (e) {
                // If not JSON, treat as single file path
                documents = [landlord.supporting_documents];
            }
            
            if (documents && documents.length > 0) {
                documentLinks = '<div class="flex flex-wrap gap-2">' + documents.map((doc, index) => {
                    const fileName = doc.split('/').pop();
                    const shortFileName = fileName.length > 30 ? fileName.substring(0, 27) + '...' : fileName;
                    return `<a href="${window.location.origin}/storage/${doc}" target="_blank" class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm" title="${fileName}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1 flex-shrink-0">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                        </svg>
                        <span class="truncate">${shortFileName}</span>
                    </a>`;
                }).join('') + '</div>';
            }
        }

        const businessClearanceLink = landlord.business_clearance_attachments ? 
            `<a href="${window.location.origin}/storage/${landlord.business_clearance_attachments}" target="_blank" class="text-blue-600 hover:text-blue-800 underline inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                </svg>
                View Business Clearance
            </a>` : 
            '<span class="text-slate-400">No clearance uploaded</span>';
            
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
                        </div>
                        <div class="mt-3 pt-3 border-t border-slate-200">
                            <strong>Property Address:</strong> ${landlord.property_address}
                        </div>
                        ${landlord.unit_condition_optional ? `
                            <div class="mt-3 pt-3 border-t border-slate-200">
                                <strong>Optional Details:</strong> ${landlord.unit_condition_optional}
                            </div>
                        ` : ''}
                        <div class="mt-3 pt-3 border-t border-slate-200">
                            <div class="mb-2"><strong>Supporting Documents:</strong></div>
                            ${documentLinks}
                        </div>
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
                
                <!-- Business Clearance (Only for Approved) -->
                ${landlord.status === 'approved' ? `
                    <div class="mb-6">
                        <label class="form-label text-base font-semibold text-slate-700">Business Clearance Attachment</label>
                        <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                            ${businessClearanceLink}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Load landlord for edit - EXACT SAME STRUCTURE AS FEEDBACK.JS
    function loadLandlordForEdit(landlordId) {
        fetch(`/landlord/${landlordId}`)
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
        document.getElementById('edit_date_of_birth').value = formatDateForInput(landlord.date_of_birth) || '';
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
        form.action = `/landlord/${landlord.id}`;
        
        // Show current files if exist
        const fileInfo = document.getElementById('editFileInfo');
        const currentDocsDiv = document.getElementById('editCurrentDocuments');
        const currentDocsList = document.getElementById('editCurrentDocumentsList');
        
        if (landlord.supporting_documents) {
            let documents = [];
            try {
                documents = typeof landlord.supporting_documents === 'string' 
                    ? JSON.parse(landlord.supporting_documents) 
                    : landlord.supporting_documents;
            } catch (e) {
                documents = [landlord.supporting_documents];
            }
            
            if (documents && documents.length > 0) {
                if (currentDocsDiv && currentDocsList) {
                    currentDocsList.innerHTML = documents.map((doc, index) => {
                        const fileName = doc.split('/').pop();
                        return `<a href="${window.location.origin}/storage/${doc}" target="_blank" class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                            </svg>
                            ${fileName}
                        </a>`;
                    }).join('');
                    currentDocsDiv.style.display = 'block';
                }
            } else {
                if (currentDocsDiv) currentDocsDiv.style.display = 'none';
            }
        } else {
            if (currentDocsDiv) currentDocsDiv.style.display = 'none';
        }
        
        if (fileInfo) fileInfo.style.display = 'none';
        
        console.log('Edit form populated successfully');
    }

    // Show error message - BEAUTIFUL DESIGN LIKE FEEDBACK.JS
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

    // File input change handlers - Multiple files support
    const createFileInput = document.getElementById('createSupportingDocs');
    if (createFileInput) {
        createFileInput.addEventListener('change', function() {
            const files = this.files;
            const fileInfo = document.getElementById('createFileInfo');
            if (files.length > 0 && fileInfo) {
                let fileListHtml = `Selected ${files.length} file(s):<br>`;
                let totalSize = 0;
                for (let i = 0; i < files.length; i++) {
                    fileListHtml += `• ${files[i].name} (${(files[i].size / 1024 / 1024).toFixed(2)} MB)<br>`;
                    totalSize += files[i].size;
                }
                fileListHtml += `<strong>Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB</strong>`;
                fileInfo.innerHTML = fileListHtml;
                fileInfo.style.display = 'block';
            } else if (fileInfo) {
                fileInfo.style.display = 'none';
            }
        });
    }

    // Edit file input change handler - Multiple files support
    const editFileInput = document.getElementById('editSupportingDocs');
    if (editFileInput) {
        editFileInput.addEventListener('change', function() {
            const files = this.files;
            const fileInfo = document.getElementById('editFileInfo');
            if (files.length > 0 && fileInfo) {
                let fileListHtml = `New file(s) selected (${files.length}):<br>`;
                let totalSize = 0;
                for (let i = 0; i < files.length; i++) {
                    fileListHtml += `• ${files[i].name} (${(files[i].size / 1024 / 1024).toFixed(2)} MB)<br>`;
                    totalSize += files[i].size;
                }
                fileListHtml += `<strong>Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB</strong><br>`;
                fileListHtml += `<span class="text-amber-600">Note: Uploading new files will replace existing documents</span>`;
                fileInfo.innerHTML = fileListHtml;
                fileInfo.style.display = 'block';
            } else if (fileInfo) {
                fileInfo.style.display = 'none';
            }
        });
    }

    // Handle Edit Landlord Form - EXACT SAME STRUCTURE AS FEEDBACK.JS
    const editForm = document.getElementById('editLandlordForm');
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Edit form submit prevented, starting AJAX request');
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                                       document.querySelector('input[name="_token"]')?.value,
                        'Accept': 'application/json'
                    },
                    body: formData
                });
                
                const data = await response.json();
                console.log('Edit AJAX Success:', data);
                
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

    // Helper Functions
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Helper function to format date for input field (YYYY-MM-DD)
    function formatDateForInput(dateString) {
        if (!dateString) return '';
        
        // If already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }
        
        // Try to parse the date string
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        // Format as YYYY-MM-DD for input field
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

    function getStatusClass(status) {
        switch(status) {
            case 'approved': return 'bg-success/20 text-success';
            case 'declined': return 'bg-danger/20 text-danger';
            case 'pending': return 'bg-warning/20 text-warning';
            default: return 'bg-slate-200 text-slate-600';
        }
    }

    // Toast notification function - EXACT SAME AS BUSINESS.JS
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
});