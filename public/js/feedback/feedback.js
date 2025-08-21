document.addEventListener('DOMContentLoaded', function() {
    // Initialize filter functionality
    initializeFilters();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize star rating functionality
    initializeStarRating();
    
    // Initialize modal functionality
    initializeModals();
    
    // Initialize form submissions
    initializeForms();
});

function initializeFilters() {
    // Status filter
    document.querySelectorAll('[data-filter]').forEach(filterItem => {
        filterItem.addEventListener('click', function() {
            const status = this.getAttribute('data-filter');
            filterTableRowsByStatus(status);
        });
    });
    
    // Rating filter
    document.querySelectorAll('[data-rating-filter]').forEach(filterItem => {
        filterItem.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating-filter');
            filterTableRowsByRating(rating);
        });
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterTableRowsBySearch(searchTerm);
        });
    }
}

function initializeStarRating() {
    // Create feedback star rating
    document.addEventListener('click', function(e) {
        if (e.target.closest('#rating-stars .star')) {
            const star = e.target.closest('.star');
            const rating = parseInt(star.getAttribute('data-rating'));
            setStarRating('rating-stars', 'rating-input', rating);
        }
        
        // Edit feedback star rating
        if (e.target.closest('#edit-rating-stars .star')) {
            const star = e.target.closest('.star');
            const rating = parseInt(star.getAttribute('data-rating'));
            setStarRating('edit-rating-stars', 'edit-rating-input', rating);
        }
    });
    
    // Add hover effects for better UX
    document.addEventListener('mouseenter', function(e) {
        if (e.target.closest('#rating-stars .star')) {
            const star = e.target.closest('.star');
            const rating = parseInt(star.getAttribute('data-rating'));
            previewStarRating('rating-stars', rating);
        }
        
        if (e.target.closest('#edit-rating-stars .star')) {
            const star = e.target.closest('.star');
            const rating = parseInt(star.getAttribute('data-rating'));
            previewStarRating('edit-rating-stars', rating);
        }
    }, true);
    
    document.addEventListener('mouseleave', function(e) {
        if (e.target.closest('#rating-stars')) {
            const currentRating = document.getElementById('rating-input').value;
            setStarRating('rating-stars', 'rating-input', parseInt(currentRating));
        }
        
        if (e.target.closest('#edit-rating-stars')) {
            const currentRating = document.getElementById('edit-rating-input').value;
            setStarRating('edit-rating-stars', 'edit-rating-input', parseInt(currentRating));
        }
    }, true);
}

function setStarRating(containerId, inputId, rating) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    
    if (container && input) {
        // Update hidden input
        input.value = rating;
        
        // Update star display
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                // Determine color based on rating
                let fillColor, strokeColor;
                if (rating >= 4) {
                    // 4-5 stars: Green (excellent)
                    fillColor = '#10b981'; // green-500
                    strokeColor = '#10b981';
                } else if (rating >= 3) {
                    // 3 stars: Yellow (good)
                    fillColor = '#f59e0b'; // yellow-500
                    strokeColor = '#f59e0b';
                } else {
                    // 1-2 stars: Orange/Red (poor)
                    fillColor = '#f97316'; // orange-500
                    strokeColor = '#f97316';
                }
                
                star.setAttribute('fill', fillColor);
                star.setAttribute('stroke', strokeColor);
                star.style.opacity = '1'; // Ensure full opacity for selected
            } else {
                // Unselected stars: white with black border
                star.setAttribute('fill', 'white');
                star.setAttribute('stroke', 'black');
                star.style.opacity = '1'; // Ensure full opacity for unselected
            }
        });
    }
}

function previewStarRating(containerId, rating) {
    const container = document.getElementById(containerId);
    
    if (container) {
        // Update star display for preview
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                // Determine color based on rating (lighter/transparent for preview)
                let fillColor, strokeColor;
                if (rating >= 4) {
                    // 4-5 stars: Light green (excellent)
                    fillColor = '#10b981'; // green-500
                    strokeColor = '#10b981';
                } else if (rating >= 3) {
                    // 3 stars: Light yellow (good)
                    fillColor = '#f59e0b'; // yellow-500
                    strokeColor = '#f59e0b';
                } else {
                    // 1-2 stars: Light orange/red (poor)
                    fillColor = '#f97316'; // orange-500
                    strokeColor = '#f97316';
                }
                
                star.setAttribute('fill', fillColor);
                star.setAttribute('stroke', strokeColor);
                star.style.opacity = '0.7'; // Make it slightly transparent for preview
            } else {
                // Unselected stars: white with black border
                star.setAttribute('fill', 'white');
                star.setAttribute('stroke', 'black');
                star.style.opacity = '1';
            }
        });
    }
}

function initializeModals() {
    // View feedback modal
    document.querySelectorAll('[data-tw-target="#view-feedback-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const feedbackId = this.getAttribute('data-feedback-id');
            loadFeedbackDetails(feedbackId);
        });
    });
    
    // Edit feedback modal
    document.querySelectorAll('[data-tw-target="#edit-feedback-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const feedbackId = this.getAttribute('data-feedback-id');
            loadFeedbackForEdit(feedbackId);
        });
    });
    
    // Delete confirmation modal
    document.querySelectorAll('[data-tw-target="#delete-confirmation-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const feedbackId = this.getAttribute('data-feedback-id');
            document.getElementById('deleteFeedbackId').value = feedbackId;
        });
    });
    
    // Confirm delete button
    document.getElementById('confirmDeleteFeedback').addEventListener('click', function() {
        const feedbackId = document.getElementById('deleteFeedbackId').value;
        deleteFeedback(feedbackId);
    });
}

