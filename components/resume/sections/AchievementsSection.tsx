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

    const handleReorder = (sourceIdx: number, targetIdx: number) => {
        if (sourceIdx === targetIdx) return;
        const newItems = [...achievements];
        const [movedItem] = newItems.splice(sourceIdx, 1);
        newItems.splice(targetIdx, 0, movedItem);
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
                    <li key={idx} className="group/item relative pl-6 -ml-6 pr-2 py-1 rounded-lg hover:bg-slate-50/50 transition-colors flex gap-3 leading-relaxed">

                        {/* Drag Handle */}
                        <div className="absolute left-0 top-1 text-slate-300 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity"
                            draggable
                            onDragStart={(e) => { e.dataTransfer.setData('text/plain', idx.toString()); e.dataTransfer.effectAllowed = 'move'; }}
                            title="Drag to reorder"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" /></svg>
                        </div>

                        <span className="text-xl" style={{ color: design.primaryColor }}>★</span>

                        <div className="flex-grow"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const sourceIdx = parseInt(e.dataTransfer.getData('text/plain'));
                                if (!isNaN(sourceIdx) && sourceIdx !== idx) handleReorder(sourceIdx, idx);
                            }}
                        >
                            <span
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                                onBlur={(e) => handleUpdateItem(idx, e.currentTarget.textContent || '')}
                                className="block w-full outline-none"
                            >
                                {ach}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </EditableSection>
    );
};
