    $(document).ready(function() {

        load_datatable();

        bind_events();

        bind_input_events();


        setupUploader();

    });

    var  _token = $('meta[name="csrf-token"]').attr('content');
    var  bpath = $('meta[name="basepath"]').attr('content') + "/";
    var tbldata;
    var tbldata_records;

    var selectedFiles;
    var selectedFilename = "";

    var pretag_progress_upload = "progress-upload";
    var pretag_progress_upload_status = "status-upload";

    var validData = false;
    var dataCount = 0;
    var dataContent = "";

    var dataIndex = 0;
    var onDataSave = false;
    var tmrsd = null;
    var delaySD = 1000;
    var sdCountPerProcess = 100;
    var sdSuccessCountTotal = 0;
    var sdErrorCountTotal = 0;
    var sdFinished = true;


    function bind_events() {
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
    }

    function bind_events_2() {
        try{
            $('.b_action_2').unbind();
        }catch(err){}
        try{
        $(".b_action_2").on('click', function(event){
            /***/
            check_action($(this));
            /***/
        });
        }catch(err){}
    }

    function bind_row_events() {
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
    }

    function bind_tooltip() {
        try{
            //$('.tooltip').unbind();
        }catch(err){}
        try{
            $('.tooltip').tooltipster();
        }catch(err){}
    }

    function bind_input_events() {

        try{
            $('#' + 'input_attlog').on('change', function(event){
                /***/
                checkAttlogUploaderValue($(this), event);
                /***/
            });
        }catch(err){}

        try{
            $('#' + 'input_attlog').on('click', function(event){
                /***
                checkAttlogUploaderValue($(this));
                /***/
            });
        }catch(err){}

    }

    function check_action(src) {
        try{
            var data_type = src.attr("data-type");
            var data_target = src.attr("data-target");
            /***/
            if(data_type != null) {
                /***/
                if(data_type.trim().toLowerCase() == "action".trim().toLowerCase()) {

                    if(data_target.trim().toLowerCase() == "show-attlog-file-select".trim().toLowerCase()) {
                        /***/

                        /***/
                    }

                    if(data_target.trim().toLowerCase() == "attlog-upload-cancel".trim().toLowerCase()) {
                        /***/
                        modal_hide('mdl__attlog_upload_confirm');
                        $('#' + 'input_attlog').val(null);
                        /***/
                    }
                    if(data_target.trim().toLowerCase() == "attlog-upload-confirm".trim().toLowerCase()) {
                        /***/
                        if(selectedFiles.length > 0) {

                            readTextFile(selectedFiles[0]);
                        }else{
                            $('#' + 'input_attlog').val(null);
                        }
                        modal_hide('mdl__attlog_upload_confirm');
                        /***/
                    }


                    if(data_target.trim().toLowerCase() == "show-data-upload-save-confirm".trim().toLowerCase()) {
                        /***/
                        modal_show('mdl__attlog_upload_save_confirm');
                        /***/
                    }
                    if(data_target.trim().toLowerCase() == "attlog-upload-save-confirm".trim().toLowerCase()) {
                        /***/
                        modal_hide('mdl__attlog_upload_save_confirm');
                        saveUploadedData();
                        /***/
                    }

                }
                /***/
            }
            /***/
        }catch(err){}
    }

    function readTextFile(file) {
        try{

            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                const result = event.target.result;
                /* PROCESS RESULT */
                //console.log(result);
                dataContent = result;
                dataCount = 0;
                validData = false;
                let count = 0;
                try{
                    let tad = result.split("\n");
                    count = tad.length;
                    if(count > 0) {
                        if(tad[0].trim() == "") {
                            count -= 1;
                        }
                        if(tad[count - 1].trim() == "") {
                            count -= 1;
                        }
                    }
                }catch(err){}
                
                if(count > 0) {
                    validData = true;
                }
                dataCount = count;
                updateProgressStatus(pretag_progress_upload_status, count, true);
            });

            reader.addEventListener('progress', (event) => {
                if (event.loaded && event.total) {
                    const percent = (event.loaded / event.total) * 100;
                    updateProgressTarget(pretag_progress_upload, selectedFilename, Math.round(percent), true);
                    if(percent >= 100) {

                    }
                }
            });

            reader.readAsText(file);

        }catch(err){}
    }


    function checkAttlogUploaderValue(src, event) {
        try{
            if(src != null && src != undefined) {

                let val = src.val();
                if(val != null && val != undefined && val.trim() != "") {
                    let paths = val.split('\\');
                    if(paths.length > 0) {
                        let fn = paths[paths.length - 1];
                        let ext = "." + fn.split('.').pop();
                        let name = fn;
                        name = name.replace(ext, '');
                        selectedFiles = event.target.files;
                        selectedFilename = name;
                        $('#' + 'attlog_upload_confirm_name').html(name);
                        modal_show('mdl__attlog_upload_confirm');
                    }
                }

            }
        }catch(err){}
    }



    function setupUploader() {
        try{

        }catch(err){}
    }


    function load_datatable() {

        try{
            /***/
            tbldata = $('#dt_data').DataTable({
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
            });
            tbldata.on( 'page.dt', function () {
            try{

            }catch(err){}
            } );
            /***/
        }catch(err){  }

        try{
            /***/
            tbldata_records = $('#dt_records').DataTable({
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
            });
            tbldata_records.on( 'page.dt', function () {
            try{

            }catch(err){}
            } );
            /***/
        }catch(err){  }
        
    }


    function saveUploadedData() {
        if(validData && !onDataSave && sdFinished) {
            //console.log(dataContent);

            dataIndex = 0;
            sdSuccessCountTotal = 0;
            sdErrorCountTotal = 0;
            sdFinished = false;

            updateUploadDataSaveProgress(0, 100);
            enableUploadSaveDataBtn(false);
            enableUploadSelectBtn(false);

            __notif_show("1", "Data Upload" , "Starting data upload.");

            tmrsd = setInterval(saveUploadedDataProcess, delaySD);

        }
    }

    function saveUploadedDataProcess() {
        if(validData) {

            try{

                if(!onDataSave) {

                    onDataSave = true;

                    $.ajax({
                        url: bpath + 'dtr/manage/data/save',
                        type: "POST",
                        data: {
                            '_token': _token,
                            'data': dataContent,
                            'startIndex': dataIndex,
                            'endIndex': (dataIndex + sdCountPerProcess),
                        },
                        success: function(response) {
                            /***/
                            var data = (response);
                            if(data != null && data != undefined) {
                                try{
                                    var code = parseInt(data['code']);
                                    var message = (data['message']);
                                    var data_count = parseInt(data['data_count']);
                                    var success_count = parseInt(data['success_count']);
                                    /***/
                                    /***/
                                    if(code > 0) {
                                        /*__notif_show("1", "Success" , success_count + " attendance data saved.");*/
                                        sdSuccessCountTotal += 1;
                                    }else{
                                        /*__notif_show("-2", "Error" , message);*/
                                        sdErrorCountTotal += 1;
                                    }
                                    /***/
                                }catch(err){}
                            }
                            try{

                            }catch(err){}
                        },
                        error: function (response) {
                            try{

                            }catch(err){}
                        }
                    })
                    .always(function (response) {
                        try{
                            updateUploadDataSaveProgress((dataIndex + 1), dataCount);
                        }catch(err){}
                        try{
                            stopCheckSaveDataInterval();
                            dataIndex += sdCountPerProcess;
                            onDataSave = false;
                        }catch(err){}
                    });

                }
                
            }catch(err){  }

            stopCheckSaveDataInterval();

        }
    }

    function stopCheckSaveDataInterval() {

        if(dataIndex >= (dataCount - 1)) {
            clearInterval(tmrsd);
            tmrsd = null;
            enableUploadSaveDataBtn(true);
            enableUploadSelectBtn(true);
            /***/
            if(!sdFinished) {
                if(sdSuccessCountTotal > 0) {
                    __notif_show("1", "Success" , sdSuccessCountTotal + " attendance data saved.");
                }else{
                    __notif_show("-2", "Error" , sdSuccessCountTotal + " out of " + dataCount + " data unable to save.");
                }
                sdFinished = true;
            }
            /***/
        }

    }


    function updateProgressTarget(preid = "", title = "", percent = 0, visible = true) {
        try{
            var idHolder = preid.trim() + "-h";
            var idTitle = preid.trim() + "-name";
            var idPercentText = preid.trim() + "-percent-text";
            var idBar = preid.trim() + "-bar";
            /***/
            var visibility = "hidden";
            if(visible) {
                visibility = "visible";
            }
            $('#' + idHolder).css({ "visibility":visibility });
            /***/
            $('#' + idTitle).html(title);
            /***/
            if(percent < 0) {
                percent = 0;
            }
            if(percent > 100) {
                percent = 100;
            }
            $('#' + idPercentText).html(percent);
            /***/
            $('#' + idBar).css({ "width":percent+"%" });
            /***/
        }catch(err){}
    }

    function updateProgressStatus(preid = "", dataCount = 0, visible = true) {
        try{
            var idHolder = preid.trim() + "-h";
            var idDataCount = preid.trim() + "-data-count";
            var idBtnSave = preid.trim() + "-btn-save";
            /***/
            var visibility = "none";
            if(visible) {
                visibility = "grid";
            }
            $('#' + idHolder).css({ "display":visibility });
            /***/
            $('#' + idDataCount).html(dataCount);
            /***/
            if(dataCount > 0 && validData) {
                $('#' + idBtnSave).html('Save Data');
                $('#' + idBtnSave).removeClass('btn-secondary');
                $('#' + idBtnSave).addClass('btn-primary');
            }else{
                $('#' + idBtnSave).html('No Data');
                $('#' + idBtnSave).removeClass('btn-primary');
                $('#' + idBtnSave).addClass('btn-secondary');
            }
            /***/
            /***/
        }catch(err){}
    }

    function updateUploadDataSaveProgress(value, max) {
        try{
            if(value < 0) {
                value = 0;
            }
            if(value > max) {
                value = max;
            }
            /***/
            let per = value / max;
            let tv = parseInt(per * 100);
            if(tv < 0) {
                tv = 0;
            }
            if(tv > 100) {
                tv = 100;
            }
            /***/
            let target = $('#' + pretag_progress_upload + '-save-bar');
            target.css({ "width":tv+"%" });
            /***/
        }catch(err){}
    }

    function enableUploadSaveDataBtn(enable = true) {
        try{
            /***/
            let target = $('#' + pretag_progress_upload_status + '-btn-save');
            if(enable) {
                target.removeAttr("disabled");
            }else{
                target.attr("disabled", true);
            }
            /***/
        }catch(err){}
    }

    function enableUploadSelectBtn(enable = true) {
        try{
            /***/
            let target_lbl = $('#' + '' + 'input_attlog_lbl');
            let target_input = $('#' + '' + 'input_attlog');
            if(enable) {
                target_input.removeAttr("disabled");
                target_lbl.removeClass("btn-secondary");
                target_lbl.addClass("btn-primary");
            }else{
                target_input.attr("disabled", true);
                target_lbl.removeClass("btn-primary");
                target_lbl.addClass("btn-secondary");
            }
            /***/
        }catch(err){}
    }

