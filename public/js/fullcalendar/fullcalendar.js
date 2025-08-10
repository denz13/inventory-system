
console.log("yooooo")

$(document).ready(function()
 {
    document.addEventListener('DOMContentLoaded', function () {
        if ($("#calendar").length) {
            if ($("#calendar-events").length) {
                new Draggable($("#calendar-events")[0], {
                    itemSelector: ".event",
                    eventData: function (eventEl) {
                        return {
                            title: $(eventEl).find(".event__title").html(),
                            duration: {
                                days: parseInt(
                                    $(eventEl).find(".event__days").text()
                                ),
                            },
                        };
                    },
                });
            }

            var calendarEl = document.getElementById('calendar');
            var calendar = new FullCalendar.Calendar(calendarEl, {
                // Your FullCalendar options and configurations
                initialView: 'multiMonth', // Set initial view to multi-month
                views: {
                    multiMonth: {
                        type: 'multiMonth',
                        duration: { months: 3 }, // Number of months to display
                        buttonText: 'Multi-Month'
                    },
                    dayGridMonth: {
                        type: 'dayGridMonth',
                        buttonText: 'Month'
                    },
                    weeklyGrid: {
                        type: 'timeGridWeek',
                        buttonText: 'Week'
                    }
                },
                droppable: true,
                headerToolbar: {
                    left: "prev,next today",
                    center: "title",
                    right: "multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                },
                initialDate: "multiMonth",
                navLinks: true,
                editable: true,
                dayMaxEvents: true,
                events: [
                    {
                        title: "Vue Vixens Day",
                        start: "2021-01-05",
                        end: "2021-01-08",
                    },
                    {
                        title: "VueConfUS",
                        start: "2021-01-11",
                        end: "2021-01-15",
                    },
                    {
                        title: "VueJS Amsterdam",
                        start: "2021-01-17",
                        end: "2021-01-21",
                    },
                    {
                        title: "Vue Fes Japan 2019",
                        start: "2021-01-21",
                        end: "2021-01-24",
                    },
                    {
                        title: "Laracon 2021",
                        start: "2021-01-24",
                        end: "2021-01-27",
                    },
                ],
                drop: function (info) {
                    if (
                        $("#checkbox-events").length &&
                        $("#checkbox-events")[0].checked
                    ) {
                        $(info.draggedEl).parent().remove();

                        if ($("#calendar-events").children().length == 1) {
                            $("#calendar-no-events").removeClass("hidden");
                        }
                    }
                },
            });

            calendar.render();
        }
    });

});
