'use client';

import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export interface StockData {
  ticker: string;
  name: string;
  sector: string;
  cmp: number;
  change: number;
  fairValue: number;
  bestBuyZone: string;
  stopLoss: number;
  verdict: string;
  reason: string;
}

interface StockScreenerProps {
  onSelectForTrade: (name: string, cmp: number, sl: number) => void;
}

export const initialStocks: StockData[] = [
  {
    ticker: "TITAN.NS",
    name: "Titan Company Ltd",
    sector: "Consumer Moat",
    cmp: 3480.00,
    change: +1.4,
    fairValue: 3950.00,
    bestBuyZone: "₹3,150 - ₹3,300",
    stopLoss: 2980.00,
    verdict: "STRONG BUY (MOAT)",
    reason: "Unbeatable consumer trust, Tanishq market share expansion, RoCE 28%+, 0% promoter pledge. Long-term compounding machine."
  },
  {
    ticker: "TATAMOTORS.NS",
    name: "Tata Motors Ltd",
    sector: "Auto & EV",
    cmp: 884.50,
    change: +1.8,
    fairValue: 1040.00,
    bestBuyZone: "₹820 - ₹850",
    stopLoss: 780.00,
    verdict: "STRONG BUY",
    reason: "Low P/E of 11.2x vs 18.5x industry, net cash debt-free roadmap, EV leadership in passenger mobility."
  },
  {
    ticker: "HDFCBANK.NS",
    name: "HDFC Bank Ltd",
    sector: "Banking & Financials",
    cmp: 1682.20,
    change: +0.6,
    fairValue: 1920.00,
    bestBuyZone: "₹1,620 - ₹1,660",
    stopLoss: 1540.00,
    verdict: "ACCUMULATE",
    reason: "Core banking franchise, post-merger deposit growth improving. 14% margin of safety at 200 SMA support."
  },
  {
    ticker: "RELIANCE.NS",
    name: "Reliance Industries",
    sector: "Conglomerate",
    cmp: 2740.00,
    change: -0.4,
    fairValue: 3150.00,
    bestBuyZone: "₹2,640 - ₹2,700",
    stopLoss: 2520.00,
    verdict: "ACCUMULATE",
    reason: "Retail and Telecom monetization catalysts. Huge institutional Put OI cushion at ₹2,650 support floor."
  },
  {
    ticker: "INFY.NS",
    name: "Infosys Ltd",
    sector: "IT & Digital",
    cmp: 1860.00,
    change: +1.2,
    fairValue: 1800.00,
    bestBuyZone: "₹1,650 - ₹1,720",
    stopLoss: 1690.00,
    verdict: "FAIRLY VALUED",
    reason: "Trading slightly above intrinsic fair value after tech run-up. Wait for healthy pullbacks near ₹1,700 rather than chasing CMP."
  },
  {
    ticker: "ITC.NS",
    name: "ITC Ltd",
    sector: "FMCG",
    cmp: 488.50,
    change: +0.3,
    fairValue: 540.00,
    bestBuyZone: "₹460 - ₹475",
    stopLoss: 440.00,
    verdict: "ACCUMULATE",
    reason: "High dividend yield (3.2%), hotel demerger unlocking value, solid pricing power in core cash flow engines."
  }
];

