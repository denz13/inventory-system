var _token = $('meta[name="csrf-token"]').attr('content');
var tbls1, tbls2;

$(document).ready(function(){

   const status = 0;
   load_All_tables();
   displaySchedule();
   displayResourceData();
   updateExportLink(status);
   updateTopResourceExportLink(status)
   updateTopRequesterExportLink(status);
   displayRequesterData()
   //    getAllStats();
//    loadTopRequester();

//    $('#btn_export_report_pdf').on('click', function () {
//     updateExportLink(status);
//     });

});


function displayResourceData() {

    $.ajax({
        url: '/schedule/My-getTopresources',
        method: 'POST',
        type: 'POST',
        data: {
            _token,

        },
        dataType: 'json',
        success: function (response) {
            table_Top_Resource.clear().draw();

        //   console.log(response);
            response.forEach(function (resource) {
                var cd = '' +
                                    '<tr>' +
                                        '<td class="tooltip cursor-pointer" title="">' + resource.name + '</td>' +
                                        '<td>' + resource.thisYearCount + '</td>' +
                                        '<td>' + resource.thisMonthCount + '</td>' +
                                        '<td>' + resource.todayCount + '</td>' +
                                        '<td>' + resource.scheduleCount + '</td>' +
                                        '<td>' + resource.totalHours + ' hrs' + '</td>' +
                                        '<td>' + resource.utilizationPercentage + '%' + '</td>' +
                                    '</tr>';

               // rows.push($(cd));
               table_Top_Resource.row.add($(cd)).draw();

            });

        },
        error: function (error) {
            console.error('Error fetching schedule data:', error);
        },
    });
}
function displayRequesterData() {

    $.ajax({
        url: '/schedule/My-getTopRequester',
        method: 'POST',
        type: 'POST',
        data: {
            _token,

        },
        dataType: 'json',
        success: function (response) {
            table_Top_Requester.clear().draw();

        //   console.log(response);
            response.forEach(function (resource) {
                var cd = '' +
                                    '<tr>' +
                                        '<td class="tooltip cursor-pointer" title="">' + resource.name + '</td>' +
                                        '<td>' + resource.scheduleCount + '</td>' +
                                        '<td>' + resource.totalHours + ' hrs' + '</td>' +
                                        '<td>' + resource.utilizationPercentage + '%' + '</td>' +
                                    '</tr>';

               // rows.push($(cd));
               table_Top_Requester.row.add($(cd)).draw();

            });

        },
        error: function (error) {
            console.error('Error fetching schedule data:', error);
        },
    });
}
function load_All_tables(){
    try{
        /***/
        table_All_Schedule = $('#table_All_Schedule').DataTable({
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
            "iDisplayLength": 5,
            "aaSorting": [],

            columnDefs:
                [
                    {
                        className: "dt-head-center",
                        targets: [  6, ],
                        "orderable": false,
                    },
                ],
        });

        table_Top_Resource = $('#table_Top_Resource').DataTable({
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
            "iDisplayLength": 5,
            "aaSorting": [],

            columnDefs:
                [
                    {
                        className: "dt-head-center",
                        targets: [  3, ],
                        "orderable": false,
                    },
                ],
        });

        table_Top_Requester = $('#table_Top_Requester').DataTable({
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
            "iDisplayLength": 3,
            "aaSorting": [],

            columnDefs:
                [
                    {
                        className: "dt-head-center",
                        targets: [  3, ],
                        "orderable": false,
                    },
                ],
        });
        /***/
    }catch(err){  }
}

