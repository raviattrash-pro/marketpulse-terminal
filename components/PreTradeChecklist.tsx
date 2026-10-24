'use client';

import React, { useState } from 'react';
import { CheckSquare, ShieldCheck, AlertCircle } from 'lucide-react';

export default function PreTradeChecklist() {
  const [checks, setChecks] = useState<boolean[]>([false, false, false, false, false, false]);

  const toggleCheck = (idx: number) => {
    setChecks(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  const count = checks.filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <CheckSquare className="w-6 h-6 text-emerald-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-emerald-300 text-sm">Discipline Gate: 6-Point Pre-Trade Screener</h3>
            <p className="text-xs text-slate-300 mt-0.5">"Do not press the BUY or SELL button before satisfying all 6 conditions."</p>
          </div>
        </div>
        <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800">
          Score: {count} / 6
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-start gap-3 p-3.5 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/70 cursor-pointer transition">
            <input
              type="checkbox"
              checked={checks[0]}
              onChange={() => toggleCheck(0)}
              className="mt-1 w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-600 focus:ring-0"
            />
            <div>
              <span className="text-sm font-semibold text-white block">1. Moat & Valuation Alignment</span>
              <span className="text-xs text-slate-400 mt-0.5 block">Price is in Best Buy zone or above 20/50 EMA with positive earnings momentum.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/70 cursor-pointer transition">
            <input
              type="checkbox"
              checked={checks[1]}
              onChange={() => toggleCheck(1)}
              className="mt-1 w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-600 focus:ring-0"
            />
            <div>
              <span className="text-sm font-semibold text-white block">2. Institutional Support Retest</span>
              <span className="text-xs text-slate-400 mt-0.5 block">Trade taken at strong demand/support zone, NOT chasing an overextended green rally.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/70 cursor-pointer transition">
            <input
              type="checkbox"
              checked={checks[2]}
              onChange={() => toggleCheck(2)}
              className="mt-1 w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-600 focus:ring-0"
            />
            <div>
              <span className="text-sm font-semibold text-white block">3. Zero Promoter Pledging & Clean Governance</span>
              <span className="text-xs text-slate-400 mt-0.5 block">0% promoter pledge and clean audit trail without aggressive revenue recognition.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/70 cursor-pointer transition">
            <input
              type="checkbox"
              checked={checks[3]}
              onChange={() => toggleCheck(3)}
              className="mt-1 w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-600 focus:ring-0"
            />
            <div>
              <span className="text-sm font-semibold text-white block">4. System Stop Loss Active</span>
              <span className="text-xs text-slate-400 mt-0.5 block">Stop-loss level is predefined in the system before placing order, not mentally.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/70 cursor-pointer transition">
            <input
              type="checkbox"
              checked={checks[4]}
              onChange={() => toggleCheck(4)}
              className="mt-1 w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-600 focus:ring-0"
            />
            <div>
              <span className="text-sm font-semibold text-white block">5. Minimum 1:2 Risk to Reward (R:R)</span>
              <span className="text-xs text-slate-400 mt-0.5 block">Upside target is at least double the risk distance to stop loss.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/70 cursor-pointer transition">
            <input
              type="checkbox"
              checked={checks[5]}
              onChange={() => toggleCheck(5)}
              className="mt-1 w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-600 focus:ring-0"
            />
            <div>
              <span className="text-sm font-semibold text-white block">6. Zero Emotional / Revenge Trading</span>
              <span className="text-xs text-slate-400 mt-0.5 block">Calm, clear mind, strictly adhering to max daily loss limit.</span>
            </div>
          </label>
        </div>

        <div className={`p-4 rounded-xl text-center font-bold text-sm border transition ${count === 6 ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600' : count >= 4 ? 'bg-amber-950/60 text-amber-300 border-amber-700' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
          {count === 6 ? (
            <span className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> ALL 6 CHECKS VERIFIED. High-probability setup! Execute with discipline.
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {6 - count} Checkpoint(s) missing. Do NOT rush in.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
