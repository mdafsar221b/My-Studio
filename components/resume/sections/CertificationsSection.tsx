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
            isItemActive={selectedItemId !== null}
        >
            <h3 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 border-b pb-2 ${isDarkBg ? 'text-teal-200 border-teal-800' : 'text-slate-500 border-slate-100'}`} style={{ color: !isDarkBg ? design.primaryColor : undefined }}>Certification</h3>
            <div className={`space-y-5 ${isDarkBg ? 'text-teal-50' : 'text-slate-700'} ${getFontSizeClass(design)}`}>
                {certifications.map(cert => (
                    <div key={cert.id} className="group/cert">
                        <h4
                            className="font-bold leading-tight mb-1"
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
                ))}
            </div>
        </EditableSection>
    );
};
