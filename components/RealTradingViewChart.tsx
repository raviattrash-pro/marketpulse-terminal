'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CrosshairMode, LineStyle, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { CandleItem } from '@/app/api/live-stocks/route';

interface RealTradingViewChartProps {
  symbol: string;
  name?: string;
  exchange?: string;
  currency?: string;
  candles: CandleItem[];
  bullishOB?: { top: number; bottom: number; label: string };
  bearishOB?: { top: number; bottom: number; label: string };
  bsl?: number;
  ssl?: number;
  target?: number;
  stopLoss?: number;
  height?: number;
}

export default function RealTradingViewChart({
  symbol,
  name,
  exchange = 'NSE',
  currency = '₹',
  candles,
  bullishOB,
  bearishOB,
  bsl,
  ssl,
  target,
  stopLoss,
  height = 500,
}: RealTradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<any>(null);
  const [hoverInfo, setHoverInfo] = useState<{
    time?: string;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    volume?: number;
    changePct?: number;
  } | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }

    const container = chartContainerRef.current;
    const chart = createChart(container, {
      width: container.clientWidth || 800,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: '#090D13' },
        textColor: '#94A3B8',
        fontFamily: 'monospace, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(30, 41, 59, 0.6)' },
        horzLines: { color: 'rgba(30, 41, 59, 0.6)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#6366F1',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#4F46E5',
        },
        horzLine: {
          color: '#6366F1',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#4F46E5',
        },
      },
      rightPriceScale: {
        borderColor: '#1E293B',
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderColor: '#1E293B',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartInstanceRef.current = chart;

    // Add Candlestick Series (TradingView Engine v5)
    let candleSeries: any;
    try {
      candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#10B981',
        downColor: '#EF4444',
        borderVisible: false,
        wickUpColor: '#10B981',
        wickDownColor: '#EF4444',
      });
    } catch (e) {
      // Fallback
    }

    // Add Volume Histogram Series
    let volumeSeries: any;
    try {
      volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // Overlay
      });
      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.82,
          bottom: 0,
        },
      });
    } catch (e) {
      // Fallback
    }

    // Process and format real candles
    if (candles && candles.length > 0) {
      const uniqueCandles: any[] = [];
      const volumeData: any[] = [];
      const seen = new Set<number>();

      const sorted = [...candles].sort((a, b) => a.timestamp - b.timestamp);

      for (const c of sorted) {
        const t = Math.floor(c.timestamp);
        if (!seen.has(t)) {
          seen.add(t);
          uniqueCandles.push({
            time: t as any,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          });

          volumeData.push({
            time: t as any,
            value: c.volume || 1000,
            color: c.close >= c.open ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)',
          });
        }
      }

      if (candleSeries && uniqueCandles.length > 0) {
        candleSeries.setData(uniqueCandles);
        chart.timeScale().fitContent();

        // Default hover info to latest candle
        const latest = uniqueCandles[uniqueCandles.length - 1];
        const prev = uniqueCandles.length > 1 ? uniqueCandles[uniqueCandles.length - 2] : latest;
        const chg = Number((((latest.close - prev.close) / prev.close) * 100).toFixed(2));
        setHoverInfo({
          open: latest.open,
          high: latest.high,
          low: latest.low,
          close: latest.close,
          volume: volumeData[volumeData.length - 1]?.value,
          changePct: chg,
        });
      }

      if (volumeSeries && volumeData.length > 0) {
        volumeSeries.setData(volumeData);
      }
    }

    // Overlay Real Order Block Lines & Liquidity Target Lines
    if (candleSeries) {
      // Bullish OB (Floor)
      if (bullishOB) {
        candleSeries.createPriceLine({
          price: bullishOB.top,
          color: '#22C55E',
          lineWidth: 2,
          lineStyle: LineStyle.Solid,
          axisLabelVisible: true,
          title: `DEMAND OB: ${currency}${bullishOB.top}`,
        });
      }

      // Bearish OB (Ceiling)
      if (bearishOB) {
        candleSeries.createPriceLine({
          price: bearishOB.bottom,
          color: '#EF4444',
          lineWidth: 2,
          lineStyle: LineStyle.Solid,
          axisLabelVisible: true,
          title: `SUPPLY OB: ${currency}${bearishOB.bottom}`,
        });
      }

      // Buy Side Liquidity (BSL / Target)
      if (target || bsl) {
        const tVal = target || bsl;
        if (tVal) {
          candleSeries.createPriceLine({
            price: tVal,
            color: '#F59E0B',
            lineWidth: 1.5,
            lineStyle: LineStyle.Dashed,
            axisLabelVisible: true,
            title: `BSL TARGET: ${currency}${tVal}`,
          });
        }
      }

      // Stop Loss / SSL
      if (stopLoss || ssl) {
        const sVal = stopLoss || ssl;
        if (sVal) {
          candleSeries.createPriceLine({
            price: sVal,
            color: '#DC2626',
            lineWidth: 1.5,
            lineStyle: LineStyle.Dashed,
            axisLabelVisible: true,
            title: `STOP LOSS: ${currency}${sVal}`,
          });
        }
      }
    }

    // Interactive Crosshair Subscription
    chart.subscribeCrosshairMove((param: any) => {
      if (!param || !param.time || !candleSeries) {
        return;
      }
      const data = param.seriesData.get(candleSeries);
      if (data) {
        const dt = new Date((param.time as number) * 1000);
        const timeStr = dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
        const chg = Number((((data.close - data.open) / data.open) * 100).toFixed(2));
        setHoverInfo({
          time: timeStr,
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close,
          changePct: chg,
        });
      }
    });

    const handleResize = () => {
      if (container && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: container.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [symbol, exchange, candles, bullishOB, bearishOB, bsl, ssl, target, stopLoss, height]);

  const latestCandle = candles[candles.length - 1];

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#1E293B] bg-[#090D13]">
      {/* Floating Real-Time OHLC Bar (Exact TradingView Terminal Header) */}
      <div className="absolute top-2.5 left-3 z-10 flex items-center gap-2 sm:gap-4 font-mono text-[11px] sm:text-xs bg-[#0D1117]/90 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-xs flex-wrap">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{exchange}:{symbol}</span>
          {hoverInfo?.time && <span className="text-slate-400 text-[10px]">({hoverInfo.time})</span>}
        </div>

        {hoverInfo ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <span>O: <strong className="text-slate-200">{currency}{hoverInfo.open}</strong></span>
            <span>H: <strong className="text-emerald-400">{currency}{hoverInfo.high}</strong></span>
            <span>L: <strong className="text-rose-400">{currency}{hoverInfo.low}</strong></span>
            <span>C: <strong className={hoverInfo.close && hoverInfo.open && hoverInfo.close >= hoverInfo.open ? 'text-emerald-400' : 'text-rose-400'}>{currency}{hoverInfo.close}</strong></span>
            {hoverInfo.changePct !== undefined && (
              <span className={`px-1.5 py-0.2 rounded font-bold ${hoverInfo.changePct >= 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                {hoverInfo.changePct >= 0 ? `+${hoverInfo.changePct}%` : `${hoverInfo.changePct}%`}
              </span>
            )}
          </div>
        ) : latestCandle ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <span>O: <strong className="text-slate-200">{currency}{latestCandle.open}</strong></span>
            <span>H: <strong className="text-emerald-400">{currency}{latestCandle.high}</strong></span>
            <span>L: <strong className="text-rose-400">{currency}{latestCandle.low}</strong></span>
            <span>C: <strong className="text-emerald-400">{currency}{latestCandle.close}</strong></span>
          </div>
        ) : null}
      </div>

      {/* TradingView Powered Canvas Container */}
      <div ref={chartContainerRef} className="w-full" style={{ height: `${height}px` }} />

      {/* Bottom Status Watermark */}
      <div className="absolute bottom-2 left-3 z-10 text-[10px] font-mono text-slate-500 pointer-events-none flex items-center gap-2">
        <span className="text-emerald-400 font-bold">● TradingView Core Engine</span>
        <span>·</span>
        <span>Real Exchange Intraday Ticks ({candles.length} candles)</span>
      </div>
    </div>
  );
}
