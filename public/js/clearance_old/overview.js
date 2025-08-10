var  _token = $('meta[name="csrf-token"]').attr('content');
var table_employee_list_completed_clearance;
var table_csc_iii_recent_setup;
var table_csc_iv_recent_setup;

$(document).ready(function (){

    Load_DataTables();
    load_employees_completed_clearance();

    // count_clearance_request();
    // count_clearance_completed();

    Completed_Clearance_Toggle_Modal();


    Print_Cleared_Clearance_List();

    Select2_Event_Handler();

    Un_able_to_Edit_Button();

    Use_Recent_Setup();

    Add_Current_Officer();

});

function Load_DataTables(){

    try{
        /***/
        table_employee_list_completed_clearance = $('#dt_employee_list_completed_clearance').DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
            renderer: 'bootstrap',
            "info": false,
            "bInfo":true,
            "bJQueryUI": true,
            "bProcessing": true,
            "bPaginate" : true,
            "aLengthMenu": [[10,25,50,100,150,200,250,300,-1], [10,25,50,100,150,200,250,300,"All"]],
            "iDisplayLength": 10,
            "aaSorting": [],

            columnDefs:
                [
                    { className: "dt-head-center", targets: [ 3, 4 ] },
                ],
        });

        /***/
    }catch(err){  }


    //DATA TABLE FOR CLEARANCE CSC III SETUP
    try{
        /***/
        table_csc_iii_recent_setup = $('#dt_csc_iii_recent_setup').DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
            renderer: 'bootstrap',
            "info": false,
            "bInfo":true,
            "bJQueryUI": true,
            "bProcessing": true,
            "bPaginate" : true,
            "aLengthMenu": [[10,25,50,100,150,200,250,300,-1], [10,25,50,100,150,200,250,300,"All"]],
            "iDisplayLength": 10,
            "aaSorting": [],

            columnDefs:
                [
                    { className: "dt-head-center", targets: [ 3 ] },
                ],
        });

        /***/
    }catch(err){  }


    //DATA TABLE FOR CLEARANCE CSC IV SETUP
    try{
        /***/
        table_csc_iv_recent_setup = $('#dt_csc_iv_recent_setup').DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
            renderer: 'bootstrap',
            "info": false,
            "bInfo":true,
            "bJQueryUI": true,
            "bProcessing": true,
            "bPaginate" : true,
            "aLengthMenu": [[10,25,50,100,150,200,250,300,-1], [10,25,50,100,150,200,250,300,"All"]],
            "iDisplayLength": 10,
            "aaSorting": [],

            columnDefs:
                [
                    { className: "dt-head-center", targets: [ 3 ] },
                ],
        });

        /***/
    }catch(err){  }

}

function count_clearance_request(){

    $.ajax({
        url: bpath + 'clearance/count/request',
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (response) {
            if(response)
            {
                let data = JSON.parse(response);

                let status  = data['status'];
                let count   = data['count'];

                $('.clearance_count_request_div').text(count);

            }
        }
    });

}

function count_clearance_completed(){

    $.ajax({
        url: bpath + 'clearance/count/completed',
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (response) {
            if(response)
            {
                let data = JSON.parse(response);

                let status  = data['status'];
                let count   = data['count'];

                $('.clearance_count_completed_div').text(count);

            }
        }
    });

}
function Completed_Clearance_Toggle_Modal(){

    $('body').on('click', '.completed_clearance_box', function (){

        __modal_toggle('completed_clearance_modal');

    });

}
function load_employees_completed_clearance(){

    $.ajax({
        url: bpath + 'clearance/load/employee/completed/clearance',
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (response) {

            table_employee_list_completed_clearance.clear().draw();
            /***/

            if(response)
            {
                var data = JSON.parse(response);

                if (data.length > 0)
                {
                    for (var i = 0; i < data.length; i++)
                    {

                        let employee_name = data[i]['employee_name'];
                        let responsibility_center = data[i]['responsibility_center'];
                        let position_designation = data[i]['position_designation'];
                        let date_completed = data[i]['date_completed'];


                        var cd = "";
                        /***/

                        cd = '' +
                            '<tr class="cursor-pointer intro-x">' +
                            '   <td class="font-medium">'+employee_name+'</td>' +
                            '   <td class="text-center "><a href="javascript:;" class="underline decoration-dotted">'+position_designation+'</a></td>' +
                            '   <td class="text-center ">'+responsibility_center+'</td>' +
                            '   <td class="text-center ">'+date_completed+'</td>' +
                            '   <td class="text-justify "><div class="py-1 px-2 rounded-full text-xs text-center bg-success text-white cursor-pointer font-medium">Completed</div></td>' +
                            '</tr>'+
                            '';

                        table_employee_list_completed_clearance.row.add($(cd)).draw();
                        /***/

                    }
                }
            }
        }
    });
}


