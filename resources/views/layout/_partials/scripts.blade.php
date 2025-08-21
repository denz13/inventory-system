<!--<script
    src="../https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js">
</script>
<script src="../https://maps.googleapis.com/maps/api/js?key=[" your-google-map-api"]&libraries=places"></script>-->

<!-- Load FilePond from CDN (simple and reliable) -->
<script src="https://unpkg.com/filepond/dist/filepond.js"></script>

<script src="{{ url('') }}/dist/js/app.js"></script>
<script src="{{ url('') }}/assets/jquery/jquery-3.6.1.min.js"></script>
<script src="{{ url('') }}/assets/datatable/datatables.min.js"></script>
<script src="{{ url('') }}/assets/toastify/toastify.js"></script>
<script src="{{ url('') }}/assets/litepicker/dist/litepicker.js"></script>
<!--<script src="{{ url('') }}/assets/litepicker/dist/litepicker.umd.js"></script>-->
<script src="{{ url('') }}/assets/litepicker/dist/plugins/ranges.js"></script>
<script src="{{ url('') }}/assets/dayjs/dayjs.min.js"></script>
{{-- <script src="{{ url('') }}/js/notification.js{{ GET_RES_TIMESTAMP() }}"></script>
<script src="{{ url('') }}/js/notificationcore.js{{ GET_RES_TIMESTAMP() }}"></script>
<script src="{{ url('') }}/assets/uniupload/uniupload.js{{ GET_RES_TIMESTAMP() }}"></script>
<script src="{{ url('') }}/js/datepicker.js{{ GET_RES_TIMESTAMP() }}"></script> --}}




<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

<!-- FilePond already loaded at the top -->
{{--
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script> --}}

<!-- Plugin Js-->
<!--
<script src="{{ url('') }}/assets/bundles/dataTables.bundle.js"></script>
-->




<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script src="{{ url('') }}/vendor/sweetalert2/dist/sweetalert2.min.js"></script>

<script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>

{{-- <script src="{{ BASEPATH() }}/vendor/select2/js/select2.js{{ GET_RES_TIMESTAMP() }}"></script> --}}

<link rel="stylesheet" href="{{ url('') }}/src/js/app.js" />

<script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>

{{-- <script type="text/javascript"
    src="{{ url('') }}/vendor/tooltipster/js/tooltipster.bundle.min.js{{ GET_RES_TIMESTAMP() }}"></script> --}}

{{-- <script src="{{ BASEPATH() }}/js/common.js{{ GET_RES_TIMESTAMP() }}"></script> --}}


<script src="{{ url('') }}/assets/bundles/apexcharts.bundle.js"></script>


<script src="{{ url('') }}/assets/dayjs/dayjs.min.js"></script>


<script src="{{ url('') }}/assets/filepond-master/dist/filepond.js"></script>
<script src="{{ url('') }}/assets/filepond-master/dist/filepond.min.js"></script>
<script
    src="{{ url('') }}/assets/filepond-master/dist/file-size-validation/filepond-plugin-file-validate-size.min.js">
</script>
<script
    src="{{ url('') }}/assets/filepond-master/dist/filepond-plugin-file-validate-type/filepond-plugin-file-validate-type.min.js">
</script>
<script
    src="{{ url('') }}/assets/filepond-master/dist/filepond-plugin-image-preview/filepond-plugin-image-preview.min.js">
</script>

<script
    src="{{ url('') }}/assets/filepond-master/dist/filepond-plugin-image-edit/filepond-plugin-image-edit.min.js">
</script>

<script
    src="{{ url('') }}/assets/filepond-master/dist/filepond-plugin-image-exif-orientation/filepond-plugin-image-exif-orientation.min.js">
</script>
{{--
<script src="{{url('')}}/assets/filepond-master/pintura/pintura-iife.js"></script> --}}


<script src="{{ url('') }}/assets/jquery-filepond-master/filepond.jquery.js"></script>

<!-- Font Awesome 6.2.1 JavaScript -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/js/all.min.js"
    integrity="sha512-rpLlll167T5LJHwp0waJCh3ZRf7pO6IT1+LZOhAyP6phAirwchClbTZV3iqL3BMrVxIYRbzGTpli4rfxsCK6Vw=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>


<!-- Include Toastr JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js"></script>

