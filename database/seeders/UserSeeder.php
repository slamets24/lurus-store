<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = env('SEED_ADMIN_PASSWORD');

        if (app()->isProduction() && blank($password)) {
            $this->command?->error('Set SEED_ADMIN_PASSWORD in .env before seeding on VPS.');

            return;
        }

        // Local default only — never used when APP_ENV=production.
        $password ??= 'Admin123!';

        $superAdmin = User::query()->where('email', 'superadmin@aaamen.com')->first();

        if (! $superAdmin) {
            $superAdmin = new User([
                'name' => 'Super Admin',
                'email' => 'superadmin@aaamen.com',
                'password' => $password,
            ]);
            $superAdmin->role = User::ROLE_SUPER_ADMIN;
            $superAdmin->save();
        }

        if (! User::query()->where('email', 'admin@aaamen.com')->exists()) {
            $admin = new User([
                'name' => 'Admin',
                'email' => 'admin@aaamen.com',
                'password' => $password,
            ]);
            $admin->role = User::ROLE_ADMIN;
            $admin->created_by_user_id = $superAdmin->id;
            $admin->save();
        }
    }
}
