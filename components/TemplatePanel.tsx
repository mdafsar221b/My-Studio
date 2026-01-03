
import React, { useState } from 'react';
import { TemplateType } from '../types';
import { TEMPLATES, getTemplate } from './resume/templates/registry';

interface Props {
  activeTemplate: TemplateType;
  onSelect: (id: TemplateType) => void;
  onClose: () => void;
  isEmbeded?: boolean;
}

const TemplatePanel: React.FC<Props> = ({ activeTemplate, onSelect, onClose, isEmbeded = false }) => {
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get first 4 templates for quick access sidebar
  const quickTemplates = TEMPLATES.slice(0, 4);

  const allTags = Array.from(new Set(TEMPLATES.flatMap(t => t.tags)));
  const filteredTemplates = selectedTag
    ? TEMPLATES.filter(t => t.tags.includes(selectedTag))
    : TEMPLATES;

  const premiumTemplates = filteredTemplates.filter(t => t.isPremium);
  const freeTemplates = filteredTemplates.filter(t => !t.isPremium);

  const renderSkeleton = (id: string, thumbClass: string) => {
    switch (id) {
      case 'double-column':
        return (
          <div className="flex w-full h-full">
            <div className="w-[65%] p-1 space-y-1">
              <div className="h-2 w-1/2 bg-slate-300 rounded mb-2"></div>
              <div className="h-1 w-full bg-slate-100 rounded"></div>
              <div className="h-1 w-full bg-slate-100 rounded"></div>
              <div className="h-1 w-3/4 bg-slate-100 rounded"></div>
              <div className="h-12 w-full bg-slate-50 mt-2 rounded"></div>
            </div>
            <div className="w-[35%] bg-slate-800 p-1 space-y-1">
              <div className="h-1 w-full bg-slate-600 rounded"></div>
              <div className="h-1 w-2/3 bg-slate-600 rounded"></div>
            </div>
          </div>
        );
      case 'executive':
        return (
          <div className="flex flex-col w-full h-full">
            <div className="h-6 w-full bg-blue-900 mb-1"></div>
            <div className="flex justify-center mb-2">
              <div className="h-2 w-1/3 bg-slate-300 rounded"></div>
            </div>
            <div className="flex gap-1 px-1">
              <div className="w-2/3 space-y-1">
                <div className="h-1 w-full bg-slate-100 rounded"></div>
                <div className="h-1 w-full bg-slate-100 rounded"></div>
              </div>
              <div className="w-1/3 space-y-1">
                <div className="h-1 w-full bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        );
      case 'creative':
        return (
          <div className="flex flex-col w-full h-full bg-[#fdfbf7] relative overflow-hidden">
            <div className="absolute top-[-10px] right-[-10px] w-12 h-12 rounded-full bg-orange-200/50"></div>
            <div className="p-2 pt-4">
              <div className="h-4 w-1/2 bg-slate-800 rounded mb-2"></div>
              <div className="flex gap-2">
                <div className="w-1/2 space-y-1">
                  <div className="h-1 w-full bg-slate-200 rounded"></div>
                  <div className="h-1 w-3/4 bg-slate-200 rounded"></div>
                </div>
                <div className="w-1/2 space-y-1">
                  <div className="h-1 w-full bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'startup':
        return (
          <div className="flex flex-col w-full h-full bg-white">
            <div className="bg-black h-8 w-full mb-2 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-lime-400"></div>
            </div>
            <div className="flex px-2 gap-2">
              <div className="w-2/3 space-y-1">
                <div className="h-1 w-full bg-slate-200 rounded"></div>
                <div className="h-1 w-full bg-slate-200 rounded"></div>
              </div>
              <div className="w-1/3 border-l border-dashed border-slate-300 pl-1 space-y-1">
                <div className="h-1 w-full bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>
        );
      case 'minimalist':
        return (
          <div className="flex flex-col w-full h-full items-center pt-3">
            <div className="h-2 w-1/2 bg-slate-800 mb-2"></div>
            <div className="h-px w-1/3 bg-slate-200 mb-3"></div>
            <div className="w-full px-3 grid grid-cols-3 gap-1">
              <div className="col-span-2 space-y-1">
                <div className="h-1 w-full bg-slate-100 rounded"></div>
                <div className="h-1 w-full bg-slate-100 rounded"></div>
              </div>
              <div className="col-span-1 space-y-1 border-l border-slate-100 pl-1">
                <div className="h-1 w-full bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>
        );
      case 'tech':
        return (
          <div className="flex w-full h-full font-mono">
            <div className="w-[30%] bg-slate-900 p-1 flex flex-col items-center pt-2">
              <div className="w-6 h-6 bg-teal-500 rounded mb-2"></div>
              <div className="h-0.5 w-full bg-slate-700 my-1"></div>
              <div className="h-1 w-3/4 bg-slate-700 rounded"></div>
            </div>
            <div className="w-[70%] p-1 pt-2">
              <div className="h-2 w-3/4 bg-slate-800 border-b-2 border-slate-900 mb-2"></div>
              <div className="space-y-1">
                <div className="h-1 w-full bg-slate-200 rounded"></div>
                <div className="h-1 w-full bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        );
      case 'ivy-league':
        return (
          <div className="flex flex-col w-full h-full pt-2 px-2">
            <div className="border-b border-slate-300 pb-1 mb-2">
              <div className="h-2 w-1/2 bg-slate-800 mb-1"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-2/3 space-y-1">
                <div className="h-1 w-full bg-slate-200 rounded"></div>
                <div className="h-1 w-full bg-slate-200 rounded"></div>
              </div>
              <div className="w-1/3 space-y-1">
                <div className="h-1 w-full bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>
        );
      case 'modern':
        return (
          <div className="flex w-full h-full">
            <div className="w-[65%] p-1 pt-3 space-y-1">
              <div className="h-2 w-1/2 bg-rose-700 mb-2"></div>
              <div className="h-1 w-full bg-slate-200 rounded"></div>
              <div className="h-1 w-full bg-slate-200 rounded"></div>
            </div>
            <div className="w-[35%] bg-slate-900 p-1">
              <div className="h-1 w-2/3 bg-white/20 rounded mt-4"></div>
              <div className="h-1 w-full bg-white/20 rounded mt-1"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="absolute inset-4 bg-white shadow-sm rounded-lg flex flex-col p-2 gap-2 overflow-hidden opacity-80">
            <div className={`h-2 w-1/2 rounded-full ${thumbClass || 'bg-slate-300'}`}></div>
            <div className="space-y-1">
              <div className="h-1 w-full bg-slate-100 rounded"></div>
              <div className="h-1 w-full bg-slate-100 rounded"></div>
              <div className="h-1 w-2/3 bg-slate-100 rounded"></div>
            </div>
          </div>
        );
    }
  };

  const renderTemplateCard = (t: typeof TEMPLATES[0], isModal = false) => (
    <div
      key={t.id}
      className={`group cursor-pointer flex flex-col gap-3 transition-all ${activeTemplate === t.id ? 'scale-105' : ''}`}
      onClick={() => { onSelect(t.id as TemplateType); if (isModal) setShowAllModal(false); }}
    >
      <div className={`aspect-[3/4] border-2 rounded-xl shadow-sm group-hover:shadow-md transition-all relative overflow-hidden bg-white 
            ${activeTemplate === t.id ? 'border-shades-white-100 ring-4 ring-shades-white-100/10' : 'border-shades-black-80 hover:border-shades-black-60'}
        `}>
        {/* Thumbnail Mockup */}
        <div className={`absolute inset-0 ${t.thumbnailClass || 'bg-slate-100'} opacity-10`}></div>

        <div className="absolute inset-0 p-3">
          <div className="w-full h-full bg-white shadow-sm rounded overflow-hidden select-none pointer-events-none">
            {renderSkeleton(t.id, t.thumbnailClass || '')}
          </div>
        </div>

        {t.isPremium && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm z-10 tracking-wider">
            PREMIUM
          </div>
        )}

        {activeTemplate === t.id && (
          <div className="absolute inset-0 bg-shades-black-90/50 flex items-center justify-center backdrop-blur-[1px] z-20">
            <div className="bg-shades-white-100 text-shades-black-100 rounded-full p-2 shadow-lg animate-in zoom-in-50 duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
          </div>
        )}
      </div>
      <div className="text-center">
        <p className={`text-xs font-bold uppercase tracking-wider ${activeTemplate === t.id ? 'text-shades-white-100' : 'text-shades-black-60'}`}>{t.name}</p>

        {isModal && (
          <div className="flex justify-center gap-1 mt-1 flex-wrap px-2">
            {t.tags.map(tag => (
              <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className={`h-full w-[320px] bg-shades-black-90 border-r border-shades-black-80 z-[45] flex flex-col ${!isEmbeded ? 'absolute top-0 left-[260px] shadow-2xl animate-in slide-in-from-left duration-300' : ''}`}>
        <div className="p-6 border-b border-shades-black-80 flex items-center justify-between flex-shrink-0">
          <h3 className="font-bold text-shades-white-100 uppercase tracking-widest text-xs">Select a template</h3>
          <button onClick={onClose} className="text-shades-black-60 hover:text-shades-white-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div className="grid grid-cols-2 gap-6">
            {quickTemplates.map(t => renderTemplateCard(t))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setShowAllModal(true)}
              className="text-shades-white-100 text-xs font-bold uppercase tracking-widest hover:underline flex items-center justify-center gap-2 mx-auto"
            >
              View All Templates
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-shades-black-80 bg-shades-black-100/50 flex-shrink-0">
          <button onClick={onClose} className="w-full py-3 bg-shades-white-100 text-shades-black-100 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-shades-white-90 transition-all shadow-lg shadow-black/20 active:scale-95">Continue Editing</button>
        </div>
      </div>

      {/* View All Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-200">
          <div className="bg-shades-black-90 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-shades-black-80">
            <div className="p-6 border-b border-shades-black-80 flex items-center justify-between shrink-0 bg-shades-black-100/30">
              <div>
                <h2 className="text-xl font-bold text-shades-white-100">Template Gallery</h2>
                <p className="text-sm text-shades-black-60">Choose from our collection of professional resume templates</p>
              </div>
              <button onClick={() => setShowAllModal(false)} className="p-2 hover:bg-shades-black-80 rounded-full transition-colors text-shades-black-60">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex flex-grow overflow-hidden">
              {/* Filters Sidebar */}
              <div className="w-64 border-r border-shades-black-80 p-6 flex flex-col gap-2 overflow-y-auto bg-shades-black-90 shrink-0">
                <h3 className="text-xs font-bold uppercase text-shades-black-60 tracking-widest mb-2">Categories</h3>
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedTag ? 'bg-shades-white-100 text-shades-black-100' : 'text-shades-white-60 hover:bg-shades-black-80'}`}
                >
                  All Templates
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTag === tag ? 'bg-shades-white-100 text-shades-black-100' : 'text-shades-white-60 hover:bg-shades-black-80'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Templates Grid */}
              <div className="flex-grow overflow-y-auto p-8 bg-shades-black-100/50">

                {/* Premium Section */}
                {premiumTemplates.length > 0 && (
                  <div className="mb-10">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-shades-white-100 uppercase tracking-widest mb-6">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-transparent bg-clip-text">Premium Collection</span>
                      <div className="h-px bg-shades-black-80 flex-grow"></div>
                    </h3>
                    <div className="grid grid-cols-4 gap-8">
                      {premiumTemplates.map(t => renderTemplateCard(t, true))}
                    </div>
                  </div>
                )}

                {/* Free Section */}
                {freeTemplates.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-shades-white-100 uppercase tracking-widest mb-6">
                      <span>Standard Designs</span>
                      <div className="h-px bg-shades-black-80 flex-grow"></div>
                    </h3>
                    <div className="grid grid-cols-4 gap-8">
                      {freeTemplates.map(t => renderTemplateCard(t, true))}
                    </div>
                  </div>
                )}

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-20 text-shades-black-60">
                    No templates found for this category.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-shades-black-80 bg-shades-black-90 flex justify-end shrink-0">
              <button onClick={() => setShowAllModal(false)} className="px-6 py-2 bg-shades-white-100 text-shades-black-100 rounded-lg font-bold text-sm hover:bg-shades-white-90 transition-colors">
                Back to Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TemplatePanel;
