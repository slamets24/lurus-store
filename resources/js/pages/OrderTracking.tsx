import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StorefrontLayout from '@/layouts/StorefrontLayout';

export default function OrderTracking() {
    const [orderNumber, setOrderNumber] = useState('');

    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-md px-4 py-16 md:py-24">
                <h1 className="mb-2 text-center font-serif text-3xl tracking-tight">Track Your Order</h1>
                <p className="mb-8 text-center text-sm text-secondary">
                    Enter your order number to view status and shipping details
                </p>

                <form
                    className="space-y-4 border border-outline-variant p-8"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (orderNumber.trim()) {
                            window.location.href = `/orders/${encodeURIComponent(orderNumber.trim())}`;
                        }
                    }}
                >
                    <div>
                        <label className="mb-1 block text-sm">Order Number</label>
                        <Input
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            placeholder="e.g. ORD-20260101-001"
                        />
                    </div>
                    <Button type="submit" variant="accent" className="w-full">
                        Track Order
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-secondary">
                    Have an account?{' '}
                    <Link href="/orders" className="text-warm-brown hover:underline">View all orders</Link>
                </p>
            </div>
        </StorefrontLayout>
    );
}
