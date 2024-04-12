<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\Common;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTargetRequest;
use App\Http\Requests\UpdateTargetRequest;
use Illuminate\Http\Request;
use App\Models\UserTarget;
use Illuminate\Support\Facades\Auth;

class TargetController extends Controller
{
    public function store(StoreTargetRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['user_id'] = Auth::id();

        $target = UserTarget::create($validatedData);

        return $target ?
            Common::response(201, "Tạo mục tiêu mới thành công.", $target) :
            Common::response(400, "Có lỗi xảy ra, vui lòng thử lại.");
    }

    public function update(UpdateTargetRequest $request, int $id)
    {
        $validatedData = $request->validated();
        $validatedData['user_id'] = Auth::id();

        $target = UserTarget::find($id);

        if (!$target) {
            return Common::response(404, "Không tìm thấy mục tiêu.");
        }

        $target->update($validatedData);

        return Common::response(200, "Cập nhật mục tiêu thành công", $target);
    }

    public function destroy(int $id)
    {
        $target = UserTarget::find($id);

        if (!$target) {
            return Common::response(404, "Không tìm thấy mục tiêu.");
        }

        $target->delete();

        return Common::response(200, "Xóa mục tiêu thành công.");
    }
}
