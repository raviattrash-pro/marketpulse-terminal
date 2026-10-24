'use client';

import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Share2, PlusSquare, Check, X, Sparkles } from 'lucide-react';
import { soundEffects } from '@/lib/soundEffects';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaInstallButton({ variant = 'header' }: { variant?: 'header' | 'floating' | 'banner' }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    // 1. Check if running in standalone PWA mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();

    // 2. Check if iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 3. Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker active:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration warning:', err);
        });
    }

    // 4. Capture BeforeInstallPromptEvent for Android / Chrome / Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Detect app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    soundEffects.playSuccess();
    if (deferredPrompt) {
      // Android / Chrome / Edge native install prompt
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    } else if (isIos) {
      // iOS doesn't support programmatic prompt, show step-by-step modal
      setShowIosGuide(true);
    } else {
      // Desktop or unsupported browser
      setShowIosGuide(true);
    }
  };

  // If already running as standalone installed app, don't show prompt
  if (isStandalone || isInstalled) {
    if (variant === 'header') {
      return (
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span>App Installed</span>
        </div>
      );
    }
    return null;
  }

  // HEADER BUTTON VARIANT
  if (variant === 'header') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold p-1.5 sm:px-3 sm:py-1.5 rounded-xl shadow-xs transition-all duration-150 active:scale-[0.98] shrink-0 cursor-pointer border border-emerald-400/30 micro-press"
          title="Download MarketPulse App to Home Screen"
          aria-label="Download and Install App"
        >
          <Download className="w-3.5 h-3.5 text-emerald-100 animate-bounce" />
          <span className="hidden sm:inline">Install App</span>
        </button>

        {/* iOS / General Install Guide Modal */}
        {showIosGuide && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#0F172A] border border-slate-700 max-w-sm w-full rounded-3xl p-6 text-white space-y-4 shadow-2xl relative">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setShowIosGuide(false);
                }}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800 cursor-pointer"
                aria-label="Close install instructions"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-lg text-2xl font-black">
                  🌊
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Install MarketPulse</h3>
                  <p className="text-xs text-slate-400">Launch fullscreen with zero lag</p>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs font-sans">
                <div className="flex items-start gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-mono shrink-0">
                    1
                  </div>
                  <div className="text-slate-300 leading-relaxed">
                    {isIos ? (
                      <>
                        Tap the <strong className="text-indigo-400 flex items-center gap-1 inline-flex"><Share2 className="w-3.5 h-3.5" /> Share</strong> button in Safari toolbar.
                      </>
                    ) : (
                      <>
                        Tap the browser menu <strong className="text-indigo-400">⋮ (three dots)</strong> at top right.
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                    2
                  </div>
                  <div className="text-slate-300 leading-relaxed">
                    Select <strong className="text-emerald-400 flex items-center gap-1 inline-flex"><PlusSquare className="w-3.5 h-3.5" /> "Add to Home Screen"</strong> or <strong className="text-emerald-400">"Install App"</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold font-mono shrink-0">
                    3
                  </div>
                  <div className="text-slate-300 leading-relaxed">
                    Tap <strong className="text-white">Add</strong>. Open anytime directly from your phone screen like a native app!
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setShowIosGuide(false);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-bold text-xs hover:opacity-95 transition cursor-pointer shadow-md active:scale-[0.98] micro-press"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // FLOATING MOBILE BOTTOM BANNER VARIANT
  if (variant === 'banner' && !bannerDismissed) {
    return (
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#0F172A]/95 backdrop-blur-md border border-indigo-500/40 p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-300">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white shrink-0 text-lg shadow-sm">
            🌊
          </div>
          <div className="truncate">
            <span className="text-xs font-bold text-white block truncate">Install MarketPulse App</span>
            <span className="text-[10px] text-slate-400 block truncate">1-Tap Fast Launch on Home Screen</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition cursor-pointer"
            aria-label="Install MarketPulse application"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={() => setBannerDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            aria-label="Dismiss app install banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
