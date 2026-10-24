'use client';

import React, { useState } from 'react';
import { BarChart3, Activity } from 'lucide-react';

export default function OIHeatmap() {
  const [sentiment, setSentiment] = useState<'BULLISH' | 'BEARISH'>('BULLISH');

  const strikes = [
    { strike: 24600, call: sentiment === 'BULLISH' ? 18.2 : 42.1, put: sentiment === 'BULLISH' ? 84.5 : 46.2 },
    { strike: 24700, call: sentiment === 'BULLISH' ? 24.5 : 62.4, put: sentiment === 'BULLISH' ? 104.2 : 52.0 },
    { strike: 24800, call: sentiment === 'BULLISH' ? 48.0 : 96.5, put: sentiment === 'BULLISH' ? 95.8 : 41.5 },
    { strike: 24900, call: sentiment === 'BULLISH' ? 78.4 : 115.0, put: sentiment === 'BULLISH' ? 62.1 : 28.0 },
    { strike: 25000, call: sentiment === 'BULLISH' ? 95.0 : 130.4, put: sentiment === 'BULLISH' ? 36.4 : 15.2 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <BarChart3 className="w-6 h-6 text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-300 text-sm">Open Interest &amp; Option Chain Mechanics (Institutional Options Model):</h3>
            <p className="text-xs text-slate-300 mt-0.5">"Highest Call OI = Resistance; Highest Put OI = Support. Put-Call Ratio (PCR) gauges institutional bias."</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSentiment('BULLISH')}
            className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition ${sentiment === 'BULLISH' ? 'bg-emerald-900 text-emerald-300 border-emerald-600' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
          >
            Bullish Setup
          </button>
          <button
            onClick={() => setSentiment('BEARISH')}
            className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition ${sentiment === 'BEARISH' ? 'bg-rose-900 text-rose-300 border-rose-600' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
          >
            Bearish Setup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">NIFTY 50 Spot</span>
          <div className="text-xl font-black text-white mt-1">24,850.00</div>
          <span className="text-[10px] text-emerald-400 font-medium">Near Weekly Expiry</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">PCR (Put-Call Ratio)</span>
          <div className="text-xl font-black text-cyan-400 mt-1">{sentiment === 'BULLISH' ? '1.34' : '0.68'}</div>
          <span className="text-[10px] text-slate-400">Total Put OI / Total Call OI</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Institutional Bias</span>
          <div className={`text-xl font-black mt-1 ${sentiment === 'BULLISH' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {sentiment === 'BULLISH' ? 'Put Writers Active' : 'Call Writers Active'}
          </div>
          <span className="text-[10px] text-slate-400">{sentiment === 'BULLISH' ? 'Floor is cushioned' : 'Capped overhead'}</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Max Pain Strike</span>
          <div className="text-xl font-black text-amber-400 mt-1">24,800</div>
          <span className="text-[10px] text-slate-400">Least Writer Loss Level</span>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Strike Open Interest Distribution (in Lakhs)
          </h4>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-rose-400"><span className="w-3 h-3 bg-rose-500 rounded-sm"></span> Call OI (Resistance)</span>
            <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Put OI (Support)</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="flex items-end justify-between gap-4 h-48 bg-slate-950/80 p-4 rounded-xl border border-slate-800 min-w-[500px]">
            {strikes.map((s) => {
              const maxVal = 140;
              const callH = (s.call / maxVal) * 130;
              const putH = (s.put / maxVal) * 130;
              const isATM = s.strike === 24800;

              return (
                <div key={s.strike} className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex items-end gap-1.5 h-36">
                    <div style={{ height: `${callH}px` }} className="w-6 sm:w-8 bg-rose-500/80 hover:bg-rose-500 rounded-t transition flex items-center justify-center">
                      <span className="text-[9px] text-white font-mono -rotate-90">{s.call}L</span>
                    </div>
                    <div style={{ height: `${putH}px` }} className="w-6 sm:w-8 bg-emerald-500/80 hover:bg-emerald-500 rounded-t transition flex items-center justify-center">
                      <span className="text-[9px] text-white font-mono -rotate-90">{s.put}L</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono mt-1 ${isATM ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                    {s.strike} {isATM ? '⚡' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
