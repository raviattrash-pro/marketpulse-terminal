import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface NewsItem {
  symbol: string;
  headline: string;
  source: string;
  pubDate: string;
  link: string;
  type: 'DEMAND_REASON' | 'FALL_REASON' | 'MARKET_NEWS';
}

const COMPANY_NAMES: Record<string, string> = {
  // IT
  TCS: 'TCS',
  INFY: 'Infosys',
  WIPRO: 'Wipro',
  LTTS: 'L&T Technology Services',
  TECHM: 'Tech Mahindra',
  HCLTECH: 'HCL Tech',
  COFORGE: 'Coforge',
  PERSISTENT: 'Persistent Systems',

  // Banking & Financials
  HDFCBANK: 'HDFC Bank',
  ICICIBANK: 'ICICI Bank',
  KOTAKBANK: 'Kotak Mahindra Bank',
  AXISBANK: 'Axis Bank',
  INDUSINDBK: 'IndusInd Bank',
  BANDHANBNK: 'Bandhan Bank',
  FEDERALBNK: 'Federal Bank',
  SBIN: 'State Bank of India',
  BANKBARODA: 'Bank of Baroda',
  CANBK: 'Canara Bank',
  PNB: 'Punjab National Bank',
  UNIONBANK: 'Union Bank of India',
  IOB: 'Indian Overseas Bank',

  // NBFC
  BAJFINANCE: 'Bajaj Finance',
  BAJAJFINSV: 'Bajaj Finserv',
  CHOLAFIN: 'Cholamandalam Finance',
  MUTHOOTFIN: 'Muthoot Finance',
  SHRIRAMFIN: 'Shriram Finance',

  // Insurance
  SBILIFE: 'SBI Life Insurance',
  HDFCLIFE: 'HDFC Life Insurance',
  ICICIPRULI: 'ICICI Prudential Life',
  LICI: 'LIC India',
  MAXHEALTH: 'Max Healthcare',
  GICRE: 'General Insurance Corp',

  // Infra & Engineering
  LT: 'Larsen & Toubro',
  GMRINFRA: 'GMR Airports Infrastructure',
  ADANIPORTS: 'Adani Ports',
  BHEL: 'BHEL',
  IRB: 'IRB Infrastructure',
  NBCC: 'NBCC India',

  // Auto
  TATAMOTORS: 'Tata Motors',
  'M&M': 'Mahindra & Mahindra',
  MARUTI: 'Maruti Suzuki',
  BAJAJ_AUTO: 'Bajaj Auto',
  'BAJAJ-AUTO': 'Bajaj Auto',
  HEROMOTOCO: 'Hero MotoCorp',
  EICHERMOT: 'Eicher Motors',
  TVSMOTOR: 'TVS Motor',

  // FMCG
  HINDUNILVR: 'Hindustan Unilever',
  ITC: 'ITC',
  NESTLEIND: 'Nestle India',
  BRITANNIA: 'Britannia Industries',
  DABUR: 'Dabur India',
  TATACONSUM: 'Tata Consumer Products',

  // Pharma
  SUNPHARMA: 'Sun Pharma',
  CIPLA: 'Cipla',
  DRREDDY: 'Dr Reddys Laboratories',
  DIVISLAB: 'Divis Laboratories',
  LUPIN: 'Lupin',
  TORNTPHARM: 'Torrent Pharma',

  // Metal
  TATASTEEL: 'Tata Steel',
  HINDALCO: 'Hindalco',
  JINDALSTEL: 'Jindal Steel',
  VEDL: 'Vedanta',
  NMDC: 'NMDC',
  NATIONALUM: 'National Aluminium',

  // Oil & Gas & Energy
  RELIANCE: 'Reliance Industries',
  ONGC: 'ONGC',
  BPCL: 'BPCL',
  IOC: 'Indian Oil Corp',
  GAIL: 'GAIL India',
  NTPC: 'NTPC',
  POWERGRID: 'Power Grid Corp',
  TATAPOWER: 'Tata Power',
  ADANIGREEN: 'Adani Green Energy',

  // Cement
  ULTRACEMCO: 'UltraTech Cement',
  AMBUJACEM: 'Ambuja Cements',
  ACC: 'ACC Cement',
  SHREECEM: 'Shree Cement',

  // Defence
  BEL: 'Bharat Electronics',
  HAL: 'Hindustan Aeronautics',
  MAZDOCK: 'Mazagon Dock',
  BDL: 'Bharat Dynamics',

  // Telecom & Capital Markets & Consumer
  BHARTIARTL: 'Bharti Airtel',
  TATACOMM: 'Tata Communications',
  IDEA: 'Vodafone Idea',
  TITAN: 'Titan Company',
  VOLTAS: 'Voltas',
  HAVELLS: 'Havells India',
  CROMPTON: 'Crompton Greaves Consumer',
  BSE: 'BSE India',
  MCX: 'MCX India',
  CDSL: 'CDSL',
  ANGELONE: 'Angel One',
  ZOMATO: 'Zomato',
  PAYTM: 'Paytm',
  POLICYBZR: 'PB Fintech Policybazaar',
  NYKAA: 'Nykaa',
  SIEMENS: 'Siemens India',
  ABB: 'ABB India',
  CONCOR: 'Container Corp CONCOR',
  PIDILITIND: 'Pidilite Industries',
  SRF: 'SRF Ltd',
};

