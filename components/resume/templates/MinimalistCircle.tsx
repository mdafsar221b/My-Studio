
import React from 'react';
import { TemplateProps } from './registry';
import ProfileImage from '../ProfileImage';

const MinimalistCircle: React.FC<TemplateProps> = ({ data, pageContent, design, isReadOnly, isFirstPage, onUpdate, renderSection }) => {
    const marginPx = design.margins * 20;

    return (
        <div className="flex flex-col flex-grow w-full bg-white text-slate-800">
            {/* Header */}
            {isFirstPage && (
                <div className="pt-16 pb-12 flex flex-col items-center justify-center border-b border-gray-100">
                    <ProfileImage
                        image={data.personalInfo.profileImage}
                        onUpdate={(img) => onUpdate('personalInfo.profileImage', img)}
                        size={140}
                        editable={!isReadOnly}
                        className="mb-8"
                    />

                    <h1
                        className="text-4xl font-light tracking-widest uppercase mb-3 text-slate-900 text-center"
                        contentEditable={!isReadOnly}
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdate('personalInfo.name', e.currentTarget.textContent)}
                    >
                        {data.personalInfo.name}
                    </h1>
                    <p
                        className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase mb-8 text-center"
                        contentEditable={!isReadOnly}
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdate('personalInfo.title', e.currentTarget.textContent)}
                    >
                        {data.personalInfo.title}
                    </p>

                    <div className="flex items-center gap-6 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.email', e.currentTarget.textContent)}>{data.personalInfo.email}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.phone', e.currentTarget.textContent)}>{data.personalInfo.phone}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.location', e.currentTarget.textContent)}>{data.personalInfo.location}</span>
                    </div>
                </div>
            )}

            <div
                className="flex flex-grow w-full gap-16"
                style={{ padding: `${marginPx}px` }}
            >
                {/* 2-Column Grid Layout for Content */}
                <div className="w-[60%] flex flex-col gap-10">
                    {pageContent.left && pageContent.left.map(item => (
                        <div key={item.id}>
                            {renderSection(item.id, false, item.itemRange)}
                        </div>
                    ))}
                </div>

                <div className="w-[40%] flex flex-col gap-10 pt-2">
                    {pageContent.right && pageContent.right.map(item => (
                        <div key={item.id} className="[&_h3]:text-sm [&_h3]:tracking-widest [&_h3]:uppercase [&_h3]:font-bold [&_h3]:border-b [&_h3]:border-slate-200 [&_h3]:pb-2 [&_h3]:mb-4">
                            {renderSection(item.id, false, item.itemRange)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MinimalistCircle;
