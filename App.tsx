
import React, { useState, useCallback, useRef } from 'react';
import Layout from './components/Layout.tsx';
import ResultDisplay from './components/ResultDisplay.tsx';
import { analyzeImageAuthenticity } from './services/gemini.ts';
import { AnalysisResult, ImagePreview } from './types.ts';

interface HistoryItem {
  id: string;
  preview: ImagePreview;
  result: AnalysisResult;
  timestamp: Date;
}

const App: React.FC = () => {
  const [file, setFile] = useState<ImagePreview | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFile({
        url: URL.createObjectURL(selectedFile),
        name: selectedFile.name,
        size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB',
        base64
      });
      setError(null);
      setResult(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const startAnalysis = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeImageAuthenticity(file.base64);
      setResult(data);
      setHistory(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        preview: file,
        result: data,
        timestamp: new Date()
      }, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setFile(item.preview);
    setResult(item.result);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        {!result && !analyzing && (
          <div className="text-center space-y-4 pt-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
              Real or <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">AI?</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
              Powered by Gemini Flash. Instantly detect if an image was captured by a lens or rendered by an algorithm.
            </p>
          </div>
        )}

        <div className="space-y-8">
          {/* Upload Area */}
          {!result && (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`glass-panel rounded-3xl p-8 border-dashed border-2 transition-all text-center relative overflow-hidden ${
                isDragging ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' : 
                file ? 'border-blue-500/50' : 'border-white/10 hover:border-blue-500/30'
              }`}
            >
              {!file ? (
                <div className="py-16 flex flex-col items-center">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 mb-8 animate-bounce">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95 text-lg"
                  >
                    Upload Suspect Image
                  </button>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
                  <p className="mt-6 text-slate-500">Drag and drop images for a forensic scan</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative inline-block">
                    <img 
                      src={file.url} 
                      alt="Preview" 
                      className={`max-h-[500px] rounded-2xl shadow-2xl transition-all duration-700 ${analyzing ? 'opacity-40 blur-sm scale-95 grayscale' : ''}`} 
                    />
                    {analyzing && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                         <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_1s_ease-in-out_infinite]"></div>
                      </div>
                    )}
                  </div>
                  
                  {analyzing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl">
                        <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="font-mono text-[10px] text-blue-400 tracking-widest uppercase mb-1">Detecting Patterns...</p>
                        <p className="text-[9px] text-slate-500 font-mono animate-pulse">Running Flash Diagnostics</p>
                      </div>
                    </div>
                  )}

                  {!analyzing && (
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                      <div className="text-left bg-black/40 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-sm">
                        <p className="text-[10px] text-slate-500 font-mono uppercase">Target Image</p>
                        <p className="text-sm font-medium text-slate-200">{file.name} ({file.size})</p>
                      </div>
                      <button 
                        onClick={startAnalysis}
                        className="bg-white text-slate-900 px-10 py-3 rounded-xl font-bold transition-all hover:bg-slate-200 shadow-xl active:scale-95"
                      >
                        Verify Now
                      </button>
                      <button 
                        onClick={reset}
                        className="bg-white/5 hover:bg-white/10 text-slate-400 px-6 py-3 rounded-xl font-bold border border-white/10"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700">
               <div className="flex flex-col lg:flex-row gap-10">
                  <div className="w-full lg:w-80 shrink-0">
                    <div className="glass-panel p-3 rounded-3xl sticky top-24 shadow-2xl border-white/10">
                       <img src={file?.url} className="rounded-2xl w-full aspect-square object-cover" alt="Analyzed image" />
                       <div className="p-4 bg-white/5 rounded-xl mt-3">
                         <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Target Analysis</p>
                         <p className="text-xs truncate font-medium text-blue-400">{file?.name}</p>
                       </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <ResultDisplay result={result} onReset={reset} />
                  </div>
               </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && !analyzing && (
            <div className="pt-16 border-t border-white/5">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Scan History
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {history.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="glass-panel p-2 rounded-2xl group hover:border-blue-500/50 transition-all text-left"
                  >
                    <img src={item.preview.url} className="w-full aspect-square object-cover rounded-xl mb-2 grayscale group-hover:grayscale-0 transition-all" alt="Scan history" />
                    <div className="px-1">
                      <div className={`text-[10px] font-bold uppercase ${
                        item.result.verdict === 'AI_GENERATED' ? 'text-rose-500' : 
                        item.result.verdict === 'REAL' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {item.result.verdict.split('_')[0]}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{item.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-center font-semibold animate-pulse shadow-lg shadow-rose-500/5">
              {error}
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </Layout>
  );
};

export default App;
