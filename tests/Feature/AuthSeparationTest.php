<?php

namespace Tests\Feature;

use App\Domain\Auth\Admin;
use App\Domain\Auth\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthSeparationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_guard_cannot_authenticate_consumer_user(): void
    {
        $user = User::create([
            'email' => 'user@example.com',
            'status' => 'active',
        ]);

        $this->assertFalse(auth()->guard('admin')->attempt([
            'email' => 'user@example.com',
        ]));
    }

    public function test_consumer_guard_cannot_authenticate_admin(): void
    {
        $admin = Admin::create([
            'email' => 'admin@example.com',
            'name' => 'Admin User',
        ]);

        $this->assertFalse(auth()->guard('web')->attempt([
            'email' => 'admin@example.com',
        ]));
    }
}
