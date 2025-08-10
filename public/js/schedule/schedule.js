

var _token = $('meta[name="csrf-token"]').attr('content');
var scheduleid;
var driverName;
var driverID;
var resourceName;
var resourceID;
var tempId;
var officeid;
var officeName;
var scheduleStatus;
var NotAvailableDates = [];
var canView;
var generateSched;
var esig = 1;
const ResourceName = $('#ResourceName');
const rc_office = $('#rc_office2');
const searchEmployee = $('#searchEmployee');
var searchEmployee_Id;
var startDateStr;
var endDateStr;
var schedID;
$(document).ready(function(){


    load_table();
    displaySchedule();
    getDrivers();
    getResource();
    getEmployee();
    getRC();
    $('#daterangetimeUpdate').daterangepicker({

        timePicker: true,
        timePickerIncrement: 30,
        drops: "auto",
        startDate: moment(),
        endDate: moment(),
        linkedCalendars: true,
        alwaysShowCalendars: true,
        autoUpdateInput: true,
        maxSpan: { days: 7 },

        locale: {
          format: 'M/DD/YYYY hh:mm A',
          cancelLabel: 'Clear',
          buttonLabel: 'Apply', // Corrected typo
        },
        minDate: moment().startOf('day'),
        isInvalidDate: function(date) {

            var selectedDate = date.format('YYYY-MM-DD hh:mm A'); // Selected date


            // Check for bookings on the selected date or date range
            var isBooked = NotAvailableDates.some(function(booking) {
                var startDate = moment(booking.start_date).format('YYYY-MM-DD hh:mm A');
                var endDate = moment(booking.end_date).format('YYYY-MM-DD hh:mm A');

                // If the schedule is for a single day
                if (startDate === endDate) {
                    return selectedDate === startDate;
                } else {
                    return moment(selectedDate).isBetween(startDate, endDate, null, '[]');
                }
            });

            return isBooked;
        },
    }).on('apply.daterangepicker', function(ev, picker) {
           // Set the applyButtonClicked flag to true when Apply is clicked
    $(this).data('applyButtonClicked', true);

    // Set the input field value to the selected date range
    var startDate = picker.startDate.format('M/DD/YYYY hh:mm A');
    var endDate = picker.endDate.format('M/DD/YYYY hh:mm A');
    $(this).val(startDate + ' - ' + endDate);

    // Set styles for a successful selection
    $(this).css({
        'border-color': '#8fdf82',
        'color': '#8fdf82'
    });

    }).on('hide.daterangepicker', function(ev, picker) {
        // Check if the Apply button was clicked
        var applyButtonClicked = $(this).data('applyButtonClicked');

        if (!applyButtonClicked) {
            // If the Apply button was not clicked, perform actions for invalid selection
            $(this).val('Click apply to select dates');

            // Apply styles for an invalid selection
            $(this).css({
                'border-color': 'orange',
                'color': 'orange'
            });

            // Show notification for invalid selection

        }

        // Reset the flag for the next use
        $(this).data('applyButtonClicked', false);
    }).on('show.daterangepicker', function(ev, picker) {
        // Handle picker show event (optional)
      }).on('showCalendar.daterangepicker', function(ev, picker) {
        // Handle calendar show event (optional)
      });



      $('#daterangetimeUpdate').on('apply.daterangepicker', function(ev, picker) {
        startDateStr = picker.startDate.format('YYYY-MM-DD hh:mm A')
        endDateStr =  picker.endDate.format('YYYY-MM-DD hh:mm A')

     });

    $('#driversName').on('change', function() {
         driverID = $(this).val();
         driverName = $('#driversName option:selected').text();

    });
    $('#driversName').select2({
        minimumResultsForSearch: Infinity,
    });
    $('#ResourceName').on('change', function() {
        resourceID = $(this).val();
        resourceName = $('#ResourceName option:selected').text();
   });




    $('#rc_office2').on('change', function() {
        officeid = $(this).val();
        officeName = $('#rc_office2 option:selected').text();
   });

   $("body").on("click", "#allow_esign", function(e) {
    e.stopPropagation();
    var isChecked = $(this).prop("checked");
    esig = isChecked ? 1 : 0;

    });

    $('#addschedule').on('click', function () {

        resourceName = $('#Resource_Name').val();
        resourceId = $('#resourceID').val();
        serialPlate = $('#Serial_Plate').val();
        destination = $('#locationSchedule').val();
        reason = $('#sched_reason').val();



        if (!startDateStr || !endDateStr || !destination || !reason || !driverName) {
            // Handle the case when required fields are missing

            __notif_show(-1, 'WARNING', 'Please fill in all required fields. Thank you');

            return;
        }
        else
        {
            finalCheckerConflict(startDateStr, endDateStr, resourceId)

        }

    });

    $(document).on('click', '[id^="btn_delete_"]', function () {
        scheduleid = $(this).data('to-id');

                __modal_toggle('deleteConfirmationModal');
    });
    $(document).on('click', '[id^="btn_update_to"]', function () {

        scheduleid = $(this).data('to-id');

        getRecord(scheduleid);
        $('#btn_update_to').css('display', 'none');
     });

        $('#btnShowCalendar').click(function() {
            $('#calendarContainer').toggle();
            $(this).text(function(i, text) {
                return text === "Hide Calendar" ? "Show Calendar" : "Hide Calendar";
            });

        });


    $('#updateSchedule').click(function() {


        var updatedData = {
             schedId: $('#schedRecordID').val(),
             sched_ResourcetypeId : $('#ResourceNameID').val(),
             sched_office_id : $('#officeId').val(),
             sched_destination : $('#locationSchedule').val(),
             sched_driver : driverID,
             sched_purpose : $('#sched_reason').val(),
             sched_startDate : startDateStr,
             sched_endDate : endDateStr };

        $.ajax({
            url: '/schedule/My-updateSchedule',
            method: 'POST',
            data: {
                updatedData: updatedData,
                _token: _token
                 },
            dataType: 'json',
            success: function(response) {

                __notif_show(1, 'SUCCESS', 'Schedule Updated!');


            },
            error: function(error) {
                // Handle error response

                __notif_show(-1, 'Error updating schedule', 'Please try again');
            }
        });
        scheduleid="";
        __modal_hide('update_sched_modal');

        displaySchedule();

    });



    $(document).on('click', '[id^="release_schedule"]', function () {

         scheduleid = $(this).data('to-id');

         __modal_toggle('ReleaseConfirmationModal');
            signatoriesDetails(scheduleid);



    });


    $('#donebtn').on('click', function () {
        displaySchedule();

    });
    $('#confirmDeleteButton').on('click', function () {
        deleteSchedule(scheduleid);
    });
    $('#confirmReleaseButton').on('click', function () {
        releaseschedule(scheduleid);

    });

    $('#searchEmployee').on('change', function() {



    });

    $('#addButtonEmployee').on('click', function () {

        savePassenger();
    });


 });
 function savePassenger(){
    var shed_idd = schedID;
    var idd = searchEmployee_Id;
    console.log(shed_idd,idd);
    $.ajax({
        url: '/schedule/My-savePassenger',
        type: 'POST',
        data: {
            _token,
            id: idd,
            sched_id: shed_idd,
        },
        success: function (response) {
            refreshTable(scheduleid);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching driver names:', error);
        }
    });

 }

 function GetDates(resourceId) {
    $('#spinner-overlay').show();
    $.ajax({
        url: '/schedule/My-checkConflict',
        method: 'POST',
        data: {
            _token: _token, // Assuming _token is defined elsewhere
            resourceId: resourceId,
        },
        dataType: 'json',
        success: function (response) {
            // Initialize NotAvailableDates array
           NotAvailableDates = [];

            // Iterate over each schedule record
            response.schedules.forEach(function(schedule) {
                // Extract schedule data

                var startDate = schedule.start_date;
                var endDate = schedule.end_date;

                // Push the schedule data into NotAvailableDates array
                NotAvailableDates.push({start_date: startDate, end_date: endDate});
                $('#spinner-overlay').hide();
            });
            console.log('daterange', NotAvailableDates);
            // Now NotAvailableDates array contains the desired data
        }
    });
}
function getRC() {
    rc_office.select2({
        placeholder: "Search office",
        allowClear: true,
        multiple: false,
        closeOnSelect: false,
        minimumInputLength: 2,
        width: "100%",
        ajax: {
            url: '/schedule/My-getRC',
            data: function (params) {
                return {
                    q: params.term, // The search term
                    _token: _token // Add CSRF token if not included in the request headers
                };
            },
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
                return {
                    results: $.map(data.office, function (office) {
                        return {
                            text: office.centername,
                            id: office.responid,
                        };
                    }),
                };
            },
        },
    });


    rc_office.on('select2:select', function (e) {
         officeId = e.params.data.id;
         officeName = e.params.data.text;

         $('#officeId').val(officeId);
         $('#rc_office2').val(officeName);

    });

    // Handle deselection changes
    rc_office.on('select2:unselect', function (e) {
        $('#officeId').val('');
        $('#rc_office2').val('').trigger('change');
   });
}

