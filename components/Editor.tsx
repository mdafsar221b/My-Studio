
import React, { useState, useMemo } from 'react';
import { Command, Eye, Download, Plus, Minus, Loader2 } from 'lucide-react';
import { ResumeData, CustomSection, TemplateType, DesignConfig } from '../types';
import Sidebar from './Sidebar';
import ResumePage from './ResumePage';
import SectionModal from './SectionModal';
import TemplatePanel from './TemplatePanel';
import RearrangeModal from './RearrangeModal';
import PremiumModal from './PremiumModal';
import DesignPanel from './DesignPanel';
import ImproveTextPanel from './ImproveTextPanel';
import DownloadPanel from './DownloadPanel';
import PreviewModal from './PreviewModal';
import { paginateResume } from './resume/pagination';
import { generatePDF } from './resume/utils/pdf-generator';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onBack: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Editor: React.FC<Props> = ({ data, onChange, onBack, onUndo, onRedo, canUndo, canRedo }) => {
  const [zoom, setZoom] = useState(85);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(false);
  const [isRearrangeModalOpen, setIsRearrangeModalOpen] = useState(false);
  const [isDesignPanelOpen, setIsDesignPanelOpen] = useState(false);
  const [isImprovePanelOpen, setIsImprovePanelOpen] = useState(false);
  const [isDownloadPanelOpen, setIsDownloadPanelOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isSidebarCollapsed = isTemplatePanelOpen || isDesignPanelOpen || isImprovePanelOpen || isDownloadPanelOpen;

  // Calculate pagination on data change
  const pages = useMemo(() => {
    try {
      return paginateResume(data);
    } catch (e) {
      console.error("Pagination Failed", e);
      // Fallback to avoid white screen
      return [{ pageIndex: 0, left: [], right: [] }];
    }
  }, [data]);

  const handleAddSection = (type: string) => {
    const newSection: CustomSection = {
      id: `section-${Date.now()}`,
      type: type as any,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      items: type === 'expertise' ? [
        { label: 'Leadership', value: 80 },
        { label: 'Management', value: 60 }
      ] : type === 'projects' ? [
        { title: 'New Project', date: '2024', description: ['Key contribution 1'] }
      ] : type === 'strengths' ? [
        { label: 'Go-getter', description: 'Driven and focused on results.' }
      ] : []
    };

    const newData = {
      ...data,
      sections: [...(data.sections || []), newSection]
    };

    // Add to layout (default to left column of first page or main layout)
    if (newData.layout?.pages && newData.layout.pages.length > 0) {
      newData.layout.pages[0].left = [...newData.layout.pages[0].left, newSection.id];
    } else if (newData.layout) {
      newData.layout.left = [...(newData.layout.left || []), newSection.id];
    } else {
      // Initialize layout if missing
      newData.layout = {
        left: ['experience', 'education', newSection.id],
        right: ['summary', 'achievements', 'skills', 'certifications']
      };
    }

    onChange(newData);
    setIsSectionModalOpen(false);
  };

  const handleTemplateSelect = (id: TemplateType) => {
    onChange({
      ...data,
      template: id
    });
  };

  const handleDesignChange = (config: DesignConfig) => {
    onChange({
      ...data,
      design: config
    });
  };

  return (
    <div className="flex flex-col h-screen bg-shades-black-100 overflow-hidden text-shades-white-80">
      {isSectionModalOpen && (
        <SectionModal
          onClose={() => setIsSectionModalOpen(false)}
          onAdd={handleAddSection}
        />
      )}

      {isRearrangeModalOpen && (
        <RearrangeModal
          data={data}
          onChange={onChange}
          onClose={() => setIsRearrangeModalOpen(false)}
        />
      )}

      {isPreviewModalOpen && (
        <PreviewModal
          data={data}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}

      {isPremiumModalOpen && (
        <PremiumModal
          onClose={() => setIsPremiumModalOpen(false)}
        />
      )}

      {/* Header */}
      <div className="h-16 bg-shades-black-100 border-b border-shades-black-80 z-[60] flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-shades-white-100">
            <Command size={24} />
            <span className="font-bold text-xl tracking-tight text-shades-white-100">MY STUDIO</span>
          </div>
          <div className="h-6 w-px bg-shades-black-80 mx-2"></div>
          <button onClick={onBack} className="text-shades-black-60 hover:text-shades-white-100 text-sm font-medium transition-colors">Exit Editor</button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm text-shades-black-60">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-shades-black-60 shadow-[0_0_8px_rgba(102,112,133,0.5)]"></span>
              Sign up to save work
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 border border-shades-black-70 text-shades-white-80 rounded-lg font-medium text-sm hover:bg-shades-black-80 transition-colors">Login</button>
            <button className="px-4 py-1.5 bg-shades-white-100 text-shades-black-100 rounded-lg font-medium text-sm hover:bg-shades-white-90 transition-colors shadow-lg shadow-black/20">Sign Up</button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Sidebar Controls */}
        <div className={`${isSidebarCollapsed ? 'w-[72px]' : 'w-[260px]'} flex-shrink-0 bg-shades-black-100 border-r border-shades-black-80 flex flex-col z-[50] transition-all duration-300`}>
          <Sidebar
            data={data}
            onChange={onChange}
            onOpenPremium={() => {
              setIsPremiumModalOpen(true);
            }}
            onOpenAddSection={() => {
              setIsTemplatePanelOpen(false);
              setIsRearrangeModalOpen(false);
              setIsDesignPanelOpen(false);
              setIsImprovePanelOpen(false);
              setIsDownloadPanelOpen(false);
              setIsSectionModalOpen(true);
            }}
            onOpenTemplates={() => {
              setIsSectionModalOpen(false);
              setIsRearrangeModalOpen(false);
              setIsDesignPanelOpen(false);
              setIsImprovePanelOpen(false);
              setIsDownloadPanelOpen(false);
              setIsTemplatePanelOpen(!isTemplatePanelOpen);
            }}
            onOpenRearrange={() => {
              setIsSectionModalOpen(false);
              setIsTemplatePanelOpen(false);
              setIsDesignPanelOpen(false);
              setIsImprovePanelOpen(false);
              setIsDownloadPanelOpen(false);
              setIsRearrangeModalOpen(true);
            }}
            onOpenDesign={() => {
              setIsSectionModalOpen(false);
              setIsTemplatePanelOpen(false);
              setIsRearrangeModalOpen(false);
              setIsImprovePanelOpen(false);
              setIsDownloadPanelOpen(false);
              setIsDesignPanelOpen(!isDesignPanelOpen);
            }}
            onOpenImprove={() => {
              setIsSectionModalOpen(false);
              setIsTemplatePanelOpen(false);
              setIsRearrangeModalOpen(false);
              setIsDesignPanelOpen(false);
              setIsDownloadPanelOpen(false);
              setIsImprovePanelOpen(!isImprovePanelOpen);
            }}
            onOpenDownload={() => {
              setIsSectionModalOpen(false);
              setIsTemplatePanelOpen(false);
              setIsRearrangeModalOpen(false);
              setIsDesignPanelOpen(false);
              setIsImprovePanelOpen(false);
              setIsDownloadPanelOpen(!isDownloadPanelOpen);
            }}
            onUndo={onUndo}
            onRedo={onRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            isCollapsed={isSidebarCollapsed}
            activePanel={isTemplatePanelOpen ? 'templates' : isDesignPanelOpen ? 'design' : isImprovePanelOpen ? 'improve' : isDownloadPanelOpen ? 'download' : undefined}
          />
        </div>

        {/* Secondary Panels Area (Design, Templates, Improve, Download) */}
        <div className="flex relative h-full">
          {isTemplatePanelOpen && (
            <div className="w-[320px] h-full flex-shrink-0">
              <TemplatePanel
                activeTemplate={data.template || 'double-column'}
                onSelect={handleTemplateSelect}
                onClose={() => setIsTemplatePanelOpen(false)}
                isEmbeded={true}
              />
            </div>
          )}

          {isDesignPanelOpen && (
            <div className="w-[320px] h-full flex-shrink-0">
              <DesignPanel
                design={data.design || { margins: 2, sectionSpacing: 3, primaryColor: '#00C3A5', fontFamily: 'Inter', fontSize: 'normal', lineHeight: 1.5, columnLayout: 2 }}
                onChange={handleDesignChange}
                onClose={() => setIsDesignPanelOpen(false)}
                isEmbeded={true}
              />
            </div>
          )}

          {isImprovePanelOpen && (
            <div className="w-[320px] h-full flex-shrink-0">
              <ImproveTextPanel
                onClose={() => setIsImprovePanelOpen(false)}
                isEmbeded={true}
              />
            </div>
          )}

          {isDownloadPanelOpen && (
            <div className="w-[320px] h-full flex-shrink-0">
              <DownloadPanel
                data={data}
                onClose={() => setIsDownloadPanelOpen(false)}
                onPreview={() => setIsPreviewModalOpen(true)}
                isEmbeded={true}
              />
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-grow flex flex-col items-center overflow-y-auto pt-12 pb-24 relative bg-shades-black-100 custom-scrollbar bg-[radial-gradient(#373F4E_1px,transparent_1px)] [background-size:20px_20px]">
          <div
            className="flex flex-col items-center gap-12 transition-all duration-300 origin-top"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {/* Dynamic Page Rendering */}
            <div className="absolute top-0 -right-20 flex flex-col gap-3">
              <button
                onClick={() => setIsPreviewModalOpen(true)}
                className="w-12 h-12 bg-shades-black-90 rounded-full text-shades-white-60 border border-shades-black-80 shadow-lg hover:text-white hover:bg-shades-black-80 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative"
                title="Preview Resume"
              >
                <Eye size={20} />
                <span className="absolute right-full mr-3 bg-shades-black-90 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Preview</span>
              </button>

              <button
                onClick={async () => {
                  setIsDownloading(true);
                  try {
                    await generatePDF(data);
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setIsDownloading(false);
                  }
                }}
                disabled={isDownloading}
                className={`w-12 h-12 bg-shades-white-100 rounded-full text-shades-black-100 shadow-lg shadow-black/20 hover:bg-shades-white-90 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative ${isDownloading ? 'opacity-75 cursor-wait' : ''}`}
                title="Download Resume PDF"
              >
                {isDownloading ? (
                  <Loader2 size={20} className="animate-spin opacity-75" />
                ) : (
                  <Download size={20} />
                )}
                <span className="absolute right-full mr-3 bg-shades-black-90 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {isDownloading ? 'Generating PDF...' : 'Download PDF'}
                </span>
              </button>
            </div>

            {pages.map((pageContent, idx) => (
              <div key={idx} className="resume-shadow printable-resume-page bg-white w-[794px] min-h-[1123px] p-0 relative group shrink-0">
                <ResumePage
                  pageIndex={idx}
                  totalPageCount={pages.length}
                  content={pageContent}
                  data={data}
                  onChange={onChange}
                />
              </div>
            ))}


          </div>

          {/* Zoom Controls */}
          <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
            <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="w-10 h-10 bg-shades-black-90 shadow-xl border border-shades-black-80 rounded-full flex items-center justify-center hover:bg-shades-black-80 text-shades-white-60 hover:text-white font-bold transition-all transform hover:scale-105 active:scale-95">
              <Plus size={20} />
            </button>
            <button onClick={() => setZoom(z => Math.max(30, z - 10))} className="w-10 h-10 bg-shades-black-90 shadow-xl border border-shades-black-80 rounded-full flex items-center justify-center hover:bg-shades-black-80 text-shades-white-60 hover:text-white font-bold transition-all transform hover:scale-105 active:scale-95">
              <Minus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
