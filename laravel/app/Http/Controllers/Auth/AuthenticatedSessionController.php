<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        $base = request()->getSchemeAndHttpHost();
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'error' => session('error'),
            'submitUrl' => $base . (request()->is('account/*') ? '/account/sign-in' : '/login'),
            'signUpUrl' => $base . (request()->is('account/*') ? '/account/sign-up' : '/register'),
            'passwordRequestUrl' => $base . '/forgot-password',
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $intended = $request->session()->pull('url.intended', null);
        if ($intended) {
            return redirect()->to($intended);
        }
        $base = $request->getSchemeAndHttpHost();
        $host = $request->getHost();
        if (str_contains($host, '.') && $host !== 'localhost') {
            return redirect()->to($base . '/dashboard');
        }
        return redirect()->to($base . '/');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
