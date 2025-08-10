const error_modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#ors_error_modal"));
const target_modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#create_plan"));
const delete_assign_modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#remove_target_modal"));
const task_description_sildeover = tailwind.Modal.getOrCreateInstance(document.querySelector("#target_task_description"));

const target = {targetId:''};
const target_task = {Id:''};
var task_timeline_datepickr,delete_type = '' ,task_description = '';

//ajax header
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});


$(function()
{
    initialiizeClassicEditor()
    fetchTargetList();
    savePlan();
    showTargetData();
    deleteTarget();
    deleteTargetLIst();
    popUpTargetModal();
    cancelTargetModal();
    clickTargetList();
    mouseOver();
    mouseOut();
    actionMouseHover();
    actionMouseOut();
    targetTaskClick();
    outsideTbdyClick();
    keyEnter();
    openStatusDropdown();
    selectStatus();
    slideoverTaskDescription();
    taskDescription();
    openDeleteTargetTaskModal();
});

//classic editor initialization
function initialiizeClassicEditor()
{
    try
    {
        ClassicEditor
        .create(document.querySelector('#task_description'), {
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
            task_description = editor;
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

//empty the fiels
function emptyFields()
{
    //clear the input fields
    $('#plan_title').val('');
    $('#plan_desc').val('');
    $('#start_plan_date').val('');
    $('#end_plan_date').val('');
    $('#color').val('#000000');
    target.targetId = '';
}

//fetch the target list
function fetchTargetList()
{
    let div = $('#plan_list'),
        cd = '';

    $.ajax({
        type:'GET',
        url:'/ors/fetch/target',
        beforeSend:function()
        {
            div.empty();
            cd = `<div class="flex items-center justify-center">
                        <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8 fa-beat">
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
                </div>`;

            div.append(cd);
        },
        success:function(response)
        {

            if(response.status === true)
            {
                let data = response.data;

                cd = '';
                div.empty();

                if(data.length > 0)
                {
                    $.map(data,function(target){

                        cd += `<div id="${target.id}" class="p-2 flex items-center cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md mb-2 target_details">
                                    <div class="border-l-2 border-primary dark:border-primary pl-4" style="border-color:${target.color}">
                                        <span class="font-medium">${target.title}</span>
                                        <div class=" text-xs text-slate-500 font-medium">${target.start_date} - ${target.end_date}</div>
                                    </div>
                                    <div class="flex items-center justify-center ml-auto text-xs">
                                        <div class="ml-2">
                                            <button id="${target.id}" class="text-warning target_data" data-title="${target.title}" data-desc="${target.desc}" data-start_date="${target.start}" data-end_date="${target.end}" data-color="${target.color}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-pen-line w-4 h-4"><path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/><path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><path d="M8 18h1"/></svg>
                                            </button>
                                        </div>
                                        <div class="ml-2">
                                            <button  id="${target.id}" class="text-danger delete_target" data-tw-target="modal">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2 w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>`
                    });

                    div.append(cd);
                } else
                {
                    div.append('<div class="text-center text-slate-500 font-medium">No data available</div>');
                }

            } else if(response.status === 500)
            {
                error_modal.show();
                $('#error_text').text(response.error);
            }
        }
    });
}

// client-side: trigger to save the data
function savePlan()
{
    $('#btn_save_plan').on('click',function(){

        let id = target.targetId,
            title = $('#plan_title').val(),
            desc = $('#plan_desc').val(),
            start_date = $('#start_plan_date').val(),
            end_date = $('#end_plan_date').val(),
            color = $('#color').val();

        data = {
            'title': title,
            'description': desc,
            'start_date': start_date,
            'end_date': end_date,
            'color': color,
        }

        createPlan(id,data);
    });
}

// server-side: create plan
function createPlan(id,data)
{
    let btn_save = $('#btn_save_plan');
    $.ajax({
        type:'POST',
        url:'/ors/create/plan',
        data:{id,data},
        dataType: 'json',
        beforeSend:function(){

            let svg = `<svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2">
                        <g fill="none" fill-rule="evenodd">
                            <g transform="translate(1 1)" stroke-width="4">
                                <circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle>
                                <path d="M36 18c0-9.94-8.06-18-18-18">
                                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform>
                                </path>
                            </g>
                        </g>
                    </svg>`;

            btn_save.prop('disabled',true);
            btn_save.append(svg);
        },
        success:function(response){

            if(response.status === true)
            {
                btn_save.prop('disabled',false);
                btn_save.html('Save');
                target_modal.hide();
                emptyFields();
                __notif_show(1,'',response.message);
                fetchTargetList();
            }
            else if(response.status === 500)
            {
                btn_save.prop('disabled',false);
                btn_save.html('Save');

                const fields = [
                    { field: 'title', input: '#plan_title' },
                    { field: 'description', input: '#plan_desc' },
                    { field: 'start_date', input: '#start_plan_date' },
                    { field: 'end_date', input: '#end_plan_date' },
                ];

                for (let i = 0; i < fields.length; i++) {
                    const field = fields[i];
                    // If the field has an error, add the 'border-danger' class
                    if (response.error['data.' + field.field]) {
                        $(field.input).addClass('border-danger');
                        break; // Stop the loop when an error is found
                    } else {
                        // If no error, remove the 'border-danger' class
                        $(field.input).removeClass('border-danger');
                    }
                }
            }
        }
    })
}

//trigger to open the modal data for update
function showTargetData()
{
    $('body').on('click','.target_data', function(event){

        event.stopPropagation();

        let title = $(this).data('title'),
            desc = $(this).data('desc'),
            start_date = $(this).data('start_date'),
            end_date = $(this).data('end_date'),
            color = $(this).data('color');

            $('#plan_title').val(title);
            $('#plan_desc').val(desc);
            $('#start_plan_date').val(start_date);
            $('#end_plan_date').val(end_date);
            $('#color').val(color);

            target.targetId = $(this).attr('id');
            target_modal.show();
    });
}

//click the target list to pass the id in saving the target task
function clickTargetList()
{
    $('body').on('click','.target_details',function(){
        target.targetId = $(this).attr('id');

        //display the target task list
        fetchTargetTaskList(target.targetId);
    });
}

//trigger to pop-up the create target modal
function popUpTargetModal()
{
    $('#btn_target_modal').on('click',function(){
        target.targetId = '';
        target_modal.show();
    });
}

//cancel the target modal
function cancelTargetModal()
{
    $('#btn_cancel_target_modal').on('click',function(){
        emptyFields();
        target_modal.hide();
    });
}

//trigger to open the delete modal
function deleteTarget()
{
    $('body').on('click','.delete_target',function(event){
        event.stopPropagation();
        delete_assign_modal.show();
        target.targetId = $(this).attr('id');
        delete_type = 'Plan';
    });
}

//delete the target data
function deleteTargetLIst()
{
    $('#btn_delete_target').on('click',function(){
        if(delete_type === 'Plan')
        {
            //delete the data in the plan
            deleteTargetData(target.targetId);
        } else if(delete_type === 'Target')
        {
            //delete the data in the task target
            deleteTargetTask(target_task.Id);
        }

    });
}

//server-side: delete target
function deleteTargetData(id)
{
    let btn = $('#btn_delete_target');

    $.ajax({
        type:'DELETE',
        url: '/ors/delete/target',
        data:{id},
        dataType: 'json',
        beforeSend:function(){

            let svg = `<svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2">
                        <g fill="none" fill-rule="evenodd">
                            <g transform="translate(1 1)" stroke-width="4">
                                <circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle>
                                <path d="M36 18c0-9.94-8.06-18-18-18">
                                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform>
                                </path>
                            </g>
                        </g>
                    </svg>`;

            btn.prop('disabled',true);
            btn.append(svg);
        },
        success:function(response){

            if(response.status === true)
            {
                __notif_show(1,'',response.message);
                fetchTargetList();
                fetchTargetTaskList(target.targetId,id);

            } else if(response.status === 500)
            {
                error_modal.show();
                $('#error_text').text(response.error);
            }

            btn.prop('disabled',false);
            btn.html('Delete');
            delete_assign_modal.hide();
        }
    });
}

//---- Target task list ----//

//initialiize the date picker calendar
function initialiizeDatePickerCalendar()
{
    document.querySelectorAll('.flt_picker').forEach((element) => {
        flatpickr(element, {
            dateFormat: "M d, Y", // Customize the date format
            allowInput: true, // Optional: allow manual input
            onChange: function(selectedDates, dateStr, instance) {
                updateTimeline(target_task.Id,dateStr);
            },
        });
    });

}

//fetch the target task list
function fetchTargetTaskList(id,identifier)
{
    let target_task_list = $('#target_list_tbdy'),
        cd = '';

    $.ajax({
        type: 'GET',
        url: '/ors/fetch/target/task',
        data:{id},
        dataType: 'json',
        beforeSend:function()
        {
            if(identifier)
            {
                $(`#${identifier}`).html(`<td colspan="6" class="text-center">
                    <div class="spinner">Loading...</div>
                </td>`);
            } else
            {
                target_task_list.empty();
                target_task_list.append(`<tr>
                                            <td colspan="6">
                                                <div class="flex items-center justify-center">
                                                    <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-8 h-8 fa-beat">
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
                                            </td>
                                        </tr>`);
            }
        },
        success:function(response)
        {
            cd = '';
            target_task_list.empty();

            if(response.status === true)
            {
                let data = response.data;

                if(identifier && data.length > 0)
                {
                    // Update only the specific row
                    const target_list = data[0]; // Assuming server returns only the updated task when taskId is passed

                    const updatedRow = `
                        <td id="${target_list.id}" class="w-60">
                            <div class="font-medium w-full p-2 rounded-md w-60 lbl_display_add_task">${target_list.task}</div>
                            <input type="text" class="form-control w-60 add_task hidden" placeholder="+ Add task" aria-label="default input inline 1" value="${target_list.task_full}" style="width:15rem">
                        </td>
                        <td id="${target_list.id}" class="w-8 task_description_td" data-task="${target_list.desc}">
                            <div class="task_description">
                                ${target_list.icon}
                            </div>
                        </td>
                        <td id="${target_list.id}" class="text-center">
                            <div class="dropdown" data-tw-placement="right-start">
                                <button class="${target_list.btn_design} w-32 dropdown-toggle px-4" aria-expanded="false" data-tw-toggle="dropdown">${target_list.stat_title}</button>
                                <div class="dropdown-menu w-40">
                                    <ul class="dropdown-content target_task_stat">
                                        <li><div>Status</div></li>
                                        <li><hr class="dropdown-divider"></li>
                                    </ul>
                                </div>
                            </div>
                        </td>
                        <td id="${target_list.id}" class="w-56 timeline_td" data-date="${target_list.date}">
                            <div class="flex items-center justify-center text-center">
                                <div class="form-control font-medium w-40 h-8 task_timeline_calendar flt_picker ${target_list.lbl_date}" style="border:none !important;outline:none !important;box-shadow:none !important;">${target_list.date}</div>
                            </div>
                        </td>
                        <td>
                            <div class="flex items-center justify-center">
                                <div class="mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus text-primary w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                                </div>
                                <div class="w-9 h-9 image-fit zoom-in">
                                    <img alt="User" class="tooltip rounded-full" src="/img/user.jpg">
                                </div>
                            </div>
                        </td>
                        <td id="${target_list.id}" class="w-6 delete_task">
                            <div class="flex items-center justify-center delete_div hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2 text-danger w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </div>
                        </td>
                    `;

                    $(`#${identifier}`).html(updatedRow);
                }
                else if(!identifier && data.length > 0)
                {
                    $.map(data,function(target_list)
                    {
                        cd += ` <tr id="${target_list.id}" class="cursor-pointer rounded-md">
                                    <td id="${target_list.id}" class="w-60">
                                        <div class="font-medium w-full p-2 rounded-md w-60 lbl_display_add_task">${target_list.task}</div>
                                        <input type="text" class="form-control w-60 add_task hidden" placeholder="+ Add task" aria-label="default input inline 1" value="${target_list.task_full}" style="width:15rem">
                                    </td>
                                    <td id="${target_list.id}" class="w-8 task_description_td" data-task="${target_list.desc}">
                                        <div class="task_description">
                                            ${target_list.icon}
                                        </div>
                                    </td>
                                    <td id="${target_list.id}" class="text-center">
                                        <div class="dropdown" data-tw-placement="right-start">
                                        <button class="${target_list.btn_design} w-32 dropdown-toggle px-4" aria-expanded="false" data-tw-toggle="dropdown">${target_list.stat_title}</button>
                                            <div class="dropdown-menu w-40">
                                                <ul class="dropdown-content target_task_stat">
                                                    <li><div>Status</div></li>
                                                    <li><hr class="dropdown-divider"></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                    <td id="${target_list.id}" class="w-56 timeline_td" data-date="${target_list.date}">
                                        <div class="flex items-center justify-center rounded-md w-full p-1 timeline_div flt_picker hidden">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus  text-primary w-4 h-4 mr-1"><circle cx="12" cy="12" r="10"/>
                                                <path d="M8 12h8"/>
                                                <path d="M12 8v8"/>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-plus-2 w-4 h-4">
                                                <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/>
                                                <path d="M3 10h18"/><path d="M10 16h4"/><path d="M12 14v4"/>
                                            </svg>
                                        </div>
                                        <div class="flex items-center justify-center text-center">
                                            <div class="form-control font-medium w-40 h-8 task_timeline_calendar flt_picker ${target_list.lbl_date}" style="border:none !important;outline:none !important;box-shadow:none !important;">${target_list.date}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="flex items-center justify-center">
                                            <div class="mr-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus text-primary w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                                            </div>
                                            <div class="w-8 h-8 image-fit zoom-in">
                                                <img alt="Midone - HTML Admin Template" class="tooltip rounded-full" src="/img/user.jpg">
                                            </div>
                                        </div>
                                    </td>
                                    <td id="${target_list.id}" class="w-6 delete_task">
                                        <div class="flex items-center justify-center delete_div hidden">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2 text-danger w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                        </div>
                                    </td>
                                </tr>`;
                    });

                        cd += `<tr>
                                    <td id='' class="cursor-pointer" colspan="6">
                                        <div class="text-slate-400 font-medium p-2 rounded-md lbl_display_add_task" style="width: 15.5rem;">+ Add task</div>
                                        <input type="text" class="form-control add_task hidden" placeholder="+ Add task" aria-label="default input inline 1" style="width:15rem">
                                    </td>
                                </tr>`;

                        target_task_list.append(cd);
                        //initialize the date and get the selected value
                        initialiizeDatePickerCalendar();
                } else
                {
                    cd = `<tr>
                            <td id='' class="cursor-pointer" colspan="6">
                                <div class="text-slate-400 font-medium p-2 rounded-md lbl_display_add_task" style="width: 15.5rem;">+ Add task</div>
                                <input type="text" class="form-control add_task hidden" placeholder="+ Add task" aria-label="default input inline 1" style="width:15rem">
                            </td>
                        </tr>`;

                    target_task_list.append(cd);
                }

            } else if(response.status === 500)
            {
                error_modal.show();
                $('#error_text').text(response.error);
            }
        }
    });
}

// create table row

//create a task for the target
function createTargetTask(id,data)
{
    $.ajax({
        type: 'POST',
        url: '/ors/create/target/task',
        data:{id,data},
        dataType: 'json',

        success:function(response){
            if(response.status === true)
            {
                __notif_show(1,'',response.message);
                $('.add_task').val('');
                fetchTargetTaskList(data['plan_id'],id);
            }
            else if(response.status === 500)
            {
                error_modal.show();
                $('#error_text').text(response.error);
            }
        }
    });
}

//detect when the mouse enter in the table
function mouseOver()
{
    //hover on the task
    $('body').on('mouseover','#target_list_tbdy td',function(){

        let task_label = $(this).find('div.lbl_display_add_task'),
            timeline_div = $(this).find('div.timeline_div'),
            timeline_date_pickr = $(this).find('div.task_timeline_calendar');

        if(task_label.length > 0)
        {
            //add a border in the div
            task_label.css('border','1px solid grey');
        }
        else if(timeline_div.length > 0 && timeline_date_pickr.hasClass('hidden'))
        {
            //show the date picker icon
            timeline_div.removeClass('hidden');
            timeline_div.css('border','1px solid grey');
        }
    });
}

//detect when the mouse leave in the table
function mouseOut()
{
    $('body').on('mouseout','#target_list_tbdy td',function(){

        let task_label = $(this).find('div.lbl_display_add_task'),
            timeline_div = $(this).find('div.timeline_div');

        if(task_label.length > 0)
        {
            //remove the border in the task div
            task_label.css('border','none');
        }
        else if(timeline_div.length > 0)
        {
            //show the date picker icon
            timeline_div.addClass('hidden');
            timeline_div.css('border','none');
        }
    });
}

//detect when the mouse hover in the tr
function actionMouseHover()
{
    $('body').on('mouseover','#target_list_tbdy tr',function(){
        let delete_btn = $(this).find('div.delete_div');

        if(delete_btn.length > 0)
        {
            delete_btn.removeClass('hidden');
        }
    });
}

//detect when the mouseout in the tr
function actionMouseOut()
{
    $('body').on('mouseout','#target_list_tbdy tr',function(){
        let delete_btn = $(this).find('div.delete_div');

        if(delete_btn.length > 0 && !delete_btn.hasClass('hidden'))
        {
            delete_btn.addClass('hidden');
        }
    });
}

//iterate all over the td to find the date value and hide the td which has no value
function removeTaskTargetDateLabel()
{
    let task_tbdy = $('#target_list_tbdy td');

    task_tbdy.each(function(){
        let date_val = $(this).data('date');

        if(!date_val)
        {
            //return the timeline state to its original class
            $('.timeline_div').addClass('hidden');
            $(this).find('div.task_timeline_calendar').addClass('hidden');
        }
    });
}

//add an onclick event in the taskclick
function targetTaskClick()
{
    $('body').on('click','#target_list_tbdy td',function(){

        let timeline_div = $(this).find('div.timeline_div'),
            timeline_date_pickr = $(this).find('div.task_timeline_calendar'),
            task_div = $(this).find('div.lbl_display_add_task'),
            task_input = $(this).find('input.add_task');

        target_task.Id = $(this).attr('id');

        if(task_div.length > 0)
        {
            //return the state to its original class
            $('.lbl_display_add_task').removeClass('hidden');
            $('.add_task').addClass('hidden');

            //return the timeline state to its original class
            removeTaskTargetDateLabel();

            //check if the id is present then remove the hidden class on the add task input
            if(target_task.Id !== null || target_task.Id !== '')
            {
                task_div.addClass('hidden');
                task_input.removeClass('hidden');
            }
        }
        else if(timeline_div.length > 0)
        {
            timeline_date_pickr.val('');

            //return the task state to its original class
            $('.lbl_display_add_task').removeClass('hidden');
            $('.add_task').addClass('hidden');

            removeTaskTargetDateLabel();
            //check if the id is present then remove the hidden class on the add task input
            if(target_task.Id !== null || target_task.Id !== '')
            {
                timeline_div.addClass('hidden');
                timeline_date_pickr.removeClass('hidden');
            }
        }

    });
}

//checked if the on click is outside the table
function outsideTbdyClick()
{
    $(document).on('click',function(e){
        if(!$(e.target).closest('tbody').length)
        {
            task_tbdy = $('#target_list_tbdy td');

            $('.lbl_display_add_task').removeClass('hidden');
            $('.add_task').addClass('hidden');
            removeTaskTargetDateLabel();
        }
    });
}

//trigger to save the input when the enter key is pressed
function keyEnter()
{
    $(document).on('keypress','#target_list_tbdy .add_task',function(event){

        let task = $(this).val().trim(),
            id = '';

        if(event.key === 'Enter' || event.keycode === 13)
        {
            data = {
                'plan_id':target.targetId,
                'task':task,
            };

            if((target.targetId !== null && task !== null) && target_task.Id === '')
            {
                createTargetTask(id,data);
            }
            else if(target_task.Id !== null && task !== null)
            {
                createTargetTask(target_task.Id,data);
            }
        }
    });
}

//fetch the target task status design
function fetchTargetTaskStatus(task_id)
{
    let li = $('.target_task_stat'),
        cd = '';

    $.ajax({
        type:'GET',
        url:'/ors/fetch/target-task/status',
        dataType:'json',
        beforeSend:function(){
            li.empty();
            li.append(`<li class="flex items-center justify-center">
                            <svg width="25" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-4 h-4 fa-beat">
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
                        </li>`)
        },
        success:function(response){

            cd = '';
            li.empty();

            if(response.status === true)
            {
                cd += `<li>
                            <div class="dropdown-header">Select status</div>
                        </li>
                        <li>
                            <hr class="dropdown-divider -mt-2">
                        </li>`

                let data = response.data;

                if(data.length > 0)
                {
                    $.map(data,function(stat)
                    {
                        cd += `<li class="mb-1">
                                    <button id="${task_id}" class="${stat.btn_design} dropdown-item  w-full btn_target_status" data-stat="${stat.id}">${stat.title}</button>
                                </li>`;
                    });

                    li.append(cd);
                } else
                {
                    li.append(`<li class="mb-2"> No status Available</li>`);
                }
            } else if(response.status === 500)
            {
                error_modal.show();
                $('#error_text').text(response.error);
            }
        }
    });
}

//click the select status dropdown
function openStatusDropdown()
{
    $(document).on('click','#target_list_tbdy td',function(){
        let id = $(this).attr('id');
        fetchTargetTaskStatus(id);
    });
}

//update the target task status
function updateTargetTaskStatus(id,status)
{
    const target_task_status_drp = tailwind.Dropdown.getOrCreateInstance(document.querySelector(".target_task_stat"));

    $.ajax({
        type:'PATCH',
        url:'/ors/patch/target/status',
        data:{id,status},
        success:function(response)
        {
            if(response.status === true)
            {
                fetchTargetTaskList(target.targetId,id);
                target_task_status_drp.hide();

            } else if(response.status === 500)
            {
                error_modal.show();
                $('#error_text').text(response.error);
            }
        }
    });
}

//select Status on the target task list
function selectStatus()
{
    $('body').on('click','.btn_target_status',function(){

        let id = $(this).attr('id'),
            status = $(this).data('stat');

        updateTargetTaskStatus(id,status);
    });
}

//update the timeline value
function updateTimeline(id,date)
{

    $.ajax({
        type:'PATCH',
        url: '/ors/update/timeline',
        data:{id,date},
        dataType:'json',

        success:function(response)
        {
            if(response.status === true)
            {
                fetchTargetTaskList(target.targetId,id);
            } else if(response.status === 500)
            {
                error_modal.show();
                $('#error_text').text(response.error);
            }
        }
    });
}

//trigger to open the task description slide over
function slideoverTaskDescription()
{
    $('body').on('click','.task_description_td',function(){

        let task = $(this).data('task');

        task_description_sildeover.show();
        task_description.setData('');

        target_task.Id = $(this).attr('id');

        $('#task_description_div').removeClass('border-danger');

        if(task)
        {
            task_description.setData(task);
        }
    });
}


//description
function taskDescription()
{
    $('#btn_task_description').on('click',function(){

        let task = task_description.getData().trim();

        if(task)
        {
            saveTaskDescription(target_task.Id,task_description.getData());
        } else
        {
            alert('wlai sulod');
            $('#task_description_div').addClass('border-danger');
        }

    });
}

//save the description
function saveTaskDescription(id,desc)
{
    let btn = $('#btn_task_description');
    $.ajax({
        type : 'POST',
        url:'/ors/save/task/description',
        data:{id,desc},
        dataType:'json',
        beforeSend:function(){

            let svg = `<svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2">
                            <g fill="none" fill-rule="evenodd">
                                <g transform="translate(1 1)" stroke-width="4">
                                    <circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle>
                                    <path d="M36 18c0-9.94-8.06-18-18-18">
                                        <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform>
                                    </path>
                                </g>
                            </g>
                        </svg>`;

            btn.append(svg);
            btn.prop('disabled',true);
        },
        success:function(response)
        {
            if(response.status === true)
            {
                fetchTargetTaskList(target.targetId,id);

                $('#task_description_div').removeClass('border-danger');

            } else if(response.status === 500)
            {
                error_modal.show();
                $('#error_text').text(response.error);
            }

            btn.html('Save');
            btn.prop('disabled',false);
        }
    });
}

//trigger to open the delete modal
function openDeleteTargetTaskModal()
{
    $('body').on('click','.delete_task',function(){
        target_task.Id = $(this).attr('id');
        delete_assign_modal.show();
        delete_type = 'Target';

    })
}

//delete the the target task
function deleteTargetTask(id)
{
    let btn = $('#btn_delete_target');
    $.ajax({
        type:'DELETE',
        url:'/ors/delete/target/task',
        data:{id},
        dataType:'json',
        beforeSend:function(){
            let svg = `<svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" class="w-4 h-4 ml-2">
                        <g fill="none" fill-rule="evenodd">
                            <g transform="translate(1 1)" stroke-width="4">
                                <circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle>
                                <path d="M36 18c0-9.94-8.06-18-18-18">
                                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform>
                                </path>
                            </g>
                        </g>
                    </svg>`;

            btn.prop('disabled',true);
            btn.append(svg);
        },
        success:function(response){

            if(response.status === true)
            {
                fetchTargetTaskList(target.targetId,id);
            } else if(response.status === 500)
            {
                error_modal.show();
                $('#error_text').text(response.error);
            }

            btn.prop('disabled',false);
            btn.html('Delete');
            delete_assign_modal.hide();
            target_task.Id  = '';
        }
    });
}





