import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import '../css/app.css';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        const page = pages[`./pages/${name}.tsx`] as { default: React.ComponentType };
        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <>
                <App {...props} />
                <Toaster position="top-center" richColors />
            </>,
        );
    },
    progress: {
        color: '#8b7355',
    },
});

declare module '@inertiajs/react' {
    interface PageProps {
        name: string;
        auth: import('@/types').AuthProps;
        cartCount: number;
        cartPreview?: import('@/types').CartPreview;
        wishlistMap: Record<number, number>;
        storeCategories: import('@/types').NavCategory[];
        storeCollections: import('@/types').NavCollection[];
        socialLinks: import('@/types').SocialLink[];
        whatsapp_number: string;
        promoPopup: import('@/types').PromoPopup | null;
        commerce: import('@/types').CommerceProps;
        midtrans: import('@/types').MidtransProps | null;
        flash: import('@/types').FlashProps;
        [key: string]: unknown;
    }
}
