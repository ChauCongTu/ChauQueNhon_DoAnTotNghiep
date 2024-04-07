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
    /**
     * Get a list of users.
     *
     * This function retrieves a list of users based on the provided request parameters.
     *
     * @param Request $request The HTTP request object containing any parameters for filtering the user list.
     *   - $request->input('page'): (int) The page number for paginated results.
     *   - $request->input('perPage'): (int) The maximum number of users to retrieve per page.
     *   - $request->input('sort'): (string) The field to sort the results by.
     *   - $request->input('order'): (string) The order in which to sort the results ('asc' or 'desc').
     *
     * @return \Illuminate\Http\JsonResponse Returns a JSON response containing the list of users.
     */
    public function list(Request $request)
    {
        // Retrieve request parameters
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $sort = $request->input('sort', 'id');
        $order = $request->input('order', 'asc');

        // Query users
        $users = User::orderBy($sort, $order)->paginate($perPage, ['*'], 'page', $page);

        return Common::response(200, 'Lấy danh sách người dùng thành công', $users);
    }
    public function index(string $username = null)
    {
        $user = User::where('username', $username)->first();
        if ($user) {
            return Common::response(200, 'Lấy thông tin người dùng thành công.', $user);
        }
        return Common::response(404, 'Không tìm thấy người dùng có username là ' . $username);
    }
}
