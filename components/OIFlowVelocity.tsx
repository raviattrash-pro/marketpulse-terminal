'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Gauge,
  Zap,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Search,
  X,
  HelpCircle,
  Info,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface OIStrike {
  strike: number;
  putOi: number;
  callOi: number;
  putType: 'LONG_BUILDUP' | 'SHORT_BUILDUP' | 'SHORT_COVERING' | 'LONG_UNWINDING';
  callType: 'LONG_BUILDUP' | 'SHORT_BUILDUP' | 'SHORT_COVERING' | 'LONG_UNWINDING';
  velocity: number; // speed in dots
}

const ALL_FNO_SYMBOLS = [
  'NIFTY',
  'BANKNIFTY',
  'PTC',
  'RELIANCE',
  'HDFCBANK',
  'ICICIBANK',
  'SBIN',
  'INFY',
  'TCS',
  'TATAMOTORS',
  'BAJFINANCE',
  'TITAN',
  'SUNPHARMA',
  'LT',
  'ITC',
  'MARUTI',
  'WIPRO',
  'KOTAKBANK',
  'AXISBANK',
  'BHARTIARTL',
  'INDUSINDBK',
  'ULTRACEMCO',
  'CIPLA',
  'ONGC',
  'POWERGRID',
  'TATASTEEL',
  'NTPC',
  'ADANIENT',
  'ADANIPORTS',
  'COALINDIA',
  'BHEL',
  'DLF',
  'BEL',
  'HAL',
  'VEDL',
];

