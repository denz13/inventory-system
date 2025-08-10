$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {
    leave_ledger_check_schedule();
    leave_ledger_take_action();
});

function leave_ledger_check_schedule() {
    $.ajax({
        url: "/leave/check_schedule",
        type: "GET",
        dataType: "json",
        beforeSend: function() {
        },
        success: function (response) {
            if (response == 'schedule') {
                open_modal('#gac_ledger_schedule_modal');
            }
        },
        error: function(xhr, status, error) {
            // alert(xhr.responseText);
            warningModal(error, xhr.responseText);
        }
    });
}

function leave_ledger_take_action() {
    $('body').on('click', '#gac_leave_ledger_take_action_btn', function() {
        window.location.href = '/leave/employeeledger';
    });
}
