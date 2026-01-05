
import React from 'react';
import { TemplateProps } from './registry';
import ProfileImage from '../ProfileImage';

const ProfessionalHeader: React.FC<TemplateProps> = ({ data, pageContent, design, isReadOnly, isFirstPage, onUpdate, renderSection }) => {
    const marginPx = design.margins * 20;

    return (
        <div className="flex flex-col flex-grow w-full bg-white text-slate-800">
            {/* Header Background */}
            {isFirstPage && (
                <div
                    className="text-white pt-16 pb-24 px-16 relative mb-24 transition-colors duration-300"
                    style={{ background: `linear-gradient(135deg, ${design.contrastColor || '#0f172a'} 0%, ${design.primaryColor || '#1e293b'} 100%)` }}
                >
                    <div className="flex justify-between items-start">
                        <div className="max-w-[60%]">
                            <h1
                                className="text-5xl font-bold tracking-tight mb-4"
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdate('personalInfo.name', e.currentTarget.textContent)}
                            >
                                {data.personalInfo.name}
                            </h1>
                            <p
                                className="text-xl font-medium text-slate-300 tracking-wide uppercase"
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdate('personalInfo.title', e.currentTarget.textContent)}
                            >
                                {data.personalInfo.title}
                            </p>
                        </div>

                        <div className="text-right text-sm font-medium text-slate-400 space-y-1.5">
                            <div contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.email', e.currentTarget.textContent)}>{data.personalInfo.email}</div>
                            <div contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.phone', e.currentTarget.textContent)}>{data.personalInfo.phone}</div>
                            <div contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.location', e.currentTarget.textContent)}>{data.personalInfo.location}</div>
                        </div>
                    </div>

                    {/* Profile Picture Overlap */}
                    <div className="absolute -bottom-16 left-16">
                        <ProfileImage
                            image={data.personalInfo.profileImage}
                            onUpdate={(img) => onUpdate('personalInfo.profileImage', img)}
                            size={140}
                            editable={!isReadOnly}
                            className="bg-white p-1.5 rounded-full shadow-lg"
                        />
                    </div>
                </div>
            )}

            <div
                className="flex flex-grow w-full gap-12"
                style={{ padding: `0 ${marginPx}px ${marginPx}px ${marginPx}px`, marginTop: isFirstPage ? '0' : '20px' }}
            >
                <div className="flex-grow space-y-8">
                    {pageContent.left && pageContent.left.map(item => (
                        <div key={item.id}>
                            {renderSection(item.id, false, item.itemRange)}
                        </div>
                    ))}
                </div>

                <div className="w-[30%] flex-shrink-0 space-y-8 border-l border-slate-100 pl-8">
                    {pageContent.right && pageContent.right.map(item => (
                        <div key={item.id}>
                            {renderSection(item.id, false, item.itemRange)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfessionalHeader;