//eheehhehh
function displaySchedule() {

    $.ajax({
        url: '/schedule/My-reportAnalyticss',
        method: 'POST',
        type: 'POST',
        data: {
            _token,

        },
        dataType: 'json',
        success: function (response) {

            console.log('sdasdasd'+response);
            table_All_Schedule.clear().draw();

            var rows = [];
        //   console.log(response);
            response.forEach(function (combinedData) {

                var statusColor = getStatusColor(combinedData.sched_status);
                var statusValue = getStatusValue(combinedData.sched_status);

                const startDate =  combinedData.sched_startDate;
                const endDate = combinedData.sched_endDate;
                const formattedDateRange = formatDateRange(startDate, endDate);

                // Generate buttons
                // var buttons = generateButtons(combinedData);
                $('#filer_TotalSchedules p').text(combinedData.approvedScheduleCount);
                $('#filer_ThisMonth p').text(combinedData.thisMonthScheduleCount);
                $('#filer_Today p').text(combinedData.todayScheduleCount);
                $('#filer_Year p').text(combinedData.thisYearScheduleCount);

                var maxLength = 40;

                var sched_purpose = truncateText(combinedData.sched_purpose, maxLength);
                var sched_destination = truncateText(combinedData.sched_destination, maxLength);

                var cd = "";
                cd = '' +
                '<tr>'+
                        // '<td hidden>'+id+'</td>'+
                        '<td class="tooltip cursor-pointer" title="">'+combinedData.res_name+' ('+ combinedData.res_serial_plate_no+')</td>'+
                        '<td >'+combinedData.fullname+'</td>'+
                        '<td class="tooltip cursor-pointer" title="'+combinedData.sched_destination+'">'+sched_destination+'</td>'+
                        '<td class="tooltip cursor-pointer" title="'+combinedData.sched_purpose+'">'+sched_purpose+'</td>'+
                        '<td >'+formattedDateRange+'</td>'+
                        '<td  class="text-'+combinedData.class+'">'+
                        '<div class="flex items-center" >'+
                                // '<a id="for_action_button"  href="javascript:;" class="box flex items-center px-3 py-2 rounded-md bg-white/10 dark:bg-darkmode-700 font-medium" data-tw-toggle="modal" data-tw-target="#view_signatories_Schedule"> <div class="w-2 h-2 bg-'+combinedData.class+' rounded-full mr-3"></div> '+ combinedData.status+' </a>'+
                                '<a class="box flex items-center px-3 py-2 rounded-md bg-white/10 dark:bg-darkmode-700 font-medium for-action-button" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view_signatories_Schedule"  onclick="openSignatoriesModal('+ combinedData.id +')"><div class="w-2 h-2 bg-' + combinedData.class + ' rounded-full mr-3"></div> ' + combinedData.status + '</a>'+
                                '</div>'+

                        '</td>' +
                                '<td>' +
                                '<div class="flex justify-center items-center">'+

                                    '<div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
                                        '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                        '<div class="dropdown-menu w-40">'+
                                            '<div class="dropdown-content">'+

                                            combinedData.can_view+

                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</td>' +
                '</tr>'+
                '';
               // rows.push($(cd));
               table_All_Schedule.row.add($(cd)).draw();

            });

        },
        error: function (error) {
            console.error('Error fetching schedule data:', error);
        },
    });
}

