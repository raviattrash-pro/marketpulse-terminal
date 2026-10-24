'use client';

import React, { useState } from 'react';
import {
  Radar,
  TrendingUp,
  AlertCircle,
  Activity,
  Sliders,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from 'lucide-react';

interface RadarItem {
  symbol: string;
  name: string;
  cmp: number;
  rsi14: number;
  rsiZone: 'OVERSOLD' | 'MOMENTUM' | 'OVERBOUGHT' | 'NEUTRAL';
  volumeMultiple: string;
  setupFlag: string;
  moatScore: string;
}

export default function StockRadarRSI() {
  const [filter, setFilter] = useState<'ALL' | 'OVERSOLD' | 'OVERBOUGHT' | 'MOMENTUM'>('ALL');

  const radarStocks: RadarItem[] = [
    {
      symbol: 'TITAN',
      name: 'Titan Company Ltd',
      cmp: 3480.0,
      rsi14: 28.4,
      rsiZone: 'OVERSOLD',
      volumeMultiple: '2.4x avg vol',
      setupFlag: '200 EMA Golden Support + RSI Bullish Divergence',
      moatScore: 'Monopoly Brand (28% RoCE)',
    },
    {
      symbol: 'TATAMOTORS',
      name: 'Tata Motors Ltd',
      cmp: 884.5,
      rsi14: 64.2,
      rsiZone: 'MOMENTUM',
      volumeMultiple: '3.1x avg vol',
      setupFlag: 'Multi-week Cup & Handle Breakout Confirmation',
      moatScore: 'EV Leadership (>65% Share)',
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      cmp: 1682.2,
      rsi14: 31.8,
      rsiZone: 'OVERSOLD',
      volumeMultiple: '1.9x avg vol',
      setupFlag: 'Heavy Institutional Accumulation at 1,670 Wall',
      moatScore: 'CASA Ratio & Clean Balance Sheet',
    },
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      cmp: 2740.0,
      rsi14: 48.6,
      rsiZone: 'NEUTRAL',
      volumeMultiple: '1.2x avg vol',
      setupFlag: 'Consolidation inside symmetrical triangle',
      moatScore: 'Conglomerate Dominance',
    },
    {
      symbol: 'BAJFINANCE',
      name: 'Bajaj Finance Ltd',
      cmp: 6720.0,
      rsi14: 76.8,
      rsiZone: 'OVERBOUGHT',
      volumeMultiple: '0.8x avg vol',
      setupFlag: 'Divergence near 52-week high resistance. Pullback risk.',
      moatScore: 'Consumer Lending Leader',
    },
    {
      symbol: 'INFY',
      name: 'Infosys Ltd',
      cmp: 1860.0,
      rsi14: 74.2,
      rsiZone: 'OVERBOUGHT',
      volumeMultiple: '1.4x avg vol',
      setupFlag: 'Overextended from 20 EMA. Late FOMO danger.',
      moatScore: 'Global IT Giant',
    },
    {
      symbol: 'ITC',
      name: 'ITC Ltd',
      cmp: 488.5,
      rsi14: 29.5,
      rsiZone: 'OVERSOLD',
      volumeMultiple: '1.8x avg vol',
      setupFlag: 'Graham Fair Value Dip & Value Support Floor',
      moatScore: 'Cigarette & FMCG Cash Cow',
    },
  ];

  const filtered = radarStocks.filter((s) => {
    if (filter === 'ALL') return true;
    return s.rsiZone === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30 mb-2">
              <Radar className="w-3.5 h-3.5" /> Technical Scanner &amp; Mean Reversion
            </div>
            <h2 className="text-xl font-bold text-[#E6EDF5]">
              Stock Radar &middot; Live RSI 14 Screener
            </h2>
            <p className="text-xs text-[#9AAABB] mt-1 max-w-2xl">
              &ldquo;RSI se overbought/oversold stocks, sab live market mein.&rdquo;
              Pinpoint high-probability mean reversion accumulation zones (RSI &lt; 30) and avoid dangerous late retail FOMO traps (RSI &gt; 70).
            </p>
          </div>
        </div>

        {/* RSI Meter Key */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#25313F]">
          <div className="bg-[#0D131C] border border-[#55D6BE]/30 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-mono text-[#55D6BE] uppercase font-bold">
              RSI &lt; 30 &middot; OVERSOLD
            </span>
            <div className="text-xs font-bold text-[#E6EDF5]">Smart Money Dip Buying</div>
            <p className="text-[11px] text-[#6E8298]">
              Panic selling exhausted. High margin of safety for long-term compounders.
            </p>
          </div>

          <div className="bg-[#0D131C] border border-blue-900/40 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">
              RSI 60–70 &middot; MOMENTUM
            </span>
            <div className="text-xs font-bold text-[#E6EDF5]">Trend-Following Zone</div>
            <p className="text-[11px] text-[#6E8298]">
              Volume expansion confirms institutional markup phase with moving average alignment.
            </p>
          </div>

          <div className="bg-[#0D131C] border border-rose-900/40 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">
              RSI &gt; 70 &middot; OVERBOUGHT
            </span>
            <div className="text-xs font-bold text-[#E6EDF5]">Distribution / Reversal Risk</div>
            <p className="text-[11px] text-[#6E8298]">
              Extreme stretch from mean. High probability of profit taking or sharp pullbacks.
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#25313F]/60">
          {(['ALL', 'OVERSOLD', 'MOMENTUM', 'OVERBOUGHT'] as const).map((z) => (
            <button
              key={z}
              onClick={() => setFilter(z)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                filter === z
                  ? 'bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/40 font-semibold'
                  : 'bg-[#0D131C] text-[#9AAABB] border border-[#25313F] hover:text-[#E6EDF5]'
              }`}
            >
              {z === 'ALL'
                ? 'All Scanned Stocks'
                : z === 'OVERSOLD'
                ? 'Oversold Dips (RSI < 30)'
                : z === 'MOMENTUM'
                ? 'Bullish Momentum (RSI 60-70)'
                : 'Overbought Warnings (RSI > 70)'}
            </button>
          ))}
        </div>
      </div>

      {/* Radar Table */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[#25313F] bg-[#0D131C] text-[#6E8298] text-[10px] uppercase">
                <th className="py-3 px-4 text-left">Ticker</th>
                <th className="py-3 px-3 text-right">CMP (₹)</th>
                <th className="py-3 px-3 text-center">RSI (14)</th>
                <th className="py-3 px-4 text-center">Radar Classification</th>
                <th className="py-3 px-3 text-right">Volume Pulse</th>
                <th className="py-3 px-4 text-left">Breakout / Setup Indicator</th>
                <th className="py-3 px-4 text-left">Moat Edge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#25313F]/50">
              {filtered.map((item) => (
                <tr key={item.symbol} className="hover:bg-[#0D131C]/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#E6EDF5] block">{item.symbol}</span>
                    <span className="text-[10px] text-[#6E8298]">{item.name}</span>
                  </td>

                  <td className="py-3 px-3 text-right font-bold text-[#E6EDF5]">
                    ₹{item.cmp.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center gap-1.5 font-bold">
                      <span
                        className={`text-sm ${
                          item.rsi14 < 30
                            ? 'text-[#55D6BE]'
                            : item.rsi14 > 70
                            ? 'text-rose-400'
                            : 'text-[#E6EDF5]'
                        }`}
                      >
                        {item.rsi14}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        item.rsiZone === 'OVERSOLD'
                          ? 'bg-[#132E30] text-[#55D6BE] border-[#55D6BE]/40'
                          : item.rsiZone === 'OVERBOUGHT'
                          ? 'bg-rose-950/70 text-rose-400 border-rose-800'
                          : 'bg-blue-950/70 text-blue-300 border-blue-800'
                      }`}
                    >
                      {item.rsiZone}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                    {item.volumeMultiple}
                  </td>

                  <td className="py-3 px-4 text-[#E6EDF5] max-w-xs truncate" title={item.setupFlag}>
                    {item.setupFlag}
                  </td>

                  <td className="py-3 px-4 text-[#9AAABB] text-[11px]">
                    {item.moatScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
