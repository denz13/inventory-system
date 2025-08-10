var  _token = $('meta[name="csrf-token"]').attr('content');
var tor_document_file_name = [];
var tor_document_folder = [];
var diploma_document_file_name = [];
var diploma_document_folder = [];
var certificates_document_file_name = [];
var certificates_document_folder = [];
var profile_pic_document_file_name = [];
var profile_pic_document_folder = [];
var tor_file_Length;
var diploma_file_Length;
var cert_file_Length;
var profile_file_Length;
var tor_size_validation;
var diploma_size_validation;
var certificate_size_validation;
var profile_size_validation;

$(document).ready(function (){

    bpath = __basepath + "/";

    load_select2_input_fields();

    submit_application();

    address_on_change_handler();

    birth_day_picker();

    load_available_positions();
});

function load_available_positions(){

    $.ajax({
        url: bpath + 'application/get/available/positions',
        type: "POST",
        data: { _token, },
        success: function(response) {
            var data = JSON.parse(response);
            console.log(data);

            var available_pos_options = data['option_Value'];

            $('#application_pos').html(available_pos_options);

        }
    });
}

function birth_day_picker(){

    const date = new Date();
    let this_year = date.getFullYear();

    let my_calendar = new Litepicker({
        element: document.getElementById('profile_date_birth'),
        autoApply: false,
        singleMode: true,
        numberOfColumns: 1,
        numberOfMonths: 1,
        showWeekNumbers: false,
        startDate: new Date(),
        format: "YYYY-MM-DD",
        allowRepick: true,
        dropdowns: {
            minYear: 1950,
            maxYear: null,
            months: true,
            years: true
        },
        setup: (picker) => {
            picker.on('button:apply', (date1) => {
                let get_date_instance = date1.dateInstance;

                let to_string = get_date_instance.toString();
                let split = to_string.split(" ");
                let get_birth_year = split[3];

                let age = this_year-get_birth_year;

                $('#profile_age').val(age);

            });
        },
    });
}

function load_select2_input_fields(){

    $('#application_gender').select2({
        placeholder: "Select Gender",
        closeOnSelect: true,
    });

    $('#profile_country').select2({
        placeholder: "Select Country",
        closeOnSelect: true,
    });

    $('#profile_region').select2({
        placeholder: "Select Region",
        closeOnSelect: true,
    });

    $('#profile_province').select2({
        placeholder: "Select Province",
        closeOnSelect: true,
    });

    $('#profile_municipality').select2({
        placeholder: "Select Municipality",
        closeOnSelect: true,
    });


    $('#profile_brgy').select2({
        placeholder: "Select Barangay",
        closeOnSelect: true,
    });

    $('#application_pos').select2({
        placeholder: "Select Position(s)",
        closeOnSelect: true,
    });

    $("#profile_municipality").prop("disabled", true);
    $("#profile_brgy").prop("disabled", true);

}

function select2_validator() {

    let validation;

    let get_gender = $('#application_gender').val();
    let application_pos = $('#application_pos').val();
    let get_brgy = $('#profile_brgy').val();
    let get_mun = $('#profile_municipality').val();
    let get_province = $('#profile_province').val();
    let get_region = $('#profile_region').val();
    let get_country = $('#profile_country').val();
    let job_position = $('#application_pos').val();

    if (get_gender == "")
    {
        validation = false;
        $('#application_gender').select2({
            theme: "error",
            placeholder: "Gender is required",
        });
    }else
    {
        validation = true;
    }

    // if (get_brgy.trim() == "")
    // {
    //     validation = false;
    //     $('#profile_brgy').select2({
    //         theme: "error",
    //         placeholder: "Barangay is required",
    //     });
    // }else
    // {
    //     validation = true;
    // }
    //
    // if (get_mun.trim() == "")
    // {
    //     validation = false;
    //     $('#profile_municipality').select2({
    //         theme: "error",
    //         placeholder: "Municipality is required",
    //     });
    // }else
    // {
    //     validation = true;
    // }

    if (get_province == "")
    {
        validation = false;
        $('#profile_province').select2({
            theme: "error",
            placeholder: "Province is required",
        });
    }else
    {
        validation = true;
    }

    if (get_region == "")
    {
        validation = false;
        $('#profile_region').select2({
            theme: "error",
            placeholder: "Region is required",
        });
    }else
    {
        validation = true;
    }

    if (get_country == "")
    {
        validation = false;
        $('#profile_country').select2({
            theme: "error",
            placeholder: "Country is required",
        });
    }else
    {
        validation = true;
    }

    if (job_position == "")
    {
        validation = false;
        $('#application_pos').select2({
            placeholder: "Job position is required!",
        });
    }else
    {
        validation = true;
    }

    return validation;
}

