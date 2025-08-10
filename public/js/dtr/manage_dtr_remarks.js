    $(document).ready(function() {

        bind_events();

        load_default_dates();
        load_data_dtr();

    });

    var  _token = $('meta[name="csrf-token"]').attr('content');
    var  bpath = $('meta[name="basepath"]').attr('content') + "/";
    var tbldata;
    var tbldata_skills;
    var tbldata_skills_add;
    var tbldata_reqs;
    var tbldata_reqs_add;

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

    function bind_t_events() {
        try{
            $('.b_r_action').unbind();
        }catch(err){}
        try{
        $(".b_r_action").on('click', function(event){
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

    function check_action(src) {
        try{
            var data_type = src.attr("data-type");
            var data_target = src.attr("data-target");
            /***/
            if(data_type != null) {
                /***/
                if(data_type.trim().toLowerCase() == "action".trim().toLowerCase()) {

                    if(data_target.trim().toLowerCase() == "load-dtr".trim().toLowerCase()) {
                        /***/
                        load_data_dtr();
                        /***/
                    }

                    if(data_target.trim().toLowerCase() == "print-dtr".trim().toLowerCase()) {
                        /***/
                        print_dtr();
                        /***/
                    }
                    if(data_target.trim().toLowerCase() == "print-dtr-w-remarks".trim().toLowerCase()) {
                        /***/
                        print_dtr_w_remarks();
                        /***/
                    }
                    if(data_target.trim().toLowerCase() == "print-dtr-w-total".trim().toLowerCase()) {
                        /***/
                        print_dtr_w_total();
                        /***/
                    }


                    if(data_target.trim().toLowerCase() == "show-edit-remarks".trim().toLowerCase()) {
                        /***/
                        modal_show('mdl__remarks_edit');
                        /***/
                    }

                }
                /***/
            }
            /***/
        }catch(err){}
    }


    function load_default_dates() {
        try{

            var datefrom = $('#' + 'date_from');
            var dateto = $('#' + 'date_to');

            try{
                if(datefrom == null || datefrom == undefined || datefrom.val().trim() == "") {
                    var date = new Date();
                    var year = "" + date.getFullYear();
                    var month = "" + (date.getMonth() + 1);
                    var day = "" + date.getDate();
                    day = "01";
                    if(year.length < 2) {
                        year = "0" + year;
                    }
                    if(month.length < 2) {
                        month = "0" + month;
                    }
                    if(day.length < 2) {
                        day = "0" + day;
                    }
                    var tv = year + "-" + month + "-" + day;
                    datefrom.val(tv);
                }
            }catch(err){  }

            try{
                if(dateto == null || dateto == undefined || dateto.val().trim() == "") {
                    var date = new Date();
                    var year = "" + date.getFullYear();
                    var month = "" + (date.getMonth() + 1);
                    var day = "" + date.getDate();
                    if(year.length < 2) {
                        year = "0" + year;
                    }
                    if(month.length < 2) {
                        month = "0" + month;
                    }
                    if(day.length < 2) {
                        day = "0" + day;
                    }
                    var tv = year + "-" + month + "-" + day;
                    dateto.val(tv);
                }
            }catch(err){  }

        }catch(err){}
    }

    function load_data_dtr() {

        try{

            var uid = "";
            var datefrom = $('#' + 'date_from').val();
            var dateto = $('#' + 'date_to').val();

            var databody = $('#' + 'dtr-data');
            databody.html('');

            $.ajax({
                url: bpath + 'dtr/manage/dtr/remarks/data/get',
                type: "POST",
                data: {
                    '_token': _token,
                    'uid': uid,
                    'datefrom': datefrom,
                    'dateto': dateto,
                },
                success: function(response) {
                    /***/

                    var data = (response);

                    databody.html(data);

                    bind_t_events();

                },
                error: function (response) {

                }
            });
            
        }catch(err){  }

    }


    function print_dtr() {
        try{

            var datefrom = $('#' + 'date_from').val();
            var dateto = $('#' + 'date_to').val();

            if(datefrom.trim() != "") {
                var url = bpath + "dtr/my/print?" + "datefrom=" + datefrom + "&dateto=" + dateto + "&ft=" + "48";
                window.open(url);
            }

        }catch(err){}
    }

    function print_dtr_w_remarks() {
        try{

            var datefrom = $('#' + 'date_from').val();
            var dateto = $('#' + 'date_to').val();

            if(datefrom.trim() != "") {
                var url = bpath + "dtr/my/print?" + "datefrom=" + datefrom + "&dateto=" + dateto + "&ft=" + "48wr";
                window.open(url);
            }

        }catch(err){}
    }

    function print_dtr_w_total() {
        try{

            var datefrom = $('#' + 'date_from').val();
            var dateto = $('#' + 'date_to').val();

            if(datefrom.trim() != "") {
                var url = bpath + "dtr/my/print?" + "datefrom=" + datefrom + "&dateto=" + dateto + "&ft=" + "48wt";
                window.open(url);
            }

        }catch(err){}
    }

