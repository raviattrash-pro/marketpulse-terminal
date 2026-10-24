'use client';

import React from 'react';
import { X, Sparkles, CheckCircle2, Shield, Flame, Activity } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatAmILookingAtModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-[#4F46E5]">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#4F46E5]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 leading-tight">What Am I Looking At?</h2>
            <p className="text-xs text-slate-500 font-medium">MarketPulse Live Institutional Terminal Guide</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-sans">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">1. Animated Money Flow (The River)</span>
            <p className="text-slate-600">
              Tracks where institutional capital is rotating across sectors in real time. The S-curve river animates flowing green particles into sectors accumulating money and red particles streaming out of distributing sectors.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">2. Calm Zone (2D Strangle Scatter)</span>
            <p className="text-slate-600">
              Finds low-volatility F&O stocks with &gt;80% range containment. Selling wide strangles here allows you to harvest pure time decay (Theta) with low directional risk.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">3. Option Pulse (Writers' Range Box)</span>
            <p className="text-slate-600">
              Visualizes the strike-by-strike battlefield. The shaded Writers' Box indicates where market makers have trapped prices, with the Max Pain line indicating expiration targets.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">4. OI Flow & Velocity Dots</span>
            <p className="text-slate-600">
              Shows moving dots on strike bars reflecting contracts added or removed per minute. Gauge meters detect whether institutions are aggressively shorting or short-covering.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-1">
            <span className="font-bold text-indigo-900 block">5. 💎 All-in-One Wealth & SIP Allocator</span>
            <p className="text-slate-600">
              Answers &quot;Where should I invest right now?&quot; based on live macro sentiments. Dynamically allocates your budget across Stocks, Mutual Funds, Sovereign Gold Bonds (SGBs), Low-Cost ETFs, and 24/7 Crypto. On weekends, displays settled positions with active crypto trading!
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Got it, Let's Trade
          </button>
        </div>
      </div>
    </div>
  );
}
