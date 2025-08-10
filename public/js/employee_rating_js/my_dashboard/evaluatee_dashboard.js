var  _token = $('meta[name="csrf-token"]').attr('content'),evalauteeDashboardTable = '';
var receivedId = {globalReceivedId:''},receivedRefId = {globalReceivedRefID: ''};
var groupColumn = '';
var ratingStat = {globalRatingStat:''};
const receivedModal = {globalRecievedModal:tailwind.Modal.getInstance(document.querySelector("#received_modal"))};

$(document).ready(function(){

    bpath = __basepath + "/";

    //count the documents whether pending,rated
    getdocumentsCount();


    load_RequestList();
    loadFilterEvaluatee();
    evaluatorRequest();
    open_receivedModal();
    receivedRequest();
    getrequestList();
    clickHeader();

    getEvaluteeFilterStat();
});


/*initialize the select2*/
function loadFilterEvaluatee()
{
    $("#filterEvaluateeStat").select2({
        placeholder: "Select filter status",
        closeOnSelect: true,
    });
}

//**=============================================**//
/*initialize the datatable*/
function load_RequestList()
{
    try{
		/***/
       // Define the groupColumn and Month variables here
       groupColumn = 3; // Replace with the index of the column to group by
       var Month = 3; // Replace with the index of the Month column

       evalauteeDashboardTable = $('#tbl_evaluatee_dashboard').DataTable({
           dom:
               "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
               "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
               "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
           renderer: 'bootstrap',
           "info": false,
           "bInfo": true,
           "bJQueryUI": true,
           "bProcessing": true,
           "bPaginate": true,
           "aLengthMenu": [[10, 25, 50, 100, 150, 200, 250, 300, -1], [10, 25, 50, 100, 150, 200, 250, 300, "All"]],
           "iDisplayLength": 10,
           "aaSorting": [],
           // Your columnDefs and other configuration options go here
           columnDefs: [{ visible: false, targets: Month }],
           order: [[Month, 'asc']],
           drawCallback: function (settings) {
               var api = this.api();
               var rows = api.rows({ page: 'current' }).nodes();
               var last = null;

               api.column(groupColumn, { page: 'current' })
                   .data()
                   .each(function (group, i) {
                       if (last !== group) {
                           // Update the colspan value to match the number of columns
                           $(rows)
                               .eq(i)
                               .before(
                                   '<tr class="group text-center font-meduim text-primary text-lg"><td colspan="7">' +
                                   group +
                                   '</td></tr>'
                               );

                           last = group;
                       }
                   });
           },
           // Custom classes for DataTable elements
           "sDom": '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
           "sPaginationType": "full_numbers",
		});
	}catch(err){
        console.log(err);
     }
}

/**Click the header **/
function clickHeader()
{
    $('#tbl_getRequestList').on('click', 'tr.group', function () {
        var currentOrder = evalauteeDashboardTable.order()[0];
        if (currentOrder[0] === groupColumn && currentOrder[1] === 'asc') {
            evalauteeDashboardTable.order([groupColumn, 'desc']).draw();
        }
        else {
            evalauteeDashboardTable.order([groupColumn, 'asc']).draw();
        }
    });
}

