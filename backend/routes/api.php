<?php

use App\Helpers\Common;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/set-role', function (){
    return User::first()->assignRole('super admin');
});


Route::get('/get-token', function() {
    $token = User::first()->createToken('AccessToken')->accessToken;
    return Common::response(200, 'Lấy token mới thành công.', null, null, 'access_token', $token);
});

Route::get('/demo', function () {
    return User::first()->getAllPermissions();
})->middleware('auth:api');

Route::get('/profile', function(){
    return Common::response(
        200,
        'Lấy thông tin người dùng thành công.',
        Auth::user()
    );
})->middleware(['auth:api', 'can:create subject']);

Route::prefix('/v1')->group(function(){
    // Auth Routing
    Route::post('/sign-up', [AuthController::class, 'signUp'])->name('sign_up');
    Route::post('/sign-in', [AuthController::class, 'signIn'])->name('sign_in');
    Route::get('/google-sign-in', [AuthController::class, 'googleSignIn'])->name('google_sign_in');
    Route::get('/google-callback', [AuthController::class, 'handleGoogleSignIn'])->name('handle_google_sign_in');
    Route::post('/forgot', [AuthController::class, 'forgot'])->name('forgot');
    Route::post('/reset', [AuthController::class, 'reset'])->name('reset');

    // Profile Routing
    Route::prefix('/profile')->name('/profile.')->group(function(){
        Route::post('/update', [ProfileController::class, 'update'])->middleware('auth:api')->name('update');
        Route::post('/avatar', [ProfileController::class, 'avatar'])->middleware('auth:api')->name('avatar');
        Route::get('/list', [ProfileController::class, 'list'])->middleware('auth:api')->name('list');
        Route::get('/{username}', [ProfileController::class, 'index'])->middleware('auth:api')->name('index');
    });
})->name('api_v1.');
