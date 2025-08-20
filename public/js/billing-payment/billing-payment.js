// Billing Payment JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

// Payment step variables (similar to complaints.js)
let selectedPaymentType = null;
let selectedAccount = null;

function initializeEventListeners() {
    // Search functionality
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

    // Initialize date range watcher for robust change detection
    initializeDateRangeWatcher();

    // Clear filter / Show All button
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', function() {
            showAllData();
        });
    }

    // View billing modal
    document.querySelectorAll('[data-tw-target="#view-billing-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const billingId = this.getAttribute('data-billing-id');
            loadBillingDetails(billingId);
        });
    });

    // Payment modal
    document.querySelectorAll('[data-tw-target="#payment-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const billingId = this.getAttribute('data-billing-id');
            const amount = this.getAttribute('data-amount');
            openPaymentModal(billingId, amount);
        });
    });

    // Bank account type selection
    document.addEventListener('click', function(e) {
        if (e.target.closest('.bank-type-card')) {
            const card = e.target.closest('.bank-type-card');
            const typeId = card.getAttribute('data-type-id');
            const typeName = card.getAttribute('data-type-name');
            selectPaymentType(typeId, typeName);
        }
    });

    // Account category selection (Step 2)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.account-category-card')) {
            const card = e.target.closest('.account-category-card');
            const accountId = card.getAttribute('data-account-id');
            selectPaymentAccount(accountId);
        }
    });

    // Account details modal button
    document.addEventListener('click', function(e) {
        if (e.target.closest('#selectAccountBtn')) {
            const accountId = document.getElementById('selectAccountBtn').getAttribute('data-account-id');
            selectBankAccountFromModal(accountId);
        }
    });

    // Account details modal close handlers
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-tw-dismiss="modal"]') && 
            e.target.closest('#account-details-modal')) {
            closeAccountDetailsModal();
        }
    });

    // Back button navigation (like complaints modal)
    document.addEventListener('click', function(e) {
        if (e.target.closest('#backToPaymentStep1')) {
            showPaymentStep(1);
            selectedPaymentType = null;
            selectedAccount = null;
            // Clear selections
            document.querySelectorAll('.bank-type-card, .account-category-card').forEach(opt => {
                opt.classList.remove('selected');
            });
        }
        
        if (e.target.closest('#backToPaymentStep2')) {
            showPaymentStep(2);
            selectedAccount = null;
            // Clear account selection
            document.querySelectorAll('.account-category-card').forEach(opt => {
                opt.classList.remove('selected');
            });
        }
    });

    // Confirm payment button
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', function() {
            processPayment();
        });
    }
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

function initializeDateRangeWatcher() {
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    if (!dateRangeFilter) return;

    let lastValue = dateRangeFilter.value;

    // Watch for value changes using interval
    setInterval(() => {
        const currentValue = dateRangeFilter.value;
        if (currentValue !== lastValue) {
            lastValue = currentValue;
            handleDateRangeFilter(currentValue);
        }
    }, 100);

    // Also listen for clicks on the document to catch date picker Apply clicks
    document.addEventListener('click', function(e) {
        // Add a small delay to ensure the value has been updated
        setTimeout(() => {
            const currentValue = dateRangeFilter.value;
            if (currentValue !== lastValue) {
                lastValue = currentValue;
                handleDateRangeFilter(currentValue);
            }
        }, 100);
    });
}

function handleDateRangeFilter(dateRange) {
    console.log('Filtering by date range:', dateRange);
    
    if (!dateRange || dateRange.trim() === '') {
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
        console.error('Invalid date range format:', dateRange);
        return;
    }

    try {
        // Parse dates more robustly
        const startDateStr = dateParts[0].trim();
        const endDateStr = dateParts[1].trim();
        
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error('Invalid date values:', startDateStr, endDateStr);
            return;
        }

        console.log('Date range:', startDate, 'to', endDate);

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
    } catch (error) {
        console.error('Error in date range filtering:', error);
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
    
    console.log('Updated filtered count:', visibleCount, 'out of', allRows.length);
}

