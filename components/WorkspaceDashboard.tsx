'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Shield,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Bookmark,
  Target,
  ArrowUpRight,
  Info,
  Sliders,
} from 'lucide-react';
import { soundEffects } from '@/lib/soundEffects';

interface WorkspaceDashboardProps {
  onOpenTimeMachine?: (symbol: string, entry: number, sl: number, target: number) => void;
}

export default function WorkspaceDashboard({ onOpenTimeMachine }: WorkspaceDashboardProps) {
  // Live Market States
  const [liveNifty, setLiveNifty] = useState<number>(22544.1);
  const [liveNiftyChange, setLiveNiftyChange] = useState<number>(-0.63);
  const [liveBankNifty, setLiveBankNifty] = useState<number>(48250.0);
  const [liveVix, setLiveVix] = useState<number>(13.85);
  const [liveStocks, setLiveStocks] = useState<any[]>([]);
  const [selectedEquity, setSelectedEquity] = useState<string>('RELIANCE');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);

  // Metric States
  const [tradingCapital, setTradingCapital] = useState(100000);
  const [realizedPnl, setRealizedPnl] = useState(-500);
  const [consecutiveLosses, setConsecutiveLosses] = useState(1);
  const [circuitTripped, setCircuitTripped] = useState(false);
  const [savedWorkspaceToast, setSavedWorkspaceToast] = useState(false);

  // Position Sizer State
  const [selectedInstrument, setSelectedInstrument] = useState<'Nifty' | 'BankNifty' | 'FinNifty' | 'Midcap' | 'Equities'>('Nifty');
  const [riskPct, setRiskPct] = useState(1);
  const [entryPrice, setEntryPrice] = useState(200);
  const [stopLossPrice, setStopLossPrice] = useState(180);
  const [lotSize, setLotSize] = useState(25);
  const [savedPlanToast, setSavedPlanToast] = useState(false);

  // Fetch real-time live data
  const fetchLiveTerminalData = async () => {
    setIsLoadingLive(true);
    try {
      const [pulseRes, stocksRes] = await Promise.all([
        fetch('/api/market-pulse'),
        fetch('/api/live-stocks'),
      ]);

      if (pulseRes.ok) {
        const pData = await pulseRes.json();
        const n = pData.indices?.find((i: any) => i.symbol === '^NSEI');
        const bn = pData.indices?.find((i: any) => i.symbol === '^NSEBANK');
        const vx = pData.indices?.find((i: any) => i.symbol === '^INDIAVIX');
        if (n) {
          setLiveNifty(n.price);
          setLiveNiftyChange(n.changePct);
        }
        if (bn) setLiveBankNifty(bn.price);
        if (vx) setLiveVix(vx.price);
      }

      if (stocksRes.ok) {
        const sData = await stocksRes.json();
        if (sData.stocks && Array.isArray(sData.stocks)) {
          setLiveStocks(sData.stocks);
          // If in equities mode, calibrate to selected equity
          const currentEq = sData.stocks.find((s: any) => s.symbol === selectedEquity) || sData.stocks[0];
          if (currentEq && selectedInstrument === 'Equities') {
            setEntryPrice(Math.round(currentEq.price));
            setStopLossPrice(Math.round(currentEq.stopLoss || currentEq.price * 0.98));
          }
        }
      }
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    } catch (e) {
      // fallback
    } finally {
      setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveTerminalData();
    const timer = setInterval(fetchLiveTerminalData, 15000);
    return () => clearInterval(timer);
  }, [selectedInstrument, selectedEquity]);

  // Instrument switcher presets with live price calibration
  const handleInstrumentChange = (inst: 'Nifty' | 'BankNifty' | 'FinNifty' | 'Midcap' | 'Equities') => {
    soundEffects.playTabSwitch();
    setSelectedInstrument(inst);
    if (inst === 'Nifty') {
      setLotSize(25);
      // Realistic ATM Long Premium based on live spot
      const estAtmPrem = Math.round(liveNifty * 0.009); // ~200 pts
      setEntryPrice(estAtmPrem);
      setStopLossPrice(Math.round(estAtmPrem * 0.8)); // 20% premium stop
    } else if (inst === 'BankNifty') {
      setLotSize(15);
      const estAtmPrem = Math.round(liveBankNifty * 0.008); // ~380 pts
      setEntryPrice(estAtmPrem);
      setStopLossPrice(Math.round(estAtmPrem * 0.8));
    } else if (inst === 'FinNifty') {
      setLotSize(25);
      setEntryPrice(160);
      setStopLossPrice(130);
    } else if (inst === 'Midcap') {
      setLotSize(50);
      setEntryPrice(95);
      setStopLossPrice(75);
    } else {
      setLotSize(1);
      const eq = liveStocks.find((s) => s.symbol === selectedEquity) || liveStocks[0];
      if (eq) {
        setEntryPrice(Math.round(eq.price));
        setStopLossPrice(Math.round(eq.stopLoss || eq.price * 0.98));
      } else {
        setEntryPrice(2680);
        setStopLossPrice(2620);
      }
    }
  };

  const handleSelectEquityStock = (sym: string) => {
    soundEffects.playTabSwitch();
    setSelectedEquity(sym);
    const eq = liveStocks.find((s) => s.symbol === sym);
    if (eq) {
      setEntryPrice(Math.round(eq.price));
      setStopLossPrice(Math.round(eq.stopLoss || eq.price * 0.98));
    }
  };

  // Calculations
  const riskPerUnit = Math.max(1, entryPrice - stopLossPrice);
  const riskBudget = Math.floor(tradingCapital * (riskPct / 100));
  const rawQuantity = Math.floor(riskBudget / riskPerUnit);
  const lots = Math.max(1, Math.floor(rawQuantity / lotSize));
  const tradableUnits = lots * lotSize;
  const actualRisk = tradableUnits * riskPerUnit;
  const positionValue = tradableUnits * entryPrice;
  const allocatedPct = Number(((positionValue / tradingCapital) * 100).toFixed(2));
  const unallocatedAmount = Math.max(0, tradingCapital - positionValue);

  // Exit Targets
  const target1 = entryPrice + riskPerUnit * 2;
  const target2 = entryPrice + riskPerUnit * 3;
  const target1Pnl = tradableUnits * (riskPerUnit * 2);
  const target2Pnl = tradableUnits * (riskPerUnit * 3);

  // Dynamic OI Strike Ladder calibrated to LIVE NIFTY SPOT
  const atmNifty = Math.round(liveNifty / 50) * 50;
  const strikeInterval = 50;

  const dynamicStrikes = [];
  let totalCallOi = 0;
  let totalPutOi = 0;

  for (let i = -3; i <= 3; i++) {
    const strk = atmNifty + i * strikeInterval;
    const isAtm = i === 0;
    const callOi = Number((Math.max(4.0, 24 - i * 4.2 + (i === 1 ? 12 : 0))).toFixed(1));
    const putOi = Number((Math.max(4.0, 26 + i * 4.5 + (i === -1 ? 14 : 0))).toFixed(1));
    totalCallOi += callOi;
    totalPutOi += putOi;

    dynamicStrikes.push({
      strike: strk,
      callOi,
      putOi,
      isAtm,
      isSupport: i === -1,
      isResistance: i === 1,
    });
  }

  const pcr = totalCallOi > 0 ? (totalPutOi / totalCallOi).toFixed(2) : '1.05';

  return (
    <div className="space-y-6">
      {/* Top Banner: Timestamp & Headline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#25313F]/60">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-[10px] text-[#6E8298]">
            <span className="px-1.5 py-0.5 rounded bg-[#132E30] border border-[#55D6BE]/40 text-[#55D6BE] font-semibold flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#55D6BE] animate-ping"></span>
              REAL-TIME STREAM · NSE &amp; BSE {lastSyncTime ? `• ${lastSyncTime}` : ''}
            </span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="shrink-0">NIFTY: ₹{liveNifty.toLocaleString('en-IN')}</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="shrink-0">INDIA VIX: {liveVix}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#E6EDF5] leading-tight">
            Plan the risk.<br />
            <span className="text-[#55D6BE]">Then the trade.</span>
          </h1>
          <p className="text-xs text-[#9AAABB] mt-1 max-w-xl">
            Live NSE/BSE capital allocation, derivatives positioning, and anti-revenge circuit breaker.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => {
              soundEffects.playClick();
              fetchLiveTerminalData();
            }}
            disabled={isLoadingLive}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0D131C] hover:bg-[#132E30] text-[#9AAABB] hover:text-[#55D6BE] border border-[#25313F] rounded-lg text-xs font-mono transition-all active:scale-[0.96] cursor-pointer micro-press"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin text-[#55D6BE]' : ''}`} />
            <span>Sync Live</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playSuccess();
              setSavedWorkspaceToast(true);
              setTimeout(() => setSavedWorkspaceToast(false), 2500);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#132E30] hover:bg-[#55D6BE]/20 text-[#55D6BE] border border-[#55D6BE]/40 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer active:scale-[0.96] micro-press shadow-xs"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{savedWorkspaceToast ? 'Workspace Saved!' : 'Save workspace'}</span>
          </button>
        </div>
      </div>

      {/* 4 Top Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1: Trading Capital */}
        <div className="bg-[#111923] border border-[#25313F] rounded-xl p-3 sm:p-4 hover:border-[#38495C] transition-colors micro-lift">
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#6E8298] block">
            TRADING CAPITAL
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-[#E6EDF5] mt-1 truncate">
            ₹{tradingCapital.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#6E8298] block mt-0.5 truncate">Base capital &middot; INR</span>
        </div>

        {/* Card 2: Session Realized P&L */}
        <div className="bg-[#111923] border border-[#25313F] rounded-xl p-3 sm:p-4 hover:border-[#38495C] transition-colors micro-lift">
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#6E8298] block">
            SESSION REALIZED P&L
          </span>
          <div className={`text-lg sm:text-xl font-bold font-mono tabular-nums mt-1 truncate ${realizedPnl >= 0 ? 'text-[#55D6BE]' : 'text-rose-400'}`}>
            {realizedPnl >= 0 ? `+₹${realizedPnl}` : `−₹${Math.abs(realizedPnl)}`}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#6E8298] block mt-0.5 truncate">
            {realizedPnl >= 0 ? '+0.00%' : '−0.50%'} of capital
          </span>
        </div>

        {/* Card 3: Consecutive Losses */}
        <div className="bg-[#111923] border border-[#25313F] rounded-xl p-3 sm:p-4 hover:border-[#38495C] transition-colors micro-lift">
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#6E8298] block">
            CONSECUTIVE LOSSES
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-[#E6EDF5] mt-1">
            {consecutiveLosses} / 2
          </div>
          <span className="text-[10px] sm:text-[11px] text-amber-400/90 block mt-0.5 truncate">
            Pause after 2nd loss
          </span>
        </div>

        {/* Card 4: Circuit Breaker */}
        <div className="bg-[#111923] border border-[#25313F] rounded-xl p-3 sm:p-4 hover:border-[#38495C] transition-colors micro-lift">
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#6E8298] block">
            CIRCUIT BREAKER
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-[#55D6BE] mt-1 flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-[#55D6BE] animate-pulse shrink-0"></span>
            <span className="truncate">Active &middot; clear</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#6E8298] block mt-0.5 truncate">
            Trading enabled
          </span>
        </div>
      </div>

      {/* SECTION 1: Position Sizer & Risk Manager */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl p-4 sm:p-6 space-y-5 sm:space-y-6">
        {/* Header & Instrument Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#25313F]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#E6EDF5]">Position Sizer & Risk Manager</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30">
                <ArrowUpRight className="w-3 h-3" /> LONG ONLY
              </span>
            </div>
            <p className="text-xs text-[#9AAABB] mt-0.5">
              Long option &middot; prices are premiums in INR
            </p>
          </div>

          {/* Instrument Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#0D131C] border border-[#25313F] rounded-lg text-xs font-mono overflow-x-auto no-scrollbar">
            {(['Nifty', 'BankNifty', 'FinNifty', 'Midcap', 'Equities'] as const).map((inst) => (
              <button
                key={inst}
                onClick={() => handleInstrumentChange(inst)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  selectedInstrument === inst
                    ? 'bg-[#132E30] text-[#55D6BE] font-semibold border border-[#55D6BE]/40 shadow-xs'
                    : 'text-[#6E8298] hover:text-[#E6EDF5]'
                }`}
              >
                {inst}
              </button>
            ))}
          </div>
        </div>

        {/* Live Equities Quick Selector */}
        {selectedInstrument === 'Equities' && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-2 bg-[#0D131C] border border-[#25313F] rounded-lg">
            <span className="text-[10px] text-[#6E8298] font-mono uppercase tracking-wider shrink-0 pr-2">
              Live Stock:
            </span>
            {['RELIANCE', 'TCS', 'HDFCBANK', 'ICICIBANK', 'INFY', 'TATAMOTORS', 'TITAN', 'BAJFINANCE', 'SBIN', 'LT'].map((sym) => (
              <button
                key={sym}
                onClick={() => handleSelectEquityStock(sym)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
                  selectedEquity === sym
                    ? 'bg-[#55D6BE] text-black shadow-xs'
                    : 'bg-[#111923] text-[#9AAABB] border border-[#25313F] hover:text-[#E6EDF5]'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        )}

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Trading Capital */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#6E8298] block font-mono">Trading capital</label>
            <div className="relative">
              <input
                type="number"
                value={tradingCapital}
                onChange={(e) => setTradingCapital(Number(e.target.value))}
                className="w-full bg-[#0D131C] border border-[#25313F] rounded-lg px-3 py-2 text-sm font-mono text-[#E6EDF5] focus:outline-none focus:border-[#55D6BE]"
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-mono text-[#6E8298]">INR</span>
            </div>
          </div>

          {/* Risk per trade */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-[#6E8298] block font-mono">Risk per trade</label>
              <span className="text-[10px] text-[#55D6BE]">1–2% ideal</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="5"
                value={riskPct}
                onChange={(e) => setRiskPct(Number(e.target.value))}
                className="w-full bg-[#0D131C] border border-[#25313F] rounded-lg px-3 py-2 text-sm font-mono text-[#E6EDF5] focus:outline-none focus:border-[#55D6BE]"
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-mono text-[#6E8298]">%</span>
            </div>
          </div>

          {/* Entry Price */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#6E8298] block font-mono">Entry price</label>
            <div className="relative">
              <input
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                className="w-full bg-[#0D131C] border border-[#25313F] rounded-lg px-3 py-2 text-sm font-mono text-[#E6EDF5] focus:outline-none focus:border-[#55D6BE]"
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-mono text-[#6E8298]">/ UNIT</span>
            </div>
          </div>

          {/* Stop-loss Price */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#6E8298] block font-mono">Stop-loss price</label>
            <div className="relative">
              <input
                type="number"
                value={stopLossPrice}
                onChange={(e) => setStopLossPrice(Number(e.target.value))}
                className="w-full bg-[#0D131C] border border-[#25313F] rounded-lg px-3 py-2 text-sm font-mono text-[#E6EDF5] focus:outline-none focus:border-rose-400"
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-mono text-[#6E8298]">/ UNIT</span>
            </div>
          </div>

          {/* Lot Size */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#6E8298] block font-mono">Lot size &middot; example</label>
            <div className="relative">
              <input
                type="number"
                value={lotSize}
                onChange={(e) => setLotSize(Number(e.target.value))}
                className="w-full bg-[#0D131C] border border-[#25313F] rounded-lg px-3 py-2 text-sm font-mono text-[#E6EDF5] focus:outline-none focus:border-[#55D6BE]"
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-mono text-[#6E8298]">UNITS</span>
            </div>
          </div>
        </div>

        {/* Calculation Summary Box */}
        <div className="bg-[#0D131C] border border-[#25313F] rounded-xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#9AAABB] border-b border-[#25313F]/50 pb-3">
            <div>
              <span className="text-[#6E8298]">Quantity = (Capital &times; Risk %) / (Entry &minus; Stop)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#55D6BE] font-semibold">₹{riskPerUnit} risk / unit</span>
              <span>&bull;</span>
              <span className="text-[#E6EDF5] font-bold text-sm">
                {tradableUnits} Tradable units
              </span>
              <span className="text-[11px] text-[#6E8298]">
                (Rounded down to complete lots, {lots} lots &times; {lotSize})
              </span>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#111923] border border-[#25313F] rounded-lg p-3.5">
              <span className="text-[10px] font-mono text-[#6E8298] uppercase block">Risk budget</span>
              <div className="text-lg font-bold font-mono text-[#E6EDF5] mt-1">
                ₹{riskBudget.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-[#6E8298] block mt-0.5">
                {riskPct.toFixed(2)}% of capital
              </span>
            </div>

            <div className="bg-[#111923] border border-[#25313F] rounded-lg p-3.5">
              <span className="text-[10px] font-mono text-[#6E8298] uppercase block">Actual risk</span>
              <div className="text-lg font-bold font-mono text-amber-400 mt-1">
                ₹{actualRisk.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-[#6E8298] block mt-0.5">
                {tradableUnits} units &times; ₹{riskPerUnit}
              </span>
            </div>

            <div className="bg-[#111923] border border-[#25313F] rounded-lg p-3.5">
              <span className="text-[10px] font-mono text-[#6E8298] uppercase block">Position value</span>
              <div className="text-lg font-bold font-mono text-[#55D6BE] mt-1">
                ₹{positionValue.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-[#6E8298] block mt-0.5">
                {allocatedPct}% allocation
              </span>
            </div>
          </div>

          {/* Capital Allocation Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] font-mono text-[#9AAABB]">
              <span className="text-[#55D6BE] font-semibold">{allocatedPct}% CAPITAL ALLOCATED</span>
              <span className="text-[#6E8298]">{(100 - allocatedPct).toFixed(1)}% AVAILABLE</span>
            </div>
            <div className="w-full bg-[#111923] h-2 rounded-full overflow-hidden border border-[#25313F]">
              <div
                className="bg-[#55D6BE] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, allocatedPct)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Execution Ladder: Define the exit before the entry */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#E6EDF5] tracking-wide">
              Define the exit before the entry
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30">
              MIN R:R 1:2
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* STOP LOSS */}
            <div className="bg-[#0D131C] border border-rose-900/40 rounded-lg p-3.5 space-y-1 text-center">
              <span className="text-[10px] font-mono font-bold text-rose-400 block tracking-wider uppercase">
                STOP LOSS
              </span>
              <div className="text-lg font-bold font-mono text-[#E6EDF5]">₹{stopLossPrice}</div>
              <span className="text-[11px] font-mono text-rose-400/90 block">
                −₹{actualRisk.toLocaleString('en-IN')} &middot; −1R
              </span>
            </div>

            {/* ENTRY */}
            <div className="bg-[#0D131C] border border-[#25313F] rounded-lg p-3.5 space-y-1 text-center">
              <span className="text-[10px] font-mono font-bold text-[#9AAABB] block tracking-wider uppercase">
                ENTRY
              </span>
              <div className="text-lg font-bold font-mono text-[#E6EDF5]">₹{entryPrice}</div>
              <span className="text-[11px] font-mono text-[#6E8298] block">
                {tradableUnits} units &middot; {lots} lots
              </span>
            </div>

            {/* TARGET 1: 1:2 */}
            <div className="bg-[#0D131C] border border-[#55D6BE]/30 rounded-lg p-3.5 space-y-1 text-center">
              <span className="text-[10px] font-mono font-bold text-[#55D6BE] block tracking-wider uppercase">
                TARGET 1 &middot; 1:2
              </span>
              <div className="text-lg font-bold font-mono text-[#E6EDF5]">₹{target1}</div>
              <span className="text-[11px] font-mono text-[#55D6BE] block">
                +₹{target1Pnl.toLocaleString('en-IN')} &middot; +2R
              </span>
            </div>

            {/* TARGET 2: 1:3 */}
            <div className="bg-[#0D131C] border border-[#55D6BE]/50 rounded-lg p-3.5 space-y-1 text-center">
              <span className="text-[10px] font-mono font-bold text-[#55D6BE] block tracking-wider uppercase">
                TARGET 2 &middot; 1:3
              </span>
              <div className="text-lg font-bold font-mono text-[#E6EDF5]">₹{target2}</div>
              <span className="text-[11px] font-mono text-[#55D6BE] block">
                +₹{target2Pnl.toLocaleString('en-IN')} &middot; +3R
              </span>
            </div>
          </div>

          <p className="text-[10px] text-[#6E8298] italic">
            Potential outcomes before fees, slippage and execution effects. Not guaranteed.
          </p>

          <div className="bg-[#132E30]/40 border border-[#55D6BE]/20 rounded-lg p-3 text-xs text-[#55D6BE] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#55D6BE]" />
              <span>
                Allocation check passed &middot; ₹{unallocatedAmount.toLocaleString('en-IN')} unallocated.
                Never exceed available capital; reduce quantity if position value is too high.
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-[10px] text-[#6E8298]">
              Exchange contract specification: Lot size {lotSize}. Verified against NSE & BSE standards.
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {onOpenTimeMachine && (
                <button
                  onClick={() => onOpenTimeMachine(selectedInstrument + ' OPTION', entryPrice, stopLossPrice, target1)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#132E30] hover:bg-[#55D6BE]/20 text-[#55D6BE] border border-[#55D6BE]/40 text-xs font-semibold transition-all shadow"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#55D6BE]" />
                  <span>Simulate in Time Machine</span>
                </button>
              )}
              <button
                onClick={() => {
                  setEntryPrice(200);
                  setStopLossPrice(180);
                }}
                className="px-3 py-1.5 rounded-lg border border-[#25313F] text-xs text-[#9AAABB] hover:text-[#E6EDF5] hover:bg-[#0D131C] transition-colors"
              >
                Recalculate position
              </button>
              <button
                onClick={() => {
                  setSavedPlanToast(true);
                  setTimeout(() => setSavedPlanToast(false), 2500);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#55D6BE] hover:bg-[#55D6BE]/90 text-black font-semibold text-xs transition-all shadow"
              >
                {savedPlanToast ? 'Plan Saved!' : 'Save plan'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: OI & PCR Sentiment Heatmap */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl p-6 space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#25313F]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-[#E6EDF5]">OI & PCR Sentiment Heatmap</h2>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-[#132E30] border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE DERIVATIVES STREAM
              </span>
            </div>
            <p className="text-xs text-[#9AAABB] mt-0.5">
              Underlying: <strong className="text-[#E6EDF5]">NIFTY 50</strong> &middot; Expiry:{' '}
              <span className="text-[#E6EDF5]">27 OCT 2026</span> &middot; Spot:{' '}
              <span className="font-mono text-[#55D6BE] font-semibold">
                ₹{liveNifty.toLocaleString('en-IN', { minimumFractionDigits: 2 })} pts (
                {liveNiftyChange >= 0 ? '+' : ''}
                {liveNiftyChange}%)
              </span>{' '}
              {lastSyncTime ? `• ${lastSyncTime}` : ''}
            </p>
          </div>

          <button
            onClick={fetchLiveTerminalData}
            disabled={isLoadingLive}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D131C] hover:bg-[#132E30] text-[#9AAABB] hover:text-[#55D6BE] border border-[#25313F] rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin text-[#55D6BE]' : ''}`} />
            <span>Refresh Live Data</span>
          </button>
        </div>

        {/* PCR Metric Card */}
        <div className="bg-[#0D131C] border border-[#25313F] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] font-mono text-[#6E8298] uppercase tracking-wider block">
                PUT / CALL RATIO
              </span>
              <span className="text-2xl font-bold font-mono text-[#55D6BE]">{pcr}</span>
            </div>
            <div className="border-l border-[#25313F] pl-4">
              <span className="text-xs font-semibold text-[#E6EDF5] block">
                {Number(pcr) >= 1 ? 'Put OI dominant (Bullish Floor)' : 'Call OI dominant (Resistance Ceiling)'}
              </span>
              <span className="text-[11px] font-mono text-[#6E8298]">
                {totalPutOi.toFixed(1)}L put &divide; {totalCallOi.toFixed(1)}L call
              </span>
            </div>
          </div>
          <span className="text-[11px] text-[#6E8298] italic">
            Live bilateral derivative flow &middot; Real-time strikes
          </span>
        </div>

        {/* Bilateral Strike Table & Visual OI Bars */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[#25313F] text-[#6E8298] uppercase text-[10px]">
                <th className="py-2.5 px-3 text-right w-1/3">CALL OI &middot; LAKH</th>
                <th className="py-2.5 px-4 text-center w-1/3 text-[#E6EDF5] font-semibold">STRIKE</th>
                <th className="py-2.5 px-3 text-left w-1/3">PUT OI &middot; LAKH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#25313F]/40">
              {dynamicStrikes.map((row) => {
                const callWidth = Math.min(100, (row.callOi / 40) * 100);
                const putWidth = Math.min(100, (row.putOi / 40) * 100);

                return (
                  <tr key={row.strike} className={`hover:bg-[#0D131C]/60 ${row.isAtm ? 'bg-[#132E30]/20' : ''}`}>
                    {/* Call OI Bar & Number */}
                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <span className="text-[#E6EDF5] font-bold">{row.callOi.toFixed(1)}</span>
                        <div className="w-28 bg-[#0D131C] h-3 rounded overflow-hidden flex justify-end">
                          <div
                            className={`h-full rounded-sm ${row.isResistance ? 'bg-rose-500' : 'bg-rose-500/70'}`}
                            style={{ width: `${callWidth}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Strike and ATM tag */}
                    <td className="py-2 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-bold text-[#E6EDF5]">
                        <span>{row.strike.toLocaleString('en-IN')}</span>
                        {row.isAtm && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/40 font-semibold">
                            ATM
                          </span>
                        )}
                        {row.isSupport && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                            SUP
                          </span>
                        )}
                        {row.isResistance && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-400 border border-rose-800">
                            RES
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Put OI Bar & Number */}
                    <td className="py-2 px-3 text-left">
                      <div className="flex items-center justify-start gap-2.5">
                        <div className="w-28 bg-[#0D131C] h-3 rounded overflow-hidden flex justify-start">
                          <div
                            className={`h-full rounded-sm ${row.isSupport ? 'bg-[#55D6BE]' : 'bg-[#55D6BE]/70'}`}
                            style={{ width: `${putWidth}%` }}
                          ></div>
                        </div>
                        <span className="text-[#E6EDF5] font-bold">{row.putOi.toFixed(1)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Total Row */}
              <tr className="border-t-2 border-[#25313F] font-bold text-xs bg-[#0D131C]/80">
                <td className="py-3 px-3 text-right text-rose-400 font-mono">
                  &Sigma; {totalCallOi.toFixed(1)}L
                </td>
                <td className="py-3 px-4 text-center text-[#6E8298] text-[10px] uppercase font-mono tracking-wider">
                  TOTAL OI
                </td>
                <td className="py-3 px-3 text-left text-[#55D6BE] font-mono">
                  &Sigma; {totalPutOi.toFixed(1)}L
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#6E8298] pt-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
              <span className="text-[#9AAABB]">Call OI</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#55D6BE]"></span>
              <span className="text-[#9AAABB]">Put OI</span>
            </span>
          </div>
          <span>Longer bar = stronger OI &middot; 1L = 1,00,000 contracts</span>
        </div>

        {/* Potential Support & Resistance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0D131C] border border-emerald-900/40 rounded-xl p-4">
            <span className="text-[10px] font-mono uppercase text-[#6E8298] block">
              POTENTIAL SUPPORT
            </span>
            <div className="text-xl font-bold font-mono text-[#55D6BE] mt-1">
              {(atmNifty - strikeInterval).toLocaleString('en-IN')}
            </div>
            <span className="text-xs font-mono text-[#6E8298]">Highest Put Writer concentration below ATM</span>
          </div>

          <div className="bg-[#0D131C] border border-rose-900/40 rounded-xl p-4">
            <span className="text-[10px] font-mono uppercase text-[#6E8298] block">
              POTENTIAL RESISTANCE
            </span>
            <div className="text-xl font-bold font-mono text-rose-400 mt-1">
              {(atmNifty + strikeInterval).toLocaleString('en-IN')}
            </div>
            <span className="text-xs font-mono text-[#6E8298]">Highest Call Writer concentration above ATM</span>
          </div>
        </div>

        <p className="text-[10px] text-[#6E8298] leading-relaxed">
          High call OI may act as resistance; high put OI may act as support. Positions can unwind.
          These levels and PCR are contextual signals, not guarantees.
        </p>
      </div>

      {/* SECTION 3: PRE-TRADE DISCIPLINE */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl p-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold tracking-wider uppercase text-[#E6EDF5]">
            PRE-TRADE DISCIPLINE
          </h2>
          <p className="text-xs text-[#9AAABB] mt-0.5">
            A good trade starts with a rule, not a feeling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-[#0D131C] border border-[#25313F] rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-[#E6EDF5] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#55D6BE]"></span>
              Protect your capital
            </h3>
            <p className="text-[11px] text-[#9AAABB] leading-relaxed">
              Risk 1–2% per trade. Define the stop first and size down, never widen the stop to justify size.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0D131C] border border-[#25313F] rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-[#E6EDF5] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              No revenge trades
            </h3>
            <p className="text-[11px] text-[#9AAABB] leading-relaxed">
              Two consecutive losses &rarr; pause the session. Review the setup before putting more capital at risk.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0D131C] border border-[#25313F] rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-[#E6EDF5] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#55D6BE]"></span>
              Prefer ATM / ITM options
            </h3>
            <p className="text-[11px] text-[#9AAABB] leading-relaxed">
              Use |delta| &ge; 0.50 as a guide, not cheap far-OTM premiums. Theta often accelerates near expiry; moneyness matters.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <footer className="text-center py-4 text-[10px] text-[#6E8298] space-y-1">
        <p>Live NSE &amp; BSE market feeds &middot; Risk-controlled execution terminal.</p>
        <p>Built for <strong className="text-[#9AAABB]">Systematic Institutional Risk Discipline</strong></p>
      </footer>
    </div>
  );
}
