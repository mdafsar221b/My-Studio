
import React from 'react';
import { DesignConfig } from '../types';

interface Props {
  design: DesignConfig;
  onChange: (config: DesignConfig) => void;
  onClose: () => void;
  isEmbeded?: boolean;
}

const COLORS = ['#007BFF', '#00C3A5', '#D0021B', '#9013FE', '#00BCD4', '#2C3E50'];
const FONTS = ['Inter', 'Rubik', 'Roboto', 'Playfair Display', 'Merriweather', 'Lora'];

const DesignPanel: React.FC<Props> = ({ design, onChange, onClose, isEmbeded = false }) => {
  const updateDesign = (key: keyof DesignConfig, value: any) => {
    onChange({ ...design, [key]: value });
  };

  return (
    <div className={`h-full w-[320px] bg-shades-black-90 border-r border-shades-black-80 z-[45] flex flex-col ${!isEmbeded ? 'absolute top-0 left-[260px] shadow-2xl animate-in slide-in-from-left duration-300' : ''}`}>
      <div className="p-6 border-b border-shades-black-80 flex items-center justify-between flex-shrink-0">
        <h3 className="font-bold text-shades-white-100 uppercase tracking-widest text-xs">Design & Font</h3>
        <button onClick={onClose} className="text-shades-black-60 hover:text-shades-white-100 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-10 pb-20 custom-scrollbar">
        {/* Page Margins */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-bold text-shades-black-60 uppercase tracking-widest">Page Margins: {design.margins}</span>
          </div>
          <div className="relative h-6 flex items-center px-2 mb-2">
            <div className="absolute left-2 right-2 h-1 bg-shades-black-80 rounded-full"></div>
            <input
              type="range" min="1" max="5" step="1"
              value={design.margins}
              onChange={(e) => updateDesign('margins', parseInt(e.target.value))}
              className="w-full relative z-10 accent-shades-white-100 h-1 appearance-none bg-transparent cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[9px] text-shades-black-60 font-bold uppercase tracking-wider px-2">
            <span>narrow</span>
            <span>wide</span>
          </div>
        </section>

        {/* Section Spacing */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-bold text-shades-black-60 uppercase tracking-widest">Section Spacing: {design.sectionSpacing}</span>
          </div>
          <div className="relative h-6 flex items-center px-2 mb-2">
            <div className="absolute left-2 right-2 h-1 bg-shades-black-80 rounded-full"></div>
            <input
              type="range" min="1" max="5" step="1"
              value={design.sectionSpacing}
              onChange={(e) => updateDesign('sectionSpacing', parseInt(e.target.value))}
              className="w-full relative z-10 accent-shades-white-100 h-1 appearance-none bg-transparent cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[9px] text-shades-black-60 font-bold uppercase tracking-wider px-2">
            <span>compact</span>
            <span>more space</span>
          </div>
        </section>

        <div className="h-px bg-shades-black-80 mx-2"></div>

        {/* Colors */}
        <section>
          <span className="text-[10px] font-bold text-shades-black-60 uppercase tracking-widest mb-6 block">Colors</span>
          <div className="grid grid-cols-5 gap-3">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => updateDesign('primaryColor', c)}
                className={`aspect-square rounded-full border-2 transition-all flex items-center justify-center ${design.primaryColor === c ? 'border-indigo-500 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: c }}
              >
                {design.primaryColor === c && <span className="text-white text-[10px] font-bold">✓</span>}
              </button>
            ))}
          </div>
          <button className="mt-6 text-[11px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors uppercase tracking-widest underline decoration-2 underline-offset-4">Use custom color</button>
        </section>

        <div className="h-px bg-slate-100 mx-2"></div>

        {/* Font Style */}
        <section>
          <span className="text-[10px] font-bold text-shades-black-60 uppercase tracking-widest mb-6 block">Font Style</span>
          <div className="relative">
            <select
              value={design.fontFamily}
              onChange={(e) => updateDesign('fontFamily', e.target.value)}
              className="w-full border border-shades-black-80 rounded-xl p-3 text-sm text-shades-white-90 appearance-none bg-shades-black-100 cursor-pointer focus:ring-4 focus:ring-shades-white-100/10 focus:border-shades-white-100 outline-none transition-all"
              style={{ fontFamily: design.fontFamily }}
            >
              {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-shades-black-60">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </section>

        {/* Font Size */}
        <section>
          <span className="text-[10px] font-bold text-shades-black-60 uppercase tracking-widest mb-6 block">Font Size: {design.fontSize.toUpperCase()}</span>
          <div className="relative h-6 flex items-center px-2 mb-2">
            <div className="absolute left-2 right-2 h-1 bg-shades-black-80 rounded-full"></div>
            <input
              type="range" min="0" max="2" step="1"
              value={design.fontSize === 'small' ? 0 : design.fontSize === 'normal' ? 1 : 2}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateDesign('fontSize', val === 0 ? 'small' : val === 1 ? 'normal' : 'large');
              }}
              className="w-full relative z-10 accent-shades-white-100 h-1 appearance-none bg-transparent cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[9px] text-shades-black-60 font-bold uppercase tracking-wider px-2">
            <span className="text-[10px]">- A</span>
            <span className="text-sm">+ A</span>
          </div>
        </section>

        {/* Line Height */}
        <section>
          <span className="text-[10px] font-bold text-shades-black-60 uppercase tracking-widest mb-6 block">Line Height: {design.lineHeight}</span>
          <div className="relative h-6 flex items-center px-2 mb-2">
            <div className="absolute left-2 right-2 h-1 bg-shades-black-80 rounded-full"></div>
            <input
              type="range" min="1" max="2" step="0.1"
              value={design.lineHeight}
              onChange={(e) => updateDesign('lineHeight', parseFloat(e.target.value))}
              className="w-full relative z-10 accent-shades-white-100 h-1 appearance-none bg-transparent cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[9px] text-shades-black-60 font-bold uppercase tracking-wider px-2">
            <span>condensed</span>
            <span>spacious</span>
          </div>
        </section>

        <div className="h-px bg-shades-black-80 mx-2"></div>

        {/* Column Layout */}
        <section>
          <span className="text-[10px] font-bold text-shades-black-60 uppercase tracking-widest mb-6 block">Column Layout:</span>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => updateDesign('columnLayout', num)}
                className={`aspect-square border-2 rounded-xl p-2 flex transition-all ${design.columnLayout === num ? 'border-shades-white-100 bg-shades-white-100/10 shadow-sm' : 'border-shades-black-80 hover:border-shades-black-60 hover:bg-shades-black-80'}`}
              >
                <div className="flex h-full w-full gap-1">
                  <div className={`h-full bg-shades-black-60 rounded-sm ${num === 1 ? 'w-3/4' : num === 2 ? 'w-1/2' : num === 3 ? 'w-2/3' : 'w-1/3'}`}></div>
                  <div className={`h-full bg-shades-black-80 rounded-sm flex-grow`}></div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-shades-black-60 font-bold mt-3 px-2">
            <span className="flex-1 text-center">1</span>
            <span className="flex-1 text-center">2</span>
            <span className="flex-1 text-center">3</span>
            <span className="flex-1 text-center">4</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignPanel;
