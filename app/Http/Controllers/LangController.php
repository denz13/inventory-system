<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LangController extends Controller
{
    public function lang($locale = null)
    {
        if ($locale) {
            App::setLocale($locale);
            Session::put('lang', $locale);
            Session::save();
            return redirect()->back()->with('locale', $locale);
        } else {
            // Default to English if no locale provided
            App::setLocale('en');
            Session::put('lang', 'en');
            Session::save();
            return redirect()->back()->with('locale', 'en');
        }
    }
}
