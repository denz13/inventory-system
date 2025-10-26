<!DOCTYPE html>
<html lang="en" class="light">
<head>
    <meta charset="utf-8">
    <link href="dist/images/logo.svg" rel="shortcut icon">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="Non-Homeowner Registration">
    <meta name="keywords" content="registration, non-homeowner">
    <meta name="author" content="GCH">
    <title>Non-Homeowner Registration</title>
    <!-- BEGIN: CSS Assets-->
    <link rel="stylesheet" href="dist/css/app.css">
    <link rel="stylesheet" href="{{ asset('assets/toastify/toastify.css') }}">
    <!-- END: CSS Assets-->
    <style>
        /* Enable smooth scrolling using browser scrollbar only */
        html {
            scroll-behavior: smooth;
        }
        
        body.login {
            min-height: 100vh;
            height: auto !important;
            overflow-x: hidden;
            overflow-y: auto !important;
        }
        
        /* Remove container height restrictions */
        .container {
            min-height: 100vh;
            height: auto;
        }
        
        /* Scrollbar styling for browser scrollbar */
        ::-webkit-scrollbar {
            width: 10px;
        }
        
        ::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #94a3b8;
            border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #64748b;
        }
        
        .toastify { 
            background: transparent !important; 
            box-shadow: none !important; 
        }
        
        /* Center notification styling */
        .toastify.toastify-center {
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            right: auto !important;
            margin: 0 !important;
        }
        
        .toastify-content {
            background: #fff !important;
            color: #000 !important;
            padding: 1.5rem !important;
            border-radius: 0.75rem !important;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
            border: 1px solid #e5e7eb !important;
            min-width: 300px !important;
            max-width: 400px !important;
        }
        
        .toastify-content .font-medium {
            font-weight: 600 !important;
            font-size: 1.125rem !important;
            margin-bottom: 0.5rem !important;
            color: #1f2937 !important;
        }
        
        .toastify-content .text-slate-500 {
            color: #6b7280 !important;
            font-size: 0.875rem !important;
        }
        
        /* CheckCircle SVG icon styling */
        .toastify-content svg {
            width: 48px !important;
            height: 48px !important;
            margin-right: 1rem !important;
            color: #10b981 !important;
        }
        
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            color: #334155;
            font-weight: 500;
        }
        .border-red-500 {
            border-color: #ef4444 !important;
        }
        
        /* Ensure form sections are visible when zoomed */
        .block.xl\\:grid {
            min-height: 100vh;
        }
        
        /* Allow content to expand naturally */
        .my-auto {
            margin-top: auto;
            margin-bottom: auto;
        }
        
        /* On small screens or zoomed, use minimal margins */
        @media (max-height: 800px) {
            .my-auto {
                margin-top: 2rem;
                margin-bottom: 2rem;
            }
        }
    </style>
