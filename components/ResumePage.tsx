import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, Experience, Education, CustomSection, TemplateType, DesignConfig, SkillCategory, Certification } from '../types';
import { AIAssistantPopup, TextFormattingToolbar } from './resume/Toolbars';
import { SummarySection } from './resume/sections/SummarySection';
import { ExperienceSection } from './resume/sections/ExperienceSection';
import { EducationSection } from './resume/sections/EducationSection';
import { SkillsSection } from './resume/sections/SkillsSection';
import { CertificationsSection } from './resume/sections/CertificationsSection';
import { AchievementsSection } from './resume/sections/AchievementsSection';

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

  const template = data.template || 'double-column';
  const layout = data.layout || { left: ['experience', 'education'], right: ['summary', 'certifications', 'achievements'] };
  const design = data.design || DEFAULT_DESIGN;

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
    if (newData.layout) {
      newData.layout.left = newData.layout.left.filter(id => id !== sectionId);
      newData.layout.right = newData.layout.right.filter(id => id !== sectionId);
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

    // Note: isTextSelected logic from ResumePage was: `selectionToolbarPos !== null`
    // We pass this as `isTextSelected` to sections that need it (Experience, Education).
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

  const isSidebarDark = template === 'double-column' || template === 'modern';
  const marginPx = design.margins * 20;

  const leftWeight = design.columnLayout === 1 ? 'w-[75%]' : design.columnLayout === 2 ? 'w-[65%]' : design.columnLayout === 3 ? 'w-[70%]' : 'w-[50%]';
  const rightWeight = design.columnLayout === 1 ? 'w-[25%]' : design.columnLayout === 2 ? 'w-[35%]' : design.columnLayout === 3 ? 'w-[30%]' : 'w-[50%]';

  const commonStyle = {
    fontFamily: design.fontFamily,
    lineHeight: design.lineHeight,
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex h-full min-h-[1100px] ${template === 'ivy-league' || template === 'executive' ? 'flex-col' : ''} selection:bg-[#00C3A5] selection:text-white`}
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

      {page === 1 ? (
        <>
          {(template === 'ivy-league' || template === 'executive') && (
            <div className={`text-left p-12 ${template === 'executive' ? 'bg-slate-800 text-white text-center' : 'border-b border-slate-100 text-slate-800'}`}>
              <h1 className="text-5xl font-extrabold tracking-tight mb-2 uppercase" contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => handleUpdate('personalInfo.name', e.currentTarget.textContent)}>{data.personalInfo.name}</h1>
              <p className="text-xl font-medium" style={{ color: design.primaryColor }} contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => handleUpdate('personalInfo.title', e.currentTarget.textContent)}>{data.personalInfo.title}</p>
              <div className={`mt-6 flex flex-wrap gap-6 text-sm ${template === 'executive' ? 'justify-center text-slate-400' : 'text-slate-500'}`}>
                <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => handleUpdate('personalInfo.email', e.currentTarget.textContent?.replace('✉️ ', ''))}>✉️ {data.personalInfo.email}</span>
                <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => handleUpdate('personalInfo.phone', e.currentTarget.textContent?.replace('📞 ', ''))}>📞 {data.personalInfo.phone}</span>
                <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => handleUpdate('personalInfo.location', e.currentTarget.textContent?.replace('📍 ', ''))}>📍 {data.personalInfo.location}</span>
              </div>
            </div>
          )}

          <div className={`flex flex-grow w-full ${template === 'ivy-league' || template === 'executive' ? 'p-12 gap-12' : ''}`}>
            <div
              className={`${template === 'ivy-league' || template === 'executive' ? 'w-2/3' : leftWeight + ' bg-white text-slate-800'}`}
              style={{ padding: !(template === 'ivy-league' || template === 'executive') ? `${marginPx}px` : undefined }}
            >
              {!(template === 'ivy-league' || template === 'executive') && (
                <div className="mb-14">
                  <h1 className="text-5xl font-extrabold tracking-tighter mb-2 uppercase" style={{ color: design.primaryColor }} contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => handleUpdate('personalInfo.name', e.currentTarget.textContent)}>{data.personalInfo.name}</h1>
                  <p className="text-xl font-bold tracking-tight text-slate-700 leading-none" contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => handleUpdate('personalInfo.title', e.currentTarget.textContent)}>{data.personalInfo.title}</p>
                </div>
              )}
              {layout.left.map(id => renderSectionById(id, false))}
            </div>

            <div
              className={`${template === 'ivy-league' || template === 'executive' ? 'w-1/3' : rightWeight + ' flex flex-col gap-8 ' + (isSidebarDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800')}`}
              style={{ padding: !(template === 'ivy-league' || template === 'executive') ? `${marginPx}px` : undefined }}
            >
              {layout.right.map(id => renderSectionById(id, isSidebarDark))}

              {!(template === 'ivy-league' || template === 'executive') && (
                <div className={`mt-auto pt-10 border-t ${isSidebarDark ? 'border-white/10 text-white/50' : 'border-slate-200 text-slate-400'} text-xs font-medium`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4"><span className="opacity-40 text-lg">📞</span> <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => handleUpdate('personalInfo.phone', e.currentTarget.textContent)}>{data.personalInfo.phone}</span></div>
                    <div className="flex items-center gap-4"><span className="opacity-40 text-lg">✉️</span> <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => handleUpdate('personalInfo.email', e.currentTarget.textContent)}>{data.personalInfo.email}</span></div>
                    <div className="flex items-center gap-4"><span className="opacity-40 text-lg">📍</span> <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => handleUpdate('personalInfo.location', e.currentTarget.textContent)}>{data.personalInfo.location}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="w-full p-12">
          <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.5em] mb-12 border-b border-slate-100 pb-2">Additional Content Page</p>
          <div className="flex gap-12">
            <div className={leftWeight}></div>
            <div className={`${rightWeight} ${isSidebarDark ? 'bg-slate-900' : 'bg-slate-50'} -m-12 p-12`}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePage;
