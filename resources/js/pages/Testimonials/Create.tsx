import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { cn, storageUrl } from '@/lib/utils';

interface TestimonialItem {
    id: number;
    product_name: string;
    size?: string | null;
    color?: string | null;
    image?: string | null;
}

interface TestimonialsCreateProps {
    order: {
        order_number: string;
        items: TestimonialItem[];
    };
    token: string;
}

export default function TestimonialsCreate({ order, token }: TestimonialsCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        reviews: order.items.map((item) => ({
            order_item_id: item.id,
            rating: 5,
            comment: '',
        })),
    });

    const updateReview = (index: number, field: 'rating' | 'comment', value: number | string) => {
        const reviews = [...data.reviews];
        reviews[index] = { ...reviews[index], [field]: value };
        setData('reviews', reviews);
    };

    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-2xl px-4 py-10 md:py-16">
                <h1 className="mb-2 font-serif text-3xl tracking-tight">Share Your Experience</h1>
                <p className="mb-10 text-sm text-secondary">
                    Order {order.order_number} — tell us what you think about your purchase
                </p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(`/testimonials/${token}`);
                    }}
                    className="space-y-8"
                >
                    {order.items.map((item, index) => (
                        <section key={item.id} className="border border-outline-variant p-6">
                            <div className="mb-4 flex gap-4">
                                {item.image && (
                                    <img src={storageUrl(item.image)} alt="" className="h-20 w-16 object-cover" />
                                )}
                                <div>
                                    <p className="font-medium">{item.product_name}</p>
                                    {(item.size || item.color) && (
                                        <p className="text-xs text-secondary">
                                            {[item.color, item.size].filter(Boolean).join(' / ')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="mb-2 text-sm">Rating</p>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => updateReview(index, 'rating', star)}
                                            className={cn(
                                                'text-xl transition-colors',
                                                star <= data.reviews[index].rating ? 'text-warm-brown' : 'text-outline-variant',
                                            )}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm">Your Review</label>
                                <textarea
                                    value={data.reviews[index].comment}
                                    onChange={(e) => updateReview(index, 'comment', e.target.value)}
                                    rows={4}
                                    className="flex w-full rounded-sm border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-brown"
                                    placeholder="Share your thoughts (min. 10 characters)..."
                                />
                            </div>
                        </section>
                    ))}

                    {errors.reviews && <p className="text-sm text-error">{errors.reviews}</p>}

                    <Button type="submit" variant="accent" className="w-full" disabled={processing}>
                        Submit Reviews
                    </Button>
                </form>
            </div>
        </StorefrontLayout>
    );
}
