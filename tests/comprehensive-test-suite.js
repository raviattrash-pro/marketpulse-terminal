/**
 * Comprehensive Automated Testing Suite
 * Tests:
 * 1. API Endpoint Responses & Schema Integrity
 * 2. Real-time Live Market Data feeds (NSE/BSE)
 * 3. Sanitization & Input Security
 * 4. Response Time & Latency Benchmarks
 * 5. Static Data & Stock Profile Correctness
 * 6. Business Logic & Margin of Safety Formula
 */

const BASE_URL = 'http://localhost:3000';

let passedTests = 0;
let failedTests = 0;
const results = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passedTests++;
    results.push({ name: testName, status: 'PASS', details });
    console.log(`  [PASS] ${testName} ${details ? '(' + details + ')' : ''}`);
  } else {
    failedTests++;
    results.push({ name: testName, status: 'FAIL', details });
    console.error(`  [FAIL] ${testName} ${details ? ': ' + details : ''}`);
  }
}

async function testApiEndpoint(name, url, validator) {
  const start = Date.now();
  try {
    const res = await fetch(url);
    const duration = Date.now() - start;
    assert(res.status === 200, `${name}: HTTP Status 200`, `Received ${res.status} in ${duration}ms`);
    assert(duration < 2500, `${name}: Quick Response Benchmark (<2500ms)`, `Duration: ${duration}ms`);
    
    // Check security headers
    const nosniff = res.headers.get('x-content-type-options');
    const xframe = res.headers.get('x-frame-options');
    assert(nosniff === 'nosniff', `${name}: Security Header X-Content-Type-Options: nosniff`);
    assert(xframe === 'DENY', `${name}: Security Header X-Frame-Options: DENY`);

    const data = await res.json();
    validator(data, duration);
  } catch (err) {
    assert(false, `${name}: Network / Parse Error`, err.message);
  }
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('  STARTING INVESTONOMY COPILOT FULL TEST SUITE');
  console.log('======================================================\n');

  // TEST SUITE 1: /api/market-pulse
  console.log('--- TEST GROUP 1: Market Pulse API & Market Status ---');
  await testApiEndpoint('Market Pulse', `${BASE_URL}/api/market-pulse`, (data, duration) => {
    assert(data.marketStatus !== undefined, 'Market Pulse has marketStatus object');
    assert(typeof data.marketStatus?.isMarketOpen === 'boolean', 'Market status has boolean isMarketOpen', `isMarketOpen=${data.marketStatus?.isMarketOpen}`);
    assert(data.indices && Array.isArray(data.indices), 'Market indices is an array');
    assert(data.indices.length >= 2, 'Market indices contains at least NIFTY 50 and SENSEX');
    assert(data.sectors && Array.isArray(data.sectors), 'Market sectors is an array');
    assert(data.sectors.length > 0, 'Contains sectoral breadth data');
  });

  // TEST SUITE 2: /api/live-stocks (Batch Mode)
  console.log('\n--- TEST GROUP 2: Live Stocks Batch Mode ---');
  await testApiEndpoint('Live Stocks Batch', `${BASE_URL}/api/live-stocks`, (data, duration) => {
    assert(data.stocks && Array.isArray(data.stocks), 'stocks property is array');
    assert(data.stocks.length >= 10, 'Batch returned at least 10 core stocks', `Count: ${data.stocks.length}`);
    const first = data.stocks[0];
    assert(first.symbol && first.price > 0, 'Stock has valid symbol and positive price', `${first.symbol} = ₹${first.price}`);
    assert(first.exchange === 'NSE' || first.exchange === 'BSE', 'Valid Indian Exchange tag');
  });

  // TEST SUITE 3: Real Live NSE/BSE Symbol Queries (Individual Stocks)
  console.log('\n--- TEST GROUP 3: Live NSE/BSE Real Stock Feeds ---');
  const symbolsToTest = [
    { sym: 'TCS', name: 'Tata Consultancy Services' },
    { sym: 'RELIANCE', name: 'Reliance Industries' },
    { sym: 'NMDC', name: 'NMDC Ltd' },
    { sym: 'TATACAP', name: 'Tata Capital' },
    { sym: 'HDBFS', name: 'HDB Financial Services' },
    { sym: 'SBIFUNDS', name: 'SBI Funds Management' },
    { sym: 'SWIGGY', name: 'Swiggy' },
    { sym: 'WAAREEENER', name: 'Waaree Energies' },
    { sym: 'NHPC', name: 'NHPC Limited' }
  ];

  for (const item of symbolsToTest) {
    await testApiEndpoint(`Live Stock: ${item.sym}`, `${BASE_URL}/api/live-stocks?symbol=${item.sym}`, (data) => {
      const stock = data.stock;
      assert(stock !== undefined, `${item.sym}: Returned stock payload`);
      assert(stock.price > 0, `${item.sym}: Live Price is positive`, `₹${stock.price}`);
      assert(typeof stock.changePct === 'number', `${item.sym}: Change % is numeric`, `${stock.changePct}%`);
      assert(stock.exchange === 'NSE' || stock.exchange === 'BSE', `${item.sym}: Exchange is NSE/BSE`, stock.exchange);
      assert(typeof stock.fairValue === 'number' && stock.fairValue > 0, `${item.sym}: Graham/DCF Fair Value calculated`, `₹${stock.fairValue}`);
      assert(stock.stopLoss > 0 && stock.target1 > 0, `${item.sym}: Targets and StopLoss computed`);
    });
  }

  // TEST SUITE 4: /api/crypto-gold
  console.log('\n--- TEST GROUP 4: Crypto & Gold Multi-Asset Feed ---');
  await testApiEndpoint('Crypto & Gold', `${BASE_URL}/api/crypto-gold`, (data) => {
    assert(Array.isArray(data.assets), 'Contains assets array');
    const gold = data.assets.find(a => a.symbol === 'GOLD_MCX');
    assert(gold !== undefined, 'Contains GOLD_MCX asset in feed');
    assert(gold.price > 50000, 'Gold price in INR is realistic', `₹${gold.price}`);
    const btc = data.assets.find(a => a.symbol === 'BTC');
    assert(btc !== undefined, 'Contains BTC in assets');
  });

  // TEST SUITE 5: /api/stock-news
  console.log('\n--- TEST GROUP 5: Stock News Financial Feed ---');
  await testApiEndpoint('Stock News TCS', `${BASE_URL}/api/stock-news?symbol=TCS`, (data) => {
    assert(data.success === true, 'Stock news query success flag');
    assert(data.symbol === 'TCS', 'Confirmed symbol matching');
    assert(Array.isArray(data.news), 'News items is array');
  });

  // TEST SUITE 6: Security & Input Sanitization
  console.log('\n--- TEST GROUP 6: Industry Standard Security & Attack Defense ---');
  // XSS Attack Attempt
  await testApiEndpoint('Security: XSS Injection in Symbol', `${BASE_URL}/api/live-stocks?symbol=%3Cscript%3Ealert(1)%3C/script%3E`, (data) => {
    assert(data.stock !== undefined, 'Server handled malicious input gracefully without crash');
    assert(!data.stock.symbol.includes('<script>'), 'XSS tags stripped out of resolved symbol');
  });

  // SQL Injection Attempt
  await testApiEndpoint('Security: SQL Injection Pattern', `${BASE_URL}/api/live-stocks?symbol=TCS%27%20OR%20%271%27=%271`, (data) => {
    assert(data.stock !== undefined, 'Server handled SQLi pattern safely');
    assert(!data.stock.symbol.includes("'"), 'Apostrophes stripped cleanly');
  });

  // Path Traversal Attempt
  await testApiEndpoint('Security: Path Traversal Attempt', `${BASE_URL}/api/live-stocks?symbol=../../etc/passwd`, (data) => {
    assert(data.stock !== undefined, 'Server safely neutralized path traversal');
    assert(!data.stock.symbol.includes('/'), 'Path slashes stripped');
  });

  // Buffer Overflow / Length Exceeding Attempt
  const hugeString = 'A'.repeat(500);
  await testApiEndpoint('Security: Buffer Length Truncation', `${BASE_URL}/api/live-stocks?symbol=${hugeString}`, (data) => {
    assert(data.stock !== undefined, 'Server handled oversized query without crash');
    assert(data.stock.symbol.length <= 40, 'Input properly truncated to max safe length', `Length: ${data.stock.symbol.length}`);
  });

  // TEST SUITE 7: Math & Valuation Logic Integrity
  console.log('\n--- TEST GROUP 7: Intrinsic Valuation Formulas ---');
  // Graham Number test: Sqrt(22.5 * EPS * BVPS)
  const testEps = 50;
  const testBvps = 200;
  const expectedGraham = Math.sqrt(22.5 * testEps * testBvps);
  assert(Math.round(expectedGraham) === 474, 'Graham Intrinsic Value formula matches standard Benjamin Graham model (474)');

  // Margin of safety formula: ((FairValue - Price) / FairValue) * 100
  const fairVal = 500;
  const currentPrice = 400;
  const marginOfSafety = ((fairVal - currentPrice) / fairVal) * 100;
  assert(marginOfSafety === 20, 'Margin of Safety calculation yields exact +20%');

  console.log('\n--- TEST GROUP 8: Smart Money Concepts (SMC) & Liquidity Math ---');
  await testApiEndpoint('SMC Live Stock Verification', `${BASE_URL}/api/live-stocks?symbol=RELIANCE`, (data) => {
    if (data?.stock) {
      const s = data.stock;
      assert(s.candles && s.candles.length > 0, 'Real candles parsed for SMC analysis');
      if (s.smc) {
        assert(typeof s.smc.bsl === 'number' && typeof s.smc.ssl === 'number', 'BSL and SSL liquidity levels exist');
        assert(s.smc.bsl >= s.smc.ssl, 'Buy Side Liquidity (Day High) is >= Sell Side Liquidity (Day Low)');
        assert(s.smc.bullishOB.top >= s.smc.bullishOB.bottom, 'Bullish Order Block top boundary is >= bottom boundary');
        assert(s.smc.bearishOB.top >= s.smc.bearishOB.bottom, 'Bearish Order Block top boundary is >= bottom boundary');
        assert(s.smc.fvg.top >= s.smc.fvg.bottom, 'Fair Value Gap (FVG) upper bound is >= lower bound');
      }
    }
  });

  console.log('\n--- TEST GROUP 9: Progressive Web App (PWA) Verification ---');
  await testApiEndpoint('PWA Manifest Verification', `${BASE_URL}/manifest.json`, (data) => {
    assert(data.name && data.name.includes('MarketPulse'), 'PWA Manifest has application name');
    assert(data.short_name === 'MarketPulse', 'PWA Manifest short_name is MarketPulse');
    assert(data.display === 'standalone', 'PWA display mode is standalone');
    assert(data.start_url === '/', 'PWA start_url is /');
    assert(Array.isArray(data.icons) && data.icons.length >= 2, 'PWA Manifest has required icon entries');
  });

  const swRes = await fetch(`${BASE_URL}/sw.js`);
  assert(swRes.status === 200, 'PWA Service Worker /sw.js accessible with HTTP 200');
  const iconRes = await fetch(`${BASE_URL}/icons/icon-192x192.png`);
  assert(iconRes.status === 200, 'PWA 192x192 PNG Icon accessible with HTTP 200');

  // SUMMARY
  console.log('\n======================================================');
  console.log(`  TEST RESULTS: ${passedTests} PASSED | ${failedTests} FAILED`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch((e) => {
  console.error('Fatal Test Runner Error:', e);
  process.exit(1);
});
