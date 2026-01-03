
import React from 'react';
import { FileText, Printer, File, FileType, Eye } from 'lucide-react';

import { generatePDF } from './resume/utils/pdf-generator';
import { ResumeData } from '../types';

interface Props {
  data: ResumeData;
  onClose: () => void;
  onPreview: () => void;
  isEmbeded?: boolean;
}

const DownloadPanel: React.FC<Props> = ({ data, onClose, onPreview, isEmbeded = false }) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async (id: string) => {
    if (id === 'print') {
      window.print();
    } else if (id === 'pdf') {
      setIsDownloading(true);
      try {
        await generatePDF(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const options = [
    { id: 'pdf', label: 'PDF Document', icon: <FileText size={24} />, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'txt', label: 'Plain Text', icon: <File size={24} />, color: 'text-slate-500', bg: 'bg-slate-50' },
    { id: 'print', label: 'Quick Print', icon: <Printer size={24} />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'docx', label: 'DOCX (Word)', icon: <FileType size={24} />, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className={`h-full w-[320px] bg-shades-black-90 border-r border-shades-black-80 z-[45] flex flex-col ${!isEmbeded ? 'absolute top-0 left-[260px] shadow-2xl animate-in slide-in-from-left duration-300' : ''}`}>
      <div className="p-6 border-b border-shades-black-80 flex items-center justify-between flex-shrink-0">
        <h3 className="font-bold text-shades-white-100 text-lg uppercase tracking-wider">Download</h3>
        <button onClick={onClose} className="text-shades-black-60 hover:text-shades-white-100 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
        <p className="text-shades-black-60 text-sm mb-4">Export format</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {options.map((opt) => (
            <button
              key={opt.id}
              className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-shades-black-80 transition-all hover:border-shades-white-60 hover:shadow-md hover:-translate-y-0.5 group bg-shades-black-100/50`}
              onClick={() => handleDownload(opt.id)}
              disabled={isDownloading}
            >
              <div className={`p-2 rounded-full bg-shades-black-80 ${opt.color} group-hover:scale-110 transition-transform`}>
                {opt.icon}
              </div>
              <span className="font-bold text-shades-white-90 text-xs">{opt.label}</span>
            </button>
          ))}
        </div>

        <div className="">
          <button
            onClick={onPreview}
            className="w-full py-3 bg-shades-white-100 text-shades-black-100 rounded-xl font-bold text-base hover:bg-shades-white-90 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Eye size={18} />
            Preview Document
          </button>
        </div>
      </div>

      <div className="p-6 border-t border-shades-black-80 bg-shades-black-100/50 flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-shades-black-60 uppercase tracking-widest">Live Document sync: ON</span>
        </div>
        <button onClick={onClose} className="w-full py-3 border border-shades-black-80 text-shades-white-80 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-shades-black-80 transition-all shadow-sm active:scale-95">Back to Editor</button>
      </div>
    </div>
  );
};

export default DownloadPanel;
