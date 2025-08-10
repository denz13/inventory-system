$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

let global_payroll_id;
let currentEmployeeId = null;
let currentPayrollId = null;
let currentNature = null;

$(document).ready(function() {
    const currentURL = window.location.href;
    const parts = currentURL.split('/');
    global_payroll_id = parts[parts.length - 1];

    console.log("Payroll ID:", global_payroll_id); // Debug log
    loadPayrollDetails(global_payroll_id);

    $(document).on('click', '.items-link', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const userId = $(this).data('user-id');
        const nature = $(this).data('nature');
        const employeeName = $(this).data('employee-name');

        loadItems(userId, nature, global_payroll_id);
    });

    $('#save-items').on('click', function() {
        const items = [];
        $('.item-amount-input').each(function() {
            items.push({
                id: $(this).data('item-id'),
                amount: $(this).val()
            });
        });

        const userId = $('#edit-items-modal').data('user-id');
        saveItems(items, userId);
    });

    // Add handler for delete employee button
    $(document).on('click', '.delete-employee', function(e) {
        e.preventDefault();
        const userId = $(this).data('user-id');
        const employeeName = $(this).data('employee-name');
        
        if (confirm(`Are you sure you want to remove ${employeeName} from this payroll?`)) {
            $.ajax({
                url: '/payroll-new/ajax/delete-employee',
                type: 'POST',
                data: {
                    user_id: userId,
                    payroll_id: global_payroll_id,
                    '_token': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    if (response.success) {
                        __notif_show(1, 'Success', 'Employee removed from payroll successfully!');
                        loadPayrollDetails(global_payroll_id);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error removing employee:', error);
                    __notif_show(0, 'Error', 'Failed to remove employee from payroll');
                }
            });
        }
    });

    // Add button click handler
    $(document).on('click', '#add-employee-btn', function() {
        console.log('Add Employee button clicked'); // Debug log
        loadAvailableEmployees();
        const el = document.querySelector("#add-employee-modal");
        const modal = tailwind.Modal.getOrCreateInstance(el);
        modal.show();
    });
});

var global_user_id = '';
var global_nature = '';

