import React from 'react';
import { Shield, LayoutDashboard, GitFork, AlertTriangle, FileText, Bot, Cpu } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, gemmaStatus }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tree', label: 'Endpoint Tree', icon: GitFork },
    { id: 'findings', label: 'Findings', icon: AlertTriangle },
    { id: 'report', label: 'AI Report', icon: FileText },
    { id: 'chat', label: 'AI Assistant', icon: Bot },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 p-2 rounded-xl text-white shadow-lg shadow-cyan-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-cyan-400">
                EndpointGuard
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                v1.0
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Gemma AI Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-full border ${
              gemmaStatus?.gemma_available
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                : 'bg-amber-950/80 text-amber-400 border-amber-800'
            }`}>
              <Cpu className={`w-3.5 h-3.5 ${gemmaStatus?.gemma_available ? 'animate-pulse text-emerald-400' : 'text-amber-400'}`} />
              <span className="font-medium hidden sm:inline">
                {gemmaStatus?.gemma_available ? 'Gemma AI Online' : 'Gemma Offline (Demo Mode)'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
