@props([
    'id',
    'label',
    'type' => 'text',
    'placeholder' => '',
    'rounded' => false,
    'help' => null,
    'disabled' => false,
])

<div class="mt-3">
    <label for="{{ $id }}" class="form-label">{{ $label }}</label>
    <input 
        id="{{ $id }}" 
        type="{{ $type }}" 
        placeholder="{{ $placeholder }}"
        {{ $disabled ? 'disabled' : '' }}
        class="form-control {{ $rounded ? 'form-control-rounded' : '' }}"
    >
    @if ($help)
        <div class="form-help">{{ $help }}</div>
    @endif
</div>
