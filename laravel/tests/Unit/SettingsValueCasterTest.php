<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Services\SettingsValueCaster;
use Tests\TestCase;

class SettingsValueCasterTest extends TestCase
{
    private SettingsValueCaster $caster;

    protected function setUp(): void
    {
        parent::setUp();
        $this->caster = new SettingsValueCaster;
    }

    public function test_casts_boolean(): void
    {
        $this->assertTrue($this->caster->cast('true', SettingsValueCaster::TYPE_BOOLEAN));
        $this->assertTrue($this->caster->cast('1', SettingsValueCaster::TYPE_BOOLEAN));
        $this->assertTrue($this->caster->cast('on', SettingsValueCaster::TYPE_BOOLEAN));
        $this->assertFalse($this->caster->cast('false', SettingsValueCaster::TYPE_BOOLEAN));
        $this->assertFalse($this->caster->cast('0', SettingsValueCaster::TYPE_BOOLEAN));
        $this->assertFalse($this->caster->cast('off', SettingsValueCaster::TYPE_BOOLEAN));
    }

    public function test_casts_integer(): void
    {
        $this->assertSame(42, $this->caster->cast('42', SettingsValueCaster::TYPE_INTEGER));
        $this->assertSame(0, $this->caster->cast('0', SettingsValueCaster::TYPE_INTEGER));
        $this->assertNull($this->caster->cast('abc', SettingsValueCaster::TYPE_INTEGER));
    }

    public function test_casts_float(): void
    {
        $this->assertSame(3.14, $this->caster->cast('3.14', SettingsValueCaster::TYPE_FLOAT));
        $this->assertSame(0.0, $this->caster->cast('0', SettingsValueCaster::TYPE_FLOAT));
        $this->assertNull($this->caster->cast('x', SettingsValueCaster::TYPE_FLOAT));
    }

    public function test_casts_json(): void
    {
        $this->assertSame(['a' => 1], $this->caster->cast('{"a":1}', SettingsValueCaster::TYPE_JSON));
        $this->assertSame([1, 2], $this->caster->cast('[1,2]', SettingsValueCaster::TYPE_JSON));
        $this->assertNull($this->caster->cast('not json', SettingsValueCaster::TYPE_JSON));
    }

    public function test_infer_type_from_example(): void
    {
        $this->assertSame(SettingsValueCaster::TYPE_BOOLEAN, $this->caster->inferTypeFromExample('true'));
        $this->assertSame(SettingsValueCaster::TYPE_BOOLEAN, $this->caster->inferTypeFromExample('false'));
        $this->assertSame(SettingsValueCaster::TYPE_INTEGER, $this->caster->inferTypeFromExample('42'));
        $this->assertSame(SettingsValueCaster::TYPE_FLOAT, $this->caster->inferTypeFromExample('3.14'));
        $this->assertSame(SettingsValueCaster::TYPE_JSON, $this->caster->inferTypeFromExample('{"x":1}'));
        $this->assertSame(SettingsValueCaster::TYPE_STRING, $this->caster->inferTypeFromExample('hello'));
    }

    public function test_to_stored_value(): void
    {
        $this->assertSame('true', $this->caster->toStoredValue(true, SettingsValueCaster::TYPE_BOOLEAN));
        $this->assertSame('false', $this->caster->toStoredValue(false, SettingsValueCaster::TYPE_BOOLEAN));
        $this->assertSame('42', $this->caster->toStoredValue(42, SettingsValueCaster::TYPE_INTEGER));
        $this->assertSame('{"a":1}', $this->caster->toStoredValue(['a' => 1], SettingsValueCaster::TYPE_JSON));
    }
}
