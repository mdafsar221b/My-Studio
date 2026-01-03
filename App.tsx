
import React, { useState, useCallback } from 'react';
import { ResumeData } from './types';
import { INITIAL_RESUME_DATA } from './constants';
import Editor from './components/Editor';
import UploadForm from './components/UploadForm';
import { Sparkles, Palette, Zap, Check, ArrowRight } from 'lucide-react';

const MAX_HISTORY = 50;

const App: React.FC = () => {
  const [history, setHistory] = useState<{
    past: ResumeData[];
    present: ResumeData | null;
    future: ResumeData[];
  }>({
    past: [],
    present: null,
    future: [],
  });
  const [isEditing, setIsEditing] = useState(false);

  const setResumeData = useCallback((newData: ResumeData) => {
    setHistory(prev => {
      // Return early if no present data or if content is identical
      if (!prev.present) return { ...prev, present: newData };

      const currentPresentStr = JSON.stringify(prev.present);
      const nextPresentStr = JSON.stringify(newData);

      if (currentPresentStr === nextPresentStr) {
        return prev;
      }

      const newPast = [...prev.past, prev.present];
      return {
        past: newPast.length > MAX_HISTORY ? newPast.slice(1) : newPast,
        present: newData,
        future: [], // New branch, clear future
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: prev.present ? [prev.present, ...prev.future] : prev.future,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: prev.present ? [...prev.past, prev.present] : prev.past,
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const handleResumeParsed = (data: ResumeData) => {
    setHistory({ past: [], present: data, future: [] });
    setIsEditing(true);
  };

  const startWithSample = () => {
    setHistory({ past: [], present: INITIAL_RESUME_DATA, future: [] });
    setIsEditing(true);
  };

  if (isEditing && history.present) {
    return (
      <Editor
        data={history.present}
        onChange={setResumeData}
        onBack={() => setIsEditing(false)}
        onUndo={undo}
        onRedo={redo}
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
      />
    );
  }

  return (
    <div className="min-h-screen bg-shades-black-100 flex items-center justify-center p-4 selection:bg-shades-black-70 selection:text-white relative overflow-hidden">
      {/* Background Decor - Removed colorful blobs for clean look */}

      <div className="max-w-5xl w-full bg-shades-black-90 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col md:flex-row border border-shades-black-80 relative z-10">
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-shades-black-100/50 text-white relative overflow-hidden border-r border-shades-black-80">

          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-6 tracking-tight text-shades-white-100">Architect <br /><span className="text-shades-white-60">Your Career.</span></h1>
            <p className="text-shades-white-80 text-lg mb-10 leading-relaxed font-light">
              Transform your experience into a masterpiece. Our AI engine parses every detail into a stunning, high-performance layout.
            </p>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-shades-black-80 border border-shades-black-70 flex items-center justify-center text-shades-white-90">
                  <Sparkles size={20} />
                </div>
                <span className="font-medium text-shades-white-90">AI-Powered Detailed Parsing</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-shades-black-80 border border-shades-black-70 flex items-center justify-center text-shades-white-90">
                  <Palette size={20} />
                </div>
                <span className="font-medium text-shades-white-90">Professional Studio Editor</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-shades-black-80 border border-shades-black-70 flex items-center justify-center text-shades-white-90">
                  <Zap size={20} />
                </div>
                <span className="font-medium text-shades-white-90">Real-time Layout Engine</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-shades-black-90">
          <UploadForm onParsed={handleResumeParsed} />
          <div className="mt-10 pt-8 border-t border-shades-black-80 flex flex-col items-center">
            <p className="text-shades-white-60 text-sm mb-4">No resume yet?</p>
            <button
              onClick={startWithSample}
              className="px-8 py-3 rounded-xl border border-shades-black-70 bg-shades-black-100 text-shades-white-90 hover:bg-shades-black-80 hover:text-white hover:border-shades-black-60 transition-all font-medium text-sm flex items-center gap-2 group"
            >
              <span>Start with Sample</span>
              <span className="text-shades-white-60 group-hover:text-white transition-colors">
                <ArrowRight size={16} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
