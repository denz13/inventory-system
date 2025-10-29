document.addEventListener('DOMContentLoaded', function () {
  var table = document.getElementById('appointmentTable');

  if (table) {
    table.addEventListener('click', async function (e) {
      var approveBtn = e.target.closest('[data-action="approve"]');
      var cancelBtn = e.target.closest('[data-action="cancel"]');
      var completeBtn = e.target.closest('[data-action="complete"]');
      var deleteBtn = e.target.closest('[data-action="delete"]');
      
      // Debug logging
      console.log('Click detected:', e.target);
      console.log('Approve button found:', !!approveBtn);
      console.log('Cancel button found:', !!cancelBtn);
      console.log('Complete button found:', !!completeBtn);
      console.log('Delete button found:', !!deleteBtn);
      
      if (!approveBtn && !cancelBtn && !completeBtn && !deleteBtn) return;
      e.preventDefault();
      
      var id = (approveBtn || cancelBtn || completeBtn || deleteBtn).getAttribute('data-appointment-id') || 
               (deleteBtn).getAttribute('data-id');
      if (!id) return;

      console.log('Appointment ID:', id);

      if (deleteBtn) {
        document.getElementById('deleteAppointmentId').value = id;
        return;
      }

      if (approveBtn) {
        console.log('Approve button clicked for appointment ID:', id);
        approveAppointment(id);
        return;
      }

      if (cancelBtn) {
        console.log('Cancel button clicked for appointment ID:', id);
        openCancelReasonModal(id);
        return;
      }

      if (completeBtn) {
        console.log('Complete button clicked for appointment ID:', id);
        completeAppointment(id);
        return;
      }
    });
  }

  // Load appointment details for view modal
  function loadAppointmentDetails(appointment) {
    console.log('Loading appointment details:', appointment);
    
    const detailsContainer = document.getElementById('appointment-details');
    if (detailsContainer) {
      const trackingNumber = appointment.tracking_number || 'N/A';
      const status = appointment.status || 'N/A';
      const description = appointment.description || 'N/A';
      const appointmentDate = appointment.appointment_date ? new Date(appointment.appointment_date).toLocaleDateString() : 'N/A';
      const appointmentTime = appointment.time || 'N/A';
      const categoryName = appointment.appointment_category?.category_name || 'N/A';
      const dateCreated = appointment.created_at ? new Date(appointment.created_at).toLocaleString() : 'N/A';
      const remarks = appointment.remarks || 'N/A';

      detailsContainer.innerHTML = `
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 md:col-span-6">
            <label class="form-label font-semibold">Tracking Number</label>
            <input type="text" class="form-control" value="${trackingNumber}" readonly>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label font-semibold">Category</label>
            <input type="text" class="form-control" value="${categoryName}" readonly>
          </div>
          <div class="col-span-12">
            <label class="form-label font-semibold">Description</label>
            <textarea class="form-control" rows="3" readonly>${description}</textarea>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label font-semibold">Appointment Date</label>
            <input type="text" class="form-control" value="${appointmentDate}" readonly>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label font-semibold">Appointment Time</label>
            <input type="text" class="form-control font-medium text-primary" value="${appointmentTime}" readonly>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label font-semibold">Status</label>
            <input type="text" class="form-control" value="${status}" readonly>
          </div>
          <div class="col-span-12 md:col-span-6">
            <label class="form-label font-semibold">Date Created</label>
            <input type="text" class="form-control" value="${dateCreated}" readonly>
          </div>
          <div class="col-span-12">
            <label class="form-label font-semibold">Remarks</label>
            <textarea class="form-control" rows="3" readonly>${remarks}</textarea>
          </div>
        </div>
      `;
    }
  }

  // Approve appointment function
  function approveAppointment(appointmentId) {
    console.log('approveAppointment called with ID:', appointmentId);
    
    // Set the appointment ID first
    const approveIdInput = document.getElementById('approveAppointmentId');
    if (approveIdInput) {
      approveIdInput.value = appointmentId;
      console.log('Approve Appointment ID set to:', approveIdInput.value);
    } else {
      console.error('approveAppointmentId input not found!');
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

  // Complete appointment function
  function completeAppointment(appointmentId) {
    console.log('completeAppointment called with ID:', appointmentId);
    
    // Set the appointment ID first
    const completeIdInput = document.getElementById('completeAppointmentId');
    if (completeIdInput) {
      completeIdInput.value = appointmentId;
      console.log('Complete Appointment ID set to:', completeIdInput.value);
    } else {
      console.error('completeAppointmentId input not found!');
      return;
    }
    
    // Check if modal exists
    const modal = document.getElementById('complete-confirmation-modal');
    if (!modal) {
      console.error('complete-confirmation-modal not found!');
      return;
    }
    console.log('Complete modal found:', modal);
    
    // Try multiple approaches to open the modal
    try {
      // Approach 1: Direct modal show
      if (typeof window.twModal !== 'undefined') {
        window.twModal.show('#complete-confirmation-modal');
        console.log('Modal opened via twModal.show');
        return;
      }
      
      // Approach 2: Create and click a temporary button
      const tempButton = document.createElement('button');
      tempButton.setAttribute('data-tw-toggle', 'modal');
      tempButton.setAttribute('data-tw-target', '#complete-confirmation-modal');
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

  // Function to open cancel reason modal
  function openCancelReasonModal(appointmentId) {
    console.log('=== OPEN CANCEL REASON MODAL DEBUG ===');
    console.log('openCancelReasonModal called with appointment ID:', appointmentId);
    
    // Set the appointment ID in the hidden input
    const cancelIdInput = document.getElementById('cancelAppointmentId');
    if (cancelIdInput) {
      cancelIdInput.value = appointmentId;
      console.log('Cancel Appointment ID set to:', cancelIdInput.value);
    } else {
      console.error('cancelAppointmentId input not found!');
      return;
    }
    
    console.log('=== END OPEN CANCEL REASON MODAL DEBUG ===');
  }

  // Pending appointment function
  function pendingAppointment(appointmentId) {
    console.log('pendingAppointment called with ID:', appointmentId);
    
    // Set the appointment ID first
    const pendingIdInput = document.getElementById('pendingAppointmentId');
    if (pendingIdInput) {
      pendingIdInput.value = appointmentId;
      console.log('Pending Appointment ID set to:', pendingIdInput.value);
    } else {
      console.error('pendingAppointmentId input not found!');
      return;
    }
    
    // Check if modal exists
    const modal = document.getElementById('pending-confirmation-modal');
    if (!modal) {
      console.error('pending-confirmation-modal not found!');
      return;
    }
    console.log('Pending modal found:', modal);
    
    // Try multiple approaches to open the modal
    try {
      // Approach 1: Direct modal show
      if (typeof window.twModal !== 'undefined') {
        window.twModal.show('#pending-confirmation-modal');
        console.log('Modal opened via twModal.show');
        return;
      }
      
      // Approach 2: Create and click a temporary button
      const tempButton = document.createElement('button');
      tempButton.setAttribute('data-tw-toggle', 'modal');
      tempButton.setAttribute('data-tw-target', '#pending-confirmation-modal');
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
  var confirmDelete = document.getElementById('confirmDeleteAppointment');
  if (confirmDelete) {
    confirmDelete.addEventListener('click', async function () {
      var id = document.getElementById('deleteAppointmentId').value;
      if (!id) return;
      try {
        const csrf = document.querySelector('input[name="_token"]').value;
        const resp = await fetch('/appointment-management/' + id, {
          method: 'DELETE',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrf }
        });
        if (!resp.ok) throw new Error(await resp.text());
        if (typeof window.showNotification_appointments_toast_success === 'function') {
          window.showNotification_appointments_toast_success();
        }
        setTimeout(function(){ window.location.reload(); }, 500);
      } catch (err) {
        console.error(err);
        var slot = document.getElementById('appointments-error-message-slot');
        if (slot) slot.textContent = 'Failed to delete appointment';
        if (typeof window.showNotification_appointments_toast_error === 'function') {
          window.showNotification_appointments_toast_error();
        }
      }
    });
  }



  // Additional event listener for dropdown menu items
  document.addEventListener('click', function(e) {
    // Check if clicked element is an approve or complete button
    if (e.target.matches('[data-action="approve"]') || e.target.closest('[data-action="approve"]')) {
      e.preventDefault();
      const approveBtn = e.target.matches('[data-action="approve"]') ? e.target : e.target.closest('[data-action="approve"]');
      const appointmentId = approveBtn.getAttribute('data-appointment-id');
      console.log('Approve button clicked via dropdown listener for appointment ID:', appointmentId);
      if (appointmentId) {
        approveAppointment(appointmentId);
      }
    }
    
    if (e.target.matches('[data-action="complete"]') || e.target.closest('[data-action="complete"]')) {
      e.preventDefault();
      const completeBtn = e.target.matches('[data-action="complete"]') ? e.target : e.target.closest('[data-action="complete"]');
      const appointmentId = completeBtn.getAttribute('data-appointment-id');
      console.log('Complete button clicked via dropdown listener for appointment ID:', appointmentId);
      if (appointmentId) {
        completeAppointment(appointmentId);
      }
    }
    
    // Check if clicked element is a pending button
    if (e.target.matches('[data-action="pending"]') || e.target.closest('[data-action="pending"]')) {
      e.preventDefault();
      const pendingBtn = e.target.matches('[data-action="pending"]') ? e.target : e.target.closest('[data-action="pending"]');
      const appointmentId = pendingBtn.getAttribute('data-appointment-id');
      console.log('Pending button clicked via dropdown listener for appointment ID:', appointmentId);
      if (appointmentId) {
        pendingAppointment(appointmentId);
      }
    }
    
    // Check if clicked element is a cancel button
    if (e.target.matches('[data-action="cancel"]') || e.target.closest('[data-action="cancel"]')) {
      const cancelBtn = e.target.matches('[data-action="cancel"]') ? e.target : e.target.closest('[data-action="cancel"]');
      const appointmentId = cancelBtn.getAttribute('data-appointment-id');
      console.log('Cancel button clicked via dropdown listener for appointment ID:', appointmentId);
      if (appointmentId) {
        openCancelReasonModal(appointmentId);
      }
    }
  });

  // Add event listener for view modal shown event
  const viewModal = document.getElementById('view-appointment-modal');
  if (viewModal) {
    // Listen for when the modal is shown
    viewModal.addEventListener('show.tw.modal', function (event) {
      // Get the appointment ID from the button that triggered the modal
      const triggerButton = document.querySelector('[data-tw-toggle="modal"][data-tw-target="#view-appointment-modal"]:focus');
      if (triggerButton) {
        const appointmentId = triggerButton.getAttribute('data-appointment-id');
        if (appointmentId) {
          loadAppointmentData(appointmentId);
        }
      }
    });
  }

  // Function to load appointment data when modal is shown
  async function loadAppointmentData(appointmentId) {
    try {
      const resp = await fetch('/appointment-management/' + appointmentId);
      if (!resp.ok) throw new Error(await resp.text());
      const data = await resp.json();
      if (data.success && data.appointment) {
        loadAppointmentDetails(data.appointment);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error(err);
      var slot = document.getElementById('appointments-error-message-slot');
      if (slot) slot.textContent = 'Failed to load appointment';
      if (typeof window.showNotification_appointments_toast_error === 'function') {
        window.showNotification_appointments_toast_error();
      }
    }
  }

  // Search functionality - Server-side (Enter key or icon click)
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get search term from URL if it exists
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

  // Initialize filter states from URL
  const urlParams = new URLSearchParams(window.location.search);
  const currentStatus = urlParams.get('status') || 'all';
  const currentCategory = urlParams.get('category') || 'all';
  const currentTime = urlParams.get('time') || 'all';
  const currentTimeDisplay = urlParams.get('time_display') || currentTime;
  
  // Update dropdown texts based on URL
  if (currentStatus !== 'all') {
    updateStatusDropdownText(currentStatus);
  }
  if (currentCategory !== 'all') {
    updateCategoryDropdownText(currentCategory);
  }
  if (currentTime !== 'all') {
    updateTimeDropdownText(currentTimeDisplay);
  }

  // Status filter - Server-side
  document.querySelectorAll('[data-status-filter]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const status = this.getAttribute('data-status-filter');
      applyServerSideFilter('status', status);
    });
  });

  // Category filter - Server-side
  document.querySelectorAll('[data-category-filter]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('data-category-filter');
      applyServerSideFilter('category', category);
    });
  });

  // Time filter - Server-side
  document.querySelectorAll('[data-time-filter]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const time = this.getAttribute('data-time-filter');
      const displayTime = this.getAttribute('data-time-display') || time;
      
      // Store display value in URL for retrieval
      const urlParams = new URLSearchParams(window.location.search);
      if (time === 'all') {
        urlParams.delete('time');
        urlParams.delete('time_display');
      } else {
        urlParams.set('time', time);
        urlParams.set('time_display', displayTime);
      }
      urlParams.delete('page');
      
      window.location.href = window.location.pathname + '?' + urlParams.toString();
    });
  });

  // Clear filter / Show All button - Server-side
  const clearFilterBtn = document.getElementById('clearFilterBtn');
  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', function() {
      // Clear all filters by redirecting to clean URL
      window.location.href = window.location.pathname;
    });
  }
});

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
  console.log('Date range selected:', dateRange);
  
  if (!dateRange || dateRange.trim() === '') {
    return;
  }

  // Parse the date range (format: "1 Aug, 2025 - 31 Aug, 2025")
  const dateParts = dateRange.split(' - ');
  if (dateParts.length !== 2) {
    console.error('Invalid date range format:', dateRange);
    return;
  }

  try {
    const startDate = new Date(dateParts[0].trim());
    const endDate = new Date(dateParts[1].trim());
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Invalid date values');
      return;
    }

    // Format dates as YYYY-MM-DD
    const dateFrom = startDate.toISOString().split('T')[0];
    const dateTo = endDate.toISOString().split('T')[0];
    
    // Update URL with date range
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('date_from', dateFrom);
    urlParams.set('date_to', dateTo);
    urlParams.delete('page'); // Reset to page 1
    
    // Reload page with date filter
    window.location.href = window.location.pathname + '?' + urlParams.toString();
    
  } catch (error) {
    console.error('Error in date range filtering:', error);
  }
}

