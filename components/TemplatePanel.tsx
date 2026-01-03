
import React from 'react';
import { TemplateType } from '../types';

interface TemplateOption {
  id: TemplateType;
  name: string;
  previewClass: string;
}

const TEMPLATES: TemplateOption[] = [
  { id: 'double-column', name: 'Double column', previewClass: 'bg-teal-700' },
  { id: 'ivy-league', name: 'Ivy League', previewClass: 'bg-slate-800' },
  { id: 'executive', name: 'Executive', previewClass: 'bg-blue-900' },
  { id: 'modern', name: 'Modern', previewClass: 'bg-rose-700' },
];

interface Props {
  activeTemplate: TemplateType;
  onSelect: (id: TemplateType) => void;
  onClose: () => void;
  isEmbeded?: boolean;
}

const TemplatePanel: React.FC<Props> = ({ activeTemplate, onSelect, onClose, isEmbeded = false }) => {
  return (
    <div className={`h-full w-[320px] bg-white border-r border-slate-200 z-[45] flex flex-col ${!isEmbeded ? 'absolute top-0 left-[260px] shadow-2xl animate-in slide-in-from-left duration-300' : ''}`}>
      <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Select a template</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <div className="grid grid-cols-2 gap-6">
          {TEMPLATES.map((tpl) => (
            <div 
              key={tpl.id} 
              className={`group cursor-pointer flex flex-col gap-3 transition-all ${activeTemplate === tpl.id ? 'scale-105' : ''}`}
              onClick={() => onSelect(tpl.id)}
            >
              <div className={`aspect-[3/4] border-2 rounded-xl shadow-sm group-hover:shadow-md transition-all relative overflow-hidden bg-white ${activeTemplate === tpl.id ? 'border-teal-500 ring-4 ring-teal-50' : 'border-slate-100 hover:border-slate-200'}`}>
                {/* Visual Mock of Template */}
                <div className="flex h-full">
                  {tpl.id === 'double-column' && (
                    <>
                      <div className="w-2/3 p-2 space-y-1">
                        <div className="h-2 w-10 bg-slate-200 rounded"></div>
                        <div className="h-1 w-full bg-slate-100 rounded"></div>
                        <div className="h-1 w-full bg-slate-100 rounded"></div>
                        <div className="h-1 w-3/4 bg-slate-100 rounded"></div>
                      </div>
                      <div className={`w-1/3 ${tpl.previewClass} opacity-80 p-1`}>
                        <div className="h-1 w-full bg-white/20 rounded mb-1"></div>
                        <div className="h-1 w-full bg-white/20 rounded"></div>
                      </div>
                    </>
                  )}
                  {tpl.id === 'ivy-league' && (
                    <div className="w-full p-2 space-y-2">
                      <div className={`h-4 w-full ${tpl.previewClass} opacity-10 rounded-sm mb-2`}></div>
                      <div className="space-y-1">
                        <div className="h-1 w-full bg-slate-100 rounded"></div>
                        <div className="h-1 w-full bg-slate-100 rounded"></div>
                        <div className="h-1 w-3/4 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                  )}
                  {tpl.id === 'executive' && (
                    <div className="w-full">
                      <div className={`h-8 w-full ${tpl.previewClass} opacity-80 mb-2`}></div>
                      <div className="p-2 flex gap-2">
                        <div className="w-1/2 space-y-1">
                          <div className="h-1 w-full bg-slate-100 rounded"></div>
                          <div className="h-1 w-full bg-slate-100 rounded"></div>
                        </div>
                        <div className="w-1/2 space-y-1">
                          <div className="h-1 w-full bg-slate-100 rounded"></div>
                          <div className="h-1 w-full bg-slate-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {tpl.id === 'modern' && (
                    <div className="w-full p-2 space-y-3">
                      <div className="flex items-center gap-2">
                         <div className={`w-6 h-6 rounded-full ${tpl.previewClass} opacity-20`}></div>
                         <div className="h-2 w-12 bg-slate-200 rounded"></div>
                      </div>
                      <div className="h-1 w-full bg-slate-100 rounded"></div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="h-1 w-full bg-slate-50 rounded"></div>
                        <div className="h-1 w-full bg-slate-50 rounded"></div>
                      </div>
                    </div>
                  )}
                </div>
                {activeTemplate === tpl.id && (
                  <div className="absolute inset-0 bg-teal-500/5 flex items-center justify-center">
                    <div className="bg-teal-500 text-white rounded-full p-1 shadow-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                )}
              </div>
              <p className={`text-[11px] text-center font-bold uppercase tracking-wider ${activeTemplate === tpl.id ? 'text-teal-600' : 'text-slate-500'}`}>{tpl.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
        <button onClick={onClose} className="w-full py-3 bg-teal-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/10 active:scale-95">Continue Editing</button>
        <div className="mt-6 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <span>Document size:</span>
          <div className="flex gap-2">
            <button className="px-2 py-1 bg-white border border-slate-200 rounded shadow-sm text-teal-600">A4</button>
            <button className="px-2 py-1 bg-white border border-slate-200 rounded shadow-sm">US Letter</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePanel;
