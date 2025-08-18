document.addEventListener('DOMContentLoaded', function() {
    let selectedType = null;
    let selectedCategory = null;
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    
    if (searchInput) {
        // Search as you type
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterComplaints(searchTerm);
            updateClearButton(searchTerm);
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = this.value.toLowerCase().trim();
                filterComplaints(searchTerm);
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
    
    // Clear search functionality
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            filterComplaints('');
            updateClearButton('');
            clearNoDataMessage();
            searchInput.focus();
        });
    }
    
    // Clear no data message
    function clearNoDataMessage() {
        const noDataRow = document.querySelector('tbody tr.no-data-found');
        if (noDataRow) {
            noDataRow.remove();
        }
    }
    
    // Update clear button visibility
    function updateClearButton(searchTerm) {
        if (clearSearchBtn) {
            clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
        }
    }
    
    // Filter complaints based on search term
    function filterComplaints(searchTerm) {
        const complaintRows = document.querySelectorAll('tbody tr.intro-x');
        let visibleCount = 0;
        
        complaintRows.forEach(row => {
            // Get specific columns to search
            const serviceType = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
            const category = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase() || '';
            const description = row.querySelector('td:nth-child(4)')?.textContent.toLowerCase() || '';
            const status = row.querySelector('td:nth-child(5)')?.textContent.toLowerCase() || '';
            const date = row.querySelector('td:nth-child(6)')?.textContent.toLowerCase() || '';
            
            const searchableText = `${serviceType} ${category} ${description} ${status} ${date}`;
            const isVisible = searchableText.includes(searchTerm);
            
            if (searchTerm === '') {
                row.style.display = '';
                removeHighlighting(row);
            } else {
                row.style.display = isVisible ? '' : 'none';
                if (isVisible) {
                    visibleCount++;
                    highlightSearchTerm(row, searchTerm);
                }
            }
        });
        
        // Update "No complaints found" message
        updateNoComplaintsMessage(searchTerm, visibleCount);
        
        // Show search results count
        updateSearchResultsCount(searchTerm, visibleCount);
        
        // Clear no data message if there are results
        if (visibleCount > 0) {
            clearNoDataMessage();
        }
    }
    
    // Highlight search terms in visible rows
    function highlightSearchTerm(row, searchTerm) {
        if (!searchTerm) return;
        
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            const originalText = cell.textContent;
            const highlightedText = originalText.replace(
                new RegExp(`(${searchTerm})`, 'gi'),
                '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
            );
            if (highlightedText !== originalText) {
                cell.innerHTML = highlightedText;
            }
        });
    }
    
    // Remove highlighting from rows
    function removeHighlighting(row) {
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            if (cell.innerHTML.includes('<mark>')) {
                cell.innerHTML = cell.innerHTML.replace(/<mark[^>]*>(.*?)<\/mark>/g, '$1');
            }
        });
    }
    
    // Update search results count
    function updateSearchResultsCount(searchTerm, visibleCount) {
        const totalRows = document.querySelectorAll('tbody tr.intro-x').length;
        const resultsCount = document.getElementById('searchResultsCount');
        
        if (searchTerm && resultsCount) {
            resultsCount.textContent = `Showing ${visibleCount} of ${totalRows} complaints`;
            resultsCount.style.display = 'block';
        } else if (resultsCount) {
            resultsCount.style.display = 'none';
        }
    }
    
    // Update "No complaints found" message based on search
    function updateNoComplaintsMessage(searchTerm, visibleCount) {
        const visibleRows = document.querySelectorAll('tbody tr.intro-x:not([style*="display: none"])');
        let noDataRow = document.querySelector('tbody tr.no-data-found');
        
        // Remove existing no data row if it exists
        if (noDataRow) {
            noDataRow.remove();
        }
        
        if (visibleCount === 0 && searchTerm !== '') {
            // Create new no data row
            const tbody = document.querySelector('tbody');
            noDataRow = document.createElement('tr');
            noDataRow.className = 'no-data-found';
            noDataRow.innerHTML = `
                <td colspan="6" class="text-center py-8">
                    <div class="text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <div class="font-medium">No complaints found</div>
                        <div class="text-sm">No complaints match your search: "<span class="font-medium text-slate-700">${searchTerm}</span>"</div>
                        <div class="text-xs mt-2 text-slate-400">Try adjusting your search terms or clear the search</div>
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
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showToast(data.message, 'success');
                
                // Close modal and reset
                const modal = document.getElementById('request-service-modal');
                // Use Tailwind modal system instead of Bootstrap
                if (modal) {
                    modal.classList.remove('show');
                    document.body.classList.remove('modal-open');
                    // Trigger modal close event
                    const closeEvent = new Event('click');
                    modal.dispatchEvent(closeEvent);
                }
                
                this.reset();
                showStep(1);
                selectedType = null;
                selectedCategory = null;
                
                // Clear selections
                document.querySelectorAll('.service-type-option, .category-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
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
                                 // Debug: Log the complaint data
                 console.log('Complaint data received:', complaint);
                 console.log('Service Type:', complaint.service_category?.service_type);
                 console.log('Service Category:', complaint.service_category);
                
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
                            <textarea class="form-control" rows="4" readonly>${complaint.complaint_description || 'N/A'}</textarea>
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
        
        // Debug: Log form data
        console.log('Form action:', this.action);
        console.log('Form data:', Object.fromEntries(formData));
        
        // Ensure _method field is included
        if (!formData.has('_method')) {
            formData.append('_method', 'PUT');
        }
        
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
            }
        })
        .then(response => {
            // Debug: Log response details
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                showToast(data.message, 'success');
                // Close modal and reload page to refresh the list
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
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
                }
            })
            .then(response => {
                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Server returned non-JSON response. Status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.message) {
                    showToast(data.message, 'success');
                    // Close modal and reload page to refresh the list
                    document.getElementById('delete-confirmation-modal').classList.remove('show');
                    document.body.classList.remove('modal-open');
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
