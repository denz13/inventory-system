$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
let typingTimer;
const doneTypingInterval = 1000; // 1 second

$(document).ready(function () {

    fetch_CSC_ClearanceSignatories();
    fetch_Semestral_ClearanceSignatories();
    fetchEmployeeDataClearanceSignatories();
    fetchActiveYearAndSemester();
    fetchDesignations();
    fetchCreatedClearance();

    clearanceSetup();
    creationOfClearance();
    systemActiveSemesterAndSchoolYear();
    smartFilters();
});


/** FUNCTION FOR FETCHING CSC CLEARANCE SIGNATORIES */
function fetch_CSC_ClearanceSignatories(page, filters) {

    const createdClearanceTableBody = $('.csc_signatory_table tbody');
    const paginationId = $('#csc_signatory_pagination');
    const paginationSummaryId = $('#pagination_summary_csc_signatory');
    createdClearanceTableBody.empty(); // Clear the table body first
    let colspan = 4;

    $.ajax({
        url: '/clearance/load/csc-signatories?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {
            loadingSpinner(createdClearanceTableBody, colspan);
        },
        success: function (data) {
            if(data.signatory_details.length > 0 )
            {
                data.signatory_details.forEach(function (transaction) {

                    let signatory_type = '';
                    let designations = '';
                    if(transaction.designation)
                    {
                        designations = `<div class="font-medium whitespace-nowrap ml-2">${ transaction.designation }</div>`;
                    }else
                    {
                        designations = `<div class="text-xs text-danger whitespace-nowrap ml-2">Not set..</div>`;
                    }
                    // Create the HTML structure for each curriculum row
                    const transactionList = `
                     <tr class="intro-x">
                        <td class="w-40">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${ transaction.fullName }</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ transaction.employee_id }</div>
                        </td>
                        <td class="text-left w-40">
                            <input data-element="ext_${ transaction.signatory_id }" data-clearance-signatory-id="${ transaction.signatory_id }" type="text" class="form-control w-56 input_clearance_signatory_ext" placeholder="e.g. Ph.D, ITD, MSIT, MIT" value="${ transaction.extension }">
                        </td>
                        <td class="">
                           <div data-clearance-signatory-id="${ transaction.signatory_id }" data-clearance-type="CSC" class="flex cursor-pointer tbl_btn_edit_designation">
                            <a class="flex items-center" href="javascript:;"
                                data-clearance-signatory-id="${ transaction.signatory_id }"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="edit-3" data-lucide="edit-3" class="lucide lucide-edit-3 block mx-auto w-4 h-4 mr-1"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </a>
                            ${ designations }
                           </div>
                        </td>
                        <td class="table-report__action">
                            <div class="flex justify-center items-center">
                                 <a class="flex items-center text-danger btn_remove_csc_signatory" href="javascript:;"
                                    data-clearance-signatory-id="${ transaction.signatory_id }"
                                    data-employee-id="${ transaction.employee_id }"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    Remove
                                </a>
                            </div>
                        </td>
                     </tr>`;
                    createdClearanceTableBody.append(transactionList); // Append curriculum row to the table

                });
            }
            else
            {
                let message = 'No Data Found!.';
                clearanceSignatoriesNoResult(createdClearanceTableBody, message);
            }

            $('#loading-row').remove();
            updateClearanceOverviewPaginationLinks(data, paginationId, paginationSummaryId);
            $('#pagination_summary_signatoryList').text(data.summary);
        },
    });
}

/** FUNCTION FOR FETCHING SEMESTRAL CLEARANCE SIGNATORIES */
function fetch_Semestral_ClearanceSignatories(page, filters) {

    const semestralTableBody = $('.sem_signatory_table tbody');
    const paginationId = $('#sem_signatories_pagination');
    const paginationSummaryId = $('#pagination_summary_sem_clearance');
    semestralTableBody.empty(); // Clear the table body first
    let colspan = 4;

    $.ajax({
        url: '/clearance/load/semestral-signatories?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {
            loadingSpinner(semestralTableBody, colspan);
        },
        success: function (data) {
            if(data.signatory_details.length > 0 )
            {
                data.signatory_details.forEach(function (transaction) {

                    let signatory_type = '';
                    let designations = '';
                    let description  = '';

                    if(transaction.designation)
                    {
                        designations = `<div class="font-medium whitespace-nowrap ml-2">${ transaction.designation }</div>`;
                    }else
                    {
                        designations = `<div class="text-xs text-danger whitespace-nowrap ml-2">Not set..</div>`;
                    }

                    if(transaction.signatory_desc)
                    {
                        description = `<div class="font-medium whitespace-nowrap ml-2">${ transaction.signatory_desc }</div>`;
                    }
                    else
                    {
                        description = `<div class="text-xs text-slate-400 whitespace-nowrap ml-2">_ _</div>`;
                    }

                    // Create the HTML structure for each curriculum row
                    const transactionList = `
                     <tr class="intro-x">
                        <td class="w-40">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${ transaction.fullName }</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ transaction.employee_id }</div>
                        </td>
                        <td class="text-left w-40">
                            <input data-element="ext_${ transaction.signatory_id }" data-clearance-signatory-id="${ transaction.signatory_id }" type="text" class="form-control w-56 input_clearance_signatory_ext" placeholder="e.g. Ph.D, ITD, MSIT, MIT" value="${ transaction.extension }">
                        </td>
                        <td class="">
                           <div data-clearance-signatory-id="${ transaction.signatory_id }" data-clearance-type="SEM" class="flex cursor-pointer tbl_btn_edit_designation">
                            <a class="flex items-center" href="javascript:;"
                                data-clearance-signatory-id="${ transaction.signatory_id }"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="edit-3" data-lucide="edit-3" class="lucide lucide-edit-3 block mx-auto w-4 h-4 mr-1"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </a>
                                ${ designations }
                           </div>
                        </td>
                        <td class="">
                           <div data-clearance-signatory-id="${ transaction.signatory_id }" data-clearance-type="SEM" class="flex cursor-pointer tbl_btn_edit_sign_desc">
                            <a class="flex items-center" href="javascript:;"
                                data-clearance-signatory-id="${ transaction.signatory_id }"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="edit-3" data-lucide="edit-3" class="lucide lucide-edit-3 block mx-auto w-4 h-4 mr-1"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </a>
                                ${ description }
                           </div>
                        </td>
                        <td class="table-report__action">
                            <div class="flex justify-center items-center">
                                 <a class="flex items-center text-danger btn_remove_sem_signatory" href="javascript:;"
                                    data-clearance-signatory-id="${ transaction.signatory_id }"
                                    data-signatory-id="${ transaction.employee_id }"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    Remove
                                </a>
                            </div>
                        </td>
                     </tr>`;
                    semestralTableBody.append(transactionList); // Append curriculum row to the table

                });
            }
            else
            {
                let message = 'No Data Found!.';
                clearanceSignatoriesNoResult(semestralTableBody, message);
            }

            $('#loading-row').remove();
            updateClearanceOverviewPaginationLinks(data, paginationId, paginationSummaryId);
            $('#pagination_summary_sem_clearance').text(data.summary);
        },
    });
}