function getResource() {
    ResourceName.select2({
        placeholder: "Search Resource",
        allowClear: true,
        multiple: false,
        closeOnSelect: false,
        minimumInputLength: 2,
        width: "100%",
        ajax: {
            url: '/schedule/My-getResourcesAllCategory',
            data: function (params) {
                return {
                    q: params.term, // The search term
                    _token: _token // Add CSRF token if not included in the request headers
                };
            },
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
                return {
                    results: $.map(data.resource, function (resource) {
                        return {
                            text: resource.res_name,
                            id: resource.id,
                        };
                    }),
                };
            },
        },

    });


    ResourceName.on('select2:select', function (e) {
         resourceID = e.params.data.id;
         resName = e.params.data.text;

         $('#ResourceNameID').val(resourceID);
         $('#ResourceName').val(resName);

    });

    // Handle deselection changes
    ResourceName.on('select2:unselect', function (e) {
        $('#ResourceNameID').val('');
        $('#ResourceName').val('').trigger('change');
   });
}

function refreshTable(scheduleid) {
    $.ajax({
        url: '/schedule/My-getScheduleRecord', // Adjust the URL as per your route configuration
        method: 'POST',
        data: {
            id: scheduleid,
            _token: _token // Add CSRF token if not included in the request headers
        },
        dataType: 'json',
        beforeSend: function() {
            $('#loading-spinner').html('<i class="fas fa-spinner fa-spin"></i> Loading...');
        },
        success: function(response) {
            $('#loading-spinner').empty();

            // Clear existing table rows
            $('#passengerName').empty();

            // Populate table with new data
            response.passenger_names.forEach((passenger, index) => {
                $('#passengerName').append(`
                    <tr>
                        <td class="whitespace-nowrap">${index + 1}</td>
                        <td class="whitespace-nowrap">${passenger.fullName}</td>
                        <td class="whitespace-nowrap" style="display: none">${passenger.sched_AgencyID}</td>
                        <td class="whitespace-nowrap" style="display: none">${schedID}</td>
                        <td class="whitespace-nowrap text-right">
                            <button class="btn btn-danger btn-sm delete-passenger" data-id="${passenger.sched_AgencyID}">Delete</button>
                        </td>
                    </tr>
                `);
            });

            // Bind delete button click event
            $('.delete-passenger').on('click', function() {
                const id = $(this).data('id');
                deletePassenger(id, schedID);
            });
        },
        error: function(error) {
            console.error('Error fetching schedule record data:', error);
        }
    });
}

 function getRecord(scheduleid)
 { $('#btn_update_to').css('display', 'none');
    __modal_toggle('update_sched_modal');
    $.ajax({
        url: '/schedule/My-getScheduleRecord', // Adjust the URL as per your route configuration
        method: 'POST',
        data: {
            id: scheduleid,
            _token: _token // Add CSRF token if not included in the request headers
        },
        dataType: 'json',
        beforeSend: function() {
            $('#loading-spinner').html('<i class="fas fa-spinner fa-spin"></i> Loading...');
        },
        success: function(response) {

            $('#loading-spinner').removeClass('p-5');
            $('#loading-spinner').empty();
            $('#updates').css('display', 'block');

            $('#schedRecordID').val(response.id);
                driverID = response.sched_driver;
                driverName = response.sched_driverName;
                schedID = response.sched_passId;
                var driverOption = new Option(response.sched_driverName, response.sched_driver, true, true);
                $('#driverName_Id').val(response.sched_driver);
                $('#driversName').append(driverOption).trigger('change');

                var newOption = new Option(response.officeName, response.officeId, true, true);
                $('#officeId').val(response.officeId);
                $('#rc_office2').append(newOption).trigger('change');

                var defaultValresource = new Option(response.res_name, response.sched_ResourcetypeId, true, true);
                $('#ResourceNameID').val(response.sched_ResourcetypeId);
                $('#ResourceName').append(defaultValresource).trigger('change');


                $('#locationSchedule').val(response.sched_destination);
                $('#sched_reason').val(response.sched_purpose);
                $('#daterangetimeUpdate').val(response.sched_startDate + '-' + response.sched_endDate);
                startDateStr = response.sched_startDate;
                endDateStr = response.sched_endDate;
                GetDates(response.sched_ResourcetypeId);

                $('#passengerName').empty();


                 response.passenger_names.forEach((passenger, index) => {
                    $('#passengerName').append(`
                        <tr>
                            <td class="whitespace-nowrap">${index + 1}</td>
                            <td class="whitespace-nowrap">${passenger.fullName}</td>
                            <td class="whitespace-nowrap " style="display: none" >${passenger.sched_AgencyID}</td>
                            <td class="whitespace-nowrap" style="display: none" >${schedID}</td>
                            <td class="whitespace-nowrap text-right">
                                <button class="btn btn-danger btn-sm delete-passenger" data-id="${passenger.sched_AgencyID}">Delete</button>
                            </td>
                        </tr>
                    `);
                });

            // Bind delete button click event
            $('.delete-passenger').on('click', function() {
                const id = $(this).data('id');
                deletePassenger(id,schedID);
            });
        },
        error: function(error) {
            console.error('Error fetching schedule record data:', error);
        }
    });

 }
 function deletePassenger(id,schedID){
    $.ajax({
        url: '/schedule/My-deletePassenger',
        type: 'POST',
        data: {
            _token,
            id: id,
            sched_id: schedID,
        },
        success: function (response) {
            console.log(response);
            refreshTable(scheduleid);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching driver names:', error);
        }
    });

 }
 function getDrivers() {
    $.ajax({
        url: '/schedule/My-getDrivers',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            var select2 = $('#driversName');
            select2.empty();
            $('#driversName').select2({
                placeholder: 'Select Driver',
                allowClear: true,
                minimumResultsForSearch: Infinity,
                tags:false
            });

            $.each(response, function (index, data) {
                // Create a new option element with the category name and data-id attribute
                var option = new Option(data.driver, data.id);
                $(option).attr('data-id', data.id);
                // Append the option to the select element
                select2.append(option);

            });


            $('#driverName_Id').val(driverID);
            $('#driversName').val(driverName);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching driver names:', error);
        }
    });
}



 function makeCellsEditable() {
    $('#schedulelist1 tbody td').attr('contenteditable', 'true');
}

 function approveAction(newStatus) {

    var id = tempId;
    console.log(id);

    $.ajax({
        url: '/schedule/My-update-schedstatus',
        method: 'POST',
        data: {
            _token,
            id: id,
            sched_status: newStatus,
            sched_allowEsig: esig,
        },

        success: function(response) {
            displaySchedule();

            __modal_hide('view_signatories_Schedule');
        },
        error: function(error) {
            console.error('Error updating sched_status:', error);
        }
    });


 }



