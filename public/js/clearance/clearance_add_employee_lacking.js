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

    fetchEmployeeDataClearanceSignatories();

});


/** FUNCTION FOR FETCHING EMPLOYEE LIST */
function fetchEmployeeDataClearanceSignatories(page, filters) {

    const employee_list_tbl    = $('#employee_list_tbl tbody');
    const paginationID         = $('#employee_list_pagination');
    employee_list_tbl.empty(); // Clear the table body first
    let colspan = 4;

    $.ajax({
        url: `/clearance/employee/list-load?page=` + page,
        type: 'POST',
        data: filters,
        dataType: 'json',
        beforeSend: function () {


        },
        success: function (data) {

            if(data.transactions.length > 0)
            {
                data.transactions.forEach(function (transaction) {

                    // Create the HTML structure for each curriculum row
                    const transactionList = `
                     <tr class="intro-x">
                        <td class="">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${ transaction.fullName }</a>
                            <div class="text-xs text-slate-400">${ transaction.employee_id }</div>
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
                    employee_list_tbl.append(transactionList); // Append curriculum row to the table

                });
            }
            else
            {

            }

            updateEmployeeListPaginationLinks(data, paginationID);
            $('#pagination_summary_employee_list').text(data.summary);

        },
        complete: function () {


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
        filters.limit  = parseInt($('#filter_size_faculty').val());

        fetchEmployeeDataClearanceSignatories(page, filters);
    });

    // Event handler for filter search input
    $('#filter_size_faculty').on('keyup', function (event) {

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
        filters.search = $('#filter_size_faculty').val();
        filters.limit  = size_limit;

        fetchEmployeeDataClearanceSignatories(1, filters);
    });

}


/** FUNCTION FOR UPDATING TABLE PAGINATION */
function updateEmployeeListPaginationLinks(data, paginationElementID) {

    const EmployeepaginationLinks = paginationElementID;
    EmployeepaginationLinks.empty(); // Clear the pagination links container

    const currentPage = data.current_page;
    const lastPage = data.last_page;

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
}
