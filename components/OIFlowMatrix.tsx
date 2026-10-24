'use client';

import React, { useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface OIFlowItem {
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  oiChange: number;
  quadrant: 'LONG_BUILDUP' | 'SHORT_BUILDUP' | 'SHORT_COVERING' | 'LONG_UNWINDING';
  interpretation: string;
}

export default function OIFlowMatrix() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'LONG_BUILDUP' | 'SHORT_BUILDUP' | 'SHORT_COVERING' | 'LONG_UNWINDING'>('ALL');

  const oiData: OIFlowItem[] = [
    {
      symbol: 'TATAMOTORS',
      name: 'Tata Motors Nov Fut',
      price: 884.5,
      priceChange: +1.8,
      oiChange: +14.2,
      quadrant: 'LONG_BUILDUP',
      interpretation: 'Aggressive institutional long positions added. High continuation probability.',
    },
    {
      symbol: 'TITAN',
      name: 'Titan Nov Fut',
      price: 3480.0,
      priceChange: +1.4,
      oiChange: +9.6,
      quadrant: 'LONG_BUILDUP',
      interpretation: 'Fresh accumulation in consumer monopoly ahead of festive quarter.',
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Nov Fut',
      price: 1682.2,
      priceChange: +1.2,
      oiChange: +8.4,
      quadrant: 'LONG_BUILDUP',
      interpretation: 'Heavy institutional volume expansion above 1,670 resistance.',
    },
    {
      symbol: 'INFY',
      name: 'Infosys Nov Fut',
      price: 1860.0,
      priceChange: -1.4,
      oiChange: +11.8,
      quadrant: 'SHORT_BUILDUP',
      interpretation: 'Fresh short selling initiated by institutions following US tech weakness.',
    },
    {
      symbol: 'BAJFINANCE',
      name: 'Bajaj Finance Nov Fut',
      price: 6720.0,
      priceChange: -1.1,
      oiChange: +7.9,
      quadrant: 'SHORT_BUILDUP',
      interpretation: 'Bears dominating near swing high with increasing open contracts.',
    },
    {
      symbol: 'SBIN',
      name: 'State Bank of India Nov Fut',
      price: 792.0,
      priceChange: +2.3,
      oiChange: -8.1,
      quadrant: 'SHORT_COVERING',
      interpretation: 'Short sellers forced to panic buy-back contracts. Strong squeeze momentum.',
    },
    {
      symbol: 'RELIANCE',
      name: 'Reliance Nov Fut',
      price: 2740.0,
      priceChange: +0.9,
      oiChange: -5.4,
      quadrant: 'SHORT_COVERING',
      interpretation: 'Call writers unwinding above 2,720 strike. Upward squeeze underway.',
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Nov Fut',
      price: 4020.0,
      priceChange: -0.9,
      oiChange: -6.8,
      quadrant: 'LONG_UNWINDING',
      interpretation: 'Bulls capitulating and squaring off long bets. Support testing imminent.',
    },
    {
      symbol: 'HINDUNILVR',
      name: 'Hindustan Unilever Nov Fut',
      price: 2540.0,
      priceChange: -1.2,
      oiChange: -9.2,
      quadrant: 'LONG_UNWINDING',
      interpretation: 'Institutional profit booking and long liquidation.',
    },
  ];

  const filtered = oiData.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return item.quadrant === activeFilter;
  });

  const getQuadrantStyle = (q: OIFlowItem['quadrant']) => {
    switch (q) {
      case 'LONG_BUILDUP':
        return {
          title: 'Long Buildup',
          badge: 'bg-[#132E30] text-[#55D6BE] border-[#55D6BE]/30',
          textColor: 'text-[#55D6BE]',
          icon: ArrowUpRight,
        };
      case 'SHORT_BUILDUP':
        return {
          title: 'Short Buildup',
          badge: 'bg-rose-950/70 text-rose-400 border-rose-800',
          textColor: 'text-rose-400',
          icon: ArrowDownRight,
        };
      case 'SHORT_COVERING':
        return {
          title: 'Short Covering',
          badge: 'bg-amber-950/70 text-amber-400 border-amber-800',
          textColor: 'text-amber-400',
          icon: ArrowUpRight,
        };
      case 'LONG_UNWINDING':
        return {
          title: 'Long Unwinding',
          badge: 'bg-orange-950/70 text-orange-400 border-orange-800',
          textColor: 'text-orange-400',
          icon: ArrowDownRight,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30 mb-2">
              <Activity className="w-3.5 h-3.5" /> F&amp;O Open Interest Buildup Engine
            </div>
            <h2 className="text-xl font-bold text-[#E6EDF5]">
              Live OI Flow: 4-Quadrant Market Radar
            </h2>
            <p className="text-xs text-[#9AAABB] mt-1 max-w-2xl">
              Track the 4 critical derivatives signals: <strong>Long Buildup</strong> (bulls entering),{' '}
              <strong>Short Buildup</strong> (bears shorting), <strong>Short Covering</strong> (bear squeeze), and{' '}
              <strong>Long Unwinding</strong> (bulls liquidating).
            </p>
          </div>
        </div>

        {/* 4 Quadrants Definition Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#25313F]">
          <div className="bg-[#0D131C] border border-[#55D6BE]/30 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-mono text-[#55D6BE] uppercase font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> LONG BUILDUP
            </span>
            <div className="text-xs font-bold text-[#E6EDF5]">Price &uarr; &middot; OI &uarr;</div>
            <span className="text-[11px] text-[#6E8298] block">Bulls opening fresh long bets</span>
          </div>

          <div className="bg-[#0D131C] border border-rose-900/40 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-mono text-rose-400 uppercase font-bold flex items-center gap-1">
              <ArrowDownRight className="w-3 h-3" /> SHORT BUILDUP
            </span>
            <div className="text-xs font-bold text-[#E6EDF5]">Price &darr; &middot; OI &uarr;</div>
            <span className="text-[11px] text-[#6E8298] block">Bears creating fresh shorts</span>
          </div>

          <div className="bg-[#0D131C] border border-amber-900/40 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> SHORT COVERING
            </span>
            <div className="text-xs font-bold text-[#E6EDF5]">Price &uarr; &middot; OI &darr;</div>
            <span className="text-[11px] text-[#6E8298] block">Bears panicking &amp; squaring off</span>
          </div>

          <div className="bg-[#0D131C] border border-orange-900/40 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-mono text-orange-400 uppercase font-bold flex items-center gap-1">
              <ArrowDownRight className="w-3 h-3" /> LONG UNWINDING
            </span>
            <div className="text-xs font-bold text-[#E6EDF5]">Price &darr; &middot; OI &darr;</div>
            <span className="text-[11px] text-[#6E8298] block">Bulls capitulating &amp; closing</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#25313F]/60">
          {(['ALL', 'LONG_BUILDUP', 'SHORT_BUILDUP', 'SHORT_COVERING', 'LONG_UNWINDING'] as const).map((q) => (
            <button
              key={q}
              onClick={() => setActiveFilter(q)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeFilter === q
                  ? 'bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/40 font-semibold'
                  : 'bg-[#0D131C] text-[#9AAABB] border border-[#25313F] hover:text-[#E6EDF5]'
              }`}
            >
              {q === 'ALL'
                ? 'All F&O Stocks'
                : q === 'LONG_BUILDUP'
                ? 'Long Buildup (Bulls)'
                : q === 'SHORT_BUILDUP'
                ? 'Short Buildup (Bears)'
                : q === 'SHORT_COVERING'
                ? 'Short Covering (Squeeze)'
                : 'Long Unwinding (Selling)'}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Buildups */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[#25313F] bg-[#0D131C] text-[#6E8298] text-[10px] uppercase">
                <th className="py-3 px-4 text-left">F&amp;O Symbol</th>
                <th className="py-3 px-3 text-right">Futures Price</th>
                <th className="py-3 px-3 text-right">Price Chg %</th>
                <th className="py-3 px-3 text-right">OI Chg %</th>
                <th className="py-3 px-4 text-center">Buildup Classification</th>
                <th className="py-3 px-4 text-left">Trading Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#25313F]/50">
              {filtered.map((item) => {
                const style = getQuadrantStyle(item.quadrant);
                const Icon = style.icon;

                return (
                  <tr key={item.symbol} className="hover:bg-[#0D131C]/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#E6EDF5] block">{item.symbol}</span>
                      <span className="text-[10px] text-[#6E8298]">{item.name}</span>
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-[#E6EDF5]">
                      ₹{item.price.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-flex items-center gap-0.5 font-bold ${
                          item.priceChange >= 0 ? 'text-[#55D6BE]' : 'text-rose-400'
                        }`}
                      >
                        {item.priceChange >= 0 ? '+' : ''}{item.priceChange}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span
                        className={`font-bold ${
                          item.oiChange >= 0 ? 'text-[#55D6BE]' : 'text-orange-400'
                        }`}
                      >
                        {item.oiChange >= 0 ? '+' : ''}{item.oiChange}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded border uppercase ${style.badge}`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{style.title}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[#9AAABB] max-w-xs truncate" title={item.interpretation}>
                      {item.interpretation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