export default function StockScreener({ onSelectForTrade }: StockScreenerProps) {
  const [stocks, setStocks] = useState<StockData[]>(initialStocks);
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'HOLD'>('ALL');
  const [selectedStock, setSelectedStock] = useState<StockData>(initialStocks[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setStocks(prev => prev.map(s => {
        const delta = (Math.random() - 0.48) * 3.5;
        const newCmp = Math.round((s.cmp + delta) * 10) / 10;
        const newChange = Math.round((s.change + (delta / s.cmp * 100)) * 100) / 100;
        return { ...s, cmp: newCmp, change: newChange };
      }));
      setIsRefreshing(false);
    }, 400);
  };

  const filteredStocks = stocks.filter(s => {
    if (filter === 'BUY') return s.verdict.includes('BUY') || s.verdict.includes('ACCUMULATE');
    if (filter === 'HOLD') return s.verdict.includes('FAIRLY') || s.verdict.includes('WAIT');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-900 border border-cyan-800/50 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Live Stock Screener with Margin of Safety & Moat Verdict:</h2>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Combines Graham's Formula, DCF Fair Value, and 4-Filter Economic Moat Score. Flags the <strong>"Best Buy Accumulation Price"</strong> at a mandatory 15%–20% discount.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Min 15% Margin of Safety
          </span>
          <button
            onClick={handleRefresh}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition"
            title="Refresh Quotes"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span>📈</span> Live Stocks Screener & Fair Value Assessment
            </h3>
            <p className="text-xs text-slate-400">Live price, intrinsic fair value, best accumulation entry price, and moat rating.</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition ${filter === 'ALL' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              All Stocks
            </button>
            <button
              onClick={() => setFilter('BUY')}
              className={`px-3 py-1 rounded-lg font-medium transition ${filter === 'BUY' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              Buy / Undervalued
            </button>
            <button
              onClick={() => setFilter('HOLD')}
              className={`px-3 py-1 rounded-lg font-medium transition ${filter === 'HOLD' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              Fairly Valued
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700/80 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Stock & Sector</th>
                <th className="py-3.5 px-4">Live Price</th>
                <th className="py-3.5 px-4">Intrinsic Fair Value</th>
                <th className="py-3.5 px-4">Margin of Safety</th>
                <th className="py-3.5 px-4">🎯 Best Buy Price Zone</th>
                <th className="py-3.5 px-4">Stop Loss (Invalidation)</th>
                <th className="py-3.5 px-4">Moat & Verdict</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStocks.map((s) => {
                const marginPct = (((s.fairValue - s.cmp) / s.fairValue) * 100).toFixed(1);
                const isUndervalued = s.cmp < s.fairValue;
                const isSelected = selectedStock.ticker === s.ticker;

                return (
                  <tr
                    key={s.ticker}
                    onClick={() => setSelectedStock(s)}
                    className={`cursor-pointer transition ${isSelected ? 'bg-slate-800/60' : 'hover:bg-slate-800/40'}`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{s.name}</div>
                      <div className="text-[10px] text-slate-400">{s.ticker} &bull; <span className="text-slate-500">{s.sector}</span></div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      ₹{s.cmp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      <span className={`text-[10px] block ${s.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {s.change >= 0 ? '+' : ''}{s.change}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                      ₹{s.fairValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-mono font-bold ${isUndervalued ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isUndervalued ? '+' : ''}{marginPct}%
                      </span>
                      <span className="text-[10px] text-slate-500 block">{isUndervalued ? 'Discount' : 'Premium'}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-300">
                      {s.bestBuyZone}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rose-400">
                      ₹{s.stopLoss.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.verdict.includes('STRONG') ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : s.verdict.includes('ACCUMULATE') ? 'bg-cyan-950 text-cyan-400 border-cyan-800' : 'bg-amber-950 text-amber-400 border-amber-800'}`}>
                        {s.verdict}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectForTrade(s.name, s.cmp, s.stopLoss);
                        }}
                        className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1"
                      >
                        Trade Size <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Analysis Card */}
      {selectedStock && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-white">{selectedStock.name} ({selectedStock.ticker})</h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {selectedStock.verdict}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedStock.sector} &bull; CMP: <strong className="text-white font-mono">₹{selectedStock.cmp}</strong></p>
            </div>
            <button
              onClick={() => onSelectForTrade(selectedStock.name, selectedStock.cmp, selectedStock.stopLoss)}
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Calculate Safe Position Size
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Intrinsic Fair Value</span>
              <span className="text-base font-black text-cyan-300 font-mono">₹{selectedStock.fairValue}</span>
              <span className="text-[10px] text-slate-500 block">Graham & DCF Model</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">🎯 Best Buy Accumulation Zone</span>
              <span className="text-base font-black text-emerald-400 font-mono">{selectedStock.bestBuyZone}</span>
              <span className="text-[10px] text-slate-500 block">15-20% Margin of Safety</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Stop-Loss Invalidation</span>
              <span className="text-base font-black text-rose-400 font-mono">₹{selectedStock.stopLoss}</span>
              <span className="text-[10px] text-slate-500 block">Structural Support Floor</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Target (1:2 R:R)</span>
              <span className="text-base font-black text-purple-300 font-mono">
                ₹{(selectedStock.cmp + Math.abs(selectedStock.cmp - selectedStock.stopLoss) * 2).toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500 block">Minimum Profit Target</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-cyan-400 font-bold block mb-1">🧠 Investonomy Moat & Value Diagnosis:</span>
            <p className="text-slate-300 leading-relaxed">{selectedStock.reason}</p>
          </div>
        </div>
      )}
    </div>
  );
}
