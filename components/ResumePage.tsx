
import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, Experience, Education, CustomSection, TemplateType, DesignConfig, SkillCategory, Certification } from '../types';
import { improveWriting, recruiterReview, generateTailoredSummary, customAIRequest } from '../geminiService';

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

// --- Sub-components for Toolbars ---

const AIAssistantPopup: React.FC<{ 
  type: 'summary' | 'experience';
  contextText: string;
  onApply: (newText: string) => void;
  onClose: () => void;
  position: { top: number; left: number };
}> = ({ type, contextText, onApply, onClose, position }) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleAction = async (action: () => Promise<string>, isFeedback = false) => {
    setLoading(true);
    setFeedback(null);
    try {
      const result = await action();
      if (isFeedback) {
        setFeedback(result);
      } else {
        onApply(result);
        onClose();
      }
    } catch (e) {
      console.error(e);
      setFeedback("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed z-[300] w-[280px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 p-4 animate-in fade-in zoom-in-95 duration-200"
      style={{ top: position.top, left: position.left }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
          <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">AI Assistant</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </div>

      <div className="space-y-1">
        {type === 'summary' && (
          <button 
            disabled={loading}
            onClick={() => handleAction(() => generateTailoredSummary(contextText))}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <span className="text-lg opacity-60 group-hover:opacity-100 group-hover:text-teal-600 group-hover:scale-110 transition-all">✨</span>
            <span className="text-sm font-medium text-slate-700">Generate Tailored Summary</span>
          </button>
        )}
        
        <button 
          disabled={loading}
          onClick={() => handleAction(() => improveWriting(contextText))}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
        >
          <span className="text-lg opacity-60 group-hover:opacity-100 group-hover:text-teal-600 group-hover:scale-110 transition-all">✎</span>
          <span className="text-sm font-medium text-slate-700">Improve Writing</span>
        </button>

        {type === 'experience' && (
          <button 
            disabled={loading}
            onClick={() => handleAction(() => recruiterReview(contextText), true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <span className="text-lg opacity-60 group-hover:opacity-100 group-hover:text-teal-600 group-hover:scale-110 transition-all">☺</span>
            <span className="text-sm font-medium text-slate-700">Recruiter Review</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="mt-3 p-3 bg-indigo-50/50 rounded-xl text-xs text-indigo-700 leading-relaxed border border-indigo-100/50 animate-in slide-in-from-top-2">
          {feedback}
        </div>
      )}

      <div className="relative flex items-center gap-3 my-4">
        <div className="flex-grow h-px bg-slate-100"></div>
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">or</span>
        <div className="flex-grow h-px bg-slate-100"></div>
      </div>

      <div className="relative group">
        <textarea 
          placeholder="Enter a custom request"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAction(() => customAIRequest(customPrompt, contextText));
            }
          }}
          className="w-full border border-slate-100 rounded-xl p-3 text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/5 transition-all min-h-[80px] resize-none"
        />
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const SectionToolbar: React.FC<{ onAdd?: () => void; onDelete?: () => void }> = ({ onAdd, onDelete }) => (
  <div className="absolute -top-12 left-0 flex items-center gap-1 bg-white shadow-xl border border-slate-200 rounded-lg p-1 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200">
    <button 
      onClick={(e) => { e.stopPropagation(); onAdd?.(); }} 
      className="bg-[#00C3A5] text-white px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-1 hover:bg-[#00a88e] transition-colors"
      title="Add a new entry to this section"
    >
      <span className="text-lg">+</span> Entry
    </button>
    <div className="w-px h-6 bg-slate-200 mx-1"></div>
    <button 
      onClick={(e) => { e.stopPropagation(); onDelete?.(); }} 
      className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors"
      title="Remove this section from layout"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
    </button>
  </div>
);

const ItemToolbar: React.FC<{ onAdd?: () => void; onDelete?: () => void }> = ({ onAdd, onDelete }) => (
  <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white shadow-2xl border border-slate-200 rounded-xl p-1.5 z-[110] animate-in fade-in slide-in-from-bottom-4 duration-200 ring-4 ring-black/5">
    <button 
      onClick={(e) => { e.stopPropagation(); onAdd?.(); }} 
      className="bg-[#2ECB8F] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#27b37d] transition-all"
      title="Duplicate this entry"
    >
      <span className="text-xl leading-none">+</span> <span>Duplicate</span>
    </button>
    <div className="w-px h-6 bg-slate-100 mx-1"></div>
    <button 
      onClick={(e) => { e.stopPropagation(); onDelete?.(); }} 
      className="p-2.5 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all" 
      title="Delete this entry"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
    </button>
  </div>
);

const TextFormattingToolbar: React.FC<{ position: { top: number; left: number } }> = ({ position }) => {
  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div 
      className="absolute flex items-center gap-0.5 bg-slate-800 text-white rounded-full px-2 py-1.5 shadow-2xl z-[220] animate-in fade-in zoom-in-95 duration-150 border border-white/10 backdrop-blur-sm pointer-events-auto"
      style={{ 
        top: `${position.top - 12}px`, 
        left: `${position.left}px`,
        transform: 'translate(-50%, -100%)'
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <button onClick={() => handleFormat('bold')} className="p-2 hover:bg-white/10 rounded-full transition-colors font-bold text-sm min-w-[32px]" title="Bold (Ctrl+B)">B</button>
      <button onClick={() => handleFormat('underline')} className="p-2 hover:bg-white/10 rounded-full transition-colors underline text-sm min-w-[32px]" title="Underline (Ctrl+U)">U</button>
      <button onClick={() => handleFormat('italic')} className="p-2 hover:bg-white/10 rounded-full transition-colors italic font-serif text-sm min-w-[32px]" title="Italic (Ctrl+I)">I</button>
      <div className="w-px h-4 bg-white/20 mx-1"></div>
      <button onClick={() => handleFormat('justifyLeft')} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Align Left">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z"/></svg>
      </button>
      <button onClick={() => handleFormat('justifyCenter')} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Align Center">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm4 4h10v2H7V7zm-4 4h18v2H3v-2zm4 4h10v2H7v-2zm-4 4h18v2H3v-2z"/></svg>
      </button>
      <div className="w-px h-4 bg-white/20 mx-1"></div>
      <button onClick={() => handleFormat('createLink', prompt('Enter URL:') || '')} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Insert Link">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
      </button>
    </div>
  );
};

// --- Main Components ---

interface EditableSectionProps {
  id: string;
  children: React.ReactNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onAdd?: () => void;
  onDelete?: () => void;
  className?: string;
  isDarkBg?: boolean;
  spacingLevel?: number;
  isReadOnly?: boolean;
  isItemActive?: boolean;
}

const EditableSection: React.FC<EditableSectionProps> = ({ 
  id, children, isSelected, onSelect, onAdd, onDelete, className = "", isDarkBg = false, spacingLevel = 3, isReadOnly = false, isItemActive = false
}) => {
  const marginSize = spacingLevel * 6;
  const showSectionHighlight = isSelected && !isReadOnly && !isItemActive;
  
  const selectionClasses = isReadOnly 
    ? '' 
    : showSectionHighlight 
      ? 'ring-2 ring-[#00C3A5] p-2 -m-2 ' + (isDarkBg ? 'bg-white/5' : 'bg-[#fcfcfc]') 
      : 'hover:ring-1 hover:ring-slate-200/50 p-2 -m-2 cursor-pointer transition-all duration-300';

  return (
    <div 
      onClick={(e) => { if (!isReadOnly) { e.stopPropagation(); onSelect(id); } }}
      className={`relative rounded-lg ${className} ${selectionClasses}`}
      style={{ marginBottom: `${marginSize}px` }}
    >
      {showSectionHighlight && <SectionToolbar onAdd={onAdd} onDelete={onDelete} />}
      {children}
    </div>
  );
};

interface EditableItemProps {
  id: string;
  children: React.ReactNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onAdd?: () => void;
  onDelete?: () => void;
  isReadOnly?: boolean;
  isTextSelected?: boolean;
  onAIRequest?: (e: React.MouseEvent) => void;
}

const EditableItem: React.FC<EditableItemProps> = ({ 
  id, children, isSelected, onSelect, onAdd, onDelete, isReadOnly = false, isTextSelected = false, onAIRequest 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const showItemToolbar = isSelected && !isReadOnly && !isTextSelected;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => { if (!isReadOnly) { e.stopPropagation(); onSelect(id); } }}
      className={`relative transition-all duration-300 ${!isReadOnly && isSelected ? 'ring-1 ring-[#2ECB8F] rounded-lg p-3 -m-3 bg-[#f0fff9]/40 z-[10]' : !isReadOnly ? 'hover:ring-1 hover:ring-slate-200 rounded-lg p-3 -m-3 cursor-text' : ''}`}
    >
      {showItemToolbar && <ItemToolbar onAdd={onAdd} onDelete={onDelete} />}
      {onAIRequest && isHovered && !isReadOnly && (
        <button 
          onClick={(e) => { e.stopPropagation(); onAIRequest(e); }}
          className="absolute -right-1 top-2 w-8 h-8 bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-center text-indigo-500 hover:text-indigo-600 hover:scale-110 transition-all z-[120]"
          title="AI Assistant"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </button>
      )}
      {children}
    </div>
  );
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
        // Simple logic for experience: replace whole bullet points array if string contains bullets
        // or just treat the result as a raw block of text to be normalized.
        // For now, let's treat the AI result as a new description block (array).
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

  const handleListUpdate = (expId: string, html: string) => {
    if (isReadOnly) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const bullets = Array.from(tempDiv.querySelectorAll('li')).map(li => li.innerText.trim()).filter(t => t.length > 0);
    const newExperience = data.experience.map(exp => exp.id === expId ? { ...exp, description: bullets } : exp);
    handleUpdate('experience', newExperience);
  };

  const getFontSizeClass = () => {
    if (design.fontSize === 'small') return 'text-[12px]';
    if (design.fontSize === 'large') return 'text-[16px]';
    return 'text-[14px]';
  };

  const getHeadingSizeClass = () => {
    if (design.fontSize === 'small') return 'text-base';
    if (design.fontSize === 'large') return 'text-2xl';
    return 'text-lg';
  };

  const commonStyle = {
    fontFamily: design.fontFamily,
    lineHeight: design.lineHeight,
  };

  // --- Render Functions ---

  const renderSummary = (isDarkBg: boolean) => (
    <EditableSection 
      id="summary" 
      isSelected={selectedSectionId === 'summary'} 
      onSelect={handleSelectSection} 
      onDelete={() => handleRemoveSection('summary')}
      isDarkBg={isDarkBg} 
      spacingLevel={design.sectionSpacing} 
      isReadOnly={isReadOnly}
      isItemActive={selectedItemId !== null}
    >
      <h3 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 border-b pb-2 ${isDarkBg ? 'text-teal-200 border-teal-800' : 'text-slate-500 border-slate-100'}`} style={{ color: !isDarkBg ? design.primaryColor : undefined }}>Summary</h3>
      <div className="relative group/summary">
        {!isReadOnly && (
          <button 
            onClick={(e) => handleAIRequest(e, 'summary', data.summary)}
            className="absolute -right-8 top-0 w-6 h-6 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500 opacity-0 group-hover/summary:opacity-100 hover:scale-110 transition-all z-[50]"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </button>
        )}
        <p className={`leading-relaxed outline-none ${isDarkBg ? 'text-teal-50/80 font-light' : 'text-slate-600'} ${getFontSizeClass()}`} contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => handleUpdate('summary', e.currentTarget.textContent)}>
          {data.summary}
        </p>
      </div>
    </EditableSection>
  );

  const renderExperience = (items: Experience[], isDarkBg: boolean) => (
    <EditableSection 
      id="experience" 
      isSelected={selectedSectionId === 'experience'} 
      onSelect={handleSelectSection} 
      onAdd={handleAddExperience}
      onDelete={() => handleRemoveSection('experience')}
      isDarkBg={isDarkBg} 
      spacingLevel={design.sectionSpacing} 
      isReadOnly={isReadOnly}
      isItemActive={selectedItemId !== null && items.some(i => i.id === selectedItemId)}
    >
      <h2 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 ${isDarkBg ? 'text-teal-200 border-b border-teal-800 pb-2' : 'text-slate-400'}`} style={{ color: !isDarkBg ? design.primaryColor + '80' : undefined }}>Experience</h2>
      <div className="space-y-12">
        {items.map(exp => (
          <EditableItem 
            key={exp.id} 
            id={exp.id} 
            isSelected={selectedItemId === exp.id} 
            onSelect={handleSelectItem} 
            onAdd={() => handleDuplicateExperience(exp.id)}
            onDelete={() => handleDeleteExperience(exp.id)}
            isReadOnly={isReadOnly}
            isTextSelected={selectionToolbarPos !== null}
            onAIRequest={(e) => handleAIRequest(e, 'experience', exp.description.join('\n'), exp.id)}
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className={`font-bold outline-none ${getHeadingSizeClass()} ${isDarkBg ? 'text-teal-50' : 'text-slate-700'}`} contentEditable={!isReadOnly} suppressContentEditableWarning>{exp.role}</h4>
              <span className={`text-sm font-medium ${isDarkBg ? 'text-teal-400' : 'text-slate-400'}`} contentEditable={!isReadOnly} suppressContentEditableWarning>{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-md font-semibold mb-4 outline-none flex justify-between" style={{ color: design.primaryColor }}>
              <span contentEditable={!isReadOnly} suppressContentEditableWarning>{exp.company}</span>
              <span className={`text-sm opacity-60 font-medium ${isDarkBg ? 'text-white' : 'text-slate-600'}`} contentEditable={!isReadOnly} suppressContentEditableWarning>{exp.location}</span>
            </p>
            <ul className={`space-y-2 list-disc list-outside ml-4 leading-relaxed outline-none min-h-[1em] ${isDarkBg ? 'text-teal-100' : 'text-slate-600'} ${getFontSizeClass()}`} contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => handleListUpdate(exp.id, e.currentTarget.innerHTML)}>
              {exp.description.map((bullet, idx) => <li key={idx} className="pl-2 marker:text-slate-300">{bullet}</li>)}
            </ul>
          </EditableItem>
        ))}
      </div>
    </EditableSection>
  );

  const renderEducation = (isDarkBg: boolean) => (
    <EditableSection 
      id="education" 
      isSelected={selectedSectionId === 'education'} 
      onSelect={handleSelectSection} 
      onAdd={handleAddEducation}
      onDelete={() => handleRemoveSection('education')}
      isDarkBg={isDarkBg} 
      spacingLevel={design.sectionSpacing} 
      isReadOnly={isReadOnly} 
      isItemActive={selectedItemId !== null && data.education.some(i => i.id === selectedItemId)}
    >
      <h2 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 ${isDarkBg ? 'text-teal-200 border-b border-teal-800 pb-2' : 'text-slate-400'}`} style={{ color: !isDarkBg ? design.primaryColor + '80' : undefined }}>Education</h2>
      <div className="space-y-10">
        {data.education.map(edu => (
          <EditableItem 
            key={edu.id} 
            id={edu.id} 
            isSelected={selectedItemId === edu.id} 
            onSelect={handleSelectItem} 
            onDelete={() => handleDeleteEducation(edu.id)}
            isReadOnly={isReadOnly} 
            isTextSelected={selectionToolbarPos !== null}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className={`font-bold outline-none ${getHeadingSizeClass()} ${isDarkBg ? 'text-teal-50' : 'text-slate-700'}`} contentEditable={!isReadOnly} suppressContentEditableWarning>{edu.degree}</h4>
                <p className="text-sm font-semibold" style={{ color: design.primaryColor }} contentEditable={!isReadOnly} suppressContentEditableWarning>{edu.institution}</p>
              </div>
              <p className={`text-sm font-medium ${isDarkBg ? 'text-teal-400' : 'text-slate-400'}`} contentEditable={!isReadOnly} suppressContentEditableWarning>{edu.startDate} - {edu.endDate}</p>
            </div>
          </EditableItem>
        ))}
      </div>
    </EditableSection>
  );

  const renderSkills = (isDarkBg: boolean) => (
    <EditableSection 
      id="skills" 
      isSelected={selectedSectionId === 'skills'} 
      onSelect={handleSelectSection} 
      onAdd={handleAddSkillCategory}
      onDelete={() => handleRemoveSection('skills')}
      isDarkBg={isDarkBg} 
      spacingLevel={design.sectionSpacing} 
      isReadOnly={isReadOnly} 
      isItemActive={selectedItemId !== null}
    >
      <h3 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 border-b pb-2 ${isDarkBg ? 'text-teal-200 border-teal-800' : 'text-slate-500 border-slate-100'}`} style={{ color: !isDarkBg ? design.primaryColor : undefined }}>Skills</h3>
      <div className="space-y-6">
        {data.skills.map((cat, idx) => (
          <div key={cat.id || idx}>
            <h4 className={`text-[10px] font-bold tracking-widest uppercase mb-3 ${isDarkBg ? 'text-teal-400' : 'text-slate-400'}`} contentEditable={!isReadOnly} suppressContentEditableWarning>{cat.name}</h4>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map(skill => (
                <span key={skill} className={`px-3 py-1 rounded-full text-[11px] border font-medium ${isDarkBg ? 'bg-white/10 text-teal-50 border-white/5' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </EditableSection>
  );

  const renderCertifications = (isDarkBg: boolean) => (
    <EditableSection 
      id="certifications" 
      isSelected={selectedSectionId === 'certifications'} 
      onSelect={handleSelectSection} 
      onAdd={handleAddCertification}
      onDelete={() => handleRemoveSection('certifications')}
      isDarkBg={isDarkBg} 
      spacingLevel={design.sectionSpacing} 
      isReadOnly={isReadOnly} 
      isItemActive={selectedItemId !== null}
    >
       <h3 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 border-b pb-2 ${isDarkBg ? 'text-teal-200 border-teal-800' : 'text-slate-500 border-slate-100'}`} style={{ color: !isDarkBg ? design.primaryColor : undefined }}>Certification</h3>
       <div className={`space-y-5 ${isDarkBg ? 'text-teal-50' : 'text-slate-700'} ${getFontSizeClass()}`}>
          {data.certifications.map(cert => (
            <div key={cert.id} className="group/cert">
              <h4 className="font-bold leading-tight mb-1" contentEditable={!isReadOnly} suppressContentEditableWarning>{cert.name}</h4>
              {cert.issuer && <p className="text-xs opacity-70 italic" contentEditable={!isReadOnly} suppressContentEditableWarning>{cert.issuer}</p>}
            </div>
          ))}
       </div>
    </EditableSection>
  );

  const renderAchievements = (isDarkBg: boolean) => (
    <EditableSection 
      id="achievements" 
      isSelected={selectedSectionId === 'achievements'} 
      onSelect={handleSelectSection} 
      onAdd={handleAddAchievement}
      onDelete={() => handleRemoveSection('achievements')}
      isDarkBg={isDarkBg} 
      spacingLevel={design.sectionSpacing} 
      isReadOnly={isReadOnly} 
      isItemActive={selectedItemId !== null}
    >
       <h3 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 border-b pb-2 ${isDarkBg ? 'text-teal-200 border-teal-800' : 'text-slate-500 border-slate-100'}`} style={{ color: !isDarkBg ? design.primaryColor : undefined }}>Achievements</h3>
       <ul className={`space-y-4 ${isDarkBg ? 'text-teal-50' : 'text-slate-600'} ${getFontSizeClass()}`}>
          {data.achievements.map((ach, idx) => (
            <li key={idx} className="text-xs flex gap-3 leading-relaxed">
              <span className="text-xl" style={{ color: design.primaryColor }}>★</span>
              <span contentEditable={!isReadOnly} suppressContentEditableWarning>{ach}</span>
            </li>
          ))}
       </ul>
    </EditableSection>
  );

  const renderSectionById = (id: string, isDarkBg: boolean) => {
    if (id === 'experience') return renderExperience(data.experience, isDarkBg);
    if (id === 'education') return renderEducation(isDarkBg);
    if (id === 'summary') return renderSummary(isDarkBg);
    if (id === 'skills') return renderSkills(isDarkBg);
    if (id === 'certifications') return renderCertifications(isDarkBg);
    if (id === 'achievements') return renderAchievements(isDarkBg);
    return null;
  };

  const isSidebarDark = template === 'double-column' || template === 'modern';
  const marginPx = design.margins * 20;

  const leftWeight = design.columnLayout === 1 ? 'w-[75%]' : design.columnLayout === 2 ? 'w-[65%]' : design.columnLayout === 3 ? 'w-[70%]' : 'w-[50%]';
  const rightWeight = design.columnLayout === 1 ? 'w-[25%]' : design.columnLayout === 2 ? 'w-[35%]' : design.columnLayout === 3 ? 'w-[30%]' : 'w-[50%]';

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
                 <span contentEditable={!isReadOnly} suppressContentEditableWarning>✉️ {data.personalInfo.email}</span>
                 <span contentEditable={!isReadOnly} suppressContentEditableWarning>📞 {data.personalInfo.phone}</span>
                 <span contentEditable={!isReadOnly} suppressContentEditableWarning>📍 {data.personalInfo.location}</span>
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
                    <div className="flex items-center gap-4"><span className="opacity-40 text-lg">📞</span> <span contentEditable={!isReadOnly} suppressContentEditableWarning>{data.personalInfo.phone}</span></div>
                    <div className="flex items-center gap-4"><span className="opacity-40 text-lg">✉️</span> <span contentEditable={!isReadOnly} suppressContentEditableWarning>{data.personalInfo.email}</span></div>
                    <div className="flex items-center gap-4"><span className="opacity-40 text-lg">📍</span> <span contentEditable={!isReadOnly} suppressContentEditableWarning>{data.personalInfo.location}</span></div>
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
