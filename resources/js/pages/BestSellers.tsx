import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import StorefrontLayout from '@/layouts/StorefrontLayout';

export default function BestSellers() {
    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-[var(--spacing-margin-desktop)] md:py-24">
                <p className="text-xs tracking-widest text-secondary">CUSTOMER FAVOURITES</p>
                <h1 className="mt-2 font-serif text-4xl tracking-tight">Best Sellers</h1>
                <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-secondary">
                    Our most-loved pieces, chosen by customers who appreciate quality modest fashion
                    that stands the test of time.
                </p>
                <Button variant="accent" className="mt-10" asChild>
                    <Link href="/collections/best-sellers">Shop Best Sellers</Link>
                </Button>
            </div>
        </StorefrontLayout>
    );
}
