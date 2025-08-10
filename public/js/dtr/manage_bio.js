    $(document).ready(function() {

        bioengine = new BioEngine();
        bioengine.setCallbackFPGetCommon(callbackFPCommon);
        bioengine.setCallbackFPGetData(callbackFPGetData);
        bioengine.setCallbackSaveFingerprint(callbackSaveFingerprint);
        bioengine.setCallbackFPRegister(callbackFPRegister);
        bioengine.setCallbackFPCheck(callbackFPCheck);

        load_datatable();
        /*load_data();*/

        bind_events();

        employee_check();

        $('#' + 'btn-h-1').html('');


        //fpregShow(4, 4, true);
        //fpregUpdateStatusMessage('');

        //load_list_users();

    });

    var  _token = $('meta[name="csrf-token"]').attr('content');
    var  bpath = $('meta[name="basepath"]').attr('content') + "/";

    var bioengine;

    var tbldata;
    var tblusers_select;

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


                    if(data_target.trim().toLowerCase() == "show-users-select".trim().toLowerCase()) {
                        /***/
                        load_list_users();
                        modal_show("mdl__users__select");
                        /***/
                    }

                    if(data_target.trim().toLowerCase() == "select-user".trim().toLowerCase()) {
                        /***/
                        $('#' + 'su-id').val(src.attr("data-value"));
                        $('#' + 'su-name').val(src.attr("data-value-2"));
                        employee_check();
                        modal_hide("mdl__users__select");
                        /***/
                    }


                    if(data_target.trim().toLowerCase() == "dev-fp-mode-set-register".trim().toLowerCase()) {
                        /***/
                        setDeviceFPMode_Register();
                        /***/
                    }
                    if(data_target.trim().toLowerCase() == "dev-fp-mode-set-verify".trim().toLowerCase()) {
                        /***/
                        setDeviceFPMode_Verify();
                        /***/
                    }
                    if(data_target.trim().toLowerCase() == "dev-fp-data-sync-to-local".trim().toLowerCase()) {
                        /***/
                        syncFPDataToLocal();
                        /***/
                    }
                    if(data_target.trim().toLowerCase() == "dev-fp-data-sync-to-local-all".trim().toLowerCase()) {
                        /***/
                        syncFPDataToLocalAllData();
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


    function load_datatable() {

        try{
            /***/
            tblusers_select = $('#dt_users_select').DataTable({
                dom:
                    "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                    "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
                    "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
                renderer: 'bootstrap',
                "language": {
                "emptyTable": "..."
                },
                "info": false,
                "bInfo":true,
                "bJQueryUI": true,
                "bProcessing": true,
                "bPaginate" : true,
                "aLengthMenu": [[10,25,50,100,150,200,250,300,-1], [10,25,50,100,150,200,250,300,"All"]],
                "iDisplayLength": 10,
                "aaSorting": [],
                "ordering": true,
                "initComplete": function(settings, json) {
                    /*$('#dt_users_select_filter input').unbind();*/
                    $('#dt_users_select' + '_filter input').bind('keyup', function(e) {
                        if(e.keyCode == 13) {
                            tblusers_select.search( this.value ).draw();
                        }
                        var ti = $('#dt_users_select' + '_filter input');
                        try{
                            if(ti.val().length >= 3) {
                                load_list_users(ti.val());
                            }
                        }catch(err){}
                    });
                },
            });
            tblusers_select.on('page.dt', function () {
            try{
                bind_row_events();
            }catch(err){}
            })
            .on('order.dt', function () {
            try{
                bind_row_events();
            }catch(err){}
            })
            .on('search.dt', function (e) {
            try{
                bind_row_events();
            }catch(err){}
            });
            /***/
        }catch(err){  }
    }

    function load_data() {

        try{

            $.ajax({
                url: bpath + 'competency/skills/data/get',
                type: "POST",
                data: {
                    '_token': _token,
                },
                success: function(response) {
                    tbldata.clear().draw();
                    /***/

                    var data = (response);
                    if(data.length > 0) {
                        for(var i=0;i<data.length;i++) {
                            try{
                                /***/
                                var id = data[i]['skillid'];
                                var name = data[i]['skill'];
                                var details = data[i]['details'];
                                var points = data[i]['default_points'];

                                var cd = "";

                                /***/
                                cd = '' +
                                    '<tr>' +
                                    '   <td class="hidden">' + id + '</td>' +
                                    '   <td class="w-2/3">' +
                                    '       <div class="font-medium">' + name + '</div>' +
                                    '       <div class="text-slate-500 text-xs mt-0.5">' + details + '</div>' +
                                    '   </td>' +
                                    '   <td>' + details + '</td>' +
                                    '   <td>' +
                                    '       <div class="flex justify-center items-center">'+
                                    '       <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
                                    '           <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                    '           <div class="dropdown-menu w-40">'+
                                    '               <div class="dropdown-content">'+
                                    '                   <a href="javascript:;" class="dropdown-item b_action" data-type="action" data-target="show-update" data-id="' + id + '"> <i class="fa fa-edit w-4 h-4 mr-2"></i> Edit </a>'+
                                    '                   <a href="javascript:;" class="dropdown-item b_action" data-type="action" data-target="show-delete" data-id="' + id + '"> <i class="fa fa-trash w-4 h-4 mr-2"></i> Delete </a>'+
                                    '               </div>'+
                                    '           </div>'+
                                    '       </div>'+
                                    '       </div>'+
                                    '   </td>' +

                                    '</tr>' +
                                    '';
                                tbldata.row.add($(cd)).draw();
                                /***/
                            }catch(err){}
                        }
                    }

                    bind_events();

                },
                error: function (response) {

                }
            });

        }catch(err){}

    }



    function save_fingerprint(fpdata, postCheck = true) {

        try{

            var uid = $('#' + '' + 'su-id');

            $.ajax({
                url: bpath + 'dtr/manage/bio/fingerprint/save',
                type: "POST",
                data: {
                    '_token': _token,
                    'uid':uid.val(),
                    'fpdata':fpdata,
                },
                success: function(response) {
                    try{

                        var data = response;
                        var res_code = parseInt(data['code']);
                        var res_msg = (data['message']);

                        if(res_code > 0) {
                            __notif_show("1", "Success" , "Fingerprint saved.");
                            /**/
                            /**/
                            //modal_hide('mdl__add');
                            /**/
                        }else{
                            __notif_show("-2", "Error" , res_msg);
                        }

                        employee_check();

                    }catch(err){}
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



    function load_list_users(search = '', limit = 100) {

        try{

            $.ajax({
                url: bpath + 'dtr/manage/bio/users/list',
                type: "POST",
                data: {
                    '_token': _token,
                    'search': search,
                    'limit': limit,
                },
                success: function(response) {
                    tblusers_select.clear().draw();
                    /***/

                    var data = JSON.parse(response);
                    console.log(response);
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            try {
                                /***/
                                var id = data[i] ? data[i]["agencyid"] : "";
                                var lastname = data[i] ? data[i]["lastname"] : "";
                                var firstname = data[i] ? data[i]["firstname"] : "";
                                var middlename = data[i] ? data[i]["mi"] : "";

                                var middlenameDisplay =
                                    middlename === "N/A" ? "" : middlename;

                                var fullname =
                                    lastname.trim() +
                                    ", " +
                                    firstname.trim() +
                                    " " +
                                    middlenameDisplay;

                                var cd = "";

                                /***/
                                cd =
                                    "" +
                                    '<tr class="cursor-pointer row_action" data-type="action" data-target="select-user" data-value="' +
                                    id +
                                    '" data-value-2="' +
                                    fullname +
                                    '">' +
                                    '   <td class="hidden">' +
                                    id +
                                    "</td>" +
                                    '   <td class="">' +
                                    '       <div class="font-medium">' +
                                    id +
                                    "</div>" +
                                    "   </td>" +
                                    '   <td class="">' +
                                    '       <div class="font-medium">' +
                                    fullname +
                                    "</div>" +
                                    "   </td>" +
                                    "</tr>" +
                                    "";
                                tblusers_select.row.add($(cd)).draw();


                                /***/
                            } catch (err) {}
                        }
                    }

                    bind_row_events();

                },
                error: function (response) {

                }
            });

        }catch(err){}

    }

    function employee_check() {

        try{
            var sa_checker = $('#sa_check').val();
            var tad = '';

            var target = $('#' + 'suc_msgs');
            target.html(tad);

            var btnh1 = $('#' + 'btn-h-1');
            btnh1.html('');
            var btnh2 = $('#' + 'btn-h-2');
            btnh2.html('');

            var employee = $('#' + 'su-id').val();

            try{
                if(employee.trim() != "") {
                    if(sa_checker == 'Admin') {
                        var cd = '<button class="btn btn-primary shadow-md mr-2 b_action" data-type="action" data-target="dev-fp-mode-set-register">Register Fingerprint</button>';
                        btnh2.html(cd);
                    }
                }else{

                }
            }catch(err){}

            bind_events();

            if(employee.trim() != "") {

                try{

                    $.ajax({
                        url: bpath + 'dtr/manage/bio/check/employee',
                        type: "POST",
                        data: {
                            '_token': _token,
                            'employee': employee,
                        },
                        success: function(response) {
                            /***/
                            var data = (response);
                            /***/
                            /***/
                            if(data.length > 0) {
                                /***/
                                var twn = 0;
                                /***/
                                for(var i=0;i<data.length;i++) {
                                    try{
                                        /***/
                                        var type = data[i]['type'];
                                        var content = data[i]['content'];

                                        var cd = "";

                                        var css = 'alert-outline-danger';

                                        try{
                                            if(type.toLowerCase().trim() == "danger".toLowerCase().trim()) {
                                                css = 'alert-outline-danger';
                                                twn++;
                                            }
                                            if(type.toLowerCase().trim() == "warning".toLowerCase().trim()) {
                                                css = 'alert-outline-warning';
                                                twn++;
                                            }
                                        }catch(err){}

                                        /***/
                                        cd = '' +
                                            '<div class="alert ' + css + ' alert-dismissible show flex items-center mb-2" role="alert"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-octagon"><polygon points="7.86 1 16.14 1 22 7.86 22 16.14 16.14 22 7.86 22 1 16.14 1 7.86 7.86 1"></polygon><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg> <div class="pl-3" style="display: inline-block;">' + content.trim() + '</div></div>' +
                                            '';
                                        /***/
                                        tad = tad + cd;
                                        /***/
                                    }catch(err){  }
                                }
                                /***/
                                if(twn <= 0) {
                                    /***/
                                    cd = '' +
                                        '<div class="alert alert-outline-success alert-dismissible show flex items-center mb-2" role="alert"> <i class="fas fa-check-double"></i> <div class="pl-3" style="display: inline-block;">' + 'Fingerprint data detected.' + '</div></div>' +
                                        '';
                                    /***/
                                    tad = tad + cd;
                                    /***/
                                    cd = '<button class="btn btn-primary shadow-md mr-2 b_action" data-type="action" data-target="dev-fp-data-sync-to-local">Sync Fingerprint To Local</button><br/><br/><button class="btn btn-primary shadow-md mr-2 b_action" data-type="action" data-target="dev-fp-mode-set-verify">Verify</button>';
                                    btnh1.html(cd);
                                    bind_events();
                                    /***/
                                }
                                /***/
                            }else{

                                /***/
                                var cd = '' +
                                    '<div class="alert alert-outline-success alert-dismissible show flex items-center mb-2" role="alert"> <i class="fas fa-check-double"></i> <div class="pl-3" style="display: inline-block;">' + 'Fingerprint data detected.' + '</div></div>' +
                                    '';
                                /***/
                                tad = tad + cd;
                                /***/
                                /***/
                                cd = '<button class="btn btn-primary shadow-md mr-2 b_action" data-type="action" data-target="dev-fp-data-sync-to-local">Sync Fingerprint To Local</button><br/><br/><button class="btn btn-primary shadow-md mr-2 b_action" data-type="action" data-target="dev-fp-mode-set-verify">Verify</button>';
                                btnh1.html(cd);
                                bind_events();
                                /***/

                            }

                            target.html(tad);

                        },
                        error: function (response) {

                        }
                    });

                }catch(err){}

            }

        }catch(err){}

    }

    function syncFPDataToLocal() {

        try{

            var uid = $('#' + 'su-id').val();

            if(uid.trim() != "") {

                try{

                    $.ajax({
                        url: bpath + 'dtr/manage/bio/user/fingerprint/data/get',
                        type: "POST",
                        data: {
                            '_token': _token,
                            'uid': uid,
                        },
                        success: function(response) {
                            /***/
                            var data = (response);
                            /***/
                            bioengine.fpSyncDataToLocal(data);
                            /***/
                        },
                        error: function (response) {

                        }
                    });

                }catch(err){}

            }

        }catch(err){}

    }

    function syncFPDataToLocalAllData() {

        try{

            __notif_show("1", "All Data Sync" , "Starting all data sync.");

            bioengine.fpSyncDataToLocalAllData(data);

        }catch(err){}

    }


    function callbackFPCheck(data) {

        if(data !== null && data !== undefined) {

            var status = parseInt(data['status']);
            var message = (data['message']);
            var d2 = data['data'];

            if(status > 0) {
                /***/
                __notif_show("1", "Connected" , "Biometric device connected.");
                /***/
                /* BTN : SYNC ALL */
                var cd = '<button class="btn btn-primary shadow-md mr-2 b_action" data-type="action" data-target="dev-fp-data-sync-to-local-all">Sync All Fingerprint Data</button>';
                $('#' + 'btn-h-3').html(cd);
                bind_events();
                /***/
            }else{
                /***/
                __notif_show("-2", "Error" , "Unable to connect to biometric device.");
                $('#' + 'suc_dev_status_error').removeClass('hidden');
                /***/
            }

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

            save_fingerprint(data['fp_data']);

            fpregShow(0,0,false);

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
                    var need = parseInt(d2['featuresNeeded']);
                    var max = parseInt(d2['featuresMax']);
                    fpregUpdateStatusFeatures(need, max);
                    if(need >= max) {
                        fpregUpdateStatusMessage("Put your finger on the fingerprint device.");
                    }else{
                        fpregUpdateStatusMessage("Now lift your finger and put on the fingerprint device again.");
                    }
                    if(need <= 0) {
                        fpregUpdateStatusMessage("Fingerprint samples gathered.");
                    }
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

            if(action.toLowerCase().trim() == "sync-to-local".toLowerCase().trim()) {
                /***/
                var d2 = data['data'];
                if(d2 != null && d2 != undefined) {
                    var code = parseInt(d2['code']);
                    var msg = (d2['content']);
                    if(code > 0) {
                        __notif_show("1", "Success" , "Fingerprint saved to local.");
                    }else{
                        __notif_show("-2", "Error" , msg.trim());
                    }
                }
                /***/
            }
            if(action.toLowerCase().trim() == "sync-to-local-all".toLowerCase().trim()) {
                /***/
                var d2 = data['data'];
                if(d2 != null && d2 != undefined) {
                    var code = parseInt(d2['code']);
                    var msg = (d2['content']);
                    if(code > 0) {
                        __notif_show("1", "Success" , "Fingerprint saved to local.");
                    }else{
                        __notif_show("-2", "Error" , msg.trim());
                    }
                }
                /***/
            }

            if(action.toLowerCase().trim() == "verify-result".toLowerCase().trim()) {
                /***/
                var fd = data['data'];
                if(value.toLowerCase().trim() == "success".toLowerCase().trim()) {
                    fpverifyUpdateStatusFeatures(0, 1);
                    /**/
                    try{
                        var tv = $('#' + 'su-id').val();
                        var cv = fd['id'];
                        if(tv.toLowerCase().trim() == cv.toLowerCase().trim()) {
                            modal_show('mdl__fp_verify_success');
                            tmr_vsclose = setTimeout(closeVerifySuccess, closeDelay);
                        }else{
                            modal_show('mdl__fp_verify_error');
                            tmr_vsclose = setTimeout(closeVerifyError, closeDelay);
                        }
                    }catch(err){}
                    /**/
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
    function setDeviceFPMode_Verify() {
        bioengine.fpSendAction_Verify();
    }
    function setDeviceAction_RegisterCancel() {
        bioengine.fpSendAction_RegisterCancel();
    }
    function setDeviceAction_VerifyCancel() {
        bioengine.fpSendAction_VerifyCancel();
    }


