import React from 'react';
import EndpointTree from '../components/EndpointTree';

export default function TreePage({ scanData }) {
  if (!scanData || !scanData.endpoints) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <p>No active scan available. Please start a scan from the Dashboard or load demo data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Interactive Endpoint Hierarchy</h2>
        <p className="text-sm text-slate-400 mt-1">
          Visual tree structure mapping discovered web endpoints, path categories, and security status.
        </p>
      </div>

      <EndpointTree endpoints={scanData.endpoints} targetDomain={scanData.domain || 'example.com'} />
    </div>
  );
}
