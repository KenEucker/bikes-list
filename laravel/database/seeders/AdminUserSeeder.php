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
        $adminUser = User::query()->updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name'              => 'Admin',
                'password'          => Hash::make('admin123'),
                'email_verified_at' => Carbon::now(),
            ]
        );

        $adminRole = Role::query()->updateOrCreate(
            ['slug' => 'admin'],
            [
                'name'        => 'Admin',
                'permissions' => [
                    'platform.index' => true,
                    'platform.systems.cities' => true,
                    'platform.systems.listings' => true,
                    'platform.systems.events' => true,
                    'platform.systems.guidelines' => true,
                    'platform.systems.community-pages' => true,
                    'platform.systems.users' => true,
                    'platform.systems.roles' => true,
                    'platform.moderation.flagged' => true,
                    'platform.moderation.claims' => true,
                ],
            ]
        );
        $adminRole->users()->syncWithoutDetaching([$adminUser->getKey()]);

        Role::query()->updateOrCreate(
            ['slug' => 'moderator'],
            [
                'name'        => 'Moderator',
                'permissions' => [
                    'platform.index' => true,
                    'platform.systems.cities' => true,
                    'platform.systems.listings' => true,
                    'platform.systems.events' => true,
                    'platform.systems.guidelines' => true,
                    'platform.systems.community-pages' => true,
                    'platform.moderation.flagged' => true,
                    'platform.moderation.claims' => true,
                ],
            ]
        );

        Role::query()->updateOrCreate(
            ['slug' => 'user'],
            [
                'name'        => 'User',
                'permissions' => [
                    'content.create.listing' => true,
                    'content.create.event' => true,
                    'content.create.community_page' => true,
                ],
            ]
        );
    }
}

