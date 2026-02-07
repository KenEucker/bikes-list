#!/usr/bin/env php
<?php
/**
 * 1. Read laravel/.env into object
 * 2. Read root .env into object
 * 3. Root overwrites laravel
 * 4. Write object to file (replace entirely, no append)
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
    foreach (explode("\n", str_replace(["\r\n", "\r"], "\n", $content)) as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) continue;
        if (preg_match('/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/s', $line, $m)) {
            $vars[$m[1]] = $m[2];
        }
    }
    return $vars;
}

$laravel = parse($laravelEnv);
$root = parse($rootEnv);
$merged = array_replace($laravel, $root);
ksort($merged);

$out = '';
foreach ($merged as $k => $v) {
    $out .= $k . '=' . $v . "\n";
}
file_put_contents($laravelEnv, $out);
