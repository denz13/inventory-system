var get_date = {GLobalDate:''};
var lite_picker = '';
var multiple_picker = '';
var event_id = {GLobalCalendarEventId:''};
var start_date = {StartDate:''};
var bool_rated = {GlobalBool:''};
var timestamp_id = {GlobalTimestamp_id:''};
var task_data = '' , task_status = '';
var calendar = '';
var recurring_date_ref = {GlobalRecurringDate:''};
const ors_task = {Id:''};
var cell_bg_color  = {Calendar:null};
//var countUnrateStat = countUnrateStat || {};

//const myAccordion_addAttachment = tailwind.Accordion.getOrCreateInstance(document.querySelector("#attach_file"));
const return_modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#return-modal-preview"));
const cancel_modal_ors = tailwind.Modal.getInstance(document.querySelector("#cancel_modal_ors"));
const delete_ors_task = tailwind.Modal.getInstance(document.querySelector("#delete-ors-modal"));
const error_modal = tailwind.Modal.getInstance(document.querySelector("#error_ors_modal"));
const ors_rated_modal = tailwind.Modal.getInstance(document.querySelector("#rated_ors"));
const myDropdown = tailwind.Dropdown.getOrCreateInstance(document.querySelector("#color_dropdown"));


$(document).ready(function(){

    bpath = __basepath + "/";

    //myAccordion_addAttachment.hide();

    getCurrentDate();

    initilzeCalendar();
    initialDatePicker();
    initializeDateRangePicker();
    initializeEditor();
    initializeSelect2();
    getUnratedCount(get_date.GlobalDate);
    getEmployee();
    // getCategoryDataType();
    close_ors_canvas();
    getSelectedDate();
    cancelModalButton();
    savedData();
    displayOrsData(bool_rated.GlobalBool,get_date.GlobalDate);
    clickRatedTab();
    clickUnRatedTab();
    getTheme();
    //select theme
    selectTheme();
    clickOrsColor();
    //cancel ors
    passTimestampId();
    cancelOrs();
    triggerDeleteOrsTask();
    //change the ors tab color
    changeTabColor();
    //toggle to display the recurring task
    toggleRecurringTask();
    //ors task list
    clickOrsTask();
    //mulitple filter date
    filterOrsCalendar();
    //filter the task by status
    filterTaskStatus();
    //dynamic title
    //dynamicTitleCreation();
    //fetch the title
    //displayTitle();
    removeLabelPlaceHolder();
    emptyRecurrentFields();
    filterRecurringTask();
    saveRecurringEvent();
    fetchRecurringTask();
    changeRecurringColorTheme();
    fetchRecurringEmployee();
    deleteRecurringTask();
    updateRecurringTask();
    clearRecurringId();
    selectThemeColor();
    clickColor();
    task_demo();
});


/*========================================== BEGIN:Initialization ======================================================*/

/*Calendar Initialization*/
function initilzeCalendar()
{
    try
    {
        /*External events*/
        var containerEl = document.getElementById('recurring_list_div');

		new FullCalendar.Draggable(containerEl, {
            itemSelector: '.external-event',
            eventData: function(eventEl) {
                let data = eventEl.dataset;

                return {
                    title: data.title,
                    backgroundColor: data.color_theme,
                    borderColor: '#FF0000',
                }

            },
            removeClone: true // Ensure the clone is removed after drop
		});

        var calendarEl = document.getElementById('ors_calendar');
		    calendar = new FullCalendar.Calendar(calendarEl, {

		headerToolbar: {
			left: 'dayGridMonth',
			center: 'prev,next today',
			right: 'title',
		},
        initialDate:get_date.GLobalDate,
        selectable: true,
        selectMirror: true,
        editable: false,
        eventOverlap: true,
        weekNumbers: false,
        navLinks: false, // can click day/week names to navigate views
        nowIndicator: true,
        droppable: false,
        displayEventTime: false,
        lazyFetching:true,
        droppable: true,

        eventReceive: function(info) {
            showLoading();
            info.revert(); // Revert the event to its original position
        },

        drop: function(arg) {

            let event = arg.draggedEl,
                data = event.dataset,
                recurringDateAndTime = arg.dateStr.split('T'),
                convertdate = moment(recurringDateAndTime[0]).format('MM/DD/YYYY');

                //hide the create ors modal
                hide_slideover();
                //populate the data
                fetchCreateOrsInfo(data.title,convertdate,convertdate,'08:00','17:00',data.rater,data.type,data.task,'',data.color,data.quantity);

                //saved the data
                $('textarea[name="content"]').val(data.task);
                $('input[name="recurrence"]').val(data.id);
                createOrs();
                hideLoading();
		},

		dateClick: function(arg) {

            //clear the fields when clear
            $("#ors_form")[0].reset();
            $("#title").text('');
            $("#submit_task").val(null).trigger('change');
            $("#function_type").val(null).trigger('change');
            task_data.setData('');

            //automatically set the date
            let dateAndTime = arg.dateStr.split('T'),
                convertdate = moment(dateAndTime[0]).format('MM/DD/YYYY');

            /*Set the time and hour in the calendar*/
            setDateRangePicker(convertdate,convertdate,'8','0','17','0')

            //set the active tab
            setListTabActive();
            //set the postion modal
            popupModalDisplay(arg);

            //add a color on the date cell
            if(cell_bg_color.Calendar)
            {
                $(cell_bg_color.Calendar).css('background-color','')
            }

            cell_bg_color.Calendar = arg.dayEl;
            arg.dayEl.style.backgroundColor = '#e9ffff';

            calendar.unselect();
        },

        eventClick: function(info)
        {
                //check whether to display the modal
                let display = info.event.extendedProps.status,
                    title = info.event.extendedProps.full_title,
                    timestart = info.event.extendedProps.date_range_start,
                    timeend = info.event.extendedProps.date_range_end,
                    submitted_to = info.event.extendedProps.submitted_to,
                    type = info.event.extendedProps.type,
                    description = info.event.extendedProps.description,
                    id = info.event.id,
                    colorid = info.event.extendedProps.colorid,
                    quantity = info.event.extendedProps.quantity,
                    comment = info.event.extendedProps.comment,
                    hour_start = info.event.extendedProps.hour_start,
                    hour_end = info.event.extendedProps.hour_end;

                //append the date of the comment
                $("#rater_return_comment").empty('');

                //display the data in the modal
                if(display === '0')
                {
                    eventPopupModalDisplay(info);
                    setListTabActive();
                    fetchCreateOrsInfo(title,timestart,timeend,hour_start,hour_end,submitted_to,type,description,id,colorid,quantity);

                } else if(display === '1')
                {
                    hide_slideover();
                    getRatedOrs(id);
                }
                else if(display === '2')
                {
                    return_modal.show();
                    $("#rater_return_comment").append(comment);
                    hide_slideover();

                    //display the create ors modal
                    $("#btn_view_create_ors").on("click",function(){
                        eventPopupModalDisplay(info);
                        setListTabActive();
                        fetchCreateOrsInfo(title,timestart,timeend,hour_start,hour_end,submitted_to,type,description,id,colorid,quantity);
                    });
                }
                else if(display === undefined)
                {
                    __notif_show(-1,'','Please save the task first before making any edits.');
                }
                else
                {
                    __notif_show(-1,'','This task cannot be edit, since it is rated already.');
                }
        },

        //display the tool tip
        eventDidMount: function(info) {

            //adjust the style on the border radius in the display event
            info.el.style.borderRadius = '15px';

            var tooltip = new Tooltip(info.el, {
                title: info.event.extendedProps.ratee_name,
                placement: 'top',
                trigger: 'hover',
                container: 'body',
                template: `<div class="tooltip custom-tooltip flex items-center bg-slate-50 dark:bg-transparent dark:border text-xs" role="tooltip">
                                <div class="popper__arrow tooltip-arrow"></div>
                                    <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                        <img alt="DSSC" src="${info.event.extendedProps.image}">
                                    </div>
                                    <div class="ml-2 mr-auto">
                                            <div class="font-medium tooltip-inner"></div>
                                            <div class="text-slate-500 text-xs mt-0.1"> Date rated: <span> ${info.event.extendedProps.date_rated}</span></div>
                                            <div class="text-slate-500 text-xs mt-0.1">
                                                Status:<span class="${info.event.extendedProps.bg} cursor-pointer font-xs ml-1">
                                                    ${info.event.extendedProps.stat}</span>
                                            </div>
                                    </div>
                            </div>`
                });


            $(info.el).on('click','.btn_delete_ors',function(e){
                e.stopPropagation();
                hide_slideover();
                if(info.event.id !== '' || info.event.id !== null)
                {
                    ors_task.Id = info.event.id;
                    delete_ors_task.show();
                }

            });
        },

        //responsible to display the event
        events: function(fetchInfo, successCallback, failureCallback) {

            $.ajax({
                type: "POST",
                url: bpath + "ors/dispay/event",
                data:{  _token,
                        start_date:start_date.StartDate,
                        status:task_status,
                    },
                async:true,
                beforeSend:function(){
                    showLoading();
                },
                success:function(response){

                        let event = response;

                        if(event.length > 0)
                        {
                            successCallback(event);
                        } else
                        {
                            successCallback(event);
                        }
                        hideLoading();
                }
            });
        },

        //display the design of the icon in the event
        eventContent: function(info,element) {
            //Destructure properties for readability
            const { status } = info.event.extendedProps;
            const { title } = info.event;
            var btn_delete = '';

            //check to display the delete icon
            if(status === '0')
            {
                btn_delete = '<i class="fa-solid fa-xmark w-4 h-4 text-danger cursor-pointer btn_delete_ors"></i>';
            }

           //Use template literals for cleaner structure
            const html = `
                    <div class="fc-event-title-container items-center">
                        ${btn_delete}
                        <div class="fc-event-title fc-sticky">${title}</div>
                    </div>`;

            //Trim to avoid extra spaces
            return { html: html.trim() };
        }
	});

    calendar.render();

        /*click the previous button on the calendar*/
        $("body").on("click","button.fc-prev-button", function()
        {
            let current_date = calendar.getDate();
                formated_date = getDateFormat(current_date);

                hide_slideover();
                start_date.StartDate = formated_date;

                //reload the calendar
                calendar.refetchEvents();
                //reload the side panel
                displayOrsData(bool_rated.GlobalBool,formated_date);
                //reload the unrated count
                getUnratedCount(formated_date);
                //recurring_date_ref.GlobalRecurringDate = formated_date;
        });

        /*click the next button on the calendar*/
        $("body").on("click","button.fc-next-button", function()
        {
            let current_date = calendar.getDate();
                formated_date = getDateFormat(current_date);

                hide_slideover();
                start_date.StartDate = formated_date

                //reload the calendar
                calendar.refetchEvents();
                //reload the side panel
                displayOrsData(bool_rated.GlobalBool,formated_date);
                //reload the unrated count
                getUnratedCount(formated_date);
        });

    }catch(error)
    {
        console.log(error.message);
    }
}

/*Initialize the checkeditor*/
function initializeEditor()
{
    try
    {
        ClassicEditor
        .create(document.querySelector('#task_input'), {
            toolbar: {
                items: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'link',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'undo',
                    'redo'
                ]
            },
            language: 'en',
        })
        .then(editor => {
            task_data = editor;
        })
        .catch(error => {
            console.error('Error initializing editor:', error);
        });

    }
    catch(error)
    {
        console.log(error);
    }
}

/*Initlaize the select2*/
function initializeSelect2()
{
    //assign to submit
    $("#submit_task").select2({
        placeholder: "Select rater",
        closeOnSelect: true,
        allowClear:true,
    });

    //function type
    $("#function_type").select2({
        placeholder: "Select type",
        closeOnSelect: true,
        allowClear:true,
    });

     //function type
    //  $("#recurrence").select2({
    //     placeholder: "Select recurrence",
    //     closeOnSelect: true,
    //     allowClear:true,
    // });
    //select 2

    $("#filter_calendar_stat").select2({
        placeholder: "Status",
        closeOnSelect: true,
        allowClear:true,
    });

    // //title type
    // $("#title").select2({
    //     placeholder: "Status",
    //     closeOnSelect: true,
    //     allowClear:true,
    //     tags: true,
    // })

    //submit to recurrent
    $("#recurring_submit_task").select2({
        placeholder: "personel",
        closeOnSelect: true,
        allowClear:true,
    });

     //submit to recurrent
    $("#recurring_task_type").select2({
        placeholder: "type",
        closeOnSelect: true,
        allowClear:true,
    });
}

/*Lite picker initialization*/
function initialDatePicker()
{
    let element_id = 'select_calendar_date',
        calendar_picker = 'filter_task_date';

    lite_picker = new Litepicker({
        element: document.getElementById(element_id),
        autoApply: false,
        singleMode: true,
        numberOfColumns: 1,
        numberOfMonths: 1,
        showWeekNumbers: false,
        startDate: new Date(),
        format: 'DD MMM, YYYY',
        allowRepick: true,
        dropdowns: {
            minYear: 1950,
            maxYear: 2100,
            months: true,
            years: true
        }
    });

    multiple_picker = new Litepicker({
        element: document.getElementById(calendar_picker),
        autoApply: false,
        singleMode: true,
        numberOfColumns: 1,
        numberOfMonths: 1,
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
}

/*Initialize the date-range picker*/
function initializeDateRangePicker()
{
    let date_range_picker = $('input[name="datefilter"]');

        /*Initialization process*/
        date_range_picker.daterangepicker({
            timePicker: true,
            startDate: moment().set({ hour: 8, minute: 0 }).startOf('hour'),
            endDate: moment().set({ hour: 17, minute: 0 }).startOf('hour'),
            locale: {
                format: 'MM/DD/YYYY-HH:mm',
                cancelLabel: 'Clear'
            },
            autoUpdateInput: false,
            minTime: '08:00:00',
            maxTime: '17:00:00',
        });

        /*When click select the date*/
        $('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('MM/DD/YYYY-hh:mm') + ' - ' + picker.endDate.format('MM/DD/YYYY-HH:mm'));
        });

        /*Clear the selected date when apply*/
        $('input[name="datefilter"]').on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });
}

/*Set the data on the date range picker*/
function setDateRangePicker(timestart,timeend,start_hour,start_minute,end_hour,end_minute)
{
    $('input[name="datefilter"]').daterangepicker({
        timePicker: true,
        startDate: moment(timestart).set({hour:start_hour, minute:start_minute}).startOf('hour'),
        endDate: moment(timeend).set({hour:end_hour, minute:end_minute}).startOf('hour'),
        locale: {
            format: 'MM/DD/YYYY-HH:mm',
            cancelLabel: 'Clear'
        },
    });

    $('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('MM/DD/YYYY-hh:mm') + ' - ' + picker.endDate.format('MM/DD/YYYY-HH:mm'));
    });
}

/*========================================== END:Initialization ======================================================*/