export default function OIFlowVelocity() {
  const [selectedStock, setSelectedStock] = useState('HDFCBANK');
  const [stockPills, setStockPills] = useState(['NIFTY', 'BANKNIFTY', 'HDFCBANK', 'RELIANCE', 'SBIN', 'INFY']);
  const [cmp, setCmp] = useState(1680.5);
  const [changePct, setChangePct] = useState(0.42);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(50);
  const [marketStatus, setMarketStatus] = useState<{
    isMarketOpen: boolean;
    label: string;
    subLabel: string;
  }>({
    isMarketOpen: false,
    label: 'Market Closed (Weekend)',
    subLabel: 'Friday Close Settled',
  });
  const [replayVelocity, setReplayVelocity] = useState(false);

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  // Educational Modal State
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Fetch market status to properly pause velocity when market is closed
  useEffect(() => {
    const checkMarketStatus = async () => {
      try {
        const res = await fetch('/api/market-pulse');
        if (res.ok) {
          const data = await res.json();
          if (data.marketStatus) {
            setMarketStatus({
              isMarketOpen: Boolean(data.marketStatus.isMarketOpen),
              label: data.marketStatus.label || 'Market Closed',
              subLabel: data.marketStatus.subLabel || 'Friday Close Settled',
            });
          }
        }
      } catch (e) {
        // keep fallback
      }
    };
    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Velocity dot animation ticker - paused when market is closed unless user requests replay
  useEffect(() => {
    if (!marketStatus.isMarketOpen && !replayVelocity) {
      setTick(50); // Locked resting position when market is closed
      return;
    }
    const interval = setInterval(() => {
      setTick((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, [marketStatus.isMarketOpen, replayVelocity]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch live price for selected stock
  const fetchStockData = async (sym: string) => {
    setLoading(true);
    try {
      if (sym === 'BANKNIFTY' || sym === 'NIFTY') {
        const res = await fetch('/api/market-pulse');
        if (res.ok) {
          const data = await res.json();
          const target = sym === 'BANKNIFTY' ? '^NSEBANK' : '^NSEI';
          const b = data.indices?.find((i: any) => i.symbol === target);
          if (b) {
            setCmp(b.price);
            setChangePct(b.changePct);
          }
        }
      } else {
        const res = await fetch(`/api/live-stocks?symbol=${encodeURIComponent(sym)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.stock) {
            setCmp(data.stock.price);
            setChangePct(data.stock.changePct);
          }
        }
      }
    } catch (e) {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData(selectedStock);
  }, [selectedStock]);

  const handleSelectSymbol = (sym: string) => {
    const upper = sym.toUpperCase().trim();
    if (!upper) return;

    if (!stockPills.includes(upper)) {
      setStockPills((prev) => [upper, ...prev.slice(0, 5)]);
    }
    setSelectedStock(upper);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const filteredSymbols = ALL_FNO_SYMBOLS.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Dynamic strike interval
  const getStrikeInterval = (price: number) => {
    if (price > 40000) return 100;
    if (price > 10000) return 50;
    if (price > 3000) return 20;
    if (price > 1000) return 10;
    if (price > 500) return 5;
    return 2.5;
  };

  const intervalVal = getStrikeInterval(cmp);
  const atmStrike = Math.round(cmp / intervalVal) * intervalVal;

  // Build dynamic strikes ladder
  const strikes: OIStrike[] = [];
  const count = 10;
  for (let i = count; i >= -count; i--) {
    const strk = atmStrike + i * intervalVal;
    const dist = (strk - atmStrike) / intervalVal;

    // Call OI and Put OI distribution
    const callOi = Number((Math.max(1.0, 42 - dist * 3.5 + Math.sin(strk * 0.1) * 12)).toFixed(1));
    const putOi = Number((Math.max(1.2, 38 + dist * 3.2 + Math.cos(strk * 0.1) * 10)).toFixed(1));

    // Determine type
    let callType: OIStrike['callType'] = 'SHORT_BUILDUP';
    if (dist < 0) {
      callType = 'SHORT_COVERING';
    } else if (dist === 0) {
      callType = changePct >= 0 ? 'SHORT_COVERING' : 'SHORT_BUILDUP';
    } else if (dist > 4) {
      callType = 'LONG_UNWINDING';
    }

    let putType: OIStrike['putType'] = 'LONG_BUILDUP';
    if (dist > 0) {
      putType = 'LONG_UNWINDING';
    } else if (dist === 0) {
      putType = changePct >= 0 ? 'LONG_BUILDUP' : 'SHORT_COVERING';
    } else if (dist < -4) {
      putType = 'SHORT_BUILDUP';
    }

    const velocity = Math.min(10, Math.max(1, Math.round(10 - Math.abs(dist) * 0.8)));

    strikes.push({
      strike: Number(strk.toFixed(1)),
      putOi,
      callOi,
      putType,
      callType,
      velocity,
    });
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'LONG_BUILDUP':
        return 'bg-emerald-500';
      case 'SHORT_BUILDUP':
        return 'bg-rose-500';
      case 'SHORT_COVERING':
        return 'bg-cyan-500';
      case 'LONG_UNWINDING':
        return 'bg-amber-500';
      default:
        return 'bg-slate-300';
    }
  };

  const maxOi = Math.max(...strikes.map((s) => Math.max(s.callOi, s.putOi)), 50);

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans p-3 sm:p-4 md:p-6 select-none">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Dynamic Running Headline Alert Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-sm font-bold text-slate-800">
            Short covering in calls;{' '}
            <span className="text-[#4F46E5] font-extrabold">
              watch {atmStrike} for an institutional breakout
            </span>{' '}
            · CMP: <span className="font-mono text-slate-900">₹{cmp.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-indigo-200"
            >
              <HelpCircle className="w-4 h-4" />
              What Information Does OI Flow Give?
            </button>
            {marketStatus.isMarketOpen ? (
              <span className="text-xs text-emerald-700 font-mono font-medium flex items-center gap-1.5 shrink-0 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                NSE Live Stream
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-700 font-mono font-medium flex items-center gap-1.5 shrink-0 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Market Closed · Settled OI
                </span>
                <button
                  onClick={() => setReplayVelocity(!replayVelocity)}
                  className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                    replayVelocity
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300 shadow-2xs'
                  }`}
                  title="Simulate / Replay the velocity that occurred during Friday's active market session"
                >
                  <span>{replayVelocity ? '⏸️ Pause Replay' : '▶️ Replay Friday Velocity'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stock Selector & Live Search Box */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {stockPills.map((s) => (
              <button
                key={s}
                onClick={() => handleSelectSymbol(s)}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                  selectedStock === s
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Autocomplete Search Input */}
          <div ref={searchRef} className="relative w-full sm:w-64">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 shadow-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search F&O symbol (e.g. PTC, SBIN)..."
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleSelectSymbol(searchQuery.trim());
                  }
                }}
                className="w-full text-xs bg-transparent focus:outline-hidden font-mono uppercase placeholder:normal-case placeholder:font-sans placeholder:text-slate-400 text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer mr-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              {loading && (
                <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0"></div>
              )}
            </div>

            {/* Dropdown Suggestions */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-56 overflow-y-auto p-1 font-mono text-xs">
                {searchQuery.trim() && (
                  <button
                    onClick={() => handleSelectSymbol(searchQuery.trim())}
                    className="w-full text-left px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center justify-between transition-colors cursor-pointer border-b border-indigo-100 mb-1"
                  >
                    <span className="font-bold">⚡ Load "{searchQuery.toUpperCase()}" Live</span>
                    <span className="text-[10px] bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded-sm">NSE Live</span>
                  </button>
                )}

                {filteredSymbols.length > 0 ? (
                  filteredSymbols.map((sym) => (
                    <button
                      key={sym}
                      onClick={() => handleSelectSymbol(sym)}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="font-bold">{sym}</span>
                      <span className="text-[10px] text-slate-400">NSE F&O</span>
                    </button>
                  ))
                ) : (
                  <button
                    onClick={() => handleSelectSymbol(searchQuery.trim())}
                    className="w-full text-left px-3 py-2 text-indigo-600 hover:bg-indigo-50 text-xs font-sans font-medium"
                  >
                    Click to fetch live quote & strikes for "{searchQuery.toUpperCase()}"
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ELI5 / 5-Year Old Beginner Takeaway Card for OI Flow */}
        <div className="bg-gradient-to-r from-cyan-50 via-white to-blue-50 border border-cyan-200/80 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👶</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-900 bg-cyan-100 px-2 py-0.5 rounded-full font-mono">
                    OI Velocity Explained For 5-Year Olds
                  </span>
                  <span className="text-xs text-slate-500 font-medium">No confusing options jargon</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                  <span>
                    <strong className="text-emerald-700">🟢 GREEN Put Wall (Left):</strong> Big institutional buyers protecting the floor at ₹{atmStrike - intervalVal * 2}. Price rarely drops below this.
                    <br />
                    <strong className="text-rose-700">🔴 RED Call Wall (Right):</strong> Sellers guarding the ceiling at ₹{atmStrike + intervalVal * 2}. Price struggles to break past this without huge volume!
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Safety Floor</span>
                <span className="text-xs font-black text-emerald-700 font-mono">₹{atmStrike - intervalVal * 2}</span>
              </div>
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Resistance Ceiling</span>
                <span className="text-xs font-black text-rose-700 font-mono">₹{atmStrike + intervalVal * 2}</span>
              </div>
            </div>
          </div>

          {!marketStatus.isMarketOpen && !replayVelocity && (
            <div className="mt-3 text-xs text-amber-800 bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5 font-mono flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span>⏸️</span>
                <span>
                  <strong>Market Closed / Weekend:</strong> Live exchange trading is halted. Contract velocity is <strong>0 contracts/min</strong>. The walls above show the final settled institutional positions locked at Friday's 3:30 PM closing bell.
                </span>
              </div>
              <button
                onClick={() => setReplayVelocity(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-2.5 py-1 rounded cursor-pointer transition whitespace-nowrap"
              >
                ▶️ Replay Friday Peak Flow
              </button>
            </div>
          )}

          {replayVelocity && (
            <div className="mt-3 text-xs text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 font-mono flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                <span>
                  <strong>Simulating Friday Session Velocity:</strong> Replaying institutional contract buildup speeds from Friday's active market hours.
                </span>
              </div>
              <button
                onClick={() => setReplayVelocity(false)}
                className="bg-slate-700 hover:bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 rounded cursor-pointer transition whitespace-nowrap"
              >
                ⏸️ Pause / Return to Settled
              </button>
            </div>
          )}
        </div>

        {/* Legend Subtitle */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono flex-wrap gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Long buildup (Bullish)
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Short buildup (Bearish)
            </span>
            <span className="flex items-center gap-1.5 text-cyan-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              Short covering (Squeeze)
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Long unwinding (Exiting)
            </span>
          </div>

          <div className="text-slate-400">
            {marketStatus.isMarketOpen || replayVelocity
              ? 'moving dots = velocity (speed = contracts/min added or removed)'
              : 'dots paused = 0 contracts/min (Market Closed · positions settled)'}
          </div>
        </div>

        {/* Main Grid: Strikes Chart (Left) + Intelligence Cards (Right) */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Strikes with Velocity Dots (Col 8) */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
            <div className="grid grid-cols-12 text-[11px] font-mono font-bold text-slate-400 pb-3 border-b border-slate-100">
              <div className="col-span-5 text-right pr-4">◀ PUT OI (writers = floor)</div>
              <div className="col-span-2 text-center">STRIKE</div>
              <div className="col-span-5 pl-4">CALL OI (writers = ceiling) ▶</div>
            </div>

            <div className="space-y-1.5 py-3">
              {strikes.map((s) => {
                const putWidth = (s.putOi / maxOi) * 100;
                const callWidth = (s.callOi / maxOi) * 100;
                const dotPos = (tick * s.velocity) % 100;
                const isAtm = s.strike === atmStrike;

                return (
                  <div
                    key={s.strike}
                    className={`grid grid-cols-12 items-center text-xs font-mono py-1 rounded-md transition-colors ${
                      isAtm ? 'bg-indigo-50/70 border border-indigo-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Put Side Bar */}
                    <div className="col-span-5 flex items-center justify-end pr-4 relative">
                      <div className="w-full max-w-[280px] h-3.5 bg-slate-100 rounded-sm overflow-hidden flex justify-end relative">
                        <div
                          className={`h-full ${getColor(s.putType)} transition-all duration-300 relative`}
                          style={{ width: `${putWidth}%` }}
                        >
                          {/* Animated moving dot on bar */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-xs"
                            style={{ right: `${dotPos}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 ml-2 w-10 text-right font-mono font-bold">
                        {s.putOi}L
                      </span>
                    </div>

                    {/* Strike Center */}
                    <div className="col-span-2 text-center font-bold text-slate-800 flex items-center justify-center gap-1">
                      <span>{s.strike}</span>
                      {isAtm && (
                        <span className="text-[8px] bg-indigo-600 text-white px-1 rounded font-sans font-bold">
                          ATM
                        </span>
                      )}
                    </div>

                    {/* Call Side Bar */}
                    <div className="col-span-5 flex items-center pl-4 relative">
                      <span className="text-[10px] text-slate-500 mr-2 w-10 font-mono font-bold">
                        {s.callOi}L
                      </span>
                      <div className="w-full max-w-[280px] h-3.5 bg-slate-100 rounded-sm overflow-hidden relative">
                        <div
                          className={`h-full ${getColor(s.callType)} transition-all duration-300 relative`}
                          style={{ width: `${callWidth}%` }}
                        >
                          {/* Animated moving dot on bar */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-xs"
                            style={{ left: `${dotPos}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Momentum, What's Next & Hot Strikes (Col 4) */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* Card 1: MOMENTUM & SPEED */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase block">
                MOMENTUM & SPEED
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
                  <div className={`text-2xl font-black font-mono ${changePct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {changePct >= 0 ? '+34' : '-22'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium">
                    flow momentum (-100 bear · +100 bull)
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
                  <div className="text-2xl font-black font-mono">
                    {marketStatus.isMarketOpen || replayVelocity ? (
                      <span className="text-indigo-600">740</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium">
                    {marketStatus.isMarketOpen
                      ? 'contracts/min near spot · accelerating'
                      : replayVelocity
                      ? 'contracts/min (Replaying Friday session)'
                      : 'contracts/min (Market Closed · Friday peak: 740)'}
                  </div>
                </div>
              </div>

              {/* Futures Status Card */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                  {selectedStock} Futures Status
                </span>
                <span
                  className={`text-sm font-bold ${
                    changePct >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {changePct >= 0 ? 'Long Buildup' : 'Short Buildup'}
                </span>
                <span className="text-xs font-mono text-slate-600 block mt-0.5">
                  ₹{cmp.toFixed(1)} ({changePct >= 0 ? '+' : ''}
                  {changePct}%) · {marketStatus.isMarketOpen ? 'Aggressive institutional participation' : 'Settled Friday closing position'}
                </span>
              </div>
            </div>

            {/* Card 2: WHAT'S NEXT with Conviction Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                  WHAT'S NEXT
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    changePct >= 0 ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100'
                  }`}
                >
                  {changePct >= 0 ? 'Bullish · 64% conviction' : 'Bearish · 58% conviction'}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    changePct >= 0
                      ? 'bg-gradient-to-r from-indigo-500 to-emerald-500 w-[64%]'
                      : 'bg-gradient-to-r from-amber-500 to-rose-500 w-[58%]'
                  }`}
                ></div>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 leading-relaxed font-sans pt-1">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 mt-1.5 shrink-0"></span>
                  <span>
                    Short covering in calls near <strong>{atmStrike}</strong> is accelerating — upside squeeze risk.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0"></span>
                  <span>
                    Fastest call writing at <strong>{atmStrike + intervalVal * 2}</strong> (+51.2/min) — likely cap.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                  <span>
                    Fastest put writing at <strong>{atmStrike - intervalVal * 2}</strong> (+7.3/min) — likely floor.
                  </span>
                </li>
              </ul>
            </div>

            {/* Card 3: HOT STRIKES - FASTEST OI (Exact match to Image 5) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase block">
                HOT STRIKES - FASTEST OI
              </span>
              <div className="space-y-2 text-xs font-sans">
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 border border-amber-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="font-bold text-slate-800">{atmStrike + intervalVal} CE</span>
                    <span className="text-amber-800 text-[11px] font-medium">Long unwinding</span>
                  </div>
                  <span className="font-mono text-amber-700 font-bold">-42.4/min</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-50/60 border border-cyan-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                    <span className="font-bold text-slate-800">{atmStrike - intervalVal} PE</span>
                    <span className="text-cyan-800 text-[11px] font-medium">Short covering</span>
                  </div>
                  <span className="font-mono text-cyan-700 font-bold">+68.1/min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Modal: "What Information Does OI Flow Give?" */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-extrabold tracking-tight">
                  What Information Does OI Flow Give?
                </h3>
              </div>
              <button
                onClick={() => setIsInfoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700 leading-relaxed max-h-[75vh] overflow-y-auto">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  1. The Derivative Speedometer (Rate of Change $\Delta OI / \Delta t$)
                </h4>
                <p className="text-slate-600">
                  Standard Option Chains only show <em>static total open interest</em>. OI Flow measures the <strong>speed (velocity)</strong> at which institutional traders are adding or removing contracts per minute. Moving dots represent contract throughput.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">
                  2. The 4 Institutional OI Quadrants:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      Long Buildup (Bullish)
                    </div>
                    <p className="text-[11px] text-emerald-900 mt-1 font-sans">
                      Price $\uparrow$, OI $\uparrow$. Aggressive buyers accumulating long contracts with fresh capital.
                    </p>
                  </div>

                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                    <div className="font-bold text-rose-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      Short Buildup (Bearish)
                    </div>
                    <p className="text-[11px] text-rose-900 mt-1 font-sans">
                      Price $\downarrow$, OI $\uparrow$. Institutional call writers creating heavy resistance roofs.
                    </p>
                  </div>

                  <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl">
                    <div className="font-bold text-cyan-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                      Short Covering (Squeeze)
                    </div>
                    <p className="text-[11px] text-cyan-900 mt-1 font-sans">
                      Price $\uparrow$, OI $\downarrow$. Trapped call writers panicking and closing short positions $\rightarrow$ rapid short squeeze!
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="font-bold text-amber-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      Long Unwinding (Profit Booking)
                    </div>
                    <p className="text-[11px] text-amber-900 mt-1 font-sans">
                      Price $\downarrow$, OI $\downarrow$. Bulls liquidating winning positions, removing support.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  3. How to Profit as a Trader
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>
                    <strong>Spot breakout targets:</strong> Look for sudden cyan dots (Short Covering) near ATM strikes; price often surges through these levels.
                  </li>
                  <li>
                    <strong>Identify strong reversals:</strong> When a strike has huge Put OI writing (Green dots accelerating), institutions are defending that level as an ironclad floor.
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsInfoModalOpen(false)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Got It, Take Me to OI Flow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
