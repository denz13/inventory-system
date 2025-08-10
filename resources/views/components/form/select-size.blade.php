@props([
    'options' => [],       // Array of options
    'size' => null,        // lg, sm, or null
    'class' => '',         // Additional classes
    'ariaLabel' => 'Select dropdown',
])

@php
    $sizeClass = $size ? "form-select-{$size}" : '';
@endphp

<select {{ $attributes->merge([
    'class' => "form-select {$sizeClass} {$class}",
    'aria-label' => $ariaLabel
]) }}>
    @foreach ($options as $option)
        <option>{{ $option }}</option>
    @endforeach
</select>