//handle the display positioning of the modal in the date click
function popupModalDisplay(arg)
{
    // Get the position of the clicked date element
    let dateElement = $(arg.dayEl); // The clicked date element
    let datePosition = dateElement.offset(); // Get the position of the clicked date
    let dateHeight = dateElement.height(); // Get the height of the clicked date element
    let dateWidth = dateElement.width(); // Get the width of the clicked date element

    // Get the viewport width and height
    let viewportWidth = $(window).width();
    let viewportHeight = $(window).height();

    // Define modal dimensions
    let modalHeight = 300; // Approximate height of the modal
    let modalWidth = 400; // Width of the modal

    // Calculate the modal's top and left position
    let modalTop = datePosition.top; // Align the modal to the top of the clicked date
    let modalLeft = datePosition.left + dateWidth + 5; // Default position of the modal to the right of the date

    // Default modal position is "right"
    let modalPosition = "right";

    // Check if the clicked date is in the last column
    let calendar = $('#calendar'); // FullCalendar instance
    let lastColumnIndex = calendar.find('.fc-day').last().index(); // Get the index of the last column
    let clickedDateColumnIndex = dateElement.index(); // Get the clicked date's column index

    // If the clicked date is in the last column on the left, move the modal to the right
    if (clickedDateColumnIndex === lastColumnIndex) {
    modalLeft = datePosition.left - modalWidth - 5; // Position the modal left of the date
    modalPosition = "left"; // Change position to "left"
    }

    // If the clicked date is near the right side of the screen, change the modal position to the left
    if (datePosition.left + dateWidth + modalWidth > viewportWidth) {
    // Calculate the available space between the right edge of the viewport and the clicked date
    let spaceToRight = viewportWidth - (datePosition.left + dateWidth);

    // Adjust the modal position to the left side, but use the available space to prevent overflow
    modalLeft = datePosition.left - modalWidth - 5; // Position the modal left of the date
    if (spaceToRight < modalWidth) {
    modalLeft = datePosition.left - modalWidth - 5; // Prevent modal from overflowing on the left side
    }
    modalPosition = "left"; // Change position to "left"
    }

    // Adjust for available vertical space
    if (modalTop + modalHeight > viewportHeight) {
    // If there's not enough space at the bottom, position the modal above
    modalTop = datePosition.top - modalHeight - 10;
    modalPosition = modalPosition === "left" ? "left-top" : "right-top"; // Modal on top of the date
    }

    // Show the modal and set the position dynamically
    let modal = $('.offcanvas');
    modal.css({
    'top': modalTop + 'px',
    'left': modalLeft + 'px',
    'display': 'block'
    });

    // Optional: Apply different animations for different positions
    if (modalPosition === "left" || modalPosition === "left-top") {
        modal.removeClass('slideRight').addClass('slideLeft');
    }
    else
    {
        modal.removeClass('slideLeft').addClass('slideRight');
    }

    //add animation
    modal.show();
    modal.css('animation', 'fadeIn 0.8s forwards');
}

//handle the display positioning of the modal in the event click
function eventPopupModalDisplay(info)
{
    // Get the position of the clicked event element
    let eventElement = $(info.el); // The clicked event element
    let eventPosition = eventElement.offset(); // Get the position of the clicked event
    let eventHeight = eventElement.height(); // Get the height of the clicked event element
    let eventWidth = eventElement.width(); // Get the width of the clicked event element

    // Get the viewport width and height
    let viewportWidth = $(window).width();
    let viewportHeight = $(window).height();

    // Define modal dimensions
    let modalHeight = 300; // Approximate height of the modal
    let modalWidth = 400; // Width of the modal

    // Calculate the modal's top and left position
    let modalTop = eventPosition.top; // Align the modal to the top of the clicked event
    let modalLeft = eventPosition.left + eventWidth + 5; // Default position of the modal to the right of the event

    // Default modal position is "right"
    let modalPosition = "right";

    // Get the calendar container element
    let calendar = $('#calendar');
    let calendarWidth = calendar.width(); // Get the width of the calendar container

    // Check if the clicked event is near the right side of the calendar
    if (eventPosition.left + eventWidth + modalWidth > viewportWidth) {
        let spaceToRight = viewportWidth - (eventPosition.left + eventWidth);
        modalLeft = eventPosition.left - modalWidth - 5; // Position the modal to the left of the event

        if (spaceToRight < modalWidth) {
        modalLeft = eventPosition.left - modalWidth - 5; // Prevent modal from overflowing on the left side
        }
        modalPosition = "left"; // Change position to "left"
    }

    // Adjust for available vertical space
    if (modalTop + modalHeight > viewportHeight) {
        modalTop = eventPosition.top - modalHeight - 10; // Position the modal above the event
        modalPosition = modalPosition === "left" ? "left-top" : "right-top"; // Modal on top of the event
    }

    // Show the modal and set the position dynamically
    let modal = $('.offcanvas');
    modal.css({
        'top': modalTop + 'px',
        'left': modalLeft + 'px',
        'display': 'block'
    });

    // Optional: Apply different animations for different positions
    if (modalPosition === "left" || modalPosition === "left-top") {
        modal.removeClass('slideRight').addClass('slideLeft');
    }
    else
    {
        modal.removeClass('slideLeft').addClass('slideRight');
    }

     //add animation
    modal.show();
    modal.css('animation', 'fadeIn 0.8s forwards');
}

//custom slide over
function show_slideover()
{
    // Fade-in when opening
    let offcanvas_modal = $('.offcanvas');

    offcanvas_modal.show();
    offcanvas_modal.css('animation', 'fadeIn 0.8s forwards');
}

//hide the slide over
function hide_slideover()
{
    let offcanvas = $("#close_canvas").parent().parent();

    // Apply the fade-out animation
    offcanvas.css('animation', 'fadeOut 0.8s forwards');
    clearfields();
    // Set a timeout to hide the element after the fade-out animation completes
    setTimeout(function() {
        offcanvas.hide();
        offcanvas.css('animation', '');
    }, 800);
    //clear the cell background color
    $(cell_bg_color.Calendar).css('background-color','');
}

//close the ors canvas when the x is click
function close_ors_canvas()
{
    $("#close_canvas").on("click",function(){
        hide_slideover();
    });
}

//Ors tab color change
function changeTabColor()
{
    $(".ors_tab").on("click",function(){
        $(".ors_tab").removeClass('btn-sm btn btn-rounded btn-primary-soft');
        $(this).addClass('btn-sm btn btn-rounded btn-primary-soft');
    });
}

//set the tab to be always events whenever open
function setListTabActive()
{
    $("#event_tab_list").addClass('active');
    $("#task_tab_list").removeClass('active');
    $("#attachment_tab_list").removeClass('active');
    $("#task_tab").addClass('active');
    $("#ors_task_tab").removeClass('active');
    $("#attachment_tab").removeClass('active');

    //remove the button class
    $("#btn_event").addClass('btn btn-sm btn-rounded btn-primary-soft');
    $("#btn_task").removeClass('btn btn-sm btn-rounded btn-primary-soft');
    $("#btn_file").removeClass('btn btn-sm btn-rounded btn-primary-soft');

    //remove the error text color
    $("#btn_task").removeClass('text-danger');
    $("#btn_event").removeClass('text-danger');
}

//hide and show the recurring task
function toggleRecurringTask()
{
    $("#btn_toggle_recurring_task").on("click",function(){

        let recurring_task = $('#recurring_task_display'),
            event_task = $('#event_task_display');

        //close the create ors modal
        hide_slideover();

        if(!recurring_task.is(':visible'))
        {
            recurring_task.removeClass('hidden');
            event_task.addClass('lg:col-span-9');

        } else
        {
            recurring_task.addClass('hidden');
            event_task.removeClass('lg:col-span-9');
        }
        calendar.updateSize();
    });
}

/*===================================Off Canvas =============================================*/


/*==========================Server side==================================*/

