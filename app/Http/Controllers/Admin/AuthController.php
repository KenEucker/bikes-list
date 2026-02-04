<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Auth\Admin;
use App\Domain\Auth\MagicLink\MagicLinkService;
use App\Domain\Auth\TwoFactor\TwoFactorService;
use App\Http\Controllers\Controller;
use App\Mail\MagicLinkMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function __construct(
        protected MagicLinkService $magicLinkService,
        protected TwoFactorService $twoFactorService
    ) {
    }

    /**
     * Request a magic link for admin.
     */
    public function requestMagicLink(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $email = $request->input('email');

        // Rate limiting
        $key = 'admin_magic_link:' . $request->ip() . ':' . $email;
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json(['message' => 'Too many requests. Please try again later.'], 429);
        }
        RateLimiter::hit($key, 60 * 15);

        $admin = Admin::where('email', $email)->first();

        if (!$admin) {
            // Don't reveal if admin exists
            return response()->json(['message' => 'If an admin account exists, a magic link has been sent.']);
        }

        $url = $this->magicLinkService->generateSignedUrl($admin, 'admin.magic-link.verify');
        Mail::to($admin)->send(new MagicLinkMail($admin, $url));

        return response()->json(['message' => 'Magic link sent']);
    }

    /**
     * Verify magic link and check 2FA.
     */
    public function verifyMagicLink(Request $request, string $token)
    {
        if (!$request->hasValidSignature()) {
            abort(401, 'Invalid or expired link');
        }

        $admin = $this->magicLinkService->validateToken($token);

        if (!$admin) {
            abort(401, 'Invalid or expired token');
        }

        // Store admin ID in session for 2FA step
        session(['admin_2fa_pending' => $admin->id]);

        // If 2FA is not enabled, login directly
        if (!$admin->has2FAEnabled()) {
            auth()->guard('admin')->login($admin);
            session()->forget('admin_2fa_pending');
            return redirect()->intended('/admin');
        }

        // Redirect to 2FA verification
        return redirect()->route('admin.2fa.verify');
    }

    /**
     * Show 2FA verification form.
     */
    public function show2FAForm()
    {
        if (!session('admin_2fa_pending')) {
            return redirect()->route('admin.login');
        }

        return view('admin.2fa-verify');
    }

    /**
     * Verify 2FA code.
     */
    public function verify2FA(Request $request)
    {
        $adminId = session('admin_2fa_pending');
        
        if (!$adminId) {
            return redirect()->route('admin.login');
        }

        $admin = Admin::find($adminId);
        
        if (!$admin) {
            return redirect()->route('admin.login');
        }

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $code = $request->input('code');

        // Try TOTP code first
        if ($this->twoFactorService->verifyCode($admin, $code)) {
            auth()->guard('admin')->login($admin);
            session()->forget('admin_2fa_pending');
            return redirect()->intended('/admin');
        }

        // Try recovery code
        if ($admin->verifyRecoveryCode($code)) {
            auth()->guard('admin')->login($admin);
            session()->forget('admin_2fa_pending');
            return redirect()->intended('/admin');
        }

        return back()->withErrors(['code' => 'Invalid verification code']);
    }
}
