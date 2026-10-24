'use client';

import React, { useState, useEffect } from 'react';
import MarketPulseHeader, { PulseTab } from '@/components/MarketPulseHeader';
import MoneyFlowAnimated from '@/components/MoneyFlowAnimated';
import OptionPulseWritersBox from '@/components/OptionPulseWritersBox';
import CalmZoneScatter from '@/components/CalmZoneScatter';
import LiquidityMapCandle from '@/components/LiquidityMapCandle';
import OIFlowVelocity from '@/components/OIFlowVelocity';
import StockRadarView from '@/components/StockRadarView';
import FNOAcademyRoadmap from '@/components/FNOAcademyRoadmap';
import CryptoGoldFlow from '@/components/CryptoGoldFlow';
import InstitutionalScreener from '@/components/InstitutionalScreener';
import WhatAmILookingAtModal from '@/components/WhatAmILookingAtModal';
import LiveMarketOpportunities from '@/components/LiveMarketOpportunities';
import SmartWealthAllocator from '@/components/SmartWealthAllocator';
import AladdinWealthAdvisory from '@/components/AladdinWealthAdvisory';
import DayTraderSkillHub from '@/components/DayTraderSkillHub';
import OrderBlockSMC from '@/components/OrderBlockSMC';
import FooterDisclaimer from '@/components/FooterDisclaimer';
import PwaInstallButton from '@/components/PwaInstallButton';
import { Menu } from 'lucide-react';

