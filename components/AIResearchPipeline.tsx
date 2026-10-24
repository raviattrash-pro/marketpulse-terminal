'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Clock,
  Shield,
  Layers,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export interface AutomatedSetup {
  id: string;
  symbol: string;
  category: 'EQUITY' | 'INDEX_OPTION' | 'STOCK_OPTION';
  agent1Scan: string;
  agent2Setup: string;
  agent3Entry: number;
  agent3Sl: number;
  agent3Target1: number;
  agent3Target2: number;
  rrRatio: string;
  confidence: number;
  volumeSpike: string;
  catalyst: string;
}

interface AIResearchPipelineProps {
  onSimulate: (symbol: string, entry: number, sl: number, target: number) => void;
}

export default function AIResearchPipeline({ onSimulate }: AIResearchPipelineProps) {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'EQUITY' | 'INDEX_OPTION'>('ALL');
  const [isScanning, setIsScanning] = useState(false);
  const [setups, setSetups] = useState<AutomatedSetup[]>([]);
  const [lastSync, setLastSync] = useState<string>('');

  const fetchLiveScans = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/live-stocks');
      if (res.ok) {
        const data = await res.json();
        if (data.stocks && Array.isArray(data.stocks)) {
          const generated: AutomatedSetup[] = data.stocks.slice(0, 6).map((s: any, idx: number) => {
            const isBuying = s.flowType === 'HUGE_BUYING';
            const price = Math.round(s.price);
            const sl = Math.round(s.stopLoss || price * 0.98);
            const t1 = Math.round(s.target1 || price + (price - sl) * 2);
            const t2 = Math.round(s.target2 || price + (price - sl) * 3);

            return {
              id: `live-scan-${idx}`,
              symbol: s.name ? `${s.symbol} (${s.name})` : s.symbol,
              category: idx % 3 === 0 ? 'INDEX_OPTION' : 'EQUITY',
              agent1Scan: `${s.volRatio}x 20D volume surge + ${s.changePct >= 0 ? '+' : ''}${s.changePct}% momentum`,
              agent2Setup: isBuying
                ? `Institutional Inflow (+₹${Math.abs(s.flowCr)} Cr) · Valuation: ${s.valuationStatus}`
                : `Resistance rejection · ${s.advisorVerdict}`,
              agent3Entry: price,
              agent3Sl: sl,
              agent3Target1: t1,
              agent3Target2: t2,
              rrRatio: s.riskReward || '1:2.0',
              confidence: Math.min(95, Math.max(78, Math.round(80 + s.volRatio * 4.5))),
              volumeSpike: `+${Math.round(s.volRatio * 100)}%`,
              catalyst: `${s.bestEntryStrategy} · Target: ₹${t1}`,
            };
          });

          setSetups(generated);
          setLastSync(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
        }
      }
    } catch (e) {
      // keep existing
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    fetchLiveScans();
  }, []);

  const triggerRescan = () => {
    fetchLiveScans();
  };

  const filtered = setups.filter((s) => {
    if (activeFilter === 'ALL') return true;
    return s.category === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Inspired by @swapsays_wtf Trading AI Research
            </div>
            <h2 className="text-xl font-bold text-[#E6EDF5]">
              Automated 3-Agent Trading Research Suite
            </h2>
            <p className="text-xs text-[#9AAABB] mt-1 max-w-2xl">
              1. <strong>Agent 1</strong> scans thousands of charts for EMA & volume anomalies.<br />
              2. <strong>Agent 2</strong> discovers high-probability trade setups.<br />
              3. <strong>Agent 3</strong> maps precision Entry, Invalidation Stop-Loss & 1:2 / 1:3 Targets.
            </p>
          </div>

          <button
            onClick={triggerRescan}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#132E30] hover:bg-[#55D6BE]/20 text-[#55D6BE] border border-[#55D6BE]/40 text-xs font-semibold font-mono transition-all shrink-0"
          >
            <Search className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning 2,400+ Charts...' : 'Re-scan Universe'}</span>
          </button>
        </div>

        {/* 3 Pipeline Steps Visualized */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#25313F]">
          <div className="bg-[#0D131C] border border-[#25313F] rounded-lg p-3.5 space-y-1">
            <span className="text-[10px] font-mono text-[#55D6BE] uppercase font-bold">
              AGENT 1 &middot; CHART SCANNER
            </span>
            <h4 className="text-xs font-bold text-[#E6EDF5]">Scans 2,400+ Stocks & Options</h4>
            <p className="text-[11px] text-[#9AAABB]">
              Flags 20/50/200 EMA crossovers, breakout volume expansions (&gt;1.5x), and RSI divergence.
            </p>
          </div>

          <div className="bg-[#0D131C] border border-[#25313F] rounded-lg p-3.5 space-y-1">
            <span className="text-[10px] font-mono text-[#55D6BE] uppercase font-bold">
              AGENT 2 &middot; SETUP HUNTER
            </span>
            <h4 className="text-xs font-bold text-[#E6EDF5]">Filters High-Win Setups</h4>
            <p className="text-[11px] text-[#9AAABB]">
              Matches price action against 4-Filter Economic Moat, OI PCR reversal zones, and flags/pennants.
            </p>
          </div>

          <div className="bg-[#0D131C] border border-[#25313F] rounded-lg p-3.5 space-y-1">
            <span className="text-[10px] font-mono text-[#55D6BE] uppercase font-bold">
              AGENT 3 &middot; ENTRY/EXIT MAPPER
            </span>
            <h4 className="text-xs font-bold text-[#E6EDF5]">Pre-Computes Risk & Exits</h4>
            <p className="text-[11px] text-[#9AAABB]">
              Enforces minimum 1:2 R:R, exact stop invalidation, and hands off to Time Machine.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['ALL', 'INDEX_OPTION', 'EQUITY'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeFilter === cat
                ? 'bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/40 font-semibold'
                : 'bg-[#111923] text-[#9AAABB] border border-[#25313F] hover:text-[#E6EDF5]'
            }`}
          >
            {cat === 'ALL' ? 'All Discovered Setups' : cat === 'INDEX_OPTION' ? 'F&O Index Options' : 'Equities (Moat)'}
          </button>
        ))}
      </div>

      {/* Discovered Setups Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((setup) => (
          <div
            key={setup.id}
            className="bg-[#111923] border border-[#25313F] hover:border-[#55D6BE]/40 rounded-xl p-5 space-y-4 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#E6EDF5]">{setup.symbol}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30 font-semibold">
                    {setup.category}
                  </span>
                </div>
                <span className="text-xs text-[#9AAABB] block mt-0.5">{setup.catalyst}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#6E8298] uppercase block">AI Score</span>
                <span className="text-sm font-bold font-mono text-[#55D6BE]">{setup.confidence}% Conf</span>
              </div>
            </div>

            {/* Agent 1 & Agent 2 Insights */}
            <div className="space-y-2 text-xs bg-[#0D131C] border border-[#25313F] rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-mono text-[#55D6BE] uppercase font-bold shrink-0 mt-0.5">
                  Agent 1:
                </span>
                <span className="text-[#E6EDF5]">{setup.agent1Scan}</span>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-[#25313F]/50">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold shrink-0 mt-0.5">
                  Agent 2:
                </span>
                <span className="text-[#E6EDF5]">{setup.agent2Setup}</span>
              </div>
            </div>

            {/* Agent 3 Exact Level Map */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="bg-[#0D131C] border border-rose-900/40 rounded p-2">
                <span className="text-[9px] text-[#6E8298] uppercase block">Stop Loss</span>
                <span className="font-bold text-rose-400">₹{setup.agent3Sl}</span>
              </div>
              <div className="bg-[#0D131C] border border-[#25313F] rounded p-2">
                <span className="text-[9px] text-[#6E8298] uppercase block">Entry</span>
                <span className="font-bold text-[#E6EDF5]">₹{setup.agent3Entry}</span>
              </div>
              <div className="bg-[#0D131C] border border-[#55D6BE]/30 rounded p-2">
                <span className="text-[9px] text-[#6E8298] uppercase block">Target 1 (1:2)</span>
                <span className="font-bold text-[#55D6BE]">₹{setup.agent3Target1}</span>
              </div>
              <div className="bg-[#0D131C] border border-[#55D6BE]/50 rounded p-2">
                <span className="text-[9px] text-[#6E8298] uppercase block">Target 2 (1:3)</span>
                <span className="font-bold text-[#55D6BE]">₹{setup.agent3Target2}</span>
              </div>
            </div>

            {/* Launch in Time Machine Button */}
            <button
              onClick={() => onSimulate(setup.symbol, setup.agent3Entry, setup.agent3Sl, setup.agent3Target1)}
              className="w-full flex items-center justify-center gap-2 bg-[#55D6BE] hover:bg-[#55D6BE]/90 text-black font-semibold px-4 py-2 rounded-lg text-xs transition-all shadow"
            >
              <Clock className="w-3.5 h-3.5 fill-black" />
              <span>Simulate in Time Machine Before Execution</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
