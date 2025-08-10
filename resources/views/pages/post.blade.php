@extends('../layout/' . $layout)

@section('subhead')
    <title>Add New Post - Midone - Tailwind HTML Admin Template</title>
@endsection

@section('subcontent')
    @livewire('post')
@endsection

@section('script')
    @vite('resources/js/ckeditor-classic.js')
@endsection
