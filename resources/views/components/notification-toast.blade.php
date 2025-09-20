@props([
    'id' => null,
    'type' => 'success',
    'title' => 'Notification',
    'message' => '',
    'buttonText' => 'Show Notification',
    'showButton' => true,
    'autoHide' => true,
    'duration' => 5000,
    'position' => 'right',
    'gravity' => 'top'
])

@php
    $toastId = $id ?? 'notification-' . uniqid();
    $contentId = $toastId . '-content';
    $toggleId = $toastId . '-toggle';
    
    $iconClasses = [
        'success' => 'text-success',
        'error' => 'text-danger',
        'warning' => 'text-warning',
        'info' => 'text-info'
    ];
    
    $icons = [
        'success' => 'CheckCircle',
        'error' => 'x-circle',
        'warning' => 'alert-triangle',
        'info' => 'info'
    ];
    
    $iconClass = $iconClasses[$type] ?? $iconClasses['success'];
    $iconName = $icons[$type] ?? $icons['success'];
@endphp

<!-- BEGIN: Notification Content -->
<div id="{{ $contentId }}" class="toastify-content hidden flex">
    @if($type === 'success')
        <svg class="w-6 h-6 text-success mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
    @else
        <i class="{{ $iconClass }}" data-lucide="{{ $iconName }}"></i>
    @endif
    <div class="ml-4 mr-4">
        <div class="font-medium">{{ $title }}</div>
        @if($message)
            <div class="text-slate-500 mt-1">{{ $message }}</div>
        @endif
        {{ $slot }}
    </div>
</div>
<!-- END: Notification Content -->

@if($showButton)
    <!-- BEGIN: Notification Toggle -->
    <button id="{{ $toggleId }}" class="btn btn-primary">{{ $buttonText }}</button>
    <!-- END: Notification Toggle -->
@endif

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    const notificationContent = document.getElementById('{{ $contentId }}');
    console.log('Notification component {{ $toastId }} loaded');
    console.log('Notification content element found:', !!notificationContent);
    console.log('Toastify available:', typeof Toastify !== 'undefined');
    
    // Function to show notification
    window.showNotification_{{ $toastId }} = function() {
        console.log('showNotification_{{ $toastId }} called');
        console.log('Toastify available:', typeof Toastify !== 'undefined');
        console.log('Notification content available:', !!notificationContent);
        
        if (typeof Toastify !== 'undefined' && notificationContent) {
            const content = notificationContent.cloneNode(true);
            content.classList.remove('hidden');
            
            // Initialize Lucide icons in the cloned content
            console.log('Cloned content HTML:', content.outerHTML);
            
            if (typeof window.lucide !== 'undefined' && window.lucide.createIcons) {
                // Find the icon element in the cloned content and initialize it
                const iconElement = content.querySelector('[data-lucide]');
                console.log('Icon element found in cloned content:', !!iconElement);
                if (iconElement) {
                    console.log('Icon element:', iconElement);
                    console.log('Icon data-lucide attribute:', iconElement.getAttribute('data-lucide'));
                    console.log('Icon classes:', iconElement.className);
                    
                    // Try to initialize icons specifically for this element
                    setTimeout(() => {
                        window.lucide.createIcons({
                            icons: window.lucide.icons,
                            "stroke-width": 1.5,
                            nameAttr: "data-lucide",
                        });
                        console.log('Lucide icons initialized for notification');
                    }, 100);
                }
            } else {
                console.log('Lucide not available:', typeof window.lucide);
            }
            
            console.log('Creating Toastify notification...');
            Toastify({
                node: content,
                duration: {{ $autoHide ? $duration : 0 }},
                newWindow: true,
                close: false,
                gravity: "{{ $gravity }}",
                position: "{{ $position }}",
                stopOnFocus: true,
            }).showToast();
            console.log('Toastify notification created');
        } else if (notificationContent) {
            // Fallback: no alerts per requirement
            console.log('Toast fallback:', '{{ $title }}', '{{ $message }}');
        } else {
            console.error('Notification content not found for {{ $toastId }}');
        }
    };
    
    @if($showButton)
    // Button click handler
    const toggleButton = document.getElementById('{{ $toggleId }}');
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            window.showNotification_{{ $toastId }}();
        });
    }
    @endif
});
</script>
@endpush