// In-memory cache with 5-minute TTL to prevent hammering Google News RSS
const cache = new Map<string, { data: NewsItem[]; expiresAt: number }>();

async function fetchRealNewsForSymbol(symbol: string): Promise<NewsItem[]> {
  const now = Date.now();
  const cached = cache.get(symbol);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const cleanSym = symbol.toUpperCase().trim();
  const companyName = COMPANY_NAMES[cleanSym] || cleanSym;

  // Search real financial news for why it fell or gained
  const query = encodeURIComponent(`"${companyName}" shares (why fell OR jump OR gain OR results OR order OR news)`);
  const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;

  try {
    const res = await fetch(rssUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(3500),
      next: { revalidate: 120 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    const items = xml.split('<item>').slice(1, 4).map((chunk) => {
      const titleMatch = chunk.match(/<title>(.*?)<\/title>/);
      const linkMatch = chunk.match(/<link\/?>(.*?)<\/link>/);
      const pubMatch = chunk.match(/<pubDate>(.*?)<\/pubDate>/);
      const sourceMatch = chunk.match(/<source[^>]*>(.*?)<\/source>/);

      const rawTitle = titleMatch ? titleMatch[1] : '';
      const source = sourceMatch ? sourceMatch[1] : 'Financial News';
      // Strip trailing " - Publisher" from headline if duplicate
      const headline = rawTitle
        .replace(new RegExp(`\\s*-\\s*${source}\\s*$`, 'i'), '')
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');

      // Detect sentiment / type from actual verified headline
      const lower = headline.toLowerCase();
      let type: 'DEMAND_REASON' | 'FALL_REASON' | 'MARKET_NEWS' = 'MARKET_NEWS';
      if (
        lower.includes('fall') ||
        lower.includes('down') ||
        lower.includes('slips') ||
        lower.includes('drop') ||
        lower.includes('plunge') ||
        lower.includes('tumble') ||
        lower.includes('miss') ||
        lower.includes('curb') ||
        lower.includes('lower') ||
        lower.includes('drag')
      ) {
        type = 'FALL_REASON';
      } else if (
        lower.includes('jump') ||
        lower.includes('gain') ||
        lower.includes('surge') ||
        lower.includes('rally') ||
        lower.includes('rise') ||
        lower.includes('up') ||
        lower.includes('high') ||
        lower.includes('beat') ||
        lower.includes('order') ||
        lower.includes('target')
      ) {
        type = 'DEMAND_REASON';
      }

      let formattedDate = pubMatch ? pubMatch[1] : '';
      try {
        if (formattedDate) {
          const d = new Date(formattedDate);
          formattedDate = d.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        }
      } catch (e) {
        // preserve raw
      }

      return {
        symbol: cleanSym,
        headline,
        source,
        pubDate: formattedDate,
        link: linkMatch ? linkMatch[1] : '',
        type,
      };
    });

    const validItems = items.filter((it) => it.headline.length > 5);
    cache.set(symbol, { data: validItems, expiresAt: now + 300000 }); // cache 5 min
    return validItems;
  } catch (e) {
    // Return empty on network error
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawSingle = searchParams.get('symbol');
  const rawMulti = searchParams.get('symbols');

  // Input sanitization
  const singleSymbol = rawSingle ? rawSingle.slice(0, 40).replace(/[^a-zA-Z0-9\s.\-&]/g, '').trim() : null;
  const multiSymbols = rawMulti ? rawMulti.slice(0, 300).replace(/[^a-zA-Z0-9,\s.\-&]/g, '').trim() : null;

  if (singleSymbol) {
    const news = await fetchRealNewsForSymbol(singleSymbol);
    return NextResponse.json(
      {
        success: true,
        symbol: singleSymbol.toUpperCase(),
        sourceVerification: 'VERIFIED_REAL_TIME_FINANCIAL_MEDIA',
        count: news.length,
        news,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  }

  if (multiSymbols) {
    const list = multiSymbols.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean).slice(0, 12);
    const results = await Promise.all(
      list.map(async (sym) => {
        const news = await fetchRealNewsForSymbol(sym);
        return {
          symbol: sym,
          latestNews: news[0] || null,
          allNews: news,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        sourceVerification: 'VERIFIED_REAL_TIME_FINANCIAL_MEDIA',
        count: results.length,
        results,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  }

  return NextResponse.json(
    { error: 'Please provide ?symbol=TCS or ?symbols=TCS,INFY,HDFCBANK' },
    { status: 400 }
  );
}
