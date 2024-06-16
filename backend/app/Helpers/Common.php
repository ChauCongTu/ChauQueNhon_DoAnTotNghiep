<?php

namespace App\Helpers;

use App\Models\History;
use App\Models\Subject;
use App\Models\User;
use function Laravel\Prompts\note;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class Common
{
    /**
     * Generate a standardized response for API calls.
     *
     * @param int $code The HTTP status code.
     * @param string $message The message to accompany the response.
     * @param mixed $data The main data payload to be included in the response.
     * @param mixed $paginateData Additional data for pagination if applicable.
     * @param string|null $bonus_name Optional bonus parameter name to include in the response.
     * @param mixed|null $bonus_value Optional bonus parameter value to include in the response.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the standardized structure.
     */
    public static function response(int $code = 200, string $message, $data = null, $paginateData = null, $bonus_name = null, $bonus_value = null)
    {
        $response = [];
        if ($code === 200 || $code === 201) {
            $success = true;
        } else {
            $success = false;
        }
        $response['status'] = [
            'code' => $code,
            'success' => $success,
            'message' => $message,
        ];
        if ($data) {
            if ($paginateData) {
                $resData = [
                    'data' => $data,
                    'paginateData' => $paginateData,
                ];
            } else {
                $resData = [$data];
            }
            $response['data'] = $resData;
        }

        if ($bonus_name && $bonus_value) {
            $response[$bonus_name] = $bonus_value;
        }

        $response['time'] = Carbon::now();

        return response()->json($response);
    }

    /**
     * Lưu lịch sử với kết quả được xử lý thành chuỗi JSON.
     *
     * @param int $user_id ID của người dùng
     * @param string $model Tên model
     * @param int $foreignKey Khóa ngoại
     * @param array|string|Collection $result Kết quả
     * @param string|null $note Ghi chú
     * @return bool Trả về true nếu lưu thành công, ngược lại trả về false.
     */
    public static function saveHistory(int $user_id, string $model, int $foreignKey, $result, ?string $note = null): History
    {
        if ($result instanceof Collection) {
            $result = $result->toArray();
        }
        if (is_array($result)) {
            $result = json_encode($result);
        }

        $history = History::create([
            'user_id' => $user_id,
            'model' => 'App\Models\\' . $model,
            'foreign_id' => $foreignKey,
            'result' => $result,
            'note' => $note,
        ]);
        $history['user'] = User::find($history['user_id']);
        $history['result'] = json_decode($history['result']);

        return $history;
    }

    /**
     * Calculate the difference between two given date times and return the result in the appropriate unit based on the difference.
     *
     * @param string $startDateTime The starting date time.
     * @param string|null $endDateTime The ending date time. Default is null, which means current date time (now).
     * @param string|null $unit The unit for the result ('days', 'hours', or 'minutes'). Default is null, which means auto-detect.
     * @return int|string The difference between the two date times in the specified unit, or a descriptive string if no unit is specified.
     */
    public static function timeDifference($startDateTime, $endDateTime = null, $unit = null)
    {
        $start = Carbon::parse($startDateTime);
        $end = $endDateTime ? Carbon::parse($endDateTime) : Carbon::now();

        if ($unit) {
            switch ($unit) {
                case 'days':
                    return $end->diffInDays($start);
                case 'hours':
                    return $end->diffInHours($start);
                case 'minutes':
                    return $end->diffInMinutes($start);
                default:
                    return $end->diffInHours($start);
            }
        } else {
            $difference = $end->diffInSeconds($start);
            if ($difference > 60 * 60 * 24) {
                return $end->diffInDays($start) . ' days';
            } elseif ($difference > 60 * 60) {
                return $end->diffInHours($start) . ' hours';
            } else {
                return $end->diffInMinutes($start) . ' minutes';
            }
        }
    }
    /**
     * Chuyển đổi thời gian từ giờ hoặc phút sang giây hoặc ngược lại.
     *
     * @param int $time Thời gian cần chuyển đổi
     * @param string $from Đơn vị thời gian đang ở (h: hours, m: minutes, s: seconds)
     * @param string $to Đơn vị thời gian muốn chuyển đổi đến (h: hours, m: minutes, s: seconds)
     * @return int Thời gian sau khi chuyển đổi
     */
    public static function convertTime(int $time, string $from, string $to): int
    {
        switch ($from) {
            case 'h':
                $time *= 3600; // 1 giờ = 3600 giây
                break;
            case 'm':
                $time *= 60; // 1 phút = 60 giây
                break;
            default:
                // Không cần thay đổi nếu là giây
                break;
        }

        switch ($to) {
            case 'h':
                $time /= 3600; // 1 giờ = 3600 giây
                break;
            case 'm':
                $time /= 60; // 1 phút = 60 giây
                break;
            default:
                // Không cần thay đổi nếu là giây
                break;
        }

        return (int) $time;
    }

    /**
     * Calculate the percentage of questions answered in the arena.
     *
     * This method calculates the percentage of questions answered by a user in an arena.
     *
     * @param collection $history_arena The result data containing user performance details.
     * @return int The percentage of questions answered in the arena.
     */
    public static function getArenaQuestionsAnsweredPercentage($history)
    {
        $model = $history->model;
        $user_id = $history->user_id;
        $result = $history->result->users;
        $score = 0;
        foreach ($result as $value) {
            if ($value->user->id == $user_id) {
                $score = $value->total_score;
            }
        }

        $percent = 0;
        if ($score != 0) {
            $score = $score / 3;
            $percent = ($score / $model['question_count']) * 100;
        }
        return $percent;
    }

    /**
     * check is best in the arena.
     *
     * This method calculates the besst of questions answered by a user in an arena.
     *
     * @param collection $history_arena The result data containing user performance details.
     * @return 1 if is best
     * @return 0 if not
     */

    public static function getBestOfArenaCount($history)
    {
        $model = $history->model;
        $user_id = $history->user_id;
        $result = $history->result->users;
        $max_score = 0;
        $my_score = 0;
        foreach ($result as $value) {
            if ($value->user->id == $user_id) {
                $my_score = $value->total_score;
            }
            if ($max_score < $value->total_score) {
                $max_score = $value->total_score;
            }
        }
        return ($max_score == $my_score) ? 1 : 0;
    }
    public static function getArenaRanking($result)
    {
        return rand(1, 5);
    }

    public static function stringToDatetime($dateTimeString)
    {
        return Carbon::parse($dateTimeString);
    }
    public static function stringToTimestamp($dateTimeString)
    {
        return Carbon::parse($dateTimeString)->timestamp;
    }
    public static function timestampToDatetime($timestamp)
    {
        return Carbon::createFromTimestamp($timestamp);
    }

    private $class = [
        'A' => [
            'Toán Học', 'Vật Lý', 'Hóa Học',
        ],
        'A1' => [
            'Toán Học', 'Vật Lý', 'Tiếng Anh',
        ],
        'B' => [
            'Toán Học', 'Hóa Học', 'Sinh Học',
        ],
        'C' => [
            'Ngữ Văn', 'Lịch Sử', 'Địa Lý',
        ],
        'D' => [
            'Toán Học', 'Ngữ Văn', 'Tiếng Anh',
        ],
    ];
    public static function getSubjectFromClass(array $classList): array
    {
        $instance = new self();
        $allSubjects = [];

        foreach ($classList as $class) {
            if (isset($instance->class[$class])) {
                $allSubjects = array_merge($allSubjects, $instance->class[$class]);
            }
        }
        $uniqueSubjects = array_unique($allSubjects);

        return $uniqueSubjects;
    }

    public static function getSubjectIds(array $subjectList, $grade): array
    {
        $data = [];
        foreach ($subjectList as $subject) {
            $data[] = Subject::select('id', 'name')
                ->whereRaw('LOWER(name) = ?', [strtolower($subject)])
                ->where('grade', $grade)
                ->first();
        }

        return $data;
    }

    public static function isSubjectInMyClass(array $classList, int $subject_id): bool
    {
        $subject = Subject::find($subject_id);

        if (!$subject) {
            return false;
        }

        $subjectArray = self::getSubjectFromClass($classList);

        $subjectNameLower = strtolower($subject->name);
        $subjectArrayLower = array_map('strtolower', $subjectArray);

        return in_array($subjectNameLower, $subjectArrayLower);
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
