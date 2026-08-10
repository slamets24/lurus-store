import { Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';

export default function SpecialOffers() {
    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
                <div className="mb-10 text-center">
                    <p className="text-[11px] tracking-[0.35em] text-secondary uppercase">Special Offers</p>
                    <h1 className="mt-3 font-serif text-3xl tracking-tight md:text-4xl">Limited Time</h1>
                    <p className="mx-auto mt-3 max-w-md text-sm text-secondary">
                        Exclusive discounts on selected modest fashion pieces. New offers added regularly.
                    </p>
                    <Link
                        href="/collections/special-offers"
                        className="mt-8 inline-block text-[11px] tracking-[0.25em] text-secondary uppercase transition-colors hover:text-on-surface"
                    >
                        View Offers
                    </Link>
                </div>
            </div>
        </StorefrontLayout>
    );
}
