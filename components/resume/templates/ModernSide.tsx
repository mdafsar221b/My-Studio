
import React from 'react';
import { TemplateProps } from './registry';
import ProfileImage from '../ProfileImage';

const ModernSide: React.FC<TemplateProps> = ({ data, pageContent, design, isReadOnly, isFirstPage, onUpdate, renderSection }) => {
    const marginPx = design.margins * 20;
    const leftWeight = 'w-[65%]';
    const rightWeight = 'w-[35%]';

    return (
        <div className="flex flex-grow w-full bg-white">
            {/* Main Content (Left) */}
            <div
                className={`${leftWeight} flex flex-col text-slate-800`}
                style={{ padding: `${marginPx}px`, paddingTop: isFirstPage ? `${marginPx + 20}px` : `${marginPx}px` }}
            >
                {isFirstPage && (
                    <div className="mb-14 border-l-4 border-slate-900 pl-6">
                        <h1
                            className="text-5xl font-extrabold tracking-tight mb-2 uppercase text-slate-900"
                            contentEditable={!isReadOnly}
                            suppressContentEditableWarning
                            onBlur={(e) => onUpdate('personalInfo.name', e.currentTarget.textContent)}
                        >
                            {data.personalInfo.name}
                        </h1>
                        <p
                            className="text-xl font-medium tracking-wide text-slate-500 uppercase"
                            contentEditable={!isReadOnly}
                            suppressContentEditableWarning
                            onBlur={(e) => onUpdate('personalInfo.title', e.currentTarget.textContent)}
                        >
                            {data.personalInfo.title}
                        </p>
                    </div>
                )}

                {pageContent.left && pageContent.left.map(item => (
                    <div key={item.id} className="mb-8 empty:mb-0">
                        {renderSection(item.id, false, item.itemRange)}
                    </div>
                ))}
            </div>

            {/* Sidebar (Right) */}
            <div
                className={`${rightWeight} flex flex-col bg-slate-900 text-white relative overflow-hidden`}
                style={{ padding: `${marginPx}px` }}
            >
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>

                {isFirstPage && (
                    <div className="flex flex-col items-center mb-10 relative z-10">
                        <ProfileImage
                            image={data.personalInfo.profileImage}
                            onUpdate={(img) => onUpdate('personalInfo.profileImage', img)}
                            size={180}
                            editable={!isReadOnly}
                            className="mb-8 border-[6px] border-slate-800 shadow-2xl rounded-2xl"
                        />

                        <div className="w-full space-y-4 text-sm font-medium text-slate-300">
                            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <span className="opacity-60">✉️</span>
                                <span className="truncate" contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.email', e.currentTarget.textContent)}>{data.personalInfo.email}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <span className="opacity-60">📞</span>
                                <span className="truncate" contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.phone', e.currentTarget.textContent)}>{data.personalInfo.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <span className="opacity-60">📍</span>
                                <span className="truncate" contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.location', e.currentTarget.textContent)}>{data.personalInfo.location}</span>
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-800 my-8"></div>
                    </div>
                )}

                <div className="space-y-8 relative z-10">
                    {pageContent.right && pageContent.right.map(item => (
                        <div key={item.id} className="[&_h3]:text-slate-400 [&_h3]:border-slate-700">
                            {renderSection(item.id, true, item.itemRange)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ModernSide;
