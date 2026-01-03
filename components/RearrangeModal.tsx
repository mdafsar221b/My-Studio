
import React, { useState, useMemo } from 'react';
import { ResumeData, ResumeLayout } from '../types';
import { paginateResume } from './resume/pagination';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onClose: () => void;
}

const RearrangeModal: React.FC<Props> = ({ data, onChange, onClose }) => {
  // --- Initial State ---
  // If data has pages, load them. Else distribute flat layout.
  const [pagesState, setPagesState] = useState<{ left: string[]; right: string[] }[]>(() => {
    if (data.layout?.pages && data.layout.pages.length > 0) {
      // If user has a saved page layout, use it (but we might want to validate it against content? No, trust user save)
      return data.layout.pages;
    }

    // Fallback: If no manual page layout exists (just flat lists), run the pagination logic
    // to get a realistic starting point for the visual editor.
    const paginated = paginateResume(data);

    // Map PageContent back to simple string arrays for the modal state
    // Note: The modal doesn't currently support "split" items (itemRange), so we just put the whole item on the page where it starts.
    return paginated.map(p => ({
      left: p.left.map(item => item.id),
      right: p.right.map(item => item.id)
    }));
  });

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [sourceCol, setSourceCol] = useState<'left' | 'right' | null>(null);
  const [draggedPageIdx, setDraggedPageIdx] = useState<number | null>(null);

  // --- Constants for "Realism" View ---
  // --- Constants for "Realism" View ---
  const PAPER_WIDTH = 300; // More compact
  const PAPER_HEIGHT = PAPER_WIDTH * 1.414;
  const CALC_HEIGHT = 1100;
  const VISUAL_SCALE = PAPER_HEIGHT / CALC_HEIGHT;

  const getSectionTitle = (id: string) => {
    if (id === 'experience') return 'Experience';
    if (id === 'education') return 'Education';
    if (id === 'summary') return 'Summary';
    if (id === 'certifications') return 'Certification';
    if (id === 'achievements') return 'Achievements';
    if (id === 'skills') return 'Skills';
    return data.sections.find(s => s.id === id)?.title || id;
  };

  const getEstimatedHeight = (id: string, colWidthPercent: number): number => {
    // Height estimation in "Calculation Pixels" (Logical)
    let h = 80; // Base padding/margin
    const charWidth = 7;
    const lineHeight = 24;
    const widthPx = 800 * colWidthPercent;
    const charsPerLine = widthPx / charWidth;

    if (id === 'experience') {
      return h + data.experience.reduce((acc, exp) => {
        const roleLines = Math.ceil(exp.role.length / charsPerLine) || 1;
        const companyLines = Math.ceil(exp.company.length / charsPerLine) || 1;
        const descLines = exp.description.reduce((dAcc, d) => dAcc + (Math.ceil(d.length / charsPerLine) || 1), 0);
        return acc + (roleLines * 30) + (companyLines * 26) + (descLines * lineHeight) + 40;
      }, 0);
    }
    if (id === 'education') {
      return h + data.education.reduce(() => 120, 0);
    }
    if (id === 'skills') {
      const totalChars = data.skills.reduce((acc, cat) => acc + cat.skills.join('').length + cat.name.length, 0);
      return h + (Math.ceil(totalChars / (charsPerLine * 0.9)) * 40) + (data.skills.length * 30);
    }
    if (id === 'summary') {
      const lines = Math.ceil(data.summary.length / charsPerLine) || 1;
      return h + (lines * lineHeight) + 20;
    }
    if (id === 'certifications') {
      return h + (data.certifications.length * 80);
    }
    if (id === 'achievements') {
      return h + (data.achievements.length * 60);
    }
    const custom = data.sections.find(s => s.id === id);
    if (custom) {
      return h + (custom.items.length * 60);
    }
    return 100;
  };

  // Hydrate items with heights for render
  const pagesWithHeights = useMemo(() => {
    return pagesState.map(p => ({
      left: p.left.map(id => ({ id, height: getEstimatedHeight(id, 0.65) })),
      right: p.right.map(id => ({ id, height: getEstimatedHeight(id, 0.35) }))
    }));
  }, [pagesState, data]);


  // --- Events ---
  const handleDragStart = (id: string, col: 'left' | 'right', pageIdx: number) => {
    setDraggedId(id);
    setSourceCol(col);
    setDraggedPageIdx(pageIdx);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetCol: 'left' | 'right', targetPageIdx: number, dropIndexInCol: number) => {
    if (!draggedId || !sourceCol || draggedPageIdx === null) return;

    const newPages = structuredClone(pagesState); // Deep clone to be safe
    const sourcePage = newPages[draggedPageIdx];

    // Check if target page exists, if not add it
    if (!newPages[targetPageIdx]) {
      newPages[targetPageIdx] = { left: [], right: [] };
    }
    const targetPage = newPages[targetPageIdx];

    // Remove from source
    sourcePage[sourceCol] = sourcePage[sourceCol].filter((id: string) => id !== draggedId);

    // Add to target
    targetPage[targetCol].splice(dropIndexInCol, 0, draggedId);

    setPagesState(newPages);
    setDraggedId(null);
    setSourceCol(null);
    setDraggedPageIdx(null);
  };

  const handleAddNewPage = () => {
    setPagesState([...pagesState, { left: [], right: [] }]);
  };

  const saveRearrange = () => {
    onChange({
      ...data,
      layout: {
        ...data.layout, // preserve other layout props if any (like flat left/right for fallback)
        pages: pagesState
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-shades-black-100/90 backdrop-blur-md z-[100] flex flex-col animate-in fade-in duration-300">

      {/* Top Bar */}
      <div className="h-16 bg-shades-black-100 border-b border-shades-black-80 shadow-sm shrink-0 flex items-center justify-between px-8 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-shades-black-80 rounded-lg text-shades-white-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </div>
          <h2 className="text-lg font-bold text-shades-white-100">Visual Rearrange</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-shades-black-60 hidden md:block">Drag sections between pages to optimize layout</span>
          <button onClick={onClose} className="p-2 hover:bg-shades-black-80 rounded-full text-shades-white-60 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Scrollable Desk Area */}
      <div className="flex-grow overflow-auto custom-scrollbar bg-shades-black-100 w-full flex items-start justify-center pt-10 pb-20 relative">
        <div className="flex gap-8 px-12 min-w-max items-start">

          {pagesWithHeights.map((page, pageIdx) => (
            <div key={pageIdx} className="flex flex-col gap-4 group">

              {/* Page Label */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-shades-black-60 uppercase tracking-widest">Page 0{pageIdx + 1}</span>
                {pageIdx === 0 && <span className="text-[9px] font-bold bg-shades-white-100 text-shades-black-100 px-2 py-0.5 rounded-full uppercase">Cover</span>}
              </div>

              {/* Paper Sheet */}
              <div
                className="bg-white transition-all duration-500 ease-out relative rounded-sm"
                style={{
                  width: `${PAPER_WIDTH}px`,
                  height: `${PAPER_HEIGHT}px`,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div className="relative h-full w-full p-4 flex flex-col gap-3">

                  {/* Header Visualization (Page 1 Only) */}
                  {pageIdx === 0 && (
                    <div className="shrink-0 h-[60px] border-b border-slate-100 flex flex-col justify-end pb-2 mb-1">
                      <div className="h-4 w-1/2 bg-slate-800 rounded-sm mb-2 opacity-80"></div>
                      <div className="h-2 w-1/3 bg-slate-400 rounded-sm opacity-60"></div>
                    </div>
                  )}

                  {/* Columns Container */}
                  <div className="flex-grow flex gap-3 h-full overflow-hidden">

                    {/* Left Column Drop Zone */}
                    <div
                      className={`w-[65%] h-full flex flex-col gap-2 transition-colors rounded-lg p-1
                                            ${draggedId && sourceCol !== 'left' ? 'bg-indigo-50/50 ring-2 ring-indigo-100 border-dashed border-2 border-indigo-200' : 'border border-transparent'}
                                            ${draggedId ? 'border-dashed border-slate-100' : ''}
                                           `}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop('left', pageIdx, page.left.length)}
                    >
                      {page.left.map((item, idx) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={() => handleDragStart(item.id, 'left', pageIdx)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => { e.stopPropagation(); handleDrop('left', pageIdx, idx); }}
                          style={{ height: `${item.height * VISUAL_SCALE}px` }}
                          className={`
                                                        relative bg-white border border-slate-200 shadow-sm rounded-md p-2 cursor-grab active:cursor-grabbing
                                                        hover:shadow-md hover:border-slate-400 hover:-translate-y-0.5 transition-all
                                                        flex flex-col gap-1 group/card
                                                        ${draggedId === item.id ? 'opacity-30 scale-95' : ''}
                                                    `}
                        >
                          <div className="w-1 h-full bg-slate-800 rounded-l-md absolute top-0 left-0 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase text-slate-700 truncate">{getSectionTitle(item.id)}</span>
                          </div>
                          {/* Skeleton Lines */}
                          <div className="space-y-1 opacity-20">
                            <div className="h-0.5 w-full bg-slate-800 rounded-full"></div>
                            <div className="h-0.5 w-5/6 bg-slate-800 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Column Drop Zone */}
                    <div
                      className={`w-[35%] h-full flex flex-col gap-2 transition-colors rounded-lg p-1
                                            ${draggedId && sourceCol !== 'right' ? 'bg-indigo-50/50 ring-2 ring-indigo-100 border-dashed border-2 border-indigo-200' : 'border border-transparent'}
                                            ${draggedId ? 'border-dashed border-slate-100' : ''}
                                           `}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop('right', pageIdx, page.right.length)}
                    >
                      {page.right.map((item, idx) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={() => handleDragStart(item.id, 'right', pageIdx)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => { e.stopPropagation(); handleDrop('right', pageIdx, idx); }}
                          style={{ height: `${item.height * VISUAL_SCALE}px` }}
                          className={`
                                                        relative bg-white border border-slate-200 shadow-sm rounded-md p-2 cursor-grab active:cursor-grabbing
                                                        hover:shadow-md hover:border-slate-400 hover:-translate-y-0.5 transition-all
                                                        flex flex-col gap-1 group/card
                                                        ${draggedId === item.id ? 'opacity-30 scale-95' : ''}
                                                    `}
                        >
                          <div className="w-full h-0.5 bg-slate-800 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity absolute top-0 left-0 right-0"></div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-bold uppercase text-slate-600 truncate">{getSectionTitle(item.id)}</span>
                          </div>
                          <div className="space-y-1 opacity-20">
                            <div className="h-0.5 w-full bg-slate-800 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 shadow-2xl rounded-full bg-shades-black-90 border border-shades-black-80 p-2 flex items-center gap-2 z-50 animate-in slide-in-from-bottom-6">
        <button onClick={onClose} className="px-6 py-3 rounded-full font-bold text-shades-white-60 hover:text-shades-white-100 hover:bg-shades-black-80 transition-colors">
          Cancel
        </button>
        <button onClick={saveRearrange} className="px-8 py-3 rounded-full bg-shades-white-100 text-shades-black-100 font-bold hover:bg-shades-white-90 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform flex items-center gap-2">
          <span>Save Layout</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        </button>
      </div>

    </div>
  );
};

export default RearrangeModal;
