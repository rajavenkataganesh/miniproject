import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Filter, CheckCircle2, Info, Search } from 'lucide-react';

export default function FindingsPage({ findings = [] }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFindings = findings.filter(item => {
    const matchesSev = filterSeverity === 'ALL' || item.severity === filterSeverity;
    const matchesSearch = item.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'HIGH':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-red-950 text-red-400 border border-red-800">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-amber-950 text-amber-400 border border-amber-800">MEDIUM</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-blue-950 text-blue-400 border border-blue-800">LOW</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Security Findings & Exposures</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Displaying {filteredFindings.length} of {findings.length} detected potential vulnerabilities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by endpoint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Severity Buttons */}
          <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterSeverity === sev
                    ? 'bg-slate-800 text-cyan-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Findings List Grid */}
      <div className="space-y-4">
        {filteredFindings.length > 0 ? (
          filteredFindings.map((finding) => (
            <div key={finding.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  {getSeverityBadge(finding.severity)}
                  <span className="font-mono text-base font-bold text-cyan-400">{finding.endpoint}</span>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 font-medium">
                  {finding.category}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-bold text-slate-200">{finding.title}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Why is this flagged?
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{finding.reason}</p>
                    {finding.impact && (
                      <p className="text-xs text-slate-400 mt-2 italic">Impact: {finding.impact}</p>
                    )}
                  </div>

                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                      Recommended Remediation
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{finding.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="font-medium text-sm">No findings matched your current filter criteria.</p>
          </div>
        )}
      </div>

    </div>
  );
}
