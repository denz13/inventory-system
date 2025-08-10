var token = $('meta[name="csrf-token"]').attr('content');
var tblResourceList;
var resourceId;
var inchargeId ;
var inchargeName;
var scheduleID;
var rescategoryID;
var resstatus; var formData = {};
var signatoryName = '';
var statusSignatory = '';
var deleteId = 0;
$(document).ready(function () {



   resourceIncharger();
   getCategories();

   initializeDataTable();
   populateDataTable();
   Searchsignatory();

   fetchSignatories();



        $('#res_serial_plate_no').on('blur', function() {
            var serial_PlateNo = $(this).val();
            $.ajax({
                type: 'GET',
                url: '/schedule/My-checkPlateNumber',
                data: {serialPlateNo: serial_PlateNo},
                success: function(response) {
                  if (response.exists) {
                    __notif_show(-1, 'ERROR SAVING', 'Resource with serial/plate number "' + serial_PlateNo + '" already exists!');
                    $('#res_serial_plate_no').val('');
                    $('#res_serial_plate_no').focus();
                    $('#res_serial_plate_no').addClass('warning-border');
                    $('#res_serial_plate_no').css({
                        'border-color': 'red',

                    })

                  } else {
                    $('#res_serial_plate_no').css({
                        'border-color': '',

                    })
                  }
                }, error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                }
            });

        });


        $("#res_Category").on("change", function () {
            var selectedOption = $(this).find(":selected").attr("data-id");
            $("#res_CategoryID").val(selectedOption);
        });


        $('#confirmDeleteButtonR').on('click', function () {
            resId = resourceId
            deleteResource(resId);

            __modal_hide('deleteConfirmationModalR');

        });

        $('#Updatebutton').on('click', function () {

            updateResourceData();
            populateDataTable();
            __modal_hide('updatemodal');

        });

        $('#btnimage').on('click', function() {
            var selectedCategory = $('#res_Category').find(':selected').text();

            // Debug log
            console.log('Selected Category:', selectedCategory);

            // Base required fields
            formData = {
                res_categoryID: $('#res_Category').val(),
                res_name: $('#res_name').val(),
                res_model: $('#res_model').val(),
                res_acquiDate: $('#res_acquiDate').val(),
                res_description: $('#res_description').val(),
                res_capacity: $('#res_capacity').val(),
                person_incharge: $('#agency_id').val(),
            };

            // Add serial number only if not Facilities
            if (selectedCategory !== 'Facilities') {
                formData.res_serial_plate_no = $('#res_serial_plate_no').val();
            }

            // Debug log
            console.log('Initial formData:', formData);

            // Check if required fields are empty
            var allFieldsFilled = true;
            var emptyFields = [];

            for (var key in formData) {
                // Skip validation for serial if category is Facilities
                if (selectedCategory === 'Facilities' && key === 'res_serial_plate_no') {
                    continue;
                }
                if (formData[key] === null || formData[key].trim() === "") {
                    allFieldsFilled = false;
                    emptyFields.push(key);
                }
            }

            // Debug log
            console.log('Empty fields:', emptyFields);

            if (!allFieldsFilled) {
                __notif_show(-1, 'ERROR SAVING', 'Please fill in all required fields: ' + emptyFields.join(', '));
                console.log('Incomplete Fields:', emptyFields);
                return;
            } else {
                console.log('All required fields filled. Proceeding with save...');
                // If there's an image in dropzone, trigger upload first
                if (Dropzone.instances.length > 0 && Dropzone.instances[0].getQueuedFiles().length > 0) {
                    console.log('Processing image upload first...');
                    Dropzone.instances[0].processQueue();
                } else {
                    console.log('No image to upload, saving directly...');
                    saveResourceData(formData);
                }
            }
        });

        $('#addReoucesBtn').on('click', function() {
            saveResourceData(formData)
        });

        // $(document).on('click', '[id^="btn_delete_signatories"]', function () {
        //     scheduleID = $(this).data('to-id');

        //     deleteSignatories(scheduleID);
        //     $(this).closest('.dropdown-menu').hide();
        // });

        $('.delete-btn').on('click', function() {
            var deleteId = $(this).data('id'); // Get the data-id value
            console.log('32452421');
            // Call your custom modal toggle function without passing deleteId
            __modal_toggle('deleteConfirmSignatory');

            // Set the deleteId to the confirm button inside the modal
            $('#deleteConfirmSignatoryBtn').data('deleted-id', deleteId);
        });
        $('#deleteConfirmSignatoryBtn').on('click', function() {
            var deletedId = $(this).data('deleted-id'); // Get the data-id value set previously


            deleteSignatories(deletedId);

        });

        $(document).on('click', '[id^="btn_status_signatories"]', function () {
            scheduleID = $(this).data('signatory-id');
            statusSignatory = $(this).data('status');
            changeStatusSignatories(scheduleID,statusSignatory);
            $(this).closest('.dropdown-menu').hide();
        });

        $(document).on('click', '[id^="btn_update_to"]', function () {
            resourceId = $(this).data('to-id');

         __modal_toggle('updatemodal');
            getResource(resourceId);


        });

        $(document).on('click', '[id^="btn_delete_2"]', function () {
            resourceId = $(this).data('to-id');

                    __modal_toggle('deleteConfirmationModalR');
        });

        $(document).on("keydown", "form", function (event) {
            // Check if the pressed key is Enter (key code 13)
            if (event.keyCode === 13) {
            event.preventDefault(); // Prevent the form from submitting
            return false; // Stop event propagation
            }
        });

        $('#signatorybtn').on('click', function(){
            signatoriesData = {
                sched_AgencyID: $('#signatory_id').val(),
                sched_recordID: $('#Signatory_type').val(),

                _token: token,
            };

            saveSignatories(signatoriesData);
        })
        toggleEdit('editBtn1', 'signatory_name', 'signatory_id', 1);
        toggleEdit('editBtn2', 'signatory_name2', 'signatory_id2', 2);
        toggleEdit('editBtn3', 'signatory_name3', 'signatory_id3', 3);
        toggleEdit('editBtn4', 'signatory_name4', 'signatory_id4', 4);

        $('#res_Category').on('change', function() {
            var selectedOption = $(this).find(':selected').text();

            // Get the fields we want to toggle
            var serialField = $('#res_serial_plate_no').closest('.sm\\:col-span-3');

            // Show/hide fields based on category
            if (selectedOption === 'Facilities') {
                serialField.hide();
                // Clear the values when hiding
                $('#res_serial_plate_no').val('');
            } else {
                serialField.show();
            }
        });

        // Add same logic for update modal
        $('#Res_category2').on('change', function() {
            var selectedOption = $(this).find(':selected').text();

            // Get the fields we want to toggle in the update modal
            var serialField = $('#res_serial_plate').closest('.col-span-12');

            // Show/hide fields based on category
            if (selectedOption === 'Facilities') {
                serialField.hide();
                // Clear the values when hiding
                $('#res_serial_plate').val('');
            } else {
                serialField.show();
            }
        });

});
function fetchSignatories() {
    $.ajax({
        url: '/schedule/My-SignatoryDataResource', // Endpoint to fetch existing signatories
        type: 'POST',
        success: function(response) {

            setDefaultValues(response);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching signatories:', error);
        }
    });
}

