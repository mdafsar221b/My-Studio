import React from 'react';
import { Certification, DesignConfig } from '../../../types';
import { EditableSection } from '../EditableWrappers';
import { getFontSizeClass } from '../utils';

interface CertificationsSectionProps {
    certifications: Certification[];
    design: DesignConfig;
    isDarkBg: boolean;
    isReadOnly: boolean;
    selectedSectionId: string | null;
    selectedItemId: string | null;
    onSelectSection: (id: string) => void;
    onUpdate: (certifications: Certification[]) => void;
    onAddCertification: () => void;
    onDeleteSection: () => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
    certifications,
    design,
    isDarkBg,
    isReadOnly,
    selectedSectionId,
    selectedItemId,
    onSelectSection,
    onUpdate,
    onAddCertification,
    onDeleteSection
}) => {

    const handleUpdateItem = (id: string, field: keyof Certification, value: string) => {
        const newItems = certifications.map(item => item.id === id ? { ...item, [field]: value } : item);
        onUpdate(newItems);
    };

    const handleReorder = (sourceId: string, targetId: string) => {
        const sourceIndex = certifications.findIndex(c => c.id === sourceId);
        const targetIndex = certifications.findIndex(c => c.id === targetId);

        if (sourceIndex === -1 || targetIndex === -1) return;

        const newItems = [...certifications];
        const [movedItem] = newItems.splice(sourceIndex, 1);
        newItems.splice(targetIndex, 0, movedItem);

        onUpdate(newItems);
    };

    const handleDeleteEntry = (id: string) => {
        onUpdate(certifications.filter(c => c.id !== id));
    };

    // Need an onSelectItem for Certifications if not provided?
    // Props interface says: selectedItemId: string | null. So we can select items.
    // Ideally we should have onSelectItem in props. The viewed file showed it was missing?
    // Let's check Props interface. It has onSelectSection but NO onSelectItem?
    // Ah, lines 13 & 17 of viewed file for Education had it. Certifications viewer (Step 146) line 6-17 shows NO onSelectItem.

    // WAIT. If Certifications doesn't support item selection, EditableItem might misbehave or just not show toolbar.
    // However, the user wants "Drag and Drop". EditableItem provides the drag handle in the toolbar. The toolbar only shows if `isSelected` is true.
    // So we MUST enable item selection for Certifications to show the toolbar and thus the drag handle.

    // I can't add `onSelectItem` to Props without changing the parent `ResumePage` or `Creative` template usage.
    // But check the `EditableWrapper` usage. `EditableItem` expects `onSelect`.

    // Let's look at `CertificationsSection.tsx` again. usage was:
    // {certifications.map(cert => ( <div ...> ... </div> ))}

    // To enable DnD, I basically need to upgrade this section to work like Experience/Education.
    // This is a bigger change affecting Props.

    // Strategy: Since I cannot easily change the parent `ResumePage` signature in one go without errors if I mismatch,
    // I will check if `ResumePage` passes `handleSelectItem` generally?
    // In `ResumePage.tsx` (Step 20), lines 260-267:
    // <CertificationsSection ... commonProps ... />
    // commonProps (line 202) DOES NOT include onSelectItem? No, wait.
    // line 208: onSelectSection.
    // ExperienceSection (line 225) includes `onSelectItem={handleSelectItem}`.
    // CertificationsSection (line 262) DOES NOT include `onSelectItem`.

    // OK, so to add DnD here, I MUST pass `onSelectItem` to `CertificationsSection` from `ResumePage`.

    // This is getting complicated for a "quick fix" across all sections.
    // BUT the user asked for "make it work for others too".

    // I will stick to Education for now (it has onSelectItem).
    // For Certifications and Skills and Achievements, they are currently "Simple Lists" without per-item selection status in the parent.

    // Alternative: DnD without selection?
    // `EditableItem` shows toolbar only if selected.
    // Drag handle is IN the toolbar.
    // So yes, I need selection.

    // I will update `Education` now. Then I will pause and plan the upgrade for Certs/Skills/Achievements which involves `ResumePage` updates.

    return (
        <EditableSection
            id="certifications"
            isSelected={selectedSectionId === 'certifications'}
            onSelect={onSelectSection}
            onAdd={onAddCertification}
            onDelete={onDeleteSection}
            isDarkBg={isDarkBg}
            spacingLevel={design.sectionSpacing}
            isReadOnly={isReadOnly}
            isItemActive={selectedItemId !== null && certifications.some(c => c.id === selectedItemId)}
        >
            <h3 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 border-b pb-2 ${isDarkBg ? 'text-teal-200 border-teal-800' : 'text-slate-500 border-slate-100'}`} style={{ color: !isDarkBg ? design.primaryColor : undefined }}>Certification</h3>
            <div className={`space-y-4 ${isDarkBg ? 'text-teal-50' : 'text-slate-700'} ${getFontSizeClass(design)}`}>
                {certifications.map(cert => (
                    <div key={cert.id} className="group/cert relative pl-6 transition-all hover:bg-slate-50/50 rounded-lg -ml-6 pr-2 py-1">
                        {/* 
                           Hack for now since full item selection isn't plumbed: 
                           Add a small ALWAYS VISIBLE or HOVER-VISIBLE drag handle for these simpler lists?
                           We don't want to refactor the whole app architecture right now if we can avoid it.
                           Actually, EditableWrappers has `EditableItem`.
                           
                           If I cannot use EditableItem because of missing props, I can implement a simpler localized drag behavior here?
                           
                           No, I should do it right. I will return to PLANNING to update ResumePage and these sections to support Item Selection.
                        */}
                        <div className="absolute left-0 top-1.5 text-slate-300 cursor-grab active:cursor-grabbing opacity-0 group-hover/cert:opacity-100 transition-opacity"
                            draggable
                            onDragStart={(e) => { e.dataTransfer.setData('text/plain', cert.id); e.dataTransfer.effectAllowed = 'move'; }}
                            title="Drag to reorder"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" /></svg>
                        </div>

                        <div
                            onDragOver={(e) => { e.preventDefault(); }}
                            onDrop={(e) => {
                                e.preventDefault();
                                const sourceId = e.dataTransfer.getData('text/plain');
                                if (sourceId && sourceId !== cert.id) handleReorder(sourceId, cert.id);
                            }}
                        >
                            <h4
                                className="font-bold leading-tight mb-0.5"
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                                onBlur={(e) => handleUpdateItem(cert.id, 'name', e.currentTarget.textContent || '')}
                            >
                                {cert.name}
                            </h4>
                            <p
                                className="text-xs opacity-70 italic"
                                contentEditable={!isReadOnly}
                                suppressContentEditableWarning
                                onBlur={(e) => handleUpdateItem(cert.id, 'issuer', e.currentTarget.textContent || '')}
                            >
                                {cert.issuer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </EditableSection>
    );
};
