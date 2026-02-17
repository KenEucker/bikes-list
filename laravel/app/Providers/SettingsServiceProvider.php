<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Setting;
use App\Services\SettingsValueCaster;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

/**
 * Applies database setting overrides to Laravel config at runtime.
 * Overrides are cached; cache is invalidated when a Setting is saved or deleted.
 * This runs after config is loaded, so config() will reflect DB overrides
 * without modifying any config files (works with config:cache).
 */
class SettingsServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        if (! Schema::hasTable('settings')) {
            return;
        }

        $cacheKey = config('settings.cache_key', 'settings.overrides');
        $cacheTtl = config('settings.cache_ttl', 3600);

        $overrides = Cache::remember($cacheKey, $cacheTtl, function () {
            return Setting::all()->keyBy('key');
        });

        $envMap = config('env_map', []);
        $caster = new SettingsValueCaster();

        foreach ($overrides as $key => $setting) {
            /** @var Setting $setting */
            $configKeys = $envMap[$key] ?? null;
            if ($configKeys === null) {
                continue;
            }
            $keys = is_array($configKeys) ? $configKeys : [$configKeys];
            $castValue = $caster->cast($setting->value, $setting->type);
            foreach ($keys as $configKey) {
                config()->set($configKey, $castValue);
            }
        }
    }
}
