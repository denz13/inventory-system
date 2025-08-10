var _token = $('meta[name="csrf-token"]').attr("content");

$(document).ready(function () {
    // Handle change event of the database connection dropdown
    $("#db-connection-dropdown").change(function () {
        var selectedConnection = $(this).val();
        // Make AJAX request to fetch tables for the selected connection
        $.get(
            "/super-admin/get-tables",
            { connectionName: selectedConnection },
            function (tables) {
                $("#tables-dropdown").empty(); // Clear existing options

                // Populate table options
                tables.forEach(function (table) {
                    $("#tables-dropdown").append(
                        $("<option>", {
                            value: table.TABLE_NAME,
                            text: table.TABLE_NAME,
                        })
                    );
                });
            }
        );
    });

    clearanceDatabaseSetup();

});

// Function to export table to Excel
$("#export-excel").click(function () {
    const wb = XLSX.utils.table_to_book(
        document.getElementById("dt__manage_database")
    ); // Convert table to workbook
    XLSX.writeFile(wb, "table_data.xlsx"); // Download Excel file
});

$("#export-pdf").click(function () {
    const element = document.getElementById("dt__manage_database"); // Get the table element
    const options = {
        margin: 1,
        filename: "table_data.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 1 }, // Adjust the scale factor as needed
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" }, // Set orientation to landscape
    };

    html2pdf().from(element).set(options).save(); // Convert HTML table to PDF and save
});

// Function to handle printing of the table
$("#print-table").click(function () {
    window.print(); // Trigger print action
});

$(document).ready(function () {
    // Handle change event of the database connection dropdown
    $("#db-connection-dropdown").change(function () {
        var selectedConnection = $(this).val();
        // Make AJAX request to fetch tables for the selected connection
        $.get(
            "/super-admin/get-tables",
            { connectionName: selectedConnection },
            function (tables) {
                $("#tables-dropdown").empty(); // Clear existing options

                // Populate table options
                tables.forEach(function (table) {
                    $("#tables-dropdown").append(
                        $("<option>", {
                            value: table.TABLE_NAME,
                            text: table.TABLE_NAME,
                        })
                    );
                });
                handleTableFilterChange((page = 1));
            }
        );
    });
});

function handleCellClick() {
    $("td")
        .not(":first-child, .action-column")
        .click(function () {
            if ($(this).find('input[type="text"]').length) {
                // If cell already has an input field, return without doing anything
                return;
            }

            var cell = $(this);
            var currentValue = cell.text(); // Get current cell value
            var inputField = $('<input type="text" class="form-control">').val(
                currentValue
            ); // Create input field with current value
            // Set the fixed width for the input field
            var fixedWidth = 100; // Adjust the fixed width as needed

            // Calculate the approximate width based on the length of the current value
            var approximateWidth = currentValue.length * 10; // Adjust the multiplier as needed

            // Set the width of the input field only if it exceeds the fixed width
            if (approximateWidth > fixedWidth) {
                inputField.css("width", approximateWidth + "px");
            } else {
                inputField.css("width", fixedWidth + "px");
            }

            cell.html(inputField); // Replace cell content with input field

            // Focus on the input field and select its text
            inputField.focus().select();

            // Handle enter key press on input field
            inputField.keypress(function (event) {
                if (event.which === 13) {
                    // Check if enter key is pressed
                    var newValue = $(this).val(); // Get new value from input field
                    cell.text(newValue); // Update cell content with new value

                    // Get table, column, and row identifiers from data attributes
                    var connectionName = cell.data("connection-name");
                    var tableName = cell.data("table-name");
                    var columnName = cell.data("column-name");
                    var rowId = cell.data("row-id"); // If row identifier is available
                    var primaryKey; // If row identifier is available

                    // Get the primary key column name from the first th element of the table header
                    var firstColumnName = $(
                        "#dt__manage_database th:first-child"
                    )
                        .text()
                        .trim();

                    // Send AJAX request to update the database
                    $.ajax({
                        url: "/super-admin/update-cell",
                        method: "POST",
                        data: {
                            _token: _token,
                            connectionName: connectionName,
                            tableName: tableName,
                            columnName: columnName,
                            rowId: rowId,
                            oldValue: currentValue, // Include the old value
                            newValue: newValue,
                            primaryKey: firstColumnName,
                        },
                        success: function (response) {
                            // Handle success response
                            // toastr.success('Cell updated successfully. New value: ' + newValue);
                            toastr.success("Cell updated successfully.");
                            cell.addClass("text-primary");
                        },
                        error: function (xhr, status, error) {
                            // Handle error response
                            toastr.error("Error updating cell:", error);
                        },
                    });
                }
            });
        });
}

