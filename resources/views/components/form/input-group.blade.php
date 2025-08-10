@props([
    'id' => null,
    'placeholder' => '',
    'label' => '',
    'prepend' => null,
    'append' => null,
    'class' => '',
    'ariaLabel' => '',
])

@php
    $inputId = $id ?? Str::uuid();
@endphp

<div class="input-group {{ $class }}">
    @if ($prepend)
        <div id="{{ $inputId }}-prepend" class="input-group-text">{{ $prepend }}</div>
    @endif

    <input 
        type="text"
        class="form-control"
        placeholder="{{ $placeholder }}"
        aria-label="{{ $ariaLabel ?: $placeholder }}"
        @if($prepend) aria-describedby="{{ $inputId }}-prepend" @endif
        @if($append) aria-describedby="{{ $inputId }}-append" @endif
    >

    @if ($append)
        <div id="{{ $inputId }}-append" class="input-group-text">{{ $append }}</div>
    @endif
</div>
