import React from 'react';
import { Upload, Star, ArrowRight } from 'lucide-react';
import { UploadForm } from './UploadForm';

interface Props {
    onCreateNew: () => void;
    onUploadSuccess: (data: any) => void;
}

const LandingPage: React.FC<Props> = ({ onCreateNew, onUploadSuccess }) => {
    return (
        <div className="min-h-screen bg-shades-black-100 flex items-center justify-center p-4 relative overflow-hidden">

            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[150px]"></div>
            </div>

            <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

                {/* Left: Brand & Create New */}
                <div className="flex flex-col gap-8 text-center md:text-left">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-shades-black-90 border border-shades-black-80 text-shades-white-60 text-xs font-medium mb-6">
                            <Star size={12} className="text-yellow-400" fill="currentColor" />
                            <span>v2.0 Now Available</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-shades-white-100 mb-6 leading-tight">
                            Craft Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Legacy.</span>
                        </h1>
                        <p className="text-lg text-shades-white-60 max-w-md leading-relaxed">
                            The professional resume builder that treats your career like a product. AI-powered parsing, premium templates, and intelligent design.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button
                            onClick={onCreateNew}
                            className="group relative px-8 py-4 bg-shades-white-100 text-shades-black-100 rounded-2xl font-bold text-lg shadow-xl shadow-white/5 hover:scale-105 transition-all flex items-center gap-3"
                        >
                            <span>Create New</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
                        </button>

                        {/* Mobile Text for upload section below */}
                        <p className="md:hidden text-shades-white-60 text-sm mt-4">Or upload existing below</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-shades-black-80/50">
                        <div>
                            <h4 className="text-2xl font-bold text-shades-white-100">10k+</h4>
                            <p className="text-xs text-shades-white-60 uppercase tracking-wider mt-1">Users</p>
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-shades-white-100">50+</h4>
                            <p className="text-xs text-shades-white-60 uppercase tracking-wider mt-1">Templates</p>
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-shades-white-100">95%</h4>
                            <p className="text-xs text-shades-white-60 uppercase tracking-wider mt-1">Hired</p>
                        </div>
                    </div>
                </div>

                {/* Right: Upload Card / Feature */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-50"></div>

                    <div className="relative bg-shades-black-90 border border-shades-black-80 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-shades-black-80 flex items-center justify-center text-shades-white-90 border border-shades-black-70">
                                <Upload size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-shades-white-100">Existing Resume?</h3>
                                <p className="text-shades-white-60 text-sm">Upload to parse & edit instantly.</p>
                            </div>
                        </div>

                        <div className="bg-shades-black-100/50 rounded-2xl border border-shades-black-80/50 p-2 h-64 overflow-hidden relative">
                            <UploadForm onParsed={onUploadSuccess} isEmbedded={true} />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default LandingPage;
