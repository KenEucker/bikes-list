<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessInboundRelayEmail;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InboundRelayController extends Controller
{
    /**
     * Handle inbound email webhook from mail provider (Mailgun, Postmark, etc.).
     * Expects: token (from local part of recipient address), from, subject, body.
     * Optional: reply_to_token when the email is a reply to a thread.
     */
    public function __invoke(Request $request): Response
    {
        $token = $request->input('token') ?? $request->input('recipient_local'); // provider-dependent
        $replyToToken = $request->input('reply_to_token');
        $from = $request->input('from') ?? $request->input('sender');
        $subject = $request->input('subject', '');
        $body = $request->input('body') ?? $request->input('text') ?? $request->input('stripped-text');

        if (!$token || !$from) {
            return response('Missing token or from', 400);
        }

        $fromEmail = is_string($from) ? $from : ($from['email'] ?? '');
        if (!$fromEmail && is_array($from)) {
            $fromEmail = $from['address'] ?? '';
        }

        ProcessInboundRelayEmail::dispatch($token, $fromEmail, $subject, (string) $body, $replyToToken);

        return response('', 200);
    }
}
