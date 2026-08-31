import React, { useState, useMemo } from 'react';
import { Globe, Search, RefreshCw, Play, ShieldAlert, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';
import ScoreCard from '../components/ScoreCard';
import HeaderCheck from '../components/HeaderCheck';
import Charts from '../components/Charts';

export default function Dashboard({ scanData, onStartScan, onLoadDemo, isLoading }) {
  const [inputUrl, setInputUrl] = useState('https://demo.example.com');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onStartScan(inputUrl);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Header & URL Input Form */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Authorized Defensive Endpoint Scanner</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Web URL Endpoint Security Analyzer
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Discover endpoints, evaluate browser security response headers, and classify exposed sensitive assets across your web application target.
          </p>

          {/* URL Input Form */}
          <form onSubmit={handleSubmit} className="pt-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Globe className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  required
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono text-sm shadow-inner transition"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Crawling...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Scan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onLoadDemo}
                  className="flex items-center justify-center space-x-1.5 px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl border border-slate-700 transition cursor-pointer"
                >
                  <span>Load Demo Scan</span>
                </button>
              </div>
            </div>

            {/* Security Warning Badge */}
            <div className="flex items-center space-x-2 text-xs text-amber-400/90 pt-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Only scan websites that you own or have explicit permission to test.</span>
            </div>
          </form>

        </div>
      </div>

      {/* Results Dashboard Grid */}
      {scanData && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Target Metadata Banner */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <span className="text-slate-400 font-medium">Target:</span>
              <span className="font-mono font-bold text-cyan-400">{scanData.target}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>HTTPS: {scanData.https_status?.enabled ? 'Active' : 'Missing'}</span>
              </span>
              <span>Crawled: {scanData.endpoints?.length || 0} paths</span>
            </div>
          </div>

          {/* Security Rating Scorecard */}
          <ScoreCard score={scanData.security_score} stats={scanData.stats} />

          {/* Security Headers Analysis */}
          <HeaderCheck headers={scanData.security_headers} />

          {/* Visual Data Charts */}
          <Charts stats={scanData.stats} endpoints={scanData.endpoints} />

        </div>
      )}

    </div>
  );
}
