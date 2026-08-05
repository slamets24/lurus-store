import StorefrontLayout from '@/layouts/StorefrontLayout';

export default function SizeGuide() {
    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-3xl px-4 py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
                <h1 className="mb-8 font-serif text-4xl tracking-tight">Size Guide</h1>
                <div className="space-y-8 text-sm leading-relaxed text-secondary">
                    <p>
                        Finding the right fit is essential for modest fashion. Use the measurements below
                        as a guide — when in doubt, size up for a more relaxed fit.
                    </p>

                    <section>
                        <h2 className="mb-4 font-serif text-xl text-on-surface">How to Measure</h2>
                        <ul className="list-inside list-disc space-y-2">
                            <li><strong className="text-on-surface">Bust:</strong> Measure around the fullest part of your chest</li>
                            <li><strong className="text-on-surface">Waist:</strong> Measure around your natural waistline</li>
                            <li><strong className="text-on-surface">Hips:</strong> Measure around the fullest part of your hips</li>
                            <li><strong className="text-on-surface">Length:</strong> Measure from shoulder to desired hemline</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 font-serif text-xl text-on-surface">Size Chart (cm)</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b border-outline-variant">
                                        <th className="py-3 pr-4 font-medium text-on-surface">Size</th>
                                        <th className="py-3 pr-4 font-medium text-on-surface">Bust</th>
                                        <th className="py-3 pr-4 font-medium text-on-surface">Waist</th>
                                        <th className="py-3 font-medium text-on-surface">Hips</th>
                                    </tr>
                                </thead>
                                <tbody className="text-secondary">
                                    {[
                                        ['S', '86–90', '66–70', '90–94'],
                                        ['M', '91–96', '71–76', '95–100'],
                                        ['L', '97–102', '77–82', '101–106'],
                                        ['XL', '103–108', '83–88', '107–112'],
                                    ].map(([size, bust, waist, hips]) => (
                                        <tr key={size} className="border-b border-outline-variant">
                                            <td className="py-3 pr-4 font-medium text-on-surface">{size}</td>
                                            <td className="py-3 pr-4">{bust}</td>
                                            <td className="py-3 pr-4">{waist}</td>
                                            <td className="py-3">{hips}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <p>
                        Individual product pages may include category-specific size charts. Contact us if
                        you need personalised sizing advice.
                    </p>
                </div>
            </div>
        </StorefrontLayout>
    );
}
