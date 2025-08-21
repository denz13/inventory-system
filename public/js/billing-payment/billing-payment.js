// Billing Payment JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for FilePond to load from CDN
    setTimeout(() => {
        initializeEventListeners();
    }, 500);
});

// Payment step variables (similar to complaints.js)
let selectedPaymentType = null;
let selectedAccount = null;
let uploadedFile = null;
let filePond = null;

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

    // Receipt modal
    document.querySelectorAll('[data-tw-target="#receipt-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const receiptPath = this.getAttribute('data-receipt');
            const billNumber = this.getAttribute('data-bill-number');
            openReceiptModal(receiptPath, billNumber);
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

    // File upload functionality - use page-initialized FilePond or fallback
    if (window.paymentFilePond) {
        console.log('Using page-initialized FilePond');
        filePond = window.paymentFilePond;
        uploadedFile = window.uploadedFile || null;
    } else {
        console.log('No page FilePond found, trying to initialize...');
        waitForFilePond();
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
    console.log('Opening payment modal for billing ID:', billingId, 'Amount:', amount);
    
    document.getElementById('selectedBillingId').value = billingId;
    document.getElementById('paymentAmount').textContent = '₱' + parseFloat(amount).toFixed(2);
    document.getElementById('paymentBillNumber').textContent = billingId.toString().padStart(6, '0');
    
    console.log('Set billing ID in hidden field:', document.getElementById('selectedBillingId').value);
    
    // Reset modal state
    resetPaymentModal();
    
    // Ensure confirm button is disabled initially
    updateConfirmButtonState();
    
    // Show step 1 (like complaints modal)
    showPaymentStep(1);
    
    // FilePond is already initialized globally, no need to re-initialize
    console.log('Modal opened, FilePond already available');
}

// Receipt Modal Functions
function openReceiptModal(receiptPath, billNumber) {
    console.log('Opening receipt modal for:', receiptPath, 'Bill:', billNumber);
    
    // Set bill number
    document.getElementById('receiptBillNumber').textContent = billNumber.toString().padStart(6, '0');
    
    // Display receipt file
    displayReceiptFile(receiptPath);
    
    // Set up download button
    setupDownloadButton(receiptPath);
}

function displayReceiptFile(receiptPath) {
    const receiptDisplay = document.getElementById('receiptFileDisplay');
    const fileUrl = `/storage/${receiptPath}`;
    
    // Get file extension to determine file type
    const fileExtension = receiptPath.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
        // Display image
        receiptDisplay.innerHTML = `
            <div class="text-center">
                <img src="${fileUrl}" alt="Payment Receipt" class="max-w-full max-h-96 mx-auto rounded-lg shadow-lg">
                <p class="text-sm text-slate-500 mt-3">Payment Receipt Image</p>
            </div>
        `;
    } else if (fileExtension === 'pdf') {
        // Display PDF
        receiptDisplay.innerHTML = `
            <div class="text-center">
                <iframe src="${fileUrl}" class="w-full h-96 border rounded-lg shadow-lg"></iframe>
                <p class="text-sm text-slate-500 mt-3">Payment Receipt PDF</p>
            </div>
        `;
    } else {
        // Display file info for other types
        receiptDisplay.innerHTML = `
            <div class="text-center">
                <div class="bg-white p-6 rounded-lg border-2 border-dashed border-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-400">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    <h3 class="font-semibold text-slate-700 mb-2">Payment Receipt Document</h3>
                    <p class="text-slate-500 text-sm mb-3">File Type: ${fileExtension.toUpperCase()}</p>
                    <a href="${fileUrl}" target="_blank" class="btn btn-outline-primary btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15,3 21,3 21,9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        Open File
                    </a>
                </div>
            </div>
        `;
    }
}

function setupDownloadButton(receiptPath) {
    const downloadBtn = document.getElementById('downloadReceiptBtn');
    const fileUrl = `/storage/${receiptPath}`;
    const fileName = receiptPath.split('/').pop();
    
    downloadBtn.onclick = function() {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Receipt download started', 'success');
    };
}

function resetPaymentModal() {
    // Reset variables
    selectedPaymentType = null;
    selectedAccount = null;
    uploadedFile = null;
    
    // Clear all selections
    document.querySelectorAll('.bank-type-card, .account-category-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset form fields
    const confirmBtn = document.getElementById('confirmPaymentBtn');
    confirmBtn.disabled = true;
    confirmBtn.classList.add('hidden');
    document.getElementById('selectedAccountId').value = '';
    
    // Reset file upload
    resetFilePond();
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
        
        // Update confirm button state based on file upload
        updateConfirmButtonState();
        
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
    
    const fileToUpload = uploadedFile || window.uploadedFile;
    if (!fileToUpload) {
        showToast('Please upload payment proof before confirming', 'error');
        showFileError('Payment proof is required');
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
    
    // Debug log the values being sent
    console.log('Processing payment with values:', {
        billingId: billingId,
        accountId: accountId,
        amount: amount,
        fileToUpload: fileToUpload ? fileToUpload.name : 'No file'
    });
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('billing_id', billingId);
    formData.append('account_id', accountId);
    formData.append('payment_file', fileToUpload);
    formData.append('_token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
    
    // Log FormData contents
    for (let [key, value] of formData.entries()) {
        console.log('FormData:', key, value);
    }
    
    // Send payment data to server
    fetch('/billing-payment/process', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            
            // Close modal
            const modal = document.getElementById('payment-modal');
            const closeBtn = modal.querySelector('[data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Optionally refresh the page to show updated billing status
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showToast(data.message || 'Payment processing failed', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error processing payment. Please try again.', 'error');
    })
    .finally(() => {
        // Reset button to proper state based on file upload
        updateConfirmButtonState();
        confirmBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>
            Confirm Payment
        `;
    });
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

// Simple FilePond initialization using parse method
function initializeFilePond() {
    if (typeof FilePond === 'undefined') {
        console.error('FilePond library not available');
        initializeBasicFileUpload();
        return;
    }
    
    console.log('FilePond library loaded, initializing...');

    // Use FilePond.parse() method like the working example
    FilePond.parse(document.querySelector('#paymentFile'));
    
    // Get the FilePond instance that was created
    const inputElement = document.querySelector('#paymentFile');
    if (inputElement && inputElement.filepond) {
        filePond = inputElement.filepond;
        
        // Configure the FilePond instance
        filePond.setOptions({
            labelIdle: `Drag & Drop your payment proof or <span class="filepond--label-action">Browse</span><br><small style="color: #6b7280;">Supports: Images, PDF, Word documents (Max 10MB)</small>`,
            maxFileSize: '10MB',
            maxFiles: 1,
            allowMultiple: false,
            allowRevert: true,
            allowRemove: true,
            allowReplace: true,
            credits: false,
            acceptedFileTypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        });
        
        // Add event handlers
        addFilePondEventHandlers();
        console.log('FilePond initialized successfully using parse method');
    } else {
        console.error('Failed to create FilePond instance');
        initializeBasicFileUpload();
    }
}

// Simple waiting function
function waitForFilePond(retries = 0) {
    if (typeof FilePond !== 'undefined') {
        console.log('FilePond is available, initializing...');
        initializeFilePond();
    } else if (retries < 5) {
        console.log(`Waiting for FilePond... attempt ${retries + 1}`);
        setTimeout(() => {
            waitForFilePond(retries + 1);
        }, 500);
    } else {
        console.error('FilePond failed to load, falling back to basic file input');
        initializeBasicFileUpload();
    }
}

function addFilePondEventHandlers() {
    if (!filePond) return;

    // Add file event
    filePond.on('addfile', (error, file) => {
        if (error) {
            console.error('FilePond add file error:', error);
            showFileError('Error uploading file: ' + error.body);
            return;
        }
        
        console.log('FilePond file added:', file.filename);
        uploadedFile = file.file; // Store the actual File object
        hideFileError();
        updateConfirmButtonState();
        showToast(`File "${file.filename}" uploaded successfully`, 'success');
    });

    // Remove file event
    filePond.on('removefile', (error, file) => {
        if (error) {
            console.error('FilePond remove file error:', error);
            return;
        }
        
        console.log('FilePond file removed:', file.filename);
        uploadedFile = null;
        updateConfirmButtonState();
        showToast('File removed', 'success');
    });

    // Error event
    filePond.on('error', (error) => {
        console.error('FilePond error:', error);
        showFileError('File upload error: ' + error);
    });
}

function initializeBasicFileUpload() {
    const fileInput = document.getElementById('paymentFile');
    if (!fileInput) return;

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            uploadedFile = file;
            updateConfirmButtonState();
            showToast(`File "${file.name}" selected`, 'success');
        }
    });
}

function resetFilePond() {
    // Use the global FilePond instance
    const pondInstance = window.paymentFilePond || filePond;
    if (pondInstance) {
        pondInstance.removeFiles();
        console.log('FilePond files cleared');
    }
    uploadedFile = null;
    window.uploadedFile = null; // Also clear global uploaded file
    hideFileError();
}

function showFileError(message) {
    const fileError = document.getElementById('fileError');
    if (fileError) {
        fileError.textContent = message;
        fileError.classList.remove('hidden');
    }
}

function hideFileError() {
    const fileError = document.getElementById('fileError');
    if (fileError) {
        fileError.classList.add('hidden');
    }
}

function updateConfirmButtonState() {
    const confirmBtn = document.getElementById('confirmPaymentBtn');
    if (!confirmBtn) return;

    // Check if all required conditions are met
    const hasAccount = selectedAccount !== null;
    const hasFile = uploadedFile !== null || window.uploadedFile !== null;

    if (hasAccount && hasFile) {
        // Show and enable button when both conditions are met
        confirmBtn.classList.remove('hidden');
        confirmBtn.disabled = false;
        console.log('Confirm button enabled - account and file ready');
    } else {
        // Hide button when conditions are not met
        confirmBtn.classList.add('hidden');
        confirmBtn.disabled = true;
        console.log('Confirm button hidden - missing:', hasAccount ? 'file' : 'account' + (hasAccount ? '' : ' and file'));
    }
}