function setDefaultValues(data) {
    $('#signatory_name').val(null).trigger('change');
    $('#signatory_name').empty();
    $('#signatory_name2').val(null).trigger('change');
    $('#signatory_name2').empty();
    $('#signatory_name3').val(null).trigger('change');
    $('#signatory_name3').empty();
    $('#signatory_name4').val(null).trigger('change');
    $('#signatory_name4').empty();

    data.forEach(function(signatory) {
        var selectElement, hiddenInput;
        switch(signatory.sched_recordID) {
            case '1':
                selectElement = $('#signatory_name');
                hiddenInput = $('#signatory_id');
                break;
            case '2':
                selectElement = $('#signatory_name2');
                hiddenInput = $('#signatory_id2');
                break;
            case '3':
                selectElement = $('#signatory_name3');
                hiddenInput = $('#signatory_id3');
                break;
            case '4':
                selectElement = $('#signatory_name4');
                hiddenInput = $('#signatory_id4');
                break;
        }

        // Dynamically add the option
        var newOption = new Option(signatory.signatoryName, signatory.id, true, true);
        selectElement.append(newOption).trigger('change');

        // Set the hidden input value
        hiddenInput.val(signatory.id);


    });
}

function toggleEdit(buttonId, selectId, hiddenId, value) {
    const button = document.getElementById(buttonId);
    const select = document.getElementById(selectId);
    const hidden = document.getElementById(hiddenId);

    button.addEventListener('click', function () {
        if (select.disabled) {
            select.disabled = false;
            button.textContent = 'Save';
        } else {
            select.disabled = true;
            button.textContent = 'Edit';

            // Prepare data for saving

            const signatoriesData = {
                sched_AgencyID: hidden.value,
                sched_recordID: value,
                _token: token,
            };

            // AJAX request to save the data
            $.ajax({
                url: '/schedule/My-saveSignatoriesTripTicket',
                method: 'POST',
                data: signatoriesData,
                success: function(response) {
                    __notif_show(1, 'SUCCESS', 'Signatory Saved!');

                },
                error: function(xhr, status, error) {
                    console.error('Error saving data:', error);
                }
            });
        }
    });
}
function  changeStatusSignatories(scheduleID,statusSignatory){
    var data = {
        _token: _token,
        signatoryID: scheduleID,
        status: statusSignatory,
     };
    $.ajax({
        url: '/schedule/My-StatusSignatories',
        method: 'POST',
        data: data,
        dataType: 'json',
        beforeSend : function(){
            $('#loading-spinner').html('<i class="fas fa-spinner fa-spin"></i> Loading...');
        },
        success: function (response) {
            populateSignatoryTable();
            __notif_show(1, 'SUCCESS', 'Signatory Deleted!');

        },
        error: function (xhr, status, error) {
            __notif_show(-1, 'ERROR DELETING', 'Something went wrong!');
        }
    });
}