function submit_application(){

    $('#form_application').submit(function (event){
        event.preventDefault();

        get_tor_file_pond();

        get_diploma_file_pond();

        get_certificate_file_pond();

        get_profile_pic_file_pond();

        let application_form_data = {
            _token,
            tor_document_folder,
            diploma_document_folder,
            certificates_document_folder,
            profile_pic_document_folder,

            profile_elementary : $('#profile_elementary').val(),
            profile_high_school : $('#profile_high_school').val(),
            profile_techvoc : $('#profile_techvoc').val(),
            profile_college : $('#profile_college').val(),
            profile_master : $('#profile_master').val(),
            profile_doctorate : $('#profile_doctorate').val(),

            profile_country : $('#profile_country').val(),
            profile_region : $('#profile_region').val(),
            profile_province : $('#profile_province').val(),
            profile_municipality : $('#profile_municipality').val(),
            profile_brgy : $('#profile_brgy').val(),


            profile_last_name : $('#profile_last_name').val(),
            profile_first_name : $('#profile_first_name').val(),
            profile_mid_name : $('#profile_mid_name').val(),
            profile_citizenship : $('#profile_citizenship').val(),
            application_gender : $('#application_gender').val(),
            profile_date_birth : $('#profile_date_birth').val(),
            profile_age : $('#profile_age').val(),
            profile_phone_number : $('#profile_phone_number').val(),
            profile_email : $('#profile_email').val(),
            profile_username : $('#profile_username').val(),
            profile_pass : $('#profile_pass').val(),
            position_id : $('#application_pos').val(),

        }

        console.log(application_form_data);

        if(select2_validator() == true)
        {
            $.ajax({
                url: bpath + 'application/submit/application',
                type: "POST",
                data: application_form_data,
                success: function(response) {

                    if (response.status == 200)
                    {
                        __notif_show(1, "Success", "Application submitted successfully!");
                        removeUploadedCert();
                        removeUploadedDiploma();
                        removeUploadedProfile_pic();
                        removeUploaded_TOR();
                        birth_day_picker();
                        clear_input_fields();
                    }else
                    {
                        __notif_show(-1, "Warning", "Something went wrong!");
                    }

                }
            });
        }else
        {
            __notif_show(-1, "Warning", "Please provide missing fields!");
        }

    });

}

function clear_input_fields(){

    //Academic Background Input Fields
    $('#profile_elementary').val("");
    $('#profile_high_school').val("");
    $('#profile_techvoc').val("");
    $('#profile_college').val("");
    $('#profile_master').val("");
    $('#profile_doctorate').val("");

    //Profile Information Input Fields
    $('#profile_last_name').val("");
    $('#profile_first_name').val("");
    $('#profile_mid_name').val("");
    $('#profile_citizenship').val("");
    $('#profile_age').val("");
    $('#profile_phone_number').val("");
    $('#profile_email').val("");
    $('#profile_username').val("");
    $('#profile_pass').val("");

    $('#application_gender').val(null).trigger('change');
    $('#profile_country').val(null).trigger('change');
    $('#profile_region').val(null).trigger('change');
    $('#profile_province').val(null).trigger('change');
    $('#profile_municipality').val(null).trigger('change');
    $('#profile_brgy').val(null).trigger('change');
    $('#application_pos').val(null).trigger('change');

    load_select2_input_fields();
}

//Select2 On Change Handler
function address_on_change_handler(){

    $('#application_gender').on('select2:select', function (e) {
        // Do something

        $('#application_gender').select2({
            theme: "default"
        });

    });

    $('#profile_country').on('select2:select', function (e) {
        // Do something

        $('#profile_country').select2({
            theme: "default"
        });

    });

    $('#profile_region').on('select2:select', function (e) {
        // Do something

        let regCode = $(this).val();

        ajax_get_address_via_region(regCode);

        $('#profile_region').select2({
            theme: "default"
        });

    });

    $('#profile_province').on('select2:select', function (e) {
        // Do something

        let provCode = $(this).val();

        ajax_get_address_via_province(provCode);

        $('#profile_province').select2({
            theme: "default"
        });

    });

    $('#profile_municipality').on('select2:select', function (e) {
        // Do something

        let city_munCode = $(this).val();

        ajax_get_address_via_municipality(city_munCode);

        $('#profile_municipality').select2({
            theme: "default"
        });

    });

    $('#profile_brgy').on('select2:select', function (e) {
        // Do something

        $('#profile_brgy').select2({
            theme: "default"
        });

    });

}

