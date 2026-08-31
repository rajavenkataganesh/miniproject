import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export default function HeaderCheck({ headers = {} }) {
  const getBadge = (status) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PASS</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-950 text-amber-400 border border-amber-800">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>WARNING</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-red-950 text-red-400 border border-red-800">
            <XCircle className="w-3.5 h-3.5" />
            <span>MISSING</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center justify-between">
        <span>Security Headers Evaluation</span>
        <span className="text-xs text-slate-400 font-normal">HTTP Response Hardening</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(headers).map(([key, item]) => (
          <div key={key} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-sm font-semibold text-slate-200 truncate">{key}</span>
                {getBadge(item.status)}
              </div>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{item.description}</p>
            </div>

            {item.value && (
              <div className="text-xs font-mono bg-slate-900 px-2.5 py-1.5 rounded text-slate-300 truncate border border-slate-800/80">
                {item.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
