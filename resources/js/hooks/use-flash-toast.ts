import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashProps } from '@/types';

export function useFlashToast(): void {
    const { flash } = usePage<{ flash: FlashProps }>().props;
    const lastMessage = useRef<string | null>(null);

    useEffect(() => {
        const message =
            (flash?.success as string | undefined) ??
            (flash?.message as string | undefined) ??
            (flash?.error as string | undefined);

        if (!message || message === lastMessage.current) {
            return;
        }

        lastMessage.current = message;

        if (flash?.error) {
            toast.error(message);
        } else {
            toast.success(message);
        }
    }, [flash]);
}
