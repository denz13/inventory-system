document.addEventListener('DOMContentLoaded', function () {
    var addForm = document.getElementById('createVehicleForm');
    var table = document.getElementById('vehicleTable');
    var editForm = document.getElementById('editVehicleForm');

    // Bind type-of-vehicle radio to hidden inputs (Add)
    function bindTypeRadios(groupName, hiddenId, otherWrapId, otherInputId) {
        var radios = document.querySelectorAll('input[name="'+groupName+'"]');
        var hidden = document.getElementById(hiddenId);
        var otherWrap = document.getElementById(otherWrapId);
        var otherInput = document.getElementById(otherInputId);
        if (!radios.length || !hidden) return;
        var update = function (val) {
            if (val === 'others') {
                if (otherWrap) otherWrap.classList.remove('hidden');
                if (otherInput) { 
                    otherInput.addEventListener('input', function(){ hidden.value = otherInput.value; }); 
                    hidden.value = otherInput.value || ''; 
                }
            } else {
                if (otherWrap) otherWrap.classList.add('hidden');
                hidden.value = val;
            }
        };
        radios.forEach(function(r){
            r.addEventListener('change', function(){ update(this.value); });
            if (r.checked) update(r.value);
        });
    }

    bindTypeRadios('add_type_of_vehicle_opt','add_type_of_vehicle','add_other_type_wrap','add_other_type');
    bindTypeRadios('edit_type_of_vehicle_opt','edit_type_of_vehicle','edit_other_type_wrap','edit_other_type');

    // Reset modals when closed
    document.getElementById('create-vehicle-modal')?.addEventListener('hidden.bs.modal', function() {
        if (addForm) addForm.reset();
        document.getElementById('fileInfo').style.display = 'none';
        // Reset radio to default (car)
        var defaultRadio = document.querySelector('input[name="add_type_of_vehicle_opt"][value="car"]');
        if (defaultRadio) defaultRadio.checked = true;
        document.getElementById('add_other_type_wrap')?.classList.add('hidden');
        document.getElementById('add_type_of_vehicle').value = 'car';
    });

    document.getElementById('edit-vehicle-modal')?.addEventListener('hidden.bs.modal', function() {
        document.getElementById('edit_other_type_wrap')?.classList.add('hidden');
        document.getElementById('currentFileInfo').style.display = 'none';
    });

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

    // Add vehicle form submission
    if (addForm) {
        addForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            try {
                await postForm(addForm, addForm.getAttribute('action') || '/vehicle', 'POST');
                var modalEl = document.getElementById('create-vehicle-modal');
                if (modalEl) modalEl.dispatchEvent(new CustomEvent('modal-hide'));
                if (typeof window.showNotification_vehicle_toast_success === 'function') {
                    window.showNotification_vehicle_toast_success();
                }
                setTimeout(function(){ window.location.reload(); }, 600);
            } catch (err) {
                console.error(err);
                var slot = document.getElementById('vehicle-error-message-slot');
                if (slot) slot.textContent = 'Failed to save vehicle';
                if (typeof window.showNotification_vehicle_toast_error === 'function') {
                    window.showNotification_vehicle_toast_error();
                }
            }
        });
    }

    // Table interactions
    if (table) {
        table.addEventListener('click', async function (e) {
            var editBtn = e.target.closest('a[data-action="edit"]');
            var deleteBtn = e.target.closest('a[data-action="delete"]');
            var viewBtn = e.target.closest('[data-tw-toggle="modal"][data-tw-target="#view-vehicle-modal"]');
            
            if (!editBtn && !deleteBtn && !viewBtn) return;
            e.preventDefault();
            
            var id = (editBtn || deleteBtn || viewBtn).getAttribute('data-id') || 
                     (viewBtn).getAttribute('data-vehicle-id');
            if (!id) return;

            if (deleteBtn) {
                document.getElementById('deleteVehicleId').value = id;
                return;
            }

            if (viewBtn) {
                try {
                    const resp = await fetch('/vehicle/' + id);
                    if (!resp.ok) throw new Error(await resp.text());
                    const data = await resp.json();
                    loadVehicleDetails(data.data);
                } catch (err) {
                    console.error(err);
                    var slot = document.getElementById('vehicle-error-message-slot');
                    if (slot) slot.textContent = 'Failed to load vehicle';
                    if (typeof window.showNotification_vehicle_toast_error === 'function') {
                        window.showNotification_vehicle_toast_error();
                    }
                }
                return;
            }

            if (editBtn) {
                try {
                    const resp = await fetch('/vehicle/' + id);
                    if (!resp.ok) throw new Error(await resp.text());
                    const data = await resp.json();
                    
                    console.log('Edit vehicle data:', data); // Debug log
                    console.log('Data structure breakdown:');
                    console.log('- Root data:', data.data);
                    console.log('- Supporting documents:', data.data.supporting_documents);
                    console.log('- Vehicle details:', data.data.supporting_documents?.vehicle_details);
                    
                    // Populate form fields
                    document.getElementById('editVehicleId').value = data.data.id;
                    
                    // Set vehicle type radio buttons
                    var vehicleType = data.data.type_of_vehicle || '';
                    var editRadios = document.querySelectorAll('input[name="edit_type_of_vehicle_opt"]');
                    var foundMatch = false;
                    editRadios.forEach(function(r){ 
                        r.checked = false; // Reset all first
                        if (r.value === vehicleType) {
                            r.checked = true;
                            foundMatch = true;
                        }
                    });
                    
                    // If type doesn't match preset options, select "others" and show input
                    if (!foundMatch && vehicleType) {
                        editRadios.forEach(function(r){ if (r.value === 'others') r.checked = true; });
                        var wrap = document.getElementById('edit_other_type_wrap');
                        if (wrap) wrap.classList.remove('hidden');
                        var other = document.getElementById('edit_other_type');
                        if (other) other.value = vehicleType;
                        document.getElementById('edit_type_of_vehicle').value = vehicleType;
                    } else {
                        // Hide others field for preset types
                        var wrap = document.getElementById('edit_other_type_wrap');
                        if (wrap) wrap.classList.add('hidden');
                        document.getElementById('edit_type_of_vehicle').value = vehicleType;
                    }
                    
                    // Check if we have the nested data structure
                    if (data.data.supporting_documents && data.data.supporting_documents.vehicle_details) {
                        console.log('Found nested structure:', data.data.supporting_documents.vehicle_details);
                        document.getElementById('editPlateNumber').value = data.data.supporting_documents.vehicle_details.plate_number || '';
                        document.getElementById('editVehicleModel').value = data.data.supporting_documents.vehicle_details.vehicle_model || '';
                        document.getElementById('editOrNo').value = data.data.supporting_documents.vehicle_details.or_no || '';
                        document.getElementById('editCrNo').value = data.data.supporting_documents.vehicle_details.cr_no || '';
                        document.getElementById('editColorOfVehicle').value = data.data.supporting_documents.vehicle_details.color_of_vehicle || '';
                        document.getElementById('editOwner').value = data.data.supporting_documents.vehicle_details.owner || '';
                        document.getElementById('editDriver').value = data.data.supporting_documents.vehicle_details.driver || '';
                    } else {
                        console.log('No nested structure found. Data structure:', data.data);
                        // Fallback: try to find vehicle details in any available structure
                        if (data.data.vehicle_details) {
                            console.log('Found vehicle_details at root level:', data.data.vehicle_details);
                            document.getElementById('editPlateNumber').value = data.data.vehicle_details.plate_number || '';
                            document.getElementById('editVehicleModel').value = data.data.vehicle_details.vehicle_model || '';
                            document.getElementById('editOrNo').value = data.data.vehicle_details.or_no || '';
                            document.getElementById('editCrNo').value = data.data.vehicle_details.cr_no || '';
                            document.getElementById('editColorOfVehicle').value = data.data.vehicle_details.color_of_vehicle || '';
                            document.getElementById('editOwner').value = data.data.vehicle_details.owner || '';
                            document.getElementById('editDriver').value = data.data.vehicle_details.driver || '';
                        }
                    }
                    
                    // Handle current file display - support multiple files
                    const currentFileDiv = document.getElementById('currentFileInfo');
                    if (data.data.supporting_documents && data.data.supporting_documents.supporting_documents_attachments) {
                        try {
                            const files = JSON.parse(data.data.supporting_documents.supporting_documents_attachments);
                            if (Array.isArray(files) && files.length > 0) {
                                let fileList = '';
                                files.forEach((file, index) => {
                                    const fileName = file.split('/').pop();
                                    fileList += `<div class="mb-1"><a href="/storage/${file}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">${index + 1}. ${fileName}</a></div>`;
                                });
                                currentFileDiv.innerHTML = `<div class="font-medium mb-1">Current files (${files.length}):</div>${fileList}`;
                                currentFileDiv.style.display = 'block';
                            } else {
                                const fileName = data.data.supporting_documents.supporting_documents_attachments.split('/').pop();
                                currentFileDiv.innerHTML = `Current file: <a href="/storage/${data.data.supporting_documents.supporting_documents_attachments}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">${fileName}</a>`;
                                currentFileDiv.style.display = 'block';
                            }
                        } catch (e) {
                            // If not JSON, treat as single file (backward compatibility)
                            const fileName = data.data.supporting_documents.supporting_documents_attachments.split('/').pop();
                            currentFileDiv.innerHTML = `Current file: <a href="/storage/${data.data.supporting_documents.supporting_documents_attachments}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">${fileName}</a>`;
                            currentFileDiv.style.display = 'block';
                        }
                    } else {
                        currentFileDiv.style.display = 'none';
                    }
                    
                } catch (err) {
                    console.error(err);
                    var slot = document.getElementById('vehicle-error-message-slot');
                    if (slot) slot.textContent = 'Failed to load vehicle';
                    if (typeof window.showNotification_vehicle_toast_error === 'function') {
                        window.showNotification_vehicle_toast_error();
                    }
                }
            }
        });
    }

    // Load vehicle details for view modal
    function loadVehicleDetails(vehicle) {
        const detailsContainer = document.getElementById('vehicle-details');
        if (detailsContainer) {
            const userName = vehicle.user?.name || 'N/A';
            const vehicleType = vehicle.type_of_vehicle || 'N/A';
            const plateNumber = vehicle.supporting_documents?.vehicle_details?.plate_number || 'N/A';
            const vehicleModel = vehicle.supporting_documents?.vehicle_details?.vehicle_model || 'N/A';
            const orNo = vehicle.supporting_documents?.vehicle_details?.or_no || 'N/A';
            const crNo = vehicle.supporting_documents?.vehicle_details?.cr_no || 'N/A';
            const color = vehicle.supporting_documents?.vehicle_details?.color_of_vehicle || 'N/A';
            const owner = vehicle.supporting_documents?.vehicle_details?.owner || 'N/A';
            const driver = vehicle.supporting_documents?.vehicle_details?.driver || 'N/A';
            const status = vehicle.status || 'N/A';
            const dateCreated = vehicle.created_at ? new Date(vehicle.created_at).toLocaleString() : 'N/A';
            
            // Handle multiple files
            let supportingDoc = 'No files uploaded';
            if (vehicle.supporting_documents?.supporting_documents_attachments) {
                try {
                    const files = JSON.parse(vehicle.supporting_documents.supporting_documents_attachments);
                    if (Array.isArray(files) && files.length > 0) {
                        supportingDoc = files.map((file, index) => {
                            const fileName = file.split('/').pop();
                            return `<div class="mb-1"><a href="/storage/${file}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">${index + 1}. ${fileName}</a></div>`;
                        }).join('');
                    } else {
                        supportingDoc = `<a href="/storage/${vehicle.supporting_documents.supporting_documents_attachments}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">View Document</a>`;
                    }
                } catch (e) {
                    // If not JSON, treat as single file (backward compatibility)
                    supportingDoc = `<a href="/storage/${vehicle.supporting_documents.supporting_documents_attachments}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">View Document</a>`;
                }
            }

            detailsContainer.innerHTML = `
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-6">
                        <label class="form-label">Vehicle Type</label>
                        <input type="text" class="form-control" value="${vehicleType}" readonly>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="form-label">Plate Number</label>
                        <input type="text" class="form-control" value="${plateNumber}" readonly>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="form-label">Vehicle Model</label>
                        <input type="text" class="form-control" value="${vehicleModel}" readonly>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="form-label">Color</label>
                        <input type="text" class="form-control" value="${color}" readonly>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="form-label">OR Number</label>
                        <input type="text" class="form-control" value="${orNo}" readonly>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="form-label">CR Number</label>
                        <input type="text" class="form-control" value="${crNo}" readonly>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="form-label">Owner of Vehicle</label>
                        <input type="text" class="form-control" value="${owner}" readonly>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="form-label">Driver Name</label>
                        <input type="text" class="form-control" value="${driver}" readonly>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="form-label">Registered By</label>
                        <input type="text" class="form-control" value="${userName}" readonly>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="form-label">Status</label>
                        <input type="text" class="form-control" value="${status}" readonly>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="form-label">Date Created</label>
                        <input type="text" class="form-control" value="${dateCreated}" readonly>
                    </div>
                    <div class="col-span-12">
                        <label class="form-label">Supporting Documents</label>
                        <div class="form-control bg-slate-50">${supportingDoc}</div>
                    </div>
                </div>
            `;
        }
    }

    // Confirm delete
    var confirmDelete = document.getElementById('confirmDeleteVehicle');
    if (confirmDelete) {
        confirmDelete.addEventListener('click', async function () {
            var id = document.getElementById('deleteVehicleId').value;
            if (!id) return;
            try {
                const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                const resp = await fetch('/vehicle/' + id, {
                    method: 'DELETE',
                    headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrf }
                });
                if (!resp.ok) throw new Error(await resp.text());
                if (typeof window.showNotification_vehicle_toast_success === 'function') {
                    window.showNotification_vehicle_toast_success();
                }
                setTimeout(function(){ window.location.reload(); }, 500);
            } catch (err) {
                console.error(err);
                var slot = document.getElementById('vehicle-error-message-slot');
                if (slot) slot.textContent = 'Failed to delete vehicle';
                if (typeof window.showNotification_vehicle_toast_error === 'function') {
                    window.showNotification_vehicle_toast_error();
                }
            }
        });
    }

    // Function to show update confirmation modal
    function showUpdateConfirmationModal() {
        const updateConfirmModal = document.getElementById('update-confirmation-modal');
        if (updateConfirmModal) {
            // Trigger modal using the same method as other modals
            const modalTrigger = document.createElement('button');
            modalTrigger.setAttribute('data-tw-toggle', 'modal');
            modalTrigger.setAttribute('data-tw-target', '#update-confirmation-modal');
            modalTrigger.style.display = 'none';
            document.body.appendChild(modalTrigger);
            modalTrigger.click();
            document.body.removeChild(modalTrigger);
        }
    }
    
    // Handle Update Vehicle button click - show confirmation modal first
    const updateVehicleBtn = document.getElementById('updateVehicleBtn');
    if (updateVehicleBtn) {
        updateVehicleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showUpdateConfirmationModal();
        });
    }
    
    // Prevent form submission on Enter key - show modal instead
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showUpdateConfirmationModal();
        });
    }
    
    // Handle confirm update button in confirmation modal
    const confirmUpdateBtn = document.getElementById('confirmUpdateVehicle');
    if (confirmUpdateBtn && editForm) {
        confirmUpdateBtn.addEventListener('click', async function() {
            // Close the confirmation modal first
            const updateConfirmModal = document.getElementById('update-confirmation-modal');
            if (updateConfirmModal) {
                const closeBtn = updateConfirmModal.querySelector('[data-tw-dismiss="modal"]');
                if (closeBtn) closeBtn.click();
            }
            
            // Wait a bit for modal to close, then submit
            setTimeout(async function() {
                // Submit the form
                const id = document.getElementById('editVehicleId').value;
                if (!id) return;
                
                const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                const formData = new FormData(editForm);
                formData.append('_method', 'PUT');
                
                try {
                    const resp = await fetch('/vehicle/' + id, {
                        method: 'POST',
                        headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrf },
                        body: formData
                    });
                    if (!resp.ok) throw new Error(await resp.text());
                    
                    // Close the edit modal on success
                    const editModal = document.getElementById('edit-vehicle-modal');
                    if (editModal) {
                        const editCloseBtn = editModal.querySelector('[data-tw-dismiss="modal"]');
                        if (editCloseBtn) editCloseBtn.click();
                    }
                    
                    if (typeof window.showNotification_vehicle_toast_success === 'function') {
                        window.showNotification_vehicle_toast_success();
                    }
                    setTimeout(function(){ window.location.reload(); }, 600);
                } catch (err) {
                    console.error(err);
                    var slot = document.getElementById('vehicle-error-message-slot');
                    if (slot) slot.textContent = 'Failed to update vehicle';
                    if (typeof window.showNotification_vehicle_toast_error === 'function') {
                        window.showNotification_vehicle_toast_error();
                    }
                }
            }, 300);
        });
    }

    // File input change handlers - support multiple files
    const createFileInput = document.getElementById('createSupportingDocuments');
    if (createFileInput) {
        createFileInput.addEventListener('change', function() {
            const files = this.files;
            const fileInfo = document.getElementById('fileInfo');
            if (files && files.length > 0 && fileInfo) {
                let fileList = '';
                let totalSize = 0;
                for (let i = 0; i < files.length; i++) {
                    totalSize += files[i].size;
                    fileList += `<div>${i + 1}. ${files[i].name} (${(files[i].size / 1024 / 1024).toFixed(2)} MB)</div>`;
                }
                fileInfo.innerHTML = `<div class="font-medium mb-1">Selected ${files.length} file(s):</div>${fileList}<div class="mt-1 font-medium">Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB</div>`;
                fileInfo.style.display = 'block';
            } else if (fileInfo) {
                fileInfo.style.display = 'none';
            }
        });
    }
    
    const editFileInput = document.getElementById('editSupportingDocumentsAttachments');
    if (editFileInput) {
        editFileInput.addEventListener('change', function() {
            const files = this.files;
            const fileInfo = document.getElementById('currentFileInfo');
            if (files && files.length > 0 && fileInfo) {
                let fileList = '';
                let totalSize = 0;
                for (let i = 0; i < files.length; i++) {
                    totalSize += files[i].size;
                    fileList += `<div>${i + 1}. ${files[i].name} (${(files[i].size / 1024 / 1024).toFixed(2)} MB)</div>`;
                }
                fileInfo.innerHTML = `<div class="font-medium mb-1">New ${files.length} file(s) selected:</div>${fileList}<div class="mt-1 font-medium">Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB</div>`;
                fileInfo.style.display = 'block';
            }
        });
    }

    // State for filters
    let currentStatusFilter = 'all';

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyAllFilters();
        });
    }

    // Universal filter handler (matching service-management pattern)
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-filter-type]')) {
            const filterType = e.target.getAttribute('data-filter-type');
            const filterValue = e.target.getAttribute('data-filter-value');
            
            const dropdown = e.target.closest('.dropdown');
            
            // Update the appropriate filter state and button
            if (filterType === 'status') {
                currentStatusFilter = filterValue;
                updateFilterButton('statusFilterBtn', filterValue === 'all' ? 'Status: All' : `Status: ${filterValue}`);
            }
            
            // Apply all filters
            applyAllFilters();
            
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
        
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset button texts
        updateFilterButton('statusFilterBtn', 'Status: All');
        
        // Apply filters (which will show all)
        applyAllFilters();
        
        showToast('All filters have been reset', 'success');
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

    // Apply all filters (search + status)
    function applyAllFilters() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const tbody = document.querySelector('#vehicleTable tbody');
        const vehicleRows = Array.from(document.querySelectorAll('#vehicleTable tbody tr.intro-x'));
        
        if (vehicleRows.length === 0) return;
        
        let visibleCount = 0;
        
        vehicleRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const rowStatus = row.getAttribute('data-status');
            
            // Check search match
            const matchesSearch = searchTerm === '' || text.includes(searchTerm);
            
            // Check status match
            const matchesStatus = currentStatusFilter === 'all' || rowStatus === currentStatusFilter;
            
            // Show/hide row based on both filters
            if (matchesSearch && matchesStatus) {
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
        updateNoResultsMessage(searchTerm, currentStatusFilter, visibleCount, vehicleRows.length);
    }

    // Update no results message
    function updateNoResultsMessage(searchTerm, statusFilter, visibleCount, totalRows) {
        const tbody = document.querySelector('#vehicleTable tbody');
        let noDataRow = tbody?.querySelector('tr.no-data-found');
        
        // Remove existing no data row if it exists
        if (noDataRow) {
            noDataRow.remove();
        }
        
        // Check if we should show "no results" message
        const hasActiveFilters = searchTerm !== '' || currentStatusFilter !== 'all';
        
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
                        <div class="font-medium">No vehicles found</div>
                        <div class="text-sm">No vehicles match your current filters. Try adjusting your filters.</div>
                    </div>
                </td>
            `;
            tbody.appendChild(noDataRow);
        }
    }

    // Toast notification function
    function showToast(message, type = 'success') {
        const toastId = type === 'success' ? 'vehicle_toast_success' : 'vehicle_toast_error';
        
        if (type === 'error') {
            const errorMessageSlot = document.getElementById('vehicle-error-message-slot');
            if (errorMessageSlot) {
                errorMessageSlot.textContent = message;
            }
        }
        
        // Use your notification-toast component's show function
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
});