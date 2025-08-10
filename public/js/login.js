$(document ).ready(function() {

  bioengine = new BioEngine();
  bioengine.setCallbackFPGetCommon(callbackFPCommon);
  bioengine.setCallbackFPGetData(callbackFPGetData);
  bioengine.setCallbackFPCheck(callbackFPCheck);

  var tsrc = '';
  var tdst = '';
  onelogin = new OneLogin(_token, tsrc, tdst);


  bind_events();

    bpath = __basepath + "/";


    fetchRegistrationSetup();

});

var  _token = $('meta[name="csrf-token"]').attr('content');
var  bpath = $('meta[name="basepath"]').attr('content') + "/";

var onelogin;

var bioengine;

var tmr;
var tmr_vsclose;
var closeDelay = 3000;



function bind_events() {
    /***/
    /***/
    try{
        $('.b_action').unbind();
    }catch(err){}
    try{
        $(".b_action").on('click', function(event){
            /***/
            check_action($(this));
            /***/
        });
    }catch(err){}
    /***/
    /***/
    try{
        $('.input_action').unbind();
    }catch(err){}
    try{
        $(".input_action").on('click', function(event){
            /***/
            check_action($(this));
            /***/
        });
    }catch(err){}
    /***/
    /***/
}

function check_action(src) {
    try{
        var data_type = src.attr("data-type");
        var data_target = src.attr("data-target");
        /***/
        if(data_type != null) {
            /***/
            if(data_type.trim().toLowerCase() == "action".trim().toLowerCase()) {
                if(data_target.trim().toLowerCase() == "dev-fp-mode-set-verify".trim().toLowerCase()) {
                    /***/
                    var v = src.attr("data-value");
                    setDeviceFPMode_Verify(v);
                    /***/
                }

                if(data_target.trim().toLowerCase() == "fp-register-cancel".trim().toLowerCase()) {
                    /***/
                    setDeviceAction_RegisterCancel();
                    /***/
                }
                if(data_target.trim().toLowerCase() == "fp-verify-cancel".trim().toLowerCase()) {
                    /***/
                    setDeviceAction_VerifyCancel();
                    /***/
                }

                if(data_target.trim().toLowerCase() == "fp-verify-success-cancel".trim().toLowerCase()) {
                    /***/
                    closeVerifySuccess();
                    /***/
                }

                if(data_target.trim().toLowerCase() == "fp-verify-error-cancel".trim().toLowerCase()) {
                    /***/
                    closeVerifyError();
                    /***/
                }


            }
            /***/
        }
        /***/
    }catch(err){}
}



function fp_login(username) {
  try{

    var lbl_name = $('#' + 'ttl-verify-success');
    var lbl_details = $('#' + 'lbl-verify-success-details');

    $.ajax({
        url: bpath + 'bio-login',
        type: "POST",
        data: {
            '_token': _token,
            'username':username,
        },
        success: function(response) {
            try{

                var data = response;
                var res_code = parseInt(data['code']);
                var res_msg = (data['message']);

                if(res_code > 0) {
                    __notif_show("1", "Success" , "Login successful.");
                    /**/
                    try{
                        var d2 = data['data'];
                        lbl_name.html(d2['name']);
                    }catch(err){}
                    /**/
                    modal_show('mdl__fp_verify_success');
                    tmr_vsclose = setTimeout(closeVerifySuccess, closeDelay);
                    /**/
                }else{
                    __notif_show("-2", "Error" , res_msg);
                }

            }catch(err){}
        },
        error: function (response) {

        }
    });

  }catch(err){  }
}

function closeVerifySuccess() {
    try{
        /***/
        fpverifyUpdateStatusFeatures(1, 1);
        modal_hide('mdl__fp_verify_success');
        /***/
        window.location.href = "" + bpath;
        /***/
        tmr_vsclose = null;
        /***/
    }catch(err){}
}

function closeVerifyError() {
    try{
        /***/
        fpverifyUpdateStatusFeatures(1, 1);
        modal_hide('mdl__fp_verify_error');
        /***/
        /***/
        tmr_vsclose = null;
        /***/
    }catch(err){}
}


function callbackFPCheck(data) {

    if(data !== null && data !== undefined) {

        var status = parseInt(data['status']);
        var message = (data['message']);
        var d2 = data['data'];

        var t1 = $('#' + 'h_b_l_fp');

        if(status > 0) {
            /***/
            var cd = '<div class="mt-10"><a href="javascript:;" class="b_action" data-type="action" data-target="dev-fp-mode-set-verify" data-value="log-in"><i class="fas fa-fingerprint fs_c_2 text-secondary cursor-pointer"></i></a></div>';
            t1.html(cd);
            bind_events();
            /***/
        }else{
            /***/
            /***/
        }

    }

}
function callbackFPGetData(data) {


    if(data !== null && data !== undefined) {


    }

}

