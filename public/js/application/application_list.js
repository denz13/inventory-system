var  _token = $('meta[name="csrf-token"]').attr('content');
var bpath = window.location.origin;
var tbl_data_applicant_list;

var currentCampus = null;
var Position = null;
var currentFilterSize = null;

$(document).ready(function (){

    bpath = __basepath + "/";


    fetchJobHiringList();
    filterSizeEvents();
    filterJobHiringListBySearch();
    filterJobHiringListByPositionAndCampus();
    tableJobHiringListActions();
    PaginationEventHandler();
    filterApplicantsListBySearch();
    viewApplicantDetails();
    approveDisapproveApplicants();
    viewApplicantsAttachments();

    select2_event_handler();

});


function select2_event_handler(){

    $('#select_applicant_status').select2({
       placeholder: "Select Status",
    });


    $('#applied_pos').on('select2:select', function (e) {
        // Do something

        let position_ref_num = $(this).val();

        let applicant_id = $(this).children('option:selected').data('applicant-id')

        $('#applicant_id').val(applicant_id);
        $('#job_ref_no').val(position_ref_num);

        $.ajax({
            url: bpath + 'application/get/job/attachments',
            type: "POST",
            data: {
                _token, position_ref_num, applicant_id
            },
            success: function (response) {
                var data = JSON.parse(response);

                let attachments_list = data['attachments_list'];

                $('#dt__attachment_list tbody tr').detach();
                $('#dt__attachment_list tbody').append(attachments_list);

            }
        });

    });

}


