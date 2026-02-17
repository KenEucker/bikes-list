<?php

namespace App\Jobs;

use App\Models\WebhookDelivery;
use App\Models\WebhookEndpoint;
use App\Webhooks\WebhookTemplateRenderer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class DeliverWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries;

    public array $backoff;

    public function __construct(
        public WebhookEndpoint $endpoint,
        public string $eventName,
        public array $payload
    ) {
        $this->tries = config('webhooks.max_retries', 3);
        $this->backoff = config('webhooks.backoff', [30, 120, 600]);
        $this->onQueue(config('webhooks.queue', 'webhooks'));
    }

    public function handle(WebhookTemplateRenderer $renderer): void
    {
        $deliveryId = (string) Str::uuid();
        $body = $this->buildBody($renderer, $deliveryId);
        $signature = 'sha256=' . hash_hmac(
            config('webhooks.signing_algorithm', 'sha256'),
            $body,
            $this->endpoint->secret
        );
        $timeout = config('webhooks.timeout_seconds', 10);

        try {
            $response = Http::timeout($timeout)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'X-Signature-256' => $signature,
                    'X-Webhook-Event' => $this->eventName,
                    'X-Webhook-Delivery' => $deliveryId,
                    'User-Agent' => 'Bikeslist-Webhooks/1.0',
                ])
                ->withBody($body, 'application/json')
                ->post($this->endpoint->url);

            $status = $response->status();
            $body = $response->body();
            $maxBodyLength = 65536;
            if (strlen($body) > $maxBodyLength) {
                $body = substr($body, 0, $maxBodyLength) . '... [truncated]';
            }

            if ($status >= 200 && $status < 300) {
                WebhookDelivery::query()->create([
                    'webhook_endpoint_id' => $this->endpoint->id,
                    'event_name' => $this->eventName,
                    'payload' => $this->payload,
                    'response_status' => $status,
                    'response_body' => $body,
                    'attempt' => $this->attempts(),
                    'delivered_at' => now(),
                ]);
                $this->endpoint->resetFailures();
                $this->endpoint->update(['last_triggered_at' => now()]);
            } else {
                $this->recordFailure($status, $body, null);
            }
        } catch (\Throwable $e) {
            $this->recordFailure(null, null, $e->getMessage());
            throw $e;
        }
    }

    private function buildBody(WebhookTemplateRenderer $renderer, string $deliveryId): string
    {
        $data = array_merge($this->payload, ['delivery_id' => $deliveryId]);

        $template = $this->endpoint->template;
        if (! empty(trim((string) $template))) {
            return $renderer->render($template, $data);
        }

        return json_encode($this->payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    private function recordFailure(?int $status, ?string $body, ?string $errorMessage): void
    {
        WebhookDelivery::query()->create([
            'webhook_endpoint_id' => $this->endpoint->id,
            'event_name' => $this->eventName,
            'payload' => $this->payload,
            'response_status' => $status,
            'response_body' => $body,
            'attempt' => $this->attempts(),
            'failed_at' => now(),
            'error_message' => $errorMessage,
        ]);
        $this->endpoint->recordFailure();
    }
}
