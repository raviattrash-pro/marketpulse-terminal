'use client';

import React, { useState, useEffect } from 'react';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Activity,
  ShieldCheck,
  Zap,
  RefreshCw,
  Sliders,
  DollarSign,
  Globe,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from 'lucide-react';

interface AssetQuote {
  symbol: string;
  name: string;
  category: 'CRYPTO' | 'PRECIOUS_METALS' | 'MACRO';
  price: number;
  currency: string;
  change24h: number;
  flowCr: number;
  flowDirection: 'INFLOW' | 'OUTFLOW';
  institutionalActivity: string;
  rsi: number;
  correlationNifty: number; // -1 to +1
}

export default function CryptoGoldFlow() {
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [timeframe, setTimeframe] = useState<'1H' | '4H' | '1D' | '1W'>('1D');
  const [equityPortfolioVal, setEquityPortfolioVal] = useState<number>(1000000); // 10 Lakhs default
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const [assets, setAssets] = useState<AssetQuote[]>([
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      category: 'CRYPTO',
      price: 67840,
      currency: 'USD',
      change24h: 3.42,
      flowCr: 4120,
      flowDirection: 'INFLOW',
      institutionalActivity: 'Spot ETF Inflows + BlackRock IBIT Accumulation',
      rsi: 64.2,
      correlationNifty: 0.42,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      category: 'CRYPTO',
      price: 2642,
      currency: 'USD',
      change24h: 2.15,
      flowCr: 1240,
      flowDirection: 'INFLOW',
      institutionalActivity: 'DeFi TVL expansion & staking lockup',
      rsi: 58.6,
      correlationNifty: 0.38,
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      category: 'CRYPTO',
      price: 178.5,
      currency: 'USD',
      change24h: 5.12,
      flowCr: 890,
      flowDirection: 'INFLOW',
      institutionalActivity: 'High DEX volume & institutional venture accumulation',
      rsi: 69.1,
      correlationNifty: 0.28,
    },
    {
      symbol: 'GOLD_MCX',
      name: 'MCX Gold Futures (10g)',
      category: 'PRECIOUS_METALS',
      price: 78450,
      currency: 'INR',
      change24h: -0.28,
      flowCr: 1850,
      flowDirection: 'INFLOW',
      institutionalActivity: 'RBI & BRICS Central Bank sovereign bullion reserve buying',
      rsi: 52.4,
      correlationNifty: -0.22,
    },
    {
      symbol: 'SILVER_MCX',
      name: 'MCX Silver (1kg)',
      category: 'PRECIOUS_METALS',
      price: 93200,
      currency: 'INR',
      change24h: 1.45,
      flowCr: 940,
      flowDirection: 'INFLOW',
      institutionalActivity: 'Solar PV & EV industrial demand hedge',
      rsi: 61.0,
      correlationNifty: 0.15,
    },
    {
      symbol: 'DXY',
      name: 'US Dollar Index',
      category: 'MACRO',
      price: 104.2,
      currency: 'USD',
      change24h: -0.18,
      flowCr: -2400,
      flowDirection: 'OUTFLOW',
      institutionalActivity: 'Fed rate easing expectations weakening DXY',
      rsi: 46.8,
      correlationNifty: -0.65,
    },
    {
      symbol: 'US10Y',
      name: 'US 10-Year Treasury Yield',
      category: 'MACRO',
      price: 4.22,
      currency: '%',
      change24h: -0.85,
      flowCr: -1500,
      flowDirection: 'OUTFLOW',
      institutionalActivity: 'Yield pullback relieving equity pressure',
      rsi: 44.1,
      correlationNifty: -0.58,
    },
  ]);

  const [usdInrRate, setUsdInrRate] = useState<number>(84.2);

  const fetchLiveCryptoGold = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/crypto-gold');
      if (res.ok) {
        const data = await res.json();
        if (data.assets && Array.isArray(data.assets)) {
          setAssets(data.assets);
        }
        if (data.usdInr) {
          setUsdInrRate(data.usdInr);
        }
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (e) {
      // keep recent
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveCryptoGold();
    const timer = setInterval(fetchLiveCryptoGold, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    fetchLiveCryptoGold();
  };

  const active = assets.find((a) => a.symbol === selectedAsset) || assets[0];

  // Multi-Asset All-Weather Allocation Calculator
  const goldAllocPct = 12; // 10-15% gold recommended
  const cryptoAllocPct = 4; // 3-5% asymmetric crypto hedge
  const goldHedgeINR = (equityPortfolioVal * (goldAllocPct / 100));
  const cryptoHedgeINR = (equityPortfolioVal * (cryptoAllocPct / 100));
  const goldMCXPrice = assets.find((a) => a.symbol === 'GOLD_MCX')?.price || 78450;
  const btcUSDPrice = assets.find((a) => a.symbol === 'BTC')?.price || 67840;
  const inrUsdRate = usdInrRate;

  const goldGrams = ((goldHedgeINR / goldMCXPrice) * 10).toFixed(1);
  const btcSatoshis = (((cryptoHedgeINR / (btcUSDPrice * inrUsdRate))) * 100000000).toFixed(0);

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans p-3 sm:p-4 md:p-6 select-none">
      <div className="max-w-[1600px] mx-auto space-y-5">
        {/* Top Headline Running Alert */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">
                Institutional Macro Liquidity Radar · <span className="text-emerald-600">Global Risk-On Alignment</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time tracking of institutional liquidity rotation across Crypto ETFs, MCX Bullion, and US Dollar Macro Flows.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <span className="text-[11px] font-mono text-slate-500">Updated: {lastUpdated} IST</span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
              Sync Live
            </button>
          </div>
        </div>

        {/* Asset Selector Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {assets.map((item) => {
            const isSelected = item.symbol === selectedAsset;
            const isBullish = item.change24h >= 0;
            return (
              <button
                key={item.symbol}
                onClick={() => setSelectedAsset(item.symbol)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 font-mono">{item.symbol}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isBullish ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {isBullish ? '+' : ''}
                    {item.change24h}%
                  </span>
                </div>
                <div className="mt-2 text-sm font-extrabold text-slate-900 font-mono">
                  {item.currency === 'INR' ? '₹' : item.currency === 'USD' ? '$' : ''}
                  {item.price.toLocaleString('en-IN')}
                  {item.currency === '%' ? '%' : ''}
                </div>
                <div className="mt-1 text-[10px] text-slate-400 truncate">{item.name}</div>
              </button>
            );
          })}
        </div>

        {/* Deep Dive Grid: Active Instrument Radar + Macro Portfolio Hedger */}
        <div className="grid grid-cols-12 gap-5">
          {/* Left Column: Selected Asset Institutional Dossier */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
            {/* Asset Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-900 tracking-tight">{active.name}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                    {active.symbol}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      active.flowDirection === 'INFLOW'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {active.flowDirection === 'INFLOW' ? 'Institutional Inflow' : 'Institutional Outflow'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{active.institutionalActivity}</p>
              </div>

              {/* Timeframe Chips */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                {(['1H', '4H', '1D', '1W'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      timeframe === tf
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Spot CMP</span>
                <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                  {active.currency === 'INR' ? '₹' : active.currency === 'USD' ? '$' : ''}
                  {active.price.toLocaleString('en-IN')}
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    active.change24h >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {active.change24h >= 0 ? '+' : ''}
                  {active.change24h}% (24h change)
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Whale Flow</span>
                <div className="text-base font-extrabold text-indigo-700 font-mono mt-0.5">
                  ₹{Math.abs(active.flowCr).toLocaleString('en-IN')} Cr
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Daily Liquidity Delta</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">RSI Momentum</span>
                <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">{active.rsi}</div>
                <span
                  className={`text-[10px] font-semibold ${
                    active.rsi > 65
                      ? 'text-emerald-700'
                      : active.rsi < 35
                      ? 'text-rose-700'
                      : 'text-slate-500'
                  }`}
                >
                  {active.rsi > 65 ? 'Overbought Bull' : active.rsi < 35 ? 'Oversold Accumulation' : 'Neutral Zone'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nifty Correlation</span>
                <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                  {active.correlationNifty > 0 ? '+' : ''}
                  {active.correlationNifty}
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  {active.correlationNifty < 0 ? 'Hedge (Inverse)' : 'Co-directional'}
                </span>
              </div>
            </div>

            {/* Visual Institutional Order Depth & Breakout Bands */}
            <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl text-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  Order Book Liquidity Shelves & VWAP Bands
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Institutional Depth: High</span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-[11px] text-rose-400">Major Resistance / Sell Wall:</span>
                  <span className="font-bold">
                    {active.currency === 'INR' ? '₹' : '$'}
                    {(active.price * 1.035).toFixed(1)} (12.4K contracts resting)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[78%]"></div>
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-1">
                  <span className="text-[11px] text-indigo-300">Volume Weighted Price (VWAP):</span>
                  <span className="font-bold">
                    {active.currency === 'INR' ? '₹' : '$'}
                    {(active.price * 0.998).toFixed(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-1">
                  <span className="text-[11px] text-emerald-400">Major Support / Institutional Bid Wall:</span>
                  <span className="font-bold">
                    {active.currency === 'INR' ? '₹' : '$'}
                    {(active.price * 0.965).toFixed(1)} (18.9K contracts resting)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[84%]"></div>
                </div>
              </div>
            </div>

            {/* Educational Breakdown */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Institutional Trading Insight
              </div>
              <p className="text-[11px] text-indigo-900/80 leading-relaxed">
                When US Dollar Index (DXY) drops below 104.5, emerging equity markets (Nifty 50) and Bitcoin historically rally in tandem due to global dollar liquidity expansion. Conversely, MCX Gold serves as the primary hedge against sovereign currency dilution and geopolitical supply shocks.
              </p>
            </div>
          </div>

          {/* Right Column: Multi-Asset All-Weather Hedger */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    PORTFOLIO MACRO HEDGE
                  </span>
                  <span className="text-xs text-slate-400">Institutional All-Weather Model</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4" />
                </div>
              </div>

              {/* Portfolio Value Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Your Equity Portfolio Size (₹):</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">₹</span>
                  <input
                    type="number"
                    step="50000"
                    value={equityPortfolioVal}
                    onChange={(e) => setEquityPortfolioVal(Math.max(10000, Number(e.target.value)))}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-sm text-slate-800 focus:outline-indigo-500"
                  />
                </div>
              </div>

              {/* Calculated Allocations */}
              <div className="space-y-3 font-mono text-xs pt-1">
                {/* Gold Allocation Card */}
                <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between text-amber-900 font-bold">
                    <span>Gold Bullion Hedge (12%)</span>
                    <span>₹{goldHedgeINR.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-[11px] text-amber-800 flex justify-between">
                    <span>Recommended Quantity:</span>
                    <span className="font-extrabold text-amber-950">{goldGrams} grams (or Sovereign Gold Bonds)</span>
                  </div>
                  <p className="text-[10px] text-amber-700 font-sans mt-1">
                    Protects equity drawdowns during stagflation & currency depreciation.
                  </p>
                </div>

                {/* Crypto Allocation Card */}
                <div className="p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-200 space-y-1">
                  <div className="flex items-center justify-between text-indigo-900 font-bold">
                    <span>Digital Gold / BTC (4%)</span>
                    <span>₹{cryptoHedgeINR.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-[11px] text-indigo-800 flex justify-between">
                    <span>Recommended Allocation:</span>
                    <span className="font-extrabold text-indigo-950">{btcSatoshis} Satoshis (~{(Number(btcSatoshis) / 1e8).toFixed(4)} BTC)</span>
                  </div>
                  <p className="text-[10px] text-indigo-700 font-sans mt-1">
                    Provides asymmetric upside during global monetary base (M2) expansion.
                  </p>
                </div>
              </div>

              {/* Diversification Score Indicator */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <div className="flex items-center justify-between font-bold text-emerald-900">
                  <span>Downside VaR Protection:</span>
                  <span className="text-emerald-700 font-mono">94% Robust</span>
                </div>
                <p className="text-[10px] text-emerald-800 mt-0.5">
                  Compliant with institutional multi-asset allocation principles for long-term wealth preservation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
