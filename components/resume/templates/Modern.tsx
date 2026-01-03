
import React from 'react';
import { TemplateProps } from './registry';

const Modern: React.FC<TemplateProps> = ({ data, pageContent, design, isReadOnly, isFirstPage, onUpdate, renderSection }) => {
    const marginPx = design.margins * 20;
    const leftWeight = design.columnLayout === 1 ? 'w-[75%]' : design.columnLayout === 2 ? 'w-[65%]' : design.columnLayout === 3 ? 'w-[70%]' : 'w-[50%]';
    const rightWeight = design.columnLayout === 1 ? 'w-[25%]' : design.columnLayout === 2 ? 'w-[35%]' : design.columnLayout === 3 ? 'w-[30%]' : 'w-[50%]';

    const isSidebarDark = true;

    return (
        <div className="flex flex-grow w-full">
            {/* Main Content (Left) */}
            <div
                className={`${leftWeight} bg-white text-slate-800 flex flex-col`}
                style={{ padding: `${marginPx}px` }}
            >
                {isFirstPage && (
                    <div className="mb-14">
                        <h1
                            className="text-5xl font-extrabold tracking-tighter mb-2 uppercase"
                            style={{ color: design.primaryColor }}
                            contentEditable={!isReadOnly}
                            suppressContentEditableWarning
                            onBlur={(e) => onUpdate('personalInfo.name', e.currentTarget.textContent)}
                        >
                            {data.personalInfo.name}
                        </h1>
                        <p
                            className="text-xl font-bold tracking-tight text-slate-700 leading-none"
                            contentEditable={!isReadOnly}
                            suppressContentEditableWarning
                            onBlur={(e) => onUpdate('personalInfo.title', e.currentTarget.textContent)}
                        >
                            {data.personalInfo.title}
                        </p>
                    </div>
                )}

                {pageContent.left && pageContent.left.map(item => (
                    <div key={item.id}>
                        {renderSection(item.id, false, item.itemRange)}
                    </div>
                ))}
            </div>

            {/* Sidebar (Right) */}
            <div
                className={`${rightWeight} flex flex-col gap-8 bg-slate-900 text-white`}
                style={{ padding: `${marginPx}px` }}
            >
                {pageContent.right && pageContent.right.map(item => (
                    <div key={item.id}>
                        {renderSection(item.id, true, item.itemRange)}
                    </div>
                ))}

                {isFirstPage && (
                    <div className="mt-auto pt-10 border-t border-white/10 text-white/50 text-xs font-medium">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="opacity-40 text-lg">📞</span>
                                <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.phone', e.currentTarget.textContent)}>{data.personalInfo.phone}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="opacity-40 text-lg">✉️</span>
                                <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.email', e.currentTarget.textContent)}>{data.personalInfo.email}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="opacity-40 text-lg">📍</span>
                                <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.location', e.currentTarget.textContent)}>{data.personalInfo.location}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modern;
