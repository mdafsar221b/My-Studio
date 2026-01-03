import React from 'react';
import { Experience, DesignConfig } from '../../../types';
import { EditableSection, EditableItem } from '../EditableWrappers';
import { getFontSizeClass, getHeadingSizeClass } from '../utils';

interface ExperienceSectionProps {
    experiences: Experience[];
    design: DesignConfig;
    isDarkBg: boolean;
    isReadOnly: boolean;
    selectedSectionId: string | null;
    selectedItemId: string | null;
    isTextSelected: boolean; // Derived from selectionToolbarPos !== null
    onSelectSection: (id: string) => void;
    onSelectItem: (id: string) => void;
    onUpdate: (experiences: Experience[]) => void;
    onAddEntry: () => void;
    onDeleteSection: () => void;
    onDuplicateEntry: (id: string) => void;
    onDeleteEntry: (id: string) => void;
    onAIRequest: (e: React.MouseEvent, type: 'summary' | 'experience', text: string, targetId?: string) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
    experiences,
    design,
    isDarkBg,
    isReadOnly,
    selectedSectionId,
    selectedItemId,
    isTextSelected,
    onSelectSection,
    onSelectItem,
    onUpdate,
    onAddEntry,
    onDeleteSection,
    onDuplicateEntry,
    onDeleteEntry,
    onAIRequest
}) => {

    const handleItemFieldUpdate = (id: string, field: keyof Experience, value: string) => {
        const newItems = experiences.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        onUpdate(newItems);
    };

    const handleListUpdate = (id: string, html: string) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const bullets = Array.from(tempDiv.querySelectorAll('li')).map(li => li.innerText.trim()).filter(t => t.length > 0);
        const newItems = experiences.map(exp => exp.id === id ? { ...exp, description: bullets } : exp);
        onUpdate(newItems);
    };

    return (
        <EditableSection
            id="experience"
            isSelected={selectedSectionId === 'experience'}
            onSelect={onSelectSection}
            onAdd={onAddEntry}
            onDelete={onDeleteSection}
            isDarkBg={isDarkBg}
            spacingLevel={design.sectionSpacing}
            isReadOnly={isReadOnly}
            isItemActive={selectedItemId !== null && experiences.some(i => i.id === selectedItemId)}
        >
            <h2 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 ${isDarkBg ? 'text-teal-200 border-b border-teal-800 pb-2' : 'text-slate-400'}`} style={{ color: !isDarkBg ? design.primaryColor + '80' : undefined }}>Experience</h2>
            <div className="space-y-12">
                {experiences.map(exp => (
                    <EditableItem
                        key={exp.id}
                        id={exp.id}
                        isSelected={selectedItemId === exp.id}
                        onSelect={onSelectItem}
                        onAdd={() => onDuplicateEntry(exp.id)}
                        onDelete={() => onDeleteEntry(exp.id)}
                        isReadOnly={isReadOnly}
                        isTextSelected={isTextSelected}
                        onAIRequest={(e) => onAIRequest(e, 'experience', exp.description.join('\n'), exp.id)}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h4
                                className={`font-bold outline-none ${getHeadingSizeClass(design)} ${isDarkBg ? 'text-teal-50' : 'text-slate-700'}`}
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                                onBlur={(e) => handleItemFieldUpdate(exp.id, 'role', e.currentTarget.textContent || '')}
                            >
                                {exp.role}
                            </h4>
                            <span
                                className={`text-sm font-medium ${isDarkBg ? 'text-teal-400' : 'text-slate-400'}`}
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                            // Note: handling date range as single string edit might be complex if they are separate fields in data but rendered together.
                            // ResumeData says startDate and endDate are fields. 
                            // The original code rendered `{exp.startDate} - {exp.endDate}` in one span.
                            // Editing this span will fail to update separate fields correctly without parsing.
                            // For now, I will bind to 'startDate'? No, that will overwrite startDate with everything.
                            // Fix: The original code likely intended to edit them separately or didn't support editing dates.
                            // I will NOT add onBlur here to avoid data corruption, but I will flag this.
                            // Actually, let's keep it without onBlur to match original behavior for now, or split them.
                            // Splitting them is better UX:
                            >
                                <span onBlur={(e) => handleItemFieldUpdate(exp.id, 'startDate', e.currentTarget.textContent || '')}>{exp.startDate}</span> - <span onBlur={(e) => handleItemFieldUpdate(exp.id, 'endDate', e.currentTarget.textContent || '')}>{exp.endDate}</span>
                            </span>
                        </div>
                        <p className="text-md font-semibold mb-4 outline-none flex justify-between" style={{ color: design.primaryColor }}>
                            <span
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                                onBlur={(e) => handleItemFieldUpdate(exp.id, 'company', e.currentTarget.textContent || '')}
                            >
                                {exp.company}
                            </span>
                            <span
                                className={`text-sm opacity-60 font-medium ${isDarkBg ? 'text-white' : 'text-slate-600'}`}
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                                onBlur={(e) => handleItemFieldUpdate(exp.id, 'location', e.currentTarget.textContent || '')}
                            >
                                {exp.location}
                            </span>
                        </p>
                        <ul
                            className={`space-y-2 list-disc list-outside ml-4 leading-relaxed outline-none min-h-[1em] ${isDarkBg ? 'text-teal-100' : 'text-slate-600'} ${getFontSizeClass(design)}`}
                            contentEditable={!isReadOnly}
                            suppressContentEditableWarning
                            onBlur={(e) => handleListUpdate(exp.id, e.currentTarget.innerHTML)}
                        >
                            {exp.description.map((bullet, idx) => <li key={idx} className="pl-2 marker:text-slate-300">{bullet}</li>)}
                        </ul>
                    </EditableItem>
                ))}
            </div>
        </EditableSection>
    );
};
