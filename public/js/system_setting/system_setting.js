$(document).ready(function (){

    bpath = __basepath + "/";
    // load_datatables();
    load_system_settings_data();
});



var  _token = $('meta[name="csrf-token"]').attr('content');
var  file_path = "";

function load_path(fakepath){
    file_path = fakepath;

}

function filterSettings() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let table = document.getElementById('dt__system_settings');
    let rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        let cells = rows[i].getElementsByTagName('td');
        let found = false;

        // Loop through each cell in the row
        for (let j = 0; j < cells.length; j++) {
            let cellText = cells[j].innerText || cells[j].textContent;
            if (cellText.toLowerCase().indexOf(input) > -1) {
                found = true;
                break;
            }
        }

        // Toggle row visibility based on whether the search term was found
        rows[i].style.display = found ? "" : "none";
    }
}

//Initialize datatable system settings
function load_datatables() {
    try{
        /***/
        dt__system_settings = $('#dt__system_settings').DataTable({
            dom:
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-6 text_left_1'l><'intro-y col-span-6 text_left_1'f>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'tr>>" +
                "<'grid grid-cols-12 gap-6 mt-5'<'intro-y col-span-12'<'datatable_paging_1'p>>>",
            renderer: 'bootstrap',
            "info": false,
            "bInfo":true,
            "bJQueryUI": true,
            "bProcessing": true,
            "bPaginate" : true,
            "aLengthMenu": [[10,25,50,100,150,200,250,300,-1], [10,25,50,100,150,200,250,300,"All"]],
            "iDisplayLength": 10,
            "aaSorting": [],

            columnDefs:
                [
                    { className: "dt-head-center", targets: [  5 ] },
                ],
        });


        /***/
    }catch(err){  }
}

