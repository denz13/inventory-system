var from_date = '';
var to_date = '';
var filter_date_from = '', filter = {FilterData:''};
var multiple_rating_calendar = '';
var getInitialeDate = {InitializeDate:''};
var getFromDate = {StartDate:''};
var getToDate = {EndDate:''};
var multiple_getFromDate = {MultipleStartDate:''};
var multiple_gettoDate = {MultipleEndDate:''};
var rated_status = {GLobalRatedStatus:''};
var rating_calendar = '';
var task_status = '';
var ors_task_status = '';
var esig = 1,e_sig = {AllowEsig:0};
var counter = 0,filter_esig = {FilterName:''};
var return_comment = {Comment:''};
var requester_id = '';
const error_display = tailwind.Modal.getInstance(document.querySelector("#error_ors_modal"));
const employee_rate_task = tailwind.Modal.getInstance(document.querySelector("#employee_rate_task"));
// const rating_accordion = tailwind.Accordion.getOrCreateInstance(document.querySelector("#evaluate_rating"));
//const file_accordion = tailwind.Accordion.getOrCreateInstance(document.querySelector("#ratee_file_attachment"));
const multiple_rating_task =  tailwind.Modal.getInstance(document.querySelector("#mulitple_rate_ors_task_details"));
const request_e_sig =  tailwind.Modal.getInstance(document.querySelector("#request_esig"));
const return_dropdown = tailwind.Dropdown.getOrCreateInstance(document.querySelector("#return_dropdown"));
const task_list = tailwind.Modal.getInstance(document.querySelector("#multiple_rate"));

$(document).ready(function(){

    bpath = __basepath + "/";

    /*get the current date*/
    fetchCurrentDate();

    /*Initialize the calendar*/
    InitializeRatingCalendar();
    /**/

    /*Initialize litepicker*/
    intializeFilterRatingCalendar();
    /**/

    /*Initialize litepicker*/
    initializeCalendarSelect2()
    /**/

    /*fetch the requested esig*/
    fetchRequestedEsig();

    removeDataHolder();
    checkDataHolder();
    saveOrsRating();
    cancelRatingModal();
    filterRatingDate();
    // refreshCalendar();
    filterTaskStatus();
    /*Multiple Ors list*/
    triggerMultipleTaskList();
    filterMultipleOrsTask();
    displayChildOrsTask();
    clickRate();
    getRatedTask();
    getUnratedTask();
    triggerMultipleClick();
    triggerMultipleRatingTask();
    triggerRateMultipleOrs();
    /*Filter the data based on the name*/
    filterNameSearch();
    /*Return the task*/
    returnTask();
    /*View the comment*/
    viewReturnComment();
    /*filter the e-sig requester*/
    filterEsigRequester();
    /*Allow esig*/
    allowEsig();
    /*Allow esig signatory*/
    allow_signatory_e_sig();
    /*Grant access to use esig*/
    grantEsigAccess();
    /*Click all the check box*/
    checked_all();
    /*Check if the allow esig is approve or not*/
    checkEsigStatus(e_sig.AllowEsig);
    /*Click the rating*/
    clickRating();
    /*Add a predined comments*/
    clickPredefinedComment();
    toggle_e_sig_approval();
    rateWalkthrough();
});

/*Initialize a calendar*/
function InitializeRatingCalendar()
{
    try
    {
        var calendarEl = document.getElementById('rating_ors_calendar');
            rating_calendar = new FullCalendar.Calendar(calendarEl, {

            headerToolbar: {
                left: 'dayGridMonth',
                center: 'prev,next today',
                right: 'title'
            },
            initialDate:getInitialeDate.InitializeDate,
            selectable: true,
            selectMirror: true,
            editable: false,
            eventOverlap: true,
            weekNumbers: false,
            navLinks: false,
            nowIndicator: true,
            droppable: false,
            displayEventTime: false,
            dayMaxEvents: 2,
            lazyFetching:true,

            eventDidMount: function(info) {
                //adjust the style on the border radius in the display event
                info.el.style.borderRadius = '15px';
            },
            //responsible to display the event
            events:function(fetchInfo, successCallback, failureCallback) {
                $.ajax({
                    type: "GET",
                    url: bpath + "ors/get/ratee/task",
                    data:{ _token,
                            from_date:getFromDate.StartDate,
                            stat:task_status
                        },
                    async:true,
                    beforeSend: function(){
                        showLoading();
                    },

                    success:function(response)
                    {
                        var event = response;

                        if(event.length > 0)
                        {
                            successCallback(event);
                            hideLoading();
                        } else
                        {
                            successCallback(event);
                            hideLoading();
                        }
                    }
                });
            },
            eventClick:function(info){

                let id = info.event.id,
                    image = info.event.extendedProps.image,
                    name = info.event.title,
                    pos = info.event.extendedProps.pos,
                    task = info.event.extendedProps.task,
                    ratee_id = info.event.extendedProps.ratee,
                    stat = info.event.extendedProps.status,
                    return_message = info.event.extendedProps.return;

                    //reset the value to empty
                    $(".append_task").empty();
                    $("#ors_id").val('');
                    $("#ratee_id").val('');
                    $("#ratee_comments").val('');
                    return_comment.Comment = return_message;

                    //append the data
                    $("#ors_id").val(id);
                    $("#ratee_id").val(ratee_id);
                    $("#ratee_name").text(name);
                    $("#ratee_pos").text(pos);
                    $("#ratee_image").attr('src',image);
                    $(".append_task").append(`<label>${task}</label>`);

                    if(stat === '0' || stat === '2')
                    {
                        fetchSpmsRating();
                        employee_rate_task.show();
                        fetchMultipleFileList(id);
                        $("#return_option").show();
                    } else
                    {

                        fetchRatedTask(id);
                        fetchMultipleFileList(id);
                        employee_rate_task.show();
                        $("#return_option").hide();
                    }

            },
            //add  an icon
            eventContent: function(info) {
                var html = '<div class="fc-event-title-container">';
                // Check if the event has an iconClass property
                if (info.event.extendedProps.iconClass) {
                    // Append the icon to the event content
                    html += `<i class="  w-4 h-4 ${info.event.extendedProps.iconClass} mr-2"></i>`;
                }
                // Append the title to the event content
                html += `<div class="fc-event-title fc-sticky ">${info.event.title}</div>`;

                html += '</div>';
                return { html: html };
            },
            moreLinkContent:function(args){
                return 'Show more';
            },
		});

		rating_calendar.render();

        /*click the previous button on the calendar*/
        $("body").on("click","button.fc-prev-button", function()
        {
            let date = rating_calendar.getDate();

            //initialize to get the current date for the calendar to start
            getInitialeDate.InitializeDate = format_date(date);
            getFromDate.StartDate = format_date(date);

            // Refetch events from the source
            rating_calendar.refetchEvents();

        });

        /*click the next button on the calendar*/
        $("body").on("click","button.fc-next-button", function()
        {
            let date = rating_calendar.getDate();

            //initialize to get the current date for the calendar to start
            getInitialeDate.InitializeDate = format_date(date);
            getFromDate.StartDate = format_date(date);

            // Refetch events from the source
            rating_calendar.refetchEvents();
        });

    }catch(error)
    {
        console.log(error.message);
    }
}

