$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function(){
    // === Birthday
    birthday_viewmore(); //
    load_birthday(); //
    load_week_birthday(); //

    profilename_to_username(); //
    employment_type_list();
    load_quotes(); //
    general_report();
    early();
    office_early();
    gender_chart();
    age_chart();
    save_profile_picture(); //


    // === Employee Present
    employee_present();
    present_settings();

    $('input[name="text_align"]').change(function() {
        $('.allign label').removeClass('text-white bg-primary');
        var selectedAlign = $(this).val();
        $('label[for="' + selectedAlign + '"]').addClass('text-white bg-primary');
    });

    // Done
    $('#change_img_btn').click(function() {
        open_modal('#change_img_modal');
    });

    // Done
    $('#birthday_container').on('click', '#more_birthday', function() {
        open_modal('#birthday_modal');
        load_all_birthday();
    });

    // Done
    $('#weekly_container').on('click', '#more_week_birthday', function() {
        open_modal('#birthday_modal');
        load_all_week_birthday();
    });

    $('#greet_quote').on('click', '#add_quote', function() {
        $('#align_left').prop('checked', true);
        $('label[for="align_left"]').addClass('text-white bg-primary');
        open_modal('#add_quote_modal');
    });

    $('#change_quote_btn').click(function() {
        var quote = $('#quote_val').val();
        var author = $('#author_val').val();
        var align = align_val($('input[name="text_align"]:checked').val());

        if(quote.trim() == '' || author.trim() == '') {
            __notif_show(-1, 'Empty', 'Quote and Author is empty!');
        } else {
            save_quote(quote, author, align);
        }
    });

    $('#reload_general_report').click(function() {
        general_report();
        get_gender();
        get_age();
    });

    $('#employment_type_list').on('click', '.employment_type_selected', function() {
        var id = $(this).data('id');
        $(this).closest('.dropdown-menu').toggle();
        sex_employment(id);
    });

    $('#employment_type_list_2').on('click', '.employment_type_selected', function() {
        var id = $(this).data('id');
        $(this).closest('.dropdown-menu').toggle();
        age_employment(id);
    });

    // done
    $('#birthday_container, #weekly_container, #birthday_modal_container').on('click', '.birthday_greeting', function() {
        var id = $(this).data('id');
        $('#bday_send').val(id);
        open_modal('#birth_msg_modal');
    });

    // done
    $('#msg_send_btn').click(function() {
        var id = $('#bday_send').val();
        var msg = $('#bday_msg').val();
        if (msg.trim() == '') {
            __notif_show(-1, 'Empty', 'Quote and Author is empty!');
        } else {
            birth_greet(id, msg);
        }
    });

    $('#early_con, #office_early_con').on('click', '.early_stat_show', function() {
        var id = $(this).data('id');
        employee_details(id);
        open_modal('#early_stats');
    });
});

function birthday_viewmore() {
    $('#birthday_container').on('click', '#more_birthday', function() {
        open_modal('#birthday_modal');
        load_all_birthday();
    });

    $('#weekly_container').on('click', '#more_week_birthday', function() {
        open_modal('#birthday_modal');
        load_all_week_birthday();
    });
}

function employee_present() {
    $.ajax({
        url: "/dashboard/employee_present",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#count_present').html('<i class="fa-solid fa-ellipsis fa-fade ml-2"></i>');
            $('.slide_track').html(`<div class="box w-full text-center p-5">
                <i class="fa-solid fa-ellipsis fa-fade"></i>
            </div>`);
        },
        success: function (response) {
            if (response.count > 3) {
                $('.slide_track').css('animation', 'scroll 40s infinite linear');
            }
            $('#count_present').html(response.count + ' Employee');
            $('.slide_track').html(response.html);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function present_list(search, page, status) {
    $.ajax({
        url: '/dashboard/present_list',
        method: 'POST',
        dataType: 'json',
        data: {search: search, page: page, status: status},
        beforeSend: function() {
            $('#present_list_con').html(`<div class="text-center box mt-2 p-3 ">
                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                </div>`);
            $('#present_summary').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function(response) {
            $('#present_list_con').html(response.html);
            $('#present_summary').html(response.summary);

            const previousPageButton = $('#present_prev');
            const nextPageButton = $('#present_next');
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

function present_settings() {
    $('#count_present').click(function() {
        alert('clicked')
    });

    let present_page = 1;
    $('#present_settings').click(function() {
        present_list($('#present_search').val(), present_page, $('#present_status').val());
        open_modal('#present_settings_modal');
    });

    $('#present_prev').click(function(){
        if (present_page > 1) {
            present_page--;
            present_list($('#present_search').val(), present_page, $('#present_status').val());
        }
    });
    $('#present_next').click(function() {
        present_page++;
        present_list($('#present_search').val(), present_page, $('#present_status').val());
    });
    var timeout;
    $('#present_search').keyup(function(){
        clearTimeout(timeout);

        timeout = setTimeout(function() {
            present_page = 1;
            present_list($('#present_search').val(), present_page, $('#present_status').val());
        }, 500);
    });

    $('#present_status').change(function() {
        present_page = 1;
        present_list($('#present_search').val(), 1, $('#present_status').val());
    });

    $('#present_list_con').on('click', '.present_switch', function() {
        var id = $(this).data('id');
        $('#present_change_mdl').val(id);
        open_modal('#present_notif_mdl');
    });

    $('#present_change_btn').click(function() {
        var id = $('#present_change_mdl').val();

        $.ajax({
            url: '/dashboard/present_switch',
            method: 'POST',
            dataType: 'json',
            data: {id:id},
            success: function(response) {
                if (response == 'success') {
                    close_modal('#present_notif_mdl');
                    present_list($('#present_search').val(), 1, $('#present_status').val());
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function save_profile_picture(){
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginFileValidateSize,
        FilePondPluginFileValidateType,
        FilePondPluginImageEdit,
        FilePondPluginImageExifOrientation,
    );

    const update_profile_pic_inputElement = document.querySelector('input[id="img_bg"]');

    const update_profile_pic_pond = FilePond.create(update_profile_pic_inputElement, {
        credits: false,
        allowMultiple: false,
        allowFileTypeValidation: true,
        maxFileSize: '5MB',
        acceptedFileTypes: ['image/*'],

        server: {
            process: (fieldName, file, metadata, load, error, progress, abort) => {
                setTimeout(() => {
                    load(file);
                }, 1000);
            },
            revert: (uniqueFileId, load, error) => {
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_profile_pic_mdl'));
                mdl.toggle();
                $('body').on('click', '.btn_delete_profile', function(){
                    load();
                    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_profile_pic_mdl'));
                    mdl.hide();
                });
            },
        },
    });

    $('body').on('click', '#change_bg', function(){
        let this_button = $(this);
        const file = update_profile_pic_pond.getFile();

        if(file) {
            const formData = new FormData();
            formData.append('my_profile_pic', file.file);
            $.ajax({
                url: '/dashboard/uploads',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    location.reload();
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        } else {
            __notif_show(-1, "Warning", "Please upload image first!");
        }
    });
}

function align_val(align) {
    if (align == 'align_right') {
        return 'text-right';
    } else if (align == 'align_center') {
        return 'text-center';
    } else {
        return 'text-left';
    }
}

function employee_details(id) {
    $.ajax({
        url: "/dashboard/employee_details",
        type: "POST",
        data: {id: id},
        dataType: "json",
        beforeSend: function() {
            $('#employee_details_container').html(`
            <div class="box px-5 py-3 mb-3 flex items-center zoom-in" style="justify-content: center;">
                Loading <i class="fa-solid fa-spinner fa-spin ml-1"></i>
            </div>`);
        },
        success: function (response) {
            $('#employee_details_container').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function birth_greet(id, msg) {
    $.ajax({
        url: "/dashboard/bday_greet",
        type: "POST",
        data: {id: id, msg: msg},
        dataType: "json",
        success: function (response) {
            close_modal('#birth_msg_modal');
            __notif_show(1, 'Success', 'Message sent.');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function profilename_to_username() {
    $.ajax({
        url: "/dashboard/profilename_to_username",
        type: "GET",
        dataType: "json",
        success: function (response) {
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function employment_type_list() {
    $.ajax({
        url: "/dashboard/employment_type_list",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#employment_type_list').html('<li> <a class="dropdown-item">Loading <i class="fa-solid fa-spinner fa-spin ml-1"></i></a> </li>');
            $('#employment_type_list_2').html('<li> <a class="dropdown-item">Loading <i class="fa-solid fa-spinner fa-spin ml-1"></i></a> </li>');
        },
        success: function (response) {
            $('#employment_type_list').html(response);
            $('#employment_type_list_2').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function sex_employment(type) {
    $.ajax({
        url: "/dashboard/sex_employment",
        type: "POST",
        dataType: "json",
        data: {type: type},
        success: function (response) {
            update_chart_data(response.male, response.female, response.notAssigned);
            $('.gender_legend').html(response.html);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function age_employment(type) {
    $.ajax({
        url: "/dashboard/age_employment",
        type: "POST",
        dataType: "json",
        data: {type: type},
        success: function (response) {
            update_age_chart_data(response.thirty, response.middle, response.fifty);
            $('.age_legend').html(response.html);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function load_birthday() {
    $.ajax({
        url: "/dashboard/birthday",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#birthday_container').html(`
            <div class="intro-x">
                <div class="box px-5 py-3 mb-3 flex items-center zoom-in" style="justify-content: center;">
                    Loading <i class="fa-solid fa-spinner fa-spin ml-1"></i>
                </div>
            </div>`);
        },
        success: function (response) {
            $('#birthday_container').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function load_week_birthday() {
    $.ajax({
        url: "/dashboard/week_birthday",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#weekly_container').html(`
            <div class="intro-x">
                <div class="box px-5 py-3 mb-3 flex items-center zoom-in" style="justify-content: center;">
                    Loading <i class="fa-solid fa-spinner fa-spin ml-1"></i>
                </div>
            </div>`);
        },
        success: function (response) {
            $('#weekly_container').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function load_all_birthday() {
    $.ajax({
        url: "/dashboard/all_birthday",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#birthday_modal_container').html(`
            <div class="intro-x">
                <div class="box px-5 py-3 mb-3 flex items-center zoom-in" style="justify-content: center;">
                    Loading <i class="fa-solid fa-spinner fa-spin ml-1"></i>
                </div>
            </div>`);
        },
        success: function (response) {
            $('#birthday_modal_container').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function load_all_week_birthday() {
    $.ajax({
        url: "/dashboard/all_week_birthday",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#birthday_modal_container').html(`
            <div class="intro-x">
                <div class="box px-5 py-3 mb-3 flex items-center zoom-in" style="justify-content: center;">
                    Loading <i class="fa-solid fa-spinner fa-spin ml-1"></i>
                </div>
            </div>`);
        },
        success: function (response) {
            $('#birthday_modal_container').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function load_quotes() {
    var quote = $('#greet_quote');
    $.ajax({
        url: "/dashboard/quotes",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            quote.html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            quote.closest('.px-5').addClass(response.align);
            quote.html(response.html);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function early() {
    $.ajax({
        url: "/dashboard/early",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#early_con').html(`
            <div class="intro-x">
                <div class="box px-5 py-3 mb-3 flex items-center zoom-in" style="justify-content: center;">
                    Loading <i class="fa-solid fa-spinner fa-spin ml-1"></i>
                </div>
            </div>`);
        },
        success: function (response) {
            $('#early_con').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function office_early() {
    $.ajax({
        url: "/dashboard/office_early",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#office_early_con').html(`
            <div class="intro-x">
                <div class="box px-5 py-3 mb-3 flex items-center zoom-in" style="justify-content: center;">
                    Loading <i class="fa-solid fa-spinner fa-spin ml-1"></i>
                </div>
            </div>`);
        },
        success: function (response) {
            $('#office_early_con').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function save_quote(quote, author, align) {
    $.ajax({
        url: "/dashboard/add_quote",
        type: "POST",
        dataType: "json",
        data: {quote: quote, author: author, align: align},
        success: function (response) {
            load_quotes();
            close_modal('#add_quote_modal');
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function general_report() {
    var employee = $('#employee_count');
    var user = $('#user_count');
    $.ajax({
        url: "/dashboard/general_report",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            employee.html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
            user.html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            employee.html(response.employee);
            user.html(response.user);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function gender_chart() {
    var data = {
        labels: ['Male', 'Female', 'Not Assigned'],
        datasets: [{
            backgroundColor: [
                '#1E40AF',
                '#d8439f',
                '#83858b'
            ],
            data: [5, 5, 5]
        }]
    };

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
        }

    };

    var ctx = document.getElementById('gender_chart_con').getContext('2d');

    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });

    get_gender();
}

function get_gender() {
    $.ajax({
        url: "/dashboard/get_gender",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('.gender_legend').html(`
            <div class="text-center border p-3 rounded">
                Loading <i class="fa-solid fa-spinner fa-spin ml-1"></i>
            </div>`);
        },
        success: function (response) {
            update_chart_data(response.male, response.female, response.notAssigned);
            $('.gender_legend').html(response.html);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function update_chart_data(maleCount, femaleCount, notAssignedCount) {
    var ctx = document.getElementById('gender_chart_con').getContext('2d');
    var chart = Chart.getChart(ctx);

    chart.data.datasets[0].data = [maleCount, femaleCount, notAssignedCount];
    chart.update();
}

function age_chart() {
    var data = {
        labels: ['30 Years old Below', '31 - 50 Years old', '51 Years old Above'],
        datasets: [{
            backgroundColor: [
                '#3453B7',
                '#FA812D',
                '#FAD12C'
            ],
            data: [5, 5, 5]
        }]
    };

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: 110,
        plugins: {
            legend: {
                display: false
            },
        }
    };

    var ctx = document.getElementById('age_chart_con').getContext('2d');

    var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });

    get_age();
}

function get_age() {
    $.ajax({
        url: "/dashboard/get_age",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('.age_legend').html(`
            <div class="text-center border p-3 rounded">
                Loading <i class="fa-solid fa-spinner fa-spin ml-1"></i>
            </div>`);
        },
        success: function (response) {
            update_age_chart_data(response.thirty, response.middle, response.fifty);
            $('.age_legend').html(response.html);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function update_age_chart_data(maleCount, femaleCount, notAssignedCount) {
    var ctx = document.getElementById('age_chart_con').getContext('2d');
    var chart = Chart.getChart(ctx);

    chart.data.datasets[0].data = [maleCount, femaleCount, notAssignedCount];
    chart.update();
}