function load_system_settings_data() {
    $.ajax({
        url: bpath + 'admin/load/system/settings/data',
        type: "POST",
        data: {
            _token: _token,
        },
        success: function (response) {
            console.log("Raw response:", response); // Log the raw response

            // Clear the existing table content
            $('#dt__system_settings tbody').empty();

            // Parse the response
            const data = typeof response === "string" ? JSON.parse(response) : response;

            if (Array.isArray(data) && data.length > 0) {
                $('.item_counter').text(`${data.length} Items`);

                // Use .each() to iterate through the data
                $(data).each(function (index, item) {
                    let id = item.id;  // Use dot notation
                    let key = item.key || 'N/A';  // Default to 'N/A' if key is null
                    let value = item.value || 'N/A'; // Default to 'N/A' if value is null
                    let description = item.description || 'N/A'; // Default to 'N/A' if description is null
                    let image = item.image;  // Assuming you want to use value as image source
                    let write = item.write;  // Assuming these contain HTML for actions
                    let delete_ = item.delete; // Assuming these contain HTML for actions

                    let has_image = image ? `
                        <div class="w-10 h-10 image-fit zoom-in -ml-5">
                            <img src="${bpath}uploads/settings/${image}" data-action="zoom" class="tooltip rounded-full">
                        </div>
                    ` : '<div class="w-10 h-10 image-fit zoom-in -ml-5"></div>';

                    let cd = `
                        <tr>
                            <td>
                                <div class="whitespace-nowrap type">
                                    <span class="text">${id}</span>
                                </div>
                                <span class="hidden">${id}</span>
                            </td>
                            <td class="station">
                                <div class="flex items-center whitespace-nowrap text-${key}">
                                    <div class="w-2 h-2 bg-${key} rounded-full mr-3"></div>
                                    ${key}
                                </div>
                                <span class="hidden">${key}</span>
                            </td>
                            <td class="destination">
                                <div class="flex items-center whitespace-nowrap text-${value}">
                                    <div class="w-2 h-2 bg-${value} rounded-full mr-3"></div>
                                    ${value}
                                </div>
                                <span class="hidden">${value}</span>
                            </td>
                            <td class="destination">
                                <div class="flex items-center whitespace-nowrap text-${description}">
                                    <div class="w-2 h-2 bg-${description} rounded-full mr-3"></div>
                                    ${description}
                                </div>
                                <span class="hidden">${description}</span>
                            </td>
                            <td class="destination">
                                <div class="flex items-center whitespace-nowrap text-${image}">
                                    <div class="w-2 h-2 bg-${image} rounded-full mr-3"></div>
                                    ${has_image}
                                </div>
                                <span class="hidden">${description}</span>
                            </td>
                            <td>
                                <div class="flex justify-center items-center">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip dropdown" title="More Action">
                                        <a class="flex justify-center items-center" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown">
                                            <i class="fa fa-ellipsis-h items-center text-center text-primary"></i>
                                        </a>
                                        <div class="dropdown-menu w-40">
                                            <div class="dropdown-content">
                                                ${write || ''}
                                                ${delete_ || ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;

                    // Append the row to the table body
                    $('#dt__system_settings tbody').append(cd);
                });
                let input = document.getElementById('searchInput').value.toLowerCase();
                if (input) {
                    filterSettings();
                }

            } else {
                // Handle the case where data is empty or not an array
                $('.item_counter').text(`0 Items`);
                $('#dt__system_settings tbody').append('<tr><td colspan="6" class="text-center">No items found.</td></tr>');
            }
        },
        error: function (xhr, status, error) {
            console.error("Error loading data:", error); // Log the error
            alert("An error occurred while loading system settings data. Please try again.");
        }
    });

}

// Function to handle delete confirmation and action
$("body").on("click", "#btn_delete_ss", function () {
    const ss_id = $(this).data('ss-id');

    Swal.fire({
        title: "Are you sure to dismiss?",
        text: "This action cannot be undone.",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        cancelButtonColor: "#6e6e6e",
        confirmButtonText: '<i class="icofont-trash w-3 h-3 mr-2"></i>Yes',

        preConfirm: function () { },
    }).then((result) => {
        if (result.value == true) {
            // Proceed to delete
            deleteSystemSetting(ss_id);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
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

// Function to delete a system setting
function deleteSystemSetting(ss_id) {
    $.ajax({
        url: "remove/ss",
        type: "POST",
        data: {
            _token: _token,
            ss_id: ss_id,
        },
        cache: false,
        success: function () {
            showNotification("Deleted!", "System setting deleted permanently!", "success", 1000);
            load_system_settings_data(); // Refresh data
        },
        error: function () {
            showNotification("Error!", "Failed to delete system setting.", "error");
        }
    });
}

// Function to handle update action
$("body").on("click", "#btn_update_ss", function () {
    const ss_id = $(this).data('ss-id');
    document.getElementById('save_system_setting').innerText = "Update";
    $('#modal_set_update_create').val("Update");

    $.ajax({
        url: "/admin/load/ss/details",
        type: "POST",
        data: {
            _token: _token,
            ss_id: ss_id,
        },
        cache: false,
        success: function (data) {
            populateUpdateModal(JSON.parse(data));
        },
        error: function () {
            showNotification("Error!", "Failed to load system setting details.", "error");
        }
    });
});

// Function to populate the update modal
function populateUpdateModal(data) {
    clear_add_update_modal(); // Ensure modal is cleared before populating

    $('#modal_set_update_id').val(data['get_ss']['id']);
    $('#modal_set_key').val(data['get_ss']['key']);
    $('#modal_set_value').val(data['get_ss']['value']);
    $('#modal_set_desc').val(data['get_ss']['description']);
    $('#modal_set_link').val(data['get_ss']['link']);
    $('#modal_set_current_logo').val(data['get_ss']['image']);

    const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#add_new_parameter_modal'));
    mdl.show();
}

// Function to handle the button for adding a new parameter
$("body").on("click", ".add_new_parameter_btn", function () {
    document.getElementById('save_system_setting').innerText = "Save";
    $('#save_system_setting').innerText = "Save";
    $('#modal_set_update_create').val("Save");
    clear_add_update_modal(); // Clear the modal for new entry
});

// Function to show notifications
function showNotification(title, text, icon, timer) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: timer || null,
        buttons: false,
    });
}

// Function to clear modal inputs (to be defined based on your needs)
function clear_add_update_modal() {
    // Clear all modal input fields
    $('#modal_set_update_id').val('');
    $('#modal_set_key').val('');
    $('#modal_set_value').val('');
    $('#modal_set_desc').val('');
    $('#modal_set_link').val('');
    $('#modal_set_current_logo').val('');
}



$("body").on("click", "#save_system_setting", function () {
    // Gather the data from the modal inputs
    var ss_id = $('#modal_set_update_id').val();
    var key = $('#modal_set_key').val();
    var value = $('#modal_set_value').val();
    var description = $('#modal_set_desc').val();
    var link = $('#modal_set_link').val();
    var current_logo = $('#modal_set_current_logo').val();

    // Create a FormData object to send the data
    var formData = new FormData();
    formData.append('_token', _token); // CSRF token
    formData.append('modal_set_update_id', ss_id);
    formData.append('modal_set_key', key);
    formData.append('modal_set_value', value);
    formData.append('modal_set_desc', description);
    formData.append('modal_set_link', link);

    // Log file input to check if it exists
    var imageUpload = $('#modal_set_imageUpload')[0].files[0];
    if (imageUpload) {
        console.log("File selected:", imageUpload.name, "Size:", imageUpload.size, "Type:", imageUpload.type);
        formData.append('modal_set_imageUpload', imageUpload);
    } else {
        console.log("No file selected.");
    }

    // Perform the AJAX request
    $.ajax({
        url: '/admin/add/setting',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Handle success (you can refresh your data or close the modal)
            Swal.fire({
                title: "Success",
                text: "Parameter added successfully!",
                type: "success",
                timer: 2000,
                showConfirmButton: false
            });
            load_system_settings_data(); // Refresh the settings list
            const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#add_new_parameter_modal'));
            mdl.hide();
        },
        error: function (xhr, status, error) {
            // Handle errors (show an error message)
            Swal.fire({
                title: "Error",
                text: "Failed to add parameter.",
                type: "error",
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
});
