'use client';

import React, { useState } from 'react';
import { ShieldAlert, AlertOctagon, CheckCircle2, Lock, Unlock, RefreshCw, Zap } from 'lucide-react';

export default function RiskRules() {
  const [dailyLossLimit, setDailyLossLimit] = useState(3000);
  const [maxTradesPerDay, setMaxTradesPerDay] = useState(3);
  const [currentLoss, setCurrentLoss] = useState(1200);
  const [tradesToday, setTradesToday] = useState(2);
  const [circuitTripped, setCircuitTripped] = useState(false);

  const lossPctUsed = Math.min(100, Math.round((currentLoss / dailyLossLimit) * 100));

  const rules = [
    {
      num: '01',
      title: 'The 1%–2% Hard Capital Ceiling',
      source: 'Institutional Risk Standards',
      desc: 'Never risk more than 1.5% to 2% of total trading equity on any single position under any circumstances. If your account is ₹1,00,000, your maximum stop-out loss must not exceed ₹2,000.',
      status: 'MANDATORY',
    },
    {
      num: '02',
      title: '1:2 Minimum Risk-to-Reward (R:R)',
      source: 'Risk Engineering Framework',
      desc: 'No trade is taken unless the potential reward is at least twice the stop-loss distance. With a 1:2 R:R, you can be wrong 60% of the time and still be consistently profitable.',
      status: 'ACTIVE',
    },
    {
      num: '03',
      title: '2-Loss Anti-Revenge Circuit Breaker',
      source: 'Trading Psychology Protocol',
      desc: 'After 2 consecutive stop-outs on the same day, terminal locks execution. Revenge trading accounts for 85% of retail account blowups. Step away and reset for tomorrow.',
      status: circuitTripped ? 'CIRCUIT TRIPPED' : 'ARMED',
    },
    {
      num: '04',
      title: 'Breakeven Trailing Rule',
      source: 'Options Discipline Protocol',
      desc: 'When trade reaches 1R profit, immediately move your Stop-Loss to Entry Price (Cost). A winning trade must never be permitted to turn into a losing trade.',
      status: 'ACTIVE',
    },
    {
      num: '05',
      title: 'Small-Cap Froth Cap (≤10%)',
      source: 'Fundamental Valuation Framework',
      desc: 'When small-cap index P/E exceeds 5-year historical median, cap small-cap exposure to ≤ 10% to prevent devastating 50%+ drawdowns when institutional liquidity vanishes.',
      status: 'ACTIVE',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30 mb-2">
              <ShieldAlert className="w-3.5 h-3.5" /> Risk Governance Protocol
            </div>
            <h2 className="text-xl font-bold text-[#E6EDF5]">Rules of Risk & Circuit Breakers</h2>
            <p className="text-xs text-[#9AAABB] mt-1 max-w-2xl">
              Strict mathematical boundaries preventing blowups, emotional over-trading, and revenge
              entries. Code rules enforced before any trade placement.
            </p>
          </div>
          <button
            onClick={() => setCircuitTripped(!circuitTripped)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
              circuitTripped
                ? 'bg-rose-950/80 text-rose-300 border-rose-700'
                : 'bg-[#132E30] text-[#55D6BE] border-[#55D6BE]/40 hover:bg-[#55D6BE]/20'
            }`}
          >
            {circuitTripped ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {circuitTripped ? 'Circuit Breaker: LOCKED' : 'Test Lock Trigger'}
          </button>
        </div>

        {/* Live Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-[#0D131C] border border-[#25313F] rounded-lg p-4">
            <span className="text-xs text-[#6E8298]">Daily Loss Budget</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-bold font-mono text-[#E6EDF5]">
                ₹{currentLoss.toLocaleString('en-IN')} / ₹{dailyLossLimit.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-mono text-[#55D6BE]">{lossPctUsed}% Used</span>
            </div>
            <div className="w-full bg-[#111923] rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  lossPctUsed > 75 ? 'bg-rose-500' : lossPctUsed > 40 ? 'bg-amber-400' : 'bg-[#55D6BE]'
                }`}
                style={{ width: `${lossPctUsed}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-[#0D131C] border border-[#25313F] rounded-lg p-4">
            <span className="text-xs text-[#6E8298]">Trades Executed Today</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-bold font-mono text-[#E6EDF5]">
                {tradesToday} / {maxTradesPerDay} Max
              </span>
              <span className="text-xs font-mono text-[#55D6BE]">
                {maxTradesPerDay - tradesToday} Remaining
              </span>
            </div>
            <span className="text-[11px] text-[#6E8298] block mt-2">
              Prevents over-trading during chop or low-probability sessions.
            </span>
          </div>

          <div className="bg-[#0D131C] border border-[#25313F] rounded-lg p-4">
            <span className="text-xs text-[#6E8298]">Psychological Safety Status</span>
            <div className="flex items-center gap-2 mt-1">
              {circuitTripped ? (
                <AlertOctagon className="w-5 h-5 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#55D6BE]" />
              )}
              <span
                className={`text-sm font-bold ${
                  circuitTripped ? 'text-rose-400' : 'text-[#55D6BE]'
                }`}
              >
                {circuitTripped ? 'LOCKED (Revenge Protected)' : 'CLEAR (Calm Mindset)'}
              </span>
            </div>
            <span className="text-[11px] text-[#6E8298] block mt-2">
              Zero trading when agitated or after consecutive losses.
            </span>
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((r) => (
          <div
            key={r.num}
            className="bg-[#111923] border border-[#25313F] hover:border-[#55D6BE]/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-start gap-4">
              <span className="text-base font-bold font-mono text-[#55D6BE] bg-[#132E30] px-2.5 py-1 rounded border border-[#55D6BE]/20 shrink-0">
                {r.num}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#E6EDF5]">{r.title}</h3>
                  <span className="text-[10px] text-[#6E8298] font-mono">({r.source})</span>
                </div>
                <p className="text-xs text-[#9AAABB] mt-1 leading-relaxed max-w-3xl">{r.desc}</p>
              </div>
            </div>
            <div className="shrink-0">
              <span
                className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${
                  r.status === 'CIRCUIT TRIPPED'
                    ? 'bg-rose-950/80 text-rose-400 border-rose-800'
                    : 'bg-[#132E30] text-[#55D6BE] border-[#55D6BE]/30'
                }`}
              >
                {r.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
