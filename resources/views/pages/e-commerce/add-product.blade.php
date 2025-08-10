@extends('../layout/' . $layout)

@section('subhead')
    <title>CRUD Form - Midone - Tailwind HTML Admin Template</title>
@endsection

@section('subcontent')
   @livewire('e-commerce.add-product')
@endsection

@section('script')
    @vite('resources/js/ckeditor-classic.js')
@endsection
