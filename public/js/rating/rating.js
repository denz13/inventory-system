
var  _token = $('meta[name="csrf-token"]').attr('content');
var rating_table;
var tbl_shortList_Position;
var Applicant_position_select;
var area_sumValue;


$(document).ready(function () {

    bpath = __basepath + "/";

    $('#rateLabel').hide();
    $('#positionLabel').hide();
    $('#criteriaLabel').hide();
    $('#competencyLabel').hide();

    $('#remarks_div').hide();
    $('#tfoot_id').hide();
    $('#saveRate_btn').hide();
    $('.competency_div').hide();

    newClickFunctions();

    fetchedCriteria();
    action_function();
    cancel();
    dropdown();
    loadTables();
    onChange();
    sum_rate();
    manageRating_Validation();
    onClick_function();
    onSubmit();
    fetched_shortList_position();
    view_shortList_Applicant_click();
    toggleCheck();
    sumOf_areaInput_points();
    // convert_to_decimal();

});

function enterKeyEvent(){
    $('.InputCriteriaDiv').keypress(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();


        }
    });
}

function fetchedCriteria(){
    $.ajax({
        url: bpath + 'rating/fetch-criteria',
        type: "get",
        data: {
            _token: _token,
        },
        success: function(data) {
            $('#tbl_criteria_div').html(data);

            // $('#tbl_criteria').DataTable({
            //     dom:
            //         "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
            //         "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
            //         "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
            //     renderer: 'bootstrap',
            //     "info": false,
            //     "bInfo":true,
            //     "bJQueryUI": true,
            //     "bProcessing": true,
            //     "bPaginate" : true,
            //     "aLengthMenu": [[5,10,25,50,100,150,200,250,300,-1], [5,10,25,50,100,150,200,250,300,"All"]],
            //     "iDisplayLength": 10,
            //     "aaSorting": [],
            //     "ordering": false,

            // });
        }
    });
}


var criters_id = '';
var maxim_points
function action_function(){
    // CHANGE NAME OF BUTTON
    $("body").on('click', '.addCriteria', function () {
        $('#addAndUpdate_header').text('Add Criteria');
        $('#add_criteria_btn').text("Save");
    });

    // EDIT CRITERIA
    $("body").on('click', '.editCriteria_btn', function () {

        let dropdownToggle = $(this).closest('.dropdown-menu').prev();
        dropdownToggle.attr('aria-expanded', 'false');
        $(this).closest('.dropdown-menu').hide();

        var crit_id = $(this).attr('id');
        var criteria = $(this).data('criteria');
        var maxrate = $(this).data('max-rate');
        var percent_point = $(this).data('percent-point');
        $('#addAndUpdate_header').text('Update Criteria');
        $('#add_criteria_btn').text('Update')


        $('#criteria').val(criteria);
        $('#maxrate').val(maxrate);
        $('#percent_point').val(percent_point);
        $('#critID').val(crit_id);
        const ediCreteriaModel = tailwind.Modal.getOrCreateInstance(document.querySelector('#addCriteria_modal'));
        ediCreteriaModel.show();
    });

    //DELETE CRITERIA
    $("body").on("click", ".deleteCriteria_btn", function (ev) {
        ev.preventDefault();

        let dropdownToggle = $(this).closest('.dropdown-menu').prev();
        dropdownToggle.attr('aria-expanded', 'false');
        $(this).closest('.dropdown-menu').hide();

        swal({
            container: 'my-swal',
            title: 'Are you sure?',
            text: "It will permanently deleted !",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value == true) {

              let criteria_id = $(this).attr('id');


                $.ajax({
                    url:  bpath + 'rating/delete-criteria',
                    method: 'POST',
                    data: {
                        _token:_token,
                        criteria_id: criteria_id,
                    },
                    cache: false,
                    success: function (data) {

                        var status = data.status;

                        if(status == 200){
                            swal("Deleted!", "your Criteria has been deleted Successfully.", "success");
                            __notif_show( 1,"Successfully Deleted!");
                            fetchedCriteria();


                        }else{
                            swal("Warning!", "Deleter Unsuccessful.", "warning");
                        }
                    }
                });
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swal("Cancelled", "Your data is safe :)", "error");
            }
        })
    });

    //Show Area


    //SHOW RATER
    $("body").on('click', '#raterStatus', function () {
        var job_ref = $(this).data('job-ref');
        var applicant_id = $(this).data('applicant-id');

        console.log(job_ref+'---- '+ applicant_id);
        open_modal('#raterStatus_modal');

        $.ajax({
            url:  bpath + 'rating/rater-details',
            method: 'get',
            data: {_token:_token, job_ref:job_ref, applicant_id:applicant_id},
            success: function (response) {
                $('#raterDetail_div').html(response);
            }
        });
    });

    //PROCEED THE APPLICANT
    $("body").on('click', '.complete_class', function () {
        var total_percent_sum = $(this).data('total-percent-sum')
        var total_average_points = $(this).data('total-average-points')
        var position_points = $(this).data('position-points')
        var postion_name = $(this).data('position-name');
        var shortList_id = $(this).data('shortlist-id')
        var applicant_id = $(this).data('applicant-id')
        var position_id = $(this).data('position-id')
        var profile_id = $(this).data('profile-id')
        var ref_num = $(this).data('ref-num')
        var completing_id = $(this).data('completing-id')

        $('#proceed_head').text(postion_name + 'Note');
        $('#shortList_id').val(shortList_id);
        $('#positione_id').val(position_id);
        $('#applicante_id').val(applicant_id);
        $('#profile_id').val(profile_id);
        $('#ref_num').val(ref_num);
        $('#approving_id').val(completing_id);
        $('#total_percent_sum').val(total_percent_sum);
        $('#positi_Points').val(position_points);
        $('#total_average_Points').val(total_average_points);

        //PROCEED APPLICANT

        $.ajax({
            url:  bpath + 'rating/completing-applicant',
            method: 'post',
            data: {
                _token: _token,
                shortList_id: shortList_id,
                position_id: position_id,
                applicant_id: applicant_id,
                profile_id:profile_id,
                ref_num:ref_num,
                approving_id:completing_id,
                total_percent_sum:total_percent_sum,
                position_points:position_points,
                total_average_Points:total_average_points,
            },
            success: function (response) {

                if(response.status == 200){
                    __notif_show( 1, "Applicant Rating Complete");

                    filter_shortList_applicant(job_reference);

                }

            }
        });

    });

    //SAVE AREAS OF CRITERIA
    $('#area_form').submit(function (e) {

    e.preventDefault();
    let input_points = $('#input_points').text();
    let max_points = $('#crit_max').val();

    var num = Number(input_points);

    if(num > max_points){

        const warning = tailwind.Modal.getOrCreateInstance(document.querySelector('#warning_Modal'));
            warning.show();
            $('#warning_text').text(`your input over its maximum points`);
    }else{

        if(check_table_input()){

                const fd = new FormData(this);

                $.ajax({
                    url:  bpath + 'rating/add-criteria-area',
                    method: 'post',
                    data: fd,
                    cache:false,
                    contentType: false,
                    processData: false,
                    dataType: 'json',

                    success: function (r) {
                        if(r.status == 200){
                        __notif_show( 1," Area/s Save Successfully");
                        $('#area_form')[0].reset();
                        $('.remove-table-row').parents('tr').remove();
                        pull_areaData(criters_id)
                        var selected = $('#manageRating_table').find('input.selected-input');
                        selected.removeClass('selected-input');
                        $('#input_points').text("");

                        }
                    }
                });

            // }

        }
    }

    });

    $("body").on('click', '.show_areas', function () {
    criters_id = $(this).attr('id');
    var criters_name = $(this).data('criteria-name');
    maxim_points = $(this).data('criteria-points');

    $('#crit_id').val(criters_id);
    $('#crit_max_points').text(maxim_points);
    $('#crit_max').val(maxim_points);
    $('#criters_name').text(criters_name+'  '+'Area/s');

    pull_areaData(criters_id)
    });

}

