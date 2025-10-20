// Appointment Category Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize category management
    initializeCategoryManagement();
});

function initializeCategoryManagement() {
    // Create Category
    document.getElementById('createCategoryBtn').addEventListener('click', function() {
        createCategory();
    });

    // Edit Category
    document.querySelectorAll('[data-action="edit"]').forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-id');
            loadCategoryForEdit(categoryId);
        });
    });

    // Update Category
    document.getElementById('updateCategoryBtn').addEventListener('click', function() {
        updateCategory();
    });

    // Delete Category
    document.querySelectorAll('[data-action="delete"]').forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-id');
            document.getElementById('deleteCategoryId').value = categoryId;
        });
    });

    // Confirm Delete
    document.getElementById('confirmDeleteCategory').addEventListener('click', function() {
        const categoryId = document.getElementById('deleteCategoryId').value;
        deleteCategory(categoryId);
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function() {
        filterCategories();
    });

    // Status filter
    document.querySelectorAll('[data-filter-type="status"]').forEach(button => {
        button.addEventListener('click', function() {
            const status = this.getAttribute('data-filter-value');
            filterByStatus(status);
            updateStatusFilterButton(status);
        });
    });

    // Reset filters
    document.getElementById('resetFiltersBtn').addEventListener('click', function() {
        resetFilters();
    });
}

