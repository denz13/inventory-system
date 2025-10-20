document.addEventListener('DOMContentLoaded', function() {
    let selectedType = null;
    let selectedCategory = null;
    
    // Filter state
    let currentServiceTypeFilter = 'all';
    let currentCategoryFilter = 'all';
    let currentStatusFilter = 'all';
    let currentDateFilter = 'all';
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    
    // Universal filter handler
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-filter-type]')) {
            const filterType = e.target.getAttribute('data-filter-type');
            const filterValue = e.target.getAttribute('data-filter-value');
            
            const dropdown = e.target.closest('.dropdown');
            
            // Update the appropriate filter/sort state and button
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
        currentServiceTypeFilter = 'all';
        currentCategoryFilter = 'all';
        currentStatusFilter = 'all';
        currentDateFilter = 'all';
        
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset button texts
        updateFilterButton('serviceTypeFilterBtn', 'Service Type: All');
        updateFilterButton('categoryFilterBtn', 'Category: All');
        updateFilterButton('statusFilterBtn', 'Status: All');
        updateFilterButton('dateFilterBtn', 'Filter by Date');
        
        // Apply filters (which will show all)
        applyFiltersAndSort();
    });
    
    if (searchInput) {
        // Search as you type
        searchInput.addEventListener('input', function() {
            applyFiltersAndSort();
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFiltersAndSort();
            }
        });
        
        // Focus search input on Ctrl+K
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
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
    
    // Main function to apply all filters and sorting
    function applyFiltersAndSort() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const tbody = document.querySelector('tbody');
        const complaintRows = Array.from(document.querySelectorAll('tbody tr.intro-x'));
        
        if (complaintRows.length === 0) return;
        
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
        
        // Step 1: Filter rows
        let visibleRows = complaintRows.filter(row => {
            const rowText = row.textContent.toLowerCase();
            const rowServiceType = row.getAttribute('data-service-type');
            const rowCategory = row.getAttribute('data-category');
            const rowStatus = row.getAttribute('data-status');
            
            // Check if row matches search term, service type, category, and status filter
            const matchesSearch = searchTerm === '' || rowText.includes(searchTerm);
            const matchesServiceType = currentServiceTypeFilter === 'all' || rowServiceType === currentServiceTypeFilter;
            const matchesCategory = currentCategoryFilter === 'all' || rowCategory === currentCategoryFilter;
            const matchesStatus = currentStatusFilter === 'all' || rowStatus === currentStatusFilter;
            
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
                        default:
                            matchesDate = true;
                    }
                } else {
                    matchesDate = false;
                }
            }
            
            return matchesSearch && matchesServiceType && matchesCategory && matchesStatus && matchesDate;
        });
        
        // Step 2: Hide all rows first
        complaintRows.forEach(row => {
            row.style.display = 'none';
        });
        
        // Step 3: Show and reorder visible rows
        visibleRows.forEach((row, index) => {
            row.style.display = '';
            tbody.appendChild(row); // Move to end (reorder)
        });
        
        // Update filtered count display
        const filteredCountElement = document.getElementById('filtered-count');
        if (filteredCountElement) {
            filteredCountElement.textContent = visibleRows.length;
        }
        
        // Show/hide no results message
        updateNoResultsMessage(searchTerm, currentStatusFilter, visibleRows.length, complaintRows.length);
    }
    
    // Update no results message
    function updateNoResultsMessage(searchTerm, statusFilter, visibleCount, totalRows) {
        const tbody = document.querySelector('tbody');
        let noDataRow = tbody?.querySelector('tr.no-data-found');
        
        // Remove existing no data row if it exists
        if (noDataRow) {
            noDataRow.remove();
        }
        
        // Check if we should show "no results" message
        const hasActiveFilters = searchTerm !== '' || 
                                 currentServiceTypeFilter !== 'all' || 
                                 currentCategoryFilter !== 'all' ||
                                 currentStatusFilter !== 'all' || 
                                 currentDateFilter !== 'all';
        
        if (visibleCount === 0 && hasActiveFilters && totalRows > 0 && tbody) {
            // Create new no data row
            noDataRow = document.createElement('tr');
            noDataRow.className = 'no-data-found';
            noDataRow.innerHTML = `
                <td colspan="6" class="text-center py-8">
                    <div class="text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <div class="font-medium">No complaints found</div>
                        <div class="text-sm">No complaints match your current filters. Try adjusting your filters.</div>
                    </div>
                </td>
            `;
            tbody.appendChild(noDataRow);
        }
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
            
            // Load categories for this type
            loadCategories(typeId);
            
            // Show step 2
            showStep(2);
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
        document.getElementById(`step${stepNumber}`).classList.remove('hidden');
        
        // Update step indicator
        updateStepIndicator(stepNumber);
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
        
        // Clear selections
        document.querySelectorAll('.service-type-option, .category-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    });

    // Back to Step 2
    document.getElementById('backToStep2').addEventListener('click', function() {
        showStep(2);
        selectedCategory = null;
        
        // Clear category selection
        document.querySelectorAll('.category-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    });

    // Form Submission
    document.getElementById('requestServiceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!selectedType || !selectedCategory) {
            showToast('Please select both service type and category.', 'error');
            return;
        }
        
        const formData = new FormData(this);
        formData.append('service_management_category_id', selectedCategory.id);
        
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
