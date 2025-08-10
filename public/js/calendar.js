var calendar;
var filter_date_from = '';
var efilter_date_from = '';

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {
    loadCalendar();

    // Create event
    date_and_name_change();
    color_change();
    date_initialize();
});

function date_initialize() {
    let element_id = 'what_date';

    filter_date_from = new Litepicker({
        element: document.getElementById(element_id),
        autoApply: false,
        singleMode: false,
        numberOfColumns: 1,
        numberOfMonths: 1,
        showWeekNumbers: false,
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

    efilter_date_from = new Litepicker({
        element: document.getElementById('ewhat_date'),
        autoApply: false,
        singleMode: false,
        numberOfColumns: 1,
        numberOfMonths: 1,
        showWeekNumbers: false,
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

function setDateLitepicker(startDate, endDate) {
    const picker = new Litepicker({
        element: document.getElementById('what_date'),
        singleMode: false,
        format: 'DD MMM, YYYY',
        startDate: startDate,
        endDate: endDate,
        autoApply: true,
    });

    picker.setDateRange(startDate, endDate);
}

function loadCalendar() {
    var calendarEl = $('#calendar')[0];
    var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'dayGridMonth',
            center: 'customPrevButton customNextButton',
            right: 'title'
        },
        customButtons: {
            customPrevButton: {
                text: 'Prev',
                click: function() {
                    calendar.prev();
                    var date = calendar.getDate();
                    var monthNumber = date.getMonth() + 1;
                    var year = date.getFullYear();
                }
            },
            customNextButton: {
                text: 'Next',
                click: function() {
                    calendar.next();
                    var date = calendar.getDate();
                    var monthNumber = date.getMonth() + 1;
                    var year = date.getFullYear();
                }
            }
        },
        eventContent: function (arg) {
            return {
                html: '<div class="fc-content event_click p-2 w-full rounded text-center font-medium text-white truncate cursor-pointer" data-id="'+arg.event.id+'" style="background-color: '+ arg.event.backgroundColor +';">'+ arg.event.title +'</div>',
            };
        },
        selectable: true,
        selectMirror: true,
        editable: false,
        eventOverlap: true,
        weekNumbers: false,
        navLinks: true,
        nowIndicator: true,
        lazyFetching: true,
        // eventMouseEnter: function(mouseEnterInfo) {
        //     var tooltipElement = document.createElement('div');
        //     tooltipElement.innerHTML = '<div class="bg-primary">Event Hover</div>';
        //     tooltipElement.className = 'custom-tooltip';
        //     document.body.appendChild(tooltipElement);
        //     var rect = mouseEnterInfo.el.getBoundingClientRect();
        //     tooltipElement.style.position = 'absolute';
        //     tooltipElement.style.top = rect.top - tooltipElement.offsetHeight + 'px';
        //     tooltipElement.style.left = rect.left + 'px';
        // },
        // eventMouseLeave: function() {
        //     var tooltip = document.querySelector('.custom-tooltip');
        //     if (tooltip) {
        //         tooltip.remove();
        //     }
        // },
        dateClick: function(info) {
            let dateAndTime = info.dateStr.split('T'),
                convertdate = moment(dateAndTime[0]).format('YYYY-MM-DD');

            filter_date_from.setDateRange(convertdate, convertdate);
            document.getElementById('what_date').value = moment(convertdate).format('MMM DD, YYYY') + ' - ' + moment(convertdate).format('MMM DD, YYYY');

            // Clear any previous error states
            $('#what_date').removeClass('border-danger text-danger');
            $('#event_date_error').html('');
            $('#event_name').val('');
            $('#event_name').removeClass('border-danger text-danger');
            $('#event_name_error').html('');

            // Open the modal
            open_modal('#add_event_modal');
        },
        events: function(info, successCallback, failureCallback) {
            var start_date = info.startStr;
            var end_date = info.endStr;

            $.ajax({
                url: "/admin/load_calendar",
                type: "POST",
                dataType: "json",
                data: {
                    start: start_date,
                    end: end_date
                },
                success: function (data) {
                    successCallback(data); // Pass fetched events to the calendar
                },
                error: function(xhr, status, error) {
                    failureCallback(xhr.responseText);
                    console.log(xhr.responseText);
                }
            });
            side_list(start_date, end_date);
        },
    });
    calendar.render();

    $('body').on('click', '#save_event', function() {
        var date = $('#what_date').val();
        var name = $('#event_name').val();
        var type = $('#event_type').val();
        var repeat = $('#event_repeat').val();
        var color = $('#event_color').css('background-color');
        var btn = $(this);

        if (date.trim() == '') {
            $('#what_date').addClass('border-danger text-danger');
            $('#event_date_error').html('Please enter event date.');
        } else if (type == null) {
            $('#event_type').addClass('border-danger text-danger');
            $('#event_type_error').html('Please select type.');
        } else if (name.trim() == '') {
            $('#event_name').addClass('border-danger text-danger');
            $('#event_name_error').html('Please enter event name.');
        } else {
            $.ajax({
                url: "/admin/save_event",
                type: "POST",
                dataType: "json",
                data: {
                    date: date,
                    name: name,
                    repeat: repeat,
                    color: color,
                    type: type
                },
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Saving</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Save');
                    btn.prop('disabled', false);
                    if (response == 'exist_date') {
                        $('#what_date').addClass('border-danger text-danger');
                        $('#event_date_error').html('Date chosen already has an event.');
                    } else {
                        close_modal('#add_event_modal');
                        __notif_show(3, 'Success', 'New event added.');
                        calendar.refetchEvents();
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });

    $('body').on('click', '.event_click', function() {
        var id = $(this).data('id');
        $('#event_id').val(id);
        $.ajax({
            url: "/admin/get_event_details",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },
            success: function (response) {
                var dateFrom = moment(response.date_from, 'YYYY-MM-DD').format('YYYY-MM-DD');
                var dateTo = moment(response.date_to, 'YYYY-MM-DD').format('YYYY-MM-DD');

                efilter_date_from.setDateRange(dateFrom, dateTo);

                $('#eevent_type').val(response.type);
                $('#eevent_name').val(response.name);
                $('#eevent_repeat').val(response.repeat);
                $('#event_color').css('background-color', response.color);
                open_modal('#edit_event_modal');
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });

    $('body').on('click', '#edit_event', function() {
        var id = $('#event_id').val();
        var date = $('#ewhat_date').val();
        var name = $('#eevent_name').val();
        var type = $('#eevent_type').val();
        var repeat = $('#eevent_repeat').val();
        var color = $('#eevent_color').css('background-color');
        var btn = $(this);

        if (date.trim() == '') {
            $('#what_date').addClass('border-danger text-danger');
            $('#event_date_error').html('Please enter event date.');
        } else if (type == null) {
            $('#event_type').addClass('border-danger text-danger');
            $('#event_type_error').html('Please select type.');
        } else if (name.trim() == '') {
            $('#event_name').addClass('border-danger text-danger');
            $('#event_name_error').html('Please enter event name.');
        } else {
            $.ajax({
                url: "/admin/update_event",
                type: "POST",
                dataType: "json",
                data: {
                    id: id,
                    date: date,
                    name: name,
                    repeat: repeat,
                    color: color,
                    type: type
                },
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Updating</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    btn.html('Update');
                    btn.prop('disabled', false);
                    if (response == 'success') {
                        close_modal('#edit_event_modal');
                        __notif_show(3, 'Success', 'Event updated.');
                        calendar.refetchEvents();
                    }
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });

    $('body').on('click', '#delete_event_btn', function() {
        var id = $('#event_id').val();
        $.ajax({
            url: "/admin/delete_event",
            type: "POST",
            dataType: "json",
            data: {id: id},
            success: function (response) {
                if (response == 'success') {
                    close_modal('#delete_event_modal');
                    close_modal('#edit_event_modal');
                    __notif_show(3, 'Success', 'Event deleted.');
                    calendar.refetchEvents();
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
}

function date_and_name_change(){
    $('body').on('input', '#event_name', function() {
        $('#event_name').removeClass('border-danger text-danger');
        $('#event_name_error').html('');
    });

    $('body').on('change', '#event_type', function() {
        $('#event_type').removeClass('border-danger text-danger');
        $('#event_type_error').html('');
    });
}

function color_change() {
    $('body').on('click', '.color_change', function() {
        const myDropdown = tailwind.Dropdown.getOrCreateInstance(document.querySelector("#color_dropdown"));
        myDropdown.hide();
        var color = $(this).css('background-color');
        $('#event_color').css('background-color', color);
    });

    $('body').on('click', '.color_change', function() {
        const myDropdown = tailwind.Dropdown.getOrCreateInstance(document.querySelector("#ecolor_dropdown"));
        myDropdown.hide();
        var color = $(this).css('background-color');
        $('#eevent_color').css('background-color', color);
    });
}

function side_list(start_date, end_date) {
    $.ajax({
        url: "/admin/list_of_events",
        type: "POST",
        dataType: "json",
        data: {start_date: start_date, end_date: end_date},
        beforeSend: function() {
            $('#calendar_events_list').html('<div class="text-slate-500 p-3 text-center" id="calendar-no-events"><i class="fa-solid fa-ellipsis fa-fade"></i></div>');
        },
        success: function (response) {
            $('#calendar_events_list').html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}
