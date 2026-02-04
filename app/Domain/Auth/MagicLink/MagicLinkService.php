<?php

namespace App\Domain\Auth\MagicLink;

use App\Domain\Auth\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class MagicLinkService
{
    protected int $expirationMinutes = 15;

    /**
     * Generate a magic link token for a user.
     */
    public function generateToken(User $user): string
    {
        $token = Str::random(64);
        
        // Store token in cache with expiration
        Cache::put(
            "magic_link:{$token}",
            $user->id,
            now()->addMinutes($this->expirationMinutes)
        );

        return $token;
    }

    /**
     * Validate and retrieve user from token.
     */
    public function validateToken(string $token): ?User
    {
        $userId = Cache::get("magic_link:{$token}");

        if (!$userId) {
            return null;
        }

        $user = User::find($userId);

        if ($user) {
            // Delete token after use
            Cache::forget("magic_link:{$token}");
        }

        return $user;
    }

    /**
     * Generate a signed URL for magic link.
     */
    public function generateSignedUrl(User $user, string $route = 'magic-link.verify'): string
    {
        $token = $this->generateToken($user);
        
        return URL::temporarySignedRoute(
            $route,
            now()->addMinutes($this->expirationMinutes),
            ['token' => $token]
        );
    }
}
