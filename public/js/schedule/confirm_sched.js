// var  _token = $('meta[name="csrf-token"]').attr('content');

// $(document).ready(function()
//     {
//         var tbody = $('#schedulelist tbody');
//         $.ajax(
//         {
//                 url: '/schedule/schedPost', // Replace this with your API endpoint URL
//                 method: 'POST',
//                 type: "POST",
//                 data: {
//                     _token,
//                 },
//                 dataType: 'json',
//                 success: function(response) {
//                     // Loop through the schedule data and generate table rows
//                     var tbody = $('#schedulelist tbody');
//                     response.forEach(function(schedule) {
//                         var row = '<tr>';
//                         row += '<td>' + schedule.sched_name + ' (' + schedule.sched_type + ')' + '</td>';
//                         row += '<td>' + schedule.sched_purpose + '</td>';
//                         row += '<td>' + schedule.sched_status + '</td>';
//                         row += '<td>';
//                         row += '<button onclick="approveSchedule(' + schedule.id + ')" class="btn btn-rounded-primary w-24 mr-1 mb-2 btnApprove" ">Approve</button>';
//                         row += '<button onclick="disapproveSchedule(' + schedule.id + ')"  class="btn btn-rounded-warning w-24 mr-1 mb-2 ">Disapprove</button>';
//                         row += '</td>';
//                         row += '</tr>';
//                         tbody.append(row);
//                     });
//                 },


//                 error: function(error) {
//                     console.error('Error fetching schedule data:', error);
//                 }
//         });
//            $('body').on('click', '.btnApprove', function() {

//                 __modal_toggle('static-backdrop-modal-preview')
//                 var scheduleId = $(this).data('schedule-id');
//                 var action = 'approve';
//                 //showConfirmationModal(scheduleId, action);
//             });

//             tbody.on('click', '.disapprove-btn', function() {
//                 var scheduleId = $(this).data('schedule-id');
//                 var action = 'disapprove';
//                 showConfirmationModal(scheduleId, action);
//             });

//             function showConfirmationModal(scheduleId, action) {
//                 $('#static-backdrop-modal-preview').modal('show');

//                 // Add a click event handler for the "ok" button in the modal
//                 $('#okbtn').off('click').on('click', function() {
//                     // Call the function to perform the approve/disapprove action
//                     performAction(scheduleId, action);
//                     $('#static-backdrop-modal-preview').modal('hide');
//                 });

//                 // Add a click event handler for the "cancel" button in the modal
//                 $('#cancelbtn').off('click').on('click', function() {
//                     // Do nothing, just close the modal
//                     $('#static-backdrop-modal-preview').modal('hide');
//                 });
//             }

//             function performAction(scheduleId, action) {
//                 // Perform the approve/disapprove action using AJAX
//                 $.ajax({
//                     url: '/schedule/approve-disapprove', // Replace this with your API endpoint URL for approve/disapprove action
//                     method: 'POST',
//                     data: {
//                         _token: _token,
//                         schedule_id: scheduleId,
//                         action: action
//                     },
//                     dataType: 'json',
//                     success: function(response) {
//                         // Handle the response if needed
//                         console.log('Action successful');
//                         // Refresh the table or update the row to show the updated status
//                     },
//                     error: function(error) {
//                         console.error('Error performing action:', error);
//                     }
//                 });
//             }

//       });


//       function __modal_toggle(modal_id){

//         const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#'+modal_id));
//         mdl.toggle();

//     }

//     function __modal_hide(modal_id){

//         const mdl = tailwind.Modal.getOrCreateInstance(document.querySelector('#'+modal_id));
//         mdl.hide();

//     }
