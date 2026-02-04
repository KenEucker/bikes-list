<?php

namespace App\Http\Controllers\Consumer;

use App\Domain\Auth\MagicLink\MagicLinkService;
use App\Domain\Auth\User;
use App\Mail\MagicLinkMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;

class MagicLinkController extends \App\Http\Controllers\Controller
{
    public function __construct(
        protected MagicLinkService $magicLinkService
    ) {
    }

    /**
     * Request a magic link.
     */
    public function request(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $email = $request->input('email');

        // Rate limiting
        $key = 'magic_link:' . $request->ip() . ':' . $email;
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json(['message' => 'Too many requests. Please try again later.'], 429);
        }
        RateLimiter::hit($key, 60 * 15); // 15 minutes

        // Find or create user
        $user = User::firstOrCreate(
            ['email' => $email],
            ['status' => 'active']
        );

        // Generate magic link
        $url = $this->magicLinkService->generateSignedUrl($user);

        // Send email
        Mail::to($user)->send(new MagicLinkMail($user, $url));

        return response()->json(['message' => 'Magic link sent to your email']);
    }

    /**
     * Verify magic link token and authenticate user.
     */
    public function verify(Request $request, string $token)
    {
        if (!$request->hasValidSignature()) {
            abort(401, 'Invalid or expired link');
        }

        $user = $this->magicLinkService->validateToken($token);

        if (!$user) {
            abort(401, 'Invalid or expired token');
        }

        // Authenticate user
        auth()->guard('web')->login($user);

        return redirect()->intended('/');
    }
}
