<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class RateLimitSaleCreation
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $key = 'sale_creation:' . ($user ? $user->id : $request->ip());

        $maxAttempts = $user ? 10 : 3; // More attempts for authenticated users

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            return response()->json([
                'message' => 'Too many for-sale creation attempts. Please try again later.',
            ], 429);
        }

        RateLimiter::hit($key, 60 * 60); // 1 hour

        return $next($request);
    }
}