function saveResourceData(formData){
    var formDatas = formData;
    formDatas.res_photo = $('#res_photo').val();
    formDatas._token = $('meta[name="csrf-token"]').attr('content');

    // Debug log
    console.log('Sending data to server:', formDatas);

    // Submit AJAX request
    $.ajax({
        url: '/schedule/add_Res_store',
        method: 'POST',
        data: formDatas,
        dataType: 'json',
        success: function(response) {
            // Debug log
            console.log('Server response:', response);

            if(response.success) {
                __notif_show(1, 'SUCCESS', 'Data Saved!');
                // Clear form fields
                $('#res_name').val('');
                $('#res_model').val('');
                $('#res_serial_plate_no').val('');
                $('#res_acquiDate').val('');
                $('#res_description').val('');
                $('#res_capacity').val('');
                $('#person_incharge').val(null).trigger('change');
                $('#res_photo').val('');
                $('#res_Category').val(null).trigger('change');

                // Refresh the datatable
                populateDataTable();

                // Clear dropzone
                if (Dropzone.instances.length > 0) {
                    Dropzone.instances[0].removeAllFiles();
                }
            } else {
                console.error('Server returned error:', response);
                __notif_show(-1, 'ERROR SAVING', response.message || 'Something went wrong!');
            }
        },
        error: function(xhr, status, error) {
            // Detailed error logging
            console.error('AJAX Error:', {
                status: status,
                error: error,
                responseText: xhr.responseText,
                statusText: xhr.statusText
            });

            try {
                var errorResponse = JSON.parse(xhr.responseText);
                console.log('Parsed error response:', errorResponse);
                __notif_show(-1, 'ERROR SAVING', errorResponse.message || 'Something went wrong while saving the data!');
            } catch(e) {
                __notif_show(-1, 'ERROR SAVING', 'Something went wrong while saving the data!');
            }
        }
    });
}


function updateResourceData() {

    var updatedData = {
        res_categoryID: $('#Res_category2').val(),
        res_name: $('#Res_name').val(),
        res_model: $('#Res_model').val(),
        res_serial_plate_no: $('#res_serial_plate').val(),
        res_description: $('#Res_description').val(),
        res_incharge: $('#agency_id2').val(), // Assuming this is the ID of the person in charge
        res_status: $('#statusRes').val(),
    };

    // Perform an AJAX request to update the resource data
    $.ajax({
        url: '/schedule/My-updateResource', // Replace with the actual update route
        type: 'POST',
        data: {
            _token: _token,
            resourceId: resourceId, // Assuming resourceId is accessible here
            updatedData: updatedData,
        },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                __notif_show(1, 'SUCCESS', 'updated');

            } else {
                // Handle error, e.g., show an error message
                console.error('Error updating resource data:', response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error updating resource data:', error);
        }
    });
}

