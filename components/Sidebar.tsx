
import React from 'react';
import { Palette, Sparkles, Share2, History, Undo2, LayoutTemplate, ArrowRightLeft, Plus, Check, Link, Download, HelpCircle } from 'lucide-react';
import { ResumeData } from '../types';
import { startTour } from './TourGuide';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onOpenAddSection: () => void;
  onOpenTemplates: () => void;
  onOpenRearrange: () => void;
  onOpenDesign: () => void;
  onOpenImprove: () => void;
  onOpenDownload: () => void;
  onOpenShare: () => void;
  onOpenPremium: () => void;
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
  onOpenShare,
  onOpenPremium,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isCollapsed,
  activePanel
}) => {
  const menuItems = [
    { id: 'undo', label: 'Undo/Redo', icon: <Undo2 size={20} />, group: 'history' },
    { id: 'add', label: 'Add section', icon: <Plus size={20} />, group: 'edit' },
    { id: 'rearrange', label: 'Rearrange', icon: <ArrowRightLeft size={20} />, group: 'edit' },
    { id: 'templates', label: 'Templates', icon: <LayoutTemplate size={20} />, group: 'edit' },
    { id: 'design', label: 'Design & Font', icon: <Palette size={20} />, group: 'edit' },
    { id: 'improve', label: 'Improve text', icon: <Sparkles size={20} />, group: 'ai' },
    { id: 'check', label: 'Check', icon: <Check size={20} />, group: 'ai' },
    { id: 'download', label: 'Download', icon: <Download size={20} />, premium: true, group: 'action' },
    { id: 'share', label: 'Share', icon: <Share2 size={20} />, group: 'action' },
    { id: 'history', label: 'History', icon: <History size={20} />, premium: true, group: 'action' },
  ];

  const handleClick = (id: string) => {
    if (id === 'add') onOpenAddSection();
    if (id === 'templates') onOpenTemplates();
    if (id === 'rearrange') onOpenRearrange();
    if (id === 'design') onOpenDesign();
    if (id === 'improve') onOpenImprove();
    if (id === 'download') onOpenDownload();
    if (id === 'share') onOpenShare();
    if (id === 'premium') onOpenPremium();
    if (id === 'undo') onUndo();
  };

  return (
    <div className={`flex flex-col h-full overflow-y-auto py-4 transition-all duration-300 relative border-r border-shades-black-80 ${isCollapsed ? 'items-center bg-shades-black-100' : 'bg-shades-black-100'}`}>
      {!isCollapsed ? (
        <>
          {/* Premium Button Expanded */}
          <div className="px-6 mb-6">
            <button
              onClick={() => handleClick('premium')}
              className="w-full py-3 bg-shades-white-100 text-shades-black-100 font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg hover:shadow-xl hover:bg-shades-white-90 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              <span className="text-sm">★</span> Get Premium
            </button>
          </div>

          {/* Undo/Redo Expanded */}
          <div className="flex px-6 mb-6 gap-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`flex-1 py-2 px-2 border border-shades-black-80 bg-shades-black-90 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${canUndo ? 'text-shades-white-60 hover:bg-shades-black-80 hover:text-shades-white-100 hover:border-shades-black-70' : 'text-shades-black-70 cursor-not-allowed'}`}
            >
              <span>⟲</span> Undo
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`flex-1 py-2 px-2 border border-shades-black-80 bg-shades-black-90 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${canRedo ? 'text-shades-white-60 hover:bg-shades-black-80 hover:text-shades-white-100 hover:border-shades-black-70' : 'text-shades-black-70 cursor-not-allowed'}`}
            >
              Redo <span>⟳</span>
            </button>
          </div>
        </>
      ) : (
        <div className="mb-4 flex flex-col gap-4">
          {/* Premium Button Collapsed */}
          <button
            onClick={() => handleClick('premium')}
            className="p-2 bg-shades-white-100 text-shades-black-100/90 rounded-lg hover:bg-shades-white-90 transition-all shadow-lg active:scale-95 flex items-center justify-center"
            title="Premium"
          >
            ★
          </button>

          <div className="h-px w-6 bg-shades-black-80 mx-auto"></div>

          {/* Undo/Redo Collapsed */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
            className={`p-2 transition-all rounded-lg flex items-center justify-center ${canUndo ? 'text-shades-white-60 hover:text-shades-white-100 hover:bg-shades-black-90' : 'text-shades-black-70 cursor-not-allowed'}`}
          >
            ⟲
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
            className={`p-2 transition-all rounded-lg flex items-center justify-center ${canRedo ? 'text-shades-white-60 hover:text-shades-white-100 hover:bg-shades-black-90' : 'text-shades-black-70 cursor-not-allowed'}`}
          >
            ⟳
          </button>
          <div className="h-px w-6 bg-shades-black-80 mx-auto"></div>
        </div>
      )}

      <div className="space-y-1 w-full px-2">
        {menuItems.map((item) => {
          const isActive = activePanel === item.id;
          // Skip the undo item in the list because it's already at the top
          if (item.id === 'undo') return null;

          return (
            <div key={item.id} className="w-full">
              {(item.id === 'improve' || item.id === 'download') && !isCollapsed && <div className="mx-4 h-px bg-shades-black-80 my-2"></div>}
              <button
                id={`sidebar-${item.id}`}
                onClick={() => handleClick(item.id)}
                className={`w-full flex items-center group transition-all relative rounded-xl ${isCollapsed ? 'justify-center py-4' : 'px-4 py-3 hover:bg-shades-black-90'} ${isActive ? 'bg-shades-black-80 text-shades-white-100 shadow-md shadow-black/20' : 'text-shades-white-60'}`}
                title={isCollapsed ? item.label : ''}
              >
                <span className={`text-xl transition-all ${isCollapsed ? 'mr-0' : 'mr-3'} ${isActive ? 'text-shades-white-100 opacity-100' : 'opacity-60 group-hover:opacity-100 group-hover:text-shades-white-80'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className={`text-sm font-medium ${isActive ? 'text-shades-white-100' : ''}`}>{item.label}</span>}
                {item.premium && !isCollapsed && (
                  <span className="ml-auto text-[10px] text-shades-white-60 drop-shadow-sm">★</span>
                )}
                {isActive && isCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-shades-white-100 rounded-l-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className={`mt-auto pt-6 border-t border-shades-black-80 ${isCollapsed ? 'pb-4' : 'px-6 pb-6'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => startTour(true)}
                className="flex items-center gap-2 text-xs font-semibold text-shades-white-80 hover:text-white transition-colors group"
              >
                <HelpCircle size={14} className="group-hover:scale-110 transition-transform" />
                <span>Help</span>
              </button>
            </div>
          )}
          {isCollapsed && (
            <button
              onClick={() => startTour(true)}
              className="w-8 h-8 rounded-full bg-shades-black-90 flex items-center justify-center text-shades-white-60 hover:text-white hover:bg-shades-black-80 transition-all mb-2"
              title="Help / Restart Tour"
            >
              <HelpCircle size={14} />
            </button>
          )}

          <div className={`w-8 h-8 rounded-full bg-shades-black-80 flex items-center justify-center border border-shades-black-70 shadow-lg shadow-black/20 ${isCollapsed ? 'scale-75' : ''}`}>
            <span className="text-shades-white-100 text-xs font-bold">M</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
