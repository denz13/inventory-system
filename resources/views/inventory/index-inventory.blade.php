@extends('layout._partials.master')
@section('title')
    {{ __('Inventory') }}
@endsection
@push('css')
    <!-- Sweet Alert css-->
    <link href="{{ URL::asset('build/libs/sweetalert2/sweetalert2.min.css') }}" rel="stylesheet" type="text/css">
@endpush
@section('content')
    <div class="intro-y flex items-center mt-8">
        <h2 class="text-lg font-medium mr-auto">
            Inventory
        </h2>
    </div>
    <livewire:inventory.entrydata />
@endsection
@push('scripts')
    <!-- Ensure Livewire loads first -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM loaded, Livewire available:', typeof Livewire !== 'undefined');
        });
    </script>
@endpush