function deleteSignatories(deletedSignatory) {
     var data = {
        _token: _token,
        signatoryID: deletedSignatory,
     };
    $.ajax({
        url: '/schedule/My-deleteSignatories',
        method: 'POST',
        data: data,
        dataType: 'json',
        beforeSend : function(){
            $('#loading-spinner').html('<i class="fas fa-spinner fa-spin"></i> Loading...');
        },
        success: function (response) {
            __modal_hide('deleteConfirmSignatory');
            fetchSignatories();
            __notif_show(1, 'SUCCESS', 'Signatory Deleted!');

        },
        error: function (xhr, status, error) {
            __notif_show(-1, 'ERROR DELETING', 'Something went wrong!');
        }
    });
}

function Searchsignatory() {

    function initializeSelect2(elementId) {
        $(elementId).select2({
            placeholder: 'Select an employee...',
            allowClear: true,
            tags: true,
            minimumInputLength: 2,
            ajax: {
                url: '/schedule/My-getEmployee',
                dataType: 'json',
                delay: 250,
                processResults: function(data) {
                    return {
                        results: $.map(data.agencyEmployees, function(employee) {
                            return {
                                text: employee.firstname + ' ' + employee.lastname,
                                id: employee.id, // Use a unique identifier (e.g., employee ID) as the id
                                agencyid: employee.agencyid // Store the agency_id as a custom attribute
                            };
                        })
                    };
                }
            }
        }).on('select2:select', function(e) {
            // Get the agency_id from the custom attribute
            var agencyid = e.params.data.agencyid;
            $(this).siblings('input[type="hidden"]').val(agencyid);
        });
    }



    initializeSelect2('#signatory_name');
    initializeSelect2('#signatory_name2');
    initializeSelect2('#signatory_name3');
    initializeSelect2('#signatory_name4');
}
// function Searchsignatory() {

//     $('#signatory_name').select2({
//         placeholder: 'Select an employee...',
//         allowClear: true,
//         tags: true,
//         minimumInputLength: 2,
//         ajax: {
//             url: '/schedule/My-getEmployee',
//             dataType: 'json',
//             delay: 250,
//             processResults: function (data) {
//                 return {
//                     results: $.map(data.agencyEmployees, function (employee) {

//                         return {
//                             text: employee.firstname + ' ' + employee.lastname,
//                             id: employee.id, // Use a unique identifier (e.g., employee ID) as the id
//                             agencyid: employee.agencyid // Store the agency_id as a custom attribute

//                         };

//                     }),

//                 };

//             },

//         },

//     });

//     $('#signatory_name').on('select2:select', function (e) {
//         // Get the agency_id from the custom attribute
//         signatoryName = e.params.data.text;
//         var agencyid = e.params.data.agencyid;
//         $('#signatory_id').val(agencyid);

//     });

//     $('#signatory_name2').select2({
//         placeholder: 'Select an employee...',
//         allowClear: true,
//         tags: true,
//         minimumInputLength: 2,
//         ajax: {
//             url: '/schedule/My-getEmployee',
//             dataType: 'json',
//             delay: 250,
//             processResults: function (data) {
//                 return {
//                     results: $.map(data.agencyEmployees, function (employee) {

//                         return {
//                             text: employee.firstname + ' ' + employee.lastname,
//                             id: employee.id, // Use a unique identifier (e.g., employee ID) as the id
//                             agencyid: employee.agencyid // Store the agency_id as a custom attribute

//                         };

//                     }),

//                 };

//             },

//         },

//     });

//     $('#signatory_name2').on('select2:select', function (e) {
//         // Get the agency_id from the custom attribute
//         signatoryName = e.params.data.text;
//         var agencyid = e.params.data.agencyid;
//         $('#signatory_id2').val(agencyid);

//     });

