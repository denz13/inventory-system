$(document).ready(function () {
    bpath = __basepath + "/";
});

var _token = $('meta[name="csrf-token"]').attr("content");

$("body").on("click", "#for_action_button", function () {
    doc_type = $(this).data("doc-typ");
    doc_type_id = $(this).data("doc-tid");
    $("#modal_release_document_doc_track_id").val($(this).data("trk-id"));
    //alert($(this).data('trk-id'));

    load_signatories(doc_type, doc_type_id);
});

$("body").on("click", ".person_on_signatory_click_history", function () {
    const mdl = tailwind.Modal.getOrCreateInstance(
        document.querySelector("#modal_second_signatory_history")
    );
    mdl.toggle();

    sig_id = $(this).data("sig-id");
    tracking_id = $(this).data("doc-id");

    $.ajax({
        url: bpath + "documents/received/load/signatories/history",
        type: "POST",
        data: {
            _token: _token,
            sig_id: sig_id,
            tracking_id: tracking_id,
        },
        success: function (response) {
            var data = JSON.parse(response);

            const $historyContainer = $(".load_sig_div_modal_history");
            $historyContainer.empty();

            if (data.load_sig_div_modal_history) {
                $historyContainer.html(data.load_sig_div_modal_history);
            }
        },
    });
});

$("body").on("click", ".modal_third_signatory_action", function () {
    $("#modal_release_signatory_id").val($(this).data("sig-id"));
    $("#modal_release_document_track_id").val($(this).data("doc-id"));

    const mdl = tailwind.Modal.getOrCreateInstance(
        document.querySelector("#modal_third_signatory_action")
    );
    mdl.toggle();
});

$("body").on("click", "#btn_action_third_save_modal", function () {
    const mdl = tailwind.Modal.getOrCreateInstance(
        document.querySelector("#modal_third_signatory_action")
    );
    mdl.hide();

    doc_sendAs = $("#doc_sendAs").val();
    action_third_modal_list = $("#action_third_modal_list").val();
    third_modal_message = $("#third_modal_message").val();
    esig_third_modal_list = $("#e-sig_third_modal_list").val();

    sig_id = $("#modal_release_signatory_id").val();
    track_id = $("#modal_release_document_track_id").val();
    doc_track_id = $("#modal_release_document_doc_track_id").val();
    // console.log(sig_doc_sendAsid);
    // console.log(action_third_modal_list);
    // console.log(third_modal_message);
    // console.log(esig_third_modal_list);
    // console.log(sig_id);
    // console.log(track_id);
    // console.log(doc_track_id);
    $.ajax({
        url: bpath + "documents/received/add/action/signatory",
        type: "POST",
        data: {
            _token: _token,
            doc_sendAs: doc_sendAs,
            action_third_modal_list: action_third_modal_list,
            third_modal_message: third_modal_message,
            esig_third_modal_list: esig_third_modal_list,
            sig_id: sig_id,
            track_id: track_id,
            doc_track_id: doc_track_id,
        },
        success: function (response) {
            var data = JSON.parse(response);
            $("#modal_release_signatory_id").val("");
            $("#third_modal_message").val("");
            $("#modal_release_document_track_id").val("");
            load_signatories(data.doc_type, data.doc_type_id);
            loadTravelOrders();
            __notif_load_data(__basepath + "/");
        },
    });
});

function load_signatories(doc_type, doc_type_id) {
    $.ajax({
        url: bpath + "documents/received/load/signatories",
        type: "POST",
        data: {
            _token: _token,
            doc_type: doc_type,
            doc_type_id: doc_type_id,
        },
        success: function (response) {
            var data = JSON.parse(response);
            //console.log(data);

            if (data.modal_content_title_and_desc) {
                $("#modal_content_title_and_desc").empty();
                $("#modal_content_title_and_desc").append(
                    data.modal_content_title_and_desc
                );
            } else {
                $("#modal_content_title_and_desc").empty();
            }

            if (data.modal_content_signatories) {
                $("#modal_content_signatories").empty();
                $("#modal_content_signatories").append(
                    data.modal_content_signatories
                );
            } else {
                $("#modal_content_signatories").empty();
            }

            __notif_load_data(__basepath + "/");
        },
    });
}
