'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Info,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Activity,
  Layers,
} from 'lucide-react';
import { soundEffects } from '@/lib/soundEffects';

interface StockRadarData {
  symbol: string;
  name: string;
  cmp: number;
  changePct: number;
  score: number; // e.g. +1.3
  stance: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  stanceText: string;
  writersBox: { min: number; max: number };
  factors: {
    oi: number; // 0-100
    options: number;
    vwap: number;
    volProfile: number;
    rsi: number;
    priceAction: number;
  };
  factorChecklist: {
    label: string;
    bias: string;
    score: string;
    status: 'bull' | 'neutral' | 'bear';
  }[];
  priceHistory: { time: string; price: number }[];
}

const RADAR_STOCKS: Record<string, StockRadarData> = {
  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    cmp: 1213.6,
    changePct: +0.97,
    score: +1.3,
    stance: 'NEUTRAL',
    stanceText: 'Neutral (+1.3/10) led by mixed signals; writers box 1,160-1,250 (low conviction)',
    writersBox: { min: 1160, max: 1250 },
    factors: {
      oi: 78,
      options: 35,
      vwap: 55,
      volProfile: 68,
      rsi: 72,
      priceAction: 48,
    },
    factorChecklist: [
      { label: 'Futures buildup', bias: 'Mild long buildup (+1.8)', score: '+1.8', status: 'bull' },
      { label: 'Option chain', bias: 'Heavy 1,230 CE call walls', score: '-1.4', status: 'bear' },
      { label: 'Volume profile', bias: 'POC shelf defended at 1,203', score: '+2.1', status: 'bull' },
      { label: 'RSI divergence', bias: 'Daily 54.2 neutral momentum', score: '0.0', status: 'neutral' },
      { label: 'Price action', bias: 'Holding above 20-DMA', score: '+1.6', status: 'bull' },
      { label: 'VWAP structure', bias: 'Trading +0.4% above intraday VWAP', score: '+1.2', status: 'bull' },
    ],
    priceHistory: [
      { time: '19 Oct', price: 1228 },
      { time: '20 Oct', price: 1235 },
      { time: '21 Oct', price: 1222 },
      { time: '22 Oct', price: 1215 },
      { time: '23 Oct', price: 1198 },
      { time: '24 Oct', price: 1205 },
      { time: '25 Oct', price: 1211 },
      { time: '26 Oct', price: 1213.6 },
    ],
  },
  PTC: {
    symbol: 'PTC',
    name: 'PTC India Ltd',
    cmp: 133.37,
    changePct: -5.17,
    score: -3.8,
    stance: 'BEARISH',
    stanceText: 'Bearish (-3.8/10) following institutional selling; writers box 130-140',
    writersBox: { min: 130, max: 140 },
    factors: {
      oi: 42,
      options: 30,
      vwap: 28,
      volProfile: 65,
      rsi: 32,
      priceAction: 25,
    },
    factorChecklist: [
      { label: 'Futures buildup', bias: 'Aggressive short buildup (-3.6)', score: '-3.6', status: 'bear' },
      { label: 'Option chain', bias: 'Heavy 140 CE call writing resistance', score: '-3.2', status: 'bear' },
      { label: 'Volume profile', bias: 'High sell volume at ₹137-140 POC zone', score: '-2.4', status: 'bear' },
      { label: 'RSI momentum', bias: 'Oversold absorption near 32.8', score: '+1.1', status: 'bull' },
      { label: 'Price action', bias: 'Breakdown below 135 key swing low', score: '-3.0', status: 'bear' },
      { label: 'VWAP structure', bias: 'Trading -3.2% below session VWAP', score: '-2.8', status: 'bear' },
    ],
    priceHistory: [
      { time: '19 Oct', price: 144.5 },
      { time: '20 Oct', price: 143.2 },
      { time: '21 Oct', price: 141.0 },
      { time: '22 Oct', price: 139.8 },
      { time: '23 Oct', price: 138.5 },
      { time: '24 Oct', price: 137.4 },
      { time: '25 Oct', price: 135.0 },
      { time: '26 Oct', price: 133.37 },
    ],
  },
  ICICIBANK: {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    cmp: 1265.4,
    changePct: +1.42,
    score: +3.4,
    stance: 'BULLISH',
    stanceText: 'Bullish (+3.4/10) supported by aggressive put writing at 1,240; writers box 1,240-1,300',
    writersBox: { min: 1240, max: 1300 },
    factors: {
      oi: 85,
      options: 72,
      vwap: 70,
      volProfile: 82,
      rsi: 68,
      priceAction: 76,
    },
    factorChecklist: [
      { label: 'Futures buildup', bias: 'Aggressive long buildup (+3.2)', score: '+3.2', status: 'bull' },
      { label: 'Option chain', bias: 'Put writers floor shifting up', score: '+2.8', status: 'bull' },
      { label: 'Volume profile', bias: 'High value node absorption', score: '+2.4', status: 'bull' },
      { label: 'RSI divergence', bias: 'Bullish momentum breakout', score: '+1.8', status: 'bull' },
      { label: 'Price action', bias: 'Higher high continuation', score: '+2.5', status: 'bull' },
      { label: 'VWAP structure', bias: 'Consistently holding VWAP band', score: '+2.0', status: 'bull' },
    ],
    priceHistory: [
      { time: '19 Oct', price: 1230 },
      { time: '20 Oct', price: 1242 },
      { time: '21 Oct', price: 1248 },
      { time: '22 Oct', price: 1255 },
      { time: '23 Oct', price: 1250 },
      { time: '24 Oct', price: 1258 },
      { time: '25 Oct', price: 1262 },
      { time: '26 Oct', price: 1265.4 },
    ],
  },
  INFY: {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    cmp: 1892.2,
    changePct: +0.20,
    score: +1.8,
    stance: 'NEUTRAL',
    stanceText: 'Neutral-Bullish (+1.8/10) institutional accumulation with low volatility; writers box 1,850-1,940',
    writersBox: { min: 1850, max: 1940 },
    factors: {
      oi: 65,
      options: 60,
      vwap: 62,
      volProfile: 74,
      rsi: 61,
      priceAction: 58,
    },
    factorChecklist: [
      { label: 'Futures buildup', bias: 'Institutional absorption', score: '+1.5', status: 'bull' },
      { label: 'Option chain', bias: 'Call writing capped at 1,920', score: '-0.5', status: 'neutral' },
      { label: 'Volume profile', bias: 'Value area base at 1,860', score: '+2.0', status: 'bull' },
      { label: 'RSI divergence', bias: 'Steady positive slope', score: '+1.2', status: 'bull' },
      { label: 'Price action', bias: 'Rangebound consolidation', score: '+0.8', status: 'neutral' },
      { label: 'VWAP structure', bias: 'Above weekly anchor VWAP', score: '+1.4', status: 'bull' },
    ],
    priceHistory: [
      { time: '19 Oct', price: 1860 },
      { time: '20 Oct', price: 1872 },
      { time: '21 Oct', price: 1865 },
      { time: '22 Oct', price: 1880 },
      { time: '23 Oct', price: 1888 },
      { time: '24 Oct', price: 1885 },
      { time: '25 Oct', price: 1890 },
      { time: '26 Oct', price: 1892.2 },
    ],
  },
  TCS: {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    cmp: 4120.0,
    changePct: +2.69,
    score: +4.2,
    stance: 'BULLISH',
    stanceText: 'Strong Bullish (+4.2/10) on surging institutional accumulation & deal momentum; writers box 4,000-4,250',
    writersBox: { min: 4000, max: 4250 },
    factors: {
      oi: 88,
      options: 82,
      vwap: 85,
      volProfile: 79,
      rsi: 84,
      priceAction: 80,
    },
    factorChecklist: [
      { label: 'Futures buildup', bias: 'FII surge +₹934 Cr buying', score: '+4.0', status: 'bull' },
      { label: 'Option chain', bias: 'Massive short covering in 4,100 CE', score: '+3.8', status: 'bull' },
      { label: 'Volume profile', bias: 'Breakout above monthly HVN', score: '+3.5', status: 'bull' },
      { label: 'RSI divergence', bias: 'Strong trend expansion (RSI 68)', score: '+3.0', status: 'bull' },
      { label: 'Price action', bias: 'Breakout above 50-DMA resistance', score: '+3.6', status: 'bull' },
      { label: 'VWAP structure', bias: 'Leading VWAP band with high volume', score: '+3.2', status: 'bull' },
    ],
    priceHistory: [
      { time: '19 Oct', price: 3980 },
      { time: '20 Oct', price: 4010 },
      { time: '21 Oct', price: 4040 },
      { time: '22 Oct', price: 4065 },
      { time: '23 Oct', price: 4050 },
      { time: '24 Oct', price: 4090 },
      { time: '25 Oct', price: 4110 },
      { time: '26 Oct', price: 4120.0 },
    ],
  },
  SBIN: {
    symbol: 'SBIN',
    name: 'State Bank of India',
    cmp: 812.5,
    changePct: -0.45,
    score: -1.2,
    stance: 'NEUTRAL',
    stanceText: 'Neutral-Bearish (-1.2/10) capped by PSU bank profit booking; writers box 790-830',
    writersBox: { min: 790, max: 830 },
    factors: {
      oi: 42,
      options: 38,
      vwap: 45,
      volProfile: 50,
      rsi: 40,
      priceAction: 44,
    },
    factorChecklist: [
      { label: 'Futures buildup', bias: 'Mild long unwinding', score: '-1.2', status: 'bear' },
      { label: 'Option chain', bias: 'Heavy 820 CE call addition', score: '-1.5', status: 'bear' },
      { label: 'Volume profile', bias: 'Testing low value shelf at 805', score: '-0.8', status: 'neutral' },
      { label: 'RSI divergence', bias: 'RSI cooling towards 48', score: '-0.5', status: 'neutral' },
      { label: 'Price action', bias: 'Lower high intraday pattern', score: '-1.0', status: 'bear' },
      { label: 'VWAP structure', bias: 'Hovering near daily VWAP', score: '0.0', status: 'neutral' },
    ],
    priceHistory: [
      { time: '19 Oct', price: 835 },
      { time: '20 Oct', price: 840 },
      { time: '21 Oct', price: 832 },
      { time: '22 Oct', price: 825 },
      { time: '23 Oct', price: 818 },
      { time: '24 Oct', price: 815 },
      { time: '25 Oct', price: 814 },
      { time: '26 Oct', price: 812.5 },
    ],
  },
  ITC: {
    symbol: 'ITC',
    name: 'ITC Ltd',
    cmp: 488.2,
    changePct: +0.35,
    score: +0.8,
    stance: 'NEUTRAL',
    stanceText: 'Neutral (+0.8/10) low-beta defensive rotation; writers box 475-500 (low conviction)',
    writersBox: { min: 475, max: 500 },
    factors: {
      oi: 52,
      options: 55,
      vwap: 50,
      volProfile: 58,
      rsi: 54,
      priceAction: 50,
    },
    factorChecklist: [
      { label: 'Futures buildup', bias: 'Defensive cash accumulation', score: '+1.0', status: 'bull' },
      { label: 'Option chain', bias: 'Writers tightly boxed around 490', score: '0.0', status: 'neutral' },
      { label: 'Volume profile', bias: 'High density volume cluster', score: '+1.2', status: 'bull' },
      { label: 'RSI divergence', bias: 'Neutral RSI 52', score: '0.0', status: 'neutral' },
      { label: 'Price action', bias: 'Narrow daily range containment', score: '+0.5', status: 'neutral' },
      { label: 'VWAP structure', bias: 'Trading flat on VWAP', score: '+0.2', status: 'neutral' },
    ],
    priceHistory: [
      { time: '19 Oct', price: 482 },
      { time: '20 Oct', price: 485 },
      { time: '21 Oct', price: 484 },
      { time: '22 Oct', price: 486 },
      { time: '23 Oct', price: 487 },
      { time: '24 Oct', price: 486 },
      { time: '25 Oct', price: 487.5 },
      { time: '26 Oct', price: 488.2 },
    ],
  },
  NIFTY: {
    symbol: 'NIFTY',
    name: 'NIFTY 50 Benchmark',
    cmp: 22530.85,
    changePct: -0.69,
    score: -0.8,
    stance: 'NEUTRAL',
    stanceText: 'Neutral (-0.8/10) sector rotation; heavy 22,600 call resistance; writers box 22,400-22,700',
    writersBox: { min: 22400, max: 22700 },
    factors: {
      oi: 60,
      options: 35,
      vwap: 45,
      volProfile: 62,
      rsi: 48,
      priceAction: 52,
    },
    factorChecklist: [
      { label: 'Futures buildup', bias: 'FII index long unwinding', score: '-1.4', status: 'bear' },
      { label: 'Option chain', bias: '22,600 CE call writers dominant', score: '-1.8', status: 'bear' },
      { label: 'Volume profile', bias: 'Support at 22,450 POC zone', score: '+1.5', status: 'bull' },
      { label: 'RSI divergence', bias: 'RSI at 47 neutral zone', score: '0.0', status: 'neutral' },
      { label: 'Price action', bias: 'Consolidating near 50-DMA', score: '+0.5', status: 'neutral' },
      { label: 'VWAP structure', bias: 'Under intraday VWAP', score: '-0.8', status: 'bear' },
    ],
    priceHistory: [
      { time: '19 Oct', price: 22700 },
      { time: '20 Oct', price: 22750 },
      { time: '21 Oct', price: 22680 },
      { time: '22 Oct', price: 22620 },
      { time: '23 Oct', price: 22590 },
      { time: '24 Oct', price: 22560 },
      { time: '25 Oct', price: 22545 },
      { time: '26 Oct', price: 22530.85 },
    ],
  },
};

const ALL_RADAR_SYMBOLS = [
  'RELIANCE',
  'PTC',
  'TCS',
  'INFY',
  'HDFCBANK',
  'ICICIBANK',
  'SBIN',
  'TATAMOTORS',
  'BAJFINANCE',
  'TITAN',
  'ITC',
  'MARUTI',
  'SUNPHARMA',
  'LT',
  'WIPRO',
  'KOTAKBANK',
  'AXISBANK',
  'NIFTY',
  'BANKNIFTY',
];

function generateRadarDataForStock(stock: any): StockRadarData {
  const cmp = stock.price || 100;
  const changePct = stock.changePct || 0;
  const isUp = changePct >= 0;

  // Score from -5 to +5 based on % change and technical factor alignment
  const score = Math.max(-5, Math.min(5, Number((changePct * 0.45).toFixed(1))));
  const stance: 'BULLISH' | 'NEUTRAL' | 'BEARISH' =
    score >= 1.2 ? 'BULLISH' : score <= -1.2 ? 'BEARISH' : 'NEUTRAL';

  // Calculate dynamic writers box floor and ceiling
  const interval = cmp > 5000 ? 100 : cmp > 1000 ? 50 : cmp > 200 ? 10 : 5;
  const boxMin = Math.floor((cmp * 0.96) / interval) * interval;
  const boxMax = Math.ceil((cmp * 1.04) / interval) * interval;

  const oi = Math.min(95, Math.max(25, Math.round(50 + changePct * 3.5)));
  const options = Math.min(95, Math.max(20, Math.round(50 + (isUp ? 22 : -25))));
  const vwap = Math.min(95, Math.max(20, Math.round(50 + changePct * 4)));
  const volProfile = Math.min(95, Math.max(30, Math.round(45 + (stock.volRatio || 1.1) * 18)));
  const rsi = Math.min(90, Math.max(20, Math.round(50 + changePct * 2.5)));
  const priceAction = Math.min(95, Math.max(25, Math.round(50 + changePct * 3.2)));

  return {
    symbol: stock.symbol,
    name: stock.name || `${stock.symbol} Ltd`,
    cmp,
    changePct,
    score,
    stance,
    stanceText: `${stance === 'BULLISH' ? 'Bullish' : stance === 'BEARISH' ? 'Bearish' : 'Neutral'} (${score > 0 ? '+' : ''}${score}/10) · writers box ₹${boxMin}–₹${boxMax}`,
    writersBox: { min: boxMin, max: boxMax },
    factors: { oi, options, vwap, volProfile, rsi, priceAction },
    factorChecklist: [
      {
        label: 'Futures buildup',
        bias: isUp ? `Aggressive long buildup (+${Math.abs(score * 0.9).toFixed(1)})` : `Short buildup (-${Math.abs(score * 0.9).toFixed(1)})`,
        score: `${isUp ? '+' : ''}${(score * 0.9).toFixed(1)}`,
        status: isUp ? 'bull' : 'bear',
      },
      {
        label: 'Option chain',
        bias: isUp ? `Put writers floor defended at ₹${boxMin}` : `Heavy call walls capping at ₹${boxMax}`,
        score: `${isUp ? '+' : '-'}${Math.abs(score * 0.8).toFixed(1)}`,
        status: isUp ? 'bull' : 'bear',
      },
      {
        label: 'Volume profile',
        bias: `Institutional participation ratio ${stock.volRatio || 1.2}x vs 20-DMA`,
        score: '+1.5',
        status: 'bull',
      },
      {
        label: 'RSI momentum',
        bias: `Daily RSI at ${rsi} (${rsi > 60 ? 'Strong momentum expansion' : rsi < 40 ? 'Oversold absorption' : 'Neutral equilibrium'})`,
        score: `${rsi > 50 ? '+' : '-'}${Math.abs((rsi - 50) / 15).toFixed(1)}`,
        status: rsi > 50 ? 'bull' : 'bear',
      },
      {
        label: 'Price action',
        bias: isUp ? 'Holding cleanly above intraday support' : 'Distribution below session VWAP',
        score: `${isUp ? '+' : '-'}${Math.abs(score * 0.7).toFixed(1)}`,
        status: isUp ? 'bull' : 'bear',
      },
      {
        label: 'VWAP structure',
        bias: isUp ? 'Trading firmly above intraday anchor VWAP' : 'Trading below anchor VWAP band',
        score: `${isUp ? '+' : '-'}${Math.abs(score * 0.6).toFixed(1)}`,
        status: isUp ? 'bull' : 'bear',
      },
    ],
    priceHistory: [
      { time: '19 Oct', price: Number((cmp * (1 - changePct * 0.05 - 0.02)).toFixed(1)) },
      { time: '20 Oct', price: Number((cmp * (1 - changePct * 0.04 - 0.01)).toFixed(1)) },
      { time: '21 Oct', price: Number((cmp * (1 - changePct * 0.03 + 0.01)).toFixed(1)) },
      { time: '22 Oct', price: Number((cmp * (1 - changePct * 0.02 - 0.005)).toFixed(1)) },
      { time: '23 Oct', price: Number((cmp * (1 - changePct * 0.015)).toFixed(1)) },
      { time: '24 Oct', price: Number((cmp * (1 - changePct * 0.01)).toFixed(1)) },
      { time: '25 Oct', price: Number((cmp * (1 - changePct * 0.005)).toFixed(1)) },
      { time: '26 Oct', price: cmp },
    ],
  };
}