// Function to fetch JOB HIRING LIST data from the server using AJAX
function fetchJobHiringList(page, filters) {

    const tableBody = $('#dt__applicant_list tbody');
    tableBody.empty(); // Clear the table body first

    let colspan = 6;

    $.ajax({
        url: '/application/get/open/job/list?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        headers: {
            'X-CSRF-TOKEN': _token,
        },
        beforeSend: function () {

            // showLoading();
            loadingSpinner(tableBody, colspan);

        },
        success: function (data) {


            /**  Update the table with the received data */


            if(data.search_query)
            {
                if(data.search_query == '')
                {
                    let message = 'No Data Available';
                    noResult(tableBody, colspan, message);
                }

                data.search_query.forEach(function (data) {

                    // Create the HTML structure for each curriculum row
                    const transactionList = `
                     <tr class="intro-x">
                        <td class="w-40 !py-4"> <a href="javascript:;" class="underline decoration-dotted whitespace-nowrap">${ data.plantilla_item_no }</a> </td>
                        <td>
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${ data.position }</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">Salary Grade: <span class="font-medium whitespace-nowrap">${ data.sg }</span> - Step: <span class="font-medium whitespace-nowrap"> ${ data.step } </span></div>
                        </td>
                         <td>
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${ data.assign_agency }</a>
                        </td>
                        <td class="text-center">
                            <div data-jobref-no="${ data.jobref_no }" data-modal-title="${ data.position }" class="flex justify-center items-center fa-beat btn_view_applicants">
                                <a href="javascript:;" class="box flex items-center px-3 py-2 rounded-md bg-white/10 dark:bg-darkmode-700 font-medium">
                                    <i class="fa-solid fa-users w-4 h-4 mr-1"></i>
                                    <span class="text-slate-500 text-xs">${ data.count_applicants }</span>
                                </a>
                            </div>
                        </td>
                        <td class="text-center">
                            <div> <span class="text-slate-500 whitespace-nowrap">Posting:</span> <span class="font-medium whitespace-nowrap">${ data.post_date }</span> </div>
                            <div> <span class="text-slate-500 whitespace-nowrap">Closing:</span> <span class="font-medium whitespace-nowrap">${ data.close_date }</span> </div>

                        </td>

                        <td class="table-report__action">
                            <div class="flex justify-center items-center">
                                <a class="flex items-center text-primary whitespace-nowrap mr-5 btn_view_applicants" href="javascript:;"
                                data-jobref-no="${ data.jobref_no }"
                                data-modal-title="${ data.position }"
                                >

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="eye" data-lucide="eye" class="lucide lucide-eye w-4 h-4 mr-1"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                View Applicants </a>

                            </div>
                        </td>
                     </tr>`;
                    tableBody.append(transactionList); // Append curriculum row to the table
                });
            }else
            {
                if(data.jobHiringList == '')
                {
                    let message = 'No Data Available.';
                    noResult(tableBody, colspan, message);
                }

                data.jobHiringList.forEach(function (data) {

                    // Create the HTML structure for each curriculum row
                    const transactionList = `
                     <tr class="intro-x">
                        <td class="w-40 !py-4"> <a href="javascript:;" class="underline decoration-dotted whitespace-nowrap">${ data.plantilla_item_no }</a> </td>
                        <td>
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${ data.position }</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">Salary Grade: <span class="font-medium whitespace-nowrap">${ data.sg }</span> - Step: <span class="font-medium whitespace-nowrap"> ${ data.step } </span></div>
                        </td>
                         <td>
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${ data.assign_agency }</a>
                        </td>
                        <td class="text-center">
                            <div data-jobref-no="${ data.jobref_no }" data-modal-title="${ data.position }" class="flex justify-center items-center fa-beat btn_view_applicants">
                                <a href="javascript:;" class="box flex items-center px-3 py-2 rounded-md bg-white/10 dark:bg-darkmode-700 font-medium">
                                    <i class="fa-solid fa-users w-4 h-4 mr-1"></i>
                                    <span class="text-slate-500 text-xs">${ data.count_applicants }</span>
                                </a>
                            </div>
                        </td>
                        <td class="text-center">
                            <div> <span class="text-slate-500 whitespace-nowrap">Posting:</span> <span class="font-medium whitespace-nowrap">${ data.post_date }</span> </div>
                            <div> <span class="text-slate-500 whitespace-nowrap">Closing:</span> <span class="font-medium whitespace-nowrap">${ data.close_date }</span> </div>

                        </td>

                        <td class="table-report__action">
                            <div class="flex justify-center items-center">
                                <a class="flex items-center text-primary whitespace-nowrap mr-5 btn_view_applicants" href="javascript:;"
                                data-jobref-no="${ data.jobref_no }"
                                data-modal-title="${ data.position }"
                                >

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="eye" data-lucide="eye" class="lucide lucide-eye w-4 h-4 mr-1"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                View Applicants </a>

                            </div>
                        </td>
                     </tr>`;
                    tableBody.append(transactionList); // Append curriculum row to the table
                });
            }



            // Update the pagination links
            updateJobHiringListPaginationLinks(data);

            // Show the summary message
            const paginationSummary = $('#pagination-summary');
            paginationSummary.text(data.summary);
        },
        complete: function () {

            // hideLoading();
            $('#loading-row').remove();

        }
    });
}
function updateJobHiringListPaginationLinks(data) {

    const JobHiringPaginationLinks = $('#jobHiringList_pagination');
    JobHiringPaginationLinks.empty(); // Clear the pagination links container

    const currentPage = data.current_page;
    const lastPage = data.last_page;
    const perPage = data.per_page;
    const totalEntries = data.total;
    const startEntry = (currentPage - 1) * perPage + 1;
    const endEntry = Math.min(currentPage * perPage, totalEntries);
    const summaryMessage = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;


    // Add "Chevrons Left" link
    if (currentPage > 1) {
        JobHiringPaginationLinks.append('<li class="page-item"><a class="page-link" href="#" data-page="1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-left" class="lucide lucide-chevrons-left w-4 h-4" data-lucide="chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></a></li>');
    }

    // Add "Chevron Left" link
    if (currentPage > 1) {
        JobHiringPaginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-left" class="lucide lucide-chevron-left w-4 h-4" data-lucide="chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg></a></li>`);
    }

    // Add ellipsis link for skipped pages
    if (currentPage > 3) {
        JobHiringPaginationLinks.append('<li class="page-item"><a class="page-link" href="#">...</a></li>');
    }

    // Add page links
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, lastPage); i++) {
        const activeClass = i === currentPage ? 'active' : '';
        JobHiringPaginationLinks.append(`<li class="page-item ${activeClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
    }

    // Add ellipsis link for skipped pages
    if (currentPage < lastPage - 2) {
        JobHiringPaginationLinks.append('<li class="page-item"><a class="page-link" href="#">...</a></li>');
    }

    // Add "Chevron Right" link
    if (currentPage < lastPage) {
        JobHiringPaginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-right" class="lucide lucide-chevron-right w-4 h-4" data-lucide="chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></a></li>`);
    }

    // Add "Chevrons Right" link
    if (currentPage < lastPage) {
        JobHiringPaginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${lastPage}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-right" class="lucide lucide-chevrons-right w-4 h-4" data-lucide="chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></a></li>`);
    }

    // Add the summary message
    const summaryContainer = $('.summary');
    summaryContainer.text(summaryMessage);
}



function filterJobHiringListBySearch(){

    // Event handler for filter search input
    let typingTimer;
    const doneTypingInterval = 1000; // 1 second

    $('#filter-search').on('keyup', function (event) {

        clearTimeout(typingTimer);
        const searchKeyword = $(this).val();
        if (event.keyCode === 13) {
            // If the Enter key is pressed, fetch immediately without delay
            fetchFilteredJoHiringData(searchKeyword);
        } else {
            // Otherwise, set the timer to fetch after the doneTypingInterval
            typingTimer = setTimeout(function () {
                fetchFilteredJoHiringData(searchKeyword);
            }, doneTypingInterval);
        }
    });

    // Function to fetch filtered student data from the server using AJAX
    function fetchFilteredJoHiringData(searchKeyword) {

        let page_number = $('#jobHiringListSize').val();

        const filters = {
            search: searchKeyword,
            page_number: page_number,

        };

        fetchJobHiringList(1, filters);
    }


}
function filterJobHiringListByCampus(){




}
function filterJobHiringListByPositionAndCampus(){

    $('body').on('click', '.btn_close_filter_pos_dd', function (){
        __dropdown_close('#filter_position_dd');
    });


    /** JOB HIRING LIST Event handler for CAMPUS select box */
    $('body').on('change','#filter-campus', function () {

        currentCampus = $(this).val();

    });

    /** JOB HIRING LIST Event handler for CAMPUS select box */
    $('body').on('change','#filter-position', function () {

        Position = $(this).val();

    });


    $('body').on('click', '.btn_search_filtered_pos', function (){


        currentFilterSize = $('#filter-jobHiringListSize').val();

        const filters = {

            Position: Position,
            Campus: currentCampus,
            currentFilterSize: currentFilterSize,

        };

        fetchJobHiringList(1, filters); // Fetch the first page of data with the applied filters and updated size

    });


}
function tableJobHiringListActions(){

    /** BUTTON CLICK TO VIEW APPLICANTS */
    $('body').on('click', '.btn_view_applicants', function (){

        let modal_title = $(this).data('modal-title');

        $('.mdl_applicant_list_title').text(modal_title+' - '+'Applicants List');

        __modal_toggle('new_applicant_list_mdl');


        let jobRef_no = $(this).data('jobref-no');
        $('#input_jobref_no').val(jobRef_no);


        const filters = {

            jobref_no: jobRef_no,

        };

        fetchApplicantList(1, filters);
    });

}




// Function to fetch JOB HIRING LIST data from the server using AJAX
function fetchApplicantList(page, filters) {

    const applicantsTableBody = $('#table_applicants_list tbody');
    applicantsTableBody.empty(); // Clear the table body first

    let colspan = 5;
    let count = 0;

    $.ajax({
        url: '/application/get/opened/job/applicants/list?page=' + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        headers: {
            'X-CSRF-TOKEN': _token,
        },
        beforeSend: function () {

            // showLoading();
            loadingSpinner(applicantsTableBody, colspan);
        },
        success: function (data) {


            /**  Update the table with the received data */


            if(data.search_value)
            {
                if(data.search_value == '')
                {
                    let message = 'No Data Available';
                    noResult(applicantsTableBody, colspan, message);
                }

                data.search_value.forEach(function (data) {

                    // Create the HTML structure for each curriculum row
                    const transactionList = `
                     <tr class="intro-x">
                        <td class="!py-3.5">
                            <div class="flex items-center">
                                <div class="w-9 h-9 image-fit zoom-in">
                                        <img data-action="zoom" alt="Profile Picture" class="rounded-lg border-white shadow-md z-10" src="${ data.profile_pic }">
                                </div>
                                <div class="ml-4">
                                    <a href="javascript:;" class="font-medium whitespace-nowrap">${ data.applicant_name }</a>
                                    <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ data.applicant_id }</div>
                                </div>
                            </div>
                        </td>
                         <td>
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${ data.position }</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ data.date_applied }</div>
                        </td>


                        <td class="table-report__action">
                            <div class="flex justify-center items-center">
                                <a class="flex items-center text-primary whitespace-nowrap mr-5 btn_view_applicant_details" href="javascript:;"
                                data-application-id="${ data.application_id }"
                                data-applicant-id="${ data.applicant_id }"
                                data-job-ref-no="${ data.job_ref_no }"
                                data-profile-picture="${ data.profile_pic }"
                                data-applicant-name="${ data.applicant_name }"
                                data-position="${ data.position }"
                                data-status="${ data.applicant_status }"
                                data-status-class="${ data.applicant_status_class }"
                                data-date-applied="${ data.date_applied }"
                                data-date-acted="${ data.date_acted }"
                                data-comment="${ data.application_note }"
                                >

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="check-square" data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg> View Details </a>

                            </div>
                        </td>
                     </tr>`;
                    applicantsTableBody.append(transactionList); // Append curriculum row to the table
                });
            }else
            {
                if(data.jobApplicantList == '')
                {
                    let message = 'No Data Available.';
                    noResult(applicantsTableBody, colspan, message);
                }

                data.jobApplicantList.forEach(function (data) {

                    count++;
                    // Create the HTML structure for each curriculum row
                    const transactionList = `
                     <tr class="intro-x">
                        <td class="!py-3.5">
                            <div class="flex items-center">
                                <div class="w-9 h-9 image-fit zoom-in">
                                        <img data-action="zoom" alt="Profile Picture" class="rounded-lg border-white shadow-md z-10" src="${ data.profile_pic }">
                                </div>
                                <div class="ml-4">
                                    <a href="javascript:;" class="font-medium whitespace-nowrap">${ data.applicant_name }</a>
                                    <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ data.applicant_id }</div>
                                </div>
                            </div>
                        </td>
                         <td>
                            <a href="javascript:;" class="font-medium whitespace-nowrap text-toldok tooltip" title="${ data.position }">${ data.position }</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${ data.date_applied }</div>
                        </td>
                         <td class="text-center">
                            <div data-job-ref-no="${ data.job_ref_no }" data-applicant-id="${ data.applicant_id }" class="flex justify-center items-center">
                                <a href="javascript:;" class="box flex items-center px-3 py-2 rounded-md bg-white/10 dark:bg-darkmode-700 font-medium">
                                    <div class="w-2 h-2 bg-${ data.applicant_status_class } rounded-full mr-3"></div>
                                    <span class="text-${ data.applicant_status_class } text-xs">${ data.applicant_status }</span>
                                </a>
                            </div>
                        </td>
                        <td class="text-center">
                            <div data-job-ref-no="${ data.job_ref_no }" data-applicant-id="${ data.applicant_id }" class="flex justify-center items-center btn_view_applicant_attachments">
                                <a href="javascript:;" class="box flex items-center px-3 py-2 rounded-md bg-white/10 dark:bg-darkmode-700 font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="folder" data-lucide="folder" class="lucide lucide-folder w-4 h-4 mr-2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"></path></svg>
                                    <span class="text-slate-500 text-xs">${ data.count_applicant_attachments }</span>
                                </a>
                            </div>
                        </td>
                        <td class="table-report__action">
                            <div class="flex justify-center items-center">
                                <a class="flex items-center text-primary whitespace-nowrap mr-5 btn_view_applicant_details" href="javascript:;"
                                data-application-id="${ data.application_id }"
                                data-applicant-id="${ data.applicant_id }"
                                data-job-ref-no="${ data.job_ref_no }"
                                data-profile-picture="${ data.profile_pic }"
                                data-applicant-name="${ data.applicant_name }"
                                data-position="${ data.position }"
                                data-status="${ data.applicant_status }"
                                data-status-class="${ data.applicant_status_class }"
                                data-date-applied="${ data.date_applied }"
                                 data-date-acted="${ data.date_acted }"
                                data-comment="${ data.application_note }"
                                >

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="eye" data-lucide="eye" class="lucide lucide-eye w-4 h-4 mr-1"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                View Details </a>

                            </div>
                        </td>
                     </tr>`;
                    applicantsTableBody.append(transactionList); // Append curriculum row to the table
                });
            }



            // Update the pagination links
            updateApplicantsListPaginationLinks(data);

            // Show the summary message
            const paginationSummary = $('#pagination-summary');
            paginationSummary.text(data.summary);
        },
        complete: function () {

            // hideLoading();
            $('#loading-row').remove();

        }
    });
}
function filterApplicantsListBySearch(){

    // Event handler for filter search input
    let typingTimer;
    const doneTypingInterval = 1000; // 1 second

    $('#filter-search-applicants').on('keyup', function (event) {

        clearTimeout(typingTimer);
        const searchKeyword = $(this).val();
        if (event.keyCode === 13) {
            // If the Enter key is pressed, fetch immediately without delay
            fetchFilteredApplicantsData(searchKeyword);
        } else {
            // Otherwise, set the timer to fetch after the doneTypingInterval
            typingTimer = setTimeout(function () {
                fetchFilteredApplicantsData(searchKeyword);
            }, doneTypingInterval);
        }
    });

    // Function to fetch filtered student data from the server using AJAX
    function fetchFilteredApplicantsData(searchKeyword) {

        let page_number = $('#filter-applicantListSize').val();
        let jobref_no = $('#input_jobref_no').val();

        const filters = {

            jobref_no: jobref_no,
            search: searchKeyword,
            limit: page_number,

        };

        fetchApplicantList(1, filters);
    }


}
function updateApplicantsListPaginationLinks(data) {

    const ApplicantsListPaginationLinks = $('#applicantList_pagination');
    ApplicantsListPaginationLinks.empty(); // Clear the pagination links container

    const currentPage = data.current_page;
    const lastPage = data.last_page;
    const perPage = data.per_page;
    const totalEntries = data.total;
    const startEntry = (currentPage - 1) * perPage + 1;
    const endEntry = Math.min(currentPage * perPage, totalEntries);
    const summaryMessage = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;


    // Add "Chevrons Left" link
    if (currentPage > 1) {
        ApplicantsListPaginationLinks.append('<li class="page-item"><a class="page-link" href="#" data-page="1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-left" class="lucide lucide-chevrons-left w-4 h-4" data-lucide="chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></a></li>');
    }

    // Add "Chevron Left" link
    if (currentPage > 1) {
        ApplicantsListPaginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-left" class="lucide lucide-chevron-left w-4 h-4" data-lucide="chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg></a></li>`);
    }

    // Add ellipsis link for skipped pages
    if (currentPage > 3) {
        ApplicantsListPaginationLinks.append('<li class="page-item"><a class="page-link" href="#">...</a></li>');
    }

    // Add page links
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, lastPage); i++) {
        const activeClass = i === currentPage ? 'active' : '';
        ApplicantsListPaginationLinks.append(`<li class="page-item ${activeClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
    }

    // Add ellipsis link for skipped pages
    if (currentPage < lastPage - 2) {
        ApplicantsListPaginationLinks.append('<li class="page-item"><a class="page-link" href="#">...</a></li>');
    }

    // Add "Chevron Right" link
    if (currentPage < lastPage) {
        ApplicantsListPaginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-right" class="lucide lucide-chevron-right w-4 h-4" data-lucide="chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></a></li>`);
    }

    // Add "Chevrons Right" link
    if (currentPage < lastPage) {
        ApplicantsListPaginationLinks.append(`<li class="page-item"><a class="page-link" href="#" data-page="${lastPage}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-right" class="lucide lucide-chevrons-right w-4 h-4" data-lucide="chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></a></li>`);
    }

    // Add the summary message
    const summaryContainer = $('.summary');
    summaryContainer.text(summaryMessage);
}




function viewApplicantDetails(){

    $('body').on('click', '.btn_view_applicant_details', function (){

        let this_button = $(this);
        let jobRef_no = $(this).data('job-ref-no');
        let application_id = $(this).data('application-id');
        let applicant_id = $(this).data('applicant-id');
        let profile_pic = $(this).data('profile-picture');
        let applicant_name = $(this).data('applicant-name');
        let position = $(this).data('position');
        let status = $(this).data('status');
        let status_class = $(this).data('status-class');
        let date_applied = $(this).data('date-applied');
        let date_acted = $(this).data('date-acted');
        let comment = $(this).data('comment');

        let applicant_comment = '';


        let div_id = $('#mdl_applicant_details_attachments_div');
        let applicant_profile_div = $('#applicant_profile_mdl_div');

        div_id.empty(); // Clear the DIV first
        applicant_profile_div.empty(); // Clear the DIV first

        __modal_toggle('application_details_mdl');

        getApplicantsFileAttachments(div_id, this_button, jobRef_no, applicant_id);

        if(status == 'Disapproved')
        {
            applicant_comment = `
                                <div class="flex items-center text-slate-500 text-xs whitespace-nowrap mt-2">
                                    <span class="bg-${ status_class } text-white text-xs px-2 py-1 rounded">${ status }</span>
                                    <span class="ml-2"> on  <span class="ml-1"> ${ date_acted } </span></span>
                                </div>
                                <div class="mt-2">
                                    <div id="faq-accordion-1" class="accordion">
                                         <div class="accordion-item">
                                             <div id="faq-accordion-content-2" class="accordion-header">
                                                <button class="accordion-button collapsed" type="button" data-tw-toggle="collapse" data-tw-target="#faq-accordion-collapse-2" aria-expanded="false" aria-controls="faq-accordion-collapse-2"> <span class="underline"> Comment </span> </button>
                                                </div>
                                             <div id="faq-accordion-collapse-2" class="accordion-collapse collapse" aria-labelledby="faq-accordion-content-2" data-tw-parent="#faq-accordion-1">
                                                 <div class="accordion-body text-slate-600 dark:text-slate-500 leading-relaxed text-justify"> ${ comment } </div>
                                             </div>
                                         </div>
                                     </div>
                                </div>`;
        }else
        {
            applicant_comment = `
                                <div class="flex items-center text-slate-500 text-xs whitespace-nowrap mt-2">
                                    <span class="bg-${ status_class } text-white text-xs px-2 py-1 rounded">${ status }</span>
                                </div>`;
        }

        let applicant_details = `
                                <div class="p-5">
                                    <div class="h-40 2xl:h-56 image-fit rounded-md overflow-hidden before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                                        <img alt="Profile Picture" class="rounded-lg border-white shadow-md" src="${ profile_pic }">
                                        <span class="absolute top-0 bg-${ status_class } text-white text-xs m-5 px-2 py-1 rounded z-10">${ status }</span>
                                        <div class="absolute bottom-0 text-white px-5 pb-5 z-10">
                                            <a href="javascript:;" class="block font-medium text-base">${ applicant_name }</a>
                                            <span class="text-white/90 text-xs mt-3"> ${ applicant_id } </span>
                                        </div>
                                    </div>
                                    <div class="text-slate-600 dark:text-slate-500 mt-5 overflow-hidden">
                                        <div class="flex items-center font-medium"> ${ position } </div>
                                        <div class="flex items-center text-slate-500 text-xs whitespace-nowrap mt-0.5"> Date applied: ${ date_applied } </div>
                                        ${ applicant_comment }
                                    </div>
                                </div>

                                 <div class="input-form p-5 border-t border-slate-200/60 dark:border-darkmode-400">
                                        <textarea id="mdl_applicants_comment" class="form-control" name="comment" placeholder="Type your comments..." minlength="10" required></textarea>
                                 </div>

                                <div class="flex justify-center text-center items-center p-5 border-t border-slate-200/60 dark:border-darkmode-400">
                                    <a id="btn_mdl_approve_applicant"    data-applicant-id="${ applicant_id }" data-application-id="${ application_id }" data-job-ref-no="${ jobRef_no }" class="flex items-center text-primary mr-6" href="javascript:;"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="heart" data-lucide="heart" class="lucide lucide-heart w-4 h-4 mr-1"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg> Approve </a>
                                    <a id="btn_mdl_disapprove_applicant" data-applicant-id="${ applicant_id }" data-application-id="${ application_id }" data-job-ref-no="${ jobRef_no }" class="flex items-center text-danger" href="javascript:;"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg> Disapprove </a>
                                </div>`;

        applicant_profile_div.append(applicant_details);

    });

}
function approveDisapproveApplicants(){

    /** BUTTON EVEN HANDLER FOR APPROVING APPLICANTS */
    $('body').on('click', '#btn_mdl_approve_applicant', function (){

        let comment = $('#mdl_applicants_comment').val();
        let applicant_id = $(this).data('applicant-id');
        let application_id = $(this).data('application-id');
        let jobRef_no = $(this).data('job-ref-no');
        let approval_type = 'approve';
        let this_button = $(this);

        let data = {

            applicant_id,
            application_id,
            jobRef_no,
            comment,
            approval_type,

        };
        if (comment.length >= 1) {

            approveDisapproveAJAXRequest(approval_type, this_button, data);
            $('#mdl_applicants_comment').removeClass('border-danger');

        } else {

            $('#mdl_applicants_comment').addClass('border-danger');
            __notif_show(-1, 'Oooops!', 'Please add comment!');
        }

    });


    /** BUTTON EVEN HANDLER FOR DIS-APPROVING APPLICANTS */
    $('body').on('click', '#btn_mdl_disapprove_applicant', function (){

        let comment = $('#mdl_applicants_comment').val();
        let applicant_id = $(this).data('applicant-id');
        let application_id = $(this).data('application-id');
        let jobRef_no = $(this).data('job-ref-no');
        let approval_type = 'disapprove';
        let this_button = $(this);

        let data = {

            applicant_id,
            application_id,
            jobRef_no,
            comment,
            approval_type,

        };
        if (comment.length >= 1) {

            approveDisapproveAJAXRequest(approval_type, this_button, data);
            $('#mdl_applicants_comment').removeClass('border-danger');

        } else {

            $('#mdl_applicants_comment').addClass('border-danger');
            __notif_show(-1, 'Oooops!', 'Please add comment!');
        }

    });

}
function approveDisapproveAJAXRequest(approval_type, this_button, data){

    let html_data = '';
    let jobRef_no = $('#input_jobref_no').val();

    if(approval_type == 'approve')
    {
        html_data = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="heart" data-lucide="heart" class="lucide lucide-heart w-4 h-4 mr-1"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg> Approve`;
    }else
    {
        html_data = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash" data-lucide="trash" class="lucide lucide-trash w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg> Disapprove `;
    }

    $.ajax({
        url: '/application/approve/disapprove',
        type: 'POST',
        data: data, // Data to be sent
        headers: {

            'X-CSRF-TOKEN': _token,
        },
        beforeSend: function () {

            this_button.html('<svg width="20" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2"><defs><linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a"><stop stop-color="rgb(30, 41, 59)" stop-opacity="0" offset="0%"></stop><stop stop-color="rgb(30, 41, 59)" stop-opacity=".631" offset="63.146%"></stop><stop stop-color="rgb(30, 41, 59)" offset="100%"></stop></linearGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)"><path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="3"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"></animateTransform></path><circle fill="rgb(30, 41, 59)" cx="36" cy="18" r="1"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"></animateTransform></circle></g></g></svg> Processing');
            this_button.prop('disabled', true);


        },
        success: function(response) {

            let email_status = response.email_status;
            let email_message = response.email_message;

            $('#mdl_applicants_comment').val(null);

            if(email_status == 300)
            {
                __notif_show(-1, 'Ooops!', email_message);
            }else
            {
                __notif_show(1, 'Success!', email_message);
            }

            __notif_show(1, 'Success!', response.message);
            __modal_hide('application_details_mdl');


            const filters = {

                jobref_no: jobRef_no,

            };

            fetchApplicantList(1, filters);
            fetchJobHiringList();

        },
        complete: function () {

            this_button.html(html_data);
            this_button.prop('disabled', false);

        },
        error: function(xhr, status, error) {

            // Handle error response
            console.error('Error occurred:', error);
        }
    });
}







