import { Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StorefrontLayout from '@/layouts/StorefrontLayout';

interface VerifyEmailOtpProps {
    email: string;
    status?: string | null;
}

export default function VerifyEmailOtp({ email, status }: VerifyEmailOtpProps) {
    const verifyForm = useForm({ code: '' });
    const resendForm = useForm({});

    return (
        <StorefrontLayout>
            <div className="mx-auto flex max-w-md flex-col px-4 py-16 md:py-24">
                <h1 className="mb-2 text-center font-serif text-3xl tracking-tight">Verify Email</h1>
                <p className="mb-8 text-center text-sm text-secondary">
                    We sent a 6-digit code to <strong>{email}</strong>
                </p>

                {status && <p className="mb-4 text-center text-sm text-warm-brown">{status}</p>}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        verifyForm.post('/email/verify');
                    }}
                    className="space-y-4 border border-outline-variant p-8"
                >
                    <div>
                        <label className="mb-1 block text-sm">Verification Code</label>
                        <Input
                            inputMode="numeric"
                            maxLength={6}
                            value={verifyForm.data.code}
                            onChange={(e) => verifyForm.setData('code', e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="text-center text-lg tracking-[0.5em]"
                        />
                        {verifyForm.errors.code && <p className="mt-1 text-xs text-error">{verifyForm.errors.code}</p>}
                    </div>
                    <Button type="submit" variant="accent" className="w-full" disabled={verifyForm.processing}>
                        Verify Email
                    </Button>
                </form>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        resendForm.post('/email/verification-notification');
                    }}
                    className="mt-4 text-center"
                >
                    <Button type="submit" variant="ghost" size="sm" disabled={resendForm.processing}>
                        Resend code
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-secondary">
                    <Link href="/logout" method="post" as="button" className="text-warm-brown hover:underline">
                        Sign out
                    </Link>
                </p>
            </div>
        </StorefrontLayout>
    );
}
