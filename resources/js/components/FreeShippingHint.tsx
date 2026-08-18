import { formatCurrency } from '@/lib/utils';

interface FreeShippingHintProps {
    total: number;
    enabled: boolean;
    threshold: number;
}

export function FreeShippingHint({ total, enabled, threshold }: FreeShippingHintProps) {
    if (!enabled || threshold <= 0) {
        return null;
    }

    const remaining = threshold - total;

    return (
        <p className="text-xs text-warm-brown">
            {remaining > 0
                ? `Add ${formatCurrency(remaining)} more for free shipping`
                : 'Free shipping unlocked'}
        </p>
    );
}
