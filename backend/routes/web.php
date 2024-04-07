<?php

use App\Helpers\Common;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/response-403', function(){
    $message = 'Bạn không có quyền truy cập vào nguồn dữ liệu đã yêu cầu.';
    return Common::response(403, $message);
})->name('login');
