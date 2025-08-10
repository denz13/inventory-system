$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {

    bpath = __basepath + "/";

    updateTableWithFilters();

    var sortable = Sortable.create($('#sortable-container')[0], {
        animation: 150,
        // Optional: set other options here
    });

});

var  _token = $('meta[name="csrf-token"]').attr('content');




//function to load signatories each campus
function load_items() {
    const dataContainer = $("#data-container");
    dataContainer.empty(); // Clear existing content

    $.ajax({
        url: bpath + 'payroll/admin/campus/signatory/load',
        type: "GET",
        data: {
            _token: _token,
            campus_id: '4',
        },
        success: function (data) {


            if (Array.isArray(data)) {
                for (const item of data) {
                    if (item) {

                        const id = item.id;
                        const name = item.place_assignment || "No Data";

                        const content = `
                          <div class="box">
                                <div class="flex flex-col lg:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                                    <div class="">
                                        <a href="" class="text-lg font-medium leading-none mt-3">${name}</a>
                                    </div>
                                    <div class="flex -ml-2 lg:ml-0 lg:justify-end mt-3 lg:mt-0">
                                        <!-- Social Media Icons -->
                                    </div>
                                </div>
                                <div class="flex flex-wrap lg:flex-nowrap items-center justify-center p-5">
                                    <div class="w-full lg:w-1/2 mb-4 lg:mb-0 mr-auto">
                                        <div class="flex text-slate-500 text-xs">
                                            <div class="mr-auto">Users Enrolled:1</div>
                                        </div>
                                    </div>
                                    <div class="text-center"> <a href="javascript:;" data-tw-toggle="modal" data-tw-target="#signatory_modal" class="btn btn-primary py-1 px-2 mr-2">Signatory</a> </div> <!-- END: Modal Toggle -->
                                    <div class="text-center"> <a href="javascript:;" data-tw-toggle="modal" data-tw-target="#basic-modal-preview" class="btn btn-outline-secondary py-1 px-2">Users</a> </div> <!-- END: Modal Toggle -->

                                </div>
                            </div>
                        `;
                        dataContainer.append(content);
                    } else {
                        console.error("No data found for item:", item);
                    }
                }
            } else {
                const noDataContent = `
                    <div class="text-center py-4 w-full">No Data Found</div>
                `;
                dataContainer.append(noDataContent);
                console.error("Invalid data format:", data);
            }

        },
        error: function (error) {
            // Handle the error
            console.error('Error:', error);
        }
    });
}


// Function to update the table with data
function updateTable(data) {
    const dataContainer = $("#data-container");
    dataContainer.empty(); // Clear existing content

    if (Array.isArray(data)) {
        for (const item of data) {
            if (item) {

                const id = item.id;
                const name = item.place_assignment || "No Data";

                const content = `
                  <div class="box">
                        <div class="flex flex-col lg:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                            <div class="">
                                <a href="" class="text-lg font-medium leading-none mt-3">${name}</a>
                            </div>
                            <div class="flex -ml-2 lg:ml-0 lg:justify-end mt-3 lg:mt-0">
                                <!-- Social Media Icons -->
                            </div>
                        </div>
                        <div class="flex flex-wrap lg:flex-nowrap items-center justify-center p-5">
                            <div class="w-full lg:w-1/2 mb-4 lg:mb-0 mr-auto">
                                <div class="flex text-slate-500 text-xs">
                                    <div class="mr-auto">Users Enrolled:1</div>
                                </div>
                            </div>
                            <div class="text-center"> <a href="javascript:;" data-tw-toggle="modal" data-tw-target="#signatory_modal" class="btn btn-primary py-1 px-2 mr-2">Signatory</a> </div> <!-- END: Modal Toggle -->
                            <div class="text-center"> <a href="javascript:;" data-tw-toggle="modal" data-tw-target="#basic-modal-preview" class="btn btn-outline-secondary py-1 px-2">Users</a> </div> <!-- END: Modal Toggle -->

                        </div>
                    </div>
                `;
                dataContainer.append(content);
            } else {
                console.error("No data found for item:", item);
            }
        }
    } else {
        const noDataContent = `
            <div class="text-center py-4 w-full">No Data Found</div>
        `;
        dataContainer.append(noDataContent);
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
        const tableBody = $("#data-container");
        tableBody.empty(); // Clear existing rows

        const noDataRow = `
            <tr>
                <td colspan="7" class="text-center py-4">No Data Found</td>
            </tr>
        `;
        tableBody.append(noDataRow);

        // Set entries information to indicate no data found
        $(".entries-info").text("");
    }
}

// Function to handle filter changes and update the table
function updateTableWithFilters(page = 1) {
    const search = $("#search").val();
    const pageSize = $("#page-size-select").val();

    const has_search = search !== "";

    $.ajax({
        url: bpath + "payroll/admin/campus/load",
        method: "GET",
        data: {
            _token: _token,
            search: has_search ? search : null,
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
