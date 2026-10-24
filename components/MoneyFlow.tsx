'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Layers,
  Shield,
  Activity,
  Zap,
} from 'lucide-react';

interface SectorFlow {
  name: string;
  inflow: number; // in Cr
  outflow: number;
  net: number;
  momentum: 'ACCUMULATION' | 'DISTRIBUTION' | 'NEUTRAL';
  leadingStock: string;
}

export default function MoneyFlow() {
  const [activeTab, setActiveTab] = useState<'SECTORS' | 'STOCKS' | 'LIQUIDITY'>('SECTORS');

  const sectorFlows: SectorFlow[] = [
    {
      name: 'Banking & Financials',
      inflow: 2450,
      outflow: 1210,
      net: +1240,
      momentum: 'ACCUMULATION',
      leadingStock: 'HDFC Bank (+1.4%), SBI (+2.1%)',
    },
    {
      name: 'Automobiles & EV',
      inflow: 1180,
      outflow: 560,
      net: +620,
      momentum: 'ACCUMULATION',
      leadingStock: 'Tata Motors (+1.8%), M&M (+1.2%)',
    },
    {
      name: 'Metals & Mining',
      inflow: 890,
      outflow: 510,
      net: +380,
      momentum: 'ACCUMULATION',
      leadingStock: 'Tata Steel (+2.4%), JSW Steel (+1.6%)',
    },
    {
      name: 'Energy & Oil',
      inflow: 940,
      outflow: 730,
      net: +210,
      momentum: 'NEUTRAL',
      leadingStock: 'Reliance (+0.6%), ONGC (+0.8%)',
    },
    {
      name: 'Pharma & Healthcare',
      inflow: 420,
      outflow: 570,
      net: -150,
      momentum: 'DISTRIBUTION',
      leadingStock: 'Sun Pharma (-0.4%), Cipla (-0.9%)',
    },
    {
      name: 'FMCG & Consumption',
      inflow: 580,
      outflow: 860,
      net: -280,
      momentum: 'DISTRIBUTION',
      leadingStock: 'HUL (-1.1%), ITC (+0.2%)',
    },
    {
      name: 'Information Technology',
      inflow: 820,
      outflow: 1530,
      net: -710,
      momentum: 'DISTRIBUTION',
      leadingStock: 'Infosys (-1.4%), TCS (-0.8%)',
    },
  ];

  const topInflowStocks = [
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', netFlow: '+₹540 Cr', change: '+1.6%', type: 'INSTITUTIONAL BUYING' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', netFlow: '+₹380 Cr', change: '+2.1%', type: 'VOLUME BREAKOUT' },
    { symbol: 'RELIANCE', name: 'Reliance Industries', netFlow: '+₹310 Cr', change: '+0.8%', type: 'BLOCK DEAL' },
    { symbol: 'TITAN', name: 'Titan Company Ltd', netFlow: '+₹240 Cr', change: '+1.4%', type: 'ACCUMULATION' },
    { symbol: 'SBIN', name: 'State Bank of India', netFlow: '+₹190 Cr', change: '+1.9%', type: 'FII INFLOW' },
  ];

  const topOutflowStocks = [
    { symbol: 'INFY', name: 'Infosys Ltd', netFlow: '-₹420 Cr', change: '-1.4%', type: 'LONG UNWINDING' },
    { symbol: 'TCS', name: 'Tata Consultancy', netFlow: '-₹290 Cr', change: '-0.9%', type: 'PROFIT BOOKING' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', netFlow: '-₹180 Cr', change: '-1.2%', type: 'DISTRIBUTION' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', netFlow: '-₹160 Cr', change: '-0.7%', type: 'SHORT BUILDUP' },
    { symbol: 'WIPRO', name: 'Wipro Ltd', netFlow: '-₹110 Cr', change: '-1.8%', type: 'SECTOR ROTATION' },
  ];

  const liquidityPools = [
    {
      level: '24,500 – 24,540',
      type: 'BUY-SIDE LIQUIDITY (BSL)',
      cluster: 'Retail Stop-Losses clustered above swing high',
      action: 'High probability of institutional sweep / fakeout before reversal down.',
      intensity: 'VERY HIGH (₹2,100 Cr est.)',
      zone: 'DANGER ZONE FOR LATE LONGS',
    },
    {
      level: '24,200 – 24,220',
      type: 'SELL-SIDE LIQUIDITY (SSL)',
      cluster: 'Retail Stops placed below key morning demand zone',
      action: 'Institutional accumulation zone. Heavy Put writing cushion at 24,200.',
      intensity: 'STRONG (₹1,850 Cr est.)',
      zone: 'OPTIMAL ENTRY FOR SMART MONEY REVERSALS',
    },
    {
      level: '24,000 – 24,020',
      type: 'MAJOR STRUCTURAL SUPPORT POOL',
      cluster: 'Monthly psychological round number + maximum Put OI',
      action: 'Major institutional fortress. Improbable to break without global macro shocks.',
      intensity: 'MAXIMUM (₹3,400 Cr est.)',
      zone: 'FORTRESS SUPPORT',
    },
  ];

  const totalNet = sectorFlows.reduce((acc, s) => acc + s.net, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30 mb-2">
              <Coins className="w-3.5 h-3.5" /> Institutional Smart Money Pulse
            </div>
            <h2 className="text-xl font-bold text-[#E6EDF5]">
              Live Money Flow &amp; Liquidity Map
            </h2>
            <p className="text-xs text-[#9AAABB] mt-1 max-w-2xl">
              &ldquo;Subah uthte hi pata chale market mein paisa kahan aa raha hai aur kahan ja raha hai.&rdquo;
              Track real-time institutional sector rotation, big-player accumulation, and stop-hunt liquidity pools.
            </p>
          </div>

          <div className="bg-[#0D131C] border border-[#25313F] rounded-lg p-3 text-right shrink-0">
            <span className="text-[10px] font-mono text-[#6E8298] uppercase block">
              Market Net Institutional Flow
            </span>
            <div className={`text-xl font-bold font-mono ${totalNet >= 0 ? 'text-[#55D6BE]' : 'text-rose-400'}`}>
              {totalNet >= 0 ? `+₹${totalNet.toLocaleString('en-IN')} Cr` : `−₹${Math.abs(totalNet).toLocaleString('en-IN')} Cr`}
            </div>
            <span className="text-[10px] text-[#55D6BE] font-mono block">
              Smart Money Net Buyers Today
            </span>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#25313F]">
          <button
            onClick={() => setActiveTab('SECTORS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'SECTORS'
                ? 'bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/40 font-semibold'
                : 'bg-[#0D131C] text-[#9AAABB] border border-[#25313F] hover:text-[#E6EDF5]'
            }`}
          >
            Sector Flow Matrix
          </button>
          <button
            onClick={() => setActiveTab('STOCKS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'STOCKS'
                ? 'bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/40 font-semibold'
                : 'bg-[#0D131C] text-[#9AAABB] border border-[#25313F] hover:text-[#E6EDF5]'
            }`}
          >
            Top Inflow / Outflow Tickers
          </button>
          <button
            onClick={() => setActiveTab('LIQUIDITY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'LIQUIDITY'
                ? 'bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/40 font-semibold'
                : 'bg-[#0D131C] text-[#9AAABB] border border-[#25313F] hover:text-[#E6EDF5]'
            }`}
          >
            Stop-Hunt Liquidity Pools
          </button>
        </div>
      </div>

      {/* Tab 1: Sector Flow Matrix */}
      {activeTab === 'SECTORS' && (
        <div className="grid grid-cols-1 gap-3">
          {sectorFlows.map((sector) => {
            const isPositive = sector.net >= 0;
            const maxFlow = 2500;
            const barWidth = Math.min(100, (Math.abs(sector.net) / maxFlow) * 100);

            return (
              <div
                key={sector.name}
                className="bg-[#111923] border border-[#25313F] hover:border-[#55D6BE]/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1 min-w-[240px]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#E6EDF5]">{sector.name}</h3>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                        sector.momentum === 'ACCUMULATION'
                          ? 'bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30'
                          : sector.momentum === 'DISTRIBUTION'
                          ? 'bg-rose-950/70 text-rose-400 border border-rose-800'
                          : 'bg-[#0D131C] text-[#6E8298] border border-[#25313F]'
                      }`}
                    >
                      {sector.momentum}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6E8298] block">
                    Leaders: {sector.leadingStock}
                  </span>
                </div>

                {/* Flow Visual Bar */}
                <div className="flex-1 max-w-md space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-[#9AAABB]">
                    <span className="text-emerald-400">In: ₹{sector.inflow} Cr</span>
                    <span className="text-rose-400">Out: ₹{sector.outflow} Cr</span>
                  </div>
                  <div className="w-full bg-[#0D131C] h-2 rounded-full overflow-hidden flex border border-[#25313F]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isPositive ? 'bg-[#55D6BE]' : 'bg-rose-500'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                </div>

                {/* Net Badge */}
                <div className="text-right shrink-0 min-w-[120px]">
                  <span className="text-[10px] font-mono text-[#6E8298] uppercase block">
                    Net Rotation
                  </span>
                  <div
                    className={`text-base font-bold font-mono inline-flex items-center gap-1 ${
                      isPositive ? 'text-[#55D6BE]' : 'text-rose-400'
                    }`}
                  >
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span>{isPositive ? `+₹${sector.net} Cr` : `−₹${Math.abs(sector.net)} Cr`}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Top Inflow / Outflow Tickers */}
      {activeTab === 'STOCKS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Top Inflows */}
          <div className="bg-[#111923] border border-emerald-900/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25313F]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#55D6BE]" />
                <h3 className="text-sm font-bold text-[#E6EDF5]">Top Money Inflow Tickers</h3>
              </div>
              <span className="text-[10px] font-mono text-[#55D6BE] bg-[#132E30] px-2 py-0.5 rounded border border-[#55D6BE]/30">
                Paisa Aa Raha Hai
              </span>
            </div>

            <div className="space-y-3">
              {topInflowStocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="bg-[#0D131C] border border-[#25313F] rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#E6EDF5]">{stock.symbol}</span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/70 px-1 rounded">
                        {stock.change}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#6E8298]">{stock.name} &bull; {stock.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-[#55D6BE]">{stock.netFlow}</span>
                    <span className="text-[9px] text-[#6E8298] block">Net Inflow</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Outflows */}
          <div className="bg-[#111923] border border-rose-900/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25313F]">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-[#E6EDF5]">Top Money Outflow Tickers</h3>
              </div>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                Paisa Ja Raha Hai
              </span>
            </div>

            <div className="space-y-3">
              {topOutflowStocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="bg-[#0D131C] border border-[#25313F] rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#E6EDF5]">{stock.symbol}</span>
                      <span className="text-[9px] font-mono text-rose-400 bg-rose-950/70 px-1 rounded">
                        {stock.change}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#6E8298]">{stock.name} &bull; {stock.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-rose-400">{stock.netFlow}</span>
                    <span className="text-[9px] text-[#6E8298] block">Net Outflow</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Liquidity Pools Map */}
      {activeTab === 'LIQUIDITY' && (
        <div className="space-y-4">
          <div className="bg-[#0D131C] border border-[#25313F] rounded-xl p-4 text-xs text-[#9AAABB] flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#55D6BE] shrink-0" />
            <span>
              <strong>Smart Money Rule:</strong> Institutional algorithms do not chase prices; they hunt liquidity where retail stop-loss orders congregate. Enter after the liquidity sweep, never before it.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {liquidityPools.map((pool, idx) => (
              <div
                key={idx}
                className="bg-[#111923] border border-[#25313F] hover:border-[#55D6BE]/40 rounded-xl p-5 space-y-2 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#25313F]/50">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold font-mono text-[#55D6BE]">
                      NIFTY {pool.level}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30 font-semibold">
                      {pool.type}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">{pool.intensity}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#6E8298] block">
                      Order Clustering
                    </span>
                    <p className="text-[#E6EDF5] mt-0.5">{pool.cluster}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#6E8298] block">
                      Institutional Strategy
                    </span>
                    <p className="text-[#9AAABB] mt-0.5">{pool.action}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#0D131C] text-[#55D6BE] border border-[#25313F]">
                    {pool.zone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
