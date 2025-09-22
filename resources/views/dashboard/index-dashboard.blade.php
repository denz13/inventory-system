@extends('layout._partials.master')
@section('title')
    {{ __('Dashboard') }}
@endsection

@section('content')
    
    @livewire('dashboard.dashboard')
@endsection