</head>
<body class="login">
    <div class="container sm:px-10">
        <div class="block xl:grid grid-cols-2 gap-4">
            <!-- BEGIN: Registration Info -->
            <div class="hidden xl:flex flex-col min-h-screen">
                <a href="{{ route('login.index') }}" class="-intro-x flex items-center pt-5">
                    <img alt="Logo" class="w-6" src="dist/images/logo.png">
                    <span class="text-white text-lg ml-3">GCH</span>
                </a>
                <div class="my-auto">
                    <img alt="Registration" class="-intro-x w-1/2 -mt-16" src="dist/images/illustration.svg">
                    <div class="-intro-x text-white font-medium text-2xl leading-tight mt-10">
                        Join Our Community
                    </div>
                    <div class="-intro-x mt-5 text-xs text-white text-opacity-70 dark:text-slate-400">
                        Register as a non-homeowner to access community services and features
                    </div>
                </div>
            </div>
            <!-- END: Registration Info -->
            
            <!-- BEGIN: Registration Form -->
            <div class="min-h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                <div class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                    <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                        Sign Up
                    </h2>
                    <div class="intro-x mt-2 text-slate-400 xl:hidden text-center">A few more clicks to sign up to your account. Join our community today!</div>
                    
                    <div class="intro-x mt-8">
                        <form id="registrationForm" enctype="multipart/form-data">
                            @csrf
                            
                            <div>
                                <label for="name" class="form-label text-sm font-medium text-slate-700">Full Name</label>
                                <input type="text" id="name" name="name" class="intro-x login__input form-control py-3 px-4 block" placeholder="Full Name" required>
                                <div id="name-error" class="text-red-500 text-xs mt-1 hidden"></div>
                            </div>
                            
                            <div class="mt-4">
                                <label for="email" class="form-label text-sm font-medium text-slate-700">Email Address</label>
                                <input type="email" id="email" name="email" class="intro-x login__input form-control py-3 px-4 block" placeholder="Email" required>
                                <div id="email-error" class="text-red-500 text-xs mt-1 hidden"></div>
                            </div>
                            
                            <div class="mt-4">
                                <label for="contact_number" class="form-label text-sm font-medium text-slate-700">Contact Number</label>
                                <input type="text" id="contact_number" name="contact_number" class="intro-x login__input form-control py-3 px-4 block" placeholder="Contact Number" required>
                                <div id="contact_number-error" class="text-red-500 text-xs mt-1 hidden"></div>
                            </div>
                            
                            <div class="mt-4">
                                <label for="gender" class="form-label text-sm font-medium text-slate-700">Gender</label>
                                <select id="gender" name="gender" class="intro-x login__input form-control py-3 px-4 block" required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <div id="gender-error" class="text-red-500 text-xs mt-1 hidden"></div>
                            </div>
                            
                            <div class="mt-4">
                                <label for="date_of_birth" class="form-label text-sm font-medium text-slate-700">Date of Birth</label>
                                <input type="date" id="date_of_birth" name="date_of_birth" class="intro-x login__input form-control py-3 px-4 block" required>
                                <div id="date_of_birth-error" class="text-red-500 text-xs mt-1 hidden"></div>
                            </div>
                            
                            <div class="mt-4">
                                <label for="civil_status" class="form-label text-sm font-medium text-slate-700">Civil Status</label>
                                <select id="civil_status" name="civil_status" class="intro-x login__input form-control py-3 px-4 block" required>
                                    <option value="">Select Civil Status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                                <div id="civil_status-error" class="text-red-500 text-xs mt-1 hidden"></div>
                            </div>
                            
                            <div class="mt-4">
                                <label for="photo" class="form-label text-sm font-medium text-slate-700">Profile Photo (Optional)</label>
                                <div class="intro-x login__input form-control py-3 px-4 block">
                                    <input type="file" id="photo" name="photo" accept="image/jpeg,image/png,image/jpg" class="w-full">
                                    <div class="text-xs text-slate-500 mt-1">Max 2MB - JPEG, PNG, or JPG format</div>
                                    <div id="photoPreview" class="mt-2 hidden">
                                        <img id="photoPreviewImg" src="" alt="Preview" class="w-20 h-20 object-cover rounded-lg border border-slate-300">
                                    </div>
                                </div>
                                <div id="photo-error" class="text-red-500 text-xs mt-1 hidden"></div>
                            </div>
                            
                            <div class="mt-4">
                                <label for="password" class="form-label text-sm font-medium text-slate-700">Password</label>
                                <input type="password" id="password" name="password" class="intro-x login__input form-control py-3 px-4 block w-full" placeholder="Password (minimum 8 characters)" required>
                                <div id="password-error" class="text-red-500 text-xs mt-1 hidden"></div>
                            </div>
                        </form>
                    </div>
                    <div class="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4">
                        <div class="flex items-center mr-auto">
                            <input type="checkbox" id="show-password" class="form-check-input border mr-2" onchange="togglePasswordVisibility()">
                            <span>Show Password</span>
                        </div>
                    </div>
                    <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                        <button type="button" id="submitBtn" class="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top">Register</button>
                        <a href="{{ route('login.index') }}" class="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top">Back to Login</a>
                    </div>
                </div>
            </div>
            <!-- END: Registration Form -->
        </div>
    </div>
    
    <!-- Notification templates -->
    <x-notification-toast id="registration_toast_success" type="success" title="Success" message="Registration successful! Your account is pending approval. You will be redirected to login page..." :show-button="false" position="center" gravity="center" />
    <x-notification-toast id="registration_toast_error" type="error" title="Registration failed" :show-button="false" position="center" gravity="center">
        <div id="registration-error-message-slot" class="text-slate-500 mt-1"></div>
    </x-notification-toast>
    <x-notification-toast id="registration_toast_warning" type="warning" title="Missing fields" message="Please fill in all required fields" :show-button="false" position="center" gravity="center" />
    
    <!-- BEGIN: JS Assets-->
    <script src="{{ asset('assets/toastify/toastify.js') }}"></script>
    
    <!-- Inline Functions -->
    <script>
    function togglePasswordVisibility() {
        console.log('togglePasswordVisibility called');
        const passwordInput = document.getElementById('password');
        const showPasswordCheckbox = document.getElementById('show-password');
        
        if (passwordInput && showPasswordCheckbox) {
            if (showPasswordCheckbox.checked) {
                passwordInput.type = 'text';
                console.log('Password shown');
            } else {
                passwordInput.type = 'password';
                console.log('Password hidden');
            }
        } else {
            console.error('Elements not found:', {passwordInput: !!passwordInput, showPasswordCheckbox: !!showPasswordCheckbox});
        }
    }
    </script>
    
    <script src="{{ asset('js/registration_nonhomeowners/registration_nonhomeowners.js') }}"></script>
    <!-- END: JS Assets-->
</body>
</html>
