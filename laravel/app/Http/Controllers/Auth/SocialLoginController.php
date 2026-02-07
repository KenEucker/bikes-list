<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;

class SocialLoginController extends Controller
{
    private const SUPPORTED_PROVIDERS = ['google', 'discord'];

    /**
     * Redirect to the OAuth provider.
     */
    public function redirect(string $provider): RedirectResponse
    {
        if (! in_array($provider, self::SUPPORTED_PROVIDERS, true)) {
            abort(404);
        }

        $socialiteRedirect = Socialite::driver($provider)->redirect();

        return redirect()->away($socialiteRedirect->getTargetUrl());
    }

    /**
     * Handle the OAuth callback: login, link account, or create user.
     */
    public function callback(string $provider): RedirectResponse
    {
        if (! in_array($provider, self::SUPPORTED_PROVIDERS, true)) {
            abort(404);
        }

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Throwable $e) {
            return $this->redirectToLoginWithError('We could not sign you in with ' . $provider . '. Please try again.');
        }

        return DB::transaction(function () use ($provider, $socialUser) {
            $socialAccount = SocialAccount::query()
                ->forProvider($provider)
                ->where('provider_id', $socialUser->getId())
                ->first();

            if ($socialAccount) {
                $this->updateSocialAccountTokens($socialAccount, $socialUser);
                Auth::login($socialAccount->user, true);
                return $this->redirectAfterLogin();
            }

            if (Auth::check()) {
                $this->createSocialAccountForUser(Auth::user(), $provider, $socialUser);
                return redirect()->route('account.settings')
                    ->with('status', ucfirst($provider) . ' account linked.');
            }

            $userByEmail = User::query()->where('email', $socialUser->getEmail())->first();
            if ($userByEmail) {
                $this->createSocialAccountForUser($userByEmail, $provider, $socialUser);
                Auth::login($userByEmail, true);
                return $this->redirectAfterLogin();
            }

            $newUser = $this->createUserFromSocialite($socialUser);
            $this->createSocialAccountForUser($newUser, $provider, $socialUser);
            Auth::login($newUser, true);
            return $this->redirectAfterLogin();
        });
    }

    /**
     * Disconnect a social account (auth required). Prevents lockout.
     */
    public function disconnect(string $provider): RedirectResponse
    {
        if (! in_array($provider, self::SUPPORTED_PROVIDERS, true)) {
            abort(404);
        }

        $user = Auth::user();
        $account = $user->socialAccounts()->forProvider($provider)->first();

        if (! $account) {
            return redirect()->route('account.settings')
                ->with('status', 'That account is not linked.');
        }

        $otherSocialCount = $user->socialAccounts()->where('id', '!=', $account->id)->count();
        $hasPassword = $user->password !== null && $user->password !== '';

        if ($otherSocialCount === 0 && ! $hasPassword) {
            return redirect()->route('account.settings')
                ->with('error', 'You must have at least one other way to sign in (another connected account or a password) before disconnecting.');
        }

        $account->delete();

        return redirect()->route('account.settings')
            ->with('status', ucfirst($provider) . ' account disconnected.');
    }

    private function redirectToLoginWithError(string $message): RedirectResponse
    {
        $loginRoute = request()->is('account/*') ? 'account.sign-in' : 'login';
        return redirect()->route($loginRoute)->with('error', $message);
    }

    private function updateSocialAccountTokens(SocialAccount $socialAccount, SocialiteUser $socialUser): void
    {
        $socialAccount->update([
            'provider_token'         => $socialUser->token,
            'provider_refresh_token' => $socialUser->refreshToken,
            'token_expires_at'       => $socialUser->expiresIn ? now()->addSeconds($socialUser->expiresIn) : null,
            'avatar_url'             => $socialUser->getAvatar(),
            'provider_email'         => $socialUser->getEmail(),
        ]);
    }

    private function createSocialAccountForUser(User $user, string $provider, SocialiteUser $socialUser): void
    {
        SocialAccount::query()->updateOrCreate(
            [
                'user_id'     => $user->id,
                'provider'    => $provider,
                'provider_id' => $socialUser->getId(),
            ],
            [
                'provider_token'         => $socialUser->token,
                'provider_refresh_token' => $socialUser->refreshToken,
                'token_expires_at'       => $socialUser->expiresIn ? now()->addSeconds($socialUser->expiresIn) : null,
                'avatar_url'             => $socialUser->getAvatar(),
                'provider_email'         => $socialUser->getEmail(),
            ]
        );
    }

    private function createUserFromSocialite(SocialiteUser $socialUser): User
    {
        return User::query()->create([
            'name'              => $socialUser->getName() ?: $socialUser->getEmail(),
            'email'             => $socialUser->getEmail(),
            'email_verified_at' => now(),
            'password'          => null,
        ]);
    }

    private function redirectAfterLogin(): RedirectResponse
    {
        $intended = session()->pull('url.intended', null);
        if ($intended) {
            return redirect()->to($intended);
        }
        $base = request()->getSchemeAndHttpHost();
        $host = request()->getHost();
        if (Str::contains($host, '.') && $host !== 'localhost') {
            return redirect()->to($base . '/dashboard');
        }
        return redirect()->to($base . '/');
    }
}
