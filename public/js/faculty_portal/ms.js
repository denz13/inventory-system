$(document).ready(function () {
    bpath = __basepath + "/";
    var _token = $('meta[name="csrf-token"]').attr("content");
    updateTableWithFilters();
});

// Function to update the table with data
function updateTable(data) {
    const tableBody = $("#data-table tbody");
    tableBody.empty(); // Clear existing rows
    if (Array.isArray(data)) {
        for (const item of data) {
            const row = `
                    <tr class="intro-x">
                        <td class="">
                            <input class="form-check-input" type="checkbox">
                        </td>
                        <td class=" !py-4">
                            <a id="student-list-button-grading-sheet" href="javascript:;" class="underline decoration-dotted whitespace-nowrap"
                                data-subjcode="${item.subjcode || "No Data"}"
                                data-section="${item.section || "No Data"}"
                                data-sy="${item.sy || "No Data"}"
                                data-sem="${item.sem || "No Data"}"
                            >${item.subjcode || "No Data"}</a>
                        </td>
                        <td class="">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${
                                item.fordept || "No Data"
                            }</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${
                                item.forcoll || "No Data"
                            }</div>
                        </td>
                        <td class="">
                            <a href="javascript:;" class="font-medium whitespace-nowrap">${
                                item.section || "No Data"
                            }</a>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${
                                item.block || "No Data"
                            }</div>
                        </td>
                        <td class="text-center hidden">
                            <div class="flex items-center justify-center whitespace-nowrap ${
                                item.subjcode === "Completed"
                                    ? "text-success"
                                    : "text-primary"
                            }"> <i data-lucide="check-square" class="w-4 h-4 mr-2"></i> ${
                item.subjcode || "No Data"
            } </div>
                        </td>
                        <td>
                            <div class="whitespace-nowrap">${
                                item.sy || "No Data"
                            }</div>
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">${
                                item.sem || "No Data"
                            }</div>
                        </td>
                        <td class="text-left">
                            <div class="pr-16">${
                                item.facultyload || "No Data"
                            }</div>
                        </td>

                        <td class="table-report__action">
                            <div class="flex justify-center items-center">
                                <a class="flex items-center text-primary whitespace-nowrap mr-5 student-list-button "
                                    data-tw-toggle="modal"
                                    data-tw-target="#student-list-modal"
                                    data-subjcode="${
                                        item.subjcode || "No Data"
                }"
                                    data-section="${item.section || "No Data"}"
                                    data-sy="${item.sy || "No Data"}"
                                    data-sem="${item.sem || "No Data"}"
                                    data-page="1"
                                    href="javascript:;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="check-square" data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg> View Students
                                    </a>
                            </div>
                        </td>
                    </tr>
                `;
            tableBody.append(row);
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

    updateTable(tableData);
    updatePaginationLinks(paginationLinks, last_page_url, first_page_url);
    updatePageSizeDropdown(data.per_page);
    updateEntriesInfo(data);
}

// Function to handle filter changes and update the table
function updateTableWithFilters(page = 1) {
    const searchSubject = $("#search-subject-input").val();
    const status = $("#status-select").val();
    const semester = $("#semester-select").val();
    const schoolYear = $("#school-year-select").val();
    const pageSize = $("#page-size-select").val();

    const hasSearchSubject = searchSubject !== "";
    const hasStatus = status !== "";
    const hasSemester = semester !== "";
    const hasSchoolYear = schoolYear !== "";

    $.ajax({
        url: bpath + "faculty-portal/my-subjects/filter-data",
        method: "GET",
        data: {
            _token: _token,
            search_subject: hasSearchSubject ? searchSubject : null,
            status: hasStatus ? status : null,
            semester: hasSemester ? semester : null,
            school_year: hasSchoolYear ? schoolYear : null,
            page_size: pageSize,
            page: page,
        },
        success: function (response) {
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

// Call the updateTableWithFilters function when filters change
$(
    "#search-subject-input, #status-select, #semester-select, #school-year-select, #page-size-select"
).on("change", function () {
    updateTableWithFilters();
});

// Function to fetch paginated and filtered data from the server using AJAX
function fetchPaginatedData(page, filters) {
    // If filters are not provided, use the currentFilters
    filters = filters || currentFilters;
    filters.per_page = filters.per_page || currentFilterSize; // Set default value for 'per_page'

    $.ajax({
        url: bpath + "faculty-portal/my-subjects/student-list?page=" + page,
        type: "GET",
        data: filters,
        dataType: "json",
        success: function (data) {
            // Store the received data in the 'studentData' variable
            const studentData = data.data;

            // Sort studentData by fullname
            studentData.sort((a, b) => a.fullname.localeCompare(b.fullname));

            // Update the data container with the new data
            const dataContainer = $("#data-container");
            dataContainer.empty(); // Clear the container first

            studentData.forEach(function (student) {
                // Determine the text color based on the status
                let textColor = "";
                let gradeText = student.grade; // Default grade text

                if (student.remarks === "Passed") {
                    textColor = "text-primary";
                } else if (
                    student.remarks === "Dropped" ||
                    student.remarks === "Failed"
                ) {
                    textColor = "text-danger";
                } else if (student.remarks === "Incomplete") {
                    textColor = "text-pending";
                    // Check if there's a complied grade, and add it with a "/" separator
                    if (student.gcompl) {
                        gradeText =
                            student.grade +
                            ' <strong class="text-primary"> / </strong> <strong class="text-primary">' +
                            student.gcompl +
                            "</strong>";
                    }
                }

                // Determine the text color for remarks based on the status
                let remarksTextColor = "";
                if (student.remarks === "Passed") {
                    remarksTextColor = "text-primary";
                } else if (
                    student.remarks === "Dropped" ||
                    student.remarks === "Failed"
                ) {
                    remarksTextColor = "text-danger";
                } else if (student.remarks === "Incomplete") {
                    remarksTextColor = "text-pending";
                }

                // Create the HTML structure for each student item
                const studentRow = `
                        <tr class="inbox inbox__item inbox__item--active bg-slate-100 dark:bg-darkmode-400/70 border-b border-slate-200/60 dark:border-darkmode-400">
                            <td class="px-5 py-3">
                                <div class="w-72 flex-none flex items-center mr-5">
                                    <div class="w-6 h-6 flex-none image-fit relative ml-5">
                                    </div>
                                    <div class="inbox__item--sender truncate ml-3">${
                                        student.fullname || "No Data"
                                    }</div>
                                </div>
                            </td>
                            <td class="w-64 sm:w-auto max-w-xs sm:max-w-none truncate-cell">
                                <div class="truncate">
                                    <span class="inbox__item--highlight">${
                                        student.studid || "No Data"
                                    }</span>
                                </div>
                            </td>
                            <td class="inbox__item--time whitespace-nowrap pl-10 ${remarksTextColor}">
                                <strong>${gradeText || "No data"}</strong>
                            </td>
                        </tr>
                `;
                dataContainer.append(studentRow); // Append student item to the container
            });

            // Update the summary of data
            $(".summary").text(data.summary);

            $("#inc-count").text(`${data.incomplete_count} `);
            $("#comp-count").text(`Complied ${data.compliedCount} / `);
            $("#dr-count").text(`${data.dropped_count} / `);
            $("#five-point-zero-count").text(`${data.five_point_zero_count}`);

            $("#passing-rate").text(`The total of the students who passed is ${data.passing_rate.toFixed(
                    2
                )}%`
            );

            // Enable or disable previous page and next page buttons based on current page number
            const previousPageButton = $(".previous-page");
            const nextPageButton = $(".next-page");
            if (data.current_page === 1) {
                previousPageButton.prop("disabled", true);
            } else {
                previousPageButton.prop("disabled", false);
            }

            if (data.current_page === data.last_page) {
                nextPageButton.prop("disabled", true);
            } else {
                nextPageButton.prop("disabled", false);
            }

            // Update the pagination links
            const paginationLinks = $(".pagination_student");
            paginationLinks.empty(); // Clear the pagination links container

            for (let i = 1; i <= data.last_page; i++) {
                const activeClass = i === data.current_page ? "active" : "";
                const pageLink = `<li class="page-item ${activeClass}"><a class="page-link" href="#">${i}</a></li>`;
                paginationLinks.append(pageLink);
            }

            // Update the currentPage and currentFilters variables
            currentPage = data.current_page;
            currentFilters = filters;
        },
    });
}

// Initial data loading when the page loads
$(document).ready(function () {
    fetchPaginatedData(1, {}); // Fetch the first page of data without any filters
});

// Event handler for pagination links
$(document).on("click", ".pagination_student a", function (event) {
    event.preventDefault();
    const page = $(this).attr("href").split("page=")[1];
    fetchPaginatedData(page);
});

// Event handler for previous page button
$(document).on("click", ".previous-page", function () {
    if (currentPage > 1) {
        const prevPage = currentPage - 1;
        fetchPaginatedData(prevPage);
    }
});

// Event handler for next page button
$(document).on("click", ".next-page", function () {
    const lastPage = parseInt(
        $(".pagination_student li:last-child .page-link").text()
    );
    if (currentPage < lastPage) {
        const nextPage = currentPage + 1;
        fetchPaginatedData(nextPage);
    }
});

// Update the currentFilterSize and fetch data when the filter size is changed
$("#filter-size").on("change", function () {
    currentFilters.per_page = parseInt($(this).val());
    fetchPaginatedData(1, currentFilters);
});

$("body").on("click", ".student-list-button", function (ev) {
    subjcode = $(this).data("subjcode");
    section = $(this).data("section");
    sy = $(this).data("sy");
    sem = $(this).data("sem");

    currentFilters.subjcode = subjcode;
    currentFilters.section = section;
    currentFilters.sy = sy;
    currentFilters.sem = sem;
    currentFilters.per_page = $("#filter-size").val();

    fetchPaginatedData(1, currentFilters);
});

$("body").on("click", "#student-list-button-grading-sheet", function (ev) {
    subjcode = $(this).data("subjcode");
    section = $(this).data("section");
    sy = $(this).data("sy");
    sem = $(this).data("sem");

    var pdfUrl =
        bpath +
        "faculty-portal/grading-sheet?subjcode=" +
        subjcode +
        "&section=" +
        section +
        "&sy=" +
        sy +
        "&sem=" +
        sem;

    // You can now use pdfUrl as needed, e.g., open it in a new window
    window.location.href = pdfUrl;
});

// Function to prepare the filters object
function prepareFilters(subjcode, section, sy, sem) {
    // console.log(subjcode, section, sy, sem);

    return {
        subjcode: subjcode,
        section: section,
        sy: sy,
        sem: sem,
        per_page: $("#filter-size").val(),
    };
}

// Event handler for filter search button
$(document).on("click", "#filter-search-button", function () {
    const filters = prepareFilters();
    const el = document.querySelector("#filter-search-button");
    const dropdown = tailwind.Dropdown.getOrCreateInstance(el);
    dropdown.hide();
    fetchPaginatedData(1, filters); // Fetch the first page of data with the applied filters
});

// Bind the Enter key press event to the search input field
$("#search-input").on("keydown", function (event) {
    if (event.keyCode === 13) {
        // Prevent the default Enter key behavior (e.g., form submission)
        event.preventDefault();
        // Perform the filter search when Enter key is pressed
        currentFilters.searchinput = $("#search-input").val();
        currentFilters.subjcode = subjcode;
        currentFilters.section = section;
        currentFilters.sy = sy;
        currentFilters.sem = sem;
        currentFilters.per_page = $("#filter-size").val();
        fetchPaginatedData(1, currentFilters);
    }
});
