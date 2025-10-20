<?php

namespace App\Http\Controllers\appointment_category;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\appointment_category;
use Illuminate\Support\Facades\Validator;

class AppointmentCategoryController extends Controller
{
    public function index()
    {
        $categories = appointment_category::orderBy('created_at', 'desc')->paginate(10);
        $statuses = appointment_category::distinct()->pluck('status')->filter()->values();
        
        return view('appointment_category.appointment_category', compact('categories', 'statuses'));
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_name' => 'required|string|max:255|unique:appointment_category,category_name',
            'status' => 'required|in:Active,Inactive'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        try {
            $category = appointment_category::create([
                'category_name' => $request->category_name,
                'status' => $request->status
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Category created successfully',
                'data' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create category: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function show($id)
    {
        try {
            $category = appointment_category::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }
    }
    
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'category_name' => 'required|string|max:255|unique:appointment_category,category_name,' . $id,
            'status' => 'required|in:Active,Inactive'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        try {
            $category = appointment_category::findOrFail($id);
            $category->update([
                'category_name' => $request->category_name,
                'status' => $request->status
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully',
                'data' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update category: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function destroy($id)
    {
        try {
            $category = appointment_category::findOrFail($id);
            $category->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete category: ' . $e->getMessage()
            ], 500);
        }
    }
}
