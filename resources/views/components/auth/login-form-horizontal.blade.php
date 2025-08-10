@props([
    'action' => '#',
    'method' => 'POST',
    'showRemember' => true,
    'buttonText' => 'Login',
])

<form action="{{ $action }}" method="{{ $method }}">
    @csrf

    <div class="form-inline">
        <label for="email" class="form-label sm:w-20">Email</label>
        <input
            id="email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            value="{{ old('email') }}"
            class="form-control @error('email') border-danger @enderror"
        >
        @error('email')
            <div class="text-danger text-sm mt-1">{{ $message }}</div>
        @enderror
    </div>

    <div class="form-inline mt-5">
        <label for="password" class="form-label sm:w-20">Password</label>
        <input
            id="password"
            name="password"
            type="password"
            placeholder="secret"
            class="form-control @error('password') border-danger @enderror"
        >
        @error('password')
            <div class="text-danger text-sm mt-1">{{ $message }}</div>
        @enderror
    </div>

    @if ($showRemember)
        <div class="form-check sm:ml-20 sm:pl-5 mt-5">
            <input
                id="remember"
                name="remember"
                type="checkbox"
                class="form-check-input"
                {{ old('remember') ? 'checked' : '' }}
            >
            <label class="form-check-label" for="remember">Remember me</label>
        </div>
    @endif

    {{-- Optional slot for links, e.g. Forgot password --}}
    {{ $slot }}

    <div class="sm:ml-20 sm:pl-5 mt-5">
        <button type="submit" class="btn btn-primary">{{ $buttonText }}</button>
    </div>
</form>
