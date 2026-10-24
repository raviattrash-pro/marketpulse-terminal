'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Zap,
  TrendingUp,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';

interface Lesson {
  id: string;
  category: string;
  title: string;
  duration: string;
  summary: string;
  keyRule: string;
}

export default function FNOAcademy() {
  const [selectedLesson, setSelectedLesson] = useState<string>('l1');

  const lessons: Lesson[] = [
    {
      id: 'l1',
      category: 'DERIVATIVES 101',
      title: 'Deciphering Open Interest: The 4 Golden Buildup Quadrants',
      duration: '6 min read',
      summary:
        'Volume tells you what traded in the past; Open Interest tells you where active institutional capital is committing right now. When Price rises and OI rises, institutions are pumping fresh capital (Long Buildup). When Price falls and OI rises, aggressive shorts are creating positions (Short Buildup).',
      keyRule:
        'Never trade against the primary OI buildup direction. If a stock is in Short Buildup, buying dips is financial suicide.',
    },
    {
      id: 'l2',
      category: 'OPTIONS GREEKS',
      title: 'Theta Decay & Moneyness: Why Far-OTM Options Die at Expiry',
      duration: '8 min read',
      summary:
        'Retail traders gravitate toward ₹5 and ₹10 far-out-of-the-money (OTM) call options thinking they are cheap lottery tickets. In reality, their Delta is < 0.10 and Theta decay accelerates exponentially in the final 48 hours of weekly expiry, decaying to zero 88% of the time.',
      keyRule:
        'Stick strictly to ATM (At-the-Money) or slight ITM (In-the-Money) options with |Delta| ≥ 0.50 where delta expansion offsets theta decay.',
    },
    {
      id: 'l3',
      category: 'SMART MONEY CONCEPTS',
      title: 'Liquidity Pools & Stop Hunts: How Retail Gets Trapped',
      duration: '7 min read',
      summary:
        'Institutions needing to buy 5,00,000 shares cannot just click market buy—doing so creates massive slippage. Instead, they engineer false breakouts above swing highs (Buy-side Liquidity) or false breakdowns below swing lows (Sell-side Liquidity) to trigger retail stop orders.',
      keyRule:
        'Wait for the stop sweep to complete and wait for a candle close back inside the key level before entering the reversal.',
    },
    {
      id: 'l4',
      category: 'RISK ENGINEERING',
      title: 'The 1% Risk & Anti-Revenge Circuit Breaker',
      duration: '5 min read',
      summary:
        'A trader with a 50% win rate and 1:2 Risk-to-Reward will turn ₹1,00,000 into substantial wealth over 200 trades. A trader risking 10% per trade will face guaranteed ruin within any standard 5-trade losing streak.',
      keyRule:
        'Size every trade by your stop-loss distance, never by margin availability. Max risk per trade must remain ≤ 1.5% of total capital.',
    },
  ];

  const current = lessons.find((l) => l.id === selectedLesson) || lessons[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111923] border border-[#25313F] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/30 mb-2">
              <GraduationCap className="w-3.5 h-3.5" /> F&amp;O Masterclass Series
            </div>
            <h2 className="text-xl font-bold text-[#E6EDF5]">
              F&amp;O Academy &middot; Core Institutional Principles
            </h2>
            <p className="text-xs text-[#9AAABB] mt-1 max-w-2xl">
              &ldquo;F&amp;O Academy mein seekhein derivatives ki asli mechanics bina kisi noise ke.&rdquo;
              Curated masterclasses distilled from institutional market mechanics and top derivatives prop traders.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Lessons List + Active Lesson Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Lesson Cards */}
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson.id)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                selectedLesson === lesson.id
                  ? 'bg-[#132E30] border-[#55D6BE]/60 text-[#E6EDF5] shadow-lg shadow-[#55D6BE]/10'
                  : 'bg-[#111923] border-[#25313F] text-[#9AAABB] hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#6E8298] mb-1">
                <span>{lesson.category}</span>
                <span>{lesson.duration}</span>
              </div>
              <h3 className="text-xs font-bold text-[#E6EDF5] leading-snug">{lesson.title}</h3>
            </button>
          ))}
        </div>

        {/* Right Active Lesson Content */}
        <div className="lg:col-span-2 bg-[#111923] border border-[#25313F] rounded-xl p-6 space-y-4">
          <div className="border-b border-[#25313F] pb-3">
            <span className="text-[10px] font-mono font-bold text-[#55D6BE] bg-[#132E30] px-2 py-0.5 rounded border border-[#55D6BE]/30 uppercase">
              {current.category}
            </span>
            <h2 className="text-lg font-bold text-[#E6EDF5] mt-2">{current.title}</h2>
          </div>

          <div className="text-xs text-[#9AAABB] leading-relaxed space-y-3">
            <p className="text-sm text-[#E6EDF5]">{current.summary}</p>
          </div>

          {/* Golden Rule Callout */}
          <div className="bg-[#0D131C] border border-[#55D6BE]/40 rounded-xl p-4 mt-4 space-y-1">
            <span className="text-[10px] font-mono font-bold text-[#55D6BE] uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Golden Rule for Your Playbook:
            </span>
            <p className="text-xs text-[#E6EDF5] font-semibold leading-relaxed">
              &ldquo;{current.keyRule}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
