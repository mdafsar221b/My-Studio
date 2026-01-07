import React, { useState } from 'react';
import { TEMPLATES, TemplateMeta } from './resume/templates/registry';
import { LayoutTemplate, Check, Filter } from 'lucide-react';

import TemplatePreview from './TemplatePreview';

interface Props {
    onSelect: (templateId: string) => void;
    onBack: () => void;
}

const TemplateSelector: React.FC<Props> = ({ onSelect, onBack }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    // Derive categories from tags
    const categories = ['All', ...Array.from(new Set(TEMPLATES.flatMap(t => t.tags)))];

    const filteredTemplates = selectedCategory === 'All'
        ? TEMPLATES
        : TEMPLATES.filter(t => t.tags.includes(selectedCategory));

    return (
        <div className="min-h-screen bg-shades-black-100 text-shades-white-100 flex flex-col items-center py-12 px-6 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="w-full max-w-6xl z-10 flex flex-col gap-8">

                {/* Header */}
                <div className="flex flex-col gap-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Choose Your Foundation</h1>
                    <p className="text-shades-white-60 text-lg max-w-2xl mx-auto">Select a professionally designed template to start your journey. You can always change this later.</p>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 py-4 sticky top-0 z-20 backdrop-blur-md bg-shades-black-100/50 rounded-xl border border-shades-black-80/50 p-2">
                    {categories.slice(0, 8).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-shades-white-100 text-shades-black-100 shadow-lg' : 'text-shades-white-60 hover:text-shades-white-100 hover:bg-shades-black-80'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredTemplates.map(template => (
                        <div
                            key={template.id}
                            onClick={() => onSelect(template.id)}
                            className="group relative bg-shades-black-90 rounded-2xl overflow-hidden border border-shades-black-80 hover:border-shades-white-60/50 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-1 cursor-pointer"
                        >
                            {/* Template Preview Skeleton */}
                            <div className="h-64 w-full relative bg-shades-black-80 overflow-hidden">
                                <TemplatePreview templateId={template.id} />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                    <span className="px-6 py-3 bg-white text-black font-bold rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">Use Template</span>
                                </div>
                                {template.isPremium && (
                                    <div className="absolute top-3 right-3 bg-yellow-400/20 text-yellow-300 backdrop-blur-md px-2 py-1 rounded text-xs font-bold border border-yellow-400/30 z-10">
                                        PREMIUM
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-shades-white-100">{template.name}</h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {template.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[10px] uppercase tracking-wider text-shades-white-60 bg-shades-black-80 px-2 py-1 rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Back Action */}
                <div className="flex justify-center mt-12">
                    <button onClick={onBack} className="text-shades-white-60 hover:text-shades-white-100 transition-colors">
                        Back to Home
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TemplateSelector;
