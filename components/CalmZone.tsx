'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Activity,
  HeartHandshake,
  AlertOctagon,
  CheckCircle2,
  Sliders,
  Scale,
  Smile,
  Zap,
} from 'lucide-react';

export default function CalmZone() {
  const [vix, setVix] = useState(13.84);
  const [emotionalState, setEmotionalState] = useState<'CALM' | 'FOMO' | 'FRUSTRATED' | 'FATIGUED'>('CALM');

  let regime = 'OPTIMAL CALM ZONE';
  let regimeColor = 'text-[#55D6BE]';
  let regimeBg = 'bg-[#132E30]';
  let advice = 'VIX is in the ideal 13–17 corridor. Technical support and resistance levels respect price action with low slippage. Normal position sizing permitted.';

  if (vix < 12) {
    regime = 'LOW VOLATILITY / SLEEPING MARKET';
    regimeColor = 'text-blue-400';
    regimeBg = 'bg-blue-950/60';
    advice = 'Premiums are dirt cheap. Beware sudden explosive breakout range expansions. Option buying has asymmetric upside.';
  } else if (vix > 18 && vix <= 24) {
    regime = 'ELEVATED VOLATILITY / CHOPPY';
    regimeColor = 'text-amber-400';
    regimeBg = 'bg-amber-950/60';
    advice = 'Wide price swings. Whipsaws likely. Halve your position size and widen stop-loss levels to avoid premature stop-outs.';
  } else if (vix > 24) {
    regime = 'STORM / PANIC LIQUIDATION';
    regimeColor = 'text-rose-400';
    regimeBg = 'bg-rose-950/80';
    advice = 'Extreme market turbulence. Severe slippage on market orders. Naked options forbidden. Defined-risk spreads only.';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Market Regime &amp; Mindset Governor
            </div>
            <h2 className="text-xl font-bold text-[#E6EDF5]">
              Calm Zone &middot; Volatility &amp; Emotion Regulator
            </h2>
            <p className="text-xs text-[#9AAABB] mt-1 max-w-2xl">
              &ldquo;Calm Zone ensure karta hai ki aap tabhi trade karein jab market aur aapka mind dono aligned ho.&rdquo;
              Aligns India VIX market volatility regime with your emotional state before placing orders.
            </p>
          </div>
        </div>

        {/* Live VIX Gauge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-[#25313F]">
          <div className="bg-[#0D131C] border border-[#25313F] rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-mono text-[#6E8298] uppercase">INDIA VIX</span>
            <div className="text-3xl font-bold font-mono text-[#E6EDF5]">{vix}</div>
            <span className="text-[11px] text-[#55D6BE] block">Moderate &middot; Healthy Liquidity</span>
          </div>

          <div className="bg-[#0D131C] border border-[#25313F] rounded-xl p-4 space-y-1 md:col-span-2">
            <span className="text-[10px] font-mono text-[#6E8298] uppercase">Current Market Regime</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm font-bold font-mono px-2.5 py-1 rounded border border-current ${regimeBg} ${regimeColor}`}>
                {regime}
              </span>
            </div>
            <p className="text-xs text-[#9AAABB] mt-1.5 leading-relaxed">{advice}</p>
          </div>
        </div>
      </div>

      {/* Psychology & Emotion Check Gate */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#25313F]">
          <div>
            <h3 className="text-sm font-bold text-[#E6EDF5] flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#55D6BE]" />
              Trader Mindset Audit (Pre-Execution Gate)
            </h3>
            <p className="text-xs text-[#9AAABB] mt-0.5">
              Select your current mental state. The terminal automatically adjusts trading permissions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'CALM', label: 'Calm & Disciplined', desc: 'Following rules without emotional attachment', color: 'border-[#55D6BE] text-[#55D6BE] bg-[#132E30]/60' },
            { id: 'FOMO', label: 'FOMO / Rushed', desc: 'Feeling anxious that the rally is leaving you behind', color: 'border-amber-500 text-amber-400 bg-amber-950/40' },
            { id: 'FRUSTRATED', label: 'Frustrated / Revenge', desc: 'Upset about a recent stop-out loss', color: 'border-rose-500 text-rose-400 bg-rose-950/40' },
            { id: 'FATIGUED', label: 'Fatigued / Distracted', desc: 'Low energy, multitasking, lack of focus', color: 'border-purple-500 text-purple-400 bg-purple-950/40' },
          ].map((state) => (
            <button
              key={state.id}
              onClick={() => setEmotionalState(state.id as any)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                emotionalState === state.id
                  ? `${state.color} shadow-lg shadow-black/40`
                  : 'bg-[#0D131C] border-[#25313F] text-[#9AAABB] hover:border-gray-600'
              }`}
            >
              <span className="text-xs font-bold block">{state.label}</span>
              <span className="text-[10px] text-[#6E8298] block mt-1 leading-snug">{state.desc}</span>
            </button>
          ))}
        </div>

        {/* Emotion Action Box */}
        <div className="bg-[#0D131C] border border-[#25313F] rounded-xl p-4">
          {emotionalState === 'CALM' ? (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#55D6BE] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#55D6BE] block">GREEN LIGHT: TERMINAL UNLOCKED</span>
                <p className="text-xs text-[#9AAABB] mt-0.5 leading-relaxed">
                  Mindset is balanced and objective. Proceed to execute standard position sizing following your 1:2 R:R trading blueprint.
                </p>
              </div>
            </div>
          ) : emotionalState === 'FOMO' ? (
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-400 block">YELLOW ALERT: FOMO DETECTED</span>
                <p className="text-xs text-[#9AAABB] mt-0.5 leading-relaxed">
                  Never buy a green candle after a 50-point move. Step away for 10 minutes. If the trade is valid, it will re-test the breakout level.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-rose-400 block">RED LOCK: TRADING HALTED BY CALM ZONE</span>
                <p className="text-xs text-[#9AAABB] mt-0.5 leading-relaxed">
                  Trading while frustrated or exhausted triggers 90% of retail account drawdowns. Take a mandatory 1-hour walk. Protect your capital.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
