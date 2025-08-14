<?php

namespace App\Http\Controllers\vehiclemanagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\vehicle_management_list as VehicleManagement;
use App\Models\vehicle_details as VehicleDetail;
use App\Models\User;
use Illuminate\Validation\Rule;

class VehicleManagementController extends Controller
{
    public function index()
    {
        $vehicles = VehicleManagement::with(['user'])->latest()->paginate(12);
        $owners = User::select('id','name')->orderBy('name')->get();
        return view('vehiclemanagement.vehiclemanagement', compact('vehicles','owners'));
    }

    public function show(VehicleManagement $vehicle)
    {
        $vehicle->load(['user']);
        $details = VehicleDetail::where('vehicle_management_id', $vehicle->id)->get();
        return response()->json([
            'vehicle' => $vehicle,
            'details' => $details,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'non_homeowners' => ['nullable','string','max:255'],
            'type_of_vehicle' => ['required', 'string', 'max:255'],
            'incase_of_emergency_name' => ['nullable', 'string', 'max:255'],
            'incase_of_emergency_number' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['active','inactive'])],

            // details (arrays from repeater)
            'plate_number' => ['nullable','array'],
            'plate_number.*' => ['nullable','string','max:255'],
            'or_number' => ['nullable','array'],
            'or_number.*' => ['nullable','string','max:255'],
            'cr_number' => ['nullable','array'],
            'cr_number.*' => ['nullable','string','max:255'],
            'vehicle_model' => ['nullable','array'],
            'vehicle_model.*' => ['nullable','string','max:255'],
            'color' => ['nullable','array'],
            'color.*' => ['nullable','string','max:255'],
            'sticker_control_number' => ['nullable','array'],
            'sticker_control_number.*' => ['nullable','string','max:255'],
        ]);

        // Ensure one of user_id or non_homeowners is present
        if (empty($validated['user_id']) && empty($validated['non_homeowners'])) {
            return response()->json(['message' => 'Please select an owner or provide non-homeowner name.'], 422);
        }

        $vm = VehicleManagement::create([
            'user_id' => $validated['user_id'] ?? null,
            'non_homeowners' => $validated['non_homeowners'] ?? null,
            'type_of_vehicle' => $validated['type_of_vehicle'],
            'incase_of_emergency_name' => $request->input('incase_of_emergency_name'),
            'incase_of_emergency_number' => $request->input('incase_of_emergency_number'),
            'status' => $validated['status'],
        ]);

        $plates = $request->input('plate_number', []);
        $ors = $request->input('or_number', []);
        $crs = $request->input('cr_number', []);
        $models = $request->input('vehicle_model', []);
        $colors = $request->input('color', []);
        $stickers = $request->input('sticker_control_number', []);

        $max = max(
            count((array)$plates),
            count((array)$ors),
            count((array)$crs),
            count((array)$models),
            count((array)$colors),
            count((array)$stickers)
        );

        for ($i = 0; $i < $max; $i++) {
            $row = [
                'plate_number' => $plates[$i] ?? null,
                'or_number' => $ors[$i] ?? null,
                'cr_number' => $crs[$i] ?? null,
                'vehicle_model' => $models[$i] ?? null,
                'color' => $colors[$i] ?? null,
                'sticker_control_number' => $stickers[$i] ?? null,
            ];
            // skip completely empty rows
            if (!array_filter($row)) {
                continue;
            }
            VehicleDetail::create(array_merge($row, [
                'vehicle_management_id' => $vm->id,
                'status' => 'active',
            ]));
        }

        return response()->json(['message' => 'Vehicle saved', 'id' => $vm->id], 201);
    }

    public function update(Request $request, VehicleManagement $vehicle)
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'non_homeowners' => ['nullable','string','max:255'],
            'type_of_vehicle' => ['required', 'string', 'max:255'],
            'incase_of_emergency_name' => ['nullable', 'string', 'max:255'],
            'incase_of_emergency_number' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['active','inactive'])],

            'plate_number' => ['nullable','array'],
            'plate_number.*' => ['nullable','string','max:255'],
            'or_number' => ['nullable','array'],
            'or_number.*' => ['nullable','string','max:255'],
            'cr_number' => ['nullable','array'],
            'cr_number.*' => ['nullable','string','max:255'],
            'vehicle_model' => ['nullable','array'],
            'vehicle_model.*' => ['nullable','string','max:255'],
            'color' => ['nullable','array'],
            'color.*' => ['nullable','string','max:255'],
            'sticker_control_number' => ['nullable','array'],
            'sticker_control_number.*' => ['nullable','string','max:255'],
        ]);

        if (empty($validated['user_id']) && empty($validated['non_homeowners'])) {
            return response()->json(['message' => 'Please select an owner or provide non-homeowner name.'], 422);
        }

        $vehicle->update([
            'user_id' => $validated['user_id'] ?? null,
            'non_homeowners' => $validated['non_homeowners'] ?? null,
            'type_of_vehicle' => $validated['type_of_vehicle'],
            'incase_of_emergency_name' => $request->input('incase_of_emergency_name'),
            'incase_of_emergency_number' => $request->input('incase_of_emergency_number'),
            'status' => $validated['status'],
        ]);

        // Replace details with submitted rows
        VehicleDetail::where('vehicle_management_id', $vehicle->id)->delete();
        $plates = $request->input('plate_number', []);
        $ors = $request->input('or_number', []);
        $crs = $request->input('cr_number', []);
        $models = $request->input('vehicle_model', []);
        $colors = $request->input('color', []);
        $stickers = $request->input('sticker_control_number', []);
        $max = max(
            count((array)$plates),
            count((array)$ors),
            count((array)$crs),
            count((array)$models),
            count((array)$colors),
            count((array)$stickers)
        );
        for ($i = 0; $i < $max; $i++) {
            $row = [
                'plate_number' => $plates[$i] ?? null,
                'or_number' => $ors[$i] ?? null,
                'cr_number' => $crs[$i] ?? null,
                'vehicle_model' => $models[$i] ?? null,
                'color' => $colors[$i] ?? null,
                'sticker_control_number' => $stickers[$i] ?? null,
            ];
            if (!array_filter($row)) { continue; }
            VehicleDetail::create(array_merge($row, [
                'vehicle_management_id' => $vehicle->id,
                'status' => 'active',
            ]));
        }

        return response()->json(['message' => 'Vehicle updated']);
    }

    public function destroy(VehicleManagement $vehicle)
    {
        VehicleDetail::where('vehicle_management_id', $vehicle->id)->delete();
        $vehicle->delete();
        return response()->json(['message' => 'Vehicle deleted']);
    }
}