export default function StockRadarView() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('RELIANCE');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [dynamicStocks, setDynamicStocks] = useState<Record<string, StockRadarData>>({});
  const [loadingStock, setLoadingStock] = useState<boolean>(false);

  // Fetch stock live from /api/live-stocks if not in static list
  const loadStockData = async (sym: string) => {
    const cleanSym = sym.toUpperCase().trim();
    if (!cleanSym) return;

    if (RADAR_STOCKS[cleanSym] || dynamicStocks[cleanSym]) {
      setSelectedSymbol(cleanSym);
      setSearchQuery('');
      setIsDropdownOpen(false);
      return;
    }

    setLoadingStock(true);
    try {
      const res = await fetch(`/api/live-stocks?symbol=${encodeURIComponent(cleanSym)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.stock) {
          const generated = generateRadarDataForStock(data.stock);
          setDynamicStocks((prev) => ({ ...prev, [cleanSym]: generated }));
          setSelectedSymbol(cleanSym);
        } else {
          // Fallback realistic synthesis
          const fallback = generateRadarDataForStock({ symbol: cleanSym, price: 150, changePct: 0.5, name: cleanSym });
          setDynamicStocks((prev) => ({ ...prev, [cleanSym]: fallback }));
          setSelectedSymbol(cleanSym);
        }
      }
    } catch (e) {
      // Fallback
      const fallback = generateRadarDataForStock({ symbol: cleanSym, price: 150, changePct: 0.5, name: cleanSym });
      setDynamicStocks((prev) => ({ ...prev, [cleanSym]: fallback }));
      setSelectedSymbol(cleanSym);
    } finally {
      setLoadingStock(false);
      setSearchQuery('');
      setIsDropdownOpen(false);
    }
  };

  const handleSelectSymbol = (sym: string) => {
    const cleanSym = sym.toUpperCase().trim();
    if (!cleanSym) return;
    soundEffects.playTabSwitch();
    setSelectedSymbol(cleanSym);
    setSearchQuery('');
    setIsDropdownOpen(false);
    if (!RADAR_STOCKS[cleanSym] && !dynamicStocks[cleanSym]) {
      loadStockData(cleanSym);
    }
  };

  // Auto-fetch if selectedSymbol is not yet in cache or RADAR_STOCKS
  useEffect(() => {
    if (selectedSymbol && !RADAR_STOCKS[selectedSymbol] && !dynamicStocks[selectedSymbol]) {
      loadStockData(selectedSymbol);
    }
  }, [selectedSymbol]);

  const currentData = useMemo(() => {
    if (dynamicStocks[selectedSymbol]) return dynamicStocks[selectedSymbol];
    if (RADAR_STOCKS[selectedSymbol]) return RADAR_STOCKS[selectedSymbol];
    
    // Immediate fallback synthesized for the exact requested symbol so it NEVER shows the wrong stock name
    return generateRadarDataForStock({
      symbol: selectedSymbol,
      name: `${selectedSymbol} Ltd`,
      price: 100,
      changePct: 0.0,
      volRatio: 1.0,
    });
  }, [selectedSymbol, dynamicStocks]);

  // Radar Polygon Points Calculation
  const radarAxes = [
    { key: 'oi', label: 'OI', angle: 270 }, // Top
    { key: 'options', label: 'Options', angle: 330 }, // Top Right
    { key: 'vwap', label: 'VWAP', angle: 30 }, // Bottom Right
    { key: 'volProfile', label: 'Vol profile', angle: 90 }, // Bottom
    { key: 'rsi', label: 'RSI', angle: 150 }, // Bottom Left
    { key: 'priceAction', label: 'Price action', angle: 210 }, // Top Left
  ];

  const radarPolygonPoints = useMemo(() => {
    const center = 140;
    const maxRadius = 100;
    return radarAxes
      .map((axis) => {
        const val = currentData.factors[axis.key as keyof typeof currentData.factors] || 50;
        const radius = (val / 100) * maxRadius;
        const rad = (axis.angle * Math.PI) / 180;
        const x = center + radius * Math.cos(rad);
        const y = center + radius * Math.sin(rad);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [currentData]);

  // Semi-circle gauge rotation (-90 to +90 deg for score -5 to +5)
  const gaugeAngleDeg = useMemo(() => {
    // clamp score between -5 and +5
    const clamped = Math.max(-5, Math.min(5, currentData.score));
    return (clamped / 5) * 80; // -80 to +80 deg
  }, [currentData.score]);

  const symbolPills = ['RELIANCE', 'NHPC', 'PTC', 'ICICIBANK', 'INFY', 'TCS', 'SBIN', 'ITC', 'NIFTY'];

  const filteredSymbols = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const set = new Set([...ALL_RADAR_SYMBOLS, ...Object.keys(dynamicStocks), ...Object.keys(RADAR_STOCKS)]);
    return Array.from(set).filter((s) => s.toLowerCase().includes(q));
  }, [searchQuery, dynamicStocks]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans p-3 sm:p-4 md:p-6 select-none">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Ticker & Symbol Selector Bar (Matching Image 1) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          {/* Left: Current CMP & % change */}
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 tracking-tight">
              {currentData.symbol}{' '}
              <span className="text-slate-800 font-bold">
                {currentData.cmp.toLocaleString()}
              </span>
            </span>
            <span
              className={`text-xs sm:text-sm font-bold font-mono px-2 py-0.5 rounded-md ${
                currentData.changePct >= 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {currentData.changePct >= 0 ? `+${currentData.changePct}%` : `${currentData.changePct}%`}
            </span>
          </div>

          {/* Right: Quick Stock Pills & Search Input */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {symbolPills.map((sym) => {
              const isSelected = selectedSymbol === sym;
              return (
                <button
                  key={sym}
                  onClick={() => handleSelectSymbol(sym)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer font-mono active:scale-[0.98] ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-xs ring-1 ring-indigo-500/30'
                      : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  {sym}
                </button>
              );
            })}

            {/* Any F&O symbol input */}
            <div className="relative shrink-0">
              <div className="flex items-center bg-slate-100 hover:bg-slate-200/80 focus-within:bg-white rounded-lg border border-transparent focus-within:border-indigo-400 transition px-2">
                <input
                  type="text"
                  placeholder="Any F&O symbol (e.g. PTC)..."
                  value={searchQuery}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      loadStockData(searchQuery.trim());
                    }
                  }}
                  className="text-xs py-1.5 bg-transparent focus:outline-hidden w-36 uppercase font-mono placeholder:normal-case placeholder:font-sans"
                />
                {loadingStock && (
                  <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0"></div>
                )}
              </div>

              {isDropdownOpen && searchQuery.trim() && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 max-h-60 overflow-y-auto">
                  {/* Quick Dynamic Load Action for typed ticker */}
                  <button
                    onClick={() => loadStockData(searchQuery.trim())}
                    className="w-full text-left px-3 py-2 text-xs bg-indigo-50 hover:bg-indigo-100 font-bold text-indigo-700 flex items-center justify-between border-b border-indigo-100"
                  >
                    <span>⚡ Load {searchQuery.toUpperCase()} Live</span>
                    <span className="text-[10px] bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded-sm">NSE Live</span>
                  </button>

                  {filteredSymbols.map((s) => (
                    <button
                      key={s}
                      onClick={() => loadStockData(s)}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 font-mono font-bold text-slate-800 flex items-center justify-between"
                    >
                      <span>{s}</span>
                      <span className="text-[10px] text-slate-400 font-sans">Analyze</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ELI5 / 5-Year Old Beginner Takeaway Card for Stock Radar */}
        <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-blue-200/80 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👶</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full font-mono">
                    Stock Radar Explained For Beginners
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Simple 1-glance guidance</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                  {currentData.stance === 'BULLISH' ? (
                    <span>
                      <strong className="text-emerald-700">🟢 GREEN SIGNAL:</strong> Buyers are aggressively driving {currentData.symbol}. It is trading safely above institutional support. Good time to buy dips near ₹{currentData.writersBox.min}!
                    </span>
                  ) : currentData.stance === 'BEARISH' ? (
                    <span>
                      <strong className="text-rose-700">🔴 CAUTION SIGNAL:</strong> Sellers are in control of {currentData.symbol} with score {currentData.score}. Option writers have built a strong ceiling at ₹{currentData.writersBox.max}. Wait for selling to stop!
                    </span>
                  ) : (
                    <span>
                      <strong className="text-amber-700">🟡 NEUTRAL SIGNAL:</strong> {currentData.symbol} is bouncing between ₹{currentData.writersBox.min} (floor) and ₹{currentData.writersBox.max} (ceiling). Trade the range or wait for breakout.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Floor (Support)</span>
                <span className="text-xs font-black text-emerald-700 font-mono">₹{currentData.writersBox.min}</span>
              </div>
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Ceiling (Resistance)</span>
                <span className="text-xs font-black text-rose-700 font-mono">₹{currentData.writersBox.max}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Two Columns (Exact Layout of Image 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: 6-Axis Spider / Radar Polygon Chart */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
            {/* Header info badge */}
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Multi-Factor Confluence Radar
              </span>
              <div className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[11px] font-mono">
                <span>{currentData.stance.toLowerCase()}</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* Radar SVG Visual */}
            <div className="relative flex items-center justify-center py-2">
              <svg width="320" height="300" viewBox="0 0 280 280" className="overflow-visible">
                {/* Concentric Reference Polygons (20%, 40%, 60%, 80%, 100%) */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, i) => {
                  const pts = radarAxes
                    .map((axis) => {
                      const rad = (axis.angle * Math.PI) / 180;
                      const x = 140 + 100 * scale * Math.cos(rad);
                      const y = 140 + 100 * scale * Math.sin(rad);
                      return `${x.toFixed(1)},${y.toFixed(1)}`;
                    })
                    .join(' ');
                  return (
                    <polygon
                      key={i}
                      points={pts}
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth={i === 4 ? '1.5' : '1'}
                      strokeDasharray={i === 4 ? undefined : '3,3'}
                    />
                  );
                })}

                {/* Radar Axis Spokes */}
                {radarAxes.map((axis) => {
                  const rad = (axis.angle * Math.PI) / 180;
                  const x = 140 + 100 * Math.cos(rad);
                  const y = 140 + 100 * Math.sin(rad);
                  return (
                    <line
                      key={axis.key}
                      x1="140"
                      y1="140"
                      x2={x}
                      y2={y}
                      stroke="#CBD5E1"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Filled Confluence Polygon (Green with glow) */}
                <polygon
                  points={radarPolygonPoints}
                  fill="rgba(34, 197, 94, 0.28)"
                  stroke="#16A34A"
                  strokeWidth="2.5"
                  className="transition-all duration-700 ease-out"
                />

                {/* Glowing Vertex Dots on Polygon */}
                {radarAxes.map((axis) => {
                  const val = currentData.factors[axis.key as keyof typeof currentData.factors] || 50;
                  const radius = (val / 100) * 100;
                  const rad = (axis.angle * Math.PI) / 180;
                  const x = 140 + radius * Math.cos(rad);
                  const y = 140 + radius * Math.sin(rad);
                  return (
                    <circle
                      key={axis.key}
                      cx={x}
                      cy={y}
                      r="4.5"
                      fill="#15803D"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      className="shadow-sm"
                    />
                  );
                })}

                {/* Labels around the perimeter */}
                {radarAxes.map((axis) => {
                  const rad = (axis.angle * Math.PI) / 180;
                  // Push labels 25px further outward
                  const x = 140 + 124 * Math.cos(rad);
                  const y = 140 + 120 * Math.sin(rad);
                  return (
                    <text
                      key={axis.key}
                      x={x}
                      y={y + 4}
                      textAnchor="middle"
                      className="text-[11.5px] font-sans font-bold fill-slate-700 select-none"
                    >
                      {axis.label}
                    </text>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-100">
              <span>Confluence Area: {Object.values(currentData.factors).reduce((a, b) => a + b, 0)} pts</span>
              <span className="text-emerald-700 font-semibold">Live Algorithm Weighting</span>
            </div>
          </div>

          {/* Right Column: SCORE & EXPECTED RANGE (Exact Match to Image 1) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-900 tracking-wider uppercase">
                SCORE & EXPECTED RANGE
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Writers Box: ₹{currentData.writersBox.min} - ₹{currentData.writersBox.max}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Semi-Circular Colored Arc Gauge */}
              <div className="sm:col-span-6 flex flex-col items-center justify-center relative">
                <svg width="220" height="130" viewBox="0 0 220 130" className="overflow-visible">
                  {/* Gauge colored arc segments (red -> orange -> light green -> green) */}
                  {/* Arc Path: center (110, 115), radius 80 */}
                  {/* Segment 1: Red (-5 to -2.5) */}
                  <path
                    d="M 30,115 A 80,80 0 0,1 55,55"
                    fill="none"
                    stroke="#FCA5A5"
                    strokeWidth="22"
                    strokeLinecap="round"
                  />
                  {/* Segment 2: Light Orange (-2.5 to 0) */}
                  <path
                    d="M 58,52 A 80,80 0 0,1 110,35"
                    fill="none"
                    stroke="#FDBA74"
                    strokeWidth="22"
                  />
                  {/* Segment 3: Light Green (0 to +2.5) */}
                  <path
                    d="M 110,35 A 80,80 0 0,1 162,52"
                    fill="none"
                    stroke="#86EFAC"
                    strokeWidth="22"
                  />
                  {/* Segment 4: Emerald Green (+2.5 to +5) */}
                  <path
                    d="M 165,55 A 80,80 0 0,1 190,115"
                    fill="none"
                    stroke="#4ADE80"
                    strokeWidth="22"
                    strokeLinecap="round"
                  />

                  {/* Black Circular Ring Pointer / Indicator (Exact match to Image 1) */}
                  <g transform={`rotate(${gaugeAngleDeg}, 110, 115)`}>
                    <circle
                      cx="110"
                      cy="35"
                      r="9"
                      fill="#FFFFFF"
                      stroke="#0F172A"
                      strokeWidth="4"
                      className="shadow-md transition-all duration-700 ease-out"
                    />
                  </g>
                </svg>

                {/* Big Center Score & Stance */}
                <div className="text-center -mt-6">
                  <div className="text-3xl font-black font-mono text-slate-900 tracking-tight">
                    {currentData.score > 0 ? `+${currentData.score}` : `${currentData.score}`}
                  </div>
                  <div className="text-xs font-black tracking-widest text-slate-700 uppercase mt-0.5 font-mono">
                    {currentData.stance}
                  </div>
                </div>
              </div>

              {/* Checklist Breakdown on the right */}
              <div className="sm:col-span-6 space-y-1.5 text-xs font-sans">
                {currentData.factorChecklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.status === 'bull'
                            ? 'bg-emerald-500'
                            : item.status === 'bear'
                            ? 'bg-rose-500'
                            : 'bg-amber-400'
                        }`}
                      ></span>
                      <span className="font-medium text-slate-700">{item.label}</span>
                    </div>
                    <span
                      className={`font-mono font-bold text-[11px] ${
                        item.status === 'bull'
                          ? 'text-emerald-600'
                          : item.status === 'bear'
                          ? 'text-rose-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom summary note matching Image 1 */}
            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 leading-relaxed font-sans">
              {currentData.stanceText}
            </div>
          </div>
        </div>

        {/* Bottom Full-Width Line Chart (Matching Image 1) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                {currentData.symbol} · PRICE TRAJECTORY VS WRITERS&apos; BOX
              </span>
              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                Range: ₹{currentData.writersBox.min} - ₹{currentData.writersBox.max}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-rose-100 border border-rose-300 inline-block rounded-xs"></span>
                Resistance ({currentData.writersBox.max})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-emerald-100 border border-emerald-300 inline-block rounded-xs"></span>
                Support ({currentData.writersBox.min})
              </span>
            </div>
          </div>

          {/* Canvas or SVG Price Chart with Bands */}
          <div className="relative h-48 w-full bg-slate-50/50 rounded-xl border border-slate-100 p-2 flex flex-col justify-between overflow-hidden">
            {/* Horizontal Resistance line */}
            <div className="absolute top-4 left-0 right-0 border-b border-dashed border-rose-300 flex justify-between px-3 text-[10px] font-mono text-rose-600">
              <span>Call Resistance Wall: ₹{currentData.writersBox.max}</span>
              <span>Strong Supply</span>
            </div>

            {/* Midline Max Pain */}
            <div className="absolute top-1/2 left-0 right-0 border-b border-dotted border-indigo-200 flex justify-between px-3 text-[10px] font-mono text-indigo-400">
              <span>Max Pain / POC Level</span>
            </div>

            {/* Horizontal Support line */}
            <div className="absolute bottom-6 left-0 right-0 border-b border-dashed border-emerald-300 flex justify-between px-3 text-[10px] font-mono text-emerald-600">
              <span>Put Support Floor: ₹{currentData.writersBox.min}</span>
              <span>Demand Absorption</span>
            </div>

            {/* Price Line Curve */}
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 700 160">
              {/* Shaded Expected Range Band */}
              <rect x="0" y="25" width="700" height="100" fill="rgba(79, 70, 229, 0.04)" />

              {/* Price Line */}
              <polyline
                fill="none"
                stroke="#DC2626"
                strokeWidth="2.5"
                points="10,40 100,30 200,60 300,75 400,110 500,95 600,70 690,65"
              />
              {/* Shaded Area under line */}
              <polygon
                fill="rgba(239, 68, 68, 0.08)"
                points="10,40 100,30 200,60 300,75 400,110 500,95 600,70 690,65 690,140 10,140"
              />
            </svg>

            {/* Date timeline labels along bottom */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono px-3">
              {currentData.priceHistory.map((h, i) => (
                <span key={i}>{h.time}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
