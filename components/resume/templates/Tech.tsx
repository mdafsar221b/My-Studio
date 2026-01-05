
import React from 'react';
import { TemplateProps } from './registry';

const Tech: React.FC<TemplateProps> = ({ data, pageContent, design, isReadOnly, isFirstPage, onUpdate, renderSection }) => {
    // Tech: Modern, digital feel

    return (
        <div className="flex flex-grow w-full bg-slate-50 text-slate-800 font-mono">
            {/* Sidebar (Left this time for variety) */}
            <div
                className="w-[30%] text-slate-300 p-8 flex flex-col gap-8 text-sm transition-colors duration-300"
                style={{ backgroundColor: design.contrastColor || '#0f172a' }}
            >
                <div className="mb-8">
                    {/* Profile Image Placeholer or Initials */}
                    {isFirstPage && (
                        <div
                            className="w-24 h-24 rounded-lg mb-6 flex items-center justify-center text-4xl font-bold text-slate-900 shadow-[4px_4px_0px_rgba(255,255,255,0.2)] transition-colors duration-300"
                            style={{ backgroundColor: design.primaryColor || '#14b8a6' }}
                        >
                            {data.personalInfo.name.charAt(0)}
                        </div>
                    )}

                    <div className="space-y-4 text-xs font-mono">
                        {isFirstPage && (
                            <div className="flex flex-col gap-1">
                                <span className="font-bold uppercase" style={{ color: design.primaryColor || '#14b8a6' }}>{'>'} Contact</span>
                                <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.email', e.currentTarget.textContent)}>{data.personalInfo.email}</span>
                                <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.phone', e.currentTarget.textContent)}>{data.personalInfo.phone}</span>
                                <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.location', e.currentTarget.textContent)}>{data.personalInfo.location}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column Content */}
                {pageContent.right && pageContent.right.map(item => renderSection(item.id, true, item.itemRange))}
            </div>

            {/* Main Content */}
            <div className="w-[70%] p-10 bg-white">
                <div className="border-b-4 pb-8 mb-10 transition-colors duration-300" style={{ borderColor: design.contrastColor || '#0f172a' }}>
                    {isFirstPage && (
                        <>
                            <h1
                                className="text-6xl font-black tracking-tighter mb-2 uppercase text-slate-900"
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdate('personalInfo.name', e.currentTarget.textContent)}
                            >
                                {data.personalInfo.name}
                            </h1>
                            <p
                                className="text-2xl font-bold"
                                style={{ color: design.secondaryColor || '#0d9488' }}
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdate('personalInfo.title', e.currentTarget.textContent)}
                            >
                                {data.personalInfo.title}
                            </p>
                        </>
                    )}
                </div>

                <div className="space-y-10">
                    {pageContent.left && pageContent.left.map(item => renderSection(item.id, false, item.itemRange))}
                </div>
            </div>
        </div>
    );
};

export default Tech;
