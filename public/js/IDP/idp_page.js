var  _token = $('meta[name="csrf-token"]').attr('content');
var idp_table;

$(document).ready(function(){

    bpath = __basepath + "/";

    $('.dev_targetSave').hide();
    $('#viewActivity_btn').hide();

    select2();
    onClick_function();
    onSubmit();
    onChange();
    loadData_table();
    fetch_idp();
    datePicker();
    cancelOrX_function();
    tableValidation();
    save_ActivityPlan();

});

function fetch_idp(){
   $.ajax({
    method: 'get',
    url: bpath + 'IDP/fetch-idp-data',
    data: {_token},
    success: function (response) {

        idp_table.clear().draw();
        /***/
        var data = JSON.parse(response);

        if (data.length > 0) {
            
            for (let i = 0; i < data.length; i++) {
                var created_by_id = data[i]['id'];
                var year_from = data[i]['year_from'];
                var year_to = data[i]['year_to'];
                var target = data[i]['target'];
                var activity = data[i]['activity'];

                var ii = i+1;

                var year;
                var from;
                var to;
                if(year_from != null){
                    from = year_from;
                }else{
                    from = '';
                }

                if(year_to != null){
                    to ='-'+ year_to;
                }else{
                    to = '';
                }

                year = from+to;

                var cd = '';
                /***/

                    cd = '' +
                            '<tr class="text-center">'+

                                '<td>' +
                                        ii+
                                '</td>' +


                                '<td>' +
                                        '<h2 class="text-medium font-medium mr-auto">'+year+' </h2>'+
                                '</td>' +


                                '<td>' +
                                        target+
                                '</td>' +


                                '<td>' +
                                        activity+
                                '</td>' +


                                '<td>' +
                                    
                                    '<div class="flex justify-center items-center">'+
                                        '<div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="Print">'+
                                            '<a class="flex justify-center items-center"'+
                                                'target="_blank" href="/IDP/print-idp-data/'+created_by_id+'" >'+
                                                '<i class="fa fa-print items-center text-center text-primary"></i>'+ 
                                            '</a>'+
                                        '</div>'+
                                        '<div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
                                            '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                            '<div class="dropdown-menu w-auto">'+
                                                '<div class="dropdown-content">'+
                                                
                                                    '<a class="dropdown-item" href="/IDP/idp-details/'+created_by_id+'">'+
                                                        '<i class="fa fa-tasks text-success" aria-hidden="true"></i>'+
                                                        '<span class="ml-2"> Detail </span>'+
                                                    '</a>'+
                                                
                                                    '<a id="'+created_by_id+'" class="dropdown-item deleteIDP" href="javascript:;">'+
                                                        '<i class="fa fa-trash text-danger"></i>'+
                                                        '<span class="ml-2"> delete </span>'+
                                                    '</a>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+   
                                '</td>' +



                            '</tr>' +
                    '';

                    idp_table.row.add($(cd)).draw();


                /***/

                
            }
        }

    }
   });
}

function select2(){

    $('#my_position').select2({
        placeholder: "Select Position ",
        closeOnSelect: true,

    });
    $('#my_sg').select2({
        placeholder: "Select Salary Grade ",
        closeOnSelect: true,

    });
    $('#my_supervisor').select2({
        placeholder: "Select Your Supervisor ",
        closeOnSelect: true,

    }); 
    $('#from_year').select2({
        placeholder: "Select Year From ",
        closeOnSelect: true,

    });
    $('#to_year').select2({
        placeholder: "Select Year To ",
        closeOnSelect: true,

    });
}

function cancelOrX_function(){
    $("body").on('click','#cancel_develop_target', function () {
        $("#taget_table > tbody").html("");
        $('#addTarget_form')[0].reset();
        $('#add_taget_btn').text('Add');
        $('.dev_targetSave').hide();
        $('#div_target_textarea').hide();
        fetch_idp();
        
    });

    $("body").on('click','#cancel_develop_activity', function () {
        $("#activity_table > tbody").html("");
        $('#addDev_plan_form')[0].reset();
    });

    $("body").on('click', '#cancel_activity_plan', function () {
        $("#activity_plan_tbl > tbody").html("");
        $('#addActivity_plan_form')[0].reset();
    });
}

