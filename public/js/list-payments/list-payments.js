document.addEventListener('DOMContentLoaded', function() {
    // Filter state
    let currentStatusFilter = 'all';
    let currentNameSort = 'default';

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyFiltersAndSort();
        });
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

    // Universal filter handler
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-filter-type]')) {
            const filterType = e.target.getAttribute('data-filter-type');
            const filterValue = e.target.getAttribute('data-filter-value');
            
            const dropdown = e.target.closest('.dropdown');
            
            // Update the appropriate filter/sort state and button
            if (filterType === 'status') {
                currentStatusFilter = filterValue;
                const statusText = filterValue === 'all' ? 'Status: All' : 
                                 filterValue === 'sent to owners' ? 'Status: Pending Payment' :
                                 filterValue === 'under review' ? 'Status: Under Review' :
                                 `Status: ${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}`;
                updateFilterButton('statusFilterBtn', statusText);
            } else if (filterType === 'name-sort') {
                currentNameSort = filterValue;
                const btnText = filterValue === 'default' ? 'Name' : `Name: ${filterValue.toUpperCase()}`;
                updateFilterButton('nameSortBtn', btnText);
            }
            
            // Apply all filters and sorting
            applyFiltersAndSort();
            
            // Close dropdown
            if (dropdown) {
                const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                if (dropdownToggle) {
                    dropdownToggle.setAttribute('aria-expanded', 'false');
                    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                    if (dropdownMenu) {
                        dropdownMenu.classList.remove('show');
                    }
                }
            }
        }
    });

    // Reset filters button
    document.getElementById('resetFiltersBtn')?.addEventListener('click', function() {
        currentStatusFilter = 'all';
        currentNameSort = 'default';
        
        if (searchInput) {
            searchInput.value = '';
        }
        
        if (dateRangeFilter) {
            dateRangeFilter.value = '';
        }
        
        // Reset button texts
        updateFilterButton('statusFilterBtn', 'Status: All');
        updateFilterButton('nameSortBtn', 'Name');
        
        // Apply filters (which will show all)
        applyFiltersAndSort();
        
        showToast('Filters reset successfully', 'success');
    });

    // Update filter button text
    function updateFilterButton(buttonId, text) {
        const button = document.getElementById(buttonId);
        if (button) {
            // Preserve the icon
            const icon = button.querySelector('svg');
            button.textContent = text;
            if (icon) {
                button.insertBefore(icon, button.firstChild);
            }
        }
    }

    // Main function to apply all filters and sorting
    function applyFiltersAndSort() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const tbody = document.querySelector('tbody');
        const paymentRows = Array.from(document.querySelectorAll('tbody tr.intro-x'));
        
        if (paymentRows.length === 0) return;
        
        // Step 1: Filter rows
        let visibleRows = paymentRows.filter(row => {
            const rowText = row.textContent.toLowerCase();
            const rowStatus = row.getAttribute('data-status');
            
            // Check if row matches search term and status filter
            const matchesSearch = searchTerm === '' || rowText.includes(searchTerm);
            const matchesStatus = currentStatusFilter === 'all' || rowStatus === currentStatusFilter;
            
            return matchesSearch && matchesStatus;
        });
        
        // Step 2: Sort visible rows by name if applicable
        if (currentNameSort !== 'default') {
            visibleRows.sort((a, b) => {
                const nameA = a.getAttribute('data-user-name')?.toLowerCase() || '';
                const nameB = b.getAttribute('data-user-name')?.toLowerCase() || '';
                
                if (currentNameSort === 'a-z') {
                    return nameA.localeCompare(nameB);
                } else { // z-a
                    return nameB.localeCompare(nameA);
                }
            });
        }
        
        // Step 3: Hide all rows first
        paymentRows.forEach(row => {
            row.style.display = 'none';
        });
        
        // Step 4: Show and reorder visible rows
        visibleRows.forEach((row, index) => {
            row.style.display = '';
            tbody.appendChild(row); // Move to end (reorder)
        });
        
        // Update filtered count display
        const filteredCountElement = document.getElementById('filtered-count');
        if (filteredCountElement) {
            filteredCountElement.textContent = visibleRows.length;
        }
        
        // Show/hide no results message
        updateNoResultsMessage(searchTerm, currentStatusFilter, visibleRows.length, paymentRows.length);
    }

    // Update no results message
    function updateNoResultsMessage(searchTerm, statusFilter, visibleCount, totalRows) {
        const tbody = document.querySelector('tbody');
        let noDataRow = tbody?.querySelector('tr.no-data-found');
        
        // Remove existing no data row if it exists
        if (noDataRow) {
            noDataRow.remove();
        }
        
        // Check if we should show "no results" message
        const dateRangeFilter = document.getElementById('dateRangeFilter');
        const hasDateFilter = dateRangeFilter && dateRangeFilter.value.trim() !== '';
        const hasActiveFilters = searchTerm !== '' || currentStatusFilter !== 'all' || currentNameSort !== 'default' || hasDateFilter;
        
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
                        <div class="font-medium">No payments found</div>
                        <div class="text-sm">No payments match your current filters. Try adjusting your filters.</div>
                    </div>
                </td>
            `;
            tbody.appendChild(noDataRow);
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
            
            // Remove no results message
            const tbody = document.querySelector('tbody');
            const noDataRow = tbody?.querySelector('tr.no-data-found');
            if (noDataRow) {
                noDataRow.remove();
            }
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

            let visibleCount = 0;
            tableRows.forEach(row => {
                const dateAttr = row.getAttribute('data-date');
                if (!dateAttr) {
                    row.style.display = 'none';
                    return;
                }

                const rowDate = new Date(dateAttr);
                
                // Check if row date is within the selected range
                if (rowDate >= startDate && rowDate <= endDate) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            updateFilteredCount();
            
            // Show no results message if needed
            updateNoResultsMessage('', currentStatusFilter, visibleCount, tableRows.length);
            
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
        
        // Remove no results message
        const tbody = document.querySelector('tbody');
        const noDataRow = tbody?.querySelector('tr.no-data-found');
        if (noDataRow) {
            noDataRow.remove();
        }
        
        // Update counter to show all records
        updateFilteredCount();
    }
    
    // View billing modal functionality
    document.querySelectorAll('[data-tw-target="#view-billing-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const billingId = this.getAttribute('data-billing-id');
            loadBillingDetails(billingId);
        });
    });

    // Receipt modal functionality
    document.querySelectorAll('[data-tw-target="#receipt-modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const receiptPath = this.getAttribute('data-receipt');
            const billNumber = this.getAttribute('data-bill-number');
            const receiptType = this.getAttribute('data-receipt-type') || 'user';
            openReceiptModal(receiptPath, billNumber, receiptType);
        });
    });
    
    // Payment management actions
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-action="approve-payment"]')) {
            const paymentId = e.target.closest('[data-action="approve-payment"]').getAttribute('data-payment-id');
            const amount = e.target.closest('[data-action="approve-payment"]').getAttribute('data-amount');
            openApproveModal(paymentId, amount);
        }
        
        if (e.target.closest('[data-action="reject-payment"]')) {
            const paymentId = e.target.closest('[data-action="reject-payment"]').getAttribute('data-payment-id');
            const amount = e.target.closest('[data-action="reject-payment"]').getAttribute('data-amount');
            openRejectModal(paymentId, amount);
        }
    });

    // Confirm approve button
    document.getElementById('confirm-approve-btn').addEventListener('click', function() {
        const paymentId = this.getAttribute('data-payment-id');
        confirmApprovePayment(paymentId);
    });

    // Confirm reject button
    document.getElementById('confirm-reject-btn').addEventListener('click', function() {
        const paymentId = this.getAttribute('data-payment-id');
        const reason = document.getElementById('reject-reason').value;
        confirmRejectPayment(paymentId, reason);
    });
});

function loadBillingDetails(billingId) {
    const detailsContainer = document.getElementById('billing-details');
    
    // Show loading state
    detailsContainer.innerHTML = `
        <div class="text-center text-slate-500 py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-lg">Loading billing details...</p>
        </div>
    `;
    
    // Fetch billing details
    fetch(`/list-payments/${billingId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayBillingDetails(data.billing);
            } else {
                showError('Failed to load billing details');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Error loading billing details');
        });
}

