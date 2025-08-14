<!DOCTYPE html>
<!--
Template Name: Icewall - HTML Admin Dashboard Template
Author: Left4code
Website: http://www.left4code.com/
Contact: muhammadrizki@left4code.com
Purchase: https://themeforest.net/user/left4code/portfolio
Renew Support: https://themeforest.net/user/left4code/portfolio
License: You must have a valid license purchased only from themeforest(the above link) in order to legally use the theme for your project.
-->
<html lang="en" class="light">
    <!-- BEGIN: Head -->
    <head>
        <meta charset="utf-8">
        <link href="{{ asset('build/assets/images/logo.svg') }}" rel="shortcut icon">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Icewall admin is super flexible, powerful, clean & modern responsive tailwind admin template with unlimited possibilities.">
        <meta name="keywords" content="admin template, Icewall Admin Template, dashboard template, flat admin template, responsive admin template, web app">
        <meta name="author" content="LEFT4CODE">
        <title>@yield('title', 'Dashboard - Midone - Tailwind HTML Admin Template')</title>
        <!-- BEGIN: CSS Assets-->
        @vite('resources/css/app.css')
        <link rel="stylesheet" href="{{ asset('assets/toastify/toastify.css') }}">
        @livewireStyles
        <!-- END: CSS Assets-->
    </head>
    <!-- END: Head -->
    <body class="main">
        <!-- BEGIN: Mobile Menu -->
        @include('layout._partials.mobile')
        <!-- END: Mobile Menu -->
        <!-- BEGIN: Top Bar -->
        @include('layout._partials.topbar')
        <!-- END: Top Bar -->
        <div class="wrapper">
            <div class="wrapper-box">
                <!-- BEGIN: Side Menu -->
                @include('layout._partials.sidebar')
                <!-- END: Side Menu -->
                <!-- BEGIN: Content -->
                <div class="content">
                    @yield('content')
                </div>
                <!-- END: Content -->
            </div>
        </div>
        @include('layout._partials.mobile')
        <!-- BEGIN: JS Assets-->
        @vite('resources/js/app.js')
        <script src="{{ asset('assets/toastify/toastify.js') }}"></script>
        @livewireScripts
        @stack('scripts')
        <!-- END: JS Assets-->
    </body>
</html>