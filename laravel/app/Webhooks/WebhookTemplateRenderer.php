<?php

declare(strict_types=1);

namespace App\Webhooks;

use Illuminate\Support\Arr;

class WebhookTemplateRenderer
{
    /**
     * Render a template string by replacing {{ path }} placeholders with values from the data.
     */
    public function render(string $template, array $data): string
    {
        return preg_replace_callback(
            '/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/',
            function (array $matches) use ($data): string {
                $path = trim($matches[1]);
                $value = Arr::get($data, $path);

                return $this->encodeValue($value);
            },
            $template
        );
    }

    private function encodeValue(mixed $value): string
    {
        if ($value === null) {
            return 'null';
        }
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }
        if (is_int($value) || is_float($value)) {
            return (string) $value;
        }
        if (is_array($value)) {
            return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }
        return json_encode((string) $value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    /**
     * Get the list of available variable paths for the given event names.
     *
     * @param  array<string>  $eventNames
     * @return array<string>
     */
    public static function variablesForEvents(array $eventNames): array
    {
        $common = config('webhooks.template_variables.common', ['event', 'timestamp', 'delivery_id']);
        $prefixes = ['common' => $common];
        $varConfig = config('webhooks.template_variables', []);

        foreach ($varConfig as $key => $vars) {
            if ($key === 'common') {
                continue;
            }
            $prefixes[$key] = $vars;
        }

        $result = [...$common];
        foreach ($eventNames as $eventName) {
            $prefix = explode('.', $eventName)[0] ?? '';
            if ($prefix && isset($prefixes[$prefix])) {
                foreach ($prefixes[$prefix] as $v) {
                    if (! in_array($v, $result, true)) {
                        $result[] = $v;
                    }
                }
            }
        }

        return $result;
    }
}