function pull_areaData(criteria_id){

    $.ajax({
        url:  bpath + 'rating/show-criteria-areas/'+criteria_id,
        method: 'get',
        data: {
            _token:_token,
        },
        dataType: 'json',
        cache: false,
        success: function (data) {

            var create_prev = data.create_prev;
            var delete_prev = data.delete_prev;
            var sum_percentPoints = data.get_sum_percent;
            $('#addArea_table > tbody').empty();
            $('#input_points').text(0);
            var data = data.area_data;

            if(data.length > 0) {

                for(var i=0;i<data.length;i++) {


                        var areas_id = data[i]['id'];
                        var area = data[i]['area'];
                        var rate = data[i]['rate'];
                        var percent_points = data[i]['percent_points'];
                        var average_area = data[i]['average_area'];
                        var percentage = data[i]['percentage'];

                        if(maxim_points < average_area){
                            $('#input_points').addClass('text-danger');
                        }else{
                            $('#input_points').removeClass('text-danger');
                        }

                        if(percentage > maxim_points){
                            $('#percent_points').addClass('text-danger');
                            $('#over-percent-text').text('(this cant be use in percent rating)');
                        }else{
                            $('#percent_points').removeClass('text-danger');
                            $('#over-percent-text').text('');

                        }

                        $('#input_points').text(average_area);
                        $('#percent_points').text(sum_percentPoints+'%');


                        $('#addArea_table > tbody').append(
                            '<tr>'+
                                '<td style = "width: 40%">'+

                                    '<input type="hidden" value="'+areas_id+'" class="form-control" name="areasID[]" id="areasID" placeholder="Enter Area Rate">'+

                                    '<textarea class="form-control areaname" name="areaname[]" id="rate_name" placeholder="Enter Area"'+(create_prev ? '' : 'Disabled')+'>'+area+'</textarea>'+
                                    (create_prev ? '<label id="on_selectSkill" class="text-xs cursor-pointer underline decoration-dotted underline-offset-4 text-primary dark:text-slate-400" href="javascript:;" data-tw-toggle="modal" data-tw-target="#select_skill_modal">select Skills</label>'
                                        : ''
                                    )+
                                    ''+

                                '</td>'+

                                '<td>'+
                                    '<input type="text" value="'+rate+'" id="arearate" class="form-control arearate" name="arearate[]" id="rate_id" '+(create_prev ? '' : 'Disabled')+'>'+
                                    '<input type="text" value="'+percent_points+'" id="percentrate" class="form-control hidden percentrate" name="percentrate[]" '+(create_prev ? '' : 'Disabled')+'>'+
                                '</td>'+

                                '<td>'+
                                    (delete_prev ?

                                            '<a href="javascript:;" id="'+areas_id+'" class="deleteArea"> <i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i></a>'
                                        : ''
                                    ) +
                                '</td>' +
                            '</tr>');


                }

            }



        }
    });
}

var applicant;
var position_id;
var position_type;
var applicant_name;
var position_name;
var applicant_list_id;
var applicant_job_ref;

