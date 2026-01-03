
import React from 'react';
import { TemplateProps } from './registry';

const Creative: React.FC<TemplateProps> = ({ data, layout, design, isReadOnly, onUpdate, renderSection }) => {
    return (
        <div className="flex flex-col flex-grow w-full bg-[#fdfbf7] text-slate-800">
            {/* Artistic Header */}
            <div className="relative p-12 pb-24 overflow-hidden">
                {/* Abstract Shapes */}
                <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] rounded-full bg-rose-200/50 blur-3xl"></div>
                <div className="absolute bottom-[0%] left-[-10%] w-[300px] h-[300px] rounded-full bg-orange-100/50 blur-2xl"></div>

                <div className="relative z-10 flex flex-col items-start gap-4">
                    <h1
                        className="text-7xl font-black tracking-tighter mb-2 text-slate-900 leading-[0.9]"
                        style={{ fontFamily: 'serif' }} // Should ideally come from design config but forcing logic for template identity
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

            <div className="relative z-10 -mt-12 mx-12 bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/50 mb-12 flex justify-between items-center">
                <div className="flex gap-8 text-sm font-bold text-slate-600">
                    <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.email', e.currentTarget.textContent)}>{data.personalInfo.email}</span>
                    <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.phone', e.currentTarget.textContent)}>{data.personalInfo.phone}</span>
                </div>
                <div className="text-sm font-bold text-slate-600">
                    <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate('personalInfo.location', e.currentTarget.textContent)}>{data.personalInfo.location}</span>
                </div>
            </div>

            <div className="flex flex-grow px-12 pb-12 gap-12">
                <div className="w-[60%] space-y-12">
                    {layout.left && layout.left.map(id => renderSection(id, false))}
                </div>

                <div className="w-[40%] space-y-12">
                    {layout.right && layout.right.map(id => renderSection(id, false))}
                </div>
            </div>
        </div>
    );
};

export default Creative;