// Old client-side date filter logic removed
function handleDateRangeFilterOLD(dateRange) {
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

    // Normalize dates to start of day for proper comparison
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    console.log('Date range:', startDate, 'to', endDate);

    tableRows.forEach(row => {
      const appointmentDateStr = row.getAttribute('data-appointment-date');
      if (!appointmentDateStr) {
        console.log('No appointment date found for row, hiding');
        row.style.display = 'none';
        return;
      }

      // Parse date - handle YYYY-MM-DD format
      const appointmentDate = new Date(appointmentDateStr);
      
      // Check if date is valid
      if (isNaN(appointmentDate.getTime())) {
        console.error('Invalid appointment date:', appointmentDateStr);
        row.style.display = 'none';
        return;
      }
      
      // Normalize appointment date to start of day
      appointmentDate.setHours(0, 0, 0, 0);
      
      console.log('Comparing appointment date:', appointmentDate.toDateString(), '(' + appointmentDateStr + ') with range:', startDate.toDateString(), '-', endDate.toDateString());
      
      // Check if appointment date is within the selected range
      if (appointmentDate >= startDate && appointmentDate <= endDate) {
        console.log('✓ Date is in range, showing row');
        row.style.display = '';
      } else {
        console.log('✗ Date is out of range, hiding row');
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

// Server-side filter function
function applyServerSideFilter(filterType, filterValue) {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (filterValue === 'all') {
    urlParams.delete(filterType);
  } else {
    urlParams.set(filterType, filterValue);
  }
  
  // Reset to page 1 when filtering
  urlParams.delete('page');
  
  // Reload page with new filter
  window.location.href = window.location.pathname + '?' + urlParams.toString();
}

// OLD CLIENT-SIDE FUNCTIONS - KEPT FOR REFERENCE BUT NOT USED
function updateFilteredCountOLD() {
  const allRows = document.querySelectorAll('tbody tr.intro-x:not(#no-results-row)');
  const noResultsRow = document.getElementById('no-results-row');
  let visibleCount = 0;
  
  allRows.forEach(row => {
    if (row.style.display !== 'none') {
      visibleCount++;
    }
  });
  
  // Show/hide "no results found" message
  if (noResultsRow) {
    if (visibleCount === 0 && allRows.length > 0) {
      noResultsRow.classList.remove('hidden');
      noResultsRow.style.display = '';
    } else {
      noResultsRow.classList.add('hidden');
      noResultsRow.style.display = 'none';
    }
  }
  
  const filteredCount = document.getElementById('filtered-count');
  if (filteredCount) {
    filteredCount.textContent = visibleCount;
  }
  
  console.log('Updated filtered count:', visibleCount, 'out of', allRows.length);
}

// Filter by Status - OLD CLIENT-SIDE
function filterByStatusOLD(status) {
  console.log('Filtering by status:', status);
  const tableRows = document.querySelectorAll('tbody tr.intro-x:not(#no-results-row)');
  let visibleCount = 0;
  
  tableRows.forEach(row => {
    const rowStatus = row.getAttribute('data-status');
    if (status === 'all' || rowStatus === status) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });
  
  updateFilteredCountOLD();
}

// Filter by Category - OLD CLIENT-SIDE
function filterByCategoryOLD(category) {
  console.log('Filtering by category:', category);
  const tableRows = document.querySelectorAll('tbody tr.intro-x:not(#no-results-row)');
  let visibleCount = 0;
  
  tableRows.forEach(row => {
    const rowCategory = row.getAttribute('data-category');
    if (category === 'all' || rowCategory === category) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });
  
  updateFilteredCountOLD();
}

// Filter by Time - OLD CLIENT-SIDE
function filterByTimeOLD(timeFilter) {
  console.log('Filtering by time:', timeFilter);
  const tableRows = document.querySelectorAll('tbody tr.intro-x:not(#no-results-row)');
  let visibleCount = 0;
  
  tableRows.forEach(row => {
    const rowTime = row.getAttribute('data-time');
    
    if (timeFilter === 'all') {
      row.style.display = '';
      visibleCount++;
      return;
    }
    
    if (!rowTime) {
      row.style.display = 'none';
      return;
    }
    
    // Parse time (format: "HH:MM AM/PM" or "HH:MM")
    let shouldShow = false;
    const timeStr = rowTime.toLowerCase();
    
    // Extract hour
    let hour = 0;
    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(am|pm)?/i);
    if (timeMatch) {
      hour = parseInt(timeMatch[1]);
      const isPM = timeMatch[3] && timeMatch[3].toLowerCase() === 'pm';
      
      // Convert to 24-hour format
      if (isPM && hour !== 12) {
        hour += 12;
      } else if (!isPM && hour === 12) {
        hour = 0;
      }
      
      // Check time ranges
      switch (timeFilter) {
        case 'morning':
          shouldShow = hour >= 6 && hour < 12;
          break;
        case 'afternoon':
          shouldShow = hour >= 12 && hour < 18;
          break;
        case 'evening':
          shouldShow = hour >= 18 && hour < 24;
          break;
      }
    }
    
    if (shouldShow) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });
  
  updateFilteredCountOLD();
}

// Update dropdown button texts
function updateStatusDropdownText(status) {
  const btn = document.getElementById('statusFilterBtn');
  if (btn) {
    const icon = btn.querySelector('svg');
    const statusText = status === 'all' ? 'Status: All' : `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
    btn.textContent = statusText;
    if (icon) {
      btn.insertBefore(icon, btn.firstChild);
    }
  }
}

function updateCategoryDropdownText(category) {
  const btn = document.getElementById('categoryFilterBtn');
  if (btn) {
    const icon = btn.querySelector('svg');
    let categoryText;
    if (category === 'all') {
      categoryText = 'Category: All';
    } else {
      const shortCategory = category.length > 12 ? category.substring(0, 12) + '...' : category;
      categoryText = `Category: ${shortCategory}`;
    }
    btn.textContent = categoryText;
    if (icon) {
      btn.insertBefore(icon, btn.firstChild);
    }
  }
}

function updateTimeDropdownText(time) {
  const btn = document.getElementById('timeFilterBtn');
  if (btn) {
    const icon = btn.querySelector('svg');
    let timeText = 'Time: All';
    
    if (time && time !== 'all' && time !== 'All Times') {
      // Use the display value directly (e.g., "2:30 PM")
      timeText = `Time: ${time}`;
    }
    
    btn.textContent = timeText;
    if (icon) {
      btn.insertBefore(icon, btn.firstChild);
    }
  }
}

// Confirm approve appointment function
window.confirmApproveAppointment = function() {
  const appointmentId = document.getElementById('approveAppointmentId').value;
  const remarks = document.getElementById('approveRemarks').value;
  
  if (!appointmentId) {
    console.error('No appointment ID found for approval');
    return;
  }
  
  if (!remarks.trim()) {
    // Show error notification for missing remarks
    const slot = document.getElementById('appointments-error-message-slot');
    if (slot) slot.textContent = 'Please provide remarks for approval';
    if (typeof window.showNotification_appointments_toast_error === 'function') {
      window.showNotification_appointments_toast_error();
    }
    // Focus on the remarks field
    document.getElementById('approveRemarks').focus();
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
  formData.append('remarks', remarks);
  formData.append('_token', document.querySelector('input[name="_token"]').value);
  formData.append('_method', 'PUT');
  
  fetch(`/appointment-management/${appointmentId}/status`, {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success || data.message) {
      // Show success notification
      if (typeof window.showNotification_appointments_toast_success === 'function') {
        window.showNotification_appointments_toast_success();
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
      if (typeof window.showNotification_appointments_toast_error === 'function') {
        window.showNotification_appointments_toast_error();
      }
    }
  })
  .catch(error => {
    console.error('Error approving appointment:', error);
    // Show error notification
    if (typeof window.showNotification_appointments_toast_error === 'function') {
      window.showNotification_appointments_toast_error();
    }
  })
  .finally(() => {
    // Reset button state
    approveBtn.innerHTML = originalText;
    approveBtn.disabled = false;
  });
};

// Confirm complete appointment function
window.confirmCompleteAppointment = function() {
  const appointmentId = document.getElementById('completeAppointmentId').value;
  const remarks = document.getElementById('completeRemarks').value;
  
  if (!appointmentId) {
    console.error('No appointment ID found for completion');
    return;
  }
  
  if (!remarks.trim()) {
    // Show error notification for missing remarks
    const slot = document.getElementById('appointments-error-message-slot');
    if (slot) slot.textContent = 'Please provide remarks for completion';
    if (typeof window.showNotification_appointments_toast_error === 'function') {
      window.showNotification_appointments_toast_error();
    }
    // Focus on the remarks field
    document.getElementById('completeRemarks').focus();
    return;
  }
  
  // Show loading state
  const completeBtn = document.querySelector('#complete-confirmation-modal .btn-info');
  const originalText = completeBtn.innerHTML;
  completeBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Completing...
  `;
  completeBtn.disabled = true;
  
  const formData = new FormData();
  formData.append('status', 'completed');
  formData.append('remarks', remarks);
  formData.append('_token', document.querySelector('input[name="_token"]').value);
  formData.append('_method', 'PUT');
  
  fetch(`/appointment-management/${appointmentId}/status`, {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success || data.message) {
      // Show success notification
      if (typeof window.showNotification_appointments_toast_success === 'function') {
        window.showNotification_appointments_toast_success();
      }
      // Close modal and reload page after delay
      const modal = document.getElementById('complete-confirmation-modal');
      if (modal) {
        const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
        if (dismissBtn) dismissBtn.click();
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else if (data.error) {
      // Show error notification
      if (typeof window.showNotification_appointments_toast_error === 'function') {
        window.showNotification_appointments_toast_error();
      }
    }
  })
  .catch(error => {
    console.error('Error completing appointment:', error);
    // Show error notification
    if (typeof window.showNotification_appointments_toast_error === 'function') {
      window.showNotification_appointments_toast_error();
    }
  })
  .finally(() => {
    // Reset button state
    completeBtn.innerHTML = originalText;
    completeBtn.disabled = false;
  });
};

// Confirm pending appointment function
window.confirmPendingAppointment = function() {
  const appointmentId = document.getElementById('pendingAppointmentId').value;
  
  if (!appointmentId) {
    console.error('No appointment ID found for setting to pending');
    return;
  }
  
  // Show loading state
  const pendingBtn = document.querySelector('#pending-confirmation-modal .btn-warning');
  const originalText = pendingBtn.innerHTML;
  pendingBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Setting...
  `;
  pendingBtn.disabled = true;
  
  const formData = new FormData();
  formData.append('status', 'pending');
  formData.append('_token', document.querySelector('input[name="_token"]').value);
  formData.append('_method', 'PUT');
  
  fetch(`/appointment-management/${appointmentId}/status`, {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success || data.message) {
      // Show success notification
      if (typeof window.showNotification_appointments_toast_success === 'function') {
        window.showNotification_appointments_toast_success();
      }
      // Close modal and reload page after delay
      const modal = document.getElementById('pending-confirmation-modal');
      if (modal) {
        const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
        if (dismissBtn) dismissBtn.click();
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else if (data.error) {
      // Show error notification
      if (typeof window.showNotification_appointments_toast_error === 'function') {
        window.showNotification_appointments_toast_error();
      }
    }
  })
  .catch(error => {
    console.error('Error setting appointment to pending:', error);
    // Show error notification
    if (typeof window.showNotification_appointments_toast_error === 'function') {
      window.showNotification_appointments_toast_error();
    }
  })
  .finally(() => {
    // Reset button state
    pendingBtn.innerHTML = originalText;
    pendingBtn.disabled = false;
  });
};

// Confirm cancel appointment function
window.confirmCancelAppointment = function() {
  const appointmentId = document.getElementById('cancelAppointmentId').value;
  const reason = document.getElementById('cancelReason').value;
  
  if (!appointmentId) {
    console.error('No appointment ID found for cancellation');
    return;
  }
  
  if (!reason.trim()) {
    // Show error notification for missing reason
    if (typeof window.showNotification_appointments_toast_error === 'function') {
      window.showNotification_appointments_toast_error();
    }
    // Focus on the reason field
    document.getElementById('cancelReason').focus();
    return;
  }
  
  // Show loading state
  const cancelBtn = document.querySelector('#cancel-reason-modal .btn-danger');
  const originalText = cancelBtn.innerHTML;
  cancelBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Cancelling...
  `;
  cancelBtn.disabled = true;
  
  const formData = new FormData();
  formData.append('status', 'cancelled');
  formData.append('remarks', reason);
  formData.append('_token', document.querySelector('input[name="_token"]').value);
  formData.append('_method', 'PUT');
  
  fetch(`/appointment-management/${appointmentId}/status`, {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success || data.message) {
      // Show success notification
      if (typeof window.showNotification_appointments_toast_success === 'function') {
        window.showNotification_appointments_toast_success();
      }
      // Close modal and reload page after delay
      const modal = document.getElementById('cancel-reason-modal');
      if (modal) {
        const dismissBtn = modal.querySelector('[data-tw-dismiss="modal"]');
        if (dismissBtn) dismissBtn.click();
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else if (data.error) {
      // Show error notification
      if (typeof window.showNotification_appointments_toast_error === 'function') {
        window.showNotification_appointments_toast_error();
      }
    }
  })
  .catch(error => {
    console.error('Error cancelling appointment:', error);
    // Show error notification
    if (typeof window.showNotification_appointments_toast_error === 'function') {
      window.showNotification_appointments_toast_error();
    }
  })
  .finally(() => {
    // Reset button state
    cancelBtn.innerHTML = originalText;
    cancelBtn.disabled = false;
  });
};