function onClick_function(){

    $("body").on('click', '.selectClass', function(){
        let _blank = "";
        if($('#select_id').text() == "Select from Competency"){
            $('.competency_div').show();
            $('.criteria_div').hide();
            $('#select_id').text("Manual Type Criteria");
            $('.criteria_div').hide();
            $('#competency').val(_blank);
            $('#criteria').val(_blank);
            dropdown();
        }else{
            $('.competency_div').hide();
            $('.criteria_div').show();
            $('#select_id').text('Select from Competency');
            $('#competency').val(_blank);
            $('#criteria').val(_blank);
            dropdown();
        }

    })

    //Add Row Area
    $("body").on('click', '#add_more', function () {
        var ave_hidden = '';
        var per_hidden = '';
        if($('#show_area_percent').is(':checked')){
            $('#arearate').addClass('hidden');
            $('#percentrate').removeClass('hidden');
            ave_hidden = 'hidden';
            per_hidden = '';
        }else{
            $('#arearate').removeClass('hidden');
            $('#percentrate').addClass('hidden');
            ave_hidden = '';
            per_hidden = 'hidden';
        }

        $('#addArea_table > tbody').prepend(
         '<tr>'+
             '<td>'+
                '<input type="hidden" value="0" class="form-control" name="areasID[]" id="areasID">'+
                 '<textarea type="text" id="areaname" class="form-control areaname" name="areaname[]" id="rate_name" placeholder="Enter Area Area"></textarea>'+
                 '<label id="on_selectSkill" class="text-xs cursor-pointer underline decoration-dotted underline-offset-4 text-primary dark:text-slate-400" href="javascript:;" data-tw-toggle="modal" data-tw-target="#select_skill_modal">select Skills</label>'+
             '</td>'+
             '<td>'+

                 '<input type="text" id="arearate" class="form-control arearate '+ave_hidden+'" name="arearate[]">'+
                 '<input type="text" id="percentrate" class="form-control percentrate ' + per_hidden + '" name="percentrate[]" placeholder="%" data-placeholder="%">'+

             '</td>'+
             '<td>'+
                 ' <a href="javascript:;" class="remove-table-row"> <i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i></a>'+
             '</td>'+
         '</tr>');


    });

    //Remove Row Area
    $("body").on('click', '.remove-table-row', function () {
        let row = $(this).closest('tr')
        var _arearate = row.find('td .arearate');
        var _percentrate = row.find('td .percentrate');

        var max_pointss = new Number($('#crit_max').val());
        var t_points = $('#input_points').text();
        var _t_percent = parseFloat($('#percent_points').text());

        var area_points = new Number(_arearate.val());
        var _percent_rate = new Number(_percentrate.val());
        var _t_points = new Number(t_points);
        console.log(_t_percent+'----'+_percent_rate);
        var deducting = new Number(_t_points - area_points);

        $('#input_points').text(deducting);

        if(deducting > max_pointss){
            $('#input_points').addClass('text-danger');
        }else{
            $('#input_points').removeClass('text-danger');
        }

         $(this).parents('tr').remove();


    });

    //on_selectSkill

      var area_name;
      var skill_point;
    $("body").on('click','#on_selectSkill', function () {
        var comp_id = $('#competency_id').val();
        var _tr = $(this).closest('tr');
        var _rate_name = _tr.find('td .areaname');
        var _arearate = _tr.find('td .arearate');
        area_name = _rate_name;
        skill_point = _arearate;

        $('#comp_id').val(comp_id)

    });

    //Select Skill
    $("body").on('click','#btn_skill_select', function () {
       var prev_value =  skill_point.val();
    let _skillVal = $('#_skills').val();
    let _skillText = $('#_skills :selected').text();
    let _skillPoints = $('#skill_point').val();
    let area_mx =  $('#crit_max').val();

    area_name.val(_skillText);
    area_name.css('border-color', '');
    skill_point.val(_skillPoints);
    skill_point.css('border-color', '');

    let points = $('#input_points').text();

    var skilss_points = new Number(_skillPoints);
    var _points = new Number(points);
    var deducted = new Number(_points - prev_value);
    var adding = new Number(deducted + skilss_points);

    if(area_mx < adding){
        $('#input_points').addClass('text-danger');
    }else{
        $('#input_points').removeClass('text-danger');
    }

   $('#input_points').text(adding);

    const skill_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#select_skill_modal'));
    skill_modal.hide();

    });

    //delete Areas
    $("body").on('click', '.deleteArea', function () {
        var id = $(this).attr('id');
        var row =$(this).parents('tr');

        swal({
            title: 'Are you sure?',
            text: "It will permanently deleted !",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',


        }).then((result) => {
            if (result.value == true) {

                $.ajax({
                    url:  bpath + 'rating/delete-criteria-area/'+id,
                    method: 'get',
                    data: {
                        _token:_token,
                    },
                    cache: false,
                    success: function (response) {

                        row.remove();
                        __notif_show( 1,"Area Deleted");
                    }
                });
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swal("Cancelled", "Your data is safe :)", "error");
            }
        })
    });

    //rate area Modal
    $("body").on('click', '.rating_area', function () {
        var id = $(this).attr('id');
        area_sumValue = $(this).closest('tr').find('.rateClass');
        var maxrate = $(this).data('max-rate');
        var critname = $(this).data('criteria-name');
        $('#criteria_name').text(critname +' '+'Area/s');
        var applicantID = $('#applicant_ids').val();
        var positionID = $('#position').val();
        var applicant_list_id = $('#applicant_list_id').val();
        var applicant_job_ref = $('#applicant_job_ref').val();
        $('#applicant_id').val(applicantID);
        $('#position_id').val(positionID);
        $('#applicant_list_ids').val(applicant_list_id);
        $('#applicant_job_refs').val(applicant_job_ref);
        $('#maximumrate').val(maxrate);

        if ($("#rating_check").is(":checked")) {

        }else{

        }
        $('#maxratelabel').text(maxrate);

        $('#criteria_id').val(id);
        $("#ratingArea_table").find("tr:gt(0)").remove();

        $.ajax({
            url:  bpath + 'rating/show-rate-criteria-area/'+id,
            method: 'get',
            data: {
                _token:_token,
                applicantID:applicantID,
                positionID:positionID,
                applicant_list_id:applicant_list_id,
                applicant_job_ref:applicant_job_ref,
            },
            cache: false,
            success: function (data) {

                var data = JSON.parse(data);
                if(data.length > 0) {
                    const myModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#ratingArias_modal"));
                    myModal.show();
                    for(var i=0;i<data.length;i++) {

                        var areas_id = data[i]['id'];
                        var area = data[i]['area'];
                        var rate = data[i]['rate'];
                        var max_rate = data[i]['max_rate'];
                        var max_average = data[i]['max_average'];
                        var rated_id = data[i]['rated_id'];
                        var sumall = data[i]['sumAll'];
                        var ratedArea_ave = data[i]['ratedArea_ave'];

                        $('#sumAll').val(sumall);
                        $('#rateSum').val(sumall);

                        $('#sumOf_rate').text(ratedArea_ave);

                        $('#ratingArea_table').append(
                            '<tr>'+

                                '<td class="for-row-romoval" style="font-size: 12px;">'+
                                    '<input type="hidden" value="'+rated_id+'" class="form-control" name="ratedArea_id[]" id="ratedArea_id">'+
                                    area+
                                '</td>'+

                                '<td class="for-row-romoval" style="font-size: 12px;">'+
                                    '<input type="hidden" value="'+max_rate+'" class="form-control" name="max_area_rate[]" id="max_area_rate">'+
                                    max_rate+
                                '</td>'+

                                '<td>'+
                                    '<input type="hidden" value="'+areas_id+'" class="form-control" name="areas_id[]" id="areas_id">'+
                                    '<input style="font-size: 12px;" type="text" value="'+rate+'" class="form-control areaClass" name="rate_area[]" maxlength="3" size="2" id="ratearea_name">'+
                                    '<label class="text-xs" id="rateArea_label"></label>'+
                                '</td>'+


                            '</tr>');

                    }
                }else{
                    const warning = tailwind.Modal.getOrCreateInstance(document.querySelector('#warning_Modal'));
                    warning.show();
                    $('#warning_text').text('This Criteria Does'+"'"+'nt Have Any  Area/s!');

                }


            }
        });
    });

    //onClick Rate Icon
    $("body").on('click','.rate_Icon', function () {

            // job_reference = $(this).attr('id');
            // var tbl_shortList_Position = $('#tbl_shortList_Position').DataTable();

            // position_ID = $(this).data('position-id');
            // position_Name = $(this).data('position-name');
            currentIndex = 0;
            PnelcurrentIndex = 0;

        applicant = $(this).data('applicant-id');
        position_id = $(this).data('position-id');
        position_type = $(this).data('position-type')
        applicant_name = $(this).data('applicant-name')
        position_name = $(this).data('position')

        applicant_list_id = $(this).data('applicant-list-id')
        applicant_job_ref = $(this).data('applicant-job-ref')


            var tr = $(this).closest('tr');

            // Remove extender rows and reset other rows
            $('.extended_shortList_tr').remove();
            $('.shortList_tr').not(tr).removeClass('shown light-blue-bg selected-row'); // Corrected: $('tr').not(tr) to exclude the current row

            // If the row is already expanded (shown), collapse it
            if (tr.hasClass('shown')) {
                tr.removeClass('shown selected-row light-blue-bg');

                // Uncomment and use this if you need to rotate the icon back
                // var icon = tr.find('.fa-chevron-right');
                // icon.css('transform', 'rotate(0deg)');
            } else {
                // Expand the row and append content after it
                tr.after(rateICon_Format(applicant, position_id, position_type, applicant_list_id, applicant_job_ref));
                tr.addClass('shown selected-row light-blue-bg');
                // Uncomment and use this if you need to rotate the icon on expand
                // var icon = tr.find('.fa-chevron-right');
                // icon.css('transform', 'rotate(90deg)');
            }



        // $('#applicant_ids').val(applicant);
        // $('#position').val(position_id);
        // $('#position_type').val(position_type);
        // $('#applicant_list_id').val(applicant_list_id);
        // $('#applicant_job_ref').val(applicant_job_ref);

        // ratingCandidate(applicant, position_id, position_type, applicant_list_id, applicant_job_ref);

        //////////////////////////////////////////////////////////////

        // $('#rate_header').text(position_name+ ' Applicant - '+applicant_name);

        // const rateModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#rateModal'));
        // rateModal.show();

        // showCriteria(position_id, applicant_job_ref)
    });

    //clock Btn Rate Icon
    // $("body").on('click', '.timer_btn', function(){
    //     var rate_date = $(this).data('rate-date');
    //     // var date_today = $(this).data('date-today');
    //     // alert(date_today)
    //     var row = $(this).closest('tr');
    //     var p_tag = row.find('p.timer');
    //     var days_span = row.find('span.timer-days')
    //     var hour_span = row.find('span.timer-hours')
    //     var mins_span = row.find('span.timer-mins')
    //     var secs_span = row.find('span.timer-secs')
    //     var timer_btn = row.find('a.timer_btn')

    //     // alert(rate_date)
    //     // countdouwn_timer(rate_date);
    //     var endDate = new Date(rate_date).getTime();
    //         // alert(endDate);
    //     setInterval(function() {
    //                 // alert( timer)
    //         let now = new Date().getTime();
    //         // alert(new Date())
    //         let t = endDate - now;

    //     if (t >= 0) {

    //         let days = Math.floor(t / (1000 * 60 * 60 * 24));
    //         let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //         let mins = Math.floor((t % (1000 * 60 * 60 )) / (1000 * 60));
    //         let secs = Math.floor((t % (1000 * 60)) / 1000);




    //             if(days === 0) {
    //                 if(hours === 0) {
    //                     if(mins === 0){

    //                     }
    //                 }

    //             }else{
    //                 var dd = days +':';
    //                 var h = ("0"+hours).slice(-2) + ':';
    //                 var m = ("0"+mins).slice(-2) +':';
    //                 var s = ("0"+secs).slice(-2) +'s';
    //             }

    //             days_span.text(dd);

    //             hour_span.text(h);


    //             mins_span.text(m);


    //             secs_span.text(s);

    //     } else {


    //     }

    // }, 1000);

    // });

    $("body").on('click', '.timer_btn', function () {
        var rate_date = $(this).data('rate-date');
        var row = $(this).closest('tr');
        var p_tag = row.find('p.timer');
        var days_span = row.find('span.timer-days')
        var hour_span = row.find('span.timer-hours')
        var mins_span = row.find('span.timer-mins')
        var secs_span = row.find('span.timer-secs')
        var timer_btn = row.find('a.timer_btn')

        var endDate = new Date(rate_date).getTime();

        var timerInterval = setInterval(function () {
            let now = new Date().getTime();
            let t = endDate - now;

            if (t >= 0) {
                let days = Math.floor(t / (1000 * 60 * 60 * 24));
                let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let mins = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
                let secs = Math.floor((t % (1000 * 60)) / 1000);

                var countdown = "";

                if (days > 0) {
                    countdown += days + ':';
                }
                if (hours > 0 || countdown !== "") {
                    countdown += ("0" + hours).slice(-2) + ':';
                }
                if (mins > 0 || countdown !== "") {
                    countdown += ("0" + mins).slice(-2) + ':';
                }
                countdown += ("0" + secs).slice(-2) + 's';

                days_span.text(countdown);

            } else {
                clearInterval(timerInterval);
                days_span.text("Expired");
            }
        }, 1000);
    });

    //remove criteria row
    $("body").on('click', '#remove_row', function () {
        $(this).parents('tr').remove();
     });

     // display Points in percent
     $("body").on('click', '#view-in-percent', function (e) {
        e.stopPropagation();

        var use_percent = $(this).is(":checked") ? true : false;

        $.ajax({
            type: "get",
            url: bpath + 'rating/view-in-percent',
            data: {_token: _token, use_percent:use_percent},
            dataType: "json",
            success: function (response) {
                if(response.status === 200) {
                    fetchedCriteria();
                }
            }
           });
     });

}

