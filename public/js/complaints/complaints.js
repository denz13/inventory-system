document.addEventListener('DOMContentLoaded', function() {
    let selectedType = null;
    let selectedCategory = null;
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let currentServiceTypeFilter = urlParams.get('service_type') || 'all';
    let currentCategoryFilter = urlParams.get('category') || 'all';
    let currentStatusFilter = urlParams.get('status') || 'all';
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
        
        // Focus search input on Ctrl+K
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }
    
    // Universal filter handler - Server-side
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-filter-type]')) {
            const filterType = e.target.getAttribute('data-filter-type');
            const filterValue = e.target.getAttribute('data-filter-value');
            
            const dropdown = e.target.closest('.dropdown');
            
            // Update the appropriate filter state and button
            if (filterType === 'service-type') {
                currentServiceTypeFilter = filterValue;
                updateFilterButton('serviceTypeFilterBtn', filterValue === 'all' ? 'Service Type: All' : `Service Type: ${filterValue}`);
            } else if (filterType === 'category') {
                currentCategoryFilter = filterValue;
                updateFilterButton('categoryFilterBtn', filterValue === 'all' ? 'Category: All' : `Category: ${filterValue}`);
            } else if (filterType === 'status') {
                currentStatusFilter = filterValue;
                updateFilterButton('statusFilterBtn', filterValue === 'all' ? 'Status: All' : `Status: ${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}`);
            } else if (filterType === 'date-filter') {
                currentDateFilter = filterValue;
                const dateTexts = {
                    'all': 'Filter by Date',
                    'today': 'Date: Today',
                    'yesterday': 'Date: Yesterday',
                    'this-week': 'Date: This Week',
                    'last-week': 'Date: Last Week',
                    'this-month': 'Date: This Month',
                    'last-month': 'Date: Last Month'
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
        
        if (currentServiceTypeFilter && currentServiceTypeFilter !== 'all') {
            url.searchParams.set('service_type', currentServiceTypeFilter);
        } else {
            url.searchParams.delete('service_type');
        }
        
        if (currentCategoryFilter && currentCategoryFilter !== 'all') {
            url.searchParams.set('category', currentCategoryFilter);
        } else {
            url.searchParams.delete('category');
        }
        
        if (currentStatusFilter && currentStatusFilter !== 'all') {
            url.searchParams.set('status', currentStatusFilter);
        } else {
            url.searchParams.delete('status');
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
    if (currentServiceTypeFilter && currentServiceTypeFilter !== 'all') {
        updateFilterButton('serviceTypeFilterBtn', `Service Type: ${currentServiceTypeFilter}`);
    }
    if (currentCategoryFilter && currentCategoryFilter !== 'all') {
        updateFilterButton('categoryFilterBtn', `Category: ${currentCategoryFilter}`);
    }
    if (currentStatusFilter && currentStatusFilter !== 'all') {
        updateFilterButton('statusFilterBtn', `Status: ${currentStatusFilter.charAt(0).toUpperCase() + currentStatusFilter.slice(1)}`);
    }
    if (currentDateFilter && currentDateFilter !== 'all') {
        const dateTexts = {
            'today': 'Date: Today',
            'yesterday': 'Date: Yesterday',
            'this-week': 'Date: This Week',
            'last-week': 'Date: Last Week',
            'this-month': 'Date: This Month',
            'last-month': 'Date: Last Month'
        };
        updateFilterButton('dateFilterBtn', dateTexts[currentDateFilter] || 'Filter by Date');
    }

    // Service Type Selection
    document.querySelectorAll('.service-type-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove previous selection
            document.querySelectorAll('.service-type-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selection to current option
            this.classList.add('selected');
            
            const typeId = this.dataset.typeId;
            const typeName = this.dataset.typeName;
            
            selectedType = { id: typeId, name: typeName };
            
            // Check if "Other" option was selected
            if (typeId === 'other') {
                // Show custom service request form
                showStep('other');
            } else {
                // Load categories for this type
                loadCategories(typeId);
                
                // Show step 2
                showStep(2);
            }
        });
    });

    // Load Categories
    function loadCategories(typeId) {
        fetch(`/complaints/categories/${typeId}`)
            .then(response => response.json())
            .then(categories => {
                const categoriesList = document.getElementById('categoriesList');
                categoriesList.innerHTML = '';
                
                categories.forEach(category => {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'category-option cursor-pointer p-6 border-2 border-slate-200 rounded-lg hover:border-primary transition-all duration-300 hover:shadow-md';
                    categoryDiv.dataset.categoryId = category.id;
                    categoryDiv.dataset.categoryName = category.category;
                    
                    categoryDiv.innerHTML = `
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="font-medium text-lg">${category.category}</div>
                                <div class="text-slate-500 text-sm mt-1">${category.status}</div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-slate-400">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    `;
                    
                    categoryDiv.addEventListener('click', function() {
                        // Remove previous selection
                        document.querySelectorAll('.category-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        
                        // Add selection to current option
                        this.classList.add('selected');
                        
                        const categoryId = this.dataset.categoryId;
                        const categoryName = this.dataset.categoryName;
                        
                        selectedCategory = { id: categoryId, name: categoryName };
                        
                        // Update displays
                        document.getElementById('selectedTypeDisplay').value = selectedType.name;
                        document.getElementById('selectedCategoryDisplay').value = selectedCategory.name;
                        
                        // Show step 3
                        showStep(3);
                    });
                    
                    categoriesList.appendChild(categoryDiv);
                });
            })
            .catch(error => {
                console.error('Error loading categories:', error);
                showToast('Error loading categories. Please try again.', 'error');
            });
    }

    // Show specific step
    function showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.step-content').forEach(step => {
            step.classList.add('hidden');
        });
        
        // Show the requested step
        if (stepNumber === 'other') {
            document.getElementById('stepOther').classList.remove('hidden');
            updateStepIndicator(1); // Show as step 1 active
        } else {
            document.getElementById(`step${stepNumber}`).classList.remove('hidden');
            updateStepIndicator(stepNumber);
        }
    }

    // Update step indicator
    function updateStepIndicator(currentStep) {
        const dots = document.querySelectorAll('.step-dot');
        dots.forEach((dot, index) => {
            const stepNum = index + 1;
            dot.classList.remove('active', 'completed');
            
            if (stepNum === currentStep) {
                dot.classList.add('active');
            } else if (stepNum < currentStep) {
                dot.classList.add('completed');
            }
        });
    }

    // Back to Step 1
    document.getElementById('backToStep1').addEventListener('click', function() {
        showStep(1);
        selectedType = null;
        selectedCategory = null;
        
        // Clear regular description
        if (document.getElementById('regularComplaintDescription')) {
            document.getElementById('regularComplaintDescription').value = '';
        }
        
        // Clear selections
        document.querySelectorAll('.service-type-option, .category-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    });

    // Back to Step 2
    document.getElementById('backToStep2').addEventListener('click', function() {
        showStep(2);
        selectedCategory = null;
        
        // Clear regular description
        if (document.getElementById('regularComplaintDescription')) {
            document.getElementById('regularComplaintDescription').value = '';
        }
        
        // Clear category selection
        document.querySelectorAll('.category-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    });
    
    // Back to Step 1 from Other
    document.getElementById('backToStep1FromOther').addEventListener('click', function() {
        showStep(1);
        selectedType = null;
        selectedCategory = null;
        
        // Clear custom form
        document.getElementById('customServiceType').value = '';
        document.getElementById('customDescription').value = '';
        
        // Clear selections
        document.querySelectorAll('.service-type-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    });

    // Form Submission
    document.getElementById('requestServiceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        // Check if this is a custom "Other" request
        if (selectedType && selectedType.id === 'other') {
            // Validate custom fields
            const customServiceType = document.getElementById('customServiceType').value.trim();
            const customDescription = document.getElementById('customDescription').value.trim();
            
            if (!customServiceType) {
                showToast('Please enter a custom service type.', 'error');
                return;
            }
            
            if (!customDescription) {
                showToast('Please enter a description.', 'error');
                return;
            }
            
            // Add custom data to form
            formData.append('is_custom', '1');
            formData.append('custom_service_type', customServiceType);
            formData.append('complaint_description', customDescription);
        } else {
            // Regular flow validation
            if (!selectedType || !selectedCategory) {
                showToast('Please select both service type and category.', 'error');
                return;
            }
            
            const regularDescription = document.getElementById('regularComplaintDescription').value.trim();
            if (!regularDescription) {
                showToast('Please enter a description.', 'error');
                return;
            }
            
            formData.append('service_management_category_id', selectedCategory.id);
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
        `;
        submitBtn.disabled = true;
        
        fetch(this.action, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showToast(data.message, 'success');
                // Close modal and reload page
                const closeBtn = document.querySelector('#request-service-modal [data-tw-dismiss="modal"]');
                if (closeBtn) closeBtn.click();
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            showToast('Error submitting request. Please try again.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });

    // Reset modal function
    function resetModal() {
        showStep(1);
        selectedType = null;
        selectedCategory = null;
        document.getElementById('requestServiceForm').reset();
        
        // Clear custom fields
        if (document.getElementById('customServiceType')) {
            document.getElementById('customServiceType').value = '';
        }
        if (document.getElementById('customDescription')) {
            document.getElementById('customDescription').value = '';
        }
        if (document.getElementById('regularComplaintDescription')) {
            document.getElementById('regularComplaintDescription').value = '';
        }
        
        // Clear selections
        document.querySelectorAll('.service-type-option, .category-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    }

    // Reset modal when closed (Bootstrap event)
    document.getElementById('request-service-modal').addEventListener('hidden.bs.modal', function() {
        resetModal();
    });
    
    // Also listen for Tailwind modal close events
    document.getElementById('request-service-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            resetModal();
        }
    });
    
    // Listen for escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            resetModal();
        }
    });

    // View Complaint Modal
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-tw-target="#view-complaint-modal"]')) {
            const complaintId = e.target.dataset.complaintId;
            loadComplaintDetails(complaintId);
        }
        
        if (e.target.matches('[data-tw-target="#edit-complaint-modal"]')) {
            const complaintId = e.target.dataset.complaintId;
            loadComplaintForEdit(complaintId);
        }
        
        if (e.target.matches('[data-tw-target="#delete-confirmation-modal"]')) {
            const complaintId = e.target.dataset.complaintId;
            document.getElementById('deleteComplaintId').value = complaintId;
        }
    });

    // Load complaint details for view modal
    function loadComplaintDetails(complaintId) {
        fetch(`/complaints/${complaintId}`)
            .then(response => response.json())
            .then(complaint => {
                const detailsContainer = document.getElementById('complaint-details');
                 detailsContainer.innerHTML = `
                     <div class="grid grid-cols-12 gap-4">
                         <div class="col-span-12 md:col-span-6">
                             <label class="form-label">Service Type</label>
                             <input type="text" class="form-control" value="${complaint.service_category?.service_type?.type || 'N/A'}" readonly>
                         </div>
                         <div class="col-span-12 md:col-span-6">
                             <label class="form-label">Category</label>
                             <input type="text" class="form-control" value="${complaint.service_category?.category || 'N/A'}" readonly>
                         </div>
                        <div class="col-span-12">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" rows="8" readonly>${complaint.complaint_description || 'N/A'}</textarea>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label">Status</label>
                            <input type="text" class="form-control" value="${complaint.status || 'N/A'}" readonly>
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label">Submitted Date</label>
                            <input type="text" class="form-control" value="${complaint.created_at ? new Date(complaint.created_at).toLocaleString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true 
                            }) : 'N/A'}" readonly>
                        </div>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Error loading complaint details:', error);
                document.getElementById('complaint-details').innerHTML = '<div class="text-center text-red-500">Error loading complaint details</div>';
            });
    }

    // Load complaint for editing
    function loadComplaintForEdit(complaintId) {
        fetch(`/complaints/${complaintId}`)
            .then(response => response.json())
            .then(complaint => {
                document.getElementById('editComplaintId').value = complaint.id;
                document.getElementById('editServiceType').value = complaint.service_category?.service_type?.type || 'N/A';
                document.getElementById('editServiceCategory').value = complaint.service_category?.category || 'N/A';
                document.getElementById('editComplaintDescription').value = complaint.complaint_description || '';
                
                // Update form action
                document.getElementById('editComplaintForm').action = `/complaints/${complaint.id}`;
            })
            .catch(error => {
                console.error('Error loading complaint for edit:', error);
                showToast('Error loading complaint for editing. Please try again.', 'error');
            });
    }

    // Edit complaint form submission
    document.getElementById('editComplaintForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const complaintId = document.getElementById('editComplaintId').value;
        const formData = new FormData(this);
        
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
        
        // Ensure _method field is included
        if (!formData.has('_method')) {
            formData.append('_method', 'PUT');
        }
        
        fetch(this.action, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showToast(data.message, 'success');
                // Close modal and reload page
                const closeBtn = document.querySelector('#edit-complaint-modal [data-tw-dismiss="modal"]');
                if (closeBtn) closeBtn.click();
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error updating complaint:', error);
            showToast('Error updating complaint: ' + error.message, 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });

    // Delete complaint functionality
    document.getElementById('confirmDeleteComplaint').addEventListener('click', function() {
        const complaintId = document.getElementById('deleteComplaintId').value;
        
        if (complaintId) {
            fetch(`/complaints/${complaintId}`, {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    showToast(data.message, 'success');
                    // Close modal and reload page
                    const closeBtn = document.querySelector('#delete-confirmation-modal [data-tw-dismiss="modal"]');
                    if (closeBtn) closeBtn.click();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })
            .catch(error => {
                console.error('Error deleting complaint:', error);
                showToast('Error deleting complaint: ' + error.message, 'error');
            });
        }
    });

    // Toast notification function
    function showToast(message, type = 'success') {
        const toastId = type === 'success' ? 'complaints_toast_success' : 'complaints_toast_error';
        
        if (type === 'error') {
            // Update error message slot
            const messageSlot = document.getElementById('complaints-error-message-slot');
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
});
