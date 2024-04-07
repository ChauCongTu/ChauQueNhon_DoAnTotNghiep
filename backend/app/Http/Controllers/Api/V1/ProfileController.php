<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\Common;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangeAvatarRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class ProfileController extends Controller
{
    public function update(UpdateProfileRequest $request)
    {
        $user_id = Auth::id();
        User::where('id', $user_id)->update($request->validated());
        $user = User::find(1);
        return Common::response(200, "Thành công", $user);
    }

    public function avatar(ChangeAvatarRequest $request)
    {
        $id = Auth::id();
        $user = User::find($id);

        $avatar = $request->file('avatar');
        $avatarName = $id . '.' . $avatar->getClientOriginalExtension();
        $avatarPath = 'public/avatar/' . $avatarName;

        $existingAvatarPath = $user->avatar;
        if ($existingAvatarPath) {
            Storage::delete(str_replace(env('APP_URL') . '/storage/', 'public/', $existingAvatarPath));
        }

        // Lưu ảnh mới vào thư mục storage
        Storage::putFileAs('public/avatar/', $avatar, $avatarName);

        $user->avatar = env('APP_URL') . '/storage/avatar/' . $avatarName;
        $user->save();

        // Trả về response thành công
        return Common::response(200, 'Avatar changed successfully', ['avatar' => $user->avatar]);
    }
}