/** FUNCTION FOR FETCHING EMPLOYEE LIST */
function fetchEmployeeDataClearanceSignatories(page, filters) {

    const employeeTableBody = $('#new_faculty_list_tbl tbody');
    const employee_list_pagination = $('#employee_list_pagination');
    employeeTableBody.empty(); // Clear the table body first
    let colspan = 4;

    $.ajax({
        url: '/clearance/employee/list-load?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {

            clearanceSignatoriesLoadingSpinner(employeeTableBody, colspan);
        },
        success: function (data) {

            if(data.transactions.length > 0)
            {
                data.transactions.forEach(function (transaction) {

                    // Create the HTML structure for each curriculum row
                    const transactionList = `
                     <tr class="intro-x">
                        <td class="w-40 !py-4"> <a href="javascript:;" class="underline decoration-dotted whitespace-nowrap">${ transaction.employee_id }</a> </td>
                        <td class="w-40">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${ transaction.fullName }</a>
                        </td>
                        <td class="table-report__action">
                            <div class="flex justify-center items-center">
                                <a class="flex items-center text-slate-600 btn_add_employee_csc mr-5" href="javascript:;"
                                data-employee-id="${ transaction.employee_id }"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-plus w-4 h-4 mr-1"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="M19 16v6"/><path d="M22 19h-6"/></svg>
                                Add to CSC
                                </a>

                                <a class="flex items-center text-slate-600 btn_add_employee_semestral" href="javascript:;"
                                data-employee-id="${ transaction.employee_id }"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-plus w-4 h-4 mr-1"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="M19 16v6"/><path d="M22 19h-6"/></svg>
                                Add to Semestral
                                </a>

                            </div>
                        </td>
                     </tr>`;
                    employeeTableBody.append(transactionList); // Append curriculum row to the table

                });
            }
            else
            {
                let message = 'There is no data available on this date.';
                clearanceSignatoriesNoResult(employeeTableBody, message);
            }


            // Update the pagination links
            updateEmployeeListPaginationLinks(data, employee_list_pagination);

            // Show the summary message
            const paginationSummary = $('#pagination-summary');
            paginationSummary.text(data.summary);
        },
        complete: function () {

            // hideLoading();
            $('.clearanceSignatoriesloading_row').remove();

        }
    });
}

/** FUNCTION FOR FETCHING ACTIVE SEMESTER AND YEAR */
function fetchActiveYearAndSemester() {

    $.ajax({
        url: '/clearance/load/active/sem-year',
        type: 'POST',
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (data) {

            if(data.active_sem)
            {
                $('.input_sem').val(data.active_sem);
            }
            else
            {
                $('.input_sem').val('1st Semester');
            }
            if(data.active_year)
            {
                $('.input_year').val();
            }
            else
            {
                $('.input_year').val('2023-2024');
            }

        },
        complete: function () {

        }
    });
}

/** FUNCTION FOR FETCHING DESIGNATION */
function fetchDesignations(page, filters){

    const designation_listTableBody = $('#designation_list_tbl tbody');
    const paginationId = $('#designation_pagination');
    designation_listTableBody.empty(); // Clear the table body first
    const colspan = 2;
    $.ajax({
        url: '/clearance/load/designation/list?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (response) {
            let admin_actions = '';
            if(response.data.length > 0)
            {
                response.data.forEach(function (data){

                    if(response.isAdmin)
                    {
                        admin_actions = `<a class="flex items-center mr-3 btn_edit_designation" href="javascript:;"
                                          data-designation-id="${ data.id }"
                                          data-designation="${ data.designation }"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="check-square" data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>
                                            Edit
                                        </a>
                                        <a class="flex items-center text-danger whitespace-nowrap mr-5 btn_remove_designation" href="javascript:;"
                                            data-designation-id="${ data.id }"
                                            >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            Remove
                                        </a>`;
                    }else
                    {
                        admin_actions = `<a class="flex items-center mr-3 text-slate-400" sis href="javascript:;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="check-square" data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>
                                            Edit
                                        </a>
                                        <a class="flex items-center text-danger whitespace-nowrap mr-5 text-slate-400" href="javascript:;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            Remove
                                        </a>`;
                    }

                    const designationList = `
                        <tr class="intro-x">
                         <td class="text-left">
                            <a href="javascript:;" class="font-medium whitespace-nowrap designation_element_${ data.id }">${ data.designation }</a>
                         </td>
                         <td class="table-report__action">
                            <div class="flex justify-center items-center">
                                ${ admin_actions }
                            </div>
                         </td>
                     </tr>`;
                    designation_listTableBody.append(designationList);
                });
            }else
            {
                noResult(designation_listTableBody,'No Data  Found.');
            }

            $('#pagination_summary_designations').text(response.summary);
            updateEmployeeListPaginationLinks(response, paginationId)
        },
        complete: function () {


        }
    });


}

/** FUNCTION FOR FETCHING CREATED CLEARANCE */
function fetchCreatedClearance(page, filters) {

    const createdClearanceTableBody = $('#clearance_setup_list_tbl tbody');
    const paginationId = $('#clearance_setup_list_pagination');
    const paginationSummaryId = $('#pagination_summary_clearance_setup_lis');
    createdClearanceTableBody.empty(); // Clear the table body first
    let colspan = 7;

    $.ajax({
        url: '/clearance/load/created/clearance/admin?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {
            loadingSpinner(createdClearanceTableBody, colspan);
        },
        success: function (data) {

            if(data.transactions.length > 0)
            {
                data.transactions.forEach(function (transaction) {

                    let checkbox_status = '';
                    let action_buttons = '';
                    if(transaction.status === '13')
                    {
                        checkbox_status = `<div class="form-check form-switch">
                                                <input data-colspan="${ colspan }" data-clearance-id="${ transaction.clearance_id }" class="form-check-input checkBox_clearance_status" type="checkbox" checked>
                                                <label class="form-check-label" for="product-status-active">Open</label>
                                            </div>`;

                        action_buttons = `<a class="btn_closed_clearance flex items-center mr-3 text-slate-400" href="javascript:;">
                                            <svg data-v-88732935="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw lucide-icon customizable w-4 h-4 mr-1"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
                                             Sync Signatories
                                        </a>
                                          <a class="btn_closed_clearance flex items-center mr-3 text-slate-400" href="javascript:;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="check-square" data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>
                                                Edit
                                            </a>
                                          <a class="btn_closed_clearance flex items-center text-slate-400" href="javascript:;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                Delete
                                          </a>`;
                    }
                    else
                    {
                        checkbox_status = `<div class="form-check form-switch">
                                            <input data-colspan="${ colspan }" data-clearance-id="${ transaction.clearance_id }" class="form-check-input checkBox_clearance_status" type="checkbox">
                                            <label class="form-check-label" for="product-status-active">Closed</label>
                                        </div>`;

                        action_buttons = `<a class="flex items-center mr-3 text-primary/80 btn_sync_clearance_signatories" href="javascript:;"
                                            data-clearance-id="${ transaction.clearance_id }"
                                            data-type-id="${ transaction.type_id }"
                                            >
                                            <svg data-v-88732935="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw lucide-icon customizable w-4 h-4 mr-1"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
                                            Sync Signatories
                                          </a>
                                          <a class="flex items-center mr-3 btn_edit_clearance_setup" href="javascript:;"
                                                data-clearance-id="${ transaction.clearance_id }"
                                                data-clearance-name="${ transaction.clearance_name }"
                                                data-clearance-type="${ transaction.type_id }"
                                                data-clearance-for="${ transaction.clearance_for_id }"
                                                data-clearance-sem="${ transaction.sem }"
                                                data-clearance-year="${ transaction.year }"
                                                >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="check-square" data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>
                                                Edit
                                            </a>
                                          <a class="flex items-center text-danger btn_remove_created_clearance" href="javascript:;"
                                            data-clearance-id="${ transaction.clearance_id }"
                                            >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            Delete
                                        </a>`;
                    }

                    // Create the HTML structure for each curriculum row
                    const transactionList = `
                     <tr class="intro-x">
                        <td class="w-10 clearance_list_setup_tr" data-colspan="${ colspan }" data-clearance-id="${ transaction.clearance_id }" data-clearance-for="${ transaction.clearance_for_id }">
                             <div class="text-slate-400 cursor-pointer clearance_setup_td_chevron">
                                <svg data-v-88732935="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up lucide-icon customizable"><path d="m18 15-6-6-6 6"></path></svg>
                            </div>
                         </td>
                        <td class="w-40">
                             <a href="javascript:;" class="font-medium whitespace-nowrap">${ transaction.clearance_name }</a>
                             <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ transaction.clearance_type }</div>
                        </td>
                        <td class="w-40">
                             <a href="javascript:;" class="font-medium whitespace-nowrap">${ transaction.clearance_for }</a>
                        </td>
                        <td class="">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${ transaction.year }</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ transaction.sem }</div>
                        </td>
                         <td>
                             <div class="flex"> ${ checkbox_status } </div>
                        </td>
                        <td class="items-center">
                            <div class="text-center">
                                <div class="flex justify-center items-center">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 cursor-pointer">
                                        ${ transaction.signatory_count }
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="table-report__action">
                            <div class="flex justify-center items-center">
                                ${ action_buttons }
                            </div>
                        </td>
                     </tr>
                     <tr class="intro-x hidden clearance_setup_lis_tr_details">
                         <td colspan="${ colspan }" class="">
                         <div class="bg-slate-50 dark:bg-transparent border-2 border-dashed dark:border-darkmode-400 rounded-md p-3 col-span-12 mt-2">
                             <div class="intro-y block sm:flex items-center h-10">
                                    <h2 class="font-medium truncate mr-5">
                                        Signatories of <span>${ transaction.clearance_name }</span>
                                    </h2>
                                    <div class="relative text-slate-500 ml-auto">
                                        <button class="btn box flex items-center text-slate-600 dark:text-slate-300 btn_toggle_employee_list_mdl"
                                            data-clearance-id="${ transaction.clearance_id }"
                                            data-colspan="${ colspan }"
                                            >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="plus" data-lucide="plus" class="lucide lucide-plus w-4 h-4 mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            Add Signatory
                                        </button>
                                    </div>
                                    <input class="hidden tr_input_clearance_id">
                                 </div>
                                 <div class="intro-y block sm:flex items-center h-10">
                                    <div id="pagination_summary_target_signatories" class="hidden md:block mx-auto text-slate-500 pagination_summary_target_signatories"> -- </div>
                                 </div>
                             <div class="intro-y overflow-x-auto sm:mt-0">
                                 <table id="clearance_target_signatories" class="table table-report table-hover sm:mt-2 clearance_target_signatories">
                                    <tbody>

                                    </tbody>
                                 </table>
                              </div>
                              <!-- BEGIN: Pagination -->
                              <div class="intro-y flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-5">
                                <nav class="w-full sm:w-auto sm:mr-auto">
                                    <ul class="pagination clearance_setup_clearance_for_pagination" data-colspan="${ colspan }" data-clearance-id="${ transaction.clearance_id }" >
                                        <!-- Pagination links will be added here dynamically -->
                                    </ul>
                                </nav>
                                <select id="filter_size_clearance_setup_clearance_for" data-clearance-id="${ transaction.clearance_id }" data-colspan="${ colspan }" class="w-20 form-select box mt-3 sm:mt-0">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="35">35</option>
                                    <option value="50">50</option>
                                </select>
                              </div>
                              <!-- END: Pagination -->
                          </div>
                         </td>
                     </tr>
                    `;
                    createdClearanceTableBody.append(transactionList); // Append curriculum row to the table

                });
            }else
            {
                let message = 'No Clearance Available.';
                noResult(createdClearanceTableBody, message);
            }

            // Update CLEARANCE pagination links
            updateClearanceOverviewPaginationLinks(data, paginationId, paginationSummaryId);

            $('#loading-row').remove();

        }
    });
}

