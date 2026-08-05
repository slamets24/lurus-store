import { Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';

export default function ShippingReturns() {
    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-3xl px-4 py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
                <h1 className="mb-8 font-serif text-4xl tracking-tight">Shipping & Returns</h1>
                <div className="space-y-10 text-sm leading-relaxed text-secondary">
                    <section>
                        <h2 className="mb-4 font-serif text-xl text-on-surface">Shipping</h2>
                        <ul className="list-inside list-disc space-y-2">
                            <li>Orders are processed within 1–2 business days after payment confirmation</li>
                            <li>Standard delivery across Indonesia via trusted courier partners</li>
                            <li>Shipping costs are calculated at checkout based on destination</li>
                            <li>Free shipping may apply on orders above the threshold shown at checkout</li>
                            <li>Tracking number provided once your order has shipped</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 font-serif text-xl text-on-surface">Returns & Exchanges</h2>
                        <ul className="list-inside list-disc space-y-2">
                            <li>Returns accepted within 7 days of delivery for unworn items with original tags</li>
                            <li>Items must be in original condition with no signs of wear or alteration</li>
                            <li>Sale items and intimate apparel are final sale unless defective</li>
                            <li>Exchanges subject to stock availability</li>
                            <li>Return shipping costs are the customer&apos;s responsibility unless the item is defective</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 font-serif text-xl text-on-surface">How to Return</h2>
                        <p>
                            Contact our customer service team with your order number and reason for return.
                            We will provide return instructions and the appropriate address.
                        </p>
                    </section>

                    <p>
                        Questions? <Link href="/contact" className="text-warm-brown hover:underline">Contact us</Link>
                    </p>
                </div>
            </div>
        </StorefrontLayout>
    );
}
