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
        });
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase();
            filterTableRowsBySearch(searchTerm);
        }, 300));
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
                throw new Error(data.message || 'Failed to load feedback details');
            }
        })
        .catch(error => {
            console.error('Error loading feedback details:', error);
            detailsContainer.innerHTML = `
                <div class="text-center text-red-500 py-12">
                    <p class="text-lg">Error loading feedback details</p>
                    <p class="text-sm">${error.message}</p>
                </div>
            `;
        });
}

function displayFeedbackDetails(feedback) {
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
            strokeColor = '#94a3b8'; // Gray
        }
        
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
                 fill="${fillColor}" stroke="${strokeColor}" stroke-width="1">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
            </svg>
        `;
    }).join('');
    
    detailsContainer.innerHTML = `
        <div class="p-8">
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Feedback Details</h2>
                    <p class="text-slate-600">Review complete feedback information</p>
                </div>
                <button type="button" data-tw-dismiss="modal" class="text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <div class="space-y-6">
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="text-sm font-medium text-slate-600">User</label>
                        <div class="mt-1 flex items-center">
                            <img src="${feedback.user && feedback.user.profile_image ? feedback.user.profile_image : '/images/profile.png'}" 
                                 alt="User" class="w-10 h-10 rounded-full mr-3">
                            <div>
                                <div class="font-medium text-slate-800">${feedback.user ? feedback.user.name : 'N/A'}</div>
                                <div class="text-sm text-slate-500">${feedback.user ? feedback.user.email : 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label class="text-sm font-medium text-slate-600">Status</label>
                        <div class="mt-1">
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                ${feedback.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}">
                                ${feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <label class="text-sm font-medium text-slate-600">Rating</label>
                    <div class="mt-1 flex items-center space-x-1">
                        ${starsHtml}
                        <span class="ml-2 text-sm font-medium text-slate-600">${feedback.rating}/5</span>
                    </div>
                </div>
                
                <div>
                    <label class="text-sm font-medium text-slate-600">Feedback Description</label>
                    <div class="mt-1 p-4 bg-slate-50 rounded-lg">
                        <p class="text-slate-800 leading-relaxed">${feedback.description}</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="text-sm font-medium text-slate-600">Date Created</label>
                        <div class="mt-1 text-slate-800">${new Date(feedback.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</div>
                    </div>
                    
                    <div>
                        <label class="text-sm font-medium text-slate-600">Last Updated</label>
                        <div class="mt-1 text-slate-800">${new Date(feedback.updated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</div>
                    </div>
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
}

function filterTableRowsBySearch(searchTerm) {
    const rows = document.querySelectorAll('tbody tr[data-status]');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (!searchTerm || text.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount(visibleCount);
}

function updateFilteredCount(count) {
    const filteredCountElement = document.getElementById('filtered-count');
    if (filteredCountElement) {
        filteredCountElement.textContent = count;
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
