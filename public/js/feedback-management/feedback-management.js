document.addEventListener('DOMContentLoaded', function() {
    initializeModals();
    initializeFilters();
    initializeSearch();
});

function initializeModals() {
    // View feedback modal
    document.querySelectorAll('[data-tw-target="#view-feedback-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const feedbackId = this.getAttribute('data-feedback-id');
            loadFeedbackDetails(feedbackId);
        });
    });
    
    // Manage feedback modal (edit)
    document.querySelectorAll('[data-tw-target="#edit-feedback-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const feedbackId = this.getAttribute('data-feedback-id');
            loadFeedbackForManage(feedbackId);
        });
    });
    
    // Delete feedback modal
    document.querySelectorAll('[data-tw-target="#delete-confirmation-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const feedbackId = this.getAttribute('data-feedback-id');
            document.getElementById('deleteFeedbackId').value = feedbackId;
        });
    });
    
    // Submit manage feedback form
    document.getElementById('editFeedbackForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleUpdateFeedback();
    });
    
    // Submit delete feedback
    document.getElementById('confirmDeleteFeedback').addEventListener('click', function() {
        handleDeleteFeedback();
    });
}

function initializeFilters() {
    // Status filter (if enabled)
    document.querySelectorAll('[data-filter]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            filterTableByStatus(filter);
        });
    });
    
    // Rating filter
    document.querySelectorAll('[data-rating-filter]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const rating = this.getAttribute('data-rating-filter');
            filterTableByRating(rating);
            updateRatingDropdownText(rating);
        });
    });

    // Status filter (new)
    document.querySelectorAll('[data-status-filter]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const status = this.getAttribute('data-status-filter');
            filterTableByStatus(status);
            updateStatusDropdownText(status);
        });
    });

    // User filter
    document.querySelectorAll('[data-user-filter]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const user = this.getAttribute('data-user-filter');
            filterTableByUser(user);
            updateUserDropdownText(user);
        });
    });

    // Date filter
    document.querySelectorAll('[data-date-filter]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const dateFilter = this.getAttribute('data-date-filter');
            filterTableByDate(dateFilter);
            updateDateDropdownText(dateFilter);
        });
    });

    // Clear all filters button
    const clearAllFiltersBtn = document.getElementById('clearAllFilters');
    if (clearAllFiltersBtn) {
        clearAllFiltersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clearAllFilters();
        });
    }
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let timeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                try {
                    const searchTerm = (this.value || '').toLowerCase();
            filterTableRowsBySearch(searchTerm);
                } catch (error) {
                    console.error('Search error:', error);
                    filterTableRowsBySearch('');
                }
            }, 300);
        });
    }
}

