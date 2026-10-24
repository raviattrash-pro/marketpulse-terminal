'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Filter, Star, CheckCircle2, TrendingDown, ArrowUpRight, Search, X, Info } from 'lucide-react';

interface RSIRow {
  symbol: string;
  name: string;
  m5: number;
  m15: number;
  h1: number;
  d1: number;
  allAgree: boolean;
  change: string;
  sector: string;
}

export type RSIFilterChip =
  | 'ANY_EXTREME'
  | 'GT_65_ANY'
  | 'LT_30_ANY'
  | 'GT_65_ALL'
  | 'LT_30_ALL'
  | 'SHOW_ALL'
  | 'M5_GT_65'
  | 'M15_GT_65'
  | 'DAILY_LT_30';

interface RSIMultiTimeframeProps {
  activeSubTab?: 'futures-basis' | 'iv-screener' | 'rsi-multi-timeframe';
  setActiveSubTab?: (tab: 'futures-basis' | 'iv-screener' | 'rsi-multi-timeframe') => void;
}

export default function RSIMultiTimeframe({
  activeSubTab = 'rsi-multi-timeframe',
  setActiveSubTab,
}: RSIMultiTimeframeProps) {
  const [activeFilter, setActiveFilter] = useState<RSIFilterChip>('ANY_EXTREME');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSubTab, setCurrentSubTab] = useState<'futures-basis' | 'iv-screener' | 'rsi-multi-timeframe'>(activeSubTab);

  const handleSubTabChange = (t: 'futures-basis' | 'iv-screener' | 'rsi-multi-timeframe') => {
    setCurrentSubTab(t);
    if (setActiveSubTab) {
      setActiveSubTab(t);
    }
  };

  // Exact stocks from Image media_1792820160847_bb062c5e.png
  const exactStockRows: RSIRow[] = [
    { symbol: 'YESBANK', name: 'Yes Bank Ltd', m5: 17, m15: 11, h1: 9, d1: 18, allAgree: true, change: '-4.8%', sector: 'Banking' },
    { symbol: 'NBCC', name: 'NBCC India Ltd', m5: 16, m15: 8, h1: 15, d1: 26, allAgree: true, change: '-5.2%', sector: 'Infra' },
    { symbol: 'BIOCON', name: 'Biocon Ltd', m5: 14, m15: 21, h1: 19, d1: 24, allAgree: true, change: '-3.7%', sector: 'Pharma' },
    { symbol: 'DMART', name: 'Avenue Supermarts', m5: 17, m15: 14, h1: 22, d1: 28, allAgree: true, change: '-2.5%', sector: 'Retail' },
    { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank', m5: 20, m15: 14, h1: 15, d1: 29, allAgree: true, change: '-3.1%', sector: 'Banking' },
    { symbol: 'DIXON', name: 'Dixon Technologies', m5: 27, m15: 10, h1: 16, d1: 27, allAgree: true, change: '-4.1%', sector: 'Tech' },
    { symbol: 'MUTHOOTFIN', name: 'Muthoot Finance', m5: 26, m15: 15, h1: 15, d1: 28, allAgree: true, change: '-2.8%', sector: 'NBFC' },
    { symbol: 'GVT&D', name: 'GE T&D India', m5: 18, m15: 17, h1: 20, d1: 28, allAgree: true, change: '-3.4%', sector: 'Power' },
    { symbol: 'MAXHEALTH', name: 'Max Healthcare', m5: 24, m15: 20, h1: 19, d1: 22, allAgree: true, change: '-2.1%', sector: 'Healthcare' },
    { symbol: 'EXIDEIND', name: 'Exide Industries', m5: 25, m15: 23, h1: 16, d1: 29, allAgree: true, change: '-2.7%', sector: 'Auto Ancillary' },
    { symbol: 'JUBLFOOD', name: 'Jubilant FoodWorks', m5: 25, m15: 24, h1: 16, d1: 27, allAgree: true, change: '-2.4%', sector: 'Consumer' },
    { symbol: 'NMDC', name: 'NMDC Ltd', m5: 24, m15: 20, h1: 24, d1: 28, allAgree: true, change: '-2.0%', sector: 'Metal' },
    { symbol: 'TIINDIA', name: 'Tube Investments', m5: 24, m15: 19, h1: 29, d1: 26, allAgree: true, change: '-1.9%', sector: 'Engineering' },
    { symbol: 'RBLBANK', name: 'RBL Bank Ltd', m5: 17, m15: 13, h1: 17, d1: 32, allAgree: false, change: '-3.2%', sector: 'Banking' },
    { symbol: 'UNOMINDA', name: 'Uno Minda Ltd', m5: 19, m15: 13, h1: 18, d1: 31, allAgree: false, change: '-2.9%', sector: 'Auto Ancillary' },
    { symbol: 'AMBER', name: 'Amber Enterprises', m5: 17, m15: 10, h1: 19, d1: 34, allAgree: false, change: '-3.0%', sector: 'Consumer' },
    { symbol: 'TITAN', name: 'Titan Company Ltd', m5: 17, m15: 11, h1: 9, d1: 18, allAgree: true, change: '-4.6%', sector: 'Consumer' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', m5: 16, m15: 8, h1: 15, d1: 27, allAgree: true, change: '-5.8%', sector: 'NBFC' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', m5: 14, m15: 21, h1: 19, d1: 22, allAgree: true, change: '-4.7%', sector: 'Banking' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', m5: 17, m15: 14, h1: 22, d1: 24, allAgree: true, change: '-0.5%', sector: 'Banking' },
    { symbol: 'SBIN', name: 'State Bank of India', m5: 26, m15: 15, h1: 15, d1: 26, allAgree: true, change: '-1.6%', sector: 'PSU Bank' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', m5: 68, m15: 66, h1: 69, d1: 58, allAgree: false, change: '+2.8%', sector: 'IT' },
    { symbol: 'INFY', name: 'Infosys Ltd', m5: 66, m15: 67, h1: 65, d1: 54, allAgree: false, change: '+0.2%', sector: 'IT' },
    { symbol: 'LTTS', name: 'L&T Technology Services', m5: 72, m15: 69, h1: 71, d1: 62, allAgree: false, change: '+2.8%', sector: 'IT' },
    { symbol: 'SUNPHARMA', name: 'Sun Pharma Ltd', m5: 58, m15: 62, h1: 66, d1: 68, allAgree: false, change: '+1.2%', sector: 'Pharma' },
  ];

  const [allRows, setAllRows] = useState<RSIRow[]>(exactStockRows);

  const filteredRows = useMemo(() => {
    return allRows.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (!r.symbol.toLowerCase().includes(q) && !r.name.toLowerCase().includes(q)) return false;
      }
      if (activeFilter === 'ANY_EXTREME') return r.m5 < 30 || r.m15 < 30 || r.h1 < 30 || r.d1 < 30 || r.m5 > 65;
      if (activeFilter === 'GT_65_ANY') return r.m5 > 65 || r.m15 > 65 || r.h1 > 65 || r.d1 > 65;
      if (activeFilter === 'LT_30_ANY') return r.m5 < 30 || r.m15 < 30 || r.h1 < 30 || r.d1 < 30;
      if (activeFilter === 'GT_65_ALL') return r.m5 > 65 && r.m15 > 65 && r.h1 > 65 && r.d1 > 65;
      if (activeFilter === 'LT_30_ALL') return r.allAgree;
      if (activeFilter === 'M5_GT_65') return r.m5 > 65;
      if (activeFilter === 'M15_GT_65') return r.m15 > 65;
      if (activeFilter === 'DAILY_LT_30') return r.d1 < 30;
      return true;
    });
  }, [allRows, activeFilter, searchQuery]);

  // Color generator for wide rounded blocks matching Image media_1792820160847_bb062c5e.png
  const getCellBlockStyle = (val: number) => {
    if (val < 15) {
      return 'bg-[#991B1B] text-white font-extrabold shadow-2xs'; // Dark deep red
    }
    if (val < 25) {
      return 'bg-[#DC2626] text-white font-bold shadow-2xs'; // Bright red
    }
    if (val <= 30) {
      return 'bg-[#EF4444] text-white font-bold'; // Soft warning red
    }
    if (val > 65) {
      return 'bg-[#15803D] text-white font-bold shadow-2xs'; // Overbought green
    }
    return 'bg-slate-200 text-slate-800 font-semibold'; // Neutral grey
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans p-3 sm:p-4 md:p-6 select-none">
      <div className="max-w-[1600px] mx-auto space-y-3.5">
        {/* Dynamic Running Headline Alert Banner (Exact Match to Image) */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-3.5 shadow-xs flex items-center justify-between gap-4">
          <div className="text-sm font-bold text-slate-800">
            <span className="text-emerald-600 font-extrabold">8 overbought</span> and{' '}
            <span className="text-rose-600 font-extrabold">146 oversold</span> on at least one timeframe ·{' '}
            <span className="text-[#3B28CC] font-extrabold">13 agree on daily</span>
          </div>
          <span className="text-xs text-emerald-700 font-mono font-medium hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            NSE Live Matrix
          </span>
        </div>

        {/* Subtabs Pill Switcher (Futures basis | IV screener | RSI multi-timeframe) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleSubTabChange('futures-basis')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              currentSubTab === 'futures-basis'
                ? 'bg-[#3B28CC] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Futures basis
          </button>
          <button
            onClick={() => handleSubTabChange('iv-screener')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              currentSubTab === 'iv-screener'
                ? 'bg-[#3B28CC] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            IV screener
          </button>
          <button
            onClick={() => handleSubTabChange('rsi-multi-timeframe')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              currentSubTab === 'rsi-multi-timeframe'
                ? 'bg-[#3B28CC] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            RSI multi-timeframe
          </button>
        </div>

        {/* RSI (14) HEATMAP Subheader & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-sans px-1">
          <div className="flex items-center gap-3 font-semibold text-slate-700 flex-wrap">
            <span className="font-extrabold uppercase tracking-wide text-slate-900">
              RSI (14) HEATMAP
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              oversold
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              neutral
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              overbought
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-indigo-700">
              <span>★ = all timeframes agree</span>
              <Info className="w-3 h-3 text-slate-400" />
            </span>
          </div>
        </div>

        {/* Filter Chips Row (Exact Order from Image) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
          {/* Chip 1: Any extreme 154 (Dark black active pill) */}
          <button
            onClick={() => setActiveFilter('ANY_EXTREME')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'ANY_EXTREME'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Any extreme <span className="font-mono ml-1 font-extrabold">154</span>
          </button>

          {/* Chip 2: > 65 any TF 8 */}
          <button
            onClick={() => setActiveFilter('GT_65_ANY')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'GT_65_ANY'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            &gt; 65 any TF <span className="font-mono ml-1 font-bold">8</span>
          </button>

          {/* Chip 3: < 30 any TF 146 */}
          <button
            onClick={() => setActiveFilter('LT_30_ANY')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'LT_30_ANY'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            &lt; 30 any TF <span className="font-mono ml-1 font-bold">146</span>
          </button>

          {/* Chip 4: > 65 all TF 0 */}
          <button
            onClick={() => setActiveFilter('GT_65_ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'GT_65_ALL'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            &gt; 65 all TF <span className="font-mono ml-1 font-bold">0</span>
          </button>

          {/* Chip 5: < 30 all TF 13 */}
          <button
            onClick={() => setActiveFilter('LT_30_ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'LT_30_ALL'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            &lt; 30 all TF <span className="font-mono ml-1 font-bold">13</span>
          </button>

          {/* Chip 6: Show all 217 */}
          <button
            onClick={() => setActiveFilter('SHOW_ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'SHOW_ALL'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Show all <span className="font-mono ml-1 font-bold">217</span>
          </button>

          {/* Chip 7: 5 min > 65 0 */}
          <button
            onClick={() => setActiveFilter('M5_GT_65')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'M5_GT_65'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            5 min &gt; 65 <span className="font-mono ml-1 font-bold">0</span>
          </button>

          {/* Chip 8: 15 min > 65 2 */}
          <button
            onClick={() => setActiveFilter('M15_GT_65')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'M15_GT_65'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            15 min &gt; 65 <span className="font-mono ml-1 font-bold">2</span>
          </button>

          {/* Chip 9: Daily < 30 20 */}
          <button
            onClick={() => setActiveFilter('DAILY_LT_30')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'DAILY_LT_30'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Daily &lt; 30 <span className="font-mono ml-1 font-bold">20</span>
          </button>
        </div>

        {/* Heatmap Grid Table (Exact Match to Image Layout & Cells) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-5 shadow-xs overflow-x-auto">
          <table className="w-full text-center border-separate border-spacing-y-2">
            <thead>
              <tr className="text-xs font-mono font-bold text-slate-400">
                <th className="text-left py-2 px-3 w-44 uppercase tracking-wider">STOCK</th>
                <th className="py-2 px-2 uppercase tracking-wider">5 MIN</th>
                <th className="py-2 px-2 uppercase tracking-wider">15 MIN</th>
                <th className="py-2 px-2 uppercase tracking-wider">1 HOUR</th>
                <th className="py-2 px-2 uppercase tracking-wider">DAILY</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {filteredRows.map((r) => (
                <tr key={r.symbol} className="hover:bg-slate-50/50 transition">
                  {/* Stock Symbol with Star badge */}
                  <td className="text-left py-1.5 px-3 whitespace-nowrap">
                    <span className="font-bold text-slate-900 text-sm tracking-tight">
                      {r.symbol}
                    </span>
                    {r.allAgree && (
                      <span className="text-indigo-600 font-bold ml-1 text-sm">★</span>
                    )}
                  </td>

                  {/* 5 MIN Wide Block */}
                  <td className="py-1 px-1.5">
                    <div
                      className={`h-9 rounded-md w-full max-w-[220px] mx-auto flex items-center justify-center text-sm font-bold tracking-tight transition ${getCellBlockStyle(
                        r.m5
                      )}`}
                    >
                      {r.m5}
                    </div>
                  </td>

                  {/* 15 MIN Wide Block */}
                  <td className="py-1 px-1.5">
                    <div
                      className={`h-9 rounded-md w-full max-w-[220px] mx-auto flex items-center justify-center text-sm font-bold tracking-tight transition ${getCellBlockStyle(
                        r.m15
                      )}`}
                    >
                      {r.m15}
                    </div>
                  </td>

                  {/* 1 HOUR Wide Block */}
                  <td className="py-1 px-1.5">
                    <div
                      className={`h-9 rounded-md w-full max-w-[220px] mx-auto flex items-center justify-center text-sm font-bold tracking-tight transition ${getCellBlockStyle(
                        r.h1
                      )}`}
                    >
                      {r.h1}
                    </div>
                  </td>

                  {/* DAILY Wide Block */}
                  <td className="py-1 px-1.5">
                    <div
                      className={`h-9 rounded-md w-full max-w-[220px] mx-auto flex items-center justify-center text-sm font-bold tracking-tight transition ${getCellBlockStyle(
                        r.d1
                      )}`}
                    >
                      {r.d1}
                    </div>
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
