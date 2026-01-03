
import React from 'react';
import { TemplateProps } from './registry';

const Minimalist: React.FC<TemplateProps> = ({ data, layout, design, isReadOnly, onUpdate, renderSection }) => {
    // Minimalist: Centered, clean, lots of whitespace. Single column flow but allows split if layout dictates.
    // We force a specific elegant style override if needed, or respect design config.

    return (
        <div className="flex flex-col flex-grow w-full bg-white text-slate-800">
            <div className="text-center p-16 pb-8">
                <h1
                    className="text-4xl font-light tracking-widest mb-4 uppercase text-slate-900 border-b pb-4 border-slate-200 inline-block px-8"
                    contentEditable={!isReadOnly}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdate('personalInfo.name', e.currentTarget.textContent)}
                >
                    {data.personalInfo.name}
                </h1>
                <p
                    className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase mt-2"
                    contentEditable={!isReadOnly}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdate('personalInfo.title', e.currentTarget.textContent)}
                >
                    {data.personalInfo.title}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.email', e.currentTarget.textContent)}>{data.personalInfo.email}</span>
                    <span className="text-slate-300">•</span>
                    <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.phone', e.currentTarget.textContent)}>{data.personalInfo.phone}</span>
                    <span className="text-slate-300">•</span>
                    <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.location', e.currentTarget.textContent)}>{data.personalInfo.location}</span>
                </div>
            </div>

            <div className="flex flex-grow w-full px-16 py-8 gap-16">
                {/* Main Content Area */}
                <div className="w-full space-y-8">
                    {/* We iterate both columns linearly for a true single column minimalist feel, or respect layout if user wants split.
                 Let's respect layout but style them cleanly. */}
                    <div className="grid grid-cols-12 gap-12">
                        <div className="col-span-8 space-y-8">
                            {layout.left && layout.left.map(id => renderSection(id, false))}
                        </div>
                        <div className="col-span-4 space-y-8 border-l border-slate-100 pl-8">
                            {layout.right && layout.right.map(id => renderSection(id, false))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Minimalist;
