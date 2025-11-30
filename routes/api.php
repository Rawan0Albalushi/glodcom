<?php

use App\Http\Controllers\InterestController;
use App\Http\Controllers\GoldCalculatorController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/interests', [InterestController::class, 'store']);
Route::get('/interests/count', [InterestController::class, 'count']);
Route::post('/gold/calculate', [GoldCalculatorController::class, 'calculate']);

