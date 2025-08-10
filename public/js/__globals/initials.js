function initializeDataTable(options) {
    const table = $(options.tableId);
    const headers = options.headers;

    function addHeadersToTable() {
        let headerRow = $('<tr>');
        headers.forEach(header => {
            let th = $('<th>')
                .text(header.name)
                .addClass(header.class)
                .toggle(!header.hidden)
                .append('<span class="sort-icon"></span>');
            headerRow.append(th);
        });
        table.find('thead').html(headerRow);
    }

    function renderTableData(data) {
        let tbody = table.find('tbody');
        tbody.empty();
        data.forEach(row => {
            let tr = $('<tr>');
            headers.forEach(header => {
                let td = $('<td>')
                    .addClass(header.class)
                    .text(row[header.class])
                    .toggle(!header.hidden);
                tr.append(td);
            });
            tbody.append(tr);
        });
    }

    function updateTablePagination(response) {
        // Handle pagination links
        let paginationLinks = $('#pagination-links');
        paginationLinks.empty();
        for (let i = 1; i <= response.last_page; i++) {
            let link = $('<a>')
                .attr('href', '#')
                .text(i)
                .on('click', function (e) {
                    e.preventDefault();
                    fetchTableData(i, options.sortBy, options.sortOrder);
                });
            paginationLinks.append(link);
        }
    }

    function fetchTableData(page = 1, sortBy = null, sortOrder = null) {
        let perPage = $('#per-page-select').val();
        let search = $('#search-input').val();

        $.ajax({
            url: options.url,
            type: 'GET',
            data: {
                page: page,
                perPage: perPage,
                search: search,
                sortBy: sortBy,
                sortOrder: sortOrder
            },
            success: function (response) {
                renderTableData(response.data);
                updateTablePagination(response);
                $('#table-info').text(`Showing ${response.from} to ${response.to} of ${response.total} entries`);
            },
            error: function (xhr) {
                console.error(xhr.responseText);
            }
        });
    }

    // Initialize
    addHeadersToTable();
    fetchTableData();

    // Search input change event with debounce
    $('#search-input').on('input', function () {
        fetchTableData();
    });

    // Per page select change event
    $('#per-page-select').on('change', function () {
        fetchTableData();
    });

    // Sorting functionality
    $(document).on('click', 'th', function () {
        let sortBy = $(this).attr('class');
        let sortOrder = $(this).hasClass('ascending') ? 'desc' : 'asc';
        fetchTableData(1, sortBy, sortOrder);
    });
}

// $(document).ready(function () {
//     const travelOrderHeaders = [
//         { name: 'ID', class: 'to_id', hidden: true },
//         { name: 'Name ID', class: 'name_id', hidden: true },
//         { name: 'Profile', class: 'profile-pictures' },
//         { name: 'Purpose', class: 'purpose' },
//         { name: 'Prepared By', class: 'prepared-by' },
//         { name: 'Departure Date', class: 'departure-date' },
//         { name: 'Return Date', class: 'return-date' },
//         { name: 'Station', class: 'station' },
//         { name: 'Destination', class: 'destination' },
//         { name: 'Status', class: 'status' },
//         { name: 'Actions', class: 'actions' },
//     ];

//     initializeDataTable({
//         tableId: '#dynamic-table',
//         url: '/travel/order/approved',
//         headers: travelOrderHeaders,
//         sortBy: null,
//         sortOrder: null
//     });
// });