function displaySchedule() {

    $.ajax({
        url: '/schedule/My-schedTable',
        method: 'POST',
        type: 'POST',
        data: {
            _token,

        },
        dataType: 'json',
        success: function (response) {
            tblschedule_list.clear().draw();

            response.forEach(function (combinedData) {
                // const formattedDateRange = formatDateRange(startDate, endDate);
                var driver = "";
                if (scheduleStatus === 11)
                    {
                        $('#tripticketview').html(combinedData.can_view);
                    }
                    else{
                        $('#tripticketview').html();
                    }

                if(combinedData.sched_driver) {
                    driver = combinedData.sched_driver;
                } else {
                    driver = "";
                }
                if (combinedData.sched_status == 1)
                {

                }
                else
                {
                }
                var maxLength = 40;

                var sched_purpose = truncateText(combinedData.sched_purpose, maxLength);
                var sched_destination = truncateText(combinedData.sched_destination, maxLength);
                var cd = "";
                cd = '' +
                '<tr>'+
                        '<td >'+combinedData.sched_created+'</td>'+
                        '<td >'+combinedData.res_name+' ('+ combinedData.res_serial_plate_no+')</td>'+
                        '<td >'+combinedData.fullname+'</td>'+
                        '<td class="tooltip cursor-pointer" title="'+combinedData.sched_destination+'">'+sched_destination+'</td>'+
                        '<td class="tooltip cursor-pointer" title="'+combinedData.sched_purpose+'">'+sched_purpose+'</td>'+
                        '<td >'+driver+'</td>'+
                        '<td >'+combinedData.sched_startDate+'</td>'+

                        '<td >'+combinedData.sched_endDate+'</td>'+

                        '<td  class="text-'+combinedData.class+'">'+
                        '<div class="flex justify-center items-center" >'+

                        '<a id="actionButton" class="box flex items-center px-3 py-2 rounded-md border border-' + combinedData.class + ' bg-white/10 dark:bg-darkmode-700 font-medium for-action-button beating shadow-md" href="javascript:;" data-tw-toggle="modal" data-tw-target="#view_signatories_Schedule"  onclick="openSignatoriesModal('+ combinedData.id +')"><div class="w-2 h-2 bg-' + combinedData.class + ' rounded-full mr-3"></div> ' + combinedData.status + '</a>'+
                        '</div>'+
                        '</td>' +
                                '<td>' +
                                '<div class="flex justify-center items-center">'+
                                        // combinedData.can_release+
                                    '<div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
                                        '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                        '<div class="dropdown-menu w-40">'+
                                            '<div class="dropdown-content">'+
                                            combinedData.can_view+
                                            combinedData.can_update+
                                            combinedData.can_delete+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</td>' +
                '</tr>'+
                '';
               // rows.push($(cd));
                tblschedule_list.row.add($(cd)).draw();
            });
            generateSchedule();
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
function signatoriesDetails2(scheduleStatus){
    if (!scheduleStatus) {
        console.error('Schedule status is required');
        $('#modal_content_signatories').html('<div class="text-center p-4 text-red-500">Error: Schedule status is required</div>');
        return;
    }

    $.ajax({
        url: '/schedule/My-signatoriesDetails2/'+ scheduleStatus,
        method: 'POST',
        data: {
            _token: _token,
        },
        dataType: 'json',
        beforeSend: function() {
            $('#modal_content_signatories').html('<div class="text-center p-4"><i class="fas fa-spinner fa-spin"></i> Loading signatories...</div>');
        },
        success: function (response) {
            console.log('Received signatories2 response:', response);
            
            if (response.error) {
                console.error('Server error:', response.error);
                $('#modal_content_signatories').html('<div class="text-center p-4 text-red-500">Error: ' + response.error + '</div>');
                return;
            }

            if (!response.html) {
                $('#modal_content_signatories').html('<div class="text-center p-4">No signatories data available</div>');
                return;
            }

            // Update the content with the HTML from the server
            $('#modal_content_signatories').html(response.html);

            // Initialize any necessary event handlers
            initializeSignatoryButtons();
        },
        error: function (xhr, status, error) {
            console.error('Ajax error:', error);
            console.log('Response:', xhr.responseText);
            $('#modal_content_signatories').html(
                '<div class="text-center p-4 text-red-500">' +
                'Failed to load signatories. Please try again.' +
                '</div>'
            );
        }
    });
}
function initializeSignatoryButtons() {
    // Add click handlers for approve/disapprove buttons if needed
    $('[onclick^="approveAction"]').on('click', function(e) {
        e.preventDefault();
        const actionValue = $(this).attr('onclick').match(/\d+/)[0];
        approveAction(parseInt(actionValue));
    });
}
function signatoriesDetails(scheduleId) {
    console.log('Starting signatoriesDetails with ID:', scheduleId);
    var schedRecord_ID = scheduleId;

    $.ajax({
        url: '/schedule/My-signatoriesDetails/'+ schedRecord_ID,
        method: 'POST',
        data: {
            _token: _token,
        },
        dataType: 'json',
        beforeSend: function() {
            console.log('Sending request to get signatories details');
            $('#modal_content_signatories').html('<div class="text-center p-4"><i class="fas fa-spinner fa-spin"></i> Loading signatories...</div>');
        },
        success: function (response) {
            console.log('Received response:', response);

            if (response.error) {
                console.error('Server returned error:', response.error);
                $('#modal_content_signatories').html('<div class="text-center p-4 text-red-500">Error: ' + response.error + '</div>');
                return;
            }

            if (!response || response.length === 0) {
                $('#modal_content_signatories').html('<div class="text-center p-4">No signatories found</div>');
                return;
            }

            console.log('Processing first record:', response[0]);
            const schedRecord = response[0];

            // Update schedule details first
            $('#scheduleDetails').html('<strong>Schedule Details</strong><br>' +
                schedRecord.res_name + ' ' +'('+ schedRecord.res_serial_plate_no +')' + ' for ' +
                schedRecord.sched_purpose + ' in ' + schedRecord.sched_destination);

            $('#dateDetails').html('<strong>Departure:</strong> ' +
                schedRecord.sched_startDate + ' <strong>Return:</strong> ' + schedRecord.sched_endDate);

            $('#PassengerDetails').html('<strong>Passenger/s:</strong> ' + schedRecord.passenger_names);

            if (schedRecord.status == 'Approved') {
                $('#statusDetails').html('<strong>Status:</strong> ' + schedRecord.status +' | '+ schedRecord.can_view);
            }
            else if(schedRecord.status == 'Pending' || schedRecord.status == 'release') {
                $('#statusDetails').html('<strong>Status:</strong> ' + schedRecord.status +' | '+ schedRecord.can_update);
            }
            else {
                $('#statusDetails').html('<strong>Status:</strong> ' + schedRecord.status);
            }

            // Now get signatories details
            console.log('Calling signatoriesDetails2 with status:', schedRecord.sched_status);
            signatoriesDetails2(schedRecord.sched_status);
        },
        error: function(xhr, status, error) {
            console.error('Ajax error:', error);
            console.log('Response:', xhr.responseText);
            $('#modal_content_signatories').html(
                '<div class="text-center p-4 text-red-500">' +
                'Failed to load signatories. Please try again.' +
                '</div>'
            );
        }
    });
}

 function initializeSignatoryButtons() {
    // Add click handlers for approve/disapprove buttons
    $('[id^="signatoryActionbtn"]').off('click').on('click', function(e) {
        e.preventDefault();
        const onclick = $(this).attr('onclick');
        if (onclick) {
            const match = onclick.match(/approveAction\((\d+)\)/);
            if (match) {
                const actionValue = parseInt(match[1]);
                approveAction(actionValue);
            }
        }
    });
}

 function releaseschedule(scheduleid){

        $.ajax({
            url: '/schedule/My-releaseSchedule', // Adjust the URL based on your route
            type: 'POST',
            data: {
                _token: _token,
                scheduleid: scheduleid,
            },
            beforeSend: function() {

                    $('#releasing').html('<div style="text-align: center"><i class="fas fa-spinner fa-spin">Loading</i></div>');

            },
            success: function(response) {

                __modal_hide('ReleaseConfirmationModal');
                displaySchedule();

            },
            error: function(error) {
                console.error('Error releasing schedule:', error);
            }
        });
 }


 function deleteSchedule(scheduleid, callback) {
    $.ajax({
        url: '/schedule/My-deleteSchedule',
        method: 'POST',
        data: {
            _token: _token,
            scheduleid: scheduleid,
        },
        dataType: 'json',
        beforeSend : function(){
            $('#deleting').html('<div style="text-align: center"><i class="fas fa-spinner fa-spin">Loading</i></div>');
        },
        success: function (response) {
            displaySchedule();
            __modal_hide('deleteConfirmationModal');
            fullcalendarEvent();

        },
        error: function (xhr, status, error) {

        }
    });
}






function attachEditButtonClickHandler(scheduleId) {


        $.ajax({
            url: '/schedule/My-getscheduledetails/' + scheduleId,
            method: 'GET',
            dataType: 'json',
            success: function (schedule) {
                // Populate your modal fields with the fetched schedule data

                if(schedule.sched_typeID == 0)
                {
                    var schedType = schedule.sched_type;
                    var vehicleTypeSelect = document.getElementById('vehicle_type_sched');
                    var schedTypeId = schedType.sched_typeID;
                    var schedTypeIdSelct = document.getElementById('selectItem');

                    if (schedTypeId = 0)
                    {
                        schedTypeIdSelct.value = 'Vehicle';
                        schedTypeIdSelct.value.selected = true;
                    }
                    else
                    {
                        schedTypeIdSelct.value = 'Resource';
                        schedTypeIdSelct.value.selected = true;
                    }


                    for (var i = 0; i < vehicleTypeSelect.options.length; i++) {
                        if (vehicleTypeSelect.options[i].value === schedType) {
                            vehicleTypeSelect.options[i].selected = true;

                            break; // Stop the loop since we found the matching option
                        }


                          $('#model').val(schedule.sched_name);

                          $('#passengercount').val(schedule.sched_capacity);
                          $('#sched_destination').val(schedule.sched_destination);
                          //$('#vehicle_type_sched').val(schedule.sched_type);
                          $('#vehicle_reason').val(schedule.sched_purpose);
                          $('#start_Date_sched').val(schedule.sched_startDate);
                          $('#end_Date_sched').val(schedule.sched_endDate);
                    }

                    // Add more fields as needed
                }
                else
                {
                    $('#selectItem').val(schedule.sched_typeID);
                  //  $('#schedule_id').val(schedule.id);
                    $('#res_type_sched').val(schedule.sched_type);
                    $('#resource_name').val(schedule.sched_name);
                    $('#rstart_Date_sched').val(schedule.sched_startDate);
                    $('#rend_Date_sched').val(schedule.sched_endDate);
                    $('#resource_reasons').val(schedule.sched_purpose);
                }

                $('#add_schedule_modal').modal('show');
            },
            error: function (error) {
                console.error('Error fetching schedule details:', error);
            }
        });

}
// Function to generate buttons based on schedule status


function load_table()
{
    try{
		/***/
		tblschedule_list = $('#schedulelist1').DataTable({
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

            columnDefs:
                [
                    { className: "dt-head-center", targets: [6] },
                ],
                order: [[0, 'desc']],
		});
	}catch(err){
        console.log(err);
    }
}
function openSignatoriesModal(id) {
    // Pass the scheduleId to your modal initialization logic
    // Example: You might use an AJAX call to fetch data and populate the modal
    var scheduleId = id;
    signatoriesDetails(scheduleId);
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
function displayRecent() {
    var tbody = $('#schedulelist1 tbody');
    $.ajax({
        url: '/schedule/My-schedTable',
        method: 'POST',
        type: "POST",
        data: {
            _token,
        },
        dataType: 'json',
        success: function (response) {
            var tbody = $('#schedulelist1 tbody');
            var eventElements = []; // Initialize an array to store event elements

            response.forEach(function (combinedData) {
                var eventElement = generateEventElement(combinedData);
                eventElements.push(eventElement); // Store the event element in the array
            });

            // Display up to the first 10 event elements
            var eventCount = 0;
            eventElements.some(function (eventElement) {
                $('#calendar-events').append(eventElement);
                eventCount++;
                return eventCount >= 12;
            });
        },
        error: function (error) {
            console.error('Error fetching schedule data:', error);
        }
    });
}

function generateEventElement(combinedData) {
    var eventElement = $('<div>', {
        class: 'event p-3 -mx-3 cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md flex items-center',
    });

    var statusDot = $('<div>', {
        class: 'w-2 h-2 ' + getBgColorClass(combinedData.sched_status) + ' rounded-full mr-3',
    });
    eventElement.append(statusDot);

    var eventDetails = $('<div>', {
        class: 'pr-10',
    });
    var eventName = $('<div>', {
        class: 'event__title truncate',
        text: combinedData.res_name + " ("+  combinedData.res_serial_plate_no + ")",
    });
    var eventPurpose = $('<div>', {
        class: 'text-slate-500 text-xs mt-0.5',
        text: combinedData.sched_purpose,
    });
    eventDetails.append(eventName, eventPurpose);
    eventElement.append(eventDetails);

    var startDate = combinedData.sched_startDate.split(' ')[0]; // Extract date portion
    var endDate = combinedData.sched_endDate.split(' ')[0];

    var eventDays = $('<div>', {
        class: 'text-slate-500 text-xs mt-0.5',
        html: '<span class="event__days">' + startDate + '</span>  <span class="mx-1">•</span> ' + endDate,
    });
    eventDetails.append(eventDays);

    var editIcon = $('<a>', {
        class: 'flex items-center absolute top-0 bottom-0 my-auto right-0',
        href: '',
    });
    var editIconImage = $('<i>', {
        class: 'w-4 h-4 text-slate-500',
        'data-lucide': 'edit',
    });
    editIcon.append(editIconImage);
    eventElement.append(editIcon);

    return eventElement;
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
function getBgColorClass(status) {
    if (status === 'Approved') {
        return 'bg-success';
    } else if (status === 'Disapproved') {
        return 'bg-warning';
    }
    return 'bg-pending';
}

 function select2_Instance(id, placeholder, data) {
    $(id).select2({
        placeholder: placeholder,
        allowClear: true,
        data: data
    });
}
function getEmployee() {
    searchEmployee.select2({
        placeholder: "Search employee",
        allowClear: true,
        multiple: false,
        closeOnSelect: false,
        minimumInputLength: 2,
        width: "100%",
        ajax: {
            url: '/schedule/My-getEmployee',
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
                return {
                    results: $.map(data.agencyEmployees, function (employee) {
                        return {
                            text: employee.firstname + ' ' + employee.lastname,
                            id: employee.id,
                            agencyid: employee.agencyid
                        };
                    }),
                };
            },
        },
    });

    $('#searchEmployee').on('select2:select', function (e) {


        const agencyid = e.params.data.agencyid;
        $('#searchEmployee_Id').val(agencyid);
        searchEmployee_Id = agencyid;

    });
}

function __modal_toggle(modal_id){
    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#'+modal_id));
    mdl.toggle();
}
function __modal_hide(modal_id){
    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#'+modal_id));
    mdl.hide();

}

