<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(Request $request): Response
    {
        $type = $request->string('type')->toString() === 'admin' ? 'admin' : 'customer';
        $adminRoles = [User::ROLE_SUPER_ADMIN, User::ROLE_ADMIN, 'superadmin'];

        $query = User::query()
            ->with('createdBy:id,name,email');

        if ($type === 'customer') {
            $query->withCount('orders');
        }

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $type === 'admin'
            ? $query->whereIn('role', $adminRoles)
            : $query->whereNotIn('role', $adminRoles);

        $users = $query->latest()->paginate(10)->withQueryString();

        $users->getCollection()->transform(function ($user) use ($type) {
            $row = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_by' => $user->createdBy ? [
                    'name' => $user->createdBy->name,
                    'email' => $user->createdBy->email,
                ] : null,
                'created_at' => $user->created_at->toISOString(),
            ];

            if ($type === 'customer') {
                $row['email_verified'] = $user->hasVerifiedEmail();
                $row['orders_count'] = $user->orders_count;
            }

            return $row;
        });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'canResetAdminPasswords' => $request->user()->isSuperAdmin(),
            'canCreateAdmins' => $request->user()->isSuperAdmin(),
            'filters' => [
                'search' => $request->search,
                'type' => $type,
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()->isSuperAdmin(), 403);

        return Inertia::render('Admin/Users/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isSuperAdmin(), 403);

        $request->merge(['email' => strtolower((string) $request->input('email'))]);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = new User([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
        ]);
        $user->role = User::ROLE_ADMIN;
        $user->created_by_user_id = $request->user()->id;
        $user->save();

        return redirect()->route('admin.users.index', ['type' => 'admin']);
    }

    public function updatePassword(Request $request, User $user): RedirectResponse
    {
        abort_unless(
            $request->user()->isSuperAdmin() && $user->role === User::ROLE_ADMIN,
            403,
        );

        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('message', 'Admin password updated.');
    }
}
