
import React from 'react';
import { TemplateProps } from './registry';

const DoubleColumn: React.FC<TemplateProps> = ({ data, layout, design, isReadOnly, onUpdate, renderSection }) => {
    const marginPx = design.margins * 20;
    const leftWeight = design.columnLayout === 1 ? 'w-[75%]' : design.columnLayout === 2 ? 'w-[65%]' : design.columnLayout === 3 ? 'w-[70%]' : 'w-[50%]';
    const rightWeight = design.columnLayout === 1 ? 'w-[25%]' : design.columnLayout === 2 ? 'w-[35%]' : design.columnLayout === 3 ? 'w-[30%]' : 'w-[50%]';

    // Double Column uses Dark Sidebar
    const isSidebarDark = true;

    return (
        <div className="flex flex-grow w-full">
            {/* Main Content (Left) */}
            <div
                className={`${leftWeight} bg-white text-slate-800`}
                style={{ padding: `${marginPx}px` }}
            >
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

                {/* Render Left Column Sections */}
                {/* We support explicit pages in layout, but this component renders ONE page's worth of content passed via 'layout' prop */}
                {layout.left && layout.left.map(id => renderSection(id, false))}
            </div>

            {/* Sidebar (Right) */}
            <div
                className={`${rightWeight} flex flex-col gap-8 bg-slate-900 text-white`}
                style={{ padding: `${marginPx}px` }}
            >
                {/* Render Right Column Sections */}
                {layout.right && layout.right.map(id => renderSection(id, true))}

                {/* Footer / Contact Info */}
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
            </div>
        </div>
    );
};

export default DoubleColumn;