function loadActivity(idp_id){
    $.ajax({
        method: 'get',
        url: bpath + 'IDP/show-development-plan-data',
        data: {_token, idp_id},
        success: function (response) {

            var activity_data = response;


            if(activity_data.length > 0){
                $('#viewActivity_btn').hide(); 
                $('#addActivity_btn').show();
                $('#div_footer_plan').hide();
                $('#div_development_plan_textboxes').hide();
                $('#div_development_plan_table').show();
                $('#btn_saveTarget').text('Add Target');
                for (let i = 0; i < activity_data.length; i++){
                    var idp_id = activity_data[i]['idp_id'];
                    var activity_id = activity_data[i]['activity_id'];
                    var dev_activity = activity_data[i]['dev_activity'];
                    var support_needed = activity_data[i]['support_needed'];

                    $('#activity_table > tbody').append(
                        '<tr style="border-bottom:1px solid rgb(9, 8, 8)">'+
                            '<td>'+
                                    '<input type="hidden" value="'+activity_id+'" id="activity_id" name="activity_id">'+
                                    (i+1) +
                            '</td>'+
            
            
                            '<td>'+
                                    '<input type="hidden" value="'+dev_activity+'" id="dev_activity" name="dev_activity[]">'+
                                    '<label id="activity_label">'+dev_activity+'</label>'+
                            '</td>'+
            
                            '<td>'+
                                    '<input type="hidden" value="'+support_needed+'" id="support_needed" name="support_needed[]">'+
                                    '<label id="activity_label_support">'+support_needed+'</label>'+
                            '</td>'+
            

                            '<td>'+

                            '<div class="flex justify-center items-center">'+
                                                    '<div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="Activity Plan">'+
                                                        '<a id="'+activity_id+'" data-idp-id="'+idp_id+'" class="flex justify-center items-center activity_planned" data-tw-toggle="modal" data-tw-target="#add_activity_plan_modal">'+
                                                            '<i class="fa-solid fa-lightbulb fa-bounce text-pending"></i>'+ 
                                                        '</a>'+
                                                    '</div>'+
                                                    '<div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
                                                        '<a class="flex justify-center items-center action-activity" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                                        '<div class="dropdown-menu w-auto">'+
                                                            '<div class="dropdown-content" title="Edit">'+
                                                                ' <a id="'+activity_id+'" href="javascript:;" class="editClass-activity"> <i class="fa-solid fa-pen text-success"></i></a>'+
                                                            '</div>'+
                                                            '<div class="dropdown-content" title="Delete">'+
                                                                '<a id="'+activity_id+'" href="javascript:;" class="remove-table-row-activity"> <i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i></a>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+   



                                    
                                    
                            '</td>'+
                        '</tr>');
                }
            }else{
                $('#div_development_plan_table').hide();
                
            }
        }
    });
}