/*Populate the data to display in the create ors*/
function fetchCreateOrsInfo(title,timestart,timeend,hour_start,hour_end,submitted_to,type,description,id,colorid,quantity)
{
    start_hour = hour_start.split(':'),
    hour_end = hour_end.split(':');
    /*Set data in the date range picker */
    setDateRangePicker(timestart,timeend,start_hour[0],start_hour[1],hour_end[0],hour_end[1]);

    $("#title").text(title);
    $("#submit_task").val(submitted_to).trigger('change');
    $("#function_type").val(type).trigger('change');
    task_data.setData(description);
    $("#event_id").val(id);
    $("#selected_color").val(colorid);
    $("#quantity").val(quantity);
    //$("#recurrence").val(info.event.extendedProps.recurrence).trigger('change');
}

/*Popoulate the select 2 with employee*/
function getEmployee()
{
    try
    {
        $.ajax({
            type: "POST",
            url: bpath + "ors/list-employee",
            data:{_token},

            success:function(response)
            {
                $("#submit_task").val(null).trigger("change");

                if(response !==null && response !=='')
                {
                    let data = JSON.parse(response);
                    let options = '';

                    $.each(data,function(index,value){

                        options = new Option(value.name,value.id,false,false)

                        $("#submit_task").append(options).trigger("change");
                    });
                }
            }
        });
    }
    catch(error)
    {
        alert(error.message);
    }
}

/*save the task data*/
function createOrs()
{
    try
    {
        // Serialize the form data
        let fd = $("#ors_form").serialize(),
            title = $("#title").text(),
            button = $("#btn_save_ors");

        // Append a value in the serialization
        fd += "&title=" + encodeURIComponent(title);

        $.ajax({
            type: "POST",
            url: bpath + "ors/save/ors-data",
            data: fd,
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

                if (response.status === true)
                {
                    button.prop('disabled',false);
                    button.html('Save');
                    __notif_show(1, '', response.message);
                    clearfields();
                    $("#ors_form")[0].reset();
                    hide_slideover();
                    //myAccordion_addAttachment.hide();
                    displayOrsData(bool_rated.GlobalBool,getCurrentDate(start_date.StartDate));
                    getUnratedCount(getCurrentDate(start_date.StartDate));
                    calendar.refetchEvents();
                }
                else if(response.status === 500)
                {
                    button.prop('disabled',false);
                    button.html('Save');
                    error_modal.show();
                    $('#error_text').text(response.message);

                }
            }
        });

    }catch(error)
    {
        console.log(error.message);
    }
}

//get the category data and append in the select 2
function getCategoryDataType()
{
    try
    {
        $.ajax({
            type: "GET",
            url: bpath + 'ors/get/category-data',
            data:{_token},

            success:function(response)
            {
                if(response!==null && response!=='')
                {
                    $("#function_type").val(null).trigger("change");

                    let data = JSON.parse(response);

                    $.each(data,function(index,value)
                    {
                        options = new Option(value.category_name,value.category,false,false);
                        $("#function_type").append(options).trigger("change");

                    });
                }
            }
        });
    }
    catch(error)
    {
        console.log(error.message);
    }
}