<div id="bom_construction_modal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body p-5">
                <div class="alert alert-pending-soft show" role="alert">
                    <div class="flex items-center">
                        <div class="font-medium text-lg">Under Maintenance</div>
                    </div>
                    <div class="mt-3">We’re working hard to bring you something great! This is currently under development. Please check back soon for updates. <br> <br> Thank you for your patience!</div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    function close_modal(id) {
        const myModal = tailwind.Modal.getOrCreateInstance(document.querySelector(id));
        myModal.hide();
    }

    function open_modal(id) {
        const myModal = tailwind.Modal.getOrCreateInstance(document.querySelector(id));
        myModal.show();
    }

    function construction_modal() {
        const myModal = tailwind.Modal.getOrCreateInstance(document.querySelector('#bom_construction_modal'));
        myModal.show();
    }

    function bom_pad(number) {
        return (number < 10 ? '0' : '') + number;
    }

    function bom_date_format(date) {
        try {
            let year = date.getFullYear(),
                month = bom_pad(date.getMonth()+1),
                day = bom_pad(date.getDate().toString());

            date  = year+'-'+month+'-'+day;

            return date;
        } catch(error) {
            console.log(error.message);
        }
    }

    $('#mode_change').click(function() {
        $.ajax({
            url: "/dashboard/change_mode",
            type: "GET",
            dataType: "json",
            success: function(response) {
                if (response) {
                    location.reload();
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    });
</script>

<script src="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js"></script>

{{-- <script src="{{ url('') }}/assets/html5-qrcode/html5-qrcode.min.js{{ GET_RES_TIMESTAMP() }}"></script> --}}

<script>
        document.addEventListener('DOMContentLoaded', function() {
        const notificationToggle = document.getElementById('notificationToggle');
        const notificationIcon = document.getElementById('notificationToggleIcon');

        @if(Auth::check())
            // Get the initial state of notifications (1 or 0) from the user model
            let notificationsOn = {{ Auth::user()->notifications_on ? 'true' : 'false' }};
        @else
            // Handle case when user is not authenticated (optional)
            let notificationsOn = false; // Default to false if user is not authenticated
        @endif

        // Update the icon
        if (notificationsOn) {
            notificationIcon.innerHTML =
                `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="bell" data-lucide="bell" class="lucide lucide-bell block mx-auto"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 01-3.46 0"></path></svg>`;
        } else {
            notificationIcon.innerHTML =
                `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="bell-off" data-lucide="bell-off" class="lucide lucide-bell-off block mx-auto"><path d="M13.73 21a2 2 0 01-3.46 0"></path><path d="M18.63 13A17.888 17.888 0 0118 8"></path><path d="M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14"></path><path d="M18 8a6 6 0 00-9.33-5"></path><path d="M2 2l20 20"></path></svg>`;
        }
        notificationToggle.addEventListener('click', function() {
            const userId = {{ Auth::id() }};

            // Toggle the notificationsOn status
            notificationsOn = !notificationsOn;

            // Update the icon
            if (notificationsOn) {
                notificationIcon.innerHTML =
                    `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="bell" data-lucide="bell" class="lucide lucide-bell block mx-auto"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 01-3.46 0"></path></svg>`;
            } else {
                notificationIcon.innerHTML =
                    `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="bell-off" data-lucide="bell-off" class="lucide lucide-bell-off block mx-auto"><path d="M13.73 21a2 2 0 01-3.46 0"></path><path d="M18.63 13A17.888 17.888 0 0118 8"></path><path d="M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14"></path><path d="M18 8a6 6 0 00-9.33-5"></path><path d="M2 2l20 20"></path></svg>`;
            }

            // AJAX request to update notification status
            fetch('/toggle-notifications', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')
                            .getAttribute('content')
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        notifications_on: notificationsOn ? 1 : 0
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // console.log('Success:', data);
                    toastr.success('Notifications turned ' + (notificationsOn ? 'On' : 'Off'),
                        'Success');
                })
                .catch((error) => {
                    // console.error('Error:', error);
                });
        });
    });
</script>
{{-- <script src="{{ url('') }}/js/sticky_notification/notification.js{{ GET_RES_TIMESTAMP() }}"></script> --}}



<script src="https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.js.iife.js"></script>
