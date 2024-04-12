<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\Common;
use App\Http\Controllers\Controller;
use App\Http\Requests\QueryRequest;
use App\Http\Requests\Arena\StoreArenaRequest;
use App\Http\Requests\Arena\UpdateArenaRequest;
use App\Models\Arena;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ArenaController extends Controller
{
    public function index(QueryRequest $request)
    {
        $with = $request->input('with', []);
        $filterBy = $request->input('filter', null);
        $value = $request->input('value', null);
        $condition = $request->input('condition', null);
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 0);
        $sort = $request->input('sort', 'created_at');
        $order = $request->input('order', 'desc');

        $query = Arena::query();
        if ($filterBy && $value) {
            $query->where($filterBy, $condition ?? '=', $value);
        }

        if (!empty($with)) {
            $query->with($with);
        }

        $query->orderBy($sort, $order);
        $arenas = $perPage == 0 ? $query->get() : $query->paginate($perPage, ['*'], 'page', $page);

        return Common::response(200, 'Lấy danh sách phòng thi thành công', $arenas);
    }

    public function store(StoreArenaRequest $request)
    {
        $data = $request->validated();
        if (count($data['questions']) != $data['question_count']) {
            return Common::response(400, "Số câu hỏi đã nhập không đúng với số lượng câu hỏi.");
        }
        $data['author'] = Auth::id();
        $data['questions'] = implode(',', $data['questions']);
        // return response()->json($data);
        $arena = Arena::create($data);

        return $arena
            ? Common::response(201, "Tạo phòng thi mới thành công.", $arena)
            : Common::response(400, "Có lỗi xảy ra, vui lòng thử lại.");
    }

    public function update(int $id, UpdateArenaRequest $request)
    {
        $arena = Arena::find($id);

        if (!$arena) {
            return Common::response(404, "Không tìm thấy phòng thi.");
        }

        $validatedData = $request->validated();
        Arena::where('id', $id)->update($validatedData);

        return Common::response(200, "Cập nhật phòng thi thành công", $arena);
    }

    public function destroy(int $id)
    {
        try {
            Arena::destroy($id);
            return Common::response(200, "Xóa phòng thi thành công.");
        } catch (\Throwable $th) {
            return Common::response(400, "Có lỗi xảy ra, vui lòng thử lại.");
        }
    }

    public function detail(int $id)
    {
        $arena = Arena::find($id);
        if ($arena) {
            $arena['question_list'] = $arena->questions();
            return Common::response(200, "Lấy thông tin phòng thi thành công.", $arena);
        }

        return Common::response(404, "Không tìm thấy phòng thi này.");
    }
}