function loadActivityPlan(idpID, activity_id){
    $.ajax({
        method: 'get',
        url: bpath + 'IDP/show-Activity-plan-data',
        data: {_token, idpID, activity_id},
        dataType: 'json',
        success: function (response) {

            var activityPlan_data = response;

            if(activityPlan_data.length > 0){

                for (let i = 0; i < activityPlan_data.length; i++){
                    var idp_id          = activityPlan_data[i]['idp_id'];
                    var activity_id     = activityPlan_data[i]['activity_id'];
                    var planID          = activityPlan_data[i]['planID'];
                    var planned         = activityPlan_data[i]['planned'];
                    var accom_mid_year  = activityPlan_data[i]['accom_mid_year'];
                    var accom_year_end  = activityPlan_data[i]['accom_year_end'];

                    // console.log('idp: '+ idp_id);
                    $('#activity_plan_tbl > tbody').append(
                        '<tr>'+
                            '<td>'+
                                '<label class="hidden" id="activity_planID">'+planID+'</label>'+
                                // '<textarea style=" border: none; outline: none; border-style: none; border-color: Transparent; overflow: auto;" type="text" id="plans" class="form-control" name="plans[]" placeholder="Type Mid-Year Accomplish...">'+planned+'</textarea>'+
                                '<label id="planslbl" name="plans[]" style="cursor: text; outline: 0px solid transparent; display: inline-block;" contenteditable="true">'+planned+'</label>'+
            
                            '<td>'+

                                // '<textarea type="text" id="mid_year" class="form-control" name="mid_year[]">'+accom_mid_year+'</textarea>'+
                                '<label id="mid_yearlbl" style="cursor: text; outline: 0px solid transparent; display: inline-block;" contenteditable="true">'+accom_mid_year+'</label>'+
                
                            '</td>'+
            
                            '<td>'+

                                // '<textarea type="text" id="year_end" class="form-control" name="year_end[]">'+accom_year_end+'</textarea>'+
                                '<label id="year_endlbl" style="cursor: text; outline: 0px solid transparent; display: inline-block;" contenteditable="true">'+accom_year_end+'</label>'+
                            '</td>'+
            
                            '<td>'+
                               
                                '<a id="'+planID+'" href="javascript:;" class="remove-row-activity-plan"> <i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i></a>'+
                            '</td>'+
                        '</tr>');
                }
            }
            
        }
    });
}
var target_row;
var IDPid;
var activtyPlanID;
function onClick_function(){

    $("body").on('click', '.deleteIDP', function () {
            var id = $(this).attr('id');

            $('#delete_id').val(id);
            $('#deleteCode').val('delete_idp');

            const idp_delete = tailwind.Modal.getOrCreateInstance(document.querySelector("#delete-modal_idp"));
            idp_delete.show();

    });

    $("body").on('click', '.createIDP_class', function () {
        let pos_id = $(this).data('position-id');
        let salary_grade = $(this).data('salary-grade');
        let no_y_position = $(this).data('year');
        let name = $(this).data('name');

        $('#my_position').val(pos_id).trigger('change');
        $('#my_sg').val(salary_grade).trigger('change');
        $('#created_by_name').val(name);
        $('#year_n_postision').val(no_y_position);

    });


//----------- Develop Taget Start ----------//
        $("body").on('click', '.develop-target', function () {
            var idp_id = $(this).attr('id');
            $('#ridp_id').val(idp_id);


            var target_count = $(this).data('target-count');
            var get_target = $(this).data('deveplop-target');
            if(target_count > 0){
                $('#div_target_textarea').hide();
                $.ajax({
                    method: 'get',
                    url: bpath + 'IDP/show-target-data',
                    data: {_token, idp_id},
                    success: function (response) {

                        var taget_data = JSON.parse(response);

                        if(taget_data.length > 0){

                            $('.dev_targetSave').show();
                            $('#btn_saveTarget').text('Add Target');
                            for (let i = 0; i < taget_data.length; i++){
                                var target_id = taget_data[i]['target_id'];
                                var dev_target = taget_data[i]['dev_target'];
                                var dev_goal = taget_data[i]['pg_support'];
                                var dev_objective = taget_data[i]['objective'];

                                $('#taget_table > tbody').append(
                                    '<tr>'+
                                        '<td>'+
                                                '<input type="hidden" value="'+target_id+'" id="target_id" name="target_id[]">'+
                                                (i+1) +
                                        '</td>'+
                        
                        
                                        '<td>'+
                                                '<input type="hidden" value="'+dev_target+'" id="develop_target" name="develop_target[]">'+
                                                '<label id="dev_label_target">'+dev_target+'</label>'+
                                        '</td>'+
                        
                                        '<td>'+
                                                '<input type="hidden" value="'+dev_goal+'" id="develop_goal" name="develop_goal[]">'+
                                                '<label id="dev_label_goal">'+dev_goal+'</label>'+
                                        '</td>'+
                        
                                        '<td>'+
                                                '<input type="hidden" value="'+dev_objective+'" id="develop_objective" name="develop_objective[]">'+
                                                '<label id="dev_label_objective">'+dev_objective+'</label>'+
                                        '</td>'+
                        
                                        '<td>'+
                                                '<a id="'+target_id+'" href="javascript:;" class="editClass"> <i class="fas fa-edit w-4 h-4 mr-2 text-success"></i></a>'+
                                                '<a id="'+target_id+'" href="javascript:;" class="remove-table-row"> <i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i></a>'+
                                        '</td>'+
                                    '</tr>');
                            }
                        }else{
                            $('#btn_saveTarget').text('Save');
                        }
                    }
                });
            }else{
                $('#div_target_textarea').show();
            }

        });
        var _thisTaget_row;
        var _thisDevelop_target;
        var _thisDevelop_goal;
        var _thisDevelop_objective;
        var _thisDevelop_target_label;
        var _thisDevelop_goal_label;
        var _thisDevelop_objective_label;

        $("body").on('click', '.editClass', function () {
            $('#div_target_textarea').show();
            $('#add_taget_btn').text('Update');
            $('#btn_saveTarget').text('Save')
            // $(this).closest('tr').css('border-color', '#edb65c');

            _thisTaget_row = $(this).closest('tr');
            _thisDevelop_target = _thisTaget_row.find('#develop_target');
            _thisDevelop_goal = _thisTaget_row.find('#develop_goal');
            _thisDevelop_objective = _thisTaget_row.find('#develop_objective');
            _thisDevelop_target_label = _thisTaget_row.find('#dev_label_target');
            _thisDevelop_goal_label = _thisTaget_row.find('#dev_label_goal');
            _thisDevelop_objective_label = _thisTaget_row.find('#dev_label_objective');

            $('#rdev_target').val(_thisDevelop_target.val());
            $('#rdev_goal').val(_thisDevelop_goal.val());
            $('#rdev_objective').val(_thisDevelop_objective.val());
        });

        // Add Row Develop target
        $("body").on('click','#add_taget_btn', function () {

            
            var dev_target = $('#rdev_target').val();
            var dev_goal = $('#rdev_goal').val();
            var dev_objective = $('#rdev_objective').val();

            if(dev_target != ""){
                $('.dev_targetSave').show();

                if($('#add_taget_btn').text() === 'Update'){
                    
                    _thisDevelop_target_label.text(dev_target);
                    _thisDevelop_goal_label.text(dev_goal);
                    _thisDevelop_objective_label.text(dev_objective);

                    _thisDevelop_target.val(dev_target);
                    _thisDevelop_goal.val(dev_goal);
                    _thisDevelop_objective.val(dev_objective);
                    // _thisTaget_row.css('border-color', '#edb65c');
                    $('#add_taget_btn').text('Add');
                    $('#rdev_target').val("");
                    $('#rdev_goal').val("");
                    $('#rdev_objective').val("");
                }else{
                var target_id = '';
                var rowCount = $('#taget_table').find('tr').length;

                $('#rdev_target').css('border-color', '');
                
                $('#taget_table > tbody').append(
                    '<tr>'+
                        '<td>'+
                                '<input type="hidden" value="0" id="target_id" name="target_id[]">'+
                                rowCount+
                        '</td>'+
        
        
                        '<td>'+
                                '<input type="hidden" value="'+dev_target+'" id="develop_target" name="develop_target[]">'+
                                '<label id="dev_label_target">'+dev_target+'</label>'+
                        '</td>'+
        
                        '<td>'+
                                '<input type="hidden" value="'+dev_goal+'" id="develop_goal" name="develop_goal[]">'+
                                '<label id="dev_label_goal">'+dev_goal+'</label>'+
                        '</td>'+
        
                        '<td>'+
                                '<input type="hidden" value="'+dev_objective+'" id="develop_objective" name="develop_objective[]">'+
                                '<label id="dev_label_objective">'+dev_objective+'</label>'+
                        '</td>'+
        
                        '<td>'+
                                '<a id="'+target_id+'" href="javascript:;" class="editClass"> <i class="fas fa-edit w-4 h-4 mr-2 text-success"></i></a>'+
                                '<a id="'+target_id+'" href="javascript:;" class="remove-table-row"> <i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i></a>'+
                        '</td>'+
                    '</tr>');
                    $('#rdev_target').val("");
                    $('#rdev_goal').val("");
                    $('#rdev_objective').val("");
                }
            }else{
                $('#rdev_target').css('border-color', '#Ff696c');
            }

            
        });

        // Remove Row Develop target
        $("body").on('click','.remove-table-row', function () {

            let targeting_id = $(this).attr('id');
            var table_row = $(this).parents('tr');

            if(targeting_id == ""){
                table_row.remove();
            }else{
                target_row = table_row;
                $('#deleteCode').val('delete-target');
                $('#delete_id').val(targeting_id);

                const idp_delete = tailwind.Modal.getOrCreateInstance(document.querySelector("#delete-modal_idp"));
                idp_delete.show();
            
            }
            
        });

       

//----------- Develop Taget End----------//

// ---------- Development Activity  Start----------//

    $('body').on('click', '.development-activity', function(){
        let idp_id = $(this).attr('id');
        $('#idp_id_plan').val(idp_id);

        var plan_count = $(this).data('activity-count');
        if(plan_count > 0){
            $('#div_development_plan_textboxes').hide();
            $('#div_footer_plan').hide();

            loadActivity(idp_id);

        }else{
            $('#div_development_plan_textboxes').show();
            $('#div_footer_plan').show();
            $('#viewActivity_btn').show();
            $('#div_development_plan_table').hide();
            $('#addActivity_btn').hide();       
        }
    });

    //Remove Row Activity
    $("body").on('click','.remove-table-row-activity', function () {

        let idp_id = $('#idp_id_plan').val();
        let activity_id = $(this).attr('id');
        var table_row = $(this).parents('tr');

        if(activity_id == "" || activity_id == undefined){
            table_row.remove();
        }else{

            IDPid = idp_id;
            $('#deleteCode').val('delete-activity');
            $('#delete_id').val(activity_id);

            const idp_delete = tailwind.Modal.getOrCreateInstance(document.querySelector("#delete-modal_idp"));
            idp_delete.show();

        }
        
    });

    //Add Activity Button
    $("body").on('click', '#addActivity_btn', function () {
        $('#div_development_plan_textboxes').show();
        $('#div_footer_plan').show();
        $('#viewActivity_btn').show();
        $('#div_development_plan_table').hide();
        $('#addActivity_btn').hide();       

    });

    //View Activity Button
    $("body").on('click', '#viewActivity_btn', function () {
        $('#div_development_plan_textboxes').hide();
        $('#div_footer_plan').hide();
        $('#viewActivity_btn').hide();
        $('#div_development_plan_table').show();
        $('#addActivity_btn').show();        

    });

    var _thisactivity_row;
    var _thisDevelop_id;
    var _thisDevelop_activity;
    var _thisDevelop_Support;

    $("body").on('click', '.action-activity', function () {

            _thisactivity_row = $(this).closest('tr');
            _thisDevelop_id = _thisactivity_row.find('#activity_id');
            _thisDevelop_activity = _thisactivity_row.find('#dev_activity');
            _thisDevelop_Support = _thisactivity_row.find('#support_needed');
            
    });

    $("body").on('click', '.editClass-activity', function () {

        $('#div_development_plan_textboxes').show();
        $('#div_footer_plan').show();
        $('#viewActivity_btn').show();
        $('#div_development_plan_table').hide();
        $('#addActivity_btn').hide();  
        
        $('#activityID').val(_thisDevelop_id.val());
        $('#development_activity').val(_thisDevelop_activity.val());
        $('#development_support').val(_thisDevelop_Support.val());

    });
    // var activity_ids;
    $("body").on('click','.activity_planned', function () {
        let activity_ids = $(this).attr('id');
        let data_idp_id = $(this).data('idp-id');
        $('#activity_ids').val(activity_ids);

        $('#idp_idss').val(data_idp_id);

        loadActivityPlan(data_idp_id, activity_ids)

    });

    //Add Activity Plan Row
    $("body").on('click', '.add-plan-row', function () {
        $('#activity_plan_tbl > tbody').prepend(
            '<tr>'+

                '<td>'+
                    '<label class="form-control hidden" id="activity_planID">0</label>'+
                    '<label id="planslbl" class="hidden"></label>'+
                    '<textarea type="text" id="plans" class="form-control" name="plans[]" placeholder="Type Activity Plan..."></textarea>'+
                '</td>'+

                '<td>'+

                    '<label id="mid_yearlbl" class="hidden"></label>'+
                    '<textarea type="text" id="mid_year" class="form-control" name="mid_year[]" placeholder="Type Mid-Year Accomplish..."></textarea>'+
   
                '</td>'+

                '<td>'+

                    '<label id="year_endlbl" class="hidden"></label>'+
                    '<textarea type="text" id="year_end" class="form-control" name="year_end[]" placeholder="Type Year-end Accomplish..."></textarea>'+
                '</td>'+


                '<td>'+
                    '<a id="0" href="javascript:;" class="remove-row-activity-plan"> <i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i></a>'+
                '</td>'+
            '</tr>');
    });

    //Remove Activity Plan Row
    $("body").on('click', '.remove-row-activity-plan', function () {
         let idp_id = $('#idp_idss').val();
        let activityIDs = $('#activity_ids').val();
        let plan_id = $(this).attr('id')
        if(plan_id == 0){
            $(this).parents('tr').remove();
        }else{

            $('#deleteCode').val('delete-activity-plan');
            $('#delete_id').val(plan_id);

            const idp_delete = tailwind.Modal.getOrCreateInstance(document.querySelector("#delete-modal_idp"));
            idp_delete.show();

            activtyPlanID = activityIDs;
            IDPid = idp_id;

          
            
        }
        
    });
// ---------- Development Activity End ----------//

// -----------Begin IDP Details -------------- //

//Add Target Row Button
$("body").on('click','#add__targetRow_btn', function () {
    
    
    $('#idpTaget_table > tbody').append(
        '<tr>'+

            '<td>'+
                '<input type="hidden" value="0" class="form-control" name="targetID[]" id="targetID">'+
                '#'+
            '</td>'+

            '<td>'+

                '<textarea type="text" id="dev_target" class="form-control" name="dev_target[]"></textarea>'+

            '</td>'+

            '<td>'+
                '<textarea type="text" id="pg_support" class="form-control" name="pg_support[]"></textarea>'+
            '</td>'+

            '<td>'+
                '<textarea type="text" id="objective" class="form-control" name="objective[]"></textarea>'+
            '</td>'+


            '<td>'+
                '<a id="" href="javascript:;" class="remove-row-idp-target"> <i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i></a>'+
            '</td>'+
        '</tr>');


});

 //Remove IDP Target Row
 $("body").on('click', '.remove-row-idp-target', function () {

    let _thisRow = $(this).closest('tr');
    let deleteTarget_id = _thisRow.find('#targetID');

    if(deleteTarget_id.val() == 0){
        $(this).parents('tr').remove();
    }else{
        let Targeting_id = deleteTarget_id.val();

        $('#deleteCode').val('delete-target-detail');
        $('#delete_id').val(Targeting_id);

        const idp_delete = tailwind.Modal.getOrCreateInstance(document.querySelector("#delete-modal_idp"));
        idp_delete.show();
       
    }

    // $(this).parents('tr').remove();
});

//Edit IDP Target
$("body").on('click', '.edit-idp-target', function () {
    var target_row = $(this).closest('tr');
    var target = target_row.find('#dev_target')
    var target_label = target_row.find('#dev_target_label')
    var _thisEdit_btn = target_row.find('.edit-idp-target')
    var _thisDoneEdit = target_row.find('.done-edit-idp-target')
    target.removeClass('hidden');
    target_label.addClass('hidden');

    var pg_support = target_row.find('#pg_support')
    var pg_support_label = target_row.find('#pg_support_label')
    pg_support.removeClass('hidden');
    pg_support_label.addClass('hidden');

    var objective = target_row.find('#objective')
    var objective_label = target_row.find('#objective_label')
    objective.removeClass('hidden');
    objective_label.addClass('hidden');

    _thisEdit_btn.addClass('hidden')
    _thisDoneEdit.removeClass('hidden')


});

//Done Edit IDP Target
$("body").on('click','.done-edit-idp-target', function () {
    var targets_row = $(this).closest('tr');

    var targets = targets_row.find('#dev_target')
    var target_labels = targets_row.find('#dev_target_label')
    var _thisEdits_btn = targets_row.find('.edit-idp-target')
    var _thisDoneEdits = targets_row.find('.done-edit-idp-target')
    targets.addClass('hidden');
    target_labels.removeClass('hidden');

    let devTargetValue = targets.val();
    target_labels.text(devTargetValue);

    var pg_supports = targets_row.find('#pg_support')
    var pg_support_labels = targets_row.find('#pg_support_label')
    pg_supports.addClass('hidden');
    pg_support_labels.removeClass('hidden');

    let pgSupportValue = pg_supports.val();
    pg_support_labels.text(pgSupportValue);

    var objectives = targets_row.find('#objective')
    var objective_labels = targets_row.find('#objective_label')
    objectives.addClass('hidden');
    objective_labels.removeClass('hidden');

    let objectiveValue = objectives.val();
    objective_labels.text(objectiveValue);

    _thisEdits_btn.removeClass('hidden')
    _thisDoneEdits.addClass('hidden')
});

//Add Activity Row Button
$("body").on('click','#add__activityRow_btn', function () {
    
    
    $('#idpActivity_table > tbody').append(
        '<tr>'+

            '<td>'+
               '<input type="hidden" value="0" class="form-control" name="activityID[]" id="activityID">'+
                '#'+
            '</td>'+

            '<td>'+

                '<textarea type="text" id="dev_activity" class="form-control" name="dev_activity[]"></textarea>'+

            '</td>'+

            '<td>'+
                '<textarea type="text" id="support_needed" class="form-control" name="support_needed[]"></textarea>'+
            '</td>'+

            '<td>'+

            '</td>'+
                '<a'+
                'class="flex justify-center items-center"'+ 
                'href="javascript:;" data-tw-toggle="modal"> '+
                
                    '<div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="Show Target">'+
                        '<i class="fa fa-plus items-center text-center text-primary"></i>'+
                    '</div>'+
                '</a>'+

            '<td>'+
                '<a id="" href="javascript:;" class="remove-row-idp-activity"> <i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i></a>'+
            '</td>'+
        '</tr>');


});

 //Remove IDP Activity Row
 $("body").on('click', '.remove-row-idp-activity', function () {
    let _thisRow = $(this).closest('tr');
    let deleteActivity_id = _thisRow.find('#activityID');

    if(deleteActivity_id.val() == 0){
        $(this).parents('tr').remove();
    }else{
        let Activity_idss = deleteActivity_id.val();

        $('#deleteCode').val('delete-activity-detail');
        $('#delete_id').val(Activity_idss);

        const idp_delete = tailwind.Modal.getOrCreateInstance(document.querySelector("#delete-modal_idp"));
        idp_delete.show();

    }
});

//Edit IDP Activity
$("body").on('click', '.edit-idp-activity', function () {
    var activity_row = $(this).closest('tr');

    var dev_activity = activity_row.find('#dev_activity')
    var activity_label = activity_row.find('#activity_label')
    
    var _thisEdit_btn = activity_row.find('.edit-idp-activity')
    var _thisDoneEdit = activity_row.find('.done-edit-idp-activity')

    dev_activity.removeClass('hidden');
    activity_label.addClass('hidden');

    var support_needed = activity_row.find('#support_needed')
    var activity_label_support = activity_row.find('#activity_label_support')
    support_needed.removeClass('hidden');
    activity_label_support.addClass('hidden');

    _thisEdit_btn.addClass('hidden')
    _thisDoneEdit.removeClass('hidden')
});

//Done Edit IDP Activity
$("body").on('click','.done-edit-idp-activity', function () {
    var activitys_row = $(this).closest('tr');

    var dev_activitys = activitys_row.find('#dev_activity')
    var activitys_label = activitys_row.find('#activity_label')
    var _thisEdits_btn = activitys_row.find('.edit-idp-activity')
    var _thisDoneEdits = activitys_row.find('.done-edit-idp-activity')

    let activityValue = dev_activitys.val();
    activitys_label.text(activityValue);
    
    dev_activitys.addClass('hidden');
    activitys_label.removeClass('hidden');

    var support_neededs = activitys_row.find('#support_needed')
    var activity_label_supports = activitys_row.find('#activity_label_support')

    let support_neededsValue = support_neededs.val();
    activity_label_supports.text(support_neededsValue);

    support_neededs.addClass('hidden');
    activity_label_supports.removeClass('hidden');

    _thisEdits_btn.removeClass('hidden')
    _thisDoneEdits.addClass('hidden')
});



// -----------End IDP Details -------------- //


}
var updateMessage = '';
var temp_activity_plan = [];
var temp_mid_year = [];
var temp_year_end = [];
var temp_planID = [];