function onSubmit(){
     // ADD CRITERIA
     $("#addCriteriaForm").submit(function (e) {
        e.preventDefault();

        const fd = new FormData(this);
        if(blockEmptyCriteria()){
            $.ajax({
                url:  bpath + 'rating/add-criteria',
                method: 'post',
                data: fd,
                cache:false,
                contentType: false,
                processData: false,
                dataType: 'json',

                success: function (r) {
                    if(r.status == 200){
                    __notif_show( 1,"criteria Save Successfully");
                    $('#critID').val(0);
                    $('#addCriteriaForm')[0].reset();
                    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#addCriteria_modal'));
                    mdl.hide();
                    fetchedCriteria();
                    dropdown();
                    }
                }
            });
        }

    });

     // UPDATE CRITERIA
    $("#updateCriteria_form").submit(function (e) {
        e.preventDefault();
        const fd = new FormData(this);

        $.ajax({
            url:  bpath + 'rating/update-criteria',
            method: 'post',
            data: fd,
            cache:false,
            contentType: false,
            processData: false,
            dataType: 'json',

            success: function (r) {
            if(r.status == 200){
            __notif_show( 1,"Criteria Updated Successfully");
            $('#updateCriteria_form')[0].reset();
            const ediCreteriaModel = tailwind.Modal.getOrCreateInstance(document.querySelector('#update_criteria_Modal'));
            ediCreteriaModel.hide();
            fetchedCriteria();
            dropdown();
            }
        }
    });
    });

    //SAVE RATED AREA
    $("#ratingarea_form").submit(function (e) {
        e.preventDefault();

       var rates = $('#rateSum').val();
       var applicantPosition_id = $('#position_id').val();

        var ff =   $('#ratingarea_form').find('a.text-danger').length;
        var cc =   $('#ratingArea_table').find('label.text-danger').length;


        if(cc != 0){

            $('#errorCacher').addClass('text-danger').text('Unable to Save.!!! You Rated Over its Maximum Rate');

        }else{

            var formdata = new FormData(this);

            $.ajax({
                url:  bpath + 'rating/store/rated-areas',
                method: 'POST',
                data: formdata,
                cache: false,
                contentType: false,
                processData: false,
                dataType: 'json',
                success: function (data) {
                    let rate_input = $('#rateSum').val();
                    if(data.status == 200){

                        area_sumValue.val(rate_input);
                        $('#ratingarea_form')[0].reset();
                        const myModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#ratingArias_modal"));
                        myModal.hide();

                    }
                }
            });
        }
    });


}

function percentageBlocked(){

    var ff =   $('#manageRating_table').find('label.text-danger').length;

    if(use_percentage){

        if( ff != 0){
                    const warning = tailwind.Modal.getOrCreateInstance(document.querySelector('#warning_Modal'));
                    warning.show();
                    $('#warning_text').text(`You Can't rate Above its Maximum Rate!!`);
            return false;
        }
        else{

            var ratessss = $('#manageRating_table').find('input.rateClass');
            var countNotNumeric = 0;

            ratessss.each(function() {
                var inputValue = $(this).val();
                if (!$.isNumeric(inputValue)) {
                    countNotNumeric++;
                }
            });
            if (countNotNumeric === 0){
                return true;
            }else{
                const warning = tailwind.Modal.getOrCreateInstance(document.querySelector('#warning_Modal'));
                    warning.show();
                    $('#warning_text').text(`Rate Input must be in Numeric format`);
                return false;
            }


        }

    }else{
        return true;
    }

}

function cancel(){

    $("body").on('click', '#btn_cancel_addCriteria_modal', function () {
        $("#addCriteriaForm")[0].reset();
    });

   $("body").on('click', '#cnl_area_rating', function () {

    $('#ratingarea_form')[0].reset();
    $('#sumOf_rate').removeClass('text-danger');
    $('#sumOf_rate').text("");
   });

   $("body").on('click', '#cnl_rate_modal', function () {
    $('#saveRate_form')[0].reset();
    $('#foot_maxrating').text('0');
    $('#foot_totalrate').text('0');
    });

    $("body").on('click','#btn_c_skill_select', function () {
        let _blank = "";
        $('#_skills').val(_blank);
    });

   dropdown();
}

function dropdown(){

        $('#positioncritPage').select2({
            placeholder: "Select Position Category",
            closeOnSelect: true,
            allowClear: true
        });


        $('#position1').select2({
            placeholder: "Select Position Category",
            closeOnSelect: true,

        });

        $('#applicant').select2({
            placeholder: "Select Applicant",
            closeOnSelect: true,

        });

        $('#competency').select2({
            placeholder: "Select Competency",
            closeOnSelect: true,

        });

        $('#_skills').select2({
            placeholder: "Select Skills",
            closeOnSelect: true,

        });
        $('#position_up').select2({
            placeholder: "Select Position",
            closeOnSelect: true,

        });
        $('#competency_up').select2({
            placeholder: "Select Competency",
            closeOnSelect: true,

        });


}

function loadTables(){


    rating_table =  $('#manageRating_table').DataTable({
                        dom: 'lrt',
                        renderer: 'bootstrap',
                        "info": false,
                        "bInfo":true,
                        "bJQueryUI": true,
                        "bProcessing": true,
                        "bPaginate" : false,
                        "aaSorting": [],

                        order: [0, 'desc'],

                    });
}

function onChange(){

    $('#applicant').change(function (e) {
        e.preventDefault();
        var applicant_id = $(this).val();
        showPosition(applicant_id)
    });

    $('#competency').change(function (e) {
        e.preventDefault();
        var competency_id = $(this).val();

        $.ajax({
            url:  bpath + 'rating/onchange-competency-points/'+competency_id,
            type: "get",
            data: {
                _token: _token,
            },
            success: function (res) {
                let points = res.points;
                $('#maxrate').val(points);
            }
        });

    });

    $("#_skills").change(function (e) {
        e.preventDefault();

        let skill_id = $(this).val();

        $.ajax({
            url:  bpath + 'rating/onchange-skill-points/'+skill_id,
            type: "get",
            data: {
                _token: _token,
            },
            success: function (res) {
                let skill_points = res.skill_points;
                $('#skill_point').val(skill_points);
            }
        });

    });

}

function showPosition(applicant_id){

    $.ajax({
        url:  bpath + 'rating/filter-position-applicant/'+applicant_id,
        type: "get",
        data: {
            _token: _token,
        },
        success: function(data){
            /***/
            $('#positionApplied_div').html(data);

             $('#ApplicantPosition_select').select2();

                $('#ApplicantPosition_select').change(function (e) {
                    e.preventDefault();

                    var applicantPosition_id = $(this).val();


                });

            }
    });
}

var use_percentage;
function showCriteria(applicantPosition_id, applicant_job_ref){

    var applicant_s_list_id = $('#applicant_list_id').val();
    var applicant = $('#applicant_ids').val();

    $.ajax({
        url:  bpath + 'rating/filter-by-position/'+applicantPosition_id,
        type: "get",
        data: {
            _token: _token,
            applicantid:applicant,
            applicant_s_list_id:applicant_s_list_id,
            applicant_job_ref:applicant_job_ref,
        },
        dataType: "json",
        success: function(response) {

            rating_table.clear().draw();

            use_percentage = response.use_percentage;

            var percent_symbol = '';

            if(use_percentage){
                percent_symbol = '%';
            }

            $('#max_points').val(response.total_points);
            $('#max_percent').val(response.totalMax_rate)
            $('#foot_maxrating').text(response.total_points+percent_symbol)
            $('#foot_totalrate').text(response.average_ratings+percent_symbol);
            $('#count_criteria').val(response.count_criteria);
            $('#max_ave').val(response.max_ave);
            $('#remarks').val(response.remarks);
            $('#total_rate').val(response.rated_rate);


            if(response.totalMax_rate > 100){
                $('#overrate').text('The rating is Over');
            }

            var disabled_attr = '';

            var data = response.position;

            if(data.length > 0) {

                $('#saveRate_btn').show();

                for(var i=0;i<data.length;i++) {


                        var criteria_id = data[i]['id'];
                        var criteria = data[i]['criteria'];
                        var positionID = data[i]['positionID'];
                        var maxrate = data[i]['maxrate'];

                        var areaSum = data[i]['areaSum'];
                        var area_sum_all = data[i]['area_sum_all'];

                        var rated_rate = data[i]['rated_rate'];
                        var points_remarks = data[i]['points_remarks'];


                    var cd = "";




                    cd = '' +
                            '<tr >' +

                                '<td class="group_member_id">' +
                                    '<div class="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0" style="font-size: 12px;">'+
                                        '<a href="javascript:;" class="font-medium">'+criteria+'</a>'+
                                    '</div>'+

                                '</td>' +

                                '<td>' +
                                    '<div class="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0" style="font-size: 12px;">'+
                                        '<input id="maxratehidden" value="'+maxrate+'" type="hidden">'+
                                        '<label>'+maxrate+percent_symbol+'</label>'+
                                    '</div>'+
                                '</td>' +

                                '<td>' +
                                    '<div class="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0" style="font-size: 12px;">'+
                                        '<a id="'+criteria_id+'" data-criteria-name="'+
                                                criteria+'" data-max-rate="'+
                                                maxrate+'" href="javascript:;"'+
                                            'class="underline decoration-dotted underline-offset-4 text-primary dark:text-slate-400 cursor-pointer rating_area">'+
                                            'Areas'+
                                        '</a>'+
                                    '</div>'+
                                '</td>' +

                                '<td>' +
                                    '<div class="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">'+
                                        '<input class="criteria-id-classs" id="criteriaID" name="criteriaID[]" value="'+criteria_id+'" type="hidden">'+
                                        '<input style="border: none; font-size: 12px;" id="rate" name="rate[]" value="'+rated_rate+'" class="rateClass" placeholder="Rate" maxlength="3" size="4" type="text">'+
                                        '<label id="rateLabel" class="text-xs hidden"></label>'+
                                    '</div>'+
                                '</td>' +

                                '<td>' +
                                    '<div class="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0" style="font-size: 12px;">'+
                                        '<input style="border: none; font-size: 12px;" value="'+points_remarks+'" id="points_remarks" name="points_remarks[]" type="text" placeholder="Rate Note">'+

                                    '</div>'+

                                '</td>' +

                            '</tr>' +
                    '';

                    rating_table.row.add($(cd)).draw();




                }


                $('#tfoot_id').show();
                $('#remarks_div').show();

            }else{
                $('#tfoot_id').hide();
                $('#remarks_div').hide();
                $('#saveRate_btn').hide();
            }


            toggleCheck();

        }
    });
}

