var timeout = null;
var _token = $('meta[name="csrf-token"]').attr("content");
var base_url = window.location.origin;

$(document).ready(function () {
    bpath = __basepath + "/";
    load_initialize();
});

function load_initialize() {
    try {
        emp_List = $("#scan_emp_List").select2({
            placeholder: "",
            allowClear: true,
            closeOnSelect: false,
        });

        /***/
    } catch (err) {}
}

function doDelayedSearch(val) {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
        var doc_key = $("#search_scan_document").val();

        loadqrinfo(doc_key);
    }, 500);
}

function loadqrinfo(docID) {
    $.ajax({
        url: bpath + "documents/scanner/take/action/viaqr",
        type: "POST",
        data: {
            _token: _token,
            docID: docID,
        },
        success: function (response) {
            var data = JSON.parse(response);

            if (data.hasUser == "true") {
                if (data.getfile) {
                    //incoming_Receivedocs(docID);

                    ////.log(data);.log(docID);
                    //swal_file_file_found(data);
                    swal_to_track_file(data);
                } else {
                    swal_file_no_file_found("");
                }
            } else {
                swal_if_not_loggedin(data);
            }

            // __notif_load_data(__basepath + "/");
        },
    });
}

function swal_for_action_qr(docID) {
    swal({
        title: "Receive Document",
        text: "choose action to proceed.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: "Done",
        footer:
            '<a href="' +
            base_url +
            "/track/doctrack/" +
            docID +
            '" target="_blank">View Track Record</a>',
        html:
            "<div>" +
            '<div class="mr-2">' +
            '<label class="form-label w-full flex flex-col sm:flex-row">Tracking Number <span class="sm:ml-auto mt-1 sm:mt-0 text-xs text-slate-500"></span></label>' +
            '<input id="send_DocCode" disabled name="send_DocCode" type="text" value="' +
            docID +
            '" class="form-control">' +
            "</div>" +
            "</div>" +
            "<div>" +
            '<div class="intro-x mt-8">' +
            '<input id="username_txt" type="text" onkeyup="fucosOnpassword(this.value)" class="intro-x login__input form-control py-3 px-4 block  is-invalid @enderror" name="username"  required autofocus autocomplete="username" autofocus placeholder="Scan your DSSC officail Identification Card!">' +
            '<input id="password_txt" type="password"  class="intro-x login__input form-control py-3 px-4 block mt-4  is-invalid @enderror" name="password" required autocomplete="current-password" placeholder="Password">' +
            "</div>" +
            "</div>",
        preConfirm: function () {
            username_txt = $("#username_txt").val();
            password_txt = $("#password_txt").val();
            if (username_txt == "") {
                Swal.showValidationMessage(`Please enter login and password`);
            }
        },
    }).then((result) => {
        if (result.value == true) {
            var acpre = "";
            var acpass = "";
            if (swal_receive_action == 6) {
                acpre = "Receive";
                acpass = "Received";
            } else if (swal_receive_action == 5) {
                acpre = "Hold";
                acpass = "Hold";
            } else {
                acpre = "Return";
                acpass = "Returned";
            }

            swal({
                title: "Document is now on " + acpre + "!",
                text: "Document successfully " + acpass + "!",
                type: "success",
                confirmButtonColor: "#1e40af",
            });
            //Action
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swal({
                title: "Cancelled",
                text: "No action taken!",
                type: "error",
                confirmButtonColor: "#1e40af",
            });
            //Action
        }
    });

    setTimeout(function () {
        document.getElementById("username_txt").focus();
    }, 500);
}

function swal_file_no_file_found(data) {
    swal({
        confirmButtonColor: "#1e40af",
        type: "error",
        html:
            '<div class="error-page flex flex-col lg:flex-row items-center justify-center text-center lg:text-left">' +
            '<div class="text-black text-center">' +
            '<div class="intro-x text-8xl font-medium">404</div>' +
            '<div class="intro-x text-xl lg:text-3xl font-medium mt-5">Oops. Document not found!.</div>' +
            '<div class="intro-x text-lg mt-3">This document code is either invalid or the document has been deleted!</div>' +
            "</div>" +
            "</div>",
        footer: '<a  href="https://www.facebook.com/DSSCICTCOfficial" target="_blank">Are you facing any issue? <span class="text-primary">Contact ICTC team!</span> </a>',
    });
}

function swal_to_track_file(data) {
    trackNumber = data["getfile"]["track_number"];
    status_class = data["getfile"]["get_doc_status"]["class"];
    doc_status = data["getfile"]["get_doc_status"]["name"];

    swal({
        title: "Document QR Code",
        type: "info",
        confirmButtonColor: "#1e40af",
        html:
            '<div class="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">' +
            "<div>" +
            '<div class="p-5">' +
            '<div class="p-5 image-fit zoom-in">' +
            '<div id="qrcode" class="mt-4 flex justify-center rounded-md"></div>' +
            "</div>" +
            '<div class="text-slate-600 dark:text-slate-500 mt-5">' +
            '<div class="flex items-center"> Tracking Number: <span class="ml-2">' +
            trackNumber +
            "</span> </div>" +
            '<div class="flex items-center mt-2">  Status: <span class="bg-' +
            status_class +
            "/20 text-" +
            status_class +
            ' rounded px-2 ml-1">' +
            doc_status +
            "</span> </div>" +
            "</div>" +
            "</div>" +
            '<div class="flex justify-center lg:justify-end items-center p-5 border-t border-slate-200/60 dark:border-darkmode-400">' +
            '<a class="flex items-center text-primary mr-auto" href="' +
            base_url +
            "/track/doctrack/" +
            trackNumber +
            '" target="_blank"> <i class="fa fa-map-marked w-4 h-4 mr-2 text-primary"></i> Track </a>' +
            '<a class="flex items-center mr-3" href="' +
            base_url +
            "/print-qr/" +
            trackNumber +
            '" target="_blank"> <i class="fa fa-print w-4 h-4 mr-2 text-primary"></i> Print </a>' +
            "</div>" +
            "</div>" +
            "</div>",
    });

    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: trackNumber,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
    });
}

function swal_file_file_found(data) {
    ////.log(data);.log(data);
    swal({
        confirmButtonColor: "#1e40af",
        html:
            ' <div class="intro-y col-span-12 md:col-span-6 xl:col-span-4 ">' +
            '<div class="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4">' +
            '<div class="ml-3 mr-auto text-left">' +
            '<a href="" class="font-medium">' +
            data["getfile"]["name"].toUpperCase() +
            "</a>" +
            '<div class="flex text-slate-500 truncate text-xs mt-0.5"> <a class="text-primary inline-block truncate" href="">' +
            data["getfile"]["get_doc_type_submitted"]["type"] +
            '</a> <span class="mx-1">•</span> ' +
            data["getfile"]["created_at"] +
            " </div>" +
            "</div>" +
            "</div>" +
            '<div class="p-5 text-left">' +
            '<a href="" class="block font-medium text-base mt-5">Status</a>' +
            '<div class="text-slate-600 dark:text-slate-500 mt-2 ">' +
            data["getfile"]["get_doc_status"]["name"] +
            "</div>" +
            '<a href="" class="block font-medium text-base mt-5">Created by</a>' +
            '<div class="text-slate-600 dark:text-slate-500 mt-2">' +
            data["getfile"]["get_author"]["firstname"] +
            " " +
            data["getfile"]["get_author"]["lastname"] +
            "</div>" +
            '<a href="" class="block font-medium text-base mt-5">' +
            data["getfile"]["get_doc_type"]["doc_type"] +
            "</a>" +
            '<div class="text-slate-600 dark:text-slate-500 mt-2">' +
            data["getfile"]["get_doc_level"]["doc_level"] +
            "</div>" +
            '<div class="text-left mt-5" class="mt-3"> <label for="regular-form-3" class="form-label">Scan ID</label> <select id="selected_action" class="form-select mt-2 sm:mr-2" aria-label="Default select example">' +
            '<option value="6">Receive</option>' +
            '<option value="6">Hold</option>' +
            '<option value="4">Return</option>' +
            "</select>" +
            '<div class="form-help">Scan you official DSSC ID card.</div>' +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>",
        preConfirm: function () {
            selected_action = $("#selected_action").val();

            ////.log(data);.log(selected_action);
        },
    });
}

function swal_if_not_loggedin(data) {
    swal({
        confirmButtonColor: "#1e40af",
        html:
            ' <div class="intro-y col-span-12 md:col-span-6 xl:col-span-4 ">' +
            '<div class="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4">' +
            '<div class="ml-3 mr-auto text-left">' +
            '<a href="" class="font-medium">' +
            data["getfile"]["name"].toUpperCase() +
            "</a>" +
            '<div class="flex text-slate-500 truncate text-xs mt-0.5"> <a class="text-primary inline-block truncate" href="">' +
            data["getfile"]["get_doc_type_submitted"]["type"] +
            '</a> <span class="mx-1">•</span> ' +
            data["getfile"]["created_at"] +
            " </div>" +
            "</div>" +
            "</div>" +
            '<div class="p-5 text-left">' +
            '<a href="" class="block font-medium text-base mt-5">Status</a>' +
            '<div class="text-slate-600 dark:text-slate-500 mt-2 ">' +
            data["getfile"]["get_doc_status"]["name"] +
            "</div>" +
            '<a href="" class="block font-medium text-base mt-5">Created by</a>' +
            '<div class="text-slate-600 dark:text-slate-500 mt-2">' +
            data["getfile"]["get_author"]["firstname"] +
            " " +
            data["getfile"]["get_author"]["lastname"] +
            "</div>" +
            '<a href="" class="block font-medium text-base mt-5">' +
            data["getfile"]["get_doc_type"]["doc_type"] +
            "</a>" +
            '<div class="text-slate-600 dark:text-slate-500 mt-2">' +
            data["getfile"]["get_doc_level"]["doc_level"] +
            "</div>" +
            "</div>" +
            '<div class="text-left" class="mt-3"> <label for="regular-form-3" class="form-label">Scan ID</label> <input id="scanned_id_username" type="email" class="form-control" placeholder="ID">' +
            '<div class="form-help">Scan you official DSSC ID card.</div>' +
            '<div class="text-left" class="mt-3"> <label for="regular-form-3" class="form-label">Enter Passoword</label> <input id="password_txt" type="password" class="form-control" placeholder="Password">' +
            '<div class="form-help">Please enter your password.</div>' +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>",
        preConfirm: function () {
            from_qr_id = $("#scanned_id_username").val();

            if (from_qr_id == "") {
                Swal.showValidationMessage(`Please scan your DSSC ID.`);
                document.getElementById("scanned_id").focus();
            } else {
            }
        },
    });
    fucosOnpassword("");
}

var timeout = null;

function fucosOnpassword(val) {
    if (timeout) {
        clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
        document.getElementById("scanned_id_username").focus();
    }, 500);
}

$("body").on("click", "#add_note_modal_button", function () {
    let modal_note_title = $("#modal_note_title").val();
    let modal_not_message = $("#modal_not_message").val();

    $.ajax({
        url: bpath + "documents/scanner/add/note",
        type: "POST",
        data: {
            _token: _token,
            modal_note_title: modal_note_title,
            modal_not_message: modal_not_message,
        },
        success: function (data) {
            var data = JSON.parse(data);

            ////.log(data);
            __notif_load_data(__basepath + "/");
            const mdl = tailwind.Modal.getOrCreateInstance(
                document.querySelector("#add_new_note")
            );
            mdl.hide();
            $("#modal_note_title").val("");
            $("#modal_not_message").val("");
            //$('.load_important_notes').load(location.href+' .load_important_notes');
            location.reload();
        },
    });
});

