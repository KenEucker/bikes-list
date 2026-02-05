<?php

use App\Jobs\AutoPublishPendingEvents;
use App\Jobs\ProcessUploadVariantsJob;
use App\Jobs\RecurringEventExpiryReminder;
use App\Models\Upload;
use App\Services\UploadStorageService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Storage;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('uploads:smoketest', function () {
    $config = config('filesystems.disks.uploads');
    $bucket = $config['bucket'] ?? '(not set)';
    $region = $config['region'] ?? '(not set)';
    $endpoint = isset($config['endpoint']) ? preg_replace('#^([^:]+://[^/]*).*#', '$1', $config['endpoint']) . ' (redacted)' : '(not set)';
    $url = $config['url'] ?? '(not set)';
    $this->info('Uploads config (redacted):');
    $this->line("  bucket: {$bucket}");
    $this->line("  region: {$region}");
    $this->line("  endpoint: {$endpoint}");
    $this->line("  url: {$url}");

    $storage = app(UploadStorageService::class);
    $disk = $storage->disk();

    try {
        $prefix = $storage->prefix();
        $testKey = $prefix . '/.smoketest-' . uniqid();
        Storage::disk($disk)->put($testKey, 'ok');
        $read = Storage::disk($disk)->get($testKey);
        Storage::disk($disk)->delete($testKey);
        if ($read === 'ok') {
            $this->info('Connectivity: OK (write/read/delete succeeded).');
        } else {
            $this->warn('Connectivity: read returned unexpected value.');
        }
    } catch (\Throwable $e) {
        $this->error('Connectivity: FAILED - ' . $e->getMessage());
    }
})->purpose('Verify uploads bucket connectivity and print redacted config');

Artisan::command('uploads:retry {id? : Optional upload UUID to retry}', function (?string $id = null) {
    $storage = app(UploadStorageService::class);
    $disk = $storage->disk();

    $query = Upload::query();
    if ($id) {
        $query->where('id', $id);
    } else {
        $query->where(function ($q) use ($disk) {
            $q->where('status', Upload::STATUS_PROCESSING)
                ->orWhere(function ($q2) use ($disk) {
                    $q2->where('status', Upload::STATUS_FAILED)
                        ->whereNotNull('temp_key');
                });
        });
    }

    $count = 0;
    foreach ($query->get() as $upload) {
        $canRetry = $upload->status === Upload::STATUS_PROCESSING
            || ($upload->status === Upload::STATUS_FAILED
                && $upload->temp_key
                && Storage::disk($disk)->exists($upload->temp_key));
        if (! $canRetry) {
            if ($id) {
                $this->warn("Upload {$upload->id}: cannot retry (temp file missing or already ready).");
            }
            continue;
        }
        if ($upload->status === Upload::STATUS_FAILED) {
            $upload->status = Upload::STATUS_PROCESSING;
            $upload->save();
        }
        dispatch(new ProcessUploadVariantsJob($upload));
        $count++;
        $this->line("Queued: {$upload->id}");
    }

    if ($count === 0) {
        $this->info($id ? 'No upload found or not retryable.' : 'No stuck uploads to retry.');
    } else {
        $this->info("Queued {$count} job(s). Run a queue worker to process them.");
    }
})->purpose('Retry processing for stuck or failed uploads');

Schedule::job(new AutoPublishPendingEvents(48))->hourly();
Schedule::job(new RecurringEventExpiryReminder)->daily();
