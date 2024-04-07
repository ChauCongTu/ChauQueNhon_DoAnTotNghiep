<?php

use App\Helpers\Common;
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
})->middleware(['auth:api', 'can:create subje']);
