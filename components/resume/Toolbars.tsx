import React, { useState } from 'react';
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
    const [feedback, setFeedback] = useState<string | null>(null);
    const [customPrompt, setCustomPrompt] = useState('');

    const handleAction = async (action: () => Promise<string>, isFeedback = false) => {
        setLoading(true);
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
        }
    };

    return (
        <div
            className="fixed z-[300] w-[280px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 p-4 animate-in fade-in zoom-in-95 duration-200"
            style={{ top: position.top, left: position.left }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">AI Assistant</span>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
            </div>

            <div className="space-y-1">
                {type === 'summary' && (
                    <button
                        disabled={loading}
                        onClick={() => handleAction(() => generateTailoredSummary(contextText))}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                        <span className="text-lg opacity-60 group-hover:opacity-100 group-hover:text-teal-600 group-hover:scale-110 transition-all">✨</span>
                        <span className="text-sm font-medium text-slate-700">Generate Tailored Summary</span>
                    </button>
                )}

                <button
                    disabled={loading}
                    onClick={() => handleAction(() => improveWriting(contextText))}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                    <span className="text-lg opacity-60 group-hover:opacity-100 group-hover:text-teal-600 group-hover:scale-110 transition-all">✎</span>
                    <span className="text-sm font-medium text-slate-700">Improve Writing</span>
                </button>

                {type === 'experience' && (
                    <button
                        disabled={loading}
                        onClick={() => handleAction(() => recruiterReview(contextText), true)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                        <span className="text-lg opacity-60 group-hover:opacity-100 group-hover:text-teal-600 group-hover:scale-110 transition-all">☺</span>
                        <span className="text-sm font-medium text-slate-700">Recruiter Review</span>
                    </button>
                )}
            </div>

            {feedback && (
                <div className="mt-3 p-3 bg-indigo-50/50 rounded-xl text-xs text-indigo-700 leading-relaxed border border-indigo-100/50 animate-in slide-in-from-top-2">
                    {feedback}
                </div>
            )}

            <div className="relative flex items-center gap-3 my-4">
                <div className="flex-grow h-px bg-slate-100"></div>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">or</span>
                <div className="flex-grow h-px bg-slate-100"></div>
            </div>

            <div className="relative group">
                <textarea
                    placeholder="Enter a custom request"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAction(() => customAIRequest(customPrompt, contextText));
                        }
                    }}
                    className="w-full border border-slate-100 rounded-xl p-3 text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/5 transition-all min-h-[80px] resize-none"
                />
                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SectionToolbar ---

export const SectionToolbar: React.FC<{ onAdd?: () => void; onDelete?: () => void }> = ({ onAdd, onDelete }) => (
    <div className="absolute -top-12 left-0 flex items-center gap-1 bg-white shadow-xl border border-slate-200 rounded-lg p-1 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200">
        <button
            onClick={(e) => { e.stopPropagation(); onAdd?.(); }}
            className="bg-[#00C3A5] text-white px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-1 hover:bg-[#00a88e] transition-colors"
            title="Add a new entry to this section"
        >
            <span className="text-lg">+</span> Entry
        </button>
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors"
            title="Remove this section from layout"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
    </div>
);

// --- ItemToolbar ---

export const ItemToolbar: React.FC<{ onAdd?: () => void; onDelete?: () => void }> = ({ onAdd, onDelete }) => (
    <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white shadow-2xl border border-slate-200 rounded-xl p-1.5 z-[110] animate-in fade-in slide-in-from-bottom-4 duration-200 ring-4 ring-black/5">
        <button
            onClick={(e) => { e.stopPropagation(); onAdd?.(); }}
            className="bg-[#2ECB8F] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#27b37d] transition-all"
            title="Duplicate this entry"
        >
            <span className="text-xl leading-none">+</span> <span>Duplicate</span>
        </button>
        <div className="w-px h-6 bg-slate-100 mx-1"></div>
        <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="p-2.5 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
            title="Delete this entry"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
    </div>
);

// --- TextFormattingToolbar ---

export const TextFormattingToolbar: React.FC<{ position: { top: number; left: number } }> = ({ position }) => {
    const handleFormat = (command: string, value?: string) => {
        document.execCommand(command, false, value);
    };

    return (
        <div
            className="absolute flex items-center gap-0.5 bg-slate-800 text-white rounded-full px-2 py-1.5 shadow-2xl z-[220] animate-in fade-in zoom-in-95 duration-150 border border-white/10 backdrop-blur-sm pointer-events-auto"
            style={{
                top: `${position.top - 12}px`,
                left: `${position.left}px`,
                transform: 'translate(-50%, -100%)'
            }}
            onMouseDown={(e) => e.preventDefault()}
        >
            <button onClick={() => handleFormat('bold')} className="p-2 hover:bg-white/10 rounded-full transition-colors font-bold text-sm min-w-[32px]" title="Bold (Ctrl+B)">B</button>
            <button onClick={() => handleFormat('underline')} className="p-2 hover:bg-white/10 rounded-full transition-colors underline text-sm min-w-[32px]" title="Underline (Ctrl+U)">U</button>
            <button onClick={() => handleFormat('italic')} className="p-2 hover:bg-white/10 rounded-full transition-colors italic font-serif text-sm min-w-[32px]" title="Italic (Ctrl+I)">I</button>
            <div className="w-px h-4 bg-white/20 mx-1"></div>
            <button onClick={() => handleFormat('justifyLeft')} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Align Left">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z" /></svg>
            </button>
            <button onClick={() => handleFormat('justifyCenter')} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Align Center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm4 4h10v2H7V7zm-4 4h18v2H3v-2zm4 4h10v2H7v-2zm-4 4h18v2H3v-2z" /></svg>
            </button>
            <div className="w-px h-4 bg-white/20 mx-1"></div>
            <button onClick={() => handleFormat('createLink', prompt('Enter URL:') || '')} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Insert Link">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </button>
        </div>
    );
};
