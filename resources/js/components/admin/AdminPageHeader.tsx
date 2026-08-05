import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    eyebrow?: string;
    action?: {
        label: string;
        href: string;
    };
    children?: ReactNode;
}

export function AdminPageHeader({ title, description, eyebrow, action, children }: AdminPageHeaderProps) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
                {eyebrow ? (
                    <p className="text-xs font-semibold tracking-[0.2em] text-warm-brown uppercase">{eyebrow}</p>
                ) : null}
                <h1 className="font-serif text-2xl text-primary md:text-3xl">{title}</h1>
                {description ? (
                    <p className="mt-1 font-sans text-sm text-on-surface-variant/70">{description}</p>
                ) : null}
            </div>
            <div className="flex items-center gap-2">
                {children}
                {action ? (
                    <Button asChild variant="accent">
                        <Link href={action.href}>{action.label}</Link>
                    </Button>
                ) : null}
            </div>
        </div>
    );
}
