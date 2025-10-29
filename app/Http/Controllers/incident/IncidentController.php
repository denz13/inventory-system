<?php

namespace App\Http\Controllers\incident;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\tbl_incident_report;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class IncidentController extends Controller
{
    public function index(Request $request)
    {
        // Build query for user's incidents
        $query = tbl_incident_report::with(['user', 'assignedGuard'])
            ->where('user_id', Auth::id());
        
        // Apply search filter
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('person_involved_name', 'like', "%{$search}%")
                  ->orWhere('designation', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('location_of_incident', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%");
            });
        }
        
        $perPage = $request->input('per_page', 10);
        $userIncidents = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $guards = User::where('role', 'guard')
                     ->where('is_online', 1)
                     ->select('id', 'name', 'contact_number')
                     ->get();
        
        return view('incident.incident', compact('userIncidents', 'guards'));
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'person_involved_name' => 'required|string|max:255',
                'street' => 'required|string|max:255',
                'address' => 'required|string|max:500',
                'designation' => 'required|string|max:255',
                'datetime_of_incident' => 'required|date',
                'location_of_incident' => 'required|string|max:500',
                'guard_id' => 'nullable|exists:users,id',
            ]);

            $incident = new tbl_incident_report();
            $incident->user_id = Auth::id();
            $incident->person_involved_name = $validated['person_involved_name'];
            $incident->street = $validated['street'];
            $incident->address = $validated['address'];
            $incident->designation = $validated['designation'];
            $incident->datetime_of_incident = $validated['datetime_of_incident'];
            $incident->location_of_incident = $validated['location_of_incident'];
            $incident->guard_id = $validated['guard_id'];
            $incident->status = 'Pending';
            $incident->save();
            // If request is AJAX/JSON, return JSON. Otherwise redirect back with flash message
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'message' => 'Incident report submitted successfully',
                    'id' => $incident->id,
                ], 201);
            }

            // Log diagnostics to understand why form posts render JSON in browser
            \Log::info('Incident store non-AJAX submission', [
                'ajax' => $request->ajax(),
                'expectsJson' => $request->expectsJson(),
                'wantsJson' => $request->wantsJson(),
                'accept' => $request->header('Accept'),
                'x_requested_with' => $request->header('X-Requested-With'),
            ]);

            return redirect()->route('incident.index')
                ->with('success', 'Incident report submitted successfully');
        } catch (\Exception $e) {
            \Log::error('Error storing incident: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error submitting incident report: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $incident = tbl_incident_report::with(['user', 'assignedGuard'])
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return response()->json($incident); 
    }

    public function update(Request $request, $id)
    {
        try {
            $incident = tbl_incident_report::where('user_id', Auth::id())
                ->where('status', 'Pending')
                ->findOrFail($id);

            $validated = $request->validate([
                'person_involved_name' => 'required|string|max:255',
                'street' => 'required|string|max:255',
                'address' => 'required|string|max:500',
                'designation' => 'required|string|max:255',
                'datetime_of_incident' => 'required|date',
                'location_of_incident' => 'required|string|max:500',
                'guard_id' => 'nullable|exists:users,id',
            ]);

            $incident->update([
                'person_involved_name' => $validated['person_involved_name'],
                'street' => $validated['street'],
                'address' => $validated['address'],
                'designation' => $validated['designation'],
                'datetime_of_incident' => $validated['datetime_of_incident'],
                'location_of_incident' => $validated['location_of_incident'],
                'guard_id' => $validated['guard_id'],
            ]);

            return response()->json([
                'message' => 'Incident report updated successfully',
                'incident' => $incident->fresh()    
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating incident: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error updating incident report: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $incident = tbl_incident_report::where('user_id', Auth::id())
            ->where('status', 'Pending')
            ->findOrFail($id);

        $incident->delete();

        return response()->json([
            'message' => 'Incident report deleted successfully',
            'incident' => $incident->fresh()
        ]);
    }
}
