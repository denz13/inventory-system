var  _token = $('meta[name="csrf-token"]').attr('content');
var ors_id = {GlobalOrsid:''};
var stat = {OrsStatus:''};
var filter_date_from = '';
var starting_date = {GetStartingDate:''};
var start_end = {GetEndDate:''};
var filter_page_size = {GLobalPageSize:''};
var handle_page_num = {GlobalPageNum:''};
var stat = {FilterStatus:''};


const delete_multiple_ors_task = tailwind.Modal.getInstance(document.querySelector("#multiple-delete-modal-ors"));
const Printdown = tailwind.Dropdown.getOrCreateInstance(document.querySelector("#btn_close_print_drpdown"));

$(document).ready(function(){

    bpath = __basepath + "/";

    initialDatePicker();
    initializeSelect2();
    displayOrsTask();
    /**/
    displayOrsDetails();
    moreOptions();
    clickInput();
    cancelRequest();
    deleteOrsList();
    /**/
    deleteFile();
    deleteFile();
    /**/
    filterDateForm();
    filterOrsStatus();
    filterpageSize();
    /**/
    previousLinkClick();
    //empty the date
    $("#filter_date_from").val('');
    /**/
    printTask();
    checkRater();
    closeDropdown();
    changeDiscription();
});

//====================================================BEGIN: Initialization ============================================//

/*Lite picker initialization*/
function initialDatePicker()
{
    let element_id = 'filter_date_from';


    filter_date_from = new Litepicker({
        element: document.getElementById(element_id),
        autoApply: false,
        singleMode: false,
        numberOfColumns: 2,
        numberOfMonths: 2,
        showWeekNumbers: false,
        startDate: new Date(),
        format: 'MMM DD, YYYY ',
        allowRepick: true,
        dropdowns: {
            minYear: 1950,
            maxYear: 2100,
            months: true,
            years: true
        }
    });
}

/*Initialize the select2*/
function initializeSelect2()
{
    $('#filter_ors_manage_stat').select2({
        placeholder: "Status",
        closeOnSelect: true,
    });
}
//====================================================BEGIN: Server-side ============================================//

