<?php

use App\Helpers\Common;
use App\Models\History;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;

Route::get('/', function () {
    $message = 'Bạn không có quyền truy cập vào nguồn dữ liệu đã yêu cầu.';
    return Common::response(403, $message);
});
Route::get('/response-403', function () {
    $message = 'Bạn không có quyền truy cập vào nguồn dữ liệu đã yêu cầu.';
    return Common::response(403, $message);
})->name('login');

Route::get('/403', function () {
    return Response::HTTP_FORBIDDEN;
})->name('403');

Route::get('/demo', function () {
    $users = User::get();
    foreach ($users as $user) {
        $histories = History::todayByUser($user->id)->get();
        foreach ($histories as $history) {
            $history['result'] = json_decode($history['result']);
        }
        dd($histories);
    }

});