/** FUNCTION FOR FETCHING CLEARANCE SYNCED SIGNATORIES */
function fetchTargetClearanceSignatories(page, filters){
    const target_program_details_tbl = $('.clearance_target_signatories tbody');
    const paginationElementID = $('.target_program_details_pagination');
    target_program_details_tbl.empty(); // Clear the table body first

    let clearance_status = $('#target_program_details_tbl').data('clearance-status');
    let colspan = 6;

    $.ajax({
        url: '/clearance/fetch/target-clearance/signatories?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {

            targetSignatoryLoadingSpinner(target_program_details_tbl, colspan);

        },
        success: function (data) {

            target_program_details_tbl.empty();
            $('.loading-row').remove();
            let orderCount = 0;
            if(data.signatory_data.length > 0)
            {
                data.signatory_data.forEach(function (transaction) {

                    let signatory_type = '';
                    let signatory_actions = '';
                    let designations = '';
                    let reOrderingButton = '';

                    if(transaction.clearance_status === '13')
                    {
                        signatory_actions = `<a class="flex items-center text-slate-400 btn_closed_clearance" href="javascript:;"
                                            data-primary-id="${ transaction.clearance_target_primary_id }"
                                            data-target-program-id="${ transaction.target_program_id }"
                                            >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            Remove
                                         </a>`;
                        reOrderingButton = `<a href="javascript:;" class="text-slate-400 btn_closed_clearance">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="move" data-lucide="move" class="lucide lucide-move w-4 h-4"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>
                                            </a>`;
                    }else
                    {
                        signatory_actions = `<a class="flex items-center text-danger btn_remove_custom_signatory" href="javascript:;"
                                            data-primary-id="${ transaction.clearance_target_primary_id }"
                                            data-target-program-id="${ transaction.target_program_id }"
                                            data-clearance-id="${ transaction.clearance_id }"
                                            >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            Remove
                                         </a>`
                        reOrderingButton = `<a href="javascript:;" class="btn_row_change">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="move" data-lucide="move" class="lucide lucide-move w-4 h-4"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>
                                            </a>`;
                    }

                    if(transaction.designation)
                    {
                        designations = `<div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ transaction.designation }</div>`;
                    }
                    else
                    {
                        designations = `<div class="text-danger text-xs whitespace-nowrap mt-0.5">Designation not set yet..</div>`;
                    }

                    orderCount++;

                    // Create the HTML structure for each curriculum row
                    const transactionList = `
                     <tr class="intro-x"
                            data-primary-id="${ transaction.clearance_target_primary_id }"
                            data-target-program-id="${ transaction.target_program_id }"
                            data-clearance-id="${ transaction.clearance_id }"
                            data-clearance-id="${ transaction.clearance_id }"
                            data-old-order="${ transaction.signatoryOrder }"
                            >
                        <td class="w-10">
                            ${ reOrderingButton }
                        </td>
                        <td class="">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${ transaction.fullName }</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ transaction.signatory_id }</div>
                        </td>
                        <td class="">
                            ${ designations }
                        </td>
                        <td class="table-report__action">
                            <div class="flex justify-center items-center">
                                ${ signatory_actions }
                            </div>
                        </td>
                     </tr>`;
                    target_program_details_tbl.append(transactionList); // Append curriculum row to the table

                });
            }else
            {
                let message = 'No Data Found!.';
                noResult(target_program_details_tbl, message);
            }

            updateEmployeeListPaginationLinks(data, paginationElementID);
            $('.pagination_summary_target_signatories').text(data.summary);
        },
        complete: function () {

            /** FUNCTION FOR TABLE ROW DRAGGABLE */
            $('.clearance_target_signatories tbody').sortable({
                placeholder: 'sortable-placeholder',
                handle: '.btn_row_change',
                update: function(event, ui) {

                    let sortedData = [];
                    $(this).find('tr').each(function(index) {
                        let clearanceID = $(this).data('clearance-id');
                        let primaryID   = $(this).data('primary-id');
                        let oldOrder    = $(this).data('old-order');
                        sortedData.push({
                            clearanceID: clearanceID,
                            primaryID: primaryID,
                            oldOrder: oldOrder,
                            currentOrder: index + 2 // index is 0-based, so add 1 to make it 1-based
                        });
                    });


                    // AJAX call to update the order
                    $.ajax({
                        url: '/clearance/update-signatory-order',
                        method: 'POST',
                        data: {
                            sortedData: sortedData,
                        },
                        success: function(response) {
                            console.log('Order updated successfully:', response);
                            __notif_show(response.status_code, response.title, response.message);
                            // Optionally, update UI or perform actions after successful update
                        },
                        error: function(xhr, status, error) {
                            console.error('Error updating order:', error);
                            // Handle error cases if needed
                        }
                    });

                }
            }).disableSelection();

        }
    });
}

/** FUNCTION FOR UPDATING SIGNATORY ORDER */
function updateSignatoryOrder(){

    $.ajax({
        url: '/clearance/update-signatory-order',
        type: 'POST',
        data: { employee_id, clearance_type },
        dataType: 'json',
        beforeSend: function () {


        },
        success: function (response) {
            if(response.success)
            {
                __notif_show(1, 'Success', response.message);
                fetch_Semestral_ClearanceSignatories();
            }
        },

        complete: function () {


        }
    });

}

