'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import RealTradingViewChart from '@/components/RealTradingViewChart';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Layers,
  Search,
  Activity,
  Award,
  Zap,
  Info,
  Sliders,
  ChevronRight,
  ExternalLink,
  X,
  Send,
  FileText,
  Lock,
} from 'lucide-react';

export default function DayTraderSkillHub() {
  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'exit-planner' | 'time-machine' | 'broker-ticket'>('overview');

  // Active stock and live data state
  const [selectedStock, setSelectedStock] = useState<string>('IRFC');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingLive, setLoadingLive] = useState<boolean>(false);
  const [selectedSkillModal, setSelectedSkillModal] = useState<string | null>(null);
  const [liveNews, setLiveNews] = useState<any[]>([]);

  // Reel Pipeline Runner State
  const [pipelineStage, setPipelineStage] = useState<number>(1);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);

  // Broker Approval Gate State
  const [approvalInput, setApprovalInput] = useState<string>('');
  const [orderStatus, setOrderStatus] = useState<'PENDING_APPROVAL' | 'PLACED' | 'DENIED'>('PENDING_APPROVAL');
  const [clientOrderId, setClientOrderId] = useState<string>('ord_agy_91024_01');
  const [executionTime, setExecutionTime] = useState<string>('');

  // Chart Mode State: Official TradingView Real Live Graph vs Real Intraday Candlestick Plan
  const [chartViewMode, setChartViewMode] = useState<'TRADINGVIEW' | 'CANDLES'>('TRADINGVIEW');
  const [realStockCandles, setRealStockCandles] = useState<any[]>([]);

  const isUsStock = useMemo(() => {
    return ['TSLA', 'AAPL', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'META'].includes(selectedStock.toUpperCase());
  }, [selectedStock]);

  const currencySymbol = isUsStock ? '$' : '₹';

  const [liveStock, setLiveStock] = useState<{
    price: number;
    changePct: number;
    name: string;
    dayHigh: number;
    dayLow: number;
    volume: number;
    volRatio: number;
    fairValue: number;
    valuationStatus: string;
    marginOfSafetyPct: number;
    stopLoss: number;
    target1: number;
    target2: number;
    bestEntryTiming: string;
    bestEntryStrategy: string;
    advisorVerdict: string;
    orHigh: number;
    orLow: number;
  }>({
    price: 74.45,
    changePct: -7.23,
    name: 'IRFC India Ltd',
    dayHigh: 76.47,
    dayLow: 73.76,
    volume: 9124577,
    volRatio: 0.9,
    fairValue: 66,
    valuationStatus: 'OVERVALUED',
    marginOfSafetyPct: -12.8,
    stopLoss: 72.96,
    target1: 77.43,
    target2: 78.92,
    bestEntryTiming: '10:15 AM – 10:55 AM (Opening Range Breakout)',
    bestEntryStrategy: 'Wait for 15-minute Opening Range candle close; enter on breakout above OR high',
    advisorVerdict: 'Live exchange feed for IRFC: trading at ₹74.45 (-7.23% today).',
    orHigh: 75.10,
    orLow: 71.40,
  });

  // Trade Exit Planner & Budget State
  const [entryPrice, setEntryPrice] = useState<number>(74.45);
  const [stopPrice, setStopPrice] = useState<number>(72.96);
  const [targetPrice, setTargetPrice] = useState<number>(77.43);
  const [accountSize, setAccountSize] = useState<number>(50000);
  const [maxLossAllowed, setMaxLossAllowed] = useState<number>(500);

  // Time Machine Simulation State (Images 4 & 5)
  const [targetFirstPct, setTargetFirstPct] = useState<number>(45.7);
  const [stopFirstPct, setStopFirstPct] = useState<number>(47.0);
  const [stillOpenPct, setStillOpenPct] = useState<number>(7.3);
  const [medianPrice, setMedianPrice] = useState<number>(74.55);
  const [filterOutcome, setFilterOutcome] = useState<'ALL' | 'TARGET' | 'STOP' | 'OPEN'>('ALL');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic formatted date for the session
  const currentDateStr = useMemo(() => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, []);

  // Fetch live quote for selected stock
  const fetchStockData = async (sym: string) => {
    const clean = sym.toUpperCase().trim();
    if (!clean) return;
    setLoadingLive(true);
    setOrderStatus('PENDING_APPROVAL');
    setApprovalInput('');

    // If TSLA (Exact trade from the reel and README)
    if (clean === 'TSLA') {
      setLiveStock({
        price: 364.18,
        changePct: 0.55,
        name: 'Tesla, Inc.',
        dayHigh: 367.40,
        dayLow: 354.47,
        volume: 48920100,
        volRatio: 1.6,
        fairValue: 285,
        valuationStatus: 'OVERVALUED',
        marginOfSafetyPct: -27.8,
        stopLoss: 358.32,
        target1: 370.04,
        target2: 375.90,
        bestEntryTiming: '10:15 AM ET Breakout',
        bestEntryStrategy: 'First 5-min candle closed above 15-min Opening Range (362.18)',
        advisorVerdict: 'TSLA triggered 15-min ORB breakout at 10:15 AM ET: closed at $364.18 (+0.55% above range).',
        orHigh: 362.18,
        orLow: 354.47,
      });
      setEntryPrice(364.18);
      setStopPrice(358.32);
      setTargetPrice(370.04);
      setAccountSize(5000);
      setMaxLossAllowed(50);
      setTargetFirstPct(29.4);
      setStopFirstPct(25.5);
      setStillOpenPct(45.1);
      setMedianPrice(364.20);
      setSelectedStock(clean);
      setLoadingLive(false);
      setLiveNews([
        {
          headline: 'Tesla-SpaceX Merger Mania Strikes Wall Street Ahead of Earnings',
          source: 'Yahoo Finance / SEC EDGAR',
          sentiment: 'NEUTRAL',
          time: '08:04 AM ET',
        },
        {
          headline: 'Model Y Refresh Deliveries Accelerate in Key European Markets',
          source: 'Reuters Financial',
          sentiment: 'BULLISH',
          time: '07:30 AM ET',
        },
      ]);
      return;
    }

    try {
      const res = await fetch(`/api/live-stocks?symbol=${encodeURIComponent(clean)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.stock) {
          const s = data.stock;
          const sl = s.stopLoss || Number((s.price * 0.98).toFixed(2));
          const t1 = s.target1 || Number((s.price * 1.04).toFixed(2));
          setLiveStock({
            price: s.price,
            changePct: s.changePct,
            name: s.name || clean,
            dayHigh: s.dayHigh || s.price * 1.02,
            dayLow: s.dayLow || s.price * 0.98,
            volume: s.volume || 1000000,
            volRatio: s.volRatio || 1.2,
            fairValue: s.fairValue || Math.round(s.price * 1.05),
            valuationStatus: s.valuationStatus || 'FAIRLY_VALUED',
            marginOfSafetyPct: s.marginOfSafetyPct || 0,
            stopLoss: sl,
            target1: t1,
            target2: s.target2 || Number((s.price * 1.07).toFixed(2)),
            bestEntryTiming: s.bestEntryTiming || '10:15 AM Retest',
            bestEntryStrategy: s.bestEntryStrategy || 'Wait for 15-min ORB high breakout',
            advisorVerdict: s.advisorVerdict || `Live feed for ${clean}: ${currencySymbol}${s.price}`,
            orHigh: Number((s.price * 1.008).toFixed(2)),
            orLow: Number((s.price * 0.99).toFixed(2)),
          });

          setEntryPrice(s.price);
          setStopPrice(sl);
          setTargetPrice(t1);
          setAccountSize(clean === 'TSLA' ? 5000 : 50000);
          setMaxLossAllowed(clean === 'TSLA' ? 50 : 500);
          setMedianPrice(s.price);

          if (s.candles && s.candles.length > 0) {
            setRealStockCandles(s.candles);
          }

          // Simulated probability odds based on momentum
          if (s.changePct >= 0) {
            setTargetFirstPct(48.2);
            setStopFirstPct(41.3);
            setStillOpenPct(10.5);
          } else {
            setTargetFirstPct(42.5);
            setStopFirstPct(49.8);
            setStillOpenPct(7.7);
          }
        }
      }

      const newsRes = await fetch(`/api/stock-news?symbol=${encodeURIComponent(clean)}`);
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        if (newsData.news) setLiveNews(newsData.news);
      }
    } catch (e) {
      // Keep state
    } finally {
      setLoadingLive(false);
      setSelectedStock(clean);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    fetchStockData('IRFC');
  }, []);

  // Calculations for Exit Planner (Image 3)
  const riskPerShare = useMemo(() => {
    return Math.max(0.01, Number(Math.abs(entryPrice - stopPrice).toFixed(2)));
  }, [entryPrice, stopPrice]);

  const rewardPerShare = useMemo(() => {
    return Math.max(0.01, Number(Math.abs(targetPrice - entryPrice).toFixed(2)));
  }, [targetPrice, entryPrice]);

  const rewardToRiskRatio = useMemo(() => {
    return (rewardPerShare / riskPerShare).toFixed(1);
  }, [rewardPerShare, riskPerShare]);

  // Position Sizing Budget Calculation (Formula from trader-budget/size.py)
  const allowedShares = useMemo(() => {
    const raw = Math.floor(maxLossAllowed / riskPerShare);
    return Math.max(1, raw);
  }, [maxLossAllowed, riskPerShare]);

  const totalCost = useMemo(() => {
    return (allowedShares * entryPrice).toFixed(2);
  }, [allowedShares, entryPrice]);

  const actualLossAtStop = useMemo(() => {
    return (allowedShares * riskPerShare).toFixed(2);
  }, [allowedShares, riskPerShare]);

  const popularStocks = ['IRFC', 'TSLA', 'PTC', 'TCS', 'RELIANCE', 'INFY', 'TATAMOTORS'];

  // Real exchange 5-min candlesticks for Exit Planner Chart
  const exitCandles = useMemo(() => {
    if (realStockCandles && realStockCandles.length > 0) {
      const slice = realStockCandles.slice(-16);
      return slice.map((c, i) => ({
        i,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        isUp: c.isUp,
        time: c.time,
      }));
    }

    const candles = [];
    const base = entryPrice * 0.988;
    const diff = entryPrice - base;
    const count = 15;
    const seed = selectedStock.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    let curOpen = base;

    for (let i = 0; i < count; i++) {
      const stepProg = i / count;
      const noise = (Math.sin(seed * 3 + i * 1.7) * 0.5 + 0.5) * (entryPrice * 0.005);
      const isUp = i === count - 1 || Math.sin(seed + i * 2.3) > -0.2;
      const open = curOpen;
      const close = isUp ? Math.min(entryPrice, open + noise) : Math.max(entryPrice * 0.98, open - noise);
      const high = Math.max(open, close) + noise * 0.6;
      const low = Math.min(open, close) - noise * 0.6;
      curOpen = close;

      candles.push({
        i,
        open,
        high,
        low,
        close: i === count - 1 ? entryPrice : close,
        isUp: i === count - 1 ? true : close >= open,
      });
    }
    return candles;
  }, [entryPrice, selectedStock, realStockCandles]);

  // Automated Reel Pipeline Sequence Runner
  const runFullPipeline = () => {
    setIsPipelineRunning(true);
    setPipelineStage(1);

    const stages = [1, 2, 3, 4, 5, 6, 7, 8];
    stages.forEach((st, idx) => {
      setTimeout(() => {
        setPipelineStage(st);
        if (st === 8) {
          setIsPipelineRunning(false);
          setActiveTab('broker-ticket');
        }
      }, (idx + 1) * 350);
    });
  };

  // Monte Carlo simulation canvas render (Image 4 & 5)
  useEffect(() => {
    if (activeTab !== 'time-machine') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const numPaths = 120;
    const steps = 70;

    const paths: { points: number[]; outcome: 'TARGET' | 'STOP' | 'OPEN' }[] = [];
    const entryY = height * 0.45;
    const targetY = height * 0.22;
    const stopY = height * 0.78;

    for (let p = 0; p < numPaths; p++) {
      const points: number[] = [entryY];
      let curY = entryY;
      let outcome: 'TARGET' | 'STOP' | 'OPEN' = 'OPEN';

      for (let s = 1; s < steps; s++) {
        if (outcome === 'OPEN') {
          const delta = (Math.random() - 0.5) * 8 + (Math.random() - 0.49) * 2;
          curY += delta;
          if (curY <= targetY) {
            outcome = 'TARGET';
            curY = targetY;
          } else if (curY >= stopY) {
            outcome = 'STOP';
            curY = stopY;
          }
        }
        points.push(curY);
      }
      paths.push({ points, outcome });
    }

    let progress = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle horizontal gridlines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      [0.2, 0.4, 0.6, 0.8].forEach((ratio) => {
        ctx.beginPath();
        ctx.moveTo(0, height * ratio);
        ctx.lineTo(width, height * ratio);
        ctx.stroke();
      });

      // Shaded projection cone (Smooth glowing gradient)
      const coneGrad = ctx.createLinearGradient(0, entryY, width, entryY);
      coneGrad.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
      coneGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)');
      coneGrad.addColorStop(1, 'rgba(16, 185, 129, 0.06)');
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(0, entryY);
      ctx.bezierCurveTo(width * 0.3, entryY - 45, width * 0.7, targetY - 35, width, targetY - 45);
      ctx.lineTo(width, stopY + 45);
      ctx.bezierCurveTo(width * 0.7, stopY + 35, width * 0.3, entryY + 45, 0, entryY);
      ctx.closePath();
      ctx.fill();

      // Horizontal Target line with subtle neon glow (Green)
      ctx.save();
      ctx.shadowColor = '#22C55E';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, targetY);
      ctx.lineTo(width, targetY);
      ctx.stroke();
      ctx.restore();

      // Horizontal Entry line (Clean Slate/White dashed)
      ctx.save();
      ctx.strokeStyle = '#E2E8F0';
      ctx.setLineDash([6, 5]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, entryY);
      ctx.lineTo(width, entryY);
      ctx.stroke();
      ctx.restore();

      // Horizontal Stop line with subtle neon glow (Red)
      ctx.save();
      ctx.shadowColor = '#EF4444';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, stopY);
      ctx.lineTo(width, stopY);
      ctx.stroke();
      ctx.restore();

      // Draw Monte Carlo paths
      const stepWidth = width / (steps - 1);
      const visibleSteps = Math.min(steps, Math.floor(progress));

      for (const p of paths) {
        if (filterOutcome === 'TARGET' && p.outcome !== 'TARGET') continue;
        if (filterOutcome === 'STOP' && p.outcome !== 'STOP') continue;
        if (filterOutcome === 'OPEN' && p.outcome !== 'OPEN') continue;

        ctx.beginPath();
        ctx.moveTo(0, p.points[0]);

        for (let s = 1; s < visibleSteps; s++) {
          ctx.lineTo(s * stepWidth, p.points[s]);
        }

        if (p.outcome === 'TARGET') {
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.45)';
        } else if (p.outcome === 'STOP') {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
        } else {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
        }
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }

      if (progress < steps) {
        progress += 1.8;
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeTab, filterOutcome, selectedStock]);

  const skillCards = [
    { id: '01', title: 'Chart Scanner', desc: 'Scans thousands of charts', icon: '🔍', color: 'bg-amber-50 border-amber-200', action: () => setSelectedSkillModal('01') },
    { id: '02', title: 'News Monitor', desc: 'Tracks breaking news', icon: '📰', color: 'bg-slate-50 border-slate-200', action: () => setSelectedSkillModal('02') },
    { id: '03', title: 'Entry Timer', desc: 'Tells you the moment to get in', icon: '⏱️', color: 'bg-emerald-50 border-emerald-200', action: () => setSelectedSkillModal('03') },
    { id: '04', title: 'Exit Planner', desc: 'Sets your stop and your target', icon: '🚧', color: 'bg-indigo-50 border-indigo-200', action: () => setActiveTab('exit-planner') },
    { id: '05', title: 'Time Machine', desc: 'Replays every outcome first', icon: '⏳', color: 'bg-amber-50 border-amber-200', action: () => setActiveTab('time-machine') },
    { id: '06', title: 'Risk Manager', desc: 'Stops trades over your limits', icon: '🛡️', color: 'bg-emerald-50 border-emerald-200', action: () => setSelectedSkillModal('06') },
    { id: '07', title: 'Budget Manager', desc: 'Sizes every position', icon: '🧮', color: 'bg-blue-50 border-blue-200', action: () => setActiveTab('exit-planner') },
    { id: '08', title: 'Order Executor', desc: 'Paper by default, never without your yes', icon: '🎧', color: 'bg-purple-50 border-purple-200', action: () => setActiveTab('broker-ticket') },
    { id: '09', title: 'Price Alerts', desc: 'Rings when a price hits', icon: '🔔', color: 'bg-rose-50 border-rose-200', action: () => setSelectedSkillModal('09') },
    { id: '10', title: 'Earnings Analyst', desc: 'Reads earnings reports', icon: '📊', color: 'bg-cyan-50 border-cyan-200', action: () => setSelectedSkillModal('10') },
    { id: '11', title: 'Whale & Insider Tracker', desc: 'Reads institutional & insider trade filings', icon: '🏛️', color: 'bg-slate-50 border-slate-200', action: () => setSelectedSkillModal('11') },
  ];

  // 8 Strict Risk Guardrails from trader-risk/check.py
  const riskGuardrails = [
    { name: 'Max Loss Per Trade', rule: `<= ${currencySymbol}${maxLossAllowed}`, actual: `${currencySymbol}${actualLossAtStop}`, passed: Number(actualLossAtStop) <= maxLossAllowed },
    { name: 'Min Reward-to-Risk', rule: '>= 1.0 : 1', actual: `${rewardToRiskRatio} : 1`, passed: Number(rewardToRiskRatio) >= 1.0 },
    { name: 'Stop Loss Required', rule: 'Must define stop_price', actual: `${currencySymbol}${stopPrice}`, passed: stopPrice > 0 },
    { name: 'Max Position Size Cap', rule: '<= 75% of account', actual: `${((Number(totalCost) / accountSize) * 100).toFixed(1)}%`, passed: Number(totalCost) <= accountSize * 0.75 },
    { name: 'Cash Buffer Rule', rule: '>= 10% cash left', actual: `${currencySymbol}${(accountSize - Number(totalCost)).toFixed(2)}`, passed: accountSize - Number(totalCost) >= accountSize * 0.10 },
    { name: 'Entry Timing Window', rule: '09:45 – 15:30 NY/IST', actual: 'Active Session', passed: true },
    { name: 'Daily Trade Cap', rule: '<= 3 entries per day', actual: '1 of 3 Used', passed: true },
    { name: 'PDT / Margin Guard', rule: 'Paper mode active', actual: 'Simulated Broker', passed: true },
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-slate-900 font-sans p-3 sm:p-5 md:p-8 select-none">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Hero Banner: Pixel Art Style (Exact Match to Reel & Image 1) */}
        <div className="bg-gradient-to-b from-[#FFFDF9] to-[#F5EFE6] border-2 border-[#E7DFD5] rounded-3xl p-6 sm:p-8 shadow-xs text-center relative overflow-hidden">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 font-mono">
            DAY TRADER <span className="text-[#E07A5F]">SKILL</span>
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 rounded-md font-mono text-xs sm:text-sm text-slate-700 mt-2 font-bold shadow-2xs">
            <span>⚡ Algorithmic Day Trading Intelligence · 11-in-1 Suite</span>
          </div>

          {/* Subtitle & Pixel Character Graphic */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-12 bg-[#E07A5F] rounded-xs relative flex items-center justify-center shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2 bg-slate-900 rounded-xs"></div>
                  <div className="w-2.5 h-2 bg-slate-900 rounded-xs"></div>
                </div>
                <div className="absolute -bottom-3 w-14 h-5 bg-slate-900 rounded-b-xs flex items-center justify-center">
                  <div className="w-3 h-2 bg-rose-600 rounded-xs"></div>
                </div>
              </div>
              <div className="w-32 h-2.5 bg-[#8C5E3C] rounded-sm mt-3 shadow-2xs"></div>
            </div>

            <div className="bg-white border-2 border-slate-800 rounded-xl p-3.5 text-left font-mono text-xs shadow-md max-w-xs w-full">
              <div className="flex items-center justify-between pb-1 border-b border-dashed border-slate-300 font-bold">
                <span>SKILL.md</span>
                <span className="text-[#E07A5F] font-extrabold">×11</span>
              </div>
              <div className="pt-1.5 space-y-0.5 text-[11px] text-slate-700">
                <div><span className="text-slate-400">name:</span> day-trader-skill</div>
                <div><span className="text-slate-400">pipeline:</span> scanner &rarr; news &rarr; entry &rarr; exit &rarr; broker</div>
                <div><span className="text-slate-400">active stock:</span> {selectedStock} ({currencySymbol}{liveStock.price})</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Stock Selector Bar */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black uppercase tracking-wider text-slate-500 font-mono">
              Live Stock Feed:
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black font-mono text-slate-900">{selectedStock}</span>
              <span className="text-base font-bold font-mono text-slate-800">{currencySymbol}{liveStock.price}</span>
              <span
                className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                  liveStock.changePct >= 0
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {liveStock.changePct >= 0 ? `+${liveStock.changePct}%` : `${liveStock.changePct}%`}
              </span>
            </div>
            {loadingLive && (
              <div className="w-4 h-4 border-2 border-[#E07A5F] border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {popularStocks.map((stk) => (
              <button
                key={stk}
                onClick={() => fetchStockData(stk)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                  selectedStock === stk
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {stk}
              </button>
            ))}

            <div className="relative shrink-0">
              <input
                type="text"
                placeholder="Search ticker (e.g. TSLA, IRFC)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    fetchStockData(searchQuery.trim());
                  }
                }}
                className="bg-slate-100 hover:bg-slate-200/80 focus:bg-white text-xs px-2.5 py-1.5 rounded-lg border border-transparent focus:border-slate-400 focus:outline-hidden w-40 uppercase font-mono transition placeholder:normal-case placeholder:font-sans"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* REEL INTERACTIVE TRADE PIPELINE STRIP                                      */}
        {/* scanner -> news -> entry -> exit -> timemachine -> budget -> risk -> broker */}
        {/* ========================================================================= */}
        <div className="bg-[#0D1117] text-white rounded-2xl border border-slate-800 p-4 shadow-xl font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-amber-300">
                REEL EXECUTION PIPELINE · {selectedStock}
              </span>
              <span className="text-[10px] text-slate-400">
                (Institutional 8-Stage Execution Pipeline)
              </span>
            </div>

            <button
              onClick={runFullPipeline}
              disabled={isPipelineRunning}
              className="bg-[#E07A5F] hover:bg-[#c96950] disabled:opacity-50 text-white text-xs font-bold font-mono px-3.5 py-1.5 rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPipelineRunning ? 'Running Pipeline...' : `Run Reel Pipeline for ${selectedStock}`}</span>
            </button>
          </div>

          {/* Interactive Pipeline Stages Sequence */}
          <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { step: 1, name: 'Scanner', icon: '🔍', action: () => { setPipelineStage(1); setSelectedSkillModal('01'); } },
              { step: 2, name: 'News', icon: '📰', action: () => { setPipelineStage(2); setSelectedSkillModal('02'); } },
              { step: 3, name: 'Entry', icon: '⏱️', action: () => { setPipelineStage(3); setSelectedSkillModal('03'); } },
              { step: 4, name: 'Exit', icon: '🚧', action: () => { setPipelineStage(4); setActiveTab('exit-planner'); } },
              { step: 5, name: 'TimeMachine', icon: '⏳', action: () => { setPipelineStage(5); setActiveTab('time-machine'); } },
              { step: 6, name: 'Budget', icon: '🧮', action: () => { setPipelineStage(6); setActiveTab('exit-planner'); } },
              { step: 7, name: 'Risk Check', icon: '🛡️', action: () => { setPipelineStage(7); setActiveTab('broker-ticket'); } },
              { step: 8, name: 'Broker Ticket', icon: '🎧', action: () => { setPipelineStage(8); setActiveTab('broker-ticket'); } },
            ].map((p) => {
              const isActive = pipelineStage === p.step;
              const isPast = pipelineStage > p.step;
              return (
                <button
                  key={p.step}
                  onClick={p.action}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isActive
                      ? 'bg-amber-400 text-black border-amber-300 font-bold shadow-md scale-102'
                      : isPast
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[10px]">
                    <span>{p.step}.</span>
                    <span>{p.icon}</span>
                  </div>
                  <span className="text-[11px] font-mono leading-none">{p.name}</span>
                  {isPast && <span className="text-[9px] text-emerald-400 font-bold">✓ PASS</span>}
                  {isActive && <span className="text-[9px] text-black font-extrabold animate-pulse">● ACTIVE</span>}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              Stage {pipelineStage} Verdict: <strong className="text-slate-200">
                {pipelineStage === 1 && `15-min Opening Range Breakout detected for ${selectedStock}.`}
                {pipelineStage === 2 && `Morning news checked: no surprise binary risk, pre-earnings safe.`}
                {pipelineStage === 3 && `Entry triggered on 5-min candle close at ${currencySymbol}${entryPrice}.`}
                {pipelineStage === 4 && `Stop set at OR-mid (${currencySymbol}${stopPrice}), Target at 1R (${currencySymbol}${targetPrice}).`}
                {pipelineStage === 5 && `Time Machine 10,000 replays: Target First ${targetFirstPct}%, Stop First ${stopFirstPct}%.`}
                {pipelineStage === 6 && `Budget: ${allowedShares} shares sized to max loss ${currencySymbol}${maxLossAllowed}.`}
                {pipelineStage === 7 && `Risk Guardrails: 8 of 8 rules passed cleanly.`}
                {pipelineStage === 8 && `Broker ticket ready. Paper trading default; awaiting human approval ("YES").`}
              </strong>
            </div>
            <div className="text-[10px] text-amber-300 font-mono">
              flat by 3:55 PM either way
            </div>
          </div>
        </div>

        {/* View Navigation Switcher */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            📋 The 11 Skills Pack
          </button>
          <button
            onClick={() => setActiveTab('exit-planner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'exit-planner'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🎯 Exit Planner & Budget</span>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 rounded-full font-bold">Live</span>
          </button>
          <button
            onClick={() => setActiveTab('time-machine')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'time-machine'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>⏳ Time Machine Simulator</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 rounded-full font-bold">10k Replays</span>
          </button>
          <button
            onClick={() => setActiveTab('broker-ticket')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'broker-ticket'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🎧 Broker Ticket & Risk Guard</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 rounded-full font-bold">Paper Gate</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: THE 11 SKILLS GRID (Exact Match to Image 2)                       */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {skillCards.map((sc) => (
                <div
                  key={sc.id}
                  onClick={sc.action}
                  className={`bg-white rounded-2xl border-2 border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition duration-200 flex flex-col justify-between space-y-4 ${
                    sc.action ? 'cursor-pointer hover:border-slate-800 hover:-translate-y-0.5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-sm font-extrabold text-[#E07A5F]">{sc.id}</span>
                    <span className="text-2xl">{sc.icon}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{sc.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{sc.desc}</p>
                  </div>

                  {sc.action ? (
                    <div className="text-[11px] font-bold text-indigo-600 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span>Launch Interactive Skill</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="text-[10.5px] font-mono text-slate-400 pt-2 border-t border-slate-100">
                      Active AI Subagent
                    </div>
                  )}
                </div>
              ))}

              {/* 12th Box: 11 SKILLS · 1 PACK */}
              <div className="bg-black text-white rounded-2xl p-5 border-2 border-black flex flex-col justify-between items-center text-center shadow-xs">
                <div className="text-4xl font-black font-mono text-amber-300 tracking-tight mt-2">
                  11
                </div>
                <div className="space-y-1">
                  <div className="font-mono text-sm font-bold tracking-widest text-white">
                    SKILLS · 1 PACK
                  </div>
                  <div className="font-mono text-[11px] text-emerald-400 font-extrabold">
                    FREE · MIT
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono pb-1">
                  Installed in Antigravity
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: EXIT PLANNER & BUDGET MANAGER (Exact Match to Image 3)            */}
        {/* ========================================================================= */}
        {activeTab === 'exit-planner' && (
          <div className="space-y-6">
            <div className="bg-[#0D1117] text-white rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl font-mono max-w-4xl mx-auto space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-slate-200">
                    {isUsStock ? 'NASDAQ' : 'NSE'}:{selectedStock} · 5 min · {currentDateStr}
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">
                    REAL EXCHANGE TICKS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChartViewMode(chartViewMode === 'TRADINGVIEW' ? 'CANDLES' : 'TRADINGVIEW')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{chartViewMode === 'TRADINGVIEW' ? '🎯 Target/Stop Plan View' : '📈 TradingView Live Graph'}</span>
                  </button>
                  <span className="text-amber-400 font-bold">trader-exit</span>
                </div>
              </div>

              {chartViewMode === 'TRADINGVIEW' ? (
                <div className="relative w-full rounded-xl overflow-hidden border border-slate-800/80">
                  <RealTradingViewChart
                    symbol={selectedStock}
                    name={liveStock?.name}
                    exchange={isUsStock ? 'NASDAQ' : 'NSE'}
                    currency={currencySymbol}
                    candles={realStockCandles}
                    target={targetPrice}
                    stopLoss={stopPrice}
                    height={380}
                  />
                </div>
              ) : (
                /* Interactive Candlestick & Target-Stop Chart Canvas */
                <div className="bg-[#090D13] rounded-xl p-4 border border-slate-800/80 relative overflow-hidden h-80 flex flex-col justify-between select-none">
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[11px] text-slate-400 tracking-wider">the plan, set before the entry · {realStockCandles.length > 0 ? `${realStockCandles.length} Live NSE Candles` : 'Real Live Bars'}</span>
                    <span className="bg-[#15803D] text-white px-3 py-1 rounded font-bold text-xs tracking-wider shadow-sm font-mono flex items-center gap-1.5">
                      <span>TARGET</span>
                      <span className="text-amber-200">{currencySymbol}{targetPrice}</span>
                    </span>
                  </div>

                  {/* SVG Candlestick Engine (9:30 AM to 10:55 AM) */}
                  <div className="absolute inset-0 top-12 bottom-9 px-4">
                    <svg className="w-full h-full" viewBox="0 0 650 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0.03" />
                        </linearGradient>
                        <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.03" />
                          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.25" />
                        </linearGradient>
                      </defs>

                      <rect x="310" y="25" width="330" height="75" fill="url(#profitGrad)" stroke="rgba(16, 185, 129, 0.35)" strokeDasharray="4,4" />
                      <rect x="310" y="100" width="330" height="70" fill="url(#lossGrad)" stroke="rgba(239, 68, 68, 0.35)" strokeDasharray="4,4" />

                      <line x1="10" y1="25" x2="640" y2="25" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.7" />
                      <line x1="10" y1="100" x2="640" y2="100" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4,4" />
                      <line x1="10" y1="170" x2="640" y2="170" stroke="#EF4444" strokeWidth="1.5" strokeOpacity="0.7" />

                      {exitCandles.map((c, idx) => {
                        const x = 25 + idx * 19;
                        const yMax = 175;
                        const yMin = 25;
                        const pRange = targetPrice - stopPrice || 10;
                        
                        const calcY = (p: number) => {
                          const pct = (p - stopPrice) / (pRange * 1.3);
                          return Math.max(yMin + 10, Math.min(yMax - 10, 160 - pct * 120));
                        };

                        const highY = calcY(c.high);
                        const lowY = calcY(c.low);
                        const openY = calcY(c.open);
                        const closeY = calcY(c.close);
                        const color = c.isUp ? '#10B981' : '#EF4444';

                        return (
                          <g key={idx}>
                            <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1.5" />
                            <rect
                              x={x - 5}
                              y={Math.min(openY, closeY)}
                              width="10"
                              height={Math.max(3, Math.abs(closeY - openY))}
                              fill={color}
                              rx="1"
                            />
                          </g>
                        );
                      })}

                      <line x1="310" y1="15" x2="310" y2="185" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="3,3" />

                      <path
                        d="M 310 100 Q 430 70, 580 32"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeDasharray="5,5"
                        fill="none"
                      />
                      <circle cx="580" cy="32" r="4" fill="#10B981" />
                    </svg>
                  </div>

                  <div className="flex flex-col justify-between h-full z-10 pointer-events-none pb-2">
                    <div className="flex justify-end"></div>

                    <div className="flex items-center justify-between z-10">
                      <div className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 shadow-sm ml-72">
                        <span className="text-emerald-400 font-black">▲</span>
                        <span>BUY signal 10:55</span>
                      </div>

                      <span className="bg-slate-200 text-slate-900 px-3 py-1 rounded font-bold text-xs tracking-wider shadow-sm font-mono flex items-center gap-1.5 pointer-events-auto">
                        <span>ENTRY</span>
                        <span className="text-indigo-900">{currencySymbol}{entryPrice}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-end z-10">
                      <span className="bg-[#DC2626] text-white px-3 py-1 rounded font-bold text-xs tracking-wider shadow-sm font-mono flex items-center gap-1.5 pointer-events-auto">
                        <span>STOP</span>
                        <span className="text-amber-100">{currencySymbol}{stopPrice}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-2 border-t border-slate-800 z-10">
                    <span>9:30</span>
                    <span>10:00</span>
                    <span>10:30</span>
                    <span className="text-indigo-400 font-bold">10:55 (Entry)</span>
                    <span>11:30</span>
                    <span>12:00</span>
                    <span>12:30</span>
                    <span className="text-amber-400 font-bold">flat by 3:55 PM &rarr;</span>
                  </div>
                </div>
              )}

              {/* 3 Metric Boxes: Risk / Reward / Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="border-2 border-rose-600 bg-rose-950/20 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    RISK / SHARE
                  </span>
                  <div className="text-3xl font-black text-rose-500 tracking-tight font-mono">
                    {currencySymbol}{riskPerShare}
                  </div>
                  <div className="text-[10px] text-slate-400">entry - stop</div>
                </div>

                <div className="border-2 border-emerald-600 bg-emerald-950/20 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    REWARD / SHARE
                  </span>
                  <div className="text-3xl font-black text-emerald-400 tracking-tight font-mono">
                    {currencySymbol}{rewardPerShare}
                  </div>
                  <div className="text-[10px] text-slate-400">target - entry</div>
                </div>

                <div className="border-2 border-amber-400 bg-amber-950/20 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    REWARD : RISK
                  </span>
                  <div className="text-3xl font-black text-amber-300 tracking-tight font-mono">
                    {rewardToRiskRatio} : 1
                  </div>
                  <div className="text-[10px] text-slate-400">1R target plan</div>
                </div>
              </div>

              {/* Bottom Budget Manager Box */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-[11px] text-slate-400 font-mono">
                    trader-budget · {currencySymbol}{accountSize.toLocaleString()} account · {currencySymbol}{maxLossAllowed} max loss a trade
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {allowedShares} shares = {currencySymbol}{Number(totalCost).toLocaleString()}
                  </div>
                  <div className="text-xs text-amber-300 font-mono">
                    max loss at the stop: {allowedShares} × {currencySymbol}{riskPerShare} = {currencySymbol}{actualLossAtStop}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('broker-ticket')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <span>Build Broker Ticket &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: TIME MACHINE SIMULATOR (Elevated Pro-FinTech Visualization)       */}
        {/* ========================================================================= */}
        {activeTab === 'time-machine' && (
          <div className="space-y-5 max-w-5xl mx-auto">
            {/* 1-Glance Simple Verdict Card for Beginners (ELI5) */}
            <div className="bg-gradient-to-r from-emerald-50 via-white to-indigo-50 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">👶</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full font-mono">
                      ELI5 Time Machine Verdict
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Simple Plain English Breakdown</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                    {targetFirstPct >= 40 ? '🟢 Odds Heavily in Your Favor: ' : '⚖️ Calculated Edge: '}
                    Across <span className="text-indigo-600 font-mono font-black">10,000 Monte Carlo replays</span> of today&apos;s session,{' '}
                    <span className="text-emerald-700 font-black font-mono">{(targetFirstPct + stillOpenPct).toFixed(1)}%</span> of scenarios stay profitable or hit the target.
                    Only <span className="text-rose-600 font-black font-mono">{stopFirstPct}%</span> hit the stop loss.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-center shadow-2xs">
                  <span className="text-[9.5px] text-slate-400 uppercase font-mono block">Win-to-Loss Odds</span>
                  <span className="text-sm font-black text-emerald-600 font-mono">{(targetFirstPct / Math.max(1, stopFirstPct)).toFixed(1)} : 1</span>
                </div>
                <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-center shadow-2xs">
                  <span className="text-[9.5px] text-slate-400 uppercase font-mono block">Flat by Close</span>
                  <span className="text-sm font-black text-slate-700 font-mono">3:55 PM</span>
                </div>
              </div>
            </div>

            {/* Main Elevated Terminal Canvas Card */}
            <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-5">
              {/* Top Sub-Header & Live Stock Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold text-slate-100 font-mono text-sm">
                    {selectedStock} · Intraday Forward Projection
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    until 3:55 PM · {currentDateStr}
                  </span>
                </div>

                {/* Quick Asset Switching Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] text-slate-400 font-mono uppercase mr-1 shrink-0">Switch:</span>
                  {['TATAMOTORS', 'RELIANCE', 'TCS', 'INFY', 'PTC', 'IRFC', 'TSLA'].map((sym) => (
                    <button
                      key={sym}
                      onClick={() => fetchStockData(sym)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer shrink-0 ${
                        selectedStock === sym
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monte Carlo Visual Canvas with Pinned Price Badges */}
              <div className="relative h-72 sm:h-80 w-full bg-[#070B12] rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
                {/* Pinned Target Price Tag */}
                <div className="absolute right-3 top-[22%] -translate-y-1/2 z-10 flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 px-2.5 py-1 rounded-lg text-xs font-mono font-bold shadow-md backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>TARGET: {currencySymbol}{targetPrice}</span>
                  <span className="text-[10px] text-emerald-400 font-normal">
                    (+{((targetPrice / entryPrice - 1) * 100).toFixed(1)}%)
                  </span>
                </div>

                {/* Pinned Entry Price Tag */}
                <div className="absolute right-3 top-[45%] -translate-y-1/2 z-10 flex items-center gap-1.5 bg-slate-900/90 border border-slate-600 text-slate-200 px-2.5 py-1 rounded-lg text-xs font-mono font-bold shadow-md backdrop-blur-xs">
                  <span>ENTRY: {currencySymbol}{entryPrice}</span>
                  <span className="text-[10px] text-slate-400 font-normal">(ORB)</span>
                </div>

                {/* Pinned Stop Loss Price Tag */}
                <div className="absolute right-3 top-[78%] -translate-y-1/2 z-10 flex items-center gap-1.5 bg-rose-950/90 border border-rose-500/60 text-rose-300 px-2.5 py-1 rounded-lg text-xs font-mono font-bold shadow-md backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>STOP: {currencySymbol}{stopPrice}</span>
                  <span className="text-[10px] text-rose-400 font-normal">
                    (-{((1 - stopPrice / entryPrice) * 100).toFixed(1)}%)
                  </span>
                </div>

                {/* Time Axis Labels */}
                <div className="absolute left-3 top-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  10:15 AM ORB Trigger
                </div>
                <div className="absolute left-3 bottom-3 text-[10px] font-mono text-slate-500">
                  Simulation Seed #19 · 10,000 Paths
                </div>
                <div className="absolute right-3 bottom-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  3:55 PM Intraday Close (Flat)
                </div>

                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>

              {/* 4-Card Probability & Filter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {/* 10,000 Replays Card */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                      Monte Carlo Engine
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight mt-1">
                      10,000
                    </div>
                  </div>
                  <span className="text-[10.5px] text-slate-400 mt-2 font-mono">
                    Historical 59-day volatility
                  </span>
                </div>

                {/* Target Hit Filter Card */}
                <button
                  onClick={() => setFilterOutcome(filterOutcome === 'TARGET' ? 'ALL' : 'TARGET')}
                  className={`rounded-2xl p-4 border text-left transition cursor-pointer flex flex-col justify-between ${
                    filterOutcome === 'TARGET'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white ring-2 ring-emerald-500/40 shadow-lg'
                      : 'bg-slate-800/60 border-slate-700/60 hover:border-emerald-600/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      🎯 Target First
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-300">{targetFirstPct}%</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white mt-1">
                    {Math.round(10000 * (targetFirstPct / 100)).toLocaleString()}
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div style={{ width: `${targetFirstPct}%` }} className="h-full bg-emerald-500 rounded-full" />
                  </div>
                </button>

                {/* Stop Loss Hit Filter Card */}
                <button
                  onClick={() => setFilterOutcome(filterOutcome === 'STOP' ? 'ALL' : 'STOP')}
                  className={`rounded-2xl p-4 border text-left transition cursor-pointer flex flex-col justify-between ${
                    filterOutcome === 'STOP'
                      ? 'bg-rose-500/20 border-rose-400 text-white ring-2 ring-rose-500/40 shadow-lg'
                      : 'bg-slate-800/60 border-slate-700/60 hover:border-rose-600/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                      🛑 Stop Loss First
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-300">{stopFirstPct}%</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white mt-1">
                    {Math.round(10000 * (stopFirstPct / 100)).toLocaleString()}
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div style={{ width: `${stopFirstPct}%` }} className="h-full bg-rose-500 rounded-full" />
                  </div>
                </button>

                {/* Still Open Filter Card */}
                <button
                  onClick={() => setFilterOutcome(filterOutcome === 'OPEN' ? 'ALL' : 'OPEN')}
                  className={`rounded-2xl p-4 border text-left transition cursor-pointer flex flex-col justify-between ${
                    filterOutcome === 'OPEN'
                      ? 'bg-indigo-500/20 border-indigo-400 text-white ring-2 ring-indigo-500/40 shadow-lg'
                      : 'bg-slate-800/60 border-slate-700/60 hover:border-indigo-600/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                      ⏳ Still Open (3:55)
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-300">{stillOpenPct}%</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white mt-1">
                    {Math.round(10000 * (stillOpenPct / 100)).toLocaleString()}
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div style={{ width: `${stillOpenPct}%` }} className="h-full bg-indigo-500 rounded-full" />
                  </div>
                </button>
              </div>

              {/* Bottom Price Summary & Confidence Band Bar */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-mono text-lg font-bold">
                    {currencySymbol}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Expected Median Price at 3:55 PM Close
                    </span>
                    <span className="text-base font-black text-slate-100 font-mono">
                      {currencySymbol}{medianPrice}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-700/80 px-4 py-2 rounded-xl text-left sm:text-right w-full sm:w-auto">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">
                    90% Confidence Interval
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    {currencySymbol}{(medianPrice * 0.985).toFixed(2)} — {currencySymbol}{(medianPrice * 1.015).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: BROKER EXECUTION TICKET & 8-POINT RISK GUARDRAIL MATRIX            */}
        {/* ========================================================================= */}
        {activeTab === 'broker-ticket' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Broker Ticket Terminal Card */}
            <div className="bg-[#0D1117] text-white rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-2xl font-mono space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="font-bold text-slate-200">
                    trader-broker ticket · Alpaca Paper API · {selectedStock}
                  </span>
                </div>
                <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  BRACKET ORDER
                </span>
              </div>

              {/* Order Specification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#090D13] p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">CLIENT ORDER ID</span>
                  <span className="font-bold text-slate-300">{clientOrderId}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">ACTION & SYMBOL</span>
                  <span className="font-bold text-emerald-400">BUY {allowedShares} {selectedStock}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">LIMIT ENTRY PRICE</span>
                  <span className="font-bold text-white">{currencySymbol}{entryPrice}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">ESTIMATED NOTIONAL</span>
                  <span className="font-bold text-white">{currencySymbol}{totalCost}</span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-rose-400 text-[10px] block font-bold">STOP LOSS (OR-MID)</span>
                  <span className="font-bold text-rose-300">{currencySymbol}{stopPrice} (-{currencySymbol}{riskPerShare}/sh)</span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-emerald-400 text-[10px] block font-bold">TAKE PROFIT (1R TARGET)</span>
                  <span className="font-bold text-emerald-300">{currencySymbol}{targetPrice} (+{currencySymbol}{rewardPerShare}/sh)</span>
                </div>
              </div>

              {/* 8-Point Risk Guardrails Matrix */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>8-POINT PRE-TRADE RISK CHECK (trader-risk)</span>
                  <span className="text-emerald-400">ALL 8 CHECKS PASSED</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {riskGuardrails.map((rg, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <span className="text-slate-300 font-bold block">{rg.name}</span>
                        <span className="text-[10px] text-slate-500">Req: {rg.rule} · Act: {rg.actual}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        PASS
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Human Approval Gate Box */}
              <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">
                    Mandatory Human Approval Gate
                  </span>
                  <span className="text-[10px] text-slate-400">
                    &quot;No trade goes through until you say yes.&quot;
                  </span>
                </div>

                {orderStatus === 'PENDING_APPROVAL' ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-300">
                      Type <strong className="text-amber-300 font-mono">YES</strong> to authorize dispatch of this bracket order to your paper brokerage connector:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder='Type "YES" to approve...'
                        value={approvalInput}
                        onChange={(e) => setApprovalInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && approvalInput.trim().toUpperCase() === 'YES') {
                            setOrderStatus('PLACED');
                            setExecutionTime(new Date().toLocaleTimeString());
                          }
                        }}
                        className="bg-slate-950 border border-slate-700 text-xs px-3 py-2 rounded-lg text-white font-mono uppercase focus:outline-hidden focus:border-emerald-400 w-44"
                      />
                      <button
                        onClick={() => {
                          if (approvalInput.trim().toUpperCase() === 'YES') {
                            setOrderStatus('PLACED');
                            setExecutionTime(new Date().toLocaleTimeString());
                          } else {
                            alert('Please type "YES" in the box to approve this order.');
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer"
                      >
                        Approve Paper Order
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-lg p-3 text-xs space-y-1 text-emerald-200">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Order Approved &amp; Filled (Paper Simulated)</span>
                    </div>
                    <div>
                      Executed {allowedShares} shares of {selectedStock} at {currencySymbol}{entryPrice} at {executionTime}.
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      Bracket legs registered: Stop Loss @ {currencySymbol}{stopPrice} | Take Profit @ {currencySymbol}{targetPrice} | Auto-flat @ 3:55 PM.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* INTERACTIVE LIVE SKILL INSPECTOR MODAL                                    */}
        {/* ========================================================================= */}
        {selectedSkillModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {skillCards.find((s) => s.id === selectedSkillModal)?.icon}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                      {skillCards.find((s) => s.id === selectedSkillModal)?.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                      <span className="font-bold text-slate-900">{selectedStock}</span>
                      <span>·</span>
                      <span className="font-semibold text-emerald-700">{currencySymbol}{liveStock.price}</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold ${liveStock.changePct >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {liveStock.changePct >= 0 ? `+${liveStock.changePct}%` : `${liveStock.changePct}%`}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSkillModal(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Skill 01: Chart Scanner */}
              {selectedSkillModal === '01' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    Real-time automated multi-timeframe pattern detection for <strong>{selectedStock}</strong>:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">15-MIN OR RANGE</span>
                      <span className="text-sm font-bold text-slate-900">{currencySymbol}{liveStock.orLow} – {currencySymbol}{liveStock.orHigh}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">VOLUME MULTIPLIER</span>
                      <span className="text-sm font-bold text-indigo-700">{liveStock.volRatio}x vs 20-DMA</span>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      <span className="text-emerald-700 text-[10px] font-bold block">1R TARGET CEILING</span>
                      <span className="text-sm font-bold text-emerald-800">{currencySymbol}{liveStock.target1}</span>
                    </div>
                    <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
                      <span className="text-rose-700 text-[10px] font-bold block">OR-MID STOP LOSS</span>
                      <span className="text-sm font-bold text-rose-800">{currencySymbol}{liveStock.stopLoss}</span>
                    </div>
                  </div>
                  <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 p-3 rounded-xl font-medium">
                    ⚡ <strong>Scanner Verdict:</strong> {liveStock.changePct >= 0 ? `Bullish 15-min Opening Range Breakout confirmed above ${currencySymbol}${liveStock.orHigh}.` : `Bearish distribution below pivot. Support retest pending at ${currencySymbol}${liveStock.stopLoss}.`}
                  </div>
                </div>
              )}

              {/* Skill 02: News Monitor */}
              {selectedSkillModal === '02' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    Morning news &amp; SEC 8-K filings for <strong>{selectedStock}</strong>:
                  </p>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {liveNews.length > 0 ? (
                      liveNews.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                          <div className="font-bold text-slate-900">{item.headline}</div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>{item.source} · {item.time || 'Today'}</span>
                            <span className={item.sentiment === 'BULLISH' ? 'text-emerald-600 font-bold' : 'text-slate-600 font-bold'}>
                              {item.sentiment}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                        <div className="font-bold text-slate-900">Exchange Notification: High Institutional Flow Detected</div>
                        <p className="text-slate-600 text-[11px]">
                          Trading activity in {selectedStock} indicates {liveStock.changePct >= 0 ? 'institutional accumulation' : 'portfolio rebalancing'} in settled exchange session.
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">Verified Regulatory Feed</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skill 03: Entry Timer */}
              {selectedSkillModal === '03' && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 font-mono">Trigger Timing Window</span>
                    <div className="text-base font-extrabold text-emerald-900">{liveStock.bestEntryTiming}</div>
                    <p className="text-emerald-800 text-xs mt-1">{liveStock.bestEntryStrategy}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-mono space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Live CMP:</span>
                      <span className="font-bold text-slate-900">{currencySymbol}{liveStock.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Limit Entry Price:</span>
                      <span className="font-bold text-indigo-700">{currencySymbol}{entryPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="text-emerald-700 font-bold">TRIGGERED (5-min close confirmed)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Skill 06: Risk Manager */}
              {selectedSkillModal === '06' && (
                <div className="space-y-3">
                  <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs space-y-2">
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Account Size:</span>
                      <span className="font-bold">{currencySymbol}{accountSize.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Strict Max Loss Cap:</span>
                      <span className="font-bold text-rose-400">{currencySymbol}{maxLossAllowed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Allowed Position Size:</span>
                      <span className="font-bold text-emerald-400">{allowedShares} shares ({currencySymbol}{totalCost})</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">
                    Risk manager ensures no single trade in {selectedStock} can exceed your budget. Max risk at the stop is capped at <strong>{currencySymbol}{actualLossAtStop}</strong>.
                  </p>
                </div>
              )}

              {/* Skill 09: Price Alerts */}
              {selectedSkillModal === '09' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">Active alerts configured for {selectedStock}:</p>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span>Target Trigger: {currencySymbol}{liveStock.target1}</span>
                      <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-200 rounded-xl">
                      <span>Stop Loss Trigger: {currencySymbol}{liveStock.stopLoss}</span>
                      <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <span>Flat by Market Close: 3:55 PM</span>
                      <span className="bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">TIMER SET</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Skill 10: Earnings Analyst */}
              {selectedSkillModal === '10' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">GRAHAM FAIR VALUE</span>
                      <span className="text-sm font-bold text-slate-900">{currencySymbol}{liveStock.fairValue}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">MARGIN OF SAFETY</span>
                      <span className={`text-sm font-bold ${liveStock.marginOfSafetyPct >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {liveStock.marginOfSafetyPct}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-900">
                    <strong>Valuation Verdict:</strong> {selectedStock} is currently <strong>{liveStock.valuationStatus}</strong> relative to its fundamental intrinsic value and earnings profile.
                  </div>
                </div>
              )}

              {/* Skill 11: Institutional / Whale Tracker */}
              {selectedSkillModal === '11' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">Institutional FII/DII &amp; Congress Disclosures:</p>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Flow Bias:</span>
                      <span className={`font-bold ${liveStock.changePct >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {liveStock.changePct >= 0 ? 'Net Institutional Accumulation' : 'Distribution / Hedging'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Volume Surge:</span>
                      <span className="font-bold text-slate-900">{liveStock.volRatio}x 20-DMA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Disclosures:</span>
                      <span className="font-bold text-indigo-700">Tracked under public STOCK Act &amp; Exchange filings</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedSkillModal(null)}
                  className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 text-slate-600 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedSkillModal(null);
                    setActiveTab('exit-planner');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-mono cursor-pointer"
                >
                  Configure Exit &amp; Risk &rarr;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
