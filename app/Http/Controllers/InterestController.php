<?php

namespace App\Http\Controllers;

use App\Models\Interest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class InterestController extends Controller
{
    /**
     * Store a new interest registration.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'email' => 'required|email|max:255',
                'governorate' => 'required|string|max:100',
                'wilaya' => 'required|string|max:100',
                'monthly_amount' => 'required|numeric|min:1',
                'referral_code' => 'nullable|string|max:50',
            ]);

            $interest = Interest::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Interest registered successfully',
                'data' => $interest,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Get the count of registered interests.
     */
    public function count(): JsonResponse
    {
        $count = Interest::count();

        return response()->json([
            'success' => true,
            'count' => $count,
        ]);
    }
}

