<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Interest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Show admin login page
     */
    public function showLogin(): Response
    {
        if (session('admin_authenticated')) {
            return Inertia::render('Admin/Dashboard');
        }
        
        return Inertia::render('Admin/Login');
    }

    /**
     * Handle admin login
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('username', $validated['username'])->first();
        
        if ($admin && $admin->verifyPassword($validated['password'])) {
            session([
                'admin_authenticated' => true,
                'admin_id' => $admin->id,
                'admin_name' => $admin->name,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials',
        ], 401);
    }

    /**
     * Handle admin logout
     */
    public function logout(): JsonResponse
    {
        session()->forget(['admin_authenticated', 'admin_id', 'admin_name']);
        
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Show dashboard with registered users
     */
    public function dashboard(): Response
    {
        $interests = Interest::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Admin/Dashboard', [
            'interests' => $interests,
            'adminName' => session('admin_name'),
        ]);
    }

    /**
     * Show draw page
     */
    public function draw(): Response
    {
        $interests = Interest::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Admin/Draw', [
            'interests' => $interests,
            'adminName' => session('admin_name'),
        ]);
    }

    /**
     * Get all registered interests (API)
     */
    public function getInterests(): JsonResponse
    {
        $interests = Interest::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $interests,
        ]);
    }

    /**
     * Perform random draw
     */
    public function performDraw(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'count' => 'required|integer|min:1|max:100',
            'governorate' => 'nullable|string',
        ]);

        $query = Interest::query();
        
        if (!empty($validated['governorate'])) {
            $query->where('governorate', $validated['governorate']);
        }

        $availableCount = $query->count();
        $drawCount = min($validated['count'], $availableCount);

        $winners = $query->inRandomOrder()
                         ->limit($drawCount)
                         ->get();

        return response()->json([
            'success' => true,
            'winners' => $winners,
            'total_available' => $availableCount,
            'draw_count' => $drawCount,
        ]);
    }
}
