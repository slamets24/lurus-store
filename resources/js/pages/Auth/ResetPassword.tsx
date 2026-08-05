import { Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StorefrontLayout from '@/layouts/StorefrontLayout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    return (
        <StorefrontLayout>
            <div className="mx-auto flex max-w-md flex-col px-4 py-16 md:py-24">
                <h1 className="mb-2 text-center font-serif text-3xl tracking-tight">Reset Password</h1>
                <p className="mb-8 text-center text-sm text-secondary">Choose a new password for your account</p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/reset-password');
                    }}
                    className="space-y-4 border border-outline-variant p-8"
                >
                    <div>
                        <label className="mb-1 block text-sm">Email</label>
                        <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} autoComplete="email" />
                        {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm">New Password</label>
                        <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} autoComplete="new-password" />
                        {errors.password && <p className="mt-1 text-xs text-error">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm">Confirm Password</label>
                        <Input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} autoComplete="new-password" />
                    </div>
                    <Button type="submit" variant="accent" className="w-full" disabled={processing}>
                        Reset Password
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-secondary">
                    <Link href="/login" className="text-warm-brown hover:underline">Back to sign in</Link>
                </p>
            </div>
        </StorefrontLayout>
    );
}
