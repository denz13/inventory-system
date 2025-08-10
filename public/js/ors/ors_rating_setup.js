var temp_adjectival = {GlobalRatingadjectival:[]};
var temp_value = {GlobalRatingvalue:[]};
var temp_description = {GlobalRatingdescription:[]};
var temp_ors_rating_id = {GlobalRatingOrsId:[]};
var temp_ref_id = {GlobalRatingId:'' };
var temp_delete_rating_ref = {GlobalRatingDeleteRefId:''};
var table = '';

$(document).ready(function(){
    bpath = __basepath + "/";

    initializeOrsRating();
    appendOrsRatingData();
    deleteRating();
    cancelOrsSetup();
    //saved the data
    savedOrsRatingData();
    displayOrsRatingSetup();
    //change the status
    triggerOrsStatusChange();
    //display the ors details
    displayOrsDetails();
    //trigger to open the delete modal
    triggerDeleteOrsSetup();
    //delete the data
    removeOrsDetailsSetup();
});

//====================================================Initialize the table============================================//

function initializeOrsRating()
{
    try
    {
        /***/
		 table = $('#ors_dt').DataTable({
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

            // columnDefs:
            //     [
            //         { className: "dt-head-center", targets: [] },
            //     ],
		});
    }catch(error)
    {
        console.log(error.message);
    }
}

//====================================================End of Initialization============================================//

//====================================================BEGIN: Server Side ============================================//

//display the ors rating
function displayOrsRatingSetup()
{
    try
    {
        $.ajax({
            type: 'GET',
            url: bpath + "ors/display/ors/rating-setup",
            data:{_token},

            success:function(response)
            {
                table.clear().draw();

                if(response!==null || response!=='')
                {
                    let data = JSON.parse(response);

                    if(data.length > 0)
                    {
                        $.each(data,function(index,value){
                            let cd = '';

                                cd = `<tr>
                                        <td class="font-semibold">${value.range}</td>
                                        <td class="font-semibold">${value.adjectival_range}</td>
                                        <td>
                                            <div class="form-check form-switch"> <input id="${value.ors_rating_ref}" class="form-check-input btn_change_ors_status ${value.beat}" type="checkbox" data-status="${value.stat}" ${value.activate_icon}>
                                            <label class="form-check-label leading-relaxed text-slate-500 text-xs" for="preorder-active">Click to use the rating scale </label></div>
                                        </td>
                                        <td class="font-semibold ${value.status_color}">${value.status}</td>
                                        <td>
                                            <div class="flex justify-center items-center">
                                            <div id="drop_down_close_rating" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">
                                            <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>
                                            <div class="dropdown-menu w-40 zoom-in tooltip ">
                                                <div class="dropdown-content">
                                                    <button id="${value.ors_rating_ref}" type="button" class="w-full dropdown-item btn_ors_details_setup" data-tw-toggle="modal" data-tw-target="#ors_rating_modal"> <i class="fa-solid fa-pen-to-square text-success mr-2"></i>Details</button>
                                                    <button id="${value.ors_rating_ref}" type="button" class="w-full dropdown-item btn_delete_ors_rating_setup" data-tw-toggle="modal" data-tw-target="#delete-modal-ors-setup"> <i class="fa-solid fa-trash text-danger mr-2"></i>Delete</button>
                                            </div>
                                        </td>
                                    </tr>`;

                                table.row.add($(cd)).draw();
                        });
                    }
                }
            }
        });
    }catch(error)
    {
        console.log(error.message);
    }
}

