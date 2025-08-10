// Define the calendar variable in the global scope
var selectedResource;
var selectedYear;
var selectedMonth;
$(document).ready(function () {
    var _token = $('meta[name="csrf-token"]').attr('content');

    fullcalendarEvent();
     $('#calendarContainer').hide();
     select_ResourcesS();

    var previousSelectedResource;



    $('#select_Resources').on('change', function (e) {
        var selectedOption = $(this).find(":selected").attr("data-id");
        var selectedValue = $(this).val();

        selectedResource = selectedOption;

        if (selectedOption !== undefined) {

            updateCalendar(selectedResource); // Call the updateCalendar function with the selected resource
        } else if (selectedValue === null) {
            fullcalendarEvent();
        }

        // Update the previousSelectedResource for the next change event
    });

    $('#Select_Date_Calendar').on('change', function() {
    // Get the selected date from the input field
    var selectedDate = new Date($(this).val());

    // Navigate to the selected year and month in FullCalendar
    selectedYear = selectedDate.getFullYear();
    selectedMonth = selectedDate.getMonth();
    if (selectedYear >= 0 && selectedMonth >= 0) {

        $('#hiddenUpdateCalendarButton').click();
    }
    else{
        updateCalendarByDate(selectedYear, selectedMonth)
    }

    });
// Trigger the click event on the hidden button
$('#hiddenUpdateCalendarButton').click(function() {
    // Get the selected date from the input field
    updateCalendarByDate(selectedYear, selectedMonth)
});

// Now, whenever you want to update the calendar, you can trigger the hidden button click
});
function updateCalendar(selectedResourceValue) {
    var calendarEl = document.getElementById('calendar');
    var initialYear = new Date().getFullYear();
    var initialMonth = new Date().getMonth();
    var calendar = new FullCalendar.Calendar(calendarEl, {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'multiMonthYear,dayGridMonth,timeGridWeek'
            },
            initialView: 'dayGridMonth',
            initialDate: new Date(initialYear, initialMonth, 1),
            editable: false,
            droppable: false,
            selectable: true,

            eventMaxStack: 4,
            dayMaxEvents: true,
            dayMaxEventRows: 10,

            eventDisplay: 'list',
            eventOverlap: false,

        events: function (fetchInfo, successCallback, failureCallback) {
            $('#spinner').show();
            $.ajax({
                url: '/schedule/My-schedPost',
                method: 'POST',
                type: "POST",
                data: {
                    _token,
                    selectedResourceValue: selectedResourceValue
                },
                dataType: 'json',
                beforeSend: function (xhr) {

                },
                success: function (response) {
                    // Your success handling code remains unchanged
                    var events = response.map(function (item) {
                        return {
                            title: item.res_name + ' (' + item.res_serial_plate_no + ')',
                            description: item.sched_purpose,
                            start: new Date(item.sched_startDate),
                            end: new Date(item.sched_endDate),
                        };
                    });

                    successCallback(events);
                },
                error: function (xhr, status, error) {
                    // Your error handling code remains unchanged
                    failureCallback(error);
                },
                complete: function() {
                    $('#spinner').hide();
                }
            });
        },
        loading: function(isLoading) {
            if (isLoading) {
                // Show loading spinner
                $('#loading-spinner').addClass('show');
            } else {
                // Hide loading spinner
                $('#loading-spinner').removeClass('show');
            }
        },

        eventContent: function (arg) {
            return {
                html: '<div class="custom-event">' +
                    '<div class="custom-event-title" style="padding: 5px;">' + // Adjust the padding as needed
                    arg.event.title + ' - ' + arg.event.extendedProps.description +
                    '</div>' +
                    '</div>',
                };
            },

            eventMouseEnter: function (mouseEnterInfo) {
                // Customize the appearance when the mouse enters an event
                var tooltip = $('<div class="tooltiptext">' + mouseEnterInfo.event.extendedProps.description + '</div>');
                $("body").append(tooltip);

                // Adjust the tooltip position
                var tooltipTop = mouseEnterInfo.jsEvent.clientY - tooltip.height();
                var tooltipLeft = mouseEnterInfo.jsEvent.clientX + 10;

                // Ensure the tooltip stays within the viewport
                tooltipTop = Math.max(0, tooltipTop);
                tooltipLeft = Math.min($(window).width() - tooltip.width(), tooltipLeft);

                tooltip.css('top', tooltipTop);
                tooltip.css('left', tooltipLeft);
            },

                eventMouseLeave: function () {
                    // Remove the tooltip when the mouse leaves an event
                    $('.tooltiptext').remove();
                },

           });

    var mediaQuery = window.matchMedia('(max-width: 150px)');
    if (mediaQuery.matches) {
        calendar.setOption('dayHeaderContent', function (info) {
            return '<span class="custom-day-header">' + info.dayNumberText + '</span>';
        });

        calendar.setOption('dayCellContent', function (info) {
            return '<span class="custom-day-cell">' + info.dayNumberText + '</span>';
        });
    }


    // Destroy the previous instance of the calendar
    calendar.destroy();

    // Render the updated calendar
    calendar.render();
}