/*display the task*/
function displayOrsTask(pageSize,page,startDate,endDate,status)
{
    try
    {
        let tr = $("#ors_task_tb");

        $.ajax({
            type: "GET",
            url: bpath + 'ors/display/task?page='+page,
            data: {_token,pageSize,
                    startDate,endDate,
                    status},

            beforeSend:function(){
                    tr.empty('');
                    tr.append(`<tr id="loading-row" class="">
                                    <td colspan="8" class="w-full text-center">
                                        <div class="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center py-1">
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
                                </tr>`);
            },

            success:function(response)
            {
                if(response.data !== null || response.data !== '')
                {
                    $("#ors_task_tb").empty();

                    let data = response.data;

                    if(data.length > 0)
                    {
                        let ors_task_details = $(".ors_task_tb");

                        $.each(data, function(index,value){

                            let cd = `
                                    <tr id="task_details" class="task_details" style="cursor:pointer" data-ors_id = '${value.id}' data-disabled='${value.disabled}'>
                                        <td hidden>${value.id}</td>
                                        <td ><button> <i class="fa-solid fa-circle-chevron-left text-success w-4 h-4"></i> </button></td>
                                        <td class="ors_checked"><input id="checked_ors_task" class="form-check-input checked_ors_task" type="checkbox" value="${value.timestamp_id}" ${value.lock}></td>
                                        <td class="w-auto whitespace-nowrap">${value.task}</td>
                                        <td class="w-auto text-center whitespace-nowrap  text-normal text-slate-500 font-bold">${value.accomplish_date}</td>
                                        <td class="w-auto whitespace-nowrap text-center">
                                            <span class="text-normal ml-1 text-slate-500  font-medium">${value.category}</span>
                                        </td>
                                        <td class="whitespace-nowrap text-center">${value.status}</td>
                                        <td id="btn_action" class="w-auto">
                                            <div class="flex justify-center items-center">
                                                <div class="w-8 h-8 flex items-center justify-center ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">
                                                    <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>
                                                    <div class="dropdown-menu w-40 zoom-in tooltip">
                                                        <div class="dropdown-content">
                                                            ${value.cancel}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr id="ors_child_info" class="ors_child_info" style="background-color:#eef2f6" hidden>
                                            <td colspan="8">
                                                    <div class="intro-y grid grid-cols-11 gap-5 mt-5">
                                                        <div class="col-span-12 lg:col-span-4 2xl:col-span-3">
                                                            <div class="box p-5 rounded-md">
                                                                <div class="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                                                                    <div class="font-medium text-base truncate">Evaluators Details</div>
                                                                </div>
                                                                    <div class="flex flex-1 lg:justify-start">
                                                                        <div class="w-20 h-20 sm:w-20 sm:h-20 flex-none image-fit rounded-full overflow-hidden">
                                                                            <img alt="Midone - HTML Admin Template" class="rounded-full" src="${value.src}">
                                                                        </div>
                                                                        <div class="mt-2 ml-5">
                                                                            <div class="w-24 sm:w-40 truncate sm:whitespace-normal font-medium">${value.rater}</div>
                                                                            <div class="text-slate-500">${value.rater_pos}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="flex items-center mt-5">
                                                                            <span class="font-semibold">Comment:</span>
                                                                            <div class="leading-relaxed text-slate-500 font-semibold ml-2" style="text-align:justify; text-justify:auto; word-break: break-all">
                                                                            ${value.comment}
                                                                            </div>
                                                                    </div>
                                                                    <div class="flex items-center mt-1 font-semibold">
                                                                            Date Rated:
                                                                            <span class="ml-2 leading-relaxed text-slate-500">${value.date_rated}</span>
                                                                    </div>
                                                                    <div class="flex items-center mt-1">
                                                                            <span class="font-semibold">Status:</span>
                                                                            ${value.status}
                                                                    </div>
                                                                    <div class="accordion mt-2 intro-y">
                                                                        <div class="accordion-item">
                                                                                <div id="faq-accordion-content-2" class="accordion-header">
                                                                                    <button class="accordion-button collapsed text-center font-semibold" type="button" data-tw-toggle="collapse" data-tw-target="#faq-accordion-collapse-2" aria-expanded="false" aria-controls="faq-accordion-collapse-2">
                                                                                        View Rating
                                                                                    </button>
                                                                                </div>
                                                                                <div id="faq-accordion-collapse-2" class="accordion-collapse collapse" aria-labelledby="faq-accordion-content-2" data-tw-parent="#faq-accordion-1">
                                                                                    <div class="accordion-body text-slate-600 dark:text-slate-500 leading-relaxed">
                                                                                    <table class="table table-report hover">
                                                                                        <thead>
                                                                                            <tr class="text-center">
                                                                                                <th class="whitespace-nowrap">Criteria</th>
                                                                                                <th class="whitespace-nowrap">Rating</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody class="adjectival_list_tb">
                                                                                        </tbody>
                                                                                    </table>
                                                                                    </div>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-span-12 lg:col-span-4 2xl:col-span-8">
                                                            <div class="box p-5 rounded-md">
                                                                <div class="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                                                                    <div class="font-medium text-base truncate">ORS Details</div>
                                                                </div>
                                                                <div class="items-center mt-2">
                                                                        <div class="intro-y flex flex-col sm:flex-row items-center">
                                                                            <span class="ml-4 font-semibold">Task</span>
                                                                            <span class="font-semibold ml-auto mr-2">Accomplish Date:</span>
                                                                            <span class="leading-relaxed text-slate-500 font-semibold">${value.accomplish_date}</span>
                                                                        </div>
                                                                        <div class="ml-4 mt-2 leading-relaxed text-slate-500 truncate sm:whitespace-normal">
                                                                            ${value.task_detail}
                                                                        </div>
                                                                            <div class="accordion col-span-12 sm:col-span-8 mt-6">
                                                                                <div class="accordion-item">
                                                                                    <div id="faq-accordion-content-1" class="accordion-header"> <button class="ml-4 accordion-button font-semibold" type="button" data-tw-toggle="collapse" data-tw-target="#faq-accordion-collapse-1" aria-expanded="true" aria-controls="faq-accordion-collapse-1"> Attachment <span class="ml-1"><i class="fa-solid fa-file text-primary"></i></span></button> </div>
                                                                                        <div id="faq-accordion-collapse-1" class="accordion-collapse collapse show" aria-labelledby="faq-accordion-content-1" data-tw-parent="#faq-accordion-1">
                                                                                            <div class="accordion-body text-slate-600 dark:text-slate-500">
                                                                                                <div id="ors_file_list" class="intro-y grid grid-cols-12 gap-4 sm:gap-6 ors_file_list">
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                    </div>
                                                            </div>
                                                    </div>
                                            </td>
                                        </tr>`;

                                ors_task_details.append(cd);
                        });

                    } else
                    {
                        tr.empty('');
                        tr.append(`<tr class="text-center" style="margin-top:-20px"><td class="w-full text-center font-semibold" colspan="8">No data found</td></tr>`);
                    }
                }

                const current_page = response.current_page,
                    has_page = response.has_page,
                    first_page = response.first_page,
                    previous_url = response.previous_url,
                    has_morepages = response.has_morepages,
                    next_page_url = response.next_page_url,
                    link = response.link;

                //render the pagination page
                renderPagination(current_page,has_page,first_page,previous_url,has_morepages,next_page_url,link.links);

            }
        });

    }catch(error)
    {
        __notif_show(-1,'',error.message);
    }
}


