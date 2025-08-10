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
                if(data_target.trim().toLowerCase() == "show-skills".trim().toLowerCase()) {
                    /***/
                    var id = src.attr("data-id");
                    $('#' + '' + 'dict_id').val(id);
                    modal_show('mdl__skills');
                    load_dictionary_skills();
                    /***/
                }
                if(data_target.trim().toLowerCase() == "show-skills-add".trim().toLowerCase()) {
                    /***/
                    load_data_skills();
                    modal_show("mdl__skills__add");
                    /***/
                }
                if(data_target.trim().toLowerCase() == "show-update-dict-skill".trim().toLowerCase()) {
                    /***/
                    var id = src.attr("data-id");
                    $('#' + 'upd_' + 'skills_points_id').val(id);
                    var val = src.attr("data-value");
                    $('#' + 'upd_' + 'skills_points_points').val(val);
                    modal_show("mdl__skills_points_update");
                    /***/
                }
                if(data_target.trim().toLowerCase() == "show-delete-dict-skill".trim().toLowerCase()) {
                    /***/
                    var id = src.attr("data-id");
                    $('#' + 'del_' + 'skills_id').val(id);
                    modal_show("mdl__skills_delete");
                    /***/
                }
                if(data_target.trim().toLowerCase() == "show-reqs".trim().toLowerCase()) {
                    /***/
                    var id = src.attr("data-id");
                    $('#' + '' + 'dict_req_id').val(id);
                    modal_show('mdl__reqs');
                    load_dictionary_reqs();
                    /***/
                }
                if(data_target.trim().toLowerCase() == "show-reqs-add".trim().toLowerCase()) {
                    /***/
                    load_data_reqs_dictionary();
                    modal_show("mdl__reqs__add");
                    /***/
                }
                if(data_target.trim().toLowerCase() == "show-delete-dict-reqs".trim().toLowerCase()) {
                    /***/
                    var id = src.attr("data-id");
                    $('#' + 'del_' + 'reqs_id').val(id);
                    modal_show("mdl__reqs_delete");
                    /***/
                }

                if(data_target.trim().toLowerCase() == "close-skills".trim().toLowerCase()) {
                    /***/
                    load_data();
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

                if(data_target.trim().toLowerCase() == "data-skill-add".trim().toLowerCase()) {
                    /***/
                    var id = src.attr("data-id");
                    data_skill_add(id);
                    /***/
                }

                if(data_target.trim().toLowerCase() == "data-update-skills-points".trim().toLowerCase()) {
                    /***/
                    data_skills_update();
                    /***/
                }

                if(data_target.trim().toLowerCase() == "data-delete-skill".trim().toLowerCase()) {
                    /***/
                    var id = $('#' + 'del_' + 'skills_id').val();
                    data_skill_delete(id);
                    /***/
                }

                if(data_target.trim().toLowerCase() == "data-reqs-add".trim().toLowerCase()) {
                    /***/
                    var id = src.attr("data-id");
                    data_reqs_add(id);
                    /***/
                }

                if(data_target.trim().toLowerCase() == "data-delete-reqs".trim().toLowerCase()) {
                    /***/
                    var id = $('#' + 'del_' + 'reqs_id').val();
                    data_reqs_delete(id);
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
            url: bpath + 'competency/dictionary/data/get',
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
                            var points = data[i]['points'];
                            var level = data[i]['level'];
                            var group = data[i]['grp'];
                            var group_name = data[i]['grp_name'];
                            var skills = data[i]['skills'];
                            var reqs = data[i]['requirements'];

                            var cd = "";

                            /***/
                            cd = '' +
                                '<tr>' +
                                '   <td class="hidden">' + id + '</td>' +
                                '   <td class="w-2/3">' +
                                '       <div class="font-medium">' + name + '</div>' +
                                '       <div class="text-slate-500 text-xs mt-0.5">' + details + '</div>' +
                                '       <div class="text-slate-500 text-xs mt-0.5">' + group_name + '</div>' +
                                '   </td>' +
                                '   <td>' + points + '</td>' +
                                '   <td>' + level + '</td>' +
                                '   <td>' +
                                '       <div class="flex justify-center items-center">'+
                                '       <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 cursor-pointer pt-0 b_action_2" data-type="action" data-target="show-skills" data-id="' + id + '" style="padding-top: 2px;" title="Skills">'+
                                '           ' + skills + ''+
                                '       </div>'+
                                '       </div>'+
                                '   </td>' +
                                '   <td>' +
                                '       <div class="flex justify-center items-center">'+
                                '       <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 cursor-pointer pt-0 b_action_2" data-type="action" data-target="show-reqs" data-id="' + id + '" style="padding-top: 2px;" title="Requirement">'+
                                '           ' + reqs + ''+
                                '       </div>'+
                                '       </div>'+
                                '   </td>' +
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

function load_data_skills() {

    try{

        $.ajax({
            url: bpath + 'competency/skills/data/get',
            type: "POST",
            data: {
                '_token': _token,
            },
            success: function(response) {
                tbldata_skills_add.clear().draw();
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
                                '   <td>' +
                                '       <div class="flex justify-center items-center">'+
                                '       <a class="flex justify-center items-center border dark:border-darkmode-400 rounded-full p-1 b_action_2" data-type="action" data-target="data-skill-add" data-id="' + id + '" href="javascript:;"> <i class="fa fa-plus-circle items-center text-center text-success w-6 h-6 rounded-full m-1"></i> </a>'+
                                '       </div>'+
                                '   </td>' +

                                '</tr>' +
                                '';
                            tbldata_skills_add.row.add($(cd)).draw();
                            /***/
                        }catch(err){}
                    }
                }

                bind_events();
                bind_events_2();

            },
            error: function (response) {

            }
        });
        
    }catch(err){}

}

