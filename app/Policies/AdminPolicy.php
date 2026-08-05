<?php

namespace App\Policies;

use App\Models\User;
use App\Enums\UserRole;

class AdminPolicy
{
    public function access(User $user): bool
    {
        return UserRole::fromLegacy($user->role)->isAdmin();
    }

    public function superAdmin(User $user): bool
    {
        return UserRole::fromLegacy($user->role)->isSuperAdmin();
    }
}
