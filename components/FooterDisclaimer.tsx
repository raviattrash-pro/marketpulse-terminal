'use client';

import React from 'react';
import { AlertTriangle, ShieldAlert, GraduationCap, Scale, Info } from 'lucide-react';

export default function FooterDisclaimer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/90 py-8 px-4 sm:px-6 md:px-8 mt-12 select-none">
      <div className="max-w-[1500px] mx-auto space-y-6">
        {/* Prominent Educational Warning Card */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/40 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-mono">
                    Mandatory Educational Warning
                  </span>
                  <span className="text-xs text-amber-300/90 font-bold">
                    Pure Knowledge & Academic Learning Platform
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-white mt-1.5 leading-snug">
                  Zero Financial Recommendations · 100% User Independent Decision
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-4xl">
                  This application is strictly for <strong>educational, knowledge-building, and learning purposes only</strong>. None of the content, charts, simulated trade blueprints, Monte Carlo probability forecasts, fair value estimates, or indicator alerts constitute financial advice, investment counsel, or a recommendation to buy, sell, or trade any security, stock, or derivative contract. 
                  All decisions to buy or sell are <strong>entirely dependent on the individual user</strong>. We do <strong>not</strong> provide buy/sell calls, tips, or portfolio management.
                </p>
              </div>
            </div>

            {/* Quick Disclaimer Badges */}
            <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0 self-stretch md:self-auto justify-between md:justify-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
              <span className="text-[10px] font-mono font-bold bg-slate-800 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-lg">
                ⚠️ Not SEBI Registered
              </span>
              <span className="text-[10px] font-mono font-bold bg-slate-800 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg">
                🎓 Academic Simulation
              </span>
            </div>
          </div>
        </div>

        {/* 4 Trust & Regulatory Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
              <GraduationCap className="w-4 h-4" />
              <span>Learning Purpose Only</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Designed as an interactive learning laboratory to understand institutional market mechanics, order blocks, and risk-to-reward ratios.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-rose-400 font-bold font-mono">
              <AlertTriangle className="w-4 h-4" />
              <span>Capital Risk Disclosure</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Trading equities, futures, and options involves significant financial risk. Per SEBI studies, 9 out of 10 individual traders incur net losses in the F&O segment.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-bold font-mono">
              <Scale className="w-4 h-4" />
              <span>User Responsibility</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              The user assumes 100% of the risk and responsibility for any investment or trading decisions made. Always consult a certified financial advisor.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
              <Info className="w-4 h-4" />
              <span>Market Data Feeds</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Real-time and settlement data feeds are sourced for educational observation from NSE, BSE, MCX, AMFI, and verified public disclosures.
            </p>
          </div>
        </div>

        {/* Bottom Copyright & Terms Note */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <div>
            © {new Date().getFullYear()} MarketPulse · Educational Market Intelligence & Financial Literacy Lab.
          </div>
          <div className="text-slate-400 text-center sm:text-right">
            Zero Commission · Zero Endorsements · Independent Knowledge Portal
          </div>
        </div>
      </div>
    </footer>
  );
}