/*Initialize a litepicker calendar*/
function intializeFilterRatingCalendar()
{
    try
    {
        let element_id = 'filter_date_rating',
            multiple_rating_id = 'filter_date_rating_multiple';


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
            },
        });

        //initialize the calendar in the multiple task list
        multiple_rating_calendar = new Litepicker({
            element: document.getElementById(multiple_rating_id),
            autoApply: false,
            singleMode: false,
            numberOfColumns: 2,
            numberOfMonths: 2,
            showWeekNumbers: false,
            initialDate:new Date(),
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

    }catch(error)
    {
        console.log(error.message);
    }
}

function initializeCalendarSelect2()
{
    $('#filter_calendar_stat').select2({
        placeholder: "Status",
        closeOnSelect: true,
        allowClear:true,
    });
}

/*Get the file attachment of the ratee*/
function fetchAttachment(id)
{
    try
    {
        $.ajax({
            type:"GET",
            url: bpath + "ors/get/ratee/attachment",
            data:{_token,id},

            beforeSend:function()
            {
                $("#file_List").empty();

                let cd = ``;

                cd = `<div class="intro-x justify-center flex-center">
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
                    </div>`;

                $("#file_List").append(cd);
            },

            success:function(response)
            {
                if(response !== null || response !== '')
                {
                    $("#file_List").empty();
                    $('.rate').empty();

                    let data = JSON.parse(response);

                    if(data.length > 0)
                    {
                        $.map(data, function(value){

                            let cd = '';
                            let path = value.file.split('_');

                            cd = `<div class="intro-x w-8 h-8 image-fit -ml-8">
                                    <a target="_blank" href="/ors/view/ratee/attachment/${value.id}/${value.file_path}">
                                            <img alt="DSSC" class="rounded-md border border-white zoom-in tooltip" title="${path[1]}" src="${value.file_image}">
                                        </a>
                                </div>`;

                            $("#file_List").append(cd);
                        });
                    } else
                    {
                        let empty_file = '';

                        empty_file = `<div class="text-slate-500 dark:text-slate-500 font-medium leading-none">
                                        <i class="fa-solid fa-ban w-4 h-4 text-danger ml-4"></i>
                                        <span class="ml-2">
                                                No file Attachment found
                                        </span>
                                    </div>`;

                        $("#file_List").append(empty_file);
                    }
                }
            }

        });

    }catch(error)
    {
        console.log(error.message);
    }
}

