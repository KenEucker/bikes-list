<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Orchid\Platform\Models\Role;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::query()->updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name'              => 'Admin',
                'password'          => Hash::make('admin123'),
                'email_verified_at' => Carbon::now(),
            ]
        );

        $role = Role::query()->updateOrCreate(
            ['slug' => 'admin'],
            [
                'name'        => 'Admin',
                'permissions' => [
                    'platform.index' => true,
                    'platform.systems.cities' => true,
                    'platform.systems.users' => true,
                    'platform.systems.roles' => true,
                ],
            ]
        );

        $role->users()->syncWithoutDetaching([$user->getKey()]);
    }
}

