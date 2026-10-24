'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, PlusCircle, Trash2, CheckCircle2, XCircle, TrendingUp, TrendingDown, Award } from 'lucide-react';

export interface TradeRecord {
  id: string;
  date: string;
  symbol: string;
  type: 'BUY_EQUITY' | 'LONG_CALL' | 'LONG_PUT' | 'SHORT_CALL' | 'SHORT_PUT';
  setup: string;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  targetPrice: number;
  quantity: number;
  pnl: number;
  rrAchieved: number;
  followedRules: boolean;
  notes: string;
}

const STORAGE_KEY = 'trade_copilot_journal_v1';

export default function TradeJournal() {
  const [trades, setTrades] = useState<TradeRecord[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [symbol, setSymbol] = useState('RELIANCE');
  const [type, setType] = useState<TradeRecord['type']>('BUY_EQUITY');
  const [setup, setSetup] = useState('4-Filter Economic Moat');
  const [entryPrice, setEntryPrice] = useState(2950);
  const [exitPrice, setExitPrice] = useState(3180);
  const [stopLoss, setStopLoss] = useState(2860);
  const [targetPrice, setTargetPrice] = useState(3200);
  const [quantity, setQuantity] = useState(25);
  const [followedRules, setFollowedRules] = useState(true);
  const [notes, setNotes] = useState('Bought at 18% margin of safety. Held till target.');

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTrades(JSON.parse(stored));
      } else {
        // Initial sample seed trades showcasing discipline
        const sampleTrades: TradeRecord[] = [
          {
            id: '1',
            date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
            symbol: 'INFY',
            type: 'BUY_EQUITY',
            setup: 'Graham Fair Value Dip',
            entryPrice: 1480,
            exitPrice: 1560,
            stopLoss: 1430,
            targetPrice: 1580,
            quantity: 35,
            pnl: (1560 - 1480) * 35,
            rrAchieved: 1.6,
            followedRules: true,
            notes: 'Strong DuPont 31% RoE, bought below fair value. Stuck to plan.',
          },
          {
            id: '2',
            date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
            symbol: 'NIFTY 24800 CE',
            type: 'LONG_CALL',
            setup: 'OI PCR Bullish Reversal',
            entryPrice: 110,
            exitPrice: 165,
            stopLoss: 85,
            targetPrice: 160,
            quantity: 75,
            pnl: (165 - 110) * 75,
            rrAchieved: 2.2,
            followedRules: true,
            notes: 'Systematic 1:2 R:R achieved at morning open with PCR 1.35.',
          },
          {
            id: '3',
            date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
            symbol: 'TATAMOTORS',
            type: 'BUY_EQUITY',
            setup: 'Breakout Failure (Disciplined SL)',
            entryPrice: 990,
            exitPrice: 965,
            stopLoss: 965,
            targetPrice: 1040,
            quantity: 40,
            pnl: (965 - 990) * 40,
            rrAchieved: -1.0,
            followedRules: true,
            notes: 'Strict SL respected. Capital preserved within 1.5% rule.',
          },
        ];
        setTrades(sampleTrades);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTrades));
      }
    } catch {
      // LocalStorage error fallback
    }
  }, []);

  const saveTrades = (updated: TradeRecord[]) => {
    setTrades(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const riskPerShare = Math.abs(entryPrice - stopLoss) || 1;
    const rewardPerShare = exitPrice - entryPrice;
    const rr = Number((rewardPerShare / riskPerShare).toFixed(2));
    const pnl = (exitPrice - entryPrice) * quantity;

    const newRecord: TradeRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      symbol: symbol.toUpperCase(),
      type,
      setup,
      entryPrice,
      exitPrice,
      stopLoss,
      targetPrice,
      quantity,
      pnl,
      rrAchieved: rr,
      followedRules,
      notes,
    };

    const updated = [newRecord, ...trades];
    saveTrades(updated);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = trades.filter((t) => t.id !== id);
    saveTrades(updated);
  };

  // Metrics
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.pnl > 0);
  const winRate = totalTrades > 0 ? ((winningTrades.length / totalTrades) * 100).toFixed(1) : '0';
  const totalPnL = trades.reduce((acc, t) => acc + t.pnl, 0);
  const disciplineScore =
    totalTrades > 0
      ? ((trades.filter((t) => t.followedRules).length / totalTrades) * 100).toFixed(0)
      : '100';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-gray-900 to-indigo-950 border border-emerald-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              Risk Engineering &amp; Discipline Tracker
            </div>
            <h2 className="text-2xl font-bold text-white">Rule-Based Trade Journal</h2>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl">
              Log every execution with zero bias. Track strict adherence to 1–2% max risk, 1:2 R:R targets,
              and prevent revenge trading. Persisted automatically in your browser with zero backend required.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 transition-all text-sm shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            {showForm ? 'Cancel Entry' : 'Log New Trade'}
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
            <span className="text-gray-400 text-xs">Total Trades</span>
            <p className="text-2xl font-bold text-white mt-1">{totalTrades}</p>
            <span className="text-xs text-gray-500">All logged executions</span>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
            <span className="text-gray-400 text-xs">Win Rate</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{winRate}%</p>
            <span className="text-xs text-gray-500">{winningTrades.length} winners logged</span>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
            <span className="text-gray-400 text-xs">Cumulative Net P&L</span>
            <p className={`text-2xl font-bold mt-1 ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalPnL >= 0 ? `+₹${totalPnL.toLocaleString('en-IN')}` : `-₹${Math.abs(totalPnL).toLocaleString('en-IN')}`}
            </p>
            <span className="text-xs text-gray-500">Realized gross result</span>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
            <span className="text-gray-400 text-xs">Rule Adherence</span>
            <div className="flex items-center gap-2 mt-1">
              <Award className="w-5 h-5 text-amber-400" />
              <p className="text-2xl font-bold text-amber-400">{disciplineScore}%</p>
            </div>
            <span className="text-xs text-gray-500">SL & 1:2 R:R respected</span>
          </div>
        </div>
      </div>

      {/* Log Trade Modal/Collapsible Form */}
      {showForm && (
        <form
          onSubmit={handleAddTrade}
          className="bg-gray-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" /> Record Executed Trade
            </h3>
            <span className="text-xs text-gray-400">Strictly following trading plan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-300 block mb-1">Stock / Instrument</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                required
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">Trade Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TradeRecord['type'])}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="BUY_EQUITY">Delivery Equity (Graham / Economic Moat)</option>
                <option value="LONG_CALL">Long Call Option</option>
                <option value="LONG_PUT">Long Put Option</option>
                <option value="SHORT_CALL">Short Call Option</option>
                <option value="SHORT_PUT">Short Put Option</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">Trading Framework / Setup</label>
              <select
                value={setup}
                onChange={(e) => setSetup(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="4-Filter Economic Moat">4-Filter Economic Moat</option>
                <option value="Graham Fair Value Dip">Graham Fair Value Dip (20% MoS)</option>
                <option value="OI PCR Bullish Reversal">OI PCR Bullish Reversal</option>
                <option value="OI Resistance Rejection">OI Resistance Rejection</option>
                <option value="DuPont 20%+ Breakout">DuPont 20%+ Breakout</option>
                <option value="Option Spread Strategy">Option Spread Strategy (Iron Condor)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">Entry Price (₹)</label>
              <input
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                required
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">Exit Price (₹)</label>
              <input
                type="number"
                step="any"
                value={exitPrice}
                onChange={(e) => setExitPrice(Number(e.target.value))}
                required
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">Quantity / Lot Units</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">Stop-Loss Target (₹)</label>
              <input
                type="number"
                step="any"
                value={stopLoss}
                onChange={(e) => setStopLoss(Number(e.target.value))}
                required
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">Target Price (₹)</label>
              <input
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                required
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="followedRules"
                checked={followedRules}
                onChange={(e) => setFollowedRules(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <label htmlFor="followedRules" className="text-xs text-gray-200 cursor-pointer">
                Strictly respected Stop-Loss & Pre-trade Checklist
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Execution Notes & Lessons Learned</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What went well? Any emotional urges or slippage?"
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              Save to Local Journal
            </button>
          </div>
        </form>
      )}

      {/* Trades Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">Execution History</h3>
          <span className="text-xs text-gray-500">Stored in browser LocalStorage</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-950/60 text-xs uppercase text-gray-400 border-b border-gray-800">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Instrument</th>
                <th className="px-4 py-3">Setup</th>
                <th className="px-4 py-3">Entry / Exit</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">P&L (₹)</th>
                <th className="px-4 py-3">R:R</th>
                <th className="px-4 py-3">Rule Discipline</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500 text-sm">
                    No trades logged yet. Click &quot;Log New Trade&quot; to begin your disciplined trading journey.
                  </td>
                </tr>
              ) : (
                trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-400">{trade.date}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{trade.symbol}</div>
                      <span className="text-[10px] text-gray-400">{trade.type}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-indigo-300">{trade.setup}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="text-gray-300">₹{trade.entryPrice}</span> &rarr;{' '}
                      <span className="text-white font-medium">₹{trade.exitPrice}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-300">{trade.quantity}</td>
                    <td className="px-4 py-3">
                      <div
                        className={`inline-flex items-center gap-1 font-semibold text-xs ${
                          trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {trade.pnl >= 0 ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {trade.pnl >= 0 ? `+₹${trade.pnl.toLocaleString('en-IN')}` : `-₹${Math.abs(trade.pnl).toLocaleString('en-IN')}`}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                          trade.rrAchieved >= 2
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : trade.rrAchieved > 0
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {trade.rrAchieved >= 0 ? `1:${trade.rrAchieved}` : `${trade.rrAchieved}R`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {trade.followedRules ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Followed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> Broken
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-[200px] truncate" title={trade.notes}>
                      {trade.notes || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(trade.id)}
                        className="text-gray-500 hover:text-red-400 p-1 rounded transition-colors"
                        title="Delete trade"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
