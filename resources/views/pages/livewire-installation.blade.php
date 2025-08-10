@extends('../layout/side-menu')

@section('subhead')
    <title>Livewire Installation - Icewall</title>
@endsection

@section('subcontent')
<div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
        <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">
                Livewire Installation Guide
            </h2>
        </div>
        <div class="grid grid-cols-12 gap-6 mt-5">
            <div class="col-span-12">
                <div class="intro-y box">
                    <div class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 class="font-medium text-base mr-auto">
                            Step-by-Step Installation
                        </h2>
                        <div class="badge badge-success">Completed</div>
                    </div>
                    <div class="p-5">
                        <div class="space-y-6">
                            <!-- Step 1 -->
                            <div class="border-l-4 border-blue-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Step 1: Install Livewire Package
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <code class="text-sm">composer require livewire/livewire</code>
                                </div>
                                <div class="flex items-center text-green-600 dark:text-green-400">
                                    <i data-lucide="check-circle" class="w-5 h-5 mr-2"></i>
                                    <span class="text-sm">Package installed successfully</span>
                                </div>
                            </div>

                            <!-- Step 2 -->
                            <div class="border-l-4 border-blue-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Step 2: Publish Configuration
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <code class="text-sm">php artisan livewire:publish --config</code>
                                </div>
                                <div class="flex items-center text-green-600 dark:text-green-400">
                                    <i data-lucide="check-circle" class="w-5 h-5 mr-2"></i>
                                    <span class="text-sm">Configuration file published to config/livewire.php</span>
                                </div>
                            </div>

                            <!-- Step 3 -->
                            <div class="border-l-4 border-blue-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Step 3: Add Livewire Directives to Layout
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <div class="text-sm">
                                        <div class="mb-2">Add to <code>&lt;head&gt;</code> section:</div>
                                        <code>@livewireStyles</code>
                                        <div class="mt-2">Add before <code>&lt;/html&gt;</code>:</div>
                                        <code>@livewireScripts</code>
                                    </div>
                                </div>
                                <div class="flex items-center text-green-600 dark:text-green-400">
                                    <i data-lucide="check-circle" class="w-5 h-5 mr-2"></i>
                                    <span class="text-sm">Directives added to resources/views/layout/base.blade.php</span>
                                </div>
                            </div>

                            <!-- Step 4 -->
                            <div class="border-l-4 border-blue-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Step 4: Create Your First Component
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <code class="text-sm">php artisan make:livewire Counter</code>
                                </div>
                                <div class="flex items-center text-green-600 dark:text-green-400">
                                    <i data-lucide="check-circle" class="w-5 h-5 mr-2"></i>
                                    <span class="text-sm">Counter component created successfully</span>
                                </div>
                            </div>

                            <!-- Step 5 -->
                            <div class="border-l-4 border-blue-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Step 5: Use Component in Views
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <code class="text-sm">@livewire('counter')</code>
                                </div>
                                <div class="flex items-center text-green-600 dark:text-green-400">
                                    <i data-lucide="check-circle" class="w-5 h-5 mr-2"></i>
                                    <span class="text-sm">Component integrated into demo page</span>
                                </div>
                            </div>
                        </div>

                        <!-- Success Message -->
                        <div class="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div class="flex items-center">
                                <i data-lucide="check-circle" class="w-6 h-6 text-green-600 dark:text-green-400 mr-3"></i>
                                <div>
                                    <h4 class="font-medium text-green-800 dark:text-green-200">Installation Complete!</h4>
                                    <p class="text-green-700 dark:text-green-300 text-sm mt-1">
                                        Livewire is now fully installed and ready to use. You can start creating interactive components.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection 