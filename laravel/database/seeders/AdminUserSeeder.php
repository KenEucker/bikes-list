<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
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

        if (! DB::table('city_user')->where('user_id', $adminUser->id)->whereNull('city_id')->where('role', 'global')->exists()) {
            DB::table('city_user')->insert([
                'user_id' => $adminUser->id,
                'city_id' => null,
                'role' => 'global',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $adminRole = Role::query()->updateOrCreate(
            ['slug' => 'admin'],
            [
                'name'        => 'Admin',
                'permissions' => [
                    'platform.index' => true,
                    'platform.systems.cities' => true,
                    'platform.systems.sales' => true,
                    'platform.systems.rides' => true,
                    'platform.systems.guidelines' => true,
                    'platform.systems.ride-audiences' => true,
                    'platform.systems.ride-tags' => true,
                    'platform.systems.community-pages' => true,
                    'platform.systems.uploads' => true,
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
                    'platform.systems.sales' => true,
                    'platform.systems.rides' => true,
                    'platform.systems.guidelines' => true,
                    'platform.systems.community-pages' => true,
                    'platform.systems.uploads' => true,
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
                    'content.create.sale' => true,
                    'content.create.ride' => true,
                    'content.create.community_page' => true,
                ],
            ]
        );
    }
}