function handleTableFilterChange(page = 1) {
    var selectedConnection = $("#db-connection-dropdown").val(); // Get selected database connection
    var selectedTable = $("#tables-dropdown").val(); // Get selected table
    var searchQuery = $("#search-input").val(); // Get search query
    var searchColumn = $("#search-column-dropdown").val(); // Get selected search column
    var pageSize = $("#page-size-dropdown").val(); // Get selected page size

    // Make AJAX request to fetch column names
    $.get(
        "/super-admin/get-columns",
        { connectionName: selectedConnection, tableName: selectedTable },
        function (columns) {
            // Populate table header with column names
            var tableHeader = "";
            var actionTh =
                '<th><button id="add-row-btn" class="text-primary"><i class="fa fa-plus text-primary mr-2"></i>Insert</button></th>'; // Define the action table header

            if (Array.isArray(columns)) {
                // Case where columns is an array of strings (column names)
                columns.forEach(function (column) {
                    tableHeader += "<th>" + column + "</th>";
                });
            } else {
                // Case where columns is an array of objects (containing COLUMN_NAME properties)
                columns.forEach(function (column) {
                    tableHeader += "<th>" + column.COLUMN_NAME + "</th>";
                });
            }

            tableHeader += actionTh; // Append the action table header
            $("#dt__manage_database thead tr").html(tableHeader);

            $("#search-column-dropdown").empty();

            // Populate dropdown with column names
            var dropdownOptions = "<option value=''>Column</option>";
            columns.forEach(function (column) {
                dropdownOptions +=
                    "<option value='" + column + "'>" + column + "</option>";
            });

            // Append the options to the dropdown
            $("#search-column-dropdown").append(dropdownOptions);

            // Make AJAX request to fetch table contents with pagination and search parameters
            $.get(
                "/super-admin/get-contents",
                {
                    connectionName: selectedConnection,
                    tableName: selectedTable,
                    page: page,
                    pageSize: pageSize,
                    searchQuery: searchQuery,
                    searchColumn: searchColumn, // Pass selected search column to the server
                },
                function (contents) {
                    var tableBody = "";
                    contents.data.forEach(function (row) {
                        tableBody += '<tr class="intro-x">';

                        // Get the column names from the first row's th elements
                        var columnNames = Object.keys(row);

                        columnNames.forEach(function (columnName) {
                            tableBody +=
                                '<td data-connection-name="' +
                                selectedConnection +
                                '" data-table-name="' +
                                selectedTable +
                                '" data-column-name="' +
                                columnName +
                                '" data-row-id="' +
                                row[columnNames[0]] +
                                '">' +
                                row[columnName] +
                                "</td>";
                        });

                        // Add action column with delete icon
                        tableBody +=
                            '<td class="action-column"><a class="flex items-center text-danger delete-row-btn" href="javascript:;" data-connection-name="' +
                            selectedConnection +
                            '" data-table-name="' +
                            selectedTable +
                            '" data-row-id="' +
                            row[columnNames[0]] +
                            '"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Delete </a></td>';

                        tableBody += "</tr>";
                    });
                    $("#dt__manage_database tbody").html(tableBody);

                    // Attach the cell click event handler
                    handleCellClick();

                    // Update entry count above the table
                    var entryCountText =
                        "Showing 1 to " +
                        contents.data.length +
                        " of " +
                        contents.total +
                        " entries";
                    $(".entry-count").text(entryCountText);

                    // Update pagination links
                    var paginationHtml = "";
                    if (contents.current_page > 1) {
                        paginationHtml +=
                            '<li class="page-item"><a class="page-link" href="#" onclick="handleTableFilterChange(1)"><i class="fas fa-angle-double-left"></i></a></li>';
                        paginationHtml +=
                            '<li class="page-item"><a class="page-link" href="#" onclick="handleTableFilterChange(' +
                            (contents.current_page - 1) +
                            ')"><i class="fas fa-angle-left"></i></a></li>';
                    }
                    var numPagesToShow = 3;
                    var startPage = Math.max(
                        1,
                        contents.current_page - Math.floor(numPagesToShow / 2)
                    );
                    var endPage = Math.min(
                        contents.last_page,
                        startPage + numPagesToShow - 1
                    );
                    if (startPage > 1) {
                        paginationHtml +=
                            '<li class="page-item disabled"><span class="page-link">...</span></li>';
                    }
                    for (var i = startPage; i <= endPage; i++) {
                        paginationHtml +=
                            '<li class="page-item ' +
                            (i === contents.current_page ? "active" : "") +
                            '"><a class="page-link" href="#" onclick="handleTableFilterChange(' +
                            i +
                            ')">' +
                            i +
                            "</a></li>";
                    }
                    if (endPage < contents.last_page) {
                        paginationHtml +=
                            '<li class="page-item disabled"><span class="page-link">...</span></li>';
                    }
                    if (contents.current_page < contents.last_page) {
                        paginationHtml +=
                            '<li class="page-item"><a class="page-link" href="#" onclick="handleTableFilterChange(' +
                            (contents.current_page + 1) +
                            ')"><i class="fas fa-angle-right"></i></a></li>';
                        paginationHtml +=
                            '<li class="page-item"><a class="page-link" href="#" onclick="handleTableFilterChange(' +
                            contents.last_page +
                            ')"><i class="fas fa-angle-double-right"></i></a></li>';
                    }
                    $("#pagination").html(paginationHtml);
                }
            );
        }
    );
}

