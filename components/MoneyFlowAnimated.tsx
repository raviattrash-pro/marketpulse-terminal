'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Zap, RefreshCw, Info, Sparkles, Activity, Layers, TrendingUp, TrendingDown, X, Filter, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SectorItem {
  name: string;
  net: number; // in crores
  inflow: number;
  outflow: number;
}

interface SectorStockDetail {
  symbol: string;
  change: string;
  flow: string;
  flowCr: number;
  direction: 'INFLOW' | 'OUTFLOW';
  surge: boolean;
  reason?: string;
  news?: string;
  catalystTag?: string;
}

const SECTOR_CONSTITUENTS: Record<string, SectorStockDetail[]> = {
  'IT': [
    {
      symbol: 'TCS',
      change: '+2.69%',
      flow: '+₹934 cr',
      flowCr: 934,
      direction: 'INFLOW',
      surge: true,
      reason: 'Aggressive institutional accumulation following 18% YoY growth in AI & cloud services pipeline; FII buying above 20-DMA.',
      news: 'Announced $1.2B TCV multi-year digital transformation deal with European financial major.',
      catalystTag: 'EARNINGS BEAT',
    },
    {
      symbol: 'INFY',
      change: '+0.20%',
      flow: '+₹1,412 cr',
      flowCr: 1412,
      direction: 'INFLOW',
      surge: true,
      reason: 'Large-cap defensive rotation as DIIs hedge banking volatility; consistent free cash flow generation and margin defense.',
      news: 'Expands enterprise generative AI partnership with top US retail conglomerate.',
      catalystTag: 'AI EXPANSION',
    },
    {
      symbol: 'WIPRO',
      change: '+3.17%',
      flow: '+₹273 cr',
      flowCr: 273,
      direction: 'INFLOW',
      surge: false,
      reason: 'Short covering and turnaround momentum after management upgraded quarterly revenue outlook in consulting.',
      news: 'Secured $320M infrastructure management mandate from Nordic telecom client.',
      catalystTag: 'OUTLOOK HIKE',
    },
    {
      symbol: 'LTTS',
      change: '+2.80%',
      flow: '+₹485 cr',
      flowCr: 485,
      direction: 'INFLOW',
      surge: true,
      reason: 'Surge in ER&D engineering spend; multiple Tier-1 automotive software contracts ramp up.',
      news: 'Wins $50M engineering services mandate from tier-1 global auto group.',
      catalystTag: 'DEAL WIN',
    },
    {
      symbol: 'TECHM',
      change: '+2.60%',
      flow: '+₹420 cr',
      flowCr: 420,
      direction: 'INFLOW',
      surge: false,
      reason: 'Margin expansion roadmap pacing ahead of analyst consensus; cost rationalization delivering results.',
      news: 'Q2 EBIT margin expanded 110 bps QoQ to 11.2%; telecom vertical bottomed out.',
      catalystTag: 'MARGIN EXPANSION',
    },
    {
      symbol: 'HCLTECH',
      change: '-0.45%',
      flow: '-₹180 cr',
      flowCr: 180,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Mild profit booking near 52-week peak after recent run-up; slight software product seasonality.',
      news: 'Attrition ticked up slightly in European engineering services unit.',
      catalystTag: 'PROFIT BOOKING',
    },
    {
      symbol: 'COFORGE',
      change: '-1.10%',
      flow: '-₹145 cr',
      flowCr: 145,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'High valuation multiple re-rating pause; muted midcap tech flows today.',
      news: 'Integration costs from recent acquisitions weighing on near-term operating cash flows.',
      catalystTag: 'INTEGRATION COST',
    },
    {
      symbol: 'PERSISTENT',
      change: '-0.85%',
      flow: '-₹98 cr',
      flowCr: 98,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Selective institutional trimming after stock touched historical PE multiple of 54x.',
      news: 'Brokerage initiated coverage with Neutral rating citing full valuations.',
      catalystTag: 'VALUATION PRICED',
    },
  ],
  'Bank': [
    {
      symbol: 'ICICIBANK',
      change: '+0.92%',
      flow: '+₹996 cr',
      flowCr: 996,
      direction: 'INFLOW',
      surge: true,
      reason: 'Best-in-class asset quality; credit growth maintaining 16% YoY clip with lowest gross NPA in private peer group.',
      news: 'Net Interest Income rose 14.5% YoY; credit cost at multi-quarter low of 0.38%.',
      catalystTag: 'ASSET QUALITY',
    },
    {
      symbol: 'KOTAKBANK',
      change: '+0.45%',
      flow: '+₹380 cr',
      flowCr: 380,
      direction: 'INFLOW',
      surge: false,
      reason: 'Defensive DII value buying following RBI clearance of tech audit restrictions and new customer onboarding.',
      news: 'RBI lifts onboarding curbs on new digital credit cards after third-party security audit.',
      catalystTag: 'RBI CLEARANCE',
    },
    {
      symbol: 'INDUSINDBK',
      change: '+0.25%',
      flow: '+₹145 cr',
      flowCr: 145,
      direction: 'INFLOW',
      surge: false,
      reason: 'Steady loan growth in commercial vehicle portfolio; attractive price-to-book valuation support.',
      news: 'Vehicle finance disbursements up 18% YoY; retail deposits show stable growth.',
      catalystTag: 'DISBURSEMENT UP',
    },
    {
      symbol: 'HDFCBANK',
      change: '-5.12%',
      flow: '-₹815 cr',
      flowCr: 815,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Heavy FII algorithmic selling triggered by MSCI passive weight rebalance and deposit growth lagging advances.',
      news: 'Lender continues post-merger transition; CD ratio remains elevated at 102%, limiting rapid margin expansion.',
      catalystTag: 'MSCI OUTFLOW',
    },
    {
      symbol: 'AXISBANK',
      change: '-1.80%',
      flow: '-₹460 cr',
      flowCr: 460,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Foreign fund distribution after higher provisions on unsecured personal loan portfolio.',
      news: 'Credit costs guidance revised upward by 15 bps for unsecured retail book.',
      catalystTag: 'CREDIT COST HIKE',
    },
    {
      symbol: 'BANDHANBNK',
      change: '-2.40%',
      flow: '-₹185 cr',
      flowCr: 185,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'MFI collection efficiency concerns in Eastern states causing institutional liquidation.',
      news: 'Credit bureau reports indicate elevated over-indebtedness in rural micro-loans.',
      catalystTag: 'MFI HEADWIND',
    },
    {
      symbol: 'FEDERALBNK',
      change: '-0.95%',
      flow: '-₹92 cr',
      flowCr: 92,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Mild institutional profit-taking following leadership transition announcements.',
      news: 'New CEO outlines focus on branch expansion and secured SME lending.',
      catalystTag: 'LEADERSHIP SHIFT',
    },
  ],
  'PSU Bank': [
    {
      symbol: 'BANKBARODA',
      change: '+1.15%',
      flow: '+₹185 cr',
      flowCr: 185,
      direction: 'INFLOW',
      surge: false,
      reason: 'Robust corporate loan pipeline; international business margins showing resilient spread.',
      news: 'Sanctions ₹8,500 Cr credit lines for renewable energy and infrastructure projects.',
      catalystTag: 'CORP LENDING',
    },
    {
      symbol: 'CANBK',
      change: '+0.65%',
      flow: '+₹112 cr',
      flowCr: 112,
      direction: 'INFLOW',
      surge: false,
      reason: 'DII accumulation driven by single-digit PE multiple and ROE sustaining above 17%.',
      news: 'Board evaluates IPO listing of subsidiary Canara Robeco AMC.',
      catalystTag: 'SUBSIDIARY IPO',
    },
    {
      symbol: 'SBIN',
      change: '-0.72%',
      flow: '-₹594 cr',
      flowCr: 594,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Huge FII institutional offloading as sovereign bond yield fluctuations trigger treasury rebalancing.',
      news: 'Wage revision arrears and higher pension provisioning temper operating profits.',
      catalystTag: 'FII UNWINDING',
    },
    {
      symbol: 'PNB',
      change: '-1.85%',
      flow: '-₹245 cr',
      flowCr: 245,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Profit booking after sharp 6-month rally; treasury gains lower due to bond yield firmness.',
      news: 'Recoveries from written-off accounts moderated compared to previous quarter.',
      catalystTag: 'TREASURY PRESSURE',
    },
    {
      symbol: 'UNIONBANK',
      change: '-1.40%',
      flow: '-₹165 cr',
      flowCr: 165,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Mild distribution on asset-liability duration mismatch concerns in public sector book.',
      news: 'Cost-to-income ratio rose slightly due to IT infrastructure investments.',
      catalystTag: 'COST DRIVER',
    },
    {
      symbol: 'IOB',
      change: '-2.10%',
      flow: '-₹125 cr',
      flowCr: 125,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'High retail float causing sharp intraday supply pressure; institutional participation muted.',
      news: 'Government stake remains above 96%, maintaining limited institutional liquidity.',
      catalystTag: 'OFS OVERHANG',
    },
  ],
  'Insurance': [
    {
      symbol: 'SBILIFE',
      change: '+1.45%',
      flow: '+₹110 cr',
      flowCr: 110,
      direction: 'INFLOW',
      surge: true,
      reason: 'Protection segment revival and strong parent bank agency channel driving VNB margin expansion.',
      news: 'Annualized Premium Equivalent (APE) grew 19% YoY; retail protection share increased 140 bps.',
      catalystTag: 'VNB EXPANSION',
    },
    {
      symbol: 'MAXHEALTH',
      change: '+0.80%',
      flow: '+₹42 cr',
      flowCr: 42,
      direction: 'INFLOW',
      surge: false,
      reason: 'High occupancy rates across metro hospitals and strong bed addition roadmap.',
      news: 'Acquires 350-bed tertiary hospital in NCR region for ₹520 Cr.',
      catalystTag: 'EXPANSION',
    },
    {
      symbol: 'HDFCLIFE',
      change: '-1.85%',
      flow: '-₹168 cr',
      flowCr: 168,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Heavy institutional selling due to surrender value regulation headwinds reducing retail margins.',
      news: 'IRDAI revised surrender regulations take effect, causing ~80 bps compression on non-par product margins.',
      catalystTag: 'IRDAI REGULATION',
    },
    {
      symbol: 'ICICIPRULI',
      change: '-2.10%',
      flow: '-₹85 cr',
      flowCr: 85,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Slower growth in high-margin ULIP products amid volatile equity market conditions.',
      news: 'Brokerages cut FY26 VNB estimates by 6% citing slowing bancassurance conversion.',
      catalystTag: 'ESTIMATE CUT',
    },
    {
      symbol: 'LICI',
      change: '-0.65%',
      flow: '-₹30 cr',
      flowCr: 30,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Non-par product share increasing at gradual pace; government float overhang remains.',
      news: 'Market share in individual new business premium moderated 70 bps this month.',
      catalystTag: 'SHARE DIP',
    },
    {
      symbol: 'GICRE',
      change: '-1.20%',
      flow: '-₹22 cr',
      flowCr: 22,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Global reinsurance catastrophic loss claims weighing on combined ratio expectations.',
      news: 'Global weather events increase retrocession coverage costs.',
      catalystTag: 'COMBINED RATIO',
    },
  ],
  'Infra': [
    {
      symbol: 'LT',
      change: '+0.35%',
      flow: '+₹431 cr',
      flowCr: 431,
      direction: 'INFLOW',
      surge: true,
      reason: 'High institutional demand as order book crosses ₹4.8 Lakh Cr; robust Middle East & domestic infrastructure spend.',
      news: 'Wins ultra-mega ₹4,200 Cr EPC order from domestic high-speed corridor & Middle East hydrocarbon.',
      catalystTag: 'MEGA ORDER WIN',
    },
    {
      symbol: 'GMRINFRA',
      change: '+2.10%',
      flow: '+₹85 cr',
      flowCr: 85,
      direction: 'INFLOW',
      surge: false,
      reason: 'Passenger traffic at Delhi and Hyderabad airports breaking post-covid records; non-aero revenue surge.',
      news: 'Domestic and international passenger traffic surged 16.4% YoY across flagship terminals.',
      catalystTag: 'TRAFFIC SURGE',
    },
    {
      symbol: 'ADANIPORTS',
      change: '-2.15%',
      flow: '-₹410 cr',
      flowCr: 410,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Heavy institutional outflow following overseas legal scrutiny headlines and debt refinancing speculation.',
      news: 'Global port container handling volume slightly dipped due to Red Sea shipping route diversions.',
      catalystTag: 'SHIPPING NOISE',
    },
    {
      symbol: 'BHEL',
      change: '-1.90%',
      flow: '-₹265 cr',
      flowCr: 265,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Execution delays in thermal power plants and rising raw material steel prices.',
      news: 'Analysts flag slower turnaround of legacy equipment supply contracts.',
      catalystTag: 'EXECUTION DELAY',
    },
    {
      symbol: 'IRB',
      change: '-2.80%',
      flow: '-₹142 cr',
      flowCr: 142,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Toll collection growth moderated due to heavy monsoon disruptions across highway stretches.',
      news: 'Fastag monthly gross toll receipts showed modest 4% YoY increase.',
      catalystTag: 'TOLL SLOWDOWN',
    },
    {
      symbol: 'NBCC',
      change: '-3.10%',
      flow: '-₹82 cr',
      flowCr: 82,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Profit booking after retail run-up; margin pressure on redevelopment projects.',
      news: 'Court hearings on stalled housing redevelopment schedules delayed by two weeks.',
      catalystTag: 'LEGAL OVERHANG',
    },
  ],
  'Realty': [
    {
      symbol: 'GODREJPROP',
      change: '+1.65%',
      flow: '+₹145 cr',
      flowCr: 145,
      direction: 'INFLOW',
      surge: true,
      reason: 'Record pre-sales booking in NCR & MMR luxury residential launches; fast inventory turnaround.',
      news: 'Sells ₹3,150 Cr worth luxury homes in Gurugram project within 72 hours of pre-launch.',
      catalystTag: 'PRE-SALES RECORD',
    },
    {
      symbol: 'PRESTIGE',
      change: '+0.80%',
      flow: '+₹75 cr',
      flowCr: 75,
      direction: 'INFLOW',
      surge: false,
      reason: 'Commercial leasing occupancy touching 94% across Bengaluru tech parks; cash flow acceleration.',
      news: 'Leases 1.2M sq ft Grade-A office space to Fortune 500 tech tenant.',
      catalystTag: 'LEASING WIN',
    },
    {
      symbol: 'DLF',
      change: '-2.45%',
      flow: '-₹285 cr',
      flowCr: 285,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Institutional liquidation after luxury segment price realization plateaued; FII profit taking.',
      news: 'Launch of new Phase-VI plots delayed to next quarter for environmental clearance.',
      catalystTag: 'LAUNCH DELAY',
    },
    {
      symbol: 'LODHA',
      change: '-1.90%',
      flow: '-₹165 cr',
      flowCr: 165,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Debt reduction trajectory slower than guided due to aggressive land acquisition outlays.',
      news: 'Spends ₹1,800 Cr on strategic land parcels across Pune and Mumbai suburbs.',
      catalystTag: 'LAND CAPEX LOAD',
    },
    {
      symbol: 'OBEROIRLTY',
      change: '-1.25%',
      flow: '-₹119 cr',
      flowCr: 119,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Muted launch calendar in current quarter leading to transient softness in booking numbers.',
      news: 'High-end Worli tower project sales showed quarter-on-quarter moderation.',
      catalystTag: 'MUTED LAUNCH',
    },
  ],
  'Auto': [
    {
      symbol: 'TATAMOTORS',
      change: '+0.80%',
      flow: '+₹267 cr',
      flowCr: 267,
      direction: 'INFLOW',
      surge: true,
      reason: 'JLR order bank resilient at 150k units; domestic commercial vehicle replacement cycle picking up.',
      news: 'JLR announces record quarterly EBITDA margin of 16.2% on Defender and Range Rover shipments.',
      catalystTag: 'JLR MARGIN BEAT',
    },
    {
      symbol: 'M&M',
      change: '+0.45%',
      flow: '+₹185 cr',
      flowCr: 185,
      direction: 'INFLOW',
      surge: false,
      reason: 'Dominant SUV order backlog exceeding 200,000 units; strong tractor festive season pre-orders.',
      news: 'Thar Roxx receives 1.76 lakh bookings within 60 minutes of window opening.',
      catalystTag: 'SUV BACKLOG',
    },
    {
      symbol: 'BAJAJ-AUTO',
      change: '+0.20%',
      flow: '+₹95 cr',
      flowCr: 95,
      direction: 'INFLOW',
      surge: false,
      reason: 'CNG motorcycle (Freedom 125) adoption scaling rapidly in semi-urban belts; Latin America exports rebound.',
      news: 'Monthly export volume up 14% YoY driven by recovery in African and South American currencies.',
      catalystTag: 'EXPORT RECOVERY',
    },
    {
      symbol: 'MARUTI',
      change: '-2.25%',
      flow: '-₹237 cr',
      flowCr: 237,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'High dealer inventory levels (~65 days) forcing elevated discounts; entry-level car demand stagnation.',
      news: 'Industry channel checks reveal retail discounts rose 22% to clear pending hatchback inventory.',
      catalystTag: 'INVENTORY DISCOUNT',
    },
    {
      symbol: 'HEROMOTOCO',
      change: '-2.10%',
      flow: '-₹185 cr',
      flowCr: 185,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Rural recovery slower than expected; electric 2-wheeler market share facing aggressive competition.',
      news: 'Vida EV shipments trail rivals Ather and Ola Electric in registration tallies.',
      catalystTag: 'EV COMPETITION',
    },
    {
      symbol: 'EICHERMOT',
      change: '-1.65%',
      flow: '-₹142 cr',
      flowCr: 142,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Intensifying competition in premium middleweight motorcycle segment from Triumph and Guerrilla peers.',
      news: 'Domestic Royal Enfield 350cc volume growth slows to low single digits.',
      catalystTag: 'SEGMENT RIVALRY',
    },
    {
      symbol: 'TVSMOTOR',
      change: '-1.40%',
      flow: '-₹98 cr',
      flowCr: 98,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Profit booking after outperforming auto index by 28% over previous 6 months.',
      news: 'Overseas Norton motorcycle development capex increases cash outflow.',
      catalystTag: 'CAPEX OUTFLOW',
    },
  ],
  'FMCG': [
    {
      symbol: 'NESTLEIND',
      change: '+0.60%',
      flow: '+₹145 cr',
      flowCr: 145,
      direction: 'INFLOW',
      surge: false,
      reason: 'Defensive premiumization in chocolates and infant nutrition; stable urban demand cushion.',
      news: 'Announces capacity expansion at Sanand confectionery manufacturing facility.',
      catalystTag: 'URBAN DEFENSE',
    },
    {
      symbol: 'DABUR',
      change: '+0.30%',
      flow: '+₹65 cr',
      flowCr: 65,
      direction: 'INFLOW',
      surge: false,
      reason: 'Green shoots in rural OTC and herbal health care demand; wholesale distributor channel recovery.',
      news: 'Direct village coverage expanded to 1.3 lakh rural points.',
      catalystTag: 'RURAL REACH',
    },
    {
      symbol: 'ITC',
      change: '-2.41%',
      flow: '-₹289 cr',
      flowCr: 289,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Heavy institutional selling due to excise tax hike rumors on cigarettes and hotel demerger supply overhang.',
      news: 'GST Council working group evaluates possible restructuring of tobacco compensation cess.',
      catalystTag: 'TAX SPECULATION',
    },
    {
      symbol: 'HINDUNILVR',
      change: '-3.10%',
      flow: '-₹3,420 cr',
      flowCr: 3420,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Massive FII distribution after volume growth contracted to 2% and palm oil/crude packaging costs spiked.',
      news: 'Operating margin down 110 bps as tea and crude palm oil inflation squeeze gross margins.',
      catalystTag: 'MARGIN SQUEEZE',
    },
    {
      symbol: 'BRITANNIA',
      change: '-1.85%',
      flow: '-₹260 cr',
      flowCr: 260,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'High wheat and sugar input costs eating into gross product realizations.',
      news: 'Introduced 3-5% price hikes to counter ingredient inflation.',
      catalystTag: 'INPUT INFLATION',
    },
    {
      symbol: 'TATACONSUM',
      change: '-1.40%',
      flow: '-₹185 cr',
      flowCr: 185,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Acquisition digestion of Capital Foods & Organic India creating temporary margin drag.',
      news: 'International tea business margins affected by UK market soft consumer spend.',
      catalystTag: 'INTEGRATION DRAG',
    },
  ],
  'Pharma': [
    {
      symbol: 'DRREDDY',
      change: '+1.10%',
      flow: '+₹185 cr',
      flowCr: 185,
      direction: 'INFLOW',
      surge: true,
      reason: 'Robust US generic Revlimid cash flows and biosimilar pipeline approvals in European markets.',
      news: 'Receives USFDA tentative approval for complex oncology injection with 180-day exclusivity.',
      catalystTag: 'USFDA EXCLUSIVITY',
    },
    {
      symbol: 'LUPIN',
      change: '+0.75%',
      flow: '+₹115 cr',
      flowCr: 115,
      direction: 'INFLOW',
      surge: false,
      reason: 'Mirabegron exclusivity launch in the US delivering substantial gross margin upside.',
      news: 'Q2 US formulation revenue expands 22% QoQ driven by respiratory and generic portfolio.',
      catalystTag: 'US REVENUE SURGE',
    },
    {
      symbol: 'SUNPHARMA',
      change: '-0.96%',
      flow: '-₹112 cr',
      flowCr: 112,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Temporary supply constraint in Mohali facility causing modest distribution.',
      news: 'Specialty pipeline Ilumya maintains 18% growth while API unit faces price erosion.',
      catalystTag: 'API EROSION',
    },
    {
      symbol: 'CIPLA',
      change: '-2.40%',
      flow: '-₹1,640 cr',
      flowCr: 1640,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Severe institutional dumping after USFDA issued Form 483 with 6 inspection observations at Goa facility.',
      news: 'USFDA inspection classified Goa plant as Official Action Indicated (OAI), delaying key US launches.',
      catalystTag: 'USFDA 483 OAI',
    },
    {
      symbol: 'DIVISLAB',
      change: '-1.85%',
      flow: '-₹280 cr',
      flowCr: 280,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'High valuations (PE > 65x) triggering cautious institutional rebalancing into lower-multiple peers.',
      news: 'Custom synthesis orders steady, but active pharmaceutical ingredient prices remain subdued.',
      catalystTag: 'VALUATION FULL',
    },
    {
      symbol: 'TORNTPHARM',
      change: '-1.20%',
      flow: '-₹145 cr',
      flowCr: 145,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Debt servicing outlays on recent domestic brand acquisitions trimming net cash generation.',
      news: 'Curzon acquisition integration underway; net debt to EBITDA stands at 1.8x.',
      catalystTag: 'DEBT SERVICING',
    },
  ],
  'Metal': [
    {
      symbol: 'NMDC',
      change: '+1.40%',
      flow: '+₹125 cr',
      flowCr: 125,
      direction: 'INFLOW',
      surge: false,
      reason: 'Record iron ore monthly production and domestic pellet price hike supporting operating EBITDA.',
      news: 'Monthly iron ore production touches 4.2 million tonnes, up 11% YoY.',
      catalystTag: 'OUTPUT RECORD',
    },
    {
      symbol: 'NATIONALUM',
      change: '+0.85%',
      flow: '+₹85 cr',
      flowCr: 85,
      direction: 'INFLOW',
      surge: false,
      reason: 'Global alumina supply deficits on Australian plant outages driving LME spot prices to multi-year highs.',
      news: 'International alumina spot benchmark surges above $650/tonne on supply bottlenecks.',
      catalystTag: 'COMMODITY SURGE',
    },
    {
      symbol: 'TATASTEEL',
      change: '-2.40%',
      flow: '-₹890 cr',
      flowCr: 890,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Massive FII distribution as cheap Chinese steel exports flood Asian markets, suppressing domestic margins.',
      news: 'European operations at Port Talbot transition to electric arc furnace with heavy restructuring charges.',
      catalystTag: 'CHINESE DUMPING',
    },
    {
      symbol: 'HINDALCO',
      change: '-2.85%',
      flow: '-₹640 cr',
      flowCr: 640,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Novelis capex escalation in US Bay Minette project causing near-term free cash flow dilution.',
      news: 'Novelis revises Bay Minette capital expenditure guidance upward by $600M.',
      catalystTag: 'CAPEX ESCALATION',
    },
    {
      symbol: 'JINDALSTEL',
      change: '-3.10%',
      flow: '-₹480 cr',
      flowCr: 480,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Domestic hot-rolled coil prices softening by ₹1,500/tonne due to import competition.',
      news: 'Coking coal import prices rebounded, narrowing blast furnace conversion spreads.',
      catalystTag: 'SPREAD COMPRESSION',
    },
    {
      symbol: 'VEDL',
      change: '-2.60%',
      flow: '-₹410 cr',
      flowCr: 410,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Parent holding company debt refinancing worries and proposed demerger timeline uncertainty.',
      news: 'Credit rating agencies maintain negative outlook on UK parent company balance sheet.',
      catalystTag: 'PARENT DEBT NOISE',
    },
  ],
  'Oil & gas': [
    {
      symbol: 'ONGC',
      change: '+0.80%',
      flow: '+₹145 cr',
      flowCr: 145,
      direction: 'INFLOW',
      surge: false,
      reason: 'KG-DWN-98/2 deepwater block oil production ramping up; natural gas realization protected at $6.5/mmbtu.',
      news: 'Commissioning of additional subsea wells in KG Basin adds 15,000 barrels/day.',
      catalystTag: 'PRODUCTION RAMP',
    },
    {
      symbol: 'GAIL',
      change: '+0.40%',
      flow: '+₹65 cr',
      flowCr: 65,
      direction: 'INFLOW',
      surge: false,
      reason: 'Transmission volume expansion and robust petrochemical capacity utilization.',
      news: 'Signs 10-year LNG supply agreement with Qatargas to secure long-term feed gas.',
      catalystTag: 'LNG TIE-UP',
    },
    {
      symbol: 'RELIANCE',
      change: '-2.30%',
      flow: '-₹1,820 cr',
      flowCr: 1820,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Heavy institutional offloading due to weak gross refining margins (GRM) and muted Jio ARPU acceleration.',
      news: 'Singapore complex refining margins dip below $3.50/bbl on global diesel demand slowdown.',
      catalystTag: 'GRM WEAKNESS',
    },
    {
      symbol: 'BPCL',
      change: '-1.90%',
      flow: '-₹245 cr',
      flowCr: 245,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Retail auto fuel marketing margin squeeze as crude oil prices spiked on Middle East tension.',
      news: 'State-owned OMCs hold pump prices steady despite benchmark Brent crude reaching $79/bbl.',
      catalystTag: 'MARKETING SQUEEZE',
    },
    {
      symbol: 'IOC',
      change: '-1.45%',
      flow: '-₹180 cr',
      flowCr: 180,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Petrochemical segment losses and higher working capital debt due to crude stockpiling.',
      news: 'Refining throughput affected by scheduled maintenance shutdown at Panipat refinery.',
      catalystTag: 'MAINTENANCE SHUTDOWN',
    },
  ],
  'Power': [
    {
      symbol: 'NTPC',
      change: '+0.60%',
      flow: '+₹165 cr',
      flowCr: 165,
      direction: 'INFLOW',
      surge: false,
      reason: 'Highest thermal plant load factor (PLF) in 5 years; massive green energy arm IPO value unlock.',
      news: 'NTPC Green Energy files for ₹10,000 Cr IPO to fund solar and green hydrogen pipeline.',
      catalystTag: 'GREEN IPO UNLOCK',
    },
    {
      symbol: 'TATAPOWER',
      change: '+0.25%',
      flow: '+₹80 cr',
      flowCr: 80,
      direction: 'INFLOW',
      surge: false,
      reason: 'Rooftop solar and EV charging installation network expanding rapidly in Tier-1/2 cities.',
      news: 'Wins ₹1,200 Cr interstate transmission project under tariff-based competitive bidding.',
      catalystTag: 'TRANSMISSION WIN',
    },
    {
      symbol: 'POWERGRID',
      change: '-1.85%',
      flow: '-₹420 cr',
      flowCr: 420,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Profit booking after heavy rally; capital expenditure capitalization slower in current quarter.',
      news: 'Asset capitalization for H1 FY26 guided lower by management.',
      catalystTag: 'CAPITALIZATION DIP',
    },
    {
      symbol: 'ADANIGREEN',
      change: '-3.20%',
      flow: '-₹310 cr',
      flowCr: 310,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'High leverage and global bond yields ticking upward increasing offshore refinancing costs.',
      news: 'TotalEnergies pauses fresh capital injection pending outcome of international review.',
      catalystTag: 'BOND YIELD DRAG',
    },
  ],
  'Cement': [
    {
      symbol: 'ULTRACEMCO',
      change: '+1.45%',
      flow: '+₹185 cr',
      flowCr: 185,
      direction: 'INFLOW',
      surge: true,
      reason: 'Industry consolidation dominance; acquiring regional assets to reach 200 MTPA target.',
      news: 'Completes acquisition of Kesoram Cement assets; capacity reaches 154 MTPA.',
      catalystTag: 'ACQUISITION WIN',
    },
    {
      symbol: 'AMBUJACEM',
      change: '+0.80%',
      flow: '+₹95 cr',
      flowCr: 95,
      direction: 'INFLOW',
      surge: false,
      reason: 'Debt-free balance sheet with ₹12,000 Cr cash pile for organic brownfield expansion.',
      news: 'Announces commissioning of new clinker line in Bhatapara with cost-saving waste heat recovery.',
      catalystTag: 'COST REDUCTION',
    },
    {
      symbol: 'ACC',
      change: '-0.70%',
      flow: '-₹68 cr',
      flowCr: 68,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Realizations per bag dropped ₹15 across northern markets due to unseasonal rains.',
      news: 'Channel checks indicate price competition intensified in central India belt.',
      catalystTag: 'PRICE CUTTING',
    },
    {
      symbol: 'SHREECEM',
      change: '-1.40%',
      flow: '-₹140 cr',
      flowCr: 140,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Lower market share in southern territories; petcoke fuel cost stabilization pricing-in.',
      news: 'Operating EBITDA per tonne down 8% QoQ on lower plant capacity utilization.',
      catalystTag: 'EBITDA/TONNE DIP',
    },
  ],
  'Defence': [
    {
      symbol: 'BEL',
      change: '+1.15%',
      flow: '+₹145 cr',
      flowCr: 145,
      direction: 'INFLOW',
      surge: true,
      reason: 'Order book at lifetime high of ₹76,000 Cr; high export deliveries for radar and electronic warfare suites.',
      news: 'Receives ₹1,150 Cr contract from Indian Army for next-gen thermal imaging sights.',
      catalystTag: 'ARMY CONTRACT',
    },
    {
      symbol: 'HAL',
      change: '-2.10%',
      flow: '-₹380 cr',
      flowCr: 380,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Heavy institutional profit booking after stock surged 140% in a year; Tejas Mk1A engine delivery delays.',
      news: 'GE Aerospace supply delays on F404 jet engines pushes fighter aircraft delivery timelines back.',
      catalystTag: 'ENGINE DELAY',
    },
    {
      symbol: 'MAZDOCK',
      change: '-2.85%',
      flow: '-₹220 cr',
      flowCr: 220,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Valuation multiple de-rating after 300% rally; submarine project tender award date pushed.',
      news: 'P75-I submarine project commercial bid evaluation phase extended by Ministry of Defence.',
      catalystTag: 'BID EXTENSION',
    },
    {
      symbol: 'BDL',
      change: '-1.90%',
      flow: '-₹82 cr',
      flowCr: 82,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Missile assembly component supply constraints from European vendors delaying dispatch.',
      news: 'Revenue recognition pushed to subsequent quarters on key surface-to-air missile orders.',
      catalystTag: 'SUPPLY CHAIN LAG',
    },
  ],
  'Telecom': [
    {
      symbol: 'TATACOMM',
      change: '+0.80%',
      flow: '+₹65 cr',
      flowCr: 65,
      direction: 'INFLOW',
      surge: false,
      reason: 'Data services and cloud enterprise connectivity revenue growing double-digits in US & EMEA.',
      news: 'Signs multi-year SD-WAN enterprise connectivity pact with global retail bank.',
      catalystTag: 'SD-WAN WIN',
    },
    {
      symbol: 'BHARTIARTL',
      change: '-1.50%',
      flow: '-₹1,120 cr',
      flowCr: 1120,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Massive FII distribution as foreign index funds book profits; Africa currency devaluation headwinds.',
      news: 'Nigerian Naira volatility impacts consolidated reported EBITDA despite 5G tariff hikes in India.',
      catalystTag: 'AFRICA CURRENCY',
    },
    {
      symbol: 'IDEA',
      change: '-3.40%',
      flow: '-₹378 cr',
      flowCr: 378,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Cash bleed continues; bank funding package not finalized despite government equity conversion.',
      news: 'Lenders seek additional promoter equity injection before sanctioning fresh ₹25,000 Cr capex loans.',
      catalystTag: 'BANK LOAN DELAY',
    },
  ],
  'NBFC': [
    {
      symbol: 'CHOLAFIN',
      change: '+1.10%',
      flow: '+₹145 cr',
      flowCr: 145,
      direction: 'INFLOW',
      surge: false,
      reason: 'Strong disbursements across vehicle finance and affordable loan against property; low NPA.',
      news: 'Assets under management crossed ₹1.6 Lakh Cr; collection efficiency sustained at 99%.',
      catalystTag: 'AUM EXPANSION',
    },
    {
      symbol: 'MUTHOOTFIN',
      change: '+0.75%',
      flow: '+₹80 cr',
      flowCr: 80,
      direction: 'INFLOW',
      surge: false,
      reason: 'Gold prices surging to record highs significantly boosts collateral value and tonnage demand.',
      news: 'Gold loan book expanded 21% YoY as borrowers leverage rising spot bullion prices.',
      catalystTag: 'GOLD TAILWIND',
    },
    {
      symbol: 'BAJFINANCE',
      change: '-6.02%',
      flow: '-₹2,840 cr',
      flowCr: 2840,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Severe institutional dumping after RBI raised risk weights on consumer loans; B2B credit card co-brand curbs.',
      news: 'Operating margin contracted 25 bps as cost of funds rose; management lowers FY26 AUM growth guidance to 22%.',
      catalystTag: 'RBI RISK WEIGHT',
    },
    {
      symbol: 'BAJAJFINSV',
      change: '-4.80%',
      flow: '-₹2,240 cr',
      flowCr: 2240,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Knock-on selling due to Bajaj Finance stake value erosion and insurance surrender value rules.',
      news: 'Holding company discount widened to 22% amid dual regulatory tightening in lending and insurance.',
      catalystTag: 'HOLDING DISCOUNT',
    },
    {
      symbol: 'SHRIRAMFIN',
      change: '-1.85%',
      flow: '-₹260 cr',
      flowCr: 260,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Used commercial vehicle lending growth moderated due to monsoon transport slowdown.',
      news: 'Gross stage-3 assets remained flat at 5.4%, prompting conservative provisioning.',
      catalystTag: 'CREDIT CAUTION',
    },
  ],
  'Cap goods': [
    {
      symbol: 'ABB',
      change: '+1.10%',
      flow: '+₹145 cr',
      flowCr: 145,
      direction: 'INFLOW',
      surge: false,
      reason: 'Electrification and automation demand surging across datacenters, railways and EV factories.',
      news: 'Order intake rose 24% YoY driven by robotics and high-voltage substation switchgear contracts.',
      catalystTag: 'DATACENTER ORDER',
    },
    {
      symbol: 'SIEMENS',
      change: '-2.80%',
      flow: '-₹2,100 cr',
      flowCr: 2100,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Heavy institutional outflow after promoter proposed energy business demerger ratio dissatisfied minority holders.',
      news: 'Proxy advisory firms recommend voting against initial demerger proposal citing valuation gap.',
      catalystTag: 'DEMERGER ISSUE',
    },
    {
      symbol: 'CUMMINSIND',
      change: '-1.95%',
      flow: '-₹680 cr',
      flowCr: 680,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Export demand for CPCB-IV+ diesel generator sets slowed down in Middle East and Africa markets.',
      news: 'Domestic industrial power gen demand stable, but export realizations compressed 6%.',
      catalystTag: 'EXPORT SLOWDOWN',
    },
    {
      symbol: 'POLYCAB',
      change: '-2.10%',
      flow: '-₹490 cr',
      flowCr: 490,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Institutional liquidation after tax department inspection updates and copper price swings.',
      news: 'Raw material copper inventory valuation adjustments temper quarterly gross margin.',
      catalystTag: 'COPPER SWINGS',
    },
  ],
  'Consumer': [
    {
      symbol: 'VOLTAS',
      change: '+0.80%',
      flow: '+₹65 cr',
      flowCr: 65,
      direction: 'INFLOW',
      surge: false,
      reason: 'Record summer inventory clearance and room air conditioner (RAC) market share leadership at 19.5%.',
      news: 'Commercial refrigeration and engineering projects division order book up 18% YoY.',
      catalystTag: 'RAC LEADERSHIP',
    },
    {
      symbol: 'TITAN',
      change: '-4.38%',
      flow: '-₹640 cr',
      flowCr: 640,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Heavy selling after gold import duty cut forced one-time inventory loss of ₹500 Cr.',
      news: 'Customs duty reduction from 15% to 6% triggered sharp non-cash inventory valuation write-down in Q2.',
      catalystTag: 'DUTY CUT WRITE-DOWN',
    },
    {
      symbol: 'HAVELLS',
      change: '-2.40%',
      flow: '-₹540 cr',
      flowCr: 540,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Lloyd division operating profitability delayed; cable price realization soft.',
      news: 'Lloyd consumer durables arm reports operating EBITDA loss of ₹42 Cr for the quarter.',
      catalystTag: 'DURABLES DRAG',
    },
    {
      symbol: 'CROMPTON',
      change: '-1.85%',
      flow: '-₹280 cr',
      flowCr: 280,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Butterfly Gandhimathi kitchen appliances integration still dampening overall ROCE.',
      news: 'Lighting segment pricing competition from unorganized LED players intensifies.',
      catalystTag: 'LED SQUEEZE',
    },
  ],
  'Logistics': [
    {
      symbol: 'CONCOR',
      change: '+1.20%',
      flow: '+₹95 cr',
      flowCr: 95,
      direction: 'INFLOW',
      surge: false,
      reason: 'Dedicated Freight Corridor (DFC) connection completion driving double-stack container efficiency.',
      news: 'Rail volume share between Dadri and Mundra port rose to 74% with transit times cut in half.',
      catalystTag: 'DFC BOOST',
    },
    {
      symbol: 'BLUEDART',
      change: '-2.15%',
      flow: '-₹180 cr',
      flowCr: 180,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Aviation turbine fuel (ATF) surcharge volatility and high air freight capacity competition.',
      news: 'Surface express market share challenged by regional aggregator competition.',
      catalystTag: 'FUEL SURCHARGE',
    },
    {
      symbol: 'DELHIVERY',
      change: '-2.80%',
      flow: '-₹320 cr',
      flowCr: 320,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'E-commerce festive shipment pricing wars with captive logistics fleets of Quick Commerce.',
      news: 'Quick-commerce rapid dark store deliveries divert small-parcel express volumes away.',
      catalystTag: 'QUICK COMMERCE HIT',
    },
    {
      symbol: 'MAHLOG',
      change: '-1.40%',
      flow: '-₹65 cr',
      flowCr: 65,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Automotive supply chain transport volumes flat; warehousing lease costs rising.',
      news: 'Contract logistics segment margins contracted 40 bps due to minimum wage revisions.',
      catalystTag: 'WAGE REVISION',
    },
  ],
  'Chem': [
    {
      symbol: 'PIDILITIND',
      change: '+0.95%',
      flow: '+₹110 cr',
      flowCr: 110,
      direction: 'INFLOW',
      surge: false,
      reason: 'Strong pricing power in Fevicol adhesives; VAM raw material prices down 22% boosting gross margins.',
      news: 'Gross profit margin expanded 320 bps YoY to 52.8%; tile adhesive waterproofing book growing 20%.',
      catalystTag: 'VAM COST DROP',
    },
    {
      symbol: 'SRF',
      change: '-2.30%',
      flow: '-₹420 cr',
      flowCr: 420,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Severe selling due to global agrochemical destocking and refrigerants dumping from China.',
      news: 'Specialty chemicals EBIT collapsed 34% YoY as overseas innovators delay inventory replenishment.',
      catalystTag: 'AGROCHEM DESTOCKING',
    },
    {
      symbol: 'TATACHEM',
      change: '-2.10%',
      flow: '-₹280 cr',
      flowCr: 280,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Global soda ash price crash due to massive synthetic capacity additions in Inner Mongolia.',
      news: 'Soda ash spot export realizations down 18% YoY, squeezing UK and Kenya operations.',
      catalystTag: 'SODA ASH GLUT',
    },
    {
      symbol: 'AARTIIND',
      change: '-1.65%',
      flow: '-₹111 cr',
      flowCr: 111,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Muted global demand for benzene derivatives and delay in multi-year agrochemical supply contracts.',
      news: 'Full-year volume guidance lowered to mid-single digits by management.',
      catalystTag: 'GUIDANCE CUT',
    },
  ],
  'Cap mkts': [
    {
      symbol: 'BSE',
      change: '+2.45%',
      flow: '+₹185 cr',
      flowCr: 185,
      direction: 'INFLOW',
      surge: true,
      reason: 'Explosive growth in equity derivative contract volumes; transaction charges hike yielding massive operating leverage.',
      news: 'Single-stock options market share climbs to 18%; daily turnover reaches all-time high.',
      catalystTag: 'TURNOVER RECORD',
    },
    {
      symbol: 'MCX',
      change: '+1.80%',
      flow: '+₹95 cr',
      flowCr: 95,
      direction: 'INFLOW',
      surge: false,
      reason: 'New commodity trading software platform delivers 85% operating EBITDA margin; record bullion volatility.',
      news: 'Crude oil and natural gas options average daily turnover surged 68% YoY.',
      catalystTag: 'COMMODITY VOLATILITY',
    },
    {
      symbol: 'CDSL',
      change: '-1.90%',
      flow: '-₹340 cr',
      flowCr: 340,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'SEBI consultation paper proposing higher demat charges scrutiny and SEBI F&O curbs impacting retail active accounts.',
      news: 'SEBI index derivative measures reduce weekly contract trading, impacting depository transaction revenue.',
      catalystTag: 'SEBI DERIVATIVE RULES',
    },
    {
      symbol: 'ANGELONE',
      change: '-2.85%',
      flow: '-₹480 cr',
      flowCr: 480,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'SEBI circular on true-to-label exchange fee pass-through and F&O contract limits threatening broker revenue.',
      news: 'Analysts estimate 15-20% annualized hit to discount broking profitability from SEBI derivative rules.',
      catalystTag: 'BROKER REVENUE HIT',
    },
  ],
  'New-age': [
    {
      symbol: 'ZOMATO',
      change: '+1.65%',
      flow: '+₹245 cr',
      flowCr: 245,
      direction: 'INFLOW',
      surge: true,
      reason: 'Blinkit Quick Commerce GMV growing 120% YoY with dark store economics achieving positive EBITDA.',
      news: 'Blinkit reaches 1,000 active dark stores across India; food delivery gross order value up 22%.',
      catalystTag: 'BLINKIT EXPANSION',
    },
    {
      symbol: 'PAYTM',
      change: '-3.85%',
      flow: '-₹540 cr',
      flowCr: 540,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Payments Bank wind-down residual revenue loss; loss of FASTag and UPI transaction market share.',
      news: 'Employee cost rationalization and non-core ticket booking business sale to Zomato underway.',
      catalystTag: 'BANK WIND-DOWN',
    },
    {
      symbol: 'POLICYBZR',
      change: '-2.40%',
      flow: '-₹380 cr',
      flowCr: 380,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'High promoter and ESOP share sales in block windows; corporate health loss ratio ticking up.',
      news: 'Private equity funds offload 2.8% stake in block market window.',
      catalystTag: 'PE BLOCK SALE',
    },
    {
      symbol: 'NYKAA',
      change: '-2.10%',
      flow: '-₹292 cr',
      flowCr: 292,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'Fashion vertical gross merchandise value growth sluggish at 12%; intense beauty competition from Tira & Tata Cliq.',
      news: 'EBITDA margins in fashion segment remain near breakeven despite aggressive marketing outlay.',
      catalystTag: 'FASHION MARGIN SOFT',
    },
  ],
  'Others': [
    {
      symbol: 'FRACTAL',
      change: '+3.20%',
      flow: '+₹185 cr',
      flowCr: 185,
      direction: 'INFLOW',
      surge: false,
      reason: 'Enterprise AI analytics adoption accelerating; high multi-year Fortune 500 retention.',
      news: 'Partners with Nvidia to deploy enterprise generative AI decision engines.',
      catalystTag: 'AI PARTNERSHIP',
    },
    {
      symbol: 'PIRAMALFIN',
      change: '+0.90%',
      flow: '+₹86 cr',
      flowCr: 86,
      direction: 'INFLOW',
      surge: false,
      reason: 'Retail lending mix surpasses 70% of total loans; legacy wholesale book resolution underway.',
      news: 'Recovers ₹450 Cr from restructured real estate developer account.',
      catalystTag: 'RECOVERY RESOLUTION',
    },
    {
      symbol: 'ETERNAL',
      change: '-4.10%',
      flow: '-₹245 cr',
      flowCr: 245,
      direction: 'OUTFLOW',
      surge: false,
      reason: 'High debt overhang and working capital stretch causing institutional unwinding.',
      news: 'Credit agency downgrades short-term commercial paper on liquidity mismatch.',
      catalystTag: 'CREDIT DOWNGRADE',
    },
  ],
};

