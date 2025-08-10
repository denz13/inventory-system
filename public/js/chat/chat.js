var _token = $('meta[name="csrf-token"]').attr("content");
var conversation_id = "";
var user_id = "";
var current_user_id = "";
var fullname = "";
var timeout = null;
var new_conversation_modal_add_person;
var add_conversation_modal_add_person;
var all_users_loaded = 0;
var sent_a_message = 0;
// var  samp  = caches.has('wow');

$(document).ready(function () {
    bpath = __basepath + "/";
    load_my_conversations();
    search_user_with_key();
    load_dropdown();
});

//Lastresort Autoload
// setInterval(function(){

//     $.ajax({
//         url: "chat/autoload/conversation",
//         type: "POST",
//         data: {
//             _token: _token,
//         },
//         success: function(data){
//             var data = JSON.parse(data);
//             // if(caches.has('msg_sent-'+ current_user_id)){
//             //     console.log(caches.match('msg_sent-'+ current_user_id));
//             //     caches.delete('msg_sent-'+ current_user_id);
//             // }

//             if(data.action == 1){
//                 if(data.conversation_id == conversation_id){
//                     // console.log(data.conversation_id);
//                     load_conversation_content(conversation_id)
//                 }else{
//                     load_my_conversations();
//                 }
//             }else{

//             }
//             // console.log(data);
//             // $("#load_direct_message").html(data.load_conversations);
//             __notif_load_data(__basepath + "/");

//         },error:function (err){
//             console.log(err)
//         }
//     });
// }, 5000);

function load_dropdown() {
    new_conversation_modal_add_person = $(
        "#new_conversation_modal_add_person"
    ).select2({
        placeholder: "Select Person",
        allowClear: true,
        closeOnSelect: false,
    });

    add_conversation_modal_add_person = $(
        "#add_conversation_modal_add_person"
    ).select2({
        placeholder: "Select Person",
        allowClear: true,
        closeOnSelect: false,
    });
}

function doDelayedSearch(val) {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
        search_user_with_key();
    }, 1000);
}

function search_user_with_key() {
    //route chat_search_user_info
    showLoading();
    $.ajax({
        url: "chat/search/user/info",
        type: "POST",
        data: {
            _token: _token,
            search_key: $("#seach_input_chatbox").val(),
        },
        success: function (data) {
            var data = JSON.parse(data);
            // console.log(data);
            $("#users_on_search").html(data.users_on_search);
            current_user_id = data.current_user_id;
            hideLoading();
        },
    });
}

function load_my_conversations() {
    //route load_my_conversations
    $.ajax({
        url: "chat/load/my/conversations",
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (data) {
            var data = JSON.parse(data);
            // console.log(data);
            $("#load_direct_message").html(data.load_conversations);
        },
    });
}

function load_conversation_content(conversation_id) {
    //route load_conversation_content

    $.ajax({
        url: "chat/load/conversation/content",
        type: "POST",
        data: {
            _token: _token,
            conversation_id: conversation_id,
        },
        success: function (data) {
            var data = JSON.parse(data);
            $("#load_header_chat_box").empty();
            $("#load_footer_chat_box").empty();
            $("#load_main_view_chat").empty();

            $("#load_header_chat_box").html(data.load_header_chat_box);
            $("#load_footer_chat_box").html(data.load_footer_chat_box);
            $("#load_main_view_chat").html(data.load_main_view_chat);
            // console.log(data);
            var objDiv = document.getElementById("load_main_view_chat");
            objDiv.scrollTop = objDiv.scrollHeight;
            hideLoading();
        },
    });
}

function send_message(conversation_id, text_message) {
    $.ajax({
        url: "chat/send/conversation/text",
        type: "POST",
        data: {
            _token: _token,
            conversation_id: conversation_id,
            text_message: text_message,
        },
        success: function (data) {
            var data = JSON.parse(data);
            // console.log(data);
            $("#textarea_send_the_message").val("");
            load_conversation_content(conversation_id);
            // load_my_conversations();
            // __notif_load_data(__basepath + "/");
        },
    });
}

function load_members_conversation(conversation_id) {
    $.ajax({
        url: "chat/load/conversation/members",
        type: "POST",
        data: {
            _token: _token,
            conversation_id: conversation_id,
        },
        success: function (data) {
            var data = JSON.parse(data);
            $("#modal_content_members").empty();
            $("#modal_content_members").html(data.modal_content_members);
        },
    });
}

function remove_user_conversation(conversation_id, user_id) {
    $.ajax({
        url: "chat/remove/user/conversation",
        type: "POST",
        data: {
            _token: _token,
            conversation_id: conversation_id,
            user_id: user_id,
        },
        success: function (data) {
            var data = JSON.parse(data);
            load_members_conversation(conversation_id);
            load_conversation_content(conversation_id);
            // console.log(data);
            __notif_load_data(__basepath + "/");
            const mdl = tailwind.Modal.getOrCreateInstance(
                document.querySelector("#modal_third_remove_action")
            );
            mdl.hide();
        },
    });
}

$(document).on("select2:open", function (e) {
    document
        .querySelector(`[aria-controls="select2-${e.target.id}-results"]`)
        .focus();
});

$("body").on("click", ".on_click_load_conversation_with_id", function (ev) {
    ev.preventDefault();
    showLoading();
    //button route load_my_conversations
    if (!ev.detail || ev.detail == 1) {
        conversation_id = $(this).data("cv-id");
        load_conversation_content(conversation_id);
    }

    $(this).children(".div_number_of_not_seen").hide();
});

$("body").on("click", "#btn_send_message_onclick", function (ev) {
    ev.preventDefault();

    //button route load_my_conversations
    if (!ev.detail || ev.detail == 1) {
        conversation_id = $(this).data("cv-id");
        text_message = $("#textarea_send_the_message").val();
        send_message(conversation_id, text_message);
    }
});

$("body").on("click", ".refresh_conversation_with_id", function (ev) {
    //button route load_my_conversations
    load_conversation_content(conversation_id);
});

$("body").on("click", "#save_new_conversation", function (ev) {
    ev.preventDefault();
    //button route load_my_conversations
    if (!ev.detail || ev.detail == 1) {
        var title = $("#new_conversation_modal_title").val();
        var description = $("#new_conversation_modal_description").val();
        var userList = [];
        var committeeList = [];
        var agencyList = [];
        var groupList = [];

        $("#new_conversation_modal_add_person :selected").each(function (
            i,
            selected
        ) {
            userList[i] = $(selected).val();
        });
        $("#new_conversation_modal_committee :selected").each(function (
            i,
            selected
        ) {
            committeeList[i] = $(selected).val();
        });
        $("#new_conversation_modal_agency :selected").each(function (
            i,
            selected
        ) {
            agencyList[i] = $(selected).val();
        });
        $("#new_conversation_modal_group :selected").each(function (
            i,
            selected
        ) {
            groupList[i] = $(selected).val();
        });

        $.ajax({
            url: "chat/save/new/conversation",
            type: "POST",
            data: {
                _token: _token,
                title: title,
                description: description,
                userList: userList,
                committeeList: committeeList,
                agencyList: agencyList,
                groupList: groupList,
            },
            cache: false,
            success: function (data) {
                // console.log(data);
                var data = JSON.parse(data);
                load_conversation_content(data.conversation_id);
                load_my_conversations();
                $("#new_conversation_modal_title").val("");
                $("#new_conversation_modal_description").val("");
                new_conversation_modal_add_person.val(null).trigger("change");
                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#chat_modal_new_conversation")
                );
                mdl.hide();
                __notif_load_data(__basepath + "/");
            },
        });
    }
});

$("body").on("click", "#load_all_users", function (ev) {
    ev.preventDefault();

    //button route load_my_conversations
    if (!ev.detail || ev.detail == 1) {
        if (all_users_loaded == 0) {
            showLoading();
            $.ajax({
                url: "chat/load/all/users",
                type: "POST",
                data: {
                    _token: _token,
                },
                success: function (data) {
                    var data = JSON.parse(data);
                    //  console.log(1);
                    all_users_loaded = 1;
                    $("#div_append_all_users").html(data.load_all_contacts);
                    hideLoading();
                },
            });
        }
    }
});

$("body").on("click", ".btn_load_members", function (ev) {
    //button route load_conversation_members
    conversation_id = $(this).data("cv-id");
    if (!ev.detail || ev.detail == 1) {
        load_members_conversation(conversation_id);
    }
});

$("body").on("click", ".btn_add_new_members", function (ev) {
    //button route add_conversation_new_member
    conversation_id = $(this).data("cv-id");
    if (!ev.detail || ev.detail == 1) {
        console.log(ev.detail);
        $.ajax({
            url: "chat/add/conversation/new/member",
            type: "POST",
            data: {
                _token: _token,
            },
            success: function (data) {
                var data = JSON.parse(data);
                //  console.log(1);
            },
        });
    }
});

$("body").on("click", ".btn_leave_conversation", function (ev) {
    //button route leave_conversation
    conversation_id = $(this).data("cv-id");
    if (!ev.detail || ev.detail == 1) {
    }
});

$("body").on("click", ".btn_remove_conversation", function (ev) {
    //button route remove_conversation
    conversation_id = $(this).data("cv-id");
});

$("body").on("click", ".load_chat_div_modal_history", function (ev) {
    //button route remove_conversation
    conversation_id = $(this).data("cv-id");
    user_id = $(this).data("us-id");
    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: "chat/load/chat/history",
            type: "POST",
            data: {
                _token: _token,
                conversation_id: conversation_id,
                user_id: user_id,
            },
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data);
                $("#load_chat_div_modal_history").html(data.modal_load_history);

                var load_chat_div_modal_history = document.getElementById(
                    "load_chat_div_modal_history"
                );
                load_chat_div_modal_history.scrollTop =
                    load_chat_div_modal_history.scrollHeight;

                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#modal_second_chat_history")
                );
                mdl.toggle();
            },
        });
    }
});

$("body").on("click", ".remove_person_on_click_history", function (ev) {
    //button route remove_user_conversation
    conversation_id = $(this).data("cv-id");
    user_id = $(this).data("us-id");
    const mdl = tailwind.Modal.getOrCreateInstance(
        document.querySelector("#modal_third_remove_action")
    );
    mdl.toggle();
});

