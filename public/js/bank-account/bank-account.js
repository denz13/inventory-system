// Bank Account JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

function initializeEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Filter functionality
    document.querySelectorAll('[data-filter]').forEach(filterBtn => {
        filterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            handleFilter(filter);
        });
    });

    // Create form submission
    const createForm = document.getElementById('createBankAccountForm');
    if (createForm) {
        createForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCreateBankAccount();
        });
    }

    // Edit form submission
    const editForm = document.getElementById('editBankAccountForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleUpdateBankAccount();
        });
    }

    // Modal event listeners
    document.querySelectorAll('[data-tw-target="#view-bank-account-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const bankAccountId = this.getAttribute('data-bank-account-id');
            loadBankAccountDetails(bankAccountId);
        });
    });

    document.querySelectorAll('[data-tw-target="#edit-bank-account-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const bankAccountId = this.getAttribute('data-bank-account-id');
            loadBankAccountForEdit(bankAccountId);
        });
    });

    document.querySelectorAll('[data-tw-target="#delete-confirmation-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const bankAccountId = this.getAttribute('data-bank-account-id');
            document.getElementById('deleteBankAccountId').value = bankAccountId;
        });
    });

    // Delete confirmation
    const confirmDeleteBtn = document.getElementById('confirmDeleteBankAccount');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const bankAccountId = document.getElementById('deleteBankAccountId').value;
            handleDeleteBankAccount(bankAccountId);
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
}

function handleFilter(filter) {
    const tableRows = document.querySelectorAll('tbody tr.intro-x');
    
    tableRows.forEach(row => {
        const status = row.getAttribute('data-status');
        
        if (filter === 'all' || status === filter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    updateFilteredCount();
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

function handleCreateBankAccount() {
    const form = document.getElementById('createBankAccountForm');
    const formData = new FormData(form);
    const submitBtn = document.querySelector('button[form="createBankAccountForm"]');

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
        `;
    }

    fetch('/bank-account', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            
            // Close modal
            const modal = document.getElementById('create-bank-account-modal');
            const closeBtn = modal.querySelector('[data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Reset form
            form.reset();
            
            // Reload page to show new bank account
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showToast(data.message || 'Error creating bank account', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error creating bank account', 'error');
    })
    .finally(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                </svg>
                Add Bank Account
            `;
        }
    });
}

function loadBankAccountDetails(bankAccountId) {
    const bankAccountDetailsDiv = document.getElementById('bank-account-details');
    
    // Show loading state
    bankAccountDetailsDiv.innerHTML = `
        <div class="text-center text-slate-500 py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-lg">Loading bank account details...</p>
        </div>
    `;
    
    fetch(`/bank-account/${bankAccountId}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayBankAccountDetails(data.bankAccount);
        } else {
            bankAccountDetailsDiv.innerHTML = `
                <div class="text-center text-red-500 py-12">
                    <p>Error loading bank account details</p>
                </div>
            `;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        bankAccountDetailsDiv.innerHTML = `
            <div class="text-center text-red-500 py-12">
                <p>Error loading bank account details</p>
            </div>
        `;
    });
}

function displayBankAccountDetails(bankAccount) {
    const bankAccountDetailsDiv = document.getElementById('bank-account-details');
    
    const createdDate = bankAccount.created_at ? 
        new Date(bankAccount.created_at).toLocaleDateString() : 'N/A';
    
    const qrCodeSection = bankAccount.qrcode_image ? 
        `<div class="text-center">
            <img src="/storage/${bankAccount.qrcode_image}" alt="QR Code" class="w-64 h-64 object-cover rounded-lg border mx-auto">
        </div>` : 
        `<div class="text-center text-slate-400">No QR Code available</div>`;
    
    bankAccountDetailsDiv.innerHTML = `
        <div class="p-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Account Information -->
                <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 class="font-semibold text-lg mb-6 text-blue-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                            <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                        Account Information
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Account Type</label>
                            <input type="text" class="form-control mt-1" value="${bankAccount.bank_account_type?.type || 'N/A'}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Account Name</label>
                            <input type="text" class="form-control mt-1" value="${bankAccount.account_name}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Account Number</label>
                            <input type="text" class="form-control mt-1 font-mono" value="${bankAccount.account_number}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Status</label>
                            <input type="text" class="form-control mt-1 ${bankAccount.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}" value="${bankAccount.status}" readonly>
                        </div>
                        <div>
                            <label class="form-label text-sm font-semibold text-slate-700">Created Date</label>
                            <input type="text" class="form-control mt-1" value="${createdDate}" readonly>
                        </div>
                    </div>
                </div>
                
                <!-- QR Code Section -->
                <div class="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 class="font-semibold text-lg mb-6 text-green-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2">
                            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                            <rect x="7" y="7" width="3" height="3"></rect>
                            <rect x="14" y="7" width="3" height="3"></rect>
                            <rect x="7" y="14" width="3" height="3"></rect>
                            <rect x="14" y="14" width="3" height="3"></rect>
                        </svg>
                        QR Code
                    </h3>
                    ${qrCodeSection}
                </div>
            </div>
        </div>
    `;
}

function loadBankAccountForEdit(bankAccountId) {
    fetch(`/bank-account/${bankAccountId}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const bankAccount = data.bankAccount;
            
            document.getElementById('editBankAccountId').value = bankAccount.id;
            document.getElementById('editBankAccountTypeId').value = bankAccount.bank_account_type_id;
            document.getElementById('editAccountName').value = bankAccount.account_name;
            document.getElementById('editAccountNumber').value = bankAccount.account_number;
            
            // Show current QR code preview
            const previewDiv = document.getElementById('currentQrCodePreview');
            if (bankAccount.qrcode_image) {
                previewDiv.innerHTML = `
                    <div class="text-sm text-slate-600 mb-2">Current QR Code:</div>
                    <img src="/storage/${bankAccount.qrcode_image}" alt="Current QR Code" class="w-32 h-32 object-cover rounded border">
                `;
            } else {
                previewDiv.innerHTML = `<div class="text-sm text-slate-400">No QR code currently set</div>`;
            }
            
            // Set form action
            document.getElementById('editBankAccountForm').action = `/bank-account/${bankAccount.id}`;
        } else {
            showToast('Error loading bank account data', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error loading bank account data', 'error');
    });
}

function handleUpdateBankAccount() {
    const form = document.getElementById('editBankAccountForm');
    const formData = new FormData(form);
    const bankAccountId = document.getElementById('editBankAccountId').value;
    const submitBtn = document.querySelector('button[form="editBankAccountForm"]');

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
        `;
    }

    fetch(`/bank-account/${bankAccountId}`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            
            // Close modal
            const modal = document.getElementById('edit-bank-account-modal');
            const closeBtn = modal.querySelector('[data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Reload page to show updated bank account
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showToast(data.message || 'Error updating bank account', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error updating bank account', 'error');
    })
    .finally(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                </svg>
                Update Bank Account
            `;
        }
    });
}

function handleDeleteBankAccount(bankAccountId) {
    const submitBtn = document.getElementById('confirmDeleteBankAccount');

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Deleting...';
    }

    fetch(`/bank-account/${bankAccountId}`, {
        method: 'DELETE',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || document.querySelector('input[name="_token"]').value
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            
            // Close modal
            const modal = document.getElementById('delete-confirmation-modal');
            const closeBtn = modal.querySelector('[data-tw-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
            
            // Reload page to remove deleted bank account
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showToast(data.message || 'Error deleting bank account', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error deleting bank account', 'error');
    })
    .finally(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Delete';
        }
    });
}

// Toast notification function (following announcement pattern)
function showToast(message, type = 'success') {
    const toastId = type === 'success' ? 'bank_account_toast_success' : 'bank_account_toast_error';
    
    // Try to use the notification toast component first
    if (typeof window[`showNotification_${toastId}`] === 'function') {
        if (type === 'error') {
            const errorMessageSlot = document.getElementById('bank_account_error_message_slot');
            if (errorMessageSlot) {
                errorMessageSlot.textContent = message;
            }
        }
        window[`showNotification_${toastId}`]();
    } else if (typeof Toastify !== 'undefined') {
        // Fallback to Toastify directly
        Toastify({
            text: message,
            duration: 5000,
            gravity: "top",
            position: "right",
            className: "toastify-content",
            backgroundColor: type === 'success' ? "#10b981" : "#ef4444",
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
