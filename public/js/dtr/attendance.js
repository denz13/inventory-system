    $(document).ready(function() {

        bioengine = new BioEngine();
        bioengine.setCallbackFPCheck(callbackFPCheck);
        bioengine.setCallbackFPGetCommon(callbackFPCommon);
        bioengine.setCallbackFPGetData(callbackFPGetData);
        bioengine.setCallbackSaveFingerprint(callbackSaveFingerprint);
        bioengine.setCallbackFPRegister(callbackFPRegister);

        bind_events();

        var tm = setTimeout(function(){
            //bioengine.deviceFPCheck(callbackFPCheck);
        }, 1200);

        load_time();
        tmr = setInterval(load_time, 1000);

        bind_fn_keys();

    });

    var  _token = $('meta[name="csrf-token"]').attr('content');
    var  bpath = $('meta[name="basepath"]').attr('content') + "/";

    var bioengine;

    var tmr;
    var tmr_vsclose;
    var closeDelay = 3000;

    var canlog = false;


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

    function bind_row_events() {
        /***/
        /***/
        try{
            $('.row_action').unbind();
        }catch(err){}
        try{
            $(".row_action").on('click', function(event){
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

                }
                /***/
            }
            /***/
        }catch(err){}
    }


    function bind_fn_keys() {
        try{
            $("body").keydown(function(e) {
                e.preventDefault();
                var keyCode = e.keyCode || e.which;

                if(keyCode == 112 || keyCode == 73) {
                    // F1 OR I
                    if(canlog) {
                        /***/
                        var v = "time-in";
                        setDeviceFPMode_Verify(v);
                        /***/
                    }
                }
                if(keyCode == 113 || keyCode == 79) {
                    // F2 OR O
                    if(canlog) {
                        /***/
                        var v = "time-out";
                        setDeviceFPMode_Verify(v);
                        /***/
                    }
                }
                if(keyCode == 27) {
                    // ESC
                    setDeviceAction_VerifyCancel();
                }
            });
        }catch(err){}
    }


    function load_time() {
        try{

            var date = new Date;

            var seconds = "" + date.getSeconds();
            var minutes = "" + date.getMinutes();
            var hour = "" + date.getHours();

            if(seconds.length < 2) {
                seconds = "0" + seconds;
            }
            if(minutes.length < 2) {
                minutes = "0" + minutes;
            }
            if(hour.length < 2) {
                hour = "0" + hour;
            }

            var tc = "" + hour + " : " + minutes + " : " + seconds;

            $('#' + 'h-time').html(tc);

        }catch(err){}
    }

    function load_att_btns(show = false) {
        try{

            var tc = "";

            if(show) {
                tc = '<button class="btn btn-outline-primary w-24 inline-block mr-1 mb-2 fs_c_3 font-poppins att-btn-1 b_action" data-type="action" data-target="dev-fp-mode-set-verify" data-value="time-in">TIME-IN<span class="att-btn-content-1">F1 or I</span></button><button class="btn btn-outline-primary w-24 inline-block  mb-2 fs_c_3 font-poppins att-btn-1 b_action" data-type="action" data-target="dev-fp-mode-set-verify" data-value="time-out">TIME-OUT<span class="att-btn-content-1">F2 or O</span></button>';

            }

            $('#' + 'att-btns').html(tc);

            canlog = true;

            bind_fn_keys();

            bind_events();
            
        }catch(err){}
    }




    function save_attendance(uid, type) {

        try{

            var lbl_name = $('#' + 'ttl-verify-success');
            var lbl_details = $('#' + 'lbl-verify-success-details');

            lbl_name.html('');
            lbl_details.html(type);

            $.ajax({
                url: bpath + 'dtr/attendance/data/save',
                type: "POST",
                data: {
                    '_token': _token,
                    'uid':uid,
                    'type':type,
                },
                success: function(response) {
                    try{

                        var data = response;
                        var res_code = parseInt(data['code']);
                        var res_msg = (data['message']);

                        if(res_code > 0) {
                            __notif_show("1", "Success" , "Attendance saved.");
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
            
        }catch(err){}

    }

    function closeVerifySuccess() {
        try{
            /***/
            fpverifyUpdateStatusFeatures(1, 1);
            modal_hide('mdl__fp_verify_success');
            /***/
            tmr_vsclose = null;
            /***/
        }catch(err){}
    }



    function callbackFPCheck(data) {

        //console.log(data);

        if(data != null && data != undefined) {
            /***/
            try{
                var status = parseInt(data['status']);
                if(status > 0) {
                    /***/
                    __notif_show("1", "Connected" , "Biometric device connected.");
                    /***/
                    load_att_btns(true);
                    canlog = true;
                }else{
                    load_att_btns(false);
                    canlog = false;
                }
            }catch(err){
                load_att_btns(false);
                canlog = false;
            }
            /***/
        }

    }
    function callbackFPGetData(data) {
        
        //console.log(data);
        
        if(data !== null && data !== undefined) {

            //console.log(data);

        }
        
    }
    function callbackSaveFingerprint(data) {
        
        //console.log(data);
        
        if(data !== null && data !== undefined) {

            //console.log(data);

            //console.log(data);

        }
        
    }
    function callbackFPRegister(data) {
        
        //console.log(data);
        
        if(data !== null && data !== undefined) {

            var d1 = data['data'];
            var d2 = data['data2'];

            try{
                if(d2 != null && d2 != undefined) {
                    /***/

                    /***/
                }
            }catch(err){}

            //console.log(data);

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
                    ttl.html(title);
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
                    if(verifytype.toLowerCase().trim() == "time-in".toLowerCase().trim()){
                        save_attendance(uid, verifytype);
                    }
                    if(verifytype.toLowerCase().trim() == "time-out".toLowerCase().trim()){
                        save_attendance(uid, verifytype);
                    }
                }
                if(value.toLowerCase().trim() == "error".toLowerCase().trim()) {
                    fpverifyUpdateStatusFeatures(1, 1);
                }
                /***/
            }

        }
        
    }

    function fpregShow(featuresNeeded, featuresMax, show = true) {
        try{
            /***/
            /***/
            if(show) {
                /***/
                var featui = $('#' + 'fp-reg-features-ui');
                var rem = featuresMax - featuresNeeded;
                var tc = "";
                fpregUpdateStatusFeatures(featuresNeeded, featuresMax);
                /***/
                modal_show('mdl__fp_register');
            }else{
                /***/
                /***/
                modal_hide('mdl__fp_register');
            }
            /***/
        }catch(err){}
    }
    function fpregUpdateStatusFeatures(featuresNeeded, featuresMax) {
        try{
            /***/
            var featui = $('#' + 'fp-reg-features-ui');
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
    function fpregUpdateStatusMessage(msg) {
        try{
            /***/
            var msgc = $('#' + 'fp-reg-msg');
            var tc = "";
            /***/
            tc = msg;
            /***/
            msgc.html(tc);
            /***/
        }catch(err){}
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
        console.log("Set Register");
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


