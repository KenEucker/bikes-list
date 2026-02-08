<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Str;

/**
 * Parses .env.example to discover env keys, values and comment blocks.
 * Used by the admin Settings screen to list configurable variables.
 *
 * Optional: Lines like "# KEY=value" can be treated as discoverable;
 * if implemented, do it consistently and document here.
 */
final class EnvExampleParser
{
    /**
     * Parse .env.example and return entries in file order.
     *
     * @return list<array{key: string, value: string, comment: string}>
     */
    public function parse(?string $path = null): array
    {
        $path = $path ?? config('settings.env_example_path', base_path('.env.example'));

        if (! is_file($path) || ! is_readable($path)) {
            return [];
        }

        $content = (string) file_get_contents($path);
        $lines = preg_split('/\r\n|\r|\n/', $content) ?: [];
        $entries = [];
        $pendingComment = [];

        foreach ($lines as $line) {
            $trimmed = trim($line);

            if ($trimmed === '') {
                $pendingComment = [];
                continue;
            }

            if (str_starts_with($trimmed, '#')) {
                $commentLine = trim((string) substr($trimmed, 1));
                $pendingComment[] = $commentLine;
                continue;
            }

            $entry = $this->parseKeyValue($line);
            if ($entry !== null) {
                $entries[] = [
                    'key' => $entry['key'],
                    'value' => $entry['value'],
                    'comment' => implode("\n", $pendingComment),
                ];
            }

            $pendingComment = [];
        }

        return $entries;
    }

    /**
     * Parse a single line into key and value.
     * Supports KEY=value, KEY="value", KEY=
     *
     * @return array{key: string, value: string}|null
     */
    private function parseKeyValue(string $line): ?array
    {
        if (str_contains($line, '=')) {
            $eq = strpos($line, '=');
            $key = trim(substr($line, 0, $eq));
            if ($key === '' || ! $this->isValidKey($key)) {
                return null;
            }
            $value = trim(substr($line, $eq + 1));
            if (str_starts_with($value, '"') && str_ends_with($value, '"')) {
                $value = substr($value, 1, -1);
            }
            return ['key' => $key, 'value' => $value];
        }

        return null;
    }

    private function isValidKey(string $key): bool
    {
        return preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $key) === 1;
    }

    /**
     * Whether the env key should be treated as secret (hidden in UI by default).
     * Uses config('settings.secret_denylist_substrings') and
     * config('settings.secret_allowlist') so BikesList can tune.
     */
    public function isSecretKey(string $key): bool
    {
        $allowlist = config('settings.secret_allowlist', []);
        if (in_array($key, $allowlist, true)) {
            return false;
        }

        $denylist = config('settings.secret_denylist_substrings', [
            'KEY', 'TOKEN', 'SECRET', 'PASSWORD', 'PASS', 'PRIVATE',
            'JWT', 'OAUTH', 'SIGNING', 'CREDENTIAL', 'CLIENT_SECRET',
        ]);

        $upper = Str::upper($key);
        foreach ($denylist as $substring) {
            if (str_contains($upper, Str::upper($substring))) {
                return true;
            }
        }

        return false;
    }
}