/** FUNCTION FOR CLEARANCE SETUP */
function clearanceSetup(){

    let filters = {};
    /** ADD EMPLOYEE SIGNATORY */
    $('body').on('click', '.btn_add_employee_csc', function(){

        let employee_id     = $(this).data('employee-id');
        let clearance_type  = 1;

        /** RESPONSIBLE FOR REMOVING TABLE ROW AFTER CLICK  */
        $(this).closest('tr').remove();

        $.ajax({
            url: '/clearance/create/signatories',
            type: 'POST',
            data: { employee_id, clearance_type },
            dataType: 'json',
            beforeSend: function () {


            },
            success: function (response) {

                __notif_show(1, 'Success', response.message);
                fetch_CSC_ClearanceSignatories();
            },

            complete: function () {


            }
        });

    });
    $('body').on('click', '.btn_add_employee_semestral', function(){

        let employee_id     = $(this).data('employee-id');
        let clearance_type  = 2;

        /** RESPONSIBLE FOR REMOVING TABLE ROW AFTER CLICK  */
        $(this).closest('tr').remove();

        $.ajax({
            url: '/clearance/create/signatories',
            type: 'POST',
            data: { employee_id, clearance_type },
            dataType: 'json',
            beforeSend: function () {


            },
            success: function (response) {
                if(response.success)
                {
                    __notif_show(1, 'Success', response.message);
                    fetch_Semestral_ClearanceSignatories();
                }
            },

            complete: function () {


            }
        });

    });

    /** REMOVE EMPLOYEE SIGNATORY */
    $('body').on('click', '.btn_remove_csc_signatory', function (){

        let clearance_signatory_id = $(this).data('clearance-signatory-id');
        let employee_id = $(this).data('employee-id');

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to remove this signatory? This process cannot be undone.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#d63030',
            cancelButtonColor: '#9d9d9d',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) =>
        {
            if (result.isConfirmed) {

                $.ajax({
                    url: '/clearance/remove/signatories',
                    type: 'POST',
                    data: { employee_id, clearance_signatory_id },
                    dataType: 'json',
                    beforeSend: function () {

                    },
                    success: function (response) {

                        if(response.hasDeleted)
                        {
                            __notif_show(1, 'Success', 'Removed successfully!');
                            fetch_CSC_ClearanceSignatories();
                        }
                    },

                    complete: function () {


                    }
                });

            }
        });
    });
    $('body').on('click', '.btn_remove_sem_signatory', function (){

        let clearance_signatory_id = $(this).data('clearance-signatory-id');
        let employee_id = $(this).data('employee-id');

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to remove this signatory? This process cannot be undone.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#d63030',
            cancelButtonColor: '#9d9d9d',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) =>
        {
            if (result.isConfirmed) {

                $.ajax({
                    url: '/clearance/remove/signatories',
                    type: 'POST',
                    data: { employee_id, clearance_signatory_id },
                    dataType: 'json',
                    beforeSend: function () {

                    },
                    success: function (response) {

                        if(response.hasDeleted)
                        {
                            __notif_show(1, 'Success', 'Removed successfully!');
                            fetch_Semestral_ClearanceSignatories();
                        }
                    },

                    complete: function () {


                    }
                });

            }
        });
    });

    /** AUTO ADD NAME EXTENSION */
    $('.csc_signatory_table').on('blur', '.input_clearance_signatory_ext', function(event) {
        // Get the input value
        let input_element = $(this);
        let clearanceSignatory_id = input_element.data('clearance-signatory-id');
        let extension = input_element.val();
        let element = input_element.data('element');

        if (extension === null) {
            input_element.addClass('border-danger');
            __notif_show(-1, 'Oooopss..', 'Please provide valid input!');
        } else {
            input_element.removeClass('border-danger');
            // Make an AJAX request
            $.ajax({
                url: '/clearance/add/extension',
                type: 'POST',
                data: { clearanceSignatory_id, extension },
                dataType: 'json',
                beforeSend: function () {
                    // Optionally, you can add loading spinner or other preparations here
                },
                success: function (data) {
                    __notif_show(1, 'Success', data.message);
                    input_element.addClass('border-success');
                    $('.alert_div').html('');
                },
                complete: function () {
                    // Optionally, you can add any post-request cleanup here
                },
                error: function (xhr, status, error) {
                    input_element.addClass('border-danger');
                    __notif_show(-1, 'Error', 'An error occurred. Please try again.');
                }
            });
        }
    });
    $('.sem_signatory_table').on('blur', '.input_clearance_signatory_ext', function(event) {
        // Get the input value
        let input_element = $(this);
        let clearanceSignatory_id = input_element.data('clearance-signatory-id');
        let extension = input_element.val();
        let element = input_element.data('element');

        if (extension === null) {
            input_element.addClass('border-danger');
            __notif_show(-1, 'Oooopss..', 'Please provide valid input!');
        } else {
            input_element.removeClass('border-danger');
            // Make an AJAX request
            $.ajax({
                url: '/clearance/add/extension',
                type: 'POST',
                data: { clearanceSignatory_id, extension },
                dataType: 'json',
                beforeSend: function () {
                    // Optionally, you can add loading spinner or other preparations here
                },
                success: function (data) {
                    __notif_show(1, 'Success', data.message);
                    input_element.addClass('border-success');
                    $('.alert_div').html('');
                },
                complete: function () {
                    // Optionally, you can add any post-request cleanup here
                },
                error: function (xhr, status, error) {
                    input_element.addClass('border-danger');
                    __notif_show(-1, 'Error', 'An error occurred. Please try again.');
                }
            });
        }
    });

    /** UPDATE OR EDIT SIGNATORY DESIGNATION & INSTITUTE */
    $('body').on('click', '.tbl_btn_edit_designation', function (){

        let clearance_type = $(this).data('clearance-type');
        let clearance_signatory_id = $(this).data('clearance-signatory-id');
        fetchDesignationsList(clearance_signatory_id, clearance_type);

    })


    /** UPDATE OR EDIT SIGNATORY DESCRIPTION */
    $('body').on('click', '.tbl_btn_edit_sign_desc', function (){

        let clearance_type = $(this).data('clearance-type');
        let clearance_signatory_id = $(this).data('clearance-signatory-id');

        Swal.fire({
            title: 'Update Signatory Description',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3054d6',
            cancelButtonColor: '#9d9d9d',
            confirmButtonText: 'Yes, update!',
            html: `<div class="p-4">
                        <select class="form-control w-full" id="swal_signatory_desc">
                                <option value="" disabled selected>Select Signatory Description</option>
                                <option value="Recommending approval">Recommending Approval:</option>
                                <option value="Approved by">Approved by:</option>
                                <option value="Endorsed by">Endorsed by:</option>
                                <option value="Noted by">Noted by:</option>
                                <option value="Reviewed by">Reviewed by:</option>
                                <option value="Recorded by">Recorded by:</option>
                                <option value="null">None</option>
                        </select>
                    </div>`,
            preConfirm: () => {
                let swal_signatory_desc  = $('#swal_signatory_desc').val();
                if(swal_signatory_desc === '')
                {
                    Swal.showValidationMessage(`Please select description.`);
                }
            }
        }).then((result) =>
        {
            if (result.isConfirmed) {

                let swal_signatory_desc  = $('#swal_signatory_desc').val();

                /** SAVE UPDATED DATA TO SERVER VIA AJAX REQUEST */
                $.ajax({
                    url: '/clearance/update/signatory-description',
                    method: 'POST',
                    data: { clearance_signatory_id, swal_signatory_desc },
                    dataType: 'json',
                    beforeSend: function () {
                        __swalShowLoading();
                    },
                    success: function(response) {
                        Swal.fire({
                            icon:  'success',
                            title: 'Success',
                            text: response.message,
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000  // Close the alert after 1 second
                        });

                        if(clearance_type === 'CSC')
                        {
                            filters.limit   = parseInt($('#filter_size_clearance_signatories').val());
                            let currentPage = parseInt($('#csc_signatory_pagination .active .page-link').text());
                            fetch_CSC_ClearanceSignatories(currentPage, filters);
                        }else
                        {
                            filters.limit   = parseInt($('#filter_size_sem_signatories').val());
                            let currentPage = parseInt($('#sem_signatories_pagination .active .page-link').text());
                            fetch_Semestral_ClearanceSignatories(currentPage, filters);
                        }

                    },
                    error: function(xhr, status, error) {
                        // Handle error response from the server
                        __swalErrorHandling(error);
                    }
                });
            }
        });

    })

    /** TOGGLE EMPLOYEE ACTIVE SEMESTER AND YEAR */
    $('body').on('click', '.btn_sem_year', function (){

        __modal_toggle('clearance_sem_year');
        __dropdown_close('#clearance_setup_menu');
    });

    /** TOGGLE EMPLOYEE LIST MODAL*/
    $('body').on('click', '.btn_employee_list', function (){

        __modal_toggle('employee_list_mdl');
        __dropdown_close('#clearance_setup_menu');

    });

    /** TOGGLE DESIGNATION LIST MODAL*/
    $('body').on('click', '.btn_designations', function (){

        __modal_toggle('designation_list_mdl');
        __dropdown_close('#clearance_setup_menu');

    });

    /** ADD DESIGNATIONS */
    $('body').on('click', '.btn_toggle_smart_add', function (){
        $('.smart_filter_div').toggle();
    });
    $('body').on('keyup', '#input_designation', function(event) {
        // Check if the event is a keyup event and if the key released is Enter (key code 13)
        if (event.type === 'keyup' && event.keyCode !== 13) {
            return;
        }

        // Get the input value
        let input_designation = $(this);
        let designation_value = input_designation.val();

        if (designation_value === null || designation_value === '')
        {
            input_designation.addClass('border-danger');
            __notif_show(-1, 'Oooopss..', 'Please provide valid input!');
        }
        else
        {
            input_designation.removeClass('border-danger');
            // Make an AJAX request
            $.ajax({
                url: '/clearance/add/designation-to-list',
                type: 'POST',
                data: { designation_value },
                dataType: 'json',
                beforeSend: function () {

                },
                success: function (data) {
                    __notif_show(1, 'Success', data.message);
                    input_designation.addClass('border-success');
                    input_designation.val('');

                    let paginationSize = parseInt($('#filter_size_designation').val());
                    const filters = {
                        limit: paginationSize,
                    };
                    fetchDesignations(1, filters);
                },
                error: function (xhr, status, error) {
                    input_element.addClass('border-danger');
                    __notif_show(-1, 'Error', 'An error occurred. Please try again.');
                }
            });
        }
    });
    $('body').on('click', '.btn_edit_designation', function (){

        // Get the related data attributes from the button
        const designationId = $(this).data('designation-id');
        const designationValue = $(this).data('designation');

        // Find the parent <tr> element of the button
        const parentRow = $(this).closest('tr');

        // Find the <a> element with class "designation_element" within the parent row
        const designationElement = parentRow.find('.designation_element_'+designationId);

        // Create a new <input> element
        const inputElement = $('<input>', {
            type: 'text',
            value: designationValue,
            class: 'form-control border-primary input_clearance_desig',
            data: {
                'designation-id': designationId
            }
        });

        // Replace the <a> element with the <input> element
        designationElement.replaceWith(inputElement);

        // Optionally, focus the input element for immediate editing
        inputElement.focus();

    });
    $('#designation_list_tbl').on('keyup', '.input_clearance_desig', function(event) {

        // Check if the event is a keyup event and if the key released is Enter (key code 13)
        if (event.type === 'keyup' && event.keyCode !== 13) {
            return;
        }
        // Get the input value
        let input_element = $(this);
        let clearanceSignatory_id = input_element.data('designation-id');
        let designation = input_element.val();

        // Make an AJAX request
        $.ajax({
            url: '/clearance/edit/designation-to-list',
            type: 'POST',
            data: { clearanceSignatory_id, designation },
            dataType: 'json',
            beforeSend: function () {

            },
            success: function (data) {

                __notif_show(1, 'Success', data.message);
                input_element.addClass('border-success');
                // Create the original HTML structure
                let originalHtml = `<a href="javascript:;" class="font-medium whitespace-nowrap designation_element_${ clearanceSignatory_id }">${ designation }</a>`;

                // Replace the input element with the original HTML structure
                input_element.closest('td').html(originalHtml);
            },
            error: function (xhr, status, error) {
                input_element.addClass('border-danger');
                __notif_show(-1, 'Error', 'An error occurred. Please try again.');
            }
        });
    });
    $('body').on('click', '.btn_remove_designation', function (){
        let designation_id = $(this).data('designation-id');

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to remove this designation? This process cannot be undone.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#d63030',
            cancelButtonColor: '#9d9d9d',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) =>
        {
            if (result.isConfirmed) {

                $.ajax({
                    url: '/clearance/delete/designation-to-list',
                    type: 'POST',
                    data: { designation_id },
                    dataType: 'json',
                    beforeSend: function () {
                        __swalCustomLoading('Deleting data', 'Please be patient, data is being processed!');
                    },
                    success: function(response) {

                        Swal.fire({
                            icon:  'success',
                            title: 'Success',
                            text:  response.message,
                            showConfirmButton: false,
                            timerProgressBar: true,
                            timer: 1000  // Close the alert after 1 second
                        });

                        const filters = {
                            limit : parseInt($('#filter_size_designation').val()),
                        };
                        fetchDesignations(1, filters);
                    },
                    error: function(xhr, status, error) {
                        // Handle error response from the server_
                        __swalErrorHandling(error);
                    }
                });

            }
        });

    });
}

