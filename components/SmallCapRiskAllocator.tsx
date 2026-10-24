'use client';

import React, { useState } from 'react';
import { Scale, AlertOctagon, PieChart, Shield } from 'lucide-react';

export default function SmallCapRiskAllocator() {
  const [totalCap, setTotalCap] = useState(500000);
  const [cycleState, setCycleState] = useState<'FROTHY' | 'NORMAL' | 'CRASHED'>('FROTHY');
  const [horizon, setHorizon] = useState<'SHORT' | 'MEDIUM' | 'LONG'>('LONG');

  let lPct = 60, mPct = 30, sPct = 10;
  let advice = "";

  if (cycleState === 'FROTHY') {
    lPct = 65; mPct = 25; sPct = 10;
    advice = "Small-cap index is overheated. Avoid fresh small-cap mutual fund lump sums. Cap small-cap weight to ≤ 10% to protect against 50%+ bear market drawdowns.";
  } else if (cycleState === 'CRASHED') {
    lPct = 45; mPct = 35; sPct = 20;
    advice = "Bear market panic has crushed small-cap prices below fair value. This is the optimal accumulation window to buy small-cap champions with high margin of safety.";
  } else {
    lPct = 55; mPct = 30; sPct = 15;
    advice = "Fairly balanced market. Stagger monthly SIPs consistently across large and mid-cap compounding leaders.";
  }

  if (horizon === 'SHORT') {
    lPct = 80; mPct = 20; sPct = 0;
    advice = "Strict rule: With an investment horizon under 3 years, allocate ZERO percent to small-caps. Small-cap volatility requires at least 7+ years of holding patience.";
  }

  const largeAmt = Math.round(totalCap * (lPct / 100));
  const midAmt = Math.round(totalCap * (mPct / 100));
  const smallAmt = Math.round(totalCap * (sPct / 100));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-800/40 rounded-2xl p-5">
        <h3 className="font-bold text-rose-300 text-base flex items-center gap-2">
          <Scale className="w-5 h-5 text-rose-400" /> The Small-Cap Risk &amp; Portfolio Allocation Model
        </h3>
        <p className="text-xs text-slate-300 mt-1">
          Why disciplined allocators cap Small-Cap Funds at peak valuation: Retail investors buy small caps at market tops after 80% rallies, only to suffer 60%+ drawdowns and illiquidity during bear cycles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Your Investment Horizon & Risk Parameters
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Total Equity Portfolio Capital (₹)</label>
            <input
              type="number"
              step="25000"
              value={totalCap}
              onChange={(e) => setTotalCap(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Current Small-Cap Market Cycle State</label>
            <select
              value={cycleState}
              onChange={(e) => setCycleState(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="FROTHY">Frothy / Overheated Small-Cap Valuation (P/E &gt; 35x)</option>
              <option value="NORMAL">Normal / Fair Valued Small-Cap Valuation</option>
              <option value="CRASHED">Post-Correction / Bear Market (Deep Bargains)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Investment Time Horizon</label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="SHORT">&lt; 3 Years (Strictly Zero Small-Caps!)</option>
              <option value="MEDIUM">3 to 7 Years (Conservative Allocation)</option>
              <option value="LONG">&gt; 7 Years (Full Compounding Runway)</option>
            </select>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1">
            <span className="text-rose-400 font-bold block flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4" /> The Fund AUM Problem:
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              When a small-cap mutual fund balloons past ₹20,000 Cr AUM, the manager cannot buy micro-caps without moving stock prices, forcing them to over-diversify into 90+ stocks or hold cash.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" /> Recommended Market-Cap Weights
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Large Cap Anchor</span>
              <span className="text-xl font-black text-cyan-400 font-mono">{lPct}%</span>
              <span className="text-[11px] text-slate-300 font-mono block">₹{largeAmt.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-500 block">Nifty 50 / Moat Leaders</span>
            </div>

            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Mid Cap Growth Engine</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{mPct}%</span>
              <span className="text-[11px] text-slate-300 font-mono block">₹{midAmt.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-500 block">Future Large Caps</span>
            </div>

            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Small Cap Satellite</span>
              <span className="text-xl font-black text-amber-400 font-mono">{sPct}%</span>
              <span className="text-[11px] text-slate-300 font-mono block">₹{smallAmt.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-500 block">Capped High Risk</span>
            </div>
          </div>

          {/* Bar */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Portfolio Weight Distribution:</span>
              <span className="font-bold text-white">{lPct}% Large / {mPct}% Mid / {sPct}% Small</span>
            </div>
            
            <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden flex">
              <div style={{ width: `${lPct}%` }} className="bg-cyan-500 h-full"></div>
              <div style={{ width: `${mPct}%` }} className="bg-emerald-500 h-full"></div>
              <div style={{ width: `${sPct}%` }} className="bg-amber-500 h-full"></div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1">
            <span className="text-cyan-400 font-bold block flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Capital Preservation Rule:
            </span>
            <p className="text-slate-300 leading-relaxed">{advice}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
