<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Models\Setting;
use App\Services\EnvExampleParser;
use App\Services\SettingsResolver;
use App\Services\SettingsValueCaster;
use Illuminate\Support\Collection;
use Tests\TestCase;

class SettingsResolverTest extends TestCase
{
    public function test_precedence_database_over_env(): void
    {
        $parsed = [
            ['key' => 'APP_NAME', 'value' => 'FromExample', 'comment' => ''],
        ];
        $envMap = ['APP_NAME' => 'app.name'];
        $overrides = new Collection([
            'APP_NAME' => new Setting(['key' => 'APP_NAME', 'value' => 'FromDB', 'type' => 'string']),
        ]);
        $resolver = new SettingsResolver(new EnvExampleParser, new SettingsValueCaster);
        $result = $resolver->resolve($parsed, $envMap, $overrides);
        $this->assertCount(1, $result);
        $this->assertSame('database', $result[0]['source']);
        $this->assertSame('FromDB', $result[0]['effective_value']);
    }

    public function test_precedence_env_over_example(): void
    {
        $parsed = [
            ['key' => 'APP_NAME', 'value' => 'FromExample', 'comment' => ''],
        ];
        $envMap = ['APP_NAME' => 'app.name'];
        $overrides = new Collection;
        $envGetter = fn (string $k): ?string => $k === 'APP_NAME' ? 'FromEnv' : null;
        $resolver = new SettingsResolver(new EnvExampleParser, new SettingsValueCaster, $envGetter);
        $result = $resolver->resolve($parsed, $envMap, $overrides);
        $this->assertCount(1, $result);
        $this->assertSame('env', $result[0]['source']);
        $this->assertSame('FromEnv', $result[0]['effective_value']);
    }

    public function test_precedence_example_when_no_env(): void
    {
        $parsed = [
            ['key' => 'APP_NAME', 'value' => 'FromExample', 'comment' => ''],
        ];
        $envMap = ['APP_NAME' => 'app.name'];
        $overrides = new Collection;
        $envGetter = fn (string $k): ?string => null;
        $resolver = new SettingsResolver(new EnvExampleParser, new SettingsValueCaster, $envGetter);
        $result = $resolver->resolve($parsed, $envMap, $overrides);
        $this->assertCount(1, $result);
        $this->assertSame('example', $result[0]['source']);
        $this->assertSame('FromExample', $result[0]['effective_value']);
    }

    public function test_precedence_unknown_when_all_empty(): void
    {
        $parsed = [
            ['key' => 'APP_NAME', 'value' => '', 'comment' => ''],
        ];
        $envMap = ['APP_NAME' => 'app.name'];
        $overrides = new Collection;
        $envGetter = fn (string $k): ?string => null;
        $resolver = new SettingsResolver(new EnvExampleParser, new SettingsValueCaster, $envGetter);
        $result = $resolver->resolve($parsed, $envMap, $overrides);
        $this->assertCount(1, $result);
        $this->assertSame('unknown', $result[0]['source']);
    }

    public function test_mapped_config_keys_single(): void
    {
        $parsed = [['key' => 'APP_NAME', 'value' => 'X', 'comment' => '']];
        $envMap = ['APP_NAME' => 'app.name'];
        $resolver = new SettingsResolver(new EnvExampleParser, new SettingsValueCaster);
        $result = $resolver->resolve($parsed, $envMap, new Collection);
        $this->assertSame(['app.name'], $result[0]['mapped_config_keys']);
    }

    public function test_mapped_config_keys_array(): void
    {
        $parsed = [['key' => 'X', 'value' => 'Y', 'comment' => '']];
        $envMap = ['X' => ['app.a', 'app.b']];
        $resolver = new SettingsResolver(new EnvExampleParser, new SettingsValueCaster);
        $result = $resolver->resolve($parsed, $envMap, new Collection);
        $this->assertSame(['app.a', 'app.b'], $result[0]['mapped_config_keys']);
    }
}
