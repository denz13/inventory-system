<?php

namespace App\Http\Livewire\Inventory;

use Livewire\Component;
use App\Models\tbl_entry_data;
use App\Models\tbl_entry_data_product;
use Illuminate\Support\Facades\Log;

class Entrydata extends Component
{
    // Entry Data Properties
    public $clientName = '';
    public $address = '';
    public $date = '';
    public $package = '';
    public $status = '';
    
    // Products Array
    public $products = [];
    public $productCount = 1;
    public $showAddEntryModal = false;
    public $refreshKey = 0;
    


    public function mount()
    {
        // Initialize with one empty product
        $this->products[] = [
            'description' => '',
            'quantity' => '',
            'rec_meter' => '',
            'qty' => '',
        ];
        $this->productCount = count($this->products);
    }
    
    public function getProductCountProperty()
    {
        return count($this->products);
    }

    public function addProduct()
    {
        $this->products[] = [
            'description' => '',
            'quantity' => '',
            'rec_meter' => '',
            'qty' => '',
        ];
        
        // Update count to force re-render
        $this->productCount = count($this->products);
        
        // Force refresh by updating key
        $this->refreshKey = time() . rand(1000, 9999);
        
        // Force property update to trigger re-render
        $this->products = array_values($this->products);
        
        // Emit event to force refresh
        $this->emit('productUpdated');
        
        return $this->productCount;
    }

    public function removeProduct($index)
    {
        if (count($this->products) > 1) {
            unset($this->products[$index]);
            $this->products = array_values($this->products); // Re-index array
        }
    }

    public function openAddEntryModal(): void
    {
        $this->showAddEntryModal = true;
    }

    public function closeAddEntryModal(): void
    {
        $this->showAddEntryModal = false;
    }

    public function saveEntryData()
    {
        // Validate Entry Data
        $this->validate([
            'clientName' => 'required|string|max:255',
            'address' => 'required|string',
            'date' => 'required|date',
            'package' => 'required|string|max:255',
            'status' => 'required|string',
            'products.*.description' => 'required|string|max:255',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.rec_meter' => 'nullable|numeric|min:0',
            'products.*.qty' => 'required|integer|min:1',
        ]);

        try {
            // Create Entry Data
            $entryData = tbl_entry_data::create([
                'client_name' => $this->clientName,
                'address' => $this->address,
                'date' => $this->date,
                'package' => $this->package,
                'status' => $this->status,
            ]);

            // Create Products
            foreach ($this->products as $product) {
                tbl_entry_data_product::create([
                    'entry_data_id' => $entryData->id,
                    'description' => $product['description'],
                    'quantity' => $product['quantity'],
                    'rec_meter' => $product['rec_meter'],
                    'qty' => $product['qty'],
                    'status' => 'active', // Default status for products
                ]);
            }

            $this->resetForm();
            session()->flash('message', 'Entry data saved successfully!');
            $this->showAddEntryModal = false;
            
        } catch (\Exception $e) {
            session()->flash('error', 'Error saving entry data: ' . $e->getMessage());
        }
    }

    private function resetForm()
    {
        $this->clientName = '';
        $this->address = '';
        $this->date = '';
        $this->package = '';
        $this->status = '';
        $this->products = [];
        $this->addProduct(); // Add one empty product
    }

    public function render()
    {
        return view('livewire.inventory.entrydata');
    }
}
