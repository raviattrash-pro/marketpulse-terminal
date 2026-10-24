'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  ShieldCheck,
  Flame,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Calculator,
  Compass,
  CheckCircle2,
  Sliders,
  DollarSign,
  Scale,
} from 'lucide-react';

export interface LiveStockItem {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  volume: number;
  volRatio: number;
  dayHigh: number;
  dayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  flowType: 'HUGE_BUYING' | 'HUGE_SELLING' | 'NEUTRAL';
  flowCr: number;
  fairValue: number;
  valuationStatus: 'UNDERVALUED' | 'FAIRLY_VALUED' | 'OVERVALUED';
  marginOfSafetyPct: number;
  bestBuyPrice: number;
  bestEntryTiming: string;
  bestEntryStrategy: string;
  stopLoss: number;
  target1: number;
  target2: number;
  riskReward: string;
  advisorVerdict: string;
}

interface LiveMarketOpportunitiesProps {
  onLoadTrade: (name: string, cmp: number, sl: number) => void;
  onSimulateInTimeMachine: (name: string, entry: number, sl: number, target: number) => void;
}

export default function LiveMarketOpportunities({
  onLoadTrade,
  onSimulateInTimeMachine,
}: LiveMarketOpportunitiesProps) {
  const [stocks, setStocks] = useState<LiveStockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [filter, setFilter] = useState<'ALL' | 'BUYING' | 'SELLING' | 'UNDERVALUED'>('ALL');
  const [selectedStock, setSelectedStock] = useState<LiveStockItem | null>(null);

  const fetchLiveQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/live-stocks');
      if (res.ok) {
        const data = await res.json();
        setStocks(data.stocks || []);
        setLastUpdated(new Date().toLocaleTimeString());
        if (data.stocks && data.stocks.length > 0 && !selectedStock) {
          setSelectedStock(data.stocks[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching live stocks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveQuotes();
    const interval = setInterval(fetchLiveQuotes, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const filteredStocks = stocks.filter((s) => {
    if (filter === 'BUYING') return s.flowType === 'HUGE_BUYING';
    if (filter === 'SELLING') return s.flowType === 'HUGE_SELLING';
    if (filter === 'UNDERVALUED') return s.valuationStatus === 'UNDERVALUED';
    return true;
  });

  const totalInflow = stocks
    .filter((s) => s.flowCr > 0)
    .reduce((acc, s) => acc + s.flowCr, 0);

  const totalOutflow = stocks
    .filter((s) => s.flowCr < 0)
    .reduce((acc, s) => acc + Math.abs(s.flowCr), 0);

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans p-4 md:p-6 select-none">
      <div className="max-w-[1600px] mx-auto space-y-5">
        {/* Top Live Ticker & Institutional Momentum Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">
                  Live Institutional Buy/Sell & Timing Radar
                </h1>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  LIVE NSE FEED
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Detects huge institutional accumulation vs distribution, Graham/DCF fair valuation, and optimal entry windows for top 10 stocks.
              </p>
            </div>
          </div>

          {/* Quick Flow Summary & Refresh */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-800">
              <span className="text-[10px] text-emerald-600 block">TOTAL BUYING FLOW</span>
              <strong className="text-sm">+₹{totalInflow.toLocaleString()} Cr</strong>
            </div>

            <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-rose-800">
              <span className="text-[10px] text-rose-600 block">TOTAL SELLING FLOW</span>
              <strong className="text-sm">-₹{totalOutflow.toLocaleString()} Cr</strong>
            </div>

            <button
              onClick={fetchLiveQuotes}
              disabled={loading}
              className="flex items-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Fetching...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-2 text-xs font-medium overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filter === 'ALL'
                  ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Top 10 Stocks ({stocks.length})
            </button>

            <button
              onClick={() => setFilter('BUYING')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                filter === 'BUYING'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-emerald-500" />
              🔥 Huge Buying Accumulation
            </button>

            <button
              onClick={() => setFilter('SELLING')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                filter === 'SELLING'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-rose-700 border-slate-200 hover:bg-rose-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              ⚠️ Huge Selling Distribution
            </button>

            <button
              onClick={() => setFilter('UNDERVALUED')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                filter === 'UNDERVALUED'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-indigo-700 border-slate-200 hover:bg-indigo-50'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-indigo-500" />
              Best Value (Margin of Safety)
            </button>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            Last updated: {lastUpdated || 'Connecting to live ticker...'}
          </div>
        </div>

        {/* 2-Column Split: Stock Radar Grid (Left) & Comprehensive Financial Advisory Deep-Dive (Right) */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Top Stocks List (Col 7) */}
          <div className="col-span-12 lg:col-span-7 space-y-3">
            {filteredStocks.map((stock) => {
              const isSelected = selectedStock?.symbol === stock.symbol;
              const isBuying = stock.flowType === 'HUGE_BUYING';
              const isPositive = stock.changePct >= 0;

              return (
                <div
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className={`bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#4F46E5] ring-2 ring-indigo-100'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Symbol & Name */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-slate-900 tracking-tight">
                          {stock.symbol}
                        </span>
                        {/* Flow Badge */}
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isBuying
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isBuying ? '🔥 HUGE BUYING' : '⚠️ HUGE SELLING'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[240px]">
                        {stock.name}
                      </div>
                    </div>

                    {/* Price & Change */}
                    <div className="text-right font-mono">
                      <div className="text-base font-black text-slate-900">
                        ₹{stock.price.toLocaleString()}
                      </div>
                      <div
                        className={`text-xs font-bold flex items-center justify-end gap-0.5 ${
                          isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {isPositive ? `+${stock.changePct}%` : `${stock.changePct}%`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Metric Badges */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs font-mono">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <span className="text-[10px] text-slate-400 block">EST. FLOW</span>
                      <span
                        className={`font-bold ${
                          stock.flowCr > 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {stock.flowCr > 0 ? `+₹${stock.flowCr} Cr` : `-₹${Math.abs(stock.flowCr)} Cr`}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-2">
                      <span className="text-[10px] text-slate-400 block">FAIR VALUE</span>
                      <span className="font-bold text-indigo-700">₹{stock.fairValue}</span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-2">
                      <span className="text-[10px] text-slate-400 block">MARGIN OF SAFETY</span>
                      <span
                        className={`font-bold ${
                          stock.marginOfSafetyPct > 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {stock.marginOfSafetyPct > 0
                          ? `+${stock.marginOfSafetyPct}% (Cheap)`
                          : `${stock.marginOfSafetyPct}% (High)`}
                      </span>
                    </div>
                  </div>

                  {/* Quick Timing Hint */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      Best Entry: <strong>{stock.bestEntryTiming}</strong>
                    </span>
                    <span className="text-slate-400 font-mono">Vol: {stock.volRatio}x avg</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Complete Financial Advisor Strategy Blueprint (Col 5) */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            {selectedStock ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 sticky top-20">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block">
                      FINANCIAL ADVISORY BLUEPRINT
                    </span>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      {selectedStock.symbol}
                    </h2>
                    <span className="text-xs text-slate-500">{selectedStock.name}</span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xs text-slate-400 block">Current Price</span>
                    <span className="text-xl font-black text-slate-900">
                      ₹{selectedStock.price}
                    </span>
                  </div>
                </div>

                {/* Section 1: Valuation Breakdown (Graham & DCF Model) */}
                <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-[#4F46E5]" />
                      Valuation & Intrinsic Worth
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        selectedStock.valuationStatus === 'UNDERVALUED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedStock.valuationStatus === 'OVERVALUED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {selectedStock.valuationStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Graham / DCF Value:</span>
                      <strong className="text-slate-800">₹{selectedStock.fairValue}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Best Price to Buy:</span>
                      <strong className="text-emerald-700 font-bold">
                        ₹{selectedStock.bestBuyPrice}
                      </strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed pt-1">
                    {selectedStock.advisorVerdict}
                  </p>
                </div>

                {/* Section 2: Best Time to Enter & Technical Timing */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Best Time & Strategy to Enter
                  </span>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-500">Recommended Window:</span>
                      <strong className="text-slate-800">{selectedStock.bestEntryTiming}</strong>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] leading-relaxed">
                      <strong>Entry Trigger:</strong> {selectedStock.bestEntryStrategy}
                    </div>
                  </div>
                </div>

                {/* Section 3: Disciplined Execution Plan (Stop Loss & 1:2 / 1:3 Targets) */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Disciplined R:R Execution</span>
                    <span className="text-indigo-600 font-mono font-bold">
                      {selectedStock.riskReward}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                    <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg">
                      <span className="text-[10px] text-rose-500 block">STOP LOSS</span>
                      <strong className="text-rose-700">₹{selectedStock.stopLoss}</strong>
                      <span className="text-[9px] text-rose-400 block">-2.0% Risk</span>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg">
                      <span className="text-[10px] text-emerald-600 block">TARGET 1 (1:2)</span>
                      <strong className="text-emerald-700">₹{selectedStock.target1}</strong>
                      <span className="text-[9px] text-emerald-500 block">+4.0%</span>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg">
                      <span className="text-[10px] text-emerald-600 block">TARGET 2 (1:3)</span>
                      <strong className="text-emerald-700">₹{selectedStock.target2}</strong>
                      <span className="text-[9px] text-emerald-500 block">+6.0%</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons: Send to Sizer or Time Machine */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() =>
                      onLoadTrade(
                        selectedStock.symbol,
                        selectedStock.price,
                        selectedStock.stopLoss
                      )
                    }
                    className="flex items-center justify-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Send to Position Sizer</span>
                  </button>

                  <button
                    onClick={() =>
                      onSimulateInTimeMachine(
                        selectedStock.symbol,
                        selectedStock.price,
                        selectedStock.stopLoss,
                        selectedStock.target1
                      )
                    }
                    className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Run Time Machine</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