function storeActivityPlan(){

    console.log(check_activity_plan_textarea_blank());
    if (check_activity_plan_textarea_blank()) {

        $("#activity_plan_tbl tr").each(function(i)
        {
            let activity_plan = $(this).find("td #planslbl").text();
            let mid_year = $(this).find("td #mid_yearlbl").text();
            let year_end = $(this).find("td #year_endlbl").text();
            let plansID = $(this).find("td #activity_planID").text();

            if(i != '')
            {
                if(activity_plan !== temp_activity_plan[i] && mid_year !== temp_mid_year[i] && year_end !== temp_year_end[i] && plansID !== temp_planID[i])
                {  
                    updateMessage = 'Activity Plan Save';
                    
                    if (activity_plan !== '' && mid_year !== '' && year_end !== '' && plansID !== '') {

                        temp_activity_plan.push(activity_plan);
                        temp_mid_year.push(mid_year);
                        temp_year_end.push(year_end);
                        temp_planID.push(plansID);
                        
                        
                    }               
                }

            }           
        });
    }
   
    // console.log('Activity Plan: '+temp_activity_plan + ' Mid Year: '+temp_mid_year + ' Year End: '+temp_year_end + ' Plan ID: '+temp_planID);
   
}

function save_ActivityPlan(){
    $("body").on('click', '#savePlan', function () {
        
        let idp_id = $('#idp_idss').val();
        let activityIDs = $('#activity_ids').val();
        // const fd = new FormData(this);

        // console.log(temp_activity_plan, temp_mid_year, temp_year_end, temp_planID, idp_id, activityIDs);
        storeActivityPlan();
        // console.log(storeActivityPlan());
        if (check_activity_plan_textarea_blank()) {
            $.ajax({            
                url: bpath + 'IDP/save-activity-plan',
                method: 'POST',
                data:{_token, temp_activity_plan,
                         temp_mid_year,
                         temp_year_end,
                         temp_planID,
                         idp_id,
                         activityIDs},
                dataType: 'json',
                success: function (res) {
                    
                    if(res.status === 200){
                        __notif_show( 1, updateMessage);
                        $('#addActivity_plan_form')[0].reset();
                        $("#activity_plan_tbl > tbody").html("");
                        $("#activity_table > tbody").html("");
                        $("#idpActivity_table").load(location.href + " #idpActivity_table");
                        loadActivity(idp_id)
                        loadActivityPlan(idp_id, activityIDs)
                        temp_activity_plan = [''];
                        temp_mid_year = [''];
                        temp_year_end = [''];
                        temp_planID = [''];
                        
                    }else if(res.status === 400){
                        __notif_show( -1, 'No Data to Save');
                    }
                }
           });
        }

       
    });
}

