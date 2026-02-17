<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ModerationNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $actionLabel,
        public string $contentTypeLabel,
        public string $reasonCodeLabel,
        public ?string $relayMessage = null
    ) {}

    public function envelope(): Envelope
    {
        $subject = 'BikesList: Your content was ' . strtolower($this->actionLabel);
        return new Envelope(
            subject: $subject,
            from: config('mail.from.address', 'noreply@bikeslist.local'),
            replyTo: [config('mail.relay.reply_to', config('mail.from.address'))],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.moderation-notification'
        );
    }
}
