import React from 'react';

interface Props {
    templateId: string;
}

const TemplatePreview: React.FC<Props> = ({ templateId }) => {
    // Define layout characteristics based on template ID

    // Layout Types
    const isSidebarLeft = ['double-column', 'creative', 'tech', 'modern-side'].includes(templateId);
    const isSidebarRight = ['modern'].includes(templateId);
    const isSingleColumn = ['minimalist', 'executive', 'ivy-league', 'startup'].includes(templateId);
    const isHeaderHeavy = ['professional-header', 'creative-photo', 'executive'].includes(templateId);
    const isCentered = ['minimalist-circle', 'minimalist'].includes(templateId);

    // Color hints (subtle)
    const accentColor =
        templateId === 'creative' ? 'bg-orange-200' :
            templateId === 'startup' ? 'bg-lime-200' :
                templateId === 'executive' ? 'bg-blue-200' :
                    templateId === 'modern' ? 'bg-rose-200' :
                        'bg-slate-300'; // default gray

    if (isSidebarLeft) {
        return (
            <div className="w-full h-full bg-white flex p-3 gap-2 overflow-hidden relative">
                {/* Left Sidebar */}
                <div className={`w-1/3 h-full ${accentColor} opacity-50 rounded-sm flex flex-col gap-2 p-1`}>
                    <div className="w-12 h-12 rounded-full bg-black/10 mb-2 mx-auto"></div>
                    <div className="w-full h-2 bg-black/10 rounded"></div>
                    <div className="w-2/3 h-2 bg-black/10 rounded"></div>
                    <div className="mt-4 w-full h-20 bg-black/5 rounded"></div>
                </div>
                {/* Right Content */}
                <div className="w-2/3 h-full flex flex-col gap-2 pt-2">
                    <div className="w-3/4 h-6 bg-slate-800 rounded mb-2"></div>
                    <div className="w-full h-2 bg-slate-200 rounded"></div>
                    <div className="w-full h-2 bg-slate-200 rounded"></div>
                    <div className="w-5/6 h-2 bg-slate-200 rounded"></div>

                    <div className="mt-6 w-full h-4 bg-slate-300 rounded"></div>
                    <div className="w-full h-16 bg-slate-100 rounded"></div>
                    <div className="w-full h-16 bg-slate-100 rounded"></div>
                </div>
            </div>
        );
    }

    if (isSidebarRight) {
        return (
            <div className="w-full h-full bg-white flex p-4 gap-3 overflow-hidden">
                {/* Left Content */}
                <div className="w-2/3 h-full flex flex-col gap-2">
                    <div className="w-full h-8 bg-slate-800 rounded mb-4"></div>
                    <div className="w-full h-24 bg-slate-100 rounded"></div>
                    <div className="w-full h-24 bg-slate-100 rounded"></div>
                </div>
                {/* Right Sidebar */}
                <div className={`w-1/3 h-full ${accentColor} opacity-50 rounded-sm flex flex-col gap-2 p-2`}>
                    <div className="w-full h-32 bg-black/5 rounded"></div>
                    <div className="w-full h-32 bg-black/5 rounded"></div>
                </div>
            </div>
        );
    }

    if (isHeaderHeavy) {
        return (
            <div className="w-full h-full bg-white flex flex-col overflow-hidden">
                {/* Header */}
                <div className={`w-full h-24 ${accentColor} flex items-center p-4 gap-3`}>
                    <div className="w-12 h-12 rounded bg-black/10"></div>
                    <div className="flex flex-col gap-2 w-full">
                        <div className="w-1/2 h-4 bg-black/20 rounded"></div>
                        <div className="w-1/3 h-2 bg-black/10 rounded"></div>
                    </div>
                </div>
                {/* Content */}
                <div className="flex-1 p-4 flex flex-col gap-3">
                    <div className="w-full h-4 bg-slate-200 rounded"></div>
                    <div className="w-full h-2 bg-slate-100 rounded"></div>
                    <div className="w-full h-2 bg-slate-100 rounded"></div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div className="h-20 bg-slate-50 rounded border border-slate-100"></div>
                        <div className="h-20 bg-slate-50 rounded border border-slate-100"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Default / Single Column / Minimalist
    return (
        <div className="w-full h-full bg-white flex flex-col p-6 gap-3 overflow-hidden items-center relative">
            {/* Header */}
            <div className={`flex flex-col gap-2 mb-4 w-full ${isCentered ? 'items-center' : 'items-start'}`}>
                <div className={`w-1/2 h-6 bg-slate-900 rounded ${isCentered ? 'mx-auto' : ''}`}></div>
                <div className={`w-1/3 h-2 bg-slate-400 rounded ${isCentered ? 'mx-auto' : ''}`}></div>
            </div>

            <div className={`w-full h-px ${accentColor} mb-2`}></div>

            {/* Sections */}
            <div className="w-full flex flex-col gap-3">
                <div className="w-full h-3 bg-slate-200 rounded w-1/4"></div>
                <div className="w-full h-2 bg-slate-100 rounded"></div>
                <div className="w-full h-2 bg-slate-100 rounded"></div>

                <div className="w-full h-3 bg-slate-200 rounded w-1/4 mt-2"></div>
                <div className="w-full h-2 bg-slate-100 rounded"></div>
                <div className="w-full h-2 bg-slate-100 rounded"></div>
                <div className="w-full h-2 bg-slate-100 rounded"></div>
            </div>
        </div>
    );
};

export default TemplatePreview;
