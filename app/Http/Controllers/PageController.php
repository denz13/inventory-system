<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

class PageController extends Controller
{
    /**
     * Show any page dynamically.
     *
     * @param  string|null  $page
     * @return \Illuminate\Http\Response
     */
    public function showPage($page = null)
    {
        // If no page is provided, default to dashboard-overview-1
        if ($page === null) {
            $page = 'dashboard-overview-1';
        }
        
        // Convert kebab-case to view path
        $viewPath = 'pages/' . str_replace('-', '-', $page);
        
        // Check if the view exists
        if (view()->exists($viewPath)) {
            return view($viewPath);
        }
        
        // If view doesn't exist, return custom error page
        return view('pages.pages.error-page', ['layout' => 'main']);
    }

}
