import { Head, Link, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/AdminLayout';

export default function UsersForm() {
    const form = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    return (
        <AdminLayout title="New Admin">
            <Head title="New Admin" />

            <div className="mx-auto max-w-lg space-y-6">
                <AdminPageHeader title="Create Admin User" description="Super admins can add new admin accounts." />

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post('/admin/users');
                    }}
                    className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4"
                >
                    <Input
                        placeholder="Name"
                        value={form.data.name}
                        onChange={(event) => form.setData('name', event.target.value)}
                    />
                    {form.errors.name ? <p className="text-sm text-error">{form.errors.name}</p> : null}

                    <Input
                        type="email"
                        placeholder="Email"
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                    />
                    {form.errors.email ? <p className="text-sm text-error">{form.errors.email}</p> : null}

                    <Input
                        placeholder="Phone (optional)"
                        value={form.data.phone}
                        onChange={(event) => form.setData('phone', event.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                    />
                    {form.errors.password ? <p className="text-sm text-error">{form.errors.password}</p> : null}

                    <Input
                        type="password"
                        placeholder="Confirm password"
                        value={form.data.password_confirmation}
                        onChange={(event) => form.setData('password_confirmation', event.target.value)}
                    />

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" variant="accent" disabled={form.processing}>
                            Create Admin
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/users?type=admin">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
