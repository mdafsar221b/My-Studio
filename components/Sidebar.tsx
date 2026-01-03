
import React from 'react';
import { ResumeData } from '../types';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onOpenAddSection: () => void;
  onOpenTemplates: () => void;
  onOpenRearrange: () => void;
  onOpenDesign: () => void;
  onOpenImprove: () => void;
  onOpenDownload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isCollapsed: boolean;
  activePanel?: string;
}

const Sidebar: React.FC<Props> = ({ 
  data, 
  onChange, 
  onOpenAddSection, 
  onOpenTemplates, 
  onOpenRearrange, 
  onOpenDesign,
  onOpenImprove,
  onOpenDownload,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isCollapsed,
  activePanel
}) => {
  const menuItems = [
    { id: 'undo', label: 'Undo/Redo', icon: '⟲', group: 'history' },
    { id: 'add', label: 'Add section', icon: '✎', group: 'edit' },
    { id: 'rearrange', label: 'Rearrange', icon: '⇅', group: 'edit' },
    { id: 'templates', label: 'Templates', icon: '▢', group: 'edit' },
    { id: 'design', label: 'Design & Font', icon: '🎨', group: 'edit' },
    { id: 'improve', label: 'Improve text', icon: '✨', group: 'ai' },
    { id: 'check', label: 'Check', icon: '✓', group: 'ai' },
    { id: 'download', label: 'Download', icon: '↓', premium: true, group: 'action' },
    { id: 'share', label: 'Share', icon: '🔗', group: 'action' },
    { id: 'history', label: 'History', icon: '⌛', premium: true, group: 'action' },
  ];

  const handleClick = (id: string) => {
    if (id === 'add') onOpenAddSection();
    if (id === 'templates') onOpenTemplates();
    if (id === 'rearrange') onOpenRearrange();
    if (id === 'design') onOpenDesign();
    if (id === 'improve') onOpenImprove();
    if (id === 'download') onOpenDownload();
    if (id === 'undo') onUndo();
  };

  return (
    <div className={`flex flex-col h-full overflow-y-auto py-4 transition-all duration-300 ${isCollapsed ? 'items-center' : ''}`}>
      {!isCollapsed ? (
        <div className="flex px-6 mb-6 gap-2">
          <button 
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex-1 py-1.5 px-2 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${canUndo ? 'text-slate-400 hover:bg-slate-50 hover:text-teal-600' : 'text-slate-200 cursor-not-allowed'}`}
          >
            <span>⟲</span> Undo
          </button>
          <button 
            onClick={onRedo}
            disabled={!canRedo}
            className={`flex-1 py-1.5 px-2 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${canRedo ? 'text-slate-400 hover:bg-slate-50 hover:text-teal-600' : 'text-slate-200 cursor-not-allowed'}`}
          >
            Redo <span>⟳</span>
          </button>
        </div>
      ) : (
        <div className="mb-8 flex flex-col gap-4">
           <button 
            onClick={onUndo} 
            disabled={!canUndo}
            title="Undo"
            className={`p-2 transition-colors ${canUndo ? 'text-slate-400 hover:text-teal-600' : 'text-slate-100 cursor-not-allowed'}`}
           >
            ⟲
           </button>
           <button 
            onClick={onRedo} 
            disabled={!canRedo}
            title="Redo"
            className={`p-2 transition-colors ${canRedo ? 'text-slate-400 hover:text-teal-600' : 'text-slate-100 cursor-not-allowed'}`}
           >
            ⟳
           </button>
           <div className="h-px w-6 bg-slate-100 mx-auto"></div>
        </div>
      )}

      <div className="space-y-1 w-full">
        {menuItems.map((item) => {
          const isActive = activePanel === item.id;
          // Skip the undo item in the list because it's already at the top
          if (item.id === 'undo') return null;
          
          return (
            <div key={item.id} className="w-full">
               {(item.id === 'improve' || item.id === 'download') && !isCollapsed && <div className="mx-6 h-px bg-slate-100 my-2"></div>}
               <button 
                onClick={() => handleClick(item.id)}
                className={`w-full flex items-center group transition-all relative ${isCollapsed ? 'justify-center py-4' : 'px-6 py-2.5 hover:bg-slate-50'} ${isActive ? 'bg-teal-50/50 text-teal-600' : 'text-slate-600'}`}
                title={isCollapsed ? item.label : ''}
               >
                 <span className={`text-xl transition-all ${isCollapsed ? 'mr-0' : 'mr-3'} ${isActive ? 'text-teal-600 opacity-100' : 'opacity-60 group-hover:opacity-100 group-hover:text-teal-600'}`}>
                   {item.icon}
                 </span>
                 {!isCollapsed && <span className={`text-sm font-medium ${isActive ? 'text-teal-600' : ''}`}>{item.label}</span>}
                 {item.premium && !isCollapsed && (
                   <span className="ml-auto text-[10px] text-orange-500">★</span>
                 )}
                 {isActive && isCollapsed && (
                   <div className="absolute right-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-full"></div>
                 )}
               </button>
            </div>
          );
        })}
      </div>

      <div className={`mt-auto pt-6 border-t border-slate-100 ${isCollapsed ? 'pb-4' : 'px-6 pb-6'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Branding</span>}
          <div className={`w-10 h-5 bg-teal-500 rounded-full relative ${isCollapsed ? 'transform -rotate-90 scale-75' : ''}`}>
            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
