import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { formatDate, formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ORDER_STATUS_LABELS } from '@/types/admin';

interface ChartStat {
    key: string;
    label: string;
    revenue: number;
    orders: number;
}

interface Stats {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    chartRange: '7d' | '30d' | '6m' | '1y';
    chartGranularity: 'day' | 'month';
    chartStats: ChartStat[];
    needsAction: {
        pending: number;
        readyToShip: number;
        stockConfirmation: number;
        pendingVerification: number;
        overduePending: number;
        pendingTestimonials: number;
        lowStock: number;
    };
    recentOrders: Array<{
        id: number;
        order_number: string;
        total_amount: number;
        status: string;
        created_at: string;
        user: { name: string } | null;
        items_count: number;
    }>;
    lowStockProducts: Array<{
        id: number;
        name: string;
        stock: number;
        is_active: boolean;
        price: number;
    }>;
    topProducts: Array<{
        product_id: number | null;
        name: string;
        sold: number;
        revenue: number;
    }>;
}

interface DashboardProps {
    stats: Stats;
}

const RANGE_OPTIONS = [
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '6m', label: '6 months' },
    { value: '1y', label: '1 year' },
] as const;

function StatCard({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string;
    icon: typeof Package;
}) {
    return (
        <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.15em] text-on-surface-variant uppercase">
                        {label}
                    </p>
                    <p className="mt-2 font-serif text-2xl text-primary">{value}</p>
                </div>
                <div className="rounded-sm bg-warm-brown/10 p-2 text-warm-brown">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

export default function Dashboard({ stats }: DashboardProps) {
    const maxRevenue = Math.max(...stats.chartStats.map((point) => point.revenue), 1);

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl space-y-8">
                <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-warm-brown uppercase">Overview</p>
                    <h1 className="mt-1 font-serif text-3xl text-primary">Dashboard</h1>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Products" value={String(stats.totalProducts)} icon={Package} />
                    <StatCard label="Orders" value={String(stats.totalOrders)} icon={ShoppingBag} />
                    <StatCard label="Revenue" value={formatPrice(stats.totalRevenue)} icon={TrendingUp} />
                    <StatCard label="Customers" value={String(stats.totalCustomers)} icon={Users} />
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 xl:col-span-2">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="font-serif text-xl text-primary">Revenue & Orders</h2>
                            <div className="flex gap-1 rounded-sm bg-surface-container p-1">
                                {RANGE_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            router.get('/admin', { range: option.value }, { preserveState: true })
                                        }
                                        className={cn(
                                            'rounded-sm px-3 py-1 text-xs font-medium transition-colors',
                                            stats.chartRange === option.value
                                                ? 'bg-warm-brown text-white'
                                                : 'text-on-surface-variant hover:text-on-surface',
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex h-48 items-end gap-1">
                            {stats.chartStats.map((point) => (
                                <div key={point.key} className="group flex flex-1 flex-col items-center gap-2">
                                    <div className="relative flex h-40 w-full items-end">
                                        <div
                                            className="w-full rounded-t-sm bg-warm-brown/80 transition-colors group-hover:bg-warm-brown"
                                            style={{ height: `${Math.max((point.revenue / maxRevenue) * 100, 4)}%` }}
                                            title={`${point.label}: ${formatPrice(point.revenue)} · ${point.orders} orders`}
                                        />
                                    </div>
                                    <span className="text-[10px] text-on-surface-variant">{point.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6">
                        <h2 className="font-serif text-xl text-primary">Needs Action</h2>
                        <ul className="mt-4 space-y-3 text-sm">
                            {[
                                { label: 'Pending orders', count: stats.needsAction.pending, href: '/admin/orders?status=pending' },
                                { label: 'Ready to ship', count: stats.needsAction.readyToShip, href: '/admin/orders?status=ready_to_ship' },
                                { label: 'Stock confirmation', count: stats.needsAction.stockConfirmation, href: '/admin/orders?status=stock_confirmation' },
                                { label: 'Payment verification', count: stats.needsAction.pendingVerification, href: '/admin/orders?payment_status=pending_verification' },
                                { label: 'Low stock products', count: stats.needsAction.lowStock, href: '/admin/products' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center justify-between rounded-sm px-2 py-1.5 hover:bg-surface-container"
                                    >
                                        <span className="text-on-surface-variant">{item.label}</span>
                                        <span className={cn('font-semibold', item.count > 0 ? 'text-warm-brown' : 'text-on-surface-variant/50')}>
                                            {item.count}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest">
                        <div className="flex items-center justify-between border-b border-outline-variant/15 px-6 py-4">
                            <h2 className="font-serif text-xl text-primary">Recent Orders</h2>
                            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-warm-brown hover:underline">
                                View all <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="divide-y divide-outline-variant/10">
                            {stats.recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/admin/orders/${order.id}`}
                                    className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-surface-container/50"
                                >
                                    <div>
                                        <p className="font-medium text-on-surface">{order.order_number}</p>
                                        <p className="text-sm text-on-surface-variant">
                                            {order.user?.name ?? 'Guest'} · {order.items_count} items
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatPrice(order.total_amount)}</p>
                                        <div className="mt-1 flex items-center justify-end gap-2">
                                            <StatusBadge status={order.status} label={ORDER_STATUS_LABELS[order.status]} />
                                            <span className="text-xs text-on-surface-variant">{formatDate(order.created_at)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6">
                            <h2 className="font-serif text-xl text-primary">Low Stock</h2>
                            <ul className="mt-4 space-y-3">
                                {stats.lowStockProducts.map((product) => (
                                    <li key={product.id} className="flex items-center justify-between text-sm">
                                        <Link href={`/admin/products/${product.id}/edit`} className="hover:text-warm-brown">
                                            {product.name}
                                        </Link>
                                        <span className="font-semibold text-error">{product.stock} left</span>
                                    </li>
                                ))}
                                {stats.lowStockProducts.length === 0 ? (
                                    <li className="text-sm text-on-surface-variant">All products well stocked.</li>
                                ) : null}
                            </ul>
                        </div>

                        <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6">
                            <h2 className="font-serif text-xl text-primary">Top Products</h2>
                            <ul className="mt-4 space-y-3">
                                {stats.topProducts.map((product) => (
                                    <li key={product.product_id ?? product.name} className="flex items-center justify-between text-sm">
                                        <span>{product.name}</span>
                                        <span className="text-on-surface-variant">
                                            {product.sold} sold · {formatPrice(product.revenue)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
