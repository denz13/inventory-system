@props([
    'placeholder' => '',
    'size' => '', // e.g., 'lg', 'sm', or leave empty for default
    'class' => '',
    'ariaLabel' => '',
])

@php
    $sizeClass = $size ? "form-control-{$size}" : '';
@endphp

<input
    type="text"
    class="form-control {{ $sizeClass }} {{ $class }}"
    placeholder="{{ $placeholder }}"
    aria-label="{{ $ariaLabel ?: $placeholder }}"
/>
