
import React from 'react';

interface Props {
  onClose: () => void;
  isEmbeded?: boolean;
}

const ImproveTextPanel: React.FC<Props> = ({ onClose, isEmbeded = false }) => {
  return (
    <div className={`h-full w-[320px] bg-white border-r border-slate-200 z-[45] flex flex-col ${!isEmbeded ? 'absolute top-0 left-[260px] shadow-2xl animate-in slide-in-from-left duration-300' : ''}`}>
      <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <h3 className="font-bold text-slate-700 text-lg">Improve Text</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
        {/* Document Language */}
        <div className="p-6">
          <label className="block text-slate-600 font-medium mb-3">Document Language</label>
          <div className="relative">
            <div className="w-full border border-indigo-100 bg-indigo-50/20 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-indigo-50/40 transition-colors group">
              <span className="text-indigo-600 font-bold">Autodetected</span>
              <svg className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 mx-6"></div>

        {/* Tailored Suggestions */}
        <div className="p-6 flex items-center justify-between">
          <span className="text-slate-600 font-medium">Tailored Suggestions</span>
          <button className="w-12 h-6 bg-emerald-500 rounded-full relative transition-colors shadow-inner">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </button>
        </div>

        <div className="h-px bg-slate-100 mx-6"></div>

        {/* Spellcheck & Grammar */}
        <div className="p-6 space-y-3 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-semibold">Spellcheck & Grammar</span>
              <button className="text-slate-400 hover:text-slate-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2M9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/></svg>
              <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">Ensure your writing stays professional and error-free with instant spelling and grammar checks.</p>
        </div>

        <div className="h-px bg-slate-100 mx-6"></div>

        {/* Wording & Readability */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-semibold">Wording & Readability</span>
              <button className="text-slate-400 hover:text-slate-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2M9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/></svg>
              <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">Explain yourself better, avoid repetition and improve the overall readability.</p>
        </div>

        <div className="h-px bg-slate-100 mx-6"></div>

        {/* Recommendations */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-semibold">Recommendations</span>
              <button className="text-slate-400 hover:text-slate-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2M9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/></svg>
              <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">Get content tips, suggestions and alternative ways to express yourself.</p>
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-auto p-6 bg-slate-50/50 flex-shrink-0">
          <button className="w-full py-4 bg-[#2ECB8F] text-white rounded-lg font-bold text-lg hover:bg-[#27b37d] transition-all shadow-lg active:scale-[0.98]">
            Upgrade to See Mistakes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImproveTextPanel;
