#!/usr/bin/env php
<?php
/**
 * Merge .env files: start from a CLEAN base (.env.example), apply overrides
 * from root .env, and write the result to laravel/.env.
 *
 * IMPORTANT: The base file must be the .env.example (never the output file
 * itself) so that corruption from previous runs, key:generate, or any other
 * process cannot accumulate.
 *
 * Usage: php merge-env.php <base:.env.example> <overrides:root/.env> <output:laravel/.env>
 */
$baseFile = $argv[1] ?? null;
$overrideFile = $argv[2] ?? null;
$outputFile = $argv[3] ?? null;

if (!$baseFile || !$overrideFile || !$outputFile) {
    fwrite(STDERR, "Usage: php merge-env.php <base> <overrides> <output>\n");
    fwrite(STDERR, "  base      = clean starting point (e.g. laravel/.env.example)\n");
    fwrite(STDERR, "  overrides = values that win on conflict (e.g. .env)\n");
    fwrite(STDERR, "  output    = file to write (e.g. laravel/.env)\n");
    exit(1);
}
if (!is_readable($baseFile)) {
    fwrite(STDERR, "Error: cannot read base file: $baseFile\n");
    exit(1);
}
if (!is_readable($overrideFile)) {
    fwrite(STDERR, "Error: cannot read override file: $overrideFile\n");
    exit(1);
}

function parse(string $path): array {
    $vars = [];
    $content = file_get_contents($path);
    if ($content === false) {
        return $vars;
    }
    $content = str_replace(["\r\n", "\r"], "\n", $content);
    foreach (explode("\n", $content) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        if (preg_match('/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/', $line, $m)) {
            $vars[$m[1]] = $m[2];
        }
    }
    return $vars;
}

$base = parse($baseFile);
$overrides = parse($overrideFile);

// Overrides win; associative array guarantees unique keys
$merged = array_replace($base, $overrides);
ksort($merged);

$out = '';
foreach ($merged as $k => $v) {
    $out .= $k . '=' . $v . "\n";
}

// Atomic write: temp file + rename prevents partial/corrupted reads
$tmp = $outputFile . '.tmp.' . getmypid();
if (file_put_contents($tmp, $out, LOCK_EX) === false) {
    fwrite(STDERR, "Error: failed to write $tmp\n");
    @unlink($tmp);
    exit(1);
}
if (!rename($tmp, $outputFile)) {
    fwrite(STDERR, "Error: failed to rename $tmp -> $outputFile\n");
    @unlink($tmp);
    exit(1);
}
