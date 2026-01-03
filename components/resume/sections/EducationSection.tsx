import React from 'react';
import { Education, DesignConfig } from '../../../types';
import { EditableSection, EditableItem } from '../EditableWrappers';
import { getHeadingSizeClass } from '../utils';

interface Props {
    education: Education[];
    itemRange?: [number, number];
    design: DesignConfig;
    // ... (rest same, omit to match context if needed but I will replace the whole block I viewed earlier to be safe)
    isDarkBg: boolean;
    isReadOnly: boolean;
    selectedSectionId: string | null;
    selectedItemId: string | null;
    isTextSelected: boolean;
    onSelectSection: (id: string) => void;
    onSelectItem: (id: string) => void;
    onUpdate: (education: Education[]) => void;
    onAddEntry: () => void;
    onDeleteSection: () => void;
    onDeleteEntry: (id: string) => void;
}

export const EducationSection: React.FC<Props> = ({
    education,
    itemRange,
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
    onDeleteEntry
}) => {

    const displayEducation = itemRange
        ? education.slice(itemRange[0], itemRange[1])
        : education;

    const handleItemFieldUpdate = (id: string, field: keyof Education, value: string) => {
        const newItems = education.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        onUpdate(newItems);
    };

    return (
        <EditableSection
            id="education"
            isSelected={selectedSectionId === 'education'}
            onSelect={onSelectSection}
            onAdd={onAddEntry}
            onDelete={onDeleteSection}
            isDarkBg={isDarkBg}
            spacingLevel={design.sectionSpacing}
            isReadOnly={isReadOnly}
            isItemActive={selectedItemId !== null && education.some(i => i.id === selectedItemId)}
        >
            <h2 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 ${isDarkBg ? 'text-teal-200 border-b border-teal-800 pb-2' : 'text-slate-400'}`} style={{ color: !isDarkBg ? design.primaryColor + '80' : undefined }}>Education</h2>
            <div className="space-y-10">
                {displayEducation.map(edu => (
                    <EditableItem
                        key={edu.id}
                        id={edu.id}
                        isSelected={selectedItemId === edu.id}
                        onSelect={onSelectItem}
                        onDelete={() => onDeleteEntry(edu.id)}
                        isReadOnly={isReadOnly}
                        isTextSelected={isTextSelected}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4
                                    className={`font-bold outline-none ${getHeadingSizeClass(design)} ${isDarkBg ? 'text-teal-50' : 'text-slate-700'}`}
                                    contentEditable={!isReadOnly}
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleItemFieldUpdate(edu.id, 'degree', e.currentTarget.textContent || '')}
                                >
                                    {edu.degree}
                                </h4>
                                <p
                                    className="text-sm font-semibold"
                                    style={{ color: design.primaryColor }}
                                    contentEditable={!isReadOnly}
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleItemFieldUpdate(edu.id, 'institution', e.currentTarget.textContent || '')}
                                >
                                    {edu.institution}
                                </p>
                            </div>
                            <p className={`text-sm font-medium ${isDarkBg ? 'text-teal-400' : 'text-slate-400'}`} contentEditable={!isReadOnly} suppressContentEditableWarning>
                                <span onBlur={(e) => handleItemFieldUpdate(edu.id, 'startDate', e.currentTarget.textContent || '')}>{edu.startDate}</span> - <span onBlur={(e) => handleItemFieldUpdate(edu.id, 'endDate', e.currentTarget.textContent || '')}>{edu.endDate}</span>
                            </p>
                        </div>
                    </EditableItem>
                ))}
            </div>
        </EditableSection>
    );
};
