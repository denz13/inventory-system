
$(document).ready(function (){


});
var  _token = $('meta[name="csrf-token"]').attr('content');
var base_url = window.location.origin;

$("body").on("click", "#btn_login_onclick_check", function (ev) {
    //alert(1);
    ev.preventDefault();
    //console.log(_token);
    document.getElementById("logForm").submit();
    $.ajax({
		url: base_url + 'admin/manage/check/account/notif',
		type: "POST",
		data: {
			_token: _token,
			zz: 'zz',

		},
		success: function(data) {
            var data = JSON.parse(data);
            console.log(data);

            __notif_load_data(base_url + "/");
            document.getElementById("logForm").submit();
        }


    });

});
