export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    postal_code?: string | null;
}

export interface AuthProps {
    user: User | null;
    isAdmin: boolean;
    isSuperAdmin: boolean;
}

export interface NavCategory {
    name: string;
    slug: string;
}

export interface NavCollection {
    name: string;
    slug: string;
    description?: string | null;
    subtitle?: string | null;
}

export interface SocialLink {
    name: string;
    url: string;
}

export interface PromoPopup {
    enabled: boolean;
    title?: string;
    body?: string;
    image?: string | null;
    cta_label?: string;
    cta_url?: string;
}

export interface CommerceProps {
    paymentsEnabled: boolean;
    flatShippingCost: number;
}

export interface MidtransProps {
    clientKey: string;
    snapJsUrl: string;
}

export interface FlashProps {
    message?: string | null;
    success?: string | null;
    error?: string | null;
    midtransPayment?: { token: string; redirect_url: string } | null;
    cart_item_created?: boolean;
}

export interface ProductCard {
    id: number;
    name: string;
    slug: string;
    price: number;
    discount_percent?: number;
    effective_price?: number;
    image?: string | null;
    hover_image?: string | null;
    is_new?: boolean;
    stock?: number;
}

export interface CartPreviewItem {
    id: number;
    product_id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        image?: string | null;
    };
}

export interface CartPreview {
    items: CartPreviewItem[];
    subtotal: number;
    discount_amount: number;
    total: number;
}

export interface HomeSection {
    key: string;
    label: string;
    categories: Array<{ name: string; slug: string }>;
    products: ProductCard[];
    productsByCategory: Record<string, ProductCard[]>;
}

export interface HeroBanner {
    id: string;
    desktopImage?: string | null;
    mobileImage?: string | null;
    link?: string | null;
    title?: string | null;
    subtitle?: string | null;
    ctaLabel?: string | null;
}

export interface AnnouncementBar {
    enabled: boolean;
    text: string;
    link?: string | null;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    links: PaginationLink[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    image?: string | null;
    description?: string | null;
    products_count?: number;
    children?: Category[];
}

export interface Collection {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    subtitle?: string | null;
    banner_image?: string | null;
}

export interface ProductDetailImage {
    id: number;
    image_path: string;
    thumb_path?: string | null;
    color?: string | null;
}

export interface ProductVariant {
    color?: string | null;
    size?: string | null;
    stock: number;
}

export interface ProductDetailData {
    id: number;
    name: string;
    slug: string;
    price: number;
    discount_percent?: number;
    description?: string | null;
    stock: number;
    sizes?: string[];
    colors?: string[];
    color_hexes?: Record<string, string>;
    material?: string | null;
    care_instructions?: string | null;
    shopee_url?: string | null;
    tokopedia_url?: string | null;
    tiktok_url?: string | null;
    size_chart_url?: string | null;
    related_fit?: { id: number; name: string; slug: string } | null;
    category?: { name: string; slug: string } | null;
    images: ProductDetailImage[];
    published_variants: ProductVariant[];
}

export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    size?: string | null;
    color?: string | null;
    unit_price?: number;
    list_price?: number;
    discount_percent?: number;
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        image?: string | null;
        images?: Array<{ image_path: string }>;
    };
}

export interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    size?: string | null;
    color?: string | null;
    product?: {
        id: number;
        name: string;
        slug: string;
        images?: Array<{ image_path: string }>;
    };
}

export interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    payment_method: string;
    subtotal: number;
    discount_amount: number;
    shipping_cost: number;
    total: number;
    shipping_address: Record<string, string>;
    shipping_courier?: string | null;
    shipping_service?: string | null;
    waybill?: string | null;
    notes?: string | null;
    created_at: string;
    items: OrderItem[];
}

export interface WishlistItem {
    id: number;
    product_id: number;
    product: ProductCard & {
        category?: { name: string; slug: string } | null;
        images?: Array<{ image_path: string }>;
    };
}

export interface Testimonial {
    id: number;
    name: string;
    rating: number;
    comment: string;
    product_name?: string | null;
}

export interface FeaturedCollectionCard {
    title: string;
    slug: string;
    subtitle: string;
    product: ProductCard;
}
