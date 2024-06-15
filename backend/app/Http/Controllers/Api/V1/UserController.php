<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\Common;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function ban()
    {
        return Common::response(200, "Tính năng chưa cần thiết! ^^");
    }

    public function assignRoles(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'roles' => 'required|array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $roles = $request->input('roles');
        $user->syncRoles($roles);

        $user['role'] = $user->getRoleNames();

        return Common::response(200, 'Phân quyền người dùng thành công.', $user);
    }
    public function destroy()
    {
        return Common::response(200, "Tính năng chưa cần thiết! ^^");
    }
}
