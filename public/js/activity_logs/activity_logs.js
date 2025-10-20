document.addEventListener('DOMContentLoaded', function() {
    console.log('Activity Logs script loaded');
    
    // Initialize search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applySearch();
        });
    }

    // Apply search filter
    function applySearch() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const logRows = Array.from(document.querySelectorAll('#activityLogsTable tbody tr.intro-x'));
        
        if (logRows.length === 0) return;
        
        let visibleCount = 0;
        
        logRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            
            // Check search match
            const matchesSearch = searchTerm === '' || text.includes(searchTerm);
            
            // Show/hide row based on search
            if (matchesSearch) {
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
        updateNoResultsMessage(searchTerm, visibleCount, logRows.length);
    }

    // Update no results message
    function updateNoResultsMessage(searchTerm, visibleCount, totalRows) {
        const tbody = document.querySelector('#activityLogsTable tbody');
        let noDataRow = tbody?.querySelector('tr.no-data-found');
        
        // Remove existing no data row if it exists
        if (noDataRow) {
            noDataRow.remove();
        }
        
        // Check if we should show "no results" message
        const hasActiveFilters = searchTerm !== '';
        
        if (visibleCount === 0 && hasActiveFilters && totalRows > 0 && tbody) {
            // Create new no data row
            noDataRow = document.createElement('tr');
            noDataRow.className = 'no-data-found';
            noDataRow.innerHTML = `
                <td colspan="5" class="text-center py-8">
                    <div class="text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <div class="font-medium">No activity logs found</div>
                        <div class="text-sm">No logs match your search. Try a different search term.</div>
                    </div>
                </td>
            `;
            tbody.appendChild(noDataRow);
        }
    }

    // Handle View Activity Log
    document.querySelectorAll('[data-action="view"]').forEach(button => {
        button.addEventListener('click', function() {
            const logId = this.getAttribute('data-id');
            loadActivityLogDetails(logId);
        });
    });

    // Load activity log details for view modal
    function loadActivityLogDetails(logId) {
        const detailsContainer = document.getElementById('activity-log-details-content');
        
        // Show loading state
        detailsContainer.innerHTML = `
            <div class="text-center text-slate-500 py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p class="text-lg">Loading activity log details...</p>
            </div>
        `;
        
        fetch(`/activity-logs/${logId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayActivityLogDetails(data.data);
                } else {
                    showError(data.message || 'Failed to load activity log details');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Error loading activity log details');
            });
    }

    // Display activity log details in modal
    function displayActivityLogDetails(log) {
        const detailsContainer = document.getElementById('activity-log-details-content');
        
        if (!detailsContainer) {
            console.error('activity-log-details-content element not found');
            return;
        }
        
        const userPhotoHtml = log.user && log.user.photo
            ? `<img src="${window.location.origin}/storage/profiles/${log.user.photo}" alt="${log.user.name}" class="w-16 h-16 rounded-full object-cover border-2 border-slate-200">`
            : `<div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl border-2 border-slate-200">
                ${log.user ? log.user.name.charAt(0).toUpperCase() : 'U'}
               </div>`;
        
        detailsContainer.innerHTML = `
            <div class="px-6 py-8">
                <!-- Activity Log ID -->
                <div class="mb-6 text-center">
                    <span class="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                        </svg>
                        Activity Log #${String(log.id).padStart(6, '0')}
                    </span>
                </div>

                <!-- User Information -->
                <div class="mb-6">
                    <label class="form-label text-base font-semibold text-slate-700">Performed By</label>
                    <div class="form-control mt-2 p-4 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                        <div class="flex items-center">
                            ${userPhotoHtml}
                            <div class="ml-4">
                                <div class="font-medium text-lg">${log.user ? log.user.name : 'Unknown User'}</div>
                                <div class="text-sm text-slate-500">${log.user ? log.user.email : 'N/A'}</div>
                                ${log.user && log.user.role ? `<div class="text-xs text-slate-400 mt-1">Role: ${log.user.role}</div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Activity Description -->
                <div class="mb-6">
                    <label class="form-label text-base font-semibold text-slate-700">Activity Description</label>
                    <div class="form-control mt-2 p-4 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 min-h-24">
                        <p class="whitespace-pre-wrap">${log.description || 'No description available'}</p>
                    </div>
                </div>
                
                <!-- Timestamp Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="form-label text-base font-semibold text-slate-700">Date & Time</label>
                        <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 mr-3">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12,6 12,12 16,14"></polyline>
                                </svg>
                                <div>
                                    <div class="font-medium">${formatDateTime(log.created_at)}</div>
                                    <div class="text-xs text-slate-500">${getRelativeTime(log.created_at)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${log.updated_at && log.updated_at !== log.created_at ? `
                    <div>
                        <label class="form-label text-base font-semibold text-slate-700">Last Updated</label>
                        <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 mr-3">
                                    <polyline points="23 4 23 10 17 10"></polyline>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                </svg>
                                <div>
                                    <div class="font-medium">${formatDateTime(log.updated_at)}</div>
                                    <div class="text-xs text-slate-500">${getRelativeTime(log.updated_at)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Show error message
    function showError(message) {
        const detailsContainer = document.getElementById('activity-log-details-content');
        
        if (!detailsContainer) {
            console.error('activity-log-details-content element not found');
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

    // Toast notification function
    function showToast(message, type = 'success') {
        const toastId = type === 'success' ? 'activity_logs_toast_success' : 'activity_logs_toast_error';
        
        if (type === 'error') {
            const errorMessageSlot = document.getElementById('activity_logs_error_message_slot');
            if (errorMessageSlot) {
                errorMessageSlot.textContent = message;
            }
        }
        
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

    // Format date and time
    function formatDateTime(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // Get relative time (e.g., "2 hours ago")
    function getRelativeTime(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        const diffMonth = Math.floor(diffDay / 30);
        const diffYear = Math.floor(diffDay / 365);
        
        if (diffYear > 0) return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
        if (diffMonth > 0) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
        if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
        if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        if (diffSec > 0) return `${diffSec} second${diffSec > 1 ? 's' : ''} ago`;
        
        return 'Just now';
    }
});

