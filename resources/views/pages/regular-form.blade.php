@extends('../layout/' . $layout)

@section('subhead')
    <title>Regular Form - Midone - Tailwind HTML Admin Template</title>
@endsection

@section('subcontent')
    <div class="intro-y flex items-center mt-8">
        <h2 class="text-lg font-medium mr-auto">Regular Form</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
        <div class="intro-y col-span-12 lg:col-span-6">
            <!-- BEGIN: Input -->
            <div class="intro-y box">
                <div
                    class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">Input</h2>
                    <div class="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                        <label class="form-check-label ml-0" for="show-example-1">Show example code</label>
                        <input id="show-example-1" data-target="#input" class="show-code form-check-input mr-0 ml-3"
                            type="checkbox">
                    </div>
                </div>
                <div id="input" class="p-5">
                    <div class="preview">
                        <x-form.input id="input-1" label="Input Text" placeholder="Input text" />

                        <x-form.input id="input-2" label="Rounded" placeholder="Rounded" :rounded="true" />

                        <x-form.input id="input-3" label="With Help" placeholder="With help"
                            help="This is helper text." />

                        <x-form.input id="input-4" label="Password" type="password" placeholder="Enter password" />

                        <x-form.input id="input-5" label="Disabled" placeholder="Can't type here" :disabled="true" />

                    </div>
                    <div class="source-code hidden">
                        <button data-target="#copy-input" class="copy-code btn py-1 px-2 btn-outline-secondary">
                            <i data-lucide="file" class="w-4 h-4 mr-2"></i> Copy example code
                        </button>
                        <div class="overflow-y-auto mt-3 rounded-md">
                            <pre id="copy-input" class="source-preview">
                                <code class="html"> 
                                    <x-form.input id='input-1' label='Input Text' placeholder='Input text' />
                                    
                                    <x-form.input id='input-2' label='Rounded' placeholder='Rounded' :rounded='true' />
                                    
                                    <x-form.input id='input-3' label='With Help' placeholder='With help' help='Lorem Ipsum is simply dummy text of the printing and typesetting industry.' />
                                    
                                    <x-form.input id='input-4' label='Password' type='password' placeholder='Password' />
                                    
                                    <x-form.input id='input-5' label='Disabled' placeholder='Disabled' :disabled='true' />
                                </code>
                            </pre>
                        </div>
                    </div>

                </div>
            </div>
            <!-- END: Input -->
            <!-- BEGIN: Input Sizing -->
            <div class="intro-y box mt-5">
                <div
                    class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">Input Sizing</h2>
                    <div class="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                        <label class="form-check-label ml-0" for="show-example-2">Show example code</label>
                        <input id="show-example-2" data-target="#input-sizing" class="show-code form-check-input mr-0 ml-3"
                            type="checkbox">
                    </div>
                </div>
                <div id="input-sizing" class="p-5">
                    <div class="preview">
                        <x-form.input-sizing placeholder=".form-control-lg" size="lg" />

                        <x-form.input-sizing placeholder="Default input" class="mt-2" />

                        <x-form.input-sizing placeholder=".form-control-sm" size="sm" class="mt-2" />

                    </div>
                    <div class="source-code hidden">
                        <button data-target="#copy-input-sizing" class="copy-code btn py-1 px-2 btn-outline-secondary">
                            <i data-lucide="file" class="w-4 h-4 mr-2"></i> Copy example code
                        </button>
                        <div class="overflow-y-auto mt-3 rounded-md">
                            <pre id="copy-input-sizing" class="source-preview">
                                <code class="html">
                                    <x-form.input-sizing placeholder=".form-control-lg" size="lg" />

                                    <x-form.input-sizing placeholder="Default input" class="mt-2" />

                                    <x-form.input-sizing placeholder=".form-control-sm" size="sm" class="mt-2" />
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END: Input Sizing -->
            <!-- BEGIN: Input Groups -->
            <div class="intro-y box mt-5">
                <div
                    class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">Input Groups</h2>
                    <div class="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                        <label class="form-check-label ml-0" for="show-example-3">Show example code</label>
                        <input id="show-example-3" data-target="#input-groups"
                            class="show-code form-check-input mr-0 ml-3" type="checkbox">
                    </div>
                </div>
                <div id="input-groups" class="p-5">
                    <div class="preview">
                        <x-form.input-group id="input-group-email" placeholder="Email" prepend="@" class="mt-0" />

                        <x-form.input-group id="input-group-price" placeholder="Price" append=".00" class="mt-2" />

                        <x-form.input-group placeholder="Amount (to the nearest dollar)" prepend="@" append=".00"
                            class="mt-2" />
                    </div>
                    <div class="source-code hidden">
                        <button data-target="#copy-input-groups" class="copy-code btn py-1 px-2 btn-outline-secondary">
                            <i data-lucide="file" class="w-4 h-4 mr-2"></i> Copy example code
                        </button>
                        <div class="overflow-y-auto mt-3 rounded-md">
                            <pre id="copy-input-groups" class="source-preview">
                                <code class="html">
                                    <x-form.input-group id="input-group-email" placeholder="Email" prepend="@" class="mt-0" />

                                    <x-form.input-group id="input-group-price" placeholder="Price" append=".00" class="mt-2" />

                                    <x-form.input-group placeholder="Amount (to the nearest dollar)" prepend="@" append=".00" class="mt-2" />
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END: Input Groups -->
            <!-- BEGIN: Input State -->
            <div class="intro-y box mt-5">
                <div
                    class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">Input State</h2>
                    <div class="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                        <label class="form-check-label ml-0" for="show-example-4">Show example code</label>
                        <input id="show-example-4" data-target="#input-state"
                            class="show-code form-check-input mr-0 ml-3" type="checkbox">
                    </div>
                </div>
                <div id="input-state" class="p-5">
                    <div class="preview">
                        <x-form.input-state id="input-state-1" label="Input Success" placeholder="Input text"
                            status="success" message="Strong password" :showBars="true" />

                        <x-form.input-state id="input-state-2" label="Input Warning" placeholder="Input text"
                            status="warning" message="Attempting to reconnect to server..." />

                        <x-form.input-state id="input-state-3" label="Input Error" placeholder="Input text" status="danger"
                            message="This field is required" />

                    </div>
                    <div class="source-code hidden">
                        <button data-target="#copy-input-state" class="copy-code btn py-1 px-2 btn-outline-secondary">
                            <i data-lucide="file" class="w-4 h-4 mr-2"></i> Copy example code
                        </button>
                        <div class="overflow-y-auto mt-3 rounded-md">
                            <pre id="copy-input-state" class="source-preview">
                                <code class="html">
                                    <x-form.input-state
                                        id="input-state-1"
                                        label="Input Success"
                                        placeholder="Input text"
                                        status="success"
                                        message="Strong password"
                                        :showBars="true"
                                    />

                                    <x-form.input-state
                                        id="input-state-2"
                                        label="Input Warning"
                                        placeholder="Input text"
                                        status="warning"
                                        message="Attempting to reconnect to server..."
                                    />

                                    <x-form.input-state
                                        id="input-state-3"
                                        label="Input Error"
                                        placeholder="Input text"
                                        status="danger"
                                        message="This field is required"
                                    />
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END: Input State -->
            <!-- BEGIN: Select Options -->
            <div class="intro-y box mt-5">
                <div
                    class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">Select Options</h2>
                    <div class="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                        <label class="form-check-label ml-0" for="show-example-5">Show example code</label>
                        <input id="show-example-5" data-target="#select-options"
                            class="show-code form-check-input mr-0 ml-3" type="checkbox">
                    </div>
                </div>
                <div id="select-options" class="p-5">
                    <div class="preview">
                        <div class="flex flex-col sm:flex-row items-center">
                            <x-form.select-size :options="['Chris Evans', 'Liam Neeson', 'Daniel Craig']" size="lg" class="sm:mt-2 sm:mr-2" />
                        
                            <x-form.select-size :options="['Chris Evans', 'Liam Neeson', 'Daniel Craig']" class="mt-2 sm:mr-2" />
                        
                            <x-form.select-size :options="['Chris Evans', 'Liam Neeson', 'Daniel Craig']" size="sm" class="mt-2" />
                        </div>
                        
                    </div>
                    <div class="source-code hidden">
                        <button data-target="#copy-select-options" class="copy-code btn py-1 px-2 btn-outline-secondary">
                            <i data-lucide="file" class="w-4 h-4 mr-2"></i> Copy example code
                        </button>
                        <div class="overflow-y-auto mt-3 rounded-md">
                            <pre id="copy-select-options" class="source-preview">
                                <code class="html">
                                    <div class="flex flex-col sm:flex-row items-center">
                                        <x-form.select-size :options="['Chris Evans', 'Liam Neeson', 'Daniel Craig']" size="lg" class="sm:mt-2 sm:mr-2" />
                                    
                                        <x-form.select-size :options="['Chris Evans', 'Liam Neeson', 'Daniel Craig']" class="mt-2 sm:mr-2" />
                                    
                                        <x-form.select-size :options="['Chris Evans', 'Liam Neeson', 'Daniel Craig']" size="sm" class="mt-2" />
                                    </div>
                                    
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END: Select Options -->
        </div>
        <div class="intro-y col-span-12 lg:col-span-6">
            <!-- BEGIN: Vertical Form -->
            <div class="intro-y box">
                <div
                    class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">Vertical Form</h2>
                    <div class="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                        <label class="form-check-label ml-0" for="show-example-6">Show example code</label>
                        <input id="show-example-6" data-target="#vertical-form"
                            class="show-code form-check-input mr-0 ml-3" type="checkbox">
                    </div>
                </div>
                <div id="vertical-form" class="p-5">
                    <div class="preview">
                        <x-auth.login-form-vertical
                            action="{{ route('login.check') }}"
                            method="POST"
                            :show-remember="true"
                            button-text="Sign In"
                        >
                            <div class="mt-3 text-right">
                                <a href="{{ route('login.index') }}" class="text-sm text-primary">Forgot password?</a>
                            </div>
                        </x-auth.login-form-vertical>

                    </div>
                    <div class="source-code hidden">
                        <button data-target="#copy-vertical-form" class="copy-code btn py-1 px-2 btn-outline-secondary">
                            <i data-lucide="file" class="w-4 h-4 mr-2"></i> Copy example code
                        </button>
                        <div class="overflow-y-auto mt-3 rounded-md">
                            <pre id="copy-vertical-form" class="source-preview">
                                <code class="html">
                                    <x-auth.login-form-vertical
                                        action="{{ route('login.check') }}"
                                        method="POST"
                                        :show-remember="true"
                                        button-text="Sign In"
                                    >
                                        <div class="mt-3 text-right">
                                            <a href="{{ route('login.index') }}" class="text-sm text-primary">Forgot password?</a>
                                        </div>
                                    </x-auth.login-form-vertical>

                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END: Vertical Form -->
            <!-- BEGIN: Horizontal Form -->
            <div class="intro-y box mt-5">
                <div
                    class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">Horizontal Form</h2>
                    <div class="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                        <label class="form-check-label ml-0" for="show-example-7">Show example code</label>
                        <input id="show-example-7" data-target="#horizontal-form"
                            class="show-code form-check-input mr-0 ml-3" type="checkbox">
                    </div>
                </div>
                <div id="horizontal-form" class="p-5">
                    <div class="preview">
                        <x-auth.login-form-horizontal
                            action="{{ route('login.check') }}"
                            method="POST"
                            :show-remember="true"
                            button-text="Sign In"
                        >
                            <div class="mt-3 text-right">
                                <a href="{{ route('login.index') }}" class="text-sm text-primary">Forgot password?</a>
                            </div>
                        </x-auth.login-form-horizontal>
                        
                    </div>
                    <div class="source-code hidden">
                        <button data-target="#copy-horizontal-form" class="copy-code btn py-1 px-2 btn-outline-secondary">
                            <i data-lucide="file" class="w-4 h-4 mr-2"></i> Copy example code
                        </button>
                        <div class="overflow-y-auto mt-3 rounded-md">
                            <pre id="copy-horizontal-form" class="source-preview">
                                <code class="html">
                                    <x-auth.login-form-horizontal
                                        action="{{ route('login.check') }}"
                                        method="POST"
                                        :show-remember="true"
                                        button-text="Sign In"
                                    >
                                        <div class="mt-3 text-right">
                                            <a href="{{ route('login.index') }}" class="text-sm text-primary">Forgot password?</a>
                                        </div>
                                    </x-auth.login-form-horizontal>
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END: Horizontal Form -->
            <!-- BEGIN: Inline Form -->
            <div class="intro-y box mt-5">
                <div
                    class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">Inline Form</h2>
                    <div class="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                        <label class="form-check-label ml-0" for="show-example-8">Show example code</label>
                        <input id="show-example-8" data-target="#inline-form"
                            class="show-code form-check-input mr-0 ml-3" type="checkbox">
                    </div>
                </div>
                <div id="inline-form" class="p-5">
                    <div class="preview">
                        <div class="grid grid-cols-12 gap-2">
                            <input type="text" class="form-control col-span-4" placeholder="Input inline 1"
                                aria-label="default input inline 1">
                            <input type="text" class="form-control col-span-4" placeholder="Input inline 2"
                                aria-label="default input inline 2">
                            <input type="text" class="form-control col-span-4" placeholder="Input inline 3"
                                aria-label="default input inline 3">
                        </div>
                    </div>
                    <div class="source-code hidden">
                        <button data-target="#copy-inline-form" class="copy-code btn py-1 px-2 btn-outline-secondary">
                            <i data-lucide="file" class="w-4 h-4 mr-2"></i> Copy example code
                        </button>
                        <div class="overflow-y-auto mt-3 rounded-md">
                            <pre id="copy-inline-form" class="source-preview">
                                <code class="html">
                                    {{ str_replace(
                                        '>',
                                        'HTMLCloseTag',
                                        str_replace(
                                            '<',
                                            'HTMLOpenTag',
                                            '
                                                                                                                                                                                                                            <div class="grid grid-cols-12 gap-2">
                                                                                                                                                                                                                                <input type="text" class="form-control col-span-4" placeholder="Input inline 1" aria-label="default input inline 1">
                                                                                                                                                                                                                                <input type="text" class="form-control col-span-4" placeholder="Input inline 2" aria-label="default input inline 2">
                                                                                                                                                                                                                                <input type="text" class="form-control col-span-4" placeholder="Input inline 3" aria-label="default input inline 3">
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                        ',
                                        ),
                                    ) }}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END: Inline Form -->
            <!-- BEGIN: Checkbox & Switch -->
            <div class="intro-y box mt-5">
                <div
                    class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">Checkbox & Switch</h2>
                    <div class="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                        <label class="form-check-label ml-0" for="show-example-9">Show example code</label>
                        <input id="show-example-9" data-target="#checkbox-switch"
                            class="show-code form-check-input mr-0 ml-3" type="checkbox">
                    </div>
                </div>
                <div id="checkbox-switch" class="p-5">
                    <div class="preview">
                        <div>
                            <label>Vertical Checkbox</label>
                            <div class="form-check mt-2">
                                <input id="checkbox-switch-1" class="form-check-input" type="checkbox" value="">
                                <label class="form-check-label" for="checkbox-switch-1">Chris Evans</label>
                            </div>
                            <div class="form-check mt-2">
                                <input id="checkbox-switch-2" class="form-check-input" type="checkbox" value="">
                                <label class="form-check-label" for="checkbox-switch-2">Liam Neeson</label>
                            </div>
                            <div class="form-check mt-2">
                                <input id="checkbox-switch-3" class="form-check-input" type="checkbox" value="">
                                <label class="form-check-label" for="checkbox-switch-3">Daniel Craig</label>
                            </div>
                        </div>
                        <div class="mt-3">
                            <label>Horizontal Checkbox</label>
                            <div class="flex flex-col sm:flex-row mt-2">
                                <div class="form-check mr-2">
                                    <input id="checkbox-switch-4" class="form-check-input" type="checkbox"
                                        value="">
                                    <label class="form-check-label" for="checkbox-switch-4">Chris Evans</label>
                                </div>
                                <div class="form-check mr-2 mt-2 sm:mt-0">
                                    <input id="checkbox-switch-5" class="form-check-input" type="checkbox"
                                        value="">
                                    <label class="form-check-label" for="checkbox-switch-5">Liam Neeson</label>
                                </div>
                                <div class="form-check mr-2 mt-2 sm:mt-0">
                                    <input id="checkbox-switch-6" class="form-check-input" type="checkbox"
                                        value="">
                                    <label class="form-check-label" for="checkbox-switch-6">Daniel Craig</label>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3">
                            <label>Switch</label>
                            <div class="mt-2">
                                <div class="form-check form-switch">
                                    <input id="checkbox-switch-7" class="form-check-input" type="checkbox">
                                    <label class="form-check-label" for="checkbox-switch-7">Default switch checkbox
                                        input</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="source-code hidden">
                        <button data-target="#copy-checkbox-switch" class="copy-code btn py-1 px-2 btn-outline-secondary">
                            <i data-lucide="file" class="w-4 h-4 mr-2"></i> Copy example code
                        </button>
                        <div class="overflow-y-auto mt-3 rounded-md">
                            <pre id="copy-checkbox-switch" class="source-preview">
                                <code class="html">
                                    {{ str_replace(
                                        '>',
                                        'HTMLCloseTag',
                                        str_replace(
                                            '<',
                                            'HTMLOpenTag',
                                            '
                                                                                                                                                                                                                            <div>
                                                                                                                                                                                                                                <label>Vertical Checkbox</label>
                                                                                                                                                                                                                                <div class="form-check mt-2">
                                                                                                                                                                                                                                    <input id="checkbox-switch-1" class="form-check-input" type="checkbox" value="">
                                                                                                                                                                                                                                    <label class="form-check-label" for="checkbox-switch-1">Chris Evans</label>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                <div class="form-check mt-2">
                                                                                                                                                                                                                                    <input id="checkbox-switch-2" class="form-check-input" type="checkbox" value="">
                                                                                                                                                                                                                                    <label class="form-check-label" for="checkbox-switch-2">Liam Neeson</label>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                <div class="form-check mt-2">
                                                                                                                                                                                                                                    <input id="checkbox-switch-3" class="form-check-input" type="checkbox" value="">
                                                                                                                                                                                                                                    <label class="form-check-label" for="checkbox-switch-3">Daniel Craig</label>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                            <div class="mt-3">
                                                                                                                                                                                                                                <label>Horizontal Checkbox</label>
                                                                                                                                                                                                                                <div class="flex flex-col sm:flex-row mt-2">
                                                                                                                                                                                                                                    <div class="form-check mr-2">
                                                                                                                                                                                                                                        <input id="checkbox-switch-4" class="form-check-input" type="checkbox" value="">
                                                                                                                                                                                                                                        <label class="form-check-label" for="checkbox-switch-4">Chris Evans</label>
                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                    <div class="form-check mr-2 mt-2 sm:mt-0">
                                                                                                                                                                                                                                        <input id="checkbox-switch-5" class="form-check-input" type="checkbox" value="">
                                                                                                                                                                                                                                        <label class="form-check-label" for="checkbox-switch-5">Liam Neeson</label>
                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                    <div class="form-check mr-2 mt-2 sm:mt-0">
                                                                                                                                                                                                                                        <input id="checkbox-switch-6" class="form-check-input" type="checkbox" value="">
                                                                                                                                                                                                                                        <label class="form-check-label" for="checkbox-switch-6">Daniel Craig</label>
                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                            <div class="mt-3">
                                                                                                                                                                                                                                <label>Switch</label>
                                                                                                                                                                                                                                <div class="mt-2">
                                                                                                                                                                                                                                    <div class="form-check form-switch">
                                                                                                                                                                                                                                        <input id="checkbox-switch-7" class="form-check-input" type="checkbox">
                                                                                                                                                                                                                                        <label class="form-check-label" for="checkbox-switch-7">Default switch checkbox input</label>
                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                        ',
                                        ),
                                    ) }}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END: Checkbox & Switch -->
            <!-- BEGIN: Radio Button -->
            <div class="intro-y box mt-5">
                <div
                    class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">Radio</h2>
                    <div class="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                        <label class="form-check-label ml-0" for="show-example-10">Show example code</label>
                        <input id="show-example-10" data-target="#radio" class="show-code form-check-input mr-0 ml-3"
                            type="checkbox">
                    </div>
                </div>
                <div id="radio" class="p-5">
                    <div class="preview">
                        <div>
                            <label>Vertical Radio Button</label>
                            <div class="form-check mt-2">
                                <input id="radio-switch-1" class="form-check-input" type="radio"
                                    name="vertical_radio_button" value="vertical-radio-chris-evans">
                                <label class="form-check-label" for="radio-switch-1">Chris Evans</label>
                            </div>
                            <div class="form-check mt-2">
                                <input id="radio-switch-2" class="form-check-input" type="radio"
                                    name="vertical_radio_button" value="vertical-radio-liam-neeson">
                                <label class="form-check-label" for="radio-switch-2">Liam Neeson</label>
                            </div>
                            <div class="form-check mt-2">
                                <input id="radio-switch-3" class="form-check-input" type="radio"
                                    name="vertical_radio_button" value="vertical-radio-daniel-craig">
                                <label class="form-check-label" for="radio-switch-3">Daniel Craig</label>
                            </div>
                        </div>
                        <div class="mt-3">
                            <label>Horizontal Radio Button</label>
                            <div class="flex flex-col sm:flex-row mt-2">
                                <div class="form-check mr-2">
                                    <input id="radio-switch-4" class="form-check-input" type="radio"
                                        name="horizontal_radio_button" value="horizontal-radio-chris-evans">
                                    <label class="form-check-label" for="radio-switch-4">Chris Evans</label>
                                </div>
                                <div class="form-check mr-2 mt-2 sm:mt-0">
                                    <input id="radio-switch-5" class="form-check-input" type="radio"
                                        name="horizontal_radio_button" value="horizontal-radio-liam-neeson">
                                    <label class="form-check-label" for="radio-switch-5">Liam Neeson</label>
                                </div>
                                <div class="form-check mr-2 mt-2 sm:mt-0">
                                    <input id="radio-switch-6" class="form-check-input" type="radio"
                                        name="horizontal_radio_button" value="horizontal-radio-daniel-craig">
                                    <label class="form-check-label" for="radio-switch-6">Daniel Craig</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="source-code hidden">
                        <button data-target="#copy-radio" class="copy-code btn py-1 px-2 btn-outline-secondary">
                            <i data-lucide="file" class="w-4 h-4 mr-2"></i> Copy example code
                        </button>
                        <div class="overflow-y-auto mt-3 rounded-md">
                            <pre id="copy-radio" class="source-preview">
                                <code class="html">
                                    {{ str_replace(
                                        '>',
                                        'HTMLCloseTag',
                                        str_replace(
                                            '<',
                                            'HTMLOpenTag',
                                            '
                                                                                                                                                                                                                            <div>
                                                                                                                                                                                                                                <label>Vertical Radio Button</label>
                                                                                                                                                                                                                                <div class="form-check mt-2">
                                                                                                                                                                                                                                    <input id="radio-switch-1" class="form-check-input" type="radio" name="vertical_radio_button" value="vertical-radio-chris-evans">
                                                                                                                                                                                                                                    <label class="form-check-label" for="radio-switch-1">Chris Evans</label>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                <div class="form-check mt-2">
                                                                                                                                                                                                                                    <input id="radio-switch-2" class="form-check-input" type="radio" name="vertical_radio_button" value="vertical-radio-liam-neeson">
                                                                                                                                                                                                                                    <label class="form-check-label" for="radio-switch-2">Liam Neeson</label>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                <div class="form-check mt-2">
                                                                                                                                                                                                                                    <input id="radio-switch-3" class="form-check-input" type="radio" name="vertical_radio_button" value="vertical-radio-daniel-craig">
                                                                                                                                                                                                                                    <label class="form-check-label" for="radio-switch-3">Daniel Craig</label>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                            <div class="mt-3">
                                                                                                                                                                                                                                <label>Horizontal Radio Button</label>
                                                                                                                                                                                                                                <div class="flex flex-col sm:flex-row mt-2">
                                                                                                                                                                                                                                    <div class="form-check mr-2">
                                                                                                                                                                                                                                        <input id="radio-switch-4" class="form-check-input" type="radio" name="horizontal_radio_button" value="horizontal-radio-chris-evans">
                                                                                                                                                                                                                                        <label class="form-check-label" for="radio-switch-4">Chris Evans</label>
                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                    <div class="form-check mr-2 mt-2 sm:mt-0">
                                                                                                                                                                                                                                        <input id="radio-switch-5" class="form-check-input" type="radio" name="horizontal_radio_button" value="horizontal-radio-liam-neeson">
                                                                                                                                                                                                                                        <label class="form-check-label" for="radio-switch-5">Liam Neeson</label>
                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                    <div class="form-check mr-2 mt-2 sm:mt-0">
                                                                                                                                                                                                                                        <input id="radio-switch-6" class="form-check-input" type="radio" name="horizontal_radio_button" value="horizontal-radio-daniel-craig">
                                                                                                                                                                                                                                        <label class="form-check-label" for="radio-switch-6">Daniel Craig</label>
                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                        ',
                                        ),
                                    ) }}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END: Radio Button -->
        </div>
    </div>
@endsection