function displayBillingDetails(billing) {
    const detailsContainer = document.getElementById('billing-details');
    
    const billingItemsHtml = billing.billing_items && billing.billing_items.length > 0 
        ? billing.billing_items.map(item => `
            <tr>
                <td class="border-b border-slate-200 py-3">${item.description || 'N/A'}</td>
                <td class="border-b border-slate-200 py-3 text-center">${item.qty || 0}</td>
                <td class="border-b border-slate-200 py-3 text-right">₱${parseFloat(item.price || 0).toFixed(2)}</td>
                <td class="border-b border-slate-200 py-3 text-right font-medium">₱${(parseFloat(item.qty || 0) * parseFloat(item.price || 0)).toFixed(2)}</td>
            </tr>
        `).join('')
        : '<tr><td colspan="4" class="text-center py-8 text-slate-500">No billing items found</td></tr>';
    
    detailsContainer.innerHTML = `
        <div class="p-8">
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Billing Details</h2>
                    <p class="text-slate-600 mt-1">Bill #${String(billing.id).padStart(6, '0')}</p>
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
                        <div class="mt-1 text-slate-800">${billing.user?.name || 'N/A'}</div>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-slate-600">Email</label>
                        <div class="mt-1 text-slate-800">${billing.user?.email || 'N/A'}</div>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-slate-600">Billing Date</label>
                        <div class="mt-1 text-slate-800">${billing.billing_date || 'N/A'}</div>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-slate-600">Status</label>
                        <div class="mt-1">
                            <span class="px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(billing.status)}">
                                ${getStatusText(billing.status)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Billing Items -->
            <div class="bg-white rounded-lg border border-slate-200 mb-6">
                <div class="px-6 py-4 border-b border-slate-200">
                    <h3 class="text-lg font-semibold text-slate-800">Billing Items</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-50">
                            <tr>
                                <th class="text-left py-3 px-6 font-semibold text-slate-700">Description</th>
                                <th class="text-center py-3 px-6 font-semibold text-slate-700">Quantity</th>
                                <th class="text-right py-3 px-6 font-semibold text-slate-700">Price</th>
                                <th class="text-right py-3 px-6 font-semibold text-slate-700">Total</th>
                            </tr>
                        </thead>
                        <tbody class="px-6">
                            ${billingItemsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Total Amount -->
            <div class="bg-primary/10 rounded-lg p-6">
                <div class="flex justify-between items-center">
                    <span class="text-lg font-semibold text-slate-800">Total Amount Due:</span>
                    <span class="text-2xl font-bold text-primary">₱${parseFloat(billing.amount_due || 0).toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
}

function getStatusColor(status) {
    switch(status) {
        case 'sent to owners': return 'bg-yellow-100 text-yellow-800';
        case 'under review': return 'bg-blue-100 text-blue-800';
        case 'approved': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'sent to owners': return 'Pending Payment';
        case 'under review': return 'Under Review';
        case 'approved': return 'Approved';
        case 'rejected': return 'Rejected';
        default: return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    }
}

function showError(message) {
    const detailsContainer = document.getElementById('billing-details');
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

function openReceiptModal(receiptPath, billNumber, receiptType = 'user') {
    console.log('Opening receipt modal for:', receiptPath, 'Bill:', billNumber, 'Type:', receiptType);
    
    // Set bill number
    document.getElementById('receiptBillNumber').textContent = billNumber.toString().padStart(6, '0');
    
    // Update modal title and header based on receipt type
    const modalTitle = document.getElementById('receipt-modal-title');
    const receiptStatus = document.getElementById('receipt-status');
    const receiptDescription = document.getElementById('receipt-description');
    const headerInfo = document.getElementById('receipt-header-info');
    const contentTitle = document.getElementById('receipt-content-title');
    const contentDescription = document.getElementById('receipt-content-description');
    
    if (receiptType === 'official') {
        modalTitle.textContent = 'Official Receipt';
        receiptStatus.textContent = 'Approved';
        receiptStatus.className = 'px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium';
        receiptDescription.textContent = 'Official payment receipt generated by system';
        contentTitle.textContent = 'Official Payment Receipt';
        contentDescription.textContent = 'Below is the official payment receipt generated by the system';
        headerInfo.querySelector('.bg-blue-50').className = 'bg-green-50 p-4 rounded-lg border border-green-200';
        headerInfo.querySelector('.text-blue-800').className = 'text-green-800 font-medium';
        headerInfo.querySelector('.text-blue-600').className = 'text-green-600 mt-2';
    } else {
        modalTitle.textContent = 'Payment Receipt';
        receiptStatus.textContent = 'Under Review';
        receiptStatus.className = 'px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium';
        receiptDescription.textContent = 'Payment proof submitted by user';
        contentTitle.textContent = 'Payment Proof';
        contentDescription.textContent = 'Below is the payment proof uploaded by the user';
        headerInfo.querySelector('.bg-green-50, .bg-blue-50').className = 'bg-blue-50 p-4 rounded-lg border border-blue-200';
        headerInfo.querySelector('.text-green-800, .text-blue-800').className = 'text-blue-800 font-medium';
        headerInfo.querySelector('.text-green-600, .text-blue-600').className = 'text-blue-600 mt-2';
    }
    
    // Display receipt file
    displayReceiptFile(receiptPath, receiptType);
    
    // Set up download button
    setupDownloadButton(receiptPath);
}

function displayReceiptFile(receiptPath, receiptType = 'user') {
    const receiptDisplay = document.getElementById('receiptFileDisplay');
    const fileUrl = `/storage/${receiptPath}`;
    
    // Get file extension to determine file type
    const fileExtension = receiptPath.split('.').pop().toLowerCase();
    
    if (receiptType === 'official' && fileExtension === 'html') {
        // Display official HTML receipt in iframe without container
        receiptDisplay.innerHTML = `
            <iframe src="${fileUrl}" class="w-full border rounded-lg shadow-lg" style="height: auto; min-height: 600px;"></iframe>
        `;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
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

// Open approve payment confirmation modal
function openApproveModal(paymentId, amount) {
    const billNumber = String(paymentId).padStart(6, '0');
    
    // Update modal content
    document.getElementById('approve-bill-number').textContent = `#${billNumber}`;
    document.getElementById('approve-amount').textContent = `₱${parseFloat(amount || 0).toFixed(2)}`;
    
    // Store payment ID in confirm button
    document.getElementById('confirm-approve-btn').setAttribute('data-payment-id', paymentId);
    
    // Reset button state
    resetApproveButton();
    
    // Trigger modal using data attributes (simulate click on modal trigger)
    const modalTrigger = document.createElement('button');
    modalTrigger.setAttribute('data-tw-toggle', 'modal');
    modalTrigger.setAttribute('data-tw-target', '#approve-payment-modal');
    modalTrigger.style.display = 'none';
    document.body.appendChild(modalTrigger);
    modalTrigger.click();
    document.body.removeChild(modalTrigger);
}

