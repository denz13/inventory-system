$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

let cscCurrentPage = 1; // Initialize the current page
let semCurrentPage = 1; // Initialize the current page
const doneTypingInterval = 1000; // 1 second
let typingTimer;

$(document).ready(function () {

    fetchCreatedCSCClearance();
    fetchCreatedSemestralClearance();

    smartFilters();
    lackingListActions();

});



/** FUNCTION FOR FETCHING CREATED CSC CLEARANCE */
function fetchCreatedCSCClearance(page, filters) {
    const cscDivElementID = $('#csc_clearance_list');
    cscDivElementID.empty();
    $.ajax({
        url: '/clearance/load/created/csc/clearance?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {
            boxLoadingSpinner(cscDivElementID);
        },
        success: function (data) {
            if (data.clearance.length > 0) {
                cscDivElementID.empty();
                data.clearance.forEach(function (item) {
                    const csc_clearance = `
                        <div class="relative my-4 btn_csc_view_details rounded-md"
                            data-clearance-id="${item.clearance_id}"
                            data-clearance-name="${item.clearance_name}"
                            data-clearance-hour="${item.clearance_time_created}"
                            data-clearance-date="${item.clearance_date_created}"
                            data-encrypted-id="${item.encrypted_id}"
                            >
                            <div class="event p-3 cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 flex items-center border border-dashed dark:border-darkmode-400 rounded-md">
                                <div class="w-2 h-2 bg-${item.status_class} rounded-full mr-3"></div>
                                <div class="pr-10">
                                    <div class="font-medium">${item.clearance_name}</div>
                                     <div class="mt-0.5"> <span class="text-slate-500 text-xs">Status:</span> <span class="text-${item.status_class} text-xs">${item.clearance_status}</span> </div>
                                    <div class="text-slate-500 text-xs mt-0.5"> <span class="">${item.clearance_date_created}</span> <span class="mx-1">•</span> ${item.clearance_time_created} </div>
                                </div>
                            </div>
                            <a class="flex items-center text-slate-500 absolute top-0 bottom-0 my-auto right-0 mr-4" href="javascript:;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse w-4 h-4"><path d="m3 10 2.5-2.5L3 5"/><path d="m3 19 2.5-2.5L3 14"/><path d="M10 6h11"/><path d="M10 12h11"/><path d="M10 18h11"/></svg>
                            </a>
                        </div>
                    `;
                    cscDivElementID.append(csc_clearance);
                });
            }else
            {
                cscDivElementID.empty();
                boxNoResult(cscDivElementID, 'No data found..');
            }

            const previousPageButton = $('#csc_prev');
            const nextPageButton = $('#csc_next');
            if (data.current_page === 1) {
                previousPageButton.prop('disabled', true);
                previousPageButton.addClass('text-slate-400');
            } else {
                previousPageButton.prop('disabled', false);
                previousPageButton.removeClass('text-slate-400');
            }
            if (data.current_page === data.last_page) {
                nextPageButton.prop('disabled', true);
                nextPageButton.addClass('text-slate-400');
            } else {
                nextPageButton.prop('disabled', false);
                nextPageButton.removeClass('text-slate-400');
            }

            $('#csc_clearance_summary').text(data.summary);
            $('.loadingSpinner').remove();

            // Update the current page
            cscCurrentPage = data.current_page;
        }
    });
}

