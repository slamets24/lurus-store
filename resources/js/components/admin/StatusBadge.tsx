import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-900 border-amber-200',
    stock_confirmation: 'bg-orange-100 text-orange-900 border-orange-200',
    ready_to_ship: 'bg-blue-100 text-blue-900 border-blue-200',
    shipped: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    delivered: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    cancelled: 'bg-red-100 text-red-900 border-red-200',
    published: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    draft: 'bg-surface-container-high text-on-surface-variant border-outline-variant/30',
    paid: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    pending_verification: 'bg-amber-100 text-amber-900 border-amber-200',
    failed: 'bg-red-100 text-red-900 border-red-200',
    expired: 'bg-surface-container-high text-on-surface-variant border-outline-variant/30',
};

interface StatusBadgeProps {
    status: string;
    label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn('capitalize', STATUS_STYLES[status] ?? 'bg-surface-container text-on-surface')}
        >
            {label ?? status.replace(/_/g, ' ')}
        </Badge>
    );
}
