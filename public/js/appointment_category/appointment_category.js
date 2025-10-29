// Appointment Category Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize category management
    initializeCategoryManagement();
    initializeSearchFromURL();
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

    // Search functionality - server-side
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

    // Status filter - server-side
    document.querySelectorAll('[data-filter-type="status"]').forEach(button => {
        button.addEventListener('click', function() {
            const status = this.getAttribute('data-filter-value');
            applyServerSideStatusFilter(status);
        });
    });

    // Reset filters - server-side
    document.getElementById('resetFiltersBtn').addEventListener('click', function() {
        window.location.href = window.location.pathname;
    });
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

// Server-side status filter
function applyServerSideStatusFilter(status) {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (status === 'all') {
        urlParams.delete('status');
    } else {
        urlParams.set('status', status);
    }
    
    // Reset to page 1 when filtering
    urlParams.delete('page');
    
    // Redirect with new filter
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
            
            // Set for_role checkboxes
            const forRoles = category.for_role ? category.for_role.split(',') : [];
            document.getElementById('editForRoleHomeowner').checked = forRoles.includes('home owners');
            document.getElementById('editForRoleNonHomeowner').checked = forRoles.includes('non home owners');
            
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
