import { Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StorefrontLayout from '@/layouts/StorefrontLayout';

interface ForgotPasswordProps {
    status?: string | null;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    return (
        <StorefrontLayout>
            <div className="mx-auto flex max-w-md flex-col px-4 py-16 md:py-24">
                <h1 className="mb-2 text-center font-serif text-3xl tracking-tight">Forgot Password</h1>
                <p className="mb-8 text-center text-sm text-secondary">
                    Enter your email and we&apos;ll send you a reset link
                </p>

                {status && <p className="mb-4 text-center text-sm text-warm-brown">{status}</p>}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/forgot-password');
                    }}
                    className="space-y-4 border border-outline-variant p-8"
                >
                    <div>
                        <label className="mb-1 block text-sm">Email</label>
                        <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} autoComplete="email" />
                        {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
                    </div>
                    <Button type="submit" variant="accent" className="w-full" disabled={processing}>
                        Send Reset Link
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-secondary">
                    <Link href="/login" className="text-warm-brown hover:underline">Back to sign in</Link>
                </p>
            </div>
        </StorefrontLayout>
    );
}