/** FUNCTION FOR CREATION OF CLEARANCE */
function creationOfClearance(){

    $('body').on('click', '#btn_create_clearance', function(){

        $('.input_clearance_id_mdl').val(null);
        $('#clearance_name').val(null);
        $('#clearance_type').val(null);
        $('#clearance_for').val(null);
        $('.label_clearance_modal').text('Create Clearance')
        __modal_toggle('create_student_clearance_mdl');

        $('.mdl_btn_edit_signatories').hide();
        $('.mdl_btn_create_clearance').html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="save" data-lucide="save" class="lucide lucide-save w-4 h-4 mr-2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Create Clearance');
        // $('.btn_save_clearance').hide();
        $('#clearance_signatories_div').hide();
    });

    $('body').on('click', '.mdl_btn_create_clearance', function (){

        let this_button = $(this);
        let clearance_data = {
            year: $('.clearance_schoolYear').val(),
            sem:  $('.clearance_schoolSem').val(),
            clearance_name: $('.clearance_name').val(),
            clearance_for:  $('#clearance_for').val(),
            clearance_type: $('#clearance_type').val(),
            clearance_id : $('.input_clearance_id_mdl').val(),
        }
        if(validClearanceInputs())
        {
            $.ajax({
                url: '/clearance/create-new',
                type: "POST",
                data: clearance_data,
                dataType: 'json',
                beforeSend: function () {

                    this_button.html('<svg width="20" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2"><defs><linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a"><stop stop-color="rgb(30, 41, 59)" stop-opacity="0" offset="0%"></stop><stop stop-color="rgb(30, 41, 59)" stop-opacity=".631" offset="63.146%"></stop><stop stop-color="rgb(30, 41, 59)" offset="100%"></stop></linearGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)"><path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="3"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"></animateTransform></path><circle fill="rgb(30, 41, 59)" cx="36" cy="18" r="1"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"></animateTransform></circle></g></g></svg> Processing....');
                    this_button.prop('disabled', true);
                },
                success: function (data) {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Clearance created successfully!',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            showCancelButton: false,
                            timer: 1500  // Close the alert after 1 second
                        });

                        this_button.html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="save" data-lucide="save" class="lucide lucide-save w-4 h-4 mr-2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Create Clearance');
                        this_button.prop('disabled', false);

                        $('.clearance_name').val(null);
                        $('#clearance_for').val(null);
                        $('#clearance_type').val(null);
                        $('.input_clearance_id_mdl').val(null);

                        __modal_hide('create_student_clearance_mdl');
                        fetchCreatedClearance();
                    }
                },
                complete: function(){
                    // Optional: code to execute after the request completes
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // Handle errors here
                    console.log('Error:', textStatus, errorThrown);
                }
            });
        }else
        {
            Swal.fire({
                icon: 'warning',
                title: 'Oooopss..',
                text: 'Please provide required fields.',
                timerProgressBar: true,
                showConfirmButton: true,
                confirmButtonText: 'Got it!',
                cancelButtonText: 'Cancel',
                //timer: 2000  // Close the alert after 1 second
            });
        }
    });

    $('body').on('click', '.btn_edit_clearance_setup', function (){

        let clearance_id = $(this).data('clearance-id');
        let year = $(this).data('clearance-year');
        let sem = $(this).data('clearance-sem');
        let clearance_name = $(this).data('clearance-name');
        let clearance_type = $(this).data('clearance-type');
        let clearance_for = $(this).data('clearance-for');

        $('.input_clearance_id_mdl').val(clearance_id);
        $('#clearance_schoolYear').val(year);
        $('#clearance_schoolSem').val(sem);
        $('#clearance_name').val(clearance_name);
        $('#clearance_type').val(clearance_type);
        $('#clearance_for').val(clearance_for);

        $('.mdl_btn_create_clearance').html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="save" data-lucide="save" class="lucide lucide-save w-4 h-4 mr-2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Update Clearance');
        __modal_toggle('create_student_clearance_mdl');
    });

    $('body').on('click', '.btn_remove_created_clearance', function (){

        let clearance_id = $(this).data('clearance-id');
        let this_button  = $(this);

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to remove this clearance? This process cannot be undone.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#d63030',
            cancelButtonColor: '#9d9d9d',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) =>
        {
            if (result.isConfirmed) {

                $.ajax({
                    url: '/clearance/remove/created-clearance',
                    type: 'POST',
                    data: { clearance_id },
                    dataType: 'json',
                    beforeSend: function () {

                        this_button.html('<svg width="20" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1"><defs><linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a"><stop stop-color="rgb(30, 41, 59)" stop-opacity="0" offset="0%"></stop><stop stop-color="rgb(30, 41, 59)" stop-opacity=".631" offset="63.146%"></stop><stop stop-color="rgb(30, 41, 59)" offset="100%"></stop></linearGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)"><path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="3"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"></animateTransform></path><circle fill="rgb(30, 41, 59)" cx="36" cy="18" r="1"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"></animateTransform></circle></g></g></svg> Deleting..')
                        this_button.prop('disabled', true);

                    },
                    success: function (response) {

                        if(response.success)
                        {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Removed successfully!',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1000  // Close the alert after 1 second
                            });

                            this_button.html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Delete');
                            this_button.prop('disabled', false);

                            fetchCreatedClearance();
                        }
                    },

                    complete: function () {


                    }
                });

            }
        });
    });


    /** UPDATE CLEARANCE STATUS */
    $('body').on('change', '.checkBox_clearance_status', function(){


        let clearance_id = $(this).data('clearance-id');
        let colspan = $(this).data('colspan');
        let this_checkbox = $(this);
        let clearance_status;

        if ($(this).is(':checked'))
        {
            clearance_status = 13;
            updateClearanceStatus(clearance_id, clearance_status);
        }
        else
        {
            clearance_status = 14;
            updateClearanceStatus(clearance_id, clearance_status);
        }

    });

    /** FUNCTION FOR SYNCING CLEARANCE SIGNATORIES */
    $('body').on('click', '.btn_sync_clearance_signatories', function (){

        let this_button  = $(this);
        let clearance_id = $(this).data('clearance-id');
        let type_id      = $(this).data('type-id');

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to sync clearance signatory? This process cannot be undone.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#305ad6',
            cancelButtonColor: '#9d9d9d',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) =>
        {
            if (result.isConfirmed) {

                $.ajax({
                    url: '/clearance/sync/signatories',
                    type: 'POST',
                    data: { clearance_id, type_id },
                    dataType: 'json',
                    beforeSend: function () {

                        __swalCustomLoading('Signatories Syncing', 'Please be patient, data is being saved...');
                    },
                    success: function(response) {

                        setTimeout(function () {
                            Swal.fire({
                                icon:  'success',
                                title: 'Success',
                                text:  response.message,
                                showConfirmButton: false,
                                timerProgressBar: true,
                                timer: 1000  // Close the alert after 1 second
                            });

                        }, 2500);
                    },
                    error: function(xhr, status, error) {
                        // Handle error response from the server_
                        __swalErrorHandling(error);
                    }
                });

            }
        });

    });

    /** FUNCTION FOR TOGGLE HIDDEN TABLE ROW */
    $('body').on('click', '.clearance_list_setup_tr', function () {

        let clearance_for = $(this).data('clearance-for');
        let clearance_id = $(this).data('clearance-id');
        let colspan = $(this).data('colspan');
        let clickedRow = $(this).closest('tr').next('.clearance_setup_lis_tr_details');
        let chevronElement = $(this).find('.clearance_setup_td_chevron');
        let filters = {};

        $('.tr_input_clearance_id').val(clearance_id);

        // Toggle the chevron class on the clicked element
        chevronElement.toggleClass('transform rotate-180');

        // Hide all other .clearance_group_tr_details rows and reset their chevron classes
        $('.clearance_setup_lis_tr_details').not(clickedRow).hide();
        $('.clearance_list_setup_tr').not($(this)).find('.clearance_setup_td_chevron').removeClass('transform rotate-180');


        // Toggle the visibility of the clickedRow
        clickedRow.toggle();

        filters.clearance_id = clearance_id;
        fetchTargetClearanceSignatories(1 , filters);

    });

    /** FUNCTION FOR REMOVING TARGE CLEARANCE SIGNATORY */
    $('body').on('click', '.btn_remove_custom_signatory', function (){

        let primary_id   = $(this).data('primary-id');
        let this_button  = $(this);
        let clearance_id = $(this).data('clearance-id');
        let filters     = {};

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to remove this signatory? This process cannot be undone.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#d63030',
            cancelButtonColor: '#9d9d9d',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) =>
        {
            if (result.isConfirmed) {

                $.ajax({
                    url: '/clearance/remove/signatory-from-target',
                    type: 'POST',
                    data: { primary_id },
                    dataType: 'json',
                    beforeSend: function () {

                        this_button.html('<svg width="20" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1"><defs><linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a"><stop stop-color="rgb(30, 41, 59)" stop-opacity="0" offset="0%"></stop><stop stop-color="rgb(30, 41, 59)" stop-opacity=".631" offset="63.146%"></stop><stop stop-color="rgb(30, 41, 59)" offset="100%"></stop></linearGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)"><path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="3"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"></animateTransform></path><circle fill="rgb(30, 41, 59)" cx="36" cy="18" r="1"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"></animateTransform></circle></g></g></svg> Deleting..')
                        this_button.prop('disabled', true);

                    },
                    success: function (response) {

                        if(response.success)
                        {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Removed successfully!',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1000  // Close the alert after 1 second
                            });

                            this_button.html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Delete');
                            this_button.prop('disabled', false);

                            console.log(clearance_id);

                            filters.clearance_id = clearance_id;
                            fetchTargetClearanceSignatories(1 , filters);
                        }
                    },

                    complete: function () {


                    }
                });

            }
        });

    });

    /** FUNCTION FOR CLOSED CLEARANCE */
    $('body').on('click', '.btn_closed_clearance', function (){

        Swal.fire({
            icon:  'info',
            title: 'Oooops...',
            text:  'Clearance is now currently open, cannot be edited!',
            showConfirmButton: true,
        });
    });

    $('body').on('click', '.btn_migration', function (){

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to run this script? This process cannot be undone.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#d63030',
            cancelButtonColor: '#9d9d9d',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) =>
        {
            if (result.isConfirmed) {

                $.ajax({
                    url: '/clearance/run-database-migration',
                    type: 'POST',
                    dataType: 'json',
                    beforeSend: function () {

                        __swalCustomLoading('Database migrating', 'Please be patient, database is currently on syncing...');
                    },
                    success: function (response) {

                        if(response.success)
                        {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Migrated successfully!',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1000  // Close the alert after 1 second
                            });
                        }
                    },

                    complete: function () {


                    }
                });

            }
        });

    });
    $('body').on('click', '.btn_rollback', function (){

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to run this script? This process cannot be undone.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#d63030',
            cancelButtonColor: '#9d9d9d',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) =>
        {
            if (result.isConfirmed) {

                $.ajax({
                    url: '/clearance/run-database-rollback',
                    type: 'POST',
                    dataType: 'json',
                    beforeSend: function () {

                        __swalCustomLoading('Database roll backing', 'Please be patient, database is currently on syncing...');
                    },
                    success: function (response) {

                        if(response.success)
                        {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: response.message,
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1000  // Close the alert after 1 second
                            });
                        }
                    },

                    complete: function () {


                    }
                });

            }
        });

    });
}

