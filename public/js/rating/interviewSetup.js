$(document).ready(function () {

    $('.btn_save_rsp_rating_setup_div').hide();
    select2_function();
    onchangeFunctions();
    // bindAccordionClick();
    qualificationInput();
    save_rsp_rating_setup();

});

{
    function select2_function(){
        $('#selectedPositions').select2({
            placeholder: "Select Position",
            closeOnSelect: true,
            allowClear: true
        });

        $('#selectedSalary_grade').select2({
            placeholder: "Select Salary Grade",
            closeOnSelect: true,
            allowClear: true
        });
    }

    function onchangeFunctions(){
        $("body").on('change', '#selectedPositions', function () {
            qualification_setup_data = [];
            competency_setup_data = [];
            var positionID = $(this).val();
            var sgID = $('#selectedSalary_grade').val();
            if(positionID != '' && sgID != ''){
                load_Bind_Competention_and_qualifications(positionID, sgID);
            }else{
                $('.btn_save_rsp_rating_setup_div').hide();
            }

        });

        $("body").on('change', '#selectedSalary_grade', function () {
            qualification_setup_data = [];
            competency_setup_data = [];

            var sgID = $(this).val();
            var positionID = $('#selectedPositions').val();

            if(positionID != '' && sgID != ''){
                load_Bind_Competention_and_qualifications(positionID, sgID);
            }else{
                $('.btn_save_rsp_rating_setup_div').hide();
            }

        });
    }

    function load_Bind_Competention_and_qualifications(positionID, sgID) {
        if (!positionID || !sgID) {
            console.error("Invalid positionID or sgID provided");
            return;
        }

        const container = $('#competency_and_qualification_container');
        const btn_save_rsp_rating_setup_div = $('.btn_save_rsp_rating_setup_div');

        const loadingHTML = `
            <div class="box p-5 mb-4">
                <div class="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5 sectionContainer">
                    <div class="mt-2">
                        <div class="form-inline items-start flex-col xl:flex-row mt-4">
                            <div class="w-full mt-3 xl:mt-0 flex-1 border-2 border-dashed dark:border-darkmode-400 rounded-md pt-2">
                                <div class="p-5 competency-item-container overflow-y-auto h-full">
                                    <div class="h-full flex items-center justify-center">
                                        <div class="flex items-center justify-center min-h-[300px]">
                                            <div class="text-center">
                                                <svg width="50" height="50" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="rgb(30, 41, 59)" class="w-12 h-12 mx-auto">
                                                    <circle cx="15" cy="15" r="15">
                                                        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
                                                        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
                                                    </circle>
                                                    <circle cx="60" cy="15" r="9" fill-opacity="0.3">
                                                        <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate>
                                                        <animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate>
                                                    </circle>
                                                    <circle cx="105" cy="15" r="15">
                                                        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
                                                        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
                                                    </circle>
                                                </svg>
                                                <div class="text-slate-500 mt-3">Loading qualifications and competencies...</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $.ajax({
            type: "GET",
            url: "/rating/load_bind_competency_and_qualifications",
            data: { positionID, sgID },
            dataType: "json",
            timeout: 10000, // 10 seconds timeout
            beforeSend: function () {
                container.html(loadingHTML);
                btn_save_rsp_rating_setup_div.hide();
            },
            success: function (response) {
                var qualification_setup_datas = response.qualification_setup_data;
                var competency_setup_datas = response.competency_setup_data;

                qualification_setup_data = qualification_setup_datas;
                competency_setup_data = competency_setup_datas;

                console.log('qualification_setup_data: ', qualification_setup_data);
                console.log('competency_setup_data: ', competency_setup_data);

                if (response && response.load_qualification_setup) {
                    container.html(response.load_qualification_setup);

                    btn_save_rsp_rating_setup_div.show();
                } else {
                    console.warn("Unexpected response format", response);
                    container.html(`
                                    <div class="box p-5 mb-4">
                                        <div class="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5 sectionContainer">
                                            <div class="mt-2">
                                                <div class="form-inline items-start flex-col xl:flex-row mt-4">
                                                    <div class="w-full mt-3 xl:mt-0 flex-1 border-2 border-dashed dark:border-darkmode-400 rounded-md pt-2">
                                                        <div class="p-5 competency-item-container overflow-y-auto h-full">
                                                            <div class="h-full flex items-center justify-center">
                                                                <div class="flex items-center justify-center min-h-[300px]">
                                                                    <div class="text-center">
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                            width="24" height="24"
                                                                            viewBox="0 0 24 24" fill="none"
                                                                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                                            icon-name="alert-circle"
                                                                            data-lucide="alert-circle"
                                                                            class="lucide lucide-alert-circle block mx-auto text-danger w-8 h-8">
                                                                            <circle cx="12" cy="12" r="10"></circle>
                                                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                                                        </svg>
                                                                        <div class="text-slate-500 mt-3">Failed to load data. Please try again.</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `);
                }

            },
            error: function (xhr, status, error) {
                console.error("AJAX request failed:", status, error);
                container.html(`
                    <div class="box p-5 mb-4">
                        <div class="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5 sectionContainer">
                            <div class="mt-2">
                                <div class="form-inline items-start flex-col xl:flex-row mt-4">
                                    <div class="w-full mt-3 xl:mt-0 flex-1 border-2 border-dashed dark:border-darkmode-400 rounded-md pt-2">
                                        <div class="p-5 competency-item-container overflow-y-auto h-full">
                                            <div class="h-full flex items-center justify-center">
                                                <div class="flex items-center justify-center min-h-[300px]">
                                                    <div class="text-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                            width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                            icon-name="wifi-off"
                                                            data-lucide="wifi-off w-8 h-8 text-slate-500"
                                                            class="lucide lucide-wifi-off block mx-auto">
                                                            <line x1="2" y1="2" x2="22" y2="22"></line>
                                                            <path d="M8.5 16.5a5 5 0 017 0"></path>
                                                            <path d="M2 8.82a15 15 0 014.17-2.65"></path>
                                                            <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"></path>
                                                            <path d="M16.85 11.25a10 10 0 012.22 1.68"></path>
                                                            <path d="M5 13a10 10 0 015.24-2.76"></path>
                                                            <line x1="12" y1="20" x2="12.01" y2="20"></line>
                                                        </svg>
                                                        <div class="text-slate-500 mt-3">Error loading data. Please check your connection and try again.</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            },
        });
    }


    // function bindAccordionClick() {
    //     $("body").on('click', '.qualification-button', function() {
    //         const targetId = $(this).data('target');
    //         const targetElement = $(targetId);

    //         if (targetElement.hasClass('show')) {
    //             $(this).removeClass('active text-primary');
    //             targetElement.removeClass('show');
    //         } else {
    //             $(this).addClass('active text-primary');
    //             targetElement.toggleClass('show');
    //         }
    //     });

    // }

    var qualification_setup_data = [];
    var competency_setup_data = [];

    function qualificationInput() {

        // Modified input handler for overall qualification rate
        $("body").on('input', '.overAllQualificationRate', function () {
            const input = $(this);
            let inputValue = input.val();
            let criteria_base = input.data('rate-base');
            const caretPos = this.selectionStart;

            // Remove non-numeric characters
            inputValue = inputValue.replace(/[^0-9]/g, '');

            // Limit to 100
            if (parseInt(inputValue, 10) > 100) {
                inputValue = inputValue.slice(0, -1);
            }

            // Add % sign
            if (inputValue === '') {
                input.val('');
            } else {
                input.val(inputValue + '%');
            }

            // Restore caret position
            setCaretPosition(this, Math.min(caretPos, inputValue.length));

            // Validate total overall qualification rates
            validateOverallQualificationRates(input);


            if(criteria_base.trim() == 'competency'){
                // Check if the entry already exists before pushing
                const existingEntryIndex = competency_setup_data.findIndex(entry => entry.criteriaBase === criteria_base);
                if (existingEntryIndex > -1) {
                    // Update existing entry
                    competency_setup_data[existingEntryIndex].criteriaBaseRequiredRate = inputValue;
                } else {
                    // Add new entry
                    competency_setup_data.push({
                        criteriaBase: criteria_base,
                        criteriaBaseRequiredRate: inputValue,
                        criteria_type: []

                    });
                }
            }

            if(criteria_base.trim() == 'qualification'){

                // Check if the entry already exists before pushing
                const existingEntryIndex = qualification_setup_data.findIndex(entry => entry.criteriaBase === criteria_base);
                if (existingEntryIndex > -1) {
                    // Update existing entry
                    qualification_setup_data[existingEntryIndex].criteriaBaseRequiredRate = inputValue;
                } else {
                    // Add new entry
                    qualification_setup_data.push({
                        criteriaBase: criteria_base,
                        criteriaBaseRequiredRate: inputValue,
                        criteria_type: []

                    });
                }
            }

           console.log('qualification: ', qualification_setup_data);
            console.log('Competencies: ', competency_setup_data);

        });

        $("body").on('input', '.qualificationRAte', function () {
            const input = $(this);
            let inputValue = input.val();
            const caretPos = this.selectionStart;

            let criteria_type_id = input.data('criteria-type-id');
            let criteria_base = input.data('rate-base');

            // Remove non-numeric characters
            inputValue = inputValue.replace(/[^0-9]/g, '');

            // Limit to 100
            if (parseInt(inputValue, 10) > 100) {
                inputValue = inputValue.slice(0, -1);
            }

            // Add % sign
            if (inputValue === '') {
                input.val('');
            } else {
                input.val(inputValue + '%');
            }

            // Restore caret position
            setCaretPosition(this, Math.min(caretPos, inputValue.length));

            // Validate required qualifications for this specific section
            validateRequiredQualifications(input);

            if(criteria_base.trim() == 'qualification'){

                // Add new entry to the criteria_type array of the existing entry
                const existingEntryIndex = qualification_setup_data.findIndex(entry => entry.criteriaBase === criteria_base);
                if (existingEntryIndex > -1) {
                    // Ensure criteria_type is initialized as an array if it doesn't exist
                    if (!qualification_setup_data[existingEntryIndex].criteria_type) {
                        qualification_setup_data[existingEntryIndex].criteria_type = [];
                    }

                    // Check if the criteria_type_id already exists in the criteria_type array
                    const existingCriteriaTypeIndex = qualification_setup_data[existingEntryIndex].criteria_type.findIndex(type => type.criteria_type_id === criteria_type_id);
                    if (existingCriteriaTypeIndex > -1) {
                        // Update existing criteria type entry
                        qualification_setup_data[existingEntryIndex].criteria_type[existingCriteriaTypeIndex].criteriaBaseRequiredTypeRate = inputValue;
                    } else {
                        // Add new criteria type entry
                        qualification_setup_data[existingEntryIndex].criteria_type.push({
                            criteria_type_id: criteria_type_id,
                            criteriaBaseRequiredTypeRate: inputValue,
                            criteria: [],
                        });
                    }
                } else {
                    // Handle the case where the entry does not exist if needed
                    console.error("Entry not found for criteriaBase:", criteria_base);
                }

            }

            if(criteria_base.trim() == 'competency'){

                // Add new entry to the criteria_type array of the existing entry
                const existingEntryIndex = competency_setup_data.findIndex(entry => entry.criteriaBase === criteria_base);
                if (existingEntryIndex > -1) {
                    // Ensure criteria_type is initialized as an array if it doesn't exist
                    if (!competency_setup_data[existingEntryIndex].criteria_type) {
                        competency_setup_data[existingEntryIndex].criteria_type = [];
                    }

                    // Check if the criteria_type_id already exists in the criteria_type array
                    const existingCriteriaTypeIndex = competency_setup_data[existingEntryIndex].criteria_type.findIndex(type => type.criteria_type_id === criteria_type_id);
                    if (existingCriteriaTypeIndex > -1) {
                        // Update existing criteria type entry
                        competency_setup_data[existingEntryIndex].criteria_type[existingCriteriaTypeIndex].criteriaBaseRequiredTypeRate = inputValue;
                    } else {
                        // Add new criteria type entry
                        competency_setup_data[existingEntryIndex].criteria_type.push({
                            criteria_type_id: criteria_type_id,
                            criteriaBaseRequiredTypeRate: inputValue,
                            criteria: [],
                        });
                    }
                } else {
                    // Handle the case where the entry does not exist if needed
                    console.error("Entry not found for criteriaBase:", criteria_base);
                }

            }

            console.log('qualification qualrate: ', qualification_setup_data);
            console.log('Competencies qualrate: ', competency_setup_data);

        });

        // Input handler for required Qualification
        $("body").on('input', '.requiredQual', function () {
            const input = $(this);
            let inputValue = input.val();
            const caretPos = this.selectionStart;
            const criteria_base = input.data('rate-base');
            let criteria_id = input.data('criteria-id');

            // Remove non-numeric characters
            inputValue = inputValue.replace(/[^0-9]/g, '');

            // Find the closest qualificationRate input in the same section
            const sectionContainer = input.closest('.intro-y.box');
            const qualificationRateInput = sectionContainer.find('.qualificationRAte');
            const qualificationRateValue = parseInt(qualificationRateInput.val().replace('%', ''), 10) || 0;

            const overallQualificationRateInput = sectionContainer.closest('.sectionContainer').find('#overAllQualificationRate');
            const criteria_type_id = parseInt(qualificationRateInput.data('criteria-type-id'), 10);

            // Calculate sum of required Qualification in this section
            let sectionRequiredQualSum = 0;
            sectionContainer.find('.requiredQual').each(function () {
                let value = parseInt($(this).val(), 10) || 0;
                sectionRequiredQualSum += value;
            });

            // Check if the total exceeds the qualification rate
            if (sectionRequiredQualSum > qualificationRateValue) {
                alert('Total required Qualification cannot exceed the qualification rate of ' + qualificationRateValue + '%');
                input.val(''); // Optionally clear the input that caused the overflow
            } else {
                // Add % sign if input is not empty
                if (inputValue === '') {
                    input.val('');
                } else {
                    input.val(inputValue + '%');
                }
            }

            // Restore caret position
            setCaretPosition(this, Math.min(caretPos, inputValue.length));

            // Corrected format for qualification_setup_data
            const existingQualType = qualification_setup_data.find(q => q.criteriaBase === criteria_base);
            if (existingQualType) {
                // Check if criteria_type array exists, if not, initialize it
                if (!Array.isArray(existingQualType.criteria_type)) {
                    existingQualType.criteria_type = [];
                }

                // Check if the criteria_type_id already exists in the array
                const existingCriteriaType = existingQualType.criteria_type.find(ct => ct.criteria_type_id === criteria_type_id);
                if (existingCriteriaType) {
                    // Check if criteria array exists, if not, initialize it
                    if (!Array.isArray(existingCriteriaType.criteria)) {
                        existingCriteriaType.criteria = [];
                    }

                    // Check if the criteria_id already exists in the criteria array
                    const existingCriteria = existingCriteriaType.criteria.find(c => c.criteria_id === criteria_id);
                    if (existingCriteria) {
                        existingCriteria.criteriaBaseRequiredRate = inputValue; // Update existing entry
                    } else {
                        // Push new criteria object into the criteria array
                        existingCriteriaType.criteria.push({
                            criteria_id: criteria_id,
                            criteriaBaseRequiredRate: inputValue
                        });
                    }
                } else {
                    // Push new criteria_type object into the array
                    existingQualType.criteria_type.push({
                        criteria_type_id: criteria_type_id,
                        criteriaBaseRequiredTypeRate: qualificationRateValue,
                        criteria: [{
                            criteria_id: criteria_id,
                            criteriaBaseRequiredRate: inputValue
                        }]
                    });
                }
            } else {
                // If the base doesn't exist, create a new entry
                qualification_setup_data.push({
                    criteriaBase: criteria_base,
                    criteriaBaseRequiredRate: parseInt(overallQualificationRateInput.val().replace('%', ''), 10) || 0,
                    criteria_type: [{
                        criteria_type_id: criteria_type_id,
                        criteriaBaseRequiredTypeRate: qualificationRateValue,
                        criteria: [{
                            criteria_id: criteria_id,
                            criteriaBaseRequiredRate: inputValue
                        }]
                    }]
                });
            }

            console.log('qualification required: ', qualification_setup_data);

        });

        // Input handler for required competencies
        $("body").on('input', '.requiredComp', function () {
            const input = $(this);
            let inputValue = input.val();
            const caretPos = this.selectionStart;
            let criteria_id = input.data('criteria-id');
            let criteria_base = input.data('rate-base');

            // Remove non-numeric characters
            inputValue = inputValue.replace(/[^0-9]/g, '');

            // Find the closest qualificationRate input in the same section
            const sectionContainer = input.closest('.intro-y.box');
            const qualificationRateInput = sectionContainer.find('.qualificationRAte');
            const overallQualificationRateInput = sectionContainer.closest('.sectionContainer').find('#overAllQualificationRate');
            const criteria_type_id = parseInt(qualificationRateInput.data('criteria-type-id'), 10);
            const qualificationRateValue = parseInt(qualificationRateInput.val().replace('%', ''), 10) || 0;

            // Corrected format for competency_setup_data
            const existingCompType = competency_setup_data.find(c => c.criteriaBase === criteria_base);
            if (existingCompType) {
                // Check if criteria_type array exists, if not, initialize it
                if (!Array.isArray(existingCompType.criteria_type)) {
                    existingCompType.criteria_type = [];
                }

                // Check if the criteria_type_id already exists in the array
                const existingCriteriaType = existingCompType.criteria_type.find(ct => ct.criteria_type_id === criteria_type_id);
                if (existingCriteriaType) {
                    // Check if criteria array exists, if not, initialize it
                    if (!Array.isArray(existingCriteriaType.criteria)) {
                        existingCriteriaType.criteria = [];
                    }

                    // Check if the criteria_id already exists in the criteria array
                    const existingCriteria = existingCriteriaType.criteria.find(c => c.criteria_id === criteria_id);
                    if (existingCriteria) {
                        existingCriteria.criteriaBaseRequiredRate = inputValue; // Update existing entry
                    } else {
                        // Push new criteria object into the criteria array
                        existingCriteriaType.criteria.push({
                            criteria_id: criteria_id,
                            criteriaBaseRequiredRate: inputValue
                        });
                    }
                } else {
                    // Push new criteria_type object into the array
                    existingCompType.criteria_type.push({
                        criteria_type_id: criteria_type_id,
                        criteriaBaseRequiredTypeRate: qualificationRateValue,
                        criteria: [{
                            criteria_id: criteria_id,
                            criteriaBaseRequiredRate: inputValue
                        }]
                    });
                }
            } else {
                // If the base doesn't exist, create a new entry
                competency_setup_data.push({
                    criteriaBase: criteria_base,
                    criteriaBaseRequiredRate: parseInt(overallQualificationRateInput.val().replace('%', ''), 10) || 0,
                    criteria_type: [{
                        criteria_type_id: criteria_type_id,
                        criteriaBaseRequiredTypeRate: qualificationRateValue,
                        criteria: [{
                            criteria_id: criteria_id,
                            criteriaBaseRequiredRate: inputValue
                        }]
                    }]
                });
            }

            console.log('Competencies required: ', competency_setup_data);
        });
    }

    // Function to validate overall qualification rates
    function validateOverallQualificationRates(currentInput) {
        let totalOverallQualificationRateSum = 0;
        let inputs = $('.overAllQualificationRate');

        // Calculate sum, excluding the current input
        inputs.each(function() {
            // Check if the current input exists and is different from the one being validated
            if (currentInput && this !== currentInput[0]) {
                let value = $(this).val().replace('%', '');
                totalOverallQualificationRateSum += parseInt(value, 10) || 0;
            }
        });

        // Add the current input value
        let currentValue = currentInput ? currentInput.val().replace('%', '') : '';
        let currentValueNum = parseInt(currentValue, 10) || 0;

        // Check if adding the current value would exceed 100
        if (totalOverallQualificationRateSum + currentValueNum > 100) {
            alert('Total overall qualification rates cannot exceed 100%');

            // Revert to the previous value or clear if it would cause overflow
            if (currentInput) {
                let prevValue = currentInput.data('prev-value') || '';
                currentInput.val(prevValue);
            }

            return false;
        }

        // Store the current valid value as a data attribute
        if (currentInput) {
            currentInput.data('prev-value', currentInput.val());
        }

        return true;
    }

    // Function to validate total qualification rates
    function validateRequiredQualifications(changedInput) {
        // Find the relevant section container
        const sectionContainer = changedInput.closest('.intro-y.box').closest('.sectionContainer');
        if (!sectionContainer.length) {
            console.error("Section container not found.");
            return;
        }

        // Get the overall qualification rate input and value
        const overAllQualificationRateInput = sectionContainer.find('.overAllQualificationRate');
        const overAllQualificationRateValue = parseInt(
            overAllQualificationRateInput.val()?.replace('%', '').trim() || '0',
            10
        );

        // Ensure we successfully retrieved a valid number
        if (isNaN(overAllQualificationRateValue)) {
            console.error("Invalid overall qualification rate value.");
            return;
        }

        // Calculate the total sum of individual qualification rates
        const qualificationRates = sectionContainer.find('.qualificationRAte');
        let totalQualificationRateSum = 0;

        qualificationRates.each(function () {
            const value = parseInt($(this).val()?.replace('%', '').trim() || '0', 10);
            if (!isNaN(value)) {
                totalQualificationRateSum += value;
            }
        });

        // Validate the sum of qualification rates against the overall qualification rate
        if (totalQualificationRateSum > overAllQualificationRateValue) {
            changedInput.val(''); // Clear the invalid input
            alert('Total qualification rates must not exceed the overall qualification rate.');
        }
    }


    function setCaretPosition(el, pos) {
        el.setSelectionRange(pos, pos);
    }


    function save_rsp_rating_setup(){


        $("body").on('click', '#save_rsp_rating_setup', function () {
            var selectedSalary_grade = $('#selectedSalary_grade').val();
            var selectedPositions = $('#selectedPositions').val();

            // Initialize a flag to track validation errors
            var hasErrors = false;

            // Find all overAllQualificationRate inputs that are empty
            var overAllQualificationRate_inputs = $('#competency_and_qualification_container').find('input.overAllQualificationRate').filter(function() {
                var this_overAllQualificationRate = $(this);
                const sectionContainer = $(this).closest('div.sectionContainer');

                if (this_overAllQualificationRate.val().trim() === "") {
                    var countNoNullQualificationRAte = 0;
                    sectionContainer.find('input.qualificationRAte').filter(function() {
                        var this_qualificationRAte = $(this);
                        var requiredContainer = this_qualificationRAte.closest('div.intro-y.box');
                        var thisRateBase = $(this).data('rate-base');

                        // Check if this qualification is not null
                        if (this_qualificationRAte.val().trim() !== "") {
                            this_qualificationRAte.css('border-color', '');
                            countNoNullQualificationRAte++;
                            if (thisRateBase.trim() === 'qualification') {
                                // Find all required qualifications within the current sectionContainer
                                var requireQualification_inputs = requiredContainer.find('input.requiredQual');

                                // Count empty required qualifications specific to the current qualificationRAte
                                var emptyQualifications = requireQualification_inputs.filter(function() {
                                    return $(this).val().trim() === ""; // Count empty required qualifications
                                });

                                // If all required qualifications are empty
                                if (emptyQualifications.length === requireQualification_inputs.length) {
                                    // Set border red for all required qualifications
                                    requireQualification_inputs.css('border-color', 'red');
                                    hasErrors = true; // Set error flag
                                } else {
                                    // Remove red border if at least one is filled
                                    requireQualification_inputs.css('border-color', '');
                                }
                            } else if (thisRateBase.trim() === 'competency') {
                                // Find all required qualifications within the current sectionContainer
                                var requireCompetency_inputs = requiredContainer.find('input.requiredComp');

                                // Count empty required qualifications specific to the current qualificationRAte
                                var emptyCompetencies = requireCompetency_inputs.filter(function() {
                                    return $(this).val().trim() === ""; // Count empty required qualifications
                                });

                                // If all required qualifications are empty
                                if (emptyCompetencies.length === requireCompetency_inputs.length) {
                                    // Set border red for all required qualifications
                                    requireCompetency_inputs.css('border-color', 'red');
                                    hasErrors = true; // Set error flag
                                } else {
                                    // Remove red border if at least one is filled
                                    requireCompetency_inputs.css('border-color', '');
                                }
                            }
                        } else {
                            // Handle empty qualificationRAte
                            if (thisRateBase.trim() === 'qualification') {
                                var requireQualification_inputs = requiredContainer.find('input.requiredQual');
                                var emptyQualifications = requireQualification_inputs.filter(function() {
                                    return $(this).val().trim() === ""; // Count empty required qualifications
                                });

                                // If all required qualifications are empty
                                if (emptyQualifications.length === requireQualification_inputs.length) {
                                    this_qualificationRAte.css('border-color', '');
                                    requireQualification_inputs.css('border-color', '');
                                } else {
                                    this_qualificationRAte.css('border-color', 'red');
                                    hasErrors = true; // Set error flag
                                }
                            } else if (thisRateBase.trim() === 'competency') {
                                var requireCompetency_inputs = requiredContainer.find('input.requiredComp');
                                var emptyCompetencies = requireCompetency_inputs.filter(function() {
                                    return $(this).val().trim() === ""; // Count empty required qualifications
                                });

                                // If all required qualifications are empty
                                if (emptyCompetencies.length === requireCompetency_inputs.length) {
                                    this_qualificationRAte.css('border-color', '');
                                    requireCompetency_inputs.css('border-color', '');
                                } else {
                                    this_qualificationRAte.css('border-color', 'red');
                                    hasErrors = true; // Set error flag
                                }
                            }
                        }
                    });

                    if (countNoNullQualificationRAte > 0) {
                        this_overAllQualificationRate.css('border-color', 'red');
                        hasErrors = true; // Set error flag
                    } else {
                        this_overAllQualificationRate.css('border-color', '');
                    }
                } else {
                    this_overAllQualificationRate.css('border-color', '');

                    sectionContainer.find('input.qualificationRAte').filter(function() {
                        var this_qualificationRAte = $(this);
                        var requiredContainer = this_qualificationRAte.closest('div.intro-y.box');
                        var thisRateBase = $(this).data('rate-base');

                        // Check if this qualification is not null
                        if (this_qualificationRAte.val().trim() !== "") {
                            this_qualificationRAte.css('border-color', '');
                            if (thisRateBase.trim() === 'qualification') {
                                var requireQualification_inputs = requiredContainer.find('input.requiredQual');
                                var emptyQualifications = requireQualification_inputs.filter(function() {
                                    return $(this).val().trim() === ""; // Count empty required qualifications
                                });

                                // If all required qualifications are empty
                                if (emptyQualifications.length === requireQualification_inputs.length) {
                                    requireQualification_inputs.css('border-color', 'red');
                                    hasErrors = true; // Set error flag
                                } else {
                                    requireQualification_inputs.css('border-color', '');
                                }
                            } else if (thisRateBase.trim() === 'competency') {
                                var requireCompetency_inputs = requiredContainer.find('input.requiredComp');
                                var emptyCompetencies = requireCompetency_inputs.filter(function() {
                                    return $(this).val().trim() === ""; // Count empty required qualifications
                                });

                                // If all required qualifications are empty
                                if (emptyCompetencies.length === requireCompetency_inputs.length) {
                                    requireCompetency_inputs.css('border-color', 'red');
                                    hasErrors = true; // Set error flag
                                } else {
                                    requireCompetency_inputs.css('border-color', '');
                                }
                            }
                        } else {
                            if (thisRateBase.trim() === 'qualification') {
                                var requireQualification_inputs = requiredContainer.find('input.requiredQual');
                                var emptyQualifications = requireQualification_inputs.filter(function() {
                                    return $(this).val().trim() === ""; // Count empty required qualifications
                                });

                                // If all required qualifications are empty
                                if (emptyQualifications.length === requireQualification_inputs.length) {
                                    this_qualificationRAte.css('border-color', '');
                                    requireQualification_inputs.css('border-color', '');
                                } else {
                                    this_qualificationRAte.css('border-color', 'red');
                                    hasErrors = true; // Set error flag
                                }
                            } else if (thisRateBase.trim() === 'competency') {
                                var requireCompetency_inputs = requiredContainer.find('input.requiredComp');
                                var emptyCompetencies = requireCompetency_inputs.filter(function() {
                                    return $(this).val().trim() === ""; // Count empty required qualifications
                                });

                                // If all required qualifications are empty
                                if (emptyCompetencies.length === requireCompetency_inputs.length) {
                                    this_qualificationRAte.css('border-color', '');
                                    requireCompetency_inputs.css('border-color', '');
                                } else {
                                    this_qualificationRAte.css('border-color', 'red');
                                    hasErrors = true; // Set error flag
                                }
                            }
                        }
                    });
                }
            });

            // Proceed with AJAX call only if there are no errors
            if (!hasErrors) {

                $.ajax({
                    type: "post",
                    url: "/rating/save_rsp_rating_setup",
                    data: {
                        selectedPositions: selectedPositions,
                        selectedSalary_grade: selectedSalary_grade,
                        qualification_setup_data: qualification_setup_data,
                        competency_setup_data: competency_setup_data
                    },
                    dataType: "json",
                    success: function (response) {
                        if (response.status == 200) {
                            __notif_show(1, response.message);
                        } else {
                            __notif_show(-3, response.message);
                        }
                    }
                });
            }else {
                alert('Please fix the highlighted errors before saving.'); // Alert user to fix errors

            }
        });

    }
}
