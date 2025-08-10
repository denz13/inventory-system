var  _token = $('meta[name="csrf-token"]').attr('content');
var tbl_data_sem_clearance;
$(document).ready(function (){

    bpath = __basepath + "/";

    radio_button_events();
    select2_event_handler();

});

function select2_event_handler(){

    $('#csc_clearance_sg').select2({
        placeholder: 'Select Salary Grade',
    });

}

function radio_button_events(){

    $('#others_mode_sep_div').hide();

    $('#modal_others').change(function () {

        if ($(this).is(':checked')) {

            $('#others_mode_sep_div').show();

        }else
        {

            $('#others_mode_sep_div').hide();

        }
    });

    $('#modal_Leave').change(function () {
        if ($(this).is(':checked')) {

            $('#others_mode_sep_div').hide();

        }
    });

    $('#modal_Retirement').change(function () {
        if ($(this).is(':checked')) {

            $('#others_mode_sep_div').hide();

        }
    });

    $('#modal_Resignation').change(function () {
        if ($(this).is(':checked')) {

            $('#others_mode_sep_div').hide();

        }
    });

    $('#modal_Transfer').change(function () {
        if ($(this).is(':checked')) {

            $('#others_mode_sep_div').hide();

        }
    });


}


