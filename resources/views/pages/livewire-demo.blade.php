@extends('../layout/side-menu')

@section('subhead')
    <title>Livewire Demo - Icewall</title>
@endsection

@section('subcontent')
<div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
        <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">
                Livewire Demo
            </h2>
        </div>
        <div class="grid grid-cols-12 gap-6 mt-5">
            <div class="col-span-12 lg:col-span-6">
                @livewire('counter')
            </div>
            
            <div class="col-span-12 lg:col-span-6">
                <div class="intro-y box">
                    <div class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 class="font-medium text-base mr-auto">
                            Livewire Features
                        </h2>
                    </div>
                    <div class="p-5">
                        <div class="text-slate-600 dark:text-slate-500">
                            <div class="grid grid-cols-1 gap-4">
                                <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <h3 class="font-medium text-green-800 dark:text-green-200 mb-2">✅ Real-time Updates</h3>
                                    <p class="text-green-700 dark:text-green-300 text-sm">
                                        Components update instantly without page refreshes
                                    </p>
                                </div>
                                
                                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <h3 class="font-medium text-blue-800 dark:text-blue-200 mb-2">✅ Server-side Logic</h3>
                                    <p class="text-blue-700 dark:text-blue-300 text-sm">
                                        All logic runs on the server, no JavaScript required
                                    </p>
                                </div>
                                
                                <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                                    <h3 class="font-medium text-purple-800 dark:text-purple-200 mb-2">✅ Laravel Integration</h3>
                                    <p class="text-purple-700 dark:text-purple-300 text-sm">
                                        Seamless integration with Laravel's ecosystem
                                    </p>
                                </div>
                                
                                <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                                    <h3 class="font-medium text-orange-800 dark:text-orange-200 mb-2">✅ Easy Development</h3>
                                    <p class="text-orange-700 dark:text-orange-300 text-sm">
                                        Write reactive interfaces with simple PHP classes
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Setup Guide Link -->
        <div class="mt-6">
            <div class="intro-y box">
                <div class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">
                        Complete Setup Guide
                    </h2>
                </div>
                <div class="p-5">
                    <div class="text-center">
                        <div class="mb-4">
                            <i data-lucide="book-open" class="w-16 h-16 text-blue-500 mx-auto mb-4"></i>
                            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                Learn How to Set Up Livewire
                            </h3>
                            <p class="text-slate-600 dark:text-slate-500 mb-6">
                                Follow our comprehensive step-by-step guide to install and configure Livewire in your Laravel application.
                            </p>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <a href="/livewire-installation" class="block p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                <i data-lucide="download" class="w-8 h-8 text-blue-500 mx-auto mb-2"></i>
                                <h4 class="font-medium text-blue-800 dark:text-blue-200">Installation Steps</h4>
                                <p class="text-blue-700 dark:text-blue-300 text-xs mt-1">Step-by-step installation guide</p>
                            </a>
                            
                            <a href="/livewire-configuration" class="block p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                                <i data-lucide="settings" class="w-8 h-8 text-purple-500 mx-auto mb-2"></i>
                                <h4 class="font-medium text-purple-800 dark:text-purple-200">Configuration</h4>
                                <p class="text-purple-700 dark:text-purple-300 text-xs mt-1">Configure Livewire settings</p>
                            </a>
                            
                            <a href="/livewire-components" class="block p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                                <i data-lucide="code" class="w-8 h-8 text-green-500 mx-auto mb-2"></i>
                                <h4 class="font-medium text-green-800 dark:text-green-200">Creating Components</h4>
                                <p class="text-green-700 dark:text-green-300 text-xs mt-1">Build your first components</p>
                            </a>
                            
                            <a href="/livewire-usage" class="block p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                                <i data-lucide="zap" class="w-8 h-8 text-orange-500 mx-auto mb-2"></i>
                                <h4 class="font-medium text-orange-800 dark:text-orange-200">Usage Examples</h4>
                                <p class="text-orange-700 dark:text-orange-300 text-xs mt-1">Common usage patterns</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection 