'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { INITIAL_AD_SLOTS } from '@hritikpedia/shared/data';

export default function AdSlot({
  slotId,
  className = '',
  customBanner = null,
}) {
  const isAdSenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
  const isDirectSponsorsEnabled = process.env.ENABLE_DIRECT_SPONSOR_ADS !== 'false';

  // Find slot configuration from the shared catalogue
  const slotConfig = INITIAL_AD_SLOTS.find((s) => s.id === slotId) || customBanner;

  if (!slotConfig || !slotConfig.active) {
    return null;
  }

  // AdSense placement (mounts Network tag when the account is approved)
  if (isAdSenseEnabled && slotConfig.type === 'adsense') {
    return (
      <div className={`w-full my-6 flex flex-col items-center ${className}`}>
        <span className="eyebrow-plain mb-1 text-[9px] text-muted">Advertisement</span>
        <div
          id={`ad-slot-${slotId}`}
          className="flex w-full max-w-4xl min-h-[90px] items-center justify-center border border-line bg-paper-2 text-[11px] text-muted"
        >
          <span>AdSense placement: {slotId}</span>
        </div>
      </div>
    );
  }

  // Direct sponsor placement
  if (isDirectSponsorsEnabled) {
    return (
      <div className={`w-full my-6 ${className}`}>
        <div className="relative overflow-hidden rounded-xl border border-ink bg-ink p-4 text-cream sm:p-5">
          <div className="absolute right-3 top-3 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white/45">
            <span className="h-1.5 w-1.5 bg-sun" aria-hidden="true"></span>
            <span>Sponsored</span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge border-sun/50 bg-sun/15 text-[#f0b9a2]">
                  {slotConfig.sponsorName || 'Featured'}
                </span>
                <h4 className="font-display text-[14px] font-extrabold text-cream sm:text-[15px]">
                  {slotConfig.title}
                </h4>
              </div>
              <p className="mt-1.5 max-w-2xl text-[12px] leading-relaxed text-white/60">
                {slotConfig.bannerText}
              </p>
            </div>

            <Link
              href={slotConfig.link || '/notes'}
              className="btn btn-outline-light btn-sm shrink-0"
            >
              <span>Explore resource</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
