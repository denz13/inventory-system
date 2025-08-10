<?php

namespace App\Http\Livewire\Components\Grid;

use Livewire\Component;

class RegularTable extends Component
{
    public function getSampleUsers()
    {
        return [
            ['First Name' => 'Angelina', 'Last Name' => 'Jolie', 'Username' => '@angelinajolie'],
            ['First Name' => 'Brad', 'Last Name' => 'Pitt', 'Username' => '@bradpitt'],
            ['First Name' => 'Charlie', 'Last Name' => 'Hunnam', 'Username' => '@charliehunnam'],
        ];
    }

    public function getSampleProducts()
    {
        return [
            ['Product' => 'Laptop', 'Price' => '$999', 'Stock' => '15'],
            ['Product' => 'Mouse', 'Price' => '$25', 'Stock' => '50'],
            ['Product' => 'Keyboard', 'Price' => '$75', 'Stock' => '30'],
        ];
    }

    public function getSampleUsersWithoutNumbering()
    {
        return [
            ['Name' => 'John Doe', 'Email' => 'john@example.com', 'Status' => 'Active'],
            ['Name' => 'Jane Smith', 'Email' => 'jane@example.com', 'Status' => 'Inactive'],
        ];
    }

    public function render()
    {
        return view('livewire.components.grid.regular-table', [
            'sampleUsers' => $this->getSampleUsers(),
            'sampleProducts' => $this->getSampleProducts(),
            'sampleUsersWithoutNumbering' => $this->getSampleUsersWithoutNumbering(),
        ]);
    }
}
