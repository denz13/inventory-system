$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function () {

    switchCard();
    enableDisableRegistration();
    fetchRegistrationSettings();
});


function switchCard(){

    $('.registration_settings_content_div').hide();

    $('body').on('click', '.card_button',function(){

        // Remove classes from all cards
        $('.card_button').removeClass('bg-primary text-white');
        $('.card_button').find('.text-white').removeClass('text-white').addClass('text-slate-500');

        // Add classes to the clicked card
        $(this).addClass('bg-primary text-white');
        $(this).find('.text-slate-500').removeClass('text-slate-500').addClass('text-white');
        let card_button_name = $(this).data('card-name');
        generateDIVLayout(card_button_name);

    });

}

function generateDIVLayout(card_button_name){

    if(card_button_name === 'default_settings')
    {
        $('.default_settings_content_div').show();
        $('.registration_settings_content_div').hide();
    }
    else if(card_button_name === 'registration_settings')
    {
        $('.default_settings_content_div').hide();
        $('.registration_settings_content_div').show();
        fetchRegistrationSettings();
    }
    else
    {
        $('.default_settings_content_div').hide();
        $('.registration_settings_content_div').hide();
    }

}

function enableDisableRegistration(){

    /** UPDATE CLEARANCE STATUS */
    $('body').on('change', '.registration_status', function(){

        let registration_status;
        if ($(this).is(':checked'))
        {
            registration_status = 1;
            updateRegistrationStatus(registration_status);
        }
        else
        {
            registration_status = 0;
            updateRegistrationStatus(registration_status);
        }

    });

}

function updateRegistrationStatus(registration_status){

    Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to run proceed? This process cannot be undone.",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#d63030',
        cancelButtonColor: '#9d9d9d',
        confirmButtonText: 'Yes, proceed!'
    }).then((result) =>
    {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/update-registration-status',
                data: { registration_status },
                type: 'POST',
                dataType: 'json',
                beforeSend: function () {


                },
                success: function (response) {

                    if(response.success)
                    {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: response.message,
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000  // Close the alert after 1 second
                        });
                        fetchRegistrationSettings();
                    }
                },

                complete: function () {


                }
            });
        }else
        {
            fetchRegistrationSettings();
        }

    });

}
function fetchRegistrationSettings(){

    $.ajax({
        url: '/admin/fetch-registration-status',
        type: 'POST',
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (response) {

            if(response.success)
            {
                if(response.registrationStatus === '1')
                {
                    $('.registration_status').prop('checked', true);
                    $('.status_label').html(`<span class="text-success">Registration Enabled</span>`);
                    $('.pisti').text('Enabled')
                }
                else if(response.registrationStatus === '0')
                {
                    $('.registration_status').prop('checked', false);
                    $('.status_label').html(`<span class="text-danger">Registration Disabled</span>`);
                    $('.pisti').text('Disabled')
                }
                else
                {
                    $('.registration_status').prop('checked', false);
                }

            }
        },

        complete: function () {


        }
    });

}
