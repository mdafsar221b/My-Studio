
import React, { useState, useMemo } from 'react';
import { ResumeData, CustomSection, TemplateType, DesignConfig } from '../types';
import Sidebar from './Sidebar';
import ResumePage from './ResumePage';
import SectionModal from './SectionModal';
import TemplatePanel from './TemplatePanel';
import RearrangeModal from './RearrangeModal';
import DesignPanel from './DesignPanel';
import ImproveTextPanel from './ImproveTextPanel';
import DownloadPanel from './DownloadPanel';
import PreviewModal from './PreviewModal';
import { paginateResume } from './resume/pagination';

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

    onChange({
      ...data,
      sections: [...(data.sections || []), newSection]
    });
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
    <div className="flex flex-col h-screen bg-[#F0F2F5] overflow-hidden">
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

      {/* Header */}
      <div className="h-16 bg-white border-b border-slate-200 z-[60] flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-teal-600">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
            </svg>
            <span className="font-bold text-xl tracking-tight text-teal-700">MY STUDIO</span>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <button onClick={onBack} className="text-slate-500 hover:text-slate-700 text-sm font-medium">Exit Editor</button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Sign up to save work
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 border border-teal-600 text-teal-600 rounded font-medium text-sm hover:bg-teal-50 transition-colors">Login</button>
            <button className="px-4 py-1.5 bg-teal-500 text-white rounded font-medium text-sm hover:bg-teal-600 transition-colors shadow-sm">Sign Up</button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Sidebar Controls */}
        <div className={`${isSidebarCollapsed ? 'w-[72px]' : 'w-[260px]'} flex-shrink-0 bg-white border-r border-slate-200 flex flex-col z-[50] transition-all duration-300`}>
          <Sidebar
            data={data}
            onChange={onChange}
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
                onClose={() => setIsDownloadPanelOpen(false)}
                onPreview={() => setIsPreviewModalOpen(true)}
                isEmbeded={true}
              />
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-grow flex flex-col items-center overflow-y-auto pt-12 pb-24 relative bg-[#F0F2F5] custom-scrollbar">
          <div
            className="flex flex-col items-center gap-12 transition-all duration-300 origin-top"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {/* Page Rendering */}
            {pages.map((pageContent, idx) => (
              <div key={idx} className="resume-shadow bg-white w-[850px] min-h-[1100px] p-0 relative group shrink-0">
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
            <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="w-10 h-10 bg-white shadow-lg border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 text-slate-600 font-bold transition-all transform hover:scale-105 active:scale-95">+</button>
            <button onClick={() => setZoom(z => Math.max(30, z - 10))} className="w-10 h-10 bg-white shadow-lg border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 text-slate-600 font-bold transition-all transform hover:scale-105 active:scale-95">-</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
