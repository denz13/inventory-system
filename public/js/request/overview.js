$(document).ready(function() {

    load_datatable();

    bind_events();

    load_default_dates();

    load_data_list();

    load_statistics();

    bind_input_events();


    zcalendar = new ZCalendar('zcalendar', bpath, callbackZCalendarOnLoad, callbackZCalendarDaysLoaded, callbackZCalendarSelectDate);
    //zcalendar.setCallbackSelectDate(callbackZCalendarSelectDate);
    //zcalendar.setCallbackDaysLoaded(callbackZCalendarDaysLoaded);

});

var  _token = $('meta[name="csrf-token"]').attr('content');
var  bpath = $('meta[name="basepath"]').attr('content') + "/";
var tbldata;
var tbldata_records;

var zcalendar;


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
        $('#' + 'date_from').on('change', function(event){
            /***/
            load_statistics();
            load_data_list();
            /***/
        });
    }catch(err){}

    try{
        $('#' + 'date_to').on('change', function(event){
            /***/
            load_statistics();
            load_data_list();
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


                if(data_target.trim().toLowerCase() == "show-records".trim().toLowerCase()) {
                    /***/
                    modal_show('mdl__list_records')
                    var id = src.attr("data-id");
                    load_data_list_records(id);
                    /***/
                }

                if(data_target.trim().toLowerCase() == "show-record-details".trim().toLowerCase()) {
                    /***/
                    modal_show('mdl__record_details')
                    try{
                        var ttl = $('#' + 'record-details-title');
                        ttl.html('Details');
                        ttl.html(src.attr("data-title"));
                    }catch(err){}
                    var id = src.attr("data-id");
                    load_data_record_dtr(id);
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


function load_statistics() {

    try{

        var datefrom = $('#' + 'date_from').val();
        var dateto = $('#' + 'date_to').val();

        $.ajax({
            url: bpath + 'dtr/overview/statistics/data/get',
            type: "POST",
            data: {
                '_token': _token,
                'datefrom': datefrom,
                'dateto': dateto,
            },
            success: function(response) {
                /***/
                try{

                    var data = (response);
                    
                    $('#' + 'stats_printed_total').html(data['printed_count_total']);
                    $('#' + 'stats_printed_current').html(data['printed_count_current']);

                }catch(err){}

            },
            error: function (response) {

            }
        });
        
    }catch(err){  }

}



function load_data_list() {

    try{

        var datefrom = $('#' + 'date_from').val();
        var dateto = $('#' + 'date_to').val();
        
        $.ajax({
            url: bpath + 'dtr/overview/data/list/get',
            type: "POST",
            data: {
                '_token': _token,
                'datefrom': datefrom,
                'dateto': dateto,
            },
            success: function(response) {
                tbldata.clear().draw();
                /***/

                var data = (response);
                if(data.length > 0) {
                    for(var i=0;i<data.length;i++) {
                        try{
                            /***/
                            var id = data[i]['id'];
                            var agencyid = data[i]['agencyid'];
                            var lastname = data[i]['lastname'];
                            var firstname = data[i]['firstname'];
                            var middlename = data[i]['mi'];
                            var name = "";

                            try{
                                name = lastname.trim() + ", " + firstname.trim() + " " + middlename.trim();
                            }catch(err){}

                            var cd = "";

                            /***/
                            cd = '' +
                                '<tr>' +
                                '   <td class="hidden">' + id + '</td>' +
                                '   <td class="w-2/3">' +
                                '       <div class="font-medium">' + name + '</div>' +
                                '       <div class="text-slate-500 text-xs mt-0.5">' + '' + '</div>' +
                                '   </td>' +
                                '   <td>' +
                                '       <div class="flex justify-center items-center">'+
                                '       <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
                                '           <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                '           <div class="dropdown-menu w-40">'+
                                '               <div class="dropdown-content">'+
                                '                   <a href="javascript:;" class="dropdown-item b_action" data-type="action" data-target="show-records" data-id="' + agencyid + '"> <i class="far fa-list-alt w-4 h-4 mr-2"></i> View </a>'+
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

function load_data_list_records(id) {

    try{

        var datefrom = $('#' + 'date_from').val();
        var dateto = $('#' + 'date_to').val();

        $.ajax({
            url: bpath + 'dtr/overview/records/data/list/get',
            type: "POST",
            data: {
                '_token': _token,
                'id': id,
                'datefrom': datefrom,
                'dateto': dateto,
            },
            success: function(response) {
                tbldata_records.clear().draw();
                /***/

                var data = (response);
                if(data.length > 0) {
                    for(var i=0;i<data.length;i++) {
                        try{
                            /***/
                            var id = data[i]['id'];
                            var agencyid = data[i]['agencyid'];
                            var datefrom = data[i]['datefrom2'];
                            var dateto = data[i]['dateto2'];

                            var details = datefrom.trim() + " to " + dateto.trim();

                            var cd = "";

                            /***/
                            cd = '' +
                                '<tr class="cursor-pointer row_action" data-type="action" data-target="show-record-details" data-id="' + id + '" data-title="' + details + '">' +
                                '   <td class="hidden">' + id + '</td>' +
                                '   <td class="w-2/3">' +
                                '       <div class="font-medium">' + details + '</div>' +
                                '       <div class="text-slate-500 text-xs mt-0.5">' + '' + '</div>' +
                                '   </td>' +

                                '</tr>' +
                                '';
                            tbldata_records.row.add($(cd)).draw();
                            /***/
                        }catch(err){}
                    }
                }

                bind_row_events();

            },
            error: function (response) {

            }
        });
        
    }catch(err){}

}

function load_data_record_dtr(id) {

    try{

        var databody = $('#' + 'record-data');
        databody.html('');

        var ttl = $('#' + 'record-details-title');
        ttl.html('Details');

        $.ajax({
            url: bpath + 'dtr/overview/record/info/data/get',
            type: "POST",
            data: {
                '_token': _token,
                'id': id,
            },
            success: function(response) {
                /***/

                var data = (response);

                ttl.html(data['details']);
                databody.html(data['content']);

            },
            error: function (response) {

            }
        });
        
    }catch(err){  }

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



function callbackZCalendarOnLoad(args) {
    try{

        console.log('ZCalendar loaded.');

        //zcalendar.addSelectedDate(2023, 5, 8);

        //$('#' + 'zcalendar' + '__header_title').html('January 2023');

    }catch(err){}
}

function callbackZCalendarDaysLoaded(args) {
    try{

        console.log(args);

        zcalendar.setSelectedMultiple(true);

        //zcalendar.addSelectedDate(2023, 5, 8);
        //zcalendar.addSelectedDate(2023, 5, 12);
        //zcalendar.addSelectedDate(2023, 5, 22);
        //$('#' + 'zcalendar' + '__header_title').html('January 2023');

    }catch(err){}
}

function callbackZCalendarSelectDate(args) {
    try{

        console.log(args);

        //zcalendar.addSelectedDate(2023, 5, 8);
        //$('#' + 'zcalendar' + '__header_title').html('January 2023');

    }catch(err){}
}
