'use client';

import React, { useState, useEffect, useMemo } from 'react';
import RSIMultiTimeframe from '@/components/RSIMultiTimeframe';
import {
  Filter,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Zap,
  Search,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  Scale,
  Compass,
} from 'lucide-react';

export type ScreenerCategory =
  | 'ALL'
  | 'MOAT_QUALITY'
  | 'VOLUME_BREAKOUT'
  | 'DEEP_VALUE'
  | 'WHALE_INFLOW'
  | 'TRAP_WARNING';

interface ScreenerStock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  changePct: number;
  fairValue: number;
  marginOfSafetyPct: number;
  volumeRatio: number;
  flowCr: number;
  roce: number;
  debtEquity: number;
  pledge: number;
  verdict: 'STRONG BUY (MOAT)' | 'ACCUMULATE' | 'BREAKOUT PLAY' | 'HOLD' | 'AVOID (TRAP)';
  setupReason: string;
  stopLoss: number;
  target: number;
}

interface InstitutionalScreenerProps {
  onLoadTrade?: (name: string, cmp: number, sl: number) => void;
  onSimulateInTimeMachine?: (name: string, entry: number, sl: number, target: number) => void;
}

export default function InstitutionalScreener({
  onLoadTrade,
  onSimulateInTimeMachine,
}: InstitutionalScreenerProps) {
  const [screenerSubTab, setScreenerSubTab] = useState<'futures-basis' | 'iv-screener' | 'rsi-multi-timeframe'>('rsi-multi-timeframe');
  const [activeCategory, setActiveCategory] = useState<ScreenerCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string>('');

  const defaultStocks: ScreenerStock[] = [
    {
      symbol: 'TITAN',
      name: 'Titan Company Ltd',
      sector: 'Consumer Moat',
      price: 3480,
      changePct: -1.4,
      fairValue: 4600,
      marginOfSafetyPct: 24.3,
      volumeRatio: 2.4,
      flowCr: 380,
      roce: 28.4,
      debtEquity: 0.25,
      pledge: 0.0,
      verdict: 'STRONG BUY (MOAT)',
      setupReason: '4-Filter Economic Moat Champion. Unbeatable consumer brand equity, 0% promoter pledge, 28% RoCE.',
      stopLoss: 3340,
      target: 3760,
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      sector: 'IT Services',
      price: 2531,
      changePct: 2.69,
      fairValue: 2850,
      marginOfSafetyPct: 11.2,
      volumeRatio: 2.8,
      flowCr: 890,
      roce: 48.2,
      debtEquity: 0.05,
      pledge: 0.0,
      verdict: 'BREAKOUT PLAY',
      setupReason: 'Heavy FII volume surge + Multi-week resistance breakout with pristine balance sheet and cash reserves.',
      stopLoss: 2455,
      target: 2680,
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      sector: 'Private Banking',
      price: 1680,
      changePct: -0.45,
      fairValue: 1940,
      marginOfSafetyPct: 13.4,
      volumeRatio: 1.8,
      flowCr: 1240,
      roce: 18.5,
      debtEquity: 0.45,
      pledge: 0.0,
      verdict: 'ACCUMULATE',
      setupReason: 'Core banking monopoly trading near 200 SMA support floor. Deep institutional liquidity base.',
      stopLoss: 1610,
      target: 1820,
    },
    {
      symbol: 'TATAMOTORS',
      name: 'Tata Motors Ltd',
      sector: 'Automotive & EV',
      price: 884,
      changePct: 1.8,
      fairValue: 1040,
      marginOfSafetyPct: 15.0,
      volumeRatio: 3.1,
      flowCr: 620,
      roce: 22.1,
      debtEquity: 0.38,
      pledge: 0.0,
      verdict: 'BREAKOUT PLAY',
      setupReason: 'EV passenger vehicle market dominance (>65% market share), JLR free cash flow turnaround.',
      stopLoss: 848,
      target: 956,
    },
    {
      symbol: 'ICICIBANK',
      name: 'ICICI Bank Ltd',
      sector: 'Private Banking',
      price: 1245,
      changePct: 0.8,
      fairValue: 1490,
      marginOfSafetyPct: 16.4,
      volumeRatio: 1.9,
      flowCr: 740,
      roce: 19.2,
      debtEquity: 0.5,
      pledge: 0.0,
      verdict: 'STRONG BUY (MOAT)',
      setupReason: 'Industry-leading Net Interest Margins (NIM) and lowest NPA credit costs in Indian banking.',
      stopLoss: 1195,
      target: 1345,
    },
    {
      symbol: 'BAJFINANCE',
      name: 'Bajaj Finance Ltd',
      sector: 'Consumer NBFC',
      price: 6850,
      changePct: -2.3,
      fairValue: 8200,
      marginOfSafetyPct: 16.5,
      volumeRatio: 2.1,
      flowCr: 450,
      roce: 24.5,
      debtEquity: 0.65,
      pledge: 0.0,
      verdict: 'ACCUMULATE',
      setupReason: 'Omnichannel customer acquisition moat with cross-sell ratios exceeding 65%.',
      stopLoss: 6570,
      target: 7410,
    },
    {
      symbol: 'INFY',
      name: 'Infosys Ltd',
      sector: 'IT Services',
      price: 1840,
      changePct: 0.2,
      fairValue: 2050,
      marginOfSafetyPct: 10.2,
      volumeRatio: 1.6,
      flowCr: 520,
      roce: 36.4,
      debtEquity: 0.08,
      pledge: 0.0,
      verdict: 'HOLD',
      setupReason: 'Steady dividend yield and enterprise digital transformation deal pipeline.',
      stopLoss: 1765,
      target: 1990,
    },
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      sector: 'Energy & Digital',
      price: 2680,
      changePct: -1.1,
      fairValue: 3100,
      marginOfSafetyPct: 13.5,
      volumeRatio: 1.7,
      flowCr: 1150,
      roce: 14.8,
      debtEquity: 0.42,
      pledge: 0.0,
      verdict: 'ACCUMULATE',
      setupReason: 'Jio 5G telecom tariff monetization and retail footprint expansion.',
      stopLoss: 2570,
      target: 2900,
    },
    {
      symbol: 'SUNPHARMA',
      name: 'Sun Pharma Ltd',
      sector: 'Pharma Moat',
      price: 1890,
      changePct: 1.2,
      fairValue: 2150,
      marginOfSafetyPct: 12.1,
      volumeRatio: 1.5,
      flowCr: 340,
      roce: 19.8,
      debtEquity: 0.12,
      pledge: 0.0,
      verdict: 'STRONG BUY (MOAT)',
      setupReason: 'Global specialty dermatology franchise and high domestic chronic formulation sales.',
      stopLoss: 1815,
      target: 2040,
    },
    {
      symbol: 'ADANIENT',
      name: 'Adani Enterprises Ltd',
      sector: 'Infrastructure',
      price: 2920,
      changePct: -3.4,
      fairValue: 2450,
      marginOfSafetyPct: -19.2,
      volumeRatio: 2.6,
      flowCr: -640,
      roce: 9.2,
      debtEquity: 1.85,
      pledge: 3.2,
      verdict: 'AVOID (TRAP)',
      setupReason: 'Fundamental Risk Flag: Debt/Equity exceeds 1.5x and promoter pledge present. Elevated valuation premium.',
      stopLoss: 2800,
      target: 3160,
    },
  ];

  const [stocks, setStocks] = useState<ScreenerStock[]>(defaultStocks);

  // Fetch live market data to enrich screener
  const fetchLiveQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/live-stocks');
      if (res.ok) {
        const data = await res.json();
        if (data.stocks && Array.isArray(data.stocks) && data.stocks.length > 0) {
          setStocks((prev) =>
            prev.map((item) => {
              const live = data.stocks.find((s: any) => s.symbol === item.symbol);
              if (live) {
                return {
                  ...item,
                  price: live.price,
                  changePct: live.changePct,
                  fairValue: live.fairValue || item.fairValue,
                  marginOfSafetyPct: live.marginOfSafetyPct || item.marginOfSafetyPct,
                  volumeRatio: live.volRatio || item.volumeRatio,
                  flowCr: live.flowCr || item.flowCr,
                  stopLoss: live.stopLoss || item.stopLoss,
                  target: live.target1 || item.target,
                };
              }
              return item;
            })
          );
          setLastSync(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
        }
      }
    } catch (e) {
      // keep recent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveQuotes();
    const interval = setInterval(fetchLiveQuotes, 20000);
    return () => clearInterval(interval);
  }, []);

  const counts = useMemo(() => {
    return {
      all: stocks.length,
      moat: stocks.filter((s) => s.roce >= 18 && s.debtEquity <= 0.5 && s.pledge === 0).length,
      breakout: stocks.filter((s) => s.volumeRatio >= 2.0 && s.changePct > 0).length,
      deepValue: stocks.filter((s) => s.marginOfSafetyPct >= 14).length,
      whale: stocks.filter((s) => s.flowCr >= 500).length,
      trap: stocks.filter((s) => s.verdict === 'AVOID (TRAP)' || s.debtEquity > 1.0).length,
    };
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    return stocks.filter((s) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSym = s.symbol.toLowerCase().includes(q);
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesSector = s.sector.toLowerCase().includes(q);
        if (!matchesSym && !matchesName && !matchesSector) return false;
      }

      // Category filter
      if (activeCategory === 'MOAT_QUALITY') {
        return s.roce >= 18 && s.debtEquity <= 0.5 && s.pledge === 0;
      }
      if (activeCategory === 'VOLUME_BREAKOUT') {
        return s.volumeRatio >= 2.0 && s.changePct > 0;
      }
      if (activeCategory === 'DEEP_VALUE') {
        return s.marginOfSafetyPct >= 14;
      }
      if (activeCategory === 'WHALE_INFLOW') {
        return s.flowCr >= 500;
      }
      if (activeCategory === 'TRAP_WARNING') {
        return s.verdict === 'AVOID (TRAP)' || s.debtEquity > 1.0;
      }
      return true;
    });
  }, [stocks, activeCategory, searchQuery]);

  if (screenerSubTab === 'rsi-multi-timeframe') {
    return (
      <RSIMultiTimeframe
        activeSubTab={screenerSubTab}
        setActiveSubTab={setScreenerSubTab}
      />
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans p-3 sm:p-4 md:p-6 select-none">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Top Headline Alert Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-sm font-bold text-slate-800">
            <span className="text-indigo-600 font-extrabold">{counts.moat} Monopolies pass 4-Filter Moat</span> ·{' '}
            <span className="text-emerald-600 font-extrabold">{counts.breakout} Volume Breakouts</span> ·{' '}
            <span className="text-amber-600 font-extrabold">{counts.deepValue} Deep Value Bargains</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-emerald-700 font-mono font-medium flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Institutional Multi-Screener {lastSync ? `• ${lastSync}` : ''}
            </span>
            <button
              onClick={fetchLiveQuotes}
              disabled={loading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Refresh live quotes"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Subtabs Pill Switcher (Futures basis | IV screener | RSI multi-timeframe) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setScreenerSubTab('futures-basis')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              screenerSubTab === 'futures-basis'
                ? 'bg-[#3B28CC] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Futures basis
          </button>
          <button
            onClick={() => setScreenerSubTab('iv-screener')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              screenerSubTab === 'iv-screener'
                ? 'bg-[#3B28CC] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            IV screener
          </button>
          <button
            onClick={() => setScreenerSubTab('rsi-multi-timeframe')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          >
            RSI multi-timeframe
          </button>
        </div>

        {/* Filter Navigation Bar + Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Working Clickable Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs font-semibold">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeCategory === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>All Equities</span>
              <span className="px-1.5 py-0.2 rounded bg-black/10 font-mono font-bold text-[10px]">
                {counts.all}
              </span>
            </button>

            <button
              onClick={() => setActiveCategory('MOAT_QUALITY')}
              className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeCategory === 'MOAT_QUALITY'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white border-slate-200 text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>4-Filter Economic Moats</span>
              <span className="px-1.5 py-0.2 rounded bg-white/20 font-mono font-bold text-[10px]">
                {counts.moat}
              </span>
            </button>

            <button
              onClick={() => setActiveCategory('VOLUME_BREAKOUT')}
              className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeCategory === 'VOLUME_BREAKOUT'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white border-slate-200 text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Volume Breakouts (&gt;2x)</span>
              <span className="px-1.5 py-0.2 rounded bg-white/20 font-mono font-bold text-[10px]">
                {counts.breakout}
              </span>
            </button>

            <button
              onClick={() => setActiveCategory('DEEP_VALUE')}
              className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeCategory === 'DEEP_VALUE'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white border-slate-200 text-amber-800 hover:bg-amber-50'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Deep Value (DCF &gt;14%)</span>
              <span className="px-1.5 py-0.2 rounded bg-white/20 font-mono font-bold text-[10px]">
                {counts.deepValue}
              </span>
            </button>

            <button
              onClick={() => setActiveCategory('WHALE_INFLOW')}
              className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeCategory === 'WHALE_INFLOW'
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                  : 'bg-white border-slate-200 text-cyan-800 hover:bg-cyan-50'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Whale Inflow (&gt;₹500Cr)</span>
              <span className="px-1.5 py-0.2 rounded bg-white/20 font-mono font-bold text-[10px]">
                {counts.whale}
              </span>
            </button>

            <button
              onClick={() => setActiveCategory('TRAP_WARNING')}
              className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeCategory === 'TRAP_WARNING'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white border-slate-200 text-rose-700 hover:bg-rose-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Traps to Avoid</span>
              <span className="px-1.5 py-0.2 rounded bg-white/20 font-mono font-bold text-[10px]">
                {counts.trap}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 shadow-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search by symbol, company, sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-transparent focus:outline-hidden font-mono uppercase placeholder:normal-case placeholder:font-sans placeholder:text-slate-400 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Screener Results Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-bold">Company / Sector</th>
                  <th className="py-3 px-3 font-bold text-right">Live CMP</th>
                  <th className="py-3 px-3 font-bold text-right">24h Chg</th>
                  <th className="py-3 px-3 font-bold text-right">Fair Value</th>
                  <th className="py-3 px-3 font-bold text-right">Margin of Safety</th>
                  <th className="py-3 px-3 font-bold text-center">Vol Ratio</th>
                  <th className="py-3 px-3 font-bold text-center">Quality / RoCE</th>
                  <th className="py-3 px-3 font-bold text-center">Verdict</th>
                  <th className="py-3 px-4 font-bold text-right">Execution Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredStocks.length > 0 ? (
                  filteredStocks.map((stock) => {
                    const isBullish = stock.changePct >= 0;
                    const isSafe = stock.marginOfSafetyPct > 0;
                    return (
                      <tr key={stock.symbol} className="hover:bg-slate-50/80 transition-colors">
                        {/* Company & Sector */}
                        <td className="py-3.5 px-4 font-sans">
                          <div className="font-extrabold text-slate-900 font-mono text-sm">
                            {stock.symbol}
                          </div>
                          <div className="text-[11px] text-slate-500">{stock.name}</div>
                          <div className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono font-medium">
                            {stock.sector}
                          </div>
                        </td>

                        {/* Live CMP */}
                        <td className="py-3.5 px-3 text-right font-extrabold text-slate-900 text-sm">
                          ₹{stock.price.toLocaleString('en-IN')}
                        </td>

                        {/* 24h Change */}
                        <td className="py-3.5 px-3 text-right">
                          <span
                            className={`font-bold inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs ${
                              isBullish ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {isBullish ? '+' : ''}
                            {stock.changePct}%
                          </span>
                        </td>

                        {/* Fair Value */}
                        <td className="py-3.5 px-3 text-right text-slate-700 font-semibold">
                          ₹{stock.fairValue.toLocaleString('en-IN')}
                        </td>

                        {/* Margin of Safety */}
                        <td className="py-3.5 px-3 text-right">
                          <span
                            className={`font-extrabold text-xs ${
                              isSafe ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {isSafe ? '+' : ''}
                            {stock.marginOfSafetyPct}%
                          </span>
                        </td>

                        {/* Volume Ratio */}
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              stock.volumeRatio >= 2.0
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {stock.volumeRatio}x avg
                          </span>
                        </td>

                        {/* RoCE & Debt */}
                        <td className="py-3.5 px-3 text-center text-[11px]">
                          <div className="font-bold text-slate-800">{stock.roce}% RoCE</div>
                          <div className="text-[9px] text-slate-400">
                            D/E: {stock.debtEquity} • Plg: {stock.pledge}%
                          </div>
                        </td>

                        {/* Verdict Badge */}
                        <td className="py-3.5 px-3 text-center font-sans">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wide uppercase ${
                              stock.verdict === 'STRONG BUY (MOAT)'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : stock.verdict === 'BREAKOUT PLAY'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : stock.verdict === 'ACCUMULATE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : stock.verdict === 'HOLD'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {stock.verdict}
                          </span>
                          <div className="text-[9px] text-slate-500 font-sans max-w-[190px] mx-auto truncate mt-1">
                            {stock.setupReason}
                          </div>
                        </td>

                        {/* Execution Plan Action Button */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {onLoadTrade && (
                              <button
                                onClick={() => onLoadTrade(stock.name, stock.price, stock.stopLoss)}
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                              >
                                Size Trade &rarr;
                              </button>
                            )}
                            {onSimulateInTimeMachine && (
                              <button
                                onClick={() =>
                                  onSimulateInTimeMachine(
                                    stock.name,
                                    stock.price,
                                    stock.stopLoss,
                                    stock.target
                                  )
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer whitespace-nowrap"
                                title="Run 100-path Monte Carlo trade simulation"
                              >
                                Test
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 font-sans">
                      No stocks match this filter. Try clearing the search query or selecting "All Equities".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
