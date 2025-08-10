// Function to handle page limit change and page navigation
function handlePageLimitChange(pageLimit) {
    var currentPage = parseInt(data.current_page);
    var url = new URL(window.location.href);
    url.searchParams.set("limit", pageLimit);
    url.searchParams.set("page", 1);
    window.location.href = url.toString();
}

// Function to handle page navigation
function handlePageNavigation(page) {
    var url = new URL(window.location.href);
    url.searchParams.set("page", page);
    url.searchParams.delete("limit");
    window.location.href = url.toString();
}

// Listen for page limit change event
var pageLimitDropdown = document.getElementById("page-limit");
pageLimitDropdown.addEventListener("change", function (e) {
    var pageLimit = e.target.value;
    handlePageLimitChange(pageLimit);
});

// Add event listeners for page navigation
var pageLinks = document.querySelectorAll("#pagination .page-link");
pageLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        var page = this.textContent;
        handlePageNavigation(page);
    });
});

// Update active class on page buttons
function updateActiveButton() {
    var pageItems = document.querySelectorAll("#pagination .page-item");
    pageItems.forEach(function (item) {
        var link = item.querySelector(".page-link");
        if (parseInt(link.textContent.trim()) === data.current_page) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

updateActiveButton();

// Initialize the page limit dropdown
function initializePageLimitDropdown() {
    var pageLimitDropdown = document.getElementById("page-limit");
    var limitQueryParam = parseInt(getQueryParam("limit"));
    pageLimitDropdown.value = limitQueryParam ? limitQueryParam : 8;
}

// Get the count element
var pageEntryCount = document.getElementById("page-entry-count");

// Update the entry count
function updateEntryCount() {
    var entryCount = document.getElementById("page-entry-count");
    if (entryCount) {
        var currentPage = parseInt(data.current_page);
        var perPage = parseInt(data.per_page);
        var total = parseInt(data.total);
        var count = Math.min(perPage * currentPage, total);
        var start = (currentPage - 1) * perPage + 1;
        entryCount.textContent =
            "Showing " + start + " to " + count + " of " + total + " sessions";
    }
}

// Call the initialization functions
initializePageLimitDropdown();
updateEntryCount();

// Get the search input element
var searchInput = document.getElementById("search-input");

// Function to handle search
function handleSearch() {
    var searchValue = searchInput.value.toLowerCase();
    var url = new URL(window.location.href);
    url.searchParams.set("search", searchValue);
    url.searchParams.set("page", 1);
    window.location.href = url.toString();
}

// Add an event listener for input changes
// searchInput.addEventListener('input', function (e) {
//     handleSearch();
// });

// Add an event listener for Enter key press
searchInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        handleSearch();
    }
});

// Function to get query parameter by name
function getQueryParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Get the filter dropdown element
var filterDropdown = document.getElementById("filter-dropdown");

// Function to handle filter change
function handleFilterChange() {
    var filterValue = filterDropdown.value;
    var url = new URL(window.location.href);
    url.searchParams.set("filter", filterValue);
    url.searchParams.set("page", 1);
    window.location.href = url.toString();
}

// Add an event listener for filter change
filterDropdown.addEventListener("change", function (e) {
    handleFilterChange();
});

$(document).ready(function () {
    bpath = __basepath + "/";
    $("#load-user-print").select2({
        placeholder: "Select User",
        allowClear: true,
        closeOnSelect: false,
        width: "100%",
    });
});
$(document).on("select2:open", function (e) {
    document
        .querySelector(`[aria-controls="select2-${e.target.id}-results"]`)
        .focus();
});

// Fetch the data from the controller and assign it to a JavaScript variable
// var data = @json($data);

