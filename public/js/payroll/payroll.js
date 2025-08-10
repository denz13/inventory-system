
$(document).ready(function() {
    bpath = __basepath + "/";
    var  _token = $('meta[name="csrf-token"]').attr('content');
    updateTableWithFilters();

    pr_type = $('#pr_type').select2({
        placeholder: "Select Type",
        allowClear: true,
        closeOnSelect: true,
        width: "100%",
        multiple:false
    });
    pr_type.val(null).trigger('change');

    pr_sched = $('#pr_sched').select2({
        placeholder: "Select Pay Schedule",
        allowClear: true,
        closeOnSelect: true,
        width: "100%",
        multiple:false
    });
    pr_sched.val(null).trigger('change');



    pr_type2 = $('#pr_type2').select2({
        placeholder: "Select Type",
        allowClear: true,
        closeOnSelect: true,
        width: "100%",
        multiple:false
    });
    pr_type2.val(null).trigger('change');

    pr_sched2 = $('#pr_sched2').select2({
        placeholder: "Select Pay Schedule",
        allowClear: true,
        closeOnSelect: true,
        width: "100%",
        multiple:false
    });
    pr_sched2.val(null).trigger('change');
});


var tbldata;
var tbldata_pr_details;

var pr_modal_action='';
var pr_id='';



// Function to update the table with data
function updateTable(data) {
    const tableBody = $("#data-table tbody");
    tableBody.empty(); // Clear existing rows

    if (Array.isArray(data)) {
        for (const item of data) {
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const monthNames = [
                    "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
                    "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
                ];

                const month = monthNames[date.getMonth()];
                const day = date.getDate();
                const year = date.getFullYear();

                return `${month} ${day}, ${year}`;
            };

            // Check if 'payroll' is present
            if (item) {
                const formattedDateFrom = formatDate(item.date_from);
                const formattedDateTo = formatDate(item.date_to);

                const formattedDateRange = `${formattedDateFrom} - ${formattedDateTo}`;
                const prType = item.pr_type ? item.pr_type.name : "No Data";
                const prSched = item.pr_sched || "No Data";
                const dateMonth = item.date_month || "No Data";
                const dateYear = item.date_year || "No Data";
                const grossSalary = item.header ? item.header.gross_salary : "No Data";
                const netPay=item.header ? item.header.net_salary : "No Data";

                const row = `
                    <tr class="intro-x">
                        <td class="">
                            <input class="form-check-input" type="checkbox">
                        </td>
                        <td class=" !py-4">
                            <a id="student-list-button-grading-sheet" class="whitespace-nowrap">
                                ${item.pr_desc || "No Data"}
                            </a>
                        </td>
                        <td class="">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">
                                ${prType}
                            </a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${prSched}</div>
                        </td>
                        <td class="">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${formattedDateRange}</a>
                        </td>
                        <td>
                            <div class="whitespace-nowrap">${dateMonth}</div>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${dateYear}</div>
                        </td>
                        <td class="items-right">
                        <div class="text-right">

                        <div class="flex items-center whitespace-nowrap text-'${item.pr_status.class}'">
                             <div class="w-2 h-2 bg-${item.pr_status.class} rounded-full mr-3"></div>
                             <a>${item.pr_status.name}</a>
                             </div>
                        </div>
                        </td>
                        <td class="items-center">
                        <div class="text-center">
                        <div class="flex justify-center items-center">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 cursor-pointer">
                                ${item.pr_employees.length}</div>
                                </div>
                        </div>
                        </td>
                        <td class="table-report__action">
                            <div class="flex justify-center items-center">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">
                                <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>
                                    <div class="dropdown-menu w-40">
                                        <div class="dropdown-content">
                                            <a id="pr_btn_showDetails" href="javascript:;" data-tw-toggle="modal" data-tw-target="#open_payroll_modal" class="dropdown-item"
                                                data-id="${item.id}"
                                                data-desc="${item.pr_desc}"
                                                data-type_id="${item.type_id}"
                                                data-sched="${item.pr_sched}"
                                                data-date_from="${item.date_from}"
                                                data-date_to="${item.date_to}"
                                                data-status="${item.status}">
                                            <i class="fa fa-tasks w-4 h-4 mr-2 text-success"></i> Details </a>


                        <a id="btn_process_to" href="/payroll/payroll/${item.id}" class="dropdown-item" data-id="${item.id}">
                        <i class="fa-regular fa-paper-plane w-4 h-4 mr-2 text-primary"></i> Process </a>

                        <a id="btn_forward_to" href="javascript:;" data-tw-toggle="modal" data-tw-target="#forward_payroll_modal" class="dropdown-item"
                            data-id="${item.id}">
                        <i class="fa-solid fa-forward-fast w-4 h-4 mr-2 text-primary"></i>Forward </a>

                        <a id="btn_delete_to" href="javascript:;" data-tw-toggle="modal" data-tw-target="#open_payroll_delete" class="dropdown-item">
                        <i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i> Delete </a>

                        </div>
                        </div>
                        </div>
                        </div>
                        </td>
                    </tr>
                `;
                tableBody.append(row);
            } else {
                // Handle case where 'payroll' is not present
                console.error("No payroll data found for item:", item);
            }
        }
    } else {
        const noDataRow = `
            <tr>
                <td colspan="7" class="text-center py-4">No Data Found</td>
            </tr>
        `;
        tableBody.append(noDataRow);
        console.error("Invalid data format:", data);
    }
}

