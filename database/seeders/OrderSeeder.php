<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::where('email', 'customer@aaamen.com')->first();
        if (! $customer) {
            $customer = User::first();
        }

        $findProductId = function (string $name): ?int {
            $slug = Str::slug($name);
            $product = Product::where('slug', $slug)->first();

            return $product?->id;
        };

        $orders = [
            [
                'order_number' => 'AAA-20260701-001',
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'bank_transfer',
                'subtotal' => 349000,
                'shipping_cost' => 15000,
                'total_amount' => 364000,
                'created_at' => '2026-07-01 10:00:00',
                'items' => [
                    ['product_name' => 'STRIERA KNIT GREY BLACK', 'quantity' => 1, 'price' => 349000, 'size' => 'L', 'color' => 'Grey Black'],
                ],
            ],
            [
                'order_number' => 'AAA-20260628-002',
                'status' => 'shipped',
                'payment_status' => 'paid',
                'payment_method' => 'bank_transfer',
                'subtotal' => 698000,
                'shipping_cost' => 0,
                'total_amount' => 698000,
                'created_at' => '2026-06-28 14:30:00',
                'items' => [
                    ['product_name' => 'STRIERA KNIT NAVY GREEN', 'quantity' => 2, 'price' => 349000, 'size' => 'M', 'color' => 'Navy Green'],
                ],
            ],
            [
                'order_number' => 'AAA-20260625-003',
                'status' => 'processing',
                'payment_status' => 'paid',
                'payment_method' => 'bank_transfer',
                'subtotal' => 648000,
                'shipping_cost' => 15000,
                'total_amount' => 663000,
                'created_at' => '2026-06-25 09:15:00',
                'items' => [
                    ['product_name' => 'STRIERA KNIT TERRACOTTA BLACK', 'quantity' => 1, 'price' => 349000, 'size' => 'XL', 'color' => 'Terracotta Black'],
                    ['product_name' => 'CHINO PANT NAVY', 'quantity' => 1, 'price' => 299000, 'size' => 'L', 'color' => 'Navy'],
                ],
            ],
            [
                'order_number' => 'AAA-20260620-004',
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'cod',
                'subtotal' => 349000,
                'shipping_cost' => 0,
                'total_amount' => 349000,
                'created_at' => '2026-06-20 16:45:00',
                'items' => [
                    ['product_name' => 'POLO STRIPE SENSE 2 STRIPE NAVY BLUE', 'quantity' => 1, 'price' => 349000, 'size' => 'L', 'color' => 'Navy Blue'],
                ],
            ],
            [
                'order_number' => 'AAA-20260618-005',
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'bank_transfer',
                'subtotal' => 549000,
                'shipping_cost' => 0,
                'total_amount' => 549000,
                'created_at' => '2026-06-18 11:00:00',
                'items' => [
                    ['product_name' => 'BOMBER JACKET NAVY', 'quantity' => 1, 'price' => 549000, 'size' => 'L', 'color' => 'Navy'],
                ],
            ],
            [
                'order_number' => 'AAA-20260615-006',
                'status' => 'cancelled',
                'payment_status' => 'refunded',
                'payment_method' => 'bank_transfer',
                'subtotal' => 429000,
                'shipping_cost' => 15000,
                'total_amount' => 444000,
                'created_at' => '2026-06-15 08:30:00',
                'items' => [
                    ['product_name' => 'PREMIUM OXFORD SHIRT WHITE', 'quantity' => 1, 'price' => 429000, 'size' => 'M', 'color' => 'White'],
                ],
            ],
            [
                'order_number' => 'AAA-20260610-007',
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'bank_transfer',
                'subtotal' => 698000,
                'shipping_cost' => 0,
                'total_amount' => 698000,
                'created_at' => '2026-06-10 13:00:00',
                'items' => [
                    ['product_name' => 'SWEATER PREMIUM CREAM', 'quantity' => 1, 'price' => 399000, 'size' => 'L', 'color' => 'Cream'],
                    ['product_name' => 'CHINO PANT KHAKI', 'quantity' => 1, 'price' => 299000, 'size' => 'L', 'color' => 'Khaki'],
                ],
            ],
            [
                'order_number' => 'AAA-20260605-008',
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'bank_transfer',
                'subtotal' => 349000,
                'shipping_cost' => 0,
                'total_amount' => 349000,
                'created_at' => '2026-06-05 10:00:00',
                'items' => [
                    ['product_name' => 'STRIERA KNIT BLUE NAVY', 'quantity' => 1, 'price' => 349000, 'size' => 'L', 'color' => 'Blue Navy'],
                ],
            ],
            [
                'order_number' => 'AAA-20260601-009',
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'cod',
                'subtotal' => 349000,
                'shipping_cost' => 0,
                'total_amount' => 349000,
                'created_at' => '2026-06-01 15:30:00',
                'items' => [
                    ['product_name' => 'PLFT96-POLO STRIPE SENSE 2 STRIPE DARK BROWN', 'quantity' => 1, 'price' => 349000, 'size' => 'M', 'color' => 'Dark Brown'],
                ],
            ],
            [
                'order_number' => 'AAA-20260528-010',
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'bank_transfer',
                'subtotal' => 698000,
                'shipping_cost' => 0,
                'total_amount' => 698000,
                'created_at' => '2026-05-28 09:00:00',
                'items' => [
                    ['product_name' => 'POLO STRIPE SENSE 2 STRIPE MAROON WHITE', 'quantity' => 1, 'price' => 349000, 'size' => 'L', 'color' => 'Maroon'],
                    ['product_name' => 'CHINO PANT BLACK', 'quantity' => 1, 'price' => 349000, 'size' => 'L', 'color' => 'Black'],
                ],
            ],
            [
                'order_number' => 'AAA-20260520-011',
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'bank_transfer',
                'subtotal' => 429000,
                'shipping_cost' => 0,
                'total_amount' => 429000,
                'created_at' => '2026-05-20 11:00:00',
                'items' => [
                    ['product_name' => 'PREMIUM OXFORD SHIRT BLUE', 'quantity' => 1, 'price' => 429000, 'size' => 'L', 'color' => 'Blue'],
                ],
            ],
            [
                'order_number' => 'AAA-20260515-012',
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'payment_method' => 'bank_transfer',
                'subtotal' => 399000,
                'shipping_cost' => 15000,
                'total_amount' => 414000,
                'created_at' => '2026-05-15 08:00:00',
                'items' => [
                    ['product_name' => 'SWEATER PREMIUM GREY', 'quantity' => 1, 'price' => 399000, 'size' => 'M', 'color' => 'Grey'],
                ],
            ],
        ];

        $shippingAddress = [
            'name' => 'Budi Santoso',
            'email' => 'customer@aaamen.com',
            'phone' => '081234567890',
            'address' => 'Jl. Merdeka No. 45, RT 03 RW 08',
            'city' => 'Jakarta Selatan',
            'postal_code' => '12345',
        ];

        foreach ($orders as $orderData) {
            $existingOrder = Order::where('order_number', $orderData['order_number'])->first();
            if ($existingOrder) {
                continue;
            }

            $order = Order::create([
                'user_id' => $customer->id,
                'order_number' => $orderData['order_number'],
                'subtotal' => $orderData['subtotal'],
                'shipping_cost' => $orderData['shipping_cost'],
                'total_amount' => $orderData['total_amount'],
                'status' => $orderData['status'],
                'payment_method' => $orderData['payment_method'],
                'payment_status' => $orderData['payment_status'],
                'shipping_address' => $shippingAddress,
                'created_at' => $orderData['created_at'],
                'updated_at' => $orderData['created_at'],
            ]);

            foreach ($orderData['items'] as $itemData) {
                $productId = $findProductId($itemData['product_name']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $productId,
                    'product_name' => $itemData['product_name'],
                    'quantity' => $itemData['quantity'],
                    'price' => $itemData['price'],
                    'size' => $itemData['size'] ?? null,
                    'color' => $itemData['color'] ?? null,
                ]);
            }
        }
    }
}