//     $('#signatory_name3').select2({
//         placeholder: 'Select an employee...',
//         allowClear: true,
//         tags: true,
//         minimumInputLength: 2,
//         ajax: {
//             url: '/schedule/My-getEmployee',
//             dataType: 'json',
//             delay: 250,
//             processResults: function (data) {
//                 return {
//                     results: $.map(data.agencyEmployees, function (employee) {

//                         return {
//                             text: employee.firstname + ' ' + employee.lastname,
//                             id: employee.id, // Use a unique identifier (e.g., employee ID) as the id
//                             agencyid: employee.agencyid // Store the agency_id as a custom attribute

//                         };

//                     }),

//                 };

//             },

//         },

//     });

//     $('#signatory_name3').on('select2:select', function (e) {
//         // Get the agency_id from the custom attribute
//         signatoryName = e.params.data.text;
//         var agencyid = e.params.data.agencyid;
//         $('#signatory_id3').val(agencyid);


//     });

//     $('#signatory_name4').select2({
//         placeholder: 'Select an employee...',
//         allowClear: true,
//         tags: true,
//         minimumInputLength: 2,
//         ajax: {
//             url: '/schedule/My-getEmployee',
//             dataType: 'json',
//             delay: 250,
//             processResults: function (data) {
//                 return {
//                     results: $.map(data.agencyEmployees, function (employee) {

//                         return {
//                             text: employee.firstname + ' ' + employee.lastname,
//                             id: employee.id, // Use a unique identifier (e.g., employee ID) as the id
//                             agencyid: employee.agencyid // Store the agency_id as a custom attribute

//                         };

//                     }),

//                 };

//             },

//         },

//     });

//     $('#signatory_name4').on('select2:select', function (e) {
//         // Get the agency_id from the custom attribute
//         signatoryName = e.params.data.text;
//         var agencyid = e.params.data.agencyid;
//         $('#signatory_id4').val(agencyid);

//     });
// }
function getResource(resourceId) {
    $.ajax({
        url: '/schedule/My-getResourceData',
        type: 'POST',
        data: {
            _token: _token,
            resourceId: resourceId,
        },
        dataType: 'json',
        beforeSend: function () {

         //   $('#Res_category').html('<div id="loadingSpinner" style="display: none; text-align: center; font-size: 16px;"> <i class="fas fa-spinner fa-spin"></i> Loading </div>');
            $('#loading-spinner').html('<i class="fas fa-spinner fa-spin"></i> Loading...');
        },
        success: function (response) {
            $('#loading-spinner').removeClass('p-5');
            $('#loading-spinner').empty();
            $('#updates').css('display', 'block');
            getCategories2(response.data.res_categoryID);
            getStatusRes( response.data.res_status);

                rescategoryID = response.data.res_categoryID;
                $('#Res_name').val(response.data.res_name);
                $('#Res_model').val(response.data.res_model);
                $('#res_serial_plate').val(response.data.res_serial_plate_no);
                $('#Res_description').val(response.data.res_description);
               // $('#person_incharge2').val(response.data.res_incharge);
                resstatus = response.data.res_status;
                inchargeId = response.data.res_inchargeId;
                inchargeName = response.data.res_incharge;

               resourceIncharger2();
               $('#person_incharge2').append(new Option(inchargeName, inchargeId, true, true)).trigger('change');

               $('agency_2').val(inchargeId);



        },
        error: function (xhr, status, error) {
            console.error('Error fetching resource data:', error);
        }
    });
}
function getStatusRes(resstatus) {
    var statusRes = $('#statusRes');
    statusRes.empty();

    var defaultValue = resstatus === '1' ? 'Available' : 'Not Available';

    $('#statusRes').select2({
        placeholder: 'Select Status',
        allowClear: true,
        tags: true
    });

    // Add options to the dropdown
    var options = [
        { value: '1', id: 'available', text: 'Available' },
        { value: '0', id: 'not-available', text: 'Not Available' }
    ];

    options.forEach(function (option) {
        var optionElement = new Option(option.text, option.value);
        statusRes.append(optionElement);
    });



    // Set the default value based on resstatus
    $('#statusRes').val(resstatus).trigger('change');
}