function loadPayrollDetails(payrollId) {
    $.ajax({
        url: '/payroll-new/ajax/load-payroll-details',
        type: 'POST',
        data: {
            id: payrollId,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(data) {
            let tbody = '';
            data.forEach((dt, index) => {
                tbody += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${dt.user_name}</td>
                        <td>${dt.bsalary}</td>
                        <td>${dt.hourly}</td>
                        <td>
                            <a href="javascript:;" onclick="editGrossSalary('${dt.user_id}', '${payrollId}', '${dt.user_name}', '${dt.gsalary}')" class="text-primary">
                                ${dt.gsalary}
                            </a>
                        </td>
                        <td>${dt.late}</td>
                        <td>
                            <a href="javascript:;" class="items-link text-primary" 
                               data-user-id="${dt.user_id}" 
                               data-nature="Addition" 
                               data-employee-name="${dt.user_name}">
                                ${dt.addition}
                            </a>
                        </td>
                        <td>
                            <a href="javascript:;" class="items-link text-primary" 
                               data-user-id="${dt.user_id}" 
                               data-nature="Deduction" 
                               data-employee-name="${dt.user_name}">
                                ${dt.deduction}
                            </a>
                        </td>
                        <td>
                            <a href="javascript:;" class="items-link text-primary" 
                               data-user-id="${dt.user_id}" 
                               data-nature="Contribution" 
                               data-employee-name="${dt.user_name}">
                                ${dt.contribution}
                            </a>
                        </td>
                        <td>
                            <input type="text" 
                                class="form-control tax-input" 
                                value="${dt.taxes}"
                                data-user-id="${dt.user_id}"
                                data-payroll-id="${payrollId}"
                                onkeypress="return handleTaxKeyPress(event, this)">
                        </td>
                        <td>${dt.net}</td>
                        <td>
                            <div class="flex justify-center items-center">
                                <button class="btn btn-danger btn-sm" onclick="deleteEmployee('${dt.user_id}', '${payrollId}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
            $('#payroll_details_body').html(tbody);

            // Reinitialize click handlers for items links
            $('.items-link').on('click', function(e) {
                e.preventDefault();
                const userId = $(this).data('user-id');
                const nature = $(this).data('nature');
                const employeeName = $(this).data('employee-name');
                loadItems(userId, nature, payrollId);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error loading payroll details:', error);
            __notif_show(0, 'Error', 'Failed to load payroll details');
        }
    });
}

function initializeTaxInputs() {
    $('.tax-input').on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            e.preventDefault();
            const userId = $(this).data('user-id');
            const newTax = parseFloat($(this).val().replace(/[^0-9.-]+/g, '')) || 0;
            const originalTax = parseFloat($(this).data('original-value')) || 0;

            if (newTax !== originalTax) {
                updateTax(userId, newTax);
            }
        }
    }).on('blur', function() {
        // Format the number when the input loses focus
        const value = parseFloat($(this).val().replace(/[^0-9.-]+/g, '')) || 0;
        $(this).val(formatCurrency(value));
    }).on('focus', function() {
        // Remove formatting when input gets focus
        const value = parseFloat($(this).val().replace(/[^0-9.-]+/g, '')) || 0;
        $(this).val(value);
    });
}

function updateTax(userId, newTax) {
    $.ajax({
        url: '/payroll-new/ajax/update-tax',
        type: 'POST',
        data: {
            user_id: userId,
            tax: newTax,
            payroll_id: global_payroll_id,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            if (response.success) {
                __notif_show(1, 'Success', 'Tax updated successfully!');
                // Reload the entire row to get updated calculations
                loadPayrollDetails(global_payroll_id);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error updating tax:', error);
            __notif_show(0, 'Error', 'Failed to update tax');
        }
    });
}

function initializeEventListeners() {
    $('.hours-input').on('change', function() {
        const userId = $(this).data('user-id');
        const hours = parseFloat($(this).val()) || 0;
        const baseSalary = parseFloat($(this).closest('tr').find('.base-salary-link').text().replace(/[^0-9.-]+/g, ''));
        
        const grossSalary = baseSalary * hours;
        $(this).closest('tr').find('.gross-salary-link').text(formatCurrency(grossSalary));

        updateHours(userId, hours, grossSalary);
    });

    $('.gross-salary-link').on('click', function() {
        const userId = $(this).data('user-id');
        const grossSalary = $(this).data('gross-salary');
        const employeeName = $(this).data('employee-name');

        $('#gross-salary-input').val(grossSalary);
        $('#employee-name').text(employeeName);
        $('#save-gross-salary').data('user-id', userId);
    });

    $('#save-gross-salary').on('click', function() {
        const userId = $(this).data('user-id');
        const grossSalary = parseFloat($('#gross-salary-input').val()) || 0;

        updateGrossSalary(userId, grossSalary);
        $('#edit-gross-salary-modal').modal('hide');
    });

    $('.items-link').on('click', function() {
        const userId = $(this).data('user-id');
        const nature = $(this).data('nature');
        const employeeName = $(this).data('employee-name');

        $('#item-nature-label').text(nature);
        $('#item-employee-name').text(employeeName);

        loadItemsForEmployee(userId, nature);
    });

    $('#save-items').on('click', function() {
        const items = [];
        $('.item-amount-input').each(function() {
            items.push({
                id: $(this).data('item-id'),
                amount: $(this).val()
            });
        });

        saveItems(items);
    });
}

function updateHours(userId, hours, grossSalary) {
    $.ajax({
        url: '/payroll-new/ajax/update-hours',
        type: 'POST',
        data: {
            user_id: userId,
            hours: hours,
            gross_salary: grossSalary,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            if (response.success) {
                __notif_show(1, 'Success', 'Hours updated successfully!');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error updating hours:', error);
            __notif_show(0, 'Error', 'Failed to update hours');
        }
    });
}

function updateGrossSalary(userId, payrollId, newGrossSalary) {
    $.ajax({
        url: '/payroll-new/ajax/update-gross',
        type: 'POST',
        data: {
            user_id: userId,
            payroll_id: payrollId,
            gross_salary: newGrossSalary,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            if (response.success) {
                __notif_show(1, 'Success', 'Gross salary updated successfully');
                // Update only the specific row
                const rowIndex = $(`#employee-row-${userId}`).index() + 1;
                const updatedRow = updateTableRow(response.data, rowIndex);
                $(`#employee-row-${userId}`).replaceWith(updatedRow);
                
                // Reinitialize click handlers for the updated row
                $(`#employee-row-${userId} .items-link`).on('click', function(e) {
                    e.preventDefault();
                    const userId = $(this).data('user-id');
                    const nature = $(this).data('nature');
                    const employeeName = $(this).data('employee-name');
                    loadItems(userId, nature, payrollId);
                });
            } else {
                __notif_show(0, 'Error', response.message || 'Failed to update gross salary');
            }
        },
        error: function(xhr) {
            console.error('Error updating gross salary:', xhr.responseText);
            __notif_show(0, 'Error', 'Failed to update gross salary');
        }
    });
}

function formatCurrency(value) {
    if (!value) return '0.00';
    return parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function initializeEventHandlers() {
    $(document).on('keydown', '#item_modal input[type="text"]', function(event) {
        if (event.which === 13) {
            const item_value = $(this).val();
            const item_name = $(this).data('item_name');
            updateItemAmount(item_name, global_user_id, item_value, global_payroll_id);
        }
    });
}

function updateItemAmount(item_name, user_id, amount, pr_id) {
    $.ajax({
        url: `/payroll-new/ajax/update-item`,
        method: 'POST',
        data: { 
            item_name: item_name, 
            user_id: user_id, 
            amount: amount, 
            pr_id: pr_id,
            '_token': $('meta[name="csrf-token"]').attr('content'),
        },
        success: function(response) {
            if (response.success) {
                __notif_show(1, 'Success', 'Amount Successfully Updated!');
                // Update only the specific row
                const rowIndex = $(`#employee-row-${user_id}`).index() + 1;
                const updatedRow = updateTableRow(response.data, rowIndex);
                $(`#employee-row-${user_id}`).replaceWith(updatedRow);
                
                // Reinitialize click handlers for the updated row
                $(`#employee-row-${user_id} .items-link`).on('click', function(e) {
                    e.preventDefault();
                    const userId = $(this).data('user-id');
                    const nature = $(this).data('nature');
                    const employeeName = $(this).data('employee-name');
                    loadItems(userId, nature, pr_id);
                });
            }
        }
    });
}

// Function to delete employee
function delete_employee(user_id, payroll_id) {
    $.ajax({
        url: `/payroll-new/ajax/delete-employee`,
        method: 'POST',
        data: {
            user_id: user_id,
            payroll_id: payroll_id,
            '_token': $('meta[name="csrf-token"]').attr('content'),
        },
        success: function(response) {
            if (response.success) {
                __notif_show(1, 'Success', 'Employee was successfully removed!');
                loadPayrollDetails(payroll_id);
            }
        }
    });
}

function loadItemsForEmployee(userId, nature) {
    $.ajax({
        url: '/payroll-new/ajax/load-items',
        type: 'POST',
        data: {
            user_id: userId,
            nature: nature,
            payroll_id: global_payroll_id,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            const container = $('#items-container');
            container.empty();

            if (response.length === 0) {
                container.append('<div class="text-center">No items found</div>');
                return;
            }

            response.forEach(item => {
                container.append(`
                    <div class="mb-3">
                        <label class="form-label">${item.item_name}</label>
                        <input type="number" 
                               class="form-control item-amount-input" 
                               data-item-id="${item.id}"
                               value="${item.item_amount}"
                               step="0.01">
                    </div>
                `);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error loading items:', error);
            __notif_show(0, 'Error', 'Failed to load items');
        }
    });
}

function saveItems(userId, payrollId) {
    const items = [];
    // Collect all item amounts from the current modal
    $('#itemsModalBody .item-amount-input').each(function() {
        items.push({
            id: $(this).data('item-id'),
            amount: $(this).val()
        });
    });

    $.ajax({
        url: '/payroll-new/ajax/save-items',
        type: 'POST',
        data: {
            user_id: userId,
            payroll_id: payrollId,
            items: items,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            if (response.success) {
                __notif_show(1, 'Success', 'Items saved successfully');
                
                // Find the existing row and get its number
                const existingRow = $('tr').filter(function() {
                    return $(this).find('td:first').text().trim() !== '' && 
                           $(this).find(`[data-user-id="${userId}"]`).length > 0;
                });

                if (existingRow.length) {
                    // Get the row number from the first column
                    const rowNumber = existingRow.find('td:first').text();
                    
                    // Generate new row HTML with the same row number
                    const newRow = updateTableRow(response.data, rowNumber);
                    
                    // Replace the existing row with the new one
                    existingRow.replaceWith(newRow);
                    
                    // Reinitialize event handlers for the new row
                    initializeRowEventHandlers(userId, payrollId);
                } else {
                    console.error('Row not found for user ID:', userId);
                    // Fallback: reload the entire table
                    loadPayrollDetails(payrollId);
                }

                // Close the modal
                const modal = document.querySelector("#itemsModal");
                const modalInstance = tailwind.Modal.getOrCreateInstance(modal);
                modalInstance.hide();
            } else {
                __notif_show(0, 'Error', response.message || 'Failed to save items');
            }
        },
        error: function(xhr) {
            console.error('Error saving items:', xhr.responseText);
            __notif_show(0, 'Error', 'Failed to save items');
        }
    });
}

// Add this helper function to initialize event handlers for a specific row
function initializeRowEventHandlers(userId, payrollId) {
    // Initialize items-link click handlers
    $(`tr[data-user-id="${userId}"] .items-link`).on('click', function(e) {
        e.preventDefault();
        const nature = $(this).data('nature');
        const employeeName = $(this).data('employee-name');
        loadItems(userId, nature, payrollId);
    });

    // Initialize tax input handlers
    $(`tr[data-user-id="${userId}"] .tax-input`).on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            e.preventDefault();
            const newTax = parseFloat($(this).val().replace(/[^0-9.-]+/g, '')) || 0;
            updateTax(userId, newTax, payrollId);
        }
    });

    // Initialize any other event handlers for row elements
    $(`tr[data-user-id="${userId}"] .gross-salary-link`).on('click', function(e) {
        e.preventDefault();
        const grossSalary = $(this).text().replace(/[^0-9.-]+/g, '');
        const employeeName = $(this).data('employee-name');
        editGrossSalary(userId, payrollId, employeeName, grossSalary);
    });
}

// Update the updateTableRow function to use the original row number
function updateTableRow(data, rowNumber) {
    return `
        <tr data-user-id="${data.user_id}">
            <td>${rowNumber}</td>
            <td>${data.user_name}</td>
            <td>${data.bsalary}</td>
            <td>${data.hourly}</td>
            <td>
                <a href="javascript:;" class="gross-salary-link text-primary" 
                   data-user-id="${data.user_id}"
                   data-employee-name="${data.user_name}"
                   onclick="editGrossSalary('${data.user_id}', '${data.payroll_id}', '${data.user_name}', '${data.gsalary}')">
                    ${data.gsalary}
                </a>
            </td>
            <td>${data.late}</td>
            <td>
                <a href="javascript:;" class="items-link text-primary" 
                   data-user-id="${data.user_id}" 
                   data-nature="Addition" 
                   data-employee-name="${data.user_name}">
                    ${data.addition}
                </a>
            </td>
            <td>
                <a href="javascript:;" class="items-link text-primary" 
                   data-user-id="${data.user_id}" 
                   data-nature="Deduction" 
                   data-employee-name="${data.user_name}">
                    ${data.deduction}
                </a>
            </td>
            <td>
                <a href="javascript:;" class="items-link text-primary" 
                   data-user-id="${data.user_id}" 
                   data-nature="Contribution" 
                   data-employee-name="${data.user_name}">
                    ${data.contribution}
                </a>
            </td>
            <td>
                <input type="text" 
                    class="form-control tax-input" 
                    value="${data.taxes}"
                    data-user-id="${data.user_id}"
                    data-payroll-id="${data.payroll_id}"
                    onkeypress="return handleTaxKeyPress(event, this)">
            </td>
            <td>${data.net}</td>
            <td>
                <div class="flex justify-center items-center">
                    <button class="btn btn-danger btn-sm" onclick="deleteEmployee('${data.user_id}', '${data.payroll_id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

let currentPage = 1;
const perPage = 10;

function loadAvailableEmployees(page = 1, search = '') {
    $.ajax({
        url: '/payroll-new/ajax/load-available-employees',
        type: 'POST',
        data: {
            payroll_id: global_payroll_id,
            search: search,
            page: page,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            console.log('Available employees:', response); // Debug log
            
            if (!response || !response.data) {
                $('#available-employees-body').html('<tr><td colspan="4" class="text-center">No data available</td></tr>');
                return;
            }

            let tbody = '';
            response.data.forEach((emp, index) => {
                const rowNum = (page - 1) * 10 + index + 1;
                tbody += `
                    <tr>
                        <td>${rowNum}</td>
                        <td>${emp.employee_name || ''}</td>
                        <td>${emp.position || ''}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" 
                                    onclick="addEmployee('${emp.agency_id}')"
                                    type="button">
                                Add
                            </button>
                        </td>
                    </tr>
                `;
            });

            $('#available-employees-body').html(tbody);
            
            // Update pagination if needed
            // ... rest of the pagination code ...
        },
        error: function(xhr) {
            console.error('Error loading employees:', xhr.responseText);
            $('#available-employees-body').html('<tr><td colspan="4" class="text-center">Error loading employees</td></tr>');
        }
    });
}

function updatePagination(response, currentPage, search) {
    if (response.total > 0) {
        let pagination = '';
        const totalPages = response.last_page;
        
        // Previous button
        pagination += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="javascript:void(0)" 
                   onclick="${currentPage === 1 ? '' : `loadAvailableEmployees(${currentPage - 1}, '${search}')`}">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

        // Calculate page range
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Adjust start page if we're near the end
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        // First page
        if (startPage > 1) {
            pagination += `
                <li class="page-item">
                    <a class="page-link" href="javascript:void(0)" 
                       onclick="loadAvailableEmployees(1, '${search}')">1</a>
                </li>
            `;
            if (startPage > 2) {
                pagination += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pagination += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="javascript:void(0)" 
                       onclick="loadAvailableEmployees(${i}, '${search}')">${i}</a>
                </li>
            `;
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pagination += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            pagination += `
                <li class="page-item">
                    <a class="page-link" href="javascript:void(0)" 
                       onclick="loadAvailableEmployees(${totalPages}, '${search}')">${totalPages}</a>
                </li>
            `;
        }

        // Next button
        pagination += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="javascript:void(0)" 
                   onclick="${currentPage === totalPages ? '' : `loadAvailableEmployees(${currentPage + 1}, '${search}')`}">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        $('#pagination').html(pagination);
        $('#total-records').text(`Total: ${response.total} employees`);
    } else {
        $('#pagination').empty();
        $('#total-records').text('No records found');
    }
}

// Add search input handler
$('#employee-search').on('keyup', function(e) {
    // If Enter key is pressed (key code 13)
    if (e.keyCode === 13) {
        e.preventDefault(); // Prevent form submission if within a form
        const searchTerm = $(this).val() || ''; // Default to empty string if undefined
        currentPage = 1; // Reset to first page when searching
        loadAvailableEmployees(currentPage, searchTerm);
    }
});

function addItemModal(userId, payrollId) {
    // Hide the items modal first
    const itemsModalEl = document.querySelector("#itemsModal");
    const itemsModal = tailwind.Modal.getOrCreateInstance(itemsModalEl);
    itemsModal.hide();

    // Wait a bit before showing the add item modal
    setTimeout(() => {
        // Reset form
        $('#addItemForm')[0].reset();
        
        // Store user and payroll IDs as data attributes
        $('#addItemModal').data('userId', userId);
        $('#addItemModal').data('payrollId', payrollId);
        
        // Show the modal using Tailwind
        const el = document.querySelector("#addItemModal");
        const modal = tailwind.Modal.getOrCreateInstance(el);
        modal.show();
    }, 200);
}

function saveNewItem() {
    const userId = $('#addItemModal').data('userId');
    const payrollId = $('#addItemModal').data('payrollId');
    
    // Validate form
    if (!$('#addItemForm')[0].checkValidity()) {
        $('#addItemForm')[0].reportValidity();
        return;
    }
    
    const data = {
        item_name: $('#item_name').val(),
        item_nature: $('#item_nature').val(),
        item_calculate: $('#item_calculate').val(),
        item_amount: $('#item_amount').val(),
        employee_id: userId,
        payroll_id: payrollId
    };

    $.ajax({
        url: '/payroll-new/ajax/add-payroll-item',
        type: 'POST',
        data: data,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            if (response.success) {
                __notif_show(1, 'Success', 'Item added successfully');
                // Hide add item modal
                $('#addItemModal').modal('hide');
                // Reload items list
                setTimeout(() => {
                    loadItems(userId, payrollId);
                }, 200);
            } else {
                __notif_show(0, 'Error', response.message);
            }
        },
        error: function(xhr) {
            __notif_show(0, 'Error', 'Failed to add item');
        }
    });
}

// Update the loadItems function to include the save button handler
function loadItems(userId, nature, payrollId) {
    $.ajax({
        url: '/payroll-new/ajax/load-items',
        type: 'POST',
        data: {
            user_id: userId,
            nature: nature,
            payroll_id: payrollId,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(items) {
            let html = `
                <div class="mb-3">
                    <button class="btn btn-primary" onclick="openAddItemModal('${userId}', '${payrollId}', '${nature}')">
                        Add ${nature}
                    </button>
                </div>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Amount</th>
                            <th>Nature</th>
                            <th>Calculate On</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>`;
            
            items.forEach(function(item) {
                html += `
                    <tr>
                        <td>${item.item_name}</td>
                        <td>
                            <input type="number" 
                                class="form-control item-amount-input" 
                                value="${item.item_amount}"
                                data-item-id="${item.id}">
                        </td>
                        <td>${item.item_nature}</td>
                        <td>${item.item_calculate}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" 
                                onclick="deleteItem('${item.id}', '${userId}', '${payrollId}', '${nature}')">
                                Delete
                            </button>
                        </td>
                    </tr>`;
            });
            
            html += `</tbody></table>
                    <div class="mt-3">
                        <button class="btn btn-primary" onclick="saveItems('${userId}', '${payrollId}', '${nature}')">
                            Save Changes
                        </button>
                    </div>`;
            
            $('#itemsModalBody').html(html);
            
            const el = document.querySelector("#itemsModal");
            const modal = tailwind.Modal.getOrCreateInstance(el);
            modal.show();
        },
        error: function(xhr, status, error) {
            console.error('Error loading items:', error);
            __notif_show(0, 'Error', 'Failed to load items');
        }
    });
}

function openAddItemModal(userId, payrollId, nature) {
    console.log('Opening add item modal:', { userId, payrollId, nature });
    
    currentEmployeeId = userId;
    currentPayrollId = payrollId;
    currentNature = nature;

    // Close the items modal first
    const itemsModal = document.querySelector("#itemsModal");
    const itemsModalInstance = new bootstrap.Modal(itemsModal);
    itemsModalInstance.hide();

    // Update the modal title
    $('#addItemModalTitle').text(`Add ${nature}`);

    // Show the add item modal
    const addItemModal = document.querySelector("#addItemModal");
    const addItemModalInstance = new bootstrap.Modal(addItemModal);
    addItemModalInstance.show();

    // Load available items
    loadAvailableItems(nature);
}

// Fix the loadAvailableItems function declaration
function loadAvailableItems(nature) {
    $.ajax({
        url: '/payroll-new/ajax/load-available-items',
        type: 'POST',
        data: {
            nature: nature,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            let itemsHtml = '';
            response.forEach(function(item) {
                itemsHtml += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.nature}</td>
                        <td>${item.default_rate}</td>
                        <td>${item.calculate_on}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" 
                                onclick="addItemToPayroll(${item.id}, '${item.name}', ${item.default_rate})">
                                Add
                            </button>
                        </td>
                    </tr>
                `;
            });
            $('#availableItemsTable tbody').html(itemsHtml);
        },
        error: function(xhr) {
            console.error('Error loading available items:', xhr.responseText);
            __notif_show(0, 'Error', 'Failed to load available items');
        }
    });
}

function addItemToPayroll(itemId) {
    const amount = $(`input[data-item-id="${itemId}"]`).val();
    
    $.ajax({
        url: '/payroll-new/ajax/add-item-to-payroll',
        type: 'POST',
        data: {
            item_id: itemId,
            user_id: currentEmployeeId,
            payroll_id: currentPayrollId,
            amount: amount,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            if (response.success) {
                __notif_show(1, 'Success', 'Item added successfully');
                
                // Close add item modal and reopen items modal
                const addItemModal = document.querySelector("#addItemModal");
                const addItemModalInstance = tailwind.Modal.getOrCreateInstance(addItemModal);
                addItemModalInstance.hide();

                // Reload the items list
                loadItems(currentEmployeeId, currentNature, currentPayrollId);
            } else {
                __notif_show(0, 'Error', response.message || 'Failed to add item');
            }
        },
        error: function(xhr) {
            console.error('Error adding item:', xhr.responseText);
            __notif_show(0, 'Error', 'Failed to add item to payroll');
        }
    });
}

// Function to open the gross salary modal
function editGrossSalary(userId, payrollId, employeeName, currentGross) {
    console.log('Editing gross salary:', { userId, payrollId, employeeName, currentGross });
    
    // Set the employee name in the modal
    $('#employee-name').text(employeeName);
    
    // Set the current gross salary in the input
    $('#gross-salary-input').val(currentGross);
    
    // Store the user ID and payroll ID as data attributes
    $('#gross-salary-input').data('user-id', userId);
    $('#gross-salary-input').data('payroll-id', payrollId);
    
    // Show the modal using Tailwind
    const modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#edit-gross-salary-modal"));
    modal.show();
}

// Add click handler for the save button
$(document).on('click', '#save-gross-salary', function() {
    const userId = $('#gross-salary-input').data('user-id');
    const payrollId = $('#gross-salary-input').data('payroll-id');
    const newGrossSalary = $('#gross-salary-input').val();

    console.log('Saving gross salary:', { userId, payrollId, newGrossSalary });

    $.ajax({
        url: '/payroll-new/ajax/update-gross',
        type: 'POST',
        data: {
            user_id: userId,
            payroll_id: payrollId,
            gross_salary: newGrossSalary,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            if (response.success) {
                __notif_show(1, 'Success', 'Gross salary updated successfully');
                // Close the modal using Tailwind
                const modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#edit-gross-salary-modal"));
                modal.hide();
                // Reload the payroll details to reflect the changes
                loadPayrollDetails(payrollId);
            } else {
                __notif_show(0, 'Error', response.message || 'Failed to update gross salary');
            }
        },
        error: function(xhr) {
            console.error('Error updating gross salary:', xhr.responseText);
            __notif_show(0, 'Error', 'Failed to update gross salary');
        }
    });
}); 

// Add this function to handle tax input
function handleTaxKeyPress(event, input) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const userId = $(input).data('user-id');
        const payrollId = $(input).data('payroll-id');
        const newTax = $(input).val();

        updateTax(userId, payrollId, newTax);
        return false;
    }
    // Only allow numbers and decimal point
    return (event.charCode >= 48 && event.charCode <= 57) || event.charCode === 46;
}

function updateTax(userId, payrollId, tax) {
    $.ajax({
        url: '/payroll-new/ajax/update-tax',
        type: 'POST',
        data: {
            user_id: userId,
            payroll_id: payrollId,
            tax: tax,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            if (response.success) {
                __notif_show(1, 'Success', 'Tax updated successfully');
                // Reload the payroll details to reflect all changes
                loadPayrollDetails(payrollId);
            } else {
                __notif_show(0, 'Error', response.message || 'Failed to update tax');
            }
        },
        error: function(xhr) {
            console.error('Error updating tax:', xhr.responseText);
            __notif_show(0, 'Error', 'Failed to update tax');
        }
    });
} 

function addEmployee(employeeId) {
    console.log('Adding employee with ID:', employeeId); // Debug log
    
    $.ajax({
        url: '/payroll-new/ajax/insert-employee',
        type: 'POST',
        data: {
            id: employeeId,
            payroll_id: global_payroll_id,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        beforeSend: function(xhr) {
            console.log('Sending data:', { // Debug log
                id: employeeId,
                payroll_id: global_payroll_id
            });
        },
        success: function(response) {
            console.log('Response:', response); // Debug log
            if (response.success) {
                __notif_show(1, 'Success', 'Employee added to payroll successfully!');
                const modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#add-employee-modal"));
                modal.hide();
                loadPayrollDetails(global_payroll_id);
            } else {
                __notif_show(0, 'Error', response.message || 'Failed to add employee');
            }
        },
        error: function(xhr) {
            console.error('Error response:', xhr.responseText); // Debug log
            __notif_show(0, 'Error', 'Failed to add employee to payroll');
        }
    });
} 

function deleteEmployee(userId, payrollId) {
    const existingRow = $('tr').filter(function() {
        return $(this).find('td:first').text().trim() !== '' && 
               $(this).find(`[data-user-id="${userId}"]`).length > 0;
    });

    const employeeName = existingRow.find('td:eq(1)').text(); // Get employee name from second column

    if (confirm(`Are you sure you want to remove ${employeeName} from this payroll?`)) {
        $.ajax({
            url: '/payroll-new/ajax/delete-employee',
            type: 'POST',
            data: {
                user_id: userId,
                payroll_id: payrollId,
                '_token': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                if (response.success) {
                    __notif_show(1, 'Success', 'Employee removed from payroll successfully!');
                    
                    // Remove the row with animation
                    existingRow.fadeOut(400, function() {
                        // After fade out, remove the row
                        $(this).remove();
                        
                        // Update the row numbers for remaining rows
                        $('#payroll_details_body tr').each(function(index) {
                            $(this).find('td:first').text(index + 1);
                        });
                    });
                } else {
                    __notif_show(0, 'Error', response.message || 'Failed to remove employee');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error removing employee:', error);
                __notif_show(0, 'Error', 'Failed to remove employee from payroll');
            }
        });
    }
} 

function loadAvailableItems(nature) {
    $.ajax({
        url: '/payroll-new/ajax/load-available-items',
        type: 'POST',
        data: {
            nature: nature,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            let itemsHtml = '';
            response.forEach(function(item) {
                itemsHtml += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.nature}</td>
                        <td>${item.default_rate}</td>
                        <td>${item.calculate_on}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" 
                                onclick="addItemToPayroll(${item.id}, '${item.name}', ${item.default_rate})">
                                Add
                            </button>
                        </td>
                    </tr>
                `;
            });
            $('#availableItemsTable tbody').html(itemsHtml);
        },
        error: function(xhr) {
            console.error('Error loading available items:', xhr.responseText);
            __notif_show(0, 'Error', 'Failed to load available items');
        }
    });
}

function addItemToPayroll(itemId, itemName, defaultRate) {
    const amount = defaultRate;
    
    $.ajax({
        url: '/payroll-new/ajax/add-item-to-payroll',
        type: 'POST',
        data: {
            item_id: itemId,
            user_id: currentEmployeeId,
            payroll_id: currentPayrollId,
            amount: amount,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            if (response.success) {
                __notif_show(1, 'Success', 'Item added successfully');
                closeAddItemModal();
                // Reload the items in the main modal
                loadItems(currentEmployeeId, currentNature, currentPayrollId);
            } else {
                __notif_show(0, 'Error', response.message || 'Failed to add item');
            }
        },
        error: function(xhr) {
            console.error('Error adding item:', xhr.responseText);
            __notif_show(0, 'Error', 'Failed to add item to payroll');
        }
    });
}

// Add this to your existing modal open handler
function openAddItemModal(userId, payrollId, nature) {
    console.log('Opening add item modal:', { userId, payrollId, nature });
    
    currentEmployeeId = userId;
    currentPayrollId = payrollId;
    currentNature = nature;

    // Close the items modal first
    const itemsModal = document.querySelector("#itemsModal");
    const itemsModalInstance = tailwind.Modal.getOrCreateInstance(itemsModal);
    itemsModalInstance.hide();

    // Update the modal title
    $('#addItemModalTitle').text(`Add ${nature}`);

    // Show the add item modal
    const addItemModal = document.querySelector("#addItemModal");
    const addItemModalInstance = tailwind.Modal.getOrCreateInstance(addItemModal);
    addItemModalInstance.show();

    // Load available items
    loadAvailableItems(nature);
} 

// Add the delete function
function deleteItem(itemId, userId, payrollId, nature) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    $.ajax({
        url: '/payroll-new/ajax/delete-item',
        type: 'POST',
        data: {
            item_id: itemId,
            user_id: userId,
            payroll_id: payrollId,
            '_token': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            if (response.success) {
                __notif_show(1, 'Success', 'Item deleted successfully');
                // Reload items
                loadItems(userId, nature, payrollId);
                // Reload main payroll details
                loadPayrollDetails(payrollId);
            } else {
                __notif_show(0, 'Error', response.message || 'Failed to delete item');
            }
        },
        error: function(xhr) {
            console.error('Error deleting item:', xhr.responseText);
            __notif_show(0, 'Error', 'Failed to delete item');
        }
    });
} 