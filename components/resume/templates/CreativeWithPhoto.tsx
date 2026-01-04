
import React from 'react';
import { TemplateProps } from './registry';
import ProfileImage from '../ProfileImage';

const CreativeWithPhoto: React.FC<TemplateProps> = ({ data, pageContent, design, isReadOnly, isFirstPage, onUpdate, renderSection }) => {
    return (
        <div className="flex flex-col flex-grow w-full bg-[#fdfbf7] text-slate-800">
            {/* Artistic Header */}
            {isFirstPage && (
                <div className="relative p-12 pb-24 overflow-hidden">
                    {/* Abstract Shapes */}
                    <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] rounded-full bg-rose-200/50 blur-3xl"></div>
                    <div className="absolute bottom-[0%] left-[-10%] w-[300px] h-[300px] rounded-full bg-orange-100/50 blur-2xl"></div>
                    <div className="absolute top-[10%] right-[15%] w-[100px] h-[100px] rounded-full bg-yellow-200/30 blur-xl"></div>

                    <div className="relative z-10 flex gap-8 items-center">
                        <ProfileImage
                            image={data.personalInfo.profileImage}
                            onUpdate={(img) => onUpdate('personalInfo.profileImage', img)}
                            size={160}
                            editable={!isReadOnly}
                            className="shadow-2xl ring-4 ring-white/50"
                        />

                        <div className="flex flex-col items-start gap-4 flex-grow">
                            <h1
                                className="text-7xl font-black tracking-tighter mb-2 text-slate-900 leading-[0.9]"
                                style={{ fontFamily: 'serif' }} // Template-specific font override
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdate('personalInfo.name', e.currentTarget.textContent)}
                            >
                                {data.personalInfo.name.split(' ')[0]}<br />
                                <span className="text-rose-500">{data.personalInfo.name.split(' ').slice(1).join(' ')}</span>
                            </h1>
                            <p
                                className="text-xl font-medium italic text-slate-500"
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdate('personalInfo.title', e.currentTarget.textContent)}
                            >
                                {data.personalInfo.title}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {isFirstPage && (
                <div className="relative z-10 -mt-12 mx-12 bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/50 mb-12 flex justify-between items-center group hover:bg-white/80 transition-colors">
                    <div className="flex gap-8 text-sm font-bold text-slate-600">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                            <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.email', e.currentTarget.textContent)}>{data.personalInfo.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                            <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.phone', e.currentTarget.textContent)}>{data.personalInfo.phone}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.location', e.currentTarget.textContent)}>{data.personalInfo.location}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    </div>
                </div>
            )}

            <div className={`flex flex-grow px-12 pb-12 gap-12 ${!isFirstPage ? 'pt-12' : ''}`}>
                <div className="w-[60%] space-y-12">
                    {pageContent.left && pageContent.left.map(item => renderSection(item.id, false, item.itemRange))}
                </div>

                <div className="w-[40%] space-y-12">
                    {pageContent.right && pageContent.right.map(item => renderSection(item.id, false, item.itemRange))}
                </div>
            </div>
        </div>
    );
};

export default CreativeWithPhoto;
