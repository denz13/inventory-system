<div>
    <div class="intro-y flex items-center mt-8">
        <h2 class="text-lg font-medium mr-auto">Alpine.js Components Demo</h2>
    </div>
    
    <div class="grid grid-cols-12 gap-6 mt-5">
        <div class="intro-y col-span-12">
            <div class="intro-y box">
                <div class="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60">
                    <h2 class="font-medium text-base mr-auto">Interactive Alpine.js Components</h2>
                    <div class="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                        <label class="form-check-label ml-0" for="show-example-code">Show example code</label>
                        <input id="show-example-code" data-target="#alpine-demo" class="show-code form-check-input mr-0 ml-3" type="checkbox">
                    </div>
                </div>
                <div class="p-5" id="alpine-demo">
                    <div class="preview">
                        
                        <!-- Data Table Component Demo -->
                        <div class="mb-8">
                            <h3 class="text-lg font-medium mb-4">📊 Data Table Component</h3>
                            @php
                                $users = [
                                    ['id' => 1, 'name' => 'John Doe', 'email' => 'john@example.com', 'role' => 'Admin', 'status' => 'Active'],
                                    ['id' => 2, 'name' => 'Jane Smith', 'email' => 'jane@example.com', 'role' => 'User', 'status' => 'Active'],
                                    ['id' => 3, 'name' => 'Bob Johnson', 'email' => 'bob@example.com', 'role' => 'User', 'status' => 'Inactive'],
                                    ['id' => 4, 'name' => 'Alice Brown', 'email' => 'alice@example.com', 'role' => 'Manager', 'status' => 'Active'],
                                    ['id' => 5, 'name' => 'Charlie Wilson', 'email' => 'charlie@example.com', 'role' => 'User', 'status' => 'Active'],
                                    ['id' => 6, 'name' => 'Emma Davis', 'email' => 'emma@example.com', 'role' => 'Admin', 'status' => 'Active'],
                                    ['id' => 7, 'name' => 'Tom Harris', 'email' => 'tom@example.com', 'role' => 'User', 'status' => 'Inactive'],
                                    ['id' => 8, 'name' => 'Sarah Miller', 'email' => 'sarah@example.com', 'role' => 'Manager', 'status' => 'Active'],
                                ];
                                $columns = ['name', 'email', 'role', 'status'];
                            @endphp
                            
                            <x-alpine-data-table 
                                :data="$users" 
                                :columns="$columns"
                                :per-page="3"
                                search-placeholder="Search users..."
                                empty-message="No users found matching your criteria."
                            />
                        </div>

                        <!-- Modal Component Demo -->
                        <div class="mb-8">
                            <h3 class="text-lg font-medium mb-4">🎭 Modal Component</h3>
                            
                            <div class="flex flex-wrap gap-2">
                                <x-alpine-modal title="Small Modal" size="sm">
                                    <x-slot name="trigger">
                                        <button class="btn btn-primary btn-sm">Small Modal</button>
                                    </x-slot>
                                    <p>This is a small modal with minimal content.</p>
                                </x-alpine-modal>

                                <x-alpine-modal title="Large Modal" size="lg">
                                    <x-slot name="trigger">
                                        <button class="btn btn-outline-primary btn-sm">Large Modal</button>
                                    </x-slot>
                                    <div class="space-y-4">
                                        <p>This is a large modal with more content and features.</p>
                                        <div class="bg-slate-100 dark:bg-neutral-800 p-4 rounded">
                                            <h4 class="font-medium mb-2">Modal Features:</h4>
                                            <ul class="text-sm space-y-1">
                                                <li>• Backdrop click to close</li>
                                                <li>• ESC key to close</li>
                                                <li>• Smooth transitions</li>
                                                <li>• Multiple sizes available</li>
                                                <li>• Customizable styling</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <x-slot name="footer">
                                        <button class="btn btn-outline-secondary" @click="$parent.open = false">Cancel</button>
                                        <button class="btn btn-primary">Save Changes</button>
                                    </x-slot>
                                </x-alpine-modal>

                                <x-alpine-modal title="Full Width Modal" size="full">
                                    <x-slot name="trigger">
                                        <button class="btn btn-outline-secondary btn-sm">Full Width</button>
                                    </x-slot>
                                    <div class="space-y-4">
                                        <p>This is a full-width modal that takes up most of the screen.</p>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div class="bg-slate-50 dark:bg-neutral-800 p-4 rounded">
                                                <h4 class="font-medium mb-2">Left Column</h4>
                                                <p class="text-sm">Perfect for forms or detailed content.</p>
                                            </div>
                                            <div class="bg-slate-50 dark:bg-neutral-800 p-4 rounded">
                                                <h4 class="font-medium mb-2">Right Column</h4>
                                                <p class="text-sm">Great for additional information or actions.</p>
                                            </div>
                                        </div>
                                    </div>
                                </x-alpine-modal>
                            </div>
                        </div>

                        <!-- Dropdown Component Demo -->
                        <div class="mb-8">
                            <h3 class="text-lg font-medium mb-4">📋 Dropdown Component</h3>
                            
                            <div class="flex flex-wrap gap-4">
                                <x-alpine-dropdown placement="bottom" align="left">
                                    <x-slot name="trigger">
                                        <button class="btn btn-outline-secondary">
                                            Actions <i data-lucide="chevron-down" class="w-4 h-4 ml-1"></i>
                                        </button>
                                    </x-slot>
                                    <div class="py-1">
                                        <a href="#" class="block px-4 py-2 text-sm text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800">
                                            <i data-lucide="edit" class="w-4 h-4 mr-2"></i> Edit
                                        </a>
                                        <a href="#" class="block px-4 py-2 text-sm text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800">
                                            <i data-lucide="copy" class="w-4 h-4 mr-2"></i> Copy
                                        </a>
                                        <a href="#" class="block px-4 py-2 text-sm text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800">
                                            <i data-lucide="download" class="w-4 h-4 mr-2"></i> Download
                                        </a>
                                        <div class="border-t border-slate-200 dark:border-neutral-700 my-1"></div>
                                        <a href="#" class="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-neutral-800">
                                            <i data-lucide="trash-2" class="w-4 h-4 mr-2"></i> Delete
                                        </a>
                                    </div>
                                </x-alpine-dropdown>

                                <x-alpine-dropdown placement="top" align="right">
                                    <x-slot name="trigger">
                                        <button class="btn btn-outline-primary">
                                            Top Right <i data-lucide="chevron-up" class="w-4 h-4 ml-1"></i>
                                        </button>
                                    </x-slot>
                                    <div class="py-1">
                                        <a href="#" class="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-neutral-800">Option 1</a>
                                        <a href="#" class="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-neutral-800">Option 2</a>
                                        <a href="#" class="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-neutral-800">Option 3</a>
                                    </div>
                                </x-alpine-dropdown>

                                <x-alpine-dropdown placement="right" align="left">
                                    <x-slot name="trigger">
                                        <button class="btn btn-outline-warning">
                                            Right Side <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>
                                        </button>
                                    </x-slot>
                                    <div class="py-1">
                                        <a href="#" class="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-neutral-800">Side Option 1</a>
                                        <a href="#" class="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-neutral-800">Side Option 2</a>
                                    </div>
                                </x-alpine-dropdown>
                            </div>
                        </div>

                        <!-- Tabs Component Demo -->
                        <div class="mb-8">
                            <h3 class="text-lg font-medium mb-4">📑 Tabs Component</h3>
                            
                            @php
                                $tabs = [
                                    [
                                        'title' => 'Overview',
                                        'content' => '<p>This is the overview tab content. You can put any HTML content here.</p><div class="mt-4 p-4 bg-slate-50 dark:bg-neutral-800 rounded"><strong>Features:</strong><ul class="mt-2 space-y-1"><li>• Responsive design</li><li>• Smooth transitions</li><li>• Customizable styling</li><li>• Dynamic content</li></ul></div>'
                                    ],
                                    [
                                        'title' => 'Settings',
                                        'content' => '<p>This is the settings tab content.</p><div class="mt-4 space-y-3"><div class="flex items-center justify-between"><span>Dark Mode</span><input type="checkbox" class="form-check-input"></div><div class="flex items-center justify-between"><span>Notifications</span><input type="checkbox" class="form-check-input"></div><div class="flex items-center justify-between"><span>Auto Save</span><input type="checkbox" class="form-check-input"></div><div class="flex items-center justify-between"><span>Two Factor Auth</span><input type="checkbox" class="form-check-input"></div></div>'
                                    ],
                                    [
                                        'title' => 'Analytics',
                                        'content' => '<p>This is the analytics tab content.</p><div class="mt-4 grid grid-cols-3 gap-4"><div class="text-center p-4 bg-slate-50 dark:bg-neutral-800 rounded"><div class="text-2xl font-bold text-primary">1,234</div><div class="text-sm text-slate-500">Total Users</div></div><div class="text-center p-4 bg-slate-50 dark:bg-neutral-800 rounded"><div class="text-2xl font-bold text-success">567</div><div class="text-sm text-slate-500">Active Users</div></div><div class="text-center p-4 bg-slate-50 dark:bg-neutral-800 rounded"><div class="text-2xl font-bold text-warning">89</div><div class="text-sm text-slate-500">New Users</div></div></div>'
                                    ],
                                    [
                                        'title' => 'Help',
                                        'content' => '<p>Need help? Here are some common questions and answers.</p><div class="mt-4 space-y-3"><div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded"><strong>Q: How do I change my password?</strong><p class="text-sm mt-1">Go to Settings > Security > Change Password</p></div><div class="p-3 bg-green-50 dark:bg-green-900/20 rounded"><strong>Q: How do I enable notifications?</strong><p class="text-sm mt-1">Go to Settings > Notifications and toggle the switch</p></div></div>'
                                    ]
                                ];
                            @endphp
                            
                            <x-alpine-tabs :tabs="$tabs" />
                        </div>

                        <!-- Accordion Component Demo -->
                        <div class="mb-8">
                            <h3 class="text-lg font-medium mb-4">📖 Accordion Component</h3>
                            
                            @php
                                $accordionItems = [
                                    [
                                        'title' => 'What is Alpine.js?',
                                        'content' => '<p>Alpine.js is a lightweight JavaScript framework that provides reactive and declarative behavior to your HTML. It\'s perfect for adding interactivity to your existing HTML without the complexity of larger frameworks.</p><div class="mt-3 p-3 bg-slate-50 dark:bg-neutral-800 rounded"><strong>Key Benefits:</strong><ul class="mt-2 space-y-1 text-sm"><li>• Lightweight (only ~15kb gzipped)</li><li>• No build step required</li><li>• Works with existing HTML</li><li>• Great with Livewire</li></ul></div>'
                                    ],
                                    [
                                        'title' => 'How does it work with Laravel?',
                                        'content' => '<p>Alpine.js works seamlessly with Laravel and Livewire. You can use Alpine.js for client-side interactions while Livewire handles server-side logic. This combination provides a powerful and flexible development experience.</p><div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded"><strong>Integration Benefits:</strong><ul class="mt-2 space-y-1 text-sm"><li>• Server-side rendering with Laravel</li><li>• Real-time updates with Livewire</li><li>• Client-side interactivity with Alpine.js</li><li>• Best of both worlds</li></ul></div>'
                                    ],
                                    [
                                        'title' => 'What are the benefits?',
                                        'content' => '<ul class="space-y-2"><li>• <strong>Lightweight:</strong> Only ~15kb gzipped</li><li>• <strong>No build step:</strong> Works directly in the browser</li><li>• <strong>Declarative:</strong> Write less JavaScript</li><li>• <strong>Reactive:</strong> Automatic DOM updates</li><li>• <strong>Accessible:</strong> Built with accessibility in mind</li><li>• <strong>Flexible:</strong> Works with any framework</li></ul>'
                                    ],
                                    [
                                        'title' => 'How to get started?',
                                        'content' => '<p>Getting started with Alpine.js is simple:</p><ol class="mt-2 space-y-2"><li>1. Include Alpine.js in your project</li><li>2. Add <code>x-data</code> to your HTML elements</li><li>3. Use Alpine.js directives like <code>x-show</code>, <code>x-text</code>, etc.</li><li>4. Enjoy reactive, interactive components!</li></ol><div class="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded"><strong>Pro Tip:</strong> Start with simple interactions and gradually build up to more complex components.</div>'
                                    ]
                                ];
                            @endphp
                            
                            <x-alpine-accordion :items="$accordionItems" :multiple="true" />
                        </div>

                        <!-- Form Component Demo -->
                        <div class="mb-8">
                            <h3 class="text-lg font-medium mb-4">📝 Form Component</h3>
                            
                            <x-alpine-form action="/api/contact" submit-text="Send Message" show-cancel="true">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="form-label">Name</label>
                                        <input type="text" name="name" class="form-control" placeholder="Enter your name" required>
                                    </div>
                                    <div>
                                        <label class="form-label">Email</label>
                                        <input type="email" name="email" class="form-control" placeholder="Enter your email" required>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <label class="form-label">Subject</label>
                                    <input type="text" name="subject" class="form-control" placeholder="Enter subject" required>
                                </div>
                                <div class="mt-4">
                                    <label class="form-label">Category</label>
                                    <select name="category" class="form-select" required>
                                        <option value="">Select a category</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="bug">Bug Report</option>
                                    </select>
                                </div>
                                <div class="mt-4">
                                    <label class="form-label">Priority</label>
                                    <div class="flex space-x-4">
                                        <label class="flex items-center">
                                            <input type="radio" name="priority" value="low" class="form-check-input mr-2">
                                            <span>Low</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="radio" name="priority" value="medium" class="form-check-input mr-2">
                                            <span>Medium</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="radio" name="priority" value="high" class="form-check-input mr-2">
                                            <span>High</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <label class="form-label">Message</label>
                                    <textarea name="message" class="form-control" rows="4" placeholder="Enter your message" required></textarea>
                                </div>
                                <div class="mt-4">
                                    <label class="flex items-center">
                                        <input type="checkbox" name="newsletter" class="form-check-input mr-2">
                                        <span>Subscribe to our newsletter</span>
                                    </label>
                                </div>
                            </x-alpine-form>
                        </div>

                        <!-- Interactive Counter Demo -->
                        <div class="mb-8">
                            <h3 class="text-lg font-medium mb-4">🔢 Interactive Counter Demo</h3>
                            
                            <div x-data="{ count: 0, step: 1 }" class="bg-slate-50 dark:bg-neutral-800 p-6 rounded-lg">
                                <div class="flex items-center justify-between mb-4">
                                    <h4 class="font-medium">Counter: <span x-text="count"></span></h4>
                                    <div class="flex items-center space-x-2">
                                        <label class="text-sm">Step:</label>
                                        <input type="number" x-model="step" class="form-control w-20" min="1" max="10">
                                    </div>
                                </div>
                                <div class="flex space-x-2">
                                    <button @click="count -= step" class="btn btn-outline-danger">-<span x-text="step"></span></button>
                                    <button @click="count = 0" class="btn btn-outline-secondary">Reset</button>
                                    <button @click="count += step" class="btn btn-outline-success">+<span x-text="step"></span></button>
                                </div>
                                <div class="mt-4 text-sm text-slate-600 dark:text-neutral-400">
                                    <p>This demonstrates basic Alpine.js reactivity and event handling.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Color Picker Demo -->
                        <div class="mb-8">
                            <h3 class="text-lg font-medium mb-4">🎨 Color Picker Demo</h3>
                            
                            <div x-data="{ 
                                color: '#3b82f6',
                                colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']
                            }" class="bg-slate-50 dark:bg-neutral-800 p-6 rounded-lg">
                                <div class="flex items-center space-x-4 mb-4">
                                    <div class="w-12 h-12 rounded-lg border-2 border-slate-200" :style="`background-color: ${color}`"></div>
                                    <div>
                                        <h4 class="font-medium">Selected Color</h4>
                                        <p class="text-sm text-slate-600 dark:text-neutral-400" x-text="color"></p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-4 gap-2">
                                    <template x-for="c in colors" :key="c">
                                        <button 
                                            @click="color = c"
                                            class="w-12 h-12 rounded-lg border-2 transition-all duration-200"
                                            :class="color === c ? 'border-slate-800 scale-110' : 'border-slate-200 hover:border-slate-400'"
                                            :style="`background-color: ${c}`"
                                        ></button>
                                    </template>
                                </div>
                                <div class="mt-4 text-sm text-slate-600 dark:text-neutral-400">
                                    <p>Click on a color to select it. This demonstrates Alpine.js reactivity and dynamic styling.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    <!-- Source Code -->
                    <div class="source-code hidden">
                        <button data-target="#copy-alpine-demo" class="copy-code btn py-1 px-2 btn-outline-secondary">
                            <i data-lucide="file" class="w-4 h-4 mr-2"></i> Copy example code
                        </button>
                        <div class="overflow-y-auto mt-3 rounded-md">
                            <pre class="source-preview" id="copy-alpine-demo">
                                <code class="html">
                                    {{ str_replace('>', 'HTMLCloseTag', str_replace('<', 'HTMLOpenTag', '
                                        <!-- Data Table Component -->
                                        <x-alpine-data-table 
                                            :data="$users" 
                                            :columns="$columns"
                                            :per-page="3"
                                            search-placeholder="Search users..."
                                        />

                                        <!-- Modal Component -->
                                        <x-alpine-modal title="Sample Modal" size="lg">
                                            <x-slot name="trigger">
                                                <button class="btn btn-primary">Open Modal</button>
                                            </x-slot>
                                            <div>Modal content...</div>
                                        </x-alpine-modal>

                                        <!-- Dropdown Component -->
                                        <x-alpine-dropdown placement="bottom" align="left">
                                            <x-slot name="trigger">
                                                <button class="btn btn-outline-secondary">Actions</button>
                                            </x-slot>
                                            <div class="py-1">
                                                <a href="#" class="block px-4 py-2 text-sm hover:bg-slate-100">Edit</a>
                                                <a href="#" class="block px-4 py-2 text-sm hover:bg-slate-100">Delete</a>
                                            </div>
                                        </x-alpine-dropdown>

                                        <!-- Tabs Component -->
                                        <x-alpine-tabs :tabs="$tabs" />

                                        <!-- Accordion Component -->
                                        <x-alpine-accordion :items="$accordionItems" :multiple="true" />

                                        <!-- Form Component -->
                                        <x-alpine-form action="/api/contact" submit-text="Send Message">
                                            <input type="text" name="name" class="form-control" required>
                                            <textarea name="message" class="form-control" required></textarea>
                                        </x-alpine-form>

                                        <!-- Interactive Counter -->
                                        <div x-data="{ count: 0 }">
                                            <span x-text="count"></span>
                                            <button @click="count++">+</button>
                                            <button @click="count--">-</button>
                                        </div>
                                    ')) }}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