// Function to update page size dropdown UI
function updatePageSizeDropdown(selectedValue) {
    $("#page-size-select").val(selectedValue);
}

// Function to handle pagination link clicks and update the table
function handlePaginationLinkClick(event) {
    event.preventDefault(); // Prevent the default behavior of the hyperlink
    const pageUrl = $(this).attr("href");
    const pageNumber = pageUrl.split("=").pop();
    updateTableWithFilters(pageNumber);
}

// Function to handle "Last Page" link click and load the content for the last page
function handleLastPageLinkClick(event) {
    event.preventDefault(); // Prevent the default behavior of the hyperlink
    const pageUrl = $(this).attr("href");
    const lastPageNumber = pageUrl.split("=").pop();
    updateTableWithFilters(lastPageNumber);
}

// Function to handle "First Page" link click and load the content for the last page
function handleFirstPageLinkClick(event) {
    event.preventDefault(); // Prevent the default behavior of the hyperlink
    const pageUrl = $(this).attr("href");
    const firstPageNumber = pageUrl.split("=").pop();
    updateTableWithFilters(firstPageNumber);
}

// Function to update the pagination links
function updatePaginationLinks(links, last_page_url, first_page_url) {
    const paginationList = $(".pagination");
    paginationList.empty();

    // Create the "Previous" button
    paginationList.append(`
            <li class="page-item">
                <a id="first_page" class="page-link" href="${first_page_url}"> <i class="w-4 h-4 fas fa-angle-double-left" ></i> </a>
            </li>
        `);

    // Create the page number links and ellipsis
    for (const link of links) {
        const activeClass = link.active ? "active" : "";
        let linkContent = "";

        // Check if the link is for "Previous" or "Next" and use icon font
        if (link.label === "&laquo; Previous") {
            linkContent = '<i class="w-4 h-4 fas fa-angle-left"></i>';
        } else if (link.label === "Next &raquo;") {
            linkContent = '<i class="w-4 h-4 fas fa-angle-right"></i>';
        } else {
            // Use the page number or ellipsis as the label
            linkContent = link.label === "..." ? "&hellip;" : link.label;
        }

        // Append the link with the appropriate content
        paginationList.append(`
                <li class="page-item ${activeClass} mr-1">
                    <a class="page-link pagination-link w-10 h-10" href="${link.url}">${linkContent}</a>
                </li>
            `);
    }

    // Update the "Last Page" button to use the last_page_url from the response
    paginationList.append(`
            <li class="page-item">
                <a id="last_page" class="page-link" href="${last_page_url}"> <i class="w-4 h-4 fas fa-angle-double-right" ></i> </a>
            </li>
        `);

    // Add a click event handler for the "Last Page" link
    $("#last_page").on("click", handleLastPageLinkClick);

    // Add a click event handler for the "First Page" link
    $("#first_page").on("click", handleFirstPageLinkClick);

    // Add a click event handler for the pagination links
    $(".pagination-link").on("click", handlePaginationLinkClick);
}
// Function to update the entries information in a user-friendly format
function updateEntriesInfo(data) {
    // Extract relevant data from the provided object
    const currentPage = data.current_page;
    const perPage = data.per_page;
    const totalEntries = data.total;

    // Calculate the start and end entries for the current page
    const startEntry = (currentPage - 1) * perPage + 1;
    const endEntry = Math.min(startEntry + perPage - 1, totalEntries);

    // Create a user-friendly entries information message
    const entriesMessage = `Showing ${startEntry.toLocaleString()} to ${endEntry.toLocaleString()} of ${totalEntries.toLocaleString()} entries`;

    // Update the element with the user-friendly entries information
    $(".entries-info").text(entriesMessage);
}

