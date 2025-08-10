var bpath ;
var id;
var url;
var _token = $('meta[name="csrf-token"]').attr('content');
var timeout = null;
var base_url = window.location.origin;

$(document).ready(function() {

    //bpath = '{!! url() !!}';
    bpath = window.location.origin;
    url = window.location.pathname;
    id = url.substring(url.lastIndexOf('/') + 1);
    load_recipient_details(id);
    recipient_full_details(id);
    load_file_attachments();

    $('#user-search').on('input', function() {
        var searchText = $(this).val().toLowerCase();
        $('#recipientsData .intro-x').each(function() {
            var recipientName = $(this).find('.accordion-header').text().toLowerCase();
            if (recipientName.includes(searchText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    $('#user-transaction').on('input', function() {
        var searchText = $(this).val().toLowerCase();
        $('#recipient_table .intro-x').each(function() {
            var recipientName = $(this).find('.font-medium').text().toLowerCase();
            if (recipientName.includes(searchText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});

function load_file_attachments()
{
    let tracking_number = $('#tracking_number').val();

    $.ajax({
        url: bpath + '/track/load/attachments',
        type: "POST",
        data: { _token, tracking_number },
        success: function (response) {
            if(response)
            {
                let data = JSON.parse(response);

                let status = data['status'];

                let html_data = data['attachment_html'];

                $('#track_file_attachments').html(html_data);

            }
        }
    });
}

function load_recipient_details(id) {

    $.ajax({
        url: bpath + '/track/load/recipients',
        type: "POST",
        data: {
            _token: _token,
            track_number: id,
        },
        success: function (data) {
            var data = JSON.parse(data);

            //.log(data);
            // //.log(data.recipient_count);

            $("#recipient_table").html(data.get_recipients);
            $("#__author").html(data.created_by);
        }
    });
}

$("body").on('click', '#transaction_details', function (){

    let transaction_id = $(this).data('trans-id');
    let transaction_number = $(this).data('trans-number');
    let transaction_recipient = $(this).data('trans-recipient');
    let transaction_date = $(this).data('trans-date');
    let transaction_status = $(this).data('trans-status');
    let transaction_status_id = $(this).data('trans-statsid');
    let status_class = $(this).data('status-class');
    let transaction_note = $(this).data('trans-note');

    let transaction_sender = $(this).data('trans-sender');
    let date_acted = $(this).data('date-acted');

    // //.log(transaction_sender);

    $.ajax({
        url: bpath + '/track/load/sender',
        type: "POST",
        data: {
            _token: _token,
            transaction_id: transaction_id,
            transaction_sender:transaction_sender,
            transaction_number:transaction_number,
        },
        success: function (data) {
            var data = JSON.parse(data);

            let employee_name = data.employee_name;

            let transaction_data = load_transactions(transaction_id, transaction_number, transaction_recipient, transaction_date, transaction_status_id, transaction_status, status_class, transaction_note, employee_name, date_acted);

            $("#load_transaction_details").html(transaction_data);

        }
    });
});

function load_transactions(transaction_id, transaction_number, transaction_recipient, transaction_date, transaction_status_id, transaction_status, status_class, transaction_note, employee_name, date_acted){

    let data = '';

    if(transaction_status_id == 3)
    {
        data =  '<div class="flex items-center mt-3"><i class="fa-regular fa-user w-4 h-4 text-slate-500 -mt-1 mr-2"></i> From: <div class="ml-2">'+employee_name+'</div></div>'+
                '<div class="flex items-center mt-3"><i class="fa-regular fa-clipboard w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Tracking Number: <div class="underline decoration-dotted ml-1">'+transaction_number+'</div></div>'+
                '<div class="flex items-center mt-3"><i class="fa-regular fa-clock w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Released at: <div class="ml-2">'+date_acted+'</div></div>'+
                '<div class="flex items-center mt-3"><i class="fa-solid fa-clipboard-check w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Status: <span class="bg-'+status_class+'/20 text-'+status_class+' rounded px-2 ml-1">'+transaction_status+'</span></div>'
        ;

    }else if(transaction_status_id == 4)
    {
        transaction_status = "Returned";
        data =  '<div class="flex items-center mt-3"><i class="fa-regular fa-user w-4 h-4 text-slate-500 -mt-1 mr-2"></i> From: <div class="ml-2">'+transaction_recipient+'</div></div>'+
                '<div class="flex items-center mt-3"><i class="fa-regular fa-clipboard w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Tracking Number: <div class="underline decoration-dotted ml-1">'+transaction_number+'</div></div>'+
                '<div class="flex items-center mt-3"><i class="fa-regular fa-clock w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Received at: <div class="ml-2">'+date_acted+'</div></div>'+
                '<div class="flex items-center mt-3"><i class="fa-solid fa-clipboard-check w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Status: <span class="bg-'+status_class+'/20 text-'+status_class+' rounded px-2 ml-1">'+transaction_status+'</span></div>'+
                '<div class="flex items-center mt-3"><i class="fa-regular fa-comment w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Message: <div class="ml-2">'+transaction_note+'</div></div>'
        ;
    }else if(transaction_status_id == 5)
    {
        transaction_status = "Held";
        data =  '<div class="flex items-center mt-3"><i class="fa-regular fa-user w-4 h-4 text-slate-500 -mt-1 mr-2"></i> From: <div class="ml-2">'+transaction_recipient+'</div></div>'+
                '<div class="flex items-center mt-3"><i class="fa-regular fa-clipboard w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Tracking Number: <div class="underline decoration-dotted ml-1">'+transaction_number+'</div></div>'+
                '<div class="flex items-center mt-3"><i class="fa-regular fa-clock w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Received at: <div class="ml-2">'+date_acted+'</div></div>'+
                '<div class="flex items-center mt-3"><i class="fa-solid fa-clipboard-check w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Status: <span class="bg-'+status_class+'/20 text-'+status_class+' rounded px-2 ml-1">'+transaction_status+'</span></div>'+
                '<div class="flex items-center mt-3"><i class="fa-regular fa-comment w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Message: <div class="ml-2">'+transaction_note+'</div></div>'
        ;
    }else if(transaction_status_id == 6)
    {
        transaction_status = "Received";
        data =  '<div class="flex items-center mt-3"><i class="fa-regular fa-user w-4 h-4 text-slate-500 -mt-1 mr-2"></i> To: <div class="ml-2">'+transaction_recipient+'</div></div>'+
                '<div class="flex items-center mt-3"><i class="fa-regular fa-clipboard w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Tracking Number: <div class="underline decoration-dotted ml-1">'+transaction_number+'</div></div>'+
                '<div class="flex items-center mt-3"><i class="fa-regular fa-clock w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Received at: <div class="ml-2">'+date_acted+'</div></div>'+
                '<div class="flex items-center mt-3"><i class="fa-solid fa-clipboard-check w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Status: <span class="bg-'+status_class+'/20 text-'+status_class+' rounded px-2 ml-1">'+transaction_status+'</span></div>'+
                '<div class="flex items-center mt-3"><i class="fa-regular fa-comment w-4 h-4 text-slate-500 -mt-1 mr-2"></i> Message: <div class="ml-2">'+transaction_note+'</div></div>'
        ;
    }

    return  data;
}

$("body").on('click', '#btn_add_document_note', function (){

    let documents_note_title = $('#documents_note_title').val();
    let documents_note_message = $('#documents_note_message').val();
    let note_type = $(this).data('note-type');

    $.ajax({
        url: bpath + '/track/add/note',
        type: "POST",
        data: {
            _token: _token,
            tracking_number:id,
            note_type:note_type,
            documents_note_title:documents_note_title,
            documents_note_message:documents_note_message,
        },
        success: function(response) {
            var data = JSON.parse(response);

            if (data.status == 200)
            {
                const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#add_docs_note'));
                mdl.hide();

                $('#documents_note_title').val('');
                $('#documents_note_message').val('');
                location.reload();

                // __notif_load_data(__basepath + "/");
            }
        }
    });

});

$("body").on('click', '#remove_document_note', function (){

    let note_id = $(this).data('nt-no');


    swal({
        title: 'Are you sure to dismiss?',
        text: "This action cannot be undone.",
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1e40af',
        cancelButtonColor: '#6e6e6e',
        confirmButtonText: '<i class="icofont-trash w-3 h-3 mr-2"></i>Yes',


        preConfirm:function(){

        }}).then((result) => {
            if (result.value == true) {
                $.ajax({
                    url: bpath + '/track/remove/note',
                    type: "POST",
                    data: {
                        _token:_token,
                        note_id:note_id,

                    },
                    success: function(data) {

                        // var data = JSON.parse(data);

                        location.reload();

                        // __notif_load_data(__basepath + "/");
                    }
                });



            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swal({
                    title:"Cancelled",
                    text:"No action taken!",
                    type:"error",
                    confirmButtonColor: '#1e40af',
                    confirmButtonColor: '#1e40af',
                    timer: 500
                });

            }
        });





});

function search_documents(val) {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(function() {
        var track_number = $("#scan_document_track").val();

        open_confirmation_modal(track_number);

    }, 500);
}

function open_confirmation_modal(track_number)
{
    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#confirmation_modal'));
    mdl.toggle();
}

$("body").on('click', '#btn_ok_open_new_tab', function (){

    var track_number = $("#scan_document_track").val();
    let url = base_url+'/track/doctrack/'+track_number;

    // //.log(url);

    window.open(url, "_self");
});

$("body").on('click', '#btn_cancel__', function (){

    $("#scan_document_track").val("");
    document.getElementById("scan_document_track").focus();

});

function recipient_full_details(id) {
    $.ajax({
        url: bpath + '/track/load/recipients/full/details',
        type: "POST",
        data: {
            _token: _token,
            track_number: id,
        },
        success: function (data) {
            var responseData = JSON.parse(data);
            var userData = responseData.userData;
            // console.log(userData);
            $('#recipientsData').empty();
            for (var targetUserId in userData) {
                if (userData.hasOwnProperty(targetUserId)) {
                    var userDetails = userData[targetUserId];
                    
                    // Determine the fullname or fallback to target_user_id
                    var fullname = userDetails.additionalData.fullname ? userDetails.additionalData.fullname : userDetails.additionalData.target_user_id;
                    
                    // Determine the status text and class
                    var statusText, statusClass;
                    if (userDetails.additionalData.status === 'Received late') {
                        statusText = 'pending';
                        statusClass = 'text-pending';
                    } else if (userDetails.additionalData.status === 'Received on time') {
                        statusText = 'success';
                        statusClass = 'text-success';
                    } else if (userDetails.additionalData.status === 'Not yet received') {
                        statusText = 'danger';
                        statusClass = 'text-danger';
                    } else {
                        statusText = 'primary';
                        statusClass = 'text-primary';
                    }
        
                    // Determine the received date text
                    var receivedDateText = userDetails.additionalData.receivedDate ? 'Received Date: ' + userDetails.additionalData.receivedDate + '<br>' +
                        'Days Since Received: ' + userDetails.additionalData.receivedReleasedDifference : 'Waiting to receive';
        
                    var userHtml = '<div class="intro-x">' +
                            '<div class="box px-5 py-3 mb-3 flex items-center zoom-in">' +
                                '<div class="ml-1 mr-auto w-2/3">' +
                                    '<div id="faq-accordion-1" class="accordion">' +
                                        '<div class="accordion-item">' +
                                            '<div id="faq-accordion-content-2" class="accordion-header"> <button class="accordion-button collapsed" type="button" data-tw-toggle="collapse" data-tw-target="#faq-accordion-collapse-2" aria-expanded="false" aria-controls="faq-accordion-collapse-2"> ' + fullname + ' #' + userDetails.additionalData.target_user_id + ' </button> </div>' +
                                            '<div id="faq-accordion-collapse-2" class="accordion-collapse collapse" aria-labelledby="faq-accordion-content-2" data-tw-parent="#faq-accordion-1">' +
                                                '<div class="accordion-body text-slate-600 dark:text-slate-500 leading-relaxed">' + 
                                                    '<div class="text-slate-500 text-xs mt-0.5">Release Date: ' + userDetails.additionalData.releasedDate + '</div>' +
                                                    '<div class="text-slate-500 text-xs mt-0.5">' + receivedDateText + '</div>' +
                                                    '<div class="text-slate-500 text-xs mt-0.5">Duration Since Release: ' + userDetails.additionalData.durationSinceRelease + '</div>' +
                                                    '<div class="text-slate-500 text-xs mt-0.5">Should Receive Before: ' + userDetails.additionalData.shouldRecieveBefore + '</div>' +
                                                    '<div class="text-slate-500 text-xs mt-0.5">Released By: ' + userDetails.additionalData.releasedByFullnames.map(function(release) {
                                                        return release.fullname + ' (' + release.created_at + ')';
                                                    }).join(', ') + '</div>' + // Include releasedByFullnames here with created_at timestamp
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="' + statusClass + ' w-1/3">' + userDetails.additionalData.status + '</div>' +
                            '</div>' +
                        '</div>';

                    // Append the HTML to the recipientsData div
                    $('#recipientsData').append(userHtml);
                }
            }
        }
        
        
        
        
        
    });
}