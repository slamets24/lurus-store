import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { SeoHead } from '@/components/SeoHead';
import StorefrontLayout from '@/layouts/StorefrontLayout';

export default function NewArrivals() {
    return (
        <StorefrontLayout>
            <SeoHead
                title="Produk Terbaru | Koleksi New Arrivals Busana Muslimah | Lurus Store"
                description="Temukan koleksi produk terbaru busana muslimah dan modest wear di Lurus Store. Model fresh, bahan nyaman, dan potongan elegan."
                canonical="/new-arrivals"
            />
            <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-[var(--spacing-margin-desktop)] md:py-24">
                <p className="text-xs tracking-widest text-secondary">FRESH STYLES</p>
                <h1 className="mt-2 font-serif text-4xl tracking-tight">New Arrivals</h1>
                <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-secondary">
                    Discover the latest additions to our modest fashion collection — thoughtfully designed
                    pieces for the season ahead.
                </p>
                <Button variant="accent" className="mt-10" asChild>
                    <Link href="/collections/new-collection">Shop New Arrivals</Link>
                </Button>
            </div>
        </StorefrontLayout>
    );
}
