
var  _token = $('meta[name="csrf-token"]').attr('content');

$(document).ready(function() {
    // Listen for the form submission event
    $("#vehicle_details_form").submit(function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the form data
        var formData = $(this).serialize();

        // Perform the Ajax request
        $.ajax({
            url: "/schedule/add_Vehi_store", // Replace this with your server-side endpoint URL
            method: "POST",
            data: formData,
            success: function(response) {
                // Handle the server's response here
                console.log("Form submitted successfully!");
                console.log(response);
                // Manually close the modal

                    __modal_hide('vehicle_details_form');

            },
            error: function(error) {
                // Handle any errors that occurred during the submission
                console.error("Error submitting form:", error);
            }
        });
    });
});

