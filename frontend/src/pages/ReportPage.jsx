import React, { useState, useEffect } from 'react';
import { FileText, Cpu, AlertCircle, ShieldCheck, CheckSquare, RefreshCw } from 'lucide-react';

export default function ReportPage({ scanData }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [scanData]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scanData || {})
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24 text-slate-400 space-x-3">
        <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
        <span>Generating AI Security Report...</span>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Mode Banner */}
      {report.is_demo && (
        <div className="bg-amber-950/60 border border-amber-800 rounded-2xl p-4 flex items-center space-x-3 text-amber-300">
          <Cpu className="w-5 h-5 shrink-0 text-amber-400" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold">DEMO AI REPORT</span> — Gemma is currently offline. Place a model file into <code className="bg-amber-900/80 px-1.5 py-0.5 rounded font-mono">assets/models/</code> to automatically activate live Gemma 4 AI reports.
          </div>
        </div>
      )}

      {/* Report Header Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-slate-100">{report.title || 'AI Security Summary Report'}</h2>
          </div>
          <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-cyan-400">
            {report.overall_status}
          </span>
        </div>

        {/* Executive Summary */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Executive Summary</h3>
          <p className="text-slate-200 leading-relaxed text-sm sm:text-base bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            {report.executive_summary}
          </p>
        </div>
      </div>

      {/* Most Important Findings & Why They Matter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <span>Key Exposure Hazards</span>
          </h3>
          <ul className="space-y-3">
            {report.most_important_findings?.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                {item}
              </li>
            )) || <p className="text-xs text-slate-400">No major exposure hazards detected.</p>}
          </ul>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>Why These Findings Matter</span>
          </h3>
          <p className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed">
            {report.why_endpoints_matter || "Understanding endpoint accessibility ensures administrative portals and user data routes are properly shielded against unauthenticated inspection."}
          </p>
        </div>
      </div>

      {/* Priority Remediation Plan */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <CheckSquare className="w-5 h-5 text-emerald-400" />
          <span>Priority-Based Remediation Plan</span>
        </h3>

        <div className="space-y-3">
          {report.remediation_plan?.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-900 text-cyan-400 border border-slate-700 shrink-0">
                {step.priority}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed pt-0.5">{step.action}</p>
            </div>
          )) || report.recommendations?.map((rec, idx) => (
            <div key={idx} className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800">
              {rec}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
