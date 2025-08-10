<?php

namespace App\Main;

class SideMenu
{
    /**
     * List of side menu items.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public static function menu()
    {
        return [

            
            'dashboard' => [
                'icon' => 'home',
                'title' => 'Dashboard',
                'sub_menu' => [
                    'dashboard-overview-1' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'dashboard.dashboard-overview-1'
                        ],
                        'title' => 'Overview 1'
                    ],
                    'dashboard-overview-2' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'dashboard.dashboard-overview-2'
                        ],
                        'title' => 'Overview 2'
                    ],
                    'dashboard-overview-3' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'dashboard.dashboard-overview-3'
                        ],
                        'title' => 'Overview 3'
                    ],
                    'dashboard-overview-4' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'dashboard.dashboard-overview-4'
                        ],
                        'title' => 'Overview 4'
                    ]
                ]
            ],
            // 'menu-layout' => [
            //     'icon' => 'box',
            //     'title' => 'Menu Layout',
            //     'sub_menu' => [
            //         'side-menu' => [
            //             'icon' => '',
            //             'route_name' => 'page.show',
            //             'params' => [
            //                 'layout' => 'side-menu',
            //                 'page' => 'dashboard-overview-1'
            //             ],
            //             'title' => 'Side Menu'
            //         ],
            //         'simple-menu' => [
            //             'icon' => '',
            //             'route_name' => 'page.show',
            //             'params' => [
            //                 'layout' => 'simple-menu',
            //                 'page' => 'dashboard-overview-1'
            //             ],
            //             'title' => 'Simple Menu'
            //         ],
            //         'top-menu' => [
            //             'icon' => '',
            //             'route_name' => 'page.show',
            //             'params' => [
            //                 'layout' => 'top-menu',
            //                 'page' => 'dashboard-overview-1'
            //             ],
            //             'title' => 'Top Menu'
            //         ]
            //     ]
            // ],
            'e-commerce' => [
                'icon' => 'shopping-bag',
                'title' => 'E-Commerce',
                'sub_menu' => [
                    'categories' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'e-commerce.categories'
                        ],
                        'title' => 'Categories'
                    ],
                    'add-product' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'e-commerce.add-product'
                        ],
                        'title' => 'Add Product',
                    ],
                    'products' => [
                        'icon' => '',
                        'title' => 'Products',
                        'sub_menu' => [
                            'product-list' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'e-commerce.product-list'
                                ],
                                'title' => 'Product List'
                            ],
                            'product-grid' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'e-commerce.product-grid'
                                ],
                                'title' => 'Product Grid'
                            ]
                        ]
                    ],
                    'transactions' => [
                        'icon' => '',
                        'title' => 'Transactions',
                        'sub_menu' => [
                            'transaction-list' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'e-commerce.transaction-list'
                                ],
                                'title' => 'Transaction List'
                            ],
                            'transaction-detail' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'e-commerce.transaction-detail'
                                ],
                                'title' => 'Transaction Detail'
                            ]
                        ]
                    ],
                    'sellers' => [
                        'icon' => '',
                        'title' => 'Sellers',
                        'sub_menu' => [
                            'seller-list' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'e-commerce.seller-list'
                                ],
                                'title' => 'Seller List'
                            ],
                            'seller-detail' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'e-commerce.seller-detail'
                                ],
                                'title' => 'Seller Detail'
                            ]
                        ]
                    ],
                    'reviews' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'e-commerce.reviews'
                        ],
                        'title' => 'Reviews'
                    ],
                ]
            ],
            'inbox' => [
                'icon' => 'inbox',
                'route_name' => 'page.show',
                'params' => [
                    'layout' => 'side-menu',
                    'page' => 'inbox'
                ],
                'title' => 'Inbox'
            ],
            'file-manager' => [
                'icon' => 'hard-drive',
                'route_name' => 'page.show',
                'params' => [
                    'layout' => 'side-menu',
                    'page' => 'file-manager'
                ],
                'title' => 'File Manager'
            ],
            'point-of-sale' => [
                'icon' => 'credit-card',
                'route_name' => 'page.show',
                'params' => [
                    'layout' => 'side-menu',
                    'page' => 'point-of-sale'
                ],
                'title' => 'Point of Sale'
            ],
            'chat' => [
                'icon' => 'message-square',
                'route_name' => 'page.show',
                'params' => [
                    'layout' => 'side-menu',
                    'page' => 'chat'
                ],
                'title' => 'Chat'
            ],
            'post' => [
                'icon' => 'file-text',
                'route_name' => 'page.show',
                'params' => [
                    'layout' => 'side-menu',
                    'page' => 'post'
                ],
                'title' => 'Post'
            ],
            'calendar' => [
                'icon' => 'calendar',
                'route_name' => 'page.show',
                'params' => [
                    'layout' => 'side-menu',
                    'page' => 'calendar'
                ],
                'title' => 'Calendar'
            ],
            'devider',
            'crud' => [
                'icon' => 'edit',
                'title' => 'Crud',
                'sub_menu' => [
                    'crud-data-list' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'crud.crud-data-list'
                        ],
                        'title' => 'Data List'
                    ],
                    'crud-form' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'crud.crud-form'
                        ],
                        'title' => 'Form'
                    ]
                ]
            ],
            'users' => [
                'icon' => 'users',
                'title' => 'Users',
                'sub_menu' => [
                    'users-layout-1' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'users.users-layout-1'
                        ],
                        'title' => 'Layout 1'
                    ],
                    'users-layout-2' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'users.users-layout-2'
                        ],
                        'title' => 'Layout 2'
                    ],
                    'users-layout-3' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'users.users-layout-3'
                        ],
                        'title' => 'Layout 3'
                    ]
                ]
            ],
            'profile' => [
                'icon' => 'trello',
                'title' => 'Profile',
                'sub_menu' => [
                    'profile-overview-1' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'profile.profile-overview-1'
                        ],
                        'title' => 'Overview 1'
                    ],
                    'profile-overview-2' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'profile.profile-overview-2'
                        ],
                        'title' => 'Overview 2'
                    ],
                    'profile-overview-3' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'profile.profile-overview-3'
                        ],
                        'title' => 'Overview 3'
                    ]
                ]
            ],
            'pages' => [
                'icon' => 'layout',
                'title' => 'Pages',
                'sub_menu' => [
                    'wizards' => [
                        'icon' => '',
                        'title' => 'Wizards',
                        'sub_menu' => [
                            'wizard-layout-1' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'pages.wizards.wizard-layout-1'
                                ],
                                'title' => 'Layout 1'
                            ],
                            'wizard-layout-2' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'pages.wizards.wizard-layout-2'
                                ],
                                'title' => 'Layout 2'
                            ],
                            'wizard-layout-3' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'pages.wizards.wizard-layout-3'
                                ],
                                'title' => 'Layout 3'
                            ]
                        ]
                    ],
                    'blog' => [
                        'icon' => '',
                        'title' => 'Blog',
                        'sub_menu' => [
                            'blog-layout-1' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'pages.blogs.blog-layout-1'
                                ],
                                'title' => 'Layout 1'
                            ],
                            'blog-layout-2' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'pages.blogs.blog-layout-2'
                                ],
                                'title' => 'Layout 2'
                            ],
                            'blog-layout-3' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'pages.blogs.blog-layout-3'
                                ],
                                'title' => 'Layout 3'
                            ]
                        ]
                    ],
                    'pricing' => [
                        'icon' => '',
                        'title' => 'Pricing',
                        'sub_menu' => [
                            'pricing-layout-1' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'pages.pricing.pricing-layout-1'
                                ],
                                'title' => 'Layout 1'
                            ],
                            'pricing-layout-2' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'pages.pricing.pricing-layout-2'
                                ],
                                'title' => 'Layout 2'
                            ]
                        ]
                    ],
                    'invoice' => [
                        'icon' => '',
                        'title' => 'Invoice',
                        'sub_menu' => [
                            'invoice-layout-1' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'pages.invoices.invoice-layout-1'
                                ],
                                'title' => 'Layout 1'
                            ],
                            'invoice-layout-2' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'pages.invoices.invoice-layout-2'
                                ],
                                'title' => 'Layout 2'
                            ]
                        ]
                    ],
                    'faq' => [
                        'icon' => '',
                        'title' => 'FAQ',
                        'sub_menu' => [
                            'faq-layout-1' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'pages.faqs.faq-layout-1'
                                ],
                                'title' => 'Layout 1'
                            ],
                            'faq-layout-2' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'pages.faqs.faq-layout-2'
                                ],
                                'title' => 'Layout 2'
                            ],
                            'faq-layout-3' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'pages.faqs.faq-layout-3'
                                ],
                                'title' => 'Layout 3'
                            ]
                        ]
                    ],
                    'login' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'login',
                            'page' => 'login'
                        ],
                        'title' => 'Login'
                    ],
                    'register' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'login',
                            'page' => 'register'
                        ],
                        'title' => 'Register'
                    ],
                    'error-page' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'error-page'
                        ],
                        'title' => 'Error Page'
                    ],
                    'update-profile' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'update-profile'
                        ],
                        'title' => 'Update profile'
                    ],
                    'change-password' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'change-password'
                        ],
                        'title' => 'Change Password'
                    ]
                ]
            ],
            'devider',
            'components' => [
                'icon' => 'inbox',
                'title' => 'Components',
                'sub_menu' => [
                    'grid' => [
                        'icon' => '',
                        'title' => 'Grid',
                        'sub_menu' => [
                            'regular-table' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'regular-table'
                                ],
                                'title' => 'Regular Table'
                            ],
                            'tabulator' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'tabulator'
                                ],
                                'title' => 'Tabulator'
                            ]
                        ]
                    ],
                    'overlay' => [
                        'icon' => '',
                        'title' => 'Overlay',
                        'sub_menu' => [
                            'modal' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'modal'
                                ],
                                'title' => 'Modal'
                            ],
                            'slide-over' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'slide-over'
                                ],
                                'title' => 'Slide Over'
                            ],
                            'notification' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'notification'
                                ],
                                'title' => 'Notification'
                            ],
                        ]
                    ],
                    'tab' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'tab'
                        ],
                        'title' => 'Tab'
                    ],
                    'accordion' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'accordion'
                        ],
                        'title' => 'Accordion'
                    ],
                    'button' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'button'
                        ],
                        'title' => 'Button'
                    ],
                    'alert' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'alert'
                        ],
                        'title' => 'Alert'
                    ],
                    'progress-bar' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'progress-bar'
                        ],
                        'title' => 'Progress Bar'
                    ],
                    'tooltip' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'tooltip'
                        ],
                        'title' => 'Tooltip'
                    ],
                    'dropdown' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'dropdown'
                        ],
                        'title' => 'Dropdown'
                    ],
                    'typography' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'typography'
                        ],
                        'title' => 'Typography'
                    ],
                    'icon' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'icon'
                        ],
                        'title' => 'Icon'
                    ],
                    'loading-icon' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'loading-icon'
                        ],
                        'title' => 'Loading Icon'
                    ]
                ]
            ],
          
            'forms' => [
                'icon' => 'sidebar',
                'title' => 'Forms',
                'sub_menu' => [
                    'regular-form' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'regular-form'
                        ],
                        'title' => 'Regular Form'
                    ],
                    'datepicker' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'datepicker'
                        ],
                        'title' => 'Datepicker'
                    ],
                    'tom-select' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'tom-select'
                        ],
                        'title' => 'Tom Select'
                    ],
                    'file-upload' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'file-upload'
                        ],
                        'title' => 'File Upload'
                    ],
                    'wysiwyg-editor' => [
                        'icon' => '',
                        'title' => 'Wysiwyg Editor',
                        'sub_menu' => [
                            'wysiwyg-editor-classic' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'wysiwyg-editor-classic'
                                ],
                                'title' => 'Classic'
                            ],
                            'wysiwyg-editor-inline' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'wysiwyg-editor-inline'
                                ],
                                'title' => 'Inline'
                            ],
                            'wysiwyg-editor-balloon' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'wysiwyg-editor-balloon'
                                ],
                                'title' => 'Balloon'
                            ],
                            'wysiwyg-editor-balloon-block' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'wysiwyg-editor-balloon-block'
                                ],
                                'title' => 'Balloon Block'
                            ],
                            'wysiwyg-editor-document' => [
                                'icon' => '',
                                'route_name' => 'page.show',
                                'params' => [
                                    'layout' => 'side-menu',
                                    'page' => 'wysiwyg-editor-document'
                                ],
                                'title' => 'Document'
                            ],
                        ]
                    ],
                    'validation' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'validation'
                        ],
                        'title' => 'Validation'
                    ]
                ]
            ],
            'widgets' => [
                'icon' => 'hard-drive',
                'title' => 'Widgets',
                'sub_menu' => [
                    'chart' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'chart'
                        ],
                        'title' => 'Chart'
                    ],
                    'slider' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'slider'
                        ],
                        'title' => 'Slider'
                    ],
                    'image-zoom' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'image-zoom'
                        ],
                        'title' => 'Image Zoom'
                    ]
                ]
            ],

            'alpine-components' => [
                'icon' => 'sidebar',
                'title' => 'Alpine',
                'sub_menu' => [
                    'alpine-components-demo' => [
                        'icon' => '',
                        'route_name' => 'page.show',
                        'params' => [
                            'layout' => 'side-menu',
                            'page' => 'alpine-components-demo'
                        ],
                        'title' => 'Alpine Demo'
                    ]
                ]
                    ],

            
        ];
    }
}