function onSubmit(){

    $("#deleteModal_form").submit(function (e) { 
        e.preventDefault();
            const fd = $(this);

            $.ajax({            
                url: bpath + 'IDP/delete-idp',
                method: 'POST',
                data:fd.serialize(),
                success: function (res) {

                    const idp_delete = tailwind.Modal.getOrCreateInstance(document.querySelector("#delete-modal_idp"));

                    if(res.status === 200){
                        __notif_show( 1,"IDP Deleted Successfully");
                        $('#delete_id').val('');
                        fetch_idp();
                        
                        idp_delete.hide();
                        
                    }else if(res.status === 201){
                        __notif_show( 1,"IDP Target Successfully Deleted");
                        idp_delete.hide();
                        target_row.remove();
                    }else if(res.status === 202){
                        __notif_show( 1,"IDP Activity Successfully Deleted");
                        idp_delete.hide();
                        $("#activity_table > tbody").html("");
                        // console.log(IDPid);
                        loadActivity(IDPid);
                    }else if(res.status === 203){
                        __notif_show( 1,"IDP Activity Plan Successfully Deleted");
                        idp_delete.hide();
                        $("#activity_plan_tbl > tbody").html("");
                        console.log(IDPid, activtyPlanID);
                        loadActivityPlan(IDPid, activtyPlanID)
                    }else if(res.status === 204){
                      
                        __notif_show( 1,"Target Data Successfully Deleted");
                        idp_delete.hide();
                        $("#idpTaget_table").load(location.href + " #idpTaget_table");

                    }else if(res.status === 205){

                        __notif_show( 1,"Activity Data Successfully Deleted");
                        idp_delete.hide();
                        $("#idpActivity_table").load(location.href + " #idpActivity_table");
                    }
                }
            });
    });

    $('#idp_form').submit(function (e) { 
        e.preventDefault();

        const fd = new FormData(this);
        if(block_idpCreate_emptyData()){
            $.ajax({            
                url: bpath + 'IDP/save-idp',
                method: 'POST',
                data:fd,
                cache:false,
                contentType: false,
                processData: false,
                dataType: 'json',
                success: function (res) {
                    if(res.status === 200){
                        __notif_show( 1,"IDP Created Successfully");
                        $('#idp_form')[0].reset();
                        const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#createIDP_modal'));
                        mdl.hide();
                        fetch_idp();
    
                    }
                }
            });
        }
    });

    
    $('#addTarget_form').submit(function (e) { 
        e.preventDefault();

        if($('#btn_saveTarget').text() === "Add Target"){
            $('#div_target_textarea').show();
            $('#btn_saveTarget').text('Save')
        }else{
            const fd = new FormData(this);

            $.ajax({            
                url: bpath + 'IDP/save-develop-target',
                method: 'POST',
                data:fd,
                cache:false,
                contentType: false,
                processData: false,
                dataType: 'json',
                success: function (res) {
                    if(res.status === 200){
                        __notif_show( 1,"IDP  Target Added Successfully");
                        $('#addTarget_form')[0].reset();
                        const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#addTarget_modal'));
                        mdl.hide();
                        fetch_idp();
                        $("#taget_table > tbody").html("");
                        $('.dev_targetSave').hide();
                    }
                }
           });
        }
    });

    $('#addDev_plan_form').submit(function (e) { 
        e.preventDefault();
        let idp_id = $('#idp_id_plan').val();
        const fd = new FormData(this);

        $.ajax({            
            url: bpath + 'IDP/save-development-plan',
            method: 'POST',
            data:fd,
            cache:false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (res) {
                if(res.status === 200){
                    __notif_show( 1,"IDP  Activity Added Successfully");
                    $('#addDev_plan_form')[0].reset();
                    // const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#addDevelopment_activity_modal'));
                    // mdl.hide();
                    fetch_idp();
                    $("#activity_table > tbody").html("");
                    $('#activityID').val(0);
                    loadActivity(idp_id)

                    // $("#taget_table > tbody").html("");
                    // $('.div_development_plan_textboxes').hide();
                }
            }
       });
        
    });

    $("#idp_all_form").submit(function (e) { 
        e.preventDefault();

        // alert(check_table_textarea_blank());
        if(check_IdpCreator_info()){

            if(check_target_textarea_blank()) {

                if (check_activity_textarea_blank()) {
                    
                
                    const fd = new FormData(this);

                    $.ajax({
                        url: bpath + 'IDP/save-all-idp-data',
                        method: 'POST',
                        data:fd,
                        cache:false,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        success: function (res) {
                            if(res.status === 200){
                                location.reload(); 
                                __notif_show( 1,"Saved Successfully");        
                            }
                        }
                    });
                }
            }

        }
        

    });

   
}


