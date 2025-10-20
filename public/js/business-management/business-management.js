document.addEventListener('DOMContentLoaded', function () {
  var addForm = document.getElementById('addBusinessForm');
  var table = document.getElementById('businessTable');
  var editForm = document.getElementById('editBusinessForm');

  // Filter state
  let currentStatusFilter = 'all';
  let currentNameSort = 'default';
  let currentDateFilter = 'all';

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      applyFiltersAndSort();
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
        updateFilterButton('statusFilterBtn', filterValue === 'all' ? 'Status: All' : `Status: ${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}`);
      } else if (filterType === 'name-sort') {
        currentNameSort = filterValue;
        const btnText = filterValue === 'default' ? 'Name' : `Name: ${filterValue.toUpperCase()}`;
        updateFilterButton('nameSortBtn', btnText);
      } else if (filterType === 'date-filter') {
        currentDateFilter = filterValue;
        const dateTexts = {
          'all': 'Filter by Date',
          'today': 'Date: Today',
          'yesterday': 'Date: Yesterday',
          'this-week': 'Date: This Week',
          'last-week': 'Date: Last Week',
          'this-month': 'Date: This Month',
          'last-month': 'Date: Last Month',
          'this-year': 'Date: This Year'
        };
        updateFilterButton('dateFilterBtn', dateTexts[filterValue] || 'Filter by Date');
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
    currentDateFilter = 'all';
    
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Reset button texts
    updateFilterButton('statusFilterBtn', 'Status: All');
    updateFilterButton('nameSortBtn', 'Name');
    updateFilterButton('dateFilterBtn', 'Filter by Date');
    
    // Apply filters (which will show all)
    applyFiltersAndSort();
    
    if (typeof window.showNotification_users_toast_success === 'function') {
      window.showNotification_users_toast_success();
    }
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
    const tbody = document.querySelector('#businessTable tbody');
    const businessRows = Array.from(document.querySelectorAll('#businessTable tbody tr.intro-x'));
    
    if (businessRows.length === 0) return;
    
    // Setup date ranges for filtering
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    // Step 1: Filter rows
    let visibleRows = businessRows.filter(row => {
      const rowText = row.textContent.toLowerCase();
      const rowStatus = row.getAttribute('data-status');
      
      // Check if row matches search term and status filter
      const matchesSearch = searchTerm === '' || rowText.includes(searchTerm);
      const matchesStatus = currentStatusFilter === 'all' || rowStatus === currentStatusFilter;
      
      // Date filter check
      let matchesDate = true;
      if (currentDateFilter !== 'all') {
        const dateAttr = row.getAttribute('data-date');
        const rowDate = dateAttr ? new Date(dateAttr) : null;
        
        if (rowDate && !isNaN(rowDate.getTime())) {
          switch (currentDateFilter) {
            case 'today':
              matchesDate = rowDate >= today;
              break;
            case 'yesterday':
              matchesDate = rowDate >= yesterday && rowDate < today;
              break;
            case 'this-week':
              matchesDate = rowDate >= startOfWeek;
              break;
            case 'last-week':
              matchesDate = rowDate >= startOfLastWeek && rowDate < startOfWeek;
              break;
            case 'this-month':
              matchesDate = rowDate >= startOfMonth;
              break;
            case 'last-month':
              matchesDate = rowDate >= startOfLastMonth && rowDate < startOfMonth;
              break;
            case 'this-year':
              matchesDate = rowDate >= startOfYear;
              break;
            default:
              matchesDate = true;
          }
        } else {
          matchesDate = false;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
    
    // Step 2: Sort visible rows by name if applicable
    if (currentNameSort !== 'default') {
      visibleRows.sort((a, b) => {
        const nameA = a.querySelector('td:nth-child(3)')?.textContent.trim().toLowerCase() || ''; // Owner name column
        const nameB = b.querySelector('td:nth-child(3)')?.textContent.trim().toLowerCase() || '';
        
        if (currentNameSort === 'a-z') {
          return nameA.localeCompare(nameB);
        } else { // z-a
          return nameB.localeCompare(nameA);
        }
      });
    }
    
    // Step 3: Hide all rows first
    businessRows.forEach(row => {
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
    updateNoResultsMessage(searchTerm, currentStatusFilter, visibleRows.length, businessRows.length);
  }

  // Update no results message
  function updateNoResultsMessage(searchTerm, statusFilter, visibleCount, totalRows) {
    const tbody = document.querySelector('#businessTable tbody');
    let noDataRow = tbody?.querySelector('tr.no-data-found');
    
    // Remove existing no data row if it exists
    if (noDataRow) {
      noDataRow.remove();
    }
    
    // Check if we should show "no results" message
    const hasActiveFilters = searchTerm !== '' || currentStatusFilter !== 'all' || currentNameSort !== 'default' || currentDateFilter !== 'all';
    
    if (visibleCount === 0 && hasActiveFilters && totalRows > 0 && tbody) {
      // Create new no data row
      noDataRow = document.createElement('tr');
      noDataRow.className = 'no-data-found';
      noDataRow.innerHTML = `
        <td colspan="9" class="text-center py-8">
          <div class="text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 text-slate-300">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <div class="font-medium">No businesses found</div>
            <div class="text-sm">No businesses match your current filters. Try adjusting your filters.</div>
          </div>
        </td>
      `;
      tbody.appendChild(noDataRow);
    }
  }

  // Helper function to post forms
  async function postForm(form, url, method) {
    const formData = new FormData(form);
    if (method && method.toUpperCase() !== 'POST') {
      formData.append('_method', method.toUpperCase());
    }
    const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrf },
      body: formData
    });
    if (!resp.ok) throw new Error(await resp.text());
    return resp;
  }

  if (addForm) {
    addForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      try {
        await postForm(addForm, addForm.getAttribute('action') || '/business-management', 'POST');
        var modalEl = document.getElementById('add-user-modal');
        if (modalEl) modalEl.dispatchEvent(new CustomEvent('modal-hide'));
        if (typeof window.showNotification_users_toast_success === 'function') {
          window.showNotification_users_toast_success();
        }
        setTimeout(function(){ window.location.reload(); }, 600);
      } catch (err) {
        console.error(err);
        var slot = document.getElementById('users-error-message-slot');
        if (slot) slot.textContent = 'Failed to save business';
        if (typeof window.showNotification_users_toast_error === 'function') {
          window.showNotification_users_toast_error();
        }
      }
    });
  }

  if (table) {
    table.addEventListener('click', async function (e) {
      var editBtn = e.target.closest('a[data-action="edit"]');
      var deleteBtn = e.target.closest('a[data-action="delete"]');
      var viewBtn = e.target.closest('[data-tw-toggle="modal"][data-tw-target="#view-business-modal"]');
      var approveBtn = e.target.closest('[data-action="approve"]');
      var declineBtn = e.target.closest('[data-action="decline"]');
      
      // Debug logging
      console.log('Click detected:', e.target);
      console.log('Edit button found:', !!editBtn);
      console.log('Delete button found:', !!deleteBtn);
      console.log('View button found:', !!viewBtn);
      console.log('Approve button found:', !!approveBtn);
      console.log('Decline button found:', !!declineBtn);
      
      if (!editBtn && !deleteBtn && !viewBtn && !approveBtn && !declineBtn) return;
      e.preventDefault();
      
      var id = (editBtn || deleteBtn || viewBtn || approveBtn || declineBtn).getAttribute('data-id') || 
               (viewBtn || approveBtn || declineBtn).getAttribute('data-request-id');
      if (!id) return;

      console.log('Business ID:', id);

      if (deleteBtn) {
        document.getElementById('deleteBusinessId').value = id;
        return;
      }

      if (viewBtn) {
        try {
          const resp = await fetch('/business-management/' + id);
          if (!resp.ok) throw new Error(await resp.text());
          const data = await resp.json();
          loadBusinessDetails(data);
        } catch (err) {
          console.error(err);
          var slot = document.getElementById('users-error-message-slot');
          if (slot) slot.textContent = 'Failed to load business';
          if (typeof window.showNotification_users_toast_error === 'function') {
            window.showNotification_users_toast_error();
          }
        }
        return;
      }

      if (approveBtn) {
        console.log('Approve button clicked for business ID:', id);
        approveBusiness(id);
        return;
      }

      if (declineBtn) {
        console.log('Decline button clicked for business ID:', id);
        declineBusiness(id);
        return;
      }

      if (editBtn) {
        try {
          const resp = await fetch('/business-management/' + id);
          if (!resp.ok) throw new Error(await resp.text());
          const data = await resp.json();
          
          // Populate form fields
          document.getElementById('editBusinessId').value = data.id;
          document.getElementById('edit_business_name').value = data.business_name || '';
          document.getElementById('edit_type_of_business').value = data.type_of_business || '';
          document.getElementById('edit_user_id').value = data.user_id || '';
          document.getElementById('edit_address').value = data.address || '';
          document.getElementById('edit_status').value = data.status || 'pending';
          document.getElementById('edit_reason').value = data.reason || '';
          
          // Handle business clearance display
          const currentClearanceDiv = document.getElementById('editCurrentClearance');
          const currentClearanceLink = document.getElementById('editCurrentClearanceLink');
          
          if (data.business_clearance) {
            currentClearanceDiv.style.display = 'block';
            currentClearanceLink.href = '/storage/' + data.business_clearance;
            currentClearanceLink.textContent = 'View Current Clearance';
          } else {
            currentClearanceDiv.style.display = 'none';
          }
          
        } catch (err) {
          console.error(err);
          var slot = document.getElementById('users-error-message-slot');
          if (slot) slot.textContent = 'Failed to load business';
          if (typeof window.showNotification_users_toast_error === 'function') {
            window.showNotification_users_toast_error();
          }
        }
      }
    });
  }

  // Load business details for view modal
  function loadBusinessDetails(business) {
    console.log('Loading business details:', business);
    
    const detailsContainer = document.getElementById('business-details');
    if (detailsContainer) {
      const userName = business.user?.name || 'N/A';
      const userEmail = business.user?.email || 'N/A';
      const businessName = business.business_name || 'N/A';
      const businessType = business.type_of_business || 'N/A';
      const address = business.address || 'N/A';
      const status = business.status || 'N/A';
      const reason = business.reason || 'N/A';
      const dateCreated = business.created_at ? new Date(business.created_at).toLocaleString() : 'N/A';
      const clearanceFile = business.business_clearance ? 
        `<a href="/storage/${business.business_clearance}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">View Clearance</a>` : 
        'No file uploaded';

      detailsContainer.innerHTML = `
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">Business Name</label>
            <input type="text" class="form-control" value="${businessName}" readonly>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">Type of Business</label>
            <input type="text" class="form-control" value="${businessType}" readonly>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">Owner Name</label>
            <input type="text" class="form-control" value="${userName}" readonly>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">Owner Email</label>
            <input type="text" class="form-control" value="${userEmail}" readonly>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">User ID</label>
            <input type="text" class="form-control" value="${business.user_id}" readonly>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">Status</label>
            <input type="text" class="form-control" value="${status}" readonly>
          </div>
          <div class="col-span-12">
            <label class="form-label">Address</label>
            <input type="text" class="form-control" value="${address}" readonly>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">Business Clearance</label>
            <div class="form-control bg-slate-50">${clearanceFile}</div>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label">Date Created</label>
            <input type="text" class="form-control" value="${dateCreated}" readonly>
          </div>
          ${reason !== 'N/A' ? `
          <div class="col-span-12">
            <label class="form-label">Reason</label>
            <textarea class="form-control" rows="3" readonly>${reason}</textarea>
          </div>
          ` : ''}
        </div>
      `;
    }
  }

  // Approve business function
  function approveBusiness(businessId) {
    console.log('approveBusiness called with ID:', businessId);
    
    // Set the business ID first
    const approveIdInput = document.getElementById('approveBusinessId');
    if (approveIdInput) {
      approveIdInput.value = businessId;
      console.log('Approve Business ID set to:', approveIdInput.value);
    } else {
      console.error('approveBusinessId input not found!');
      return;
    }
    
    // Check if modal exists
    const modal = document.getElementById('approve-confirmation-modal');
    if (!modal) {
      console.error('approve-confirmation-modal not found!');
      return;
    }
    console.log('Approve modal found:', modal);
    
    // Try multiple approaches to open the modal
    try {
      // Approach 1: Direct modal show
      if (typeof window.twModal !== 'undefined') {
        window.twModal.show('#approve-confirmation-modal');
        console.log('Modal opened via twModal.show');
        return;
      }
      
      // Approach 2: Create and click a temporary button
      const tempButton = document.createElement('button');
      tempButton.setAttribute('data-tw-toggle', 'modal');
      tempButton.setAttribute('data-tw-target', '#approve-confirmation-modal');
      tempButton.style.display = 'none';
      
      document.body.appendChild(tempButton);
      tempButton.click();
      document.body.removeChild(tempButton);
      
      console.log('Modal opened via temporary button');
      
      // Approach 3: Manual modal display
      setTimeout(() => {
        if (!modal.classList.contains('show')) {
          modal.classList.add('show');
          modal.style.display = 'block';
          modal.setAttribute('aria-hidden', 'false');
          console.log('Modal manually shown');
        }
      }, 100);
      
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  }

  // Decline business function
  function declineBusiness(businessId) {
    console.log('declineBusiness called with ID:', businessId);
    
    // Set the business ID first
    const declineIdInput = document.getElementById('declineBusinessId');
    if (declineIdInput) {
      declineIdInput.value = businessId;
      console.log('Decline Business ID set to:', declineIdInput.value);
    } else {
      console.error('declineBusinessId input not found!');
      return;
    }
    
    // Check if modal exists
    const modal = document.getElementById('decline-reason-modal');
    if (!modal) {
      console.error('decline-reason-modal not found!');
      return;
    }
    console.log('Decline modal found:', modal);
    
    // Try multiple approaches to open the modal
    try {
      // Approach 1: Direct modal show
      if (typeof window.twModal !== 'undefined') {
        window.twModal.show('#decline-reason-modal');
        console.log('Modal opened via twModal.show');
        return;
      }
      
      // Approach 2: Create and click a temporary button
      const tempButton = document.createElement('button');
      tempButton.setAttribute('data-tw-toggle', 'modal');
      tempButton.setAttribute('data-tw-target', '#decline-reason-modal');
      tempButton.style.display = 'none';
      
      document.body.appendChild(tempButton);
      tempButton.click();
      document.body.removeChild(tempButton);
      
      console.log('Modal opened via temporary button');
      
      // Approach 3: Manual modal display
      setTimeout(() => {
        if (!modal.classList.contains('show')) {
          modal.classList.add('show');
          modal.style.display = 'block';
          modal.setAttribute('aria-hidden', 'false');
          console.log('Modal manually shown');
        }
      }, 100);
      
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  }

  // Confirm delete (modal)
  var confirmDelete = document.getElementById('confirmDeleteBusiness');
  if (confirmDelete) {
    confirmDelete.addEventListener('click', async function () {
      var id = document.getElementById('deleteBusinessId').value;
      if (!id) return;
      try {
        const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const resp = await fetch('/business-management/' + id, {
          method: 'DELETE',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrf }
        });
        if (!resp.ok) throw new Error(await resp.text());
        if (typeof window.showNotification_users_toast_success === 'function') {
          window.showNotification_users_toast_success();
        }
        setTimeout(function(){ window.location.reload(); }, 500);
      } catch (err) {
        console.error(err);
        var slot = document.getElementById('users-error-message-slot');
        if (slot) slot.textContent = 'Failed to delete business';
        if (typeof window.showNotification_users_toast_error === 'function') {
          window.showNotification_users_toast_error();
        }
      }
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const id = document.getElementById('editBusinessId').value;
      const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const formData = new FormData(editForm);
      formData.append('_method', 'PUT');
      
      try {
        const resp = await fetch('/business-management/' + id, {
          method: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrf },
          body: formData
        });
        if (!resp.ok) throw new Error(await resp.text());
        if (typeof window.showNotification_users_toast_success === 'function') {
          window.showNotification_users_toast_success();
        }
        setTimeout(function(){ window.location.reload(); }, 600);
      } catch (err) {
        console.error(err);
        var slot = document.getElementById('users-error-message-slot');
        if (slot) slot.textContent = 'Failed to update business';
        if (typeof window.showNotification_users_toast_error === 'function') {
          window.showNotification_users_toast_error();
        }
      }
    });
  }

  // Auto-hide reason field when status is not declined
  const statusSelects = document.querySelectorAll('select[name="status"]');
  statusSelects.forEach(select => {
    select.addEventListener('change', function() {
      const reasonField = this.closest('form').querySelector('textarea[name="reason"]');
      const reasonLabel = reasonField ? reasonField.previousElementSibling : null;
      
      if (this.value === 'declined') {
        if (reasonField) reasonField.style.display = 'block';
        if (reasonLabel) reasonLabel.style.display = 'block';
      } else {
        if (reasonField) reasonField.style.display = 'none';
        if (reasonLabel) reasonLabel.style.display = 'none';
        if (reasonField) reasonField.value = '';
      }
    });
  });

  // Initialize reason field visibility on page load
  statusSelects.forEach(select => {
    select.dispatchEvent(new Event('change'));
  });

  // Additional event listener for dropdown menu items
  document.addEventListener('click', function(e) {
    // Check if clicked element is an approve or decline button
    if (e.target.matches('[data-action="approve"]') || e.target.closest('[data-action="approve"]')) {
      e.preventDefault();
      const approveBtn = e.target.matches('[data-action="approve"]') ? e.target : e.target.closest('[data-action="approve"]');
      const businessId = approveBtn.getAttribute('data-request-id');
      console.log('Approve button clicked via dropdown listener for business ID:', businessId);
      if (businessId) {
        approveBusiness(businessId);
      }
    }
    
    if (e.target.matches('[data-action="decline"]') || e.target.closest('[data-action="decline"]')) {
      e.preventDefault();
      const declineBtn = e.target.matches('[data-action="decline"]') ? e.target : e.target.closest('[data-action="decline"]');
      const businessId = declineBtn.getAttribute('data-request-id');
      console.log('Decline button clicked via dropdown listener for business ID:', businessId);
      if (businessId) {
        declineBusiness(businessId);
      }
    }
  });
});

// Confirm approve business function
window.confirmApproveBusiness = function() {
  const businessId = document.getElementById('approveBusinessId').value;
  
  if (!businessId) {
    console.error('No business ID found for approval');
    return;
  }
  
  // Show loading state
  const approveBtn = document.querySelector('#approve-confirmation-modal .btn-success');
  const originalText = approveBtn.innerHTML;
  approveBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Approving...
  `;
  approveBtn.disabled = true;
  
  const formData = new FormData();
  formData.append('status', 'approved');
  formData.append('_token', document.querySelector('input[name="_token"]').value);
  formData.append('_method', 'PUT');
  
  fetch(`/business-management/${businessId}/status`, {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      // Show success notification
      if (typeof window.showNotification_users_toast_success === 'function') {
        window.showNotification_users_toast_success();
      }
      // Close modal and reload page after delay
      const modal = document.getElementById('approve-confirmation-modal');
      if (modal) {
        const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
        if (dismissBtn) dismissBtn.click();
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else if (data.error) {
      // Show error notification
      if (typeof window.showNotification_users_toast_error === 'function') {
        window.showNotification_users_toast_error();
      }
    }
  })
  .catch(error => {
    console.error('Error approving business:', error);
    // Show error notification
    if (typeof window.showNotification_users_toast_error === 'function') {
      window.showNotification_users_toast_error();
    }
  })
  .finally(() => {
    // Reset button state
    approveBtn.innerHTML = originalText;
    approveBtn.disabled = false;
  });
};

// Confirm decline business function
window.confirmDeclineBusiness = function() {
  const businessId = document.getElementById('declineBusinessId').value;
  const reason = document.getElementById('declineReason').value;
  
  if (!businessId) {
    console.error('No business ID found for decline');
    return;
  }
  
  if (!reason.trim()) {
    // Show error notification for missing reason
    if (typeof window.showNotification_users_toast_error === 'function') {
      window.showNotification_users_toast_error();
    }
    // Focus on the reason field
    document.getElementById('declineReason').focus();
    return;
  }
  
  // Show loading state
  const declineBtn = document.querySelector('#decline-reason-modal .btn-danger');
  const originalText = declineBtn.innerHTML;
  declineBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Declining...
  `;
  declineBtn.disabled = true;
  
  const formData = new FormData();
  formData.append('status', 'declined');
  formData.append('reason', reason);
  formData.append('_token', document.querySelector('input[name="_token"]').value);
  formData.append('_method', 'PUT');
  
  fetch(`/business-management/${businessId}/status`, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      // Show success notification
      if (typeof window.showNotification_users_toast_success === 'function') {
        window.showNotification_users_toast_success();
      }
      // Close modal and reload page after delay
      const modal = document.getElementById('decline-reason-modal');
      if (modal) {
        const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
        if (dismissBtn) dismissBtn.click();
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else if (data.error) {
      // Show error notification
      if (typeof window.showNotification_users_toast_error === 'function') {
        window.showNotification_users_toast_error();
      }
    }
  })
  .catch(error => {
    console.error('Error declining business:', error);
    // Show error notification
    if (typeof window.showNotification_users_toast_error === 'function') {
      window.showNotification_users_toast_error();
    }
  })
  .finally(() => {
    // Reset button state
    declineBtn.innerHTML = originalText;
    declineBtn.disabled = false;
  });
};