//**=============================================**//
//recieve the request send by the admin
function evaluatorRequest()
{
    $("#message_received").empty();

    $.ajax({
        url: bpath + "employee_ratings/load/evaluator/request/",
        type: "GET",
        data:{_token},

        success:function(response)
        {
            if(response!=='')
            {
                let data =  JSON.parse(response);

                if(data.length > 0)
                {
                    for(let x=0;x<data.length;x++)
                    {
                        let id = data[x]["id"],
                            refId = data[x]["refId"],
                            createdByImage = data[x]["createdByImage"],
                            createdBy = data[x]["createdBy"],
                            evaluatee = data[x]["evaluatee"],
                            message = data[x]["message"],
                            created_at = data[x]["created_at"];

                    const cd = `
                            <div id="${id}" class="intro-x btn_received_request" data-refference="${refId}"  data-messages="${message}" data-tw-toggle="modal" data-tw-target="#received_modal">
                                <div id="" class="box  px-5 py-3 mb-2 flex items-center zoom-in">
                                    <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden tooltip" title="${createdBy}">
                                        <img alt="Midone - HTML Admin Template" src="${createdByImage}">
                                    </div>
                                    <div class="ml-4 mr-auto">
                                        <div class="font-medium">${evaluatee}</div>
                                        <div class="text-slate-500 text-xs mt-0.5">${message}</div>
                                    </div>
                                    <div class="text-slate-500 text-xs fs_c_4">${created_at}</div>
                                </div>
                            </div>`;

                        $("#message_received").append(cd);
                    }
                }
            } else
            {
                {
                    const cd = `
                    <div id="" class="intro-x btn_received_request" data-refference=""  data-messages="" data-tw-toggle="modal" data-tw-target="#received_modal">
                        <div id="" class="box  px-5 py-3 mb-2 flex items-center zoom-in">
                            <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden tooltip" title="No data found">
                                <i class="fa-solid fa-box-tissue fa-bounce w-full h-5 text-pending"></i>
                            </div>
                            <div class="ml-4 mr-auto">
                                <div class="font-medium">No task is detected</div>
                                <div class="text-slate-500 text-xs mt-0.5">No recent task</div>
                            </div>
                            <div class="text-slate-500 text-xs fs_c_4"></div>
                        </div>
                    </div> `;

                    $("#message_received").append(cd);
                }
            }
        }
    });
}

//**=========================================================================== **/

//trigger the update of the status in the database
function updateRequestStatus(id,refId,message)
{
    $.ajax({
        url: bpath + "employee_ratings/update/request/status",
        type: "POST",
        data: {_token,id,refId,message},
        dataType:"json",

        success:function(response)
        {
            if(response.status === true)
            {
                __notif_show(1,'',response.message);
                getrequestList();
            }
            else
            {
                __notif_show(-1,'',response.message);
            }
        }

    });
}

//trigger the click event to show the recieve modal
function open_receivedModal()
{
    $("body").on("click",".btn_received_request",function(){
        let id = $(this).attr("id"),
            requestRefId = $(this).data("refference"),
            messages = $(this).data("messages");

            receivedId.globalReceivedId = id;
            receivedRefId.globalReceivedRefID = requestRefId;

        $("#message_request_content").val(messages);
    })
}

//trigger the uodate of the status
function receivedRequest()
{
    $("#btn_received_request").on("click",function(){

        let message = $("#rating_instruction").val();

        updateRequestStatus(receivedId.globalReceivedId,receivedRefId.globalReceivedRefID,message);
        receivedModal.globalRecievedModal.hide();
        evaluatorRequest(ratingStat.globalRatingStat);
    });
}

/**======================================================================================================**/