$("body").on("click", "#btn_third_modal_remove_user", function (ev) {
    if (!ev.detail || ev.detail == 1) {
        remove_user_conversation(conversation_id, user_id);
    }
});

$("body").on("click", "#add_new_members", function (ev) {
    ev.preventDefault();
    //button route load_my_conversations
    if (!ev.detail || ev.detail == 1) {
        var userList = [];

        $("#add_conversation_modal_add_person :selected").each(function (
            i,
            selected
        ) {
            userList[i] = $(selected).val();
        });

        $.ajax({
            url: "chat/add/new/member",
            type: "POST",
            data: {
                _token: _token,
                userList: userList,
                conversation_id: conversation_id,
            },
            cache: false,
            success: function (data) {
                console.log(data);
                var data = JSON.parse(data);
                // console.log(data);
                load_conversation_content(conversation_id);
                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector(
                        "#chat_modal_add_members_conversation"
                    )
                );
                mdl.hide();
                add_conversation_modal_add_person.val(null).trigger("change");
                __notif_load_data(__basepath + "/");
            },
        });
    }
});

$("body").on("click", "#btn_leave_conversation", function (ev) {
    ev.preventDefault();
    //button route load_my_conversations
    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: "chat/leave/conversation",
            type: "POST",
            data: {
                _token: _token,
                conversation_id: conversation_id,
            },
            cache: false,
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data);
                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#chat_modal_leave_conversation")
                );
                mdl.hide();
                __notif_load_data(__basepath + "/");
                load_my_conversations();
                conversation_id = "";
                user_id = "";
                $("#load_header_chat_box").empty();
                $("#load_footer_chat_box").empty();
                $("#load_main_view_chat").empty();
                $("#load_main_view_chat").html(data.load_default_view);
            },
        });
    }
});

$("body").on("click", "#btn_remove_conversation_modal", function (ev) {
    ev.preventDefault();
    //button route load_my_conversations
    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: "chat/remove/conversation",
            type: "POST",
            data: {
                _token: _token,
                conversation_id: conversation_id,
            },
            success: function (data) {
                var data = JSON.parse(data);

                if (data.deleted == 1) {
                    conversation_id = "";
                    user_id = "";
                    $("#load_header_chat_box").empty();
                    $("#load_footer_chat_box").empty();
                    $("#load_main_view_chat").empty();
                    $("#load_main_view_chat").html(data.load_default_view);
                }
                __notif_load_data(__basepath + "/");
                load_my_conversations();

                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#chat_modal_remove_conversation")
                );
                mdl.hide();
            },
        });
    }
});

$("body").on("click", ".div_load_on_modal", function (ev) {
    ev.preventDefault();
    fullname = $(this).data("nm-fn");
    user_id = $(this).data("us-id");
    $("#name_of_the_person_modal").text(fullname);
    $("#user_id_on_send_modal").val(user_id);
});

$("body").on("click", "#btn_send_message_modal", function (ev) {
    ev.preventDefault();

    if (!ev.detail || ev.detail == 1) {
        $.ajax({
            url: "chat/send/message/user",
            type: "POST",
            data: {
                _token: _token,
                fullname: fullname,
                user_id: user_id,
                text_message: $("#sd_modal_sd").val(),
            },
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data);
                const mdl = tailwind.Modal.getOrCreateInstance(
                    document.querySelector("#chat_modal_send_message")
                );
                mdl.hide();
                $("#sd_modal_sd").val("");
                load_conversation_content(data.conversation_id);
                load_my_conversations();
                __notif_load_data(__basepath + "/");
            },
        });
    }
});

// keypress enter
$("body").on("keypress", "#textarea_send_the_message", function (e) {
    if (!e.detail || e.detail == 1) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();

            conversation_id = $(this).data("cv-id");
            text_message = $("#textarea_send_the_message").val();
            send_message(conversation_id, text_message);
        }
    }
});

Echo.channel("channel-have-message").listen("load_have_message", (e) => {
    // console.log(e);

    if (e.message_sent_to == "msg-sent-" + current_user_id) {
        if (e.conversation_id == conversation_id) {
            load_conversation_content(e.conversation_id);
        } else {
            load_my_conversations();
        }
        // load_notification(e.message_id);
    }
});

// function load_notification(message_id){
//     $.ajax({
//         url: "chat/load/message/id",
//         type: "POST",
//         data: {
//             _token: _token,
//             message_id: message_id,
//         },
//         success: function(data){
//             var data = JSON.parse(data);

//             $('#notification-with-avatar-content').empty();
//             $('#notification-with-avatar-content').append(data.load_message);

//             let avatarNotification = Toastify({ node: $("#notification-with-avatar-content") .clone() .removeClass("hidden")[0], duration: -1, newWindow: true, close: true, gravity: "top", position: "right", stopOnFocus: true, }).showToast();
//             $(avatarNotification.toastElement) .find('[data-dismiss="notification"]') .on("click", function () { avatarNotification.hideToast(); });
//         }
//     });

// }
