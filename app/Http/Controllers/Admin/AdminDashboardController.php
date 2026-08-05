<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    private const LOW_STOCK_THRESHOLD = 5;

    /** @var list<string> */
    private const CHART_RANGES = ['7d', '30d', '6m', '1y'];

    public function index(Request $request)
    {
        $chartRange = $request->string('range')->toString();
        if (! in_array($chartRange, self::CHART_RANGES, true)) {
            $chartRange = '30d';
        }

        $chart = $this->chartStats($chartRange);

        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', Order::STATUS_DELIVERED)->sum('total_amount');
        $totalCustomers = User::where('role', User::ROLE_CUSTOMER)->count();

        $recentOrders = Order::with(['user', 'items'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total_amount' => (float) $order->total_amount,
                'status' => $order->status,
                'created_at' => $order->created_at->toISOString(),
                'user' => $order->user ? ['name' => $order->user->name] : null,
                'items_count' => $order->items->count(),
            ]);

        $needsAction = [
            'pending' => Order::where('status', Order::STATUS_PENDING)->count(),
            'readyToShip' => Order::where('status', Order::STATUS_READY_TO_SHIP)->count(),
            'stockConfirmation' => Order::where('status', Order::STATUS_STOCK_CONFIRMATION)->count(),
            'pendingVerification' => Order::where('payment_status', Order::PAYMENT_PENDING_VERIFICATION)->count(),
            'overduePending' => Order::where('status', Order::STATUS_PENDING)
                ->where('created_at', '<=', now()->subDay())
                ->count(),
            'pendingTestimonials' => Testimonial::whereNull('approved_at')->count(),
            'lowStock' => Product::where('stock', '<=', self::LOW_STOCK_THRESHOLD)->count(),
        ];

        $lowStockProducts = Product::query()
            ->where('stock', '<=', self::LOW_STOCK_THRESHOLD)
            ->orderBy('stock')
            ->orderBy('name')
            ->take(8)
            ->get()
            ->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'stock' => $product->stock,
                'is_active' => $product->is_active,
                'price' => (float) $product->price,
            ]);

        $topProducts = OrderItem::query()
            ->select(
                'product_id',
                'product_name',
                DB::raw('SUM(quantity) as sold'),
                DB::raw('SUM(quantity * price) as revenue')
            )
            ->whereHas('order', fn ($q) => $q->where('status', '!=', Order::STATUS_CANCELLED))
            ->groupBy('product_id', 'product_name')
            ->orderByDesc('sold')
            ->take(5)
            ->get()
            ->map(fn ($item) => [
                'product_id' => $item->product_id,
                'name' => $item->product_name,
                'sold' => (int) $item->sold,
                'revenue' => (float) $item->revenue,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalOrders' => $totalOrders,
                'totalRevenue' => $totalRevenue,
                'totalCustomers' => $totalCustomers,
                'chartRange' => $chartRange,
                'chartGranularity' => $chart['granularity'],
                'chartStats' => $chart['points'],
                'needsAction' => $needsAction,
                'recentOrders' => $recentOrders,
                'lowStockProducts' => $lowStockProducts,
                'topProducts' => $topProducts,
            ],
        ]);
    }

    /**
     * @return array{granularity: string, points: list<array{key: string, label: string, revenue: float, orders: int}>}
     */
    private function chartStats(string $range): array
    {
        $driver = DB::connection()->getDriverName();
        $locale = app()->getLocale();
        $revenueCase = 'SUM(CASE WHEN status = \''.Order::STATUS_DELIVERED.'\' THEN total_amount ELSE 0 END)';
        $ordersCase = 'SUM(CASE WHEN status != \''.Order::STATUS_CANCELLED.'\' THEN 1 ELSE 0 END)';

        if (in_array($range, ['7d', '30d'], true)) {
            $span = $range === '7d' ? 6 : 29;
            $from = now()->startOfDay()->subDays($span);
            $to = now()->startOfDay();

            $dateExpression = match ($driver) {
                'sqlite' => 'date(created_at)',
                default => 'DATE(created_at)',
            };

            $rows = Order::query()
                ->select(
                    DB::raw($dateExpression.' as bucket'),
                    DB::raw($revenueCase.' as revenue'),
                    DB::raw($ordersCase.' as orders')
                )
                ->where('created_at', '>=', $from)
                ->groupBy('bucket')
                ->get()
                ->keyBy(fn ($row) => substr((string) $row->bucket, 0, 10));

            $points = [];
            for ($day = $from; $day->lte($to); $day = $day->addDay()) {
                $key = $day->toDateString();
                $row = $rows->get($key);
                $points[] = [
                    'key' => $key,
                    'label' => $day->locale($locale)->translatedFormat('j M'),
                    'revenue' => (float) ($row->revenue ?? 0),
                    'orders' => (int) ($row->orders ?? 0),
                ];
            }

            return ['granularity' => 'day', 'points' => $points];
        }

        $monthsBack = $range === '6m' ? 5 : 11;
        $from = now()->startOfMonth()->subMonths($monthsBack);
        $to = now()->startOfMonth();

        [$monthExpression, $yearExpression] = match ($driver) {
            'pgsql' => ['EXTRACT(MONTH FROM created_at)', 'EXTRACT(YEAR FROM created_at)'],
            'sqlite' => ['strftime("%m", created_at)', 'strftime("%Y", created_at)'],
            default => ['MONTH(created_at)', 'YEAR(created_at)'],
        };

        $rows = Order::query()
            ->select(
                DB::raw($yearExpression.' as year'),
                DB::raw($monthExpression.' as month'),
                DB::raw($revenueCase.' as revenue'),
                DB::raw($ordersCase.' as orders')
            )
            ->where('created_at', '>=', $from)
            ->groupByRaw($yearExpression.', '.$monthExpression)
            ->get()
            ->keyBy(fn ($row) => sprintf('%04d-%02d', (int) $row->year, (int) $row->month));

        $points = [];
        for ($cursor = $from; $cursor->lte($to); $cursor = $cursor->addMonth()) {
            $key = $cursor->format('Y-m');
            $row = $rows->get($key);
            $points[] = [
                'key' => $key,
                'label' => $cursor->locale($locale)->translatedFormat('M'),
                'revenue' => (float) ($row->revenue ?? 0),
                'orders' => (int) ($row->orders ?? 0),
            ];
        }

        return ['granularity' => 'month', 'points' => $points];
    }
}