function showAllData() {
    console.log('Showing all data - clearing filters');
    
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
                            <label class="form-label text-sm font-semibold text-slate-700">Bill #</label>
                            <input type="text" class="form-control mt-1" value="${billing.id.toString().padStart(6, '0')}" readonly>
                        </div>
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
                
                <!-- Payment Information -->
                <div class="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 class="font-semibold text-lg mb-6 text-green-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                            <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                        Payment Information
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Total Amount Due</label>
                            <input type="text" class="form-control mt-1 bg-yellow-100 text-yellow-800 font-bold text-xl" value="₱${parseFloat(billing.amount_due).toFixed(2)}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Items Count</label>
                            <input type="text" class="form-control mt-1" value="${billing.billing_items.length} item(s)" readonly>
                        </div>
                        <div class="mt-6">
                            <button onclick="handlePayBilling(${billing.id})" class="btn btn-success w-full text-lg py-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                                Pay Now - ₱${parseFloat(billing.amount_due).toFixed(2)}
                            </button>
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

// Payment Modal Functions
function openPaymentModal(billingId, amount) {
    document.getElementById('selectedBillingId').value = billingId;
    document.getElementById('paymentAmount').textContent = '₱' + parseFloat(amount).toFixed(2);
    document.getElementById('paymentBillNumber').textContent = billingId.toString().padStart(6, '0');
    
    // Reset modal state
    resetPaymentModal();
    
    // Show step 1 (like complaints modal)
    showPaymentStep(1);
}

function resetPaymentModal() {
    // Reset variables
    selectedPaymentType = null;
    selectedAccount = null;
    
    // Clear all selections
    document.querySelectorAll('.bank-type-card, .account-category-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset form fields
    document.getElementById('confirmPaymentBtn').disabled = true;
    document.getElementById('selectedAccountId').value = '';
}

// Step-based functions (like complaints modal)
function selectPaymentType(typeId, typeName) {
    // Clear previous selections
    document.querySelectorAll('.bank-type-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Select current type
    document.querySelector(`[data-type-id="${typeId}"]`).classList.add('selected');
    
    selectedPaymentType = { id: typeId, name: typeName };
    
    // Load bank accounts for this type
    loadBankAccountCategories(typeId);
    
    // Show step 2
    showPaymentStep(2);
}

function loadBankAccountCategories(typeId) {
    const categoriesList = document.getElementById('accountCategoriesList');
    
    // Show loading state
    categoriesList.innerHTML = `
        <div class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p class="text-slate-500">Loading accounts...</p>
        </div>
    `;
    
    // Get bank account categories data from the page (passed from controller)
    const bankAccountCategories = window.bankAccountCategories || [];
    
    // Filter categories by type
    const filteredCategories = bankAccountCategories.filter(category => 
        category.bank_account_type_id == typeId
    );
    
    if (filteredCategories.length === 0) {
        categoriesList.innerHTML = `
            <div class="text-center py-4 text-slate-500">
                <p>No accounts available for this payment method</p>
            </div>
        `;
        return;
    }
    
    // Display categories (just account names like complaints modal)
    let categoriesHtml = '';
    filteredCategories.forEach(category => {
        categoriesHtml += `
            <div class="account-category-card cursor-pointer p-6 border-2 border-slate-200 rounded-lg hover:border-primary transition-all duration-300 hover:shadow-md" data-account-id="${category.id}">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium text-lg">${category.account_name}</div>
                        <div class="text-slate-500 text-sm mt-1">${category.bank_account_type?.type || 'N/A'}</div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-slate-400">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
            </div>
        `;
    });
    
    categoriesList.innerHTML = categoriesHtml;
}

function selectPaymentAccount(accountId) {
    // Clear previous account selections
    document.querySelectorAll('.account-category-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Select current account
    const selectedCard = document.querySelector(`[data-account-id="${accountId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Get account details
    const bankAccountCategories = window.bankAccountCategories || [];
    const accountData = bankAccountCategories.find(account => account.id == accountId);
    
    if (accountData) {
        selectedAccount = { id: accountId, name: accountData.account_name, data: accountData };
        
        // Update displays
        document.getElementById('selectedPaymentMethodDisplay').value = selectedPaymentType.name;
        document.getElementById('selectedAccountNameDisplay').value = selectedAccount.name;
        document.getElementById('selectedAccountId').value = accountId;
        
        // Display selected account details
        displaySelectedAccount(accountData);
        document.getElementById('confirmPaymentBtn').disabled = false;
        
        // Show step 3
        showPaymentStep(3);
    }
}

function displayAccountDetailsModal(account) {
    const detailsDiv = document.getElementById('account-details');
    
    const qrCodeSection = account.qrcode_image ? 
        `<div class="text-center mb-6">
            <img src="/storage/${account.qrcode_image}" alt="QR Code" class="w-48 h-48 object-cover rounded-lg border mx-auto">
            <p class="text-sm text-slate-600 mt-2">Scan QR code to pay</p>
        </div>` : 
        `<div class="text-center mb-6">
            <div class="w-48 h-48 bg-slate-100 rounded-lg border mx-auto flex items-center justify-center">
                <span class="text-slate-400">No QR Code Available</span>
            </div>
        </div>`;
    
    detailsDiv.innerHTML = `
        <div class="text-center mb-6">
            <h3 class="text-xl font-semibold text-slate-800">${account.account_name}</h3>
            <p class="text-slate-600 mt-1">${account.bank_account_type?.type || 'N/A'}</p>
        </div>
        
        ${qrCodeSection}
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 class="font-semibold text-blue-800 mb-3">Account Information</h4>
                <div class="space-y-3">
                    <div>
                        <p class="text-sm text-slate-600">Account Name</p>
                        <p class="font-semibold text-slate-800">${account.account_name}</p>
                    </div>
                    <div>
                        <p class="text-sm text-slate-600">Account Number</p>
                        <p class="font-mono text-slate-800">${account.account_number}</p>
                    </div>
                    <div>
                        <p class="text-sm text-slate-600">Payment Method</p>
                        <p class="font-semibold text-slate-800">${account.bank_account_type?.type || 'N/A'}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 class="font-semibold text-green-800 mb-3">Status & Details</h4>
                <div class="space-y-3">
                    <div>
                        <p class="text-sm text-slate-600">Status</p>
                        <span class="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            ${account.status}
                        </span>
                    </div>
                    <div>
                        <p class="text-sm text-slate-600">Available 24/7</p>
                        <p class="text-slate-800">✓ Online Payment</p>
                    </div>
                    <div>
                        <p class="text-sm text-slate-600">Processing Time</p>
                        <p class="text-slate-800">Instant Transfer</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function selectBankAccountFromModal(accountId) {
    // Get account details
    const bankAccountCategories = window.bankAccountCategories || [];
    const selectedAccount = bankAccountCategories.find(account => account.id == accountId);
    
    if (selectedAccount) {
        document.getElementById('selectedAccountId').value = accountId;
        displaySelectedAccount(selectedAccount);
        document.getElementById('confirmPaymentBtn').disabled = false;
        
        // Update step indicator to step 3 (final step)
        updateStepIndicator(3);
        
        // Close the account details modal
        const modal = document.getElementById('account-details-modal');
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        
        showToast(`${selectedAccount.account_name} selected as payment method`, 'success');
    }
}

function selectBankAccount(accountId) {
    // This function is kept for backward compatibility
    showAccountDetails(accountId);
}

function closeAccountDetailsModal() {
    // Close the modal
    const modal = document.getElementById('account-details-modal');
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    
    // Keep the selection state visible in the Choose Account section
    // (Don't clear the selected state when just closing the modal)
}

function displaySelectedAccount(account) {
    const detailsDiv = document.getElementById('selectedAccountDetails');
    const displayDiv = document.getElementById('selectedAccountDisplay');
    
    const qrCodeSection = account.qrcode_image ? 
        `<div class="mt-4 text-center">
            <img src="/storage/${account.qrcode_image}" alt="QR Code" class="w-32 h-32 object-cover rounded border mx-auto">
            <p class="text-sm text-slate-600 mt-2">Scan QR code to pay</p>
        </div>` : '';
    
    detailsDiv.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <p class="text-sm text-slate-600">Account Name</p>
                <p class="font-semibold text-slate-800">${account.account_name}</p>
            </div>
            <div>
                <p class="text-sm text-slate-600">Account Number</p>
                <p class="font-mono text-slate-800">${account.account_number}</p>
            </div>
            <div>
                <p class="text-sm text-slate-600">Payment Method</p>
                <p class="font-semibold text-slate-800">${account.bank_account_type?.type || 'N/A'}</p>
            </div>
            <div>
                <p class="text-sm text-slate-600">Status</p>
                <span class="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    ${account.status}
                </span>
            </div>
        </div>
        ${qrCodeSection}
    `;
    
    displayDiv.style.display = 'block';
}

function processPayment() {
    const billingId = document.getElementById('selectedBillingId').value;
    const accountId = document.getElementById('selectedAccountId').value;
    const amount = document.getElementById('paymentAmount').textContent;
    
    if (!billingId || !accountId) {
        showToast('Please select a payment method', 'error');
        return;
    }
    
    // Disable button and show loading
    const confirmBtn = document.getElementById('confirmPaymentBtn');
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
    `;
    
    // Simulate payment processing
    setTimeout(() => {
        showToast(`Payment of ${amount} processed successfully!`, 'success');
        
        // Close modal
        const modal = document.getElementById('payment-modal');
        const closeBtn = modal.querySelector('[data-tw-dismiss="modal"]');
        if (closeBtn) closeBtn.click();
        
        // Reset button
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>
            Confirm Payment
        `;
        
        console.log('Payment processed:', { billingId, accountId, amount });
    }, 2000);
}

function handlePayBilling(billingId) {
    // This function is kept for backward compatibility
    // The new modal-based payment system is preferred
    console.log('Legacy payment function called for billing:', billingId);
}

// Toast notification function (following announcement pattern)
function showToast(message, type = 'success') {
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: message,
            duration: 5000,
            gravity: "top",
            position: "right",
            className: "toastify-content",
            backgroundColor: type === 'success' ? "#10b981" : type === 'error' ? "#ef4444" : "#3b82f6",
            stopOnFocus: true,
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

// Step Navigation Functions (like complaints modal)
function showPaymentStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(step => {
        step.classList.add('hidden');
    });
    
    // Show the requested step
    document.getElementById(`paymentStep${stepNumber}`).classList.remove('hidden');
    
    // Update step indicator
    updateStepIndicator(stepNumber);
}

// Step Indicator Functions
function updateStepIndicator(currentStep) {
    // Reset all step dots
    document.querySelectorAll('.step-dot').forEach(dot => {
        dot.classList.remove('active', 'completed');
    });
    
    // Set completed steps
    for (let i = 1; i < currentStep; i++) {
        const stepDot = document.querySelector(`[data-step="${i}"]`);
        if (stepDot) {
            stepDot.classList.add('completed');
        }
    }
    
    // Set current active step
    const currentStepDot = document.querySelector(`[data-step="${currentStep}"]`);
    if (currentStepDot) {
        currentStepDot.classList.add('active');
    }
}