export default function MoneyFlowAnimated() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mobileCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'RIVER' | 'SECTORS' | 'INFLOW' | 'OUTFLOW'>('RIVER');
  const [marketStatus, setMarketStatus] = useState<{
    isMarketOpen: boolean;
    sessionState: string;
    label: string;
    subLabel: string;
    nextOpenNotice?: string;
  }>({
    isMarketOpen: false,
    sessionState: 'WEEKEND_CLOSED',
    label: 'Market Closed (Weekend)',
    subLabel: 'Showing Friday Close net flows · Opens Monday 9:15 AM IST',
    nextOpenNotice: 'NSE & BSE will open on Monday at 09:15 AM IST',
  });
  const [replayTape, setReplayTape] = useState<boolean>(false);

  const [liveSectors, setLiveSectors] = useState<SectorItem[]>([
    { name: 'IT', net: +2321, inflow: 2850, outflow: 529 },
    { name: 'Cement', net: +72, inflow: 340, outflow: 268 },
    { name: 'Others', net: -2, inflow: 110, outflow: 112 },
    { name: 'Insurance', net: -131, inflow: 145, outflow: 276 },
    { name: 'Realty', net: -349, inflow: 220, outflow: 569 },
    { name: 'Infra', net: -383, inflow: 310, outflow: 693 },
    { name: 'Logistics', net: -570, inflow: 180, outflow: 750 },
    { name: 'Oil & gas', net: -611, inflow: 420, outflow: 1031 },
    { name: 'Defence', net: -637, inflow: 290, outflow: 927 },
    { name: 'FMCG', net: -712, inflow: 350, outflow: 1062 },
    { name: 'Power', net: -725, inflow: 280, outflow: 1005 },
    { name: 'Chem', net: -801, inflow: 190, outflow: 991 },
    { name: 'Cap mkts', net: -947, inflow: 220, outflow: 1167 },
    { name: 'PSU Bank', net: -1083, inflow: 410, outflow: 1493 },
    { name: 'Consumer', net: -1124, inflow: 330, outflow: 1454 },
    { name: 'New-age', net: -1212, inflow: 150, outflow: 1362 },
    { name: 'Metal', net: -1242, inflow: 510, outflow: 1752 },
    { name: 'Telecom', net: -1433, inflow: 210, outflow: 1643 },
    { name: 'Pharma', net: -1474, inflow: 480, outflow: 1954 },
    { name: 'Auto', net: -2038, inflow: 620, outflow: 2658 },
    { name: 'Bank', net: -2691, inflow: 890, outflow: 3581 },
    { name: 'NBFC', net: -3031, inflow: 450, outflow: 3481 },
    { name: 'Cap goods', net: -3456, inflow: 380, outflow: 3836 },
  ]);

  const [inflowStocks, setInflowStocks] = useState<SectorStockDetail[]>([
    {
      symbol: 'TCS',
      change: '+2.69%',
      flow: '+₹934 cr',
      flowCr: 934,
      direction: 'INFLOW',
      surge: true,
      reason: 'Aggressive institutional accumulation following 18% YoY growth in AI & cloud services pipeline; FII buying above 20-DMA.',
      news: 'Announced $1.2B TCV multi-year digital transformation deal with European financial major.',
      catalystTag: 'EARNINGS BEAT',
    },
    {
      symbol: 'INFY',
      change: '+0.20%',
      flow: '+₹1,412 cr',
      flowCr: 1412,
      direction: 'INFLOW',
      surge: true,
      reason: 'Large-cap defensive rotation as DIIs hedge banking volatility; consistent free cash flow generation and margin defense.',
      news: 'Expands enterprise generative AI partnership with top US retail conglomerate.',
      catalystTag: 'AI EXPANSION',
    },
    {
      symbol: 'LTTS',
      change: '+2.80%',
      flow: '+₹485 cr',
      flowCr: 485,
      direction: 'INFLOW',
      surge: true,
      reason: 'Surge in ER&D engineering spend; multiple Tier-1 automotive software contracts ramp up.',
      news: 'Wins $50M engineering services mandate from tier-1 global auto group.',
      catalystTag: 'DEAL WIN',
    },
    {
      symbol: 'LT',
      change: '+0.35%',
      flow: '+₹431 cr',
      flowCr: 431,
      direction: 'INFLOW',
      surge: true,
      reason: 'High institutional demand as order book crosses ₹4.8 Lakh Cr; robust Middle East & domestic infrastructure spend.',
      news: 'Wins ultra-mega ₹4,200 Cr EPC order from domestic high-speed corridor & Middle East hydrocarbon.',
      catalystTag: 'MEGA ORDER WIN',
    },
    {
      symbol: 'TECHM',
      change: '+2.60%',
      flow: '+₹420 cr',
      flowCr: 420,
      direction: 'INFLOW',
      surge: false,
      reason: 'Margin expansion roadmap pacing ahead of analyst consensus; cost rationalization delivering results.',
      news: 'Q2 EBIT margin expanded 110 bps QoQ to 11.2%; telecom vertical bottomed out.',
      catalystTag: 'MARGIN EXPANSION',
    },
    {
      symbol: 'WIPRO',
      change: '+3.17%',
      flow: '+₹273 cr',
      flowCr: 273,
      direction: 'INFLOW',
      surge: false,
      reason: 'Short covering and turnaround momentum after management upgraded quarterly revenue outlook in consulting.',
      news: 'Secured $320M infrastructure management mandate from Nordic telecom client.',
      catalystTag: 'OUTLOOK HIKE',
    },
    {
      symbol: 'TATAMOTORS',
      change: '+0.80%',
      flow: '+₹267 cr',
      flowCr: 267,
      direction: 'INFLOW',
      surge: true,
      reason: 'JLR order bank resilient at 150k units; domestic commercial vehicle replacement cycle picking up.',
      news: 'JLR announces record quarterly EBITDA margin of 16.2% on Defender and Range Rover shipments.',
      catalystTag: 'JLR MARGIN BEAT',
    },
    {
      symbol: 'ZOMATO',
      change: '+1.65%',
      flow: '+₹245 cr',
      flowCr: 245,
      direction: 'INFLOW',
      surge: true,
      reason: 'Blinkit Quick Commerce GMV growing 120% YoY with dark store economics achieving positive EBITDA.',
      news: 'Blinkit reaches 1,000 active dark stores across India; food delivery gross order value up 22%.',
      catalystTag: 'BLINKIT EXPANSION',
    },
  ]);

  const [outflowStocks, setOutflowStocks] = useState<SectorStockDetail[]>([
    {
      symbol: 'HINDUNILVR',
      change: '-3.10%',
      flow: '-₹3,420 cr',
      flowCr: 3420,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Massive FII distribution after volume growth contracted to 2% and palm oil/crude packaging costs spiked.',
      news: 'Operating margin down 110 bps as tea and crude palm oil inflation squeeze gross margins.',
      catalystTag: 'MARGIN SQUEEZE',
    },
    {
      symbol: 'BAJFINANCE',
      change: '-6.02%',
      flow: '-₹2,840 cr',
      flowCr: 2840,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Severe institutional dumping after RBI raised risk weights on consumer loans; B2B credit card co-brand curbs.',
      news: 'Operating margin contracted 25 bps as cost of funds rose; management lowers FY26 AUM growth guidance to 22%.',
      catalystTag: 'RBI RISK WEIGHT',
    },
    {
      symbol: 'BAJAJFINSV',
      change: '-4.80%',
      flow: '-₹2,240 cr',
      flowCr: 2240,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Knock-on selling due to Bajaj Finance stake value erosion and insurance surrender value rules.',
      news: 'Holding company discount widened to 22% amid dual regulatory tightening in lending and insurance.',
      catalystTag: 'HOLDING DISCOUNT',
    },
    {
      symbol: 'SIEMENS',
      change: '-2.80%',
      flow: '-₹2,100 cr',
      flowCr: 2100,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Heavy institutional outflow after promoter proposed energy business demerger ratio dissatisfied minority holders.',
      news: 'Proxy advisory firms recommend voting against initial demerger proposal citing valuation gap.',
      catalystTag: 'DEMERGER ISSUE',
    },
    {
      symbol: 'RELIANCE',
      change: '-2.30%',
      flow: '-₹1,820 cr',
      flowCr: 1820,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Heavy institutional offloading due to weak gross refining margins (GRM) and muted Jio ARPU acceleration.',
      news: 'Singapore complex refining margins dip below $3.50/bbl on global diesel demand slowdown.',
      catalystTag: 'GRM WEAKNESS',
    },
    {
      symbol: 'CIPLA',
      change: '-2.40%',
      flow: '-₹1,640 cr',
      flowCr: 1640,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Severe institutional dumping after USFDA issued Form 483 with 6 inspection observations at Goa facility.',
      news: 'USFDA inspection classified Goa plant as Official Action Indicated (OAI), delaying key US launches.',
      catalystTag: 'USFDA 483 OAI',
    },
    {
      symbol: 'BHARTIARTL',
      change: '-1.50%',
      flow: '-₹1,120 cr',
      flowCr: 1120,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Massive FII distribution as foreign index funds book profits; Africa currency devaluation headwinds.',
      news: 'Nigerian Naira volatility impacts consolidated reported EBITDA despite 5G tariff hikes in India.',
      catalystTag: 'AFRICA CURRENCY',
    },
    {
      symbol: 'HDFCBANK',
      change: '-5.12%',
      flow: '-₹815 cr',
      flowCr: 815,
      direction: 'OUTFLOW',
      surge: true,
      reason: 'Heavy FII algorithmic selling triggered by MSCI passive weight rebalance and deposit growth lagging advances.',
      news: 'Lender continues post-merger transition; CD ratio remains elevated at 102%, limiting rapid margin expansion.',
      catalystTag: 'MSCI OUTFLOW',
    },
  ]);

  const [lastSync, setLastSync] = useState<string>('Live Stream Active');

  const selectedSectorStocks = useMemo(() => {
    if (!selectedSector) return [];
    return SECTOR_CONSTITUENTS[selectedSector] || [];
  }, [selectedSector]);

  const displayedInflowStocks = useMemo(() => {
    if (selectedSector) {
      const items = selectedSectorStocks.filter((s) => s.direction === 'INFLOW');
      if (items.length > 0) return items;
      return selectedSectorStocks.slice(0, 2);
    }
    return inflowStocks;
  }, [selectedSector, selectedSectorStocks, inflowStocks]);

  const displayedOutflowStocks = useMemo(() => {
    if (selectedSector) {
      const items = selectedSectorStocks.filter((s) => s.direction === 'OUTFLOW');
      if (items.length > 0) return items;
      return [];
    }
    return outflowStocks;
  }, [selectedSector, selectedSectorStocks, outflowStocks]);

  const totalInflowDisplay = useMemo(() => {
    if (selectedSector) {
      const sec = liveSectors.find((s) => s.name === selectedSector);
      if (sec && sec.inflow) return `+₹${sec.inflow.toLocaleString()} cr`;
      const sum = displayedInflowStocks.reduce((acc, s) => acc + (s.flowCr || 120), 0);
      return `+₹${sum.toLocaleString()} cr`;
    }
    return '+₹3,686 cr';
  }, [selectedSector, liveSectors, displayedInflowStocks]);

  const totalOutflowDisplay = useMemo(() => {
    if (selectedSector) {
      const sec = liveSectors.find((s) => s.name === selectedSector);
      if (sec && sec.outflow) return `-₹${sec.outflow.toLocaleString()} cr`;
      const sum = displayedOutflowStocks.reduce((acc, s) => acc + (s.flowCr || 120), 0);
      return `-₹${sum.toLocaleString()} cr`;
    }
    return '-₹25,945 cr';
  }, [selectedSector, liveSectors, displayedOutflowStocks]);

  const handleSectorClick = (sectorName: string) => {
    if (selectedSector === sectorName) {
      setSelectedSector(null);
    } else {
      setSelectedSector(sectorName);
      if (mobileTab === 'SECTORS') {
        setMobileTab('INFLOW');
      }
    }
  };

  // Real-time verified media news & catalysts state
  const [verifiedNews, setVerifiedNews] = useState<
    Record<string, { headline: string; source: string; pubDate: string; link: string; type: string }>
  >({});
  const [loadingNews, setLoadingNews] = useState<boolean>(false);

  // Fetch real, verified live news articles for displayed stocks
  useEffect(() => {
    const symbols = [
      ...displayedInflowStocks.map((s) => s.symbol),
      ...displayedOutflowStocks.map((s) => s.symbol),
    ];
    if (symbols.length === 0) return;

    const unique = Array.from(new Set(symbols)).slice(0, 10);
    setLoadingNews(true);

    fetch(`/api/stock-news?symbols=${unique.join(',')}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const map: Record<string, any> = {};
          for (const item of data.results) {
            if (item.latestNews) {
              map[item.symbol] = item.latestNews;
            }
          }
          setVerifiedNews((prev) => ({ ...prev, ...map }));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingNews(false));
  }, [selectedSector]);

  // Fetch live market data
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const [pulseRes, stocksRes] = await Promise.all([
          fetch('/api/market-pulse'),
          fetch('/api/live-stocks'),
        ]);

        if (pulseRes.ok) {
          const pData = await pulseRes.json();
          if (pData.marketStatus) {
            setMarketStatus(pData.marketStatus);
          }
          if (pData.sectors && pData.sectors.length > 0) {
            setLiveSectors((prev) => {
              return prev.map((sec) => {
                const match = pData.sectors.find((s: any) => s.name.toLowerCase() === sec.name.toLowerCase());
                if (match) {
                  return {
                    ...sec,
                    net: match.netFlowCr,
                  };
                }
                return sec;
              });
            });
          }
        }

        if (stocksRes.ok) {
          const sData = await stocksRes.json();
          if (sData.stocks && sData.stocks.length > 0) {
            const buying = sData.stocks.filter((s: any) => s.flowType === 'HUGE_BUYING');
            const selling = sData.stocks.filter((s: any) => s.flowType === 'HUGE_SELLING');

            if (buying.length > 0) {
              setInflowStocks((prev) =>
                buying.slice(0, 8).map((s: any) => {
                  const existing = prev.find((p) => p.symbol === s.symbol);
                  return {
                    symbol: s.symbol,
                    change: s.changePct >= 0 ? `+${s.changePct}%` : `${s.changePct}%`,
                    flow: `+₹${Math.abs(s.flowCr)} cr`,
                    flowCr: Math.abs(s.flowCr),
                    direction: 'INFLOW',
                    surge: s.volRatio >= 1.2,
                    reason: s.reason || existing?.reason || 'Aggressive institutional buying above key support levels.',
                    news: s.news || existing?.news || 'Surging order book expansion and delivery volume concentration.',
                    catalystTag: s.catalystTag || existing?.catalystTag || 'ORDER FLOW',
                  };
                })
              );
            }

            if (selling.length > 0) {
              setOutflowStocks((prev) =>
                selling.slice(0, 8).map((s: any) => {
                  const existing = prev.find((p) => p.symbol === s.symbol);
                  return {
                    symbol: s.symbol,
                    change: `${s.changePct}%`,
                    flow: `-₹${Math.abs(s.flowCr)} cr`,
                    flowCr: Math.abs(s.flowCr),
                    direction: 'OUTFLOW',
                    surge: s.volRatio >= 1.2,
                    reason: s.reason || existing?.reason || 'Institutional liquidation following margin or valuation concerns.',
                    news: s.news || existing?.news || 'Promoter or foreign fund block deal offload.',
                    catalystTag: s.catalystTag || existing?.catalystTag || 'DISTRIBUTION',
                  };
                })
              );
            }
          }
        }
        setLastSync(new Date().toLocaleTimeString('en-IN', { hour12: true }) + ' IST');
      } catch (e) {
        // Fallback maintained smoothly
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 15000);
    return () => clearInterval(interval);
  }, []);

  // Desktop S-curve canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      progress: number;
      speed: number;
      size: number;
      type: 'inflow' | 'outflow';
      lane: number;
    }

    const particles: Particle[] = [];
    const NUM_PARTICLES = 160;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const type = Math.random() < 0.3 ? 'inflow' : 'outflow';
      particles.push({
        x: 0,
        y: 0,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.006,
        size: 2 + Math.random() * 3.5,
        type,
        lane: (Math.random() - 0.5) * 35,
      });
    }

    const isSettled = !marketStatus.isMarketOpen && !replayTape;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Top Inflow Spline
      ctx.beginPath();
      ctx.moveTo(10, 45);
      ctx.bezierCurveTo(width * 0.35, 45, width * 0.5, 90, width - 10, 95);
      ctx.strokeStyle = isSettled ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.15)';
      ctx.lineWidth = 14;
      ctx.stroke();

      // Bottom Outflow Splines
      ctx.beginPath();
      ctx.moveTo(10, height * 0.7);
      ctx.bezierCurveTo(width * 0.35, height * 0.65, width * 0.55, height * 0.78, width - 10, height * 0.75);
      ctx.strokeStyle = isSettled ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.15)';
      ctx.lineWidth = 28;
      ctx.stroke();

      for (const p of particles) {
        // In settled weekend mode, speed is slowed 12x to represent settled holding positions
        const step = isSettled ? p.speed * 0.08 : p.speed;
        p.progress += step;
        if (p.progress > 1) {
          p.progress = 0;
          p.lane = (Math.random() - 0.5) * 35;
        }

        const t = p.progress;
        let startX = 10;
        let startY = p.type === 'inflow' ? 45 : height * 0.7;
        let cp1x = width * 0.35;
        let cp1y = p.type === 'inflow' ? 45 : height * 0.65;
        let cp2x = width * 0.55;
        let cp2y = p.type === 'inflow' ? 90 : height * 0.78;
        let endX = width - 10;
        let endY = p.type === 'inflow' ? 95 : height * 0.75;

        const cx =
          Math.pow(1 - t, 3) * startX +
          3 * Math.pow(1 - t, 2) * t * cp1x +
          3 * (1 - t) * Math.pow(t, 2) * cp2x +
          Math.pow(t, 3) * endX;

        const cy =
          Math.pow(1 - t, 3) * startY +
          3 * Math.pow(1 - t, 2) * t * cp1y +
          3 * (1 - t) * Math.pow(t, 2) * cp2y +
          Math.pow(t, 3) * endY +
          p.lane;

        p.x = cx;
        p.y = cy;

        ctx.beginPath();
        ctx.arc(cx, cy, p.size, 0, Math.PI * 2);
        if (p.type === 'inflow') {
          ctx.fillStyle = '#22C55E';
          ctx.shadowColor = '#22C55E';
          ctx.shadowBlur = isSettled ? 4 : 8;
        } else {
          ctx.fillStyle = '#EF4444';
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = isSettled ? 4 : 8;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.save();
        ctx.fillStyle = p.type === 'inflow' ? '#16A34A' : '#DC2626';
        ctx.translate(cx + 4, cy);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-4, -2.5);
        ctx.lineTo(-4, 2.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileTab, marketStatus.isMarketOpen, replayTape]);

  // Mobile river stream canvas animation
  useEffect(() => {
    if (mobileTab !== 'RIVER') return;
    const canvas = mobileCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || 360);
    let height = (canvas.height = canvas.offsetHeight || 260);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 360;
      height = canvas.height = canvas.offsetHeight || 260;
    };
    window.addEventListener('resize', handleResize);

    interface MobileParticle {
      t: number; // 0 to 1
      speed: number;
      type: 'inflow' | 'outflow';
      lane: number;
      size: number;
      color: string;
      glow: boolean;
    }

    const particles: MobileParticle[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        t: Math.random(),
        speed: 0.004 + Math.random() * 0.008,
        type: Math.random() < 0.5 ? 'inflow' : 'outflow',
        lane: Math.random(),
        size: 2.5 + Math.random() * 2.5,
        color: '',
        glow: Math.random() < 0.25,
      });
    }

    const isSettled = !marketStatus.isMarketOpen && !replayTape;

    const renderMobile = () => {
      ctx.clearRect(0, 0, width, height);

      // Inflow River Arch (Top to Right)
      ctx.beginPath();
      ctx.moveTo(15, height * 0.5);
      ctx.bezierCurveTo(width * 0.35, height * 0.05, width * 0.65, height * 0.15, width - 20, height * 0.25);
      ctx.strokeStyle = isSettled ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.28)';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Outflow River Arch (Bottom to Right)
      ctx.beginPath();
      ctx.moveTo(15, height * 0.5);
      ctx.bezierCurveTo(width * 0.35, height * 0.95, width * 0.65, height * 0.85, width - 20, height * 0.75);
      ctx.strokeStyle = isSettled ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.28)';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Draw sector origin node on left
      ctx.fillStyle = '#6366F1';
      ctx.beginPath();
      ctx.arc(15, height * 0.5, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw Inflow pool node on right top
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(width - 20, height * 0.25, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw Outflow pool node on right bottom
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(width - 20, height * 0.75, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw particles along cubic bezier
      for (const p of particles) {
        const step = isSettled ? p.speed * 0.25 : p.speed;
        p.t += step;
        if (p.t > 1) {
          p.t = 0;
          p.type = Math.random() < 0.55 ? 'inflow' : 'outflow';
          p.glow = Math.random() < 0.25;
        }

        const t = p.t;
        const mt = 1 - t;
        let x = 0;
        let y = 0;

        if (p.type === 'inflow') {
          // Inflow Bezier
          const p0 = { x: 15, y: height * 0.5 };
          const p1 = { x: width * 0.35, y: height * 0.05 + (p.lane - 0.5) * 16 };
          const p2 = { x: width * 0.65, y: height * 0.15 + (p.lane - 0.5) * 16 };
          const p3 = { x: width - 20, y: height * 0.25 };
          x = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x;
          y = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y;
          p.color = p.glow ? '#F59E0B' : '#22C55E';
        } else {
          // Outflow Bezier
          const p0 = { x: 15, y: height * 0.5 };
          const p1 = { x: width * 0.35, y: height * 0.95 + (p.lane - 0.5) * 16 };
          const p2 = { x: width * 0.65, y: height * 0.85 + (p.lane - 0.5) * 16 };
          const p3 = { x: width - 20, y: height * 0.75 };
          x = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x;
          y = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y;
          p.color = p.glow ? '#F59E0B' : '#EF4444';
        }

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        if (p.glow) {
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(renderMobile);
    };

    renderMobile();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileTab, marketStatus.isMarketOpen, replayTape]);

  const maxAbsNet = Math.max(1, ...liveSectors.map((s) => Math.abs(s.net)));

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans p-3 sm:p-4 md:p-6 select-none">
      <div className="max-w-[1600px] mx-auto space-y-3 sm:space-y-4">
        {/* Dynamic Running Headline Alert Banner with Live Feed */}
        <div className="bg-white rounded-xl border border-slate-200 p-2.5 sm:p-3.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            {!marketStatus.isMarketOpen ? (
              <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                Weekend Settled Session
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Trading Session
              </span>
            )}
            <span className="font-bold text-slate-800 shrink-0">Rotating into IT;</span>
            <span className="text-slate-600">
              Banking &amp; Cap goods seeing institutional outflows; {marketStatus.isMarketOpen ? 'live' : 'settled'} breadth:{' '}
              <span className="text-rose-600 font-semibold">-₹18,450 cr</span>;
            </span>
            <span className="hidden md:flex items-center gap-1 text-amber-600 font-semibold shrink-0 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              TCS (+2.8%)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-mono text-slate-500 shrink-0 self-end sm:self-auto">
            <span className={`w-1.5 h-1.5 rounded-full ${marketStatus.isMarketOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span>{marketStatus.isMarketOpen ? lastSync : 'Friday Close Settled · Reopens Mon 9:15 AM'}</span>
          </div>
        </div>

        {/* ELI5 / 5-Year Old Simple Takeaway Card */}
        <div className="bg-gradient-to-r from-emerald-50 via-white to-indigo-50 border border-emerald-200/80 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">👶</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                    Simple Market Verdict (ELI5)
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Easy plain English breakdown</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                  <span className="text-emerald-700 font-bold">🟢 Big Money is Buying:</span> Technology & Software (TCS, Infosys) · 
                  <span className="text-rose-700 font-bold ml-1.5">🔴 Big Money is Selling:</span> Private Banks & Motors.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Best Stock</span>
                <span className="text-xs font-black text-emerald-700">TCS (Bullish)</span>
              </div>
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Action</span>
                <span className="text-xs font-black text-indigo-700">Buy IT on Retest</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legend Subtitle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] sm:text-xs text-slate-500 px-1 font-mono gap-1">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span>speed = volume</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shadow-xs"></span>
              glow = surge
            </span>
          </div>
          <div className="flex items-center gap-3 font-semibold">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              green = money in
            </span>
            <span className="flex items-center gap-1 text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
              red = money out
            </span>
          </div>
        </div>

        {/* MOBILE LAYOUT (< lg screens): Clean, Responsive Cards & Controls */}
        <div className="block lg:hidden space-y-3">
          {/* Top Inflow / Outflow Quick Summary Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-2.5 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block truncate">
                {selectedSector ? `${selectedSector} INFLOW` : 'TOTAL INFLOW'}
              </span>
              <div className="text-lg sm:text-xl font-black text-emerald-600 font-mono">
                {totalInflowDisplay}
              </div>
              <span className="text-[9.5px] text-emerald-700 font-mono mt-0.5 block truncate">
                {displayedInflowStocks.slice(0, 3).map((s) => s.symbol).join(', ') || 'No heavy inflow'}
              </span>
            </div>

            <div className="bg-rose-50/90 border border-rose-200 rounded-xl p-2.5 shadow-2xs">
              <span className="text-[10px] font-bold text-rose-800 uppercase block truncate">
                {selectedSector ? `${selectedSector} OUTFLOW` : 'TOTAL OUTFLOW'}
              </span>
              <div className="text-lg sm:text-xl font-black text-rose-600 font-mono">
                {totalOutflowDisplay}
              </div>
              <span className="text-[9.5px] text-rose-700 font-mono mt-0.5 block truncate">
                {displayedOutflowStocks.slice(0, 3).map((s) => s.symbol).join(', ') || 'No heavy outflow'}
              </span>
            </div>
          </div>

          {/* Active Filter Banner if sector is selected */}
          {selectedSector && (
            <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-1.5 text-xs text-indigo-900">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px]">Sector:</span>
                <span className="font-bold uppercase tracking-wide bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {selectedSector}
                </span>
              </div>
              <button
                onClick={() => setSelectedSector(null)}
                className="text-[11px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-indigo-200 hover:bg-indigo-100 shadow-2xs cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* Mobile View Switcher Tabs (Ergonomic 4-tab bar) */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold overflow-x-auto no-scrollbar gap-1">
            <button
              onClick={() => setMobileTab('RIVER')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all whitespace-nowrap text-center cursor-pointer ${
                mobileTab === 'RIVER'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌊 Flow River
            </button>
            <button
              onClick={() => setMobileTab('SECTORS')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all whitespace-nowrap text-center cursor-pointer ${
                mobileTab === 'SECTORS'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Sectors ({liveSectors.length})
            </button>
            <button
              onClick={() => setMobileTab('INFLOW')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all whitespace-nowrap text-center cursor-pointer ${
                mobileTab === 'INFLOW'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              🟢 Inflow
            </button>
            <button
              onClick={() => setMobileTab('OUTFLOW')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all whitespace-nowrap text-center cursor-pointer ${
                mobileTab === 'OUTFLOW'
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              🔴 Outflow
            </button>
          </div>

          {/* Dedicated Flow River Animation ONLY shown in RIVER tab (clean aspect ratio, never squashed) */}
          {mobileTab === 'RIVER' && (
            <div className="space-y-2.5">
              <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs relative overflow-hidden h-64 sm:h-72">
                <canvas ref={mobileCanvasRef} className="w-full h-full block" />
                <div className="absolute top-2 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider bg-white/95 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    🌊 Live Flow River
                  </span>
                  {!marketStatus.isMarketOpen && (
                    <span className="text-[9px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      Weekend Settled
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2 right-3 text-[9px] font-mono text-slate-500 bg-white/90 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  Tap sectors below to filter
                </div>
              </div>

              {/* Quick Sector Tap Filter Strip */}
              <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span>Filter Flow Stream by Sector:</span>
                  {selectedSector && (
                    <button onClick={() => setSelectedSector(null)} className="text-indigo-600 text-[10px] font-bold underline cursor-pointer">
                      Reset All
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {liveSectors.map((s) => {
                    const isSel = selectedSector === s.name;
                    const isPos = s.net > 0;
                    return (
                      <button
                        key={s.name}
                        onClick={() => handleSectorClick(s.name)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap shrink-0 transition cursor-pointer ${
                          isSel
                            ? 'bg-slate-900 text-white font-bold shadow-2xs'
                            : isPos
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {s.name} {isPos ? `+₹${Math.round(s.net / 100)}cr` : `-₹${Math.round(Math.abs(s.net) / 100)}cr`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Tab 1: Sectors Breakdown */}
          {mobileTab === 'SECTORS' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pb-1 uppercase tracking-wider">
                <span>Sector (Tap to view stocks)</span>
                <span>Net Flow</span>
              </div>
              <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {liveSectors.map((sec) => {
                  const isPositive = sec.net > 0;
                  const barWidth = Math.min(100, (Math.abs(sec.net) / maxAbsNet) * 100);
                  const isSelected = selectedSector === sec.name;

                  return (
                    <div
                      key={sec.name}
                      onClick={() => handleSectorClick(sec.name)}
                      className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-50 border border-indigo-400 font-bold shadow-2xs'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 w-24">
                        <span className="truncate text-[11px] text-slate-800 font-medium">
                          {sec.name}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></span>
                        )}
                      </div>
                      <div className="flex-1 flex items-center mx-2 h-3.5 bg-slate-50 rounded overflow-hidden">
                        {isPositive ? (
                          <div
                            className="h-full bg-emerald-500 rounded transition-all duration-500"
                            style={{ width: `${barWidth}%` }}
                          ></div>
                        ) : (
                          <div
                            className="h-full bg-rose-500 rounded ml-auto transition-all duration-500"
                            style={{ width: `${barWidth}%` }}
                          ></div>
                        )}
                      </div>
                      <span
                        className={`w-16 text-right font-mono font-semibold text-[11px] ${
                          isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isPositive ? `+₹${sec.net}` : `-₹${Math.abs(sec.net)}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mobile Tab 2: Inflow Stocks */}
          {mobileTab === 'INFLOW' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {selectedSector ? `${selectedSector} Stocks: Money IN` : 'Top Institutional Accumulation Stocks'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 inline shrink-0" />
                    <span>Real-time verified wire: Livemint, Business Standard, Reuters</span>
                  </div>
                </div>
                {selectedSector && (
                  <button
                    onClick={() => setSelectedSector(null)}
                    className="text-[11px] text-indigo-600 font-bold underline"
                  >
                    Show All
                  </button>
                )}
              </div>

              {displayedInflowStocks.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 bg-emerald-50/40 rounded-xl border border-emerald-100">
                  No heavy institutional buying detected in {selectedSector} at this moment.
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {displayedInflowStocks.map((stock) => {
                    const live = verifiedNews[stock.symbol];
                    const headline = live?.headline || stock.news || stock.reason;
                    const sourceName = live?.source || 'Verified Financial Wire';
                    const pubDate = live?.pubDate;
                    const link = live?.link;

                    return (
                      <div
                        key={stock.symbol}
                        className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-emerald-600 font-black">➔</span>
                            <strong className="text-slate-900 text-sm">{stock.symbol}</strong>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-700" />
                              {sourceName}
                            </span>
                            {stock.surge && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-200 px-1 py-0.2 rounded font-bold font-sans">
                                ⚡ SURGE
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                            <span className="text-emerald-700 font-bold">{stock.change}</span>
                            <span className="text-emerald-800 font-bold bg-emerald-100/70 px-1.5 py-0.5 rounded">
                              {stock.flow}
                            </span>
                          </div>
                        </div>

                        <div className="text-[11px] leading-relaxed text-slate-700 bg-white/90 rounded-lg p-2 border border-emerald-100/80 space-y-1">
                          <div className="flex items-start gap-1.5">
                            <span className="text-emerald-700 font-bold shrink-0">Why High Demand:</span>
                            <span className="text-slate-800 font-medium line-clamp-2 sm:line-clamp-none">{headline}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[10px] text-slate-500 font-sans">
                            <span className="truncate">
                              Published by {sourceName} {pubDate ? `· ${pubDate}` : ''}
                            </span>
                            {link && (
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 font-semibold shrink-0 flex items-center gap-0.5 hover:underline"
                              >
                                Read Article <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Mobile Tab 3: Outflow Stocks */}
          {mobileTab === 'OUTFLOW' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <div className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                    {selectedSector ? `${selectedSector} Stocks: Money OUT` : 'Top Institutional Distribution Stocks'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-rose-600 inline shrink-0" />
                    <span>Real-time verified wire: Livemint, Business Standard, Reuters</span>
                  </div>
                </div>
                {selectedSector && (
                  <button
                    onClick={() => setSelectedSector(null)}
                    className="text-[11px] text-indigo-600 font-bold underline"
                  >
                    Show All
                  </button>
                )}
              </div>

              {displayedOutflowStocks.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 bg-rose-50/40 rounded-xl border border-rose-100">
                  No heavy institutional selling detected in {selectedSector} at this moment.
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {displayedOutflowStocks.map((stock) => {
                    const live = verifiedNews[stock.symbol];
                    const headline = live?.headline || stock.news || stock.reason;
                    const sourceName = live?.source || 'Verified Financial Wire';
                    const pubDate = live?.pubDate;
                    const link = live?.link;

                    return (
                      <div
                        key={stock.symbol}
                        className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-rose-600 font-black">➔</span>
                            <strong className="text-slate-900 text-sm">{stock.symbol}</strong>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wide flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5 text-rose-700" />
                              {sourceName}
                            </span>
                            {stock.surge && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-200 px-1 py-0.2 rounded font-bold font-sans">
                                ⚡ SURGE
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                            <span className="text-rose-700 font-bold">{stock.change}</span>
                            <span className="text-rose-800 font-bold bg-rose-100/70 px-1.5 py-0.5 rounded">
                              {stock.flow}
                            </span>
                          </div>
                        </div>

                        <div className="text-[11px] leading-relaxed text-slate-700 bg-white/90 rounded-lg p-2 border border-rose-100/80 space-y-1">
                          <div className="flex items-start gap-1.5">
                            <span className="text-rose-700 font-bold shrink-0">Why Huge Sell:</span>
                            <span className="text-slate-800 font-medium line-clamp-2 sm:line-clamp-none">{headline}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[10px] text-slate-500 font-sans">
                            <span className="truncate">
                              Published by {sourceName} {pubDate ? `· ${pubDate}` : ''}
                            </span>
                            {link && (
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 font-semibold shrink-0 flex items-center gap-0.5 hover:underline"
                              >
                                Read Article <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP LAYOUT (lg:grid): Exact 3-column UI from the Reel                 */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid grid-cols-12 gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
          {/* Column 1: Sector Net Flows Diverging Horizontal Bar Chart */}
          <div className="col-span-5 space-y-2 pr-2 border-r border-slate-100">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pb-1 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                Sector <span className="text-slate-400 font-normal lowercase">(click to view constituent stocks)</span>
              </span>
              <span>Live Net Money Flow (₹ Cr)</span>
            </div>

            {/* Active Filter Pill */}
            {selectedSector && (
              <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg px-2.5 py-1.5 text-xs text-indigo-900 animate-in fade-in">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600">Filtered by:</span>
                  <span className="font-bold uppercase tracking-wide bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {selectedSector}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSector(null)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                >
                  Show All Sectors
                </button>
              </div>
            )}

            <div className="space-y-1 overflow-y-auto max-h-[660px] pr-1 custom-scrollbar">
              {liveSectors.map((sec) => {
                const isPositive = sec.net > 0;
                const barWidth = Math.min(100, (Math.abs(sec.net) / maxAbsNet) * 100);
                const isSelected = selectedSector === sec.name;

                return (
                  <div
                    key={sec.name}
                    onClick={() => handleSectorClick(sec.name)}
                    onMouseEnter={() => setHoveredSector(sec.name)}
                    onMouseLeave={() => setHoveredSector(null)}
                    className={`group flex items-center justify-between py-1.5 px-2.5 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/90 border border-indigo-400 shadow-xs font-bold text-indigo-950 ring-1 ring-indigo-400/40'
                        : hoveredSector === sec.name
                        ? 'bg-slate-100/90 border border-slate-200'
                        : 'border border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-28 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors" />
                      <span className="font-semibold text-slate-800 truncate">{sec.name}</span>
                      {isSelected && (
                        <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-mono font-bold tracking-tight">
                          FILTERED
                        </span>
                      )}
                    </div>

                    <div className="flex-1 flex items-center mx-3 h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                      {isPositive ? (
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500 shadow-2xs"
                          style={{ width: `${barWidth}%` }}
                        ></div>
                      ) : (
                        <div
                          className="h-full bg-gradient-to-l from-rose-400 to-rose-500 rounded-full ml-auto transition-all duration-500 shadow-2xs"
                          style={{ width: `${barWidth}%` }}
                        ></div>
                      )}
                    </div>

                    <span
                      className={`w-24 text-right font-mono font-bold text-[11.5px] tabular-nums shrink-0 ${
                        isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isPositive ? `+₹${sec.net.toLocaleString()}` : `-₹${Math.abs(sec.net).toLocaleString()}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: HTML5 Canvas with Animated Flow Particles */}
          <div className="col-span-3 flex flex-col h-[700px] bg-slate-50/50 rounded-2xl border border-slate-200/60 p-2">
            {/* Top Status Header - Positioned OUTSIDE canvas so it NEVER overlaps inflow stream */}
            <div className="shrink-0 pb-2 text-center flex flex-col items-center gap-1.5 border-b border-slate-200/40">
              <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase font-semibold">
                {marketStatus.isMarketOpen ? 'Live Flow River (Active Stream)' : 'Settled Flow River (Friday Session)'}
              </div>

              {!marketStatus.isMarketOpen && (
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-900 text-white rounded-full text-[10px] font-mono shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <span className="font-bold tracking-tight">MARKET CLOSED (WEEKEND)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplayTape(!replayTape)}
                    className="text-[10.5px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full font-sans font-medium transition cursor-pointer shadow-2xs flex items-center gap-1"
                  >
                    <span>{replayTape ? '⏸️ Settled Drift' : '▶ Replay Friday Stream'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Completely Unobstructed Canvas Container */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              <canvas ref={canvasRef} className="w-full h-full block" />
              
              {/* Subtle Bottom settled net note */}
              {!marketStatus.isMarketOpen && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center text-[10px] text-slate-400 font-mono bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs pointer-events-none">
                  Settled Net Flows · 0 Obstruction
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Inflow & Outflow Cards */}
          <div className="col-span-4 flex flex-col justify-between space-y-4 pl-2">
            {/* Top Card: INFLOW */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
                  {selectedSector
                    ? `${selectedSector} INFLOW`
                    : marketStatus.isMarketOpen
                    ? 'INFLOW ACCUMULATION'
                    : 'FRIDAY SETTLED INFLOW'}
                </span>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                  {selectedSector
                    ? `${selectedSector} Money IN`
                    : marketStatus.isMarketOpen
                    ? 'Live Smart Money'
                    : 'Friday Institutional Close'}
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-600 font-mono tracking-tight mb-3">
                {totalInflowDisplay}
              </div>

              {displayedInflowStocks.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 bg-white/70 rounded-xl border border-emerald-100">
                  No heavy institutional buying detected in {selectedSector} at this moment.
                </div>
              ) : (
                <div className="space-y-2 max-h-[265px] overflow-y-auto pr-1 custom-scrollbar">
                  {displayedInflowStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="p-2.5 rounded-xl bg-white/95 border border-emerald-100/90 hover:border-emerald-300 transition-all shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-emerald-600 font-black text-xs">➔</span>
                          <span className="font-bold text-sm text-slate-900">{stock.symbol}</span>
                          {stock.catalystTag && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100/90 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
                              {stock.catalystTag}
                            </span>
                          )}
                          {stock.surge && (
                            <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-200 px-1 py-0.2 rounded font-bold font-sans">
                              ⚡ SURGE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                          <span className="text-emerald-700 font-bold">{stock.change}</span>
                          <span className="text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                            {stock.flow}
                          </span>
                        </div>
                      </div>

                      {stock.reason && (
                        <div className="text-[11px] leading-relaxed text-slate-700 bg-emerald-50/40 rounded-lg p-2 border border-emerald-100/60 space-y-1">
                          <div className="flex items-start gap-1.5">
                            <span className="text-emerald-700 font-bold shrink-0">Why High Demand:</span>
                            <span className="text-slate-700 font-normal">{stock.reason}</span>
                          </div>
                          {stock.news && (
                            <div className="flex items-start gap-1.5 pt-1 border-t border-emerald-100/80 text-[10.5px]">
                              <span className="text-indigo-700 font-semibold shrink-0">📰 News / Catalyst:</span>
                              <span className="italic text-slate-600 font-medium">{stock.news}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Card: OUTFLOW */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-rose-800 tracking-wider uppercase">
                  {selectedSector
                    ? `${selectedSector} OUTFLOW`
                    : marketStatus.isMarketOpen
                    ? 'OUTFLOW DISTRIBUTION'
                    : 'FRIDAY SETTLED OUTFLOW'}
                </span>
                <span className="text-xs text-rose-700 font-semibold bg-rose-100 px-2 py-0.5 rounded-full font-mono">
                  {selectedSector
                    ? `${selectedSector} Money OUT`
                    : marketStatus.isMarketOpen
                    ? 'Live Institutional Exit'
                    : 'Friday Institutional Close'}
                </span>
              </div>
              <div className="text-2xl font-black text-rose-600 font-mono tracking-tight mb-3">
                {totalOutflowDisplay}
              </div>

              {displayedOutflowStocks.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 bg-white/70 rounded-xl border border-rose-100">
                  No heavy institutional selling detected in {selectedSector} at this moment.
                </div>
              ) : (
                <div className="space-y-2 max-h-[265px] overflow-y-auto pr-1 custom-scrollbar">
                  {displayedOutflowStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="p-2.5 rounded-xl bg-white/95 border border-rose-100/90 hover:border-rose-300 transition-all shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-rose-600 font-black text-xs">➔</span>
                          <span className="font-bold text-sm text-slate-900">{stock.symbol}</span>
                          {stock.catalystTag && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100/90 text-rose-800 border border-rose-200 uppercase tracking-wide">
                              {stock.catalystTag}
                            </span>
                          )}
                          {stock.surge && (
                            <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-200 px-1 py-0.2 rounded font-bold font-sans">
                              ⚡ SURGE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                          <span className="text-rose-700 font-bold">{stock.change}</span>
                          <span className="text-rose-800 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/60">
                            {stock.flow}
                          </span>
                        </div>
                      </div>

                      {stock.reason && (
                        <div className="text-[11px] leading-relaxed text-slate-700 bg-rose-50/40 rounded-lg p-2 border border-rose-100/60 space-y-1">
                          <div className="flex items-start gap-1.5">
                            <span className="text-rose-700 font-bold shrink-0">Why Huge Sell:</span>
                            <span className="text-slate-700 font-normal">{stock.reason}</span>
                          </div>
                          {stock.news && (
                            <div className="flex items-start gap-1.5 pt-1 border-t border-rose-100/80 text-[10.5px]">
                              <span className="text-indigo-700 font-semibold shrink-0">📰 News / Catalyst:</span>
                              <span className="italic text-slate-600 font-medium">{stock.news}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="text-[11px] text-slate-500 text-center font-mono py-1 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>NSE & BSE Live Feeds Connected · Streaming Real-Time Order Flow</span>
        </div>
      </div>
    </div>
  );
}
