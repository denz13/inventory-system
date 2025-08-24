document.addEventListener('DOMContentLoaded', function () {
    var addForm = document.getElementById('createVehicleForm');
    var table = document.getElementById('vehicleTable');
    var editForm = document.getElementById('editVehicleForm');

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
                    document.getElementById('editTypeOfVehicle').value = data.data.type_of_vehicle || '';
                    
                    // Check if we have the nested data structure
                    if (data.data.supporting_documents && data.data.supporting_documents.vehicle_details) {
                        console.log('Found nested structure:', data.data.supporting_documents.vehicle_details);
                        document.getElementById('editPlateNumber').value = data.data.supporting_documents.vehicle_details.plate_number || '';
                        document.getElementById('editVehicleModel').value = data.data.supporting_documents.vehicle_details.vehicle_model || '';
                        document.getElementById('editOrNo').value = data.data.supporting_documents.vehicle_details.or_no || '';
                        document.getElementById('editCrNo').value = data.data.supporting_documents.vehicle_details.cr_no || '';
                        document.getElementById('editColorOfVehicle').value = data.data.supporting_documents.vehicle_details.color_of_vehicle || '';
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
                        }
                    }
                    
                    // Handle current file display
                    const currentFileDiv = document.getElementById('currentFileInfo');
                    if (data.data.supporting_documents && data.data.supporting_documents.supporting_documents_attachments) {
                        const fileName = data.data.supporting_documents.supporting_documents_attachments.split('/').pop();
                        currentFileDiv.innerHTML = `Current file: ${fileName}`;
                        currentFileDiv.style.display = 'block';
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
            const status = vehicle.status || 'N/A';
            const dateCreated = vehicle.created_at ? new Date(vehicle.created_at).toLocaleString() : 'N/A';
            const supportingDoc = vehicle.supporting_documents?.supporting_documents_attachments ? 
                `<a href="/storage/${vehicle.supporting_documents.supporting_documents_attachments}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">View Document</a>` : 
                'No file uploaded';

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
                        <label class="form-label">Owner</label>
                        <input type="text" class="form-control" value="${userName}" readonly>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="form-label">Status</label>
                        <input type="text" class="form-control" value="${status}" readonly>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="form-label">Supporting Documents</label>
                        <div class="form-control bg-slate-50">${supportingDoc}</div>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <label class="form-label">Date Created</label>
                        <input type="text" class="form-control" value="${dateCreated}" readonly>
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

    // Edit form submission
    if (editForm) {
        editForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const id = document.getElementById('editVehicleId').value;
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
        });
    }

    // File input change handlers
    const createFileInput = document.getElementById('createSupportingDocuments');
    if (createFileInput) {
        createFileInput.addEventListener('change', function() {
            const file = this.files[0];
            const fileInfo = document.getElementById('fileInfo');
            if (file && fileInfo) {
                fileInfo.innerHTML = `Selected file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                fileInfo.style.display = 'block';
            } else if (fileInfo) {
                fileInfo.style.display = 'none';
            }
        });
    }
    
    const editFileInput = document.getElementById('editSupportingDocumentsAttachments');
    if (editFileInput) {
        editFileInput.addEventListener('change', function() {
            const file = this.files[0];
            const fileInfo = document.getElementById('currentFileInfo');
            if (file && fileInfo) {
                fileInfo.innerHTML = `New file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                fileInfo.style.display = 'block';
            }
        });
    }

    // Search functionality
    const searchInput = document.querySelector('input[placeholder="Search..."]');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase();
                const rows = document.querySelectorAll('#vehicleTable tbody tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }, 300);
        });
    }

    // Status filter functionality
    const filterDropdown = document.querySelector('[data-filter]');
    if (filterDropdown) {
        document.addEventListener('click', function(e) {
            if (e.target.matches('[data-filter]')) {
                const filterValue = e.target.getAttribute('data-filter');
                const rows = document.querySelectorAll('#vehicleTable tbody tr');
                
                rows.forEach(row => {
                    if (filterValue === 'all') {
                        row.style.display = '';
                    } else {
                        const statusCell = row.querySelector('td:nth-child(4)'); // Adjust based on status column
                        if (statusCell && statusCell.textContent.toLowerCase().includes(filterValue.toLowerCase())) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    }
                });
            }
        });
    }
});