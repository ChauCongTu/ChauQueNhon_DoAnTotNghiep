<?php

namespace App\Helpers;

use App\Models\Subject;

class QNHelper
{
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
