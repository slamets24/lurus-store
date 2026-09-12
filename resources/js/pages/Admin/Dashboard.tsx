import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Clock,
    Package,
    PackagePlus,
    ShoppingBag,
    TrendingUp,
    Truck,
    Users,
} from 'lucide-react';
import * as React from 'react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import AdminLayout from '@/layouts/AdminLayout';
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
    { value: '7d', label: '7 Hari Terakhir' },
    { value: '30d', label: '30 Hari Terakhir' },
    { value: '6m', label: '6 Bulan' },
    { value: '1y', label: '1 Tahun' },
] as const;

export default function Dashboard({ stats }: DashboardProps) {
    const maxRevenue = Math.max(...stats.chartStats.map((point) => point.revenue), 1);
    const [hoveredPoint, setHoveredPoint] = React.useState<ChartStat | null>(null);

    const totalActionsCount =
        (stats.needsAction.pending || 0) +
        (stats.needsAction.readyToShip || 0) +
        (stats.needsAction.pendingVerification || 0) +
        (stats.needsAction.stockConfirmation || 0) +
        (stats.needsAction.lowStock || 0) +
        (stats.needsAction.pendingTestimonials || 0);

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard Admin" />

            <div className="mx-auto max-w-7xl space-y-8 pb-12">
                {/* Header & Quick Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold tracking-wider text-warm-brown uppercase">
                            IKHTISAR TOKO
                        </p>
                        <h1 className="mt-1 font-serif text-3xl font-normal text-stone-900 tracking-tight">
                            Dashboard Admin
                        </h1>
                        <p className="mt-1 font-sans text-sm text-stone-500">
                            Pantau performa penjualan, pesanan masuk, dan manajemen produk toko Anda.
                        </p>
                    </div>

                    {/* Quick Shortcuts for Admin */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                            href="/admin/products/create"
                            className="inline-flex items-center gap-2 rounded-md bg-[#8b7355] px-4 py-2 font-sans text-xs font-semibold text-white shadow-sm hover:bg-[#786348] transition cursor-pointer"
                        >
                            <PackagePlus className="h-4 w-4" />
                            <span>+ Tambah Produk Baru</span>
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="inline-flex items-center gap-2 rounded-md border border-[#e5e1dc] bg-white px-3.5 py-2 font-sans text-xs font-semibold text-stone-700 hover:bg-[#faf8f5] transition cursor-pointer"
                        >
                            <ShoppingBag className="h-4 w-4 text-stone-500" />
                            <span>Kelola Pesanan</span>
                        </Link>
                    </div>
                </div>

                {/* 4 Stat Overview Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {/* Produk */}
                    <Link
                        href="/admin/products"
                        className="group rounded-2xl border border-[#e5e1dc] bg-white p-5 shadow-sm hover:border-warm-brown/60 hover:shadow transition"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                    TOTAL PRODUK
                                </p>
                                <p className="mt-2 font-serif text-3xl font-normal text-stone-900">
                                    {stats.totalProducts}
                                </p>
                                <p className="mt-1 text-xs text-stone-400 group-hover:text-warm-brown transition flex items-center gap-1">
                                    Lihat semua katalog <ArrowRight className="h-3 w-3" />
                                </p>
                            </div>
                            <div className="rounded-xl bg-[#faf8f5] p-3 text-warm-brown border border-[#ece8e3]">
                                <Package className="h-5 w-5" />
                            </div>
                        </div>
                    </Link>

                    {/* Pesanan */}
                    <Link
                        href="/admin/orders"
                        className="group rounded-2xl border border-[#e5e1dc] bg-white p-5 shadow-sm hover:border-warm-brown/60 hover:shadow transition"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                    TOTAL PESANAN
                                </p>
                                <p className="mt-2 font-serif text-3xl font-normal text-stone-900">
                                    {stats.totalOrders}
                                </p>
                                <p className="mt-1 text-xs text-stone-400 group-hover:text-warm-brown transition flex items-center gap-1">
                                    Riwayat seluruh order <ArrowRight className="h-3 w-3" />
                                </p>
                            </div>
                            <div className="rounded-xl bg-[#faf8f5] p-3 text-warm-brown border border-[#ece8e3]">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                        </div>
                    </Link>

                    {/* Pendapatan */}
                    <div className="rounded-2xl border border-[#e5e1dc] bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                    PENDAPATAN SELESAI
                                </p>
                                <p className="mt-2 font-serif text-2xl font-normal text-stone-900 truncate">
                                    {formatPrice(stats.totalRevenue)}
                                </p>
                                <p className="mt-1 text-xs text-stone-400">
                                    Dari pesanan berstatus sukses/terkirim
                                </p>
                            </div>
                            <div className="rounded-xl bg-[#faf8f5] p-3 text-emerald-700 border border-[#ece8e3]">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Pelanggan */}
                    <Link
                        href="/admin/users"
                        className="group rounded-2xl border border-[#e5e1dc] bg-white p-5 shadow-sm hover:border-warm-brown/60 hover:shadow transition"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                    PELANGGAN
                                </p>
                                <p className="mt-2 font-serif text-3xl font-normal text-stone-900">
                                    {stats.totalCustomers}
                                </p>
                                <p className="mt-1 text-xs text-stone-400 group-hover:text-warm-brown transition flex items-center gap-1">
                                    Akun pembeli terdaftar <ArrowRight className="h-3 w-3" />
                                </p>
                            </div>
                            <div className="rounded-xl bg-[#faf8f5] p-3 text-stone-700 border border-[#ece8e3]">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Section 2: Chart & Needs Action */}
                <div className="grid gap-6 xl:grid-cols-3">
                    {/* Revenue & Orders Chart */}
                    <div className="rounded-2xl border border-[#e5e1dc] bg-white p-6 sm:p-7 shadow-sm xl:col-span-2 min-w-0 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                                    GRAFIK PENDAPATAN & PESANAN
                                </h2>
                                <p className="text-xs text-stone-500 mt-0.5">
                                    Pantau omzet dan volume pesanan berdasarkan rentang waktu
                                </p>
                            </div>

                            {/* Range Selector */}
                            <div className="flex gap-1 rounded-lg border border-[#e5e1dc] bg-[#faf8f5] p-1">
                                {RANGE_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            router.get('/admin', { range: option.value }, { preserveState: true })
                                        }
                                        className={cn(
                                            'rounded-md px-3 py-1 font-sans text-xs font-medium transition cursor-pointer',
                                            stats.chartRange === option.value
                                                ? 'bg-[#8b7355] text-white shadow-xs'
                                                : 'text-stone-600 hover:text-stone-900 hover:bg-white',
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hover Tooltip Box */}
                        <div className="h-9 flex items-center">
                            {hoveredPoint ? (
                                <div className="inline-flex items-center gap-3 rounded-md bg-stone-900 px-3 py-1 text-xs text-white shadow">
                                    <span className="font-semibold text-stone-300">{hoveredPoint.label}:</span>
                                    <span className="font-bold text-amber-300">{formatPrice(hoveredPoint.revenue)}</span>
                                    <span className="text-stone-400">· {hoveredPoint.orders} pesanan</span>
                                </div>
                            ) : (
                                <p className="text-xs text-stone-400 italic">
                                    Arahkan kursor pada baris diagram untuk rincian pendapatan & pesanan harian.
                                </p>
                            )}
                        </div>

                        {/* Chart Bars Container with responsive bounds */}
                        <div className="w-full min-w-0 overflow-x-auto pb-1">
                            <div className="flex h-52 min-w-[340px] items-end gap-1 sm:gap-1.5 pt-2 border-b border-[#f0ece5] pb-2">
                                {stats.chartStats.map((point, index) => {
                                    const isHovered = hoveredPoint?.key === point.key;
                                    const step = Math.ceil(stats.chartStats.length / 7);
                                    const showLabel =
                                        stats.chartStats.length <= 12 ||
                                        index === 0 ||
                                        index === stats.chartStats.length - 1 ||
                                        index % step === 0;

                                    return (
                                        <div
                                            key={point.key}
                                            onMouseEnter={() => setHoveredPoint(point)}
                                            onMouseLeave={() => setHoveredPoint(null)}
                                            className="group flex flex-1 min-w-0 flex-col items-center gap-1.5 cursor-pointer h-full justify-end"
                                        >
                                            <div className="relative flex w-full items-end justify-center h-44">
                                                <div
                                                    className={cn(
                                                        'w-full max-w-[22px] rounded-t-sm transition-all',
                                                        isHovered
                                                            ? 'bg-[#8b7355] shadow-xs'
                                                            : 'bg-stone-300/80 group-hover:bg-[#8b7355]/80',
                                                    )}
                                                    style={{
                                                        height: `${Math.max((point.revenue / maxRevenue) * 100, 4)}%`,
                                                    }}
                                                />
                                            </div>
                                            <span
                                                className={cn(
                                                    'text-[10px] font-medium text-stone-500 whitespace-nowrap block text-center transition-colors',
                                                    isHovered && 'text-[#8b7355] font-bold',
                                                )}
                                                title={point.label}
                                            >
                                                {showLabel ? point.label : <span className="opacity-0">·</span>}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Needs Action / Perlu Tindakan */}
                    <div className="rounded-2xl border border-[#e5e1dc] bg-white p-6 sm:p-7 shadow-sm min-w-0 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#f0ece5] pb-3">
                            <div>
                                <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                                    PERLU TINDAKAN ADMIN
                                </h2>
                                <p className="text-xs text-stone-500 mt-0.5">Tugas & pesanan yang perlu diproses</p>
                            </div>
                            {totalActionsCount > 0 ? (
                                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                                    {totalActionsCount} aktif
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                    <CheckCircle2 className="h-3 w-3" /> Beres
                                </span>
                            )}
                        </div>

                        <ul className="space-y-2.5">
                            {[
                                {
                                    label: 'Pesanan Menunggu Pembayaran',
                                    count: stats.needsAction.pending,
                                    href: '/admin/orders?status=pending',
                                    isWarning: stats.needsAction.pending > 0,
                                    icon: Clock,
                                },
                                {
                                    label: 'Verifikasi Bukti Pembayaran',
                                    count: stats.needsAction.pendingVerification,
                                    href: '/admin/orders?payment_status=pending_verification',
                                    isWarning: stats.needsAction.pendingVerification > 0,
                                    icon: CheckCircle2,
                                },
                                {
                                    label: 'Siap Dikirim (Perlu Input Resi)',
                                    count: stats.needsAction.readyToShip,
                                    href: '/admin/orders?status=ready_to_ship',
                                    isWarning: stats.needsAction.readyToShip > 0,
                                    icon: Truck,
                                },
                                {
                                    label: 'Konfirmasi Ketersediaan Stok',
                                    count: stats.needsAction.stockConfirmation,
                                    href: '/admin/orders?status=stock_confirmation',
                                    isWarning: stats.needsAction.stockConfirmation > 0,
                                    icon: AlertCircle,
                                },
                                {
                                    label: 'Produk Stok Menipis (<= 5 pcs)',
                                    count: stats.needsAction.lowStock,
                                    href: '/admin/products',
                                    isWarning: stats.needsAction.lowStock > 0,
                                    icon: Package,
                                },
                            ].map((item) => {
                                const ItemIcon = item.icon;
                                return (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="flex items-center justify-between rounded-xl border border-[#f0ece5] bg-[#faf8f5] p-3 hover:bg-[#f0ece5]/70 transition group"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <ItemIcon
                                                    className={cn(
                                                        'h-4 w-4',
                                                        item.count > 0 ? 'text-[#8b7355]' : 'text-stone-400',
                                                    )}
                                                />
                                                <span className="font-sans text-xs font-medium text-stone-700 group-hover:text-stone-900">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <span
                                                className={cn(
                                                    'rounded-full px-2.5 py-0.5 text-xs font-bold',
                                                    item.count > 0
                                                        ? 'bg-amber-500 text-white'
                                                        : 'bg-stone-200/70 text-stone-500',
                                                )}
                                            >
                                                {item.count}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Section 3: Recent Orders & Inventory / Top Products */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Orders List */}
                    <div className="rounded-2xl border border-[#e5e1dc] bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between border-b border-[#f0ece5] px-6 py-4 bg-[#faf8f5]">
                            <div>
                                <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                                    PESANAN TERBARU
                                </h2>
                                <p className="text-xs text-stone-500 mt-0.5">Daftar transaksi masuk terkini</p>
                            </div>
                            <Link
                                href="/admin/orders"
                                className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-warm-brown hover:text-stone-900 transition"
                            >
                                <span>Lihat Semua</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        <div className="divide-y divide-[#f0ece5]">
                            {stats.recentOrders.length > 0 ? (
                                stats.recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/admin/orders/${order.id}`}
                                        className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[#faf8f5] transition"
                                    >
                                        <div>
                                            <p className="font-sans text-sm font-semibold text-stone-900">
                                                {order.order_number}
                                            </p>
                                            <p className="text-xs text-stone-500 mt-0.5">
                                                {order.user?.name ?? 'Pembeli (Tamu)'} · {order.items_count} barang
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-sans text-sm font-bold text-stone-900">
                                                {formatPrice(order.total_amount)}
                                            </p>
                                            <div className="mt-1 flex items-center justify-end gap-2">
                                                <StatusBadge
                                                    status={order.status}
                                                    label={ORDER_STATUS_LABELS[order.status] ?? order.status}
                                                />
                                                <span className="text-[11px] text-stone-400">
                                                    {formatDate(order.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center text-sm text-stone-500">
                                    Belum ada pesanan masuk saat ini.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Low Stock & Top Products */}
                    <div className="space-y-6">
                        {/* Low Stock Alert */}
                        <div className="rounded-2xl border border-[#e5e1dc] bg-white p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-[#f0ece5] pb-3">
                                <div>
                                    <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                                        STOK MENIPIS (PERINGATAN)
                                    </h2>
                                    <p className="text-xs text-stone-500 mt-0.5">
                                        Produk dengan sisa stok &le; 5 pcs yang butuh restock
                                    </p>
                                </div>
                                <Link
                                    href="/admin/products"
                                    className="font-sans text-xs font-semibold text-warm-brown hover:text-stone-900"
                                >
                                    Semua Produk
                                </Link>
                            </div>

                            <ul className="space-y-2.5">
                                {stats.lowStockProducts.length > 0 ? (
                                    stats.lowStockProducts.map((product) => (
                                        <li
                                            key={product.id}
                                            className="flex items-center justify-between rounded-xl border border-[#f0ece5] bg-[#faf8f5] px-3.5 py-2.5 text-sm"
                                        >
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="font-medium text-stone-800 hover:text-warm-brown truncate max-w-[240px]"
                                            >
                                                {product.name}
                                            </Link>
                                            <span className="rounded-md bg-red-100 px-2.5 py-0.5 font-sans text-xs font-bold text-red-700">
                                                Sisa {product.stock} pcs
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 rounded-lg p-3">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>Semua stok produk dalam kondisi aman (&gt; 5 pcs).</span>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Top Products */}
                        <div className="rounded-2xl border border-[#e5e1dc] bg-white p-6 shadow-sm space-y-4">
                            <div className="border-b border-[#f0ece5] pb-3">
                                <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                                    PRODUK PALING LARIS
                                </h2>
                                <p className="text-xs text-stone-500 mt-0.5">Artikel dengan penjualan tertinggi</p>
                            </div>

                            <ul className="space-y-2.5">
                                {stats.topProducts.length > 0 ? (
                                    stats.topProducts.map((product, idx) => (
                                        <li
                                            key={product.product_id ?? product.name}
                                            className="flex items-center justify-between rounded-xl border border-[#f0ece5] bg-[#faf8f5] px-3.5 py-2.5 text-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-200 text-[11px] font-bold text-stone-700">
                                                    {idx + 1}
                                                </span>
                                                <span className="font-medium text-stone-800 truncate max-w-[200px]">
                                                    {product.name}
                                                </span>
                                            </div>
                                            <span className="font-sans text-xs font-semibold text-stone-600">
                                                <strong className="text-stone-900">{product.sold} terjual</strong> ·{' '}
                                                {formatPrice(product.revenue)}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-xs text-stone-500 italic p-2">
                                        Belum ada data produk terjual.
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
