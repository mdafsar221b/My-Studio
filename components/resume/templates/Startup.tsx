
import React from 'react';
import { TemplateProps } from './registry';

const Startup: React.FC<TemplateProps> = ({ data, pageContent, design, isReadOnly, isFirstPage, onUpdate, renderSection }) => {
    return (
        <div className="flex flex-col flex-grow w-full bg-white text-slate-900 selection:bg-black selection:text-white">
            {/* Heavy Header */}
            {isFirstPage && (
                <div className="bg-black text-white p-14 pb-20 clip-path-slant">
                    {/* Header Branding */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1
                                className="text-5xl font-bold tracking-tight mb-2"
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdate('personalInfo.name', e.currentTarget.textContent)}
                            >
                                {data.personalInfo.name}
                            </h1>
                            <div className="h-1 w-20 bg-lime-400 mt-2 mb-4"></div>
                            <p
                                className="text-lg font-medium text-slate-300"
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdate('personalInfo.title', e.currentTarget.textContent)}
                            >
                                {data.personalInfo.title}
                            </p>
                        </div>
                        <div className="text-right text-sm font-mono text-slate-400 space-y-1">
                            <div contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.email', e.currentTarget.textContent)}>{data.personalInfo.email}</div>
                            <div contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.phone', e.currentTarget.textContent)}>{data.personalInfo.phone}</div>
                            <div className="text-lime-400" contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.location', e.currentTarget.textContent)}>{data.personalInfo.location}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-grow px-14 py-12 gap-16 -mt-8">
                <div className="w-[65%] bg-white rounded-t-3xl pt-8 space-y-10">
                    {pageContent.left && pageContent.left.map(item => renderSection(item.id, false, item.itemRange))}
                </div>

                <div className="w-[35%] pt-8 space-y-10 border-l border-dashed border-slate-200 pl-10">
                    {pageContent.right && pageContent.right.map(item => renderSection(item.id, false, item.itemRange))}
                </div>
            </div>
        </div>
    );
};

export default Startup;
