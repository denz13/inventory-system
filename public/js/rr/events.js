$(document).ready(function() {

    load_datatable();
    load_data();

    bind_events();

    load_option_groups();

    dropdowns();



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

                if(data_target.trim().toLowerCase() == "show-add".trim().toLowerCase()) {
                    /***/
                    modal_show("mdl__add");
                    /***/
                }
                if(data_target.trim().toLowerCase() == "show-update".trim().toLowerCase()) {
                    /***/
                    var id = src.attr("data-id");
                    ldt_update(id);
                    /***/
                }
                if(data_target.trim().toLowerCase() == "show-delete".trim().toLowerCase()) {
                    /***/
                    var id = src.attr("data-id");
                    ldt_delete(id);
                    /***/
                }
                

                if(data_target.trim().toLowerCase() == "data-add".trim().toLowerCase()) {
                    /***/
                    data_add();
                    /***/
                }
                if(data_target.trim().toLowerCase() == "data-update".trim().toLowerCase()) {
                    /***/
                    data_update();
                    /***/
                }
                if(data_target.trim().toLowerCase() == "data-delete".trim().toLowerCase()) {
                    /***/
                    data_delete();
                    /***/
                }

            }
            /***/
        }
        /***/
    }catch(err){}
}

function dropdowns() {
    try{

        $('#' + 'group').select2({
            placeholder: "",
            closeOnSelect: true,
        });
        $('#' + 'group').on('change',function(){
            /*alert($(this).val());*/
        });


        $('#' + 'upd_' + 'group').select2({
            placeholder: "",
            closeOnSelect: true,
        });
        $('#' + 'upd_' + 'group').on('change',function(){
            /*alert($(this).val());*/
        });

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
        tbldata_skills = $('#dt_skills').DataTable({
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
        tbldata_skills.on( 'page.dt', function () {
          try{

          }catch(err){}
        } );
        /***/
    }catch(err){  }

    try{
        /***/
        tbldata_skills_add = $('#dt_skills_add').DataTable({
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
        tbldata_skills_add.on( 'page.dt', function () {
          try{

          }catch(err){}
        } );
        /***/
    }catch(err){  }

    try{
        /***/
        tbldata_reqs = $('#dt_reqs').DataTable({
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
        tbldata_reqs.on( 'page.dt', function () {
          try{

          }catch(err){}
        } );
        /***/
    }catch(err){  }

    try{
        /***/
        tbldata_reqs_add = $('#dt_reqs_add').DataTable({
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
        tbldata_reqs_add.on( 'page.dt', function () {
          try{

          }catch(err){}
        } );
        /***/
    }catch(err){  }

}

function load_data() {

    try{

        $.ajax({
            url: bpath + 'rr/events/data/get',
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
                            var id = data[i]['id'];
                            var name = data[i]['name'];
                            var details = data[i]['details'];
                            var s_date = data[i]['s_date'];
                            var s_date2 = data[i]['s_date2'];
                            var e_date = data[i]['e_date'];
                            var e_date2 = data[i]['e_date2'];

                            var cd = "";

                            /***/
                            cd = '' +
                                '<tr>' +
                                '   <td class="hidden">' + id + '</td>' +
                                '   <td class="w-2/3">' +
                                '       <div class="font-medium">' + name + '</div>' +
                                '       <div class="text-slate-500 text-xs mt-0.5">' + details + '</div>' +
                                '   </td>' +
                                '   <td class="text-center whitespace-nowrap">' + s_date2 + '</td>' +
                                '   <td class="text-center whitespace-nowrap">' + e_date2 + '</td>' +
                                '   <td>' +
                                '       <div class="flex justify-center items-center">'+
                                '       <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 cursor-pointer zoom-in  dropdown" title="More Action">'+
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
                bind_events_2();

                bind_tooltip();

            },
            error: function (response) {

            }
        });
        
    }catch(err){}

}



function data_add() {

    try{

        var name = $('#' + '' + 'name');
        var details = $('#' + '' + 'details');
        var s_date = $('#' + '' + 's_date');
        var e_date = $('#' + '' + 'e_date');

        $.ajax({
            url: bpath + 'rr/events/data/add',
            type: "POST",
            data: {
                '_token': _token,
                'name': name.val(),
                'details': details.val(),
                's_date': s_date.val(),
                'e_date': e_date.val(),
            },
            success: function(response) {
                try{

                    var data = response;
                    var res_code = parseInt(data['code']);
                    var res_msg = (data['message']);

                    if(res_code > 0) {
                        __notif_show("1", "Success" , "Data added.");
                        /**/
                        name.val('');
                        details.val('');
                        s_date.val('');
                        e_date.val('');
                        /**/
                        /**/
                        modal_hide('mdl__add');
                        load_data();
                        /**/
                    }else{
                        __notif_show("-2", "Error" , res_msg);
                    }

                }catch(err){}
            }
        });
        
    }catch(err){}

}

function data_update() {

    try{

        var id = $('#' + 'upd_' + 'id');

        var name = $('#' + 'upd_' + 'name');
        var details = $('#' + 'upd_' + 'details');
        var s_date = $('#' + 'upd_' + 's_date');
        var e_date = $('#' + 'upd_' + 'e_date');
        

        $.ajax({
            url: bpath + 'rr/events/data/update',
            type: "POST",
            data: {
                '_token': _token,
                'id': id.val(),
                'name': name.val(),
                'details': details.val(),
                's_date': s_date.val(),
                'e_date': e_date.val(),
            },
            success: function(response) {
                try{

                    var data = response;
                    var res_code = parseInt(data['code']);
                    var res_msg = (data['message']);

                    if(res_code > 0) {
                        __notif_show("1", "Success" , "Data updated.");
                        /**/
                        id.val('');
                        name.val('');
                        details.val('');
                        s_date.val('');
                        e_date.val('');
                        /**/
                        /**/
                        modal_hide('mdl__update');
                        load_data();
                        /**/
                    }else{
                        __notif_show("-2", "Error" , res_msg);
                    }

                }catch(err){}
            },
            error: function(response) {
                try{
                    /*console.log(response);*/
                }catch(err){}
            }
        });
        
    }catch(err){}

}

function data_delete() {

    try{

        var id = $('#' + 'del_' + 'id');

        $.ajax({
            url: bpath + 'rr/events/data/delete',
            type: "POST",
            data: {
                '_token': _token,
                'id': id.val(),
            },
            success: function(response) {
                try{

                    var data = response;
                    var res_code = parseInt(data['code']);
                    var res_msg = (data['message']);

                    if(res_code > 0) {
                        __notif_show("1", "Success" , "Data deleted.");
                        /**/
                        id.val('');
                        /**/
                        modal_hide('mdl__delete');
                        load_data();
                        /**/
                    }else{
                        __notif_show("-2", "Error" , res_msg);
                    }

                }catch(err){}
            }
        });
        
    }catch(err){}

}




function ldt_update(id) {

    try{

        $.ajax({
            url: bpath + 'rr/events/data/info',
            type: "POST",
            data: {
                '_token': _token,
                'id': id,
            },
            success: function(response) {
                /***/

                var data = (response);
                if(data.length > 0) {
                    for(var i=0;i<data.length;i++) {
                        try{
                            /***/
                            /***/
                            $('#' + 'upd_' + 'id').val(id);
                            /***/
                            $('#' + 'upd_' + 'name').val(data[i]['name']);
                            $('#' + 'upd_' + 'details').val(data[i]['details']);
                            $('#' + 'upd_' + 's_date').val(data[i]['s_date2']);
                            $('#' + 'upd_' + 'e_date').val(data[i]['e_date2']);
                            /***/
                            try{

                            }catch(err){}
                            /***/
                        }catch(err){}
                    }
                    /***/
                    modal_show('mdl__update');
                    /***/
                }
                
            },
            error: function (response) {

            }
        });
        
    }catch(err){}

}

function ldt_delete(id) {

    try{

        $('#' + 'del_' + 'id').val(id);
        modal_show('mdl__delete');

    }catch(err){}

}



function load_option_groups() {

    try{

        $.ajax({
            url: bpath + 'rr/awards/option/types/get',
            type: "POST",
            data: {
                '_token': _token,
            },
            success: function(response) {
                /***/
                var tad = '';
                /***/
                var data = (response);
                if(data.length > 0) {
                    for(var i=0;i<data.length;i++) {
                        try{
                            /***/
                            var id = data[i]['id'];
                            var name = data[i]['name'];
                            var details = data[i]['details'];

                            var cd = "";

                            /***/
                            cd = '<option value="' + id + '">' + name + '</option>';
                            /***/
                            tad = tad + cd;
                            /***/
                        }catch(err){}
                    }
                }
                /***/
                $('#' + '' + 'type').html(tad);
                $('#' + 'upd_' + 'type').html(tad);
                /***/
            },
            error: function (response) {

            }
        });
        
    }catch(err){}

}


