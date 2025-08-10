$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

const jobref = {Id:''},search = {Filter:''},filter = {Size:null}, page = {Paginate:''},
    position = {Search:''}, position_list = {Paginate:''}, positon_filter = {Size:null},
    ref_num = {Jobref:''}, applicant = {'Id':''}, application = {Date:''}, application_list = {Id:''},
    employee = {Email:''}, activity = {Search:''}, start = {StartDate:''}, end = {EndDate:''}, scroll = {Paginate:1};

const drp_down_filter_date = tailwind.Dropdown.getOrCreateInstance(document.querySelector("#drp_down"));
const email_modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#email_notif"));
const error_modal = tailwind.Modal.getOrCreateInstance(document.querySelector("#error_modal"));

var typingTimer = '', doneTypingInterval = 1000, lite_picker='', exam = {Result:''},toggle_applicant_status = '';

$(function(){
    initializeDatePicker('appointment_schedule');
    applicantList();
    filterPositionList();
    filterPositionListSize();
    paginatePositionList();
    toggleDropdown();
    paginationClick();
    filterApplicantList();
    filterDisplayData();
    clickApplicantDetails();
    toggleExamination();
    toggleAppointment();
    returnApplicant();
    toggleApplicantStatus();
    triggerActivityLogs();
    searchActivityLogs();
    filterDateActivityLog();
    cancelActivityLogsFilterDate();
    scrollActivityLogs();
});


//initialize the date picker
function initializeDatePicker(id)
{
    lite_picker = new Litepicker({
        element: document.getElementById(id),
        autoApply: false,
        singleMode: true,
        numberOfColumns: 1,
        numberOfMonths: 1,
        showWeekNumbers: false,
        format: 'MMMM DD, YYYY',
        allowRepick: true,
        dropdowns: {
            minYear: 1950,
            maxYear: 2100,
            months: true,
            years: true
        }
    });
}

function applicantList(search,size,page)
{
    let tbdy = $("#applicant_list"),
        pagination = $('#position_list_pagination'),
        summary_list = $("#position_list_summary"),
        cd = '';

    $.ajax({
        type:"POST",
        url: "/rsp_hiring/applicant/list",
        data:{search,size,page},
        dataType: "json",
        beforeSend:function(){

            tbdy.empty();
            summary_list.empty();
            pagination.empty();

            cd = `<tr>
                        <td colspan="5">
                            <div class="py-5" style="display:flex;justify-content:center;">
                                <svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-7 h-7">
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

                tbdy.append(cd);
        },
        success:function(response){

            tbdy.empty();
            summary_list.empty();
            pagination.empty();

            cd = '';

            if(response.status === true)
            {
                let data = response.data;

                if(data.length > 0)
                {
                    let text_color = '';

                        $.map(data,function(value)
                        {
                            if(value !== null)
                            {
                                if(value.status == 'Awaiting appointment')
                                {
                                    text_color = 'text-pending';
                                }

                                cd = `<tr id="${value.id}" class="intro-x cursor-pointer applicant_details">
                                            <td class="underline decoration-dotted font-semibold text-slate-500">${value.plantilla}</td>
                                            <td class="font-semibold">
                                                ${value.position_title}
                                                <div class="text-xs text-slate-500">${value.assign_place}</div>
                                            </td>
                                            <td class="font-semibold">
                                                ${value.posting_date}
                                                <div class="text-xs text-slate-500">${value.close_date}</div>
                                            </td>
                                            <td class="font-semibold">${value.count}</td>
                                            <td class="${text_color}">${value.status}</td>
                                      </tr>
                                        <tr class="intro-y box shortlist_details" hidden>
                                            <td colspan="5">
                                                <div class="col-span-12 lg:col-span-9 2xl:col-span-10">
                                                    <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                                                        <h2 class="font-medium text-base mr-auto">
                                                            <div class="intro-y">Applicant List</div>
                                                            <div class="intro-y text-xs text-slate-500">List of applicant for this position</div>
                                                        </h2>
                                                    </div>
                                                    <div class="flex flex-col-reverse sm:flex-row items-center">
                                                        <div class="block ml-3 mr-auto text-slate-500 applicant_list_summary"></div>
                                                        <div class="w-full sm:w-auto flex">
                                                            <div class="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-auto md:ml-0">
                                                                <div class="w-full sm:w-56 relative text-slate-500 mt-5">
                                                                    <input type="text" class="form-control w-full sm:w-56 pr-10" id="applicant_list_search" placeholder="Search by employee..." autocomplete="off">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div class="grid grid-cols-12 gap-3 sm:gap-6 mt-5 tbdy_applicant">
                                                        </div>
                                                        <div class="loading_icon"></div>
                                                        <div class="intro-y flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-6">
                                                            <nav class="w-full sm:w-auto sm:mr-auto">
                                                                <ul class="pagination apllicant_list_pagination">
                                                                </ul>
                                                            </nav>
                                                            <select id="filter_applicant_list_size" class="w-20 form-select box mt-3 sm:mt-0">
                                                                <option value="9">9</option>
                                                                <option value="18">18</option>
                                                                <option value="27">27</option>
                                                                <option value="50">50</option>
                                                                <option value="All">All</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>`

                                    tbdy.append(cd);
                            } else
                            {
                                tbdy.append('<td colspan="5" class="text-center font-semibold">No data found!</td>');
                            }
                        });
                        summary_list.append(response.summary);
                        paginationLink(response,'#position_list_pagination');
                } else
                {
                    tbdy.append('<td colspan="5" class="text-center font-semibold">No data found!</td>');
                }
            } else
            {
                tbdy.append('<td colspan="5" class="text-center font-semibold">No data found!</td>');
            }
        }, error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}

//filter the list of position via searching
function filterPositionList()
{
    $("#search_position_list").on("input",function(){

        position.Search = $(this).val();

        clearTimeout(typingTimer);
        typingTimer = setTimeout(function(){

            if(toggle_applicant_status === 'Pending Appointment' || toggle_applicant_status === '')
            {
                applicantList(position.Search,positon_filter.Size,1);

            } else if(toggle_applicant_status === 'Shortlist')
            {
                fetchShortlisted(position.Search,positon_filter.Size,1);
            }

        },doneTypingInterval);
    });
}

//filter the dislay size of the position list
function filterPositionListSize()
{
    $("body").on("change","#filter_position_list",function(){

        positon_filter.Size = $(this).val();

        if(toggle_applicant_status === 'Pending Appointment' || toggle_applicant_status === '')
        {
            applicantList(position.Search,positon_filter.Size,position_list.Paginate);

        } else if(toggle_applicant_status === 'Shortlist')
        {
            fetchShortlisted(position.Search,positon_filter.Size,position_list.Paginate);
        }

    });
}

//pagination of the page link in the position list
function paginatePositionList()
{
    $("body").on("click","#position_list_pagination a",function(){

        position_list.Paginate = $(this).data('page');

        if(toggle_applicant_status === 'Pending Appointment' || toggle_applicant_status === '' )
        {
            applicantList(position.Search,positon_filter.Size,position_list.Paginate);
        } else if(toggle_applicant_status === 'Shortlist')
        {
            fetchShortlisted(position.Search,positon_filter.Size,position_list.Paginate);
        }
    });
}

//toggle to show the details
function toggleDropdown()
{
    $("body").on("click",".applicant_details",function(){

        let clickRow = $(this).next('.shortlist_details');

        if($(this).is(':visible'))
        {
            jobref.Id = $(this).attr('id');
            search.Filter = '';
        } else
        {
            jobref.Id = '';
            search.Filter = '';
        }

        $('.shortlist_details').each(function(){

            if($(this).is(':visible') && !$(this).is(clickRow))
            {
                $(this).hide();
            }
        });

        clickRow.toggle();
        clearFields();

        //display the details and check its status
        if(toggle_applicant_status === 'Pending Appointment' || toggle_applicant_status === '' )
        {
            applicationInfo(jobref.Id);

        } else if(toggle_applicant_status === 'Shortlist')
        {
            fetchShortlistedApplicant(jobref.Id);
        }

    });
}

//show the applicant info
function applicationInfo(id,search,size,page)
{
    let tbdy = $('.tbdy_applicant'),
        loading = $('.loading_icon');
        summary = $('.applicant_list_summary');
        pagination = $('.apllicant_list_pagination'),
        cd = '';

    $.ajax({
        type: "POST",
        url: "/rsp_hiring/fetch/applicant/info",
        data:{id,search,size,page},
        beforeSend:function(){
            tbdy.empty();
            loading.empty();
            summary.empty();
            pagination.empty();

            cd =`<div class="w-full py-5" style="display:flex;justify-content:center;">
                        <svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-7 h-7">
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

                    loading.append(cd);
        },
        success:function(response){

            tbdy.empty();
            loading.empty();
            summary.empty();
            pagination.empty();

            if(response.status == true)
            {
                let data = response.data,
                    summary_text = response.summary,
                    cd = '';

                if(data.length > 0)
                {
                    $.map(data,function(value){
                        cd += `<div class="col-span-6 sm:col-span-4 md:col-span-3 2xl:col-span-2 cursor-pointer applicant_info" data-id="${value.id}" data-ref_num ="${value.ref_num}" data-applicant_id ="${value.applicant}" data-image="${value.image}" data-firstname="${value.first_name}" data-lastname="${value.last_name}" data-pos="${value.position}" data-applied="${value.applied_date}" data-approved="${value.approved_date}" data-approved_by="${value.approved_by}" data-email="${value.email}" data-stat="${value.stat}" data-read="${value.privilege}">
                                    <div class="file rounded-md p-5 relative transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400">
                                        <div class="w-3/5 mx-auto">
                                            <img class="rounded-md " src="${value.image}">
                                        </div>
                                        <div class="block font-medium mt-4 text-center truncate text-xs">${value.last_name} ${value.first_name}</div>
                                        <div class="text-slate-500 text-xs text-center mt-0.5">${value.applied_date}</div>
                                    </div>
                                </div>`;
                    });

                    summary.append(summary_text);
                    tbdy.append(cd);
                    paginationLink(response,'.apllicant_list_pagination');
                } else
                {
                    cd = `<div class="w-full text-center font-semibold cursor-pointer">No data found !</div>`;
                    loading.append(cd);
                }

            } else
            {
                cd = `<div class="w-full text-center font-semibold cursor-pointer">No data found !</div>`;
                loading.append(cd);
            }
        }, error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}

//create pagination link
function paginationLink(data,target)
{
    const paginationLinks = $(target);

    const currentPage = data['current_page'];
    const lastPage = data['last_page'];
    const perPage = data['per_page'];
    const totalDataCount = data['total'];

    if (totalDataCount <= perPage) {
        return;
    }

    if (currentPage > 1) {
        paginationLinks.append('<li class="page-item"><a class="page-link" href="javascript:;" data-page="1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-left" class="lucide lucide-chevrons-left w-4 h-4" data-lucide="chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></a></li>');
    }

    // Add "Chevron Left" link
    if (currentPage > 1) {
        paginationLinks.append(`<li class="page-item"><a class="page-link" href="javascript:;" data-page="${currentPage - 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-left" class="lucide lucide-chevron-left w-4 h-4" data-lucide="chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg></a></li>`);
    }

    // Add ellipsis link for skipped pages
    if (currentPage > 3) {
        paginationLinks.append('<li class="page-item"><a class="page-link" href="javascript:;">...</a></li>');
    }

    // Add page links
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, lastPage); i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationLinks.append(`<li class="page-item ${activeClass}"><a class="page-link" href="javascript:;" data-page="${i}">${i}</a></li>`);
    }

    // Add ellipsis link for skipped pages
    if (currentPage < lastPage - 2) {
        paginationLinks.append('<li class="page-item"><a class="page-link" href="javascript:;">...</a></li>');
    }

    // Add "Chevron Right" link
    if (currentPage < lastPage) {
        paginationLinks.append(`<li class="page-item"><a class="page-link" href="javascript:;" data-page="${currentPage + 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-right" class="lucide lucide-chevron-right w-4 h-4" data-lucide="chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></a></li>`);
    }

    // Add "Chevrons Right" link
    if (currentPage < lastPage) {
        paginationLinks.append(`<li class="page-item"><a class="page-link" href="javascript:;" data-page="${lastPage}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-right" class="lucide lucide-chevrons-right w-4 h-4" data-lucide="chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></a></li>`);
    }

}