/*Get the SPMS rating*/
function fetchSpmsRating()
{
    try
    {
        let tr = $('#rating_ors_tb'),
            star_rate = $('.rate');

        $.ajax({
            type:"POST",
            url: bpath + "ors/get/spsms/rating",
            data: {_token},
            beforeSend: function(){

                tr.empty();

                let loading = `<tr id="loading-row" class="">
                                    <td colspan="3" class="w-full text-center">
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
                                </tr>`;

                    tr.append(loading);

            },
            success:function(response)
            {
                if(response !== null || response !== '')
                {
                    tr.empty();
                    star_rate.empty();

                    let data = JSON.parse(response);
                    let rating_id = 0,
                        count = 1;

                    if(data.length > 0)
                    {
                        $.map(data, function(value){

                            let cd = '';

                            cd = `<tr class="-py-2">
                                    <td hidden>
                                        <label id="lbl_id" class="ml-4 text-slate-500 dark:text-slate-500 font-medium leading-none tooltip" data-rating_id="${rating_id}" style="cursor: pointer;">

                                        </label>
                                    </td>
                                    <td>
                                        <label id="lbl_adjectival" class="ml-4 text-slate-500 dark:text-slate-500 font-medium leading-none tooltip" title="${value.desc}" data-ors_id="${value.id}" style="cursor: pointer;">
                                            ${value.adjectival}
                                        </label>
                                    </td>
                                    <td class="tooltip" title="The maximun rate of this criteria is ${value.rate}" hidden>
                                        <label id="${value.adjectival}" class="editable-label other_specify_rate text-center" contenteditable="true" data-placeholder="Enter your rate" data-rate="${value.rate}" data-bool=""></label>
                                    </td>
                                    <td>
                                        <div class="rating flex">
                                            <input type="radio" id="star5-row${count}" name="rate-row${count} rate" value="5"/>
                                            <label class="star" for="star5-row${count}" title="Awesome" aria-hidden="true"></label>
                                            <input type="radio" id="star4-row${count}" name="rate-row${count} rate" value="4"/>
                                            <label class="star" for="star4-row${count}" title="Great" aria-hidden="true"></label>
                                            <input type="radio" id="star3-row${count}" name="rate-row${count} rate" value="3"/>
                                            <label class="star" for="star3-row${count}" title="Very good" aria-hidden="true"></label>
                                            <input type="radio" id="star2-row${count}" name="rate-row${count} rate" value="2"/>
                                            <label class="star" for="star2-row${count}" title="Good" aria-hidden="true"></label>
                                            <input type="radio" id="star1-row${count}" name="rate-row${count} rate" value="1"/>
                                            <label class="star" for="star1-row${count}" title="Bad" aria-hidden="true"></label>
                                        </div>
                                    </td>
                                </tr>`;

                                count++;
                                tr.append(cd);
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

/*fetch the rated task*/
function fetchRatedTask(ors_id)
{
    try
    {
        let tr = $('#rating_ors_tb');

        $.ajax({
            type: "POST",
            url: bpath + "ors/rated/task",
            data:{_token,ors_id},

            beforeSend:function(){
                tr.empty();

                let loading = `<tr id="loading-row" class="">
                                    <td colspan="3" class="w-full text-center">
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
                                </tr>`;

                    tr.append(loading);
            },

            success:function(response)
            {
                if(response !== null || response !== '')
                {
                    tr.empty();

                    let data = JSON.parse(response),
                        count = 1;

                    if(data.length > 0)
                    {
                        $.map(data, function(value){
                            let cd = '';
                                cd = `<tr class="-py-2">
                                            <td hidden>
                                                <label id="lbl_id" class="ml-4 text-slate-500 dark:text-slate-500 font-medium leading-none tooltip" data-rating_id="${value.rating_id}" style="cursor: pointer;">
                                                </label>
                                            </td>
                                            <td>
                                            <label id="lbl_adjectival" class="ml-4 text-slate-500 dark:text-slate-500 font-medium leading-none tooltip" title="${value.desc}" data-ors_id="${value.rating_setup_id}" style="cursor: pointer;">
                                                    ${value.adjectival}
                                                </label>
                                            </td>
                                            <td class="tooltip" title="The maximun rate of this criteria is ${value.rate_desc}" hidden>
                                                <label id="${value.adjectival}" class="editable-label text-center other_specify_rate" contenteditable="true" data-placeholder="Enter your rate" data-rate="${value.rate_desc}">
                                                    ${value.rate}
                                                </label>
                                            </td>
                                            <td>
                                                <div class="rating flex">
                                                    <input type="radio" id="star5-row${count}" name="rate-row${count} rate" value="5" ${(value.rate == 5) ? 'checked' : ''} />
                                                    <label class="star" for="star5-row${count}" title="Awesome" aria-hidden="true"></label>
                                                    <input type="radio" id="star4-row${count}" name="rate-row${count} rate" value="4" ${(value.rate == 4) ? 'checked' : ''} />
                                                    <label class="star" for="star4-row${count}" title="Great" aria-hidden="true"></label>
                                                    <input type="radio" id="star3-row${count}" name="rate-row${count} rate" value="3" ${(value.rate == 3) ? 'checked' : ''} />
                                                    <label class="star" for="star3-row${count}" title="Very good" aria-hidden="true"></label>
                                                    <input type="radio" id="star2-row${count}" name="rate-row${count} rate" value="2" ${(value.rate == 2) ? 'checked' : ''} />
                                                    <label class="star" for="star2-row${count}" title="Good" aria-hidden="true"></label>
                                                    <input type="radio" id="star1-row${count}" name="rate-row${count} rate" value="1" ${(value.rate == 1) ? 'checked' : ''} />
                                                    <label class="star" for="star1-row${count}" title="Bad" aria-hidden="true"></label>
                                                </div>
                                            </td>
                                        </tr>`;

                                    if(value.rate !== null && value.rate !== '')
                                    {
                                        cd = cd.replace('data-placeholder','');
                                    }

                                count++;

                                tr.append(cd);
                                $("#ors_id").val(value.id);
                                $("#ratee_comments").val(value.comment);
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

/*fetch the image of the user*/
function fetchImage(employeeId)
{
    try
    {
        $.ajax({
            type: "POST",
            url: bpath + "ors/fetch/image",
            data:{_token,employeeId},

            success:function(response){

                if(response !== null && response !== '')
                {
                    let image = response.image;

                    $("#ratee_image").attr('src',image);
                }
            }
        });

    }catch(error)
    {
        console.log(erro)
    }
}

/*filter the date*/
function filterRatingDate()
{
    try
    {
        filter_date_from.on('selected',function(){

            //extract the date from the calendar
            const start_date = filter_date_from.getStartDate('YYYY-MM-DD'),
                end_date = filter_date_from.getEndDate('YYYY-MM-DD');

            getFromDate.StartDate = format_date(start_date);
            getToDate.EndDate = format_date(end_date);

            //get the initialization on the date
            fetchCurrentDate(getFromDate.StartDate);

            InitializeRatingCalendar();

        });

    }catch(error)
    {
        console.log(error.message);
    }
}

/*Fetch the current date*/
function fetchCurrentDate(date)
{
    try
    {
        let currentDate = new Date();


        let year = currentDate.getFullYear();
        let month = pad(currentDate.getMonth() + 1);
        let day = pad(currentDate.getDate());

        getdate = year+'-'+month+'-'+day;

        if($.trim(date) !== null && $.trim(date) !== '' )
        {
            getInitialeDate.InitializeDate = date;

        } else
        {
            getInitialeDate.InitializeDate = getdate;
        }

        return  getInitialeDate.InitializeDate;

    }catch(error)
    {
        console.log(error.message);
    }
}

/*format date*/
function format_date(date)
{
    try
    {
        let year = date.getFullYear();
        let month = pad(date.getMonth() + 1);
        let day = pad(date.getDate());

        date = year+'-'+month+'-'+day;

        return date;

    }catch(error)
    {
        console.log(error.message);
    }
}

/*Add a leading zero on the date*/
function pad(number) {
    return (number < 10 ? '0' : '') + number;
}

/*remove the place holder in the evaluatee page info*/
function removeDataHolder()
{
    $("body").on("focus",".other_specify_rate",function(){

        let val = $(this).text().trim();

        if(val !== null || val !== '')
        {
            $(this).removeAttr("data-placeholder");
        }
    });
}

/*add the place holder in the evaluatee page info*/
function checkDataHolder()
{
    $("body").on("focusout",".other_specify_rate",function(){

        let val = $(this).text(),
            rate = $(this).data("rate"),
            check_num = $.isNumeric(val);

        if(val === null || val === '')
        {
            $(this).attr("data-placeholder","Enter rate");

            $(this).addClass('has-error');
            $(this).data("bool",false);

        } else
        {
            if(val > rate)
            {
                $(this).addClass('has-error');
                $(this).data("bool",false);

            } else if(val === '0')
            {
                $(this).addClass('has-error');
                $(this).data("bool",false);
            }
            else
            {
                if(check_num === true)
                {
                    $(this).removeClass('has-error');
                    $(this).data("bool",true);
                } else
                {
                    $(this).addClass('has-error');
                    $(this).data("bool",false);
                }

            }
        }
    });
}

/*Check for the invalid input in rating*/
function checkInput()
{
    try
    {
        let bool = false;

        $("#rating_ors_tb tr").each(function(i){

            let rate_val = $(this).find("td .other_specify_rate").data("bool");

                if( rate_val === false)
                {
                    bool = false
                    return false;

                } else
                {
                    bool = true
                    return true;
                }
        });

        if(bool === false)
        {
            return false;
        } else
        {
            return true;
        }

    }catch(error)
    {
        console.log(error.message);
    }
}

/*Save the data temporarily*/
function savedTempData()
{
    try
    {
        let temp_data = [];

        $("#rating_ors_tb tr").each(function(i){

            let rating_id = $(this).find("td #lbl_id").data("rating_id");
                id = $(this).find("td #lbl_adjectival").data("ors_id"),
                rate_val = $(this).find("td .other_specify_rate").text();

            let data = {
                    "rating_id":rating_id,
                    "id":id,
                    "rate_val":rate_val
                };

            temp_data.push(data);
        });

        return temp_data;

    }catch(error)
    {
        console.log(error.message);
    }
}

/*trigger to saved the Ors Rating*/
function saveOrsRating()
{
    $("#btn_save_rating").on("click",function(){

        let id = $("#ors_id").val().trim(),
            ratee_id = $("#ratee_id").val().trim();
            comment = $("#ratee_comments").val().trim();

        if(checkInput())
        {
            orsRated(id,ratee_id,savedTempData(),comment,esig);

            /*reset the value of the e-sig*/
            esig = 1;

        } else
        {
            __notif_show(-1,'',"Please make sure that you rate all the criteria appropriately");
        }
    });
}

/*Saved the rated ors in the database*/
function orsRated(id,ratee,temp_data,comment,e_sig)
{
    try
    {
        let button = $('#btn_save_rating');

        /*Saved the data in the database*/
        $.ajax({
            type: "POST",
            url: bpath + "ors/rated",
            data:{_token,id,
                ratee,temp_data,
                comment,e_sig},
            dataType: "json",
            beforeSend: function(){

                button.prop('disabled',true);

                button.html(`Save <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2">
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

            success: function(response){

                button.prop('disabled',false);
                button.text('Save');

                if(response.status === true)
                {
                    __notif_show(1,'',response.message);

                    rating_calendar.refetchEvents();
                    employee_rate_task.hide();

                    /*check the status and display wherether the rating is update or not*/
                    if(ors_task_status === 1)
                    {
                        rated_status.GLobalRatedStatus = true;
                    } else
                    {
                        rated_status.GLobalRatedStatus = false;
                    }

                    //clear the comments
                    $("#ratee_comments").val('');
                    $("#rating_ors_tb").empty();

                    //refresh the multiple rating task
                    fetchMultipleOrsTask(getInitialeDate.InitializeDate,multiple_getFromDate.MultipleStartDate
                        ,multiple_gettoDate.MultipleEndDate,rated_status.GLobalRatedStatus,filter.FilterData);

                } else if(response.status === 500)
                {
                    error_display.show();
                    $('#error_text').text(response.error);
                }
                else
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

/*cancel the modal*/
function cancelRatingModal()
{
    $("#btn_cancel_rating_modal").on("click",function(){

        $("#ratee_comments").val('');
        $("#file_List").empty();
        $("#rating_ors_tb").empty();

        /*Close the rating accordion*/
        // rating_accordion.hide();
    });
}

/*trigger to open the accordion modal*/
function OpenEvaluationCriteriaAccordion(id,stat,counter)
{
    $('#evaluate_rating').click(function() {
        // Toggle active class on click
        $(this).toggleClass('active');
        // Check if the clicked item has the 'active' class
        if ($(this).hasClass('active')) {

            if(counter === 0)
            {
                if(stat === '0')
                {
                    $("#ors_id").val(id);
                    fetchSpmsRating();
                } else
                {
                    fetchRatedTask(id);
                }

                counter ++;
            }
        }
    });
}

/*trigger to display the image when rating*/
function DisplayRateeActtachmentFile(id,stat,counter)
{
    $("#ratee_file_attachment").on("click",function(){
         // Toggle active class on click
        $(this).toggleClass('active');
         // Check if the clicked item has the 'active' class
        if ($(this).hasClass('active')) {

            if(counter === 0)
            {
                if(stat === '0')
                {
                    fetchAttachment(id);
                } else
                {
                    fetchAttachment(id);
                }
                counter ++;
            }
        }
    });
}

/*========================================================================================*/

                    /*Multiple task list select*/

function fetchMultipleOrsTask(current_date,start_date,end_date,stat,filter)
{
    try
    {
        $.ajax({
            type: "POST",
            url: bpath + "ors/display/multiple/task",
            data:{  _token,current_date,
                    start_date,end_date,
                    stat,filter},

            beforeSend:function()
            {
                $(".ors_task_list").empty();

                $(".ors_task_list").append(`<div class="box px-4 py-4 mb-3 flex items-center flex flex-col justify-end items-center py-1 zoom-in">
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
                                            </div>`);
            },
            success:function(response)
            {
                if( response !== null || response !== '' )
                {
                    $("#ors_task_list").empty();

                    let data = JSON.parse(response);

                    if(data.length > 0)
                    {
                        $.map(data,function(detail){
                            $.map(detail,function(value){
                                let cd = '';

                                cd = `<div class="intro-x box mb-3 transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 event cursor-pointer rounded-md ors_task">
                                        <div id="ors_task" data-ors_id="${value.id}" data-status="${value.stat}">
                                            <div class="px-4 py-4 ors_task flex items-center">
                                                <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                                    <img alt="DSSC" src="${value.ratee_image}">
                                                </div>
                                                <div class="ml-4 mr-auto">
                                                    <div class="font-medium">${value.ratee_name}</div>
                                                    <div class="text-slate-500 text-xs mt-0.5 font-medium">${value.date_submitted}</div>
                                                    <div class="text-slate-500 text-xs mt-2">Status:<span class="ml-2 py-1 px-2 rounded-full text-xs ${value.bg} text-white cursor-pointer">${value.status}</span></div>
                                                </div>
                                                <div id="check_box_input" class="check_box_input whitespace-nowrap">
                                                    ${value.check_input}
                                                </div>
                                            </div>
                                            <div id="multiple_ors_details" class="intro-x multiple_ors_details px-4" data-task="${value.task}" data-image="${value.ratee_image}" data-ratee_id="${value.ratee_id}" data-id="${value.id}" data-stat="${value.stat}" data-name="${value.ratee_name}"  data-pos="${value.ratee_pos}" data-comment="${value.comment}" data-esig_stat="${value.esig_stat}" hidden>
                                                    ${value.esig}
                                                    <div class="p-2 mt-2">
                                                        <div class="font-medium flex">Task
                                                            <span class="ml-auto">Quantity:<span class="ml-1">${value.qty}</span></span>
                                                        </div>
                                                        <div class="leading-relaxed text-slate-500 text-xs mt-2" style="text-align:justify;">
                                                            <div>
                                                                <label> ${value.task} </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="flex mt-1 mb-2 rated_ors_details">
                                                    </div>
                                                    <div class="flex items-center px-5 py-3 border-t border-slate-200/60 dark:border-darkmode-400">
                                                        <a href="" class="w-8 h-8 flex items-center justify-center rounded-full border border-slate-300 dark:border-darkmode-400 dark:bg-darkmode-300 dark:text-slate-300 text-slate-500 mr-2 tooltip" title="Bookmark"> <i class="fa-regular fa-file w-3 h-3"></i></i> </a>
                                                            <div id="multiple_file_List" class="flex mr-2 multiple_file_List">
                                                            </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;

                                $("#ors_task_list").append(cd);
                            })
                        })
                    } else
                    {
                        $(".ors_task_list").append(`<div class="box px-4 py-4 mb-3 flex items-center flex flex-col justify-end items-center py-1 zoom-in">
                                                        <svg data-v-ad307406="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="fa-bounce w-10 h-10 lucide lucide-animal animal-icon">
                                                            <path d="M15.236 22a3 3 0 0 0-2.2-5"></path><path d="M16 20a3 3 0 0 1 3-3h1a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4V4"></path>
                                                            <path d="M18 13h.01"></path><path d="M18 6a4 4 0 0 0-4 4 7 7 0 0 0-7 7c0-5 4-5 4-10.5a4.5 4.5 0 1 0-9 0 2.5 2.5 0 0 0 5 0C7 10 3 11 3 17c0 2.8 2.2 5 5 5h10"></path>
                                                        </svg>
                                                        <div class="font-semibold text-sm mt-2">No task found</div>
                                                    </div>`);
                    }

                }
            }
        });

    }catch(error)
    {
        console.log(error.message);
    }
}

/*Filter to search the name of the data*/
function filterNameSearch()
{
    let typingTimer = '',
        doneTypingInterval = 1000;

    $('#filter_search_name').on('input', function() {

        clearTimeout(typingTimer);
        filter.FilterData = $(this).val();

        typingTimer = setTimeout(function(){
            fetchMultipleOrsTask(getInitialeDate.InitializeDate,multiple_getFromDate.MultipleStartDate
                ,multiple_gettoDate.MultipleEndDate,rated_status.GLobalRatedStatus,filter.FilterData);
            },doneTypingInterval);
        });
}

/*Get the list of attachment send by the evaluatee*/
function fetchMultipleFileList(id)
{
    try
    {
        $.ajax({
            type: "POST",
            url: bpath + "ors/fetch/multiple/attachment-list",
            data:{_token,id},

            beforeSend:function()
            {
                $(".multiple_file_List").empty();

                let cd = ``;

                cd = `<div class="intro-x flex items-center ml-10">
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
                    </div>`;

                $(".multiple_file_List").append(cd);
            },
            success:function(response)
            {
                if(response!==null || response!=='')
                {
                    $(".multiple_file_List").empty();

                    let data = JSON.parse(response);

                    if(data.length > 0)
                    {
                        $.map(data,function(value){

                            let cd = '';

                            let path = value.file.split('_');

                            cd = `<div class="intro-x w-8 h-8 image-fit -ml-8">
                                    <a target="_blank" href="/ors/view/ratee/attachment/${value.id}/${value.file_path}" onclick="event.stopPropagation()">
                                            <img alt="DSSC" class="rounded-md border border-white zoom-in tooltip" title="${path[1]}" src="${value.file_image}">
                                        </a>
                                </div>`;

                            $(".multiple_file_List").append(cd);
                        });
                    }else
                    {
                        let empty_file = '';

                        empty_file = `<div class="text-slate-500 dark:text-slate-500 font-medium leading-none">
                                        <span class="ml-2 text-danger">
                                                No attachment found
                                        </span>
                                    </div>`;

                        $(".multiple_file_List").append(empty_file);
                    }
                }
            }
        });

    }catch(error)
    {
        console.log(error.message);
    }
}

/*Get the rating setup for the rating of the multiple list*/
function getRatingSetupMultipleRate()
{
    try
    {
        $.ajax({
            type:"POST",
            url: bpath + "ors/get/spsms/rating",
            data:{_token},

            success:function(response)
            {
                if(response !==null || response !== '')
                {
                    let data = JSON.parse(response),
                        count = 1,
                        rating_id = 0;

                    $("#multiple_rating_ors_tb").empty();

                    if(data.length > 0)
                    {
                        $.map(data, function(value){

                            let cd = '';

                            cd = `<tr class="-py-2">
                                        <td hidden>
                                            <label id="lbl_id" class="ml-4 text-slate-500 dark:text-slate-500 font-medium leading-none tooltip" data-rating_id="${rating_id}" style="cursor: pointer;">

                                            </label>
                                        </td>
                                        <td>
                                            <label id="lbl_adjectival" class="ml-4 text-slate-500 dark:text-slate-500 font-medium leading-none tooltip" title="${value.desc}" data-ors_id="${value.id}" style="cursor: pointer;">
                                                ${value.adjectival}
                                            </label>
                                        </td>
                                        <td class="tooltip" title="The maximun rate of this criteria is ${value.rate}" hidden>
                                            <label id="${value.adjectival}" class="editable-label other_specify_rate text-center" contenteditable="true" data-placeholder="Enter your rate" data-rate="${value.rate}" data-bool=""></label>
                                        </td>
                                        <td>
                                            <div class="rating">
                                                <input type="radio" id="star5-row${count}" name="rate-row${count} rate" value="5"/>
                                                <label class="star" for="star5-row${count}" title="Awesome" aria-hidden="true"></label>
                                                <input type="radio" id="star4-row${count}" name="rate-row${count} rate" value="4"/>
                                                <label class="star" for="star4-row${count}" title="Great" aria-hidden="true"></label>
                                                <input type="radio" id="star3-row${count}" name="rate-row${count} rate" value="3"/>
                                                <label class="star" for="star3-row${count}" title="Very good" aria-hidden="true"></label>
                                                <input type="radio" id="star2-row${count}" name="rate-row${count} rate" value="2"/>
                                                <label class="star" for="star2-row${count}" title="Good" aria-hidden="true"></label>
                                                <input type="radio" id="star1-row${count}" name="rate-row${count} rate" value="1"/>
                                                <label class="star" for="star1-row${count}" title="Bad" aria-hidden="true"></label>
                                            </div>
                                        </td>
                                </tr>`;
                            count++;
                            $("#multiple_rating_ors_tb").append(cd);
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

/*Get the rating of the ors rated task and display*/
function fetchRatedOrsTask(id)
{
    try{
        $.ajax({
            type:"POST",
            url: bpath + "ors/fetch/ors/rating",
            data:{_token,id},

            success:function(response)
            {
                let rated_ors_details = $(".rated_ors_details");

                if(response!==null && response!=='')
                {
                    let data = response.rated;

                    if(!$.isEmptyObject(data))
                    {
                        let cd = '';
                        $.map(data, function(rating){
                            cd = `<div class="flex mt-2">
                                    <div class="text-primary px-2 py-1 bg-primary/10 dark:bg-darkmode-400 dark:text-slate-300 rounded text-xs  mr-3">${rating.adjectival}:
                                    <span>${rating.rate}</span></div>
                                </div>`;

                            rated_ors_details.append(cd);
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

/*Saved mulitple ors rating*/
function savedMultipleRatingOrs(temp_id,temp_ratee,rating,comment,e_sig)
{
    try
    {
        let button = $('#btn_saved_multiple_rate');

        $.ajax({
            type: "POST",
            url: bpath + "ors/saved/multiple/rating/task",
            data:{_token,temp_id,temp_ratee,
                    rating, comment,e_sig},
            dataType: "json",

            beforeSend: function(){
                button.prop('disabled',true);

                button.html(`Save <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2">
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

            success: function(response)
            {
                if(response.status === true)
                {
                    button.prop('disabled',false);
                    button.text('Save');
                    __notif_show(1,'',response.message);
                    //reload the multiple ors task
                    fetchMultipleOrsTask(getInitialeDate.InitializeDate,multiple_getFromDate.MultipleStartDate
                    ,multiple_gettoDate.MultipleEndDate,rated_status.GLobalRatedStatus,null);
                    //refresh the calendar
                    rating_calendar.refetchEvents();
                    //unchecked the checkbox
                    $("#check_all").prop('checked',false);
                    multiple_rating_task.hide();

                } else
                {
                    __notif_show(-1,'',response.message);
                    button.prop('disabled',false);
                    button.text('Save');
                }
            }
        });

    }catch(error)
    {
        console.log(error.message);
    }
}

/*Return the ors task*/
function orsTaskReturn(id,message)
{
    try
    {
        $.ajax({
            type: "POST",
            url: bpath + "ors/return/ors/task",
            data:{_token,id,message},

            success:function(response)
            {
                if(response.status === true)
                {
                    employee_rate_task.hide();
                    //reload the multiple task
                    rated_status.GLobalRatedStatus = false;

                    fetchMultipleOrsTask(getInitialeDate.InitializeDate,multiple_getFromDate.MultipleStartDate
                        ,multiple_gettoDate.MultipleEndDate,rated_status.GLobalRatedStatus,null);

                    __notif_show(1,'Saved',"Task Successfully return");
                } else
                {
                    __notif_show(-1,'Error',"Please try again");
                }
            }
        });

    }catch(error)
    {
        console.log(error.message);
    }
}

/*Check for the invalid input in multiple rating*/
function checkMultipleInput()
{
    try
    {
        let bool = false;

        $("#multiple_rating_ors_tb tr").each(function(i){

            let rate_val = $(this).find("td .other_specify_rate").data("bool");

                if( rate_val === false)
                {
                    bool = false
                    return false;

                } else
                {
                    bool = true
                    return true;
                }
        });

        if(bool === false)
        {
            return false;
        } else
        {
            return true;
        }

    }catch(error)
    {
        console.log(error.message);
    }
}

/*trigger to display the list of all task*/
function triggerMultipleTaskList()
{
    $("#btn_ors_multiple_list").on("click",function()
    {
        fetchMultipleOrsTask(getInitialeDate.InitializeDate,'','');

        /*Show the checkbox*/
        $("#example-5-tab").show();
        $("#example-8-tab").show();
        $("#check_all").prop('checked',false);
        $(".rate_multiple_task").show();

        //clear the input of a calendar
        $("#filter_date_rating_multiple").val('');
        //clear the search input
        $("#filter_search_name").val('');
    });
}

/*filter the date on the multiple ors task and reload the full calendar*/
function filterMultipleOrsTask()
{
    try
    {
        multiple_rating_calendar.on('selected',function(){
            //extract the date from the calendar
        const start_date = multiple_rating_calendar.getStartDate('YYYY-MM-DD'),
            end_date = multiple_rating_calendar.getEndDate('YYYY-MM-DD');

            multiple_getFromDate.MultipleStartDate = format_date(start_date);
            multiple_gettoDate.MultipleEndDate = format_date(end_date);

            //reload the ors list
            fetchMultipleOrsTask('',multiple_getFromDate.MultipleStartDate,multiple_gettoDate.MultipleEndDate,'','');

            //reload the ors calendar
            fetchCurrentDate(multiple_getFromDate.MultipleStartDate);
            getFromDate.StartDate = multiple_getFromDate.MultipleStartDate;
            getToDate.EndDate = multiple_gettoDate.MultipleEndDate;
            InitializeRatingCalendar();
    });
    }catch(error)
    {
        console.log(error.message);
    }
}

/*Click to display chid data in under the multiple list show to show details*/
function displayChildOrsTask()
{
    $("body").on("click","#ors_task", function(){

        let id = $(this).data("ors_id"),
            display_task = $(this).children('.multiple_ors_details'),
            rated_ors_details = $(".rated_ors_details");


        // Check if the clicked element is currently visible
        let isVisible = display_task.is(':visible');

        /*Empty the table for the new data*/
        rated_ors_details.empty();

        // Hide all other open details
        $(".ors_task .multiple_ors_details").hide();

        // Toggle visibility of clicked element
        if (!isVisible) {
            display_task.show();
            fetchRatedOrsTask(id);
            fetchMultipleFileList(id);
        } else {
            display_task.hide();
        }
    });
}

/*Allow esig*/
function allowEsig()
{
    $(document).ready(function() {
        $("body").on("click", "#allow_esig", function(e) {
            e.stopPropagation();

            // Check if any checkbox with the class 'allow_esig' is checked
            var isChecked = $(this).prop("checked");

            if (isChecked) {
                esig = 1;
            } else {
                esig = 0;
            }
        });
    });
}

/*click to to display the rating*/
function clickRate()
{
    $("body").on("click",".multiple_ors_details",function(event){
        event.stopPropagation();

        /*empty the task*/
        $(".append_task").empty();

        let id = $(this).data("id"),
            name = $(this).data("name"),
            pos = $(this).data("pos"),
            task =  $(this).data("task"),
            image =  $(this).data("image"),
            comment = $(this).data("comment");
            stat =  $(this).data("stat"),
            ratee_id = $(this).data("ratee_id");

            /*get the status for the checking of the refresh in the unrated task*/
            ors_task_status = stat;

            /*past the value in  a variable*/
            return_comment.Comment = comment;

            /*trigger to display the design*/
            employee_rate_task.show();

            //append the data
            $("#ratee_name").text(name);
            $("#ratee_pos").text(pos);
            $("#ratee_image").attr('src',image);
            $("#ratee_comments").val('');
            $("#ratee_id").val(ratee_id);
            $(".append_task").append(`<label>${task}</label>`);

            console.log(stat);

            //display the data for the rating
            if(stat === 0 || stat === 2)
            {
                $("#ors_id").val(id);
                fetchSpmsRating();
                $("#return_option").show();
            }
            else
            {
                fetchRatedTask(id);
                $("#return_option").hide();
            }
    });
}

/*trigger to click rated task*/
function getRatedTask()
{
    $("#btn_multiple_rated_task").on("click",function(){
        rated_status.GLobalRatedStatus = true;
        /*Hide the checkbox*/
        $("#example-5-tab").hide();
        $("#example-8-tab").hide();
        /*Show the rate*/
        $(".rate_multiple_task").hide();
        $("#check_all").prop("checked",false);
         //clear the search input
        $("#filter_search_name").val('');

        fetchMultipleOrsTask(getInitialeDate.InitializeDate,multiple_getFromDate.MultipleStartDate
            ,multiple_gettoDate.MultipleEndDate,rated_status.GLobalRatedStatus,null);
    });
}

/*trigger to click unrated task*/
function getUnratedTask()
{
    $("#btn_multiple_unrated_task").on("click",function(){
        rated_status.GLobalRatedStatus = false;
        /*Show the checkbox*/
        $("#example-5-tab").show();
        $("#example-8-tab").show();
        /*Show the rate*/
        $(".rate_multiple_task").show();
         //clear the search input
        $("#filter_search_name").val('');
        fetchMultipleOrsTask(getInitialeDate.InitializeDate,multiple_getFromDate.MultipleStartDate
            ,multiple_gettoDate.MultipleEndDate,rated_status.GLobalRatedStatus,null);
    });
}

/*Multiple click on the checkbox*/
function triggerMultipleClick()
{
    $("body").on("click",".multiple_check_input",function(event){
        event.stopPropagation();

        let check_all = $('#check_all'),
            total_checkboxes = $('.multiple_check_input').length,
            checkedCheckboxes = $('.multiple_check_input:checked').length;

        /*Chcek all the checkboxes if checked or not*/
        if(total_checkboxes === checkedCheckboxes)
        {
            check_all.prop('checked',true);
        } else
        {
            check_all.prop('checked',false);
        }
    });
}

/*check all the checkbox*/
function checked_all()
{
    $("#check_all").on("click",function(){

        let checked = $(this).is(":checked"),
            allow_esig = $(".allow_esig");

            if(checked)
            {
                $(".multiple_check_input").prop('checked', $(this).prop('checked'));
                allow_esig.prop('checked', $(this).prop('checked'));
            } else
            {
                $(".multiple_check_input").prop('checked', false);
                allow_esig.prop('checked', false);
            }
    });
}

/*Trigger to display the modal for the multiple rating*/
function triggerMultipleRatingTask()
{
    $(".rate_multiple_task").on("click",function(){

        let is_checked = $(".multiple_check_input");

        $("#multiple_ratee_comment").empty();

        if(is_checked.is(':checked'))
        {
            multiple_rating_task.show();
            getRatingSetupMultipleRate();
        } else
        {
            __notif_show(-1,'','Please check the task that you want to rate');
        }
    });
}

/*Get the data on the checked div*/
function fetchMultipleDataRate()
{
    let data = [];

    $("#multiple_rating_ors_tb tr").each(function(){

            //fetch the rating id for the update or create
        let rating_id = $(this).find("td #lbl_id").data("rating_id"),
            spms_rating_id = $(this).find("td #lbl_adjectival").data("ors_id"),
            rate_val = $(this).find("td .other_specify_rate").text();

            data.push({
                'rating_id':rating_id,
                'spms_rating_id':spms_rating_id,
                'rate_val':rate_val,
            });
    });

    return data;
}

/*Saved multiple rate ors*/
function triggerRateMultipleOrs()
{
    $("#btn_saved_multiple_rate").on("click",function(){

        let temp_id = [],
            temp_ratee = [],
            temp_esig = [],
            comment = $("#multiple_ratee_comment").val().trim();

            /*Extract the data on the task*/
        $(".multiple_check_input").each(function(){

            let id = $(this).attr("id"),
                ratee = $(this).data("ratee");

            if($(this).prop("checked"))
            {
                id = $(this).attr("id")
                temp_id.push(id);
                temp_ratee.push(ratee);
            }
        });
            /*Extract the e_esignature*/
        $(".allow_esig").each(function(){

            let is_checked = $(this).prop("checked"),
                val = 0;

            if(is_checked)
            {
                val = 1;
            } else
            {
                val = 0;
            }

            temp_esig.push(val);
        });

        if(checkMultipleInput())
        {
            savedMultipleRatingOrs(temp_id,temp_ratee,fetchMultipleDataRate(),comment,temp_esig);
        } else
        {
            __notif_show(-1,'',"Please make sure that you rate all the criteria appropriately");
        }

    });
}

/*filter the status */
function filterTaskStatus()
{
    try
    {
        $("#filter_calendar_stat").on('select2:select',function(e){
            let val = $(this).val();
            task_status = val;
            //refetch the event
            rating_calendar.refetchEvents();
        });
    }catch(error)
    {
        console.log(error.message);
    }
}

/*Return the task*/
function returnTask()
{
    $("#btn_return_task").on("click",function(){

        let id = $("#ors_id").val();

            Swal.fire({
                title: "Return Task",
                type: "warning",
                html:
                    `<div style="margin-bottom: 10px;">This will return the task back to the user.</div>
                        <input id="return_comment" type="text" class="form-control sm:w-full box pl-10 password-input" placeholder="Place your comment" autocomplete="off">`,
                showCancelButton: true,
                confirmButtonText: "Save",
                cancelButtonText: "Cancel",
                reverseButtons: true,
                allowOutsideClick: false,
                allowEscapeKey: false,

                preConfirm: function() {
                    let returnComment = $("#return_comment").val().trim(); // Get the value of the return_comment input field

                    if (returnComment === null || returnComment === "") {
                        $("#return_comment").addClass("border-danger");
                        return false; // Prevent Swal from closing
                    }

                    return true; // Return the comment if it's not null or empty
                }
            }).then(function(result)
            {
                if (result.value)
                {
                    let message = $("#return_comment").val().trim();

                    $.ajax({
                        type: "POST",
                        url: bpath + "ors/return/ors/task",
                        data:{_token,id,message},

                        success:function(response)
                        {
                            if(response.status === true)
                            {
                                //close the rating modal
                                employee_rate_task.hide();

                                //set the status to false or unrated
                                rated_status.GLobalRatedStatus = false;

                                //reload the multiple task list
                                    swal({
                                        type: 'success',
                                        html: 'Successfully return task'
                                    });
                                    fetchMultipleOrsTask(getInitialeDate.InitializeDate,multiple_getFromDate.MultipleStartDate
                                        ,multiple_gettoDate.MultipleEndDate,rated_status.GLobalRatedStatus,null);
                                    rating_calendar.refetchEvents();
                            } else
                            {
                                swal({
                                    type: 'error',
                                    icon:'error',
                                    html: '<strong>Error...</strong>'
                                });
                            }
                        }
                    });
                }
            });

    });
}

/*View the return Comment*/
function viewReturnComment()
{
    $("body").on("click","#btn_view_return_comment",function(){

        if(return_comment.Comment !== null && return_comment.Comment!=='')
        {
            Swal.fire({
                title: "Message",
                type: "info",
                text:return_comment.Comment,
                html:
                    `<div style="margin-bottom: 10px;">${return_comment.Comment}.</div>`,
                showCancelButton: true,
                showConfirmButton:false,
                cancelButtonText: "Cancel",
                reverseButtons: true,
            });
        } else
        {
            Swal.fire({
                    title: "Message",
                    type: "warning",
                    html:
                        `<div style="margin-bottom: 10px;">No comment found !</div>`,
                    showCancelButton: true,
                    showConfirmButton:false,
                    cancelButtonText: "Cancel",
                    reverseButtons: true,
                });
        }
    });
}

/*Fetch the requested user e_sig*/
function fetchRequestedEsig(stat,filter)
{
    let tbdy = $(".requester_list_div"),
        category = $(".category");

    $.ajax({
        type: 'POST',
        url: bpath + "ors/fetch/supervisor/esig",
        data:{_token,stat,filter},

        beforeSend: function(){
            tbdy.empty('');
            tbdy.append(`<div class="flex items-center p-2 transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 event cursor-pointer rounded-md request_e_sig_list" style="justify-content: center;">
                            <div>
                                <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-5 h-5">
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
            tbdy.empty();
            category.empty();

                let data = response.data,
                    cd = '',
                    cz = '';

                if(data.length !== 0)
                {
                    $.each(data,function(index,value){
                        cz = `<div class="font-semibold text-center mt-2">${index}</div>`;
                        tbdy.append(cz);
                        $.each(value,function(pos,details){

                                cd = `<div id="${details.id}" class="flex mt-2 p-2 transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 event cursor-pointer rounded-md request_e_sig_list" style="justify-content: space-between; align-items: center;" data-requester="${details.requester}" data-type="${details.type}" data-requested_date="${details.date_requested}" data-request_send="${details.date}" data-stat="${details.approved}" data-comment="${details.comment}">
                                            <div class="flex items-center">
                                                <div>
                                                    <div class="event__title truncate">
                                                        ${details.requester}
                                                    </div>
                                                    <div class="text-slate-500 text-xs mt-0.5">Requested an e_signature for the ${details.type}</div>
                                                    <div class="text-slate-500 text-xs mt-0.5">${details.date_requested}</div>
                                                </div>
                                            </div>
                                            ${details.stat}
                                        </div>`;
                                        tbdy.append(cd);
                            });
                    });
                } else
                {
                    cd = `<div class="p-2 transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 event cursor-pointer rounded-md" style="justify-content: space-between;">
                                <div class="text-center">
                                    <span> No E-signature request </span>
                                </div>
                            </div>`;

                        tbdy.append(cd);
                }
        }
    });
}

/*filter the e-sig requester*/
function filterEsigRequester()
{
    let typingTimer = '',
        doneTypingInterval = 1000;

    $('#filter_e_sig').on('input', function() {

        clearTimeout(typingTimer);
        filter_esig.FilterName = $(this).val();

        typingTimer = setTimeout(function(){
            fetchRequestedEsig(e_sig.AllowEsig,filter_esig.FilterName);
            },doneTypingInterval);
        });
}

/*Grant Access to esig*/
function esigGrantAccess(id,stat,comment)
{
    $.ajax({
        type:"POST",
        url: bpath + "ors/allow/esig",
        data:{_token,id,stat,comment},
        dataType:"json",

        success:function(response)
        {
            if(response.status === true)
            {
                __notif_show(1,'',response.message);
                request_e_sig.hide();
                fetchRequestedEsig(e_sig.AllowEsig,filter_esig.FilterName);
            } else
            {
                __notif_show(-1,'','Error please try again');
                request_e_sig.hide();
            }
        }

    });
}

/*Check to allow the e_signature*/
function allow_signatory_e_sig()
{
    $("body").on("click",".request_e_sig_list",function(){

        let id = $(this).attr("id"),
            requester_name = $(this).data("requester"),
            request_type = $(this).data("type"),
            requested_date = $(this).data("requested_date"),
            date = $(this).data("request_send"),
            stat = $(this).data("stat"),
            comment = $(this).data("comment");

            requester_id = id;

            $("#requester_name").text(requester_name);
            $("#request_type").text(request_type);
            $("#request_date").text(requested_date);
            $("#send_date").text(date);
            $("#grant_user_esig").val(stat);
            $("#comment_mpor").val(comment);

            if(request_type === "MPOR")
            {
                $("#mpor_comment").show();
            } else
            {
                $("#mpor_comment").hide();
            }
            request_e_sig.show();

    });
}

/*Check if the allow esig is approve or not*/
function checkEsigStatus()
{
    /*Unapproved*/
    $("#btn_unapproved_esig").on("click",function(){
        e_sig.AllowEsig = 0;
        fetchRequestedEsig(e_sig.AllowEsig,filter_esig.FilterName)
    });

    /*Approved*/
    $("#btn_approved_esig").on("click",function(){
        e_sig.AllowEsig = 1;
        fetchRequestedEsig(e_sig.AllowEsig,filter_esig.FilterName)
    });
}

/*Saved the data whether to grant esig access or not*/
function grantEsigAccess()
{
    $("#btn_allow_esig").on("click",function(){

        let stat = $("#grant_user_esig").val(),
            comment = $("#comment_mpor").val();

        esigGrantAccess(requester_id,stat,comment);
    });
}

/*get the value of the rating*/
function clickRating()
{
    $('body').on('click','.rating input[type="radio"]', function() {
       // Find the closest row (tr)
        var row = $(this).closest('tr');
       // Get the value of the selected star rating
        var selectedValue = $(this).val();
       // Update the corresponding other_specify_rate field
        var specifyRateField = row.find('.other_specify_rate');
       specifyRateField.text(selectedValue); // Update with selectedValue
    });
}

/*Add a predined comments*/
function clickPredefinedComment()
{
    $("body").on("click",".pre_defined_comments", function(){
        let text = $(this).text();

        $("#ratee_comments").val(text);
        $("#multiple_ratee_comment").val(text);
    });
}

/*Toggle to display the e_sig approval*/
function toggle_e_sig_approval()
{
    $("#btn_toggle_e_sig").on("click",function(){

        let e_sig_display = $("#e_sig_approval_div"),
            ors_rating_calendar = $("#rating_calendar_div");

        if(!e_sig_display.is(':visible'))
        {
            e_sig_display.removeClass('hidden');
            ors_rating_calendar.addClass('lg:col-span-9');

        } else
        {
            e_sig_display.addClass('hidden');
            ors_rating_calendar.removeClass('lg:col-span-9');
        }
        rating_calendar.updateSize();
    });
}

//rate walkthrough
function rateWalkthrough()
{
    $("#btn_toggle_rate").on("click",function(){
        rateDemo();
    });
}

//provide the demo on the rating

function rateDemo()
{
    introJs().setOptions({
        showBullets:false,
        showStepNumbers:true,
        buttonClass:'btn btn-sm btn-rounded btn-primary-soft',
        nextLabel:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-4 h-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
        prevLabel:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left w-4 h-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
        stepNumbersOfLabel: '-',

        steps: [
            {
                title: 'Welcome',
                intro:'Hi let me show you around 👋',
            },
            {
                title: 'Select date',
                intro:'This feature allows users to filter tasks by a specific date, making it easier to locate and manage tasks within a defined timeframe.',
                element: document.querySelector('#rate_date_div'),
            },
            {
                title: 'Status',
                intro:'Allows the user to filter the task based on its status whether it is unrated, rated or return.',
                element: document.querySelector('#rate_status_div'),
            },
            {
                title: 'Event task',
                intro:'Display all task list submitted by a ratee based on a specific date.',
                element: document.querySelector('.fc-day-today'),
            },
            {
                title: 'Return',
                intro:'Return the task submitted by the ratee.',
                element: document.querySelector('.rate_return_div'),
            },
            {
                title: 'Return Task',
                intro:'"Return Task" button is clicked, a modal will appear prompting the rater to confirm the task return and provide a message explaining the reason for returning it.',
                element: document.querySelector('#btn_return_task'),
            },
            {
                title: 'Return Comment',
                intro:'View the comment on the return task.',
                element: document.querySelector('#btn_view_return_comment'),
            },
            {
                title: 'Task',
                intro:'Displays the task submitted by the ratee.',
                element: document.querySelector('#ratee_task_div'),
            },
            {
                title: 'File Attachment',
                intro:'Displays the file attachment that the ratee submitted.',
                element: document.querySelector('#file_attachment_div'),
            },
            {
                title: 'Rate',
                intro:'Evaluate the submitted task by selecting an appropriate star rating, where each star corresponds to a specific value.',
                element: document.querySelector('#rating_ors_tb'),
            },
            {
                title: 'Comment List',
                intro:'Select a pre-difined list of comment below.',
                element: document.querySelector('#rate_comment_list_div'),
            },
            {
                title: 'Comment',
                intro:'Enter a comment for the task.',
                element: document.querySelector('#comment_div'),
            },
            {
                title: 'Save',
                intro:'Click the save button to rate the task.',
                element: document.querySelector('#btn_save_rating'),
            },
            {
                title: 'Task list',
                intro:'Display all the list of task based on the current month.',
                element: document.querySelector('#btn_ors_multiple_list'),
            },
            {
                title: 'Rated Task',
                intro:'Display all the rated task',
                element: document.querySelector('#btn_multiple_rated_task'),
            },
            {
                title: 'Unrated Task',
                intro:'Display all the unrated task.',
                element: document.querySelector('#btn_multiple_unrated_task'),
            },
            {
                title: 'Select Date',
                intro:'Navigate through different tasks by selecting a date, whether they are rated or unrated.',
                element: document.querySelector('.filter_date_range'),
            },
            {
                title: 'Bulk rate',
                intro:'Rate mulitple task simultaneously.',
                element: document.querySelector('.rate_multiple_task'),
            },
            {
                title: 'Select all',
                intro:'Select all unrated tasks for review and rating.',
                element: document.querySelector('#select_all_task_div'),
            },
        ]
        }).onafterchange(function(targetElement){

            if(targetElement.classList.contains('fc-day-today'))
            {
                fetchSpmsRating();
                employee_rate_task.show();

            } else if(targetElement.classList.contains('rate_return_div'))
            {
                return_dropdown.show();
            } else if(targetElement.classList.contains('ratee_task_div'))
            {
                return_dropdown.hide();
            }
            else if(targetElement.classList.contains('task_list'))
            {
                employee_rate_task.hide();
                task_list.show();

            }
        }).oncomplete(function(){
            task_list.hide();
        }).start();
}



