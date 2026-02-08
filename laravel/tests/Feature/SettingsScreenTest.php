<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Orchid\Platform\Models\Role;
use Tests\TestCase;

class SettingsScreenTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
        $role = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Admin', 'permissions' => []]
        );
        $perms = $role->permissions ?? [];
        $perms['platform.index'] = true;
        $perms['platform.settings'] = true;
        $role->update(['permissions' => $perms]);
        $this->admin->roles()->sync([$role->id]);
        $this->admin->permissions = array_merge($this->admin->permissions ?? [], ['platform.index' => true, 'platform.settings' => true]);
        $this->admin->save();
    }

    public function test_settings_list_route_returns_ok_for_authorized_user(): void
    {
        $response = $this->actingAs($this->admin)->get(route('platform.settings'));
        $response->assertOk();
    }

    public function test_list_shows_db_override_as_effective_source(): void
    {
        Setting::create([
            'key' => 'APP_NAME',
            'value' => 'FromDB',
            'type' => 'string',
        ]);

        $response = $this->actingAs($this->admin)->get(route('platform.settings'));
        $response->assertOk();
        $response->assertSee('FromDB', false);
        $response->assertSee('Database', false);
    }

    public function test_clear_override_removes_setting(): void
    {
        Setting::create([
            'key' => 'APP_NAME',
            'value' => 'X',
            'type' => 'string',
        ]);
        $this->assertNotNull(Setting::find('APP_NAME'));

        $screen = new \App\Orchid\Screens\Settings\SettingsListScreen;
        $request = \Illuminate\Http\Request::create('/', 'POST', ['key' => 'APP_NAME']);
        $request->setUserResolver(fn () => $this->admin);
        $screen->clearOverride($request);

        $this->assertNull(Setting::find('APP_NAME'));
    }
}
