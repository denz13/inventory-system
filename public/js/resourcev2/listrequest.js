// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('resource-search');
    const clearSearchBtn = document.getElementById('clear-search');

    if (!searchInput) return;

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Search function
    function performSearch(searchTerm) {
        const currentUrl = new URL(window.location.href);
        
        if (searchTerm && searchTerm.trim()) {
            currentUrl.searchParams.set('search', searchTerm.trim());
        } else {
            currentUrl.searchParams.delete('search');
        }
        
        // Reset to first page when searching
        currentUrl.searchParams.set('page', '1');
        
        // Show loading state
        searchInput.classList.add('loading');
        if (searchInput.nextElementSibling) {
            searchInput.nextElementSibling.style.opacity = '0.5';
        }
        
        // Navigate to search results
        window.location.href = currentUrl.toString();
    }

    // Debounced search for typing
    const debouncedSearch = debounce(function(e) {
        performSearch(e.target.value);
    }, 500);

    // Add event listeners
    searchInput.addEventListener('input', debouncedSearch);
    
    // Immediate search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(this.value);
        }
    });

    // Clear search functionality
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            performSearch('');
        });
    }
}

// Handle per page selection
function initializePerPageSelect() {
    const perPageSelect = document.getElementById('per-page-select');
    
    if (perPageSelect) {
        perPageSelect.addEventListener('change', function() {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('per_page', this.value);
            currentUrl.searchParams.set('page', '1'); // Reset to first page when changing items per page
            window.location.href = currentUrl.toString();
        });
    }
}

// Load schedule details into modal
function loadScheduleDetails(scheduleId) {
    const contentDiv = document.getElementById('schedule-details-content');
    contentDiv.innerHTML = '<div class="text-center"><i data-lucide="loader" class="w-8 h-8 mx-auto animate-spin"></i><div class="mt-2">Loading details...</div></div>';
    
    // Initialize the loader icon
    lucide.createIcons({
        attrs: {
            class: ["w-8", "h-8"]
        }
    });

    fetch(`/resource-v2/get-schedule-details/${scheduleId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            const schedule = data.schedule;
            let html = `
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12">
                        <div class="text-slate-500 text-xs">Control No.</div>
                        <div class="font-medium">${schedule.control_no}</div>
                    </div>
                    <div class="col-span-12 sm:col-span-6">
                        <div class="text-slate-500 text-xs">Resource</div>
                        <div class="font-medium">${schedule.resource}</div>
                    </div>
                    <div class="col-span-12 sm:col-span-6">
                        <div class="text-slate-500 text-xs">Office</div>
                        <div class="font-medium">${schedule.office}</div>
                    </div>
                    <div class="col-span-12 sm:col-span-6">
                        <div class="text-slate-500 text-xs">Driver</div>
                        <div class="font-medium">${schedule.driver}</div>
                    </div>
                    <div class="col-span-12 sm:col-span-6">
                        <div class="text-slate-500 text-xs">Destination</div>
                        <div class="font-medium">${schedule.destination}</div>
                    </div>
                    <div class="col-span-12 sm:col-span-6">
                        <div class="text-slate-500 text-xs">Start Date & Time</div>
                        <div class="font-medium">${schedule.start_datetime}</div>
                    </div>
                    <div class="col-span-12 sm:col-span-6">
                        <div class="text-slate-500 text-xs">End Date & Time</div>
                        <div class="font-medium">${schedule.end_datetime}</div>
                    </div>
                    <div class="col-span-12">
                        <div class="text-slate-500 text-xs">Purpose</div>
                        <div class="font-medium">${schedule.reason}</div>
                    </div>
                    <div class="col-span-12">
                        <div class="text-slate-500 text-xs">Passengers</div>
                        <div class="font-medium">${schedule.passengers}</div>
                    </div>
                    <div class="col-span-12">
                        <div class="text-slate-500 text-xs mb-2">Signatories</div>
                        <div class="overflow-x-auto">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th class="whitespace-nowrap">Name</th>
                                        <th class="whitespace-nowrap">Role</th>
                                        <th class="whitespace-nowrap">Status</th>
                                        <th class="whitespace-nowrap">Date Signed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${schedule.signatories.map(signatory => `
                                        <tr>
                                            <td>${signatory.name}</td>
                                            <td>${signatory.for}</td>
                                            <td>
                                                <div class="flex items-center">
                                                    <div class="w-2 h-2 rounded-full mr-2 ${
                                                        signatory.status === '1' ? 'bg-success' :
                                                        signatory.status === '2' ? 'bg-danger' : 'bg-pending'
                                                    }"></div>
                                                    ${
                                                        signatory.status === '1' ? 'Approved' :
                                                        signatory.status === '2' ? 'Declined' : 'Pending'
                                                    }
                                                </div>
                                            </td>
                                            <td>${signatory.date_signed || 'Not yet signed'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            contentDiv.innerHTML = html;
        } else {
            contentDiv.innerHTML = '<div class="text-center text-danger">Failed to load schedule details</div>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        contentDiv.innerHTML = '<div class="text-center text-danger">An error occurred while loading the details</div>';
    });
}

// Handle schedule cancellation
function initializeCancelConfirmation() {
    const modal = document.getElementById('cancel-confirmation-modal');
    let scheduleIdToCancel = null;

    // Store schedule ID when cancel button is clicked
    document.querySelectorAll('[data-tw-target="#cancel-confirmation-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            scheduleIdToCancel = this.dataset.scheduleId;
        });
    });

    // Handle confirmation
    document.getElementById('confirm-cancel').addEventListener('click', function() {
        if (!scheduleIdToCancel) return;

        this.disabled = true;
        this.innerHTML = '<i data-lucide="loader" class="w-4 h-4 mx-auto animate-spin"></i>';
        lucide.createIcons();

        fetch(`/resource-v2/cancel-schedule/${scheduleIdToCancel}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                window.location.reload();
            } else {
                alert(data.message || 'Failed to cancel schedule');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while cancelling the schedule');
        })
        .finally(() => {
            this.disabled = false;
            this.innerHTML = 'Yes, Cancel';
        });
    });
}

