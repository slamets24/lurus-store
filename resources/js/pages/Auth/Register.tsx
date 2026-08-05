import { Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StorefrontLayout from '@/layouts/StorefrontLayout';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        website: '',
    });

    return (
        <StorefrontLayout>
            <div className="mx-auto flex max-w-md flex-col px-4 py-16 md:py-24">
                <h1 className="mb-2 text-center font-serif text-3xl tracking-tight">Create Account</h1>
                <p className="mb-8 text-center text-sm text-secondary">Join us for a seamless shopping experience</p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/register');
                    }}
                    className="space-y-4 border border-outline-variant p-8"
                >
                    <div>
                        <label className="mb-1 block text-sm">Full Name</label>
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} autoComplete="name" />
                        {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm">Email</label>
                        <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} autoComplete="email" />
                        {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm">Phone (optional)</label>
                        <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} autoComplete="tel" />
                        {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm">Password</label>
                        <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} autoComplete="new-password" />
                        {errors.password && <p className="mt-1 text-xs text-error">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm">Confirm Password</label>
                        <Input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} autoComplete="new-password" />
                    </div>
                    <input type="text" name="website" value={data.website} onChange={(e) => setData('website', e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />
                    <Button type="submit" variant="accent" className="w-full" disabled={processing}>
                        Create Account
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-secondary">
                    Already have an account?{' '}
                    <Link href="/login" className="text-warm-brown hover:underline">Sign in</Link>
                </p>
            </div>
        </StorefrontLayout>
    );
}
