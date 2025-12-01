<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GoldCalculatorController extends Controller
{
    /**
     * Calculate gold profit based on monthly savings.
     */
    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'monthly_amount' => 'required|numeric|min:1',
            'months' => 'nullable|integer|min:1|max:120',
        ]);

        $monthlyAmount = $validated['monthly_amount'];
        $months = $validated['months'] ?? 12;
        
        // Fixed prices (can be made configurable later)
        $minPrice = 35.51; // OMR per gram
        $maxPrice = 48.92; // OMR per gram
        
        // Total investment
        $totalInvestment = $monthlyAmount * $months;
        
        // Gold purchased at minimum price
        $goldGrams = $totalInvestment / $minPrice;
        
        // Value if sold at maximum price
        $currentValue = $goldGrams * $maxPrice;
        
        // Profit
        $profit = $currentValue - $totalInvestment;
        $profitPercentage = ($profit / $totalInvestment) * 100;

        return response()->json([
            'success' => true,
            'data' => [
                'monthly_amount' => round($monthlyAmount, 2),
                'months' => $months,
                'total_investment' => round($totalInvestment, 2),
                'gold_grams' => round($goldGrams, 3),
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
                'current_value' => round($currentValue, 2),
                'profit' => round($profit, 2),
                'profit_percentage' => round($profitPercentage, 2),
            ],
        ]);
    }
}

