<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Http\Response;

class DashboardExportController extends Controller
{
    public function exportUsersToExcel()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        
        $filename = 'users_export_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];
        
        $callback = function() use ($users) {
            $file = fopen('php://output', 'w');
            
            // Add CSV headers
            fputcsv($file, ['ID', 'Name', 'Email', 'Role', 'Status', 'Created At']);
            
            // Add user data
            foreach ($users as $user) {
                fputcsv($file, [
                    $user->id ?? 'N/A',
                    $user->name ?? 'N/A',
                    $user->email ?? 'N/A',
                    $user->role ?? 'User',
                    $user->active ? 'Active' : 'Inactive',
                    $user->created_at ? $user->created_at->format('Y-m-d H:i:s') : 'N/A'
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
    
    public function exportUsersToPDF()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        
        $html = view('livewire.dashboard.users-pdf', compact('users'))->render();
        
        // For now, we'll return a simple HTML response that can be printed as PDF
        // In a real application, you might want to use a library like DomPDF or TCPDF
        return response($html)
            ->header('Content-Type', 'text/html')
            ->header('Content-Disposition', 'inline; filename="users_export_' . date('Y-m-d_H-i-s') . '.html"');
    }
}