//handle the pagination click
function paginationClick()
{
    $("body").on("click",".apllicant_list_pagination a",function(){

        page.Paginate = $(this).data('page');

        if(toggle_applicant_status === 'Pending Appointment' || toggle_applicant_status === '')
        {
            applicationInfo(jobref.Id,search.Filter,filter.Size,page.Paginate);

        } else if(toggle_applicant_status === 'Shortlist')
        {
            fetchShortlistedApplicant(jobref.Id,search.Filter,filter.Size,page.Paginate);
        }

    });
}

//filter the applicant info via searching
function filterApplicantList()
{
    $("body").on("input","#applicant_list_search",function(){

        search.Filter = $(this).val();

        clearTimeout(typingTimer);
        typingTimer = setTimeout(function(){
            if(toggle_applicant_status === 'Pending Appointment' || toggle_applicant_status === '')
            {
                applicationInfo(jobref.Id,search.Filter,filter.Size,1);

            } else if(toggle_applicant_status === 'Shortlist')
            {
                fetchShortlistedApplicant(jobref.Id,search.Filter,filter.Size,1);
            }
        },doneTypingInterval);
    });
}

//filter the display of data by size
function filterDisplayData()
{
    $("body").on("change","#filter_applicant_list_size",function(){

        filter.Size = $(this).val();

        if(toggle_applicant_status === 'Pending Appointment' || toggle_applicant_status === '')
        {
            applicationInfo(jobref.Id,search.Filter,filter.Size,page.Paginate);

        } else if(toggle_applicant_status === 'Shortlist')
        {
            fetchShortlistedApplicant(jobref.Id,search.Filter,filter.Size,page.Paginate);
        }
    });
}

