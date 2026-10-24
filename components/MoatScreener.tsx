'use client';

import React, { useState } from 'react';
import { Castle, CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

export default function MoatScreener() {
  const [name, setName] = useState('TITAN COMPANY LTD');
  const [moatType, setMoatType] = useState('BRAND');
  const [promoterHold, setPromoterHold] = useState(52.9);
  const [pledge, setPledge] = useState(0.0);
  const [roce, setRoce] = useState(28.4);
  const [debtEquity, setDebtEquity] = useState(0.25);
  const [pe, setPe] = useState(82.0);
  const [medPe, setMedPe] = useState(74.0);

  const p1 = moatType !== 'NONE';
  const p2 = promoterHold >= 50 && pledge === 0;
  const p3 = roce >= 15 && debtEquity <= 0.6;
  const p4 = pe <= medPe * 1.1;

  const passedCount = (p1 ? 1 : 0) + (p2 ? 1 : 0) + (p3 ? 1 : 0) + (p4 ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-800/40 rounded-2xl p-5">
        <h3 className="font-bold text-amber-300 text-base flex items-center gap-2">
          <Castle className="w-5 h-5 text-amber-400" /> 4-Filter Economic Moat Selection Framework
        </h3>
        <p className="text-xs text-slate-300 mt-1">
          "A great company is not automatically a great investment. It must pass all 4 filters: <strong>Economic Moat</strong>, <strong>Management Cleanliness</strong>, <strong>Financial Superiority</strong>, and <strong>Margin of Safety</strong>."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Company Parameters
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Company Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-400 mb-1">1. Economic Moat Type</label>
            <select
              value={moatType}
              onChange={(e) => setMoatType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="BRAND">Unbeatable Brand & Pricing Power (e.g. Titan, Apple)</option>
              <option value="NETWORK">Strong Network Effects (e.g. Exchanges, Visa)</option>
              <option value="SWITCHING">High Switching Costs (e.g. ERP Software, Banks)</option>
              <option value="COST">Lowest Cost Producer Advantage</option>
              <option value="NONE">No Sustainable Moat (Commodity Business ⚠️)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Promoter Holding (%)</label>
              <input
                type="number"
                step="0.5"
                value={promoterHold}
                onChange={(e) => setPromoterHold(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
              <span className="text-[10px] text-slate-500">Benchmark &ge; 50%</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-400 mb-1">Promoter Pledging (%)</label>
              <input
                type="number"
                step="0.1"
                value={pledge}
                onChange={(e) => setPledge(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
              <span className="text-[10px] text-slate-500">Must be 0.0% (Crucial)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Average 5Y RoCE (%)</label>
              <input
                type="number"
                step="0.5"
                value={roce}
                onChange={(e) => setRoce(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
              <span className="text-[10px] text-slate-500">Benchmark &ge; 15-20%</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Debt-to-Equity Ratio</label>
              <input
                type="number"
                step="0.05"
                value={debtEquity}
                onChange={(e) => setDebtEquity(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
              <span className="text-[10px] text-slate-500">Must be &le; 0.50</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Current P/E Ratio</label>
              <input
                type="number"
                step="1"
                value={pe}
                onChange={(e) => setPe(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">5Y Median Historical P/E</label>
              <input
                type="number"
                step="1"
                value={medPe}
                onChange={(e) => setMedPe(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Investonomy 4-Filter Scorecard
            </h4>
            <span className={`text-xs px-3 py-1 rounded-full font-bold border ${passedCount === 4 ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : passedCount === 3 && !p4 ? 'bg-amber-950 text-amber-400 border-amber-800' : 'bg-rose-950 text-rose-400 border-rose-800'}`}>
              {passedCount === 4 ? 'PASSED 4/4 FILTERS (COMPOUNDER)' : passedCount === 3 && !p4 ? '3/4 FILTERS (WAIT FOR DIP)' : 'FAILED FILTERS (AVOID)'}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl border bg-slate-800/60 border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Filter 1: Sustainable Economic Moat</span>
                <span className="text-[11px] text-slate-400">
                  {p1 ? 'Moat provides durable pricing power without losing customers to commodity price competition.' : 'No sustainable competitive moat identified. Highly vulnerable to price wars.'}
                </span>
              </div>
              {p1 ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            </div>

            <div className="p-3 rounded-xl border bg-slate-800/60 border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Filter 2: Promoter Skin-in-the-game & Zero Pledging</span>
                <span className="text-[11px] text-slate-400">
                  {p2 ? `Promoter holds ${promoterHold}% with 0.0% pledge. Clean governance without margin-call bankruptcy risk.` : (pledge > 0 ? `Alert: ${pledge}% promoter shares are pledged to lenders! High bankruptcy risk.` : `Promoter stake is low (${promoterHold}%). Watch institutional activism.`)}
                </span>
              </div>
              {p2 ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
            </div>

            <div className="p-3 rounded-xl border bg-slate-800/60 border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Filter 3: Capital Efficiency & Low Leverage</span>
                <span className="text-[11px] text-slate-400">
                  {p3 ? `RoCE of ${roce}% comfortably exceeds cost of capital. Debt/Equity of ${debtEquity} is conservative.` : `RoCE (${roce}%) is below 15% benchmark or Debt/Equity (${debtEquity}) is elevated.`}
                </span>
              </div>
              {p3 ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            </div>

            <div className="p-3 rounded-xl border bg-slate-800/60 border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Filter 4: Valuation & Margin of Safety</span>
                <span className="text-[11px] text-slate-400">
                  {p4 ? `Current P/E of ${pe}x is reasonably priced relative to 5Y median (${medPe}x).` : `Current P/E (${pe}x) is trading at a notable premium over 5Y median (${medPe}x).`}
                </span>
              </div>
              {p4 ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
            </div>
          </div>

          <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-1.5 text-xs">
            <span className="text-amber-400 font-bold block flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Fundamental Verdict &amp; Quality Analysis:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {passedCount === 4
                ? "Rare compounding champion. Strong competitive moat, zero promoter pledging, exceptional RoCE, and attractive valuation. Suitable for long-term buy-and-hold investing."
                : passedCount === 3 && !p4
                ? "Business quality and management pass all quality tests, but current P/E exceeds historical median. Stagger purchases across market corrections rather than buying lump sum."
                : "Failed key Investonomy tests. High debt, low RoCE, or pledged promoter shares introduce solvency and governance risk. Do not risk core capital."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