function updateSearch(status) {
    console.log(status);
    $.ajax({
        url: '/schedule/My-reportAnalyticss',
        method: 'POST',
        type: 'POST',
        data: {
            _token,
            status: status,
        },
        dataType: 'json',
        success: function (response) {
            table_All_Schedule.clear().draw();
            var rows = [];
          // console.log(response);
            response.forEach(function (combinedData) {

                var statusColor = getStatusColor(combinedData.sched_status);
                var statusValue = getStatusValue(combinedData.sched_status);

                const startDate =  combinedData.sched_startDate;
                const endDate = combinedData.sched_endDate;
                const formattedDateRange = formatDateRange(startDate, endDate);
                getExportStatus(combinedData.sched_status);
                // Generate buttons
                // var buttons = generateButtons(combinedData);

                var maxLength = 40;

                var sched_purpose = truncateText(combinedData.sched_purpose, maxLength);
                var sched_destination = truncateText(combinedData.sched_destination, maxLength);

                var cd = "";
                cd = '' +
                '<tr>'+
                        // '<td hidden>'+id+'</td>'+
                        '<td class="tooltip cursor-pointer" title="">'+combinedData.res_name+' ('+ combinedData.res_serial_plate_no+')</td>'+
                        '<td >'+combinedData.fullname+'</td>'+
                        '<td class="tooltip cursor-pointer" title="'+combinedData.sched_destination+'">'+sched_destination+'</td>'+
                        '<td class="tooltip cursor-pointer" title="'+combinedData.sched_purpose+'">'+sched_purpose+'</td>'+
                        '<td >'+formattedDateRange+'</td>'+
                        '<td  class="text-'+combinedData.class+'">'+
                        '<div class="flex items-center" >'+
                                // '<a id="for_action_button"  href="javascript:;" class="box flex items-center px-3 py-2 rounded-md bg-white/10 dark:bg-darkmode-700 font-medium" data-tw-toggle="modal" data-tw-target="#view_signatories_Schedule"> <div class="w-2 h-2 bg-'+combinedData.class+' rounded-full mr-3"></div> '+ combinedData.status+' </a>'+
                                '<a class="box flex items-center px-3 py-2 rounded-md bg-white/10 dark:bg-darkmode-700 font-medium for-action-button" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view_signatories_Schedule"  onclick="openSignatoriesModal('+ combinedData.id +')"><div class="w-2 h-2 bg-' + combinedData.class + ' rounded-full mr-3"></div> ' + combinedData.status + '</a>'+
                                '</div>'+

                        '</td>' +
                                '<td>' +
                                '<div class="flex justify-center items-center">'+

                                    '<div class="w-8 h-8 rounded-full flex justify-center items-center  border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
                                        '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                        '<div class="dropdown-menu w-40">'+
                                            '<div class="dropdown-content">'+

                                            combinedData.can_view+

                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</td>' +
                '</tr>'+
                '';
               // rows.push($(cd));
               table_All_Schedule.row.add($(cd)).draw();
                updateExportLink(status);
            });
           // tblschedule_list.row.add($(rows)).draw();
        },
        error: function (error) {
            console.error('Error fetching schedule data:', error);
        },
    });
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...'; // Truncate text
    } else {
        return text;
    }
}

function updateExportLink(status) {
    var statuss = status;
    const exportLink = document.getElementById('btn_export_report_pdf');
    exportLink.href = `/schedule/print/My-reportPdf/${statuss}/vw`;

}
function updateTopResourceExportLink() {
    const statuss = 'Topresource';
    const status = btoa(statuss);
    console.log(statuss);
    const exportLink = document.getElementById('btn_topResource_report_pdf');
    exportLink.href = `/schedule/print/My-reportPdf/${statuss}/vw`;
}
function updateTopRequesterExportLink() {
    const statuss = 'Toprequester';
    const status = btoa(statuss);
    const exportLink = document.getElementById('btn_topRequester_report_pdf');
    // Modify the following line based on the data you want to use for the link
    // For example, you might replace 'status' with the appropriate variable or value
    exportLink.href = `/schedule/print/My-reportPdf/${statuss}/vw`;
}
function getExportStatus(status) {
    const statusId = status;
    return statusId;
}
function ReportView(getExportStatus)
{

}

function getStatusColor(status) {
    switch (status) {
        case 1:
            return 'grey';
        case 2:
            return 'orange'; // Change this to the desired color
        case 3:
            return 'blue'; // Change this to the desired color
        case 4:
            return 'green'; // Change this to the desired color
        case 5:
            return 'red'; // Change this to the desired color
        default:
            return ''; // Default color, or you can specify another color
    }
}
function getStatusValue(status) {
    switch (status) {
        case 1:
            return 'On hold';
        case 2:
            return 'Pending'; // Change this to the desired color
        case 3:
            return 'On going'; // Change this to the desired color
        case 4:
            return 'Approved'; // Change this to the desired color
        case 5:
            return 'Reject'; // Change this to the desired color
        default:
            return ''; // Default color, or you can specify another color
    }
}
function formatDateRange(startDate, endDate) {
    // Parse the start and end date strings into Date objects
    let formattedDateRange = ''; // Declare as a regular variable using 'let'
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Get the month names and day numbers
    const monthNames = [
        'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.',
        'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
    ];

    const startMonth = monthNames[startDateObj.getMonth()];
    const startDay = startDateObj.getDate();
    const endDay = endDateObj.getDate();
    const year = startDateObj.getFullYear();

    if (startDay == endDay) {
       formattedDateRange = startMonth + ' ' + startDay + ', ' + year;
    } else {
       formattedDateRange = startMonth + ' ' + startDay + ' - ' + endDay + ', ' + year;
    }

    // Format the date range
    return formattedDateRange;
}
