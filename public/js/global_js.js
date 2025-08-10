var base_url = window.location.origin;
var doc_file_id;
var conversation_id = "";
var current_user_id = $('meta[name="current-user-id"]').attr("content");


$(document).ready(function () {

    bpath = __basepath + "/";
    load_document_count();

});

function load_document_count() {
    $.ajax({
        url: bpath + "admin/load/document/count",
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (re) {
            var data = JSON.parse(re);
            $("#my_documents_count_div").empty();
            $("#my_documents_count_div").append(data.my_documents_count_div);

            $("#my_incoming_count_div").empty();
            $("#my_incoming_count_div").append(data.my_incoming_count_div);

            $("#my_received_count_div").empty();
            $("#my_received_count_div").append(data.my_received_count_div);

            $("#my_outgoing_count_div").empty();
            $("#my_outgoing_count_div").append(data.my_outgoing_count_div);

            $("#my_hold_count_div").empty();
            $("#my_hold_count_div").append(data.my_hold_count_div);

            $("#my_returned_count_div").empty();
            $("#my_returned_count_div").append(data.my_returned_count_div);

            $("#my_trash_count_div").empty();
            $("#my_trash_count_div").append(data.my_trash_count_div);

            $("#load_unread_messages").empty();
            $("#load_unread_messages").append(data.messages_count_div);

            $("#load_clearance_requests").empty();
            $("#load_clearance_requests").append(data.clearance_count_div);

            $("#to_count_div").empty();
            $("#to_count_div").append(data.to_count_div);

            // console.log(data.current_user_id);
        },
    });
}

// Echo.channel("channel-have-message").listen("load_have_message", (e) => {
//     console.log(current_user_id);

//     if (e.message_sent_to === "msg-sent-" + current_user_id) {
//         if (e.conversation_id === conversation_id) {
//             // console.log(data.conversation_id);
//             load_conversation_content(e.conversation_id);
//         } else {
//             // load_my_conversations();
//         }
//         load_notification(e.message_id);
//         // console.log("haha");
//     }
// });

// function load_notification(message_id) {
//     $.ajax({
//         url: base_url + "/chat/load/message/id",
//         type: "POST",
//         data: {
//             _token: _token,
//             message_id: message_id,
//         },
//         success: function (data) {
//             var parsedData = JSON.parse(data);
//             console.log(parsedData);
//             $("#append_global_notification")
//                 .empty()
//                 .append(parsedData.load_message);

//             // Initialize and show the toast notification
//             let avatarNotification = Toastify({
//                 node: $(
//                     "#notification-with-avatar-content-" + parsedData.message_id
//                 )
//                     .clone()
//                     .removeClass("hidden")[0],
//                 duration: -1,
//                 newWindow: true,
//                 close: true,
//                 gravity: "top",
//                 position: "right",
//                 stopOnFocus: true,
//             }).showToast();

//             // Add click event listener to hide the notification on click
//             $(avatarNotification.toastElement)
//                 .find('[data-dismiss="notification"]')
//                 .on("click", function () {
//                     avatarNotification.hideToast();
//                 });
//         },
//         error: function (xhr, status, error) {
//             console.error(xhr.responseText);
//         },
//     });
// }

function __modal_toggle(modal_id) {
    const mdl = tailwind.Modal.getOrCreateInstance(
        document.querySelector("#" + modal_id)
    );
    mdl.toggle();
}

function __modal_hide(modal_id) {
    const mdl = tailwind.Modal.getOrCreateInstance(
        document.querySelector("#" + modal_id)
    );
    mdl.hide();
}

function __dropdown_close(id = "") {
    const myDropdown = tailwind.Dropdown.getOrCreateInstance(
        document.querySelector(id)
    );
    myDropdown.hide();
}

