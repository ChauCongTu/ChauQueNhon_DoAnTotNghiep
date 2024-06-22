<?php

namespace App\Console\Commands;

use App\Models\Arena;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class handleArena extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:handle-arena';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Handle Arena Status';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pendingArenas = Arena::where('status', 'pending')->where('mode', 0)->get();
        $pendingArenas->each(function ($item) {
            if (Carbon::parse($item->start_at) <= now()) {
                $questions = $item->questions();

                $result = [
                    'time' => 0,
                    'res' => [],
                    'current' => 0,
                    'question' => (array) $questions[0],
                ];

                foreach ($questions as $question) {
                    $result['res'][] = [$question->id => ''];
                }

                $item->status = "started";
                $item->save();

                Redis::setex('result_room_' . $item->id, 500, json_encode($result));

                Redis::publish('tick', json_encode(array('event' => 'MessagePushed', 'data' => json_encode([
                    'arenaStart' => $item->id,
                    'message' => 'Bắt đầu thi đấu :Fighting:',
                    'questionKey' => 1,
                    'question' => $questions[0],
                ]))));
            }
        });

        $pendingArenasV2 = Arena::where('status', 'pending')->where('mode', 1)->get();
        $pendingArenasV2->each(function ($item) {
            $startTime = Carbon::parse($item->start_at);

            $adjusted15StartTime = $startTime->copy()->subMinutes(15)->startOfMinute();
            $adjusted5StartTime = $startTime->copy()->subMinutes(5)->startOfMinute();

            $currentMinute = now()->startOfMinute();

            if ($currentMinute->equalTo($adjusted15StartTime)) {
                Redis::publish('tick', json_encode([
                    'event' => 'MessagePushed',
                    'type' => 'notification',
                    'data' => json_encode([
                        'message' => 'Phòng thi của bạn sẽ bắt đầu sau 15 phút nữa.',
                        'data' => $item,
                    ]),
                ]));
            }

            if ($currentMinute->equalTo($adjusted5StartTime)) {
                Redis::publish('tick', json_encode([
                    'event' => 'MessagePushed',
                    'type' => 'notification',
                    'data' => json_encode([
                        'message' => 'Phòng thi của bạn sẽ bắt đầu sau 5 phút nữa. Hãy chuẩn bị giấy bút cần thiết và chuẩn bị tinh thần thoải mái',
                        'data' => $item,
                    ]),
                ]));
            }
            if (Carbon::parse($item->start_at) <= now()) {
                $questions = $item->questions();

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

                $item->status = 'started';
                $item->start_at = now();
                $item->save();

                $users = $item->joined();
                $joined = [];

                foreach ($users as $user) {
                    $joined[] = [
                        'user' => $user,
                        'total_score' => 0,
                    ];
                }
                $data = [
                    'arenaStart' => $item->id,
                    'message' => 'Bắt đầu thi đấu :Fighting:',
                    'current' => 1,
                    'question' => $questions[0],
                    'users' => $joined,
                ];

                // return response()->json($data);

                Redis::setex('result_room_' . $item->id, 43200, json_encode($result));

                Redis::setex('data_room_' . $item->id, 43200, json_encode($data));

                Redis::publish('tick', json_encode(array('event' => 'MessagePushed', 'data' => json_encode($data))));
            } else {
                $endTime = Carbon::parse($item->start_at)->addMinutes($item->time * $item->question_count);
                if ($endTime <= now()) {
                    $item->status = "completed";
                    $item->save();
                    Redis::publish('tick', json_encode(array('event' => 'MessagePushed', 'data' => json_encode(['status' => $item->status, 'arena' => $item]))));
                }
            }
        });

        $startedArenas = Arena::where('status', 'started')->where('mode', 0)->get();
        $startedArenas->each(function ($item) {
            $endTime = Carbon::parse($item->start_at)->addMinutes($item->time);
            if ($endTime <= now()) {
                $item->status = "completed";
                $item->save();
                Redis::publish('tick', json_encode(array('event' => 'MessagePushed', 'data' => json_encode(['status' => $item->status, 'arena' => $item]))));
            }
        });
    }
}
