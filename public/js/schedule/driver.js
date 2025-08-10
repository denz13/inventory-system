var token = $('meta[name="csrf-token"]').attr('content');
var driverId = '';
let timer; // Variable to hold the timer
let scannerType = ''; // Variable to track the scanning method ('key' or 'qr')
$(document).ready(function () {
    $('#search-scanner-input').focus();

    $('#buttonSeeAll').click(function() {
        // Get the driver ID from data attribute
        driverId = $(this).data('driver-id');



    });
    $('#scannerQr').click(function() {
        // Get the driver ID from data attribute
        $('#search-scanner-input').val('');
        $('#search-scanner-input').prop('disabled', false);
        $('#search-scanner-input').focus();

    });
    $('#clearQrcode').click(function() {
        // Get the driver ID from data attribute
        $('#search-scanner-input').val('');
        $('#search-scanner-input').prop('disabled', false);
        $('#search-scanner-input').focus();


    });
    $('#allSchedCloseBtn').click(function() {
        // Get the driver ID from data attribute
        $('#driverschedules').empty();


    });

    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('searchInput');
        const contentContainer = document.getElementById('generatedContent');

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            const driverItems = contentContainer.querySelectorAll('.driver-item');

            driverItems.forEach(item => {
                const driverName = item.getAttribute('data-driver-name');
                if (driverName.includes(query)) {
                    item.style.display = '';

                } else {
                    item.style.display = 'none';

                }
            });
        });
    });

    $('#search-scanner-input').on('input', function() {
        // Set scanner type to 'key' when input changes
        // scannerType = 'key';

        // Clear previous timer to avoid multiple fetches
        clearTimeout(timer);

        // Get the input value
        const tripTicketCode = $(this).val();

        // Set a timer to delay fetching the locator slip
        timer = setTimeout(function() {
            console.log(tripTicketCode);
            fetchtripTicketpScanned(tripTicketCode);
            $('#search-scanner-input').prop('disabled', true);
        }, 1000); // Adjust delay time as needed (e.g., 1000ms = 1 second)

        // Update message for key change scanner
        $('.message-scanner').html('<i class="fas fa-spinner fa-spin"></i> Scanning...');

    });
});

function fetchtripTicketpScanned(tripTicketCode) {
    $.ajax({
        url: '/schedule/camera-scanner/' + tripTicketCode,
        type: 'GET',
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content') // Include CSRF token in headers
        },
        beforeSend: function() {
            // Show loading indicator or reset previous status based on scannerType
            if (scannerType === 'key') {
                $('.message-scanner').html('<i class="fas fa-spinner fa-spin"></i> Scanning...');
            } else if (scannerType === 'qr') {
                $('.message-scanner-qr').html(
                    '<i class="fas fa-spinner fa-spin"></i> Scanning QR code...');
            }
        },
        success: function(response) {
            if (response.message) {

                if (scannerType === 'key') {
                    $('.message-scanner').text(response.message);
                } else if (scannerType === 'qr') {
                    $('.message-scanner-qr').text(response.message);
                }

            } else {



                $('#statusIcon').show(); // Show the success icon
                $('#errorIcon').hide();  // Hide the error icon

                // Optionally, clear any status message
                $('#statusMessage').text('Trip Ticket Verified');
                $('#vehicleControl').text(response.sched_passId);
                $('#vehicleDetials').text(response.res_name + ' (' + response.res_serial_plate_no + ')');
                $('#destinationDetails').text(response.sched_destination);
                $('#driverDetailss').text(response.driverName);
                $('#PurposeDetails').text(response.sched_purpose);
                $('#DepartureDetails').text(response.sched_startDate); // Assuming sched_startDate is the departure date
                $('#ReturnDetails').text(response.sched_endDate); // Assuming sched_endDate is the return date
                $('#PassengerDetailsss').text(response.passenger_names);

            }
        },
        error: function(xhr, status, error) {
                $('#statusIcon').hide(); // Hide the success icon
                $('#errorIcon').show();  // Show the error icon
                $('#statusMessage').text('No Record Found!');
            if (scannerType === 'key') {
                $('.message-scanner').text('Error fetching data');
                $('#search-scanner-input').prop('disabled', false);
                $('#clear-search-input').prop('disabled', true); // Disable clear button
            } else if (scannerType === 'qr') {
                $('.message-scanner-qr').text('Error fetching data');
            }
            $('#vehicleControl').text('');
            $('#vehicleDetials').text('');
            $('#destinationDetails').text('');
            $('#driverDetailss').text('');
            $('#PurposeDetails').text('');
            $('#DepartureDetails').text('');
            $('#ReturnDetails').text('');
            $('#PassengerDetailsss').text('');

        }
    });
    __modal_toggle('tripTricketModal');
}

function seeAllButton(driverId) {
    driverid = driverId;
    console.log(driverid);

    generateDriverCards(driverId)
    driverid = '';
}
function generateDriverCards(driverId) {
    $.ajax({
        url: '/schedule/My-getDriversDetails', // Replace with your actual API endpoint
        method: 'POST',
        data: {
            _token: _token, // Assuming _token is defined elsewhere
            driverId: driverId,
        },
        success: function(response) {
            var html = '';
                response.forEach(function(schedule) {


                    html += `
                        <div class="schedule">
                            <div class="text-slate-500 text-L"><strong>${schedule.res_name}(${schedule.res_serial_plate_no})</strong></div>
                            <div class="items-center">
                                <div class="text-slate-500 text-xs"><strong>Departure: </strong>${schedule.sched_startDate}</div>
                                <div class="text-slate-500 text-xs"><strong>Return: </strong>${schedule.sched_endDate}</div>
                                <div class="text-slate-500 text-xs"><strong>Status: </strong><span class=">${schedule.class}">${schedule.status}</span></div>
                                <div class="text-slate-500 text-xs"><strong>Destination: </strong>${schedule.sched_destination}</div>
                                <div class="text-slate-500 text-xs"><strong>Purpose: </strong>${schedule.sched_purpose}</div>
                                <div class="text-slate-500 text-xs text-justify"><strong>Passenger: </strong>${schedule.passenger_names}</div>
                            </div>
                            <div class="border-t mb-2 mt-2"></div>
                        </div>

                    `;
                });

                // Append the generated HTML to your container
                $('#driverschedules').html(html);

            __modal_toggle('allSchedulesModal');

        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });
}

function generateDriverCards2() {
    $.ajax({
        url: '/schedule/My-getDriversDetails', // Replace with your actual API endpoint
        method: 'GET',
        success: function(response) {
            var html = '';
            if (response.data1.length > 0) {
                response.data1.forEach(function(driver) {
                    var maxLength = 40;
                    var schedPassenger = truncateText(driver.passenger_names, maxLength);
                    var sched_purpose = truncateText(driver.sched_purpose, maxLength);
                    var sched_destination = truncateText(driver.sched_destination, maxLength);

                    html += `
                        <div class="col-span-12 lg:col-span-4 xl:col-span-4">
                            <div class="report-box-2 intro-y mt-12 sm:mt-2">
                                <div class="box sm:flex">
                                    <div class="px-8 py-12 flex flex-col justify-center flex-1">
                                        <div class="w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative">
                                            <img class="rounded-full box" style="" alt="Driver Image" src="${driver.driverImage}">
                                        </div>
                                        <div class="relative text-xl font-medium mt-12">${driver.driverName}</div>
                                         <div class="report-box-2__indicator bg-success tooltip cursor-pointer text-l"> Today Schedule <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-up" data-lucide="chevron-up" class="lucide lucide-chevron-up w-4 h-4 ml-0.5"><polyline points="18 15 12 9 6 15"></polyline></svg> </div>
                                          <div class="border-t mb-2 mt-2"></div>
                                         <div id="modal_content_title_and_desc">
                                            <div class="mt-2" id="scheduleDetails">
                                                <div class="mr-2">
                                                    <label class="form-label"><strong>Vehicle: </strong>${driver.res_name}(${driver.res_serial_plate_no})</label>

                                                </div>
                                            </div>
                                            <div class="mt-2" id="Destination">
                                                <div class="mr-2">
                                                    <label class="form-label"><strong>Destination: </strong>${sched_destination}</label>

                                                </div>
                                            </div>
                                            <div class="mt-2" id="Purpose">
                                                <div class="mr-2">

                                                     <label class="form-label tooltip cursor-pointer" title="${driver.passenger_names}"><strong>Purpose: </strong>${sched_purpose}</label>
                                                </div>
                                            </div>
                                             <div class="mt-2" id="Departure">
                                                <div class="mr-2">

                                                    <label class="form-label"><strong>Departure: </strong>${driver.sched_startDate}</label>
                                                </div>
                                            </div>
                                            <div class="mt-2" id="Return">
                                                <div class="mr-2">

                                                    <label class="form-label"><strong>Return: </strong>${driver.sched_endDate}</label>
                                                </div>
                                            </div>
                                            <div class="mt-2" id="PassengerDetails">
                                                <div class="mr-2">
                                                    <label class="form-label tooltip cursor-pointer" title="${driver.passenger_names}"><strong>Passenger:</strong>${schedPassenger}</label>

                                                </div>
                                            </div>


                                        </div>
                                        <button class="btn btn-outline-secondary relative justify-start rounded-full mt-12">
                                            Check Schedule
                                            <span class="w-8 h-8 absolute flex justify-center items-center bg-primary text-white rounded-full right-0 top-0 bottom-0 my-auto ml-auto mr-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="arrow-right" data-lucide="arrow-right" class="lucide lucide-arrow-right w-4 h-4">
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                    <div id="allSchedule">
                                         <div class="px-8 py-12 flex flex-col  flex-1 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-darkmode-300 border-dashed">
                                            <div class="text-slate-500 text-L"><strong>Toyota Furtuner (1201-913254)</strong></div>
                                            <div class="mt-1.5 items-center">
                                                <div class="text-slate-500 text-xs"><strong>Departure: </strong>2024-07-26 01:00 PM</div>
                                                <div class="text-slate-500 text-xs"><strong>Return: </strong> 2024-07-29 01:30 PM</div>
                                                <div class="text-slate-500 text-xs "><strong>Status: </strong><spam class="text-success">Approved</spam></div>
                                            </div>
                                            <div class="border-t mb-2 mt-2"></div>
                                         </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    `;
                });

                // Append the generated HTML to your container
                $('#generatedContent').html(html);
            }
            if (response.data2.length > 0) {
                response.data2.forEach(function(data2) {

                });
            }

        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });
}

// Function to truncate text to a specified length
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

function __modal_toggle(modal_id){
    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#'+modal_id));
    mdl.toggle();
}
function __modal_hide(modal_id){
    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#'+modal_id));
    mdl.hide();

}
