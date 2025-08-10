<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function index() {
        return view('dashboard.index-dashboard');
    }

    public function routes($route)
    {
        // First try the exact route name
        if (view()->exists($route)) {
            return view($route);
        }
        
        // Then try route/index-route pattern for subdirectories
        $indexView = $route . '/index-' . $route;
        if (view()->exists($indexView)) {
            return view($indexView);
        }
        
        return abort(404);
    }
}