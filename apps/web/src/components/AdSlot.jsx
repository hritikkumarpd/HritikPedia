'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Sparkles } from 'lucide-react';
import { INITIAL_AD_SLOTS } from '@hritikpedia/shared/data';

export default function AdSlot({
  slotId,
  className = '',
  customBanner = null,
}) {
  const isAdSenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
  const isDirectSponsorsEnabled = process.env.ENABLE_DIRECT_SPONSOR_ADS !== 'false';

  // Find slot configuration from shared catalogue
  const slotConfig = INITIAL_AD_SLOTS.find((s) => s.id === slotId) || customBanner;

  if (!slotConfig || !slotConfig.active) {
    return null;
  }

  // If AdSense is active and approved
  if (isAdSenseEnabled && slotConfig.type === 'adsense') {
    return (
      <div className={`w-full my-6 flex flex-col items-center ${className}`}>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
          Advertisement
        </span>
        <div
          id={`ad-slot-${slotId}`}
          className="w-full max-w-4xl min-h-[90px] bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs"
        >
          {/* AdSense ins tag will mount here when account is approved */}
          <span>AdSense Placement: {slotId}</span>
        </div>
      </div>
    );
  }

  // Direct Sponsor / Educational Placement
  if (isDirectSponsorsEnabled) {
    return (
      <div className={`w-full my-6 ${className}`}>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#07172B] via-[#0B1D36] to-[#07172B] p-4 sm:p-5 text-white shadow-xs border border-blue-900/40">
          <div className="absolute top-2 right-3 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB923]"></span>
            <span>Sponsored Resource</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FFB923]/20 text-[#FFB923] rounded border border-[#FFB923]/40">
                  {slotConfig.sponsorName || 'Featured'}
                </span>
                <h4 className="font-bold text-sm sm:text-base text-white">
                  {slotConfig.title}
                </h4>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl">
                {slotConfig.bannerText}
              </p>
            </div>

            <Link
              href={slotConfig.link || '/notes'}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#087BFF] hover:bg-[#1688FF] text-white rounded-lg transition-colors shadow-xs"
            >
              <span>Explore Resource</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
