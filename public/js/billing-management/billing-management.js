// Billing Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    addInitialBillingItem();
    initializeDateRangeWatcher();
});

function initializeEventListeners() {
    // Search and filter functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
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

    // Clear filter / Show All button
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', function() {
            showAllData();
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

function handleSearch() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const tableRows = document.querySelectorAll('tbody tr.intro-x');
    
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchValue) || searchValue === '') {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount();
    
    // Clear date range filter when searching
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    if (dateRangeFilter && searchValue !== '') {
        dateRangeFilter.value = '';
    }
}

function handleDateRangeFilter(dateRange) {
    if (!dateRange) {
        // If no date range selected, show all rows
        const tableRows = document.querySelectorAll('tbody tr.intro-x');
        tableRows.forEach(row => {
            row.style.display = '';
        });
        updateFilteredCount();
        return;
    }

    const tableRows = document.querySelectorAll('tbody tr.intro-x');

    // Parse the date range (format: "1 Aug, 2025 - 31 Aug, 2025")
    const dateParts = dateRange.split(' - ');
    if (dateParts.length !== 2) {
        console.error('Invalid date range format');
        return;
    }

    const startDate = new Date(dateParts[0]);
    const endDate = new Date(dateParts[1]);

    tableRows.forEach(row => {
        const billingDateStr = row.getAttribute('data-billing-date');
        if (!billingDateStr) {
            row.style.display = 'none';
            return;
        }

        const billingDate = new Date(billingDateStr);
        
        // Check if billing date is within the selected range
        if (billingDate >= startDate && billingDate <= endDate) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });

    updateFilteredCount();
    
    // Clear search input when filtering
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
}

function updateFilteredCount() {
    const allRows = document.querySelectorAll('tbody tr.intro-x');
    let visibleCount = 0;
    
    allRows.forEach(row => {
        if (row.style.display !== 'none') {
            visibleCount++;
        }
    });
    
    const filteredCount = document.getElementById('filtered-count');
    if (filteredCount) {
        filteredCount.textContent = visibleCount;
    }
}

