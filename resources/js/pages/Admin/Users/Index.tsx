import { Head, router, useForm } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { PaginationLinks } from '@/components/admin/PaginationLinks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/AdminLayout';
import { formatDate } from '@/lib/format';
import type { Paginated } from '@/types/admin';

interface UserRow {
    id: number;
    name: string;
    email: string;
    role: string;
    created_by?: { name: string; email: string } | null;
    created_at: string;
    email_verified?: boolean;
    orders_count?: number;
}

interface UsersIndexProps {
    users: Paginated<UserRow>;
    canResetAdminPasswords: boolean;
    canCreateAdmins: boolean;
    filters: { search?: string; type: 'customer' | 'admin' };
}

export default function UsersIndex({ users, canResetAdminPasswords, canCreateAdmins, filters }: UsersIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [passwordUserId, setPasswordUserId] = useState<number | null>(null);

    const passwordForm = useForm({
        password: '',
        password_confirmation: '',
    });

    const applyFilters = (type?: 'customer' | 'admin') => {
        router.get(
            '/admin/users',
            {
                search: search || undefined,
                type: type ?? filters.type,
            },
            { preserveState: true },
        );
    };

    const submitPassword = (userId: number) => {
        passwordForm.patch(`/admin/users/${userId}/password`, {
            preserveScroll: true,
            onSuccess: () => {
                setPasswordUserId(null);
                passwordForm.reset();
            },
        });
    };

    return (
        <AdminLayout title="Users">
            <Head title="Users" />

            <div className="mx-auto max-w-6xl space-y-6">
                <AdminPageHeader
                    title="Users"
                    description={`${users.total} ${filters.type === 'admin' ? 'admins' : 'customers'}`}
                    action={
                        canCreateAdmins && filters.type === 'admin'
                            ? { label: 'Add Admin', href: '/admin/users/create' }
                            : undefined
                    }
                />

                <div className="flex flex-wrap gap-3">
                    <div className="flex rounded-sm bg-surface-container p-1">
                        {(['customer', 'admin'] as const).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => applyFilters(type)}
                                className={`rounded-sm px-4 py-1.5 text-sm capitalize ${
                                    filters.type === type
                                        ? 'bg-warm-brown text-white'
                                        : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                            >
                                {type}s
                            </button>
                        ))}
                    </div>
                    <Input
                        placeholder="Search name or email"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        onKeyDown={(event) => event.key === 'Enter' && applyFilters()}
                        className="max-w-xs"
                    />
                    <Button type="button" variant="accent" onClick={() => applyFilters()}>
                        Search
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest">
                    <table className="w-full text-sm">
                        <thead className="border-b border-outline-variant/15 bg-surface-container/50 text-left text-xs tracking-wider text-on-surface-variant uppercase">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                {filters.type === 'customer' ? <th className="px-4 py-3">Orders</th> : null}
                                <th className="px-4 py-3">Joined</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-surface-container/30">
                                    <td className="px-4 py-3 font-medium">{user.name}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3 capitalize">{user.role.replace('_', ' ')}</td>
                                    {filters.type === 'customer' ? (
                                        <td className="px-4 py-3">{user.orders_count ?? 0}</td>
                                    ) : null}
                                    <td className="px-4 py-3 text-on-surface-variant">{formatDate(user.created_at)}</td>
                                    <td className="px-4 py-3 text-right">
                                        {canResetAdminPasswords && filters.type === 'admin' && user.role === 'admin' ? (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setPasswordUserId(user.id)}
                                            >
                                                <KeyRound className="mr-1 h-4 w-4" /> Reset Password
                                            </Button>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-4 pb-4">
                        <PaginationLinks paginator={users} />
                    </div>
                </div>

                {passwordUserId ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                submitPassword(passwordUserId);
                            }}
                            className="w-full max-w-md rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4"
                        >
                            <h2 className="font-serif text-xl text-primary">Reset Admin Password</h2>
                            <Input
                                type="password"
                                placeholder="New password"
                                value={passwordForm.data.password}
                                onChange={(event) => passwordForm.setData('password', event.target.value)}
                            />
                            <Input
                                type="password"
                                placeholder="Confirm password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(event) => passwordForm.setData('password_confirmation', event.target.value)}
                            />
                            <div className="flex gap-2">
                                <Button type="submit" variant="accent" disabled={passwordForm.processing}>
                                    Update Password
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setPasswordUserId(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : null}
            </div>
        </AdminLayout>
    );
}
