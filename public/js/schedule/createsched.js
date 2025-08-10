var _token = $('meta[name="csrf-token"]').attr('content');
const resourceContainer = $('#resourceContainer');
const resourceInfo = [];
const passengerSelect = $('#passengerName');
const rc_office = $('#rc_office');
const rc_officeCharge = $('#rc_officeCharge');
const selectDestination = $('#sched_destination');
const selectSignatories = $('#selectSignatories');

var inchargeResourceID;
var currentUser;
var ResourceId;
var ResquesterId;
var resourceName;
var resourceId;
var serialPlate;
var startDates;
var endDates;
var inCharge;
var destination;
var driverName;
var driverID;
var reason;
var startDateStr;
var endDateStr;
var startDateFormat;
var endDateFormat;
var conflictTrue = 0;
var check = 0;
var NotAvailableDates = [];
var selectedPassengers = [];
var isProcessing = true;
var rc_id;
var charge_id;
var rc_name;
var isRangeValid = true;

$(document).ready(function() {

    var selectedValue = '0';
    var categoryID = 0;
    const categoryContainer = $('#categoryContainer');

    fetchAndDisplayCategories();
    fetchAndDisplayResources(categoryID);
    passengersSelect();
    getDrivers();
    getCurrentUser();
    getRC();
    getChargeAccount();


    $('#daterangetime').daterangepicker({

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



    $('#daterangetime').on('apply.daterangepicker', function(ev, picker) {
          startDateStr = picker.startDate.format('YYYY-MM-DD hh:mm A')
          endDateStr =  picker.endDate.format('YYYY-MM-DD hh:mm A')

    });

    $('#rc_office').on('change', function() {
         rc_id = $(this).val();

    });
    $('#rc_officeCharge').on('change', function() {
        charge_id = $(this).val();

   });
    $('#driversName').on('change', function() {
        driverID = $(this).val();
        driverName = $('#driversName option:selected').text();
   });


    $('#addschedule').on('click', function () {
        var htmlContent = $('#sched_reason').val();
        var htmlDestination = $('#locationSchedule').val();

        // Function to convert HTML to plain text
        function convertToPlainText(html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            return doc.body.textContent || "";
        }

        resourceName = $('#Resource_Name').val();
        resourceId = $('#resourceID').val();
        serialPlate = $('#Serial_Plate').val();
        destination = convertToPlainText(htmlDestination);
        reason = convertToPlainText(htmlContent);

        // Get the selected resource's index
        var selectedResourceIndex = resourceContainer.find('.intro-y.block').index($('.intro-y.block.selected'));
        var selectedResource = resourceInfo[selectedResourceIndex];
        var resourceCategoryId = selectedResource ? selectedResource.resCategoryID : null;

        // Check required fields based on category
        if (!startDateStr || !endDateStr || !reason) {
            __notif_show(-1, 'WARNING', 'Please fill in all required fields. Thank you');
            return;
        }

        // Only check these fields if not Facilities (categoryId !== 3)
        if (resourceCategoryId !== 3) {
            if (!destination || !serialPlate) {
                __notif_show(-1, 'WARNING', 'Please fill in all required fields. Thank you');
                return;
            }
        }

        finalCheckerConflict(startDateStr, endDateStr, resourceId);
    });

        $('#confirmationbtn').click(function () { clearItems() });
        $('#btnclear').click(function () { clearItems(); });
        $('#addCancelSchedule').click(function () { clearForm();   });

        $('#cancel_Modal').click(function() {
            resetSelectFields();
        });



        categoryContainer.on('click', '.category-item', function () {
            const categoryID = $(this).data('category-id'); // Assuming you have a data attribute for category ID
            fetchAndDisplayResources(categoryID);

        });
        $('.box a').each(function() {
            var hasData = $(this).find('.font-medium').text().trim().length > 0;
            if (!hasData) {
                $(this).addClass('disabled');
                $(this).removeAttr('data-tw-toggle');
                $(this).removeAttr('data-tw-target');
                // $(this).css('cursor', 'not-allowed');
            }
        });
        $('.box a').each(function() {
            var hasData = $(this).find('.font-medium').text().trim().length > 0;
            if (!hasData) {
                $(this).addClass('disabled');
                $(this).removeAttr('data-tw-toggle');
                $(this).removeAttr('data-tw-target');
                // $(this).css('cursor', 'not-allowed');
            }
        });


        resourceContainer.on('click', '.intro-y.block', function () {
            // Remove selected class from all resources
            resourceContainer.find('.intro-y.block').removeClass('selected');
            // Add selected class to clicked resource
            $(this).addClass('selected');

            var selectedResourceIndex = $(this).index();
            var selectedResource = resourceInfo[selectedResourceIndex];
            clearItems();
            clearForm();

            if (selectedResource) {
                ResourceId = selectedResource.resId;
                inchargeResourceID = selectedResource.InchargeId;

                // Get the resource category ID
                var resourceCategoryId = selectedResource.resCategoryID;

                // Show/hide fields based on category
                if (resourceCategoryId === 3) { // If it's a facility
                    // Hide specific fields
                    $('#Serial_Plate').closest('.col-span-12').hide();
                    $('#rc_officeCharge').closest('.col-span-12').hide();
                    $('#driversName').closest('.col-span-12').hide();
                    $('#locationSchedule').closest('.col-span-12').hide();

                    // Clear the values when hiding
                    $('#Serial_Plate').val('');
                    $('#rc_officeCharge').val('').trigger('change');
                    $('#driversName').val('').trigger('change');
                    $('#locationSchedule').val('');
                } else {
                    // Show all fields
                    $('#Serial_Plate').closest('.col-span-12').show();
                    $('#rc_officeCharge').closest('.col-span-12').show();
                    $('#driversName').closest('.col-span-12').show();
                    $('#locationSchedule').closest('.col-span-12').show();
                }

                $('#resourceID').val(selectedResource.resId);
                $('#Resource_Name').val(selectedResource.resName);
                $('#Serial_Plate').val(selectedResource.resSerialPlateNo);
                $('#InchargeResource').val(selectedResource.resIncharge);
                $('#inchargeId').val(selectedResource.InchargeId);
                $('#requesterId').val(currentUser);
                $('#requestedBy').val(currentUser);

                // Store values for later use
                resourceName = selectedResource.resName;
                resourceId = selectedResource.resId;
                serialPlate = selectedResource.resSerialPlateNo;
                inCharge = selectedResource.resIncharge;
            }
        });
        resourceContainer.on('mouseenter', '.intro-y.block', function () {
            var selectedResourceIndex = $(this).index();
            var selectedResource = resourceInfo[selectedResourceIndex];

            if (selectedResource) {
                // Create a div for the tooltip
                var tooltip = $('<div class="tooltip"></div>');


                    var startDate = formatDate(selectedResource.resSchedStart);
                    var endDate = formatDate(selectedResource.resSchedEnd);

                    if(startDate === 'Invalid Date' && endDate  === 'Invalid Date')
                    {
                        tooltip.text('No scheduled dates');
                    }

                     else {
                        tooltip.text('Date/s Not Available: ' + startDate + ' to ' + endDate);
                         }
                // Get the position and dimensions of the hovered resource
                var position = $(this).position();
                var width = $(this).outerWidth();
                var height = $(this).outerHeight();

                // Set the position of the tooltip to the right of the hovered resource
                tooltip.css({
                    top: position.top + height / 2 - tooltip.outerHeight() / 2,
                    left: position.left + width,
                });

                // Append the tooltip to the body
                $('body').append(tooltip);

                // Optionally, you can add styling to the tooltip
                tooltip.css({
                    position: 'absolute',
                    background: '#fff',
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    zIndex: 9999, // Ensure it appears above other elements
                });
            }
        });


        resourceContainer.on('mouseleave', '.intro-y.block', function () {
            $('.tooltip').remove();
        });
});


function disableButtons() {
    $('#btnclear, #btnconfirm').prop('disabled', true);
    $('#Editbtn, #btnconfirm').prop('disabled', true);
    $('#btnconfirm, #btnconfirm').prop('disabled', true);

}
function enableButtons() {
    $('#btnclear, #btnconfirm').prop('disabled', false);
    $('#Editbtn, #btnconfirm').prop('disabled', false);
    $('#btnconfirm, #btnconfirm').prop('disabled', false);

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
                tags: true
            });


            response.forEach(function(driver) {

                var option = $('<option>').text(driver.driver).attr('value', driver.id);

                select2.append(option);
            });


            $('#driversName').trigger('change');

        },
        error: function (xhr, status, error) {
            console.error('Error fetching driver names:', error);
        }
    });
}

