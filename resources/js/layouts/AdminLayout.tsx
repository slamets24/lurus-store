import { Link, router, usePage } from '@inertiajs/react';
import {
    ArchiveRestore,
    FolderTree,
    Home,
    LayoutDashboard,
    LayoutGrid,
    LogOut,
    Menu,
    Package,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Tag,
    Truck,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { cn } from '@/lib/utils';
import type { AuthProps } from '@/types';

interface NavItem {
    name: string;
    href: string;
    icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Homepage', href: '/admin/homepage', icon: Home },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Promos', href: '/admin/promos', icon: Tag },
    { name: 'Collections', href: '/admin/collections', icon: LayoutGrid },
    { name: 'Orders', href: '/admin/orders', icon: Truck },
    { name: 'Carts', href: '/admin/carts', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
];

interface AdminLayoutProps {
    title?: string;
    children: ReactNode;
}

export default function AdminLayout({ title, children }: AdminLayoutProps) {
    const page = usePage<{ auth: AuthProps; name: string }>();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    useFlashToast();

    const auth = page.props.auth;
    const storeName = page.props.name ?? 'Lurus Store';
    const isSuperAdmin = auth?.isSuperAdmin ?? false;
    const userName = auth?.user?.name ?? 'Admin';

    const navigation = useMemo(
        () =>
            isSuperAdmin
                ? [...NAV_ITEMS, { name: 'Restore', href: '/admin/restore', icon: ArchiveRestore }]
                : NAV_ITEMS,
        [isSuperAdmin],
    );

    const currentPath = page.url.split('?')[0].replace(/\/$/, '') || '/';

    const isActiveNav = (href: string) =>
        currentPath === href || (href !== '/admin' && currentPath.startsWith(`${href}/`));

    const breadcrumbs = useMemo(() => {
        const segments = page.url.split('?')[0].split('/').filter(Boolean);
        const crumbs: Array<{ name: string; href?: string }> = [{ name: 'Admin', href: '/admin' }];
        let current = '/admin';

        for (const segment of segments) {
            if (segment === 'admin') {
                continue;
            }

            current += `/${segment}`;
            crumbs.push({
                name: segment.charAt(0).toUpperCase() + segment.slice(1),
                href: current,
            });
        }

        return crumbs;
    }, [page.url]);

    useEffect(() => {
        setSidebarOpen(false);
    }, [page.url]);

    useEffect(() => {
        document.title = title ? `${title} | Admin` : `Admin | ${storeName}`;
    }, [title, storeName]);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {sidebarOpen ? (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            ) : null}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-y-auto bg-primary transition-transform duration-300 ease-out lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                )}
            >
                <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
                    <Link href="/admin" className="font-serif text-lg tracking-[0.2em] text-on-primary">
                        {storeName}
                    </Link>
                    <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Admin</span>
                </div>

                <nav className="mt-4 flex-1 space-y-1 px-3 pb-6">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActiveNav(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors',
                                    active
                                        ? 'bg-warm-brown text-white'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white',
                                )}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-white/10 p-4">
                    <p className="truncate text-sm font-medium text-white">{userName}</p>
                    <p className="truncate text-xs text-white/50">{auth?.user?.email}</p>
                    <div className="mt-3 flex gap-2">
                        <Link
                            href="/"
                            className="flex-1 rounded-sm border border-white/20 px-3 py-1.5 text-center text-xs text-white/80 hover:bg-white/10"
                        >
                            Store
                        </Link>
                        <button
                            type="button"
                            onClick={() => router.post('/logout')}
                            className="inline-flex items-center gap-1 rounded-sm border border-white/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Out
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-outline-variant/20 bg-surface-container-lowest/95 px-4 backdrop-blur md:px-6">
                    <button
                        type="button"
                        className="rounded-sm p-2 text-on-surface-variant hover:bg-surface-container lg:hidden"
                        onClick={() => setSidebarOpen((open) => !open)}
                    >
                        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>

                    <nav className="hidden min-w-0 flex-1 items-center gap-1 text-sm text-on-surface-variant md:flex">
                        {breadcrumbs.map((crumb, index) => (
                            <span key={crumb.href ?? crumb.name} className="flex items-center gap-1">
                                {index > 0 ? <span className="text-outline-variant">/</span> : null}
                                {crumb.href && index < breadcrumbs.length - 1 ? (
                                    <Link href={crumb.href} className="hover:text-warm-brown">
                                        {crumb.name}
                                    </Link>
                                ) : (
                                    <span className="truncate text-on-surface">{crumb.name}</span>
                                )}
                            </span>
                        ))}
                    </nav>

                    <Link
                        href="/admin/products/create"
                        className="hidden items-center gap-2 rounded-sm bg-warm-brown px-3 py-2 text-xs font-semibold tracking-wider text-white uppercase hover:bg-warm-brown/90 sm:inline-flex"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        New Product
                    </Link>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
