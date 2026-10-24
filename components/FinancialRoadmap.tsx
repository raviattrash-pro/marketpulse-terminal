'use client';

import React, { useState } from 'react';
import { Map, ShieldCheck, HeartPulse, CreditCard, Target, PiggyBank } from 'lucide-react';

export default function FinancialRoadmap() {
  const [expenses, setExpenses] = useState(45000);
  const [income, setIncome] = useState(1200000);

  const emergencyFund = expenses * 6;
  const termCover = income * 18;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-900 border border-teal-800/40 rounded-2xl p-5">
        <h3 className="font-bold text-teal-300 text-base flex items-center gap-2">
          <Map className="w-5 h-5 text-teal-400" /> 6-Step Personal Wealth &amp; Asset Allocation Roadmap
        </h3>
        <p className="text-xs text-slate-300 mt-1">
          "Before taking risks in the market, follow this exact sequence to ensure financial invulnerability."
        </p>
      </div>

      {/* Quick Calculator Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Your Monthly Living Expenses (₹)</label>
          <input
            type="number"
            step="5000"
            value={expenses}
            onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Your Annual Take-Home Income (₹)</label>
          <input
            type="number"
            step="50000"
            value={income}
            onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Step 1 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">1</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
              Target: ₹{emergencyFund.toLocaleString('en-IN')}
            </span>
          </div>
          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
            <PiggyBank className="w-4 h-4 text-emerald-400" /> Emergency Fund (6 Months)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Park 6 months of mandatory living expenses strictly in safe, liquid instruments (Arbitrage Fund, Sweep-in FD). Never invest this money in equities.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">2</span>
            <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-mono">
              Target: ₹{(termCover / 10000000).toFixed(2)} Cr
            </span>
          </div>
          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Pure Term Life Insurance
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Take pure term life cover equal to <strong>15&times; to 20&times;</strong> of your annual income. Avoid toxic ULIPs and endowment policies that combine insurance with poor returns.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">3</span>
            <span className="text-[10px] bg-purple-950 text-purple-400 border border-purple-800 px-2 py-0.5 rounded font-mono">
              ₹10L Base + ₹50L Top-up
            </span>
          </div>
          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-purple-400" /> Independent Health Insurance
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Do not rely solely on corporate employer health cover (which vanishes if you switch jobs). Take a personal ₹10L base cover plus a ₹50L Super Top-up for maximum cost efficiency.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">4</span>
            <span className="text-[10px] bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded font-mono">
              Zero High-Interest Debt
            </span>
          </div>
          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-rose-400" /> Clear Toxic High-Interest Debt
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Clear credit card debt (36-42% interest) and personal loans immediately. No investment can beat the guaranteed negative return of compounding debt.
          </p>
        </div>

        {/* Step 5 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">5</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
              Horizon Aligned
            </span>
          </div>
          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-400" /> Goal-Based Automated Investing
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Map financial goals to horizons: Short-term (&lt;3 years) in Fixed Income / Debt; Long-term (&gt;5 years) in Nifty 50 Index funds, Flexi-cap funds, and direct moat stocks.
          </p>
        </div>

        {/* Step 6 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">6</span>
            <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded font-mono">
              NPS + PPF + Index
            </span>
          </div>
          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
            <PiggyBank className="w-4 h-4 text-amber-400" /> Retirement & Long-Term Compounding
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Build a compounding retirement bucket using PPF, NPS (Active Equity choice), and low-cost index funds. Never interrupt compounding unnecessarily.
          </p>
        </div>
      </div>
    </div>
  );
}
