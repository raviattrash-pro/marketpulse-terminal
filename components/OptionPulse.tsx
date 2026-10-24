'use client';

import React, { useState } from 'react';
import {
  Flame,
  Zap,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';

interface OptionPulseRow {
  symbol: string;
  spotPrice: number;
  atmStrike: number;
  callPremium: number;
  putPremium: number;
  straddlePrice: number;
  expectedMove: string;
  iv: number;
  ivPercentile: number;
  pricingStatus: 'SASTA' | 'MEHENGA' | 'FAIR';
  recommendation: string;
}

export default function OptionPulse() {
  const [filter, setFilter] = useState<'ALL' | 'SASTA' | 'MEHENGA'>('ALL');

  const optionsData: OptionPulseRow[] = [
    {
      symbol: 'NIFTY 50',
      spotPrice: 24320,
      atmStrike: 24300,
      callPremium: 112.5,
      putPremium: 98.0,
      straddlePrice: 210.5,
      expectedMove: '±210 pts (24,110 – 24,530)',
      iv: 12.8,
      ivPercentile: 18,
      pricingStatus: 'SASTA',
      recommendation: 'Premiums are cheap (IVP 18%). Favorable for Long Options & Debit Spreads.',
    },
    {
      symbol: 'BANKNIFTY',
      spotPrice: 51840,
      atmStrike: 51800,
      callPremium: 310.0,
      putPremium: 285.0,
      straddlePrice: 595.0,
      expectedMove: '±595 pts (51,205 – 52,395)',
      iv: 15.2,
      ivPercentile: 32,
      pricingStatus: 'FAIR',
      recommendation: 'Fairly priced premiums. Balanced risk for directional spreads.',
    },
    {
      symbol: 'TATAMOTORS',
      spotPrice: 884.5,
      atmStrike: 880,
      callPremium: 22.4,
      putPremium: 18.0,
      straddlePrice: 40.4,
      expectedMove: '±40.4 pts (844 – 925)',
      iv: 29.4,
      ivPercentile: 78,
      pricingStatus: 'MEHENGA',
      recommendation: 'High IV (IVP 78%). Option buyers face severe theta decay. Credit Spreads preferred.',
    },
    {
      symbol: 'HDFCBANK',
      spotPrice: 1682.2,
      atmStrike: 1680,
      callPremium: 28.5,
      putPremium: 24.0,
      straddlePrice: 52.5,
      expectedMove: '±52.5 pts (1,629 – 1,734)',
      iv: 14.1,
      ivPercentile: 14,
      pricingStatus: 'SASTA',
      recommendation: 'Very cheap option premiums (IVP 14%). High leverage opportunity for delta breakout.',
    },
    {
      symbol: 'INFY',
      spotPrice: 1860.0,
      atmStrike: 1860,
      callPremium: 48.0,
      putPremium: 44.0,
      straddlePrice: 92.0,
      expectedMove: '±92.0 pts (1,768 – 1,952)',
      iv: 31.8,
      ivPercentile: 82,
      pricingStatus: 'MEHENGA',
      recommendation: 'Overpriced ahead of US tech earnings. Avoid naked buying; sell high Vega.',
    },
    {
      symbol: 'TITAN',
      spotPrice: 3480.0,
      atmStrike: 3480,
      callPremium: 68.0,
      putPremium: 62.0,
      straddlePrice: 130.0,
      expectedMove: '±130 pts (3,350 – 3,610)',
      iv: 18.4,
      ivPercentile: 24,
      pricingStatus: 'SASTA',
      recommendation: 'Subdued IV before festive breakout. Cheap options favor bull call spreads.',
    },
  ];

  const filtered = optionsData.filter((row) => {
    if (filter === 'ALL') return true;
    return row.pricingStatus === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30 mb-2">
              <Zap className="w-3.5 h-3.5" /> Options Pricing &amp; IV Pulse
            </div>
            <h2 className="text-xl font-bold text-[#E6EDF5]">
              Option Pulse &middot; Sasta ya Mehenga Radar
            </h2>
            <p className="text-xs text-[#9AAABB] mt-1 max-w-2xl">
              &ldquo;Dekho kaunsa future aur option premium sasta ya mehenga hai.&rdquo;
              Analyzes Implied Volatility Percentile (IVP) to tell you whether to <strong>BUY</strong> options (when IV is low/sasta) or <strong>SELL</strong> spreads (when IV is high/mehenga).
            </p>
          </div>
        </div>

        {/* Quick Rule Info Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 pt-5 border-t border-[#25313F]">
          <div className="bg-[#0D131C] border border-[#55D6BE]/30 rounded-lg p-3.5 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#55D6BE] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-[#55D6BE] block">SASTA (IV Percentile &lt; 30%):</span>
              <p className="text-[#9AAABB] mt-0.5">
                Premiums are discounted. Option sellers get poor reward; option buyers get maximum convexity with minimal theta penalty.
              </p>
            </div>
          </div>

          <div className="bg-[#0D131C] border border-rose-900/40 rounded-lg p-3.5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-rose-400 block">MEHENGA (IV Percentile &gt; 70%):</span>
              <p className="text-[#9AAABB] mt-0.5">
                Premiums are inflated. Naked buyers lose money rapidly due to IV crush. Selling credit spreads or Iron Condors is mathematically superior.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#25313F]/60">
          {(['ALL', 'SASTA', 'MEHENGA'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                filter === f
                  ? 'bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/40 font-semibold'
                  : 'bg-[#0D131C] text-[#9AAABB] border border-[#25313F] hover:text-[#E6EDF5]'
              }`}
            >
              {f === 'ALL' ? 'All Contracts' : f === 'SASTA' ? 'Sasta Premiums (Cheap to Buy)' : 'Mehenga Premiums (Expensive / IV Crush)'}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Pulse Table */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[#25313F] bg-[#0D131C] text-[#6E8298] text-[10px] uppercase">
                <th className="py-3 px-4 text-left">Underlying</th>
                <th className="py-3 px-3 text-right">Spot</th>
                <th className="py-3 px-3 text-center">ATM Strike</th>
                <th className="py-3 px-3 text-right">Straddle Cost</th>
                <th className="py-3 px-4 text-left">Today&apos;s Expected Move</th>
                <th className="py-3 px-3 text-right">IV &middot; IVP</th>
                <th className="py-3 px-4 text-center">Pricing Verdict</th>
                <th className="py-3 px-4 text-left">Strategy Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#25313F]/50">
              {filtered.map((item) => (
                <tr key={item.symbol} className="hover:bg-[#0D131C]/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#E6EDF5] block">{item.symbol}</span>
                  </td>

                  <td className="py-3 px-3 text-right font-bold text-[#E6EDF5]">
                    ₹{item.spotPrice.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-3 text-center text-[#55D6BE] font-bold">
                    {item.atmStrike.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-3 text-right font-bold text-[#E6EDF5]">
                    ₹{item.straddlePrice.toFixed(1)}
                  </td>

                  <td className="py-3 px-4 text-[#9AAABB]">
                    {item.expectedMove}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span className="text-[#E6EDF5] font-bold">{item.iv}%</span>
                    <span className="text-[10px] text-[#6E8298] block">IVP: {item.ivPercentile}%</span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        item.pricingStatus === 'SASTA'
                          ? 'bg-[#132E30] text-[#55D6BE] border-[#55D6BE]/40'
                          : item.pricingStatus === 'MEHENGA'
                          ? 'bg-rose-950/70 text-rose-400 border-rose-800'
                          : 'bg-[#0D131C] text-[#9AAABB] border-[#25313F]'
                      }`}
                    >
                      {item.pricingStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-xs text-[#9AAABB] max-w-xs truncate" title={item.recommendation}>
                    {item.recommendation}
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
