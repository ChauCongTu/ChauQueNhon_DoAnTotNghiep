<?php

namespace App\Helpers;

use Illuminate\Support\Carbon;

class Common
{
    /***
     *  Generate response function
     *
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
}
