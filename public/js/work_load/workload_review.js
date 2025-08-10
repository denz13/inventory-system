var workload_id = '';
var signatoryId = '';

$(document).ready(function () {
    bpath = __basepath + "/";
    loadWorkloadReview('');
});

function loadWorkloadDetails(id) {
    // Perform an AJAX request to fetch details based on the ID
    $.ajax({
        url: bpath + "faculty-portal/work-load/details/" + id, // Adjust the URL to your endpoint
        type: "GET",
        headers: {
            "X-CSRF-TOKEN": _token, // Include CSRF token in headers
        },
        success: function (response) {
            if (response) {
                // Hide loading spinner
                $(".loading-container").empty();
                // Append the data to the modal
                appendReviewBox(response);
                appendSignatoryHistory(response);
                checkSignatory(response);
            } else {
                // Hide loading spinner
                $(".loading-container").empty();
                // Show message for no data found
                appendReviewBox("<p>No data found.</p>");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching details:", error);
            // Hide loading spinner
            $(".loading-container").empty();
            // Show error message
            appendReviewBox("<p>Something went wrong. Please try again later.</p>");
        },
    });
}

function loadWorkloadReview(id) {
    // Perform an AJAX request to fetch details based on the ID
    $.ajax({
        url: bpath + "faculty-portal/work-load/review/list", // Adjust the URL to your endpoint
        type: "GET",
        headers: {
            "X-CSRF-TOKEN": _token, // Include CSRF token in headers
        },
        success: function (response) {
            if (response) {
                // Hide loading spinner
                $(".loading-container").empty();
                populateWorkloadCards(response);
            } else {
                // Hide loading spinner
                $(".loading-container").empty();
                // Show message for no data found
                appendReviewBox("<p>No data found.</p>");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching details:", error);
            // Hide loading spinner
            $(".loading-container").empty();
            // Show error message
            appendReviewBox("<p>Something went wrong. Please try again later.</p>");
        },
    });
}

// Function to populate workload cards
function populateWorkloadCards(workloadData) {
    var reviewList = $('.workload-review-cards');
    reviewList.empty();

    // Check if workload data is empty
    if (workloadData.length === 0) {
        reviewList.html(`
            <div class="intro-x cursor-pointer box relative flex items-center p-5 mt-4 zoom-in">
            <div class="ml-2 overflow-hidden w-full">
                <div class="flex items-center">
                    <div class="font-medium">No workload to review.</div>
                </div>
            </div>
        `);
        return;
    }

    // Sort workload data by updated_at timestamp in descending order
    workloadData.sort(function(a, b) {
        return new Date(b.updated_at) - new Date(a.updated_at);
    });

    // Iterate over each workload and append card to chat list
    $.each(workloadData, function (index, workload) {
        // Create HTML for the workload card
        var workloadCardHTML = `
                    <div class="workload-card intro-x cursor-pointer box relative flex items-center p-5 mt-4 zoom-in" data-id="${workload.id}">
                        <div class="w-12 h-12 flex-none image-fit mr-1">
                            <img alt="Profile Picture" class="rounded-full" src="${workload.profile_picture}">
                        </div>
                        <div class="ml-2 overflow-hidden w-full">
                            <div class="flex items-center">
                                <div class="font-medium">${workload.fullname}</div>
                                <div class="text-xs text-slate-500 ml-auto">${workload.human_created_at}</div>
                            </div>
                            <div class="w-full truncate text-slate-500 mt-0.5">${workload.institute}</div>
                        </div>`;

        // Determine the status text and color
        var statusText = '';
        var statusColor = '';
        if (workload.status === '12') {
            statusText = 'Disapproved';
            statusColor = 'bg-danger/20 text-danger';
        } else if (workload.status === '11') {
            statusText = 'Approved';
            statusColor = 'bg-primary/10 text-primary';
        } else {
            if (workload.get_my_signatories.approved == 0) {
                statusText = 'Pending';
                statusColor = 'bg-pending/10 text-pending';
            } else if (workload.get_my_signatories.approved == 1) {
                statusText = 'Approved';
                statusColor = 'bg-success/20 text-success';
            } else if (workload.get_my_signatories.approved == 2) {
                statusText = 'Disapproved';
                statusColor = 'bg-danger/20 text-danger';
            } else {
                statusText = 'Reviewed';
                statusColor = 'bg-primary/10 text-primary';
            }
        }

        // Append status HTML
        workloadCardHTML += `
                    <div class="flex items-center justify-center absolute top-0 right-0 text-xs rounded ${statusColor} font-medium -mt-1 -mr-1 px-1 py-1">${statusText}</div>
                </div>`;

        // Append workload card to chat list
        reviewList.append(workloadCardHTML);
    });
}


function appendReviewBox(data) {
    $('.review__box').empty();
    // Append workload details to the review box div
    var workloadCard = `
            <div class="col-span-12 mb-5">
                <div class="flex">
                    <div class="mr-auto">Faculty Information</div>
                </div>
            </div>
            <div class="box px-3 py-3 grid grid-cols-12 gap-4 gap-y-3 p-5">
                <!-- Faculty Information Section -->
                <div class="col-span-6">
                    <div class="ml-2 overflow-hidden">
                        <div class="flex items-center ml-auto">
                            <a href="javascript:;" class="font-medium">School Year</a>
                        </div>
                        <div class="w-full truncate text-slate-500 mt-0.5">${data.semester_year}</div>
                    </div>
                </div>
                <div class="col-span-6">
                    <div class="ml-2 overflow-hidden">
                        <div class="flex items-center ml-auto">
                            <a href="javascript:;" class="font-medium">Semester</a>
                        </div>
                        <div class="w-full truncate text-slate-500 mt-0.5">${data.semester}</div>
                    </div>
                </div>
                <div class="col-span-6">
                    <div class="ml-2 overflow-hidden">
                        <div class="flex items-center ml-auto">
                            <a href="javascript:;" class="font-medium">Name of Faculty</a>
                        </div>
                        <div class="w-full truncate text-slate-500 mt-0.5">${data.faculty_name}</div>
                    </div>
                </div>
                <div class="col-span-6">
                    <div class="ml-2 overflow-hidden">
                        <div class="flex items-center ml-auto">
                            <a href="javascript:;" class="font-medium">Academic Rank</a>
                        </div>
                        <div class="w-full truncate text-slate-500 mt-0.5">${data.academic_rank}</div>
                    </div>
                </div>
                <div class="col-span-6">
                    <div class="ml-2 overflow-hidden">
                        <div class="flex items-center ml-auto">
                            <a href="javascript:;" class="font-medium">Institute</a>
                        </div>
                        <div class="w-full truncate text-slate-500 mt-0.5">${data.institute}</div>
                    </div>
                </div>
                <div class="col-span-6">
                    <div class="ml-2 overflow-hidden">
                        <div class="flex items-center ml-auto">
                            <a href="javascript:;" class="font-medium">Specialization</a>
                        </div>
                        <div class="w-full truncate text-slate-500 mt-0.5">${data.specialization}</div>
                    </div>
                </div>
                <div class="col-span-6">
                    <div class="ml-2 overflow-hidden">
                        <div class="flex items-center ml-auto">
                            <a href="javascript:;" class="font-medium">Department</a>
                        </div>
                        <div class="w-full truncate text-slate-500 mt-0.5">${data.department}</div>
                    </div>
                </div>
                <div class="col-span-6">
                    <div class="ml-2 overflow-hidden">
                        <div class="flex items-center ml-auto">
                            <a href="javascript:;" class="font-medium">Description</a>
                        </div>
                        <div class="w-full truncate text-slate-500 mt-0.5">${data.description}</div>
                    </div>
                </div>
            </div>

            <div class=" col-span-12 mt-5 mb-5">
                <!-- Course Information Table -->
                <div class=" box col-span-12 col-span-12 w-full mt-3 xl:mt-0 flex-1 border-2 border-dashed dark:border-darkmode-400 rounded-md px-4 py-4 overflow-x-auto">
                    <table class="table table-report table-hover">
                        <div class="text-slate-500 text-xs border-b border-dashed dark:border-darkmode-400 rounded-md">A. TEACHING LOAD</div>
                        <thead>
                            <tr>
                                <th rowspan="2" style="text-align: center;">Course No.</th>
                                <th rowspan="2" style="text-align: center;">Course Description</th>
                                <th rowspan="2" style="text-align: center;">Student Credit</th>
                                <th rowspan="2" style="text-align: center;">Faculty Credit</th>
                                <th rowspan="2" style="text-align: center;">Class Size</th>
                                <th rowspan="2" style="text-align: center;">Program/Year & Section</th>
                                <th colspan="2" style="text-align: center;">Schedule</th>
                                <th rowspan="2" style="text-align: center;">Room</th>
                            </tr>
                            <!-- Move the "Lab" and "Lec" values to appear under the "Time Schedule" cell -->
                            <tr>
                                <th style="text-align: center;">Lab Time/Days</th>
                                <th style="text-align: center;">Lec Time/Days</th>
                            </tr>
                        </thead>
                        <tbody id="teaching-load-body">

                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="9">
                                    <div class="grid grid-cols-12">
                                        <div class="col-span-12 lg:col-span-4 px-6 pb-4 flex flex-col justify-center">
                                            <div class="justify-start flex items-center text-slate-500 text-xs dark:text-slate-300 mt-12"> No of Preparation/s:</div>
                                            <div class="flex items-center justify-start mt-4">
                                                <div class="relative text-2xl font-medium">
                                                    <strong>${data.number_preparation ?? 'N/A'}</strong>
                                                </div>
                                                <a class="text-slate-500 ml-4" href="javascript:;"></a>
                                            </div>
                                        </div>
                                        <div class="col-span-12 lg:col-span-8 p-1 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-darkmode-300 border-dashed">
                                            <div class="tab-content px-5">
                                                <div class="tab-pane active grid grid-cols-12 gap-y-8 gap-x-10" id="weekly-report" role="tabpanel" aria-labelledby="weekly-report-tab">
                                                    <div class="col-span-6 sm:col-span-6 md:col-span-6">
                                                        <div class="text-slate-500 text-xs">Total Student Credit:</div>
                                                        <div class="mt-1.5 flex items-center">
                                                            <div class="text-base">
                                                                <strong>${data.subjs_credit ?? 'N/A'}</strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-span-12 sm:col-span-6 md:col-span-6">
                                                        <div class="text-slate-500 text-xs">Total Faculty Credit:</div>
                                                        <div class="mt-1.5 flex items-center">
                                                            <div class="text-base">
                                                                <strong>${data.subjf_credit ?? 'N/A'}</strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-span-12 sm:col-span-6 md:col-span-6">
                                                        <div class="text-slate-500 text-xs">
                                                            Hour per week (Lecture):
                                                        </div>
                                                        <div class="mt-1.5 flex items-center">
                                                            <div class="text-base">
                                                                <strong>${data.total_lecture_hours ?? 'N/A'}</strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-span-12 sm:col-span-6 md:col-span-6">
                                                        <div class="text-slate-500 text-xs">
                                                            Hour per week (Laboratory):
                                                        </div>
                                                        <div class="mt-1.5 flex items-center">
                                                            <div class="text-base">
                                                                <strong>${data.total_laboratory_hours ?? 'N/A'}</strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div class="box col-span-12 col-span-12 w-full mt-3 xl:mt-0 flex-1 border-2 border-dashed dark:border-darkmode-400 rounded-md px-4 py-4 mt-4 mb-5">
                <!-- Administrative Designation, Consultation and Research, and Summary Tables -->
                <div class="col-span-12 overflow-x-auto">
                    <!-- Administrative Designation Table -->
                    <table class="table table-report">
                        <div class="text-slate-500 text-xs border-b border-dashed dark:border-darkmode-400 rounded-md">B. ADMINISTRATIVE DESIGNATION</div>
                        <thead>
                            <tr>
                                <th class="text-slate-500 text-xs">Title of Designation</th>
                                <th class="text-slate-500 text-xs">Unit/s Deload</th>

                            </tr>
                        </thead>
                        <tbody id="admin-designation-body">

                        </tbody>
                    </table>

                </div>
                <div class="">
                    <a href="javascript:;" class="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md border-b border-dashed dark:border-darkmode-400">
                        <div class="max-w-[50%] truncate mr-1 mr-auto font-medium text-base">Total (Student Credit + Faculty Credit + Unit/s Deload)</div>
                        <div class="text-slate-500"></div>
                        <div class="ml-auto font-medium text-base">${data.total_stud_facul ?? 'N/A'}</div>
                    </a>
                </div>
                </div>


                <div id="others_" class="box p-2 mt-5 mb-5">

                </div>





                <div id="summarySections" class="box p-5 mt-5">

                </div>
            `;

    $('.review__box').append(workloadCard);

    // Append the teaching load data to the table inside the same review box
    var teachingLoadTableBody = $('.review__box').find('#teaching-load-body');
    data.teaching_loads.forEach((teachingLoad, index) => {
        // Convert time to 12-hour format using Moment.js
        function convertTo12HourFormat(time) {
            return moment(time, 'HH:mm').format('h:mm A');
        }

        var labSchedulesHtml = '';
        if (teachingLoad.lab_schedules.length > 0) {
            teachingLoad.lab_schedules.forEach((labsched) => {
                labSchedulesHtml += `
                            <div class="event -mx-3 cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md flex items-center zoom-in">
                                <span class="mx-1">•</span>
                                <div class="pr-10">
                                    <div class="text-xs truncate">${labsched.days}</div>
                                    <div class="text-slate-500 text-xs mt-0.5"> ${convertTo12HourFormat(labsched.time_start)} - ${convertTo12HourFormat(labsched.time_end)} </div>
                                </div>
                            </div>
                        `;
            });
        } else {
            labSchedulesHtml = `<div class="text-xs text-gray-500">No laboratory schedule</div>`;
        }

        var lecSchedulesHtml = '';
        if (teachingLoad.lec_schedules.length > 0) {
            teachingLoad.lec_schedules.forEach((lecsched) => {
                lecSchedulesHtml += `
                            <div class="event -mx-3 cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md flex items-center zoom-in">
                                <span class="mx-1">•</span>
                                <div class="pr-10">
                                    <div class="truncate text-xs">${lecsched.days}</div>
                                    <div class="text-slate-500 text-xs mt-0.5"> ${convertTo12HourFormat(lecsched.time_start)} - ${convertTo12HourFormat(lecsched.time_end)} </div>
                                </div>
                            </div>
                        `;
            });
        } else {
            lecSchedulesHtml = `<div class="text-xs text-gray-500">No lecture schedule</div>`;
        }

        var row = `
                    <tr>
                        <td>${teachingLoad.course_no ?? 'N/A'}</td>
                        <td>${teachingLoad.course_description ?? 'N/A'}</td>
                        <td>${teachingLoad.student_credit ?? 'N/A'}</td>
                        <td>${teachingLoad.faculty_credit ?? 'N/A'}</td>
                        <td>${teachingLoad.class_size ?? 'N/A'}</td>
                        <td>${teachingLoad.section ?? 'N/A'}</td>
                        <td>${labSchedulesHtml}</td>
                        <td>${lecSchedulesHtml}</td>
                        <td>${teachingLoad.room ?? 'N/A'}</td>
                    </tr>
                `;
        teachingLoadTableBody.append(row);
    });

    // Append the administrative designation data to the table inside the same review box
    var adminDesignationTableBody = $('.review__box').find('#admin-designation-body');
    data.admin_designations.forEach((designation, index) => {
        var row = `
                <tr>
                    <td><strong>${designation.title_of_designation}</strong></td>
                    <td><strong>${designation.unit_deload}</strong></td>
                </tr>
                `;
        adminDesignationTableBody.append(row);
    });

    // Append the others_sections data to the specified div
    var othersSectionsDiv = $('#others_');
    data.others_sections.forEach((section) => {
        // Convert time to 12-hour format using Moment.js
        function convertTo12HourFormat(time) {
            return moment(time, 'HH:mm').format('h:mm A');
        }

        // Initialize an empty string to store the schedules HTML
        var schedulesHTML = '';

        // Loop through each schedule type
        ['scon_schedules', 'exten_schedules', 'prod_schedules', 'res_schedules'].forEach((scheduleType) => {
            // Initialize an empty string to store the HTML for this schedule type
            var scheduleTypeHTML = '';

            // Check if there are schedules for this type
            if (section[scheduleType].length > 0) {
                // Iterate over each schedule
                section[scheduleType].forEach((schedule) => {
                    // Append the HTML for this schedule
                    scheduleTypeHTML += `
                            <div class="event px-2 py-2 -mx-3 cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md flex items-center zoom-in">
                                <div class="pr-10">
                                    <div class="text-xs truncate">${schedule.days}</div>
                                    <div class="text-slate-500 text-xs mt-0.5">${convertTo12HourFormat(schedule.time_start)} - ${convertTo12HourFormat(schedule.time_end)}</div>
                                </div>
                            </div>
                        `;
                });
            } else {
                // If there are no schedules for this type, display a message
                // scheduleTypeHTML = `<div class="text-xs text-gray-500">No ${scheduleType.replace('_', ' ')} schedule</div>`;
            }

            // Append the HTML for this schedule type to the overall schedules HTML
            schedulesHTML += scheduleTypeHTML;
        });

        // Create the section div and append it to the othersSectionsDiv
        var sectionDiv = `
                <a href="javascript:;" class="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md border-b border-dashed dark:border-darkmode-400">
                    <div class="max-w-[50%] truncate mr-1">${section.title ?? 'N/A'}</div>
                    <div class="text-slate-500"></div>
                    <div class="ml-auto font-medium">${schedulesHTML}</div>
                </a>
            `;
        othersSectionsDiv.append(sectionDiv);
    });


    // Append the section data to the specified div
    var summarySectionsDiv = $('#summarySections');
    var sectionDiv = `
                        <div class="col-span-12">
                            <div class="flex">
                                <div class="mr-auto flex">
                                    <strong>SUMMARY</strong>
                                </div>
                                <div class="text-slate-500 text-xs">Time Allocation (# of hours per week)</div>
                            </div>
                        </div>
                `;
    summarySectionsDiv.append(sectionDiv);
    data.sections.forEach((section) => {
        var sectionDiv = `
                <a href="javascript:;" class="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md border-b border-dashed dark:border-darkmode-400">
                    <div class="max-w-[50%] truncate mr-1">${section.title ?? 'N/A'}</div>
                    <div class="text-slate-500"></div>
                    <div class="ml-auto font-medium">${section.hours ?? 'N/A'}</div>
                </a>
                `;
        summarySectionsDiv.append(sectionDiv);
    });
    // Determine if the total is more than 30
    var total = parseFloat(data.summary_total) || 0;
    var totalClass = total > 30 ? 'text-danger' : '';

    // Create the section div with the conditional class
    var sectionDiv = `
                <div class="">
                    <a href="javascript:;" class="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md border-b border-dashed dark:border-darkmode-400">
                        <div class="max-w-[50%] truncate mr-1 mr-auto font-medium text-base">Total (A+B+C+D+E+F)</div>
                        <div class="text-slate-500"></div>
                        <div class="ml-auto font-medium ${totalClass}">${data.summary_total ?? 'N/A'}</div>
                    </a>
                </div>
            `;
    summarySectionsDiv.append(sectionDiv);
}

function appendSignatoryHistory(data) {
    $('.signatory-history__box').empty();
    $('.signatory-persons__box').empty();

    var allHistoryEntries = []; // Array to collect all history entries
    var signatoryPersonsHTML = ``;
    // Iterate over each signatory
    data.get_signatories.forEach(function (signatory) {
        // Access the signatory history for each signatory
        var signatoryHistory = signatory.get_signatory_history;

        // Iterate over each entry in the signatory history and push it into the allHistoryEntries array
        signatoryHistory.forEach(function (history) {
            allHistoryEntries.push({
                name: signatory.name, // Store the name
                history: history // Store the history entry
            });
        });
        // Calculate the time difference using Moment.js
        var timeDifference = moment(signatory.created_at).fromNow();
        signatoryPersonsHTML += `
                            <div class="intro-x cursor-pointer box relative flex items-center p-5 mt-4 zoom-in w-full"data-id="${signatory.id}">

                                <div class="ml-2 overflow-hidden w-full">
                                    <div class="flex items-center">
                                        <div class="font-medium">${signatory.name}</div>
                                        <div class="text-xs text-slate-500 ml-auto">${timeDifference}</div>
                                    </div>
                                    <div class="w-full truncate text-slate-500 mt-0.5">${signatory.description}</div>
                                </div>
                                `;

        // Determine the status text and color
        var statusText = '';
        var statusColor = '';
        if (signatory.approved == 0) {
            statusText = 'Pending';
            statusColor = 'bg-pending/10 text-pending';
        } else if (signatory.approved == 1) {
            statusText = 'Approved';
            statusColor = 'bg-success/20 text-success';
        } else if (signatory.approved == 2) {
            statusText = 'Disapproved';
            statusColor = 'bg-danger/20 text-danger';
        } else {
            statusText = 'Rated';
            statusColor = 'bg-primary/10 text-primary';
        }

        // Append status HTML
        signatoryPersonsHTML += `
                                    <div class="flex items-center justify-center absolute top-0 right-0 text-xs rounded ${statusColor} font-medium -mt-1 -mr-1 px-1 py-1">${statusText}</div>
                                </div>`;
    });

    $('.signatory-persons__box').append(signatoryPersonsHTML);

    // Sort the combined history entries based on the 'created_at' timestamp in descending order
    allHistoryEntries.sort(function (a, b) {
        return new Date(b.history.created_at) - new Date(a.history.created_at);
    });

    // Generate HTML for all history entries
    var signatoryHistoryHTML = `
                <div class="signatory-history__box mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
            `;

    if(allHistoryEntries.length > 0){
    allHistoryEntries.forEach(function (entry) {
        var history = entry.history;
        var name = entry.name;

        // Determine the icon based on the action
        var icon = '';
        if (history.action === '0') {
            icon =
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="edit" data-lucide="edit" class="lucide lucide-edit block mx-auto text-primary"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>'; // Icon for approval
        } else if (history.action === '1') {
            icon =
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="thumbs-up" data-lucide="thumbs-up" class="lucide lucide-thumbs-up block mx-auto text-success"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"></path></svg>'; // Icon for disapproval
        } else if (history.action === '2') {
            icon =
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="thumbs-down" data-lucide="thumbs-down" class="lucide lucide-thumbs-down block mx-auto text-danger"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"></path></svg>'; // Icon for other actions
        } else {
            icon =
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="bookmark" data-lucide="bookmark" class="lucide lucide-bookmark block mx-auto text-warning"><path d="M19 21l-7-4-7 4V5a2 2 0 012 2h10a2 2 0 012 2v16z"></path></svg>'; // Icon for other actions
        }

        // Calculate the time difference using Moment.js
        var timeDifference = moment(history.created_at).fromNow();

        // Generate HTML for each history entry
        var historyEntryHTML = `
        <div class="intro-x relative flex items-center mb-3">
        <div class="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
            <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden relative">
                <div class="icon absolute top-0 left-0 w-full h-full flex items-center justify-center rounded-full">
                    ${icon}
                </div>
            </div>
        </div>
        <div class="box px-5 py-3 ml-4 flex-1 zoom-in">
            <div class="flex items-center">
                <div class="font-medium">${name}</div>
                <div class="text-xs text-slate-500 ml-auto">${timeDifference}</div> <!-- Display time difference here -->
            </div>
            <div class="text-slate-500 mt-1">${history.note}</div>
        </div>
    </div>
                `;

        // Append the generated HTML to the overall signatory history HTML
        signatoryHistoryHTML += historyEntryHTML;
    });

    signatoryHistoryHTML += `</div>`;
    }else{
        signatoryHistoryHTML = `
        <div class="intro-x relative flex items-center mb-3">
            <div class="box px-5 py-3 ml-4 flex-1 zoom-in">
                <div class="flex items-center">
                    <div class="font-medium">No Recent Activities!</div>
                    <div class="text-xs text-slate-500 ml-auto"></div> <!-- Display time difference here -->
                </div>
                <div class="text-slate-500 mt-1"></div>
            </div>
        </div>`;
    }

    // Append the signatory history HTML to the designated element
    $('.signatory-history__box').append(signatoryHistoryHTML);
}

// Check the action value in the signatory
function checkSignatory(data) {
    var actionTabCard = $('.action-tab-card');
    var actionTabMainCard = $('.action-tab-main-card');
    actionTabCard.empty();

    if (data.status === '15') {
        var mySignatory = data.get_my_signatories; // Assuming 'get_my_signatories' holds information about your signatory
        var myPosition = mySignatory.id; // Assuming 'id' represents your signatory's position
        var myAction = mySignatory.approved; // Assuming 'action' represents the action taken by your signatory

        // Filter signatories where action is 0 (assuming 'action' represents the action status)
        var signatoriesToAction = data.get_signatories.filter(function (signatory) {
            return signatory.approved === '0';
        });

        // Sort the filtered signatories based on their positions
        signatoriesToAction.sort(function (a, b) {
            return parseInt(a.id) - parseInt(b.id);
        });


        // Display the user who needs to rate before the current user
        if (myAction === '0') {
            var userToRate = signatoriesToAction[0].name; // Assuming 'name' represents the user's name
            if (parseInt(signatoriesToAction[0].id) !== parseInt(myPosition)) {
                // Another user needs to rate before you can proceed
                $('.action-btn').text('Waiting for ' + userToRate + ' to review before you can proceed.');
                $('.action-btn').prop('disabled', true); // Disable the button
                $('.action-btn').removeAttr('data-id'); // Remove data-id attribute
                $('.action-btn-container').removeAttr('data-id'); // Remove data-id attribute
                signatoryId = '';

                actionTabCard.html(`
                    <div class="mx-auto text-center box px-4 py-4 mt-5">
                        <div class="w-16 h-16 flex-none overflow-hidden mx-auto">
                            <svg data-v-88732935="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader lucide-icon w-16 h-16 text-primary fa-spin"><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg>
                        </div>
                        <div class="mt-3">
                            <div class="font-medium">Ongoing</div>
                            <div class="text-slate-500 mt-1">Waiting for ${ userToRate } to review before you can proceed.</div>
                        </div>
                    </div>
                `);
                actionTabCard.show();
                actionTabMainCard.hide();
            } else {
                actionTabCard.hide();
                actionTabMainCard.show();

                signatoryId = myPosition;
                $('.action-btn').attr('data-id', myPosition);
                $('.action-btn-container').attr('data-id', myPosition);
                // You need to take action
                $('.action-btn').text('Save');
                $('.action-btn').prop('disabled', false); // Enable the button
            }
        } else if (myAction === '1') {

            actionTabCard.html(`
                    <div class="mx-auto text-center box px-4 py-4 mt-5">
                        <div class="w-16 h-16 flex-none overflow-hidden mx-auto">
                            <svg data-v-88732935="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-up lucide-icon w-16 h-16 text-success"><path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path></svg>
                        </div>
                        <div class="mt-3">
                            <div class="font-medium">Approved</div>
                            <div class="text-slate-500 mt-1">You already reviewed this workload!</div>
                        </div>
                    </div>
                `);
            // If the workload is approved
            $('.action-btn').text('Workload Approved');
            $('.action-btn').prop('disabled', true); // Disable the button
            $('.action-btn').removeAttr('data-id'); // Remove data-id attribute
            $('.action-btn-container').removeAttr('data-id'); // Remove data-id attribute
            signatoryId = '';

            actionTabCard.show();
            actionTabMainCard.hide();
        } else if (myAction === '2') {
            
            actionTabCard.html(`
                    <div class="mx-auto text-center box px-4 py-4 mt-5">
                        <div class="w-16 h-16 flex-none overflow-hidden mx-auto">
                            <svg data-v-88732935="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-down lucide-icon w-16 h-16 text-danger"><path d="M17 14V2"></path><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"></path></svg>
                        </div>
                        <div class="mt-3">
                            <div class="font-medium">Disapproved</div>
                            <div class="text-slate-500 mt-1">You already reviewed this workload!</div>
                        </div>
                    </div>
                `);
            // If the workload is disapproved
            $('.action-btn').text('Workload Disapproved');
            $('.action-btn').prop('disabled', true); // Disable the button
            $('.action-btn').removeAttr('data-id'); // Remove data-id attribute
            $('.action-btn-container').removeAttr('data-id'); // Remove data-id attribute
            signatoryId = '';
            actionTabCard.show();
            actionTabMainCard.hide();
        }
    } else if(data.status === '11') {
        actionTabCard.html(`
                    <div class="mx-auto text-center box px-4 py-4 mt-5">
                        <div class="w-16 h-16 flex-none overflow-hidden mx-auto">
                            <svg data-v-88732935="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-up lucide-icon w-16 h-16 text-success"><path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path></svg>                        </div>
                        <div class="mt-3">
                            <div class="font-medium">Approved</div>
                            <div class="text-slate-500 mt-1">This workload has been Approved!</div>
                        </div>
                    </div>
                `);
        $('.action-btn').text('Unavailable');
        $('.action-btn').prop('disabled', true); // Disable the button
        $('.action-btn').removeAttr('data-id'); // Remove data-id attribute
        $('.action-btn-container').removeAttr('data-id'); // Remove data-id attribute
        actionTabCard.show();
        actionTabMainCard.hide();
    }else if(data.status === '12') {
        actionTabCard.html(`
                    <div class="mx-auto text-center box px-4 py-4 mt-5">
                        <div class="w-16 h-16 flex-none overflow-hidden mx-auto">
                            <svg data-v-88732935="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-down lucide-icon w-16 h-16 text-danger"><path d="M17 14V2"></path><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"></path></svg>
                        </div>
                        <div class="mt-3">
                            <div class="font-medium">Disapproved</div>
                            <div class="text-slate-500 mt-1">This workload has been Disapproved!</div>
                        </div>
                    </div>
                `);
        $('.action-btn').text('Unavailable');
        $('.action-btn').prop('disabled', true); // Disable the button
        $('.action-btn').removeAttr('data-id'); // Remove data-id attribute
        $('.action-btn-container').removeAttr('data-id'); // Remove data-id attribute
        actionTabCard.show();
        actionTabMainCard.hide();
    }else {
        actionTabCard.html(`
                    <div class="mx-auto text-center box px-4 py-4 mt-5">
                        <div class="w-16 h-16 flex-none overflow-hidden mx-auto">
                            <svg data-v-88732935="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-info lucide-icon w-16 h-16 text-primary"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg>
                        </div>
                        <div class="mt-3">
                            <div class="font-medium">Unavailable</div>
                            <div class="text-slate-500 mt-1">You are not allowed to review this workload!</div>
                        </div>
                    </div>
                `);
        $('.action-btn').text('Unavailable');
        $('.action-btn').prop('disabled', true); // Disable the button
        $('.action-btn').removeAttr('data-id'); // Remove data-id attribute
        $('.action-btn-container').removeAttr('data-id'); // Remove data-id attribute
        actionTabCard.show();
        actionTabMainCard.hide();
    }
}

// Event listener for the "View Details" button
$("body").on("click", ".workload-card", function () {
    // Remove the class from all elements with the same class
    $(".workload-card").removeClass("bg-slate-100 dark:bg-darkmode-400/70");

    // Add the class to the clicked element
    $(this).addClass("bg-slate-100 dark:bg-darkmode-400/70");

    // Empty the review box container
    $('.review__box').empty();

    // Show loading spinner
    var loadingSpinner = `
            <div class="h-full flex items-center box">
                    <div class="mx-auto text-center">
                        <div class="w-16 h-16 flex-none overflow-hidden mx-auto">
                            <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="rgb(30, 41, 59)" class="w-8 h-8"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="4"><circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform></path></g></g></svg>
                        </div>
                        <div class="mt-3">
                            <div class="font-medium">Loading Contents...</div>
                            <div class="text-slate-500 mt-1">Please be patient.</div>
                        </div>
                    </div>
                </div>
            `;


    $('.review__box').append('<div class="loading-container w-full h-full text-center">' + loadingSpinner +
        '</div>');

    // Get the ID associated with the button
    workload_id = $(this).data("id");

    loadWorkloadDetails(workload_id);
    $('.print-workload-dp').empty();
    // Append the dropdown content
    var dropdownContent = `
                    <li>
                        <a href="/faculty-portal/print/wl/${workload_id}/vw" target="blank" class="dropdown-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="arrow-left-right" data-lucide="arrow-left-right" class="lucide lucide-arrow-left-right w-4 h-4 mr-2"><polyline points="17 11 21 7 17 3"></polyline><line x1="21" y1="7" x2="9" y2="7"></line><polyline points="7 21 3 17 7 13"></polyline><line x1="15" y1="17" x2="3" y2="17"></line></svg>
                            Print
                        </a>
                    </li>
            `;
    $('.print-workload-dp').append(dropdownContent);
});

// Click event listener for the action button
$('.action-btn').on('click', function () {
    // Hide the original action button
    $(this).hide();
    // Hide the confirmation buttons
    $('.confirmation-buttons').show();
});

// Event delegation for confirmation "Yes" button
$("body").on('click', '.confirm-yes-btn', function () {
    // Get the original action button
    var originalButton = $(this).closest('.action-btn-container').find('.action-btn').attr('disabled',true);

    // Hide the original action button
    originalButton.show();

    // Hide the confirmation buttons
    $('.confirmation-buttons').hide();

    // Update the action button with a loading spinner
    originalButton.html(`<svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white">
                <g fill="none" fill-rule="evenodd" stroke-width="4" stroke="white">
                    <circle cx="22" cy="22" r="1">
                        <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                        <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                    </circle>
                    <circle cx="22" cy="22" r="1">
                        <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                        <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                    </circle>
                </g>
            </svg>`);

    // Get the selected values from the dropdowns
    var action = $('#action-dropdown').val();
    var allowESignature = $('#esig-dropdown').val();
    // Get the message text
    var message = $('#message-text').val();
    if (signatoryId) {
        // Perform an AJAX request to update the signatory
        $.ajax({
            url: bpath +
                "faculty-portal/work-load/signatory/action", // Adjust the URL to your endpoint
            type: 'POST', // Adjust the HTTP method if needed
            headers: {
                "X-CSRF-TOKEN": _token, // Include CSRF token in headers
            },
            data: {
                workload_id: workload_id,
                id: signatoryId, // Pass the signatory ID to the server
                action: action, // Pass the selected action value
                allow_esig: allowESignature, // Pass the selected e-Signature value
                message: message // Pass the message text
                // Add other data parameters as needed for updating the signatory
            },
            success: function (response) {
                $('#message-text').val('');
                // Handle success response
                console.log('Signatory updated successfully:');
                // Optionally, update the UI or perform any additional actions
                loadWorkloadDetails(workload_id);
                // Update the content of .workload-review-cards with the new data
                loadWorkloadReview('');
            },
            error: function (xhr, status, error) {
                // Handle error response
                console.error('Error updating signatory:', error);
                // Optionally, display an error message to the user
            }
        });
    }
});

// Event delegation for confirmation "No" button
$("body").on('click', '.confirm-no-btn', function () {
    // Hide the confirmation buttons and show the original action button
    $(this).parent().siblings('.action-btn').show();
    $(this).parent().hide();
});
