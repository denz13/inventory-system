$(document).ready(function () {
    bpath = __basepath + "/";
});

$("body").on('click', '#btn_FastRelease', function () {
    // Existing code for fast release
    const senderID = $('#doc_sendAs').find(":selected").val();
    const assFromType = $('#doc_sendAs').find(":selected").data('ass-type');

    // Get multiple docID values from selected checkboxes
    const checkedItems = $('.form-check-input:checked').closest('.inbox__item');
    const docIDs = checkedItems.map(function() {
        return $(this).find('.form-check-input').data('document-id');
    }).get();

    if (docIDs.length === 0) {
        alert("Please select at least one document to release.");
        return;
    }

    const releaseDate = $('#release_date').val();
    const receiveDate = $('#receive_date').val();
    const employee = $('#emp_List').val();
    const groups = $('#grp_List').val();
    const rc = $('#rc__list').val();
    const note = $('#send_doc_note').val();

    $.ajax({
        type: "POST",
        url: `${bpath}documents/inbox/docs-fast-send`,
        data: {
            _token: _token,
            docID: docIDs,
            note: note,
            release_date: releaseDate,
            receive_date: receiveDate,
            employee: employee,
            groups: groups,
            RC: rc,
            senderID: senderID,
            __from: assFromType,
        },
        success: function (response) {
            if (response.status === 200) {
                const modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#send_CreatedDocs'));
                modal.hide();
                $('#send_toUser').hide();
                $('#btn_sendToAll').prop("checked", false);
                $('#checkBox_shoAuthor').prop("checked", false);
                $('#emp_List').val(null).trigger('change');
                $('#grp_List').val(null).trigger('change');
                $('#rc__list').val(null).trigger('change');
                $('.__notification').load(location.href + ' .__notification');
                $('.incoming_counter').load(location.href + ' .incoming_counter');
            }
        }
    });
});

// $("body").on('click', '#btn_incomingDocs_receive', function () {
//     // Get selected document details
//     const checkedItems = $('.form-check-input:checked').closest('.inbox__item');
//     const docData = checkedItems.map(function () {
//         return {
//             docID: $(this).find('.form-check-input').data('document-id'),
//             trackID: $(this).find('.form-check-input').data('trk-id'),
//             docTrack: $(this).find('.form-check-input').data('track-number')
//         };
//     }).get();

//     if (docData.length === 0) {
//         alert("Please select at least one document to receive.");
//         return;
//     }

//     // Populate modal with the document tracking numbers
//     const docTrackingList = $("#doc-tracking-list");
//     docTrackingList.empty();
//     docData.forEach(function (item) {
//         docTrackingList.append(`<li>
//             <a href="${bpath}track/doctrack/${item.docID}" target="_blank" class="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md">
//                 <div class="max-w-[50%] truncate mr-1">${item.docTrack}</div>
//                 <div class="ml-auto font-medium">Details</div>
//             </a>
//         </li>`);
//     });

//     // Show the modal
//     const modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#receive-docs-modal'));
//     modal.show();

//     // Handle confirmation action
//     $("#confirm-receive").off('click').on('click', function () {
//         const doc_sendAs = $('#doc_sendAs').val();
//         const doc_sendAstype = $('#doc_sendAs').find(':selected').data('ass-type');
//         const swal_receive_message = $('#swal_receive_message').val();
//         const swal_receive_action = $('#swal_receive_action').val();

//         let completedRequests = 0;

//         docData.forEach(function (item, index) {
//             $.ajax({
//                 url: bpath + 'documents/incoming/doc/details',
//                 type: "POST",
//                 data: {
//                     _token: _token,
//                     docID: item.docID,
//                 },
//                 success: function (data) {
//                     const parsedData = JSON.parse(data);
//                     incoming_receive_action(item.docID, item.docID, swal_receive_message, swal_receive_action, doc_sendAstype, doc_sendAs);

//                     completedRequests++;
//                     if (completedRequests === docData.length) {
//                         // All requests are completed, hide the modal
//                         const modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#receive-docs-modal'));
//                         modal.hide();
//                         loadInboxItems(currentPage, currentFilter, query);
//                         setActiveFilter(currentFilter); // Set the default active filter
//                     }
//                 }
//             });
//         });
//     });
// });

// function incoming_receive_action(docID, track_id, note, action, doc_sendAstype, doc_sendAs) {
//     $.ajax({
//         url: bpath + 'documents/inbox/take/action',
//         type: "POST",
//         data: {
//             _token: _token,
//             docID: docID,
//             track_id: track_id,
//             note: note,
//             action: action,
//             doc_sendAstype: doc_sendAstype,
//             doc_sendAs: doc_sendAs,
//         },
//         success: function (response) {
//             var data = JSON.parse(response);
//             if (data.status == 200) {
//                 toastr.success('Document with tracking number of ' + docID + ' has been received!');
//             }
//         }
//     });
// }


$("body").on('click', '.btn-multiple-action', function () {
    // Get the action from the clicked button
    const action = $(this).data('action');

    // Show the modal
    const modal = tailwind.Modal.getOrCreateInstance(document.querySelector('#modal_multiple_action'));
    modal.show();

    const checkedItems = $('.form-check-input:checked').closest('.inbox__item');
    const docData = checkedItems.map(function () {
        return {
            docID: $(this).find('.form-check-input').data('document-id'),
            trackID: $(this).find('.form-check-input').data('trk-id'),
            docTrack: $(this).find('.form-check-input').data('track-number')
        };
    }).get();

    if (docData.length === 0) {
        alert(`Please select at least one document to ${action}.`);
        return;
    }

    // Populate modal with the document tracking numbers
    const docTrackingList = $("#modal_tracking_list");
    docTrackingList.empty();
    docData.forEach(function (item) {
        docTrackingList.append(`
            <li>
                <a href="${bpath}track/doctrack/${item.docID}" target="_blank" class="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md">
                    <div class="max-w-[50%] truncate mr-1">${item.docID}</div>
                    <div class="ml-auto font-medium">Details</div>
                </a>
            </li>
        `);
    });

    // Set modal title, labels, action select, and icon
    switch (action) {
        case 'release':
            $("#modal_action_info").text('Release Documents');
            $("#modal_assign_to_label").text('Release as');
            $("#modal_assign_to_employee_label").text('Release to');
            // $("#modal_action_select").val(8); // Clear any previous selection
            updateActionSelect(action);
            $("#modal_dynamic-icon").empty().append(`
                <i id="modal_icon" class="fas fa-paper-plane w-16 h-16 text-info mx-auto mt-3"></i>
            `);
            break;
        case 'receive':
            $("#modal_action_info").text('Receive Documents');
            $("#modal_assign_to_label").text('Receive as');
            $("#modal_assign_to_employee_label").text('Receive from');
            // $("#modal_action_select").val(6); // Set value for receive
            updateActionSelect(action);
            $("#modal_dynamic-icon").empty().append(`
                <i id="modal_icon" class="fas fa-download w-16 h-16 text-success mx-auto mt-3"></i>
            `);

            break;
        case 'hold':
            $("#modal_action_info").text('Hold Documents');
            $("#modal_assign_to_label").text('Hold as');
            $("#modal_assign_to_employee_label").text('Holder');
            // $("#modal_action_select").val(5); // Set value for hold
            updateActionSelect(action);
            $("#modal_dynamic-icon").empty().append(`
                <i id="modal_icon" class="fas fa-pause w-16 h-16 text-warning mx-auto mt-3"></i>
            `);
            break;
        case 'return':
            $("#modal_action_info").text('Return Documents');
            $("#modal_assign_to_label").text('Return as');
            $("#modal_assign_to_employee_label").text('Return to (if empty, to author)');
            // $("#modal_action_select").val(4); // Set value for return
            updateActionSelect(action);
            $("#modal_dynamic-icon").empty().append(`
                <i id="modal_icon" class="fas fa-undo-alt w-16 h-16 text-danger mx-auto mt-3"></i>
            `);
            break;
        default:
            console.error('Unknown action:', action);
            break;
    }
});



