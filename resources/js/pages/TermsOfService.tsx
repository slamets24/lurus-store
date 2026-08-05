import StorefrontLayout from '@/layouts/StorefrontLayout';

export default function TermsOfService() {
    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-3xl px-4 py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
                <h1 className="mb-8 font-serif text-4xl tracking-tight">Terms of Service</h1>
                <div className="space-y-6 text-sm leading-relaxed text-secondary">
                    <p><em>Last updated: August 2026</em></p>

                    <section>
                        <h2 className="mb-3 font-serif text-lg text-on-surface">Acceptance of Terms</h2>
                        <p>
                            By accessing and using this website, you agree to be bound by these Terms of Service.
                            If you do not agree, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-serif text-lg text-on-surface">Orders & Payment</h2>
                        <p>
                            All orders are subject to availability and confirmation. Prices are listed in
                            Indonesian Rupiah (IDR) and include applicable taxes unless stated otherwise.
                            We reserve the right to cancel orders in cases of pricing errors or stock unavailability.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-serif text-lg text-on-surface">Intellectual Property</h2>
                        <p>
                            All content on this website — including images, text, logos, and designs — is
                            the property of the store and protected by applicable copyright laws.
                            Reproduction without permission is prohibited.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-serif text-lg text-on-surface">Limitation of Liability</h2>
                        <p>
                            We strive to provide accurate product information but do not warrant that descriptions
                            are error-free. Our liability is limited to the purchase price of the product in question.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-serif text-lg text-on-surface">Governing Law</h2>
                        <p>
                            These terms are governed by the laws of the Republic of Indonesia.
                            Any disputes shall be resolved in the courts of Jakarta.
                        </p>
                    </section>
                </div>
            </div>
        </StorefrontLayout>
    );
}
