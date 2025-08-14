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
        'success' => 'check-circle',
        'error' => 'x-circle',
        'warning' => 'alert-triangle',
        'info' => 'info'
    ];
    
    $iconClass = $iconClasses[$type] ?? $iconClasses['success'];
    $iconName = $icons[$type] ?? $icons['success'];
@endphp

<!-- BEGIN: Notification Content -->
<div id="{{ $contentId }}" class="toastify-content hidden flex">
    <i class="{{ $iconClass }}" data-lucide="{{ $iconName }}"></i>
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
    
    // Function to show notification
    window.showNotification_{{ $toastId }} = function() {
        if (typeof Toastify !== 'undefined' && notificationContent) {
            const content = notificationContent.cloneNode(true);
            content.classList.remove('hidden');
            
            Toastify({
                node: content,
                duration: {{ $autoHide ? $duration : 0 }},
                newWindow: true,
                close: false,
                gravity: "{{ $gravity }}",
                position: "{{ $position }}",
                stopOnFocus: true,
            }).showToast();
        } else if (notificationContent) {
            // Fallback: no alerts per requirement
            console.log('Toast:', '{{ $title }}', '{{ $message }}');
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
