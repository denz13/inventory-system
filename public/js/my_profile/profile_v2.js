$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {


    // Save PDS when button is clicked
    $('#save_PDS_to_db').on('click', function() {
        validateAndSavePDS();
    });

    // Remove red border when user starts typing/selecting
    $('input, select').on('input change', function() {
        $(this).removeClass('border-danger');
    });

    // Add auto-capitalization for the specific fields
    $('#others_40_a_yes, #others_40_b_yes, #others_40_c_yes').on('input', function() {
        let value = $(this).val();
        $(this).val(value.toUpperCase());
    });

    handleSISMissingField();


});


function savePDS() {
    let timerInterval;
    let progress = 0;

    // Show loading indicator with progress bar
    Swal.fire({
        title: 'Saving Personal Data Sheet',
        html: `
            <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated"
                     role="progressbar"
                     style="width: 0%"
                     id="saveProgress">0%</div>
            </div>
            <div class="mt-2" id="saveStatus">Initializing...</div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            timerInterval = setInterval(() => {
                if (progress < 90) { // Only increment up to 90%
                    progress += 10;
                    $('#saveProgress').css('width', progress + '%');
                    $('#saveProgress').text(progress + '%');

                    // Update status message based on progress
                    let status = 'Processing...';
                    if (progress < 30) {
                        status = 'Saving personal information...';
                    } else if (progress < 50) {
                        status = 'Saving address details...';
                    } else if (progress < 70) {
                        status = 'Saving family background...';
                    } else if (progress < 90) {
                        status = 'Finalizing...';
                    }
                    $('#saveStatus').text(status);
                }
            }, 300);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    });

    // Collect all form data
    let formData = {
        // Personal Information
        lastname: $('#profile_last_name').val(),
        firstname: $('#profile_first_name').val(),
        middlename: $('#profile_mid_name').val(),
        name_extension: $('#profile_name_extension').val(),
        date_birth: $('#profile_date_birth').val(),
        place_birth: $('#profile_place_birth').val(),
        sex: $('#application_sex').val(),
        gender: $('#application_gender').val(),
        civil_status: $('#profile_civil_status').val(),
        height: $('#profile_height').val(),
        weight: $('#profile_weight').val(),
        blood_type: $('#profile_blood_type').val(),
        gsis: $('#profile_gsis').val(),
        pagibig: $('#profile_pagibig').val(),
        philhealth: $('#profile_philhealth').val(),
        tin: $('#profile_tin').val(),
        agency_id: $('#profile_agency').val(),
        sss_no: $('#profile_sss_no').val(),
        telephone: $('#profile_tel_number').val(),
        mobile: $('#profile_mobile_number').val(),
        email: $('#profile_email').val(),
        citizenship: $('input[name="citizenship"]:checked').val(),
        dual_citizenship_type: getDualCitizenshipType(),
        dual_citizenship_country: $('#citizenship_country').val(),

        // Residential Address
        res_province: $('.ref_province').val(),
        res_city: $('.ref_city_mun').val(),
        res_barangay: $('.ref_brgy').val(),
        res_subdivision: $('#res_sub').val(),
        res_street: $('#res_street').val(),
        res_house: $('#res_house_block').val(),
        res_zip: $('#res_zip_code').val(),

        // Permanent Address
        per_province: $('.per_province').val(),
        per_city: $('.per_city_mun').val(),
        per_barangay: $('.per_brgy').val(),
        per_subdivision: $('#per_sub').val(),
        per_street: $('#per_street').val(),
        per_house: $('#per_house_block').val(),
        per_zip: $('#per_zip_code').val(),

        // Family Background
        spouse_surname: $('#fam_spouse_surname').val(),
        spouse_firstname: $('#fam_spouse_first_name').val(),
        spouse_middlename: $('#fam_spouse_mid_name').val(),
        spouse_extension: $('#fam_spouse_name_ext').val(),
        occupation: $('#spouse_occupation').val(),
        employer_name: $('#occupation_employer').val(),
        business_address: $('#occupation_address').val(),
        employer_telephone: $('#occupation_tel_no').val(),
        father_surname: $('#fam_father_surname').val(),
        father_firstname: $('#fam_father_first_name').val(),
        father_middlename: $('#fam_father_mid_name').val(),
        father_extension: $('#fam_father_name_ext').val(),
        mother_maiden: $('#fam_mother_maiden_name').val(),
        mother_surname: $('#fam_mother_surname').val(),
        mother_firstname: $('#fam_mother_first_name').val(),
        mother_middlename: $('#fam_mother_mid_name').val(),

        // Children data from table
        children: getChildrenData(),

        // Questions 34-40
        q34_a: $('#btn_34_a_yes').is(':checked') ? '1' : '0',
        q34_b: $('#btn_34_b_yes').is(':checked') ? '1' : '0',
        q34_b_details: $('#others_34_b_yes').val(),

        q35_a: $('#btn_35_a_yes').is(':checked') ? '1' : '0',
        q35_a_details: $('#others_35_a_yes').val(),
        q35_b: $('#btn_35_b_yes').is(':checked') ? '1' : '0',
        q35_b_details: $('#others_35_b_yes').val(),
        q35_b_date_filed: $('#others_35_b_date_filed').val(),
        q35_b_status: $('#others_35_b_status_case').val(),

        q36: $('#btn_36_yes').is(':checked') ? '1' : '0',
        q36_details: $('#others_36_yes').val(),

        q37: $('#btn_37_yes').is(':checked') ? '1' : '0',
        q37_details: $('#others_37_yes').val(),

        q38_a: $('#btn_38_a_yes').is(':checked') ? '1' : '0',
        q38_a_details: $('#others_38_a_yes').val(),
        q38_b: $('#btn_38_b_yes').is(':checked') ? '1' : '0',
        q38_b_details: $('#others_38_b_yes').val(),

        q39: $('#btn_39_yes').is(':checked') ? '1' : '0',
        q39_details: $('#others_39_yes').val(),

        q40_a: $('#btn_40_a_yes').is(':checked') ? '1' : '0',
        q40_a_details: $('#others_40_a_yes').val(),
        q40_b: $('#btn_40_b_yes').is(':checked') ? '1' : '0',
        q40_b_details: $('#others_40_b_yes').val(),
        q40_c: $('#btn_40_c_yes').is(':checked') ? '1' : '0',
        q40_c_details: $('#others_40_c_yes').val(),

        // Government IDs
        gov_id: $('#government_ids').val(),
        gov_id_no: $('#government_license_no').val(),
        gov_id_date_place: $('#government_license_issuance').val(),
    };

    // Send AJAX request
    $.ajax({
        url: '/my_new_profile/save-pds',
        method: 'POST',
        data: formData,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            // Set progress to 100% before closing
            progress = 100;
            $('#saveProgress').css('width', '100%');
            $('#saveProgress').text('100%');
            $('#saveStatus').text('Complete!');

            setTimeout(() => {
                Swal.close();

                if (response.success) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Personal Data Sheet has been saved successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: response.message || 'Something went wrong while saving the data.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            }, 500);
        },
        error: function(xhr, status, error) {
            clearInterval(timerInterval);
            Swal.close();

            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while saving the data.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
}

function getDualCitizenshipType() {
    let types = [];
    if ($('#by_birth').is(':checked')) types.push('BY_BIRTH');
    if ($('#by_naturalization').is(':checked')) types.push('BY_NATURALIZATION');
    return types.join(',');
}

function getChildrenData() {
    let children = [];
    $('#table_name_of_child tbody tr').each(function() {
        children.push({
            name: $(this).find('td:eq(0) input').val(),
            birth_date: $(this).find('td:eq(1) input').val()
        });
    });
    return children;
}

function validateAndSavePDS() {
    // Required fields validation
    const requiredFields = [
        // Personal Information
        { id: 'profile_last_name', name: 'Surname' },
        { id: 'profile_first_name', name: 'First Name' },
        { id: 'profile_date_birth', name: 'Date of Birth' },
        { id: 'profile_place_birth', name: 'Place of Birth' },
        { id: 'application_sex', name: 'Sex' },
        { id: 'application_gender', name: 'Gender' },
        { id: 'profile_civil_status', name: 'Civil Status' },

        { id: 'profile_height', name: 'Height' },
        { id: 'profile_weight', name: 'Weight' },
        { id: 'profile_blood_type', name: 'Blood Type' },
        { id: 'profile_pagibig', name: 'PAGIBIG ID Number' },
        { id: 'profile_philhealth', name: 'PHILHEALTH ID Number' },
        { id: 'profile_tin', name: 'TIN ID Number' },
        { id: 'profile_sss_no', name: 'SSS ID Number' },
        { id: 'profile_mobile_number', name: 'Mobile Number' },

        // Residential Address
        { id: 'ref_province', name: 'Residential Province', isClass: true },
        { id: 'ref_city_mun', name: 'Residential City/Municipality', isClass: true },
        { id: 'ref_brgy', name: 'Residential Barangay', isClass: true },
        { id: 'res_zip_code', name: 'Residential ZIP Code' },

        // Permanent Address
        { id: 'per_province', name: 'Permanent Province', isClass: true },
        { id: 'per_city_mun', name: 'Permanent City/Municipality', isClass: true },
        { id: 'per_brgy', name: 'Permanent Barangay', isClass: true },
        { id: 'per_zip_code', name: 'Permanent ZIP Code' }
    ];

    // Check each required field
    for (let field of requiredFields) {
        let element = field.isClass ? $(`.${field.id}`) : $(`#${field.id}`);
        let value = element.val();

        if (!value || value.trim() === '') {
            // Scroll to the element
            $('html, body').animate({
                scrollTop: element.offset().top - 200
            }, 500);

            // Focus on the element
            element.focus();

            // Show error message
            Swal.fire({
                title: 'Required Field',
                text: `Please fill out ${field.name}`,
                icon: 'warning',
                confirmButtonText: 'OK'
            });

            // Add red border to highlight the field
            element.addClass('border-danger');

            // Remove red border after 5 seconds
            setTimeout(() => {
                element.removeClass('border-danger');
            }, 5000);

            return false;
        }
    }

    // Validate Number 40 fields
    const number40Fields = [
        {
            name: 'Indigenous Group Membership',
            yesId: 'btn_40_a_yes',
            noId: 'btn_40_a_no',
            detailsId: 'others_40_a_yes',
            detailsRequired: true
        },
        {
            name: 'Person with Disability',
            yesId: 'btn_40_b_yes',
            noId: 'btn_40_b_no',
            detailsId: 'others_40_b_yes',
            detailsRequired: true
        },
        {
            name: 'Solo Parent',
            yesId: 'btn_40_c_yes',
            noId: 'btn_40_c_no',
            detailsId: 'others_40_c_yes',
            detailsRequired: true
        }
    ];

    for (let field of number40Fields) {
        const yesChecked = $(`#${field.yesId}`).is(':checked');
        const noChecked = $(`#${field.noId}`).is(':checked');
        const detailsElement = $(`#${field.detailsId}`);
        const parentDiv = $(`#${field.yesId}`).closest('.border');

        // Check if neither Yes nor No is selected
        if (!yesChecked && !noChecked) {
            // Scroll to the element
            $('html, body').animate({
                scrollTop: parentDiv.offset().top - 200
            }, 500);

            // Show error message
            Swal.fire({
                title: 'Required Field',
                text: `Please indicate if you are a ${field.name}`,
                icon: 'warning',
                confirmButtonText: 'OK'
            });

            // Add red border to highlight the entire section
            parentDiv.addClass('border-danger');

            // Add red border to the radio buttons
            $(`#${field.yesId}, #${field.noId}`).addClass('border-danger');

            // Remove red borders after 5 seconds
            setTimeout(() => {
                parentDiv.removeClass('border-danger');
                $(`#${field.yesId}, #${field.noId}`).removeClass('border-danger');
            }, 5000);

            return false;
        }

        // If Yes is checked, validate details
        if (yesChecked && field.detailsRequired) {
            const detailsValue = detailsElement.val();
            if (!detailsValue || detailsValue.trim() === '') {
                // Scroll to the details field
                $('html, body').animate({
                    scrollTop: detailsElement.offset().top - 200
                }, 500);

                // Focus on the details field
                detailsElement.focus();

                // Show error message
                Swal.fire({
                    title: 'Required Field',
                    text: `Please provide details for ${field.name}`,
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });

                // Add red border to highlight both the section and the input field
                parentDiv.addClass('border-danger');
                detailsElement.addClass('border-danger');

                // Remove red borders after 5 seconds
                setTimeout(() => {
                    parentDiv.removeClass('border-danger');
                    detailsElement.removeClass('border-danger');
                }, 5000);

                return false;
            }
        }
    }


    // Citizenship Validation
    const filipinoRadio = $('#citizen_filipino').is(':checked');
    const dualCitizenRadio = $('#citizen_dual').is(':checked');
    const byBirthChecked = $('#by_birth').is(':checked');
    const byNaturalizationChecked = $('#by_naturalization').is(':checked');
    const citizenshipCountry = $('#citizenship_country').val();
    const citizenshipDiv = $('#citizenship_div');


    if (!filipinoRadio && !dualCitizenRadio) {
        // If neither Filipino nor Dual Citizenship is selected
        $('html, body').animate({ scrollTop: citizenshipDiv.offset().top - 200 }, 500);
        Swal.fire({ title: 'Required Field', text: 'Please select your Citizenship.', icon: 'warning', confirmButtonText: 'OK' });
        citizenshipDiv.addClass('border-danger');
        setTimeout(() => citizenshipDiv.removeClass('border-danger'), 5000);
        return false;
    }

    if (dualCitizenRadio) {
        if (!byBirthChecked && !byNaturalizationChecked) {
            $('html, body').animate({ scrollTop: $('#if_dual_citizen').offset().top - 200 }, 500);
            Swal.fire({ title: 'Required Field', text: 'Please select if Dual Citizenship is by Birth or Naturalization.', icon: 'warning', confirmButtonText: 'OK' });
            $('#if_dual_citizen').addClass('border-danger');
            setTimeout(() => $('#if_dual_citizen').removeClass('border-danger'), 5000);
            return false;
        }

        if (!citizenshipCountry || citizenshipCountry.trim() === '') {
            $('html, body').animate({ scrollTop: $('#citizenship_country').offset().top - 200 }, 500);
            Swal.fire({ title: 'Required Field', text: 'Please select your country of Citizenship.', icon: 'warning', confirmButtonText: 'OK' });
            $('#citizenship_country').addClass('border-danger');
            setTimeout(() => $('#citizenship_country').removeClass('border-danger'), 5000);
            return false;
        }
    }


    // If all validations pass, proceed with saving
    savePDS();
    return true;
}


function handleSISMissingField(){

    var field = $('#session-data').data('field');
    var fieldName = $('#session-data').data('field-name');

    if (field) {
        focusDivOnError(field, fieldName);
    }

}



/** FUNCTION FOR FOCUS ON DIV */
function focusDivOnError(divName, divDescription) {
    // Select the element by its name attribute
    let div = $("[name='" + divName + "']");

    if (div.length) {
        let divOffset = div.offset().top;
        divOffset -= 170; // Adjust this value as needed

        // Scroll to the div with animation
        $('html, body').animate({
            scrollTop: divOffset
        }, 500); // Adjust the animation speed as needed

        div.addClass('border-danger');

        // Add tabindex to make the div focusable if it doesn't already have it
        if (!div.attr('tabindex')) {
            div.attr('tabindex', -1);
        }

        // Focus on the div
        div.focus();

        Swal.fire({
            icon: 'warning',
            title: 'Ooopss..',
            text: "Please provide your "+divDescription+ ' and all required fields.',
            timerProgressBar: false,
            showCancelButton: false,
            confirmButtonText: 'Got it!',
        });

    } else {

        Swal.fire({
            icon: 'warning',
            title: 'Oooopss..',
            text: "No element found with the name attribute: "+divName,
            timerProgressBar: false,
            showConfirmButton: false,
            footer: '<a class="text-primary" href="https://www.facebook.com/DSSCICTCOfficial/" target="_blank">Please contact DSSC-ICTC</a>'
            //timer: 2000  // Close the alert after 1 second
        });
    }
}

