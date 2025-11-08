"use client";

import React from "react";
import CapabilitiesPill from "@/components/hero/CapabilitiesPill";
import CapsuleWave from "@/components/hero/CapsuleWave";

const HeroLarge: React.FC = () => {
  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-12">
      <div className="relative z-10 mx-auto max-w-screen-sm text-center">
        <p className="inline-flex items-center rounded-full bg-white/40 px-3 py-1 text-xs font-semibold tracking-wider text-slate-600 backdrop-blur ring-1 ring-white/50">
          CREATIVE AGENCY
        </p>

        <h1 className="mt-3 text-[44px] font-bold leading-[1.03] tracking-tight text-slate-900 md:text-[72px]">
          <span className="text-slate-900">Intelligent Tech</span>{" "}
          <span className="text-blue-600">for Tomorrow.</span>
        </h1>

        <p className="mt-3 text-sm font-medium uppercase tracking-[0.4em] text-slate-700 md:text-base">
          Edge Compute. Realtime Dashboards. Autonomous Agents. Security.
        </p>

        <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
          We build high-performance web, mobile, and AI products that combine
          creativity, code, and strategy to move businesses forward.
        </p>

        <div className="mt-6">
          <CapabilitiesPill
            items={[
              "Custom Website Development",
              "Realtime Dashboards",
              "Autonomous Agents",
              "Edge Computing",
              "Security Engineering",
            ]}
            speed={44}
          />
        </div>

        <div className="mt-4">
          <CapsuleWave className="w-full" height={84} waves={2} amplitude={12} />
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full rounded-full bg-blue-600 py-3 text-base font-semibold text-white shadow-lg transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Start Your Project →
          </button>
          <button className="w-full rounded-full bg-white/85 py-3 text-base font-medium text-slate-700 backdrop-blur transition ring-1 ring-slate-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400">
            See Our Work
          </button>
          <p className="text-xs text-slate-500">
            Reply within 24 hours. NDA available.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroLarge;

