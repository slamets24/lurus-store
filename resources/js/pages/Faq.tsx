import { Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';

const faqs = [
    {
        q: 'How do I place an order?',
        a: 'Browse our shop, add items to your cart, and proceed to checkout. You can pay via bank transfer or online payment methods where available.',
    },
    {
        q: 'What are your shipping options?',
        a: 'We ship across Indonesia via trusted courier partners. Shipping costs are calculated at checkout based on your destination.',
    },
    {
        q: 'Can I return or exchange an item?',
        a: 'Unworn items with original tags may be returned within 7 days of delivery. Contact us to initiate a return or exchange.',
    },
    {
        q: 'How do I track my order?',
        a: 'Once your order ships, you will receive a tracking number via email. You can also view order status in your account.',
    },
    {
        q: 'Do you offer size guidance?',
        a: 'Yes — each product page includes size selection, and many categories link to a size chart for accurate measurements.',
    },
];

export default function Faq() {
    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-3xl px-4 py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
                <h1 className="mb-2 font-serif text-4xl tracking-tight">FAQ</h1>
                <p className="mb-10 text-sm text-secondary">Frequently asked questions</p>

                <div className="divide-y divide-outline-variant border-y border-outline-variant">
                    {faqs.map((faq) => (
                        <details key={faq.q} className="group py-6">
                            <summary className="cursor-pointer list-none font-medium text-on-surface group-open:text-warm-brown">
                                {faq.q}
                            </summary>
                            <p className="mt-3 text-sm leading-relaxed text-secondary">{faq.a}</p>
                        </details>
                    ))}
                </div>

                <p className="mt-10 text-sm text-secondary">
                    Still have questions?{' '}
                    <Link href="/contact" className="text-warm-brown hover:underline">Contact us</Link>
                </p>
            </div>
        </StorefrontLayout>
    );
}