/** FUNCTION FOR UPDATING CLEARANCE STATUS */
function updateClearanceStatus(clearance_id, clearance_status){
    $.ajax({
        url: '/clearance/update/status',
        type: 'POST',
        data: { clearance_id, clearance_status },
        dataType: 'json',
        beforeSend: function () {

        },
        success: function(response) {

            Swal.fire({
                icon:  'success',
                title: 'Success',
                text:  response.message,
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 1000  // Close the alert after 1 second
            });

            fetchCreatedClearance();

        },
        error: function(xhr, status, error) {
            // Handle error response from the server_
            __swalErrorHandling(error);
        }
    });
}

/** FUNCTION FOR VALIDATING CLEARANCE INPUTS */
function validClearanceInputs(){

    let isValidInputs = true;
    $('#create_clearance_input_div input, #create_clearance_input_div select').each(function () {
        if ($(this).val() === "") {
            isValidInputs = false;
            // Add danger border to empty fields
            $(this).addClass("border-danger");
        } else {
            // Remove danger border if field is not empty
            $(this).removeClass("border-danger");
        }
    });

    return isValidInputs;

}


/** FUNCTION FOR FETCHING DESIGNATIONS DATA */
function fetchDesignationsList(clearance_signatory_id, clearance_type){

    $.ajax({
        url: '/clearance/fetch/created-designations',
        method: 'POST',
        beforeSend: function () {
            __swalShowLoading();
        },
        success: function(response) {

            Swal.fire({
                title: 'Update Designation',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3054d6',
                cancelButtonColor: '#9d9d9d',
                confirmButtonText: 'Yes, update!',
                html: `<div id="swal_designation_div" class="p-4">
                                <select class="form-control w-full" data-element="Designation" id="swal_designation">
                                    <option value="">Select Designation</option>
                                </select>
                            </div>`,
                preConfirm: () => {
                    let swal_designation  = $('#swal_designation').val();
                    $('#swal_designation_div select').each(function (){
                        let elementName = $(this).data('element');
                        if($(this).val().trim() === '')
                        {
                            $(this).addClass('border-danger');
                            Swal.showValidationMessage(`Please select designation.`);
                        }else
                        {
                            $(this).removeClass('border-danger');
                        }
                    });
                }
            }).then((result) =>
            {
                if (result.isConfirmed) {

                    let swal_designation  = $('#swal_designation').val();

                    /** SAVE UPDATED DATA TO SERVER VIA AJAX REQUEST */
                    saveUpdatedDesignations(clearance_signatory_id, swal_designation, clearance_type);
                }
            });

            if (response.success) {
                let designations = response.designations;
                designations.forEach(function (value){
                    $('#swal_designation').append(`<option value="${ value.id }"> ${ value.designation }</option>`);
                });
            }
        },
        error: function(xhr, status, error) {
            // Handle error response from the server
            __swalErrorHandling(error);
        }
    });
}

