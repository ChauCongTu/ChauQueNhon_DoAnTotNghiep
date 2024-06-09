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
        $pendingArenas = Arena::where('status', 'pending')->get();
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

                // $item->status = "started";
                // $item->save();

                Redis::setex('result_room_' . $item->id, 500, json_encode($result));

                Redis::publish('tick', json_encode(array('event' => 'MessagePushed', 'data' => json_encode([
                    'arenaStart' => $item->id,
                    'message' => 'Bắt đầu thi đấu :Fighting:',
                    'questionKey' => 1,
                    'question' => $questions[0],
                ]))));
            }
        });

        $startedArenas = Arena::where('status', 'started')->get();
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
