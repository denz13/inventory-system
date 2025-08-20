<?php

namespace App\Http\Controllers\announcement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_announcement;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = tbl_announcement::orderBy('created_at', 'desc')
            ->paginate(10);
            
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
            \Log::error('Error updating announcement: ' . $e->getMessage());
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
