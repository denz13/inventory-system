var _token = $('meta[name="csrf-token"]').attr("content");
var bpath; // Declare bpath as a global variable

$(document).ready(function () {
    bpath = __basepath + "/";
    fetchNotifications();
});

// Function to fetch notifications
function fetchNotifications() {
    $.ajax({
        url: bpath + "notifications",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var notificationsOn = data.notifications_on;

            if (notificationsOn === '1') {
                if (data.notifications.length > 0) {
                    // Clear existing notifications
                    $("#floating-notification-container").empty();
                    // Loop through each notification
                    data.notifications.forEach(function (notification) {
                        // Display notification
                        showStickyNotification(notification);
                    });
                } else {
                    // toastr.info('No notifications found', 'Notice');
                }
            } else {
                // toastr.info('Notifications are Off', 'Notice');
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching notifications: " + error);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching notifications: " + error);
        },
    });
}

// Function to display a single notification
// Function to display a single notification
function showStickyNotification(notification) {

    let full_name = '';
    //let notification_details = '';
    //construct the data
    // if(notification.get_doc_details)
    // {
    //     notification_details = notification.get_doc_details.name;
    // } else if(notification.get_ors_task)
    // {
    //     if(notification.get_ors_task.task)
    //     {
    //         notification_details = notification.get_ors_task.task;
    //     }

    // } else
    // {
    //     notification_details ="No additional details";
    // }

    if(notification.get_sender_details)
    {
        full_name = notification.get_sender_details.firstname+' '+notification.get_sender_details.lastname;

    } else
    {
        full_name = notification.system_name;
    }

    // Construct notification HTML
    var notificationHTML = `
        <div class="toastify-content  hidden flex notification-with-actions-content alert-${notification.color}-soft transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md">
            ${notification.icon}
            <div class="ml-4 mr-4">
                <div class="font-medium flex">
                    <a href="javascript:;" class="font-medium whitespace-nowrap mr-auto">${full_name}</a>
                    <div class="text-slate-500 text-xs whitespace-nowrap ml-auto">${notification.human_created_at}</div>
                </div>
                <div class="text-slate-500 mt-1 w-64 notification-main-container-${notification.id}">
                    <span class="notification-main-content">${notification.notif_content} <span class="bg-${notification.color}/20 text-${notification.color} ${notification.get_doc_details ? "rounded px-1 py-1 underline decoration-dotted" :''}">${notification.get_doc_details ? "More details" :''}</span></span>
                    <span class="notification-secondary-content" style="display: none;">
                       ${notification.notif_details}
                        <p>${notification.note}</p>
                    </span>
                </div>
                <div class="font-medium flex mt-1.5">
                    <div>
                        <a class="text-${notification.color} dark:text-slate-400 view-details-notification" href="${notification.link}" data-id="${notification.id}">View Details</a>
                        <a class="text-slate-500 ml-3 close-notification-${notification.id}" href="javascript:;" data-id="${notification.id}">Dismiss</a>
                    </div>
                    <a class="ml-auto text-slate-500 ml-3 dismiss-all-notifications" href="javascript:;">Dismiss all</a>
                </div>
            </div>
        </div>
        `;

    // Append notification to container
    $("#floating-notification-container").append(notificationHTML);

    // Show/hide dynamic content onclick
    $(`.notification-main-container-${notification.id}`).on("click", function () {
        $(this).find(".notification-main-content").toggle();
        $(this).find(".notification-secondary-content").toggle();
    });

    // Show notification
    var toast = Toastify({
        node: $(".notification-with-actions-content")
            .last()
            .removeClass("hidden")[0],
        duration: -1,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
    });
    toast.showToast();

    // Attach click event handler to close button
    $(`.close-notification-${notification.id}`).on("click", function () {
        var notificationId = $(this).data("id");
        dismissNotification(notificationId);
        $(this).closest(".notification-with-actions-content").remove();
        toast.hideToast();
        // Prevent propagation to parent elements
        return false;
    });

    $(`.dismiss-all-notifications`).on("click", function () {

        dismissAllNotification();
        $(".toastify-top").remove();
        toast.hideToast();
        toastr.success("All notifications marked as seen.");
        // Prevent propagation to parent elements
        return false;
    });

    // Attach click event handler to view details link
    $(".view-details-notification").on("click", function (e) {
        var notificationId = $(this).data("id");
        dismissNotification(notificationId);
    });
}

// Function to dismiss the notification
function dismissNotification(notificationId) {
    // Perform AJAX request to mark the notification as seen
    $.ajax({
        url: "/notifications/mark-as-seen",
        type: "POST",
        headers: {
            "X-CSRF-TOKEN": _token, // Include CSRF token in headers
        },
        data: {
            id: notificationId,
        },
        success: function (response) {
            console.log("Notification marked as seen");
        },
        error: function (xhr, status, error) {
            console.error("Error marking notification as seen: " + error);
        },
    });
}

function dismissAllNotification(notificationId) {
    $.ajax({
        url: "/notifications/dismiss-all",
        type: "POST",
        headers: {
            "X-CSRF-TOKEN": _token, // Include CSRF token in headers
        },
        success: function (response) {
            // Optionally, you can reload the notifications or update the UI
            // location.reload(); // Reload the page to reflect changes
        },
        error: function (xhr) {
            alert('An error occurred while marking notifications as seen.');
        }
    });
}


