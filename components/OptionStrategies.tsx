'use client';

import React, { useState } from 'react';
import { LineChart, Shield, Zap } from 'lucide-react';

export default function OptionStrategies() {
  const [stratType, setStratType] = useState<'IRON_CONDOR' | 'BULL_CALL' | 'BEAR_PUT' | 'SHORT_STRADDLE'>('IRON_CONDOR');
  const [spot, setSpot] = useState(24800);

  let maxProfit = "+₹3,250";
  let maxLoss = "-₹1,750";
  let breakevens = "24,570 & 25,030";
  let advice = "Ideal for range-bound markets near expiry where implied volatility is high. Maximum gain is made if the index expires between 24,700 and 24,900.";

  if (stratType === 'BULL_CALL') {
    maxProfit = "+₹2,875";
    maxLoss = "-₹2,125";
    breakevens = "24,885";
    advice = "Reduces the cost of buying a naked call while protecting against Theta decay. Best used when moderately bullish.";
  } else if (stratType === 'BEAR_PUT') {
    maxProfit = "+₹2,875";
    maxLoss = "-₹2,125";
    breakevens = "24,715";
    advice = "Profits from downside momentum while capping maximum downside loss if market reverses sharply.";
  } else if (stratType === 'SHORT_STRADDLE') {
    maxProfit = "+₹6,875";
    maxLoss = "Unlimited (Requires strict stop)";
    breakevens = "24,525 & 25,075";
    advice = "Monetizes aggressive Theta decay and IV crush on expiry day. Must be managed with a strict stop-loss.";
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-800/40 rounded-2xl p-5">
        <h3 className="font-bold text-purple-300 text-base flex items-center gap-2">
          <LineChart className="w-5 h-5 text-purple-400" /> Professional Options & Risk-Return Payoffs
        </h3>
        <p className="text-xs text-slate-300 mt-1">
          Explore professional multi-leg strategies to trade non-directional markets, monetize volatility, and cap unlimited risks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Strategy Setup
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Strategy</label>
            <select
              value={stratType}
              onChange={(e) => setStratType(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="IRON_CONDOR">Iron Condor (Range-bound Non-Directional)</option>
              <option value="BULL_CALL">Bull Call Spread (Moderately Bullish)</option>
              <option value="BEAR_PUT">Bear Put Spread (Moderately Bearish)</option>
              <option value="SHORT_STRADDLE">Short Straddle (Monetize Low Volatility)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Underlying Spot (NIFTY)</label>
            <input
              type="number"
              step="50"
              value={spot}
              onChange={(e) => setSpot(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
            <span className="text-purple-300 font-bold block">Legs Execution:</span>
            {stratType === 'IRON_CONDOR' && (
              <div className="text-slate-300 text-[11px] space-y-0.5">
                <div>&bull; Sell 24,700 Put (Collect ₹110) &amp; Buy 24,500 Put (Pay ₹45)</div>
                <div>&bull; Sell 24,900 Call (Collect ₹105) &amp; Buy 25,100 Call (Pay ₹40)</div>
                <div className="text-cyan-400 font-semibold pt-1">Net Credit: ₹130 / share (₹3,250 / lot)</div>
              </div>
            )}
            {stratType === 'BULL_CALL' && (
              <div className="text-slate-300 text-[11px] space-y-0.5">
                <div>&bull; Buy 24,800 Call (Pay ₹140)</div>
                <div>&bull; Sell 25,000 Call (Collect ₹55)</div>
                <div className="text-emerald-400 font-semibold pt-1">Net Debit: ₹85 / share (₹2,125 / lot)</div>
              </div>
            )}
            {stratType === 'BEAR_PUT' && (
              <div className="text-slate-300 text-[11px] space-y-0.5">
                <div>&bull; Buy 24,800 Put (Pay ₹135)</div>
                <div>&bull; Sell 24,600 Put (Collect ₹50)</div>
                <div className="text-rose-400 font-semibold pt-1">Net Debit: ₹85 / share (₹2,125 / lot)</div>
              </div>
            )}
            {stratType === 'SHORT_STRADDLE' && (
              <div className="text-slate-300 text-[11px] space-y-0.5">
                <div>&bull; Sell 24,800 Call (Collect ₹140)</div>
                <div>&bull; Sell 24,800 Put (Collect ₹135)</div>
                <div className="text-amber-400 font-semibold pt-1">Total Credit: ₹275 / share (₹6,875 / lot)</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-950/30 border border-emerald-900/40 p-3 rounded-xl">
              <span className="text-emerald-400 font-bold block">Max Profit</span>
              <span className="text-base font-black text-emerald-300 font-mono">{maxProfit}</span>
            </div>
            <div className="bg-rose-950/30 border border-rose-900/40 p-3 rounded-xl">
              <span className="text-rose-400 font-bold block">Max Loss</span>
              <span className="text-base font-black text-rose-300 font-mono">{maxLoss}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1">
            <span className="text-slate-400 block text-[11px]">Breakeven Boundary:</span>
            <span className="font-mono text-cyan-400 font-bold block">{breakevens}</span>
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" /> Expiry Payoff Curve (P&L at Expiry vs Spot)
            </h4>
            <span className="text-xs px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
              Mod 6 Payoff
            </span>
          </div>

          <div className="w-full h-56 bg-slate-950/90 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
            <svg viewBox="0 0 550 200" className="w-full h-full font-mono text-[10px]">
              <line x1="40" y1="110" x2="510" y2="110" stroke="#475569" strokeWidth="1.5" strokeDasharray="4" />
              <text x="515" y="113" fill="#94a3b8" fontSize="9">₹0</text>

              {stratType === 'IRON_CONDOR' && (
                <>
                  <path d="M 50 160 L 150 160 L 220 50 L 330 50 L 400 160 L 510 160" fill="none" stroke="#a855f7" strokeWidth="3" />
                  <polygon points="50,160 150,160 220,50 330,50 400,160 510,160 510,110 50,110" fill="#a855f7" fillOpacity="0.12" />
                  <text x="275" y="42" fill="#34d399" fontWeight="bold" textAnchor="middle">Max Profit Zone</text>
                </>
              )}
              {stratType === 'BULL_CALL' && (
                <>
                  <path d="M 50 150 L 220 150 L 370 60 L 510 60" fill="none" stroke="#10b981" strokeWidth="3" />
                  <text x="440" y="52" fill="#34d399" fontWeight="bold" textAnchor="middle">Capped Gain</text>
                  <text x="120" y="165" fill="#f43f5e" fontWeight="bold" textAnchor="middle">Capped Loss</text>
                </>
              )}
              {stratType === 'BEAR_PUT' && (
                <>
                  <path d="M 50 60 L 180 60 L 330 150 L 510 150" fill="none" stroke="#f43f5e" strokeWidth="3" />
                  <text x="110" y="52" fill="#34d399" fontWeight="bold" textAnchor="middle">Capped Gain</text>
                </>
              )}
              {stratType === 'SHORT_STRADDLE' && (
                <>
                  <path d="M 80 180 L 275 40 L 470 180" fill="none" stroke="#f59e0b" strokeWidth="3" />
                  <text x="275" y="32" fill="#fbbf24" fontWeight="bold" textAnchor="middle">Peak ATM Profit</text>
                </>
              )}
            </svg>
          </div>

          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1.5">
            <span className="text-cyan-400 font-bold block flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Derivatives Risk Guidance:
            </span>
            <p className="text-slate-300 leading-relaxed">{advice}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
