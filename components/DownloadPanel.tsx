
import React from 'react';

interface Props {
  onClose: () => void;
  onPreview: () => void;
  isEmbeded?: boolean;
}

const DownloadPanel: React.FC<Props> = ({ onClose, onPreview, isEmbeded = false }) => {
  const options = [
    { id: 'pdf', label: 'PDF Document', icon: '', color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'txt', label: 'Plain Text', icon: '', color: 'text-slate-500', bg: 'bg-slate-50' },
    { id: 'print', label: 'Quick Print', icon: '', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'docx', label: 'DOCX (Word)', icon: '', color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className={`h-full w-[320px] bg-white border-r border-slate-200 z-[45] flex flex-col ${!isEmbeded ? 'absolute top-0 left-[260px] shadow-2xl animate-in slide-in-from-left duration-300' : ''}`}>
      <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <h3 className="font-bold text-slate-700 text-lg uppercase tracking-wider">Download</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-4">
        <p className="text-slate-500 text-sm mb-6">Choose your preferred format to export your professional resume.</p>
        
        {options.map((opt) => (
          <button 
            key={opt.id}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 transition-all hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 group ${opt.bg}/40`}
            onClick={() => opt.id === 'print' ? window.print() : null}
          >
            <span className={`text-2xl ${opt.color} group-hover:scale-110 transition-transform`}>{opt.icon}</span>
            <div className="text-left">
              <span className="block font-bold text-slate-700">{opt.label}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Recommended</span>
            </div>
          </button>
        ))}

        <div className="pt-6">
          <button 
            onClick={onPreview}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span></span>Preview
          </button>
          <p className="mt-4 text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.2em]">Check everything before export</p>
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Document sync: ON</span>
        </div>
        <button onClick={onClose} className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-sm active:scale-95">Back to Editor</button>
      </div>
    </div>
  );
};

export default DownloadPanel;
