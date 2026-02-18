
import React from 'react';
import { AnalysisResult, AuthenticityType } from '../types';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultDisplay: React.FC<Props> = ({ result, onReset }) => {
  const isAi = result.verdict === AuthenticityType.AI_GENERATED;
  const isReal = result.verdict === AuthenticityType.REAL;

  const getThemeColor = () => {
    if (isAi) return 'rose';
    if (isReal) return 'emerald';
    return 'amber';
  };

  const theme = getThemeColor();

  return (
    <div className="space-y-8">
      {/* Hero Badge */}
      <div className={`relative overflow-hidden p-10 rounded-[2.5rem] border border-${theme}-500/20 bg-${theme}-500/5 backdrop-blur-xl group transition-all`}>
        <div className={`absolute -right-10 -top-10 w-40 h-40 bg-${theme}-500/10 rounded-full blur-3xl group-hover:bg-${theme}-500/20 transition-all`}></div>
        
        <div className="relative flex flex-col items-center text-center">
          <div className={`w-16 h-16 bg-${theme}-500/20 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner`}>
            {isAi ? '🤖' : isReal ? '📷' : '❓'}
          </div>
          <h2 className={`text-4xl font-black tracking-tighter uppercase text-${theme}-500 mb-2`}>
            {result.verdict.replace('_', ' ')}
          </h2>
          <div className="flex items-center gap-3">
            <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full bg-${theme}-500 shadow-[0_0_10px_rgba(var(--tw-color-${theme}-500))] transition-all duration-1000 ease-out`} 
                style={{ width: `${result.confidence}%` }}
              ></div>
            </div>
            <span className="text-sm font-bold text-slate-400 font-mono">{result.confidence}% Confidence</span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-8 rounded-3xl border-white/5 hover:border-white/10 transition-all">
          <h3 className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Forensic Findings
          </h3>
          <ul className="space-y-4">
            {result.reasoning.map((reason, i) => (
              <li key={i} className="flex gap-4 text-sm text-slate-300 leading-relaxed group">
                <span className="text-blue-500/40 font-mono mt-0.5 group-hover:text-blue-500 transition-colors">{String(i + 1).padStart(2, '0')}</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-3xl border-white/5">
            <h3 className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Technical Markers
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.artifactsDetected.map((artifact, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                  {artifact}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
            <h3 className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-4">Final Assessment</h3>
            <p className="text-sm leading-relaxed text-slate-400 font-light italic">
              "{result.summary}"
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={onReset}
          className="group flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-200 transition-all shadow-2xl hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Analysis
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
