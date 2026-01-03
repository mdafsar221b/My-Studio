import React from 'react';
import { DesignConfig } from '../../../types';
import { EditableSection } from '../EditableWrappers';
import { getFontSizeClass } from '../utils';

interface AchievementsSectionProps {
    achievements: string[];
    design: DesignConfig;
    isDarkBg: boolean;
    isReadOnly: boolean;
    selectedSectionId: string | null;
    selectedItemId: string | null;
    onSelectSection: (id: string) => void;
    onUpdate: (achievements: string[]) => void;
    onAddAchievement: () => void;
    onDeleteSection: () => void;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
    achievements,
    design,
    isDarkBg,
    isReadOnly,
    selectedSectionId,
    selectedItemId,
    onSelectSection,
    onUpdate,
    onAddAchievement,
    onDeleteSection
}) => {

    const handleUpdateItem = (index: number, value: string) => {
        const newItems = [...achievements];
        newItems[index] = value;
        onUpdate(newItems);
    };

    return (
        <EditableSection
            id="achievements"
            isSelected={selectedSectionId === 'achievements'}
            onSelect={onSelectSection}
            onAdd={onAddAchievement}
            onDelete={onDeleteSection}
            isDarkBg={isDarkBg}
            spacingLevel={design.sectionSpacing}
            isReadOnly={isReadOnly}
            isItemActive={selectedItemId !== null}
        >
            <h3 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 border-b pb-2 ${isDarkBg ? 'text-teal-200 border-teal-800' : 'text-slate-500 border-slate-100'}`} style={{ color: !isDarkBg ? design.primaryColor : undefined }}>Achievements</h3>
            <ul className={`space-y-4 ${isDarkBg ? 'text-teal-50' : 'text-slate-600'} ${getFontSizeClass(design)}`}>
                {achievements.map((ach, idx) => (
                    <li key={idx} className="text-xs flex gap-3 leading-relaxed">
                        <span className="text-xl" style={{ color: design.primaryColor }}>★</span>
                        <span
                            contentEditable={!isReadOnly}
                            suppressContentEditableWarning
                            onBlur={(e) => handleUpdateItem(idx, e.currentTarget.textContent || '')}
                        >
                            {ach}
                        </span>
                    </li>
                ))}
            </ul>
        </EditableSection>
    );
};