function toggleCheck(){

    $("#rating_check").on("click", function(){
        var id = parseInt($(this).val(), 10);

        var ave;
        var percent;

        let max_average = $('#max_ave').val();
        let max_percent = $('#max_percent').val();
        let average_ratee = $('#total_average_rate').val();
        let percent_ratee = $('#total_rate').val();

        if($(this).is(":checked") || $("#rating_check").is(":checked")) {
            $('#foot_maxrating').text(max_percent+'%');
            $('#foot_totalrate').text(percent_ratee+'%');
            $("#total_name").text('Total Percent');
            $('#checkbox').val(0);

        } else {


            $("#total_name").text('Total Average');
            $('#foot_maxrating').text(max_average);
            $('#foot_totalrate').text(average_ratee);
            $('#checkbox').val(1);
        }
    });

    $("body").on('click', '#show_area_percent', function () {
        var area_table = $('#addArea_table');
        if($(this).is(':checked')){

            area_table.find('input#arearate').addClass('hidden');
            area_table.find('input#percentrate').removeClass('hidden');
        }else{
            area_table.find('input#arearate').removeClass('hidden');
            area_table.find('input#percentrate').addClass('hidden');
        }
    });

}


function manageRating_Validation(){



    $("#manageRating_table").on('change', 'input.rateClass', function () {

        var _thisTr = $(this).closest('tr');
        var maxrating = _thisTr.find('td #maxratehidden');

        var _thisMax = maxrating.val();
        var _thisVaue = $(this).val();

        var _maxNum = Number(_thisMax);
        var _thisNum = Number(_thisVaue);

        var _ratingLabel = _thisTr.find('td #rateLabel');

        if ($.isNumeric(_thisNum)){

            $(this).css('color', '');

        }else{
            $(this).css('color', '#Ff696c');
           ;
        }

        if(use_percentage){

            if(_thisNum <= _maxNum){

                $(this).css('color', '');
                _ratingLabel.text("").removeClass('text-danger');

            }
            else if(_thisNum > _thisMax){
                $(this).css('color', '#Ff696c');
                _ratingLabel.text('Your Exceed the Maximum Points').addClass('text-danger');
            }

        }






    });

    $("#ratingArea_table").on('change', 'input', function () {

        var _thisTr = $(this).closest('tr');
        var maxrating = _thisTr.find('td #max_area_rate');

        var _thisMax = maxrating.val();
        var _thisVaue = $(this).val();

        var _maxNum = Number(_thisMax);
        var _thisNum = Number(_thisVaue);



        var _ratingLabel = _thisTr.find('td #rateArea_label');

        if ($.isNumeric(_thisNum)){

            $(this).css('border-color', '');

        }
        else{
            $(this).css('border-color', '#Ff696c');
        }

    });
}

function sumOf_areaInput_points(){

    $("#addArea_table").on('change', function () {
        var total_areaRate = 0;
        var rowCount = 0;


        $('#addArea_table tbody tr').each(function () {
            var rateArea = $(this).find('#arearate').val();
            if (!isNaN(rateArea)) {
                total_areaRate += parseFloat(rateArea);
                rowCount++;
            }
        });

        //GET AVERAGE
        var average_areaRate = rowCount > 0 ? total_areaRate / rowCount : 0;

        $('#input_points').text(average_areaRate.toFixed(2));

        var rowCountpercent = 0;
        var percentage = 0;
        var total_percentRate = 0;
        $('#addArea_table tbody tr').each(function () {
            var percentrateArea = $(this).find('#percentrate').val();
            if (!isNaN(percentrateArea)) {
                total_percentRate += parseFloat(percentrateArea);
                rowCountpercent++;
            }
        });

        //GET PERCENTAGE
        if (rowCount > 0) {
            percentage = total_percentRate;
        }

        $('#percent_points').text(percentage+"%");

    });
}

function check_table_input() {
    let rows = $("#addArea_table").find('tr');

    let isFormValid = true; // Initialize as true, assuming the form is valid by default

    rows.each(function() {
        var row = $(this);

        var emptyInputs = row.find("input").filter(function() {
            return this.value === "" || isNaN(this.value);
        });

        var emptytextArea = row.find("textarea").filter(function() {
            return this.value === "";
        });

        if (emptytextArea.length !== 0) {
            emptytextArea.css('border-color', '#ff0000');
            isFormValid = false; // Mark the form as invalid
        } else {
            emptytextArea.css('border-color', '');

            emptyInputs.css('border-color', ''); // Reset border color for inputs

            var arearate = row.find('.arearate'); // Corrected variable assignment
            var percentrate = row.find('.percentrate'); // Corrected variable assignment

            if (emptyInputs.length !== 0) {
                // There are empty or non-numeric inputs
                arearate.css('border-color', ''); // Reset border color for arearate
                percentrate.css('border-color', ''); // Reset border color for percentrate

                if ((arearate.val() == "" && percentrate.val() == "") || (arearate.val() != "" && percentrate.val() != "")) {
                    emptyInputs.css('border-color', '#ff0000');
                    isFormValid = false; // Mark the form as invalid
                }
            } else {
                if (arearate.val() != "" || percentrate.val() != "") {
                    isFormValid = true; // At least one row has valid data
                }
            }
        }
    });

    return isFormValid;
}

function sum_rate(){
    // CRITERIA RATE SUM
    $("#manageRating_table").on('input', '.rateClass', function () {
        var calculated_total_sum = 0;
        var average = 0;
        var max_points = $('#max_points').val();

        let count_criteria = $('#count_criteria').val();


            $("#manageRating_table .rateClass").each(function () {
                var get_textbox_value = $(this).val();
                if ($.isNumeric(get_textbox_value)) {
                calculated_total_sum += parseFloat(get_textbox_value);
                }
             });

            average = (calculated_total_sum / count_criteria).toFixed(2);


                $('#total_average_rate').val(average);

               $('#total_rate').val(calculated_total_sum);

               if(use_percentage){
                $("#foot_totalrate").text(calculated_total_sum+'%');

                if(calculated_total_sum > max_points){
                    $("#foot_totalrate").addClass('text-danger');
                }else{
                    $("#foot_totalrate").removeClass('text-danger');
                }

               }else{

                $("#foot_totalrate").text(average);

               }
        });

    // ARIA RATE SUM
    $("#ratingArea_table").on('input', '.areaClass', function () {
        var area_total_sum = 0;
        var area_total_ave = 0;


        $("#ratingArea_table .areaClass").each(function () {
            var get_textbox_value = $(this).val();
            if ($.isNumeric(get_textbox_value)) {
                area_total_sum += parseFloat(get_textbox_value);
            }
        });

            var rowCount = $('#ratingArea_table > tbody').find('tr').length;

            area_total_ave = (area_total_sum / rowCount).toFixed(2);

            $("#sumOf_rate").text(area_total_ave);

            $('#rateSum').val(area_total_ave);


    });

    //AREA MAX SUM
    $("#addArea_table").on('input', '.arearate', function () {
        var crit_max_sum = 0;
        var validCount = 0;

        $("#addArea_table .arearate").each(function () {
            var get_textbox_val = $(this).val();
            if ($.isNumeric(get_textbox_val)) {
                crit_max_sum += parseFloat(get_textbox_val);
                validCount++;
                $(this).css('border-color', '');
            } else {
                $(this).css('border-color', '#Ff696c');
            }
        });


        var average = validCount > 0 ? crit_max_sum / validCount : 0;

        $("#input_points").text(average);

        if (average > parseFloat($('#crit_max').val())) {
            $('#input_points').addClass('text-danger');

        } else {
            $('#input_points').removeClass('text-danger');
        }


    });

    $("#addArea_table").on('input', '.percentrate', function () {
        var crit_max_sum = 0;
        var validCount = 0;

        $("#addArea_table .percentrate").each(function () {
            var get_textbox_val = $(this).val();
            if ($.isNumeric(get_textbox_val)) {
                crit_max_sum += parseFloat(get_textbox_val);
                validCount++;
                $(this).css('border-color', '');
            } else {
                $(this).css('border-color', '#Ff696c');
            }
        });

        var percentage = validCount > 0 ? crit_max_sum  : 0;
        var formattedPercentage = percentage.toFixed(2).replace(/\.?0+$/, '');


        $("#percent_points").text(formattedPercentage +'%');



        if (formattedPercentage > parseFloat($('#crit_max').val())) {
            $('#percent_points').addClass('text-danger');

        } else {
            $('#percent_points').removeClass('text-danger');
        }

    });

}

