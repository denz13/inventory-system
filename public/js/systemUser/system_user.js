var  _token = $('meta[name="csrf-token"]').attr('content');
$(document).ready(function (){

    bpath = __basepath + "/";
    _chooseAgency_click();
});

function _chooseAgency_click(){
    $("body").on('click', '#agencyUser_checkbox', function () {

        if ($(this).prop('checked')) {
            $('.agencyCheckbox').not(this).prop('checked', false);
            $.ajax({
                type: "post",
                url: "/system/user",
                data: {_token: _token, agency_value: $(this).val()},
                dataType: "json",
                success: function (response) {
                    if (response.status === 200) {
                        __notif_show(1, "Agency Change to "+response.agencyName);
                        
                    }
                }
            });
            
        }else{
            __notif_show(-1, "Please Choose Agency");
            $(this).prop('checked', true);
        }  
      
    });

}

