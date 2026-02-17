<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Settings;

use App\Models\Setting;
use App\Orchid\Layouts\Settings\SettingsEditLayout;
use App\Orchid\Layouts\Settings\SettingsListLayout;
use App\Services\EnvExampleParser;
use App\Services\SettingsResolver;
use App\Services\SettingsValueCaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class SettingsListScreen extends Screen
{
    public function query(): iterable
    {
        $parser = new EnvExampleParser;
        $resolver = new SettingsResolver($parser, new SettingsValueCaster);
        $parsed = $parser->parse();
        $envMap = config('env_map', []);
        $overrides = Cache::remember(
            config('settings.cache_key', 'settings.overrides'),
            config('settings.cache_ttl', 3600),
            fn () => Setting::all()->keyBy('key')
        );
        $resolved = $resolver->resolve($parsed, $envMap, $overrides);

        $hideSecrets = (bool) request('hide_secrets', true);
        $search = trim((string) request('search', ''));
        $source = request('source', '');

        if ($hideSecrets) {
            $resolved = array_values(array_filter($resolved, fn (array $r) => ! ($r['is_secret'] ?? false)));
        }
        if ($search !== '') {
            $resolved = array_values(array_filter($resolved, fn (array $r) => stripos($r['name'], $search) !== false));
        }
        if ($source !== '') {
            $resolved = array_values(array_filter($resolved, fn (array $r) => ($r['source'] ?? '') === $source));
        }

        return [
            'settings' => $resolved,
            'hide_secrets' => $hideSecrets,
        ];
    }

    public function name(): ?string
    {
        return __('Settings');
    }

    public function description(): ?string
    {
        return __('Application settings discovered from .env.example. Override values in the database to take precedence over environment variables.');
    }

    public function permission(): ?iterable
    {
        return ['platform.settings'];
    }

    public function commandBar(): iterable
    {
        return [];
    }

    public function layout(): iterable
    {
        return [
            Layout::view('orchid.settings-filters'),
            SettingsListLayout::class,
            Layout::modal('editSettingModal', SettingsEditLayout::class)
                ->title(__('Edit override'))
                ->deferred('loadSettingOnOpenModal')
                ->applyButton(__('Save')),
        ];
    }

    /**
     * Load data when opening the edit override modal.
     *
     * @return array<string, mixed>
     */
    public function loadSettingOnOpenModal(Request $request): iterable
    {
        $key = (string) $request->input('key', '');
        $parser = new EnvExampleParser;
        $parsed = $parser->parse();
        $entry = null;
        foreach ($parsed as $e) {
            if ($e['key'] === $key) {
                $entry = $e;
                break;
            }
        }
        $envMap = config('env_map', []);
        $mappedKeys = $envMap[$key] ?? null;
        $mappedConfigKeys = is_array($mappedKeys) ? $mappedKeys : ($mappedKeys !== null ? [$mappedKeys] : []);
        $setting = Setting::find($key);
        $caster = new SettingsValueCaster;
        $type = $setting?->type ?? ($entry ? $caster->inferTypeFromExample($entry['value']) : 'string');

        return [
            'setting_key' => $key,
            'setting_mapped_config' => implode(', ', $mappedConfigKeys),
            'setting_type' => $type,
            'setting_value' => $setting?->value ?? '',
            'can_override' => $entry !== null && $mappedConfigKeys !== [],
        ];
    }

    public function saveOverride(Request $request): void
    {
        $key = $request->input('setting_key');
        $value = $request->input('setting_value');
        $type = $request->input('setting_type', 'string');

        $envMap = config('env_map', []);
        if (empty($envMap[$key])) {
            Toast::error(__('This setting cannot be overridden (not in env map).'));
            return;
        }

        $parser = new EnvExampleParser;
        $parsed = $parser->parse();
        $inExample = false;
        foreach ($parsed as $e) {
            if ($e['key'] === $key) {
                $inExample = true;
                break;
            }
        }
        if (! $inExample) {
            Toast::error(__('This setting is not in .env.example.'));
            return;
        }

        $caster = new SettingsValueCaster;
        $stored = $caster->toStoredValue($value, $type);
        if ($type === 'json' && $value !== '' && $stored === null) {
            Toast::error(__('Invalid JSON value.'));
            return;
        }

        $setting = Setting::find($key) ?? new Setting(['key' => $key]);
        $setting->value = $stored;
        $setting->type = $type;
        if (auth()->check()) {
            $setting->updated_by = auth()->id();
            if (! $setting->exists) {
                $setting->created_by = auth()->id();
            }
        }
        $setting->save();

        Toast::success(__('Override saved.'));
    }

    public function clearOverride(Request $request): void
    {
        $key = $request->input('key');
        Setting::find($key)?->delete();
        Toast::info(__('Override cleared.'));
    }
}