function ajax_get_address_via_region(regCode){
    $.ajax({
        url: bpath + 'application/get/address/region',
        type: "POST",
        data: {
            _token,
            regCode,
        },
        success: function(response) {
            var data = JSON.parse(response);
            // console.log(data);

            $('#profile_province').html(data.province_option);
            $('#profile_municipality').html(data.municipality_option);
            $('#profile_brgy').html(data.brgy_option);

        }
    });
}

function ajax_get_address_via_province(provCode){
    $.ajax({
        url: bpath + 'application/get/address/province',
        type: "POST",
        data: {
            _token,
            provCode,
        },
        success: function(response) {
            var data = JSON.parse(response);
            // console.log(data);

            $('#profile_municipality').html(data.municipality_option);
            $('#profile_brgy').html(data.brgy_option);

            $("#profile_municipality").prop("disabled", false);
        }
    });
}

function ajax_get_address_via_municipality(city_munCode){
    $.ajax({
        url: bpath + 'application/get/address/municipality',
        type: "POST",
        data: {
            _token,
            city_munCode,
        },
        success: function(response) {
            var data = JSON.parse(response);
            // console.log(data);

            $('#profile_brgy').html(data.brgy_option);

            $("#profile_brgy").prop("disabled", false);
        }
    });
}

function get_tor_file_pond(){

    let tor_default_folder;
    let tor_name = [];
    let tor_folder;
    let tor_folder_name;

    let tor = TOR_pond.getFiles();
    tor_file_Length = tor.length;


    if (tor_file_Length > 0) {

        $.each(tor, function (i, val) {

            tor_default_folder = val.serverId
            tor_name = val.filename

            tor_folder = tor_default_folder.split("<");
            tor_folder_name = tor_folder[0];

            tor_document_file_name.push(tor_name);
            tor_document_folder.push(tor_folder_name);

        });

    }
    // else {
    //     __notif_show(-2, "File Missing!!", "Transcript of record is required!");
    // }
}

function get_diploma_file_pond(){

    let diploma_default_folder;
    let diploma_name;
    let diploma_folder;

    let diploma = diploma_pond.getFiles();
    diploma_file_Length = diploma.length;

    if (diploma_file_Length > 0) {

        $.each(diploma, function (i, val) {

            diploma_default_folder = val.serverId
            diploma_name = val.filename

            diploma_folder = diploma_default_folder.split("<");

            diploma_document_file_name.push(diploma_name);
            diploma_document_folder.push(diploma_folder[0]);

        });
    }
    // else {
    //     __notif_show(-2, "File Missing!!", "Diploma is required!");
    // }
}

function get_certificate_file_pond(){

    let certificates_default_folder;
    let certificates_name;
    let certificates_folder;

    let certificate = certificates_pond.getFiles();
    cert_file_Length = certificate.length;

    if (cert_file_Length > 0) {

        $.each(certificate, function (i, val) {

            certificates_default_folder = val.serverId
            certificates_name = val.filename

            certificates_folder = certificates_default_folder.split("<");

            certificates_document_file_name.push(certificates_name);
            certificates_document_folder.push(certificates_folder[0]);

        });
    }
    // else {
    //     __notif_show(-2, "File Missing!!", "Certificate is required!");
    // }

}

function get_profile_pic_file_pond() {

    let picture_default_folder;
    let picture_name;
    let picture_folder;

    let picture = profile_pic_pond.getFiles();
    profile_file_Length = picture.length;

    if (profile_file_Length > 0) {

        $.each(picture, function (i, val) {

            picture_default_folder = val.serverId
            picture_name = val.filename

            picture_folder = picture_default_folder.split("<");

            profile_pic_document_file_name.push(picture_name);
            profile_pic_document_folder.push(picture_folder[0]);

        });
    }
    // else {
    //     __notif_show(-2, "File Missing!!", "Profile Picture is required!");
    // }
}