//get the details of the ors setup
function getOrsDetailsSetup(id)
{
    try
    {
        tr =  $("#ors_rating_setup_tb");
        $.ajax({
            type: "POST",
            url: bpath + "ors/display/detail/rating-setup",
            data: {_token,id},

            beforeSend:function(){
                tr.empty('');
                tr.append(`<tr class="text-center" style="margin-top:-20px"><td class="w-full text-center font-semibold" colspan="8"><i class="fa-solid fa-spinner fa-spin h-4 w-4 text-center mr-2"></i>Loading...</td></tr>`);
             },

            success:function(response)
            {
                if(response!==null || response!=="" )
                {
                    $("#ors_rating_setup_tb").empty();

                    let data = JSON.parse(response);

                    if(data.length > 0)
                    {
                        $.each(data,function(index,value){

                            let cd = '';

                                cd = `<tr id="ors_rating_setup_tr">
                                        <td class="hidden"><label id="ors_rating_id">${value.id}</label></td>
                                        <td><label id="adjectival">${value.ors_adjectival}</label></td>
                                        <td><label id="value">${value.ors_rate}</label></td>
                                        <td style="word-wrap:break-word;"><label id="description">${value.ors_desc}</label></td>
                                        <td>
                                            <button id="btn_remove_ors_rating" class="ml-2" type="button">
                                                <i class="fa fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </td>
                                    </tr>`;

                            $("#ors_rating_setup_tb").append(cd);
                        });
                    }
                }
            }
        });

    }catch(error)
    {
        console.log(error.message);
    }
}

//save the ors setup in the controller
function savedOrsRatingSetup(ref_id,id,adjectival,value,desc)
{
    try
    {
        $.ajax({
            type: 'POST',
            url: bpath + "ors/saved/ors/rating",
            data:{_token,ref_id,id,adjectival,value,desc},

            success:function(response)
            {
                if(response.status === true)
                {
                    displayOrsRatingSetup();
                    $("#ors_rating_form")[0].reset();
                    $('#ors_rating_tb tbody tr').detach();
                    temp_ref_id.GlobalRatingId = null;
                    temp_ors_rating_id.GlobalRatingOrsId =[];
                    temp_adjectival.GlobalRatingadjectival =[];
                    temp_value.GlobalRatingvalue =[];
                    temp_description.GlobalRatingdescription =[];
                    __notif_show(1,'',response.message);

                }else if(response.status === 500)
                {
                    temp_ref_id.GlobalRatingId = null;
                    $("#ors_rating_form")[0].reset();
                    $('#ors_rating_tb tbody tr').detach();
                    __notif_show(-1,'',response.message);
                }
            }
        });
    }catch(error)
    {
        console.log(error.message);
    }
}

//change the ors status
function changeOrsStatus(id,status)
{
    try
    {
        $.ajax({
            type: 'POST',
            url: bpath + "ors/activate/ors/rating-status",
            data:{_token,id,status},
            dataType:'json',

            success:function(response)
            {
                if(response.status === true)
                {
                    displayOrsRatingSetup();
                    __notif_show(1,'',response.message);

                } else
                {
                    __notif_show(-1,'',response.message);
                }
            }
        });
    }catch(error)
    {
        console.log(error.message);
    }
}

//delete the ors rating set up
function deleteOrsRatingSetup(ref_id)
{
    try
    {
        $.ajax({
            type: "POST",
            url: bpath + "ors/delete/ors/rating-setup",
            data:{_token,ref_id},
            dataType:"json",

            success:function(response){

                if(response.status === true)
                {
                    displayOrsRatingSetup();
                    __notif_show(1,'',response.message);
                    temp_delete_rating_ref.GlobalRatingDeleteRefId = '';
                }else
                {
                    __notif_show(-1,'',response.message);
                }
            }
        });

    }catch(error)
    {
        console.log(error);
    }
}
//====================================================BEGIN: Server Side ============================================//

//store the temporary data
function savedTempData()
{
    try
    {
        $("#ors_rating_tb tr").each(function(i){

            let id = $(this).find("td #ors_rating_id").text(),
                adjectival = $(this).find("td #adjectival").text(),
                value = $(this).find("td #value").text(),
                description = $(this).find("td #description").text();

            if(i!='')
            {
                if((temp_adjectival[i] !== adjectival && (temp_value[i] !== value)) && (temp_description[i] !== description) &&(temp_ors_rating_id[i] !== id))
                {
                    temp_ors_rating_id.GlobalRatingOrsId.push(id);
                    temp_adjectival.GlobalRatingadjectival.push(adjectival);
                    temp_value.GlobalRatingvalue.push(value);
                    temp_description.GlobalRatingdescription.push(description);
                }
            }
        });
    }catch(error)
    {
        console.log(error.message);
    }
}