/** FUNCTION FOR FETCHING CREATED SEMESTRAL CLEARANCE */
function fetchCreatedSemestralClearance(page, filters) {

    const semDivElementID = $('#sem_clearance_list');
    semDivElementID.empty();

    $.ajax({
        url: '/clearance/load/created/sem/clearance?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {

            boxLoadingSpinner(semDivElementID);

        },
        success: function (data) {

            if(data.clearance.length > 0)
            {
                semDivElementID.empty();
                data.clearance.forEach(function (item){

                    const csc_clearance =`
                            <div class="relative my-4 rounded-md btn_sem_view_details"
                                data-clearance-id="${item.clearance_id}"
                                data-clearance-name="${item.clearance_name}"
                                data-clearance-hour="${item.clearance_time_created}"
                                data-clearance-date="${item.clearance_date_created}"
                                data-encrypted-id="${item.encrypted_id}"
                                >
                                <div class="event p-3 cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 flex items-center border border-dashed dark:border-darkmode-400 rounded-md">
                                    <div class="w-2 h-2 bg-${item.status_class} rounded-full mr-3"></div>
                                    <div class="pr-10">
                                        <div class="font-medium">${item.clearance_name}</div>
                                            <div class="mt-0.5"> <span class="text-slate-500 text-xs">Status:</span> <span class="text-${item.status_class} text-xs">${item.clearance_status}</span> </div>
                                        <div class="text-slate-500 text-xs mt-0.5"> <span class="">${item.clearance_date_created}</span> <span class="mx-1">•</span> ${item.clearance_time_created} </div>
                                    </div>
                                </div>
                                <a class="flex items-center text-slate-500 absolute top-0 bottom-0 my-auto right-0 mr-4" href="javascript:;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse w-4 h-4"><path d="m3 10 2.5-2.5L3 5"/><path d="m3 19 2.5-2.5L3 14"/><path d="M10 6h11"/><path d="M10 12h11"/><path d="M10 18h11"/></svg>
                                </a>
                            </div>
                        `;

                    semDivElementID.append(csc_clearance);
                });
            }else
            {
                semDivElementID.empty();
                boxNoResult(semDivElementID, 'No data found..');
            }

            $('#sem_clearance_summary').text(data.summary);
            $('.loadingSpinner').remove();


            const previousPageButton = $('#sem_prev');
            const nextPageButton = $('#sem_next');
            if (data.current_page === 1) {
                previousPageButton.prop('disabled', true);
                previousPageButton.addClass('text-slate-400');
            } else {
                previousPageButton.prop('disabled', false);
                previousPageButton.removeClass('text-slate-400');
            }
            if (data.current_page === data.last_page) {
                nextPageButton.prop('disabled', true);
                nextPageButton.addClass('text-slate-400');
            } else {
                nextPageButton.prop('disabled', false);
                nextPageButton.removeClass('text-slate-400');
            }

            $('#sem_clearance_summary').text(data.summary);
            $('.loadingSpinner').remove();

            // Update the current page
            semCurrentPage = data.current_page;
        }
    });
}

/** FUNCTION FOR FETCHING LACKING LIST */
function fetchClearanceLackingList(page, filters) {

    const tableBody = $('#clearance_lacking_list_tbl tbody');
    const documentsDivElementID = $('#document_list');
    const documentsEmptyDiv     = $('#document_list_empty');
    const paginationId          = $('#clearance_lacking_list_pagination');
    const paginationSummary     = $('#pagination_summary_clearance_lacking_list');
    documentsDivElementID.empty();
    documentsEmptyDiv.empty();
    tableBody.empty();
    paginationSummary.empty();

    let colspan = 3;

    $.ajax({
        url: '/clearance/fetch-lacking-list?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {

            loadingSpinner(tableBody, colspan);

        },
        success: function (data) {

            tableBody.empty();
            paginationSummary.empty();

            if(data.lacking_list.length > 0)
            {
                data.lacking_list.forEach(function (transaction){
                    const transactionList = `
                     <tr class="intro-x">
                        <td class="w-10 lacking_list_tr" data-colspan="${ colspan }" data-clearance-id="${ transaction.clearance_id }" data-employee-id="${ transaction.lackingEmployeeID }">
                             <div class="text-slate-400 cursor-pointer lacking_list_td_chevron">
                                <svg data-v-88732935="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up lucide-icon customizable"><path d="m18 15-6-6-6 6"></path></svg>
                            </div>
                         </td>
                        <td class="">
                             <div class="font-medium whitespace-nowrap">${ transaction.employeeName }</div>
                             <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ transaction.lackingEmployeeID }</div>
                        </td>
                        <td class="table-report__action">
                            <div class="flex text-left items-center">
                                <div class="flex items-center ml-6 text-slate-500">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-x w-4 h-4 mr-2"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="m9.5 10.5 5 5"/><path d="m14.5 10.5-5 5"/></svg>
                                     ${ transaction.count_lacking } - Total Lacking
                                </di>
                            </div>
                        </td>
                     </tr>
                     <tr class="intro-x hidden lacking_list_tr_details">
                        <td colspan="${colspan}" class="">
                            <div class="border border-dashed dark:border-darkmode-400 rounded-md p-3 col-span-12">
                                <div class="p-2">
                                    <div class="intro-y overflow-x-auto mt-2 sm:mt-0">
                                        <table class="table table-report sm:mt-2 table-hover lacking_table">
                                            <thead>
                                            <tr>
                                                <th class="text-center whitespace-nowrap">#</th>
                                                <th class="text-left whitespace-nowrap">Status</th>
                                                <th class="text-center whitespace-nowrap">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>`;
                    tableBody.append(transactionList); // Append curriculum row to the table
                });
            }else
            {
                noResult(tableBody, 'No data found.');
            }

            updateClearanceListPaginationLinks(data, paginationId, '')
            $('.loading-row').remove();

            paginationSummary.text(data.summary);
        }
    });
}

