import StorefrontLayout from '@/layouts/StorefrontLayout';

export default function PrivacyPolicy() {
    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-3xl px-4 py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
                <h1 className="mb-8 font-serif text-4xl tracking-tight">Privacy Policy</h1>
                <div className="space-y-6 text-sm leading-relaxed text-secondary">
                    <p><em>Last updated: August 2026</em></p>

                    <section>
                        <h2 className="mb-3 font-serif text-lg text-on-surface">Information We Collect</h2>
                        <p>
                            We collect information you provide when creating an account, placing an order,
                            or contacting us — including name, email, phone number, shipping address, and
                            payment-related details necessary to fulfil your order.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-serif text-lg text-on-surface">How We Use Your Information</h2>
                        <p>
                            Your information is used to process orders, communicate about your purchases,
                            improve our services, and — with your consent — send marketing communications.
                            We do not sell your personal data to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-serif text-lg text-on-surface">Data Security</h2>
                        <p>
                            We implement appropriate technical and organisational measures to protect your
                            personal information against unauthorised access, alteration, or disclosure.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-serif text-lg text-on-surface">Your Rights</h2>
                        <p>
                            You may request access to, correction of, or deletion of your personal data
                            by contacting us. You may also opt out of marketing emails at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-serif text-lg text-on-surface">Contact</h2>
                        <p>
                            For privacy-related inquiries, please contact us through our contact page.
                        </p>
                    </section>
                </div>
            </div>
        </StorefrontLayout>
    );
}