// Attach click event to delete row button
$("body").on("click", ".delete-row-btn", function () {
    var rowId = $(this).data("row-id");
    var connectionName = $(this).data("connection-name");
    var tableName = $(this).data("table-name");
    var primaryKey; // Define variable to hold the primary key column name
    var deleteButton = $(this);

    // Get the primary key column name from the first th element of the table header
    var firstColumnName = $("#dt__manage_database th:first-child")
        .text()
        .trim();

    if (rowId) {
        // Show confirmation SweetAlert
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            input: "text",
            inputPlaceholder: 'Type "confirm" to delete',
            inputValidator: (value) => {
                if (value !== "confirm") {
                    return 'You need to type "confirm" to proceed';
                }
            },
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.value === "confirm") {
                // Send AJAX request to delete the row from the database
                $.ajax({
                    url: "/super-admin/delete-database-row",
                    method: "POST",
                    data: {
                        _token: _token,
                        connectionName: connectionName,
                        tableName: tableName,
                        primaryKey: firstColumnName, // Use the first column name as the primary key
                        rowId: rowId,
                    },
                    success: function (response) {
                        // Remove the row from the table if deletion was successful
                        toastr.success("Row deleted successfully");
                        deleteButton.closest("tr").remove();
                    },
                    error: function (xhr, status, error) {
                        toastr.error("Error deleting row: " + error);
                    },
                });
            }
        });
    } else {
        // Remove the row from the table if data-row-id attribute is not found
        $(this).closest("tr").remove();
    }
});

// Function to handle change event of page size dropdown
function handlePageSizeChange() {
    handleTableFilterChange(); // Re-run table filter change function to apply new page size
}

var searchTimer; // Define a variable to store the timer

// Function to handle change event of search input with a delay
$("#search-input").on("input", function () {
    clearTimeout(searchTimer); // Clear any existing timer
    searchTimer = setTimeout(function () {
        handleTableFilterChange(); // Re-run table filter change function when search input changes
    }, 500); // Set a delay of 500 milliseconds (adjust as needed)
});

