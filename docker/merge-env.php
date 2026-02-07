#!/usr/bin/env php
<?php
/**
 * Merge two .env files: laravel/.env (base) + root .env (overrides).
 * Root values overwrite laravel values for matching keys.
 * The result completely replaces laravel/.env (no append, no duplicates).
 *
 * Usage: php merge-env.php <laravel/.env> <root/.env>
 */
$laravelEnv = $argv[1] ?? null;
$rootEnv = $argv[2] ?? null;
if (!$laravelEnv || !$rootEnv || !is_readable($laravelEnv) || !is_readable($rootEnv)) {
    fwrite(STDERR, "Usage: php merge-env.php <laravel/.env> <root/.env>\n");
    exit(1);
}

function parse(string $path): array {
    $vars = [];
    $content = file_get_contents($path);
    if ($content === false) {
        fwrite(STDERR, "Error: cannot read $path\n");
        return $vars;
    }
    // Normalise line endings to \n
    $content = str_replace(["\r\n", "\r"], "\n", $content);
    foreach (explode("\n", $content) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        // Match KEY=VALUE (no /s flag — single-line match only)
        if (preg_match('/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/', $line, $m)) {
            $vars[$m[1]] = $m[2];
        }
    }
    return $vars;
}

$laravel = parse($laravelEnv);
$root = parse($rootEnv);

// Root overrides laravel; associative array guarantees unique keys
$merged = array_replace($laravel, $root);
ksort($merged);

$out = '';
foreach ($merged as $k => $v) {
    $out .= $k . '=' . $v . "\n";
}

// Atomic write: temp file + rename prevents partial/corrupted reads
$tmp = $laravelEnv . '.tmp.' . getmypid();
if (file_put_contents($tmp, $out, LOCK_EX) === false) {
    fwrite(STDERR, "Error: failed to write $tmp\n");
    @unlink($tmp);
    exit(1);
}
if (!rename($tmp, $laravelEnv)) {
    fwrite(STDERR, "Error: failed to rename $tmp -> $laravelEnv\n");
    @unlink($tmp);
    exit(1);
}
