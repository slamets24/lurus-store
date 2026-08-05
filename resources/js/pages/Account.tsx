import { Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import type { AuthProps } from '@/types';

interface ProfileFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
}

interface PasswordFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export default function Account() {
    const { auth } = usePage().props as unknown as { auth: AuthProps };
    const user = auth.user!;

    const profileForm = useForm<ProfileFormData>({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
        address: user.address ?? '',
        city: user.city ?? '',
        postal_code: user.postal_code ?? '',
    });

    const passwordForm = useForm<PasswordFormData>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
                <h1 className="mb-10 font-serif text-4xl tracking-tight">My Account</h1>

                <div className="grid gap-10 lg:grid-cols-3">
                    <nav className="space-y-2 text-sm lg:col-span-1">
                        <p className="font-medium text-on-surface">Account</p>
                        <Link href="/orders" className="block py-2 text-secondary hover:text-warm-brown">Orders</Link>
                        <Link href="/wishlist" className="block py-2 text-secondary hover:text-warm-brown">Wishlist</Link>
                        <Link href="/logout" method="post" as="button" className="block py-2 text-left text-secondary hover:text-warm-brown">
                            Sign Out
                        </Link>
                    </nav>

                    <div className="space-y-10 lg:col-span-2">
                        <section className="border border-outline-variant p-6">
                            <h2 className="mb-6 font-serif text-xl">Profile</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    profileForm.put('/account');
                                }}
                                className="grid gap-4 sm:grid-cols-2"
                            >
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm">Name</label>
                                    <Input value={profileForm.data.name} onChange={(e) => profileForm.setData('name', e.target.value)} />
                                    {profileForm.errors.name && <p className="mt-1 text-xs text-error">{profileForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">Email</label>
                                    <Input type="email" value={profileForm.data.email} onChange={(e) => profileForm.setData('email', e.target.value)} />
                                    {profileForm.errors.email && <p className="mt-1 text-xs text-error">{profileForm.errors.email}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">Phone</label>
                                    <Input value={profileForm.data.phone} onChange={(e) => profileForm.setData('phone', e.target.value)} />
                                    {profileForm.errors.phone && <p className="mt-1 text-xs text-error">{profileForm.errors.phone}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm">Address</label>
                                    <Input value={profileForm.data.address} onChange={(e) => profileForm.setData('address', e.target.value)} />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">City</label>
                                    <Input value={profileForm.data.city} onChange={(e) => profileForm.setData('city', e.target.value)} />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">Postal Code</label>
                                    <Input value={profileForm.data.postal_code} onChange={(e) => profileForm.setData('postal_code', e.target.value)} />
                                </div>
                                <div className="sm:col-span-2">
                                    <Button type="submit" variant="accent" disabled={profileForm.processing}>
                                        Save Profile
                                    </Button>
                                </div>
                            </form>
                        </section>

                        <section className="border border-outline-variant p-6">
                            <h2 className="mb-6 font-serif text-xl">Change Password</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    passwordForm.patch('/account/password');
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="mb-1 block text-sm">Current Password</label>
                                    <Input type="password" value={passwordForm.data.current_password} onChange={(e) => passwordForm.setData('current_password', e.target.value)} />
                                    {passwordForm.errors.current_password && <p className="mt-1 text-xs text-error">{passwordForm.errors.current_password}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">New Password</label>
                                    <Input type="password" value={passwordForm.data.password} onChange={(e) => passwordForm.setData('password', e.target.value)} />
                                    {passwordForm.errors.password && <p className="mt-1 text-xs text-error">{passwordForm.errors.password}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">Confirm Password</label>
                                    <Input type="password" value={passwordForm.data.password_confirmation} onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)} />
                                </div>
                                <Button type="submit" variant="outline" disabled={passwordForm.processing}>
                                    Update Password
                                </Button>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
