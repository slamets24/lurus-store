export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

export interface AdminCategory {
    id: number;
    name: string;
}

export interface ProductVariant {
    id?: number;
    color: string;
    size: string;
    stock: number;
    sku?: string;
    status?: string;
}

export interface ProductImage {
    id: number;
    image_path: string;
    color?: string | null;
    is_primary: boolean;
}

export interface AdminProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    discount_percent?: number;
    effective_price?: number;
    stock: number;
    sku?: string | null;
    description?: string | null;
    sizes?: string[];
    colors?: string[];
    color_hexes?: Record<string, string>;
    material?: string | null;
    status?: string;
    is_active: boolean;
    is_featured?: boolean;
    category?: { id: number; name: string } | null;
    category_id?: number | null;
    category_name?: string;
    images?: ProductImage[];
    variants?: ProductVariant[];
    shopee_url?: string | null;
    tokopedia_url?: string | null;
    tiktok_url?: string | null;
    related_fit_product_id?: number | null;
    created_at?: string;
}

export interface AdminOrder {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    payment_status?: string;
    payment_method?: string;
    payment_channel?: string | null;
    payment_expires_at?: string | null;
    payment_proof_url?: string | null;
    subtotal?: number;
    discount_amount?: number;
    shipping_cost?: number;
    shipping_address?: Record<string, unknown>;
    biteship_order_id?: string | null;
    waybill_id?: string | null;
    shipping_status?: string | null;
    shipping_history?: Array<{ status: string; note?: string; updated_at?: string }>;
    shipped_at?: string | null;
    delivered_at?: string | null;
    can_create_biteship_shipment?: boolean;
    can_print_shipping_label?: boolean;
    notes?: string | null;
    created_at: string;
    updated_at?: string;
    customer?: {
        name: string;
        email?: string;
        phone?: string;
        is_guest?: boolean;
    };
    user?: { name: string } | null;
    items_count?: number;
    items?: AdminOrderItem[];
    can_send_testimonial?: boolean;
}

export interface AdminOrderItem {
    id: number;
    product_id?: number;
    product_name: string;
    sku?: string | null;
    quantity: number;
    price: number;
    size?: string | null;
    color?: string | null;
    image?: string | null;
    testimonial?: {
        id: number;
        rating: number;
        comment: string;
        approved_at: string | null;
    } | null;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    stock_confirmation: 'Stock Confirmation',
    ready_to_ship: 'Ready to Ship',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    pending_verification: 'Pending Verification',
    paid: 'Paid',
    failed: 'Failed',
    expired: 'Expired',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
    bank_transfer: 'Bank Transfer',
    midtrans: 'Midtrans',
};
