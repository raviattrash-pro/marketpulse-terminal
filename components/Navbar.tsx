'use client';

import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  PieChart,
  BarChart3,
  Layers,
  Calculator,
  CheckSquare,
  BookOpen,
  Compass,
} from 'lucide-react';

export type TabId =
  | 'screener'
  | 'economic-moat'
  | 'small-cap'
  | 'dupont'
  | 'options'
  | 'oi-heatmap'
  | 'risk-sizer'
  | 'checklist'
  | 'journal'
  | 'roadmap';

interface NavbarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }>; tag: string }[] = [
    {
      id: 'screener',
      label: 'Live Screener & Best Buy Price',
      icon: TrendingUp,
      tag: 'Valuation & MoS',
    },
    {
      id: 'economic-moat',
      label: '4-Filter Economic Moat',
      icon: ShieldCheck,
      tag: 'Fundamental Framework',
    },
    {
      id: 'small-cap',
      label: 'Small-Cap Trap Allocator',
      icon: AlertTriangle,
      tag: 'AUM Risk Cycle',
    },
    {
      id: 'dupont',
      label: 'DuPont RoE Decomposition',
      icon: PieChart,
      tag: 'Financial Analysis',
    },
    {
      id: 'options',
      label: 'Option Strategies & Payoffs',
      icon: Layers,
      tag: 'Derivatives Theory',
    },
    {
      id: 'oi-heatmap',
      label: 'OI & PCR Sentiment Heatmap',
      icon: BarChart3,
      tag: 'Systematic Mechanics',
    },
    {
      id: 'risk-sizer',
      label: 'Position Sizer & Circuit Breaker',
      icon: Calculator,
      tag: '1-2% Risk & 1:2 R:R',
    },
    {
      id: 'checklist',
      label: 'Pre-Trade Gatekeeper',
      icon: CheckSquare,
      tag: 'Anti-Impulse Check',
    },
    {
      id: 'journal',
      label: 'Trade Journal',
      icon: BookOpen,
      tag: 'Discipline Audit',
    },
    {
      id: 'roadmap',
      label: '6-Step Financial Blueprint',
      icon: Compass,
      tag: 'Wealth Trinity',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-lg tracking-tight">AlphaTrade Copilot</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  100% Client-Side Next.js
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                Market Academy &bull; Fundamental Moat Screener &bull; Systematic Options Blueprint
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
            <div className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-gray-400">NIFTY 50:</span>
              <span className="text-emerald-400 font-semibold">24,850 (+0.42%)</span>
            </div>
            <div className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="text-gray-400">INDIA VIX:</span>
              <span className="text-amber-400 font-semibold">13.84 (Moderate)</span>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 no-scrollbar border-t border-gray-900">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white shadow-md shadow-emerald-950 border border-emerald-400/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
