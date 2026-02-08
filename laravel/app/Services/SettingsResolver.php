<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Collection;

/**
 * Resolves effective value and source for each discovered env var.
 */
final class SettingsResolver
{
    public const SOURCE_DATABASE = 'database';
    public const SOURCE_ENV = 'env';
    public const SOURCE_EXAMPLE = 'example';
    public const SOURCE_UNKNOWN = 'unknown';

    /** @var callable(string): ?string */
    private $envGetter;

    public function __construct(
        private EnvExampleParser $parser,
        private SettingsValueCaster $caster,
        ?callable $envGetter = null
    ) {
        $this->envGetter = $envGetter ?? fn (string $key): ?string => env($key) !== null && env($key) !== '' ? (string) env($key) : null;
    }

    /**
     * @param list<array{key: string, value: string, comment: string}> $parsedEntries
     * @param array<string, string|list<string>> $envMap
     * @param Collection<string, Setting> $dbOverrides
     * @return list<array{name: string, description: string, example_value: string, env_value: string|null, db_override_value: string|null, effective_value: mixed, effective_value_display: string, source: string, mapped_config_keys: list<string>, is_secret: bool, type: string|null}>
     */
    public function resolve(array $parsedEntries, array $envMap, Collection $dbOverrides): array
    {
        $result = [];

        foreach ($parsedEntries as $entry) {
            $key = $entry['key'];
            $exampleValue = $entry['value'];
            $description = $entry['comment'];

            $envValue = $this->envGet($key);
            $dbRow = $dbOverrides->get($key);

            $type = $dbRow?->type ?? $this->caster->inferTypeFromExample($exampleValue);
            $rawForEffective = $dbRow?->value ?? $envValue ?? $exampleValue;
            $effectiveValue = $rawForEffective !== null && $rawForEffective !== ''
                ? $this->caster->cast($rawForEffective, $type)
                : null;

            if ($dbRow !== null) {
                $source = self::SOURCE_DATABASE;
            } elseif ($envValue !== null && $envValue !== '') {
                $source = self::SOURCE_ENV;
            } elseif ($exampleValue !== null && $exampleValue !== '') {
                $source = self::SOURCE_EXAMPLE;
            } else {
                $source = self::SOURCE_UNKNOWN;
            }

            $mappedConfigKeys = $this->normalizeConfigKeys($envMap[$key] ?? null);
            $isSecret = $this->parser->isSecretKey($key);

            $effectiveValueDisplay = $effectiveValue !== null && $effectiveValue !== ''
                ? (is_bool($effectiveValue) ? ($effectiveValue ? 'true' : 'false') : (string) $effectiveValue)
                : '';

            if ($isSecret && $effectiveValueDisplay !== '') {
                $effectiveValueDisplay = '••••';
            }

            $result[] = [
                'name' => $key,
                'description' => $description,
                'example_value' => $exampleValue,
                'env_value' => $envValue,
                'db_override_value' => $dbRow?->value,
                'effective_value' => $effectiveValue,
                'effective_value_display' => $effectiveValueDisplay,
                'source' => $source,
                'mapped_config_keys' => $mappedConfigKeys,
                'is_secret' => $isSecret,
                'type' => $dbRow?->type ?? $type,
            ];
        }

        return $result;
    }

    private function envGet(string $key): ?string
    {
        $value = ($this->envGetter)($key);
        if ($value === null || $value === '') {
            return null;
        }
        return (string) $value;
    }

    /**
     * @param string|list<string>|null $keys
     * @return list<string>
     */
    private function normalizeConfigKeys(mixed $keys): array
    {
        if ($keys === null) {
            return [];
        }
        return is_array($keys) ? $keys : [$keys];
    }
}
