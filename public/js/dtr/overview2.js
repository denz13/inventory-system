    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    function load_data(search, from, to, page) {
        $.ajax({
            url: '/dtr/load_table',
            method: 'POST',
            dataType: 'json',
            data: {
                search: search,
                from: from,
                to: to,
                page: page
            },
            beforeSend: function() {
                $('#table_container').empty();
                $('#table_container').html(`
                <div class="intro-y col-span-12">
                    <div class="box text-center">
                        <div class="p-5">
                            Loading <i class="fa-solid fa-spinner fa-spin"></i>
                        </div>
                    </div>
                </div>`);
            },
            success: function (response) {
                $('#table_container').empty();
                $('#table_container').html(response.html);
                $('#table_summary').html(response.summary);
                console.log(response);

                const previousPageButton = $('#table_prev');
                const nextPageButton = $('#table_next');
                if (response.users.current_page === 1) {
                    previousPageButton.prop('disabled', true);
                } else {
                    previousPageButton.prop('disabled', false);
                }
                if (response.users.current_page === response.users.last_page) {
                    nextPageButton.prop('disabled', true);
                } else {
                    nextPageButton.prop('disabled', false);
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    }
    function load_punctual(from, to) {
        $.ajax({
            url: '/dtr/load_punctual',
            method: 'POST',
            dataType: 'json',
            data: {
                from: from,
                to: to
            },
            beforeSend: function() {
                
            },
            success: function (response) {
                $('#punctual_container').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    }

    $(document).ready(function() {
        let table_page = 1;
        load_data($('#table_search').val(), $('#date_from').val(), $('#date_to').val(), table_page);
        // load_punctual($('#date_from').val(), $('#date_to').val());

        $('#table_prev').click(function(){
            if (table_page > 1) {
                table_page--;
                load_data($('#table_search').val(), $('#date_from').val(), $('#date_to').val(), table_page);
            }
        });
        $('#table_next').click(function() {
            table_page++;
            load_data($('#table_search').val(), $('#date_from').val(), $('#date_to').val(), table_page);
        });
        var timeout;
        $('#table_search').keyup(function(){
            clearTimeout(timeout);
            table_page = 1;

            timeout = setTimeout(function() {
                load_data($('#table_search').val(), $('#date_from').val(), $('#date_to').val(), table_page);
            }, 500);
        });

        $('#apply_btn').click(function(){
            table_page = 1;
            var from = $('#date_from').val();
            var to = $('#date_to').val();

            if (from == '' || to == '') {
                __notif_show(-1, 'Empty', 'Please choose date from and date to.');
            } else if (from > to) {
                __notif_show(-1, 'Invalid', 'The date inputed are invalid.');
            } else {
                // load_punctual($('#date_from').val(), $('#date_to').val());
                load_data($('#table_search').val(), $('#date_from').val(), $('#date_to').val(), table_page);
            }
        });
    });