function viewApplicantsAttachments(){

    $('body').on('click', '.btn_view_applicant_attachments', function (){

        $('#jobReferenceNo').val(null);
        $('#applicantID').val(null);

        let jobRef_no = $(this).data('job-ref-no');
        let applicant_id = $(this).data('applicant-id');
        let this_button = $(this);
        let div_id = $('#mdl_applicant_attachments_div');

        $('#jobReferenceNo').val(jobRef_no);
        $('#applicantID').val(applicant_id);

        __modal_toggle('applicant_attachments_mdl');

        getApplicantsFileAttachments(div_id, this_button, jobRef_no, applicant_id);

    });


    $('body').on('click', '.btn_dropdown', function (){

        __dropdown_close('#file_attachments_dd');

    });

    $('body').on('click', '.btn_file_not_found', function (){

        __notif_show(-3, 'Oooops!', 'File not found!');

    });
}
function getApplicantsFileAttachments(div_id, this_button, jobRef_no, applicant_id){

    const attachments_div = div_id;
    attachments_div.empty(); // Clear the table body first


    let data = {
        jobRef_no : jobRef_no,
        applicant_id : applicant_id  };

    $.ajax({
        url: '/application/get/applicant/attachments',
        type: 'POST',
        data: data,
        dataType: 'json',
        headers: {
            'X-CSRF-TOKEN': _token,
        },
        beforeSend: function () {

            this_button.prop("disabled", true);

        },
        success: function (data) {

            data.attachment_files.forEach(function (data) {

                let icon = '';
                let attachment_icon = '';
                let dropdown_elements = '';
                let file_indicator = '';
                let file_attachment = '';

                if(data.is_file_exist_in_storage)
                {
                    icon = '<div class="w-2 h-2 bg-success rounded-full mr-3"></div>';
                    dropdown_elements = `<li>
                                                <a href="/application/view/attachments/${ data.attachment_path }" target="_blank" class="btn_dropdown dropdown-item"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="eye" data-lucide="eye" class="lucide lucide-eye w-4 h-4 mr-2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> View File </a>
                                            </li>
                                            <li>
                                                <a href="/application/download/attachments/${ data.attachment_path }" target="_blank" class="btn_dropdown dropdown-item"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="external-link" data-lucide="external-link" class="lucide lucide-external-link w-4 h-4 mr-2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Download File </a>
                                            </li>`;

                    file_attachment = `<a href="/application/view/attachments/${ data.attachment_path }" target="_blank" class="w-16 mx-auto text-center">

                                                <img src="${ data.attachment_icon }">

                                            </a>`;
                }else
                {
                    icon = '<div class="w-2 h-2 bg-danger rounded-full mr-3"></div>';
                    dropdown_elements = `<li>
                                                <a href="javascript:;" class="btn_dropdown btn_file_not_found dropdown-item text-danger"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="alert-triangle" data-lucide="alert-triangle" class="lucide lucide-alert-triangle w-4 h-4 mr-2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> File not found! </a>
                                            </li>`;

                    file_indicator = `<div class="text-danger text-xs text-center mt-2"> File not found!</div>`

                    file_attachment = `<a href="javascript:;" class="w-16 mx-auto text-center btn_file_not_found">

                                                <img src="${ data.attachment_icon }">

                                            </a>`;
                }


                const htmlData = `
                        <div class="intro-y col-span-6 sm:col-span-4 md:col-span-3 2xl:col-span-2">

                            <div class="file box rounded-md px-5 pt-8 pb-5 px-3 sm:px-5 relative zoom-in">
                                <div class="absolute left-0 top-0 mt-3 ml-3">
                                    ${ icon }
                                </div>

                                ${ file_attachment }
                                <a href="javascript:;" class="block font-medium mt-4 text-center truncate">${ data.attachment_name }</a>
                                <div class="text-slate-500 text-xs text-center mt-0.5">${ data.attachment_type }</div>
                                ${ file_indicator }


                                <div id="file_attachments_dd" class="absolute top-0 right-0 mr-2 mt-3 dropdown ml-auto">
                                    <a class="dropdown-toggle w-5 h-5 block" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="more-vertical" data-lucide="more-vertical" class="lucide lucide-more-vertical w-5 h-5 text-slate-500"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
                                    <div class="dropdown-menu w-40">
                                        <ul class="dropdown-content">
                                            ${ dropdown_elements }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>`;

                attachments_div.append(htmlData);

            });

        },
        complete: function () {

            this_button.prop("disabled", false);

        }
    });

}



