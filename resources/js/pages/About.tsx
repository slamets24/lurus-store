import { Link, usePage } from '@inertiajs/react';
import { SeoHead } from '@/components/SeoHead';
import StorefrontLayout from '@/layouts/StorefrontLayout';

export default function About() {
    const { appUrl } = usePage().props as unknown as { appUrl?: string };
    const baseUrl = (appUrl || '').replace(/\/$/, '');

    const aboutJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'Tentang Lurus Store',
        description: 'Lurus Store menghadirkan busana muslimah elegan, modest fashion dengan siluet anggun dan material berkualitas tinggi.',
        url: baseUrl ? `${baseUrl}/about` : '/about',
    };

    return (
        <StorefrontLayout>
            <SeoHead
                title="Tentang Kami | Lurus Store — Modest Fashion & Muslimah Elegance"
                description="Pelajari komitmen Lurus Store dalam menghadirkan modest wear dan busana muslimah elegan, nyaman, dan berkarakter untuk wanita Indonesia."
                canonical="/about"
                jsonLd={aboutJsonLd}
            />
            <div className="mx-auto max-w-3xl px-4 py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
                <h1 className="mb-8 font-serif text-4xl tracking-tight">About Us</h1>
                <div className="space-y-6 text-sm leading-relaxed text-secondary">
                    <p>
                        We believe modest fashion should feel effortless — refined silhouettes, thoughtful fabrics,
                        and pieces that move with you through every season of life.
                    </p>
                    <p>
                        Founded with a commitment to quality and intentional design, our collections blend timeless
                        elegance with contemporary comfort. Each garment is curated to honour both style and substance.
                    </p>
                    <p>
                        From everyday essentials to occasion-ready pieces, we create clothing that empowers you to
                        express your identity with grace and confidence.
                    </p>
                </div>
                <div className="mt-12 border-t border-outline-variant pt-8">
                    <Link href="/products" className="text-warm-brown hover:underline">
                        Explore our collection →
                    </Link>
                </div>
            </div>
        </StorefrontLayout>
    );
}
