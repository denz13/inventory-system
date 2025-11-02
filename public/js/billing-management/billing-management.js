// Tom Select will be initialized automatically by tom-select.js

// Billing Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Clear date range filter on page load if no URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('search') && !urlParams.has('page') && !urlParams.has('per_page')) {
        const dateRangeFilter = document.getElementById('dateRangeFilter');
        if (dateRangeFilter) {
            dateRangeFilter.value = '';
            
            // Wait a bit for Litepicker to initialize, then clear it
            setTimeout(() => {
                if (dateRangeFilter._litepicker) {
                    try {
                        dateRangeFilter._litepicker.clearSelection();
                        console.log('Cleared Litepicker selection on page load');
                    } catch (e) {
                        console.log('Could not clear Litepicker:', e);
                    }
                }
            }, 500);
            
            console.log('Cleared date range filter on page load');
        }
    }
    
    initializeEventListeners();
    addInitialBillingItem();
    initializeDateRangeWatcher();
    initializeUserSelectHandler();
    initializeRoleFilter();
});

function initializeUserSelectHandler() {
    // Monitor user select changes for auto-populating billing date range
    const userSelect = document.querySelector('select[name="user_id"]');
    if (userSelect) {
        userSelect.addEventListener('change', function() {
            const userId = this.value;
            if (userId) {
                fetchAndSetUserBillingDateRange(userId);
            } else {
                // Clear date range if no user selected
                const dateRangeInput = document.querySelector('input[name="billing_date_range"]');
                if (dateRangeInput) {
                    dateRangeInput.value = '';
                }
            }
        });
        
        console.log('User select handler initialized for auto-populating billing date range');
    }
}

function initializeRoleFilter() {
    const roleFilter = document.getElementById('roleFilter');
    const userSelect = document.getElementById('userSelect');
    
    if (!roleFilter || !userSelect) {
        console.log('Role filter or user select not found');
        return;
    }
    
    // Store all user options
    let allUserOptions = [];
    
    // Wait for Tom Select to initialize
    setTimeout(function() {
        const tomSelectInstance = userSelect.tomselect;
        
        if (tomSelectInstance) {
            // Store all original options
            Object.keys(tomSelectInstance.options).forEach(key => {
                const option = tomSelectInstance.options[key];
                allUserOptions.push({
                    value: option.value,
                    text: option.text,
                    role: option.$option ? option.$option.getAttribute('data-role') : ''
                });
            });
            
            console.log('Tom Select found, stored', allUserOptions.length, 'user options');
        } else {
            // Fallback: Get from original select element
            const options = userSelect.querySelectorAll('option');
            options.forEach(option => {
                if (option.value) { // Skip empty option
                    allUserOptions.push({
                        value: option.value,
                        text: option.textContent,
                        role: option.getAttribute('data-role')
                    });
                }
            });
            
            console.log('Tom Select not found, stored', allUserOptions.length, 'user options from original select');
        }
    }, 500);
    
    // Handle role filter change
    roleFilter.addEventListener('change', function() {
        const selectedRole = this.value;
        console.log('Role filter changed to:', selectedRole || 'All Roles');
        
        setTimeout(function() {
            const tomSelectInstance = userSelect.tomselect;
            
            if (tomSelectInstance) {
                // Clear existing options
                tomSelectInstance.clearOptions();
                
                // Filter and add options based on selected role
                const filteredOptions = selectedRole 
                    ? allUserOptions.filter(opt => opt.role === selectedRole)
                    : allUserOptions;
                
                console.log('Filtered to', filteredOptions.length, 'users');
                
                // Add filtered options
                filteredOptions.forEach(option => {
                    tomSelectInstance.addOption({
                        value: option.value,
                        text: option.text,
                        role: option.role
                    });
                });
                
                // Clear current selection
                tomSelectInstance.clear();
                
                // Refresh the dropdown
                tomSelectInstance.refreshOptions(false);
            }
        }, 100);
    });
    
    console.log('Role filter initialized');
}

