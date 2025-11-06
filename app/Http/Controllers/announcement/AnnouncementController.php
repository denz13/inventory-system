<?php

namespace App\Http\Controllers\announcement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_announcement;
use Illuminate\Support\Facades\Log;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        // Build query for announcements
        $query = tbl_announcement::query();
        
        // Filter based on user role - Non-homeowners should NOT see private announcements
        $currentUser = auth()->user();
        $userRole = strtolower($currentUser->role ?? '');
        
        $isNonHomeowner = in_array($userRole, [
            'non-homeowner', 
            'non homeowner', 
            'non-homeowners', 
            'non home owners'
        ]);
        
        if ($isNonHomeowner) {
            // Non-homeowners can ONLY see public announcements
            $query->where('visible_to', 'public');
        }
        // Homeowners and other roles can see both public and private announcements
        
        // Apply search filter
        if ($request->has('search') && $request->search != '') {
            $search = trim($request->search);
            $query->where(function($q) use ($search) {
                $q->where('type', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('visible_to', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%")
                  ->orWhere('created_at', 'like', "%{$search}%");
            });
        }
        
        // Apply status filter
        if ($request->has('status') && $request->status != 'all') {
            $query->where('status', $request->status);
        }
        
        $perPage = $request->input('per_page', 10);
        $announcements = $query->orderBy('created_at', 'desc')->paginate($perPage);
            
        return view('announcement.announcement', compact('announcements'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'description' => 'required|string',
            'visible_to' => 'required|in:public,private',
            'status' => 'required|in:Active,Inactive'
        ]);

        $announcement = tbl_announcement::create($validated);

        return response()->json([
            'message' => 'Announcement created successfully',
            'announcement' => $announcement
        ], 201);
    }

    public function show($id)
    {
        $announcement = tbl_announcement::findOrFail($id);
        return response()->json($announcement);
    }

    public function update(Request $request, $id)
    {
        try {
            $announcement = tbl_announcement::findOrFail($id);
            
            $validated = $request->validate([
                'type' => 'required|string|max:255',
                'description' => 'required|string',
                'visible_to' => 'required|in:public,private',
                'status' => 'required|in:Active,Inactive'
            ]);
            
            $announcement->update($validated);
            
            return response()->json([
                'message' => 'Announcement updated successfully',
                'announcement' => $announcement->fresh()
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating announcement: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error updating announcement: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $announcement = tbl_announcement::findOrFail($id);
        $announcement->delete();
        
        return response()->json([
            'message' => 'Announcement deleted successfully'
        ]);
    }
}
