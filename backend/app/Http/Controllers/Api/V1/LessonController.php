<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\Common;
use App\Http\Controllers\Controller;
use App\Http\Requests\Lesson\StoreLessonRequest;
use App\Http\Requests\Lesson\UpdateLessonRequest;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class LessonController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $sort = $request->input('sort', 'created_at');
        $order = $request->input('order', 'desc');

        $lessons = Lesson::orderBy($sort, $order)->paginate($perPage, ['*'], 'page', $page);
        foreach ($lessons as $lesson) {
            $lesson['like_list'] = $lesson->likeLists();
        }
        return Common::response(200, 'Lấy danh sách bài học thành công', $lessons);
    }

    public function store(StoreLessonRequest $request)
    {
        $newLesson = $request->validated();
        $newLesson['slug'] = Str::slug($newLesson['name']);
        $lesson = Lesson::create($newLesson);

        if ($lesson) {
            return Common::response(201, "Tạo bài học mới thành công.", $lesson);
        }

        return Common::response(404, "Có lỗi xảy ra, vui lòng thử lại.");
    }

    public function handleLike(int $id)
    {
        $user_id = Auth::id();
        $lesson = Lesson::find($id);
        if ($lesson) {
            $likeList = explode(',', $lesson->likes);
            if (in_array($user_id, $likeList)) {
                $likeList = array_diff($likeList, array($user_id));
                $lesson->likes = implode(',', $likeList);
                $lesson->save();
                return Common::response(200, "Bỏ thích bài viết thành công.", $lesson->likeLists(), null, 'like', false);
            }
            $likeList[] = $user_id;
            $lesson->likes = implode(',', $likeList);
            $lesson->save();
            return Common::response(200, "Thích bài viết thành công.", $lesson->likeLists(), null, 'like', true);
        }
        return Common::response(404, "Có lỗi xảy ra, vui lòng thử lại.");
    }

    public function update(int $id, UpdateLessonRequest $request)
    {
        $lesson = Lesson::find($id);

        if (!$lesson) {
            return Common::response(404, "Không tìm thấy bài học.");
        }

        $lessonData = $request->validated();

        if (Lesson::where('name', $lessonData['name'])->where('id', '!=', $id)->doesntExist()) {
            $lesson->name = $lessonData['name'];
            $lesson->slug = Str::slug($lessonData['name']);
            $lesson->content = $lessonData['content'];
            $lesson->save();

            return Common::response(200, "Cập nhật bài học thành công", $lesson);
        }

        return Common::response(400, "Có lỗi xảy ra, vui lòng thử lại.");
    }

    public function destroy(int $id)
    {
        try {
            Lesson::destroy($id);
        } catch (\Throwable $th) {
            return Common::response(400, "Có lỗi xảy ra, vui lòng thử lại.");
        }

        return Common::response(200, "Xóa bài học thành công.");
    }

    public function detail(string $slug)
    {
        $lesson = Lesson::where('slug', $slug)->first();

        if ($lesson) {
            return Common::response(200, "Lấy thông tin bài học thành công.", $lesson);
        }

        return Common::response(404, "Không tìm thấy bài học này.");
    }
}
