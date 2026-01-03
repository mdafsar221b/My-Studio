
import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, Experience, Education, CustomSection, TemplateType, DesignConfig, SkillCategory, Certification } from '../types';
import { AIAssistantPopup, TextFormattingToolbar } from './resume/Toolbars';
import { SummarySection } from './resume/sections/SummarySection';
import { ExperienceSection } from './resume/sections/ExperienceSection';
import { EducationSection } from './resume/sections/EducationSection';
import { SkillsSection } from './resume/sections/SkillsSection';
import { CertificationsSection } from './resume/sections/CertificationsSection';
import { AchievementsSection } from './resume/sections/AchievementsSection';
import { getTemplate } from './resume/templates/registry';

interface Props {
  page: number;
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  isReadOnly?: boolean;
}

const DEFAULT_DESIGN: DesignConfig = {
  margins: 2,
  sectionSpacing: 3,
  primaryColor: '#00C3A5',
  fontFamily: 'Inter',
  fontSize: 'normal',
  lineHeight: 1.5,
  columnLayout: 2
};

const ResumePage: React.FC<Props> = ({ page, data, onChange, isReadOnly = false }) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectionToolbarPos, setSelectionToolbarPos] = useState<{ top: number; left: number } | null>(null);
  const [aiPopup, setAiPopup] = useState<{ type: 'summary' | 'experience', text: string, pos: { top: number, left: number }, targetId?: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const design = data.design || DEFAULT_DESIGN;

  // Resolve Template
  const templateId = data.template || 'double-column';
  const TemplateMeta = getTemplate(templateId) || getTemplate('double-column');
  const TemplateComponent = TemplateMeta?.component;

  // Page Logic
  const pageInd = page - 1;
  const layout = data.layout?.pages
    ? (data.layout.pages[pageInd] || { left: [], right: [] })
    : (page === 1 ? (data.layout || { left: ['experience', 'education'], right: ['summary', 'certifications', 'achievements'] }) : { left: [], right: [] });

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || isReadOnly || !containerRef.current) {
        setSelectionToolbarPos(null);
        return;
      }
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const scale = containerRect.width / containerRef.current.offsetWidth || 1;
      setSelectionToolbarPos({
        top: (rect.top - containerRect.top) / scale,
        left: (rect.left + (rect.width / 2) - containerRect.left) / scale
      });
    };
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [isReadOnly]);

  const handleSelectSection = (id: string) => {
    setSelectedSectionId(id);
    setSelectedItemId(null);
  };

  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
  };

  const handleUpdate = (field: string, value: any) => {
    if (isReadOnly) return;
    const newData = structuredClone(data);
    const parts = field.split('.');
    let current: any = newData;
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    onChange(newData);
  };

  const handleRemoveSection = (sectionId: string) => {
    const newData = structuredClone(data);
    if (newData.layout?.pages) {
      newData.layout.pages = newData.layout.pages.map(p => ({
        left: p.left.filter(id => id !== sectionId),
        right: p.right.filter(id => id !== sectionId)
      }));
    } else if (newData.layout) {
      newData.layout.left = (newData.layout.left || []).filter(id => id !== sectionId);
      newData.layout.right = (newData.layout.right || []).filter(id => id !== sectionId);
    }
    onChange(newData);
    setSelectedSectionId(null);
  };

  const handleAIRequest = (e: React.MouseEvent, type: 'summary' | 'experience', text: string, targetId?: string) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current!.getBoundingClientRect();
    const scale = containerRect.width / containerRef.current!.offsetWidth || 1;
    setAiPopup({
      type,
      text,
      pos: {
        top: (rect.top - containerRect.top) / scale + rect.height,
        left: (rect.left - containerRect.left) / scale
      },
      targetId
    });
  };

  const handleAIApply = (newText: string) => {
    if (!aiPopup) return;
    if (aiPopup.type === 'summary') {
      handleUpdate('summary', newText);
    } else if (aiPopup.type === 'experience' && aiPopup.targetId) {
      const expIdx = data.experience.findIndex(e => e.id === aiPopup.targetId);
      if (expIdx > -1) {
        const lines = newText.split('\n').filter(l => l.trim().length > 0).map(l => l.replace(/^[•*-]\s*/, ''));
        const newExperience = [...data.experience];
        newExperience[expIdx] = { ...newExperience[expIdx], description: lines };
        handleUpdate('experience', newExperience);
      }
    }
    setAiPopup(null);
  };

  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: 'Company Name',
      role: 'Role Title',
      location: 'City, Country',
      startDate: 'Start Date',
      endDate: 'End Date',
      description: ['Accomplished X using Y resulting in Z.']
    };
    handleUpdate('experience', [newExp, ...data.experience]);
  };

  const handleDuplicateExperience = (id: string) => {
    const index = data.experience.findIndex(e => e.id === id);
    if (index === -1) return;
    const item = { ...data.experience[index], id: `exp-${Date.now()}` };
    const newList = [...data.experience];
    newList.splice(index + 1, 0, item);
    handleUpdate('experience', newList);
  };

  const handleDeleteExperience = (id: string) => {
    handleUpdate('experience', data.experience.filter(e => e.id !== id));
    setSelectedItemId(null);
  };

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: 'University Name',
      degree: 'Degree',
      field: 'Field of Study',
      startDate: 'Start Date',
      endDate: 'End Date'
    };
    handleUpdate('education', [newEdu, ...data.education]);
  };

  const handleDeleteEducation = (id: string) => {
    handleUpdate('education', data.education.filter(e => e.id !== id));
    setSelectedItemId(null);
  };

  const handleAddSkillCategory = () => {
    const newCat: SkillCategory = {
      id: `skill-${Date.now()}`,
      name: 'New Category',
      skills: ['Skill 1', 'Skill 2']
    };
    handleUpdate('skills', [...data.skills, newCat]);
  };

  const handleAddCertification = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: 'Certification Name',
      issuer: 'Issuer Name'
    };
    handleUpdate('certifications', [...data.certifications, newCert]);
  };

  const handleAddAchievement = () => {
    handleUpdate('achievements', ['New achievement or key milestone.', ...data.achievements]);
  };

  const renderSectionById = (id: string, isDarkBg: boolean) => {
    const commonProps = {
      design,
      isDarkBg,
      isReadOnly,
      selectedSectionId,
      selectedItemId,
      onSelectSection: handleSelectSection,
      onDeleteSection: () => handleRemoveSection(id),
    };
    const isTextSelected = selectionToolbarPos !== null;

    switch (id) {
      case 'summary':
        return (
          <SummarySection
            {...commonProps}
            summary={data.summary}
            onUpdate={(val) => handleUpdate('summary', val)}
            onAIRequest={handleAIRequest}
          />
        );
      case 'experience':
        return (
          <ExperienceSection
            {...commonProps}
            experiences={data.experience}
            isTextSelected={isTextSelected}
            onSelectItem={handleSelectItem}
            onUpdate={(val) => handleUpdate('experience', val)}
            onAddEntry={handleAddExperience}
            onDuplicateEntry={handleDuplicateExperience}
            onDeleteEntry={handleDeleteExperience}
            onAIRequest={handleAIRequest}
          />
        );
      case 'education':
        return (
          <EducationSection
            {...commonProps}
            education={data.education}
            isTextSelected={isTextSelected}
            onSelectItem={handleSelectItem}
            onUpdate={(val) => handleUpdate('education', val)}
            onAddEntry={handleAddEducation}
            onDeleteEntry={handleDeleteEducation}
          />
        );
      case 'skills':
        return (
          <SkillsSection
            {...commonProps}
            skills={data.skills}
            onUpdate={(val) => handleUpdate('skills', val)}
            onAddCategory={handleAddSkillCategory}
          />
        );
      case 'certifications':
        return (
          <CertificationsSection
            {...commonProps}
            certifications={data.certifications}
            onUpdate={(val) => handleUpdate('certifications', val)}
            onAddCertification={handleAddCertification}
          />
        );
      case 'achievements':
        return (
          <AchievementsSection
            {...commonProps}
            achievements={data.achievements}
            onUpdate={(val) => handleUpdate('achievements', val)}
            onAddAchievement={handleAddAchievement}
          />
        );
      default:
        return null;
    }
  };

  const commonStyle = {
    fontFamily: design.fontFamily,
    lineHeight: design.lineHeight,
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex h-[1123px] w-[794px] overflow-hidden selection:bg-[#00C3A5] selection:text-white`}
      style={commonStyle}
      onClick={() => { if (!isReadOnly) { setSelectedSectionId(null); setSelectedItemId(null); setAiPopup(null); } }}
    >
      {selectionToolbarPos && <TextFormattingToolbar position={selectionToolbarPos} />}

      {aiPopup && (
        <AIAssistantPopup
          type={aiPopup.type}
          contextText={aiPopup.text}
          onApply={handleAIApply}
          onClose={() => setAiPopup(null)}
          position={aiPopup.pos}
        />
      )}

      {TemplateComponent ? (
        <TemplateComponent
          data={data}
          layout={layout}
          design={design}
          isReadOnly={isReadOnly}
          onUpdate={handleUpdate}
          renderSection={renderSectionById}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-slate-400">Template not found</div>
      )}
    </div>
  );
};

export default ResumePage;
