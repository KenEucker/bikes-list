<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class CorrelationId
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $correlationId = $request->header('X-Correlation-ID') ?? Str::uuid()->toString();

        // Add to request for logging
        $request->merge(['correlation_id' => $correlationId]);

        // Add to log context
        \Log::withContext(['correlation_id' => $correlationId]);

        $response = $next($request);

        // Add to response headers
        $response->headers->set('X-Correlation-ID', $correlationId);

        return $response;
    }
}
