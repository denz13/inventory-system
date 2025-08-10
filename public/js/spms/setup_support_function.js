$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {
    create_support_function();
});

function create_support_function() {
    $('body').on('click', '#create_support_function', function() {
        create_support_function_clear();
        open_modal('#create_support_function_modal');
    });

    $('body').on('click', '#save_output', function() {
        var btn = $(this);
        let bool = true;
        var output_name = $('#output_name').val();
        var employment_type = $('#employment_type').val();
        var category = $('#category').val();
        var efficiency = $('#efficiency').val();
        var efficiency_val = $('#efficiency_val').val();
        var repeat = $('#repeat').val();
        var custom_month = $('#custom_month').val();
        
        if (output_name == '') {
            $('#output_name_error').text('Output name is required');
            $('#output_name').addClass('border-danger');
            bool = false;
        }
        if (employment_type == '' || employment_type == null) {
            $('#employment_type_error').text('Employment type is required');
            $('#employment_type').addClass('border-danger');
            bool = false;
        }
        if (category == '' || category == null) {
            $('#category_error').text('Category is required');
            $('#category').addClass('border-danger');
            bool = false;
        }
        if (efficiency == '' || efficiency == null) {
            $('#efficiency_error').text('Efficiency is required');
            $('#efficiency').addClass('border-danger');
            bool = false;
        }
        if (efficiency == 'Defined') {
            if (efficiency_val == '') {
                $('#efficiency_val_error').text('Efficiency value is required');
                $('#efficiency_val').addClass('border-danger');
                bool = false;
            }
        }
        if (repeat == '' || repeat == null) {
            $('#repeat_error').text('Repeat is required');
            $('#repeat').addClass('border-danger');
            bool = false;
        }

        if (repeat == 'Custom') {
            if (custom_month == '' || custom_month == null) {
                $('#custom_month_error').text('Custom month is required');
                $('#custom_month').addClass('border-danger');
                bool = false;
            }
        }


        if (bool) {
            $.ajax({
                url: "/spms/save_pre_defined_output",
                type: "POST",
                dataType: "json",
                data: {
                    output_name: output_name,
                    employment_type: employment_type,
                    category: category,
                    efficiency: efficiency,
                    efficiency_val: efficiency_val,
                    repeat: repeat,
                    custom_month: custom_month
                },
                beforeSend: function() {
                    btn.html('<span class="fa-fade">Saving</span>');
                    btn.prop('disabled', true);
                },
                success: function (response) {
                    if (response == 'exist') {
                        $('#output_name_error').text('Output name already exists');
                        $('#output_name').addClass('border-danger');
                    } else {
                        btn.html('Save');
                        btn.prop('disabled', false);
                        close_modal('#create_support_function_modal');
                        __notif_show(1, 'Success', 'Output saved successfully');
                        create_support_function_clear();
                    }
                },
                error: function(xhr, status, error) {
                    btn.html('Save');
                    btn.prop('disabled', false);
                    alert(xhr.responseText);
                }
            });
        }
    });

    $('body').on('change', '#efficiency', function() {
        if ($(this).val() == 'Defined') {
            $('#efficiency_val').prop('disabled', false);
        } else {
            $('#efficiency_val').prop('disabled', true);
            $('#efficiency_val').val('');
        }
    });

    $('body').on('change', '#repeat', function() {
        if ($(this).val() == 'Custom') {
            $('#custom_month_div').show();
        } else {
            $('#custom_month_div').hide();
            $('#custom_month').val('').trigger('change');
            $('#custom_month').parent().find('.item').remove();
        }
    });

    // Input and Select Error Handler
    $('body').on('input', '#output_name', function() {
        $('#output_name_error').text('');
        $('#output_name').removeClass('border-danger');
    });

    $('body').on('change', '#employment_type', function() {
        $('#employment_type_error').text('');
        $('#employment_type').removeClass('border-danger');
    });

    $('body').on('change', '#category', function() {
        $('#employment_type_error').text('');
        $('#employment_type').removeClass('border-danger');
    });

    $('body').on('change', '#efficiency', function() {
        $('#efficiency_error').text('');
        $('#efficiency').removeClass('border-danger');
    });

    $('body').on('input', '#efficiency_val', function() {
        $('#efficiency_val_error').text('');
        $('#efficiency_val').removeClass('border-danger');
    });

    $('body').on('change', '#custom_month', function() {
        $('#custom_month_error').text('');
        $('#custom_month').removeClass('border-danger');
    });

    $('body').on('change', '#repeat', function() {
        $('#repeat_error').text('');
        $('#repeat').removeClass('border-danger');
    });
}

function create_support_function_clear() {
    $('#output_name').val('');
    $('#employment_type').val('').trigger('change');
    $('#employment_type').parent().find('.item').remove();
    $('#efficiency').val('');
    $('#efficiency_val').val('');
    $('#efficiency_val').prop('disabled', true);
    $('#repeat').val('');
    $('#custom_month').val('').trigger('change');
    $('#custom_month').parent().find('.item').remove();
    $('#custom_month_div').hide();
}