@props([
    'action' => '#',
    'method' => 'POST',
    'showRemember' => true,
    'buttonText' => 'Login',
])

<form action="{{ $action }}" method="{{ $method }}">
    @csrf

    <div>
        <label for="email" class="form-label">Email</label>
        <input
            id="email"
            type="email"
            name="email"
            class="form-control @error('email') border-danger @enderror"
            placeholder="example@gmail.com"
            value="{{ old('email') }}"
        >
        @error('email')
            <div class="text-danger mt-1 text-sm">{{ $message }}</div>
        @enderror
    </div>

    <div class="mt-3">
        <label for="password" class="form-label">Password</label>
        <input
            id="password"
            type="password"
            name="password"
            class="form-control @error('password') border-danger @enderror"
            placeholder="secret"
        >
        @error('password')
            <div class="text-danger mt-1 text-sm">{{ $message }}</div>
        @enderror
    </div>

    @if ($showRemember)
        <div class="form-check mt-5">
            <input
                id="remember"
                class="form-check-input"
                type="checkbox"
                name="remember"
                {{ old('remember') ? 'checked' : '' }}
            >
            <label class="form-check-label" for="remember">Remember me</label>
        </div>
    @endif

    {{-- Optional slot: for links or messages --}}
    {{ $slot }}

    <button type="submit" class="btn btn-primary mt-5 w-full">
        {{ $buttonText }}
    </button>
</form>
