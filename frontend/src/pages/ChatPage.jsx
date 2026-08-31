import React, { useState } from 'react';
import { Bot, Send, User, Cpu, Sparkles } from 'lucide-react';

export default function ChatPage({ scanData, gemmaStatus }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your EndpointGuard Security Assistant. Ask me anything about your current scan findings, risk scores, or security header recommendations.',
      isDemo: !gemmaStatus?.gemma_available
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          scan_data: scanData
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: data.response,
          isDemo: data.is_demo
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Error communicating with assistant endpoint.',
        isDemo: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-purple-600 to-cyan-600 p-2.5 rounded-2xl text-white shadow-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">AI Security Assistant</h2>
            <p className="text-xs text-slate-400">Contextual guidance on target endpoints & security posture</p>
          </div>
        </div>

        <div className={`flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full border ${
          gemmaStatus?.gemma_available
            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
            : 'bg-amber-950 text-amber-400 border-amber-800'
        }`}>
          <Cpu className="w-4 h-4" />
          <span className="font-semibold">{gemmaStatus?.gemma_available ? 'Gemma 4 Live AI' : 'Gemma Offline — Demo Mode'}</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 h-[480px] flex flex-col justify-between">
        
        <div className="overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`p-2 rounded-xl text-white shrink-0 ${
                msg.sender === 'user' ? 'bg-cyan-600' : 'bg-slate-800 border border-slate-700'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-400" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-600/20 text-cyan-100 border border-cyan-500/30'
                  : 'bg-slate-950/80 text-slate-200 border border-slate-800'
              }`}>
                {msg.isDemo && msg.sender === 'ai' && (
                  <span className="inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 mb-2">
                    DEMO MODE
                  </span>
                )}
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 pl-10">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Assistant is typing...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="pt-4 flex gap-2 border-t border-slate-800/80">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question (e.g., 'Why is /admin risky?' or 'Explain HSTS')..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-600/30 transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
