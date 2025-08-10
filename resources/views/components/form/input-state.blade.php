@props([
    'id',
    'label' => '',
    'placeholder' => '',
    'status' => null, // success, warning, danger
    'message' => null,
    'showBars' => false, // only for password strength
])

@php
    $borderColor = match($status) {
        'success' => 'border-success',
        'warning' => 'border-warning',
        'danger'  => 'border-danger',
        default   => '',
    };

    $textColor = match($status) {
        'success' => 'text-success',
        'warning' => 'text-warning',
        'danger'  => 'text-danger',
        default   => '',
    };

    $barColor = match($status) {
        'success' => 'bg-success',
        'warning' => 'bg-warning',
        'danger'  => 'bg-danger',
        default   => 'bg-slate-100 dark:bg-darkmode-800',
    };
@endphp

<div class="mt-3">
    <label for="{{ $id }}" class="form-label">{{ $label }}</label>
    <input id="{{ $id }}" type="text" class="form-control {{ $borderColor }}" placeholder="{{ $placeholder }}">

    @if($showBars)
        <div class="w-full grid grid-cols-12 gap-4 h-1 mt-3">
            <div class="col-span-3 h-full rounded {{ $barColor }}"></div>
            <div class="col-span-3 h-full rounded {{ $barColor }}"></div>
            <div class="col-span-3 h-full rounded {{ $barColor }}"></div>
            <div class="col-span-3 h-full rounded bg-slate-100 dark:bg-darkmode-800"></div>
        </div>
    @endif

    @if($message)
        <div class="{{ $textColor }} mt-2">{{ $message }}</div>
    @endif
</div>
