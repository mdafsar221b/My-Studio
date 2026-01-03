
import React from 'react';
import { ResumeData } from '../types';
import ResumePage from './ResumePage';

interface Props {
  data: ResumeData;
  onClose: () => void;
}

const PreviewModal: React.FC<Props> = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[200] flex flex-col items-center overflow-y-auto custom-scrollbar pt-12 pb-24 px-4 select-none">
      <div className="w-full max-w-[900px] flex flex-col items-center relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="fixed top-8 right-12 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-indigo-600 hover:scale-110 active:scale-95 transition-all z-[210]"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Modal Header for the Resume */}
        <div className="w-full flex justify-between items-end mb-10 px-6">
           <div className="animate-in fade-in slide-in-from-left duration-500">
             <h2 className="text-3xl font-bold text-white mb-2">Resume Preview</h2>
             <p className="text-slate-400 text-sm">Review your final layout and content for accuracy.</p>
           </div>
           <div className="flex gap-3 animate-in fade-in slide-in-from-right duration-500">
             <button className="px-6 py-2 bg-white/10 text-white border border-white/20 rounded-full text-sm font-bold hover:bg-white/20 transition-all">Download PDF</button>
             <button onClick={() => window.print()} className="px-6 py-2 bg-emerald-500 text-white rounded-full text-sm font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all">Quick Print</button>
           </div>
        </div>

        {/* The Actual Resume Content */}
        <div className="flex flex-col gap-12 w-full items-center pointer-events-none cursor-default animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] w-[850px] min-h-[1100px] transform-gpu overflow-hidden">
             <ResumePage page={1} data={data} onChange={() => {}} isReadOnly={true} />
          </div>
          <div className="bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] w-[850px] min-h-[1100px] transform-gpu overflow-hidden">
             <ResumePage page={2} data={data} onChange={() => {}} isReadOnly={true} />
          </div>
        </div>

        {/* Floating User Initial for High Fidelity feel */}
        <div className=" sticky bottom-12 left-1/2 -translate-x-1/2 bg-white/5 border border-white/10 backdrop-blur-xl px-8 py-4 rounded-full flex items-center gap-6 shadow-2xl z-[205] animate-in slide-in-from-bottom duration-500">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                {data.personalInfo.name?.[0] || 'U'}
              </div>
              <div>
                <p className="text-indigo-500 text-sm font-bold leading-tight">{data.personalInfo.name}</p>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest">{data.personalInfo.title?.split('|')[0] || 'Professional'}</p>
              </div>
           </div>
           <div className="h-8 w-px bg-white/10"></div>
           <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Back to Editor</button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