// Existing modules for TradeBlueprint mode
import Sidebar, { MainSection, WorkspaceSubtab } from '@/components/Sidebar';
import WorkspaceDashboard from '@/components/WorkspaceDashboard';
import TradeJournal from '@/components/TradeJournal';
import PlaybookView from '@/components/PlaybookView';
import SavedSetups from '@/components/SavedSetups';
import RiskRules from '@/components/RiskRules';
import OIHeatmap from '@/components/OIHeatmap';
import RiskPositionSizer from '@/components/RiskPositionSizer';
import TimeMachineSimulator from '@/components/TimeMachineSimulator';
import AIResearchPipeline from '@/components/AIResearchPipeline';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<PulseTab>('money-flow');
  const [isLive, setIsLive] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // TradeBlueprint state
  const [blueprintSection, setBlueprintSection] = useState<MainSection>('workspace');
  const [blueprintSubtab, setBlueprintSubtab] = useState<WorkspaceSubtab>('all');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{
    name: string;
    cmp: number;
    sl: number;
    target?: number;
    qty?: number;
  }>({
    name: 'TITAN COMPANY LTD',
    cmp: 3480,
    sl: 2980,
    target: 4480,
    qty: 50,
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as PulseTab;
      if (tabParam) {
        setActiveTab(tabParam);
      }
      const sectionParam = params.get('section') as MainSection;
      if (sectionParam) {
        setBlueprintSection(sectionParam);
      }
    }
  }, []);

  const handleLoadTrade = (name: string, cmp: number, sl: number) => {
    setSelectedStock((prev) => ({ ...prev, name, cmp, sl }));
    setActiveTab('trade-blueprint');
    setBlueprintSection('workspace');
    setBlueprintSubtab('position-sizer');
  };

  const handleSimulateInTimeMachine = (
    name: string,
    entry: number,
    sl: number,
    target: number
  ) => {
    setSelectedStock((prev) => ({
      ...prev,
      name,
      cmp: entry,
      sl,
      target,
    }));
    setActiveTab('trade-blueprint');
    setBlueprintSection('time-machine');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Loading MarketPulse Dashboard...
          </span>
        </div>
      </div>
    );
  }

  // If user selected "TradeBlueprint", render the dark terminal workspace with responsive layout
  if (activeTab === 'trade-blueprint') {
    return (
      <div className="min-h-screen bg-[#090E17] text-[#E6EDF5] flex flex-col font-sans">
        {/* Top bar with easy return to MarketPulse & Mobile Menu trigger */}
        <div className="bg-[#0D131C] border-b border-[#25313F] px-3 sm:px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#111923] border border-[#25313F] text-[#55D6BE] hover:bg-[#132E30] active:scale-95 transition-all cursor-pointer"
              aria-label="Open terminal navigation"
            >
              <Menu className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono font-bold">DESK</span>
            </button>

            <button
              onClick={() => setActiveTab('money-flow')}
              className="flex items-center gap-1.5 text-[#55D6BE] hover:underline font-bold"
            >
              <span>&larr;</span>
              <span className="hidden sm:inline">Back to MarketPulse Live Dashboard</span>
              <span className="sm:hidden font-mono text-[11px]">MarketPulse</span>
            </button>
            <span className="text-[#6E8298] hidden lg:inline">|</span>
            <span className="text-[#9AAABB] font-mono hidden lg:inline">TradeBlueprint Terminal</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 font-mono text-[11px] hidden sm:inline">1% Risk Lock Engaged</span>
              <span className="text-emerald-400 font-mono text-[11px] sm:hidden">1% Lock</span>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Quick Tab Selector */}
        <div className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#0A101A] border-b border-[#25313F]/70 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'workspace', sub: 'all', label: 'Risk Overview' },
            { id: 'workspace', sub: 'position-sizer', label: '1% Sizer' },
            { id: 'workspace', sub: 'risk-rules', label: 'Circuit Breaker' },
            { id: 'time-machine', sub: null, label: 'Time Machine' },
            { id: 'ai-scanner', sub: null, label: 'AI Scanner' },
            { id: 'journal', sub: null, label: 'Journal' },
            { id: 'playbook', sub: null, label: 'Playbook' },
            { id: 'setups', sub: null, label: 'Setups' },
          ].map((pill) => {
            const isActive =
              blueprintSection === pill.id &&
              (pill.sub === null || blueprintSubtab === pill.sub);
            return (
              <button
                key={`${pill.id}-${pill.sub || 'root'}`}
                onClick={() => {
                  setBlueprintSection(pill.id as any);
                  if (pill.sub) setBlueprintSubtab(pill.sub as any);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#132E30] text-[#55D6BE] border border-[#55D6BE]/50 font-bold'
                    : 'bg-[#0D131C] text-[#8C9BAE] border border-[#25313F]/60'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            activeSection={blueprintSection}
            setActiveSection={setBlueprintSection}
            activeSubtab={blueprintSubtab}
            setActiveSubtab={setBlueprintSubtab}
            onOpenGuide={() => setBlueprintSection('playbook')}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
            {blueprintSection === 'workspace' && blueprintSubtab === 'all' && (
              <WorkspaceDashboard onOpenTimeMachine={handleSimulateInTimeMachine} />
            )}

            {blueprintSection === 'workspace' && blueprintSubtab === 'position-sizer' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#25313F]">
                  <div>
                    <h1 className="text-xl font-bold text-[#E6EDF5]">Position Sizer & Risk Manager</h1>
                    <p className="text-xs text-[#9AAABB]">1%–2% Capital Rule & 1:2 R:R Target Engineering</p>
                  </div>
                  <button
                    onClick={() => setBlueprintSubtab('all')}
                    className="text-xs text-[#55D6BE] hover:underline"
                  >
                    &larr; Return to Full Workspace
                  </button>
                </div>
                <RiskPositionSizer initialEntry={selectedStock.cmp} initialSl={selectedStock.sl} />
              </div>
            )}

            {blueprintSection === 'workspace' && blueprintSubtab === 'risk-rules' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#25313F]">
                  <div>
                    <h1 className="text-xl font-bold text-[#E6EDF5]">Risk Rules & Circuit Breaker</h1>
                    <p className="text-xs text-[#9AAABB]">Anti-Revenge 2-Loss Halt & Capital Ceilings</p>
                  </div>
                  <button
                    onClick={() => setBlueprintSubtab('all')}
                    className="text-xs text-[#55D6BE] hover:underline"
                  >
                    &larr; Return to Full Workspace
                  </button>
                </div>
                <RiskRules />
              </div>
            )}

            {blueprintSection === 'time-machine' && (
              <TimeMachineSimulator
                initialSymbol={selectedStock.name}
                initialEntry={selectedStock.cmp}
                initialSl={selectedStock.sl}
                initialTarget={
                  selectedStock.target ||
                  selectedStock.cmp + (selectedStock.cmp - selectedStock.sl) * 2
                }
                initialQty={selectedStock.qty || 50}
              />
            )}

            {blueprintSection === 'ai-scanner' && (
              <AIResearchPipeline onSimulate={handleSimulateInTimeMachine} />
            )}

            {blueprintSection === 'journal' && <TradeJournal />}
            {blueprintSection === 'playbook' && <PlaybookView onLoadTrade={handleLoadTrade} />}
            {blueprintSection === 'setups' && <SavedSetups onLoadTrade={handleLoadTrade} />}
          </main>
        </div>

        {/* Mandatory SEBI & Educational Warning Footer */}
        <FooterDisclaimer />
      </div>
    );
  }

  // Primary Default View: EXACT UI & Animations from the Reel URL!
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <MarketPulseHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLive={isLive}
        setIsLive={setIsLive}
        onOpenWhatAmILookingAt={() => setIsModalOpen(true)}
      />

      {/* Main Screen Content Pane */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'aladdin-advisory' && <AladdinWealthAdvisory />}
        {activeTab === 'money-flow' && <MoneyFlowAnimated />}
        {activeTab === 'order-block' && <OrderBlockSMC />}
        {activeTab === 'wealth-allocator' && <SmartWealthAllocator />}
        {activeTab === 'live-opportunities' && (
          <LiveMarketOpportunities
            onLoadTrade={handleLoadTrade}
            onSimulateInTimeMachine={handleSimulateInTimeMachine}
          />
        )}
        {activeTab === 'option-pulse' && <OptionPulseWritersBox />}
        {activeTab === 'calm-zone' && <CalmZoneScatter />}
        {activeTab === 'liquidity-map' && <LiquidityMapCandle />}
        {activeTab === 'oi-flow' && <OIFlowVelocity />}
        {activeTab === 'screeners' && (
          <InstitutionalScreener
            onLoadTrade={handleLoadTrade}
            onSimulateInTimeMachine={handleSimulateInTimeMachine}
          />
        )}
        {activeTab === 'stock-radar' && <StockRadarView />}
        {activeTab === 'academy' && <FNOAcademyRoadmap />}
        {activeTab === 'crypto-gold' && <CryptoGoldFlow />}
        {activeTab === 'day-trader-skill' && <DayTraderSkillHub />}
      </main>

      {/* Mandatory SEBI & Educational Warning Footer */}
      <FooterDisclaimer />

      {/* "What am I looking at?" Educational Guidance Modal */}
      <WhatAmILookingAtModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Floating Mobile Install PWA Banner */}
      <PwaInstallButton variant="banner" />
    </div>
  );
}
