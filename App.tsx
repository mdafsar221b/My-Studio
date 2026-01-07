import React, { useState, useCallback } from 'react';
import { ResumeData } from './types';
import { INITIAL_RESUME_DATA } from './constants';
import Editor from './components/Editor';
import { UploadForm } from './components/UploadForm'; // Named import
import LandingPage from './components/LandingPage';
import TemplateSelector from './components/TemplateSelector';
import { Sun, Moon } from 'lucide-react';

const MAX_HISTORY = 50;

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [view, setView] = useState<'landing' | 'templates' | 'editor'>('landing');

  // Toggle Theme Effect
  React.useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [history, setHistory] = useState<{
    past: ResumeData[];
    present: ResumeData | null;
    future: ResumeData[];
  }>({
    past: [],
    present: null,
    future: [],
  });

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
    setView('editor');
  };

  const handleCreateNew = () => {
    setView('templates');
  };

  const handleTemplateSelect = (templateId: string) => {
    // Start with sample data but override template
    const newData = { ...INITIAL_RESUME_DATA, template: templateId as any };
    setHistory({ past: [], present: newData, future: [] });
    setView('editor');
  };

  // Views
  if (view === 'editor' && history.present) {
    return (
      <Editor
        data={history.present}
        onChange={setResumeData}
        onBack={() => setView('landing')}
        onUndo={undo}
        onRedo={redo}
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  if (view === 'templates') {
    return (
      <>
        <button
          onClick={toggleTheme}
          className="fixed top-6 right-6 p-3 rounded-full bg-shades-black-90 text-shades-white-90 hover:bg-shades-black-80 hover:scale-110 transition-all shadow-lg z-50 border border-shades-black-70"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <TemplateSelector
          onSelect={handleTemplateSelect}
          onBack={() => setView('landing')}
        />
      </>
    );
  }

  // Default: Landing Page
  return (
    <>
      {/* Global Theme Toggle for Landing (Absolute Position) */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-full bg-shades-black-90 text-shades-white-90 hover:bg-shades-black-80 hover:scale-110 transition-all shadow-lg z-50 border border-shades-black-70"
        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <LandingPage
        onCreateNew={handleCreateNew}
        onUploadSuccess={handleResumeParsed}
      />
    </>
  );
};

export default App;
