var  _token = $('meta[name="csrf-token"]').attr('content');

var tbl_PositionPoints;
var tbl_savedCriteria;

var position_pointsS2;

$(document).ready(function () {

    bpath = __basepath + "/";
    loadDataTables();
    fetch_Position_Points();
    onClick_function();
    onSubmit_function();
    onChangefunction();

    select2();

    cancel();

    submit_deleteData();

    enterKeyEvent();
    fetch_competencyData();

});


function loadDataTables(){

    tbl_PositionPoints = $('#tbl_PositionPoints').DataTable({
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

    });

    tbl_savedCriteria = $('#saveCriteria_tbl').DataTable({
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

function select2(){

    position_pointsS2 = $('#point_position').select2({
        placeholder: "Select Position ",
        closeOnSelect: true,

    });
    $('#competency_modal2').select2({
        placeholder: "Select Competency ",
        templateResult: formatOption
    });

}

function fetch_Position_Points(){
    $.ajax({
        url:  bpath + 'rating/fetched/position-points',
        type: "get",
        data: {
            _token: _token,
        },
        dataType: 'json',
        success: function(data) {


        tbl_PositionPoints.clear().draw();
        /***/

            var data = data;

            if (data.length > 0) {

                for (let i = 0; i < data.length; i++) {
                        var position_pointsID = data[i]['p_pointsID'];
                        var positionID = data[i]['positionID'];
                        var position = data[i]['position'];
                        var criteria = data[i]['criteria'];
                        var position_points = data[i]['position_points'];
                        var criteria_no_icon = data[i]['criteria_no_icon'];
                        var action_btn = data[i]['action_btn'];

                        var ii = i+1;

                        var cd = '';
                                /***/

                                    cd = '' +
                                            '<tr class="text-center">'+

                                                '<td>' +
                                                        ii+
                                                '</td>' +


                                                '<td>' +
                                                        position+
                                                '</td>' +


                                                '<td>' +
                                                    '<a class="points-display" data-postion-points="'+position_points+'" href="javascript:;" style="text-decoration: none; color: black;">' +
                                                        '<span class="underline-on-hover" style="color: inherit;">'+position_points+'%</span>' +
                                                    '</a>' +
                                                '</td>'+


                                                '<td>' +
                                                    criteria_no_icon+
                                                '</td>' +


                                                '<td>' +
                                                    action_btn +
                                                '</td>' +



                                            '</tr>' +
                                    '';

                                    tbl_PositionPoints.row.add($(cd)).draw();


                                /***/


                }
            }
        }
    });
}

function fetch_saveCriteria(){

   let pID = $('#PositionIDp').val();
    $.ajax({
        url:  bpath + 'rating/fetched-saved-criteria',
        method: 'get',
        data: {_token:_token,
                },
        success: function (response) {
            try {
                if (response !='') {
                    tbl_savedCriteria.clear().draw();
                    var data = JSON.parse(response);

                        if (data.length > 0) {

                            for (let i = 0; i < data.length; i++) {

                                    var curentPositionID = data[i]['p_ID'];
                                    var criteriaID = data[i]['criteriaID'];
                                    var criterianame = data[i]['criterianame'];
                                    var criteriaPoints = data[i]['criteriaPoints'];
                                    var competency_ID = data[i]['competencyID'];

                                    var cd = '';

                                                cd = '' +
                                                        '<tr class="text-center rowClick">'+

                                                            '<td class="text-justify">' +
                                                                '<label id="competency_ID" class="hidden">'+competency_ID+'</label>'+
                                                                '<label id="curentPositionID" class="hidden">'+curentPositionID+'</label>'+
                                                                '<label id="critID" class="hidden">'+criteriaID+'</label>'+
                                                                '<label id="critName">'+criterianame+'</label>'+
                                                            '</td>' +


                                                            '<td>' +
                                                                    '<label id="critPoints">'+criteriaPoints+'</label>'+
                                                            '</td>' +

                                                        '</tr>' +
                                                    '';




                                    var exists = false;
                                    $('#critPoints_tbl tr').each(function () {
                                        var criteriaIdd = $(this).find('#critID').val();
                                        if (criteriaID == criteriaIdd) {
                                            exists = true;
                                            return false;
                                        }
                                    });

                                    if (!exists) {

                                        tbl_savedCriteria.row.add($(cd)).draw();

                                    }

                              


                            }
                        }
                } else {

                }

            } catch (error) {
                console.log(error);
            }


        }
    });
}

function fetched_positionCriteriaData(pID){

    $.ajax({
        url:  bpath + 'rating/fetched-position-criteria-data/'+pID,
        method: 'get',
        data: {_token:_token,
                },
        dataType: 'json',
        success: function (data) {


            try {
                var positioncriteriaData = data.positioncriteriaData;
                var create_prev = data.create_prevel;
                var delete_prev = data.delete_prevel;
                var write_prev = data.write_prevel;

                    if (positioncriteriaData.length > 0) {
                        for (let i = 0; i < positioncriteriaData.length; i++) {
                            var curentPositionID = positioncriteriaData[i]['p_ID'];
                            var competencyID = positioncriteriaData[i]['competencyID'];
                            var criteriaID = positioncriteriaData[i]['criteriaID'];
                            var criterianame = positioncriteriaData[i]['criterianame'];
                            var criteriaPoints = positioncriteriaData[i]['criteriaPoints'];

                            // if (!exists) {

                                $('#critPoints_tbl > tbody').append(
                                    '<tr>' +
                                        '<td>' +
                                            '<input type="hidden" value="' + curentPositionID + '" id="competency_ID" name="competency_ID[]">'+
                                            '<input type="hidden" value="' + competencyID + '" id="competencyID" name="critPostionID[]">' +
                                            '<input type="hidden" value="' + criteriaID + '" id="critID" name="critID[]">' +
                                            '<input type="hidden" value="' + criterianame + '" id="critName" name="critName[]">' +
                                            '<a class="critData_row">' +
                                                '<label id="critname_lbl">' + criterianame + '</label>' +
                                            '</a>' +
                                        '</td>' +
                                        '<td>' +
                                            '<input type="hidden" value="' + criteriaPoints + '" id="critPoints" name="critPoints[]">' +
                                            '<label id="critPoints_lbl">' + criteriaPoints + '</label>' +
                                        '</td>' +
                                        '<td>' +

                                            (delete_prev ? '<a href="javascript:;" data-curent-position-id="'+curentPositionID+'" class="criteria-remove-table-row"> <i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i></a>'
                                                : '<a href="javascript:;">  <i class="fa fa-trash-alt w-4 h-4 mr-2 text-slate-200"></i> </a>'
                                            )+

                                        '</td>' +
                                    '</tr>'
                                );
                            // }
                        }
                    
                }
            } catch (error) {
                console.log(error);
            }


        }
    });
}

    var _thisrowID;
    var _thisrowCritname;
    var _thisrowCritPoint;
    var _thisrowCritname_lbl;
    var _thisrowCritPoint_lbl;
    var _thisCriteria_row
    var _thisCompetencyID;

function onClick_function(){

    $("body").on('click', ' .critList', function () {

        let positionID = $(this).attr('id');
        let position_name = $(this).data('position-name');
        $('#PositionIDp').val(positionID);
        $('#points_criteria_header').text(position_name+' - Criteria');
        $('.competency_div').hide();

        fetched_positionCriteriaData(positionID)
    });


    $("body").on('click', '.deletePoints', function () {


        let p_pointsID = $(this).attr('id');
        $('#delete_id').val(p_pointsID);
        $('#deleteCode').val('deletePoints');

        const deleteModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#delete-modal"));
        deleteModal.show();

    });

    $("body").on('click', '.criteriaData', function () {

        $('.criteriaDiv').removeClass('hidden')
        $('.InputCriteriaDiv').addClass('hidden')
        fetch_saveCriteria();

    });

    $("body").on('click','.newcriteriaData', function () {
        $('.competency_div').hide();
        $('#critname_mdl').attr('disabled', false);
        $('.criteriaDiv').addClass('hidden')
        $('.InputCriteriaDiv').removeClass('hidden')
    });

    $("body").on('click', '.rowClick', function () {

        var competency_ID = $(this).find('#competency_ID').text();
        var critID = $(this).find('#critID').text();
        var critName = $(this).find('#critName').text();
        var critPoints = $(this).find('#critPoints').text();
        var curentPositionID = $(this).find('#curentPositionID').text();

        var criteriaExists = false;
        var existingRow = this;

        $('#critPoints_tbl tr').each(function () {

            var criteriaIdd = $(this).find('#critID').val();
            if (critID === criteriaIdd) {
                criteriaExists = true;

                $('.highlighted-row').not(this).removeClass('highlighted-row');
                $(this).addClass('highlighted-row');
                return false;
            }
        });

        if (!criteriaExists) {

            $('.highlighted-row').not(this).removeClass('highlighted-row');
            $('#critPoints_tbl > tbody').append(
                '<tr>' +
                '<td>' +
                '<input type="hidden" value="' + curentPositionID + '" id="critPostionID" name="critPostionID[]">' +
                '<input type="hidden" value="' + competency_ID + '" id="competency_ID" name="competency_ID[]">'+
                '<input type="hidden" value="' + critID + '" id="critID" name="critID[]">' +
                '<input type="hidden" value="' + critName + '" id="critName" name="critName[]">' +
                '<a class="critData_row">' +
                '<label id="critname_lbl">' + critName + '</label>' +
                '</a>' +
                '</td>'+
                '<td>' +
                '<input type="hidden" value="' + critPoints + '" id="critPoints" name="critPoints[]">' +
                '<label id="critPoints_lbl">' + critPoints + '</label>' +
                '</td>' +
                '<td>' +
                '<a href="javascript:;" data-curent-position-id="'+curentPositionID+'" class="criteria-remove-table-row"> <i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i></a>' +
                '</td>' +
                '</tr>'
            );

            $(this).remove();


        }else{
            var tooltipContainer = $('.tooltip-container');
            tooltipContainer.text("Criteria ID already exists!");
            tooltipContainer.addClass('tooltip-visible');

            var position = $(existingRow).position();
            tooltipContainer.css({
                top: position.top + $(existingRow).outerHeight(),
                left: position.left,
            });

            setTimeout(function () {
                tooltipContainer.removeClass('tooltip-visible');
            }, 3000);

        }

        fetch_saveCriteria();
    });

    $("body").on('click', '.critData_row', function () {

        $('#critname_mdl').attr('disabled', false);
        var thisRow = $(this).closest('tr');
        _thisCompetencyID = thisRow.find('#competency_ID')
        _thisrowID = thisRow.find('#critID');
        _thisrowCritname = thisRow.find('#critName');
        _thisrowCritPoint = thisRow.find('#critPoints');
        _thisrowCritname_lbl = thisRow.find('#critname_lbl');
        _thisrowCritPoint_lbl = thisRow.find('#critPoints_lbl');

        if (_thisrowID.val() != 0) {
        } else {
            $('.criteriaDiv').addClass('hidden')
            $('.InputCriteriaDiv').removeClass('hidden')
            $('#critname_mdl').val(_thisrowCritname.val());
            $('#critpoint_mdl').val(_thisrowCritPoint.val());
            $('#addCriteriaBTN').text('Change');
        }
    });

    $("body").on('click', '.criteria-remove-table-row', function () {


            $(this).parents('tr').remove();
            fetch_saveCriteria();


    });

    $("body").on('click', '.criteriaCompetency', function () {

        $('.competency_div').show();
        $('.criteriaDiv').addClass('hidden');
        $('.InputCriteriaDiv').removeClass('hidden');

        $('#critname_mdl').attr('disabled', true);
    });

    $("body").on('click', '#addCriteriaBTN', function () {
        var critID = 0;
            var competency_ID = $('#competency_ID');
            var critName = $('#critname_mdl');
            var critPoint = $('#critpoint_mdl');

            if($('#addCriteriaBTN').text() != 'Change'){

                if (checkIfNumeric(critName, critPoint)) {

                    $('#critPoints_tbl > tbody').append(
                        '<tr>'+


                            '<td>'+
                            '<input type="hidden" value="0" id="critPostionID" name="critPostionID[]">' +
                                    '<input type="hidden" value="'+competency_ID.val()+'" id="competency_ID" name="competency_ID[]">'+
                                    '<input type="hidden" value="'+critID+'" id="critID" name="critID[]">'+
                                    '<input type="hidden" value="'+critName.val()+'" id="critName" name="critName[]">'+
                                    '<a class="critData_row">'+
                                        '<label id="critname_lbl">'+critName.val()+'</label>'+
                                    '</a>'+
                            '</td>'+

                            '<td>'+
                                    '<input type="hidden" value="'+critPoint.val()+'" id="critPoints" name="critPoints[]">'+
                                    '<label id="critPoints_lbl">'+critPoint.val()+'</label>'+
                            '</td>'+


                            '<td>'+
                                    '<a href="javascript:;" class="criteria-remove-table-row"> <i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i></a>'+
                            '</td>'+
                        '</tr>');

                        critName.val('');
                        critPoint.val('');
                        competency_ID.val(0);
                }
            }else{

                _thisrowCritname.val(critName.val());
                _thisrowCritPoint.val(critPoint.val());
                _thisrowCritname_lbl.text(critName.val());
                _thisrowCritPoint_lbl.text(critPoint.val());

                $('#addCriteriaBTN').text('Add')
                critName.val('');
                critPoint.val('');
            }
    });

    $("body").on('click', '.editPoints', function () {
        var pos_points_id = $(this).attr('id');
        var position_id = $(this).data('position-id');
        var position = $(this).data('postion');
        var position_points = $(this).data('postion-points');

        $('#add_points_header').text(position);
        $('.pos_points').addClass('hidden');
        $('#posPoints').val(position_points);
        $('#post_points_id').val(pos_points_id);
        $('#save_Points_btn').text('Change');
        const addPoints_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#addPoints_modal'));
        addPoints_modal.show();

    });

}

function fetch_competencyData() {
    $.ajax({
        url: bpath + 'rating/fetch/competency-data',
        method: 'get',
        data: {_token},
        dataType: 'json',
        success: function (response) {
            try {
                var data = response;
                var options = [];

                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        var competencyID = data[i]['competencyID'];
                        var competencyName = data[i]['competencyName'];
                        var competencyPoints = data[i]['competencyPoints'];

                        var exists = false;
                            $('#critPoints_tbl tr').each(function () {
                                var competency_ID = $(this).find('#competency_ID').val();
                                if (competency_ID == competencyID) {
                                    exists = true;
                                    return false;
                                }
                            });

                            if (!exists) {

                                options.push({
                                    id: competencyID,
                                    text: competencyName,
                                    comPoints: competencyPoints
                                });

                            }

                    }

                    $('#competency_modal2').select2({
                        data: options,
                        templateResult: formatOption
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    });
}

function formatOption(option) {
    if (!option.id) {
        return option.text;
    }

    var points = option.comPoints || '';
    return $('<div class="select2-custom-option">' +
             '<span class="select2-option-name">' + option.text + '</span>' +
             '<span class="select2-option-points">' + points + '</span>' +
             '</div>');
}

function submit_deleteData(){

        $("#deleteModal_form").submit(function (e) {
            e.preventDefault();

            const fd = new FormData(this);
            $.ajax({
                url:  bpath + 'rating/delete-position-points-data',
                method: 'post',
                data: fd,
                cache:false,
                contentType: false,
                processData: false,
                dataType: 'json',
                success: function (data) {
                    if (data.status == 'pointsDeleted') {
                        __notif_show(1, "Position Points Successfully Deleted");
                        $('#delete_id').val('');
                        $('#deleteCode').val('');
                        const deleteModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#delete-modal"));
                        deleteModal.hide();
                        fetch_Position_Points();

                    }
                }
            });
        });


}

function onSubmit_function(){

    $("#positionPoint_form").submit(function (e) {
        e.preventDefault();
        let pointsVal = $('#posPoints').val();
        const fd = new FormData(this);

        if($('#save_Points_btn').text() == "Change"){

            if($.isNumeric(pointsVal)){
                $('#posPoints').css('border-color', '');

                $.ajax({
                    url:  bpath + 'rating/edit-position-points',
                    method: 'post',
                    data: fd,
                    cache:false,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    success: function (response) {

                        if(response.status == 200){
                            __notif_show(1, "Points Change Successfully");
                            $('#post_points_id').val('');
                            $('#save_Points_btn').text('Save');
                            $('#add_points_header').text('Add Position Points');
                            $('.pos_points').removeClass('hidden');
                            $('#posPoints').val('');
                            const addPoints_modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#addPoints_modal'));
                            addPoints_modal.hide();
                            fetch_Position_Points();
                        }


                    }
                });

            }else{
                $('#posPoints').css('border-color', '#Ff696c');
            }


        }else{


            let positionVal = $('#point_position').val();

            if ( positionVal!= '') {
                $('#point_positionlbl').addClass('hidden');
                if ($.isNumeric(pointsVal)) {

                    $('#point_position').css('border-color', '');
                    $('#posPoints').css('border-color', '');



                        $.ajax({
                            url:  bpath + 'rating/add-position-points',
                            method: 'post',
                            data: fd,
                            cache:false,
                            contentType: false,
                            processData: false,
                            dataType: 'json',
                            success: function (response) {

                                const selectedOptionValue = $('#point_position').val();

                                $('#positionPoint_form')[0].reset();
                                __notif_show(1, "Points Saved Successfully");
                                fetch_Position_Points();
                                position_pointsS2.trigger('change.select2');

                                if (selectedOptionValue !== null) {
                                    const selectElement = document.getElementById('point_position');

                                    $(selectElement).find('option[value="' + selectedOptionValue + '"]').remove();

                                    $(selectElement).trigger('change');
                                }


                            }
                        });

                }else{
                    $('#posPoints').css('border-color', '#Ff696c');
                }
            }else{
                $('#point_positionlbl').removeClass('hidden');
                $('#point_positionlbl').addClass('text-danger');
                $('#point_positionlbl').css('border-color', '#Ff696c');
                $('#point_positionlbl').text('Please Select Position');


            }
        }

    });

    $('#addCriteriaForm2').submit(function (e) {
        e.preventDefault();

        let positionID = $('#PositionIDp').val();
        const fd = new FormData(this);

        $.ajax({
            url: bpath + 'rating/points-save-criteria',
            method: 'post',
            data: fd,
            caches: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (response) {

                if(response.status === 200){
                    $('#addCriteriaForm2')[0].reset();
                    __notif_show(1, "Data Saved Successfully");

                    $('#critPoints_tbl tbody').empty();
                   fetched_positionCriteriaData(positionID)
                   fetch_Position_Points();
                    fetch_saveCriteria();


                }


            }
        });
    });
}

function onChangefunction(){
    $("#competency_modal2").change(function (e) {
        e.preventDefault();
        if($(this).val() !== ''){

            var selectedOption = $(this).find("option:selected");
            var selectedText = selectedOption.text();
            var selectedPoints = selectedOption.data("com-points");
            var selectedID = selectedOption.attr("value");

            $('#critname_mdl').val(selectedText);
            $('#competency_ID').val(selectedID);
            $('#critpoint_mdl').val(selectedPoints);

        }else{
            $('#critname_mdl').val('');
        }

    });
}

function checkIfNumeric(pointsName, pointsVal) {

    if ($.isNumeric(pointsVal.val())) {

        if (pointsName.val() != '') {
            pointsVal.css('border-color', '');
            pointsName.css('border-color', '');
            return true;
        }else{
            pointsName.css('border-color', '#Ff696c');
            pointsVal.css('border-color', '');
            return false;
        }

    }else {

        if (pointsName.val() != '') {
            pointsName.css('border-color', '');
            pointsVal.css('border-color', '#Ff696c');
        }else{
            pointsName.css('border-color', '#Ff696c');
            pointsVal.css('border-color', '#Ff696c');
        }

        return false;
    }


}

function cancel(){
    $("body").on('click', '#cancelDeleteModal', function () {
        $('#delete_id').val('');
    });
    $("body").on('click', '#btn_cancel', function () {
        $('#addCriteriaForm2')[0].reset();
        $('#critPoints_tbl > tbody').empty();
        $('#saveCriteria_tbl > tbody').empty();

        $('#save_Points_btn').text('Save');
        $('#add_points_header').text('Add Position Points');
        $('.pos_points').removeClass('hidden');
        $('#posPoints').val('');
    });

}

// Percent To Decimal
function percentToDecimal(percentage) {
    return percentage / 100;
}

function enterKeyEvent(){
    $('.InputCriteriaDiv').keypress(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();

            var critID = 0;
            var competency_ID = $('#competency_ID');
            var critName = $('#critname_mdl');
            var critPoint = $('#critpoint_mdl');

            if($('#addCriteriaBTN').text() != 'Change'){

                if (checkIfNumeric(critName, critPoint)) {

                    $('#critPoints_tbl > tbody').append(
                        '<tr>'+


                            '<td>'+
                            '<input type="hidden" value="0" id="critPostionID" name="critPostionID[]">' +
                                    '<input type="hidden" value="'+competency_ID.val()+'" id="competency_ID" name="competency_ID[]">'+
                                    '<input type="hidden" value="'+critID+'" id="critID" name="critID[]">'+
                                    '<input type="hidden" value="'+critName.val()+'" id="critName" name="critName[]">'+
                                    '<a class="critData_row">'+
                                        '<label id="critname_lbl">'+critName.val()+'</label>'+
                                    '</a>'+
                            '</td>'+

                            '<td>'+
                                    '<input type="hidden" value="'+critPoint.val()+'" id="critPoints" name="critPoints[]">'+
                                    '<label id="critPoints_lbl">'+critPoint.val()+'</label>'+
                            '</td>'+


                            '<td>'+
                                    '<a href="javascript:;" class="criteria-remove-table-row"> <i class="fa fa-trash-alt w-4 h-4 mr-2 text-danger"></i></a>'+
                            '</td>'+
                        '</tr>');

                        critName.val('');
                        critPoint.val('');
                        competency_ID.val(0);
                }
            }else{

                _thisrowCritname.val(critName.val());
                _thisrowCritPoint.val(critPoint.val());
                _thisrowCritname_lbl.text(critName.val());
                _thisrowCritPoint_lbl.text(critPoint.val());

                $('#addCriteriaBTN').text('Add')
                critName.val('');
                critPoint.val('');
            }
        }
    });
}










