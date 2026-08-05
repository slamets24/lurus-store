import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StorefrontLayout from '@/layouts/StorefrontLayout';

export default function Contact() {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: '',
        email: '',
        message: '',
        website: '',
    });

    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
                <div className="grid gap-16 lg:grid-cols-2">
                    <div>
                        <h1 className="mb-4 font-serif text-4xl tracking-tight">Find Us</h1>
                        <p className="mb-8 text-sm leading-relaxed text-secondary">
                            We&apos;d love to hear from you. Reach out for styling advice, order inquiries,
                            or partnership opportunities.
                        </p>
                        <dl className="space-y-4 text-sm">
                            <div>
                                <dt className="font-medium">Email</dt>
                                <dd className="text-secondary">hello@example.com</dd>
                            </div>
                            <div>
                                <dt className="font-medium">Hours</dt>
                                <dd className="text-secondary">Mon – Sat, 9:00 – 18:00 WIB</dd>
                            </div>
                            <div>
                                <dt className="font-medium">Location</dt>
                                <dd className="text-secondary">Jakarta, Indonesia</dd>
                            </div>
                        </dl>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            post('/contact');
                        }}
                        className="space-y-4 border border-outline-variant p-8"
                    >
                        <h2 className="font-serif text-xl">Send a Message</h2>
                        {recentlySuccessful && (
                            <p className="text-sm text-warm-brown">Message sent successfully. We will contact you soon.</p>
                        )}
                        <div>
                            <label className="mb-1 block text-sm">Name</label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm">Email</label>
                            <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm">Message</label>
                            <textarea
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                rows={5}
                                className="flex w-full rounded-sm border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-brown"
                            />
                            {errors.message && <p className="mt-1 text-xs text-error">{errors.message}</p>}
                        </div>
                        <input type="text" name="website" value={data.website} onChange={(e) => setData('website', e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />
                        <Button type="submit" variant="accent" disabled={processing}>
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </StorefrontLayout>
    );
}