async function fetchAndSetUserBillingDateRange(userId) {
    try {
        console.log('Fetching billing date range for user ID:', userId);
        
        const response = await fetch(`/billing-management/user/${userId}/date-range`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch billing date range');
        }
        
        const result = await response.json();
        console.log('API Response:', result);
        
        if (result.success && result.data) {
            const dateRange = result.data.date_range;
            const dateRangeInput = document.querySelector('input[name="billing_date_range"]');
            
            console.log('Found date range input:', dateRangeInput);
            console.log('Setting date range input value to:', dateRange);
            
            if (dateRangeInput) {
                // Parse the date range to get start and end dates
                const dates = dateRange.split(' - ');
                if (dates.length === 2) {
                    const startDate = new Date(dates[0].trim());
                    const endDate = new Date(dates[1].trim());
                    
                    console.log('Parsed dates:', { startDate, endDate });
                    
                    // Wait a bit for any date picker initialization
                    setTimeout(() => {
                        console.log('Current input value before update:', dateRangeInput.value);
                        
                        // Try to destroy existing litepicker if it exists
                        if (dateRangeInput._litepicker) {
                            console.log('Destroying existing litepicker...');
                            try {
                                dateRangeInput._litepicker.destroy();
                            } catch (e) {
                                console.log('Error destroying litepicker:', e);
                            }
                        }
                        
                        // Set the value first
                        dateRangeInput.value = dateRange;
                        console.log('Input value after setting:', dateRangeInput.value);
                        
                        // Recreate litepicker with the correct dates
                        if (typeof Litepicker !== 'undefined') {
                            console.log('Creating new litepicker with dates...');
                            try {
                                const newPicker = new Litepicker({
                                    element: dateRangeInput,
                                    autoApply: false,
                                    singleMode: false,
                                    numberOfColumns: 2,
                                    numberOfMonths: 2,
                                    showWeekNumbers: true,
                                    format: 'DD MMM, YYYY',
                                    startDate: startDate,
                                    endDate: endDate,
                                    dropdowns: {
                                        minYear: 1990,
                                        maxYear: null,
                                        months: true,
                                        years: true
                                    }
                                });
                                
                                console.log('New litepicker created successfully');
                                console.log('Final input value:', dateRangeInput.value);
                                
                                // Trigger events to notify other components
                                dateRangeInput.dispatchEvent(new Event('change', { bubbles: true }));
                                dateRangeInput.dispatchEvent(new Event('input', { bubbles: true }));
                                
                            } catch (e) {
                                console.error('Error creating new litepicker:', e);
                            }
                        } else {
                            console.log('Litepicker not available, just setting value');
                            // Fallback: just set the value and trigger events
                            dateRangeInput.value = dateRange;
                            dateRangeInput.dispatchEvent(new Event('change', { bubbles: true }));
                            dateRangeInput.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }, 500); // Increased timeout
                }
                
                console.log('Billing date range auto-populated:', {
                    user_id: result.data.user_id,
                    user_name: result.data.user_name,
                    date_range: dateRange,
                    is_reactivated: result.data.is_reactivated,
                    registration_date: result.data.registration_date,
                    last_update_date: result.data.last_update_date,
                    input_value: dateRangeInput.value
                });
                
                // Show info toast
                const infoMessage = result.data.is_reactivated 
                    ? `Billing period based on reactivation date: ${result.data.last_update_date}`
                    : `Billing period based on registration date: ${result.data.registration_date}`;
                
                showToast(infoMessage, 'info');
            } else {
                console.error('Date range input not found!');
            }
        }
    } catch (error) {
        console.error('Error fetching billing date range:', error);
        showToast('Could not auto-populate billing date range. Please select manually.', 'error');
    }
}

function initializeEventListeners() {
    // Send Overdue Notifications button
    const sendOverdueBtn = document.getElementById('sendOverdueNotificationsBtn');
    if (sendOverdueBtn) {
        sendOverdueBtn.addEventListener('click', function() {
            const overdueCount = this.getAttribute('data-overdue-count');
            
            // Update modal with overdue count
            document.getElementById('overdue-user-count').textContent = overdueCount;
            
            // Store button reference for later use
            window.overdueNotificationButton = this;
            
            // Show confirmation modal
            const modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#send-overdue-notifications-modal'));
            modal.show();
        });
    }

    // Confirm send overdue notifications button in modal
    const confirmSendOverdueBtn = document.getElementById('confirmSendOverdueBtn');
    if (confirmSendOverdueBtn) {
        confirmSendOverdueBtn.addEventListener('click', function() {
            // Close modal
            const modal = tailwind.Modal.getInstance(document.querySelector('#send-overdue-notifications-modal'));
            if (modal) {
                modal.hide();
            }
            
            // Send notifications using the stored button reference
            if (window.overdueNotificationButton) {
                sendOverdueNotifications(window.overdueNotificationButton);
            }
        });
    }

    // Search functionality - Server-side (Enter key only)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        // Get search term from URL if it exists
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search') || '';
        searchInput.value = searchTerm;
        
        // Search only when Enter key is pressed
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                performServerSideSearch();
            }
        });
        
        // Also allow clicking the search icon to trigger search
        const searchIcon = searchInput.parentElement.querySelector('svg');
        if (searchIcon) {
            searchIcon.style.cursor = 'pointer';
            searchIcon.addEventListener('click', function() {
                performServerSideSearch();
            });
        }
    }
    
    function performServerSideSearch() {
        const searchValue = searchInput.value.trim();
        const urlParams = new URLSearchParams(window.location.search);
        
        if (searchValue) {
            urlParams.set('search', searchValue);
        } else {
            urlParams.delete('search');
        }
        
        // Reset to page 1 when searching
        urlParams.delete('page');
        
        // Reload page with search parameter
        window.location.href = window.location.pathname + '?' + urlParams.toString();
    }

    // Date range filter functionality
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    if (dateRangeFilter) {
        // Listen for change event (when Apply is clicked)
        dateRangeFilter.addEventListener('change', function() {
            handleDateRangeFilter(this.value);
        });
        
        // Listen for input event (for real-time updates)
        dateRangeFilter.addEventListener('input', function() {
            handleDateRangeFilter(this.value);
        });
        
        // Listen for daterange apply event (litepicker specific)
        dateRangeFilter.addEventListener('daterange:applied', function() {
            handleDateRangeFilter(this.value);
        });
    }

    // Initialize date range watcher for robust change detection
    initializeDateRangeWatcher();

    // Clear filter / Show All button
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', function() {
            // Clear all filters by going to clean URL
            window.location.href = window.location.pathname;
        });
    }

    // Add billing item button
    const addBillingItemBtn = document.getElementById('addBillingItem');
    if (addBillingItemBtn) {
        addBillingItemBtn.addEventListener('click', addBillingItem);
    }

    // Form submissions
    const createForm = document.getElementById('createBillingForm');
    if (createForm) {
        createForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCreateBilling();
        });
    }

    // Modal event listeners
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-billing-id]')) {
            const billingId = e.target.getAttribute('data-billing-id');
            const target = e.target.getAttribute('data-tw-target');
            
            if (target === '#view-billing-modal') {
                loadBillingDetails(billingId);
            } else if (target === '#edit-billing-modal') {
                loadBillingForEdit(billingId);
            } else if (target === '#delete-confirmation-modal') {
                document.getElementById('deleteBillingId').value = billingId;
            }
        }
        
        // Remove billing item
        if (e.target.matches('.remove-billing-item')) {
            e.target.closest('.billing-item-row').remove();
            updateTotalAmount();
        }
    });

    // Input event listeners for calculation
    document.addEventListener('input', function(e) {
        if (e.target.matches('.item-qty') || e.target.matches('.item-price')) {
            updateItemTotal(e.target);
            updateTotalAmount();
        }
    });
}

