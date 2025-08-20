<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use Livewire\Livewire;
use App\Http\Livewire\Pages\FAQS\FAQLayout1;
use App\Http\Livewire\Pages\FAQS\FAQLayout2;
use App\Http\Livewire\Pages\FAQS\FAQLayout3;
use App\Models\tbl_announcement;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Livewire::component('pages.faqs.faqlayout1', FAQLayout1::class);
        Livewire::component('pages.faqs.faqlayout2', FAQLayout2::class);
        Livewire::component('pages.faqs.faqlayout3', FAQLayout3::class);
        
        // Register Inventory components
        Livewire::component('inventory.entrydata', \App\Http\Livewire\Inventory\Entrydata::class);
        
        // Share active announcements with all views
        View::composer('*', function ($view) {
            $activeAnnouncements = tbl_announcement::where('status', 'Active')
                ->whereIn('visible_to', ['public', 'private'])
                ->orderBy('created_at', 'desc')
                ->take(5) // Limit to 5 most recent announcements
                ->get();
            
            $view->with('activeAnnouncements', $activeAnnouncements);
        });
    }
}