function load_data_reqs_dictionary() {

    try{

        $.ajax({
            url: bpath + 'competency/dictionary/data/get',
            type: "POST",
            data: {
                '_token': _token,
            },
            success: function(response) {
                tbldata_reqs_add.clear().draw();
                /***/

                var data = (response);
                if(data.length > 0) {
                    for(var i=0;i<data.length;i++) {
                        try{
                            /***/
                            var id = data[i]['id'];
                            var name = data[i]['name'];
                            var details = data[i]['details'];
                            var points = data[i]['points'];
                            var level = data[i]['level'];
                            var grp = data[i]['grp'];

                            var cd = "";

                            /***/
                            cd = '' +
                                '<tr>' +
                                '   <td class="hidden">' + id + '</td>' +
                                '   <td class="w-2/3">' +
                                '       <div class="font-medium">' + name + '</div>' +
                                '       <div class="text-slate-500 text-xs mt-0.5">' + details + '</div>' +
                                '   </td>' +
                                '   <td>' +
                                '       <div class="flex justify-center items-center">'+
                                '       <a class="flex justify-center items-center border dark:border-darkmode-400 rounded-full p-1 b_action_2" data-type="action" data-target="data-reqs-add" data-id="' + id + '" href="javascript:;"> <i class="fa fa-plus-circle items-center text-center text-success w-6 h-6 rounded-full m-1"></i> </a>'+
                                '       </div>'+
                                '   </td>' +

                                '</tr>' +
                                '';
                            tbldata_reqs_add.row.add($(cd)).draw();
                            /***/
                        }catch(err){}
                    }
                }

                bind_events();
                bind_events_2();

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
        var points = $('#' + '' + 'points');
        var level = $('#' + '' + 'level');
        var group = $('#' + '' + 'group');

        $.ajax({
            url: bpath + 'competency/dictionary/data/add',
            type: "POST",
            data: {
                '_token': _token,
                'name': name.val(),
                'details': details.val(),
                'points': points.val(),
                'level': level.val(),
                'group': group.val(),
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
                        points.val('');
                        level.val('');
                        group.val('');
                        /**/
                        try{
                            group.select2("val", "");
                            group.trigger('change');
                        }catch(err){}
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
        var points = $('#' + 'upd_' + 'points');
        var level = $('#' + 'upd_' + 'level');
        var group = $('#' + 'upd_' + 'group');
        

        $.ajax({
            url: bpath + 'competency/dictionary/data/update',
            type: "POST",
            data: {
                '_token': _token,
                'id': id.val(),
                'name': name.val(),
                'details': details.val(),
                'points': points.val(),
                'level': level.val(),
                'group': group.val(),
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
                        points.val('');
                        level.val('');
                        /**/
                        try{
                            group.select2("val", "");
                            group.trigger('change');
                        }catch(err){}
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
            url: bpath + 'competency/dictionary/data/delete',
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


function data_skill_add(id) {

    try{

        var dict_id = $('#' + '' + 'dict_id');

        $.ajax({
            url: bpath + 'competency/dictionary/skills/data/add',
            type: "POST",
            data: {
                '_token': _token,
                'dict_id': dict_id.val(),
                'skill': id,
            },
            success: function(response) {
                try{

                    var data = response;
                    var res_code = parseInt(data['code']);
                    var res_msg = (data['message']);

                    if(res_code > 0) {
                        __notif_show("1", "Success" , "Skill added.");
                        /**/
                        load_dictionary_skills();
                        /**/
                    }else{
                        __notif_show("-2", "Error" , res_msg);
                    }

                }catch(err){}
            }
        });
        
    }catch(err){}

}

function data_skills_update() {

    try{

        var id = $('#' + 'upd_' + 'skills_points_id');

        var points = $('#' + 'upd_' + 'skills_points_points');
        

        $.ajax({
            url: bpath + 'competency/dictionary/skills/data/update',
            type: "POST",
            data: {
                '_token': _token,
                'id': id.val(),
                'points': points.val(),
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
                        points.val('');
                        /**/
                        /**/
                        modal_hide('mdl__skills_points_update');
                        load_dictionary_skills();
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

function data_skill_delete(id) {

    try{

        $.ajax({
            url: bpath + 'competency/dictionary/skills/data/delete',
            type: "POST",
            data: {
                '_token': _token,
                'id': id,
            },
            success: function(response) {
                try{

                    var data = response;
                    var res_code = parseInt(data['code']);
                    var res_msg = (data['message']);

                    if(res_code > 0) {
                        __notif_show("1", "Success" , "Skill removed.");
                        /**/
                        $('#' + 'del_' + 'skills_id').val('');
                        modal_hide("mdl__skills_delete");
                        load_dictionary_skills();
                        /**/
                    }else{
                        __notif_show("-2", "Error" , res_msg);
                    }

                }catch(err){}
            }
        });
        
    }catch(err){}

}


function data_reqs_add(id) {

    try{

        var compid = $('#' + '' + 'dict_req_id');

        $.ajax({
            url: bpath + 'competency/dictionary/reqs/data/add',
            type: "POST",
            data: {
                '_token': _token,
                'compid': compid.val(),
                'reqid': id,
            },
            success: function(response) {
                try{

                    var data = response;
                    var res_code = parseInt(data['code']);
                    var res_msg = (data['message']);

                    if(res_code > 0) {
                        __notif_show("1", "Success" , "Requirement added.");
                        /**/
                        load_dictionary_reqs();
                        /**/
                    }else{
                        __notif_show("-2", "Error" , res_msg);
                    }

                }catch(err){}
            },
            error: function(response) {

            }
        });
        
    }catch(err){}

}

function data_reqs_delete(id) {

    try{

        $.ajax({
            url: bpath + 'competency/dictionary/reqs/data/delete',
            type: "POST",
            data: {
                '_token': _token,
                'id': id,
            },
            success: function(response) {
                try{

                    var data = response;
                    var res_code = parseInt(data['code']);
                    var res_msg = (data['message']);

                    if(res_code > 0) {
                        __notif_show("1", "Success" , "Requirement removed.");
                        /**/
                        $('#' + 'del_' + 'reqs_id').val('');
                        modal_hide("mdl__reqs_delete");
                        load_dictionary_reqs();
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
            url: bpath + 'competency/dictionary/data/info',
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
                            $('#' + 'upd_' + 'id').val(id);
                            /***/
                            $('#' + 'upd_' + 'name').val(data[i]['name']);
                            $('#' + 'upd_' + 'details').val(data[i]['details']);
                            $('#' + 'upd_' + 'points').val(data[i]['points']);
                            $('#' + 'upd_' + 'level').val(data[i]['level']);
                            $('#' + 'upd_' + 'group').val(data[i]['grp']);
                            $('#' + 'upd_' + 'group').trigger('change');
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


function load_dictionary_skills() {

    try{

        var id = $('#' + '' + 'dict_id').val();

        $.ajax({
            url: bpath + 'competency/dictionary/skills/data/get',
            type: "POST",
            data: {
                '_token': _token,
                'id': id,
            },
            success: function(response) {
                tbldata_skills.clear().draw();
                /***/

                var data = (response);
                if(data.length > 0) {
                    for(var i=0;i<data.length;i++) {
                        try{
                            /***/
                            var id = data[i]['id'];
                            var name = data[i]['name'];
                            var details = data[i]['details'];
                            var points = data[i]['points'];

                            var cd = "";

                            /***/
                            cd = '' +
                                '<tr>' +
                                '   <td class="hidden">' + id + '</td>' +
                                '   <td class="w-2/3">' +
                                '       <div class="font-medium">' + name + '</div>' +
                                '       <div class="text-slate-500 text-xs mt-0.5">' + details + '</div>' +
                                '   </td>' +
                                '   <td class="">' + points + '</td>' +
                                '   <td>' +
                                '       <div class="flex justify-center items-center">'+
                                '       <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 cursor-pointer zoom-in tooltip dropdown" title="More Action">'+
                                '           <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                '           <div class="dropdown-menu w-40">'+
                                '               <div class="dropdown-content">'+
                                '                   <a href="javascript:;" class="dropdown-item b_action" data-type="action" data-target="show-update-dict-skill" data-id="' + id + '" data-value="' + points + '"> <i class="fa fa-edit w-4 h-4 mr-2"></i> Edit Points </a>'+
                                '                   <a href="javascript:;" class="dropdown-item b_action" data-type="action" data-target="show-delete-dict-skill" data-id="' + id + '"> <i class="fa fa-trash w-4 h-4 mr-2"></i> Delete </a>'+
                                '               </div>'+
                                '           </div>'+
                                '       </div>'+
                                '       </div>'+
                                '   </td>' +

                                '</tr>' +
                                '';
                            tbldata_skills.row.add($(cd)).draw();
                            /***/
                        }catch(err){}
                    }
                }

                bind_events();
                bind_events_2();
                
            },
            error: function (response) {

            }
        });
        
    }catch(err){}

}

function load_dictionary_reqs() {

    try{

        var id = $('#' + '' + 'dict_req_id').val();

        $.ajax({
            url: bpath + 'competency/dictionary/reqs/data/get',
            type: "POST",
            data: {
                '_token': _token,
                'id': id,
            },
            success: function(response) {
                tbldata_reqs.clear().draw();
                /***/

                var data = (response);
                if(data.length > 0) {
                    for(var i=0;i<data.length;i++) {
                        try{
                            /***/
                            var id = data[i]['id'];
                            var name = data[i]['name'];
                            var details = data[i]['details'];
                            var points = data[i]['points'];

                            var cd = "";

                            /***/
                            cd = '' +
                                '<tr>' +
                                '   <td class="hidden">' + id + '</td>' +
                                '   <td class="w-2/3">' +
                                '       <div class="font-medium">' + name + '</div>' +
                                '       <div class="text-slate-500 text-xs mt-0.5">' + details + '</div>' +
                                '   </td>' +
                                '   <td class="">' + points + '</td>' +
                                '   <td>' +
                                '       <div class="flex justify-center items-center">'+
                                '       <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 cursor-pointer zoom-in tooltip dropdown" title="More Action">'+
                                '           <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                '           <div class="dropdown-menu w-40">'+
                                '               <div class="dropdown-content">'+
                                '                   <a href="javascript:;" class="dropdown-item b_action" data-type="action" data-target="show-delete-dict-reqs" data-id="' + id + '"> <i class="fa fa-trash w-4 h-4 mr-2"></i> Delete </a>'+
                                '               </div>'+
                                '           </div>'+
                                '       </div>'+
                                '       </div>'+
                                '   </td>' +

                                '</tr>' +
                                '';
                            tbldata_reqs.row.add($(cd)).draw();
                            /***/
                        }catch(err){}
                    }
                }

                bind_events();
                bind_events_2();
                
            },
            error: function (response) {

            }
        });
        
    }catch(err){}

}


function load_option_groups() {

    try{

        $.ajax({
            url: bpath + 'competency/dictionary/option/groups/get',
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
                $('#' + '' + 'group').html(tad);
                $('#' + 'upd_' + 'group').html(tad);
                /***/
            },
            error: function (response) {

            }
        });
        
    }catch(err){}

}