function updateCalendarByDate(selectedYear, selectedMonth) {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek'
        },
        initialView: 'dayGridMonth',
        initialDate: new Date(selectedYear, selectedMonth, 1),
        editable: false,
            droppable: false,
            selectable: true,

            eventMaxStack: 4,
            dayMaxEvents: true,
            dayMaxEventRows: 10,

            eventDisplay: 'list',
            eventOverlap: false,

        events: function (fetchInfo, successCallback, failureCallback) {
            $.ajax({
                url: '/schedule/My-schedPost',
                method: 'POST',
                type: "POST",
                data: {
                    _token,
                    selectedYear: selectedYear,
                    selectedMonth: selectedMonth
                },
                dataType: 'json',
                success: function (response) {
                    var events = response.map(function (item) {
                        return {
                            title: item.res_name + ' (' + item.res_serial_plate_no + ')',
                            description: item.sched_purpose,
                            start: new Date(item.sched_startDate),
                            end: new Date(item.sched_endDate),
                        };
                    });

                    successCallback(events);
                },
                error: function (xhr, status, error) {
                    failureCallback(error);
                }
            });
        },
        loading: function(isLoading) {
            if (isLoading) {
                // Show loading spinner
                $('#loading-spinner').addClass('show');
            } else {
                // Hide loading spinner
                $('#loading-spinner').removeClass('show');
            }
        },
        eventContent: function (arg) {
            return {
                html: '<div class="custom-event">' +
                    '<div class="custom-event-title" style="padding: 5px;">' + // Adjust the padding as needed
                    arg.event.title + ' - ' + arg.event.extendedProps.description +
                    '</div>' +
                    '</div>',
                };
            },

            eventMouseEnter: function (mouseEnterInfo) {
                // Customize the appearance when the mouse enters an event
                var tooltip = $('<div class="tooltiptext">' + mouseEnterInfo.event.extendedProps.description + '</div>');
                $("body").append(tooltip);

                // Adjust the tooltip position
                var tooltipTop = mouseEnterInfo.jsEvent.clientY - tooltip.height();
                var tooltipLeft = mouseEnterInfo.jsEvent.clientX + 10;

                // Ensure the tooltip stays within the viewport
                tooltipTop = Math.max(0, tooltipTop);
                tooltipLeft = Math.min($(window).width() - tooltip.width(), tooltipLeft);

                tooltip.css('top', tooltipTop);
                tooltip.css('left', tooltipLeft);
            },

                eventMouseLeave: function () {
                    // Remove the tooltip when the mouse leaves an event
                    $('.tooltiptext').remove();
                },

           });

    var mediaQuery = window.matchMedia('(max-width: 150px)');
    if (mediaQuery.matches) {
        calendar.setOption('dayHeaderContent', function (info) {
            return '<span class="custom-day-header">' + info.dayNumberText + '</span>';
        });

        calendar.setOption('dayCellContent', function (info) {
            return '<span class="custom-day-cell">' + info.dayNumberText + '</span>';
        });
    }


    // Destroy the previous instance of the calendar
    calendar.destroy();

    // Render the updated calendar
    calendar.render();
}

function select_ResourcesS() {

    $.ajax({
        url: '/schedule/My-getResources',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            var select2 = $('#select_Resources');
            select2.empty();
            $('#select_Resources').select2({
                placeholder: 'Select Resource',
                allowClear: true,
                tags: true
            });

            $.each(response, function (index, resource) {
                // Create a new option element with the category name and data-id attribute
                var option = new Option(resource.res_name, resource.id);
                $(option).attr('data-id', resource.id);
                // Append the option to the select element
                select2.append(option);

            });

            $('#select_Resources').val(null).trigger('change');
            // Initialize the Select2 dropdown
        },
        error: function (xhr, status, error) {
            console.error('Error fetching categories:', error);
        }
    });
}

