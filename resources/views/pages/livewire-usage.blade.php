@extends('../layout/side-menu')

@section('subhead')
    <title>Livewire Usage Examples - Icewall</title>
@endsection

@section('subcontent')
<div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
        <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">
                Livewire Usage Examples
            </h2>
        </div>
        <div class="grid grid-cols-12 gap-6 mt-5">
            <div class="col-span-12">
                <div class="intro-y box">
                    <div class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 class="font-medium text-base mr-auto">
                            Common Usage Patterns
                        </h2>
                    </div>
                    <div class="p-5">
                        <div class="space-y-6">
                            <!-- Forms -->
                            <div class="border-l-4 border-orange-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Form Handling
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <div class="text-sm">
                                        <div class="mb-2">Component Class:</div>
                                        <pre class="bg-slate-100 dark:bg-darkmode-300 p-3 rounded text-xs overflow-x-auto">
class ContactForm extends Component
{
    public $name = '';
    public $email = '';
    public $message = '';

    public function submit()
    {
        $this->validate([
            'name' => 'required|min:3',
            'email' => 'required|email',
            'message' => 'required|min:10'
        ]);

        // Process form data
        Contact::create([
            'name' => $this->name,
            'email' => $this->email,
            'message' => $this->message
        ]);

        $this->reset();
        session()->flash('message', 'Contact submitted!');
    }
}</pre>
                                        <div class="mt-2">View:</div>
                                        <pre class="bg-slate-100 dark:bg-darkmode-300 p-3 rounded text-xs overflow-x-auto">
&lt;form wire:submit.prevent="submit"&gt;
    &lt;input wire:model="name" type="text" placeholder="Name"&gt;
    &lt;input wire:model="email" type="email" placeholder="Email"&gt;
    &lt;textarea wire:model="message" placeholder="Message"&gt;&lt;/textarea&gt;
    &lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;</pre>
                                    </div>
                                </div>
                            </div>

                            <!-- Real-time Search -->
                            <div class="border-l-4 border-orange-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Real-time Search
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <div class="text-sm">
                                        <div class="mb-2">Component Class:</div>
                                        <pre class="bg-slate-100 dark:bg-darkmode-300 p-3 rounded text-xs overflow-x-auto">
class UserSearch extends Component
{
    public $search = '';
    public $users = [];

    public function updatedSearch()
    {
        $this->users = User::where('name', 'like', '%' . $this->search . '%')
            ->orWhere('email', 'like', '%' . $this->search . '%')
            ->limit(10)
            ->get();
    }
}</pre>
                                        <div class="mt-2">View:</div>
                                        <pre class="bg-slate-100 dark:bg-darkmode-300 p-3 rounded text-xs overflow-x-auto">
&lt;input wire:model.debounce.300ms="search" type="text" placeholder="Search users..."&gt;

&lt;div&gt;
    @foreach($users as $user)
        &lt;div&gt;{{ $user->name }} - {{ $user->email }}&lt;/div&gt;
    @endforeach
&lt;/div&gt;</pre>
                                    </div>
                                </div>
                            </div>

                            <!-- Polling -->
                            <div class="border-l-4 border-orange-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Auto-refresh Data
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <div class="text-sm">
                                        <div class="mb-2">Component Class:</div>
                                        <pre class="bg-slate-100 dark:bg-darkmode-300 p-3 rounded text-xs overflow-x-auto">
class LiveStats extends Component
{
    public $stats = [];

    public function mount()
    {
        $this->loadStats();
    }

    public function loadStats()
    {
        $this->stats = [
            'users' => User::count(),
            'orders' => Order::count(),
            'revenue' => Order::sum('total')
        ];
    }
}</pre>
                                        <div class="mt-2">View:</div>
                                        <pre class="bg-slate-100 dark:bg-darkmode-300 p-3 rounded text-xs overflow-x-auto">
&lt;div wire:poll.30s&gt;
    &lt;div&gt;Users: {{ $stats['users'] }}&lt;/div&gt;
    &lt;div&gt;Orders: {{ $stats['orders'] }}&lt;/div&gt;
    &lt;div&gt;Revenue: ${{ $stats['revenue'] }}&lt;/div&gt;
&lt;/div&gt;</pre>
                                    </div>
                                </div>
                            </div>

                            <!-- Loading States -->
                            <div class="border-l-4 border-orange-500 pl-4">
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Loading States
                                </h3>
                                <div class="bg-slate-50 dark:bg-darkmode-400/50 rounded-lg p-4 mb-3">
                                    <div class="text-sm">
                                        <div class="mb-2">View with loading states:</div>
                                        <pre class="bg-slate-100 dark:bg-darkmode-300 p-3 rounded text-xs overflow-x-auto">
&lt;button wire:click="save" wire:loading.attr="disabled"&gt;
    &lt;span wire:loading.remove&gt;Save&lt;/span&gt;
    &lt;span wire:loading&gt;Saving...&lt;/span&gt;
&lt;/button&gt;

&lt;div wire:loading wire:target="save"&gt;
    &lt;div class="spinner"&gt;Loading...&lt;/div&gt;
&lt;/div&gt;</pre>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Advanced Features -->
                        <div class="mt-8 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                            <div class="flex items-start">
                                <i data-lucide="zap" class="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3 mt-0.5"></i>
                                <div>
                                    <h4 class="font-medium text-purple-800 dark:text-purple-200">Advanced Features</h4>
                                    <ul class="text-purple-700 dark:text-purple-300 text-sm mt-2 space-y-1">
                                        <li>• <code>wire:model.debounce.300ms</code> - Debounced input</li>
                                        <li>• <code>wire:model.lazy</code> - Update on blur</li>
                                        <li>• <code>wire:click.prevent</code> - Prevent default</li>
                                        <li>• <code>wire:target="methodName"</code> - Target specific methods</li>
                                        <li>• <code>wire:loading.class="opacity-50"</code> - Add CSS classes</li>
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