function getCategories2(rescategoryID) {
    $.ajax({
        url: '/schedule/My-getCategories',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            var select2 = $('#Res_category2');
            select2.empty();
            $('#Res_category2').select2({
                placeholder: 'Select Resource Category',
                allowClear: true,
                tags: true
            });

            $.each(response, function (index, category) {
                // Create a new option element with the category name and category ID as value
                var option = new Option(category.category_Name, category.id);
                // Append the option to the select element
                select2.append(option);
            });

            if (rescategoryID) {
                $('#Res_category2').val(rescategoryID).trigger('change');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error fetching categories:', error);
        }
    });
}



function deleteResource(resourceId, callback) {

    $.ajax({
        url: '/schedule/My-deleteResource',
        method: 'POST',
        data: {
            _token: _token,
            resourceId: resourceId,
        },
        dataType: 'json',
        success: function (response) {

            __notif_show(1, 'SUCCESS', 'Resource Deleted');
                populateDataTable();

        },
        error: function (xhr, status, error) {

            // Optionally handle the error and call the callback with an error response
            __notif_show(1, 'ERROR', 'Failed to delete resource');
        }
    });
}



function initializeDataTable() {
    try {
        tblResourceList = $('#ResourceLisst').DataTable({
            // DataTable configuration options
            dom: "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
            renderer: 'bootstrap',
            info: false,
            bInfo: true,
            bJQueryUI: true,
            bProcessing: true,
            bPaginate: true,
            aLengthMenu: [[10, 25, 50, 100, 150, 200, 250, 300, -1], [10, 25, 50, 100, 150, 200, 250, 300, "All"]],
            iDisplayLength: 10,
            aaSorting: [],
            columnDefs: [
                { className: "dt-head-center", targets: [7] },
            ],
        });
    } catch (err) {
        console.log(err);
    }
}

// function populateSignatoryTable()
// {
//     $.ajax({
//         url: '/schedule/My-SignatoryTable',
//         method: 'POST',
//         type: 'POST',
//         data: {
//             _token: token,
//         },
//         dataType: 'json',
//         success: function (response) {
//             signatorytable.clear().draw();

//             response.forEach(function (signatoryData) {
//                 statusSignatory = signatoryData.status;
//                 var cd = "";
//                                 cd = '' +
//                                 '<tr>'+
//                                         '<td>' +signatoryData.id+'</td>'+
//                                         '<td>' + signatoryData.signatoryFirstName +  '</td>' +
//                                         '<td>' + signatoryData.signatoryLastName+ '</td>' +
//                                         '<td>' + signatoryData.signatoryType + '</td>' +
//                                         '<td class="text-center">' + signatoryData.status + '</td>' +
//                                         '<td>' +
//                                         '<div class="flex justify-center items-center">'+

//                                         '<div id="drop_down_close" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
//                                             '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
//                                                 '<div class="dropdown-menu w-40 zoom-in tooltip">'+
//                                                     '<div class="dropdown-content">'+
//                                                     signatoryData.can_status+
//                                                     signatoryData.can_delete+

//                                                     '</div>'+
//                                                 '</div>'+
//                                          '</div>'+
//                                     '</div>'+
//                                    ' </td>'+
//                                 '</tr>'+
//                                 '';
//             signatorytable.row.add($(cd)).draw();
//             });
//         },
//         error: function (error) {
//             console.error('Error fetching schedule data:', error);
//         },
//     });
// }


function populateDataTable() {
    $.ajax({
        url: '/schedule/My-getAllResources',
        method: 'POST',
        type: 'POST',
        data: {
            _token: token,
        },
        dataType: 'json',
        success: function (response) {
            tblResourceList.clear().draw();
            const categories = ["Logistics", "Equipments", "Facilities", "Others"];

            response.forEach(function (combinedData) {

                const category = categories[combinedData.res_categoryID - 1];

                var cd = "";
                                cd = '' +
                                '<tr>'+
                                        '<td hidden>'+combinedData.id+'</td>'+
                                        '<td class="tooltip cursor-pointer" title="">' + category +  ' </td>' +
                                        '<td>' + combinedData.res_name +  '</td>' +
                                        '<td>' + combinedData.res_model + '</td>' +
                                        '<td>' + combinedData.res_serial_plate_no + '</td>' +
                                        '<td>' + combinedData.res_description + ' </td>' +
                                        '<td>' + combinedData.res_incharge + '</td>' +
                                        '<td>' + combinedData.res_status + ' </td>' +

                                        '<td>' +
                                        '<div class="flex justify-center items-center">'+

                                        '<div id="drop_down_close" class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">'+
                                            '<a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <i class="fa fa-ellipsis-h items-center text-center text-primary"></i> </a>'+
                                                '<div class="dropdown-menu w-40 zoom-in tooltip">'+
                                                    '<div class="dropdown-content">'+
                                                    combinedData.can_update+
                                                    combinedData.can_delete+
                                                    '</div>'+
                                                '</div>'+
                                         '</div>'+
                                    '</div>'+
                                   ' </td>'+
                                '</tr>'+
                                '';
                               tblResourceList.row.add($(cd)).draw();
            });
        },
        error: function (error) {
            console.error('Error fetching schedule data:', error);
        },
    });
}

