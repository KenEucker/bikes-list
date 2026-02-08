<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Setting;

/**
 * Casts raw string values to PHP types for settings (bool, int, float, json, string).
 * Used by SettingsResolver and SettingsServiceProvider.
 */
final class SettingsValueCaster
{
    public const TYPE_STRING = 'string';
    public const TYPE_BOOLEAN = 'boolean';
    public const TYPE_INTEGER = 'integer';
    public const TYPE_FLOAT = 'float';
    public const TYPE_JSON = 'json';

    public const TYPES = [
        self::TYPE_STRING,
        self::TYPE_BOOLEAN,
        self::TYPE_INTEGER,
        self::TYPE_FLOAT,
        self::TYPE_JSON,
    ];

    /**
     * Cast a raw value to PHP type. Returns null if value is null/empty and type allows it.
     */
    public function cast(?string $value, ?string $type = null): mixed
    {
        if ($value === null || $value === '') {
            return $type === self::TYPE_BOOLEAN ? false : ($value ?? null);
        }

        $type = $type ?? self::TYPE_STRING;

        return match ($type) {
            self::TYPE_BOOLEAN => $this->toBool($value),
            self::TYPE_INTEGER => $this->toInt($value),
            self::TYPE_FLOAT => $this->toFloat($value),
            self::TYPE_JSON => $this->toJson($value),
            default => $value,
        };
    }

    public function toBool(string $value): bool
    {
        $v = strtolower(trim($value));
        if (in_array($v, ['true', '1', 'on', 'yes'], true)) {
            return true;
        }
        if (in_array($v, ['false', '0', 'off', 'no', ''], true)) {
            return false;
        }
        return (bool) $value;
    }

    public function toInt(string $value): ?int
    {
        if (is_numeric($value)) {
            return (int) $value;
        }
        return null;
    }

    public function toFloat(string $value): ?float
    {
        if (is_numeric($value)) {
            return (float) $value;
        }
        return null;
    }

    /**
     * @return array<int|string, mixed>|null
     */
    public function toJson(string $value): ?array
    {
        $decoded = json_decode($value, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }
        return null;
    }

    /**
     * Infer type from example value string.
     */
    public function inferTypeFromExample(string $exampleValue): string
    {
        $trimmed = trim($exampleValue);
        if ($trimmed === '') {
            return self::TYPE_STRING;
        }
        if (in_array(strtolower($trimmed), ['true', 'false', '1', '0', 'on', 'off'], true)) {
            return self::TYPE_BOOLEAN;
        }
        if (is_numeric($trimmed)) {
            return str_contains($trimmed, '.') ? self::TYPE_FLOAT : self::TYPE_INTEGER;
        }
        if (str_starts_with($trimmed, '[') || str_starts_with($trimmed, '{')) {
            return self::TYPE_JSON;
        }
        return self::TYPE_STRING;
    }

    /**
     * Normalize value for storage (e.g. bool to "true"/"false").
     */
    public function toStoredValue(mixed $value, string $type): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }
        return match ($type) {
            self::TYPE_BOOLEAN => $value ? 'true' : 'false',
            self::TYPE_INTEGER, self::TYPE_FLOAT => (string) $value,
            self::TYPE_JSON => is_array($value) ? json_encode($value) : (string) $value,
            default => (string) $value,
        };
    }
}