function Select2_Event_Handler(){

    $('#created_clearance_select').on('select2:select', function (e) {

        let clearance_id = $(this).val();

        $.ajax({
            url: bpath + 'clearance/load/employee/completed/clearance/Name',
            type: "POST",
            data: { _token, clearance_id },
            success: function (response) {

                table_employee_list_completed_clearance.clear().draw();
                /***/

                if(response)
                {
                    var data = JSON.parse(response);

                    if (data.length > 0)
                    {
                        for (var i = 0; i < data.length; i++)
                        {

                            let employee_name = data[i]['employee_name'];
                            let responsibility_center = data[i]['responsibility_center'];
                            let position_designation = data[i]['position_designation'];
                            let date_completed = data[i]['date_completed'];


                            var cd = "";
                            /***/

                            cd = '' +
                                '<tr class="cursor-pointer intro-x">' +
                                '   <td class="font-medium">'+employee_name+'</td>' +
                                '   <td class="text-center "><a href="javascript:;" class="underline decoration-dotted">'+position_designation+'</a></td>' +
                                '   <td class="text-center ">'+responsibility_center+'</td>' +
                                '   <td class="text-center ">'+date_completed+'</td>' +
                                '   <td class="text-justify "><div class="py-1 px-2 rounded-full text-xs text-center bg-success text-white cursor-pointer font-medium">Completed</div></td>' +
                                '</tr>'+
                                '';

                            table_employee_list_completed_clearance.row.add($(cd)).draw();
                            /***/

                        }
                    }
                }
            }
        });

    });


    $('#recent_clearance_name').on('select2:select', function (e) {

        let clearance_id = $(this).val();

        let clearance_type = $('#csc_clearance_type').val();

        if(clearance_type == 'CSC_III')
        {
            load_clearance_csc_iii_setup(clearance_id);

        }else if(clearance_type == 'CSC_IV')
        {
            load_clearance_csc_iv_setup(clearance_id);

        }


    });

}


function load_clearance_csc_iii_setup(clearance_id){

    showLoading();
    $.ajax({
        url: bpath + 'clearance/csc/iii/load/data',
        type: "POST",
        data: { _token, clearance_id },
        success: function (response) {

            table_csc_iii_recent_setup.clear().draw();
            /***/

            if(response)
            {
                hideLoading();
                var data = JSON.parse(response);

                if (data.length > 0)
                {
                    for (var i = 0; i < data.length; i++)
                    {
                        let clearance_type = data[i]['clearance_type'];
                        let unit_office_dept = data[i]['unit_office_dept'];
                        let employee_name = data[i]['employee_name'];
                        let officer_id = data[i]['officer_id'];

                        var cd = "";
                        /***/

                        cd = '' +
                            '<tr class="cursor-pointer intro-x">' +
                            '   <td class="text-center">'+clearance_type+'</td>' +
                            '   <td class="text-center ">'+unit_office_dept+'</td>' +
                            '   <td class="font-medium ">'+employee_name+'</td>' +
                            '   <td>' +
                            '       <div class="btn-group flex justify-center items-center" role="group" aria-label="Basic outlined example">'+
                            '           <button type="button" class="btn btn-outline-secondary add_clearing_officer" ' +
                            '               data-type="'+clearance_type+'" data-office="'+unit_office_dept+'" data-officer="'+officer_id+'">' +
                            '               <i class="fa-solid fa-plus text-success"></i>' +
                            '           </button>'+
                            '       </div>'+
                            '   </td>' +
                            '</tr>'+
                            '';

                        table_csc_iii_recent_setup.row.add($(cd)).draw();
                        /***/

                    }
                }
            }
        }
    });

}

function load_clearance_csc_iv_setup(clearance_id){

    $.ajax({
        url: bpath + 'clearance/csc/iv/load/data',
        type: "POST",
        data: { _token, clearance_id },
        success: function (response) {

            table_csc_iv_recent_setup.clear().draw();
            /***/

            if(response)
            {
                var data = JSON.parse(response);

                if (data.length > 0)
                {
                    for (var i = 0; i < data.length; i++)
                    {
                        let clearance_type = data[i]['clearance_type'];
                        let unit_office_dept = data[i]['unit_office_dept'];
                        let employee_name = data[i]['employee_name'];
                        let officer_id = data[i]['officer_id'];

                        var cd = "";
                        /***/

                        cd = '' +
                            '<tr class="cursor-pointer intro-x">' +
                            '   <td class="text-center">'+clearance_type+'</td>' +
                            '   <td class="text-center ">'+unit_office_dept+'</td>' +
                            '   <td class="font-medium ">'+employee_name+'</td>' +
                            '   <td>' +
                            '       <div class="btn-group flex justify-center items-center" role="group" aria-label="Basic outlined example">'+
                            '           <button type="button" class="btn btn-outline-secondary add_clearing_officer_csc_iv" ' +
                            '               data-type="'+clearance_type+'" data-office="'+unit_office_dept+'" data-officer="'+officer_id+'">' +
                            '               <i class="fa-solid fa-plus text-success"></i>' +
                            '           </button>'+
                            '       </div>'+
                            '   </td>' +
                            '</tr>'+
                            '';

                        table_csc_iv_recent_setup.row.add($(cd)).draw();
                        /***/

                    }
                }
            }
        }
    });

}