// Usage



function getCategories() {
    $.ajax({
        url: '/schedule/My-getCategories',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            var select2 = $('#res_Category');
            select2.empty();
            $('#res_Category').select2({
                placeholder: 'Select Resource Category',
                allowClear: true,
                tags: true
            });

            $.each(response, function (index, category) {
                // Create a new option element with the category name and data-id attribute
                var option = new Option(category.category_Name, category.id);
                $(option).attr('data-id', category.id);
                // Append the option to the select element
                select2.append(option);

            });

            $('#res_Category').val(null).trigger('change');
            // Initialize the Select2 dropdown
        },
        error: function (xhr, status, error) {
            console.error('Error fetching categories:', error);
        }
    });
}



function resourceIncharger() {

    $('#person_incharge').select2({
        placeholder: 'Select an employee...',
        allowClear: true,
        tags: true,
        minimumInputLength: 2,
        ajax: {
            url: '/schedule/My-getEmployee',
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
                return {
                    results: $.map(data.agencyEmployees, function (employee) {

                        return {
                            text: employee.firstname + ' ' + employee.lastname,
                            id: employee.id, // Use a unique identifier (e.g., employee ID) as the id
                            agencyid: employee.agencyid // Store the agency_id as a custom attribute

                        };

                    }),

                };

            },

        },

    });

    $('#person_incharge').on('select2:select', function (e) {
        // Get the agency_id from the custom attribute

        var agencyid = e.params.data.agencyid;
        $('#agency_id').val(agencyid);


    });
}
function resourceIncharger2() {

    $('#person_incharge2').select2({
        placeholder: 'Select an employee...',
        allowClear: true,
        tags: true,
        minimumInputLength: 2,
        ajax: {
            url: '/schedule/My-getEmployee',
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
                return {
                    results: $.map(data.agencyEmployees, function (employee) {

                        return {
                            text: employee.firstname + ' ' + employee.lastname,
                            id: employee.id, // Use a unique identifier (e.g., employee ID) as the id
                            agencyid: employee.agencyid // Store the agency_id as a custom attribute

                        };

                    }),

                };

            },

        },

    });


        $('#person_incharge2').on('select2:select', function (e) {
            // Get the agency_id from the custom attribute

            var agencyid = e.params.data.agencyid;
            $('#agency_id2').val(agencyid);


        });


}


function __modal_toggle(modal_id){

    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#'+modal_id));
    mdl.toggle();

}

function __modal_hide(modal_id){

    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#'+modal_id));
    mdl.hide();

}

// Modify Dropzone configuration
Dropzone.options.imageUpload = {
    autoProcessQueue: false,
    uploadMultiple: false,
    maxFiles: 1,
    maxFilesize: 5,
    acceptedFiles: "image/*",
    init: function() {
        var myDropzone = this;
        var formDataCopy;

        this.on("addedfile", function(file) {
            if (this.files.length > 1) {
                this.removeFile(this.files[0]);
            }
        });

        this.on("success", function(file, response) {
            if(response.success) {
                $('#res_photo').val(response.filename);
                // Now save the form data
                saveResourceData(formData);
            } else {
                __notif_show(-1, 'ERROR', 'Failed to upload image!');
            }
        });

        this.on("error", function(file, errorMessage) {
            __notif_show(-1, 'ERROR', 'Error uploading image: ' + errorMessage);
        });
    }
};
