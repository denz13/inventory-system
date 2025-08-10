// $(document ).ready(function() {
//
//     $(function(){
//         //Yes! use keydown because some keys are fired only in this trigger,
//         //such arrows keys
//         $("body").keydown(function(e){
//             //well so you need keep on mind that your browser use some keys
//             //to call some function, so we'll prevent this
//             e.preventDefault();
//
//             //now we caught the key code.
//             var keyCode = e.keyCode || e.which;
//
//             //your keyCode contains the key code, F1 to F12
//             //is among 112 and 123. Just it.
//
//
//             /*
//             * F1  = 112
//             * F2  = 113
//             * F3  = 114
//             * F4  = 115
//             * F5  = 116
//             * F6  = 117
//             * F7  = 118
//             * F8  = 119
//             * F9  = 120
//             * F10 = 121
//             * F11 = 122
//             * F12 = 123
//             */
//
//             if (keyCode == 115)
//             {
//                 swal({
//                     type: 'question',
//                     title: 'Logout this account?',
//                     showCancelButton: true,
//                     confirmButtonText: 'Logout',
//                     }).then((result) => {
//                         /* Read more about isConfirmed, isDenied below */
//                     if (result.value == true)
//                     {
//                         logout();
//                     }else{
//                         swal({
//                             title:"Cancelled",
//                             text:"No action taken!",
//                             type:"error",
//                             confirmButtonColor: '#1e40af',
//                             confirmButtonColor: '#1e40af',
//                             timer: 500
//                         });
//                     }
//                 });
//             }
//         });
//     });
// });
//
// function logout()
// {
//     $.ajax({
//         url: bpath + 'logout',
//         type: "POST",
//         data: {
//             _token: _token,
//         },
//         success: function(response) {
//             location.reload();
//         }
//     });
// }
