@extends('../layout/side-menu')

@section('subhead')
    <title>Sample Page - Icewall</title>
@endsection

@section('subcontent')
<div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
        <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">
                Sample Page
            </h2>
        </div>
        <div class="grid grid-cols-12 gap-6 mt-5">
            <div class="col-span-12">
                <div class="intro-y box">
                    <div class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 class="font-medium text-base mr-auto">
                            Welcome to Sample Page
                        </h2>
                    </div>
                    <div class="p-5">
                        <div class="text-slate-600 dark:text-slate-500">
                            <p class="mb-4">
                                This is a sample page created using the generic page handler. 
                                You can create any page by simply adding a view file in the 
                                <code class="bg-slate-100 dark:bg-darkmode-100 px-2 py-1 rounded">resources/views/pages/</code> 
                                directory and adding a menu item that uses the <code class="bg-slate-100 dark:bg-darkmode-100 px-2 py-1 rounded">page.show</code> route.
                            </p>
                            
                            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                                <h3 class="font-medium text-blue-800 dark:text-blue-200 mb-2">How it works:</h3>
                                <ul class="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1">
                                    <li>Create a view file (e.g., <code>sample-page.blade.php</code>)</li>
                                    <li>Add a menu item using the <code>page.show</code> route</li>
                                    <li>Pass the page name as a parameter</li>
                                    <li>The system automatically finds and renders the view</li>
                                </ul>
                            </div>

                            <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                <h3 class="font-medium text-green-800 dark:text-green-200 mb-2">Benefits:</h3>
                                <ul class="list-disc list-inside text-green-700 dark:text-green-300 space-y-1">
                                    <li>No need to create individual controller methods</li>
                                    <li>No need to add specific routes</li>
                                    <li>Easy to add new pages dynamically</li>
                                    <li>Consistent layout and styling</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection 