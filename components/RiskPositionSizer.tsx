'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Target, AlertTriangle } from 'lucide-react';

interface RiskPositionSizerProps {
  initialEntry?: number;
  initialSl?: number;
}

export default function RiskPositionSizer({ initialEntry = 880, initialSl = 840 }: RiskPositionSizerProps) {
  const [capital, setCapital] = useState(100000);
  const [riskPct, setRiskPct] = useState(2.0);
  const [entry, setEntry] = useState(initialEntry);
  const [sl, setSl] = useState(initialSl);
  const [instrument, setInstrument] = useState('EQUITY');
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [liveStocks, setLiveStocks] = useState<any[]>([]);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/live-stocks');
        if (res.ok) {
          const data = await res.json();
          if (data.stocks) setLiveStocks(data.stocks);
        }
      } catch (e) {}
    };
    fetchLive();
  }, []);

  const handleSelectLiveStock = (sym: string) => {
    const s = liveStocks.find((x) => x.symbol === sym);
    if (s) {
      setEntry(Math.round(s.price));
      setSl(Math.round(s.stopLoss || s.price * 0.98));
    }
  };

  useEffect(() => {
    if (initialEntry) setEntry(initialEntry);
    if (initialSl) setSl(initialSl);
  }, [initialEntry, initialSl]);

  const riskPoints = Math.max(1, Math.abs(entry - sl));
  const maxRiskAmount = capital * (riskPct / 100);

  let lotSize = 1;
  if (instrument === 'NIFTY') lotSize = 25;
  if (instrument === 'BANKNIFTY') lotSize = 15;
  if (instrument === 'FINNIFTY') lotSize = 25;

  const rawQty = Math.floor(maxRiskAmount / riskPoints);
  const lots = Math.max(1, Math.floor(rawQty / lotSize));
  const allowedQty = Math.max(lotSize, lots * lotSize);
  const totalOutlay = allowedQty * entry;
  const actualRisk = allowedQty * riskPoints;

  const t1 = direction === 'LONG' ? entry + riskPoints * 2 : entry - riskPoints * 2;
  const t2 = direction === 'LONG' ? entry + riskPoints * 3 : entry - riskPoints * 3;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-800/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-cyan-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-cyan-300 text-sm">Strict 1%–2% Position Sizer (Institutional Risk Management Model):</h3>
            <p className="text-xs text-slate-300 mt-0.5">"Position sizing is not about how much profit you want; it is about how much you are mathematically allowed to lose on one bad trade."</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-900/40 px-2.5 py-1 rounded border border-cyan-700/40 shrink-0">
          Rule: Max 1%-2% Risk
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚙️</span> Trade Parameters
          </h2>

          {/* Live Quick Stock Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Load Live NSE Equities
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {['RELIANCE', 'TCS', 'HDFCBANK', 'ICICIBANK', 'INFY', 'TATAMOTORS', 'TITAN', 'BAJFINANCE', 'SBIN'].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => handleSelectLiveStock(sym)}
                  className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 hover:bg-cyan-900/60 hover:text-cyan-300 text-slate-300 border border-slate-700 transition cursor-pointer shrink-0"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Capital (₹)</label>
              <input
                type="number"
                step="10000"
                value={capital}
                onChange={(e) => setCapital(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Risk Per Trade (%)</label>
              <select
                value={riskPct}
                onChange={(e) => setRiskPct(parseFloat(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              >
                <option value={1}>1.0% (Disciplined / Recommended)</option>
                <option value={1.5}>1.5% (Moderate)</option>
                <option value={2}>2.0% (Upper Limit Cap)</option>
                <option value={3}>3.0% (High Risk Alert ⚠️)</option>
              </select>
            </div>
          </div>

          {/* Live Quick Stock Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Load Live NSE Equities
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {['RELIANCE', 'TCS', 'HDFCBANK', 'ICICIBANK', 'INFY', 'TATAMOTORS', 'TITAN', 'BAJFINANCE', 'SBIN'].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => handleSelectLiveStock(sym)}
                  className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 hover:bg-cyan-900/60 hover:text-cyan-300 text-slate-300 border border-slate-700 transition cursor-pointer shrink-0"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Contract / Asset</label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              >
                <option value="EQUITY">Cash Equity (1 Share)</option>
                <option value="NIFTY">NIFTY 50 Options (Lot: 25)</option>
                <option value="BANKNIFTY">BANKNIFTY Options (Lot: 15)</option>
                <option value="FINNIFTY">FINNIFTY Options (Lot: 25)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('LONG')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${direction === 'LONG' ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400' : 'border-slate-700 bg-slate-800 text-slate-400'}`}
                >
                  BUY / LONG
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('SHORT')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${direction === 'SHORT' ? 'border-rose-500 bg-rose-950/60 text-rose-400' : 'border-slate-700 bg-slate-800 text-slate-400'}`}
                >
                  SELL / SHORT
                </button>
              </div>
            </div>
          </div>

          {/* Live Quick Stock Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Load Live NSE Equities
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {['RELIANCE', 'TCS', 'HDFCBANK', 'ICICIBANK', 'INFY', 'TATAMOTORS', 'TITAN', 'BAJFINANCE', 'SBIN'].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => handleSelectLiveStock(sym)}
                  className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 hover:bg-cyan-900/60 hover:text-cyan-300 text-slate-300 border border-slate-700 transition cursor-pointer shrink-0"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Entry Price (₹)</label>
              <input
                type="number"
                step="0.5"
                value={entry}
                onChange={(e) => setEntry(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Stop Loss (₹)</label>
              <input
                type="number"
                step="0.5"
                value={sl}
                onChange={(e) => setSl(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Position Sizing Result</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                Risk Compliant
              </span>
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                <span className="text-[11px] text-slate-400 block">Max Risk</span>
                <span className="text-lg font-black text-rose-400">₹{Math.round(actualRisk).toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-500 block">{((actualRisk / capital) * 100).toFixed(1)}% of Capital</span>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                <span className="text-[11px] text-slate-400 block">SL Distance</span>
                <span className="text-lg font-black text-amber-400">{riskPoints.toFixed(1)} pts</span>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                <span className="text-[11px] text-slate-400 block">Allowed Qty</span>
                <span className="text-lg font-black text-cyan-400">{allowedQty} shares</span>
                <span className="text-[10px] text-cyan-300/80 block">{lotSize === 1 ? 'Cash Equity' : `${lots} Lots`}</span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Total Capital Outlay:</span>
                <span className="font-bold text-white font-mono">₹{Math.round(totalOutlay).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Portfolio Utilization:</span>
                <span className="font-bold text-cyan-400 font-mono">{((totalOutlay / capital) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" /> Profit Targets (1:2 & 1:3 R:R Rule)
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-3">
                <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                  <span>Target 1 (1:2 R:R)</span>
                  <span className="text-[10px] bg-emerald-900/60 px-1.5 py-0.5 rounded">Minimum</span>
                </div>
                <div className="text-lg font-mono font-black text-emerald-300">₹{t1.toFixed(2)}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Expected Gain: <strong className="text-emerald-400 font-mono">+₹{Math.round(allowedQty * (riskPoints * 2)).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="bg-cyan-950/30 border border-cyan-800/50 rounded-xl p-3">
                <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
                  <span>Target 2 (1:3 R:R)</span>
                  <span className="text-[10px] bg-cyan-900/60 px-1.5 py-0.5 rounded">Runner</span>
                </div>
                <div className="text-lg font-mono font-black text-cyan-300">₹{t2.toFixed(2)}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Expected Gain: <strong className="text-cyan-400 font-mono">+₹{Math.round(allowedQty * (riskPoints * 3)).toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <div>
                  <span className="font-semibold text-rose-300">Anti-Revenge Circuit Breaker:</span>
                  <span className="text-slate-400 block text-[11px]">Shut down terminal if you lose 2 consecutive trades.</span>
                </div>
              </div>
              <span className="text-rose-400 font-mono font-bold">-₹{Math.round(maxRiskAmount * 2).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
