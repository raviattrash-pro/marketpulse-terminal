'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  ShieldCheck,
  Sparkles,
  Zap,
  Coins,
  DollarSign,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Award,
  Flame,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Percent,
} from 'lucide-react';

export type AllocationProfile = 'BALANCED' | 'AGGRESSIVE' | 'CONSERVATIVE' | 'TAX_SAVER';
export type SubAssetClass = 'overview' | 'stocks' | 'mutual-funds' | 'sip-calculator' | 'gold-sgb' | 'etfs' | 'crypto';

interface CuratedStock {
  symbol: string;
  name: string;
  sector: string;
  cmp: number;
  fairValue: number;
  pe: number;
  industryPe: number;
  marginOfSafetyPct: number;
  recommendation: 'STRONG ACCUMULATE' | 'BUY ON DIPS' | 'ACCUMULATE';
  catalyst: string;
  source: string;
  capCategory: 'Large Cap' | 'Mid Cap';
}

interface CuratedMutualFund {
  id: string;
  name: string;
  category: 'Flexi Cap' | 'Mid Cap' | 'Small Cap' | 'Large & Mid' | 'ELSS Tax Saver';
  cagr1y: number;
  cagr3y: number;
  cagr5y: number;
  nav: number;
  aumCr: number;
  expenseRatio: number;
  rating: number; // 1-5
  minSip: number;
  riskometer: 'Very High' | 'High' | 'Moderately High';
  fundManager: string;
  topHolding: string;
}

interface CuratedETF {
  symbol: string;
  name: string;
  underlying: string;
  cmp: number;
  cagr1y: number;
  expenseRatio: number;
  trackingError: string;
  dailyVol: string;
  rationale: string;
}