function load_employment_type(target) {
    $.ajax({
        url: "/dashboard/get_employment_type",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
            $(target).html('<option value="" disabled selected>Loading ...</option>');
        },
        success: function (response) {
            $(target).html(response);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function __swalShowLoading(){

    Swal.fire({
        // icon: icon,
        // title: title,
        customClass: 'swal2-popup-custom',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

}
function __swalCustomLoading(title, text){

    Swal.fire({
        icon: 'info',
        title: title,
        text: text,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

}
function __swalErrorHandling(error) {
    Swal.fire({
        icon: 'error',
        title: 'Oooopss..',
        text: 'Something went wrong: '+error,
        timerProgressBar: false,
        showConfirmButton: false,
        //timer: 2000  // Close the alert after 1 second
    });
}

function __swalSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: 'Success..',
        text: message,
        timerProgressBar: false,
        showConfirmButton: false,
        timer: 2000  // Close the alert after 1 second
    });
}
function __swalError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        timerProgressBar: false,
        showConfirmButton: false,
        timer: 2000  // Close the alert after 1 second
    });
}


function employeeFullNameGenerator(firstName, middleName, lastName){

    let signatoryFirstName      = firstName;
    let signatoryMiddleName     = middleName;
    let signatoryLastName       = lastName;
    let signatoryMiddleInitial  = signatoryMiddleName ? signatoryMiddleName.charAt(0) + '.' : '';

    return signatoryFirstName + ' ' + signatoryMiddleInitial + ' ' + signatoryLastName;

}


/** Function to format date */
function formatDate(dateString) {
    let parts = dateString.split(' '); // Split into date and time
    let datePart = parts[0]; // Get the date part
    let date = new Date(datePart); // Create a Date object

    // Array of month names
    let monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    // Format the date
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + day + ', ' + year;
}
/** FUNCTION FOR TABLE DYNAMIC NO RESULTS AND LOADING SPINNER */
function tableRowNoResult(tableBody, message, colspan){

    const transactionList = `
                     <tr class="intro-x">
                        <td colspan="${colspan}" class="w-full text-center">

                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                            <a href="javascript:;" class=" text-slate-500 text-xs whitespace-nowrap">${  message }</a>
                            <div style="visibility: hidden" class="text-slate-500 text-xs whitespace-nowrap mt-0.5">No Data</div>
                        </td>
                     </tr>`;

    return tableBody.append(transactionList); // Append curriculum row to the table

}


function warningModal(title, content){

    __modal_toggle('warning_modal_preview');
    let modal_element = $('.modal_warning_content');

    const modalContent = `
        <div class="text-3xl mt-5">${title}</div>
        <div class="text-slate-500 mt-2">${content}</div>
        `;

    return modal_element.append(modalContent);
}



function getTableColspan(tableSelector) {
    // Get the number of <th> in the table header
    let colspan = $(tableSelector + ' thead tr th').length;

    // If no <th> found, count the number of <td> in the first row of the body
    if (colspan === 0) {
        colspan = $(tableSelector + ' tbody tr:first td').length;
    }

    return colspan;
}

let filePond;

function __fileUploadingFilePond(filePondElementID){

    const filePondElement   = document.querySelector(`input[id='${filePondElementID}']`);

    filePond = FilePond.create(filePondElement, {
        credits: false,
        allowMultiple: false,
        allowFileTypeValidation: true,
        maxFileSize: '5MB',
        acceptedFileTypes: [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word (.docx)
            'application/msword', // Word (.doc)
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (.xlsx)
            'application/vnd.ms-excel', // Excel (.xls)
            'image/jpeg', // JPEG image
            'image/png', // PNG image
            'image/gif'  // GIF image
        ],

        // Enable client-side processing
        server: {
            process: (fieldName, file, metadata, load, error, progress, abort) => {
                // Simulate a delay before uploading the file (for testing purposes)
                setTimeout(() => {
                    // Simulate successful upload
                    load(file);
                }, 1000);
            },
            revert: (uniqueFileId, load, error) => {
                // Revert logic if needed
            },
        },
    });

}
function __removeUploadedFilePond() {
    if (filePond) {
        let files = filePond.getFiles();
        if (files.length > 0) {
            filePond.processFiles().then(() => {
                filePond.removeFiles();
            });
        }
    }
}
