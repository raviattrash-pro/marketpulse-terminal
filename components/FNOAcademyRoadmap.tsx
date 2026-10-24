'use client';

import React, { useState } from 'react';
import { GraduationCap, BookOpen, CheckCircle2, ChevronRight, PlayCircle, HelpCircle, Award } from 'lucide-react';

interface ClassItem {
  num: number;
  title: string;
  slides: number;
  quizQuestions: number;
  duration: string;
  category: 'LEVEL 1' | 'LEVEL 2';
  summary: string;
}

export default function FNOAcademyRoadmap() {
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [completedClasses, setCompletedClasses] = useState<number[]>([1]);

  const classes: ClassItem[] = [
    {
      num: 1,
      title: 'Derivatives: What are they and why trade them?',
      slides: 8,
      quizQuestions: 5,
      duration: '5 min',
      category: 'LEVEL 1',
      summary:
        'A derivative is a financial contract whose value is derived from an underlying asset (like NIFTY, Reliance, or Gold). Instead of buying the physical asset, you trade rights and obligations with leveraged capital.',
    },
    {
      num: 2,
      title: 'Futures Contracts, Margins & Daily MTM Settlement',
      slides: 10,
      quizQuestions: 5,
      duration: '8 min',
      category: 'LEVEL 1',
      summary:
        'Futures commit both parties to buy/sell at an agreed price. Exchanges enforce initial margin and perform Mark-to-Market (MTM) daily. If balance drops below maintenance margin, margin call triggers.',
    },
    {
      num: 3,
      title: 'Call Options: Right to Buy & Asymmetric Upside',
      slides: 9,
      quizQuestions: 5,
      duration: '6 min',
      category: 'LEVEL 1',
      summary:
        'A Call Option (CE) gives the buyer the right, but not the obligation, to buy an underlying at the strike price. Maximum loss for buyer is premium paid; seller has capped profit and theoretically unlimited risk.',
    },
    {
      num: 4,
      title: 'Put Options: Downside Insurance & Shorting Stocks',
      slides: 9,
      quizQuestions: 5,
      duration: '6 min',
      category: 'LEVEL 1',
      summary:
        'A Put Option (PE) gives the buyer the right to sell the underlying. Used by institutions to insure portfolios during crashes and by speculators to bet on stock breakdowns.',
    },
    {
      num: 5,
      title: 'Option Premium: Intrinsic Value vs Time Value (Extrinsic)',
      slides: 11,
      quizQuestions: 5,
      duration: '8 min',
      category: 'LEVEL 1',
      summary:
        'Option Premium = Intrinsic Value (moneyness) + Extrinsic Value (Theta time + Vega volatility). ATM and OTM options consist of 100% time value, which relentlessly decays to zero by expiry 3:30 PM.',
    },
    {
      num: 6,
      title: 'The Option Chain Explained: Strikes, Moneyness & Volumes',
      slides: 9,
      quizQuestions: 5,
      duration: '7 min',
      category: 'LEVEL 2',
      summary:
        'Understanding ITM, ATM, and OTM strikes. Learning why trading deep OTM options is mathematically rigged against retail traders due to negative expected value.',
    },
    {
      num: 7,
      title: 'Open Interest (OI) & Change in OI: The 4 Quadrants',
      slides: 9,
      quizQuestions: 5,
      duration: '8 min',
      category: 'LEVEL 2',
      summary:
        'Volume measures executed handoffs; OI tracks active open contracts. Long Buildup, Short Buildup, Short Covering, and Long Unwinding tell you where the institutional smart money is placing its capital.',
    },
    {
      num: 8,
      title: 'PCR (Put-Call Ratio) & Max Pain: Where Market Makers Win',
      slides: 9,
      quizQuestions: 5,
      duration: '7 min',
      category: 'LEVEL 2',
      summary:
        'The Max Pain theory dictates that on expiry day, stock prices tend to gravitate toward the strike price where option buyers lose the maximum amount of money and option sellers reap the maximum profit.',
    },
    {
      num: 9,
      title: 'Implied Volatility (IV), India VIX & Theta Time Decay',
      slides: 9,
      quizQuestions: 5,
      duration: '9 min',
      category: 'LEVEL 2',
      summary:
        'High IV makes option buying expensive ("Mehenga"). Low IV makes option buying cheap ("Sasta"). Learn how Theta acceleration in expiry week eats away premiums exponentially.',
    },
    {
      num: 10,
      title: 'The Greeks Made Visual: Delta, Gamma, Theta, Vega',
      slides: 12,
      quizQuestions: 5,
      duration: '10 min',
      category: 'LEVEL 2',
      summary:
        'Delta measures sensitivity to spot price. Gamma measures acceleration of Delta. Theta measures daily decay. Vega measures sensitivity to volatility shifts. Never trade without knowing your portfolio Greeks.',
    },
  ];

  const currentClass = classes.find((c) => c.num === activeLesson) || classes[0];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans p-4 md:p-6 select-none">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Top Header Banner (From Reel) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-xs font-mono font-bold text-[#4F46E5]">
                {completedClasses.length}/12 CLASSES
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">F&O Academy</h1>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Learn futures & options from zero. Animated classes with plain-English explanations, worked rupee examples, real-life scenarios, a 5-question quiz and printable class notes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Total Progress:</span>
            <span className="text-lg font-mono font-bold text-emerald-600">
              {Math.round((completedClasses.length / 12) * 100)}%
            </span>
          </div>
        </div>

        {/* Duolingo / Learning Roadmap (From Reel) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-6">
            Interactive Learning Journey
          </div>

          {/* S-curve Connected Roadmap Nodes */}
          <div className="relative py-8 overflow-x-auto no-scrollbar">
            {/* Connecting Curving Line */}
            <div className="absolute top-1/2 left-10 right-10 h-1 bg-slate-200 -translate-y-1/2 z-0 hidden md:block"></div>

            <div className="flex items-center justify-between min-w-[850px] relative z-10 px-4">
              {classes.slice(0, 7).map((c) => {
                const isActive = activeLesson === c.num;
                const isCompleted = completedClasses.includes(c.num);

                return (
                  <div
                    key={c.num}
                    onClick={() => setActiveLesson(c.num)}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    {/* Circle Node */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-base font-mono transition-all shadow-sm ${
                        isActive
                          ? 'bg-[#4F46E5] text-white ring-4 ring-indigo-200 scale-110'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-slate-400 border-2 border-slate-300 group-hover:border-indigo-400'
                      }`}
                    >
                      {isCompleted && !isActive ? '✓' : c.num}
                    </div>

                    {/* Step Title Label */}
                    <span
                      className={`text-[11px] font-bold mt-2.5 max-w-[90px] text-center leading-tight transition-colors ${
                        isActive ? 'text-[#4F46E5]' : 'text-slate-600 group-hover:text-slate-900'
                      }`}
                    >
                      {c.title.split(':')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Lesson Viewer Card */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wider block">
                  {currentClass.category} · CLASS {currentClass.num}
                </span>
                <h2 className="text-lg font-bold text-slate-900">{currentClass.title}</h2>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                {currentClass.slides} slides · {currentClass.duration}
              </span>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed space-y-3 font-sans">
              <p className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
                {currentClass.summary}
              </p>

              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 space-y-2">
                <span className="font-bold flex items-center gap-1.5 text-[#4F46E5]">
                  <Award className="w-4 h-4" />
                  Key Rule to Remember:
                </span>
                <p>
                  Never trade options with money you cannot afford to lose. As an option buyer, the statistical odds favor the seller unless you enter at high-probability confluence zones.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => {
                  if (!completedClasses.includes(currentClass.num)) {
                    setCompletedClasses([...completedClasses, currentClass.num]);
                  }
                  if (currentClass.num < classes.length) {
                    setActiveLesson(currentClass.num + 1);
                  }
                }}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
              >
                <span>Complete Class & Take Quiz</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="text-xs text-slate-400 font-mono">
                {currentClass.quizQuestions} multiple choice questions
              </span>
            </div>
          </div>

          {/* All Classes List Panel (Right) */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block pb-2">
              Course Curriculum
            </span>

            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {classes.map((c) => {
                const isActive = activeLesson === c.num;
                const isCompleted = completedClasses.includes(c.num);

                return (
                  <div
                    key={c.num}
                    onClick={() => setActiveLesson(c.num)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-xs ${
                      isActive
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : isActive
                            ? 'bg-[#4F46E5] text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCompleted ? '✓' : c.num}
                      </span>
                      <span className="truncate max-w-[200px]">{c.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{c.duration}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
