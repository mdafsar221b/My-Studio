import React, { useState } from 'react';
import {
    X,
    Sparkles,
    Wand2,
    Smile,
    GripVertical,
    Plus,
    Trash2,
    Bold,
    Underline,
    Italic,
    AlignLeft,
    AlignCenter,
    Link,
    Copy,
    Check,
    Undo2,
    Loader2
} from 'lucide-react';
import { improveWriting, recruiterReview, generateTailoredSummary, customAIRequest } from '../../geminiService';

// --- AIAssistantPopup ---

export const AIAssistantPopup: React.FC<{
    type: 'summary' | 'experience';
    contextText: string;
    onApply: (newText: string) => void;
    onClose: () => void;
    position: { top: number; left: number };
}> = ({ type, contextText, onApply, onClose, position }) => {
    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [customPrompt, setCustomPrompt] = useState('');

    const handleAction = async (action: () => Promise<string>, actionName: string, isFeedback = false) => {
        setLoading(true);
        setLoadingAction(actionName);
        setFeedback(null);
        try {
            const result = await action();
            if (isFeedback) {
                setFeedback(result);
            } else {
                onApply(result);
                onClose();
            }
        } catch (e) {
            console.error(e);
            setFeedback("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
            setLoadingAction(null);
        }
    };

    return (
        <div
            className="fixed z-[300] w-[280px] bg-shades-black-90/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-shades-black-80 p-4 animate-in fade-in zoom-in-95 duration-200"
            style={{ top: position.top, left: position.left }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-shades-white-100 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                    <span className="text-[10px] font-bold text-shades-white-60 uppercase tracking-widest">AI Assistant</span>
                </div>
                <button onClick={onClose} className="text-shades-black-60 hover:text-shades-white-100 transition-colors">
                    <X size={16} />
                </button>
            </div>

            <div className="space-y-1">
                {type === 'summary' && (
                    <button
                        disabled={loading}
                        onClick={() => handleAction(() => generateTailoredSummary(contextText), 'summary')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group disabled:cursor-wait ${loading && loadingAction === 'summary' ? 'bg-shades-black-80 text-shades-white-100' : 'hover:bg-shades-black-80'}`}
                    >
                        {loading && loadingAction === 'summary' ? (
                            <Loader2 size={18} className="animate-spin text-shades-white-100" />
                        ) : (
                            <Sparkles size={18} className="opacity-60 group-hover:opacity-100 group-hover:text-shades-white-100 group-hover:scale-110 transition-all text-shades-white-80" />
                        )}
                        <span className={`text-sm font-medium transition-colors ${loading && loadingAction === 'summary' ? 'text-shades-white-100' : 'text-shades-white-80 group-hover:text-shades-white-100'}`}>
                            {loading && loadingAction === 'summary' ? 'Generating...' : 'Generate Tailored Summary'}
                        </span>
                    </button>
                )}

                <button
                    disabled={loading}
                    onClick={() => handleAction(() => improveWriting(contextText), 'improve')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group disabled:cursor-wait ${loading && loadingAction === 'improve' ? 'bg-shades-black-80 text-shades-white-100' : 'hover:bg-shades-black-80'}`}
                >
                    {loading && loadingAction === 'improve' ? (
                        <Loader2 size={18} className="animate-spin text-shades-white-100" />
                    ) : (
                        <Wand2 size={18} className="opacity-60 group-hover:opacity-100 group-hover:text-shades-white-100 group-hover:scale-110 transition-all text-shades-white-80" />
                    )}
                    <span className={`text-sm font-medium transition-colors ${loading && loadingAction === 'improve' ? 'text-shades-white-100' : 'text-shades-white-80 group-hover:text-shades-white-100'}`}>
                        {loading && loadingAction === 'improve' ? 'Improving...' : 'Improve Writing'}
                    </span>
                </button>

                {type === 'experience' && (
                    <button
                        disabled={loading}
                        onClick={() => handleAction(() => recruiterReview(contextText), 'review', true)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group disabled:cursor-wait ${loading && loadingAction === 'review' ? 'bg-shades-black-80 text-shades-white-100' : 'hover:bg-shades-black-80'}`}
                    >
                        {loading && loadingAction === 'review' ? (
                            <Loader2 size={18} className="animate-spin text-shades-white-100" />
                        ) : (
                            <Smile size={18} className="opacity-60 group-hover:opacity-100 group-hover:text-shades-white-100 group-hover:scale-110 transition-all text-shades-white-80" />
                        )}
                        <span className={`text-sm font-medium transition-colors ${loading && loadingAction === 'review' ? 'text-shades-white-100' : 'text-shades-white-80 group-hover:text-shades-white-100'}`}>
                            {loading && loadingAction === 'review' ? 'Reviewing...' : 'Recruiter Review'}
                        </span>
                    </button>
                )}
            </div>

            {feedback && (
                <div className="mt-3 p-3 bg-shades-black-80 rounded-xl text-xs text-shades-white-90 leading-relaxed border border-shades-black-70 animate-in slide-in-from-top-2">
                    {feedback}
                </div>
            )}

            <div className="relative flex items-center gap-3 my-4">
                <div className="flex-grow h-px bg-shades-black-80"></div>
                <span className="text-[10px] font-bold text-shades-black-60 uppercase tracking-widest">or</span>
                <div className="flex-grow h-px bg-shades-black-80"></div>
            </div>

            <div className="relative group">
                <textarea
                    placeholder="Enter a custom request"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAction(() => customAIRequest(customPrompt, contextText), 'custom');
                        }
                    }}
                    className="w-full bg-shades-black-100/50 border border-shades-black-70 rounded-xl p-3 text-sm text-shades-white-90 placeholder:text-shades-black-60 outline-none focus:border-shades-white-60 focus:bg-shades-black-100 focus:ring-4 focus:ring-shades-white-100/5 transition-all min-h-[80px] resize-none"
                />
                {loading && (
                    <div className="absolute inset-0 bg-shades-black-90/80 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                        <div className="w-5 h-5 border-2 border-shades-white-100 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SectionToolbar ---

export const SectionToolbar: React.FC<{ onAdd?: () => void; onDelete?: () => void }> = ({ onAdd, onDelete }) => (
    <div className="absolute -top-12 left-0 flex items-center gap-1 bg-shades-black-90 shadow-xl border border-shades-black-80 rounded-lg p-1 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200">
        <button
            onClick={(e) => { e.stopPropagation(); onAdd?.(); }}
            className="bg-shades-white-100 text-shades-black-100 px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-1 hover:bg-shades-white-90 transition-colors shadow-lg shadow-black/20"
            title="Add a new entry to this section"
        >
            <Plus size={16} /> Entry
        </button>
        <div className="w-px h-6 bg-shades-black-70 mx-1"></div>
        <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="p-2 text-shades-black-60 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-colors"
            title="Remove this section from layout"
        >
            <Trash2 size={16} />
        </button>
    </div>
);

// --- ItemToolbar ---

export const ItemToolbar: React.FC<{ onAdd?: () => void; onDelete?: () => void; onDragStart?: (e: React.DragEvent) => void }> = ({ onAdd, onDelete, onDragStart }) => (
    <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-shades-black-90 shadow-2xl border border-shades-black-80 rounded-xl p-1.5 z-[110] animate-in fade-in slide-in-from-bottom-4 duration-200 ring-4 ring-black/10">
        {onDragStart && (
            <>
                <div
                    onDragStart={onDragStart}
                    draggable
                    className="p-2.5 text-shades-black-60 hover:bg-shades-black-80 hover:text-shades-white-100 rounded-lg transition-all cursor-grab active:cursor-grabbing"
                    title="Drag to reorder"
                >
                    <GripVertical size={16} />
                </div>
                <div className="w-px h-6 bg-shades-black-70 mx-1"></div>
            </>
        )}
        <button
            onClick={(e) => { e.stopPropagation(); onAdd?.(); }}
            className="bg-shades-white-100 text-shades-black-100 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-shades-white-90 transition-all shadow-lg shadow-black/20"
            title="Duplicate this entry"
        >
            <Plus size={16} /> <span>Duplicate</span>
        </button>
        <div className="w-px h-6 bg-shades-black-70 mx-1"></div>
        <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="p-2.5 text-shades-black-60 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all"
            title="Delete this entry"
        >
            <Trash2 size={16} />
        </button>
    </div>
);

// --- TextFormattingToolbar ---

export const TextFormattingToolbar: React.FC<{ position: { top: number; left: number } }> = ({ position }) => {
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [savedRange, setSavedRange] = useState<Range | null>(null);

    const handleFormat = (command: string, value?: string) => {
        document.execCommand(command, false, value);
    };

    const handleLinkClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            setSavedRange(range);

            let node = range.commonAncestorContainer;
            if (node.nodeType === 3 && node.parentElement) node = node.parentElement;

            const anchor = (node as HTMLElement).closest('a');
            setLinkUrl(anchor ? anchor.getAttribute('href') || '' : '');

            setShowLinkInput(true);
        }
    };

    const handleSaveLink = (e?: React.FormEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (savedRange) {
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(savedRange);

                if (linkUrl) {
                    document.execCommand('createLink', false, linkUrl);
                    if (!document.queryCommandState('bold')) {
                        document.execCommand('bold');
                    }
                } else {
                    document.execCommand('unlink');
                }
            }
        }
        setShowLinkInput(false);
        setSavedRange(null);
    };

    const handleCancelLink = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Restore selection
        if (savedRange) {
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(savedRange);
            }
        }
        setShowLinkInput(false);
        setSavedRange(null);
    };

    if (showLinkInput) {
        return (
            <div
                className="text-formatting-toolbar absolute flex items-center gap-1 bg-slate-800 text-white rounded-full px-1.5 py-1.5 shadow-2xl z-[220] animate-in fade-in zoom-in-95 duration-150 border border-white/10 backdrop-blur-sm pointer-events-auto"
                style={{
                    top: `${position.top - 12}px`,
                    left: `${position.left}px`,
                    transform: 'translate(-50%, -100%)'
                }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSaveLink} className="flex items-center gap-1">
                    <input
                        type="text"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="Paste link..."
                        className="bg-transparent border-none outline-none text-xs text-white placeholder-white/40 min-w-[150px] px-2"
                        autoFocus
                        onKeyDown={(e) => e.stopPropagation()} // Allow typing
                    />
                    <button type="submit" className="p-1.5 hover:bg-green-500/20 text-green-400 rounded-full transition-colors">
                        <Check size={14} />
                    </button>
                    <button type="button" onClick={handleCancelLink} className="p-1.5 hover:bg-white/10 text-slate-300 rounded-full transition-colors">
                        <Undo2 size={14} />
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div
            className="text-formatting-toolbar absolute flex items-center gap-0.5 bg-shades-black-90 text-shades-white-100 rounded-full px-2 py-1.5 shadow-2xl z-[220] animate-in fade-in zoom-in-95 duration-150 border border-shades-black-80 backdrop-blur-sm pointer-events-auto"
            style={{
                top: `${position.top - 12}px`,
                left: `${position.left}px`,
                transform: 'translate(-50%, -100%)'
            }}
            onMouseDown={(e) => e.preventDefault()}
        >
            <button onClick={() => handleFormat('bold')} className="p-2 hover:bg-shades-black-80 rounded-full transition-colors font-bold text-sm min-w-[32px]" title="Bold (Ctrl+B)">
                <Bold size={16} />
            </button>
            <button onClick={() => handleFormat('underline')} className="p-2 hover:bg-shades-black-80 rounded-full transition-colors underline text-sm min-w-[32px]" title="Underline (Ctrl+U)">
                <Underline size={16} />
            </button>
            <button onClick={() => handleFormat('italic')} className="p-2 hover:bg-shades-black-80 rounded-full transition-colors italic font-serif text-sm min-w-[32px]" title="Italic (Ctrl+I)">
                <Italic size={16} />
            </button>
            <div className="w-px h-4 bg-shades-black-80 mx-1"></div>
            <button onClick={() => handleFormat('justifyLeft')} className="p-2 hover:bg-shades-black-80 rounded-full transition-colors" title="Align Left">
                <AlignLeft size={16} />
            </button>
            <button onClick={() => handleFormat('justifyCenter')} className="p-2 hover:bg-shades-black-80 rounded-full transition-colors" title="Align Center">
                <AlignCenter size={16} />
            </button>
            <div className="w-px h-4 bg-shades-black-80 mx-1"></div>
            <button onMouseDown={handleLinkClick} className={`p-2 hover:bg-shades-black-80 rounded-full transition-colors ${showLinkInput ? 'bg-shades-black-80' : ''}`} title="Insert Link">
                <Link size={16} />
            </button>
        </div>
    );
};
