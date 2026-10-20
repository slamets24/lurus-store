import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductVariant } from '@/types/admin';

interface VariantStockMatrixProps {
    variants: ProductVariant[];
    colorHexes?: Record<string, string>;
    availableColors?: string[];
    availableSizes?: string[];
    onChangeVariants: (variants: ProductVariant[]) => void;
    onChangeColorHexes: (colorHexes: Record<string, string>) => void;
    title?: string;
    error?: string;
}

const DEFAULT_HEX_MAP: Record<string, string> = {
    black: '#2D2D2D',
    hitam: '#2D2D2D',
    white: '#FFFFFF',
    putih: '#FFFFFF',
    navy: '#1E293B',
    abu: '#64748B',
    grey: '#64748B',
    gray: '#64748B',
    cream: '#F5F5DC',
    beige: '#E8DCC4',
    sage: '#84A98C',
    brown: '#8B5A2B',
    coklat: '#8B5A2B',
    maroon: '#800000',
    red: '#DC2626',
    merah: '#DC2626',
    blue: '#2563EB',
    biru: '#2563EB',
    green: '#16A34A',
    hijau: '#16A34A',
};

const COMMON_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', 'All Size'];

export function VariantStockMatrix({
    variants,
    colorHexes = {},
    availableColors = [],
    availableSizes = [],
    onChangeVariants,
    onChangeColorHexes,
    title = 'STOK VARIAN',
    error,
}: VariantStockMatrixProps) {
    // Extract unique colors from existing variants (empty array if no colors yet)
    const initialColors = React.useMemo(() => {
        const set = new Set<string>();
        variants.forEach((v) => {
            if (v.color?.trim()) set.add(v.color.trim());
        });
        return Array.from(set);
    }, []);

    // Extract unique sizes from existing variants (default to common sizes if none)
    const initialSizes = React.useMemo(() => {
        const set = new Set<string>();
        variants.forEach((v) => {
            if (v.size?.trim()) set.add(v.size.trim());
        });
        return set.size > 0 ? Array.from(set) : ['S', 'M', 'L', 'XL', 'XXL'];
    }, []);

    const [colors, setColors] = React.useState<string[]>(initialColors);
    const [sizes, setSizes] = React.useState<string[]>(initialSizes);
    const [activeEditColor, setActiveEditColor] = React.useState<string>(initialColors[0] || '');

    const [newColorInput, setNewColorInput] = React.useState('');
    const [newSizeInput, setNewSizeInput] = React.useState('');
    const [bulkStockInput, setBulkStockInput] = React.useState('0');

    // Local hex state map
    const [localHexes, setLocalHexes] = React.useState<Record<string, string>>(() => {
        const merged: Record<string, string> = { ...colorHexes };
        initialColors.forEach((c) => {
            if (!merged[c]) {
                const lower = c.toLowerCase();
                merged[c] = DEFAULT_HEX_MAP[lower] || '#2D2D2D';
            }
        });
        return merged;
    });

    // Keep stock map: key = `${color}___${size}` => stock number
    const stockMap = React.useMemo(() => {
        const map = new Map<string, number>();
        variants.forEach((v) => {
            if (v.color && v.size) {
                map.set(`${v.color}___${v.size}`, Number(v.stock) || 0);
            }
        });
        return map;
    }, [variants]);

    // Synchronize variants array whenever colors, sizes, or stocks change
    const emitVariants = (
        newColors: string[],
        newSizes: string[],
        currentStockMap: Map<string, number>,
    ) => {
        const newVariants: ProductVariant[] = [];
        newColors.forEach((c) => {
            newSizes.forEach((s) => {
                const stock = currentStockMap.get(`${c}___${s}`) ?? 0;
                newVariants.push({
                    color: c,
                    size: s,
                    stock,
                });
            });
        });
        onChangeVariants(newVariants);
    };

    // Add Color
    const addColor = (rawColor: string) => {
        const trimmed = rawColor.trim();
        if (!trimmed) return;
        // Avoid duplicate case-insensitive
        if (colors.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
            setNewColorInput('');
            return;
        }

        const updated = [...colors, trimmed];
        setColors(updated);
        setActiveEditColor(trimmed);

        // Assign default hex if not set
        const lower = trimmed.toLowerCase();
        const hex = localHexes[trimmed] || DEFAULT_HEX_MAP[lower] || '#2D2D2D';
        const updatedHexes = { ...localHexes, [trimmed]: hex };
        setLocalHexes(updatedHexes);
        onChangeColorHexes(updatedHexes);

        emitVariants(updated, sizes, stockMap);
        setNewColorInput('');
    };

    // Remove Color (Any color can be deleted, including the last one)
    const removeColor = (colorToRemove: string) => {
        const updated = colors.filter((c) => c !== colorToRemove);
        setColors(updated);
        if (activeEditColor === colorToRemove) {
            setActiveEditColor(updated[0] || '');
        }

        const updatedHexes = { ...localHexes };
        delete updatedHexes[colorToRemove];
        setLocalHexes(updatedHexes);
        onChangeColorHexes(updatedHexes);

        emitVariants(updated, sizes, stockMap);
    };

    // Update Hex code for a color
    const handleHexChange = (color: string, hexValue: string) => {
        if (!color) return;
        let formatted = hexValue;
        if (!formatted.startsWith('#')) {
            formatted = '#' + formatted;
        }
        const updated = { ...localHexes, [color]: formatted };
        setLocalHexes(updated);
        onChangeColorHexes(updated);
    };

    // Add Size
    const addSize = (rawSize: string) => {
        const trimmed = rawSize.trim().toUpperCase();
        if (!trimmed) return;
        if (sizes.some((s) => s.toUpperCase() === trimmed)) {
            setNewSizeInput('');
            return;
        }

        const updated = [...sizes, trimmed];
        setSizes(updated);
        emitVariants(colors, updated, stockMap);
        setNewSizeInput('');
    };

    // Remove Size (Any size can be deleted)
    const removeSize = (sizeToRemove: string) => {
        const updated = sizes.filter((s) => s !== sizeToRemove);
        setSizes(updated);
        emitVariants(colors, updated, stockMap);
    };

    // Update stock for single cell
    const handleCellStockChange = (color: string, size: string, val: string) => {
        const qty = val === '' ? 0 : Math.max(0, parseInt(val, 10) || 0);
        const newMap = new Map(stockMap);
        newMap.set(`${color}___${size}`, qty);
        emitVariants(colors, sizes, newMap);
    };

    // Apply Bulk Stock to All Cells
    const handleApplyBulkStock = () => {
        const qty = Math.max(0, parseInt(bulkStockInput, 10) || 0);
        const newMap = new Map<string, number>();
        colors.forEach((c) => {
            sizes.forEach((s) => {
                newMap.set(`${c}___${s}`, qty);
            });
        });
        emitVariants(colors, sizes, newMap);
    };

    const totalStock = React.useMemo(() => {
        let sum = 0;
        colors.forEach((c) => {
            sizes.forEach((s) => {
                sum += stockMap.get(`${c}___${s}`) ?? 0;
            });
        });
        return sum;
    }, [colors, sizes, stockMap]);

    const activeHex = activeEditColor
        ? localHexes[activeEditColor] || '#2D2D2D'
        : '';

    return (
        <div className="rounded-2xl border border-[#e5e1dc] bg-white p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header */}
            <div>
                <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                    {title}
                </h2>
                <p className="mt-1 font-sans text-xs text-stone-500">
                    Pilih warna dan ukuran, lalu isi stok pada tabel.
                </p>
            </div>

            {/* TOP ROW: WARNA & UKURAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Column 1: WARNA * */}
                <div className="space-y-2">
                    <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700">
                        WARNA <span className="text-red-500">*</span>
                    </label>

                    <div className="flex items-center gap-2">
                        {/* Tag Input for Colors */}
                        <div className="flex flex-1 flex-wrap items-center gap-1.5 rounded-sm border border-[#e5e1dc] bg-[#faf8f5] px-2.5 py-1.5 min-h-[44px]">
                            {colors.map((c) => (
                                <span
                                    key={c}
                                    className="inline-flex items-center gap-1.5 rounded-sm bg-[#e8e5e0] px-2 py-1 text-xs font-medium text-stone-800"
                                >
                                    <span>{c}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeColor(c)}
                                        className="text-stone-500 hover:text-stone-800 focus:outline-none cursor-pointer"
                                        title={`Hapus warna ${c}`}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}

                            <input
                                list="available-colors"
                                type="text"
                                placeholder={colors.length === 0 ? 'Ketik warna & Enter (contoh: Sage, Cream, White)' : '+ Warna'}
                                value={newColorInput}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val.includes(',')) {
                                        const parts = val.split(',');
                                        parts.forEach((p) => addColor(p));
                                    } else {
                                        setNewColorInput(val);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addColor(newColorInput);
                                    } else if (
                                        e.key === 'Backspace' &&
                                        !newColorInput &&
                                        colors.length > 0
                                    ) {
                                        removeColor(colors[colors.length - 1]);
                                    }
                                }}
                                className="flex-1 min-w-[100px] bg-transparent px-1 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none"
                            />
                        </div>

                        {/* Color Picker Swatch Box */}
                        {activeEditColor ? (
                            <label
                                className="relative h-11 w-11 shrink-0 cursor-pointer rounded-sm border border-[#e5e1dc] overflow-hidden shadow-2xs"
                                style={{ backgroundColor: activeHex }}
                                title={`Pilih warna RGB untuk ${activeEditColor}`}
                            >
                                <input
                                    type="color"
                                    value={activeHex.length === 7 ? activeHex : '#2D2D2D'}
                                    onChange={(e) => handleHexChange(activeEditColor, e.target.value)}
                                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                                />
                            </label>
                        ) : (
                            <div
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[#e5e1dc] bg-[#faf8f5] text-xs text-stone-300 select-none"
                                title="Tambahkan warna terlebih dahulu"
                            >
                                -
                            </div>
                        )}

                        {/* Hex Code Input */}
                        <input
                            type="text"
                            value={activeHex}
                            onChange={(e) => handleHexChange(activeEditColor, e.target.value)}
                            placeholder="#HEX"
                            disabled={!activeEditColor}
                            className={cn(
                                "h-11 w-24 rounded-sm border border-[#e5e1dc] bg-[#faf8f5] px-2.5 text-center font-mono text-xs font-semibold text-stone-800 focus:border-stone-800 focus:bg-white focus:outline-none",
                                !activeEditColor && "opacity-50 cursor-not-allowed text-stone-400"
                            )}
                        />
                    </div>

                    {/* Edit RGB Active Color Selector */}
                    {colors.length > 0 && (
                        <div className="pt-1">
                            <div className="text-xs text-stone-600 mb-1.5">
                                Edit RGB:{' '}
                                <span className="font-semibold text-stone-900">{activeEditColor}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((c) => {
                                    const hex = localHexes[c] || '#2D2D2D';
                                    const isSelected = activeEditColor === c;
                                    return (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setActiveEditColor(c)}
                                            className={cn(
                                                'inline-flex items-center gap-2 rounded-sm border px-3 py-1 text-xs font-medium transition cursor-pointer',
                                                isSelected
                                                    ? 'border-stone-900 bg-white text-stone-900 ring-1 ring-stone-900 shadow-2xs'
                                                    : 'border-[#e5e1dc] bg-[#faf8f5] text-stone-700 hover:bg-stone-100',
                                            )}
                                        >
                                            <span
                                                className="h-2.5 w-2.5 rounded-full shrink-0"
                                                style={{ backgroundColor: hex }}
                                            />
                                            <span>{c}</span>
                                            <span
                                                className={cn(
                                                    'font-mono text-[11px]',
                                                    isSelected ? 'text-stone-700 font-semibold' : 'text-stone-400',
                                                )}
                                            >
                                                {hex}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <datalist id="available-colors">
                        {availableColors.map((c) => (
                            <option key={c} value={c} />
                        ))}
                    </datalist>
                </div>

                {/* Column 2: UKURAN * */}
                <div className="space-y-2">
                    <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700">
                        UKURAN <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-wrap items-center gap-1.5 rounded-sm border border-[#e5e1dc] bg-[#faf8f5] px-2.5 py-1.5 min-h-[44px]">
                        {sizes.map((s) => (
                            <span
                                key={s}
                                className="inline-flex items-center gap-1.5 rounded-sm bg-[#e8e5e0] px-2 py-1 text-xs font-medium text-stone-800"
                            >
                                <span>{s}</span>
                                <button
                                    type="button"
                                    onClick={() => removeSize(s)}
                                    className="text-stone-500 hover:text-stone-800 focus:outline-none cursor-pointer"
                                    title={`Hapus ukuran ${s}`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}

                        <input
                            list="common-sizes"
                            type="text"
                            placeholder={sizes.length === 0 ? 'Ketik ukuran & Enter (contoh: S, M, L, XL)' : '+ Ukuran'}
                            value={newSizeInput}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.includes(',')) {
                                    const parts = val.split(',');
                                    parts.forEach((p) => addSize(p));
                                } else {
                                    setNewSizeInput(val);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addSize(newSizeInput);
                                } else if (
                                    e.key === 'Backspace' &&
                                    !newSizeInput &&
                                    sizes.length > 0
                                ) {
                                    removeSize(sizes[sizes.length - 1]);
                                }
                            }}
                            className="flex-1 min-w-[70px] bg-transparent px-1 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none"
                        />
                    </div>

                    <datalist id="common-sizes">
                        {COMMON_SIZES.concat(availableSizes).map((s) => (
                            <option key={s} value={s} />
                        ))}
                    </datalist>
                </div>
            </div>

            {/* MIDDLE ROW: SET SEMUA STOK */}
            <div className="border-t border-b border-[#ece8e3] py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-sans text-xs font-bold uppercase tracking-wide text-stone-800">
                        SET SEMUA STOK:
                    </span>
                    <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={bulkStockInput}
                        onChange={(e) => setBulkStockInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleApplyBulkStock();
                            }
                        }}
                        className="h-9 w-20 rounded-sm border border-[#e5e1dc] bg-[#faf8f5] px-2 text-center text-xs font-semibold text-stone-800 focus:border-stone-900 focus:bg-white focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={handleApplyBulkStock}
                        disabled={colors.length === 0 || sizes.length === 0}
                        className="h-9 rounded-sm bg-stone-900 px-4 font-sans text-xs font-semibold text-white shadow-2xs hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        Terapkan ke Semua
                    </button>
                    <span className="text-xs text-stone-500 italic">
                        (Isi cepat semua varian, lalu sesuaikan per ukuran jika diperlukan)
                    </span>
                </div>

                <div className="text-right">
                    <span className="font-sans text-xs text-stone-600">
                        Total stock produk:{' '}
                        <strong className="text-sm font-bold text-stone-900">{totalStock}</strong>
                    </span>
                </div>
            </div>

            {/* MATRIX TABLE */}
            {colors.length > 0 && sizes.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#ece8e3]">
                                <th className="py-3.5 px-4 font-sans text-xs font-bold uppercase tracking-wider text-stone-700 w-36">
                                    UKURAN
                                </th>
                                {colors.map((c) => {
                                    const hex = localHexes[c] || '#2D2D2D';
                                    return (
                                        <th
                                            key={c}
                                            className="py-3.5 px-4 font-sans text-xs font-bold uppercase tracking-wider text-stone-700 min-w-[140px]"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="h-3 w-3 rounded-full shrink-0"
                                                    style={{ backgroundColor: hex }}
                                                />
                                                <span>{c.toUpperCase()}</span>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ece8e3]">
                            {sizes.map((s) => (
                                <tr key={s} className="hover:bg-[#faf8f5]/40 transition-colors">
                                    <td className="py-3.5 px-4 font-sans text-xs font-bold text-stone-800">
                                        {s}
                                    </td>
                                    {colors.map((c) => {
                                        const currentQty = stockMap.get(`${c}___${s}`) ?? 0;
                                        return (
                                            <td key={`${c}___${s}`} className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={currentQty}
                                                    onChange={(e) =>
                                                        handleCellStockChange(c, s, e.target.value)
                                                    }
                                                    className="h-9 w-24 rounded-sm border border-[#e5e1dc] bg-[#faf8f5] px-3 text-center text-sm font-medium text-stone-800 placeholder:text-stone-400 focus:border-stone-900 focus:bg-white focus:outline-none"
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-[#e5e1dc] bg-[#faf8f5]/60 py-8 px-4 text-center">
                    <p className="font-sans text-xs font-medium text-stone-500">
                        {colors.length === 0 && sizes.length === 0
                            ? 'Pilih atau ketik warna dan ukuran di atas untuk mengisi stok.'
                            : colors.length === 0
                            ? 'Silakan tambahkan warna pada kolom WARNA di atas untuk memunculkan tabel stok.'
                            : 'Silakan tambahkan ukuran pada kolom UKURAN di atas untuk memunculkan tabel stok.'}
                    </p>
                </div>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
