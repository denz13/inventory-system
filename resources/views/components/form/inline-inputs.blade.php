@props([
    'inputs' => [],             // Each item: ['placeholder' => '', 'col' => 4]
    'grid' => 12,               // Total grid columns
    'gap' => 2,                 // Tailwind gap-x size (e.g., 2, 4)
    'class' => '',              // Extra wrapper classes
])

@php
    $gapClass = "gap-{$gap}";
    $gridClass = "grid-cols-{$grid}";
@endphp

<div class="grid {{ $gridClass }} {{ $gapClass }} {{ $class }}">
    @foreach ($inputs as $index => $input)
        <input 
            type="text"
            class="form-control col-span-{{ $input['col'] ?? 4 }}"
            placeholder="{{ $input['placeholder'] ?? '' }}"
            aria-label="{{ $input['aria'] ?? 'Input inline '.($index + 1) }}"
        >
    @endforeach
</div>