$("body").on("click", "#modal_action_btn", function () {
    // Disable the button to avoid multiple clicks
    var $this = $(this);
    $this.attr('disabled', true);

    // Fetch data from the modal
    var model_ass_type = $("#modal_assign_to").find(":selected").data("ass-type");
    var model_as = $("#modal_assign_to").val();
    var modal_message = $("#modal_note").val();
    var modal_scan_id_from = $("#modal_scan_id").val();
    var emp_List = [];
    var modal_action = $("#modal_action_select").val();
    var track_ids = [];

    // Gather selected employee IDs
    $("#modal_assign_to_employee :selected").each(function (i, selected) {
        emp_List[i] = $(selected).val();
    });

    // Gather selected document IDs from the modal
    $("#modal_tracking_list li a").each(function() {
        track_ids.push($(this).data('document-id'));
    });

    // Get multiple docID values from selected checkboxes
    const checkedItems = $('.form-check-input:checked').closest('.inbox__item');
    const docIDs = checkedItems.map(function() {
        return $(this).find('.form-check-input').data('document-id');
    }).get();

    if (docIDs.length === 0) {
        alert("Please select at least one document to take action.");
        // Re-enable the button and exit
        $this.prop('disabled', false);
        return;
    }

    // Perform a single AJAX request with all document data
    $.ajax({
        url: bpath + "documents/inbox/multiple/action",
        type: "POST",
        data: {
            _token: _token,
            model_ass_type: model_ass_type,
            model_as: model_as,
            modal_message: modal_message,
            modal_scan_id_from: modal_scan_id_from,
            emp_List: emp_List,
            modal_action: modal_action,
            track_ids: docIDs,
        },
        success: function (data) {
            // Clear modal fields
            $("#modal_note").val("");
            $("#modal_scan_id").val("");
            $("#modal_assign_to_employee").val(null).trigger("change");
            $("#modal_action_select").val("");
            $("#modal_tracking_list").html("");

            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector("#modal_multiple_action"));
            mdl.hide();

            // Display a dynamic notification based on the action type
            let actionMessage;
            switch (parseInt(modal_action)) {
                case 6:
                    actionMessage = 'received';
                    break;
                case 8:
                    actionMessage = 'released';
                    break;
                case 5:
                    actionMessage = 'held';
                    break;
                case 4:
                    actionMessage = 'returned';
                    break;
                default:
                    actionMessage = 'processed';
                    break;
            }

            toastr.success('Documents have been ' + actionMessage + ' successfully!');
            loadInboxItems(currentPage, currentFilter, query);
            setActiveFilter(currentFilter); // Set the default active filter

            // Re-enable the button
            $this.prop('disabled', false);
        },
        error: function(xhr, status, error) {
            toastr.error('An error occurred: ' + error);

            // Re-enable the button
            $this.prop('disabled', false);
        }
    });
});
// Clear the Select2 dropdown and append the new options
function updateActionSelect(action) {
    // Get the select element
    const $actionSelect = $("#modal_action_select");

    // Clear all existing options
    $actionSelect.empty();

    // Dynamically append the options based on the action
    switch (action) {
        case 'release':
            $actionSelect.append('<option value="8">Release</option>');
            break;
        case 'receive':
            $actionSelect.append('<option value="6">Receive</option>');
            break;
        case 'hold':
            $actionSelect.append('<option value="5">Hold</option>');
            break;
        case 'return':
            $actionSelect.append('<option value="4">Return</option>');
            break;
        default:
            console.error('Unknown action:', action);
            break;
    }

    // Refresh the Select2 element to reflect the changes
    $actionSelect.trigger('change.select2');
}

