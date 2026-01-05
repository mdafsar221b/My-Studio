
import React from 'react';
import { CustomSection, DesignConfig } from '../../../types';
import { EditableSection, EditableItem } from '../EditableWrappers';
import { Plus } from 'lucide-react';

interface GenericSectionProps {
    section: CustomSection;
    design: DesignConfig;
    isDarkBg: boolean;
    isReadOnly?: boolean;
    selectedSectionId: string | null;
    selectedItemId: string | null;
    onSelectSection: (id: string) => void;
    onSelectItem: (id: string) => void;
    onUpdate: (updatedSection: CustomSection) => void;
    onDeleteSection: () => void;
    itemRange?: [number, number];
}

export const GenericSection: React.FC<GenericSectionProps> = ({
    section,
    design,
    isDarkBg,
    isReadOnly = false,
    selectedSectionId,
    selectedItemId,
    onSelectSection,
    onSelectItem,
    onUpdate,
    onDeleteSection,
    itemRange
}) => {
    const isSelected = selectedSectionId === section.id;
    const itemsToShow = itemRange ? section.items.slice(itemRange[0], itemRange[1]) : section.items;
    const startIndex = itemRange ? itemRange[0] : 0;

    const handleUpdateItem = (index: number, field: string, value: any) => {
        const newItems = [...section.items];
        newItems[index] = { ...newItems[index], [field]: value };
        onUpdate({ ...section, items: newItems });
    };

    const handleListUpdate = (index: number, html: string) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const bullets = Array.from(tempDiv.querySelectorAll('li')).map(li => li.innerText.trim()).filter(t => t.length > 0);
        handleUpdateItem(index, 'description', bullets);
    };

    const handleAddItem = () => {
        let newItem = {};
        if (section.type === 'expertise') {
            newItem = { label: 'New Skill', value: 50 };
        } else if (section.type === 'projects' || section.type === 'volunteering') {
            newItem = { title: 'New Item', date: '2024', description: ['Description'] };
        } else {
            newItem = { label: 'New Item', description: 'Description' };
        }
        onUpdate({ ...section, items: [newItem, ...section.items] });
    };

    const handleDeleteItem = (index: number) => {
        const newItems = section.items.filter((_, i) => i !== index);
        onUpdate({ ...section, items: newItems });
    };

    return (
        <EditableSection
            id={section.id}
            isSelected={isSelected}
            onSelect={onSelectSection}
            onAdd={handleAddItem}
            onDelete={onDeleteSection}
            isDarkBg={isDarkBg}
            spacingLevel={design.sectionSpacing}
            isReadOnly={isReadOnly}
            isItemActive={selectedItemId !== null && selectedItemId.startsWith(section.id)}
        >
            <h2 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 ${isDarkBg ? 'text-teal-200 border-b border-teal-800 pb-2' : 'text-slate-400'}`} style={{ color: !isDarkBg ? design.primaryColor + '80' : undefined }}>
                {section.title}
            </h2>

            <div className="space-y-6">
                {itemsToShow.map((item, idx) => {
                    const realIndex = startIndex + idx;
                    const itemId = `${section.id}-${realIndex}`;

                    return (
                        <EditableItem
                            key={idx}
                            id={itemId}
                            isSelected={selectedItemId === itemId}
                            onSelect={onSelectItem}
                            onDelete={() => handleDeleteItem(realIndex)}
                            isReadOnly={isReadOnly}
                        >
                            {(section.type === 'projects' || section.type === 'volunteering' || section.type === 'custom') && (
                                <div className="space-y-1">
                                    <div className="flex justify-between items-baseline">
                                        <h3
                                            className={`text-lg font-bold outline-none ${isDarkBg ? 'text-white' : 'text-slate-800'}`}
                                            contentEditable={!isReadOnly}
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleUpdateItem(realIndex, 'title', e.currentTarget.textContent)}
                                        >
                                            {item.title || 'Untitled'}
                                        </h3>
                                        <span
                                            className={`text-sm font-medium whitespace-nowrap ml-4 outline-none ${isDarkBg ? 'text-white/60' : 'text-slate-500'}`}
                                            contentEditable={!isReadOnly}
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleUpdateItem(realIndex, 'date', e.currentTarget.textContent)}
                                        >
                                            {item.date}
                                        </span>
                                    </div>
                                    {item.subtitle && (
                                        <div
                                            className="text-sm font-medium opacity-90 mb-1 outline-none"
                                            contentEditable={!isReadOnly}
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleUpdateItem(realIndex, 'subtitle', e.currentTarget.textContent)}
                                        >
                                            {item.subtitle}
                                        </div>
                                    )}
                                    {Array.isArray(item.description) ? (
                                        <ul
                                            className={`space-y-1 list-disc list-outside ml-4 outline-none ${isDarkBg ? 'text-white/80' : 'text-slate-600'}`}
                                            contentEditable={!isReadOnly}
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleListUpdate(realIndex, e.currentTarget.innerHTML)}
                                        >
                                            {item.description.map((bullet: string, i: number) => (
                                                <li key={i} className="pl-1">{bullet}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p
                                            className={`text-sm leading-relaxed outline-none ${isDarkBg ? 'text-white/80' : 'text-slate-600'}`}
                                            contentEditable={!isReadOnly}
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleUpdateItem(realIndex, 'description', e.currentTarget.textContent)}
                                        >
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {section.type === 'expertise' && (
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex-grow font-medium outline-none ${isDarkBg ? 'text-white' : 'text-slate-700'}`}
                                        contentEditable={!isReadOnly}
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleUpdateItem(realIndex, 'label', e.currentTarget.textContent)}
                                    >
                                        {item.label}
                                    </div>
                                    <div className="w-[100px] h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-current opacity-80"
                                            style={{ width: `${item.value}%`, backgroundColor: design.primaryColor }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {section.type === 'strengths' && (
                                <div>
                                    <h4
                                        className={`font-bold mb-1 outline-none ${isDarkBg ? 'text-white' : 'text-slate-800'}`}
                                        contentEditable={!isReadOnly}
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleUpdateItem(realIndex, 'label', e.currentTarget.textContent)}
                                    >
                                        {item.label}
                                    </h4>
                                    <p
                                        className={`text-sm opacity-80 leading-relaxed outline-none ${isDarkBg ? 'text-white/70' : 'text-slate-600'}`}
                                        contentEditable={!isReadOnly}
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleUpdateItem(realIndex, 'description', e.currentTarget.textContent)}
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            )}
                        </EditableItem>
                    );
                })}
            </div>
        </EditableSection>
    );
};
