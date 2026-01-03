
import React, { useState, useCallback } from 'react';
import { ResumeData } from './types';
import { INITIAL_RESUME_DATA } from './constants';
import Editor from './components/Editor';
import UploadForm from './components/UploadForm';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-teal-600 text-white">
          <h1 className="text-4xl font-bold mb-4">Architect Your Career.</h1>
          <p className="text-teal-100 text-lg mb-8 leading-relaxed">
            Upload your current resume and let our AI parse every detail into a stunning, high-performance layout.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-500/50 flex items-center justify-center">✓</div>
              <span>AI-Powered Detailed Parsing</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-500/50 flex items-center justify-center">✓</div>
              <span>Professional Editor Studio</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-500/50 flex items-center justify-center">✓</div>
              <span>Multi-page Template Support</span>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <UploadForm onParsed={handleResumeParsed} />
          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center">
            <p className="text-slate-500 text-sm mb-4">No resume yet?</p>
            <button 
              onClick={startWithSample}
              className="px-6 py-2 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm"
            >
              Start with Sample Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