/** FUNCTION FOR SAVING UPDATED DESIGNATION */
function saveUpdatedDesignations(clearance_signatory_id, swal_designation, clearance_type){

    let filters = {};

    $.ajax({
        url: '/clearance/update/signatory-designation',
        method: 'POST',
        data: { clearance_signatory_id, swal_designation },
        dataType: 'json',
        beforeSend: function () {
            __swalShowLoading();
        },
        success: function(response) {
            Swal.fire({
                icon:  'success',
                title: 'Success',
                text: response.message,
                timerProgressBar: true,
                showConfirmButton: false,
                timer: 1000  // Close the alert after 1 second
            });

            if(clearance_type === 'CSC')
            {
                filters.limit   = parseInt($('#filter_size_clearance_signatories').val());
                let currentPage = parseInt($('#csc_signatory_pagination .active .page-link').text());
                fetch_CSC_ClearanceSignatories(currentPage, filters);
            }else
            {
                filters.limit   = parseInt($('#filter_size_sem_signatories').val());
                let currentPage = parseInt($('#sem_signatories_pagination .active .page-link').text());
                fetch_Semestral_ClearanceSignatories(currentPage, filters);
            }

        },
        error: function(xhr, status, error) {
            // Handle error response from the server
            __swalErrorHandling(error);
        }
    });

}

/** FUNCTION FOR ACTIVATING ACTIVE SCHOOL SEMESTER AND SCHOOL YEAR */
function systemActiveSemesterAndSchoolYear(){

    /** ADJUST ACTIVE SEMESTER */
    let semMapping = {
        1: "1st Semester",
        2: "2nd Semester",
        3: "Summer Semester"
    };
    let semOrder = [1, 2, 3];  // Order to cycle through semesters
    let currentIndex = 0;
    function updateSemester(index) {
        $('.input_sem').val(semMapping[semOrder[index]]);
    }
    $('.btn_adjust_sem').on('click', function() {
        if ($(this).text() === '+') {
            currentIndex = (currentIndex + 1) % semOrder.length;
        } else {
            currentIndex = (currentIndex - 1 + semOrder.length) % semOrder.length;
        }
        updateSemester(currentIndex);
        let key = 'key';
        let key_value = 'sem';
        let fieldName  = 'value';
        let fieldValue = $('.input_sem').val();
        autoSaveActiveYearAndSemester(key, key_value, fieldName, fieldValue);
    });
    // Initialize the input field with the correct semester
    updateSemester(currentIndex);


    /** ADJUST ACTIVE SCHOOL YEAR */
    let currentYear = new Date().getFullYear();  // Get the current year dynamically
    function updateYear(year) {
        $('.input_year').val(year + '-' + (year + 1));

    }
    $('.btn_adjust_year').on('click', function() {
        if ($(this).text() === '+') {
            currentYear++;
        } else {
            currentYear--;
        }

        updateYear(currentYear);
        let key = 'key';
        let key_value = 'year';
        let fieldName  = 'value';
        let fieldValue = $('.input_year').val();
        autoSaveActiveYearAndSemester(key, key_value, fieldName, fieldValue);
    });
    // Initialize the year input field
    updateYear(currentYear);

}
/** FUNCTION FOR AUTO SAVING ACTIVE YEAR AND SEMESTER */
function autoSaveActiveYearAndSemester(key, key_value, fieldName, fieldValue){

    $.ajax({
        url: '/clearance/update/sem-year',
        type: "POST",
        data: {
            key: key,
            key_value: key_value,
            field: fieldName,
            value: fieldValue
        },
        dataType: 'json',
        beforeSend: function () {
            // Optional: code to execute before sending the request
        },
        success: function (data) {
            if (data.success) {
                //__swalCustom('success', 'Success', data.message, true, false, 1000);
                //__notif_show(1, 'Success', 'School Year and Semester loaded successfully!');
            }
        },
        complete: function(){
            // Optional: code to execute after the request completes
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.log('Error:', textStatus, errorThrown);
        }
    });

}


