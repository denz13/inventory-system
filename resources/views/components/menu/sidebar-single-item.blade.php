@props(['key', 'href', 'icon', 'text', 'active' => false])

<li>
    <a href="{{ $href }}" class="side-menu {{ $active ? 'side-menu--active' : '' }}">
        <div class="side-menu__icon"> 
            <i data-lucide="{{ $icon }}"></i> 
        </div>
        <div class="side-menu__title">{{ $text }}</div>
    </a>
</li>
