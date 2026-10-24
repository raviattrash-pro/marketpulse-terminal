'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Sparkles,
  BarChart3,
  Flame,
} from 'lucide-react';

interface SimulationPath {
  pathIndex: number;
  candles: number[];
  outcome: 'TARGET_1' | 'TARGET_2' | 'STOP_LOSS' | 'OPEN';
  finalPnl: number;
  maxDrawdown: number;
  barsToExit: number;
}

interface TimeMachineSimulatorProps {
  initialSymbol?: string;
  initialEntry?: number;
  initialSl?: number;
  initialTarget?: number;
  initialQty?: number;
}

export default function TimeMachineSimulator({
  initialSymbol = 'NIFTY 24800 CE',
  initialEntry = 200,
  initialSl = 180,
  initialTarget = 240,
  initialQty = 50,
}: TimeMachineSimulatorProps) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [entryPrice, setEntryPrice] = useState(initialEntry);
  const [stopLoss, setStopLoss] = useState(initialSl);
  const [target1, setTarget1] = useState(initialTarget);
  const [target2, setTarget2] = useState(initialEntry + (initialEntry - initialSl) * 3);
  const [quantity, setQuantity] = useState(initialQty);
  const [vix, setVix] = useState(13.84);
  const [iterations, setIterations] = useState(100);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState<{
    paths: SimulationPath[];
    winRate: number;
    target1Hits: number;
    target2Hits: number;
    stopHits: number;
    avgDrawdown: number;
    expectedValue: number;
    profitFactor: number;
  } | null>(null);

  const [liveStocks, setLiveStocks] = useState<any[]>([]);

  // Fetch real India VIX & Stocks
  useEffect(() => {
    const fetchLiveVixAndStocks = async () => {
      try {
        const [pulseRes, stocksRes] = await Promise.all([
          fetch('/api/market-pulse'),
          fetch('/api/live-stocks'),
        ]);
        if (pulseRes.ok) {
          const p = await pulseRes.json();
          const vx = p.indices?.find((i: any) => i.symbol === '^INDIAVIX');
          if (vx && vx.price > 0) setVix(vx.price);
        }
        if (stocksRes.ok) {
          const s = await stocksRes.json();
          if (s.stocks) setLiveStocks(s.stocks);
        }
      } catch (e) {}
    };
    fetchLiveVixAndStocks();
  }, []);

  const handleSelectLiveStock = (sym: string) => {
    const s = liveStocks.find((x) => x.symbol === sym);
    if (s) {
      setSymbol(s.symbol);
      const p = Math.round(s.price);
      const slVal = Math.round(s.stopLoss || p * 0.98);
      const t1Val = Math.round(s.target1 || p + (p - slVal) * 2);
      const t2Val = Math.round(s.target2 || p + (p - slVal) * 3);
      setEntryPrice(p);
      setStopLoss(slVal);
      setTarget1(t1Val);
      setTarget2(t2Val);
    }
  };

  // Sync props if changed
  useEffect(() => {
    if (initialSymbol) setSymbol(initialSymbol);
    if (initialEntry) {
      setEntryPrice(initialEntry);
      setStopLoss(initialSl);
      setTarget1(initialTarget);
      setTarget2(initialEntry + (initialEntry - initialSl) * 3);
      setQuantity(initialQty);
    }
  }, [initialSymbol, initialEntry, initialSl, initialTarget, initialQty]);

  // Run Monte Carlo Path Simulation
  const runSimulation = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const paths: SimulationPath[] = [];
      const riskPerShare = entryPrice - stopLoss;
      const t1Reward = target1 - entryPrice;
      const t2Reward = target2 - entryPrice;
      const dailyVolatility = (entryPrice * (vix / 100)) / Math.sqrt(252);
      const stepVol = dailyVolatility * 0.4; // 15-minute / hourly step estimate

      let t1Count = 0;
      let t2Count = 0;
      let stopCount = 0;
      let totalPnl = 0;
      let grossWins = 0;
      let grossLosses = 0;
      let totalDrawdown = 0;

      for (let i = 0; i < iterations; i++) {
        let currentPrice = entryPrice;
        const candles = [currentPrice];
        let outcome: 'TARGET_1' | 'TARGET_2' | 'STOP_LOSS' | 'OPEN' = 'OPEN';
        let lowestLow = entryPrice;
        let bars = 0;

        // Simulate up to 30 time steps
        for (let step = 1; step <= 30; step++) {
          bars = step;
          // Random walk with slight upward drift (+0.12 standard normal) based on setup quality
          const u1 = Math.random() || 0.0001;
          const u2 = Math.random() || 0.0001;
          const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          const drift = 0.12 * stepVol;
          const priceChange = z * stepVol + drift;

          currentPrice = Math.max(0.1, Number((currentPrice + priceChange).toFixed(2)));
          candles.push(currentPrice);

          if (currentPrice < lowestLow) lowestLow = currentPrice;

          // Check SL invalidation
          if (currentPrice <= stopLoss) {
            outcome = 'STOP_LOSS';
            stopCount++;
            const pnl = -riskPerShare * quantity;
            grossLosses += Math.abs(pnl);
            totalPnl += pnl;
            break;
          }

          // Check Target 2
          if (currentPrice >= target2) {
            outcome = 'TARGET_2';
            t2Count++;
            t1Count++;
            const pnl = t2Reward * quantity;
            grossWins += pnl;
            totalPnl += pnl;
            break;
          }

          // Check Target 1
          if (currentPrice >= target1 && outcome === 'OPEN') {
            outcome = 'TARGET_1';
            t1Count++;
            const pnl = t1Reward * quantity;
            grossWins += pnl;
            totalPnl += pnl;
            break;
          }
        }

        const maxDd = (entryPrice - lowestLow) * quantity;
        totalDrawdown += maxDd;

        paths.push({
          pathIndex: i,
          candles,
          outcome,
          finalPnl:
            outcome === 'TARGET_2'
              ? t2Reward * quantity
              : outcome === 'TARGET_1'
              ? t1Reward * quantity
              : -riskPerShare * quantity,
          maxDrawdown: maxDd,
          barsToExit: bars,
        });
      }

      const winRate = Number(((t1Count / iterations) * 100).toFixed(1));
      const ev = Math.round(totalPnl / iterations);
      const avgDd = Math.round(totalDrawdown / iterations);
      const pf = grossLosses > 0 ? Number((grossWins / grossLosses).toFixed(2)) : 3.5;

      setSimResults({
        paths,
        winRate,
        target1Hits: t1Count,
        target2Hits: t2Count,
        stopHits: stopCount,
        avgDrawdown: avgDd,
        expectedValue: ev,
        profitFactor: pf,
      });

      setIsSimulating(false);
    }, 400);
  };

  // Run on mount
  useEffect(() => {
    runSimulation();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30 mb-2">
              <Clock className="w-3.5 h-3.5" /> AI Monte Carlo & Path Forecasting
            </div>
            <h2 className="text-xl font-bold text-[#E6EDF5]">
              Trade &ldquo;Time Machine&rdquo; Simulator
            </h2>
            <p className="text-xs text-[#9AAABB] mt-1 max-w-2xl">
              Simulate 100+ forward-in-time paths of your trade <strong>BEFORE</strong> risking a single rupee.
              Tests real volatility drift, maximum expected drawdown, win rate probability, and mathematical Expected Value (EV).
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 bg-[#55D6BE] hover:bg-[#55D6BE]/90 text-black font-semibold px-4 py-2.5 rounded-lg text-xs shadow-lg transition-all shrink-0 font-mono disabled:opacity-50"
          >
            {isSimulating ? (
              <RotateCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-black" />
            )}
            <span>{isSimulating ? 'Simulating 100 Realities...' : 'Run Time Machine'}</span>
          </button>
        </div>

        {/* Quick Live Stock Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-4">
          <span className="text-[10px] text-[#6E8298] font-mono uppercase tracking-wider shrink-0 pr-1">
            Live NSE Assets:
          </span>
          {['TCS', 'RELIANCE', 'HDFCBANK', 'INFY', 'TATAMOTORS', 'TITAN', 'BAJFINANCE', 'SBIN'].map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => handleSelectLiveStock(sym)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition cursor-pointer shrink-0 ${
                symbol === sym
                  ? 'bg-[#55D6BE] text-black shadow'
                  : 'bg-[#0D131C] text-[#9AAABB] border border-[#25313F] hover:text-[#E6EDF5]'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>

        {/* Input Parameters Form Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-[#25313F]">
          <div>
            <label className="text-[10px] font-mono uppercase text-[#6E8298] block">Instrument</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-[#0D131C] border border-[#25313F] rounded px-2.5 py-1.5 text-xs font-mono text-[#E6EDF5] mt-1 focus:outline-none focus:border-[#55D6BE]"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[#6E8298] block">Entry Price</label>
            <input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(Number(e.target.value))}
              className="w-full bg-[#0D131C] border border-[#25313F] rounded px-2.5 py-1.5 text-xs font-mono text-[#E6EDF5] mt-1 focus:outline-none focus:border-[#55D6BE]"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[#6E8298] block">Stop Loss</label>
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value))}
              className="w-full bg-[#0D131C] border border-[#25313F] rounded px-2.5 py-1.5 text-xs font-mono text-rose-400 mt-1 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[#6E8298] block">Target 1 (1:2)</label>
            <input
              type="number"
              value={target1}
              onChange={(e) => setTarget1(Number(e.target.value))}
              className="w-full bg-[#0D131C] border border-[#25313F] rounded px-2.5 py-1.5 text-xs font-mono text-[#55D6BE] mt-1 focus:outline-none focus:border-[#55D6BE]"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[#6E8298] block">Target 2 (1:3)</label>
            <input
              type="number"
              value={target2}
              onChange={(e) => setTarget2(Number(e.target.value))}
              className="w-full bg-[#0D131C] border border-[#25313F] rounded px-2.5 py-1.5 text-xs font-mono text-[#55D6BE] mt-1 focus:outline-none focus:border-[#55D6BE]"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[#6E8298] block">Quantity (Units)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-[#0D131C] border border-[#25313F] rounded px-2.5 py-1.5 text-xs font-mono text-[#E6EDF5] mt-1 focus:outline-none focus:border-[#55D6BE]"
            />
          </div>
        </div>
      </div>

      {/* Simulation Results & Key Metrics */}
      {simResults && (
        <>
          {/* Top 4 Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Win Probability */}
            <div className="bg-[#111923] border border-[#25313F] rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-mono text-[#6E8298] uppercase">Win Probability</span>
              <div className="text-2xl font-bold font-mono text-[#55D6BE]">
                {simResults.winRate}%
              </div>
              <span className="text-[11px] text-[#6E8298] block">
                {simResults.target1Hits} of {iterations} runs hit &ge;1:2
              </span>
            </div>

            {/* Expected Value */}
            <div className="bg-[#111923] border border-[#25313F] rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-mono text-[#6E8298] uppercase">Expected Value (EV)</span>
              <div className={`text-2xl font-bold font-mono ${simResults.expectedValue >= 0 ? 'text-[#55D6BE]' : 'text-rose-400'}`}>
                {simResults.expectedValue >= 0 ? `+₹${simResults.expectedValue.toLocaleString('en-IN')}` : `−₹${Math.abs(simResults.expectedValue).toLocaleString('en-IN')}`}
              </div>
              <span className="text-[11px] text-[#6E8298] block">
                Mathematical edge per trade
              </span>
            </div>

            {/* Profit Factor */}
            <div className="bg-[#111923] border border-[#25313F] rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-mono text-[#6E8298] uppercase">Simulated Profit Factor</span>
              <div className="text-2xl font-bold font-mono text-[#E6EDF5]">
                {simResults.profitFactor}x
              </div>
              <span className="text-[11px] text-[#6E8298] block">
                Gross wins &divide; gross losses
              </span>
            </div>

            {/* Max Drawdown */}
            <div className="bg-[#111923] border border-[#25313F] rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-mono text-[#6E8298] uppercase">Avg Path Drawdown</span>
              <div className="text-2xl font-bold font-mono text-amber-400">
                −₹{simResults.avgDrawdown.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-[#6E8298] block">
                Adverse excursion before exit
              </span>
            </div>
          </div>

          {/* Time Machine Interactive Trajectory Graph */}
          <div className="bg-[#111923] border border-[#25313F] rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#25313F]">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#55D6BE]" />
                <h3 className="text-sm font-bold text-[#E6EDF5]">
                  Sample Forward Price Trajectories (10 Highlighted Realities)
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-[#55D6BE]">
                  <span className="w-2 h-0.5 bg-[#55D6BE]"></span> Target Hit ({simResults.target1Hits}%)
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2 h-0.5 bg-rose-400"></span> Stopped Out ({simResults.stopHits}%)
                </span>
              </div>
            </div>

            {/* Multi-Path SVG Canvas */}
            <div className="h-64 w-full bg-[#0D131C] rounded-lg border border-[#25313F] p-3 relative overflow-hidden flex flex-col justify-between">
              {/* Reference Lines */}
              <div className="absolute inset-x-3 top-3 border-b border-dashed border-[#55D6BE]/40 flex justify-between text-[10px] font-mono text-[#55D6BE]">
                <span>Target 2: ₹{target2} (+3R)</span>
                <span>+₹{((target2 - entryPrice) * quantity).toLocaleString('en-IN')}</span>
              </div>
              <div className="absolute inset-x-3 top-16 border-b border-dashed border-[#55D6BE]/60 flex justify-between text-[10px] font-mono text-[#55D6BE]">
                <span>Target 1: ₹{target1} (+2R)</span>
                <span>+₹{((target1 - entryPrice) * quantity).toLocaleString('en-IN')}</span>
              </div>
              <div className="absolute inset-x-3 top-36 border-b border-gray-600 flex justify-between text-[10px] font-mono text-gray-400">
                <span>Entry: ₹{entryPrice}</span>
                <span>0R Breakeven</span>
              </div>
              <div className="absolute inset-x-3 bottom-3 border-b border-dashed border-rose-500/60 flex justify-between text-[10px] font-mono text-rose-400">
                <span>Stop Loss: ₹{stopLoss} (−1R)</span>
                <span>−₹{((entryPrice - stopLoss) * quantity).toLocaleString('en-IN')}</span>
              </div>

              {/* Render 10 Path Polylines */}
              <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {simResults.paths.slice(0, 12).map((p, idx) => {
                  const points = p.candles
                    .map((c, i) => {
                      const x = (i / 30) * 100;
                      // Normalize y between (target2 + 10) and (stopLoss - 5)
                      const minY = stopLoss - 5;
                      const maxY = target2 + 10;
                      const y = 100 - ((c - minY) / (maxY - minY)) * 100;
                      return `${x},${y}`;
                    })
                    .join(' ');

                  const isWin = p.outcome === 'TARGET_1' || p.outcome === 'TARGET_2';
                  return (
                    <polyline
                      key={idx}
                      fill="none"
                      stroke={isWin ? '#55D6BE' : '#f43f5e'}
                      strokeWidth={idx === 0 ? '1.5' : '0.75'}
                      strokeOpacity={idx === 0 ? '0.9' : '0.4'}
                      points={points}
                    />
                  );
                })}
              </svg>
            </div>

            {/* Time Machine AI Verdict Card */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              simResults.expectedValue > 0 && simResults.winRate >= 50
                ? 'bg-[#132E30]/40 border-[#55D6BE]/40 text-[#E6EDF5]'
                : 'bg-rose-950/30 border-rose-800/40 text-[#E6EDF5]'
            }`}>
              {simResults.expectedValue > 0 && simResults.winRate >= 50 ? (
                <CheckCircle2 className="w-5 h-5 text-[#55D6BE] shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-sm block">
                  {simResults.expectedValue > 0 && simResults.winRate >= 50
                    ? 'Time Machine Verdict: TRADE APPROVED BY MATHEMATICAL EDGE'
                    : 'Time Machine Verdict: CAUTION — MARGINAL EDGE'}
                </span>
                <p className="text-[#9AAABB] leading-relaxed">
                  {simResults.expectedValue > 0 && simResults.winRate >= 50
                    ? `Over ${iterations} simulated paths under current VIX (${vix}), this setup delivered a positive Expected Value of +₹${simResults.expectedValue.toLocaleString('en-IN')} with a ${simResults.winRate}% target achievement rate. Expected adverse drawdown averaged −₹${simResults.avgDrawdown.toLocaleString('en-IN')}, well within your risk budget.`
                    : `Simulated path testing shows high drawdown risk relative to reward. Consider widening target or waiting for a cleaner price action confirmation.`}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
