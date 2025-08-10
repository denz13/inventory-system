@extends('../layout/side-menu')

@section('subhead')
    <title>Livewire Configuration - Icewall</title>
@endsection

@section('subcontent')
<div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
        <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">
                Livewire Configuration Guide
            </h2>
        </div>
        <div class="grid grid-cols-12 gap-6 mt-5">
            <div class="col-span-12">
                <div class="intro-y box">
                    <div class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 class="font-medium text-base mr-auto">
                            Configuration Settings
                        </h2>
                    </div>
                    <div class="p-5">
                        <div class="space-y-6">
                            <!-- Layout Configuration -->
                            <div class="border-l-4 border-purple-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Layout Configuration
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <div class="text-sm">
                                        <div class="mb-2">File: <code>resources/views/layout/base.blade.php</code></div>
                                        <div class="mb-2">Add to <code>&lt;head&gt;</code>:</div>
                                        <code>@livewireStyles</code>
                                        <div class="mt-2">Add before <code>&lt;/html&gt;</code>:</div>
                                        <code>@livewireScripts</code>
                                    </div>
                                </div>
                                <div class="flex items-center text-green-600 dark:text-green-400">
                                    <i data-lucide="check-circle" class="w-5 h-5 mr-2"></i>
                                    <span class="text-sm">Layout configured successfully</span>
                                </div>
                            </div>

                            <!-- Config File -->
                            <div class="border-l-4 border-purple-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Configuration File
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <div class="text-sm">
                                        <div class="mb-2">File: <code>config/livewire.php</code></div>
                                        <div class="mb-2">Key settings:</div>
                                        <ul class="list-disc list-inside space-y-1">
                                            <li><code>'asset_url' => null</code> - CDN for assets</li>
                                            <li><code>'app_url' => null</code> - App URL for Livewire</li>
                                            <li><code>'middleware_group' => 'web'</code> - Middleware group</li>
                                            <li><code>'manifest_path' => null</code> - Asset manifest</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="flex items-center text-green-600 dark:text-green-400">
                                    <i data-lucide="check-circle" class="w-5 h-5 mr-2"></i>
                                    <span class="text-sm">Configuration file published</span>
                                </div>
                            </div>

                            <!-- Component Structure -->
                            <div class="border-l-4 border-purple-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Component Structure
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <div class="text-sm">
                                        <div class="mb-2">Components are stored in:</div>
                                        <ul class="list-disc list-inside space-y-1">
                                            <li><code>app/Http/Livewire/</code> - Component classes</li>
                                            <li><code>resources/views/livewire/</code> - Component views</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="flex items-center text-green-600 dark:text-green-400">
                                    <i data-lucide="check-circle" class="w-5 h-5 mr-2"></i>
                                    <span class="text-sm">Directory structure created</span>
                                </div>
                            </div>

                            <!-- Asset Configuration -->
                            <div class="border-l-4 border-purple-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Asset Configuration
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <div class="text-sm">
                                        <div class="mb-2">For production, you can:</div>
                                        <ul class="list-disc list-inside space-y-1">
                                            <li>Use CDN: <code>'asset_url' => 'https://cdn.example.com'</code></li>
                                            <li>Custom manifest: <code>'manifest_path' => 'path/to/manifest.json'</code></li>
                                            <li>Custom app URL: <code>'app_url' => 'https://yourapp.com'</code></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="flex items-center text-blue-600 dark:text-blue-400">
                                    <i data-lucide="info" class="w-5 h-5 mr-2"></i>
                                    <span class="text-sm">Optional for development</span>
                                </div>
                            </div>
                        </div>

                        <!-- Configuration Tips -->
                        <div class="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div class="flex items-start">
                                <i data-lucide="lightbulb" class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-0.5"></i>
                                <div>
                                    <h4 class="font-medium text-blue-800 dark:text-blue-200">Configuration Tips</h4>
                                    <ul class="text-blue-700 dark:text-blue-300 text-sm mt-2 space-y-1">
                                        <li>• Keep default settings for development</li>
                                        <li>• Use CDN for production performance</li>
                                        <li>• Customize middleware if needed</li>
                                        <li>• Set app_url for subdirectory deployments</li>
                                    </ul>
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