$("body").on("click", "#remove_note", function () {
    let note_id = $("#note_id").val();

    $.ajax({
        url: bpath + "documents/scanner/remove/note",
        type: "POST",
        data: {
            _token: _token,
            note_id: note_id,
        },
        success: function (data) {
            var data = JSON.parse(data);
            location.reload();

            __notif_load_data(__basepath + "/");
        },
    });
});

//mao ni akong nahuman ron
$("body").on("click", "#div_scanner_receive", function () {
    swal({
        title: "Receive Document",
        text: "choose action to proceed.",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: '<i class="icofont-inbox w-3 h-3 mr-2"></i>Done',
        allowOutsideClick: false,
        allowEscapeKey: false,

        html:
            '<div class="intro-y col-span-12 md:col-span-6 lg:col-span-4">' +
            '<div class=" text-center">' +
            '<div class="flex pt-5">' +
            "</div>" +
            '<div class="text-center lg:text-left pb-5 pt-5">' +
            '<input onkeyup="search_for_document(this.value)" autocomplete="off" id="search_scan_documet_receive" autofocus type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" placeholder="Document Scanner"></input>' +
            '<input hidden id="swal_valid"  type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" ></input>' +
            '<input hidden id="on_click_status"  type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" value="6" ></input>' +
            "</div>" +
            '<div class="col-span-12 lg:col-span-8 xl:col-span-4 mt-2">' +
            '<div class="intro-y flex items-center h-10">' +
            '<h2 id="swal_title" class="text-lg font-medium truncate mr-5">' +
            "Please scan a valid QR code!" +
            "</h2>" +
            "</div>" +
            '<div id="load_file_history" class="mt-2">' +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>",
        preConfirm: function () {
            search_scan_documet_receive = $(
                "#search_scan_documet_receive"
            ).val();
            check = $("#swal_valid").val();

            if (check == 0) {
                Swal.showValidationMessage(`This code is invalid or deleted!`);
            }
        },
    }).then((result) => {
        if (result.value == true) {
            //Action
            //get document details

            $.ajax({
                url: bpath + "documents/scanner/receive/details/6",
                type: "POST",
                data: {
                    _token: _token,
                    search_scan_documet_receive: search_scan_documet_receive,
                },
                success: function (data) {
                    var data = JSON.parse(data);
                    ////.log(data['getDoc']);

                    $("#model_track_number").text(
                        " " + data["getDoc"]["track_number"]
                    );
                    $("#model_document_name").text(
                        " " + data["getDoc"]["name"]
                    );
                    $("#model_document_desc").text(
                        " " + data["getDoc"]["desc"]
                    );
                    $("#model_document_as").text("Receive as");
                    $("#model_document_from").text("Receive from");
                    $("#modal_action").val("6");
                    $("#model_track_number_inp").val(
                        "" + data["getDoc"]["track_number"]
                    );

                    document.querySelector("#modal_action_btn").innerText =
                        "Receive";
                    document.querySelector("#modal_title_text").innerHTML =
                        "Receive Document";

                    $("#emp_List").val(null).trigger("change");

                    const mdl = tailwind.Modal.getOrCreateInstance(
                        document.querySelector("#modal_scan_action")
                    );
                    mdl.toggle();
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swal({
                title: "Cancelled",
                text: "No action taken!",
                type: "error",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                showCancelButton: false,
                showConfirmButton: false,
                timer: 800,
            });
            //Action
        }
    });

    document.getElementById("search_scan_documet_receive").focus();
});

function receive_action(data, track_id) {
    var doc_track = data["getDoc"]["track_number"];
    var optionValue = data["option_Value"];

    swal({
        title: "Receive Document",
        text: "choose action to proceed.",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: '<i class="icofont-inbox w-3 h-3 mr-2"></i>Done',
        allowOutsideClick: false,
        allowEscapeKey: false,
        html:
            '<div class="intro-y col-span-12 md:col-span-6 lg:col-span-4">' +
            '<div class=" text-center">' +
            '<div class="flex pt-5">' +
            '<div class="w-full flex flex-col lg:flex-row items-center">' +
            '<div class="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">' +
            '<div class="text-slate-500 text-xs mt-0.5">Track Number</div>' +
            '<a href="javascript:;" class="font-medium">' +
            data["getDoc"]["track_number"] +
            "</a>" +
            "</div>" +
            "</div>" +
            "</div>" +
            '<div class="text-center lg:text-left pb-5 pt-5">' +
            '<div class="text-slate-500 text-xs mt-2">Title</div>' +
            '<div class="font-medium">' +
            data["getDoc"]["name"] +
            "</div>" +
            '<div class="text-slate-500 text-xs mt-2">Description</div>' +
            '<div class="">' +
            data["getDoc"]["desc"] +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">Receive as</label>' +
            '<select id="doc_sendAs" name="doc_sendAs" data-placeholder="Select your action" class="form-select mt-1 zoom-in">' +
            optionValue +
            "</select>" +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-2 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">Note</label>' +
            '<textarea id="swal_receive_message" class="form-control swal_receive_message mt-1 zoom-in" name="swal_receive_message" placeholder="Add a message" value=""></textarea>' +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-2 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">From (has official ID)</label>' +
            '<input autocomplete="off" id="scan_id_receive_from" autofocus type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" placeholder="Scan official ID (Optional)"></input>' +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-2 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">Action</label>' +
            '<select id="swal_receive_action" name="swal_receive_action" data-placeholder="Select your action" class="form-select mt-1 swal_receive_message zoom-in">' +
            '<option value="6"> Receive</option>' +
            "</select>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>",
        preConfirm: function () {
            doc_sendAstype = $("#doc_sendAs")
                .find(":selected")
                .data("ass-type");
            doc_sendAs = $("#doc_sendAs").val();
            swal_receive_message = $("#swal_receive_message").val();
            swal_receive_action = $("#swal_receive_action").val();
        },
    }).then((result) => {
        if (result.value == true) {
            var acpre = "";
            var acpass = "";
            if (swal_receive_action == 6) {
                acpre = "Receive";
                acpass = "Received";
            } else if (swal_receive_action == 5) {
                acpre = "Hold";
                acpass = "Hold";
            } else {
                acpre = "Return";
                acpass = "Returned";
            }

            swal({
                text: "Document is now on " + acpre + " files!",
                title: "Document successfully " + acpass + "!",
                type: "success",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                timer: 800,
            });

            //Action
            $.ajax({
                url: bpath + "documents/scanner/receive/action",
                type: "POST",
                data: {
                    _token: _token,
                    track_id: track_id,
                    doc_sendAstype: doc_sendAstype,
                    doc_sendAs: doc_sendAs,
                    swal_receive_message: swal_receive_message,
                    swal_receive_action: swal_receive_action,
                },
                success: function (data) {
                    var data = JSON.parse(data);
                    ////////.log(data);.log(data);
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swal({
                title: "Cancelled",
                text: "No action taken!",
                type: "error",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                timer: 500,
            });
            //Action
        }
    });
}

//humana nako dre
$("body").on("click", "#div_scanner_release", function () {
    swal({
        title: "Release Document",
        text: "choose action to proceed.",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: '<i class="icofont-upload w-3 h-3 mr-2"></i>Done',
        allowOutsideClick: false,
        allowEscapeKey: false,

        html:
            '<div class="intro-y col-span-12 md:col-span-6 lg:col-span-4">' +
            '<div class=" text-center">' +
            '<div class="flex pt-5">' +
            "</div>" +
            '<div class="text-center lg:text-left pb-5 pt-5">' +
            '<input onkeyup="search_for_document(this.value)" autocomplete="off" id="search_scan_documet_receive" autofocus type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" placeholder="Document Scanner"></input>' +
            '<input hidden id="swal_valid"  type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" ></input>' +
            '<input hidden id="on_click_status"  type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" value="8" ></input>' +
            "</div>" +
            '<div class="col-span-12 lg:col-span-8 xl:col-span-4 mt-2">' +
            '<div class="intro-y flex items-center h-10">' +
            '<h2 id="swal_title" class="text-lg font-medium truncate mr-5">' +
            "Please scan a valid QR code!" +
            "</h2>" +
            "</div>" +
            '<div id="load_file_history" class="mt-2">' +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>",
        preConfirm: function () {
            search_scan_documet_receive = $(
                "#search_scan_documet_receive"
            ).val();
            check = $("#swal_valid").val();

            if (check == 0) {
                Swal.showValidationMessage(`This code is invalid or deleted!`);
            }
        },
    }).then((result) => {
        if (result.value == true) {
            //Action
            //get document details
            $.ajax({
                url: bpath + "documents/scanner/receive/details/8",
                type: "POST",
                data: {
                    _token: _token,
                    search_scan_documet_receive: search_scan_documet_receive,
                },
                success: function (data) {
                    var data = JSON.parse(data);
                    //////.log(data);.log(data['getDoc']);

                    $("#model_track_number").text(
                        " " + data["getDoc"]["track_number"]
                    );
                    $("#model_document_name").text(
                        " " + data["getDoc"]["name"]
                    );
                    $("#model_document_desc").text(
                        " " + data["getDoc"]["desc"]
                    );
                    $("#model_document_as").text("Release as");
                    $("#model_document_from").text("Release to");
                    $("#modal_action").val("8");
                    $("#model_track_number_inp").val(
                        "" + data["getDoc"]["track_number"]
                    );

                    document.querySelector("#modal_action_btn").innerText =
                        "Release";
                    document.querySelector("#modal_title_text").innerHTML =
                        "Release Document";
                    $("#scan_emp_List").val(null).trigger("change");

                    const mdl = tailwind.Modal.getOrCreateInstance(
                        document.querySelector("#modal_scan_action")
                    );
                    mdl.toggle();
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swal({
                title: "Cancelled",
                text: "No action taken!",
                type: "error",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                showCancelButton: false,
                showConfirmButton: false,
                timer: 800,
            });
            //Action
        }
    });

    document.getElementById("search_scan_documet_receive").focus();
});

function realese_action(data, track_id) {
    var doc_track = data["getDoc"]["track_number"];
    var optionValue = data["option_Value"];
    var release_to = data["release_to"];

    swal({
        title: "Release Document",
        text: "choose action to proceed.",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: '<i class="icofont-inbox w-3 h-3 mr-2"></i>Done',
        allowOutsideClick: false,
        allowEscapeKey: false,
        html:
            '<div class="intro-y col-span-12 md:col-span-6 lg:col-span-4">' +
            '<div class=" text-center">' +
            '<div class="flex pt-5">' +
            '<div class="w-full flex flex-col lg:flex-row items-center">' +
            '<div class="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">' +
            '<div class="text-slate-500 text-xs mt-0.5">Track Number</div>' +
            '<a href="javascript:;" class="font-medium">' +
            data["getDoc"]["track_number"] +
            "</a>" +
            "</div>" +
            "</div>" +
            "</div>" +
            '<div class="text-center lg:text-left pb-5 pt-5">' +
            '<div class="text-slate-500 text-xs mt-2">Title</div>' +
            '<div class="font-medium">' +
            data["getDoc"]["name"] +
            "</div>" +
            '<div class="text-slate-500 text-xs mt-2">Description</div>' +
            '<div class="">' +
            data["getDoc"]["desc"] +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">Receive as</label>' +
            '<select id="doc_sendAs" name="doc_sendAs" data-placeholder="Select your action" class="form-select mt-1 zoom-in">' +
            optionValue +
            "</select>" +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-2 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">Note</label>' +
            '<textarea id="swal_receive_message" class="form-control swal_receive_message mt-1 zoom-in" name="swal_receive_message" placeholder="Add a message" value=""></textarea>' +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start mt-3">' +
            '<label for="post-form-5" class="text-slate-500 text-xs mt-0.5">Release to: (has trail)</label>' +
            '<select id="swal_release_to" name="swal_release_to" data-placeholder="Person on trail;" class="form-select mt-2  swal_release_to zoom-in">' +
            '<option data-ass-type="group" value=""></option>' +
            release_to +
            "</select>" +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-2 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">To (has official ID)</label>' +
            '<input autocomplete="off" id="scan_id_release_to" autofocus type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" placeholder="Scan official ID (Optional)"></input>' +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-2 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">Action</label>' +
            '<select id="swal_receive_action" name="swal_receive_action" data-placeholder="Select your action" class="form-select mt-1 swal_receive_message zoom-in">' +
            '<option value="8"> Release</option>' +
            "</select>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>",
        preConfirm: function () {
            doc_sendAstype = $("#doc_sendAs")
                .find(":selected")
                .data("ass-type");
            doc_sendAs = $("#doc_sendAs").val();
            swal_receive_message = $("#swal_receive_message").val();
            swal_receive_action = $("#swal_receive_action").val();
        },
    }).then((result) => {
        if (result.value == true) {
            var acpre = "";
            var acpass = "";
            if (swal_receive_action == 6) {
                acpre = "Receive";
                acpass = "Received";
            } else if (swal_receive_action == 5) {
                acpre = "Hold";
                acpass = "Hold";
            } else {
                acpre = "Return";
                acpass = "Returned";
            }

            swal({
                text: "Document is now on " + acpre + " files!",
                title: "Document successfully " + acpass + "!",
                type: "success",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                timer: 800,
            });

            //Action
            $.ajax({
                url: bpath + "documents/scanner/release/action",
                type: "POST",
                data: {
                    _token: _token,
                    track_id: track_id,
                    doc_sendAstype: doc_sendAstype,
                    doc_sendAs: doc_sendAs,
                    swal_receive_message: swal_receive_message,
                    swal_receive_action: swal_receive_action,
                },
                success: function (data) {
                    var data = JSON.parse(data);
                    ////////.log(data);.log(data);
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swal({
                title: "Cancelled",
                text: "No action taken!",
                type: "error",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                timer: 500,
            });
            //Action
        }
    });
}

//humana nako dre
$("body").on("click", "#div_scanner_hold", function () {
    swal({
        title: "Hold Document",
        text: "choose action to proceed.",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: '<i class="icofont-upload w-3 h-3 mr-2"></i>Done',
        allowOutsideClick: false,
        allowEscapeKey: false,

        html:
            '<div class="intro-y col-span-12 md:col-span-6 lg:col-span-4">' +
            '<div class=" text-center">' +
            '<div class="flex pt-5">' +
            "</div>" +
            '<div class="text-center lg:text-left pb-5 pt-5">' +
            '<input onkeyup="search_for_document(this.value)" autocomplete="off" id="search_scan_documet_receive" autofocus type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" placeholder="Document Scanner"></input>' +
            '<input hidden id="swal_valid"  type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" ></input>' +
            '<input hidden id="on_click_status"  type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" value="5" ></input>' +
            "</div>" +
            '<div class="col-span-12 lg:col-span-8 xl:col-span-4 mt-2">' +
            '<div class="intro-y flex items-center h-10">' +
            '<h2 id="swal_title" class="text-lg font-medium truncate mr-5">' +
            "Please scan a valid QR code!" +
            "</h2>" +
            "</div>" +
            '<div id="load_file_history" class="mt-2">' +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>",
        preConfirm: function () {
            search_scan_documet_receive = $(
                "#search_scan_documet_receive"
            ).val();
            check = $("#swal_valid").val();

            if (check == 0) {
                Swal.showValidationMessage(`This code is invalid or deleted!`);
            }
        },
    }).then((result) => {
        if (result.value == true) {
            //Action
            //get document details
            $.ajax({
                url: bpath + "documents/scanner/receive/details/5",
                type: "POST",
                data: {
                    _token: _token,
                    search_scan_documet_receive: search_scan_documet_receive,
                },
                success: function (data) {
                    var data = JSON.parse(data);
                    //////.log(data);.log(data['getDoc']);

                    $("#model_track_number").text(
                        " " + data["getDoc"]["track_number"]
                    );
                    $("#model_document_name").text(
                        " " + data["getDoc"]["name"]
                    );
                    $("#model_document_desc").text(
                        " " + data["getDoc"]["desc"]
                    );
                    $("#model_document_as").text("Hold as");
                    $("#model_document_from").text("Holder");
                    $("#modal_action").val("5");
                    $("#model_track_number_inp").val(
                        "" + data["getDoc"]["track_number"]
                    );

                    document.querySelector("#modal_action_btn").innerText =
                        "Hold";
                    document.querySelector("#modal_title_text").innerHTML =
                        "Hold Document";
                    $("#scan_emp_List").val(null).trigger("change");

                    const mdl = tailwind.Modal.getOrCreateInstance(
                        document.querySelector("#modal_scan_action")
                    );
                    mdl.toggle();
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swal({
                title: "Cancelled",
                text: "No action taken!",
                type: "error",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                showCancelButton: false,
                showConfirmButton: false,
                timer: 800,
            });
            //Action
        }
    });

    //document.getElementById('search_scan_documet_receive').focus();
    let docID = $(this).data("trk-no");
    if (docID) {
        $("#search_scan_documet_receive").val("" + docID);
    }
    document.getElementById("search_scan_documet_receive").focus();
});

function hold_action(data, track_id) {
    var doc_track = data["getDoc"]["track_number"];
    var optionValue = data["option_Value"];
    var release_to = data["release_to"];

    swal({
        title: "Hold Document",
        text: "choose action to proceed.",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: '<i class="icofont-inbox w-3 h-3 mr-2"></i>Done',
        allowOutsideClick: false,
        allowEscapeKey: false,
        html:
            '<div class="intro-y col-span-12 md:col-span-6 lg:col-span-4">' +
            '<div class=" text-center">' +
            '<div class="flex pt-5">' +
            '<div class="w-full flex flex-col lg:flex-row items-center">' +
            '<div class="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">' +
            '<div class="text-slate-500 text-xs mt-0.5">Track Number</div>' +
            '<a href="javascript:;" class="font-medium">' +
            data["getDoc"]["track_number"] +
            "</a>" +
            "</div>" +
            "</div>" +
            "</div>" +
            '<div class="text-center lg:text-left pb-5 pt-5">' +
            '<div class="text-slate-500 text-xs mt-2">Title</div>' +
            '<div class="font-medium">' +
            data["getDoc"]["name"] +
            "</div>" +
            '<div class="text-slate-500 text-xs mt-2">Description</div>' +
            '<div class="">' +
            data["getDoc"]["desc"] +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">hold as</label>' +
            '<select id="doc_sendAs" name="doc_sendAs" data-placeholder="Select your action" class="form-select mt-1 zoom-in">' +
            optionValue +
            "</select>" +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-2 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">Note</label>' +
            '<textarea id="swal_hold_message" class="form-control swal_hold_message mt-1 zoom-in" name="swal_hold_message" placeholder="Add a message" value=""></textarea>' +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-2 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">Action</label>' +
            '<select id="swal_hold_action" name="swal_hold_action" data-placeholder="Select your action" class="form-select mt-1 swal_hold_message zoom-in">' +
            '<option value="5"> Held</option>' +
            "</select>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>",
        preConfirm: function () {
            doc_sendAstype = $("#doc_sendAs")
                .find(":selected")
                .data("ass-type");
            doc_sendAs = $("#doc_sendAs").val();
            swal_hold_message = $("#swal_hold_message").val();
            swal_hold_action = $("#swal_hold_action").val();
        },
    }).then((result) => {
        if (result.value == true) {
            var acpre = "";
            var acpass = "";
            if (swal_hold_action == 6) {
                acpre = "Receive";
                acpass = "Received";
            } else if (swal_hold_action == 5) {
                acpre = "Hold";
                acpass = "Hold";
            } else {
                acpre = "Return";
                acpass = "Returned";
            }

            swal({
                text: "Document is now on " + acpre + " files!",
                title: "Document successfully " + acpass + "!",
                type: "success",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                timer: 800,
            });

            //Action
            $.ajax({
                url: bpath + "documents/scanner/hold/action",
                type: "POST",
                data: {
                    _token: _token,
                    track_id: track_id,
                    doc_sendAstype: doc_sendAstype,
                    doc_sendAs: doc_sendAs,
                    swal_hold_message: swal_hold_message,
                    swal_hold_action: swal_hold_action,
                },
                success: function (data) {
                    var data = JSON.parse(data);
                    ////////.log(data);.log(data);
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swal({
                title: "Cancelled",
                text: "No action taken!",
                type: "error",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                timer: 500,
            });
            //Action
        }
    });
}

//humanaaaaa
$("body").on("click", "#div_scanner_return", function () {
    swal({
        title: "Return Document",
        text: "choose action to proceed.",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: '<i class="icofont-upload w-3 h-3 mr-2"></i>Done',
        allowOutsideClick: false,
        allowEscapeKey: false,
        html:
            '<div class="intro-y col-span-12 md:col-span-6 lg:col-span-4">' +
            '<div class=" text-center">' +
            '<div class="flex pt-5">' +
            "</div>" +
            '<div class="text-center lg:text-left pb-5 pt-5">' +
            '<input onkeyup="search_for_document(this.value)" autocomplete="off" id="search_scan_documet_receive" autofocus type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" placeholder="Document Scanner"></input>' +
            '<input hidden id="swal_valid"  type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" ></input>' +
            '<input hidden id="on_click_status"  type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" value="4" ></input>' +
            "</div>" +
            '<div class="col-span-12 lg:col-span-8 xl:col-span-4 mt-2">' +
            '<div class="intro-y flex items-center h-10">' +
            '<h2 id="swal_title" class="text-lg font-medium truncate mr-5">' +
            "Please scan a valid QR code!" +
            "</h2>" +
            "</div>" +
            '<div id="load_file_history" class="mt-2">' +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>",
        preConfirm: function () {
            search_scan_documet_receive = $(
                "#search_scan_documet_receive"
            ).val();
            check = $("#swal_valid").val();

            if (check == 0) {
                Swal.showValidationMessage(`This code is invalid or deleted!`);
            }
        },
    }).then((result) => {
        if (result.value == true) {
            //Action
            //get document details
            $.ajax({
                url: bpath + "documents/scanner/receive/details/4",
                type: "POST",
                data: {
                    _token: _token,
                    search_scan_documet_receive: search_scan_documet_receive,
                },
                success: function (data) {
                    var data = JSON.parse(data);
                    //////.log(data);.log(data['getDoc']);

                    $("#model_track_number").text(
                        " " + data["getDoc"]["track_number"]
                    );
                    $("#model_document_name").text(
                        " " + data["getDoc"]["name"]
                    );
                    $("#model_document_desc").text(
                        " " + data["getDoc"]["desc"]
                    );
                    $("#model_document_as").text("Return as");
                    $("#model_document_from").text(
                        "Return  to (if empty, to author)"
                    );
                    $("#modal_action").val("4");
                    $("#model_track_number_inp").val(
                        "" + data["getDoc"]["track_number"]
                    );

                    document.querySelector("#modal_action_btn").innerText =
                        "Return";
                    document.querySelector("#modal_title_text").innerHTML =
                        "Return Document";
                    $("#scan_emp_List").val(null).trigger("change");

                    const mdl = tailwind.Modal.getOrCreateInstance(
                        document.querySelector("#modal_scan_action")
                    );
                    mdl.toggle();
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swal({
                title: "Cancelled",
                text: "No action taken!",
                type: "error",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                showCancelButton: false,
                showConfirmButton: false,
                timer: 800,
            });
            //Action
        }
    });

    document.getElementById("search_scan_documet_receive").focus();
    let docID = $(this).data("trk-no");
    if (docID) {
        $("#search_scan_documet_receive").val("" + docID);
    }
    document.getElementById("search_scan_documet_receive").focus();
});

function return_action(data, track_id) {
    var doc_track = data["getDoc"]["track_number"];
    var optionValue = data["option_Value"];
    var release_to = data["release_to"];

    swal({
        title: "Return Document",
        text: "choose action to proceed.",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: '<i class="icofont-inbox w-3 h-3 mr-2"></i>Done',
        allowOutsideClick: false,
        allowEscapeKey: false,
        html:
            '<div class="intro-y col-span-12 md:col-span-6 lg:col-span-4">' +
            '<div class=" text-center">' +
            '<div class="flex pt-5">' +
            '<div class="w-full flex flex-col lg:flex-row items-center">' +
            '<div class="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">' +
            '<div class="text-slate-500 text-xs mt-0.5">Track Number</div>' +
            '<a href="javascript:;" class="font-medium">' +
            data["getDoc"]["track_number"] +
            "</a>" +
            "</div>" +
            "</div>" +
            "</div>" +
            '<div class="text-center lg:text-left pb-5 pt-5">' +
            '<div class="text-slate-500 text-xs mt-2">Title</div>' +
            '<div class="font-medium">' +
            data["getDoc"]["name"] +
            "</div>" +
            '<div class="text-slate-500 text-xs mt-2">Description</div>' +
            '<div class="">' +
            data["getDoc"]["desc"] +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">Return as</label>' +
            '<select id="doc_sendAs" name="doc_sendAs" data-placeholder="Select your action" class="form-select mt-1 zoom-in">' +
            optionValue +
            "</select>" +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-2 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">Note</label>' +
            '<textarea id="swal_return_message" class="form-control swal_return_message mt-1 zoom-in" name="swal_return_message" placeholder="Add a message" value=""></textarea>' +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start mt-3">' +
            '<label for="post-form-5" class="text-slate-500 text-xs mt-0.5">Release to: (has trail)</label>' +
            '<select id="swal_release_to" name="swal_release_to" data-placeholder="Person on trail;" class="form-select mt-2  swal_release_to zoom-in">' +
            '<option data-ass-type="group" value=""></option>' +
            release_to +
            "</select>" +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-2 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">To (has official ID)</label>' +
            '<input autocomplete="off" id="scan_id_return_to" autofocus type="text" class="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10" placeholder="Scan official ID (Optional)"></input>' +
            "</div>" +
            '<div class="form-check form-switch flex flex-col items-start text-slate-500 mt-2 mt-3">' +
            '<label  class="text-slate-500 text-xs mt-0.5">Action</label>' +
            '<select id="swal_return_action" name="swal_return_action" data-placeholder="Select your action" class="form-select mt-1 swal_return_message zoom-in">' +
            '<option value="4"> Return</option>' +
            "</select>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>",
        preConfirm: function () {
            doc_sendAstype = $("#doc_sendAs")
                .find(":selected")
                .data("ass-type");
            doc_sendAs = $("#doc_sendAs").val();
            swal_return_message = $("#swal_return_message").val();
            swal_return_action = $("#swal_return_action").val();
            scan_id_return_to = $("#scan_id_return_to").val();
        },
    }).then((result) => {
        if (result.value == true) {
            var acpre = "";
            var acpass = "";
            if (swal_return_action == 6) {
                acpre = "Receive";
                acpass = "Received";
            } else if (swal_return_action == 5) {
                acpre = "Hold";
                acpass = "Hold";
            } else {
                acpre = "Return";
                acpass = "Returned";
            }

            swal({
                text: "Document is now on " + acpre + " files!",
                title: "Document successfully " + acpass + "!",
                type: "success",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                timer: 800,
            });

            //Action
            $.ajax({
                url: bpath + "documents/scanner/return/action",
                type: "POST",
                data: {
                    _token: _token,
                    track_id: track_id,
                    doc_sendAstype: doc_sendAstype,
                    doc_sendAs: doc_sendAs,
                    swal_return_message: swal_return_message,
                    swal_return_action: swal_return_action,
                    scan_id_return_to: scan_id_return_to,
                },
                success: function (data) {
                    var data = JSON.parse(data);
                    ////////.log(data);.log(data);
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swal({
                title: "Cancelled",
                text: "No action taken!",
                type: "error",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                timer: 500,
            });
            //Action
        }
    });
}

function search_for_document(val) {
    // Change the HTML content of .swal2-title element
    $("#swal_title").html(
        "Please wait... " +
            '<svg width="20" viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8"> ' +
            '<g fill="none" fill-rule="evenodd"> ' +
            '<g transform="translate(1 1)"> ' +
            '<circle cx="5" cy="50" r="5" fill="rgb(30, 41, 59)"> ' +
            '<animate attributeName="cy" begin="0s" dur="2.2s" values="50;5;50;50" calcMode="linear" repeatCount="indefinite"></animate> ' +
            '<animate attributeName="cx" begin="0s" dur="2.2s" values="5;27;49;5" calcMode="linear" repeatCount="indefinite"></animate> ' +
            "</circle> " +
            '<circle cx="27" cy="5" r="5" fill="rgb(30, 41, 59)"> ' +
            '<animate attributeName="cy" begin="0s" dur="2.2s" from="5" to="5" values="5;50;50;5" calcMode="linear" repeatCount="indefinite"></animate> ' +
            '<animate attributeName="cx" begin="0s" dur="2.2s" from="27" to="27" values="27;49;5;27" calcMode="linear" repeatCount="indefinite"></animate> ' +
            "</circle> " +
            '<circle cx="49" cy="50" r="5" fill="rgb(30, 41, 59)"> ' +
            '<animate attributeName="cy" begin="0s" dur="2.2s" values="50;50;5;50" calcMode="linear" repeatCount="indefinite"></animate> ' +
            '<animate attributeName="cx" from="49" to="49" begin="0s" dur="2.2s" values="49;5;27;49" calcMode="linear" repeatCount="indefinite"></animate> ' +
            "</circle> " +
            "</g> " +
            "</g> " +
            "</svg>"
    );

    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
        var search_scan_documet_receive = $(
            "#search_scan_documet_receive"
        ).val();
        var swal_status = $("#on_click_status").val();
        var message = ""; // Initialize an empty message variable

        $.ajax({
            url: bpath + "documents/scanner/receive/details/" + swal_status,
            type: "POST",
            beforeSend: function () {
                // Add loading icon before sending the request
                // $('#swal_title').html('<svg width="20" viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8"> <g fill="none" fill-rule="evenodd"> <g transform="translate(1 1)"> <circle cx="5" cy="50" r="5" fill="rgb(30, 41, 59)"> <animate attributeName="cy" begin="0s" dur="2.2s" values="50;5;50;50" calcMode="linear" repeatCount="indefinite"></animate> <animate attributeName="cx" begin="0s" dur="2.2s" values="5;27;49;5" calcMode="linear" repeatCount="indefinite"></animate> </circle> <circle cx="27" cy="5" r="5" fill="rgb(30, 41, 59)"> <animate attributeName="cy" begin="0s" dur="2.2s" from="5" to="5" values="5;50;50;5" calcMode="linear" repeatCount="indefinite"></animate> <animate attributeName="cx" begin="0s" dur="2.2s" from="27" to="27" values="27;49;5;27" calcMode="linear" repeatCount="indefinite"></animate> </circle> <circle cx="49" cy="50" r="5" fill="rgb(30, 41, 59)"> <animate attributeName="cy" begin="0s" dur="2.2s" values="50;50;5;50" calcMode="linear" repeatCount="indefinite"></animate> <animate attributeName="cx" from="49" to="49" begin="0s" dur="2.2s" values="49;5;27;49" calcMode="linear" repeatCount="indefinite"></animate> </circle> </g> </g> </svg>');
            },
            data: {
                _token: _token,
                search_scan_documet_receive: search_scan_documet_receive,
            },
            success: function (data) {
                var data = JSON.parse(data);

                $("#load_file_history").empty();
                $("#load_file_history").append(data.recent_activity);

                if (data.recent_activity) {
                    message = "Valid Document!";
                }

                if (data.check_doc) {
                    $("#swal_valid").val("1");
                    message = "Valid Document!";
                } else {
                    $("#swal_valid").val("0");
                    message = "Please try again!";
                }
                $("#scan_emp_List").val(null).trigger("change");
            },
            complete: function () {
                // Remove loading icon or perform any other action after request completion
                // Update the message dynamically based on success or failure
                var swalTitle = document.getElementById("swal_title");
                swalTitle.innerHTML = message;

                // Add check icon or x icon based on validity
                if ($("#swal_valid").val() === "1") {
                    swalTitle.innerHTML +=
                        '<i class="fas fa-check-circle ml-2 text-success"></i>';
                } else {
                    swalTitle.innerHTML +=
                        '<i class="fas fa-times-circle ml-2 text-danger" ></i>';
                }
            },
        });
    }, 1000);
}

$("body").on("click", "#modal_action_btn", function () {
    model_ass_type = $("#model_as").find(":selected").data("ass-type");
    model_as = $("#model_as").val();
    modal_message = $("#modal_message").val();
    modal_scan_id_from = $("#modal_scan_id_from").val();
    //emp_List = $('#emp_List').val();
    var emp_List = [];
    modal_action = $("#modal_action").val();
    track_id = $("#model_track_number_inp").val();

    $("#scan_emp_List :selected").each(function (i, selected) {
        emp_List[i] = $(selected).val();
    });

    //////.log(data);.log(emp_List);

    $.ajax({
        url: bpath + "documents/scanner/multiple/action",
        type: "POST",
        data: {
            _token: _token,
            model_ass_type: model_ass_type,
            model_as: model_as,
            modal_message: modal_message,
            modal_scan_id_from: modal_scan_id_from,
            emp_List: emp_List,
            modal_action: modal_action,
            track_id: track_id,
        },
        success: function (data) {
            var data = JSON.parse(data);
            //////////.log(data);.log(data);

            $("#modal_message").val("");
            $("#modal_scan_id_from").val("");
            $("#scan_emp_List").val(null).trigger("change");
            $("#modal_action").val("");
            $("#model_track_number_inp").val("");

            __notif_load_data(__basepath + "/");
            const mdl = tailwind.Modal.getOrCreateInstance(
                document.querySelector("#modal_scan_action")
            );
            mdl.hide();
        },
    });
});

$("body").on("click", "#remove_document_note", function () {
    let note_id = $(this).data("nt-no");

    swal({
        title: "Are you sure to dismiss?",
        text: "This action cannot be undone.",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: '<i class="icofont-trash w-3 h-3 mr-2"></i>Yes',

        preConfirm: function () {},
    }).then((result) => {
        if (result.value == true) {
            $.ajax({
                url: bpath + "track/remove/note",
                type: "POST",
                data: {
                    _token: _token,
                    note_id: note_id,
                },
                success: function (data) {
                    // var data = JSON.parse(data);

                    location.reload();

                    // __notif_load_data(__basepath + "/");
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swal({
                title: "Cancelled",
                text: "No action taken!",
                type: "error",
                confirmButtonColor: "#1e40af",
                confirmButtonColor: "#1e40af",
                timer: 500,
            });
        }
    });
});
