<?php

namespace App\Helpers;

use App\Models\History;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

use function Laravel\Prompts\note;

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
            'message' => $message
        ];
        if ($data) {
            if ($paginateData) {
                $resData = [
                    'data' => $data,
                    'paginateData' => $paginateData
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
    public static function saveHistory(int $user_id, string $model, int $foreignKey, $result, ?string $note = null): bool
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
            'note' => $note
        ]);

        return (bool)$history;
    }
}