function showAllData() {
    // Clear date range filter
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    if (dateRangeFilter) {
        dateRangeFilter.value = '';
    }
    
    // Clear search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Show all table rows
    const tableRows = document.querySelectorAll('tbody tr.intro-x');
    tableRows.forEach(row => {
        row.style.display = '';
    });
    
    // Update counter to show all records
    updateFilteredCount();
}

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
            <input type="text" name="billing_items[${itemIndex}][description]" class="form-control mt-1 p-2 border border-slate-300 rounded" placeholder="Item description" required>
        </div>
        <div class="col-span-12 md:col-span-6">
            <label class="form-label text-sm font-medium text-slate-600">Quantity</label>
            <input type="number" name="billing_items[${itemIndex}][qty]" class="form-control mt-1 p-2 border border-slate-300 rounded item-qty" min="1" value="1" required>
        </div>
        <div class="col-span-12 md:col-span-6">
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
        if (data.message) {
            showToast(data.message, 'success');
            // Close modal and reload page
            const closeBtn = document.querySelector('#create-billing-modal [data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
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
                    className: "toastify-content",
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

// Watch for date range value changes
function initializeDateRangeWatcher() {
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    if (!dateRangeFilter) return;
    
    let lastValue = '';
    
    // Check for value changes every 500ms
    setInterval(function() {
        const currentValue = dateRangeFilter.value;
        if (currentValue !== lastValue) {
            lastValue = currentValue;
            handleDateRangeFilter(currentValue);
        }
    }, 500);
    
    // Also listen for any click events on the document (for Apply button)
    document.addEventListener('click', function(e) {
        // Small delay to allow the date picker to update the input value
        setTimeout(function() {
            const currentValue = dateRangeFilter.value;
            if (currentValue !== lastValue) {
                lastValue = currentValue;
                handleDateRangeFilter(currentValue);
            }
        }, 100);
    });
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
    
    const createdDate = billing.created_at ? 
        new Date(billing.created_at).toLocaleString() : 'N/A';
    
    let itemsHtml = '';
    billing.billing_items.forEach((item, index) => {
        const total = (item.qty * item.price).toFixed(2);
        itemsHtml += `
            <tr>
                <td class="border-b border-slate-200 py-3">${index + 1}</td>
                <td class="border-b border-slate-200 py-3">${item.description}</td>
                <td class="border-b border-slate-200 py-3 text-center">${item.qty}</td>
                <td class="border-b border-slate-200 py-3 text-right">₱${parseFloat(item.price).toFixed(2)}</td>
                <td class="border-b border-slate-200 py-3 text-right font-medium">₱${total}</td>
            </tr>
        `;
    });
    
    billingDetailsDiv.innerHTML = `
        <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Billing Information -->
                <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 class="font-semibold text-lg mb-6 text-blue-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Billing Information
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Billing Date</label>
                            <input type="text" class="form-control mt-1" value="${billing.billing_date}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Status</label>
                            <input type="text" class="form-control mt-1 bg-green-100 text-green-800" value="${billing.status}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Created Date</label>
                            <input type="text" class="form-control mt-1" value="${createdDate}" readonly>
                        </div>
                    </div>
                </div>
                
                <!-- User Information -->
                <div class="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 class="font-semibold text-lg mb-6 text-green-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        User Information
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Name</label>
                            <input type="text" class="form-control mt-1" value="${billing.user.name}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Email</label>
                            <input type="text" class="form-control mt-1" value="${billing.user.email}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Total Amount Due</label>
                            <input type="text" class="form-control mt-1 bg-yellow-100 text-yellow-800 font-bold" value="₱${parseFloat(billing.amount_due).toFixed(2)}" readonly>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Billing Items Section -->
            <div class="mt-8">
                <div class="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h3 class="font-semibold text-lg mb-6 text-orange-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <path d="M9 12l2 2 4-4"></path>
                            <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                            <path d="M3 13v6c0 .552.448 1 1 1h16c.552 0 1-.448 1-1v-6"></path>
                        </svg>
                        Billing Items (${billing.billing_items.length} items)
                    </h3>
                    <div class="bg-white rounded-lg border overflow-hidden">
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
                                    <td colspan="4" class="py-4 px-4 text-right">TOTAL AMOUNT DUE:</td>
                                    <td class="py-4 px-4 text-right text-lg">₱${parseFloat(billing.amount_due).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
            
            currentRow.querySelector('input[name$="[description]"]').value = item.description;
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
            <input type="text" name="billing_items[${itemCount}][description]" class="form-control" placeholder="Item description" required>
        </div>
        <div class="col-span-12 md:col-span-2">
            <input type="number" name="billing_items[${itemCount}][qty]" class="form-control item-qty" placeholder="Qty" min="1" required>
        </div>
        <div class="col-span-12 md:col-span-2">
            <input type="number" name="billing_items[${itemCount}][price]" class="form-control item-price" placeholder="Price" step="0.01" min="0" required>
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

// Watch for date range value changes
function initializeDateRangeWatcher() {
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    if (!dateRangeFilter) return;
    
    let lastValue = '';
    
    // Check for value changes every 500ms
    setInterval(function() {
        const currentValue = dateRangeFilter.value;
        if (currentValue !== lastValue) {
            lastValue = currentValue;
            handleDateRangeFilter(currentValue);
        }
    }, 500);
    
    // Also listen for any click events on the document (for Apply button)
    document.addEventListener('click', function(e) {
        // Small delay to allow the date picker to update the input value
        setTimeout(function() {
            const currentValue = dateRangeFilter.value;
            if (currentValue !== lastValue) {
                lastValue = currentValue;
                handleDateRangeFilter(currentValue);
            }
        }, 100);
    });
}
