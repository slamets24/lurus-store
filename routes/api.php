<?php

use App\Http\Controllers\Api\CategoryApiController;
use App\Http\Controllers\Api\CollectionApiController;
use App\Http\Controllers\Api\N8nProductController;
use Illuminate\Support\Facades\Route;

Route::get('/categories/recent', [CategoryApiController::class, 'recent']);
Route::get('/collections', [CollectionApiController::class, 'index']);

Route::prefix('n8n')->group(function () {
    Route::get('/products/ready-to-post', [N8nProductController::class, 'getReadyToPost']);
    Route::post('/products/{id}/mark-posted', [N8nProductController::class, 'markPosted']);
});
