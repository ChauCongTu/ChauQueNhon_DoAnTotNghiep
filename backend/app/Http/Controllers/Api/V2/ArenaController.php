<?php

namespace App\Http\Controllers\Api\V2;

use App\Helpers\Common;
use App\Http\Controllers\Controller;
use App\Http\Requests\Practice\GetResultRequest;
use App\Models\Arena;
use App\Models\History;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;

class ArenaController extends Controller
{
    public function start($roomId)
    {
        $arena = Arena::find($roomId);
        if (!$arena) {
            return Common::response(404, 'Không tìm thấy phòng thi này.');
        }

        if (!$arena) {
            return Common::response(404, 'Không tìm thấy phòng thi này.');
        }

        if ($arena->status != 'pending') {
            return Common::response(400, 'Trạng thái hiện tại không thể bắt đầu.');
        }

        $questions = $arena->questions();

        $result = [
            'time' => 0,
            'res' => [],
        ];

        foreach ($questions as $question) {
            $result['res'][] = [
                'id' => $question->id,
                'user' => '',
            ];
        }

        $arena->status = 'started';
        $arena->start_at = now();
        $arena->save();

        $users = $arena->joined();
        $joined = [];

        foreach ($users as $user) {
            $joined[] = [
                'user' => $user,
                'total_score' => 0,
            ];
        }
        $data = [
            'arenaStart' => $arena->id,
            'message' => 'Bắt đầu thi đấu :Fighting:',
            'current' => 1,
            'question' => $questions[0],
            'users' => $joined,
        ];

        // return response()->json($data);

        Redis::setex('result_room_' . $roomId, 43200, json_encode($result));

        Redis::setex('data_room_' . $roomId, 43200, json_encode($data));

        Redis::publish('tick', json_encode(array('event' => 'MessagePushed', 'data' => json_encode($data))));
        return Common::response(200, 'Thành công', $data);
    }

    public function next($roomId, Request $request)
    {
        $question_id = $request->input('question_id');
        $user_id = $request->input('user_id', 0);
        $answer = $request->input('answer');

        if (!$question_id) {
            return Common::response(400, 'Vui lòng truyền body: `question_id`.');
        }

        $arena = Arena::find($roomId);
        if (!$arena) {
            return Common::response(404, 'Không tìm thấy phòng thi này.');
        }

        if ($arena->status !== 'started') {
            return Common::response(400, 'Yêu cầu không hợp lệ.');
        }

        $result = json_decode(Redis::get('result_room_' . $roomId));

        if (!$arena) {
            return Common::response(404, 'Không tìm thấy phòng thi này.');
        }

        $data = json_decode(Redis::get('data_room_' . $roomId));

        $question_id = $result->res[$data->current - 1]->id;

        $user = $result->res[$data->current - 1]->user ?? '';

        $check = str_word_count($user) > 0 ? true : false;

        if ($check) {
            return Common::response(400, 'Tiếc quá! bạn đã chậm 1 bước rồi.');
        }

        if ($answer) {
            if ($answer !== $data->question->answer_correct) {
                return Common::response(400, 'Đáp án không hợp lệ.');
            }
        }

        $result->res[$data->current - 1]->user = $user_id;

        Redis::setex('result_room_' . $roomId, 43200, json_encode($result));

        $questions = $arena->questions()->toArray();

        if ($data->current < $arena->question_count) {
            $data->question = $questions[$data->current];
            $data->message = 'Đã sang câu tiếp theo';
            $data->current += 1;
            $data->arenaStart = 0;

            $data->arenaNext = $arena->id;
            $dataUser = collect($data->users);
            $userNeedChange = $dataUser->firstWhere('user.id', $user_id);
            if ($userNeedChange) {
                $userNeedChange->total_score += 3;
            }
        } else {
            // Xử lý khi câu cuối
            $data->question = null;
            $data->message = 'Trận đấu đã kết thúc';
            $data->current = 0;

            $data->arenaStart = 0;
            $data->arenaNext = 0;
            $data->arenaEnd = $arena->id;

            $dataUser = collect($data->users);
            $userNeedChange = $dataUser->firstWhere('user.id', $user_id);
            if ($userNeedChange) {
                $userNeedChange->total_score += 3;
            }

            $arena->status = 'completed';
            $arena->start_at = now();
            $arena->save();

            // return response()->json($dataUser[0]->user->id);

            foreach ($dataUser as $user) {
                // return response()->json($user->user->id);
                Common::saveHistory($user->user->id, 'Arena', $arena->id, json_encode($data), json_encode($result));
            }
        }

        Redis::setex('data_room_' . $roomId, 43200, json_encode($data));

        Redis::publish('tick', json_encode(array('event' => 'MessagePushed', 'data' => json_encode($data))));

        return Common::response(200, 'Thành công', $result);
    }

    public function load(int $id)
    {
        $data = json_decode(Redis::get('data_room_' . $id));
        // Redis::publish('tick', json_encode(array('event' => 'MessagePushed', 'data' => json_encode($data))));
        return Common::response(200, 'Thành công', $data);
    }

    public function history(int $id) {
        $data = History::where('model', 'App\Models\Arena')->where('foreign_id', $id)->first();
        if ($data) {
            $data->result = json_decode($data->result);
            return Common::response(200, 'Thành công', $data);
        }
        return Common::response(404, 'Ko tìm thấy lịch sử phòng này');
    }

    public function result(int $id, GetResultRequest $request)
    {
        $result = [];
        $data = $request->validated();
        $result['time'] = $data['time'];
        $time = $data['time'] / 60;
        $arena = Arena::find($id);

        if ($arena->status != 'started') {
            return Common::response(400, 'Trạng thái hiện tại không thể nộp.');
        }

        $questions = $arena->questions();

        $totalQuestions = $questions->count();
        $scorePerQuestion = 10 / $totalQuestions;
        $correct_count = 0;
        $assignment = [];

        foreach ($data['res'] as $key => $value) {
            $question = $questions->find($key);
            $isCorrect = $value == $question->answer_correct;
            $correct_count += $isCorrect ? 1 : 0;
            $score = $isCorrect ? $scorePerQuestion : 0;

            $assignment[$key] = [
                'question' => $question->question,
                'your_answer' => $value,
                'correct_answer' => $question->answer_correct,
                'score' => $score,
            ];
        }

        $total_score = $correct_count * $scorePerQuestion;

        $result['assignment'] = $assignment;

        $result['correct_count'] = $correct_count;
        $result['total_score'] = $total_score;
        $user_id = Auth::id();
        $result['late'] = ceil($time - $arena->time);

        if ($result['late'] > 0) {
            Common::saveHistory($user_id, 'Arena', $id, $result, "Nộp trễ " . $result['late'] . ' phút.');
            return Common::response(200, 'Bạn đã nộp muộn ' . ($result['late']) . ' phút.', $result);
        }
        Redis::del($user_id . '_arena_progress_' . $arena->id);
        $history = Common::saveHistory($user_id, 'Arena', $id, $result);
        $histories = History::where('model', 'App\Models\Arena')->where('foreign_id', $arena->id)->get();
        foreach ($histories as $value) {
            $value['user'] = User::find($value['user_id']);
            $value['result'] = json_decode($value['result']);
        }
        Redis::publish('tick', json_encode(array('event' => 'MessagePushed', 'data' => json_encode(['message' => 'Nộp bài thành công.', 'user' => Auth::user(), 'id' => $arena->id, 'histories' => $histories]))));
        return Common::response(200, "Nộp bài thành công!", $result);
    }
}
