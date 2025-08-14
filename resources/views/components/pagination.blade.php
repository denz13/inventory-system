@props([
    'currentPage' => 1,
    'totalPages' => 10,
    'perPage' => 10,
    'perPageOptions' => [10, 25, 35, 50],
    'showPerPageSelector' => true,
    'showFirstLast' => true
])

<div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
    <nav class="w-full sm:w-auto sm:mr-auto">
        <ul class="pagination">
            @if($showFirstLast)
                <!-- First Page -->
                <li class="page-item {{ $currentPage <= 1 ? 'disabled' : '' }}">
                    <a class="page-link" href="{{ $currentPage > 1 ? '#' : 'javascript:void(0)' }}"> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-left" class="lucide lucide-chevrons-left w-4 h-4" data-lucide="chevrons-left">
                            <polyline points="11 17 6 12 11 7"></polyline>
                            <polyline points="18 17 13 12 18 7"></polyline>
                        </svg> 
                    </a>
                </li>
            @endif
            
            <!-- Previous Page -->
            <li class="page-item {{ $currentPage <= 1 ? 'disabled' : '' }}">
                <a class="page-link" href="{{ $currentPage > 1 ? '#' : 'javascript:void(0)' }}"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-left" class="lucide lucide-chevron-left w-4 h-4" data-lucide="chevron-left">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg> 
                </a>
            </li>
            
            @php
                $start = max(1, $currentPage - 2);
                $end = min($totalPages, $currentPage + 2);
                
                // Adjust range if we're near the beginning or end
                if ($end - $start < 4) {
                    if ($start == 1) {
                        $end = min($totalPages, $start + 4);
                    } else {
                        $start = max(1, $end - 4);
                    }
                }
            @endphp
            
            <!-- Show ellipsis if there are pages before our range -->
            @if($start > 1)
                <li class="page-item"><a class="page-link" href="#">1</a></li>
                @if($start > 2)
                    <li class="page-item"><a class="page-link" href="#">...</a></li>
                @endif
            @endif
            
            <!-- Page Numbers -->
            @for($i = $start; $i <= $end; $i++)
                <li class="page-item {{ $i == $currentPage ? 'active' : '' }}">
                    <a class="page-link" href="#">{{ $i }}</a>
                </li>
            @endfor
            
            <!-- Show ellipsis if there are pages after our range -->
            @if($end < $totalPages)
                @if($end < $totalPages - 1)
                    <li class="page-item"><a class="page-link" href="#">...</a></li>
                @endif
                <li class="page-item"><a class="page-link" href="#">{{ $totalPages }}</a></li>
            @endif
            
            <!-- Next Page -->
            <li class="page-item {{ $currentPage >= $totalPages ? 'disabled' : '' }}">
                <a class="page-link" href="{{ $currentPage < $totalPages ? '#' : 'javascript:void(0)' }}"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevron-right" class="lucide lucide-chevron-right w-4 h-4" data-lucide="chevron-right">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg> 
                </a>
            </li>
            
            @if($showFirstLast)
                <!-- Last Page -->
                <li class="page-item {{ $currentPage >= $totalPages ? 'disabled' : '' }}">
                    <a class="page-link" href="{{ $currentPage < $totalPages ? '#' : 'javascript:void(0)' }}"> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="chevrons-right" class="lucide lucide-chevrons-right w-4 h-4" data-lucide="chevrons-right">
                            <polyline points="13 17 18 12 13 7"></polyline>
                            <polyline points="6 17 11 12 6 7"></polyline>
                        </svg> 
                    </a>
                </li>
            @endif
        </ul>
    </nav>
    
    @if($showPerPageSelector)
        <!-- Per Page Selector -->
        <select class="w-20 form-select box mt-3 sm:mt-0">
            @foreach($perPageOptions as $option)
                <option value="{{ $option }}" {{ $option == $perPage ? 'selected' : '' }}>{{ $option }}</option>
            @endforeach
        </select>
    @endif
</div>