function Un_able_to_Edit_Button(){

    $('body').on('click', '#btn_unable_edit_my_clearance', function (){
        __modal_toggle('modal_unable_edit_info');
    });

}


function Use_Recent_Setup(){

    //CSC_III Data
    $('body').on('click', '.btn_use_recent_setup_csc', function (){
        $('.btn_use_recent_setup_csc').change(function() {

            if ($(this).is(':checked'))
            {
                $('.csc_iii_inputs_div').hide();
                $('#csc_clearance_iv_div').hide();
                $('.csc_iii_recent_setup_div').show();
                $('.csc_name_recent_setup_div').show();
                $('#mdl_btn_save_csc_clearance_III_tr').hide();
                $('#mdl_btn_update_csc_clearance_III_tr').hide();

            }else
            {
                $('.csc_iii_inputs_div').show();
                $('.csc_iii_recent_setup_div').hide();
                $('.csc_name_recent_setup_div').hide();

                $('#mdl_btn_save_csc_clearance_III_tr').show();
                $('#mdl_btn_update_csc_clearance_III_tr').hide();

                $('#recent_clearance_name').val('').trigger('change');

            }
        });
    });

    //CSC_IV Data
    $('body').on('click', '.btn_use_recent_setup_csc_iv', function (){
        $('.btn_use_recent_setup_csc_iv').change(function() {

            if ($(this).is(':checked'))
            {
                $('.csc_iii_inputs_div').hide();
                $('.csc_iv_recent_setup_div').show();
                $('.csc_name_recent_setup_div').show();
                $('#mdl_btn_save_csc_clearance_IV_tr').hide();
                $('#mdl_btn_update_csc_clearance_IV_tr').hide();
                $('#csc_clearance_iii_div').hide();


            }else
            {
                $('.csc_iii_inputs_div').show();
                $('.csc_iv_recent_setup_div').hide();
                $('.csc_name_recent_setup_div').hide();

                $('#mdl_btn_save_csc_clearance_IV_tr').show();
                $('#mdl_btn_update_csc_clearance_IV_tr').hide();

                $('#csc_clearance_iv_div').show();

                $('#recent_clearance_name').val('').trigger('change');


            }
        });
    });


    $('body').on('click', '.btn_cancel_csc_recent_setup', function (){

        $('.btn_use_recent_setup_csc').prop('checked', false);
        $('.btn_use_recent_setup_csc_iv').prop('checked', false);

        $('#recent_clearance_name').val('').trigger('change');
    });

}


function Print_Cleared_Clearance_List(){

    $('body').on('click', '.btn_print_cleared_clearance_report', function (){

        let this_button = $(this);

        let clearance_value = $('#created_clearance_select').val();

        if(clearance_value == '' || clearance_value == null)
        {
            __notif_show(-1, 'Warning', 'Please Select Clearance First!');

        }else
        {
            this_button.prop('disabled', true);

            showLoading();
            $.ajax({
                url: bpath + 'clearance/print/cleared/reports/'+clearance_value,
                data: {},
                success: function(){
                    hideLoading();
                    this_button.prop('disabled', false);
                    window.open('/clearance_old/print/cleared/reports/'+clearance_value);
                },
                async: false
            });
        }

    });

}

function Add_Current_Officer(){

    $('body').on('click', '.add_clearing_officer', function (){

        let table = $('#dt_csc_iii_recent_setup').DataTable();
        table.row($(this).parents('tr')).remove().draw();

        let clearance_type = $(this).data('type')
        let unit_office_dept = $(this).data('office')
        let officer_id = $(this).data('officer')
        let clearance_id  = $('#clearance_id').val();

        let form_data = {

            _token,
            clearance_id,
            clearance_type,
            unit_office_dept,
            officer_id,
        }

        $.ajax({
            url: bpath + 'clearance/add/csc/iii/data/from/setup',
            type: "POST",
            data: form_data,
            success: function (response) {

                if(response)
                {
                    let data = JSON.parse(response);
                    let status = data['status'];

                    if(status == 200)
                    {
                        load_csc_clearance_III();
                    }
                }

            }
        });
    });


    $('body').on('click', '.add_clearing_officer_csc_iv', function (){

        let csc_iv_table = $('#dt_csc_iv_recent_setup').DataTable();
        csc_iv_table.row($(this).parents('tr')).remove().draw();

        let clearance_type = $(this).data('type')
        let unit_office_dept = $(this).data('office')
        let officer_id = $(this).data('officer')
        let clearance_id  = $('#clearance_id').val();

        let form_data = {

            _token,
            clearance_id,
            clearance_type,
            unit_office_dept,
            officer_id,
        }

        $.ajax({
            url: bpath + 'clearance/add/csc/iv/data/from/setup',
            type: "POST",
            data: form_data,
            success: function (response) {

                if(response)
                {
                    let data = JSON.parse(response);
                    let status = data['status'];

                    if(status == 200)
                    {
                        load_csc_clearance_IV();
                    }
                }

            }
        });

    });

}