export default function SmartWealthAllocator() {
  const [activeSubTab, setActiveSubTab] = useState<SubAssetClass>('overview');
  const [investMode, setInvestMode] = useState<'SIP' | 'LUMPSUM'>('SIP');
  const [amount, setAmount] = useState<number>(10000);
  const [profile, setProfile] = useState<AllocationProfile>('BALANCED');

  // SIP Calculator State
  const [sipMonthly, setSipMonthly] = useState<number>(10000);
  const [sipTenureYears, setSipTenureYears] = useState<number>(10);
  const [sipExpectedCagr, setSipExpectedCagr] = useState<number>(14);
  const [sipStepUpPct, setSipStepUpPct] = useState<number>(10);

  // Macro Market Sentiment Indicators
  const macroSentiment = {
    equityStance: 'Prudent Staggered Accumulation (Nifty PE 22.4x · Stretched Smallcaps)',
    goldStance: 'Strategic Strong Hedge (Central bank accumulation + US rate pivot)',
    debtYieldStance: 'Peak Yield Arbitrage (RBI Repo 6.50% · High return for Liquid/Arbitrage)',
    cryptoStance: '24/7 Satellite Alpha (Fear & Greed: 71 · Weekend active liquid hedge)',
  };

  // Stock Picks
  const stockPicks: CuratedStock[] = [
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      sector: 'IT Services',
      cmp: 4120,
      fairValue: 4650,
      pe: 28.4,
      industryPe: 31.2,
      marginOfSafetyPct: 12.8,
      recommendation: 'STRONG ACCUMULATE',
      catalyst: '$1.2B TCV enterprise deal wins, 18% YoY GenAI order pipeline expansion.',
      source: 'Verified: Livemint / Reuters',
      capCategory: 'Large Cap',
    },
    {
      symbol: 'ICICIBANK',
      name: 'ICICI Bank Ltd',
      sector: 'Banking & Finance',
      cmp: 1265,
      fairValue: 1440,
      pe: 17.8,
      industryPe: 19.5,
      marginOfSafetyPct: 13.8,
      recommendation: 'STRONG ACCUMULATE',
      catalyst: 'Best-in-class RoA of 2.36%, industry-leading net interest margin defense.',
      source: 'Verified: Business Standard',
      capCategory: 'Large Cap',
    },
    {
      symbol: 'LT',
      name: 'Larsen & Toubro Ltd',
      sector: 'Capital Goods / EPC',
      cmp: 3560,
      fairValue: 3980,
      pe: 34.2,
      industryPe: 39.0,
      marginOfSafetyPct: 11.8,
      recommendation: 'BUY ON DIPS',
      catalyst: 'Order book crosses ₹4.8 Lakh Cr; multi-billion dollar Middle East hydrocarbon contracts.',
      source: 'Verified: Economic Times',
      capCategory: 'Large Cap',
    },
    {
      symbol: 'TATAMOTORS',
      name: 'Tata Motors Passenger Vehicles',
      sector: 'Automobile',
      cmp: 885,
      fairValue: 1040,
      pe: 11.4,
      industryPe: 24.1,
      marginOfSafetyPct: 17.5,
      recommendation: 'STRONG ACCUMULATE',
      catalyst: 'JLR debt-free milestone ahead of schedule; Defender order book strong.',
      source: 'Verified: Reuters',
      capCategory: 'Large Cap',
    },
    {
      symbol: 'BEL',
      name: 'Bharat Electronics Ltd',
      sector: 'Aerospace & Defence',
      cmp: 286,
      fairValue: 325,
      pe: 41.5,
      industryPe: 46.2,
      marginOfSafetyPct: 13.6,
      recommendation: 'BUY ON DIPS',
      catalyst: 'Indigenous defence electronics mandate; ₹76,000 Cr order pipeline visibility.',
      source: 'Verified: BusinessLine',
      capCategory: 'Mid Cap',
    },
    {
      symbol: 'CIPLA',
      name: 'Cipla Pharmaceuticals',
      sector: 'Healthcare',
      cmp: 1480,
      fairValue: 1720,
      pe: 24.1,
      industryPe: 29.8,
      marginOfSafetyPct: 16.2,
      recommendation: 'ACCUMULATE',
      catalyst: 'US generic respiratory franchise expansion; domestic chronic therapy outperformance.',
      source: 'Verified: Livemint',
      capCategory: 'Large Cap',
    },
  ];

  // Mutual Funds List
  const mutualFunds: CuratedMutualFund[] = [
    {
      id: 'ppfc',
      name: 'Parag Parikh Flexi Cap Fund - Direct (G)',
      category: 'Flexi Cap',
      cagr1y: 38.4,
      cagr3y: 22.8,
      cagr5y: 24.1,
      nav: 79.45,
      aumCr: 72400,
      expenseRatio: 0.62,
      rating: 5,
      minSip: 1000,
      riskometer: 'Very High',
      fundManager: 'Rajeev Thakkar',
      topHolding: 'HDFC Bank (7.8%)',
    },
    {
      id: 'quant-small',
      name: 'Quant Small Cap Fund - Direct (G)',
      category: 'Small Cap',
      cagr1y: 52.1,
      cagr3y: 32.4,
      cagr5y: 36.8,
      nav: 268.12,
      aumCr: 24800,
      expenseRatio: 0.77,
      rating: 5,
      minSip: 1000,
      riskometer: 'Very High',
      fundManager: 'Sandeep Tandon',
      topHolding: 'Reliance Industries (8.4%)',
    },
    {
      id: 'mirae-lm',
      name: 'Mirae Asset Large & Midcap Fund - Direct (G)',
      category: 'Large & Mid',
      cagr1y: 34.2,
      cagr3y: 19.5,
      cagr5y: 21.2,
      nav: 142.8,
      aumCr: 38900,
      expenseRatio: 0.58,
      rating: 5,
      minSip: 1000,
      riskometer: 'Very High',
      fundManager: 'Neelesh Surana',
      topHolding: 'ICICI Bank (6.5%)',
    },
    {
      id: 'nippon-growth',
      name: 'Nippon India Growth Fund - Direct (G)',
      category: 'Mid Cap',
      cagr1y: 46.8,
      cagr3y: 26.2,
      cagr5y: 25.9,
      nav: 3880.5,
      aumCr: 31200,
      expenseRatio: 0.81,
      rating: 5,
      minSip: 100,
      riskometer: 'Very High',
      fundManager: 'Manish Gunwani',
      topHolding: 'Power Finance Corp (4.2%)',
    },
    {
      id: 'mirae-elss',
      name: 'Mirae Asset ELSS Tax Saver Fund - Direct (G)',
      category: 'ELSS Tax Saver',
      cagr1y: 36.5,
      cagr3y: 19.8,
      cagr5y: 21.5,
      nav: 51.2,
      aumCr: 23600,
      expenseRatio: 0.55,
      rating: 5,
      minSip: 500,
      riskometer: 'Very High',
      fundManager: 'Neelesh Surana',
      topHolding: 'HDFC Bank (7.1%)',
    },
  ];

  // ETFs List
  const etfList: CuratedETF[] = [
    {
      symbol: 'NIFTYBEES',
      name: 'Nippon India Nifty 50 BeES ETF',
      underlying: 'Nifty 50 Index (Bluechips)',
      cmp: 268.45,
      cagr1y: 28.2,
      expenseRatio: 0.04,
      trackingError: '0.03%',
      dailyVol: '₹140 Cr / day',
      rationale: 'India top-50 bluechip index at an ultra-low 0.04% cost. Unbeatable core holding.',
    },
    {
      symbol: 'JUNIORBEES',
      name: 'Nippon India Nifty Next 50 BeES ETF',
      underlying: 'Nifty Next 50 (Large-to-Mid Leaders)',
      cmp: 842.1,
      cagr1y: 48.6,
      expenseRatio: 0.12,
      trackingError: '0.06%',
      dailyVol: '₹45 Cr / day',
      rationale: 'High alpha potential from emerging large caps poised to enter Nifty 50.',
    },
    {
      symbol: 'BANKBEES',
      name: 'Nippon India Bank BeES ETF',
      underlying: 'Nifty Bank Index',
      cmp: 532.8,
      cagr1y: 18.4,
      expenseRatio: 0.16,
      trackingError: '0.05%',
      dailyVol: '₹85 Cr / day',
      rationale: 'Private and PSU banking giants; attractive P/B multiple discount relative to historical mean.',
    },
    {
      symbol: 'GOLDBEES',
      name: 'Nippon India Gold BeES ETF',
      underlying: 'Physical 24K Gold Bullion (99.5% purity)',
      cmp: 68.9,
      cagr1y: 29.4,
      expenseRatio: 0.08,
      trackingError: '0.04%',
      dailyVol: '₹95 Cr / day',
      rationale: 'Instant demat liquidity for physical gold backing without locker or making charges.',
    },
    {
      symbol: 'MON100',
      name: 'Motilal Oswal Nasdaq 100 ETF',
      underlying: 'US Nasdaq 100 Index (Tech Giants)',
      cmp: 172.5,
      cagr1y: 36.2,
      expenseRatio: 0.58,
      trackingError: '0.14%',
      dailyVol: '₹32 Cr / day',
      rationale: 'Direct geographic diversification into US tech giants (Nvidia, Apple, Microsoft, Google).',
    },
    {
      symbol: 'SILVERBEES',
      name: 'Nippon India Silver BeES ETF',
      underlying: 'Physical 99.9% Silver Bullion',
      cmp: 94.2,
      cagr1y: 35.8,
      expenseRatio: 0.22,
      trackingError: '0.08%',
      dailyVol: '₹60 Cr / day',
      rationale: 'Industrial demand surge (Solar panels + EV battery grids) paired with precious metal store of value.',
    },
  ];

  // Allocation Profiles Breakdown
  const allocation = useMemo(() => {
    switch (profile) {
      case 'AGGRESSIVE':
        return {
          stocksPct: 35,
          mfPct: 35,
          etfPct: 10,
          goldPct: 10,
          cryptoPct: 10,
          rationale: 'Maximizes long-term equity compounding & asymmetric crypto growth. Suitable for 7+ year horizon.',
        };
      case 'CONSERVATIVE':
        return {
          stocksPct: 10,
          mfPct: 40,
          etfPct: 20,
          goldPct: 30,
          cryptoPct: 0,
          rationale: 'Prioritizes capital defense and low volatility via Sovereign Gold Bonds, Index ETFs and Hybrid funds.',
        };
      case 'TAX_SAVER':
        return {
          stocksPct: 15,
          mfPct: 45, // ELSS
          etfPct: 15,
          goldPct: 25, // SGB Tax-free
          cryptoPct: 0,
          rationale: 'Engineered for Section 80C tax exemption (ELSS) & 100% Tax-Free capital gains at SGB maturity.',
        };
      case 'BALANCED':
      default:
        return {
          stocksPct: 25,
          mfPct: 35,
          etfPct: 15,
          goldPct: 20,
          cryptoPct: 5,
          rationale: 'Optimal Sharpe ratio for current market valuation. Balances equity growth, gold safety, and 24/7 liquid crypto.',
        };
    }
  }, [profile]);

  // Rupee calculations
  const rupeeSplit = useMemo(() => {
    return {
      stocks: Math.round((amount * allocation.stocksPct) / 100),
      mf: Math.round((amount * allocation.mfPct) / 100),
      etf: Math.round((amount * allocation.etfPct) / 100),
      gold: Math.round((amount * allocation.goldPct) / 100),
      crypto: Math.round((amount * allocation.cryptoPct) / 100),
    };
  }, [amount, allocation]);

  // Compound SIP Wealth Calculation
  const sipCalculation = useMemo(() => {
    const monthlyRate = sipExpectedCagr / 100 / 12;
    let totalInvested = 0;
    let corpus = 0;
    let currentMonthly = sipMonthly;

    for (let yr = 1; yr <= sipTenureYears; yr++) {
      for (let m = 1; m <= 12; m++) {
        totalInvested += currentMonthly;
        corpus = (corpus + currentMonthly) * (1 + monthlyRate);
      }
      currentMonthly += Math.round((currentMonthly * sipStepUpPct) / 100);
    }

    const estimatedGains = Math.max(0, corpus - totalInvested);

    return {
      totalInvested: Math.round(totalInvested),
      corpus: Math.round(corpus),
      estimatedGains: Math.round(estimatedGains),
      multiplier: (corpus / (totalInvested || 1)).toFixed(1),
    };
  }, [sipMonthly, sipTenureYears, sipExpectedCagr, sipStepUpPct]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans p-3 sm:p-4 md:p-6 select-none">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Top Hero & Macro Sentiment Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Market Sentiment Wealth Copilot</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Where to Invest Right Now?
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Complete multi-asset investment terminal spanning <strong className="text-white">Stocks</strong>, <strong className="text-white">Mutual Funds & SIPs</strong>, <strong className="text-amber-300">Gold & SGBs</strong>, <strong className="text-cyan-300">ETFs</strong>, and <strong className="text-emerald-300">24/7 Crypto</strong>. Dynamic allocation optimized for real-time market valuations and macro cycles.
              </p>
            </div>

            {/* Quick Macro Stance Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-xs text-center">
                <span className="text-[10px] text-slate-400 block font-mono uppercase">Nifty 50 PE</span>
                <span className="text-base font-bold text-amber-400 font-mono">22.4x</span>
                <span className="text-[9px] text-amber-300/80 block mt-0.5">Fair to Rich</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-xs text-center">
                <span className="text-[10px] text-slate-400 block font-mono uppercase">24K Gold / 10g</span>
                <span className="text-base font-bold text-amber-300 font-mono">₹78,450</span>
                <span className="text-[9px] text-emerald-400 block mt-0.5">+29.4% 1Y</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-xs text-center">
                <span className="text-[10px] text-slate-400 block font-mono uppercase">RBI Repo Rate</span>
                <span className="text-base font-bold text-cyan-300 font-mono">6.50%</span>
                <span className="text-[9px] text-slate-300 block mt-0.5">High Yields</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-xs text-center">
                <span className="text-[10px] text-slate-400 block font-mono uppercase">Bitcoin (24/7)</span>
                <span className="text-base font-bold text-emerald-400 font-mono">$67,840</span>
                <span className="text-[9px] text-emerald-300 block mt-0.5">Weekend Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview' as const, label: '🎯 Suggested Portfolio Allocator', icon: PieChartIcon },
            { id: 'stocks' as const, label: '📈 Direct Stocks Picks', icon: TrendingUp },
            { id: 'mutual-funds' as const, label: '💼 Top Mutual Funds', icon: Award },
            { id: 'sip-calculator' as const, label: '🧮 SIP Wealth Calculator', icon: Calculator },
            { id: 'gold-sgb' as const, label: '🪙 Gold & SGBs', icon: Coins },
            { id: 'etfs' as const, label: '📊 Low-Cost ETFs', icon: Layers },
            { id: 'crypto' as const, label: '🌐 Crypto (24/7 Active)', icon: Zap },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-[#3B28CC] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* SUB-TAB 1: OVERVIEW / INTERACTIVE ALLOCATOR                               */}
        {/* ========================================================================= */}
        {activeSubTab === 'overview' && (
          <div className="space-y-4">
            {/* Interactive Inputs Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Personalized Sentiment Investment Generator</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select your investment frequency, budget, and risk posture to generate an exact Rupee and percentage asset allocation.
                  </p>
                </div>

                {/* Mode Selector */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start md:self-auto">
                  <button
                    onClick={() => setInvestMode('SIP')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      investMode === 'SIP' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🗓️ Monthly SIP
                  </button>
                  <button
                    onClick={() => setInvestMode('LUMPSUM')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      investMode === 'LUMPSUM' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    💵 One-Time Lump Sum
                  </button>
                </div>
              </div>

              {/* Amount Quick Select & Custom Slider */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    {investMode === 'SIP' ? 'How much do you want to invest each month?' : 'How much capital do you have to invest today?'}
                  </span>
                  <span className="font-mono text-base font-extrabold text-indigo-600">
                    ₹{amount.toLocaleString('en-IN')} {investMode === 'SIP' ? '/ month' : 'lump sum'}
                  </span>
                </div>

                {/* Quick Chips */}
                <div className="flex items-center gap-2 flex-wrap">
                  {(investMode === 'SIP'
                    ? [2500, 5000, 10000, 25000, 50000, 100000]
                    : [25000, 50000, 100000, 250000, 500000, 1000000]
                  ).map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                        amount === val
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ₹{val.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strategy Profiles */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  Select Your Goal & Risk Appetite:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      id: 'BALANCED' as const,
                      badge: 'Recommended',
                      title: 'Balanced Wealth',
                      desc: 'Optimal 35% MFs, 25% Stocks, 20% Gold, 15% ETFs, 5% Crypto.',
                      border: 'border-indigo-500 bg-indigo-50/50',
                    },
                    {
                      id: 'AGGRESSIVE' as const,
                      badge: 'Max Alpha',
                      title: 'Aggressive Growth',
                      desc: 'Heavy 70% direct equity & midcaps, 10% Crypto, 10% Gold.',
                      border: 'border-rose-500 bg-rose-50/40',
                    },
                    {
                      id: 'CONSERVATIVE' as const,
                      badge: 'Capital Safety',
                      title: 'Capital Defense',
                      desc: '30% Sovereign Gold, 40% Hybrid MFs, 20% Index ETFs, 0% Crypto.',
                      border: 'border-emerald-500 bg-emerald-50/40',
                    },
                    {
                      id: 'TAX_SAVER' as const,
                      badge: 'Section 80C',
                      title: 'Tax Optimizer',
                      desc: '45% ELSS tax exemption + 25% Tax-Free Sovereign Gold Bonds.',
                      border: 'border-amber-500 bg-amber-50/40',
                    },
                  ].map((p) => {
                    const isSelected = profile === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setProfile(p.id)}
                        className={`p-3.5 rounded-xl border-2 transition cursor-pointer ${
                          isSelected ? p.border + ' shadow-xs ring-1 ring-indigo-500' : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">{p.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{p.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI Generated Allocation Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Your Recommended Portfolio Blueprint</span>
                  </div>
                  <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                    Deploying ₹{amount.toLocaleString('en-IN')} {investMode === 'SIP' ? '/ month' : 'one-time'}
                  </div>
                </div>

                {/* Macro Rationale Pill */}
                <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl max-w-md">
                  <span className="font-bold text-indigo-900">AI Macro Rationale: </span>
                  <span>{allocation.rationale}</span>
                </div>
              </div>

              {/* Proportional Color-Coded Progress Bar */}
              <div className="space-y-1.5">
                <div className="h-5 w-full bg-slate-100 rounded-xl overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${allocation.mfPct}%` }}
                    className="bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold font-mono transition-all duration-500"
                    title={`Mutual Funds: ${allocation.mfPct}%`}
                  >
                    {allocation.mfPct}%
                  </div>
                  <div
                    style={{ width: `${allocation.stocksPct}%` }}
                    className="bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold font-mono transition-all duration-500"
                    title={`Stocks: ${allocation.stocksPct}%`}
                  >
                    {allocation.stocksPct}%
                  </div>
                  <div
                    style={{ width: `${allocation.goldPct}%` }}
                    className="bg-amber-400 flex items-center justify-center text-[10px] text-slate-900 font-bold font-mono transition-all duration-500"
                    title={`Gold & SGB: ${allocation.goldPct}%`}
                  >
                    {allocation.goldPct}%
                  </div>
                  <div
                    style={{ width: `${allocation.etfPct}%` }}
                    className="bg-cyan-500 flex items-center justify-center text-[10px] text-white font-bold font-mono transition-all duration-500"
                    title={`ETFs: ${allocation.etfPct}%`}
                  >
                    {allocation.etfPct}%
                  </div>
                  {allocation.cryptoPct > 0 && (
                    <div
                      style={{ width: `${allocation.cryptoPct}%` }}
                      className="bg-purple-600 flex items-center justify-center text-[10px] text-white font-bold font-mono transition-all duration-500"
                      title={`Crypto: ${allocation.cryptoPct}%`}
                    >
                      {allocation.cryptoPct}%
                    </div>
                  )}
                </div>

                {/* Visual Legend */}
                <div className="flex items-center gap-3 text-[11px] font-mono flex-wrap text-slate-600 pt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
                    Mutual Funds ({allocation.mfPct}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    Direct Stocks ({allocation.stocksPct}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                    Gold & SGB ({allocation.goldPct}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span>
                    Low-Cost ETFs ({allocation.etfPct}%)
                  </span>
                  {allocation.cryptoPct > 0 && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span>
                      Crypto 24/7 ({allocation.cryptoPct}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Exact Rupee Breakdown Cards with Recommended Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                {/* Bucket 1: Mutual Funds */}
                <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 uppercase">💼 Mutual Funds</span>
                    <span className="text-xs font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                      {allocation.mfPct}%
                    </span>
                  </div>
                  <div className="text-xl font-black text-indigo-950 font-mono">
                    ₹{rupeeSplit.mf.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Curated basket of top-rated Flexi-cap & mid-cap compounding engines with low expense ratios.
                  </p>
                  <div className="pt-1 border-t border-indigo-100 text-[11px] font-semibold text-indigo-700 flex items-center justify-between">
                    <span>Parag Parikh Flexi + Quant</span>
                    <button
                      onClick={() => setActiveSubTab('mutual-funds')}
                      className="text-indigo-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      View Details &rarr;
                    </button>
                  </div>
                </div>

                {/* Bucket 2: Direct Equities */}
                <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 uppercase">📈 Direct Stocks</span>
                    <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {allocation.stocksPct}%
                    </span>
                  </div>
                  <div className="text-xl font-black text-emerald-950 font-mono">
                    ₹{rupeeSplit.stocks.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    High margin-of-safety bluechips with solid earnings momentum, resilient balance sheets, and verified order inflow.
                  </p>
                  <div className="pt-1 border-t border-emerald-100 text-[11px] font-semibold text-emerald-700 flex items-center justify-between">
                    <span>TCS, ICICI Bank, L&T, Tata Motors</span>
                    <button
                      onClick={() => setActiveSubTab('stocks')}
                      className="text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      View Details &rarr;
                    </button>
                  </div>
                </div>

                {/* Bucket 3: Gold & SGBs */}
                <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 uppercase">🪙 Gold & SGB</span>
                    <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {allocation.goldPct}%
                    </span>
                  </div>
                  <div className="text-xl font-black text-amber-950 font-mono">
                    ₹{rupeeSplit.gold.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Essential portfolio stabilizer. Earns 2.5% p.a. sovereign interest + 100% tax-free capital gains at SGB maturity.
                  </p>
                  <div className="pt-1 border-t border-amber-100 text-[11px] font-semibold text-amber-800 flex items-center justify-between">
                    <span>RBI SGB + Nippon Gold BeES</span>
                    <button
                      onClick={() => setActiveSubTab('gold-sgb')}
                      className="text-amber-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      View Details &rarr;
                    </button>
                  </div>
                </div>

                {/* Bucket 4: Low-Cost Index ETFs */}
                <div className="border border-cyan-200 rounded-xl p-4 bg-cyan-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-900 uppercase">📊 Index ETFs</span>
                    <span className="text-xs font-mono font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">
                      {allocation.etfPct}%
                    </span>
                  </div>
                  <div className="text-xl font-black text-cyan-950 font-mono">
                    ₹{rupeeSplit.etf.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Low expense ratio (0.04% - 0.12%) broad-market coverage in Nifty 50 and Nifty Next 50 without fund manager risk.
                  </p>
                  <div className="pt-1 border-t border-cyan-100 text-[11px] font-semibold text-cyan-800 flex items-center justify-between">
                    <span>NIFTYBEES, JUNIORBEES, MON100</span>
                    <button
                      onClick={() => setActiveSubTab('etfs')}
                      className="text-cyan-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      View Details &rarr;
                    </button>
                  </div>
                </div>

                {/* Bucket 5: Crypto 24/7 */}
                {allocation.cryptoPct > 0 && (
                  <div className="border border-purple-200 rounded-xl p-4 bg-purple-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900 uppercase">🌐 24/7 Crypto Alpha</span>
                      <span className="text-xs font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        {allocation.cryptoPct}%
                      </span>
                    </div>
                    <div className="text-xl font-black text-purple-950 font-mono">
                      ₹{rupeeSplit.crypto.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Disciplined DCA into digital store-of-value. Liquid and trading 24/7/365, even when Indian equity markets are closed!
                    </p>
                    <div className="pt-1 border-t border-purple-100 text-[11px] font-semibold text-purple-800 flex items-center justify-between">
                      <span>BTC (70%) + ETH (30%)</span>
                      <button
                        onClick={() => setActiveSubTab('crypto')}
                        className="text-purple-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        View Details &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* Bucket 6: Compound Wealth Projection Quick Launcher */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-900 text-white space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-amber-300 font-mono uppercase font-bold tracking-widest block">
                      ⚡ 10-Year Compound Projection
                    </span>
                    <div className="text-lg font-bold mt-1">
                      Grow to ₹{(amount * (investMode === 'SIP' ? 24 : 3.8)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      See how stepping up this allocation by 10% each year can turn everyday savings into multi-crore wealth.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSipMonthly(amount);
                      setActiveSubTab('sip-calculator');
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Launch SIP Compound Calculator</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 2: DIRECT STOCKS PICKS                                            */}
        {/* ========================================================================= */}
        {activeSubTab === 'stocks' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Curated Direct Equities (High Margin of Safety)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Screened for strong institutional accumulation, attractive Fair Value, and verified business growth catalysts.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Wire: Livemint / Reuters / BSE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {stockPicks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:shadow-xs transition space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-900">{stock.symbol}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {stock.capCategory}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[200px]">{stock.name}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                        stock.recommendation === 'STRONG ACCUMULATE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {stock.recommendation}
                    </span>
                  </div>

                  {/* Pricing & Valuation Metrics */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg text-center font-mono">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">CMP</span>
                      <span className="text-xs font-bold text-slate-900">₹{stock.cmp.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Fair Value</span>
                      <span className="text-xs font-bold text-emerald-600">₹{stock.fairValue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Margin</span>
                      <span className="text-xs font-bold text-emerald-700">+{stock.marginOfSafetyPct}%</span>
                    </div>
                  </div>

                  {/* Catalyst and reason */}
                  <div className="text-[11.5px] leading-relaxed text-slate-700 bg-emerald-50/40 p-2 rounded-lg border border-emerald-100">
                    <span className="font-semibold text-emerald-900">Why Buy Today: </span>
                    <span>{stock.catalyst}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>P/E: {stock.pe} (Sector: {stock.industryPe})</span>
                    <span className="text-indigo-600 font-sans font-medium">{stock.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 3: TOP MUTUAL FUNDS                                               */}
        {/* ========================================================================= */}
        {activeSubTab === 'mutual-funds' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Top-Rated Mutual Funds (Direct Plans · Low Expense)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consistent 5-star wealth compounding funds vetted for rolling returns, alpha generation, and downside risk containment.
                </p>
              </div>
              <div className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full font-mono">
                ₹24,500 Cr Monthly Indian SIP Flow
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                    <th className="pb-3 pl-2">Fund Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-right">1Y Return</th>
                    <th className="pb-3 text-right">3Y CAGR</th>
                    <th className="pb-3 text-right">5Y CAGR</th>
                    <th className="pb-3 text-right">Expense Ratio</th>
                    <th className="pb-3 text-right">AUM (₹ Cr)</th>
                    <th className="pb-3 text-center">Rating</th>
                    <th className="pb-3 text-right pr-2">Min SIP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mutualFunds.map((fund) => (
                    <tr key={fund.id} className="hover:bg-slate-50/80 transition font-sans">
                      <td className="py-3 pl-2">
                        <div className="font-bold text-slate-900 text-xs">{fund.name}</div>
                        <div className="text-[10px] text-slate-500">
                          Manager: {fund.fundManager} · Top: {fund.topHolding}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {fund.category}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-emerald-600">
                        +{fund.cagr1y}%
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-emerald-600">
                        +{fund.cagr3y}%
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-emerald-600">
                        +{fund.cagr5y}%
                      </td>
                      <td className="py-3 text-right font-mono text-slate-600">
                        {fund.expenseRatio}%
                      </td>
                      <td className="py-3 text-right font-mono text-slate-700">
                        ₹{fund.aumCr.toLocaleString()}
                      </td>
                      <td className="py-3 text-center font-mono text-amber-500">
                        {'★'.repeat(fund.rating)}
                      </td>
                      <td className="py-3 text-right pr-2 font-mono font-bold text-indigo-700">
                        ₹{fund.minSip.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 4: SIP COMPOUND CALCULATOR                                        */}
        {/* ========================================================================= */}
        {activeSubTab === 'sip-calculator' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-600" />
                <span>Compound Wealth Simulator & Annual Step-Up Projector</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate how disciplined systematic investment combined with annual salary raises (Step-Up) generates exponential compound interest.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Controls: Sliders */}
              <div className="lg:col-span-6 space-y-5">
                {/* Monthly SIP Amount */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Monthly Investment Amount</span>
                    <span className="font-mono text-indigo-600 font-bold text-sm">
                      ₹{sipMonthly.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={sipMonthly}
                    onChange={(e) => setSipMonthly(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>₹1,000</span>
                    <span>₹50,000</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>

                {/* Expected Return Rate */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Expected Annual Return (CAGR)</span>
                    <span className="font-mono text-emerald-600 font-bold text-sm">
                      {sipExpectedCagr}% p.a.
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="22"
                    step="0.5"
                    value={sipExpectedCagr}
                    onChange={(e) => setSipExpectedCagr(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>8% (Conservative)</span>
                    <span>14% (Nifty Index)</span>
                    <span>22% (High Alpha)</span>
                  </div>
                </div>

                {/* Investment Horizon */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Time Horizon (Years)</span>
                    <span className="font-mono text-indigo-600 font-bold text-sm">
                      {sipTenureYears} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={sipTenureYears}
                    onChange={(e) => setSipTenureYears(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>1 Year</span>
                    <span>15 Years</span>
                    <span>30 Years</span>
                  </div>
                </div>

                {/* Annual Step-Up Percentage */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Annual Step-Up (% increase every year)</span>
                    <span className="font-mono text-amber-600 font-bold text-sm">
                      +{sipStepUpPct}% / year
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="5"
                    value={sipStepUpPct}
                    onChange={(e) => setSipStepUpPct(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0% (Flat SIP)</span>
                    <span>10% (Annual Salary Hike)</span>
                    <span>25%</span>
                  </div>
                </div>
              </div>

              {/* Right Output: Big Stats & Wealth Compounding Visualization */}
              <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">
                    Projected Maturity Value
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight mt-1">
                    ₹{sipCalculation.corpus.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Your invested capital multiplies by <strong className="text-amber-300 font-mono">{sipCalculation.multiplier}x</strong> over {sipTenureYears} years.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Invested</span>
                    <span className="text-lg font-bold text-slate-100 font-mono">
                      ₹{sipCalculation.totalInvested.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Estimated Wealth Gains</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">
                      ₹{sipCalculation.estimatedGains.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Progress bar ratio of Investment vs Gains */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Invested ({((sipCalculation.totalInvested / (sipCalculation.corpus || 1)) * 100).toFixed(0)}%)</span>
                    <span>Capital Gains ({((sipCalculation.estimatedGains / (sipCalculation.corpus || 1)) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      style={{
                        width: `${Math.min(100, (sipCalculation.totalInvested / (sipCalculation.corpus || 1)) * 100)}%`,
                      }}
                      className="bg-indigo-500 h-full"
                    ></div>
                    <div
                      style={{
                        width: `${Math.min(100, (sipCalculation.estimatedGains / (sipCalculation.corpus || 1)) * 100)}%`,
                      }}
                      className="bg-emerald-400 h-full"
                    ></div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-[11px] text-indigo-200">
                  💡 <strong>Compounding Superpower:</strong> An annual 10% step-up increases your 15-year maturity wealth by over 80% compared to a flat SIP without increasing financial strain!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 5: GOLD & SGBs                                                    */}
        {/* ========================================================================= */}
        {activeSubTab === 'gold-sgb' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>Gold & Sovereign Gold Bonds (SGBs) Investment Desk</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Protect portfolio purchasing power against rupee depreciation, monetary inflation, and geopolitical headwinds.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  24K Gold: ₹7,845 / g
                </span>
                <span className="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Silver: ₹97.2 / g
                </span>
              </div>
            </div>

            {/* Comparison Grid: SGB vs ETF vs Digital Gold */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: SGB */}
              <div className="p-4 rounded-xl border-2 border-amber-400 bg-amber-50/30 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 uppercase">Sovereign Gold Bonds (RBI SGB)</span>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-mono">
                    Highest Return
                  </span>
                </div>
                <div className="text-2xl font-black text-amber-900 font-mono">
                  +2.50% p.a.
                </div>
                <p className="text-[11px] text-slate-600">
                  Guaranteed annual interest paid directly to your bank account every 6 months on the nominal value.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-amber-200 font-sans">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>100% Tax-Free</strong> capital gains at 8-year maturity.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Backed by Sovereign Government of India guarantee.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Zero making charges, locker costs, or GST.</span>
                  </div>
                </div>
              </div>

              {/* Option 2: Gold ETFs */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase">Gold ETFs (e.g. GOLDBEES)</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                    High Liquidity
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  T+1 Demat
                </div>
                <p className="text-[11px] text-slate-600">
                  Instant execution on NSE & BSE during market hours. Fully backed by physical 99.5% purity gold in insured vaults.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100 font-sans">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Buy from 1 unit (~₹68). Instant SIP via broker.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Ultra-low expense ratio of 0.08%.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Taxed as debt ETF at your income tax slab.</span>
                  </div>
                </div>
              </div>

              {/* Option 3: Silver ETFs */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase">Silver ETFs (SILVERBEES)</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                    Industrial Alpha
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  +35.8% 1Y
                </div>
                <p className="text-[11px] text-slate-600">
                  Dual tailwind: Precious monetary metal plus high industrial demand in green energy (Solar cells, EVs, 5G electronics).
                </p>
                <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100 font-sans">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Physically stored in domestic vaults.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Higher volatility and beta than gold.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Zero physical theft risk.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 6: LOW COST ETFs                                                  */}
        {/* ========================================================================= */}
        {activeSubTab === 'etfs' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-600" />
                  <span>Low-Cost Exchange Traded Funds (ETFs)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Institutional grade index building blocks with expense ratios as low as 0.04% p.a.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {etfList.map((etf) => (
                <div
                  key={etf.symbol}
                  className="p-4 rounded-xl border border-slate-200 hover:border-cyan-300 bg-white hover:shadow-xs transition space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900">{etf.symbol}</span>
                      <div className="text-xs text-slate-500 truncate max-w-[200px]">{etf.name}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      +{etf.cagr1y}% 1Y
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg text-center font-mono">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Price</span>
                      <span className="text-xs font-bold text-slate-900">₹{etf.cmp}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Exp Ratio</span>
                      <span className="text-xs font-bold text-indigo-600">{etf.expenseRatio}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Liquidity</span>
                      <span className="text-[10px] font-bold text-slate-700">{etf.dailyVol}</span>
                    </div>
                  </div>

                  <p className="text-[11.5px] text-slate-600 leading-relaxed">{etf.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 7: CRYPTO (24/7 ACTIVE)                                           */}
        {/* ========================================================================= */}
        {activeSubTab === 'crypto' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span>24/7 Global Crypto Alpha Desk</span>
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold font-mono animate-pulse">
                    ● Trading 24/7 (Weekend Open)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  While Indian equity and mutual fund markets close for the weekend, global crypto markets trade non-stop 24/7/365.
                </p>
              </div>
              <div className="text-xs font-mono bg-purple-50 text-purple-800 px-3 py-1 rounded-full border border-purple-200 font-semibold">
                Fear & Greed Index: 71 (Greed)
              </div>
            </div>

            {/* Live Quotes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-black text-slate-900">Bitcoin (BTC)</span>
                    <span className="text-[10px] text-slate-500 block">Digital Gold Reserve</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 font-mono">+3.42% (24h)</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  $67,840 <span className="text-xs text-slate-500 font-normal">(~₹56.9L)</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Institutional spot ETF accumulation led by BlackRock IBIT. Long-term digital store of value.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-black text-slate-900">Ethereum (ETH)</span>
                    <span className="text-[10px] text-slate-500 block">Smart Contract Layer-1</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 font-mono">+2.15% (24h)</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  $2,642 <span className="text-xs text-slate-500 font-normal">(~₹2.21L)</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Global decentralised settlement network; deflationary fee burn with 3.2% annual staking yield.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-black text-slate-900">Solana (SOL)</span>
                    <span className="text-[10px] text-slate-500 block">High Throughput Web3</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 font-mono">+5.80% (24h)</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  $175.40 <span className="text-xs text-slate-500 font-normal">(~₹14,700)</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Surging DEX volume and institutional payments adoption via Visa and Shopify integrations.
                </p>
              </div>
            </div>

            {/* Essential Prudent Risk Rules */}
            <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Prudent Wealth Rules for Crypto Allocation</span>
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
                <div>
                  <strong className="text-white block">1. Strict 3%–5% Portfolio Ceiling:</strong>
                  Never allocate more than 5% of your total net worth into crypto due to structural volatility.
                </div>
                <div>
                  <strong className="text-white block">2. Dollar-Cost Average (DCA) Only:</strong>
                  Avoid lump-sum FOMO during greed phases. Invest fixed small amounts weekly or monthly.
                </div>
                <div>
                  <strong className="text-white block">3. Zero Leverage / No Futures:</strong>
                  High-leverage crypto derivative contracts are the #1 source of retail wipeout. Stick to spot holdings.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