// Function to render the data
function renderData() {
    var content = "";
    data.data.forEach(function (item) {
        const isEnded = item.ended_at_diff;
        const statusBackground = isEnded ? "bg-danger" : "bg-primary/80";
        const statusText = isEnded ? "Ended" : "Ongoing";
        content += `
                    <div class="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 zoom-in">
                        <div class="box">
                            <div class="p-5">
                                <div class="h-40 2xl:h-56 image-fit rounded-md overflow-hidden before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                                    <img alt="profile-picture" class="rounded-md profile-picture" data-action="zoom" src="${
                                        item.profile_pic
                                    }">
                                    <span class="absolute top-0 ${statusBackground} text-white text-xs m-5 px-2 py-1 rounded z-10">${
            isEnded ? "Ended " : "Started"
        }: ${isEnded ? item.ended_at_diff : item.started_at_diff}</span>
                                    <div class="absolute bottom-0 text-white px-5 pb-6 z-10">
                                        <a href="" class="block font-medium text-base">${
                                            item.class_details &&
                                            item.class_details.sec
                                                ? item.class_details.sec
                                                : "N/A"
                                        }</a>
                                        <strong class="text-white/90 text-xs mt-3">${
                                            item.profile_name
                                        }</strong>
                                        <p class="text-white/90 text-xs">${
                                            item.subcodeSubjdesc
                                        }</p>
                                    </div>
                                </div>
                                <div class="text-slate-600 dark:text-slate-500 mt-5">
                                    <div class="flex items-center">
                                        <i class="fa-regular fa-bookmark w-4 h-4 mr-1"></i> Subject code: <strong>${
                                            item.class_details &&
                                            item.class_details.sc
                                                ? item.class_details.sc
                                                : "N/A"
                                        }</strong>
                                    </div>
                                    <div class="flex items-center mt-2">
                                        <i class="fa-regular fa-building w-4 h-4 mr-2"></i> Department: <strong>${
                                            item.class_details &&
                                            item.class_details.fc
                                                ? item.class_details.fc
                                                : "N/A"
                                        }</strong>
                                    </div>


                                    <div class="flex items-center mt-2">
                                        <div id="faq-accordion-2" class="accordion">
                                            <div class="accordion-item">
                                                <div id="faq-accordion-content-7" class="accordion-header">
                                                    <button class="accordion-button collapsed" type="button" data-tw-toggle="collapse" data-tw-target="#faq-accordion-collapse-7" aria-expanded="false" aria-controls="faq-accordion-collapse-7"><i class="fa fa-history w-4 h-4 mr-2"></i>  More Details </button>
                                                </div>
                                                <div id="faq-accordion-collapse-7" class="accordion-collapse collapse" aria-labelledby="faq-accordion-content-7" data-tw-parent="#faq-accordion-2">
                                                    <div class="accordion-body text-slate-600 dark:text-slate-500 leading-relaxed">

                                                        <div class="flex items-center mt-2">
                                                            <i class="fa-regular fa-clock w-4 h-4 mr-2"></i> Duration: <strong> ${calculateDuration(
                                                                item.started_at,
                                                                item.ended_at
                                                            )}</strong>
                                                        </div>
                                                        <div class="flex items-center mt-2">
                                                            <i class="fa-regular fa-calendar w-4 h-4 mr-2"></i> Schedule: <strong> ${
                                                                item.class_details &&
                                                                item
                                                                    .class_details
                                                                    .days
                                                                    ? JSON.parse(
                                                                          item
                                                                              .class_details
                                                                              .days
                                                                      ).join(
                                                                          ", "
                                                                      )
                                                                    : "N/A"
                                                            }</strong>
                                                        </div>
                                                        <div class="flex items-center mt-2">
                                                            <div>
                                                                <span class="text-sm text-gray-500">Start Date</span>
                                                                <span class="text-sm text-gray-500 ml-5">
                                                                    <strong>
                                                                        <br class="ml-2">${item.started_at ? formatDateTime(item.started_at) : "N/A"}
                                                                    </strong>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="flex items-center mt-2">
                                                            <div>
                                                                <span class="text-sm text-gray-500">Ended on</span>
                                                                <span class="text-sm text-gray-500 ml-5">
                                                                    <strong>
                                                                        <br class="ml-2">${
                                                                            item.ended_at
                                                                                ? formatDateTime(
                                                                                      item.ended_at
                                                                                  )
                                                                                : "N/A"
                                                                        }
                                                                    </strong>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="flex items-center mt-2">
                                                            Expected Time Start: <strong> ${
                                                                item.class_details &&
                                                                item
                                                                    .class_details
                                                                    .time_start
                                                                    ? formatTime(
                                                                          item
                                                                              .class_details
                                                                              .time_start
                                                                      )
                                                                    : "N/A"
                                                            } </strong>
                                                        </div>
                                                        <div class="flex items-center mt-2">
                                                            Expected Time End: <strong> ${
                                                                item.class_details &&
                                                                item
                                                                    .class_details
                                                                    .time_end
                                                                    ? formatTime(
                                                                          item
                                                                              .class_details
                                                                              .time_end
                                                                      )
                                                                    : "N/A"
                                                            } </strong>
                                                        </div>
                                                        <div class="flex items-center mt-2">
                                                            Should End After: <strong> ${
                                                                item.class_details &&
                                                                item
                                                                    .class_details
                                                                    .end_after
                                                                    ? item
                                                                          .class_details
                                                                          .end_after
                                                                    : "N/A"
                                                            }</strong> hour(s)
                                                        </div>
                                                        <div class="flex items-center mt-2 ${
                                                            isEnded
                                                                ? "text-danger"
                                                                : "text-primary"
                                                        }">
                                                            <i class="fa-regular fa-square-check w-4 h-4 mr-2"></i>${
                                                                isEnded
                                                                    ? "Ended"
                                                                    : "Started"
                                                            }: ${
            isEnded ? item.ended_at_diff : item.started_at_diff
        }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="flex justify-center lg:justify-end items-center p-5 border-t border-slate-200/60 dark:border-darkmode-400">
                                <a class="flex items-center text-primary mr-auto " href="javascript:void(0);" onclick="showMeetingLink('${
                                    item.meeting_link
                                }')">
                                    <i class="fas fa-link w-4 h-4 mr-2 fa-beat"></i>
                                    
                                    <span class="text">${
                                        item.meeting_link
                                    }</span>
                                </a>
                                <a class="hidden flex items-center mr-3 text-success" href="javascript:;">
                                    <i class="fa-regular fa-pen-to-square w-4 h-4 mr-1"></i> Edit
                                </a>
                                <a class="hidden flex items-center text-danger" href="javascript:;" data-tw-toggle="modal" data-tw-target="#delete-confirmation-modal">
                                    <i class="fa-regular fa-circle-stop w-4 h-4 mr-1"></i> End
                                </a>
                            </div>
                        </div>
                    </div>`;
    });

    var container = document.getElementById("data-container");
    container.innerHTML = content;
}

