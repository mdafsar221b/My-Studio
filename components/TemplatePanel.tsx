
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

  const renderTemplateCard = (t: typeof TEMPLATES[0], isModal = false) => (
    <div
      key={t.id}
      className={`group cursor-pointer flex flex-col gap-3 transition-all ${activeTemplate === t.id ? 'scale-105' : ''}`}
      onClick={() => { onSelect(t.id as TemplateType); if (isModal) setShowAllModal(false); }}
    >
      <div className={`aspect-[3/4] border-2 rounded-xl shadow-sm group-hover:shadow-md transition-all relative overflow-hidden bg-white 
            ${activeTemplate === t.id ? 'border-teal-500 ring-4 ring-teal-50' : 'border-slate-100 hover:border-slate-200'}
        `}>
        {/* Thumbnail Mockup */}
        <div className={`absolute inset-0 ${t.thumbnailClass || 'bg-slate-100'} opacity-10`}></div>
        <div className="absolute inset-4 bg-white shadow-sm rounded-lg flex flex-col p-2 gap-2 overflow-hidden opacity-80">
          <div className={`h-2 w-1/2 rounded-full ${t.thumbnailClass || 'bg-slate-300'}`}></div>
          <div className="space-y-1">
            <div className="h-1 w-full bg-slate-100 rounded"></div>
            <div className="h-1 w-full bg-slate-100 rounded"></div>
            <div className="h-1 w-2/3 bg-slate-100 rounded"></div>
          </div>
        </div>

        {t.isPremium && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
            PREMIUM
          </div>
        )}

        {activeTemplate === t.id && (
          <div className="absolute inset-0 bg-teal-500/10 flex items-center justify-center backdrop-blur-[1px] z-20">
            <div className="bg-teal-500 text-white rounded-full p-2 shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
          </div>
        )}
      </div>
      <div className="text-center">
        <p className={`text-xs font-bold uppercase tracking-wider ${activeTemplate === t.id ? 'text-teal-600' : 'text-slate-600'}`}>{t.name}</p>
        {isModal && (
          <div className="flex justify-center gap-1 mt-1">
            {t.tags.map(tag => (
              <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className={`h-full w-[320px] bg-white border-r border-slate-200 z-[45] flex flex-col ${!isEmbeded ? 'absolute top-0 left-[260px] shadow-2xl animate-in slide-in-from-left duration-300' : ''}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Select a template</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
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
              className="text-teal-600 text-xs font-bold uppercase tracking-widest hover:underline flex items-center justify-center gap-2 mx-auto"
            >
              View All Templates
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
          <button onClick={onClose} className="w-full py-3 bg-teal-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/10 active:scale-95">Continue Editing</button>
        </div>
      </div>

      {/* View All Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Template Gallery</h2>
                <p className="text-sm text-slate-500">Choose from our collection of professional resume templates</p>
              </div>
              <button onClick={() => setShowAllModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex flex-grow overflow-hidden">
              {/* Filters Sidebar */}
              <div className="w-64 border-r border-slate-100 p-6 flex flex-col gap-2 overflow-y-auto bg-white shrink-0">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-2">Categories</h3>
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedTag ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  All Templates
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTag === tag ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Templates Grid */}
              <div className="flex-grow overflow-y-auto p-8 bg-slate-50/30">

                {/* Premium Section */}
                {premiumTemplates.length > 0 && (
                  <div className="mb-10">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-widest mb-6">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-transparent bg-clip-text">Premium Collection</span>
                      <div className="h-px bg-slate-200 flex-grow"></div>
                    </h3>
                    <div className="grid grid-cols-4 gap-8">
                      {premiumTemplates.map(t => renderTemplateCard(t, true))}
                    </div>
                  </div>
                )}

                {/* Free Section */}
                {freeTemplates.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-widest mb-6">
                      <span>Standard Designs</span>
                      <div className="h-px bg-slate-200 flex-grow"></div>
                    </h3>
                    <div className="grid grid-cols-4 gap-8">
                      {freeTemplates.map(t => renderTemplateCard(t, true))}
                    </div>
                  </div>
                )}

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-20 text-slate-400">
                    No templates found for this category.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-end shrink-0">
              <button onClick={() => setShowAllModal(false)} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-colors">
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
