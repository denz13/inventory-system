$(document).ready(function () {
    bpath = __basepath + "/";
    var _token = $('meta[name="csrf-token"]').attr("content");
    var item_id = '';

    updateTableWithFilters();

    $(
        "#search, #nature, #target, #type, #page-size-select"
    ).on("change", function () {
        updateTableWithFilters();
    });


    $("#modal_save").click(function(){
        saveData();
    });

    $("#show_modal_add").click(function(){
        __clearInputs('#item_modal');
        item_id='';
        $("#item_modal_title").text("Add Item");
    });

    $("#confirm_delete").click(function(){
        deleteData();
    });


    $("body").on('click', '#showDetails', function (e) {
        $("#item_modal_title").text("Edit Item");
        item_id = $(this).data('id');
        $('#modal_name').val($(this).data('name'));
        $('#modal_nature').val($(this).data('nature'));
        $('#modal_type').val($(this).data('type'));
        $('#modal_target').val($(this).data('target'));
        $('#modal_rate').val($(this).data('rate'));
        $('#modal_limit').val($(this).data('limit'));
    });

    $("body").on('click', '#showDelete', function (e) {
        item_id = $(this).data('id');
    });

    function saveData(){
        const id = item_id;
        const name = $("#modal_name").val();
        const nature = $("#modal_nature").val();
        const rate = $("#modal_rate").val();
        const limit = $("#modal_limit").val();
        const type = $("#modal_type").val();
        const target = $("#modal_target").val();

        $.ajax({
            url:"save",
            method:'post',
            data:{id,name,nature,rate,limit,type,target,_token},
            success:function (res){
                 __notif_show(1, 'Success', 'Item Successfully Saved');
                 updateTableWithFilters();
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#item_modal"));
                mdl.hide();
                console.log(res)
            },error:function (err){
                console.log(err)
                __notif_show(-2, 'Error', err);

            }
        });
    }

    function deleteData(){
        const id = item_id;
        $.ajax({
            url:"delete",
            method:'post',
            data:{id,_token},
            success:function (res){
                 __notif_show(1, 'Success', 'Item Successfully Deleted');
                 updateTableWithFilters();
                 __modal_hide("item_modal_delete");
                console.log(res)
            },error:function (err){
                console.log(err)
                __notif_show(-2, 'Error', err);

            }
        });
    }

});

// Function to update the table with data
function updateTable(data) {
    const tableBody = $("#data-table tbody");
    tableBody.empty(); // Clear existing rows

    if (Array.isArray(data)) {
        for (const item of data) {
            if (item) {

                let natureClass;

                if (item.nature === "Addition") {
                    natureClass = "text-success";
                } else if (item.nature === "Deduction") {
                    natureClass = "text-danger";
                } else {
                    // Default class if 'nature' doesn't match any condition
                    natureClass = "";
}
                const id= item.id;
                const name = item.name || "No Data";
                const nature = item.nature || "No Data";
                const rate = item.default_rate || "No Data";
                const limit = item.default_limit || "No Data";
                const type = item.limit_type || "No Data";
                const target = item.calculate_on || "No Data";

                const row = `
                    <tr class="intro-x">
                        <td class="w-20">
                            <input class="form-check-input" type="checkbox">
                        </td>
                        <td class=" !py-4">
                            <a id="student-list-button-grading-sheet" class="whitespace-nowrap">
                                ${name}
                            </a>
                        </td>
                        <td class="">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">
                                ${rate}
                            </a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${limit}</div>
                        </td>
                        <td class="">
                            <a href="javascript:;" class="font-medium whitespace-nowrap ${natureClass}">${nature}</a>
                        </td>
                        <td>
                            <div class="whitespace-nowrap">${type}</div>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${target}</div>
                        </td>

                        <td class="table-report__action">
                        <div class="flex justify-center items-center">
                        <div id="" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 text-slate-400 zoom-in tooltip dropdown" title="More Action">
                            <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>
                            <div class="dropdown-menu w-40">
                                <div class="dropdown-content">
                                <a id="showDetails" data-tw-toggle="modal" data-tw-target="#item_modal" data-id="${id}" data-name="${name}"
                                data-nature="${nature}" data-type="${type}" data-target="${target}" data-rate="${rate}" data-limit="${limit}" href="javascript:;" class="dropdown-item"> <i class="fa-solid fa-pen-to-square w-4 h-4 mr-2 text-success" ></i> Edit </a>
                                <a id="showDelete" data-tw-toggle="modal" data-tw-target="#item_modal_delete" data-id="${id}" href="javascript:;" class="dropdown-item"><i class="fa-regular fa-trash-can w-4 h-4 mr-2 text-danger"></i>Delete</a>
                                <a id="btn_showDetails" href="javascript:;" class="dropdown-item"> <i class="fa fa-tasks w-4 h-4 mr-2 text-secondary"></i> Details </a>
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

    // Check if there is any data
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
        $(".entries-info").text("No Payroll Item Found");
    }
}

// Function to handle filter changes and update the table
function updateTableWithFilters(page = 1) {
    const search = $("#search").val();
    const nature = $("#nature").val();
    const type = $("#type").val();
    const target = $("#target").val();
    const pageSize = $("#page-size-select").val();

    const has_search = search !== "";
    const has_nature = nature !== "";
    const has_type = type !== "";
    const has_target = target !== "";

    $.ajax({
        url: bpath + "payroll/item/load",
        method: "GET",
        data: {
            _token: _token,
            search: has_search ? search : null,
            nature: has_nature ? nature : null,
            type: has_type ? type : null,
            target: has_target ? target : null,
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
