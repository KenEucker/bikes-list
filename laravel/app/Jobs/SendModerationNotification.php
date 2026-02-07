<?php

namespace App\Jobs;

use App\Mail\ModerationNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendModerationNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $creatorEmail,
        public string $actionLabel,
        public string $contentTypeLabel,
        public string $reasonCodeLabel,
        public ?string $relayMessage = null
    ) {}

    public function handle(): void
    {
        Mail::to($this->creatorEmail)->send(new ModerationNotification(
            $this->actionLabel,
            $this->contentTypeLabel,
            $this->reasonCodeLabel,
            $this->relayMessage
        ));
    }
}
