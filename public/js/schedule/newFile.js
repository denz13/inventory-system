$(document).ready(function () {

    var selectedValue = '0';
    var categoryID = 0;
    const categoryContainer = $('#categoryContainer');

    fetchAndDisplayCategories();
    fetchAndDisplayResources(categoryID);
    passengersSelect();

    const currentDate = new Date().toISOString().slice(0, 16);
    // Set the minimum value for the input to the current date
    document.getElementById('start_Date_sched').min = currentDate;
    // Set the minimum value for the input to the current date
    document.getElementById('end_Date_sched').min = currentDate;
    $('#addschedule').prop('disabled', true);
    $('#start-conflict-indicator').text('').css('color', 'red');
    $('#end-conflict-indicator').text('').css('color', 'red');

    $('#addschedule').on('click', function () {
        check = 1;

        // Capture data from the input fields in the modal
        resourceName = $('#Resource_Name').val();
        resourceId = $('#resourceID').val();
        serialPlate = $('#Serial_Plate').val();
        destination = $('#locationSchedule').val();
        reason = $('#sched_reason').val();
        startDateStr = $('#start_Date_sched').val();
        endDateStr = $('#end_Date_sched').val();

        // Conflict verification
        if (conflictTrue === 0) {
            getCurrentUser();
            inchargeResourceID = $('#inchargeId').val();
            inCharge = $('#InchargeResource').val();
            check = 0;
        }

        function formatDate(dateString) {
            // Convert the date string to a JavaScript Date object
            var date = new Date(dateString);

            // Format the date part as 'MM-DD-YYYY'
            var datePart = (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
                date.getDate().toString().padStart(2, '0') + '/' +
                date.getFullYear();

            // Format the time part as 'hh:mm AM/PM'
            var hours = (date.getHours() % 12 || 12).toString().padStart(2, '0');
            var minutes = date.getMinutes().toString().padStart(2, '0');
            var amPm = date.getHours() < 12 ? 'AM' : 'PM';
            var timePart = hours + ':' + minutes + '' + amPm;

            return datePart + ' ' + timePart;
        }

        // Check if required fields are filled
        if (!resourceName || !startDateStr || !endDateStr || !destination || !reason) {
            // Handle the case when required fields are missing
            alert("Please fill in all required fields. Thank you");

            return; // Prevent form submission
        }

        var formattedStartDate = formatDate(startDateStr);
        var formattedEndDate = formatDate(endDateStr);

        // Update the DOM elements
        $('#resource-name-section').html(resourceName);
        $('#plate-number-section').html(serialPlate);
        $('#start-date-section').html(formattedStartDate);
        $('#end-date-section').html(formattedEndDate);
        $('#in-charge-section').html(inCharge);
        $('#destination_').html(destination);
        $('#schedule-reason').html(reason);
        $('#add-sched-modal').modal('hide');
        populateDivWithPassengers(selectedPassengers);
        __modal_hide('add-sched-modal');
    });

    // $('#start_Date_sched, #end_Date_sched').on('change', function () {
    // });
    $('#confirmationbtn').click(function () { clearItems(); });
    $('#btnclear').click(function () { clearItems(); });
    $('#addCancelSchedule').click(function () { clearForm(); });



    $('#createScheduleButton').click(function () {
        // Make an AJAX request to your controller function
        $.ajax({
            url: '/schedule/My-getfullname', // Replace with the actual route to your controller function
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                // Handle the response and populate the input field
                $('#sched_userName').val(response);
            },
            error: function (xhr, status, error) {
                // Handle any errors if the request fails
                console.error(error);
            }
        });
    });

    $('#cancel_Modal').click(function () {

        // Get the selected date from the input field
        resetSelectFields();
    });




    //store scheduled
    $('#add_schedule_form').submit(function (event) {
        event.preventDefault();
        if (selectedValue === '1') {

            var formData = {
                '_token': $('meta[name="csrf-token"]').attr('content'),
                'selecttypeID': selectedValue,
                'res_type_sched': $('#res_type_sched').val(),
                'sched_destination': $('#sched_destination').val(),
                'resource_name': $('#resource_name').val(),
                'start_Date_sched': $('#rstart_Date_sched').val(),
                'end_Date_sched': $('#rend_Date_sched').val(),
                'participants': $('#participants').val(),
                'resource_reasons': $('#resource_reasons').val()
                // Include other fields here...
            };
        } else {
            var formData = {
                '_token': $('meta[name="csrf-token"]').attr('content'),
                'selecttypeID': selectedValue,
                'sched_destination': $('#sched_destination').val(),
                'vehicle_type_sched': $('#vehicle_type_sched').val(),
                'model': $('#model').val(),
                'start_Date_sched': $('#start_Date_sched').val(),
                'end_Date_sched': $('#end_Date_sched').val(),
                'passengercount': $('#passengercount').val(),
                'vehicle_reason': $('#vehicle_reason').val()
                // Include other fields here...
            };
        }


        // console.log(formData);
        $.ajax({
            url: '/schedule/My-schedstore', // Use the named route
            method: 'POST',
            data: formData,
            dataType: 'json',
            success: function (response) {
                // Handle success response
                $('#successMessage').html('Schedule submitted successfully!').show();

                // You can redirect or perform other actions here
                $('#yourModalId').on('hidden.bs.modal', function () {
                    // Reset the form fields to their initial state
                    $('#add_schedule_form')[0].reset();
                });
                setTimeout(function () {
                    $('#add_schedule_modal').modal('hide');
                    // __modal_hide('add_schedule_modal');
                }, 1000);
                resetSelectFields();
            },
            error: function (xhr, status, error) {
                // Handle error response
                console.error(error);

                // You can display an error message or perform other actions here
            }
        });

    });

    categoryContainer.on('click', '.category-item', function () {
        const categoryID = $(this).data('category-id'); // Assuming you have a data attribute for category ID
        fetchAndDisplayResources(categoryID);

    });
    $('#btnconfirm').on('click', function () {

        var destination1 = destination;

        // Check if any of the fields are empty or null
        if (startDateStr &&
            endDateStr &&
            destination1 &&
            reason) {

            storeSchedule();

            __modal_toggle('success-modal-preview');
        } else {
            console.log(startDates + ' ' + endDates + ' ' + destination1 + ' ' + reason);
            __modal_toggle('failure-modal-preview');
        }
    });

    resourceContainer.on('click', '.intro-y.block', function () {
        var selectedResourceIndex = $(this).index(); // Get the index of the clicked resource
        var selectedResource = resourceInfo[selectedResourceIndex]; // Get the corresponding resource from the array
        clearItems();
        clearForm();
        if (selectedResource) {

            ResourceId = selectedResource.resId;
            inchargeResourceID = selectedResource.InchargeId;


            $('#resourceID').val(selectedResource.resId);
            $('#Resource_Name').val(selectedResource.resName);
            $('#Serial_Plate').val(selectedResource.resSerialPlateNo);
            $('#InchargeResource').val(selectedResource.resIncharge);
            $('#inchargeId').val(inchargeResourceID);

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

            if (startDate === 'Invalid Date' && endDate === 'Invalid Date') {
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

    // Remove the tooltip on mouseleave
    resourceContainer.on('mouseleave', '.intro-y.block', function () {
        $('.tooltip').remove();
    });

});
