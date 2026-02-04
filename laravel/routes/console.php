<?php

use App\Jobs\AutoPublishPendingEvents;
use App\Jobs\RecurringEventExpiryReminder;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new AutoPublishPendingEvents(48))->hourly();
Schedule::job(new RecurringEventExpiryReminder)->daily();