/** FUNCTION FOR SMART FILTERS */
function smartFilters(){

    let filters = {};

    // Event handler for pagination links
    $('body').on('click', '#employee_list_pagination a', function (event) {
        event.preventDefault();

        const page = $(this).data('page');
        filters.search = $('#filter-search-faculty').val();
        filters.limit  = parseInt($('#filter-size-faculty').val());

        fetchEmployeeDataClearanceSignatories(page, filters);
    });

    // Event handler for filter search input
    $('#filter-search-faculty').on('keyup', function (event) {

        clearTimeout(typingTimer);
        const searchKeyword = $(this).val();
        if (event.keyCode === 13) {
            // If the Enter key is pressed, fetch immediately without delay
            fetchFilteredExamineesData(searchKeyword);
        } else {
            // Otherwise, set the timer to fetch after the doneTypingInterval
            typingTimer = setTimeout(function () {
                fetchFilteredExamineesData(searchKeyword);
            }, doneTypingInterval);
        }
    });

    // Event handler for "Items per page" select box
    $('#filter-size-faculty').on('change', function () {
        let size_limit = parseInt($(this).val());
        filters.search = $('#filter-search-faculty').val();
        filters.limit  = size_limit;

        fetchEmployeeDataClearanceSignatories(1, filters);
    });

}
function fetchFilteredExamineesData(searchKeyword) {

    let filters     = {};
    filters.search = searchKeyword;
    filters.limit  = parseInt($('#filter-size-faculty').val());

    fetchEmployeeDataClearanceSignatories(1, filters);
}


/** FUNCTION FOR TABLE DYNAMIC NO RESULTS AND LOADING SPINNER */
function noResult(tableBody, message){

    const transactionList = `
                     <tr class="intro-x">
                        <td colspan="7" class="w-full text-center">

                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                            <a href="javascript:;" class=" text-slate-500 text-xs whitespace-nowrap">${  message }</a>
                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                        </td>
                     </tr>`;

    return tableBody.append(transactionList); // Append curriculum row to the table

}
function loadingSpinner(tableBody, colspan){

    let loadingRow = `
                     <tr id="loading-row" class="intro-x loading-row">
                        <td colspan="${ colspan }" class="w-full text-center">
                            <div class="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center py-1">
                                <svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-8 h-8">
                                    <g fill="none" fill-rule="evenodd" stroke-width="4">
                                        <circle cx="22" cy="22" r="1">
                                            <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                                            <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                                        </circle>
                                        <circle cx="22" cy="22" r="1">
                                            <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                                            <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                                        </circle>
                                    </g>
                                </svg>
                            </div>
                        </td>
                     </tr>`;
    tableBody.append(loadingRow);

}
function clearanceSignatoriesLoadingSpinner(tableBody, colspan){

    let loadingRow = `
                     <tr class="intro-x clearanceSignatoriesloading_row">
                        <td colspan="${ colspan }" class="w-full text-center">
                            <div class="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center py-1">
                                <svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-8 h-8">
                                    <g fill="none" fill-rule="evenodd" stroke-width="4">
                                        <circle cx="22" cy="22" r="1">
                                            <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                                            <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                                        </circle>
                                        <circle cx="22" cy="22" r="1">
                                            <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                                            <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                                        </circle>
                                    </g>
                                </svg>
                            </div>
                        </td>
                     </tr>`;
    tableBody.append(loadingRow);

}
function clearanceSignatoriesNoResult(tableBody, message){

    const transactionList = `
                     <tr class="intro-x">
                        <td colspan="6" class="w-full text-center">

                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                            <a href="javascript:;" class=" text-slate-500 text-xs whitespace-nowrap">${  message }</a>
                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                        </td>
                     </tr>`;

    return tableBody.append(transactionList); // Append curriculum row to the table

}
function targetSignatoryLoadingSpinner(tableBody, colspan){

    let loadingRow = `
                     <tr class="intro-x loading-row">
                        <td colspan="${ colspan }" class="w-full text-center">
                            <div class="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center py-1">
                                <svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-8 h-8">
                                    <g fill="none" fill-rule="evenodd" stroke-width="4">
                                        <circle cx="22" cy="22" r="1">
                                            <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                                            <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                                        </circle>
                                        <circle cx="22" cy="22" r="1">
                                            <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                                            <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                                        </circle>
                                    </g>
                                </svg>
                            </div>
                        </td>
                     </tr>`;
    tableBody.append(loadingRow);

}

/** FUNCTION FOR UPDATING TABLE PAGINATION */
function updateEmployeeListPaginationLinks(data, paginationElementID) {

    const EmployeepaginationLinks = paginationElementID;
    EmployeepaginationLinks.empty(); // Clear the pagination links container

    const currentPage = data.current_page;
    const lastPage = data.last_page;
    const perPage = data.per_page;
    const totalEntries = data.total;
    const startEntry = (currentPage - 1) * perPage + 1;
    const endEntry = Math.min(currentPage * perPage, totalEntries);
    const summaryMessage = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

    // Add "Chevrons Left" link
    if (currentPage > 1) {
        EmployeepaginationLinks.append('<li class="page-item"><a class="page-link" href="#" data-page="1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-left" class="lucide lucide-chevrons-left w-4 h-4" data-lucide="chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></a></li>');
    }

    // Add "Chevron Left" link
    if (currentPage > 1) {
        EmployeepaginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-left" class="lucide lucide-chevron-left w-4 h-4" data-lucide="chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg></a></li>`);
    }

    // Add ellipsis link for skipped pages
    if (currentPage > 3) {
        EmployeepaginationLinks.append('<li class="page-item"><a class="page-link" href="#">...</a></li>');
    }

    // Add page links
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, lastPage); i++) {
        const activeClass = i === currentPage ? 'active' : '';
        EmployeepaginationLinks.append(`<li class="page-item ${activeClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
    }

    // Add ellipsis link for skipped pages
    if (currentPage < lastPage - 2) {
        EmployeepaginationLinks.append('<li class="page-item"><a class="page-link" href="#">...</a></li>');
    }

    // Add "Chevron Right" link
    if (currentPage < lastPage) {
        EmployeepaginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-right" class="lucide lucide-chevron-right w-4 h-4" data-lucide="chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></a></li>`);
    }

    // Add "Chevrons Right" link
    if (currentPage < lastPage) {
        EmployeepaginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${lastPage}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-right" class="lucide lucide-chevrons-right w-4 h-4" data-lucide="chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></a></li>`);
    }

    // Add the summary message
    const summaryContainer = $('.summary');
    summaryContainer.text(summaryMessage);
}
function updateClearanceOverviewPaginationLinks(data, paginationId, paginationSummaryId) {

    const paginationLinks = paginationId;
    paginationLinks.empty(); // Clear the pagination links container

    const currentPage = data.current_page;
    const lastPage = data.last_page;
    const perPage = data.per_page;
    const totalEntries = data.total;
    const startEntry = (currentPage - 1) * perPage + 1;
    const endEntry = Math.min(currentPage * perPage, totalEntries);
    // const summaryMessage = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;
    const summaryMessage = data.summary;

    // Add "Chevrons Left" link
    if (currentPage > 1) {
        paginationLinks.append('<li class="page-item"><a class="page-link" href="#" data-page="1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-left" class="lucide lucide-chevrons-left w-4 h-4" data-lucide="chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></a></li>');
    }

    // Add "Chevron Left" link
    if (currentPage > 1) {
        paginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-left" class="lucide lucide-chevron-left w-4 h-4" data-lucide="chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg></a></li>`);
    }

    // Add ellipsis link for skipped pages
    if (currentPage > 3) {
        paginationLinks.append('<li class="page-item"><a class="page-link" href="#">...</a></li>');
    }

    // Add page links
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, lastPage); i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationLinks.append(`<li class="page-item ${activeClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
    }

    // Add ellipsis link for skipped pages
    if (currentPage < lastPage - 2) {
        paginationLinks.append('<li class="page-item"><a class="page-link" href="#">...</a></li>');
    }

    // Add "Chevron Right" link
    if (currentPage < lastPage) {
        paginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-right" class="lucide lucide-chevron-right w-4 h-4" data-lucide="chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></a></li>`);
    }

    // Add "Chevrons Right" link
    if (currentPage < lastPage) {
        paginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${lastPage}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-right" class="lucide lucide-chevrons-right w-4 h-4" data-lucide="chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></a></li>`);
    }

    // Add the summary message
    const summaryContainer = paginationSummaryId;
    summaryContainer.text(summaryMessage);
}


