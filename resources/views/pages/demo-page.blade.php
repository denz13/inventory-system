@extends('../layout/side-menu')

@section('subhead')
    <title>Demo Page - Icewall</title>
@endsection

@section('subcontent')
<div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
        <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">
                Demo Page
            </h2>
        </div>
        <div class="grid grid-cols-12 gap-6 mt-5">
            <div class="col-span-12">
                <div class="intro-y box">
                    <div class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 class="font-medium text-base mr-auto">
                            Interactive Demo
                        </h2>
                        <button class="btn btn-primary mt-3 sm:mt-0">Action Button</button>
                    </div>
                    <div class="p-5">
                        <div class="text-slate-600 dark:text-slate-500">
                            <p class="mb-6">
                                This demo page shows how you can create interactive pages with forms, buttons, and other UI components 
                                using the generic page handler system.
                            </p>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4">
                                    <h3 class="font-medium text-slate-800 dark:text-slate-200 mb-3">Form Example</h3>
                                    <form>
                                        <div class="mb-3">
                                            <label class="form-label">Name</label>
                                            <input type="text" class="form-control" placeholder="Enter your name">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Email</label>
                                            <input type="email" class="form-control" placeholder="Enter your email">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Message</label>
                                            <textarea class="form-control" rows="3" placeholder="Enter your message"></textarea>
                                        </div>
                                        <button type="submit" class="btn btn-primary">Submit</button>
                                    </form>
                                </div>
                                
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4">
                                    <h3 class="font-medium text-slate-800 dark:text-slate-200 mb-3">Quick Actions</h3>
                                    <div class="space-y-2">
                                        <button class="btn btn-secondary w-full">View Reports</button>
                                        <button class="btn btn-success w-full">Export Data</button>
                                        <button class="btn btn-warning w-full">Settings</button>
                                        <button class="btn btn-danger w-full">Delete</button>
                                    </div>
                                    
                                    <div class="mt-4">
                                        <h4 class="font-medium text-slate-700 dark:text-slate-300 mb-2">Progress</h4>
                                        <div class="w-full bg-slate-200 dark:bg-darkmode-400 rounded-full h-2">
                                            <div class="bg-primary h-2 rounded-full" style="width: 65%"></div>
                                        </div>
                                        <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">65% Complete</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                                <h3 class="font-medium text-blue-800 dark:text-blue-200 mb-2">Success Message</h3>
                                <p class="text-blue-700 dark:text-blue-300">
                                    ✅ This demo page was successfully created using the generic page handler! 
                                    You can now create any type of page with full functionality.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection 