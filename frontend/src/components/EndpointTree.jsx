import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileCode, ShieldAlert, ShieldCheck, AlertCircle } from 'lucide-react';

function buildTree(endpoints) {
  const root = { name: 'root', children: {}, isEndpoint: false };

  endpoints.forEach((ep) => {
    const parts = ep.url.split('/').filter(Boolean);
    let current = root;

    if (parts.length === 0) {
      // Homepage "/"
      current.children['/'] = { name: '/', data: ep, isEndpoint: true, children: {} };
      return;
    }

    parts.forEach((part, index) => {
      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          children: {},
          isEndpoint: index === parts.length - 1,
          data: index === parts.length - 1 ? ep : null
        };
      }
      current = current.children[part];
    });
  });

  return root;
}

function TreeNode({ node, path = "", onSelect, selectedPath }) {
  const [isOpen, setIsOpen] = useState(true);

  const hasChildren = Object.keys(node.children).length > 0;
  const isSelected = selectedPath === path;
  const risk = node.data?.risk || "INFO";

  let statusBadge = "🟢";
  if (risk === "HIGH") statusBadge = "🔴";
  else if (risk === "MEDIUM") statusBadge = "🟡";
  else if (risk === "LOW") statusBadge = "🔵";

  return (
    <div className="pl-4 border-l border-slate-800 my-1 font-mono text-sm">
      <div
        onClick={() => {
          if (hasChildren) setIsOpen(!isOpen);
          if (node.data) onSelect(node.data);
        }}
        className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition ${
          isSelected
            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
            : 'hover:bg-slate-800/60 text-slate-300'
        }`}
      >
        {hasChildren ? (
          isOpen ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <FileCode className="w-4 h-4 text-slate-500 shrink-0" />
        )}

        {hasChildren && <Folder className="w-4 h-4 text-cyan-500 shrink-0" />}

        <span className="font-medium truncate">{node.name}</span>

        {node.data && (
          <span className="ml-auto text-xs px-1.5 py-0.5 rounded font-mono border border-slate-800 bg-slate-900 flex items-center space-x-1">
            <span>{statusBadge}</span>
            <span className="text-slate-400">{node.data.status_code || 200}</span>
          </span>
        )}
      </div>

      {isOpen && hasChildren && (
        <div className="ml-2">
          {Object.entries(node.children).map(([key, child]) => (
            <TreeNode
              key={key}
              node={child}
              path={`${path}/${key}`}
              onSelect={onSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function EndpointTree({ endpoints = [], targetDomain = "example.com" }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0] || null);

  const treeRoot = React.useMemo(() => buildTree(endpoints), [endpoints]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Tree Hierarchy Column */}
      <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <Folder className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100">{targetDomain} Directory Tree</h3>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
            <span>🟢 Public</span>
            <span>🟡 Medium</span>
            <span>🔴 High Risk</span>
          </div>
        </div>

        <div className="max-h-[550px] overflow-y-auto pr-2">
          {Object.entries(treeRoot.children).map(([key, node]) => (
            <TreeNode
              key={key}
              node={node}
              path={key}
              onSelect={(ep) => setSelectedEndpoint(ep)}
              selectedPath={selectedEndpoint?.url}
            />
          ))}
        </div>
      </div>

      {/* Inspector Detail Column */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col">
        <h3 className="font-bold text-slate-100 pb-4 border-b border-slate-800 mb-4 flex items-center space-x-2">
          <FileCode className="w-5 h-5 text-cyan-400" />
          <span>Endpoint Inspector</span>
        </h3>

        {selectedEndpoint ? (
          <div className="space-y-5 text-sm">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">URL Path</span>
              <div className="font-mono text-base font-bold text-cyan-400 mt-1 break-all bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                {selectedEndpoint.url}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-500 block">HTTP Method</span>
                <span className="font-mono font-bold text-slate-200">{selectedEndpoint.method}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-500 block">Status Code</span>
                <span className="font-mono font-bold text-emerald-400">{selectedEndpoint.status_code}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-500 block">Category</span>
                <span className="font-semibold text-slate-300">{selectedEndpoint.category}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-500 block">Risk Severity</span>
                <span className={`font-bold font-mono ${
                  selectedEndpoint.risk === 'HIGH' ? 'text-red-400' :
                  selectedEndpoint.risk === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                }`}>{selectedEndpoint.risk}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold block mb-1">Analysis & Reason</span>
                <p className="text-slate-300 text-xs leading-relaxed">{selectedEndpoint.reason}</p>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-cyan-400 font-semibold block mb-1">Recommended Solution</span>
                <p className="text-slate-300 text-xs leading-relaxed">{selectedEndpoint.recommendation}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm">
            <p>Click any endpoint node to inspect details.</p>
          </div>
        )}
      </div>

    </div>
  );
}
