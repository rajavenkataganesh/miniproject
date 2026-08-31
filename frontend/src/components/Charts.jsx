import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function Charts({ stats = {}, endpoints = [] }) {
  // Risk distribution data
  const riskData = [
    { name: 'High Risk', value: stats.high_risk || 0, color: '#ef4444' },
    { name: 'Medium Risk', value: stats.medium_risk || 0, color: '#f59e0b' },
    { name: 'Low Risk', value: stats.low_risk || 0, color: '#3b82f6' },
    { name: 'Info / Safe', value: stats.info || 0, color: '#10b981' },
  ].filter(item => item.value > 0);

  // Category breakdown data
  const categoryCounts = endpoints.reduce((acc, ep) => {
    const cat = ep.category || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryCounts).map(([cat, count]) => ({
    category: cat,
    count: count
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Pie Chart: Risk Distribution */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
        <h4 className="text-base font-bold text-slate-200 mb-2 self-start">Risk Severity Distribution</h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Category Breakdown */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
        <h4 className="text-base font-bold text-slate-200 mb-2 self-start">Endpoints by Category</h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }}
              />
              <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
