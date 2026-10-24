# MarketPulse Terminal — Institutional Wealth Advisory & Trading Copilot

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple?style=flat&logo=pwa)](https://web.dev/progressive-web-apps/)
[![Test Suite](https://img.shields.io/badge/Tests-170%20Passed-emerald?style=flat)](tests/comprehensive-test-suite.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An institutional-grade, full-spectrum Indian financial terminal, wealth advisory, and algorithmic trading copilot built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. 

Designed with an ultra-low latency responsive interface, offline Progressive Web App (PWA) support, dynamic mobile master-detail architecture, and synthesized Web Audio micro-interactions.

---

## ⚡ Key Highlights & Core Capabilities

### 1. Aladdin Wealth Advisory Terminal
- **Tri-Asset Coverage**: Instant analysis across **Equities**, **Mutual Funds/ETFs**, and **Current/Upcoming IPOs** (including real-time GMP, cutoff P/E, and subscription verdicts).
- **Graham Intrinsic Valuation**: Computes true intrinsic value and margin of safety using Benjamin Graham's foundational quantitative formulas:
  $$\text{Intrinsic Value} = \sqrt{22.5 \times \text{EPS} \times \text{BVPS}}$$
- **DuPont 3-Pillar Return on Equity (RoE)**:
  $$\text{RoE} = \text{Net Profit Margin} \times \text{Asset Turnover} \times \text{Financial Leverage}$$
- **Capital Risk & Moat Screening**: 4-filter governance checks (promoter pledging, debt-to-equity, cash conversion cycle, and pricing power).

### 2. Algorithmic Trading & Smart Money Concepts (SMC)
- **Institutional Liquidity Detection**: Live Buy-Side Liquidity (BSL), Sell-Side Liquidity (SSL), and Fair Value Gaps (FVG) computation.
- **Real-time OI Heatmaps & PCR**: Open Interest distributions with Put-Call Ratio sentiment analysis (Oversold, Neutral, Overbought zones).
- **Position Sizing Calculator**: Strict 1–2% risk-per-trade enforcement with mathematical stop-loss distance calculation and minimum 1:2 / 1:3 Risk-to-Reward ratio.
- **Discipline Gatekeeper & Trade Journal**: Anti-revenge circuit breakers and local browser-persisted trade logging.

### 3. Native PWA & Mobile Experience
- **1-Tap App Installation**: Full Progressive Web App manifest and offline service worker caching.
- **Adaptive Master-Detail Pattern**: Seamless mobile list/detail switching with 1-tap universe navigation.
- **Synthesized Web Audio Micro-Interactions**: Native high-frequency clicks, success chords, and warning alerts without external audio assets.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/raviattrash-pro/marketpulse-terminal.git

# Enter project directory
cd marketpulse-terminal

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Comprehensive Test Suite

MarketPulse includes an automated regression and security test suite covering:
- Real-time quote streaming endpoints
- Intrinsic valuation and DuPont mathematical engines
- Smart Money Concepts (SMC) liquidity calculations
- OWASP security protections (XSS, SQLi, Path Traversal, Buffer overflow sanitization)
- PWA manifest and service worker validations

```bash
# Run test suite
node tests/comprehensive-test-suite.js
```
```text
======================================================
  TEST RESULTS: 170 PASSED | 0 FAILED
======================================================
```

---

## 📁 Repository Structure

```
marketpulse-terminal/
├── app/
│   ├── api/                  # Live Indian market quote & news proxies
│   ├── globals.css           # Custom dark glassmorphism & typography
│   ├── layout.tsx            # Root PWA layout & metadata
│   ├── page.tsx              # Terminal dashboard orchestrator
│   └── manifest.json         # PWA Web App Manifest
├── components/
│   ├── AladdinWealthAdvisory.tsx # Deep-dive multi-asset advisory engine
│   ├── StockScreener.tsx         # Graham Fair Value & live valuation filters
│   ├── DuPontAnalysis.tsx        # 3-pillar RoE operational decomposition
│   ├── OptionStrategies.tsx      # Multi-leg option payoff visualizers
│   ├── OIHeatmap.tsx             # Call/Put Open Interest & PCR sentiment
│   ├── RiskPositionSizer.tsx     # 1-2% Capital risk & 1:2 R:R lot calculator
│   ├── PreTradeChecklist.tsx     # Pre-execution discipline gatekeeper
│   ├── TradeJournal.tsx          # LocalStorage-backed audit log
│   ├── PwaInstallButton.tsx      # Mobile & desktop 1-tap app installer
│   └── Sidebar.tsx               # Responsive off-canvas navigation drawer
├── lib/
│   └── soundEffects.ts       # Synthesized Web Audio micro-interactions
├── public/                   # Icons, PWA service worker (sw.js), favicons
├── tests/
│   └── comprehensive-test-suite.js # 170-point validation suite
├── next.config.js            # Next.js optimization configuration
└── tailwind.config.js        # Modern high-contrast dark theme
```

---

## ⚖️ Legal & Educational Disclaimer

> **IMPORTANT**: This terminal and software application is strictly for **educational, analytical, and informational purposes only**. It does not constitute financial, investment, legal, or tax advice. MarketPulse is not a SEBI-registered advisor. Securities trading carries substantial risk of loss. Always conduct your own independent research and consult a SEBI-registered Financial Advisor before deploying real capital.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
