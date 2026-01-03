
import React from 'react';
import { TemplateProps } from './registry';

const IvyLeague: React.FC<TemplateProps> = ({ data, pageContent, design, isReadOnly, isFirstPage, onUpdate, renderSection }) => {
    // Ivy League is Single Column (mostly), distinct header

    return (
        <div className="flex flex-col flex-grow w-full bg-white text-slate-800">
            {/* Header */}

            {isFirstPage && (
                <div className="text-left p-12 border-b border-slate-100">
                    <h1
                        className="text-5xl font-extrabold tracking-tight mb-2 uppercase text-slate-900"
                        contentEditable={!isReadOnly}
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdate('personalInfo.name', e.currentTarget.textContent)}
                    >
                        {data.personalInfo.name}
                    </h1>
                    <p
                        className="text-xl font-medium"
                        style={{ color: design.primaryColor }}
                        contentEditable={!isReadOnly}
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdate('personalInfo.title', e.currentTarget.textContent)}
                    >
                        {data.personalInfo.title}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500">
                        <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.email', e.currentTarget.textContent?.replace('✉️ ', ''))}>✉️ {data.personalInfo.email}</span>
                        <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.phone', e.currentTarget.textContent?.replace('📞 ', ''))}>📞 {data.personalInfo.phone}</span>
                        <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.location', e.currentTarget.textContent?.replace('📍 ', ''))}>📍 {data.personalInfo.location}</span>
                    </div>
                </div>
            )}

            <div className="flex flex-grow w-full p-12 gap-12">
                {/* Main Content Area - Split 2/3 - 1/3 as per original implementation */}
                <div className="w-2/3">
                    {pageContent.left && pageContent.left.map(item => renderSection(item.id, false, item.itemRange))}
                </div>

                <div className="w-1/3 flex flex-col gap-8">
                    {pageContent.right && pageContent.right.map(item => renderSection(item.id, false, item.itemRange))}
                </div>
            </div>
        </div>
    );
};

export default IvyLeague;
