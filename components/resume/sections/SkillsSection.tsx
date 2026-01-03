import React from 'react';
import { SkillCategory, DesignConfig } from '../../../types';
import { EditableSection } from '../EditableWrappers';

interface SkillsSectionProps {
    skills: SkillCategory[];
    design: DesignConfig;
    isDarkBg: boolean;
    isReadOnly: boolean;
    selectedSectionId: string | null;
    selectedItemId: string | null;
    onSelectSection: (id: string) => void;
    onUpdate: (skills: SkillCategory[]) => void;
    onAddCategory: () => void;
    onDeleteSection: () => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
    skills,
    design,
    isDarkBg,
    isReadOnly,
    selectedSectionId,
    selectedItemId,
    onSelectSection,
    onUpdate,
    onAddCategory,
    onDeleteSection
}) => {

    const handleCategoryNameUpdate = (index: number, newName: string) => {
        const newSkills = [...skills];
        newSkills[index] = { ...newSkills[index], name: newName };
        onUpdate(newSkills);
    };

    // Note: Individual skills editing is tricky because they are rendered as spans.
    // The original code rendered them in a flex wrap, but didn't have specific handlers provided in the view_file.
    // Assuming we want to edit them. 
    // However, mapping back from a flat list of spans to an array of strings is hard if we don't know which index is which easily in DOM (React key helps).
    // A cleaner way for skills might be needed, but sticking to structure:
    // Render each skill as a span contentEditable.

    const handleSkillUpdate = (catIndex: number, skillIndex: number, newValue: string) => {
        const newSkills = [...skills];
        const updatedCategorySkills = [...newSkills[catIndex].skills];
        updatedCategorySkills[skillIndex] = newValue;
        newSkills[catIndex] = { ...newSkills[catIndex], skills: updatedCategorySkills };
        onUpdate(newSkills);
    };

    return (
        <EditableSection
            id="skills"
            isSelected={selectedSectionId === 'skills'}
            onSelect={onSelectSection}
            onAdd={onAddCategory}
            onDelete={onDeleteSection}
            isDarkBg={isDarkBg}
            spacingLevel={design.sectionSpacing}
            isReadOnly={isReadOnly}
            isItemActive={selectedItemId !== null}
        >
            <h3 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 border-b pb-2 ${isDarkBg ? 'text-teal-200 border-teal-800' : 'text-slate-500 border-slate-100'}`} style={{ color: !isDarkBg ? design.primaryColor : undefined }}>Skills</h3>
            <div className="space-y-6">
                {skills.map((cat, idx) => (
                    <div key={cat.id || idx}>
                        <h4
                            className={`text-[10px] font-bold tracking-widest uppercase mb-3 ${isDarkBg ? 'text-teal-400' : 'text-slate-400'}`}
                            contentEditable={!isReadOnly}
                            suppressContentEditableWarning
                            onBlur={(e) => handleCategoryNameUpdate(idx, e.currentTarget.textContent || '')}
                        >
                            {cat.name}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {cat.skills.map((skill, skillIdx) => (
                                <span
                                    key={skillIdx} // Index key as skill string might be duplicate or editable
                                    className={`px-3 py-1 rounded-full text-[11px] border font-medium ${isDarkBg ? 'bg-white/10 text-teal-50 border-white/5' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                                    contentEditable={!isReadOnly}
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleSkillUpdate(idx, skillIdx, e.currentTarget.textContent || '')}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </EditableSection>
    );
};
