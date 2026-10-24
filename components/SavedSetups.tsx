'use client';

import React from 'react';
import { Bookmark, ArrowRight, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

interface SavedSetupsProps {
  onLoadTrade: (name: string, cmp: number, sl: number) => void;
}

export default function SavedSetups({ onLoadTrade }: SavedSetupsProps) {
  const setups = [
    {
      id: 'setup-1',
      ticker: 'TITAN.NS',
      name: 'Titan Company Ltd',
      strategy: 'Graham Margin of Safety + Economic Moat',
      cmp: 3480,
      fairValue: 3950,
      buyZone: '₹3,150 – ₹3,300',
      sl: 2980,
      target: 4100,
      rr: '1:2.4',
      moat: 'Monopolistic Brand Equity (Tanishq / Fastrack)',
      roce: '28.4%',
      pledge: '0.0%',
      peVsMedian: '82x vs 74x (Fair)',
      thesis:
        'Unbeatable consumer trust, Tanishq jewelry market share expansion, zero debt overhang. Ideal for long-term compounders.',
    },
    {
      id: 'setup-2',
      ticker: 'NIFTY 24800 / 25100',
      name: 'NIFTY Weekly Bull Call Spread',
      strategy: 'Institutional OI PCR Bullish Reversal',
      cmp: 24850,
      fairValue: 25200,
      buyZone: 'Current ATM (24,850)',
      sl: 24650,
      target: 25150,
      rr: '1:2.57',
      moat: 'Put-Call Ratio (PCR) 1.28 + Heavy Put writing at 24,700 Support',
      roce: 'Max Profit: ₹10,800',
      pledge: 'Max Risk: ₹4,200',
      peVsMedian: 'VIX: 13.84 (Low Volatility Advantage)',
      thesis:
        'Strict defined-risk spread eliminating naked directional delta risk. Theta decay works in favor if consolidation occurs.',
    },
    {
      id: 'setup-3',
      ticker: 'TATAMOTORS.NS',
      name: 'Tata Motors Ltd',
      strategy: 'DuPont Asset Turnover & Low P/E Valuation',
      cmp: 884.5,
      fairValue: 1040,
      buyZone: '₹820 – ₹850',
      sl: 780,
      target: 1050,
      rr: '1:2.6',
      moat: 'JLR Order Backlog + Indian EV Market Share (>65%)',
      roce: '22.1%',
      pledge: '0.0%',
      peVsMedian: '11.2x vs 18.5x Industry',
      thesis:
        'Net cash debt-free roadmap completed. Commercial Vehicle cycle turnaround and commercial EV expansion.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30 mb-2">
            <Bookmark className="w-3.5 h-3.5" /> Curated Watchlist
          </div>
          <h2 className="text-xl font-bold text-[#E6EDF5]">Saved Setups (03 Active)</h2>
          <p className="text-xs text-[#9AAABB] mt-1 max-w-2xl">
            Pre-filtered investment &amp; options blueprints that adhere strictly to institutional
            4-Filter Economic Moat criteria, Graham&apos;s Margin of Safety, and systematic 1:2+ R:R ratios.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {setups.map((s) => (
          <div
            key={s.id}
            className="bg-[#111923] border border-[#25313F] hover:border-[#55D6BE]/40 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 group"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#55D6BE] bg-[#132E30] px-2 py-0.5 rounded border border-[#55D6BE]/20 font-semibold">
                    {s.strategy}
                  </span>
                  <h3 className="text-base font-bold text-[#E6EDF5] mt-1.5 group-hover:text-[#55D6BE] transition-colors">
                    {s.name}
                  </h3>
                  <span className="text-xs font-mono text-[#6E8298]">{s.ticker}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#6E8298] block">CMP</span>
                  <span className="text-base font-bold font-mono text-[#E6EDF5]">
                    ₹{s.cmp.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Price Target and Risk */}
              <div className="grid grid-cols-3 gap-2 bg-[#0D131C] border border-[#25313F] rounded-lg p-2.5 text-center">
                <div>
                  <span className="text-[10px] text-[#6E8298] block">Fair Value</span>
                  <span className="text-xs font-bold font-mono text-[#55D6BE]">
                    ₹{s.fairValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6E8298] block">Stop Loss</span>
                  <span className="text-xs font-bold font-mono text-rose-400">
                    ₹{s.sl.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6E8298] block">R:R Ratio</span>
                  <span className="text-xs font-bold font-mono text-[#E6EDF5]">{s.rr}</span>
                </div>
              </div>

              {/* Moat & Governance Metrics */}
              <div className="space-y-2 text-xs text-[#9AAABB]">
                <div className="flex items-center justify-between py-1 border-b border-[#25313F]/50">
                  <span className="text-[#6E8298]">Moat / Edge:</span>
                  <span className="text-[#E6EDF5] font-medium text-right max-w-[180px] truncate" title={s.moat}>
                    {s.moat}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#25313F]/50">
                  <span className="text-[#6E8298]">RoCE / Metric:</span>
                  <span className="text-[#55D6BE] font-mono font-medium">{s.roce}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#25313F]/50">
                  <span className="text-[#6E8298]">Promoter Pledge / Risk:</span>
                  <span className="text-emerald-400 font-mono font-medium">{s.pledge}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#6E8298]">Valuation Check:</span>
                  <span className="text-[#E6EDF5] font-mono text-[11px]">{s.peVsMedian}</span>
                </div>
              </div>

              {/* Thesis */}
              <div className="bg-[#0D131C] border border-[#25313F]/60 rounded-lg p-3 text-[11px] text-[#9AAABB] leading-relaxed">
                <span className="text-[#55D6BE] font-semibold block mb-0.5">Execution Plan:</span>
                {s.thesis}
              </div>
            </div>

            {/* Load Button */}
            <div className="pt-4 mt-4 border-t border-[#25313F]">
              <button
                onClick={() => onLoadTrade(s.name, s.cmp, s.sl)}
                className="w-full flex items-center justify-center gap-2 bg-[#132E30] hover:bg-[#55D6BE]/20 text-[#55D6BE] border border-[#55D6BE]/40 hover:border-[#55D6BE] px-4 py-2.5 rounded-lg text-xs font-semibold transition-all group-hover:shadow-lg group-hover:shadow-[#55D6BE]/10"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Load into Position Sizer</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