function filterSizeEvents(){

    /** JOB HIRING LIST Event handler for Items per page select box */
    $('body').on('change','#filter-jobHiringListSize', function () {

        let currentFilterSize = parseInt($(this).val());
        const filters = {
            limit: currentFilterSize
        };
        fetchJobHiringList(1, filters); // Fetch the first page of data with the applied filters and updated size
    });



    /** APPLICANTS LIST Event handler for Items per page select box */
    $('body').on('change','#filter-applicantListSize', function () {

        let currentFilterSize = parseInt($(this).val());
        let jobref_no = $('#input_jobref_no').val();


        const filters = {

            jobref_no: jobref_no,
            limit: currentFilterSize,

        };
        fetchApplicantList(1, filters); // Fetch the first page of data with the applied filters and updated size
    });

}
function PaginationEventHandler(){


    /** JOB HIRING LIST TABLE Event handler for pagination links  */
    $(document).on('click', '#jobHiringList_pagination a', function (event) {

        event.preventDefault();
        const page = $(this).data('page');

        let searchKeyword = $('#filter-search').val();
        let page_limit = $('#filter-jobHiringListSize').val();

        const filters = {

            search: searchKeyword,
            limit: page_limit,

        };

        fetchJobHiringList(page, filters);
    });



    /** APPLICANTS LIST TABLE Event handler for pagination links  */
    $(document).on('click', '#applicantList_pagination a', function (event) {

        event.preventDefault();
        const page = $(this).data('page');

        let searchKeyword = $('#filter-search-applicants').val();
        let page_limit = $('#filter-applicantListSize').val();
        let jobref_no = $('#input_jobref_no').val();

        const filters = {

            jobref_no: jobref_no,
            search: searchKeyword,
            limit: page_limit,

        };

        fetchApplicantList(page, filters);
    });
}
function loadingSpinner(tableBody, colspan){

    let loadingRow = `
                     <tr id="loading-row" class="intro-x">
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
function noResult(tableBody, colspan , message){

    const transactionList = `
                     <tr class="intro-x">
                        <td colspan="${ colspan }" class="w-full text-center">

                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                            <a href="javascript:;" class=" text-slate-500 text-xs whitespace-nowrap">${  message }</a>
                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                        </td>
                     </tr>`;

    return tableBody.append(transactionList); // Append curriculum row to the table

}
