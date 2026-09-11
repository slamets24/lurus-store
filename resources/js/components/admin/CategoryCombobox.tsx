import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminCategory } from '@/types/admin';

interface CategoryComboboxProps {
    categories: AdminCategory[];
    categoryId?: string | number | null;
    categoryName?: string;
    onChange: (categoryId: string | number, categoryName: string) => void;
    placeholder?: string;
    className?: string;
    error?: string;
}

export function CategoryCombobox({
    categories,
    categoryId,
    categoryName = '',
    onChange,
    placeholder = 'Pilih atau ketik kategori...',
    className,
    error,
}: CategoryComboboxProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [query, setQuery] = React.useState(categoryName);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setQuery(categoryName);
    }, [categoryName]);

    // Filter categories based on query
    const filteredCategories = React.useMemo(() => {
        if (!query) return categories;
        const q = query.toLowerCase().trim();
        return categories.filter((c) => c.name.toLowerCase().includes(q));
    }, [categories, query]);

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (cat: AdminCategory) => {
        setQuery(cat.name);
        onChange(cat.id, cat.name);
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setIsOpen(true);

        // Check if val matches an existing category
        const matched = categories.find((c) => c.name.toLowerCase() === val.trim().toLowerCase());
        if (matched) {
            onChange(matched.id, matched.name);
        } else {
            onChange('', val);
        }
    };

    return (
        <div ref={containerRef} className={cn('relative w-full', className)}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className={cn(
                        'flex h-11 w-full rounded-md border border-[#e5e1dc] bg-[#faf8f5] px-3.5 pr-10 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:bg-white focus:outline-none focus:ring-1 focus:ring-warm-brown transition-colors',
                        error && 'border-red-400 bg-red-50/20',
                    )}
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="absolute right-0 top-0 flex h-full items-center px-3 text-stone-400 hover:text-stone-700 transition"
                    aria-label="Toggle dropdown kategori"
                >
                    <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
                </button>
            </div>

            {/* Dropdown suggestions */}
            {isOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#e5e1dc] bg-white py-1 shadow-lg">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((cat) => {
                            const isSelected = String(cat.id) === String(categoryId) || cat.name.toLowerCase() === query.trim().toLowerCase();
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleSelect(cat)}
                                    className={cn(
                                        'flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm text-stone-700 hover:bg-[#f5f3ef] transition cursor-pointer',
                                        isSelected && 'bg-[#f0ece5] font-medium text-stone-900',
                                    )}
                                >
                                    <span>{cat.name}</span>
                                    {isSelected && <Check className="h-4 w-4 text-warm-brown" />}
                                </button>
                            );
                        })
                    ) : (
                        <div className="px-3.5 py-2.5 text-xs text-stone-500">
                            {query ? (
                                <span>
                                    Kategori baru akan dibuat: <strong className="text-stone-800">&ldquo;{query}&rdquo;</strong>
                                </span>
                            ) : (
                                <span>Tidak ada kategori tersedia</span>
                            )}
                        </div>
                    )}
                </div>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
