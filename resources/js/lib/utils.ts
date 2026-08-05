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
    if (path.startsWith('http') || path.startsWith('/')) {
        return path;
    }
    return `/storage/${path}`;
}