// Function to update the table with data and pagination
function updateTableAndPagination(data) {
    const tableData = data.data;
    const paginationLinks = data.links;
    const last_page_url = data.last_page_url;
    const first_page_url = data.first_page_url;

    // Check if there is any data in the 'payroll' relationship
    if (tableData.length > 0) {
        updateTable(tableData);
        updatePaginationLinks(paginationLinks, last_page_url, first_page_url);
        updatePageSizeDropdown(data.per_page);

        // Call updateEntriesInfo after updating the table and pagination
        updateEntriesInfo(data);
    } else {
        // Handle case where 'payroll' data is not present
        const tableBody = $("#data-table tbody");
        tableBody.empty(); // Clear existing rows

        const noDataRow = `
            <tr>
                <td colspan="7" class="text-center py-4">No Payroll Data Found</td>
            </tr>
        `;
        tableBody.append(noDataRow);

        // Set entries information to indicate no data found
        $(".entries-info").text("No Payroll Data Found");
    }
}

// Function to handle filter changes and update the table
function updateTableWithFilters(page = 1) {
    const search_payroll = $("#search-payroll-input").val();
    const type = $("#select-type").val();
    const month = $("#select-month").val();
    const year = $("#select-year").val();
    const pageSize = $("#page-size-select").val();

    const has_search_payroll = search_payroll !== "";
    const has_type = type !== "";
    const has_month = month !== "";
    const has_year = year !== "";

    $.ajax({
        url: bpath + "payroll/load",
        method: "GET",
        data: {
            _token: _token,
            search_payroll: has_search_payroll ? search_payroll : null,
            pr_type: has_type ? type : null,
            pr_month: has_month ? month : null,
            pr_year: has_year ? year : null,
            page_size: pageSize,
            page: page,
        },
        success: function (response) {
            try {
                const data = response.data;
                updateTableAndPagination(data);
            } catch (error) {
                console.error("Error processing data:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An error occurred while processing the data. Please try again later.",
                });
            }
        },
        error: function (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while fetching the data. Please try again later.",
            });
        },
    });

}



format = function date2str(x, y) {
    var z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
        return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2)
    });

    return y.replace(/(y+)/g, function(v) {
        return x.getFullYear().toString().slice(-v.length)
    });
}


//PAYROLL INDEX
function add_payroll(){
    let pr_desc=$("#pr_desc").val();
    let type_id=$('#pr_type').val();
    let pr_sched=$('#pr_sched').val();
    let old_date_from=$('#pr_date_from').val();
    let old_date_to=$('#pr_date_to').val();



    let date_from= format(new Date(old_date_from), 'yyyy-MM-dd')
    let date_to= format(new Date(old_date_to), 'yyyy-MM-dd')



    $.ajax({
        url:"/payroll/payroll/save",
        method:'post',
        data:{pr_desc:pr_desc,type_id:type_id,pr_sched:pr_sched,date_from:date_from,date_to:date_to,_token:_token},
        success:function (){
            updateTableWithFilters();
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#open_payroll_modal'));
            mdl.hide();
            __notif_show(1, 'Success', 'Payroll was successfully created!');
        },error:function (err){
            __notif_show(-3, 'Error', err);
            console.log(err)
        }
    });
}
function update_payroll(){

    let pr_desc=$("#pr_desc").val();
    let type_id=$('#pr_type').val();
    let pr_sched=$('#pr_sched').val();
    let old_date_from=$('#pr_date_from').val();
    let old_date_to=$('#pr_date_to').val();



    let date_from= format(new Date(old_date_from), 'yyyy-MM-dd')
    let date_to= format(new Date(old_date_to), 'yyyy-MM-dd')



    $.ajax({
        url:"/payroll/payroll/update",
        method:'post',
        data:{pr_desc:pr_desc,type_id:type_id,pr_sched:pr_sched,date_from:date_from,date_to:date_to,id:pr_id},
        success:function (){
            updateTableWithFilters();
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#open_payroll_modal'));
            mdl.hide();
            __notif_show(1, 'Success', 'Payroll was successfully updated!');
        },error:function (err){
            __notif_show(-3, 'Error', err);
        }
    });
}

