import TomSelect from "tom-select";

(function ($) {
    "use strict";

    // Initialize TomSelect on a single element with a specific ID
    $.fn.initializeTomSelectForId = function (options = {}) {
        // Ensure there's only one element to initialize
        if (this.length !== 1) {
            console.error("This method is intended to initialize TomSelect on a single element with a specific ID.");
            return this;
        }

        let tomSelectOptions = {
            plugins: {
                dropdown_input: {},
            },
            ...options // Merge user-provided options
        };

        // Check if there's a placeholder data attribute and set it
        if (this.data("placeholder")) {
            tomSelectOptions.placeholder = this.data("placeholder");
        }

        // Check if the element has the 'multiple' attribute and adjust options
        if (this.attr("multiple") !== undefined) {
            tomSelectOptions = {
                ...tomSelectOptions,
                plugins: {
                    ...tomSelectOptions.plugins,
                    remove_button: {
                        title: "Remove this item",
                    },
                },
                persist: false,
                create: true,
                onDelete: function (values) {
                    return confirm(
                        values.length > 1
                            ? "Are you sure you want to remove these " +
                              values.length +
                              " items?"
                            : 'Are you sure you want to remove "' +
                              values[0] +
                              '"?'
                    );
                },
            };
        }

        // Check if there's a header data attribute and set it
        if (this.data("header")) {
            tomSelectOptions = {
                ...tomSelectOptions,
                plugins: {
                    ...tomSelectOptions.plugins,
                    dropdown_header: {
                        title: this.data("header"),
                    },
                },
            };
        }

        // Initialize TomSelect on the single element
        new TomSelect(this[0], tomSelectOptions);

        return this; // Allow chaining
    };

    // Example usage: Initialize TomSelect on an element with a specific ID
    $(document).ready(function () {
        // Call the method with a specific ID
        $('#specific-id').initializeTomSelectForId({
            // Additional options can be passed here if needed
        });
    });

})(jQuery);
