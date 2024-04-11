<?php

use App\Helpers\Common;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ChapterController;
use App\Http\Controllers\Api\V1\LessonController;
use App\Http\Controllers\Api\V1\PracticeController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\QuestionController;
use App\Http\Controllers\Api\V1\SubjectController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/set-role', function () {
    return User::first()->assignRole('super admin');
});


Route::get('/get-token', function () {
    $token = User::first()->createToken('AccessToken')->accessToken;
    return Common::response(200, 'Lấy token mới thành công.', null, null, 'access_token', $token);
});

Route::get('/demo', function () {
    return User::first()->getAllPermissions();
})->middleware('auth:api');

Route::get('/profile', function () {
    return Common::response(
        200,
        'Lấy thông tin người dùng thành công.',
        Auth::user()
    );
})->middleware(['auth:api', 'can:create subject']);

Route::prefix('/v1')->group(function () {
    // Auth Routing
    Route::post('/sign-up', [AuthController::class, 'signUp'])->name('sign_up');
    Route::post('/sign-in', [AuthController::class, 'signIn'])->name('sign_in');
    Route::get('/google-sign-in', [AuthController::class, 'googleSignIn'])->name('google_sign_in');
    Route::get('/google-callback', [AuthController::class, 'handleGoogleSignIn'])->name('handle_google_sign_in');
    Route::post('/forgot', [AuthController::class, 'forgot'])->name('forgot');
    Route::post('/reset', [AuthController::class, 'reset'])->name('reset');

    // Profile Routing
    Route::prefix('/profiles')->name('profiles.')->group(function () {
        Route::post('/update', [ProfileController::class, 'update'])->middleware('auth:api')->name('update');
        Route::post('/avatar', [ProfileController::class, 'avatar'])->middleware('auth:api')->name('avatar');
        Route::get('/list', [ProfileController::class, 'list'])->middleware('auth:api')->name('list');
        Route::get('/{username}', [ProfileController::class, 'index'])->middleware('auth:api')->name('index');
    });

    // Subject Routing
    Route::prefix('/subjects')->name('subjects.')->group(function () {
        Route::get('/', [SubjectController::class, 'index'])->middleware(['auth:api'])->name('index');
        Route::post('/', [SubjectController::class, 'store'])->middleware(['auth:api'])->name('store');
        Route::put('/{id}', [SubjectController::class, 'update'])->middleware(['auth:api'])->name('update');
        Route::delete('/{id}', [SubjectController::class, 'destroy'])->middleware(['auth:api'])->name('destroy');
        Route::get('/{id}', [SubjectController::class, 'detail'])->middleware(['auth:api'])->name('detail');
    });

    // Chapter Routing
    Route::prefix('/chapters')->name('chapters.')->group(function () {
        Route::get('/', [ChapterController::class, 'index'])->middleware(['auth:api'])->name('index');
        Route::post('/', [ChapterController::class, 'store'])->middleware(['auth:api'])->name('store');
        Route::put('/{id}', [ChapterController::class, 'update'])->middleware(['auth:api'])->name('update');
        Route::delete('/{id}', [ChapterController::class, 'destroy'])->middleware(['auth:api'])->name('destroy');
        Route::get('/{slug}', [ChapterController::class, 'detail'])->middleware(['auth:api'])->name('detail');
    });

    // Lesson Routing
    Route::prefix('/lessons')->name('lessons.')->group(function(){
        Route::get('/', [LessonController::class, 'index'])->middleware(['auth:api'])->name('index');
        Route::post('/', [LessonController::class, 'store'])->middleware(['auth:api'])->name('store');
        Route::post('/{id}/like', [LessonController::class, 'handleLike'])->middleware(['auth:api'])->name('handle_like');
        Route::put('/{id}', [LessonController::class, 'update'])->middleware(['auth:api'])->name('update');
        Route::delete('/{id}', [LessonController::class, 'destroy'])->middleware(['auth:api'])->name('destroy');
        Route::get('/{slug}', [LessonController::class, 'detail'])->middleware(['auth:api'])->name('detail');
    });

    Route::prefix('/questions')->name('questions.')->group(function(){
        Route::get('/', [QuestionController::class, 'index'])->middleware(['auth:api'])->name('index');
        Route::post('/', [QuestionController::class, 'store'])->middleware(['auth:api'])->name('store');
        Route::put('/{id}', [QuestionController::class, 'update'])->middleware(['auth:api'])->name('update');
        Route::delete('/{id}', [QuestionController::class, 'destroy'])->middleware(['auth:api'])->name('destroy');
        Route::get('/{slug}', [QuestionController::class, 'detail'])->middleware(['auth:api'])->name('detail');
    });
    Route::prefix('practices')->name('practices.')->group(function () {
        Route::get('/', [PracticeController::class, 'index'])->name('index');
        Route::post('/', [PracticeController::class, 'store'])->name('store');
        Route::put('/{id}', [PracticeController::class, 'update'])->name('update');
        Route::delete('/{id}', [PracticeController::class, 'destroy'])->name('destroy');
        Route::get('/{id}', [PracticeController::class, 'detail'])->name('detail');
    });

})->name('api_v1.');
