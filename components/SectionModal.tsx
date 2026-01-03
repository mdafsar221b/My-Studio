import { PenTool, Briefcase, Zap, Heart, BarChart2, PieChart } from 'lucide-react';
import React from 'react';

interface SectionTemplate {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const TEMPLATES = [
  { id: 'custom', title: 'Custom', icon: <PenTool size={32} />, type: 'custom', description: 'Add your own custom section' },
  { id: 'projects', title: 'Projects', icon: <Briefcase size={32} />, type: 'projects', description: 'Showcase your best work' },
  { id: 'strengths', title: 'Strengths', icon: <Zap size={32} />, type: 'strengths', description: 'Highlight your key skills' },
  { id: 'volunteering', title: 'Volunteering', icon: <Heart size={32} />, type: 'volunteering', description: 'Community service experience' },
  { id: 'expertise', title: 'Expertise', icon: <BarChart2 size={32} />, type: 'expertise', description: 'Industry knowledge & skills' },
  { id: 'mytime', title: 'My Time', icon: <PieChart size={32} />, type: 'mytime', description: 'How you spend your day' },
];

interface Props {
  onClose: () => void;
  onAdd: (type: string) => void;
}

const SectionModal: React.FC<Props> = ({ onClose, onAdd }) => {
  return (
    <div className="fixed inset-0 bg-shades-black-100/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-shades-black-90 rounded-2xl w-full max-w-2xl border border-shades-black-80 shadow-2xl overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-shades-black-60 hover:text-shades-white-100 transition-colors p-2 hover:bg-shades-black-80 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-shades-white-100 mb-2">Add Section</h2>
            <p className="text-shades-black-60 text-sm">Choose a section type to add to your resume</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                className="group flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-shades-black-80 bg-shades-black-100/50 hover:bg-shades-black-80 hover:border-shades-white-60 transition-all hover:-translate-y-1 hover:shadow-lg"
                onClick={() => onAdd(tpl.type)}
              >
                <div className="text-shades-black-60 group-hover:text-shades-white-100 transition-colors group-hover:scale-110 duration-300">
                  {tpl.icon}
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-shades-white-90 text-sm group-hover:text-shades-white-100 mb-1">{tpl.title}</h3>
                  <p className="text-[10px] text-shades-black-60 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">{tpl.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionModal;