function getRC() {
    rc_office.select2({
        placeholder: "Search office",
        allowClear: true,
        multiple: false,
        closeOnSelect: false,
        //minimumInputLength: 2,
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
        const officeId = e.params.data.id;
        const officeName = e.params.data.text;
        $('#officeId').val('officeId');
        $('#rc_office').val('officeName');
    });

    // Handle deselection changes
    rc_office.on('select2:unselect', function (e) {
        const officeId = e.params.data.id;
        const officeName = e.params.data.text;
   });

}
function getChargeAccount() {
    rc_officeCharge.select2({
        placeholder: "Search Account",
        allowClear: true,
        multiple: false,
        closeOnSelect: false,
        //minimumInputLength: 2,
        width: "100%",
        ajax: {
            url: '/schedule/My-getChargeAccount',
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

   rc_officeCharge.on('select2:select', function (e) {
    const officeId = e.params.data.id;
    const officeName = e.params.data.text;
    $('#officeIdCharge').val(officeId);
    $('#rc_officeCharge').val(officeName);
});
    rc_officeCharge.on('select2:unselect', function (e) {
        const officeId = e.params.data.id;
        const officeName = e.params.data.text;
    });
}
function GetDates(resourceId) {
    // $('#spinner-overlay').show();
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


function finalCheckerConflict(startDateStr, endDateStr, resourceId) {

    var chargeID = $('#officeIdCharge').val();
    $('#spinner').show();
    $.ajax({
        url: '/schedule/My-finalCheckerConflict',
        method: 'POST',
        data: {
            _token,
            resourceId: resourceId,
            startDateTime: startDateStr,
            endDateTime: endDateStr,
        },
        dataType: 'json',
        beforeSend: function(response){
            $('#spinner').show();
        },
        success: function (response) {

            if(!response)
            {

                $('#spinner').hide();

                storeSchedule();

            }
            else{

                $('#spinner').hide();
                __notif_show(-1, 'Error', 'There was a problem processing your request, Please refresh the page and try again.');
                $('#daterangetime').val('Conflict Dates, Choose other dates');
                $('#daterangetime').css({
                    'border-color': 'red',
                    'color': 'red'
                });
            }


        },
        error: function (error) {
            $('#spinner').hide();
            __notif_show(-1, 'Error', 'There was a problem processing your request, Please refresh the page and try again.');
        },
    });
}


function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString(); // You can customize the date formatting here
}


function storeSchedule() {

        var timestamp = Date.now();
        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var reasons = reason;
        var destinations = destination;
        var requestid = $('#resourceID').val();
        var chargeID = $('#officeIdCharge').val();
        var passengersID = currentYear.toString() + timestamp.toString();

        reasons = String(reasons);
        destinations = String(destinations);
        var data = {
            sched_ResourcetypeId: requestid, // Corrected key name
            sched_RequesterId: ResquesterId,
            sched_passId: passengersID,
            sched_office_id: rc_id,
            sched_chargedTo: chargeID,
            sched_InchargeId:  inchargeResourceID,
            sched_destination: destinations,
            sched_allowEsig: 1,
            sched_purpose: reasons,
            sched_driver: driverID,
            sched_status: 1,
            active: '1',
            sched_startDate: startDateStr,
            sched_endDate: endDateStr,
            selectedPassengers: selectedPassengers,
            _token: $('meta[name="csrf-token"]').attr('content'), // Include the CSRF token
        };

        $.ajax({
            url: '/schedule/My-schedstore',
            method: 'POST',
            data: data,
            dataType: 'json',
            beforeSend: function(xhr) {
                $('#loading-spinner').html('<i class="fas fa-spinner fa-spin"></i> Loading...');

            },
            success: function (response) {

                $('#loading-spinner').empty();


                __notif_show(1, 'SUCCESS', 'Schedule Request Saved, You can monitor your request in the my schedule page.');
                __modal_hide('add-sched-modal');

            },
            error: function (error) {
                $('#loading-spinner').empty();
                __notif_show(-1, 'ERROR', 'There was a problem processing your request, please try again.');

            },
        });
    }
    function populateDivWithPassengers(passengers) {
        // Example: Populate a div with the selected passenger names



        const div = $('#passenger-list'); // Replace 'passenger-div' with your actual div ID
        div.empty();
        passengers.forEach((passenger) => {
            div.append('<div class="ml-auto font-medium">' + passenger.name + '</div>');
        });
    }

    function saveSelectedAgencies(passengersID) {
        // Check if there are selected passengers
        if (selectedPassengers.length > 0) {
            // Send the selected agency IDs and passengersID to the server for storage
            $.ajax({
                url: '/schedule/saveSelectedAgencies',
                method: 'POST',
                data: { selectedPassengers: selectedPassengers, passengersID: passengersID },
                dataType: 'json',
                success: function (response) {
                    // Handle success response, if needed

                },
                error: function (error) {

                },
            });
        }
    }
function clearForm() {
    $('#start_Date_sched').val(''); // Clear the Resource Name
    $('#locationSchedule').val(''); // Clear the Plate Number
    $('#end_Date_sched').val('');
    $('#destination_').val('');  // Clear the Requested By
    $('#sched_reason').val(''); // Clear the Vehicle In-Charge
    $('#start_Date_sched').css('border-color', '');
    $('#end_Date_sched').css('border-color', '');
    $('#start_Date_sched').removeClass('text-danger');
    $('#end_Date_sched').removeClass('text-danger');
    $('#start_Date_sched').removeClass('text-success');
    $('#end_Date_sched').removeClass('text-success');
   // $('#passenger-list').text('');
   $('#driversName').val(null).trigger('change.select2');
   $('#rc_office').val(null).trigger('change.select2');
    $('#passengerName').val(null).trigger('change.select2');
    ResourceId = ''; // Clear the Passenger List
    inchargeResourceID = '';
    passengerName
}
function clearItems() {
    $('#resource-name-section').text(''); // Clear the Resource Name
    $('#plate-number-section').text(''); // Clear the Plate Number
    $('#schedule-reason').text(''); // Clear the Reason
    $('#requestedBy').text('');
    $('#destination_').text('');  // Clear the Requested By
    $('#in-charge-section').text(''); // Clear the Vehicle In-Charge
    $('#start-date-section').text(''); // Clear the Start Date
    $('#end-date-section').text(''); // Clear the End Date
    $('#start_Date_sched').css('border-color', '');
    $('#end_Date_sched').css('border-color', '');
    $('#start_Date_sched').removeClass('text-danger');
    $('#end_Date_sched').removeClass('text-danger');
    $('#start_Date_sched').removeClass('text-success');
    $('#end_Date_sched').removeClass('text-success');
    $('#passenger-list').text('');
    $('#rc_office').text('');
    $('#driver_name').text(''); // Clear the
    ResourceId = ''; // Clear the Passenger List
    inchargeResourceID = '';
    resourceName = '';
    serialPlate = '';
    startDate ='';
    endDate = '';
    inCharge = '';
    destination = '';
    reason = '';
    driverName = "";
    driverID = "";

}

function clearSelectedPassengers() {
    selectedPassengers.splice(0, selectedPassengers.length);
}
function passengersSelect() {
    passengerSelect.select2({
        placeholder: "Search employee",
        allowClear: true,
        multiple: true,
        closeOnSelect: false,
        //minimumInputLength: 2,
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

    // Handle selection changes
    passengerSelect.on('select2:select', function (e) {
        const agencyId = e.params.data.agencyid;
        const passengerName = e.params.data.text;

        // Store the selected passenger's name and agency ID in the array
        selectedPassengers.push({ name: passengerName, agencyid: agencyId });
    });

    // Handle deselection changes
    passengerSelect.on('select2:unselect', function (e) {
        const agencyId = e.params.data.agencyid;
        const passengerName = e.params.data.text;

        // Remove the deselected passenger from the array
        selectedPassengers = selectedPassengers.filter(passenger => passenger.name !== passengerName || passenger.agencyid !== agencyId);
    });
}





function SearchSignatureEmployee() {

    selectSignatories.select2({
        placeholder: 'select employee',
        allowClear: true,
        multiple: true,
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
                            id: employee.id, // Use a unique identifier (e.g., employee ID) as the id
                            agencyid: employee.agencyid // Store the agency_id as a custom attribute

                        };

                    }),

                };

            },

        },

    });

    $('#person_incharge').on('select2:select', function (e) {
        // Get the agency_id from the custom attribute

        var agencyid = e.params.data.agencyid;
        $('#agency_id').val(agencyid);


    });
}

