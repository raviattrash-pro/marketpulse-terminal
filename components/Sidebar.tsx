'use client';

import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  BarChart2,
  ShieldAlert,
  BookOpen,
  Bookmark,
  HelpCircle,
  Shield,
  Layers,
  Clock,
  Sparkles,
  Coins,
  Activity,
  Zap,
  Radar,
  ShieldCheck,
  GraduationCap,
  X,
} from 'lucide-react';

export type MainSection =
  | 'workspace'
  | 'time-machine'
  | 'ai-scanner'
  | 'journal'
  | 'playbook'
  | 'setups';

export type WorkspaceSubtab = 'all' | 'position-sizer' | 'risk-rules';

interface SidebarProps {
  activeSection: MainSection;
  setActiveSection: (sec: MainSection) => void;
  activeSubtab: WorkspaceSubtab;
  setActiveSubtab: (sub: WorkspaceSubtab) => void;
  onOpenGuide: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  activeSection,
  setActiveSection,
  activeSubtab,
  setActiveSubtab,
  onOpenGuide,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const handleNav = (sec: MainSection, sub?: WorkspaceSubtab) => {
    setActiveSection(sec);
    if (sub) setActiveSubtab(sub);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full">
      {/* Top Section */}
      <div className="p-3 space-y-3">
        {/* Brand Header */}
        <div className="px-2 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#132E30] border border-[#55D6BE]/40 flex items-center justify-center font-bold text-xs font-mono text-[#55D6BE]">
              TR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-tight text-[#E6EDF5]">TradeBlueprint</span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-[#55D6BE] font-semibold block uppercase">
                COPILOT
              </span>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-[#9AAABB] hover:text-white hover:bg-[#111923] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Section Label: RISK & SIZING DESK */}
        <div className="space-y-0.5">
          <span className="text-[9px] font-mono tracking-widest text-[#6E8298] uppercase px-2 font-bold block mb-1">
            RISK &amp; EXECUTION DESK
          </span>

          {/* 1. Workspace Overview */}
          <button
            onClick={() => handleNav('workspace', 'all')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSection === 'workspace' && activeSubtab === 'all'
                ? 'bg-[#132E30] text-[#55D6BE] font-semibold'
                : 'text-[#9AAABB] hover:text-[#E6EDF5] hover:bg-[#111923]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Risk Overview</span>
          </button>

          {/* Sub-items for Workspace */}
          <div className="pl-5 space-y-0.5 border-l border-[#25313F]/50 ml-2.5 py-0.5">
            <button
              onClick={() => handleNav('workspace', 'position-sizer')}
              className={`w-full text-left py-0.5 text-[11px] block transition-colors ${
                activeSection === 'workspace' && activeSubtab === 'position-sizer'
                  ? 'text-[#55D6BE] font-semibold'
                  : 'text-[#6E8298] hover:text-[#E6EDF5]'
              }`}
            >
              1% Position Sizer
            </button>
            <button
              onClick={() => handleNav('workspace', 'risk-rules')}
              className={`w-full text-left py-0.5 text-[11px] block transition-colors ${
                activeSection === 'workspace' && activeSubtab === 'risk-rules'
                  ? 'text-[#55D6BE] font-semibold'
                  : 'text-[#6E8298] hover:text-[#E6EDF5]'
              }`}
            >
              2-Loss Circuit Breaker
            </button>
          </div>
        </div>

        {/* Section Label: ADVANCED ENGINES */}
        <div className="space-y-0.5 pt-2">
          <span className="text-[9px] font-mono tracking-widest text-[#6E8298] uppercase px-2 font-bold block mb-1">
            EXECUTION &amp; SIMULATION
          </span>

          {/* Time Machine */}
          <button
            onClick={() => handleNav('time-machine')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSection === 'time-machine'
                ? 'bg-[#132E30] text-[#55D6BE] font-semibold'
                : 'text-[#9AAABB] hover:text-[#E6EDF5] hover:bg-[#111923]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#55D6BE]" />
              <span className="font-semibold">Trade Time Machine</span>
            </span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#55D6BE] text-black font-bold animate-pulse">
              100-Path
            </span>
          </button>

          {/* AI Research Suite */}
          <button
            onClick={() => handleNav('ai-scanner')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSection === 'ai-scanner'
                ? 'bg-[#132E30] text-[#55D6BE] font-semibold'
                : 'text-[#9AAABB] hover:text-[#E6EDF5] hover:bg-[#111923]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>3-Agent AI Scanner</span>
            </span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#111923] text-amber-400 border border-amber-900/50">
              Agentic
            </span>
          </button>

          {/* Trade Journal */}
          <button
            onClick={() => handleNav('journal')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSection === 'journal'
                ? 'bg-[#132E30] text-[#55D6BE] font-semibold'
                : 'text-[#9AAABB] hover:text-[#E6EDF5] hover:bg-[#111923]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#55D6BE]" />
            <span>Trade Journal &amp; P&amp;L</span>
          </button>

          {/* Playbook */}
          <button
            onClick={() => handleNav('playbook')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSection === 'playbook'
                ? 'bg-[#132E30] text-[#55D6BE] font-semibold'
                : 'text-[#9AAABB] hover:text-[#E6EDF5] hover:bg-[#111923]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>DuPont &amp; Moat Playbook</span>
          </button>

          {/* Saved Setups */}
          <button
            onClick={() => handleNav('setups')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSection === 'setups'
                ? 'bg-[#132E30] text-[#55D6BE] font-semibold'
                : 'text-[#9AAABB] hover:text-[#E6EDF5] hover:bg-[#111923]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Saved Setups</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#111923] text-[#55D6BE] border border-[#25313F]">
              03
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Pinned Widget */}
      <div className="p-3 border-t border-[#25313F] space-y-2.5 bg-[#0D131C]">
        {/* Capital First Card */}
        <div className="bg-[#111923] border border-[#25313F] rounded-lg p-2.5 space-y-1">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#55D6BE]" />
            <h4 className="text-[11px] font-bold text-[#E6EDF5]">Capital first.</h4>
          </div>
          <p className="text-[10px] text-[#9AAABB] leading-relaxed">
            Protect the downside. The next trade is a privilege, not a promise.
          </p>
        </div>

        {/* Terminal Guide & Footer */}
        <div className="px-1 space-y-1">
          <button
            onClick={() => {
              onOpenGuide();
              if (onCloseMobile) onCloseMobile();
            }}
            className="flex items-center gap-2 text-[10px] text-[#9AAABB] hover:text-[#55D6BE] transition-colors w-full"
          >
            <HelpCircle className="w-3 h-3 text-[#6E8298]" />
            <span>Terminal guide</span>
          </button>
          <div className="text-[9px] text-[#6E8298] font-mono tracking-wider pt-0.5 flex items-center justify-between border-t border-[#25313F]/50">
            <span>COPILOT v1.0</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-bold">LIVE PRO</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: Visible only on md screens and above */}
      <aside className="hidden md:flex w-60 bg-[#0D131C] border-r border-[#25313F] flex-col justify-between h-screen sticky top-0 shrink-0 select-none overflow-y-auto custom-scrollbar">
        {navContent}
      </aside>

      {/* Mobile Drawer: Slides over from left with backdrop when open */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          {/* Drawer Body */}
          <aside className="relative w-72 max-w-[85vw] bg-[#0D131C] border-r border-[#25313F] flex flex-col justify-between h-full z-10 shadow-2xl select-none overflow-y-auto custom-scrollbar">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