/** FUNCTION FOR FETCHING STUDENTS LACKING REMARKS */
function fetchLackingListDetails(page, filters, colspan){
    const lacking_table = $('.lacking_table tbody');
    lacking_table.empty(); // Clear the table body first
    $.ajax({
        url: '/clearance/fetch-lacking-list-details?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {
            loadingSpinner(lacking_table, colspan);
        },
        success: function (response) {
            let count = 0;
            let actions = '';

            if(response.lacking_details.length > 0)
            {
                response.lacking_details.forEach(function (data){
                    count++;

                    if(data.lacking_status === '11')
                    {
                        actions = `<a class="hidden flex items-center text-slate-600" href="javascript:;"
                                data-student-id="${ data.student_id }"
                                data-student-name="${ data.fullname }"
                                data-student-course="${ data.programDesc }"
                                data-year-level="${ data.yearLevel }"
                                data-remarks="${ data.remarks }"
                                data-lacking-list-id="${ data.id }"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban w-4 h-4 mr-1"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
                                Edit
                             </a>
                                   <a class="flex items-center text-slate-600 ml-3" href="javascript:;"
                                        data-student-id="${ data.student_id }"
                                        data-lacking-list-id="${ data.id }"
                                        >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban w-4 h-4 mr-1"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
                                        Approve
                                     </a>
                                   <a class="flex items-center text-slate-600 ml-3" href="javascript:;"
                                        data-student-id="${ data.student_id }"
                                        data-lacking-list-id="${ data.id }"
                                        >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban w-4 h-4 mr-1"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
                                        Delete
                                     </a>`;
                    }else
                    {
                        actions = `
                                    <a class="hidden flex items-center text-slate-600 btn_edit_clearance_remarks" href="javascript:;"
                                        data-student-id="${ data.student_id }"
                                        data-student-name="${ data.fullname }"
                                        data-student-course="${ data.programDesc }"
                                        data-year-level="${ data.yearLevel }"
                                        data-remarks="${ data.remarks }"
                                        data-lacking-list-id="${ data.id }"
                                        data-signatory-id="${ data.signatory_id }"
                                        data-sem="${ data.sem }"
                                        data-year="${ data.year }"
                                        data-colspan="${ colspan }"
                                        >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="check-square" data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>
                                        Edit
                                    </a>
                                    <a class="flex items-center text-primary/80 ml-3 btn_add_approve_clearance" href="javascript:;"
                                            data-colspan="${ colspan }"
                                            data-clearance-id="${ data.clearance_id }"
                                            data-signatory-id="${ data.signatory_id }"
                                            data-employee-id="${ data.employee_id }"
                                            data-lacking-id="${ data.lacking_id }"
                                        >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="thumbs-up" data-lucide="thumbs-up" class="lucide lucide-thumbs-up block mx-auto w-4 h-4 mr-1"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"></path></svg>
                                        Approve
                                    </a>
                                    <a class="flex items-center text-danger ml-3 btn_delete_clearance_remarks" href="javascript:;"
                                            data-colspan="${ colspan }"
                                            data-clearance-id="${ data.clearance_id }"
                                            data-signatory-id="${ data.signatory_id }"
                                            data-employee-id="${ data.employee_id }"
                                            data-lacking-id="${ data.lacking_id }"
                                        >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        Delete
                                    </a>`;
                    }
                    // Create the HTML structure for each curriculum row
                    const transactionList = `
                     <tr class="intro-x">
                        <td class="w-10">
                            <div class="flex justify-center items-center">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-slate-300/50 border dark:border-darkmode-400 ml-2 text-slate-400 cursor-pointer">
                                    ${ count }
                                </div>
                            </div>
                        </td>
                        <td class="text-left text-justify w-50">
                             <div class="font-medium">${ data.lacking_title } </div>
                             <div class="text-xs text-slate-500">${ data.lacking_desc } </div>
                        </td>
                        <td class="text-center w-48">
                            <div class="font-medium text-${ data.status_class }">${ data.status_name }</a>
                        </td>
                        <td class="table-report__action">
                            <div class="flex justify-center items-center">
                                <div class="flex justify-center items-center">
                                    ${ actions }
                                </div>
                            </div>
                        </td>
                     </tr>`;
                    lacking_table.append(transactionList); // Append curriculum row to the table
                });
            }else
            {
                filters.clearance_id    = $('.input_clearance_id').val();
                fetchClearanceLackingList(1, filters);

                const noResult = `
                     <tr class="intro-x">
                        <td colspan="${ colspan }" class="w-full text-center">

                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                            <a href="javascript:;" class=" text-slate-500 text-xs whitespace-nowrap"> No data found! </a>
                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                        </td>
                     </tr>`;

                lacking_table.append(noResult); // Append curriculum row to the table
            }

            $('.loading-row').remove();
        },
    });
}

