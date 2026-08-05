import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types';

interface PaginationProps {
    pagination: Paginated<unknown>;
    className?: string;
}

export function Pagination({ pagination, className }: PaginationProps) {
    if (pagination.meta.last_page <= 1) {
        return null;
    }

    return (
        <nav className={cn('flex items-center justify-center gap-1', className)} aria-label="Pagination">
            {pagination.links.map((link, index) => {
                const label = link.label.replace(/&laquo;|&raquo;/g, '').trim() || link.label;

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            className="inline-flex h-9 min-w-9 items-center justify-center px-2 text-sm text-secondary opacity-50"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={cn(
                            'inline-flex h-9 min-w-9 items-center justify-center border px-2 text-sm transition-colors',
                            link.active
                                ? 'border-warm-brown bg-warm-brown text-white'
                                : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-warm-brown hover:text-warm-brown',
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        aria-label={label}
                        aria-current={link.active ? 'page' : undefined}
                    />
                );
            })}
        </nav>
    );
}
