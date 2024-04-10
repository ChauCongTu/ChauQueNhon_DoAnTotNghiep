<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\Common;
use App\Http\Controllers\Controller;
use App\Http\Requests\QueryRequest;
use App\Http\Requests\Question\StoreQuestionRequest;
use App\Http\Requests\Question\UpdateQuestionRequest;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class QuestionController extends Controller
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

        $query = Question::query();
        if ($filterBy && $value) {
            $query->where($filterBy, $condition ?? '=', $value);
        }

        if (!empty($with)) {
            $query->with($with);
        }

        $query->orderBy($sort, $order);
        $questions = $perPage == 0 ? $query->get() : $query->paginate($perPage, ['*'], 'page', $page);

        return Common::response(200, 'Lấy danh sách câu hỏi thành công', $questions);
    }

    public function store(StoreQuestionRequest $request)
    {
        $validatedData = $request->validated();
        $question = Question::create($validatedData);

        return $question
            ? Common::response(201, "Tạo câu hỏi mới thành công.", $question)
            : Common::response(400, "Có lỗi xảy ra, vui lòng thử lại.");
    }

    public function update(int $id, UpdateQuestionRequest $request)
    {
        $question = Question::find($id);

        if (!$question) {
            return Common::response(404, "Không tìm thấy câu hỏi.");
        }

        $validatedData = $request->validated();
        Question::where('id', $id)->update($validatedData);

        return Common::response(200, "Cập nhật câu hỏi thành công", $question);
    }

    public function destroy(int $id)
    {
        try {
            Question::destroy($id);
            return Common::response(200, "Xóa câu hỏi thành công.");
        } catch (\Throwable $th) {
            return Common::response(400, "Có lỗi xảy ra, vui lòng thử lại.");
        }
    }

    public function detail(int $id)
    {
        $question = Question::find($id);

        return $question
            ? Common::response(200, "Lấy thông tin câu hỏi thành công.", $question)
            : Common::response(404, "Không tìm thấy câu hỏi này.");
    }
}