function onChange(){
    $("#from_year").change(function (e) { 
        e.preventDefault();
        let from_year = $(this).val();

        $('#from_year_label').text('  - '+from_year);
    });

    $("#to_year").change(function (e) { 
        e.preventDefault();
        let to_year = $(this).val();
        if(to_year != 0){
            $('#to_year_label').text(' to '+to_year);
        }else{
            $('#to_year_label').text('');
        }
       
    });
}

function loadData_table(){
    idp_table = $('#idp_table').DataTable({
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
        "aLengthMenu": [[5,10,25,50,100,150,200,250,300,-1], [5,10,25,50,100,150,200,250,300,"All"]],
        "iDisplayLength": 10,
        "aaSorting": [],
        columnDefs: [
            { className: 'text-left', targets: [0, 1, 2, 3] },
            { className: 'text-center', targets: [4] },
          ],
          


    });
}

function datePicker(){
    $("#datepicker").datepicker( {
        format: "yyyy",
        viewMode: "years", 
        minViewMode: "years",
        autoclose:false

    });
}

function check_IdpCreator_info(){
    var idp_from = $('#from_year');
    var idp_to = $('#to_year');

    if(idp_from.val() >= idp_to.val()){

        idp_from.select2({
            placeholder: "Please Year From",
            theme: "error",
    
        });

        idp_to.select2({
            placeholder: "Please Select To",
            theme: "error",
    
        });
        return false;

    }else{
        idp_from.select2({
            placeholder: "Select Year From",
            closeOnSelect: true,
    
        });

        idp_to.select2({
            placeholder: "Select Year To",
            closeOnSelect: true,
    
        });
        return true;
    }

}

