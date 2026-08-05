import { Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StorefrontLayout from '@/layouts/StorefrontLayout';

interface LoginProps {
    status?: string | null;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    return (
        <StorefrontLayout>
            <div className="mx-auto flex max-w-md flex-col px-4 py-16 md:py-24">
                <h1 className="mb-2 text-center font-serif text-3xl tracking-tight">Sign In</h1>
                <p className="mb-8 text-center text-sm text-secondary">Welcome back to your account</p>

                {status && <p className="mb-4 text-center text-sm text-warm-brown">{status}</p>}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/login');
                    }}
                    className="space-y-4 border border-outline-variant p-8"
                >
                    <div>
                        <label className="mb-1 block text-sm">Email</label>
                        <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} autoComplete="email" />
                        {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm">Password</label>
                        <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} autoComplete="current-password" />
                        {errors.password && <p className="mt-1 text-xs text-error">{errors.password}</p>}
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                        Remember me
                    </label>
                    <Button type="submit" variant="accent" className="w-full" disabled={processing}>
                        Sign In
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-secondary">
                    <Link href="/forgot-password" className="text-warm-brown hover:underline">Forgot password?</Link>
                </p>
                <p className="mt-2 text-center text-sm text-secondary">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-warm-brown hover:underline">Create one</Link>
                </p>
            </div>
        </StorefrontLayout>
    );
}
