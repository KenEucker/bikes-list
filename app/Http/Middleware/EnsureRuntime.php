<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRuntime
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $runtime): Response
    {
        $appRuntime = env('APP_RUNTIME', 'consumer');

        if ($appRuntime !== $runtime) {
            abort(403, 'This route is not available in the current runtime');
        }

        return $next($request);
    }
}
