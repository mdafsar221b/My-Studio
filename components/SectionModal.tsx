
import React from 'react';

interface SectionTemplate {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
}

const TEMPLATES = [
  { id: 'custom', title: 'Custom', icon: '', type: 'custom' },
  { id: 'projects', title: 'Projects', icon: '', type: 'projects' },
  { id: 'strengths', title: 'Strengths', icon: '', type: 'strengths' },
  { id: 'volunteering', title: 'Volunteering', icon: '', type: 'volunteering' },
  { id: 'expertise', title: 'Industry Expertise', icon: '', type: 'expertise' },
  { id: 'mytime', title: 'My time', icon: '', type: 'mytime' },
];

interface Props {
  onClose: () => void;
  onAdd: (type: string) => void;
}

const SectionModal: React.FC<Props> = ({ onClose, onAdd }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden relative flex flex-col animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-12 text-center">
          <h2 className="text-4xl font-semibold text-slate-800 mb-2">Add a new section</h2>
          <p className="text-slate-500 mb-10 text-lg">Click on a section to add it to your resume</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEMPLATES.map((tpl) => (
              <div key={tpl.id} className="group cursor-pointer" onClick={() => onAdd(tpl.type)}>
                <div className="aspect-[4/3] bg-white border border-slate-200 rounded-lg shadow-sm group-hover:shadow-md group-hover:border-[#00C3A5] transition-all p-4 flex flex-col relative overflow-hidden mb-3">
                  {/* Visual Mock of the section */}
                  <div className="border-b border-teal-500/20 pb-1 mb-2">
                    <div className="h-2 w-16 bg-teal-500/10 rounded mb-1"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-slate-100 rounded"></div>
                    <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                    <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                  </div>
                  {tpl.type === 'mytime' && (
                    <div className="mt-auto flex justify-center">
                       <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-500"></div>
                    </div>
                  )}
                  {tpl.type === 'expertise' && (
                    <div className="mt-auto space-y-2">
                       <div className="h-1.5 w-full bg-slate-100 rounded overflow-hidden">
                         <div className="h-full w-2/3 bg-teal-500/50"></div>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded overflow-hidden">
                         <div className="h-full w-1/2 bg-teal-500/50"></div>
                       </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl">
                       {tpl.icon}
                     </div>
                  </div>
                </div>
                <p className="font-medium text-slate-700 group-hover:text-[#00C3A5] transition-colors">{tpl.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionModal;