function createCategory() {
    const form = document.getElementById('createCategoryForm');
    const formData = new FormData(form);
    
    // Clear previous errors
    clearCreateFormErrors();
    
    // Show loading state
    const button = document.getElementById('createCategoryBtn');
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Creating...';
    button.disabled = true;

    fetch('/appointment-category', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json',
        },
        body: formData
    })
    .then(response => {
        // Parse JSON even if status is not OK (like 422)
        return response.json().then(data => ({
            status: response.status,
            data: data
        }));
    })
    .then(({status, data}) => {
        if (data.success) {
            showSuccessToast(data.message || 'Category created successfully');
            form.reset();
            // Close modal (same pattern as feedback system)
            const closeBtn = document.querySelector('#create-category-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            // Reload page to show new category
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            // Show validation errors in modal
            let errors = [];
            
            // Check if there are Laravel validation errors
            if (data.errors) {
                // Laravel validation errors object
                Object.keys(data.errors).forEach(key => {
                    if (Array.isArray(data.errors[key])) {
                        data.errors[key].forEach(error => errors.push(error));
                    } else {
                        errors.push(data.errors[key]);
                    }
                });
            } else if (data.message) {
                // Single error message
                errors.push(data.message);
            }
            
            if (errors.length > 0) {
                showFormErrors('createFormErrors', 'createErrorList', errors);
            } else {
                showErrorToast('Failed to create category');
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showFormErrors('createFormErrors', 'createErrorList', ['Error creating category. Please try again.']);
    })
    .finally(() => {
        // Reset button state
        button.innerHTML = originalText;
        button.disabled = false;
    });
}

function loadCategoryForEdit(categoryId) {
    fetch(`/appointment-category/${categoryId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const category = data.data;
            document.getElementById('editCategoryId').value = category.id;
            document.getElementById('editCategoryName').value = category.category_name;
            
            // Set status radio button
            if (category.status === 'Active') {
                document.getElementById('editStatusActive').checked = true;
            } else {
                document.getElementById('editStatusInactive').checked = true;
            }
        } else {
            showErrorToast('Failed to load category data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorToast('An error occurred while loading the category');
    });
}

function updateCategory() {
    const categoryId = document.getElementById('editCategoryId').value;
    const form = document.getElementById('editCategoryForm');
    const formData = new FormData(form);
    
    // Add method spoofing for PUT request (Laravel requires this)
    formData.append('_method', 'PUT');
    
    // Clear previous errors
    clearEditFormErrors();
    
    // Show loading state
    const button = document.getElementById('updateCategoryBtn');
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Updating...';
    button.disabled = true;

    fetch(`/appointment-category/${categoryId}`, {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json',
        },
        body: formData
    })
    .then(response => {
        // Parse JSON even if status is not OK (like 422)
        return response.json().then(data => ({
            status: response.status,
            data: data
        }));
    })
    .then(({status, data}) => {
        if (data.success) {
            showSuccessToast(data.message || 'Category updated successfully');
            // Close modal (same pattern as feedback system)
            const closeBtn = document.querySelector('#edit-category-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            // Reload page to show updated category
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            // Show validation errors in modal
            let errors = [];
            
            // Check if there are Laravel validation errors
            if (data.errors) {
                // Laravel validation errors object
                Object.keys(data.errors).forEach(key => {
                    if (Array.isArray(data.errors[key])) {
                        data.errors[key].forEach(error => errors.push(error));
                    } else {
                        errors.push(data.errors[key]);
                    }
                });
            } else if (data.message) {
                // Single error message
                errors.push(data.message);
            }
            
            if (errors.length > 0) {
                showFormErrors('editFormErrors', 'editErrorList', errors);
            } else {
                showErrorToast('Failed to update category');
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showFormErrors('editFormErrors', 'editErrorList', ['Error updating category. Please try again.']);
    })
    .finally(() => {
        // Reset button state
        button.innerHTML = originalText;
        button.disabled = false;
    });
}

function deleteCategory(categoryId) {
    // Show loading state
    const button = document.getElementById('confirmDeleteCategory');
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Deleting...';
    button.disabled = true;

    fetch(`/appointment-category/${categoryId}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessToast(data.message || 'Category deleted successfully');
            // Close modal (same pattern as feedback system)
            const closeBtn = document.querySelector('#delete-confirmation-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            // Reload page to show updated list
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showErrorToast(data.message || 'Failed to delete category');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorToast('Error deleting category. Please try again.');
    })
    .finally(() => {
        // Reset button state
        button.innerHTML = originalText;
        button.disabled = false;
    });
}

function filterCategories() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#categoryTable tbody tr');
    
    let visibleCount = 0;
    
    rows.forEach(row => {
        // Check if row has data-status attribute (actual data row, not empty state)
        if (!row.hasAttribute('data-status')) {
            return; // Skip empty/no-results rows
        }
        
        const categoryNameElement = row.querySelector('td:first-child .font-medium');
        
        // Safety check - if element doesn't exist, skip this row
        if (!categoryNameElement) {
            return;
        }
        
        const categoryName = categoryNameElement.textContent.toLowerCase();
        
        if (categoryName.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount(visibleCount);
    toggleNoResultsMessage(visibleCount);
}

function filterByStatus(status) {
    const rows = document.querySelectorAll('#categoryTable tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        // Check if row has data-status attribute (actual data row, not empty state)
        if (!row.hasAttribute('data-status')) {
            return; // Skip empty/no-results rows
        }
        
        const rowStatus = row.getAttribute('data-status');
        
        if (status === 'all' || rowStatus === status) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount(visibleCount);
    toggleNoResultsMessage(visibleCount);
}

function updateStatusFilterButton(status) {
    const button = document.getElementById('statusFilterBtn');
    const statusText = status === 'all' ? 'All' : status;
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        Status: ${statusText}
    `;
}

function updateFilteredCount(count) {
    document.getElementById('filtered-count').textContent = count;
}

function toggleNoResultsMessage(visibleCount) {
    const noResultsRow = document.getElementById('no-results-row');
    const noCategoriesRow = document.getElementById('no-categories-row');
    const dataRows = document.querySelectorAll('#categoryTable tbody tr[data-status]');
    
    // If there are data rows (categories exist)
    if (dataRows.length > 0) {
        // Hide the "No categories found" message
        if (noCategoriesRow) {
            noCategoriesRow.style.display = 'none';
        }
        
        // Show/hide "No results found" based on visible count
        if (noResultsRow) {
            if (visibleCount === 0) {
                noResultsRow.classList.remove('hidden');
                noResultsRow.style.display = '';
            } else {
                noResultsRow.classList.add('hidden');
                noResultsRow.style.display = 'none';
            }
        }
    } else {
        // No data rows exist, show "No categories found"
        if (noCategoriesRow) {
            noCategoriesRow.style.display = '';
        }
        if (noResultsRow) {
            noResultsRow.classList.add('hidden');
            noResultsRow.style.display = 'none';
        }
    }
}

function resetFilters() {
    // Reset search input
    document.getElementById('searchInput').value = '';
    
    // Reset status filter
    updateStatusFilterButton('all');
    
    // Show all data rows
    const rows = document.querySelectorAll('#categoryTable tbody tr[data-status]');
    rows.forEach(row => {
        row.style.display = '';
    });
    
    // Hide no results message
    const noResultsRow = document.getElementById('no-results-row');
    if (noResultsRow) {
        noResultsRow.classList.add('hidden');
        noResultsRow.style.display = 'none';
    }
    
    // Update count
    updateFilteredCount(rows.length);
}

function showSuccessToast(message) {
    // Use the same pattern as feedback system
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            className: "toastify-content",
            backgroundColor: "#10b981",
            stopOnFocus: true,
            onClick: function() {
                this.hideToast();
            }
        }).showToast();
    } else {
        // Fallback to alert if Toastify is not available
        alert('Success: ' + message);
    }
}

function showErrorToast(message) {
    // Use the same pattern as feedback system
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: message,
            duration: 5000,
            gravity: "top",
            position: "right",
            className: "toastify-content",
            backgroundColor: "#ef4444",
            stopOnFocus: true,
            onClick: function() {
                this.hideToast();
            }
        }).showToast();
    } else {
        // Fallback to alert if Toastify is not available
        alert('Error: ' + message);
    }
}

// Form validation error functions (same as feedback system)
function showFormErrors(errorDivId, errorListId, errors) {
    const errorDiv = document.getElementById(errorDivId);
    const errorList = document.getElementById(errorListId);
    
    if (errorDiv && errorList) {
        errorList.innerHTML = '';
        errors.forEach(error => {
            const li = document.createElement('li');
            li.textContent = error;
            errorList.appendChild(li);
        });
        errorDiv.classList.remove('hidden');
        
        // Scroll to top of modal to show errors
        const modal = errorDiv.closest('.modal-body');
        if (modal) {
            modal.scrollTop = 0;
        }
    }
}

function clearCreateFormErrors() {
    const errorDiv = document.getElementById('createFormErrors');
    if (errorDiv) errorDiv.classList.add('hidden');
}

function clearEditFormErrors() {
    const errorDiv = document.getElementById('editFormErrors');
    if (errorDiv) errorDiv.classList.add('hidden');
}
