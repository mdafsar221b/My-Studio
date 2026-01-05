
import React, { useState } from 'react';
import { X, Globe, Copy, Check, Linkedin, Twitter, Mail, ArrowRight } from 'lucide-react';

import { ResumeData } from '../types';

interface Props {
    onClose: () => void;
    isOpen: boolean;
    data: ResumeData;
}

const ShareModal: React.FC<Props> = ({ onClose, isOpen, data }) => {
    const [isPublished, setIsPublished] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mystudio.app';
    const slug = data.personalInfo?.fullName ? generateSlug(data.personalInfo.fullName) : 'resume';
    const shareUrl = `${origin}/resume/${slug}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-shades-black-100 border border-shades-black-80 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-shades-black-80 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-shades-white-100 flex items-center gap-2">
                        <Globe className="text-indigo-400" size={24} />
                        Share Resume
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-shades-black-60 hover:text-shades-white-100 transition-colors p-1 rounded-full hover:bg-shades-black-80"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {!isPublished ? (
                        <div className="bg-shades-black-90 rounded-xl p-6 text-center border border-shades-black-80">
                            <div className="w-16 h-16 bg-shades-black-80 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Globe className="text-shades-black-60" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-shades-white-100 mb-2">Publish to Web</h3>
                            <p className="text-sm text-shades-black-60 mb-6">
                                Make your resume accessible via a unique public link. Anyone with the link can view it.
                            </p>
                            <button
                                onClick={() => setIsPublished(true)}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                Publish Now <ArrowRight size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-shades-black-60 uppercase tracking-widest">Public Link</label>
                                <div className="flex gap-2">
                                    <div className="flex-grow bg-shades-black-90 border border-shades-black-80 rounded-xl px-4 py-3 text-sm text-shades-white-80 font-mono truncate select-all">
                                        {shareUrl}
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className={`px-4 rounded-xl border font-bold text-sm transition-all flex items-center gap-2 ${copied ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-shades-white-100 text-shades-black-100 border-transparent hover:bg-shades-white-90'}`}
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-shades-black-60 uppercase tracking-widest">Share via</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-shades-black-90 border border-shades-black-80 hover:bg-[#0077b5] hover:text-white hover:border-transparent transition-all group">
                                        <Linkedin size={24} className="text-[#0077b5] group-hover:text-white transition-colors" />
                                        <span className="text-xs font-medium text-shades-black-60 group-hover:text-white">LinkedIn</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-shades-black-90 border border-shades-black-80 hover:bg-[#1DA1F2] hover:text-white hover:border-transparent transition-all group">
                                        <Twitter size={24} className="text-[#1DA1F2] group-hover:text-white transition-colors" />
                                        <span className="text-xs font-medium text-shades-black-60 group-hover:text-white">Twitter</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-shades-black-90 border border-shades-black-80 hover:bg-emerald-600 hover:text-white hover:border-transparent transition-all group">
                                        <Mail size={24} className="text-emerald-500 group-hover:text-white transition-colors" />
                                        <span className="text-xs font-medium text-shades-black-60 group-hover:text-white">Email</span>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-shades-black-80 text-center">
                                <button
                                    onClick={() => setIsPublished(false)}
                                    className="text-xs text-shades-black-60 hover:text-red-400 transition-colors"
                                >
                                    Unpublish Resume
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