/** FETCH MY DESIGNATIONS */
function fetchMyDesignation(clearance_type){

    $.ajax({
        url: '/clearance/fetch-my-designations',
        type: "POST",
        data: { clearance_type },
        beforeSend: function () {

        },
        success: function (response) {
            $('.designation_select').empty();

            // Populate the select element with the new options
            response.designations.forEach(function (item) {

                if (item.signatory_primary_id && item.designation_name) {
                    $('.designation_select').append(`<option value="${item.signatory_primary_id}">${item.designation_name}</option>`);
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.error('Error fetching designations:', textStatus, errorThrown);
        }
    });

}

/** FUNCTION FOR SMART FILTERS */
function smartFilters() {

    let filters = {};
    // Event handler for filter search input
    $('#search_csc_clearance').on('keyup', function (event) {

        clearTimeout(typingTimer);
        filters.search_clearance = $(this).val();

        if (event.keyCode === 13) {
            // If the Enter key is pressed, fetch immediately without delay
            fetchCreatedCSCClearance(1, filters);
        } else {
            // Otherwise, set the timer to fetch after the doneTypingInterval
            typingTimer = setTimeout(function () {
                fetchCreatedCSCClearance(1, filters);
            }, doneTypingInterval);
        }
    });
    $('#search_sem_clearance').on('keyup', function (event) {

        clearTimeout(typingTimer);
        filters.search_clearance = $(this).val();

        if (event.keyCode === 13) {
            // If the Enter key is pressed, fetch immediately without delay
            fetchCreatedSemestralClearance(1, filters);
        } else {
            // Otherwise, set the timer to fetch after the doneTypingInterval
            typingTimer = setTimeout(function () {
                fetchCreatedSemestralClearance(1, filters);
            }, doneTypingInterval);
        }
    });

    $('#search_employee').on('keyup', function (event) {

        clearTimeout(typingTimer);
        filters.search_employee = $(this).val();
        filters.clearance_id    = $('.input_clearance_id').val();
        filters.limit           = parseInt($('#filter_size_lacking_list').val());

        if (event.keyCode === 13) {
            // If the Enter key is pressed, fetch immediately without delay
            fetchClearanceLackingList(1, filters);
        } else {
            // Otherwise, set the timer to fetch after the doneTypingInterval
            typingTimer = setTimeout(function () {
                fetchClearanceLackingList(1, filters);
            }, doneTypingInterval);
        }
    });

    $('body').on('change', '#filter_size_lacking_list', function (){

        filters.search_employee = $('#search_employee').val();
        filters.clearance_id    = $('.input_clearance_id').val();
        filters.limit           = parseInt($(this).val());
        fetchClearanceLackingList(1, filters);

    });

    $('body').on('click', '#clearance_lacking_list_pagination a', function (event) {
        event.preventDefault();

        const page = $(this).data('page');
        filters.search_employee = $('#search_employee').val();
        filters.clearance_id    = $('.input_clearance_id').val();
        filters.limit           = parseInt($('#filter_size_lacking_list').val());
        fetchClearanceLackingList(page, filters);
    });
}


/** FUNCTION FOR LACKING LIST ACTIONS */
function lackingListActions(){

    let filters = {};

    $('body').on('click', '.btn_pill_csc', function (){

        $('.document_content_div').hide();
        $('.default_view').show();
        fetchCreatedCSCClearance();

    });
    $('body').on('click', '.btn_pill_sem', function (){

        $('.document_content_div').hide();
        $('.default_view').show();
        fetchCreatedSemestralClearance();

    });

    $('#csc_prev').click(function () {
        if (cscCurrentPage > 1) {
            filters.search_clearance = $('#search_csc_clearance').val();
            fetchCreatedCSCClearance(cscCurrentPage - 1, filters);
        }
    });
    $('#csc_next').click(function () {
        filters.search_clearance = $('#search_csc_clearance').val();
        fetchCreatedCSCClearance(cscCurrentPage + 1, filters);
    });

    $('#sem_prev').click(function () {
        if (semCurrentPage > 1) {
            filters.search_clearance = $('#search_sem_clearance').val();
            fetchCreatedSemestralClearance(semCurrentPage - 1, filters);
        }
    });
    $('#sem_next').click(function () {
        filters.search_clearance = $('#search_sem_clearance').val();
        fetchCreatedSemestralClearance(semCurrentPage + 1, filters);
    });

    $('body').on('click', '.btn_csc_view_details', function (){
        // Remove the class from all elements
        $('.btn_csc_view_details').removeClass('bg-primary');
        $('.btn_csc_view_details .font-medium, .btn_csc_view_details .text-slate-500, .btn_csc_view_details .text-xs').removeClass('text-white');

        // Add the class to the clicked element
        $(this).addClass('bg-primary');
        $(this).find('.font-medium, .text-slate-500, .text-xs').addClass('text-white');

        // Get the data attributes from the clicked element
        let encrypted_id    = $(this).data('encrypted-id');
        let clearance_id    = $(this).data('clearance-id');
        let clearance_name  = $(this).data('clearance-name');
        let clearance_hour  = $(this).data('clearance-hour');
        let clearance_date  = $(this).data('clearance-date');
        let clearance_type  = 1;

        // Update the UI elements with the data
        $('.input_clearance_id').val(clearance_id);
        $('.label_clearance_title').text(clearance_name);
        $('.label_hour').text(clearance_hour);
        $('.label_date').text(clearance_date);
        $('.document_content_div').show();

        fetchMyDesignation(clearance_type);

        $('.default_view').hide();

        filters.clearance_id = clearance_id;
        filters.limit        = parseInt($('#filter_size_lacking_list').val());
        fetchClearanceLackingList(1, filters);

        let add_employee_lacking_link = `/clearance/add-employee-lacking/${clearance_id}`;
        $('.btn_add_employee').attr('href', add_employee_lacking_link);

    });
    $('body').on('click', '.btn_sem_view_details', function (){
        // Remove the class from all elements
        $('.btn_sem_view_details').removeClass('bg-primary');
        $('.btn_sem_view_details .font-medium, .btn_sem_view_details .text-slate-500, .btn_sem_view_details .text-xs').removeClass('text-white');

        // Add the class to the clicked element
        $(this).addClass('bg-primary');
        $(this).find('.font-medium, .text-slate-500, .text-xs').addClass('text-white');

        // Get the data attributes from the clicked element
        let encrypted_id    = $(this).data('encrypted-id');
        let clearance_id    = $(this).data('clearance-id');
        let clearance_name  = $(this).data('clearance-name');
        let clearance_hour  = $(this).data('clearance-hour');
        let clearance_date  = $(this).data('clearance-date');

        let clearance_type  = 2;

        // Update the UI elements with the data
        $('.input_clearance_id').val(clearance_id);
        $('.label_clearance_title').text(clearance_name);
        $('.label_hour').text(clearance_hour);
        $('.label_date').text(clearance_date);
        $('.document_content_div').show();

        fetchMyDesignation(clearance_type);

        $('.default_view').hide();

        filters.clearance_id = clearance_id;
        filters.limit        = parseInt($('#filter_size_lacking_list').val());
        fetchClearanceLackingList(1, filters);

        let add_employee_lacking_link = `/clearance/add-employee-lacking/${clearance_id}`;
        $('.btn_add_employee').attr('href', add_employee_lacking_link);

    });


    /** SHOW LACKING LIST MORE DETAILS */
    $('body').on('click', '.lacking_list_tr', function () {

        let colspan      = $(this).data('colspan');
        let employee_id  = $(this).data('employee-id');
        let clearance_id = $(this).data('clearance-id');
        let clickedRow   = $(this).closest('tr').next('.lacking_list_tr_details');
        let chevronElement = $(this).find('.lacking_list_td_chevron');

        // Toggle the chevron class on the clicked element
        chevronElement.toggleClass('transform rotate-180');

        // Hide all other .clearance_group_tr_details rows and reset their chevron classes
        $('.lacking_list_tr_details').not(clickedRow).hide();
        $('.lacking_list_tr').not($(this)).find('.lacking_list_td_chevron').removeClass('transform rotate-180');

        // Toggle the visibility of the clickedRow
        clickedRow.toggle();

        filters.clearance_id = clearance_id;
        filters.employee_id  = employee_id;
        fetchLackingListDetails(1, filters, colspan);
    });


    /** LACKING LIST APPROVE LACKING */
    $('body').on('click', '.btn_add_approve_clearance',function (){

        let clearance_id = $(this).data('clearance-id');
        let employee_id = $(this).data('employee-id');
        let lacking_id = $(this).data('lacking-id');

        $.ajax({
            url: '/clearance/approve-lacking',
            type: "POST",
            data: { lacking_id },
            beforeSend: function () {

            },
            success: function (response) {
                if (response.success)
                {
                    Swal.fire({
                        icon:  'success',
                        title: 'Success',
                        text:  'Approved successfully',
                        showConfirmButton: false,
                        timerProgressBar: true,
                        timer: 1000  // Close the alert after 1 second
                    });

                    filters.clearance_id    = clearance_id;
                    filters.employee_id     = employee_id;
                    fetchLackingListDetails(1, filters);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.error('Error fetching designations:', textStatus, errorThrown);
            }
        });
    });


}

/** FUNCTION FOR TABLE DYNAMIC NO RESULTS AND LOADING SPINNER */
function noResult(tableBody, message){

    const transactionList = `
                     <tr class="intro-x">
                        <td colspan="7" class="w-full text-center">

                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                            <a href="javascript:;" class=" text-slate-400 text-xs whitespace-nowrap">${  message }</a>
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
function boxLoadingSpinner(divElement){

    let spinner = `<div class="my-4 loadingSpinner">
                        <div class="p-3 w-full flex justify-center cursor-pointer">
                            <div class="text-center">
                                <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="60" cy="15" r="9" fill-opacity="0.3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle></svg>
                            </div>
                        </div>
                     </div>`;
    divElement.append(spinner);
}
function boxNoResult(divElement, message){
    let spinner = `<div class="my-4 border border-dashed dark:border-darkmode-400 rounded-md">
                        <div class="p-3 w-full flex justify-center cursor-pointer">
                            <div class="text-center">
                                <div class="text-slate-400 text-xs">${message}</div>
                            </div>
                        </div>
                     </div>`;
    divElement.append(spinner);
}
function emptyDocuments(documentsEmptyDiv){
    const divElement = `<div class="w-32 h-32 flex-none image-fit rounded-full overflow-hidden mx-auto">
                            <img alt="Empty Documents" src="/dist/images/empty.webp">
                        </div>
                        <div class="text-center items-center">
                            <div class="font-medium">No Documents Found</div>
                            <a href="javascript:;" class="text-slate-500 mt-2 btn_add_new_document">Please click <strong class="text-primary">Add New Document</strong> Button to create new.</a>
                        </div>`;

    documentsEmptyDiv.html(divElement);
}
function customDocumentsLoading(documentsEmptyDiv){

    const divElement = `<div class="p-3 w-full flex justify-center cursor-pointer document_loading_icon">
                            <div class="text-center">
                            <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="60" cy="15" r="9" fill-opacity="0.3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle></svg>
                        </div>`;

    documentsEmptyDiv.html(divElement);
}

/** FUNCTION FOR UPDATING TABLE PAGINATION */
function updateClearanceListPaginationLinks(data, paginationId, paginationSummaryId) {

    const paginationLinks = paginationId;
    paginationLinks.empty(); // Clear the pagination links container

    const currentPage = data.current_page;
    const lastPage = data.last_page;

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

}
