$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function(){
    // Profile Name to Admin User Name
    profilename_to_username();

    // Background
    load_quotes();
    change_quote();
    save_profile_picture();
    change_background();

    // === Birthday
    load_birthday();
    load_week_birthday();
    birthday_viewmore();
    greet_birthday();

    // === Early
    early();
    office_early();

    // === Biometric Today
    load_biometric_today();

    // === Personal General Information
    load_personal_general_info();
});

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

function greet_birthday() {
    $('#birthday_container, #weekly_container, #birthday_modal_container').on('click', '.birthday_greeting', function() {
        var id = $(this).data('id');
        $('#bday_send').val(id);
        open_modal('#birth_msg_modal');
    });

    $('#msg_send_btn').click(function() {
        var id = $('#bday_send').val();
        var msg = $('#bday_msg').val();
        if (msg.trim() == '') {
            __notif_show(-1, 'Empty', 'Quote and Author is empty!');
        } else {
            birth_greet(id, msg);
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

function align_val(align) {
    if (align == 'align_right') {
        return 'text-right';
    } else if (align == 'align_center') {
        return 'text-center';
    } else {
        return 'text-left';
    }
}

function change_quote() {
    $('input[name="text_align"]').change(function() {
        $('.allign label').removeClass('text-white bg-primary');
        var selectedAlign = $(this).val();
        $('label[for="' + selectedAlign + '"]').addClass('text-white bg-primary');
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

function change_background() {
    $('#change_img_btn').click(function() {
        open_modal('#change_img_modal');
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

function load_biometric_today() {
    $.ajax({
        url: "/dashboard/load_biometric_today",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#biometric_today_container').html(`
            <div class="box px-4 py-4 mb-3 flex items-center justify-center">
                <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8">
                    <circle cx="15" cy="15" r="15">
                        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
                        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
                    </circle>
                    <circle cx="60" cy="15" r="9" fill-opacity="0.3">
                        <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate>
                        <animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate>
                    </circle>
                    <circle cx="105" cy="15" r="15">
                        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
                        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
                    </circle>
                </svg>
            </div>`);
        },
        success: function (response) {
            $('#biometric_today_container').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function load_personal_general_info() {
    $.ajax({
        url: "/dashboard/load_personal_general_info",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $('#leave_applied').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');   
            $('#travel_order').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
            $('#locator_slip').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
            $('#saln').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');    
            $('#task_done').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
            $('#payslip').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
            $('#trip_ticket').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
            $('#document_received').html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        },
        success: function (response) {
            $('#leave_applied').html(response.leave_applied);
            $('#travel_order').html(response.travel_order);
            $('#locator_slip').html(response.locator_slip);
            $('#saln').html(response.saln);
            $('#task_done').html(response.task_done);
            $('#payslip').html(response.payslip);
            $('#trip_ticket').html(response.trip_ticket);
            $('#document_received').html(response.document_received);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}
