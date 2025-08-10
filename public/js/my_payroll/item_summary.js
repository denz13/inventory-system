$(document).ready(function () {
    window.bpath = window.location.origin + "/my-payroll/";   // Adjusted base URL to include the prefix
    var _token = $('meta[name="csrf-token"]').attr("content");
    load_item_summary();
});

function load_item_summary() {
    const tableBody = $("#data-table tbody");
    tableBody.empty();

    var currentURL = window.location.href;
    var parts = currentURL.split('/');
    var itemId = parts[parts.length - 1];
    $.ajax({
        url: bpath + "summary/load/" +itemId,
        method: "GET",
        data: {
            id: itemId,
        },
        success: function (data) {
            console.log(data)
            let counter=0;
            let subtotal=0;
            if (Array.isArray(data.data) && data.data.length > 0) {
                for (let i = 0; i < data.data.length; i++) {
                    const item = data.data[i];
                    if (item.item_amount > 0) {
                        counter++;
                        let str = item.item_amount;
                        let num = parseFloat(str);
                        subtotal += num;
                        const row = `
                        <tr>
                           <td class="border-b dark:border-darkmode-400">
                                <a href="${bpath}my-payroll/payroll-details" class="font-medium whitespace-nowrap">
                                    ${item.get_payroll.pr_desc}
                                </a>
                                <div class="text-slate-500 text-sm mt-0.5 whitespace-nowrap">
                                    ${item.get_payroll.date_month} ${item.get_payroll.date_year}
                                </div>
                            </td>

                            <td class="text-right border-b dark:border-darkmode-400 w-32">${counter}</td>
                            <td class="text-right border-b dark:border-darkmode-400 w-32">₱ ${parseFloat(item.item_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td class="text-right border-b dark:border-darkmode-400 w-32 font-medium">₱ ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        `;
                        tableBody.append(row);
                    }
                }
            } else {
                console.error('data.data is not an array or is empty');
            }

            function formatDate(date) {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return date.toLocaleDateString(undefined, options);
            }

            // Get the current date
            const currentDate = new Date();

            // Format the date
            const formattedDate = formatDate(currentDate);

            // Insert the formatted date into the HTML
            document.getElementById('as-of-date').textContent = formattedDate;

            document.getElementById('item-name').textContent = data.item.name;
            document.getElementById('item-nature').textContent = data.item.nature;
            document.getElementById('grand-total').textContent = subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });


        },
        error: function (error) {
            console.log(error);
        },
    });
}
