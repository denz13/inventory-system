
$(document).ready(function () {

    bpath = __basepath + "/";
    var _token = $('meta[name="csrf-token"]').attr("content");

    updateTableWithFilters();

    var g_pr_id = '';
    var g_emp_id='';

    $(
        "#search-payroll-input, #select-type, #select-month, #select-year, #page-size-select"
    ).on("change", function () {
        updateTableWithFilters();
    });



});


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

            let yeartodate_amount = 0.00;

            // Check if 'payroll' is present
            if (item) {
                // const prType = item.payroll.pr_type ? item.payroll.pr_type.name : "No Data";
                // const prSched = item.payroll.pr_sched || "No Data";
                // const dateMonth = item.payroll.date_month || "No Data";
                // const dateYear = item.payroll.date_year || "No Data";
                // const grossSalary = item.payroll.header ? item.payroll.header.gross_salary : "No Data";
                // const netPay=item.payroll.header ? item.payroll.header.net_salary : "No Data";


                const paymentCountRelation = item.get_item_details.paymentcount;

                // Loop through each item in the paymentcount relationship and accumulate the sum
                for (const payment of paymentCountRelation) {
                    yeartodate_amount += parseFloat(payment.item_amount);
                }


                let natureClass;

                if (item.get_item_details.nature === "Addition") {
                    natureClass = "text-success";
                } else if (item.get_item_details.nature === "Deduction") {
                    natureClass = "text-danger";
                } else {
                    // Default class if 'nature' doesn't match any condition
                    natureClass = "";
                }

                const formattedAmount = yeartodate_amount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                const row = `
                    <tr class="intro-x">
                        <td class="">
                            <input class="form-check-input" type="checkbox">
                        </td>
                        <td class=" !py-4">
                            <a id="student-list-button-grading-sheet" class="whitespace-nowrap">
                                ${item.get_item_details.name || "No Data"}
                            </a>
                        </td>
                        <td class="">
                            <a href="javascript:;" class="font-medium whitespace-nowrap ${natureClass}"> ${item.get_item_details.nature || "No Data"}</a>
                        </td>
                        <td class="text-center">
                        <div class="text-center">${item.get_item_details.paymentcount.length || "No Data"}</div>
                        </td>
                        <td class="items-right">
                        <div class="text-right">${formattedAmount}</div>
                        </td>
                        <td class="table-report__action w-40">
                            <div class="flex justify-center items-center">
                                <a href="summary/load?id=${item.get_item_details.id}" class="btn text-primary">
                                    <i class="fa fa-list-alt w-4 h-4 mr-1"></i> View
                                </a>
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
    if (tableData.length > 0 && tableData[0]) {
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
        url: bpath + "my-payroll/summary-load",
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
            console.log(month)
            try {
                const data = response.data;
                // console.log(data);
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



