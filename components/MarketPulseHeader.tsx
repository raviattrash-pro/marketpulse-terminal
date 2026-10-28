'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Sparkles,
  TrendingUp,
  Activity,
  BarChart2,
  Sliders,
  Shield,
  Layers,
  GraduationCap,
  Radar,
  Flame,
  Coins,
  ShieldAlert,
  Info,
  Clock,
  Menu,
  Volume2,
  VolumeX,
} from 'lucide-react';
import PwaInstallButton from './PwaInstallButton';
import { soundEffects } from '@/lib/soundEffects';

export type PulseTab =
  | 'aladdin-advisory'
  | 'order-block'
  | 'day-trader-skill'
  | 'wealth-allocator'
  | 'money-flow'
  | 'live-opportunities'
  | 'option-pulse'
  | 'stock-radar'
  | 'calm-zone'
  | 'crypto-gold'
  | 'liquidity-map'
  | 'oi-flow'
  | 'screeners'
  | 'academy'
  | 'trade-blueprint';

interface MarketPulseHeaderProps {
  activeTab: PulseTab;
  setActiveTab: (tab: PulseTab) => void;
  isLive: boolean;
  setIsLive: (live: boolean) => void;
  onOpenWhatAmILookingAt: () => void;
}

interface CategoryGroup {
  id: string;
  label: string;
  icon: string;
  primaryTab: PulseTab;
  tabs: { id: PulseTab; label: string; badge?: string }[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'flow',
    label: 'Flow & Radar',
    icon: '🌊',
    primaryTab: 'money-flow',
    tabs: [
      { id: 'money-flow', label: '🌊 Money Flow River', badge: 'Live' },
      { id: 'stock-radar', label: '🎯 Stock Radar', badge: 'Multi-TF' },
      { id: 'order-block', label: '📦 Order Block SMC', badge: 'Pro' },
    ],
  },
  {
    id: 'wealth',
    label: 'Wealth & Multi-Asset',
    icon: '💰',
    primaryTab: 'aladdin-advisory',
    tabs: [
      { id: 'aladdin-advisory', label: '🏛️ Aladdin Advisor', badge: 'Reels & Pro' },
      { id: 'wealth-allocator', label: '🌱 Wealth & SIP' },
      { id: 'crypto-gold', label: '🪙 Gold & Macro' },
      { id: 'academy', label: '🎓 F&O Academy' },
    ],
  },
  {
    id: 'fno',
    label: 'F&O Intelligence',
    icon: '⚡',
    primaryTab: 'oi-flow',
    tabs: [
      { id: 'oi-flow', label: '⚡ OI Flow Velocity' },
      { id: 'option-pulse', label: '📊 Option Pulse (Writers)' },
      { id: 'calm-zone', label: '🧘 Calm Zone' },
      { id: 'liquidity-map', label: '💧 Liquidity Map' },
    ],
  },
  {
    id: 'ai-trader',
    label: 'AI Day Trader',
    icon: '🤖',
    primaryTab: 'day-trader-skill',
    tabs: [
      { id: 'day-trader-skill', label: '🤖 Day Trader Skill Hub', badge: '11-in-1' },
      { id: 'trade-blueprint', label: '📐 Blueprint Terminal' },
      { id: 'screeners', label: '🔍 Institutional Screener' },
    ],
  },
];

