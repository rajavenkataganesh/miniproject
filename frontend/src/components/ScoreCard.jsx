import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

export default function ScoreCard({ score = 72, stats = {} }) {
  let colorClass = "text-emerald-400 border-emerald-500/30 bg-emerald-950/20";
  let Icon = ShieldCheck;
  let statusText = "Good Security Posture";

  if (score < 50) {
    colorClass = "text-red-400 border-red-500/30 bg-red-950/20";
    Icon = ShieldX;
    statusText = "Action Required: Critical Vulnerabilities";
  } else if (score < 80) {
    colorClass = "text-amber-400 border-amber-500/30 bg-amber-950/20";
    Icon = ShieldAlert;
    statusText = "Moderate Risk: Exposure Found";
  }

  return (
    <div className={`p-6 rounded-2xl border ${colorClass} flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl`}>
      <div className="flex items-center space-x-5">
        <div className="relative flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="38"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-800 opacity-40"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r="38"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={238}
              strokeDashoffset={238 - (238 * score) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute text-2xl font-black font-mono tracking-tight">
            {score}
          </span>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5" />
            <h3 className="text-lg font-bold">Security Posture Rating</h3>
          </div>
          <p className="text-sm font-medium mt-1 text-slate-300">
            {statusText}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Calculated across {stats.total_endpoints || 0} crawled endpoints & security headers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full sm:w-auto text-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="text-xl font-bold font-mono text-red-400">{stats.high_risk || 0}</div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">High Risk</div>
        </div>
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="text-xl font-bold font-mono text-amber-400">{stats.medium_risk || 0}</div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">Medium</div>
        </div>
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="text-xl font-bold font-mono text-emerald-400">{stats.protected_endpoints || 0}</div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">Protected</div>
        </div>
      </div>
    </div>
  );
}