function callbackFPCommon(data) {

    if(data !== null && data !== undefined) {

        var action = data['action'];
        var value = data['value'];

        if(action.toLowerCase().trim() == "show-reg".toLowerCase().trim()) {
            /***/
            var count = parseInt(data['featuresNeeded']);
            fpregShow(count, count, true);
            /***/
        }
        if(action.toLowerCase().trim() == "show-verify".toLowerCase().trim()) {
            /***/
            var count = parseInt(data['featuresNeeded']);
            fpverifyShow(count, count, true);
            /***/
            try{
                var title = data['verifytype'];
                var ttl = $('#' + 'ttl-verify');
                var ttl2 = $('#' + 'lbl-verify-success-details');
                ttl.html(title);
                ttl2.html(title);
            }catch(err){}
            /***/
        }


        if(action.toLowerCase().trim() == "register-cancel".toLowerCase().trim()) {
            /***/
            var count = parseInt(data['featuresNeeded']);
            fpregShow(count, count, false);
            /***/
        }
        if(action.toLowerCase().trim() == "verify-cancel".toLowerCase().trim()) {
            /***/
            fpverifyShow(1, 1, false);
            /***/
        }

        if(action.toLowerCase().trim() == "verify-result".toLowerCase().trim()) {
            /***/
            var fd = data['data'];
            var verifytype = data['verifytype'];
            var uid = fd['id'];
            /***/
            if(value.toLowerCase().trim() == "success".toLowerCase().trim()) {
                fpverifyUpdateStatusFeatures(0, 1);
                if(verifytype.toLowerCase().trim() == "log-in".toLowerCase().trim()){
                  fp_login(uid);
                }
            }
            if(value.toLowerCase().trim() == "error".toLowerCase().trim()) {
                fpverifyUpdateStatusFeatures(1, 1);
                /**/
                modal_show('mdl__fp_verify_error');
                tmr_vsclose = setTimeout(closeVerifyError, closeDelay);
                /**/
            }
            /***/
        }

    }

}




function fpverifyShow(featuresNeeded, featuresMax = 1, show = true) {
    try{
        /***/
        /***/
        if(show) {
            /***/
            var featui = $('#' + 'fp-verify-features-ui');
            var rem = featuresMax - featuresNeeded;
            var tc = "";
            fpverifyUpdateStatusFeatures(featuresNeeded, featuresMax);
            /***/
            modal_show('mdl__fp_verify');
        }else{
            /***/
            /***/
            modal_hide('mdl__fp_verify');
        }
        /***/
    }catch(err){}
}
function fpverifyUpdateStatusFeatures(featuresNeeded, featuresMax = 1) {
    try{
        /***/
        var featui = $('#' + 'fp-verify-features-ui');
        var rem = featuresMax - featuresNeeded;
        var tc = "";
        for(var i=1; i<=featuresMax; i++) {
            if(i <= rem) {
                tc = tc + '<i class="fas fa-fingerprint p-2 fs_c_2 text-success"></i>';
            }else{
                tc = tc + '<i class="fas fa-fingerprint p-2 fs_c_2 text-secondary"></i>';
            }
        }
        featui.html(tc);
        /***/
        /***/
    }catch(err){}
}
function fpverifyUpdateStatusMessage(msg) {
    try{
        /***/
        var msgc = $('#' + 'fp-verify-msg');
        var tc = "";
        /***/
        tc = msg;
        /***/
        msgc.html(tc);
        /***/
    }catch(err){}
}


function setDeviceFPMode_Register() {
    bioengine.fpSendAction_Register();
}
function setDeviceFPMode_Verify(type = "") {
    /***/
    if(type.trim() != "") {
        /***/
        var tn = 0;
        if(type.toLowerCase().trim() == "time-in".toLowerCase().trim()) {
            bioengine.setVerifyType(type.toLowerCase().trim());
            tn++;
        }
        if(type.toLowerCase().trim() == "time-out".toLowerCase().trim()) {
            bioengine.setVerifyType(type.toLowerCase().trim());
            tn++;
        }
        if(type.toLowerCase().trim() == "log-in".toLowerCase().trim()) {
            bioengine.setVerifyType(type.toLowerCase().trim());
            tn++;
        }
        /***/
        if(tn > 0) {
            bioengine.fpSendAction_Verify();
        }
    }
    /***/
}
function setDeviceAction_RegisterCancel() {
    bioengine.fpSendAction_RegisterCancel();
}
function setDeviceAction_VerifyCancel() {
    bioengine.fpSendAction_VerifyCancel();
}


function fetchRegistrationSetup(){

    $.ajax({
        url: '/admin/fetch-registration-status',
        type: 'POST',
        dataType: 'json',
        data: {
            _token: _token,
        },
        beforeSend: function () {

        },
        success: function (response) {

            if(response.success)
            {
                let registration_button = response.registration_button;

                $('.registration_div').html(registration_button);

            }
        },

        complete: function () {


        }
    });

}