//display the newly Ors in the side panel
function displayOrsData(stat,date)
{
    try
    {
        let div = $("#side_display_ors");
        $.ajax({
            type: "GET",
            url: bpath +'ors/display/ors-data',
            data:{_token,stat,date:date},

            beforeSend: function(){
                div.empty('');
                div.append(`<div class="text-center col-span-12" style="margin-top:20px">
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
                $("#side_display_ors").empty('');

                let data = JSON.parse(response);

                if(data !== null && data !== '')
                {
                    $.each(data, function(index,value){

                        /**/

                        let cd = '';

                            cd = `<div class="box px-5 py-3 flex-1 zoom-in mt-4" style="border-right:12px solid ${value.color};">
                                    <div class="flex items-center">
                                        ${value.delete}
                                    </div>
                                    <div class="flex items-center">
                                        <div class="font-semibold tooltip" title="${value.fulltitle}">${value.title}</div>
                                        <div class="text-xs font-semibold text-slate-500 ml-auto ">${value.timestamp}</div>
                                    </div>
                                        <div class="flex items-center mt-2">
                                            <div class="mr-auto leading-relaxed text-slate-500 text-xs text-justify mt-1">${value.description}</div>
                                            <div>${value.status}</div>
                                        </div>
                                </div>`;

                        $("#side_display_ors").append(cd);
                    });
                }
                else
                {
                    let cd = '';

                    cd = `<div class="box px-4 py-4 mb-3 flex items-center flex flex-col justify-end items-center py-1 zoom-in">
                            <svg data-v-ad307406="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="fa-bounce w-10 h-10 lucide lucide-animal animal-icon">
                                <path d="M16 7h.01"></path><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"></path><path d="m20 7 2 .5-2 .5"></path>
                                <path d="M10 18v3"></path><path d="M14 17.75V21"></path><path d="M7 18a6 6 0 0 0 3.84-10.61"></path>
                            </svg>
                            <div class="text-base">No task found</div>
                        </div>`;

                $("#side_display_ors").append(cd);
                }
            }
        });
    }
    catch(error)
    {
        console.log(error.message);
    }
}

//get the notification count of the
function getUnratedCount(date)
{
    try
    {
        $.ajax({
            type: "GET",
            url: bpath + "ors/count/unrated-ors",
            data:{_token,date:date},

            success:function(response)
            {
                $("#ors_count_stat").empty();
                if(response!=='' && response!==null)
                {
                    let data = JSON.parse(response);

                    if(data!=='' && data!==null)
                    {
                        let cd = '';

                        cd = `<div class="w-5 h-5 flex items-center justify-center absolute top-0 right-0 text-xs text-white rounded-full bg-danger font-medium -mt-1 -mr-1 fa-beat">${data}</div>`;

                        $("#ors_count_stat").append(cd);
                    }
                }
            }
        });
    }catch(error)
    {
        console.log(error.message);
    }
}

//cancel the ors trough timestamp
function cancelOrsTask(id)
{
    try
    {
        $.ajax({
            type:"DELETE",
            url: bpath + 'ors/cancel/ors/request',
            data:{_token,id},
            dataType:'json',

            success:function(response)
            {
                if(response.status === true)
                {
                    timestamp_id.GlobalTimestamp_id = '';
                    __notif_show(1,'',response.message);
                    calendar.refetchEvents();
                    displayOrsData(bool_rated.GlobalBool,getCurrentDate(start_date.StartDate));
                    getUnratedCount(getCurrentDate(start_date.StartDate));
                }
                else
                {
                    timestamp_id.GlobalTimestamp_id = '';
                    __notif_show(-1,'',response.message);
                }
            }
        });


    }catch(error)
    {
        console.log(error.message);
    }
}

//cancel the ors task
function deleteOrsTask(id)
{
    let button = $('#btn_delete_task');

    $.ajax({
        type: 'DELETE',
        url: '/ors/cancel/ors/task',
        data:{_token,id},
        dataType: 'json',
        beforeSend:function()
        {
            button.prop('disabled',true);
            button.html(`Delete <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2">
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
        success:function(response)
        {
            if(response.status === true)
            {
                button.html('Delete');
                button.prop('disabled',false);
                __notif_show(1,'',response.message);
                ors_task.Id = '';
                calendar.refetchEvents();
                delete_ors_task.hide();
            }
            else if(response.status === 500)
            {
                error_modal.show();
                $('#error_text').text(response.message);
                button.html('Delete');
                button.prop('disabled',false);
            }
        }
    });
}

/*==========================END:Server side==================================*/

/*check if empty or not*/
function checkMulitpleselect2(id,message)
{
    let select = $('#'+id).val();

    if(select.length > 0 && select !== undefined)
    {
        $('#'+id ).select2({
            placeholder: message,
            closeOnSelect: true,
            allowClear:true,
        });

        return true;

    }
    else
    {
        $('#'+id).select2({
            theme: "mali",
            placeholder: message,
        });

        return false;
    }
}

/*Check if it s empty or not*/
function checkSingleSelect2(id,message)
{
    let select2single = $('#'+id).val();

    if(select2single !== '' && select2single !== undefined)
    {
        $('#'+id ).select2({
            placeholder: message,
            closeOnSelect: true,
            allowClear:true,
        });

        $("#btn_event").removeClass('text-danger');

        return true;
    }
    else
    {
        $('#'+id).select2({
            theme: "error",
            placeholder: message,
        });

        $("#btn_event").addClass('text-danger');

        return false;
    }
}

/*Check if the quantity is empty or not*/
function checkQuantity()
{
    let quantity = $("#quantity").val();

    if(quantity.trim() !== '' && quantity.trim() !== null)
    {
        $('#quantity').css('border', 'none');
        $("#btn_event").removeClass('text-danger');
        return true;
    } else
    {
        $('#quantity').css('border', '1px solid #dc3545');
        $("#btn_event").addClass('text-danger');
        return false;
    }
}

/*check input if empty or not*/
function checkInput(id)
{
    if(task_data.getData() !== '' && task_data.getData() !== undefined)
    {
        $('#'+id).removeClass('border border-danger');
        $("#btn_task").removeClass('text-danger')

        return true;
    } else
    {
        $('#'+id).addClass('border border-danger');
        $("#btn_task").addClass('text-danger')

        return false;
    }
}

/*Clear the fields of the input*/
function clearfields()
{
    //remove the files when close
    myDropzone.GlobalDropzone.files.forEach(function (file) {
        myDropzone.GlobalDropzone.removeFile(file);
    });

    //clear inputs
    $("#submit_task").val('').trigger("change");
    $("#function_type").val('').trigger("change");
    $("#title").text('');
    $("#chk_editor").removeClass('border border-danger');
    initializeSelect2();
    $('#quantity').css('border', 'none');
    $("#ors_form")[0].reset();
    task_data.setData('');
    //myAccordion_addAttachment.hide();
}

/* Function to pad single-digit numbers with a leading zero*/
function pad(number) {
    return (number < 10 ? '0' : '') + number;
}

/*Get the current date*/
function getCurrentDate(date)
{
    try
    {
        let currentDate = new Date();

        let year = currentDate.getFullYear();
        let month = pad(currentDate.getMonth() + 1);
        let day = pad(currentDate.getDate());

        let getdate = year+'-'+month+'-'+day;

        if($.trim(date)!==null && $.trim(date)!=='')
        {
            if(getdate === date)
            {
                //return getdate;
                get_date.GLobalDate = getdate;
            } else
            {
                //return date;
                get_date.GLobalDate = date;
            }

        } else
        {
            //return getdate;
            get_date.GLobalDate = getdate
        }

        return get_date.GLobalDate;

    }catch(error)
    {
        alert(error.message);
    }
}

/*format date*/
function getDateFormat(date)
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

/*Filter the date to get the desire date in the fullcalendar*/
function getSelectedDate()
{
    try
    {
        lite_picker.on('selected',function (date){
            let year = date.getFullYear(),
                month = pad(date.getMonth()+1),
                day = pad(date.getDate().toString());

                start_date.StartDate = year+'-'+month+'-'+day;

                /*Reload the Ors data in the side panel*/
                displayOrsData(bool_rated.GlobalBool,start_date.StartDate);
                /*Refresh to get the Unrated Count*/
                getUnratedCount(start_date.StartDate);

                /*Reload the Ors Calendar*/
                getCurrentDate(start_date.StartDate);
                initilzeCalendar();
        });
    }
    catch(error)
    {
        console.log(error.message);
    }
}

/*Filter the ors calendar base on the date using mulitple calendar*/
function filterOrsCalendar()
{
    multiple_picker.on('selected', function(date){

        let year = date.getFullYear(),
                month = pad(date.getMonth()+1),
                day = pad(date.getDate().toString());

            /*Conver the format of the date*/
            start_date.StartDate = year+'-'+month+'-'+day;

            /*Reload the Ors data in the side panel*/
            displayOrsData(bool_rated.GlobalBool,start_date.StartDate);
            /*Refresh to get the Unrated Count*/
            getUnratedCount(start_date.StartDate);

            /*Reload the Ors Calendar*/
            getCurrentDate(start_date.StartDate);
            initilzeCalendar();
    });
}

/*Format date*/
function getSpecificDateFormat(date)
{
    try
    {
        let parseDate = new Date(date);
        let new_format_date = '';

        let year = parseDate.getFullYear(),
                        month = pad(parseDate.getMonth()+1),
                        day = pad(parseDate.getDate());

        new_format_date = month+'/'+day+'/'+year;

        return new_format_date;
    }
    catch(error)
    {
        alert(error.message);
    }
}

/*Saved data of the ors*/
function savedData()
{
    $("#ors_form").submit(function(e){
        e.preventDefault();

        if(checkQuantity())
        {
            if(checkSingleSelect2("submit_task","Select rater"))
            {
                if(checkSingleSelect2("function_type","Select type"))
                {
                    if(checkInput("chk_editor"))
                    {
                        let file_list = myDropzone.GlobalDropzone.getQueuedFiles().length;

                        // Define a flag to track whether createOrs() has been called
                        let createOrsCalled = false;

                        // check if there are files
                        if (file_list > 0) {
                            myDropzone.GlobalDropzone.processQueue();
                            // Define the queuecomplete event handler function
                            function handleQueueComplete() {
                                // Check if createOrs() has already been called
                                if (!createOrsCalled) {
                                    // Check if all files were successfully uploaded
                                    var allFilesUploaded = myDropzone.GlobalDropzone.getFilesWithStatus(Dropzone.SUCCESS).length === myDropzone.GlobalDropzone.files.length;

                                    if (allFilesUploaded) {
                                        // All files were successfully uploaded, now you can proceed with your logic
                                        createOrs();
                                        temp_uploaded_files.GlobalTempUloadedFile = [];

                                        // Set the flag to true to indicate that createOrs() has been called
                                        createOrsCalled = true;

                                    } else {
                                        // Handle the case where not all files were successfully uploaded
                                        __notif_show(-1, '', 'Some files failed to upload. Please try again.');
                                    }
                                }
                            }

                            // Attach the event handler to the queuecomplete event
                            myDropzone.GlobalDropzone.on("queuecomplete", handleQueueComplete);
                        }

                        if(file_list == 0)
                        {
                                createOrs();
                        }
                    }
                }
            }
        }

    })
}

//trigger to pass the id in the data
function passTimestampId()
{
    try
    {
        $("body").on('click',"#trigger_cancel_ors",function(){
            timestamp_id.GlobalTimestamp_id = $(this).data('timestamp');
            cancel_modal_ors.show();
        });

    }catch(error)
    {
        console.log(error.message);
    }
}

//trigger to cancel the ors timestamp
function cancelOrs()
{
    try
    {
        $("#btn_cancel_ors").on("click",function(){
            cancelOrsTask(timestamp_id.GlobalTimestamp_id);
            calendar.refetchEvents();
        });

    }catch(error)
    {
        console.log(error.message);
    }
}

//trigger to delete the ors task
function triggerDeleteOrsTask()
{
    $('#btn_delete_task').on('click',function(){

        deleteOrsTask(ors_task.Id);
    });
}

/*Event trigger to cancel the modal*/
function cancelModalButton()
{
    $("#btn_dismiss_slide_modal").on("click",function(){
        clearfields();
        hide_slideover();
        //clear the selected cell color
        $(cell_bg_color.Calendar).css('background-color','');
    });
}

/*Function to click the tablist*/
function clickRatedTab()
{
    try
    {
        $("#rated_tab").on("click",function(){
            bool_rated.GlobalBool = true;
            displayOrsData(bool_rated.GlobalBool,start_date.StartDate);
        });
    }catch(error)
    {
        console.log(error.message);
    }
}

/*Function to click the unrated tablist*/
function clickUnRatedTab()
{
    try
    {
        $("#unrated_tab").on("click",function(){
            bool_rated.GlobalBool = false;
            displayOrsData(bool_rated.GlobalBool,start_date.StartDate);
        });
    }catch(error)
    {
        console.log(error.message);
    }
}

/*click the ors/task*/
function clickOrsTask()
{
    $("#btn_ors_task_list").on("click",function(){
        $("#select_calendar_date").val('');
    });
}

/*Filter task based on the date*/
function filterTaskStatus()
{
    $("#filter_calendar_stat").on('select2:select', function(){

        task_status = $(this).val();

        //reload the calendar
        calendar.refetchEvents();
    });
}

//=====================================Select theme==================================================//
//get the ORS theme
function getTheme()
{
    try
    {
        $.ajax({
            type:'GET',
            url: bpath + 'ors/theme',
            data:{_token},

            success:function(response)
            {
                $("#color_type_attachment").empty();
                $("#selected_color").val('');

                if(response!==null || response!=='')
                {
                    let data = JSON.parse(response);

                    if(data.length > 0)
                    {
                    $.each(data,function(index,value){

                        let cd = '';

                            cd = `<div id="${value.id}" class="col-span-6 flex justify-center ors_color_selected" data-color="${value.color}">
                                    <div class="cursor-pointer color_change rounded-full w-4 h-4" style="background-color: ${value.color}"></div>
                                </div>`;

                            $(".color_type_attachment").append(cd);
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

//add the animation when click
function selectTheme()
{
    $("#faq-accordion-1").on("click",".get_theme",function(){
        $(".get_theme").removeClass('border border-success');

        id = $(this).attr('id');
        let $this = $(this);

        if($this.hasClass('border border-success'))
        {
            $this.css("border-width",'500px');
            $this.removeClass('border border-success');
        }
        else
        {
            $("#selected_color").val(id);
            $this.addClass('border border-success');
        }
    });
}

//display the color when selected for preview
function clickOrsColor()
{
    $("body").on("click",".ors_color_selected",function(){
        let id = $(this).attr("id"),
            color = $(this).data("color");
            myDropdown.hide();
            $('#event_ors_color').css('background-color', color);
            $("#selected_color").val(id);
    });
}

//swalfire configuration
function swalLoading()
{
    Swal.fire({
        title: "",
        html: `<div style="display: inline-flex; align-items: center;">
                    <h5 class="mr-2 font-normal text-md text-white">Loading</h5>
                    <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8" style="display: block; margin: auto;">
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
                </div>`,
        showConfirmButton: false,
        allowOutsideClick:false,
        customClass:'custom-popup-class',

    });
}

//swal close
function swalClose()
{
    return Swal.close();
}

//dynamic title
function dynamicTitleCreation()
{
    $("#title").on("select2:select", function(e){

        let val = e.params.data.text;
            id =  e.params.data.id;

        if(val !== null && val !== '')
        {
            if(!$.isNumeric(id))
            {
                id = 0;
            };

            $.ajax({
                type: "POST",
                url: bpath + "ors/create/ors/title",
                data:{_token,id,val},
                dataType: "json",

                success:function(response){

                    if(response.status === true)
                    {
                        displayTitle();
                    }
                    else
                    {
                        console.log(response.message);
                    }
                }
            });
        }
    })
}

//display the title
function displayTitle()
{
    $.ajax({
        type: 'GET',
        url: bpath + "ors/fetch/ors/title",
        data:{_token},

        success:function(response){

            let data = response.data;

            if(data !== null && data !== '')
            {
                let option = '';

                $.map(data, function(value){

                    option = new Option(value.title,value.id, false,false);
                    $('#title').append(option).trigger('change');

                })
            }
        }
    });
}

                    /*Recurring event*/

//remove the title place holder from the recurring event
function removeLabelPlaceHolder()
{
                        /*Title*/

    $("#reccurent_title").on("input",function(){

        let val = $(this).text().trim();

        if(val !== null && val !== '')
        {
            $(this).removeAttr("data-placeholder");
        } else
        {
            $(this).attr("data-placeholder","Title");
        }
    });

                        /*Quantity*/

    $("#reccurent_quantity").on("input",function(){

        let val = $(this).text().trim(),
            check_quantity =  $.isNumeric(val);

        if(val !== null && val !== '')
        {
            $(this).removeAttr("data-placeholder");

        } else
        {
            $(this).attr("data-placeholder","Quantity");
        }
    });

                        /*Days*/

    $("#reccurent_days").on("input",function(){

        let val = $(this).text().trim();
            check_numeric = $.isNumeric(val);

        if(val !== null && val !== '')
        {
            $(this).removeAttr("data-placeholder");
        } else
        {
            $(this).attr("data-placeholder","Days");
        }
    });

    $("#reccurent_task").on("input",function(){

        let val = $(this).text().trim();
            check_numeric = $.isNumeric(val);

        if(val !== null && val !== '')
        {
            $(this).removeAttr("data-placeholder");
        } else
        {
            $(this).attr("data-placeholder","Task");
        }
    });
}

function checkRecurringInput(ids,numeric)
{
    let  id = $('#'+ids);
        check_numeric = $.isNumeric(id.text().trim());

    if(id.text() !== null && id.text() !== '' )
    {
        id.removeClass('has-error');

        if(numeric == true)
            {
                if(check_numeric !== true)
                    {
                        id.addClass('has-error');
                        __notif_show(-1,'',"Please enter a numerical value !");
                        return false;

                    } else
                    {
                        id.removeClass('has-error');
                        return true;
                    }
            }

        return true;

    } else
    {
        id.addClass('has-error');

        return false;
    }
}

function checkRecurrentTask()
{
    let id = $("#reccurent_task");

    if(id.val() !== null && id.val() !== '')
    {
        id.removeClass("border-danger");
        return true;
    } else
    {
        id.addClass("border-danger");
        return false;
    }
}

function checkRecurrentColor($val)
{
    if($val !== null && $val !== '')
    {
        $("#color_dropdown").removeClass('border-danger');
        return true;
    } else
    {
        $("#color_dropdown").addClass('border-danger');
        return false;
    }
}

//empty the fields
function emptyRecurrentFields()
{
    $("body").on("click","#recurrent_task",function(){

        let reccurent_title = $("#reccurent_title"),
            reccurent_quantity = $("#reccurent_quantity"),
            reccurent_type = $("#recurring_task_type"),
            reccurent_task = $("#reccurent_task"),
            recurrent_theme = $("#recurring_theme"),
            recurrent_personel = $("#recurring_submit_task"),
            color_patch = $(".recurring_theme_color");

            reccurent_title.text('');
            reccurent_quantity.text('');
            reccurent_task.text('');
            recurrent_theme.val(null).trigger('change');
            recurrent_personel.val(null).trigger('change');
            reccurent_type.val(null).trigger('change');
            color_patch.css('background-color','#808080');

            reccurent_title.attr("data-placeholder","Title");
            reccurent_quantity.attr("data-placeholder","Quantity");
            reccurent_task.attr("data-placeholder","Task");

            if(reccurent_title.hasClass('has-error'))
            {
                reccurent_title.removeClass('has-error');
            }

            if(reccurent_quantity.hasClass('has-error'))
            {
                reccurent_quantity.removeClass('has-error');
            }

            if(reccurent_task.hasClass('border-danger'))
            {
                reccurent_task.removeClass('border-danger')
            }
    });
}

//save ors recurring data
function saveRecurringData(id,title,quantity,days,task,color,rater)
{
    try
    {
        let button = $("#btn_save_reccurent_event");
        $.ajax({
            type:"POST",
            url: bpath + "ors/create/recurrent/task",
            data:{_token,id,title,quantity,days,task,color,rater},
            dataType: "json",
            beforeSend:function(){
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
            success:function(response){

                if(response.status === true)
                {
                    button.prop('disabled', false);
                    button.html('Save');

                    __notif_show(1,'',response.message);

                    $("#reccurent_title").text('');
                    $("#reccurent_quantity").text('');
                    $("#reccurent_task").text('');

                    $("#reccurent_title").attr("data-placeholder","Title");
                    $("#reccurent_quantity").attr("data-placeholder","Quantity");
                    $("#reccurent_days").attr("data-placeholder","Days");
                    $("#reccurent_task").attr("data-placeholder","Task");

                    $("#recurring_theme").text('');
                    $("#event_color").css("background-color","#64748B");
                    $("#recurring_submit_task").val(null).trigger("change");
                    $("#recurring_task_type").val(null).trigger("change");
                    $(".recurring_theme_color").css('background-color','#808080');

                    fetchRecurringTask();

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

//filter the data for searching in the recurring task
function filterRecurringTask()
{
    let typingTimer = '',
        doneTypingInterval = 1000;

    $("#filter_recurring_task").on("input",function(){

        let val = $(this).val();

        clearTimeout(typingTimer);
        typingTimer = setTimeout(function(){
            fetchRecurringTask(val);
            },doneTypingInterval);
    });
}

//fetch the recurring task
function fetchRecurringTask(filter)
{
    try
    {
        let tbdy = $("#recurring_list_div");

        $.ajax({
            type:"GET",
            url: bpath + "ors/fetch/recurrent/task",
            data:{_token,filter},
            beforeSend:function(){
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
                $("#recurring_list_div").empty();

                let data = response.data,
                    cd = '';

                if(data.length > 0)
                {
                    $.map(data,function(value){

                        cd = `<div id="${value.id}" class="flex mt-2 p-2 text-slate-500 transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 event cursor-pointer rounded-md external-event recurring_task" data-id="${value.id}" data-title="${value.title}" data-quantity="${value.quantity}" data-type="${value.type}" data-task="${value.task_desc}" data-color="${value.theme_id}" data-color_theme="${value.theme}" data-rater="${value.rater}" style="justify-content: space-between; align-items: center;">
                                                <div class="flex items-center">
                                                    <div class="w-2 h-2 rounded-full mr-3" style="background-color:${value.theme}"></div>
                                                    <div>
                                                        <div class="event__title font-semibold">
                                                            ${value.title}
                                                        </div>
                                                        <div class="leading-relaxed text-xs tooltip" data-tooltip="${value.task_desc}" data-tooltip-pos="up" data-tooltip-length="fit" style="text-align:justify;">
                                                            ${value.task}
                                                        </div>
                                                    </div>
                                                </div>
                                                    <button id="${value.id}" class="mt-2 text-danger btn_delete_recurring_task"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>
                                            </div>`;

                        $("#recurring_list_div").append(cd);
                    });
                } else
                {
                    cd = `<div class="p-2 transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 event cursor-pointer rounded-md">
                                <div class="text-center">
                                    No task found
                                </div>
                            </div>`;

                    $("#recurring_list_div").append(cd);
                }
            }
        });

    }catch(error)
    {
        console.log(error.message);
    }
}

//select the theme color on the side
function selectThemeColor()
{
    $("#color_list").empty();

    $.ajax({
        type: "GET",
        url: bpath + "ors/fetch/recurring/theme",
        data:{_token},

        success:function(response){
            if(response)
            {
                let data = response.data,
                    cd = '';

                $.map(data,function(value){
                    cd = `<div id="${value.id}" class="col-span-6 flex justify-center color_selected" data-color="${value.color}">
                                <div class="cursor-pointer color_change rounded-full w-4 h-4" style="background-color: ${value.color}"></div>
                            </div>`;

                    $("#color_list").append(cd);
                });
            }
        }
    });
}

//click to select the color to preview the color
function clickColor()
{
    $("body").on("click",".color_selected",function(){
        let id = $(this).attr("id"),
            color = $(this).data("color");
            myDropdown.hide();
            $('#event_color').css('background-color', color);
            $("#recurring_theme").text(id);
    });
}

//Select the corresponding color
function changeRecurringColorTheme()
{
    $("#recurring_theme").on("select2:select",function(){
        let val = $('#recurring_theme option:selected').text();
        $(".recurring_theme_color").css('background',val);
    });
}

//fetch the recurring employee
function fetchRecurringEmployee()
{
    try
    {
        $.ajax({
            type:"POST",
            url: bpath + "ors/list-employee",
            data:{_token},

            success:function(response){

                if(response)
                {
                    let data = JSON.parse(response);

                    if(data.length > 0)
                    {
                        $.map(data,function(value){
                            option = new Option(value.name,value.id, false,false);
                        $('#recurring_submit_task').append(option).trigger('change');
                    });
                    }
                }
            },
        })
    }catch(error)
    {
        conosole.log(error.message);
    }
}

//trigger to save the recurrent event
function saveRecurringEvent()
{
    $("#btn_save_reccurent_event").on("click",function(){

        let id = $("#recurring_task_id").text(),
            title = $("#reccurent_title").text(),
            quantity = $("#reccurent_quantity").text(),
            type = $("#recurring_task_type").val(),
            task = $("#reccurent_task").text(),
            theme = $("#recurring_theme").text(),
            rater = $("#recurring_submit_task").val();

            if(checkRecurringInput("reccurent_title",false))
            {
                if(checkRecurringInput("reccurent_quantity",true))
                {
                    if(checkRecurringInput("reccurent_task",false))
                    {
                        if(checkRecurringInput("reccurent_task",false))
                        {
                            if(checkSingleSelect2("recurring_task_type","type"))
                            {
                                if(checkRecurrentColor(theme))
                                {
                                    if(checkSingleSelect2("recurring_submit_task","personel"))
                                    {
                                        saveRecurringData(id,title,quantity,type,task,theme,rater);
                                    }
                                }
                            }
                        }
                    }
                }
            }
    });
}

//trigger to delete the recurring task
function deleteRecurringTask()
{
    const recurring_warning_modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#recurring_warning_notification"));
    let id = '';

    $("body").on("click",".btn_delete_recurring_task",function(e){
        e.stopPropagation();
        id = $(this).attr("id");

        recurring_warning_modal.show();
    });

    //delete the recurring task
    $("#delete_recurring_task").on("click",function(){

        $.ajax({
            type:"POST",
            url: bpath + "ors/delete/recurring/task",
            data:{_token,id},

            success:function(response)
            {
                if(response.status === true)
                {
                    __notif_show(1,'',response.message);
                    fetchRecurringTask();
                } else
                {
                    __notif_show(-1,'',response.message);
                }
            }
        });
    });
}

//remove the rerecurring_id
function clearRecurringId()
{
    $("body").on("click","#recurrent_create",function(){
        //empty the recurring id field
        $("#recurring_task_id").text('');
        $("#event_color").css("background-color","#64748B");
    });
}

//update the recurring task
function updateRecurringTask()
{
    let id = '';

    $("body").on("click",".recurring_task",function(){

        id = $(this).attr('id');

        let title = $(this).data("title"),
            quantity = $(this).data("quantity"),
            type = $(this).data("type"),
            task = $(this).data("task"),
            color = $(this).data("color"),
            color_theme = $(this).data("color_theme");
            rater = $(this).data("rater");

            $("#recurrent_create").addClass("active");
            $("#example-tab-6").addClass("active");
            $("#recurrent_task").removeClass("active");
            $("#example-tab-5").removeClass("active");

            $("#reccurent_title").text(title);
            $("#reccurent_quantity").text(quantity);
            $("#reccurent_task").text(task);
            $("#recurring_theme").text(color);
            $("#recurring_submit_task").val(rater).trigger("change");
            $("#recurring_task_type").val(type).trigger("change");

            $("#reccurent_title").removeAttr("data-placeholder");
            $("#reccurent_quantity").removeAttr("data-placeholder");
            $("#reccurent_days").removeAttr("data-placeholder");
            $("#reccurent_task").removeAttr("data-placeholder");
            $("#event_color").css("background", color_theme);
            $("#recurring_task_id").text(id);
    });
}

//fetch the rated ors
function getRatedOrs(id)
{
    $.ajax({
        type: 'GET',
        url: bpath + 'ors/fetch/rated/ors',
        data:{_token,id},
        dataType:'json',

        success:function(response){

            if(response.status === true)
            {
                let data = response.data,
                    cd = '',
                    rating_val = [];
                    $(".rating").empty();

                if(data)
                {
                    $("#rater_image").attr('src',data['rater_image']);
                    $("#rater_name").text(data['rater']);
                    $("#date_rated").text(data['date_rated']);
                    $("#task").text(data['task']);
                    $("#comment").text(data['comment']);
                    console.log(data['comment']);
                        for(let y = 0; y < data['rate_val'].length;y++){

                            let  rate_star = '';

                            for(let x = 0; x < data['rate_val'][y];x++)
                            {
                                rate_star += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="star" data-lucide="star" class="lucide lucide-star text-pending fill-pending/30 w-4 h-4 mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
                            }
                            rating_val.push(rate_star);
                        }

                        for(let x = 0; x < data['spms_rating'].length; x++)
                        {

                            cd += `<div class="flex items-center mr-2">
                                    <label class="text-slate-500 font-medium mr-2 text-xs">${data['spms_rating'][x]}:</label>
                                        ${rating_val[x]}
                                    </div>`;
                        }

                    $(".rating").append(cd);
                    ors_rated_modal.show();
                }
            }
            else if(response.status === 500)
            {
                error_modal.show();
                $('#error_text').text(response.message);
            }
        },
    });
}

//demo the ors task
function task_demo()
{
    $("#btn_toggle_demo").on("click",function(){
        ors_walkthrough();
    });
}

//onboard walk through on the system
function ors_walkthrough()
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
                intro:'This feature allow the user to filter tasks within the ORS module based on specific dates.',
                element: document.querySelector('#filter_calendar_div'),
            },
            {
                title: 'Status',
                intro:'Filter the ORS calendar by task status, enabling users to view tasks whether it is rated, unrated, or returned.',
                element: document.querySelector('#filter_status'),
            },
            {
                title: 'Date cell',
                intro:'By clicking a cell date a task modal will appear',
                element: document.querySelector('.fc-daygrid-day'),
            },
            {
                title: 'Add title',
                intro:'Create a title for the task.',
                element: document.querySelector('#ors_title_div'),
            },
            {
                title: 'Select Date',
                intro:'Select the date on which the task is accomplish.',
                element: document.querySelector('#ors_date_div'),
            },
            {
                title: 'Quantity',
                intro:'Enter the quantity of the task.',
                element: document.querySelector('#ors_quantity_div'),
            },
            {
                title: 'Select rater',
                intro:'Select the corresponding evaluator who will rate the task.',
                element: document.querySelector('#ors_rater_div'),
            },
            {
                title: 'Select type',
                intro:'Select the task type.',
                element: document.querySelector('#ors_type_div'),
            },
            {
                title: 'Theme',
                intro:'Customize the color display in the ors task or add a new one.',
                element: document.querySelector('#ors_add_theme'),
            },
            {
                title: 'Choose theme',
                intro:'Select a list of color which will be used to represent the task.',
                element: document.querySelector('.ors_color_div'),
            },
            {
                title: 'Task',
                intro:'Click the "Task" tab to navigate to the task input section.',
                element: document.querySelector('#task_tab_list'),
            },
            {
                title: 'Input Task',
                intro:'Describe the performed task in this section.',
                element: document.querySelector('#task_div'),
            },
            {
                title: 'Attachment',
                intro:'Click the attachment tab to navigate in the attachment section.',
                element: document.querySelector('#attachment_tab_list'),
            },
            {
                title: 'Add attachment',
                intro:'Click the field to add attachment.',
                element: document.querySelector('#dropzone_ors'),
            },
            {
                title: 'Recurring task',
                intro:'When the recurring button is clicked, the recurring task is displayed to the side.',
                element: document.querySelector('.recurring_task_div'),
            },
            {
                title: 'Search task',
                intro:'Use the search input to filter and easily locate recurring tasks based on specific criteria.',
                element: document.querySelector('#search_recurring_task'),
            },
            {
                title: 'Task list',
                intro: 'Displays a list of recurring tasks, where each task can be dragged to a specific date to be saved. Clicking the delete icon in the task list will remove the selected task.',
                element: document.querySelector('#recurring_list_div'),
            },
            {
                title: 'List',
                intro:'Click the list tab to display the recurring task',
                element: document.querySelector('#example-5-tab'),
            },
            {
                title: 'Recurring task',
                intro:'Click the recurring task button to open the adding of recurring task .',
                element: document.querySelector('#example-6-tab'),
            },
            {
                title: 'Title',
                intro:'Creating a Title for a Recurring Task',
                element: document.querySelector('#reccurent_title'),
            },
            {
                title: 'Quantity',
                intro:'Enter the quantity of the task.',
                element: document.querySelector('#reccurent_quantity'),
            },
            {
                title: 'Add Task',
                intro:'Describe the accomplish task.',
                element: document.querySelector('#reccurent_task'),
            },
            {
                title: 'Select Type',
                intro:'Select the type of task.',
                element: document.querySelector('#recurring_type_div'),
            },
            {
                title: 'Theme',
                intro:'Click the color icon to select different theme on the task list.',
                element: document.querySelector('#color_dropdown'),
            },
            {
                title: 'Select Evaluator',
                intro:'Select the corresponding evaluator that will rate the task.',
                element: document.querySelector('#evaluator_div'),
            },
            {
                title: 'Save',
                intro:'Click the saved button to save the recurring task.',
                element: document.querySelector('#btn_save_reccurent_event'),
            },
        ]
        }).onchange(function(targetElement){

            if(targetElement.classList.contains('introjsFloatingElement'))
            {
                hide_slideover();
                clearfields();
            }
            else if(targetElement.classList.contains('fc-daygrid-day'))
            {
                let modal = $('.offcanvas');

                modal.css({
                    'top': 142.765625 + 'px',
                    'left':  965.42225 + 'px',
                    'display': 'block'
                });

                modal.show();
                modal.css('animation', 'fadeIn 0.8s forwards');
            }
            else if(targetElement.classList.contains('ors_task_div'))
            {
                $('#btn_task')[0].click();
                $('#event_tab_list').removeClass('active');
                $('#task_tab_list').addClass('active');
            }
            else if(targetElement.classList.contains('ors_attachment_div'))
            {
                $('#btn_file')[0].click();
                $('#btn_task').removeClass('active');
                $('#attachment_tab_list').addClass('active');
            }
            else if(targetElement.classList.contains('recurring_task_div'))
            {
                $('#btn_toggle_recurring_task').trigger('click');
            }
            else if(targetElement.classList.contains('recurring_task_display'))
            {
                $('#recurrent_create').trigger('click');
                $('#example-5-tab').removeClass('active');
                $('#example-6-tab').addClass('active');
            }

        }).oncomplete(function(){

            let recurring_task = $('#recurring_task_display'),
                event_task = $('#event_task_display');

                recurring_task.addClass('hidden');
                event_task.removeClass('lg:col-span-9');

        }).start();
}









