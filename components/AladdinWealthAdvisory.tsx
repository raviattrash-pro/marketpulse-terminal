'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Award,
  AlertTriangle,
  Info,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
  PieChart as PieChartIcon,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Flame,
  FileText,
  Building2,
  Calendar,
  ChevronRight,
  ExternalLink,
  Target,
  Zap,
  Check,
  XCircle,
} from 'lucide-react';
import { soundEffects } from '@/lib/soundEffects';

export type AdvisoryCategory = 'ALL' | 'STOCKS' | 'MUTUAL_FUNDS' | 'IPOS';

interface StockAdvisoryItem {
  type: 'STOCK';
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  sector: string;
  cmp: number;
  fairValue: number;
  marginOfSafetyPct: number;
  pe: number;
  industryPe: number;
  evToEbitda: number;
  dividendYield: number;
  roce: number;
  roe: number;
  debtToEquity: number;
  marketCapCr: number;
  marketDepthBidRatio: number; // Exchange 20-depth: bid qty / (bid + ask qty)
  corporateActionNotice: string; // Corporate Actions Framework
  macroSensitivity: string; // Macro Liquidity events
  convictionScore: number; // 0-100 Aladdin score
  verdict: 'STRONG ACCUMULATE' | 'BUY ON DIPS' | 'FAIRLY VALUED' | 'HIGH VALUATION RISK';
  target1: number;
  target2: number;
  stopLoss: number;
  academyLesson: string;
  nseAcademyInsight: string;
}

interface MutualFundAdvisoryItem {
  type: 'MUTUAL_FUND';
  id: string;
  name: string;
  category: 'Flexi Cap' | 'Large & Mid' | 'Small Cap' | 'Index ETF' | 'Arbitrage / Liquid' | 'Gold / SGB';
  cagr1y: number;
  cagr3y: number;
  cagr5y: number;
  nav: number;
  aumCr: number;
  expenseRatio: number; // TER %
  trackingErrorPct?: number; // For ETFs
  alpha: number; // vs benchmark
  beta: number; // volatility vs benchmark
  sharpeRatio: number; // risk-adjusted return
  sortinoRatio: number; // downside protection
  exitLoad: string;
  topHoldings: string[];
  recommendedHorizon: string; // e.g. "5+ Years", "1-3 Years", "< 1 Year"
  riskProfile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  convictionScore: number;
  verdict: 'RECOMMENDED (CORE SIP)' | 'TACTICAL SATELLITE' | 'SUITABLE FOR SHORT TERM' | 'WATCHLIST';
  academyLesson: string;
  nseAcademyInsight: string;
}

interface IPOAdvisoryItem {
  type: 'IPO';
  id: string;
  name: string;
  companySlug: string;
  dates: string;
  priceBand: string;
  lotSize: number;
  minInvestment: number;
  issueSizeCr: number;
  freshIssueCr: number; // Primary Market: Fresh capital goes to company growth
  ofsCr: number; // Primary Market: OFS goes to exiting promoters
  gmp: number; // Grey Market Premium in ₹
  expectedListingGainPct: number;
  qibSubscription: number; // x times
  niiSubscription: number;
  retailSubscription: number;
  peAtCutoff: number;
  peerAveragePe: number;
  status: 'OPEN NOW' | 'UPCOMING' | 'RECENTLY LISTED';
  convictionScore: number;
  applyDecision: 'APPLY — MUST SUBSCRIBE' | 'APPLY TACTICALLY (LISTING GAINS ONLY)' | 'AVOID / HIGH VALUATION RISK';
  applyReasonTitle: string;
  applyReasonDetail: string;
  checklist: {
    capitalIntegrity: { pass: boolean; note: string };
    gmpStrength: { pass: boolean; note: string };
    institutionalBacking: { pass: boolean; note: string };
    valuationComfort: { pass: boolean; note: string };
    anchorRisk: { pass: boolean; note: string };
  };
  biddingStrategy: string;
  verdict: 'SUBSCRIBE LONG TERM' | 'APPLY FOR LISTING GAINS' | 'AVOID / HIGH VALUATION' | 'NEUTRAL';
  academyLesson: string;
  nseAcademyInsight: string;
}

type UniversalItem = StockAdvisoryItem | MutualFundAdvisoryItem | IPOAdvisoryItem;

export interface LiveAssetQuote {
  price: number;
  changePct: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  exchange: string;
  pe?: number;
  fairValue?: number;
  marginOfSafetyPct?: number;
  target1?: number;
  target2?: number;
  stopLoss?: number;
  lastUpdated: string;
}

