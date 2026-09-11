import * as React from 'react';
import { ChevronDown, Link2, List, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    minHeight?: string;
}

export function RichTextEditor({
    value = '',
    onChange,
    placeholder = 'Tulis deskripsi artikel seperti dokumen...',
    className,
    minHeight = '180px',
}: RichTextEditorProps) {
    const editorRef = React.useRef<HTMLDivElement>(null);
    const [isEmpty, setIsEmpty] = React.useState(!value || value === '<p></p>' || value === '<br>');
    const [currentFormat, setCurrentFormat] = React.useState('Normal');
    const isInternalChange = React.useRef(false);

    React.useEffect(() => {
        if (!editorRef.current) return;
        if (isInternalChange.current) {
            isInternalChange.current = false;
            return;
        }
        if (editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
            checkEmpty();
        }
    }, [value]);

    const checkEmpty = () => {
        if (!editorRef.current) return;
        const text = editorRef.current.innerText.trim();
        setIsEmpty(!text);
    };

    const handleInput = () => {
        if (!editorRef.current) return;
        isInternalChange.current = true;
        const html = editorRef.current.innerHTML;
        checkEmpty();
        onChange(html);
    };

    const exec = (command: string, val: string | undefined = undefined) => {
        if (!editorRef.current) return;
        editorRef.current.focus();
        document.execCommand(command, false, val);
        handleInput();
    };

    const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setCurrentFormat(val);
        if (val === 'Normal') {
            exec('formatBlock', '<p>');
        } else if (val === 'Heading 1') {
            exec('formatBlock', '<h1>');
        } else if (val === 'Heading 2') {
            exec('formatBlock', '<h2>');
        } else if (val === 'Heading 3') {
            exec('formatBlock', '<h3>');
        }
    };

    const handleAddLink = () => {
        const url = prompt('Masukkan tautan URL (contoh: https://...):');
        if (url) {
            exec('createLink', url);
        }
    };

    return (
        <div
            className={cn(
                'overflow-hidden rounded-lg border border-[#e5e1dc] bg-white transition-colors focus-within:border-warm-brown focus-within:ring-1 focus-within:ring-warm-brown',
                className,
            )}
        >
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-[#ece8e3] bg-[#fdfcfb] px-3 py-2 text-stone-700">
                <button
                    type="button"
                    title="Tebal (Bold)"
                    onClick={() => exec('bold')}
                    className="flex h-8 w-8 items-center justify-center rounded font-serif text-sm font-bold text-stone-800 transition hover:bg-stone-200/60 active:bg-stone-300"
                >
                    B
                </button>
                <button
                    type="button"
                    title="Miring (Italic)"
                    onClick={() => exec('italic')}
                    className="flex h-8 w-8 items-center justify-center rounded font-serif text-sm italic text-stone-800 transition hover:bg-stone-200/60 active:bg-stone-300"
                >
                    I
                </button>
                <button
                    type="button"
                    title="Garis Bawah (Underline)"
                    onClick={() => exec('underline')}
                    className="flex h-8 w-8 items-center justify-center rounded font-serif text-sm underline text-stone-800 transition hover:bg-stone-200/60 active:bg-stone-300"
                >
                    U
                </button>

                <div className="mx-1.5 h-4 w-px bg-stone-200" />

                {/* Format Dropdown (Normal, Heading 1, 2, 3) */}
                <div className="relative inline-flex items-center">
                    <select
                        aria-label="Format Teks"
                        value={currentFormat}
                        onChange={handleHeadingChange}
                        className="h-8 appearance-none rounded border border-transparent bg-transparent pl-2.5 pr-7 text-xs font-medium text-stone-700 hover:bg-stone-200/50 focus:border-stone-300 focus:outline-none cursor-pointer"
                    >
                        <option value="Normal">Normal</option>
                        <option value="Heading 1">Heading 1</option>
                        <option value="Heading 2">Heading 2</option>
                        <option value="Heading 3">Heading 3</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-1.5 h-3.5 w-3.5 text-stone-400" />
                </div>

                <div className="mx-1.5 h-4 w-px bg-stone-200" />

                {/* Bullet list */}
                <button
                    type="button"
                    title="Daftar Poin (Bullet List)"
                    onClick={() => exec('insertUnorderedList')}
                    className="flex h-8 w-8 items-center justify-center rounded text-stone-700 transition hover:bg-stone-200/60 active:bg-stone-300"
                >
                    <List className="h-4 w-4" />
                </button>

                {/* Numbered list */}
                <button
                    type="button"
                    title="Daftar Nomor (Numbered List)"
                    onClick={() => exec('insertOrderedList')}
                    className="flex h-8 w-8 items-center justify-center rounded text-stone-700 transition hover:bg-stone-200/60 active:bg-stone-300"
                >
                    <ListOrdered className="h-4 w-4" />
                </button>

                <div className="mx-1.5 h-4 w-px bg-stone-200" />

                {/* Link */}
                <button
                    type="button"
                    title="Sisipkan Tautan"
                    onClick={handleAddLink}
                    className="flex h-8 w-8 items-center justify-center rounded text-stone-700 transition hover:bg-stone-200/60 active:bg-stone-300"
                >
                    <Link2 className="h-4 w-4" />
                </button>

                {/* Remove format Tx */}
                <button
                    type="button"
                    title="Hapus Format (Clear Formatting)"
                    onClick={() => exec('removeFormat')}
                    className="flex h-8 w-8 items-center justify-center rounded text-stone-700 transition hover:bg-stone-200/60 active:bg-stone-300"
                >
                    <span className="font-sans text-xs font-semibold">
                        T<sub className="text-[9px] -ml-0.5">x</sub>
                    </span>
                </button>
            </div>

            {/* Editable Content */}
            <div className="relative p-4">
                {isEmpty && (
                    <div className="pointer-events-none absolute left-4 top-4 select-none font-sans text-sm italic text-stone-400">
                        {placeholder}
                    </div>
                )}
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onBlur={handleInput}
                    style={{ minHeight }}
                    className="prose prose-stone max-w-none font-sans text-sm text-stone-800 focus:outline-none [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-warm-brown [&_a]:underline"
                />
            </div>
        </div>
    );
}
