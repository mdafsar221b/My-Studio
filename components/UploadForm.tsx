
import React, { useState } from 'react';
import { parseResume } from '../geminiService';
import { ResumeData } from '../types';
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.0.189/build/pdf.worker.min.mjs`;

interface Props {
  onParsed: (data: ResumeData) => void;
}

const UploadForm: React.FC<Props> = ({ onParsed }) => {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
      
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setError(null);

    try {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size exceeds 10MB limit.");
      }

      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.txt')) {
        throw new Error("Unsupported file type. Please upload PDF, DOCX, or TXT.");
      }

      const base64Data = await fileToBase64(file);
      const mimeType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain');

    
      const parsedData = await parseResume(base64Data, mimeType);
      onParsed(parsedData);

    } catch (err: any) {
      setError(err.message || "Failed to parse resume. Please ensure it's a valid file.");
      console.error("Parsing error:", err);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-shades-white-100 mb-6">Start Building</h2>

      <div className="relative border-2 border-dashed border-shades-black-80 rounded-xl p-8 transition-all hover:border-shades-white-60 bg-shades-white-100/5 group">
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileUpload}
          disabled={isParsing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="text-center">
          <div className="w-16 h-16 bg-shades-black-90 rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            {isParsing ? (
              <svg className="animate-spin h-8 w-8 text-shades-white-100" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-shades-black-60 group-hover:text-shades-white-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>
          <p className="text-shades-white-80 font-medium">
            {isParsing ? 'Deep Analyzing Content...' : 'Upload PDF or DOCX'}
          </p>
          <p className="text-shades-black-60 text-sm mt-1">Multi-stage AI extraction with zero omission</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 text-red-200 rounded-lg text-sm border border-red-900/50 flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
