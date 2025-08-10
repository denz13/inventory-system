$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

function loadTable(search, page) {
    $.ajax({
        url: "/admin/flexi/data",
        type: "POST",
        dataType: "json",
        data: {search:search, page:page},
        beforeSend: function() {
            $('#table_container').empty();
            $('#table_container').html(`
            <div class="intro-y col-span-12">
                <div class="box p-5 text-center">
                    Loading  <i class="fa-solid fa-spinner fa-spin"></i>
                </div>
            </div>`);
        },
        success: function (response) {
            $('#table_container').empty();
            $('#table_container').html(response.html);
            $('#table_summary').html(response.summary);

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

function workinghours(agencyid) {
    $.ajax({
        url: "/admin/flexi/workinghours",
        type: "POST",
        dataType: "json",
        data: {agencyid: agencyid},
        success: function (response) {
            $('#table_edit').empty();
            $('#table_edit').append(response.html);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

$(document).ready(function() {
    let table_page = 1;
    loadTable($('#table_search').val(), table_page);

    $('#table_prev').click(function(){
        if (table_page > 1) {
            table_page--;
            loadTable($('#table_search').val(), table_page);
        }
    });
    $('#table_next').click(function() {
        table_page++;
        loadTable($('#table_search').val(), table_page);
    });
    var timeout;
    $('#table_search').keyup(function(){
        clearTimeout(timeout);

        timeout = setTimeout(function() {
            table_page = 1;
            loadTable($('#table_search').val(), table_page);
        }, 500);
    });

    $('#table_container').on('click', '.edit_btn', function() {
        var id = $(this).data('id');
        $('#list_employee').css('display', 'none');
        $('#table_edit').css('display', 'block');
        workinghours(id);
    });

    $('#table_edit').on('click', '#goback', function() {
        var check = $('#change_know').val();

        if (check == '') {
            $('#list_employee').css('display', 'block');
            $('#table_edit').css('display', 'none');
            loadTable($('#table_search').val(), table_page);
        } else {
            const myModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#change_modal"));
            myModal.show();
        }
    });

    $('#discard_change').click(function() {
        $('#change_know').val('')
        $('#list_employee').css('display', 'block');
        $('#table_edit').css('display', 'none');
        loadTable($('#table_search').val(), table_page);
        const myModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#change_modal"));
        myModal.hide();
    });

    // button weeks
    $('#table_edit').on('change', 'input[name="sunday"]', function() {
        if ($(this).is(':checked')) {
            $(this).next('label').removeClass('bg-slate-300 text-slate-500').addClass('bg-primary text-white');
            $('#sunday_div').show();
        } else {
            $(this).next('label').removeClass('bg-primary text-white').addClass('bg-slate-300 text-slate-500');
            $('#sunday_div').hide();
        }
    });
    $('#table_edit').on('change', 'input[name="monday"]', function() {
        if ($(this).is(':checked')) {
            $(this).next('label').removeClass('bg-slate-300 text-slate-500').addClass('bg-primary text-white');
            $('#monday_div').show();
        } else {
            $(this).next('label').removeClass('bg-primary text-white').addClass('bg-slate-300 text-slate-500');
            $('#monday_div').hide();
        }
    });
    $('#table_edit').on('change', 'input[name="tuesday"]', function() {
        if ($(this).is(':checked')) {
            $(this).next('label').removeClass('bg-slate-300 text-slate-500').addClass('bg-primary text-white');
            $('#tuesday_div').show();
        } else {
            $(this).next('label').removeClass('bg-primary text-white').addClass('bg-slate-300 text-slate-500');
            $('#tuesday_div').hide();
        }
    });
    $('#table_edit').on('change', 'input[name="wednesday"]', function() {
        if ($(this).is(':checked')) {
            $(this).next('label').removeClass('bg-slate-300 text-slate-500').addClass('bg-primary text-white');
            $('#wednesday_div').show();
        } else {
            $(this).next('label').removeClass('bg-primary text-white').addClass('bg-slate-300 text-slate-500');
            $('#wednesday_div').hide();
        }
    });
    $('#table_edit').on('change', 'input[name="thursday"]', function() {
        if ($(this).is(':checked')) {
            $(this).next('label').removeClass('bg-slate-300 text-slate-500').addClass('bg-primary text-white');
            $('#thursday_div').show();
        } else {
            $(this).next('label').removeClass('bg-primary text-white').addClass('bg-slate-300 text-slate-500');
            $('#thursday_div').hide();
        }
    });
    $('#table_edit').on('change', 'input[name="friday"]', function() {
        if ($(this).is(':checked')) {
            $(this).next('label').removeClass('bg-slate-300 text-slate-500').addClass('bg-primary text-white');
            $('#friday_div').show();
        } else {
            $(this).next('label').removeClass('bg-primary text-white').addClass('bg-slate-300 text-slate-500');
            $('#friday_div').hide();
        }
    });
    $('#table_edit').on('change', 'input[name="saturday"]', function() {
        if ($(this).is(':checked')) {
            $(this).next('label').removeClass('bg-slate-300 text-slate-500').addClass('bg-primary text-white');
            $('#saturday_div').show();
        } else {
            $(this).next('label').removeClass('bg-primary text-white').addClass('bg-slate-300 text-slate-500');
            $('#saturday_div').hide();
        }
    });

    $('#table_edit').on('click', '#save_time', function() {
        var agencyid = $('#agency_id_val').html();
        var start = $('#flexi_start_date').val();
        var end = $('#flexi_end_date').val();
        var sunday = $('#sunday').prop('checked');
        var monday = $('#monday').prop('checked');
        var tuesday = $('#tuesday').prop('checked');
        var wednesday = $('#wednesday').prop('checked');
        var thursday = $('#thursday').prop('checked');
        var friday = $('#friday').prop('checked');
        var saturday = $('#saturday').prop('checked');

        var data = {
            agencyid: agencyid,
            start: start,
            end: end,
            sun: sunday,
            mon: monday,
            tue: tuesday,
            wed: wednesday,
            thu: thursday,
            fri: friday,
            sat: saturday
        };

        $('#time_container input[type="time"]').each(function() {
            var inputId = $(this).attr('id');
            var inputValue = $(this).val();
            data[inputId] = inputValue;
        });

        if (start == '' || end == '') {
            __notif_show(-3, 'Error', 'Choose starting and ending date.');
        } else if (start > end) {
            __notif_show(-3, 'Error', 'Starting date must be lower than end date.');
        } else {
            $.ajax({
                url: "/admin/flexi/save",
                type: "POST",
                dataType: "json",
                data: data,
                success: function (response) {
                    if (response == 'success') {
                        $('#change_know').val('');
                        __notif_show(1, 'Success', 'Successfully save working hours!');
                    } else {
                        __notif_show(-3, 'Error', 'Schedule conflict on chosen date!');
                    }
                    // alert('goods')
                    // console.log(response);
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });

    $('#table_edit').on('click', '.copy_time_all', function() {
        var container = $(this).closest('.intro-y');

        var morning_in = container.find('.morning_in_all').val();
        var morning_out = container.find('.morning_out_all').val();
        var afternoon_in = container.find('.afternoon_in_all').val();
        var afternoon_out = container.find('.afternoon_out_all').val();

        $('.morning_in_all').val(morning_in);
        $('.morning_out_all').val(morning_out);
        $('.afternoon_in_all').val(afternoon_in);
        $('.afternoon_out_all').val(afternoon_out);
    });

    $('#table_edit').on('change', '.morning_in_all, .morning_out_all, .afternoon_in_all, .afternoon_out_all, #flexi_start_date, #flexi_end_date', function() {
        $('#change_know').val('1');
    });

    $('#table_edit').on('change', '#sunday, #monday, #tuesday, #wednesday, #thursday, #friday, #saturday', function() {
        $('#change_know').val('1');
    });

    $('#table_container').on('click', '.history_btn', function() {
        var id = $(this).data('id');

        load_history(id);
        open_modal('#history_modal');
    });

    $('#table_edit').on('click', '#working_history', function() {
        var id = $(this).data('id');

        load_history(id);
        open_modal('#history_modal');
    });

    function load_history(id) {
        $.ajax({
            url: "/admin/flexi/history",
            type: "POST",
            dataType: "json",
            data: {id: id},
            beforeSend: function() {
                $('#history_con').html(`
                <div class="border p-3 rounded mt-2 text-center">
                    Loading <i class="fa-solid fa-spinner fa-spin"></i>
                </div>`);
            },
            success: function (response) {
                $('#history_con').html(response);
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    }

    $('#history_con').on('click', '.edit_prev_flex', function() {
        var id = $(this).data('id');
        alert(id)
    });

    $('#history_con').on('click', '.dlt_prev_flex', function() {
        var id = $(this).data('id');
        $('#id_of_dlt_prev').val(id);
        open_modal('#delete_prev_flex');
    });

    $('#dlt_func_flex').click(function() {
        var id = $('#id_of_dlt_prev').val();
        $.ajax({
            url: "/admin/flexi/dlt_history",
            type: "POST",
            dataType: "json",
            data: {id: id},
            success: function (response) {
                close_modal('#delete_prev_flex');
                close_modal('#history_modal');
                __notif_show(1, 'Success', 'Successfully delete flex schedule!');
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
});
