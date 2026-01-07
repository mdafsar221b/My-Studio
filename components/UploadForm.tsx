import React, { useState } from 'react';
import { parseResume } from '../geminiService';
import { ResumeData } from '../types';
import { Upload } from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';

interface Props {
  onParsed: (data: ResumeData) => void;
  isEmbedded?: boolean;
}

export const UploadForm: React.FC<Props> = ({ onParsed, isEmbedded }) => {
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

      // Artificial delay if it's too fast, just to show the skeleton (optional, but good for UX)
      await new Promise(r => setTimeout(r, 2000));

      onParsed(parsedData);

    } catch (err: any) {
      setError(err.message || "Failed to parse resume. Please ensure it's a valid file.");
      console.error("Parsing error:", err);
    } finally {
      setIsParsing(false);
    }
  };

  if (isParsing) {
    return (
      <div className="fixed inset-0 z-[100] bg-shades-black-100/90 backdrop-blur-md flex flex-col items-center justify-center p-8">
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-bold text-shades-white-100 mb-2">Analyzing Document Structure</h3>
          <p className="text-shades-white-60">Extracting work history, skills, and achievements...</p>
        </div>
        <div className="scale-[0.4] md:scale-[0.6] origin-top">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className={`relative border-2 border-dashed border-shades-black-80 rounded-xl p-8 transition-all hover:border-shades-white-60 bg-shades-white-100/5 group h-full flex flex-col items-center justify-center ${isEmbedded ? 'border-none bg-transparent p-0' : ''}`}>
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileUpload}
          disabled={isParsing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
        />
        <div className="text-center">
          <div className="w-16 h-16 bg-shades-black-90 rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-shades-black-80">
            <Upload size={24} className="text-shades-black-60 group-hover:text-shades-white-100" />
          </div>
          <p className="text-shades-white-80 font-medium">
            Upload PDF or DOCX
          </p>
          <p className="text-shades-black-60 text-sm mt-1">Multi-stage AI extraction</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 text-red-200 rounded-lg text-sm border border-red-900/50 flex items-start gap-3 relative z-30">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

