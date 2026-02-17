<?php

namespace App\Jobs;

use App\Models\Sale;
use App\Models\SaleRelayAddress;
use App\Models\SaleRelayThread;
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
            $thread = SaleRelayThread::query()->where('reply_to_token', $this->replyToToken)->first();
            if (!$thread) {
                Log::warning('Relay: unknown reply_to_token', ['token' => $this->replyToToken]);
                return;
            }
            $sale = $thread->sale;
            // Forward to the original inquirer (we need to store their email in the thread - for v1 we only have sender_email_hash, so we cannot forward back; would need to store hashed -> temp mapping or use a different design)
            // Stub: log for now
            Log::info('Relay: reply to thread', ['sale_id' => $sale->id, 'reply_to_token' => $this->replyToToken]);
            return;
        }

        $relay = null;
        $parsed = $this->parseSaleToken($this->token);
        if ($parsed) {
            $relay = SaleRelayAddress::query()
                ->where('sale_id', $parsed['sale_id'])
                ->where('token', $parsed['token'])
                ->first();
        } else {
            $relay = SaleRelayAddress::query()->where('token', $this->token)->first();
        }
        if (! $relay) {
            Log::warning('Relay: unknown token', ['token' => $this->token]);
            return;
        }
        $sale = $relay->sale()->with('user', 'communityPage')->first();
        if (!$sale) {
            return;
        }
        $recipientEmail = $sale->community_page_id && $sale->communityPage?->contact_email
            ? $sale->communityPage->contact_email
            : $sale->user->email;

        $senderHash = SaleRelayThread::hashSenderEmail($this->fromEmail);
        $thread = SaleRelayThread::firstOrCreate(
            [
                'sale_id' => $sale->id,
                'sender_email_hash' => $senderHash,
            ],
            ['reply_to_token' => SaleRelayThread::generateReplyToToken()]
        );

        // TODO: Send mail to $recipientEmail with subject/body and Reply-To: reply-{thread.reply_to_token}@relay_domain
        Log::info('Relay: would forward to seller', [
            'sale_id' => $sale->id,
            'recipient' => $recipientEmail,
            'reply_to_token' => $thread->reply_to_token,
        ]);
    }

    private function parseSaleToken(string $localPart): ?array
    {
        if (! str_starts_with($localPart, 'sale-')) {
            return null;
        }
        $parts = explode('-', substr($localPart, 5), 2);
        if (count($parts) < 2) {
            return null;
        }
        $saleId = (int) $parts[0];
        $token = $parts[1] ?? '';
        if ($saleId < 1 || $token === '') {
            return null;
        }

        return ['sale_id' => $saleId, 'token' => $token];
    }
}
