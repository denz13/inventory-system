<!-- BEGIN: Mobile Menu -->
<div class="mobile-menu md:hidden">
    <div class="mobile-menu-bar">
        <a href="" class="flex mr-auto">
            <img alt="Midone - HTML Admin Template" class="w-6" src="dist/images/logo.svg">
        </a>
        <a href="javascript:;" class="mobile-menu-toggler"> <i data-lucide="bar-chart-2" class="w-8 h-8 text-white transform -rotate-90"></i> </a>
    </div>
    <div class="scrollable">
        <a href="javascript:;" class="mobile-menu-toggler"> <i data-lucide="x-circle" class="w-8 h-8 text-white transform -rotate-90"></i> </a>
        <ul class="scrollable__content py-2">
            <li>
                <a href="{{ url('dashboard') }}" class="menu">
                    <div class="menu__icon"> <i data-lucide="home"></i> </div>
                            <div class="menu__title"> Dashboard </div>
                </a>
            </li>
            @if(auth()->user()->hasPermission('message'))
            <li>
                <a href="{{ route('chat.index') }}" class="menu">
                    <div class="menu__icon"> <i data-lucide="message-circle"></i> </div>
                    <div class="menu__title"> Message </div>
                </a>
            </li>
            @endif
            @if(auth()->user()->hasPermission('feedback'))
            <li>
                <a href="{{ route('feedback.index') }}" class="menu">
                    <div class="menu__icon"> <i data-lucide="file-text"></i> </div>
                    <div class="menu__title"> Feedback </div>
                </a>
            </li>
            @endif
            <li>
                <a href="{{ route('business.index') }}" class="menu">
                    <div class="menu__icon"> <i data-lucide="file-text"></i> </div>
                    <div class="menu__title"> Apply Business </div>
                </a>
            </li>
            <li>
                <a href="{{ route('landlord.index') }}" class="menu">
                    <div class="menu__icon"> <i data-lucide="file-text"></i> </div>
                    <div class="menu__title"> Apply Landlord </div>
                </a>
            </li>
            
            <li class="menu__devider my-6"></li>
            
            @if(auth()->user()->hasPermission('service request'))
            <li>
                <a href="javascript:;" class="menu">
                    <div class="menu__icon"> <i data-lucide="users"></i> </div>
                    <div class="menu__title"> Service Request <i data-lucide="chevron-down" class="menu__sub-icon "></i> </div>
                </a>
                <ul class="">
                    <li>
                        <a href="{{ route('complaints.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Request Now </div>
                        </a>
                    </li>
                </ul>
            </li>
            @endif
            @if(auth()->user()->hasPermission('incident report'))
            <li>
                <a href="javascript:;" class="menu">
                    <div class="menu__icon"> <i data-lucide="alert-circle"></i> </div>
                    <div class="menu__title"> Incident Report <i data-lucide="chevron-down" class="menu__sub-icon "></i> </div>
                </a>
                <ul class="">
                    <li>
                        <a href="{{ route('incident.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Report Now </div>
                        </a>
                    </li>
                </ul>
            </li>
            @endif
            @if(auth()->user()->hasPermission('billing payment'))
            <li>
                <a href="javascript:;" class="menu">
                    <div class="menu__icon"> <i data-lucide="credit-card"></i> </div>
                    <div class="menu__title"> Billing Payment <i data-lucide="chevron-down" class="menu__sub-icon "></i> </div>
                </a>
                <ul class="">
                    <li>
                        <a href="{{ route('billing-payment.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Payment Now </div>
                        </a>
                    </li>
                </ul>
            </li>
            @endif
            @if(auth()->user()->hasPermission('vehicle'))
            <li>
                <a href="{{ route('vehicle.index') }}" class="menu">
                    <div class="menu__icon"> <i data-lucide="car"></i> </div>
                    <div class="menu__title"> Vehicle </div>
                </a>
            </li>
            @endif
            @if(auth()->user()->hasPermission('information') || auth()->user()->hasPermission('user management') || auth()->user()->hasPermission('business management') || auth()->user()->hasPermission('vehicle management') || auth()->user()->hasPermission('service management') || auth()->user()->hasPermission('incident management') || auth()->user()->hasPermission('announcement') || auth()->user()->hasPermission('billing management') || auth()->user()->hasPermission('payment account management') || auth()->user()->hasPermission('feedback management') || auth()->user()->hasPermission('appointment management'))
            <li>
                <a href="javascript:;" class="menu">
                    <div class="menu__icon"> <i data-lucide="trello"></i> </div>
                    <div class="menu__title"> Information <i data-lucide="chevron-down" class="menu__sub-icon "></i> </div>
                </a>
                <ul class="">
                    @if(auth()->user()->hasPermission('user management'))
                    <li>
                        <a href="{{ route('usermanagement.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> User Management </div>
                        </a>
                    </li>
                    @endif
                    @if(auth()->user()->hasPermission('business management'))
                    <li>
                        <a href="{{ route('businessmanagement.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Establishment Management </div>
                        </a>
                    </li>
                    @endif
                    @if(auth()->user()->hasPermission('vehicle management'))
                    <li>
                        <a href="{{ route('vehiclemanagement.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Vehicle Management </div>
                        </a>
                    </li>
                    @endif
                    @if(auth()->user()->hasPermission('service management'))
                    <li>
                        <a href="{{ route('service-management.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Service Management </div>
                        </a>
                    </li>
                    @endif
                    @if(auth()->user()->hasPermission('incident management'))
                    <li>
                        <a href="{{ route('incident-report-management.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Incident Management </div>
                        </a>
                    </li>
                    @endif
                    @if(auth()->user()->hasPermission('announcement'))
                    <li>
                        <a href="{{ route('announcement.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Announcement </div>
                        </a>
                    </li>
                    @endif
                    
                    @if(auth()->user()->hasPermission('billing management'))
                    <li>
                        <a href="javascript:;" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Billing Management <i data-lucide="chevron-down" class="menu__sub-icon "></i> </div>
                        </a>
                        <ul class="">
                            <li>
                                <a href="{{ route('billing-management.index') }}" class="menu">
                                    <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                                    <div class="menu__title"> Create Billing </div>
                                </a>
                            </li>
                            <li>
                                <a href="{{ route('list-payments.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                                    <div class="menu__title"> List of Payments </div>
                                </a>
                            </li>
                        </ul>
                    </li>
                    @endif
                    @if(auth()->user()->hasPermission('payment account management'))
                    <li>
                        <a href="{{ route('bank-account.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Payment Account Management </div>
                        </a>
                    </li>
                    @endif
                    @if(auth()->user()->hasPermission('feedback management'))
                    <li>
                        <a href="{{ route('feedback-management.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Feedback Management </div>
                        </a>
                    </li>
                    @endif
                    @if(auth()->user()->hasPermission('appointment management'))
                    <li>
                        <a href="{{ route('appointment-management.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Appointment Management </div>
                        </a>
                    </li>
                    @endif
                    
                    <li>
                        <a href="{{ route('chatbot.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="message-circle"></i> </div>
                            <div class="menu__title"> Guest Chatbot </div>
                        </a>
                    </li>

                    <li>
                        <a href="{{ route('landlord-management.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Landlord Management </div>
                        </a>
                    </li>
                </ul>
            </li>
            @endif
            
            <li class="menu__devider my-6"></li>
            
            @if(auth()->user()->hasPermission('notification settings') || auth()->user()->hasPermission('system settings') || auth()->user()->hasPermission('permission settings'))
            <li>
                <a href="javascript:;" class="menu">
                    <div class="menu__icon"> <i data-lucide="hard-drive"></i> </div>
                    <div class="menu__title"> Settings <i data-lucide="chevron-down" class="menu__sub-icon "></i> </div>
                </a>
                <ul class="">
                    @if(auth()->user()->hasPermission('notification settings'))
                    <li>
                        <a href="{{ route('notification-settings.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Notification Settings </div>
                        </a>
                    </li>
                    @endif
                    @if(auth()->user()->hasPermission('system settings'))
                    <li>
                        <a href="{{ route('system-settings.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> System Settings </div>
                        </a>
                    </li>
                    @endif
                    @if(auth()->user()->hasPermission('permission settings'))
                    <li>
                        <a href="{{ route('permission-settings.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Permission Settings </div>
                        </a>
                    </li>
                    @endif
                    <li>
                        <a href="{{ route('landlord-permission.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Landlord Permissions </div>
                        </a>
                    </li>
                </ul>
            </li>
            @endif
            <li>
                <a href="javascript:;" class="menu">
                    <div class="menu__icon"> <i data-lucide="hard-drive"></i> </div>
                    <div class="menu__title"> Activity Records <i data-lucide="chevron-down" class="menu__sub-icon "></i> </div>
                </a>
                <ul class="">
                    <li>
                        <a href="{{ route('activity-logs.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Activity Logs </div>
                        </a>
                    </li>
                    <li>
                        <a href="{{ route('users-login.index') }}" class="menu">
                            <div class="menu__icon"> <i data-lucide="activity"></i> </div>
                            <div class="menu__title"> Users Login </div>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</div>
<!-- END: Mobile Menu -->
<!-- END: Mobile Menu -->