// Function to add a new row with input fields for data input
function addNewRowWithInputFields() {
    var $tableBody = $("#dt__manage_database tbody");
    var $tableHeader = $("#dt__manage_database thead tr");
    var numColumns = $tableHeader.find("th").length; // Get the number of columns in the table header

    // Generate HTML for a new row with input fields and plus/delete buttons
    var newRowHTML = "<tr>";
    $tableHeader.find("th:not(:last-child)").each(function () {
        var placeholder = $(this).text(); // Get the text of the table header as placeholder
        newRowHTML +=
            '<td><input type="text" class="form-control" placeholder="' +
            placeholder +
            '"></td>'; // Add input field with placeholder
    });
    newRowHTML += '<td><div class="flex justify-center items-center">';
    newRowHTML +=
        '<a class="flex items-center mr-3 save-row-btn" href="javascript:;"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="check-square" data-lucide="check-square" class="lucide lucide-check-square w-4 h-4 mr-1"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg> Save </a>';
    newRowHTML +=
        '<a class="flex items-center text-danger delete-row" href="javascript:;" > <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Remove </a>';
    newRowHTML += "</div></td>"; // Add plus and delete icons in the last column
    newRowHTML += "</tr>";

    // Append the new row to the table body
    $tableBody.append(newRowHTML);

    // Attach click event to delete row button
    $(".delete-row").click(function () {
        $(this).closest("tr").remove();
    });
}

// Event delegation for click event on #add-row-btn
$("body").on("click", "#add-row-btn", function () {
    addNewRowWithInputFields();
});

// Event listener for saving a new row
$(document).on("click", ".save-row-btn", function () {
    var newRow = $(this).closest("tr");
    var rowData = {}; // Object to store data from the new row

    // Extract data from the new row and populate the rowData object
    newRow.find("td input").each(function (index) {
        var columnName = $("#dt__manage_database th").eq(index).text(); // Get column name from the table header
        var cellValue = $(this).val(); // Get the value of the input field
        rowData[columnName] = cellValue;
    });

    // Get the selected connection and table names
    var selectedConnection = $("#db-connection-dropdown").val();
    var selectedTable = $("#tables-dropdown").val();

    // Example AJAX request to save the new row to the database
    $.ajax({
        url: "/super-admin/save-new-row",
        method: "POST",
        data: {
            _token: _token,
            connectionName: selectedConnection,
            tableName: selectedTable,
            rowData: rowData,
        },
        success: function (response) {
            // Handle success response
            toastr.success("New row saved successfully!");
            newRow.addClass("text-primary"); // Example: Add text-primary class to the new row

            var newRowId = response.id; // Get the ID of the newly inserted row

            // Replace input fields with text values
            newRow.find("input").each(function () {
                var textValue = $(this).val(); // Get the value from the input field
                $(this).closest("td").text(textValue); // Replace the input field with the text value
            });

            // Replace the first td with the newRowId
            newRow.find("td:first").attr("data-row-id", newRowId);

            // Replace the last column with the specified HTML content
            var lastColumnHTML =
                '<td class="action-column"><button class="delete-row-btn text-danger"  data-connection-name="' +
                selectedConnection +
                '" data-table-name="' +
                selectedTable +
                '" data-row-id="' +
                newRowId +
                '"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="trash-2" data-lucide="trash-2" class="lucide lucide-trash-2 w-4 h-4 mr-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button></td>';
            newRow.find("td:last").replaceWith(lastColumnHTML);

            // Add data attributes to the new row and its cells
            newRow.attr("data-connection-name", selectedConnection);
            newRow.attr("data-table-name", selectedTable);
            newRow.find("td").each(function (index) {
                var columnName = $("#dt__manage_database th").eq(index).text();
                $(this).attr("data-column-name", columnName);
                $(this).attr("data-row-id", newRowId); // Use the ID of the newly inserted row
            });
        },
        error: function (xhr, status, error) {
            // Handle error response
            var errorMessage = xhr.responseText; // Get the error message from the response
            toastr.error("Error saving new row: " + errorMessage);
        },
    });
});

var page = 1;
var totalLogs = 0;

