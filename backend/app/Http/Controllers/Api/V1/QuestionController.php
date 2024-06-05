<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\Common;
use App\Http\Controllers\Controller;
use App\Http\Requests\GetQuestionsRequest;
use App\Http\Requests\QueryRequest;
use App\Http\Requests\Question\StoreQuestionRequest;
use App\Http\Requests\Question\UpdateQuestionRequest;
use App\Models\Arena;
use App\Models\Exam;
use App\Models\Practice;
use App\Models\Question;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class QuestionController extends Controller
{
    public function index(QueryRequest $request)
    {
        $with = $request->input('with', []);
        $filterBy = $request->input('filterBy', null);
        $value = $request->input('value', null);
        $condition = $request->input('condition', null);
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 0);
        $sort = $request->input('sort', 'created_at');
        $order = $request->input('order', 'desc');
        $q = $request->input('q', null);
        $grade = $request->input('grade', null);
        $subject = $request->input('subject', null);
        $chapter = $request->input('chapter', null);
        $myquestion = $request->input('myquestion', false);

        $query = Question::query();
        if ($filterBy && $value) {
            $query->where($filterBy, $condition ?? '=', $value);
        }

        if (!empty($with)) {
            $query->with($with);
        }

        if (!empty($grade)) {
            $query->where('grade', $grade);
        }
        if (!empty($subject)) {
            $query->where('subject_id', $subject);
        }
        if (!empty($chapter)) {
            $query->where('chapter_id', $chapter);
        }
        if ($myquestion) {
            $query->where('created_by', Auth::id());
        }

        if (!empty($q)) {
            $query->where(function ($subQuery) use ($q) {
                $subQuery->where('id', $q)
                    ->orWhere('question', 'LIKE', '%' . $q . '%');
            });
        }


        $query->orderBy($sort, $order);
        $questions = $perPage == 0 ? $query->get() : $query->paginate($perPage, ['*'], 'page', $page);
        foreach ($questions as $value) {
            $value['subject'] = Subject::find($value['subject_id']);
            $value['chapter'] = Subject::find($value['chapter_id']);
        }
        return Common::response(200, 'Lấy danh sách câu hỏi thành công', $questions);
    }

    public function getQuestions(GetQuestionsRequest $request)
    {
        $numb = $request->input('numb');
        $subject_id = $request->input('subject', null);
        $chapter_id = $request->input('chapter', null);
        $grade = $request->input('grade');
        $level = $request->input('level');
        $data = $request->input('data');

        $query = Question::query();

        if ($chapter_id) {
            if ($chapter_id == 0) {
                $query->where("chapter_id", null);
            }
            else {
                $query->where("chapter_id", $chapter_id);
            }
        }
        else if ($subject_id){
            $query->where("subject_id", $subject_id);
        }

        // if (!is_null($chapter_id)) {
        //     $query->where('chapter_id', $chapter_id);
        // } else {
        //     if (!is_null($grade)) {
        //         if (!is_null($subject_id)) {
        //             $query->where('subject_id', $subject_id);
        //         } else {
        //             $query->where('grade', $grade);
        //         }
        //     }
        // }


        if (!is_null($level)) {
            $query->where('level', $level);
        }

        if ($data) {
            $query->whereNotIn('id', $data);
        }

        $additionalQuestions = $query->inRandomOrder()
            ->limit(max(0, $numb))
            ->get();

        return Common::response(200, 'Lấy danh sách câu hỏi thành công.', $additionalQuestions);
    }



    public function store(StoreQuestionRequest $request)
    {
        $validatedData = $request->validated();
        $question = Question::create($validatedData);

        $question['subject'] = Subject::find($question['subject_id']);
        $question['chapter'] = Subject::find($question['chapter_id']);

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
            // DB::beginTransaction();
            Practice::select('id', 'questions', 'question_count')->chunk(100, function ($practices) use ($id) {
                foreach ($practices as $practice) {
                    $questions = explode(',', $practice->questions);
                    if (in_array($id, $questions)) {
                        $questions = array_diff($questions, array($id));
                        $practice->questions = implode(',', $questions);
                        $practice->question_count = count($questions);
                        $practice->save();
                    }
                }
            });

            Exam::select('id', 'questions', 'question_count')->chunk(100, function ($exams) use ($id) {
                foreach ($exams as $exam) {
                    $questions = explode(',', $exam->questions);
                    if (in_array($id, $questions)) {
                        $questions = array_diff($questions, array($id));
                        $exam->questions = implode(',', $questions);
                        $exam->question_count = count($questions);
                        $exam->save();
                    }
                }
            });

            Arena::select('id', 'questions', 'question_count')->chunk(100, function ($arenas) use ($id) {
                foreach ($arenas as $arena) {
                    $questions = explode(',', $arena->questions);
                    if (in_array($id, $questions)) {
                        $questions = array_diff($questions, array($id));
                        $arena->questions = implode(',', $questions);
                        $arena->question_count = count($questions);
                        $arena->save();
                    }
                }
            });
            Question::destroy($id);
            // DB::commit();
            return Common::response(200, "Xóa câu hỏi thành công.");
        } catch (\Throwable $th) {
            // DB::rollBack();
            return Common::response(400, "Có lỗi xảy ra, vui lòng thử lại.", $th->getMessage());
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