function check_target_textarea_blank(){
    let row = $("#idpTaget_table").find('tr');

    let emptyInputs = row.find('textarea').filter(function () {
        return this.value === '';
    });

    if (emptyInputs.length != 0){

        emptyInputs.css('border-color', '#ff0000');             
            return false;

    }else{

        if (emptyInputs != '') {
            emptyInputs.css('border-color', '');
        }else{
            emptyInputs.css('border-color', '#ff0000');
        }
        
        return true;

    }

}

function check_activity_textarea_blank(){

    let row2 = $('#idpActivity_table').find('tr');

    var emptytextArea2 = row2.find('textarea').filter(function() {

        return this.value === '';

    });

    if (emptytextArea2.length != 0){

        emptytextArea2.css('border-color', '#ff0000');                
        return false;

    }else{

        emptytextArea2.css('border-color', '');
        return true;

    }
}

function check_activity_plan_textarea_blank(){

    let plan_row = $('#activity_plan_tbl').find('tr');

    var plan_emptytextArea = plan_row.find('textarea').filter(function() {

        return this.value === '';

    });

    if (plan_emptytextArea.length != 0){

        plan_emptytextArea.css('border-color', '#ff0000');                
        return false;

    }else{

        plan_emptytextArea.css('border-color', '');
        return true;

    }
}

