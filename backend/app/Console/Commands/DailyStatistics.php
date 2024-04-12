<?php

namespace App\Console\Commands;

use App\Models\History;
use App\Models\User;
use Illuminate\Console\Command;

class dailyStatistics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'daily_stats';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::get();
        foreach ($users as $user) {
            $histories = History::todayByUser($user->id);
            dd($histories);
        }
    }
}
