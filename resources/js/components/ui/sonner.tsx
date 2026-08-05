import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
    return (
        <Sonner
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: 'group toast group-[.toaster]:bg-surface-container-lowest group-[.toaster]:text-on-surface group-[.toaster]:border-outline-variant group-[.toaster]:shadow-lg',
                    description: 'group-[.toast]:text-secondary',
                    actionButton: 'group-[.toast]:bg-warm-brown group-[.toast]:text-white',
                    cancelButton: 'group-[.toast]:bg-surface-container',
                },
            }}
            {...props}
        />
    );
}
