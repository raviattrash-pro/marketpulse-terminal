'use client';

import React, { useState } from 'react';
import MoatScreener from '@/components/MoatScreener';
import SmallCapRiskAllocator from '@/components/SmallCapRiskAllocator';
import DuPontAnalysis from '@/components/DuPontAnalysis';
import OptionStrategies from '@/components/OptionStrategies';
import FinancialRoadmap from '@/components/FinancialRoadmap';
import PreTradeChecklist from '@/components/PreTradeChecklist';
import StockScreener from '@/components/StockScreener';
import { Castle, AlertTriangle, PieChart, Layers, Compass, CheckSquare, TrendingUp } from 'lucide-react';

interface PlaybookViewProps {
  onLoadTrade: (name: string, cmp: number, sl: number) => void;
}

export default function PlaybookView({ onLoadTrade }: PlaybookViewProps) {
  const [activeSub, setActiveSub] = useState<'screener' | 'moat' | 'smallcap' | 'dupont' | 'options' | 'checklist' | 'blueprint'>('screener');

  const tabs = [
    { id: 'screener' as const, label: 'Graham Screener', icon: TrendingUp },
    { id: 'moat' as const, label: '4-Filter Economic Moat', icon: Castle },
    { id: 'smallcap' as const, label: 'Small-Cap Trap', icon: AlertTriangle },
    { id: 'dupont' as const, label: 'DuPont RoE', icon: PieChart },
    { id: 'options' as const, label: 'Option Strategies', icon: Layers },
    { id: 'checklist' as const, label: 'Pre-Trade Checklist', icon: CheckSquare },
    { id: 'blueprint' as const, label: '6-Step Blueprint', icon: Compass },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#25313F] text-xs font-mono no-scrollbar">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeSub === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSub(t.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all shrink-0 ${
                isActive
                  ? 'bg-[#132E30] text-[#55D6BE] font-semibold border border-[#55D6BE]/40 shadow'
                  : 'text-[#9AAABB] hover:text-[#E6EDF5] hover:bg-[#111923]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#55D6BE]' : 'text-[#6E8298]'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panel rendering */}
      <div>
        {activeSub === 'screener' && <StockScreener onSelectForTrade={onLoadTrade} />}
        {activeSub === 'moat' && <MoatScreener />}
        {activeSub === 'smallcap' && <SmallCapRiskAllocator />}
        {activeSub === 'dupont' && <DuPontAnalysis />}
        {activeSub === 'options' && <OptionStrategies />}
        {activeSub === 'checklist' && <PreTradeChecklist />}
        {activeSub === 'blueprint' && <FinancialRoadmap />}
      </div>
    </div>
  );
}
