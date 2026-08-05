import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-primary text-on-primary',
                secondary: 'border-transparent bg-surface-container-high text-on-surface',
                outline: 'border-outline-variant text-on-surface',
                sale: 'border-transparent bg-error text-on-error',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
