function bind_address(){

    $('.btn_add_ref_barangay').hide();
    $('.btn_add_per_barangay').hide();

    $('.ref_province').on('select2:select', function (e) {

        let provCode = $(this).val();

        $.ajax({
            url: bpath + 'application/get/address/province',
            type: "POST",
            data: {_token, provCode,},
            success: function (response) {

                var data = JSON.parse(response);

                let ref_mun_val = data['municipality_option'];
                let ref_brgy_val = data['brgy_option'];

                $('.ref_city_mun').html(ref_mun_val);
                $('.ref_brgy').html(ref_brgy_val);

                $('.btn_add_ref_barangay').show();
            }
        });

    });

    $('.ref_city_mun').on('select2:select', function (e) {


        let city_munCode = $(this).val();

        getRefBarangay(city_munCode);

    });

    $('.per_province').on('select2:select', function (e) {

        let provCode = $(this).val();

        $.ajax({
            url: bpath + 'application/get/address/province',
            type: "POST",
            data: {_token, provCode,},
            success: function (response) {

                var data = JSON.parse(response);

                let ref_mun_val = data['municipality_option'];
                let ref_brgy_val = data['brgy_option'];

                $('.per_city_mun').html(ref_mun_val);
                $('.per_brgy').html(ref_brgy_val);

                $('.btn_add_per_barangay').show();
            }
        });

    });

    $('.per_city_mun').on('select2:select', function (e) {

        let city_munCode = $(this).val();

        getPerBarangay(city_munCode);

    });


    $('body').on('click', '.mdl_btn_add_barangay', function (){

        let address_reference = $('.address_ref').val();

        let data = {

            provincial_code : $('.provincial_id').val(),
            municipal_code : $('.municipal_id').val(),
            barangay_name : $('.barangay_name').val(),

        };
        $.ajax({
            url: bpath + 'my/add/additional/barangay',
            type: "POST",
            data: data,
            headers: {

                'X-CSRF-TOKEN': _token,

            },
            beforeSend: function() {

            },
            success: function(data) {

                __notif_show(1, 'Success', 'Barangay Added Successfully!');
                __modal_hide('add_barangay_mdl');
                my_address();

                if(address_reference == 'Permanent')
                {
                    getPerBarangay($('.municipal_id').val());

                }else
                {
                    getRefBarangay($('.municipal_id').val());
                }



                $('.provincial_id').val(null);
                $('.municipal_id').val(null);
                $('.barangay_name').val(null);



            },
            complete: function() {


            },
            error: function(xhr, status, error) {

                // Code to be executed if the request encounters an error
                console.error("Error: Request failed.", error);
                // Handle the error here
            }
        });


    });


}
function getRefBarangay(city_munCode){

    $.ajax({
        url: bpath + 'application/get/address/municipality',
        type: "POST",
        data: {_token, city_munCode,},
        success: function (response) {

            var data = JSON.parse(response);

            let ref_province = data['province_option'];
            let ref_brgy_val = data['brgy_option'];

            // $('.ref_province').html(ref_province);
            $('.ref_brgy').html(ref_brgy_val);

            $('.btn_add_ref_barangay').show();


        }
    });

}
function getPerBarangay(city_munCode){

    $.ajax({
        url: bpath + 'application/get/address/municipality',
        type: "POST",
        data: {_token, city_munCode,},
        success: function (response) {

            var data = JSON.parse(response);

            let ref_province = data['province_option'];
            let ref_brgy_val = data['brgy_option'];

            // $('.per_province').html(ref_province);
            $('.per_brgy').html(ref_brgy_val);
            $('.btn_add_per_barangay').show();

        }
    });

}

function addBarangay(element){


    let province_code = $('.ref_province').val();
    let province_text = $('.ref_province').text();
    let municipal_code = $('.ref_city_mun').val();
    let municipal_text = $('.ref_city_mun').text();

    $('.provincial_id').val(province_code);
    $('.municipal_id').val(municipal_code);

    if(element == 'btn_add_ref_barangay')
    {
        $('.address_ref').val('Residence');

    }else if(element == 'btn_add_per_barangay')
    {
        $('.address_ref').val('Permanent');
    }


    __modal_toggle('add_barangay_mdl');


}

