import { Plus, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { ProductComponentInput, ProductOfferInput, ProductVariant } from '@/types/admin';

interface VariantCombinationTableProps {
    components: ProductComponentInput[];
    offers: ProductOfferInput[];
    variants: ProductVariant[];
    colorHexes?: Record<string, string>;
    fallbackPrice: number;
    onChange: (next: {
        components: ProductComponentInput[];
        offers: ProductOfferInput[];
        variants: ProductVariant[];
        color_hexes: Record<string, string>;
        price: number;
    }) => void;
    error?: string;
}

const fieldClass = 'h-10 w-full rounded-md border border-[#e5e1dc] bg-[#faf8f5] px-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:bg-white focus:outline-none focus:ring-1 focus:ring-warm-brown';

function unique(values: Array<string | null | undefined>): string[] {
    return [...new Set(values.map((value) => value?.trim() ?? '').filter(Boolean))];
}

function offersFor(
    components: ProductComponentInput[],
    variants: ProductVariant[],
    previous: ProductOfferInput[],
    fallbackPrice: number,
): ProductOfferInput[] {
    return components.map((component) => {
        const prices = variants
            .filter((variant) => variant.component_key === component.key)
            .map((variant) => Number(variant.price) || 0)
            .filter((price) => price > 0);
        const existing = previous.find((offer) => offer.component_keys.length === 1 && offer.component_keys[0] === component.key);

        return {
            id: existing?.id,
            name: component.name.trim() || 'Tipe',
            price: prices.length > 0 ? Math.min(...prices) : (existing?.price ?? fallbackPrice),
            component_keys: [component.key],
        };
    });
}

export function VariantCombinationTable({
    components,
    offers,
    variants,
    colorHexes = {},
    fallbackPrice,
    onChange,
    error,
}: VariantCombinationTableProps) {
    const [extraColors, setExtraColors] = useState<string[]>([]);
    const [extraSizes, setExtraSizes] = useState<string[]>([]);
    const [colorDraft, setColorDraft] = useState('');
    const [sizeDraft, setSizeDraft] = useState('');
    const [typeDraft, setTypeDraft] = useState('');
    const [numberDrafts, setNumberDrafts] = useState<Record<string, string>>({});

    const colors = unique([...variants.map((variant) => variant.color), ...extraColors]);
    const sizes = unique([...variants.map((variant) => variant.size), ...extraSizes]);
    const catalogPrice = (() => {
        const prices = offers.map((offer) => Number(offer.price) || 0).filter((price) => price > 0);
        return prices.length > 0 ? Math.min(...prices) : fallbackPrice;
    })();

    const commit = (
        nextComponents: ProductComponentInput[],
        nextVariants: ProductVariant[],
        nextHexes: Record<string, string>,
        nextExtraColors: string[] = extraColors,
        nextExtraSizes: string[] = extraSizes,
    ) => {
        const named = nextComponents.filter((component) => component.name.trim() !== '');
        const grid = named.length === 0
            ? nextVariants
            : colors.length === 0 && nextExtraColors.length === 0
                ? nextVariants
                : expand(named, unique([...nextVariants.map((variant) => variant.color), ...nextExtraColors]), unique([...nextVariants.map((variant) => variant.size), ...nextExtraSizes]), nextVariants, offers, fallbackPrice);

        const nextOffers = named.length > 0 ? offersFor(named, grid, offers, fallbackPrice) : [];
        const prices = nextOffers.map((offer) => Number(offer.price) || 0).filter((price) => price > 0);

        onChange({
            components: nextComponents,
            offers: nextOffers,
            variants: grid,
            color_hexes: nextHexes,
            price: prices.length > 0 ? Math.min(...prices) : fallbackPrice,
        });
        setExtraColors(nextExtraColors.filter((color) => !grid.some((variant) => variant.color === color)));
        setExtraSizes(nextExtraSizes.filter((size) => !grid.some((variant) => variant.size === size)));
    };

    const addColor = () => {
        const name = colorDraft.trim();
        if (!name || colors.includes(name)) {
            return;
        }
        setColorDraft('');
        const nextColors = [...extraColors, name];
        if (components.every((component) => component.name.trim() === '')) {
            setExtraColors(nextColors);
            return;
        }
        commit(components, variants, colorHexes, nextColors, extraSizes);
    };

    const addSize = () => {
        const name = sizeDraft.trim();
        if (!name || sizes.includes(name)) {
            return;
        }
        setSizeDraft('');
        const nextSizes = [...extraSizes, name];
        if (components.every((component) => component.name.trim() === '')) {
            setExtraSizes(nextSizes);
            return;
        }
        commit(components, variants, colorHexes, extraColors, nextSizes);
    };

    const addType = () => {
        const name = typeDraft.trim();
        if (!name || components.some((component) => component.name.trim().toLowerCase() === name.toLowerCase())) {
            return;
        }
        setTypeDraft('');
        commit(
            [...components, { key: `new-${Date.now()}`, name }],
            variants,
            colorHexes,
        );
    };

    const renameColor = (from: string, to: string) => {
        const name = to.trim();
        if (!name || (name !== from && colors.includes(name))) {
            return;
        }
        const hexes = { ...colorHexes };
        if (hexes[from]) {
            hexes[name] = hexes[from];
            delete hexes[from];
        }
        commit(
            components,
            variants.map((variant) => (variant.color === from ? { ...variant, color: name } : variant)),
            hexes,
            extraColors.map((color) => (color === from ? name : color)),
            extraSizes,
        );
    };

    const removeColor = (color: string) => {
        const hexes = { ...colorHexes };
        delete hexes[color];
        commit(
            components,
            variants.filter((variant) => variant.color !== color),
            hexes,
            extraColors.filter((item) => item !== color),
            extraSizes,
        );
    };

    const renameSize = (from: string, to: string) => {
        const name = to.trim();
        if (!name || (name !== from && sizes.includes(name))) {
            return;
        }
        commit(
            components,
            variants.map((variant) => (variant.size === from ? { ...variant, size: name } : variant)),
            colorHexes,
            extraColors,
            extraSizes.map((size) => (size === from ? name : size)),
        );
    };

    const removeSize = (size: string) => {
        commit(
            components,
            variants.filter((variant) => variant.size !== size),
            colorHexes,
            extraColors,
            extraSizes.filter((item) => item !== size),
        );
    };

    const renameType = (key: string, name: string) => {
        commit(
            components.map((component) => (component.key === key ? { ...component, name } : component)),
            variants,
            colorHexes,
        );
    };

    const removeType = (key: string) => {
        const nextComponents = components.filter((component) => component.key !== key);
        if (nextComponents.length === 0) {
            const plain = new Map<string, ProductVariant>();
            variants
                .filter((variant) => variant.component_key !== key)
                .forEach((variant) => {
                    const id = `${variant.color}|${variant.size}`;
                    const current = plain.get(id);
                    if (!current || variant.stock > current.stock) {
                        plain.set(id, { color: variant.color, size: variant.size, stock: variant.stock });
                    }
                });
            onChange({
                components: [],
                offers: [],
                variants: [...plain.values()],
                color_hexes: colorHexes,
                price: fallbackPrice,
            });
            return;
        }

        commit(
            nextComponents,
            variants.filter((variant) => variant.component_key !== key),
            colorHexes,
        );
    };

    const updateCell = (color: string, size: string, key: string, patch: Partial<ProductVariant>) => {
        const grid = expand(components, colors, sizes, variants, offers, fallbackPrice).map((variant) => (
            variant.color === color && variant.size === size && variant.component_key === key
                ? { ...variant, ...patch }
                : variant
        ));
        const nextOffers = offersFor(components, grid, offers, fallbackPrice);
        const prices = nextOffers.map((offer) => Number(offer.price) || 0).filter((price) => price > 0);
        onChange({
            components,
            offers: nextOffers,
            variants: grid,
            color_hexes: colorHexes,
            price: prices.length > 0 ? Math.min(...prices) : fallbackPrice,
        });
    };

    const namedComponents = components.filter((component) => component.name.trim() !== '');
    const rows = namedComponents.length > 0 && colors.length > 0 && sizes.length > 0
        ? expand(namedComponents, colors, sizes, variants, offers, fallbackPrice)
        : [];
    const missing = [
        colors.length === 0 ? 'warna' : '',
        sizes.length === 0 ? 'ukuran' : '',
        namedComponents.length === 0 ? 'tipe' : '',
    ].filter(Boolean);
    const missingLabel = missing.length === 2
        ? `${missing[0]} dan ${missing[1]}`
        : missing.length > 2
            ? `${missing.slice(0, -1).join(', ')}, dan ${missing[missing.length - 1]}`
            : missing[0];

    return (
        <div className="rounded-2xl border border-[#e5e1dc] bg-white p-6 shadow-sm sm:p-8 space-y-6">
            <div>
                <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                    Varian
                </h2>
                <p className="mt-1 font-sans text-xs text-stone-500">
                    Tambah warna, ukuran, dan tipe. Contoh: Dark Denim, S/M, Tunik dan Rok. Setiap tipe punya stok dan harga sendiri.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <OptionAxis
                    label="Warna"
                    hint="Contoh: Dark Denim"
                    draft={colorDraft}
                    placeholder="Dark Denim"
                    values={colors}
                    onDraft={setColorDraft}
                    onAdd={addColor}
                    onRename={renameColor}
                    onRemove={removeColor}
                    renderExtra={(color) => (
                        <input
                            type="color"
                            aria-label={`Warna ${color}`}
                            value={colorHexes[color] || '#d6d3d1'}
                            onChange={(event) => onChange({
                                components,
                                offers,
                                variants,
                                color_hexes: { ...colorHexes, [color]: event.target.value },
                                price: catalogPrice,
                            })}
                            className="h-10 w-10 shrink-0 cursor-pointer rounded-md border border-[#e5e1dc] bg-white p-1"
                        />
                    )}
                />
                <OptionAxis
                    label="Ukuran"
                    hint="Contoh: S/M"
                    draft={sizeDraft}
                    placeholder="S/M"
                    values={sizes}
                    onDraft={setSizeDraft}
                    onAdd={addSize}
                    onRename={renameSize}
                    onRemove={removeSize}
                />
                <OptionAxis
                    label="Tipe"
                    hint="Contoh: Tunik atau Rok"
                    draft={typeDraft}
                    placeholder="Tunik"
                    values={components.map((component) => component.name)}
                    keys={components.map((component) => component.key)}
                    onDraft={setTypeDraft}
                    onAdd={addType}
                    onRename={(key, name) => renameType(key, name)}
                    onRemove={(key) => removeType(key)}
                />
            </div>

            {rows.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-[#e5e1dc] text-left font-sans text-[11px] font-bold uppercase tracking-wide text-stone-500">
                                <th className="px-3 py-2 font-bold">Warna</th>
                                <th className="px-3 py-2 font-bold">Ukuran</th>
                                <th className="px-3 py-2 font-bold">Tipe</th>
                                <th className="px-3 py-2 font-bold">Stok</th>
                                <th className="px-3 py-2 font-bold">Harga</th>
                            </tr>
                        </thead>
                        <tbody>
                            {colors.map((color) => sizes.map((size, sizeIndex) => namedComponents.map((component, typeIndex) => {
                                const row = rows.find((variant) => variant.color === color && variant.size === size && variant.component_key === component.key);
                                const showColor = sizeIndex === 0 && typeIndex === 0;
                                const showSize = typeIndex === 0;

                                return (
                                    <tr key={`${color}-${size}-${component.key}`} className="border-b border-[#f0ece8]">
                                        {showColor && (
                                            <td rowSpan={sizes.length * namedComponents.length} className="align-top px-3 py-3 font-medium text-stone-800">
                                                {color}
                                            </td>
                                        )}
                                        {showSize && (
                                            <td rowSpan={namedComponents.length} className="align-top px-3 py-3 text-stone-700">
                                                {size}
                                            </td>
                                        )}
                                        <td className="px-3 py-2 text-stone-700">{component.name || 'Tipe'}</td>
                                        <td className="px-3 py-2">
                                            <NumberCell
                                                value={row?.stock}
                                                draft={numberDrafts[`stock|${color}|${size}|${component.key}`]}
                                                className="w-24"
                                                onDraft={(value) => {
                                                    const id = `stock|${color}|${size}|${component.key}`;
                                                    setNumberDrafts((current) => ({ ...current, [id]: value }));
                                                    if (value !== '') {
                                                        updateCell(color, size, component.key, { stock: Number(value) });
                                                    }
                                                }}
                                                onCommit={(value) => {
                                                    const id = `stock|${color}|${size}|${component.key}`;
                                                    setNumberDrafts((current) => {
                                                        const next = { ...current };
                                                        delete next[id];
                                                        return next;
                                                    });
                                                    updateCell(color, size, component.key, { stock: value });
                                                }}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <NumberCell
                                                value={row?.price}
                                                draft={numberDrafts[`price|${color}|${size}|${component.key}`]}
                                                prefix="Rp"
                                                className="w-36"
                                                onDraft={(value) => {
                                                    const id = `price|${color}|${size}|${component.key}`;
                                                    setNumberDrafts((current) => ({ ...current, [id]: value }));
                                                    if (value !== '') {
                                                        updateCell(color, size, component.key, { price: Number(value) });
                                                    }
                                                }}
                                                onCommit={(value) => {
                                                    const id = `price|${color}|${size}|${component.key}`;
                                                    setNumberDrafts((current) => {
                                                        const next = { ...current };
                                                        delete next[id];
                                                        return next;
                                                    });
                                                    updateCell(color, size, component.key, { price: value });
                                                }}
                                            />
                                        </td>
                                    </tr>
                                );
                            })))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="rounded-xl border border-dashed border-[#e5e1dc] bg-[#faf8f5] px-4 py-3 font-sans text-xs text-stone-500">
                    Tambah {missingLabel || 'warna, ukuran, dan tipe'} untuk mengisi stok dan harga.
                </p>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

function expand(
    components: ProductComponentInput[],
    colors: string[],
    sizes: string[],
    variants: ProductVariant[],
    offers: ProductOfferInput[],
    fallbackPrice: number,
): ProductVariant[] {
    if (colors.length === 0 || sizes.length === 0) {
        return variants;
    }

    return colors.flatMap((color) => sizes.flatMap((size) => components.map((component) => {
        const existing = variants.find((variant) => variant.color === color && variant.size === size && variant.component_key === component.key);
        const sibling = variants.find((variant) => variant.component_key === component.key && variant.price != null);
        const offer = offers.find((item) => item.component_keys.length === 1 && item.component_keys[0] === component.key);

        const plain = variants.find((variant) => !variant.component_key && variant.color === color && variant.size === size);

        return {
            color,
            size,
            component_key: component.key,
            stock: existing?.stock ?? plain?.stock ?? 0,
            price: existing?.price ?? plain?.price ?? sibling?.price ?? offer?.price ?? fallbackPrice,
        };
    })));
}

function NumberCell({
    value,
    draft,
    prefix,
    className,
    onDraft,
    onCommit,
}: {
    value?: number | null;
    draft?: string;
    prefix?: string;
    className: string;
    onDraft: (value: string) => void;
    onCommit: (value: number) => void;
}) {
    const shown = draft !== undefined ? draft : (value == null || Number.isNaN(Number(value)) ? '' : String(value));

    return (
        <div className="flex items-center gap-2">
            {prefix && <span className="text-xs text-stone-400">{prefix}</span>}
            <input
                type="text"
                inputMode="numeric"
                value={shown}
                onChange={(event) => onDraft(event.target.value.replace(/\D/g, ''))}
                onBlur={(event) => onCommit(event.target.value === '' ? 0 : Number(event.target.value))}
                className={`${fieldClass} ${className}`}
            />
        </div>
    );
}

function OptionAxis({
    label,
    hint,
    values,
    keys,
    draft = '',
    placeholder,
    onDraft,
    onAdd,
    onRename,
    onRemove,
    renderExtra,
}: {
    label: string;
    hint: string;
    values: string[];
    keys?: string[];
    draft?: string;
    placeholder: string;
    onDraft: (value: string) => void;
    onAdd: () => void;
    onRename: (key: string, value: string) => void;
    onRemove: (key: string) => void;
    renderExtra?: (value: string) => ReactNode;
}) {
    return (
        <div className="rounded-xl border border-[#e5e1dc] bg-[#faf8f5] p-4">
            <p className="font-sans text-xs font-bold uppercase tracking-wide text-stone-700">{label}</p>
            <p className="mt-1 font-sans text-xs text-stone-500">{hint}</p>
            <div className="mt-3 space-y-2">
                {values.map((value, index) => {
                    const key = keys?.[index] ?? value;
                    return (
                        <div key={`${label}-${index}`} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={value}
                                placeholder={placeholder}
                                onChange={(event) => onRename(key, event.target.value)}
                                className={fieldClass}
                            />
                            {renderExtra?.(value)}
                            <button
                                type="button"
                                onClick={() => onRemove(key)}
                                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#e5e1dc] bg-white text-stone-400 hover:text-red-500"
                                aria-label={`Hapus ${label} ${value || index + 1}`}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    );
                })}
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={draft}
                        placeholder={placeholder}
                        onChange={(event) => onDraft(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                onAdd();
                            }
                        }}
                        className={fieldClass}
                    />
                    <button
                        type="button"
                        onClick={onAdd}
                        className="inline-flex h-10 shrink-0 items-center gap-1 rounded-md border border-[#e5e1dc] bg-white px-3 text-xs font-semibold text-stone-700 hover:border-warm-brown hover:text-warm-brown"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Tambah opsi
                    </button>
                </div>
            </div>
        </div>
    );
}