function countdouwn_timer(rateDate){

    var endDate = new Date(rateDate).getTime();
    var timer = setInterval(function() {

    let now = new Date().getTime();
    let t = endDate - now;

    if (t >= 0) {

        let days = Math.floor(t / (1000 * 60 * 60 * 24));
        let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let mins = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        let secs = Math.floor((t % (1000 * 60)) / 1000);

        document.getElementById("timer-days").innerHTML = days +
        "<span class='label'> Day(s)</span>";

        document.getElementById("timer-hours").innerHTML = ("0"+hours).slice(-2) +
        "<span class='label'> Hr(s)</span>";

        document.getElementById("timer-mins").innerHTML = ("0"+mins).slice(-2) +
        "<span class='label'> Min(s)</span>";

        document.getElementById("timer-secs").innerHTML = ("0"+secs).slice(-2) +
        "<span class='label'> Sec(s)</span>";

    } else {

        document.getElementById(timer).innerHTML = "The countdown is over!";

    }

}, 1000);
}

function blockEmptyCriteria(){
    var average_points = $('#maxrate');
    var percent_points = $('#percent_point');
    var criteria_name = $('#criteria');
    var competency = $('#competency');

    if(competency.val() == '' && criteria_name.val() == ''){

        competency.select2({
            theme: "error",
            placeholder: "Please Select Competency",
        });

        criteria_name.css('border-color', 'red');

        if (average_points.val() == '' && percent_points.val() == '') {
            average_points.css('border-color', 'red');
            percent_points.css('border-color', 'red');
        } else {
            average_points.css('border-color', '');
            percent_points.css('border-color', '');
        }

        return false;

    }else if ((criteria_name.val() == '' && competency.val() != '') || (criteria_name.val() != '' && competency.val() == '')) {

        competency.select2({
            placeholder: "Select Competency ",
            closeOnSelect: true,
        });

        criteria_name.css('border-color', '');

        // Check if Percent_points is not numeric
        if (average_points.val() === '') {

            if(percent_points.val() != '') {
                if(isNaN(percent_points.val())){
                    percent_points.css('border-color', 'red');
                    average_points.css('border-color', 'red');
                    return false;
                }else{
                    percent_points.css('border-color', '');
                    average_points.css('border-color', '');
                    return true;
                }
            }else{
                percent_points.css('border-color', 'red');
                average_points.css('border-color', 'red');
            }

        } else {

            if(isNaN(average_points.val())){

                average_points.css('border-color', 'red');
                if(percent_points.val() != '') {
                    if(isNaN(percent_points.val())){
                        percent_points.css('border-color', 'red');

                    }else{
                        percent_points.css('border-color', '');
                    }
                }else{
                    percent_points.css('border-color', '');

                }

                return false;
            }else{

                average_points.css('border-color', '');

                if(percent_points.val() != '') {
                    if(isNaN(percent_points.val())){
                        percent_points.css('border-color', 'red');
                        return false;
                    }else{
                        percent_points.css('border-color', '');
                        return true;
                    }
                }else{
                    percent_points.css('border-color', '');
                    return true;
                }

            }
        }
    }


}


function fetched_shortList_position(){

    $.ajax({
        url:  bpath + 'rating/fetched/short-list-position',
        type: "get",
        data: {
            _token: _token,
        },
        success: function(data) {

            $('#tbl_shortList_position_div').html(data);
            $('#tbl_shortList_Position').DataTable({
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
                    "iDisplayLength": 5,
                    "aaSorting": [],
            });

        }
    });
}

var job_reference;
function view_shortList_Applicant_click() {
    $('body').on('click', '.view_shortList_applicant', function () {

            job_reference = $(this).attr('id');
            var tbl_shortList_Position = $('#tbl_shortList_Position').DataTable();

            // // console.log(job_reference, tbl_shortList_Position);
            // $('.tbl_shortList_Position').find('tr.view_shortList_applicant').css
            var tr = $(this);
            var _this_td = tr.find('td');
            var row = tbl_shortList_Position.row(tr);
            $('#tbl_shortList_Position').find('tr.view_shortList_applicant td').css('background-color', '');

            if (row.child.isShown()) {

                _this_td.css('background-color', '');
                row.child.hide();
                tr.removeClass('shown');

                tr.removeClass('selected-row');
            } else {

                    _this_td.css('background-color', '#ADD8E6');

                tbl_shortList_Position.rows().eq(0).each(function (idx) {
                    var row = tbl_shortList_Position.row(idx);
                    if (row.child.isShown()) {
                        row.child.hide();

                        $('.view_shortList_applicant.shown').removeClass('selected-row');
                    }
                });

                row.child(Applicant_shortList_format(row.data())).show();
                tr.addClass('shown');
                tr.addClass('selected-row');

            }

    });

    $('body').on('click', '.usePercentage', function (e) {
        e.stopPropagation();

        var if_check = $(this).is(":checked") ? true : false;

        var job_reference_val = $(this).val();
        $.ajax({
            type: "get",
            url: bpath + 'rating/use-for-rating',
            data: {_token: _token, job_reference: job_reference_val, if_check:if_check},
            dataType: "json",
            success: function (response) {
                if(response.status === 200) {
                    fetched_shortList_position();
                }
            }
        });

    });

}

function Applicant_shortList_format() {
    filter_shortList_applicant(job_reference);

    return `<div class="overflow-x-auto border border-slate-300 dark:border-darkmode-300 border-dashed rounded-md">
                <table id="tbl_applicant_shortList-${job_reference}" class="table table-report -mt-2">
                    <thead>
                        <th class="text-center whitespace-nowrap">Applicant Name</th>
                        <th class="text-center whitespace-nowrap">Position Applied</th>
                        <th class="text-center whitespace-nowrap">Interview Date</th>
                        <th class="text-center whitespace-nowrap">Status</th>
                        <th class="text-center whitespace-nowrap">Action</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="100" class="text-center align-middle">
                                <div class="flex justify-center items-center h-full">
                                    <svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-8 h-8">
                                        <g fill="none" fill-rule="evenodd" stroke-width="4">
                                            <circle cx="22" cy="22" r="1">
                                                <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                                                <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                                            </circle>
                                            <circle cx="22" cy="22" r="1">
                                                <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                                                <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                                            </circle>
                                        </g>
                                    </svg>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>`;
}

function filter_shortList_applicant(job_reference) {
   

    $.ajax({
        url: bpath + 'rating/filter-short-list-applicants',
        type: "GET",
        data: {
            _token: _token,
            job_reference: job_reference
        },
        success: function (response) {
            // Populate the table body with the response
            $('#tbl_applicant_shortList-' + job_reference + ' > tbody').html(response);
        },
        error: function () {
            // Show an error message if the AJAX request fails
            $('#tbl_applicant_shortList-' + job_reference + ' > tbody').html(`
                <tr>
                    <td colspan="5" class="text-center text-red-500">
                        Failed to load data. Please try again later.
                    </td>
                </tr>
            `);
        }
    });
}


function convert_to_decimal(){

    const percentPointInput = document.getElementById("percent_point");


    percentPointInput.addEventListener("change", function () {

        const inputValue = percentPointInput.value;

        const numericValue = parseFloat(inputValue);

        if (!isNaN(numericValue)) {

            if (numericValue >= 0 && numericValue <= 100) {
                const decimalValue = numericValue / 100;

                percentPointInput.value = decimalValue.toFixed(2);
            } else {
                percentPointInput.value = "0.00";
            }
        }
    });
}

//New Development

function rateICon_Format (applicant, position_id, position_type, applicant_list_id, applicant_job_ref) {

    ratingCandidate(applicant, position_id, position_type, applicant_list_id, applicant_job_ref)

    return `<tr class="extended_shortList_tr expanded-row bg-lightblue-100">
                <td colspan="5">

                    <div id="rate_applicant_div${applicant_list_id}" class="overflow-x-auto border border-slate-300 dark:border-darkmode-300 border-dashed rounded-md">

                    </div>
                </td>
            </tr>`;
}


