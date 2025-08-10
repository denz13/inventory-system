$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function () {

    $('body').on('click', '.btn_toggle_tutorial', function (){
        composingDocumentTutorial();
    });

    $('body').on('click', '.btn_toggle_inbox_tutorial', function (){
        inboxPageTutorial();
    });

});

function composingDocumentTutorial(){

    const composeDocumentDriver         = window.driver.js.driver;
    const modalComposeTutorialDriver    = composeDocumentDriver({
        showProgress: true,
        steps: [
            { element: '#label_document_type_submitted', popover: { title: 'Document Copy Type', description: 'Select the type of document you are submitting.', side: 'bottom', align: 'start' }},
            { element: '#document_title', popover: { title: 'Document Title', description: 'Enter the title of the document here.', side: 'bottom', align: 'start' }},
            { element: '#message', popover: { title: 'Document Description', description: 'Provide a description for the document.', side: 'bottom', align: 'start' }},
            { element: '#label_document_type', popover: { title: 'Document Type', description: 'Choose the type of document from the list.', side: 'bottom', align: 'start' }},
            { element: '#label_document_level', popover: { title: 'Document Level', description: 'Select the level of the document.', side: 'bottom', align: 'start' }},
            { element: '#label_document_pub_pri_file', popover: { title: 'Document Display Type', description: 'Specify whether the document is private or public.', side: 'bottom', align: 'start' }},
            { element: '#label_document_attachments', popover: { title: 'Document Attachment(s)', description: 'Lastly, please attach your document files here if necessary. Note: Maximum size is 5 MB.', side: 'bottom', align: 'start' }},
            { popover: { title: 'Congratulations!!', description: 'You have completed the tutorial. Start adding your documents!' } }
        ]
    });

    return modalComposeTutorialDriver.drive();

}

function inboxPageTutorial(){

    const inboxMenuTutorialDriver = window.driver.js.driver;
    const driverObj = inboxMenuTutorialDriver({
        showProgress: true,
        steps: [
            {
                element: '.btn_compose_document',
                popover: {
                    title: 'Compose Document Button',
                    description: 'Click here to compose new document.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: 'a[data-filter="inbox"]',
                popover: {
                    title: 'Inbox',
                    description: 'Click here to view your inbox messages.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: 'a[data-filter="created"]',
                popover: {
                    title: 'Created',
                    description: 'View documents or items you have created.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: 'a[data-filter="draft"]',
                popover: {
                    title: 'Draft',
                    description: 'Access your draft documents or items.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: 'a[data-filter="incoming"]',
                popover: {
                    title: 'Incoming',
                    description: 'View all incoming documents or requests.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: 'a[data-filter="received"]',
                popover: {
                    title: 'Received',
                    description: 'View all documents or items you have received.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: 'a[data-filter="ongoing"]',
                popover: {
                    title: 'Ongoing',
                    description: 'Check the status of ongoing tasks or processes.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: 'a[data-filter="on-hold"]',
                popover: {
                    title: 'On Hold',
                    description: 'View items or tasks that are currently on hold.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: 'a[data-filter="returned"]',
                popover: {
                    title: 'Returned',
                    description: 'See which documents or items have been returned to you.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: 'a[data-filter="marked"]',
                popover: {
                    title: 'Marked',
                    description: 'View documents or items that have been marked.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: 'a[data-filter="starred"]',
                popover: {
                    title: 'Starred',
                    description: 'See all starred documents or items.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: 'a[data-filter="bookmarked"]',
                popover: {
                    title: 'Bookmarked',
                    description: 'Access your bookmarked documents or items.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: 'a[data-filter="sent"]',
                popover: {
                    title: 'Sent',
                    description: 'View all sent documents or items.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: 'a[data-filter="trash"]',
                popover: {
                    title: 'Trash',
                    description: 'Check the trash for deleted documents or items.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: '.inbox_filter',
                popover: {
                    title: 'Search Filter',
                    description: 'Use this filter to search and narrow down documents based on specific criteria.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: '#selectAllCheckbox',
                popover: {
                    title: 'Select All Checkbox',
                    description: 'Check this box to select all documents displayed on the current page.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: '.refesh-items',
                popover: {
                    title: 'Refresh Button',
                    description: 'Click this button to reload and refresh the list of documents to see the latest updates.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: '.inbox-contents',
                popover: {
                    title: 'Inbox Content Area',
                    description: 'This area displays all the documents currently available in your inbox.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: '.star-button',
                popover: {
                    title: 'Star Button',
                    description: 'Click to add documents to starred items.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: '.bookmark-button',
                popover: {
                    title: 'Bookmark Button',
                    description: 'Click to add documents to bookmarked items.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: '.qrCode-button',
                popover: {
                    title: 'QR Code Button',
                    description: 'Click to view generated QR Code and document details.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: '.document_more_details',
                popover: {
                    title: 'Document Additional Information',
                    description: 'Displays the type of document and the date it was created.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                popover: {
                    title: 'Tutorial Completed!',
                    description: 'You have now completed the tutorial. Explore and manage your documents effectively!',
                    side: 'center',
                    align: 'center'
                }
            },
        ]
    });

    // Start the tutorial
    return  driverObj.drive();
}



