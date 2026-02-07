<?php

namespace Tests\Feature\Auth;

use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;
use Tests\TestCase;

class SocialLoginTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Socialite::clearResolvedInstance(\Laravel\Socialite\Contracts\Factory::class);
        Mockery::close();
        parent::tearDown();
    }

    private function createSocialiteUser(string $id, string $email, string $name): SocialiteUser
    {
        $user = new SocialiteUser;
        $user->id = $id;
        $user->email = $email;
        $user->name = $name;
        $user->avatar = 'https://example.com/avatar.png';
        $user->token = 'secret-token';
        $user->refreshToken = null;
        $user->expiresIn = 3600;

        return $user;
    }

    public function test_redirect_to_google_generates_oauth_url(): void
    {
        $redirectUrl = 'https://accounts.google.com/o/oauth2/auth?client_id=test';
        $provider = Mockery::mock(ProviderContract::class);
        $provider->shouldReceive('redirect')->andReturn(new SymfonyRedirectResponse($redirectUrl));
        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/auth/google/redirect');

        $response->assertRedirect($redirectUrl);
    }

    public function test_redirect_to_discord_generates_oauth_url(): void
    {
        $redirectUrl = 'https://discord.com/api/oauth2/authorize?client_id=test';
        $provider = Mockery::mock(ProviderContract::class);
        $provider->shouldReceive('redirect')->andReturn(new SymfonyRedirectResponse($redirectUrl));
        Socialite::shouldReceive('driver')->with('discord')->andReturn($provider);

        $response = $this->get('/auth/discord/redirect');

        $response->assertRedirect($redirectUrl);
    }

    public function test_callback_with_valid_google_user_creates_new_user_and_social_account(): void
    {
        Socialite::fake('google', $this->createSocialiteUser('google-123', 'newuser@example.com', 'New User'));

        $this->followingRedirects()->get('/auth/google/callback');

        $user = User::query()->where('email', 'newuser@example.com')->first();
        $this->assertNotNull($user);
        $this->assertSame('New User', $user->name);
        $this->assertNotNull($user->email_verified_at);
        $this->assertNull($user->password);

        $account = SocialAccount::query()->where('user_id', $user->id)->where('provider', 'google')->first();
        $this->assertNotNull($account);
        $this->assertSame('google-123', $account->provider_id);
        $this->assertAuthenticatedAs($user);
    }

    public function test_callback_with_valid_discord_user_creates_new_user_and_social_account(): void
    {
        Socialite::fake('discord', $this->createSocialiteUser('discord-456', 'discord@example.com', 'Discord User'));

        $this->followingRedirects()->get('/auth/discord/callback');

        $user = User::query()->where('email', 'discord@example.com')->first();
        $this->assertNotNull($user);
        $account = SocialAccount::query()->where('user_id', $user->id)->where('provider', 'discord')->first();
        $this->assertNotNull($account);
        $this->assertAuthenticatedAs($user);
    }

    public function test_callback_links_social_account_to_existing_user_with_matching_email(): void
    {
        $existingUser = User::factory()->create(['email' => 'existing@example.com']);
        Socialite::fake('google', $this->createSocialiteUser('google-789', 'existing@example.com', 'Existing User'));

        $this->followingRedirects()->get('/auth/google/callback');

        $this->assertAuthenticatedAs($existingUser);
        $this->assertDatabaseCount('users', 1);
        $account = SocialAccount::query()->where('user_id', $existingUser->id)->where('provider', 'google')->first();
        $this->assertNotNull($account);
    }

    public function test_callback_logs_in_existing_user_who_already_has_linked_social_account(): void
    {
        $user = User::factory()->create(['email' => 'linked@example.com', 'password' => null]);
        SocialAccount::query()->create([
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => 'google-existing',
            'provider_token' => 'old-token',
        ]);
        Socialite::fake('google', $this->createSocialiteUser('google-existing', 'linked@example.com', 'Linked User'));

        $this->followingRedirects()->get('/auth/google/callback');

        $this->assertAuthenticatedAs($user);
        $account = $user->socialAccounts()->forProvider('google')->first();
        $this->assertSame('secret-token', $account->provider_token);
    }

    public function test_authenticated_user_can_link_new_provider(): void
    {
        $user = User::factory()->create(['email' => 'user@example.com']);
        Socialite::fake('discord', $this->createSocialiteUser('discord-link', 'user@example.com', 'User'));

        $response = $this->actingAs($user)->get('/auth/discord/callback');

        $response->assertRedirect();
        $this->assertStringContainsString('account/settings', $response->headers->get('Location'));
        $response->assertSessionHas('status', 'Discord account linked.');
        $this->assertDatabaseHas('social_accounts', ['user_id' => $user->id, 'provider' => 'discord', 'provider_id' => 'discord-link']);
    }

    public function test_authenticated_user_can_disconnect_provider_when_another_auth_method_exists(): void
    {
        $user = User::factory()->create(['email' => 'user@example.com']); // has password from factory
        SocialAccount::query()->create([
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => 'google-123',
        ]);

        $response = $this->actingAs($user)->post(route('auth.social.disconnect', ['provider' => 'google']));

        $response->assertRedirect(route('account.settings'));
        $response->assertSessionHas('status', 'Google account disconnected.');
        $this->assertDatabaseMissing('social_accounts', ['user_id' => $user->id, 'provider' => 'google']);
    }

    public function test_authenticated_user_cannot_disconnect_last_auth_method(): void
    {
        $user = User::factory()->create(['email' => 'onlysocial@example.com', 'password' => null]);
        SocialAccount::query()->create([
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => 'google-only',
        ]);

        $response = $this->actingAs($user)->post(route('auth.social.disconnect', ['provider' => 'google']));

        $response->assertRedirect(route('account.settings'));
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('social_accounts', ['user_id' => $user->id, 'provider' => 'google']);
    }

    public function test_callback_with_failed_oauth_redirects_with_error(): void
    {
        $provider = Mockery::mock(ProviderContract::class);
        $provider->shouldReceive('user')->andThrow(new \Exception('OAuth failed'));
        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('login'));
        $response->assertSessionHas('error');
        $this->assertGuest();
    }

    public function test_invalid_provider_returns_404(): void
    {
        $response = $this->get('/auth/invalid/redirect');
        $response->assertStatus(404);

        $response = $this->get('/auth/invalid/callback');
        $response->assertStatus(404);
    }

    public function test_token_fields_are_stored_encrypted(): void
    {
        Socialite::fake('google', $this->createSocialiteUser('enc-1', 'enc@example.com', 'Enc User'));

        $this->followingRedirects()->get('/auth/google/callback');

        $account = SocialAccount::query()->where('provider_id', 'enc-1')->first();
        $this->assertNotNull($account);
        $rawToken = $account->getRawOriginal('provider_token');
        $this->assertNotSame('secret-token', $rawToken);
        $this->assertSame('secret-token', $account->provider_token);
    }
}
