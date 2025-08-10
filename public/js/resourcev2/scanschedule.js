// Import Lucide icons


document.addEventListener('DOMContentLoaded', function() {


    const qrModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#qrCodeModal"));
    const departureArrivalModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#departureArrivalModal"));
    let html5QrcodeScanner = null;
    let currentScheduleId = null;
    let lastScannedCode = null;
    let lastScannedTime = 0;
    let qrCodeInstance = null;
    let scanTimeout = null;

    // Device Scanner Support
    const deviceScanner = document.getElementById('deviceScanner');
    let scanBuffer = '';
    const SCAN_DELAY = 100; // Minimum delay between scans in milliseconds

    deviceScanner.addEventListener('input', function(e) {
        scanBuffer = e.target.value;
    });

    deviceScanner.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const currentTime = new Date().getTime();
            
            // Prevent duplicate scans within SCAN_DELAY milliseconds
            if (scanBuffer === lastScannedCode && (currentTime - lastScannedTime) < SCAN_DELAY) {
                scanBuffer = '';
                e.target.value = '';
                return;
            }

            if (scanBuffer.trim() !== '') {
                lastScannedCode = scanBuffer;
                lastScannedTime = currentTime;
                processScannedCode(scanBuffer);
                scanBuffer = '';
                e.target.value = '';
            }
        }
    });

    // Focus the device scanner input on page load
    deviceScanner.focus();

    // Refocus device scanner when clicking anywhere on the document
    document.addEventListener('click', function() {
        deviceScanner.focus();
    });

    // Initialize QR scanner when the scan button is clicked
    document.getElementById('openQrScanner').addEventListener('click', function() {
        const qrScannerModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#qrScannerModal"));
        qrScannerModal.show();
        
        // Initialize QR scanner only when modal is shown
        if (!html5QrcodeScanner) {
            html5QrcodeScanner = new Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                rememberLastUsedCamera: true,
            });
            html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        }
    });

    // Show QR Code for specific schedule
    document.querySelectorAll('.show-qr').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const scheduleId = this.dataset.scheduleId;
            showScheduleQrCode(scheduleId);
        });
    });

    // Handle departure button click
    document.getElementById('btnDeparture').addEventListener('click', function() {
        if (currentScheduleId) {
            updateScheduleStatus(currentScheduleId, 'departed');
        }
    });

    // Handle arrival button click
    document.getElementById('btnArrival').addEventListener('click', function() {
        if (currentScheduleId) {
            updateScheduleStatus(currentScheduleId, 'arrived');
        }
    });

    // Download QR Code
    document.getElementById('download-qr').addEventListener('click', function() {
        const qrDisplay = document.getElementById('qrcode-display');
        const canvas = qrDisplay.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'schedule-qr.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    });

    function updateScheduleStatus(scheduleId, status) {
        const url = status === 'departed' ? 
            `/resource-v2/action-departure/${scheduleId}` : 
            `/resource-v2/action-arrival/${scheduleId}`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                schedule_id: scheduleId,
                status: status
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update schedule status');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Close the departure/arrival modal
                departureArrivalModal.hide();

                // Update success message
                document.getElementById('success-message').textContent = data.message;

                // Show success modal
                const successModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#success-modal-preview"));
                successModal.show();

                // Add event listener for when success modal is hidden
                document.querySelector("#success-modal-preview").addEventListener('hidden.tw.modal', function() {
                    // Reload the page after modal is hidden
                    window.location.reload();
                }, { once: true }); // Use once: true to ensure the event listener is removed after execution
            } else {
                throw new Error(data.message || 'Failed to update schedule status');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Failed to update schedule status',
                type: 'error',
                confirmButtonText: 'OK'
            });
        });
    }

    function showScheduleQrCode(scheduleId) {
        // Show loading state
        const qrDisplay = document.getElementById('qrcode-display');
        if (!qrDisplay) {
            console.error('QR display element not found');
            return;
        }

        qrDisplay.innerHTML = '<div class="flex items-center justify-center"><div class="loading loading-spinner loading-lg"></div></div>';
        
        // Show the modal first
        qrModal.show();
        
        fetch(`/resource-v2/scan-get-schedule/${scheduleId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Schedule not found');
                } else if (response.status === 403) {
                    throw new Error('Schedule is not approved');
                }
                throw new Error('Failed to fetch schedule details');
            }
            return response.json();
        })
        .then(data => {
            const qrData = {
                control_no: data.control_no,
                id: data.id
            };

            // Create new QR code
            const qr = new QRious({
                element: document.createElement('canvas'),
                value: JSON.stringify(qrData),
                size: 256, // Increased size for better visibility
                level: 'H', // High error correction level
                padding: 25 // Add some padding around the QR code
            });

            // Clear previous QR code
            qrDisplay.innerHTML = '';

            // Create a wrapper div for the QR code
            const qrWrapper = document.createElement('div');
            qrWrapper.className = 'flex items-center justify-center w-full relative';
            qrWrapper.style.minHeight = '300px'; // Ensure consistent height

            // Add the QR code to the wrapper
            qrWrapper.appendChild(qr.element);

            // Create and add the centered logo
            const logoWrapper = document.createElement('div');
            logoWrapper.className = 'absolute';
            logoWrapper.style.top = '50%';
            logoWrapper.style.left = '50%';
            logoWrapper.style.transform = 'translate(-50%, -50%)';
            logoWrapper.style.backgroundColor = 'white';
            logoWrapper.style.padding = '5px';
            logoWrapper.style.borderRadius = '5px';
            logoWrapper.style.width = '40px'; // Slightly smaller for better QR code readability
            logoWrapper.style.height = '40px';
            logoWrapper.style.display = 'flex';
            logoWrapper.style.alignItems = 'center';
            logoWrapper.style.justifyContent = 'center';
            logoWrapper.style.boxShadow = '0 0 5px rgba(0,0,0,0.1)';

            const logo = document.createElement('img');
            logo.src = window.AGENCY_LOGO_URL;
            logo.style.maxWidth = '100%';
            logo.style.maxHeight = '100%';
            logo.style.objectFit = 'contain';

            // Add error handling for the logo
            logo.onerror = function() {
                console.error('Error loading logo image');
                logoWrapper.remove(); // Remove the logo wrapper if image fails to load
            };

            logoWrapper.appendChild(logo);
            qrWrapper.appendChild(logoWrapper);

            // Display QR Code with logo
            qrDisplay.appendChild(qrWrapper);

            // Display schedule details
            const scheduleDetails = document.getElementById('schedule-details');
            if (scheduleDetails) {
                scheduleDetails.innerHTML = `
                    <div class="font-medium text-lg">${data.control_no}</div>
                    <div class="text-slate-500 mt-2">
                        <div class="mb-1"><strong>Office:</strong> ${data.office}</div>
                        <div class="mb-1"><strong>Driver:</strong> ${data.driver}</div>
                        <div class="mb-1"><strong>Destination:</strong> ${data.destination}</div>
                        <div class="mb-1"><strong>Start:</strong> ${data.start_datetime}</div>
                        <div class="mb-1"><strong>End:</strong> ${data.end_datetime}</div>
                        ${data.departure_time ? `<div class="mb-1"><strong>Departure:</strong> ${data.departure_time}</div>` : ''}
                        ${data.arrival_time ? `<div class="mb-1"><strong>Arrival:</strong> ${data.arrival_time}</div>` : ''}
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (qrDisplay) {
                qrDisplay.innerHTML = `
                    <div class="text-center text-red-500">
                        <div class="mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle w-6 h-6 mx-auto">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                        </div>
                        <div>${error.message}</div>
                    </div>
                `;
            }
        });
    }

    function processScannedCode(scannedData) {
        // Show loading state if using device scanner
        const resultDiv = document.getElementById('result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="alert alert-pending show mb-2" role="alert">
                    <div class="flex items-center">
                        <div class="font-medium text-lg">Processing...</div>
                    </div>
                </div>
            `;
        }

        // Process the scanned QR code
        fetch('/resource-v2/process-qr-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Accept': 'application/json'
            },
            body: JSON.stringify({ qr_code: scannedData })
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Schedule not found');
                } else if (response.status === 403) {
                    throw new Error('Schedule is found but not approved');
                } else if (response.status === 400) {
                    throw new Error('Invalid QR code');
                }
                throw new Error('Failed to process QR code');
            }
            return response.json();
        })
        .then(data => {
            // Stop scanning if using camera
            if (html5QrcodeScanner) {
                html5QrcodeScanner.clear();
                html5QrcodeScanner = null;
            }

            // Close scanner modal if open
            const scannerModal = tailwind.Modal.getOrCreateInstance(document.querySelector("#qrScannerModal"));
            const modalElement = document.querySelector("#qrScannerModal");
            if (modalElement && modalElement.classList.contains('show')) {
                scannerModal.hide();
            }

            // Store the schedule ID
            currentScheduleId = data.data.id;

            // Update schedule info and show departure/arrival modal
            setTimeout(() => {
                updateScheduleInfoDisplay(data.data);
                departureArrivalModal.show();
            }, 500);
        })
        .catch(error => {
            console.error('Error:', error);
            // Show error in modal or alert
            Swal.fire({
                title: 'Error',
                text: error.message || 'Failed to process QR code',
                type: 'error'
            });
        });
    }

    function onScanSuccess(decodedText, decodedResult) {
        // Prevent duplicate scans within 5 seconds
        if (lastScannedCode === decodedText && scanTimeout) {
            return;
        }

        lastScannedCode = decodedText;
        if (scanTimeout) {
            clearTimeout(scanTimeout);
        }
        scanTimeout = setTimeout(() => {
            lastScannedCode = null;
            scanTimeout = null;
        }, 5000);

        // Process the QR code
        processQrCode(decodedText);
    }

    function onScanFailure(error) {
        // Handle scan failure silently
    }

    function onScanError(error) {
        // Handle scan errors if needed
        console.warn(`QR Scan Error: ${error}`);
    }

    function processQrCode(qrCode) {
        $.ajax({
            url: '/resource/process-qr-code',
            method: 'POST',
            data: {
                qr_code: qrCode,
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                if (response.success) {
                    displayScheduleDetails(response.data);
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.message,
                        type: 'error'
                    });
                }
            },
            error: function(xhr) {
                let errorMessage = 'An error occurred while processing the QR code';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                Swal.fire({
                    title: 'Error',
                    text: errorMessage,
                    type: 'error'
                });
            }
        });
    }

    function displayScheduleDetails(schedule) {
        // // Update modal content
        // $('#scheduleControlNo').text(schedule.control_no);
        // $('#scheduleOffice').text(schedule.office);
        // $('#scheduleDriver').text(schedule.driver);
        // $('#scheduleDestination').text(schedule.destination);
        // $('#scheduleStartDateTime').text(schedule.start_datetime);
        // $('#scheduleEndDateTime').text(schedule.end_datetime);
        // $('#scheduleStatus').text(schedule.status);
        
        // // Update departure/arrival info
        // $('#departureDatetime').text(schedule.departure_time || 'Not yet departed');
        // $('#arrivalDatetime').text(schedule.arrival_time || 'Not yet arrived');

        // Show/hide action buttons based on status
        updateActionButtons(schedule);

        // Store schedule ID for actions
        $('#scheduleDetailsModal').data('schedule-id', schedule.id);

        // Show the modal
        $('#scheduleDetailsModal').modal('show');
    }

    function updateActionButtons(schedule) {
        const departBtn = $('#departBtn');
        const arriveBtn = $('#arriveBtn');

        // Hide both buttons initially
        departBtn.hide();
        arriveBtn.hide();

        if (!schedule.departure_time && schedule.status === 'Approved') {
            departBtn.show();
        } else if (schedule.departure_time && !schedule.arrival_time) {
            arriveBtn.show();
        }
    }

    function updateScheduleInfoDisplay(details) {
        const scheduleInfo = document.getElementById('schedule-info');
        scheduleInfo.innerHTML = `
            <div class="text-lg font-medium mb-3">Schedule Information</div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p><strong>Control No:</strong> ${details.control_no}</p>
                    <p><strong>Office:</strong> ${details.office}</p>
                    <p><strong>Driver:</strong> ${details.driver}</p>
                    <p><strong>Destination:</strong> ${details.destination}</p>
                </div>
                <div>
                    <p><strong>Start:</strong> ${details.start_datetime}</p>
                    <p><strong>End:</strong> ${details.end_datetime}</p>
                    <p><strong>Status:</strong> ${details.status}</p>
                    ${details.departure_time ? `<p><strong>Departure:</strong> ${details.departure_time}</p>` : ''}
                    ${details.arrival_time ? `<p><strong>Arrival:</strong> ${details.arrival_time}</p>` : ''}
                </div>
            </div>
        `;

        // Disable buttons based on status
        const btnDeparture = document.getElementById('btnDeparture');
        const btnArrival = document.getElementById('btnArrival');

        if (details.departure_time) {
            btnDeparture.disabled = true;
            btnDeparture.classList.add('opacity-50');
        } else {
            btnDeparture.disabled = false;
            btnDeparture.classList.remove('opacity-50');
        }

        if (details.arrival_time || !details.departure_time) {
            btnArrival.disabled = true;
            btnArrival.classList.add('opacity-50');
        } else {
            btnArrival.disabled = false;
            btnArrival.classList.remove('opacity-50');
        }

        // Refocus the device scanner
        document.getElementById('deviceScanner').focus();
    }

    // Clean up when modal is hidden
    document.querySelector("#qrScannerModal").addEventListener('hidden.tw.modal', function() {
        if (html5QrcodeScanner) {
            html5QrcodeScanner.clear();
            html5QrcodeScanner = null;
        }
        const resultDiv = document.getElementById('result');
        if (resultDiv) {
            resultDiv.innerHTML = '';
        }
    });

    // Clean up when QR code modal is hidden
    document.querySelector("#qrCodeModal").addEventListener('hidden.tw.modal', function() {
        const qrDisplay = document.getElementById('qrcode-display');
        const scheduleDetails = document.getElementById('schedule-details');
        
        if (qrDisplay) {
            qrDisplay.innerHTML = '';
        }
        if (scheduleDetails) {
            scheduleDetails.innerHTML = '';
        }
    });

    // Reinitialize scanner when modal is hidden
    $('#scheduleDetailsModal').on('hidden.bs.modal', function() {
        initializeScanner();
    });

    // View Schedule Details
    $('.view-schedule').click(function() {
        const scheduleId = $(this).data('id');
        
        $.ajax({
            url: `/resource-v2/scan-get-schedule/${scheduleId}`,
            method: 'GET',
            success: function(schedule) {
                displayScheduleDetails(schedule);
            },
            error: function(xhr) {
                let errorMessage = 'An error occurred while fetching schedule details';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                Swal.fire({
                    title: 'Error',
                    text: errorMessage,
                    type: 'error'
                });
            }
        });
    });

    // Initialize QR Scanner
    function initializeScanner() {
        if (html5QrcodeScanner) {
            html5QrcodeScanner.clear();
        }

        html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader", 
            { 
                fps: 10,
                qrbox: 250,
                rememberLastUsedCamera: true
            }
        );

        html5QrcodeScanner.render(onScanSuccess, onScanError);
    }
});
