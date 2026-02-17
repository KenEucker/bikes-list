<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Setting;
use App\Providers\SettingsServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class SettingsOverrideConfigTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Config::set('env_map', [
            'APP_NAME' => 'app.name',
            'APP_DEBUG' => 'app.debug',
        ]);
    }

    public function test_db_override_applied_to_config_after_boot(): void
    {
        Setting::create([
            'key' => 'APP_NAME',
            'value' => 'OverriddenName',
            'type' => 'string',
        ]);

        Cache::forget(config('settings.cache_key', 'settings.overrides'));
        $provider = $this->app->getProvider(SettingsServiceProvider::class);
        $provider->boot();

        $this->assertSame('OverriddenName', config('app.name'));
    }

    public function test_boolean_override_casted(): void
    {
        Setting::create([
            'key' => 'APP_DEBUG',
            'value' => 'true',
            'type' => 'boolean',
        ]);

        Cache::forget(config('settings.cache_key', 'settings.overrides'));
        Config::set('env_map', ['APP_DEBUG' => 'app.debug']);
        $this->app->getProvider(SettingsServiceProvider::class)->boot();

        $this->assertTrue(config('app.debug'));
    }
}
