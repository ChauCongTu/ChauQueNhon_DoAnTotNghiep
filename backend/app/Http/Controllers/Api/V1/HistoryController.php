<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\Common;
use App\Http\Controllers\Controller;
use App\Models\History;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 0);
        $query = History::where('user_id', Auth::id())->orderBy('created_at', 'DESC');

        if ($perPage === 0) {
            $histories = $query->get();
        } else {
            $histories = $query->paginate($perPage);
        }
        foreach ($histories as $value) {
            $value['result'] = json_decode($value['result']);
        }
        return Common::response(200, "Lấy danh sách lịch sử thành công.", $histories);
    }

    public function detail(Request $request)
    {
        $date = $request->input('date', Carbon::today()->toDateString());

        $histories = History::where('user_id', Auth::id())
            ->whereDate('created_at', $date)
            ->get();
        foreach ($histories as $value) {
            $value['result'] = json_decode($value['result']);
        }
        return Common::response(200, "Lấy danh sách lịch sử của ngày $date thành công.", $histories);
    }
}