function tableValidation() {
    $("#idpTaget_table").on('change', 'textarea', function () {


        if($(this).val() != ''){

            $(this).css('border-color', '');

        }
        else{            
            $(this).css('border-color', '#Ff696c');
        }

    });

    $("#idpActivity_table").on('change', 'textarea', function () {

        if($(this).val() != ''){

            $(this).css('border-color', '');

        }
        else{            
            $(this).css('border-color', '#Ff696c');
        }

    });

    $("#activity_plan_tbl").on('change', 'textarea', function () {

        if($(this).val() != ''){

            $(this).css('border-color', '');
            
            var row = $(this).closest('tr');

            var planText = row.find('#plans');
            var planslbl = row.find('#planslbl');

            var midYearText = row.find('#mid_year');
            var mid_yearlbl = row.find('#mid_yearlbl');

            var yearEndText = row.find('#year_end');
            var year_endlbl = row.find('#year_endlbl');


           var plan = planslbl.text(planText.val());
           var mid_year = mid_yearlbl.text(midYearText.val());
           var year_end = year_endlbl.text(yearEndText.val());

        }
        else{            
            $(this).css('border-color', '#Ff696c');
        }

    });
}

function block_idpCreate_emptyData(){
    var year_fromsss = $('#from_year');
    var to_yearsssss = $('#to_year');

    var numericValue1 = Number(to_yearsssss.val());

    if(year_fromsss.val() != ''){

        year_fromsss.select2({
            placeholder: "Select Year ",
            closeOnSelect: true,
    
        });

        if((numericValue1 != 0 ||  numericValue1 !='')){
           
            if(numericValue1 > year_fromsss.val()){
                to_yearsssss.select2({
                    placeholder: "Select Year To",
                    closeOnSelect: true,
            
                });
                return true;
            }
            else{

                to_yearsssss.select2({
                    placeholder: "Please Select Year ",
                    theme: "error",
            
                });
                return  false;
            }
           
        }else{

            to_yearsssss.select2({
                placeholder: "Select Year ",
                closeOnSelect: true,
        
            });

            return true;
        }
    }else{
        year_fromsss.select2({
            placeholder: "Please Select Year ",
            theme: "error",
    
        });

        return false;
    }


}

function loadPersonal_info(){
    $.ajax({
        type: "get",
        url: bpath + "IDP/personal-info",
        data: {_token:_token},
        dataType: "json",
        success: function (response) {
            
        }
    });
}


