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
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
                <div className="mb-14 text-center">
                    <p className="text-[11px] tracking-[0.35em] text-secondary uppercase">Find Us</p>
                    <h1 className="mt-3 font-serif text-3xl tracking-tight md:text-4xl">Get in Touch</h1>
                    <p className="mx-auto mt-3 max-w-md text-sm text-secondary">
                        Styling advice, order inquiries, or partnership opportunities — we&apos;d love to hear from you.
                    </p>
                </div>

                <div className="mx-auto grid max-w-4xl gap-16 lg:grid-cols-2">
                    <div>
                        <p className="mb-6 text-[11px] tracking-[0.25em] text-secondary uppercase">Details</p>
                        <dl className="space-y-6 text-sm">
                            <div>
                                <dt className="tracking-wide text-on-surface">Email</dt>
                                <dd className="mt-1 text-secondary">hello@example.com</dd>
                            </div>
                            <div>
                                <dt className="tracking-wide text-on-surface">Hours</dt>
                                <dd className="mt-1 text-secondary">Mon – Sat, 9:00 – 18:00 WIB</dd>
                            </div>
                            <div>
                                <dt className="tracking-wide text-on-surface">Location</dt>
                                <dd className="mt-1 text-secondary">Jakarta, Indonesia</dd>
                            </div>
                        </dl>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            post('/contact');
                        }}
                        className="space-y-5"
                    >
                        <p className="text-[11px] tracking-[0.25em] text-secondary uppercase">Message</p>
                        {recentlySuccessful && (
                            <p className="text-sm text-warm-brown">
                                Message sent successfully. We will contact you soon.
                            </p>
                        )}
                        <div>
                            <label className="mb-1.5 block text-sm">Name</label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm">Email</label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm">Message</label>
                            <textarea
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                rows={5}
                                className="flex w-full rounded-sm border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-brown"
                            />
                            {errors.message && <p className="mt-1 text-xs text-error">{errors.message}</p>}
                        </div>
                        <input
                            type="text"
                            name="website"
                            value={data.website}
                            onChange={(e) => setData('website', e.target.value)}
                            className="hidden"
                            tabIndex={-1}
                            autoComplete="off"
                        />
                        <Button type="submit" variant="accent" disabled={processing}>
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </StorefrontLayout>
    );
}
