<?php

namespace App\Helpers;

use App\Models\History;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

use function Laravel\Prompts\note;

class Constant
{
    private $class = [
        'A' => [
            'Toán Học', 'Vật Lý', 'Hóa Học'
        ],
        'A1' => [
            'Toán Học', 'Vật Lý', 'Tiếng Anh'
        ],
        'B' => [
            'Toán Học', 'Hóa Học', 'Sinh Học'
        ],
        'C' => [
            'Ngữ Văn', 'Lịch Sử', 'Địa Lý'
        ],
        'D' => [
            'Toán Học', 'Ngữ Văn', 'Tiếng Anh'
        ]
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
}
