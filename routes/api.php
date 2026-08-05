<?php

use App\Http\Controllers\Api\CategoryApiController;
use App\Http\Controllers\Api\CollectionApiController;
use Illuminate\Support\Facades\Route;

Route::get('/categories/recent', [CategoryApiController::class, 'recent']);
Route::get('/collections', [CollectionApiController::class, 'index']);