// Open reject payment confirmation modal
function openRejectModal(paymentId, amount) {
    const billNumber = String(paymentId).padStart(6, '0');
    
    // Update modal content
    document.getElementById('reject-bill-number').textContent = `#${billNumber}`;
    document.getElementById('reject-amount').textContent = `₱${parseFloat(amount || 0).toFixed(2)}`;
    
    // Store payment ID in confirm button
    document.getElementById('confirm-reject-btn').setAttribute('data-payment-id', paymentId);
    
    // Reset button state and form
    resetRejectButton();
    document.getElementById('reject-reason').value = '';
    
    // Trigger modal using data attributes (simulate click on modal trigger)
    const modalTrigger = document.createElement('button');
    modalTrigger.setAttribute('data-tw-toggle', 'modal');
    modalTrigger.setAttribute('data-tw-target', '#reject-payment-modal');
    modalTrigger.style.display = 'none';
    document.body.appendChild(modalTrigger);
    modalTrigger.click();
    document.body.removeChild(modalTrigger);
}

// Confirm approve payment
function confirmApprovePayment(paymentId) {
    // Show loading state
    const confirmBtn = document.getElementById('confirm-approve-btn');
    confirmBtn.disabled = true;
    confirmBtn.querySelector('.approve-btn-text').classList.add('hidden');
    confirmBtn.querySelector('.approve-btn-loading').classList.remove('hidden');
    
    // Get CSRF token
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                  document.querySelector('input[name="_token"]')?.value;
    
    // Make API call to approve payment
    fetch(`/list-payments/${paymentId}/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
            'Accept': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        // Reset button state
        resetApproveButton();
        
        // Close modal
        const closeBtn = document.querySelector('#approve-payment-modal [data-tw-dismiss="modal"]');
        if (closeBtn) closeBtn.click();
        
        if (data.success) {
            // Show success message
            showToast(data.message || 'Payment approved successfully!', 'success');
            
            // Reload page to reflect changes
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            // Show error message
            showToast(data.message || 'Failed to approve payment', 'error');
        }
    })
    .catch(error => {
        console.error('Error approving payment:', error);
        
        // Reset button state
        resetApproveButton();
        
        // Close modal
        const closeBtn = document.querySelector('#approve-payment-modal [data-tw-dismiss="modal"]');
        if (closeBtn) closeBtn.click();
        
        // Show error message
        showToast('Error approving payment. Please try again.', 'error');
    });
}

// Confirm reject payment
function confirmRejectPayment(paymentId, reason) {
    // Show loading state
    const confirmBtn = document.getElementById('confirm-reject-btn');
    confirmBtn.disabled = true;
    confirmBtn.querySelector('.reject-btn-text').classList.add('hidden');
    confirmBtn.querySelector('.reject-btn-loading').classList.remove('hidden');
    
    // Get CSRF token
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                  document.querySelector('input[name="_token"]')?.value;
    
    // Make API call to reject payment with reason
    fetch(`/list-payments/${paymentId}/reject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            reason: reason || ''
        })
    })
    .then(response => response.json())
    .then(data => {
        // Reset button state
        resetRejectButton();
        
        // Close modal
        const closeBtn = document.querySelector('#reject-payment-modal [data-tw-dismiss="modal"]');
        if (closeBtn) closeBtn.click();
        
        if (data.success) {
            // Show success message
            showToast(data.message || 'Payment rejected successfully!', 'success');
            
            // Reload page to reflect changes
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            // Show error message
            showToast(data.message || 'Failed to reject payment', 'error');
        }
    })
    .catch(error => {
        console.error('Error rejecting payment:', error);
        
        // Reset button state
        resetRejectButton();
        
        // Close modal
        const closeBtn = document.querySelector('#reject-payment-modal [data-tw-dismiss="modal"]');
        if (closeBtn) closeBtn.click();
        
        // Show error message
        showToast('Error rejecting payment. Please try again.', 'error');
    });
}

// Reset approve button state
function resetApproveButton() {
    const confirmBtn = document.getElementById('confirm-approve-btn');
    confirmBtn.disabled = false;
    confirmBtn.querySelector('.approve-btn-text').classList.remove('hidden');
    confirmBtn.querySelector('.approve-btn-loading').classList.add('hidden');
}

// Reset reject button state
function resetRejectButton() {
    const confirmBtn = document.getElementById('confirm-reject-btn');
    confirmBtn.disabled = false;
    confirmBtn.querySelector('.reject-btn-text').classList.remove('hidden');
    confirmBtn.querySelector('.reject-btn-loading').classList.add('hidden');
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
        stopOnFocus: true
    }).showToast();
}
