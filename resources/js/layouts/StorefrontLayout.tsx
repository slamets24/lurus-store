import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import {
    Heart,
    Home,
    Search,
    ShoppingBag,
    Store,
    User,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { AuthProps, FlashProps, NavCategory, NavCollection, SocialLink } from '@/types';

interface StorefrontSharedProps {
    name: string;
    auth: AuthProps;
    cartCount: number;
    storeCategories: NavCategory[];
    storeCollections: NavCollection[];
    socialLinks: SocialLink[];
    whatsapp_number: string;
    flash: FlashProps;
}

interface StorefrontLayoutProps {
    children: React.ReactNode;
    announcementBar?: import('@/types').AnnouncementBar | null;
}

export default function StorefrontLayout({ children, announcementBar }: StorefrontLayoutProps) {
    const page = usePage();
    const {
        name,
        auth,
        cartCount,
        storeCategories,
        storeCollections,
        socialLinks,
        whatsapp_number,
        flash,
    } = page.props as unknown as StorefrontSharedProps;

    const currentPath = page.url.split('?')[0];

    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        document.title = `${name} | Modest Fashion`;
    }, [name]);

    useEffect(() => {
        if (flash.success) toast.success(String(flash.success));
        if (flash.error) toast.error(String(flash.error));
        if (flash.message) toast.message(String(flash.message));
    }, [flash]);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const whatsappUrl = whatsapp_number
        ? `https://wa.me/${String(whatsapp_number).replace(/\D/g, '')}`
        : null;

    const isActive = (paths: string[]) =>
        paths.some((path) =>
            path === '/' ? currentPath === '/' : currentPath === path || currentPath.startsWith(`${path}/`),
        );

    const accountHref = auth.user ? '/account' : '/login';
    const wishlistHref = auth.user ? '/wishlist' : '/login';

    const bottomNav: Array<{
        href: string;
        label: string;
        icon: typeof Home;
        match: string[];
        badge?: number;
    }> = [
        { href: '/', label: 'Home', icon: Home, match: ['/'] },
        {
            href: '/products',
            label: 'Shop',
            icon: Store,
            match: ['/products', '/categories', '/collections', '/search'],
        },
        { href: '/cart', label: 'Cart', icon: ShoppingBag, match: ['/cart'], badge: cartCount },
        { href: wishlistHref, label: 'Wishlist', icon: Heart, match: ['/wishlist'] },
        {
            href: accountHref,
            label: 'Account',
            icon: User,
            match: auth.user ? ['/account', '/orders'] : ['/login', '/register'],
        },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background text-on-surface">
            {announcementBar?.enabled && announcementBar.text && (
                <div className="bg-warm-brown py-2 text-center text-xs tracking-wide text-white md:text-sm">
                    {announcementBar.link ? (
                        <Link href={announcementBar.link} className="hover:underline">
                            {announcementBar.text}
                        </Link>
                    ) : (
                        announcementBar.text
                    )}
                </div>
            )}

            <header className="sticky top-0 z-40 border-b border-outline-variant bg-background/95 backdrop-blur-sm">
                <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-4 py-3 md:px-[var(--spacing-margin-desktop)] md:py-4">
                    <Link href="/" className="font-serif text-xl tracking-widest md:text-2xl">
                        {String(name)}
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        <Link href="/" className="text-xs tracking-[0.2em] hover:text-warm-brown">
                            HOME
                        </Link>
                        <Link href="/products" className="text-xs tracking-[0.2em] hover:text-warm-brown">
                            SHOP
                        </Link>
                        <div className="group relative">
                            <span className="cursor-pointer text-xs tracking-[0.2em] hover:text-warm-brown">
                                COLLECTION
                            </span>
                            <div className="invisible absolute left-0 top-full z-50 min-w-48 border border-outline-variant bg-background py-2 opacity-0 shadow-sm transition-all group-hover:visible group-hover:opacity-100">
                                {storeCollections.map((collection) => (
                                    <Link
                                        key={collection.slug}
                                        href={`/collections/${collection.slug}`}
                                        className="block px-4 py-2 text-sm hover:bg-surface-container hover:text-warm-brown"
                                    >
                                        {collection.name}
                                    </Link>
                                ))}
                                <Link
                                    href="/collections"
                                    className="block border-t border-outline-variant px-4 py-2 text-sm text-warm-brown"
                                >
                                    View All Collections
                                </Link>
                            </div>
                        </div>
                        <Link href="/contact" className="text-xs tracking-[0.2em] hover:text-warm-brown">
                            FIND US
                        </Link>
                        <Link
                            href="/collections/special-offers"
                            className="text-xs tracking-[0.2em] hover:text-warm-brown"
                        >
                            SPECIAL OFFERS
                        </Link>
                    </nav>

                    <div className="flex items-center gap-1 md:gap-2">
                        <button
                            type="button"
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-2 hover:text-warm-brown"
                            aria-label="Search"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                        <Link
                            href="/cart"
                            className="relative hidden p-2 hover:text-warm-brown md:inline-flex"
                            aria-label="Cart"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-warm-brown text-[10px] text-white">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </Link>
                        {auth.user ? (
                            <>
                                <Link
                                    href="/wishlist"
                                    className="hidden p-2 hover:text-warm-brown md:inline-flex"
                                    aria-label="Wishlist"
                                >
                                    <Heart className="h-5 w-5" />
                                </Link>
                                <Link
                                    href="/account"
                                    className="hidden p-2 hover:text-warm-brown md:inline-flex"
                                    aria-label="Account"
                                >
                                    <User className="h-5 w-5" />
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden p-2 hover:text-warm-brown md:inline-flex"
                                aria-label="Login"
                            >
                                <User className="h-5 w-5" />
                            </Link>
                        )}
                    </div>
                </div>

                {searchOpen && (
                    <div className="border-t border-outline-variant px-4 py-3 md:px-[var(--spacing-margin-desktop)]">
                        <form onSubmit={handleSearch} className="mx-auto flex max-w-xl gap-2">
                            <Input
                                type="search"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <Button type="submit" variant="accent" size="sm">
                                Search
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="md:hidden"
                                onClick={() => setSearchOpen(false)}
                                aria-label="Close search"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                )}
            </header>

            <main className="flex-1 pb-20 md:pb-0">{children}</main>

            <footer className="mb-16 border-t border-outline-variant bg-surface-container-low md:mb-0">
                <div className="mx-auto grid max-w-[var(--container-max)] gap-10 px-4 py-16 md:grid-cols-2 lg:grid-cols-4 md:px-[var(--spacing-margin-desktop)]">
                    <div>
                        <h3 className="mb-4 font-serif text-lg">Newsletter</h3>
                        <p className="mb-4 text-sm text-secondary">
                            Subscribe for modest fashion updates, new arrivals, and exclusive offers.
                        </p>
                        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <Input type="email" placeholder="Your email" className="bg-background" />
                            <Button type="submit" variant="accent" size="sm">
                                Join
                            </Button>
                        </form>
                    </div>
                    <div>
                        <h3 className="mb-4 font-serif text-lg">Shop</h3>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li><Link href="/products" className="hover:text-warm-brown">All Products</Link></li>
                            <li><Link href="/categories" className="hover:text-warm-brown">Categories</Link></li>
                            <li><Link href="/collections" className="hover:text-warm-brown">Collections</Link></li>
                            <li><Link href="/collections/new-collection" className="hover:text-warm-brown">New Arrivals</Link></li>
                        </ul>
                        {storeCategories.length > 0 && (
                            <ul className="mt-4 space-y-2 text-sm text-secondary md:hidden">
                                {storeCategories.map((c) => (
                                    <li key={c.slug}>
                                        <Link href={`/categories/${c.slug}`} className="hover:text-warm-brown">
                                            {c.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <h3 className="mb-4 font-serif text-lg">Help</h3>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li><Link href="/faq" className="hover:text-warm-brown">FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-warm-brown">Contact Us</Link></li>
                            <li><Link href="/about" className="hover:text-warm-brown">About</Link></li>
                            <li><Link href="/account" className="hover:text-warm-brown">My Account</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 font-serif text-lg">Follow Us</h3>
                        <ul className="space-y-2 text-sm">
                            {socialLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-secondary hover:text-warm-brown"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-outline-variant py-6 text-center text-xs text-secondary">
                    &copy; {new Date().getFullYear()} {String(name)}. All rights reserved.
                </div>
            </footer>

            <nav
                className="fixed inset-x-0 bottom-0 z-50 border-t border-outline-variant bg-background/95 backdrop-blur-sm md:hidden"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                aria-label="Mobile navigation"
            >
                <ul className="grid grid-cols-5">
                    {bottomNav.map(({ href, label, icon: Icon, match, badge }) => {
                        const active = isActive(match);

                        return (
                            <li key={label}>
                                <Link
                                    href={href}
                                    className={cn(
                                        'relative flex flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] tracking-wide transition-colors',
                                        active ? 'text-warm-brown' : 'text-secondary',
                                    )}
                                >
                                    <span className="relative">
                                        <Icon
                                            className={cn('h-5 w-5', active && label === 'Wishlist' && 'fill-warm-brown')}
                                            strokeWidth={active ? 2.25 : 1.75}
                                        />
                                        {typeof badge === 'number' && badge > 0 && (
                                            <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-warm-brown px-0.5 text-[9px] text-white">
                                                {badge > 9 ? '9+' : badge}
                                            </span>
                                        )}
                                    </span>
                                    <span className={cn(active && 'font-medium')}>{label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {whatsappUrl && (
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-20 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 md:bottom-6 md:right-6 md:h-14 md:w-14"
                    aria-label="Chat on WhatsApp"
                >
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current md:h-7 md:w-7" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </a>
            )}
        </div>
    );
}
