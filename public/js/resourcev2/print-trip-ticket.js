$(document).ready(function() {
    // Add print functionality
    $('#print-ticket').on('click', function() {
        window.print();
    });
    
    // Auto-focus for immediate printing (optional)
    // Uncomment the line below if you want to automatically open print dialog
    // window.print();
    
    // Add close functionality
    $('#close-ticket').on('click', function() {
        window.close();
    });
    
    // Handle keyboard shortcuts
    $(document).on('keydown', function(e) {
        // Ctrl+P for print
        if (e.ctrlKey && e.keyCode === 80) {
            e.preventDefault();
            window.print();
        }
        // Escape to close
        if (e.keyCode === 27) {
            window.close();
        }
    });
});

// Function to print the ticket
function printTicket() {
    window.print();
}

// Function to close the window
function closeWindow() {
    window.close();
}
