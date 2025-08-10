$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function () {

    fetchMyClearance();
    myClearanceActions();
    select2Handler();

});

function select2Handler(){

    $('#select_employee_list').select2({
        placeholder: "Select your Immediate Head / Supervisor",
        closeOnSelect: true,
        allowClear: true,
    });
}

/** FUNCTION FOR FETCHING MY CLEARANCE */
function fetchMyClearance(page, filters) {

    const myClearanceTableBody = $('#my_clearance_list_tbl tbody');
    const paginationId = $('#my_clearance_pagination');
    myClearanceTableBody.empty(); // Clear the table body first
    let colspan = 6;

    $.ajax({
        url: '/clearance/load/my-clearance?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {

            loadingSpinner(myClearanceTableBody, colspan);
        },
        success: function (data) {

            if(data.clearance.length > 0)
            {
                data.clearance.forEach(function (transaction) {

                    let print_action = '';
                    let has_pending_signatories = transaction.has_pending_signatories;
                    let pending_signatory_icon = '';

                    if(transaction.doesntHaveImmediateSupervisor)
                    {
                        $('.input_clearance_id').val(transaction.clearance_id);
                        $('.input_tracking_id').val(transaction.transaction_id);
                        __modal_toggle('immediate_supervisor_mdl');
                    }

                    if(transaction.status === '13' && !transaction.doesntHaveImmediateSupervisor)
                    {
                        print_action = `<a class="flex items-center mr-3 btn_print_my_clearance" href="/clearance/print/${ transaction.encrypted_id }" target="_blank"
                                        >
                                        <svg data-v-88732935="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-printer lucide-icon customizable w-4 h-4 mr-1"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"></path><rect x="6" y="14" width="12" height="8" rx="1"></rect></svg>
                                        Print
                                    </a>`;
                    }
                    else
                    {
                        print_action = `<a class="flex items-center text-danger btn_closed_clearance mr-3" href="javascript:;"
                                        >
                                        <svg data-v-88732935="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban lucide-icon customizable w-4 h-4 mr-1"><circle cx="12" cy="12" r="10"></circle><path d="m4.9 4.9 14.2 14.2"></path></svg>
                                        Closed
                                    </a>`;
                    }

                    if(has_pending_signatories)
                    {
                        pending_signatory_icon =`<div style="z-index: 99999" class="w-5 h-5 flex items-center justify-center absolute top-0 left-0 text-xs rounded-full bg-pending/10 text-pending font-medium -mt-1 -mr-1">
                                                <span class="my-1">${ transaction.count_pending_signatories }</span>
                                             </div>`;
                    }else
                    {
                        pending_signatory_icon =`<div style="z-index: 99999" class="w-5 h-5 flex items-center justify-center absolute top-0 left-0 text-xs rounded-full dark:bg-success/10 text-success font-medium -mt-1 -mr-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                                             </div>`;
                    }

                    // Create the HTML structure for each curriculum row
                    const transactionList = `
                     <tr class="intro-x">
                        <td class="w-10 my_clearance_list_tr"
                                data-colspan="${ colspan }"
                                data-clearance-id="${ transaction.clearance_id }"
                                data-transaction-id="${ transaction.transaction_id }"
                             >
                             <div class="text-slate-400 cursor-pointer my_clearance_td_chevron">
                                <svg data-v-88732935="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up lucide-icon customizable"><path d="m18 15-6-6-6 6"></path></svg>
                            </div>
                            ${ pending_signatory_icon }
                         </td>
                        <td class="">
                             <a href="javascript:;" class="font-medium whitespace-nowrap">${ transaction.clearance_name }</a>
                             <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ transaction.clearance_type }</div>
                        </td>
                        <td class="">
                             <a href="javascript:;" class="font-medium whitespace-nowrap">${ transaction.clearance_for }</a>
                        </td>
                        <td class="">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${ transaction.year }</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ transaction.sem }</div>
                        </td>
                        <td class=" items-center">
                            <div class="text-center">
                                <div class="flex justify-center items-center">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 cursor-pointer">
                                        ${ transaction.countMySignatories }
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="table-report__action">
                            <div class="flex justify-center items-center">
                                ${ print_action }
                            </div>
                        </td>
                     </tr>
                     <tr class="intro-x hidden my_clearance_list_tr_details">
                         <td colspan="${ colspan }" class="">
                         <div class="bg-slate-50 dark:bg-transparent border-2 border-dashed dark:border-darkmode-400 rounded-md p-3 col-span-12 mt-2">
                             <div class="intro-y block sm:flex items-center h-10">
                                    <h2 class="font-medium truncate mr-5">
                                        My Clearance Signatories
                                    </h2>
                                 </div>
                                 <div class="intro-y block sm:flex items-center h-10">
                                    <div class="hidden md:block mx-auto text-slate-500 pagination_summary_my_clearance_list"> -- </div>
                                 </div>
                                 <div class="intro-y overflow-x-auto sm:mt-0">
                                 <div class="px-2">
                                    <table class="table table-report table-hover sm:mt-2 my_clearance_list_tbl">
                                    <thead>
                                        <tr>
                                            <th class="whitespace-nowrap">Signatory Name</th>
                                            <th class="whitespace-nowrap">Status </th>
                                            <th class="whitespace-nowrap">Required Documents | Lacking</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                 </table>
                                 </div>
                              </div>
                              <!-- BEGIN: Pagination -->
                              <div class="intro-y flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-5">
                                <nav class="w-full sm:w-auto sm:mr-auto">
                                    <ul class="pagination my_clearance_list_pagination" data-clearance-target="${ transaction.clearance_target_program_id }" data-clearance-id="${ transaction.clearance_id }" data-colspan="${ colspan }" >
                                        <!-- Pagination links will be added here dynamically -->
                                    </ul>
                                </nav>
                                <select data-clearance-target="${ transaction.clearance_target_program_id }" data-clearance-id="${ transaction.clearance_id }" data-colspan="${ colspan }" class="w-20 form-select box mt-3 sm:mt-0 filter_size_clearance_my_clearance">
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
                    myClearanceTableBody.append(transactionList); // Append curriculum row to the table

                });
            }
            else
            {
                let message = 'No Data Found!.';
                noResult(myClearanceTableBody, message);
            }

            $('#loading-row').remove();
            updateClearanceListPaginationLinks(data, paginationId);
            $('#pagination_summary_my_clearance').text(data.summary);
        },
    });
}

/** FUNCTION FOR FETCHING MY CLEARANCE SIGNATORY ACTIVITIES*/
function fetchMyClearanceSignatoryActivities(page, filters, colspan){
    const my_clearance_list_tbl = $('.my_clearance_list_tbl tbody');
    const paginationElementID = $('.my_clearance_list_pagination');
    const mobile_ClearanceSignatoryDetails = $('.mobile_div_signatory_details');
    my_clearance_list_tbl.empty(); // Clear the table body first
    mobile_ClearanceSignatoryDetails.empty(); // Clear the table body first

    $.ajax({
        url: '/clearance/fetch/my/clearance/signatories/activities?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {

            loadingSpinner(my_clearance_list_tbl, colspan);

        },
        success: function (data) {

            let count = 0;
            let count_lacking = 0;
            let signatory_type = '';
            let mark_as = '';
            let can_edit_button = '';

            my_clearance_list_tbl.empty(); // Clear the table body first
            mobile_ClearanceSignatoryDetails.empty(); // Clear the table body first

            if(data.clearanceActivities.length > 0)
            {
                // Ensure all variables are declared outside the loop
                let signatory_type = '';
                let signatory_counter = 0;
                let my_lacking_remarks = '';

                data.clearanceActivities.forEach(function(transaction) {

                    if (transaction.myClearanceLacking.length > 0)
                    {
                        transaction.myClearanceLacking.forEach(function (lacking)
                        {
                            count_lacking++;
                            let mark_as = '';

                            // Determine the mark_as value based on lacking status
                            if (lacking.lacking_status === '7') {
                                mark_as = `<span class="underline decoration-dotted text-success ml-1"> -  Mark as : Complete</span>`;
                            } else if (lacking.lacking_status === '1') {
                                mark_as = `<span class="underline decoration-dotted text-pending ml-1"> -  Mark as : Pending </span>`;
                            }

                            // Append to lacking remarks
                            my_lacking_remarks += `<a href="javascript:;"><span class="px-2 py-0.5 bg-slate-100 text-slate-400 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">${count_lacking}</span>
                                                   <span class="text-xs mx-1 text-justify">${lacking.document} ${mark_as}</span></a> <br>`;
                        });
                    }else
                    {
                        my_lacking_remarks = ``;
                    }

                    if(transaction.order_by === '1')
                    {
                        can_edit_button = `<a class="flex items-center text-slate-500 btn_edit_signatory" href="javascript:;"
                                                data-activity-id="${ transaction.activity_id }"
                                                data-signatory-id="${ transaction.signatory_id }"
                                                data-clearance-id="${ transaction.clearance_id }"
                                                data-tracking-id="${ transaction.tracking_id }"
                                                >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-pen w-4 h-4 mr-1"><path d="M2 21a8 8 0 0 1 10.821-7.487"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="8" r="5"/></svg>
                                                Edit
                                            </a>
                                            <a class="flex items-center text-danger mx-3 btn_remove_signatory" href="javascript:;"
                                                 data-activity-id="${ transaction.activity_id }"
                                                 data-tracking-id="${ transaction.tracking_id }"
                                                 data-clearance-id="${ transaction.clearance_id }"
                                                 data-colspan="${ colspan }"
                                                >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                Remove
                                            </a>`;
                    }else
                    {
                        can_edit_button = ``;
                    }
                    const transactionList = `
                                <tr class="intro-x box">
                                    <td class="w-40">
                                        <a href="javascript:;" class="font-medium whitespace-nowrap">${transaction.fullName}</a>
                                        <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${transaction.designation}</div>
                                    </td>
                                    <td class="w-40">
                                        <a href="javascript:;" class="text-${transaction.clearance_status_class} whitespace-nowrap ml-1">${transaction.clearance_status}</a>
                                    </td>
                                    <td class="text-justify">
                                        ${my_lacking_remarks}
                                    </td>
                                    <td class="table-report__action">
                                        <div class="flex justify-center items-center">
                                           ${ can_edit_button }
                                        </div>
                                    </td>
                                </tr>`;

                    // Append curriculum row to the table
                    my_clearance_list_tbl.append(transactionList);
                });
            }
            else
            {
                let message = 'No Data Found!.';
                noResult(my_clearance_list_tbl, message);
            }

            $('.loading-row').remove();
            updateClearanceListPaginationLinks(data, paginationElementID);
            $('.pagination_summary_my_clearance_list').text(data.summary);
        },
        complete: function () {

        },
        error: function (jqXHR, textStatus, errorThrown) {
            /** ON ERROR: Handle the error */
            console.error('AJAX Error:', textStatus, errorThrown);
            // Display an error message to the user
            __swalErrorHandling('An error occurred while processing your request. Please try again later.');
        },
    });
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


/** FUNCTION FOR UPDATING TABLE PAGINATION */
function updateClearanceListPaginationLinks(data, paginationElementID) {

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


/** FUNCTION MY CLEARANCE ACTIONS */
function myClearanceActions(){

    let filters = {};

    /** SHOW CLEARANCE MORE DETAILS */
    $('body').on('click', '.my_clearance_list_tr', function () {

        let clearance_target_program = $(this).data('clearance-target');
        let clearance_id    = $(this).data('clearance-id');
        let transaction_id  = $(this).data('transaction-id');
        let colspan = $(this).data('colspan');
        let clickedRow = $(this).closest('tr').next('.my_clearance_list_tr_details');
        let chevronElement = $(this).find('.my_clearance_td_chevron');

        // Toggle the chevron class on the clicked element
        chevronElement.toggleClass('transform rotate-180');

        // Hide all other .clearance_group_tr_details rows and reset their chevron classes
        $('.my_clearance_list_tr_details').not(clickedRow).hide();
        $('.my_clearance_list_tr').not($(this)).find('.my_clearance_td_chevron').removeClass('transform rotate-180');


        // Toggle the visibility of the clickedRow
        clickedRow.toggle();
        filters.transaction_id  = transaction_id;
        filters.clearance_id    = clearance_id;

        fetchMyClearanceSignatoryActivities(1, filters, colspan);
    });

    /** RELOAD MY CLEARANCE */
    $('body').on('click', '.btn_reload_my_clearance', function (){

        fetchMyClearance();

    });

    /** FUNCTION FOR SAVING IMMEDIATE HEAD */
    $('body').on('click', '.btn_save_supervisor', function (){

        let this_button = $(this);
        let supervisor_id   = $('#select_employee_list').val();
        let clearance_id    = $('.input_clearance_id').val();
        let tracking_id     = $('.input_tracking_id').val();

        $.ajax({
            url: '/clearance/create-my-immediate-head',
            type: 'POST',
            data: { supervisor_id, clearance_id, tracking_id },
            dataType: 'json',
            beforeSend: function () {
                this_button.html('Saving...');
            },
            success: function (data) {

                if(data.success)
                {
                    __modal_toggle('immediate_supervisor_mdl');
                    fetchMyClearance();
                    this_button.html(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save w-4 h-4 mr-2"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>Save`);
                }
            },
        });

    });

    $('body').on('click', '.btn_close_mdl', function (){
        fetchMyClearance();
    });

    /** FUNCTION FOR EDITING HEAD */
    $('body').on('click', '.btn_edit_signatory', function (){

        let activity_id = $(this).data('activity-id');
        let signatory_id = $(this).data('signatory-id');
        let clearance_id= $(this).data('clearance-id');
        let tracking_id = $(this).data('tracking-id');

        $('.input_clearance_id').val(clearance_id);
        $('.input_tracking_id').val(tracking_id);
        $('.input_activity_id').val(activity_id);
        $('#select_employee_list').val(signatory_id).trigger('change');

        __modal_toggle('immediate_supervisor_mdl');
    });

    /** FUNCTION FOR REMOVING HEAD */
    $('body').on('click', '.btn_remove_signatory', function (){

        let filters = {};
        let activity_id  = $(this).data('activity-id');
        let colspan      = $(this).data('colspan');

        filters.transaction_id  = $(this).data('tracking-id');
        filters.clearance_id    = $(this).data('clearance-id');



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
                    url: '/clearance/remove-my-immediate-head',
                    type: 'POST',
                    data: { activity_id },
                    dataType: 'json',
                    beforeSend: function () {

                    },
                    success: function (response) {

                        if(response.hasDeleted)
                        {
                            $('.input_clearance_id').val(null);
                            $('.input_tracking_id').val(null);
                            $('.input_activity_id').val(null);
                            $('#select_employee_list').val(null).trigger('change');

                            __notif_show(1, 'Success', 'Removed successfully!');
                            fetchMyClearanceSignatoryActivities(1, filters, colspan);
                        }
                    },

                    complete: function () {


                    }
                });

            }
        });

    });
}

