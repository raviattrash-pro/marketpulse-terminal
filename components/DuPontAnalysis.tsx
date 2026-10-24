'use client';

import React, { useState } from 'react';
import { Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DuPontAnalysis() {
  const [name, setName] = useState('TATA MOTORS LTD');
  const [margin, setMargin] = useState(7.2);
  const [turnover, setTurnover] = useState(1.15);
  const [leverage, setLeverage] = useState(2.8);
  const [de, setDe] = useState(0.75);
  const [ocf, setOcf] = useState(1.25);

  const roe = (margin * turnover * leverage).toFixed(2);

  let score = 50;
  const numRoe = parseFloat(roe);
  if (numRoe >= 18) score += 20; else if (numRoe >= 14) score += 10;
  if (de <= 0.8) score += 15; else if (de <= 1.2) score += 5;
  if (ocf >= 1.0) score += 15;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-5">
        <h3 className="font-bold text-emerald-300 text-base flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" /> Fundamental Analysis & DuPont RoE Framework
        </h3>
        <p className="text-xs text-slate-300 mt-1">
          Deconstruct Return on Equity (RoE) into <strong>Operating Efficiency</strong>, <strong>Asset Use Efficiency</strong>, and <strong>Financial Leverage</strong> to identify true high-moat compounders vs debt-fueled illusions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Company Financial Statements
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Company / Stock Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Net Margin (%)</label>
              <input
                type="number"
                step="0.1"
                value={margin}
                onChange={(e) => setMargin(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Asset Turnover Ratio</label>
              <input
                type="number"
                step="0.05"
                value={turnover}
                onChange={(e) => setTurnover(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Leverage Multiplier</label>
              <input
                type="number"
                step="0.1"
                value={leverage}
                onChange={(e) => setLeverage(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Debt-to-Equity Ratio</label>
              <input
                type="number"
                step="0.05"
                value={de}
                onChange={(e) => setDe(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">OCF / Net Income Ratio</label>
              <input
                type="number"
                step="0.05"
                value={ocf}
                onChange={(e) => setOcf(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex items-end pb-1">
              <span className="text-[10px] text-slate-400">OCF &gt; 1.0 means reported profits convert into cold cash.</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              DuPont Analysis Breakdown
            </h4>
            <span className={`text-xs px-3 py-1 rounded-full font-bold border ${score >= 80 ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800'}`}>
              {score >= 80 ? `HIGH QUALITY COMPOUNDER (${score}/100)` : `LEVERAGE SENSITIVE (${score}/100)`}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
              <span className="text-[11px] text-slate-400 block">Pillar 1: Net Margin</span>
              <span className="text-lg font-black text-cyan-400 font-mono">{margin}%</span>
              <span className="text-[10px] text-slate-500 block">Pricing power</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
              <span className="text-[11px] text-slate-400 block">Pillar 2: Asset Turns</span>
              <span className="text-lg font-black text-amber-400 font-mono">{turnover}x</span>
              <span className="text-[10px] text-slate-500 block">Capital speed</span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
              <span className="text-[11px] text-slate-400 block">Pillar 3: Leverage</span>
              <span className="text-lg font-black text-purple-400 font-mono">{leverage}x</span>
              <span className="text-[10px] text-slate-500 block">Balance sheet debt</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Resulting Return on Equity (RoE)</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">{roe}%</div>
              <span className="text-[10px] text-slate-500">Formula: Net Margin &times; Asset Turnover &times; Leverage</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Institutional Benchmark</span>
              <span className="text-sm font-bold text-white">&gt; 15% Sustained RoE</span>
              <span className="text-[10px] text-emerald-400 block">Passed Quality Filter</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 text-xs">
            <span className="text-cyan-400 font-bold block">📖 Fundamental Rule of Thumb:</span>
            <p className="text-slate-300 leading-relaxed">
              {score >= 80
                ? `Strong Return on Equity (${roe}%) primarily generated by operational efficiency and asset velocity rather than dangerous debt. OCF/Net Income is ${ocf}x confirming real cash conversion. Institutional quality standard met.`
                : `RoE is ${roe}%, but check if leverage (${leverage}x) or debt-to-equity (${de}) is inflating returns. Watch working capital and cash conversion cycles closely.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