function isValidUrl(string) {
    // Regular expression to check if the string is a URL
    // This regex pattern checks for strings starting with "http://" or "https://"
    // followed by characters until the end of the string.
    // It's a basic pattern and can be improved based on specific URL formats.
    var urlPattern = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
    return urlPattern.test(string);
}

// JavaScript function to show SweetAlert modal with meeting link data
function showMeetingLink(meetingLink) {
    // Regular expression to match URLs within a string
    var urlRegex = /(https?:\/\/[^\s]+)/g;

    // Check if the meetingLink is a valid URL
    if (isValidUrl(meetingLink)) {
        // If it's a valid URL, show the SweetAlert modal with the link and its value
        Swal.fire({
            title: "Meeting Link",
            type: "info",
            html: `
                        <div class="p-10">
                            <p><strong>Link:</strong> <a class="m-5 text-primary" href="${meetingLink}" target="_blank">${meetingLink}</a></p>
                        </div>
                    `,
            showCloseButton: true,
            showConfirmButton: false,
        });
    } else {
        // If it's not a valid URL, inform the user and include the data
        const invalidLinkMessage = `<div class="p-10">The provided link <span>(${meetingLink})</span> is not valid.</div>`;

        // Highlight URLs in the error message
        const highlightedMessage = invalidLinkMessage.replace(
            urlRegex,
            '<a class="text-primary" href="$1" target="_blank">$1</a>'
        );

        const hasAnchorTag = highlightedMessage.includes("<a ");

        // Display Swal modal indicating whether a URL is found or not
        Swal.fire({
            title: hasAnchorTag ? "Meeting Link" : "URL not found!",
            type: hasAnchorTag ? "info" : "error",
            html: highlightedMessage || invalidLinkMessage,
            showCloseButton: true,
            showConfirmButton: false,
        });
    }
}

// Function to calculate duration
function calculateDuration(startedAt, endedAt) {
    if (startedAt && endedAt) {
        const startedTime = new Date(startedAt);
        const endedTime = new Date(endedAt);
        const duration = endedTime - startedTime;

        const hours = Math.floor(duration / (60 * 60 * 1000));
        const minutes = Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((duration % (60 * 1000)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    } else {
        return "Ongoing";
    }
}

// Function to format date and time
function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    };
    return dateTime.toLocaleDateString("en-US", options);
}

// Function to format time in 12-hour format
function formatTime(timeString) {
    // Assuming timeString is in HH:mm format
    const [hours, minutes] = timeString.split(":");
    const formattedHours = hours % 12 || 12; // Convert 0 to 12
    const amPm = hours < 12 ? "AM" : "PM";
    return `${formattedHours}:${minutes} ${amPm}`;
}

