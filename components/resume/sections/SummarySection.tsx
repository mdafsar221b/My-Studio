import React from 'react';
import { DesignConfig } from '../../../types';
import { EditableSection } from '../EditableWrappers';
import { getFontSizeClass } from '../utils';

interface SummarySectionProps {
    summary: string;
    design: DesignConfig;
    isDarkBg: boolean;
    isReadOnly: boolean;
    selectedSectionId: string | null;
    selectedItemId: string | null;
    onSelectSection: (id: string) => void;
    onUpdate: (value: string) => void;
    onDelete: () => void;
    onAIRequest: (e: React.MouseEvent, type: 'summary' | 'experience', text: string) => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
    summary,
    design,
    isDarkBg,
    isReadOnly,
    selectedSectionId,
    selectedItemId,
    onSelectSection,
    onUpdate,
    onDelete,
    onAIRequest
}) => {
    return (
        <EditableSection
            id="summary"
            isSelected={selectedSectionId === 'summary'}
            onSelect={onSelectSection}
            onDelete={onDelete}
            isDarkBg={isDarkBg}
            spacingLevel={design.sectionSpacing}
            isReadOnly={isReadOnly}
            isItemActive={selectedItemId !== null}
        >
            <h3 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 border-b pb-2 ${isDarkBg ? 'text-teal-200 border-teal-800' : 'text-slate-500 border-slate-100'}`} style={{ color: !isDarkBg ? design.primaryColor : undefined }}>Summary</h3>
            <div className="relative group/summary">
                {!isReadOnly && (
                    <button
                        onClick={(e) => onAIRequest(e, 'summary', summary)}
                        className="absolute -right-8 top-0 w-6 h-6 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500 opacity-0 group-hover/summary:opacity-100 hover:scale-110 transition-all z-[50]"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </button>
                )}
                <p className={`leading-relaxed outline-none ${isDarkBg ? 'text-teal-50/80 font-light' : 'text-slate-600'} ${getFontSizeClass(design)}`} contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => onUpdate(e.currentTarget.textContent || '')}>
                    {summary}
                </p>
            </div>
        </EditableSection>
    );
};