//fetch the applicant attachment
function fetchApplicantAttachment(id,ref_num)
{
    let attachment = $('#attachment_list'),
        cd = '';

    $.ajax({
        type: "POST",
        url: "/rsp_hiring/fetch/applicant/attachment",
        data:{id,ref_num},

        success:function(response){
            attachment.empty();
            if(response.status === true)
            {
                let data = response.data;

                if(data.length > 0)
                {
                    $.map(data,function(value){

                        cd += `<a target="_blank" href="/rsp_hiring/view/attachment/${value.id}" class="box px-2 py-2 mb-3 flex items-center transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 cursor-pointer">
                                <div class="w-10 h-10 flex-none rounded-full overflow-hidden">
                                    <img src="${value.image}">
                                </div>
                                <div class="ml-4 mr-auto">
                                    <div class="font-medium text-xs truncate">${value.attachment}</div>
                                    <div class="text-slate-500 text-xs mt-0.5">${value.attachment_type}</div>
                                </div>
                            </a>`;
                    })
                } else
                {
                        cd = `<div class="box px-2 py-2 mb-3 text-center transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 cursor-pointer">
                                    No attachment found
                            </div>`;
                }
            } else
            {
                    cd = `<div class="box px-2 py-2 mb-3 text-center transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 cursor-pointer">
                                No attachment found
                        </div>`;
            }
            attachment.append(cd);
        }, error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}

//clear the input and id
function clearFields()
{
    ref_num.Jobref = '';
    applicant.Id = '';
    exam.Result = '';
    application.Date = '';
    employee.Email = '';

    $("#emp_name").text('');
    $("#emp_pos").text('');
    $("#emp_image").attr('src','/img/user.jpg');
    $("#applied_date").text('');
    $("#approved_date").text('');
    $("#approved_by").text('');
    $("#appointment_schedule").val('');
    $("#status").text('');
    $("#email_to").val('');
    $("#title").val('');
    $("#content").val('');
    $("#notes").val('');
    $('input[type="radio"]').prop('checked',false);
    $('#email_check').prop('checked',false);
    $("#lbl_pass").removeClass('text-success');
    $("#lbl_failed").removeClass('text-danger');
    $('#attachment_list').empty();

    //remove the files when close
    myDropzone.Dropzone.files.forEach(function (file) {
        myDropzone.Dropzone.removeFile(file);
    });
}

//toggle to click the applicant details
function clickApplicantDetails()
{
    $("body").on("click",".applicant_info",function(){

        let image = $(this).data('image'),
            pos = $(this).data('pos'),
            approved_date = $(this).data('approved'),
            approval_by = $(this).data('approved_by');
            fullname = $(this).data('firstname')+' '+$(this).data('lastname'),
            stat = $(this).data('stat'),
            examnation_result = $(this).data('exam'),
            schedule = $(this).data('schedule'),
            notes = $(this).data('notes'),
            read = $(this).data('read');

            ref_num.Jobref = $(this).data('ref_num');
            applicant.Id = $(this).data('applicant_id');
            application.Date = $(this).data('applied');
            application_list.Id = $(this).data('id');
            employee.Email = $(this).data('email');

            //check the status of the applicant to display the details
            if(stat === 'Pending')
            {
                $("#status").removeClass('text-success');
                $("#status").addClass('text-pending');
                $("#lbl_approved_date").text('Approved Date:');

            } else
            {
                $("#status").removeClass('text-pending');
                $("#status").addClass('text-success');
                $("#lbl_approved_date").text('Scheduled Date:');

                if(read === true)
                {
                     //check the examination result
                    if(examnation_result == '16')
                    {
                        $("#pass").prop('checked',true);

                    } else if(examnation_result == '0')
                    {
                        $("#none").prop('checked',true);
                    }

                    lite_picker.setDate(schedule);
                    $("#notes").val(notes);
                }
            }

            if($(this).hasClass('btn-secondary-soft'))
            {
                $(this).removeClass('btn-secondary-soft');
            } else
            {
                //check if it has an access to the module
                if(read === true)
                {
                    $(".applicant_info").removeClass('btn-secondary-soft');
                    $(this).addClass('btn-secondary-soft');
                    $("#emp_name").text(fullname);
                    $("#emp_pos").text(pos);
                    $("#emp_image").attr('src',image);
                    $("#applied_date").text(application.Date);
                    $("#approved_date").text(approved_date);
                    $("#approved_by").text(approval_by);
                    $("#status").text(stat);
                    fetchApplicantAttachment(applicant.Id,ref_num.Jobref);
                }
            }
    });
}

//check the examination whether pass or failed
function toggleExamination()
{
    $('input[type="radio"]').on("click",function(){

        exam.Result = $(this).attr('name');

        if(exam.Result == 'pass')
        {
            $("#lbl_none").removeClass('text-slate-500');
            $("#lbl_failed").removeClass('text-danger');
            $("#lbl_pass").addClass('text-success');
            $("#appointment_schedule").prop('disabled',false);

        } else if(exam.Result == 'failed')
        {
            $("#lbl_none").removeClass('text-slate-500');
            $("#lbl_pass").removeClass('text-success');
            $("#lbl_failed").addClass('text-danger');
            $("#appointment_schedule").prop('disabled',true);

        } else
        {
            $("#lbl_failed").removeClass('text-danger');
            $("#lbl_pass").removeClass('text-success');
            $("#lbl_none").addClass('text-slate-600');
            $("#appointment_schedule").prop('disabled',false);
        }

        $('input[type="radio"]').prop('checked',false);
        $(this).prop('checked',true);
    });
}

//set an appointment
function setAppointment(id,data)
{
    let appoint = $("#btn_appoint");

    $.ajax({
        type: "POST",
        url: "/rsp_hiring/set/appointment/schedule",
        data:{id,data},
        dataType:'json',
        beforeSend:function(){
            appoint.prop('disabled',true);
            appoint.html(`Appoint <svg width="20" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2">
                                        <defs>
                                            <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                                                <stop stop-color="rgb(30, 41, 59)" stop-opacity="0" offset="0%"></stop>
                                                <stop stop-color="rgb(30, 41, 59)" stop-opacity=".631" offset="63.146%"></stop>
                                                <stop stop-color="rgb(30, 41, 59)" offset="100%"></stop>
                                            </linearGradient>
                                        </defs>
                                        <g fill="none" fill-rule="evenodd">
                                            <g transform="translate(1 1)">
                                                <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="white" stroke-width="3">
                                                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"></animateTransform>
                                                </path>
                                                <circle fill="rgb(30, 41, 59)" cx="36" cy="18" r="1">
                                                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"></animateTransform>
                                                </circle>
                                            </g>
                                        </g>
                                    </svg> `
                        );
        },
        success:function(response){

            if(response.status === true)
            {
                appoint.prop('disabled',false);
                appoint.html('Appoint');
                __notif_show(1,'',response.message);
                clearFields();

                //reload the data
                if(toggle_applicant_status === 'Pending Appointment' || toggle_applicant_status === '')
                {
                    applicationInfo(jobref.Id);

                } else if(toggle_applicant_status === 'Shortlist')
                {
                    fetchShortlistedApplicant(jobref.Id);
                }
            }
            else if(response.status === false)
            {
                __notif_show(-1,'',response.message);
            }
            else if(response.status === 500)
            {
                error_modal.show();
                $("#error_text").text(response.message);
                appoint.prop('disabled',false);
                appoint.html('Appoint');
            }
            else
            {
                appoint.prop('disabled',false);
                appoint.html('Appoint');
                __notif_show(-1,'',response.message);
            }

        },error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}

//click to trigger the appointment of the applicant
function toggleAppointment()
{
    $("#btn_appoint").on('click',function(){

        let appointment_date = $("#appointment_schedule").val(),
            email = $("#email_check");
            message = $("#notes").val();

        if(exam.Result)
        {
            if(exam.Result == 'pass' || exam.Result == 'none')
            {
                if($.trim(appointment_date) !== '' && $.trim(appointment_date) !== null )
                {
                    container = {
                        'ref_num':ref_num.Jobref,
                        'applicant':applicant.Id,
                        'exam':exam.Result,
                        'application_date':application.Date,
                        'appointment_date':appointment_date,
                        'message':message,
                    }

                    if(email.is(':checked'))
                    {
                        $("#email_to").val(employee.Email);
                        email_modal.show();
                        $("#content").val(message);
                        notifyApplicantEmail(container);
                    }
                    else
                    {
                        //check whether the applicant is shortlisted or update the applicant data in the shortlist
                        if(toggle_applicant_status === 'Pending Appointment' || toggle_applicant_status === '')
                        {
                            setAppointment(null,container);

                        } else if(toggle_applicant_status === 'Shortlist')
                        {
                            setAppointment(application_list.Id,container);
                        }

                    }

                    $("#appointment_schedule").removeClass('border-danger');
                } else
                {
                    $("#appointment_schedule").addClass('border-danger');
                }
            } else
            {
                $("#appointment_schedule").removeClass('border-danger');
            }
        } else
        {
            __notif_show(-1,'','Please select the examination result');
        }
    });
}

//return the applicant
function returnApplicant()
{
    $("#btn_return_applicant").on("click",function(){

        let btn_return = $("#btn_return_applicant");

        $.ajax({
            type: "POST",
            url: "/rsp_hiring/return/applicant",
            data:{id:application_list.Id,type:toggle_applicant_status,applicant_id:applicant.Id,ref_num:ref_num.Jobref},
            dataType:"json",
            beforeSend: function()
            {
                btn_return.prop('disabled',true);
                btn_return.html(`Return <svg width="20" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2">
                                            <defs>
                                                <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                                                    <stop stop-color="rgb(30, 41, 59)" stop-opacity="0" offset="0%"></stop>
                                                    <stop stop-color="rgb(30, 41, 59)" stop-opacity=".631" offset="63.146%"></stop>
                                                    <stop stop-color="rgb(30, 41, 59)" offset="100%"></stop>
                                                </linearGradient>
                                            </defs>
                                            <g fill="none" fill-rule="evenodd">
                                                <g transform="translate(1 1)">
                                                    <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="white" stroke-width="3">
                                                        <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"></animateTransform>
                                                    </path>
                                                    <circle fill="rgb(30, 41, 59)" cx="36" cy="18" r="1">
                                                        <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"></animateTransform>
                                                    </circle>
                                                </g>
                                            </g>
                                        </svg> `
                            );
            },
            success:function(response){
                if(response.status === true)
                {
                    btn_return.prop('disabled',false);
                    btn_return.html('Returns');
                    __notif_show(1,'',response.message);

                    //reload the data
                    if(toggle_applicant_status === 'Pending Appointment' || toggle_applicant_status === '')
                    {
                        applicationInfo(jobref.Id);

                    } else if(toggle_applicant_status === 'Shortlist')
                    {
                        fetchShortlistedApplicant(jobref.Id);
                    }

                    clearFields();
                } else if(response.status === false)
                {
                    btn_return.prop('disabled',false);
                    btn_return.html('Returns');
                    __notif_show(-1,'',response.message);
                } else if(response.status === 500)
                {
                    error_modal.show();
                    $("#error_text").text(response.message);
                    btn_return.prop('disabled',false);
                    btn_return.html('Returns');
                }
            },error: function(xhr, status, error) {
                console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
            }
        });

    });
}

//Trigger to send the notification
function notifyApplicantEmail(data)
{
    $("#btn_send_email").on("click",function(){

        let file_list = myDropzone.Dropzone.getQueuedFiles().length,
        flag = false;

         //check if the a file is uploaded
        if(file_list > 0)
        {
            myDropzone.Dropzone.processQueue();

            // Define the queuecomplete event handler function
            function handleQueueComplete() {
                // Check if the flag has already been called
                if (!flag) {
                    // Check if all files were successfully uploaded
                    var filesUploaded = myDropzone.Dropzone.getFilesWithStatus(Dropzone.SUCCESS).length === myDropzone.Dropzone.files.length;

                    if (filesUploaded) {
                        // Set the flag to true to indicate that process has called off
                        triggerEmailNotification(data,temp_files.Uploaded);
                        flag = true;
                    } else {
                        // Handle the case where not all files were successfully uploaded
                        __notif_show(-1, '', 'Some files failed to upload. Please try again.');
                    }
                }
            }

            // Attach the event handler to the queuecomplete event
            myDropzone.Dropzone.on("queuecomplete", handleQueueComplete);
        } else
        {
            triggerEmailNotification(data,null);
        }
    });
}

//Send email notitification event
function triggerEmailNotification(data,attachment)
{
    let email = $("#email_to").val(),
        title = $("#title").val(),
        content = $("#content").val(),
        applicant = $("#emp_name").text(),
        btn_send_mail = $("#btn_send_email");

    $.ajax({
        type: "POST",
        url: "/rsp_hiring/send/email/notification",
        data:{email,title,content,applicant,attachment},
        dataType:"json",
        beforeSend:function(){
            btn_send_mail.prop('disabled',true);
            btn_send_mail.html(`Send <svg width="20" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2">
                                        <defs>
                                            <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                                                <stop stop-color="rgb(30, 41, 59)" stop-opacity="0" offset="0%"></stop>
                                                <stop stop-color="rgb(30, 41, 59)" stop-opacity=".631" offset="63.146%"></stop>
                                                <stop stop-color="rgb(30, 41, 59)" offset="100%"></stop>
                                            </linearGradient>
                                        </defs>
                                        <g fill="none" fill-rule="evenodd">
                                            <g transform="translate(1 1)">
                                                <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="white" stroke-width="3">
                                                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"></animateTransform>
                                                </path>
                                                <circle fill="rgb(30, 41, 59)" cx="36" cy="18" r="1">
                                                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"></animateTransform>
                                                </circle>
                                            </g>
                                        </g>
                                    </svg>`);
        },
        success:function(response){
            if(response.status === 400)
            {
                let validate = response.message;

                if(validate)
                {
                    btn_send_mail.prop('disabled',false);
                    btn_send_mail.html('Send');

                    if(validate['email'])
                    {
                        __notif_show(-1,'',validate['email'][0]);
                        $("#email").addClass('border-danger');

                    } else if(validate['title'])
                    {
                        __notif_show(-1,'',validate['title'][0]);
                        $("#email").removeClass('border-danger');
                        $("#title").addClass('border-danger');

                    } else if(validate['content'])
                    {
                        __notif_show(-1,'',validate['content'][0]);
                        $("#email").removeClass('border-danger');
                        $("#title").removeClass('border-danger');
                        $("#content").addClass('border-danger');
                    }
                }
            } else
            {
                __notif_show(1,'',response.message);
                btn_send_mail.prop('disabled',false);
                btn_send_mail.html('Send');
                email_modal.hide();

                if(toggle_applicant_status === 'Pending Appointment' || toggle_applicant_status === '')
                {
                    setAppointment(null,data);
                }
                clearFields();
            }
        }
    });
}

//select between the applicant status form shortlist to awaiting appointment
function toggleApplicantStatus()
{
    $("#toggle_applicant_status").on("change",function(){

        toggle_applicant_status = $(this).val();

        if(toggle_applicant_status === "Pending Appointment")
        {
            applicantList();

        } else if( toggle_applicant_status === "Shortlist")
        {
            fetchShortlisted();
        }
    });
}

//fetch the shortlited position
function fetchShortlisted(search,filter_size,page)
{
    let cd = '',
        tbdy = $("#applicant_list"),
        pagination = $("#position_list_pagination"),
        summary_list = $("#position_list_summary");

    $.ajax({
        type: "POST",
        url: "/rsp_hiring/fetch/shortlisted/applicant",
        data:{search,filter_size,page},
        beforeSend:function(){

            tbdy.empty();
            summary_list.empty();
            pagination.empty();

            cd = `<tr>
                        <td colspan="5">
                            <div class="py-5" style="display:flex;justify-content:center;">
                                <svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-7 h-7">
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

            tbdy.append(cd);
        },
        success:function(response){

            clearFields();
            tbdy.empty();
            summary_list.empty();
            pagination.empty();

            if(response.status === true)
            {
                let data = response.data,
                    cd = '';
                    text_color = '';

                if(data.length > 0)
                {
                    $.map(data,function(value){

                        if(value.stat === 'Shortlisted')
                        {
                            text_color = 'text-success';
                        }

                        cd += `<tr id="${value.id}" class="intro-x cursor-pointer applicant_details">
                                    <td class="underline decoration-dotted font-medium text-slate-500">${value.plantilla}</td>
                                    <td class="font-medium">
                                        ${value.position}
                                        <div class="text-xs text-slate-500">${value.assign_place}</div>
                                    </td>
                                    <td class="font-medium">
                                        ${value.posting_date}
                                        <div class="text-xs text-slate-500">${value.close_date}</div>
                                    </td>
                                    <td class="font-medium">
                                        <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 zoom-in tooltip dropdown">
                                            ${value.shortlist_applicant}
                                        </div>
                                    </td>
                                    <td class=${text_color}>${value.stat}</td>
                                </tr>
                                <tr class="intro-y box shortlist_details" hidden>
                                    <td colspan="5">
                                        <div class="col-span-12 lg:col-span-9 2xl:col-span-10">
                                            <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                                                <h2 class="font-medium text-base mr-auto">
                                                    <div class="intro-y">Applicant List</div>
                                                    <div class="intro-y text-xs text-slate-500">List of applicant for this position</div>
                                                </h2>
                                            </div>
                                            <div class="flex flex-col-reverse sm:flex-row items-center">
                                                <div class="block ml-3 mr-auto text-slate-500 applicant_list_summary"></div>
                                                <div class="w-full sm:w-auto flex">
                                                    <div class="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-auto md:ml-0">
                                                        <div class="w-full sm:w-56 relative text-slate-500 mt-5">
                                                            <input type="text" class="form-control w-full sm:w-56 pr-10" id="applicant_list_search" placeholder="Search by employee..." autocomplete="off">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="search" class="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="grid grid-cols-12 gap-3 sm:gap-6 mt-5 tbdy_applicant">
                                                </div>
                                                <div class="loading_icon"></div>
                                                <div class="intro-y flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-6">
                                                    <nav class="w-full sm:w-auto sm:mr-auto">
                                                        <ul class="pagination apllicant_list_pagination">
                                                        </ul>
                                                    </nav>
                                                    <select id="filter_applicant_list_size" class="w-20 form-select box mt-3 sm:mt-0">
                                                        <option value=9>9</option>
                                                        <option value=18>18</option>
                                                        <option value=27>27</option>
                                                        <option value=50>50</option>
                                                        <option value="All">All</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>`;
                    });

                    tbdy.append(cd);
                    summary_list.append(response.summary);
                    paginationLink(response,"#position_list_pagination");

                } else
                {
                    tbdy.append('<td colspan="5" class="text-center font-semibold">No data found!</td>');
                }
            } else
            {
                tbdy.append('<td colspan="5" class="text-center font-semibold">No data found!</td>');
            }
        },error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    })
}

//fetch the shortlisted applicant details
function fetchShortlistedApplicant(id,search,size,page)
{
    let tbdy = $('.tbdy_applicant'),
        loading = $('.loading_icon');
        summary = $('.applicant_list_summary');
        pagination = $('.apllicant_list_pagination'),
        cd = '';

    $.ajax({
        type: "POST",
        url: "/rsp_hiring/fetch/shortlisted/applicant/details",
        data:{id,search,size,page},
        beforeSend:function(){
            tbdy.empty();
            loading.empty();
            summary.empty();
            pagination.empty();

            cd = `<div class="w-full py-5" style="display:flex;justify-content:center;">
                        <svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-7 h-7">
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

            loading.append(cd);

        },
        success:function(response){

            tbdy.empty();
            loading.empty();
            summary.empty();
            pagination.empty();

            if(response.status === true)
            {
                let data  = response.data,
                    cd = '';

                if(data.length > 0)
                {
                    $.map(data,function(value){
                        cd += `<div class="col-span-6 sm:col-span-4 md:col-span-3 2xl:col-span-2 cursor-pointer applicant_info" data-id="${value.id}" data-ref_num ="${value.ref_num}" data-applicant_id ="${value.applicant_id}" data-image="${value.image}" data-firstname="${value.first_name}" data-lastname="${value.last_name}" data-pos="${value.position}" data-applied="${value.applied_date}" data-approved="${value.scheduled_date}" data-approved_by="${value.approved_by}" data-email="${value.email}" data-stat="${value.stat}" data-exam="${value.exam}" data-schedule="${value.scheduled_date}" data-notes="${value.notes}" data-read="${value.privilege}">
                                    <div class="file rounded-md p-5 relative transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400">
                                        <div class="w-3/5 mx-auto">
                                            <img class="rounded-md " src="${value.image}">
                                        </div>
                                        <div class="block font-medium mt-4 text-center truncate text-xs">${value.last_name} ${value.first_name}</div>
                                        <div class="text-slate-500 text-xs text-center mt-0.5">${value.scheduled_date}</div>
                                    </div>
                                </div>`;
                    });

                    tbdy.append(cd);
                    summary.append(response.summary);
                    paginationLink(response,'.apllicant_list_pagination');
                }
            }
        }, error: function(xhr, status, error) {
            console.log("Error in ajax: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
    });
}

//clear the properties
function clearLog()
{
    $("#activity_tbdy").empty();
    $("#activity_logs_date_start").val('');
    $("#activity_logs_date_end").val('');
    $("#search_activity_log").val();
    start.StartDate = '';
    end.EndDate = '';
    scroll.Paginate = 1;
}

function triggerActivityLogs()
{
    $("#activity_logs").on("click",function(){
        clearLog();
        getActivityLogs();
    });
}

//Activity logs
function getActivityLogs(search,start_date,end_date,page)
{
        let tbdy = $("#activity_tbdy"),
            loading = $("#loading"),
            not_found = $("#not_found");
            cd = '';

        $.ajax({
            type: "POST",
            url: "/rsp_hiring/fetch/activity/logs",
            data:{search,start_date,end_date,page},
            beforeSend:function(){
                loading.show();
                not_found.hide();
            },
            success:function(response){

                if(response === '' || response === undefined)
                {
                    not_found.show();
                }

                if(response.status === true)
                {

                    let data = response.data,
                        has_page = response.has_more_pages,
                        next_page = response.next_page;

                        cd = '';
                        loading.hide();
                        not_found.hide();

                    if(data.length > 0)
                    {
                        $.map(data,function(logs){
                            $.map(logs,function(value){
                                cd = `<div class="px-5 py-3 mb-3 mt-2 cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400">
                                            <div class="text-xs flex items-center ml-4 mr-auto">
                                                <div class="font-medium mr-2">Id:</div>
                                                <div class="text-slate-500 text-xs">${value.subject_id}</div>
                                            </div>
                                            <div class="text-xs flex items-center ml-4 mr-auto">
                                                <div class="font-medium mr-2">User:</div>
                                                <div class="text-slate-500 text-xs font-semibold">${value.causer_id}</div>
                                            </div>
                                            <div class="text-xs flex items-center ml-4 mr-auto">
                                                <div class="font-medium mr-2">Data:</div>
                                                <div class="text-slate-500 text-xs justify-start">${value.data}</div>
                                            </div>
                                            <div class="text-xs flex items-center ml-4 mr-auto">
                                                <div class="font-medium mr-2">Timestamp:</div>
                                                <div class="text-slate-500 text-xs">${value.timestamp}</div>
                                            </div>
                                            <div class="text-xs flex items-center ml-4 mr-auto">
                                                <div class="font-medium mr-2">Action:</div>
                                                <div class="text-slate-500 text-xs ${value.text_color}">${value.action}</div>
                                            </div>
                                        </div>`;

                                tbdy.append(cd);
                            });
                        });

                        if(has_page)
                        {
                            page = next_page;
                        } else
                        {
                            $(window).off('scroll');
                        }
                    }
                }
            }
        });
}

//scroll the activity logs
function scrollActivityLogs()
{
    $("#activity_tbdy").on('scroll',function(){
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 100) {
            scroll.Paginate++;
            getActivityLogs(activity.Search,start.StartDate,end.EndDate,scroll.Paginate);
        }
    });
}

function searchActivityLogs()
{
    $("#search_activity_log").on("input",function(){

        scroll.Paginate = 1;
        activity.Search = $(this).val();

        clearTimeout(typingTimer);
        typingTimer = setTimeout(function(){
            $("#activity_tbdy").empty();
            getActivityLogs(activity.Search,start.StartDate,end.EndDate,scroll.Paginate);
        },doneTypingInterval);
    });
}

//filter the date in the activity logs
function filterDateActivityLog()
{
    $("#filter_activity_logs").on("click",function(){

        start.StartDate = $("#activity_logs_date_start").val(),
        end.EndDate = $("#activity_logs_date_end").val();

        scroll.Paginate = 1;
        $("#activity_tbdy").empty();
        drp_down_filter_date.hide();
        getActivityLogs(activity.Search,start.StartDate,end.EndDate,scroll.Paginate);
    });
}

//cancel the filter date
function cancelActivityLogsFilterDate()
{
    $("#cancel_activity_logs").on("click",function(){
        $("#activity_logs_date_start").val('');
        $("#activity_logs_date_end").val('');
        start.StartDate = '';
        end.EndDate = '';
        drp_down_filter_date.hide();
    });
}