function fullcalendarEvent() {
    var calendar;
    var calendarEl = document.getElementById('calendar');
    var initialYear = new Date().getFullYear();
    var initialMonth = new Date().getMonth();

    calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek'
        },
        initialView: 'dayGridMonth',
        initialDate: new Date(initialYear, initialMonth, 1),
        editable: false,
        droppable: false,
        selectable: true,

        eventMaxStack: 4,
        dayMaxEvents: true,
        dayMaxEventRows: 10,

        eventDisplay: 'list',
        eventOverlap: false,
    //
        events: function (fetchInfo, successCallback, failureCallback) {
            $.ajax({
                url: '/schedule/My-schedPost',
                method: 'POST',
                type: "POST",
                data: {
                    _token

                },
                dataType: 'json',
                success: function (response) {


                        var events = response.map(function (item) {
                            return {
                                title: item.res_name + ' (' + item.res_serial_plate_no + ')',
                                description: item.sched_purpose,
                                start: new Date(item.sched_startDate), // Use the correct timezone here
                                end: new Date(item.sched_endDate),
                            };
                        });

                    successCallback(events);
                },
                error: function (xhr, status, error) {
                    failureCallback(error);
                }
            });
        },
        loading: function(isLoading) {
            if (isLoading) {
                // Show loading spinner
                $('#loading-spinner').addClass('show');
            } else {
                // Hide loading spinner
                $('#loading-spinner').removeClass('show');
            }
        },
        eventContent: function (arg) {
            return {
                html: '<div class="custom-event">' +
                    '<div class="custom-event-title" style="padding: 5px;">' + // Adjust the padding as needed
                    arg.event.title + ' - ' + arg.event.extendedProps.description +
                    '</div>' +
                    '</div>',
                };
            },

            eventMouseEnter: function (mouseEnterInfo) {
                // Customize the appearance when the mouse enters an event
                var tooltip = $('<div class="tooltiptext">' + mouseEnterInfo.event.extendedProps.description + '</div>');
                $("body").append(tooltip);

                // Adjust the tooltip position
                var tooltipTop = mouseEnterInfo.jsEvent.clientY - tooltip.height();
                var tooltipLeft = mouseEnterInfo.jsEvent.clientX + 10;

                // Ensure the tooltip stays within the viewport
                tooltipTop = Math.max(0, tooltipTop);
                tooltipLeft = Math.min($(window).width() - tooltip.width(), tooltipLeft);

                tooltip.css('top', tooltipTop);
                tooltip.css('left', tooltipLeft);
            },

        eventMouseLeave: function () {
            // Remove the tooltip when the mouse leaves an event
            $('.tooltiptext').remove();
        },

    });

    var mediaQuery = window.matchMedia('(max-width: 150px)');
    if (mediaQuery.matches) {
        calendar.setOption('dayHeaderContent', function (info) {
            return '<span class="custom-day-header">' + info.dayNumberText + '</span>';
        });

        calendar.setOption('dayCellContent', function (info) {
            return '<span class="custom-day-cell">' + info.dayNumberText + '</span>';
        });
    }

    calendar.render();
}
function getEventsOnDay(date) {
    var events = calendar.getEvents();
    var eventsOnDay = [];

    events.forEach(event => {
        if (event.start.toDateString() === date.toDateString()) {
            eventsOnDay.push(event);
        }
    });

    return eventsOnDay;
}
function getEventsOnDay(date) {
    var events = calendar.getEvents();
    var eventsOnDay = [];

    events.forEach(event => {
        if (event.start.toDateString() === date.toDateString()) {
            eventsOnDay.push(event);
        }
    });

    return eventsOnDay;
}
function handleWindowResize() {
    calendar.windowResize();
}

function datecliked() {
    $('#createScheduleButton').on('click', function () {
        createSched.show();

    });
}

function select2_Instance() {
    $('#resource_list').select2({
        placeholder: 'Select Resource',
        allowClear: true,
    });
}

function __modal_toggle(modal_id) {
    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#' + modal_id));
    mdl.toggle();
}

function __modal_hide(modal_id) {
    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#' + modal_id));
    mdl.hide();
}

