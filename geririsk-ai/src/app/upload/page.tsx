"use client";

import { useState, useRef } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload() {
    if (!file) {
      setStatus("error");
      return;
    }

    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      console.error(data.error);
      return;
    }

    setStatus("success");
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(""); // Reset status on new file
    }
  };

  return (
    <main className="flex flex-col h-screen w-full bg-white text-gray-900 font-sans selection:bg-accent selection:text-primary overflow-hidden">
        
        {/* Header Section - Fixed Height */}
        <header className="flex-none h-16 border-b border-gray-100 flex items-center justify-between px-6 md:px-12 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-auto aspect-3/1">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/logo.png" 
                  alt="GeriRisk Logo" 
                  className="h-full w-auto object-contain"
                />
            </div>
            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
             <p className="hidden md:block text-xs text-gray-500 uppercase tracking-widest font-medium">
                Analytics Module
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium">
             <span className="text-primary cursor-pointer hover:underline underline-offset-4 decoration-2">Import Data</span>
             <span className="text-gray-400 cursor-not-allowed">Dashboard</span>
             <span className="text-gray-400 cursor-not-allowed">Settings</span>
             <div className="h-8 w-8 rounded-full bg-accent/20 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                AI
             </div>
          </div>
        </header>

        {/* Main Content - Flex Grow */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar / Info Column */}
            <aside className="w-1/3 bg-gray-50 border-r border-gray-100 p-12 overflow-y-auto hidden lg:block">
                 <div className="border-l-4 border-primary pl-6 mb-12">
                    <h1 className="text-4xl font-light tracking-tight text-primary uppercase">
                        Data Import
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 uppercase tracking-widest">
                        Secure Wearable CSV Upload
                    </p>
                </div>

                <div className="space-y-8">
                    <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
                        Protocol
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed text-justify">
                        Please ensure the wearable data is in the standard CSV format. 
                        All files are processed through our secure medical-grade pipeline 
                        before analysis.
                    </p>
                    </div>
                    
                    <div className="border border-gray-200 p-6 bg-white/50">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        System Status
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-700">Ready for Import</span>
                    </div>
                    </div>
                </div>
            </aside>

            {/* Main Interactive Area */}
            <section className="flex-1 p-8 md:p-12 lg:p-24 overflow-y-auto flex flex-col justify-center bg-white">
                <div className="max-w-2xl w-full mx-auto">
                     <div className="border border-gray-200 p-12 hover:border-primary transition-colors duration-300 shadow-sm hover:shadow-lg">
              
                        {/* File Drop Area Visual */}
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer border-2 border-dashed border-gray-300 bg-gray-50 py-24 text-center hover:border-primary hover:bg-accent/10 transition-all duration-300"
                        >
                            <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            />
                            
                            <div className="space-y-6">
                            <div className="mx-auto h-16 w-16 text-gray-400 group-hover:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                                <path strokeLinecap="square" strokeLinejoin="miter" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                            </div>
                            
                            <div className="text-lg text-gray-600">
                                {file ? (
                                <span className="font-medium text-primary">{file.name}</span>
                                ) : (
                                <>
                                    <span className="font-semibold underline decoration-primary underline-offset-4 text-primary">Click to upload</span> or drag and drop
                                </>
                                )}
                            </div>
                            <p className="text-sm text-gray-400 uppercase tracking-wide">CSV files up to 50MB</p>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="mt-12 flex items-center justify-between">
                            
                            {/* Status Indicator */}
                            <div className="flex-1 pr-6">
                            {status === "uploading" && (
                                <div className="text-sm text-primary animate-pulse">Processing data stream...</div>
                            )}
                            {status === "success" && (
                                <div className="text-sm text-primary font-medium flex items-center gap-2">
                                    <span className="block h-1.5 w-1.5 bg-primary"></span>
                                    Upload complete
                                </div>
                            )}
                            {status === "error" && (
                                <div className="text-sm text-red-600 font-medium flex items-center gap-2">
                                    <span className="block h-1.5 w-1.5 bg-red-600"></span>
                                    Error processing file
                                </div>
                            )}
                            </div>

                            {/* Primary Action */}
                            <button
                            onClick={handleUpload}
                            disabled={!file || status === "uploading"}
                            className="px-10 py-4 bg-primary text-white text-sm font-bold uppercase tracking-widest hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400 transition-all active:scale-[0.98] shadow-sm hover:shadow-md hover:shadow-accent/20"
                            >
                            Analyze Data
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        {/* Footer */}
        <footer className="h-12 border-t border-gray-100 flex items-center justify-between px-12 bg-gray-50 text-xs text-gray-400 uppercase tracking-widest">
            <span>© 2024 GeriRisk AI</span>
            <div className="flex gap-6">
                <span className="hover:text-primary cursor-pointer">Privacy</span>
                <span className="hover:text-primary cursor-pointer">Terms</span>
                <span className="hover:text-primary cursor-pointer">Support</span>
            </div>
        </footer>
    </main>
  );
}
