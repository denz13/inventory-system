<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function index() {
        return view('pages.dashboard.dashboard-overview-1', [
            'layout' => 'side-menu'
        ]);
    }

    public function routes($route)
    {
        // Clean the route parameter
        $route = trim($route, '/');
        
        // Try different view path patterns
        $viewPaths = [
            $route,                    // Direct match
            'pages.' . $route,         // Pages folder
            'pages.' . str_replace('/', '.', $route), // Convert slashes to dots
        ];
        
        foreach ($viewPaths as $viewPath) {
            if (view()->exists($viewPath)) {
                return view($viewPath);
            }
        }
        
        // If no view found, return 404
        return abort(404);
    }
}