// Function to fetch logs and append them to the modal body
function fetchLogsAndAppendToModal(searchQuery = "") {
    // Reset page number when a new search is performed
    if (searchQuery !== "") {
        page = 1;
        totalLogs = 0;
        $("#log-list").empty(); // Clear existing logs
    }

    $.ajax({
        url: "/super-admin/fetch-logs", // Update with your route for fetching logs
        method: "GET",
        data: {
            searchQuery: searchQuery,
            page: page,
        },
        success: function (response) {
            var logs = response.logs;
            totalLogs += logs.length;

            logs.forEach(function (log) {
                // Construct the log message
                var logMessage =
                    "<strong>" + moment(log.created_at).fromNow() + "</strong>";
                logMessage +=
                    '<br>Action: <span class="' +
                    getActionColorClass(log.action) +
                    '">' +
                    log.action +
                    "</span>";
                logMessage += "<br>Connection: " + log.connection_name;
                logMessage += "<br>Table: " + log.table_name;
                logMessage += "<br>Column: " + log.column_name;
                logMessage += "<br>Row ID: " + log.row_id;
                logMessage += "<br>Old Value: " + log.old_value;
                logMessage += "<br>New Value: " + log.new_value;
                logMessage += "<br>Row Data: " + log.row_data;

                // Append the log message to modal body
                $("#log-list").append('<p class="mb-4">' + logMessage + "</p>");
            });

            // Increment page number for next fetch
            page++;
        },
        error: function (xhr, status, error) {
            // Handle error response
            console.error("Error fetching logs:", error);
        },
    });
}

// Event listener for search input
$("#log-search").on("input", function () {
    var searchQuery = $(this).val();
    fetchLogsAndAppendToModal(searchQuery);
});

// Attach click event to the "Logs" button
$("body").on("click", "#load_logs_btn", function () {
    fetchLogsAndAppendToModal();
});

// Detect scroll event on modal body
$("#basic-slide-over-preview").on("scroll", function () {
    var objDiv = $(this)[0];
    if (
        objDiv.scrollTop + objDiv.offsetHeight >= objDiv.scrollHeight &&
        totalLogs > 0
    ) {
        fetchLogsAndAppendToModal(); // Fetch more logs when scrolled to the bottom
    }
});

function getActionColorClass(action) {
    if (action === "Delete") {
        return "text-danger";
    } else if (action === "Insert") {
        return "text-primary";
    } else if (action === "Update") {
        return "text-success";
    }
}