function ratingCandidate(applicant, position_id, position_type, applicant_list_id, applicant_job_ref){
    $.ajax({
        type: "get",
        url: bpath + "rating/rate-candidate-view",
        data: {applicant: applicant,
                position_id: position_id,
                position_type: position_type,
                applicant_list_id: applicant_list_id,
                applicant_job_ref: applicant_job_ref
        },
        success: function (response) {
            $('#rate_applicant_div'+applicant_list_id).html(response);

            check_hr_RateLabels();
            check_pnels_RateLabels();
        }
    });
}

function setCaretToEnd(el) {
    let range = document.createRange();
    let sel = window.getSelection();
    range.setStart(el.childNodes[0], el.innerText.length - 1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

function check_hr_RateLabels() {
    var hasEmptyValue = false;

    // Get all visible rows in the first visible criteria-section
    $('#hrCriterias_table tr.criteria-section:visible').each(function () {
        $(this).nextUntil('.criteria-section').find('.hrRate_label').each(function () {
            var this_value = parseFloat($(this).text().replace('%', ''));
            if (isNaN(this_value) || this_value === 0) {
                hasEmptyValue = true;
            }
        });
    });

    if (hasEmptyValue) {
        $('#next_criteria').prop('disabled', true);
    } else {
        $('#next_criteria').prop('disabled', false);
    }
}

function check_pnels_RateLabels() {
    var hasEmptyValue = false;

    // Get all visible rows in the first visible criteria-section
    $('#PnelCriterias_table tr.panel-criteria-section:visible').each(function () {
        $(this).nextUntil('.panel-criteria-section').find('.Pnelrate_label').each(function () {
            var this_value = parseFloat($(this).text().replace('%', ''));
            if (isNaN(this_value)) {
                hasEmptyValue = true;
            }
        });
    });

    if (hasEmptyValue) {
        $('#Pnelnext_criteria').prop('disabled', true);
    } else {
        $('#Pnelnext_criteria').prop('disabled', false);
    }
}

var currentIndex = 0;
var PnelcurrentIndex = 0;
var rating_array = [];

function newClickFunctions(){

        $("body").on('input', '.hrRate_label', function () {

            var _this_tr = $(this).closest('tr');
            var _this_td = _this_tr.find('td#competency_td');
            var _thismaxPoints = parseFloat(_this_td.data('m-points').replace('%', ''));

            if(_thismaxPoints == ''){
                _thismaxPoints = 0;
            }

            let value = parseFloat(this.innerText.replace('%', ''));
            if (isNaN(value)) value = 0; // Handle NaN cases

            this.innerText = value + '%';
            setCaretToEnd(this);

            var _this_hr_index = _this_tr.data('hr-index');
            var _this_table = $('#hrCriterias_table');

            var cariteria_raw = _this_table.find('tr.criteria-section[data-index="'+_this_hr_index+'"]');
            var subTotal_label = cariteria_raw.find('label.hr-sub-total-points');

            var competency_raw = _this_table.find('tr.hr_competency_row[data-hr-index="'+_this_hr_index+'"]');
            // console.log('competency_raw Lenght: ' + competency_raw.length);

            if (value > _thismaxPoints) {
                $(this).css('color', 'red');
            } else {
                $(this).css('color', '');
            }



            var this_rateTotal = 0;
            var has_css_red = 0;
            var blank_zero = 0;

            if(competency_raw.length > 0) {
                competency_raw.each(function(n, this_tr) {
                    var _this_tr = $(this_tr);
                    var hrRate_label = _this_tr.find('label.hrRate_label');

                    var this_value = parseFloat(hrRate_label.text().replace('%', ''));
                    if (!isNaN(this_value)) {
                        this_rateTotal += this_value;
                    }

                    // Check if the color is red
                    if (hrRate_label.css('color') === 'rgb(255, 0, 0)') {
                        has_css_red++;
                    }

                    // Check for blank or zero values
                    if (isNaN(this_value) || this_value === 0) {
                        blank_zero++;
                    }
                });
            }


            // Disable 'next_criteria' button if any of the conditions are met
            if(has_css_red != 0 || this_rateTotal === 0 || blank_zero != 0) {
                $('#next_criteria').prop('disabled', true);
            } else {
                $('#next_criteria').prop('disabled', false);
            }

            subTotal_label.text(this_rateTotal + '%');


        });

         $("body").on('blur', '.hrRate_label', function () {
            let value = parseFloat(this.innerText.replace('%', ''));
            if (isNaN(value)) {
                this.innerText = '';
            } else {
                if(value !=0){
                    this.innerText = value + '%';
                }else{
                    this.innerText = '';
                }

            }
         });

        $("body").on('focus', '.hrRate_label', function () {

             var _this_tr = $(this).closest('tr');
             var _this_td = _this_tr.find('td');
             _this_td.css('background-color', '#ddeaeb');
        });

        $("body").on('focusout', '.hrRate_label', function () {
            var _this_tr = $(this).closest('tr');
            var _this_td = _this_tr.find('td');
            _this_td.css('background-color', '');
        });

        $("body").on('click', '#next_criteria', function () {
            var table_hr = $('#hrCriterias_table');
            var totalCriteria = table_hr.find('tr.criteria-section');
            var totalCriteria_length = totalCriteria.length;

            var nextButton = $(this);
            var originalText = nextButton.text();

            if (nextButton.text() === 'Next') {
                if (currentIndex < totalCriteria_length - 1) {

                    // Hide the current section
                    $(`.criteria-section[data-index="${currentIndex}"]`).nextUntil('.criteria-section').hide();
                    $(`.criteria-section[data-index="${currentIndex}"]`).hide();

                    currentIndex++;

                    // Show the next section
                    $(`.criteria-section[data-index="${currentIndex}"]`).nextUntil('.criteria-section').show();
                    $(`.criteria-section[data-index="${currentIndex}"]`).show();

                    $("#previous_criteria").prop("disabled", false);  // Enable the "Previous" button
                }

                // If we are at the last section, change button text to "Save"
                if (currentIndex === totalCriteria_length - 1) {
                    nextButton.text("Save").addClass("btn-primary").removeClass("btn-secondary");
                } else {
                    nextButton.text("Next");
                }

                check_hr_RateLabels();  // Function that updates rates
            }
            // Handle the "Save" state
            else {

                rating_array = [];

                // console.log(totalCriteria);

                // Loop through all criteria sections and collect their data
                table_hr.find('tr.criteria-section').each(function () {
                    var criteria_id = $(this).data('criteriaid');
                    var index = $(this).data('index');
                    var comps = table_hr.find(`tr.hr_competency_row[data-hr-index="${index}"]`);
                    var hr_subTotal = $(this).find('label.hr-sub-total-points').text().replace('%', '') || '0'; // Fallback to '0' if empty
                    var competencyArray = [];

                    // Collect competency data for each criteria
                    comps.each(function () {
                        var comp_id = $(this).data('competency-id');
                        var comp_rate = $(this).find('label.hrRate_label').text().replace('%', '') || '0';  // Fallback to '0' if empty

                        competencyArray.push({
                            competency_id: comp_id,
                            comp_rate: comp_rate
                        });
                    });

                    rating_array.push({
                        criteria_id: criteria_id,
                        total_rate: hr_subTotal,
                        rater: 'qualification',
                        competencies: competencyArray
                    });
                });

                save_rating(nextButton, originalText);
                // $.ajax({
                //     type: "POST",
                //     url: bpath + "rating/save-rating",
                //     data: {
                //         _token: _token,
                //         rating_array: rating_array,
                //         position_id: position_id,
                //         position_type: position_type,
                //         applicant_list_id: applicant_list_id,
                //         applicant_job_ref: applicant_job_ref,
                //         applicant_id: applicant
                //     },
                //     dataType: "json",
                //     beforeSend: function () {
                //         // Change the button text to show "Saving" and a loading spinner
                //         nextButton.html(`Saving <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2">
                //                             <g fill="none" fill-rule="evenodd">
                //                                 <g transform="translate(1 1)" stroke-width="4">
                //                                     <circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle>
                //                                     <path d="M36 18c0-9.94-8.06-18-18-18">
                //                                         <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform>
                //                                     </path>
                //                                 </g>
                //                             </g>
                //                         </svg>`);
                //     },
                //     success: function (response) {
                //         // Restore the button text back to "Save" after successful save
                //         nextButton.html(originalText);
                //         alert('Rating successfully saved!');
                //     },
                //     error: function (xhr, status, error) {
                //         // Handle errors and restore the button text
                //         nextButton.html(originalText);
                //         alert('There was an error saving the ratings. Please try again.');
                //     }
                // });
            }
        });

        // Click event for "Previous" button
        $("body").on('click', '#previous_criteria',function () {
            var table_hr = $('#hrCriterias_table');
            var totalCriteria = table_hr.find('tr.criteria-section').length;
            console.log('currentIndex: ' + currentIndex);

            if (currentIndex > 0) {
                // Hide the current section
                $(`.criteria-section[data-index="${currentIndex}"]`).nextUntil('.criteria-section').hide();
                $(`.criteria-section[data-index="${currentIndex}"]`).hide();

                currentIndex--;

                // Show the previous section
                $(`.criteria-section[data-index="${currentIndex}"]`).nextUntil('.criteria-section').show();
                $(`.criteria-section[data-index="${currentIndex}"]`).show();

                // Enable the "Next" button if we're not at the last section anymore
                $("#next_criteria").text("Next").removeClass('btn-primary').addClass(("btn-secondary"));
                $("#next_criteria").prop("disabled", false);
            }

            // Disable "Previous" button if we're at the first section
            if (currentIndex === 0) {
                $(this).prop("disabled", true);
            }
        });

        $("body").on('input', '.Pnelrate_label', function () {
            var ratePnel_lbl = $(this);
            var _thisRaw = ratePnel_lbl.closest('tr');
            var _this_table = $('#PnelCriterias_table');
            var required_points = _thisRaw.find('td.competency_points').text().trim();

            var _this_panel_index = _thisRaw.data('pnels-index');
            var pnel_cariteria_raw = _this_table.find('tr.panel-criteria-section[data-index="'+_this_panel_index+'"]');
            var pnel_subTotal_label = pnel_cariteria_raw.find('label.pnels-sub-total-points');
            var criteria_point = pnel_cariteria_raw.data('criteria-points').replace('%', '');

            // console.log('_this_table: ', _this_table);  Goods

            // console.log('_this_panel_index: ' + _this_panel_index); Goods


            var pnel_competency_raw = _this_table.find('tr.pnels_competency_row[data-pnels-index="'+_this_panel_index+'"]');
            // var pnel_competency_raw = _this_table.find('tr.pnels_competency_row');

            // console.log(pnel_competency_raw.length);

            // console.log(ratePnel_lbl.text());
            // console.log('required_points:  ' + required_points);

            var this_rateTotal = 0;
            var has_css_red = 0;
            var blank_zero = 0;
            var rated_lenght = 0;

            var competency_lenght = pnel_competency_raw.length;

            //  console.log(competency_lenght);

            if(competency_lenght > 0) {
                pnel_competency_raw.each(function(n, this_tr) {
                    var _this_tr = $(this_tr);
                    var pnelsRate_label = _this_tr.find('label.Pnelrate_label');

                    var this_value = parseFloat(pnelsRate_label.text().replace('%', ''));
                    if (!isNaN(this_value) && this_value != 0) {
                        this_rateTotal += this_value;
                        rated_lenght++;
                    }

                    // Check if the color is red
                    if (pnelsRate_label.css('color') === 'rgb(255, 0, 0)') {
                        has_css_red++;
                    }

                    // Check for blank or zero values
                    if (isNaN(this_value)) {
                        blank_zero++;
                    }
                });
            }

            console.log('rated_lenght: '+rated_lenght);


            var satisfied = rated_lenght / competency_lenght;
            console.log('satisfied: '+satisfied);
            console.log('criteria_point: '+criteria_point);
            var percentage_weight = (satisfied * 100).toFixed(2);
            var decimalValue = convert_to_decimal(criteria_point);
            console.log('decimalValue: '+decimalValue);

            var rate_percentage = (percentage_weight * decimalValue).toFixed(2);

            rate_percentage = parseFloat(rate_percentage);

            pnel_subTotal_label.text(rate_percentage + '%');
             // Disable 'next_criteria' button if any of the conditions are met
             if(blank_zero != 0) {
                $('#Pnelnext_criteria').prop('disabled', true);
            } else {
                $('#Pnelnext_criteria').prop('disabled', false);
            }

        });

        $("body").on('click', '#Pnelnext_criteria', function () {

            var table_pnel = $('#PnelCriterias_table');
            var totalPnelCriteria = table_pnel.find('tr.panel-criteria-section');
            var totalPnelCriteria_length = totalPnelCriteria.length;

            var nextButton = $(this);
            var originalText = nextButton.text();

            if (nextButton.text() === 'Next') {
                if (PnelcurrentIndex < totalPnelCriteria_length - 1) {

                    // Hide the current section
                    $(`.panel-criteria-section[data-index="${PnelcurrentIndex}"]`).nextUntil('.panel-criteria-section').hide();
                    $(`.panel-criteria-section[data-index="${PnelcurrentIndex}"]`).hide();

                    PnelcurrentIndex++;

                    // Show the next section
                    $(`.panel-criteria-section[data-index="${PnelcurrentIndex}"]`).nextUntil('.panel-criteria-section').show();
                    $(`.panel-criteria-section[data-index="${PnelcurrentIndex}"]`).show();

                    $("#Pnelprevious_criteria").prop("disabled", false);  // Enable the "Previous" button
                }

                // If we are at the last section, change button text to "Save"
                if (PnelcurrentIndex === totalPnelCriteria_length - 1) {
                    nextButton.text("Save").addClass("btn-primary").removeClass("btn-secondary");
                } else {
                    nextButton.text("Next");
                }

                check_pnels_RateLabels();

            } else {
                // Handle the "Save" state
                rating_array = [];

                // Loop through all criteria sections and collect their data
                table_pnel.find('tr.panel-criteria-section').each(function () {
                    var criteria_id = $(this).data('criteriaid');
                    var index = $(this).data('index');
                    var comps = table_pnel.find(`tr.pnels_competency_row[data-pnels-index="${index}"]`);
                    var pnels_subTotal = $(this).find('label.pnels-sub-total-points').text().replace('%', '') || '0'; // Fallback to '0' if empty
                    var competencyArray = [];

                    // Collect competency data for each criteria
                    if(comps.length > 0) {
                        comps.each(function () {
                            var comp_id = $(this).data('competency-id');
                            var comp_rate = $(this).find('label.Pnelrate_label').text().trim() || '0';  // Fallback to '0' if empty

                            competencyArray.push({
                                competency_id: comp_id,
                                comp_rate: comp_rate
                            });
                        });
                    }

                    rating_array.push({
                        criteria_id: criteria_id,
                        total_rate: pnels_subTotal,
                        rater: 'competency',
                        competencies: competencyArray
                    });
                });

                // Send the AJAX request to save the data
                save_rating(nextButton, originalText);

            }
        });


        // Click event for "Previous" button
        $("body").on('click', '#Pnelprevious_criteria',function () {
            var table_pnel = $('#PnelCriterias_table');
            var totalPnelCriteria = table_pnel.find('tr.panel-criteria-section').length;
            console.log('PnelcurrentIndex: ' + PnelcurrentIndex);

            if (PnelcurrentIndex > 0) {
                // Hide the current section
                $(`.panel-criteria-section[data-index="${PnelcurrentIndex}"]`).nextUntil('.panel-criteria-section').hide();
                $(`.panel-criteria-section[data-index="${PnelcurrentIndex}"]`).hide();

                PnelcurrentIndex--;

                // Show the previous section
                $(`.panel-criteria-section[data-index="${PnelcurrentIndex}"]`).nextUntil('.panel-criteria-section').show();
                $(`.panel-criteria-section[data-index="${PnelcurrentIndex}"]`).show();

                // Enable the "Next" button if we're not at the last section anymore
                $("#Pnelnext_criteria").text("Next").removeClass('btn-primary').addClass(("btn-secondary"));
                $("#Pnelnext_criteria").prop("disabled", false);
            }

            // Disable "Previous" button if we're at the first section
            if (PnelcurrentIndex === 0) {
                $(this).prop("disabled", true);
            }
        });


}
function convert_to_decimal(value) {
    return value / 100;
}

function save_rating(nextButton, originalText){
    $.ajax({
        type: "POST",
        url: bpath + "rating/save-rating",
        data: {
            _token: _token,
            rating_array: rating_array,
            position_id: position_id,
            position_type: position_type,
            applicant_list_id: applicant_list_id,
            applicant_job_ref: applicant_job_ref,
            applicant_id: applicant
        },
        dataType: "json",
        beforeSend: function () {
            // Change the button text to show "Saving" and a loading spinner
            nextButton.html(`Saving <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2">
                                <g fill="none" fill-rule="evenodd">
                                    <g transform="translate(1 1)" stroke-width="4">
                                        <circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle>
                                        <path d="M36 18c0-9.94-8.06-18-18-18">
                                            <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform>
                                        </path>
                                    </g>
                                </g>
                            </svg>`);
        },
        success: function (response) {
            nextButton.html(originalText);
            if(response.status == 200){
                __notif_show(1, response.message);
            }else{
                __notif_show(-3, 'Something went wrong..!!!');
            }

        },
        error: function (xhr, status, error) {
            // Handle errors and restore the button text
            nextButton.html(originalText);
            alert('There was an error saving the ratings. Please try again.');
        }
    });
}





