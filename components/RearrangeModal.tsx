
import React, { useState } from 'react';
import { ResumeData, ResumeLayout } from '../types';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onClose: () => void;
}

const RearrangeModal: React.FC<Props> = ({ data, onChange, onClose }) => {
  const [layout, setLayout] = useState<ResumeLayout>(
    data.layout || { 
      left: ['experience', 'education'], 
      right: ['summary', 'certifications', 'achievements', ...(data.sections.map(s => s.id))] 
    }
  );

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [sourceCol, setSourceCol] = useState<'left' | 'right' | null>(null);

  const handleDragStart = (id: string, col: 'left' | 'right') => {
    setDraggedId(id);
    setSourceCol(col);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetCol: 'left' | 'right', targetIdx: number) => {
    if (!draggedId || !sourceCol) return;

    const newLayout = { ...layout };
    // Remove from source column
    newLayout[sourceCol] = newLayout[sourceCol].filter(id => id !== draggedId);
    
    // Safety check for target index
    const actualIdx = targetIdx > newLayout[targetCol].length ? newLayout[targetCol].length : targetIdx;
    
    // Add to target column at specific index
    newLayout[targetCol].splice(actualIdx, 0, draggedId);

    setLayout({ ...newLayout });
    setDraggedId(null);
    setSourceCol(null);
  };

  const saveRearrange = () => {
    onChange({ ...data, layout });
    onClose();
  };

  const getSectionTitle = (id: string) => {
    if (id === 'experience') return 'Experience';
    if (id === 'education') return 'Education';
    if (id === 'summary') return 'Summary';
    if (id === 'certifications') return 'Certification';
    if (id === 'achievements') return 'Achievements';
    return data.sections.find(s => s.id === id)?.title || id;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-start overflow-y-auto px-4">
      <div className="w-full max-w-4xl py-12 flex flex-col items-center gap-10">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-4xl md:text-5xl font-semibold text-white text-center leading-tight max-w-2xl">Hold & Drag the boxes to rearrange the sections</h2>

        <div className="flex flex-col items-center gap-6 w-full">
          <p className="text-white/40 text-sm font-bold uppercase tracking-[0.3em]">Editor Preview</p>
          
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[750px] min-h-[500px] flex flex-col">
            {/* Header Mock */}
            <div className="h-20 bg-slate-50 border-2 border-slate-100 rounded-xl mb-6 flex items-center justify-center relative">
               <span className="absolute left-6 text-slate-300">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17a2 2 0 002-2c0-1.11-.89-2-2-2a2 2 0 00-2 2c0 1.11.89 2 2 2m6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2M9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/></svg>
               </span>
               <span className="text-slate-300 font-bold text-xs uppercase tracking-[0.2em]">Personal Information (Fixed)</span>
            </div>

            <div className="flex gap-6 flex-grow">
              {/* Left Column Area */}
              <div 
                className={`w-3/5 space-y-3 p-3 rounded-xl border-2 border-dashed transition-colors ${draggedId ? 'border-teal-200 bg-teal-50/20' : 'border-slate-100 bg-slate-50/30'}`}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop('left', layout.left.length)}
              >
                 {layout.left.map((id, idx) => (
                   <div
                    key={id}
                    draggable
                    onDragStart={() => handleDragStart(id, 'left')}
                    onDragOver={handleDragOver}
                    onDrop={(e) => { e.stopPropagation(); handleDrop('left', idx); }}
                    className={`bg-white border border-slate-200 rounded-xl p-5 cursor-grab active:cursor-grabbing transition-all group hover:border-[#00C3A5] hover:shadow-lg flex items-center gap-4 ${draggedId === id ? 'opacity-20 scale-95 grayscale' : ''}`}
                   >
                     <div className="flex flex-col gap-1 opacity-20 group-hover:opacity-100 group-hover:text-teal-500">
                       <div className="w-4 h-0.5 bg-current rounded-full"></div>
                       <div className="w-4 h-0.5 bg-current rounded-full"></div>
                       <div className="w-4 h-0.5 bg-current rounded-full"></div>
                     </div>
                     <span className="text-slate-600 font-bold text-sm uppercase tracking-wide">{getSectionTitle(id)}</span>
                   </div>
                 ))}
                 {layout.left.length === 0 && <div className="h-20 flex items-center justify-center text-slate-300 text-xs italic">Drop sections here</div>}
              </div>

              {/* Right Column Area */}
              <div 
                className={`w-2/5 space-y-3 p-3 rounded-xl border-2 border-dashed transition-colors ${draggedId ? 'border-teal-200 bg-teal-50/20' : 'border-slate-100 bg-slate-50/30'}`}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop('right', layout.right.length)}
              >
                 {layout.right.map((id, idx) => (
                   <div
                    key={id}
                    draggable
                    onDragStart={() => handleDragStart(id, 'right')}
                    onDragOver={handleDragOver}
                    onDrop={(e) => { e.stopPropagation(); handleDrop('right', idx); }}
                    className={`bg-white border border-slate-200 rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all group hover:border-[#00C3A5] hover:shadow-lg flex items-center gap-4 ${draggedId === id ? 'opacity-20 scale-95 grayscale' : ''}`}
                   >
                     <div className="flex flex-col gap-1 opacity-20 group-hover:opacity-100 group-hover:text-teal-500">
                       <div className="w-3 h-0.5 bg-current rounded-full"></div>
                       <div className="w-3 h-0.5 bg-current rounded-full"></div>
                       <div className="w-3 h-0.5 bg-current rounded-full"></div>
                     </div>
                     <span className="text-slate-600 font-bold text-[11px] uppercase tracking-wide">{getSectionTitle(id)}</span>
                   </div>
                 ))}
                 {layout.right.length === 0 && <div className="h-20 flex items-center justify-center text-slate-300 text-xs italic">Drop sections here</div>}
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={saveRearrange}
          className="mt-4 bg-[#00C3A5] text-white px-16 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:bg-[#00a88e] hover:shadow-[#00C3A5]/20 transition-all transform hover:-translate-y-1 active:scale-95 mb-24"
        >
          Finished Rearranging
        </button>
      </div>
    </div>
  );
};

export default RearrangeModal;
