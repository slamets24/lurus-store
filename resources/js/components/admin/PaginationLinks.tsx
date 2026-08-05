import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types/admin';

interface PaginationLinksProps<T> {
    paginator: Paginated<T>;
}

export function PaginationLinks<T>({ paginator }: PaginationLinksProps<T>) {
    if (paginator.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/20 pt-4">
            <p className="text-sm text-on-surface-variant">
                Page {paginator.current_page} of {paginator.last_page} ({paginator.total} total)
            </p>
            <div className="flex flex-wrap gap-1">
                {paginator.links.map((link, index) => {
                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className="px-3 py-1.5 text-sm text-on-surface-variant/50"
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
                                'rounded-sm px-3 py-1.5 text-sm transition-colors',
                                link.active
                                    ? 'bg-warm-brown text-white'
                                    : 'text-on-surface-variant hover:bg-surface-container',
                            )}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