function clearanceDatabaseSetup(){

    // Initially disable the second and third buttons
    $('.btn_migration').prop('disabled', true);
    $('.btn_seeder').prop('disabled', true);

    $('body').on('click', '.btn_clearance_db', function (){

        __dropdown_close('#dropdown_div');

    });

    $('body').on('click', '.btn_rollback', function (){

        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to run this script? This process cannot be undone.",
            type: "info",
            input: "password",
            inputPlaceholder: 'Password',
            showCancelButton: true,
            confirmButtonColor: '#d63030',
            cancelButtonColor: '#9d9d9d',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {

            if (result.value)
            {
                getPassword((correctPassword) => {
                    if (correctPassword === null) {
                        Swal.fire({
                            type: 'error',
                            title: 'Error',
                            text: 'Error fetching password.',
                            showConfirmButton: true,
                        });
                    }
                    else if (result.value !== correctPassword) {
                        Swal.fire({
                            type: 'error',
                            title: 'Incorrect password',
                            text: 'The password you entered is incorrect.',
                            showConfirmButton: true,
                        });
                    }
                    else {
                        $.ajax({
                            url: '/clearance/run-database-rollback',
                            type: 'POST',
                            dataType: 'json',
                            headers: {
                                'X-CSRF-TOKEN': _token,
                            },
                            beforeSend: function () {
                                __oldSwalLoading();
                            },
                            success: function (response) {
                                if (response.success) {
                                    Swal.fire({
                                        type: 'success',
                                        title: 'Success',
                                        text: response.message,
                                        showConfirmButton: true,
                                    }).then(function() {
                                        // Enable the rollback button
                                        $('.btn_migration').prop('disabled', false);
                                        $('.btn_rollback').prop('disabled', true);
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });

    });
    $('body').on('click', '.btn_migration', function (){

        // Show confirmation SweetAlert
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to run this script? This process cannot be undone.",
            type: "info",
            input: "password",
            inputPlaceholder: 'Password',
            showCancelButton: true,
            confirmButtonColor: '#d63030',
            cancelButtonColor: '#9d9d9d',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.value)
            {
                getPassword((correctPassword) => {
                    if (correctPassword === null) {
                        Swal.fire({
                            type: 'error',
                            title: 'Error',
                            text: 'Error fetching password.',
                            showConfirmButton: true,
                        });
                    }
                    else if (result.value !== correctPassword) {
                        Swal.fire({
                            type: 'error',
                            title: 'Incorrect password',
                            text: 'The password you entered is incorrect.',
                            showConfirmButton: true,
                        });
                    }
                    else {
                        $.ajax({
                            url: '/clearance/run-database-migration',
                            type: 'POST',
                            headers: {
                                'X-CSRF-TOKEN': _token,
                            },
                            dataType: 'json',
                            beforeSend: function () {
                                __oldSwalLoading();
                            },
                            success: function (response) {

                                if (response.success) {
                                    Swal.fire({
                                        type: 'success',
                                        title: 'Success',
                                        text: response.message,
                                        showConfirmButton: true,
                                    }).then(function() {
                                        // Enable the rollback button
                                        $('.btn_seeder').prop('disabled', false);
                                        $('.btn_migration').prop('disabled', true);
                                    });
                                }
                            },
                        });
                    }
                });
            }
        });

    });
    $('body').on('click', '.btn_seeder', function (){

        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to run this script? This process cannot be undone.",
            type: "info",
            input: "password",
            inputPlaceholder: 'Password',
            showCancelButton: true,
            confirmButtonColor: '#d63030',
            cancelButtonColor: '#9d9d9d',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.value) {
                getPassword((correctPassword) => {
                    if (correctPassword === null) {
                        Swal.fire({
                            type: 'error',
                            title: 'Error',
                            text: 'Error fetching password.',
                            showConfirmButton: true,
                        });
                    }
                    else if (result.value !== correctPassword) {
                        Swal.fire({
                            type: 'error',
                            title: 'Incorrect password',
                            text: 'The password you entered is incorrect.',
                            showConfirmButton: true,
                        });
                    }
                    else {
                        // Password is correct, proceed with the action
                        $.ajax({
                            url: '/clearance/run-database-seeder',
                            type: 'POST',
                            dataType: 'json',
                            headers: {
                                'X-CSRF-TOKEN': _token,
                            },
                            beforeSend: function () {
                                __oldSwalLoading();
                            },
                            success: function (response) {
                                if(response.success) {
                                    Swal.fire({
                                        type: 'success',
                                        title: 'Success',
                                        text: response.message,
                                        showConfirmButton: true,
                                    }).then(function() {
                                        // Enable the rollback button
                                        $('.btn_seeder').prop('disabled', true);
                                        $('.btn_rollback').prop('disabled', false);
                                    });
                                } else {
                                    Swal.fire({
                                        type: 'error',
                                        title: 'Error',
                                        text: response.message,
                                        showConfirmButton: true,
                                    });
                                }
                            },
                            error: function () {
                                Swal.fire({
                                    type: 'error',
                                    title: 'Error',
                                    text: 'There was an error running the script.',
                                    showConfirmButton: true,
                                });
                            }
                        });
                    }
                });
            }
        });

    });
}

function getPassword(callback){
    $.ajax({
        url: '/clearance/get-password',
        type: 'POST',
        dataType: 'json',
        headers: {
            'X-CSRF-TOKEN': _token,
        },
        success: function (response) {
            if(response.success) {
                callback(response.TheFuckingPassword);
            }
        },
        error: function() {
            callback(null); // Handle error by returning null
        }
    });
}

function __oldSwalLoading(){
    Swal.fire({
        title: 'Processing...',
        text: 'Please wait while we process your request',
        type: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
}
