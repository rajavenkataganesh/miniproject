import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TreePage from './pages/TreePage';
import FindingsPage from './pages/FindingsPage';
import ReportPage from './pages/ReportPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scanData, setScanData] = useState(null);
  const [gemmaStatus, setGemmaStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial fetch of demo scan & Gemma AI status
    fetchDemoScan();
    checkGemmaStatus();
  }, []);

  const checkGemmaStatus = async () => {
    try {
      const res = await fetch('/api/ai/status');
      if (res.ok) {
        const data = await res.json();
        setGemmaStatus(data);
      }
    } catch (e) {
      console.error("Gemma status check failed:", e);
    }
  };

  const fetchDemoScan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/scan/demo');
      if (res.ok) {
        const data = await res.json();
        setScanData(data);
      }
    } catch (e) {
      console.error("Failed to load demo scan:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartScan = async (targetUrl) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      if (res.ok) {
        const data = await res.json();
        setScanData(data);
      } else {
        alert("Scan failed. Defaulting to Demo Scan.");
        fetchDemoScan();
      }
    } catch (e) {
      alert("Error reaching backend scanner server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-sans">
      
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} gemmaStatus={gemmaStatus} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            scanData={scanData}
            onStartScan={handleStartScan}
            onLoadDemo={fetchDemoScan}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'tree' && <TreePage scanData={scanData} />}

        {activeTab === 'findings' && <FindingsPage findings={scanData?.findings || []} />}

        {activeTab === 'report' && <ReportPage scanData={scanData} />}

        {activeTab === 'chat' && <ChatPage scanData={scanData} gemmaStatus={gemmaStatus} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>EndpointGuard © 2026 — Defensive Security & Web Endpoint Analyzer</span>
          <span className="font-mono">React + FastAPI + Gemma 4 Local AI Integration</span>
        </div>
      </footer>

    </div>
  );
}
