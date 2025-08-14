<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
// use App\Http\Controllers\PageController;
use App\Http\Controllers\DarkModeController;
use App\Http\Controllers\ColorSchemeController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\LangController;
use App\Http\Controllers\usermanagement\UserManagamentController;
use App\Http\Controllers\businessmanagement\BusinessManagementController;
use App\Http\Controllers\vehiclemanagement\VehicleManagementController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// Language switcher routes
Route::get('index/{locale}', [LangController::class, 'lang']);
Route::get('index', [LangController::class, 'lang']); // Handle missing locale

// Utility routes
Route::get('dark-mode-switcher', [DarkModeController::class, 'switch'])->name('dark-mode-switcher');
Route::get('color-scheme-switcher/{color_scheme}', [ColorSchemeController::class, 'switch'])->name('color-scheme-switcher');

// Authentication routes
Route::controller(AuthController::class)->middleware('loggedin')->group(function() {
    Route::get('login', 'loginView')->name('login.index');
    Route::post('login', 'login')->name('login.check');
});

// Root redirect
Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/dashboard');
    }
    return redirect('/login');
});

// Protected routes
Route::middleware('auth')->group(function() {
    Route::get('logout', [AuthController::class, 'logout'])->name('logout');
    
    // Dashboard route (specific route before wildcard)
    Route::get('dashboard', [RouteController::class, 'index'])->name('dashboard');
        
    // // Named route for menu system
    // Route::get("{page}", [RouteController::class, 'routes'])->name('page.show')->where('page', '.*');
});

// User Management routes
Route::get('user-management', [UserManagamentController::class, 'index'])->name('usermanagement.index');
Route::get('user-management/create', [UserManagamentController::class, 'create'])->name('usermanagement.create');
Route::post('user-management', [UserManagamentController::class, 'store'])->name('usermanagement.store');
Route::get('user-management/{user}', [UserManagamentController::class, 'show'])->name('usermanagement.show');
Route::get('user-management/{user}/edit', [UserManagamentController::class, 'edit'])->name('usermanagement.edit');
Route::put('user-management/{user}', [UserManagamentController::class, 'update'])->name('usermanagement.update');
Route::delete('user-management/{user}', [UserManagamentController::class, 'destroy'])->name('usermanagement.destroy');

// Business Management routes
Route::get('business-management', [BusinessManagementController::class, 'index'])->name('businessmanagement.index');
Route::get('business-management/create', [BusinessManagementController::class, 'create'])->name('businessmanagement.create');
Route::post('business-management', [BusinessManagementController::class, 'store'])->name('businessmanagement.store');
Route::get('business-management/{business}', [BusinessManagementController::class, 'show'])->name('businessmanagement.show');
Route::get('business-management/{business}/edit', [BusinessManagementController::class, 'edit'])->name('businessmanagement.edit');
Route::put('business-management/{business}', [BusinessManagementController::class, 'update'])->name('businessmanagement.update');
Route::delete('business-management/{business}', [BusinessManagementController::class, 'destroy'])->name('businessmanagement.destroy');

// Vehicle Management routes
Route::get('vehicle-management', [VehicleManagementController::class, 'index'])->name('vehiclemanagement.index');
Route::get('vehicle-management/create', [VehicleManagementController::class, 'create'])->name('vehiclemanagement.create');
Route::post('vehicle-management', [VehicleManagementController::class, 'store'])->name('vehiclemanagement.store');
Route::get('vehicle-management/{vehicle}', [VehicleManagementController::class, 'show'])->name('vehiclemanagement.show');
Route::get('vehicle-management/{vehicle}/edit', [VehicleManagementController::class, 'edit'])->name('vehiclemanagement.edit');
Route::put('vehicle-management/{vehicle}', [VehicleManagementController::class, 'update'])->name('vehiclemanagement.update');
Route::delete('vehicle-management/{vehicle}', [VehicleManagementController::class, 'destroy'])->name('vehiclemanagement.destroy');

