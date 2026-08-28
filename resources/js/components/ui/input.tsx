import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const isPassword = type === 'password';

        if (isPassword) {
            return (
                <div className="relative w-full">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className={cn(
                            'flex h-10 w-full rounded-sm border border-outline-variant bg-surface-container-lowest px-3 py-2 pr-10 text-sm text-on-surface placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-brown disabled:cursor-not-allowed disabled:opacity-50',
                            className,
                        )}
                        ref={ref}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={props.disabled}
                        className="absolute right-0 top-0 flex h-full items-center justify-center px-3 text-secondary transition-colors hover:text-on-surface focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                    </button>
                </div>
            );
        }

        return (
            <input
                type={type}
                className={cn(
                    'flex h-10 w-full rounded-sm border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-brown disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Input.displayName = 'Input';