function fetchAndDisplayCategories() {
    const categoryContainer = $('#categoryContainer');
    let selectedCategory = null;

    // Make an AJAX request to fetch category data from the server
    $.ajax({
        url: '/schedule/My-getCategories', // Replace with the actual endpoint URL
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            // Iterate through the response and create selectable items
            response.forEach(function (category) {
                // Generate a unique ID for each category item
                const itemId = `categoryItem_${category.id}`;

                const item = `
                <div id="${itemId}" class="col-span-12 sm:col-span-4 2xl:col-span-3 box p-5 cursor-pointer zoom-in category-item" data-category-id="${category.id}">
                    <div class="font-medium text-base">${category.category_Name}</div>
                </div>
            `;

                const categoryItem = $(item); // Convert the item string to a jQuery object

                categoryItem.click(function () {
                    if (selectedCategory) {
                        // Revert the previously selected item's background color
                        selectedCategory.css('background-color', '');
                        // Revert the previously selected item's text color
                        selectedCategory.find('.font-medium').css('color', 'black');
                    }

                    // Set background color to blue and text color to white for the clicked item
                    categoryItem.css('background-color', 'blue');
                    categoryItem.find('.font-medium').css('color', 'white');
                    selectedCategory = categoryItem;
                });

                categoryContainer.append(categoryItem);
            });
        },
        error: function (error) {
            console.error('Error fetching category data:', error);
        },
    });
}

// This function fetches and displays resources based on the selected category
function fetchAndDisplayResources(categoryID) {

    // Make an AJAX request to fetch resources based on the selected category
    $.ajax({
        url: `/schedule/My-getCategoriesAll/${categoryID}`, // Replace with the actual endpoint URL
        method: 'POST',
        data: {
            _token: _token,
        },
        dataType: 'json',
        beforeSend: function() {
            // resourceContainer
            $('#resourceContainer').html('<div id="loadingSpinner" style="display: none; text-align: center; font-size: 24px;"><i class="fas fa-spinner fa-spin"></i> Loading </div>');

        },
        success: function (response) {
            resourceContainer.empty(); // Clear existing resources

            resourceInfo.length = 0;
            // Iterate through the response and create resource items
            response.forEach(function (resource) {

                const resId = resource.id;
                const resName = resource.res_name;
                const resSerialPlateNo = resource.res_serial_plate_no;
                const resIncharge = resource.res_incharge;
                const InchargeId = resource.res_inchargeId;
                const resCategoryid = resource.res_categoryID;
                const startDate = resource.scheduledStartDate;
                const endDate = resource.scheduledEndDate;


                resourceInfo.push({
                    resId: resId,
                    resName: resName,
                    resSerialPlateNo: resSerialPlateNo,
                    resIncharge: resIncharge,
                    InchargeId: InchargeId,
                    resCategoryID: resCategoryid,
                    resSchedStart: startDate,
                    resSchedEnd: endDate,
                    category: resource.category_name
                });
                const item = `
                <a href="javascript:;" data-tw-toggle="modal" data-tw-target="#add-sched-modal" class="intro-y block col-span-12 sm:col-span-4 2xl:col-span-3  id="selectedResourceButton"">
                    <div class="box rounded-md p-3 relative zoom-in">
                        <div class="flex-none relative block before:block before:w-full before:pt-[100%]">
                            <div class="absolute top-0 left-0 w-full h-full image-fit">

                            <div class="block font-medium text-center truncate mt-3" style="display: none" id="resourceID">${resource.id}</div>
                                <img alt="${resource.res_name}" class="rounded-md" src="${resource.res_photo}">
                            </div>
                        </div>
                        <div class="block font-medium text-center truncate mt-3">${resource.res_name}</div>
                        <div class="text-slate-500 text-center">${resource.res_serial_plate_no}</div>
                    </div>
                </a>
            `;

            resourceContainer.append(item);
        });

        },
        error: function (error) {
            console.error('Error fetching resource data:', error);
        },
    });
}

// Add an event listener to the category items
function getCurrentUser() {
    $.ajax({
        url: '/schedule/My-getfullname', // URL defined in your route
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            // Check if response contains fullname and employeeId
            if (response.fullname && response.employeeId) {

                currentUser = response.fullname;
                ResquesterId = response.employeeId;

            }
        },
        error: function (xhr, status, error) {
            console.error('Error fetching user data:', error);
        }
    });
}

function __modal_toggle(modal_id){

            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#'+modal_id));
            mdl.toggle();
            __modal_toggle.reset();

            // Check if the modal is being shown


        }

function __modal_hide(modal_id){

            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#'+modal_id));
            mdl.hide();
            selectedValue = "";
        }






