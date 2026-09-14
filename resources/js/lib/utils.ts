import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function storageUrl(path?: string | null): string {
    if (!path) {
        return '/images/placeholder-product.svg';
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
        try {
            const parsed = new URL(path);
            if (parsed.pathname.startsWith('/storage') || parsed.pathname.startsWith('/images')) {
                path = parsed.pathname;
            } else {
                return path;
            }
        } catch {
            return path;
        }
    }
    // Clean redundant multiple slashes
    let cleaned = path.replace(/\/+/g, '/');
    // Remove duplicate /storage/ prefixes if present e.g. /storage/storage/
    cleaned = cleaned.replace(/^\/storage\/storage\//, '/storage/');
    // If it points to /storage/images where assets are actually under public/images
    if (cleaned.startsWith('/storage/images/')) {
        cleaned = cleaned.replace('/storage/images/', '/images/');
    }
    if (cleaned.startsWith('/')) {
        return cleaned;
    }
    return `/storage/${cleaned}`;
}

export function csrfHeaders(): HeadersInit {
    const token = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/)?.[1];

    return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(token ? { 'X-XSRF-TOKEN': decodeURIComponent(token) } : {}),
    };
}