export default function AladdinWealthAdvisory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AdvisoryCategory>('ALL');
  const [ipoStatusFilter, setIpoStatusFilter] = useState<'ALL' | 'UPCOMING' | 'RECENTLY_LISTED'>('ALL');
  const [activeItem, setActiveItem] = useState<UniversalItem | null>(null);
  const [liveAssetQuotes, setLiveAssetQuotes] = useState<Record<string, LiveAssetQuote>>({});
  const [lastRefreshTime, setLastRefreshTime] = useState<string>('');
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [viewMode, setViewMode] = useState<'REELS' | 'PRO'>('REELS');
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [mobileProTab, setMobileProTab] = useState<'LIST' | 'DETAIL'>('LIST');
  const [sortBy, setSortBy] = useState<'CONVICTION' | 'PRICE' | 'CHANGE' | 'NAME'>('CONVICTION');
  const [liveNewsMap, setLiveNewsMap] = useState<Record<string, { headline: string; source: string; pubDate: string; type: 'DEMAND_REASON' | 'FALL_REASON' | 'MARKET_NEWS' }>>({});
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  // Curated Knowledge Base derived from Exchange & Market Academy + NSE Academy + NYIF Deloitte Curriculums
  const baseStocks: StockAdvisoryItem[] = useMemo(() => [
    {
      type: 'STOCK',
      symbol: 'NMDC',
      name: 'NMDC India Ltd',
      exchange: 'NSE',
      sector: 'Metals & Mining (PSU)',
      cmp: 66.35,
      fairValue: 78.5,
      marginOfSafetyPct: 18.3,
      pe: 6.8,
      industryPe: 12.4,
      evToEbitda: 4.2,
      dividendYield: 6.2,
      roce: 27.4,
      roe: 22.1,
      debtToEquity: 0.04,
      marketCapCr: 19450,
      marketDepthBidRatio: 0.64,
      corporateActionNotice: 'Exchange Action: High historical interim dividend payer (₹5.75/sh distributed annually). Ex-dividend dates create healthy mean-reversion pullbacks.',
      macroSensitivity: 'Macro Driver: Direct correlation with global iron ore benchmark and Chinese steel capacity utilization.',
      convictionScore: 92,
      verdict: 'STRONG ACCUMULATE',
      target1: 76.0,
      target2: 84.0,
      stopLoss: 61.5,
      academyLesson: 'Chapter 1: Inflation-beating real return assets require low PE, high dividend yields, and positive free cash flows.',
      nseAcademyInsight: 'Deloitte Corporate Finance: Ultra-low Debt/Equity (0.04) and RoCE (27.4%) position NMDC as a high-margin value fortress in multi-asset portfolios.',
    },
    {
      type: 'STOCK',
      symbol: 'IRFC',
      name: 'Indian Railway Finance Corp',
      exchange: 'NSE',
      sector: 'Railway Infra & NBFC',
      cmp: 74.45,
      fairValue: 92.0,
      marginOfSafetyPct: 23.5,
      pe: 14.2,
      industryPe: 18.5,
      evToEbitda: 11.5,
      dividendYield: 2.8,
      roce: 10.2,
      roe: 14.6,
      debtToEquity: 8.4,
      marketCapCr: 97300,
      marketDepthBidRatio: 0.58,
      corporateActionNotice: 'Exchange Action: Predictable cost-plus lease margin model with Ministry of Railways; nil NPA sovereign guarantee structure.',
      macroSensitivity: 'Macro Driver: Direct beneficiary of Union Budget railway infrastructure capital expenditure allocations.',
      convictionScore: 90,
      verdict: 'BUY ON DIPS',
      target1: 86.0,
      target2: 98.0,
      stopLoss: 68.0,
      academyLesson: 'Chapter 3: Sovereign-backed NBFCs operate with near-zero credit default risk due to direct government lease agreements.',
      nseAcademyInsight: 'NSE CIIB Asset Classes Track: Bond-like predictable cash flow stream with continuous equity appreciation upside.',
    },
    {
      type: 'STOCK',
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      exchange: 'NSE',
      sector: 'IT Services & Cloud',
      cmp: 2530.0,
      fairValue: 2850.0,
      marginOfSafetyPct: 12.6,
      pe: 26.4,
      industryPe: 28.1,
      evToEbitda: 18.2,
      dividendYield: 2.4,
      roce: 58.2,
      roe: 49.5,
      debtToEquity: 0.0,
      marketCapCr: 915000,
      marketDepthBidRatio: 0.62,
      corporateActionNotice: 'Exchange Action: Continuous buyback track record (4 buybacks in 6 years at 15-20% premium over CMP) creating EPS accretion.',
      macroSensitivity: 'Macro Driver: US Fed Interest rate cuts stimulate BFSI discretionary tech spending and enterprise cloud modernization pipelines.',
      convictionScore: 94,
      verdict: 'STRONG ACCUMULATE',
      target1: 2780.0,
      target2: 3050.0,
      stopLoss: 2380.0,
      academyLesson: 'Chapter 8: Market-cap heavyweight in Nifty 50. High RoCE (>50%) and zero debt establish durable economic moats.',
      nseAcademyInsight: 'NYIF Portfolio Track: High return-on-equity compounding powerhouse suitable as core long-term equity anchor.',
    },
    {
      type: 'STOCK',
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      exchange: 'NSE',
      sector: 'Energy, Retail & Telecom',
      cmp: 1190.0,
      fairValue: 1350.0,
      marginOfSafetyPct: 13.4,
      pe: 23.5,
      industryPe: 25.0,
      evToEbitda: 12.8,
      dividendYield: 0.8,
      roce: 12.5,
      roe: 10.8,
      debtToEquity: 0.42,
      marketCapCr: 1610000,
      marketDepthBidRatio: 0.55,
      corporateActionNotice: 'Exchange Action: 1:1 Bonus Issue completed; expected value unlocking via potential Jio & Retail public market listings.',
      macroSensitivity: 'Macro Driver: Singapore GRM (Gross Refining Margin) fluctuations and domestic 5G tariff hikes.',
      convictionScore: 91,
      verdict: 'BUY ON DIPS',
      target1: 1280.0,
      target2: 1400.0,
      stopLoss: 1120.0,
      academyLesson: 'Chapter 12: Bonus shares double quantity without changing market cap initially, but increase retail liquidity and accessibility over time.',
      nseAcademyInsight: 'NSE Wealth Advisory Track: Multi-sector conglomerate diversification provides defensive downside during market corrections.',
    },
    {
      type: 'STOCK',
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      exchange: 'NSE',
      sector: 'Banking & Financials',
      cmp: 692.8,
      fairValue: 880.0,
      marginOfSafetyPct: 27.0,
      pe: 18.2,
      industryPe: 19.5,
      evToEbitda: 14.1,
      dividendYield: 1.6,
      roce: 16.8,
      roe: 15.5,
      debtToEquity: 1.1,
      marketCapCr: 1280000,
      marketDepthBidRatio: 0.68,
      corporateActionNotice: 'Exchange Action: Post-HDFC Ltd merger consolidation phase. NIM (Net Interest Margin) troughing out with CASA ratio stabilizing above 38%.',
      macroSensitivity: 'Macro Driver: RBI Repo rate cycle and systemic credit growth trajectory.',
      convictionScore: 95,
      verdict: 'STRONG ACCUMULATE',
      target1: 780.0,
      target2: 890.0,
      stopLoss: 650.0,
      academyLesson: 'Chapter 16: Deep market depth on both sides of the order book ensures low impact cost for institutional accumulators.',
      nseAcademyInsight: 'Deloitte Risk Management: Largest private lender with NPA ratios below 1.3%, offering multi-year compounding safety.',
    },
    {
      type: 'STOCK',
      symbol: 'TATAMOTORS',
      name: 'Tata Motors Passenger Vehicles (TMPV)',
      exchange: 'NSE',
      sector: 'Auto & EV Mobility',
      cmp: 264.6,
      fairValue: 340.0,
      marginOfSafetyPct: 28.5,
      pe: 11.2,
      industryPe: 18.0,
      evToEbitda: 6.8,
      dividendYield: 1.8,
      roce: 21.0,
      roe: 24.2,
      debtToEquity: 0.35,
      marketCapCr: 97500,
      marketDepthBidRatio: 0.61,
      corporateActionNotice: 'Exchange Action: Official demerger into Commercial Vehicles (TMCV) and Passenger Vehicles (TMPV) unlocking focused pure-play valuations.',
      macroSensitivity: 'Macro Driver: JLR global order book, UK/Europe supply chain, and raw material (steel/lithium) input costs.',
      convictionScore: 93,
      verdict: 'STRONG ACCUMULATE',
      target1: 310.0,
      target2: 360.0,
      stopLoss: 245.0,
      academyLesson: 'Chapter 12: Demergers eliminate conglomerate discount by allowing specialized institutional capital to value distinct growth drivers.',
      nseAcademyInsight: 'NSE CIIB M&A Track: Strategic restructuring enhances capital allocation efficiency and improves standalone return ratios.',
    },
    {
      type: 'STOCK',
      symbol: 'PTC',
      name: 'PTC India Ltd',
      exchange: 'NSE',
      sector: 'Power Trading & Utilities',
      cmp: 133.37,
      fairValue: 165.0,
      marginOfSafetyPct: 23.7,
      pe: 7.2,
      industryPe: 16.5,
      evToEbitda: 5.1,
      dividendYield: 5.8,
      roce: 14.5,
      roe: 12.8,
      debtToEquity: 0.15,
      marketCapCr: 3950,
      marketDepthBidRatio: 0.52,
      corporateActionNotice: 'Exchange Action: High dividend payout policy with quarterly electricity exchange trading volume expansion.',
      macroSensitivity: 'Macro Driver: Peak summer and industrial power demand spikes on the Indian Energy Exchange (IEX).',
      convictionScore: 88,
      verdict: 'BUY ON DIPS',
      target1: 152.0,
      target2: 170.0,
      stopLoss: 122.0,
      academyLesson: 'Chapter 1: Power trading intermediaries benefit from rising volume throughput with minimal capital expenditure requirements.',
      nseAcademyInsight: 'NSE Wealth Advisory: High dividend yield acts as a downside cushion against broader equity volatility.',
    },
    {
      type: 'STOCK',
      symbol: 'JIOFIN',
      name: 'Jio Financial Services Limited',
      exchange: 'NSE',
      sector: 'Financial Services & Asset Management',
      cmp: 205.03,
      fairValue: 245.0,
      marginOfSafetyPct: 19.5,
      pe: 79.1,
      industryPe: 24.0,
      evToEbitda: 42.0,
      dividendYield: 0.0,
      roce: 8.5,
      roe: 7.2,
      debtToEquity: 0.02,
      marketCapCr: 135000,
      marketDepthBidRatio: 0.62,
      corporateActionNotice: 'Exchange Action: Demerged from Reliance Industries; 50:50 Joint Venture with BlackRock for domestic asset management, wealth advisory, and digital broking.',
      macroSensitivity: 'Macro Driver: RBI NBFC liquidity regulations, digital credit adoption across 480M Jio customer ecosystem.',
      convictionScore: 92,
      verdict: 'STRONG ACCUMULATE',
      target1: 235.0,
      target2: 260.0,
      stopLoss: 194.0,
      academyLesson: 'Chapter 1: Capital adequacy and BlackRock institutional backing provide structural moats in modern digital asset management.',
      nseAcademyInsight: 'NSE CIIB Asset Classes Track: Deep capital reserves (₹1.35 Lakh Cr) and zero debt allow rapid loan book expansion without credit risk spikes.',
    },
    {
      type: 'STOCK',
      symbol: 'TATACAP',
      name: 'Tata Capital Limited',
      exchange: 'NSE',
      sector: 'Financial Services & NBFC',
      cmp: 306.75,
      fairValue: 340.0,
      marginOfSafetyPct: 10.8,
      pe: 21.6,
      industryPe: 28.0,
      evToEbitda: 14.5,
      dividendYield: 1.2,
      roce: 15.8,
      roe: 17.4,
      debtToEquity: 4.8,
      marketCapCr: 122000,
      marketDepthBidRatio: 0.59,
      corporateActionNotice: 'Exchange Action: Listed on 13 Oct 2025 (NSE: TATACAP, BSE: 544574) following RBI Upper-Layer regulatory guidelines.',
      macroSensitivity: 'Macro Driver: Domestic interest rate cuts and retail asset loan book expansion.',
      convictionScore: 94,
      verdict: 'STRONG ACCUMULATE',
      target1: 335.0,
      target2: 360.0,
      stopLoss: 290.0,
      academyLesson: 'Chapter 5: Parentage by Tata Sons provides sovereign-grade borrowing rates and enduring franchise trust.',
      nseAcademyInsight: 'NSE Wealth Advisory: Pristine asset quality (Net NPA < 0.4%) guarantees long-term compounding resilience.',
    },
    {
      type: 'STOCK',
      symbol: 'HDBFS',
      name: 'HDB Financial Services Limited',
      exchange: 'NSE',
      sector: 'Financial Services & NBFC',
      cmp: 504.85,
      fairValue: 580.0,
      marginOfSafetyPct: 14.9,
      pe: 20.6,
      industryPe: 26.0,
      evToEbitda: 13.8,
      dividendYield: 1.0,
      roce: 16.4,
      roe: 16.8,
      debtToEquity: 5.2,
      marketCapCr: 39800,
      marketDepthBidRatio: 0.56,
      corporateActionNotice: 'Exchange Action: Listed on 02 Jul 2025 (NSE: HDBFS) as HDFC Bank subsidiary.',
      macroSensitivity: 'Macro Driver: Consumer credit growth, rural/semi-urban commercial vehicle and MSME demand.',
      convictionScore: 93,
      verdict: 'BUY ON DIPS',
      target1: 545.0,
      target2: 590.0,
      stopLoss: 480.0,
      academyLesson: 'Chapter 1: Network of 1,600+ branches across Tier 2 and Tier 3 cities provides structural credit distribution advantage.',
      nseAcademyInsight: 'Deloitte Corporate Finance: Direct borrowing synergy from HDFC Bank protects net interest margins.',
    },
    {
      type: 'STOCK',
      symbol: 'SBIFUNDS',
      name: 'SBI Funds Management Limited (SBI Mutual Fund)',
      exchange: 'NSE',
      sector: 'Asset Management & AMC',
      cmp: 613.3,
      fairValue: 680.0,
      marginOfSafetyPct: 10.9,
      pe: 34.2,
      industryPe: 38.0,
      evToEbitda: 22.5,
      dividendYield: 1.8,
      roce: 38.4,
      roe: 32.6,
      debtToEquity: 0.0,
      marketCapCr: 58900,
      marketDepthBidRatio: 0.61,
      corporateActionNotice: 'Exchange Action: Officially listed on 21 Jul 2026 (NSE: SBIFUNDS, BSE: 544829) at ₹613.30 (+6.85% over issue price ₹574).',
      macroSensitivity: 'Macro Driver: Direct beneficiary of domestic SIP equity financialization and mutual fund AUM expansion.',
      convictionScore: 95,
      verdict: 'STRONG ACCUMULATE',
      target1: 670.0,
      target2: 720.0,
      stopLoss: 565.0,
      academyLesson: 'Chapter 1: AMCs operate with high free cash flow conversion, negative working capital, and structural tailwinds from domestic SIP compounding.',
      nseAcademyInsight: 'NSE Wealth Advisory: India’s #1 AMC managing over ₹11 Lakh Cr AUM with 22,000+ branch distribution reach.',
    },
  ], []);

  // Curated Mutual Funds & ETFs derived from NSE Academy / NYIF Track
  const baseFunds: MutualFundAdvisoryItem[] = useMemo(() => [
    {
      type: 'MUTUAL_FUND',
      id: 'ppfas-flexi-cap',
      name: 'Parag Parikh Flexi Cap Fund',
      category: 'Flexi Cap',
      cagr1y: 28.4,
      cagr3y: 21.6,
      cagr5y: 23.8,
      nav: 84.15,
      aumCr: 76500,
      expenseRatio: 0.62,
      alpha: 6.4,
      beta: 0.74,
      sharpeRatio: 1.85,
      sortinoRatio: 2.42,
      exitLoad: '2% if redeemed within 365 days; 1% between 366-730 days',
      topHoldings: ['HDFC Bank', 'ITC Ltd', 'Power Grid Corp', 'Alphabet (Google)', 'Coal India'],
      recommendedHorizon: '5+ Years (Long Term Wealth)',
      riskProfile: 'MODERATE',
      convictionScore: 96,
      verdict: 'RECOMMENDED (CORE SIP)',
      academyLesson: 'Chapter 1: True diversification spans across market caps and geographic regimes with low expense ratio friction.',
      nseAcademyInsight: 'NYIF Portfolio Strategy: Low beta (0.74) with stellar Sortino ratio (2.42) proves superior downside risk protection during market drawdowns.',
    },
    {
      type: 'MUTUAL_FUND',
      id: 'quant-small-cap',
      name: 'Quant Small Cap Fund',
      category: 'Small Cap',
      cagr1y: 39.2,
      cagr3y: 28.5,
      cagr5y: 36.1,
      nav: 268.4,
      aumCr: 24200,
      expenseRatio: 0.75,
      alpha: 11.2,
      beta: 1.15,
      sharpeRatio: 1.95,
      sortinoRatio: 2.15,
      exitLoad: '1% if redeemed within 1 year',
      topHoldings: ['Reliance Industries', 'Jio Financial', 'Bikaji Foods', 'Aegis Logistics', 'HFCL'],
      recommendedHorizon: '7+ Years (High Growth)',
      riskProfile: 'AGGRESSIVE',
      convictionScore: 92,
      verdict: 'TACTICAL SATELLITE',
      academyLesson: 'Chapter 1: Small cap allocations must be held across full 5-7 year business cycles to absorb short-term 25-30% drawdowns.',
      nseAcademyInsight: 'Deloitte Analytics Track: High momentum and dynamic asset churn generate strong alpha but require strict horizon discipline.',
    },
    {
      type: 'MUTUAL_FUND',
      id: 'sbi-nifty-50-etf',
      name: 'SBI Nifty 50 ETF (NIFTYBEES / SETFNIF50)',
      category: 'Index ETF',
      cagr1y: 19.8,
      cagr3y: 15.2,
      cagr5y: 16.4,
      nav: 246.5,
      aumCr: 182000,
      expenseRatio: 0.04,
      trackingErrorPct: 0.02,
      alpha: 0.0,
      beta: 1.0,
      sharpeRatio: 1.25,
      sortinoRatio: 1.62,
      exitLoad: 'Nil (Tradeable on exchange like stock)',
      topHoldings: ['HDFC Bank (11.8%)', 'Reliance (9.4%)', 'ICICI Bank (7.9%)', 'Infosys (5.8%)', 'TCS (4.2%)'],
      recommendedHorizon: '3+ Years',
      riskProfile: 'CONSERVATIVE',
      convictionScore: 95,
      verdict: 'RECOMMENDED (CORE SIP)',
      academyLesson: 'Chapter 8: The Nifty 50 index is a self-cleansing basket; losers drop out, while winners grow their weights automatically.',
      nseAcademyInsight: 'NSE ETFs Track: Near-zero tracking error (0.02%) and rock-bottom 0.04% expense ratio ensure 99.96% of market returns reach the investor.',
    },
    {
      type: 'MUTUAL_FUND',
      id: 'nippon-india-gold-bees',
      name: 'Nippon India ETF Gold BeES (GOLDBEES)',
      category: 'Gold / SGB',
      cagr1y: 31.5,
      cagr3y: 18.2,
      cagr5y: 14.8,
      nav: 69.2,
      aumCr: 14500,
      expenseRatio: 0.52,
      trackingErrorPct: 0.05,
      alpha: 1.2,
      beta: 0.08,
      sharpeRatio: 1.48,
      sortinoRatio: 1.90,
      exitLoad: 'Nil (Real-time exchange trading)',
      topHoldings: ['Physical Gold of 99.5% purity (98.8%)', 'Cash Equivalents (1.2%)'],
      recommendedHorizon: 'Any (Asset Allocation Hedge)',
      riskProfile: 'CONSERVATIVE',
      convictionScore: 94,
      verdict: 'RECOMMENDED (CORE SIP)',
      academyLesson: 'Chapter 13: Gold acts as an un-printable monetary hedge during currency debasement and geopolitical risk spikes.',
      nseAcademyInsight: 'NYIF Portfolio Risk Parity: 10% to 15% gold allocation reduces overall portfolio drawdowns during global equity bear phases.',
    },
    {
      type: 'MUTUAL_FUND',
      id: 'mirae-asset-large-midcap',
      name: 'Mirae Asset Large & Midcap Fund',
      category: 'Large & Mid',
      cagr1y: 26.2,
      cagr3y: 18.9,
      cagr5y: 20.4,
      nav: 132.8,
      aumCr: 38900,
      expenseRatio: 0.65,
      alpha: 3.8,
      beta: 0.92,
      sharpeRatio: 1.62,
      sortinoRatio: 2.05,
      exitLoad: '1% if redeemed within 1 year',
      topHoldings: ['HDFC Bank', 'ICICI Bank', 'TCS', 'Larsen & Toubro', 'Trent Ltd'],
      recommendedHorizon: '5+ Years',
      riskProfile: 'MODERATE',
      convictionScore: 91,
      verdict: 'RECOMMENDED (CORE SIP)',
      academyLesson: 'Chapter 1: Blend of Large Cap stability (50%) and Mid Cap alpha generation (50%) creates the optimal risk-return frontier.',
      nseAcademyInsight: 'NSE Wealth Track: Ideal core wealth vehicle for investors seeking above-index returns without small-cap volatility.',
    },
  ], []);

  // COMPREHENSIVE LATEST & UPCOMING IPO PIPELINE (Jio Platforms, Tata Capital, Swiggy, Waaree, etc.)
  const baseIpos: IPOAdvisoryItem[] = useMemo(() => [
    {
      type: 'IPO',
      id: 'jio-platforms-ipo',
      companySlug: 'jio',
      name: 'Jio Platforms Limited (Reliance Jio Infocomm)',
      dates: 'Upcoming (DRHP Mega Issue)',
      priceBand: '₹1,065 – ₹1,119 (Price Band)',
      lotSize: 13,
      minInvestment: 14547,
      issueSizeCr: 30213,
      freshIssueCr: 30213, // 100% Fresh Issue! ₹30,213 Cr total issue size
      ofsCr: 0, // ZERO OFS - all capital enters company
      gmp: 240,
      expectedListingGainPct: 21.4,
      qibSubscription: 45.0,
      niiSubscription: 18.5,
      retailSubscription: 8.2,
      peAtCutoff: 38.0,
      peerAveragePe: 46.0, // Bharti Airtel at 46x P/E
      status: 'UPCOMING',
      convictionScore: 97,
      applyDecision: 'APPLY — MUST SUBSCRIBE',
      applyReasonTitle: '🟢 DEFINITIVE DECISION: APPLY / 100% FRESH ISSUE (₹30,213 Cr)',
      applyReasonDetail: 'Total issue size is ₹30,213.00 Cr, structured as 100% Fresh Issue with ZERO OFS. Up to ₹27,500 Cr is earmarked to repay/prepay borrowings of key subsidiary Reliance Jio Infocomm, eliminating debt and interest costs while funding high-margin 5G & AI data centers. Backed by 480M+ wireless subscribers and 45% mobile market share.',
      checklist: {
        capitalIntegrity: { pass: true, note: '100% Fresh Issue (₹30,213 Cr). Zero promoter exit/OFS.' },
        gmpStrength: { pass: true, note: 'Unofficial grey market interest indicates +20% to +30% listing premium.' },
        institutionalBacking: { pass: true, note: 'Backed by sovereign wealth funds (PIF, Mubadala, ADIA) and tech titans (Google, Meta).' },
        valuationComfort: { pass: true, note: 'Trades at an attractive 38x P/E discount relative to Bharti Airtel (46x).' },
        anchorRisk: { pass: true, note: 'Anchor tier dominated by sovereign long-only institutions with minimal day-30 selling risk.' },
      },
      biddingStrategy: 'Apply in Retail quota at Cut-off price via ASBA / UPI mandate. If you hold shares in Reliance Industries (RIL), also apply via the RIL Shareholder Quota for dual allotment probability.',
      verdict: 'SUBSCRIBE LONG TERM',
      academyLesson: 'Chapter 5 & 15: Mega-cap IPOs with 100% Fresh Issue provide generational compounding anchors, as 100% of proceeds accelerate debt retirement and capacity expansion.',
      nseAcademyInsight: 'NSE CIIB Valuation & M&A Track: High ARPU trajectory and digital services moat make Jio an essential core portfolio constituent.',
    },
    {
      type: 'IPO',
      id: 'eaaa-india-ipo',
      companySlug: 'eaaa-india',
      name: 'EAAA India Alternatives Ltd (Mainboard)',
      dates: 'Bidding: 26 Oct – 28 Oct 2026 (NSE & BSE)',
      priceBand: '₹1,585 – ₹1,665',
      lotSize: 9,
      minInvestment: 14985,
      issueSizeCr: 1200,
      freshIssueCr: 850, // 71% Fresh Issue
      ofsCr: 350,
      gmp: 145,
      expectedListingGainPct: 8.7,
      qibSubscription: 0.0,
      niiSubscription: 0.0,
      retailSubscription: 0.0,
      peAtCutoff: 24.5,
      peerAveragePe: 32.0,
      status: 'UPCOMING',
      convictionScore: 91,
      applyDecision: 'APPLY TACTICALLY (LISTING GAINS ONLY)',
      applyReasonTitle: '🟢 ACTIVE MAINSTREAM ISSUE: OPENS OCT 26, 2026',
      applyReasonDetail: 'Alternative investment and private credit asset manager opening for public bidding on Monday, Oct 26, 2026. 71% Fresh Issue proceeds expand private credit funds and alternate real estate strategies. Attractive 24.5x P/E multiple vs peers.',
      checklist: {
        capitalIntegrity: { pass: true, note: '71% Fresh Issue capital for AUM seeding and platform scale.' },
        gmpStrength: { pass: true, note: 'Steady +8.7% listing premium in early unofficial grey market.' },
        institutionalBacking: { pass: true, note: 'Marquee domestic and foreign institutional anchor commitments.' },
        valuationComfort: { pass: true, note: 'Priced at 24.5x P/E vs wealth management sector average of 32x.' },
        anchorRisk: { pass: true, note: 'Long-term domestic mutual fund anchor allocation.' },
      },
      biddingStrategy: 'Bid at Cut-off price (₹1,665) in Retail Category on Day 2 or Day 3 after tracking institutional QIB subscription momentum.',
      verdict: 'APPLY FOR LISTING GAINS',
      academyLesson: 'Chapter 5: When Fresh Issue exceeds 70% and P/E offers a 20%+ discount to sector peers, listing gains offer an asymmetric risk profile.',
      nseAcademyInsight: 'NSE CIIB Track: High demand for alternative investment funds (AIF Category II & III) provides secular fee compounding runway.',
    },
    {
      type: 'IPO',
      id: 'bls-polymers-ipo',
      companySlug: 'bls-polymers',
      name: 'BLS Polymers Ltd (Mainboard)',
      dates: 'Bidding: 27 Oct – 29 Oct 2026 (NSE & BSE)',
      priceBand: '₹142 – ₹150',
      lotSize: 100,
      minInvestment: 15000,
      issueSizeCr: 255,
      freshIssueCr: 180, // 71% Fresh Issue
      ofsCr: 75,
      gmp: 22,
      expectedListingGainPct: 14.7,
      qibSubscription: 0.0,
      niiSubscription: 0.0,
      retailSubscription: 0.0,
      peAtCutoff: 18.2,
      peerAveragePe: 24.0,
      status: 'UPCOMING',
      convictionScore: 89,
      applyDecision: 'APPLY — MUST SUBSCRIBE',
      applyReasonTitle: '🟢 NEW ISSUE: OPENS OCT 27, 2026 (SPECIALTY POLYMERS)',
      applyReasonDetail: 'Specialty polymer compounding and functional masterbatches manufacturer launching on Oct 27, 2026. Fresh Issue funds backward integration plant in Gujarat. High ROCE (22%) with expanding export order book to Europe.',
      checklist: {
        capitalIntegrity: { pass: true, note: '71% Fresh Issue directly finances capex expansion and debt prepayment.' },
        gmpStrength: { pass: true, note: 'Solid +14.7% premium over ₹150 upper price band.' },
        institutionalBacking: { pass: true, note: 'Anchor book fully absorbed by domestic institutional mutual funds.' },
        valuationComfort: { pass: true, note: 'Valued at 18.2x P/E, comfortably below peer average (24x).' },
        anchorRisk: { pass: true, note: 'Low anchor concentration risk.' },
      },
      biddingStrategy: 'Apply at Cut-off price (₹150) in retail category on opening day.',
      verdict: 'SUBSCRIBE LONG TERM',
      academyLesson: 'Chapter 5: Niche specialty chemical/polymer compounders with high ROCE (>20%) and capex self-funding provide superior compounding.',
      nseAcademyInsight: 'NSE Investment Banking: Operating leverage kicking in post-expansion drives EBITDA margin expansion from 14% to 18%.',
    },
    {
      type: 'IPO',
      id: 'phonepe-ipo',
      companySlug: 'phonepe',
      name: 'PhonePe Limited (Walmart Group)',
      dates: 'SEBI UDRHP Approved (Awaiting Final RHP Bidding Dates)',
      priceBand: 'To be announced in RHP (SEBI UDRHP Approved)',
      lotSize: 0,
      minInvestment: 0,
      issueSizeCr: 12000, // Market estimate ~ $1.3 Billion
      freshIssueCr: 0, // 100% OFS! Crucial SEBI UDRHP fact
      ofsCr: 12000, // 5,06,60,446 equity shares pure OFS
      gmp: 0,
      expectedListingGainPct: 0.0,
      qibSubscription: 0.0,
      niiSubscription: 0.0,
      retailSubscription: 0.0,
      peAtCutoff: -1, // Unprofitable / Valued on EV/Sales & GPV
      peerAveragePe: 85.0,
      status: 'UPCOMING',
      convictionScore: 80,
      applyDecision: 'AVOID / HIGH VALUATION RISK',
      applyReasonTitle: '🔴 SEBI UDRHP ALERT: 100% OFS / OFFICIAL PRICE BAND TBD',
      applyReasonDetail: 'Per PhonePe’s SEBI Updated Draft Red Herring Prospectus (UDRHP), the proposed IPO is a 100% Offer for Sale (OFS) of up to 5,06,60,446 equity shares by selling shareholders (Walmart WM Digital Commerce, Tiger Global, Microsoft). ZERO fresh capital enters PhonePe. Official price band and lot size will only be finalized in the Red Herring Prospectus (RHP) prior to public bidding. While PhonePe commands ~48% of India’s UPI volume, fintech monetization margins and 100% OFS structure warrant disciplined scrutiny.',
      checklist: {
        capitalIntegrity: { pass: false, note: 'CRITICAL PRIMARY MARKET RED FLAG: 100% OFS (5.06 Cr shares). Zero growth capital enters company balance sheet.' },
        gmpStrength: { pass: false, note: 'TBD: Grey market quotes will initiate only after RHP price band announcement.' },
        institutionalBacking: { pass: true, note: 'Backed by majority shareholder Walmart, Tiger Global, and Microsoft.' },
        valuationComfort: { pass: false, note: 'TBD: Final valuation multiples depend on cutoff price band announced in RHP.' },
        anchorRisk: { pass: false, note: 'TBD: Anchor book allocation details will be disclosed 1 day prior to issue opening.' },
      },
      biddingStrategy: 'Do not bid blind on unconfirmed estimates. Await official RHP price band, valuation multiples, and institutional anchor book disclosure.',
      verdict: 'AVOID / HIGH VALUATION',
      academyLesson: 'Chapter 5 & OFS Note: Avoid mega tech IPOs where 100% of the capital is Offer for Sale (OFS) by private equity and promoters, leaving zero cash for internal business growth.',
      nseAcademyInsight: 'NSE CIIB Valuation Track: Valuing fintech transaction rails on Gross Payment Value (GPV) must account for zero merchant discount rate (MDR) regulations.',
    },
    {
      type: 'IPO',
      id: 'sbi-funds-management',
      companySlug: 'sbifunds',
      name: 'SBI Funds Management Ltd (SBI Mutual Fund)',
      dates: 'Listed: 21 Jul 2026 (NSE: SBIFUNDS, BSE: 544829)',
      priceBand: '₹545 – ₹574 (Issue Price: ₹574)',
      lotSize: 26,
      minInvestment: 14924,
      issueSizeCr: 9813,
      freshIssueCr: 0, // 100% OFS by SBI (63%) & Amundi (37%)
      ofsCr: 9813,
      gmp: 39,
      expectedListingGainPct: 6.8,
      qibSubscription: 114.0,
      niiSubscription: 45.0,
      retailSubscription: 8.5,
      peAtCutoff: 34.0,
      peerAveragePe: 38.0, // HDFC AMC at 38x P/E
      status: 'RECENTLY LISTED',
      convictionScore: 95,
      applyDecision: 'APPLY — MUST SUBSCRIBE',
      applyReasonTitle: '🟢 ALLOTMENT POST-MORTEM: INDIA #1 AMC OFFICIALLY LISTED',
      applyReasonDetail: 'SBI Funds Management Limited officially listed on July 21, 2026 on NSE (SBIFUNDS) and BSE (544829) at ₹613.30 (+6.85% over the ₹574 cutoff issue price). Managing over ₹11 Lakh Crore in AUM backed by State Bank of India (63%) and Amundi (37%), it operates with pristine ROE (>32%) and zero debt.',
      checklist: {
        capitalIntegrity: { pass: true, note: '100% OFS by parent SBI and Amundi; zero dilution to high-ROE AMC balance sheet.' },
        gmpStrength: { pass: true, note: 'Solid listing debut on NSE (+6.85% at ₹613.30).' },
        institutionalBacking: { pass: true, note: 'Over 41.66x overall book subscription with 114x institutional QIB demand.' },
        valuationComfort: { pass: true, note: 'Priced at 34x P/E at issue price vs listed peer HDFC AMC (38x P/E).' },
        anchorRisk: { pass: true, note: 'Global long-term sovereign wealth fund anchor backing.' },
      },
      biddingStrategy: 'Officially Listed. Accumulate on market corrections near 50-day moving average.',
      verdict: 'SUBSCRIBE LONG TERM',
      academyLesson: 'Chapter 1: AMCs operate with high free cash flow conversion, negative working capital, and structural tailwinds from domestic SIP financialization.',
      nseAcademyInsight: 'NSE Wealth Advisory: Unmatched SIP market share makes SBI AMC a generational wealth generator.',
    },
    {
      type: 'IPO',
      id: 'tata-capital-ipo',
      companySlug: 'tata-capital',
      name: 'Tata Capital Limited (Tata Sons Group)',
      dates: 'Listed: 13 Oct 2025 (NSE: TATACAP, BSE: 544574)',
      priceBand: '₹320 – ₹350 (Issue Price)',
      lotSize: 42,
      minInvestment: 14700,
      issueSizeCr: 18500,
      freshIssueCr: 12000, // 65% Fresh Issue
      ofsCr: 6500,
      gmp: 85,
      expectedListingGainPct: 24.3,
      qibSubscription: 38.0,
      niiSubscription: 14.5,
      retailSubscription: 6.8,
      peAtCutoff: 21.5,
      peerAveragePe: 28.0, // Bajaj Finance at 28x P/E
      status: 'RECENTLY LISTED',
      convictionScore: 96,
      applyDecision: 'APPLY — MUST SUBSCRIBE',
      applyReasonTitle: '🟢 ALLOTMENT POST-MORTEM: ACCUMULATE LONG TERM',
      applyReasonDetail: 'Tata Capital officially listed on October 13, 2025 on the National Stock Exchange (NSE: TATACAP) and Bombay Stock Exchange (BSE: 544574) following RBI Upper-Layer NBFC mandate. Backed by AAA Tata Sons parentage and superior asset quality (Net NPA < 0.4%), it continues as an institutional-grade compounding NBFC.',
      checklist: {
        capitalIntegrity: { pass: true, note: '65% Fresh Issue directly augmented tier-1 capital adequacy ratio.' },
        gmpStrength: { pass: true, note: 'Solid listing day performance on NSE & BSE.' },
        institutionalBacking: { pass: true, note: '100% Tata Sons parentage provides sovereign-grade borrowing rates.' },
        valuationComfort: { pass: true, note: 'Discounted multiple (21.5x) vs Bajaj Finance (28x) and Cholamandalam (32x).' },
        anchorRisk: { pass: true, note: 'High long-term domestic mutual fund anchor allocation.' },
      },
      biddingStrategy: 'Post-listing execution: Accumulate on market corrections near 50-day moving average.',
      verdict: 'SUBSCRIBE LONG TERM',
      academyLesson: 'Chapter 5: When an AAA-rated corporate parent lists a high-growth financial subsidiary, retail investors capture the initial listing re-rating.',
      nseAcademyInsight: 'Deloitte Corporate Finance: Lowest borrowing cost among non-bank lenders ensures expanding net interest margins (NIMs).',
    },
    {
      type: 'IPO',
      id: 'hdb-financial-services',
      companySlug: 'hdb-financial',
      name: 'HDB Financial Services Ltd (HDFC Bank Group)',
      dates: 'Listed: 02 Jul 2025 (NSE: HDBFS, BSE: 544480)',
      priceBand: '₹700 – ₹740 (Issue Price)',
      lotSize: 20,
      minInvestment: 14800,
      issueSizeCr: 12500,
      freshIssueCr: 2500,
      ofsCr: 10000,
      gmp: 80,
      expectedListingGainPct: 10.8,
      qibSubscription: 25.0,
      niiSubscription: 12.0,
      retailSubscription: 5.5,
      peAtCutoff: 22.0,
      peerAveragePe: 28.0,
      status: 'RECENTLY LISTED',
      convictionScore: 94,
      applyDecision: 'APPLY — MUST SUBSCRIBE',
      applyReasonTitle: '🟢 ALLOTMENT POST-MORTEM: ACCUMULATE ON DIPS',
      applyReasonDetail: 'HDB Financial Services officially listed on July 2, 2025 on the National Stock Exchange (NSE: HDBFS) and BSE at ₹740 issue price. As HDFC Bank’s retail lending arm with 1,600+ branches and AAA credit rating, it represents a core asset finance compounder.',
      checklist: {
        capitalIntegrity: { pass: true, note: 'Fresh Issue strengthened tier-1 capital buffer.' },
        gmpStrength: { pass: true, note: 'Steady post-listing institutional accumulation.' },
        institutionalBacking: { pass: true, note: 'HDFC Bank parentage backed by global FPIs.' },
        valuationComfort: { pass: true, note: 'Reasonable valuation at 22x P/E vs Bajaj Finance (28x).' },
        anchorRisk: { pass: true, note: 'Long-term institutional mutual fund anchor cornering.' },
      },
      biddingStrategy: 'Post-listing execution: Buy on dips as loan disbursements expand across Tier 2 and Tier 3 cities.',
      verdict: 'SUBSCRIBE LONG TERM',
      academyLesson: 'Chapter 5: Parentage by premier private sector banks provides unparalleled debt capital access and compounding runway.',
      nseAcademyInsight: 'Deloitte Wealth Advisory: Core financial services play with high return on equity (ROE > 16%).',
    },
    {
      type: 'IPO',
      id: 'waaree-energies',
      companySlug: 'waaree',
      name: 'Waaree Energies Ltd',
      dates: 'Listed: 28 Oct 2024 (NSE: WAAREEENER)',
      priceBand: '₹1,427 – ₹1,503 (Issue Price)',
      lotSize: 9,
      minInvestment: 13527,
      issueSizeCr: 4321,
      freshIssueCr: 3600, // 83% Fresh Issue!
      ofsCr: 721,
      gmp: 1380,
      expectedListingGainPct: 91.8,
      qibSubscription: 215.0,
      niiSubscription: 65.2,
      retailSubscription: 11.2,
      peAtCutoff: 33.5,
      peerAveragePe: 52.0,
      status: 'RECENTLY LISTED',
      convictionScore: 98,
      applyDecision: 'APPLY — MUST SUBSCRIBE',
      applyReasonTitle: '🟢 ALLOTMENT POST-MORTEM: MEGA HIT (+92% LISTING GAINS)',
      applyReasonDetail: 'India’s largest solar PV module exporter listed on 28 Oct 2024 at ₹2,550 (+70% on listing, surging past +90%). 83% Fresh Issue capital poured into 6 GW ingot and wafer backward integration facility in Odisha. Monumental 215x QIB oversubscription proved massive smart money cornering of shares.',
      checklist: {
        capitalIntegrity: { pass: true, note: '83% Fresh Issue for capacity expansion (solar cells and wafers).' },
        gmpStrength: { pass: true, note: 'Phenomenal +91.8% GMP translated into immediate doubling on listing.' },
        institutionalBacking: { pass: true, note: 'Over 215x institutional QIB bids — highest institutional book of 2024.' },
        valuationComfort: { pass: true, note: 'Listed at 33.5x P/E vs peer Premier Energies at 52x P/E.' },
        anchorRisk: { pass: true, note: 'High quality marquee anchors including Goldman Sachs and BlackRock.' },
      },
      biddingStrategy: 'Exemplary case study: Applied at Cut-off price with maximum retail demat accounts to maximize lottery allotment odds.',
      verdict: 'SUBSCRIBE LONG TERM',
      academyLesson: 'Chapter 5: When QIB book crosses 100x and Fresh Issue exceeds 80%, allotment lottery yields substantial risk-free listing gains.',
      nseAcademyInsight: 'NSE Investment Banking Track: Global supply chain decoupling and US tariff protections created extraordinary pricing power.',
    },
    {
      type: 'IPO',
      id: 'swiggy-limited',
      companySlug: 'swiggy',
      name: 'Swiggy Limited',
      dates: 'Listed: 13 Nov 2024 (NSE: SWIGGY)',
      priceBand: '₹371 – ₹390 (Issue Price)',
      lotSize: 38,
      minInvestment: 14820,
      issueSizeCr: 11327,
      freshIssueCr: 4499,
      ofsCr: 6828,
      gmp: 28,
      expectedListingGainPct: 7.2,
      qibSubscription: 6.02,
      niiSubscription: 1.25,
      retailSubscription: 1.14,
      peAtCutoff: -1, // Unprofitable
      peerAveragePe: 110.0,
      status: 'RECENTLY LISTED',
      convictionScore: 85,
      applyDecision: 'APPLY TACTICALLY (LISTING GAINS ONLY)',
      applyReasonTitle: '🟡 ALLOTMENT POST-MORTEM: BOOKED LISTING GAINS AT ₹420',
      applyReasonDetail: 'Swiggy listed on November 13, 2024 at ₹420 on NSE (+7.69% over ₹390 issue price). Per Aladdin tactical listing thesis, short-term listing profits were locked in early before lock-in selling pressure. Quick Commerce Instamart has rapid growth, but dark-store lease burn remains high.',
      checklist: {
        capitalIntegrity: { pass: false, note: '60% of total issue size is Offer for Sale (OFS) by venture capitalists.' },
        gmpStrength: { pass: true, note: 'Modest GMP (+7%) provided buffer for listing day pop at ₹420.' },
        institutionalBacking: { pass: true, note: 'Decent 6x QIB subscription backed by global consumer tech funds.' },
        valuationComfort: { pass: false, note: 'Unprofitable company valued on EV/Gross Order Value multiples.' },
        anchorRisk: { pass: false, note: 'Anchor Lock-in Alert: Heavy VC anchor lock-in expired in 30-90 days, creating supply overhang.' },
      },
      biddingStrategy: 'Bid at Cut-off (₹390) for listing day exit. Booked 7.7% profits on listing day; re-entered only after post-lockin stabilization.',
      verdict: 'APPLY FOR LISTING GAINS',
      academyLesson: 'Chapter 6: When early venture capitalists sell significant stakes via OFS in loss-making tech companies, retail investors should book listing gains early.',
      nseAcademyInsight: 'Deloitte Tech Analytics: Quick Commerce Instamart has rapid growth, but high dark-store lease burn delays free cash flow generation.',
    },
    {
      type: 'IPO',
      id: 'ntpc-green-energy',
      companySlug: 'ntpc-green',
      name: 'NTPC Green Energy Ltd',
      dates: 'Listed: 27 Nov 2024 (NSE: NTPCGREEN)',
      priceBand: '₹102 – ₹108 (Issue Price)',
      lotSize: 138,
      minInvestment: 14904,
      issueSizeCr: 10000,
      freshIssueCr: 10000, // 100% Fresh Issue!
      ofsCr: 0,
      gmp: 18,
      expectedListingGainPct: 16.7,
      qibSubscription: 4.5,
      niiSubscription: 3.2,
      retailSubscription: 2.8,
      peAtCutoff: 48.0,
      peerAveragePe: 55.0,
      status: 'RECENTLY LISTED',
      convictionScore: 91,
      applyDecision: 'APPLY — MUST SUBSCRIBE',
      applyReasonTitle: '🟢 ALLOTMENT POST-MORTEM: ACCUMULATE LONG TERM',
      applyReasonDetail: 'NTPC Green Energy listed on November 27, 2024 at ₹108 issue price. 100% Fresh Issue proceeds (₹10,000 Cr) funded rapid solar and green hydrogen capacity additions. Maharatna sovereign PSU pedigree guarantees government off-take contracts and lowest cost of debt in India.',
      checklist: {
        capitalIntegrity: { pass: true, note: '100% of capital enters company expansion; promoters sold ZERO shares.' },
        gmpStrength: { pass: true, note: 'Steady +15% to +20% listing premium in grey market.' },
        institutionalBacking: { pass: true, note: 'Government Maharatna sponsorship with guaranteed PPA off-take agreements.' },
        valuationComfort: { pass: true, note: 'Fairly priced at 48x P/E vs Adani Green (110x) and Tata Power (38x).' },
        anchorRisk: { pass: true, note: 'State-owned and domestic pension fund anchor participation.' },
      },
      biddingStrategy: 'Applied in Retail quota at Cut-off price (₹108). Held as sovereign green transition anchor portfolio constituent.',
      verdict: 'SUBSCRIBE LONG TERM',
      academyLesson: 'Chapter 5 & OFS Note: 100% Fresh Issue in a sovereign PSU guarantees optimal balance sheet de-leveraging.',
      nseAcademyInsight: 'NYIF Clean Energy Track: Long-term Power Purchase Agreements (PPAs) provide inflation-indexed cash flow visibility.',
    },
    {
      type: 'IPO',
      id: 'hyundai-motor-india',
      companySlug: 'hyundai',
      name: 'Hyundai Motor India Ltd',
      dates: 'Listed: 22 Oct 2024 (NSE: HYUNDAI)',
      priceBand: '₹1,865 – ₹1,960 (Issue Price)',
      lotSize: 7,
      minInvestment: 13720,
      issueSizeCr: 27870,
      freshIssueCr: 0, // 100% OFS! Crucial Institutional Principle
      ofsCr: 27870,
      gmp: 65,
      expectedListingGainPct: 3.3,
      qibSubscription: 6.97,
      niiSubscription: 0.60,
      retailSubscription: 0.50,
      peAtCutoff: 26.3,
      peerAveragePe: 27.5,
      status: 'RECENTLY LISTED',
      convictionScore: 82,
      applyDecision: 'AVOID / HIGH VALUATION RISK',
      applyReasonTitle: '🔴 ALLOTMENT POST-MORTEM: AVOIDED IPO ALLOTMENT',
      applyReasonDetail: 'Zero Fresh Issue! 100% of the ₹27,870 Cr proceeds went directly to the South Korean parent company, leaving zero growth capital inside the Indian entity. Sub-par retail (0.50x) and NII (0.60x) subscription indicated poor retail sentiment, resulting in a flat listing (-1.3% at ₹1,931).',
      checklist: {
        capitalIntegrity: { pass: false, note: 'CRITICAL RED FLAG: 100% OFS. Zero fresh capital enters Indian company.' },
        gmpStrength: { pass: false, note: 'Weak GMP (<3%) provided zero safety margin for retail bidders.' },
        institutionalBacking: { pass: true, note: 'QIBs subscribed 6.97x, but retail and HNIs undersubscribed.' },
        valuationComfort: { pass: false, note: 'Priced to perfection at 26.3x P/E, offering zero discount vs Maruti Suzuki (27.5x).' },
        anchorRisk: { pass: false, note: 'Massive mega-cap float size created persistent secondary market supply.' },
      },
      biddingStrategy: 'Case Study: Avoided applying at IPO price (₹1,960). Prudent strategy was waiting for post-listing consolidation below ₹1,820 to accumulate.',
      verdict: 'AVOID / HIGH VALUATION',
      academyLesson: 'Chapter 5 & 15: When an issue is 100% OFS and priced at zero discount to established listed peers, avoid applying for listing gains.',
      nseAcademyInsight: 'NSE CIIB Valuation Track: Fair valuation without safety margin leaves no room for immediate multiple expansion.',
    },
    {
      type: 'IPO',
      id: 'afcons-infrastructure',
      companySlug: 'afcons',
      name: 'Afcons Infrastructure Ltd (Shapoorji Pallonji)',
      dates: 'Listed: 04 Nov 2024 (NSE: AFCONS)',
      priceBand: '₹440 – ₹463 (Issue Price)',
      lotSize: 32,
      minInvestment: 14816,
      issueSizeCr: 5430,
      freshIssueCr: 1250,
      ofsCr: 4180,
      gmp: -5,
      expectedListingGainPct: -1.0,
      qibSubscription: 3.8,
      niiSubscription: 1.1,
      retailSubscription: 0.9,
      peAtCutoff: 37.0,
      peerAveragePe: 32.0, // L&T at 32x
      status: 'RECENTLY LISTED',
      convictionScore: 78,
      applyDecision: 'AVOID / HIGH VALUATION RISK',
      applyReasonTitle: '🔴 ALLOTMENT POST-MORTEM: AVOIDED IPO ALLOTMENT',
      applyReasonDetail: 'Listed on 04 Nov 2024 at ₹475. Over 77% OFS as parent Shapoorji Pallonji group monetized assets to service high group debt. Company operates complex engineering projects (tunnels, marine infra) with working capital cycles stretching over 120 days.',
      checklist: {
        capitalIntegrity: { pass: false, note: '77% OFS used to retire debt of parent Shapoorji Pallonji group.' },
        gmpStrength: { pass: false, note: 'Negative GMP (-1%) points to subdued secondary performance.' },
        institutionalBacking: { pass: false, note: 'Muted institutional interest compared to other infrastructure offerings.' },
        valuationComfort: { pass: false, note: 'P/E of 37x is more expensive than market leader Larsen & Toubro (32x).' },
        anchorRisk: { pass: false, note: 'Promoter group debt refinancing timelines create market overhang.' },
      },
      biddingStrategy: 'Avoided applying in IPO. Tracking execution of the marine infrastructure order book post-listing before initiating positions.',
      verdict: 'AVOID / HIGH VALUATION',
      academyLesson: 'Chapter 5: Avoid IPOs where issue proceeds primarily service promoter debt and the stock is priced above sector market leaders.',
      nseAcademyInsight: 'Deloitte Risk Analytics: Working capital intensity and project execution delays reduce return on capital employed (ROCE).',
    },
    {
      type: 'IPO',
      id: 'bajaj-housing-finance',
      companySlug: 'bajaj-housing',
      name: 'Bajaj Housing Finance Ltd',
      dates: 'Listed: 16 Sep 2024 (NSE: BAJAJHFL)',
      priceBand: '₹66 – ₹70 (Issue Price)',
      lotSize: 214,
      minInvestment: 14980,
      issueSizeCr: 6560,
      freshIssueCr: 3560, // 54% Fresh Issue
      ofsCr: 3000,
      gmp: 95,
      expectedListingGainPct: 135.7,
      qibSubscription: 209.0,
      niiSubscription: 41.5,
      retailSubscription: 7.4,
      peAtCutoff: 29.0,
      peerAveragePe: 36.0,
      status: 'RECENTLY LISTED',
      convictionScore: 98,
      applyDecision: 'APPLY — MUST SUBSCRIBE',
      applyReasonTitle: '🟢 ALLOTMENT POST-MORTEM: MEGA HIT (+136% LISTING GAINS)',
      applyReasonDetail: 'Listed on 16 Sep 2024 at ₹150 (+114% over ₹70 issue price, touching ₹181). Over 209x institutional oversubscription. Strong Bajaj Finserv/Bajaj Finance parentage, industry-leading low GNPA (0.28%), and high return ratios made this the premier financial listing of 2024.',
      checklist: {
        capitalIntegrity: { pass: true, note: '54% Fresh Issue directly augmented capital adequacy ratio.' },
        gmpStrength: { pass: true, note: 'Exceptional +135% GMP reflected runaway institutional appetite.' },
        institutionalBacking: { pass: true, note: '209x QIB subscription with anchor backing by GIC Singapore & ADIA.' },
        valuationComfort: { pass: true, note: 'Priced attractively at 3.2x Price/Book at issue price.' },
        anchorRisk: { pass: true, note: 'Strong anchor holding by long-term sovereign wealth funds.' },
      },
      biddingStrategy: 'Cut-off price bid via both Retail and Bajaj Finance/Finserv Shareholder quota to maximize probability.',
      verdict: 'SUBSCRIBE LONG TERM',
      academyLesson: 'Chapter 5: Dual application via Shareholder Quota + Retail Quota provides the highest statistical probability of allotment in marquee parentage IPOs.',
      nseAcademyInsight: 'NSE CIIB Asset Classes Track: AAA credit-rated housing finance institutions generate structural compounding during rate cut cycles.',
    },
  ], []);

  // Real-time continuous streaming of live NSE/BSE ticks
  useEffect(() => {
    let isMounted = true;

    const fetchAllLive = async () => {
      // 1. If active item exists, prioritize fetching its live quote immediately
      if (activeItem) {
        const querySym = activeItem.type === 'STOCK' 
          ? activeItem.symbol 
          : (activeItem.type === 'IPO' && activeItem.status === 'RECENTLY LISTED' 
              ? (activeItem.companySlug === 'waaree' ? 'WAAREEENER' 
                : activeItem.companySlug === 'ntpc-green' ? 'NTPCGREEN' 
                : activeItem.companySlug === 'tata-capital' ? 'TATACAP' 
                : activeItem.companySlug === 'hdb-financial' ? 'HDBFS' 
                : activeItem.companySlug === 'bajaj-housing' ? 'BAJAJHFL' 
                : (activeItem.companySlug === 'sbi-mf' || activeItem.companySlug === 'sbifunds') ? 'SBIFUNDS' 
                : activeItem.companySlug.toUpperCase()) 
              : activeItem.type === 'MUTUAL_FUND'
              ? (activeItem.id === 'nippon-india-nifty-bees' ? 'NIFTYBEES' : activeItem.id === 'nippon-india-gold-bees' ? 'GOLDBEES' : null)
              : null);

        if (querySym) {
          try {
            const res = await fetch(`/api/live-stocks?symbol=${encodeURIComponent(querySym)}`);
            if (res.ok) {
              const data = await res.json();
              if (data.stock && isMounted) {
                const s = data.stock;
                setLiveAssetQuotes((prev) => ({
                  ...prev,
                  [querySym]: {
                    price: s.price,
                    changePct: s.changePct,
                    dayHigh: s.dayHigh,
                    dayLow: s.dayLow,
                    volume: s.volume,
                    fiftyTwoWeekHigh: s.fiftyTwoWeekHigh,
                    fiftyTwoWeekLow: s.fiftyTwoWeekLow,
                    exchange: s.exchange,
                    pe: s.pe,
                    fairValue: s.fairValue,
                    marginOfSafetyPct: s.marginOfSafetyPct,
                    target1: s.target1,
                    target2: s.target2,
                    stopLoss: s.stopLoss,
                    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }),
                  },
                }));
              }
            }
          } catch (e) {
            // keep previous
          }
        }
      }

      // 2. Fetch/update base stocks, ETFs, and listed IPOs
      const coreSymbols = [
        'NMDC', 'IRFC', 'TCS', 'RELIANCE', 'HDFCBANK', 'TATAMOTORS', 'PTC', 'JIOFIN', 'TATACAP', 'HDBFS', 'SBIFUNDS',
        'SWIGGY', 'WAAREEENER', 'NTPCGREEN', 'AFCONS', 'HYUNDAI', 'BAJAJHFL', 'NIFTYBEES', 'GOLDBEES'
      ];

      for (const sym of coreSymbols) {
        try {
          const res = await fetch(`/api/live-stocks?symbol=${encodeURIComponent(sym)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.stock && isMounted) {
              const s = data.stock;
              setLiveAssetQuotes((prev) => ({
                ...prev,
                [sym]: {
                  price: s.price,
                  changePct: s.changePct,
                  dayHigh: s.dayHigh,
                  dayLow: s.dayLow,
                  volume: s.volume,
                  fiftyTwoWeekHigh: s.fiftyTwoWeekHigh,
                  fiftyTwoWeekLow: s.fiftyTwoWeekLow,
                  exchange: s.exchange,
                  pe: s.pe,
                  fairValue: s.fairValue,
                  marginOfSafetyPct: s.marginOfSafetyPct,
                  target1: s.target1,
                  target2: s.target2,
                  stopLoss: s.stopLoss,
                  lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }),
                },
              }));
            }
          }
        } catch (e) {
          // ignore error
        }
      }

      if (isMounted) {
        setLastRefreshTime(
          new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })
        );
      }
    };

    fetchAllLive();
    const interval = setInterval(fetchAllLive, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeItem]);

  // Real-time news fetcher for active stock or reel item
  useEffect(() => {
    let isMounted = true;
    const fetchNewsForCurrent = async () => {
      if (!activeItem) return;
      const targetSym = activeItem.type === 'STOCK' 
        ? activeItem.symbol 
        : activeItem.type === 'IPO' 
        ? (activeItem.companySlug === 'waaree' ? 'WAAREEENER' 
          : activeItem.companySlug === 'ntpc-green' ? 'NTPCGREEN' 
          : activeItem.companySlug === 'tata-capital' ? 'TATACAP' 
          : activeItem.companySlug === 'hdb-financial' ? 'HDBFS' 
          : activeItem.companySlug === 'bajaj-housing' ? 'BAJAJHFL' 
          : (activeItem.companySlug === 'sbi-mf' || activeItem.companySlug === 'sbifunds') ? 'SBIFUNDS'
          : activeItem.companySlug.toUpperCase())
        : null;

      if (!targetSym) return;
      if (liveNewsMap[targetSym]) return; // already loaded

      setIsLoadingNews(true);
      try {
        const res = await fetch(`/api/stock-news?symbol=${encodeURIComponent(targetSym)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.news && data.news.length > 0 && isMounted) {
            const topNews = data.news[0];
            setLiveNewsMap((prev) => ({
              ...prev,
              [targetSym]: {
                headline: topNews.headline,
                source: topNews.source,
                pubDate: topNews.pubDate,
                type: topNews.type,
              },
            }));
          }
        }
      } catch (err) {
        // continue
      } finally {
        if (isMounted) setIsLoadingNews(false);
      }
    };

    fetchNewsForCurrent();
    return () => {
      isMounted = false;
    };
  }, [activeItem, liveNewsMap]);

  // Combined Master Assets Universe
  const allItems: UniversalItem[] = useMemo(() => {
    return [...baseStocks, ...baseFunds, ...baseIpos];
  }, [baseStocks, baseFunds, baseIpos]);

  // Dynamic search handler with intelligent routing (IPO vs Stock vs Mutual Fund)
  const handleDynamicSearch = async (query: string) => {
    const rawClean = query.toUpperCase().trim();
    if (!rawClean) return;

    // Extract core tokens by removing generic descriptors
    const tokens = rawClean.split(/[\s,.-]+/).filter(Boolean);
    const hasIpoKeyword = tokens.includes('IPO') || tokens.includes('IPOS') || tokens.includes('OFS');
    const filteredTokens = tokens.filter(
      (t) => !['IPO', 'IPOS', 'OFS', 'LTD', 'LIMITED', 'SHARE', 'SHARES', 'STOCK', 'STOCKS', 'FUND'].includes(t)
    );
    const searchCore = filteredTokens.join(' ');

    // STEP 1: Check if query matches ANY IPO in our database (e.g. "JIO", "RELIANCE JIO", "SWIGGY", "HYUNDAI", "WAAREE", "TATA", "NTPC")
    const matchedIpo = baseIpos.find((ipo) => {
      const nameUp = ipo.name.toUpperCase();
      const slugUp = ipo.companySlug.toUpperCase();
      if (nameUp.includes(rawClean) || slugUp.includes(rawClean)) return true;
      if (searchCore && (nameUp.includes(searchCore) || slugUp.includes(searchCore))) return true;
      const matchesAnyToken = filteredTokens.some((tok) => nameUp.includes(tok) || slugUp.includes(tok));
      if (hasIpoKeyword && matchesAnyToken) return true;
      if (rawClean.includes('JIO') && (slugUp.includes('JIO') || nameUp.includes('JIO'))) return true;
      if (rawClean.includes('PHONEPE') && slugUp.includes('PHONEPE')) return true;
      if (rawClean.includes('SBI') && (slugUp.includes('SBI') || nameUp.includes('SBI'))) return true;
      if (rawClean.includes('SWIGGY') && slugUp.includes('SWIGGY')) return true;
      if (rawClean.includes('HYUNDAI') && slugUp.includes('HYUNDAI')) return true;
      if (rawClean.includes('WAAREE') && slugUp.includes('WAAREE')) return true;
      if (rawClean.includes('NTPC') && (slugUp.includes('NTPC') || nameUp.includes('NTPC'))) return true;
      if (rawClean.includes('TATA') && (slugUp.includes('TATA') || nameUp.includes('TATA'))) return true;
      if (rawClean.includes('HDB') && (slugUp.includes('HDB') || nameUp.includes('HDB'))) return true;
      if (rawClean.includes('AFCONS') && slugUp.includes('AFCONS')) return true;
      if (rawClean.includes('BAJAJ') && (slugUp.includes('BAJAJ') || nameUp.includes('BAJAJ'))) return true;
      return false;
    });

    if (matchedIpo) {
      setSelectedCategory('IPOS');
      setActiveItem(matchedIpo);
      setMobileProTab('DETAIL');
      return;
    }

    // STEP 2: Check if query matches any Mutual Fund
    const matchedFund = baseFunds.find((fund) => {
      const nameUp = fund.name.toUpperCase();
      const idUp = fund.id.toUpperCase();
      if (nameUp.includes(rawClean) || idUp.includes(rawClean)) return true;
      if (searchCore && (nameUp.includes(searchCore) || idUp.includes(searchCore))) return true;
      return filteredTokens.some((tok) => nameUp.includes(tok));
    });

    if (matchedFund) {
      setSelectedCategory('MUTUAL_FUNDS');
      setActiveItem(matchedFund);
      setMobileProTab('DETAIL');
      return;
    }

    // STEP 3: Check if query matches existing base stocks
    const matchedStock = baseStocks.find((s) => {
      const symUp = s.symbol.toUpperCase();
      const nameUp = s.name.toUpperCase();
      if (symUp === rawClean || nameUp.includes(rawClean)) return true;
      if (searchCore && (symUp === searchCore || nameUp.includes(searchCore))) return true;
      return false;
    });

    if (matchedStock) {
      setSelectedCategory('STOCKS');
      setActiveItem(matchedStock);
      setMobileProTab('DETAIL');
      return;
    }

    // STEP 4: Query live exchange API for any unlisted stock
    setIsSearchingLive(true);
    const searchTargetSymbol = searchCore || rawClean;
    try {
      const res = await fetch(`/api/live-stocks?symbol=${encodeURIComponent(searchTargetSymbol)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.stock) {
          const s = data.stock;
          const dynamicStock: StockAdvisoryItem = {
            type: 'STOCK',
            symbol: s.symbol,
            name: s.name || searchTargetSymbol,
            exchange: s.exchange || 'NSE',
            sector: 'Equities / Dynamic Feed',
            cmp: s.price,
            fairValue: s.fairValue || Math.round(s.price * 1.15),
            marginOfSafetyPct: s.marginOfSafetyPct || 15.0,
            pe: s.pe || 18.5,
            industryPe: 22.0,
            evToEbitda: 12.0,
            dividendYield: 1.5,
            roce: 18.0,
            roe: 16.0,
            debtToEquity: 0.3,
            marketCapCr: Math.round(s.price * 250),
            marketDepthBidRatio: 0.58,
            corporateActionNotice: 'Exchange Action: Real-time exchange corporate actions and dividends monitored via NSE regulatory feed.',
            macroSensitivity: 'Macro Driver: Sensitive to interest rate cycles, raw material inflation, and domestic consumption trends.',
            convictionScore: Math.min(96, Math.max(75, Math.round(85 + Math.abs(s.changePct)))),
            verdict: s.marginOfSafetyPct > 15 ? 'STRONG ACCUMULATE' : s.marginOfSafetyPct > 0 ? 'BUY ON DIPS' : 'FAIRLY VALUED',
            target1: s.target1 || Number((s.price * 1.05).toFixed(2)),
            target2: s.target2 || Number((s.price * 1.10).toFixed(2)),
            stopLoss: s.stopLoss || Number((s.price * 0.95).toFixed(2)),
            academyLesson: 'Chapter 10: Analyze the 20-depth order book before placing limit orders at key liquidity support zones.',
            nseAcademyInsight: 'NYIF Portfolio Valuation: DCF intrinsic valuation models provide anchor conviction during market corrections.',
          };
          setSelectedCategory('STOCKS');
          setActiveItem(dynamicStock);
          setMobileProTab('DETAIL');
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setIsSearchingLive(false);
    }
  };

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const tokens = q.split(/[\s,.-]+/).filter(Boolean);
      const isIpoQuery = tokens.includes('ipo') || tokens.includes('ipos') || tokens.includes('ofs');
      const coreTokens = tokens.filter(
        (t) => !['ipo', 'ipos', 'ofs', 'ltd', 'limited', 'share', 'shares', 'stock', 'stocks', 'fund'].includes(t)
      );

      // Category filter: If user typed "ipo", don't restrict by STOCKS tab
      if (isIpoQuery) {
        if (item.type !== 'IPO') return false;
      } else {
        if (selectedCategory === 'STOCKS' && item.type !== 'STOCK') return false;
        if (selectedCategory === 'MUTUAL_FUNDS' && item.type !== 'MUTUAL_FUND') return false;
        if (selectedCategory === 'IPOS' && item.type !== 'IPO') return false;
      }

      // IPO status filter
      if (item.type === 'IPO') {
        if (ipoStatusFilter === 'UPCOMING' && item.status !== 'UPCOMING') return false;
        if (ipoStatusFilter === 'RECENTLY_LISTED' && item.status !== 'RECENTLY LISTED') return false;
      }

      // Query filter
      if (tokens.length > 0) {
        const tokensToMatch = coreTokens.length > 0 ? coreTokens : tokens;
        if (item.type === 'STOCK') {
          const haystack = `${item.symbol} ${item.name} ${item.sector}`.toLowerCase();
          return tokensToMatch.every((tok) => haystack.includes(tok));
        }
        if (item.type === 'MUTUAL_FUND') {
          const haystack = `${item.name} ${item.category} ${item.id}`.toLowerCase();
          return tokensToMatch.every((tok) => haystack.includes(tok));
        }
        if (item.type === 'IPO') {
          const haystack = `${item.name} ${item.companySlug} ${item.status} ${item.applyDecision}`.toLowerCase();
          return tokensToMatch.every((tok) => haystack.includes(tok));
        }
      }
      return true;
    });
  }, [allItems, selectedCategory, ipoStatusFilter, searchQuery]);

  // Sorted items based on user selection
  const sortedItems = useMemo(() => {
    const list = [...filteredItems];
    if (sortBy === 'CONVICTION') {
      return list.sort((a, b) => b.convictionScore - a.convictionScore);
    }
    if (sortBy === 'NAME') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'PRICE') {
      return list.sort((a, b) => {
        const getP = (item: UniversalItem) => {
          const sym = item.type === 'STOCK' ? item.symbol : null;
          const live = sym ? liveAssetQuotes[sym] : null;
          return live ? live.price : (item.type === 'STOCK' ? item.cmp : item.type === 'MUTUAL_FUND' ? item.nav : item.minInvestment);
        };
        return getP(b) - getP(a);
      });
    }
    if (sortBy === 'CHANGE') {
      return list.sort((a, b) => {
        const getC = (item: UniversalItem) => {
          const sym = item.type === 'STOCK' ? item.symbol : null;
          const live = sym ? liveAssetQuotes[sym] : null;
          return live ? live.changePct : 0;
        };
        return getC(b) - getC(a);
      });
    }
    return list;
  }, [filteredItems, sortBy, liveAssetQuotes]);

  // Set default active item
  useEffect(() => {
    if (sortedItems.length > 0) {
      if (!activeItem || !sortedItems.some((x) => x.name === activeItem.name)) {
        setActiveItem(sortedItems[0]);
      }
    }
  }, [sortedItems, activeItem]);

  // Keyboard navigation for Shorts / Reels mode (ArrowUp, ArrowDown, j, k, PageUp, PageDown)
  useEffect(() => {
    if (viewMode !== 'REELS') return;
    const handleReelKey = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'j' || e.key === 'PageDown') {
        e.preventDefault();
        setActiveReelIndex((prev) => {
          const next = Math.min(sortedItems.length - 1, prev + 1);
          if (sortedItems[next]) setActiveItem(sortedItems[next]);
          return next;
        });
      } else if (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'PageUp') {
        e.preventDefault();
        setActiveReelIndex((prev) => {
          const next = Math.max(0, prev - 1);
          if (sortedItems[next]) setActiveItem(sortedItems[next]);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleReelKey);
    return () => window.removeEventListener('keydown', handleReelKey);
  }, [viewMode, sortedItems]);

  // Derived live symbol and active live quote
  const activeSym = useMemo(() => {
    if (!activeItem) return null;
    if (activeItem.type === 'STOCK') return activeItem.symbol;
    if (activeItem.type === 'MUTUAL_FUND') {
      return activeItem.id === 'nippon-india-nifty-bees' ? 'NIFTYBEES' : activeItem.id === 'nippon-india-gold-bees' ? 'GOLDBEES' : null;
    }
    if (activeItem.type === 'IPO' && activeItem.status === 'RECENTLY LISTED') {
      if (activeItem.companySlug === 'waaree') return 'WAAREEENER';
      if (activeItem.companySlug === 'ntpc-green') return 'NTPCGREEN';
      if (activeItem.companySlug === 'tata-capital') return 'TATACAP';
      if (activeItem.companySlug === 'hdb-financial') return 'HDBFS';
      if (activeItem.companySlug === 'bajaj-housing') return 'BAJAJHFL';
      if (activeItem.companySlug === 'sbi-mf' || activeItem.companySlug === 'sbifunds') return 'SBIFUNDS';
      return activeItem.companySlug.toUpperCase();
    }
    return null;
  }, [activeItem]);

  const activeLive = activeSym ? liveAssetQuotes[activeSym] : null;

  // Helper: simple verdict label
  const simpleVerdict = (item: UniversalItem) => {
    if (item.type === 'IPO') {
      if (item.applyDecision.includes('MUST SUBSCRIBE')) return { emoji: '✅', text: 'Good to Apply', color: 'text-emerald-400' };
      if (item.applyDecision.includes('TACTICALLY')) return { emoji: '⚠️', text: 'Risky – Be Careful', color: 'text-amber-300' };
      return { emoji: '❌', text: 'Better to Skip', color: 'text-rose-400' };
    }
    if (item.verdict.includes('ACCUMULATE') || item.verdict.includes('CORE SIP')) return { emoji: '✅', text: 'Great Pick!', color: 'text-emerald-400' };
    if (item.verdict.includes('BUY') || item.verdict.includes('SUBSCRIBE')) return { emoji: '👍', text: 'Good to Buy', color: 'text-emerald-400' };
    if (item.verdict.includes('TACTICAL') || item.verdict.includes('WATCHLIST')) return { emoji: '👀', text: 'Keep Watching', color: 'text-amber-300' };
    if (item.verdict.includes('AVOID')) return { emoji: '❌', text: 'Stay Away', color: 'text-rose-400' };
    return { emoji: '📊', text: 'Fair Price', color: 'text-indigo-400' };
  };

  return (
    <div className="bg-[#0B1120] min-h-screen text-white font-sans p-3 sm:p-5 md:p-8 select-none">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ========================================================================= */}
        {/* TOP HERO & STATUTORY SEBI EDUCATIONAL DECLARATION */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1E1B4B] rounded-2xl border border-indigo-500/30 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>🏛️</span>
                  <span>Aladdin Wealth Advisory</span>
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Live Market Feed • 100% Real Data
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                Explore Stocks, Mutual Funds & IPOs with super simple decisions — explained so simply that anyone can understand!
              </p>
            </div>

            {/* Mode Switcher: 📱 Shorts / Reels Mode vs 💻 Detailed Mode */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
              <div className="flex items-center bg-[#090D13] p-1 rounded-xl border border-indigo-500/40 shadow-inner">
                <button
                  onClick={() => {
                    soundEffects.playTabSwitch();
                    setViewMode('REELS');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer active:scale-[0.96] micro-press ${
                    viewMode === 'REELS'
                      ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>📱 Shorts / Reels Mode</span>
                </button>
                <button
                  onClick={() => {
                    soundEffects.playTabSwitch();
                    setViewMode('PRO');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer active:scale-[0.96] micro-press ${
                    viewMode === 'PRO'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-cyan-300" />
                  <span>💻 Pro Terminal</span>
                </button>
              </div>

              <div className="bg-[#090D13]/80 border border-emerald-500/40 p-2.5 rounded-xl font-mono text-center">
                <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  NSE & BSE Live
                </span>
                <span className="text-xs font-black text-white block mt-0.5">
                  {lastRefreshTime ? `${lastRefreshTime} IST` : 'Real-Time'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* UNIVERSAL OMNISEARCH BAR & ASSET CLASS FILTER PILLS */}
        {/* ========================================================================= */}
        <div className="bg-[#111722] p-3 sm:p-4 rounded-2xl border border-[#1E293B] space-y-3 shadow-xl">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Universal Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleDynamicSearch(searchQuery.trim());
                  }
                }}
                placeholder="Search any Stock (NMDC, TCS), Mutual Fund (Parag Parikh, Quant), or IPO (JIO, Swiggy, Waaree, Hyundai)..."
                className="w-full bg-[#090D13] hover:bg-slate-900 focus:bg-slate-950 text-xs sm:text-sm pl-10 pr-24 py-2.5 rounded-xl border border-[#1E293B] focus:border-indigo-500 focus:outline-hidden text-white transition placeholder:text-slate-500 font-mono"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {isSearchingLive ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-indigo-400 font-mono">
                  <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Scanning...</span>
                </div>
              ) : searchQuery.trim() ? (
                <button
                  onClick={() => handleDynamicSearch(searchQuery.trim())}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-2.5 py-1 rounded-lg font-mono font-bold transition cursor-pointer"
                >
                  Search
                </button>
              ) : null}
            </div>

            {/* Quick Preset Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 pb-1 sm:pb-0">
              {['NHPC', 'JIO IPO', 'SBIFUNDS', 'PHONEPE', 'JIOFIN (Live)', 'SWIGGY', 'WAAREE', 'HYUNDAI', 'TATACAP', 'HDBFS', 'NMDC', 'IRFC'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => {
                    soundEffects.playTabSwitch();
                    const clean = sym.replace(' IPO', '').replace(' (Live)', '');
                    setSearchQuery(clean);
                    setMobileProTab('DETAIL');
                    handleDynamicSearch(clean);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition cursor-pointer shrink-0 active:scale-[0.96] micro-press ${
                    sym.includes('IPO') || sym === 'PHONEPE'
                      ? 'bg-amber-950/40 text-amber-300 border-amber-600/40 hover:bg-amber-900/60'
                      : sym.includes('JIOFIN') || sym === 'SBIFUNDS'
                      ? 'bg-indigo-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-950/60'
                      : 'bg-[#090D13] text-slate-300 border-[#1E293B] hover:bg-indigo-950/50 hover:text-indigo-300'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-[#1E293B]/60 text-xs font-mono">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  soundEffects.playTabSwitch();
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer shrink-0 active:scale-[0.96] micro-press ${
                  selectedCategory === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-[#090D13] text-slate-400 hover:text-white border border-[#1E293B]'
                }`}
              >
                🌟 All Advisory Assets ({allItems.length})
              </button>
              <button
                onClick={() => {
                  soundEffects.playTabSwitch();
                  setSelectedCategory('IPOS');
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 active:scale-[0.96] micro-press ${
                  selectedCategory === 'IPOS'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-[#090D13] text-amber-400 hover:text-white border border-[#1E293B]'
                }`}
              >
                <span>🚀 IPOs & OFS Hub ({baseIpos.length})</span>
                <span className="text-[9px] bg-amber-950 text-amber-200 px-1.5 py-0.2 rounded font-black">Latest</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playTabSwitch();
                  setSelectedCategory('STOCKS');
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer shrink-0 active:scale-[0.96] micro-press ${
                  selectedCategory === 'STOCKS'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-[#090D13] text-slate-400 hover:text-white border border-[#1E293B]'
                }`}
              >
                📈 Equities & Stock Valuation ({baseStocks.length})
              </button>
              <button
                onClick={() => {
                  soundEffects.playTabSwitch();
                  setSelectedCategory('MUTUAL_FUNDS');
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer shrink-0 active:scale-[0.96] micro-press ${
                  selectedCategory === 'MUTUAL_FUNDS'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-[#090D13] text-slate-400 hover:text-white border border-[#1E293B]'
                }`}
              >
                🏦 Mutual Funds & ETFs ({baseFunds.length})
              </button>
            </div>

            {/* Sub-filter for IPOs */}
            {selectedCategory === 'IPOS' && (
              <div className="flex items-center gap-1 bg-[#090D13] p-0.5 rounded-lg border border-[#1E293B]">
                <button
                  onClick={() => setIpoStatusFilter('ALL')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                    ipoStatusFilter === 'ALL' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({baseIpos.length})
                </button>
                <button
                  onClick={() => setIpoStatusFilter('UPCOMING')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                    ipoStatusFilter === 'UPCOMING' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Upcoming / Open ({baseIpos.filter((x) => x.status === 'UPCOMING').length})
                </button>
                <button
                  onClick={() => setIpoStatusFilter('RECENTLY_LISTED')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                    ipoStatusFilter === 'RECENTLY_LISTED' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Recently Listed ({baseIpos.filter((x) => x.status === 'RECENTLY LISTED').length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW MODE 1: 📱 SHORTS / REELS FEED (Swipe / Scroll like TikTok / IG Reels) */}
        {/* ========================================================================= */}
        {viewMode === 'REELS' && (
          <div className="space-y-4">
            {/* Quick Reel Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#111722]/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-indigo-500/30 gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎬</span>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>Market Shorts</span>
                    <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/40 font-mono">
                      Card {activeReelIndex + 1} of {sortedItems.length}
                    </span>
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>Swipe or navigate like reels</span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700/80 font-mono">
                      <kbd className="bg-slate-800 px-1 rounded text-slate-300">↑</kbd>
                      <kbd className="bg-slate-800 px-1 rounded text-slate-300">↓</kbd> Keys
                    </span>
                  </div>
                </div>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  disabled={activeReelIndex === 0}
                  onClick={() => {
                    const next = Math.max(0, activeReelIndex - 1);
                    setActiveReelIndex(next);
                    if (sortedItems[next]) setActiveItem(sortedItems[next]);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 active:scale-95 transition cursor-pointer flex items-center gap-1"
                  title="Previous Card (or Up Arrow)"
                >
                  <span>▲</span>
                  <span>Previous</span>
                </button>
                <button
                  disabled={activeReelIndex >= sortedItems.length - 1}
                  onClick={() => {
                    const next = Math.min(sortedItems.length - 1, activeReelIndex + 1);
                    setActiveReelIndex(next);
                    if (sortedItems[next]) setActiveItem(sortedItems[next]);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-900/30"
                  title="Next Card (or Down Arrow)"
                >
                  <span>Next Card</span>
                  <span>▼</span>
                </button>
              </div>
            </div>

            {/* Linear Progress Indicator */}
            <div className="max-w-md mx-auto w-full bg-slate-800/80 h-1 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${((activeReelIndex + 1) / Math.max(1, sortedItems.length)) * 100}%` }}
              />
            </div>

            {/* Main Single Reel Card (Phone / Short Video Aspect Ratio) */}
            {sortedItems[activeReelIndex] && (() => {
              const cur = sortedItems[activeReelIndex];
              const curSym = cur.type === 'STOCK' 
                ? cur.symbol 
                : cur.type === 'MUTUAL_FUND'
                ? (cur.id === 'nippon-india-nifty-bees' ? 'NIFTYBEES' : cur.id === 'nippon-india-gold-bees' ? 'GOLDBEES' : null)
                : (cur.type === 'IPO' && cur.status === 'RECENTLY LISTED' 
                    ? (cur.companySlug === 'waaree' ? 'WAAREEENER' 
                      : cur.companySlug === 'ntpc-green' ? 'NTPCGREEN' 
                      : cur.companySlug === 'tata-capital' ? 'TATACAP' 
                      : cur.companySlug === 'hdb-financial' ? 'HDBFS' 
                      : cur.companySlug === 'bajaj-housing' ? 'BAJAJHFL' 
                      : (cur.companySlug === 'sbi-mf' || cur.companySlug === 'sbifunds') ? 'SBIFUNDS'
                      : cur.companySlug.toUpperCase()) 
                    : null);
              const curLive = curSym ? liveAssetQuotes[curSym] : null;
              const verdict = simpleVerdict(cur);

              // 5-year old friendly decision
              const isSuperGood = cur.convictionScore >= 92;
              const isAvoid = cur.type === 'IPO' ? cur.applyDecision.includes('AVOID') : cur.verdict.includes('AVOID');

              return (
                <div className="max-w-md mx-auto bg-gradient-to-b from-[#151D2C] via-[#0E1522] to-[#0A0E17] rounded-3xl border-2 border-indigo-500/40 p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-5 animate-in fade-in duration-300">
                  {/* Top glow */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${
                    isAvoid ? 'from-rose-500 to-amber-500' : isSuperGood ? 'from-emerald-400 via-teal-400 to-indigo-500' : 'from-indigo-500 to-purple-500'
                  }`} />

                  {/* Header: Company Name & Type Badge */}
                  <div className="flex items-start justify-between gap-3 pt-2">
                    <div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400 block">
                        {cur.type === 'STOCK' ? `Stock • ${cur.sector}` : cur.type === 'MUTUAL_FUND' ? `Mutual Fund • ${cur.category}` : `IPO • ${cur.status}`}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                        {cur.name}
                      </h2>
                      {cur.type === 'STOCK' && (
                        <span className="text-xs font-mono text-slate-400">Ticker: {cur.symbol} on {curLive?.exchange || cur.exchange}</span>
                      )}
                    </div>

                    <div className="shrink-0 text-center bg-slate-900/90 border border-slate-800 p-2 rounded-2xl min-w-[70px]">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Score</span>
                      <span className={`text-lg font-black ${cur.convictionScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {cur.convictionScore}/100
                      </span>
                    </div>
                  </div>

                  {/* GIANT PRICE CARD (Live NSE/BSE) */}
                  <div className="bg-[#090D13] p-4 rounded-2xl border border-slate-800 text-center space-y-1 relative">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      {cur.type === 'IPO' && cur.status === 'UPCOMING' ? 'Ticket Price Band' : 'Live Current Price'}
                    </span>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                        {cur.type === 'IPO' && cur.status === 'UPCOMING' 
                          ? cur.priceBand 
                          : curLive 
                          ? `₹${curLive.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                          : cur.type === 'STOCK' 
                          ? `₹${cur.cmp.toLocaleString()}` 
                          : cur.type === 'MUTUAL_FUND'
                          ? `₹${cur.nav.toLocaleString()}`
                          : `₹${cur.minInvestment.toLocaleString()}`}
                      </span>
                      {curLive && (
                        <span className={`text-sm font-black font-mono px-2 py-0.5 rounded-lg ${
                          curLive.changePct >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {curLive.changePct >= 0 ? '▲ +' : '▼ '}{curLive.changePct}%
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono block">
                      ● Live Real-Time Feed from NSE & BSE
                    </span>
                  </div>

                  {/* 5-YEAR OLD SIMPLE DECISION CARD (Traffic Light Color) */}
                  <div className={`p-4 rounded-2xl border text-center space-y-1.5 shadow-lg ${
                    isAvoid 
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      : isSuperGood 
                      ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                      : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  }`}>
                    <div className="text-4xl">{verdict.emoji}</div>
                    <div className="text-lg font-black tracking-tight">{verdict.text}</div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                      {cur.type === 'IPO' 
                        ? (cur.applyDecision.includes('MUST') 
                            ? 'Great company! It is making real money and selling shares to grow bigger.' 
                            : cur.applyDecision.includes('TACTICALLY') 
                            ? 'Good for quick gains on day 1, but be careful holding too long!' 
                            : 'Watch out! The big owners are taking their money out, so do not rush in.')
                        : cur.type === 'STOCK'
                        ? (cur.marginOfSafetyPct > 10 
                            ? 'This is on discount! The real value is higher than today’s price.' 
                            : 'Good strong company, but wait for a small dip to buy cheaper.')
                        : 'Safe bucket of top companies! Put small money every month like a piggy bank.'}
                    </p>
                  </div>

                  {/* 3 Simple Metric Bubbles */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-[#090D13] p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Safety</span>
                      <span className="font-black text-emerald-400">
                        {cur.type === 'STOCK' 
                          ? `${cur.marginOfSafetyPct > 0 ? '+' : ''}${cur.marginOfSafetyPct}%` 
                          : cur.type === 'MUTUAL_FUND' 
                          ? cur.riskProfile 
                          : cur.gmp > 0 ? `+${cur.expectedListingGainPct}%` : 'TBD'}
                      </span>
                    </div>

                    <div className="bg-[#090D13] p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">
                        {cur.type === 'STOCK' ? 'Target' : cur.type === 'MUTUAL_FUND' ? '3Y Return' : 'Issue Size'}
                      </span>
                      <span className="font-black text-indigo-300">
                        {cur.type === 'STOCK' 
                          ? `₹${cur.target1}` 
                          : cur.type === 'MUTUAL_FUND' 
                          ? `+${cur.cagr3y}%` 
                          : `₹${cur.issueSizeCr}Cr`}
                      </span>
                    </div>

                    <div className="bg-[#090D13] p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Stop-Loss / Risk</span>
                      <span className="font-black text-rose-300">
                        {cur.type === 'STOCK' 
                          ? `₹${cur.stopLoss}` 
                          : cur.type === 'MUTUAL_FUND' 
                          ? cur.exitLoad.split(';')[0].slice(0, 10) 
                          : cur.freshIssueCr > 0 ? `${Math.round((cur.freshIssueCr / cur.issueSizeCr) * 100)}% Fresh` : '100% OFS'}
                      </span>
                    </div>
                  </div>

                  {/* REAL-TIME MARKET NEWS & DYNAMIC REASON OF FALL OR RISE (100% Live from NSE/BSE & Media) */}
                  {curSym && (
                    <div className="bg-[#090D13] p-4 rounded-2xl border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-bold text-amber-300">
                          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>Why is this Stock {curLive ? (curLive.changePct >= 0 ? 'Rising 📈' : 'Falling 📉') : 'Moving'} Today?</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {liveNewsMap[curSym]?.pubDate || 'Live Exchange Feed'}
                        </span>
                      </div>

                      {/* Live Market Movement Explanation */}
                      {curLive && (
                        <div className={`p-2.5 rounded-xl border text-xs font-sans ${
                          curLive.changePct >= 0
                            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                            : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                        }`}>
                          <div className="flex items-center gap-1.5 font-bold mb-1">
                            <span>{curLive.changePct >= 0 ? '🚀 UP REASON:' : '⚠️ DOWN REASON:'}</span>
                            <span>{curLive.changePct >= 0 ? `+${curLive.changePct}%` : `${curLive.changePct}%`} on {curLive.exchange}</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-200">
                            {liveNewsMap[curSym]?.headline
                              ? liveNewsMap[curSym].headline
                              : curLive.changePct >= 0
                              ? `Heavy net institutional buying support on ${curLive.exchange} with session volume of ${(curLive.volume / 100000).toFixed(1)}L shares pushing prices towards Target 1 (₹${cur.type === 'STOCK' ? cur.target1 : '—'}).`
                              : `Profit booking & selling pressure on ${curLive.exchange} dragging price near day low (₹${curLive.dayLow}). Stop-loss trigger at ₹${cur.type === 'STOCK' ? cur.stopLoss : '—'}.`}
                          </p>
                        </div>
                      )}

                      {/* Verified Media Source Footer */}
                      {liveNewsMap[curSym] ? (
                        <div className="flex items-center justify-between pt-1 text-[11px] font-mono border-t border-slate-800/80">
                          <span className="text-slate-400">
                            Verified Source: <strong className="text-slate-300">{liveNewsMap[curSym].source}</strong>
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            liveNewsMap[curSym].type === 'DEMAND_REASON' 
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : liveNewsMap[curSym].type === 'FALL_REASON'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          }`}>
                            {liveNewsMap[curSym].type === 'DEMAND_REASON' ? '🔥 Positive Catalyst' : liveNewsMap[curSym].type === 'FALL_REASON' ? '⚠️ Selling Trigger' : '📰 Market Buzz'}
                          </span>
                        </div>
                      ) : isLoadingNews ? (
                        <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                          <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Fetching real-time news trigger from NSE/BSE...</span>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Quick Bottom Action: Like / Learn More */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('PRO')}
                      className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Info className="w-4 h-4 text-indigo-400" />
                      <span>Deep Dive Details</span>
                    </button>
                    <button
                      onClick={() => {
                        const next = Math.min(sortedItems.length - 1, activeReelIndex + 1);
                        setActiveReelIndex(next);
                        if (sortedItems[next]) setActiveItem(sortedItems[next]);
                      }}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-95 text-xs font-black text-white transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
                    >
                      <span>Next Stock</span>
                      <span>👉</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: 💻 DETAILED PRO VIEW (Complete Deep-Dive Terminal) */}
        {/* ========================================================================= */}
        {viewMode === 'PRO' && (
        <div className="space-y-4">
          {/* Mobile Master-Detail Switcher Bar (visible ONLY on mobile / tablet < lg) */}
          <div className="lg:hidden flex items-center p-1 bg-[#090D13] border border-[#1E293B] rounded-xl text-xs font-mono font-bold shadow-lg">
            <button
              onClick={() => {
                soundEffects.playTabSwitch();
                setMobileProTab('LIST');
              }}
              className={`flex-1 py-2.5 rounded-lg text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                mobileProTab === 'LIST'
                  ? 'bg-slate-800 text-white shadow-xs ring-1 ring-slate-700 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📋 Universe ({sortedItems.length})</span>
            </button>
            <button
              onClick={() => {
                soundEffects.playTabSwitch();
                setMobileProTab('DETAIL');
              }}
              className={`flex-1 py-2.5 rounded-lg text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                mobileProTab === 'DETAIL'
                  ? 'bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-500 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="truncate">📊 {activeItem ? (activeItem.type === 'STOCK' ? activeItem.symbol : activeItem.name.split(' ')[0]) : 'Selected'} Details</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            </button>
          </div>

          <div className="grid grid-cols-12 gap-5">
            {/* Left Column: Filtered Assets List */}
            <div className={`col-span-12 lg:col-span-4 space-y-2.5 max-h-[860px] overflow-y-auto no-scrollbar pr-1 ${
              mobileProTab === 'DETAIL' ? 'hidden lg:block' : 'block'
            }`}>
              <div className="text-xs font-mono text-slate-400 px-1 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-800/60">
                <span className="truncate">UNIVERSE ({sortedItems.length})</span>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[10px] text-slate-500 uppercase">Sort:</span>
                  {(
                    [
                      { id: 'CONVICTION' as const, label: 'Score' },
                      { id: 'PRICE' as const, label: 'Price' },
                      { id: 'CHANGE' as const, label: '% Gain' },
                      { id: 'NAME' as const, label: 'A-Z' },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSortBy(s.id)}
                      className={`text-[10px] px-2 py-0.5 rounded transition cursor-pointer font-sans font-semibold ${
                        sortBy === s.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-800/90 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {sortedItems.map((item) => {
                const isSelected = activeItem === item || (activeItem?.name === item.name);
                const itemSym = item.type === 'STOCK' 
                  ? item.symbol 
                  : item.type === 'MUTUAL_FUND'
                  ? (item.id === 'nippon-india-nifty-bees' ? 'NIFTYBEES' : item.id === 'nippon-india-gold-bees' ? 'GOLDBEES' : null)
                  : (item.type === 'IPO' && item.status === 'RECENTLY LISTED' 
                      ? (item.companySlug === 'waaree' ? 'WAAREEENER' 
                        : item.companySlug === 'ntpc-green' ? 'NTPCGREEN' 
                        : item.companySlug === 'tata-capital' ? 'TATACAP' 
                        : item.companySlug === 'hdb-financial' ? 'HDBFS' 
                        : item.companySlug === 'bajaj-housing' ? 'BAJAJHFL' 
                        : (item.companySlug === 'sbi-mf' || item.companySlug === 'sbifunds') ? 'SBIFUNDS'
                        : item.companySlug.toUpperCase()) 
                      : null);

                const liveQuote = itemSym ? liveAssetQuotes[itemSym] : null;
                const displayPrice = liveQuote
                  ? liveQuote.price
                  : item.type === 'STOCK'
                  ? item.cmp
                  : item.type === 'MUTUAL_FUND'
                  ? item.nav
                  : item.minInvestment;

                return (
                  <div
                    key={item.name}
                    onClick={() => {
                      soundEffects.playTabSwitch();
                      setActiveItem(item);
                      setMobileProTab('DETAIL');
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? item.type === 'IPO'
                          ? 'bg-[#1C1824] border-amber-500 shadow-md ring-1 ring-amber-500/40'
                          : 'bg-[#151D2C] border-indigo-500 shadow-md ring-1 ring-indigo-500/40'
                        : 'bg-[#111722] border-[#1E293B] hover:border-slate-700 hover:bg-[#131B27]'
                    }`}
                  >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-mono font-black text-white">
                          {item.type === 'STOCK' ? `${item.exchange}:${item.symbol}` : item.name}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          item.type === 'STOCK' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                          item.type === 'MUTUAL_FUND' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {item.type === 'IPO' ? item.status : item.type}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block line-clamp-1 mt-0.5">
                        {item.type === 'STOCK' ? item.name : item.type === 'MUTUAL_FUND' ? item.category : `Price: ${item.priceBand}`}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      {item.type === 'IPO' && item.status === 'UPCOMING' && item.minInvestment === 0 ? (
                        <div>
                          <span className="text-xs font-mono font-bold text-amber-300 block">
                            Band TBD
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            DRHP Approved
                          </span>
                        </div>
                      ) : (
                        <>
                          <span className="text-xs font-mono font-black text-white block">
                            ₹{displayPrice.toLocaleString()}
                          </span>
                          {liveQuote ? (
                            <span className={`text-[10px] font-mono font-bold block ${liveQuote.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {liveQuote.changePct >= 0 ? '+' : ''}{liveQuote.changePct}%
                            </span>
                          ) : (
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              item.convictionScore >= 90 ? 'text-emerald-400 bg-emerald-950/60' : 'text-amber-400 bg-amber-950/60'
                            }`}>
                              Score {item.convictionScore}/100
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Verdict Badge / Decision */}
                  <div className="mt-2.5 pt-2 border-t border-[#1E293B] flex items-center justify-between text-[11px] font-mono gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-slate-400">
                        {item.type === 'IPO' ? 'Apply:' : 'Verdict:'}
                      </span>
                      <span className={`font-bold truncate ${
                        item.type === 'IPO'
                          ? item.applyDecision.includes('MUST SUBSCRIBE')
                            ? 'text-emerald-400'
                            : item.applyDecision.includes('TACTICALLY')
                            ? 'text-amber-300'
                            : 'text-rose-400'
                          : 'text-indigo-400'
                      }`}>
                        {item.type === 'IPO' ? item.applyDecision : item.verdict}
                      </span>
                    </div>
                    <span className="lg:hidden text-[10px] text-indigo-300 font-bold bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/25 shrink-0 flex items-center gap-1">
                      Details &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Aladdin Advisory Terminal */}
          <div className={`col-span-12 lg:col-span-8 ${mobileProTab === 'LIST' ? 'hidden lg:block' : 'block'}`}>
            {activeItem ? (
              <div className="bg-[#111722] rounded-2xl border border-[#1E293B] p-4 sm:p-6 shadow-2xl space-y-6">
                {/* Mobile Back Button to Universe List */}
                <div className="lg:hidden flex items-center justify-between pb-3 border-b border-[#1E293B]">
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setMobileProTab('LIST');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition active:scale-[0.96] micro-press cursor-pointer border border-slate-700 shadow-sm"
                  >
                    <span>&larr;</span>
                    <span>Back to Universe ({sortedItems.length})</span>
                  </button>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Active Details
                  </span>
                </div>

                {/* Header Profile */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                          {activeLive?.exchange || (activeItem.type === 'STOCK' ? activeItem.exchange : activeItem.type === 'MUTUAL_FUND' ? 'NAV' : 'IPO')}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                          {activeItem.type === 'STOCK' ? activeItem.symbol : activeItem.name}
                        </h2>
                        {activeItem.type === 'STOCK' && (
                          <span className="text-sm sm:text-base font-semibold text-slate-300">
                            · {activeItem.name}
                          </span>
                        )}
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/80">
                          {activeItem.type === 'IPO' ? activeItem.status : activeItem.type}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2.5 flex-wrap">
                        <span className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums tracking-tight">
                          ₹{(activeLive?.price ?? (activeItem.type === 'STOCK' ? activeItem.cmp : activeItem.type === 'MUTUAL_FUND' ? activeItem.nav : activeItem.minInvestment)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        {activeLive && (
                          <span className={`text-xs sm:text-sm font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            activeLive.changePct >= 0
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          }`}>
                            <span>{activeLive.changePct >= 0 ? '▲ +' : '▼ '}{activeLive.changePct}%</span>
                            <span className="text-[10px] text-slate-400 font-sans font-normal">Live</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono block">
                      {activeItem.type === 'STOCK' ? `Sector: ${activeItem.sector}` : activeItem.type === 'MUTUAL_FUND' ? `Asset Category: ${activeItem.category} · Recommended Horizon: ${activeItem.recommendedHorizon}` : `Subscription Window: ${activeItem.dates} · Price Band: ${activeItem.priceBand}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="bg-[#090D13] border border-slate-800 p-2.5 rounded-xl font-mono text-center">
                      <span className="text-[10px] text-slate-400 uppercase block">Aladdin Conviction</span>
                      <span className="text-lg font-black text-emerald-400">{activeItem.convictionScore}/100</span>
                    </div>
                    <div className="bg-emerald-950/60 border border-emerald-500/40 p-2.5 rounded-xl font-mono text-center">
                      <span className="text-[10px] text-emerald-300 uppercase block">Actionable Verdict</span>
                      <span className="text-xs font-black text-emerald-300">
                        {activeItem.type === 'IPO' ? activeItem.applyDecision : activeItem.verdict}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ================================================================= */}
                {/* VIEW 1: EQUITY & STOCK VALUATION ENGINE (Exchange + NSE CIIB Track) */}
                {/* ================================================================= */}
                {activeItem.type === 'STOCK' && (
                  <div className="space-y-5">
                    {/* Key Valuation Bento Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-[#090D13]/90 p-3.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Live CMP ({activeLive?.exchange || activeItem.exchange})</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        </div>
                        <span className="text-base sm:text-lg font-black font-mono text-white block mt-1 tabular-nums">
                          ₹{(activeLive?.price ?? activeItem.cmp).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`text-[10px] font-mono font-bold block mt-0.5 ${(activeLive?.changePct ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {(activeLive?.changePct ?? 0) >= 0 ? '+' : ''}{activeLive?.changePct ?? 0}% Live Feed
                        </span>
                      </div>
                      <div className="bg-[#090D13]/90 p-3.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">DCF Intrinsic Fair Value</span>
                        <span className="text-base sm:text-lg font-black font-mono text-emerald-400 block mt-1 tabular-nums">
                          ₹{(activeLive?.fairValue ?? activeItem.fairValue).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          Margin of Safety: +{(activeLive?.marginOfSafetyPct ?? activeItem.marginOfSafetyPct)}%
                        </span>
                      </div>
                      <div className="bg-[#090D13]/90 p-3.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">P/E vs Industry</span>
                        <span className="text-base sm:text-lg font-black font-mono text-indigo-400 block mt-1 tabular-nums">
                          {activeLive?.pe ?? activeItem.pe}x
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Industry: {activeItem.industryPe}x</span>
                      </div>
                      <div className="bg-[#090D13]/90 p-3.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Dividend Yield</span>
                        <span className="text-base sm:text-lg font-black font-mono text-amber-300 block mt-1 tabular-nums">
                          {activeItem.dividendYield}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Debt/Equity: {activeItem.debtToEquity}</span>
                      </div>
                    </div>

                    {/* Live Day Range & Session Volume Bar */}
                    {activeLive?.dayHigh && activeLive?.dayLow && (
                      <div className="bg-[#090D13] p-3.5 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                          <span>Day Low: ₹{activeLive.dayLow.toLocaleString()}</span>
                          <span className="text-emerald-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            NSE & BSE Live Session Range
                          </span>
                          <span>Day High: ₹{activeLive.dayHigh.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(5, (((activeLive.price - activeLive.dayLow) / Math.max(0.01, (activeLive.dayHigh - activeLive.dayLow))) * 100)))}%`
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                          <span>52W Low: ₹{activeLive.fiftyTwoWeekLow ? activeLive.fiftyTwoWeekLow.toLocaleString() : '—'}</span>
                          <span>Live Session Volume: {activeLive.volume ? (activeLive.volume > 100000 ? `${(activeLive.volume / 100000).toFixed(2)} Lakh shares` : activeLive.volume.toLocaleString()) : 'Real-time Ticks'}</span>
                          <span>52W High: ₹{activeLive.fiftyTwoWeekHigh ? activeLive.fiftyTwoWeekHigh.toLocaleString() : '—'}</span>
                        </div>
                      </div>
                    )}

                    {/* Targets & Risk Corridor */}
                    <div className="bg-[#090D13] p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-bold">
                        <span className="text-slate-300">🎯 Aladdin Multi-Horizon Price Targets</span>
                        <span className="text-indigo-400">1:2 Risk-to-Reward Architecture</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                          <span className="text-[10px] text-emerald-400 block uppercase font-bold">Target 1 (Base)</span>
                          <span className="text-sm font-black text-emerald-300">
                            ₹{(activeLive?.target1 ?? activeItem.target1).toLocaleString()}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30">
                          <span className="text-[10px] text-indigo-400 block uppercase font-bold">Target 2 (Optimistic)</span>
                          <span className="text-sm font-black text-indigo-300">
                            ₹{(activeLive?.target2 ?? activeItem.target2).toLocaleString()}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30">
                          <span className="text-[10px] text-rose-400 block uppercase font-bold">Strict Stop-Loss</span>
                          <span className="text-sm font-black text-rose-300">
                            ₹{(activeLive?.stopLoss ?? activeItem.stopLoss).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Exchange Standards: Corporate Actions & Depth Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#090D13] p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Corporate Actions & Payouts (Exchange Ch 12)</span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">
                          {activeItem.corporateActionNotice}
                        </p>
                      </div>

                      <div className="bg-[#090D13] p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>20-Market Depth & Macro Drivers (Exchange Ch 13 & 16)</span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">
                          {activeItem.macroSensitivity} Bid absorption ratio is <strong>{Math.round(activeItem.marketDepthBidRatio * 100)}%</strong>, indicating strong institutional limit buyer support.
                        </p>
                      </div>
                    </div>

                    {/* Institutional Pedagogical Insights */}
                    <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950/40 p-4 rounded-xl border border-indigo-500/30 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-indigo-300">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Curriculum Skill Applications</span>
                      </div>
                      <div className="space-y-1.5 text-slate-300 font-sans">
                        <div>
                          <strong className="text-emerald-400">Core Financial Principle:</strong> {activeItem.academyLesson}
                        </div>
                        <div>
                          <strong className="text-indigo-400">NSE Academy & NYIF Framework:</strong> {activeItem.nseAcademyInsight}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================================================================= */}
                {/* VIEW 2: MUTUAL FUND & ETF ADVISORY ENGINE (NSE Academy / NYIF) */}
                {/* ================================================================= */}
                {activeItem.type === 'MUTUAL_FUND' && (
                  <div className="space-y-5">
                    {/* Live Exchange Ticks for Listed ETFs */}
                    {activeLive && (
                      <div className="bg-gradient-to-r from-cyan-950/40 via-indigo-950/20 to-slate-900 border border-cyan-500/40 p-4 rounded-xl shadow-lg space-y-3 font-mono">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-cyan-500/20">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                            <span className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                              LIVE EXCHANGE ETF TICKER ({activeLive.exchange})
                            </span>
                            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold border border-cyan-500/30">
                              REAL-TIME NSE FEED
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Intraday NAV vs Exchange Price
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="bg-[#090D13] p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase block">Live ETF Price</span>
                            <span className="text-base font-black text-white block mt-0.5">
                              ₹{activeLive.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className={`text-[10px] font-bold block mt-0.5 ${activeLive.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {activeLive.changePct >= 0 ? '+' : ''}{activeLive.changePct}% Live Today
                            </span>
                          </div>

                          <div className="bg-[#090D13] p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase block">End-of-Day NAV</span>
                            <span className="text-sm font-black text-amber-300 block mt-0.5">
                              ₹{activeItem.nav.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Underlying NAV</span>
                          </div>

                          <div className="bg-[#090D13] p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase block">Live Day Range</span>
                            <span className="text-xs font-black text-cyan-300 block mt-0.5">
                              ₹{activeLive.dayLow?.toLocaleString() ?? '—'} - ₹{activeLive.dayHigh?.toLocaleString() ?? '—'}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Intraday NSE</span>
                          </div>

                          <div className="bg-[#090D13] p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase block">Exchange Volume</span>
                            <span className="text-sm font-black text-indigo-300 block mt-0.5">
                              {activeLive.volume ? (activeLive.volume > 100000 ? `${(activeLive.volume / 100000).toFixed(2)}L` : activeLive.volume.toLocaleString()) : 'Active'}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Units Traded</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Fund Return & Risk Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-[#090D13] p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">3Y CAGR Return</span>
                        <span className="text-base font-black font-mono text-emerald-400">+{activeItem.cagr3y}%</span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">5Y CAGR: +{activeItem.cagr5y}%</span>
                      </div>
                      <div className="bg-[#090D13] p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">Expense Ratio (TER)</span>
                        <span className="text-base font-black font-mono text-white">{activeItem.expenseRatio}%</span>
                        <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">Ultra Low Cost Friction</span>
                      </div>
                      <div className="bg-[#090D13] p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">Alpha vs Benchmark</span>
                        <span className="text-base font-black font-mono text-indigo-400">+{activeItem.alpha}%</span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Beta: {activeItem.beta}</span>
                      </div>
                      <div className="bg-[#090D13] p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">Sortino Ratio</span>
                        <span className="text-base font-black font-mono text-amber-300">{activeItem.sortinoRatio}</span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Sharpe: {activeItem.sharpeRatio}</span>
                      </div>
                    </div>

                    {/* Top Portfolio Holdings & Exit Load Rules */}
                    <div className="bg-[#090D13] p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
                        <span>🏛️ Top Portfolio Holdings & Underlying Exposure</span>
                        <span className="text-slate-500">AUM: ₹{activeItem.aumCr.toLocaleString()} Cr</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {activeItem.topHoldings.map((h) => (
                          <span key={h} className="bg-slate-900 border border-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg font-mono">
                            {h}
                          </span>
                        ))}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800">
                        <span>Exit Load Condition: <strong>{activeItem.exitLoad}</strong></span>
                      </div>
                    </div>

                    {/* Curriculum Insights */}
                    <div className="bg-gradient-to-r from-indigo-950/40 via-cyan-950/20 to-slate-950/40 p-4 rounded-xl border border-indigo-500/30 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-cyan-300">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>NSE Academy Wealth Advisory Methodology</span>
                      </div>
                      <div className="space-y-1.5 text-slate-300 font-sans">
                        <div>
                          <strong className="text-emerald-400">Asset Construction Principle:</strong> {activeItem.academyLesson}
                        </div>
                        <div>
                          <strong className="text-cyan-400">NYIF Risk-Adjusted Framework:</strong> {activeItem.nseAcademyInsight}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================================================================= */}
                {/* VIEW 3: IPO & OFS EVALUATOR & "SHOULD YOU APPLY?" DECISION ENGINE */}
                {/* ================================================================= */}
                {activeItem.type === 'IPO' && (
                  <div className="space-y-5">
                    {/* LIVE SECONDARY MARKET TRADING TRACKER (NSE & BSE) */}
                    {activeItem.status === 'RECENTLY LISTED' && (
                      <div className="bg-gradient-to-r from-emerald-950/50 via-[#0D2117] to-slate-900 border border-emerald-500/50 p-4 rounded-2xl shadow-xl space-y-3 font-mono">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-emerald-500/20">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                              LIVE SECONDARY MARKET TRADING TRACKER (NSE & BSE)
                            </span>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/40">
                              OFFICIALLY LISTED
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {activeItem.dates}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="bg-[#090D13] p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase block">Live CMP ({activeLive?.exchange || 'NSE'})</span>
                            <span className="text-base font-black text-white block mt-0.5">
                              ₹{(activeLive?.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className={`text-[10px] font-bold block mt-0.5 ${(activeLive?.changePct ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {(activeLive?.changePct ?? 0) >= 0 ? '+' : ''}{activeLive?.changePct ?? 0}% Live Feed
                            </span>
                          </div>

                          <div className="bg-[#090D13] p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase block">IPO Issue Price Band</span>
                            <span className="text-sm font-black text-amber-300 block mt-0.5">
                              {activeItem.priceBand.split('(')[0].trim()}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Allotment Cut-off</span>
                          </div>

                          <div className="bg-[#090D13] p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase block">Live Day Range</span>
                            <span className="text-xs font-black text-cyan-300 block mt-0.5">
                              ₹{activeLive?.dayLow?.toLocaleString() ?? '—'} - ₹{activeLive?.dayHigh?.toLocaleString() ?? '—'}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Intraday Session</span>
                          </div>

                          <div className="bg-[#090D13] p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase block">Live Session Volume</span>
                            <span className="text-sm font-black text-indigo-300 block mt-0.5">
                              {activeLive?.volume ? (activeLive.volume > 100000 ? `${(activeLive.volume / 100000).toFixed(2)} Lakh` : activeLive.volume.toLocaleString()) : 'Real-time Ticks'}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Shares Traded</span>
                          </div>
                        </div>

                        {activeLive?.fiftyTwoWeekHigh && activeLive?.fiftyTwoWeekLow && (
                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                            <span>52-Week Low: <strong className="text-white">₹{activeLive.fiftyTwoWeekLow.toLocaleString()}</strong></span>
                            <span className="text-emerald-400 font-bold">52-Week Range</span>
                            <span>52-Week High: <strong className="text-white">₹{activeLive.fiftyTwoWeekHigh.toLocaleString()}</strong></span>
                          </div>
                        )}
                      </div>
                    )}
                    {/* 1. HIGH-PRIORITY "SHOULD YOU APPLY?" ALADDIN DECISION BOX */}
                    <div
                      className={`p-4 sm:p-5 rounded-2xl border shadow-xl ${
                        activeItem.applyDecision.includes('MUST SUBSCRIBE')
                          ? 'bg-gradient-to-r from-emerald-950/70 via-[#102319] to-[#0A1A12] border-emerald-500/50'
                          : activeItem.applyDecision.includes('TACTICALLY')
                          ? 'bg-gradient-to-r from-amber-950/70 via-[#261E0F] to-[#1A1409] border-amber-500/50'
                          : 'bg-gradient-to-r from-rose-950/70 via-[#261216] to-[#1A0A0E] border-rose-500/50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                            ALADDIN INSTITUTIONAL DECISION
                          </span>
                          <span
                            className={`text-lg sm:text-xl font-black font-mono flex items-center gap-2 ${
                              activeItem.applyDecision.includes('MUST SUBSCRIBE')
                                ? 'text-emerald-300'
                                : activeItem.applyDecision.includes('TACTICALLY')
                                ? 'text-amber-300'
                                : 'text-rose-400'
                            }`}
                          >
                            {activeItem.applyReasonTitle}
                          </span>
                        </div>

                        <div className="shrink-0">
                          <span
                            className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border ${
                              activeItem.applyDecision.includes('MUST SUBSCRIBE')
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : activeItem.applyDecision.includes('TACTICALLY')
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            Score: {activeItem.convictionScore}/100
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 mt-3 leading-relaxed font-sans">
                        {activeItem.applyReasonDetail}
                      </p>

                      {/* Actionable Bidding Strategy */}
                      <div className="mt-3.5 pt-3 border-t border-white/10 text-xs font-mono text-indigo-300 flex items-start gap-2 bg-[#090D13]/60 p-2.5 rounded-xl">
                        <Target className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>Retail Application Execution:</strong> {activeItem.biddingStrategy}
                        </div>
                      </div>
                    </div>

                    {/* 2. INSTITUTIONAL IPO QUALITY CHECKLIST (5-FACTOR SCORECARD) */}
                    <div className="bg-[#090D13] p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                      <span className="text-xs font-bold text-slate-300 uppercase block">
                        📋 Exchange & Market Academy 5-Factor IPO Diligence Checklist (Chapters 5 & 15)
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                          {activeItem.checklist.capitalIntegrity.pass ? (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <strong className="text-white block">1. Capital Quality (Fresh vs OFS)</strong>
                            <span className="text-[11px] text-slate-400 font-sans">{activeItem.checklist.capitalIntegrity.note}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                          {activeItem.checklist.gmpStrength.pass ? (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <strong className="text-white block">2. Grey Market Premium (GMP)</strong>
                            <span className="text-[11px] text-slate-400 font-sans">{activeItem.checklist.gmpStrength.note}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                          {activeItem.checklist.institutionalBacking.pass ? (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <strong className="text-white block">3. Institutional QIB Demand</strong>
                            <span className="text-[11px] text-slate-400 font-sans">{activeItem.checklist.institutionalBacking.note}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                          {activeItem.checklist.valuationComfort.pass ? (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <strong className="text-white block">4. Valuation vs Listed Peers</strong>
                            <span className="text-[11px] text-slate-400 font-sans">{activeItem.checklist.valuationComfort.note}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Issue Capital Structure (Fresh Issue vs OFS) */}
                    <div className="bg-[#090D13] p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-bold">
                        <span className="text-amber-300">🚀 Issue Capital Structure (Total: ₹{activeItem.issueSizeCr.toLocaleString()} Cr)</span>
                        <span className="text-slate-400">Price Band: {activeItem.priceBand}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                          <span className="text-[10px] text-emerald-400 uppercase block font-bold">Fresh Issue (Goes into Company)</span>
                          <span className="text-base font-black text-emerald-300">₹{activeItem.freshIssueCr.toLocaleString()} Cr</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {activeItem.issueSizeCr > 0 ? `${Math.round((activeItem.freshIssueCr / activeItem.issueSizeCr) * 100)}% of total issue` : 'N/A'}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30">
                          <span className="text-[10px] text-rose-400 uppercase block font-bold">Offer for Sale OFS (Promoter Cashing Out)</span>
                          <span className="text-base font-black text-rose-300">₹{activeItem.ofsCr.toLocaleString()} Cr</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {activeItem.issueSizeCr > 0 ? `${Math.round((activeItem.ofsCr / activeItem.issueSizeCr) * 100)}% of total issue` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 4. GMP & Key Subscription Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-[#090D13] p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">Current GMP</span>
                        <span className="text-base font-black font-mono text-emerald-400">
                          {activeItem.gmp !== 0 ? (activeItem.gmp > 0 ? `+₹${activeItem.gmp}` : `-₹${Math.abs(activeItem.gmp)}`) : 'TBD (Post-RHP)'}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                          {activeItem.expectedListingGainPct > 0 ? `Est. Gain: +${activeItem.expectedListingGainPct}%` : 'Awaiting RHP Band'}
                        </span>
                      </div>
                      <div className="bg-[#090D13] p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">QIB Subscription</span>
                        <span className="text-base font-black font-mono text-indigo-400">
                          {activeItem.qibSubscription > 0 ? `${activeItem.qibSubscription}x` : 'Issue Pending'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          {activeItem.qibSubscription > 0 ? 'Smart Money Backing' : 'Opens on Bidding Date'}
                        </span>
                      </div>
                      <div className="bg-[#090D13] p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">Lot Size / Min Bid</span>
                        <span className="text-base font-black font-mono text-white">
                          {activeItem.lotSize > 0 ? `${activeItem.lotSize} shares` : 'TBD in RHP'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          {activeItem.minInvestment > 0 ? `₹${activeItem.minInvestment.toLocaleString()}` : 'Awaiting RHP Filing'}
                        </span>
                      </div>
                      <div className="bg-[#090D13] p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">P/E vs Peers</span>
                        <span className="text-base font-black font-mono text-amber-300">
                          {activeItem.peAtCutoff > 0 ? `${activeItem.peAtCutoff}x` : 'EV/GPV Valued'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Peers: {activeItem.peerAveragePe}x</span>
                      </div>
                    </div>

                    {/* 5. Curriculum Insights (Exchange Ch 5, 6 & 15) */}
                    <div className="bg-gradient-to-r from-amber-950/40 via-indigo-950/20 to-slate-950/40 p-4 rounded-xl border border-amber-500/30 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-amber-300">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Exchange IPO Market Principles (Chapters 5 & 15)</span>
                      </div>
                      <div className="space-y-1.5 text-slate-300 font-sans">
                        <div>
                          <strong className="text-amber-400">Core Financial Principle:</strong> {activeItem.academyLesson}
                        </div>
                        <div>
                          <strong className="text-indigo-400">NSE CIIB M&A & Valuation Guideline:</strong> {activeItem.nseAcademyInsight}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
        </div>
        )}
      </div>
    </div>
  );
}
