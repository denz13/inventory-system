document.addEventListener('DOMContentLoaded', function() {
    console.log('Users Login script loaded');
    
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
        const loginRows = Array.from(document.querySelectorAll('#usersLoginTable tbody tr.intro-x'));
        
        if (loginRows.length === 0) return;
        
        let visibleCount = 0;
        
        loginRows.forEach(row => {
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
        updateNoResultsMessage(searchTerm, visibleCount, loginRows.length);
    }

    // Update no results message
    function updateNoResultsMessage(searchTerm, visibleCount, totalRows) {
        const tbody = document.querySelector('#usersLoginTable tbody');
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
                <td colspan="8" class="text-center py-8">
                    <div class="text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <div class="font-medium">No login activities found</div>
                        <div class="text-sm">No activities match your search. Try a different search term.</div>
                    </div>
                </td>
            `;
            tbody.appendChild(noDataRow);
        }
    }

    // Handle View User Login
    document.querySelectorAll('[data-action="view"]').forEach(button => {
        button.addEventListener('click', function() {
            const loginId = this.getAttribute('data-id');
            loadUserLoginDetails(loginId);
        });
    });

    // Load user login details for view modal
    function loadUserLoginDetails(loginId) {
        const detailsContainer = document.getElementById('user-login-details-content');
        
        // Show loading state
        detailsContainer.innerHTML = `
            <div class="text-center text-slate-500 py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p class="text-lg">Loading login details...</p>
            </div>
        `;
        
        fetch(`/users-login/${loginId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayUserLoginDetails(data.data);
                } else {
                    showError(data.message || 'Failed to load login details');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Error loading login details');
            });
    }

    // Display user login details in modal
    function displayUserLoginDetails(login) {
        const detailsContainer = document.getElementById('user-login-details-content');
        
        if (!detailsContainer) {
            console.error('user-login-details-content element not found');
            return;
        }
        
        const userPhotoHtml = login.user && login.user.photo
            ? `<img src="${window.location.origin}/storage/profiles/${login.user.photo}" alt="${login.user.name}" class="w-16 h-16 rounded-full object-cover border-2 border-slate-200">`
            : `<div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl border-2 border-slate-200">
                ${login.user ? login.user.name.charAt(0).toUpperCase() : 'U'}
               </div>`;
        
        const statusBadgeHtml = login.status === 'login'
            ? `<span class="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                </svg>
                Login Successful
               </span>`
            : login.status === 'logout'
            ? `<span class="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800 inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16,17 21,12 16,7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
               </span>`
            : `<span class="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                ${login.status ? login.status.charAt(0).toUpperCase() + login.status.slice(1) : 'Unknown'}
               </span>`;
        
        detailsContainer.innerHTML = `
            <div class="px-6 py-8">
                <!-- Login Record ID -->
                <div class="mb-6 text-center">
                    <span class="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <path d="M20 8v6"></path>
                            <path d="M23 11h-6"></path>
                        </svg>
                        Login Record #${String(login.id).padStart(6, '0')}
                    </span>
                </div>

                <!-- User Information -->
                <div class="mb-6">
                    <label class="form-label text-base font-semibold text-slate-700">User</label>
                    <div class="form-control mt-2 p-4 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                        <div class="flex items-center">
                            ${userPhotoHtml}
                            <div class="ml-4">
                                <div class="font-medium text-lg">${login.user ? login.user.name : 'Unknown User'}</div>
                                <div class="text-sm text-slate-500">${login.user ? login.user.email : 'N/A'}</div>
                                ${login.user && login.user.role ? `<div class="text-xs text-slate-400 mt-1">Role: ${login.user.role}</div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Status -->
                <div class="mb-6">
                    <label class="form-label text-base font-semibold text-slate-700">Authentication Status</label>
                    <div class="form-control mt-2 p-4 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 mr-3">
                                <path d="M9 12l2 2 4-4"></path>
                                <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                            </svg>
                            <div>
                                ${statusBadgeHtml}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Device & Location Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="form-label text-base font-semibold text-slate-700">Browser</label>
                        <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 mr-3">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M8 12h8"></path>
                                    <path d="M12 8v8"></path>
                                </svg>
                                <div>
                                    <div class="font-medium">${login.browser || 'Unknown Browser'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label class="form-label text-base font-semibold text-slate-700">IP Address</label>
                        <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 mr-3">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M12 1v6m0 6v6"></path>
                                    <path d="M21 12h-6m-6 0H3"></path>
                                </svg>
                                <div>
                                    <div class="font-medium font-mono">${login.ip_address || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- MAC Address & Location -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="form-label text-base font-semibold text-slate-700">MAC Address</label>
                        <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-600 mr-3">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                    <line x1="8" y1="21" x2="16" y2="21"></line>
                                    <line x1="12" y1="17" x2="12" y2="21"></line>
                                </svg>
                                <div>
                                    <div class="font-medium font-mono">${login.mac_address || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label class="form-label text-base font-semibold text-slate-700">Location</label>
                        <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-600 mr-3">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <div>
                                    <div class="font-medium">${login.location || 'Unknown Location'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Timestamp Information -->
                <div class="mb-6">
                    <label class="form-label text-base font-semibold text-slate-700">Date & Time</label>
                    <div class="form-control mt-2 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 mr-3">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12,6 12,12 16,14"></polyline>
                            </svg>
                            <div>
                                <div class="font-medium">${formatDateTime(login.created_at)}</div>
                                <div class="text-xs text-slate-500">${getRelativeTime(login.created_at)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Show error message
    function showError(message) {
        const detailsContainer = document.getElementById('user-login-details-content');
        
        if (!detailsContainer) {
            console.error('user-login-details-content element not found');
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
        const toastId = type === 'success' ? 'users_login_toast_success' : 'users_login_toast_error';
        
        if (type === 'error') {
            const errorMessageSlot = document.getElementById('users_login_error_message_slot');
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
