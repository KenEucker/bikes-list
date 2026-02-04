<?php

namespace App\Jobs;

use App\Models\Listing;
use App\Models\ListingRelayAddress;
use App\Models\ListingRelayThread;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessInboundRelayEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $token,
        public string $fromEmail,
        public string $subject,
        public string $body,
        public ?string $replyToToken = null
    ) {}

    public function handle(): void
    {
        if ($this->replyToToken) {
            $thread = ListingRelayThread::query()->where('reply_to_token', $this->replyToToken)->first();
            if (!$thread) {
                Log::warning('Relay: unknown reply_to_token', ['token' => $this->replyToToken]);
                return;
            }
            $listing = $thread->listing;
            // Forward to the original inquirer (we need to store their email in the thread - for v1 we only have sender_email_hash, so we cannot forward back; would need to store hashed -> temp mapping or use a different design)
            // Stub: log for now
            Log::info('Relay: reply to thread', ['listing_id' => $listing->id, 'reply_to_token' => $this->replyToToken]);
            return;
        }

        $relay = ListingRelayAddress::query()->where('token', $this->token)->first();
        if (!$relay) {
            Log::warning('Relay: unknown token', ['token' => $this->token]);
            return;
        }
        $listing = $relay->listing()->with('user', 'communityPage')->first();
        if (!$listing) {
            return;
        }
        $recipientEmail = $listing->community_page_id && $listing->communityPage?->contact_email
            ? $listing->communityPage->contact_email
            : $listing->user->email;

        $senderHash = ListingRelayThread::hashSenderEmail($this->fromEmail);
        $thread = ListingRelayThread::firstOrCreate(
            [
                'listing_id' => $listing->id,
                'sender_email_hash' => $senderHash,
            ],
            ['reply_to_token' => ListingRelayThread::generateReplyToToken()]
        );

        // TODO: Send mail to $recipientEmail with subject/body and Reply-To: reply-{thread.reply_to_token}@relay_domain
        Log::info('Relay: would forward to seller', [
            'listing_id' => $listing->id,
            'recipient' => $recipientEmail,
            'reply_to_token' => $thread->reply_to_token,
        ]);
    }
}