// Initialize modals
function initializeModals() {
    // Handle schedule details modal
    document.querySelectorAll('[data-tw-target="#schedule-details-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const scheduleId = this.dataset.scheduleId;
            loadScheduleDetails(scheduleId);
        });
    });
}

// Handle approve button click
$(document).on('click', '[data-tw-target="#approve-confirmation-modal"]', function() {
    const scheduleId = $(this).data('schedule-id');
    $('#confirm-approve').data('schedule-id', scheduleId);
});

// Handle decline button click
$(document).on('click', '[data-tw-target="#decline-confirmation-modal"]', function() {
    const scheduleId = $(this).data('schedule-id');
    $('#confirm-decline').data('schedule-id', scheduleId);
    $('#decline-reason').val(''); // Clear previous reason
});

// Handle approve confirmation
$('#confirm-approve').on('click', function() {
    const scheduleId = $(this).data('schedule-id');
    const approveModal = tailwind.Modal.getInstance(document.querySelector("#approve-confirmation-modal"));
    
    $.ajax({
        url: `/resource-v2/approve-schedule/${scheduleId}`,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        data: {
            _token: $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            if (response.status === 'success') {
                // Hide approve modal
                approveModal.hide();
                
                // Show success message
                $('#success-message').text(response.message);
                const successModal = tailwind.Modal.getInstance(document.querySelector("#success-modal"));
                successModal.show();
                
                // Reload the page after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                // Show error message
                $('#error-message').text(response.message);
                const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
                errorModal.show();
            }
        },
        error: function(xhr) {
            // Hide approve modal
            approveModal.hide();
            
            if (xhr.status === 401) {
                window.location.reload(); // Redirect to login if unauthorized
                return;
            }
            
            // Show error message
            $('#error-message').text(xhr.responseJSON?.message || 'An error occurred while approving the schedule.');
            const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
            errorModal.show();
        }
    });
});

// Handle decline confirmation
$('#confirm-decline').on('click', function() {
    const scheduleId = $(this).data('schedule-id');
    const declineModal = tailwind.Modal.getInstance(document.querySelector("#decline-confirmation-modal"));
    
    $.ajax({
        url: `/resource-v2/decline-schedule/${scheduleId}`,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        data: {
            _token: $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            if (response.status === 'success') {
                // Hide decline modal
                declineModal.hide();
                
                // Show success message
                $('#success-message').text(response.message);
                const successModal = tailwind.Modal.getInstance(document.querySelector("#success-modal"));
                successModal.show();
                
                // Reload the page after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                // Show error message
                $('#error-message').text(response.message);
                const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
                errorModal.show();
            }
        },
        error: function(xhr) {
            // Hide decline modal
            declineModal.hide();
            
            if (xhr.status === 401) {
                window.location.reload(); // Redirect to login if unauthorized
                return;
            }
            
            // Show error message
            $('#error-message').text(xhr.responseJSON?.message || 'An error occurred while declining the schedule.');
            const errorModal = tailwind.Modal.getInstance(document.querySelector("#error-modal"));
            errorModal.show();
        }
    });
});

// Document ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();

    // Initialize search functionality
    initializeSearch();

    // Initialize per page selection
    initializePerPageSelect();

    // Initialize modals
    initializeModals();

    // Initialize cancel confirmation
    initializeCancelConfirmation();

    // Add loading class styles
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            opacity: 0.5;
            pointer-events: none;
        }
        #resource-search:focus {
            box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
        }
    `;
    document.head.appendChild(style);
});