//append the data in the table
function appendOrsRatingData()
{
    $("#btn_add_ors_rating").on("click",function(){
        let adjectival = $("#ors_adjectival").val(),
            rating = $("#ors_rating").val(),
            description = $("#ors_desc").val();

            if(checkInputEmpty("ors_adjectival"))
            {
                if(checkInputEmpty("ors_rating"))
                {
                    if(checkInputEmpty("ors_desc"))
                    {
                        appendOrsRatingDataTable(adjectival,rating,description);
                         $("#ors_rating_form")[0].reset();
                     }
                 }
            }
    });
}

//attach the data input in the table
function appendOrsRatingDataTable(adjectival,value,description)
{
    try
    {
        id = 0;

        let cd = '';

            cd = `<tr id="ors_rating_setup_tr">
                    <td class="hidden"><label id="ors_rating_id">${id}</label></td>
                    <td><label id="adjectival">${adjectival}</label></td>
                    <td><label id="value">${value}</label></td>
                    <td class="flex" style="word-wrap:break-word;"><label id="description">${description}</label></td>
                    <td>
                        <button id="btn_remove_ors_rating" class="ml-2" type="button">
                            <i class="fa fa-trash-alt"></i>
                            </button>
                        </td>
                    </td>
                </tr>`;

        $("#ors_rating_setup_tb").append(cd);

    }catch(error)
    {
        console.log(error.message);
    }
}

//delete the td if the trash is deleted
function deleteRating()
{
    $("body").on("click","#btn_remove_ors_rating",function(){
        $(this).closest('tr').remove();
    });
}

//check the input if its not empty
function checkInputEmpty(id)
{
    try
    {
        let input_id = $('#' + id);

        if(input_id.val().trim() != '' )
        {
            input_id.removeClass('border border-danger');
            return true;
        } else
        {
            input_id.addClass('border border-danger');
            return false;
        }
    }catch(error)
    {
        console.log(error.message);
    }
}

//saved the ors rating data setup
function savedOrsRatingData()
{
    $("#btn_save_ors_setup").on("click",function(){
        savedTempData();
        savedOrsRatingSetup(temp_ref_id.GlobalRatingId,temp_ors_rating_id.GlobalRatingOrsId,temp_adjectival.GlobalRatingadjectival,temp_value.GlobalRatingvalue,temp_description.GlobalRatingdescription);
    });
}

//clear the fields when the cancel button is click
function cancelOrsSetup()
{
    $("#btn_cancel_ors_setup").on("click",function(){
        $("#ors_rating_form")[0].reset();
        $('#ors_rating_tb tbody tr').detach();
        temp_ref_id.GlobalRatingId = null;
        temp_ors_rating_id.GlobalRatingOrsId =[];
        temp_adjectival.GlobalRatingadjectival =[];
        temp_value.GlobalRatingvalue =[];
        temp_description.GlobalRatingdescription =[];
    });
}

//change the status of the onclick
function triggerOrsStatusChange()
{
        $("body").on("click",".btn_change_ors_status",function(){

            let id = $(this).attr("id"),
                stat = $(this).data("status");

            let isChecked = $(this).prop('checked');


            if(isChecked)
            {
                changeOrsStatus(id,stat);

            } else
            {
                changeOrsStatus(id,stat);
            }
        });
}

//click the button for the update
function displayOrsDetails()
{
   $("body").on("click",".btn_ors_details_setup",function(){
        let id = $(this).attr('id');
        temp_ref_id.GlobalRatingId = id;
        getOrsDetailsSetup(id);
   });
}

//trigger to display the delete
function triggerDeleteOrsSetup()
{
    $("body").on("click",".btn_delete_ors_rating_setup",function(){
        let id = $(this).attr('id');
        temp_delete_rating_ref.GlobalRatingDeleteRefId = id;
    });
}

//delete the rating setup
function removeOrsDetailsSetup()
{
    $("#btn_delete_ors_setup").on("click",function(){
        deleteOrsRatingSetup(temp_delete_rating_ref.GlobalRatingDeleteRefId);
    });
}