/*fetch the rating adjectival*/
function fetchAdjectivalRating(id)
{
    try
    {
        $.ajax({
            type:"POST",
            url: bpath + "ors/fetch/rating/details",
            data:{_token,id},

            success:function(response)
            {
                if(response!==null || response!=='')
                {
                    $(".adjectival_list_tb").empty();

                    let data = JSON.parse(response);
                    let temp_data = [];

                    if(data.length > 0)
                    {
                        $.map(data,function(value){

                        let cd = '';

                        cd = `<tr class="text-center">
                                    <td class="ml-4 font-semibold ">${value.adjectival}</td>
                                    <td>
                                        ${value.rate_val}
                                    </td>
                                </tr>`;

                            $(".adjectival_list_tb").append(cd);

                        });
                    }
                }
            }
        });
    }catch(error)
    {
        // <div class="text-xs text-slate-500 ml-1">(4.5+)</div>
        console.log(error.message);
    }
}

/*Display the attachment in the list*/
function displayAttachmentList(id,stat)
{
    try
    {
        let tr = $(".ors_file_list");

        $.ajax({
            type:'GET',
            url: bpath + "ors/display/attachment",
            data:{_token,id},

            beforeSend:function(){
                tr.empty();
                tr.append(`<div class="text-center col-span-12" style="margin-top:-20px">
                                    <div class="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center py-1">
                                        <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8">
                                            <circle cx="15" cy="15" r="15">
                                                <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
                                                <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
                                            </circle>
                                            <circle cx="60" cy="15" r="9" fill-opacity="0.3">
                                                <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate>
                                                <animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate>
                                            </circle>
                                            <circle cx="105" cy="15" r="15">
                                                <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
                                                <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
                                            </circle>
                                        </svg>
                                    </div>
                            </div>`);
            },

            success:function(response)
            {
                tr.empty('');

                if(response !=='' || response !== null )
                {
                    let data = JSON.parse(response);

                    if(data.length > 0)
                    {
                        let vv = "vv",
                            df = "df";

                        $(".ors_file_list").empty();

                        $.each(data,function(index,attachment){

                            let path =  attachment.file.split('_');

                                let cd = '';

                                    cd = `<div class="intro-y">
                                                <div class="file box  rounded-md px-5 pt-8 pb-2 px-3 sm:px-5 relative zoom-in w-20">
                                                    <a target="_blank" href="/ors/view/attachment/file/${id}/${attachment.file}/${vv}" class="mx-auto py-2">
                                                        <img class="rounded-md image-fit" src="${attachment.file_type}"></img>
                                                    </a>
                                                    <a target="_blank" href="/ors/view/attachment/file/${id}/${attachment.file}/${vv}" class="block font-medium mt-2 text-xs text-center truncate"> ${path[1]} </a>
                                                        <div class="absolute top-0 right-0 mr-2 mt-3 dropdown ml-auto pb-5 ${stat}">
                                                            <a class="dropdown-toggle w-5 h-5 block pb-4" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="w-3 h-3 text-slate-500 fa-solid fa-ellipsis"></i></a>
                                                            <div class="dropdown-menu w-40">
                                                                <ul class="dropdown-content">
                                                                    <li>
                                                                        <a target="_blank" href="/ors/view/attachment/file/${id}/${attachment.file}/${vv}" class="dropdown-item dropdown-item px-2 text-xs cursor-pointer font-medium">
                                                                            <i class="fa fa-eye dark:text-slate-500 w-4 h-4 text-success mr-2"></i> View
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a target="_blank" href="/ors/view/attachment/file/${id}/${attachment.file}/${df}" class="dropdown-item dropdown-item px-2 text-xs cursor-pointer font-medium">
                                                                            <i class="fa fa-download w-4 h-4 text-success mr-2"></i>Download
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <button id="${id}" class="dropdown-item dropdown-item px-2 text-xs cursor-pointer font-medium btn_delete_attachment w-full" data-ors_file="${attachment.file}">
                                                                            <i class="fa-solid fa-trash text-danger text-danger mr-2"></i>Delete
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                </div>
                                        </div>`;

                                $(".ors_file_list").append(cd);
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

/*delete the request*/
function deleteTask(id)
{
    try
    {
        $.ajax({
            type:'DELETE',
            url: bpath + 'ors/cancel/request',
            data:{_token,id},
            dataType:'json',

            success:function(response)
            {
                if(response.status === true)
                {
                    displayOrsTask(filter_page_size.GLobalPageSize,'',starting_date.GetStartingDate,start_end.GetEndDate,stat.FilterStatus);
                    __notif_show(1,'',response.message);

                } else
                {
                    __notif_show(-1,'',response.message);
                }
            }

        });

    }catch(error)
    {
        __notif_show(-1,'',error.message);
    }
}

/*delete multiple request*/
function multipleDeleteTask(id)
{
    try
    {
        $.ajax({
            type: 'DELETE',
            url: bpath + 'ors/multiple/cancel/request',
            data:{_token,id},
            dataType: 'json',

            success:function(response)
            {
                if(response.status === true)
                {
                    displayOrsTask(filter_page_size.GLobalPageSize,'',starting_date.GetStartingDate,start_end.GetEndDate,stat.FilterStatus);
                    __notif_show(1,'',response.message);
                    $("#td_trash").hide();
                } else
                {
                    __notif_show(1,'',response.message);
                }
            }
        });

    }catch(error)
    {
        __notif_show(-1,'',error.message);
    }
}

/*Delete attachment list*/

function deleteAttachment(id,file)
{
    try
    {
        $.ajax({
            type:'POST',
            url: bpath + 'ors/delete/attachment',
            data:{_token,id,file},
            dataType:'json',

            success:function(response)
            {
                if(response.status === true)
                {
                    displayAttachmentList(ors_id.GlobalOrsid,stat.OrsStatus);
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

//====================================================END: Server-side ============================================//



//====================================================BEGIN: Pagination link of a table ============================================//
/*Render the pagination link*/
function renderPagination(current_page,has_page,first_page,previous_url,has_morepages,next_page_url,page_links)
{
    try
    {
        if(has_page)
        {
            $('.pagination').empty();

            let pagination_link = $('.pagination');

                //check the previous link
                if(first_page)
                {
                    pagination_link.append( `<li class="page-item disabled" aria-disabled="true" aria-label="@lang('pagination.previous')">
                                                <span class="page-link" aria-hidden="true">
                                                    <i class="w-4 h-4 fa-solid fa-chevron-left"></i>
                                                </span>
                                            </li>`);
                } else
                {
                    pagination_link.append(  `<li class="page-item">
                                                <button  id="btn_previous" class="page-link paginated" href="${previous_url}">
                                                    <i class="w-4 h-4 fa-solid fa-chevron-left"></i>
                                                </button>
                                            </li>`);
                }

               // Create a pagination list
                $.each(page_links, function(index, link) {
                    if (index === current_page) {
                        pagination_link.append(`<li class="page-item active" aria-current="page">
                                                    <span class="page-link">${link.label}</span>
                                                </li>`);
                    } else if (link.label !== "&laquo; Previous" && link.label !== "Next &raquo;") {
                        if (index <= 3 || index >= page_links.length - 2 || (index >= current_page - 1 && index <= current_page + 1)) {
                            pagination_link.append(`<li class="page-item">
                                                        <button class="page-link paginated_num" href="${link.url}">${link.label}</button>
                                                    </li>`);
                        } else if (index === 4 && current_page > 3) {
                            pagination_link.append(`<li class="page-item disabled">
                                                        <span class="page-link">...</span>
                                                    </li>`);
                        }
                    }
                });


                //check the next link
                if(has_morepages)
                {
                    pagination_link.append( `<li class="page-item">
                                                <button id="btn_next" class="page-link paginated" href="${next_page_url}">
                                                    <i w-4 h-4 class="fa-solid fa-chevron-right"></i>
                                                </button>
                                            </li>`);
                } else
                {
                    pagination_link.append( `<li class="page-item disabled" ">
                                                <span class="page-link" aria-hidden="true">
                                                    <i class="w-4 h-4 fa-solid fa-chevron-right"></i>
                                                </span>
                                            </li>`);
                }
        }

    }catch(error)
    {
        console.log(error.message);
    }
}

function previousLinkClick()
{
    //click the previous and next link
    $("body").on("click",".paginated",function(){
        handle_page_num.GlobalPageNum = $(this).attr('href').split('page=')[1];
        displayOrsTask(filter_page_size.GLobalPageSize,handle_page_num.GlobalPageNum,starting_date.GetStartingDate,start_end.GetEndDate,stat.FilterStatus);
    });

    //click the paginated number
    $("body").on("click",".paginated_num",function(){
        handle_page_num.GlobalPageNum = $(this).attr('href').split('page=')[1];
        displayOrsTask(filter_page_size.GLobalPageSize,handle_page_num.GlobalPageNum,starting_date.GetStartingDate,start_end.GetEndDate,stat.FilterStatus);
    });
}

//====================================================BEGIN: Pagination link of a table ============================================//

//====================================================Begin: Filter date  ============================================//

//add a leading zero on single date
function pad(number) {
    return (number < 10 ? '0' : '') + number;
}

//function extract the date
function getDateFormat(date)
{
    try
    {
        let year = date.getFullYear(),
            month = pad(date.getMonth()+1),
            day = pad(date.getDate().toString());

        date  = year+'-'+month+'-'+day;

        return date;

    }catch(error)
    {
        console.log(error.message);
    }
}

//get the selected from
function filterDateForm()
{
    filter_date_from.on('selected',function(date){
       // Get the selected date
        let convert_start_date = '',
            convert_end_date = '';
        //extract the date from the calendar
        const start_date = filter_date_from.getStartDate('YYYY-MM-DD'),
            end_date = filter_date_from.getEndDate('YYYY-MM-DD');

        starting_date.GetStartingDate = getDateFormat(start_date);
        start_end.GetEndDate = getDateFormat(end_date);

        displayOrsTask(filter_page_size.GLobalPageSize,'',starting_date.GetStartingDate,start_end.GetEndDate,stat.FilterStatus);
    });
}

//====================================================BEGIN: Click Event ============================================//
//filter the status of the manage task
function filterOrsStatus()
{
    $('#filter_ors_manage_stat').on('select2:select', function (e) {
        let val = $(this).val();

        stat.FilterStatus = val;

        displayOrsTask(filter_page_size.GLobalPageSize,handle_page_num.GlobalPageNum,starting_date.GetStartingDate,start_end.GetEndDate,stat.FilterStatus);
      });
}

//filter the size of tthe data to display
function filterpageSize()
{
    $("#manage_ors_filter_size").on("change",function(){
        filter_page_size.GLobalPageSize = $(this).val();
        displayOrsTask(filter_page_size.GLobalPageSize,handle_page_num.GlobalPageNum,starting_date.GetStartingDate,start_end.GetEndDate,stat.FilterStatus);
    });
}

//display the child info when the tr is click
function displayOrsDetails()
{
    $("body").on("click", ".task_details", function() {

        // Find the .ors_child_info element within the closest tr relative to the clicked button
        let clickedRow = $(this).next('.ors_child_info');

        //get the value of the data attribute
        ors_id.GlobalOrsid = $(this).data('ors_id');
        stat.OrsStatus = $(this).data('disabled');

        //iterate all the tr to check for open tr
        $('.ors_child_info').each(function(){
            if($(this).is(':visible') && !$(this).is(clickedRow))
            {
                $(this).hide();
            }
        });

        // Toggle visibility for the .ors_child_info element within the clicked row
        clickedRow.toggle();

        //append the attachment in the list
        displayAttachmentList(ors_id.GlobalOrsid,stat.OrsStatus);

        //append the rating details of the task
        fetchAdjectivalRating(ors_id.GlobalOrsid);
    });
}

//stop the tr to show when the action is click

function moreOptions()
{
    $("body").on("click","#btn_action",function(event){
        event.stopPropagation();
    });
}

//trigger to cancel request

function cancelRequest()
{
    $("body").on("click",".btn_cancel_request",function(){

        let id = $(this).attr('id');
        deleteTask(id);
        //close the drop down button
        __dropdown_close(".btn_cancel_request");
    });
}

//stop the tr to show when the input is checked

function clickInput()
{
    $("body").on("click",".ors_checked" ,function(event){
            event.stopPropagation();

            if($(".checked_ors_task").is(':checked'))
            {
                $("#td_trash").show();
            } else
            {
                $("#td_trash").hide();
            }
    });
}

//get the data id in the checklist

function getCheckedlistId()
{
    let temp_data = [];

    $("#ors_tb tr").each(function(i){
        $(this).find("td #checked_ors_task").each(function(){
            if($(this).prop("checked")){
                val = $(this).val();
                temp_data.push(val);
            };
        });
    });

    return temp_data;
}

//trigger to delete when the checkinput is click

function triggerDeleteOrsList()
{
    $("#btn_delete_trash").on("click",function(){



        // multipleDeleteTask(temp_id)
    });
}

//delete the ors task list

function deleteOrsList()
{
    $("#btn_multiple_delete_ors").on("click",function(){
        let temp_id = getCheckedlistId();
        multipleDeleteTask(temp_id);
        delete_multiple_ors_task.hide();
    });
}

//delete the attachment
function deleteFile()
{
    try
    {
        $("body").on("click",".btn_delete_attachment",function(){

            id = $(this).attr("id");
            file = $(this).data("ors_file");

            deleteAttachment(id,file);
        });
    }catch(error)
    {
        console.log(error.message);
    }
}

//====================================================END: Click Event ============================================//

//====================================================BEGIN: Print Event ============================================//

/*Check request esig*/
function checkRequestEsig(requested,type,start_date,end_date)
{
    return $.ajax({
        type:"POST",
        url: bpath + "ors/check/esig/request",
        data:{_token,requested,type,start_date,end_date},

        success:function(response)
        {
            if(response)
            {
                return response.check;
            }
        },
        error: function(xhr, status, error) {
            console.error("Error in AJAX request:", error);
        }
    });
}


/*Request E-signature in the Supervisor */
function requestEsig(type,requested,start_date,end_date)
{
    $.ajax({
        type:"POST",
        url: bpath + "ors/request/e_sig",
        data:{_token,type,requested,start_date,end_date},
        dataType:'json',

        success:function(response)
        {
            if(response.status === true)
            {
                __notif_show(1,'',response.message);
            } else if(response.status === false)
            {
                __notif_show(-1,'',response.message);
            }
        }
    });
}

function printTask()
{
    $("#btn_print_task").on("click",function(){

        let date = $("#filter_date_from").val(),
            e_sig = $("#my_esig").val(),
            supervisor_e_sig = $("#supervisor_esig").val();
            rater = $("#rater").val(),
            doc_type = $("#export_file_type").val(),
            export_type = $("#export_type").val();

        //validate the input field
        if(date.trim() !== null && date.trim() !== '')
        {
            //validate the input field
            if(rater.trim() !== null && rater.trim() !== '')
                {
                    let url = `/ors/print/pdf/task/${doc_type}/${export_type}/${e_sig}/${rater}/${starting_date.GetStartingDate}/${start_end.GetEndDate}/${supervisor_e_sig}`;

                    if(supervisor_e_sig === '1')
                    {
                        //check for the esig approval
                        checkRequestEsig(rater,doc_type,starting_date.GetStartingDate,start_end.GetEndDate).done(function(check){

                            if(check)
                            {
                                window.open(url,'_blank');
                            }else
                            {
                                requestEsig(doc_type,rater,starting_date.GetStartingDate,start_end.GetEndDate);
                            }
                        });
                    }
                    else if(supervisor_e_sig === '0')
                    {
                        window.open(url,'_blank');
                    }
                }
                else
                {
                    __notif_show(-1,'',"Please select the supervisor");
                }
        } else
        {
            __notif_show(-1,'',"Please select a date first");
        }
    });
}

function checkRater()
{
    $("#rater").on("change",function(){

        let val = $(this).val();

        if(val!==null && val!=='')
        {
            $("#rater").removeClass("border-danger");
        } else
        {
            $("#rater").addClass("border-danger");
        }

    });
}

/*Close the drop down*/
function closeDropdown()
{
    $("#btn_close_print_drpdown").on("click",function(){
        Printdown.hide();
    });
}

/*Change the text base on the document type*/
function changeDiscription()
{
        $("#export_file_type").on("change",function(){

            let val = $(this).val(),
                text = $("#request_esig_text");

            if(val === 'ors')
            {
                text.text('Include raters e_sig');

            } else
            {
                text.html('Allow supervisor e-sig');
            }
        });
}


