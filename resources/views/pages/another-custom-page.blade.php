@extends('../layout/side-menu')

@section('subhead')
    <title>Another Custom Page - Icewall</title>
@endsection

@section('subcontent')
<div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
        <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">
                Another Custom Page
            </h2>
        </div>
        <div class="grid grid-cols-12 gap-6 mt-5">
            <div class="col-span-12 lg:col-span-6">
                <div class="intro-y box">
                    <div class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 class="font-medium text-base mr-auto">
                            Custom Content Section
                        </h2>
                    </div>
                    <div class="p-5">
                        <div class="text-slate-600 dark:text-slate-500">
                            <p class="mb-4">
                                This is another example of a custom page created using the generic page handler. 
                                You can create as many pages as you need without writing additional controller code.
                            </p>
                            
                            <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <h3 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Features:</h3>
                                <ul class="list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-1">
                                    <li>Fully responsive design</li>
                                    <li>Dark mode support</li>
                                    <li>Consistent styling with the theme</li>
                                    <li>Easy to customize and extend</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-span-12 lg:col-span-6">
                <div class="intro-y box">
                    <div class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 class="font-medium text-base mr-auto">
                            Statistics
                        </h2>
                    </div>
                    <div class="p-5">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">150</div>
                                <div class="text-sm text-slate-500 dark:text-slate-400">Total Pages</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-green-600 dark:text-green-400">24</div>
                                <div class="text-sm text-slate-500 dark:text-slate-400">Active Users</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">89%</div>
                                <div class="text-sm text-slate-500 dark:text-slate-400">Uptime</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">12</div>
                                <div class="text-sm text-slate-500 dark:text-slate-400">New Features</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection 