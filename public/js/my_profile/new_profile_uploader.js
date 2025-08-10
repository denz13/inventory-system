var  _token = $('meta[name="csrf-token"]').attr('content');
$(document).ready(function (){

    bpath = __basepath + "/";

    new_add_educ_bg();
    toggle_delete_saved_educ_bg();
    toggle_update_saved_educ_bg();

});

function new_add_educ_bg(){

    $("body").on('click', '#add_educ_bg', function (){


        if (validateAcademicBGFields())
        {
            save_educ_bg_to_db();
        }else
        {
            __notif_show(-1, 'Oooops', 'Please fillout all given fields!');
        }

    });

}
function validateAcademicBGFields(){

    let isValid = true;
    let acad_bg_mdl_div = 'acad_bg_mdl_div';

    $("#" + acad_bg_mdl_div + " input, #" + acad_bg_mdl_div + " select2").each(function () {
        if ($(this).val().trim() === "") {
            isValid = false;
            // Add danger border to empty fields
            $(this).addClass("border-danger");
        } else {
            // Remove danger border if field is not empty
            $(this).removeClass("border-danger");
        }
    });
    return isValid;
}
function save_educ_bg_to_db(){

    let form_data = {

        _token,
        educ_bg_level       : $('#educ_bg_level').val(),
        educ_school_name    : $('#educ_school_name').val(),
        educ_school_from    : $('#educ_school_from').val(),
        educ_school_to      : $('#educ_school_to').val(),
        educ_degree_course  : $('#educ_degree_course').val(),
        educ_highest_level_earned : $('#educ_highest_level_earned').val(),
        educ_year_graduated : $('#educ_year_graduated').val(),
        educ_scholarship    : $('#educ_scholarship').val(),
    }

    $.ajax({
        url: bpath + 'my/add/educational/background',
        type: "POST",
        data: form_data,
        success: function (response) {

            if(response)
            {
                let data = JSON.parse(response);
                let status = data['status'];

                if(status == 200){

                    load_educational_bg();
                    $('#dt__educational_bg_new tbody tr').detach();

                    __notif_show(1, 'Success', 'Educational Background added successfully!');

                    input_validator();
                    clear_educ_bg_input_fields();

                }
            }
        }
    });

}

function toggle_delete_saved_educ_bg(){

    $('body').on('click', '.delete_my_educ_bg', function (){

        let academic_id = $(this).data('acad-id');

        $('#mdl_academic_input_id').val(academic_id);

        const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_educ_bg_mdl'));
        mdl.toggle();

    });

    $("body").on('click', '#btn_delete_my_educ_bg', function (){

        let academic_id = $('#mdl_academic_input_id').val();

        $.ajax({
            url: bpath + 'my/remove/educational/background',
            type: "POST",
            data: { _token, academic_id },
            success: function (response) {

                if(response) {

                    let data = JSON.parse(response);
                    let status = data['status'];

                    if (status == 200) {

                        load_educational_bg();

                        $('#dt__educational_bg_new tbody tr').detach();

                        $('#mdl_academic_input_id').val("");

                        const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#delete_educ_bg_mdl'));
                        mdl.hide();

                        __notif_show(1, 'Success', 'Academic removed successfully!');
                    }
                }
            }
        });

    });


}

function toggle_update_saved_educ_bg(){

    $('body').on('click', '.update_saved_educ_bg', function (){

        let academic_id = $(this).data('acad-id');
        $('#academic_id').val(academic_id);

        $('#add_educ_bg').hide();
        $('#update_educ_bg').show();

        let level = $(this).data('acad-level');
        let school_name = $(this).data('school-name');
        let degreee_course = $(this).data('degree');
        let attendance_from = $(this).data('att-from');
        let attendance_to = $(this).data('att-to');
        let units_earned = $(this).data('unit-earn');
        let year_graduated = $(this).data('graduated');
        let acad_honors = $(this).data('honors');

        $('#educ_bg_level').val(level).trigger('change');
        $('#educ_school_name').val(school_name);
        $('#educ_school_from').val(attendance_from);
        $('#educ_school_to').val(attendance_to);
        $('#educ_degree_course').val(degreee_course);
        $('#educ_highest_level_earned').val(units_earned);
        $('#educ_year_graduated').val(year_graduated);
        $('#educ_scholarship').val(acad_honors);

        const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#add_educ_bg_mdl'));
        mdl.toggle();

    });

    $('body').on('click', '#update_educ_bg',  function (){

        let form_data = {

            _token,
            academic_id         : $('#academic_id').val(),
            educ_bg_level       : $('#educ_bg_level').val(),
            educ_school_name    : $('#educ_school_name').val(),
            educ_school_from    : $('#educ_school_from').val(),
            educ_school_to      : $('#educ_school_to').val(),
            educ_degree_course  : $('#educ_degree_course').val(),
            educ_highest_level_earned : $('#educ_highest_level_earned').val(),
            educ_year_graduated : $('#educ_year_graduated').val(),
            educ_scholarship    : $('#educ_scholarship').val(),
        }

        $.ajax({
            url: bpath + 'my/update/educational/background',
            type: "POST",
            data: form_data,
            success: function (response) {

                if(response)
                {
                    let data = JSON.parse(response);
                    let status = data['status'];

                    if(status == 200){

                        load_educational_bg();
                        $('#dt__educational_bg_new tbody tr').detach();

                        const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#add_educ_bg_mdl'));
                        mdl.hide();
                        __notif_show(1, 'Success', 'Educational Background updated successfully!');

                        input_validator();
                        clear_educ_bg_input_fields();

                    }
                }
            }
        });

    });

}

function clear_educ_bg_input_fields(){

    $('#educ_bg_level').val('').trigger('change');
    $('#educ_school_name').val("");
    $('#educ_degree_course').val("");
    $('#educ_highest_level_earned').val("");
    $('#educ_year_graduated').val("");
    $('#educ_scholarship').val("");
    $('#educ_school_from').val("");
    $('#educ_school_to').val("");

}

function input_validator(){

    $('#educ_year_graduated').removeClass('border-danger');
    $('#educ_school_name').removeClass('border-danger');
    $('#educ_degree_course').removeClass('border-danger');
    $('#educ_highest_level_earned').removeClass('border-danger');
    $('#educ_scholarship').removeClass('border-danger');

}
