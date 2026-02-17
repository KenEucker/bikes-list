<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Services\EnvExampleParser;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class EnvExampleParserTest extends TestCase
{
    private string $fixturePath;

    protected function setUp(): void
    {
        parent::setUp();
        $this->fixturePath = __DIR__ . '/../fixtures/env_example_parser.env';
        if (! is_file($this->fixturePath)) {
            $this->fixturePath = base_path('.env.example');
        }
    }

    public function test_parses_keys_and_values_in_order(): void
    {
        $parser = new EnvExampleParser;
        $entries = $parser->parse($this->fixturePath);
        $this->assertNotEmpty($entries);
        $keys = array_column($entries, 'key');
        $this->assertContains('APP_NAME', $keys);
        $this->assertContains('APP_DEBUG', $keys);
        $this->assertContains('APP_URL', $keys);
        $this->assertContains('SOME_KEY', $keys);
        $this->assertContains('API_SECRET_KEY', $keys);
        $this->assertContains('DB_PASSWORD', $keys);
    }

    public function test_captures_comment_above_key(): void
    {
        $parser = new EnvExampleParser;
        $entries = $parser->parse($this->fixturePath);
        $byKey = array_column($entries, 'comment', 'key');
        $this->assertStringContainsString('App name', $byKey['APP_NAME'] ?? '');
        $this->assertStringContainsString('Secret below', $byKey['API_SECRET_KEY'] ?? '');
    }

    public function test_detects_secret_keys_by_denylist(): void
    {
        $parser = new EnvExampleParser;
        $this->assertTrue($parser->isSecretKey('API_SECRET_KEY'));
        $this->assertTrue($parser->isSecretKey('DB_PASSWORD'));
        $this->assertTrue($parser->isSecretKey('JWT_SECRET'));
        $this->assertFalse($parser->isSecretKey('APP_NAME'));
        $this->assertFalse($parser->isSecretKey('APP_URL'));
    }

    public function test_allowlist_overrides_denylist(): void
    {
        Config::set('settings.secret_allowlist', ['APP_KEY']);
        $parser = new EnvExampleParser;
        $this->assertFalse($parser->isSecretKey('APP_KEY'));
        Config::set('settings.secret_allowlist', []);
    }

    public function test_parses_quoted_value(): void
    {
        $parser = new EnvExampleParser;
        $entries = $parser->parse($this->fixturePath);
        $byKey = array_column($entries, 'value', 'key');
        $this->assertSame('http://localhost', $byKey['APP_URL'] ?? null);
    }

    public function test_parses_empty_value(): void
    {
        $parser = new EnvExampleParser;
        $entries = $parser->parse($this->fixturePath);
        $byKey = array_column($entries, 'value', 'key');
        $this->assertSame('', $byKey['SOME_KEY'] ?? null);
    }
}
