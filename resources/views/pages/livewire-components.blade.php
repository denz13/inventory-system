@extends('../layout/side-menu')

@section('subhead')
    <title>Creating Livewire Components - Icewall</title>
@endsection

@section('subcontent')
<div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
        <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">
                Creating Livewire Components
            </h2>
        </div>
        <div class="grid grid-cols-12 gap-6 mt-5">
            <div class="col-span-12">
                <div class="intro-y box">
                    <div class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 class="font-medium text-base mr-auto">
                            Component Development Guide
                        </h2>
                    </div>
                    <div class="p-5">
                        <div class="space-y-6">
                            <!-- Creating Components -->
                            <div class="border-l-4 border-green-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Creating a New Component
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <code class="text-sm">php artisan make:livewire ComponentName</code>
                                </div>
                                <div class="text-sm text-slate-600 dark:text-slate-400">
                                    This creates two files:
                                    <ul class="list-disc list-inside mt-2 space-y-1">
                                        <li><code>app/Http/Livewire/ComponentName.php</code> - Component class</li>
                                        <li><code>resources/views/livewire/component-name.blade.php</code> - Component view</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Component Class Structure -->
                            <div class="border-l-4 border-green-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Component Class Structure
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <div class="text-sm">
                                        <div class="mb-2">File: <code>app/Http/Livewire/Counter.php</code></div>
                                        <pre class="bg-slate-100 dark:bg-darkmode-300 p-3 rounded text-xs overflow-x-auto">
<?php

namespace App\Http\Livewire;

use Livewire\Component;

class Counter extends Component
{
    public $count = 0;  // Public properties are reactive

    public function increment()
    {
        $this->count++;
    }

    public function decrement()
    {
        $this->count--;
    }

    public function render()
    {
        return view('livewire.counter');
    }
}</pre>
                                    </div>
                                </div>
                            </div>

                            <!-- Component View Structure -->
                            <div class="border-l-4 border-green-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Component View Structure
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <div class="text-sm">
                                        <div class="mb-2">File: <code>resources/views/livewire/counter.blade.php</code></div>
                                        <pre class="bg-slate-100 dark:bg-darkmode-300 p-3 rounded text-xs overflow-x-auto">
&lt;div&gt;
    &lt;h3&gt;Count: {{ $count }}&lt;/h3&gt;
    
    &lt;button wire:click="increment"&gt;+&lt;/button&gt;
    &lt;button wire:click="decrement"&gt;-&lt;/button&gt;
&lt;/div&gt;</pre>
                                    </div>
                                </div>
                            </div>

                            <!-- Using Components -->
                            <div class="border-l-4 border-green-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Using Components in Views
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <div class="text-sm">
                                        <div class="mb-2">In any Blade view:</div>
                                        <pre class="bg-slate-100 dark:bg-darkmode-300 p-3 rounded text-xs overflow-x-auto">
@livewire('counter')

// Or with parameters
@livewire('counter', ['initial' => 10])</pre>
                                    </div>
                                </div>
                            </div>

                            <!-- Livewire Directives -->
                            <div class="border-l-4 border-green-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Common Livewire Directives
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <div class="text-sm space-y-2">
                                        <div><code>wire:click="methodName"</code> - Call methods on click</div>
                                        <div><code>wire:model="property"</code> - Two-way data binding</div>
                                        <div><code>wire:submit.prevent="methodName"</code> - Form submission</div>
                                        <div><code>wire:poll.10s</code> - Auto-refresh every 10 seconds</div>
                                        <div><code>wire:loading</code> - Show during loading</div>
                                        <div><code>wire:target="methodName"</code> - Target specific methods</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Best Practices -->
                        <div class="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div class="flex items-start">
                                <i data-lucide="star" class="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5"></i>
                                <div>
                                    <h4 class="font-medium text-yellow-800 dark:text-yellow-200">Best Practices</h4>
                                    <ul class="text-yellow-700 dark:text-yellow-300 text-sm mt-2 space-y-1">
                                        <li>• Keep components focused and single-purpose</li>
                                        <li>• Use public properties for reactive data</li>
                                        <li>• Use wire:model for form inputs</li>
                                        <li>• Handle loading states with wire:loading</li>
                                        <li>• Use wire:poll sparingly for real-time updates</li>
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