// handleSearch() removed - now using server-side search

function initializeDateRangeWatcher() {
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    if (!dateRangeFilter) return;

    // Initialize lastValue with current value from URL to prevent auto-trigger
    let lastValue = dateRangeFilter.value || '';
    let initialized = false;
    
    // Wait a bit before starting to watch (prevent initial trigger)
    setTimeout(function() {
        initialized = true;
        console.log('Date range watcher initialized with value:', lastValue);
    }, 1000);

    // Watch for value changes using interval (only after initialized)
    setInterval(() => {
        if (!initialized) return; // Don't check until initialized
        
        const currentValue = dateRangeFilter.value;
        if (currentValue !== lastValue) {
            console.log('Date range changed from', lastValue, 'to', currentValue);
            lastValue = currentValue;
            handleDateRangeFilter(currentValue);
        }
    }, 100);

    // Also listen for clicks on the document to catch date picker Apply clicks (only after initialized)
    document.addEventListener('click', function(e) {
        if (!initialized) return; // Don't check until initialized
        
        // Add a small delay to ensure the value has been updated
        setTimeout(() => {
            const currentValue = dateRangeFilter.value;
            if (currentValue !== lastValue) {
                console.log('Date range changed via click from', lastValue, 'to', currentValue);
                lastValue = currentValue;
                handleDateRangeFilter(currentValue);
            }
        }, 100);
    });
}

function handleDateRangeFilter(dateRange) {
    console.log('Filtering by date range (server-side):', dateRange);
    
    if (!dateRange || dateRange.trim() === '') {
        // If no date range selected, clear filter and reload
        console.log('No date range, clearing filter');
        return; // Let the clear button handle this
    }

    // Server-side filtering: reload page with date range parameter
    const url = new URL(window.location.href);
    url.searchParams.set('date_range', dateRange);
    url.searchParams.delete('page'); // Reset to page 1 when filtering
    url.searchParams.delete('search'); // Clear search when using date filter
    
    console.log('Reloading with date range filter:', url.toString());
    window.location.href = url.toString();
}

// updateFilteredCount() removed - now using server-side filtering

// showAllData() removed - now using URL redirect to clear filters

function addInitialBillingItem() {
    const container = document.getElementById('billingItemsContainer');
    if (container && container.children.length === 0) {
        addBillingItem();
    }
    
    // Also add event listeners to any existing items
    const existingQtyInputs = container.querySelectorAll('.item-qty');
    const existingPriceInputs = container.querySelectorAll('.item-price');
    const existingRemoveBtns = container.querySelectorAll('.remove-billing-item');
    
    existingQtyInputs.forEach(input => {
        input.addEventListener('input', updateTotalAmount);
        input.addEventListener('change', updateTotalAmount);
    });
    
    existingPriceInputs.forEach(input => {
        input.addEventListener('input', updateTotalAmount);
        input.addEventListener('change', updateTotalAmount);
    });
    
    existingRemoveBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            btn.closest('.billing-item-row').remove();
            updateTotalAmount();
        });
    });
}

function addBillingItem() {
    const container = document.getElementById('billingItemsContainer');
    const itemIndex = container.children.length;
    
    const itemRow = document.createElement('div');
    itemRow.className = 'billing-item-row grid grid-cols-12 gap-4 mb-4 p-4 border border-slate-200 rounded-lg bg-slate-50';
    
    itemRow.innerHTML = `
        <div class="col-span-12 md:col-span-7">
            <label class="form-label text-sm font-medium text-slate-600">Description</label>
            <select class="form-control mt-1 p-2 border border-slate-300 rounded description-select" data-index="${itemIndex}" required>
                <option value="">Select Description</option>
                <option value="Monthly Dues">Monthly Dues</option>
                <option value="Membership Fee">Membership Fee</option>
                <option value="Others">Others (Specify)</option>
            </select>
            <input type="text" name="billing_items[${itemIndex}][description]" class="form-control mt-2 p-2 border border-slate-300 rounded description-input" placeholder="Enter description" style="display: none;" required>
        </div>
        <div class="col-span-12 md:col-span-2">
            <label class="form-label text-sm font-medium text-slate-600">Quantity</label>
            <input type="number" name="billing_items[${itemIndex}][qty]" class="form-control mt-1 p-2 border border-slate-300 rounded item-qty" min="1" value="1" required>
        </div>
        <div class="col-span-12 md:col-span-2">
            <label class="form-label text-sm font-medium text-slate-600">Price</label>
            <input type="number" name="billing_items[${itemIndex}][price]" class="form-control mt-1 p-2 border border-slate-300 rounded item-price" step="0.01" min="0" placeholder="0.00" required>
        </div>
        <div class="col-span-12 md:col-span-1 flex items-end">
            <button type="button" class="btn btn-danger btn-sm remove-billing-item">Remove</button>
        </div>
    `;
    
    container.appendChild(itemRow);
    
    // Add event listeners for automatic calculation
    const qtyInput = itemRow.querySelector('.item-qty');
    const priceInput = itemRow.querySelector('.item-price');
    const removeBtn = itemRow.querySelector('.remove-billing-item');
    const descriptionSelect = itemRow.querySelector('.description-select');
    const descriptionInput = itemRow.querySelector('.description-input');
    
    // Handle description dropdown change
    if (descriptionSelect) {
        descriptionSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            
            if (selectedValue === 'Others') {
                // Show manual input, hide select value from form data
                descriptionInput.style.display = 'block';
                descriptionInput.required = true;
                descriptionInput.value = ''; // Clear any previous value
                // Remove name from select so it doesn't submit
                this.removeAttribute('name');
            } else if (selectedValue) {
                // Hide manual input, use selected value
                descriptionInput.style.display = 'none';
                descriptionInput.required = false;
                descriptionInput.value = selectedValue; // Set the hidden input value
                // Set name back to select
                this.setAttribute('name', `billing_items[${itemIndex}][description]`);
            } else {
                // No selection
                descriptionInput.style.display = 'none';
                descriptionInput.required = false;
            }
        });
    }
    
    if (qtyInput) {
        qtyInput.addEventListener('input', updateTotalAmount);
        qtyInput.addEventListener('change', updateTotalAmount);
    }
    
    if (priceInput) {
        priceInput.addEventListener('input', updateTotalAmount);
        priceInput.addEventListener('change', updateTotalAmount);
    }
    
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            itemRow.remove();
            updateTotalAmount();
        });
    }
    
    updateTotalAmount();
}

function updateItemTotal(input) {
    const row = input.closest('.billing-item-row');
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const total = qty * price;
    
    // You can add a total display per item if needed
}

function updateTotalAmount() {
    // Get items from create modal specifically
    const createModal = document.getElementById('create-billing-modal');
    const allQtyInputs = createModal ? createModal.querySelectorAll('.item-qty') : document.querySelectorAll('#billingItemsContainer .item-qty');
    const allPriceInputs = createModal ? createModal.querySelectorAll('.item-price') : document.querySelectorAll('#billingItemsContainer .item-price');
    let grandTotal = 0;
    
    for (let i = 0; i < allQtyInputs.length; i++) {
        const qty = parseFloat(allQtyInputs[i].value) || 0;
        const price = parseFloat(allPriceInputs[i].value) || 0;
        grandTotal += qty * price;
    }
    
    // Update create modal amount due field specifically
    const amountDueInput = createModal ? 
        createModal.querySelector('input[name="amount_due"]') : 
        document.querySelector('#createBillingForm input[name="amount_due"]');
    
    if (amountDueInput) {
        amountDueInput.value = grandTotal.toFixed(2);
    }
}

function handleCreateBilling() {
    const form = document.getElementById('createBillingForm');
    const formData = new FormData(form);
    
    // Debug: Log form data
    console.log('Form data being sent:');
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
    
    // Validate form data
    const userId = formData.get('user_id');
    const billingDateRange = formData.get('billing_date_range');
    const billingItems = [];
    
    // Collect billing items
    for (let [key, value] of formData.entries()) {
        if (key.startsWith('billing_items[') && key.includes('][description]')) {
            const index = key.match(/billing_items\[(\d+)\]/)[1];
            const qty = formData.get(`billing_items[${index}][qty]`);
            const price = formData.get(`billing_items[${index}][price]`);
            
            if (value && qty && price) {
                billingItems.push({ description: value, qty: qty, price: price });
            }
        }
    }
    
    console.log('Parsed billing items:', billingItems);
    
    if (!userId) {
        showToast('Please select a user', 'error');
        return;
    }
    
    if (!billingDateRange) {
        showToast('Please select a billing date range', 'error');
        return;
    }
    
    if (billingItems.length === 0) {
        showToast('Please add at least one billing item', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('button[form="createBillingForm"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    
    if (submitBtn) {
        submitBtn.innerHTML = 'Creating...';
        submitBtn.disabled = true;
    }
    
    fetch(form.action, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || document.querySelector('input[name="_token"]')?.value
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Server error:', text);
                throw new Error(`HTTP ${response.status}: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);
        if (data.message) {
            showToast(data.message, 'success');
        } else {
            console.error('No message in response:', data);
            showToast('Billing created successfully', 'success');
        }
        
        // Always close modal and reload page after successful creation
        const closeBtn = document.querySelector('#create-billing-modal [data-tw-dismiss="modal"]');
        if (closeBtn) closeBtn.click();
        
        // Reload page to show the new billing
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error creating billing: ' + error.message, 'error');
    })
    .finally(() => {
        // Reset button state
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Toast notification function (following your announcement pattern exactly)
function showToast(message, type = 'success') {
    const toastId = type === 'success' ? 'billing_toast_success' : 'billing_toast_error';
    
    if (type === 'error') {
        // Update error message slot
        const messageSlot = document.getElementById('billing_error_message_slot');
        if (messageSlot) {
            messageSlot.textContent = message;
        }
    }
    
    // Use your notification-toast component's show function
    try {
        if (window[`showNotification_${toastId}`] && type !== 'info') {
            window[`showNotification_${toastId}`]();
        } else {
            // Fallback: use Toastify if available
            if (typeof Toastify !== 'undefined') {
                const backgroundColor = type === 'success' ? "#10b981" : 
                                      type === 'error' ? "#ef4444" : 
                                      "#3b82f6"; // Blue for info
                
                Toastify({
                    text: message,
                    duration: 5000,
                    gravity: "top",
                    position: "right",
                    className: "toastify-content",
                    backgroundColor: backgroundColor,
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

// debounce() removed - no longer needed with server-side search

// Send overdue notifications function
function sendOverdueNotifications(buttonElement) {
    // Show loading state
    const originalText = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending...
    `;

    // Send AJAX request
    fetch('/billing-management/send-overdue-notifications', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            
            // Show additional info
            if (data.data) {
                console.log('Overdue notifications sent:', data.data);
                
                // Optionally show a more detailed success message
                setTimeout(() => {
                    showToast(
                        `Notified ${data.data.notifications_sent} user(s) about ${data.data.total_overdue_bills} overdue bill(s)`,
                        'info'
                    );
                }, 2000);
            }
            
            // Reload page after a delay to refresh the button state
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } else {
            showToast(data.message || 'Failed to send notifications', 'error');
            
            // Reset button state
            buttonElement.disabled = false;
            buttonElement.innerHTML = originalText;
        }
    })
    .catch(error => {
        console.error('Error sending overdue notifications:', error);
        showToast('Error sending notifications. Please try again.', 'error');
        
        // Reset button state
        buttonElement.disabled = false;
        buttonElement.innerHTML = originalText;
    });
}

// Initialize modal handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeModalHandlers();
});

// Modal handler functions
function initializeModalHandlers() {
    // View billing modal
    document.querySelectorAll('[data-tw-target="#view-billing-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const billingId = this.getAttribute('data-billing-id');
            loadBillingDetails(billingId);
        });
    });
    
    // Edit billing modal
    document.querySelectorAll('[data-tw-target="#edit-billing-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const billingId = this.getAttribute('data-billing-id');
            loadBillingForEdit(billingId);
        });
    });
    
    // Delete confirmation modal
    document.querySelectorAll('[data-tw-target="#delete-confirmation-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const billingId = this.getAttribute('data-billing-id');
            document.getElementById('deleteBillingId').value = billingId;
        });
    });

    // Confirm delete button
    const deleteBtn = document.getElementById('confirmDeleteBilling');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            handleDeleteBilling();
        });
    }

    // Edit modal add billing item functionality
    const addEditItemBtn = document.getElementById('addEditBillingItem');
    if (addEditItemBtn) {
        addEditItemBtn.addEventListener('click', () => addEditBillingItem());
    }

    // Edit form submission
    const editForm = document.getElementById('editBillingForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleUpdateBilling();
        });
    }
}

