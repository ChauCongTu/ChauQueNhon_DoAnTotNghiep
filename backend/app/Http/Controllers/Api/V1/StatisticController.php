<?php
namespace App\Http\Controllers\Api\V1;

use App\Helpers\Common;
use App\Http\Controllers\Controller;
use App\Models\History;
use App\Models\Statistic;
use App\Models\Topic;
use App\Models\TopicComment;
use App\Models\User;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StatisticController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->input('type', 'd');
        $numb = $request->input('numb', 7);
        $userId = Auth::id();
        $result = [];

        $intervalMapping = [
            'd' => 'day',
            'w' => 'week',
            'm' => 'month',
            'y' => 'year',
        ];

        $inputDate = $request->input('date');
        $date = $inputDate ? Carbon::parse($inputDate) : Carbon::today();

        for ($i = 0; $i < $numb; $i++) {
            $interval = $intervalMapping[$type];
            $startDate = $date->copy()->{"sub{$interval}s"}($i)->startOf($interval);
            $endDate = $date->copy()->{"sub{$interval}s"}($i)->endOf($interval);
            $intervalNumber = $startDate->{$interval};

            $stats = Statistic::where('user_id', $userId)
                ->whereBetween('day_stats', [$startDate, $endDate])
                ->get();

            $stat = $this->calculateStats($stats);

            $result[] = [
                'interval' => $intervalNumber,
                'type' => $intervalMapping[$type],
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'stats' => $stat,
            ];
        }

        return Common::response(200, "Lấy thống kê thành công.", $result);
    }

    public function getPredictData(Request $request)
    {
        $subject_id = $request->subject_id;
        $user_id = Auth::id();

        $histories = History::where('user_id', $user_id)->get();

        foreach ($histories as $key => $value) {
            if ($value->model === 'App\Models\Exam') {
                $value->type = 'Exam';
            } else if ($value->model === 'App\Models\Arena') {
                $value->type = 'Arena';
            } else if ($value->model === 'App\Models\Practice') {
                $value->type = 'Practice';
            }

            $value->model_id = $value->model;

            $model = $value->model::find($value->foreign_id);
            $value->result = json_decode($value->result);

            if ($model && $model->subject_id == $subject_id) {
                $value->model = $model;
            } else {
                unset($histories[$key]);
            }
        }

        $exercisesCompleted = 0;
        $averageExerciseScore = 0;
        $testsCompleted = 0;
        $totalTestCompletionTime = 0;
        $averageTestScore = 0;
        $arenaParticipation = 0;
        $bestOfArenaCount = 0;
        $arenaQuestionsAnsweredPercentage = 0;
        $averageArenaRanking = 0;

        foreach ($histories as $history) {
            switch ($history->model_id) {
                case 'App\Models\Exam':
                    $testsCompleted = $testsCompleted + 1;
                    $averageTestScore = $averageTestScore + $history->result->total_score;
                    $totalTestCompletionTime = $totalTestCompletionTime + (($history->result->time / $history->model->time) * 100);
                    break;
                case 'App\Models\Practice':
                    $exercisesCompleted++;
                    $averageExerciseScore = $averageExerciseScore + $history->result->total_score;
                    break;
                case 'App\Models\Arena':
                    $arenaParticipation++;
                    $arenaQuestionsAnsweredPercentage = $arenaQuestionsAnsweredPercentage + Common::getArenaQuestionsAnsweredPercentage($history);
                    $bestOfArenaCount = $bestOfArenaCount + Common::getBestOfArenaCount($history);
                    $averageArenaRanking = $averageArenaRanking + Common::getArenaRanking($history);
                    break;
                default:
                    break;
            }
        }

        $averageExerciseScore = ($exercisesCompleted > 0) ? $averageTestScore / $exercisesCompleted : 0;
        $averageTestScore = ($testsCompleted > 0) ? $averageTestScore / $testsCompleted : 0;
        $totalTestCompletionTime = ($testsCompleted > 0) ? ceil($totalTestCompletionTime / $testsCompleted) : 0;
        $arenaQuestionsAnsweredPercentage = ($arenaParticipation > 0) ? ceil($arenaQuestionsAnsweredPercentage / $arenaParticipation) : 0;
        $averageArenaRanking = ($arenaParticipation > 0) ? ceil($averageArenaRanking / $arenaParticipation) : 0;

        $data = [
            'DailyTimeSpent' => 4,
            'ResourceAccessed' => 20,
            'MostTime' => 'night',
            'ExercisesCompleted' => $exercisesCompleted,
            'AverageExerciseScore' => $averageExerciseScore,
            'TestsCompleted' => $testsCompleted,
            'AverageTestScore' => $averageTestScore,
            'AverageTestCompletionTime' => $totalTestCompletionTime,
            'ArenaParticipation' => $arenaParticipation,
            'ArenaQuestionsAnsweredPercentage' => $arenaQuestionsAnsweredPercentage,
            'BestOfArenaCount' => $bestOfArenaCount,
            'AverageArenaRanking' => $averageArenaRanking,
        ];

        $user = User::select('id', 'created_at')->find($user_id);
        $created_at = ($user->created_at);
        $nowDateTime = new DateTime();
        $createdDateTime = new DateTime($created_at);
        $nowDateTime->setTime(0, 0, 0);
        $createdDateTime->setTime(0, 0, 0);
        $interval = $nowDateTime->diff($createdDateTime);
        $daysDifference = $interval->days;
        $data['DayActive'] = $daysDifference;

        $total_forum = Topic::where('author', $user_id)->count();
        $total_forum = $total_forum + TopicComment::where('author', $user_id)->count();

        $forumFrequency = $this->getForumParticipationFrequency($total_forum);

        $data['ForumParticipationFrequency'] = $forumFrequency['id'];
        $data['HelpfulAnswers'] = TopicComment::where('author', $user_id)->where('likes', '!=', null)->count();

        $data['Age'] = 18;
        $data['Grade'] = 12;
        $data['StudyTime'] = 8;
        $data['OnlineCourse'] = 'no';
        $data['SchoolType'] = 'specialized';
        $data['ClassType'] = 'normal';
        $data['SelfStudy'] = 3;
        $data['GoingOut'] = 3;
        $data['Health'] = 3;
        $data['LatestScore'] = 8;

        return Common::response(200, 'Thành công.', $data);
    }

    public function getUserSubjects($user_id)
    {
        $user = User::find($user_id);

        if ($user->class) {
            $subjects = Common::getSubjectFromClass([$user->class]);
            $subjects = Common::getSubjectIds($subjects, $user->grade);
            return Common::response(200, 'Thành công', $subjects);
        }

        return Common::response(400, 'Có lỗi');
    }

    private function calculateStats($stats)
    {
        $stat = [
            "total_time" => 0,
            "total_exams" => 0,
            "total_practices" => 0,
            "total_arenas" => 0,
            "histories" => [],
            "min_score" => 10,
            "max_score" => 0,
            "avg_score" => 0,
            "late_submissions" => 0,
            "accuracy" => 0,
            "most_done_subject" => 0,
            "subjects_done_today" => [],
            "total_questions_done" => 0,
        ];

        if ($stats->isNotEmpty()) {
            foreach ($stats as $value) {
                $value->histories = json_decode($value->histories);
                $value->subjects_done_today = json_decode($value->subjects_done_today);
                $stat['total_time'] += $value->total_time;
                $stat['total_exams'] += $value->total_exams;
                $stat['total_practices'] += $value->total_practices;
                $stat['total_arenas'] += $value->total_arenas;
                $stat['min_score'] = min($stat['min_score'], $value->min_score);
                $stat['max_score'] = max($stat['max_score'], $value->max_score);
                $stat['avg_score'] += $value->avg_score;
                $stat['accuracy'] += $value->accuracy;
                $stat['late_submissions'] += $value->late_submissions;
                $stat['histories'] = array_merge($stat['histories'], (array) $value->histories);
                $stat['subjects_done_today'] = array_merge($stat['subjects_done_today'], (array) $value->subjects_done_today);
                $stat['total_questions_done'] += $value->total_questions_done;
            }
            $stat['avg_score'] = ceil($stat['avg_score'] / count($stats));
            $stat['accuracy'] = ceil($stat['accuracy'] / count($stats));
        }

        if ($stats->isEmpty()) {
            $stat['min_score'] = 0;
        }

        return $stat;
    }

    public static function getForumParticipationFrequency($number)
    {
        if ($number >= 0 && $number <= 6) {
            return ['id' => 1, 'name' => 'rất thấp'];
        } elseif ($number >= 7 && $number <= 13) {
            return ['id' => 2, 'name' => 'thấp'];
        } elseif ($number >= 14 && $number <= 19) {
            return ['id' => 3, 'name' => 'trung bình'];
        } elseif ($number >= 20 && $number <= 26) {
            return ['id' => 4, 'name' => 'cao'];
        } elseif ($number > 26) {
            return ['id' => 5, 'name' => 'rất cao'];
        } else {
            return ['id' => 0, 'name' => 'không xác định'];
        }
    }
}