export default function MarketPulseHeader({
  activeTab,
  setActiveTab,
  isLive,
  setIsLive,
  onOpenWhatAmILookingAt,
}: MarketPulseHeaderProps) {
  const [nifty, setNifty] = useState<{ price: number; changePct: number }>({ price: 22530.85, changePct: -0.69 });
  const [sensex, setSensex] = useState<{ price: number; changePct: number }>({ price: 73083.87, changePct: -0.23 });
  const [clock, setClock] = useState<string>('');
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [marketStatus, setMarketStatus] = useState<{
    isMarketOpen: boolean;
    sessionState: string;
    sessionDay?: string;
    isWeekend?: boolean;
    label: string;
    subLabel: string;
    nextOpenNotice?: string;
  }>({
    isMarketOpen: false,
    sessionState: 'WEEKEND_CLOSED',
    sessionDay: 'Friday',
    isWeekend: true,
    label: 'Market Closed (Weekend)',
    subLabel: 'Showing Friday Close net flows · Opens Monday 9:15 AM IST',
    nextOpenNotice: 'NSE & BSE will open on Monday at 09:15 AM IST',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const res = await fetch('/api/market-pulse');
        if (res.ok) {
          const data = await res.json();
          const n = data.indices?.find((i: any) => i.symbol === '^NSEI');
          const s = data.indices?.find((i: any) => i.symbol === '^BSESN');
          if (n) setNifty({ price: n.price, changePct: n.changePct });
          if (s) setSensex({ price: s.price, changePct: s.changePct });
          if (data.marketStatus) setMarketStatus(data.marketStatus);
        }
      } catch (e) {
        // keep recent quotes
      }
    };
    fetchIndices();
    const interval = setInterval(fetchIndices, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsSoundOn(soundEffects.isEnabled());
    const handleSoundToggle = (e: any) => {
      setIsSoundOn(e.detail?.enabled ?? soundEffects.isEnabled());
    };
    window.addEventListener('ui-sound-toggle', handleSoundToggle);
    return () => window.removeEventListener('ui-sound-toggle', handleSoundToggle);
  }, []);

  // Determine which category group is currently active
  const activeGroup = useMemo(() => {
    for (const group of CATEGORY_GROUPS) {
      if (group.tabs.some((t) => t.id === activeTab)) {
        return group;
      }
    }
    return CATEGORY_GROUPS[0];
  }, [activeTab]);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-xs font-sans">
      {/* Top Navbar Row */}
      <div className="max-w-[1700px] mx-auto px-3 sm:px-5 py-2.5 border-b border-slate-100/90">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo & Desktop Category Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Logo: Always shrink-0 and fully visible */}
            <div
              className="flex items-center gap-2 cursor-pointer shrink-0 sm:pr-3 sm:border-r border-slate-200 hover:opacity-90 transition active:scale-[0.98]"
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('money-flow');
              }}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
                <span className="text-base font-bold">🌊</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-sm sm:text-base font-black tracking-tight text-slate-900">
                  MarketPulse
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-[9px] font-black px-1.5 py-0.2 rounded font-mono border border-indigo-200/80 uppercase">
                  Pro
                </span>
              </div>
            </div>

            {/* Desktop 4 Primary Hub Categories: Always visible, shrink-0, never pushed off */}
            <div className="hidden md:flex items-center gap-1.5 shrink-0">
              {CATEGORY_GROUPS.map((group) => {
                const isGroupActive = activeGroup.id === group.id;
                return (
                  <button
                    key={group.id}
                    onClick={() => {
                      soundEffects.playTabSwitch();
                      setActiveTab(group.primaryTab);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-[0.96] ${
                      isGroupActive
                        ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <span>{group.icon}</span>
                    <span>{group.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Micro Utilities & Status */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Market Status Badge */}
            {marketStatus.isMarketOpen ? (
              <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold font-mono shadow-2xs shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="hidden sm:inline">NSE Live</span>
                <span className="sm:hidden text-[10px]">Live</span>
              </div>
            ) : (
              <div
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-800 text-[11px] font-bold font-mono shadow-2xs shrink-0"
                title={marketStatus.nextOpenNotice || 'NSE is currently closed for the weekend.'}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="hidden sm:inline">{marketStatus.label || 'Market Closed'}</span>
                <span className="sm:hidden text-[10px]">Closed</span>
              </div>
            )}

            {/* Audio Feedback / Tactile Sound Toggle */}
            <button
              onClick={() => {
                const next = soundEffects.toggle();
                setIsSoundOn(next);
              }}
              className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-mono font-bold transition-all duration-150 active:scale-[0.96] cursor-pointer shrink-0 ${
                isSoundOn
                  ? 'bg-emerald-50/90 text-emerald-700 border-emerald-300/80 shadow-2xs hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-700 hover:bg-slate-200'
              }`}
              title={isSoundOn ? 'Tactile Sound Effects: ON (Click to Mute)' : 'Tactile Sound Effects: MUTED (Click to Enable)'}
              aria-label="Toggle UI sound effects"
            >
              {isSoundOn ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-subtle-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className="hidden lg:inline text-[11px]">{isSoundOn ? 'Sound' : 'Mute'}</span>
            </button>

            {/* Download / Install PWA App Button */}
            <PwaInstallButton variant="header" />

            {/* Guide Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenWhatAmILookingAt();
              }}
              className="flex items-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold p-1.5 sm:px-3 sm:py-1.5 rounded-xl shadow-xs transition-all active:scale-[0.96] shrink-0 cursor-pointer"
              title="Interactive Terminal Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline text-xs">Guide</span>
            </button>
          </div>
        </div>

        {/* Mobile Category Navigation Strip */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-0.5">
          {CATEGORY_GROUPS.map((group) => {
            const isGroupActive = activeGroup.id === group.id;
            return (
              <button
                key={group.id}
                onClick={() => {
                  soundEffects.playTabSwitch();
                  setActiveTab(group.primaryTab);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-[0.96] ${
                  isGroupActive
                    ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-800'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{group.icon}</span>
                <span>{group.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Ergonomic Sub-Tab Row for the Active Hub */}
      <div className="max-w-[1700px] mx-auto px-3 sm:px-5 py-2 bg-slate-50/80 backdrop-blur-xs flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        {/* Left: Active Sub-Tabs */}
        <div className="flex items-center gap-2 shrink-0 overflow-x-auto no-scrollbar pl-0.5 w-full sm:w-auto">
          <span className="text-[10.5px] font-mono font-bold bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-lg uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
            <span>{activeGroup.icon}</span>
            <span className="hidden sm:inline">{activeGroup.label}</span>
          </span>
          {activeGroup.tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEffects.playTabSwitch();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer shrink-0 active:scale-[0.96] ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-bold ring-2 ring-indigo-500/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90 shadow-2xs'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                    isActive ? 'bg-white text-indigo-700 shadow-2xs' : 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Nifty & Sensex Live Quotes + Aladdin Wealth Trigger + Clock */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Nifty & Sensex Quotes (Clean, fully formatted, never cut off!) */}
          <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] text-slate-600 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="font-semibold text-slate-800">
              NIFTY: ₹{nifty.price.toLocaleString('en-IN')}{' '}
              <span className={nifty.changePct >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                ({nifty.changePct >= 0 ? `+${nifty.changePct}%` : `${nifty.changePct}%`})
              </span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-slate-800">
              SENSEX: ₹{sensex.price.toLocaleString('en-IN')}{' '}
              <span className={sensex.changePct >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                ({sensex.changePct >= 0 ? `+${sensex.changePct}%` : `${sensex.changePct}%`})
              </span>
            </span>
          </div>

          {/* Aladdin Wealth & Advisory Quick Trigger */}
          <button
            onClick={() => {
              soundEffects.playTabSwitch();
              setActiveTab('aladdin-advisory');
            }}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer border active:scale-[0.96] ${
              activeTab === 'aladdin-advisory'
                ? 'bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/30'
                : 'bg-gradient-to-r from-amber-50 to-indigo-50 hover:from-amber-100 hover:to-indigo-100 text-indigo-950 border-indigo-200 hover:border-indigo-400'
            }`}
            title="Multi-Asset Financial Advisory (Search Stocks, Mutual Funds, IPOs & Wealth Plans)"
          >
            <span className="text-sm">🏛️</span>
            <span className="font-sans font-black tracking-tight">Aladdin Advisor</span>
            <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-mono uppercase">Academy &amp; NSE</span>
          </button>

          <div className="hidden xl:flex items-center gap-1 text-[11px] text-slate-500 font-mono">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{clock}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