function getrequestList(ratingStat)
{
    $.ajax({
        url:  bpath + "employee_ratings/load/request/list",
        type: "POST",
        data: {_token,ratingStat},

        success:function(response)
        {
            evalauteeDashboardTable.clear().draw();

            if(response!=='')
            {
                let data = JSON.parse(response);

                if(data.length > 0)
                {
                    for(let x=0;x<data.length;x++)
                    {
                        let stat = '',
                            lock = '';

                        const rating_id = data[x]["rating_id"],
                              survey_refid = data[x]["survey_refid"],
                              agencyId = data[x]["agencyId"],
                              evaluateedBy = data[x]["evaluateedBy"],
                              fullDept = data[x]["fullDept"],
                              name = data[x]["empName"],
                              image = data[x]["image"],
                              title = data[x]["title"],
                              fullTitle = data[x]["fullTitle"],
                              dateRecieved = data[x]["updated_at"],
                              department = data[x]["dept"],
                              month = data[x]["month"],
                              status = data[x]["status"];

                              if(status === '10')
                              {
                                stat = 'Pending';
                                color = 'text-pending';
                                icon = '<i class="fa fa-pen-nib"></i>';
                                lock = 'visible';

                              } else if(status === '18')
                              {
                                stat = 'Rated';
                                color = 'text-success';
                                icon = '<i class="fa-solid fa-pen-to-square"></i>';
                                lock = 'hidden';
                              }

                        const cd = `
                                    <tr class="inbox__item intro-x bg-white hover:bg-gray-100 transition duration-150 ease-in-out">
                                    <td><div class="flex items-center">
                                        <div class="w-9 h-9 image-fit zoom-in">
                                            <img alt="Midone - HTML Admin Template" class="rounded-lg border-white shadow-md tooltip" data-action="zoom" src="${image}">
                                                </div>
                                                    <div class="ml-4 mr-auto">
                                                        <div class="font-medium">${name}</div>
                                                    <div class="text-slate-800 text-xs mt-0.5 normal-case"></div>
                                                </div>
                                        </div>
                                    </td>
                                    <td class="tooltip fs_c_4" title="${fullTitle}" >${title}</td>
                                    <td class="tooltip fs_c_4" title="${fullDept}">${department}</td>
                                    <td>${month}</td>
                                    <td class="fs_c_4">${dateRecieved}</td>
                                    <td class="fs_c_4 font-semibold">${evaluateedBy}</td>
                                    <td class="fs_c_4 ${color}">${stat}</td>
                                    <td>
                                        <div class="flex justify-center items-center">
                                        <a id="" href="" target="_blank"  class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 mr-2 text-slate-400 zoom-in tooltip btn_evaluatee_ratee" title="print"><i class="icofont-print"></i></a>
                                            <a id="${survey_refid}" href="/employee_ratings/load/evaluatee/information-page/${rating_id}/${agencyId}/${survey_refid}" target="_blank"  class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 mr-2 text-slate-400 zoom-in tooltip btn_evaluatee_ratee" title="Rate">${icon}</a>
                                        </div>
                                    </td>

                                   </tr>`;

                                   evalauteeDashboardTable.row.add($(cd)).draw();
                    }
                }
            }
        }
    });
}

// href="/employee_ratings/load/evaluatee/information-page/${rating_id}/${agencyId}/${survey_refid}"

/**======================================================================================================**/

/*responsible for the filtration of status in the rating*/
function getEvaluteeFilterStat()
{
    $("#filterEvaluateeStat").on("select2:select",function(){
        let stat = $("#filterEvaluateeStat").val();

        ratingStat.globalRatingStat = stat;

        getrequestList(ratingStat.globalRatingStat);
    });
}

/**======================================================================================================**/
//responsible for getting the data in the database and appending in the table
// function retrieveEvaluateeRatingData(refId)
// {
//     try {
//         $.ajax({
//             type: "POST",
//             url: bpath + "employee_ratings/get/evaluatee/rating/result",
//             data: {_token,refId},

//             success:function(response)
//             {
//                 alert(response);
//                 if(response!==null || response!=='')
//                 {
//                     let data = JSON.parse(response);

//                     if(data.length>0)
//                     {
//                         for(let x=0;x<data.length;x++)
//                         {
//                             let question_id = data[x]["question_id"],
//                                 rating_id =data[x]["rating_id"];

//                             console.log("Question ID:" + question_id,
//                                 "Rating value:" + rating_id);
//                         }
//                     }
//                 }
//             }

//         });

//     } catch (error) {
//             __notif_show(-1,'',"An error occurred" + error.message);
//     }
// }


//reponsible for the appedning the data for the update of the evaluation of the ratee

// function getEvaluateeRatingData()
// {
//     $("body").on("click",".btn_evaluatee_ratee",function(){

//         let refferenceId = $(this).attr("id");
//         // retrieveEvaluateeRatingData(refferenceId);
//     });
// }


/**======================================================================================================**/
//display the total number of documents significantly pending documents
function getdocumentsCount()
{
    $.ajax({
        type: "GET",
        url: bpath + 'employee_ratings/count/pending/documents',
        data:{_token},
        dataType: "json",

        success:function(response)
        {
            console.log(response.pendingRequest);

            if(response.status === true)
            {
                $("#pending_docuemnts").text(response.pendingRequest);
                $("#survey_rated").text(response.countSurveyRated);
                $("#rated_survey").text(response.countRatedSurvey);
            }
        }
    });
}