function forward_payroll(){
    let pr_desc=$("#pr_desc2").val();
    let type_id=$('#pr_type2').val();
    let pr_sched=$('#pr_sched2').val();
    let old_date_from=$('#pr_date_from2').val();
    let old_date_to=$('#pr_date_to2').val();



    let date_from= format(new Date(old_date_from), 'yyyy-MM-dd')
    let date_to= format(new Date(old_date_to), 'yyyy-MM-dd')



    $.ajax({
        url:"/payroll/payroll/forward",
        method:'post',
        data:{id:pr_id,pr_desc:pr_desc,type_id:type_id,pr_sched:pr_sched,date_from:date_from,date_to:date_to,_token:_token},
        success:function (){
            updateTableWithFilters();
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#forward_payroll_modal'));
            mdl.hide();
            __notif_show(1, 'Success', 'Payroll was successfully forwarded!');
        },error:function (err){
            __notif_show(-3, 'Error', err);
            console.log(err)
        }
    });
}

//Open Modal for Add
$("#payroll_modal").click(function() {
    pr_modal_action='Add';
    __clearInputs('#open_payroll_modal');
    // Update the content of the header title element
    $("#open_payroll_modal_title").text(pr_modal_action+' Payroll');

    // Show the modal using the data-tw-target attribute
    var targetModal = $(this).data("tw-target");
    $(targetModal).show();

    $("#open_payroll_modal_button").text(pr_modal_action);

});

//Save Method for Add/Update in Modal
$("#open_payroll_modal_button").click(function(ev) {
    if (!ev.detail || ev.detail == 1) {
        const allInputsSelected = __validateAndHighlightInputs('#open_payroll_modal');
        if (allInputsSelected && pr_modal_action==='Add') {
            add_payroll();
        }
        else if(allInputsSelected && pr_modal_action==='Update'){
            update_payroll();
            __clearInputs();
        }
    }
});

//Show Details to Modal
$("body").on('click', '#pr_btn_showDetails', function (e){
    __clearInputs('#open_payroll_modal');
    pr_id = $(this).data('id');
    let pr_desc = $(this).data('desc');
    let type_id = $(this).data('type_id');
    let sched = $(this).data('sched');
    let date_from = $(this).data('date_from');
    let date_to = $(this).data('date_to');



    pr_modal_action='Update';

    // Update the content of the header title element
    $("#open_payroll_modal_title").text(pr_modal_action+' Payroll');

    // Show the modal using the data-tw-target attribute
    var targetModal = $(this).data("tw-target");
    $(targetModal).show();

    $("#open_payroll_modal_button").text(pr_modal_action);

    $('#pr_desc').val(pr_desc);
    pr_type.val(type_id).trigger('change');
    pr_sched.val(sched).trigger('change');
    $('#pr_date_from').val(date_from);
    $('#pr_date_to').val(date_to);

});

//Show Forward Details to Forward
$("body").on('click', '#btn_forward_to', function (e){
    pr_id = $(this).data('id');
});


//open modal for forward Payroll
$("#forward_payroll_modal_button").click(function(ev) {
    if (!ev.detail || ev.detail == 1) {
        const allInputsSelected = __validateAndHighlightInputs('#forward_payroll_modal');
        if (allInputsSelected) {
            forward_payroll();
        }
    }
});