// Duplicate function removed - using the one at line 421

// Tom Select Initialization
function initializeTomSelect() {
    // Initialize Tom Select for user dropdown in create modal
    const userSelect = document.querySelector('#create-billing-modal select[name="user_id"]');
    if (userSelect) {
        new TomSelect(userSelect, {
            placeholder: 'Search and select a user...',
            allowEmptyOption: true,
            create: false,
            sortField: {
                field: 'text',
                direction: 'asc'
            },
            render: {
                option: function(data, escape) {
                    return '<div class="flex items-center justify-between p-2">' +
                        '<div>' +
                            '<div class="font-medium text-slate-800">' + escape(data.text.split(' (')[0]) + '</div>' +
                            '<div class="text-sm text-slate-500">' + escape(data.text.split(' (')[1]?.replace(')', '') || '') + '</div>' +
                        '</div>' +
                    '</div>';
                },
                item: function(data, escape) {
                    return '<div class="flex items-center">' +
                        '<div class="font-medium text-slate-800">' + escape(data.text.split(' (')[0]) + '</div>' +
                        '<div class="text-sm text-slate-500 ml-2">(' + escape(data.text.split(' (')[1]?.replace(')', '') || '') + '</div>' +
                    '</div>';
                }
            }
        });
    }
}

function loadBillingDetails(billingId) {
    const billingDetailsDiv = document.getElementById('billing-details');
    
    // Show loading state
    billingDetailsDiv.innerHTML = `
        <div class="text-center text-slate-500 py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-lg">Loading billing details...</p>
        </div>
    `;
    
    fetch(`/billing/${billingId}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        displayBillingDetails(data.billing);
    })
    .catch(error => {
        console.error('Error:', error);
        billingDetailsDiv.innerHTML = `
            <div class="text-center text-red-500 py-12">
                <p>Error loading billing details. Please try again.</p>
            </div>
        `;
    });
}

function displayBillingDetails(billing) {
    const billingDetailsDiv = document.getElementById('billing-details');
    
    let itemsHtml = '';
    billing.billing_items.forEach((item, index) => {
        const total = (item.qty * item.price).toFixed(2);
        itemsHtml += `
            <tr>
                <td class="border-b border-slate-200 py-3 px-4">${index + 1}</td>
                <td class="border-b border-slate-200 py-3 px-4">${item.description}</td>
                <td class="border-b border-slate-200 py-3 px-4 text-center">${item.qty}</td>
                <td class="border-b border-slate-200 py-3 px-4 text-right">₱${parseFloat(item.price).toFixed(2)}</td>
                <td class="border-b border-slate-200 py-3 px-4 text-right font-medium">₱${total}</td>
            </tr>
        `;
    });
    
    billingDetailsDiv.innerHTML = `
        <div class="p-6">
            <!-- Billing Information -->
            <div class="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                <h3 class="font-semibold text-lg mb-4 text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Billing Information
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="form-label text-sm font-semibold text-slate-700">Billing Date</label>
                        <div class="form-control mt-1 p-3 bg-white border border-slate-300 rounded-lg">${billing.billing_date}</div>
                    </div>
                    <div>
                        <label class="form-label text-sm font-semibold text-slate-700">Name</label>
                        <div class="form-control mt-1 p-3 bg-white border border-slate-300 rounded-lg">${billing.user.name}</div>
                    </div>
                    <div>
                        <label class="form-label text-sm font-semibold text-slate-700">Email</label>
                        <div class="form-control mt-1 p-3 bg-white border border-slate-300 rounded-lg">${billing.user.email}</div>
                    </div>
                </div>
            </div>
            
            <!-- Billing Items Section -->
            <div class="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
                    <h3 class="font-semibold text-lg text-slate-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <path d="M9 12l2 2 4-4"></path>
                            <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                            <path d="M3 13v6c0 .552.448 1 1 1h16c.552 0 1-.448 1-1v-6"></path>
                        </svg>
                        Billing Items (${billing.billing_items.length} items)
                    </h3>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-50">
                            <tr>
                                <th class="text-left py-3 px-4 font-semibold text-slate-700">#</th>
                                <th class="text-left py-3 px-4 font-semibold text-slate-700">Description</th>
                                <th class="text-center py-3 px-4 font-semibold text-slate-700">Qty</th>
                                <th class="text-right py-3 px-4 font-semibold text-slate-700">Price</th>
                                <th class="text-right py-3 px-4 font-semibold text-slate-700">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                            <tr class="bg-slate-100 font-bold">
                                <td colspan="4" class="py-4 px-4 text-right text-slate-700">TOTAL AMOUNT DUE:</td>
                                <td class="py-4 px-4 text-right text-lg text-blue-600">₱${parseFloat(billing.amount_due).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function loadBillingForEdit(billingId) {
    fetch(`/billing/${billingId}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const billing = data.billing;
        
        // Set form values
        document.getElementById('editBillingId').value = billing.id;
        document.getElementById('editUserId').value = billing.user_id;
        document.getElementById('editUserDisplay').value = `${billing.user.name} (${billing.user.email})`;
        document.getElementById('editBillingDateRange').value = billing.billing_date;
        document.getElementById('editAmountDue').value = parseFloat(billing.amount_due).toFixed(2);
        
        // Update form action
        document.getElementById('editBillingForm').action = `/billing/${billing.id}`;
        
        // Load billing items
        const container = document.getElementById('editBillingItemsContainer');
        container.innerHTML = '';
        
        billing.billing_items.forEach((item, index) => {
            addEditBillingItem();
            const rows = container.querySelectorAll('.billing-item-row');
            const currentRow = rows[rows.length - 1];
            
            const descriptionSelect = currentRow.querySelector('.description-select');
            const descriptionInput = currentRow.querySelector('.description-input');
            
            // Check if description is one of the predefined options
            const predefinedOptions = ['Monthly Dues', 'Membership Fee'];
            if (predefinedOptions.includes(item.description)) {
                // Set select to predefined value
                descriptionSelect.value = item.description;
                descriptionInput.style.display = 'none';
                descriptionInput.required = false;
                descriptionInput.value = item.description;
                descriptionSelect.setAttribute('name', `billing_items[${index}][description]`);
            } else {
                // Set to "Others" and show manual input
                descriptionSelect.value = 'Others';
                descriptionInput.style.display = 'block';
                descriptionInput.required = true;
                descriptionInput.value = item.description;
                descriptionSelect.removeAttribute('name');
            }
            
            currentRow.querySelector('input[name$="[qty]"]').value = item.qty;
            currentRow.querySelector('input[name$="[price]"]').value = item.price;
        });
        
        // Update total
        updateEditTotalAmount();
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error loading billing for editing. Please try again.', 'error');
    });
}

function addEditBillingItem() {
    const container = document.getElementById('editBillingItemsContainer');
    const itemCount = container.querySelectorAll('.billing-item-row').length;
    
    const itemRow = document.createElement('div');
    itemRow.className = 'billing-item-row grid grid-cols-12 gap-4 mb-4 p-4 border border-slate-200 rounded-lg bg-slate-50';
    itemRow.innerHTML = `
        <div class="col-span-12 md:col-span-7">
            <label class="form-label text-sm font-medium text-slate-600">Description</label>
            <select class="form-control mt-1 p-2 border border-slate-300 rounded description-select" data-index="${itemCount}" required>
                <option value="">Select Description</option>
                <option value="Monthly Dues">Monthly Dues</option>
                <option value="Membership Fee">Membership Fee</option>
                <option value="Others">Others (Specify)</option>
            </select>
            <input type="text" name="billing_items[${itemCount}][description]" class="form-control mt-2 p-2 border border-slate-300 rounded description-input" placeholder="Enter description" style="display: none;" required>
        </div>
        <div class="col-span-12 md:col-span-2">
            <label class="form-label text-sm font-medium text-slate-600">Quantity</label>
            <input type="number" name="billing_items[${itemCount}][qty]" class="form-control mt-1 p-2 border border-slate-300 rounded item-qty" placeholder="Qty" min="1" required>
        </div>
        <div class="col-span-12 md:col-span-2">
            <label class="form-label text-sm font-medium text-slate-600">Price</label>
            <input type="number" name="billing_items[${itemCount}][price]" class="form-control mt-1 p-2 border border-slate-300 rounded item-price" placeholder="Price" step="0.01" min="0" required>
        </div>
        <div class="col-span-12 md:col-span-1">
            <button type="button" class="btn btn-danger btn-sm w-full remove-item">Remove</button>
        </div>
    `;
    
    container.appendChild(itemRow);
    
    // Add event listeners for new row
    const qtyInput = itemRow.querySelector('.item-qty');
    const priceInput = itemRow.querySelector('.item-price');
    const removeBtn = itemRow.querySelector('.remove-item');
    const descriptionSelect = itemRow.querySelector('.description-select');
    const descriptionInput = itemRow.querySelector('.description-input');
    
    // Handle description dropdown change
    if (descriptionSelect) {
        descriptionSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            
            if (selectedValue === 'Others') {
                // Show manual input
                descriptionInput.style.display = 'block';
                descriptionInput.required = true;
                descriptionInput.value = '';
                // Remove name from select
                this.removeAttribute('name');
            } else if (selectedValue) {
                // Hide manual input, use selected value
                descriptionInput.style.display = 'none';
                descriptionInput.required = false;
                descriptionInput.value = selectedValue;
                // Set name to select
                this.setAttribute('name', `billing_items[${itemCount}][description]`);
            } else {
                // No selection
                descriptionInput.style.display = 'none';
                descriptionInput.required = false;
            }
        });
    }
    
    qtyInput.addEventListener('input', updateEditTotalAmount);
    priceInput.addEventListener('input', updateEditTotalAmount);
    removeBtn.addEventListener('click', function() {
        itemRow.remove();
        updateEditTotalAmount();
    });
}

function updateEditTotalAmount() {
    const container = document.getElementById('editBillingItemsContainer');
    const items = container.querySelectorAll('.billing-item-row');
    let total = 0;
    
    items.forEach(item => {
        const qty = parseFloat(item.querySelector('.item-qty').value) || 0;
        const price = parseFloat(item.querySelector('.item-price').value) || 0;
        total += qty * price;
    });
    
    const amountInput = document.getElementById('editAmountDue');
    if (amountInput) {
        amountInput.value = total.toFixed(2);
    }
}

function handleUpdateBilling() {
    const form = document.getElementById('editBillingForm');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = document.querySelector('button[form="editBillingForm"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    
    if (submitBtn) {
        submitBtn.innerHTML = 'Updating...';
        submitBtn.disabled = true;
    }
    
    fetch(form.action, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || document.querySelector('input[name="_token"]')?.value
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Server error:', text);
                throw new Error(`HTTP ${response.status}: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            showToast(data.message, 'success');
            // Close modal and reload page
            const closeBtn = document.querySelector('#edit-billing-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error updating billing: ' + error.message, 'error');
    })
    .finally(() => {
        // Reset button state
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function handleDeleteBilling() {
    const billingId = document.getElementById('deleteBillingId').value;
    
    if (billingId) {
        fetch(`/billing/${billingId}`, {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || document.querySelector('input[name="_token"]')?.value
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
            console.error('Error:', error);
            showToast('Error deleting billing. Please try again.', 'error');
        });
    }
}

// Duplicate function removed - using the one at line 421

// Tom Select Initialization
function initializeTomSelect() {
    // Initialize Tom Select for user dropdown in create modal
    const userSelect = document.querySelector('#create-billing-modal select[name="user_id"]');
    if (userSelect) {
        new TomSelect(userSelect, {
            placeholder: 'Search and select a user...',
            allowEmptyOption: true,
            create: false,
            sortField: {
                field: 'text',
                direction: 'asc'
            },
            render: {
                option: function(data, escape) {
                    return '<div class="flex items-center justify-between p-2">' +
                        '<div>' +
                            '<div class="font-medium text-slate-800">' + escape(data.text.split(' (')[0]) + '</div>' +
                            '<div class="text-sm text-slate-500">' + escape(data.text.split(' (')[1]?.replace(')', '') || '') + '</div>' +
                        '</div>' +
                    '</div>';
                },
                item: function(data, escape) {
                    return '<div class="flex items-center">' +
                        '<div class="font-medium text-slate-800">' + escape(data.text.split(' (')[0]) + '</div>' +
                        '<div class="text-sm text-slate-500 ml-2">(' + escape(data.text.split(' (')[1]?.replace(')', '') || '') + '</div>' +
                    '</div>';
                }
            }
        });
    }
}