// Function to render the pagination
function renderPagination() {
    var pagination = document.querySelector("#pagination");
    var pageLinks = "";

    // First Page Button
    pageLinks +=
        '<li class="page-item' +
        (data.current_page === 1 ? " disabled" : "") +
        '">';
    pageLinks +=
        '<a class="page-link" href="#" onclick="handlePageNavigation(1)">';
    pageLinks += '<i class="fas fa-angle-double-left w-4 h-4"></i>';
    pageLinks += "</a>";
    pageLinks += "</li>";

    // Previous Page Button
    pageLinks +=
        '<li class="page-item' +
        (data.current_page === 1 ? " disabled" : "") +
        '">';
    pageLinks +=
        '<a class="page-link" href="#" onclick="handlePageNavigation(' +
        (data.current_page - 1) +
        ')">';
    pageLinks += '<i class="fas fa-angle-left w-4 h-4"></i>';
    pageLinks += "</a>";
    pageLinks += "</li>";

    // Page Buttons
    for (var i = data.current_page - 2; i <= data.current_page + 2; i++) {
        if (i >= 1 && i <= data.last_page) {
            pageLinks +=
                '<li class="page-item' +
                (i === data.current_page ? " active" : "") +
                '">';
            pageLinks +=
                '<a class="page-link" href="#" onclick="handlePageNavigation(' +
                i +
                ')">' +
                i +
                "</a>";
            pageLinks += "</li>";
        }
    }

    // Next Page Button
    pageLinks +=
        '<li class="page-item' +
        (data.current_page === data.last_page ? " disabled" : "") +
        '">';
    pageLinks +=
        '<a class="page-link" href="#" onclick="handlePageNavigation(' +
        (data.current_page + 1) +
        ')">';
    pageLinks += '<i class="fas fa-angle-right w-4 h-4"></i>';
    pageLinks += "</a>";
    pageLinks += "</li>";

    // Last Page Button
    pageLinks +=
        '<li class="page-item' +
        (data.current_page === data.last_page ? " disabled" : "") +
        '">';
    pageLinks +=
        '<a class="page-link" href="#" onclick="handlePageNavigation(' +
        data.last_page +
        ')">';
    pageLinks += '<i class="fas fa-angle-double-right w-4 h-4"></i>';
    pageLinks += "</a>";
    pageLinks += "</li>";

    pagination.innerHTML = pageLinks;
}

// Function to handle department filter change
document
    .getElementById("department-dropdown")
    .addEventListener("change", function () {
        const selectedDepartment = this.value;
        const currentUrl = new URL(window.location.href);

        if (selectedDepartment) {
            currentUrl.searchParams.set("department", selectedDepartment);
        } else {
            currentUrl.searchParams.delete("department");
        }

        // Redirect to the updated URL with department filter
        window.location.href = currentUrl.toString();

        // Check if the selected department is the "All Departments" option
        if (selectedDepartment === "") {
            // Clear the department filter
            currentUrl.searchParams.delete("department");
            window.location.href = currentUrl.toString();
        }
    });

// Function to handle department filter change
function handleDepartmentFilterChange() {
    const selectedDepartment = document.getElementById(
        "department-dropdown"
    ).value;
    const currentUrl = new URL(window.location.href);

    if (selectedDepartment) {
        currentUrl.searchParams.set("department", selectedDepartment);
    } else {
        currentUrl.searchParams.delete("department");
    }

    // Redirect to the updated URL with department filter
    window.location.href = currentUrl.toString();

    // Check if the selected department is the "All Departments" option
    if (selectedDepartment === "") {
        // Clear the department filter
        currentUrl.searchParams.delete("department");
        window.location.href = currentUrl.toString();
    }
}

// Get the date input element
var searchInputDate = document.getElementById("search-input-date");

// Function to handle date search
function handleDateSearch() {
    var dateValue = searchInputDate.value;
    var url = new URL(window.location.href);
    url.searchParams.set("search-date", dateValue);
    url.searchParams.set("page", 1);
    window.location.href = url.toString();
}

// Add an event listener for date input changes
searchInputDate.addEventListener("change", function () {
    handleDateSearch();
});

// Function to update the entry count
function updateEntryCount() {
    var entryCount = document.getElementById("page-entry-count");
    if (entryCount) {
        var currentPage = parseInt(data.current_page);
        var perPage = parseInt(data.per_page);
        var total = parseInt(data.total);

        if (!isNaN(currentPage) && !isNaN(perPage) && !isNaN(total)) {
            var count = Math.min(perPage * currentPage, total);
            var start = (currentPage - 1) * perPage + 1;
            var dateFilter = getQueryParam("search-date");
            entryCount.textContent =
                "Showing " +
                start +
                " to " +
                count +
                " of " +
                total +
                " sessions" +
                (dateFilter ? " (Date: " + dateFilter + ")" : "");
        }
    }
}

document.getElementById("printButton").addEventListener("click", function () {
    // Get the selected 'From' and 'To' dates
    var fromDate = document.getElementById("modal-from-1").value;
    var toDate = document.getElementById("modal-to-2").value;

    var sy = document.getElementById("filter_year").value;
    var sem = document.getElementById("filter_sem").value;

    var dept = document.getElementById("department-dropdown-print").value;
    var user = document.getElementById("load-user-print").value;

    // Construct the URL based on the selected dates
    var url = `/faculty-monitoring/print/s/192/vw?from=${fromDate}&to=${toDate}&sy=${sy}&sem=${sem}&dept=${dept}&user=${user}`;

    // Open a new tab with the constructed URL
    window.open(url, "_blank");
});
