'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertCircle, ArrowUpRight, X, Sparkles, Check, Layers } from 'lucide-react';

interface StrangleStock {
  id: string;
  name: string;
  cmp: number;
  realisedVol: number; // 20d realised vol % (X axis)
  stayedInRange: number; // % stayed in range (Y axis)
  premiumPerLot: number; // size
  status: 'RESULTS_OUT' | 'RESULTS_BEFORE_EXPIRY' | 'DATE_TBA';
  callStrike: number;
  putStrike: number;
  lotSize: number;
  winProb: number;
}

export default function CalmZoneScatter() {
  const stocks: StrangleStock[] = [
    {
      id: 'CIPLA',
      name: 'CIPLA',
      cmp: 1542,
      realisedVol: 11.8,
      stayedInRange: 94,
      premiumPerLot: 3850,
      status: 'RESULTS_BEFORE_EXPIRY',
      callStrike: 1620,
      putStrike: 1460,
      lotSize: 650,
      winProb: 92,
    },
    {
      id: 'SUNPHARMA',
      name: 'SUNPHARMA',
      cmp: 1890,
      realisedVol: 13.2,
      stayedInRange: 92,
      premiumPerLot: 4200,
      status: 'RESULTS_BEFORE_EXPIRY',
      callStrike: 1980,
      putStrike: 1800,
      lotSize: 350,
      winProb: 89,
    },
    {
      id: 'HDFCBANK',
      name: 'HDFCBANK',
      cmp: 1680,
      realisedVol: 14.5,
      stayedInRange: 90,
      premiumPerLot: 4800,
      status: 'RESULTS_OUT',
      callStrike: 1760,
      putStrike: 1600,
      lotSize: 550,
      winProb: 88,
    },
    {
      id: 'POWERGRID',
      name: 'POWERGRID',
      cmp: 318,
      realisedVol: 15.0,
      stayedInRange: 88,
      premiumPerLot: 3200,
      status: 'RESULTS_OUT',
      callStrike: 335,
      putStrike: 300,
      lotSize: 2000,
      winProb: 86,
    },
    {
      id: 'ICICIBANK',
      name: 'ICICIBANK',
      cmp: 1245,
      realisedVol: 15.8,
      stayedInRange: 87,
      premiumPerLot: 4600,
      status: 'RESULTS_OUT',
      callStrike: 1300,
      putStrike: 1180,
      lotSize: 700,
      winProb: 85,
    },
    {
      id: 'LUPIN',
      name: 'LUPIN',
      cmp: 2180,
      realisedVol: 16.4,
      stayedInRange: 86,
      premiumPerLot: 5100,
      status: 'RESULTS_BEFORE_EXPIRY',
      callStrike: 2300,
      putStrike: 2060,
      lotSize: 300,
      winProb: 84,
    },
    {
      id: 'RELIANCE',
      name: 'RELIANCE',
      cmp: 2680,
      realisedVol: 16.9,
      stayedInRange: 85,
      premiumPerLot: 6200,
      status: 'RESULTS_BEFORE_EXPIRY',
      callStrike: 2820,
      putStrike: 2540,
      lotSize: 250,
      winProb: 83,
    },
    {
      id: 'ONGC',
      name: 'ONGC',
      cmp: 284,
      realisedVol: 17.5,
      stayedInRange: 84,
      premiumPerLot: 2900,
      status: 'DATE_TBA',
      callStrike: 300,
      putStrike: 268,
      lotSize: 2250,
      winProb: 82,
    },
    // Moderate / Outlier stocks (outside Calm Zone)
    {
      id: 'INFY',
      name: 'INFY',
      cmp: 1840,
      realisedVol: 22.0,
      stayedInRange: 72,
      premiumPerLot: 5400,
      status: 'RESULTS_OUT',
      callStrike: 1960,
      putStrike: 1720,
      lotSize: 400,
      winProb: 74,
    },
    {
      id: 'TCS',
      name: 'TCS',
      cmp: 4120,
      realisedVol: 24.5,
      stayedInRange: 68,
      premiumPerLot: 6800,
      status: 'RESULTS_OUT',
      callStrike: 4350,
      putStrike: 3900,
      lotSize: 175,
      winProb: 70,
    },
    {
      id: 'TATAMOTORS',
      name: 'TATAMOTORS',
      cmp: 884,
      realisedVol: 29.0,
      stayedInRange: 58,
      premiumPerLot: 7200,
      status: 'RESULTS_BEFORE_EXPIRY',
      callStrike: 950,
      putStrike: 820,
      lotSize: 500,
      winProb: 62,
    },
    {
      id: 'ADANIENT',
      name: 'ADANIENT',
      cmp: 2920,
      realisedVol: 36.4,
      stayedInRange: 46,
      premiumPerLot: 11500,
      status: 'DATE_TBA',
      callStrike: 3200,
      putStrike: 2640,
      lotSize: 300,
      winProb: 52,
    },
  ];

  const [stockList, setStockList] = useState<StrangleStock[]>(stocks);
  const [selectedStock, setSelectedStock] = useState<StrangleStock | null>(stocks[0]);
  const [hoveredStock, setHoveredStock] = useState<StrangleStock | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [lots, setLots] = useState(1);
  const [lastSync, setLastSync] = useState<string>('');

  useEffect(() => {
    const fetchLiveQuotes = async () => {
      try {
        const res = await fetch('/api/live-stocks');
        if (res.ok) {
          const data = await res.json();
          if (data.stocks && Array.isArray(data.stocks)) {
            setStockList((prev) =>
              prev.map((item) => {
                const match = data.stocks.find((s: any) => s.symbol === item.id);
                if (match) {
                  const p = Math.round(match.price);
                  const step = p > 2000 ? 50 : p > 500 ? 10 : 5;
                  const cs = Math.round((p * 1.05) / step) * step;
                  const ps = Math.round((p * 0.95) / step) * step;
                  const updated = {
                    ...item,
                    cmp: p,
                    callStrike: cs,
                    putStrike: ps,
                    premiumPerLot: Math.round(item.premiumPerLot * (p / item.cmp)),
                  };
                  if (selectedStock && selectedStock.id === item.id) {
                    setSelectedStock(updated);
                  }
                  return updated;
                }
                return item;
              })
            );
            setLastSync(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
          }
        }
      } catch (e) {
        // preserve
      }
    };

    fetchLiveQuotes();
    const interval = setInterval(fetchLiveQuotes, 15000);
    return () => clearInterval(interval);
  }, []);

  const active = hoveredStock || selectedStock || stockList[0];

  const handleDeployOrder = () => {
    setDeploySuccess(true);
    // save to localStorage journal
    try {
      const existing = JSON.parse(localStorage.getItem('calm_zone_strangles') || '[]');
      const newTrade = {
        id: 'STRANGLE-' + Date.now(),
        symbol: active.name,
        putStrike: active.putStrike,
        callStrike: active.callStrike,
        premiumPerLot: active.premiumPerLot,
        lots,
        totalCredit: active.premiumPerLot * lots,
        timestamp: new Date().toISOString(),
        status: 'ACTIVE_HARVEST',
      };
      localStorage.setItem('calm_zone_strangles', JSON.stringify([newTrade, ...existing]));
    } catch {}

    setTimeout(() => {
      setDeploySuccess(false);
      setIsDeployModalOpen(false);
    }, 1800);
  };

  // Coordinates mapping
  // X: realisedVol from 10% to 45%
  // Y: stayedInRange from 30% to 100%
  const minVol = 10;
  const maxVol = 45;
  const minRange = 30;
  const maxRange = 100;

  const getX = (vol: number) => {
    return ((vol - minVol) / (maxVol - minVol)) * 100;
  };

  const getY = (range: number) => {
    return 100 - ((range - minRange) / (maxRange - minRange)) * 100;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans p-4 md:p-6 select-none">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Dynamic Running Headline Alert Banner (From Reel) */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex items-center justify-between gap-4">
          <div className="text-sm font-bold text-slate-800">
            for 23-Nov-2026 strangles (33 days):{' '}
            <span className="text-[#4F46E5] font-extrabold">CIPLA, SUNPHARMA, ONGC</span>
          </div>
          <span className="text-xs text-emerald-700 font-mono font-medium flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            NSE & BSE Live Feed {lastSync ? `• ${lastSync}` : '· Real-time Volatility Matrix'}
          </span>
        </div>

        {/* Legend Subtitle (From Reel) */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-700">STRANGLE FINDER</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              results out
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              results before expiry
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              date TBA
            </span>
            <span>·</span>
            <span>size = premium / lot</span>
          </div>

          <div className="text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Top-left = High probability non-directional harvest
          </div>
        </div>

        {/* Main 2D Scatter Chart Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-6 shadow-xs relative">
          <div className="grid grid-cols-12 gap-4 sm:gap-6">
            {/* Chart Canvas Area */}
            <div className="col-span-12 lg:col-span-9 relative h-[360px] sm:h-[460px] lg:h-[580px] bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden p-3 sm:p-6">
              {/* Highlighted CALM ZONE Quadrant (Top Left) */}
              <div
                className="absolute top-0 left-0 bg-emerald-500/10 border-r-2 border-b-2 border-dashed border-emerald-400/50 pointer-events-none z-0"
                style={{
                  width: `${getX(19)}%`,
                  height: `${getY(80)}%`,
                }}
              >
                <div className="p-3">
                  <span className="inline-block px-2.5 py-1 bg-emerald-600 text-white font-mono font-bold text-xs rounded-md shadow-xs tracking-wider">
                    CALM ZONE
                  </span>
                  <p className="text-[10px] text-emerald-800 font-medium mt-1">
                    Vol &lt; 19% · Range &gt; 80% (Safe Non-Directional)
                  </p>
                </div>
              </div>

              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                <div className="border-r border-b border-slate-200/60"></div>
                <div className="border-r border-b border-slate-200/60"></div>
                <div className="border-r border-b border-slate-200/60"></div>
                <div className="border-b border-slate-200/60"></div>

                <div className="border-r border-b border-slate-200/60"></div>
                <div className="border-r border-b border-slate-200/60"></div>
                <div className="border-r border-b border-slate-200/60"></div>
                <div className="border-b border-slate-200/60"></div>

                <div className="border-r border-b border-slate-200/60"></div>
                <div className="border-r border-b border-slate-200/60"></div>
                <div className="border-r border-b border-slate-200/60"></div>
                <div className="border-b border-slate-200/60"></div>
              </div>

              {/* Y Axis Label */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-mono font-semibold text-slate-400 pointer-events-none">
                ↑ % stayed in range
              </div>

              {/* X Axis Label */}
              <div className="absolute bottom-2 right-4 text-xs font-mono font-semibold text-slate-400 pointer-events-none">
                realised volatility (20d, %) →
              </div>

              {/* Floating Interactive Bubbles */}
              {stockList.map((stock) => {
                const posX = getX(stock.realisedVol);
                const posY = getY(stock.stayedInRange);
                const isCalm = stock.realisedVol <= 19 && stock.stayedInRange >= 80;

                let bubbleBg = 'bg-slate-400';
                let bubbleBorder = 'border-slate-500';
                if (stock.status === 'RESULTS_OUT') {
                  bubbleBg = 'bg-emerald-500';
                  bubbleBorder = 'border-emerald-600';
                } else if (stock.status === 'RESULTS_BEFORE_EXPIRY') {
                  bubbleBg = 'bg-amber-500';
                  bubbleBorder = 'border-amber-600';
                }

                // Size scale
                const radiusPx = 28 + (stock.premiumPerLot / 12000) * 24;

                const isSelected = selectedStock?.id === stock.id;

                return (
                  <div
                    key={stock.id}
                    onClick={() => setSelectedStock(stock)}
                    onMouseEnter={() => setHoveredStock(stock)}
                    onMouseLeave={() => setHoveredStock(null)}
                    style={{
                      left: `${posX}%`,
                      top: `${posY}%`,
                      width: `${radiusPx}px`,
                      height: `${radiusPx}px`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer flex flex-col items-center justify-center transition-transform hover:scale-125 z-10 shadow-sm ${bubbleBg} ${
                      isSelected ? 'ring-4 ring-[#4F46E5] ring-offset-2' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-white leading-none drop-shadow-xs">
                      {stock.name}
                    </span>
                    {isCalm && (
                      <span className="text-[8px] font-mono text-emerald-100">
                        {stock.stayedInRange}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sidebar Details Panel */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">
                  Selected Opportunity
                </h3>
                {selectedStock || hoveredStock ? (
                  (() => {
                    const s = hoveredStock || selectedStock!;
                    return (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <span className="text-base font-bold text-slate-800">{s.name}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                            {s.winProb}% Win Prob
                          </span>
                        </div>

                        <div className="flex justify-between text-slate-600">
                          <span>Spot Price:</span>
                          <span className="font-bold text-slate-900">₹{s.cmp}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>20D Volatility:</span>
                          <span className="font-bold text-slate-900">{s.realisedVol}%</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Stayed in Range:</span>
                          <span className="font-bold text-emerald-600">{s.stayedInRange}%</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Strangle Corridor:</span>
                          <span className="font-bold text-indigo-600">
                            PE {s.putStrike} - CE {s.callStrike}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Est. Premium / Lot:</span>
                          <span className="font-bold text-emerald-700">₹{s.premiumPerLot}</span>
                        </div>

                        <button
                          onClick={() => setIsDeployModalOpen(true)}
                          className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-2.5 px-3 rounded-lg font-bold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          Deploy Strangle Plan
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-xs text-slate-400">
                    Hover or click any bubble on the scatter plot to inspect Strangle strikes, volatility metrics, and win probability.
                  </p>
                )}
              </div>

              {/* Calm Zone Philosophy Note */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  The Calm Zone Advantage
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Stocks in the upper-left have subdued realised volatility but command high option premiums due to upcoming expiry skew. Selling wide strangles here captures pure time decay with low delta risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Deploy Strangle Modal */}
      {isDeployModalOpen && active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg tracking-tight">{active.name}</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {active.winProb}% Win Prob
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calm Zone Wide Strangle Deployment • CMP ₹{active.cmp}
                </p>
              </div>
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 font-mono text-xs">
              {/* Strangle Legs */}
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Execution Legs (Monthly Expiry)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-[10px] text-emerald-700 font-bold uppercase">Leg 1 • Put Side</div>
                    <div className="text-sm font-extrabold text-emerald-900 mt-0.5">
                      SELL {active.putStrike} PE
                    </div>
                    <div className="text-[10px] text-slate-600 mt-1 flex justify-between">
                      <span>Delta: ~0.12</span>
                      <span className="text-emerald-700 font-bold">OTM Support</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                    <div className="text-[10px] text-rose-700 font-bold uppercase">Leg 2 • Call Side</div>
                    <div className="text-sm font-extrabold text-rose-900 mt-0.5">
                      SELL {active.callStrike} CE
                    </div>
                    <div className="text-[10px] text-slate-600 mt-1 flex justify-between">
                      <span>Delta: ~0.12</span>
                      <span className="text-rose-700 font-bold">OTM Resist</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sizing & Capital */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Lots to Sell:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLots(Math.max(1, lots - 1))}
                      className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-slate-900 w-6 text-center">{lots}</span>
                    <button
                      onClick={() => setLots(lots + 1)}
                      className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                    <span className="text-[10px] text-slate-500">({active.lotSize * lots} qty)</span>
                  </div>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Net Premium Credit:</span>
                  <span className="font-bold text-emerald-700">₹{(active.premiumPerLot * lots).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Est. Margin Required:</span>
                  <span className="font-bold text-slate-900">₹{(145000 * lots).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Target Exit:</span>
                  <span className="font-bold text-indigo-700">65% Theta Decay (₹{(active.premiumPerLot * lots * 0.65).toFixed(0)})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Stop Loss Rule:</span>
                  <span className="font-bold text-rose-600">2x Individual Leg Premium</span>
                </div>
              </div>

              {/* Success Notification */}
              {deploySuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold">
                    Strangle order placed & registered in Trade Journal!
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeployModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deploySuccess}
                  onClick={handleDeployOrder}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {deploySuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      Deployed!
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Execute Strangle
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
