
import React, { useState } from 'react';
import { Download, X, Printer, Loader2 } from 'lucide-react';
import { generatePDF } from './resume/utils/pdf-generator';
import { ResumeData } from '../types';
import ResumePage from './ResumePage';
import { paginateResume } from './resume/pagination'; // Import pagination logic

interface Props {
  data: ResumeData;
  onClose: () => void;
}

const PreviewModal: React.FC<Props> = ({ data, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generatePDF(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };
  // Calculate pages for preview
  const pages = React.useMemo(() => {
    try {
      return paginateResume(data);
    } catch (e) {
      console.error("Preview Pagination Failed", e);
      return [{ pageIndex: 0, left: [], right: [] }];
    }
  }, [data]);

  return (
    <div className="fixed inset-0 bg-shades-black-100/95 backdrop-blur-xl z-[200] flex flex-col items-center overflow-y-auto custom-scrollbar pt-8 pb-20 px-4 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-[900px] flex flex-col items-center relative">
        {/* Floating Controls */}
        <div className="fixed top-6 right-8 flex items-center gap-3 z-[210]">
          {/* <button
            onClick={() => window.print()}
            className="w-10 h-10 bg-shades-black-90 text-shades-black-60 rounded-full flex items-center justify-center border border-shades-black-80 hover:text-shades-white-100 hover:border-shades-white-60 transition-all shadow-lg"
            title="Quick Print"
          >
            <Printer size={18} />
          </button> */}
          <button
            onClick={onClose}
            className="w-10 h-10 bg-shades-black-90 text-shades-white-100 rounded-full flex items-center justify-center border border-shades-black-80 hover:bg-shades-white-100 hover:text-shades-black-100 transition-all shadow-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* The Actual Resume Content */}
        <div className="flex flex-col gap-8 w-full items-center pointer-events-none cursor-default mt-4">
          {pages.map((pageContent, idx) => (
            <div key={idx} className="bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] w-[794px] min-h-[1123px] transform-gpu overflow-hidden">
              <ResumePage
                pageIndex={idx}
                totalPageCount={pages.length}
                content={pageContent}
                data={data}
                onChange={() => { }}
                isReadOnly={true}
              />
            </div>
          ))}
        </div>

        {/* Floating Bottom Bar: User Tag & Download */}
        <div className="sticky bottom-8 left-1/2 -translate-x-1/2 bg-shades-black-90/90 backdrop-blur-xl border border-shades-black-80 pl-6 pr-2 py-2 rounded-full flex items-center gap-6 shadow-2xl z-[205] animate-in slide-in-from-bottom duration-500 hover:border-shades-black-70 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-shades-white-100 flex items-center justify-center text-shades-black-100 font-bold text-sm shadow-inner">
              {data.personalInfo.name?.[0] || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-shades-white-100 text-sm font-bold leading-tight">{data.personalInfo.name || 'User'}</span>
              <span className="text-shades-black-60 text-[9px] uppercase tracking-widest">{data.personalInfo.title?.split('|')[0] || 'My Resume'}</span>
            </div>
          </div>

          <div className="h-6 w-px bg-shades-black-80"></div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-2.5 bg-shades-white-100 text-shades-black-100 rounded-full text-sm font-bold hover:bg-shades-white-90 transition-all shadow-lg flex items-center gap-2 group disabled:opacity-75 disabled:cursor-wait"
          >
            {isDownloading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>Download PDF</span>
                <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