function populate_residential_address (res_province,res_province_code, res_municipality_code,res_municipality, res_brgy_code,res_brgy){

    if (res_province) {

        $('.ref_province').val(res_province_code);
        $('.ref_province').select2({
            placeholder: res_province,
            closeOnSelect: true,
        });
    }

    else {
        $('.ref_province').select2({
            placeholder: "Select Province",
            closeOnSelect: true,
        });
    }


    if (res_municipality) {

        // $('.ref_city_mun').val(res_municipality_code);
        // $('.ref_city_mun').select2({
        //     placeholder: res_municipality,
        //     closeOnSelect: true,
        // });

        $.ajax({
            type: 'POST',
            url: bpath + 'my/get/res/municipality',
            data: { _token, res_province_code }
        }).
        then(function (response) {

            if(response) {
                let data = JSON.parse(response);
                if(data.length > 0) {
                    for (var i = 0; i < data.length; i++) {

                        let city_mun_id = data[i]['city_mun_id'];
                        let city_mun_ = data[i]['city_mun_'];

                        var option = new Option(city_mun_,city_mun_id, false, true);
                        $('.ref_city_mun').append(option);
                    }
                }
                $('.ref_city_mun').val(res_municipality_code).trigger('change');
            }
        });

    }else if(res_municipality == '')
    {
        $.ajax({
            type: 'POST',
            url: bpath + 'my/get/res/municipality',
            data: { _token, res_province_code }
        }).
        then(function (response) {

            if(response) {
                let data = JSON.parse(response);

                if(data.length > 0) {
                    for (var i = 0; i < data.length; i++) {

                        let city_mun_id = data[i]['city_mun_id'];
                        let city_mun_ = data[i]['city_mun_'];

                        let city_option = new Option(city_mun_,city_mun_id, true, true);
                        $('.ref_city_mun').append(city_option);
                    }
                }
                $('.ref_city_mun').val(res_municipality_code).trigger('change');
            }
        });
    }

    else {
        $('.ref_city_mun').select2({
            placeholder: "Select Municipality",
            closeOnSelect: true,
        });
    }


    if (res_brgy) {

        $.ajax({
            type: 'POST',
            url: bpath + 'my/get/res/brgy',
            data: { _token, res_municipality_code }
        }).
        then(function (response) {

            if(response) {
                let data = JSON.parse(response);
                if(data.length > 0) {
                    for (var i = 0; i < data.length; i++) {

                        let brgy_id = data[i]['brgy_id'];
                        let brgy_ = data[i]['brgy_'];

                        var option = new Option(brgy_,brgy_id, false, true);
                        $('.ref_brgy').append(option);
                    }
                }
                $('.ref_brgy').val(res_brgy_code).trigger('change');
            }
        });
    }

    else if(res_brgy == '') {

        $.ajax({
            type: 'POST',
            url: bpath + 'my/get/res/brgy',
            data: { _token, res_municipality_code }
        }).
        then(function (response) {

            if(response) {
                let data = JSON.parse(response);
                if(data.length > 0) {
                    for (var i = 0; i < data.length; i++) {

                        let brgy_id = data[i]['brgy_id'];
                        let brgy_ = data[i]['brgy_'];

                        var option = new Option(brgy_,brgy_id, false, true);
                        $('.ref_brgy').append(option);
                    }
                }
                $('.ref_brgy').val(res_brgy_code).trigger('change');
            }
        });
    }

    else {
        $('.ref_brgy').select2({
            placeholder: "Select Barangay",
            closeOnSelect: true,
        });
    }

}

function populate_permanent_address(per_province_code,per_province, per_city_mun_code,per_city_mun, per_brgy_code,per_brgy){

    if (per_province) {
        $('.per_province').val(per_province_code);
        $('.per_province').select2({
            placeholder: per_province,
            closeOnSelect: true,
        });
    }

    else {
        $('.per_province').select2({
            placeholder: "Select Province",
            closeOnSelect: true,
        });
    }


    if (per_city_mun) {
        $('.per_city_mun').val(per_city_mun_code);
        $('.per_city_mun').select2({
            placeholder: per_city_mun,
            closeOnSelect: true,
        });
    }

    else {
        $('.per_city_mun').select2({
            placeholder: "Select Municipality",
            closeOnSelect: true,
        });
    }

    if (per_brgy) {

        $.ajax({
            type: 'POST',
            url: bpath + 'my/get/per/brgy',
            data: { _token, per_city_mun_code }
        }).
        then(function (response) {

            if(response) {
                let data = JSON.parse(response);

                if(data.length > 0) {
                    for (var i = 0; i < data.length; i++) {

                        let brgy_id = data[i]['brgy_id'];
                        let brgy_ = data[i]['brgy_'];

                        var option = new Option(brgy_,brgy_id, false, true);
                        $('.per_brgy').append(option);
                    }
                }
                $('.per_brgy').val(per_brgy_code).trigger('change');
            }
        });

    }

    else if(per_brgy == '') {

        $.ajax({
            type: 'POST',
            url: bpath + 'my/get/per/brgy',
            data: { _token, per_city_mun_code }
        }).
        then(function (response) {

            if(response) {
                let data = JSON.parse(response);
                if(data.length > 0) {
                    for (var i = 0; i < data.length; i++) {

                        let brgy_id = data[i]['brgy_id'];
                        let brgy_ = data[i]['brgy_'];

                        var option = new Option(brgy_,brgy_id, false, true);
                        $('.per_brgy').append(option);
                    }
                }
                $('.per_brgy').val(per_brgy_code).trigger('change');
            }
        });
    }

    else {
        $('.per_brgy').select2({
            placeholder: "Select Barangay",
            closeOnSelect: true,
        });
    }

}



function load_dynamic_city_mun(provCode, res_city_mun_code){
    $.ajax({
        url: bpath + 'application/get/address/province',
        type: "POST",
        data: {_token, provCode,},
        success: function (response) {

            var data = JSON.parse(response);

            let ref_mun_val = data['municipality_option'];
            let ref_brgy_val = data['brgy_option'];

            $('.per_city_mun').html(ref_mun_val);
            $('.per_brgy').html(ref_brgy_val);

            $('.per_city_mun').val(res_city_mun_code).trigger('change');
        }
    });
}

function load_dynamic_brgy(city_munCode, res_brgy_code){

    $.ajax({
        url: bpath + 'application/get/address/municipality',
        type: "POST",
        data: {_token, city_munCode,},
        success: function (response) {

            var data = JSON.parse(response);

            let ref_brgy_val = data['brgy_option'];

            $('.per_brgy').html(ref_brgy_val);
            $('.per_brgy').val(res_brgy_code).trigger('change');
        }
    });
}
