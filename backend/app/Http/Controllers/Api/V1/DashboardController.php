<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\Common;
use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\History;
use App\Models\Lesson;
use App\Models\Question;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getOverview()
    {
        $data = [];

        $data['students'] = User::role('student')->count();
        $data['questions'] = Question::count();
        $data['exams'] = Exam::count();
        $data['histories'] = History::count();

        return Common::response(200, 'Thành công', $data);
    }

    public function getVibrantStudents()
    {
        $data = DB::table('histories as h')
            ->select(
                'h.user_id',
                DB::raw('COUNT(h.id) as total_records'),
                DB::raw("SUM(CASE WHEN h.model = 'App\\\\Models\\\\Exam' THEN 1 ELSE 0 END) as exam_count"),
                DB::raw("SUM(CASE WHEN h.model = 'App\\\\Models\\\\Arena' THEN 1 ELSE 0 END) as arena_count"),
                DB::raw("SUM(CASE WHEN h.model = 'App\\\\Models\\\\Practice' THEN 1 ELSE 0 END) as practice_count"),
                DB::raw("(SELECT COUNT(*) FROM topics t WHERE t.author = h.user_id) as topic_count"),
                DB::raw("(SELECT COUNT(*) FROM topic_comments tc WHERE tc.author = h.user_id) as topic_comment_count"),
                DB::raw("(SELECT COUNT(*) FROM topics t WHERE t.author = h.user_id) + (SELECT COUNT(*) FROM topic_comments tc WHERE tc.author = h.user_id) as forum_count")
            )
            ->groupBy('h.user_id')
            ->orderByDesc('total_records')
            ->get();

        $data->each(function ($item, $index) {
            $item->id = $index + 1;
            $item->user = User::select('id', 'username', 'name', 'avatar')->find($item->user_id);
            $item->forum_frequency = $this->getForumParticipationFrequency($item->forum_count);
            $item->web_point = $this->calcWebPoint($item->total_records, $item->forum_frequency);
        });

        $sortedData = $data->sortByDesc('web_point')->values();

        return Common::response(200, 'Thành công', $sortedData);
    }

    public function getUserRolePieChart()
    {
        $data = [
            'students' => User::role('student')->count(),
            'teachers' => User::role('teacher')->count(),
            'admins' => User::role('admin')->count(),
        ];

        return Common::response(200, 'Thành công', $data);
    }

    public function getUserRegistrationStats(Request $request)
    {
        // Validate the request parameters
        $request->validate([
            'type' => 'required|in:day,week,month,year',
        ]);

        $type = $request->type;
        $dateFormat = $this->getDateFormat($type);

        $stats = User::selectRaw("DATE_FORMAT(created_at, '$dateFormat') as date, COUNT(*) as count")
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $data = [
            'type' => $type,
            'stats' => $stats,
        ];

        return Common::response(200, 'Thành công', $data);
    }

    public function getTrend()
    {
        $data = DB::table('histories')
            ->select(
                DB::raw("SUM(CASE WHEN model = 'App\\\\Models\\\\Exam' THEN 1 ELSE 0 END) as exam_count"),
                DB::raw("SUM(CASE WHEN model = 'App\\\\Models\\\\Practice' THEN 1 ELSE 0 END) as practice_count"),
                DB::raw("SUM(CASE WHEN model = 'App\\\\Models\\\\Arena' THEN 1 ELSE 0 END) as arena_count")
            )
            ->first();

        $response = [
            'labels' => ['Exam', 'Practice', 'Arena'],
            'values' => [
                $data->exam_count,
                $data->practice_count,
                $data->arena_count,
            ],
        ];

        return Common::response(200, 'Thành công', $response);
    }

    public function statistics(Request $request)
    {
        $groupBy = $request->query('group_by');

        switch ($groupBy) {
            case 'age':
                $results = User::selectRaw('FLOOR(DATEDIFF(CURRENT_DATE, dob) / 365.25) as age_group, count(*) as count')
                    ->groupBy('age_group')
                    ->orderBy('age_group')
                    ->get();

                $labels = $results->pluck('age_group')->toArray();
                $values = $results->pluck('count')->toArray();
                break;
            case 'province':
                $results = User::select('province', \DB::raw('count(*) as count'))
                    ->groupBy('province')
                    ->get();

                $labels = $results->pluck('province')->toArray();
                $values = $results->pluck('count')->toArray();
                break;
            case 'class':
                $results = User::select('class', \DB::raw('count(*) as count'))
                    ->groupBy('class')
                    ->orderBy('count', 'desc')
                    ->get();

                $labels = $results->pluck('class')->toArray();
                $values = $results->pluck('count')->toArray();
                break;
            case 'gender':
                $results = User::select('gender', \DB::raw('count(*) as count'))
                    ->groupBy('gender')
                    ->orderBy('count', 'desc')
                    ->get();

                $labels = ['Nam', 'Nữ', 'Khác'];
                $values = [
                    $results->where('gender', 'nam')->first()->count ?? 0,
                    $results->where('gender', 'nữ')->first()->count ?? 0,
                    $results->whereNotIn('gender', ['nam', 'nữ'])->sum('count'),
                ];
                break;
            default:
                return response()->json(['error' => 'Invalid group_by parameter'], 400);
        }

        $data = ['labels' => $labels, 'values' => $values];

        return Common::response(200, 'Thành công', $data);
    }

    public function getUserFiltered(Request $request)
    {
        $query = User::query();

        if ($request->has('province')) {
            $query->where('province', $request->query('province'));
        }

        if ($request->has('class')) {
            $query->where('class', $request->query('class'));
        }

        if ($request->has('gender')) {
            $query->where('gender', $request->query('gender'));
        }

        $users = $query->get();

        return Common::response(200, 'Thành công', $users);
    }

    public function getMostViewedLessons()
    {
        $data = Lesson::orderByDesc('view_count')->limit(10)->get();

        foreach ($data as $lesson) {
            $lesson['subject'] = $lesson->subject();
        }

        return Common::response(200, 'Thành công', $data);
    }

    private static function getDateFormat($type)
    {
        switch ($type) {
            case 'day':
                return '%Y-%m-%d';
            case 'week':
                return '%Y-%u';
            case 'month':
                return '%Y-%m';
            case 'year':
                return '%Y';
            default:
                return '%Y-%m-%d';
        }
    }

    public static function calcWebPoint($total_record, $forum_frequency)
    {
        $frequency = $forum_frequency['id'];
        $point = ($total_record * 6) + ($frequency * 3);
        return $point;
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
