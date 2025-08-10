<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Livewire\Livewire;
use App\Http\Livewire\Pages\FAQS\FAQLayout1;
use App\Http\Livewire\Pages\FAQS\FAQLayout2;
use App\Http\Livewire\Pages\FAQS\FAQLayout3;

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
    }
}
