@extends('layout._partials.master')
@section('title')
    {{ __('Dashboard') }}
@endsection

@section('content')
    <div class="intro-y flex items-center mt-8">
        <h2 class="text-lg font-medium mr-auto">
            Dashboard
        </h2>
    </div>
    @livewire('dashboard.dashboard')
@endsection