function loadFeedbackDetails(feedbackId) {
    const detailsContainer = document.getElementById('feedback-details');
    
    // Show loading state
    detailsContainer.innerHTML = `
        <div class="text-center text-slate-500 py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-lg">Loading feedback details...</p>
        </div>
    `;

    fetch(`/feedback-management/${feedbackId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayFeedbackDetails(data.feedback);
            } else {
                showError('Failed to load feedback details');
            }
        })
        .catch(error => {
            console.error('Error loading feedback details:', error);
            showError('Error loading feedback details');
        });
}

function showError(message) {
    const detailsContainer = document.getElementById('feedback-details');
    if (detailsContainer) {
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
}

function handleDeleteFeedback() {
    
    const starsHtml = Array.from({length: 5}, (_, i) => {
        const filled = i < feedback.rating;
        let fillColor = '';
        let strokeColor = '';
        
        if (filled) {
            // Determine color based on rating
            if (feedback.rating >= 4) {
                fillColor = '#10b981'; // Green
                strokeColor = '#10b981';
            } else if (feedback.rating >= 3) {
                fillColor = '#f59e0b'; // Yellow
                strokeColor = '#f59e0b';
            } else {
                fillColor = '#f97316'; // Orange
                strokeColor = '#f97316';
            }
        } else {
            fillColor = 'white';
            strokeColor = 'black'; // Black border like user feedback
        }
        
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" 
                 fill="${fillColor}" stroke="${strokeColor}" stroke-width="2">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
            </svg>
        `;
    }).join('');
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };
    
    const getStatusColor = (status) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800';
    };
    
    detailsContainer.innerHTML = `
        <div class="px-6 py-8">
            <!-- User Info -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">User Information</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                    <div class="font-medium">${feedback.user ? feedback.user.name : 'N/A'}</div>
                    <div class="text-sm text-slate-500 mt-1">${feedback.user ? feedback.user.email : 'N/A'}</div>
                        </div>
                    </div>
                    
            <!-- Feedback Description -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Feedback Description</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 min-h-24">
                    ${feedback.description || 'No description provided'}
                    </div>
                </div>
                
            <!-- Rating -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700 text-center block">Rating</label>
                <div class="flex items-center justify-center mt-4 space-x-3">
                        ${starsHtml}
                </div>
                <div class="text-center mt-3">
                    <small class="text-slate-500">${feedback.rating}/5 Stars</small>
                    </div>
                </div>
                
            <!-- Status -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Status</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50">
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(feedback.status)}">
                        ${feedback.status ? feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1) : 'N/A'}
                    </span>
                    </div>
                </div>
                
            <!-- Date Created -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Date Created</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                    ${formatDate(feedback.created_at)}
                </div>
            </div>
        </div>
    `;
}

function loadFeedbackForManage(feedbackId) {
    fetch(`/feedback-management/${feedbackId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const feedback = data.feedback;
                
                // Set feedback ID
                document.getElementById('editFeedbackId').value = feedback.id;
                
                // Set current status
                document.getElementById('editStatus').value = feedback.status;
                
                // Display feedback info
                const feedbackInfo = document.getElementById('feedbackInfo');
                const starsHtml = Array.from({length: 5}, (_, i) => {
                    const filled = i < feedback.rating;
                    let fillColor = filled ? (feedback.rating >= 4 ? '#10b981' : feedback.rating >= 3 ? '#f59e0b' : '#f97316') : 'white';
                    let strokeColor = filled ? fillColor : '#94a3b8';
                    
                    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                    </svg>`;
                }).join('');
                
                feedbackInfo.innerHTML = `
                    <div class="space-y-3">
                        <div>
                            <span class="text-sm font-medium text-slate-600">User:</span>
                            <span class="ml-2 text-slate-800">${feedback.user ? feedback.user.name : 'N/A'}</span>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-slate-600">Rating:</span>
                            <span class="ml-2 inline-flex items-center space-x-1">
                                ${starsHtml}
                                <span class="ml-1 text-sm">${feedback.rating}/5</span>
                            </span>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-slate-600">Description:</span>
                            <div class="mt-1 text-slate-800">${feedback.description}</div>
                        </div>
                    </div>
                `;
                
                // Update form action
                const form = document.getElementById('editFeedbackForm');
                form.action = `/feedback-management/${feedback.id}`;
            } else {
                showToast('Error loading feedback details', 'error');
            }
        })
        .catch(error => {
            console.error('Error loading feedback:', error);
            showToast('Error loading feedback details', 'error');
        });
}

function handleUpdateFeedback() {
    const form = document.getElementById('editFeedbackForm');
    const formData = new FormData(form);
    const feedbackId = document.getElementById('editFeedbackId').value;
    
    fetch(`/feedback-management/${feedbackId}`, {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Feedback status updated successfully', 'success');
            
            // Close modal
            const closeBtn = document.querySelector('#edit-feedback-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Reload page to show updated feedback
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showToast(data.message || 'Error updating feedback status', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating feedback:', error);
        showToast('Error updating feedback status', 'error');
    });
}

function handleDeleteFeedback() {
    const feedbackId = document.getElementById('deleteFeedbackId').value;
    
    fetch(`/feedback-management/${feedbackId}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Feedback deleted successfully', 'success');
            
            // Close modal
            const closeBtn = document.querySelector('#delete-confirmation-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Reload page to remove deleted feedback
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showToast(data.message || 'Error deleting feedback', 'error');
        }
    })
    .catch(error => {
        console.error('Error deleting feedback:', error);
        showToast('Error deleting feedback', 'error');
    });
}

function filterTableByStatus(status) {
    const rows = document.querySelectorAll('tbody tr[data-status]');
    let visibleCount = 0;
    
    rows.forEach(row => {
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

function filterTableByRating(rating) {
    const rows = document.querySelectorAll('tbody tr[data-rating]');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const rowRating = row.getAttribute('data-rating');
        if (rating === 'all' || rowRating === rating) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount(visibleCount);
    toggleNoResultsMessage(visibleCount);
}

function filterTableRowsBySearch(searchTerm) {
    const rows = document.querySelectorAll('tbody tr[data-status]');
    let visibleCount = 0;
    
    rows.forEach(row => {
        if (!searchTerm) {
            // If no search term, show all rows
            row.style.display = '';
            visibleCount++;
            return;
        }
        
        // Get all text content from the row
        const rowText = row.textContent || '';
        const lowerRowText = rowText.toLowerCase();
        
        // Check if search term is found anywhere in the row
        if (lowerRowText.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount(visibleCount);
    toggleNoResultsMessage(visibleCount);
}

function updateFilteredCount(count) {
    const filteredCountElement = document.getElementById('filtered-count');
    if (filteredCountElement) {
        filteredCountElement.textContent = count;
    }
}

function toggleNoResultsMessage(visibleCount) {
    const noResultsRow = document.getElementById('no-results-row');
    const noFeedbackRow = document.getElementById('no-feedback-row');
    const dataRows = document.querySelectorAll('tbody tr[data-status]');
    
    // If there are data rows (feedback exists)
    if (dataRows.length > 0) {
        // Hide the "No feedback found" message
        if (noFeedbackRow) {
            noFeedbackRow.style.display = 'none';
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
        // No data rows exist, show "No feedback found"
        if (noFeedbackRow) {
            noFeedbackRow.style.display = '';
        }
        if (noResultsRow) {
            noResultsRow.classList.add('hidden');
            noResultsRow.style.display = 'none';
        }
    }
}

function showToast(message, type = 'success') {
    const toastElement = document.getElementById(`feedback_toast_${type}`);
    const messageElement = type === 'error' 
        ? document.getElementById('feedback_error_message_slot')
        : toastElement.querySelector('.text-slate-500');
    
    if (messageElement) {
        messageElement.textContent = message;
    }
    
    if (toastElement) {
        // Show toast using Toastify
        Toastify({
            node: toastElement.cloneNode(true),
            duration: 3000,
            gravity: "top",
            position: "right",
            className: "toastify-content",
            backgroundColor: type === 'success' ? '#10b981' : '#ef4444'
        }).showToast();
    }
}

// Filter by User
function filterTableByUser(userFilter) {
    const rows = document.querySelectorAll('tbody tr[data-status]');
    let visibleCount = 0;
    
    rows.forEach(row => {
        if (userFilter === 'all') {
            row.style.display = '';
            visibleCount++;
        } else {
            const userNameCell = row.querySelector('td:nth-child(2)');
            const userName = (userNameCell?.textContent || '').trim();
            
            if (userName === userFilter) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        }
    });
    
    updateFilteredCount(visibleCount);
    toggleNoResultsMessage(visibleCount);
}

// Filter by Date
function filterTableByDate(dateFilter) {
    const rows = document.querySelectorAll('tbody tr[data-status]');
    let visibleCount = 0;
    
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
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    rows.forEach(row => {
        if (dateFilter === 'all') {
            row.style.display = '';
            visibleCount++;
        } else {
            const dateCell = row.querySelector('td:nth-child(6)'); // Date column
            const dateText = (dateCell?.textContent || '').trim();
            
            // Parse the date from the cell text (assuming format like "Oct 11, 2025")
            const rowDate = parseDateFromText(dateText);
            
            let shouldShow = false;
            
            switch (dateFilter) {
                case 'today':
                    shouldShow = rowDate && rowDate >= today;
                    break;
                case 'yesterday':
                    shouldShow = rowDate && rowDate >= yesterday && rowDate < today;
                    break;
                case 'this-week':
                    shouldShow = rowDate && rowDate >= startOfWeek;
                    break;
                case 'last-week':
                    shouldShow = rowDate && rowDate >= startOfLastWeek && rowDate < startOfWeek;
                    break;
                case 'this-month':
                    shouldShow = rowDate && rowDate >= startOfMonth;
                    break;
                case 'last-month':
                    shouldShow = rowDate && rowDate >= startOfLastMonth && rowDate < startOfMonth;
                    break;
                case 'this-year':
                    shouldShow = rowDate && rowDate >= startOfYear;
                    break;
            }
            
            if (shouldShow) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        }
    });
    
    updateFilteredCount(visibleCount);
    toggleNoResultsMessage(visibleCount);
}

// Helper function to parse date from text
function parseDateFromText(dateText) {
    try {
        // Handle formats like "Oct 11, 2025 6:31 PM"
        const parts = dateText.split(' ');
        if (parts.length >= 3) {
            const month = parts[0];
            const day = parts[1].replace(',', '');
            const year = parts[2];
            return new Date(`${month} ${day}, ${year}`);
        }
    } catch (error) {
        console.error('Error parsing date:', error);
    }
    return null;
}

// Update dropdown button texts
function updateRatingDropdownText(rating) {
    const ratingDropdowns = document.querySelectorAll('.dropdown');
    ratingDropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown-toggle');
        if (button && button.textContent.includes('Rating')) {
            if (rating === 'all') {
                button.textContent = 'Filter by Rating';
            } else {
                button.textContent = `${rating} Star${rating !== '1' ? 's' : ''}`;
            }
        }
    });
}

function updateStatusDropdownText(status) {
    const statusDropdowns = document.querySelectorAll('.dropdown');
    statusDropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown-toggle');
        if (button && button.textContent.includes('Status')) {
            if (status === 'all') {
                button.textContent = 'Filter by Status';
            } else {
                button.textContent = `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
            }
        }
    });
}

function updateUserDropdownText(user) {
    const userDropdowns = document.querySelectorAll('.dropdown');
    userDropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown-toggle');
        if (button && button.textContent.includes('User')) {
            if (user === 'all') {
                button.textContent = 'Filter by User';
            } else {
                button.textContent = `User: ${user}`;
            }
        }
    });
}

function updateDateDropdownText(dateFilter) {
    const dateDropdowns = document.querySelectorAll('.dropdown');
    dateDropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown-toggle');
        if (button && button.textContent.includes('Date')) {
            if (dateFilter === 'all') {
                button.textContent = 'Filter by Date';
            } else {
                const dateTexts = {
                    'today': 'Today',
                    'yesterday': 'Yesterday',
                    'this-week': 'This Week',
                    'last-week': 'Last Week',
                    'this-month': 'This Month',
                    'last-month': 'Last Month',
                    'this-year': 'This Year'
                };
                button.textContent = `Date: ${dateTexts[dateFilter] || dateFilter}`;
            }
        }
    });
}

// Clear all filters
function clearAllFilters() {
    // Reset all dropdowns to "All"
    document.querySelectorAll('[data-rating-filter="all"]').forEach(btn => {
        btn.click();
    });
    document.querySelectorAll('[data-status-filter="all"]').forEach(btn => {
        btn.click();
    });
    document.querySelectorAll('[data-user-filter="all"]').forEach(btn => {
        btn.click();
    });
    document.querySelectorAll('[data-date-filter="all"]').forEach(btn => {
        btn.click();
    });
    
    // Reset dropdown button texts
    updateRatingDropdownText('all');
    updateStatusDropdownText('all');
    updateUserDropdownText('all');
    updateDateDropdownText('all');
    
    // Clear search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        filterTableRowsBySearch('');
    }
    
    // Show all rows
    const rows = document.querySelectorAll('tbody tr[data-status]');
    rows.forEach(row => {
        row.style.display = '';
    });
    
    updateFilteredCount(rows.length);
    toggleNoResultsMessage(rows.length);
}

// Load feedback details for viewing
function loadFeedbackDetails(feedbackId) {
    const detailsContainer = document.getElementById('feedback-details');
    
    // Fetch feedback details directly
    fetch(`/feedback-management/${feedbackId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayFeedbackDetails(data.feedback);
            } else {
                showError('Failed to load feedback details');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Error loading feedback details');
        });
}

// Display feedback details in modal
function displayFeedbackDetails(feedback) {
    console.log('Feedback data received:', feedback);
    console.log('User data:', feedback.user);
    console.log('User photo:', feedback.user?.photo);
    console.log('User photo_url:', feedback.user?.photo_url);
    const detailsContainer = document.getElementById('feedback-details');
    
    const starsHtml = Array.from({length: 5}, (_, i) => {
        const filled = i < feedback.rating;
        let fillColor = '';
        let strokeColor = '';
        
        if (filled) {
            // Determine color based on rating
            if (feedback.rating >= 4) {
                fillColor = '#10b981'; // Green
                strokeColor = '#10b981';
            } else if (feedback.rating >= 3) {
                fillColor = '#f59e0b'; // Yellow
                strokeColor = '#f59e0b';
            } else {
                fillColor = '#f97316'; // Orange
                strokeColor = '#f97316';
            }
        } else {
            fillColor = 'white';
            strokeColor = 'black'; // Black border like create modal
        }
        
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" 
                 fill="${fillColor}" stroke="${strokeColor}" stroke-width="2">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
            </svg>
        `;
    }).join('');
    
    detailsContainer.innerHTML = `
        <div class="px-6 py-8">
            <!-- User Information -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">User Information</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                    <div class="flex items-center">
                        <div class="w-12 h-12 flex-none image-fit mr-4">
                            ${feedback.user?.photo && feedback.user.photo.trim() !== '' ? 
                                `<img alt="${feedback.user?.name || 'User'}" class="rounded-full w-full h-full object-cover" src="${window.location.origin}/storage/profiles/${feedback.user.photo}">` :
                                `<div class="w-full h-full bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                    ${feedback.user?.name ? feedback.user.name.charAt(0).toUpperCase() : 'U'}
                                </div>`
                            }
                        </div>
                        <div>
                            <div class="font-semibold">${feedback.user?.name || 'N/A'}</div>
                            <div class="text-sm text-slate-500">${feedback.user?.email || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Feedback Description -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Feedback Description</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 min-h-24">
                    ${feedback.description || 'No description provided'}
                </div>
            </div>
            
            <!-- Rating -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700 text-center block">Rating</label>
                <div class="flex items-center justify-center mt-4 space-x-3">
                    ${starsHtml}
                </div>
                <div class="text-center mt-3">
                    <small class="text-slate-500">${feedback.rating}/5 Stars</small>
                </div>
            </div>
            
            <!-- Status -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Status</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50">
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(feedback.status)}">
                        ${feedback.status ? feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1) : 'N/A'}
                    </span>
                </div>
            </div>
            
            <!-- Date Created -->
            <div class="mb-6">
                <label class="form-label text-base font-semibold text-slate-700">Date Created</label>
                <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                    ${formatDate(feedback.created_at)}
                </div>
            </div>
        </div>
    `;
}

// Helper function to get status color
function getStatusColor(status) {
    switch(status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'inactive': return 'bg-slate-100 text-slate-800';
        default: return 'bg-slate-100 text-slate-800';
    }
}

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
}

// Show error message
function showError(message) {
    const detailsContainer = document.getElementById('feedback-details');
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
