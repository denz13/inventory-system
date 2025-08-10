<?php

namespace App\Http\Livewire\Dashboard;

use Livewire\Component;
use App\Http\View\Composers\FakerComposer;

class DashboardOverview1 extends Component
{
    public $selectedCategory = 'all';

    public function mount()
    {
        // Initialize with default category
        $this->selectedCategory = 'all';
    }

    public function filterByCategory()
    {
        // Handle category change
        // You can add filtering logic here based on $this->selectedCategory
        
        // For now, just emit an event or update data
        $this->emit('categoryChanged', $this->selectedCategory);
    }

    public function render()
    {
        $fakerComposer = new FakerComposer();
        
        return view('livewire.dashboard.dashboard-overview1', [
            'fakers' => $this->getFakeData()
        ]);
    }

    private function getFakeData()
    {
        // Generate fake data for the dashboard
        // This is a simplified version - you should replace with real data from your database
        return collect(range(1, 10))->map(function ($index) {
            return [
                'users' => [['name' => 'User ' . $index]],
                'photos' => ['profile-' . (($index % 15) + 1) . '.jpg'],
                'dates' => [now()->subDays($index)->format('d M Y')],
                'products' => [['name' => 'Product ' . $index, 'category' => 'electronics']],
                'images' => ['preview-' . (($index % 15) + 1) . '.jpg'],
                'stocks' => [rand(10, 100)],
                'true_false' => [rand(0, 1) == 1],
                'totals' => [rand(100, 1000)]
            ];
        })->toArray();
    }
}