function initializeForms() {
    // Create feedback form
    document.getElementById('createFeedbackForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleCreateFeedback();
    });
    
    // Edit feedback form
    document.getElementById('editFeedbackForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleUpdateFeedback();
    });
}

function filterTableRowsByStatus(status) {
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

function filterTableRowsByRating(rating) {
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
        const userName = row.querySelector('td:nth-child(1) .font-medium')?.textContent.toLowerCase() || '';
        const userEmail = row.querySelector('td:nth-child(1) .text-slate-500')?.textContent.toLowerCase() || '';
        const description = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
        
        if (userName.includes(searchTerm) || userEmail.includes(searchTerm) || description.includes(searchTerm)) {
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

function loadFeedbackDetails(feedbackId) {
    const detailsContainer = document.getElementById('feedback-details');
    
    // Show loading state
    detailsContainer.innerHTML = `
        <div class="text-center text-slate-500 py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-lg">Loading feedback details...</p>
        </div>
    `;
    
    // Fetch feedback details
    fetch(`/feedback/${feedbackId}`)
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
                    <p class="text-slate-600 mt-1">Feedback ID: #${feedback.id}</p>
                </div>
                <button type="button" data-tw-dismiss="modal" class="text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <!-- User Information -->
            <div class="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4">User Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm font-medium text-slate-600">Name</label>
                        <div class="mt-1 text-slate-800">${feedback.user?.name || 'N/A'}</div>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-slate-600">Email</label>
                        <div class="mt-1 text-slate-800">${feedback.user?.email || 'N/A'}</div>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-slate-600">Status</label>
                        <div class="mt-1">
                            <span class="px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(feedback.status)}">
                                ${feedback.status ? feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1) : 'N/A'}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-slate-600">Date Created</label>
                        <div class="mt-1 text-slate-800">${formatDate(feedback.created_at)}</div>
                    </div>
                </div>
            </div>
            
            <!-- Rating -->
            <div class="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4">Rating</h3>
                <div class="flex items-center">
                    ${starsHtml}
                    <span class="ml-3 text-lg font-medium">${feedback.rating}/5</span>
                </div>
            </div>
            
            <!-- Feedback Description -->
            <div class="bg-white rounded-lg border border-slate-200 p-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4">Feedback Description</h3>
                <div class="text-slate-700 leading-relaxed">
                    ${feedback.description || 'No description provided'}
                </div>
            </div>
        </div>
    `;
}

function loadFeedbackForEdit(feedbackId) {
    fetch(`/feedback/${feedbackId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateEditForm(data.feedback);
            } else {
                showToast('Failed to load feedback for editing', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Error loading feedback for editing', 'error');
        });
}

function populateEditForm(feedback) {
    document.getElementById('editFeedbackId').value = feedback.id;
    document.getElementById('editDescription').value = feedback.description;
    document.getElementById('editStatus').value = feedback.status;
    
    // Set star rating
    setStarRating('edit-rating-stars', 'edit-rating-input', feedback.rating);
    
    // Update form action
    const form = document.getElementById('editFeedbackForm');
    form.action = `/feedback/${feedback.id}`;
}

function handleCreateFeedback() {
    const form = document.getElementById('createFeedbackForm');
    const rating = document.getElementById('rating-input').value;
    
    // Validate rating is selected
    if (!rating || rating == '0') {
        showToast('Please select a rating before submitting', 'error');
        return;
    }
    
    const formData = new FormData(form);
    
    fetch('/feedback', {
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
            showToast(data.message || 'Feedback created successfully!', 'success');
            
            // Close modal
            const closeBtn = document.querySelector('#create-feedback-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Reset form
            form.reset();
            setStarRating('rating-stars', 'rating-input', 0);
            
            // Reload page to show new feedback
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showToast(data.message || 'Failed to create feedback', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error creating feedback. Please try again.', 'error');
    });
}

function handleUpdateFeedback() {
    const form = document.getElementById('editFeedbackForm');
    const feedbackId = document.getElementById('editFeedbackId').value;
    const formData = new FormData(form);
    
    fetch(`/feedback/${feedbackId}`, {
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
            showToast(data.message || 'Feedback updated successfully!', 'success');
            
            // Close modal
            const closeBtn = document.querySelector('#edit-feedback-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Reload page to show updated feedback
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showToast(data.message || 'Failed to update feedback', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error updating feedback. Please try again.', 'error');
    });
}

function deleteFeedback(feedbackId) {
    fetch(`/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                           document.querySelector('input[name="_token"]')?.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message || 'Feedback deleted successfully!', 'success');
            
            // Close modal
            const closeBtn = document.querySelector('#delete-confirmation-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Reload page to show updated list
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showToast(data.message || 'Failed to delete feedback', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error deleting feedback. Please try again.', 'error');
    });
}

function getStatusColor(status) {
    switch(status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'inactive': return 'bg-slate-100 text-slate-800';
        default: return 'bg-slate-100 text-slate-800';
    }
}

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

function showToast(message, type = 'success') {
    const backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
    
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        className: "toastify-content",
        backgroundColor: backgroundColor,
        stopOnFocus: true,
        onClick: function() {
            this.hideToast();
        }
    }).showToast();
}
