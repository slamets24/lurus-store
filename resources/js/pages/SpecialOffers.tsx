import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import StorefrontLayout from '@/layouts/StorefrontLayout';

export default function SpecialOffers() {
    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-[var(--spacing-margin-desktop)] md:py-24">
                <p className="text-xs tracking-widest text-secondary">LIMITED TIME</p>
                <h1 className="mt-2 font-serif text-4xl tracking-tight">Special Offers</h1>
                <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-secondary">
                    Enjoy exclusive discounts on selected modest fashion pieces. New offers added regularly —
                    check back often for the best deals.
                </p>
                <Button variant="accent" className="mt-10" asChild>
                    <Link href="/products">Shop Offers</Link>
                </Button>
            </div>
        </StorefrontLayout>
    );
}
