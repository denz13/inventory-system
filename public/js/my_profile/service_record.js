var  _token = $('meta[name="csrf-token"]').attr('content');

$(document).ready(function () {
    bpath = __basepath + "/";
    tab_clickFunction();
    load_serviceRecord();
    click_Function();

});

function tab_clickFunction(){

    $("body").on('click', '#service_record_tab', function () {
        // showLoading();
        $('.btn_save_PDS_div').hide();

    });
}

function click_Function(){

    var lbl_existsText;
    $("body").on("click", '#lwp_lbl', function () {
        var lwp_lbl = $(this);

        lbl_existsText = lwp_lbl.text().trim();

        // Remove the data-placeholder attribute
        lwp_lbl.removeAttr("data-placeholder");

    });

    $("body").on("focusout", '#lwp_lbl', function () {
        var label = $(this);
        var lwp_start_date = label.closest('tr').find('#startOfYear');
        var lwp_end_date = label.closest('tr').find('#endOfYear');
        var successIcon = label.closest('tr').find('.show-on-success');

        // if (!label.text().trim()) {
        //     label.text("").attr("data-placeholder", "None");
        // }

        if(lbl_existsText != label.text().trim()){

            $.ajax({
                type: "post",
                url: bpath + "admin/service-record-save",
                data: {_token: _token,
                        lwp_label: label.text().trim(),
                        lwp_start_date: lwp_start_date.text().trim(),
                        lwp_end_date: lwp_end_date.text().trim(),
                    },
                dataType: "json",
                success: function (response) {

                    if(response.status == 200){

                        successIcon.show();

                        setTimeout(function () {
                            successIcon.hide();
                        }, 1000);
                    }
                }
            });


        }


    });


}

function load_serviceRecord(){
    $.ajax({
        type: "get",
        url: bpath + "my/load-service-record",
        data: {_token:_token},
        success: function (response) {
            $('#service_record_blade').html(response);
            // hideLoading();
        }
    });
}



